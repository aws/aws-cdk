
/**
 * Partial and special matching during assertions.
 */
export abstract class Match {
  /**
   * Matches the specified pattern with the array found in the same relative path of the target.
   * The set of elements (or matchers) must be in the same order as would be found.
   * @param pattern the pattern to match
   */
  public static arrayWith(pattern: any[]): { [key: string]: any[] } {
    return { $ArrayWith: pattern };
  }

  /**
   * Matches the specified pattern to an object found in the same relative path of the target.
   * The keys and their values (or matchers) must be present in the target but the target can be a superset.
   * @param pattern the pattern to match
   */
  public static objectLike(pattern: { [key: string]: any }): { [key: string]: { [key: string]: any } } {
    return { $ObjectLike: pattern };
  }

  /**
   * Matches targets according to a regular expression
   */
  public static stringLikeRegexp(pattern: string): { [key: string]: string } {
    return { $StringLike: pattern };
  }

  /**
   * Matches any string-encoded JSON and applies the specified pattern after parsing it.
   * @param pattern the pattern to match after parsing the encoded JSON.
   */
  public static serializedJson(pattern: { [key: string]: any }): { [key: string]: { [key: string]: any } } {
    return { $SerializedJson: pattern };
  }
}
