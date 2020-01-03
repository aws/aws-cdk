import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, IResource, Lazy, Resource } from '@aws-cdk/core';
import { CfnConfigRule } from './config.generated';

/**
 * A config rule.
 */
export interface IRule extends IResource {
  /**
   * The name of the rule.
   *
   * @attribute
   */
  readonly configRuleName: string;

  /**
   * Defines a CloudWatch event rule which triggers for rule events. Use
   * `rule.addEventPattern(pattern)` to specify a filter.
   */
  onEvent(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Defines a CloudWatch event rule which triggers for rule compliance events.
   */
  onComplianceChange(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Defines a CloudWatch event rule which triggers for rule re-evaluation status events.
   */
  onReEvaluationStatus(id: string, options?: events.OnEventOptions): events.Rule;
}

/**
 * A new or imported rule.
 */
abstract class RuleBase extends Resource implements IRule {
  public abstract readonly configRuleName: string;

  /**
   * Defines a CloudWatch event rule which triggers for rule events. Use
   * `rule.addEventPattern(pattern)` to specify a filter.
   */
  public onEvent(id: string, options: events.OnEventOptions = {}) {
    const rule = new events.Rule(this, id, options);
    rule.addEventPattern({
      source: ['aws.config'],
      detail: {
        configRuleName: [this.configRuleName]
      }
    });
    rule.addTarget(options.target);
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers for rule compliance events.
   */
  public onComplianceChange(id: string, options: events.OnEventOptions = {}): events.Rule {
    const rule = this.onEvent(id, options);
    rule.addEventPattern({
      detailType: [ 'Config Rules Compliance Change' ],
    });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers for rule re-evaluation status events.
   */
  public onReEvaluationStatus(id: string, options: events.OnEventOptions = {}): events.Rule {
    const rule = this.onEvent(id, options);
    rule.addEventPattern({
      detailType: [ 'Config Rules Re-evaluation Status' ],
    });
    return rule;
  }
}

/**
 * A new managed or custom rule.
 */
abstract class RuleNew extends RuleBase {
  /**
   * Imports an existing rule.
   *
   * @param configRuleName the name of the rule
   */
  public static fromConfigRuleName(scope: Construct, id: string, configRuleName: string): IRule {
    class Import extends RuleBase {
      public readonly configRuleName = configRuleName;
    }

    return new Import(scope, id);
  }

  /**
   * The arn of the rule.
   */
  public abstract readonly configRuleArn: string;

  /**
   * The id of the rule.
   */
  public abstract readonly configRuleId: string;

  /**
   * The compliance status of the rule.
   */
  public abstract readonly configRuleComplianceType: string;

  protected scope?: CfnConfigRule.ScopeProperty;
  protected isManaged?: boolean;
  protected isCustomWithChanges?: boolean;

  /**
   * Restrict scope of changes to a specific resource.
   *
   * @see https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html#supported-resources
   *
   * @param type the resource type
   * @param identifier the resource identifier
   */
  public scopeToResource(type: string, identifier?: string) {
    this.scopeTo({
      complianceResourceId: identifier,
      complianceResourceTypes: [type],
    });
  }

  /**
   * Restrict scope of changes to specific resource types.
   *
   * @see https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html#supported-resources
   *
   * @param types resource types
   */
  public scopeToResources(...types: string[]) {
    this.scopeTo({
      complianceResourceTypes: types
    });
  }

  /**
   * Restrict scope of changes to a specific tag.
   *
   * @param key the tag key
   * @param value the tag value
   */
  public scopeToTag(key: string, value?: string) {
    this.scopeTo({
      tagKey: key,
      tagValue: value
    });
  }

  private scopeTo(scope: CfnConfigRule.ScopeProperty) {
    if (!this.isManaged && !this.isCustomWithChanges) {
      throw new Error('Cannot scope rule when `configurationChanges` is set to false.');
    }

    this.scope = scope;
  }
}

/**
 * The maximum frequency at which the AWS Config rule runs evaluations.
 */
export enum MaximumExecutionFrequency {
  ONE_HOUR = 'One_Hour',
  THREE_HOURS = 'Three_Hours',
  SIX_HOURS = 'Six_Hours',
  TWELVE_HOURS = 'Twelve_Hours',
  TWENTY_FOUR_HOURS = 'TwentyFour_Hours'
}

/**
 * Construction properties for a new rule.
 */
export interface RuleProps {
  /**
   * A name for the AWS Config rule.
   *
   * @default a CloudFormation generated name
   */
  readonly configRuleName?: string;

  /**
   * A description about this AWS Config rule.
   *
   * @default no description
   */
  readonly description?: string;

  /**
   * Input parameter values that are passed to the AWS Config rule.
   *
   * @default no input parameters
   */
  readonly inputParameters?: { [key: string]: any };

  /**
   * The maximum frequency at which the AWS Config rule runs evaluations.
   *
   * @default 24 hours
   */
  readonly maximumExecutionFrequency?: MaximumExecutionFrequency
}

/**
 * Construction properties for a ManagedRule.
 */
export interface ManagedRuleProps extends RuleProps {
  /**
   * The identifier of the AWS managed rule.
   *
   * @see https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html
   */
  readonly identifier: string;
}

/**
 * A new managed rule.
 *
 * @resource AWS::Config::ConfigRule
 */
export class ManagedRule extends RuleNew {
  /** @attribute */
  public readonly configRuleName: string;

  /** @attribute */
  public readonly configRuleArn: string;

  /** @attribute */
  public readonly configRuleId: string;

  /** @attribute */
  public readonly configRuleComplianceType: string;

  constructor(scope: Construct, id: string, props: ManagedRuleProps) {
    super(scope, id, {
      physicalName: props.configRuleName,
    });

    const rule = new CfnConfigRule(this, 'Resource', {
      configRuleName: this.physicalName,
      description: props.description,
      inputParameters: props.inputParameters,
      maximumExecutionFrequency: props.maximumExecutionFrequency,
      scope: Lazy.anyValue({ produce: () => this.scope }),
      source: {
        owner: 'AWS',
        sourceIdentifier: props.identifier
      }
    });

    this.configRuleName = rule.ref;
    this.configRuleArn = rule.attrArn;
    this.configRuleId = rule.attrConfigRuleId;
    this.configRuleComplianceType = rule.attrComplianceType;

    this.isManaged = true;
  }
}

/**
 * Consruction properties for a CustomRule.
 */
export interface CustomRuleProps extends RuleProps {
  /**
   * The Lambda function to run.
   */
  readonly lambdaFunction: lambda.IFunction;

  /**
   * Whether to run the rule on configuration changes.
   *
   * @default false
   */
  readonly configurationChanges?: boolean;

  /**
   * Whether to run the rule on a fixed frequency.
   *
   * @default false
   */
  readonly periodic?: boolean;
}
/**
 * A new custom rule.
 *
 * @resource AWS::Config::ConfigRule
 */
export class CustomRule extends RuleNew {
  /** @attribute */
  public readonly configRuleName: string;

  /** @attribute */
  public readonly configRuleArn: string;

  /** @attribute */
  public readonly configRuleId: string;

  /** @attribute */
  public readonly configRuleComplianceType: string;

  constructor(scope: Construct, id: string, props: CustomRuleProps) {
    super(scope, id, {
      physicalName: props.configRuleName,
    });

    if (!props.configurationChanges && !props.periodic) {
      throw new Error('At least one of `configurationChanges` or `periodic` must be set to true.');
    }

    const sourceDetails: any[] = [];

    if (props.configurationChanges) {
      sourceDetails.push({
          eventSource: 'aws.config',
          messageType: 'ConfigurationItemChangeNotification'
        });
      sourceDetails.push({
          eventSource: 'aws.config',
          messageType: 'OversizedConfigurationItemChangeNotification'
        });
    }

    if (props.periodic) {
      sourceDetails.push({
        eventSource: 'aws.config',
        maximumExecutionFrequency: props.maximumExecutionFrequency,
        messageType: 'ScheduledNotification'
      });
    }

    props.lambdaFunction.addPermission('Permission', {
      principal: new iam.ServicePrincipal('config.amazonaws.com')
    });

    if (props.lambdaFunction.role) {
      props.lambdaFunction.role.addManagedPolicy(
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSConfigRulesExecutionRole')
      );
    }

    // The lambda permission must be created before the rule
    this.node.addDependency(props.lambdaFunction);

    const rule = new CfnConfigRule(this, 'Resource', {
      configRuleName: this.physicalName,
      description: props.description,
      inputParameters: props.inputParameters,
      maximumExecutionFrequency: props.maximumExecutionFrequency,
      scope: Lazy.anyValue({ produce: () => this.scope }),
      source: {
        owner: 'CUSTOM_LAMBDA',
        sourceDetails,
        sourceIdentifier: props.lambdaFunction.functionArn
      }
    });

    this.configRuleName = rule.ref;
    this.configRuleArn = rule.attrArn;
    this.configRuleId = rule.attrConfigRuleId;
    this.configRuleComplianceType = rule.attrComplianceType;

    if (props.configurationChanges) {
      this.isCustomWithChanges = true;
    }
  }
}
