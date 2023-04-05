/**
 * Inspector that maintains an attribute bag
 */
export class TreeInspector {
  /**
   * Represents the bag of attributes as key-value pairs.
   */
  public readonly attributes: { [key: string]: any } = {};

  /**
   * Adds attribute to bag. Keys should be added by convention to prevent conflicts
   * i.e. L1 constructs will contain attributes with keys prefixed with aws:cdk:cloudformation
   *
   * @param key - key for metadata
   * @param value - value of metadata.
   */
  public addAttribute(key: string, value: any) {
    this.attributes[key] = value;
  }
}

/**
 * Interface for examining a construct and exposing metadata.
 *
 */
export interface IInspectable {
  /**
   * Examines construct
   *
   * @param inspector - tree inspector to collect and process attributes
   */
  inspect(inspector: TreeInspector): void;
}
