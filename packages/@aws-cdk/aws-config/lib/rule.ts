import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import { Construct, IResource, Resource, Token } from '@aws-cdk/cdk';
import { CfnConfigRule } from './config.generated';

/**
 * A config rule.
 */
export interface IRule extends IResource {
  /**
   * The name of the rule.
   * @attribute
   */
  readonly configRuleName: string;

  /**
   * The arn of the rule.
   * @attribute
   */
  readonly configRuleArn?: string;

  /**
   * The id of the rule.
   * @attribute
   */
  readonly configRuleId?: string;

  /**
   * The compliance status of the rule.
   * @attribute
   */
  readonly configRuleComplianceType?: string;

  /**
   * Defines a CloudWatch event rule which triggers for rule events. Use
   * `rule.addEventPattern(pattern)` to specify a filter.
   */
  onEvent(id: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps): events.EventRule;

  /**
   * Defines a CloudWatch event rule which triggers for rule compliance events.
   */
  onComplianceChange(id: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps): events.EventRule;

  /**
   * Defines a CloudWatch event rule which triggers for rule re-evaluation status events.
   */
  onReEvaluationStatus(id: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps): events.EventRule;
}

/**
 * Reference to an existing rule.
 */
export interface RuleAttributes {
  /**
   * The rule name.
   */
  readonly configRuleName: string;
}

/**
 * A new or imported rule.
 */
abstract class RuleBase extends Resource implements IRule {
  /**
   * Imports an existing rule.
   *
   * @param configRuleName the name of the rule
   */
  public static fromConfigRuleName(scope: Construct, id: string, configRuleName: string): IRule {
    class Import extends RuleBase {
      public readonly configRuleName = configRuleName;

      public export(): RuleAttributes {
        return { configRuleName };
      }
    }

    return new Import(scope, id);
  }

  public abstract readonly configRuleName: string;

  /**
   * Defines a CloudWatch event rule which triggers for rule events. Use
   * `rule.addEventPattern(pattern)` to specify a filter.
   */
  public onEvent(id: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
    const rule = new events.EventRule(this, id, options);
    rule.addEventPattern({
      source: ['aws.config'],
      detail: {
        configRuleName: [this.configRuleName]
      }
    });
    rule.addTarget(target);
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers for rule compliance events.
   */
  public onComplianceChange(id: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps): events.EventRule {
    const rule = this.onEvent(id, target, options);
    rule.addEventPattern({
      detailType: [ 'Config Rules Compliance Change' ],
    });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers for rule re-evaluation status events.
   */
  public onReEvaluationStatus(id: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps): events.EventRule {
    const rule = this.onEvent(id, target, options);
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
  public abstract readonly configRuleArn: string;
  public abstract readonly configRuleId: string;
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
  public addResourceScope(type: string, identifier?: string) {
    this.addScope({
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
  public addResourcesScope(...types: string[]) {
    this.addScope({
      complianceResourceTypes: types
    });
  }

  /**
   * Restrict scope of changes to a specific tag.
   *
   * @param key the tag key
   * @param value the tag value
   */
  public addTagScope(key: string, value?: string) {
    this.addScope({
      tagKey: key,
      tagValue: value
    });
  }

  private addScope(scope: CfnConfigRule.ScopeProperty) {
    if (!this.isManaged && !this.isCustomWithChanges) {
      throw new Error('Cannot set scope when `configurationChanges` is set to false.');
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
   * @default a CloudFormation genereated named
   */
  readonly name?: string;

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
  public readonly configRuleName: string;
  public readonly configRuleArn: string;
  public readonly configRuleId: string;
  public readonly configRuleComplianceType: string;

  constructor(scope: Construct, id: string, props: ManagedRuleProps) {
    super(scope, id);

    const rule = new CfnConfigRule(this, 'Resource', {
      configRuleName: props.name,
      description: props.description,
      inputParameters: props.inputParameters,
      maximumExecutionFrequency: props.maximumExecutionFrequency,
      scope: new Token(() => this.scope),
      source: {
        owner: 'AWS',
        sourceIdentifier: props.identifier
      }
    });

    this.configRuleName = rule.configRuleName;
    this.configRuleArn = rule.configRuleArn;
    this.configRuleId = rule.configRuleId;
    this.configRuleComplianceType = rule.configRuleComplianceType;

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
  public readonly configRuleName: string;
  public readonly configRuleArn: string;
  public readonly configRuleId: string;
  public readonly configRuleComplianceType: string;

  constructor(scope: Construct, id: string, props: CustomRuleProps) {
    super(scope, id);

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
      props.lambdaFunction.role.attachManagedPolicy(
        new iam.AwsManagedPolicy('service-role/AWSConfigRulesExecutionRole', this).policyArn
      );
    }

    // The lambda permission must be created before the rule
    this.node.addDependency(props.lambdaFunction);

    const rule = new CfnConfigRule(this, 'Resource', {
      configRuleName: props.name,
      description: props.description,
      inputParameters: props.inputParameters,
      maximumExecutionFrequency: props.maximumExecutionFrequency,
      scope: new Token(() => this.scope),
      source: {
        owner: 'CUSTOM_LAMBDA',
        sourceDetails,
        sourceIdentifier: props.lambdaFunction.functionArn
      }
    });

    this.configRuleName = rule.configRuleName;
    this.configRuleArn = rule.configRuleArn;
    this.configRuleId = rule.configRuleId;
    this.configRuleComplianceType = rule.configRuleComplianceType;

    if (props.configurationChanges) {
      this.isCustomWithChanges = true;
    }
  }
}
