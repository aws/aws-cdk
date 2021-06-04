import { Status, DetailType } from './rule';
import { IRuleTarget } from './target';

/**
 * Standard set of options for `notifyOnXxx` codestar notification handler on construct
 */
export interface NotifyOnEventOptions {
  /**
   * The name for the notification rule.
   * Notification rule names must be unique in your AWS account.
   *
   * @default - generated from the `id`
   */
  readonly ruleName?: string;

  /**
   * The target to register for the notification destination.
   *
   * @default - No target is added to the rule. Use `addTarget()` to add a target.
   */
  readonly target?: IRuleTarget;

  /**
   * A list of event types associated with this notification rule.
   * For a complete list of event types and IDs, see Notification concepts in the Developer Tools Console User Guide.
   * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#concepts-api
   *
   * You must specify this property (either via props or via `addEvents`)
   *
   * @default - No events.
   */
  readonly events?: string[];

  /**
   * The status of the notification rule.
   * If the status is set to DISABLED, notifications aren't sent for the notification rule.
   *
   * @default Status.ENABLED
   */
  readonly status?: Status;

  /**
   * The level of detail to include in the notifications for this resource.
   * BASIC will include only the contents of the event as it would appear in AWS CloudWatch.
   * FULL will include any supplemental information provided by AWS CodeStar Notifications and/or the service for the resource for which the notification is created.
   *
   * @default DetailType.FULL
   */
  readonly detailType?: DetailType;
}