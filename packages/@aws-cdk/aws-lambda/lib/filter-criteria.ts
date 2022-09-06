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
  public static isEqual(item: string | number): any {
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
 * By default, you can have five different filters per event source. You can request a quota increase for up to 10 filters per event source.
 */
export class FilterCriteria {
  /**
   * Create a Filter Criteria Object
   */
  public static addFilters(...filters: {[key: string]: FilterRule}[]): {[key: string]: any} {
    let list: {[key: string]: string}[] = [];
    for (let item of filters) {
      list.push({ pattern: JSON.stringify(item) });
    }
    return { filters: list };
  }
}
