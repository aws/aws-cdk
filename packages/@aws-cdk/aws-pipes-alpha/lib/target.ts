import { CfnTag } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IInputTransformation } from '.';

/**
 * Target configuration.
 */
export interface ITarget {
  /**
   * The ARN of the target resource.
   */
  readonly targetArn: string;

  /**
   * The parameters required to set up a target for your pipe.
   */
  readonly targetParameters: TargetParameters;

  /**
   * Grant the pipe role to push to the target.
   */
  grantPush(grantee: IRole): void;
}

/**
 * The parameters required to set up a target for your pipe.
 *
 * For more information about pipe target parameters, including how to use dynamic path parameters, see [Target parameters](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-target.html) in the *Amazon EventBridge User Guide* .
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-target.html#pipes-targets-specific-parms
 */
export interface TargetParameters {
  /**
   * The parameters for using an AWS Batch job as a target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-batchjobparameters
   *
   * @default - none
   */
  readonly batchJobParameters?: PipeTargetBatchJobParametersProperty;

  /**
   * The parameters for using an CloudWatch Logs log stream as a target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-cloudwatchlogsparameters
   *
   * @default - none
   */
  readonly cloudWatchLogsParameters?: PipeTargetCloudWatchLogsParametersProperty;

  /**
   * The parameters for using an Amazon ECS task as a target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-ecstaskparameters
   *
   * @default - none
   */
  readonly ecsTaskParameters?: PipeTargetEcsTaskParametersProperty;

  /**
   * The parameters for using an EventBridge event bus as a target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-eventbridgeeventbusparameters
   *
   * @default - none
   */
  readonly eventBridgeEventBusParameters?: PipeTargetEventBridgeEventBusParametersProperty;

  /**
   * These are custom parameter to be used when the target is an API Gateway REST APIs or EventBridge ApiDestinations.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-httpparameters
   *
   * @default - none
   */
  readonly httpParameters?: PipeTargetHttpParametersProperty;

  /**
   * Valid JSON text passed to the target.
   *
   * In this case, nothing from the event itself is passed to the target. For more information, see [The JavaScript Object Notation (JSON) Data Interchange Format](https://docs.aws.amazon.com/http://www.rfc-editor.org/rfc/rfc7159.txt) .
   *
   * To remove an input template, specify an empty string.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   *
   * @default - none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * The parameters for using a Kinesis stream as a target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-kinesisstreamparameters
   *
   * @default - none
   */
  readonly kinesisStreamParameters?: PipeTargetKinesisStreamParametersProperty;

  /**
   * The parameters for using a Lambda function as a target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-lambdafunctionparameters
   *
   * @default - none
   */
  readonly lambdaFunctionParameters?: PipeTargetLambdaFunctionParametersProperty;

  /**
   * These are custom parameters to be used when the target is a Amazon Redshift cluster to invoke the Amazon Redshift Data API BatchExecuteStatement.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-redshiftdataparameters
   *
   * @default - none
   */
  readonly redshiftDataParameters?: PipeTargetRedshiftDataParametersProperty;

  /**
   * The parameters for using a SageMaker pipeline as a target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-sagemakerpipelineparameters
   *
   * @default - none
   */
  readonly sageMakerPipelineParameters?: PipeTargetSageMakerPipelineParametersProperty;

  /**
   * The parameters for using a Amazon SQS stream as a target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-sqsqueueparameters
   *
   * @default - none
   */
  readonly sqsQueueParameters?: PipeTargetSqsQueueParametersProperty;

  /**
   * The parameters for using a Step Functions state machine as a target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-stepfunctionstatemachineparameters
   *
   * @default - none
   */
  readonly stepFunctionStateMachineParameters?: PipeTargetStateMachineParametersProperty;
}

/**
 * The type how the state machine should be invoked.
 */
export enum StateMachineInvocationType {
  /**
   * Invoke synchronously.
   *
   * For more information, see [StartSyncExecution](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartSyncExecution.html) in the *AWS Step Functions API Reference* .
   *
   * > `REQUEST_RESPONSE` is not supported for `STANDARD` state machine workflows.
   */
  REQUEST_RESPONSE = 'REQUEST_RESPONSE',

  /**
   * Invoke asynchronously.
   *
   * For more information, see [StartExecution](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html) in the *AWS Step Functions API Reference* .
   */
  FIRE_AND_FORGET = 'FIRE_AND_FORGET',
}

/**
 * The parameters for using a Step Functions state machine as a target.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetstatemachineparameters.html
 */
export interface PipeTargetStateMachineParametersProperty {
  /**
   * Specify whether to invoke the Step Functions state machine synchronously or asynchronously.
   *
   * - `REQUEST_RESPONSE` (default) - Invoke synchronously. For more information, see [StartSyncExecution](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartSyncExecution.html) in the *AWS Step Functions API Reference* .
   *
   * > `REQUEST_RESPONSE` is not supported for `STANDARD` state machine workflows.
   * - `FIRE_AND_FORGET` - Invoke asynchronously. For more information, see [StartExecution](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html) in the *AWS Step Functions API Reference* .
   *
   * For more information, see [Invocation types](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes.html#pipes-invocation) in the *Amazon EventBridge User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetstatemachineparameters.html#cfn-pipes-pipe-pipetargetstatemachineparameters-invocationtype
   *
   * @default - StateMachineInvocationType.REQUEST_RESPONSE
   */
  readonly invocationType?: StateMachineInvocationType;
}

/**
 * These are custom parameter to be used when the target is an API Gateway REST APIs or EventBridge ApiDestinations.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html
 */
export interface PipeTargetHttpParametersProperty {
  /**
   * The headers that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-headerparameters
   *
   * @default - none
   */
  readonly headerParameters?: Record<string, string>;

  /**
   * The path parameter values to be used to populate API Gateway REST API or EventBridge ApiDestination path wildcards ("*").
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-pathparametervalues
   *
   * @default - none
   */
  readonly pathParameterValues?: Array<string>;

  /**
   * The query string keys/values that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-querystringparameters
   *
   * @default - none
   */
  readonly queryStringParameters?: Record<string, string>;
}

/**
 * The parameters for using a Amazon SQS stream as a target.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsqsqueueparameters.html
 */
export interface PipeTargetSqsQueueParametersProperty {
  /**
   * This parameter applies only to FIFO (first-in-first-out) queues.
   *
   * The token used for deduplication of sent messages.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsqsqueueparameters.html#cfn-pipes-pipe-pipetargetsqsqueueparameters-messagededuplicationid
   *
   * @default - none
   */
  readonly messageDeduplicationId?: string;

  /**
   * The FIFO message group ID to use as the target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsqsqueueparameters.html#cfn-pipes-pipe-pipetargetsqsqueueparameters-messagegroupid
   *
   * @default - none
   */
  readonly messageGroupId?: string;
}

/**
 * The parameters for using an CloudWatch Logs log stream as a target.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetcloudwatchlogsparameters.html
 */
export interface PipeTargetCloudWatchLogsParametersProperty {
  /**
   * The name of the log stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetcloudwatchlogsparameters.html#cfn-pipes-pipe-pipetargetcloudwatchlogsparameters-logstreamname
   *
   * @default - none
   */
  readonly logStreamName?: string;

  /**
   * The time the event occurred, expressed as the number of milliseconds after Jan 1, 1970 00:00:00 UTC.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetcloudwatchlogsparameters.html#cfn-pipes-pipe-pipetargetcloudwatchlogsparameters-timestamp
   *
   * @default - none
   */
  readonly timestamp?: string;
}

/**
 * The parameters for using a Kinesis stream as a target.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetkinesisstreamparameters.html
 */
export interface PipeTargetKinesisStreamParametersProperty {
  /**
   * Determines which shard in the stream the data record is assigned to.
   *
   * Partition keys are Unicode strings with a maximum length limit of 256 characters for each key. Amazon Kinesis Data Streams uses the partition key as input to a hash function that maps the partition key and associated data to a specific shard. Specifically, an MD5 hash function is used to map partition keys to 128-bit integer values and to map associated data records to shards. As a result of this hashing mechanism, all data records with the same partition key map to the same shard within the stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetkinesisstreamparameters.html#cfn-pipes-pipe-pipetargetkinesisstreamparameters-partitionkey
   *
   * @default - none
   */
  readonly partitionKey: string;
}

/**
 * The parameters for using a SageMaker pipeline as a target.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsagemakerpipelineparameters.html
 */
export interface PipeTargetSageMakerPipelineParametersProperty {
  /**
   * List of Parameter names and values for SageMaker Model Building Pipeline execution.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsagemakerpipelineparameters.html#cfn-pipes-pipe-pipetargetsagemakerpipelineparameters-pipelineparameterlist
   *
   * @default - none
   */
  readonly pipelineParameterList?: Array<SageMakerPipelineParameterProperty>;
}

/**
 * Name/Value pair of a parameter to start execution of a SageMaker Model Building Pipeline.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-sagemakerpipelineparameter.html
 */
export interface SageMakerPipelineParameterProperty {
  /**
   * Name of parameter to start execution of a SageMaker Model Building Pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-sagemakerpipelineparameter.html#cfn-pipes-pipe-sagemakerpipelineparameter-name
   */
  readonly name: string;

  /**
   * Value of parameter to start execution of a SageMaker Model Building Pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-sagemakerpipelineparameter.html#cfn-pipes-pipe-sagemakerpipelineparameter-value
   */
  readonly value: string;
}

/**
 * The parameters for using an EventBridge event bus as a target.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html
 */
export interface PipeTargetEventBridgeEventBusParametersProperty {
  /**
   * A free-form string, with a maximum of 128 characters, used to decide what fields to expect in the event detail.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-detailtype
   *
   * @default - none
   */
  readonly detailType?: string;

  /**
   * The URL subdomain of the endpoint.
   *
   * For example, if the URL for Endpoint is https://abcde.veo.endpoints.event.amazonaws.com, then the EndpointId is `abcde.veo` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-endpointid
   *
   * @default - none
   */
  readonly endpointId?: string;

  /**
   * AWS resources, identified by Amazon Resource Name (ARN), which the event primarily concerns.
   *
   * Any number, including zero, may be present.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-resources
   *
   * @default - none
   */
  readonly resources?: Array<string>;

  /**
   * The source of the event.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-source
   *
   * @default - none
   */
  readonly source?: string;

  /**
   * The time stamp of the event, per [RFC3339](https://docs.aws.amazon.com/https://www.rfc-editor.org/rfc/rfc3339.txt) . If no time stamp is provided, the time stamp of the [PutEvents](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html) call is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-time
   *
   * @default - none
   */
  readonly time?: string;
}

/**
 * Invocation type for a Lambda function.
 */
export enum LambdaInvocationType {
  /**
   * Invoke synchronously.
   *
   * For more information, see [Invoke](https://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html) in the *AWS Lambda API Reference* .
   */
  REQUEST_RESPONSE = 'REQUEST_RESPONSE',

  /**
   * Invoke asynchronously.
   *
   * For more information, see [InvokeAsync](https://docs.aws.amazon.com/lambda/latest/dg/API_InvokeAsync.html) in the *AWS Lambda API Reference* .
   */
  FIRE_AND_FORGET = 'FIRE_AND_FORGET',
}

/**
 * The parameters for using a Lambda function as a target.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetlambdafunctionparameters.html
 */
export interface PipeTargetLambdaFunctionParametersProperty {
  /**
   * Specify whether to invoke the function synchronously or asynchronously.
   *
   * - `REQUEST_RESPONSE` (default) - Invoke synchronously. This corresponds to the `RequestResponse` option in the `InvocationType` parameter for the Lambda [Invoke](https://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html#API_Invoke_RequestSyntax) API.
   * - `FIRE_AND_FORGET` - Invoke asynchronously. This corresponds to the `Event` option in the `InvocationType` parameter for the Lambda [Invoke](https://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html#API_Invoke_RequestSyntax) API.
   *
   * For more information, see [Invocation types](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes.html#pipes-invocation) in the *Amazon EventBridge User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetlambdafunctionparameters.html#cfn-pipes-pipe-pipetargetlambdafunctionparameters-invocationtype
   *
   * @default - LambdaInvocationType.REQUEST_RESPONSE
   */
  readonly invocationType?: LambdaInvocationType;
}

/**
 * The parameters for using an ECS task job as a target.
 */
export enum EcsTaskDefinitionLaunchType {
  /**
   * The task runs on an Amazon EC2 instance.
   */
  EC2 = 'EC2',

  /**
   * The task runs on AWS Fargate.
   */
  FARGATE = 'FARGATE',

  /**
   * The task uses the launch type specified in its task definition.
   */
  EXTERNAL = 'EXTERNAL'
}

/**
 * The parameters how Tags are propagated for using an Amazon ECS task.
 */
export enum EcsTaskDefinitionPropagateTags {
  /**
   * Copy tags to Task Definition.
   */
  TASK_DEFINITION = 'TASK_DEFINITION',
}

/**
 * The parameters for using an Amazon ECS task as a target.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html
 */
export interface PipeTargetEcsTaskParametersProperty {
  /**
   * The capacity provider strategy to use for the task.
   *
   * If a `capacityProviderStrategy` is specified, the `launchType` parameter must be omitted. If no `capacityProviderStrategy` or launchType is specified, the `defaultCapacityProviderStrategy` for the cluster is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-capacityproviderstrategy
   *
   * @default - none
   */
  readonly capacityProviderStrategy?: Array<CapacityProviderStrategyItemProperty>;

  /**
   * Specifies whether to enable Amazon ECS managed tags for the task.
   *
   * For more information, see [Tagging Your Amazon ECS Resources](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-using-tags.html) in the Amazon Elastic Container Service Developer Guide.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-enableecsmanagedtags
   *
   * @default - false
  */
  readonly enableEcsManagedTags?: boolean;

  /**
   * Whether or not to enable the execute command functionality for the containers in this task.
   *
   * If true, this enables execute command functionality on all containers in the task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-enableexecutecommand
   *
   * @default - false
  */
  readonly enableExecuteCommand?: boolean;

  /**
   * Specifies an Amazon ECS task group for the task.
   *
   * The maximum length is 255 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-group
   *
   * @default - none
   */
  readonly group?: string;

  /**
   * Specifies the launch type on which your task is running.
   *
   * The launch type that you specify here must match one of the launch type (compatibilities) of the target task. The `FARGATE` value is supported only in the Regions where AWS Fargate with Amazon ECS is supported. For more information, see [AWS Fargate on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS-Fargate.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-launchtype
   *
   * @default - none
   */
  readonly launchType?: EcsTaskDefinitionLaunchType;

  /**
   * Use this structure if the Amazon ECS task uses the `awsvpc` network mode.
   *
   * This structure specifies the VPC subnets and security groups associated with the task, and whether a public IP address is to be used. This structure is required if `LaunchType` is `FARGATE` because the `awsvpc` mode is required for Fargate tasks.
   *
   * If you specify `NetworkConfiguration` when the target ECS task does not use the `awsvpc` network mode, the task fails.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-networkconfiguration
   *
   * @default - none
   */
  readonly networkConfiguration?: NetworkConfigurationProperty;

  /**
   * The overrides that are associated with a task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-overrides
   *
   * @default - none
   */
  readonly overrides?: EcsTaskOverrideProperty;

  /**
   * An array of placement constraint objects to use for the task.
   *
   * You can specify up to 10 constraints per task (including constraints in the task definition and those specified at runtime).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-placementconstraints
   *
   * @default - none
   */
  readonly placementConstraints?: Array<PlacementConstraintProperty>;

  /**
   * The placement strategy objects to use for the task.
   *
   * You can specify a maximum of five strategy rules per task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-placementstrategy
   *
   * @default - none
   */
  readonly placementStrategy?: Array<PlacementStrategyProperty>;

  /**
   * Specifies the platform version for the task.
   *
   * Specify only the numeric portion of the platform version, such as `1.1.0` .
   *
   * This structure is used only if `LaunchType` is `FARGATE` . For more information about valid platform versions, see [AWS Fargate Platform Versions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-platformversion
   *
   * @default - none
   */
  readonly platformVersion?: string;

  /**
   * Specifies whether to propagate the tags from the task definition to the task.
   *
   * If no value is specified, the tags are not propagated. Tags can only be propagated to the task during task creation. To add tags to a task after task creation, use the `TagResource` API action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-propagatetags
   *
   * @default - none
   */
  readonly propagateTags?: EcsTaskDefinitionPropagateTags;

  /**
   * The reference ID to use for the task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-referenceid
   *
   * @default - none
   */
  readonly referenceId?: string;

  /**
   * The metadata that you apply to the task to help you categorize and organize them.
   *
   * Each tag consists of a key and an optional value, both of which you define. To learn more, see [RunTask](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RunTask.html#ECS-RunTask-request-tags) in the Amazon ECS API Reference.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-tags
   *
   * @default - none
   */
  readonly tags?:Array<CfnTag>;

  /**
   * The number of tasks to create based on `TaskDefinition` .
   *
   * The default is 1.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-taskcount
   *
   * @default - 1
   */
  readonly taskCount?: number;

  /**
   * The ARN of the task definition to use if the event target is an Amazon ECS task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-taskdefinitionarn
   */
  readonly taskDefinitionArn: string;
}

/**
 * The parameters for specifying the Task placement type.
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html#constraint-types
 */
export enum TaskPlacementType {
  /**
   *  Place each task on a different container instance. This task placement constraint can be specified when either running a task or creating a new service.
   */
  DISTINCT_INSTANCE ='distinctInstance',

  /**
   * Place tasks on container instances that satisfy an expression. For more information about the expression syntax for constraints, see [Cluster query language](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-query-language.html).
   */
  MEMBER_OF ='memberOf',
}

/**
 * An object representing a constraint on task placement.
 *
 * To learn more, see [Task Placement Constraints](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html) in the Amazon Elastic Container Service Developer Guide.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementconstraint.html
 */
export interface PlacementConstraintProperty {
  /**
   * A cluster query language expression to apply to the constraint.
   *
   * You cannot specify an expression if the constraint type is `distinctInstance` . To learn more, see [Cluster Query Language](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-query-language.html) in the Amazon Elastic Container Service Developer Guide.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementconstraint.html#cfn-pipes-pipe-placementconstraint-expression
   *
   * @default - none
   */
  readonly expression?: string;

  /**
   * The type of constraint.
   *
   * Use distinctInstance to ensure that each task in a particular group is running on a different container instance. Use memberOf to restrict the selection to a group of valid candidates.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementconstraint.html#cfn-pipes-pipe-placementconstraint-type
   *
   * @default - none
   */
  readonly type?: TaskPlacementType;
}

/**
 * Amazon ECS supported task placement strategies.
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html#strategy-types
 */
export enum PlacementStrategyType {
  /**
   * Tasks are placed randomly.
   */
  RANDOM = 'random',

  /**
   * Tasks are placed on container instances so as to leave the least amount of unused CPU or memory.
   *
   * This strategy minimizes the number of container instances in use.
   *
   * When this strategy is used and a scale-in action is taken, Amazon ECS terminates tasks. It does this based on the amount of resources that are left on the container instance after the task is terminated. The container instance that has the most available resources left after task termination has that task terminated.
   */
  BINPACK = 'binpack',

  /**
   * Tasks are placed evenly based on the specified value. Accepted values are instanceId (or host, which has the same effect), or any platform or custom attribute that's applied to a container instance, such as attribute:ecs.availability-zone.
   *
   * Service tasks are spread based on the tasks from that service. Standalone tasks are spread based on the tasks from the same task group. For more information about task groups, see Task groups.
   *
   * When the spread strategy is used and a scale-in action is taken, Amazon ECS selects tasks to terminate that maintain a balance across Availability Zones. Within an Availability Zone, tasks are selected at random.
   */
  SPREAD = 'spread'

}

/**
 * The task placement strategy for a task or service.
 *
 * To learn more, see [Task Placement Strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html) in the Amazon Elastic Container Service Service Developer Guide.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementstrategy.html
 */
export interface PlacementStrategyProperty {
  /**
   * The field to apply the placement strategy against.
   *
   * For the spread placement strategy, valid values are instanceId (or host, which has the same effect), or any platform or custom attribute that is applied to a container instance, such as attribute:ecs.availability-zone. For the binpack placement strategy, valid values are cpu and memory. For the random placement strategy, this field is not used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementstrategy.html#cfn-pipes-pipe-placementstrategy-field
   *
   * @default - none
   */
  readonly field?: string;

  /**
   * The type of placement strategy.
   *
   * The random placement strategy randomly places tasks on available candidates. The spread placement strategy spreads placement across available candidates evenly based on the field parameter. The binpack strategy places tasks on available candidates that have the least available amount of the resource that is specified with the field parameter. For example, if you binpack on memory, a task is placed on the instance with the least amount of remaining memory (but still enough to run the task).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementstrategy.html#cfn-pipes-pipe-placementstrategy-type
   *
   * @default - none
   */
  readonly type?: PlacementStrategyType;
}

/**
 * The details of a capacity provider strategy.
 *
 * To learn more, see [CapacityProviderStrategyItem](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_CapacityProviderStrategyItem.html) in the Amazon ECS API Reference.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-capacityproviderstrategyitem.html
 */
export interface CapacityProviderStrategyItemProperty {
  /**
   * The base value designates how many tasks, at a minimum, to run on the specified capacity provider.
   *
   * Only one capacity provider in a capacity provider strategy can have a base defined. If no value is specified, the default value of 0 is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-capacityproviderstrategyitem.html#cfn-pipes-pipe-capacityproviderstrategyitem-base
   *
   * @default - 0
  */
  readonly base?: number;

  /**
   * The short name of the capacity provider.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-capacityproviderstrategyitem.html#cfn-pipes-pipe-capacityproviderstrategyitem-capacityprovider
   */
  readonly capacityProvider: string;

  /**
   * The weight value designates the relative percentage of the total number of tasks launched that should use the specified capacity provider.
   *
   * The weight value is taken into consideration after the base value, if defined, is satisfied.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-capacityproviderstrategyitem.html#cfn-pipes-pipe-capacityproviderstrategyitem-weight
   *
   * @default - 0
   */
  readonly weight?: number;
}

/**
 * The overrides that are associated with a task.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html
 */
export interface EcsTaskOverrideProperty {
  /**
   * One or more container overrides that are sent to a task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-containeroverrides
   *
   * @default - none
   */
  readonly containerOverrides?: Array<EcsContainerOverrideProperty>;

  /**
   * The cpu override for the task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-cpu
   *
   * @default - none
   */
  readonly cpu?: string;

  /**
   * The ephemeral storage setting override for the task.
   *
   * > This parameter is only supported for tasks hosted on Fargate that use the following platform versions:
   * >
   * > - Linux platform version `1.4.0` or later.
   * > - Windows platform version `1.0.0` or later.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-ephemeralstorage
   *
   * @default - none
   */
  readonly ephemeralStorage?: EcsEphemeralStorageProperty;

  /**
   * The Amazon Resource Name (ARN) of the task execution IAM role override for the task.
   *
   * For more information, see [Amazon ECS task execution IAM role](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-executionrolearn
   *
   * @default - none
   */
  readonly executionRoleArn?: string;

  /**
   * The Elastic Inference accelerator override for the task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-inferenceacceleratoroverrides
   *
   * @default - none
   */
  readonly inferenceAcceleratorOverrides?: Array<EcsInferenceAcceleratorOverrideProperty>;

  /**
   * The memory override for the task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-memory
   *
   * @default - none
   */
  readonly memory?: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role that containers in this task can assume.
   *
   * All containers in this task are granted the permissions that are specified in this role. For more information, see [IAM Role for Tasks](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-taskrolearn
   *
   * @default - none
   */
  readonly taskRoleArn?: string;
}

/**
 * Details on an Elastic Inference accelerator task override.
 *
 * This parameter is used to override the Elastic Inference accelerator specified in the task definition. For more information, see [Working with Amazon Elastic Inference on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/userguide/ecs-inference.html) in the *Amazon Elastic Container Service Developer Guide* .
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsinferenceacceleratoroverride.html
 */
export interface EcsInferenceAcceleratorOverrideProperty {
  /**
   * The Elastic Inference accelerator device name to override for the task.
   *
   * This parameter must match a `deviceName` specified in the task definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsinferenceacceleratoroverride.html#cfn-pipes-pipe-ecsinferenceacceleratoroverride-devicename
   *
   * @default - none
   */
  readonly deviceName?: string;

  /**
   * The Elastic Inference accelerator type to use.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsinferenceacceleratoroverride.html#cfn-pipes-pipe-ecsinferenceacceleratoroverride-devicetype
   *
   * @default - none
   */
  readonly deviceType?: string;
}

/**
 * The amount of ephemeral storage to allocate for the task.
 *
 * This parameter is used to expand the total amount of ephemeral storage available, beyond the default amount, for tasks hosted on Fargate . For more information, see [Fargate task storage](https://docs.aws.amazon.com/AmazonECS/latest/userguide/using_data_volumes.html) in the *Amazon ECS User Guide for Fargate* .
 *
 * > This parameter is only supported for tasks hosted on Fargate using Linux platform version `1.4.0` or later. This parameter is not supported for Windows containers on Fargate .
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsephemeralstorage.html
 */
export interface EcsEphemeralStorageProperty {
  /**
   * The total amount, in GiB, of ephemeral storage to set for the task.
   *
   * The minimum supported value is `21` GiB and the maximum supported value is `200` GiB.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsephemeralstorage.html#cfn-pipes-pipe-ecsephemeralstorage-sizeingib
   */
  readonly sizeInGiB: number;
}

/**
 * The overrides that are sent to a container.
 *
 * An empty container override can be passed in. An example of an empty container override is `{"containerOverrides": [ ] }` . If a non-empty container override is specified, the `name` parameter must be included.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html
 */
export interface EcsContainerOverrideProperty {
  /**
   * The command to send to the container that overrides the default command from the Docker image or the task definition.
   *
   * You must also specify a container name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-command
   *
   * @default - none
   */
  readonly command?: Array<string>;

  /**
   * The number of `cpu` units reserved for the container, instead of the default value from the task definition.
   *
   * You must also specify a container name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-cpu
   *
   * @default - none
   */
  readonly cpu?: number;

  /**
   * The environment variables to send to the container.
   *
   * You can add new environment variables, which are added to the container at launch, or you can override the existing environment variables from the Docker image or the task definition. You must also specify a container name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-environment
   *
   * @default - none
   */
  readonly environment?: Array<EcsEnvironmentVariableProperty>;

  /**
   * A list of files containing the environment variables to pass to a container, instead of the value from the container definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-environmentfiles
   *
   * @default - none
   */
  readonly environmentFiles?: Array<EcsEnvironmentFileProperty>;

  /**
   * The hard limit (in MiB) of memory to present to the container, instead of the default value from the task definition.
   *
   * If your container attempts to exceed the memory specified here, the container is killed. You must also specify a container name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-memory
   *
   * @default - none
   */
  readonly memory?: number;

  /**
   * The soft limit (in MiB) of memory to reserve for the container, instead of the default value from the task definition.
   *
   * You must also specify a container name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-memoryreservation
   *
   * @default - none
   */
  readonly memoryReservation?: number;

  /**
   * The name of the container that receives the override.
   *
   * This parameter is required if any override is specified.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-name
   *
   * @default - none
   */
  readonly name?: string;

  /**
   * The type and amount of a resource to assign to a container, instead of the default value from the task definition.
   *
   * The only supported resource is a GPU.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-resourcerequirements
   *
   * @default - none
   */
  readonly resourceRequirements?: Array<EcsResourceRequirementProperty>;
}

/**
 * The environment variables to send to the container.
 *
 * You can add new environment variables, which are added to the container at launch, or you can override the existing environment variables from the Docker image or the task definition. You must also specify a container name.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentvariable.html
 */
export interface EcsEnvironmentVariableProperty {
  /**
   * The name of the key-value pair.
   *
   * For environment variables, this is the name of the environment variable.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentvariable.html#cfn-pipes-pipe-ecsenvironmentvariable-name
   *
   * @default - none
   */
  readonly name?: string;

  /**
   * The value of the key-value pair.
   *
   * For environment variables, this is the value of the environment variable.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentvariable.html#cfn-pipes-pipe-ecsenvironmentvariable-value
   *
   * @default - none
   */
  readonly value?: string;
}

/**
 * The type of resource to assign to a container.
 */
export enum EcsResourceRequirementType {
  /**
   * The resource need to have a GPU.
   */
  GPU = 'GPU',

  /**
   * The resource need to have an Elastic Inference accelerator.
   */
  INFERENCE_ACCELERATOR = 'InferenceAccelerator'
}

/**
 * The type and amount of a resource to assign to a container.
 *
 * The supported resource types are GPUs and Elastic Inference accelerators. For more information, see [Working with GPUs on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-gpu.html) or [Working with Amazon Elastic Inference on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-inference.html) in the *Amazon Elastic Container Service Developer Guide*
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsresourcerequirement.html
 */
export interface EcsResourceRequirementProperty {
  /**
   * The type of resource to assign to a container.
   *
   * The supported values are `GPU` or `InferenceAccelerator` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsresourcerequirement.html#cfn-pipes-pipe-ecsresourcerequirement-type
   */
  readonly type: EcsResourceRequirementType;

  /**
   * The value for the specified resource type.
   *
   * If the `GPU` type is used, the value is the number of physical `GPUs` the Amazon ECS container agent reserves for the container. The number of GPUs that's reserved for all containers in a task can't exceed the number of available GPUs on the container instance that the task is launched on.
   *
   * If the `InferenceAccelerator` type is used, the `value` matches the `deviceName` for an InferenceAccelerator specified in a task definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsresourcerequirement.html#cfn-pipes-pipe-ecsresourcerequirement-value
   */
  readonly value: string;
}

/**
 * The file type to use.
 */
export enum EcsEnvironmentFileType {
  /**
   * The file type to use.
   *
   * The only supported value is `s3` .
   */
  S3 = 's3'
}

/**
 * A list of files containing the environment variables to pass to a container.
 *
 * You can specify up to ten environment files. The file must have a `.env` file extension. Each line in an environment file should contain an environment variable in `VARIABLE=VALUE` format. Lines beginning with `#` are treated as comments and are ignored. For more information about the environment variable file syntax, see [Declare default environment variables in file](https://docs.aws.amazon.com/https://docs.docker.com/compose/env-file/) .
 *
 * If there are environment variables specified using the `environment` parameter in a container definition, they take precedence over the variables contained within an environment file. If multiple environment files are specified that contain the same variable, they're processed from the top down. We recommend that you use unique variable names. For more information, see [Specifying environment variables](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/taskdef-envfiles.html) in the *Amazon Elastic Container Service Developer Guide* .
 *
 * This parameter is only supported for tasks hosted on Fargate using the following platform versions:
 *
 * - Linux platform version `1.4.0` or later.
 * - Windows platform version `1.0.0` or later.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentfile.html
 */
export interface EcsEnvironmentFileProperty {
  /**
   * The file type to use.
   *
   * The only supported value is `s3` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentfile.html#cfn-pipes-pipe-ecsenvironmentfile-type
   */
  readonly type: EcsEnvironmentFileType;

  /**
   * The Amazon Resource Name (ARN) of the Amazon S3 object containing the environment variable file.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentfile.html#cfn-pipes-pipe-ecsenvironmentfile-value
   */
  readonly value: string;
}

/**
 * This structure specifies the network configuration for an Amazon ECS task.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-networkconfiguration.html
 */
export interface NetworkConfigurationProperty {
  /**
   * Use this structure to specify the VPC subnets and security groups for the task, and whether a public IP address is to be used.
   *
   * This structure is relevant only for ECS tasks that use the `awsvpc` network mode.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-networkconfiguration.html#cfn-pipes-pipe-networkconfiguration-awsvpcconfiguration
   *
   * @default - none
   */
  readonly awsvpcConfiguration?: AwsVpcConfigurationProperty;
}

/**
 * Parameter if a public ip should be assigned.
 */
export enum AwsVpcConfigurationAssignPublicIp {
  /**
   * If the task is launched in a private subnet, no public IP address is to be used.
   */
  DISABLED = 'DISABLED',

  /**
   * The task is launched with a public IP address.
   */
  ENABLED = 'ENABLED'
}

/**
 * This structure specifies the VPC subnets and security groups for the task, and whether a public IP address is to be used.
 *
 * This structure is relevant only for ECS tasks that use the `awsvpc` network mode.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-awsvpcconfiguration.html
 */
export interface AwsVpcConfigurationProperty {
  /**
   * Specifies whether the task's elastic network interface receives a public IP address.
   *
   * You can specify `ENABLED` only when `LaunchType` in `EcsParameters` is set to `FARGATE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-awsvpcconfiguration.html#cfn-pipes-pipe-awsvpcconfiguration-assignpublicip
   *
   * @default - none
   */
  readonly assignPublicIp?: AwsVpcConfigurationAssignPublicIp;

  /**
   * Specifies the security groups associated with the task.
   *
   * These security groups must all be in the same VPC. You can specify as many as five security groups. If you do not specify a security group, the default security group for the VPC is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-awsvpcconfiguration.html#cfn-pipes-pipe-awsvpcconfiguration-securitygroups
   *
   * @default - none
   */
  readonly securityGroups?: Array<string>;

  /**
   * Specifies the subnets associated with the task.
   *
   * These subnets must all be in the same VPC. You can specify as many as 16 subnets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-awsvpcconfiguration.html#cfn-pipes-pipe-awsvpcconfiguration-subnets
   *
   * @default - none
   */
  readonly subnets: Array<string>;
}

/**
 * The parameters for using an AWS Batch job as a target.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html
 */
export interface PipeTargetBatchJobParametersProperty {
  /**
   * The array properties for the submitted job, such as the size of the array.
   *
   * The array size can be between 2 and 10,000. If you specify array properties for a job, it becomes an array job. This parameter is used only if the target is an AWS Batch job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-arrayproperties
   *
   * @default - none
   */
  readonly arrayProperties?: BatchArrayPropertiesProperty;

  /**
   * The overrides that are sent to a container.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-containeroverrides
   *
   * @default - none
   */
  readonly containerOverrides?: BatchContainerOverridesProperty;

  /**
   * A list of dependencies for the job.
   *
   * A job can depend upon a maximum of 20 jobs. You can specify a `SEQUENTIAL` type dependency without specifying a job ID for array jobs so that each child array job completes sequentially, starting at index 0. You can also specify an `N_TO_N` type dependency with a job ID for array jobs. In that case, each index child of this job must wait for the corresponding index child of each dependency to complete before it can begin.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-dependson
   *
   * @default - none
   */
  readonly dependsOn?: Array<BatchJobDependencyProperty>;

  /**
   * The job definition used by this job.
   *
   * This value can be one of `name` , `name:revision` , or the Amazon Resource Name (ARN) for the job definition. If name is specified without a revision then the latest active revision is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-jobdefinition
   */
  readonly jobDefinition: string;

  /**
   * The name of the job.
   *
   * It can be up to 128 letters long. The first character must be alphanumeric, can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-jobname
   */
  readonly jobName: string;

  /**
   * Additional parameters passed to the job that replace parameter substitution placeholders that are set in the job definition.
   *
   * Parameters are specified as a key and value pair mapping. Parameters included here override any corresponding parameter defaults from the job definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-parameters
   *
   * @default - none
   */
  readonly parameters?: Record<string, string>;

  /**
   * The retry strategy to use for failed jobs.
   *
   * When a retry strategy is specified here, it overrides the retry strategy defined in the job definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-retrystrategy
   *
   * @default - none
   */
  readonly retryStrategy?: BatchRetryStrategyProperty;
}

/**
 * The AWS Batch scheduler ensures that your job is run only after the specified dependencies have successfully completed.
 *
 * @see https://docs.aws.amazon.com/batch/latest/userguide/job_dependencies.html
 */
export enum BatchJobDependencyType {
  /**
   * The job becomes eligible to run after all of the jobs specified by the dependencies complete successfully.
   */
  N_TO_N = 'N_TO_N',

  /**
   * The job becomes eligible to run after any one of the jobs specified by the dependencies completes successfully.
   */
  SEQUENTIAL = 'SEQUENTIAL'
}

/**
 * An object that represents an AWS Batch job dependency.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchjobdependency.html
 */
export interface BatchJobDependencyProperty {
  /**
   * The job ID of the AWS Batch job that's associated with this dependency.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchjobdependency.html#cfn-pipes-pipe-batchjobdependency-jobid
   *
   * @default - none
   */
  readonly jobId?: string;

  /**
   * The type of the job dependency.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchjobdependency.html#cfn-pipes-pipe-batchjobdependency-type
   *
   * @default - none
   */
  readonly type?: BatchJobDependencyType;
}

/**
 * The array properties for the submitted job, such as the size of the array.
 *
 * The array size can be between 2 and 10,000. If you specify array properties for a job, it becomes an array job. This parameter is used only if the target is an AWS Batch job.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batcharrayproperties.html
 */
export interface BatchArrayPropertiesProperty {
  /**
   * The size of the array, if this is an array batch job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batcharrayproperties.html#cfn-pipes-pipe-batcharrayproperties-size
   *
   * @default - none
  */
  readonly size?: number;
}

/**
 * The retry strategy that's associated with a job.
 *
 * For more information, see [Automated job retries](https://docs.aws.amazon.com/batch/latest/userguide/job_retries.html) in the *AWS Batch User Guide* .
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchretrystrategy.html
 */
export interface BatchRetryStrategyProperty {
  /**
   * The number of times to move a job to the `RUNNABLE` status.
   *
   * If the value of `attempts` is greater than one, the job is retried on failure the same number of attempts as the value.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchretrystrategy.html#cfn-pipes-pipe-batchretrystrategy-attempts
   *
   * @default - none
   */
  readonly attempts?: number;
}

/**
 * The overrides that are sent to a container.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchcontaineroverrides.html
 */
export interface BatchContainerOverridesProperty {
  /**
   * The command to send to the container that overrides the default command from the Docker image or the task definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchcontaineroverrides.html#cfn-pipes-pipe-batchcontaineroverrides-command
   *
   * @default - none
   */
  readonly command?: Array<string>;

  /**
   * The environment variables to send to the container.
   *
   * You can add new environment variables, which are added to the container at launch, or you can override the existing environment variables from the Docker image or the task definition.
   *
   * > Environment variables cannot start with " `AWS Batch` ". This naming convention is reserved for variables that AWS Batch sets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchcontaineroverrides.html#cfn-pipes-pipe-batchcontaineroverrides-environment
   *
   * @default - none
   */
  readonly environment?: Array<BatchEnvironmentVariableProperty>;

  /**
   * The instance type to use for a multi-node parallel job.
   *
   * > This parameter isn't applicable to single-node container jobs or jobs that run on Fargate resources, and shouldn't be provided.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchcontaineroverrides.html#cfn-pipes-pipe-batchcontaineroverrides-instancetype
   *
   * @default - none
   */
  readonly instanceType?: string;

  /**
   * The type and amount of resources to assign to a container.
   *
   * This overrides the settings in the job definition. The supported resources include `GPU` , `MEMORY` , and `VCPU` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchcontaineroverrides.html#cfn-pipes-pipe-batchcontaineroverrides-resourcerequirements
   *
   * @default - none
   */
  readonly resourceRequirements?: Array<BatchResourceRequirementProperty>;
}

/**
 * The environment variables to send to the container.
 *
 * You can add new environment variables, which are added to the container at launch, or you can override the existing environment variables from the Docker image or the task definition.
 *
 * > Environment variables cannot start with " `AWS Batch` ". This naming convention is reserved for variables that AWS Batch sets.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchenvironmentvariable.html
 */
export interface BatchEnvironmentVariableProperty {
  /**
   * The name of the key-value pair.
   *
   * For environment variables, this is the name of the environment variable.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchenvironmentvariable.html#cfn-pipes-pipe-batchenvironmentvariable-name
   *
   * @default - none
   */
  readonly name?: string;

  /**
   * The value of the key-value pair.
   *
   * For environment variables, this is the value of the environment variable.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchenvironmentvariable.html#cfn-pipes-pipe-batchenvironmentvariable-value
   *
   * @default - none
   */
  readonly value?: string;
}
/**
 * The type of resource to assign to a container. The supported resources include GPU, MEMORY, and VCPU.
 */
export enum BatchResourceRequirementType {
  /**
   * Amount of GPU to reserve for the container.
   */
  GPU = 'GPU',

  /**
   * Amount of memory to present to the container.
   */
  MEMORY = 'MEMORY',

  /**
   * Amount of VCPU to reserve for the container.
   */
  VCPU = 'VCPU'
}

/**
 * The type and amount of a resource to assign to a container.
 *
 * The supported resources include `GPU` , `MEMORY` , and `VCPU` .
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchresourcerequirement.html
 */
export interface BatchResourceRequirementProperty {
  /**
   * The type of resource to assign to a container.
   *
   * The supported resources include `GPU` , `MEMORY` , and `VCPU` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchresourcerequirement.html#cfn-pipes-pipe-batchresourcerequirement-type
   */
  readonly type: BatchResourceRequirementType;

  /**
   * The quantity of the specified resource to reserve for the container. The values vary based on the `type` specified.
   *
   * - **type="GPU"** - The number of physical GPUs to reserve for the container. Make sure that the number of GPUs reserved for all containers in a job doesn't exceed the number of available GPUs on the compute resource that the job is launched on.
   *
   * > GPUs aren't available for jobs that are running on Fargate resources.
   * - **type="MEMORY"** - The memory hard limit (in MiB) present to the container. This parameter is supported for jobs that are running on EC2 resources. If your container attempts to exceed the memory specified, the container is terminated. This parameter maps to `Memory` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--memory` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) . You must specify at least 4 MiB of memory for a job. This is required but can be specified in several places for multi-node parallel (MNP) jobs. It must be specified for each node at least once. This parameter maps to `Memory` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--memory` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) .
   *
   * > If you're trying to maximize your resource utilization by providing your jobs as much memory as possible for a particular instance type, see [Memory management](https://docs.aws.amazon.com/batch/latest/userguide/memory-management.html) in the *AWS Batch User Guide* .
   *
   * For jobs that are running on Fargate resources, then `value` is the hard limit (in MiB), and must match one of the supported values and the `VCPU` values must be one of the values supported for that memory value.
   *
   * - **value = 512** - `VCPU` = 0.25
   * - **value = 1024** - `VCPU` = 0.25 or 0.5
   * - **value = 2048** - `VCPU` = 0.25, 0.5, or 1
   * - **value = 3072** - `VCPU` = 0.5, or 1
   * - **value = 4096** - `VCPU` = 0.5, 1, or 2
   * - **value = 5120, 6144, or 7168** - `VCPU` = 1 or 2
   * - **value = 8192** - `VCPU` = 1, 2, 4, or 8
   * - **value = 9216, 10240, 11264, 12288, 13312, 14336, or 15360** - `VCPU` = 2 or 4
   * - **value = 16384** - `VCPU` = 2, 4, or 8
   * - **value = 17408, 18432, 19456, 21504, 22528, 23552, 25600, 26624, 27648, 29696, or 30720** - `VCPU` = 4
   * - **value = 20480, 24576, or 28672** - `VCPU` = 4 or 8
   * - **value = 36864, 45056, 53248, or 61440** - `VCPU` = 8
   * - **value = 32768, 40960, 49152, or 57344** - `VCPU` = 8 or 16
   * - **value = 65536, 73728, 81920, 90112, 98304, 106496, 114688, or 122880** - `VCPU` = 16
   * - **type="VCPU"** - The number of vCPUs reserved for the container. This parameter maps to `CpuShares` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--cpu-shares` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) . Each vCPU is equivalent to 1,024 CPU shares. For EC2 resources, you must specify at least one vCPU. This is required but can be specified in several places; it must be specified for each node at least once.
   *
   * The default for the Fargate On-Demand vCPU resource count quota is 6 vCPUs. For more information about Fargate quotas, see [AWS Fargate quotas](https://docs.aws.amazon.com/general/latest/gr/ecs-service.html#service-quotas-fargate) in the *AWS General Reference* .
   *
   * For jobs that are running on Fargate resources, then `value` must match one of the supported values and the `MEMORY` values must be one of the values supported for that `VCPU` value. The supported values are 0.25, 0.5, 1, 2, 4, 8, and 16
   *
   * - **value = 0.25** - `MEMORY` = 512, 1024, or 2048
   * - **value = 0.5** - `MEMORY` = 1024, 2048, 3072, or 4096
   * - **value = 1** - `MEMORY` = 2048, 3072, 4096, 5120, 6144, 7168, or 8192
   * - **value = 2** - `MEMORY` = 4096, 5120, 6144, 7168, 8192, 9216, 10240, 11264, 12288, 13312, 14336, 15360, or 16384
   * - **value = 4** - `MEMORY` = 8192, 9216, 10240, 11264, 12288, 13312, 14336, 15360, 16384, 17408, 18432, 19456, 20480, 21504, 22528, 23552, 24576, 25600, 26624, 27648, 28672, 29696, or 30720
   * - **value = 8** - `MEMORY` = 16384, 20480, 24576, 28672, 32768, 36864, 40960, 45056, 49152, 53248, 57344, or 61440
   * - **value = 16** - `MEMORY` = 32768, 40960, 49152, 57344, 65536, 73728, 81920, 90112, 98304, 106496, 114688, or 122880
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchresourcerequirement.html#cfn-pipes-pipe-batchresourcerequirement-value
   */
  readonly value: string;
}

/**
 * These are custom parameters to be used when the target is a Amazon Redshift cluster to invoke the Amazon Redshift Data API BatchExecuteStatement.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html
 */
export interface PipeTargetRedshiftDataParametersProperty {
  /**
   * The name of the database.
   *
   * Required when authenticating using temporary credentials.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-database
   */
  readonly database: string;

  /**
   * The database user name.
   *
   * Required when authenticating using temporary credentials.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-dbuser
   *
   * @default - none
   */
  readonly dbUser?: string;

  /**
   * The name or ARN of the secret that enables access to the database.
   *
   * Required when authenticating using Secrets Manager .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-secretmanagerarn
   *
   * @default - none
   */
  readonly secretManagerArn?: string;

  /**
   * The SQL statement text to run.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-sqls
   */
  readonly sqls: Array<string>;

  /**
   * The name of the SQL statement.
   *
   * You can name the SQL statement when you create it to identify the query.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-statementname
   *
   * @default - none
   */
  readonly statementName?: string;

  /**
   * Indicates whether to send an event back to EventBridge after the SQL statement runs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-withevent
   *
   * @default - false
  */
  readonly withEvent?: boolean;
}