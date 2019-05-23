import { EventPattern } from "./event-pattern";
import { IRuleTarget } from "./target";

/**
 * Standard set of options for `onXxx` event handlers on construct
 */
export interface OnEventOptions {
  /**
   * The target to register for the event
   */
  readonly target: IRuleTarget;

  /**
   * A description of the rule's purpose.
   */
  readonly description?: string;

  /**
   * A name for the rule.
   *
   * @default AWS CloudFormation generates a unique physical ID.
   */
  readonly ruleName?: string;

  /**
   * Additional restrictions for the event to route to the specified target
   *
   * The method that generates the rule probably imposes some type of event
   * filtering. The filtering implied by what you pass here is added
   * on top of that filtering.
   *
   * @see
   * http://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/CloudWatchEventsandEventPatterns.html
   */
  readonly eventPattern?: EventPattern;
}