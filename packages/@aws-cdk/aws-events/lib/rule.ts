import { CfnOutput, Construct, Resource, Token } from '@aws-cdk/cdk';
import { EventPattern } from './event-pattern';
import { CfnRule } from './events.generated';
import { EventRuleAttributes, IEventRule } from './rule-ref';
import { IEventRuleTarget } from './target';
import { mergeEventPattern } from './util';

export interface EventRuleProps {
  /**
   * A description of the rule's purpose.
   */
  readonly description?: string;

  /**
   * A name for the rule. If you don't specify a name, AWS CloudFormation
   * generates a unique physical ID and uses that ID for the rule name. For
   * more information, see Name Type.
   */
  readonly ruleName?: string;

  /**
   * Indicates whether the rule is enabled.
   * @default Rule is enabled
   */
  readonly enabled?: boolean;

  /**
   * The schedule or rate (frequency) that determines when CloudWatch Events
   * runs the rule. For more information, see Schedule Expression Syntax for
   * Rules in the Amazon CloudWatch User Guide.
   *
   * @see http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
   *
   * You must specify this property, the `eventPattern` property, or both.
   */
  readonly scheduleExpression?: string;

  /**
   * Describes which events CloudWatch Events routes to the specified target.
   * These routed events are matched events. For more information, see Events
   * and Event Patterns in the Amazon CloudWatch User Guide.
   *
   * @see
   * http://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/CloudWatchEventsandEventPatterns.html
   *
   * You must specify this property (either via props or via
   * `addEventPattern`), the `scheduleExpression` property, or both. The
   * method `addEventPattern` can be used to add filter values to the event
   * pattern.
   */
  readonly eventPattern?: EventPattern;

  /**
   * Targets to invoke when this rule matches an event.
   *
   * Input will be the full matched event. If you wish to specify custom
   * target input, use `addTarget(target[, inputOptions])`.
   */
  readonly targets?: IEventRuleTarget[];
}

/**
 * Defines a CloudWatch Event Rule in this stack.
 *
 * @resource AWS::Events::Rule
 */
export class EventRule extends Resource implements IEventRule {

  public static fromEventRuleArn(scope: Construct, id: string, eventRuleArn: string): IEventRule {
    class Import extends Resource implements IEventRule {
      public ruleArn = eventRuleArn;
      public export(): EventRuleAttributes {
        return { eventRuleArn };
      }
    }
    return new Import(scope, id);
  }

  public readonly ruleArn: string;

  private readonly targets = new Array<CfnRule.TargetProperty>();
  private readonly eventPattern: EventPattern = { };
  private scheduleExpression?: string;

  constructor(scope: Construct, id: string, props: EventRuleProps = { }) {
    super(scope, id);

    const resource = new CfnRule(this, 'Resource', {
      name: props.ruleName,
      description: props.description,
      state: props.enabled == null ? 'ENABLED' : (props.enabled ? 'ENABLED' : 'DISABLED'),
      scheduleExpression: new Token(() => this.scheduleExpression).toString(),
      eventPattern: new Token(() => this.renderEventPattern()),
      targets: new Token(() => this.renderTargets())
    });

    this.ruleArn = resource.ruleArn;

    this.addEventPattern(props.eventPattern);
    this.scheduleExpression = props.scheduleExpression;

    for (const target of props.targets || []) {
      this.addTarget(target);
    }
  }

  /**
   * Exports this rule resource from this stack and returns an import token.
   */
  public export(): EventRuleAttributes {
    return {
      eventRuleArn: new CfnOutput(this, 'RuleArn', { value: this.ruleArn }).makeImportValue().toString()
    };
  }

  /**
   * Adds a target to the rule. The abstract class RuleTarget can be extended to define new
   * targets.
   *
   * No-op if target is undefined.
   */
  public addTarget(target?: IEventRuleTarget) {
    if (!target) { return; }

    const targetProps = target.bind(this);

    // check if a target with this ID already exists
    if (this.targets.find(t => t.id === targetProps.id)) {
      throw new Error('Duplicate event rule target with ID: ' + targetProps.id);
    }

    this.targets.push({
      ...targetProps,
      inputTransformer: targetProps.inputTemplate !== undefined && targetProps.inputPathsMap !== undefined ? {
        inputTemplate: targetProps.inputTemplate,
        inputPathsMap: targetProps.inputPathsMap,
      } : undefined,
    });
  }

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
  public addEventPattern(eventPattern?: EventPattern) {
    if (!eventPattern) {
      return;
    }
    mergeEventPattern(this.eventPattern, eventPattern);
  }

  protected validate() {
    if (Object.keys(this.eventPattern).length === 0 && !this.scheduleExpression) {
      return [ `Either 'eventPattern' or 'scheduleExpression' must be defined` ];
    }

    return [ ];
  }

  private renderTargets() {
    if (this.targets.length === 0) {
      return undefined;
    }

    return this.targets;
  }

  private renderEventPattern() {
    const eventPattern = this.eventPattern;

    if (Object.keys(eventPattern).length === 0) {
      return undefined;
    }

    // rename 'detailType' to 'detail-type'
    const out: any = {};
    for (let key of Object.keys(eventPattern)) {
      const value = (eventPattern as any)[key];
      if (key === 'detailType') {
        key = 'detail-type';
      }
      out[key] = value;
    }

    return out;
  }
}
