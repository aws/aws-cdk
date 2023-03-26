import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IEventBus } from './event-bus';
import { EventPattern } from './event-pattern';
import { EventCommonOptions } from './on-event-options';
import { IRule } from './rule-ref';
import { Schedule } from './schedule';
import { IRuleTarget } from './target';
/**
 * Properties for defining an EventBridge Rule
 */
export interface RuleProps extends EventCommonOptions {
    /**
     * Indicates whether the rule is enabled.
     *
     * @default true
     */
    readonly enabled?: boolean;
    /**
     * The schedule or rate (frequency) that determines when EventBridge
     * runs the rule.
     *
     * You must specify this property, the `eventPattern` property, or both.
     *
     * For more information, see Schedule Expression Syntax for
     * Rules in the Amazon EventBridge User Guide.
     *
     * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/scheduled-events.html
     *
     * @default - None.
     */
    readonly schedule?: Schedule;
    /**
     * Targets to invoke when this rule matches an event.
     *
     * Input will be the full matched event. If you wish to specify custom
     * target input, use `addTarget(target[, inputOptions])`.
     *
     * @default - No targets.
     */
    readonly targets?: IRuleTarget[];
    /**
     * The event bus to associate with this rule.
     *
     * @default - The default event bus.
     */
    readonly eventBus?: IEventBus;
}
/**
 * Defines an EventBridge Rule in this stack.
 *
 * @resource AWS::Events::Rule
 */
export declare class Rule extends Resource implements IRule {
    /**
     * Import an existing EventBridge Rule provided an ARN
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name.
     * @param eventRuleArn Event Rule ARN (i.e. arn:aws:events:<region>:<account-id>:rule/MyScheduledRule).
     */
    static fromEventRuleArn(scope: Construct, id: string, eventRuleArn: string): IRule;
    readonly ruleArn: string;
    readonly ruleName: string;
    private readonly targets;
    private readonly eventPattern;
    private readonly scheduleExpression?;
    private readonly description?;
    /** Set to keep track of what target accounts and regions we've already created event buses for */
    private readonly _xEnvTargetsAdded;
    constructor(scope: Construct, id: string, props?: RuleProps);
    /**
     * Adds a target to the rule. The abstract class RuleTarget can be extended to define new
     * targets.
     *
     * No-op if target is undefined.
     */
    addTarget(target?: IRuleTarget): void;
    /**
     * Adds an event pattern filter to this rule. If a pattern was already specified,
     * these values are merged into the existing pattern.
     *
     * For example, if the rule already contains the pattern:
     *
     *    {
     *      "resources": [ "r1" ],
     *      "detail": {
     *        "hello": [ 1 ]
     *      }
     *    }
     *
     * And `addEventPattern` is called with the pattern:
     *
     *    {
     *      "resources": [ "r2" ],
     *      "detail": {
     *        "foo": [ "bar" ]
     *      }
     *    }
     *
     * The resulting event pattern will be:
     *
     *    {
     *      "resources": [ "r1", "r2" ],
     *      "detail": {
     *        "hello": [ 1 ],
     *        "foo": [ "bar" ]
     *      }
     *    }
     *
     */
    addEventPattern(eventPattern?: EventPattern): void;
    /**
     * Not private only to be overrideen in CopyRule.
     *
     * @internal
     */
    _renderEventPattern(): any;
    protected validateRule(): string[];
    private renderTargets;
    /**
     * Make sure we add the target environments event bus as a target, and the target has permissions set up to receive our events
     *
     * For cross-account rules, uses a support stack to set up a policy on the target event bus.
     */
    private ensureXEnvTargetEventBus;
    /**
     * Return the scope where the mirror rule should be created for x-env event targets
     *
     * This is the target resource's containing stack if it shares the same region (owned
     * resources), or should be a fresh support stack for imported resources.
     *
     * We don't implement the second yet, as I have to think long and hard on whether we
     * can reuse the existing support stack or not, and I don't have time for that right now.
     */
    private obtainMirrorRuleScope;
    /**
     * Obtain the Role for the EventBridge event
     *
     * If a role already exists, it will be returned. This ensures that if multiple
     * events have the same target, they will share a role.
     * @internal
     */
    private crossRegionPutEventsRole;
    /**
     * Whether two string probably contain the same environment dimension (region or account)
     *
     * Used to compare either accounts or regions, and also returns true if one or both
     * are unresolved (in which case both are expected to be "current region" or "current account").
     */
    private sameEnvDimension;
}
