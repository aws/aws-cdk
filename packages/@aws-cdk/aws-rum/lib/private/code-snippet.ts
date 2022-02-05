/**
 * JavaScriptRegExp is string wrapper for JavaScript.stringify.
 * This class only keep string value and return value at on toString.
 */
export class JavaScriptRegExp {
  constructor(private pattern: string) {
    // NOP
  }
  toString(): string {
    return this.pattern;
  }
}

/**
 * This is an object for JavaScript conversion that was created in the image of a JSON object variable.
 * It has the ability to convert values to JavaScript strings.
 */
export const JavaScript = {
  /**
   * Converts a JavaScript value to a JavaScript string.
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @returns JavaScript string.
   */
  stringify(value: any): string {
    switch (typeof value) {
      case 'object':
        if (Array.isArray(value)) {
          return `[${value.map(v => JavaScript.stringify(v)).join(',')}]`;
        }
        if (value instanceof JavaScriptRegExp) {
          return value.toString();
        }
        const properties = Object.entries(value)
          .filter(([_, v]) => v !== undefined)
          .map(([k, v]) => `${k}:${JavaScript.stringify(v)}`);
        return `{${properties.join(',')}}`;
      case 'string': return `'${value}'`;
      default: return value.toString();
    }
  },
};