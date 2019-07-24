import { IResolvable, IResolveContext } from "@aws-cdk/core";

/**
 * Use the BasicAuth property type to set password protection at an app level to all your branches.
 */
export interface BasicAuth {
  /**
   * Enables Basic Authorization for branches for the Amplify App.
   *
   * @default - Not enabled
   */
  readonly enableBasicAuth?: boolean;

  /**
   * The password for basic authorization.
   */
  readonly password: string;

  /**
   * The user name for basic authorization.
   */
  readonly username: string;
}

/**
 * Basic Auth Resolver
 */

export class BasicAuthResolver implements IResolvable {
  public readonly creationStack: string[];

  private bac: BasicAuth;

  public resolve(_context: IResolveContext): any {
    return this.bac;
  }

  public basicAuth(bac: BasicAuth) {
    this.bac = bac;
  }
}

/**
 * Environment variables are key-value pairs that are available at build time.
 * Set environment variables for all branches in your app.
 */
export interface EnvironmentVariable {
  /**
   * The environment variable name.
   */
  readonly name: string;

  /**
   * The environment variable value.
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
    return (this.environmentVariables.length === 0);
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

  public addEnvironmentVariables(...environmentVariables: EnvironmentVariable[]) {
    this.environmentVariables.push(...environmentVariables);
  }
}