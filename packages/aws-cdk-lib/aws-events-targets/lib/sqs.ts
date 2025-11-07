import { addToDeadLetterQueueResourcePolicy, TargetBaseProps, bindBaseTargetConfig } from './util';
import * as events from '../../aws-events';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as sqs from '../../aws-sqs';
import { Annotations, FeatureFlags, Resource, ValidationError } from '../../core';
import * as cxapi from '../../cx-api';

/**
 * Customize the SQS Queue Event Target
 */
export interface SqsQueueProps extends TargetBaseProps {

  /**
   * Message Group ID for messages sent to this queue
   *
   * Required for FIFO queues, leave empty for regular queues.
   *
   * @default - no message group ID (regular queue)
   */
  readonly messageGroupId?: string;

  /**
   * The message to send to the queue.
   *
   * Must be a valid JSON text passed to the target queue.
   *
   * @default the entire EventBridge event
   */
  readonly message?: events.RuleTargetInput;
}

/**
 * Use an SQS Queue as a target for Amazon EventBridge rules.
 *
 * @example
 *   /// fixture=withRepoAndSqsQueue
 *   // publish to an SQS queue every time code is committed
 *   // to a CodeCommit repository
 *   repository.onCommit('onCommit', { target: new targets.SqsQueue(queue) });
 *
 */
export class SqsQueue implements events.IRuleTarget {
  constructor(public readonly queue: sqs.IQueue, private readonly props: SqsQueueProps = {}) {
    if (props.messageGroupId !== undefined && !queue.fifo) {
      throw new ValidationError('messageGroupId cannot be specified for non-FIFO queues', queue);
    }
  }

  /**
   * Returns a RuleTarget that can be used to trigger this SQS queue as a
   * result from an EventBridge event.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html#sqs-permissions
   */
  public bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
    const restrictToSameAccount = FeatureFlags.of(rule).isEnabled(cxapi.EVENTS_TARGET_QUEUE_SAME_ACCOUNT);

    let conditions: any = {};
    if (!this.queue.encryptionMasterKey) {
      conditions = {
        ArnEquals: { 'aws:SourceArn': rule.ruleArn },
      };
    } else if (restrictToSameAccount) {
      // Add only the account id as a condition, to avoid circular dependency. See issue #11158.
      conditions = {
        StringEquals: { 'aws:SourceAccount': rule.env.account },
      };
    }

    // Check if the KMS key is imported and warn the user
    if (this.queue.encryptionMasterKey) {
      this.validateKmsKeyPermissions(rule, this.queue.encryptionMasterKey);
    }

    // deduplicated automatically
    this.queue.grantSendMessages(new iam.ServicePrincipal('events.amazonaws.com', { conditions }));

    if (this.props.deadLetterQueue) {
      addToDeadLetterQueueResourcePolicy(rule, this.props.deadLetterQueue);
    }

    return {
      ...bindBaseTargetConfig(this.props),
      arn: this.queue.queueArn,
      input: this.props.message,
      targetResource: this.queue,
      sqsParameters: this.props.messageGroupId ? { messageGroupId: this.props.messageGroupId } : undefined,
    };
  }

  private validateKmsKeyPermissions(rule: events.IRule, key: kms.IKey): void {
    // Check if the key is imported by verifying if it's not an owned resource.
    // Imported keys cannot have their policies modified by CDK.
    if (!Resource.isOwnedResource(key)) {
      Annotations.of(rule).addWarningV2('@aws-cdk/aws-events-targets:importedKmsKey',
        `This queue is encrypted with an imported KMS key (${key.keyId}). ` +
        'EventBridge cannot automatically add the required permissions to the key policy. ' +
        'You must manually add the following permissions to the KMS key policy:\n' +
        '  - kms:Decrypt\n' +
        '  - kms:GenerateDataKey\n' +
        'For the principal: { "Service": "events.amazonaws.com" }',
      );
    }
  }
}
