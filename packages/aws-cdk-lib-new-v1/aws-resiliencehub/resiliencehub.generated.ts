/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates an AWS Resilience Hub application.
 *
 * An AWS Resilience Hub application is a collection of AWS resources structured to prevent and recover AWS application disruptions. To describe a AWS Resilience Hub application, you provide an application name, resources from one or more AWS CloudFormation stacks, AWS Resource Groups , Terraform state files, AppRegistry applications, and an appropriate resiliency policy. In addition, you can also add resources that are located on Amazon Elastic Kubernetes Service (Amazon EKS) clusters as optional resources. For more information about the number of resources supported per application, see [Service quotas](https://docs.aws.amazon.com/general/latest/gr/resiliencehub.html#limits_resiliencehub) .
 *
 * After you create an AWS Resilience Hub application, you publish it so that you can run a resiliency assessment on it. You can then use recommendations from the assessment to improve resiliency by running another assessment, comparing results, and then iterating the process until you achieve your goals for recovery time objective (RTO) and recovery point objective (RPO).
 *
 * @cloudformationResource AWS::ResilienceHub::App
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html
 */
export class CfnApp extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ResilienceHub::App";

  /**
   * Build a CfnApp from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApp {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAppPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApp(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the applcation.
   *
   * @cloudformationAttribute AppArn
   */
  public readonly attrAppArn: string;

  /**
   * Indicates if compliance drifts (deviations) were detected while running an assessment for your application.
   *
   * @cloudformationAttribute DriftStatus
   */
  public readonly attrDriftStatus: string;

  /**
   * Assessment execution schedule with 'Daily' or 'Disabled' values.
   */
  public appAssessmentSchedule?: string;

  /**
   * A JSON string that provides information about your application structure.
   */
  public appTemplateBody: string;

  /**
   * Optional description for an application.
   */
  public description?: string;

  /**
   * The list of events you would like to subscribe and get notification for.
   */
  public eventSubscriptions?: Array<CfnApp.EventSubscriptionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Name for the application.
   */
  public name: string;

  /**
   * Defines the roles and credentials that AWS Resilience Hub would use while creating the application, importing its resources, and running an assessment.
   */
  public permissionModel?: cdk.IResolvable | CfnApp.PermissionModelProperty;

  /**
   * The Amazon Resource Name (ARN) of the resiliency policy.
   */
  public resiliencyPolicyArn?: string;

  /**
   * An array of `ResourceMapping` objects.
   */
  public resourceMappings: Array<cdk.IResolvable | CfnApp.ResourceMappingProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags assigned to the resource.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAppProps) {
    super(scope, id, {
      "type": CfnApp.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "appTemplateBody", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "resourceMappings", this);

    this.attrAppArn = cdk.Token.asString(this.getAtt("AppArn", cdk.ResolutionTypeHint.STRING));
    this.attrDriftStatus = cdk.Token.asString(this.getAtt("DriftStatus", cdk.ResolutionTypeHint.STRING));
    this.appAssessmentSchedule = props.appAssessmentSchedule;
    this.appTemplateBody = props.appTemplateBody;
    this.description = props.description;
    this.eventSubscriptions = props.eventSubscriptions;
    this.name = props.name;
    this.permissionModel = props.permissionModel;
    this.resiliencyPolicyArn = props.resiliencyPolicyArn;
    this.resourceMappings = props.resourceMappings;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ResilienceHub::App", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "appAssessmentSchedule": this.appAssessmentSchedule,
      "appTemplateBody": this.appTemplateBody,
      "description": this.description,
      "eventSubscriptions": this.eventSubscriptions,
      "name": this.name,
      "permissionModel": this.permissionModel,
      "resiliencyPolicyArn": this.resiliencyPolicyArn,
      "resourceMappings": this.resourceMappings,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApp.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAppPropsToCloudFormation(props);
  }
}

export namespace CfnApp {
  /**
   * Defines the roles and credentials that AWS Resilience Hub would use while creating the application, importing its resources, and running an assessment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-permissionmodel.html
   */
  export interface PermissionModelProperty {
    /**
     * Defines a list of role Amazon Resource Names (ARNs) to be used in other accounts.
     *
     * These ARNs are used for querying purposes while importing resources and assessing your application.
     *
     * > - These ARNs are required only when your resources are in other accounts and you have different role name in these accounts. Else, the invoker role name will be used in the other accounts.
     * > - These roles must have a trust policy with `iam:AssumeRole` permission to the invoker role in the primary account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-permissionmodel.html#cfn-resiliencehub-app-permissionmodel-crossaccountrolearns
     */
    readonly crossAccountRoleArns?: Array<string>;

    /**
     * Existing AWS IAM role name in the primary AWS account that will be assumed by AWS Resilience Hub Service Principle to obtain a read-only access to your application resources while running an assessment.
     *
     * > - You must have `iam:passRole` permission for this role while creating or updating the application.
     * > - Currently, `invokerRoleName` accepts only `[A-Za-z0-9_+=,.@-]` characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-permissionmodel.html#cfn-resiliencehub-app-permissionmodel-invokerrolename
     */
    readonly invokerRoleName?: string;

    /**
     * Defines how AWS Resilience Hub scans your resources.
     *
     * It can scan for the resources by using a pre-existing role in your AWS account, or by using the credentials of the current IAM user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-permissionmodel.html#cfn-resiliencehub-app-permissionmodel-type
     */
    readonly type: string;
  }

  /**
   * Defines a resource mapping.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html
   */
  export interface ResourceMappingProperty {
    /**
     * Name of the Amazon Elastic Kubernetes Service cluster and namespace that this resource is mapped to when the `mappingType` is `EKS` .
     *
     * > This parameter accepts values in "eks-cluster/namespace" format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-ekssourcename
     */
    readonly eksSourceName?: string;

    /**
     * Name of the AWS CloudFormation stack this resource is mapped to when the `mappingType` is `CfnStack` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-logicalstackname
     */
    readonly logicalStackName?: string;

    /**
     * Specifies the type of resource mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-mappingtype
     */
    readonly mappingType: string;

    /**
     * Identifier of the physical resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-physicalresourceid
     */
    readonly physicalResourceId: cdk.IResolvable | CfnApp.PhysicalResourceIdProperty;

    /**
     * Name of the resource that this resource is mapped to when the `mappingType` is `Resource` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-resourcename
     */
    readonly resourceName?: string;

    /**
     * Name of the Terraform source that this resource is mapped to when the `mappingType` is `Terraform` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-terraformsourcename
     */
    readonly terraformSourceName?: string;
  }

  /**
   * Defines a physical resource identifier.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-physicalresourceid.html
   */
  export interface PhysicalResourceIdProperty {
    /**
     * The AWS account that owns the physical resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-physicalresourceid.html#cfn-resiliencehub-app-physicalresourceid-awsaccountid
     */
    readonly awsAccountId?: string;

    /**
     * The AWS Region that the physical resource is located in.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-physicalresourceid.html#cfn-resiliencehub-app-physicalresourceid-awsregion
     */
    readonly awsRegion?: string;

    /**
     * Identifier of the physical resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-physicalresourceid.html#cfn-resiliencehub-app-physicalresourceid-identifier
     */
    readonly identifier: string;

    /**
     * Specifies the type of physical resource identifier.
     *
     * - **Arn** - The resource identifier is an Amazon Resource Name (ARN) and it can identify the following list of resources:
     *
     * - `AWS::ECS::Service`
     * - `AWS::EFS::FileSystem`
     * - `AWS::ElasticLoadBalancingV2::LoadBalancer`
     * - `AWS::Lambda::Function`
     * - `AWS::SNS::Topic`
     * - **Native** - The resource identifier is an AWS Resilience Hub -native identifier and it can identify the following list of resources:
     *
     * - `AWS::ApiGateway::RestApi`
     * - `AWS::ApiGatewayV2::Api`
     * - `AWS::AutoScaling::AutoScalingGroup`
     * - `AWS::DocDB::DBCluster`
     * - `AWS::DocDB::DBGlobalCluster`
     * - `AWS::DocDB::DBInstance`
     * - `AWS::DynamoDB::GlobalTable`
     * - `AWS::DynamoDB::Table`
     * - `AWS::EC2::EC2Fleet`
     * - `AWS::EC2::Instance`
     * - `AWS::EC2::NatGateway`
     * - `AWS::EC2::Volume`
     * - `AWS::ElasticLoadBalancing::LoadBalancer`
     * - `AWS::RDS::DBCluster`
     * - `AWS::RDS::DBInstance`
     * - `AWS::RDS::GlobalCluster`
     * - `AWS::Route53::RecordSet`
     * - `AWS::S3::Bucket`
     * - `AWS::SQS::Queue`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-physicalresourceid.html#cfn-resiliencehub-app-physicalresourceid-type
     */
    readonly type: string;
  }

  /**
   * Indicates an event you would like to subscribe and get notification for.
   *
   * Currently, AWS Resilience Hub supports notifications only for *Drift detected* and *Scheduled assessment failure* events.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-eventsubscription.html
   */
  export interface EventSubscriptionProperty {
    /**
     * The type of event you would like to subscribe and get notification for.
     *
     * Currently, AWS Resilience Hub supports notifications only for *Drift detected* ( `DriftDetected` ) and *Scheduled assessment failure* ( `ScheduledAssessmentFailure` ) events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-eventsubscription.html#cfn-resiliencehub-app-eventsubscription-eventtype
     */
    readonly eventType: string;

    /**
     * Unique name to identify an event subscription.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-eventsubscription.html#cfn-resiliencehub-app-eventsubscription-name
     */
    readonly name: string;

    /**
     * Amazon Resource Name (ARN) of the Amazon Simple Notification Service topic.
     *
     * The format for this ARN is: `arn:partition:sns:region:account:topic-name` . For more information about ARNs, see [Amazon Resource Names (ARNs)](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) in the *AWS General Reference* guide.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-eventsubscription.html#cfn-resiliencehub-app-eventsubscription-snstopicarn
     */
    readonly snsTopicArn?: string;
  }
}

/**
 * Properties for defining a `CfnApp`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html
 */
export interface CfnAppProps {
  /**
   * Assessment execution schedule with 'Daily' or 'Disabled' values.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-appassessmentschedule
   */
  readonly appAssessmentSchedule?: string;

  /**
   * A JSON string that provides information about your application structure.
   *
   * To learn more about the `appTemplateBody` template, see the sample template in [Sample appTemplateBody template](https://docs.aws.amazon.com//resilience-hub/latest/APIReference/API_PutDraftAppVersionTemplate.html#API_PutDraftAppVersionTemplate_Examples) .
   *
   * The `appTemplateBody` JSON string has the following structure:
   *
   * - *`resources`*
   *
   * The list of logical resources that needs to be included in the AWS Resilience Hub application.
   *
   * Type: Array
   *
   * > Don't add the resources that you want to exclude.
   *
   * Each `resources` array item includes the following fields:
   *
   * - *`logicalResourceId`*
   *
   * The logical identifier of the resource.
   *
   * Type: Object
   *
   * Each `logicalResourceId` object includes the following fields:
   *
   * - `identifier`
   *
   * Identifier of the resource.
   *
   * Type: String
   * - `logicalStackName`
   *
   * Name of the AWS CloudFormation stack this resource belongs to.
   *
   * Type: String
   * - `resourceGroupName`
   *
   * Name of the resource group this resource belongs to.
   *
   * Type: String
   * - `terraformSourceName`
   *
   * Name of the Terraform S3 state file this resource belongs to.
   *
   * Type: String
   * - `eksSourceName`
   *
   * Name of the Amazon Elastic Kubernetes Service cluster and namespace this resource belongs to.
   *
   * > This parameter accepts values in "eks-cluster/namespace" format.
   *
   * Type: String
   * - *`type`*
   *
   * The type of resource.
   *
   * Type: string
   * - *`name`*
   *
   * Name of the resource.
   *
   * Type: String
   * - `additionalInfo`
   *
   * Additional configuration parameters for an AWS Resilience Hub application. If you want to implement `additionalInfo` through the AWS Resilience Hub console rather than using an API call, see [Configure the application configuration parameters](https://docs.aws.amazon.com//resilience-hub/latest/userguide/app-config-param.html) .
   *
   * > Currently, this parameter accepts a key-value mapping (in a string format) of only one failover region and one associated account.
   * >
   * > Key: `"failover-regions"`
   * >
   * > Value: `"[{"region":"<REGION>", "accounts":[{"id":"<ACCOUNT_ID>"}]}]"`
   * - *`appComponents`*
   *
   * The list of Application Components (AppComponent) that this resource belongs to. If an AppComponent is not part of the AWS Resilience Hub application, it will be added.
   *
   * Type: Array
   *
   * Each `appComponents` array item includes the following fields:
   *
   * - `name`
   *
   * Name of the AppComponent.
   *
   * Type: String
   * - `type`
   *
   * The type of AppComponent. For more information about the types of AppComponent, see [Grouping resources in an AppComponent](https://docs.aws.amazon.com/resilience-hub/latest/userguide/AppComponent.grouping.html) .
   *
   * Type: String
   * - `resourceNames`
   *
   * The list of included resources that are assigned to the AppComponent.
   *
   * Type: Array of strings
   * - `additionalInfo`
   *
   * Additional configuration parameters for an AWS Resilience Hub application. If you want to implement `additionalInfo` through the AWS Resilience Hub console rather than using an API call, see [Configure the application configuration parameters](https://docs.aws.amazon.com//resilience-hub/latest/userguide/app-config-param.html) .
   *
   * > Currently, this parameter accepts a key-value mapping (in a string format) of only one failover region and one associated account.
   * >
   * > Key: `"failover-regions"`
   * >
   * > Value: `"[{"region":"<REGION>", "accounts":[{"id":"<ACCOUNT_ID>"}]}]"`
   * - *`excludedResources`*
   *
   * The list of logical resource identifiers to be excluded from the application.
   *
   * Type: Array
   *
   * > Don't add the resources that you want to include.
   *
   * Each `excludedResources` array item includes the following fields:
   *
   * - *`logicalResourceIds`*
   *
   * The logical identifier of the resource.
   *
   * Type: Object
   *
   * > You can configure only one of the following fields:
   * >
   * > - `logicalStackName`
   * > - `resourceGroupName`
   * > - `terraformSourceName`
   * > - `eksSourceName`
   *
   * Each `logicalResourceIds` object includes the following fields:
   *
   * - `identifier`
   *
   * The identifier of the resource.
   *
   * Type: String
   * - `logicalStackName`
   *
   * Name of the AWS CloudFormation stack this resource belongs to.
   *
   * Type: String
   * - `resourceGroupName`
   *
   * Name of the resource group this resource belongs to.
   *
   * Type: String
   * - `terraformSourceName`
   *
   * Name of the Terraform S3 state file this resource belongs to.
   *
   * Type: String
   * - `eksSourceName`
   *
   * Name of the Amazon Elastic Kubernetes Service cluster and namespace this resource belongs to.
   *
   * > This parameter accepts values in "eks-cluster/namespace" format.
   *
   * Type: String
   * - *`version`*
   *
   * The AWS Resilience Hub application version.
   * - `additionalInfo`
   *
   * Additional configuration parameters for an AWS Resilience Hub application. If you want to implement `additionalInfo` through the AWS Resilience Hub console rather than using an API call, see [Configure the application configuration parameters](https://docs.aws.amazon.com//resilience-hub/latest/userguide/app-config-param.html) .
   *
   * > Currently, this parameter accepts a key-value mapping (in a string format) of only one failover region and one associated account.
   * >
   * > Key: `"failover-regions"`
   * >
   * > Value: `"[{"region":"<REGION>", "accounts":[{"id":"<ACCOUNT_ID>"}]}]"`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-apptemplatebody
   */
  readonly appTemplateBody: string;

  /**
   * Optional description for an application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-description
   */
  readonly description?: string;

  /**
   * The list of events you would like to subscribe and get notification for.
   *
   * Currently, AWS Resilience Hub supports notifications only for *Drift detected* and *Scheduled assessment failure* events.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-eventsubscriptions
   */
  readonly eventSubscriptions?: Array<CfnApp.EventSubscriptionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Name for the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-name
   */
  readonly name: string;

  /**
   * Defines the roles and credentials that AWS Resilience Hub would use while creating the application, importing its resources, and running an assessment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-permissionmodel
   */
  readonly permissionModel?: cdk.IResolvable | CfnApp.PermissionModelProperty;

  /**
   * The Amazon Resource Name (ARN) of the resiliency policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-resiliencypolicyarn
   */
  readonly resiliencyPolicyArn?: string;

  /**
   * An array of `ResourceMapping` objects.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-resourcemappings
   */
  readonly resourceMappings: Array<cdk.IResolvable | CfnApp.ResourceMappingProperty> | cdk.IResolvable;

  /**
   * Tags assigned to the resource.
   *
   * A tag is a label that you assign to an AWS resource. Each tag consists of a key/value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `PermissionModelProperty`
 *
 * @param properties - the TypeScript properties of a `PermissionModelProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppPermissionModelPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("crossAccountRoleArns", cdk.listValidator(cdk.validateString))(properties.crossAccountRoleArns));
  errors.collect(cdk.propertyValidator("invokerRoleName", cdk.validateString)(properties.invokerRoleName));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"PermissionModelProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppPermissionModelPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppPermissionModelPropertyValidator(properties).assertSuccess();
  return {
    "CrossAccountRoleArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.crossAccountRoleArns),
    "InvokerRoleName": cdk.stringToCloudFormation(properties.invokerRoleName),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAppPermissionModelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApp.PermissionModelProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.PermissionModelProperty>();
  ret.addPropertyResult("crossAccountRoleArns", "CrossAccountRoleArns", (properties.CrossAccountRoleArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CrossAccountRoleArns) : undefined));
  ret.addPropertyResult("invokerRoleName", "InvokerRoleName", (properties.InvokerRoleName != null ? cfn_parse.FromCloudFormation.getString(properties.InvokerRoleName) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PhysicalResourceIdProperty`
 *
 * @param properties - the TypeScript properties of a `PhysicalResourceIdProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppPhysicalResourceIdPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsAccountId", cdk.validateString)(properties.awsAccountId));
  errors.collect(cdk.propertyValidator("awsRegion", cdk.validateString)(properties.awsRegion));
  errors.collect(cdk.propertyValidator("identifier", cdk.requiredValidator)(properties.identifier));
  errors.collect(cdk.propertyValidator("identifier", cdk.validateString)(properties.identifier));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"PhysicalResourceIdProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppPhysicalResourceIdPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppPhysicalResourceIdPropertyValidator(properties).assertSuccess();
  return {
    "AwsAccountId": cdk.stringToCloudFormation(properties.awsAccountId),
    "AwsRegion": cdk.stringToCloudFormation(properties.awsRegion),
    "Identifier": cdk.stringToCloudFormation(properties.identifier),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAppPhysicalResourceIdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApp.PhysicalResourceIdProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.PhysicalResourceIdProperty>();
  ret.addPropertyResult("awsAccountId", "AwsAccountId", (properties.AwsAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AwsAccountId) : undefined));
  ret.addPropertyResult("awsRegion", "AwsRegion", (properties.AwsRegion != null ? cfn_parse.FromCloudFormation.getString(properties.AwsRegion) : undefined));
  ret.addPropertyResult("identifier", "Identifier", (properties.Identifier != null ? cfn_parse.FromCloudFormation.getString(properties.Identifier) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceMappingProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppResourceMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eksSourceName", cdk.validateString)(properties.eksSourceName));
  errors.collect(cdk.propertyValidator("logicalStackName", cdk.validateString)(properties.logicalStackName));
  errors.collect(cdk.propertyValidator("mappingType", cdk.requiredValidator)(properties.mappingType));
  errors.collect(cdk.propertyValidator("mappingType", cdk.validateString)(properties.mappingType));
  errors.collect(cdk.propertyValidator("physicalResourceId", cdk.requiredValidator)(properties.physicalResourceId));
  errors.collect(cdk.propertyValidator("physicalResourceId", CfnAppPhysicalResourceIdPropertyValidator)(properties.physicalResourceId));
  errors.collect(cdk.propertyValidator("resourceName", cdk.validateString)(properties.resourceName));
  errors.collect(cdk.propertyValidator("terraformSourceName", cdk.validateString)(properties.terraformSourceName));
  return errors.wrap("supplied properties not correct for \"ResourceMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppResourceMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppResourceMappingPropertyValidator(properties).assertSuccess();
  return {
    "EksSourceName": cdk.stringToCloudFormation(properties.eksSourceName),
    "LogicalStackName": cdk.stringToCloudFormation(properties.logicalStackName),
    "MappingType": cdk.stringToCloudFormation(properties.mappingType),
    "PhysicalResourceId": convertCfnAppPhysicalResourceIdPropertyToCloudFormation(properties.physicalResourceId),
    "ResourceName": cdk.stringToCloudFormation(properties.resourceName),
    "TerraformSourceName": cdk.stringToCloudFormation(properties.terraformSourceName)
  };
}

// @ts-ignore TS6133
function CfnAppResourceMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApp.ResourceMappingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.ResourceMappingProperty>();
  ret.addPropertyResult("eksSourceName", "EksSourceName", (properties.EksSourceName != null ? cfn_parse.FromCloudFormation.getString(properties.EksSourceName) : undefined));
  ret.addPropertyResult("logicalStackName", "LogicalStackName", (properties.LogicalStackName != null ? cfn_parse.FromCloudFormation.getString(properties.LogicalStackName) : undefined));
  ret.addPropertyResult("mappingType", "MappingType", (properties.MappingType != null ? cfn_parse.FromCloudFormation.getString(properties.MappingType) : undefined));
  ret.addPropertyResult("physicalResourceId", "PhysicalResourceId", (properties.PhysicalResourceId != null ? CfnAppPhysicalResourceIdPropertyFromCloudFormation(properties.PhysicalResourceId) : undefined));
  ret.addPropertyResult("resourceName", "ResourceName", (properties.ResourceName != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceName) : undefined));
  ret.addPropertyResult("terraformSourceName", "TerraformSourceName", (properties.TerraformSourceName != null ? cfn_parse.FromCloudFormation.getString(properties.TerraformSourceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventSubscriptionProperty`
 *
 * @param properties - the TypeScript properties of a `EventSubscriptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppEventSubscriptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventType", cdk.requiredValidator)(properties.eventType));
  errors.collect(cdk.propertyValidator("eventType", cdk.validateString)(properties.eventType));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("snsTopicArn", cdk.validateString)(properties.snsTopicArn));
  return errors.wrap("supplied properties not correct for \"EventSubscriptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppEventSubscriptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppEventSubscriptionPropertyValidator(properties).assertSuccess();
  return {
    "EventType": cdk.stringToCloudFormation(properties.eventType),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SnsTopicArn": cdk.stringToCloudFormation(properties.snsTopicArn)
  };
}

// @ts-ignore TS6133
function CfnAppEventSubscriptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApp.EventSubscriptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.EventSubscriptionProperty>();
  ret.addPropertyResult("eventType", "EventType", (properties.EventType != null ? cfn_parse.FromCloudFormation.getString(properties.EventType) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("snsTopicArn", "SnsTopicArn", (properties.SnsTopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.SnsTopicArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAppProps`
 *
 * @param properties - the TypeScript properties of a `CfnAppProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appAssessmentSchedule", cdk.validateString)(properties.appAssessmentSchedule));
  errors.collect(cdk.propertyValidator("appTemplateBody", cdk.requiredValidator)(properties.appTemplateBody));
  errors.collect(cdk.propertyValidator("appTemplateBody", cdk.validateString)(properties.appTemplateBody));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("eventSubscriptions", cdk.listValidator(CfnAppEventSubscriptionPropertyValidator))(properties.eventSubscriptions));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("permissionModel", CfnAppPermissionModelPropertyValidator)(properties.permissionModel));
  errors.collect(cdk.propertyValidator("resiliencyPolicyArn", cdk.validateString)(properties.resiliencyPolicyArn));
  errors.collect(cdk.propertyValidator("resourceMappings", cdk.requiredValidator)(properties.resourceMappings));
  errors.collect(cdk.propertyValidator("resourceMappings", cdk.listValidator(CfnAppResourceMappingPropertyValidator))(properties.resourceMappings));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAppProps\"");
}

// @ts-ignore TS6133
function convertCfnAppPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppPropsValidator(properties).assertSuccess();
  return {
    "AppAssessmentSchedule": cdk.stringToCloudFormation(properties.appAssessmentSchedule),
    "AppTemplateBody": cdk.stringToCloudFormation(properties.appTemplateBody),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EventSubscriptions": cdk.listMapper(convertCfnAppEventSubscriptionPropertyToCloudFormation)(properties.eventSubscriptions),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PermissionModel": convertCfnAppPermissionModelPropertyToCloudFormation(properties.permissionModel),
    "ResiliencyPolicyArn": cdk.stringToCloudFormation(properties.resiliencyPolicyArn),
    "ResourceMappings": cdk.listMapper(convertCfnAppResourceMappingPropertyToCloudFormation)(properties.resourceMappings),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAppPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppProps>();
  ret.addPropertyResult("appAssessmentSchedule", "AppAssessmentSchedule", (properties.AppAssessmentSchedule != null ? cfn_parse.FromCloudFormation.getString(properties.AppAssessmentSchedule) : undefined));
  ret.addPropertyResult("appTemplateBody", "AppTemplateBody", (properties.AppTemplateBody != null ? cfn_parse.FromCloudFormation.getString(properties.AppTemplateBody) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("eventSubscriptions", "EventSubscriptions", (properties.EventSubscriptions != null ? cfn_parse.FromCloudFormation.getArray(CfnAppEventSubscriptionPropertyFromCloudFormation)(properties.EventSubscriptions) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("permissionModel", "PermissionModel", (properties.PermissionModel != null ? CfnAppPermissionModelPropertyFromCloudFormation(properties.PermissionModel) : undefined));
  ret.addPropertyResult("resiliencyPolicyArn", "ResiliencyPolicyArn", (properties.ResiliencyPolicyArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResiliencyPolicyArn) : undefined));
  ret.addPropertyResult("resourceMappings", "ResourceMappings", (properties.ResourceMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnAppResourceMappingPropertyFromCloudFormation)(properties.ResourceMappings) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Defines a resiliency policy.
 *
 * > AWS Resilience Hub allows you to provide a value of zero for `rtoInSecs` and `rpoInSecs` of your resiliency policy. But, while assessing your application, the lowest possible assessment result is near zero. Hence, if you provide value zero for `rtoInSecs` and `rpoInSecs` , the estimated workload RTO and estimated workload RPO result will be near zero and the *Compliance status* for your application will be set to *Policy breached* .
 *
 * @cloudformationResource AWS::ResilienceHub::ResiliencyPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html
 */
export class CfnResiliencyPolicy extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ResilienceHub::ResiliencyPolicy";

  /**
   * Build a CfnResiliencyPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResiliencyPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResiliencyPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResiliencyPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Amazon Resource Name (ARN) of the resiliency policy.
   *
   * @cloudformationAttribute PolicyArn
   */
  public readonly attrPolicyArn: string;

  /**
   * Specifies a high-level geographical location constraint for where your resilience policy data can be stored.
   */
  public dataLocationConstraint?: string;

  /**
   * The resiliency policy.
   */
  public policy: cdk.IResolvable | Record<string, CfnResiliencyPolicy.FailurePolicyProperty | cdk.IResolvable>;

  /**
   * The description for the policy.
   */
  public policyDescription?: string;

  /**
   * The name of the policy.
   */
  public policyName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags assigned to the resource.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The tier for this resiliency policy, ranging from the highest severity ( `MissionCritical` ) to lowest ( `NonCritical` ).
   */
  public tier: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResiliencyPolicyProps) {
    super(scope, id, {
      "type": CfnResiliencyPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policy", this);
    cdk.requireProperty(props, "policyName", this);
    cdk.requireProperty(props, "tier", this);

    this.attrPolicyArn = cdk.Token.asString(this.getAtt("PolicyArn", cdk.ResolutionTypeHint.STRING));
    this.dataLocationConstraint = props.dataLocationConstraint;
    this.policy = props.policy;
    this.policyDescription = props.policyDescription;
    this.policyName = props.policyName;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ResilienceHub::ResiliencyPolicy", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.tier = props.tier;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dataLocationConstraint": this.dataLocationConstraint,
      "policy": this.policy,
      "policyDescription": this.policyDescription,
      "policyName": this.policyName,
      "tags": this.tags.renderTags(),
      "tier": this.tier
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResiliencyPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResiliencyPolicyPropsToCloudFormation(props);
  }
}

export namespace CfnResiliencyPolicy {
  /**
   * Defines a failure policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-resiliencypolicy-failurepolicy.html
   */
  export interface FailurePolicyProperty {
    /**
     * Recovery Point Objective (RPO) in seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-resiliencypolicy-failurepolicy.html#cfn-resiliencehub-resiliencypolicy-failurepolicy-rpoinsecs
     */
    readonly rpoInSecs: number;

    /**
     * Recovery Time Objective (RTO) in seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-resiliencypolicy-failurepolicy.html#cfn-resiliencehub-resiliencypolicy-failurepolicy-rtoinsecs
     */
    readonly rtoInSecs: number;
  }
}

/**
 * Properties for defining a `CfnResiliencyPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html
 */
export interface CfnResiliencyPolicyProps {
  /**
   * Specifies a high-level geographical location constraint for where your resilience policy data can be stored.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-datalocationconstraint
   */
  readonly dataLocationConstraint?: string;

  /**
   * The resiliency policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-policy
   */
  readonly policy: cdk.IResolvable | Record<string, CfnResiliencyPolicy.FailurePolicyProperty | cdk.IResolvable>;

  /**
   * The description for the policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-policydescription
   */
  readonly policyDescription?: string;

  /**
   * The name of the policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-policyname
   */
  readonly policyName: string;

  /**
   * Tags assigned to the resource.
   *
   * A tag is a label that you assign to an AWS resource. Each tag consists of a key/value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The tier for this resiliency policy, ranging from the highest severity ( `MissionCritical` ) to lowest ( `NonCritical` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-tier
   */
  readonly tier: string;
}

/**
 * Determine whether the given properties match those of a `FailurePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `FailurePolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResiliencyPolicyFailurePolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("rpoInSecs", cdk.requiredValidator)(properties.rpoInSecs));
  errors.collect(cdk.propertyValidator("rpoInSecs", cdk.validateNumber)(properties.rpoInSecs));
  errors.collect(cdk.propertyValidator("rtoInSecs", cdk.requiredValidator)(properties.rtoInSecs));
  errors.collect(cdk.propertyValidator("rtoInSecs", cdk.validateNumber)(properties.rtoInSecs));
  return errors.wrap("supplied properties not correct for \"FailurePolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnResiliencyPolicyFailurePolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResiliencyPolicyFailurePolicyPropertyValidator(properties).assertSuccess();
  return {
    "RpoInSecs": cdk.numberToCloudFormation(properties.rpoInSecs),
    "RtoInSecs": cdk.numberToCloudFormation(properties.rtoInSecs)
  };
}

// @ts-ignore TS6133
function CfnResiliencyPolicyFailurePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResiliencyPolicy.FailurePolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResiliencyPolicy.FailurePolicyProperty>();
  ret.addPropertyResult("rpoInSecs", "RpoInSecs", (properties.RpoInSecs != null ? cfn_parse.FromCloudFormation.getNumber(properties.RpoInSecs) : undefined));
  ret.addPropertyResult("rtoInSecs", "RtoInSecs", (properties.RtoInSecs != null ? cfn_parse.FromCloudFormation.getNumber(properties.RtoInSecs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnResiliencyPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnResiliencyPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResiliencyPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataLocationConstraint", cdk.validateString)(properties.dataLocationConstraint));
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", cdk.hashValidator(CfnResiliencyPolicyFailurePolicyPropertyValidator))(properties.policy));
  errors.collect(cdk.propertyValidator("policyDescription", cdk.validateString)(properties.policyDescription));
  errors.collect(cdk.propertyValidator("policyName", cdk.requiredValidator)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("tier", cdk.requiredValidator)(properties.tier));
  errors.collect(cdk.propertyValidator("tier", cdk.validateString)(properties.tier));
  return errors.wrap("supplied properties not correct for \"CfnResiliencyPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnResiliencyPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResiliencyPolicyPropsValidator(properties).assertSuccess();
  return {
    "DataLocationConstraint": cdk.stringToCloudFormation(properties.dataLocationConstraint),
    "Policy": cdk.hashMapper(convertCfnResiliencyPolicyFailurePolicyPropertyToCloudFormation)(properties.policy),
    "PolicyDescription": cdk.stringToCloudFormation(properties.policyDescription),
    "PolicyName": cdk.stringToCloudFormation(properties.policyName),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Tier": cdk.stringToCloudFormation(properties.tier)
  };
}

// @ts-ignore TS6133
function CfnResiliencyPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResiliencyPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResiliencyPolicyProps>();
  ret.addPropertyResult("dataLocationConstraint", "DataLocationConstraint", (properties.DataLocationConstraint != null ? cfn_parse.FromCloudFormation.getString(properties.DataLocationConstraint) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getMap(CfnResiliencyPolicyFailurePolicyPropertyFromCloudFormation)(properties.Policy) : undefined));
  ret.addPropertyResult("policyDescription", "PolicyDescription", (properties.PolicyDescription != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyDescription) : undefined));
  ret.addPropertyResult("policyName", "PolicyName", (properties.PolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("tier", "Tier", (properties.Tier != null ? cfn_parse.FromCloudFormation.getString(properties.Tier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}