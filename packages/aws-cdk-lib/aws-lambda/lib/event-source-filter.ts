/**
 * Filter rules for Lambda event filtering
 */
export class FilterRule {
  /**
   * Null comparison operator
   */
  public static null(): string[] {
    return [];
  }

  /**
   * Empty comparison operator
   */
  public static empty(): string[] {
    return [''];
  }

  /**
   * Equals comparison operator
   */
  public static isEqual(item: string | number | boolean): any {
    if (typeof item === 'number') {
      return [{ numeric: ['=', item] }];
    }
    return [item];
  }

  /**
   * Or comparison operator
   */
  public static or(...elem: string[]): string[] {
    return elem;
  }

  /**
   * Not equals comparison operator
   */
  public static notEquals(elem: string): {[key:string]: string[]}[] {
    return [{ 'anything-but': [elem] }];
  }

  /**
   * Numeric range comparison operator
   */
  public static between(first: number, second: number): {[key:string]: any[]}[] {
    return [{ numeric: ['>', first, '<=', second] }];
  }

  /**
   * Exists comparison operator
   */
  public static exists(): {[key:string]: boolean}[] {
    return [{ exists: true }];
  }

  /**
   * Not exists comparison operator
   */
  public static notExists(): {[key:string]: boolean}[] {
    return [{ exists: false }];
  }

  /**
   * Begins with comparison operator
   */
  public static beginsWith(elem: string): {[key:string]: string}[] {
    return [{ prefix: elem }];
  }
}

/**
 * Filter criteria for Lambda event filtering
 */
export class FilterCriteria {
  /**
   * Filter for event source
   */
  public static filter(filter: {[key:string]: any}): {[key:string]: any} {
    return { pattern: JSON.stringify(filter) };
  }
}