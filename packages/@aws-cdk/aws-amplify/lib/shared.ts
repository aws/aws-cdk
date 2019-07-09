import { IResolvable, IResolveContext } from "@aws-cdk/core";

/**
 * Basic Auth Config Interface
 */
export interface BasicAuthConfig {
  /**
   * Enable Basic Auth
   *
   * @default false
   */
  readonly enableBasicAuth?: boolean;

  /**
   * Password
   */
  readonly password: string;

  /**
   * Username
   */
  readonly username: string;
}

/**
 * Basic Auth Resolver
 */

export class BasicAuthResolver implements IResolvable {
  public readonly creationStack: string[];

  private bac: BasicAuthConfig;

  public resolve(_context: IResolveContext): any {
    return this.bac;
  }

  public basicAuthConfig(bac: BasicAuthConfig) {
    this.bac = bac;
  }
}

/**
 * Environment Variable Interface
 */
export interface EnvironmentVariable {
  /**
   * Name
   */
  readonly name: string;

  /**
   * Value
   */
  readonly value: string;
}

/**
 * Environment Variables Resolver
 */
export class EnvironmentVariablesResolver implements IResolvable {
  public readonly creationStack: string[];

  private environmentVariables: EnvironmentVariable[] = new Array<EnvironmentVariable>();

  public resolve(_context: IResolveContext): any {
    return this.environmentVariables;
  }

  public isEmpty(): boolean {
    return (this.environmentVariables.length !== 0);
  }

  public count(): number {
    return this.environmentVariables.length;
  }

  public addEnvironmentVariable(name: string, value: string) {
    this.environmentVariables.push({
      name,
      value
    });
  }
}