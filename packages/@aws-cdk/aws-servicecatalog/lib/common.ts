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
 *
 * Tag Option Value
 */
export type TagOptionValue = {
  value: string,
  active?: boolean
}

/**
  * Tag Option
  */
export interface TagOption {
  [key: string]: TagOptionValue[]
}