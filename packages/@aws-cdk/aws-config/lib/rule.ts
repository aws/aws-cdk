import { createHash } from 'crypto';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { IResource, Lazy, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnConfigRule } from './config.generated';

/**
 * Interface representing an AWS Config rule
 */
export interface IRule extends IResource {
  /**
   * The name of the rule.
   *
   * @attribute
   */
  readonly configRuleName: string;

  /**
   * Defines an EventBridge event rule which triggers for rule events. Use
   * `rule.addEventPattern(pattern)` to specify a filter.
   */
  onEvent(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Defines a EventBridge event rule which triggers for rule compliance events.
   */
  onComplianceChange(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Defines a EventBridge event rule which triggers for rule re-evaluation status events.
   */
  onReEvaluationStatus(id: string, options?: events.OnEventOptions): events.Rule;
}

/**
 * A new or imported rule.
 */
abstract class RuleBase extends Resource implements IRule {
  public abstract readonly configRuleName: string;

  /**
   * Defines an EventBridge event rule which triggers for rule events. Use
   * `rule.addEventPattern(pattern)` to specify a filter.
   */
  public onEvent(id: string, options: events.OnEventOptions = {}) {
    const rule = new events.Rule(this, id, options);
    rule.addEventPattern({
      source: ['aws.config'],
      detail: {
        configRuleName: [this.configRuleName],
      },
    });
    rule.addTarget(options.target);
    return rule;
  }

  /**
   * Defines an EventBridge event rule which triggers for rule compliance events.
   */
  public onComplianceChange(id: string, options: events.OnEventOptions = {}): events.Rule {
    const rule = this.onEvent(id, options);
    rule.addEventPattern({
      detailType: ['Config Rules Compliance Change'],
    });
    return rule;
  }

  /**
   * Defines an EventBridge event rule which triggers for rule re-evaluation status events.
   */
  public onReEvaluationStatus(id: string, options: events.OnEventOptions = {}): events.Rule {
    const rule = this.onEvent(id, options);
    rule.addEventPattern({
      detailType: ['Config Rules Re-evaluation Status'],
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

  protected ruleScope?: RuleScope;
  protected isManaged?: boolean;
  protected isCustomWithChanges?: boolean;
}

/**
 * Determines which resources trigger an evaluation of an AWS Config rule.
 */
export class RuleScope {
  /** restricts scope of changes to a specific resource type or resource identifier */
  public static fromResource(resourceType: ResourceType, resourceId?: string) {
    return new RuleScope(resourceId, [resourceType]);
  }
  /** restricts scope of changes to specific resource types */
  public static fromResources(resourceTypes: ResourceType[]) {
    return new RuleScope(undefined, resourceTypes);
  }
  /** restricts scope of changes to a specific tag */
  public static fromTag(key: string, value?: string) {
    return new RuleScope(undefined, undefined, key, value);
  }

  /** Resource types that will trigger evaluation of a rule */
  public readonly resourceTypes?: ResourceType[];

  /** ID of the only AWS resource that will trigger evaluation of a rule */
  public readonly resourceId?: string;

  /** tag key applied to resources that will trigger evaluation of a rule  */
  public readonly key?: string;

  /** tag value applied to resources that will trigger evaluation of a rule */
  public readonly value?: string;

  private constructor(resourceId?: string, resourceTypes?: ResourceType[], tagKey?: string, tagValue?: string) {
    this.resourceTypes = resourceTypes;
    this.resourceId = resourceId;
    this.key = tagKey;
    this.value = tagValue;
  }
}

/**
 * The maximum frequency at which the AWS Config rule runs evaluations.
 */
export enum MaximumExecutionFrequency {

  /**
   * 1 hour.
   */
  ONE_HOUR = 'One_Hour',

  /**
   * 3 hours.
   */
  THREE_HOURS = 'Three_Hours',

  /**
   * 6 hours.
   */
  SIX_HOURS = 'Six_Hours',

  /**
   * 12 hours.
   */
  TWELVE_HOURS = 'Twelve_Hours',

  /**
   * 24 hours.
   */
  TWENTY_FOUR_HOURS = 'TwentyFour_Hours'
}

/**
 * Construction properties for a new rule.
 */
export interface RuleProps {
  /**
   * A name for the AWS Config rule.
   *
   * @default - CloudFormation generated name
   */
  readonly configRuleName?: string;

  /**
   * A description about this AWS Config rule.
   *
   * @default - No description
   */
  readonly description?: string;

  /**
   * Input parameter values that are passed to the AWS Config rule.
   *
   * @default - No input parameters
   */
  readonly inputParameters?: { [key: string]: any };

  /**
   * The maximum frequency at which the AWS Config rule runs evaluations.
   *
   * @default MaximumExecutionFrequency.TWENTY_FOUR_HOURS
   */
  readonly maximumExecutionFrequency?: MaximumExecutionFrequency;

  /**
   * Defines which resources trigger an evaluation for an AWS Config rule.
   *
   * @default - evaluations for the rule are triggered when any resource in the recording group changes.
   */
  readonly ruleScope?: RuleScope;
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

    this.ruleScope = props.ruleScope;

    const rule = new CfnConfigRule(this, 'Resource', {
      configRuleName: this.physicalName,
      description: props.description,
      inputParameters: props.inputParameters,
      maximumExecutionFrequency: props.maximumExecutionFrequency,
      scope: Lazy.any({ produce: () => renderScope(this.ruleScope) }), // scope can use values such as stack id (see CloudFormationStackDriftDetectionCheck)
      source: {
        owner: 'AWS',
        sourceIdentifier: props.identifier,
      },
    });

    this.configRuleName = rule.ref;
    this.configRuleArn = rule.attrArn;
    this.configRuleId = rule.attrConfigRuleId;
    this.configRuleComplianceType = rule.attrComplianceType;

    this.isManaged = true;
  }
}

/**
 * The source of the event, such as an AWS service,
 * that triggers AWS Config to evaluate your AWS resources.
 */
enum EventSource {

  /* from aws.config */
  AWS_CONFIG = 'aws.config',

}

/**
 * The type of notification that triggers AWS Config to run an evaluation for a rule.
 */
enum MessageType {

  /**
   * Triggers an evaluation when AWS Config delivers a configuration item as a result of a resource change.
   */
  CONFIGURATION_ITEM_CHANGE_NOTIFICATION = 'ConfigurationItemChangeNotification',

  /**
   * Triggers an evaluation when AWS Config delivers an oversized configuration item.
   */
  OVERSIZED_CONFIGURATION_ITEM_CHANGE_NOTIFICATION = 'OversizedConfigurationItemChangeNotification',

  /**
   * Triggers a periodic evaluation at the frequency specified for MaximumExecutionFrequency.
   */
  SCHEDULED_NOTIFICATION = 'ScheduledNotification',

  /**
   * Triggers a periodic evaluation when AWS Config delivers a configuration snapshot.
   */
  CONFIGURATION_SNAPSHOT_DELIVERY_COMPLETED = 'ConfigurationSnapshotDeliveryCompleted',
}

/**
 * Construction properties for a CustomRule.
 */
interface SourceDetail {
  /**
   * The source of the event, such as an AWS service,
   * that triggers AWS Config to evaluate your AWS resources.
   *
   */
  readonly eventSource: EventSource;
  /**
   * The frequency at which you want AWS Config to run evaluations for a custom rule with a periodic trigger.
   */
  readonly maximumExecutionFrequency?: MaximumExecutionFrequency;
  /**
   * The type of notification that triggers AWS Config to run an evaluation for a rule.
   */
  readonly messageType: MessageType;
}

/**
 * Construction properties for a CustomRule.
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

    const sourceDetails: SourceDetail[] = [];
    this.ruleScope = props.ruleScope;
    if (props.configurationChanges) {
      sourceDetails.push({
        eventSource: EventSource.AWS_CONFIG,
        messageType: MessageType.CONFIGURATION_ITEM_CHANGE_NOTIFICATION,
      });
      sourceDetails.push({
        eventSource: EventSource.AWS_CONFIG,
        messageType: MessageType.OVERSIZED_CONFIGURATION_ITEM_CHANGE_NOTIFICATION,
      });
    }

    if (props.periodic) {
      sourceDetails.push({
        eventSource: EventSource.AWS_CONFIG,
        maximumExecutionFrequency: props.maximumExecutionFrequency,
        messageType: MessageType.SCHEDULED_NOTIFICATION,
      });
    }
    const hash = createHash('sha256')
      .update(JSON.stringify({
        fnName: props.lambdaFunction.functionName.toString,
        accountId: Stack.of(this).resolve(this.env.account),
        region: Stack.of(this).resolve(this.env.region),
      }), 'utf8')
      .digest('base64');
    const customRulePermissionId: string = `CustomRulePermission${hash}`;
    if (!props.lambdaFunction.permissionsNode.tryFindChild(customRulePermissionId)) {
      props.lambdaFunction.addPermission(customRulePermissionId, {
        principal: new iam.ServicePrincipal('config.amazonaws.com'),
        sourceAccount: this.env.account,
      });
    };

    if (props.lambdaFunction.role) {
      props.lambdaFunction.role.addManagedPolicy(
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSConfigRulesExecutionRole'),
      );
    }

    // The lambda permission must be created before the rule
    this.node.addDependency(props.lambdaFunction);

    const rule = new CfnConfigRule(this, 'Resource', {
      configRuleName: this.physicalName,
      description: props.description,
      inputParameters: props.inputParameters,
      maximumExecutionFrequency: props.maximumExecutionFrequency,
      scope: Lazy.any({ produce: () => renderScope(this.ruleScope) }), // scope can use values such as stack id (see CloudFormationStackDriftDetectionCheck)
      source: {
        owner: 'CUSTOM_LAMBDA',
        sourceDetails,
        sourceIdentifier: props.lambdaFunction.functionArn,
      },
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

/**
 * Construction properties for a CustomPolicy.
 */
export interface CustomPolicyProps extends RuleProps {
  /**
   * The policy definition containing the logic for your AWS Config Custom Policy rule.
   */
  readonly policyText: string;

  /**
   * The boolean expression for enabling debug logging for your AWS Config Custom Policy rule.
   *
   * @default false
   */
  readonly enableDebugLog?: boolean;
}

/**
 * A new custom policy.
 *
 * @resource AWS::Config::ConfigRule
 */
export class CustomPolicy extends RuleNew {
  /** @attribute */
  public readonly configRuleName: string;

  /** @attribute */
  public readonly configRuleArn: string;

  /** @attribute */
  public readonly configRuleId: string;

  /** @attribute */
  public readonly configRuleComplianceType: string;

  constructor(scope: Construct, id: string, props: CustomPolicyProps) {
    super(scope, id, {
      physicalName: props.configRuleName,
    });

    if (!props.policyText || [...props.policyText].length === 0) {
      throw new Error('Policy Text cannot be empty.');
    }
    if ( [...props.policyText].length > 10000 ) {
      throw new Error('Policy Text is limited to 10,000 characters or less.');
    }

    const sourceDetails: SourceDetail[] = [];
    this.ruleScope = props.ruleScope;

    sourceDetails.push({
      eventSource: EventSource.AWS_CONFIG,
      messageType: MessageType.CONFIGURATION_ITEM_CHANGE_NOTIFICATION,
    });
    sourceDetails.push({
      eventSource: EventSource.AWS_CONFIG,
      messageType: MessageType.OVERSIZED_CONFIGURATION_ITEM_CHANGE_NOTIFICATION,
    });
    const rule = new CfnConfigRule(this, 'Resource', {
      configRuleName: this.physicalName,
      description: props.description,
      inputParameters: props.inputParameters,
      scope: Lazy.any({ produce: () => renderScope(this.ruleScope) }), // scope can use values such as stack id (see CloudFormationStackDriftDetectionCheck)
      source: {
        owner: 'CUSTOM_POLICY',
        sourceDetails,
        customPolicyDetails: {
          enableDebugLogDelivery: props.enableDebugLog,
          policyRuntime: 'guard-2.x.x',
          policyText: props.policyText,
        },
      },
    });

    this.configRuleName = rule.ref;
    this.configRuleArn = rule.attrArn;
    this.configRuleId = rule.attrConfigRuleId;
    this.configRuleComplianceType = rule.attrComplianceType;
    this.isCustomWithChanges = true;
  }
}

/**
 * Managed rules that are supported by AWS Config.
 * @see https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html
 */
export class ManagedRuleIdentifiers {
  /**
   * Checks that the inline policies attached to your AWS Identity and Access Management users,
   * roles, and groups do not allow blocked actions on all AWS Key Management Service keys.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-inline-policy-blocked-kms-actions.html
   */
  public static readonly IAM_INLINE_POLICY_BLOCKED_KMS_ACTIONS = 'IAM_INLINE_POLICY_BLOCKED_KMS_ACTIONS';
  /**
   * Checks that the managed AWS Identity and Access Management policies that you create do not
   * allow blocked actions on all AWS AWS KMS keys.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-customer-policy-blocked-kms-actions.html
   */
  public static readonly IAM_CUSTOMER_POLICY_BLOCKED_KMS_ACTIONS = 'IAM_CUSTOMER_POLICY_BLOCKED_KMS_ACTIONS';
  /**
   * Checks whether the active access keys are rotated within the number of days specified in maxAccessKeyAge.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/access-keys-rotated.html
   */
  public static readonly ACCESS_KEYS_ROTATED = 'ACCESS_KEYS_ROTATED';
  /**
   * Checks whether AWS account is part of AWS Organizations.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/account-part-of-organizations.html
   */
  public static readonly ACCOUNT_PART_OF_ORGANIZATIONS = 'ACCOUNT_PART_OF_ORGANIZATIONS';
  /**
   * Checks whether ACM Certificates in your account are marked for expiration within the specified number of days.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/acm-certificate-expiration-check.html
   */
  public static readonly ACM_CERTIFICATE_EXPIRATION_CHECK = 'ACM_CERTIFICATE_EXPIRATION_CHECK';
  /**
   * Checks if an Application Load Balancer (ALB) is configured with a user defined desync mitigation mode.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/alb-desync-mode-check.html
   */
  public static readonly ALB_DESYNC_MODE_CHECK = 'ALB_DESYNC_MODE_CHECK';
  /**
   * Checks if rule evaluates Application Load Balancers (ALBs) to ensure they are configured to drop http headers.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/alb-http-drop-invalid-header-enabled.html
   */
  public static readonly ALB_HTTP_DROP_INVALID_HEADER_ENABLED = 'ALB_HTTP_DROP_INVALID_HEADER_ENABLED';
  /**
   * Checks whether HTTP to HTTPS redirection is configured on all HTTP listeners of Application Load Balancer.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/alb-http-to-https-redirection-check.html
   */
  public static readonly ALB_HTTP_TO_HTTPS_REDIRECTION_CHECK = 'ALB_HTTP_TO_HTTPS_REDIRECTION_CHECK';
  /**
   * Checks if Web Application Firewall (WAF) is enabled on Application Load Balancers (ALBs).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/alb-waf-enabled.html
   */
  public static readonly ALB_WAF_ENABLED = 'ALB_WAF_ENABLED';
  /**
   * Checks if Amazon API Gateway V2 stages have access logging enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/api-gwv2-access-logs-enabled.html
   */
  public static readonly API_GWV2_ACCESS_LOGS_ENABLED = 'API_GWV2_ACCESS_LOGS_ENABLED';
  /**
   * Checks if Amazon API Gatewayv2 API routes have an authorization type set.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/api-gwv2-authorization-type-configured.html
   */
  public static readonly API_GWV2_AUTHORIZATION_TYPE_CONFIGURED = 'API_GWV2_AUTHORIZATION_TYPE_CONFIGURED';
  /**
   * Checks if an Amazon API Gateway API stage is using an AWS WAF Web ACL.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/api-gw-associated-with-waf.html
   */
  public static readonly API_GW_ASSOCIATED_WITH_WAF = 'API_GW_ASSOCIATED_WITH_WAF';
  /**
   * Checks that all methods in Amazon API Gateway stages have caching enabled and encrypted.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/api-gw-cache-enabled-and-encrypted.html
   */
  public static readonly API_GW_CACHE_ENABLED_AND_ENCRYPTED = 'API_GW_CACHE_ENABLED_AND_ENCRYPTED';
  /**
   * Checks that Amazon API Gateway APIs are of the type specified in the rule parameter endpointConfigurationType.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/api-gw-endpoint-type-check.html
   */
  public static readonly API_GW_ENDPOINT_TYPE_CHECK = 'API_GW_ENDPOINT_TYPE_CHECK';
  /**
   * Checks that all methods in Amazon API Gateway stage has logging enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/api-gw-execution-logging-enabled.html
   */
  public static readonly API_GW_EXECUTION_LOGGING_ENABLED = 'API_GW_EXECUTION_LOGGING_ENABLED';
  /**
   * Checks if a REST API stage uses an Secure Sockets Layer (SSL) certificate.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/api-gw-ssl-enabled.html
   */
  public static readonly API_GW_SSL_ENABLED = 'API_GW_SSL_ENABLED';
  /**
   * Checks if AWS X-Ray tracing is enabled on Amazon API Gateway REST APIs.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/api-gw-xray-enabled.html
   */
  public static readonly API_GW_XRAY_ENABLED = 'API_GW_XRAY_ENABLED';
  /**
   * Checks whether running instances are using specified AMIs.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/approved-amis-by-id.html
   */
  public static readonly APPROVED_AMIS_BY_ID = 'APPROVED_AMIS_BY_ID';
  /**
   * Checks whether running instances are using specified AMIs.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/approved-amis-by-tag.html
   */
  public static readonly APPROVED_AMIS_BY_TAG = 'APPROVED_AMIS_BY_TAG';
  /**
   * Checks if a recovery point was created for Amazon Aurora DB clusters.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/aurora-last-backup-recovery-point-created.html
   */
  public static readonly AURORA_LAST_BACKUP_RECOVERY_POINT_CREATED = 'AURORA_LAST_BACKUP_RECOVERY_POINT_CREATED';
  /**
   * Checks if an Amazon Aurora MySQL cluster has backtracking enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/aurora-mysql-backtracking-enabled.html
   */
  public static readonly AURORA_MYSQL_BACKTRACKING_ENABLED = 'AURORA_MYSQL_BACKTRACKING_ENABLED';
  /**
   * Checks if Amazon Aurora DB clusters are protected by a backup plan.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/aurora-resources-protected-by-backup-plan.html
   */
  public static readonly AURORA_RESOURCES_PROTECTED_BY_BACKUP_PLAN = 'AURORA_RESOURCES_PROTECTED_BY_BACKUP_PLAN';
  /**
   * Checks if Capacity Rebalancing is enabled for Amazon EC2 Auto Scaling groups that use multiple instance types.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/autoscaling-capacity-rebalancing.html
   */
  public static readonly AUTOSCALING_CAPACITY_REBALANCING = 'AUTOSCALING_CAPACITY_REBALANCING';
  /**
   * Checks whether your Auto Scaling groups that are associated with a load balancer are using
   * Elastic Load Balancing health checks.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/autoscaling-group-elb-healthcheck-required.html
   */
  public static readonly AUTOSCALING_GROUP_ELB_HEALTHCHECK_REQUIRED = 'AUTOSCALING_GROUP_ELB_HEALTHCHECK_REQUIRED';
  /**
   * Checks whether only IMDSv2 is enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/autoscaling-launchconfig-requires-imdsv2.html
   */
  public static readonly AUTOSCALING_LAUNCHCONFIG_REQUIRES_IMDSV2 = 'AUTOSCALING_LAUNCHCONFIG_REQUIRES_IMDSV2';
  /**
   * Checks the number of network hops that the metadata token can travel.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/autoscaling-launch-config-hop-limit.html
   */
  public static readonly AUTOSCALING_LAUNCH_CONFIG_HOP_LIMIT = 'AUTOSCALING_LAUNCH_CONFIG_HOP_LIMIT';
  /**
   * Checks if Amazon EC2 Auto Scaling groups have public IP addresses enabled through Launch Configurations.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/autoscaling-launch-config-public-ip-disabled.html
   */
  public static readonly AUTOSCALING_LAUNCH_CONFIG_PUBLIC_IP_DISABLED = 'AUTOSCALING_LAUNCH_CONFIG_PUBLIC_IP_DISABLED';
  /**
   * Checks if an Amazon Elastic Compute Cloud (EC2) Auto Scaling group is created from an EC2 launch template.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/autoscaling-launch-template.html
   */
  public static readonly AUTOSCALING_LAUNCH_TEMPLATE = 'AUTOSCALING_LAUNCH_TEMPLATE';
  /**
   * Checks if the Auto Scaling group spans multiple Availability Zones.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/autoscaling-multiple-az.html
   */
  public static readonly AUTOSCALING_MULTIPLE_AZ = 'AUTOSCALING_MULTIPLE_AZ';
  /**
   * Checks if an Amazon Elastic Compute Cloud (Amazon EC2) Auto Scaling group uses multiple instance types.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/autoscaling-multiple-instance-types.html
   */
  public static readonly AUTOSCALING_MULTIPLE_INSTANCE_TYPES = 'AUTOSCALING_MULTIPLE_INSTANCE_TYPES';
  /**
   * Checks if a backup plan has a backup rule that satisfies the required frequency and retention period.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/backup-plan-min-frequency-and-min-retention-check.html
   */
  public static readonly BACKUP_PLAN_MIN_FREQUENCY_AND_MIN_RETENTION_CHECK = 'BACKUP_PLAN_MIN_FREQUENCY_AND_MIN_RETENTION_CHECK';
  /**
   * Checks if a recovery point is encrypted.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/backup-recovery-point-encrypted.html
   */
  public static readonly BACKUP_RECOVERY_POINT_ENCRYPTED = 'BACKUP_RECOVERY_POINT_ENCRYPTED';
  /**
   * Checks if a backup vault has an attached resource-based policy which prevents deletion of recovery points.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/backup-recovery-point-manual-deletion-disabled.html
   */
  public static readonly BACKUP_RECOVERY_POINT_MANUAL_DELETION_DISABLED = 'BACKUP_RECOVERY_POINT_MANUAL_DELETION_DISABLED';
  /**
   * Checks if a recovery point expires no earlier than after the specified period.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/backup-recovery-point-minimum-retention-check.html
   */
  public static readonly BACKUP_RECOVERY_POINT_MINIMUM_RETENTION_CHECK = 'BACKUP_RECOVERY_POINT_MINIMUM_RETENTION_CHECK';
  /**
   * Checks if an AWS Elastic Beanstalk environment is configured for enhanced health reporting.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/beanstalk-enhanced-health-reporting-enabled.html
   */
  public static readonly BEANSTALK_ENHANCED_HEALTH_REPORTING_ENABLED = 'BEANSTALK_ENHANCED_HEALTH_REPORTING_ENABLED';
  /**
   * Checks if Classic Load Balancers (CLB) are configured with a user defined Desync mitigation mode.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/clb-desync-mode-check.html
   */
  public static readonly CLB_DESYNC_MODE_CHECK = 'CLB_DESYNC_MODE_CHECK';
  /**
   * Checks if a Classic Load Balancer spans multiple Availability Zones (AZs).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/clb-multiple-az.html
   */
  public static readonly CLB_MULTIPLE_AZ = 'CLB_MULTIPLE_AZ';
  /**
   * Checks whether an AWS CloudFormation stack's actual configuration differs, or has drifted,
   * from it's expected configuration.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudformation-stack-drift-detection-check.html
   */
  public static readonly CLOUDFORMATION_STACK_DRIFT_DETECTION_CHECK = 'CLOUDFORMATION_STACK_DRIFT_DETECTION_CHECK';
  /**
   * Checks whether your CloudFormation stacks are sending event notifications to an SNS topic.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudformation-stack-notification-check.html
   */
  public static readonly CLOUDFORMATION_STACK_NOTIFICATION_CHECK = 'CLOUDFORMATION_STACK_NOTIFICATION_CHECK';
  /**
   * Checks if Amazon CloudFront distributions are configured to capture information from
   * Amazon Simple Storage Service (Amazon S3) server access logs.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-accesslogs-enabled.html
   */
  public static readonly CLOUDFRONT_ACCESSLOGS_ENABLED = 'CLOUDFRONT_ACCESSLOGS_ENABLED';
  /**
   * Checks if Amazon CloudFront distributions are associated with either WAF or WAFv2 web access control lists (ACLs).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-associated-with-waf.html
   */
  public static readonly CLOUDFRONT_ASSOCIATED_WITH_WAF = 'CLOUDFRONT_ASSOCIATED_WITH_WAF';
  /**
   * Checks if the certificate associated with an Amazon CloudFront distribution is the default Secure Sockets Layer (SSL) certificate.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-custom-ssl-certificate.html
   */
  public static readonly CLOUDFRONT_CUSTOM_SSL_CERTIFICATE = 'CLOUDFRONT_CUSTOM_SSL_CERTIFICATE';
  /**
   * Checks if an Amazon CloudFront distribution is configured to return a specific object that is the default root object.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-default-root-object-configured.html
   */
  public static readonly CLOUDFRONT_DEFAULT_ROOT_OBJECT_CONFIGURED = 'CLOUDFRONT_DEFAULT_ROOT_OBJECT_CONFIGURED';
  /**
   * Checks if CloudFront distributions are using deprecated SSL protocols for HTTPS communication between
   * CloudFront edge locations and custom origins.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-no-deprecated-ssl-protocols.html
   */
  public static readonly CLOUDFRONT_NO_DEPRECATED_SSL_PROTOCOLS = 'CLOUDFRONT_NO_DEPRECATED_SSL_PROTOCOLS';
  /**
   * Checks that Amazon CloudFront distribution with Amazon S3 Origin type has Origin Access Identity (OAI) configured.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-origin-access-identity-enabled.html
   */
  public static readonly CLOUDFRONT_ORIGIN_ACCESS_IDENTITY_ENABLED = 'CLOUDFRONT_ORIGIN_ACCESS_IDENTITY_ENABLED';
  /**
   * Checks whether an origin group is configured for the distribution of at least 2 origins in the
   * origin group for Amazon CloudFront.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-origin-failover-enabled.html
   */
  public static readonly CLOUDFRONT_ORIGIN_FAILOVER_ENABLED = 'CLOUDFRONT_ORIGIN_FAILOVER_ENABLED';
  /**
   * Checks if Amazon CloudFront distributions are using a minimum security policy and cipher suite of TLSv1.2 or
   * greater for viewer connections.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-security-policy-check.html
   */
  public static readonly CLOUDFRONT_SECURITY_POLICY_CHECK = 'CLOUDFRONT_SECURITY_POLICY_CHECK'
  /**
   * Checks if Amazon CloudFront distributions are using a custom SSL certificate and are configured
   * to use SNI to serve HTTPS requests.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-sni-enabled.html
   */
  public static readonly CLOUDFRONT_SNI_ENABLED = 'CLOUDFRONT_SNI_ENABLED';
  /**
   * Checks if Amazon CloudFront distributions are encrypting traffic to custom origins.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-traffic-to-origin-encrypted.html
   */
  public static readonly CLOUDFRONT_TRAFFIC_TO_ORIGIN_ENCRYPTED = 'CLOUDFRONT_TRAFFIC_TO_ORIGIN_ENCRYPTED';
  /**
   * Checks whether your Amazon CloudFront distributions use HTTPS (directly or via a redirection).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-viewer-policy-https.html
   */
  public static readonly CLOUDFRONT_VIEWER_POLICY_HTTPS = 'CLOUDFRONT_VIEWER_POLICY_HTTPS';
  /**
   * Checks whether AWS CloudTrail trails are configured to send logs to Amazon CloudWatch Logs.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloud-trail-cloud-watch-logs-enabled.html
   */
  public static readonly CLOUD_TRAIL_CLOUD_WATCH_LOGS_ENABLED = 'CLOUD_TRAIL_CLOUD_WATCH_LOGS_ENABLED';
  /**
   * Checks whether AWS CloudTrail is enabled in your AWS account.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudtrail-enabled.html
   */
  public static readonly CLOUD_TRAIL_ENABLED = 'CLOUD_TRAIL_ENABLED';
  /**
   * Checks whether AWS CloudTrail is configured to use the server side encryption (SSE)
   * AWS Key Management Service (AWS KMS) customer master key (CMK) encryption.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloud-trail-encryption-enabled.html
   */
  public static readonly CLOUD_TRAIL_ENCRYPTION_ENABLED = 'CLOUD_TRAIL_ENCRYPTION_ENABLED';
  /**
   * Checks whether AWS CloudTrail creates a signed digest file with logs.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloud-trail-log-file-validation-enabled.html
   */
  public static readonly CLOUD_TRAIL_LOG_FILE_VALIDATION_ENABLED = 'CLOUD_TRAIL_LOG_FILE_VALIDATION_ENABLED';
  /**
   * Checks whether at least one AWS CloudTrail trail is logging Amazon S3 data events for all S3 buckets.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudtrail-s3-dataevents-enabled.html
   */
  public static readonly CLOUDTRAIL_S3_DATAEVENTS_ENABLED = 'CLOUDTRAIL_S3_DATAEVENTS_ENABLED';
  /**
   * Checks that there is at least one AWS CloudTrail trail defined with security best practices.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudtrail-security-trail-enabled.html
   */
  public static readonly CLOUDTRAIL_SECURITY_TRAIL_ENABLED = 'CLOUDTRAIL_SECURITY_TRAIL_ENABLED';
  /**
   * Checks whether CloudWatch alarms have at least one alarm action, one INSUFFICIENT_DATA action,
   * or one OK action enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudwatch-alarm-action-check.html
   */
  public static readonly CLOUDWATCH_ALARM_ACTION_CHECK = 'CLOUDWATCH_ALARM_ACTION_CHECK';
  /**
   * Checks if Amazon CloudWatch alarms actions are in enabled state.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudwatch-alarm-action-enabled-check.html
   */
  public static readonly CLOUDWATCH_ALARM_ACTION_ENABLED_CHECK = 'CLOUDWATCH_ALARM_ACTION_ENABLED_CHECK';
  /**
   * Checks whether the specified resource type has a CloudWatch alarm for the specified metric.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudwatch-alarm-resource-check.html
   */
  public static readonly CLOUDWATCH_ALARM_RESOURCE_CHECK = 'CLOUDWATCH_ALARM_RESOURCE_CHECK';
  /**
   * Checks whether CloudWatch alarms with the given metric name have the specified settings.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudwatch-alarm-settings-check.html
   */
  public static readonly CLOUDWATCH_ALARM_SETTINGS_CHECK = 'CLOUDWATCH_ALARM_SETTINGS_CHECK';
  /**
   * Checks whether a log group in Amazon CloudWatch Logs is encrypted with
   * a AWS Key Management Service (KMS) managed Customer Master Keys (CMK).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudwatch-log-group-encrypted.html
   */
  public static readonly CLOUDWATCH_LOG_GROUP_ENCRYPTED = 'CLOUDWATCH_LOG_GROUP_ENCRYPTED';
  /**
   * Checks that key rotation is enabled for each key and matches to the key ID of the
   * customer created customer master key (CMK).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cmk-backing-key-rotation-enabled.html
   */
  public static readonly CMK_BACKING_KEY_ROTATION_ENABLED = 'CMK_BACKING_KEY_ROTATION_ENABLED';
  /**
   * Checks if an AWS CodeBuild project has encryption enabled for all of its artifacts.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/codebuild-project-artifact-encryption.html
   */
  public static readonly CODEBUILD_PROJECT_ARTIFACT_ENCRYPTION = 'CODEBUILD_PROJECT_ARTIFACT_ENCRYPTION';
  /**
   * Checks if an AWS CodeBuild project environment has privileged mode enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/codebuild-project-environment-privileged-check.html
   */
  public static readonly CODEBUILD_PROJECT_ENVIRONMENT_PRIVILEGED_CHECK = 'CODEBUILD_PROJECT_ENVIRONMENT_PRIVILEGED_CHECK';
  /**
   * Checks whether the project contains environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/codebuild-project-envvar-awscred-check.html
   */
  public static readonly CODEBUILD_PROJECT_ENVVAR_AWSCRED_CHECK = 'CODEBUILD_PROJECT_ENVVAR_AWSCRED_CHECK';
  /**
   * Checks if an AWS CodeBuild project environment has at least one log option enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/codebuild-project-logging-enabled.html
   */
  public static readonly CODEBUILD_PROJECT_LOGGING_ENABLED = 'CODEBUILD_PROJECT_LOGGING_ENABLED';
  /**
   * Checks if a AWS CodeBuild project configured with Amazon S3 Logs has encryption enabled for its logs.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/codebuild-project-s3-logs-encrypted.html
   */
  public static readonly CODEBUILD_PROJECT_S3_LOGS_ENCRYPTED = 'CODEBUILD_PROJECT_S3_LOGS_ENCRYPTED';
  /**
   * Checks whether the GitHub or Bitbucket source repository URL contains either personal access tokens
   * or user name and password.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/codebuild-project-source-repo-url-check.html
   */
  public static readonly CODEBUILD_PROJECT_SOURCE_REPO_URL_CHECK = 'CODEBUILD_PROJECT_SOURCE_REPO_URL_CHECK';
  /**
   * Checks if the deployment group is configured with automatic deployment rollback and
   * deployment monitoring with alarms attached.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/codedeploy-auto-rollback-monitor-enabled.html
   */
  public static readonly CODEDEPLOY_AUTO_ROLLBACK_MONITOR_ENABLED = 'CODEDEPLOY_AUTO_ROLLBACK_MONITOR_ENABLED';
  /**
   * Checks if the deployment group for EC2/On-Premises Compute Platform is configured with
   * a minimum healthy hosts fleet percentage or host count greater than or equal to the input threshold.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/codedeploy-ec2-minimum-healthy-hosts-configured.html
   */
  public static readonly CODEDEPLOY_EC2_MINIMUM_HEALTHY_HOSTS_CONFIGURED = 'CODEDEPLOY_EC2_MINIMUM_HEALTHY_HOSTS_CONFIGURED';
  /**
   * Checks if the deployment group for Lambda Compute Platform is not using the default deployment configuration.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/codedeploy-lambda-allatonce-traffic-shift-disabled.html
   */
  public static readonly CODEDEPLOY_LAMBDA_ALLATONCE_TRAFFIC_SHIFT_DISABLED = 'CODEDEPLOY_LAMBDA_ALLATONCE_TRAFFIC_SHIFT_DISABLED';
  /**
   * Checks whether the first deployment stage of the AWS CodePipeline performs more than one deployment.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/codepipeline-deployment-count-check.html
   */
  public static readonly CODEPIPELINE_DEPLOYMENT_COUNT_CHECK = 'CODEPIPELINE_DEPLOYMENT_COUNT_CHECK';
  /**
   * Checks whether each stage in the AWS CodePipeline deploys to more than N times the number of
   * the regions the AWS CodePipeline has deployed in all the previous combined stages,
   * where N is the region fanout number.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/codepipeline-region-fanout-check.html
   */
  public static readonly CODEPIPELINE_REGION_FANOUT_CHECK = 'CODEPIPELINE_REGION_FANOUT_CHECK';
  /**
   * Checks whether Amazon CloudWatch LogGroup retention period is set to specific number of days.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cw-loggroup-retention-period-check.html
   */
  public static readonly CW_LOGGROUP_RETENTION_PERIOD_CHECK = 'CW_LOGGROUP_RETENTION_PERIOD_CHECK';
  /**
   * Checks that DynamoDB Accelerator (DAX) clusters are encrypted.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dax-encryption-enabled.html
   */
  public static readonly DAX_ENCRYPTION_ENABLED = 'DAX_ENCRYPTION_ENABLED';
  /**
   * Checks whether RDS DB instances have backups enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/db-instance-backup-enabled.html
   */
  public static readonly RDS_DB_INSTANCE_BACKUP_ENABLED = 'DB_INSTANCE_BACKUP_ENABLED';
  /**
   * Checks instances for specified tenancy.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/desired-instance-tenancy.html
   */
  public static readonly EC2_DESIRED_INSTANCE_TENANCY = 'DESIRED_INSTANCE_TENANCY';
  /**
   * Checks whether your EC2 instances are of the specified instance types.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/desired-instance-type.html
   */
  public static readonly EC2_DESIRED_INSTANCE_TYPE = 'DESIRED_INSTANCE_TYPE';
  /**
   * Checks whether AWS Database Migration Service replication instances are public.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dms-replication-not-public.html
   */
  public static readonly DMS_REPLICATION_NOT_PUBLIC = 'DMS_REPLICATION_NOT_PUBLIC';
  /**
   * Checks whether Auto Scaling or On-Demand is enabled on your DynamoDB tables and/or global secondary indexes.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dynamodb-autoscaling-enabled.html
   */
  public static readonly DYNAMODB_AUTOSCALING_ENABLED = 'DYNAMODB_AUTOSCALING_ENABLED';
  /**
   * Checks whether Amazon DynamoDB table is present in AWS Backup plans.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dynamodb-in-backup-plan.html
   */
  public static readonly DYNAMODB_IN_BACKUP_PLAN = 'DYNAMODB_IN_BACKUP_PLAN';
  /**
   * Checks if a recovery point was created for Amazon DynamoDB Tables within the specified period.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dynamodb-last-backup-recovery-point-created.html
   */
  public static readonly DYNAMODB_LAST_BACKUP_RECOVERY_POINT_CREATED = 'DYNAMODB_LAST_BACKUP_RECOVERY_POINT_CREATED';
  /**
   * Checks that point in time recovery (PITR) is enabled for Amazon DynamoDB tables.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dynamodb-pitr-enabled.html
   */
  public static readonly DYNAMODB_PITR_ENABLED = 'DYNAMODB_PITR_ENABLED';
  /**
   * Checks if Amazon DynamoDB tables are protected by a backup plan.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dynamodb-resources-protected-by-backup-plan.html
   */
  public static readonly DYNAMODB_RESOURCES_PROTECTED_BY_BACKUP_PLAN = 'DYNAMODB_RESOURCES_PROTECTED_BY_BACKUP_PLAN';
  /**
   * Checks whether Amazon DynamoDB table is encrypted with AWS Key Management Service (KMS).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dynamodb-table-encrypted-kms.html
   */
  public static readonly DYNAMODB_TABLE_ENCRYPTED_KMS = 'DYNAMODB_TABLE_ENCRYPTED_KMS';
  /**
   * Checks whether the Amazon DynamoDB tables are encrypted and checks their status.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dynamodb-table-encryption-enabled.html
   */
  public static readonly DYNAMODB_TABLE_ENCRYPTION_ENABLED = 'DYNAMODB_TABLE_ENCRYPTION_ENABLED';
  /**
   * Checks whether provisioned DynamoDB throughput is approaching the maximum limit for your account.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dynamodb-throughput-limit-check.html
   */
  public static readonly DYNAMODB_THROUGHPUT_LIMIT_CHECK = 'DYNAMODB_THROUGHPUT_LIMIT_CHECK';
  /**
   * Checks if Amazon Elastic Block Store (Amazon EBS) volumes are added in backup plans of AWS Backup.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ebs-in-backup-plan.html
   */
  public static readonly EBS_IN_BACKUP_PLAN = 'EBS_IN_BACKUP_PLAN';
  /**
   * Checks whether Amazon Elastic File System (Amazon EFS) file systems are added
   * in the backup plans of AWS Backup.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/efs-in-backup-plan.html
   */
  public static readonly EFS_IN_BACKUP_PLAN = 'EFS_IN_BACKUP_PLAN';
  /**
   * Check that Amazon Elastic Block Store (EBS) encryption is enabled by default.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-ebs-encryption-by-default.html
   */
  public static readonly EC2_EBS_ENCRYPTION_BY_DEFAULT = 'EC2_EBS_ENCRYPTION_BY_DEFAULT';
  /**
   * Checks whether EBS optimization is enabled for your EC2 instances that can be EBS-optimized.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ebs-optimized-instance.html
   */
  public static readonly EBS_OPTIMIZED_INSTANCE = 'EBS_OPTIMIZED_INSTANCE';
  /**
   * Checks if Amazon Elastic Block Store (Amazon EBS) volumes are protected by a backup plan.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ebs-resources-protected-by-backup-plan.html
   */
  public static readonly EBS_RESOURCES_PROTECTED_BY_BACKUP_PLAN = 'EBS_RESOURCES_PROTECTED_BY_BACKUP_PLAN';
  /**
   * Checks whether Amazon Elastic Block Store snapshots are not publicly restorable.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ebs-snapshot-public-restorable-check.html
   */
  public static readonly EBS_SNAPSHOT_PUBLIC_RESTORABLE_CHECK = 'EBS_SNAPSHOT_PUBLIC_RESTORABLE_CHECK';
  /**
   * Checks whether detailed monitoring is enabled for EC2 instances.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-instance-detailed-monitoring-enabled.html
   */
  public static readonly EC2_INSTANCE_DETAILED_MONITORING_ENABLED = 'EC2_INSTANCE_DETAILED_MONITORING_ENABLED';
  /**
   * Checks whether the Amazon EC2 instances in your account are managed by AWS Systems Manager.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-instance-managed-by-systems-manager.html
   */
  public static readonly EC2_INSTANCE_MANAGED_BY_SSM = 'EC2_INSTANCE_MANAGED_BY_SSM';
  /**
   * Checks if an Amazon Elastic Compute Cloud (Amazon EC2) instance has an Identity and Access
   * Management (IAM) profile attached to it. This rule is NON_COMPLIANT if no IAM profile is
   * attached to the Amazon EC2 instance.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-instance-profile-attached.html
   */
  public static readonly EC2_INSTANCE_PROFILE_ATTACHED = 'EC2_INSTANCE_PROFILE_ATTACHED';
  /**
   * Checks if Amazon Elastic Compute Cloud (Amazon EC2) uses multiple ENIs (Elastic Network Interfaces)
   * or Elastic Fabric Adapters (EFAs).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-instance-multiple-eni-check.html
   */
  public static readonly EC2_INSTANCE_MULTIPLE_ENI_CHECK = 'EC2_INSTANCE_MULTIPLE_ENI_CHECK';
  /**
   * Checks whether Amazon Elastic Compute Cloud (Amazon EC2) instances have a public IP association.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-instance-no-public-ip.html
   */
  public static readonly EC2_INSTANCE_NO_PUBLIC_IP = 'EC2_INSTANCE_NO_PUBLIC_IP';
  /**
   * Checks if a recovery point was created for Amazon Elastic Compute Cloud (Amazon EC2) instances.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-last-backup-recovery-point-created.html
   */
  public static readonly EC2_LAST_BACKUP_RECOVERY_POINT_CREATED = 'EC2_LAST_BACKUP_RECOVERY_POINT_CREATED';
  /**
   * Checks whether your EC2 instances belong to a virtual private cloud (VPC).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-instances-in-vpc.html
   */
  public static readonly EC2_INSTANCES_IN_VPC = 'INSTANCES_IN_VPC';
  /**
   * Checks that none of the specified applications are installed on the instance.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-managedinstance-applications-blacklisted.html
   */
  public static readonly EC2_MANAGED_INSTANCE_APPLICATIONS_BLOCKED = 'EC2_MANAGEDINSTANCE_APPLICATIONS_BLACKLISTED';
  /**
   * Checks whether all of the specified applications are installed on the instance.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-managedinstance-applications-required.html
   */
  public static readonly EC2_MANAGED_INSTANCE_APPLICATIONS_REQUIRED = 'EC2_MANAGEDINSTANCE_APPLICATIONS_REQUIRED';
  /**
   * Checks whether the compliance status of AWS Systems Manager association compliance is COMPLIANT
   * or NON_COMPLIANT after the association execution on the instance.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-managedinstance-association-compliance-status-check.html
   */
  public static readonly EC2_MANAGED_INSTANCE_ASSOCIATION_COMPLIANCE_STATUS_CHECK = 'EC2_MANAGEDINSTANCE_ASSOCIATION_COMPLIANCE_STATUS_CHECK';
  /**
   * Checks whether instances managed by AWS Systems Manager are configured to collect blocked inventory types.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-managedinstance-inventory-blacklisted.html
   */
  public static readonly EC2_MANAGED_INSTANCE_INVENTORY_BLOCKED = 'EC2_MANAGEDINSTANCE_INVENTORY_BLACKLISTED';
  /**
   * Checks whether the compliance status of the Amazon EC2 Systems Manager patch compliance is
   * COMPLIANT or NON_COMPLIANT after the patch installation on the instance.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-managedinstance-patch-compliance-status-check.html
   */
  public static readonly EC2_MANAGED_INSTANCE_PATCH_COMPLIANCE_STATUS_CHECK = 'EC2_MANAGEDINSTANCE_PATCH_COMPLIANCE_STATUS_CHECK';
  /**
   * Checks whether EC2 managed instances have the desired configurations.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-managedinstance-platform-check.html
   */
  public static readonly EC2_MANAGED_INSTANCE_PLATFORM_CHECK = 'EC2_MANAGEDINSTANCE_PLATFORM_CHECK';
  /**
   * Checks if running Amazon Elastic Compute Cloud (EC2) instances are launched using amazon key pairs.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-no-amazon-key-pair.html
   */
  public static readonly EC2_NO_AMAZON_KEY_PAIR = 'EC2_NO_AMAZON_KEY_PAIR';
  /**
   * Checks if the virtualization type of an EC2 instance is paravirtual.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-paravirtual-instance-check.html
   */
  public static readonly EC2_PARAVIRTUAL_INSTANCE_CHECK = 'EC2_PARAVIRTUAL_INSTANCE_CHECK';
  /**
   * Checks if Amazon Elastic Compute Cloud (Amazon EC2) instances are protected by a backup plan.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-resources-protected-by-backup-plan.html
   */
  public static readonly EC2_RESOURCES_PROTECTED_BY_BACKUP_PLAN = 'EC2_RESOURCES_PROTECTED_BY_BACKUP_PLAN';
  /**
   * Checks that security groups are attached to Amazon Elastic Compute Cloud (Amazon EC2) instances
   * or to an elastic network interface.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-security-group-attached-to-eni.html
   */
  public static readonly EC2_SECURITY_GROUP_ATTACHED_TO_ENI = 'EC2_SECURITY_GROUP_ATTACHED_TO_ENI';
  /**
   * Checks if non-default security groups are attached to Elastic network interfaces (ENIs).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-security-group-attached-to-eni-periodic.html
   */
  public static readonly EC2_SECURITY_GROUP_ATTACHED_TO_ENI_PERIODIC = 'EC2_SECURITY_GROUP_ATTACHED_TO_ENI_PERIODIC';
  /**
   * Checks whether there are instances stopped for more than the allowed number of days.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-stopped-instance.html
   */
  public static readonly EC2_STOPPED_INSTANCE = 'EC2_STOPPED_INSTANCE';
  /**
   * Checks if an Amazon Elastic Compute Cloud (EC2) instance metadata
   * has a specified token hop limit that is below the desired limit.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-token-hop-limit-check.html
   */
  public static readonly EC2_TOKEN_HOP_LIMIT_CHECK = 'EC2_TOKEN_HOP_LIMIT_CHECK';
  /**
   * Checks if Amazon Elastic Compute Cloud (Amazon EC2) Transit Gateways have 'AutoAcceptSharedAttachments' enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-transit-gateway-auto-vpc-attach-disabled.html
   */
  public static readonly EC2_TRANSIT_GATEWAY_AUTO_VPC_ATTACH_DISABLED = 'EC2_TRANSIT_GATEWAY_AUTO_VPC_ATTACH_DISABLED';
  /**
   * Checks whether EBS volumes are attached to EC2 instances.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-volume-inuse-check.html
   */
  public static readonly EC2_VOLUME_INUSE_CHECK = 'EC2_VOLUME_INUSE_CHECK';
  /**
   * Checks if a private Amazon Elastic Container Registry (ECR) repository has image scanning enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ecr-private-image-scanning-enabled.html
   */
  public static readonly ECR_PRIVATE_IMAGE_SCANNING_ENABLED = 'ECR_PRIVATE_IMAGE_SCANNING_ENABLED';
  /**
   * Checks if a private Amazon Elastic Container Registry (ECR) repository has at least one lifecycle policy configured.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ecr-private-lifecycle-policy-configured.html
   */
  public static readonly ECR_PRIVATE_LIFECYCLE_POLICY_CONFIGURED = 'ECR_PRIVATE_LIFECYCLE_POLICY_CONFIGURED';
  /**
   * Checks if a private Amazon Elastic Container Registry (ECR) repository has tag immutability enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ecr-private-tag-immutability-enabled.html
   */
  public static readonly ECR_PRIVATE_TAG_IMMUTABILITY_ENABLED = 'ECR_PRIVATE_TAG_IMMUTABILITY_ENABLED';
  /**
   * Checks if the networking mode for active ECSTaskDefinitions is set to ‘awsvpc’.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ecs-awsvpc-networking-enabled.html
   */
  public static readonly ECS_AWSVPC_NETWORKING_ENABLED = 'ECS_AWSVPC_NETWORKING_ENABLED';
  /**
   * Checks if the privileged parameter in the container definition of ECSTaskDefinitions is set to ‘true’.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-instances-in-vpc.html
   */
  public static readonly ECS_CONTAINERS_NONPRIVILEGED = 'ECS_CONTAINERS_NONPRIVILEGED';
  /**
   * Checks if Amazon Elastic Container Service (Amazon ECS) Containers only have read-only access to its root filesystems.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ecs-containers-readonly-access.html
   */
  public static readonly ECS_CONTAINERS_READONLY_ACCESS = 'ECS_CONTAINERS_READONLY_ACCESS';
  /**
   * Checks if Amazon Elastic Container Service clusters have container insights enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ecs-container-insights-enabled.html
   */
  public static readonly ECS_CONTAINER_INSIGHTS_ENABLED = 'ECS_CONTAINER_INSIGHTS_ENABLED';
  /**
   * Checks if Amazon Elastic Container Service (ECS) Fargate Services
   * is running on the latest Fargate platform version.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ecs-fargate-latest-platform-version.html
   */
  public static readonly ECS_FARGATE_LATEST_PLATFORM_VERSION = 'ECS_FARGATE_LATEST_PLATFORM_VERSION';
  /**
   * Checks if secrets are passed as container environment variables.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ecs-no-environment-secrets.html
   */
  public static readonly ECS_NO_ENVIRONMENT_SECRETS = 'ECS_NO_ENVIRONMENT_SECRETS';
  /**
   * Checks if logConfiguration is set on active ECS Task Definitions.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ecs-task-definition-log-configuration.html
   */
  public static readonly ECS_TASK_DEFINITION_LOG_CONFIGURATION = 'ECS_TASK_DEFINITION_LOG_CONFIGURATION';
  /**
   * Checks if Amazon Elastic Container Service (ECS) task definitions have a set memory limit for its container definitions.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ecs-task-definition-memory-hard-limit.html
   */
  public static readonly ECS_TASK_DEFINITION_MEMORY_HARD_LIMIT = 'ECS_TASK_DEFINITION_MEMORY_HARD_LIMIT';
  /**
   * Checks if ECSTaskDefinitions specify a user
   * for Amazon Elastic Container Service (Amazon ECS) EC2 launch type containers to run on.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ecs-task-definition-nonroot-user.html
   */
  public static readonly ECS_TASK_DEFINITION_NONROOT_USER = 'ECS_TASK_DEFINITION_NONROOT_USER';
  /**
   * Checks if ECSTaskDefinitions are configured to share a host’s process namespace
   * with its Amazon Elastic Container Service (Amazon ECS) containers.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-stopped-instance.html
   */
  public static readonly ECS_TASK_DEFINITION_PID_MODE_CHECK = 'ECS_TASK_DEFINITION_PID_MODE_CHECK';
  /**
   * Checks if an Amazon Elastic Container Service (Amazon ECS) task definition
   * with host networking mode has 'privileged' or 'user' container definitions.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-volume-inuse-check.html
   */
  public static readonly EC2_VOLUME_IECS_TASK_DEFINITION_USER_FOR_HOST_MODE_CHECKNUSE_CHECK = 'ECS_TASK_DEFINITION_USER_FOR_HOST_MODE_CHECK';
  /**
   * Checks if Amazon Elastic File System (Amazon EFS) access points are configured to enforce a root directory.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/efs-access-point-enforce-root-directory.html
   */
  public static readonly EFS_ACCESS_POINT_ENFORCE_ROOT_DIRECTORY = 'EFS_ACCESS_POINT_ENFORCE_ROOT_DIRECTORY';
  /**
   * Checks if Amazon Elastic File System (Amazon EFS) access points are configured to enforce a user identity.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-volume-inuse-check.html
   */
  public static readonly EFS_ACCESS_POINT_ENFORCE_USER_IDENTITY = 'EFS_ACCESS_POINT_ENFORCE_USER_IDENTITY';
  /**
   * hecks whether Amazon Elastic File System (Amazon EFS) is configured to encrypt the file data
   * using AWS Key Management Service (AWS KMS).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/efs-encrypted-check.html
   */
  public static readonly EFS_ENCRYPTED_CHECK = 'EFS_ENCRYPTED_CHECK';
  /**
   * Checks if a recovery point was created for Amazon Elastic File System (Amazon EFS) File Systems.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/efs-last-backup-recovery-point-created.html
   */
  public static readonly EFS_LAST_BACKUP_RECOVERY_POINT_CREATED = 'EFS_LAST_BACKUP_RECOVERY_POINT_CREATED';
  /**
   * Checks if Amazon Elastic File System (Amazon EFS) File Systems are protected by a backup plan.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/efs-resources-protected-by-backup-plan.html
   */
  public static readonly EFS_RESOURCES_PROTECTED_BY_BACKUP_PLAN = 'EFS_RESOURCES_PROTECTED_BY_BACKUP_PLAN';
  /**
   * Checks whether all Elastic IP addresses that are allocated to a VPC are attached to
   * EC2 instances or in-use elastic network interfaces (ENIs).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/eip-attached.html
   */
  public static readonly EIP_ATTACHED = 'EIP_ATTACHED';
  /**
   * Checks whether Amazon Elasticsearch Service (Amazon ES) domains have encryption
   * at rest configuration enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/elasticsearch-encrypted-at-rest.html
   */
  public static readonly ELASTICSEARCH_ENCRYPTED_AT_REST = 'ELASTICSEARCH_ENCRYPTED_AT_REST';
  /**
   * Checks whether Amazon Elasticsearch Service (Amazon ES) domains are in
   * Amazon Virtual Private Cloud (Amazon VPC).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/elasticsearch-in-vpc-only.html
   */
  public static readonly ELASTICSEARCH_IN_VPC_ONLY = 'ELASTICSEARCH_IN_VPC_ONLY';
  /**
   * Check if the Amazon ElastiCache Redis clusters have automatic backup turned on.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/elasticache-redis-cluster-automatic-backup-check.html
   */
  public static readonly ELASTICACHE_REDIS_CLUSTER_AUTOMATIC_BACKUP_CHECK = 'ELASTICACHE_REDIS_CLUSTER_AUTOMATIC_BACKUP_CHECK';
  /**
   * Checks whether your Amazon Elastic Compute Cloud (Amazon EC2) instance metadata version
   * is configured with Instance Metadata Service Version 2 (IMDSv2).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-imdsv2-check.html
   */
  public static readonly EC2_IMDSV2_CHECK = 'EC2_IMDSV2_CHECK';
  /**
   * Checks if an Amazon Elastic Kubernetes Service (EKS) cluster is running the oldest supported version.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/eks-cluster-oldest-supported-version.html
   */
  public static readonly EKS_CLUSTER_OLDEST_SUPPORTED_VERSION = 'EKS_CLUSTER_OLDEST_SUPPORTED_VERSION';
  /**
    * Checks if an Amazon Elastic Kubernetes Service (EKS) cluster is running a supported Kubernetes version.
    * @see https://docs.aws.amazon.com/config/latest/developerguide/eks-cluster-supported-version.html
    */
  public static readonly EKS_CLUSTER_SUPPORTED_VERSION = 'EKS_CLUSTER_SUPPORTED_VERSION';
  /**
   * Checks whether Amazon Elastic Kubernetes Service (Amazon EKS) endpoint is not publicly accessible.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/eks-endpoint-no-public-access.html
   */
  public static readonly EKS_ENDPOINT_NO_PUBLIC_ACCESS = 'EKS_ENDPOINT_NO_PUBLIC_ACCESS';
  /**
   * Checks whether Amazon Elastic Kubernetes Service clusters are configured to have Kubernetes
   * secrets encrypted using AWS Key Management Service (KMS) keys.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/eks-secrets-encrypted.html
   */
  public static readonly EKS_SECRETS_ENCRYPTED = 'EKS_SECRETS_ENCRYPTED';
  /**
   * Check that Amazon ElasticSearch Service nodes are encrypted end to end.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/elasticsearch-node-to-node-encryption-check.html
   */
  public static readonly ELASTICSEARCH_NODE_TO_NODE_ENCRYPTION_CHECK = 'ELASTICSEARCH_NODE_TO_NODE_ENCRYPTION_CHECK';
  /**
   * Checks if managed platform updates in an AWS Elastic Beanstalk environment is enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/elastic-beanstalk-managed-updates-enabled.html
   */
  public static readonly ELASTIC_BEANSTALK_MANAGED_UPDATES_ENABLED = 'ELASTIC_BEANSTALK_MANAGED_UPDATES_ENABLED';
  /**
   * Checks if Application Load Balancers and Network Load Balancers
   * have listeners that are configured to use certificates from AWS Certificate Manager (ACM).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/elbv2-acm-certificate-required.html
   */
  public static readonly ELBV2_ACM_CERTIFICATE_REQUIRED = 'ELBV2_ACM_CERTIFICATE_REQUIRED';
  /**
   * Checks if an Elastic Load Balancer V2 (Application, Network, or Gateway Load Balancer)
   * has registered instances from multiple Availability Zones (AZ's).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/elbv2-multiple-az.html
   */
  public static readonly ELBV2_MULTIPLE_AZ = 'ELBV2_MULTIPLE_AZ';
  /**
   * Checks if cross-zone load balancing is enabled for the Classic Load Balancers (CLBs).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/elb-cross-zone-load-balancing-enabled.html
   */
  public static readonly ELB_CROSS_ZONE_LOAD_BALANCING_ENABLED = 'ELB_CROSS_ZONE_LOAD_BALANCING_ENABLED';
  /**
   * Checks whether your Classic Load Balancer is configured with SSL or HTTPS listeners.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/elb-tls-https-listeners-only.html
   */
  public static readonly ELB_TLS_HTTPS_LISTENERS_ONLY = 'ELB_TLS_HTTPS_LISTENERS_ONLY';
  /**
   * Checks whether the Classic Load Balancers use SSL certificates provided by AWS Certificate Manager.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/elb-acm-certificate-required.html
   */
  public static readonly ELB_ACM_CERTIFICATE_REQUIRED = 'ELB_ACM_CERTIFICATE_REQUIRED';
  /**
   * Checks whether your Classic Load Balancer SSL listeners are using a custom policy.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/elb-custom-security-policy-ssl-check.html
   */
  public static readonly ELB_CUSTOM_SECURITY_POLICY_SSL_CHECK = 'ELB_CUSTOM_SECURITY_POLICY_SSL_CHECK';
  /**
   * Checks whether Elastic Load Balancing has deletion protection enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/elb-deletion-protection-enabled.html
   */
  public static readonly ELB_DELETION_PROTECTION_ENABLED = 'ELB_DELETION_PROTECTION_ENABLED';
  /**
   * Checks whether the Application Load Balancer and the Classic Load Balancer have logging enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/elb-logging-enabled.html
   */
  public static readonly ELB_LOGGING_ENABLED = 'ELB_LOGGING_ENABLED';
  /**
   * Checks whether your Classic Load Balancer SSL listeners are using a predefined policy.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/elb-predefined-security-policy-ssl-check.html
   */
  public static readonly ELB_PREDEFINED_SECURITY_POLICY_SSL_CHECK = 'ELB_PREDEFINED_SECURITY_POLICY_SSL_CHECK';
  /**
   * Checks that Amazon EMR clusters have Kerberos enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/emr-kerberos-enabled.html
   */
  public static readonly EMR_KERBEROS_ENABLED = 'EMR_KERBEROS_ENABLED';
  /**
   * Checks whether Amazon Elastic MapReduce (EMR) clusters' master nodes have public IPs.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/emr-master-no-public-ip.html
   */
  public static readonly EMR_MASTER_NO_PUBLIC_IP = 'EMR_MASTER_NO_PUBLIC_IP';
  /**
   * Checks whether the EBS volumes that are in an attached state are encrypted.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/encrypted-volumes.html
   */
  public static readonly EBS_ENCRYPTED_VOLUMES = 'ENCRYPTED_VOLUMES';
  /**
   * Checks whether the security groups associated inScope resources are compliant with the
   * master security groups at each rule level based on allowSecurityGroup and denySecurityGroup flag.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/fms-security-group-audit-policy-check.html
   *
   * @deprecated Inactive managed rule
   *
   */
  public static readonly FMS_SECURITY_GROUP_AUDIT_POLICY_CHECK = 'FMS_SECURITY_GROUP_AUDIT_POLICY_CHECK';
  /**
   * Checks whether AWS Firewall Manager created security groups content is the same as the master security groups.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/fms-security-group-content-check.html
   *
   * @deprecated Inactive managed rule
   *
   */
  public static readonly FMS_SECURITY_GROUP_CONTENT_CHECK = 'FMS_SECURITY_GROUP_CONTENT_CHECK';
  /**
   * Checks whether Amazon EC2 or an elastic network interface is associated with AWS Firewall Manager security groups.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/fms-security-group-resource-association-check.html
   *
   * @deprecated Inactive managed rule
   *
   */
  public static readonly FMS_SECURITY_GROUP_RESOURCE_ASSOCIATION_CHECK = 'FMS_SECURITY_GROUP_RESOURCE_ASSOCIATION_CHECK';
  /**
   * Checks whether an Application Load Balancer, Amazon CloudFront distributions,
   * Elastic Load Balancer or Elastic IP has AWS Shield protection.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/fms-shield-resource-policy-check.html
   */
  public static readonly FMS_SHIELD_RESOURCE_POLICY_CHECK = 'FMS_SHIELD_RESOURCE_POLICY_CHECK';
  /**
   * Checks whether the web ACL is associated with an Application Load Balancer, API Gateway stage,
   * or Amazon CloudFront distributions.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/fms-webacl-resource-policy-check.html
   */
  public static readonly FMS_WEBACL_RESOURCE_POLICY_CHECK = 'FMS_WEBACL_RESOURCE_POLICY_CHECK';
  /**
   * Checks that the rule groups associate with the web ACL at the correct priority.
   * The correct priority is decided by the rank of the rule groups in the ruleGroups parameter.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/fms-webacl-rulegroup-association-check.html
   */
  public static readonly FMS_WEBACL_RULEGROUP_ASSOCIATION_CHECK = 'FMS_WEBACL_RULEGROUP_ASSOCIATION_CHECK';
  /**
   * Checks if a recovery point was created for Amazon FSx File Systems.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/fsx-last-backup-recovery-point-created.html
   */
  public static readonly FSX_LAST_BACKUP_RECOVERY_POINT_CREATED = 'FSX_LAST_BACKUP_RECOVERY_POINT_CREATED';
  /**
   * Checks if Amazon FSx File Systems are protected by a backup plan.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/fsx-resources-protected-by-backup-plan.html
   */
  public static readonly FSX_RESOURCES_PROTECTED_BY_BACKUP_PLAN = 'FSX_RESOURCES_PROTECTED_BY_BACKUP_PLAN';
  /**
   * Checks whether Amazon GuardDuty is enabled in your AWS account and region. If you provide an AWS account for centralization,
   * the rule evaluates the Amazon GuardDuty results in the centralized account.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/guardduty-enabled-centralized.html
   */
  public static readonly GUARDDUTY_ENABLED_CENTRALIZED = 'GUARDDUTY_ENABLED_CENTRALIZED';
  /**
   * Checks whether the Amazon GuardDuty has findings that are non archived.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/guardduty-non-archived-findings.html
   */
  public static readonly GUARDDUTY_NON_ARCHIVED_FINDINGS = 'GUARDDUTY_NON_ARCHIVED_FINDINGS';
  /**
   * Checks that inline policy feature is not in use.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-no-inline-policy-check.html
   */
  public static readonly IAM_NO_INLINE_POLICY_CHECK = 'IAM_NO_INLINE_POLICY_CHECK';
  /**
   * Checks whether IAM groups have at least one IAM user.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-group-has-users-check.html
   */
  public static readonly IAM_GROUP_HAS_USERS_CHECK = 'IAM_GROUP_HAS_USERS_CHECK';
  /**
   * Checks whether the account password policy for IAM users meets the specified requirements
   * indicated in the parameters.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-password-policy.html
   */
  public static readonly IAM_PASSWORD_POLICY = 'IAM_PASSWORD_POLICY';
  /**
   * Checks whether for each IAM resource, a policy ARN in the input parameter is attached to the IAM resource.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-policy-blacklisted-check.html
   */
  public static readonly IAM_POLICY_BLOCKED_CHECK = 'IAM_POLICY_BLACKLISTED_CHECK';
  /**
   * Checks whether the IAM policy ARN is attached to an IAM user, or an IAM group with one or more IAM users,
   * or an IAM role with one or more trusted entity.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-policy-in-use.html
   */
  public static readonly IAM_POLICY_IN_USE = 'IAM_POLICY_IN_USE';
  /**
   * Checks the IAM policies that you create for Allow statements that grant permissions to all actions on all resources.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-policy-no-statements-with-admin-access.html
   */
  public static readonly IAM_POLICY_NO_STATEMENTS_WITH_ADMIN_ACCESS = 'IAM_POLICY_NO_STATEMENTS_WITH_ADMIN_ACCESS';
  /**
   * Checks if AWS Identity and Access Management (IAM) policies that you create grant permissions to all actions on individual AWS resources.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-policy-no-statements-with-full-access.html
   */
  public static readonly IAM_POLICY_NO_STATEMENTS_WITH_FULL_ACCESS = 'IAM_POLICY_NO_STATEMENTS_WITH_FULL_ACCESS';
  /**
   * Checks that AWS Identity and Access Management (IAM) policies in a list of policies are attached to all AWS roles.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-role-managed-policy-check.html
   */
  public static readonly IAM_ROLE_MANAGED_POLICY_CHECK = 'IAM_ROLE_MANAGED_POLICY_CHECK';
  /**
   * Checks whether the root user access key is available.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-root-access-key-check.html
   */
  public static readonly IAM_ROOT_ACCESS_KEY_CHECK = 'IAM_ROOT_ACCESS_KEY_CHECK';
  /**
   * Checks whether IAM users are members of at least one IAM group.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-user-group-membership-check.html
   */
  public static readonly IAM_USER_GROUP_MEMBERSHIP_CHECK = 'IAM_USER_GROUP_MEMBERSHIP_CHECK';
  /**
   * Checks whether the AWS Identity and Access Management users have multi-factor authentication (MFA) enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-user-mfa-enabled.html
   */
  public static readonly IAM_USER_MFA_ENABLED = 'IAM_USER_MFA_ENABLED';
  /**
   * Checks that none of your IAM users have policies attached. IAM users must inherit permissions from IAM groups or roles.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-user-no-policies-check.html
   */
  public static readonly IAM_USER_NO_POLICIES_CHECK = 'IAM_USER_NO_POLICIES_CHECK';
  /**
   * Checks whether your AWS Identity and Access Management (IAM) users have passwords or
   * active access keys that have not been used within the specified number of days you provided.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-user-unused-credentials-check.html
   */
  public static readonly IAM_USER_UNUSED_CREDENTIALS_CHECK = 'IAM_USER_UNUSED_CREDENTIALS_CHECK';
  /**
   * Checks that Internet gateways (IGWs) are only attached to an authorized Amazon Virtual Private Cloud (VPCs).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/internet-gateway-authorized-vpc-only.html
   */
  public static readonly INTERNET_GATEWAY_AUTHORIZED_VPC_ONLY = 'INTERNET_GATEWAY_AUTHORIZED_VPC_ONLY';
  /**
   * Checks if Amazon Kinesis streams are encrypted at rest with server-side encryption.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/kinesis-stream-encrypted.html
   */
  public static readonly KINESIS_STREAM_ENCRYPTED = 'KINESIS_STREAM_ENCRYPTED';
  /**
   * Checks whether customer master keys (CMKs) are not scheduled for deletion in AWS Key Management Service (KMS).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/kms-cmk-not-scheduled-for-deletion.html
   */
  public static readonly KMS_CMK_NOT_SCHEDULED_FOR_DELETION = 'KMS_CMK_NOT_SCHEDULED_FOR_DELETION';
  /**
   * Checks whether the AWS Lambda function is configured with function-level concurrent execution limit.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/lambda-concurrency-check.html
   */
  public static readonly LAMBDA_CONCURRENCY_CHECK = 'LAMBDA_CONCURRENCY_CHECK';
  /**
   * Checks whether an AWS Lambda function is configured with a dead-letter queue.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/lambda-dlq-check.html
   */
  public static readonly LAMBDA_DLQ_CHECK = 'LAMBDA_DLQ_CHECK';
  /**
   * Checks whether the AWS Lambda function policy attached to the Lambda resource prohibits public access.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/lambda-function-public-access-prohibited.html
   */
  public static readonly LAMBDA_FUNCTION_PUBLIC_ACCESS_PROHIBITED = 'LAMBDA_FUNCTION_PUBLIC_ACCESS_PROHIBITED';
  /**
   * Checks that the lambda function settings for runtime, role, timeout, and memory size match the expected values.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/lambda-function-settings-check.html
   */
  public static readonly LAMBDA_FUNCTION_SETTINGS_CHECK = 'LAMBDA_FUNCTION_SETTINGS_CHECK';
  /**
   * Checks whether an AWS Lambda function is in an Amazon Virtual Private Cloud.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/lambda-inside-vpc.html
   */
  public static readonly LAMBDA_INSIDE_VPC = 'LAMBDA_INSIDE_VPC';
  /**
   * Checks if Lambda has more than 1 availability zone associated.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/lambda-vpc-multi-az-check.html
   */
  public static readonly LAMBDA_VPC_MULTI_AZ_CHECK = 'LAMBDA_VPC_MULTI_AZ_CHECK';
  /**
   * Checks whether AWS Multi-Factor Authentication (MFA) is enabled for all IAM users that use a console password.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/mfa-enabled-for-iam-console-access.html
   */
  public static readonly MFA_ENABLED_FOR_IAM_CONSOLE_ACCESS = 'MFA_ENABLED_FOR_IAM_CONSOLE_ACCESS';
  /**
   * Checks that there is at least one multi-region AWS CloudTrail.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/multi-region-cloudtrail-enabled.html
   */
  public static readonly CLOUDTRAIL_MULTI_REGION_ENABLED = 'MULTI_REGION_CLOUD_TRAIL_ENABLED';
  /**
   * Checks if default ports for SSH/RDP ingress traffic for network access control lists (NACLs) is unrestricted.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/nacl-no-unrestricted-ssh-rdp.html
   */
  public static readonly NACL_NO_UNRESTRICTED_SSH_RDP = 'NACL_NO_UNRESTRICTED_SSH_RDP';
  /**
   * Checks if an AWS Network Firewall policy is configured with a user defined stateless default action for fragmented packets.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/netfw-policy-default-action-fragment-packets.html
   */
  public static readonly NETFW_POLICY_DEFAULT_ACTION_FRAGMENT_PACKETS = 'NETFW_POLICY_DEFAULT_ACTION_FRAGMENT_PACKETS';
  /**
   * Checks if an AWS Network Firewall policy is configured with a user defined default stateless action for full packets.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/netfw-policy-default-action-full-packets.html
   */
  public static readonly NETFW_POLICY_DEFAULT_ACTION_FULL_PACKETS = 'NETFW_POLICY_DEFAULT_ACTION_FULL_PACKETS';
  /**
   * Check AWS Network Firewall policy is associated with stateful OR stateless rule groups.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/netfw-policy-rule-group-associated.html
   */
  public static readonly NETFW_POLICY_RULE_GROUP_ASSOCIATED = 'NETFW_POLICY_RULE_GROUP_ASSOCIATED';
  /**
   * Checks if a Stateless Network Firewall Rule Group contains rules.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/netfw-stateless-rule-group-not-empty.html
   */
  public static readonly NETFW_STATELESS_RULE_GROUP_NOT_EMPTY = 'NETFW_STATELESS_RULE_GROUP_NOT_EMPTY';
  /**
   * Checks if cross-zone load balancing is enabled on Network Load Balancers (NLBs).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/nlb-cross-zone-load-balancing-enabled.html
   */
  public static readonly NLB_CROSS_ZONE_LOAD_BALANCING_ENABLED = 'NLB_CROSS_ZONE_LOAD_BALANCING_ENABLED';
  /**
   * Checks if Amazon OpenSearch Service domains have fine-grained access control enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/opensearch-access-control-enabled.html
   */
  public static readonly OPENSEARCH_ACCESS_CONTROL_ENABLED = 'OPENSEARCH_ACCESS_CONTROL_ENABLED';
  /**
   * Checks if Amazon OpenSearch Service domains have audit logging enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/opensearch-audit-logging-enabled.html
   */
  public static readonly OPENSEARCH_AUDIT_LOGGING_ENABLED = 'OPENSEARCH_AUDIT_LOGGING_ENABLED';
  /**
   * Checks if Amazon OpenSearch Service domains are configured with at least three data nodes and zoneAwarenessEnabled is true.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/opensearch-data-node-fault-tolerance.html
   */
  public static readonly OPENSEARCH_DATA_NODE_FAULT_TOLERANCE = 'OPENSEARCH_DATA_NODE_FAULT_TOLERANCE';
  /**
   * Checks if Amazon OpenSearch Service domains have encryption at rest configuration enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/opensearch-encrypted-at-rest.html
   */
  public static readonly OPENSEARCH_ENCRYPTED_AT_REST = 'OPENSEARCH_ENCRYPTED_AT_REST';
  /**
   * Checks whether connections to OpenSearch domains are using HTTPS.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/opensearch-https-required.html
   */
  public static readonly OPENSEARCH_HTTPS_REQUIRED = 'OPENSEARCH_HTTPS_REQUIRED';
  /**
   * Checks if Amazon OpenSearch Service domains are in an Amazon Virtual Private Cloud (VPC).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/opensearch-in-vpc-only.html
   */
  public static readonly OPENSEARCH_IN_VPC_ONLY = 'OPENSEARCH_IN_VPC_ONLY';
  /**
   * Checks if Amazon OpenSearch Service domains are configured to send logs to Amazon CloudWatch Logs.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/opensearch-logs-to-cloudwatch.html
   */
  public static readonly OPENSEARCH_LOGS_TO_CLOUDWATCH = 'OPENSEARCH_LOGS_TO_CLOUDWATCH';
  /**
   * Check if Amazon OpenSearch Service nodes are encrypted end to end.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/opensearch-node-to-node-encryption-check.html
   */
  public static readonly OPENSEARCH_NODE_TO_NODE_ENCRYPTION_CHECK = 'OPENSEARCH_NODE_TO_NODE_ENCRYPTION_CHECK';
  /**
   * Checks if Amazon Relational Database Service (RDS) database instances are configured for automatic minor version upgrades.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-automatic-minor-version-upgrade-enabled.html
   */
  public static readonly RDS_AUTOMATIC_MINOR_VERSION_UPGRADE_ENABLED = 'RDS_AUTOMATIC_MINOR_VERSION_UPGRADE_ENABLED';
  /**
   * Checks if an Amazon Relational Database Service (Amazon RDS) database cluster has changed the admin username from its default value.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-cluster-default-admin-check.html
   */
  public static readonly RDS_CLUSTER_DEFAULT_ADMIN_CHECK = 'RDS_CLUSTER_DEFAULT_ADMIN_CHECK';
  /**
   * Checks if an Amazon Relational Database Service (Amazon RDS) cluster has deletion protection enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-cluster-deletion-protection-enabled.html
   */
  public static readonly RDS_CLUSTER_DELETION_PROTECTION_ENABLED = 'RDS_CLUSTER_DELETION_PROTECTION_ENABLED';
  /**
   * Checks if an Amazon RDS Cluster has AWS Identity and Access Management (IAM) authentication enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-cluster-iam-authentication-enabled.html
   */
  public static readonly RDS_CLUSTER_IAM_AUTHENTICATION_ENABLED = 'RDS_CLUSTER_IAM_AUTHENTICATION_ENABLED';
  /**
   * Checks if Multi-AZ replication is enabled on Amazon Aurora and Hermes clusters managed by Amazon Relational Database Service (Amazon RDS).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-cluster-multi-az-enabled.html
   */
  public static readonly RDS_CLUSTER_MULTI_AZ_ENABLED = 'RDS_CLUSTER_MULTI_AZ_ENABLED';
  /**
   * Checks if an Amazon Relational Database Service (Amazon RDS) database has changed the admin username from its default value.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-instance-default-admin-check.html
   */
  public static readonly RDS_INSTANCE_DEFAULT_ADMIN_CHECK = 'RDS_INSTANCE_DEFAULT_ADMIN_CHECK';
  /**
   *Checks if there are any Amazon Relational Database Service (RDS) DB security groups that are not the default DB security group.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-db-security-group-not-allowed.html
   */
  public static readonly RDS_DB_SECURITY_GROUP_NOT_ALLOWED = 'RDS_DB_SECURITY_GROUP_NOT_ALLOWED';
  /**
   * Checks if an Amazon Relational Database Service (Amazon RDS) instance has deletion protection enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-instance-deletion-protection-enabled.html
   */
  public static readonly RDS_INSTANCE_DELETION_PROTECTION_ENABLED = 'RDS_INSTANCE_DELETION_PROTECTION_ENABLED';
  /**
   * Checks if an Amazon RDS instance has AWS Identity and Access Management (IAM) authentication enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-instance-iam-authentication-enabled.html
   */
  public static readonly RDS_INSTANCE_IAM_AUTHENTICATION_ENABLED = 'RDS_INSTANCE_IAM_AUTHENTICATION_ENABLED';
  /**
   * Checks that respective logs of Amazon Relational Database Service (Amazon RDS) are enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-logging-enabled.html
   */
  public static readonly RDS_LOGGING_ENABLED = 'RDS_LOGGING_ENABLED';
  /**
   * Checks that Amazon Redshift automated snapshots are enabled for clusters.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/redshift-backup-enabled.html
   */
  public static readonly REDSHIFT_BACKUP_ENABLED = 'REDSHIFT_BACKUP_ENABLED';
  /**
   * Checks whether enhanced monitoring is enabled for Amazon Relational Database Service (Amazon RDS) instances.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-enhanced-monitoring-enabled.html
   */
  public static readonly RDS_ENHANCED_MONITORING_ENABLED = 'RDS_ENHANCED_MONITORING_ENABLED';
  /**
   * Checks whether Amazon Relational Database Service (Amazon RDS) DB snapshots are encrypted.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-snapshot-encrypted.html
   */
  public static readonly RDS_SNAPSHOT_ENCRYPTED = 'RDS_SNAPSHOT_ENCRYPTED';
  /**
   * Checks whether Amazon Redshift clusters require TLS/SSL encryption to connect to SQL clients.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/redshift-require-tls-ssl.html
   */
  public static readonly REDSHIFT_REQUIRE_TLS_SSL = 'REDSHIFT_REQUIRE_TLS_SSL';
  /**
   * Checks whether Amazon RDS database is present in back plans of AWS Backup.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-in-backup-plan.html
   */
  public static readonly RDS_IN_BACKUP_PLAN = 'RDS_IN_BACKUP_PLAN';
  /**
   * Checks if a recovery point was created for Amazon Relational Database Service (Amazon RDS).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-last-backup-recovery-point-created.html
   */
  public static readonly RDS_LAST_BACKUP_RECOVERY_POINT_CREATED = 'RDS_LAST_BACKUP_RECOVERY_POINT_CREATED';
  /**
   * Check whether the Amazon Relational Database Service instances are not publicly accessible.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-instance-public-access-check.html
   */
  public static readonly RDS_INSTANCE_PUBLIC_ACCESS_CHECK = 'RDS_INSTANCE_PUBLIC_ACCESS_CHECK';
  /**
   * Checks whether high availability is enabled for your RDS DB instances.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-multi-az-support.html
   */
  public static readonly RDS_MULTI_AZ_SUPPORT = 'RDS_MULTI_AZ_SUPPORT';
  /**
   * Checks if Amazon Relational Database Service (Amazon RDS) instances are protected by a backup plan.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-resources-protected-by-backup-plan.html
   */
  public static readonly RDS_RESOURCES_PROTECTED_BY_BACKUP_PLAN = 'RDS_RESOURCES_PROTECTED_BY_BACKUP_PLAN';
  /**
   * Checks if Amazon Relational Database Service (Amazon RDS) snapshots are public.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-snapshots-public-prohibited.html
   */
  public static readonly RDS_SNAPSHOTS_PUBLIC_PROHIBITED = 'RDS_SNAPSHOTS_PUBLIC_PROHIBITED';
  /**
   * Checks whether storage encryption is enabled for your RDS DB instances.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/rds-storage-encrypted.html
   */
  public static readonly RDS_STORAGE_ENCRYPTED = 'RDS_STORAGE_ENCRYPTED';
  /**
   * Checks if Amazon Redshift clusters are logging audits to a specific bucket.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/redshift-audit-logging-enabled.html
   */
  public static readonly REDSHIFT_AUDIT_LOGGING_ENABLED = 'REDSHIFT_AUDIT_LOGGING_ENABLED';
  /**
   * Checks whether Amazon Redshift clusters have the specified settings.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/redshift-cluster-configuration-check.html
   */
  public static readonly REDSHIFT_CLUSTER_CONFIGURATION_CHECK = 'REDSHIFT_CLUSTER_CONFIGURATION_CHECK';
  /**
   * Checks if Amazon Redshift clusters are using a specified AWS Key Management Service (AWS KMS) key for encryption.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/redshift-cluster-kms-enabled.html
   */
  public static readonly REDSHIFT_CLUSTER_KMS_ENABLED = 'REDSHIFT_CLUSTER_KMS_ENABLED';
  /**
   * Checks whether Amazon Redshift clusters have the specified maintenance settings.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/redshift-cluster-maintenancesettings-check.html
   */
  public static readonly REDSHIFT_CLUSTER_MAINTENANCE_SETTINGS_CHECK = 'REDSHIFT_CLUSTER_MAINTENANCESETTINGS_CHECK';
  /**
   * Checks whether Amazon Redshift clusters are not publicly accessible.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/redshift-cluster-public-access-check.html
   */
  public static readonly REDSHIFT_CLUSTER_PUBLIC_ACCESS_CHECK = 'REDSHIFT_CLUSTER_PUBLIC_ACCESS_CHECK';
  /**
   * Checks if an Amazon Redshift cluster has changed the admin username from its default value.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/redshift-default-admin-check.html
   */
  public static readonly REDSHIFT_DEFAULT_ADMIN_CHECK = 'REDSHIFT_DEFAULT_ADMIN_CHECK';
  /**
   * Checks if a Redshift cluster has changed its database name from the default value.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/redshift-default-db-name-check.html
   */
  public static readonly REDSHIFT_DEFAULT_DB_NAME_CHECK = 'REDSHIFT_DEFAULT_DB_NAME_CHECK';
  /**
   * Checks if Amazon Redshift cluster has 'enhancedVpcRouting' enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/redshift-enhanced-vpc-routing-enabled.html
   */
  public static readonly REDSHIFT_ENHANCED_VPC_ROUTING_ENABLED = 'REDSHIFT_ENHANCED_VPC_ROUTING_ENABLED';
  /**
   * Checks whether your resources have the tags that you specify.
   * For example, you can check whether your Amazon EC2 instances have the CostCenter tag.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/required-tags.html
   */
  public static readonly REQUIRED_TAGS = 'REQUIRED_TAGS';
  /**
   * Checks whether the security groups in use do not allow unrestricted incoming TCP traffic to the specified ports.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/restricted-common-ports.html
   */
  public static readonly EC2_SECURITY_GROUPS_RESTRICTED_INCOMING_TRAFFIC = 'RESTRICTED_INCOMING_TRAFFIC';
  /**
   * Checks whether the incoming SSH traffic for the security groups is accessible.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/restricted-ssh.html
   */
  public static readonly EC2_SECURITY_GROUPS_INCOMING_SSH_DISABLED = 'INCOMING_SSH_DISABLED';
  /**
   * Checks whether your AWS account is enabled to use multi-factor authentication (MFA) hardware
   * device to sign in with root credentials.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/root-account-hardware-mfa-enabled.html
   */
  public static readonly ROOT_ACCOUNT_HARDWARE_MFA_ENABLED = 'ROOT_ACCOUNT_HARDWARE_MFA_ENABLED';
  /**
   * Checks whether users of your AWS account require a multi-factor authentication (MFA) device
   * to sign in with root credentials.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/root-account-mfa-enabled.html
   */
  public static readonly ROOT_ACCOUNT_MFA_ENABLED = 'ROOT_ACCOUNT_MFA_ENABLED';
  /**
   * Checks whether Amazon Simple Storage Service (Amazon S3) bucket has lock enabled, by default.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-default-lock-enabled.html
   */
  public static readonly S3_BUCKET_DEFAULT_LOCK_ENABLED = 'S3_BUCKET_DEFAULT_LOCK_ENABLED';
  /**
   * Checks whether the Amazon Simple Storage Service (Amazon S3) buckets are encrypted
   * with AWS Key Management Service (AWS KMS).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-default-encryption-kms.html
   */
  public static readonly S3_DEFAULT_ENCRYPTION_KMS = 'S3_DEFAULT_ENCRYPTION_KMS';
  /**
   * Checks that AWS Security Hub is enabled for an AWS account.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/securityhub-enabled.html
   */
  public static readonly SECURITYHUB_ENABLED = 'SECURITYHUB_ENABLED';
  /**
   * Checks whether Amazon SNS topic is encrypted with AWS Key Management Service (AWS KMS).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/sns-encrypted-kms.html
   */
  public static readonly SNS_ENCRYPTED_KMS = 'SNS_ENCRYPTED_KMS';
  /**
   * Checks if Amazon Simple Notification Service (SNS) logging is enabled
   * for the delivery status of notification messages sent to a topic for the endpoints.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/sns-topic-message-delivery-notification-enabled.html
   */
  public static readonly SNS_TOPIC_MESSAGE_DELIVERY_NOTIFICATION_ENABLED = 'SNS_TOPIC_MESSAGE_DELIVERY_NOTIFICATION_ENABLED';
  /**
   * Checks if AWS Systems Manager documents owned by the account are public.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ssm-document-not-public.html
   */
  public static readonly SSM_DOCUMENT_NOT_PUBLIC = 'SSM_DOCUMENT_NOT_PUBLIC';
  /**
   * Checks if a recovery point was created for AWS Storage Gateway volumes.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/storagegateway-last-backup-recovery-point-created.html
   */
  public static readonly STORAGEGATEWAY_LAST_BACKUP_RECOVERY_POINT_CREATED = 'STORAGEGATEWAY_LAST_BACKUP_RECOVERY_POINT_CREATED';
  /**
   * hecks if Amazon Virtual Private Cloud (Amazon VPC) subnets are assigned a public IP address.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/subnet-auto-assign-public-ip-disabled.html
   */
  public static readonly SUBNET_AUTO_ASSIGN_PUBLIC_IP_DISABLED = 'SUBNET_AUTO_ASSIGN_PUBLIC_IP_DISABLED';
  /**
   * Checks whether the required public access block settings are configured from account level.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-account-level-public-access-blocks.html
   */
  public static readonly S3_ACCOUNT_LEVEL_PUBLIC_ACCESS_BLOCKS = 'S3_ACCOUNT_LEVEL_PUBLIC_ACCESS_BLOCKS';
  /**
   * Checks if the required public access block settings are configured from account level.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-account-level-public-access-blocks-periodic.html
   */
  public static readonly S3_ACCOUNT_LEVEL_PUBLIC_ACCESS_BLOCKS_PERIODIC = 'S3_ACCOUNT_LEVEL_PUBLIC_ACCESS_BLOCKS_PERIODIC';
  /**
   * Checks if Amazon Simple Storage Service (Amazon S3) Buckets allow user permissions through access control lists (ACLs).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-acl-prohibited.html
   */
  public static readonly S3_BUCKET_ACL_PROHIBITED = 'S3_BUCKET_ACL_PROHIBITED';
  /**
   * Checks if the Amazon Simple Storage Service bucket policy does not allow blacklisted bucket-level
   * and object-level actions on resources in the bucket for principals from other AWS accounts.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-blacklisted-actions-prohibited.html
   */
  public static readonly S3_BUCKET_BLOCKED_ACTIONS_PROHIBITED = 'S3_BUCKET_BLACKLISTED_ACTIONS_PROHIBITED';
  /**
   * Checks if Amazon Simple Storage Service (Amazon S3) buckets are publicly accessible.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-level-public-access-prohibited.html
   */
  public static readonly S3_BUCKET_LEVEL_PUBLIC_ACCESS_PROHIBITED = 'S3_BUCKET_LEVEL_PUBLIC_ACCESS_PROHIBITED';
  /**
   * Checks whether logging is enabled for your S3 buckets.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-logging-enabled.html
   */
  public static readonly S3_BUCKET_LOGGING_ENABLED = 'S3_BUCKET_LOGGING_ENABLED';
  /**
   * Checks that the access granted by the Amazon S3 bucket is restricted by any of the AWS principals, federated users,
   * service principals, IP addresses, or VPCs that you provide.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-policy-grantee-check.html
   */
  public static readonly S3_BUCKET_POLICY_GRANTEE_CHECK = 'S3_BUCKET_POLICY_GRANTEE_CHECK';
  /**
   * Checks if your Amazon Simple Storage Service bucket policies do not allow other inter-account permissions
   * than the control Amazon S3 bucket policy that you provide.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-policy-not-more-permissive.html
   */
  public static readonly S3_BUCKET_POLICY_NOT_MORE_PERMISSIVE = 'S3_BUCKET_POLICY_NOT_MORE_PERMISSIVE';
  /**
   * Checks if your Amazon S3 buckets do not allow public read access.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-public-read-prohibited.html
   */
  public static readonly S3_BUCKET_PUBLIC_READ_PROHIBITED = 'S3_BUCKET_PUBLIC_READ_PROHIBITED';
  /**
   * Checks that your Amazon S3 buckets do not allow public write access.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-public-write-prohibited.html
   */
  public static readonly S3_BUCKET_PUBLIC_WRITE_PROHIBITED = 'S3_BUCKET_PUBLIC_WRITE_PROHIBITED';
  /**
   * Checks whether S3 buckets have cross-region replication enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-replication-enabled.html
   */
  public static readonly S3_BUCKET_REPLICATION_ENABLED = 'S3_BUCKET_REPLICATION_ENABLED';
  /**
   * Checks that your Amazon S3 bucket either has Amazon S3 default encryption enabled or that the
   * S3 bucket policy explicitly denies put-object requests without server side encryption that
   * uses AES-256 or AWS Key Management Service.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-server-side-encryption-enabled.html
   */
  public static readonly S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED = 'S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED';
  /**
   * Checks whether S3 buckets have policies that require requests to use Secure Socket Layer (SSL).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-ssl-requests-only.html
   */
  public static readonly S3_BUCKET_SSL_REQUESTS_ONLY= 'S3_BUCKET_SSL_REQUESTS_ONLY';
  /**
   * Checks whether versioning is enabled for your S3 buckets.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-versioning-enabled.html
   */
  public static readonly S3_BUCKET_VERSIONING_ENABLED = 'S3_BUCKET_VERSIONING_ENABLED';
  /**
   * Checks if Amazon S3 Events Notifications are enabled on an S3 bucket.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-event-notifications-enabled.html
   */
  public static readonly S3_EVENT_NOTIFICATIONS_ENABLED = 'S3_EVENT_NOTIFICATIONS_ENABLED';
  /**
   * Checks if a recovery point was created for Amazon Simple Storage Service (Amazon S3).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-last-backup-recovery-point-created.html
   */
  public static readonly S3_LAST_BACKUP_RECOVERY_POINT_CREATED = 'S3_LAST_BACKUP_RECOVERY_POINT_CREATED';
  /**
   * Checks if a lifecycle rule is configured for an Amazon Simple Storage Service (Amazon S3) bucket.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-lifecycle-policy-check.html
   */
  public static readonly S3_LIFECYCLE_POLICY_CHECK = 'S3_LIFECYCLE_POLICY_CHECK';
  /**
   * Checks if Amazon Simple Storage Service (Amazon S3) buckets are protected by a backup plan.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-resources-protected-by-backup-plan.html
   */
  public static readonly S3_RESOURCES_PROTECTED_BY_BACKUP_PLAN = 'S3_RESOURCES_PROTECTED_BY_BACKUP_PLAN';
  /**
   * Checks if Amazon Simple Storage Service (Amazon S3) version enabled buckets have lifecycle policy configured.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-version-lifecycle-policy-check.html
   */
  public static readonly S3_VERSION_LIFECYCLE_POLICY_CHECK = 'S3_VERSION_LIFECYCLE_POLICY_CHECK';
  /**
   * Checks whether AWS Key Management Service (KMS) key is configured for an Amazon SageMaker endpoint configuration.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/sagemaker-endpoint-configuration-kms-key-configured.html
   */
  public static readonly SAGEMAKER_ENDPOINT_CONFIGURATION_KMS_KEY_CONFIGURED = 'SAGEMAKER_ENDPOINT_CONFIGURATION_KMS_KEY_CONFIGURED';
  /**
   * Check whether an AWS Key Management Service (KMS) key is configured for SageMaker notebook instance.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/sagemaker-notebook-instance-kms-key-configured.html
   */
  public static readonly SAGEMAKER_NOTEBOOK_INSTANCE_KMS_KEY_CONFIGURED = 'SAGEMAKER_NOTEBOOK_INSTANCE_KMS_KEY_CONFIGURED';
  /**
   * Checks whether direct internet access is disabled for an Amazon SageMaker notebook instance.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/sagemaker-notebook-no-direct-internet-access.html
   */
  public static readonly SAGEMAKER_NOTEBOOK_NO_DIRECT_INTERNET_ACCESS = 'SAGEMAKER_NOTEBOOK_NO_DIRECT_INTERNET_ACCESS';
  /**
   * Checks whether AWS Secrets Manager secret has rotation enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/secretsmanager-rotation-enabled-check.html
   */
  public static readonly SECRETSMANAGER_ROTATION_ENABLED_CHECK = 'SECRETSMANAGER_ROTATION_ENABLED_CHECK';
  /**
   * Checks whether AWS Secrets Manager secret rotation has rotated successfully as per the rotation schedule.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/secretsmanager-scheduled-rotation-success-check.html
   */
  public static readonly SECRETSMANAGER_SCHEDULED_ROTATION_SUCCESS_CHECK = 'SECRETSMANAGER_SCHEDULED_ROTATION_SUCCESS_CHECK';
  /**
   * Checks if AWS Secrets Manager secrets have been rotated in the past specified number of days.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/secretsmanager-secret-periodic-rotation.html
   */
  public static readonly SECRETSMANAGER_SECRET_PERIODIC_ROTATION = 'SECRETSMANAGER_SECRET_PERIODIC_ROTATION';
  /**
   * Checks if AWS Secrets Manager secrets have been accessed within a specified number of days.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/secretsmanager-secret-unused.html
   */
  public static readonly SECRETSMANAGER_SECRET_UNUSED = 'SECRETSMANAGER_SECRET_UNUSED';
  /**
   * Checks if all secrets in AWS Secrets Manager are encrypted using the AWS managed key (aws/secretsmanager)
   * or a customer managed key that was created in AWS Key Management Service (AWS KMS).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/secretsmanager-using-cmk.html
   */
  public static readonly SECRETSMANAGER_USING_CMK = 'SECRETSMANAGER_USING_CMK';
  /**
   * Checks whether Service Endpoint for the service provided in rule parameter is created for each Amazon VPC.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/service-vpc-endpoint-enabled.html
   */
  public static readonly SERVICE_VPC_ENDPOINT_ENABLED = 'SERVICE_VPC_ENDPOINT_ENABLED';
  /**
   * Checks whether EBS volumes are attached to EC2 instances.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/shield-advanced-enabled-autorenew.html
   */
  public static readonly SHIELD_ADVANCED_ENABLED_AUTO_RENEW = 'SHIELD_ADVANCED_ENABLED_AUTORENEW';
  /**
   * Verify that DDoS response team (DRT) can access AWS account.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/shield-drt-access.html
   */
  public static readonly SHIELD_DRT_ACCESS = 'SHIELD_DRT_ACCESS';
  /**
   * Checks if a recovery point was created for AWS Backup-Gateway VirtualMachines.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/virtualmachine-last-backup-recovery-point-created.html
   */
  public static readonly VIRTUALMACHINE_LAST_BACKUP_RECOVERY_POINT_CREATED = 'VIRTUALMACHINE_LAST_BACKUP_RECOVERY_POINT_CREATED';
  /**
   * Checks if AWS Backup-Gateway VirtualMachines are protected by a backup plan.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/virtualmachine-resources-protected-by-backup-plan.html
   */
  public static readonly VIRTUALMACHINE_RESOURCES_PROTECTED_BY_BACKUP_PLAN = 'VIRTUALMACHINE_RESOURCES_PROTECTED_BY_BACKUP_PLAN';
  /**
   * Checks that the default security group of any Amazon Virtual Private Cloud (VPC) does not
   * allow inbound or outbound traffic. The rule returns NOT_APPLICABLE if the security group
   * is not default.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/vpc-default-security-group-closed.html
   */
  public static readonly VPC_DEFAULT_SECURITY_GROUP_CLOSED = 'VPC_DEFAULT_SECURITY_GROUP_CLOSED';
  /**
   * Checks whether Amazon Virtual Private Cloud flow logs are found and enabled for Amazon VPC.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/vpc-flow-logs-enabled.html
   */
  public static readonly VPC_FLOW_LOGS_ENABLED = 'VPC_FLOW_LOGS_ENABLED';
  /**
   * Checks if there are unused network access control lists (network ACLs).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/vpc-network-acl-unused-check.html
   */
  public static readonly VPC_NETWORK_ACL_UNUSED_CHECK = 'VPC_NETWORK_ACL_UNUSED_CHECK';
  /**
   * Checks if DNS resolution from accepter/requester VPC to private IP is enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/vpc-peering-dns-resolution-check.html
   */
  public static readonly VPC_PEERING_DNS_RESOLUTION_CHECK = 'VPC_PEERING_DNS_RESOLUTION_CHECK';
  /**
   * Checks whether the security group with 0.0.0.0/0 of any Amazon Virtual Private Cloud (Amazon VPC)
   * allows only specific inbound TCP or UDP traffic.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/vpc-sg-open-only-to-authorized-ports.html
   */
  public static readonly VPC_SG_OPEN_ONLY_TO_AUTHORIZED_PORTS = 'VPC_SG_OPEN_ONLY_TO_AUTHORIZED_PORTS';
  /**
   * Checks that both AWS Virtual Private Network tunnels provided by AWS Site-to-Site VPN are in
   * UP status.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/vpc-vpn-2-tunnels-up.html
   */
  public static readonly VPC_VPN_2_TUNNELS_UP = 'VPC_VPN_2_TUNNELS_UP';
  /**
   * Checks if logging is enabled on AWS Web Application Firewall (WAF) classic global web ACLs.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/waf-classic-logging-enabled.html
   */
  public static readonly WAF_CLASSIC_LOGGING_ENABLED = 'WAF_CLASSIC_LOGGING_ENABLED';
  /**
   * Checks whether logging is enabled on AWS Web Application Firewall (WAFV2) regional and global
   * web access control list (ACLs).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/wafv2-logging-enabled.html
   */
  public static readonly WAFV2_LOGGING_ENABLED = 'WAFV2_LOGGING_ENABLED';
  /**
   * Checks if an AWS WAF Classic rule group contains any rules.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/waf-global-rulegroup-not-empty.html
   */
  public static readonly WAF_GLOBAL_RULEGROUP_NOT_EMPTY = 'WAF_GLOBAL_RULEGROUP_NOT_EMPTY';
  /**
   * Checks if an AWS WAF global rule contains any conditions.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/waf-global-rule-not-empty.html
   */
  public static readonly WAF_GLOBAL_RULE_NOT_EMPTY = 'WAF_GLOBAL_RULE_NOT_EMPTY';
  /**
   * Checks whether a WAF Global Web ACL contains any WAF rules or rule groups.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/waf-global-webacl-not-empty.html
   */
  public static readonly WAF_GLOBAL_WEBACL_NOT_EMPTY = 'WAF_GLOBAL_WEBACL_NOT_EMPTY';
  /**
   * Checks if WAF Regional rule groups contain any rules.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/waf-regional-rulegroup-not-empty.html
   */
  public static readonly WAF_REGIONAL_RULEGROUP_NOT_EMPTY = 'WAF_REGIONAL_RULEGROUP_NOT_EMPTY';
  /**
   * Checks whether WAF regional rule contains conditions.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/waf-regional-rule-not-empty.html
   */
  public static readonly WAF_REGIONAL_RULE_NOT_EMPTY = 'WAF_REGIONAL_RULE_NOT_EMPTY';
  /**
   * Checks if a WAF regional Web ACL contains any WAF rules or rule groups.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/waf-regional-webacl-not-empty.html
   */
  public static readonly WAF_REGIONAL_WEBACL_NOT_EMPTY = 'WAF_REGIONAL_WEBACL_NOT_EMPTY';

  // utility class
  private constructor() { }
}

/**
 * Resources types that are supported by AWS Config
 * @see https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html
 */
export class ResourceType {
  /** API Gateway Stage */
  public static readonly APIGATEWAY_STAGE = new ResourceType('AWS::ApiGateway::Stage');
  /** API Gatewayv2 Stage */
  public static readonly APIGATEWAYV2_STAGE = new ResourceType('AWS::ApiGatewayV2::Stage');
  /** API Gateway REST API */
  public static readonly APIGATEWAY_REST_API = new ResourceType('AWS::ApiGateway::RestApi');
  /** API Gatewayv2 API */
  public static readonly APIGATEWAYV2_API = new ResourceType('AWS::ApiGatewayV2::Api');
  /** Amazon CloudFront Distribution */
  public static readonly CLOUDFRONT_DISTRIBUTION = new ResourceType('AWS::CloudFront::Distribution');
  /** Amazon CloudFront streaming distribution */
  public static readonly CLOUDFRONT_STREAMING_DISTRIBUTION = new ResourceType('AWS::CloudFront::StreamingDistribution');
  /** Amazon CloudWatch Alarm */
  public static readonly CLOUDWATCH_ALARM = new ResourceType('AWS::CloudWatch::Alarm');
  /** Amazon CloudWatch RUM */
  public static readonly CLOUDWATCH_RUM_APP_MONITOR = new ResourceType('AWS::RUM::AppMonitor');
  /** Amazon DynamoDB Table */
  public static readonly DYNAMODB_TABLE = new ResourceType('AWS::DynamoDB::Table');
  /** Elastic Block Store (EBS) volume */
  public static readonly EBS_VOLUME = new ResourceType('AWS::EC2::Volume');
  /** EC2 host */
  public static readonly EC2_HOST = new ResourceType('AWS::EC2::Host');
  /** EC2 Elastic IP */
  public static readonly EC2_EIP = new ResourceType('AWS::EC2::EIP');
  /** EC2 instance */
  public static readonly EC2_INSTANCE = new ResourceType('AWS::EC2::Instance');
  /** EC2 Network Interface */
  public static readonly EC2_NETWORK_INTERFACE = new ResourceType('AWS::EC2::NetworkInterface');
  /** EC2 security group */
  public static readonly EC2_SECURITY_GROUP = new ResourceType('AWS::EC2::SecurityGroup');
  /** EC2 NAT gateway */
  public static readonly EC2_NAT_GATEWAY = new ResourceType('AWS::EC2::NatGateway');
  /** EC2 Egress only internet gateway */
  public static readonly EC2_EGRESS_ONLY_INTERNET_GATEWAY = new ResourceType('AWS::EC2::EgressOnlyInternetGateway');
  /** EC2 flow log */
  public static readonly EC2_FLOW_LOG = new ResourceType('AWS::EC2::FlowLog');
  /** EC2 transit gateway */
  public static readonly EC2_TRANSIT_GATEWAY = new ResourceType('AWS::EC2::TransitGateway');
  /** EC2 transit gateway attachment */
  public static readonly EC2_TRANSIT_GATEWAY_ATTACHMENT = new ResourceType('AWS::EC2::TransitGatewayAttachment');
  /** EC2 transit gateway route table */
  public static readonly EC2_TRANSIT_GATEWAY_ROUTE_TABLE = new ResourceType('AWS::EC2::TransitGatewayRouteTable');
  /** EC2 VPC endpoint */
  public static readonly EC2_VPC_ENDPOINT = new ResourceType('AWS::EC2::VPCEndpoint');
  /** EC2 VPC endpoint service */
  public static readonly EC2_VPC_ENDPOINT_SERVICE = new ResourceType('AWS::EC2::VPCEndpointService');
  /** EC2 VPC peering connection */
  public static readonly EC2_VPC_PEERING_CONNECTION = new ResourceType('AWS::EC2::VPCPeeringConnection');
  /** EC2 registered HA instance */
  public static readonly EC2_REGISTERED_HA_INSTANCE = new ResourceType('AWS::EC2::RegisteredHAInstance');
  /** EC2 launch template */
  public static readonly EC2_LAUNCH_TEMPLATE = new ResourceType('AWS::EC2::LaunchTemplate');
  /** EC2 Network Insights Access Scope Analysis */
  public static readonly EC2_NETWORK_INSIGHTS_ACCESS_SCOPE_ANALYSIS = new ResourceType('AWS::EC2::NetworkInsightsAccessScopeAnalysis');
  /** EC2 Image Builder ContainerRecipe */
  public static readonly IMAGEBUILDER_CONTAINER_RECIPE = new ResourceType('AWS::ImageBuilder::ContainerRecipe');
  /** EC2 Image Builder DistributionConfiguration */
  public static readonly IMAGEBUILDER_DISTRIBUTION_CONFIGURATION = new ResourceType('AWS::ImageBuilder::DistributionConfiguration');
  /** EC2 Image Builder InfrastructureConfiguration */
  public static readonly IMAGEBUILDER_INFRASTRUCTURE_CONFIGURATION = new ResourceType('AWS::ImageBuilder::InfrastructureConfiguration');
  /** Amazon ECR repository */
  public static readonly ECR_REPOSITORY = new ResourceType('AWS::ECR::Repository');
  /** Amazon ECR registry policy */
  public static readonly ECR_REGISTRY_POLICY = new ResourceType('AWS::ECR::RegistryPolicy');
  /** Amazon ECR public repository */
  public static readonly ECR_PUBLIC_REPOSITORY = new ResourceType('AWS::ECR::PublicRepository');
  /** Amazon ECS cluster */
  public static readonly ECS_CLUSTER = new ResourceType('AWS::ECS::Cluster');
  /** Amazon ECS task definition */
  public static readonly ECS_TASK_DEFINITION = new ResourceType('AWS::ECS::TaskDefinition');
  /** Amazon ECS service */
  public static readonly ECS_SERVICE = new ResourceType('AWS::ECS::Service');
  /** Amazon EFS file system */
  public static readonly EFS_FILE_SYSTEM = new ResourceType('AWS::EFS::FileSystem');
  /** Amazon EFS access point */
  public static readonly EFS_ACCESS_POINT = new ResourceType('AWS::EFS::AccessPoint');
  /** Amazon Elastic Kubernetes Service cluster */
  public static readonly EKS_CLUSTER = new ResourceType('AWS::EKS::Cluster');
  /** Amazon Elastic Kubernetes Service identity provider config */
  public static readonly EKS_IDENTITY_PROVIDER_CONFIG = new ResourceType('AWS::EKS::IdentityProviderConfig');
  /** Amazon Elastic Kubernetes Service addon */
  public static readonly EKS_ADDON = new ResourceType('AWS::EKS::Addon');
  /** Amazon EMR security configuration */
  public static readonly EMR_SECURITY_CONFIGURATION = new ResourceType('AWS::EMR::SecurityConfiguration');
  /** Amazon EventBridge EventBus */
  public static readonly EVENTBRIDGE_EVENTBUS = new ResourceType('AWS::Events::EventBus');
  /** Amazon EventBridge Api Destination */
  public static readonly EVENTBRIDGE_API_DESTINATION = new ResourceType('AWS::Events::ApiDestination');
  /** Amazon EventBridge Archive */
  public static readonly EVENTBRIDGE_ARCHIVE = new ResourceType('AWS::Events::Archive');
  /** Amazon EventBridge Endpoint */
  public static readonly EVENTBRIDGE_ENDPOINT = new ResourceType('AWS::Events::Endpoint');
  /** Amazon EventBridge EventSchemas registry */
  public static readonly EVENTSCHEMAS_REGISTRY = new ResourceType('AWS::EventSchemas::Registry');
  /** Amazon EventBridge EventSchemas registry policy */
  public static readonly EVENTSCHEMAS_REGISTRY_POLICY = new ResourceType('AWS::EventSchemas::RegistryPolicy');
  /** Amazon EventBridge EventSchemas discoverer */
  public static readonly EVENTSCHEMAS_DISCOVERER = new ResourceType('AWS::EventSchemas::Discoverer');
  /** AWS FraudDetector label */
  public static readonly FRAUDDETECTOR_LABEL = new ResourceType('AWS::FraudDetector::Label');
  /** AWS FraudDetector entity type */
  public static readonly FRAUDDETECTOR_ENTITY_TYPE = new ResourceType('AWS::FraudDetector::EntityType');
  /** AWS FraudDetector variable */
  public static readonly FRAUDDETECTOR_VARIABLE = new ResourceType('AWS::FraudDetector::Variable');
  /** AWS FraudDetector outcome */
  public static readonly FRAUDDETECTOR_OUTCOME = new ResourceType('AWS::FraudDetector::Outcome');
  /** Amazon GuardDuty detector */
  public static readonly GUARDDUTY_DETECTOR = new ResourceType('AWS::GuardDuty::Detector');
  /** Amazon GuardDuty Threat Intel Set */
  public static readonly GUARDDUTY_THREAT_INTEL_SET = new ResourceType('AWS::GuardDuty::ThreatIntelSet');
  /** Amazon GuardDuty IP Set */
  public static readonly GUARDDUTY_IP_SET = new ResourceType(' AWS::GuardDuty::IPSet');
  /** Amazon GuardDuty Filter */
  public static readonly GUARDDUTY_FILTER = new ResourceType('AWS::GuardDuty::Filter');
  /** Amazon ElasticSearch domain */
  public static readonly ELASTICSEARCH_DOMAIN = new ResourceType('AWS::Elasticsearch::Domain');
  /** Amazon Interactive Video Service (IVS) channel */
  public static readonly IVS_CHANNEL = new ResourceType('AWS::IVS::Channel');
  /** Amazon Interactive Video Service (IVS) recording configuration */
  public static readonly IVS_RECORDING_CONFIGURATION = new ResourceType('AWS::IVS::RecordingConfiguration');
  /** Amazon Interactive Video Service (IVS) playback key pair */
  public static readonly IVS_PLAYBACK_KEYPAIR = new ResourceType('AWS::IVS::PlaybackKeyPair');
  /** Amazon OpenSearch domain */
  public static readonly OPENSEARCH_DOMAIN = new ResourceType('AWS::OpenSearch::Domain');
  /** Amazon QLDB ledger */
  public static readonly QLDB_LEDGER = new ResourceType('AWS::QLDB::Ledger');
  /** Amazon Kinesis stream */
  public static readonly KINESIS_STREAM = new ResourceType('AWS::Kinesis::Stream');
  /** Amazon Kinesis stream consumer */
  public static readonly KINESIS_STREAM_CONSUMER = new ResourceType('AWS::Kinesis::StreamConsumer');
  /** Amazon Kinesis Analytics V2 application */
  public static readonly KINESIS_ANALYTICS_V2_APPLICATION = new ResourceType('AWS::KinesisAnalyticsV2::Application');
  /** Amazon Lightsail Certificate */
  public static readonly LIGHTSAIL_CERTIFICATE = new ResourceType('AWS::Lightsail::Certificate');
  /** Amazon Lightsail Disk */
  public static readonly LIGHTSAIL_DISK = new ResourceType('AWS::Lightsail::Disk');
  /** AWS Lightsail bucket */
  public static readonly LIGHTSAIL_BUCKET = new ResourceType('AWS::Lightsail::Bucket');
  /** AWS Lightsail static IP */
  public static readonly LIGHTSAIL_STATIC_IP = new ResourceType('AWS::Lightsail::StaticIp');
  /** Amazon MQ broker */
  public static readonly AMAZON_MQ_BROKER = new ResourceType('AWS::AmazonMQ::Broker');
  /** Amazon MSK cluster */
  public static readonly MSK_CLUSTER = new ResourceType('AWS::MSK::Cluster');
  /** Amazon Redshift cluster */
  public static readonly REDSHIFT_CLUSTER = new ResourceType('AWS::Redshift::Cluster');
  /** Amazon Redshift cluster parameter group */
  public static readonly REDSHIFT_CLUSTER_PARAMETER_GROUP = new ResourceType('AWS::Redshift::ClusterParameterGroup');
  /** Amazon Redshift cluster security group */
  public static readonly REDSHIFT_CLUSTER_SECURITY_GROUP = new ResourceType('AWS::Redshift::ClusterSecurityGroup');
  /** Amazon Redshift cluster snapshot */
  public static readonly REDSHIFT_CLUSTER_SNAPSHOT = new ResourceType('AWS::Redshift::ClusterSnapshot');
  /** Amazon Redshift cluster subnet group */
  public static readonly REDSHIFT_CLUSTER_SUBNET_GROUP = new ResourceType('AWS::Redshift::ClusterSubnetGroup');
  /** Amazon Redshift event subscription */
  public static readonly REDSHIFT_EVENT_SUBSCRIPTION = new ResourceType('AWS::Redshift::EventSubscription');
  /** Amazon RDS database instance */
  public static readonly RDS_DB_INSTANCE = new ResourceType('AWS::RDS::DBInstance');
  /** Amazon RDS database security group */
  public static readonly RDS_DB_SECURITY_GROUP = new ResourceType('AWS::RDS::DBSecurityGroup');
  /** Amazon RDS database snapshot */
  public static readonly RDS_DB_SNAPSHOT = new ResourceType('AWS::RDS::DBSnapshot');
  /** Amazon RDS database subnet group */
  public static readonly RDS_DB_SUBNET_GROUP = new ResourceType('AWS::RDS::DBSubnetGroup');
  /** Amazon RDS event subscription */
  public static readonly RDS_EVENT_SUBSCRIPTION = new ResourceType('AWS::RDS::EventSubscription');
  /** Amazon RDS database cluster */
  public static readonly RDS_DB_CLUSTER = new ResourceType('AWS::RDS::DBCluster');
  /** Amazon RDS database cluster snapshot */
  public static readonly RDS_DB_CLUSTER_SNAPSHOT = new ResourceType('AWS::RDS::DBClusterSnapshot');
  /** Amazon RDS global cluster */
  public static readonly RDS_GLOBAL_CLUSTER = new ResourceType('AWS::RDS::GlobalCluster');
  /** Amazon Route53 Hosted Zone */
  public static readonly ROUTE53_HOSTED_ZONE= new ResourceType('AWS::Route53::HostedZone');
  /** Amazon Route53 Health Check */
  public static readonly ROUTE53_HEALTH_CHECK = new ResourceType('AWS::Route53::HealthCheck');
  /** Amazon Route53 resolver resolver endpoint */
  public static readonly ROUTE53_RESOLVER_RESOLVER_ENDPOINT = new ResourceType('AWS::Route53Resolver::ResolverEndpoint');
  /** Amazon Route53 resolver resolver rule */
  public static readonly ROUTE53_RESOLVER_RESOLVER_RULE = new ResourceType('AWS::Route53Resolver::ResolverRule');
  /** Amazon Route53 resolver resolver rule association */
  public static readonly ROUTE53_RESOLVER_RESOLVER_RULE_ASSOCIATION = new ResourceType('AWS::Route53Resolver::ResolverRuleAssociation');
  /** Amazon Route 53 Application Recovery Controller Cell */
  public static readonly ROUTE53_RECOVERY_READINESS_CELL = new ResourceType('AWS::Route53RecoveryReadiness::Cell');
  /** Amazon Route 53 Application Recovery Controller Readiness Check */
  public static readonly ROUTE53_RECOVERY_READINESS_READINESS_CHECK = new ResourceType('AWS::Route53RecoveryReadiness::ReadinessCheck');
  /** Amazon Route53 recovery readiness recovery group */
  public static readonly ROUTE53_RECOVERY_READINESS_RECOVERY_GROUP = new ResourceType('AWS::Route53RecoveryReadiness::RecoveryGroup');
  /** Amazon SQS queue */
  public static readonly SQS_QUEUE = new ResourceType('AWS::SQS::Queue');
  /** Amazon SNS topic */
  public static readonly SNS_TOPIC = new ResourceType('AWS::SNS::Topic');
  /** Amazon S3 bucket */
  public static readonly S3_BUCKET = new ResourceType('AWS::S3::Bucket');
  /** Amazon S3 Multi-Region Access Point */
  public static readonly S3_MULTIREGION_ACCESS_POINT = new ResourceType('AWS::S3::MultiRegionAccessPoint');
  /** Amazon SageMaker code repository */
  public static readonly SAGEMAKER_CODE_REPOSITORY = new ResourceType('AWS::SageMaker::CodeRepository');
  /** Amazon SageMaker model */
  public static readonly SAGEMAKER_MODEL = new ResourceType('AWS::SageMaker::Model');
  /** Amazon SageMaker notebook instance */
  public static readonly SAGEMAKER_NOTEBOOK_INSTANCE = new ResourceType('AWS::SageMaker::NotebookInstance');
  /** Amazon SageMaker workteam */
  public static readonly SAGEMAKER_WORKTEAM = new ResourceType('AWS::SageMaker::Workteam');
  /** Amazon SES Configuration Set */
  public static readonly SES_CONFIGURATION_SET = new ResourceType('AWS::SES::ConfigurationSet');
  /** Amazon SES Contact List */
  public static readonly SES_CONTACT_LIST = new ResourceType('AWS::SES::ContactList');
  /** Amazon SES Template */
  public static readonly SES_TEMPLATE = new ResourceType('AWS::SES::Template');
  /** Amazon SES ReceiptFilter */
  public static readonly SES_RECEIPT_FILTER = new ResourceType('AWS::SES::ReceiptFilter');
  /** Amazon SES ReceiptRuleSet */
  public static readonly SES_RECEIPT_RECEIPT_RULE_SET = new ResourceType('AWS::SES::ReceiptRuleSet');
  /** Amazon S3 account public access block */
  public static readonly S3_ACCOUNT_PUBLIC_ACCESS_BLOCK = new ResourceType('AWS::S3::AccountPublicAccessBlock');
  /** Amazon EC2 customer gateway */
  public static readonly EC2_CUSTOMER_GATEWAY = new ResourceType('AWS::EC2::CustomerGateway');
  /** Amazon EC2 internet gateway */
  public static readonly EC2_INTERNET_GATEWAY = new ResourceType('AWS::EC2::InternetGateway');
  /** Amazon EC2 network ACL */
  public static readonly EC2_NETWORK_ACL = new ResourceType('AWS::EC2::NetworkAcl');
  /** Amazon EC2 route table */
  public static readonly EC2_ROUTE_TABLE = new ResourceType('AWS::EC2::RouteTable');
  /** Amazon EC2 subnet table */
  public static readonly EC2_SUBNET = new ResourceType('AWS::EC2::Subnet');
  /** Amazon EC2 VPC */
  public static readonly EC2_VPC = new ResourceType('AWS::EC2::VPC');
  /** Amazon EC2 VPN connection */
  public static readonly EC2_VPN_CONNECTION = new ResourceType('AWS::EC2::VPNConnection');
  /** Amazon EC2 VPN gateway */
  public static readonly EC2_VPN_GATEWAY = new ResourceType('AWS::EC2::VPNGateway');
  /** AWS Auto Scaling group */
  public static readonly AUTO_SCALING_GROUP = new ResourceType('AWS::AutoScaling::AutoScalingGroup');
  /** AWS Auto Scaling launch configuration */
  public static readonly AUTO_SCALING_LAUNCH_CONFIGURATION = new ResourceType('AWS::AutoScaling::LaunchConfiguration');
  /** AWS Auto Scaling policy */
  public static readonly AUTO_SCALING_POLICY = new ResourceType('AWS::AutoScaling::ScalingPolicy');
  /** AWS Auto Scaling scheduled action */
  public static readonly AUTO_SCALING_SCHEDULED_ACTION = new ResourceType('AWS::AutoScaling::ScheduledAction');
  /** Amazon WorkSpaces connection alias */
  public static readonly WORKSPACES_CONNECTION_ALIAS = new ResourceType('AWS::WorkSpaces::ConnectionAlias');
  /** Amazon WorkSpaces workSpace */
  public static readonly WORKSPACES_WORKSPACE = new ResourceType('AWS::WorkSpaces::Workspace');
  /** AWS AppConfig application */
  public static readonly APPCONFIG_APPLICATION = new ResourceType('AWS::AppConfig::Application');
  /** AWS AppConfig environment */
  public static readonly APPCONFIG_ENVIRONMENT = new ResourceType('AWS::AppConfig::Environment');
  /** AWS AppConfig configuration profile */
  public static readonly APPCONFIG_CONFIGURATION_PROFILE = new ResourceType('AWS::AppConfig::ConfigurationProfile');
  /** AWS AppSync GraphQL Api */
  public static readonly APPSYNC_GRAPHQL_API = new ResourceType('AWS::AppSync::GraphQLApi');
  /** AWS Backup backup plan */
  public static readonly BACKUP_BACKUP_PLAN = new ResourceType('AWS::Backup::BackupPlan');
  /** AWS Backup backup selection */
  public static readonly BACKUP_BACKUP_SELECTION = new ResourceType('AWS::Backup::BackupSelection');
  /** AWS Backup backup vault */
  public static readonly BACKUP_BACKUP_VAULT = new ResourceType('AWS::Backup::BackupVault');
  /** AWS Backup recovery point */
  public static readonly BACKUP_RECOVERY_POINT = new ResourceType('AWS::Backup::RecoveryPoint');
  /** AWS Backup report plan */
  public static readonly BACKUP_REPORT_PLAN = new ResourceType('AWS::Backup::ReportPlan');
  /** AWS Batch job queue */
  public static readonly BATCH_JOB_QUEUE = new ResourceType('AWS::Batch::JobQueue');
  /** AWS Batch compute environment */
  public static readonly BATCH_COMPUTE_ENVIRONMENT = new ResourceType('AWS::Batch::ComputeEnvironment');
  /** AWS Certificate manager certificate */
  public static readonly ACM_CERTIFICATE = new ResourceType('AWS::ACM::Certificate');
  /** AWS CloudFormation stack */
  public static readonly CLOUDFORMATION_STACK = new ResourceType('AWS::CloudFormation::Stack');
  /** AWS CloudTrail trail */
  public static readonly CLOUDTRAIL_TRAIL = new ResourceType('AWS::CloudTrail::Trail');
  /** AWS Cloud9 environment EC2 */
  public static readonly CLOUD9_ENVIRONMENT_EC2 = new ResourceType('AWS::Cloud9::EnvironmentEC2');
  /** AWS Cloud Map(ServiceDiscovery) service */
  public static readonly SERVICEDISCOVERY_SERVICE = new ResourceType('AWS::ServiceDiscovery::Service');
  /** AWS Cloud Map(ServiceDiscovery) Public Dns Namespace */
  public static readonly SERVICEDISCOVERY_PUBLIC_DNS_NAMESPACE = new ResourceType('AWS::ServiceDiscovery::PublicDnsNamespace');
  /** AWS Cloud Map(ServiceDiscovery) Http Namespace */
  public static readonly SERVICEDISCOVERY_HTTP_NAMESPACE = new ResourceType('AWS::ServiceDiscovery::HttpNamespace');
  /** AWS CodeBuild project */
  public static readonly CODEBUILD_PROJECT = new ResourceType('AWS::CodeBuild::Project');
  /** AWS CodeDeploy application */
  public static readonly CODEDEPLOY_APPLICATION = new ResourceType('AWS::CodeDeploy::Application');
  /** AWS CodeDeploy deployment config */
  public static readonly CODEDEPLOY_DEPLOYMENT_CONFIG = new ResourceType('AWS::CodeDeploy::DeploymentConfig');
  /** AWS CodeDeploy deployment group */
  public static readonly CODEDEPLOY_DEPLOYMENT_GROUP = new ResourceType('AWS::CodeDeploy::DeploymentGroup');
  /** AWS CodePipeline pipeline */
  public static readonly CODEPIPELINE_PIPELINE = new ResourceType('AWS::CodePipeline::Pipeline');
  /** AWS Config resource compliance */
  public static readonly CONFIG_RESOURCE_COMPLIANCE = new ResourceType('AWS::Config::ResourceCompliance');
  /** AWS Config conformance pack compliance */
  public static readonly CONFIG_CONFORMANCE_PACK_COMPLIANCE = new ResourceType('AWS::Config::ConformancePackCompliance');
  /** AWS DMS event subscription */
  public static readonly DMS_EVENT_SUBSCRIPTION = new ResourceType('AWS::DMS::EventSubscription');
  /** AWS DMS replication subnet group */
  public static readonly DMS_REPLICATION_SUBNET_GROUP = new ResourceType('AWS::DMS::ReplicationSubnetGroup');
  /** AWS DataSync location SMB */
  public static readonly DATASYNC_LOCATION_SMB = new ResourceType('AWS::DataSync::LocationSMB');
  /** AWS DataSync location FSx Lustre */
  public static readonly DATASYNC_LOCATION_FSX_LUSTRE = new ResourceType('AWS::DataSync::LocationFSxLustre');
  /** AWS DataSync location FSx Windows */
  public static readonly DATASYNC_LOCATION_FSX_WINDOWS = new ResourceType('AWS::DataSync::LocationFSxWindows');
  /** AWS DataSync location S3 */
  public static readonly DATASYNC_LOCATION_S3 = new ResourceType('AWS::DataSync::LocationS3');
  /** AWS DataSync location EFS */
  public static readonly DATASYNC_LOCATION_EFS = new ResourceType('AWS::DataSync::LocationEFS');
  /** AWS DataSync task */
  public static readonly DATASYNC_TASK = new ResourceType('AWS::DataSync::Task');
  /** AWS DataSync location NFS */
  public static readonly DATASYNC_LOCATION_NFS = new ResourceType('AWS::DataSync::LocationNFS');
  /** AWS DataSync location object storage */
  public static readonly DATASYNC_LOCATION_OBJECT_STORAGE = new ResourceType('AWS::DataSync::LocationObjectStorage');
  /** AWS DataSync location HDFS */
  public static readonly DATASYNC_LOCATION_HDFS = new ResourceType('AWS::DataSync::LocationHDFS');
  /** AWS Elastic Beanstalk (EB) application */
  public static readonly ELASTIC_BEANSTALK_APPLICATION = new ResourceType('AWS::ElasticBeanstalk::Application');
  /** AWS Elastic Beanstalk (EB) application version */
  public static readonly ELASTIC_BEANSTALK_APPLICATION_VERSION = new ResourceType('AWS::ElasticBeanstalk::ApplicationVersion');
  /** AWS Elastic Beanstalk (EB) environment */
  public static readonly ELASTIC_BEANSTALK_ENVIRONMENT = new ResourceType('AWS::ElasticBeanstalk::Environment');
  /** AWS Fault Injection Simulator Experiment_Template */
  public static readonly FIS_EXPERIMENT_TEMPLATE = new ResourceType('AWS::FIS::ExperimentTemplate');
  /** AWS GlobalAccelerator listener */
  public static readonly GLOBALACCELERATOR_LISTENER = new ResourceType('AWS::GlobalAccelerator::Listener');
  /** AWS GlobalAccelerator endpoint group */
  public static readonly GLOBALACCELERATOR_ENDPOINT_GROUP = new ResourceType('AWS::GlobalAccelerator::EndpointGroup');
  /** AWS GlobalAccelerator accelerator */
  public static readonly GLOBALACCELERATOR_ACCELERATOR = new ResourceType('AWS::GlobalAccelerator::Accelerator');
  /** AWS Glue Job */
  public static readonly GLUE_JOB = new ResourceType('AWS::Glue::Job');
  /** AWS Glue Classifier */
  public static readonly GLUE_CLASSIFIER = new ResourceType('AWS::Glue::Classifier');
  /** AWS Glue machine learning transform */
  public static readonly GLUE_ML_TRANSFORM = new ResourceType('AWS::Glue::MLTransform');
  /** AWS IAM user */
  public static readonly IAM_USER = new ResourceType('AWS::IAM::User');
  /** AWS IAM group */
  public static readonly IAM_GROUP = new ResourceType('AWS::IAM::Group');
  /** AWS IAM role */
  public static readonly IAM_ROLE = new ResourceType('AWS::IAM::Role');
  /** AWS IAM policy */
  public static readonly IAM_POLICY = new ResourceType('AWS::IAM::Policy');
  /** AWS IAM AccessAnalyzer analyzer */
  public static readonly IAM_ACCESSANALYZER_ANALYZER = new ResourceType('AWS::AccessAnalyzer::Analyzer');
  /** AWS IoT authorizer */
  public static readonly IOT_AUTHORIZER = new ResourceType('AWS::IoT::Authorizer');
  /** AWS IoT security profile */
  public static readonly IOT_SECURITY_PROFILE = new ResourceType('AWS::IoT::SecurityProfile');
  /** AWS IoT role alias */
  public static readonly IOT_ROLE_ALIAS = new ResourceType('AWS::IoT::RoleAlias');
  /** AWS IoT dimension */
  public static readonly IOT_DIMENSION = new ResourceType('AWS::IoT::Dimension');
  /** AWS IoT policy */
  public static readonly IOT_POLICY = new ResourceType('AWS::IoT::Policy');
  /** AWS IoT mitigation action */
  public static readonly IOT_MITIGATION_ACTION = new ResourceType('AWS::IoT::MitigationAction');
  /** AWS IoT TwinMaker workspace */
  public static readonly IOT_TWINMAKER_WORKSPACE = new ResourceType('AWS::IoTwinMaker::Workspace');
  /** AWS IoT TwinMaker entity */
  public static readonly IOT_TWINMAKER_ENTITY = new ResourceType('AWS::IoTTwinMaker::Entity');
  /** AWS IoT Analytics datastore */
  public static readonly IOT_ANALYTICS_DATASTORE = new ResourceType('AWS::IoTAnalytics::Datastore');
  /** AWS IoT Analytics dataset */
  public static readonly IOT_ANALYTICS_DATASET = new ResourceType('AWS::IoTAnalytics::Dataset');
  /** AWS IoT Analytics pipeline */
  public static readonly IOT_ANALYTICS_PIPELINE = new ResourceType('AWS::IoTAnalytics::Pipeline');
  /** AWS IoT Analytics channel */
  public static readonly IOT_ANALYTICS_CHANNEL = new ResourceType('AWS::IoTAnalytics::Channel');
  /** AWS IoT Events Input */
  public static readonly IOT_EVENTS_INPUT = new ResourceType('AWS::IoTEvents::Input');
  /** AWS IoT Events Detector Model */
  public static readonly IOT_EVENTS_DETECTOR_MODEL = new ResourceType('AWS::IoTEvents::DetectorModel');
  /** AWS IoT Events Alarm Model */
  public static readonly IOT_EVENTS_ALARM_MODEL = new ResourceType('AWS::IoTEvents::AlarmModel');
  /** AWS IoT SiteWise dashboard */
  public static readonly IOT_SITEWISE_DASHBOARD = new ResourceType('AWS::IoTSiteWise::Dashboard');
  /** AWS IoT SiteWise project */
  public static readonly IOT_SITEWISE_PROJECT = new ResourceType('AWS::IoTSiteWise::Project');
  /** AWS IoT SiteWise portal */
  public static readonly IOT_SITEWISE_PORTAL = new ResourceType('AWS::IoTSiteWise::Portal');
  /** AWS IoT SiteWise asset model */
  public static readonly IOT_SITEWISE_ASSETMODEL = new ResourceType('AWS::IoTSiteWise::AssetModel');
  /** AWS KMS Key */
  public static readonly KMS_KEY = new ResourceType('AWS::KMS::Key');
  /** AWS Lambda function */
  public static readonly LAMBDA_FUNCTION = new ResourceType('AWS::Lambda::Function');
  /** AWS Network Firewall Firewall */
  public static readonly NETWORK_FIREWALL_FIREWALL = new ResourceType('AWS::NetworkFirewall::Firewall');
  /** AWS Network Firewall Firewall Policy */
  public static readonly NETWORK_FIREWALL_FIREWALL_POLICY = new ResourceType('AWS::NetworkFirewall::FirewallPolicy');
  /** AWS Network Firewall Rule Group */
  public static readonly NETWORK_FIREWALL_RULE_GROUP = new ResourceType('AWS::NetworkFirewall::RuleGroup');
  /** AWS ResilienceHub resiliency policy */
  public static readonly RESILIENCEHUB_RESILIENCY_POLICY = new ResourceType('AWS::ResilienceHub::ResiliencyPolicy');
  /**AWS Secrets Manager secret */
  public static readonly SECRETS_MANAGER_SECRET = new ResourceType('AWS::SecretsManager::Secret');
  /** AWS Service Catalog CloudFormation product */
  public static readonly SERVICE_CATALOG_CLOUDFORMATION_PRODUCT = new ResourceType('AWS::ServiceCatalog::CloudFormationProduct');
  /** AWS Service Catalog CloudFormation provisioned product */
  public static readonly SERVICE_CATALOG_CLOUDFORMATION_PROVISIONED_PRODUCT = new ResourceType(
    'AWS::ServiceCatalog::CloudFormationProvisionedProduct');
  /** AWS Service Catalog portfolio */
  public static readonly SERVICE_CATALOG_PORTFOLIO = new ResourceType('AWS::ServiceCatalog::Portfolio');
  /** AWS Shield protection */
  public static readonly SHIELD_PROTECTION = new ResourceType('AWS::Shield::Protection');
  /** AWS Shield regional protection */
  public static readonly SHIELD_REGIONAL_PROTECTION = new ResourceType('AWS::ShieldRegional::Protection');
  /** AWS StepFunctions activity */
  public static readonly STEPFUNCTIONS_ACTIVITY = new ResourceType('AWS::StepFunctions::Activity');
  /** AWS StepFunctions state machine */
  public static readonly STEPFUNCTIONS_STATE_MACHINE = new ResourceType('AWS::StepFunctions::StateMachine');
  /** AWS Systems Manager managed instance inventory */
  public static readonly SYSTEMS_MANAGER_MANAGED_INSTANCE_INVENTORY = new ResourceType('AWS::SSM::ManagedInstanceInventory');
  /** AWS Systems Manager patch compliance */
  public static readonly SYSTEMS_MANAGER_PATCH_COMPLIANCE = new ResourceType('AWS::SSM::PatchCompliance');
  /** AWS Systems Manager association compliance */
  public static readonly SYSTEMS_MANAGER_ASSOCIATION_COMPLIANCE = new ResourceType('AWS::SSM::AssociationCompliance');
  /** AWS Systems Manager file data */
  public static readonly SYSTEMS_MANAGER_FILE_DATA = new ResourceType('AWS::SSM::FileData');
  /** AWS Transfer workflow */
  public static readonly TRANSFER_WORKFLOW = new ResourceType('AWS::Transfer::Workflow');
  /** AWS WAF rate based rule */
  public static readonly WAF_RATE_BASED_RULE = new ResourceType('AWS::WAF::RateBasedRule');
  /** AWS WAF rule */
  public static readonly WAF_RULE = new ResourceType('AWS::WAF::Rule');
  /** AWS WAF web ACL */
  public static readonly WAF_WEB_ACL = new ResourceType('AWS::WAF::WebACL');
  /** AWS WAF rule group */
  public static readonly WAF_RULE_GROUP = new ResourceType('AWS::WAF::RuleGroup');
  /** AWS WAF regional rate based rule */
  public static readonly WAF_REGIONAL_RATE_BASED_RULE = new ResourceType('AWS::WAFRegional::RateBasedRule');
  /** AWS WAF regional rule */
  public static readonly WAF_REGIONAL_RULE = new ResourceType('AWS::WAFRegional::Rule');
  /** AWS WAF web ACL */
  public static readonly WAF_REGIONAL_WEB_ACL = new ResourceType('AWS::WAFRegional::WebACL');
  /** AWS WAF regional rule group */
  public static readonly WAF_REGIONAL_RULE_GROUP = new ResourceType('AWS::WAFRegional::RuleGroup');
  /** AWS WAFv2 web ACL */
  public static readonly WAFV2_WEB_ACL = new ResourceType('AWS::WAFv2::WebACL');
  /** AWS WAFv2 rule group */
  public static readonly WAFV2_RULE_GROUP = new ResourceType('AWS::WAFv2::RuleGroup');
  /** AWS WAFv2 managed rule set */
  public static readonly WAFV2_MANAGED_RULE_SET = new ResourceType('AWS::WAFv2::ManagedRuleSet');
  /** AWS WAFv2 ip set */
  public static readonly WAFV2_IP_SET = new ResourceType('AWS::WAFv2::IPSet');
  /** AWS WAFv2 regex pattern set */
  public static readonly WAFV2_REGEX_PATTERN_SET = new ResourceType('AWS::WAFv2::RegexPatternSet');
  /** AWS X-Ray encryption configuration */
  public static readonly XRAY_ENCRYPTION_CONFIGURATION = new ResourceType('AWS::XRay::EncryptionConfig');
  /** AWS ELB classic load balancer */
  public static readonly ELB_LOAD_BALANCER = new ResourceType('AWS::ElasticLoadBalancing::LoadBalancer');
  /** AWS ELBv2 network load balancer or AWS ELBv2 application load balancer */
  public static readonly ELBV2_LOAD_BALANCER = new ResourceType('AWS::ElasticLoadBalancingV2::LoadBalancer');
  /** AWS ELBv2 application load balancer listener */
  public static readonly ELBV2_LISTENER = new ResourceType('AWS::ElasticLoadBalancingV2::Listener');
  /** AWS Elemental MediaPackage packaging group */
  public static readonly MEDIAPACKAGE_PACKAGING_GROUP = new ResourceType('AWS::MediaPackage::PackagingGroup');

  /** A custom resource type to support future cases. */
  public static of(type: string): ResourceType {
    return new ResourceType(type);
  }

  /**
   * Valid value of resource type.
   */
  public readonly complianceResourceType: string;

  private constructor(type: string) {
    this.complianceResourceType = type;
  }

}

function renderScope(ruleScope?: RuleScope): CfnConfigRule.ScopeProperty | undefined {
  return ruleScope ? {
    complianceResourceId: ruleScope.resourceId,
    complianceResourceTypes: ruleScope.resourceTypes?.map(resource => resource.complianceResourceType),
    tagKey: ruleScope.key,
    tagValue: ruleScope.value,
  } : undefined;
}
