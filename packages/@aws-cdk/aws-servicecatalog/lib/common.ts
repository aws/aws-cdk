/**
 * The language code.
 * Used for error and logging messages for end users.
 */
export enum AcceptLanguage {
  /**
   * English
   */
  EN = 'en',

  /**
   * Japanese
   */
  JP = 'jp',

  /**
   * Chinese
   */
  ZH = 'zh'
}

/**
 * Tag Option Value
 */
interface TagOptionValue {
  /**
   * The tag value of the key-value pair.
   */
  readonly value: string;

  /**
   * Active status of option. By default, a tagOption is
   * active upon creation, and can only be disabled on an update.
   * @default - true
   */
  readonly active?: boolean;
}

/**
 * Defines a Tag Option, which are similar to tags
 * but have multiple values per key.
 */
export interface TagOption {
  readonly [key: string]: TagOptionValue[];
}