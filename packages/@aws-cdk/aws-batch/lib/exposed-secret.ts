import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';

/**
 * Exposed secret for log configuration
 */
export class ExposedSecret {
  /**
   * Use Secrets Manager Secret
   * @param name - The name of the secret
   * @param secret - A secret from secrets manager
   */
  public static fromSecretsManager(name: string, secret: secretsmanager.ISecret): ExposedSecret {
    return new ExposedSecret(name, secret.secretArn);
  }

  /**
   * User Parameters Store Parameter
   * @param name - The name of the secret
   * @param parameter - A parameter from parameters store
   */
  public static fromParametersStore(name: string, parameter: ssm.IParameter): ExposedSecret {
    return new ExposedSecret(name, parameter.parameterArn);
  }

  /**
   * Name of the secret
   */
  public secretName: string;

  /**
   * ARN of the secret
   */
  public secretArn: string;

  constructor(secretName: string, secretArn: string) {
    this.secretName = secretName;
    this.secretArn = secretArn;
  }
}
