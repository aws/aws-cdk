import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { IResource, Lazy, Resource } from '@aws-cdk/core';
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
      scope: Lazy.anyValue({ produce: () => renderScope(this.ruleScope) }), // scope can use values such as stack id (see CloudFormationStackDriftDetectionCheck)
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

    const sourceDetails: any[] = [];
    this.ruleScope = props.ruleScope;

    if (props.configurationChanges) {
      sourceDetails.push({
        eventSource: 'aws.config',
        messageType: 'ConfigurationItemChangeNotification',
      });
      sourceDetails.push({
        eventSource: 'aws.config',
        messageType: 'OversizedConfigurationItemChangeNotification',
      });
    }

    if (props.periodic) {
      sourceDetails.push({
        eventSource: 'aws.config',
        maximumExecutionFrequency: props.maximumExecutionFrequency,
        messageType: 'ScheduledNotification',
      });
    }

    props.lambdaFunction.addPermission('Permission', {
      principal: new iam.ServicePrincipal('config.amazonaws.com'),
    });

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
      scope: Lazy.anyValue({ produce: () => renderScope(this.ruleScope) }), // scope can use values such as stack id (see CloudFormationStackDriftDetectionCheck)
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
  /** EC2 security group */
  public static readonly EC2_SECURITY_GROUP = new ResourceType('AWS::EC2::SecurityGroup');
  /** EC2 NAT gateway */
  public static readonly EC2_NAT_GATEWAY = new ResourceType('AWS::EC2::NatGateway');
  /** EC2 Egress only internet gateway */
  public static readonly EC2_EGRESS_ONLY_INTERNET_GATEWAY = new ResourceType('AWS::EC2::EgressOnlyInternetGateway');
  /** EC2 flow log */
  public static readonly EC2_FLOW_LOG = new ResourceType('AWS::EC2::FlowLog');
  /** EC2 VPC endpoint */
  public static readonly EC2_VPC_ENDPOINT = new ResourceType('AWS::EC2::VPCEndpoint');
  /** EC2 VPC endpoint service */
  public static readonly EC2_VPC_ENDPOINT_SERVICE = new ResourceType('AWS::EC2::VPCEndpointService');
  /** EC2 VPC peering connection */
  public static readonly EC2_VPC_PEERING_CONNECTION = new ResourceType('AWS::EC2::VPCPeeringConnection');
  /** Amazon ElasticSearch domain */
  public static readonly ELASTICSEARCH_DOMAIN = new ResourceType('AWS::Elasticsearch::Domain');
  /** Amazon QLDB ledger */
  public static readonly QLDB_LEDGER = new ResourceType('AWS::QLDB::Ledger');
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
  /** Amazon SQS queue */
  public static readonly SQS_QUEUE = new ResourceType('AWS::SQS::Queue');
  /** Amazon SNS topic */
  public static readonly SNS_TOPIC = new ResourceType('AWS::SNS::Topic');
  /** Amazon S3 bucket */
  public static readonly S3_BUCKET = new ResourceType('AWS::S3::Bucket');
  /** Amazon S3 account public access block */
  public static readonly S3_ACCOUNT_PUBLIC_ACCESS_BLOCK = new ResourceType('AWS::S3::AccountPublicAccessBlock');
  /** Amazon EC2 customer gateway */
  public static readonly EC2_CUSTOMER_GATEWAY = new ResourceType('AWS::EC2::CustomerGateway');
  /** Amazon EC2 internet gateway */
  public static readonly EC2_INTERNET_GATEWAY = new ResourceType('AWS::EC2::CustomerGateway');
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
  /** AWS Certificate manager certificate */
  public static readonly ACM_CERTIFICATE = new ResourceType('AWS::ACM::Certificate');
  /** AWS CloudFormation stack */
  public static readonly CLOUDFORMATION_STACK = new ResourceType('AWS::CloudFormation::Stack');
  /** AWS CloudTrail trail */
  public static readonly CLOUDTRAIL_TRAIL = new ResourceType('AWS::CloudTrail::Trail');
  /** AWS CodeBuild project */
  public static readonly CODEBUILD_PROJECT = new ResourceType('AWS::CodeBuild::Project');
  /** AWS CodePipeline pipeline */
  public static readonly CODEPIPELINE_PIPELINE = new ResourceType('AWS::CodePipeline::Pipeline');
  /** AWS Elastic Beanstalk (EB) application */
  public static readonly ELASTIC_BEANSTALK_APPLICATION = new ResourceType('AWS::ElasticBeanstalk::Application');
  /** AWS Elastic Beanstalk (EB) application version */
  public static readonly ELASTIC_BEANSTALK_APPLICATION_VERSION = new ResourceType('AWS::ElasticBeanstalk::ApplicationVersion');
  /** AWS Elastic Beanstalk (EB) environment */
  public static readonly ELASTIC_BEANSTALK_ENVIRONMENT = new ResourceType('AWS::ElasticBeanstalk::Environment');
  /** AWS IAM user */
  public static readonly IAM_USER = new ResourceType('AWS::IAM::User');
  /** AWS IAM group */
  public static readonly IAM_GROUP = new ResourceType('AWS::IAM::Group');
  /** AWS IAM role */
  public static readonly IAM_ROLE = new ResourceType('AWS::IAM::Role');
  /** AWS IAM policy */
  public static readonly IAM_POLICY = new ResourceType('AWS::IAM::Policy');
  /** AWS KMS Key */
  public static readonly KMS_KEY = new ResourceType('AWS::KMS::Key');
  /** AWS Lambda function */
  public static readonly LAMBDA_FUNCTION = new ResourceType('AWS::Lambda::Function');
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
  /** AWS Systems Manager managed instance inventory */
  public static readonly SYSTEMS_MANAGER_MANAGED_INSTANCE_INVENTORY = new ResourceType('AWS::SSM::ManagedInstanceInventory');
  /** AWS Systems Manager patch compliance */
  public static readonly SYSTEMS_MANAGER_PATCH_COMPLIANCE = new ResourceType('AWS::SSM::PatchCompliance');
  /** AWS Systems Manager association compliance */
  public static readonly SYSTEMS_MANAGER_ASSOCIATION_COMPLIANCE = new ResourceType('AWS::SSM::AssociationCompliance');
  /** AWS Systems Manager file data */
  public static readonly SYSTEMS_MANAGER_FILE_DATA = new ResourceType('AWS::SSM::FileData');
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
  /** AWS X-Ray encryption configuration */
  public static readonly XRAY_ENCRYPTION_CONFIGURATION = new ResourceType('AWS::XRay::EncryptionConfig');
  /** AWS ELB classic load balancer */
  public static readonly ELB_LOAD_BALANCER = new ResourceType('AWS::ElasticLoadBalancing::LoadBalancer');
  /** AWS ELBv2 network load balancer or AWS ELBv2 application load balancer */
  public static readonly ELBV2_LOAD_BALANCER = new ResourceType('AWS::ElasticLoadBalancingV2::LoadBalancer');

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
