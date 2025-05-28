/**
 * The category that the image corresponds to in your managed login configuration.
 * Managed login has asset categories for different types of logos, backgrounds, and icons.
 */
export enum AssetCategory {
  /**
   * Favicon (ICO format)
   */
  FAVICON_ICO = 'FAVICON_ICO',

  /**
   * Favicon (SVG format)
   */
  FAVICON_SVG = 'FAVICON_SVG',

  /**
   * Email graphic
   */
  EMAIL_GRAPHIC = 'EMAIL_GRAPHIC',

  /**
   * SMS graphic
   */
  SMS_GRAPHIC = 'SMS_GRAPHIC',

  /**
   * Authentication app graphic
   */
  AUTH_APP_GRAPHIC = 'AUTH_APP_GRAPHIC',

  /**
   * Password graphic
   */
  PASSWORD_GRAPHIC = 'PASSWORD_GRAPHIC',

  /**
   * Passkey graphic
   */
  PASSKEY_GRAPHIC = 'PASSKEY_GRAPHIC',

  /**
   * Page header logo
   */
  PAGE_HEADER_LOGO = 'PAGE_HEADER_LOGO',

  /**
   * Page header background
   */
  PAGE_HEADER_BACKGROUND = 'PAGE_HEADER_BACKGROUND',

  /**
   * Page footer logo
   */
  PAGE_FOOTER_LOGO = 'PAGE_FOOTER_LOGO',

  /**
   * Page footer background
   */
  PAGE_FOOTER_BACKGROUND = 'PAGE_FOOTER_BACKGROUND',

  /**
   * Page background
   */
  PAGE_BACKGROUND = 'PAGE_BACKGROUND',

  /**
   * Form background
   */
  FORM_BACKGROUND = 'FORM_BACKGROUND',

  /**
   * Form logo
   */
  FORM_LOGO = 'FORM_LOGO',

  /**
   * Identity provider button icon
   */
  IDP_BUTTON_ICON = 'IDP_BUTTON_ICON',
}

/**
 * The display-mode target of the asset: light, dark, or dynamic (browser-adaptive).
 */
export enum ColorMode {
  /**
   * Light mode
   */
  LIGHT = 'LIGHT',

  /**
   * Dark mode
   */
  DARK = 'DARK',

  /**
   * Browser-adaptive mode (displays in all contexts)
   */
  DYNAMIC = 'DYNAMIC',
}

/**
 * The file type of the image file.
 */
export enum AssetExtension {
  /**
   * ICO file type
   */
  ICO = 'ICO',

  /**
   * JPEG file type
   */
  JPEG = 'JPEG',

  /**
   * PNG file type
   */
  PNG = 'PNG',

  /**
   * SVG file type
   */
  SVG = 'SVG',

  /**
   * WEBP file type
   */
  WEBP = 'WEBP',
}
