'use client';

import formatHTML from '@/shared/lib/helpers/formatHtml';

interface IHTMLJsonLDGenerator {
  formatFromJsonToString: (jsonValue: string) => string;
  recursiveTraversalJson: (
    jsonValue: any,
    depth: number,
    options?: { [key: string]: any },
  ) => any;
  generateHTMLFromJson: (jsonValue: any) => HTMLElement;
  increaseDepth: (value: number) => number;
}

class HTMLJsonLDGenerator implements IHTMLJsonLDGenerator {
  public jsonLdKeysMap: { [key: string]: string };

  public keysExclude: { [key: string]: boolean };

  private parser: DOMParser;

  constructor() {
    this.parser = new DOMParser();

    this.jsonLdKeysMap = {
      name: 'name',
      text: 'text',
      url: 'url',
      date: 'date',
      dateModified: 'dateModified',
      datePublished: 'datePublished',
      headline: 'headline',
      image: 'image',
    };

    this.keysExclude = {
      '@context': true,
      '@type': true,
      '@id': true,
      '@graph': true,
    };
  }

  protected createStructureByKey(
    key: string = '',
    value: string = '',
  ): { tag: string; text?: string; attributes?: { [key: string]: string } } {
    switch (key) {
      case this.jsonLdKeysMap.headline:
        return {
          tag: 'h1',
          text: value,
        };
      case this.jsonLdKeysMap.name:
        return {
          tag: 'span',
          text: value,
          attributes: { itemprop: key },
        };
      case this.jsonLdKeysMap.text:
        return {
          tag: 'p',
          text:
            this.parser.parseFromString(value, 'text/html').body.textContent ||
            '',
          attributes: { itemprop: key },
        };
      case this.jsonLdKeysMap.url:
        return {
          tag: 'a',
          text: value,
          attributes: { href: value },
        };
      case this.jsonLdKeysMap.dateModified:
        return {
          tag: 'time',
          text: value,
          attributes: { itemprop: key, datetime: value },
        };
      case this.jsonLdKeysMap.datePublished:
        return {
          tag: 'time',
          text: value,
          attributes: { itemprop: key, datetime: value },
        };
      case this.jsonLdKeysMap.image:
        return {
          tag: 'img',
          text: value,
          attributes: { itemprop: key, src: value, alt: 'image' },
        };
      default:
        return {
          tag: 'span',
          text: value,
          attributes: { itemprop: key },
        };
    }
  }

  public generateHTMLFromJson(value: any): HTMLElement {
    const CONTAINER = document.createElement('div');

    const generate = (jsonValue: any, parentElement: HTMLElement): void => {
      const element = document.createElement(jsonValue?.tag);

      if (jsonValue?.text) {
        element.textContent = jsonValue.text;
      }

      if (jsonValue?.attributes) {
        Object.entries(jsonValue.attributes).forEach(
          ([attributeKey, attributeValue]) => {
            element.setAttribute(attributeKey, attributeValue as string);
          },
        );
      }

      parentElement.appendChild(element);

      Object.keys(jsonValue).forEach((key) => {
        if (key === 'children' && Array.isArray(jsonValue[key])) {
          jsonValue[key].forEach((child: any) => {
            generate(child, element);
          });
        }
      });
    };

    generate(value, CONTAINER);

    const result = this.parser.parseFromString(CONTAINER.innerHTML, 'text/html')
      .body.children[0] as HTMLElement;

    CONTAINER.remove();

    return result;
  }

  public increaseDepth(value: number): number {
    return value + 1;
  }

  public recursiveTraversalJson(
    jsonValue: any,
    depth: number = 0,
    options: { [key: string]: any } = {},
  ): {
    children: any[];
    tag?: string;
    key?: string;
    attributes?: { [key: string]: string };
  } {
    const DEPTH_INCREMENT = this.increaseDepth(depth);

    return Object.entries(jsonValue).reduce(
      (
        acc: {
          children: any[];
          tag?: string;
          key?: string;
          attributes?: { [key: string]: string };
        },
        [key, value],
      ) => {
        // Инициализация контейнера
        if (DEPTH_INCREMENT === 1) {
          acc = {
            children: [...acc.children],
            tag: 'div',
            key: 'container',
            attributes: {
              class: 'container',
              itemscope: '',
              itemtype: `${options.context}/${options.generalType}`,
            },
          };
        }

        if (Array.isArray(value)) {
          acc.children = [
            ...acc.children,
            ...value.map((item) => ({
              tag: 'div',
              attributes: {
                itemprop: key,
                itemscope: '',
                ...(item['@type'] && {
                  itemtype: `${options.context}/${item['@type']}`,
                }),
              },
              children: this.recursiveTraversalJson(
                item,
                DEPTH_INCREMENT,
                options,
              ).children,
            })),
          ];
        }

        // Если элемент value - объект в структуре jsonValue
        if (typeof value === 'object' && !Array.isArray(value)) {
          const typedValue = value as { '@type': string };
          acc.children = [
            ...acc.children,
            {
              attributes: {
                itemprop: key,
                itemscope: '',
                ...(typedValue['@type'] && {
                  itemtype: `${options.context}/${typedValue['@type']}`,
                }),
              },
              tag: 'div',
              children: this.recursiveTraversalJson(
                value,
                DEPTH_INCREMENT,
                options,
              ).children,
            },
          ];
        }

        // Если элемент value - строка/число в структуре jsonValue
        if (
          ['string', 'number'].includes(typeof value) &&
          !(key in this.keysExclude)
        ) {
          acc.children = [
            ...acc.children,
            this.createStructureByKey(key, value!.toString()),
          ];
        }

        return acc;
      },
      { children: [] },
    );
  }

  public formatFromJsonToString(jsonValue: string): string {
    const json = JSON.parse(jsonValue ?? '{}');

    const JSON_HTML_RESULT = this.recursiveTraversalJson(json, 0, {
      context: json['@context'],
      generalType: json['@type'],
    });

    return formatHTML(this.generateHTMLFromJson(JSON_HTML_RESULT).outerHTML);
  }
}

export default HTMLJsonLDGenerator;
