class HTMLJsonLDGenerator {
  public jsonLdKeysMap: { [keyof: string]: string };

  constructor() {
    this.jsonLdKeysMap = {
      name: 'name',
      text: 'text',
      url: 'url',
      date: 'date',
      dateModified: 'dateModified',
      datePublished: 'datePublished',
      headline: 'headline',
    };
  }

  protected createStructureByKey(key = '', value = '') {
    switch (key) {
      case this.jsonLdKeysMap.headline:
        return {
          tag: 'h1',
          text: value,
        }
      case this.jsonLdKeysMap.name:
        return {
          tag: 'span',
          text: value,
          attributes: { itemprop: key },
        }
      case this.jsonLdKeysMap.url:
        return {
          tag: 'a',
          text: value,
          attributes: { href: value },
        }
      case this.jsonLdKeysMap.dateModified:
        return {
          tag: 'time',
          text: value,
          attributes: { itemprop: key, datetime: value },
        }  
      case this.jsonLdKeysMap.datePublished:
        return {
          tag: 'time',
          text: value,
          attributes: { itemprop: key, datetime: value },
        }  
      default: 
        return {
          tag: 'span',
          text: value,
        }  
    }
  }

  protected formatObjectJsonLdHtml(jsonValue: any) {
    return Object.entries(jsonValue)
    .filter(([key, _]) => {
      return key in this.jsonLdKeysMap;
    })
    .map(([key, value]) => this.createStructureByKey(key, value));
  }

  protected generateHTMLFromJson(value) {
    
  }

  protected recursiveTraversalJson(
    jsonValue: any,
    level = 0,
  ) {
    level += 1
    
    return Object.entries(jsonValue).reduce((acc: any, [key, value]) => {
      acc = { children: [], attributes: {}, tag: 'div', ...acc };

      if (level === 1) {
        acc = {
          ...acc,
          tag: 'div',
          attributes: { class: 'container', itemscope: true },
        };
      }

      if (!Array.isArray(value) && typeof value !== 'object' && level === 1) {
        acc.children = [
          ...acc.children,
          this.createStructureByKey(key, value)
        ]
      }

        if (Array.isArray(value)) {
        value.forEach((item: any) => {
          acc.children = [
            ...acc.children,
            {
              key,
              attributes: { itemscope: true },
              tag: 'div',
              children: this.recursiveTraversalJson(item, level),
            }
          ];
        });
      } else if (typeof value === 'object') {
        acc = {
          ...acc,
          children: [
            ...acc.children,
            {
              key,
              tag: 'div',
              children: this.recursiveTraversalJson(value, level),
            }
          ]
        }
      } else if (typeof jsonValue === 'object') {
        acc = { ...acc, children: this.formatObjectJsonLdHtml(jsonValue) }
      }

      return acc;
    }, { children: [], attributes: {}, tag: 'div' });
  }

  public formatFromJsonToString(jsonValue: string): string {
    const json = JSON.parse(jsonValue ?? '');

    const result = this.recursiveTraversalJson(json, 0);
    return '';
  }
}

export default new HTMLJsonLDGenerator();
