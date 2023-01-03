import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnMatchmakingRuleSet } from './gamelift.generated';
import { RuleSetContent } from './matchmaking-ruleset-body';


/**
 * Represents a Gamelift matchmaking ruleset
 */
export interface IMatchmakingRuleSet extends cdk.IResource {
  /**
   * The unique name of the ruleSet.
   *
   * @attribute
   */
  readonly matchmakingRuleSetName: string;

  /**
   * The ARN of the ruleSet.
   *
   * @attribute
   */
  readonly matchmakingRuleSetArn: string;

  /**
   * Return the given named metric for this matchmaking ruleSet.
   */
  metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Rule evaluations during the matchmaking process that passed since the last report.
   *
   * This metric is limited to the top 50 rules.
   */
  metricRuleEvaluationsPassed(props?: cloudwatch.MetricOptions): cloudwatch.Metric;


  /**
   * Rule evaluations during matchmaking that failed since the last report.
   *
   * This metric is limited to the top 50 rules.
   */
  metricRuleEvaluationsFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}

/**
 * Properties for a new matchmaking ruleSet
 */
export interface MatchmakingRuleSetProps {
  /**
     * A unique identifier for the matchmaking rule set.
     * A matchmaking configuration identifies the rule set it uses by this name value.
     *
     * Note: the rule set name is different from the optional name field in the rule set body
     */
  readonly matchmakingRuleSetName: string;

  /**
   * A collection of matchmaking rules.
   */
  readonly content: RuleSetContent;
}

/**
 * A full specification of a matchmaking ruleSet that can be used to import it fluently into the CDK application.
 */
export interface MatchmakingRuleSetAttributes {
  /**
       * The ARN of the matchmaking ruleSet
       *
       * At least one of `matchmakingRuleSetArn` and `matchmakingRuleSetName` must be provided.
       *
       * @default derived from `matchmakingRuleSetName`.
       */
  readonly matchmakingRuleSetArn?: string;

  /**
     * The unique name of the matchmaking ruleSet
     *
     * At least one of `ruleSetName` and `matchmakingRuleSetArn`  must be provided.
     *
     * @default derived from `matchmakingRuleSetArn`.
     */
  readonly matchmakingRuleSetName?: string;

}

/**
 * Base class for new and imported GameLift matchmaking ruleSet.
 */
export abstract class MatchmakingRuleSetBase extends cdk.Resource implements IMatchmakingRuleSet {

  /**
    * The unique name of the ruleSet.
    */
  public abstract readonly matchmakingRuleSetName: string;
  /**
   * The ARN of the ruleSet.
   */
  public abstract readonly matchmakingRuleSetArn: string;

  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/GameLift',
      metricName: metricName,
      dimensionsMap: {
        MatchmakingRuleSetName: this.matchmakingRuleSetName,
      },
      ...props,
    }).attachTo(this);
  }

  public metricRuleEvaluationsPassed(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('RuleEvaluationsPassed', props);
  }
  public metricRuleEvaluationsFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('RuleEvaluationsFailed', props);
  }
}

/**
 * Creates a new rule set for FlexMatch matchmaking.
 *
 * The rule set determines the two key elements of a match: your game's team structure and size, and how to group players together for the best possible match.
 *
 * For example, a rule set might describe a match like this:
 *  - Create a match with two teams of five players each, one team is the defenders and the other team the invaders.
 *  - A team can have novice and experienced players, but the average skill of the two teams must be within 10 points of each other.
 *  - If no match is made after 30 seconds, gradually relax the skill requirements.
 *
 * Rule sets must be defined in the same Region as the matchmaking configuration they are used with.
 *
 * @see https://docs.aws.amazon.com/gamelift/latest/flexmatchguide/match-rulesets.html
 *
 * @resource AWS::GameLift::MatchmakingRuleSet
 */
export class MatchmakingRuleSet extends MatchmakingRuleSetBase {

  /**
     * Import a ruleSet into CDK using its name
     */
  static fromMatchmakingRuleSetName(scope: Construct, id: string, matchmakingRuleSetName: string): IMatchmakingRuleSet {
    return this.fromMatchmakingRuleSetAttributes(scope, id, { matchmakingRuleSetName });
  }

  /**
     * Import a ruleSet into CDK using its ARN
     */
  static fromMatchmakingRuleSetArn(scope: Construct, id: string, matchmakingRuleSetArn: string): IMatchmakingRuleSet {
    return this.fromMatchmakingRuleSetAttributes(scope, id, { matchmakingRuleSetArn });
  }

  /**
   * Import an existing matchmaking ruleSet from its attributes.
   */
  static fromMatchmakingRuleSetAttributes(scope: Construct, id: string, attrs: MatchmakingRuleSetAttributes): IMatchmakingRuleSet {
    if (!attrs.matchmakingRuleSetName && !attrs.matchmakingRuleSetArn) {
      throw new Error('Either matchmakingRuleSetName or matchmakingRuleSetArn must be provided in MatchmakingRuleSetAttributes');
    }
    const matchmakingRuleSetName = attrs.matchmakingRuleSetName ??
      cdk.Stack.of(scope).splitArn(attrs.matchmakingRuleSetArn!, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName;

    if (!matchmakingRuleSetName) {
      throw new Error(`No matchmaking ruleSet identifier found in ARN: '${attrs.matchmakingRuleSetArn}'`);
    }

    const matchmakingRuleSetArn = attrs.matchmakingRuleSetArn ?? cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'matchmakingruleset',
      resourceName: attrs.matchmakingRuleSetName,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
    class Import extends MatchmakingRuleSetBase {
      public readonly matchmakingRuleSetName = matchmakingRuleSetName!;
      public readonly matchmakingRuleSetArn = matchmakingRuleSetArn;

      constructor(s: Construct, i: string) {
        super(s, i, {
          environmentFromArn: matchmakingRuleSetArn,
        });
      }
    }
    return new Import(scope, id);
  }

  /**
   * The unique name of the ruleSet.
   */
  public readonly matchmakingRuleSetName: string;

  /**
    * The ARN of the ruleSet.
    */
  public readonly matchmakingRuleSetArn: string;

  constructor(scope: Construct, id: string, props: MatchmakingRuleSetProps) {
    super(scope, id, {
      physicalName: props.matchmakingRuleSetName,
    });

    if (!cdk.Token.isUnresolved(props.matchmakingRuleSetName)) {
      if (props.matchmakingRuleSetName.length > 128) {
        throw new Error(`RuleSet name can not be longer than 128 characters but has ${props.matchmakingRuleSetName.length} characters.`);
      }

      if (!/^[a-zA-Z0-9-\.]+$/.test(props.matchmakingRuleSetName)) {
        throw new Error(`RuleSet name ${props.matchmakingRuleSetName} can contain only letters, numbers, hyphens, back slash or dot with no spaces.`);
      }
    }
    const content = props.content.bind(this);

    const resource = new CfnMatchmakingRuleSet(this, 'Resource', {
      name: props.matchmakingRuleSetName,
      ruleSetBody: content.ruleSetBody,
    });

    this.matchmakingRuleSetName = this.getResourceNameAttribute(resource.ref);
    this.matchmakingRuleSetArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'gamelift',
      resource: 'matchmakingruleset',
      resourceName: this.physicalName,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
  }


}