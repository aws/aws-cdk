export interface CorsOptions {
  /**
   * Specifies the response status code returned from the OPTIONS method.
   *
   * @default 204
   */
  readonly statusCode?: number;

  /**
   * The Access-Control-Allow-Origin response header indicates whether the
   * response can be shared with requesting code from the given origin.
   *
   * Specifies the list of origins that are allowed to make requests to this resource.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
   */
  readonly allowOrigins: string[];

  /**
   * The Access-Control-Allow-Headers response header is used in response to a
   * preflight request which includes the Access-Control-Request-Headers to
   * indicate which HTTP headers can be used during the actual request.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers
   * @default
   */
  readonly allowHeaders?: string[];

  /**
   * The Access-Control-Allow-Methods response header specifies the method or
   * methods allowed when accessing the resource in response to a preflight request.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods
   * @default
   */
  readonly allowMethods?: string[];

  /**
   * The Access-Control-Allow-Credentials response header tells browsers whether
   * to expose the response to frontend JavaScript code when the request's
   * credentials mode (Request.credentials) is "include".
   *
   * When a request's credentials mode (Request.credentials) is "include",
   * browsers will only expose the response to frontend JavaScript code if the
   * Access-Control-Allow-Credentials value is true.
   *
   * Credentials are cookies, authorization headers or TLS client certificates.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
   * @default false
   */
  readonly allowCredentials?: boolean;
}

export class Cors {
  // TODO: dedup with utils.ts/ALLOWED_METHODS
  public static readonly ALL_METHODS = [ 'OPTIONS', 'GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD' ];
  public static readonly DEFAULT_HEADERS = [ 'Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token', 'X-Amz-User-Agent' ];
}
