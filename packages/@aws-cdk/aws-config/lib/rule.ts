import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { IResource, Lazy, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { renderScope } from '../private/util';
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

  protected scope?: Scope;
  protected isManaged?: boolean;
  protected isCustomWithChanges?: boolean;
}

/**
 * Determines which resources trigger an evaluation of an AWS Config rule.
 * @experimental
 */
export class Scope {
  /** restricts scope of changes to a specific resource type or resource identifier */
  public static fromResource(resourceType: ResourceType, resourceId?: string) {
    return new Scope(resourceId, [resourceType]);
  }
  /** restricts scope of changes to specific resource types */
  public static fromResources(resourceTypes: ResourceType[]) {
    return new Scope(undefined, resourceTypes);
  }
  /** restricts scope of changes to a specific tag */
  public static fromTag(key: string, value?: string) {
    return new Scope(undefined, undefined, key, value);
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
  readonly scope?: Scope;
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

    this.scope = props.scope;

    const rule = new CfnConfigRule(this, 'Resource', {
      configRuleName: this.physicalName,
      description: props.description,
      inputParameters: props.inputParameters,
      maximumExecutionFrequency: props.maximumExecutionFrequency,
      scope: Lazy.anyValue({ produce: () => renderScope(this.scope) }),
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
    this.scope = props.scope;

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
      scope: Lazy.anyValue({ produce: () => renderScope(this.scope) }),
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
  /** API Gateway Stage which is contained in ApiGateway Rest Api or associated with WAFRegional WebACL */
  public static readonly APIGATEWAY_STAGE = new ResourceType('AWS::ApiGateway::Stage');

  /** API Gatewayv2 stage contained in ApiGatewayV2 Api */
  public static readonly APIGATEWAYV2_STAGE = new ResourceType('AWS::ApiGatewayV2::Stage');

  /** API Gateway REST Api that contains an ApiGateway Stage */
  public static readonly APIGATEWAY_REST_API = new ResourceType('AWS::ApiGateway::RestApi');

  /** API Gatewayv2 API that contains an ApiGatewayV2 Stage */
  public static readonly APIGATEWAYV2_API = new ResourceType('AWS::ApiGatewayV2::Api');

  /** Amazon CloudFront distribution */
  public static readonly CLOUDFRONT_DISTRIBUTION = new ResourceType('AWS::CloudFront::Distribution');

  /** CloudFront streaming distribution which is associated with an Amazon CloudFront streaming distribution */
  public static readonly CLOUDFRONT_STREAMING_DISTRIBUTION = new ResourceType('AWS::CloudFront::StreamingDistribution');

  /** Amazon CloudWatch Alarm */
  public static readonly CLOUDWATCH_ALARM = new ResourceType('AWS::CloudWatch::Alarm');

  /** Amazon DynamoDB Table */
  public static readonly DYNAMODB_TABLE = new ResourceType('AWS::DynamoDB::Table');

  /** Elastic Block Store (EBS) volume which is attached to an EC2 instance */
  public static readonly EBS_VOLUME = new ResourceType('AWS::EC2::Volume');

  /** EC2 host which contains an EC2 instance */
  public static readonly EC2_HOST = new ResourceType('AWS::EC2::Host');

  /** EC2 Elastic IP attached to an EC2 instance */
  public static readonly EC2_EIP = new ResourceType('AWS::EC2::EIP');

  /**
   * EC2 instance which:
   *  contains an EC2 network interface,
   *  is associated with an EC2 security group,
   *  is attached to an Amazon EBS volume or EC2 Elastic IP EIP),
   *  is contained in an EC2 Dedicated host, route table, subnet, VPC
   */
  public static readonly EC2_INSTANCE = new ResourceType('AWS::EC2::Instance');

  /** EC2 security group which is associated with an EC2 instance or network interface */
  public static readonly EC2_SECURITY_GROUP = new ResourceType('AWS::EC2::SecurityGroup');

  /** EC2 NAT gateway which is contained in a VPC or subnet */
  public static readonly EC2_NAT_GATEWAY = new ResourceType('AWS::EC2::NatGateway');

  /** EC2 Egress only internet gateway which is contained in a VPC */
  public static readonly EC2_EGRESS_ONLY_INTERNET_GATEWAY = new ResourceType('AWS::EC2::EgressOnlyInternetGateway');

  /** EC2 flow log */
  public static readonly EC2_FLOW_LOG = new ResourceType('AWS::EC2::FlowLog');

  /**
   * EC2 VPC endpoint which:
   *  is contained in a VPC, subnet, or route table
   *  is attached to a network interface
   */
  public static readonly EC2_VPC_ENDPOINT = new ResourceType('AWS::EC2::VPCEndpoint');

  /** EC2 VPC endpoint service which is associated with an ELBv2 load balancer */
  public static readonly EC2_VPC_ENDPOINT_SERVICE = new ResourceType('AWS::EC2::VPCEndpointService');

  /** EC2 VPC peering connection which is associated with a VPC */
  public static readonly EC2_VPC_PEERING_CONNECTION = new ResourceType('AWS::EC2::VPCPeeringConnection');

  /** Amazon ElasticSearch domain which is associated to a KMS Key, EC2 security group, EC2 subnet, or VPC */
  public static readonly ELASTICSEARCH_DOMAIN = new ResourceType('AWS::Elasticsearch::Domain');

  /** Amazon QLDB ledger */
  public static readonly QLDB_LEDGER = new ResourceType('AWS::QLDB::Ledger');

  /**
   * Amazon Redshift cluster which is associated with:
   *  cluster parameter group, cluster security group, cluster subnet group, security group, or VPC
   */
  public static readonly REDSHIFT_CLUSTER = new ResourceType('AWS::Redshift::Cluster');

  /** Amazon Redshift cluster parameter group */
  public static readonly REDSHIFT_CLUSTER_PARAMETER_GROUP = new ResourceType('AWS::Redshift::ClusterParameterGroup');

  /** Amazon Redshift cluster security group */
  public static readonly REDSHIFT_CLUSTER_SECURITY_GROUP = new ResourceType('AWS::Redshift::ClusterSecurityGroup');

  /** Amazon Redshift cluster snapshot which is associated with a cluster or a VPC */
  public static readonly REDSHIFT_CLUSTER_SNAPSHOT = new ResourceType('AWS::Redshift::ClusterSnapshot');

  /** Amazon Redshift cluster subnet group which is associated with a subnet or a VPC */
  public static readonly REDSHIFT_CLUSTER_SUBNET_GROUP = new ResourceType('AWS::Redshift::ClusterSubnetGroup');

  /** Amazon Redshift event subscription */
  public static readonly REDSHIFT_EVENT_SUBSCRIPTION = new ResourceType('AWS::Redshift::EventSubscription');

  /**
   * Amazon RDS database instance which is:
   *  associated to an EC2 security group, RDS database security group, or RDS database subnet
   */
  public static readonly RDS_DB_INSTANCE = new ResourceType('AWS::RDS::DBInstance');

  /** Amazon RDS database security group which is associated with an EC2 security group or VPC */
  public static readonly RDS_DB_SECURITY_GROUP = new ResourceType('AWS::RDS::DBSecurityGroup');

  /** Amazon RDS database snapshot which is associated with a VPC */
  public static readonly RDS_DB_SNAPSHOT = new ResourceType('AWS::RDS::DBSnapshot');

  /** Amazon RDS database subnet group which is associated with an EC2 security group or VPC */
  public static readonly RDS_DB_SUBNET_GROUP = new ResourceType('AWS::RDS::DBSubnetGroup');

  /** Amazon RDS event subscription */
  public static readonly RDS_EVENT_SUBSCRIPTION = new ResourceType('AWS::RDS::EventSubscription');
  /**
   * Amazon RDS database cluster which:
   *  contains an RDS database instance
   *  is associated with an RDS DB subnet group or EC2 security group
   */
  public static readonly RDS_DB_CLUSTER = new ResourceType('AWS::RDS::DBCluster');
  /** Amazon RDS database cluster snapshot which is associated with an RDS database cluster or a VPC */
  public static readonly RDS_DB_CLUSTER_SNAPSHOT = new ResourceType('AWS::RDS::DBClusterSnapshot');

  /** Transfer acceleration for data over long distances between your client and a bucket.  */
  public static readonly S3_ATTR_ACCELERATE_CONFIGURATION = new ResourceType('AccelerateConfiguration');
  /** Access control list used to manage access to buckets and objects. */
  public static readonly S3_ATTR_BUCKET_ACL = new ResourceType('BucketAcl');
  /** Policy that defines the permissions to the bucket. */
  public static readonly S3_ATTR_BUCKET_POLICY = new ResourceType('BucketPolicy');
  /** Allow cross-origin requests to the bucket. */
  public static readonly S3_ATTR_CROSS_ORIGIN_CONFIGURATION = new ResourceType('CrossOriginConfiguration');
  /** Rules that define the lifecycle for objects in your bucket. */
  public static readonly S3_ATTR_LIFECYCLE_CONFIGURATION = new ResourceType('LifecycleConfiguration');
  /** Logging used to track requests for access to the bucket. */
  public static readonly S3_ATTR_LOGGING_CONFIGURATION = new ResourceType('LoggingConfiguration');
  /** Event notifications used to send alerts or trigger workflows for specified bucket events. */
  public static readonly S3_ATTR_NOTIFICATION_CONFIGURATION = new ResourceType('NotificationConfiguration');
  /** Automatic, asynchronous copying of objects across buckets in different AWS Regions. */
  public static readonly S3_ATTR_REPLICATION_CONFIGURATION = new ResourceType('ReplicationConfiguration');
  /** Requester pays is enabled.  */
  public static readonly S3_ATTR_BUCKET_REQUEST_PAYMENT_CONFIGURATION = new ResourceType('RequestPaymentConfiguration');
  /** Tags added to the bucket to categorize. You can also use tagging to track billing. */
  public static readonly S3_ATTR_TAGGING_CONFIGURATION = new ResourceType('TaggingConfiguration');
  /** Static website hosting is enabled for the bucket. */
  public static readonly S3_ATTR_WEBSITE_CONFIGURATION = new ResourceType('WebsiteConfiguration');
  /** Versioning is enabled for objects in the bucket. */
  public static readonly S3_ATTR_VERSIONING_CONFIGURATION = new ResourceType('VersioningConfiguration');

  /** Amazon SQS queue */
  public static readonly SQS_QUEUE = new ResourceType('AWS::SQS::Queue');
  /** Amazon SNS topic */
  public static readonly SNS_TOPIC = new ResourceType('AWS::SNS::Topic');
  /** Amazon S3 bucket */
  public static readonly S3_BUCKET = new ResourceType('AWS::S3::Bucket');
  /** Public access is blocked on an S3 bucket */
  public static readonly S3_ACCOUNT_PUBLIC_ACCESS_BLOCK = new ResourceType('AWS::S3::AccountPublicAccessBlock');

  /** Amazon EC2 customer gateway which is attached to a VPN connection */
  public static readonly EC2_CUSTOMER_GATEWAY = new ResourceType('AWS::EC2::CustomerGateway');
  /** Amazon EC2 internet gateway which is attached to a VPC */
  public static readonly EC2_INTERNET_GATEWAY = new ResourceType('AWS::EC2::CustomerGateway');
  /** Amazon EC2 network ACL */
  public static readonly EC2_NETWORK_ACL = new ResourceType('AWS::EC2::NetworkAcl');
  /**
   * Amazon EC2 route table which:
   *  contains an EC2 instance, an EC2 network interface, subnet, or VPN gateway
   *  is attached to a network ACL
   *  is contained in a route table or VPC
   */
  public static readonly EC2_ROUTE_TABLE = new ResourceType('AWS::EC2::RouteTable');
  /**
   * Amazon EC2 subnet table which:
   *  contains an EC2 instance, or EC2 network interface
   *  is attached to a network ACL
   *  is contained in a route table or VPC
   */
  public static readonly EC2_SUBNET = new ResourceType('AWS::EC2::Subnet');
  /**
   * Amazon EC2 VPC which:
   *  contains an EC2 instance, EC2 network interface, network ACL, route table, or subnet
   *  is associated with a security group
   *  is attached to an internet gateway or VPN gateway
   */
  public static readonly EC2_VPC = new ResourceType('AWS::EC2::VPC');
  /** Amazon EC2 VPN connection which is attached to a customer gateway or VPN gateway */
  public static readonly EC2_VPN_CONNECTION = new ResourceType('AWS::EC2::VPNConnection');
  /**
   * Amazon EC2 VPN gateway which:
   *  is attached to a VPC or VPN connection
   *  is contained in a route table
   */
  public static readonly EC2_VPN_GATEWAY = new ResourceType('AWS::EC2::VPNGateway');

  /**
   * AWS Auto Scaling group which
   *  contains an EC2 instance
   *  is associated with a classic load balancer, auto scaling launch configuration, or subnet
   */
  public static readonly AUTO_SCALING_GROUP = new ResourceType('AWS::AutoScaling::AutoScalingGroup');
  /** AWS Auto Scaling launch configuration which is associated with an Amazon EC2 group */
  public static readonly AUTO_SCALING_LAUNCH_CONFIGURATION = new ResourceType('AWS::AutoScaling::LaunchConfiguration');
  /** AWS Auto Scaling which is associated with an auto scaling group or alarm */
  public static readonly AUTO_SCALING_POLICY = new ResourceType('AWS::AutoScaling::ScalingPolicy');
  /** AWS Auto Scaling scheduled action which is associated to an auto scaling group */
  public static readonly AUTO_SCALING_SCHEDULED_ACTION = new ResourceType('AWS::AutoScaling::ScheduledAction');

  /** AWS Certificate manager certificate */
  public static readonly ACM_CERTIFICATE = new ResourceType('AWS::ACM::Certificate');

  /** AWS CloudFormation stack which contains supported supported AWS resource types */
  public static readonly CLOUDFORMATION_STACK = new ResourceType('AWS::CloudFormation::Stack');

  /** AWS CloudTrail trail */
  public static readonly CLOUDTRAIL_TRAIL = new ResourceType('AWS::CloudTrail::Trail');

  /** AWS CodeBuild project which is associated to an S3 bucket and an IAM role */
  public static readonly CODEBUILD_PROJECT = new ResourceType('AWS::CodeBuild::Project');

  /**
   * AWS CodePipeline pipeline which:
   *  is attached to an S3 bucket
   *  is associated to an IAM role, code project, Lambda function, CloudFormation stack, or ElasticBeanstalk application
   */
  public static readonly CODEPIPELINE_PIPELINE = new ResourceType('AWS::CodePipeline::Pipeline');

  /**
   * AWS Elastic Beanstalk (EB) application which:
   *  contains an EB application version or EB environment
   *  is associated with an IAM role
   */
  public static readonly ELASTIC_BEANSTALK_APPLICATION = new ResourceType('AWS::ElasticBeanstalk::Application');
  /**
   * AWS Elastic Beanstalk (EB) application version which:
   *  is contained in an EB application
   *  is associated with an EB environment or S3 bucket
   */
  public static readonly ELASTIC_BEANSTALK_APPLICATION_VERSION = new ResourceType('AWS::ElasticBeanstalk::ApplicationVersion');
  /**
   * AWS Elastic Beanstalk (EB) environment which:
   *  is contained in an EB application
   *  is associated with an EB application version or IAM role
   *  contains a CloudFormation stack
   */
  public static readonly ELASTIC_BEANSTALK_ENVIRONMENT = new ResourceType('AWS::ElasticBeanstalk::Environment');

  /** AWS IAM user which is attached to an IAM group or a customer managed policy */
  public static readonly IAM_USER = new ResourceType('AWS::IAM::User');
  /** AWS IAM group which contains an IAM user or is attached to a customer managed policy */
  public static readonly IAM_GROUP = new ResourceType('AWS::IAM::Group');
  /** AWS IAM role which is attached to a customer managed policy */
  public static readonly IAM_ROLE = new ResourceType('AWS::IAM::Role');
  /** AWS IAM policy which is attached to an IAM user, group, or role */
  public static readonly IAM_POLICY = new ResourceType('AWS::IAM::Policy');

  /** AWS KMS Key */
  public static readonly KMS_KEY = new ResourceType('AWS::KMS::Key');

  /**
   * AWS Lambda function which is:
   *  associated with an IAM role or EC2 security group
   *  contains an EC2 subnet
   */
  public static readonly LAMBDA_FUNCTION = new ResourceType('AWS::Lambda::Function');

  /**AWS Secrets Manager secret which is associated with a Lambda function or a KMS key */
  public static readonly SECRETS_MANAGER_SECRET = new ResourceType('AWS::SecretsManager::Secret');

  /**
   * AWS Service Catalog CloudFormation product which:
   *  is contained in a portfolio
   *  is associated with a CloudFormation provisioned product
   */
  public static readonly SERVICE_CATALOG_CLOUDFORMATION_PRODUCT = new ResourceType('AWS::ServiceCatalog::CloudFormationProduct');
  /** AWS Service Catalog CloudFormation product which is associated with a portfolio, CloudFormation product, or CloudFormation stack */
  public static readonly SERVICE_CATALOG_CLOUDFORMATION_PROVISIONED_PRODUCT = new ResourceType(
    'AWS::ServiceCatalog::CloudFormationProvisionedProduct');
  /** AWS Service Catalog portfolio which contains a CloudFormation product */
  public static readonly SERVICE_CATALOG_PORTFOLIO = new ResourceType('AWS::ServiceCatalog::Portfolio');

  /** AWS Shield protection which is associated with an Amazon CloudFront distribution */
  public static readonly SHIELD_PROTECTION = new ResourceType('AWS::Shield::Protection');
  /** AWS Shield regional protection which is associated with EC2 EIP, ELB load balancer, or ELBv2 load balancer*/
  public static readonly SHIELD_REGIONAL_PROTECTION = new ResourceType('AWS::ShieldRegional::Protection');

  /** AWS Systems Manager managed instance inventory which is associated with an EC2 instance */
  public static readonly SYSTEMS_MANAGER_MANAGED_INSTANCE_INVENTORY = new ResourceType('AWS::SSM::ManagedInstanceInventory');
  /** AWS Systems Manager patch compliance which is associated with managed instance inventory */
  public static readonly SYSTEMS_MANAGER_PATCH_COMPLIANCE = new ResourceType('AWS::SSM::PatchCompliance');
  /** AWS Systems Manager association compliance which is associated with managed instance inventory */
  public static readonly SYSTEMS_MANAGER_ASSOCIATION_COMPLIANCE = new ResourceType('AWS::SSM::AssociationCompliance');
  /** AWS Systems Manager file data which is associated with managed instance inventory */
  public static readonly SYSTEMS_MANAGER_FILE_DATA = new ResourceType('AWS::SSM::FileData');

  /** AWS WAF rate based rule */
  public static readonly WAF_RATE_BASED_RULE = new ResourceType('AWS::WAF::RateBasedRule');
  /** AWS WAF rule */
  public static readonly WAF_RULE = new ResourceType('AWS::WAF::Rule');
  /** AWS WAF web ACL which is associated to a rule, rate based rule, or a rule group */
  public static readonly WAF_WEB_ACL = new ResourceType('AWS::WAF::WebACL');
  /** AWS WAF rule group which is associated to a rule */
  public static readonly WAF_RULE_GROUP = new ResourceType('AWS::WAF::RuleGroup');
  /** AWS WAF regional rate based rule */
  public static readonly WAF_REGIONAL_RATE_BASED_RULE = new ResourceType('AWS::WAFRegional::RateBasedRule');
  /** AWS WAF regional rule */
  public static readonly WAF_REGIONAL_RULE = new ResourceType('AWS::WAFRegional::Rule');
  /** AWS WAF web ACL which is associated with ELBV2 load balancer, WAF regional rule, regional rate based rule, or regional rule group */
  public static readonly WAF_REGIONAL_WEB_ACL = new ResourceType('AWS::WAFRegional::WebACL');
  /** AWS WAF regional rule group which is associated with a regional rule */
  public static readonly WAF_REGIONAL_RULE_GROUP = new ResourceType('AWS::WAFRegional::RuleGroup');

  /**
   * AWS WAFv2 web ACL which is associated to:
   *  an ELBv2 load balancer, an API Gateway stage,
   *  WAFv2 ip set, regex pattern set, rule group, or managed rule set
   */
  public static readonly WAFV2_WEB_ACL = new ResourceType('AWS::WAFv2::WebACL');
  /** AWS WAFv2 rule group which is associated with an ip set or a regex pattern set */
  public static readonly WAFV2_RULE_GROUP = new ResourceType('AWS::WAFv2::RuleGroup');
  /** AWS WAFv2 managed rule set which is associated to a rule group */
  public static readonly WAFV2_MANAGED_RULE_SET = new ResourceType('AWS::WAFv2::ManagedRuleSet');

  /** AWS X-Ray encryption configuration */
  public static readonly XRAY_ENCRYPTION_CONFIGURATION = new ResourceType('AWS::XRay::EncryptionConfig');

  /** AWS ELB classic load balancer which is associated with an EC2 security group or contained in a VPC */
  public static readonly ELB_LOAD_BALANCER = new ResourceType('AWS::ElasticLoadBalancing::LoadBalancer');
  /**
   * AWS ELBv2 network load balancer or AWS ELBv2 application load balancer which is
   *  associated with an EC2 security group
   *  attached to a subnet
   *  contained in a VPC
   */
  public static readonly ELBV2_LOAD_BALANCER = new ResourceType('AWS::ElasticLoadBalancingV2::LoadBalancer');

  /** A custom resource type to support future cases. */
  public static of(type: string): ResourceType {
    return new ResourceType(type);
  }

  /**
   * Valid value of resource type.
   */
  public readonly resourceType: string;

  private constructor(type: string) {
    this.resourceType = type;
  }

}
