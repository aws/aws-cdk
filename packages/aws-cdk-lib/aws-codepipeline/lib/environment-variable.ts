import { CfnPipeline } from './codepipeline.generated';
import { ISecret } from '../../aws-secretsmanager';
import { Token, UnscopedValidationError } from '../../core';

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
  readonly variableName: string;
}

/**
 * Properties for a plaintext environment variable.
 */
export interface PlaintextEnvironmentVariableProps extends CommonEnvironmentVariableProps {
  /**
   * The environment variable value in the key-value pair.
   */
  readonly variableValue: string;
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
  public readonly variableName: string;

  /**
   * Create a new environment variable.
   */
  protected constructor(props: CommonEnvironmentVariableProps) {
    if (!Token.isUnresolved(props.variableName)) {
      if (props.variableName.length > 128) {
        throw new UnscopedValidationError('The length of `variableName` for `actionEnvironmentVariables` must be less than or equal to 128, got: ' + props.variableName.length);
      }
      if (!/^[A-Za-z0-9_]+$/.test(props.variableName)) {
        throw new UnscopedValidationError('The `variableName` for `actionEnvironmentVariables` must match the regular expression: `[A-Za-z0-9_]+`, got: ' + props.variableName);
      }
    }

    this.variableName = props.variableName;
  }

  /**
   * Render the environment variable to a CloudFormation resource.
   * @internal
   */
  public _render(): CfnPipeline.EnvironmentVariableProperty {
    return {
      name: this.variableName,
      value: this.variableValue,
      type: this.variableType,
    };
  }

  protected abstract get variableValue(): string;
  protected abstract get variableType(): string;
}

/**
 * A plaintext environment variable.
 */
export class PlaintextEnvironmentVariable extends EnvironmentVariable {
  private readonly _variableValue: string;

  constructor(props: PlaintextEnvironmentVariableProps) {
    super(props);
    this._variableValue = props.variableValue;
  }

  protected get variableValue(): string {
    return this._variableValue;
  }

  protected get variableType(): string {
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

  protected get variableValue(): string {
    return this.secret.secretName;
  }

  protected get variableType(): string {
    return 'SECRETS_MANAGER';
  }
}
