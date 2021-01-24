import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';

/**
 * Exposed secret for log configuration
 */
export class ExposedSecret {
  /**
   * Use Secrets Manager Secret
   * @param optionaName - The name of the option
   * @param secret - A secret from secrets manager
   */
  public static fromSecretsManager(optionaName: string, secret: secretsmanager.ISecret): ExposedSecret {
    return new ExposedSecret(optionaName, secret.secretArn);
  }

  /**
   * User Parameters Store Parameter
   * @param optionaName - The name of the option
   * @param parameter - A parameter from parameters store
   */
  public static fromParametersStore(optionaName: string, parameter: ssm.IParameter): ExposedSecret {
    return new ExposedSecret(optionaName, parameter.parameterArn);
  }

  /**
   * Name of the option
   */
  public optionName: string;

  /**
   * ARN of the secret option
   */
  public secretArn: string;

  constructor(optionName: string, secretArn: string) {
    this.optionName = optionName;
    this.secretArn = secretArn;
  }
}
