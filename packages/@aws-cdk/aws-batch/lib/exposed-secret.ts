import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';

/**
 * Properties for SecretsManagerSecret
 */
export interface SecretsManagerSecretProps {
  /**
   * The name of the secret.
   */
  readonly name: string;

  /**
   * A secret from secrets manager
   */
  readonly value: secretsmanager.ISecret;
}

/**
 * Properties for ParametersStoreSecret
 */
export interface ParametersStoreSecretProps {
  /**
   * The name of the secret.
   */
  readonly name: string;

  /**
   * A parameter from parameters store
   */
  readonly value: ssm.IParameter;
}

/**
 * Exposed secret for log configuration
 */
export abstract class ExposedSecret {
  /**
   * Use Secrets Manager Secret
   * @param props SecretsManagerSecretProps
   */
  public static fromSecretsManager(props: SecretsManagerSecretProps): ExposedSecret {
    return new SecretsManagerSecret(props);
  }

  /**
   * User Parameters Store Parameter
   * @param props ParametersStoreSecretProps
   */
  public static fromParametersStore(props: ParametersStoreSecretProps): ExposedSecret {
    return new ParametersStoreSecret(props);
  }

  /**
   * Name of the secret
   */
  public abstract secretName: string;

  /**
   * ARN of the secret
   */
  public abstract secretArn: string;
}


/**
 * ExposedSecret for Secrets Manager
 */
class SecretsManagerSecret extends ExposedSecret {
  public secretName: string;
  public secretArn: string;

  constructor(props: SecretsManagerSecretProps) {
    super();
    this.secretName = props.name;
    this.secretArn = props.value.secretArn;
  }
}

/**
 * ExposedSecret for ParametersStore
 */
class ParametersStoreSecret extends ExposedSecret {
  public secretName: string;
  public secretArn: string;

  constructor(props: ParametersStoreSecretProps) {
    super();
    this.secretName = props.name;
    this.secretArn = props.value.parameterArn;
  }
}