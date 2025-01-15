
/**
 * Options for the default SDK provider
 */
export interface SdkOptions {
  /**
   * Profile to read from ~/.aws
   *
   * @default - No profile
   */
  readonly profile?: string;

  /**
   * Proxy address to use
   *
   * @default No proxy
   */
  readonly region?: string;

  /**
   * HTTP options for SDK
   */
  readonly httpOptions?: SdkHttpOptions;
}

/**
 * Options for individual SDKs
 */
export interface SdkHttpOptions {
  /**
   * Proxy address to use
   *
   * @default No proxy
   */
  readonly proxyAddress?: string;

  /**
   * A path to a certificate bundle that contains a cert to be trusted.
   *
   * @default No certificate bundle
   */
  readonly caBundlePath?: string;
}
