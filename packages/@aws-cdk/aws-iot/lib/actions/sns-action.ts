import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import { IAction, ActionConfig, ITopicRule } from '..';
import { singletonActionRole } from './util';

/**
 * Configuration properties of an action for sns.
 */
export interface SnsActionProps {
  /**
   * The message format.
   *
   * @default MessageFormat.RAW
   */
  readonly messageFormat?: MessageFormat;
  /**
   * The IAM role that allows access to the sns topic.
   *
   * @default a new role will be created
   */
  readonly role?: iam.IRole;
}

/**
 * The message format. Amazon SNS uses this setting to determine if the payload should be
 * parsed and if relevant platform-specific parts of the payload should be extracted.
 */
export enum MessageFormat {
  /**
   * AWS SNS will parse messages to json
   */
  JSON = 'JSON',
  /**
   * AWS SNS will use messages with raw
   */
  RAW = 'RAW',
}

/**
 * The action to send the data from an MQTT message as an Amazon SNS push notification.
 */
export class SnsAction implements IAction {
  private readonly messageFormat?: MessageFormat;
  private readonly role?: iam.IRole;

  /**
   * @param topic The SNS topic  to which the push notification is sent.
   * @param props Optional properties to not use default
   */
  constructor(private readonly topic: sns.ITopic, props: SnsActionProps = {}) {
    this.messageFormat = props.messageFormat;
    this.role = props.role;
  }

  bind(rule: ITopicRule): ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    this.topic.grantPublish(role);

    return {
      sns: {
        messageFormat: this.messageFormat ?? MessageFormat.RAW,
        roleArn: role.roleArn,
        targetArn: this.topic.topicArn,
      },
    };
  }
}
