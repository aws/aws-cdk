import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';

/**
 * Exposed secret for log configuration
 */
export abstract class ExposedSecret {
  /**
   * Use Secrets Manager Secret
   * @param name The name of the secret
   * @param secret A secret from secrets manager
   */
  public static fromSecretsManager(name: string, secret: secretsmanager.ISecret): ExposedSecret {
    return new SecretsManagerSecret(name, secret);
  }

  /**
   * User Parameters Store Parameter
   * @param name The name of the secret
   * @param parameter A parameter from parameters store
   */
  public static fromParametersStore(name: string, parameter: ssm.IParameter): ExposedSecret {
    return new ParametersStoreSecret(name, parameter);
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

  constructor(name: string, secret: secretsmanager.ISecret) {
    super();
    this.secretName = name;
    this.secretArn = secret.secretArn;
  }
}

/**
 * ExposedSecret for ParametersStore
 */
class ParametersStoreSecret extends ExposedSecret {
  public secretName: string;
  public secretArn: string;

  constructor(name: string, parameter: ssm.IParameter) {
    super();
    this.secretName = name;
    this.secretArn = parameter.parameterArn;
  }
}