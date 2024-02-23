/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * An activity is a task that you write in any programming language and host on any machine that has access to AWS Step Functions .
 *
 * Activities must poll Step Functions using the `GetActivityTask` API action and respond using `SendTask*` API actions. This function lets Step Functions know the existence of your activity and returns an identifier for use in a state machine and when polling from the activity.
 *
 * For information about creating an activity, see [Creating an Activity State Machine](https://docs.aws.amazon.com/step-functions/latest/dg/tutorial-creating-activity-state-machine.html) in the *AWS Step Functions Developer Guide* and [CreateActivity](https://docs.aws.amazon.com/step-functions/latest/apireference/API_CreateActivity.html) in the *AWS Step Functions API Reference* .
 *
 * @cloudformationResource AWS::StepFunctions::Activity
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html
 */
export class CfnActivity extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::StepFunctions::Activity";

  /**
   * Build a CfnActivity from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnActivity {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnActivityPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnActivity(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the ARN of the resource.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the name of the activity. For example:
   *
   * `{ "Fn::GetAtt": ["MyActivity", "Name"] }`
   *
   * Returns a value similar to the following:
   *
   * `myActivity`
   *
   * For more information about using `Fn::GetAtt` , see [Fn::GetAtt](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html) .
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The name of the activity.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The list of tags to add to a resource.
   */
  public tagsRaw?: Array<CfnActivity.TagsEntryProperty>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnActivityProps) {
    super(scope, id, {
      "type": CfnActivity.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::StepFunctions::Activity", props.tags, {
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnActivity.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnActivityPropsToCloudFormation(props);
  }
}

export namespace CfnActivity {
  /**
   * The `TagsEntry` property specifies *tags* to identify an activity.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-activity-tagsentry.html
   */
  export interface TagsEntryProperty {
    /**
     * The `key` for a key-value pair in a tag entry.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-activity-tagsentry.html#cfn-stepfunctions-activity-tagsentry-key
     */
    readonly key: string;

    /**
     * The `value` for a key-value pair in a tag entry.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-activity-tagsentry.html#cfn-stepfunctions-activity-tagsentry-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnActivity`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html
 */
export interface CfnActivityProps {
  /**
   * The name of the activity.
   *
   * A name must *not* contain:
   *
   * - white space
   * - brackets `< > { } [ ]`
   * - wildcard characters `? *`
   * - special characters `" # % \ ^ | ~ ` $ & , ; : /`
   * - control characters ( `U+0000-001F` , `U+007F-009F` )
   *
   * To enable logging with CloudWatch Logs, the name should only contain 0-9, A-Z, a-z, - and _.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html#cfn-stepfunctions-activity-name
   */
  readonly name: string;

  /**
   * The list of tags to add to a resource.
   *
   * Tags may only contain Unicode letters, digits, white space, or these symbols: `_ . : / = + - @` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html#cfn-stepfunctions-activity-tags
   */
  readonly tags?: Array<CfnActivity.TagsEntryProperty>;
}

/**
 * Determine whether the given properties match those of a `TagsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnActivityTagsEntryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagsEntryProperty\"");
}

// @ts-ignore TS6133
function convertCfnActivityTagsEntryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnActivityTagsEntryPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnActivityTagsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnActivity.TagsEntryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnActivity.TagsEntryProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnActivityProps`
 *
 * @param properties - the TypeScript properties of a `CfnActivityProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnActivityPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnActivityTagsEntryPropertyValidator))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnActivityProps\"");
}

// @ts-ignore TS6133
function convertCfnActivityPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnActivityPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(convertCfnActivityTagsEntryPropertyToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnActivityPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnActivityProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnActivityProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnActivityTagsEntryPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Provisions a state machine.
 *
 * A state machine consists of a collection of states that can do work ( `Task` states), determine to which states to transition next ( `Choice` states), stop an execution with an error ( `Fail` states), and so on. State machines are specified using a JSON-based, structured language.
 *
 * @cloudformationResource AWS::StepFunctions::StateMachine
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html
 */
export class CfnStateMachine extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::StepFunctions::StateMachine";

  /**
   * Build a CfnStateMachine from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStateMachine {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStateMachinePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStateMachine(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the ARN of the resource.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the name of the state machine. For example:
   *
   * `{ "Fn::GetAtt": ["MyStateMachine", "Name"] }`
   *
   * Returns the name of your state machine:
   *
   * `HelloWorld-StateMachine`
   *
   * If you did not specify the name it will be similar to the following:
   *
   * `MyStateMachine-1234abcdefgh`
   *
   * For more information about using `Fn::GetAtt` , see [Fn::GetAtt](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html) .
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * Identifier for a state machine revision, which is an immutable, read-only snapshot of a state machine’s definition and configuration.
   *
   * @cloudformationAttribute StateMachineRevisionId
   */
  public readonly attrStateMachineRevisionId: string;

  /**
   * The Amazon States Language definition of the state machine.
   */
  public definition?: any | cdk.IResolvable;

  /**
   * The name of the S3 bucket where the state machine definition is stored.
   */
  public definitionS3Location?: cdk.IResolvable | CfnStateMachine.S3LocationProperty;

  /**
   * The Amazon States Language definition of the state machine.
   */
  public definitionString?: string;

  /**
   * A map (string to string) that specifies the mappings for placeholder variables in the state machine definition.
   */
  public definitionSubstitutions?: cdk.IResolvable | Record<string, string>;

  /**
   * Defines what execution history events are logged and where they are logged.
   */
  public loggingConfiguration?: cdk.IResolvable | CfnStateMachine.LoggingConfigurationProperty;

  /**
   * The Amazon Resource Name (ARN) of the IAM role to use for this state machine.
   */
  public roleArn: string;

  /**
   * The name of the state machine.
   */
  public stateMachineName?: string;

  /**
   * Determines whether a `STANDARD` or `EXPRESS` state machine is created.
   */
  public stateMachineType?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The list of tags to add to a resource.
   */
  public tagsRaw?: Array<CfnStateMachine.TagsEntryProperty>;

  /**
   * Selects whether or not the state machine's AWS X-Ray tracing is enabled.
   */
  public tracingConfiguration?: cdk.IResolvable | CfnStateMachine.TracingConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStateMachineProps) {
    super(scope, id, {
      "type": CfnStateMachine.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "roleArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.attrStateMachineRevisionId = cdk.Token.asString(this.getAtt("StateMachineRevisionId", cdk.ResolutionTypeHint.STRING));
    this.definition = props.definition;
    this.definitionS3Location = props.definitionS3Location;
    this.definitionString = props.definitionString;
    this.definitionSubstitutions = props.definitionSubstitutions;
    this.loggingConfiguration = props.loggingConfiguration;
    this.roleArn = props.roleArn;
    this.stateMachineName = props.stateMachineName;
    this.stateMachineType = props.stateMachineType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::StepFunctions::StateMachine", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.tracingConfiguration = props.tracingConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "definition": this.definition,
      "definitionS3Location": this.definitionS3Location,
      "definitionString": this.definitionString,
      "definitionSubstitutions": this.definitionSubstitutions,
      "loggingConfiguration": this.loggingConfiguration,
      "roleArn": this.roleArn,
      "stateMachineName": this.stateMachineName,
      "stateMachineType": this.stateMachineType,
      "tags": this.tags.renderTags(),
      "tracingConfiguration": this.tracingConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStateMachine.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStateMachinePropsToCloudFormation(props);
  }
}

export namespace CfnStateMachine {
  /**
   * Defines what execution history events are logged and where they are logged.
   *
   * Step Functions provides the log levels — `OFF` , `ALL` , `ERROR` , and `FATAL` . No event types log when set to `OFF` and all event types do when set to `ALL` .
   *
   * > By default, the `level` is set to `OFF` . For more information see [Log Levels](https://docs.aws.amazon.com/step-functions/latest/dg/cloudwatch-log-level.html) in the AWS Step Functions User Guide.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html
   */
  export interface LoggingConfigurationProperty {
    /**
     * An array of objects that describes where your execution history events will be logged.
     *
     * Limited to size 1. Required, if your log level is not set to `OFF` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html#cfn-stepfunctions-statemachine-loggingconfiguration-destinations
     */
    readonly destinations?: Array<cdk.IResolvable | CfnStateMachine.LogDestinationProperty> | cdk.IResolvable;

    /**
     * Determines whether execution data is included in your log.
     *
     * When set to `false` , data is excluded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html#cfn-stepfunctions-statemachine-loggingconfiguration-includeexecutiondata
     */
    readonly includeExecutionData?: boolean | cdk.IResolvable;

    /**
     * Defines which category of execution history events are logged.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html#cfn-stepfunctions-statemachine-loggingconfiguration-level
     */
    readonly level?: string;
  }

  /**
   * Defines a destination for `LoggingConfiguration` .
   *
   * > For more information on logging with `EXPRESS` workflows, see [Logging Express Workflows Using CloudWatch Logs](https://docs.aws.amazon.com/step-functions/latest/dg/cw-logs.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-logdestination.html
   */
  export interface LogDestinationProperty {
    /**
     * An object describing a CloudWatch log group.
     *
     * For more information, see [AWS::Logs::LogGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html) in the AWS CloudFormation User Guide.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-logdestination.html#cfn-stepfunctions-statemachine-logdestination-cloudwatchlogsloggroup
     */
    readonly cloudWatchLogsLogGroup?: CfnStateMachine.CloudWatchLogsLogGroupProperty | cdk.IResolvable;
  }

  /**
   * Defines a CloudWatch log group.
   *
   * > For more information see [Standard Versus Express Workflows](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html) in the AWS Step Functions Developer Guide.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-cloudwatchlogsloggroup.html
   */
  export interface CloudWatchLogsLogGroupProperty {
    /**
     * The ARN of the the CloudWatch log group to which you want your logs emitted to.
     *
     * The ARN must end with `:*`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-cloudwatchlogsloggroup.html#cfn-stepfunctions-statemachine-cloudwatchlogsloggroup-loggrouparn
     */
    readonly logGroupArn?: string;
  }

  /**
   * Defines the S3 bucket location where a state machine definition is stored.
   *
   * The state machine definition must be a JSON or YAML file.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * The name of the S3 bucket where the state machine definition JSON or YAML file is stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-s3location.html#cfn-stepfunctions-statemachine-s3location-bucket
     */
    readonly bucket: string;

    /**
     * The name of the state machine definition file (Amazon S3 object name).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-s3location.html#cfn-stepfunctions-statemachine-s3location-key
     */
    readonly key: string;

    /**
     * For versioning-enabled buckets, a specific version of the state machine definition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-s3location.html#cfn-stepfunctions-statemachine-s3location-version
     */
    readonly version?: string;
  }

  /**
   * The `TagsEntry` property specifies *tags* to identify a state machine.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-tagsentry.html
   */
  export interface TagsEntryProperty {
    /**
     * The `key` for a key-value pair in a tag entry.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-tagsentry.html#cfn-stepfunctions-statemachine-tagsentry-key
     */
    readonly key: string;

    /**
     * The `value` for a key-value pair in a tag entry.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-tagsentry.html#cfn-stepfunctions-statemachine-tagsentry-value
     */
    readonly value: string;
  }

  /**
   * Selects whether or not the state machine's AWS X-Ray tracing is enabled.
   *
   * To configure your state machine to send trace data to X-Ray, set `Enabled` to `true` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-tracingconfiguration.html
   */
  export interface TracingConfigurationProperty {
    /**
     * When set to `true` , X-Ray tracing is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-tracingconfiguration.html#cfn-stepfunctions-statemachine-tracingconfiguration-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnStateMachine`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html
 */
export interface CfnStateMachineProps {
  /**
   * The Amazon States Language definition of the state machine.
   *
   * The state machine definition must be in JSON or YAML, and the format of the object must match the format of your CloudFormation template file. See [Amazon States Language](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definition
   */
  readonly definition?: any | cdk.IResolvable;

  /**
   * The name of the S3 bucket where the state machine definition is stored.
   *
   * The state machine definition must be a JSON or YAML file.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definitions3location
   */
  readonly definitionS3Location?: cdk.IResolvable | CfnStateMachine.S3LocationProperty;

  /**
   * The Amazon States Language definition of the state machine.
   *
   * The state machine definition must be in JSON. See [Amazon States Language](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definitionstring
   */
  readonly definitionString?: string;

  /**
   * A map (string to string) that specifies the mappings for placeholder variables in the state machine definition.
   *
   * This enables the customer to inject values obtained at runtime, for example from intrinsic functions, in the state machine definition. Variables can be template parameter names, resource logical IDs, resource attributes, or a variable in a key-value map.
   *
   * Substitutions must follow the syntax: `${key_name}` or `${variable_1,variable_2,...}` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definitionsubstitutions
   */
  readonly definitionSubstitutions?: cdk.IResolvable | Record<string, string>;

  /**
   * Defines what execution history events are logged and where they are logged.
   *
   * > By default, the `level` is set to `OFF` . For more information see [Log Levels](https://docs.aws.amazon.com/step-functions/latest/dg/cloudwatch-log-level.html) in the AWS Step Functions User Guide.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-loggingconfiguration
   */
  readonly loggingConfiguration?: cdk.IResolvable | CfnStateMachine.LoggingConfigurationProperty;

  /**
   * The Amazon Resource Name (ARN) of the IAM role to use for this state machine.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-rolearn
   */
  readonly roleArn: string;

  /**
   * The name of the state machine.
   *
   * A name must *not* contain:
   *
   * - white space
   * - brackets `< > { } [ ]`
   * - wildcard characters `? *`
   * - special characters `" # % \ ^ | ~ ` $ & , ; : /`
   * - control characters ( `U+0000-001F` , `U+007F-009F` )
   *
   * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-statemachinename
   */
  readonly stateMachineName?: string;

  /**
   * Determines whether a `STANDARD` or `EXPRESS` state machine is created.
   *
   * The default is `STANDARD` . You cannot update the `type` of a state machine once it has been created. For more information on `STANDARD` and `EXPRESS` workflows, see [Standard Versus Express Workflows](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html) in the AWS Step Functions Developer Guide.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-statemachinetype
   */
  readonly stateMachineType?: string;

  /**
   * The list of tags to add to a resource.
   *
   * Tags may only contain Unicode letters, digits, white space, or these symbols: `_ . : / = + - @` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-tags
   */
  readonly tags?: Array<CfnStateMachine.TagsEntryProperty>;

  /**
   * Selects whether or not the state machine's AWS X-Ray tracing is enabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-tracingconfiguration
   */
  readonly tracingConfiguration?: cdk.IResolvable | CfnStateMachine.TracingConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogsLogGroupProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsLogGroupProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineCloudWatchLogsLogGroupPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroupArn", cdk.validateString)(properties.logGroupArn));
  return errors.wrap("supplied properties not correct for \"CloudWatchLogsLogGroupProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineCloudWatchLogsLogGroupPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineCloudWatchLogsLogGroupPropertyValidator(properties).assertSuccess();
  return {
    "LogGroupArn": cdk.stringToCloudFormation(properties.logGroupArn)
  };
}

// @ts-ignore TS6133
function CfnStateMachineCloudWatchLogsLogGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.CloudWatchLogsLogGroupProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.CloudWatchLogsLogGroupProperty>();
  ret.addPropertyResult("logGroupArn", "LogGroupArn", (properties.LogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `LogDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLogsLogGroup", CfnStateMachineCloudWatchLogsLogGroupPropertyValidator)(properties.cloudWatchLogsLogGroup));
  return errors.wrap("supplied properties not correct for \"LogDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineLogDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineLogDestinationPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLogsLogGroup": convertCfnStateMachineCloudWatchLogsLogGroupPropertyToCloudFormation(properties.cloudWatchLogsLogGroup)
  };
}

// @ts-ignore TS6133
function CfnStateMachineLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStateMachine.LogDestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.LogDestinationProperty>();
  ret.addPropertyResult("cloudWatchLogsLogGroup", "CloudWatchLogsLogGroup", (properties.CloudWatchLogsLogGroup != null ? CfnStateMachineCloudWatchLogsLogGroupPropertyFromCloudFormation(properties.CloudWatchLogsLogGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoggingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineLoggingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinations", cdk.listValidator(CfnStateMachineLogDestinationPropertyValidator))(properties.destinations));
  errors.collect(cdk.propertyValidator("includeExecutionData", cdk.validateBoolean)(properties.includeExecutionData));
  errors.collect(cdk.propertyValidator("level", cdk.validateString)(properties.level));
  return errors.wrap("supplied properties not correct for \"LoggingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineLoggingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineLoggingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Destinations": cdk.listMapper(convertCfnStateMachineLogDestinationPropertyToCloudFormation)(properties.destinations),
    "IncludeExecutionData": cdk.booleanToCloudFormation(properties.includeExecutionData),
    "Level": cdk.stringToCloudFormation(properties.level)
  };
}

// @ts-ignore TS6133
function CfnStateMachineLoggingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStateMachine.LoggingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.LoggingConfigurationProperty>();
  ret.addPropertyResult("destinations", "Destinations", (properties.Destinations != null ? cfn_parse.FromCloudFormation.getArray(CfnStateMachineLogDestinationPropertyFromCloudFormation)(properties.Destinations) : undefined));
  ret.addPropertyResult("includeExecutionData", "IncludeExecutionData", (properties.IncludeExecutionData != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeExecutionData) : undefined));
  ret.addPropertyResult("level", "Level", (properties.Level != null ? cfn_parse.FromCloudFormation.getString(properties.Level) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnStateMachineS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStateMachine.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.S3LocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TagsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineTagsEntryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagsEntryProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineTagsEntryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineTagsEntryPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnStateMachineTagsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStateMachine.TagsEntryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.TagsEntryProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TracingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TracingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineTracingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"TracingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineTracingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineTracingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnStateMachineTracingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStateMachine.TracingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.TracingConfigurationProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStateMachineProps`
 *
 * @param properties - the TypeScript properties of a `CfnStateMachineProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachinePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("definition", cdk.validateObject)(properties.definition));
  errors.collect(cdk.propertyValidator("definitionS3Location", CfnStateMachineS3LocationPropertyValidator)(properties.definitionS3Location));
  errors.collect(cdk.propertyValidator("definitionString", cdk.validateString)(properties.definitionString));
  errors.collect(cdk.propertyValidator("definitionSubstitutions", cdk.hashValidator(cdk.validateString))(properties.definitionSubstitutions));
  errors.collect(cdk.propertyValidator("loggingConfiguration", CfnStateMachineLoggingConfigurationPropertyValidator)(properties.loggingConfiguration));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("stateMachineName", cdk.validateString)(properties.stateMachineName));
  errors.collect(cdk.propertyValidator("stateMachineType", cdk.validateString)(properties.stateMachineType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnStateMachineTagsEntryPropertyValidator))(properties.tags));
  errors.collect(cdk.propertyValidator("tracingConfiguration", CfnStateMachineTracingConfigurationPropertyValidator)(properties.tracingConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnStateMachineProps\"");
}

// @ts-ignore TS6133
function convertCfnStateMachinePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachinePropsValidator(properties).assertSuccess();
  return {
    "Definition": cdk.objectToCloudFormation(properties.definition),
    "DefinitionS3Location": convertCfnStateMachineS3LocationPropertyToCloudFormation(properties.definitionS3Location),
    "DefinitionString": cdk.stringToCloudFormation(properties.definitionString),
    "DefinitionSubstitutions": cdk.hashMapper(cdk.stringToCloudFormation)(properties.definitionSubstitutions),
    "LoggingConfiguration": convertCfnStateMachineLoggingConfigurationPropertyToCloudFormation(properties.loggingConfiguration),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "StateMachineName": cdk.stringToCloudFormation(properties.stateMachineName),
    "StateMachineType": cdk.stringToCloudFormation(properties.stateMachineType),
    "Tags": cdk.listMapper(convertCfnStateMachineTagsEntryPropertyToCloudFormation)(properties.tags),
    "TracingConfiguration": convertCfnStateMachineTracingConfigurationPropertyToCloudFormation(properties.tracingConfiguration)
  };
}

// @ts-ignore TS6133
function CfnStateMachinePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachineProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachineProps>();
  ret.addPropertyResult("definition", "Definition", (properties.Definition != null ? cfn_parse.FromCloudFormation.getAny(properties.Definition) : undefined));
  ret.addPropertyResult("definitionS3Location", "DefinitionS3Location", (properties.DefinitionS3Location != null ? CfnStateMachineS3LocationPropertyFromCloudFormation(properties.DefinitionS3Location) : undefined));
  ret.addPropertyResult("definitionString", "DefinitionString", (properties.DefinitionString != null ? cfn_parse.FromCloudFormation.getString(properties.DefinitionString) : undefined));
  ret.addPropertyResult("definitionSubstitutions", "DefinitionSubstitutions", (properties.DefinitionSubstitutions != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.DefinitionSubstitutions) : undefined));
  ret.addPropertyResult("loggingConfiguration", "LoggingConfiguration", (properties.LoggingConfiguration != null ? CfnStateMachineLoggingConfigurationPropertyFromCloudFormation(properties.LoggingConfiguration) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("stateMachineName", "StateMachineName", (properties.StateMachineName != null ? cfn_parse.FromCloudFormation.getString(properties.StateMachineName) : undefined));
  ret.addPropertyResult("stateMachineType", "StateMachineType", (properties.StateMachineType != null ? cfn_parse.FromCloudFormation.getString(properties.StateMachineType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnStateMachineTagsEntryPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addPropertyResult("tracingConfiguration", "TracingConfiguration", (properties.TracingConfiguration != null ? CfnStateMachineTracingConfigurationPropertyFromCloudFormation(properties.TracingConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Represents a state machine [alias](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-state-machine-alias.html) . An alias routes traffic to one or two versions of the same state machine.
 *
 * You can create up to 100 aliases for each state machine.
 *
 * @cloudformationResource AWS::StepFunctions::StateMachineAlias
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachinealias.html
 */
export class CfnStateMachineAlias extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::StepFunctions::StateMachineAlias";

  /**
   * Build a CfnStateMachineAlias from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStateMachineAlias {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStateMachineAliasPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStateMachineAlias(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the ARN of the state machine alias. For example, `arn:aws:states:us-east-1:123456789012:stateMachine:myStateMachine:PROD` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The settings that enable gradual state machine deployments.
   */
  public deploymentPreference?: CfnStateMachineAlias.DeploymentPreferenceProperty | cdk.IResolvable;

  /**
   * An optional description of the state machine alias.
   */
  public description?: string;

  /**
   * The name of the state machine alias.
   */
  public name?: string;

  /**
   * The routing configuration of an alias.
   */
  public routingConfiguration?: Array<cdk.IResolvable | CfnStateMachineAlias.RoutingConfigurationVersionProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStateMachineAliasProps = {}) {
    super(scope, id, {
      "type": CfnStateMachineAlias.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.deploymentPreference = props.deploymentPreference;
    this.description = props.description;
    this.name = props.name;
    this.routingConfiguration = props.routingConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deploymentPreference": this.deploymentPreference,
      "description": this.description,
      "name": this.name,
      "routingConfiguration": this.routingConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStateMachineAlias.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStateMachineAliasPropsToCloudFormation(props);
  }
}

export namespace CfnStateMachineAlias {
  /**
   * The state machine version to which you want to route the execution traffic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachinealias-routingconfigurationversion.html
   */
  export interface RoutingConfigurationVersionProperty {
    /**
     * The Amazon Resource Name (ARN) that identifies one or two state machine versions defined in the routing configuration.
     *
     * If you specify the ARN of a second version, it must belong to the same state machine as the first version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachinealias-routingconfigurationversion.html#cfn-stepfunctions-statemachinealias-routingconfigurationversion-statemachineversionarn
     */
    readonly stateMachineVersionArn: string;

    /**
     * The percentage of traffic you want to route to the state machine version.
     *
     * The sum of the weights in the routing configuration must be equal to 100.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachinealias-routingconfigurationversion.html#cfn-stepfunctions-statemachinealias-routingconfigurationversion-weight
     */
    readonly weight: number;
  }

  /**
   * Enables gradual state machine deployments.
   *
   * CloudFormation automatically shifts traffic from the version the alias currently points to, to a new state machine version that you specify.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachinealias-deploymentpreference.html
   */
  export interface DeploymentPreferenceProperty {
    /**
     * A list of Amazon CloudWatch alarms to be monitored during the deployment.
     *
     * The deployment fails and rolls back if any of these alarms go into the `ALARM` state.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachinealias-deploymentpreference.html#cfn-stepfunctions-statemachinealias-deploymentpreference-alarms
     */
    readonly alarms?: Array<string>;

    /**
     * The time in minutes between each traffic shifting increment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachinealias-deploymentpreference.html#cfn-stepfunctions-statemachinealias-deploymentpreference-interval
     */
    readonly interval?: number;

    /**
     * The percentage of traffic to shift to the new version in each increment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachinealias-deploymentpreference.html#cfn-stepfunctions-statemachinealias-deploymentpreference-percentage
     */
    readonly percentage?: number;

    /**
     * The Amazon Resource Name (ARN) of the [`AWS::StepFunctions::StateMachineVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachineversion.html) resource that will be the final version to which the alias points to when the traffic shifting is complete.
     *
     * While performing gradual deployments, you can only provide a single state machine version ARN. To explicitly set version weights in a CloudFormation template, use `RoutingConfiguration` instead.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachinealias-deploymentpreference.html#cfn-stepfunctions-statemachinealias-deploymentpreference-statemachineversionarn
     */
    readonly stateMachineVersionArn: string;

    /**
     * The type of deployment you want to perform. You can specify one of the following types:.
     *
     * - `LINEAR` - Shifts traffic to the new version in equal increments with an equal number of minutes between each increment.
     *
     * For example, if you specify the increment percent as `20` with an interval of `600` minutes, this deployment increases traffic by 20 percent every 600 minutes until the new version receives 100 percent of the traffic. This deployment immediately rolls back the new version if any CloudWatch alarms are triggered.
     * - `ALL_AT_ONCE` - Shifts 100 percent of traffic to the new version immediately. CloudFormation monitors the new version and rolls it back automatically to the previous version if any CloudWatch alarms are triggered.
     * - `CANARY` - Shifts traffic in two increments.
     *
     * In the first increment, a small percentage of traffic, for example, 10 percent is shifted to the new version. In the second increment, before a specified time interval in seconds gets over, the remaining traffic is shifted to the new version. The shift to the new version for the remaining traffic takes place only if no CloudWatch alarms are triggered during the specified time interval.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachinealias-deploymentpreference.html#cfn-stepfunctions-statemachinealias-deploymentpreference-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnStateMachineAlias`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachinealias.html
 */
export interface CfnStateMachineAliasProps {
  /**
   * The settings that enable gradual state machine deployments.
   *
   * These settings include [Alarms](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachinealias-deploymentpreference.html#cfn-stepfunctions-statemachinealias-deploymentpreference-alarms) , [Interval](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachinealias-deploymentpreference.html#cfn-stepfunctions-statemachinealias-deploymentpreference-interval) , [Percentage](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachinealias-deploymentpreference.html#cfn-stepfunctions-statemachinealias-deploymentpreference-percentage) , [StateMachineVersionArn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachinealias-deploymentpreference.html#cfn-stepfunctions-statemachinealias-deploymentpreference-statemachineversionarn) , and [Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachinealias-deploymentpreference.html#cfn-stepfunctions-statemachinealias-deploymentpreference-type) .
   *
   * CloudFormation automatically shifts traffic from the version an alias currently points to, to a new state machine version that you specify.
   *
   * > `RoutingConfiguration` and `DeploymentPreference` are mutually exclusive properties. You must define only one of these properties.
   *
   * Based on the type of deployment you want to perform, you can specify one of the following settings:
   *
   * - `LINEAR` - Shifts traffic to the new version in equal increments with an equal number of minutes between each increment.
   *
   * For example, if you specify the increment percent as `20` with an interval of `600` minutes, this deployment increases traffic by 20 percent every 600 minutes until the new version receives 100 percent of the traffic. This deployment immediately rolls back the new version if any Amazon CloudWatch alarms are triggered.
   * - `ALL_AT_ONCE` - Shifts 100 percent of traffic to the new version immediately. CloudFormation monitors the new version and rolls it back automatically to the previous version if any CloudWatch alarms are triggered.
   * - `CANARY` - Shifts traffic in two increments.
   *
   * In the first increment, a small percentage of traffic, for example, 10 percent is shifted to the new version. In the second increment, before a specified time interval in seconds gets over, the remaining traffic is shifted to the new version. The shift to the new version for the remaining traffic takes place only if no CloudWatch alarms are triggered during the specified time interval.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachinealias.html#cfn-stepfunctions-statemachinealias-deploymentpreference
   */
  readonly deploymentPreference?: CfnStateMachineAlias.DeploymentPreferenceProperty | cdk.IResolvable;

  /**
   * An optional description of the state machine alias.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachinealias.html#cfn-stepfunctions-statemachinealias-description
   */
  readonly description?: string;

  /**
   * The name of the state machine alias.
   *
   * If you don't provide a name, it uses an automatically generated name based on the logical ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachinealias.html#cfn-stepfunctions-statemachinealias-name
   */
  readonly name?: string;

  /**
   * The routing configuration of an alias.
   *
   * Routing configuration splits [StartExecution](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html) requests between one or two versions of the same state machine.
   *
   * Use `RoutingConfiguration` if you want to explicitly set the alias [weights](https://docs.aws.amazon.com/step-functions/latest/apireference/API_RoutingConfigurationListItem.html#StepFunctions-Type-RoutingConfigurationListItem-weight) . Weight is the percentage of traffic you want to route to a state machine version.
   *
   * > `RoutingConfiguration` and `DeploymentPreference` are mutually exclusive properties. You must define only one of these properties.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachinealias.html#cfn-stepfunctions-statemachinealias-routingconfiguration
   */
  readonly routingConfiguration?: Array<cdk.IResolvable | CfnStateMachineAlias.RoutingConfigurationVersionProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `RoutingConfigurationVersionProperty`
 *
 * @param properties - the TypeScript properties of a `RoutingConfigurationVersionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineAliasRoutingConfigurationVersionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("stateMachineVersionArn", cdk.requiredValidator)(properties.stateMachineVersionArn));
  errors.collect(cdk.propertyValidator("stateMachineVersionArn", cdk.validateString)(properties.stateMachineVersionArn));
  errors.collect(cdk.propertyValidator("weight", cdk.requiredValidator)(properties.weight));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"RoutingConfigurationVersionProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineAliasRoutingConfigurationVersionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineAliasRoutingConfigurationVersionPropertyValidator(properties).assertSuccess();
  return {
    "StateMachineVersionArn": cdk.stringToCloudFormation(properties.stateMachineVersionArn),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnStateMachineAliasRoutingConfigurationVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStateMachineAlias.RoutingConfigurationVersionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachineAlias.RoutingConfigurationVersionProperty>();
  ret.addPropertyResult("stateMachineVersionArn", "StateMachineVersionArn", (properties.StateMachineVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.StateMachineVersionArn) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeploymentPreferenceProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentPreferenceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineAliasDeploymentPreferencePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alarms", cdk.listValidator(cdk.validateString))(properties.alarms));
  errors.collect(cdk.propertyValidator("interval", cdk.validateNumber)(properties.interval));
  errors.collect(cdk.propertyValidator("percentage", cdk.validateNumber)(properties.percentage));
  errors.collect(cdk.propertyValidator("stateMachineVersionArn", cdk.requiredValidator)(properties.stateMachineVersionArn));
  errors.collect(cdk.propertyValidator("stateMachineVersionArn", cdk.validateString)(properties.stateMachineVersionArn));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"DeploymentPreferenceProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineAliasDeploymentPreferencePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineAliasDeploymentPreferencePropertyValidator(properties).assertSuccess();
  return {
    "Alarms": cdk.listMapper(cdk.stringToCloudFormation)(properties.alarms),
    "Interval": cdk.numberToCloudFormation(properties.interval),
    "Percentage": cdk.numberToCloudFormation(properties.percentage),
    "StateMachineVersionArn": cdk.stringToCloudFormation(properties.stateMachineVersionArn),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnStateMachineAliasDeploymentPreferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachineAlias.DeploymentPreferenceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachineAlias.DeploymentPreferenceProperty>();
  ret.addPropertyResult("alarms", "Alarms", (properties.Alarms != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Alarms) : undefined));
  ret.addPropertyResult("interval", "Interval", (properties.Interval != null ? cfn_parse.FromCloudFormation.getNumber(properties.Interval) : undefined));
  ret.addPropertyResult("percentage", "Percentage", (properties.Percentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.Percentage) : undefined));
  ret.addPropertyResult("stateMachineVersionArn", "StateMachineVersionArn", (properties.StateMachineVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.StateMachineVersionArn) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStateMachineAliasProps`
 *
 * @param properties - the TypeScript properties of a `CfnStateMachineAliasProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineAliasPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deploymentPreference", CfnStateMachineAliasDeploymentPreferencePropertyValidator)(properties.deploymentPreference));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("routingConfiguration", cdk.listValidator(CfnStateMachineAliasRoutingConfigurationVersionPropertyValidator))(properties.routingConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnStateMachineAliasProps\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineAliasPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineAliasPropsValidator(properties).assertSuccess();
  return {
    "DeploymentPreference": convertCfnStateMachineAliasDeploymentPreferencePropertyToCloudFormation(properties.deploymentPreference),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RoutingConfiguration": cdk.listMapper(convertCfnStateMachineAliasRoutingConfigurationVersionPropertyToCloudFormation)(properties.routingConfiguration)
  };
}

// @ts-ignore TS6133
function CfnStateMachineAliasPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachineAliasProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachineAliasProps>();
  ret.addPropertyResult("deploymentPreference", "DeploymentPreference", (properties.DeploymentPreference != null ? CfnStateMachineAliasDeploymentPreferencePropertyFromCloudFormation(properties.DeploymentPreference) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("routingConfiguration", "RoutingConfiguration", (properties.RoutingConfiguration != null ? cfn_parse.FromCloudFormation.getArray(CfnStateMachineAliasRoutingConfigurationVersionPropertyFromCloudFormation)(properties.RoutingConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Represents a state machine [version](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-state-machine-version.html) . A published version uses the latest state machine [*revision*](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-state-machine-version.html) . A revision is an immutable, read-only snapshot of a state machine’s definition and configuration.
 *
 * You can publish up to 1000 versions for each state machine.
 *
 * > Before you delete a version, make sure that version's ARN isn't being referenced in any long-running workflows or application code outside of the stack.
 *
 * @cloudformationResource AWS::StepFunctions::StateMachineVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachineversion.html
 */
export class CfnStateMachineVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::StepFunctions::StateMachineVersion";

  /**
   * Build a CfnStateMachineVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStateMachineVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStateMachineVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStateMachineVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the ARN of the state machine version. For example, `arn:aws:states:us-east-1:123456789012:stateMachine:myStateMachine:1` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * An optional description of the state machine version.
   */
  public description?: string;

  /**
   * The Amazon Resource Name (ARN) of the state machine.
   */
  public stateMachineArn: string;

  /**
   * Identifier for a state machine revision, which is an immutable, read-only snapshot of a state machine’s definition and configuration.
   */
  public stateMachineRevisionId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStateMachineVersionProps) {
    super(scope, id, {
      "type": CfnStateMachineVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "stateMachineArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.stateMachineArn = props.stateMachineArn;
    this.stateMachineRevisionId = props.stateMachineRevisionId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "stateMachineArn": this.stateMachineArn,
      "stateMachineRevisionId": this.stateMachineRevisionId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStateMachineVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStateMachineVersionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnStateMachineVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachineversion.html
 */
export interface CfnStateMachineVersionProps {
  /**
   * An optional description of the state machine version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachineversion.html#cfn-stepfunctions-statemachineversion-description
   */
  readonly description?: string;

  /**
   * The Amazon Resource Name (ARN) of the state machine.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachineversion.html#cfn-stepfunctions-statemachineversion-statemachinearn
   */
  readonly stateMachineArn: string;

  /**
   * Identifier for a state machine revision, which is an immutable, read-only snapshot of a state machine’s definition and configuration.
   *
   * Only publish the state machine version if the current state machine's revision ID matches the specified ID. Use this option to avoid publishing a version if the state machine has changed since you last updated it.
   *
   * To specify the initial state machine revision, set the value as `INITIAL` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachineversion.html#cfn-stepfunctions-statemachineversion-statemachinerevisionid
   */
  readonly stateMachineRevisionId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnStateMachineVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnStateMachineVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("stateMachineArn", cdk.requiredValidator)(properties.stateMachineArn));
  errors.collect(cdk.propertyValidator("stateMachineArn", cdk.validateString)(properties.stateMachineArn));
  errors.collect(cdk.propertyValidator("stateMachineRevisionId", cdk.validateString)(properties.stateMachineRevisionId));
  return errors.wrap("supplied properties not correct for \"CfnStateMachineVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineVersionPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "StateMachineArn": cdk.stringToCloudFormation(properties.stateMachineArn),
    "StateMachineRevisionId": cdk.stringToCloudFormation(properties.stateMachineRevisionId)
  };
}

// @ts-ignore TS6133
function CfnStateMachineVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachineVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachineVersionProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("stateMachineArn", "StateMachineArn", (properties.StateMachineArn != null ? cfn_parse.FromCloudFormation.getString(properties.StateMachineArn) : undefined));
  ret.addPropertyResult("stateMachineRevisionId", "StateMachineRevisionId", (properties.StateMachineRevisionId != null ? cfn_parse.FromCloudFormation.getString(properties.StateMachineRevisionId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}