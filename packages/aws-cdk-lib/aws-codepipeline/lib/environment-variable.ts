import { CfnPipeline } from './codepipeline.generated';
import { ISecret } from '../../aws-secretsmanager';
import { UnscopedValidationError } from '../../core';

/**
 * Properties for an environment variable.
 */
export interface CommonEnvironmentVariableProps {
  /**
   * The environment variable name in the key-value pair.
   *
   * The maximum length is 128 characters.
   *
   * The name must match the regular expression: `[A-Za-z0-9_]+`.
   */
  readonly name: string;
}

/**
 * Properties for a plaintext environment variable.
 */
export interface PlaintextEnvironmentVariableProps extends CommonEnvironmentVariableProps {
  /**
   * The environment variable value in the key-value pair.
   */
  readonly value: string;
}

/**
 * Properties for a Secrets Manager environment variable.
 */
export interface SecretsManagerEnvironmentVariableProps extends CommonEnvironmentVariableProps {
  /**
   * The Secrets Manager secret reference.
   */
  readonly secret: ISecret;
}

/**
 * An environment variable.
 */
export abstract class EnvironmentVariable {
  /**
   * Create a new plaintext environment variable.
   */
  public static fromPlaintext(props: PlaintextEnvironmentVariableProps): PlaintextEnvironmentVariable {
    return new PlaintextEnvironmentVariable(props);
  }

  /**
   * Create a new Secrets Manager environment variable.
   */
  public static fromSecretsManager(props: SecretsManagerEnvironmentVariableProps): SecretsManagerEnvironmentVariable {
    return new SecretsManagerEnvironmentVariable(props);
  }

  /**
   * The environment variable name.
   */
  public readonly name: string;

  /**
   * Create a new environment variable.
   */
  protected constructor(props: CommonEnvironmentVariableProps) {
    if (props.name.length > 128) {
      throw new UnscopedValidationError('The length of `name` for `actionEnvironmentVariables` must be less than or equal to 128, got: ' + props.name.length);
    }
    if (!/^[A-Za-z0-9_]+$/.test(props.name)) {
      throw new UnscopedValidationError('The `name` for `actionEnvironmentVariables` must match the regular expression: `[A-Za-z0-9_]+`, got: ' + props.name);
    }

    this.name = props.name;
  }

  /**
   * Render the environment variable to a CloudFormation resource.
   * @internal
   */
  public _render(): CfnPipeline.EnvironmentVariableProperty {
    return {
      name: this.name,
      value: this.value,
      type: this.type,
    };
  }

  protected abstract get value(): string;
  protected abstract get type(): string;
}

/**
 * A plaintext environment variable.
 */
export class PlaintextEnvironmentVariable extends EnvironmentVariable {
  private readonly _value: string;

  constructor(props: PlaintextEnvironmentVariableProps) {
    super(props);
    this._value = props.value;
  }

  protected get value(): string {
    return this._value;
  }

  protected get type(): string {
    return 'PLAINTEXT';
  }
}

/**
 * A Secrets Manager environment variable.
 */
export class SecretsManagerEnvironmentVariable extends EnvironmentVariable {
  /**
   * The Secret that this environment variable references.
   */
  public readonly secret: ISecret;

  constructor(props: SecretsManagerEnvironmentVariableProps) {
    super(props);
    this.secret = props.secret;
  }

  protected get value(): string {
    return this.secret.secretName;
  }

  protected get type(): string {
    return 'SECRETS_MANAGER';
  }
}
