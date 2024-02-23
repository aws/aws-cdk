/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::ApplicationAutoScaling::ScalableTarget` resource specifies a resource that Application Auto Scaling can scale, such as an AWS::DynamoDB::Table or AWS::ECS::Service resource.
 *
 * For more information, see [Getting started](https://docs.aws.amazon.com/autoscaling/application/userguide/getting-started.html) in the *Application Auto Scaling User Guide* .
 *
 * > If the resource that you want Application Auto Scaling to scale is not yet created in your account, add a dependency on the resource when registering it as a scalable target using the [DependsOn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) attribute.
 *
 * @cloudformationResource AWS::ApplicationAutoScaling::ScalableTarget
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html
 */
export class CfnScalableTarget extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApplicationAutoScaling::ScalableTarget";

  /**
   * Build a CfnScalableTarget from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScalableTarget {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnScalableTargetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnScalableTarget(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * This value can be returned by using the Ref function. Ref returns the Cloudformation generated ID of the resource in format - ResourceId|ScalableDimension|ServiceNamespace
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The maximum value that you plan to scale out to.
   */
  public maxCapacity: number;

  /**
   * The minimum value that you plan to scale in to.
   */
  public minCapacity: number;

  /**
   * The identifier of the resource associated with the scalable target.
   */
  public resourceId: string;

  /**
   * Specify the Amazon Resource Name (ARN) of an Identity and Access Management (IAM) role that allows Application Auto Scaling to modify the scalable target on your behalf.
   */
  public roleArn?: string;

  /**
   * The scalable dimension associated with the scalable target.
   */
  public scalableDimension: string;

  /**
   * The scheduled actions for the scalable target.
   */
  public scheduledActions?: Array<cdk.IResolvable | CfnScalableTarget.ScheduledActionProperty> | cdk.IResolvable;

  /**
   * The namespace of the AWS service that provides the resource, or a `custom-resource` .
   */
  public serviceNamespace: string;

  /**
   * An embedded object that contains attributes and attribute values that are used to suspend and resume automatic scaling.
   */
  public suspendedState?: cdk.IResolvable | CfnScalableTarget.SuspendedStateProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnScalableTargetProps) {
    super(scope, id, {
      "type": CfnScalableTarget.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "maxCapacity", this);
    cdk.requireProperty(props, "minCapacity", this);
    cdk.requireProperty(props, "resourceId", this);
    cdk.requireProperty(props, "scalableDimension", this);
    cdk.requireProperty(props, "serviceNamespace", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.maxCapacity = props.maxCapacity;
    this.minCapacity = props.minCapacity;
    this.resourceId = props.resourceId;
    this.roleArn = props.roleArn;
    this.scalableDimension = props.scalableDimension;
    this.scheduledActions = props.scheduledActions;
    this.serviceNamespace = props.serviceNamespace;
    this.suspendedState = props.suspendedState;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "maxCapacity": this.maxCapacity,
      "minCapacity": this.minCapacity,
      "resourceId": this.resourceId,
      "roleArn": this.roleArn,
      "scalableDimension": this.scalableDimension,
      "scheduledActions": this.scheduledActions,
      "serviceNamespace": this.serviceNamespace,
      "suspendedState": this.suspendedState
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnScalableTarget.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnScalableTargetPropsToCloudFormation(props);
  }
}

export namespace CfnScalableTarget {
  /**
   * `ScheduledAction` is a property of the [AWS::ApplicationAutoScaling::ScalableTarget](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html) resource that specifies a scheduled action for a scalable target.
   *
   * For more information, see [Scheduled scaling](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-scheduled-scaling.html) in the *Application Auto Scaling User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html
   */
  export interface ScheduledActionProperty {
    /**
     * The date and time that the action is scheduled to end, in UTC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-endtime
     */
    readonly endTime?: Date | cdk.IResolvable;

    /**
     * The new minimum and maximum capacity.
     *
     * You can set both values or just one. At the scheduled time, if the current capacity is below the minimum capacity, Application Auto Scaling scales out to the minimum capacity. If the current capacity is above the maximum capacity, Application Auto Scaling scales in to the maximum capacity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-scalabletargetaction
     */
    readonly scalableTargetAction?: cdk.IResolvable | CfnScalableTarget.ScalableTargetActionProperty;

    /**
     * The schedule for this action. The following formats are supported:.
     *
     * - At expressions - " `at( *yyyy* - *mm* - *dd* T *hh* : *mm* : *ss* )` "
     * - Rate expressions - " `rate( *value* *unit* )` "
     * - Cron expressions - " `cron( *fields* )` "
     *
     * At expressions are useful for one-time schedules. Cron expressions are useful for scheduled actions that run periodically at a specified date and time, and rate expressions are useful for scheduled actions that run at a regular interval.
     *
     * At and cron expressions use Universal Coordinated Time (UTC) by default.
     *
     * The cron format consists of six fields separated by white spaces: [Minutes] [Hours] [Day_of_Month] [Month] [Day_of_Week] [Year].
     *
     * For rate expressions, *value* is a positive integer and *unit* is `minute` | `minutes` | `hour` | `hours` | `day` | `days` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-schedule
     */
    readonly schedule: string;

    /**
     * The name of the scheduled action.
     *
     * This name must be unique among all other scheduled actions on the specified scalable target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-scheduledactionname
     */
    readonly scheduledActionName: string;

    /**
     * The date and time that the action is scheduled to begin, in UTC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-starttime
     */
    readonly startTime?: Date | cdk.IResolvable;

    /**
     * The time zone used when referring to the date and time of a scheduled action, when the scheduled action uses an at or cron expression.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html#cfn-applicationautoscaling-scalabletarget-scheduledaction-timezone
     */
    readonly timezone?: string;
  }

  /**
   * `ScalableTargetAction` specifies the minimum and maximum capacity for the `ScalableTargetAction` property of the [AWS::ApplicationAutoScaling::ScalableTarget ScheduledAction](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scalabletargetaction.html
   */
  export interface ScalableTargetActionProperty {
    /**
     * The maximum capacity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scalabletargetaction.html#cfn-applicationautoscaling-scalabletarget-scalabletargetaction-maxcapacity
     */
    readonly maxCapacity?: number;

    /**
     * The minimum capacity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scalabletargetaction.html#cfn-applicationautoscaling-scalabletarget-scalabletargetaction-mincapacity
     */
    readonly minCapacity?: number;
  }

  /**
   * `SuspendedState` is a property of the [AWS::ApplicationAutoScaling::ScalableTarget](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html) resource that specifies whether the scaling activities for a scalable target are in a suspended state.
   *
   * For more information, see [Suspending and resuming scaling](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-suspend-resume-scaling.html) in the *Application Auto Scaling User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-suspendedstate.html
   */
  export interface SuspendedStateProperty {
    /**
     * Whether scale in by a target tracking scaling policy or a step scaling policy is suspended.
     *
     * Set the value to `true` if you don't want Application Auto Scaling to remove capacity when a scaling policy is triggered. The default is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-suspendedstate.html#cfn-applicationautoscaling-scalabletarget-suspendedstate-dynamicscalinginsuspended
     */
    readonly dynamicScalingInSuspended?: boolean | cdk.IResolvable;

    /**
     * Whether scale out by a target tracking scaling policy or a step scaling policy is suspended.
     *
     * Set the value to `true` if you don't want Application Auto Scaling to add capacity when a scaling policy is triggered. The default is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-suspendedstate.html#cfn-applicationautoscaling-scalabletarget-suspendedstate-dynamicscalingoutsuspended
     */
    readonly dynamicScalingOutSuspended?: boolean | cdk.IResolvable;

    /**
     * Whether scheduled scaling is suspended.
     *
     * Set the value to `true` if you don't want Application Auto Scaling to add or remove capacity by initiating scheduled actions. The default is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-suspendedstate.html#cfn-applicationautoscaling-scalabletarget-suspendedstate-scheduledscalingsuspended
     */
    readonly scheduledScalingSuspended?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnScalableTarget`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html
 */
export interface CfnScalableTargetProps {
  /**
   * The maximum value that you plan to scale out to.
   *
   * When a scaling policy is in effect, Application Auto Scaling can scale out (expand) as needed to the maximum capacity limit in response to changing demand.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-maxcapacity
   */
  readonly maxCapacity: number;

  /**
   * The minimum value that you plan to scale in to.
   *
   * When a scaling policy is in effect, Application Auto Scaling can scale in (contract) as needed to the minimum capacity limit in response to changing demand.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-mincapacity
   */
  readonly minCapacity: number;

  /**
   * The identifier of the resource associated with the scalable target.
   *
   * This string consists of the resource type and unique identifier.
   *
   * - ECS service - The resource type is `service` and the unique identifier is the cluster name and service name. Example: `service/default/sample-webapp` .
   * - Spot Fleet - The resource type is `spot-fleet-request` and the unique identifier is the Spot Fleet request ID. Example: `spot-fleet-request/sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE` .
   * - EMR cluster - The resource type is `instancegroup` and the unique identifier is the cluster ID and instance group ID. Example: `instancegroup/j-2EEZNYKUA1NTV/ig-1791Y4E1L8YI0` .
   * - AppStream 2.0 fleet - The resource type is `fleet` and the unique identifier is the fleet name. Example: `fleet/sample-fleet` .
   * - DynamoDB table - The resource type is `table` and the unique identifier is the table name. Example: `table/my-table` .
   * - DynamoDB global secondary index - The resource type is `index` and the unique identifier is the index name. Example: `table/my-table/index/my-table-index` .
   * - Aurora DB cluster - The resource type is `cluster` and the unique identifier is the cluster name. Example: `cluster:my-db-cluster` .
   * - SageMaker endpoint variant - The resource type is `variant` and the unique identifier is the resource ID. Example: `endpoint/my-end-point/variant/KMeansClustering` .
   * - Custom resources are not supported with a resource type. This parameter must specify the `OutputValue` from the CloudFormation template stack used to access the resources. The unique identifier is defined by the service provider. More information is available in our [GitHub repository](https://docs.aws.amazon.com/https://github.com/aws/aws-auto-scaling-custom-resource) .
   * - Amazon Comprehend document classification endpoint - The resource type and unique identifier are specified using the endpoint ARN. Example: `arn:aws:comprehend:us-west-2:123456789012:document-classifier-endpoint/EXAMPLE` .
   * - Amazon Comprehend entity recognizer endpoint - The resource type and unique identifier are specified using the endpoint ARN. Example: `arn:aws:comprehend:us-west-2:123456789012:entity-recognizer-endpoint/EXAMPLE` .
   * - Lambda provisioned concurrency - The resource type is `function` and the unique identifier is the function name with a function version or alias name suffix that is not `$LATEST` . Example: `function:my-function:prod` or `function:my-function:1` .
   * - Amazon Keyspaces table - The resource type is `table` and the unique identifier is the table name. Example: `keyspace/mykeyspace/table/mytable` .
   * - Amazon MSK cluster - The resource type and unique identifier are specified using the cluster ARN. Example: `arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5` .
   * - Amazon ElastiCache replication group - The resource type is `replication-group` and the unique identifier is the replication group name. Example: `replication-group/mycluster` .
   * - Neptune cluster - The resource type is `cluster` and the unique identifier is the cluster name. Example: `cluster:mycluster` .
   * - SageMaker serverless endpoint - The resource type is `variant` and the unique identifier is the resource ID. Example: `endpoint/my-end-point/variant/KMeansClustering` .
   * - SageMaker inference component - The resource type is `inference-component` and the unique identifier is the resource ID. Example: `inference-component/my-inference-component` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-resourceid
   */
  readonly resourceId: string;

  /**
   * Specify the Amazon Resource Name (ARN) of an Identity and Access Management (IAM) role that allows Application Auto Scaling to modify the scalable target on your behalf.
   *
   * This can be either an IAM service role that Application Auto Scaling can assume to make calls to other AWS resources on your behalf, or a service-linked role for the specified service. For more information, see [How Application Auto Scaling works with IAM](https://docs.aws.amazon.com/autoscaling/application/userguide/security_iam_service-with-iam.html) in the *Application Auto Scaling User Guide* .
   *
   * To automatically create a service-linked role (recommended), specify the full ARN of the service-linked role in your stack template. To find the exact ARN of the service-linked role for your AWS or custom resource, see the [Service-linked roles](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-service-linked-roles.html) topic in the *Application Auto Scaling User Guide* . Look for the ARN in the table at the bottom of the page.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-rolearn
   */
  readonly roleArn?: string;

  /**
   * The scalable dimension associated with the scalable target.
   *
   * This string consists of the service namespace, resource type, and scaling property.
   *
   * - `ecs:service:DesiredCount` - The desired task count of an ECS service.
   * - `elasticmapreduce:instancegroup:InstanceCount` - The instance count of an EMR Instance Group.
   * - `ec2:spot-fleet-request:TargetCapacity` - The target capacity of a Spot Fleet.
   * - `appstream:fleet:DesiredCapacity` - The desired capacity of an AppStream 2.0 fleet.
   * - `dynamodb:table:ReadCapacityUnits` - The provisioned read capacity for a DynamoDB table.
   * - `dynamodb:table:WriteCapacityUnits` - The provisioned write capacity for a DynamoDB table.
   * - `dynamodb:index:ReadCapacityUnits` - The provisioned read capacity for a DynamoDB global secondary index.
   * - `dynamodb:index:WriteCapacityUnits` - The provisioned write capacity for a DynamoDB global secondary index.
   * - `rds:cluster:ReadReplicaCount` - The count of Aurora Replicas in an Aurora DB cluster. Available for Aurora MySQL-compatible edition and Aurora PostgreSQL-compatible edition.
   * - `sagemaker:variant:DesiredInstanceCount` - The number of EC2 instances for a SageMaker model endpoint variant.
   * - `custom-resource:ResourceType:Property` - The scalable dimension for a custom resource provided by your own application or service.
   * - `comprehend:document-classifier-endpoint:DesiredInferenceUnits` - The number of inference units for an Amazon Comprehend document classification endpoint.
   * - `comprehend:entity-recognizer-endpoint:DesiredInferenceUnits` - The number of inference units for an Amazon Comprehend entity recognizer endpoint.
   * - `lambda:function:ProvisionedConcurrency` - The provisioned concurrency for a Lambda function.
   * - `cassandra:table:ReadCapacityUnits` - The provisioned read capacity for an Amazon Keyspaces table.
   * - `cassandra:table:WriteCapacityUnits` - The provisioned write capacity for an Amazon Keyspaces table.
   * - `kafka:broker-storage:VolumeSize` - The provisioned volume size (in GiB) for brokers in an Amazon MSK cluster.
   * - `elasticache:replication-group:NodeGroups` - The number of node groups for an Amazon ElastiCache replication group.
   * - `elasticache:replication-group:Replicas` - The number of replicas per node group for an Amazon ElastiCache replication group.
   * - `neptune:cluster:ReadReplicaCount` - The count of read replicas in an Amazon Neptune DB cluster.
   * - `sagemaker:variant:DesiredProvisionedConcurrency` - The provisioned concurrency for a SageMaker serverless endpoint.
   * - `sagemaker:inference-component:DesiredCopyCount` - The number of copies across an endpoint for a SageMaker inference component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-scalabledimension
   */
  readonly scalableDimension: string;

  /**
   * The scheduled actions for the scalable target.
   *
   * Duplicates aren't allowed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-scheduledactions
   */
  readonly scheduledActions?: Array<cdk.IResolvable | CfnScalableTarget.ScheduledActionProperty> | cdk.IResolvable;

  /**
   * The namespace of the AWS service that provides the resource, or a `custom-resource` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-servicenamespace
   */
  readonly serviceNamespace: string;

  /**
   * An embedded object that contains attributes and attribute values that are used to suspend and resume automatic scaling.
   *
   * Setting the value of an attribute to `true` suspends the specified scaling activities. Setting it to `false` (default) resumes the specified scaling activities.
   *
   * *Suspension Outcomes*
   *
   * - For `DynamicScalingInSuspended` , while a suspension is in effect, all scale-in activities that are triggered by a scaling policy are suspended.
   * - For `DynamicScalingOutSuspended` , while a suspension is in effect, all scale-out activities that are triggered by a scaling policy are suspended.
   * - For `ScheduledScalingSuspended` , while a suspension is in effect, all scaling activities that involve scheduled actions are suspended.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html#cfn-applicationautoscaling-scalabletarget-suspendedstate
   */
  readonly suspendedState?: cdk.IResolvable | CfnScalableTarget.SuspendedStateProperty;
}

/**
 * Determine whether the given properties match those of a `ScalableTargetActionProperty`
 *
 * @param properties - the TypeScript properties of a `ScalableTargetActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalableTargetScalableTargetActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxCapacity", cdk.validateNumber)(properties.maxCapacity));
  errors.collect(cdk.propertyValidator("minCapacity", cdk.validateNumber)(properties.minCapacity));
  return errors.wrap("supplied properties not correct for \"ScalableTargetActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalableTargetScalableTargetActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalableTargetScalableTargetActionPropertyValidator(properties).assertSuccess();
  return {
    "MaxCapacity": cdk.numberToCloudFormation(properties.maxCapacity),
    "MinCapacity": cdk.numberToCloudFormation(properties.minCapacity)
  };
}

// @ts-ignore TS6133
function CfnScalableTargetScalableTargetActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalableTarget.ScalableTargetActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalableTarget.ScalableTargetActionProperty>();
  ret.addPropertyResult("maxCapacity", "MaxCapacity", (properties.MaxCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacity) : undefined));
  ret.addPropertyResult("minCapacity", "MinCapacity", (properties.MinCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScheduledActionProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduledActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalableTargetScheduledActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endTime", cdk.validateDate)(properties.endTime));
  errors.collect(cdk.propertyValidator("scalableTargetAction", CfnScalableTargetScalableTargetActionPropertyValidator)(properties.scalableTargetAction));
  errors.collect(cdk.propertyValidator("schedule", cdk.requiredValidator)(properties.schedule));
  errors.collect(cdk.propertyValidator("schedule", cdk.validateString)(properties.schedule));
  errors.collect(cdk.propertyValidator("scheduledActionName", cdk.requiredValidator)(properties.scheduledActionName));
  errors.collect(cdk.propertyValidator("scheduledActionName", cdk.validateString)(properties.scheduledActionName));
  errors.collect(cdk.propertyValidator("startTime", cdk.validateDate)(properties.startTime));
  errors.collect(cdk.propertyValidator("timezone", cdk.validateString)(properties.timezone));
  return errors.wrap("supplied properties not correct for \"ScheduledActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalableTargetScheduledActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalableTargetScheduledActionPropertyValidator(properties).assertSuccess();
  return {
    "EndTime": cdk.dateToCloudFormation(properties.endTime),
    "ScalableTargetAction": convertCfnScalableTargetScalableTargetActionPropertyToCloudFormation(properties.scalableTargetAction),
    "Schedule": cdk.stringToCloudFormation(properties.schedule),
    "ScheduledActionName": cdk.stringToCloudFormation(properties.scheduledActionName),
    "StartTime": cdk.dateToCloudFormation(properties.startTime),
    "Timezone": cdk.stringToCloudFormation(properties.timezone)
  };
}

// @ts-ignore TS6133
function CfnScalableTargetScheduledActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalableTarget.ScheduledActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalableTarget.ScheduledActionProperty>();
  ret.addPropertyResult("endTime", "EndTime", (properties.EndTime != null ? cfn_parse.FromCloudFormation.getDate(properties.EndTime) : undefined));
  ret.addPropertyResult("scalableTargetAction", "ScalableTargetAction", (properties.ScalableTargetAction != null ? CfnScalableTargetScalableTargetActionPropertyFromCloudFormation(properties.ScalableTargetAction) : undefined));
  ret.addPropertyResult("schedule", "Schedule", (properties.Schedule != null ? cfn_parse.FromCloudFormation.getString(properties.Schedule) : undefined));
  ret.addPropertyResult("scheduledActionName", "ScheduledActionName", (properties.ScheduledActionName != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduledActionName) : undefined));
  ret.addPropertyResult("startTime", "StartTime", (properties.StartTime != null ? cfn_parse.FromCloudFormation.getDate(properties.StartTime) : undefined));
  ret.addPropertyResult("timezone", "Timezone", (properties.Timezone != null ? cfn_parse.FromCloudFormation.getString(properties.Timezone) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SuspendedStateProperty`
 *
 * @param properties - the TypeScript properties of a `SuspendedStateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalableTargetSuspendedStatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dynamicScalingInSuspended", cdk.validateBoolean)(properties.dynamicScalingInSuspended));
  errors.collect(cdk.propertyValidator("dynamicScalingOutSuspended", cdk.validateBoolean)(properties.dynamicScalingOutSuspended));
  errors.collect(cdk.propertyValidator("scheduledScalingSuspended", cdk.validateBoolean)(properties.scheduledScalingSuspended));
  return errors.wrap("supplied properties not correct for \"SuspendedStateProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalableTargetSuspendedStatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalableTargetSuspendedStatePropertyValidator(properties).assertSuccess();
  return {
    "DynamicScalingInSuspended": cdk.booleanToCloudFormation(properties.dynamicScalingInSuspended),
    "DynamicScalingOutSuspended": cdk.booleanToCloudFormation(properties.dynamicScalingOutSuspended),
    "ScheduledScalingSuspended": cdk.booleanToCloudFormation(properties.scheduledScalingSuspended)
  };
}

// @ts-ignore TS6133
function CfnScalableTargetSuspendedStatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalableTarget.SuspendedStateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalableTarget.SuspendedStateProperty>();
  ret.addPropertyResult("dynamicScalingInSuspended", "DynamicScalingInSuspended", (properties.DynamicScalingInSuspended != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DynamicScalingInSuspended) : undefined));
  ret.addPropertyResult("dynamicScalingOutSuspended", "DynamicScalingOutSuspended", (properties.DynamicScalingOutSuspended != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DynamicScalingOutSuspended) : undefined));
  ret.addPropertyResult("scheduledScalingSuspended", "ScheduledScalingSuspended", (properties.ScheduledScalingSuspended != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ScheduledScalingSuspended) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnScalableTargetProps`
 *
 * @param properties - the TypeScript properties of a `CfnScalableTargetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalableTargetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxCapacity", cdk.requiredValidator)(properties.maxCapacity));
  errors.collect(cdk.propertyValidator("maxCapacity", cdk.validateNumber)(properties.maxCapacity));
  errors.collect(cdk.propertyValidator("minCapacity", cdk.requiredValidator)(properties.minCapacity));
  errors.collect(cdk.propertyValidator("minCapacity", cdk.validateNumber)(properties.minCapacity));
  errors.collect(cdk.propertyValidator("resourceId", cdk.requiredValidator)(properties.resourceId));
  errors.collect(cdk.propertyValidator("resourceId", cdk.validateString)(properties.resourceId));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("scalableDimension", cdk.requiredValidator)(properties.scalableDimension));
  errors.collect(cdk.propertyValidator("scalableDimension", cdk.validateString)(properties.scalableDimension));
  errors.collect(cdk.propertyValidator("scheduledActions", cdk.listValidator(CfnScalableTargetScheduledActionPropertyValidator))(properties.scheduledActions));
  errors.collect(cdk.propertyValidator("serviceNamespace", cdk.requiredValidator)(properties.serviceNamespace));
  errors.collect(cdk.propertyValidator("serviceNamespace", cdk.validateString)(properties.serviceNamespace));
  errors.collect(cdk.propertyValidator("suspendedState", CfnScalableTargetSuspendedStatePropertyValidator)(properties.suspendedState));
  return errors.wrap("supplied properties not correct for \"CfnScalableTargetProps\"");
}

// @ts-ignore TS6133
function convertCfnScalableTargetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalableTargetPropsValidator(properties).assertSuccess();
  return {
    "MaxCapacity": cdk.numberToCloudFormation(properties.maxCapacity),
    "MinCapacity": cdk.numberToCloudFormation(properties.minCapacity),
    "ResourceId": cdk.stringToCloudFormation(properties.resourceId),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn),
    "ScalableDimension": cdk.stringToCloudFormation(properties.scalableDimension),
    "ScheduledActions": cdk.listMapper(convertCfnScalableTargetScheduledActionPropertyToCloudFormation)(properties.scheduledActions),
    "ServiceNamespace": cdk.stringToCloudFormation(properties.serviceNamespace),
    "SuspendedState": convertCfnScalableTargetSuspendedStatePropertyToCloudFormation(properties.suspendedState)
  };
}

// @ts-ignore TS6133
function CfnScalableTargetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalableTargetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalableTargetProps>();
  ret.addPropertyResult("maxCapacity", "MaxCapacity", (properties.MaxCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacity) : undefined));
  ret.addPropertyResult("minCapacity", "MinCapacity", (properties.MinCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinCapacity) : undefined));
  ret.addPropertyResult("resourceId", "ResourceId", (properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addPropertyResult("scalableDimension", "ScalableDimension", (properties.ScalableDimension != null ? cfn_parse.FromCloudFormation.getString(properties.ScalableDimension) : undefined));
  ret.addPropertyResult("scheduledActions", "ScheduledActions", (properties.ScheduledActions != null ? cfn_parse.FromCloudFormation.getArray(CfnScalableTargetScheduledActionPropertyFromCloudFormation)(properties.ScheduledActions) : undefined));
  ret.addPropertyResult("serviceNamespace", "ServiceNamespace", (properties.ServiceNamespace != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceNamespace) : undefined));
  ret.addPropertyResult("suspendedState", "SuspendedState", (properties.SuspendedState != null ? CfnScalableTargetSuspendedStatePropertyFromCloudFormation(properties.SuspendedState) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApplicationAutoScaling::ScalingPolicy` resource defines a scaling policy that Application Auto Scaling uses to adjust the capacity of a scalable target.
 *
 * For more information, see [Target tracking scaling policies](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-target-tracking.html) and [Step scaling policies](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-step-scaling-policies.html) in the *Application Auto Scaling User Guide* .
 *
 * @cloudformationResource AWS::ApplicationAutoScaling::ScalingPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html
 */
export class CfnScalingPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApplicationAutoScaling::ScalingPolicy";

  /**
   * Build a CfnScalingPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScalingPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnScalingPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnScalingPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the ARN of a scaling policy.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the scaling policy.
   */
  public policyName: string;

  /**
   * The scaling policy type.
   */
  public policyType: string;

  /**
   * The identifier of the resource associated with the scaling policy.
   */
  public resourceId?: string;

  /**
   * The scalable dimension. This string consists of the service namespace, resource type, and scaling property.
   */
  public scalableDimension?: string;

  /**
   * The CloudFormation-generated ID of an Application Auto Scaling scalable target.
   */
  public scalingTargetId?: string;

  /**
   * The namespace of the AWS service that provides the resource, or a `custom-resource` .
   */
  public serviceNamespace?: string;

  /**
   * A step scaling policy.
   */
  public stepScalingPolicyConfiguration?: cdk.IResolvable | CfnScalingPolicy.StepScalingPolicyConfigurationProperty;

  /**
   * A target tracking scaling policy.
   */
  public targetTrackingScalingPolicyConfiguration?: cdk.IResolvable | CfnScalingPolicy.TargetTrackingScalingPolicyConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnScalingPolicyProps) {
    super(scope, id, {
      "type": CfnScalingPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policyName", this);
    cdk.requireProperty(props, "policyType", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.policyName = props.policyName;
    this.policyType = props.policyType;
    this.resourceId = props.resourceId;
    this.scalableDimension = props.scalableDimension;
    this.scalingTargetId = props.scalingTargetId;
    this.serviceNamespace = props.serviceNamespace;
    this.stepScalingPolicyConfiguration = props.stepScalingPolicyConfiguration;
    this.targetTrackingScalingPolicyConfiguration = props.targetTrackingScalingPolicyConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policyName": this.policyName,
      "policyType": this.policyType,
      "resourceId": this.resourceId,
      "scalableDimension": this.scalableDimension,
      "scalingTargetId": this.scalingTargetId,
      "serviceNamespace": this.serviceNamespace,
      "stepScalingPolicyConfiguration": this.stepScalingPolicyConfiguration,
      "targetTrackingScalingPolicyConfiguration": this.targetTrackingScalingPolicyConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnScalingPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnScalingPolicyPropsToCloudFormation(props);
  }
}

export namespace CfnScalingPolicy {
  /**
   * `StepScalingPolicyConfiguration` is a property of the [AWS::ApplicationAutoScaling::ScalingPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html) resource that specifies a step scaling policy configuration for Application Auto Scaling.
   *
   * For more information, see [Step scaling policies](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-step-scaling-policies.html) in the *Application Auto Scaling User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html
   */
  export interface StepScalingPolicyConfigurationProperty {
    /**
     * Specifies whether the `ScalingAdjustment` value in the `StepAdjustment` property is an absolute number or a percentage of the current capacity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-adjustmenttype
     */
    readonly adjustmentType?: string;

    /**
     * The amount of time, in seconds, to wait for a previous scaling activity to take effect.
     *
     * If not specified, the default value is 300. For more information, see [Cooldown period](https://docs.aws.amazon.com/autoscaling/application/userguide/step-scaling-policy-overview.html#step-scaling-cooldown) in the *Application Auto Scaling User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-cooldown
     */
    readonly cooldown?: number;

    /**
     * The aggregation type for the CloudWatch metrics.
     *
     * Valid values are `Minimum` , `Maximum` , and `Average` . If the aggregation type is null, the value is treated as `Average` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-metricaggregationtype
     */
    readonly metricAggregationType?: string;

    /**
     * The minimum value to scale by when the adjustment type is `PercentChangeInCapacity` .
     *
     * For example, suppose that you create a step scaling policy to scale out an Amazon ECS service by 25 percent and you specify a `MinAdjustmentMagnitude` of 2. If the service has 4 tasks and the scaling policy is performed, 25 percent of 4 is 1. However, because you specified a `MinAdjustmentMagnitude` of 2, Application Auto Scaling scales out the service by 2 tasks.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-minadjustmentmagnitude
     */
    readonly minAdjustmentMagnitude?: number;

    /**
     * A set of adjustments that enable you to scale based on the size of the alarm breach.
     *
     * At least one step adjustment is required if you are adding a new step scaling policy configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-stepadjustments
     */
    readonly stepAdjustments?: Array<cdk.IResolvable | CfnScalingPolicy.StepAdjustmentProperty> | cdk.IResolvable;
  }

  /**
   * `StepAdjustment` specifies a step adjustment for the `StepAdjustments` property of the [AWS::ApplicationAutoScaling::ScalingPolicy StepScalingPolicyConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html) property type.
   *
   * For the following examples, suppose that you have an alarm with a breach threshold of 50:
   *
   * - To trigger a step adjustment when the metric is greater than or equal to 50 and less than 60, specify a lower bound of 0 and an upper bound of 10.
   * - To trigger a step adjustment when the metric is greater than 40 and less than or equal to 50, specify a lower bound of -10 and an upper bound of 0.
   *
   * For more information, see [Step adjustments](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-step-scaling-policies.html#as-scaling-steps) in the *Application Auto Scaling User Guide* .
   *
   * You can find a sample template snippet in the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#aws-resource-applicationautoscaling-scalingpolicy--examples) section of the `AWS::ApplicationAutoScaling::ScalingPolicy` documentation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepadjustment.html
   */
  export interface StepAdjustmentProperty {
    /**
     * The lower bound for the difference between the alarm threshold and the CloudWatch metric.
     *
     * If the metric value is above the breach threshold, the lower bound is inclusive (the metric must be greater than or equal to the threshold plus the lower bound). Otherwise, it is exclusive (the metric must be greater than the threshold plus the lower bound). A null value indicates negative infinity.
     *
     * You must specify at least one upper or lower bound.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepadjustment.html#cfn-applicationautoscaling-scalingpolicy-stepadjustment-metricintervallowerbound
     */
    readonly metricIntervalLowerBound?: number;

    /**
     * The upper bound for the difference between the alarm threshold and the CloudWatch metric.
     *
     * If the metric value is above the breach threshold, the upper bound is exclusive (the metric must be less than the threshold plus the upper bound). Otherwise, it is inclusive (the metric must be less than or equal to the threshold plus the upper bound). A null value indicates positive infinity.
     *
     * You must specify at least one upper or lower bound.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepadjustment.html#cfn-applicationautoscaling-scalingpolicy-stepadjustment-metricintervalupperbound
     */
    readonly metricIntervalUpperBound?: number;

    /**
     * The amount by which to scale.
     *
     * The adjustment is based on the value that you specified in the `AdjustmentType` property (either an absolute number or a percentage). A positive value adds to the current capacity and a negative number subtracts from the current capacity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepadjustment.html#cfn-applicationautoscaling-scalingpolicy-stepadjustment-scalingadjustment
     */
    readonly scalingAdjustment: number;
  }

  /**
   * `TargetTrackingScalingPolicyConfiguration` is a property of the [AWS::ApplicationAutoScaling::ScalingPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html) resource that specifies a target tracking scaling policy configuration for Application Auto Scaling. Use a target tracking scaling policy to adjust the capacity of the specified scalable target in response to actual workloads, so that resource utilization remains at or near the target utilization value.
   *
   * For more information, see [Target tracking scaling policies](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-target-tracking.html) in the *Application Auto Scaling User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html
   */
  export interface TargetTrackingScalingPolicyConfigurationProperty {
    /**
     * A customized metric.
     *
     * You can specify either a predefined metric or a customized metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-customizedmetricspecification
     */
    readonly customizedMetricSpecification?: CfnScalingPolicy.CustomizedMetricSpecificationProperty | cdk.IResolvable;

    /**
     * Indicates whether scale in by the target tracking scaling policy is disabled.
     *
     * If the value is `true` , scale in is disabled and the target tracking scaling policy won't remove capacity from the scalable target. Otherwise, scale in is enabled and the target tracking scaling policy can remove capacity from the scalable target. The default value is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-disablescalein
     */
    readonly disableScaleIn?: boolean | cdk.IResolvable;

    /**
     * A predefined metric.
     *
     * You can specify either a predefined metric or a customized metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-predefinedmetricspecification
     */
    readonly predefinedMetricSpecification?: cdk.IResolvable | CfnScalingPolicy.PredefinedMetricSpecificationProperty;

    /**
     * The amount of time, in seconds, after a scale-in activity completes before another scale-in activity can start.
     *
     * For more information and for default values, see [Define cooldown periods](https://docs.aws.amazon.com/autoscaling/application/userguide/target-tracking-scaling-policy-overview.html#target-tracking-cooldown) in the *Application Auto Scaling User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-scaleincooldown
     */
    readonly scaleInCooldown?: number;

    /**
     * The amount of time, in seconds, to wait for a previous scale-out activity to take effect.
     *
     * For more information and for default values, see [Define cooldown periods](https://docs.aws.amazon.com/autoscaling/application/userguide/target-tracking-scaling-policy-overview.html#target-tracking-cooldown) in the *Application Auto Scaling User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-scaleoutcooldown
     */
    readonly scaleOutCooldown?: number;

    /**
     * The target value for the metric.
     *
     * Although this property accepts numbers of type Double, it won't accept values that are either too small or too large. Values must be in the range of -2^360 to 2^360. The value must be a valid number based on the choice of metric. For example, if the metric is CPU utilization, then the target value is a percent value that represents how much of the CPU can be used before scaling out.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-targetvalue
     */
    readonly targetValue: number;
  }

  /**
   * Contains customized metric specification information for a target tracking scaling policy for Application Auto Scaling.
   *
   * For information about the available metrics for a service, see [AWS services that publish CloudWatch metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) in the *Amazon CloudWatch User Guide* .
   *
   * To create your customized metric specification:
   *
   * - Add values for each required parameter from CloudWatch. You can use an existing metric, or a new metric that you create. To use your own metric, you must first publish the metric to CloudWatch. For more information, see [Publish custom metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html) in the *Amazon CloudWatch User Guide* .
   * - Choose a metric that changes proportionally with capacity. The value of the metric should increase or decrease in inverse proportion to the number of capacity units. That is, the value of the metric should decrease when capacity increases, and increase when capacity decreases.
   *
   * For an example of how creating new metrics can be useful, see [Scaling based on Amazon SQS](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html) in the *Amazon EC2 Auto Scaling User Guide* . This topic mentions Auto Scaling groups, but the same scenario for Amazon SQS can apply to the target tracking scaling policies that you create for a Spot Fleet by using Application Auto Scaling.
   *
   * For more information about the CloudWatch terminology below, see [Amazon CloudWatch concepts](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html) .
   *
   * `CustomizedMetricSpecification` is a property of the [AWS::ApplicationAutoScaling::ScalingPolicy TargetTrackingScalingPolicyConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html
   */
  export interface CustomizedMetricSpecificationProperty {
    /**
     * The dimensions of the metric.
     *
     * Conditional: If you published your metric with dimensions, you must specify the same dimensions in your scaling policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-dimensions
     */
    readonly dimensions?: Array<cdk.IResolvable | CfnScalingPolicy.MetricDimensionProperty> | cdk.IResolvable;

    /**
     * The name of the metric.
     *
     * To get the exact metric name, namespace, and dimensions, inspect the [Metric](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_Metric.html) object that's returned by a call to [ListMetrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_ListMetrics.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-metricname
     */
    readonly metricName?: string;

    /**
     * The metrics to include in the target tracking scaling policy, as a metric data query.
     *
     * This can include both raw metric and metric math expressions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-metrics
     */
    readonly metrics?: Array<cdk.IResolvable | CfnScalingPolicy.TargetTrackingMetricDataQueryProperty> | cdk.IResolvable;

    /**
     * The namespace of the metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-namespace
     */
    readonly namespace?: string;

    /**
     * The statistic of the metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-statistic
     */
    readonly statistic?: string;

    /**
     * The unit of the metric.
     *
     * For a complete list of the units that CloudWatch supports, see the [MetricDatum](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_MetricDatum.html) data type in the *Amazon CloudWatch API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-customizedmetricspecification-unit
     */
    readonly unit?: string;
  }

  /**
   * `MetricDimension` specifies a name/value pair that is part of the identity of a CloudWatch metric for the `Dimensions` property of the [AWS::ApplicationAutoScaling::ScalingPolicy CustomizedMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html) property type. Duplicate dimensions are not allowed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-metricdimension.html
   */
  export interface MetricDimensionProperty {
    /**
     * The name of the dimension.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-metricdimension.html#cfn-applicationautoscaling-scalingpolicy-metricdimension-name
     */
    readonly name: string;

    /**
     * The value of the dimension.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-metricdimension.html#cfn-applicationautoscaling-scalingpolicy-metricdimension-value
     */
    readonly value: string;
  }

  /**
   * The metric data to return.
   *
   * Also defines whether this call is returning data for one metric only, or whether it is performing a math expression on the values of returned metric statistics to create a new time series. A time series is a series of data points, each of which is associated with a timestamp.
   *
   * You can call for a single metric or perform math expressions on multiple metrics. Any expressions used in a metric specification must eventually return a single time series.
   *
   * For more information and examples, see [Create a target tracking scaling policy for Application Auto Scaling using metric math](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-target-tracking-metric-math.html) in the *Application Auto Scaling User Guide* .
   *
   * `TargetTrackingMetricDataQuery` is a property of the [AWS::ApplicationAutoScaling::ScalingPolicy CustomizedMetricSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-customizedmetricspecification.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetricdataquery.html
   */
  export interface TargetTrackingMetricDataQueryProperty {
    /**
     * The math expression to perform on the returned data, if this object is performing a math expression.
     *
     * This expression can use the `Id` of the other metrics to refer to those metrics, and can also use the `Id` of other expressions to use the result of those expressions.
     *
     * Conditional: Within each `TargetTrackingMetricDataQuery` object, you must specify either `Expression` or `MetricStat` , but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetricdataquery.html#cfn-applicationautoscaling-scalingpolicy-targettrackingmetricdataquery-expression
     */
    readonly expression?: string;

    /**
     * A short name that identifies the object's results in the response.
     *
     * This name must be unique among all `MetricDataQuery` objects specified for a single scaling policy. If you are performing math expressions on this set of data, this name represents that data and can serve as a variable in the mathematical expression. The valid characters are letters, numbers, and underscores. The first character must be a lowercase letter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetricdataquery.html#cfn-applicationautoscaling-scalingpolicy-targettrackingmetricdataquery-id
     */
    readonly id?: string;

    /**
     * A human-readable label for this metric or expression.
     *
     * This is especially useful if this is a math expression, so that you know what the value represents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetricdataquery.html#cfn-applicationautoscaling-scalingpolicy-targettrackingmetricdataquery-label
     */
    readonly label?: string;

    /**
     * Information about the metric data to return.
     *
     * Conditional: Within each `MetricDataQuery` object, you must specify either `Expression` or `MetricStat` , but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetricdataquery.html#cfn-applicationautoscaling-scalingpolicy-targettrackingmetricdataquery-metricstat
     */
    readonly metricStat?: cdk.IResolvable | CfnScalingPolicy.TargetTrackingMetricStatProperty;

    /**
     * Indicates whether to return the timestamps and raw data values of this metric.
     *
     * If you use any math expressions, specify `true` for this value for only the final math expression that the metric specification is based on. You must specify `false` for `ReturnData` for all the other metrics and expressions used in the metric specification.
     *
     * If you are only retrieving metrics and not performing any math expressions, do not specify anything for `ReturnData` . This sets it to its default ( `true` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetricdataquery.html#cfn-applicationautoscaling-scalingpolicy-targettrackingmetricdataquery-returndata
     */
    readonly returnData?: boolean | cdk.IResolvable;
  }

  /**
   * This structure defines the CloudWatch metric to return, along with the statistic, period, and unit.
   *
   * `TargetTrackingMetricStat` is a property of the [AWS::ApplicationAutoScaling::ScalingPolicy TargetTrackingMetricDataQuery](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetricdataquery.html) property type.
   *
   * For more information about the CloudWatch terminology below, see [Amazon CloudWatch concepts](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html) in the *Amazon CloudWatch User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetricstat.html
   */
  export interface TargetTrackingMetricStatProperty {
    /**
     * The CloudWatch metric to return, including the metric name, namespace, and dimensions.
     *
     * To get the exact metric name, namespace, and dimensions, inspect the [Metric](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_Metric.html) object that is returned by a call to [ListMetrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_ListMetrics.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetricstat.html#cfn-applicationautoscaling-scalingpolicy-targettrackingmetricstat-metric
     */
    readonly metric?: cdk.IResolvable | CfnScalingPolicy.TargetTrackingMetricProperty;

    /**
     * The statistic to return.
     *
     * It can include any CloudWatch statistic or extended statistic. For a list of valid values, see the table in [Statistics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Statistic) in the *Amazon CloudWatch User Guide* .
     *
     * The most commonly used metric for scaling is `Average` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetricstat.html#cfn-applicationautoscaling-scalingpolicy-targettrackingmetricstat-stat
     */
    readonly stat?: string;

    /**
     * The unit to use for the returned data points.
     *
     * For a complete list of the units that CloudWatch supports, see the [MetricDatum](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_MetricDatum.html) data type in the *Amazon CloudWatch API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetricstat.html#cfn-applicationautoscaling-scalingpolicy-targettrackingmetricstat-unit
     */
    readonly unit?: string;
  }

  /**
   * Represents a specific metric for a target tracking scaling policy for Application Auto Scaling.
   *
   * Metric is a property of the [AWS::ApplicationAutoScaling::ScalingPolicy TargetTrackingMetricStat](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetricstat.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetric.html
   */
  export interface TargetTrackingMetricProperty {
    /**
     * The dimensions for the metric.
     *
     * For the list of available dimensions, see the AWS documentation available from the table in [AWS services that publish CloudWatch metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) in the *Amazon CloudWatch User Guide* .
     *
     * Conditional: If you published your metric with dimensions, you must specify the same dimensions in your scaling policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetric.html#cfn-applicationautoscaling-scalingpolicy-targettrackingmetric-dimensions
     */
    readonly dimensions?: Array<cdk.IResolvable | CfnScalingPolicy.TargetTrackingMetricDimensionProperty> | cdk.IResolvable;

    /**
     * The name of the metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetric.html#cfn-applicationautoscaling-scalingpolicy-targettrackingmetric-metricname
     */
    readonly metricName?: string;

    /**
     * The namespace of the metric.
     *
     * For more information, see the table in [AWS services that publish CloudWatch metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) in the *Amazon CloudWatch User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetric.html#cfn-applicationautoscaling-scalingpolicy-targettrackingmetric-namespace
     */
    readonly namespace?: string;
  }

  /**
   * `TargetTrackingMetricDimension` specifies a name/value pair that is part of the identity of a CloudWatch metric for the `Dimensions` property of the [AWS::ApplicationAutoScaling::ScalingPolicy TargetTrackingMetric](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetric.html) property type. Duplicate dimensions are not allowed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetricdimension.html
   */
  export interface TargetTrackingMetricDimensionProperty {
    /**
     * The name of the dimension.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetricdimension.html#cfn-applicationautoscaling-scalingpolicy-targettrackingmetricdimension-name
     */
    readonly name?: string;

    /**
     * The value of the dimension.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingmetricdimension.html#cfn-applicationautoscaling-scalingpolicy-targettrackingmetricdimension-value
     */
    readonly value?: string;
  }

  /**
   * Contains predefined metric specification information for a target tracking scaling policy for Application Auto Scaling.
   *
   * `PredefinedMetricSpecification` is a property of the [AWS::ApplicationAutoScaling::ScalingPolicy TargetTrackingScalingPolicyConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-predefinedmetricspecification.html
   */
  export interface PredefinedMetricSpecificationProperty {
    /**
     * The metric type.
     *
     * The `ALBRequestCountPerTarget` metric type applies only to Spot fleet requests and ECS services.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-predefinedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-predefinedmetricspecification-predefinedmetrictype
     */
    readonly predefinedMetricType: string;

    /**
     * Identifies the resource associated with the metric type.
     *
     * You can't specify a resource label unless the metric type is `ALBRequestCountPerTarget` and there is a target group attached to the Spot Fleet or ECS service.
     *
     * You create the resource label by appending the final portion of the load balancer ARN and the final portion of the target group ARN into a single value, separated by a forward slash (/). The format of the resource label is:
     *
     * `app/my-alb/778d41231b141a0f/targetgroup/my-alb-target-group/943f017f100becff` .
     *
     * Where:
     *
     * - app/<load-balancer-name>/<load-balancer-id> is the final portion of the load balancer ARN
     * - targetgroup/<target-group-name>/<target-group-id> is the final portion of the target group ARN.
     *
     * To find the ARN for an Application Load Balancer, use the [DescribeLoadBalancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DescribeLoadBalancers.html) API operation. To find the ARN for the target group, use the [DescribeTargetGroups](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DescribeTargetGroups.html) API operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-predefinedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-predefinedmetricspecification-resourcelabel
     */
    readonly resourceLabel?: string;
  }
}

/**
 * Properties for defining a `CfnScalingPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html
 */
export interface CfnScalingPolicyProps {
  /**
   * The name of the scaling policy.
   *
   * Updates to the name of a target tracking scaling policy are not supported, unless you also update the metric used for scaling. To change only a target tracking scaling policy's name, first delete the policy by removing the existing `AWS::ApplicationAutoScaling::ScalingPolicy` resource from the template and updating the stack. Then, recreate the resource with the same settings and a different name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-policyname
   */
  readonly policyName: string;

  /**
   * The scaling policy type.
   *
   * The following policy types are supported:
   *
   * `TargetTrackingScaling` —Not supported for Amazon EMR
   *
   * `StepScaling` —Not supported for DynamoDB, Amazon Comprehend, Lambda, Amazon Keyspaces, Amazon MSK, Amazon ElastiCache, or Neptune.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-policytype
   */
  readonly policyType: string;

  /**
   * The identifier of the resource associated with the scaling policy.
   *
   * This string consists of the resource type and unique identifier.
   *
   * - ECS service - The resource type is `service` and the unique identifier is the cluster name and service name. Example: `service/default/sample-webapp` .
   * - Spot Fleet - The resource type is `spot-fleet-request` and the unique identifier is the Spot Fleet request ID. Example: `spot-fleet-request/sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE` .
   * - EMR cluster - The resource type is `instancegroup` and the unique identifier is the cluster ID and instance group ID. Example: `instancegroup/j-2EEZNYKUA1NTV/ig-1791Y4E1L8YI0` .
   * - AppStream 2.0 fleet - The resource type is `fleet` and the unique identifier is the fleet name. Example: `fleet/sample-fleet` .
   * - DynamoDB table - The resource type is `table` and the unique identifier is the table name. Example: `table/my-table` .
   * - DynamoDB global secondary index - The resource type is `index` and the unique identifier is the index name. Example: `table/my-table/index/my-table-index` .
   * - Aurora DB cluster - The resource type is `cluster` and the unique identifier is the cluster name. Example: `cluster:my-db-cluster` .
   * - SageMaker endpoint variant - The resource type is `variant` and the unique identifier is the resource ID. Example: `endpoint/my-end-point/variant/KMeansClustering` .
   * - Custom resources are not supported with a resource type. This parameter must specify the `OutputValue` from the CloudFormation template stack used to access the resources. The unique identifier is defined by the service provider. More information is available in our [GitHub repository](https://docs.aws.amazon.com/https://github.com/aws/aws-auto-scaling-custom-resource) .
   * - Amazon Comprehend document classification endpoint - The resource type and unique identifier are specified using the endpoint ARN. Example: `arn:aws:comprehend:us-west-2:123456789012:document-classifier-endpoint/EXAMPLE` .
   * - Amazon Comprehend entity recognizer endpoint - The resource type and unique identifier are specified using the endpoint ARN. Example: `arn:aws:comprehend:us-west-2:123456789012:entity-recognizer-endpoint/EXAMPLE` .
   * - Lambda provisioned concurrency - The resource type is `function` and the unique identifier is the function name with a function version or alias name suffix that is not `$LATEST` . Example: `function:my-function:prod` or `function:my-function:1` .
   * - Amazon Keyspaces table - The resource type is `table` and the unique identifier is the table name. Example: `keyspace/mykeyspace/table/mytable` .
   * - Amazon MSK cluster - The resource type and unique identifier are specified using the cluster ARN. Example: `arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5` .
   * - Amazon ElastiCache replication group - The resource type is `replication-group` and the unique identifier is the replication group name. Example: `replication-group/mycluster` .
   * - Neptune cluster - The resource type is `cluster` and the unique identifier is the cluster name. Example: `cluster:mycluster` .
   * - SageMaker serverless endpoint - The resource type is `variant` and the unique identifier is the resource ID. Example: `endpoint/my-end-point/variant/KMeansClustering` .
   * - SageMaker inference component - The resource type is `inference-component` and the unique identifier is the resource ID. Example: `inference-component/my-inference-component` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-resourceid
   */
  readonly resourceId?: string;

  /**
   * The scalable dimension. This string consists of the service namespace, resource type, and scaling property.
   *
   * - `ecs:service:DesiredCount` - The desired task count of an ECS service.
   * - `elasticmapreduce:instancegroup:InstanceCount` - The instance count of an EMR Instance Group.
   * - `ec2:spot-fleet-request:TargetCapacity` - The target capacity of a Spot Fleet.
   * - `appstream:fleet:DesiredCapacity` - The desired capacity of an AppStream 2.0 fleet.
   * - `dynamodb:table:ReadCapacityUnits` - The provisioned read capacity for a DynamoDB table.
   * - `dynamodb:table:WriteCapacityUnits` - The provisioned write capacity for a DynamoDB table.
   * - `dynamodb:index:ReadCapacityUnits` - The provisioned read capacity for a DynamoDB global secondary index.
   * - `dynamodb:index:WriteCapacityUnits` - The provisioned write capacity for a DynamoDB global secondary index.
   * - `rds:cluster:ReadReplicaCount` - The count of Aurora Replicas in an Aurora DB cluster. Available for Aurora MySQL-compatible edition and Aurora PostgreSQL-compatible edition.
   * - `sagemaker:variant:DesiredInstanceCount` - The number of EC2 instances for a SageMaker model endpoint variant.
   * - `custom-resource:ResourceType:Property` - The scalable dimension for a custom resource provided by your own application or service.
   * - `comprehend:document-classifier-endpoint:DesiredInferenceUnits` - The number of inference units for an Amazon Comprehend document classification endpoint.
   * - `comprehend:entity-recognizer-endpoint:DesiredInferenceUnits` - The number of inference units for an Amazon Comprehend entity recognizer endpoint.
   * - `lambda:function:ProvisionedConcurrency` - The provisioned concurrency for a Lambda function.
   * - `cassandra:table:ReadCapacityUnits` - The provisioned read capacity for an Amazon Keyspaces table.
   * - `cassandra:table:WriteCapacityUnits` - The provisioned write capacity for an Amazon Keyspaces table.
   * - `kafka:broker-storage:VolumeSize` - The provisioned volume size (in GiB) for brokers in an Amazon MSK cluster.
   * - `elasticache:replication-group:NodeGroups` - The number of node groups for an Amazon ElastiCache replication group.
   * - `elasticache:replication-group:Replicas` - The number of replicas per node group for an Amazon ElastiCache replication group.
   * - `neptune:cluster:ReadReplicaCount` - The count of read replicas in an Amazon Neptune DB cluster.
   * - `sagemaker:variant:DesiredProvisionedConcurrency` - The provisioned concurrency for a SageMaker serverless endpoint.
   * - `sagemaker:inference-component:DesiredCopyCount` - The number of copies across an endpoint for a SageMaker inference component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-scalabledimension
   */
  readonly scalableDimension?: string;

  /**
   * The CloudFormation-generated ID of an Application Auto Scaling scalable target.
   *
   * For more information about the ID, see the Return Value section of the `AWS::ApplicationAutoScaling::ScalableTarget` resource.
   *
   * > You must specify either the `ScalingTargetId` property, or the `ResourceId` , `ScalableDimension` , and `ServiceNamespace` properties, but not both.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-scalingtargetid
   */
  readonly scalingTargetId?: string;

  /**
   * The namespace of the AWS service that provides the resource, or a `custom-resource` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-servicenamespace
   */
  readonly serviceNamespace?: string;

  /**
   * A step scaling policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration
   */
  readonly stepScalingPolicyConfiguration?: cdk.IResolvable | CfnScalingPolicy.StepScalingPolicyConfigurationProperty;

  /**
   * A target tracking scaling policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration
   */
  readonly targetTrackingScalingPolicyConfiguration?: cdk.IResolvable | CfnScalingPolicy.TargetTrackingScalingPolicyConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `StepAdjustmentProperty`
 *
 * @param properties - the TypeScript properties of a `StepAdjustmentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyStepAdjustmentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("metricIntervalLowerBound", cdk.validateNumber)(properties.metricIntervalLowerBound));
  errors.collect(cdk.propertyValidator("metricIntervalUpperBound", cdk.validateNumber)(properties.metricIntervalUpperBound));
  errors.collect(cdk.propertyValidator("scalingAdjustment", cdk.requiredValidator)(properties.scalingAdjustment));
  errors.collect(cdk.propertyValidator("scalingAdjustment", cdk.validateNumber)(properties.scalingAdjustment));
  return errors.wrap("supplied properties not correct for \"StepAdjustmentProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyStepAdjustmentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyStepAdjustmentPropertyValidator(properties).assertSuccess();
  return {
    "MetricIntervalLowerBound": cdk.numberToCloudFormation(properties.metricIntervalLowerBound),
    "MetricIntervalUpperBound": cdk.numberToCloudFormation(properties.metricIntervalUpperBound),
    "ScalingAdjustment": cdk.numberToCloudFormation(properties.scalingAdjustment)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyStepAdjustmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.StepAdjustmentProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.StepAdjustmentProperty>();
  ret.addPropertyResult("metricIntervalLowerBound", "MetricIntervalLowerBound", (properties.MetricIntervalLowerBound != null ? cfn_parse.FromCloudFormation.getNumber(properties.MetricIntervalLowerBound) : undefined));
  ret.addPropertyResult("metricIntervalUpperBound", "MetricIntervalUpperBound", (properties.MetricIntervalUpperBound != null ? cfn_parse.FromCloudFormation.getNumber(properties.MetricIntervalUpperBound) : undefined));
  ret.addPropertyResult("scalingAdjustment", "ScalingAdjustment", (properties.ScalingAdjustment != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScalingAdjustment) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StepScalingPolicyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `StepScalingPolicyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyStepScalingPolicyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adjustmentType", cdk.validateString)(properties.adjustmentType));
  errors.collect(cdk.propertyValidator("cooldown", cdk.validateNumber)(properties.cooldown));
  errors.collect(cdk.propertyValidator("metricAggregationType", cdk.validateString)(properties.metricAggregationType));
  errors.collect(cdk.propertyValidator("minAdjustmentMagnitude", cdk.validateNumber)(properties.minAdjustmentMagnitude));
  errors.collect(cdk.propertyValidator("stepAdjustments", cdk.listValidator(CfnScalingPolicyStepAdjustmentPropertyValidator))(properties.stepAdjustments));
  return errors.wrap("supplied properties not correct for \"StepScalingPolicyConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyStepScalingPolicyConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyStepScalingPolicyConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AdjustmentType": cdk.stringToCloudFormation(properties.adjustmentType),
    "Cooldown": cdk.numberToCloudFormation(properties.cooldown),
    "MetricAggregationType": cdk.stringToCloudFormation(properties.metricAggregationType),
    "MinAdjustmentMagnitude": cdk.numberToCloudFormation(properties.minAdjustmentMagnitude),
    "StepAdjustments": cdk.listMapper(convertCfnScalingPolicyStepAdjustmentPropertyToCloudFormation)(properties.stepAdjustments)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyStepScalingPolicyConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.StepScalingPolicyConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.StepScalingPolicyConfigurationProperty>();
  ret.addPropertyResult("adjustmentType", "AdjustmentType", (properties.AdjustmentType != null ? cfn_parse.FromCloudFormation.getString(properties.AdjustmentType) : undefined));
  ret.addPropertyResult("cooldown", "Cooldown", (properties.Cooldown != null ? cfn_parse.FromCloudFormation.getNumber(properties.Cooldown) : undefined));
  ret.addPropertyResult("metricAggregationType", "MetricAggregationType", (properties.MetricAggregationType != null ? cfn_parse.FromCloudFormation.getString(properties.MetricAggregationType) : undefined));
  ret.addPropertyResult("minAdjustmentMagnitude", "MinAdjustmentMagnitude", (properties.MinAdjustmentMagnitude != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinAdjustmentMagnitude) : undefined));
  ret.addPropertyResult("stepAdjustments", "StepAdjustments", (properties.StepAdjustments != null ? cfn_parse.FromCloudFormation.getArray(CfnScalingPolicyStepAdjustmentPropertyFromCloudFormation)(properties.StepAdjustments) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDimensionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyMetricDimensionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"MetricDimensionProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyMetricDimensionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyMetricDimensionPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyMetricDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.MetricDimensionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.MetricDimensionProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetTrackingMetricDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `TargetTrackingMetricDimensionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyTargetTrackingMetricDimensionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TargetTrackingMetricDimensionProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyTargetTrackingMetricDimensionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyTargetTrackingMetricDimensionPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyTargetTrackingMetricDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.TargetTrackingMetricDimensionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.TargetTrackingMetricDimensionProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetTrackingMetricProperty`
 *
 * @param properties - the TypeScript properties of a `TargetTrackingMetricProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyTargetTrackingMetricPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dimensions", cdk.listValidator(CfnScalingPolicyTargetTrackingMetricDimensionPropertyValidator))(properties.dimensions));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  return errors.wrap("supplied properties not correct for \"TargetTrackingMetricProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyTargetTrackingMetricPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyTargetTrackingMetricPropertyValidator(properties).assertSuccess();
  return {
    "Dimensions": cdk.listMapper(convertCfnScalingPolicyTargetTrackingMetricDimensionPropertyToCloudFormation)(properties.dimensions),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "Namespace": cdk.stringToCloudFormation(properties.namespace)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyTargetTrackingMetricPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.TargetTrackingMetricProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.TargetTrackingMetricProperty>();
  ret.addPropertyResult("dimensions", "Dimensions", (properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnScalingPolicyTargetTrackingMetricDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetTrackingMetricStatProperty`
 *
 * @param properties - the TypeScript properties of a `TargetTrackingMetricStatProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyTargetTrackingMetricStatPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("metric", CfnScalingPolicyTargetTrackingMetricPropertyValidator)(properties.metric));
  errors.collect(cdk.propertyValidator("stat", cdk.validateString)(properties.stat));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  return errors.wrap("supplied properties not correct for \"TargetTrackingMetricStatProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyTargetTrackingMetricStatPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyTargetTrackingMetricStatPropertyValidator(properties).assertSuccess();
  return {
    "Metric": convertCfnScalingPolicyTargetTrackingMetricPropertyToCloudFormation(properties.metric),
    "Stat": cdk.stringToCloudFormation(properties.stat),
    "Unit": cdk.stringToCloudFormation(properties.unit)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyTargetTrackingMetricStatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.TargetTrackingMetricStatProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.TargetTrackingMetricStatProperty>();
  ret.addPropertyResult("metric", "Metric", (properties.Metric != null ? CfnScalingPolicyTargetTrackingMetricPropertyFromCloudFormation(properties.Metric) : undefined));
  ret.addPropertyResult("stat", "Stat", (properties.Stat != null ? cfn_parse.FromCloudFormation.getString(properties.Stat) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetTrackingMetricDataQueryProperty`
 *
 * @param properties - the TypeScript properties of a `TargetTrackingMetricDataQueryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyTargetTrackingMetricDataQueryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("expression", cdk.validateString)(properties.expression));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("label", cdk.validateString)(properties.label));
  errors.collect(cdk.propertyValidator("metricStat", CfnScalingPolicyTargetTrackingMetricStatPropertyValidator)(properties.metricStat));
  errors.collect(cdk.propertyValidator("returnData", cdk.validateBoolean)(properties.returnData));
  return errors.wrap("supplied properties not correct for \"TargetTrackingMetricDataQueryProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyTargetTrackingMetricDataQueryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyTargetTrackingMetricDataQueryPropertyValidator(properties).assertSuccess();
  return {
    "Expression": cdk.stringToCloudFormation(properties.expression),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Label": cdk.stringToCloudFormation(properties.label),
    "MetricStat": convertCfnScalingPolicyTargetTrackingMetricStatPropertyToCloudFormation(properties.metricStat),
    "ReturnData": cdk.booleanToCloudFormation(properties.returnData)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyTargetTrackingMetricDataQueryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.TargetTrackingMetricDataQueryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.TargetTrackingMetricDataQueryProperty>();
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("label", "Label", (properties.Label != null ? cfn_parse.FromCloudFormation.getString(properties.Label) : undefined));
  ret.addPropertyResult("metricStat", "MetricStat", (properties.MetricStat != null ? CfnScalingPolicyTargetTrackingMetricStatPropertyFromCloudFormation(properties.MetricStat) : undefined));
  ret.addPropertyResult("returnData", "ReturnData", (properties.ReturnData != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReturnData) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomizedMetricSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `CustomizedMetricSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyCustomizedMetricSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dimensions", cdk.listValidator(CfnScalingPolicyMetricDimensionPropertyValidator))(properties.dimensions));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("metrics", cdk.listValidator(CfnScalingPolicyTargetTrackingMetricDataQueryPropertyValidator))(properties.metrics));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  errors.collect(cdk.propertyValidator("statistic", cdk.validateString)(properties.statistic));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  return errors.wrap("supplied properties not correct for \"CustomizedMetricSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyCustomizedMetricSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyCustomizedMetricSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "Dimensions": cdk.listMapper(convertCfnScalingPolicyMetricDimensionPropertyToCloudFormation)(properties.dimensions),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "Metrics": cdk.listMapper(convertCfnScalingPolicyTargetTrackingMetricDataQueryPropertyToCloudFormation)(properties.metrics),
    "Namespace": cdk.stringToCloudFormation(properties.namespace),
    "Statistic": cdk.stringToCloudFormation(properties.statistic),
    "Unit": cdk.stringToCloudFormation(properties.unit)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyCustomizedMetricSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalingPolicy.CustomizedMetricSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.CustomizedMetricSpecificationProperty>();
  ret.addPropertyResult("dimensions", "Dimensions", (properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnScalingPolicyMetricDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("metrics", "Metrics", (properties.Metrics != null ? cfn_parse.FromCloudFormation.getArray(CfnScalingPolicyTargetTrackingMetricDataQueryPropertyFromCloudFormation)(properties.Metrics) : undefined));
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addPropertyResult("statistic", "Statistic", (properties.Statistic != null ? cfn_parse.FromCloudFormation.getString(properties.Statistic) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PredefinedMetricSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `PredefinedMetricSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyPredefinedMetricSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("predefinedMetricType", cdk.requiredValidator)(properties.predefinedMetricType));
  errors.collect(cdk.propertyValidator("predefinedMetricType", cdk.validateString)(properties.predefinedMetricType));
  errors.collect(cdk.propertyValidator("resourceLabel", cdk.validateString)(properties.resourceLabel));
  return errors.wrap("supplied properties not correct for \"PredefinedMetricSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyPredefinedMetricSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyPredefinedMetricSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "PredefinedMetricType": cdk.stringToCloudFormation(properties.predefinedMetricType),
    "ResourceLabel": cdk.stringToCloudFormation(properties.resourceLabel)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyPredefinedMetricSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.PredefinedMetricSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.PredefinedMetricSpecificationProperty>();
  ret.addPropertyResult("predefinedMetricType", "PredefinedMetricType", (properties.PredefinedMetricType != null ? cfn_parse.FromCloudFormation.getString(properties.PredefinedMetricType) : undefined));
  ret.addPropertyResult("resourceLabel", "ResourceLabel", (properties.ResourceLabel != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceLabel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetTrackingScalingPolicyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TargetTrackingScalingPolicyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyTargetTrackingScalingPolicyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customizedMetricSpecification", CfnScalingPolicyCustomizedMetricSpecificationPropertyValidator)(properties.customizedMetricSpecification));
  errors.collect(cdk.propertyValidator("disableScaleIn", cdk.validateBoolean)(properties.disableScaleIn));
  errors.collect(cdk.propertyValidator("predefinedMetricSpecification", CfnScalingPolicyPredefinedMetricSpecificationPropertyValidator)(properties.predefinedMetricSpecification));
  errors.collect(cdk.propertyValidator("scaleInCooldown", cdk.validateNumber)(properties.scaleInCooldown));
  errors.collect(cdk.propertyValidator("scaleOutCooldown", cdk.validateNumber)(properties.scaleOutCooldown));
  errors.collect(cdk.propertyValidator("targetValue", cdk.requiredValidator)(properties.targetValue));
  errors.collect(cdk.propertyValidator("targetValue", cdk.validateNumber)(properties.targetValue));
  return errors.wrap("supplied properties not correct for \"TargetTrackingScalingPolicyConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyTargetTrackingScalingPolicyConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyTargetTrackingScalingPolicyConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CustomizedMetricSpecification": convertCfnScalingPolicyCustomizedMetricSpecificationPropertyToCloudFormation(properties.customizedMetricSpecification),
    "DisableScaleIn": cdk.booleanToCloudFormation(properties.disableScaleIn),
    "PredefinedMetricSpecification": convertCfnScalingPolicyPredefinedMetricSpecificationPropertyToCloudFormation(properties.predefinedMetricSpecification),
    "ScaleInCooldown": cdk.numberToCloudFormation(properties.scaleInCooldown),
    "ScaleOutCooldown": cdk.numberToCloudFormation(properties.scaleOutCooldown),
    "TargetValue": cdk.numberToCloudFormation(properties.targetValue)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyTargetTrackingScalingPolicyConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScalingPolicy.TargetTrackingScalingPolicyConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicy.TargetTrackingScalingPolicyConfigurationProperty>();
  ret.addPropertyResult("customizedMetricSpecification", "CustomizedMetricSpecification", (properties.CustomizedMetricSpecification != null ? CfnScalingPolicyCustomizedMetricSpecificationPropertyFromCloudFormation(properties.CustomizedMetricSpecification) : undefined));
  ret.addPropertyResult("disableScaleIn", "DisableScaleIn", (properties.DisableScaleIn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableScaleIn) : undefined));
  ret.addPropertyResult("predefinedMetricSpecification", "PredefinedMetricSpecification", (properties.PredefinedMetricSpecification != null ? CfnScalingPolicyPredefinedMetricSpecificationPropertyFromCloudFormation(properties.PredefinedMetricSpecification) : undefined));
  ret.addPropertyResult("scaleInCooldown", "ScaleInCooldown", (properties.ScaleInCooldown != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScaleInCooldown) : undefined));
  ret.addPropertyResult("scaleOutCooldown", "ScaleOutCooldown", (properties.ScaleOutCooldown != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScaleOutCooldown) : undefined));
  ret.addPropertyResult("targetValue", "TargetValue", (properties.TargetValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnScalingPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnScalingPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScalingPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyName", cdk.requiredValidator)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyType", cdk.requiredValidator)(properties.policyType));
  errors.collect(cdk.propertyValidator("policyType", cdk.validateString)(properties.policyType));
  errors.collect(cdk.propertyValidator("resourceId", cdk.validateString)(properties.resourceId));
  errors.collect(cdk.propertyValidator("scalableDimension", cdk.validateString)(properties.scalableDimension));
  errors.collect(cdk.propertyValidator("scalingTargetId", cdk.validateString)(properties.scalingTargetId));
  errors.collect(cdk.propertyValidator("serviceNamespace", cdk.validateString)(properties.serviceNamespace));
  errors.collect(cdk.propertyValidator("stepScalingPolicyConfiguration", CfnScalingPolicyStepScalingPolicyConfigurationPropertyValidator)(properties.stepScalingPolicyConfiguration));
  errors.collect(cdk.propertyValidator("targetTrackingScalingPolicyConfiguration", CfnScalingPolicyTargetTrackingScalingPolicyConfigurationPropertyValidator)(properties.targetTrackingScalingPolicyConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnScalingPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnScalingPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScalingPolicyPropsValidator(properties).assertSuccess();
  return {
    "PolicyName": cdk.stringToCloudFormation(properties.policyName),
    "PolicyType": cdk.stringToCloudFormation(properties.policyType),
    "ResourceId": cdk.stringToCloudFormation(properties.resourceId),
    "ScalableDimension": cdk.stringToCloudFormation(properties.scalableDimension),
    "ScalingTargetId": cdk.stringToCloudFormation(properties.scalingTargetId),
    "ServiceNamespace": cdk.stringToCloudFormation(properties.serviceNamespace),
    "StepScalingPolicyConfiguration": convertCfnScalingPolicyStepScalingPolicyConfigurationPropertyToCloudFormation(properties.stepScalingPolicyConfiguration),
    "TargetTrackingScalingPolicyConfiguration": convertCfnScalingPolicyTargetTrackingScalingPolicyConfigurationPropertyToCloudFormation(properties.targetTrackingScalingPolicyConfiguration)
  };
}

// @ts-ignore TS6133
function CfnScalingPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScalingPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScalingPolicyProps>();
  ret.addPropertyResult("policyName", "PolicyName", (properties.PolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyName) : undefined));
  ret.addPropertyResult("policyType", "PolicyType", (properties.PolicyType != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyType) : undefined));
  ret.addPropertyResult("resourceId", "ResourceId", (properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined));
  ret.addPropertyResult("scalableDimension", "ScalableDimension", (properties.ScalableDimension != null ? cfn_parse.FromCloudFormation.getString(properties.ScalableDimension) : undefined));
  ret.addPropertyResult("scalingTargetId", "ScalingTargetId", (properties.ScalingTargetId != null ? cfn_parse.FromCloudFormation.getString(properties.ScalingTargetId) : undefined));
  ret.addPropertyResult("serviceNamespace", "ServiceNamespace", (properties.ServiceNamespace != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceNamespace) : undefined));
  ret.addPropertyResult("stepScalingPolicyConfiguration", "StepScalingPolicyConfiguration", (properties.StepScalingPolicyConfiguration != null ? CfnScalingPolicyStepScalingPolicyConfigurationPropertyFromCloudFormation(properties.StepScalingPolicyConfiguration) : undefined));
  ret.addPropertyResult("targetTrackingScalingPolicyConfiguration", "TargetTrackingScalingPolicyConfiguration", (properties.TargetTrackingScalingPolicyConfiguration != null ? CfnScalingPolicyTargetTrackingScalingPolicyConfigurationPropertyFromCloudFormation(properties.TargetTrackingScalingPolicyConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}