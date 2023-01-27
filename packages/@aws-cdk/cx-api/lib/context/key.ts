/**
 * Properties of a discovered key
 */
export interface KeyContextResponse {

  /**
   * Id of the key
   */
  readonly keyId: string;

  /**
   * Type of the key
   */
  readonly keySpec: string;
}