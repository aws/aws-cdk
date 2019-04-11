import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { ISecret } from './secret';
import { CfnRotationSchedule } from './secretsmanager.generated';

/**
 * Options to add a rotation schedule to a secret.
 */
export interface RotationScheduleOptions {
  /**
   * THe Lambda function that can rotate the secret.
   */
  readonly rotationLambda: lambda.IFunction;

  /**
   * Specifies the number of days after the previous rotation before
   * Secrets Manager triggers the next automatic rotation.
   *
   * @default 30
   */
  readonly automaticallyAfterDays?: number;
}

/**
 * Construction properties for a RotationSchedule.
 */
export interface RotationScheduleProps extends RotationScheduleOptions {
  /**
   * The secret to rotate.
   */
  readonly secret: ISecret;
}

/**
 * A rotation schedule.
 */
export class RotationSchedule extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: RotationScheduleProps) {
    super(scope, id);

    new CfnRotationSchedule(this, 'Resource', {
      secretId: props.secret.secretArn,
      rotationLambdaArn: props.rotationLambda.functionArn,
      rotationRules: {
        automaticallyAfterDays: props.automaticallyAfterDays || 30
      }
    });
  }
}
