/**
 * Lambda EphemeralStorage configuration
 */
export class EphemeralStorage {

  /**
   * The size of the function’s /tmp directory in MB. The default value is 512, but can be any whole number between 512 and 10240 MB.
   */
  public readonly size: number;

  private constructor(size: number) {
    this.size = size;
  }
}
