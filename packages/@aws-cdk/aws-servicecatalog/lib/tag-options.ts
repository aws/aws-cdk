/**
 * Defines a Tag Option, which are similar to tags
 * but have multiple values per key.
 */
export class TagOptions {
  /**
  * List of CfnTagOption
  */
  public readonly tagOptionsMap: { [key: string]: string[] };

  constructor(tagOptionsMap: { [key: string]: string[]} ) {
    this.tagOptionsMap = { ...tagOptionsMap };
  }
}
