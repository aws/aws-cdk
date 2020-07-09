import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';

/**
 * Construction properties for LogGroupResourcePolicy
 */
export interface LogGroupResourcePolicyProps {
  /**
   * The log group resource policy name
   */
  readonly policyName: string;
  /**
   * The policy statements for the log group resource logs
   */
  readonly policyStatements: [iam.PolicyStatement];
}

/**
 * Creates LogGroup resource policies.
 */
export class LogGroupResourcePolicy extends cr.AwsCustomResource {
  constructor(scope: cdk.Construct, id: string, props: LogGroupResourcePolicyProps) {
    const policy = new iam.Policy(scope, props.policyName, {
      statements: props.policyStatements,
    });

    super(scope, id, {
      resourceType: 'Custom::CloudwatchLogResourcePolicy',
      onUpdate: {
        service: 'CloudWatchLogs',
        action: 'putResourcePolicy',
        parameters: {
          policyName: props.policyName,
          policyDocument: JSON.stringify(policy.document),
        },
        physicalResourceId: cr.PhysicalResourceId.of(id),
      },
      onDelete: {
        service: 'CloudWatchLogs',
        action: 'deleteResourcePolicy',
        parameters: {
          policyName: props.policyName,
        },
        ignoreErrorCodesMatching: '400',
      },
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          actions: ['logs:PutResourcePolicy', 'logs:DeleteResourcePolicy'],
          // Resource Policies are global in Cloudwatch Logs per-region, per-account.
          resources: ['*'],
        }),
      ]),
    });
  }
}
