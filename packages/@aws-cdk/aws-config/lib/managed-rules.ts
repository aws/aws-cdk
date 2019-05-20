import iam = require('@aws-cdk/aws-iam');
import sns = require('@aws-cdk/aws-sns');
import { Construct, Token } from '@aws-cdk/cdk';
import { ManagedRule, RuleProps } from './rule';

/**
 * Construction properties for a AccessKeysRotated
 */
export interface AccessKeysRotatedProps extends RuleProps {
  /**
   * The maximum number of days within which the access keys must be rotated.
   *
   * @default 90 days
   */
  readonly maxDays?: number;
}

/**
 * Checks whether the active access keys are rotated within the number of days
 * specified in `maxDays`.
 *
 * @see https://docs.aws.amazon.com/config/latest/developerguide/access-keys-rotated.html
 *
 * @resource AWS::Config::ConfigRule
 */
export class AccessKeysRotated extends ManagedRule {
  constructor(scope: Construct, id: string, props: AccessKeysRotatedProps = {}) {
    super(scope, id, {
      ...props,
      identifier: 'ACCESS_KEYS_ROTATED',
      inputParameters: {
        ...props.maxDays
          ? {
              maxAccessKeyAge: props.maxDays
            }
          : {}
        }
    });
  }
}

/**
 * Construction properties for a CloudFormationStackDriftDetectionCheck
 */
export interface CloudFormationStackDriftDetectionCheckProps extends RuleProps {
  /**
   * Whether to check only the stack where this rule is deployed.
   *
   * @default false
   */
  readonly ownStackOnly?: boolean;
}

/**
 * Checks whether your CloudFormation stacks' actual configuration differs, or
 * has drifted, from its expected configuration.
 *
 * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudformation-stack-drift-detection-check.html
 *
 * @resource AWS::Config::ConfigRule
 */
export class CloudFormationStackDriftDetectionCheck extends ManagedRule {
  private role: iam.Role;

  constructor(scope: Construct, id: string, props: CloudFormationStackDriftDetectionCheckProps = {}) {
    super(scope, id, {
      ...props,
      identifier: 'CLOUDFORMATION_STACK_DRIFT_DETECTION_CHECK',
      inputParameters: {
        cloudformationRoleArn: new Token(() => this.role.roleArn)
      }
    });

    this.addResourceScope('AWS::CloudFormation::Stack', props.ownStackOnly ? this.node.stack.stackId : undefined);

    this.role = new iam.Role(this, 'Role', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('config.amazonaws.com'),
        new iam.ServicePrincipal('cloudformation.amazonaws.com')
      ),
      managedPolicyArns: [
        new iam.AwsManagedPolicy('ReadOnlyAccess', this).policyArn,
        new iam.AwsManagedPolicy('AWSCloudFormationReadOnlyAccess', this).policyArn
      ]
    });
  }
}

/**
 * Construction properties for a CloudFormationStackNotificationCheck.
 */
export interface CloudFormationStackNotificationCheckProps extends RuleProps {
  /**
   * A list of allowed topics. At most 5 topics.
   */
  readonly topics?: sns.ITopic[];
}

/**
 * Checks whether your CloudFormation stacks are sending event notifications to
 * a SNS topic. Optionally checks whether specified SNS topics are used.
 *
 * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudformation-stack-notification-check.html
 *
 * @resource AWS::Config::ConfigRule
 */
export class CloudFormationStackNotificationCheck extends ManagedRule {
  constructor(scope: Construct, id: string, props: CloudFormationStackNotificationCheckProps = {}) {
    if (props.topics && props.topics.length > 5) {
      throw new Error('At most 5 topics can be specified.');
    }

    super(scope, id, {
      ...props,
      identifier: 'CLOUDFORMATION_STACK_NOTIFICATION_CHECK',
      inputParameters: props.topics && props.topics.reduce(
        (params, topic, idx) => ({ ...params, [`snsTopic${idx + 1}`]: topic.topicArn }),
        {}
      )
    });

    this.addResourceScope('AWS::CloudFormation::Stack');
  }
}
