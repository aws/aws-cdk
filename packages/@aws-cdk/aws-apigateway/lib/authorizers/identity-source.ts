/**
 * Represents an identity source.
 *
 * The source can be specified either as a literal value (e.g: `Auth`) which
 * cannot be blank, or as an unresolved string token.
 */
export class IdentitySource {
  /**
   * Provides a properly formatted header identity source.
   * @param headerName the name of the header the `IdentitySource` will represent.
   *
   * @returns a header identity source.
   */
  public static header(headerName: string): string {
    return IdentitySource.toString(headerName, 'method.request.header');
  }

  /**
   * Provides a properly formatted query string identity source.
   * @param queryString the name of the query string the `IdentitySource` will represent.
   *
   * @returns a query string identity source.
   */
  public static queryString(queryString: string): string {
    return IdentitySource.toString(queryString, 'method.request.querystring');
  }

  /**
   * Provides a properly formatted API Gateway stage variable identity source.
   * @param stageVariable the name of the stage variable the `IdentitySource` will represent.
   *
   * @returns an API Gateway stage variable identity source.
   */
  public static stageVariable(stageVariable: string): string {
    return IdentitySource.toString(stageVariable, 'stageVariables');
  }

  /**
   * Provides a properly formatted request context identity source.
   * @param context the name of the context variable the `IdentitySource` will represent.
   *
   * @returns a request context identity source.
   */
  public static context(context: string): string {
    return IdentitySource.toString(context, 'context');
  }

  private static toString(source: string, type: string) {
    if (!source.trim()) {
      throw new Error('IdentitySources must be a non-empty string.');
    }

    return `${type}.${source}`;
  }
}
