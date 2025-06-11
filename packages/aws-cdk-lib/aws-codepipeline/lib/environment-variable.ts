import { Construct } from 'constructs';
import { ActionBindOptions, ActionProperties } from './action';
import { CfnPipeline } from './codepipeline.generated';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import { ISecret } from '../../aws-secretsmanager';
import { Stack, Token, UnscopedValidationError } from '../../core';

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

  protected abstract get variableValue(): string;
  protected abstract get variableType(): string;

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

  /**
   * Bind the environment variable to the action.
   * @internal
   */
  public abstract _bind(scope: Construct, actionProperties: ActionProperties, options: ActionBindOptions): void;
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

  /**
   * Bind the environment variable to the action.
   * @internal
   */
  public _bind(_scope: Construct, _actionProperties: ActionProperties, _options: ActionBindOptions) {
    // no-op
  }
}

/**
 * A Secrets Manager environment variable.
 */
export class SecretsManagerEnvironmentVariable extends EnvironmentVariable {
  private readonly secret: ISecret;

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

  /**
   * Bind the environment variable to the action.
   * @internal
   */
  public _bind(scope: Construct, actionProperties: ActionProperties, options: ActionBindOptions) {
    if (actionProperties.provider !== 'Commands') {
      throw new UnscopedValidationError(`Secrets Manager environment variable ('${this.variableName}') in action '${actionProperties.actionName}' can only be used with the Commands action, got: ${actionProperties.provider} action`);
    }

    const secretArn = this.secret.secretFullArn ? this.secret.secretFullArn : `${this.secret.secretArn}-??????`;

    // Don't use `grantRead` method for the secret because `secretsmanager:DescribeSecret` is not required.
    // See https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-Commands.html#action-reference-Commands-envvars
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['secretsmanager:GetSecretValue'],
      resources: [secretArn],
    }));

    if (this.secret.encryptionKey) {
      this.secret.encryptionKey.grantDecrypt(
        new kms.ViaServicePrincipal(`secretsmanager.${Stack.of(scope).region}.amazonaws.com`, options.role.grantPrincipal),
      );
    }
  }
}
