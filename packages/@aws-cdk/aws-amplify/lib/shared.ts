
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