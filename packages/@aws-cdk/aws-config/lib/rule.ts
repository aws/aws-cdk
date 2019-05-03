import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import { CfnOutput, Construct, IResource, Resource, Token } from '@aws-cdk/cdk';
import { CfnConfigRule } from './config.generated';

/**
 * A config rule.
 */
export interface IRule extends IResource {
  /**
   * The name of the rule.
   */
  readonly ruleName: string;

  /**
   * Exports this rule from stack.
   */
  export(): RuleAttributes;

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
  readonly ruleName: string;
}

/**
 * A new or imported rule.
 */
abstract class RuleBase extends Resource implements IRule {
  /**
   * Imports an existing rule.
   */
  public static fromRuleName(scope: Construct, id: string, ruleName: string): IRule {
    class Import extends RuleBase implements IRule {
      public readonly ruleName = ruleName;

      public export(): RuleAttributes {
        return { ruleName };
      }
    }

    return new Import(scope, id);
  }

  public abstract readonly ruleName: string;

  public abstract export(): RuleAttributes;

  /**
   * Defines a CloudWatch event rule which triggers for rule events. Use
   * `rule.addEventPattern(pattern)` to specify a filter.
   */
  public onEvent(id: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
    const rule = new events.EventRule(this, id, options);
    rule.addEventPattern({
      source: ['aws.config'],
      detail: {
        configRuleName: [this.ruleName]
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
abstract class RuleNew extends RuleBase implements IRule {
  /**
   * The arn of the rule.
   */
  public abstract readonly ruleArn: string;

  /**
   * The id of the rule.
   */
  public abstract readonly ruleId: string;

  /**
   * The compliance status of the rule.
   */
  public abstract readonly ruleComplianceType: string;

  protected scope?: CfnConfigRule.ScopeProperty;
  protected isManaged?: boolean;
  protected isCustomWithChanges?: boolean;

  /**
   * Exports this rule from the stack.
   */
  public export(): RuleAttributes {
    return {
      ruleName: new CfnOutput(this, 'RuleName', { value: this.ruleName }).makeImportValue().toString()
    };
  }

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
 */
export class ManagedRule extends RuleNew implements IRule {
  public readonly ruleName: string;
  public readonly ruleArn: string;
  public readonly ruleId: string;
  public readonly ruleComplianceType: string;

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

    this.ruleName = rule.configRuleName;
    this.ruleArn = rule.configRuleArn;
    this.ruleId = rule.configRuleId;
    this.ruleComplianceType = rule.configRuleComplianceType;

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
 */
export class CustomRule extends RuleNew implements IRule {
  public readonly ruleName: string;
  public readonly ruleArn: string;
  public readonly ruleId: string;
  public readonly ruleComplianceType: string;

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

    this.ruleName = rule.configRuleName;
    this.ruleArn = rule.configRuleArn;
    this.ruleId = rule.configRuleId;
    this.ruleComplianceType = rule.configRuleComplianceType;

    if (props.configurationChanges) {
      this.isCustomWithChanges = true;
    }
  }
}
