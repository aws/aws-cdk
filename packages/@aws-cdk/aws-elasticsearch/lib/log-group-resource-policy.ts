import * as iam from '@aws-cdk/aws-iam';
import * as cr from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';

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
  constructor(scope: Construct, id: string, props: LogGroupResourcePolicyProps) {
    const policyDocument = new iam.PolicyDocument({
      statements: props.policyStatements,
    });

    super(scope, id, {
      resourceType: 'Custom::CloudwatchLogResourcePolicy',
      onUpdate: {
        service: 'CloudWatchLogs',
        action: 'putResourcePolicy',
        parameters: {
          policyName: props.policyName,
          policyDocument: JSON.stringify(policyDocument),
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
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({ resources: ['*'] }),
    });
  }
}
