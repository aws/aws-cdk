export interface CorsOptions {
  /**
   * @default 204
   */
  readonly statusCode?: number;

  readonly allowOrigin: string;

  /**
   * @default
   */
  readonly allowHeaders?: string[];

  /**
   * @default
   */
  readonly allowMethods?: string[];

  /**
   * @default false
   */
  readonly allowCredentials?: boolean;
}

export class Cors {
  // TODO: dedup with utils.ts/ALLOWED_METHODS
  public static readonly ALL_METHODS = [ 'OPTIONS', 'GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD' ];
  public static readonly DEFAULT_HEADERS = [ 'Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token', 'X-Amz-User-Agent' ];
}