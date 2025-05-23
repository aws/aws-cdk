import { addToDeadLetterQueueResourcePolicy, TargetBaseProps, bindBaseTargetConfig, singletonEventRole } from './util';
import * as events from '../../aws-events';
import * as iam from '../../aws-iam';
import * as sns from '../../aws-sns';
import { ValidationError } from '../../core';

/**
 * Customize the SNS Topic Event Target
 */
export interface SnsTopicProps extends TargetBaseProps {
  /**
   * The message to send to the topic
   *
   * @default the entire EventBridge event
   */
  readonly message?: events.RuleTargetInput;

  /**
   * Specifies whether an IAM role should be used to publish to the topic
   *
   * @default - true if `role` is provided, false otherwise
   */
  readonly authorizeUsingRole?: boolean;

  /**
   * The IAM role to be used to publish to the topic
   *
   * @default - a new role will be created if `authorizeUsingRole` is true
   */
  readonly role?: iam.IRole;
}

/**
 * Use an SNS topic as a target for Amazon EventBridge rules.
 * If the topic is imported the required permissions to publish to that topic need to be set manually.
 *
 * @example
 *   /// fixture=withRepoAndTopic
 *   // publish to an SNS topic every time code is committed
 *   // to a CodeCommit repository
 *   repository.onCommit('onCommit', { target: new targets.SnsTopic(topic) });
 *
 */
export class SnsTopic implements events.IRuleTarget {
  constructor(public readonly topic: sns.ITopic, private readonly props: SnsTopicProps = {}) {
  }

  /**
   * Returns a RuleTarget that can be used to trigger this SNS topic as a
   * result from an EventBridge event.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html#sns-permissions
   */
  public bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig {
    // role can't be passed when authorizeUsingRole is false
    if (this.props.authorizeUsingRole === false && this.props.role) {
      throw new ValidationError('Cannot provide a role when authorizeUsingRole is false', _rule);
    }

    // role is used when authorizeUsingRole is true or role is provided
    const useRole = this.props.authorizeUsingRole || this.props.role;

    // deduplicated automatically, only needed if role is not used
    if (!useRole) this.topic.grantPublish(new iam.ServicePrincipal('events.amazonaws.com'));

    const role = useRole ? this.props.role ?? singletonEventRole(_rule): undefined;
    if (role) this.topic.grantPublish(role);

    if (this.props.deadLetterQueue) {
      addToDeadLetterQueueResourcePolicy(_rule, this.props.deadLetterQueue);
    }

    return {
      ...bindBaseTargetConfig(this.props),
      arn: this.topic.topicArn,
      input: this.props.message,
      targetResource: this.topic,
      role,
    };
  }
}
