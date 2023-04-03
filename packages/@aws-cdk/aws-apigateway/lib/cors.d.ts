import { Duration } from '@aws-cdk/core';
export interface CorsOptions {
    /**
     * Specifies the response status code returned from the OPTIONS method.
     *
     * @default 204
     */
    readonly statusCode?: number;
    /**
     * Specifies the list of origins that are allowed to make requests to this
     * resource. If you wish to allow all origins, specify `Cors.ALL_ORIGINS` or
     * `[ * ]`.
     *
     * Responses will include the `Access-Control-Allow-Origin` response header.
     * If `Cors.ALL_ORIGINS` is specified, the `Vary: Origin` response header will
     * also be included.
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
     * @default Cors.DEFAULT_HEADERS
     */
    readonly allowHeaders?: string[];
    /**
     * The Access-Control-Allow-Methods response header specifies the method or
     * methods allowed when accessing the resource in response to a preflight request.
     *
     * If `ANY` is specified, it will be expanded to `Cors.ALL_METHODS`.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods
     * @default Cors.ALL_METHODS
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
    /**
     * The Access-Control-Max-Age response header indicates how long the results of
     * a preflight request (that is the information contained in the
     * Access-Control-Allow-Methods and Access-Control-Allow-Headers headers)
     * can be cached.
     *
     * To disable caching altogether use `disableCache: true`.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age
     * @default - browser-specific (see reference)
     */
    readonly maxAge?: Duration;
    /**
     * Sets Access-Control-Max-Age to -1, which means that caching is disabled.
     * This option cannot be used with `maxAge`.
     *
     * @default - cache is enabled
     */
    readonly disableCache?: boolean;
    /**
     * The Access-Control-Expose-Headers response header indicates which headers
     * can be exposed as part of the response by listing their names.
     *
     * If you want clients to be able to access other headers, you have to list
     * them using the Access-Control-Expose-Headers header.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
     *
     * @default - only the 6 CORS-safelisted response headers are exposed:
     * Cache-Control, Content-Language, Content-Type, Expires, Last-Modified,
     * Pragma
     */
    readonly exposeHeaders?: string[];
}
export declare class Cors {
    /**
     * All HTTP methods.
     */
    static readonly ALL_METHODS: string[];
    /**
     * All origins.
     */
    static readonly ALL_ORIGINS: string[];
    /**
     * The set of default headers allowed for CORS and useful for API Gateway.
     */
    static readonly DEFAULT_HEADERS: string[];
    private constructor();
}
