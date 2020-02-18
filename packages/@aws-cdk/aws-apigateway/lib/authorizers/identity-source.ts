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
    return new IdentitySource(headerName, SourceType.Header);
  }

  /**
   * @param queryString the name of the query string the `IdentitySource` will represent.
   * @returns a new `IdentitySource` representing `queryString` from the request.
   */
  public static queryString(queryString: string): IdentitySource {
    return new IdentitySource(queryString, SourceType.QueryString);
  }

  /**
   * @param stageVariable the name of the stage variable the `IdentitySource` will represent.
   * @returns a new `IdentitySource` representing `stageVariable` from the API Gateway.
   */
  public static stageVariable(stageVariable: string): IdentitySource {
    return new IdentitySource(stageVariable, SourceType.StageVariable);
  }

  /**
   * @param context the name of the context variable the `IdentitySource` will represent.
   * @returns a new `IdentitySource` representing `context` from the request context.
   */
  public static context(context: string): IdentitySource {
    return new IdentitySource(context, SourceType.Context);
  }

  private readonly source: string;
  private readonly type: SourceType;

  private constructor(source: string, type: SourceType) {
    if (!Token.isUnresolved(source) && source === '') {
      throw new Error(`IdentitySources cannot be empty. Received: ${source}`);
    }

    this.source = source;
    this.type = type;
  }

  /**
   * Returns a string representation of this `IdentitySource` that is also a Token that cannot be successfully resolved. This
   * protects users against inadvertently stringifying an `IdentitySource` object, when they should have called one of the
   * `to*` methods instead.
   */
  public toString() {
    return `${this.type.toString()}.${this.source}`;
  }
}

class SourceType {
  public static readonly Header = new SourceType('method.request.header');
  public static readonly QueryString = new SourceType('method.request.querystring');
  public static readonly StageVariable = new SourceType('stageVariables');
  public static readonly Context = new SourceType('context');

  private constructor(public readonly label: string) {
  }

  public toString() {
    return this.label;
  }
}
