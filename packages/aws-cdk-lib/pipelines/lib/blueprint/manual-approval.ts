import { Step } from './step';
import { ITopic } from '../../../aws-sns';
/**
 * Construction properties for a `ManualApprovalStep`
 */
export interface ManualApprovalStepProps {
  /**
   * The comment to display with this manual approval
   *
   * @default - No comment
   */
  readonly comment?: string;

  /**
   * The URL for review associated with this manual approval
   *
   * @default - No URL
   */
  readonly reviewUrl?: string;

  /**
   * Optional SNS topic to send notifications to when an approval is pending
   *
   * @default - No notifications
   */
  readonly notificationTopic?: ITopic;
}

/**
 * A manual approval step
 *
 * If this step is added to a Pipeline, the Pipeline will
 * be paused waiting for a human to resume it
 *
 * Only engines that support pausing the deployment will
 * support this step type.
 */
export class ManualApprovalStep extends Step {
  /**
   * The comment associated with this manual approval
   *
   * @default - No comment
   */
  public readonly comment?: string;

  /**
   * The URL for review associated with this manual approval
   *
   * @default - No URL
   */
  public readonly reviewUrl?: string;

  /**
   * Optional SNS topic to send notifications
   *
   * @default - No notifications
   */
  public readonly notificationTopic?: ITopic;

  constructor(id: string, props: ManualApprovalStepProps = {}) {
    super(id);

    this.comment = props.comment;
    this.reviewUrl = props.reviewUrl;
    this.notificationTopic = props.notificationTopic;

    this.discoverReferencedOutputs(props.comment);
  }
}
