import type { IHttpApiRef } from './api';
import { ArnFormat, Stack, Token, ValidationError } from '../../../core';

/**
 * Calculations and operations for HTTP APIs
 */
export class HttpApiHelper {
  /**
   * Return an `HttpApiHelper` for the given HTTP API
   */
  public static fromHttpApi(httpApi: IHttpApiRef): HttpApiHelper {
    return new HttpApiHelper(httpApi);
  }

  private constructor(private readonly httpApi: IHttpApiRef) {
  }

  /**
   * Get the "execute-api" ARN.
   *
   * When 'ANY' is passed to the method, an ARN with the method set to '*' is obtained.
   *
   * @default - The default behavior applies when no specific method, path, or stage is provided.
   * In this case, the ARN will cover all methods, all resources, and all stages of this API.
   * Specifically, if 'method' is not specified, it defaults to '*', representing all methods.
   * If 'path' is not specified, it defaults to '/*', representing all paths.
   * If 'stage' is not specified, it also defaults to '*', representing all stages.
   */
  public arnForExecuteApi(method?: string, path?: string, stage?: string): string {
    if (path && !Token.isUnresolved(path) && !path.startsWith('/')) {
      throw new ValidationError(`Path must start with '/': ${path}`, this.httpApi);
    }

    if (method && method.toUpperCase() === 'ANY') {
      method = '*';
    }

    return Stack.of(this.httpApi).formatArn({
      service: 'execute-api',
      account: this.httpApi.env.account,
      region: this.httpApi.env.region,
      resource: this.httpApi.apiRef.apiId,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      resourceName: `${stage ?? '*'}/${method ?? '*'}${path ?? '/*'}`,
    });
  }
}
