import * as iam from '@aws-cdk/aws-iam';
import * as sqs from '@aws-cdk/aws-sqs';
import { IAction, ActionConfig, ITopicRule } from '..';
import { singletonActionRole } from './util';

/**
 * Configuration properties of an action for sqs.
 */
export interface SqsActionProps {
  /**
   * Set this parameter to true to configure the rule action to base64-encode the message
   * data before it writes the data to the Amazon SQS queue. Defaults to false.
   *
   * @default false
   */
  readonly useBase64?: boolean;
  /**
   * The IAM role that allows access to the sns topic.
   *
   * @default a new role will be created
   */
  readonly role?: iam.IRole;
}

/**
 * The action to send data from an MQTT message to an Amazon SQS queue.
 */
export class SqsAction implements IAction {
  private readonly useBase64?: boolean;
  private readonly role?: iam.IRole;

  /**
   * @param queue The URL of the Amazon SQS queue to which to write the data.
   * @param props Optional properties to not use default
   */
  constructor(private readonly queue: sqs.IQueue, props: SqsActionProps = {}) {
    this.useBase64 = props.useBase64;
    this.role = props.role;
  }

  bind(rule: ITopicRule): ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    this.queue.grant(role, 'sqs:SendMessage');

    return {
      sqs: {
        queueUrl: this.queue.queueUrl,
        useBase64: this.useBase64 ?? false,
        roleArn: role.roleArn,
      },
    };
  }
}
