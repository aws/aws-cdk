import iam = require('@aws-cdk/aws-iam');
import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/core');
import path = require('path');
import { Code } from './code';
import { Runtime } from './runtime';
import { SingletonFunction } from './singleton-lambda';

/**
 * Construction properties for a LogRetention.
 */
export interface LogRetentionProps {
  /**
   * The log group name.
   */
  readonly logGroupName: string;

  /**
   * The number of days log events are kept in CloudWatch Logs.
   */
  readonly retention: logs.RetentionDays;

  /**
   * The IAM role for the Lambda function associated with the custom resource.
   *
   * @default - A new role is created
   */
  readonly role?: iam.IRole;
}

/**
 * Creates a custom resource to control the retention policy of a CloudWatch Logs
 * log group. The log group is created if it doesn't already exist. The policy
 * is removed when `retentionDays` is `undefined` or equal to `Infinity`.
 */
export class LogRetention extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: LogRetentionProps) {
    super(scope, id);

    // Custom resource provider
    const provider = new SingletonFunction(this, 'Provider', {
      code: Code.fromAsset(path.join(__dirname, 'log-retention-provider')),
      runtime: Runtime.NODEJS_10_X,
      handler: 'index.handler',
      uuid: 'aae0aa3c-5b4d-4f87-b02d-85b201efdd8a',
      lambdaPurpose: 'LogRetention',
      role: props.role,
    });

    // Duplicate statements will be deduplicated by `PolicyDocument`
    provider.addToRolePolicy(new iam.PolicyStatement({
      actions: ['logs:PutRetentionPolicy', 'logs:DeleteRetentionPolicy'],
      // We need '*' here because we will also put a retention policy on
      // the log group of the provider function. Referencing it's name
      // creates a CF circular dependency.
      resources: ['*'],
    }));

    // Need to use a CfnResource here to prevent lerna dependency cycles
    // @aws-cdk/aws-cloudformation -> @aws-cdk/aws-lambda -> @aws-cdk/aws-cloudformation
    new cdk.CfnResource(this, 'Resource', {
      type: 'Custom::LogRetention',
      properties: {
        ServiceToken: provider.functionArn,
        LogGroupName: props.logGroupName,
        RetentionInDays: props.retention === Infinity ? undefined : props.retention
      }
    });
  }
}
