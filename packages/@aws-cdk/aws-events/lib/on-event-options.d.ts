import { Construct } from 'constructs';
import { EventPattern } from './event-pattern';
import { IRuleTarget } from './target';
/**
 * Common options for Events.
 */
export interface EventCommonOptions {
    /**
     * A description of the rule's purpose.
     *
     * @default - No description
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
     * @default - No additional filtering based on an event pattern.
     *
     * @see
     * https://docs.aws.amazon.com/eventbridge/latest/userguide/eventbridge-and-event-patterns.html
     */
    readonly eventPattern?: EventPattern;
    /**
     * The scope to use if the source of the rule and its target are in different Stacks
     * (but in the same account & region).
     * This helps dealing with cycles that often arise in these situations.
     *
     * @default - none (the main scope will be used, even for cross-stack Events)
     */
    readonly crossStackScope?: Construct;
}
/**
 * Standard set of options for `onXxx` event handlers on construct
 */
export interface OnEventOptions extends EventCommonOptions {
    /**
     * The target to register for the event
     *
     * @default - No target is added to the rule. Use `addTarget()` to add a target.
     */
    readonly target?: IRuleTarget;
}
