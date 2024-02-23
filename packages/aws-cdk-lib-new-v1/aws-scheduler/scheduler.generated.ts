/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * A *schedule* is the main resource you create, configure, and manage using Amazon EventBridge Scheduler.
 *
 * Every schedule has a *schedule expression* that determines when, and with what frequency, the schedule runs. EventBridge Scheduler supports three types of schedules: rate, cron, and one-time schedules. For more information about different schedule types, see [Schedule types](https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html) in the *EventBridge Scheduler User Guide* .
 *
 * When you create a schedule, you configure a target for the schedule to invoke. A target is an API operation that EventBridge Scheduler calls on your behalf every time your schedule runs. EventBridge Scheduler supports two types of targets: *templated* targets invoke common API operations across a core groups of services, and customizeable *universal* targets that you can use to call more than 6,000 operations across over 270 services. For more information about configuring targets, see [Managing targets](https://docs.aws.amazon.com/scheduler/latest/UserGuide/managing-targets.html) in the *EventBridge Scheduler User Guide* .
 *
 * For more information about managing schedules, changing the schedule state, setting up flexible time windows, and configuring a dead-letter queue for a schedule, see [Managing a schedule](https://docs.aws.amazon.com/scheduler/latest/UserGuide/managing-schedule.html) in the *EventBridge Scheduler User Guide* .
 *
 * @cloudformationResource AWS::Scheduler::Schedule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html
 */
export class CfnSchedule extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Scheduler::Schedule";

  /**
   * Build a CfnSchedule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSchedule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSchedulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSchedule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) for the Amazon EventBridge Scheduler schedule.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The description you specify for the schedule.
   */
  public description?: string;

  /**
   * The date, in UTC, before which the schedule can invoke its target.
   */
  public endDate?: string;

  /**
   * Allows you to configure a time window during which EventBridge Scheduler invokes the schedule.
   */
  public flexibleTimeWindow: CfnSchedule.FlexibleTimeWindowProperty | cdk.IResolvable;

  /**
   * The name of the schedule group associated with this schedule.
   */
  public groupName?: string;

  /**
   * The Amazon Resource Name (ARN) for the customer managed KMS key that EventBridge Scheduler will use to encrypt and decrypt your data.
   */
  public kmsKeyArn?: string;

  /**
   * The name of the schedule.
   */
  public name?: string;

  /**
   * The expression that defines when the schedule runs. The following formats are supported.
   */
  public scheduleExpression: string;

  /**
   * The timezone in which the scheduling expression is evaluated.
   */
  public scheduleExpressionTimezone?: string;

  /**
   * The date, in UTC, after which the schedule can begin invoking its target.
   */
  public startDate?: string;

  /**
   * Specifies whether the schedule is enabled or disabled.
   */
  public state?: string;

  /**
   * The schedule's target details.
   */
  public target: cdk.IResolvable | CfnSchedule.TargetProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnScheduleProps) {
    super(scope, id, {
      "type": CfnSchedule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "flexibleTimeWindow", this);
    cdk.requireProperty(props, "scheduleExpression", this);
    cdk.requireProperty(props, "target", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.endDate = props.endDate;
    this.flexibleTimeWindow = props.flexibleTimeWindow;
    this.groupName = props.groupName;
    this.kmsKeyArn = props.kmsKeyArn;
    this.name = props.name;
    this.scheduleExpression = props.scheduleExpression;
    this.scheduleExpressionTimezone = props.scheduleExpressionTimezone;
    this.startDate = props.startDate;
    this.state = props.state;
    this.target = props.target;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "endDate": this.endDate,
      "flexibleTimeWindow": this.flexibleTimeWindow,
      "groupName": this.groupName,
      "kmsKeyArn": this.kmsKeyArn,
      "name": this.name,
      "scheduleExpression": this.scheduleExpression,
      "scheduleExpressionTimezone": this.scheduleExpressionTimezone,
      "startDate": this.startDate,
      "state": this.state,
      "target": this.target
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSchedule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSchedulePropsToCloudFormation(props);
  }
}

export namespace CfnSchedule {
  /**
   * The schedule's target.
   *
   * EventBridge Scheduler supports templated target that invoke common API operations, as well as universal targets that you can customize to invoke over 6,000 API operations across more than 270 services. You can only specify one templated or universal target for a schedule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html
   */
  export interface TargetProperty {
    /**
     * The Amazon Resource Name (ARN) of the target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-arn
     */
    readonly arn: string;

    /**
     * An object that contains information about an Amazon SQS queue that EventBridge Scheduler uses as a dead-letter queue for your schedule.
     *
     * If specified, EventBridge Scheduler delivers failed events that could not be successfully delivered to a target to the queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-deadletterconfig
     */
    readonly deadLetterConfig?: CfnSchedule.DeadLetterConfigProperty | cdk.IResolvable;

    /**
     * The templated target type for the Amazon ECS [`RunTask`](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RunTask.html) API operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-ecsparameters
     */
    readonly ecsParameters?: CfnSchedule.EcsParametersProperty | cdk.IResolvable;

    /**
     * The templated target type for the EventBridge [`PutEvents`](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html) API operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-eventbridgeparameters
     */
    readonly eventBridgeParameters?: CfnSchedule.EventBridgeParametersProperty | cdk.IResolvable;

    /**
     * The text, or well-formed JSON, passed to the target.
     *
     * If you are configuring a templated Lambda , AWS Step Functions , or Amazon EventBridge target, the input must be a well-formed JSON. For all other target types, a JSON is not required. If you do not specify anything for this field, Amazon EventBridge Scheduler delivers a default notification to the target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-input
     */
    readonly input?: string;

    /**
     * The templated target type for the Amazon Kinesis [`PutRecord`](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_PutRecord.html) API operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-kinesisparameters
     */
    readonly kinesisParameters?: cdk.IResolvable | CfnSchedule.KinesisParametersProperty;

    /**
     * A `RetryPolicy` object that includes information about the retry policy settings, including the maximum age of an event, and the maximum number of times EventBridge Scheduler will try to deliver the event to a target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-retrypolicy
     */
    readonly retryPolicy?: cdk.IResolvable | CfnSchedule.RetryPolicyProperty;

    /**
     * The Amazon Resource Name (ARN) of the IAM role that EventBridge Scheduler will use for this target when the schedule is invoked.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-rolearn
     */
    readonly roleArn: string;

    /**
     * The templated target type for the Amazon SageMaker [`StartPipelineExecution`](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_StartPipelineExecution.html) API operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-sagemakerpipelineparameters
     */
    readonly sageMakerPipelineParameters?: cdk.IResolvable | CfnSchedule.SageMakerPipelineParametersProperty;

    /**
     * The templated target type for the Amazon SQS [`SendMessage`](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html) API operation. Contains the message group ID to use when the target is a FIFO queue. If you specify an Amazon SQS FIFO queue as a target, the queue must have content-based deduplication enabled. For more information, see [Using the Amazon SQS message deduplication ID](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/using-messagededuplicationid-property.html) in the *Amazon SQS Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-sqsparameters
     */
    readonly sqsParameters?: cdk.IResolvable | CfnSchedule.SqsParametersProperty;
  }

  /**
   * The templated target type for the Amazon SQS [`SendMessage`](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html) API operation. Contains the message group ID to use when the target is a FIFO queue. If you specify an Amazon SQS FIFO queue as a target, the queue must have content-based deduplication enabled. For more information, see [Using the Amazon SQS message deduplication ID](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/using-messagededuplicationid-property.html) in the *Amazon SQS Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sqsparameters.html
   */
  export interface SqsParametersProperty {
    /**
     * The FIFO message group ID to use as the target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sqsparameters.html#cfn-scheduler-schedule-sqsparameters-messagegroupid
     */
    readonly messageGroupId?: string;
  }

  /**
   * An object that contains information about an Amazon SQS queue that EventBridge Scheduler uses as a dead-letter queue for your schedule.
   *
   * If specified, EventBridge Scheduler delivers failed events that could not be successfully delivered to a target to the queue.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-deadletterconfig.html
   */
  export interface DeadLetterConfigProperty {
    /**
     * The Amazon Resource Name (ARN) of the SQS queue specified as the destination for the dead-letter queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-deadletterconfig.html#cfn-scheduler-schedule-deadletterconfig-arn
     */
    readonly arn?: string;
  }

  /**
   * The templated target type for the Amazon ECS [`RunTask`](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RunTask.html) API operation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html
   */
  export interface EcsParametersProperty {
    /**
     * The capacity provider strategy to use for the task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-capacityproviderstrategy
     */
    readonly capacityProviderStrategy?: Array<CfnSchedule.CapacityProviderStrategyItemProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies whether to enable Amazon ECS managed tags for the task.
     *
     * For more information, see [Tagging Your Amazon ECS Resources](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-using-tags.html) in the *Amazon ECS Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-enableecsmanagedtags
     */
    readonly enableEcsManagedTags?: boolean | cdk.IResolvable;

    /**
     * Whether or not to enable the execute command functionality for the containers in this task.
     *
     * If true, this enables execute command functionality on all containers in the task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-enableexecutecommand
     */
    readonly enableExecuteCommand?: boolean | cdk.IResolvable;

    /**
     * Specifies an Amazon ECS task group for the task.
     *
     * The maximum length is 255 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-group
     */
    readonly group?: string;

    /**
     * Specifies the launch type on which your task is running.
     *
     * The launch type that you specify here must match one of the launch type (compatibilities) of the target task. The `FARGATE` value is supported only in the Regions where Fargate with Amazon ECS is supported. For more information, see [AWS Fargate on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html) in the *Amazon ECS Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-launchtype
     */
    readonly launchType?: string;

    /**
     * This structure specifies the network configuration for an ECS task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-networkconfiguration
     */
    readonly networkConfiguration?: cdk.IResolvable | CfnSchedule.NetworkConfigurationProperty;

    /**
     * An array of placement constraint objects to use for the task.
     *
     * You can specify up to 10 constraints per task (including constraints in the task definition and those specified at runtime).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-placementconstraints
     */
    readonly placementConstraints?: Array<cdk.IResolvable | CfnSchedule.PlacementConstraintProperty> | cdk.IResolvable;

    /**
     * The task placement strategy for a task or service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-placementstrategy
     */
    readonly placementStrategy?: Array<cdk.IResolvable | CfnSchedule.PlacementStrategyProperty> | cdk.IResolvable;

    /**
     * Specifies the platform version for the task.
     *
     * Specify only the numeric portion of the platform version, such as `1.1.0` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-platformversion
     */
    readonly platformVersion?: string;

    /**
     * Specifies whether to propagate the tags from the task definition to the task.
     *
     * If no value is specified, the tags are not propagated. Tags can only be propagated to the task during task creation. To add tags to a task after task creation, use the Amazon ECS [`TagResource`](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_TagResource.html) API action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-propagatetags
     */
    readonly propagateTags?: string;

    /**
     * The reference ID to use for the task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-referenceid
     */
    readonly referenceId?: string;

    /**
     * The metadata that you apply to the task to help you categorize and organize them.
     *
     * Each tag consists of a key and an optional value, both of which you define. For more information, see [`RunTask`](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RunTask.html) in the *Amazon ECS API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-tags
     */
    readonly tags?: any;

    /**
     * The number of tasks to create based on `TaskDefinition` .
     *
     * The default is `1` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-taskcount
     */
    readonly taskCount?: number;

    /**
     * The Amazon Resource Name (ARN) of the task definition to use if the event target is an Amazon ECS task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-taskdefinitionarn
     */
    readonly taskDefinitionArn: string;
  }

  /**
   * An object representing a constraint on task placement.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-placementconstraint.html
   */
  export interface PlacementConstraintProperty {
    /**
     * A cluster query language expression to apply to the constraint.
     *
     * You cannot specify an expression if the constraint type is `distinctInstance` . For more information, see [Cluster query language](https://docs.aws.amazon.com/latest/developerguide/cluster-query-language.html) in the *Amazon ECS Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-placementconstraint.html#cfn-scheduler-schedule-placementconstraint-expression
     */
    readonly expression?: string;

    /**
     * The type of constraint.
     *
     * Use `distinctInstance` to ensure that each task in a particular group is running on a different container instance. Use `memberOf` to restrict the selection to a group of valid candidates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-placementconstraint.html#cfn-scheduler-schedule-placementconstraint-type
     */
    readonly type?: string;
  }

  /**
   * The task placement strategy for a task or service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-placementstrategy.html
   */
  export interface PlacementStrategyProperty {
    /**
     * The field to apply the placement strategy against.
     *
     * For the spread placement strategy, valid values are `instanceId` (or `instanceId` , which has the same effect), or any platform or custom attribute that is applied to a container instance, such as `attribute:ecs.availability-zone` . For the binpack placement strategy, valid values are `cpu` and `memory` . For the random placement strategy, this field is not used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-placementstrategy.html#cfn-scheduler-schedule-placementstrategy-field
     */
    readonly field?: string;

    /**
     * The type of placement strategy.
     *
     * The random placement strategy randomly places tasks on available candidates. The spread placement strategy spreads placement across available candidates evenly based on the field parameter. The binpack strategy places tasks on available candidates that have the least available amount of the resource that is specified with the field parameter. For example, if you binpack on memory, a task is placed on the instance with the least amount of remaining memory (but still enough to run the task).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-placementstrategy.html#cfn-scheduler-schedule-placementstrategy-type
     */
    readonly type?: string;
  }

  /**
   * The details of a capacity provider strategy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-capacityproviderstrategyitem.html
   */
  export interface CapacityProviderStrategyItemProperty {
    /**
     * The base value designates how many tasks, at a minimum, to run on the specified capacity provider.
     *
     * Only one capacity provider in a capacity provider strategy can have a base defined. If no value is specified, the default value of `0` is used.
     *
     * @default - 0
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-capacityproviderstrategyitem.html#cfn-scheduler-schedule-capacityproviderstrategyitem-base
     */
    readonly base?: number;

    /**
     * The short name of the capacity provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-capacityproviderstrategyitem.html#cfn-scheduler-schedule-capacityproviderstrategyitem-capacityprovider
     */
    readonly capacityProvider: string;

    /**
     * The weight value designates the relative percentage of the total number of tasks launched that should use the specified capacity provider.
     *
     * The weight value is taken into consideration after the base value, if defined, is satisfied.
     *
     * @default - 0
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-capacityproviderstrategyitem.html#cfn-scheduler-schedule-capacityproviderstrategyitem-weight
     */
    readonly weight?: number;
  }

  /**
   * Specifies the network configuration for an ECS task.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-networkconfiguration.html
   */
  export interface NetworkConfigurationProperty {
    /**
     * Specifies the Amazon VPC subnets and security groups for the task, and whether a public IP address is to be used.
     *
     * This structure is relevant only for ECS tasks that use the awsvpc network mode.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-networkconfiguration.html#cfn-scheduler-schedule-networkconfiguration-awsvpcconfiguration
     */
    readonly awsvpcConfiguration?: CfnSchedule.AwsVpcConfigurationProperty | cdk.IResolvable;
  }

  /**
   * This structure specifies the VPC subnets and security groups for the task, and whether a public IP address is to be used.
   *
   * This structure is relevant only for ECS tasks that use the awsvpc network mode.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-awsvpcconfiguration.html
   */
  export interface AwsVpcConfigurationProperty {
    /**
     * Specifies whether the task's elastic network interface receives a public IP address.
     *
     * You can specify `ENABLED` only when `LaunchType` in `EcsParameters` is set to `FARGATE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-awsvpcconfiguration.html#cfn-scheduler-schedule-awsvpcconfiguration-assignpublicip
     */
    readonly assignPublicIp?: string;

    /**
     * Specifies the security groups associated with the task.
     *
     * These security groups must all be in the same VPC. You can specify as many as five security groups. If you do not specify a security group, the default security group for the VPC is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-awsvpcconfiguration.html#cfn-scheduler-schedule-awsvpcconfiguration-securitygroups
     */
    readonly securityGroups?: Array<string>;

    /**
     * Specifies the subnets associated with the task.
     *
     * These subnets must all be in the same VPC. You can specify as many as 16 subnets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-awsvpcconfiguration.html#cfn-scheduler-schedule-awsvpcconfiguration-subnets
     */
    readonly subnets: Array<string>;
  }

  /**
   * The templated target type for the EventBridge [`PutEvents`](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html) API operation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-eventbridgeparameters.html
   */
  export interface EventBridgeParametersProperty {
    /**
     * A free-form string, with a maximum of 128 characters, used to decide what fields to expect in the event detail.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-eventbridgeparameters.html#cfn-scheduler-schedule-eventbridgeparameters-detailtype
     */
    readonly detailType: string;

    /**
     * The source of the event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-eventbridgeparameters.html#cfn-scheduler-schedule-eventbridgeparameters-source
     */
    readonly source: string;
  }

  /**
   * The templated target type for the Amazon Kinesis [`PutRecord`](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_PutRecord.html) API operation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-kinesisparameters.html
   */
  export interface KinesisParametersProperty {
    /**
     * Specifies the shard to which EventBridge Scheduler sends the event.
     *
     * For more information, see [Amazon Kinesis Data Streams terminology and concepts](https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html) in the *Amazon Kinesis Streams Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-kinesisparameters.html#cfn-scheduler-schedule-kinesisparameters-partitionkey
     */
    readonly partitionKey: string;
  }

  /**
   * The templated target type for the Amazon SageMaker [`StartPipelineExecution`](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_StartPipelineExecution.html) API operation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sagemakerpipelineparameters.html
   */
  export interface SageMakerPipelineParametersProperty {
    /**
     * List of parameter names and values to use when executing the SageMaker Model Building Pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sagemakerpipelineparameters.html#cfn-scheduler-schedule-sagemakerpipelineparameters-pipelineparameterlist
     */
    readonly pipelineParameterList?: Array<cdk.IResolvable | CfnSchedule.SageMakerPipelineParameterProperty> | cdk.IResolvable;
  }

  /**
   * The name and value pair of a parameter to use to start execution of a SageMaker Model Building Pipeline.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sagemakerpipelineparameter.html
   */
  export interface SageMakerPipelineParameterProperty {
    /**
     * Name of parameter to start execution of a SageMaker Model Building Pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sagemakerpipelineparameter.html#cfn-scheduler-schedule-sagemakerpipelineparameter-name
     */
    readonly name: string;

    /**
     * Value of parameter to start execution of a SageMaker Model Building Pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sagemakerpipelineparameter.html#cfn-scheduler-schedule-sagemakerpipelineparameter-value
     */
    readonly value: string;
  }

  /**
   * A `RetryPolicy` object that includes information about the retry policy settings, including the maximum age of an event, and the maximum number of times EventBridge Scheduler will try to deliver the event to a target.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-retrypolicy.html
   */
  export interface RetryPolicyProperty {
    /**
     * The maximum amount of time, in seconds, to continue to make retry attempts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-retrypolicy.html#cfn-scheduler-schedule-retrypolicy-maximumeventageinseconds
     */
    readonly maximumEventAgeInSeconds?: number;

    /**
     * The maximum number of retry attempts to make before the request fails.
     *
     * Retry attempts with exponential backoff continue until either the maximum number of attempts is made or until the duration of the `MaximumEventAgeInSeconds` is reached.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-retrypolicy.html#cfn-scheduler-schedule-retrypolicy-maximumretryattempts
     */
    readonly maximumRetryAttempts?: number;
  }

  /**
   * Allows you to configure a time window during which EventBridge Scheduler invokes the schedule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-flexibletimewindow.html
   */
  export interface FlexibleTimeWindowProperty {
    /**
     * The maximum time window during which a schedule can be invoked.
     *
     * *Minimum* : `1`
     *
     * *Maximum* : `1440`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-flexibletimewindow.html#cfn-scheduler-schedule-flexibletimewindow-maximumwindowinminutes
     */
    readonly maximumWindowInMinutes?: number;

    /**
     * Determines whether the schedule is invoked within a flexible time window.
     *
     * You must use quotation marks when you specify this value in your JSON or YAML template.
     *
     * *Allowed Values* : `"OFF"` | `"FLEXIBLE"`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-flexibletimewindow.html#cfn-scheduler-schedule-flexibletimewindow-mode
     */
    readonly mode: string;
  }
}

/**
 * Properties for defining a `CfnSchedule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html
 */
export interface CfnScheduleProps {
  /**
   * The description you specify for the schedule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-description
   */
  readonly description?: string;

  /**
   * The date, in UTC, before which the schedule can invoke its target.
   *
   * Depending on the schedule's recurrence expression, invocations might stop on, or before, the `EndDate` you specify.
   * EventBridge Scheduler ignores `EndDate` for one-time schedules.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-enddate
   */
  readonly endDate?: string;

  /**
   * Allows you to configure a time window during which EventBridge Scheduler invokes the schedule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-flexibletimewindow
   */
  readonly flexibleTimeWindow: CfnSchedule.FlexibleTimeWindowProperty | cdk.IResolvable;

  /**
   * The name of the schedule group associated with this schedule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-groupname
   */
  readonly groupName?: string;

  /**
   * The Amazon Resource Name (ARN) for the customer managed KMS key that EventBridge Scheduler will use to encrypt and decrypt your data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-kmskeyarn
   */
  readonly kmsKeyArn?: string;

  /**
   * The name of the schedule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-name
   */
  readonly name?: string;

  /**
   * The expression that defines when the schedule runs. The following formats are supported.
   *
   * - `at` expression - `at(yyyy-mm-ddThh:mm:ss)`
   * - `rate` expression - `rate(value unit)`
   * - `cron` expression - `cron(fields)`
   *
   * You can use `at` expressions to create one-time schedules that invoke a target once, at the time and in the time zone, that you specify. You can use `rate` and `cron` expressions to create recurring schedules. Rate-based schedules are useful when you want to invoke a target at regular intervals, such as every 15 minutes or every five days. Cron-based schedules are useful when you want to invoke a target periodically at a specific time, such as at 8:00 am (UTC+0) every 1st day of the month.
   *
   * A `cron` expression consists of six fields separated by white spaces: `(minutes hours day_of_month month day_of_week year)` .
   *
   * A `rate` expression consists of a *value* as a positive integer, and a *unit* with the following options: `minute` | `minutes` | `hour` | `hours` | `day` | `days`
   *
   * For more information and examples, see [Schedule types on EventBridge Scheduler](https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html) in the *EventBridge Scheduler User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-scheduleexpression
   */
  readonly scheduleExpression: string;

  /**
   * The timezone in which the scheduling expression is evaluated.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-scheduleexpressiontimezone
   */
  readonly scheduleExpressionTimezone?: string;

  /**
   * The date, in UTC, after which the schedule can begin invoking its target.
   *
   * Depending on the schedule's recurrence expression, invocations might occur on, or after, the `StartDate` you specify.
   * EventBridge Scheduler ignores `StartDate` for one-time schedules.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-startdate
   */
  readonly startDate?: string;

  /**
   * Specifies whether the schedule is enabled or disabled.
   *
   * *Allowed Values* : `ENABLED` | `DISABLED`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-state
   */
  readonly state?: string;

  /**
   * The schedule's target details.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-target
   */
  readonly target: cdk.IResolvable | CfnSchedule.TargetProperty;
}

/**
 * Determine whether the given properties match those of a `SqsParametersProperty`
 *
 * @param properties - the TypeScript properties of a `SqsParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduleSqsParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("messageGroupId", cdk.validateString)(properties.messageGroupId));
  return errors.wrap("supplied properties not correct for \"SqsParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduleSqsParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduleSqsParametersPropertyValidator(properties).assertSuccess();
  return {
    "MessageGroupId": cdk.stringToCloudFormation(properties.messageGroupId)
  };
}

// @ts-ignore TS6133
function CfnScheduleSqsParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSchedule.SqsParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.SqsParametersProperty>();
  ret.addPropertyResult("messageGroupId", "MessageGroupId", (properties.MessageGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.MessageGroupId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeadLetterConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DeadLetterConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduleDeadLetterConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  return errors.wrap("supplied properties not correct for \"DeadLetterConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduleDeadLetterConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduleDeadLetterConfigPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn)
  };
}

// @ts-ignore TS6133
function CfnScheduleDeadLetterConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.DeadLetterConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.DeadLetterConfigProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PlacementConstraintProperty`
 *
 * @param properties - the TypeScript properties of a `PlacementConstraintProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchedulePlacementConstraintPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("expression", cdk.validateString)(properties.expression));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"PlacementConstraintProperty\"");
}

// @ts-ignore TS6133
function convertCfnSchedulePlacementConstraintPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchedulePlacementConstraintPropertyValidator(properties).assertSuccess();
  return {
    "Expression": cdk.stringToCloudFormation(properties.expression),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnSchedulePlacementConstraintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSchedule.PlacementConstraintProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.PlacementConstraintProperty>();
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PlacementStrategyProperty`
 *
 * @param properties - the TypeScript properties of a `PlacementStrategyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchedulePlacementStrategyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("field", cdk.validateString)(properties.field));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"PlacementStrategyProperty\"");
}

// @ts-ignore TS6133
function convertCfnSchedulePlacementStrategyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchedulePlacementStrategyPropertyValidator(properties).assertSuccess();
  return {
    "Field": cdk.stringToCloudFormation(properties.field),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnSchedulePlacementStrategyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSchedule.PlacementStrategyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.PlacementStrategyProperty>();
  ret.addPropertyResult("field", "Field", (properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CapacityProviderStrategyItemProperty`
 *
 * @param properties - the TypeScript properties of a `CapacityProviderStrategyItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduleCapacityProviderStrategyItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("base", cdk.validateNumber)(properties.base));
  errors.collect(cdk.propertyValidator("capacityProvider", cdk.requiredValidator)(properties.capacityProvider));
  errors.collect(cdk.propertyValidator("capacityProvider", cdk.validateString)(properties.capacityProvider));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"CapacityProviderStrategyItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduleCapacityProviderStrategyItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduleCapacityProviderStrategyItemPropertyValidator(properties).assertSuccess();
  return {
    "Base": cdk.numberToCloudFormation(properties.base),
    "CapacityProvider": cdk.stringToCloudFormation(properties.capacityProvider),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnScheduleCapacityProviderStrategyItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.CapacityProviderStrategyItemProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.CapacityProviderStrategyItemProperty>();
  ret.addPropertyResult("base", "Base", (properties.Base != null ? cfn_parse.FromCloudFormation.getNumber(properties.Base) : undefined));
  ret.addPropertyResult("capacityProvider", "CapacityProvider", (properties.CapacityProvider != null ? cfn_parse.FromCloudFormation.getString(properties.CapacityProvider) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AwsVpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AwsVpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduleAwsVpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assignPublicIp", cdk.validateString)(properties.assignPublicIp));
  errors.collect(cdk.propertyValidator("securityGroups", cdk.listValidator(cdk.validateString))(properties.securityGroups));
  errors.collect(cdk.propertyValidator("subnets", cdk.requiredValidator)(properties.subnets));
  errors.collect(cdk.propertyValidator("subnets", cdk.listValidator(cdk.validateString))(properties.subnets));
  return errors.wrap("supplied properties not correct for \"AwsVpcConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduleAwsVpcConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduleAwsVpcConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AssignPublicIp": cdk.stringToCloudFormation(properties.assignPublicIp),
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets)
  };
}

// @ts-ignore TS6133
function CfnScheduleAwsVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.AwsVpcConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.AwsVpcConfigurationProperty>();
  ret.addPropertyResult("assignPublicIp", "AssignPublicIp", (properties.AssignPublicIp != null ? cfn_parse.FromCloudFormation.getString(properties.AssignPublicIp) : undefined));
  ret.addPropertyResult("securityGroups", "SecurityGroups", (properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroups) : undefined));
  ret.addPropertyResult("subnets", "Subnets", (properties.Subnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subnets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduleNetworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsvpcConfiguration", CfnScheduleAwsVpcConfigurationPropertyValidator)(properties.awsvpcConfiguration));
  return errors.wrap("supplied properties not correct for \"NetworkConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduleNetworkConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduleNetworkConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AwsvpcConfiguration": convertCfnScheduleAwsVpcConfigurationPropertyToCloudFormation(properties.awsvpcConfiguration)
  };
}

// @ts-ignore TS6133
function CfnScheduleNetworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSchedule.NetworkConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.NetworkConfigurationProperty>();
  ret.addPropertyResult("awsvpcConfiguration", "AwsvpcConfiguration", (properties.AwsvpcConfiguration != null ? CfnScheduleAwsVpcConfigurationPropertyFromCloudFormation(properties.AwsvpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EcsParametersProperty`
 *
 * @param properties - the TypeScript properties of a `EcsParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduleEcsParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capacityProviderStrategy", cdk.listValidator(CfnScheduleCapacityProviderStrategyItemPropertyValidator))(properties.capacityProviderStrategy));
  errors.collect(cdk.propertyValidator("enableEcsManagedTags", cdk.validateBoolean)(properties.enableEcsManagedTags));
  errors.collect(cdk.propertyValidator("enableExecuteCommand", cdk.validateBoolean)(properties.enableExecuteCommand));
  errors.collect(cdk.propertyValidator("group", cdk.validateString)(properties.group));
  errors.collect(cdk.propertyValidator("launchType", cdk.validateString)(properties.launchType));
  errors.collect(cdk.propertyValidator("networkConfiguration", CfnScheduleNetworkConfigurationPropertyValidator)(properties.networkConfiguration));
  errors.collect(cdk.propertyValidator("placementConstraints", cdk.listValidator(CfnSchedulePlacementConstraintPropertyValidator))(properties.placementConstraints));
  errors.collect(cdk.propertyValidator("placementStrategy", cdk.listValidator(CfnSchedulePlacementStrategyPropertyValidator))(properties.placementStrategy));
  errors.collect(cdk.propertyValidator("platformVersion", cdk.validateString)(properties.platformVersion));
  errors.collect(cdk.propertyValidator("propagateTags", cdk.validateString)(properties.propagateTags));
  errors.collect(cdk.propertyValidator("referenceId", cdk.validateString)(properties.referenceId));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  errors.collect(cdk.propertyValidator("taskCount", cdk.validateNumber)(properties.taskCount));
  errors.collect(cdk.propertyValidator("taskDefinitionArn", cdk.requiredValidator)(properties.taskDefinitionArn));
  errors.collect(cdk.propertyValidator("taskDefinitionArn", cdk.validateString)(properties.taskDefinitionArn));
  return errors.wrap("supplied properties not correct for \"EcsParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduleEcsParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduleEcsParametersPropertyValidator(properties).assertSuccess();
  return {
    "CapacityProviderStrategy": cdk.listMapper(convertCfnScheduleCapacityProviderStrategyItemPropertyToCloudFormation)(properties.capacityProviderStrategy),
    "EnableECSManagedTags": cdk.booleanToCloudFormation(properties.enableEcsManagedTags),
    "EnableExecuteCommand": cdk.booleanToCloudFormation(properties.enableExecuteCommand),
    "Group": cdk.stringToCloudFormation(properties.group),
    "LaunchType": cdk.stringToCloudFormation(properties.launchType),
    "NetworkConfiguration": convertCfnScheduleNetworkConfigurationPropertyToCloudFormation(properties.networkConfiguration),
    "PlacementConstraints": cdk.listMapper(convertCfnSchedulePlacementConstraintPropertyToCloudFormation)(properties.placementConstraints),
    "PlacementStrategy": cdk.listMapper(convertCfnSchedulePlacementStrategyPropertyToCloudFormation)(properties.placementStrategy),
    "PlatformVersion": cdk.stringToCloudFormation(properties.platformVersion),
    "PropagateTags": cdk.stringToCloudFormation(properties.propagateTags),
    "ReferenceId": cdk.stringToCloudFormation(properties.referenceId),
    "Tags": cdk.objectToCloudFormation(properties.tags),
    "TaskCount": cdk.numberToCloudFormation(properties.taskCount),
    "TaskDefinitionArn": cdk.stringToCloudFormation(properties.taskDefinitionArn)
  };
}

// @ts-ignore TS6133
function CfnScheduleEcsParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.EcsParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.EcsParametersProperty>();
  ret.addPropertyResult("capacityProviderStrategy", "CapacityProviderStrategy", (properties.CapacityProviderStrategy != null ? cfn_parse.FromCloudFormation.getArray(CfnScheduleCapacityProviderStrategyItemPropertyFromCloudFormation)(properties.CapacityProviderStrategy) : undefined));
  ret.addPropertyResult("enableEcsManagedTags", "EnableECSManagedTags", (properties.EnableECSManagedTags != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableECSManagedTags) : undefined));
  ret.addPropertyResult("enableExecuteCommand", "EnableExecuteCommand", (properties.EnableExecuteCommand != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableExecuteCommand) : undefined));
  ret.addPropertyResult("group", "Group", (properties.Group != null ? cfn_parse.FromCloudFormation.getString(properties.Group) : undefined));
  ret.addPropertyResult("launchType", "LaunchType", (properties.LaunchType != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchType) : undefined));
  ret.addPropertyResult("networkConfiguration", "NetworkConfiguration", (properties.NetworkConfiguration != null ? CfnScheduleNetworkConfigurationPropertyFromCloudFormation(properties.NetworkConfiguration) : undefined));
  ret.addPropertyResult("placementConstraints", "PlacementConstraints", (properties.PlacementConstraints != null ? cfn_parse.FromCloudFormation.getArray(CfnSchedulePlacementConstraintPropertyFromCloudFormation)(properties.PlacementConstraints) : undefined));
  ret.addPropertyResult("placementStrategy", "PlacementStrategy", (properties.PlacementStrategy != null ? cfn_parse.FromCloudFormation.getArray(CfnSchedulePlacementStrategyPropertyFromCloudFormation)(properties.PlacementStrategy) : undefined));
  ret.addPropertyResult("platformVersion", "PlatformVersion", (properties.PlatformVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PlatformVersion) : undefined));
  ret.addPropertyResult("propagateTags", "PropagateTags", (properties.PropagateTags != null ? cfn_parse.FromCloudFormation.getString(properties.PropagateTags) : undefined));
  ret.addPropertyResult("referenceId", "ReferenceId", (properties.ReferenceId != null ? cfn_parse.FromCloudFormation.getString(properties.ReferenceId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addPropertyResult("taskCount", "TaskCount", (properties.TaskCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.TaskCount) : undefined));
  ret.addPropertyResult("taskDefinitionArn", "TaskDefinitionArn", (properties.TaskDefinitionArn != null ? cfn_parse.FromCloudFormation.getString(properties.TaskDefinitionArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventBridgeParametersProperty`
 *
 * @param properties - the TypeScript properties of a `EventBridgeParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduleEventBridgeParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("detailType", cdk.requiredValidator)(properties.detailType));
  errors.collect(cdk.propertyValidator("detailType", cdk.validateString)(properties.detailType));
  errors.collect(cdk.propertyValidator("source", cdk.requiredValidator)(properties.source));
  errors.collect(cdk.propertyValidator("source", cdk.validateString)(properties.source));
  return errors.wrap("supplied properties not correct for \"EventBridgeParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduleEventBridgeParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduleEventBridgeParametersPropertyValidator(properties).assertSuccess();
  return {
    "DetailType": cdk.stringToCloudFormation(properties.detailType),
    "Source": cdk.stringToCloudFormation(properties.source)
  };
}

// @ts-ignore TS6133
function CfnScheduleEventBridgeParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.EventBridgeParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.EventBridgeParametersProperty>();
  ret.addPropertyResult("detailType", "DetailType", (properties.DetailType != null ? cfn_parse.FromCloudFormation.getString(properties.DetailType) : undefined));
  ret.addPropertyResult("source", "Source", (properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KinesisParametersProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduleKinesisParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("partitionKey", cdk.requiredValidator)(properties.partitionKey));
  errors.collect(cdk.propertyValidator("partitionKey", cdk.validateString)(properties.partitionKey));
  return errors.wrap("supplied properties not correct for \"KinesisParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduleKinesisParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduleKinesisParametersPropertyValidator(properties).assertSuccess();
  return {
    "PartitionKey": cdk.stringToCloudFormation(properties.partitionKey)
  };
}

// @ts-ignore TS6133
function CfnScheduleKinesisParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSchedule.KinesisParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.KinesisParametersProperty>();
  ret.addPropertyResult("partitionKey", "PartitionKey", (properties.PartitionKey != null ? cfn_parse.FromCloudFormation.getString(properties.PartitionKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SageMakerPipelineParameterProperty`
 *
 * @param properties - the TypeScript properties of a `SageMakerPipelineParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduleSageMakerPipelineParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"SageMakerPipelineParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduleSageMakerPipelineParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduleSageMakerPipelineParameterPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnScheduleSageMakerPipelineParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSchedule.SageMakerPipelineParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.SageMakerPipelineParameterProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SageMakerPipelineParametersProperty`
 *
 * @param properties - the TypeScript properties of a `SageMakerPipelineParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduleSageMakerPipelineParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("pipelineParameterList", cdk.listValidator(CfnScheduleSageMakerPipelineParameterPropertyValidator))(properties.pipelineParameterList));
  return errors.wrap("supplied properties not correct for \"SageMakerPipelineParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduleSageMakerPipelineParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduleSageMakerPipelineParametersPropertyValidator(properties).assertSuccess();
  return {
    "PipelineParameterList": cdk.listMapper(convertCfnScheduleSageMakerPipelineParameterPropertyToCloudFormation)(properties.pipelineParameterList)
  };
}

// @ts-ignore TS6133
function CfnScheduleSageMakerPipelineParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSchedule.SageMakerPipelineParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.SageMakerPipelineParametersProperty>();
  ret.addPropertyResult("pipelineParameterList", "PipelineParameterList", (properties.PipelineParameterList != null ? cfn_parse.FromCloudFormation.getArray(CfnScheduleSageMakerPipelineParameterPropertyFromCloudFormation)(properties.PipelineParameterList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RetryPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `RetryPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduleRetryPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maximumEventAgeInSeconds", cdk.validateNumber)(properties.maximumEventAgeInSeconds));
  errors.collect(cdk.propertyValidator("maximumRetryAttempts", cdk.validateNumber)(properties.maximumRetryAttempts));
  return errors.wrap("supplied properties not correct for \"RetryPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduleRetryPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduleRetryPolicyPropertyValidator(properties).assertSuccess();
  return {
    "MaximumEventAgeInSeconds": cdk.numberToCloudFormation(properties.maximumEventAgeInSeconds),
    "MaximumRetryAttempts": cdk.numberToCloudFormation(properties.maximumRetryAttempts)
  };
}

// @ts-ignore TS6133
function CfnScheduleRetryPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSchedule.RetryPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.RetryPolicyProperty>();
  ret.addPropertyResult("maximumEventAgeInSeconds", "MaximumEventAgeInSeconds", (properties.MaximumEventAgeInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumEventAgeInSeconds) : undefined));
  ret.addPropertyResult("maximumRetryAttempts", "MaximumRetryAttempts", (properties.MaximumRetryAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRetryAttempts) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetProperty`
 *
 * @param properties - the TypeScript properties of a `TargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduleTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.requiredValidator)(properties.arn));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("deadLetterConfig", CfnScheduleDeadLetterConfigPropertyValidator)(properties.deadLetterConfig));
  errors.collect(cdk.propertyValidator("ecsParameters", CfnScheduleEcsParametersPropertyValidator)(properties.ecsParameters));
  errors.collect(cdk.propertyValidator("eventBridgeParameters", CfnScheduleEventBridgeParametersPropertyValidator)(properties.eventBridgeParameters));
  errors.collect(cdk.propertyValidator("input", cdk.validateString)(properties.input));
  errors.collect(cdk.propertyValidator("kinesisParameters", CfnScheduleKinesisParametersPropertyValidator)(properties.kinesisParameters));
  errors.collect(cdk.propertyValidator("retryPolicy", CfnScheduleRetryPolicyPropertyValidator)(properties.retryPolicy));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("sageMakerPipelineParameters", CfnScheduleSageMakerPipelineParametersPropertyValidator)(properties.sageMakerPipelineParameters));
  errors.collect(cdk.propertyValidator("sqsParameters", CfnScheduleSqsParametersPropertyValidator)(properties.sqsParameters));
  return errors.wrap("supplied properties not correct for \"TargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduleTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduleTargetPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "DeadLetterConfig": convertCfnScheduleDeadLetterConfigPropertyToCloudFormation(properties.deadLetterConfig),
    "EcsParameters": convertCfnScheduleEcsParametersPropertyToCloudFormation(properties.ecsParameters),
    "EventBridgeParameters": convertCfnScheduleEventBridgeParametersPropertyToCloudFormation(properties.eventBridgeParameters),
    "Input": cdk.stringToCloudFormation(properties.input),
    "KinesisParameters": convertCfnScheduleKinesisParametersPropertyToCloudFormation(properties.kinesisParameters),
    "RetryPolicy": convertCfnScheduleRetryPolicyPropertyToCloudFormation(properties.retryPolicy),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SageMakerPipelineParameters": convertCfnScheduleSageMakerPipelineParametersPropertyToCloudFormation(properties.sageMakerPipelineParameters),
    "SqsParameters": convertCfnScheduleSqsParametersPropertyToCloudFormation(properties.sqsParameters)
  };
}

// @ts-ignore TS6133
function CfnScheduleTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSchedule.TargetProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.TargetProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addPropertyResult("deadLetterConfig", "DeadLetterConfig", (properties.DeadLetterConfig != null ? CfnScheduleDeadLetterConfigPropertyFromCloudFormation(properties.DeadLetterConfig) : undefined));
  ret.addPropertyResult("ecsParameters", "EcsParameters", (properties.EcsParameters != null ? CfnScheduleEcsParametersPropertyFromCloudFormation(properties.EcsParameters) : undefined));
  ret.addPropertyResult("eventBridgeParameters", "EventBridgeParameters", (properties.EventBridgeParameters != null ? CfnScheduleEventBridgeParametersPropertyFromCloudFormation(properties.EventBridgeParameters) : undefined));
  ret.addPropertyResult("input", "Input", (properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined));
  ret.addPropertyResult("kinesisParameters", "KinesisParameters", (properties.KinesisParameters != null ? CfnScheduleKinesisParametersPropertyFromCloudFormation(properties.KinesisParameters) : undefined));
  ret.addPropertyResult("retryPolicy", "RetryPolicy", (properties.RetryPolicy != null ? CfnScheduleRetryPolicyPropertyFromCloudFormation(properties.RetryPolicy) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("sageMakerPipelineParameters", "SageMakerPipelineParameters", (properties.SageMakerPipelineParameters != null ? CfnScheduleSageMakerPipelineParametersPropertyFromCloudFormation(properties.SageMakerPipelineParameters) : undefined));
  ret.addPropertyResult("sqsParameters", "SqsParameters", (properties.SqsParameters != null ? CfnScheduleSqsParametersPropertyFromCloudFormation(properties.SqsParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FlexibleTimeWindowProperty`
 *
 * @param properties - the TypeScript properties of a `FlexibleTimeWindowProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduleFlexibleTimeWindowPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maximumWindowInMinutes", cdk.validateNumber)(properties.maximumWindowInMinutes));
  errors.collect(cdk.propertyValidator("mode", cdk.requiredValidator)(properties.mode));
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  return errors.wrap("supplied properties not correct for \"FlexibleTimeWindowProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduleFlexibleTimeWindowPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduleFlexibleTimeWindowPropertyValidator(properties).assertSuccess();
  return {
    "MaximumWindowInMinutes": cdk.numberToCloudFormation(properties.maximumWindowInMinutes),
    "Mode": cdk.stringToCloudFormation(properties.mode)
  };
}

// @ts-ignore TS6133
function CfnScheduleFlexibleTimeWindowPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.FlexibleTimeWindowProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.FlexibleTimeWindowProperty>();
  ret.addPropertyResult("maximumWindowInMinutes", "MaximumWindowInMinutes", (properties.MaximumWindowInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumWindowInMinutes) : undefined));
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnScheduleProps`
 *
 * @param properties - the TypeScript properties of a `CfnScheduleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchedulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("endDate", cdk.validateString)(properties.endDate));
  errors.collect(cdk.propertyValidator("flexibleTimeWindow", cdk.requiredValidator)(properties.flexibleTimeWindow));
  errors.collect(cdk.propertyValidator("flexibleTimeWindow", CfnScheduleFlexibleTimeWindowPropertyValidator)(properties.flexibleTimeWindow));
  errors.collect(cdk.propertyValidator("groupName", cdk.validateString)(properties.groupName));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.requiredValidator)(properties.scheduleExpression));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.validateString)(properties.scheduleExpression));
  errors.collect(cdk.propertyValidator("scheduleExpressionTimezone", cdk.validateString)(properties.scheduleExpressionTimezone));
  errors.collect(cdk.propertyValidator("startDate", cdk.validateString)(properties.startDate));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  errors.collect(cdk.propertyValidator("target", cdk.requiredValidator)(properties.target));
  errors.collect(cdk.propertyValidator("target", CfnScheduleTargetPropertyValidator)(properties.target));
  return errors.wrap("supplied properties not correct for \"CfnScheduleProps\"");
}

// @ts-ignore TS6133
function convertCfnSchedulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchedulePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "EndDate": cdk.stringToCloudFormation(properties.endDate),
    "FlexibleTimeWindow": convertCfnScheduleFlexibleTimeWindowPropertyToCloudFormation(properties.flexibleTimeWindow),
    "GroupName": cdk.stringToCloudFormation(properties.groupName),
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ScheduleExpression": cdk.stringToCloudFormation(properties.scheduleExpression),
    "ScheduleExpressionTimezone": cdk.stringToCloudFormation(properties.scheduleExpressionTimezone),
    "StartDate": cdk.stringToCloudFormation(properties.startDate),
    "State": cdk.stringToCloudFormation(properties.state),
    "Target": convertCfnScheduleTargetPropertyToCloudFormation(properties.target)
  };
}

// @ts-ignore TS6133
function CfnSchedulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduleProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("endDate", "EndDate", (properties.EndDate != null ? cfn_parse.FromCloudFormation.getString(properties.EndDate) : undefined));
  ret.addPropertyResult("flexibleTimeWindow", "FlexibleTimeWindow", (properties.FlexibleTimeWindow != null ? CfnScheduleFlexibleTimeWindowPropertyFromCloudFormation(properties.FlexibleTimeWindow) : undefined));
  ret.addPropertyResult("groupName", "GroupName", (properties.GroupName != null ? cfn_parse.FromCloudFormation.getString(properties.GroupName) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("scheduleExpression", "ScheduleExpression", (properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined));
  ret.addPropertyResult("scheduleExpressionTimezone", "ScheduleExpressionTimezone", (properties.ScheduleExpressionTimezone != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpressionTimezone) : undefined));
  ret.addPropertyResult("startDate", "StartDate", (properties.StartDate != null ? cfn_parse.FromCloudFormation.getString(properties.StartDate) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? CfnScheduleTargetPropertyFromCloudFormation(properties.Target) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A *schedule group* is an Amazon EventBridge Scheduler resource you use to organize your schedules.
 *
 * Your AWS account comes with a `default` scheduler group. You associate a new schedule with the `default` group or with schedule groups that you create and manage. You can create up to [500 schedule groups](https://docs.aws.amazon.com/scheduler/latest/UserGuide/scheduler-quotas.html) in your AWS account. With EventBridge Scheduler, you apply [tags](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) to schedule groups, not to individual schedules to organize your resources.
 *
 * For more information about managing schedule groups, see [Managing a schedule group](https://docs.aws.amazon.com/scheduler/latest/UserGuide/managing-schedule-group.html) in the *EventBridge Scheduler User Guide* .
 *
 * @cloudformationResource AWS::Scheduler::ScheduleGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedulegroup.html
 */
export class CfnScheduleGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Scheduler::ScheduleGroup";

  /**
   * Build a CfnScheduleGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScheduleGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnScheduleGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnScheduleGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the schedule group.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The date and time at which the schedule group was created.
   *
   * @cloudformationAttribute CreationDate
   */
  public readonly attrCreationDate: string;

  /**
   * The time at which the schedule group was last modified.
   *
   * @cloudformationAttribute LastModificationDate
   */
  public readonly attrLastModificationDate: string;

  /**
   * Specifies the state of the schedule group.
   *
   * *Allowed Values* : `ACTIVE` | `DELETING`
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The name of the schedule group.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnScheduleGroupProps = {}) {
    super(scope, id, {
      "type": CfnScheduleGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationDate = cdk.Token.asString(this.getAtt("CreationDate", cdk.ResolutionTypeHint.STRING));
    this.attrLastModificationDate = cdk.Token.asString(this.getAtt("LastModificationDate", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Scheduler::ScheduleGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnScheduleGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnScheduleGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnScheduleGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedulegroup.html
 */
export interface CfnScheduleGroupProps {
  /**
   * The name of the schedule group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedulegroup.html#cfn-scheduler-schedulegroup-name
   */
  readonly name?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedulegroup.html#cfn-scheduler-schedulegroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnScheduleGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnScheduleGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduleGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnScheduleGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnScheduleGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduleGroupPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnScheduleGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduleGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduleGroupProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}