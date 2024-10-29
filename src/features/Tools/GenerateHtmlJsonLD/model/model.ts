class HTMLJsonLDGenerator {
  public jsonLdKeysMap: { [keyof: string]: string };

  constructor() {
    this.jsonLdKeysMap = {
      name: 'name',
      text: 'text',
    };
  }

  public recursiveTraversalJson(
    jsonValue: any,
    jsonLdMap = this.jsonLdKeysMap,
  ) {
    return Object.entries(jsonValue).reduce(
      (acc: { [keyof: string]: any }, [_, value]) => {
        const keyJsonByMap =
          Object.keys(jsonValue).find((selfKey) => jsonLdMap[selfKey]) ?? '';

        acc = {
          tagType: 'div',
          value: jsonValue[keyJsonByMap] ?? '',
          children: [],
        };

        if (typeof value === 'object' && !Array.isArray(value)) {
          acc = {
            ...acc,
            children: [...acc.children, this.recursiveTraversalJson(value)],
          };
        }

        if (Array.isArray(value)) {
          acc = {
            ...acc,
            children: value.map((objectRecursive) =>
              this.recursiveTraversalJson(objectRecursive),
            ),
          };
        }

        return acc;
      },
      {},
    );
  }

  public formatFromJsonToString(jsonValue: string): string {
    const json = JSON.parse(jsonValue ?? '');

    const result = this.recursiveTraversalJson(json);
    console.log(result);
    return '';
  }
}

export default new HTMLJsonLDGenerator();
