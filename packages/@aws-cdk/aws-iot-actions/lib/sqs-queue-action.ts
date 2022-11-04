import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as sqs from '@aws-cdk/aws-sqs';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

/**
 * Configuration properties of an action for SQS.
 */
export interface SqsQueueActionProps extends CommonActionProps {
  /**
   * Specifies whether to use Base64 encoding.
   *
   * @default false
   */
  readonly useBase64?: boolean
}

/**
 * The action to write the data from an MQTT message to an Amazon SQS queue.
 */
export class SqsQueueAction implements iot.IAction {
  private readonly role?: iam.IRole;
  private readonly queue: sqs.IQueue;
  private readonly useBase64?: boolean;

  /**
   * @param queue The Amazon SQS queue to which to write data.
   * @param props Optional properties to not use default
   */
  constructor(queue: sqs.IQueue, props: SqsQueueActionProps = {}) {
    this.queue = queue;
    this.role = props.role;
    this.useBase64 = props.useBase64;
  }

  /**
   * @internal
   */
  public _bind(rule: iot.ITopicRule): iot.ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['sqs:SendMessage'],
      resources: [this.queue.queueArn],
    }));

    return {
      configuration: {
        sqs: {
          queueUrl: this.queue.queueUrl,
          useBase64: this.useBase64,
          roleArn: role.roleArn,
        },
      },
    };
  }
}
