/**
 * The language code.
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
export type TagOptionValue = {
  value: string,
  active?: boolean
}

/**
 * Defines a Tag Option, which are similar to tags
 * but have multiple values per key.
 */
export interface TagOption {
  [key: string]: TagOptionValue[]
}