/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specifies a pipe.
 *
 * Amazon EventBridge Pipes connect event sources to targets and reduces the need for specialized knowledge and integration code.
 *
 * > As an aid to help you jumpstart developing CloudFormation templates, the EventBridge console enables you to create templates from the existing pipes in your account. For more information, see [Generate an CloudFormation template from EventBridge Pipes](https://docs.aws.amazon.com/eventbridge/latest/userguide/pipes-generate-template.html) in the *Amazon EventBridge User Guide* .
 *
 * @cloudformationResource AWS::Pipes::Pipe
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html
 */
export class CfnPipe extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Pipes::Pipe";

  /**
   * Build a CfnPipe from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPipe {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPipePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPipe(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the pipe.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The time the pipe was created.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The state the pipe is in.
   *
   * @cloudformationAttribute CurrentState
   */
  public readonly attrCurrentState: string;

  /**
   * When the pipe was last updated, in [ISO-8601 format](https://docs.aws.amazon.com/https://www.w3.org/TR/NOTE-datetime) (YYYY-MM-DDThh:mm:ss.sTZD).
   *
   * @cloudformationAttribute LastModifiedTime
   */
  public readonly attrLastModifiedTime: string;

  /**
   * The reason the pipe is in its current state.
   *
   * @cloudformationAttribute StateReason
   */
  public readonly attrStateReason: string;

  /**
   * A description of the pipe.
   */
  public description?: string;

  /**
   * The state the pipe should be in.
   */
  public desiredState?: string;

  /**
   * The ARN of the enrichment resource.
   */
  public enrichment?: string;

  /**
   * The parameters required to set up enrichment on your pipe.
   */
  public enrichmentParameters?: cdk.IResolvable | CfnPipe.PipeEnrichmentParametersProperty;

  /**
   * The logging configuration settings for the pipe.
   */
  public logConfiguration?: cdk.IResolvable | CfnPipe.PipeLogConfigurationProperty;

  /**
   * The name of the pipe.
   */
  public name?: string;

  /**
   * The ARN of the role that allows the pipe to send data to the target.
   */
  public roleArn: string;

  /**
   * The ARN of the source resource.
   */
  public source: string;

  /**
   * The parameters required to set up a source for your pipe.
   */
  public sourceParameters?: cdk.IResolvable | CfnPipe.PipeSourceParametersProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The list of key-value pairs to associate with the pipe.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The ARN of the target resource.
   */
  public target: string;

  /**
   * The parameters required to set up a target for your pipe.
   */
  public targetParameters?: cdk.IResolvable | CfnPipe.PipeTargetParametersProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPipeProps) {
    super(scope, id, {
      "type": CfnPipe.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "roleArn", this);
    cdk.requireProperty(props, "source", this);
    cdk.requireProperty(props, "target", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrCurrentState = cdk.Token.asString(this.getAtt("CurrentState", cdk.ResolutionTypeHint.STRING));
    this.attrLastModifiedTime = cdk.Token.asString(this.getAtt("LastModifiedTime", cdk.ResolutionTypeHint.STRING));
    this.attrStateReason = cdk.Token.asString(this.getAtt("StateReason", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.desiredState = props.desiredState;
    this.enrichment = props.enrichment;
    this.enrichmentParameters = props.enrichmentParameters;
    this.logConfiguration = props.logConfiguration;
    this.name = props.name;
    this.roleArn = props.roleArn;
    this.source = props.source;
    this.sourceParameters = props.sourceParameters;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pipes::Pipe", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.target = props.target;
    this.targetParameters = props.targetParameters;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "desiredState": this.desiredState,
      "enrichment": this.enrichment,
      "enrichmentParameters": this.enrichmentParameters,
      "logConfiguration": this.logConfiguration,
      "name": this.name,
      "roleArn": this.roleArn,
      "source": this.source,
      "sourceParameters": this.sourceParameters,
      "tags": this.tags.renderTags(),
      "target": this.target,
      "targetParameters": this.targetParameters
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPipe.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPipePropsToCloudFormation(props);
  }
}

export namespace CfnPipe {
  /**
   * The parameters required to set up a target for your pipe.
   *
   * For more information about pipe target parameters, including how to use dynamic path parameters, see [Target parameters](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-target.html) in the *Amazon EventBridge User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html
   */
  export interface PipeTargetParametersProperty {
    /**
     * The parameters for using an AWS Batch job as a target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-batchjobparameters
     */
    readonly batchJobParameters?: cdk.IResolvable | CfnPipe.PipeTargetBatchJobParametersProperty;

    /**
     * The parameters for using an CloudWatch Logs log stream as a target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-cloudwatchlogsparameters
     */
    readonly cloudWatchLogsParameters?: cdk.IResolvable | CfnPipe.PipeTargetCloudWatchLogsParametersProperty;

    /**
     * The parameters for using an Amazon ECS task as a target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-ecstaskparameters
     */
    readonly ecsTaskParameters?: cdk.IResolvable | CfnPipe.PipeTargetEcsTaskParametersProperty;

    /**
     * The parameters for using an EventBridge event bus as a target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-eventbridgeeventbusparameters
     */
    readonly eventBridgeEventBusParameters?: cdk.IResolvable | CfnPipe.PipeTargetEventBridgeEventBusParametersProperty;

    /**
     * These are custom parameter to be used when the target is an API Gateway REST APIs or EventBridge ApiDestinations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-httpparameters
     */
    readonly httpParameters?: cdk.IResolvable | CfnPipe.PipeTargetHttpParametersProperty;

    /**
     * Valid JSON text passed to the target.
     *
     * In this case, nothing from the event itself is passed to the target. For more information, see [The JavaScript Object Notation (JSON) Data Interchange Format](https://docs.aws.amazon.com/http://www.rfc-editor.org/rfc/rfc7159.txt) .
     *
     * To remove an input template, specify an empty string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
     */
    readonly inputTemplate?: string;

    /**
     * The parameters for using a Kinesis stream as a target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-kinesisstreamparameters
     */
    readonly kinesisStreamParameters?: cdk.IResolvable | CfnPipe.PipeTargetKinesisStreamParametersProperty;

    /**
     * The parameters for using a Lambda function as a target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-lambdafunctionparameters
     */
    readonly lambdaFunctionParameters?: cdk.IResolvable | CfnPipe.PipeTargetLambdaFunctionParametersProperty;

    /**
     * These are custom parameters to be used when the target is a Amazon Redshift cluster to invoke the Amazon Redshift Data API BatchExecuteStatement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-redshiftdataparameters
     */
    readonly redshiftDataParameters?: cdk.IResolvable | CfnPipe.PipeTargetRedshiftDataParametersProperty;

    /**
     * The parameters for using a SageMaker pipeline as a target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-sagemakerpipelineparameters
     */
    readonly sageMakerPipelineParameters?: cdk.IResolvable | CfnPipe.PipeTargetSageMakerPipelineParametersProperty;

    /**
     * The parameters for using a Amazon SQS stream as a target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-sqsqueueparameters
     */
    readonly sqsQueueParameters?: cdk.IResolvable | CfnPipe.PipeTargetSqsQueueParametersProperty;

    /**
     * The parameters for using a Step Functions state machine as a target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-stepfunctionstatemachineparameters
     */
    readonly stepFunctionStateMachineParameters?: cdk.IResolvable | CfnPipe.PipeTargetStateMachineParametersProperty;
  }

  /**
   * The parameters for using a Step Functions state machine as a target.
   *
   * @struct
   * @stability external
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
     */
    readonly invocationType?: string;
  }

  /**
   * These are custom parameter to be used when the target is an API Gateway REST APIs or EventBridge ApiDestinations.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html
   */
  export interface PipeTargetHttpParametersProperty {
    /**
     * The headers that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-headerparameters
     */
    readonly headerParameters?: cdk.IResolvable | Record<string, string>;

    /**
     * The path parameter values to be used to populate API Gateway REST API or EventBridge ApiDestination path wildcards ("*").
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-pathparametervalues
     */
    readonly pathParameterValues?: Array<string>;

    /**
     * The query string keys/values that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-querystringparameters
     */
    readonly queryStringParameters?: cdk.IResolvable | Record<string, string>;
  }

  /**
   * The parameters for using a Amazon SQS stream as a target.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsqsqueueparameters.html
   */
  export interface PipeTargetSqsQueueParametersProperty {
    /**
     * This parameter applies only to FIFO (first-in-first-out) queues.
     *
     * The token used for deduplication of sent messages.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsqsqueueparameters.html#cfn-pipes-pipe-pipetargetsqsqueueparameters-messagededuplicationid
     */
    readonly messageDeduplicationId?: string;

    /**
     * The FIFO message group ID to use as the target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsqsqueueparameters.html#cfn-pipes-pipe-pipetargetsqsqueueparameters-messagegroupid
     */
    readonly messageGroupId?: string;
  }

  /**
   * The parameters for using an CloudWatch Logs log stream as a target.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetcloudwatchlogsparameters.html
   */
  export interface PipeTargetCloudWatchLogsParametersProperty {
    /**
     * The name of the log stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetcloudwatchlogsparameters.html#cfn-pipes-pipe-pipetargetcloudwatchlogsparameters-logstreamname
     */
    readonly logStreamName?: string;

    /**
     * The time the event occurred, expressed as the number of milliseconds after Jan 1, 1970 00:00:00 UTC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetcloudwatchlogsparameters.html#cfn-pipes-pipe-pipetargetcloudwatchlogsparameters-timestamp
     */
    readonly timestamp?: string;
  }

  /**
   * The parameters for using a Kinesis stream as a target.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetkinesisstreamparameters.html
   */
  export interface PipeTargetKinesisStreamParametersProperty {
    /**
     * Determines which shard in the stream the data record is assigned to.
     *
     * Partition keys are Unicode strings with a maximum length limit of 256 characters for each key. Amazon Kinesis Data Streams uses the partition key as input to a hash function that maps the partition key and associated data to a specific shard. Specifically, an MD5 hash function is used to map partition keys to 128-bit integer values and to map associated data records to shards. As a result of this hashing mechanism, all data records with the same partition key map to the same shard within the stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetkinesisstreamparameters.html#cfn-pipes-pipe-pipetargetkinesisstreamparameters-partitionkey
     */
    readonly partitionKey: string;
  }

  /**
   * The parameters for using a SageMaker pipeline as a target.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsagemakerpipelineparameters.html
   */
  export interface PipeTargetSageMakerPipelineParametersProperty {
    /**
     * List of Parameter names and values for SageMaker Model Building Pipeline execution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsagemakerpipelineparameters.html#cfn-pipes-pipe-pipetargetsagemakerpipelineparameters-pipelineparameterlist
     */
    readonly pipelineParameterList?: Array<cdk.IResolvable | CfnPipe.SageMakerPipelineParameterProperty> | cdk.IResolvable;
  }

  /**
   * Name/Value pair of a parameter to start execution of a SageMaker Model Building Pipeline.
   *
   * @struct
   * @stability external
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
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html
   */
  export interface PipeTargetEventBridgeEventBusParametersProperty {
    /**
     * A free-form string, with a maximum of 128 characters, used to decide what fields to expect in the event detail.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-detailtype
     */
    readonly detailType?: string;

    /**
     * The URL subdomain of the endpoint.
     *
     * For example, if the URL for Endpoint is https://abcde.veo.endpoints.event.amazonaws.com, then the EndpointId is `abcde.veo` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-endpointid
     */
    readonly endpointId?: string;

    /**
     * AWS resources, identified by Amazon Resource Name (ARN), which the event primarily concerns.
     *
     * Any number, including zero, may be present.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-resources
     */
    readonly resources?: Array<string>;

    /**
     * The source of the event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-source
     */
    readonly source?: string;

    /**
     * The time stamp of the event, per [RFC3339](https://docs.aws.amazon.com/https://www.rfc-editor.org/rfc/rfc3339.txt) . If no time stamp is provided, the time stamp of the [PutEvents](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html) call is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-time
     */
    readonly time?: string;
  }

  /**
   * The parameters for using a Lambda function as a target.
   *
   * @struct
   * @stability external
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
     */
    readonly invocationType?: string;
  }

  /**
   * The parameters for using an Amazon ECS task as a target.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html
   */
  export interface PipeTargetEcsTaskParametersProperty {
    /**
     * The capacity provider strategy to use for the task.
     *
     * If a `capacityProviderStrategy` is specified, the `launchType` parameter must be omitted. If no `capacityProviderStrategy` or launchType is specified, the `defaultCapacityProviderStrategy` for the cluster is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-capacityproviderstrategy
     */
    readonly capacityProviderStrategy?: Array<CfnPipe.CapacityProviderStrategyItemProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies whether to enable Amazon ECS managed tags for the task.
     *
     * For more information, see [Tagging Your Amazon ECS Resources](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-using-tags.html) in the Amazon Elastic Container Service Developer Guide.
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-enableecsmanagedtags
     */
    readonly enableEcsManagedTags?: boolean | cdk.IResolvable;

    /**
     * Whether or not to enable the execute command functionality for the containers in this task.
     *
     * If true, this enables execute command functionality on all containers in the task.
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-enableexecutecommand
     */
    readonly enableExecuteCommand?: boolean | cdk.IResolvable;

    /**
     * Specifies an Amazon ECS task group for the task.
     *
     * The maximum length is 255 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-group
     */
    readonly group?: string;

    /**
     * Specifies the launch type on which your task is running.
     *
     * The launch type that you specify here must match one of the launch type (compatibilities) of the target task. The `FARGATE` value is supported only in the Regions where AWS Fargate with Amazon ECS is supported. For more information, see [AWS Fargate on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS-Fargate.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-launchtype
     */
    readonly launchType?: string;

    /**
     * Use this structure if the Amazon ECS task uses the `awsvpc` network mode.
     *
     * This structure specifies the VPC subnets and security groups associated with the task, and whether a public IP address is to be used. This structure is required if `LaunchType` is `FARGATE` because the `awsvpc` mode is required for Fargate tasks.
     *
     * If you specify `NetworkConfiguration` when the target ECS task does not use the `awsvpc` network mode, the task fails.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-networkconfiguration
     */
    readonly networkConfiguration?: cdk.IResolvable | CfnPipe.NetworkConfigurationProperty;

    /**
     * The overrides that are associated with a task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-overrides
     */
    readonly overrides?: CfnPipe.EcsTaskOverrideProperty | cdk.IResolvable;

    /**
     * An array of placement constraint objects to use for the task.
     *
     * You can specify up to 10 constraints per task (including constraints in the task definition and those specified at runtime).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-placementconstraints
     */
    readonly placementConstraints?: Array<cdk.IResolvable | CfnPipe.PlacementConstraintProperty> | cdk.IResolvable;

    /**
     * The placement strategy objects to use for the task.
     *
     * You can specify a maximum of five strategy rules per task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-placementstrategy
     */
    readonly placementStrategy?: Array<cdk.IResolvable | CfnPipe.PlacementStrategyProperty> | cdk.IResolvable;

    /**
     * Specifies the platform version for the task.
     *
     * Specify only the numeric portion of the platform version, such as `1.1.0` .
     *
     * This structure is used only if `LaunchType` is `FARGATE` . For more information about valid platform versions, see [AWS Fargate Platform Versions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-platformversion
     */
    readonly platformVersion?: string;

    /**
     * Specifies whether to propagate the tags from the task definition to the task.
     *
     * If no value is specified, the tags are not propagated. Tags can only be propagated to the task during task creation. To add tags to a task after task creation, use the `TagResource` API action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-propagatetags
     */
    readonly propagateTags?: string;

    /**
     * The reference ID to use for the task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-referenceid
     */
    readonly referenceId?: string;

    /**
     * The metadata that you apply to the task to help you categorize and organize them.
     *
     * Each tag consists of a key and an optional value, both of which you define. To learn more, see [RunTask](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RunTask.html#ECS-RunTask-request-tags) in the Amazon ECS API Reference.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-tags
     */
    readonly tags?: Array<cdk.CfnTag>;

    /**
     * The number of tasks to create based on `TaskDefinition` .
     *
     * The default is 1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetecstaskparameters.html#cfn-pipes-pipe-pipetargetecstaskparameters-taskcount
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
   * An object representing a constraint on task placement.
   *
   * To learn more, see [Task Placement Constraints](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html) in the Amazon Elastic Container Service Developer Guide.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementconstraint.html
   */
  export interface PlacementConstraintProperty {
    /**
     * A cluster query language expression to apply to the constraint.
     *
     * You cannot specify an expression if the constraint type is `distinctInstance` . To learn more, see [Cluster Query Language](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-query-language.html) in the Amazon Elastic Container Service Developer Guide.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementconstraint.html#cfn-pipes-pipe-placementconstraint-expression
     */
    readonly expression?: string;

    /**
     * The type of constraint.
     *
     * Use distinctInstance to ensure that each task in a particular group is running on a different container instance. Use memberOf to restrict the selection to a group of valid candidates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementconstraint.html#cfn-pipes-pipe-placementconstraint-type
     */
    readonly type?: string;
  }

  /**
   * The task placement strategy for a task or service.
   *
   * To learn more, see [Task Placement Strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html) in the Amazon Elastic Container Service Service Developer Guide.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementstrategy.html
   */
  export interface PlacementStrategyProperty {
    /**
     * The field to apply the placement strategy against.
     *
     * For the spread placement strategy, valid values are instanceId (or host, which has the same effect), or any platform or custom attribute that is applied to a container instance, such as attribute:ecs.availability-zone. For the binpack placement strategy, valid values are cpu and memory. For the random placement strategy, this field is not used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementstrategy.html#cfn-pipes-pipe-placementstrategy-field
     */
    readonly field?: string;

    /**
     * The type of placement strategy.
     *
     * The random placement strategy randomly places tasks on available candidates. The spread placement strategy spreads placement across available candidates evenly based on the field parameter. The binpack strategy places tasks on available candidates that have the least available amount of the resource that is specified with the field parameter. For example, if you binpack on memory, a task is placed on the instance with the least amount of remaining memory (but still enough to run the task).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-placementstrategy.html#cfn-pipes-pipe-placementstrategy-type
     */
    readonly type?: string;
  }

  /**
   * The details of a capacity provider strategy.
   *
   * To learn more, see [CapacityProviderStrategyItem](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_CapacityProviderStrategyItem.html) in the Amazon ECS API Reference.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-capacityproviderstrategyitem.html
   */
  export interface CapacityProviderStrategyItemProperty {
    /**
     * The base value designates how many tasks, at a minimum, to run on the specified capacity provider.
     *
     * Only one capacity provider in a capacity provider strategy can have a base defined. If no value is specified, the default value of 0 is used.
     *
     * @default - 0
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-capacityproviderstrategyitem.html#cfn-pipes-pipe-capacityproviderstrategyitem-base
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
     * @default - 0
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-capacityproviderstrategyitem.html#cfn-pipes-pipe-capacityproviderstrategyitem-weight
     */
    readonly weight?: number;
  }

  /**
   * The overrides that are associated with a task.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html
   */
  export interface EcsTaskOverrideProperty {
    /**
     * One or more container overrides that are sent to a task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-containeroverrides
     */
    readonly containerOverrides?: Array<CfnPipe.EcsContainerOverrideProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The cpu override for the task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-cpu
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
     */
    readonly ephemeralStorage?: CfnPipe.EcsEphemeralStorageProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the task execution IAM role override for the task.
     *
     * For more information, see [Amazon ECS task execution IAM role](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-executionrolearn
     */
    readonly executionRoleArn?: string;

    /**
     * The Elastic Inference accelerator override for the task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-inferenceacceleratoroverrides
     */
    readonly inferenceAcceleratorOverrides?: Array<CfnPipe.EcsInferenceAcceleratorOverrideProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The memory override for the task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-memory
     */
    readonly memory?: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role that containers in this task can assume.
     *
     * All containers in this task are granted the permissions that are specified in this role. For more information, see [IAM Role for Tasks](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecstaskoverride.html#cfn-pipes-pipe-ecstaskoverride-taskrolearn
     */
    readonly taskRoleArn?: string;
  }

  /**
   * Details on an Elastic Inference accelerator task override.
   *
   * This parameter is used to override the Elastic Inference accelerator specified in the task definition. For more information, see [Working with Amazon Elastic Inference on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/userguide/ecs-inference.html) in the *Amazon Elastic Container Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsinferenceacceleratoroverride.html
   */
  export interface EcsInferenceAcceleratorOverrideProperty {
    /**
     * The Elastic Inference accelerator device name to override for the task.
     *
     * This parameter must match a `deviceName` specified in the task definition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsinferenceacceleratoroverride.html#cfn-pipes-pipe-ecsinferenceacceleratoroverride-devicename
     */
    readonly deviceName?: string;

    /**
     * The Elastic Inference accelerator type to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsinferenceacceleratoroverride.html#cfn-pipes-pipe-ecsinferenceacceleratoroverride-devicetype
     */
    readonly deviceType?: string;
  }

  /**
   * The amount of ephemeral storage to allocate for the task.
   *
   * This parameter is used to expand the total amount of ephemeral storage available, beyond the default amount, for tasks hosted on Fargate . For more information, see [Fargate task storage](https://docs.aws.amazon.com/AmazonECS/latest/userguide/using_data_volumes.html) in the *Amazon ECS User Guide for Fargate* .
   *
   * > This parameter is only supported for tasks hosted on Fargate using Linux platform version `1.4.0` or later. This parameter is not supported for Windows containers on Fargate .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsephemeralstorage.html
   */
  export interface EcsEphemeralStorageProperty {
    /**
     * The total amount, in GiB, of ephemeral storage to set for the task.
     *
     * The minimum supported value is `21` GiB and the maximum supported value is `200` GiB.
     *
     * @default - 0
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsephemeralstorage.html#cfn-pipes-pipe-ecsephemeralstorage-sizeingib
     */
    readonly sizeInGiB: number;
  }

  /**
   * The overrides that are sent to a container.
   *
   * An empty container override can be passed in. An example of an empty container override is `{"containerOverrides": [ ] }` . If a non-empty container override is specified, the `name` parameter must be included.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html
   */
  export interface EcsContainerOverrideProperty {
    /**
     * The command to send to the container that overrides the default command from the Docker image or the task definition.
     *
     * You must also specify a container name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-command
     */
    readonly command?: Array<string>;

    /**
     * The number of `cpu` units reserved for the container, instead of the default value from the task definition.
     *
     * You must also specify a container name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-cpu
     */
    readonly cpu?: number;

    /**
     * The environment variables to send to the container.
     *
     * You can add new environment variables, which are added to the container at launch, or you can override the existing environment variables from the Docker image or the task definition. You must also specify a container name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-environment
     */
    readonly environment?: Array<CfnPipe.EcsEnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of files containing the environment variables to pass to a container, instead of the value from the container definition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-environmentfiles
     */
    readonly environmentFiles?: Array<CfnPipe.EcsEnvironmentFileProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The hard limit (in MiB) of memory to present to the container, instead of the default value from the task definition.
     *
     * If your container attempts to exceed the memory specified here, the container is killed. You must also specify a container name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-memory
     */
    readonly memory?: number;

    /**
     * The soft limit (in MiB) of memory to reserve for the container, instead of the default value from the task definition.
     *
     * You must also specify a container name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-memoryreservation
     */
    readonly memoryReservation?: number;

    /**
     * The name of the container that receives the override.
     *
     * This parameter is required if any override is specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-name
     */
    readonly name?: string;

    /**
     * The type and amount of a resource to assign to a container, instead of the default value from the task definition.
     *
     * The only supported resource is a GPU.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecscontaineroverride.html#cfn-pipes-pipe-ecscontaineroverride-resourcerequirements
     */
    readonly resourceRequirements?: Array<CfnPipe.EcsResourceRequirementProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The environment variables to send to the container.
   *
   * You can add new environment variables, which are added to the container at launch, or you can override the existing environment variables from the Docker image or the task definition. You must also specify a container name.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentvariable.html
   */
  export interface EcsEnvironmentVariableProperty {
    /**
     * The name of the key-value pair.
     *
     * For environment variables, this is the name of the environment variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentvariable.html#cfn-pipes-pipe-ecsenvironmentvariable-name
     */
    readonly name?: string;

    /**
     * The value of the key-value pair.
     *
     * For environment variables, this is the value of the environment variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentvariable.html#cfn-pipes-pipe-ecsenvironmentvariable-value
     */
    readonly value?: string;
  }

  /**
   * The type and amount of a resource to assign to a container.
   *
   * The supported resource types are GPUs and Elastic Inference accelerators. For more information, see [Working with GPUs on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-gpu.html) or [Working with Amazon Elastic Inference on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-inference.html) in the *Amazon Elastic Container Service Developer Guide*
   *
   * @struct
   * @stability external
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
    readonly type: string;

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
   *
   * @struct
   * @stability external
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
    readonly type: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon S3 object containing the environment variable file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-ecsenvironmentfile.html#cfn-pipes-pipe-ecsenvironmentfile-value
     */
    readonly value: string;
  }

  /**
   * This structure specifies the network configuration for an Amazon ECS task.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-networkconfiguration.html
   */
  export interface NetworkConfigurationProperty {
    /**
     * Use this structure to specify the VPC subnets and security groups for the task, and whether a public IP address is to be used.
     *
     * This structure is relevant only for ECS tasks that use the `awsvpc` network mode.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-networkconfiguration.html#cfn-pipes-pipe-networkconfiguration-awsvpcconfiguration
     */
    readonly awsvpcConfiguration?: CfnPipe.AwsVpcConfigurationProperty | cdk.IResolvable;
  }

  /**
   * This structure specifies the VPC subnets and security groups for the task, and whether a public IP address is to be used.
   *
   * This structure is relevant only for ECS tasks that use the `awsvpc` network mode.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-awsvpcconfiguration.html
   */
  export interface AwsVpcConfigurationProperty {
    /**
     * Specifies whether the task's elastic network interface receives a public IP address.
     *
     * You can specify `ENABLED` only when `LaunchType` in `EcsParameters` is set to `FARGATE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-awsvpcconfiguration.html#cfn-pipes-pipe-awsvpcconfiguration-assignpublicip
     */
    readonly assignPublicIp?: string;

    /**
     * Specifies the security groups associated with the task.
     *
     * These security groups must all be in the same VPC. You can specify as many as five security groups. If you do not specify a security group, the default security group for the VPC is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-awsvpcconfiguration.html#cfn-pipes-pipe-awsvpcconfiguration-securitygroups
     */
    readonly securityGroups?: Array<string>;

    /**
     * Specifies the subnets associated with the task.
     *
     * These subnets must all be in the same VPC. You can specify as many as 16 subnets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-awsvpcconfiguration.html#cfn-pipes-pipe-awsvpcconfiguration-subnets
     */
    readonly subnets: Array<string>;
  }

  /**
   * The parameters for using an AWS Batch job as a target.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html
   */
  export interface PipeTargetBatchJobParametersProperty {
    /**
     * The array properties for the submitted job, such as the size of the array.
     *
     * The array size can be between 2 and 10,000. If you specify array properties for a job, it becomes an array job. This parameter is used only if the target is an AWS Batch job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-arrayproperties
     */
    readonly arrayProperties?: CfnPipe.BatchArrayPropertiesProperty | cdk.IResolvable;

    /**
     * The overrides that are sent to a container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-containeroverrides
     */
    readonly containerOverrides?: CfnPipe.BatchContainerOverridesProperty | cdk.IResolvable;

    /**
     * A list of dependencies for the job.
     *
     * A job can depend upon a maximum of 20 jobs. You can specify a `SEQUENTIAL` type dependency without specifying a job ID for array jobs so that each child array job completes sequentially, starting at index 0. You can also specify an `N_TO_N` type dependency with a job ID for array jobs. In that case, each index child of this job must wait for the corresponding index child of each dependency to complete before it can begin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-dependson
     */
    readonly dependsOn?: Array<CfnPipe.BatchJobDependencyProperty | cdk.IResolvable> | cdk.IResolvable;

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
     */
    readonly parameters?: cdk.IResolvable | Record<string, string>;

    /**
     * The retry strategy to use for failed jobs.
     *
     * When a retry strategy is specified here, it overrides the retry strategy defined in the job definition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetbatchjobparameters.html#cfn-pipes-pipe-pipetargetbatchjobparameters-retrystrategy
     */
    readonly retryStrategy?: CfnPipe.BatchRetryStrategyProperty | cdk.IResolvable;
  }

  /**
   * An object that represents an AWS Batch job dependency.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchjobdependency.html
   */
  export interface BatchJobDependencyProperty {
    /**
     * The job ID of the AWS Batch job that's associated with this dependency.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchjobdependency.html#cfn-pipes-pipe-batchjobdependency-jobid
     */
    readonly jobId?: string;

    /**
     * The type of the job dependency.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchjobdependency.html#cfn-pipes-pipe-batchjobdependency-type
     */
    readonly type?: string;
  }

  /**
   * The array properties for the submitted job, such as the size of the array.
   *
   * The array size can be between 2 and 10,000. If you specify array properties for a job, it becomes an array job. This parameter is used only if the target is an AWS Batch job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batcharrayproperties.html
   */
  export interface BatchArrayPropertiesProperty {
    /**
     * The size of the array, if this is an array batch job.
     *
     * @default - 0
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batcharrayproperties.html#cfn-pipes-pipe-batcharrayproperties-size
     */
    readonly size?: number;
  }

  /**
   * The retry strategy that's associated with a job.
   *
   * For more information, see [Automated job retries](https://docs.aws.amazon.com/batch/latest/userguide/job_retries.html) in the *AWS Batch User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchretrystrategy.html
   */
  export interface BatchRetryStrategyProperty {
    /**
     * The number of times to move a job to the `RUNNABLE` status.
     *
     * If the value of `attempts` is greater than one, the job is retried on failure the same number of attempts as the value.
     *
     * @default - 0
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchretrystrategy.html#cfn-pipes-pipe-batchretrystrategy-attempts
     */
    readonly attempts?: number;
  }

  /**
   * The overrides that are sent to a container.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchcontaineroverrides.html
   */
  export interface BatchContainerOverridesProperty {
    /**
     * The command to send to the container that overrides the default command from the Docker image or the task definition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchcontaineroverrides.html#cfn-pipes-pipe-batchcontaineroverrides-command
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
     */
    readonly environment?: Array<CfnPipe.BatchEnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The instance type to use for a multi-node parallel job.
     *
     * > This parameter isn't applicable to single-node container jobs or jobs that run on Fargate resources, and shouldn't be provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchcontaineroverrides.html#cfn-pipes-pipe-batchcontaineroverrides-instancetype
     */
    readonly instanceType?: string;

    /**
     * The type and amount of resources to assign to a container.
     *
     * This overrides the settings in the job definition. The supported resources include `GPU` , `MEMORY` , and `VCPU` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchcontaineroverrides.html#cfn-pipes-pipe-batchcontaineroverrides-resourcerequirements
     */
    readonly resourceRequirements?: Array<CfnPipe.BatchResourceRequirementProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The environment variables to send to the container.
   *
   * You can add new environment variables, which are added to the container at launch, or you can override the existing environment variables from the Docker image or the task definition.
   *
   * > Environment variables cannot start with " `AWS Batch` ". This naming convention is reserved for variables that AWS Batch sets.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchenvironmentvariable.html
   */
  export interface BatchEnvironmentVariableProperty {
    /**
     * The name of the key-value pair.
     *
     * For environment variables, this is the name of the environment variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchenvironmentvariable.html#cfn-pipes-pipe-batchenvironmentvariable-name
     */
    readonly name?: string;

    /**
     * The value of the key-value pair.
     *
     * For environment variables, this is the value of the environment variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-batchenvironmentvariable.html#cfn-pipes-pipe-batchenvironmentvariable-value
     */
    readonly value?: string;
  }

  /**
   * The type and amount of a resource to assign to a container.
   *
   * The supported resources include `GPU` , `MEMORY` , and `VCPU` .
   *
   * @struct
   * @stability external
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
    readonly type: string;

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
   *
   * @struct
   * @stability external
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
     */
    readonly dbUser?: string;

    /**
     * The name or ARN of the secret that enables access to the database.
     *
     * Required when authenticating using Secrets Manager .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-secretmanagerarn
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
     */
    readonly statementName?: string;

    /**
     * Indicates whether to send an event back to EventBridge after the SQL statement runs.
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-withevent
     */
    readonly withEvent?: boolean | cdk.IResolvable;
  }

  /**
   * The parameters required to set up enrichment on your pipe.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmentparameters.html
   */
  export interface PipeEnrichmentParametersProperty {
    /**
     * Contains the HTTP parameters to use when the target is a API Gateway REST endpoint or EventBridge ApiDestination.
     *
     * If you specify an API Gateway REST API or EventBridge ApiDestination as a target, you can use this parameter to specify headers, path parameters, and query string keys/values as part of your target invoking request. If you're using ApiDestinations, the corresponding Connection can also have these values configured. In case of any conflicting keys, values from the Connection take precedence.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmentparameters.html#cfn-pipes-pipe-pipeenrichmentparameters-httpparameters
     */
    readonly httpParameters?: cdk.IResolvable | CfnPipe.PipeEnrichmentHttpParametersProperty;

    /**
     * Valid JSON text passed to the enrichment.
     *
     * In this case, nothing from the event itself is passed to the enrichment. For more information, see [The JavaScript Object Notation (JSON) Data Interchange Format](https://docs.aws.amazon.com/http://www.rfc-editor.org/rfc/rfc7159.txt) .
     *
     * To remove an input template, specify an empty string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmentparameters.html#cfn-pipes-pipe-pipeenrichmentparameters-inputtemplate
     */
    readonly inputTemplate?: string;
  }

  /**
   * These are custom parameter to be used when the target is an API Gateway REST APIs or EventBridge ApiDestinations.
   *
   * In the latter case, these are merged with any InvocationParameters specified on the Connection, with any values from the Connection taking precedence.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmenthttpparameters.html
   */
  export interface PipeEnrichmentHttpParametersProperty {
    /**
     * The headers that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmenthttpparameters.html#cfn-pipes-pipe-pipeenrichmenthttpparameters-headerparameters
     */
    readonly headerParameters?: cdk.IResolvable | Record<string, string>;

    /**
     * The path parameter values to be used to populate API Gateway REST API or EventBridge ApiDestination path wildcards ("*").
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmenthttpparameters.html#cfn-pipes-pipe-pipeenrichmenthttpparameters-pathparametervalues
     */
    readonly pathParameterValues?: Array<string>;

    /**
     * The query string keys/values that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmenthttpparameters.html#cfn-pipes-pipe-pipeenrichmenthttpparameters-querystringparameters
     */
    readonly queryStringParameters?: cdk.IResolvable | Record<string, string>;
  }

  /**
   * The parameters required to set up a source for your pipe.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html
   */
  export interface PipeSourceParametersProperty {
    /**
     * The parameters for using an Active MQ broker as a source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-activemqbrokerparameters
     */
    readonly activeMqBrokerParameters?: cdk.IResolvable | CfnPipe.PipeSourceActiveMQBrokerParametersProperty;

    /**
     * The parameters for using a DynamoDB stream as a source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-dynamodbstreamparameters
     */
    readonly dynamoDbStreamParameters?: cdk.IResolvable | CfnPipe.PipeSourceDynamoDBStreamParametersProperty;

    /**
     * The collection of event patterns used to filter events.
     *
     * To remove a filter, specify a `FilterCriteria` object with an empty array of `Filter` objects.
     *
     * For more information, see [Events and Event Patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eventbridge-and-event-patterns.html) in the *Amazon EventBridge User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-filtercriteria
     */
    readonly filterCriteria?: CfnPipe.FilterCriteriaProperty | cdk.IResolvable;

    /**
     * The parameters for using a Kinesis stream as a source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-kinesisstreamparameters
     */
    readonly kinesisStreamParameters?: cdk.IResolvable | CfnPipe.PipeSourceKinesisStreamParametersProperty;

    /**
     * The parameters for using an MSK stream as a source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-managedstreamingkafkaparameters
     */
    readonly managedStreamingKafkaParameters?: cdk.IResolvable | CfnPipe.PipeSourceManagedStreamingKafkaParametersProperty;

    /**
     * The parameters for using a Rabbit MQ broker as a source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-rabbitmqbrokerparameters
     */
    readonly rabbitMqBrokerParameters?: cdk.IResolvable | CfnPipe.PipeSourceRabbitMQBrokerParametersProperty;

    /**
     * The parameters for using a stream as a source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-selfmanagedkafkaparameters
     */
    readonly selfManagedKafkaParameters?: cdk.IResolvable | CfnPipe.PipeSourceSelfManagedKafkaParametersProperty;

    /**
     * The parameters for using a Amazon SQS stream as a source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-sqsqueueparameters
     */
    readonly sqsQueueParameters?: cdk.IResolvable | CfnPipe.PipeSourceSqsQueueParametersProperty;
  }

  /**
   * The parameters for using an MSK stream as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html
   */
  export interface PipeSourceManagedStreamingKafkaParametersProperty {
    /**
     * The maximum number of records to include in each batch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-batchsize
     */
    readonly batchSize?: number;

    /**
     * The name of the destination queue to consume.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-consumergroupid
     */
    readonly consumerGroupId?: string;

    /**
     * The credentials needed to access the resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-credentials
     */
    readonly credentials?: cdk.IResolvable | CfnPipe.MSKAccessCredentialsProperty;

    /**
     * The maximum length of a time to wait for events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-maximumbatchingwindowinseconds
     */
    readonly maximumBatchingWindowInSeconds?: number;

    /**
     * (Streams only) The position in a stream from which to start reading.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-startingposition
     */
    readonly startingPosition?: string;

    /**
     * The name of the topic that the pipe will read from.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-topicname
     */
    readonly topicName: string;
  }

  /**
   * The AWS Secrets Manager secret that stores your stream credentials.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-mskaccesscredentials.html
   */
  export interface MSKAccessCredentialsProperty {
    /**
     * The ARN of the Secrets Manager secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-mskaccesscredentials.html#cfn-pipes-pipe-mskaccesscredentials-clientcertificatetlsauth
     */
    readonly clientCertificateTlsAuth?: string;

    /**
     * The ARN of the Secrets Manager secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-mskaccesscredentials.html#cfn-pipes-pipe-mskaccesscredentials-saslscram512auth
     */
    readonly saslScram512Auth?: string;
  }

  /**
   * The parameters for using a DynamoDB stream as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html
   */
  export interface PipeSourceDynamoDBStreamParametersProperty {
    /**
     * The maximum number of records to include in each batch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-batchsize
     */
    readonly batchSize?: number;

    /**
     * Define the target queue to send dead-letter queue events to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-deadletterconfig
     */
    readonly deadLetterConfig?: CfnPipe.DeadLetterConfigProperty | cdk.IResolvable;

    /**
     * The maximum length of a time to wait for events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-maximumbatchingwindowinseconds
     */
    readonly maximumBatchingWindowInSeconds?: number;

    /**
     * (Streams only) Discard records older than the specified age.
     *
     * The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, EventBridge never discards old records.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-maximumrecordageinseconds
     */
    readonly maximumRecordAgeInSeconds?: number;

    /**
     * (Streams only) Discard records after the specified number of retries.
     *
     * The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, EventBridge retries failed records until the record expires in the event source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-maximumretryattempts
     */
    readonly maximumRetryAttempts?: number;

    /**
     * (Streams only) Define how to handle item process failures.
     *
     * `AUTOMATIC_BISECT` halves each batch and retry each half until all the records are processed or there is one failed message left in the batch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-onpartialbatchitemfailure
     */
    readonly onPartialBatchItemFailure?: string;

    /**
     * (Streams only) The number of batches to process concurrently from each shard.
     *
     * The default value is 1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-parallelizationfactor
     */
    readonly parallelizationFactor?: number;

    /**
     * (Streams only) The position in a stream from which to start reading.
     *
     * *Valid values* : `TRIM_HORIZON | LATEST`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-startingposition
     */
    readonly startingPosition: string;
  }

  /**
   * A `DeadLetterConfig` object that contains information about a dead-letter queue configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-deadletterconfig.html
   */
  export interface DeadLetterConfigProperty {
    /**
     * The ARN of the specified target for the dead-letter queue.
     *
     * For Amazon Kinesis stream and Amazon DynamoDB stream sources, specify either an Amazon SNS topic or Amazon SQS queue ARN.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-deadletterconfig.html#cfn-pipes-pipe-deadletterconfig-arn
     */
    readonly arn?: string;
  }

  /**
   * The parameters for using a stream as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html
   */
  export interface PipeSourceSelfManagedKafkaParametersProperty {
    /**
     * An array of server URLs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-additionalbootstrapservers
     */
    readonly additionalBootstrapServers?: Array<string>;

    /**
     * The maximum number of records to include in each batch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-batchsize
     */
    readonly batchSize?: number;

    /**
     * The name of the destination queue to consume.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-consumergroupid
     */
    readonly consumerGroupId?: string;

    /**
     * The credentials needed to access the resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-credentials
     */
    readonly credentials?: cdk.IResolvable | CfnPipe.SelfManagedKafkaAccessConfigurationCredentialsProperty;

    /**
     * The maximum length of a time to wait for events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-maximumbatchingwindowinseconds
     */
    readonly maximumBatchingWindowInSeconds?: number;

    /**
     * The ARN of the Secrets Manager secret used for certification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-serverrootcacertificate
     */
    readonly serverRootCaCertificate?: string;

    /**
     * (Streams only) The position in a stream from which to start reading.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-startingposition
     */
    readonly startingPosition?: string;

    /**
     * The name of the topic that the pipe will read from.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-topicname
     */
    readonly topicName: string;

    /**
     * This structure specifies the VPC subnets and security groups for the stream, and whether a public IP address is to be used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-vpc
     */
    readonly vpc?: cdk.IResolvable | CfnPipe.SelfManagedKafkaAccessConfigurationVpcProperty;
  }

  /**
   * This structure specifies the VPC subnets and security groups for the stream, and whether a public IP address is to be used.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationvpc.html
   */
  export interface SelfManagedKafkaAccessConfigurationVpcProperty {
    /**
     * Specifies the security groups associated with the stream.
     *
     * These security groups must all be in the same VPC. You can specify as many as five security groups. If you do not specify a security group, the default security group for the VPC is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationvpc.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationvpc-securitygroup
     */
    readonly securityGroup?: Array<string>;

    /**
     * Specifies the subnets associated with the stream.
     *
     * These subnets must all be in the same VPC. You can specify as many as 16 subnets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationvpc.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationvpc-subnets
     */
    readonly subnets?: Array<string>;
  }

  /**
   * The AWS Secrets Manager secret that stores your stream credentials.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials.html
   */
  export interface SelfManagedKafkaAccessConfigurationCredentialsProperty {
    /**
     * The ARN of the Secrets Manager secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials-basicauth
     */
    readonly basicAuth?: string;

    /**
     * The ARN of the Secrets Manager secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials-clientcertificatetlsauth
     */
    readonly clientCertificateTlsAuth?: string;

    /**
     * The ARN of the Secrets Manager secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials-saslscram256auth
     */
    readonly saslScram256Auth?: string;

    /**
     * The ARN of the Secrets Manager secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials-saslscram512auth
     */
    readonly saslScram512Auth?: string;
  }

  /**
   * The parameters for using a Rabbit MQ broker as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html
   */
  export interface PipeSourceRabbitMQBrokerParametersProperty {
    /**
     * The maximum number of records to include in each batch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html#cfn-pipes-pipe-pipesourcerabbitmqbrokerparameters-batchsize
     */
    readonly batchSize?: number;

    /**
     * The credentials needed to access the resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html#cfn-pipes-pipe-pipesourcerabbitmqbrokerparameters-credentials
     */
    readonly credentials: cdk.IResolvable | CfnPipe.MQBrokerAccessCredentialsProperty;

    /**
     * The maximum length of a time to wait for events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html#cfn-pipes-pipe-pipesourcerabbitmqbrokerparameters-maximumbatchingwindowinseconds
     */
    readonly maximumBatchingWindowInSeconds?: number;

    /**
     * The name of the destination queue to consume.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html#cfn-pipes-pipe-pipesourcerabbitmqbrokerparameters-queuename
     */
    readonly queueName: string;

    /**
     * The name of the virtual host associated with the source broker.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html#cfn-pipes-pipe-pipesourcerabbitmqbrokerparameters-virtualhost
     */
    readonly virtualHost?: string;
  }

  /**
   * The AWS Secrets Manager secret that stores your broker credentials.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-mqbrokeraccesscredentials.html
   */
  export interface MQBrokerAccessCredentialsProperty {
    /**
     * The ARN of the Secrets Manager secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-mqbrokeraccesscredentials.html#cfn-pipes-pipe-mqbrokeraccesscredentials-basicauth
     */
    readonly basicAuth: string;
  }

  /**
   * The parameters for using a Amazon SQS stream as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcesqsqueueparameters.html
   */
  export interface PipeSourceSqsQueueParametersProperty {
    /**
     * The maximum number of records to include in each batch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcesqsqueueparameters.html#cfn-pipes-pipe-pipesourcesqsqueueparameters-batchsize
     */
    readonly batchSize?: number;

    /**
     * The maximum length of a time to wait for events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcesqsqueueparameters.html#cfn-pipes-pipe-pipesourcesqsqueueparameters-maximumbatchingwindowinseconds
     */
    readonly maximumBatchingWindowInSeconds?: number;
  }

  /**
   * The parameters for using a Kinesis stream as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html
   */
  export interface PipeSourceKinesisStreamParametersProperty {
    /**
     * The maximum number of records to include in each batch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-batchsize
     */
    readonly batchSize?: number;

    /**
     * Define the target queue to send dead-letter queue events to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-deadletterconfig
     */
    readonly deadLetterConfig?: CfnPipe.DeadLetterConfigProperty | cdk.IResolvable;

    /**
     * The maximum length of a time to wait for events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumbatchingwindowinseconds
     */
    readonly maximumBatchingWindowInSeconds?: number;

    /**
     * (Streams only) Discard records older than the specified age.
     *
     * The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, EventBridge never discards old records.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumrecordageinseconds
     */
    readonly maximumRecordAgeInSeconds?: number;

    /**
     * (Streams only) Discard records after the specified number of retries.
     *
     * The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, EventBridge retries failed records until the record expires in the event source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumretryattempts
     */
    readonly maximumRetryAttempts?: number;

    /**
     * (Streams only) Define how to handle item process failures.
     *
     * `AUTOMATIC_BISECT` halves each batch and retry each half until all the records are processed or there is one failed message left in the batch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-onpartialbatchitemfailure
     */
    readonly onPartialBatchItemFailure?: string;

    /**
     * (Streams only) The number of batches to process concurrently from each shard.
     *
     * The default value is 1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-parallelizationfactor
     */
    readonly parallelizationFactor?: number;

    /**
     * (Streams only) The position in a stream from which to start reading.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-startingposition
     */
    readonly startingPosition: string;

    /**
     * With `StartingPosition` set to `AT_TIMESTAMP` , the time from which to start reading, in Unix time seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-startingpositiontimestamp
     */
    readonly startingPositionTimestamp?: string;
  }

  /**
   * The collection of event patterns used to filter events.
   *
   * To remove a filter, specify a `FilterCriteria` object with an empty array of `Filter` objects.
   *
   * For more information, see [Events and Event Patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eventbridge-and-event-patterns.html) in the *Amazon EventBridge User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-filtercriteria.html
   */
  export interface FilterCriteriaProperty {
    /**
     * The event patterns.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-filtercriteria.html#cfn-pipes-pipe-filtercriteria-filters
     */
    readonly filters?: Array<CfnPipe.FilterProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Filter events using an event pattern.
   *
   * For more information, see [Events and Event Patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eventbridge-and-event-patterns.html) in the *Amazon EventBridge User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-filter.html
   */
  export interface FilterProperty {
    /**
     * The event pattern.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-filter.html#cfn-pipes-pipe-filter-pattern
     */
    readonly pattern?: string;
  }

  /**
   * The parameters for using an Active MQ broker as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceactivemqbrokerparameters.html
   */
  export interface PipeSourceActiveMQBrokerParametersProperty {
    /**
     * The maximum number of records to include in each batch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceactivemqbrokerparameters.html#cfn-pipes-pipe-pipesourceactivemqbrokerparameters-batchsize
     */
    readonly batchSize?: number;

    /**
     * The credentials needed to access the resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceactivemqbrokerparameters.html#cfn-pipes-pipe-pipesourceactivemqbrokerparameters-credentials
     */
    readonly credentials: cdk.IResolvable | CfnPipe.MQBrokerAccessCredentialsProperty;

    /**
     * The maximum length of a time to wait for events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceactivemqbrokerparameters.html#cfn-pipes-pipe-pipesourceactivemqbrokerparameters-maximumbatchingwindowinseconds
     */
    readonly maximumBatchingWindowInSeconds?: number;

    /**
     * The name of the destination queue to consume.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceactivemqbrokerparameters.html#cfn-pipes-pipe-pipesourceactivemqbrokerparameters-queuename
     */
    readonly queueName: string;
  }

  /**
   * Represents the configuration settings for the logs to which this pipe should report events.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html
   */
  export interface PipeLogConfigurationProperty {
    /**
     * The logging configuration settings for the pipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-cloudwatchlogslogdestination
     */
    readonly cloudwatchLogsLogDestination?: CfnPipe.CloudwatchLogsLogDestinationProperty | cdk.IResolvable;

    /**
     * The Amazon Kinesis Data Firehose logging configuration settings for the pipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-firehoselogdestination
     */
    readonly firehoseLogDestination?: CfnPipe.FirehoseLogDestinationProperty | cdk.IResolvable;

    /**
     * Whether the execution data (specifically, the `payload` , `awsRequest` , and `awsResponse` fields) is included in the log messages for this pipe.
     *
     * This applies to all log destinations for the pipe.
     *
     * For more information, see [Including execution data in logs](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-logs.html#eb-pipes-logs-execution-data) in the *Amazon EventBridge User Guide* .
     *
     * *Allowed values:* `ALL`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-includeexecutiondata
     */
    readonly includeExecutionData?: Array<string>;

    /**
     * The level of logging detail to include.
     *
     * This applies to all log destinations for the pipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-level
     */
    readonly level?: string;

    /**
     * The Amazon S3 logging configuration settings for the pipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipelogconfiguration.html#cfn-pipes-pipe-pipelogconfiguration-s3logdestination
     */
    readonly s3LogDestination?: cdk.IResolvable | CfnPipe.S3LogDestinationProperty;
  }

  /**
   * Represents the Amazon S3 logging configuration settings for the pipe.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html
   */
  export interface S3LogDestinationProperty {
    /**
     * The name of the Amazon S3 bucket to which EventBridge delivers the log records for the pipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-bucketname
     */
    readonly bucketName?: string;

    /**
     * The AWS account that owns the Amazon S3 bucket to which EventBridge delivers the log records for the pipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-bucketowner
     */
    readonly bucketOwner?: string;

    /**
     * The format EventBridge uses for the log records.
     *
     * - `json` : JSON
     * - `plain` : Plain text
     * - `w3c` : [W3C extended logging file format](https://docs.aws.amazon.com/https://www.w3.org/TR/WD-logfile)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-outputformat
     */
    readonly outputFormat?: string;

    /**
     * The prefix text with which to begin Amazon S3 log object names.
     *
     * For more information, see [Organizing objects using prefixes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-prefixes.html) in the *Amazon Simple Storage Service User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-s3logdestination.html#cfn-pipes-pipe-s3logdestination-prefix
     */
    readonly prefix?: string;
  }

  /**
   * Represents the Amazon Kinesis Data Firehose logging configuration settings for the pipe.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-firehoselogdestination.html
   */
  export interface FirehoseLogDestinationProperty {
    /**
     * The Amazon Resource Name (ARN) of the Kinesis Data Firehose delivery stream to which EventBridge delivers the pipe log records.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-firehoselogdestination.html#cfn-pipes-pipe-firehoselogdestination-deliverystreamarn
     */
    readonly deliveryStreamArn?: string;
  }

  /**
   * Represents the Amazon CloudWatch Logs logging configuration settings for the pipe.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-cloudwatchlogslogdestination.html
   */
  export interface CloudwatchLogsLogDestinationProperty {
    /**
     * The AWS Resource Name (ARN) for the CloudWatch log group to which EventBridge sends the log records.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-cloudwatchlogslogdestination.html#cfn-pipes-pipe-cloudwatchlogslogdestination-loggrouparn
     */
    readonly logGroupArn?: string;
  }
}

/**
 * Properties for defining a `CfnPipe`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html
 */
export interface CfnPipeProps {
  /**
   * A description of the pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-description
   */
  readonly description?: string;

  /**
   * The state the pipe should be in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-desiredstate
   */
  readonly desiredState?: string;

  /**
   * The ARN of the enrichment resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-enrichment
   */
  readonly enrichment?: string;

  /**
   * The parameters required to set up enrichment on your pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-enrichmentparameters
   */
  readonly enrichmentParameters?: cdk.IResolvable | CfnPipe.PipeEnrichmentParametersProperty;

  /**
   * The logging configuration settings for the pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-logconfiguration
   */
  readonly logConfiguration?: cdk.IResolvable | CfnPipe.PipeLogConfigurationProperty;

  /**
   * The name of the pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-name
   */
  readonly name?: string;

  /**
   * The ARN of the role that allows the pipe to send data to the target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-rolearn
   */
  readonly roleArn: string;

  /**
   * The ARN of the source resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-source
   */
  readonly source: string;

  /**
   * The parameters required to set up a source for your pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-sourceparameters
   */
  readonly sourceParameters?: cdk.IResolvable | CfnPipe.PipeSourceParametersProperty;

  /**
   * The list of key-value pairs to associate with the pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The ARN of the target resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-target
   */
  readonly target: string;

  /**
   * The parameters required to set up a target for your pipe.
   *
   * For more information about pipe target parameters, including how to use dynamic path parameters, see [Target parameters](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-target.html) in the *Amazon EventBridge User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-targetparameters
   */
  readonly targetParameters?: cdk.IResolvable | CfnPipe.PipeTargetParametersProperty;
}

/**
 * Determine whether the given properties match those of a `PipeTargetStateMachineParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetStateMachineParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeTargetStateMachineParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("invocationType", cdk.validateString)(properties.invocationType));
  return errors.wrap("supplied properties not correct for \"PipeTargetStateMachineParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeTargetStateMachineParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeTargetStateMachineParametersPropertyValidator(properties).assertSuccess();
  return {
    "InvocationType": cdk.stringToCloudFormation(properties.invocationType)
  };
}

// @ts-ignore TS6133
function CfnPipePipeTargetStateMachineParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeTargetStateMachineParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetStateMachineParametersProperty>();
  ret.addPropertyResult("invocationType", "InvocationType", (properties.InvocationType != null ? cfn_parse.FromCloudFormation.getString(properties.InvocationType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeTargetHttpParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetHttpParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeTargetHttpParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("headerParameters", cdk.hashValidator(cdk.validateString))(properties.headerParameters));
  errors.collect(cdk.propertyValidator("pathParameterValues", cdk.listValidator(cdk.validateString))(properties.pathParameterValues));
  errors.collect(cdk.propertyValidator("queryStringParameters", cdk.hashValidator(cdk.validateString))(properties.queryStringParameters));
  return errors.wrap("supplied properties not correct for \"PipeTargetHttpParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeTargetHttpParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeTargetHttpParametersPropertyValidator(properties).assertSuccess();
  return {
    "HeaderParameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.headerParameters),
    "PathParameterValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.pathParameterValues),
    "QueryStringParameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.queryStringParameters)
  };
}

// @ts-ignore TS6133
function CfnPipePipeTargetHttpParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeTargetHttpParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetHttpParametersProperty>();
  ret.addPropertyResult("headerParameters", "HeaderParameters", (properties.HeaderParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.HeaderParameters) : undefined));
  ret.addPropertyResult("pathParameterValues", "PathParameterValues", (properties.PathParameterValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PathParameterValues) : undefined));
  ret.addPropertyResult("queryStringParameters", "QueryStringParameters", (properties.QueryStringParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.QueryStringParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeTargetSqsQueueParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetSqsQueueParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeTargetSqsQueueParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("messageDeduplicationId", cdk.validateString)(properties.messageDeduplicationId));
  errors.collect(cdk.propertyValidator("messageGroupId", cdk.validateString)(properties.messageGroupId));
  return errors.wrap("supplied properties not correct for \"PipeTargetSqsQueueParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeTargetSqsQueueParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeTargetSqsQueueParametersPropertyValidator(properties).assertSuccess();
  return {
    "MessageDeduplicationId": cdk.stringToCloudFormation(properties.messageDeduplicationId),
    "MessageGroupId": cdk.stringToCloudFormation(properties.messageGroupId)
  };
}

// @ts-ignore TS6133
function CfnPipePipeTargetSqsQueueParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeTargetSqsQueueParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetSqsQueueParametersProperty>();
  ret.addPropertyResult("messageDeduplicationId", "MessageDeduplicationId", (properties.MessageDeduplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.MessageDeduplicationId) : undefined));
  ret.addPropertyResult("messageGroupId", "MessageGroupId", (properties.MessageGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.MessageGroupId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeTargetCloudWatchLogsParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetCloudWatchLogsParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeTargetCloudWatchLogsParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logStreamName", cdk.validateString)(properties.logStreamName));
  errors.collect(cdk.propertyValidator("timestamp", cdk.validateString)(properties.timestamp));
  return errors.wrap("supplied properties not correct for \"PipeTargetCloudWatchLogsParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeTargetCloudWatchLogsParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeTargetCloudWatchLogsParametersPropertyValidator(properties).assertSuccess();
  return {
    "LogStreamName": cdk.stringToCloudFormation(properties.logStreamName),
    "Timestamp": cdk.stringToCloudFormation(properties.timestamp)
  };
}

// @ts-ignore TS6133
function CfnPipePipeTargetCloudWatchLogsParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeTargetCloudWatchLogsParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetCloudWatchLogsParametersProperty>();
  ret.addPropertyResult("logStreamName", "LogStreamName", (properties.LogStreamName != null ? cfn_parse.FromCloudFormation.getString(properties.LogStreamName) : undefined));
  ret.addPropertyResult("timestamp", "Timestamp", (properties.Timestamp != null ? cfn_parse.FromCloudFormation.getString(properties.Timestamp) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeTargetKinesisStreamParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetKinesisStreamParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeTargetKinesisStreamParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("partitionKey", cdk.requiredValidator)(properties.partitionKey));
  errors.collect(cdk.propertyValidator("partitionKey", cdk.validateString)(properties.partitionKey));
  return errors.wrap("supplied properties not correct for \"PipeTargetKinesisStreamParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeTargetKinesisStreamParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeTargetKinesisStreamParametersPropertyValidator(properties).assertSuccess();
  return {
    "PartitionKey": cdk.stringToCloudFormation(properties.partitionKey)
  };
}

// @ts-ignore TS6133
function CfnPipePipeTargetKinesisStreamParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeTargetKinesisStreamParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetKinesisStreamParametersProperty>();
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
function CfnPipeSageMakerPipelineParameterPropertyValidator(properties: any): cdk.ValidationResult {
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
function convertCfnPipeSageMakerPipelineParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeSageMakerPipelineParameterPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnPipeSageMakerPipelineParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.SageMakerPipelineParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.SageMakerPipelineParameterProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeTargetSageMakerPipelineParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetSageMakerPipelineParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeTargetSageMakerPipelineParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("pipelineParameterList", cdk.listValidator(CfnPipeSageMakerPipelineParameterPropertyValidator))(properties.pipelineParameterList));
  return errors.wrap("supplied properties not correct for \"PipeTargetSageMakerPipelineParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeTargetSageMakerPipelineParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeTargetSageMakerPipelineParametersPropertyValidator(properties).assertSuccess();
  return {
    "PipelineParameterList": cdk.listMapper(convertCfnPipeSageMakerPipelineParameterPropertyToCloudFormation)(properties.pipelineParameterList)
  };
}

// @ts-ignore TS6133
function CfnPipePipeTargetSageMakerPipelineParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeTargetSageMakerPipelineParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetSageMakerPipelineParametersProperty>();
  ret.addPropertyResult("pipelineParameterList", "PipelineParameterList", (properties.PipelineParameterList != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeSageMakerPipelineParameterPropertyFromCloudFormation)(properties.PipelineParameterList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeTargetEventBridgeEventBusParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetEventBridgeEventBusParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeTargetEventBridgeEventBusParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("detailType", cdk.validateString)(properties.detailType));
  errors.collect(cdk.propertyValidator("endpointId", cdk.validateString)(properties.endpointId));
  errors.collect(cdk.propertyValidator("resources", cdk.listValidator(cdk.validateString))(properties.resources));
  errors.collect(cdk.propertyValidator("source", cdk.validateString)(properties.source));
  errors.collect(cdk.propertyValidator("time", cdk.validateString)(properties.time));
  return errors.wrap("supplied properties not correct for \"PipeTargetEventBridgeEventBusParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeTargetEventBridgeEventBusParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeTargetEventBridgeEventBusParametersPropertyValidator(properties).assertSuccess();
  return {
    "DetailType": cdk.stringToCloudFormation(properties.detailType),
    "EndpointId": cdk.stringToCloudFormation(properties.endpointId),
    "Resources": cdk.listMapper(cdk.stringToCloudFormation)(properties.resources),
    "Source": cdk.stringToCloudFormation(properties.source),
    "Time": cdk.stringToCloudFormation(properties.time)
  };
}

// @ts-ignore TS6133
function CfnPipePipeTargetEventBridgeEventBusParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeTargetEventBridgeEventBusParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetEventBridgeEventBusParametersProperty>();
  ret.addPropertyResult("detailType", "DetailType", (properties.DetailType != null ? cfn_parse.FromCloudFormation.getString(properties.DetailType) : undefined));
  ret.addPropertyResult("endpointId", "EndpointId", (properties.EndpointId != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointId) : undefined));
  ret.addPropertyResult("resources", "Resources", (properties.Resources != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Resources) : undefined));
  ret.addPropertyResult("source", "Source", (properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined));
  ret.addPropertyResult("time", "Time", (properties.Time != null ? cfn_parse.FromCloudFormation.getString(properties.Time) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeTargetLambdaFunctionParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetLambdaFunctionParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeTargetLambdaFunctionParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("invocationType", cdk.validateString)(properties.invocationType));
  return errors.wrap("supplied properties not correct for \"PipeTargetLambdaFunctionParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeTargetLambdaFunctionParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeTargetLambdaFunctionParametersPropertyValidator(properties).assertSuccess();
  return {
    "InvocationType": cdk.stringToCloudFormation(properties.invocationType)
  };
}

// @ts-ignore TS6133
function CfnPipePipeTargetLambdaFunctionParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeTargetLambdaFunctionParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetLambdaFunctionParametersProperty>();
  ret.addPropertyResult("invocationType", "InvocationType", (properties.InvocationType != null ? cfn_parse.FromCloudFormation.getString(properties.InvocationType) : undefined));
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
function CfnPipePlacementConstraintPropertyValidator(properties: any): cdk.ValidationResult {
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
function convertCfnPipePlacementConstraintPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePlacementConstraintPropertyValidator(properties).assertSuccess();
  return {
    "Expression": cdk.stringToCloudFormation(properties.expression),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnPipePlacementConstraintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PlacementConstraintProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PlacementConstraintProperty>();
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
function CfnPipePlacementStrategyPropertyValidator(properties: any): cdk.ValidationResult {
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
function convertCfnPipePlacementStrategyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePlacementStrategyPropertyValidator(properties).assertSuccess();
  return {
    "Field": cdk.stringToCloudFormation(properties.field),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnPipePlacementStrategyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PlacementStrategyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PlacementStrategyProperty>();
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
function CfnPipeCapacityProviderStrategyItemPropertyValidator(properties: any): cdk.ValidationResult {
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
function convertCfnPipeCapacityProviderStrategyItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeCapacityProviderStrategyItemPropertyValidator(properties).assertSuccess();
  return {
    "Base": cdk.numberToCloudFormation(properties.base),
    "CapacityProvider": cdk.stringToCloudFormation(properties.capacityProvider),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnPipeCapacityProviderStrategyItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.CapacityProviderStrategyItemProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.CapacityProviderStrategyItemProperty>();
  ret.addPropertyResult("base", "Base", (properties.Base != null ? cfn_parse.FromCloudFormation.getNumber(properties.Base) : undefined));
  ret.addPropertyResult("capacityProvider", "CapacityProvider", (properties.CapacityProvider != null ? cfn_parse.FromCloudFormation.getString(properties.CapacityProvider) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EcsInferenceAcceleratorOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `EcsInferenceAcceleratorOverrideProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeEcsInferenceAcceleratorOverridePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deviceName", cdk.validateString)(properties.deviceName));
  errors.collect(cdk.propertyValidator("deviceType", cdk.validateString)(properties.deviceType));
  return errors.wrap("supplied properties not correct for \"EcsInferenceAcceleratorOverrideProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeEcsInferenceAcceleratorOverridePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeEcsInferenceAcceleratorOverridePropertyValidator(properties).assertSuccess();
  return {
    "DeviceName": cdk.stringToCloudFormation(properties.deviceName),
    "DeviceType": cdk.stringToCloudFormation(properties.deviceType)
  };
}

// @ts-ignore TS6133
function CfnPipeEcsInferenceAcceleratorOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.EcsInferenceAcceleratorOverrideProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.EcsInferenceAcceleratorOverrideProperty>();
  ret.addPropertyResult("deviceName", "DeviceName", (properties.DeviceName != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceName) : undefined));
  ret.addPropertyResult("deviceType", "DeviceType", (properties.DeviceType != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EcsEphemeralStorageProperty`
 *
 * @param properties - the TypeScript properties of a `EcsEphemeralStorageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeEcsEphemeralStoragePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sizeInGiB", cdk.requiredValidator)(properties.sizeInGiB));
  errors.collect(cdk.propertyValidator("sizeInGiB", cdk.validateNumber)(properties.sizeInGiB));
  return errors.wrap("supplied properties not correct for \"EcsEphemeralStorageProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeEcsEphemeralStoragePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeEcsEphemeralStoragePropertyValidator(properties).assertSuccess();
  return {
    "SizeInGiB": cdk.numberToCloudFormation(properties.sizeInGiB)
  };
}

// @ts-ignore TS6133
function CfnPipeEcsEphemeralStoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.EcsEphemeralStorageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.EcsEphemeralStorageProperty>();
  ret.addPropertyResult("sizeInGiB", "SizeInGiB", (properties.SizeInGiB != null ? cfn_parse.FromCloudFormation.getNumber(properties.SizeInGiB) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EcsEnvironmentVariableProperty`
 *
 * @param properties - the TypeScript properties of a `EcsEnvironmentVariableProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeEcsEnvironmentVariablePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"EcsEnvironmentVariableProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeEcsEnvironmentVariablePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeEcsEnvironmentVariablePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnPipeEcsEnvironmentVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.EcsEnvironmentVariableProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.EcsEnvironmentVariableProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EcsResourceRequirementProperty`
 *
 * @param properties - the TypeScript properties of a `EcsResourceRequirementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeEcsResourceRequirementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"EcsResourceRequirementProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeEcsResourceRequirementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeEcsResourceRequirementPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnPipeEcsResourceRequirementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.EcsResourceRequirementProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.EcsResourceRequirementProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EcsEnvironmentFileProperty`
 *
 * @param properties - the TypeScript properties of a `EcsEnvironmentFileProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeEcsEnvironmentFilePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"EcsEnvironmentFileProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeEcsEnvironmentFilePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeEcsEnvironmentFilePropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnPipeEcsEnvironmentFilePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.EcsEnvironmentFileProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.EcsEnvironmentFileProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EcsContainerOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `EcsContainerOverrideProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeEcsContainerOverridePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("command", cdk.listValidator(cdk.validateString))(properties.command));
  errors.collect(cdk.propertyValidator("cpu", cdk.validateNumber)(properties.cpu));
  errors.collect(cdk.propertyValidator("environment", cdk.listValidator(CfnPipeEcsEnvironmentVariablePropertyValidator))(properties.environment));
  errors.collect(cdk.propertyValidator("environmentFiles", cdk.listValidator(CfnPipeEcsEnvironmentFilePropertyValidator))(properties.environmentFiles));
  errors.collect(cdk.propertyValidator("memory", cdk.validateNumber)(properties.memory));
  errors.collect(cdk.propertyValidator("memoryReservation", cdk.validateNumber)(properties.memoryReservation));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("resourceRequirements", cdk.listValidator(CfnPipeEcsResourceRequirementPropertyValidator))(properties.resourceRequirements));
  return errors.wrap("supplied properties not correct for \"EcsContainerOverrideProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeEcsContainerOverridePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeEcsContainerOverridePropertyValidator(properties).assertSuccess();
  return {
    "Command": cdk.listMapper(cdk.stringToCloudFormation)(properties.command),
    "Cpu": cdk.numberToCloudFormation(properties.cpu),
    "Environment": cdk.listMapper(convertCfnPipeEcsEnvironmentVariablePropertyToCloudFormation)(properties.environment),
    "EnvironmentFiles": cdk.listMapper(convertCfnPipeEcsEnvironmentFilePropertyToCloudFormation)(properties.environmentFiles),
    "Memory": cdk.numberToCloudFormation(properties.memory),
    "MemoryReservation": cdk.numberToCloudFormation(properties.memoryReservation),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ResourceRequirements": cdk.listMapper(convertCfnPipeEcsResourceRequirementPropertyToCloudFormation)(properties.resourceRequirements)
  };
}

// @ts-ignore TS6133
function CfnPipeEcsContainerOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.EcsContainerOverrideProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.EcsContainerOverrideProperty>();
  ret.addPropertyResult("command", "Command", (properties.Command != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Command) : undefined));
  ret.addPropertyResult("cpu", "Cpu", (properties.Cpu != null ? cfn_parse.FromCloudFormation.getNumber(properties.Cpu) : undefined));
  ret.addPropertyResult("environment", "Environment", (properties.Environment != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeEcsEnvironmentVariablePropertyFromCloudFormation)(properties.Environment) : undefined));
  ret.addPropertyResult("environmentFiles", "EnvironmentFiles", (properties.EnvironmentFiles != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeEcsEnvironmentFilePropertyFromCloudFormation)(properties.EnvironmentFiles) : undefined));
  ret.addPropertyResult("memory", "Memory", (properties.Memory != null ? cfn_parse.FromCloudFormation.getNumber(properties.Memory) : undefined));
  ret.addPropertyResult("memoryReservation", "MemoryReservation", (properties.MemoryReservation != null ? cfn_parse.FromCloudFormation.getNumber(properties.MemoryReservation) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("resourceRequirements", "ResourceRequirements", (properties.ResourceRequirements != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeEcsResourceRequirementPropertyFromCloudFormation)(properties.ResourceRequirements) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EcsTaskOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `EcsTaskOverrideProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeEcsTaskOverridePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerOverrides", cdk.listValidator(CfnPipeEcsContainerOverridePropertyValidator))(properties.containerOverrides));
  errors.collect(cdk.propertyValidator("cpu", cdk.validateString)(properties.cpu));
  errors.collect(cdk.propertyValidator("ephemeralStorage", CfnPipeEcsEphemeralStoragePropertyValidator)(properties.ephemeralStorage));
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.validateString)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("inferenceAcceleratorOverrides", cdk.listValidator(CfnPipeEcsInferenceAcceleratorOverridePropertyValidator))(properties.inferenceAcceleratorOverrides));
  errors.collect(cdk.propertyValidator("memory", cdk.validateString)(properties.memory));
  errors.collect(cdk.propertyValidator("taskRoleArn", cdk.validateString)(properties.taskRoleArn));
  return errors.wrap("supplied properties not correct for \"EcsTaskOverrideProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeEcsTaskOverridePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeEcsTaskOverridePropertyValidator(properties).assertSuccess();
  return {
    "ContainerOverrides": cdk.listMapper(convertCfnPipeEcsContainerOverridePropertyToCloudFormation)(properties.containerOverrides),
    "Cpu": cdk.stringToCloudFormation(properties.cpu),
    "EphemeralStorage": convertCfnPipeEcsEphemeralStoragePropertyToCloudFormation(properties.ephemeralStorage),
    "ExecutionRoleArn": cdk.stringToCloudFormation(properties.executionRoleArn),
    "InferenceAcceleratorOverrides": cdk.listMapper(convertCfnPipeEcsInferenceAcceleratorOverridePropertyToCloudFormation)(properties.inferenceAcceleratorOverrides),
    "Memory": cdk.stringToCloudFormation(properties.memory),
    "TaskRoleArn": cdk.stringToCloudFormation(properties.taskRoleArn)
  };
}

// @ts-ignore TS6133
function CfnPipeEcsTaskOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.EcsTaskOverrideProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.EcsTaskOverrideProperty>();
  ret.addPropertyResult("containerOverrides", "ContainerOverrides", (properties.ContainerOverrides != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeEcsContainerOverridePropertyFromCloudFormation)(properties.ContainerOverrides) : undefined));
  ret.addPropertyResult("cpu", "Cpu", (properties.Cpu != null ? cfn_parse.FromCloudFormation.getString(properties.Cpu) : undefined));
  ret.addPropertyResult("ephemeralStorage", "EphemeralStorage", (properties.EphemeralStorage != null ? CfnPipeEcsEphemeralStoragePropertyFromCloudFormation(properties.EphemeralStorage) : undefined));
  ret.addPropertyResult("executionRoleArn", "ExecutionRoleArn", (properties.ExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn) : undefined));
  ret.addPropertyResult("inferenceAcceleratorOverrides", "InferenceAcceleratorOverrides", (properties.InferenceAcceleratorOverrides != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeEcsInferenceAcceleratorOverridePropertyFromCloudFormation)(properties.InferenceAcceleratorOverrides) : undefined));
  ret.addPropertyResult("memory", "Memory", (properties.Memory != null ? cfn_parse.FromCloudFormation.getString(properties.Memory) : undefined));
  ret.addPropertyResult("taskRoleArn", "TaskRoleArn", (properties.TaskRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.TaskRoleArn) : undefined));
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
function CfnPipeAwsVpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
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
function convertCfnPipeAwsVpcConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeAwsVpcConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AssignPublicIp": cdk.stringToCloudFormation(properties.assignPublicIp),
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets)
  };
}

// @ts-ignore TS6133
function CfnPipeAwsVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.AwsVpcConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.AwsVpcConfigurationProperty>();
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
function CfnPipeNetworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsvpcConfiguration", CfnPipeAwsVpcConfigurationPropertyValidator)(properties.awsvpcConfiguration));
  return errors.wrap("supplied properties not correct for \"NetworkConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeNetworkConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeNetworkConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AwsvpcConfiguration": convertCfnPipeAwsVpcConfigurationPropertyToCloudFormation(properties.awsvpcConfiguration)
  };
}

// @ts-ignore TS6133
function CfnPipeNetworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.NetworkConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.NetworkConfigurationProperty>();
  ret.addPropertyResult("awsvpcConfiguration", "AwsvpcConfiguration", (properties.AwsvpcConfiguration != null ? CfnPipeAwsVpcConfigurationPropertyFromCloudFormation(properties.AwsvpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeTargetEcsTaskParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetEcsTaskParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeTargetEcsTaskParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capacityProviderStrategy", cdk.listValidator(CfnPipeCapacityProviderStrategyItemPropertyValidator))(properties.capacityProviderStrategy));
  errors.collect(cdk.propertyValidator("enableEcsManagedTags", cdk.validateBoolean)(properties.enableEcsManagedTags));
  errors.collect(cdk.propertyValidator("enableExecuteCommand", cdk.validateBoolean)(properties.enableExecuteCommand));
  errors.collect(cdk.propertyValidator("group", cdk.validateString)(properties.group));
  errors.collect(cdk.propertyValidator("launchType", cdk.validateString)(properties.launchType));
  errors.collect(cdk.propertyValidator("networkConfiguration", CfnPipeNetworkConfigurationPropertyValidator)(properties.networkConfiguration));
  errors.collect(cdk.propertyValidator("overrides", CfnPipeEcsTaskOverridePropertyValidator)(properties.overrides));
  errors.collect(cdk.propertyValidator("placementConstraints", cdk.listValidator(CfnPipePlacementConstraintPropertyValidator))(properties.placementConstraints));
  errors.collect(cdk.propertyValidator("placementStrategy", cdk.listValidator(CfnPipePlacementStrategyPropertyValidator))(properties.placementStrategy));
  errors.collect(cdk.propertyValidator("platformVersion", cdk.validateString)(properties.platformVersion));
  errors.collect(cdk.propertyValidator("propagateTags", cdk.validateString)(properties.propagateTags));
  errors.collect(cdk.propertyValidator("referenceId", cdk.validateString)(properties.referenceId));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("taskCount", cdk.validateNumber)(properties.taskCount));
  errors.collect(cdk.propertyValidator("taskDefinitionArn", cdk.requiredValidator)(properties.taskDefinitionArn));
  errors.collect(cdk.propertyValidator("taskDefinitionArn", cdk.validateString)(properties.taskDefinitionArn));
  return errors.wrap("supplied properties not correct for \"PipeTargetEcsTaskParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeTargetEcsTaskParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeTargetEcsTaskParametersPropertyValidator(properties).assertSuccess();
  return {
    "CapacityProviderStrategy": cdk.listMapper(convertCfnPipeCapacityProviderStrategyItemPropertyToCloudFormation)(properties.capacityProviderStrategy),
    "EnableECSManagedTags": cdk.booleanToCloudFormation(properties.enableEcsManagedTags),
    "EnableExecuteCommand": cdk.booleanToCloudFormation(properties.enableExecuteCommand),
    "Group": cdk.stringToCloudFormation(properties.group),
    "LaunchType": cdk.stringToCloudFormation(properties.launchType),
    "NetworkConfiguration": convertCfnPipeNetworkConfigurationPropertyToCloudFormation(properties.networkConfiguration),
    "Overrides": convertCfnPipeEcsTaskOverridePropertyToCloudFormation(properties.overrides),
    "PlacementConstraints": cdk.listMapper(convertCfnPipePlacementConstraintPropertyToCloudFormation)(properties.placementConstraints),
    "PlacementStrategy": cdk.listMapper(convertCfnPipePlacementStrategyPropertyToCloudFormation)(properties.placementStrategy),
    "PlatformVersion": cdk.stringToCloudFormation(properties.platformVersion),
    "PropagateTags": cdk.stringToCloudFormation(properties.propagateTags),
    "ReferenceId": cdk.stringToCloudFormation(properties.referenceId),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TaskCount": cdk.numberToCloudFormation(properties.taskCount),
    "TaskDefinitionArn": cdk.stringToCloudFormation(properties.taskDefinitionArn)
  };
}

// @ts-ignore TS6133
function CfnPipePipeTargetEcsTaskParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeTargetEcsTaskParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetEcsTaskParametersProperty>();
  ret.addPropertyResult("capacityProviderStrategy", "CapacityProviderStrategy", (properties.CapacityProviderStrategy != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeCapacityProviderStrategyItemPropertyFromCloudFormation)(properties.CapacityProviderStrategy) : undefined));
  ret.addPropertyResult("enableEcsManagedTags", "EnableECSManagedTags", (properties.EnableECSManagedTags != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableECSManagedTags) : undefined));
  ret.addPropertyResult("enableExecuteCommand", "EnableExecuteCommand", (properties.EnableExecuteCommand != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableExecuteCommand) : undefined));
  ret.addPropertyResult("group", "Group", (properties.Group != null ? cfn_parse.FromCloudFormation.getString(properties.Group) : undefined));
  ret.addPropertyResult("launchType", "LaunchType", (properties.LaunchType != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchType) : undefined));
  ret.addPropertyResult("networkConfiguration", "NetworkConfiguration", (properties.NetworkConfiguration != null ? CfnPipeNetworkConfigurationPropertyFromCloudFormation(properties.NetworkConfiguration) : undefined));
  ret.addPropertyResult("overrides", "Overrides", (properties.Overrides != null ? CfnPipeEcsTaskOverridePropertyFromCloudFormation(properties.Overrides) : undefined));
  ret.addPropertyResult("placementConstraints", "PlacementConstraints", (properties.PlacementConstraints != null ? cfn_parse.FromCloudFormation.getArray(CfnPipePlacementConstraintPropertyFromCloudFormation)(properties.PlacementConstraints) : undefined));
  ret.addPropertyResult("placementStrategy", "PlacementStrategy", (properties.PlacementStrategy != null ? cfn_parse.FromCloudFormation.getArray(CfnPipePlacementStrategyPropertyFromCloudFormation)(properties.PlacementStrategy) : undefined));
  ret.addPropertyResult("platformVersion", "PlatformVersion", (properties.PlatformVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PlatformVersion) : undefined));
  ret.addPropertyResult("propagateTags", "PropagateTags", (properties.PropagateTags != null ? cfn_parse.FromCloudFormation.getString(properties.PropagateTags) : undefined));
  ret.addPropertyResult("referenceId", "ReferenceId", (properties.ReferenceId != null ? cfn_parse.FromCloudFormation.getString(properties.ReferenceId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("taskCount", "TaskCount", (properties.TaskCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.TaskCount) : undefined));
  ret.addPropertyResult("taskDefinitionArn", "TaskDefinitionArn", (properties.TaskDefinitionArn != null ? cfn_parse.FromCloudFormation.getString(properties.TaskDefinitionArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BatchJobDependencyProperty`
 *
 * @param properties - the TypeScript properties of a `BatchJobDependencyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeBatchJobDependencyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("jobId", cdk.validateString)(properties.jobId));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"BatchJobDependencyProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeBatchJobDependencyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeBatchJobDependencyPropertyValidator(properties).assertSuccess();
  return {
    "JobId": cdk.stringToCloudFormation(properties.jobId),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnPipeBatchJobDependencyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.BatchJobDependencyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.BatchJobDependencyProperty>();
  ret.addPropertyResult("jobId", "JobId", (properties.JobId != null ? cfn_parse.FromCloudFormation.getString(properties.JobId) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BatchArrayPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `BatchArrayPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeBatchArrayPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("size", cdk.validateNumber)(properties.size));
  return errors.wrap("supplied properties not correct for \"BatchArrayPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeBatchArrayPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeBatchArrayPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Size": cdk.numberToCloudFormation(properties.size)
  };
}

// @ts-ignore TS6133
function CfnPipeBatchArrayPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.BatchArrayPropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.BatchArrayPropertiesProperty>();
  ret.addPropertyResult("size", "Size", (properties.Size != null ? cfn_parse.FromCloudFormation.getNumber(properties.Size) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BatchRetryStrategyProperty`
 *
 * @param properties - the TypeScript properties of a `BatchRetryStrategyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeBatchRetryStrategyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attempts", cdk.validateNumber)(properties.attempts));
  return errors.wrap("supplied properties not correct for \"BatchRetryStrategyProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeBatchRetryStrategyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeBatchRetryStrategyPropertyValidator(properties).assertSuccess();
  return {
    "Attempts": cdk.numberToCloudFormation(properties.attempts)
  };
}

// @ts-ignore TS6133
function CfnPipeBatchRetryStrategyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.BatchRetryStrategyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.BatchRetryStrategyProperty>();
  ret.addPropertyResult("attempts", "Attempts", (properties.Attempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.Attempts) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BatchEnvironmentVariableProperty`
 *
 * @param properties - the TypeScript properties of a `BatchEnvironmentVariableProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeBatchEnvironmentVariablePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"BatchEnvironmentVariableProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeBatchEnvironmentVariablePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeBatchEnvironmentVariablePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnPipeBatchEnvironmentVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.BatchEnvironmentVariableProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.BatchEnvironmentVariableProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BatchResourceRequirementProperty`
 *
 * @param properties - the TypeScript properties of a `BatchResourceRequirementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeBatchResourceRequirementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"BatchResourceRequirementProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeBatchResourceRequirementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeBatchResourceRequirementPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnPipeBatchResourceRequirementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.BatchResourceRequirementProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.BatchResourceRequirementProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BatchContainerOverridesProperty`
 *
 * @param properties - the TypeScript properties of a `BatchContainerOverridesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeBatchContainerOverridesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("command", cdk.listValidator(cdk.validateString))(properties.command));
  errors.collect(cdk.propertyValidator("environment", cdk.listValidator(CfnPipeBatchEnvironmentVariablePropertyValidator))(properties.environment));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("resourceRequirements", cdk.listValidator(CfnPipeBatchResourceRequirementPropertyValidator))(properties.resourceRequirements));
  return errors.wrap("supplied properties not correct for \"BatchContainerOverridesProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeBatchContainerOverridesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeBatchContainerOverridesPropertyValidator(properties).assertSuccess();
  return {
    "Command": cdk.listMapper(cdk.stringToCloudFormation)(properties.command),
    "Environment": cdk.listMapper(convertCfnPipeBatchEnvironmentVariablePropertyToCloudFormation)(properties.environment),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "ResourceRequirements": cdk.listMapper(convertCfnPipeBatchResourceRequirementPropertyToCloudFormation)(properties.resourceRequirements)
  };
}

// @ts-ignore TS6133
function CfnPipeBatchContainerOverridesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.BatchContainerOverridesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.BatchContainerOverridesProperty>();
  ret.addPropertyResult("command", "Command", (properties.Command != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Command) : undefined));
  ret.addPropertyResult("environment", "Environment", (properties.Environment != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeBatchEnvironmentVariablePropertyFromCloudFormation)(properties.Environment) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("resourceRequirements", "ResourceRequirements", (properties.ResourceRequirements != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeBatchResourceRequirementPropertyFromCloudFormation)(properties.ResourceRequirements) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeTargetBatchJobParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetBatchJobParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeTargetBatchJobParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arrayProperties", CfnPipeBatchArrayPropertiesPropertyValidator)(properties.arrayProperties));
  errors.collect(cdk.propertyValidator("containerOverrides", CfnPipeBatchContainerOverridesPropertyValidator)(properties.containerOverrides));
  errors.collect(cdk.propertyValidator("dependsOn", cdk.listValidator(CfnPipeBatchJobDependencyPropertyValidator))(properties.dependsOn));
  errors.collect(cdk.propertyValidator("jobDefinition", cdk.requiredValidator)(properties.jobDefinition));
  errors.collect(cdk.propertyValidator("jobDefinition", cdk.validateString)(properties.jobDefinition));
  errors.collect(cdk.propertyValidator("jobName", cdk.requiredValidator)(properties.jobName));
  errors.collect(cdk.propertyValidator("jobName", cdk.validateString)(properties.jobName));
  errors.collect(cdk.propertyValidator("parameters", cdk.hashValidator(cdk.validateString))(properties.parameters));
  errors.collect(cdk.propertyValidator("retryStrategy", CfnPipeBatchRetryStrategyPropertyValidator)(properties.retryStrategy));
  return errors.wrap("supplied properties not correct for \"PipeTargetBatchJobParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeTargetBatchJobParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeTargetBatchJobParametersPropertyValidator(properties).assertSuccess();
  return {
    "ArrayProperties": convertCfnPipeBatchArrayPropertiesPropertyToCloudFormation(properties.arrayProperties),
    "ContainerOverrides": convertCfnPipeBatchContainerOverridesPropertyToCloudFormation(properties.containerOverrides),
    "DependsOn": cdk.listMapper(convertCfnPipeBatchJobDependencyPropertyToCloudFormation)(properties.dependsOn),
    "JobDefinition": cdk.stringToCloudFormation(properties.jobDefinition),
    "JobName": cdk.stringToCloudFormation(properties.jobName),
    "Parameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters),
    "RetryStrategy": convertCfnPipeBatchRetryStrategyPropertyToCloudFormation(properties.retryStrategy)
  };
}

// @ts-ignore TS6133
function CfnPipePipeTargetBatchJobParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeTargetBatchJobParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetBatchJobParametersProperty>();
  ret.addPropertyResult("arrayProperties", "ArrayProperties", (properties.ArrayProperties != null ? CfnPipeBatchArrayPropertiesPropertyFromCloudFormation(properties.ArrayProperties) : undefined));
  ret.addPropertyResult("containerOverrides", "ContainerOverrides", (properties.ContainerOverrides != null ? CfnPipeBatchContainerOverridesPropertyFromCloudFormation(properties.ContainerOverrides) : undefined));
  ret.addPropertyResult("dependsOn", "DependsOn", (properties.DependsOn != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeBatchJobDependencyPropertyFromCloudFormation)(properties.DependsOn) : undefined));
  ret.addPropertyResult("jobDefinition", "JobDefinition", (properties.JobDefinition != null ? cfn_parse.FromCloudFormation.getString(properties.JobDefinition) : undefined));
  ret.addPropertyResult("jobName", "JobName", (properties.JobName != null ? cfn_parse.FromCloudFormation.getString(properties.JobName) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Parameters) : undefined));
  ret.addPropertyResult("retryStrategy", "RetryStrategy", (properties.RetryStrategy != null ? CfnPipeBatchRetryStrategyPropertyFromCloudFormation(properties.RetryStrategy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeTargetRedshiftDataParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetRedshiftDataParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeTargetRedshiftDataParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("database", cdk.requiredValidator)(properties.database));
  errors.collect(cdk.propertyValidator("database", cdk.validateString)(properties.database));
  errors.collect(cdk.propertyValidator("dbUser", cdk.validateString)(properties.dbUser));
  errors.collect(cdk.propertyValidator("secretManagerArn", cdk.validateString)(properties.secretManagerArn));
  errors.collect(cdk.propertyValidator("sqls", cdk.requiredValidator)(properties.sqls));
  errors.collect(cdk.propertyValidator("sqls", cdk.listValidator(cdk.validateString))(properties.sqls));
  errors.collect(cdk.propertyValidator("statementName", cdk.validateString)(properties.statementName));
  errors.collect(cdk.propertyValidator("withEvent", cdk.validateBoolean)(properties.withEvent));
  return errors.wrap("supplied properties not correct for \"PipeTargetRedshiftDataParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeTargetRedshiftDataParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeTargetRedshiftDataParametersPropertyValidator(properties).assertSuccess();
  return {
    "Database": cdk.stringToCloudFormation(properties.database),
    "DbUser": cdk.stringToCloudFormation(properties.dbUser),
    "SecretManagerArn": cdk.stringToCloudFormation(properties.secretManagerArn),
    "Sqls": cdk.listMapper(cdk.stringToCloudFormation)(properties.sqls),
    "StatementName": cdk.stringToCloudFormation(properties.statementName),
    "WithEvent": cdk.booleanToCloudFormation(properties.withEvent)
  };
}

// @ts-ignore TS6133
function CfnPipePipeTargetRedshiftDataParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeTargetRedshiftDataParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetRedshiftDataParametersProperty>();
  ret.addPropertyResult("database", "Database", (properties.Database != null ? cfn_parse.FromCloudFormation.getString(properties.Database) : undefined));
  ret.addPropertyResult("dbUser", "DbUser", (properties.DbUser != null ? cfn_parse.FromCloudFormation.getString(properties.DbUser) : undefined));
  ret.addPropertyResult("secretManagerArn", "SecretManagerArn", (properties.SecretManagerArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretManagerArn) : undefined));
  ret.addPropertyResult("sqls", "Sqls", (properties.Sqls != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Sqls) : undefined));
  ret.addPropertyResult("statementName", "StatementName", (properties.StatementName != null ? cfn_parse.FromCloudFormation.getString(properties.StatementName) : undefined));
  ret.addPropertyResult("withEvent", "WithEvent", (properties.WithEvent != null ? cfn_parse.FromCloudFormation.getBoolean(properties.WithEvent) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeTargetParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeTargetParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeTargetParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchJobParameters", CfnPipePipeTargetBatchJobParametersPropertyValidator)(properties.batchJobParameters));
  errors.collect(cdk.propertyValidator("cloudWatchLogsParameters", CfnPipePipeTargetCloudWatchLogsParametersPropertyValidator)(properties.cloudWatchLogsParameters));
  errors.collect(cdk.propertyValidator("ecsTaskParameters", CfnPipePipeTargetEcsTaskParametersPropertyValidator)(properties.ecsTaskParameters));
  errors.collect(cdk.propertyValidator("eventBridgeEventBusParameters", CfnPipePipeTargetEventBridgeEventBusParametersPropertyValidator)(properties.eventBridgeEventBusParameters));
  errors.collect(cdk.propertyValidator("httpParameters", CfnPipePipeTargetHttpParametersPropertyValidator)(properties.httpParameters));
  errors.collect(cdk.propertyValidator("inputTemplate", cdk.validateString)(properties.inputTemplate));
  errors.collect(cdk.propertyValidator("kinesisStreamParameters", CfnPipePipeTargetKinesisStreamParametersPropertyValidator)(properties.kinesisStreamParameters));
  errors.collect(cdk.propertyValidator("lambdaFunctionParameters", CfnPipePipeTargetLambdaFunctionParametersPropertyValidator)(properties.lambdaFunctionParameters));
  errors.collect(cdk.propertyValidator("redshiftDataParameters", CfnPipePipeTargetRedshiftDataParametersPropertyValidator)(properties.redshiftDataParameters));
  errors.collect(cdk.propertyValidator("sageMakerPipelineParameters", CfnPipePipeTargetSageMakerPipelineParametersPropertyValidator)(properties.sageMakerPipelineParameters));
  errors.collect(cdk.propertyValidator("sqsQueueParameters", CfnPipePipeTargetSqsQueueParametersPropertyValidator)(properties.sqsQueueParameters));
  errors.collect(cdk.propertyValidator("stepFunctionStateMachineParameters", CfnPipePipeTargetStateMachineParametersPropertyValidator)(properties.stepFunctionStateMachineParameters));
  return errors.wrap("supplied properties not correct for \"PipeTargetParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeTargetParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeTargetParametersPropertyValidator(properties).assertSuccess();
  return {
    "BatchJobParameters": convertCfnPipePipeTargetBatchJobParametersPropertyToCloudFormation(properties.batchJobParameters),
    "CloudWatchLogsParameters": convertCfnPipePipeTargetCloudWatchLogsParametersPropertyToCloudFormation(properties.cloudWatchLogsParameters),
    "EcsTaskParameters": convertCfnPipePipeTargetEcsTaskParametersPropertyToCloudFormation(properties.ecsTaskParameters),
    "EventBridgeEventBusParameters": convertCfnPipePipeTargetEventBridgeEventBusParametersPropertyToCloudFormation(properties.eventBridgeEventBusParameters),
    "HttpParameters": convertCfnPipePipeTargetHttpParametersPropertyToCloudFormation(properties.httpParameters),
    "InputTemplate": cdk.stringToCloudFormation(properties.inputTemplate),
    "KinesisStreamParameters": convertCfnPipePipeTargetKinesisStreamParametersPropertyToCloudFormation(properties.kinesisStreamParameters),
    "LambdaFunctionParameters": convertCfnPipePipeTargetLambdaFunctionParametersPropertyToCloudFormation(properties.lambdaFunctionParameters),
    "RedshiftDataParameters": convertCfnPipePipeTargetRedshiftDataParametersPropertyToCloudFormation(properties.redshiftDataParameters),
    "SageMakerPipelineParameters": convertCfnPipePipeTargetSageMakerPipelineParametersPropertyToCloudFormation(properties.sageMakerPipelineParameters),
    "SqsQueueParameters": convertCfnPipePipeTargetSqsQueueParametersPropertyToCloudFormation(properties.sqsQueueParameters),
    "StepFunctionStateMachineParameters": convertCfnPipePipeTargetStateMachineParametersPropertyToCloudFormation(properties.stepFunctionStateMachineParameters)
  };
}

// @ts-ignore TS6133
function CfnPipePipeTargetParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeTargetParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeTargetParametersProperty>();
  ret.addPropertyResult("batchJobParameters", "BatchJobParameters", (properties.BatchJobParameters != null ? CfnPipePipeTargetBatchJobParametersPropertyFromCloudFormation(properties.BatchJobParameters) : undefined));
  ret.addPropertyResult("cloudWatchLogsParameters", "CloudWatchLogsParameters", (properties.CloudWatchLogsParameters != null ? CfnPipePipeTargetCloudWatchLogsParametersPropertyFromCloudFormation(properties.CloudWatchLogsParameters) : undefined));
  ret.addPropertyResult("ecsTaskParameters", "EcsTaskParameters", (properties.EcsTaskParameters != null ? CfnPipePipeTargetEcsTaskParametersPropertyFromCloudFormation(properties.EcsTaskParameters) : undefined));
  ret.addPropertyResult("eventBridgeEventBusParameters", "EventBridgeEventBusParameters", (properties.EventBridgeEventBusParameters != null ? CfnPipePipeTargetEventBridgeEventBusParametersPropertyFromCloudFormation(properties.EventBridgeEventBusParameters) : undefined));
  ret.addPropertyResult("httpParameters", "HttpParameters", (properties.HttpParameters != null ? CfnPipePipeTargetHttpParametersPropertyFromCloudFormation(properties.HttpParameters) : undefined));
  ret.addPropertyResult("inputTemplate", "InputTemplate", (properties.InputTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.InputTemplate) : undefined));
  ret.addPropertyResult("kinesisStreamParameters", "KinesisStreamParameters", (properties.KinesisStreamParameters != null ? CfnPipePipeTargetKinesisStreamParametersPropertyFromCloudFormation(properties.KinesisStreamParameters) : undefined));
  ret.addPropertyResult("lambdaFunctionParameters", "LambdaFunctionParameters", (properties.LambdaFunctionParameters != null ? CfnPipePipeTargetLambdaFunctionParametersPropertyFromCloudFormation(properties.LambdaFunctionParameters) : undefined));
  ret.addPropertyResult("redshiftDataParameters", "RedshiftDataParameters", (properties.RedshiftDataParameters != null ? CfnPipePipeTargetRedshiftDataParametersPropertyFromCloudFormation(properties.RedshiftDataParameters) : undefined));
  ret.addPropertyResult("sageMakerPipelineParameters", "SageMakerPipelineParameters", (properties.SageMakerPipelineParameters != null ? CfnPipePipeTargetSageMakerPipelineParametersPropertyFromCloudFormation(properties.SageMakerPipelineParameters) : undefined));
  ret.addPropertyResult("sqsQueueParameters", "SqsQueueParameters", (properties.SqsQueueParameters != null ? CfnPipePipeTargetSqsQueueParametersPropertyFromCloudFormation(properties.SqsQueueParameters) : undefined));
  ret.addPropertyResult("stepFunctionStateMachineParameters", "StepFunctionStateMachineParameters", (properties.StepFunctionStateMachineParameters != null ? CfnPipePipeTargetStateMachineParametersPropertyFromCloudFormation(properties.StepFunctionStateMachineParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeEnrichmentHttpParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeEnrichmentHttpParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeEnrichmentHttpParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("headerParameters", cdk.hashValidator(cdk.validateString))(properties.headerParameters));
  errors.collect(cdk.propertyValidator("pathParameterValues", cdk.listValidator(cdk.validateString))(properties.pathParameterValues));
  errors.collect(cdk.propertyValidator("queryStringParameters", cdk.hashValidator(cdk.validateString))(properties.queryStringParameters));
  return errors.wrap("supplied properties not correct for \"PipeEnrichmentHttpParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeEnrichmentHttpParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeEnrichmentHttpParametersPropertyValidator(properties).assertSuccess();
  return {
    "HeaderParameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.headerParameters),
    "PathParameterValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.pathParameterValues),
    "QueryStringParameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.queryStringParameters)
  };
}

// @ts-ignore TS6133
function CfnPipePipeEnrichmentHttpParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeEnrichmentHttpParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeEnrichmentHttpParametersProperty>();
  ret.addPropertyResult("headerParameters", "HeaderParameters", (properties.HeaderParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.HeaderParameters) : undefined));
  ret.addPropertyResult("pathParameterValues", "PathParameterValues", (properties.PathParameterValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PathParameterValues) : undefined));
  ret.addPropertyResult("queryStringParameters", "QueryStringParameters", (properties.QueryStringParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.QueryStringParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeEnrichmentParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeEnrichmentParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeEnrichmentParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("httpParameters", CfnPipePipeEnrichmentHttpParametersPropertyValidator)(properties.httpParameters));
  errors.collect(cdk.propertyValidator("inputTemplate", cdk.validateString)(properties.inputTemplate));
  return errors.wrap("supplied properties not correct for \"PipeEnrichmentParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeEnrichmentParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeEnrichmentParametersPropertyValidator(properties).assertSuccess();
  return {
    "HttpParameters": convertCfnPipePipeEnrichmentHttpParametersPropertyToCloudFormation(properties.httpParameters),
    "InputTemplate": cdk.stringToCloudFormation(properties.inputTemplate)
  };
}

// @ts-ignore TS6133
function CfnPipePipeEnrichmentParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeEnrichmentParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeEnrichmentParametersProperty>();
  ret.addPropertyResult("httpParameters", "HttpParameters", (properties.HttpParameters != null ? CfnPipePipeEnrichmentHttpParametersPropertyFromCloudFormation(properties.HttpParameters) : undefined));
  ret.addPropertyResult("inputTemplate", "InputTemplate", (properties.InputTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.InputTemplate) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MSKAccessCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `MSKAccessCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeMSKAccessCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientCertificateTlsAuth", cdk.validateString)(properties.clientCertificateTlsAuth));
  errors.collect(cdk.propertyValidator("saslScram512Auth", cdk.validateString)(properties.saslScram512Auth));
  return errors.wrap("supplied properties not correct for \"MSKAccessCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeMSKAccessCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeMSKAccessCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "ClientCertificateTlsAuth": cdk.stringToCloudFormation(properties.clientCertificateTlsAuth),
    "SaslScram512Auth": cdk.stringToCloudFormation(properties.saslScram512Auth)
  };
}

// @ts-ignore TS6133
function CfnPipeMSKAccessCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.MSKAccessCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.MSKAccessCredentialsProperty>();
  ret.addPropertyResult("clientCertificateTlsAuth", "ClientCertificateTlsAuth", (properties.ClientCertificateTlsAuth != null ? cfn_parse.FromCloudFormation.getString(properties.ClientCertificateTlsAuth) : undefined));
  ret.addPropertyResult("saslScram512Auth", "SaslScram512Auth", (properties.SaslScram512Auth != null ? cfn_parse.FromCloudFormation.getString(properties.SaslScram512Auth) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeSourceManagedStreamingKafkaParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceManagedStreamingKafkaParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeSourceManagedStreamingKafkaParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchSize", cdk.validateNumber)(properties.batchSize));
  errors.collect(cdk.propertyValidator("consumerGroupId", cdk.validateString)(properties.consumerGroupId));
  errors.collect(cdk.propertyValidator("credentials", CfnPipeMSKAccessCredentialsPropertyValidator)(properties.credentials));
  errors.collect(cdk.propertyValidator("maximumBatchingWindowInSeconds", cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
  errors.collect(cdk.propertyValidator("startingPosition", cdk.validateString)(properties.startingPosition));
  errors.collect(cdk.propertyValidator("topicName", cdk.requiredValidator)(properties.topicName));
  errors.collect(cdk.propertyValidator("topicName", cdk.validateString)(properties.topicName));
  return errors.wrap("supplied properties not correct for \"PipeSourceManagedStreamingKafkaParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeSourceManagedStreamingKafkaParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeSourceManagedStreamingKafkaParametersPropertyValidator(properties).assertSuccess();
  return {
    "BatchSize": cdk.numberToCloudFormation(properties.batchSize),
    "ConsumerGroupID": cdk.stringToCloudFormation(properties.consumerGroupId),
    "Credentials": convertCfnPipeMSKAccessCredentialsPropertyToCloudFormation(properties.credentials),
    "MaximumBatchingWindowInSeconds": cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
    "StartingPosition": cdk.stringToCloudFormation(properties.startingPosition),
    "TopicName": cdk.stringToCloudFormation(properties.topicName)
  };
}

// @ts-ignore TS6133
function CfnPipePipeSourceManagedStreamingKafkaParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeSourceManagedStreamingKafkaParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceManagedStreamingKafkaParametersProperty>();
  ret.addPropertyResult("batchSize", "BatchSize", (properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined));
  ret.addPropertyResult("consumerGroupId", "ConsumerGroupID", (properties.ConsumerGroupID != null ? cfn_parse.FromCloudFormation.getString(properties.ConsumerGroupID) : undefined));
  ret.addPropertyResult("credentials", "Credentials", (properties.Credentials != null ? CfnPipeMSKAccessCredentialsPropertyFromCloudFormation(properties.Credentials) : undefined));
  ret.addPropertyResult("maximumBatchingWindowInSeconds", "MaximumBatchingWindowInSeconds", (properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined));
  ret.addPropertyResult("startingPosition", "StartingPosition", (properties.StartingPosition != null ? cfn_parse.FromCloudFormation.getString(properties.StartingPosition) : undefined));
  ret.addPropertyResult("topicName", "TopicName", (properties.TopicName != null ? cfn_parse.FromCloudFormation.getString(properties.TopicName) : undefined));
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
function CfnPipeDeadLetterConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  return errors.wrap("supplied properties not correct for \"DeadLetterConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeDeadLetterConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeDeadLetterConfigPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn)
  };
}

// @ts-ignore TS6133
function CfnPipeDeadLetterConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.DeadLetterConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.DeadLetterConfigProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeSourceDynamoDBStreamParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceDynamoDBStreamParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeSourceDynamoDBStreamParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchSize", cdk.validateNumber)(properties.batchSize));
  errors.collect(cdk.propertyValidator("deadLetterConfig", CfnPipeDeadLetterConfigPropertyValidator)(properties.deadLetterConfig));
  errors.collect(cdk.propertyValidator("maximumBatchingWindowInSeconds", cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
  errors.collect(cdk.propertyValidator("maximumRecordAgeInSeconds", cdk.validateNumber)(properties.maximumRecordAgeInSeconds));
  errors.collect(cdk.propertyValidator("maximumRetryAttempts", cdk.validateNumber)(properties.maximumRetryAttempts));
  errors.collect(cdk.propertyValidator("onPartialBatchItemFailure", cdk.validateString)(properties.onPartialBatchItemFailure));
  errors.collect(cdk.propertyValidator("parallelizationFactor", cdk.validateNumber)(properties.parallelizationFactor));
  errors.collect(cdk.propertyValidator("startingPosition", cdk.requiredValidator)(properties.startingPosition));
  errors.collect(cdk.propertyValidator("startingPosition", cdk.validateString)(properties.startingPosition));
  return errors.wrap("supplied properties not correct for \"PipeSourceDynamoDBStreamParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeSourceDynamoDBStreamParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeSourceDynamoDBStreamParametersPropertyValidator(properties).assertSuccess();
  return {
    "BatchSize": cdk.numberToCloudFormation(properties.batchSize),
    "DeadLetterConfig": convertCfnPipeDeadLetterConfigPropertyToCloudFormation(properties.deadLetterConfig),
    "MaximumBatchingWindowInSeconds": cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
    "MaximumRecordAgeInSeconds": cdk.numberToCloudFormation(properties.maximumRecordAgeInSeconds),
    "MaximumRetryAttempts": cdk.numberToCloudFormation(properties.maximumRetryAttempts),
    "OnPartialBatchItemFailure": cdk.stringToCloudFormation(properties.onPartialBatchItemFailure),
    "ParallelizationFactor": cdk.numberToCloudFormation(properties.parallelizationFactor),
    "StartingPosition": cdk.stringToCloudFormation(properties.startingPosition)
  };
}

// @ts-ignore TS6133
function CfnPipePipeSourceDynamoDBStreamParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeSourceDynamoDBStreamParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceDynamoDBStreamParametersProperty>();
  ret.addPropertyResult("batchSize", "BatchSize", (properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined));
  ret.addPropertyResult("deadLetterConfig", "DeadLetterConfig", (properties.DeadLetterConfig != null ? CfnPipeDeadLetterConfigPropertyFromCloudFormation(properties.DeadLetterConfig) : undefined));
  ret.addPropertyResult("maximumBatchingWindowInSeconds", "MaximumBatchingWindowInSeconds", (properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined));
  ret.addPropertyResult("maximumRecordAgeInSeconds", "MaximumRecordAgeInSeconds", (properties.MaximumRecordAgeInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRecordAgeInSeconds) : undefined));
  ret.addPropertyResult("maximumRetryAttempts", "MaximumRetryAttempts", (properties.MaximumRetryAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRetryAttempts) : undefined));
  ret.addPropertyResult("onPartialBatchItemFailure", "OnPartialBatchItemFailure", (properties.OnPartialBatchItemFailure != null ? cfn_parse.FromCloudFormation.getString(properties.OnPartialBatchItemFailure) : undefined));
  ret.addPropertyResult("parallelizationFactor", "ParallelizationFactor", (properties.ParallelizationFactor != null ? cfn_parse.FromCloudFormation.getNumber(properties.ParallelizationFactor) : undefined));
  ret.addPropertyResult("startingPosition", "StartingPosition", (properties.StartingPosition != null ? cfn_parse.FromCloudFormation.getString(properties.StartingPosition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SelfManagedKafkaAccessConfigurationVpcProperty`
 *
 * @param properties - the TypeScript properties of a `SelfManagedKafkaAccessConfigurationVpcProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeSelfManagedKafkaAccessConfigurationVpcPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroup", cdk.listValidator(cdk.validateString))(properties.securityGroup));
  errors.collect(cdk.propertyValidator("subnets", cdk.listValidator(cdk.validateString))(properties.subnets));
  return errors.wrap("supplied properties not correct for \"SelfManagedKafkaAccessConfigurationVpcProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeSelfManagedKafkaAccessConfigurationVpcPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeSelfManagedKafkaAccessConfigurationVpcPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroup": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroup),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets)
  };
}

// @ts-ignore TS6133
function CfnPipeSelfManagedKafkaAccessConfigurationVpcPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.SelfManagedKafkaAccessConfigurationVpcProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.SelfManagedKafkaAccessConfigurationVpcProperty>();
  ret.addPropertyResult("securityGroup", "SecurityGroup", (properties.SecurityGroup != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroup) : undefined));
  ret.addPropertyResult("subnets", "Subnets", (properties.Subnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subnets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SelfManagedKafkaAccessConfigurationCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `SelfManagedKafkaAccessConfigurationCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeSelfManagedKafkaAccessConfigurationCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("basicAuth", cdk.validateString)(properties.basicAuth));
  errors.collect(cdk.propertyValidator("clientCertificateTlsAuth", cdk.validateString)(properties.clientCertificateTlsAuth));
  errors.collect(cdk.propertyValidator("saslScram256Auth", cdk.validateString)(properties.saslScram256Auth));
  errors.collect(cdk.propertyValidator("saslScram512Auth", cdk.validateString)(properties.saslScram512Auth));
  return errors.wrap("supplied properties not correct for \"SelfManagedKafkaAccessConfigurationCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeSelfManagedKafkaAccessConfigurationCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeSelfManagedKafkaAccessConfigurationCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "BasicAuth": cdk.stringToCloudFormation(properties.basicAuth),
    "ClientCertificateTlsAuth": cdk.stringToCloudFormation(properties.clientCertificateTlsAuth),
    "SaslScram256Auth": cdk.stringToCloudFormation(properties.saslScram256Auth),
    "SaslScram512Auth": cdk.stringToCloudFormation(properties.saslScram512Auth)
  };
}

// @ts-ignore TS6133
function CfnPipeSelfManagedKafkaAccessConfigurationCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.SelfManagedKafkaAccessConfigurationCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.SelfManagedKafkaAccessConfigurationCredentialsProperty>();
  ret.addPropertyResult("basicAuth", "BasicAuth", (properties.BasicAuth != null ? cfn_parse.FromCloudFormation.getString(properties.BasicAuth) : undefined));
  ret.addPropertyResult("clientCertificateTlsAuth", "ClientCertificateTlsAuth", (properties.ClientCertificateTlsAuth != null ? cfn_parse.FromCloudFormation.getString(properties.ClientCertificateTlsAuth) : undefined));
  ret.addPropertyResult("saslScram256Auth", "SaslScram256Auth", (properties.SaslScram256Auth != null ? cfn_parse.FromCloudFormation.getString(properties.SaslScram256Auth) : undefined));
  ret.addPropertyResult("saslScram512Auth", "SaslScram512Auth", (properties.SaslScram512Auth != null ? cfn_parse.FromCloudFormation.getString(properties.SaslScram512Auth) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeSourceSelfManagedKafkaParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceSelfManagedKafkaParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeSourceSelfManagedKafkaParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalBootstrapServers", cdk.listValidator(cdk.validateString))(properties.additionalBootstrapServers));
  errors.collect(cdk.propertyValidator("batchSize", cdk.validateNumber)(properties.batchSize));
  errors.collect(cdk.propertyValidator("consumerGroupId", cdk.validateString)(properties.consumerGroupId));
  errors.collect(cdk.propertyValidator("credentials", CfnPipeSelfManagedKafkaAccessConfigurationCredentialsPropertyValidator)(properties.credentials));
  errors.collect(cdk.propertyValidator("maximumBatchingWindowInSeconds", cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
  errors.collect(cdk.propertyValidator("serverRootCaCertificate", cdk.validateString)(properties.serverRootCaCertificate));
  errors.collect(cdk.propertyValidator("startingPosition", cdk.validateString)(properties.startingPosition));
  errors.collect(cdk.propertyValidator("topicName", cdk.requiredValidator)(properties.topicName));
  errors.collect(cdk.propertyValidator("topicName", cdk.validateString)(properties.topicName));
  errors.collect(cdk.propertyValidator("vpc", CfnPipeSelfManagedKafkaAccessConfigurationVpcPropertyValidator)(properties.vpc));
  return errors.wrap("supplied properties not correct for \"PipeSourceSelfManagedKafkaParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeSourceSelfManagedKafkaParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeSourceSelfManagedKafkaParametersPropertyValidator(properties).assertSuccess();
  return {
    "AdditionalBootstrapServers": cdk.listMapper(cdk.stringToCloudFormation)(properties.additionalBootstrapServers),
    "BatchSize": cdk.numberToCloudFormation(properties.batchSize),
    "ConsumerGroupID": cdk.stringToCloudFormation(properties.consumerGroupId),
    "Credentials": convertCfnPipeSelfManagedKafkaAccessConfigurationCredentialsPropertyToCloudFormation(properties.credentials),
    "MaximumBatchingWindowInSeconds": cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
    "ServerRootCaCertificate": cdk.stringToCloudFormation(properties.serverRootCaCertificate),
    "StartingPosition": cdk.stringToCloudFormation(properties.startingPosition),
    "TopicName": cdk.stringToCloudFormation(properties.topicName),
    "Vpc": convertCfnPipeSelfManagedKafkaAccessConfigurationVpcPropertyToCloudFormation(properties.vpc)
  };
}

// @ts-ignore TS6133
function CfnPipePipeSourceSelfManagedKafkaParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeSourceSelfManagedKafkaParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceSelfManagedKafkaParametersProperty>();
  ret.addPropertyResult("additionalBootstrapServers", "AdditionalBootstrapServers", (properties.AdditionalBootstrapServers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AdditionalBootstrapServers) : undefined));
  ret.addPropertyResult("batchSize", "BatchSize", (properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined));
  ret.addPropertyResult("consumerGroupId", "ConsumerGroupID", (properties.ConsumerGroupID != null ? cfn_parse.FromCloudFormation.getString(properties.ConsumerGroupID) : undefined));
  ret.addPropertyResult("credentials", "Credentials", (properties.Credentials != null ? CfnPipeSelfManagedKafkaAccessConfigurationCredentialsPropertyFromCloudFormation(properties.Credentials) : undefined));
  ret.addPropertyResult("maximumBatchingWindowInSeconds", "MaximumBatchingWindowInSeconds", (properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined));
  ret.addPropertyResult("serverRootCaCertificate", "ServerRootCaCertificate", (properties.ServerRootCaCertificate != null ? cfn_parse.FromCloudFormation.getString(properties.ServerRootCaCertificate) : undefined));
  ret.addPropertyResult("startingPosition", "StartingPosition", (properties.StartingPosition != null ? cfn_parse.FromCloudFormation.getString(properties.StartingPosition) : undefined));
  ret.addPropertyResult("topicName", "TopicName", (properties.TopicName != null ? cfn_parse.FromCloudFormation.getString(properties.TopicName) : undefined));
  ret.addPropertyResult("vpc", "Vpc", (properties.Vpc != null ? CfnPipeSelfManagedKafkaAccessConfigurationVpcPropertyFromCloudFormation(properties.Vpc) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MQBrokerAccessCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `MQBrokerAccessCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeMQBrokerAccessCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("basicAuth", cdk.requiredValidator)(properties.basicAuth));
  errors.collect(cdk.propertyValidator("basicAuth", cdk.validateString)(properties.basicAuth));
  return errors.wrap("supplied properties not correct for \"MQBrokerAccessCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeMQBrokerAccessCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeMQBrokerAccessCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "BasicAuth": cdk.stringToCloudFormation(properties.basicAuth)
  };
}

// @ts-ignore TS6133
function CfnPipeMQBrokerAccessCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.MQBrokerAccessCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.MQBrokerAccessCredentialsProperty>();
  ret.addPropertyResult("basicAuth", "BasicAuth", (properties.BasicAuth != null ? cfn_parse.FromCloudFormation.getString(properties.BasicAuth) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeSourceRabbitMQBrokerParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceRabbitMQBrokerParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeSourceRabbitMQBrokerParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchSize", cdk.validateNumber)(properties.batchSize));
  errors.collect(cdk.propertyValidator("credentials", cdk.requiredValidator)(properties.credentials));
  errors.collect(cdk.propertyValidator("credentials", CfnPipeMQBrokerAccessCredentialsPropertyValidator)(properties.credentials));
  errors.collect(cdk.propertyValidator("maximumBatchingWindowInSeconds", cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
  errors.collect(cdk.propertyValidator("queueName", cdk.requiredValidator)(properties.queueName));
  errors.collect(cdk.propertyValidator("queueName", cdk.validateString)(properties.queueName));
  errors.collect(cdk.propertyValidator("virtualHost", cdk.validateString)(properties.virtualHost));
  return errors.wrap("supplied properties not correct for \"PipeSourceRabbitMQBrokerParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeSourceRabbitMQBrokerParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeSourceRabbitMQBrokerParametersPropertyValidator(properties).assertSuccess();
  return {
    "BatchSize": cdk.numberToCloudFormation(properties.batchSize),
    "Credentials": convertCfnPipeMQBrokerAccessCredentialsPropertyToCloudFormation(properties.credentials),
    "MaximumBatchingWindowInSeconds": cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
    "QueueName": cdk.stringToCloudFormation(properties.queueName),
    "VirtualHost": cdk.stringToCloudFormation(properties.virtualHost)
  };
}

// @ts-ignore TS6133
function CfnPipePipeSourceRabbitMQBrokerParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeSourceRabbitMQBrokerParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceRabbitMQBrokerParametersProperty>();
  ret.addPropertyResult("batchSize", "BatchSize", (properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined));
  ret.addPropertyResult("credentials", "Credentials", (properties.Credentials != null ? CfnPipeMQBrokerAccessCredentialsPropertyFromCloudFormation(properties.Credentials) : undefined));
  ret.addPropertyResult("maximumBatchingWindowInSeconds", "MaximumBatchingWindowInSeconds", (properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined));
  ret.addPropertyResult("queueName", "QueueName", (properties.QueueName != null ? cfn_parse.FromCloudFormation.getString(properties.QueueName) : undefined));
  ret.addPropertyResult("virtualHost", "VirtualHost", (properties.VirtualHost != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualHost) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeSourceSqsQueueParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceSqsQueueParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeSourceSqsQueueParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchSize", cdk.validateNumber)(properties.batchSize));
  errors.collect(cdk.propertyValidator("maximumBatchingWindowInSeconds", cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
  return errors.wrap("supplied properties not correct for \"PipeSourceSqsQueueParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeSourceSqsQueueParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeSourceSqsQueueParametersPropertyValidator(properties).assertSuccess();
  return {
    "BatchSize": cdk.numberToCloudFormation(properties.batchSize),
    "MaximumBatchingWindowInSeconds": cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds)
  };
}

// @ts-ignore TS6133
function CfnPipePipeSourceSqsQueueParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeSourceSqsQueueParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceSqsQueueParametersProperty>();
  ret.addPropertyResult("batchSize", "BatchSize", (properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined));
  ret.addPropertyResult("maximumBatchingWindowInSeconds", "MaximumBatchingWindowInSeconds", (properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeSourceKinesisStreamParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceKinesisStreamParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeSourceKinesisStreamParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchSize", cdk.validateNumber)(properties.batchSize));
  errors.collect(cdk.propertyValidator("deadLetterConfig", CfnPipeDeadLetterConfigPropertyValidator)(properties.deadLetterConfig));
  errors.collect(cdk.propertyValidator("maximumBatchingWindowInSeconds", cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
  errors.collect(cdk.propertyValidator("maximumRecordAgeInSeconds", cdk.validateNumber)(properties.maximumRecordAgeInSeconds));
  errors.collect(cdk.propertyValidator("maximumRetryAttempts", cdk.validateNumber)(properties.maximumRetryAttempts));
  errors.collect(cdk.propertyValidator("onPartialBatchItemFailure", cdk.validateString)(properties.onPartialBatchItemFailure));
  errors.collect(cdk.propertyValidator("parallelizationFactor", cdk.validateNumber)(properties.parallelizationFactor));
  errors.collect(cdk.propertyValidator("startingPosition", cdk.requiredValidator)(properties.startingPosition));
  errors.collect(cdk.propertyValidator("startingPosition", cdk.validateString)(properties.startingPosition));
  errors.collect(cdk.propertyValidator("startingPositionTimestamp", cdk.validateString)(properties.startingPositionTimestamp));
  return errors.wrap("supplied properties not correct for \"PipeSourceKinesisStreamParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeSourceKinesisStreamParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeSourceKinesisStreamParametersPropertyValidator(properties).assertSuccess();
  return {
    "BatchSize": cdk.numberToCloudFormation(properties.batchSize),
    "DeadLetterConfig": convertCfnPipeDeadLetterConfigPropertyToCloudFormation(properties.deadLetterConfig),
    "MaximumBatchingWindowInSeconds": cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
    "MaximumRecordAgeInSeconds": cdk.numberToCloudFormation(properties.maximumRecordAgeInSeconds),
    "MaximumRetryAttempts": cdk.numberToCloudFormation(properties.maximumRetryAttempts),
    "OnPartialBatchItemFailure": cdk.stringToCloudFormation(properties.onPartialBatchItemFailure),
    "ParallelizationFactor": cdk.numberToCloudFormation(properties.parallelizationFactor),
    "StartingPosition": cdk.stringToCloudFormation(properties.startingPosition),
    "StartingPositionTimestamp": cdk.stringToCloudFormation(properties.startingPositionTimestamp)
  };
}

// @ts-ignore TS6133
function CfnPipePipeSourceKinesisStreamParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeSourceKinesisStreamParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceKinesisStreamParametersProperty>();
  ret.addPropertyResult("batchSize", "BatchSize", (properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined));
  ret.addPropertyResult("deadLetterConfig", "DeadLetterConfig", (properties.DeadLetterConfig != null ? CfnPipeDeadLetterConfigPropertyFromCloudFormation(properties.DeadLetterConfig) : undefined));
  ret.addPropertyResult("maximumBatchingWindowInSeconds", "MaximumBatchingWindowInSeconds", (properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined));
  ret.addPropertyResult("maximumRecordAgeInSeconds", "MaximumRecordAgeInSeconds", (properties.MaximumRecordAgeInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRecordAgeInSeconds) : undefined));
  ret.addPropertyResult("maximumRetryAttempts", "MaximumRetryAttempts", (properties.MaximumRetryAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRetryAttempts) : undefined));
  ret.addPropertyResult("onPartialBatchItemFailure", "OnPartialBatchItemFailure", (properties.OnPartialBatchItemFailure != null ? cfn_parse.FromCloudFormation.getString(properties.OnPartialBatchItemFailure) : undefined));
  ret.addPropertyResult("parallelizationFactor", "ParallelizationFactor", (properties.ParallelizationFactor != null ? cfn_parse.FromCloudFormation.getNumber(properties.ParallelizationFactor) : undefined));
  ret.addPropertyResult("startingPosition", "StartingPosition", (properties.StartingPosition != null ? cfn_parse.FromCloudFormation.getString(properties.StartingPosition) : undefined));
  ret.addPropertyResult("startingPositionTimestamp", "StartingPositionTimestamp", (properties.StartingPositionTimestamp != null ? cfn_parse.FromCloudFormation.getString(properties.StartingPositionTimestamp) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("pattern", cdk.validateString)(properties.pattern));
  return errors.wrap("supplied properties not correct for \"FilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeFilterPropertyValidator(properties).assertSuccess();
  return {
    "Pattern": cdk.stringToCloudFormation(properties.pattern)
  };
}

// @ts-ignore TS6133
function CfnPipeFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.FilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.FilterProperty>();
  ret.addPropertyResult("pattern", "Pattern", (properties.Pattern != null ? cfn_parse.FromCloudFormation.getString(properties.Pattern) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilterCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `FilterCriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeFilterCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filters", cdk.listValidator(CfnPipeFilterPropertyValidator))(properties.filters));
  return errors.wrap("supplied properties not correct for \"FilterCriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeFilterCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeFilterCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "Filters": cdk.listMapper(convertCfnPipeFilterPropertyToCloudFormation)(properties.filters)
  };
}

// @ts-ignore TS6133
function CfnPipeFilterCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.FilterCriteriaProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.FilterCriteriaProperty>();
  ret.addPropertyResult("filters", "Filters", (properties.Filters != null ? cfn_parse.FromCloudFormation.getArray(CfnPipeFilterPropertyFromCloudFormation)(properties.Filters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeSourceActiveMQBrokerParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceActiveMQBrokerParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeSourceActiveMQBrokerParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchSize", cdk.validateNumber)(properties.batchSize));
  errors.collect(cdk.propertyValidator("credentials", cdk.requiredValidator)(properties.credentials));
  errors.collect(cdk.propertyValidator("credentials", CfnPipeMQBrokerAccessCredentialsPropertyValidator)(properties.credentials));
  errors.collect(cdk.propertyValidator("maximumBatchingWindowInSeconds", cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
  errors.collect(cdk.propertyValidator("queueName", cdk.requiredValidator)(properties.queueName));
  errors.collect(cdk.propertyValidator("queueName", cdk.validateString)(properties.queueName));
  return errors.wrap("supplied properties not correct for \"PipeSourceActiveMQBrokerParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeSourceActiveMQBrokerParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeSourceActiveMQBrokerParametersPropertyValidator(properties).assertSuccess();
  return {
    "BatchSize": cdk.numberToCloudFormation(properties.batchSize),
    "Credentials": convertCfnPipeMQBrokerAccessCredentialsPropertyToCloudFormation(properties.credentials),
    "MaximumBatchingWindowInSeconds": cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
    "QueueName": cdk.stringToCloudFormation(properties.queueName)
  };
}

// @ts-ignore TS6133
function CfnPipePipeSourceActiveMQBrokerParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeSourceActiveMQBrokerParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceActiveMQBrokerParametersProperty>();
  ret.addPropertyResult("batchSize", "BatchSize", (properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined));
  ret.addPropertyResult("credentials", "Credentials", (properties.Credentials != null ? CfnPipeMQBrokerAccessCredentialsPropertyFromCloudFormation(properties.Credentials) : undefined));
  ret.addPropertyResult("maximumBatchingWindowInSeconds", "MaximumBatchingWindowInSeconds", (properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined));
  ret.addPropertyResult("queueName", "QueueName", (properties.QueueName != null ? cfn_parse.FromCloudFormation.getString(properties.QueueName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeSourceParametersProperty`
 *
 * @param properties - the TypeScript properties of a `PipeSourceParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeSourceParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("activeMqBrokerParameters", CfnPipePipeSourceActiveMQBrokerParametersPropertyValidator)(properties.activeMqBrokerParameters));
  errors.collect(cdk.propertyValidator("dynamoDbStreamParameters", CfnPipePipeSourceDynamoDBStreamParametersPropertyValidator)(properties.dynamoDbStreamParameters));
  errors.collect(cdk.propertyValidator("filterCriteria", CfnPipeFilterCriteriaPropertyValidator)(properties.filterCriteria));
  errors.collect(cdk.propertyValidator("kinesisStreamParameters", CfnPipePipeSourceKinesisStreamParametersPropertyValidator)(properties.kinesisStreamParameters));
  errors.collect(cdk.propertyValidator("managedStreamingKafkaParameters", CfnPipePipeSourceManagedStreamingKafkaParametersPropertyValidator)(properties.managedStreamingKafkaParameters));
  errors.collect(cdk.propertyValidator("rabbitMqBrokerParameters", CfnPipePipeSourceRabbitMQBrokerParametersPropertyValidator)(properties.rabbitMqBrokerParameters));
  errors.collect(cdk.propertyValidator("selfManagedKafkaParameters", CfnPipePipeSourceSelfManagedKafkaParametersPropertyValidator)(properties.selfManagedKafkaParameters));
  errors.collect(cdk.propertyValidator("sqsQueueParameters", CfnPipePipeSourceSqsQueueParametersPropertyValidator)(properties.sqsQueueParameters));
  return errors.wrap("supplied properties not correct for \"PipeSourceParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeSourceParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeSourceParametersPropertyValidator(properties).assertSuccess();
  return {
    "ActiveMQBrokerParameters": convertCfnPipePipeSourceActiveMQBrokerParametersPropertyToCloudFormation(properties.activeMqBrokerParameters),
    "DynamoDBStreamParameters": convertCfnPipePipeSourceDynamoDBStreamParametersPropertyToCloudFormation(properties.dynamoDbStreamParameters),
    "FilterCriteria": convertCfnPipeFilterCriteriaPropertyToCloudFormation(properties.filterCriteria),
    "KinesisStreamParameters": convertCfnPipePipeSourceKinesisStreamParametersPropertyToCloudFormation(properties.kinesisStreamParameters),
    "ManagedStreamingKafkaParameters": convertCfnPipePipeSourceManagedStreamingKafkaParametersPropertyToCloudFormation(properties.managedStreamingKafkaParameters),
    "RabbitMQBrokerParameters": convertCfnPipePipeSourceRabbitMQBrokerParametersPropertyToCloudFormation(properties.rabbitMqBrokerParameters),
    "SelfManagedKafkaParameters": convertCfnPipePipeSourceSelfManagedKafkaParametersPropertyToCloudFormation(properties.selfManagedKafkaParameters),
    "SqsQueueParameters": convertCfnPipePipeSourceSqsQueueParametersPropertyToCloudFormation(properties.sqsQueueParameters)
  };
}

// @ts-ignore TS6133
function CfnPipePipeSourceParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeSourceParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeSourceParametersProperty>();
  ret.addPropertyResult("activeMqBrokerParameters", "ActiveMQBrokerParameters", (properties.ActiveMQBrokerParameters != null ? CfnPipePipeSourceActiveMQBrokerParametersPropertyFromCloudFormation(properties.ActiveMQBrokerParameters) : undefined));
  ret.addPropertyResult("dynamoDbStreamParameters", "DynamoDBStreamParameters", (properties.DynamoDBStreamParameters != null ? CfnPipePipeSourceDynamoDBStreamParametersPropertyFromCloudFormation(properties.DynamoDBStreamParameters) : undefined));
  ret.addPropertyResult("filterCriteria", "FilterCriteria", (properties.FilterCriteria != null ? CfnPipeFilterCriteriaPropertyFromCloudFormation(properties.FilterCriteria) : undefined));
  ret.addPropertyResult("kinesisStreamParameters", "KinesisStreamParameters", (properties.KinesisStreamParameters != null ? CfnPipePipeSourceKinesisStreamParametersPropertyFromCloudFormation(properties.KinesisStreamParameters) : undefined));
  ret.addPropertyResult("managedStreamingKafkaParameters", "ManagedStreamingKafkaParameters", (properties.ManagedStreamingKafkaParameters != null ? CfnPipePipeSourceManagedStreamingKafkaParametersPropertyFromCloudFormation(properties.ManagedStreamingKafkaParameters) : undefined));
  ret.addPropertyResult("rabbitMqBrokerParameters", "RabbitMQBrokerParameters", (properties.RabbitMQBrokerParameters != null ? CfnPipePipeSourceRabbitMQBrokerParametersPropertyFromCloudFormation(properties.RabbitMQBrokerParameters) : undefined));
  ret.addPropertyResult("selfManagedKafkaParameters", "SelfManagedKafkaParameters", (properties.SelfManagedKafkaParameters != null ? CfnPipePipeSourceSelfManagedKafkaParametersPropertyFromCloudFormation(properties.SelfManagedKafkaParameters) : undefined));
  ret.addPropertyResult("sqsQueueParameters", "SqsQueueParameters", (properties.SqsQueueParameters != null ? CfnPipePipeSourceSqsQueueParametersPropertyFromCloudFormation(properties.SqsQueueParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3LogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LogDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeS3LogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketOwner", cdk.validateString)(properties.bucketOwner));
  errors.collect(cdk.propertyValidator("outputFormat", cdk.validateString)(properties.outputFormat));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  return errors.wrap("supplied properties not correct for \"S3LogDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeS3LogDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeS3LogDestinationPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "BucketOwner": cdk.stringToCloudFormation(properties.bucketOwner),
    "OutputFormat": cdk.stringToCloudFormation(properties.outputFormat),
    "Prefix": cdk.stringToCloudFormation(properties.prefix)
  };
}

// @ts-ignore TS6133
function CfnPipeS3LogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.S3LogDestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.S3LogDestinationProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("bucketOwner", "BucketOwner", (properties.BucketOwner != null ? cfn_parse.FromCloudFormation.getString(properties.BucketOwner) : undefined));
  ret.addPropertyResult("outputFormat", "OutputFormat", (properties.OutputFormat != null ? cfn_parse.FromCloudFormation.getString(properties.OutputFormat) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FirehoseLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `FirehoseLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeFirehoseLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deliveryStreamArn", cdk.validateString)(properties.deliveryStreamArn));
  return errors.wrap("supplied properties not correct for \"FirehoseLogDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeFirehoseLogDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeFirehoseLogDestinationPropertyValidator(properties).assertSuccess();
  return {
    "DeliveryStreamArn": cdk.stringToCloudFormation(properties.deliveryStreamArn)
  };
}

// @ts-ignore TS6133
function CfnPipeFirehoseLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.FirehoseLogDestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.FirehoseLogDestinationProperty>();
  ret.addPropertyResult("deliveryStreamArn", "DeliveryStreamArn", (properties.DeliveryStreamArn != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryStreamArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudwatchLogsLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `CloudwatchLogsLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipeCloudwatchLogsLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroupArn", cdk.validateString)(properties.logGroupArn));
  return errors.wrap("supplied properties not correct for \"CloudwatchLogsLogDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipeCloudwatchLogsLogDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipeCloudwatchLogsLogDestinationPropertyValidator(properties).assertSuccess();
  return {
    "LogGroupArn": cdk.stringToCloudFormation(properties.logGroupArn)
  };
}

// @ts-ignore TS6133
function CfnPipeCloudwatchLogsLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipe.CloudwatchLogsLogDestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.CloudwatchLogsLogDestinationProperty>();
  ret.addPropertyResult("logGroupArn", "LogGroupArn", (properties.LogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipeLogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `PipeLogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePipeLogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudwatchLogsLogDestination", CfnPipeCloudwatchLogsLogDestinationPropertyValidator)(properties.cloudwatchLogsLogDestination));
  errors.collect(cdk.propertyValidator("firehoseLogDestination", CfnPipeFirehoseLogDestinationPropertyValidator)(properties.firehoseLogDestination));
  errors.collect(cdk.propertyValidator("includeExecutionData", cdk.listValidator(cdk.validateString))(properties.includeExecutionData));
  errors.collect(cdk.propertyValidator("level", cdk.validateString)(properties.level));
  errors.collect(cdk.propertyValidator("s3LogDestination", CfnPipeS3LogDestinationPropertyValidator)(properties.s3LogDestination));
  return errors.wrap("supplied properties not correct for \"PipeLogConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipePipeLogConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePipeLogConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CloudwatchLogsLogDestination": convertCfnPipeCloudwatchLogsLogDestinationPropertyToCloudFormation(properties.cloudwatchLogsLogDestination),
    "FirehoseLogDestination": convertCfnPipeFirehoseLogDestinationPropertyToCloudFormation(properties.firehoseLogDestination),
    "IncludeExecutionData": cdk.listMapper(cdk.stringToCloudFormation)(properties.includeExecutionData),
    "Level": cdk.stringToCloudFormation(properties.level),
    "S3LogDestination": convertCfnPipeS3LogDestinationPropertyToCloudFormation(properties.s3LogDestination)
  };
}

// @ts-ignore TS6133
function CfnPipePipeLogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipe.PipeLogConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipe.PipeLogConfigurationProperty>();
  ret.addPropertyResult("cloudwatchLogsLogDestination", "CloudwatchLogsLogDestination", (properties.CloudwatchLogsLogDestination != null ? CfnPipeCloudwatchLogsLogDestinationPropertyFromCloudFormation(properties.CloudwatchLogsLogDestination) : undefined));
  ret.addPropertyResult("firehoseLogDestination", "FirehoseLogDestination", (properties.FirehoseLogDestination != null ? CfnPipeFirehoseLogDestinationPropertyFromCloudFormation(properties.FirehoseLogDestination) : undefined));
  ret.addPropertyResult("includeExecutionData", "IncludeExecutionData", (properties.IncludeExecutionData != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludeExecutionData) : undefined));
  ret.addPropertyResult("level", "Level", (properties.Level != null ? cfn_parse.FromCloudFormation.getString(properties.Level) : undefined));
  ret.addPropertyResult("s3LogDestination", "S3LogDestination", (properties.S3LogDestination != null ? CfnPipeS3LogDestinationPropertyFromCloudFormation(properties.S3LogDestination) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPipeProps`
 *
 * @param properties - the TypeScript properties of a `CfnPipeProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("desiredState", cdk.validateString)(properties.desiredState));
  errors.collect(cdk.propertyValidator("enrichment", cdk.validateString)(properties.enrichment));
  errors.collect(cdk.propertyValidator("enrichmentParameters", CfnPipePipeEnrichmentParametersPropertyValidator)(properties.enrichmentParameters));
  errors.collect(cdk.propertyValidator("logConfiguration", CfnPipePipeLogConfigurationPropertyValidator)(properties.logConfiguration));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("source", cdk.requiredValidator)(properties.source));
  errors.collect(cdk.propertyValidator("source", cdk.validateString)(properties.source));
  errors.collect(cdk.propertyValidator("sourceParameters", CfnPipePipeSourceParametersPropertyValidator)(properties.sourceParameters));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("target", cdk.requiredValidator)(properties.target));
  errors.collect(cdk.propertyValidator("target", cdk.validateString)(properties.target));
  errors.collect(cdk.propertyValidator("targetParameters", CfnPipePipeTargetParametersPropertyValidator)(properties.targetParameters));
  return errors.wrap("supplied properties not correct for \"CfnPipeProps\"");
}

// @ts-ignore TS6133
function convertCfnPipePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "DesiredState": cdk.stringToCloudFormation(properties.desiredState),
    "Enrichment": cdk.stringToCloudFormation(properties.enrichment),
    "EnrichmentParameters": convertCfnPipePipeEnrichmentParametersPropertyToCloudFormation(properties.enrichmentParameters),
    "LogConfiguration": convertCfnPipePipeLogConfigurationPropertyToCloudFormation(properties.logConfiguration),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Source": cdk.stringToCloudFormation(properties.source),
    "SourceParameters": convertCfnPipePipeSourceParametersPropertyToCloudFormation(properties.sourceParameters),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Target": cdk.stringToCloudFormation(properties.target),
    "TargetParameters": convertCfnPipePipeTargetParametersPropertyToCloudFormation(properties.targetParameters)
  };
}

// @ts-ignore TS6133
function CfnPipePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("desiredState", "DesiredState", (properties.DesiredState != null ? cfn_parse.FromCloudFormation.getString(properties.DesiredState) : undefined));
  ret.addPropertyResult("enrichment", "Enrichment", (properties.Enrichment != null ? cfn_parse.FromCloudFormation.getString(properties.Enrichment) : undefined));
  ret.addPropertyResult("enrichmentParameters", "EnrichmentParameters", (properties.EnrichmentParameters != null ? CfnPipePipeEnrichmentParametersPropertyFromCloudFormation(properties.EnrichmentParameters) : undefined));
  ret.addPropertyResult("logConfiguration", "LogConfiguration", (properties.LogConfiguration != null ? CfnPipePipeLogConfigurationPropertyFromCloudFormation(properties.LogConfiguration) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("source", "Source", (properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined));
  ret.addPropertyResult("sourceParameters", "SourceParameters", (properties.SourceParameters != null ? CfnPipePipeSourceParametersPropertyFromCloudFormation(properties.SourceParameters) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined));
  ret.addPropertyResult("targetParameters", "TargetParameters", (properties.TargetParameters != null ? CfnPipePipeTargetParametersPropertyFromCloudFormation(properties.TargetParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}