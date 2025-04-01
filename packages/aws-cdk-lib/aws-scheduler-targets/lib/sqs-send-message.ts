import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { IRole } from '../../aws-iam';
import { ISchedule, IScheduleTarget, ScheduleTargetConfig } from '../../aws-scheduler';
import * as sqs from '../../aws-sqs';
import { Token } from '../../core';

/**
 * Properties for a SQS Queue Target
 */
export interface SqsSendMessageProps extends ScheduleTargetBaseProps {
  /**
   * The FIFO message group ID to use as the target.
   *
   * This must be specified when the target is a FIFO queue. If you specify
   * a FIFO queue as a target, the queue must have content-based deduplication enabled.
   *
   * A length of `messageGroupId` must be between 1 and 128.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sqsparameters.html#cfn-scheduler-schedule-sqsparameters-messagegroupid
   *
   * @default - no message group ID
   */
  readonly messageGroupId?: string;
}

/**
 * Use an Amazon SQS Queue as a target for AWS EventBridge Scheduler.
 */
export class SqsSendMessage extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly queue: sqs.IQueue,
    private readonly props: SqsSendMessageProps = {},
  ) {
    super(props, queue.queueArn);

    if (props.messageGroupId !== undefined) {
      if (!Token.isUnresolved(props.messageGroupId) && (props.messageGroupId.length < 1 || props.messageGroupId.length > 128)) {
        throw new Error(`messageGroupId length must be between 1 and 128, got ${props.messageGroupId.length}`);
      }
      if (!queue.fifo) {
        throw new Error('target must be a FIFO queue if messageGroupId is specified');
      }
      if (!(queue.node.defaultChild as sqs.CfnQueue).contentBasedDeduplication) {
        throw new Error('contentBasedDeduplication must be true if the target is a FIFO queue');
      }
    } else if (queue.fifo) {
      throw new Error('messageGroupId must be specified if the target is a FIFO queue');
    }
  }

  protected addTargetActionToRole(role: IRole): void {
    this.queue.grant(role, 'sqs:SendMessage');
    this.queue.encryptionMasterKey?.grant(role, 'kms:Decrypt', 'kms:GenerateDataKey*');
  }

  protected bindBaseTargetConfig(_schedule: ISchedule): ScheduleTargetConfig {
    return {
      ...super.bindBaseTargetConfig(_schedule),
      sqsParameters: {
        messageGroupId: this.props.messageGroupId,
      },
    };
  }
}
