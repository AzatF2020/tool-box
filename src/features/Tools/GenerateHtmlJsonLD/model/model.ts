import formatHTML from '@/shared/lib/helpers/formatHtml';

interface IHTMLJsonLDGenerator {
  formatFromJsonToString: (jsonValue: string) => string;
  recursiveTraversalJson: (jsonValue: any, depth: number) => any;
  generateHTMLFromJson: (jsonValue: any) => string;
  increaseDepth: (value: number) => number;
}

class HTMLJsonLDGenerator implements IHTMLJsonLDGenerator {
  public jsonLdKeysMap: { [keyof: string]: string };

  public keysExclude: { [keyof: string]: boolean };

  private parser: InstanceType<typeof DOMParser>;

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

  protected createStructureByKey(key = '', value = '') {
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
          text: this.parser.parseFromString(value, 'text/html').body
            .textContent,
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

  protected generateHTMLFromJson(value) {
    const CONTAINER = document.createElement('div');

    const generate = (jsonValue, parentElement: HTMLElement): void => {
      const element = document.createElement(jsonValue?.tag);

      if (jsonValue?.text) {
        element.textContent = jsonValue.text;
      }

      if (jsonValue?.attributes) {
        Object.entries(jsonValue?.attributes).forEach(
          ([attributeKey, attributeValue]) => {
            element.setAttribute(attributeKey, attributeValue);
          },
        );
      }

      parentElement.appendChild(element);

      Object.keys(jsonValue).forEach((key) => {
        if (key === 'children' && Array.isArray(jsonValue[key])) {
          jsonValue[key].forEach((child) => {
            generate(child, element);
          });
        }
      });
    };

    generate(value, CONTAINER);

    const result = this.parser.parseFromString(CONTAINER.innerHTML, 'text/html')
      .body.children[0];

    CONTAINER.remove();

    return result;
  }

  public increaseDepth(value: number): number {
    return value + 1;
  }

  protected recursiveTraversalJson(
    jsonValue: any,
    depth = 0,
    options: { [keyof: string]: any } = {},
  ) {
    const DEPTH_INCREMENT = this.increaseDepth(depth);

    return Object.entries(jsonValue).reduce(
      (acc, [key, value]) => {
        //  Инициализация контейнера
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
          acc.children = [
            ...acc.children,
            {
              attributes: {
                itemprop: key,
                itemscope: '',
                ...(value['@type'] && {
                  itemtype: `${options.context}/${value['@type']}`,
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

        // Если элемент value - строка в структуре jsonValue
        if (
          ['string', 'number'].includes(typeof value) &&
          !(key in this.keysExclude)
        ) {
          acc.children = [
            ...acc.children,
            this.createStructureByKey(key, value),
          ];
        }

        return acc;
      },
      { children: [] },
    );
  }

  public formatFromJsonToString(jsonValue: string): string {
    const json = JSON.parse(jsonValue ?? '');

    const JSON_HTML_RESULT = this.recursiveTraversalJson(json, 0, {
      context: json['@context'],
      generalType: json['@type'],
    });

    return formatHTML(this.generateHTMLFromJson(JSON_HTML_RESULT).outerHTML);
  }
}

export default new HTMLJsonLDGenerator();
