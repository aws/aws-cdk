import { Token } from '@aws-cdk/core';

/**
 * Represents an identity source.
 *
 * The source can be specified either as a literal value (e.g: `Auth`) which
 * cannot be blank, or as an unresolved string token.
 */
export class IdentitySource {
  /**
   * @param headerName the name of the header the `IdentitySource` will represent.
   * @returns a new `IdentitySource` representing `headerName` from the request.
   */
  public static header(headerName: string): IdentitySource {
    return IdentitySource.toString(headerName, 'method.request.header');
  }

  /**
   * @param queryString the name of the query string the `IdentitySource` will represent.
   * @returns a new `IdentitySource` representing `queryString` from the request.
   */
  public static queryString(queryString: string): IdentitySource {
    return IdentitySource.toString(queryString, 'method.request.querystring');
  }

  /**
   * @param stageVariable the name of the stage variable the `IdentitySource` will represent.
   * @returns a new `IdentitySource` representing `stageVariable` from the API Gateway.
   */
  public static stageVariable(stageVariable: string): IdentitySource {
    return IdentitySource.toString(stageVariable, 'stageVariables');
  }

  /**
   * @param context the name of the context variable the `IdentitySource` will represent.
   * @returns a new `IdentitySource` representing `context` from the request context.
   */
  public static context(context: string): IdentitySource {
    return IdentitySource.toString(context, 'context');
  }

  private static toString(source: string, type: string) {
    if (!Token.isUnresolved(source) && source === '') {
      throw new Error(`IdentitySources cannot be empty. Received: ${source}`);
    }

    return `${type}.${source}`;
  }
}
