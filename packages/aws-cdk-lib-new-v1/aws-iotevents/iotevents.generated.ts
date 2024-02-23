/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Represents an alarm model to monitor an AWS IoT Events input attribute.
 *
 * You can use the alarm to get notified when the value is outside a specified range. For more information, see [Create an alarm model](https://docs.aws.amazon.com/iotevents/latest/developerguide/create-alarms.html) in the *AWS IoT Events Developer Guide* .
 *
 * @cloudformationResource AWS::IoTEvents::AlarmModel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-alarmmodel.html
 */
export class CfnAlarmModel extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTEvents::AlarmModel";

  /**
   * Build a CfnAlarmModel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAlarmModel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAlarmModelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAlarmModel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Contains the configuration information of alarm state changes.
   */
  public alarmCapabilities?: CfnAlarmModel.AlarmCapabilitiesProperty | cdk.IResolvable;

  /**
   * Contains information about one or more alarm actions.
   */
  public alarmEventActions?: CfnAlarmModel.AlarmEventActionsProperty | cdk.IResolvable;

  /**
   * The description of the alarm model.
   */
  public alarmModelDescription?: string;

  /**
   * The name of the alarm model.
   */
  public alarmModelName?: string;

  /**
   * Defines when your alarm is invoked.
   */
  public alarmRule: CfnAlarmModel.AlarmRuleProperty | cdk.IResolvable;

  /**
   * An input attribute used as a key to create an alarm.
   */
  public key?: string;

  /**
   * The ARN of the IAM role that allows the alarm to perform actions and access AWS resources.
   */
  public roleArn: string;

  /**
   * A non-negative integer that reflects the severity level of the alarm.
   */
  public severity?: number;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of key-value pairs that contain metadata for the alarm model.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAlarmModelProps) {
    super(scope, id, {
      "type": CfnAlarmModel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "alarmRule", this);
    cdk.requireProperty(props, "roleArn", this);

    this.alarmCapabilities = props.alarmCapabilities;
    this.alarmEventActions = props.alarmEventActions;
    this.alarmModelDescription = props.alarmModelDescription;
    this.alarmModelName = props.alarmModelName;
    this.alarmRule = props.alarmRule;
    this.key = props.key;
    this.roleArn = props.roleArn;
    this.severity = props.severity;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTEvents::AlarmModel", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "alarmCapabilities": this.alarmCapabilities,
      "alarmEventActions": this.alarmEventActions,
      "alarmModelDescription": this.alarmModelDescription,
      "alarmModelName": this.alarmModelName,
      "alarmRule": this.alarmRule,
      "key": this.key,
      "roleArn": this.roleArn,
      "severity": this.severity,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAlarmModel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAlarmModelPropsToCloudFormation(props);
  }
}

export namespace CfnAlarmModel {
  /**
   * Defines when your alarm is invoked.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmrule.html
   */
  export interface AlarmRuleProperty {
    /**
     * A rule that compares an input property value to a threshold value with a comparison operator.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmrule.html#cfn-iotevents-alarmmodel-alarmrule-simplerule
     */
    readonly simpleRule?: cdk.IResolvable | CfnAlarmModel.SimpleRuleProperty;
  }

  /**
   * A rule that compares an input property value to a threshold value with a comparison operator.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-simplerule.html
   */
  export interface SimpleRuleProperty {
    /**
     * The comparison operator.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-simplerule.html#cfn-iotevents-alarmmodel-simplerule-comparisonoperator
     */
    readonly comparisonOperator: string;

    /**
     * The value on the left side of the comparison operator.
     *
     * You can specify an AWS IoT Events input attribute as an input property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-simplerule.html#cfn-iotevents-alarmmodel-simplerule-inputproperty
     */
    readonly inputProperty: string;

    /**
     * The value on the right side of the comparison operator.
     *
     * You can enter a number or specify an AWS IoT Events input attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-simplerule.html#cfn-iotevents-alarmmodel-simplerule-threshold
     */
    readonly threshold: string;
  }

  /**
   * Contains the configuration information of alarm state changes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmcapabilities.html
   */
  export interface AlarmCapabilitiesProperty {
    /**
     * Specifies whether to get notified for alarm state changes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmcapabilities.html#cfn-iotevents-alarmmodel-alarmcapabilities-acknowledgeflow
     */
    readonly acknowledgeFlow?: CfnAlarmModel.AcknowledgeFlowProperty | cdk.IResolvable;

    /**
     * Specifies the default alarm state.
     *
     * The configuration applies to all alarms that were created based on this alarm model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmcapabilities.html#cfn-iotevents-alarmmodel-alarmcapabilities-initializationconfiguration
     */
    readonly initializationConfiguration?: CfnAlarmModel.InitializationConfigurationProperty | cdk.IResolvable;
  }

  /**
   * Specifies whether to get notified for alarm state changes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-acknowledgeflow.html
   */
  export interface AcknowledgeFlowProperty {
    /**
     * The value must be `TRUE` or `FALSE` .
     *
     * If `TRUE` , you receive a notification when the alarm state changes. You must choose to acknowledge the notification before the alarm state can return to `NORMAL` . If `FALSE` , you won't receive notifications. The alarm automatically changes to the `NORMAL` state when the input property value returns to the specified range.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-acknowledgeflow.html#cfn-iotevents-alarmmodel-acknowledgeflow-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
  }

  /**
   * Specifies the default alarm state.
   *
   * The configuration applies to all alarms that were created based on this alarm model.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-initializationconfiguration.html
   */
  export interface InitializationConfigurationProperty {
    /**
     * The value must be `TRUE` or `FALSE` .
     *
     * If `FALSE` , all alarm instances created based on the alarm model are activated. The default value is `TRUE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-initializationconfiguration.html#cfn-iotevents-alarmmodel-initializationconfiguration-disabledoninitialization
     */
    readonly disabledOnInitialization: boolean | cdk.IResolvable;
  }

  /**
   * Contains information about one or more alarm actions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmeventactions.html
   */
  export interface AlarmEventActionsProperty {
    /**
     * Specifies one or more supported actions to receive notifications when the alarm state changes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmeventactions.html#cfn-iotevents-alarmmodel-alarmeventactions-alarmactions
     */
    readonly alarmActions?: Array<CfnAlarmModel.AlarmActionProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Specifies one of the following actions to receive notifications when the alarm state changes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmaction.html
   */
  export interface AlarmActionProperty {
    /**
     * Defines an action to write to the Amazon DynamoDB table that you created.
     *
     * The standard action payload contains all the information about the detector model instance and the event that triggered the action. You can customize the [payload](https://docs.aws.amazon.com/iotevents/latest/apireference/API_Payload.html) . One column of the DynamoDB table receives all attribute-value pairs in the payload that you specify.
     *
     * You must use expressions for all parameters in `DynamoDBAction` . The expressions accept literals, operators, functions, references, and substitution templates.
     *
     * **Examples** - For literal values, the expressions must contain single quotes. For example, the value for the `hashKeyType` parameter can be `'STRING'` .
     * - For references, you must specify either variables or input values. For example, the value for the `hashKeyField` parameter can be `$input.GreenhouseInput.name` .
     * - For a substitution template, you must use `${}` , and the template must be in single quotes. A substitution template can also contain a combination of literals, operators, functions, references, and substitution templates.
     *
     * In the following example, the value for the `hashKeyValue` parameter uses a substitution template.
     *
     * `'${$input.GreenhouseInput.temperature * 6 / 5 + 32} in Fahrenheit'`
     * - For a string concatenation, you must use `+` . A string concatenation can also contain a combination of literals, operators, functions, references, and substitution templates.
     *
     * In the following example, the value for the `tableName` parameter uses a string concatenation.
     *
     * `'GreenhouseTemperatureTable ' + $input.GreenhouseInput.date`
     *
     * For more information, see [Expressions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html) in the *AWS IoT Events Developer Guide* .
     *
     * If the defined payload type is a string, `DynamoDBAction` writes non-JSON data to the DynamoDB table as binary data. The DynamoDB console displays the data as Base64-encoded text. The value for the `payloadField` parameter is `<payload-field>_raw` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmaction.html#cfn-iotevents-alarmmodel-alarmaction-dynamodb
     */
    readonly dynamoDb?: CfnAlarmModel.DynamoDBProperty | cdk.IResolvable;

    /**
     * Defines an action to write to the Amazon DynamoDB table that you created.
     *
     * The default action payload contains all the information about the detector model instance and the event that triggered the action. You can customize the [payload](https://docs.aws.amazon.com/iotevents/latest/apireference/API_Payload.html) . A separate column of the DynamoDB table receives one attribute-value pair in the payload that you specify.
     *
     * You must use expressions for all parameters in `DynamoDBv2Action` . The expressions accept literals, operators, functions, references, and substitution templates.
     *
     * **Examples** - For literal values, the expressions must contain single quotes. For example, the value for the `tableName` parameter can be `'GreenhouseTemperatureTable'` .
     * - For references, you must specify either variables or input values. For example, the value for the `tableName` parameter can be `$variable.ddbtableName` .
     * - For a substitution template, you must use `${}` , and the template must be in single quotes. A substitution template can also contain a combination of literals, operators, functions, references, and substitution templates.
     *
     * In the following example, the value for the `contentExpression` parameter in `Payload` uses a substitution template.
     *
     * `'{\"sensorID\": \"${$input.GreenhouseInput.sensor_id}\", \"temperature\": \"${$input.GreenhouseInput.temperature * 9 / 5 + 32}\"}'`
     * - For a string concatenation, you must use `+` . A string concatenation can also contain a combination of literals, operators, functions, references, and substitution templates.
     *
     * In the following example, the value for the `tableName` parameter uses a string concatenation.
     *
     * `'GreenhouseTemperatureTable ' + $input.GreenhouseInput.date`
     *
     * For more information, see [Expressions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html) in the *AWS IoT Events Developer Guide* .
     *
     * The value for the `type` parameter in `Payload` must be `JSON` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmaction.html#cfn-iotevents-alarmmodel-alarmaction-dynamodbv2
     */
    readonly dynamoDBv2?: CfnAlarmModel.DynamoDBv2Property | cdk.IResolvable;

    /**
     * Sends information about the detector model instance and the event that triggered the action to an Amazon Kinesis Data Firehose delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmaction.html#cfn-iotevents-alarmmodel-alarmaction-firehose
     */
    readonly firehose?: CfnAlarmModel.FirehoseProperty | cdk.IResolvable;

    /**
     * Sends an AWS IoT Events input, passing in information about the detector model instance and the event that triggered the action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmaction.html#cfn-iotevents-alarmmodel-alarmaction-iotevents
     */
    readonly iotEvents?: CfnAlarmModel.IotEventsProperty | cdk.IResolvable;

    /**
     * Sends information about the detector model instance and the event that triggered the action to a specified asset property in AWS IoT SiteWise .
     *
     * You must use expressions for all parameters in `IotSiteWiseAction` . The expressions accept literals, operators, functions, references, and substitutions templates.
     *
     * **Examples** - For literal values, the expressions must contain single quotes. For example, the value for the `propertyAlias` parameter can be `'/company/windfarm/3/turbine/7/temperature'` .
     * - For references, you must specify either variables or input values. For example, the value for the `assetId` parameter can be `$input.TurbineInput.assetId1` .
     * - For a substitution template, you must use `${}` , and the template must be in single quotes. A substitution template can also contain a combination of literals, operators, functions, references, and substitution templates.
     *
     * In the following example, the value for the `propertyAlias` parameter uses a substitution template.
     *
     * `'company/windfarm/${$input.TemperatureInput.sensorData.windfarmID}/turbine/ ${$input.TemperatureInput.sensorData.turbineID}/temperature'`
     *
     * You must specify either `propertyAlias` or both `assetId` and `propertyId` to identify the target asset property in AWS IoT SiteWise .
     *
     * For more information, see [Expressions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html) in the *AWS IoT Events Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmaction.html#cfn-iotevents-alarmmodel-alarmaction-iotsitewise
     */
    readonly iotSiteWise?: CfnAlarmModel.IotSiteWiseProperty | cdk.IResolvable;

    /**
     * Information required to publish the MQTT message through the AWS IoT message broker.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmaction.html#cfn-iotevents-alarmmodel-alarmaction-iottopicpublish
     */
    readonly iotTopicPublish?: CfnAlarmModel.IotTopicPublishProperty | cdk.IResolvable;

    /**
     * Calls a Lambda function, passing in information about the detector model instance and the event that triggered the action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmaction.html#cfn-iotevents-alarmmodel-alarmaction-lambda
     */
    readonly lambda?: cdk.IResolvable | CfnAlarmModel.LambdaProperty;

    /**
     * Information required to publish the Amazon SNS message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmaction.html#cfn-iotevents-alarmmodel-alarmaction-sns
     */
    readonly sns?: cdk.IResolvable | CfnAlarmModel.SnsProperty;

    /**
     * Sends information about the detector model instance and the event that triggered the action to an Amazon SQS queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-alarmaction.html#cfn-iotevents-alarmmodel-alarmaction-sqs
     */
    readonly sqs?: cdk.IResolvable | CfnAlarmModel.SqsProperty;
  }

  /**
   * Defines an action to write to the Amazon DynamoDB table that you created.
   *
   * The default action payload contains all the information about the detector model instance and the event that triggered the action. You can customize the [payload](https://docs.aws.amazon.com/iotevents/latest/apireference/API_Payload.html) . A separate column of the DynamoDB table receives one attribute-value pair in the payload that you specify.
   *
   * You must use expressions for all parameters in `DynamoDBv2Action` . The expressions accept literals, operators, functions, references, and substitution templates.
   *
   * **Examples** - For literal values, the expressions must contain single quotes. For example, the value for the `tableName` parameter can be `'GreenhouseTemperatureTable'` .
   * - For references, you must specify either variables or input values. For example, the value for the `tableName` parameter can be `$variable.ddbtableName` .
   * - For a substitution template, you must use `${}` , and the template must be in single quotes. A substitution template can also contain a combination of literals, operators, functions, references, and substitution templates.
   *
   * In the following example, the value for the `contentExpression` parameter in `Payload` uses a substitution template.
   *
   * `'{\"sensorID\": \"${$input.GreenhouseInput.sensor_id}\", \"temperature\": \"${$input.GreenhouseInput.temperature * 9 / 5 + 32}\"}'`
   * - For a string concatenation, you must use `+` . A string concatenation can also contain a combination of literals, operators, functions, references, and substitution templates.
   *
   * In the following example, the value for the `tableName` parameter uses a string concatenation.
   *
   * `'GreenhouseTemperatureTable ' + $input.GreenhouseInput.date`
   *
   * For more information, see [Expressions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html) in the *AWS IoT Events Developer Guide* .
   *
   * The value for the `type` parameter in `Payload` must be `JSON` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-dynamodbv2.html
   */
  export interface DynamoDBv2Property {
    /**
     * Information needed to configure the payload.
     *
     * By default, AWS IoT Events generates a standard payload in JSON for any action. This action payload contains all attribute-value pairs that have the information about the detector model instance and the event triggered the action. To configure the action payload, you can use `contentExpression` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-dynamodbv2.html#cfn-iotevents-alarmmodel-dynamodbv2-payload
     */
    readonly payload?: cdk.IResolvable | CfnAlarmModel.PayloadProperty;

    /**
     * The name of the DynamoDB table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-dynamodbv2.html#cfn-iotevents-alarmmodel-dynamodbv2-tablename
     */
    readonly tableName: string;
  }

  /**
   * Information needed to configure the payload.
   *
   * By default, AWS IoT Events generates a standard payload in JSON for any action. This action payload contains all attribute-value pairs that have the information about the detector model instance and the event triggered the action. To configure the action payload, you can use `contentExpression` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-payload.html
   */
  export interface PayloadProperty {
    /**
     * The content of the payload.
     *
     * You can use a string expression that includes quoted strings ( `'<string>'` ), variables ( `$variable.<variable-name>` ), input values ( `$input.<input-name>.<path-to-datum>` ), string concatenations, and quoted strings that contain `${}` as the content. The recommended maximum size of a content expression is 1 KB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-payload.html#cfn-iotevents-alarmmodel-payload-contentexpression
     */
    readonly contentExpression: string;

    /**
     * The value of the payload type can be either `STRING` or `JSON` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-payload.html#cfn-iotevents-alarmmodel-payload-type
     */
    readonly type: string;
  }

  /**
   * Sends an AWS IoT Events input, passing in information about the detector model instance and the event that triggered the action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-iotevents.html
   */
  export interface IotEventsProperty {
    /**
     * The name of the AWS IoT Events input where the data is sent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-iotevents.html#cfn-iotevents-alarmmodel-iotevents-inputname
     */
    readonly inputName: string;

    /**
     * You can configure the action payload when you send a message to an AWS IoT Events input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-iotevents.html#cfn-iotevents-alarmmodel-iotevents-payload
     */
    readonly payload?: cdk.IResolvable | CfnAlarmModel.PayloadProperty;
  }

  /**
   * Sends information about the detector model instance and the event that triggered the action to a specified asset property in AWS IoT SiteWise .
   *
   * You must use expressions for all parameters in `IotSiteWiseAction` . The expressions accept literals, operators, functions, references, and substitutions templates.
   *
   * **Examples** - For literal values, the expressions must contain single quotes. For example, the value for the `propertyAlias` parameter can be `'/company/windfarm/3/turbine/7/temperature'` .
   * - For references, you must specify either variables or input values. For example, the value for the `assetId` parameter can be `$input.TurbineInput.assetId1` .
   * - For a substitution template, you must use `${}` , and the template must be in single quotes. A substitution template can also contain a combination of literals, operators, functions, references, and substitution templates.
   *
   * In the following example, the value for the `propertyAlias` parameter uses a substitution template.
   *
   * `'company/windfarm/${$input.TemperatureInput.sensorData.windfarmID}/turbine/ ${$input.TemperatureInput.sensorData.turbineID}/temperature'`
   *
   * You must specify either `propertyAlias` or both `assetId` and `propertyId` to identify the target asset property in AWS IoT SiteWise .
   *
   * For more information, see [Expressions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html) in the *AWS IoT Events Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-iotsitewise.html
   */
  export interface IotSiteWiseProperty {
    /**
     * The ID of the asset that has the specified property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-iotsitewise.html#cfn-iotevents-alarmmodel-iotsitewise-assetid
     */
    readonly assetId?: string;

    /**
     * A unique identifier for this entry.
     *
     * You can use the entry ID to track which data entry causes an error in case of failure. The default is a new unique identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-iotsitewise.html#cfn-iotevents-alarmmodel-iotsitewise-entryid
     */
    readonly entryId?: string;

    /**
     * The alias of the asset property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-iotsitewise.html#cfn-iotevents-alarmmodel-iotsitewise-propertyalias
     */
    readonly propertyAlias?: string;

    /**
     * The ID of the asset property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-iotsitewise.html#cfn-iotevents-alarmmodel-iotsitewise-propertyid
     */
    readonly propertyId?: string;

    /**
     * The value to send to the asset property.
     *
     * This value contains timestamp, quality, and value (TQV) information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-iotsitewise.html#cfn-iotevents-alarmmodel-iotsitewise-propertyvalue
     */
    readonly propertyValue?: CfnAlarmModel.AssetPropertyValueProperty | cdk.IResolvable;
  }

  /**
   * A structure that contains value information. For more information, see [AssetPropertyValue](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_AssetPropertyValue.html) in the *AWS IoT SiteWise API Reference* .
   *
   * You must use expressions for all parameters in `AssetPropertyValue` . The expressions accept literals, operators, functions, references, and substitution templates.
   *
   * **Examples** - For literal values, the expressions must contain single quotes. For example, the value for the `quality` parameter can be `'GOOD'` .
   * - For references, you must specify either variables or input values. For example, the value for the `quality` parameter can be `$input.TemperatureInput.sensorData.quality` .
   *
   * For more information, see [Expressions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html) in the *AWS IoT Events Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-assetpropertyvalue.html
   */
  export interface AssetPropertyValueProperty {
    /**
     * The quality of the asset property value.
     *
     * The value must be `'GOOD'` , `'BAD'` , or `'UNCERTAIN'` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-assetpropertyvalue.html#cfn-iotevents-alarmmodel-assetpropertyvalue-quality
     */
    readonly quality?: string;

    /**
     * The timestamp associated with the asset property value.
     *
     * The default is the current event time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-assetpropertyvalue.html#cfn-iotevents-alarmmodel-assetpropertyvalue-timestamp
     */
    readonly timestamp?: CfnAlarmModel.AssetPropertyTimestampProperty | cdk.IResolvable;

    /**
     * The value to send to an asset property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-assetpropertyvalue.html#cfn-iotevents-alarmmodel-assetpropertyvalue-value
     */
    readonly value: CfnAlarmModel.AssetPropertyVariantProperty | cdk.IResolvable;
  }

  /**
   * A structure that contains an asset property value.
   *
   * For more information, see [Variant](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_Variant.html) in the *AWS IoT SiteWise API Reference* .
   *
   * You must use expressions for all parameters in `AssetPropertyVariant` . The expressions accept literals, operators, functions, references, and substitution templates.
   *
   * **Examples** - For literal values, the expressions must contain single quotes. For example, the value for the `integerValue` parameter can be `'100'` .
   * - For references, you must specify either variables or parameters. For example, the value for the `booleanValue` parameter can be `$variable.offline` .
   * - For a substitution template, you must use `${}` , and the template must be in single quotes. A substitution template can also contain a combination of literals, operators, functions, references, and substitution templates.
   *
   * In the following example, the value for the `doubleValue` parameter uses a substitution template.
   *
   * `'${$input.TemperatureInput.sensorData.temperature * 6 / 5 + 32}'`
   *
   * For more information, see [Expressions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html) in the *AWS IoT Events Developer Guide* .
   *
   * You must specify one of the following value types, depending on the `dataType` of the specified asset property. For more information, see [AssetProperty](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_AssetProperty.html) in the *AWS IoT SiteWise API Reference* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-assetpropertyvariant.html
   */
  export interface AssetPropertyVariantProperty {
    /**
     * The asset property value is a Boolean value that must be `'TRUE'` or `'FALSE'` .
     *
     * You must use an expression, and the evaluated result should be a Boolean value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-assetpropertyvariant.html#cfn-iotevents-alarmmodel-assetpropertyvariant-booleanvalue
     */
    readonly booleanValue?: string;

    /**
     * The asset property value is a double.
     *
     * You must use an expression, and the evaluated result should be a double.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-assetpropertyvariant.html#cfn-iotevents-alarmmodel-assetpropertyvariant-doublevalue
     */
    readonly doubleValue?: string;

    /**
     * The asset property value is an integer.
     *
     * You must use an expression, and the evaluated result should be an integer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-assetpropertyvariant.html#cfn-iotevents-alarmmodel-assetpropertyvariant-integervalue
     */
    readonly integerValue?: string;

    /**
     * The asset property value is a string.
     *
     * You must use an expression, and the evaluated result should be a string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-assetpropertyvariant.html#cfn-iotevents-alarmmodel-assetpropertyvariant-stringvalue
     */
    readonly stringValue?: string;
  }

  /**
   * A structure that contains timestamp information. For more information, see [TimeInNanos](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_TimeInNanos.html) in the *AWS IoT SiteWise API Reference* .
   *
   * You must use expressions for all parameters in `AssetPropertyTimestamp` . The expressions accept literals, operators, functions, references, and substitution templates.
   *
   * **Examples** - For literal values, the expressions must contain single quotes. For example, the value for the `timeInSeconds` parameter can be `'1586400675'` .
   * - For references, you must specify either variables or input values. For example, the value for the `offsetInNanos` parameter can be `$variable.time` .
   * - For a substitution template, you must use `${}` , and the template must be in single quotes. A substitution template can also contain a combination of literals, operators, functions, references, and substitution templates.
   *
   * In the following example, the value for the `timeInSeconds` parameter uses a substitution template.
   *
   * `'${$input.TemperatureInput.sensorData.timestamp / 1000}'`
   *
   * For more information, see [Expressions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html) in the *AWS IoT Events Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-assetpropertytimestamp.html
   */
  export interface AssetPropertyTimestampProperty {
    /**
     * The nanosecond offset converted from `timeInSeconds` .
     *
     * The valid range is between 0-999999999.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-assetpropertytimestamp.html#cfn-iotevents-alarmmodel-assetpropertytimestamp-offsetinnanos
     */
    readonly offsetInNanos?: string;

    /**
     * The timestamp, in seconds, in the Unix epoch format.
     *
     * The valid range is between 1-31556889864403199.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-assetpropertytimestamp.html#cfn-iotevents-alarmmodel-assetpropertytimestamp-timeinseconds
     */
    readonly timeInSeconds: string;
  }

  /**
   * Sends information about the detector model instance and the event that triggered the action to an Amazon SQS queue.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-sqs.html
   */
  export interface SqsProperty {
    /**
     * You can configure the action payload when you send a message to an Amazon SQS queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-sqs.html#cfn-iotevents-alarmmodel-sqs-payload
     */
    readonly payload?: cdk.IResolvable | CfnAlarmModel.PayloadProperty;

    /**
     * The URL of the SQS queue where the data is written.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-sqs.html#cfn-iotevents-alarmmodel-sqs-queueurl
     */
    readonly queueUrl: string;

    /**
     * Set this to TRUE if you want the data to be base-64 encoded before it is written to the queue.
     *
     * Otherwise, set this to FALSE.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-sqs.html#cfn-iotevents-alarmmodel-sqs-usebase64
     */
    readonly useBase64?: boolean | cdk.IResolvable;
  }

  /**
   * Sends information about the detector model instance and the event that triggered the action to an Amazon Kinesis Data Firehose delivery stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-firehose.html
   */
  export interface FirehoseProperty {
    /**
     * The name of the Kinesis Data Firehose delivery stream where the data is written.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-firehose.html#cfn-iotevents-alarmmodel-firehose-deliverystreamname
     */
    readonly deliveryStreamName: string;

    /**
     * You can configure the action payload when you send a message to an Amazon Kinesis Data Firehose delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-firehose.html#cfn-iotevents-alarmmodel-firehose-payload
     */
    readonly payload?: cdk.IResolvable | CfnAlarmModel.PayloadProperty;

    /**
     * A character separator that is used to separate records written to the Kinesis Data Firehose delivery stream.
     *
     * Valid values are: '\n' (newline), '\t' (tab), '\r\n' (Windows newline), ',' (comma).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-firehose.html#cfn-iotevents-alarmmodel-firehose-separator
     */
    readonly separator?: string;
  }

  /**
   * Defines an action to write to the Amazon DynamoDB table that you created.
   *
   * The standard action payload contains all the information about the detector model instance and the event that triggered the action. You can customize the [payload](https://docs.aws.amazon.com/iotevents/latest/apireference/API_Payload.html) . One column of the DynamoDB table receives all attribute-value pairs in the payload that you specify.
   *
   * You must use expressions for all parameters in `DynamoDBAction` . The expressions accept literals, operators, functions, references, and substitution templates.
   *
   * **Examples** - For literal values, the expressions must contain single quotes. For example, the value for the `hashKeyType` parameter can be `'STRING'` .
   * - For references, you must specify either variables or input values. For example, the value for the `hashKeyField` parameter can be `$input.GreenhouseInput.name` .
   * - For a substitution template, you must use `${}` , and the template must be in single quotes. A substitution template can also contain a combination of literals, operators, functions, references, and substitution templates.
   *
   * In the following example, the value for the `hashKeyValue` parameter uses a substitution template.
   *
   * `'${$input.GreenhouseInput.temperature * 6 / 5 + 32} in Fahrenheit'`
   * - For a string concatenation, you must use `+` . A string concatenation can also contain a combination of literals, operators, functions, references, and substitution templates.
   *
   * In the following example, the value for the `tableName` parameter uses a string concatenation.
   *
   * `'GreenhouseTemperatureTable ' + $input.GreenhouseInput.date`
   *
   * For more information, see [Expressions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html) in the *AWS IoT Events Developer Guide* .
   *
   * If the defined payload type is a string, `DynamoDBAction` writes non-JSON data to the DynamoDB table as binary data. The DynamoDB console displays the data as Base64-encoded text. The value for the `payloadField` parameter is `<payload-field>_raw` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-dynamodb.html
   */
  export interface DynamoDBProperty {
    /**
     * The name of the hash key (also called the partition key).
     *
     * The `hashKeyField` value must match the partition key of the target DynamoDB table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-dynamodb.html#cfn-iotevents-alarmmodel-dynamodb-hashkeyfield
     */
    readonly hashKeyField: string;

    /**
     * The data type for the hash key (also called the partition key). You can specify the following values:.
     *
     * - `'STRING'` - The hash key is a string.
     * - `'NUMBER'` - The hash key is a number.
     *
     * If you don't specify `hashKeyType` , the default value is `'STRING'` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-dynamodb.html#cfn-iotevents-alarmmodel-dynamodb-hashkeytype
     */
    readonly hashKeyType?: string;

    /**
     * The value of the hash key (also called the partition key).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-dynamodb.html#cfn-iotevents-alarmmodel-dynamodb-hashkeyvalue
     */
    readonly hashKeyValue: string;

    /**
     * The type of operation to perform. You can specify the following values:.
     *
     * - `'INSERT'` - Insert data as a new item into the DynamoDB table. This item uses the specified hash key as a partition key. If you specified a range key, the item uses the range key as a sort key.
     * - `'UPDATE'` - Update an existing item of the DynamoDB table with new data. This item's partition key must match the specified hash key. If you specified a range key, the range key must match the item's sort key.
     * - `'DELETE'` - Delete an existing item of the DynamoDB table. This item's partition key must match the specified hash key. If you specified a range key, the range key must match the item's sort key.
     *
     * If you don't specify this parameter, AWS IoT Events triggers the `'INSERT'` operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-dynamodb.html#cfn-iotevents-alarmmodel-dynamodb-operation
     */
    readonly operation?: string;

    /**
     * Information needed to configure the payload.
     *
     * By default, AWS IoT Events generates a standard payload in JSON for any action. This action payload contains all attribute-value pairs that have the information about the detector model instance and the event triggered the action. To configure the action payload, you can use `contentExpression` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-dynamodb.html#cfn-iotevents-alarmmodel-dynamodb-payload
     */
    readonly payload?: cdk.IResolvable | CfnAlarmModel.PayloadProperty;

    /**
     * The name of the DynamoDB column that receives the action payload.
     *
     * If you don't specify this parameter, the name of the DynamoDB column is `payload` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-dynamodb.html#cfn-iotevents-alarmmodel-dynamodb-payloadfield
     */
    readonly payloadField?: string;

    /**
     * The name of the range key (also called the sort key).
     *
     * The `rangeKeyField` value must match the sort key of the target DynamoDB table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-dynamodb.html#cfn-iotevents-alarmmodel-dynamodb-rangekeyfield
     */
    readonly rangeKeyField?: string;

    /**
     * The data type for the range key (also called the sort key), You can specify the following values:.
     *
     * - `'STRING'` - The range key is a string.
     * - `'NUMBER'` - The range key is number.
     *
     * If you don't specify `rangeKeyField` , the default value is `'STRING'` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-dynamodb.html#cfn-iotevents-alarmmodel-dynamodb-rangekeytype
     */
    readonly rangeKeyType?: string;

    /**
     * The value of the range key (also called the sort key).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-dynamodb.html#cfn-iotevents-alarmmodel-dynamodb-rangekeyvalue
     */
    readonly rangeKeyValue?: string;

    /**
     * The name of the DynamoDB table.
     *
     * The `tableName` value must match the table name of the target DynamoDB table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-dynamodb.html#cfn-iotevents-alarmmodel-dynamodb-tablename
     */
    readonly tableName: string;
  }

  /**
   * Information required to publish the MQTT message through the AWS IoT message broker.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-iottopicpublish.html
   */
  export interface IotTopicPublishProperty {
    /**
     * The MQTT topic of the message.
     *
     * You can use a string expression that includes variables ( `$variable.<variable-name>` ) and input values ( `$input.<input-name>.<path-to-datum>` ) as the topic string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-iottopicpublish.html#cfn-iotevents-alarmmodel-iottopicpublish-mqtttopic
     */
    readonly mqttTopic: string;

    /**
     * You can configure the action payload when you publish a message to an AWS IoT Core topic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-iottopicpublish.html#cfn-iotevents-alarmmodel-iottopicpublish-payload
     */
    readonly payload?: cdk.IResolvable | CfnAlarmModel.PayloadProperty;
  }

  /**
   * Information required to publish the Amazon SNS message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-sns.html
   */
  export interface SnsProperty {
    /**
     * You can configure the action payload when you send a message as an Amazon SNS push notification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-sns.html#cfn-iotevents-alarmmodel-sns-payload
     */
    readonly payload?: cdk.IResolvable | CfnAlarmModel.PayloadProperty;

    /**
     * The ARN of the Amazon SNS target where the message is sent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-sns.html#cfn-iotevents-alarmmodel-sns-targetarn
     */
    readonly targetArn: string;
  }

  /**
   * Calls a Lambda function, passing in information about the detector model instance and the event that triggered the action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-lambda.html
   */
  export interface LambdaProperty {
    /**
     * The ARN of the Lambda function that is executed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-lambda.html#cfn-iotevents-alarmmodel-lambda-functionarn
     */
    readonly functionArn: string;

    /**
     * You can configure the action payload when you send a message to a Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-alarmmodel-lambda.html#cfn-iotevents-alarmmodel-lambda-payload
     */
    readonly payload?: cdk.IResolvable | CfnAlarmModel.PayloadProperty;
  }
}

/**
 * Properties for defining a `CfnAlarmModel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-alarmmodel.html
 */
export interface CfnAlarmModelProps {
  /**
   * Contains the configuration information of alarm state changes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-alarmmodel.html#cfn-iotevents-alarmmodel-alarmcapabilities
   */
  readonly alarmCapabilities?: CfnAlarmModel.AlarmCapabilitiesProperty | cdk.IResolvable;

  /**
   * Contains information about one or more alarm actions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-alarmmodel.html#cfn-iotevents-alarmmodel-alarmeventactions
   */
  readonly alarmEventActions?: CfnAlarmModel.AlarmEventActionsProperty | cdk.IResolvable;

  /**
   * The description of the alarm model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-alarmmodel.html#cfn-iotevents-alarmmodel-alarmmodeldescription
   */
  readonly alarmModelDescription?: string;

  /**
   * The name of the alarm model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-alarmmodel.html#cfn-iotevents-alarmmodel-alarmmodelname
   */
  readonly alarmModelName?: string;

  /**
   * Defines when your alarm is invoked.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-alarmmodel.html#cfn-iotevents-alarmmodel-alarmrule
   */
  readonly alarmRule: CfnAlarmModel.AlarmRuleProperty | cdk.IResolvable;

  /**
   * An input attribute used as a key to create an alarm.
   *
   * AWS IoT Events routes [inputs](https://docs.aws.amazon.com/iotevents/latest/apireference/API_Input.html) associated with this key to the alarm.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-alarmmodel.html#cfn-iotevents-alarmmodel-key
   */
  readonly key?: string;

  /**
   * The ARN of the IAM role that allows the alarm to perform actions and access AWS resources.
   *
   * For more information, see [Amazon Resource Names (ARNs)](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) in the *AWS General Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-alarmmodel.html#cfn-iotevents-alarmmodel-rolearn
   */
  readonly roleArn: string;

  /**
   * A non-negative integer that reflects the severity level of the alarm.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-alarmmodel.html#cfn-iotevents-alarmmodel-severity
   */
  readonly severity?: number;

  /**
   * A list of key-value pairs that contain metadata for the alarm model.
   *
   * The tags help you manage the alarm model. For more information, see [Tagging your AWS IoT Events resources](https://docs.aws.amazon.com/iotevents/latest/developerguide/tagging-iotevents.html) in the *AWS IoT Events Developer Guide* .
   *
   * You can create up to 50 tags for one alarm model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-alarmmodel.html#cfn-iotevents-alarmmodel-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `SimpleRuleProperty`
 *
 * @param properties - the TypeScript properties of a `SimpleRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelSimpleRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.requiredValidator)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.validateString)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("inputProperty", cdk.requiredValidator)(properties.inputProperty));
  errors.collect(cdk.propertyValidator("inputProperty", cdk.validateString)(properties.inputProperty));
  errors.collect(cdk.propertyValidator("threshold", cdk.requiredValidator)(properties.threshold));
  errors.collect(cdk.propertyValidator("threshold", cdk.validateString)(properties.threshold));
  return errors.wrap("supplied properties not correct for \"SimpleRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelSimpleRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelSimpleRulePropertyValidator(properties).assertSuccess();
  return {
    "ComparisonOperator": cdk.stringToCloudFormation(properties.comparisonOperator),
    "InputProperty": cdk.stringToCloudFormation(properties.inputProperty),
    "Threshold": cdk.stringToCloudFormation(properties.threshold)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelSimpleRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAlarmModel.SimpleRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.SimpleRuleProperty>();
  ret.addPropertyResult("comparisonOperator", "ComparisonOperator", (properties.ComparisonOperator != null ? cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator) : undefined));
  ret.addPropertyResult("inputProperty", "InputProperty", (properties.InputProperty != null ? cfn_parse.FromCloudFormation.getString(properties.InputProperty) : undefined));
  ret.addPropertyResult("threshold", "Threshold", (properties.Threshold != null ? cfn_parse.FromCloudFormation.getString(properties.Threshold) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AlarmRuleProperty`
 *
 * @param properties - the TypeScript properties of a `AlarmRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelAlarmRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("simpleRule", CfnAlarmModelSimpleRulePropertyValidator)(properties.simpleRule));
  return errors.wrap("supplied properties not correct for \"AlarmRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelAlarmRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelAlarmRulePropertyValidator(properties).assertSuccess();
  return {
    "SimpleRule": convertCfnAlarmModelSimpleRulePropertyToCloudFormation(properties.simpleRule)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelAlarmRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModel.AlarmRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.AlarmRuleProperty>();
  ret.addPropertyResult("simpleRule", "SimpleRule", (properties.SimpleRule != null ? CfnAlarmModelSimpleRulePropertyFromCloudFormation(properties.SimpleRule) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AcknowledgeFlowProperty`
 *
 * @param properties - the TypeScript properties of a `AcknowledgeFlowProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelAcknowledgeFlowPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"AcknowledgeFlowProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelAcknowledgeFlowPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelAcknowledgeFlowPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelAcknowledgeFlowPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModel.AcknowledgeFlowProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.AcknowledgeFlowProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InitializationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `InitializationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelInitializationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("disabledOnInitialization", cdk.requiredValidator)(properties.disabledOnInitialization));
  errors.collect(cdk.propertyValidator("disabledOnInitialization", cdk.validateBoolean)(properties.disabledOnInitialization));
  return errors.wrap("supplied properties not correct for \"InitializationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelInitializationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelInitializationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DisabledOnInitialization": cdk.booleanToCloudFormation(properties.disabledOnInitialization)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelInitializationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModel.InitializationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.InitializationConfigurationProperty>();
  ret.addPropertyResult("disabledOnInitialization", "DisabledOnInitialization", (properties.DisabledOnInitialization != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisabledOnInitialization) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AlarmCapabilitiesProperty`
 *
 * @param properties - the TypeScript properties of a `AlarmCapabilitiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelAlarmCapabilitiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acknowledgeFlow", CfnAlarmModelAcknowledgeFlowPropertyValidator)(properties.acknowledgeFlow));
  errors.collect(cdk.propertyValidator("initializationConfiguration", CfnAlarmModelInitializationConfigurationPropertyValidator)(properties.initializationConfiguration));
  return errors.wrap("supplied properties not correct for \"AlarmCapabilitiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelAlarmCapabilitiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelAlarmCapabilitiesPropertyValidator(properties).assertSuccess();
  return {
    "AcknowledgeFlow": convertCfnAlarmModelAcknowledgeFlowPropertyToCloudFormation(properties.acknowledgeFlow),
    "InitializationConfiguration": convertCfnAlarmModelInitializationConfigurationPropertyToCloudFormation(properties.initializationConfiguration)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelAlarmCapabilitiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModel.AlarmCapabilitiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.AlarmCapabilitiesProperty>();
  ret.addPropertyResult("acknowledgeFlow", "AcknowledgeFlow", (properties.AcknowledgeFlow != null ? CfnAlarmModelAcknowledgeFlowPropertyFromCloudFormation(properties.AcknowledgeFlow) : undefined));
  ret.addPropertyResult("initializationConfiguration", "InitializationConfiguration", (properties.InitializationConfiguration != null ? CfnAlarmModelInitializationConfigurationPropertyFromCloudFormation(properties.InitializationConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PayloadProperty`
 *
 * @param properties - the TypeScript properties of a `PayloadProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelPayloadPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contentExpression", cdk.requiredValidator)(properties.contentExpression));
  errors.collect(cdk.propertyValidator("contentExpression", cdk.validateString)(properties.contentExpression));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"PayloadProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelPayloadPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelPayloadPropertyValidator(properties).assertSuccess();
  return {
    "ContentExpression": cdk.stringToCloudFormation(properties.contentExpression),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelPayloadPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAlarmModel.PayloadProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.PayloadProperty>();
  ret.addPropertyResult("contentExpression", "ContentExpression", (properties.ContentExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ContentExpression) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DynamoDBv2Property`
 *
 * @param properties - the TypeScript properties of a `DynamoDBv2Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelDynamoDBv2PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("payload", CfnAlarmModelPayloadPropertyValidator)(properties.payload));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"DynamoDBv2Property\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelDynamoDBv2PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelDynamoDBv2PropertyValidator(properties).assertSuccess();
  return {
    "Payload": convertCfnAlarmModelPayloadPropertyToCloudFormation(properties.payload),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelDynamoDBv2PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModel.DynamoDBv2Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.DynamoDBv2Property>();
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnAlarmModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IotEventsProperty`
 *
 * @param properties - the TypeScript properties of a `IotEventsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelIotEventsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("inputName", cdk.requiredValidator)(properties.inputName));
  errors.collect(cdk.propertyValidator("inputName", cdk.validateString)(properties.inputName));
  errors.collect(cdk.propertyValidator("payload", CfnAlarmModelPayloadPropertyValidator)(properties.payload));
  return errors.wrap("supplied properties not correct for \"IotEventsProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelIotEventsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelIotEventsPropertyValidator(properties).assertSuccess();
  return {
    "InputName": cdk.stringToCloudFormation(properties.inputName),
    "Payload": convertCfnAlarmModelPayloadPropertyToCloudFormation(properties.payload)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelIotEventsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModel.IotEventsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.IotEventsProperty>();
  ret.addPropertyResult("inputName", "InputName", (properties.InputName != null ? cfn_parse.FromCloudFormation.getString(properties.InputName) : undefined));
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnAlarmModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AssetPropertyVariantProperty`
 *
 * @param properties - the TypeScript properties of a `AssetPropertyVariantProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelAssetPropertyVariantPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("booleanValue", cdk.validateString)(properties.booleanValue));
  errors.collect(cdk.propertyValidator("doubleValue", cdk.validateString)(properties.doubleValue));
  errors.collect(cdk.propertyValidator("integerValue", cdk.validateString)(properties.integerValue));
  errors.collect(cdk.propertyValidator("stringValue", cdk.validateString)(properties.stringValue));
  return errors.wrap("supplied properties not correct for \"AssetPropertyVariantProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelAssetPropertyVariantPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelAssetPropertyVariantPropertyValidator(properties).assertSuccess();
  return {
    "BooleanValue": cdk.stringToCloudFormation(properties.booleanValue),
    "DoubleValue": cdk.stringToCloudFormation(properties.doubleValue),
    "IntegerValue": cdk.stringToCloudFormation(properties.integerValue),
    "StringValue": cdk.stringToCloudFormation(properties.stringValue)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelAssetPropertyVariantPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModel.AssetPropertyVariantProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.AssetPropertyVariantProperty>();
  ret.addPropertyResult("booleanValue", "BooleanValue", (properties.BooleanValue != null ? cfn_parse.FromCloudFormation.getString(properties.BooleanValue) : undefined));
  ret.addPropertyResult("doubleValue", "DoubleValue", (properties.DoubleValue != null ? cfn_parse.FromCloudFormation.getString(properties.DoubleValue) : undefined));
  ret.addPropertyResult("integerValue", "IntegerValue", (properties.IntegerValue != null ? cfn_parse.FromCloudFormation.getString(properties.IntegerValue) : undefined));
  ret.addPropertyResult("stringValue", "StringValue", (properties.StringValue != null ? cfn_parse.FromCloudFormation.getString(properties.StringValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AssetPropertyTimestampProperty`
 *
 * @param properties - the TypeScript properties of a `AssetPropertyTimestampProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelAssetPropertyTimestampPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("offsetInNanos", cdk.validateString)(properties.offsetInNanos));
  errors.collect(cdk.propertyValidator("timeInSeconds", cdk.requiredValidator)(properties.timeInSeconds));
  errors.collect(cdk.propertyValidator("timeInSeconds", cdk.validateString)(properties.timeInSeconds));
  return errors.wrap("supplied properties not correct for \"AssetPropertyTimestampProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelAssetPropertyTimestampPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelAssetPropertyTimestampPropertyValidator(properties).assertSuccess();
  return {
    "OffsetInNanos": cdk.stringToCloudFormation(properties.offsetInNanos),
    "TimeInSeconds": cdk.stringToCloudFormation(properties.timeInSeconds)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelAssetPropertyTimestampPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModel.AssetPropertyTimestampProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.AssetPropertyTimestampProperty>();
  ret.addPropertyResult("offsetInNanos", "OffsetInNanos", (properties.OffsetInNanos != null ? cfn_parse.FromCloudFormation.getString(properties.OffsetInNanos) : undefined));
  ret.addPropertyResult("timeInSeconds", "TimeInSeconds", (properties.TimeInSeconds != null ? cfn_parse.FromCloudFormation.getString(properties.TimeInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AssetPropertyValueProperty`
 *
 * @param properties - the TypeScript properties of a `AssetPropertyValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelAssetPropertyValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("quality", cdk.validateString)(properties.quality));
  errors.collect(cdk.propertyValidator("timestamp", CfnAlarmModelAssetPropertyTimestampPropertyValidator)(properties.timestamp));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", CfnAlarmModelAssetPropertyVariantPropertyValidator)(properties.value));
  return errors.wrap("supplied properties not correct for \"AssetPropertyValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelAssetPropertyValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelAssetPropertyValuePropertyValidator(properties).assertSuccess();
  return {
    "Quality": cdk.stringToCloudFormation(properties.quality),
    "Timestamp": convertCfnAlarmModelAssetPropertyTimestampPropertyToCloudFormation(properties.timestamp),
    "Value": convertCfnAlarmModelAssetPropertyVariantPropertyToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelAssetPropertyValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModel.AssetPropertyValueProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.AssetPropertyValueProperty>();
  ret.addPropertyResult("quality", "Quality", (properties.Quality != null ? cfn_parse.FromCloudFormation.getString(properties.Quality) : undefined));
  ret.addPropertyResult("timestamp", "Timestamp", (properties.Timestamp != null ? CfnAlarmModelAssetPropertyTimestampPropertyFromCloudFormation(properties.Timestamp) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? CfnAlarmModelAssetPropertyVariantPropertyFromCloudFormation(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IotSiteWiseProperty`
 *
 * @param properties - the TypeScript properties of a `IotSiteWiseProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelIotSiteWisePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assetId", cdk.validateString)(properties.assetId));
  errors.collect(cdk.propertyValidator("entryId", cdk.validateString)(properties.entryId));
  errors.collect(cdk.propertyValidator("propertyAlias", cdk.validateString)(properties.propertyAlias));
  errors.collect(cdk.propertyValidator("propertyId", cdk.validateString)(properties.propertyId));
  errors.collect(cdk.propertyValidator("propertyValue", CfnAlarmModelAssetPropertyValuePropertyValidator)(properties.propertyValue));
  return errors.wrap("supplied properties not correct for \"IotSiteWiseProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelIotSiteWisePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelIotSiteWisePropertyValidator(properties).assertSuccess();
  return {
    "AssetId": cdk.stringToCloudFormation(properties.assetId),
    "EntryId": cdk.stringToCloudFormation(properties.entryId),
    "PropertyAlias": cdk.stringToCloudFormation(properties.propertyAlias),
    "PropertyId": cdk.stringToCloudFormation(properties.propertyId),
    "PropertyValue": convertCfnAlarmModelAssetPropertyValuePropertyToCloudFormation(properties.propertyValue)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelIotSiteWisePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModel.IotSiteWiseProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.IotSiteWiseProperty>();
  ret.addPropertyResult("assetId", "AssetId", (properties.AssetId != null ? cfn_parse.FromCloudFormation.getString(properties.AssetId) : undefined));
  ret.addPropertyResult("entryId", "EntryId", (properties.EntryId != null ? cfn_parse.FromCloudFormation.getString(properties.EntryId) : undefined));
  ret.addPropertyResult("propertyAlias", "PropertyAlias", (properties.PropertyAlias != null ? cfn_parse.FromCloudFormation.getString(properties.PropertyAlias) : undefined));
  ret.addPropertyResult("propertyId", "PropertyId", (properties.PropertyId != null ? cfn_parse.FromCloudFormation.getString(properties.PropertyId) : undefined));
  ret.addPropertyResult("propertyValue", "PropertyValue", (properties.PropertyValue != null ? CfnAlarmModelAssetPropertyValuePropertyFromCloudFormation(properties.PropertyValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SqsProperty`
 *
 * @param properties - the TypeScript properties of a `SqsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelSqsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("payload", CfnAlarmModelPayloadPropertyValidator)(properties.payload));
  errors.collect(cdk.propertyValidator("queueUrl", cdk.requiredValidator)(properties.queueUrl));
  errors.collect(cdk.propertyValidator("queueUrl", cdk.validateString)(properties.queueUrl));
  errors.collect(cdk.propertyValidator("useBase64", cdk.validateBoolean)(properties.useBase64));
  return errors.wrap("supplied properties not correct for \"SqsProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelSqsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelSqsPropertyValidator(properties).assertSuccess();
  return {
    "Payload": convertCfnAlarmModelPayloadPropertyToCloudFormation(properties.payload),
    "QueueUrl": cdk.stringToCloudFormation(properties.queueUrl),
    "UseBase64": cdk.booleanToCloudFormation(properties.useBase64)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelSqsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAlarmModel.SqsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.SqsProperty>();
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnAlarmModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addPropertyResult("queueUrl", "QueueUrl", (properties.QueueUrl != null ? cfn_parse.FromCloudFormation.getString(properties.QueueUrl) : undefined));
  ret.addPropertyResult("useBase64", "UseBase64", (properties.UseBase64 != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseBase64) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FirehoseProperty`
 *
 * @param properties - the TypeScript properties of a `FirehoseProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelFirehosePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deliveryStreamName", cdk.requiredValidator)(properties.deliveryStreamName));
  errors.collect(cdk.propertyValidator("deliveryStreamName", cdk.validateString)(properties.deliveryStreamName));
  errors.collect(cdk.propertyValidator("payload", CfnAlarmModelPayloadPropertyValidator)(properties.payload));
  errors.collect(cdk.propertyValidator("separator", cdk.validateString)(properties.separator));
  return errors.wrap("supplied properties not correct for \"FirehoseProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelFirehosePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelFirehosePropertyValidator(properties).assertSuccess();
  return {
    "DeliveryStreamName": cdk.stringToCloudFormation(properties.deliveryStreamName),
    "Payload": convertCfnAlarmModelPayloadPropertyToCloudFormation(properties.payload),
    "Separator": cdk.stringToCloudFormation(properties.separator)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelFirehosePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModel.FirehoseProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.FirehoseProperty>();
  ret.addPropertyResult("deliveryStreamName", "DeliveryStreamName", (properties.DeliveryStreamName != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryStreamName) : undefined));
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnAlarmModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addPropertyResult("separator", "Separator", (properties.Separator != null ? cfn_parse.FromCloudFormation.getString(properties.Separator) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DynamoDBProperty`
 *
 * @param properties - the TypeScript properties of a `DynamoDBProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelDynamoDBPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hashKeyField", cdk.requiredValidator)(properties.hashKeyField));
  errors.collect(cdk.propertyValidator("hashKeyField", cdk.validateString)(properties.hashKeyField));
  errors.collect(cdk.propertyValidator("hashKeyType", cdk.validateString)(properties.hashKeyType));
  errors.collect(cdk.propertyValidator("hashKeyValue", cdk.requiredValidator)(properties.hashKeyValue));
  errors.collect(cdk.propertyValidator("hashKeyValue", cdk.validateString)(properties.hashKeyValue));
  errors.collect(cdk.propertyValidator("operation", cdk.validateString)(properties.operation));
  errors.collect(cdk.propertyValidator("payload", CfnAlarmModelPayloadPropertyValidator)(properties.payload));
  errors.collect(cdk.propertyValidator("payloadField", cdk.validateString)(properties.payloadField));
  errors.collect(cdk.propertyValidator("rangeKeyField", cdk.validateString)(properties.rangeKeyField));
  errors.collect(cdk.propertyValidator("rangeKeyType", cdk.validateString)(properties.rangeKeyType));
  errors.collect(cdk.propertyValidator("rangeKeyValue", cdk.validateString)(properties.rangeKeyValue));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"DynamoDBProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelDynamoDBPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelDynamoDBPropertyValidator(properties).assertSuccess();
  return {
    "HashKeyField": cdk.stringToCloudFormation(properties.hashKeyField),
    "HashKeyType": cdk.stringToCloudFormation(properties.hashKeyType),
    "HashKeyValue": cdk.stringToCloudFormation(properties.hashKeyValue),
    "Operation": cdk.stringToCloudFormation(properties.operation),
    "Payload": convertCfnAlarmModelPayloadPropertyToCloudFormation(properties.payload),
    "PayloadField": cdk.stringToCloudFormation(properties.payloadField),
    "RangeKeyField": cdk.stringToCloudFormation(properties.rangeKeyField),
    "RangeKeyType": cdk.stringToCloudFormation(properties.rangeKeyType),
    "RangeKeyValue": cdk.stringToCloudFormation(properties.rangeKeyValue),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelDynamoDBPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModel.DynamoDBProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.DynamoDBProperty>();
  ret.addPropertyResult("hashKeyField", "HashKeyField", (properties.HashKeyField != null ? cfn_parse.FromCloudFormation.getString(properties.HashKeyField) : undefined));
  ret.addPropertyResult("hashKeyType", "HashKeyType", (properties.HashKeyType != null ? cfn_parse.FromCloudFormation.getString(properties.HashKeyType) : undefined));
  ret.addPropertyResult("hashKeyValue", "HashKeyValue", (properties.HashKeyValue != null ? cfn_parse.FromCloudFormation.getString(properties.HashKeyValue) : undefined));
  ret.addPropertyResult("operation", "Operation", (properties.Operation != null ? cfn_parse.FromCloudFormation.getString(properties.Operation) : undefined));
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnAlarmModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addPropertyResult("payloadField", "PayloadField", (properties.PayloadField != null ? cfn_parse.FromCloudFormation.getString(properties.PayloadField) : undefined));
  ret.addPropertyResult("rangeKeyField", "RangeKeyField", (properties.RangeKeyField != null ? cfn_parse.FromCloudFormation.getString(properties.RangeKeyField) : undefined));
  ret.addPropertyResult("rangeKeyType", "RangeKeyType", (properties.RangeKeyType != null ? cfn_parse.FromCloudFormation.getString(properties.RangeKeyType) : undefined));
  ret.addPropertyResult("rangeKeyValue", "RangeKeyValue", (properties.RangeKeyValue != null ? cfn_parse.FromCloudFormation.getString(properties.RangeKeyValue) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IotTopicPublishProperty`
 *
 * @param properties - the TypeScript properties of a `IotTopicPublishProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelIotTopicPublishPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mqttTopic", cdk.requiredValidator)(properties.mqttTopic));
  errors.collect(cdk.propertyValidator("mqttTopic", cdk.validateString)(properties.mqttTopic));
  errors.collect(cdk.propertyValidator("payload", CfnAlarmModelPayloadPropertyValidator)(properties.payload));
  return errors.wrap("supplied properties not correct for \"IotTopicPublishProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelIotTopicPublishPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelIotTopicPublishPropertyValidator(properties).assertSuccess();
  return {
    "MqttTopic": cdk.stringToCloudFormation(properties.mqttTopic),
    "Payload": convertCfnAlarmModelPayloadPropertyToCloudFormation(properties.payload)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelIotTopicPublishPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModel.IotTopicPublishProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.IotTopicPublishProperty>();
  ret.addPropertyResult("mqttTopic", "MqttTopic", (properties.MqttTopic != null ? cfn_parse.FromCloudFormation.getString(properties.MqttTopic) : undefined));
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnAlarmModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SnsProperty`
 *
 * @param properties - the TypeScript properties of a `SnsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelSnsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("payload", CfnAlarmModelPayloadPropertyValidator)(properties.payload));
  errors.collect(cdk.propertyValidator("targetArn", cdk.requiredValidator)(properties.targetArn));
  errors.collect(cdk.propertyValidator("targetArn", cdk.validateString)(properties.targetArn));
  return errors.wrap("supplied properties not correct for \"SnsProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelSnsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelSnsPropertyValidator(properties).assertSuccess();
  return {
    "Payload": convertCfnAlarmModelPayloadPropertyToCloudFormation(properties.payload),
    "TargetArn": cdk.stringToCloudFormation(properties.targetArn)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelSnsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAlarmModel.SnsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.SnsProperty>();
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnAlarmModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addPropertyResult("targetArn", "TargetArn", (properties.TargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelLambdaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("functionArn", cdk.requiredValidator)(properties.functionArn));
  errors.collect(cdk.propertyValidator("functionArn", cdk.validateString)(properties.functionArn));
  errors.collect(cdk.propertyValidator("payload", CfnAlarmModelPayloadPropertyValidator)(properties.payload));
  return errors.wrap("supplied properties not correct for \"LambdaProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelLambdaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelLambdaPropertyValidator(properties).assertSuccess();
  return {
    "FunctionArn": cdk.stringToCloudFormation(properties.functionArn),
    "Payload": convertCfnAlarmModelPayloadPropertyToCloudFormation(properties.payload)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelLambdaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAlarmModel.LambdaProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.LambdaProperty>();
  ret.addPropertyResult("functionArn", "FunctionArn", (properties.FunctionArn != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionArn) : undefined));
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnAlarmModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AlarmActionProperty`
 *
 * @param properties - the TypeScript properties of a `AlarmActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelAlarmActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dynamoDb", CfnAlarmModelDynamoDBPropertyValidator)(properties.dynamoDb));
  errors.collect(cdk.propertyValidator("dynamoDBv2", CfnAlarmModelDynamoDBv2PropertyValidator)(properties.dynamoDBv2));
  errors.collect(cdk.propertyValidator("firehose", CfnAlarmModelFirehosePropertyValidator)(properties.firehose));
  errors.collect(cdk.propertyValidator("iotEvents", CfnAlarmModelIotEventsPropertyValidator)(properties.iotEvents));
  errors.collect(cdk.propertyValidator("iotSiteWise", CfnAlarmModelIotSiteWisePropertyValidator)(properties.iotSiteWise));
  errors.collect(cdk.propertyValidator("iotTopicPublish", CfnAlarmModelIotTopicPublishPropertyValidator)(properties.iotTopicPublish));
  errors.collect(cdk.propertyValidator("lambda", CfnAlarmModelLambdaPropertyValidator)(properties.lambda));
  errors.collect(cdk.propertyValidator("sns", CfnAlarmModelSnsPropertyValidator)(properties.sns));
  errors.collect(cdk.propertyValidator("sqs", CfnAlarmModelSqsPropertyValidator)(properties.sqs));
  return errors.wrap("supplied properties not correct for \"AlarmActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelAlarmActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelAlarmActionPropertyValidator(properties).assertSuccess();
  return {
    "DynamoDB": convertCfnAlarmModelDynamoDBPropertyToCloudFormation(properties.dynamoDb),
    "DynamoDBv2": convertCfnAlarmModelDynamoDBv2PropertyToCloudFormation(properties.dynamoDBv2),
    "Firehose": convertCfnAlarmModelFirehosePropertyToCloudFormation(properties.firehose),
    "IotEvents": convertCfnAlarmModelIotEventsPropertyToCloudFormation(properties.iotEvents),
    "IotSiteWise": convertCfnAlarmModelIotSiteWisePropertyToCloudFormation(properties.iotSiteWise),
    "IotTopicPublish": convertCfnAlarmModelIotTopicPublishPropertyToCloudFormation(properties.iotTopicPublish),
    "Lambda": convertCfnAlarmModelLambdaPropertyToCloudFormation(properties.lambda),
    "Sns": convertCfnAlarmModelSnsPropertyToCloudFormation(properties.sns),
    "Sqs": convertCfnAlarmModelSqsPropertyToCloudFormation(properties.sqs)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelAlarmActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModel.AlarmActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.AlarmActionProperty>();
  ret.addPropertyResult("dynamoDb", "DynamoDB", (properties.DynamoDB != null ? CfnAlarmModelDynamoDBPropertyFromCloudFormation(properties.DynamoDB) : undefined));
  ret.addPropertyResult("dynamoDBv2", "DynamoDBv2", (properties.DynamoDBv2 != null ? CfnAlarmModelDynamoDBv2PropertyFromCloudFormation(properties.DynamoDBv2) : undefined));
  ret.addPropertyResult("firehose", "Firehose", (properties.Firehose != null ? CfnAlarmModelFirehosePropertyFromCloudFormation(properties.Firehose) : undefined));
  ret.addPropertyResult("iotEvents", "IotEvents", (properties.IotEvents != null ? CfnAlarmModelIotEventsPropertyFromCloudFormation(properties.IotEvents) : undefined));
  ret.addPropertyResult("iotSiteWise", "IotSiteWise", (properties.IotSiteWise != null ? CfnAlarmModelIotSiteWisePropertyFromCloudFormation(properties.IotSiteWise) : undefined));
  ret.addPropertyResult("iotTopicPublish", "IotTopicPublish", (properties.IotTopicPublish != null ? CfnAlarmModelIotTopicPublishPropertyFromCloudFormation(properties.IotTopicPublish) : undefined));
  ret.addPropertyResult("lambda", "Lambda", (properties.Lambda != null ? CfnAlarmModelLambdaPropertyFromCloudFormation(properties.Lambda) : undefined));
  ret.addPropertyResult("sns", "Sns", (properties.Sns != null ? CfnAlarmModelSnsPropertyFromCloudFormation(properties.Sns) : undefined));
  ret.addPropertyResult("sqs", "Sqs", (properties.Sqs != null ? CfnAlarmModelSqsPropertyFromCloudFormation(properties.Sqs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AlarmEventActionsProperty`
 *
 * @param properties - the TypeScript properties of a `AlarmEventActionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelAlarmEventActionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alarmActions", cdk.listValidator(CfnAlarmModelAlarmActionPropertyValidator))(properties.alarmActions));
  return errors.wrap("supplied properties not correct for \"AlarmEventActionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelAlarmEventActionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelAlarmEventActionsPropertyValidator(properties).assertSuccess();
  return {
    "AlarmActions": cdk.listMapper(convertCfnAlarmModelAlarmActionPropertyToCloudFormation)(properties.alarmActions)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelAlarmEventActionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModel.AlarmEventActionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModel.AlarmEventActionsProperty>();
  ret.addPropertyResult("alarmActions", "AlarmActions", (properties.AlarmActions != null ? cfn_parse.FromCloudFormation.getArray(CfnAlarmModelAlarmActionPropertyFromCloudFormation)(properties.AlarmActions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAlarmModelProps`
 *
 * @param properties - the TypeScript properties of a `CfnAlarmModelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmModelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alarmCapabilities", CfnAlarmModelAlarmCapabilitiesPropertyValidator)(properties.alarmCapabilities));
  errors.collect(cdk.propertyValidator("alarmEventActions", CfnAlarmModelAlarmEventActionsPropertyValidator)(properties.alarmEventActions));
  errors.collect(cdk.propertyValidator("alarmModelDescription", cdk.validateString)(properties.alarmModelDescription));
  errors.collect(cdk.propertyValidator("alarmModelName", cdk.validateString)(properties.alarmModelName));
  errors.collect(cdk.propertyValidator("alarmRule", cdk.requiredValidator)(properties.alarmRule));
  errors.collect(cdk.propertyValidator("alarmRule", CfnAlarmModelAlarmRulePropertyValidator)(properties.alarmRule));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("severity", cdk.validateNumber)(properties.severity));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAlarmModelProps\"");
}

// @ts-ignore TS6133
function convertCfnAlarmModelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmModelPropsValidator(properties).assertSuccess();
  return {
    "AlarmCapabilities": convertCfnAlarmModelAlarmCapabilitiesPropertyToCloudFormation(properties.alarmCapabilities),
    "AlarmEventActions": convertCfnAlarmModelAlarmEventActionsPropertyToCloudFormation(properties.alarmEventActions),
    "AlarmModelDescription": cdk.stringToCloudFormation(properties.alarmModelDescription),
    "AlarmModelName": cdk.stringToCloudFormation(properties.alarmModelName),
    "AlarmRule": convertCfnAlarmModelAlarmRulePropertyToCloudFormation(properties.alarmRule),
    "Key": cdk.stringToCloudFormation(properties.key),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Severity": cdk.numberToCloudFormation(properties.severity),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAlarmModelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmModelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmModelProps>();
  ret.addPropertyResult("alarmCapabilities", "AlarmCapabilities", (properties.AlarmCapabilities != null ? CfnAlarmModelAlarmCapabilitiesPropertyFromCloudFormation(properties.AlarmCapabilities) : undefined));
  ret.addPropertyResult("alarmEventActions", "AlarmEventActions", (properties.AlarmEventActions != null ? CfnAlarmModelAlarmEventActionsPropertyFromCloudFormation(properties.AlarmEventActions) : undefined));
  ret.addPropertyResult("alarmModelDescription", "AlarmModelDescription", (properties.AlarmModelDescription != null ? cfn_parse.FromCloudFormation.getString(properties.AlarmModelDescription) : undefined));
  ret.addPropertyResult("alarmModelName", "AlarmModelName", (properties.AlarmModelName != null ? cfn_parse.FromCloudFormation.getString(properties.AlarmModelName) : undefined));
  ret.addPropertyResult("alarmRule", "AlarmRule", (properties.AlarmRule != null ? CfnAlarmModelAlarmRulePropertyFromCloudFormation(properties.AlarmRule) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("severity", "Severity", (properties.Severity != null ? cfn_parse.FromCloudFormation.getNumber(properties.Severity) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::IoTEvents::DetectorModel resource creates a detector model.
 *
 * You create a *detector model* (a model of your equipment or process) using *states* . For each state, you define conditional (Boolean) logic that evaluates the incoming inputs to detect significant events. When an event is detected, it can change the state or trigger custom-built or predefined actions using other AWS services. You can define additional events that trigger actions when entering or exiting a state and, optionally, when a condition is met. For more information, see [How to Use AWS IoT Events](https://docs.aws.amazon.com/iotevents/latest/developerguide/how-to-use-iotevents.html) in the *AWS IoT Events Developer Guide* .
 *
 * > When you successfully update a detector model (using the AWS IoT Events console, AWS IoT Events API or CLI commands, or AWS CloudFormation ) all detector instances created by the model are reset to their initial states. (The detector's `state` , and the values of any variables and timers are reset.)
 * >
 * > When you successfully update a detector model (using the AWS IoT Events console, AWS IoT Events API or CLI commands, or AWS CloudFormation ) the version number of the detector model is incremented. (A detector model with version number 1 before the update has version number 2 after the update succeeds.)
 * >
 * > If you attempt to update a detector model using AWS CloudFormation and the update does not succeed, the system may, in some cases, restore the original detector model. When this occurs, the detector model's version is incremented twice (for example, from version 1 to version 3) and the detector instances are reset.
 * >
 * > Also, be aware that if you attempt to update several detector models at once using AWS CloudFormation , some updates may succeed and others fail. In this case, the effects on each detector model's detector instances and version number depend on whether the update succeeded or failed, with the results as stated.
 *
 * @cloudformationResource AWS::IoTEvents::DetectorModel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-detectormodel.html
 */
export class CfnDetectorModel extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTEvents::DetectorModel";

  /**
   * Build a CfnDetectorModel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDetectorModel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDetectorModelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDetectorModel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Information that defines how a detector operates.
   */
  public detectorModelDefinition: CfnDetectorModel.DetectorModelDefinitionProperty | cdk.IResolvable;

  /**
   * A brief description of the detector model.
   */
  public detectorModelDescription?: string;

  /**
   * The name of the detector model.
   */
  public detectorModelName?: string;

  /**
   * Information about the order in which events are evaluated and how actions are executed.
   */
  public evaluationMethod?: string;

  /**
   * The value used to identify a detector instance.
   */
  public key?: string;

  /**
   * The ARN of the role that grants permission to AWS IoT Events to perform its operations.
   */
  public roleArn: string;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnDetectorModelProps) {
    super(scope, id, {
      "type": CfnDetectorModel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "detectorModelDefinition", this);
    cdk.requireProperty(props, "roleArn", this);

    this.detectorModelDefinition = props.detectorModelDefinition;
    this.detectorModelDescription = props.detectorModelDescription;
    this.detectorModelName = props.detectorModelName;
    this.evaluationMethod = props.evaluationMethod;
    this.key = props.key;
    this.roleArn = props.roleArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTEvents::DetectorModel", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "detectorModelDefinition": this.detectorModelDefinition,
      "detectorModelDescription": this.detectorModelDescription,
      "detectorModelName": this.detectorModelName,
      "evaluationMethod": this.evaluationMethod,
      "key": this.key,
      "roleArn": this.roleArn,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDetectorModel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDetectorModelPropsToCloudFormation(props);
  }
}

export namespace CfnDetectorModel {
  /**
   * Information that defines how a detector operates.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-detectormodeldefinition.html
   */
  export interface DetectorModelDefinitionProperty {
    /**
     * The state that is entered at the creation of each detector (instance).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-detectormodeldefinition.html#cfn-iotevents-detectormodel-detectormodeldefinition-initialstatename
     */
    readonly initialStateName: string;

    /**
     * Information about the states of the detector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-detectormodeldefinition.html#cfn-iotevents-detectormodel-detectormodeldefinition-states
     */
    readonly states: Array<cdk.IResolvable | CfnDetectorModel.StateProperty> | cdk.IResolvable;
  }

  /**
   * Information that defines a state of a detector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-state.html
   */
  export interface StateProperty {
    /**
     * When entering this state, perform these `actions` if the `condition` is TRUE.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-state.html#cfn-iotevents-detectormodel-state-onenter
     */
    readonly onEnter?: cdk.IResolvable | CfnDetectorModel.OnEnterProperty;

    /**
     * When exiting this state, perform these `actions` if the specified `condition` is `TRUE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-state.html#cfn-iotevents-detectormodel-state-onexit
     */
    readonly onExit?: cdk.IResolvable | CfnDetectorModel.OnExitProperty;

    /**
     * When an input is received and the `condition` is TRUE, perform the specified `actions` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-state.html#cfn-iotevents-detectormodel-state-oninput
     */
    readonly onInput?: cdk.IResolvable | CfnDetectorModel.OnInputProperty;

    /**
     * The name of the state.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-state.html#cfn-iotevents-detectormodel-state-statename
     */
    readonly stateName: string;
  }

  /**
   * Specifies the actions performed when the `condition` evaluates to TRUE.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-oninput.html
   */
  export interface OnInputProperty {
    /**
     * Specifies the actions performed when the `condition` evaluates to TRUE.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-oninput.html#cfn-iotevents-detectormodel-oninput-events
     */
    readonly events?: Array<CfnDetectorModel.EventProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies the actions performed, and the next state entered, when a `condition` evaluates to TRUE.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-oninput.html#cfn-iotevents-detectormodel-oninput-transitionevents
     */
    readonly transitionEvents?: Array<cdk.IResolvable | CfnDetectorModel.TransitionEventProperty> | cdk.IResolvable;
  }

  /**
   * Specifies the `actions` to be performed when the `condition` evaluates to TRUE.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-event.html
   */
  export interface EventProperty {
    /**
     * The actions to be performed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-event.html#cfn-iotevents-detectormodel-event-actions
     */
    readonly actions?: Array<CfnDetectorModel.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Optional.
     *
     * The Boolean expression that, when TRUE, causes the `actions` to be performed. If not present, the actions are performed (=TRUE). If the expression result is not a Boolean value, the actions are not performed (=FALSE).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-event.html#cfn-iotevents-detectormodel-event-condition
     */
    readonly condition?: string;

    /**
     * The name of the event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-event.html#cfn-iotevents-detectormodel-event-eventname
     */
    readonly eventName: string;
  }

  /**
   * An action to be performed when the `condition` is TRUE.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-action.html
   */
  export interface ActionProperty {
    /**
     * Information needed to clear the timer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-action.html#cfn-iotevents-detectormodel-action-cleartimer
     */
    readonly clearTimer?: CfnDetectorModel.ClearTimerProperty | cdk.IResolvable;

    /**
     * Writes to the DynamoDB table that you created.
     *
     * The default action payload contains all attribute-value pairs that have the information about the detector model instance and the event that triggered the action. You can customize the [payload](https://docs.aws.amazon.com/iotevents/latest/apireference/API_Payload.html) . One column of the DynamoDB table receives all attribute-value pairs in the payload that you specify. For more information, see [Actions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-event-actions.html) in *AWS IoT Events Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-action.html#cfn-iotevents-detectormodel-action-dynamodb
     */
    readonly dynamoDb?: CfnDetectorModel.DynamoDBProperty | cdk.IResolvable;

    /**
     * Writes to the DynamoDB table that you created.
     *
     * The default action payload contains all attribute-value pairs that have the information about the detector model instance and the event that triggered the action. You can customize the [payload](https://docs.aws.amazon.com/iotevents/latest/apireference/API_Payload.html) . A separate column of the DynamoDB table receives one attribute-value pair in the payload that you specify. For more information, see [Actions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-event-actions.html) in *AWS IoT Events Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-action.html#cfn-iotevents-detectormodel-action-dynamodbv2
     */
    readonly dynamoDBv2?: CfnDetectorModel.DynamoDBv2Property | cdk.IResolvable;

    /**
     * Sends information about the detector model instance and the event that triggered the action to an Amazon Kinesis Data Firehose delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-action.html#cfn-iotevents-detectormodel-action-firehose
     */
    readonly firehose?: CfnDetectorModel.FirehoseProperty | cdk.IResolvable;

    /**
     * Sends AWS IoT Events input, which passes information about the detector model instance and the event that triggered the action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-action.html#cfn-iotevents-detectormodel-action-iotevents
     */
    readonly iotEvents?: CfnDetectorModel.IotEventsProperty | cdk.IResolvable;

    /**
     * Sends information about the detector model instance and the event that triggered the action to an asset property in AWS IoT SiteWise .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-action.html#cfn-iotevents-detectormodel-action-iotsitewise
     */
    readonly iotSiteWise?: CfnDetectorModel.IotSiteWiseProperty | cdk.IResolvable;

    /**
     * Publishes an MQTT message with the given topic to the AWS IoT message broker.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-action.html#cfn-iotevents-detectormodel-action-iottopicpublish
     */
    readonly iotTopicPublish?: CfnDetectorModel.IotTopicPublishProperty | cdk.IResolvable;

    /**
     * Calls a Lambda function, passing in information about the detector model instance and the event that triggered the action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-action.html#cfn-iotevents-detectormodel-action-lambda
     */
    readonly lambda?: cdk.IResolvable | CfnDetectorModel.LambdaProperty;

    /**
     * Information needed to reset the timer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-action.html#cfn-iotevents-detectormodel-action-resettimer
     */
    readonly resetTimer?: cdk.IResolvable | CfnDetectorModel.ResetTimerProperty;

    /**
     * Information needed to set the timer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-action.html#cfn-iotevents-detectormodel-action-settimer
     */
    readonly setTimer?: cdk.IResolvable | CfnDetectorModel.SetTimerProperty;

    /**
     * Sets a variable to a specified value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-action.html#cfn-iotevents-detectormodel-action-setvariable
     */
    readonly setVariable?: cdk.IResolvable | CfnDetectorModel.SetVariableProperty;

    /**
     * Sends an Amazon SNS message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-action.html#cfn-iotevents-detectormodel-action-sns
     */
    readonly sns?: cdk.IResolvable | CfnDetectorModel.SnsProperty;

    /**
     * Sends an Amazon SNS message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-action.html#cfn-iotevents-detectormodel-action-sqs
     */
    readonly sqs?: cdk.IResolvable | CfnDetectorModel.SqsProperty;
  }

  /**
   * Sends an AWS IoT Events input, passing in information about the detector model instance and the event that triggered the action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-iotevents.html
   */
  export interface IotEventsProperty {
    /**
     * The name of the AWS IoT Events input where the data is sent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-iotevents.html#cfn-iotevents-detectormodel-iotevents-inputname
     */
    readonly inputName: string;

    /**
     * You can configure the action payload when you send a message to an AWS IoT Events input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-iotevents.html#cfn-iotevents-detectormodel-iotevents-payload
     */
    readonly payload?: cdk.IResolvable | CfnDetectorModel.PayloadProperty;
  }

  /**
   * Information needed to configure the payload.
   *
   * By default, AWS IoT Events generates a standard payload in JSON for any action. This action payload contains all attribute-value pairs that have the information about the detector model instance and the event triggered the action. To configure the action payload, you can use `contentExpression` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-payload.html
   */
  export interface PayloadProperty {
    /**
     * The content of the payload.
     *
     * You can use a string expression that includes quoted strings ( `'<string>'` ), variables ( `$variable.<variable-name>` ), input values ( `$input.<input-name>.<path-to-datum>` ), string concatenations, and quoted strings that contain `${}` as the content. The recommended maximum size of a content expression is 1 KB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-payload.html#cfn-iotevents-detectormodel-payload-contentexpression
     */
    readonly contentExpression: string;

    /**
     * The value of the payload type can be either `STRING` or `JSON` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-payload.html#cfn-iotevents-detectormodel-payload-type
     */
    readonly type: string;
  }

  /**
   * Sends information about the detector model instance and the event that triggered the action to an Amazon Kinesis Data Firehose delivery stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-firehose.html
   */
  export interface FirehoseProperty {
    /**
     * The name of the Kinesis Data Firehose delivery stream where the data is written.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-firehose.html#cfn-iotevents-detectormodel-firehose-deliverystreamname
     */
    readonly deliveryStreamName: string;

    /**
     * You can configure the action payload when you send a message to an Amazon Kinesis Data Firehose delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-firehose.html#cfn-iotevents-detectormodel-firehose-payload
     */
    readonly payload?: cdk.IResolvable | CfnDetectorModel.PayloadProperty;

    /**
     * A character separator that is used to separate records written to the Kinesis Data Firehose delivery stream.
     *
     * Valid values are: '\n' (newline), '\t' (tab), '\r\n' (Windows newline), ',' (comma).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-firehose.html#cfn-iotevents-detectormodel-firehose-separator
     */
    readonly separator?: string;
  }

  /**
   * Defines an action to write to the Amazon DynamoDB table that you created.
   *
   * The standard action payload contains all the information about the detector model instance and the event that triggered the action. You can customize the [payload](https://docs.aws.amazon.com/iotevents/latest/apireference/API_Payload.html) . One column of the DynamoDB table receives all attribute-value pairs in the payload that you specify.
   *
   * You must use expressions for all parameters in `DynamoDBAction` . The expressions accept literals, operators, functions, references, and substitution templates.
   *
   * **Examples** - For literal values, the expressions must contain single quotes. For example, the value for the `hashKeyType` parameter can be `'STRING'` .
   * - For references, you must specify either variables or input values. For example, the value for the `hashKeyField` parameter can be `$input.GreenhouseInput.name` .
   * - For a substitution template, you must use `${}` , and the template must be in single quotes. A substitution template can also contain a combination of literals, operators, functions, references, and substitution templates.
   *
   * In the following example, the value for the `hashKeyValue` parameter uses a substitution template.
   *
   * `'${$input.GreenhouseInput.temperature * 6 / 5 + 32} in Fahrenheit'`
   * - For a string concatenation, you must use `+` . A string concatenation can also contain a combination of literals, operators, functions, references, and substitution templates.
   *
   * In the following example, the value for the `tableName` parameter uses a string concatenation.
   *
   * `'GreenhouseTemperatureTable ' + $input.GreenhouseInput.date`
   *
   * For more information, see [Expressions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html) in the *AWS IoT Events Developer Guide* .
   *
   * If the defined payload type is a string, `DynamoDBAction` writes non-JSON data to the DynamoDB table as binary data. The DynamoDB console displays the data as Base64-encoded text. The value for the `payloadField` parameter is `<payload-field>_raw` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-dynamodb.html
   */
  export interface DynamoDBProperty {
    /**
     * The name of the hash key (also called the partition key).
     *
     * The `hashKeyField` value must match the partition key of the target DynamoDB table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-dynamodb.html#cfn-iotevents-detectormodel-dynamodb-hashkeyfield
     */
    readonly hashKeyField: string;

    /**
     * The data type for the hash key (also called the partition key). You can specify the following values:.
     *
     * - `'STRING'` - The hash key is a string.
     * - `'NUMBER'` - The hash key is a number.
     *
     * If you don't specify `hashKeyType` , the default value is `'STRING'` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-dynamodb.html#cfn-iotevents-detectormodel-dynamodb-hashkeytype
     */
    readonly hashKeyType?: string;

    /**
     * The value of the hash key (also called the partition key).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-dynamodb.html#cfn-iotevents-detectormodel-dynamodb-hashkeyvalue
     */
    readonly hashKeyValue: string;

    /**
     * The type of operation to perform. You can specify the following values:.
     *
     * - `'INSERT'` - Insert data as a new item into the DynamoDB table. This item uses the specified hash key as a partition key. If you specified a range key, the item uses the range key as a sort key.
     * - `'UPDATE'` - Update an existing item of the DynamoDB table with new data. This item's partition key must match the specified hash key. If you specified a range key, the range key must match the item's sort key.
     * - `'DELETE'` - Delete an existing item of the DynamoDB table. This item's partition key must match the specified hash key. If you specified a range key, the range key must match the item's sort key.
     *
     * If you don't specify this parameter, AWS IoT Events triggers the `'INSERT'` operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-dynamodb.html#cfn-iotevents-detectormodel-dynamodb-operation
     */
    readonly operation?: string;

    /**
     * Information needed to configure the payload.
     *
     * By default, AWS IoT Events generates a standard payload in JSON for any action. This action payload contains all attribute-value pairs that have the information about the detector model instance and the event triggered the action. To configure the action payload, you can use `contentExpression` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-dynamodb.html#cfn-iotevents-detectormodel-dynamodb-payload
     */
    readonly payload?: cdk.IResolvable | CfnDetectorModel.PayloadProperty;

    /**
     * The name of the DynamoDB column that receives the action payload.
     *
     * If you don't specify this parameter, the name of the DynamoDB column is `payload` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-dynamodb.html#cfn-iotevents-detectormodel-dynamodb-payloadfield
     */
    readonly payloadField?: string;

    /**
     * The name of the range key (also called the sort key).
     *
     * The `rangeKeyField` value must match the sort key of the target DynamoDB table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-dynamodb.html#cfn-iotevents-detectormodel-dynamodb-rangekeyfield
     */
    readonly rangeKeyField?: string;

    /**
     * The data type for the range key (also called the sort key), You can specify the following values:.
     *
     * - `'STRING'` - The range key is a string.
     * - `'NUMBER'` - The range key is number.
     *
     * If you don't specify `rangeKeyField` , the default value is `'STRING'` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-dynamodb.html#cfn-iotevents-detectormodel-dynamodb-rangekeytype
     */
    readonly rangeKeyType?: string;

    /**
     * The value of the range key (also called the sort key).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-dynamodb.html#cfn-iotevents-detectormodel-dynamodb-rangekeyvalue
     */
    readonly rangeKeyValue?: string;

    /**
     * The name of the DynamoDB table.
     *
     * The `tableName` value must match the table name of the target DynamoDB table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-dynamodb.html#cfn-iotevents-detectormodel-dynamodb-tablename
     */
    readonly tableName: string;
  }

  /**
   * Information required to publish the MQTT message through the AWS IoT message broker.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-iottopicpublish.html
   */
  export interface IotTopicPublishProperty {
    /**
     * The MQTT topic of the message.
     *
     * You can use a string expression that includes variables ( `$variable.<variable-name>` ) and input values ( `$input.<input-name>.<path-to-datum>` ) as the topic string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-iottopicpublish.html#cfn-iotevents-detectormodel-iottopicpublish-mqtttopic
     */
    readonly mqttTopic: string;

    /**
     * You can configure the action payload when you publish a message to an AWS IoT Core topic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-iottopicpublish.html#cfn-iotevents-detectormodel-iottopicpublish-payload
     */
    readonly payload?: cdk.IResolvable | CfnDetectorModel.PayloadProperty;
  }

  /**
   * Defines an action to write to the Amazon DynamoDB table that you created.
   *
   * The default action payload contains all the information about the detector model instance and the event that triggered the action. You can customize the [payload](https://docs.aws.amazon.com/iotevents/latest/apireference/API_Payload.html) . A separate column of the DynamoDB table receives one attribute-value pair in the payload that you specify.
   *
   * You must use expressions for all parameters in `DynamoDBv2Action` . The expressions accept literals, operators, functions, references, and substitution templates.
   *
   * **Examples** - For literal values, the expressions must contain single quotes. For example, the value for the `tableName` parameter can be `'GreenhouseTemperatureTable'` .
   * - For references, you must specify either variables or input values. For example, the value for the `tableName` parameter can be `$variable.ddbtableName` .
   * - For a substitution template, you must use `${}` , and the template must be in single quotes. A substitution template can also contain a combination of literals, operators, functions, references, and substitution templates.
   *
   * In the following example, the value for the `contentExpression` parameter in `Payload` uses a substitution template.
   *
   * `'{\"sensorID\": \"${$input.GreenhouseInput.sensor_id}\", \"temperature\": \"${$input.GreenhouseInput.temperature * 9 / 5 + 32}\"}'`
   * - For a string concatenation, you must use `+` . A string concatenation can also contain a combination of literals, operators, functions, references, and substitution templates.
   *
   * In the following example, the value for the `tableName` parameter uses a string concatenation.
   *
   * `'GreenhouseTemperatureTable ' + $input.GreenhouseInput.date`
   *
   * For more information, see [Expressions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html) in the *AWS IoT Events Developer Guide* .
   *
   * The value for the `type` parameter in `Payload` must be `JSON` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-dynamodbv2.html
   */
  export interface DynamoDBv2Property {
    /**
     * Information needed to configure the payload.
     *
     * By default, AWS IoT Events generates a standard payload in JSON for any action. This action payload contains all attribute-value pairs that have the information about the detector model instance and the event triggered the action. To configure the action payload, you can use `contentExpression` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-dynamodbv2.html#cfn-iotevents-detectormodel-dynamodbv2-payload
     */
    readonly payload?: cdk.IResolvable | CfnDetectorModel.PayloadProperty;

    /**
     * The name of the DynamoDB table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-dynamodbv2.html#cfn-iotevents-detectormodel-dynamodbv2-tablename
     */
    readonly tableName: string;
  }

  /**
   * Sends information about the detector model instance and the event that triggered the action to a specified asset property in AWS IoT SiteWise .
   *
   * You must use expressions for all parameters in `IotSiteWiseAction` . The expressions accept literals, operators, functions, references, and substitutions templates.
   *
   * **Examples** - For literal values, the expressions must contain single quotes. For example, the value for the `propertyAlias` parameter can be `'/company/windfarm/3/turbine/7/temperature'` .
   * - For references, you must specify either variables or input values. For example, the value for the `assetId` parameter can be `$input.TurbineInput.assetId1` .
   * - For a substitution template, you must use `${}` , and the template must be in single quotes. A substitution template can also contain a combination of literals, operators, functions, references, and substitution templates.
   *
   * In the following example, the value for the `propertyAlias` parameter uses a substitution template.
   *
   * `'company/windfarm/${$input.TemperatureInput.sensorData.windfarmID}/turbine/ ${$input.TemperatureInput.sensorData.turbineID}/temperature'`
   *
   * You must specify either `propertyAlias` or both `assetId` and `propertyId` to identify the target asset property in AWS IoT SiteWise .
   *
   * For more information, see [Expressions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html) in the *AWS IoT Events Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-iotsitewise.html
   */
  export interface IotSiteWiseProperty {
    /**
     * The ID of the asset that has the specified property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-iotsitewise.html#cfn-iotevents-detectormodel-iotsitewise-assetid
     */
    readonly assetId?: string;

    /**
     * A unique identifier for this entry.
     *
     * You can use the entry ID to track which data entry causes an error in case of failure. The default is a new unique identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-iotsitewise.html#cfn-iotevents-detectormodel-iotsitewise-entryid
     */
    readonly entryId?: string;

    /**
     * The alias of the asset property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-iotsitewise.html#cfn-iotevents-detectormodel-iotsitewise-propertyalias
     */
    readonly propertyAlias?: string;

    /**
     * The ID of the asset property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-iotsitewise.html#cfn-iotevents-detectormodel-iotsitewise-propertyid
     */
    readonly propertyId?: string;

    /**
     * The value to send to the asset property.
     *
     * This value contains timestamp, quality, and value (TQV) information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-iotsitewise.html#cfn-iotevents-detectormodel-iotsitewise-propertyvalue
     */
    readonly propertyValue: CfnDetectorModel.AssetPropertyValueProperty | cdk.IResolvable;
  }

  /**
   * A structure that contains value information. For more information, see [AssetPropertyValue](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_AssetPropertyValue.html) in the *AWS IoT SiteWise API Reference* .
   *
   * You must use expressions for all parameters in `AssetPropertyValue` . The expressions accept literals, operators, functions, references, and substitution templates.
   *
   * **Examples** - For literal values, the expressions must contain single quotes. For example, the value for the `quality` parameter can be `'GOOD'` .
   * - For references, you must specify either variables or input values. For example, the value for the `quality` parameter can be `$input.TemperatureInput.sensorData.quality` .
   *
   * For more information, see [Expressions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html) in the *AWS IoT Events Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-assetpropertyvalue.html
   */
  export interface AssetPropertyValueProperty {
    /**
     * The quality of the asset property value.
     *
     * The value must be `'GOOD'` , `'BAD'` , or `'UNCERTAIN'` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-assetpropertyvalue.html#cfn-iotevents-detectormodel-assetpropertyvalue-quality
     */
    readonly quality?: string;

    /**
     * The timestamp associated with the asset property value.
     *
     * The default is the current event time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-assetpropertyvalue.html#cfn-iotevents-detectormodel-assetpropertyvalue-timestamp
     */
    readonly timestamp?: CfnDetectorModel.AssetPropertyTimestampProperty | cdk.IResolvable;

    /**
     * The value to send to an asset property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-assetpropertyvalue.html#cfn-iotevents-detectormodel-assetpropertyvalue-value
     */
    readonly value: CfnDetectorModel.AssetPropertyVariantProperty | cdk.IResolvable;
  }

  /**
   * A structure that contains an asset property value.
   *
   * For more information, see [Variant](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_Variant.html) in the *AWS IoT SiteWise API Reference* .
   *
   * You must use expressions for all parameters in `AssetPropertyVariant` . The expressions accept literals, operators, functions, references, and substitution templates.
   *
   * **Examples** - For literal values, the expressions must contain single quotes. For example, the value for the `integerValue` parameter can be `'100'` .
   * - For references, you must specify either variables or parameters. For example, the value for the `booleanValue` parameter can be `$variable.offline` .
   * - For a substitution template, you must use `${}` , and the template must be in single quotes. A substitution template can also contain a combination of literals, operators, functions, references, and substitution templates.
   *
   * In the following example, the value for the `doubleValue` parameter uses a substitution template.
   *
   * `'${$input.TemperatureInput.sensorData.temperature * 6 / 5 + 32}'`
   *
   * For more information, see [Expressions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html) in the *AWS IoT Events Developer Guide* .
   *
   * You must specify one of the following value types, depending on the `dataType` of the specified asset property. For more information, see [AssetProperty](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_AssetProperty.html) in the *AWS IoT SiteWise API Reference* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-assetpropertyvariant.html
   */
  export interface AssetPropertyVariantProperty {
    /**
     * The asset property value is a Boolean value that must be `'TRUE'` or `'FALSE'` .
     *
     * You must use an expression, and the evaluated result should be a Boolean value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-assetpropertyvariant.html#cfn-iotevents-detectormodel-assetpropertyvariant-booleanvalue
     */
    readonly booleanValue?: string;

    /**
     * The asset property value is a double.
     *
     * You must use an expression, and the evaluated result should be a double.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-assetpropertyvariant.html#cfn-iotevents-detectormodel-assetpropertyvariant-doublevalue
     */
    readonly doubleValue?: string;

    /**
     * The asset property value is an integer.
     *
     * You must use an expression, and the evaluated result should be an integer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-assetpropertyvariant.html#cfn-iotevents-detectormodel-assetpropertyvariant-integervalue
     */
    readonly integerValue?: string;

    /**
     * The asset property value is a string.
     *
     * You must use an expression, and the evaluated result should be a string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-assetpropertyvariant.html#cfn-iotevents-detectormodel-assetpropertyvariant-stringvalue
     */
    readonly stringValue?: string;
  }

  /**
   * A structure that contains timestamp information. For more information, see [TimeInNanos](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_TimeInNanos.html) in the *AWS IoT SiteWise API Reference* .
   *
   * You must use expressions for all parameters in `AssetPropertyTimestamp` . The expressions accept literals, operators, functions, references, and substitution templates.
   *
   * **Examples** - For literal values, the expressions must contain single quotes. For example, the value for the `timeInSeconds` parameter can be `'1586400675'` .
   * - For references, you must specify either variables or input values. For example, the value for the `offsetInNanos` parameter can be `$variable.time` .
   * - For a substitution template, you must use `${}` , and the template must be in single quotes. A substitution template can also contain a combination of literals, operators, functions, references, and substitution templates.
   *
   * In the following example, the value for the `timeInSeconds` parameter uses a substitution template.
   *
   * `'${$input.TemperatureInput.sensorData.timestamp / 1000}'`
   *
   * For more information, see [Expressions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html) in the *AWS IoT Events Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-assetpropertytimestamp.html
   */
  export interface AssetPropertyTimestampProperty {
    /**
     * The nanosecond offset converted from `timeInSeconds` .
     *
     * The valid range is between 0-999999999.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-assetpropertytimestamp.html#cfn-iotevents-detectormodel-assetpropertytimestamp-offsetinnanos
     */
    readonly offsetInNanos?: string;

    /**
     * The timestamp, in seconds, in the Unix epoch format.
     *
     * The valid range is between 1-31556889864403199.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-assetpropertytimestamp.html#cfn-iotevents-detectormodel-assetpropertytimestamp-timeinseconds
     */
    readonly timeInSeconds: string;
  }

  /**
   * Information required to reset the timer.
   *
   * The timer is reset to the previously evaluated result of the duration. The duration expression isn't reevaluated when you reset the timer.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-resettimer.html
   */
  export interface ResetTimerProperty {
    /**
     * The name of the timer to reset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-resettimer.html#cfn-iotevents-detectormodel-resettimer-timername
     */
    readonly timerName: string;
  }

  /**
   * Sends information about the detector model instance and the event that triggered the action to an Amazon SQS queue.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-sqs.html
   */
  export interface SqsProperty {
    /**
     * You can configure the action payload when you send a message to an Amazon SQS queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-sqs.html#cfn-iotevents-detectormodel-sqs-payload
     */
    readonly payload?: cdk.IResolvable | CfnDetectorModel.PayloadProperty;

    /**
     * The URL of the SQS queue where the data is written.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-sqs.html#cfn-iotevents-detectormodel-sqs-queueurl
     */
    readonly queueUrl: string;

    /**
     * Set this to TRUE if you want the data to be base-64 encoded before it is written to the queue.
     *
     * Otherwise, set this to FALSE.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-sqs.html#cfn-iotevents-detectormodel-sqs-usebase64
     */
    readonly useBase64?: boolean | cdk.IResolvable;
  }

  /**
   * Information needed to set the timer.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-settimer.html
   */
  export interface SetTimerProperty {
    /**
     * The duration of the timer, in seconds.
     *
     * You can use a string expression that includes numbers, variables ( `$variable.<variable-name>` ), and input values ( `$input.<input-name>.<path-to-datum>` ) as the duration. The range of the duration is 1-31622400 seconds. To ensure accuracy, the minimum duration is 60 seconds. The evaluated result of the duration is rounded down to the nearest whole number.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-settimer.html#cfn-iotevents-detectormodel-settimer-durationexpression
     */
    readonly durationExpression?: string;

    /**
     * The number of seconds until the timer expires.
     *
     * The minimum value is 60 seconds to ensure accuracy. The maximum value is 31622400 seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-settimer.html#cfn-iotevents-detectormodel-settimer-seconds
     */
    readonly seconds?: number;

    /**
     * The name of the timer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-settimer.html#cfn-iotevents-detectormodel-settimer-timername
     */
    readonly timerName: string;
  }

  /**
   * Information required to publish the Amazon SNS message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-sns.html
   */
  export interface SnsProperty {
    /**
     * You can configure the action payload when you send a message as an Amazon SNS push notification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-sns.html#cfn-iotevents-detectormodel-sns-payload
     */
    readonly payload?: cdk.IResolvable | CfnDetectorModel.PayloadProperty;

    /**
     * The ARN of the Amazon SNS target where the message is sent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-sns.html#cfn-iotevents-detectormodel-sns-targetarn
     */
    readonly targetArn: string;
  }

  /**
   * Information needed to clear the timer.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-cleartimer.html
   */
  export interface ClearTimerProperty {
    /**
     * The name of the timer to clear.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-cleartimer.html#cfn-iotevents-detectormodel-cleartimer-timername
     */
    readonly timerName: string;
  }

  /**
   * Calls a Lambda function, passing in information about the detector model instance and the event that triggered the action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-lambda.html
   */
  export interface LambdaProperty {
    /**
     * The ARN of the Lambda function that is executed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-lambda.html#cfn-iotevents-detectormodel-lambda-functionarn
     */
    readonly functionArn: string;

    /**
     * You can configure the action payload when you send a message to a Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-lambda.html#cfn-iotevents-detectormodel-lambda-payload
     */
    readonly payload?: cdk.IResolvable | CfnDetectorModel.PayloadProperty;
  }

  /**
   * Information about the variable and its new value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-setvariable.html
   */
  export interface SetVariableProperty {
    /**
     * The new value of the variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-setvariable.html#cfn-iotevents-detectormodel-setvariable-value
     */
    readonly value: string;

    /**
     * The name of the variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-setvariable.html#cfn-iotevents-detectormodel-setvariable-variablename
     */
    readonly variableName: string;
  }

  /**
   * Specifies the actions performed and the next state entered when a `condition` evaluates to TRUE.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-transitionevent.html
   */
  export interface TransitionEventProperty {
    /**
     * The actions to be performed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-transitionevent.html#cfn-iotevents-detectormodel-transitionevent-actions
     */
    readonly actions?: Array<CfnDetectorModel.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Required.
     *
     * A Boolean expression that when TRUE causes the actions to be performed and the `nextState` to be entered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-transitionevent.html#cfn-iotevents-detectormodel-transitionevent-condition
     */
    readonly condition: string;

    /**
     * The name of the transition event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-transitionevent.html#cfn-iotevents-detectormodel-transitionevent-eventname
     */
    readonly eventName: string;

    /**
     * The next state to enter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-transitionevent.html#cfn-iotevents-detectormodel-transitionevent-nextstate
     */
    readonly nextState: string;
  }

  /**
   * When exiting this state, perform these `actions` if the specified `condition` is `TRUE` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-onexit.html
   */
  export interface OnExitProperty {
    /**
     * Specifies the `actions` that are performed when the state is exited and the `condition` is `TRUE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-onexit.html#cfn-iotevents-detectormodel-onexit-events
     */
    readonly events?: Array<CfnDetectorModel.EventProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * When entering this state, perform these `actions` if the `condition` is TRUE.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-onenter.html
   */
  export interface OnEnterProperty {
    /**
     * Specifies the actions that are performed when the state is entered and the `condition` is `TRUE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-detectormodel-onenter.html#cfn-iotevents-detectormodel-onenter-events
     */
    readonly events?: Array<CfnDetectorModel.EventProperty | cdk.IResolvable> | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnDetectorModel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-detectormodel.html
 */
export interface CfnDetectorModelProps {
  /**
   * Information that defines how a detector operates.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-detectormodel.html#cfn-iotevents-detectormodel-detectormodeldefinition
   */
  readonly detectorModelDefinition: CfnDetectorModel.DetectorModelDefinitionProperty | cdk.IResolvable;

  /**
   * A brief description of the detector model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-detectormodel.html#cfn-iotevents-detectormodel-detectormodeldescription
   */
  readonly detectorModelDescription?: string;

  /**
   * The name of the detector model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-detectormodel.html#cfn-iotevents-detectormodel-detectormodelname
   */
  readonly detectorModelName?: string;

  /**
   * Information about the order in which events are evaluated and how actions are executed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-detectormodel.html#cfn-iotevents-detectormodel-evaluationmethod
   */
  readonly evaluationMethod?: string;

  /**
   * The value used to identify a detector instance.
   *
   * When a device or system sends input, a new detector instance with a unique key value is created. AWS IoT Events can continue to route input to its corresponding detector instance based on this identifying information.
   *
   * This parameter uses a JSON-path expression to select the attribute-value pair in the message payload that is used for identification. To route the message to the correct detector instance, the device must send a message payload that contains the same attribute-value.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-detectormodel.html#cfn-iotevents-detectormodel-key
   */
  readonly key?: string;

  /**
   * The ARN of the role that grants permission to AWS IoT Events to perform its operations.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-detectormodel.html#cfn-iotevents-detectormodel-rolearn
   */
  readonly roleArn: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-detectormodel.html#cfn-iotevents-detectormodel-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `PayloadProperty`
 *
 * @param properties - the TypeScript properties of a `PayloadProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelPayloadPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contentExpression", cdk.requiredValidator)(properties.contentExpression));
  errors.collect(cdk.propertyValidator("contentExpression", cdk.validateString)(properties.contentExpression));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"PayloadProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelPayloadPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelPayloadPropertyValidator(properties).assertSuccess();
  return {
    "ContentExpression": cdk.stringToCloudFormation(properties.contentExpression),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelPayloadPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDetectorModel.PayloadProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.PayloadProperty>();
  ret.addPropertyResult("contentExpression", "ContentExpression", (properties.ContentExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ContentExpression) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IotEventsProperty`
 *
 * @param properties - the TypeScript properties of a `IotEventsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelIotEventsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("inputName", cdk.requiredValidator)(properties.inputName));
  errors.collect(cdk.propertyValidator("inputName", cdk.validateString)(properties.inputName));
  errors.collect(cdk.propertyValidator("payload", CfnDetectorModelPayloadPropertyValidator)(properties.payload));
  return errors.wrap("supplied properties not correct for \"IotEventsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelIotEventsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelIotEventsPropertyValidator(properties).assertSuccess();
  return {
    "InputName": cdk.stringToCloudFormation(properties.inputName),
    "Payload": convertCfnDetectorModelPayloadPropertyToCloudFormation(properties.payload)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelIotEventsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorModel.IotEventsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.IotEventsProperty>();
  ret.addPropertyResult("inputName", "InputName", (properties.InputName != null ? cfn_parse.FromCloudFormation.getString(properties.InputName) : undefined));
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnDetectorModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FirehoseProperty`
 *
 * @param properties - the TypeScript properties of a `FirehoseProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelFirehosePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deliveryStreamName", cdk.requiredValidator)(properties.deliveryStreamName));
  errors.collect(cdk.propertyValidator("deliveryStreamName", cdk.validateString)(properties.deliveryStreamName));
  errors.collect(cdk.propertyValidator("payload", CfnDetectorModelPayloadPropertyValidator)(properties.payload));
  errors.collect(cdk.propertyValidator("separator", cdk.validateString)(properties.separator));
  return errors.wrap("supplied properties not correct for \"FirehoseProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelFirehosePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelFirehosePropertyValidator(properties).assertSuccess();
  return {
    "DeliveryStreamName": cdk.stringToCloudFormation(properties.deliveryStreamName),
    "Payload": convertCfnDetectorModelPayloadPropertyToCloudFormation(properties.payload),
    "Separator": cdk.stringToCloudFormation(properties.separator)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelFirehosePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorModel.FirehoseProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.FirehoseProperty>();
  ret.addPropertyResult("deliveryStreamName", "DeliveryStreamName", (properties.DeliveryStreamName != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryStreamName) : undefined));
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnDetectorModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addPropertyResult("separator", "Separator", (properties.Separator != null ? cfn_parse.FromCloudFormation.getString(properties.Separator) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DynamoDBProperty`
 *
 * @param properties - the TypeScript properties of a `DynamoDBProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelDynamoDBPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hashKeyField", cdk.requiredValidator)(properties.hashKeyField));
  errors.collect(cdk.propertyValidator("hashKeyField", cdk.validateString)(properties.hashKeyField));
  errors.collect(cdk.propertyValidator("hashKeyType", cdk.validateString)(properties.hashKeyType));
  errors.collect(cdk.propertyValidator("hashKeyValue", cdk.requiredValidator)(properties.hashKeyValue));
  errors.collect(cdk.propertyValidator("hashKeyValue", cdk.validateString)(properties.hashKeyValue));
  errors.collect(cdk.propertyValidator("operation", cdk.validateString)(properties.operation));
  errors.collect(cdk.propertyValidator("payload", CfnDetectorModelPayloadPropertyValidator)(properties.payload));
  errors.collect(cdk.propertyValidator("payloadField", cdk.validateString)(properties.payloadField));
  errors.collect(cdk.propertyValidator("rangeKeyField", cdk.validateString)(properties.rangeKeyField));
  errors.collect(cdk.propertyValidator("rangeKeyType", cdk.validateString)(properties.rangeKeyType));
  errors.collect(cdk.propertyValidator("rangeKeyValue", cdk.validateString)(properties.rangeKeyValue));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"DynamoDBProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelDynamoDBPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelDynamoDBPropertyValidator(properties).assertSuccess();
  return {
    "HashKeyField": cdk.stringToCloudFormation(properties.hashKeyField),
    "HashKeyType": cdk.stringToCloudFormation(properties.hashKeyType),
    "HashKeyValue": cdk.stringToCloudFormation(properties.hashKeyValue),
    "Operation": cdk.stringToCloudFormation(properties.operation),
    "Payload": convertCfnDetectorModelPayloadPropertyToCloudFormation(properties.payload),
    "PayloadField": cdk.stringToCloudFormation(properties.payloadField),
    "RangeKeyField": cdk.stringToCloudFormation(properties.rangeKeyField),
    "RangeKeyType": cdk.stringToCloudFormation(properties.rangeKeyType),
    "RangeKeyValue": cdk.stringToCloudFormation(properties.rangeKeyValue),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelDynamoDBPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorModel.DynamoDBProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.DynamoDBProperty>();
  ret.addPropertyResult("hashKeyField", "HashKeyField", (properties.HashKeyField != null ? cfn_parse.FromCloudFormation.getString(properties.HashKeyField) : undefined));
  ret.addPropertyResult("hashKeyType", "HashKeyType", (properties.HashKeyType != null ? cfn_parse.FromCloudFormation.getString(properties.HashKeyType) : undefined));
  ret.addPropertyResult("hashKeyValue", "HashKeyValue", (properties.HashKeyValue != null ? cfn_parse.FromCloudFormation.getString(properties.HashKeyValue) : undefined));
  ret.addPropertyResult("operation", "Operation", (properties.Operation != null ? cfn_parse.FromCloudFormation.getString(properties.Operation) : undefined));
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnDetectorModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addPropertyResult("payloadField", "PayloadField", (properties.PayloadField != null ? cfn_parse.FromCloudFormation.getString(properties.PayloadField) : undefined));
  ret.addPropertyResult("rangeKeyField", "RangeKeyField", (properties.RangeKeyField != null ? cfn_parse.FromCloudFormation.getString(properties.RangeKeyField) : undefined));
  ret.addPropertyResult("rangeKeyType", "RangeKeyType", (properties.RangeKeyType != null ? cfn_parse.FromCloudFormation.getString(properties.RangeKeyType) : undefined));
  ret.addPropertyResult("rangeKeyValue", "RangeKeyValue", (properties.RangeKeyValue != null ? cfn_parse.FromCloudFormation.getString(properties.RangeKeyValue) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IotTopicPublishProperty`
 *
 * @param properties - the TypeScript properties of a `IotTopicPublishProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelIotTopicPublishPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mqttTopic", cdk.requiredValidator)(properties.mqttTopic));
  errors.collect(cdk.propertyValidator("mqttTopic", cdk.validateString)(properties.mqttTopic));
  errors.collect(cdk.propertyValidator("payload", CfnDetectorModelPayloadPropertyValidator)(properties.payload));
  return errors.wrap("supplied properties not correct for \"IotTopicPublishProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelIotTopicPublishPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelIotTopicPublishPropertyValidator(properties).assertSuccess();
  return {
    "MqttTopic": cdk.stringToCloudFormation(properties.mqttTopic),
    "Payload": convertCfnDetectorModelPayloadPropertyToCloudFormation(properties.payload)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelIotTopicPublishPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorModel.IotTopicPublishProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.IotTopicPublishProperty>();
  ret.addPropertyResult("mqttTopic", "MqttTopic", (properties.MqttTopic != null ? cfn_parse.FromCloudFormation.getString(properties.MqttTopic) : undefined));
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnDetectorModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DynamoDBv2Property`
 *
 * @param properties - the TypeScript properties of a `DynamoDBv2Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelDynamoDBv2PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("payload", CfnDetectorModelPayloadPropertyValidator)(properties.payload));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"DynamoDBv2Property\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelDynamoDBv2PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelDynamoDBv2PropertyValidator(properties).assertSuccess();
  return {
    "Payload": convertCfnDetectorModelPayloadPropertyToCloudFormation(properties.payload),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelDynamoDBv2PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorModel.DynamoDBv2Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.DynamoDBv2Property>();
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnDetectorModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AssetPropertyVariantProperty`
 *
 * @param properties - the TypeScript properties of a `AssetPropertyVariantProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelAssetPropertyVariantPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("booleanValue", cdk.validateString)(properties.booleanValue));
  errors.collect(cdk.propertyValidator("doubleValue", cdk.validateString)(properties.doubleValue));
  errors.collect(cdk.propertyValidator("integerValue", cdk.validateString)(properties.integerValue));
  errors.collect(cdk.propertyValidator("stringValue", cdk.validateString)(properties.stringValue));
  return errors.wrap("supplied properties not correct for \"AssetPropertyVariantProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelAssetPropertyVariantPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelAssetPropertyVariantPropertyValidator(properties).assertSuccess();
  return {
    "BooleanValue": cdk.stringToCloudFormation(properties.booleanValue),
    "DoubleValue": cdk.stringToCloudFormation(properties.doubleValue),
    "IntegerValue": cdk.stringToCloudFormation(properties.integerValue),
    "StringValue": cdk.stringToCloudFormation(properties.stringValue)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelAssetPropertyVariantPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorModel.AssetPropertyVariantProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.AssetPropertyVariantProperty>();
  ret.addPropertyResult("booleanValue", "BooleanValue", (properties.BooleanValue != null ? cfn_parse.FromCloudFormation.getString(properties.BooleanValue) : undefined));
  ret.addPropertyResult("doubleValue", "DoubleValue", (properties.DoubleValue != null ? cfn_parse.FromCloudFormation.getString(properties.DoubleValue) : undefined));
  ret.addPropertyResult("integerValue", "IntegerValue", (properties.IntegerValue != null ? cfn_parse.FromCloudFormation.getString(properties.IntegerValue) : undefined));
  ret.addPropertyResult("stringValue", "StringValue", (properties.StringValue != null ? cfn_parse.FromCloudFormation.getString(properties.StringValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AssetPropertyTimestampProperty`
 *
 * @param properties - the TypeScript properties of a `AssetPropertyTimestampProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelAssetPropertyTimestampPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("offsetInNanos", cdk.validateString)(properties.offsetInNanos));
  errors.collect(cdk.propertyValidator("timeInSeconds", cdk.requiredValidator)(properties.timeInSeconds));
  errors.collect(cdk.propertyValidator("timeInSeconds", cdk.validateString)(properties.timeInSeconds));
  return errors.wrap("supplied properties not correct for \"AssetPropertyTimestampProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelAssetPropertyTimestampPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelAssetPropertyTimestampPropertyValidator(properties).assertSuccess();
  return {
    "OffsetInNanos": cdk.stringToCloudFormation(properties.offsetInNanos),
    "TimeInSeconds": cdk.stringToCloudFormation(properties.timeInSeconds)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelAssetPropertyTimestampPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorModel.AssetPropertyTimestampProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.AssetPropertyTimestampProperty>();
  ret.addPropertyResult("offsetInNanos", "OffsetInNanos", (properties.OffsetInNanos != null ? cfn_parse.FromCloudFormation.getString(properties.OffsetInNanos) : undefined));
  ret.addPropertyResult("timeInSeconds", "TimeInSeconds", (properties.TimeInSeconds != null ? cfn_parse.FromCloudFormation.getString(properties.TimeInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AssetPropertyValueProperty`
 *
 * @param properties - the TypeScript properties of a `AssetPropertyValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelAssetPropertyValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("quality", cdk.validateString)(properties.quality));
  errors.collect(cdk.propertyValidator("timestamp", CfnDetectorModelAssetPropertyTimestampPropertyValidator)(properties.timestamp));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", CfnDetectorModelAssetPropertyVariantPropertyValidator)(properties.value));
  return errors.wrap("supplied properties not correct for \"AssetPropertyValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelAssetPropertyValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelAssetPropertyValuePropertyValidator(properties).assertSuccess();
  return {
    "Quality": cdk.stringToCloudFormation(properties.quality),
    "Timestamp": convertCfnDetectorModelAssetPropertyTimestampPropertyToCloudFormation(properties.timestamp),
    "Value": convertCfnDetectorModelAssetPropertyVariantPropertyToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelAssetPropertyValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorModel.AssetPropertyValueProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.AssetPropertyValueProperty>();
  ret.addPropertyResult("quality", "Quality", (properties.Quality != null ? cfn_parse.FromCloudFormation.getString(properties.Quality) : undefined));
  ret.addPropertyResult("timestamp", "Timestamp", (properties.Timestamp != null ? CfnDetectorModelAssetPropertyTimestampPropertyFromCloudFormation(properties.Timestamp) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? CfnDetectorModelAssetPropertyVariantPropertyFromCloudFormation(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IotSiteWiseProperty`
 *
 * @param properties - the TypeScript properties of a `IotSiteWiseProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelIotSiteWisePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assetId", cdk.validateString)(properties.assetId));
  errors.collect(cdk.propertyValidator("entryId", cdk.validateString)(properties.entryId));
  errors.collect(cdk.propertyValidator("propertyAlias", cdk.validateString)(properties.propertyAlias));
  errors.collect(cdk.propertyValidator("propertyId", cdk.validateString)(properties.propertyId));
  errors.collect(cdk.propertyValidator("propertyValue", cdk.requiredValidator)(properties.propertyValue));
  errors.collect(cdk.propertyValidator("propertyValue", CfnDetectorModelAssetPropertyValuePropertyValidator)(properties.propertyValue));
  return errors.wrap("supplied properties not correct for \"IotSiteWiseProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelIotSiteWisePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelIotSiteWisePropertyValidator(properties).assertSuccess();
  return {
    "AssetId": cdk.stringToCloudFormation(properties.assetId),
    "EntryId": cdk.stringToCloudFormation(properties.entryId),
    "PropertyAlias": cdk.stringToCloudFormation(properties.propertyAlias),
    "PropertyId": cdk.stringToCloudFormation(properties.propertyId),
    "PropertyValue": convertCfnDetectorModelAssetPropertyValuePropertyToCloudFormation(properties.propertyValue)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelIotSiteWisePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorModel.IotSiteWiseProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.IotSiteWiseProperty>();
  ret.addPropertyResult("assetId", "AssetId", (properties.AssetId != null ? cfn_parse.FromCloudFormation.getString(properties.AssetId) : undefined));
  ret.addPropertyResult("entryId", "EntryId", (properties.EntryId != null ? cfn_parse.FromCloudFormation.getString(properties.EntryId) : undefined));
  ret.addPropertyResult("propertyAlias", "PropertyAlias", (properties.PropertyAlias != null ? cfn_parse.FromCloudFormation.getString(properties.PropertyAlias) : undefined));
  ret.addPropertyResult("propertyId", "PropertyId", (properties.PropertyId != null ? cfn_parse.FromCloudFormation.getString(properties.PropertyId) : undefined));
  ret.addPropertyResult("propertyValue", "PropertyValue", (properties.PropertyValue != null ? CfnDetectorModelAssetPropertyValuePropertyFromCloudFormation(properties.PropertyValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResetTimerProperty`
 *
 * @param properties - the TypeScript properties of a `ResetTimerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelResetTimerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("timerName", cdk.requiredValidator)(properties.timerName));
  errors.collect(cdk.propertyValidator("timerName", cdk.validateString)(properties.timerName));
  return errors.wrap("supplied properties not correct for \"ResetTimerProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelResetTimerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelResetTimerPropertyValidator(properties).assertSuccess();
  return {
    "TimerName": cdk.stringToCloudFormation(properties.timerName)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelResetTimerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDetectorModel.ResetTimerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.ResetTimerProperty>();
  ret.addPropertyResult("timerName", "TimerName", (properties.TimerName != null ? cfn_parse.FromCloudFormation.getString(properties.TimerName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SqsProperty`
 *
 * @param properties - the TypeScript properties of a `SqsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelSqsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("payload", CfnDetectorModelPayloadPropertyValidator)(properties.payload));
  errors.collect(cdk.propertyValidator("queueUrl", cdk.requiredValidator)(properties.queueUrl));
  errors.collect(cdk.propertyValidator("queueUrl", cdk.validateString)(properties.queueUrl));
  errors.collect(cdk.propertyValidator("useBase64", cdk.validateBoolean)(properties.useBase64));
  return errors.wrap("supplied properties not correct for \"SqsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelSqsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelSqsPropertyValidator(properties).assertSuccess();
  return {
    "Payload": convertCfnDetectorModelPayloadPropertyToCloudFormation(properties.payload),
    "QueueUrl": cdk.stringToCloudFormation(properties.queueUrl),
    "UseBase64": cdk.booleanToCloudFormation(properties.useBase64)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelSqsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDetectorModel.SqsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.SqsProperty>();
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnDetectorModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addPropertyResult("queueUrl", "QueueUrl", (properties.QueueUrl != null ? cfn_parse.FromCloudFormation.getString(properties.QueueUrl) : undefined));
  ret.addPropertyResult("useBase64", "UseBase64", (properties.UseBase64 != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseBase64) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SetTimerProperty`
 *
 * @param properties - the TypeScript properties of a `SetTimerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelSetTimerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("durationExpression", cdk.validateString)(properties.durationExpression));
  errors.collect(cdk.propertyValidator("seconds", cdk.validateNumber)(properties.seconds));
  errors.collect(cdk.propertyValidator("timerName", cdk.requiredValidator)(properties.timerName));
  errors.collect(cdk.propertyValidator("timerName", cdk.validateString)(properties.timerName));
  return errors.wrap("supplied properties not correct for \"SetTimerProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelSetTimerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelSetTimerPropertyValidator(properties).assertSuccess();
  return {
    "DurationExpression": cdk.stringToCloudFormation(properties.durationExpression),
    "Seconds": cdk.numberToCloudFormation(properties.seconds),
    "TimerName": cdk.stringToCloudFormation(properties.timerName)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelSetTimerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDetectorModel.SetTimerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.SetTimerProperty>();
  ret.addPropertyResult("durationExpression", "DurationExpression", (properties.DurationExpression != null ? cfn_parse.FromCloudFormation.getString(properties.DurationExpression) : undefined));
  ret.addPropertyResult("seconds", "Seconds", (properties.Seconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.Seconds) : undefined));
  ret.addPropertyResult("timerName", "TimerName", (properties.TimerName != null ? cfn_parse.FromCloudFormation.getString(properties.TimerName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SnsProperty`
 *
 * @param properties - the TypeScript properties of a `SnsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelSnsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("payload", CfnDetectorModelPayloadPropertyValidator)(properties.payload));
  errors.collect(cdk.propertyValidator("targetArn", cdk.requiredValidator)(properties.targetArn));
  errors.collect(cdk.propertyValidator("targetArn", cdk.validateString)(properties.targetArn));
  return errors.wrap("supplied properties not correct for \"SnsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelSnsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelSnsPropertyValidator(properties).assertSuccess();
  return {
    "Payload": convertCfnDetectorModelPayloadPropertyToCloudFormation(properties.payload),
    "TargetArn": cdk.stringToCloudFormation(properties.targetArn)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelSnsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDetectorModel.SnsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.SnsProperty>();
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnDetectorModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addPropertyResult("targetArn", "TargetArn", (properties.TargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ClearTimerProperty`
 *
 * @param properties - the TypeScript properties of a `ClearTimerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelClearTimerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("timerName", cdk.requiredValidator)(properties.timerName));
  errors.collect(cdk.propertyValidator("timerName", cdk.validateString)(properties.timerName));
  return errors.wrap("supplied properties not correct for \"ClearTimerProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelClearTimerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelClearTimerPropertyValidator(properties).assertSuccess();
  return {
    "TimerName": cdk.stringToCloudFormation(properties.timerName)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelClearTimerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorModel.ClearTimerProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.ClearTimerProperty>();
  ret.addPropertyResult("timerName", "TimerName", (properties.TimerName != null ? cfn_parse.FromCloudFormation.getString(properties.TimerName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelLambdaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("functionArn", cdk.requiredValidator)(properties.functionArn));
  errors.collect(cdk.propertyValidator("functionArn", cdk.validateString)(properties.functionArn));
  errors.collect(cdk.propertyValidator("payload", CfnDetectorModelPayloadPropertyValidator)(properties.payload));
  return errors.wrap("supplied properties not correct for \"LambdaProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelLambdaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelLambdaPropertyValidator(properties).assertSuccess();
  return {
    "FunctionArn": cdk.stringToCloudFormation(properties.functionArn),
    "Payload": convertCfnDetectorModelPayloadPropertyToCloudFormation(properties.payload)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelLambdaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDetectorModel.LambdaProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.LambdaProperty>();
  ret.addPropertyResult("functionArn", "FunctionArn", (properties.FunctionArn != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionArn) : undefined));
  ret.addPropertyResult("payload", "Payload", (properties.Payload != null ? CfnDetectorModelPayloadPropertyFromCloudFormation(properties.Payload) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SetVariableProperty`
 *
 * @param properties - the TypeScript properties of a `SetVariableProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelSetVariablePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  errors.collect(cdk.propertyValidator("variableName", cdk.requiredValidator)(properties.variableName));
  errors.collect(cdk.propertyValidator("variableName", cdk.validateString)(properties.variableName));
  return errors.wrap("supplied properties not correct for \"SetVariableProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelSetVariablePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelSetVariablePropertyValidator(properties).assertSuccess();
  return {
    "Value": cdk.stringToCloudFormation(properties.value),
    "VariableName": cdk.stringToCloudFormation(properties.variableName)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelSetVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDetectorModel.SetVariableProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.SetVariableProperty>();
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addPropertyResult("variableName", "VariableName", (properties.VariableName != null ? cfn_parse.FromCloudFormation.getString(properties.VariableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clearTimer", CfnDetectorModelClearTimerPropertyValidator)(properties.clearTimer));
  errors.collect(cdk.propertyValidator("dynamoDb", CfnDetectorModelDynamoDBPropertyValidator)(properties.dynamoDb));
  errors.collect(cdk.propertyValidator("dynamoDBv2", CfnDetectorModelDynamoDBv2PropertyValidator)(properties.dynamoDBv2));
  errors.collect(cdk.propertyValidator("firehose", CfnDetectorModelFirehosePropertyValidator)(properties.firehose));
  errors.collect(cdk.propertyValidator("iotEvents", CfnDetectorModelIotEventsPropertyValidator)(properties.iotEvents));
  errors.collect(cdk.propertyValidator("iotSiteWise", CfnDetectorModelIotSiteWisePropertyValidator)(properties.iotSiteWise));
  errors.collect(cdk.propertyValidator("iotTopicPublish", CfnDetectorModelIotTopicPublishPropertyValidator)(properties.iotTopicPublish));
  errors.collect(cdk.propertyValidator("lambda", CfnDetectorModelLambdaPropertyValidator)(properties.lambda));
  errors.collect(cdk.propertyValidator("resetTimer", CfnDetectorModelResetTimerPropertyValidator)(properties.resetTimer));
  errors.collect(cdk.propertyValidator("setTimer", CfnDetectorModelSetTimerPropertyValidator)(properties.setTimer));
  errors.collect(cdk.propertyValidator("setVariable", CfnDetectorModelSetVariablePropertyValidator)(properties.setVariable));
  errors.collect(cdk.propertyValidator("sns", CfnDetectorModelSnsPropertyValidator)(properties.sns));
  errors.collect(cdk.propertyValidator("sqs", CfnDetectorModelSqsPropertyValidator)(properties.sqs));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelActionPropertyValidator(properties).assertSuccess();
  return {
    "ClearTimer": convertCfnDetectorModelClearTimerPropertyToCloudFormation(properties.clearTimer),
    "DynamoDB": convertCfnDetectorModelDynamoDBPropertyToCloudFormation(properties.dynamoDb),
    "DynamoDBv2": convertCfnDetectorModelDynamoDBv2PropertyToCloudFormation(properties.dynamoDBv2),
    "Firehose": convertCfnDetectorModelFirehosePropertyToCloudFormation(properties.firehose),
    "IotEvents": convertCfnDetectorModelIotEventsPropertyToCloudFormation(properties.iotEvents),
    "IotSiteWise": convertCfnDetectorModelIotSiteWisePropertyToCloudFormation(properties.iotSiteWise),
    "IotTopicPublish": convertCfnDetectorModelIotTopicPublishPropertyToCloudFormation(properties.iotTopicPublish),
    "Lambda": convertCfnDetectorModelLambdaPropertyToCloudFormation(properties.lambda),
    "ResetTimer": convertCfnDetectorModelResetTimerPropertyToCloudFormation(properties.resetTimer),
    "SetTimer": convertCfnDetectorModelSetTimerPropertyToCloudFormation(properties.setTimer),
    "SetVariable": convertCfnDetectorModelSetVariablePropertyToCloudFormation(properties.setVariable),
    "Sns": convertCfnDetectorModelSnsPropertyToCloudFormation(properties.sns),
    "Sqs": convertCfnDetectorModelSqsPropertyToCloudFormation(properties.sqs)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorModel.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.ActionProperty>();
  ret.addPropertyResult("clearTimer", "ClearTimer", (properties.ClearTimer != null ? CfnDetectorModelClearTimerPropertyFromCloudFormation(properties.ClearTimer) : undefined));
  ret.addPropertyResult("dynamoDb", "DynamoDB", (properties.DynamoDB != null ? CfnDetectorModelDynamoDBPropertyFromCloudFormation(properties.DynamoDB) : undefined));
  ret.addPropertyResult("dynamoDBv2", "DynamoDBv2", (properties.DynamoDBv2 != null ? CfnDetectorModelDynamoDBv2PropertyFromCloudFormation(properties.DynamoDBv2) : undefined));
  ret.addPropertyResult("firehose", "Firehose", (properties.Firehose != null ? CfnDetectorModelFirehosePropertyFromCloudFormation(properties.Firehose) : undefined));
  ret.addPropertyResult("iotEvents", "IotEvents", (properties.IotEvents != null ? CfnDetectorModelIotEventsPropertyFromCloudFormation(properties.IotEvents) : undefined));
  ret.addPropertyResult("iotSiteWise", "IotSiteWise", (properties.IotSiteWise != null ? CfnDetectorModelIotSiteWisePropertyFromCloudFormation(properties.IotSiteWise) : undefined));
  ret.addPropertyResult("iotTopicPublish", "IotTopicPublish", (properties.IotTopicPublish != null ? CfnDetectorModelIotTopicPublishPropertyFromCloudFormation(properties.IotTopicPublish) : undefined));
  ret.addPropertyResult("lambda", "Lambda", (properties.Lambda != null ? CfnDetectorModelLambdaPropertyFromCloudFormation(properties.Lambda) : undefined));
  ret.addPropertyResult("resetTimer", "ResetTimer", (properties.ResetTimer != null ? CfnDetectorModelResetTimerPropertyFromCloudFormation(properties.ResetTimer) : undefined));
  ret.addPropertyResult("setTimer", "SetTimer", (properties.SetTimer != null ? CfnDetectorModelSetTimerPropertyFromCloudFormation(properties.SetTimer) : undefined));
  ret.addPropertyResult("setVariable", "SetVariable", (properties.SetVariable != null ? CfnDetectorModelSetVariablePropertyFromCloudFormation(properties.SetVariable) : undefined));
  ret.addPropertyResult("sns", "Sns", (properties.Sns != null ? CfnDetectorModelSnsPropertyFromCloudFormation(properties.Sns) : undefined));
  ret.addPropertyResult("sqs", "Sqs", (properties.Sqs != null ? CfnDetectorModelSqsPropertyFromCloudFormation(properties.Sqs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventProperty`
 *
 * @param properties - the TypeScript properties of a `EventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.listValidator(CfnDetectorModelActionPropertyValidator))(properties.actions));
  errors.collect(cdk.propertyValidator("condition", cdk.validateString)(properties.condition));
  errors.collect(cdk.propertyValidator("eventName", cdk.requiredValidator)(properties.eventName));
  errors.collect(cdk.propertyValidator("eventName", cdk.validateString)(properties.eventName));
  return errors.wrap("supplied properties not correct for \"EventProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelEventPropertyValidator(properties).assertSuccess();
  return {
    "Actions": cdk.listMapper(convertCfnDetectorModelActionPropertyToCloudFormation)(properties.actions),
    "Condition": cdk.stringToCloudFormation(properties.condition),
    "EventName": cdk.stringToCloudFormation(properties.eventName)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorModel.EventProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.EventProperty>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(CfnDetectorModelActionPropertyFromCloudFormation)(properties.Actions) : undefined));
  ret.addPropertyResult("condition", "Condition", (properties.Condition != null ? cfn_parse.FromCloudFormation.getString(properties.Condition) : undefined));
  ret.addPropertyResult("eventName", "EventName", (properties.EventName != null ? cfn_parse.FromCloudFormation.getString(properties.EventName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TransitionEventProperty`
 *
 * @param properties - the TypeScript properties of a `TransitionEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelTransitionEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.listValidator(CfnDetectorModelActionPropertyValidator))(properties.actions));
  errors.collect(cdk.propertyValidator("condition", cdk.requiredValidator)(properties.condition));
  errors.collect(cdk.propertyValidator("condition", cdk.validateString)(properties.condition));
  errors.collect(cdk.propertyValidator("eventName", cdk.requiredValidator)(properties.eventName));
  errors.collect(cdk.propertyValidator("eventName", cdk.validateString)(properties.eventName));
  errors.collect(cdk.propertyValidator("nextState", cdk.requiredValidator)(properties.nextState));
  errors.collect(cdk.propertyValidator("nextState", cdk.validateString)(properties.nextState));
  return errors.wrap("supplied properties not correct for \"TransitionEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelTransitionEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelTransitionEventPropertyValidator(properties).assertSuccess();
  return {
    "Actions": cdk.listMapper(convertCfnDetectorModelActionPropertyToCloudFormation)(properties.actions),
    "Condition": cdk.stringToCloudFormation(properties.condition),
    "EventName": cdk.stringToCloudFormation(properties.eventName),
    "NextState": cdk.stringToCloudFormation(properties.nextState)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelTransitionEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDetectorModel.TransitionEventProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.TransitionEventProperty>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(CfnDetectorModelActionPropertyFromCloudFormation)(properties.Actions) : undefined));
  ret.addPropertyResult("condition", "Condition", (properties.Condition != null ? cfn_parse.FromCloudFormation.getString(properties.Condition) : undefined));
  ret.addPropertyResult("eventName", "EventName", (properties.EventName != null ? cfn_parse.FromCloudFormation.getString(properties.EventName) : undefined));
  ret.addPropertyResult("nextState", "NextState", (properties.NextState != null ? cfn_parse.FromCloudFormation.getString(properties.NextState) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OnInputProperty`
 *
 * @param properties - the TypeScript properties of a `OnInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelOnInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("events", cdk.listValidator(CfnDetectorModelEventPropertyValidator))(properties.events));
  errors.collect(cdk.propertyValidator("transitionEvents", cdk.listValidator(CfnDetectorModelTransitionEventPropertyValidator))(properties.transitionEvents));
  return errors.wrap("supplied properties not correct for \"OnInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelOnInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelOnInputPropertyValidator(properties).assertSuccess();
  return {
    "Events": cdk.listMapper(convertCfnDetectorModelEventPropertyToCloudFormation)(properties.events),
    "TransitionEvents": cdk.listMapper(convertCfnDetectorModelTransitionEventPropertyToCloudFormation)(properties.transitionEvents)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelOnInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDetectorModel.OnInputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.OnInputProperty>();
  ret.addPropertyResult("events", "Events", (properties.Events != null ? cfn_parse.FromCloudFormation.getArray(CfnDetectorModelEventPropertyFromCloudFormation)(properties.Events) : undefined));
  ret.addPropertyResult("transitionEvents", "TransitionEvents", (properties.TransitionEvents != null ? cfn_parse.FromCloudFormation.getArray(CfnDetectorModelTransitionEventPropertyFromCloudFormation)(properties.TransitionEvents) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OnExitProperty`
 *
 * @param properties - the TypeScript properties of a `OnExitProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelOnExitPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("events", cdk.listValidator(CfnDetectorModelEventPropertyValidator))(properties.events));
  return errors.wrap("supplied properties not correct for \"OnExitProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelOnExitPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelOnExitPropertyValidator(properties).assertSuccess();
  return {
    "Events": cdk.listMapper(convertCfnDetectorModelEventPropertyToCloudFormation)(properties.events)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelOnExitPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDetectorModel.OnExitProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.OnExitProperty>();
  ret.addPropertyResult("events", "Events", (properties.Events != null ? cfn_parse.FromCloudFormation.getArray(CfnDetectorModelEventPropertyFromCloudFormation)(properties.Events) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OnEnterProperty`
 *
 * @param properties - the TypeScript properties of a `OnEnterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelOnEnterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("events", cdk.listValidator(CfnDetectorModelEventPropertyValidator))(properties.events));
  return errors.wrap("supplied properties not correct for \"OnEnterProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelOnEnterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelOnEnterPropertyValidator(properties).assertSuccess();
  return {
    "Events": cdk.listMapper(convertCfnDetectorModelEventPropertyToCloudFormation)(properties.events)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelOnEnterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDetectorModel.OnEnterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.OnEnterProperty>();
  ret.addPropertyResult("events", "Events", (properties.Events != null ? cfn_parse.FromCloudFormation.getArray(CfnDetectorModelEventPropertyFromCloudFormation)(properties.Events) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StateProperty`
 *
 * @param properties - the TypeScript properties of a `StateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelStatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("onEnter", CfnDetectorModelOnEnterPropertyValidator)(properties.onEnter));
  errors.collect(cdk.propertyValidator("onExit", CfnDetectorModelOnExitPropertyValidator)(properties.onExit));
  errors.collect(cdk.propertyValidator("onInput", CfnDetectorModelOnInputPropertyValidator)(properties.onInput));
  errors.collect(cdk.propertyValidator("stateName", cdk.requiredValidator)(properties.stateName));
  errors.collect(cdk.propertyValidator("stateName", cdk.validateString)(properties.stateName));
  return errors.wrap("supplied properties not correct for \"StateProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelStatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelStatePropertyValidator(properties).assertSuccess();
  return {
    "OnEnter": convertCfnDetectorModelOnEnterPropertyToCloudFormation(properties.onEnter),
    "OnExit": convertCfnDetectorModelOnExitPropertyToCloudFormation(properties.onExit),
    "OnInput": convertCfnDetectorModelOnInputPropertyToCloudFormation(properties.onInput),
    "StateName": cdk.stringToCloudFormation(properties.stateName)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelStatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDetectorModel.StateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.StateProperty>();
  ret.addPropertyResult("onEnter", "OnEnter", (properties.OnEnter != null ? CfnDetectorModelOnEnterPropertyFromCloudFormation(properties.OnEnter) : undefined));
  ret.addPropertyResult("onExit", "OnExit", (properties.OnExit != null ? CfnDetectorModelOnExitPropertyFromCloudFormation(properties.OnExit) : undefined));
  ret.addPropertyResult("onInput", "OnInput", (properties.OnInput != null ? CfnDetectorModelOnInputPropertyFromCloudFormation(properties.OnInput) : undefined));
  ret.addPropertyResult("stateName", "StateName", (properties.StateName != null ? cfn_parse.FromCloudFormation.getString(properties.StateName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DetectorModelDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `DetectorModelDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelDetectorModelDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("initialStateName", cdk.requiredValidator)(properties.initialStateName));
  errors.collect(cdk.propertyValidator("initialStateName", cdk.validateString)(properties.initialStateName));
  errors.collect(cdk.propertyValidator("states", cdk.requiredValidator)(properties.states));
  errors.collect(cdk.propertyValidator("states", cdk.listValidator(CfnDetectorModelStatePropertyValidator))(properties.states));
  return errors.wrap("supplied properties not correct for \"DetectorModelDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelDetectorModelDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelDetectorModelDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "InitialStateName": cdk.stringToCloudFormation(properties.initialStateName),
    "States": cdk.listMapper(convertCfnDetectorModelStatePropertyToCloudFormation)(properties.states)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelDetectorModelDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorModel.DetectorModelDefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModel.DetectorModelDefinitionProperty>();
  ret.addPropertyResult("initialStateName", "InitialStateName", (properties.InitialStateName != null ? cfn_parse.FromCloudFormation.getString(properties.InitialStateName) : undefined));
  ret.addPropertyResult("states", "States", (properties.States != null ? cfn_parse.FromCloudFormation.getArray(CfnDetectorModelStatePropertyFromCloudFormation)(properties.States) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDetectorModelProps`
 *
 * @param properties - the TypeScript properties of a `CfnDetectorModelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDetectorModelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("detectorModelDefinition", cdk.requiredValidator)(properties.detectorModelDefinition));
  errors.collect(cdk.propertyValidator("detectorModelDefinition", CfnDetectorModelDetectorModelDefinitionPropertyValidator)(properties.detectorModelDefinition));
  errors.collect(cdk.propertyValidator("detectorModelDescription", cdk.validateString)(properties.detectorModelDescription));
  errors.collect(cdk.propertyValidator("detectorModelName", cdk.validateString)(properties.detectorModelName));
  errors.collect(cdk.propertyValidator("evaluationMethod", cdk.validateString)(properties.evaluationMethod));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDetectorModelProps\"");
}

// @ts-ignore TS6133
function convertCfnDetectorModelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDetectorModelPropsValidator(properties).assertSuccess();
  return {
    "DetectorModelDefinition": convertCfnDetectorModelDetectorModelDefinitionPropertyToCloudFormation(properties.detectorModelDefinition),
    "DetectorModelDescription": cdk.stringToCloudFormation(properties.detectorModelDescription),
    "DetectorModelName": cdk.stringToCloudFormation(properties.detectorModelName),
    "EvaluationMethod": cdk.stringToCloudFormation(properties.evaluationMethod),
    "Key": cdk.stringToCloudFormation(properties.key),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDetectorModelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDetectorModelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDetectorModelProps>();
  ret.addPropertyResult("detectorModelDefinition", "DetectorModelDefinition", (properties.DetectorModelDefinition != null ? CfnDetectorModelDetectorModelDefinitionPropertyFromCloudFormation(properties.DetectorModelDefinition) : undefined));
  ret.addPropertyResult("detectorModelDescription", "DetectorModelDescription", (properties.DetectorModelDescription != null ? cfn_parse.FromCloudFormation.getString(properties.DetectorModelDescription) : undefined));
  ret.addPropertyResult("detectorModelName", "DetectorModelName", (properties.DetectorModelName != null ? cfn_parse.FromCloudFormation.getString(properties.DetectorModelName) : undefined));
  ret.addPropertyResult("evaluationMethod", "EvaluationMethod", (properties.EvaluationMethod != null ? cfn_parse.FromCloudFormation.getString(properties.EvaluationMethod) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::IoTEvents::Input resource creates an input.
 *
 * To monitor your devices and processes, they must have a way to get telemetry data into AWS IoT Events . This is done by sending messages as *inputs* to AWS IoT Events . For more information, see [How to Use AWS IoT Events](https://docs.aws.amazon.com/iotevents/latest/developerguide/how-to-use-iotevents.html) in the *AWS IoT Events Developer Guide* .
 *
 * @cloudformationResource AWS::IoTEvents::Input
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-input.html
 */
export class CfnInput extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTEvents::Input";

  /**
   * Build a CfnInput from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInput {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnInputPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnInput(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The definition of the input.
   */
  public inputDefinition: CfnInput.InputDefinitionProperty | cdk.IResolvable;

  /**
   * A brief description of the input.
   */
  public inputDescription?: string;

  /**
   * The name of the input.
   */
  public inputName?: string;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnInputProps) {
    super(scope, id, {
      "type": CfnInput.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "inputDefinition", this);

    this.inputDefinition = props.inputDefinition;
    this.inputDescription = props.inputDescription;
    this.inputName = props.inputName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTEvents::Input", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "inputDefinition": this.inputDefinition,
      "inputDescription": this.inputDescription,
      "inputName": this.inputName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnInput.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnInputPropsToCloudFormation(props);
  }
}

export namespace CfnInput {
  /**
   * The definition of the input.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-input-inputdefinition.html
   */
  export interface InputDefinitionProperty {
    /**
     * The attributes from the JSON payload that are made available by the input.
     *
     * Inputs are derived from messages sent to the AWS IoT Events system using `BatchPutMessage` . Each such message contains a JSON payload, and those attributes (and their paired values) specified here are available for use in the `condition` expressions used by detectors that monitor this input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-input-inputdefinition.html#cfn-iotevents-input-inputdefinition-attributes
     */
    readonly attributes: Array<CfnInput.AttributeProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The attributes from the JSON payload that are made available by the input.
   *
   * Inputs are derived from messages sent to the AWS IoT Events system using `BatchPutMessage` . Each such message contains a JSON payload. Those attributes (and their paired values) specified here are available for use in the `condition` expressions used by detectors.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-input-attribute.html
   */
  export interface AttributeProperty {
    /**
     * An expression that specifies an attribute-value pair in a JSON structure.
     *
     * Use this to specify an attribute from the JSON payload that is made available by the input. Inputs are derived from messages sent to AWS IoT Events ( `BatchPutMessage` ). Each such message contains a JSON payload. The attribute (and its paired value) specified here are available for use in the `condition` expressions used by detectors.
     *
     * Syntax: `<field-name>.<field-name>...`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotevents-input-attribute.html#cfn-iotevents-input-attribute-jsonpath
     */
    readonly jsonPath: string;
  }
}

/**
 * Properties for defining a `CfnInput`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-input.html
 */
export interface CfnInputProps {
  /**
   * The definition of the input.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-input.html#cfn-iotevents-input-inputdefinition
   */
  readonly inputDefinition: CfnInput.InputDefinitionProperty | cdk.IResolvable;

  /**
   * A brief description of the input.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-input.html#cfn-iotevents-input-inputdescription
   */
  readonly inputDescription?: string;

  /**
   * The name of the input.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-input.html#cfn-iotevents-input-inputname
   */
  readonly inputName?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotevents-input.html#cfn-iotevents-input-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AttributeProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInputAttributePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("jsonPath", cdk.requiredValidator)(properties.jsonPath));
  errors.collect(cdk.propertyValidator("jsonPath", cdk.validateString)(properties.jsonPath));
  return errors.wrap("supplied properties not correct for \"AttributeProperty\"");
}

// @ts-ignore TS6133
function convertCfnInputAttributePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInputAttributePropertyValidator(properties).assertSuccess();
  return {
    "JsonPath": cdk.stringToCloudFormation(properties.jsonPath)
  };
}

// @ts-ignore TS6133
function CfnInputAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInput.AttributeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInput.AttributeProperty>();
  ret.addPropertyResult("jsonPath", "JsonPath", (properties.JsonPath != null ? cfn_parse.FromCloudFormation.getString(properties.JsonPath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InputDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `InputDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInputInputDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.requiredValidator)(properties.attributes));
  errors.collect(cdk.propertyValidator("attributes", cdk.listValidator(CfnInputAttributePropertyValidator))(properties.attributes));
  return errors.wrap("supplied properties not correct for \"InputDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnInputInputDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInputInputDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.listMapper(convertCfnInputAttributePropertyToCloudFormation)(properties.attributes)
  };
}

// @ts-ignore TS6133
function CfnInputInputDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInput.InputDefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInput.InputDefinitionProperty>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getArray(CfnInputAttributePropertyFromCloudFormation)(properties.Attributes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnInputProps`
 *
 * @param properties - the TypeScript properties of a `CfnInputProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInputPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("inputDefinition", cdk.requiredValidator)(properties.inputDefinition));
  errors.collect(cdk.propertyValidator("inputDefinition", CfnInputInputDefinitionPropertyValidator)(properties.inputDefinition));
  errors.collect(cdk.propertyValidator("inputDescription", cdk.validateString)(properties.inputDescription));
  errors.collect(cdk.propertyValidator("inputName", cdk.validateString)(properties.inputName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnInputProps\"");
}

// @ts-ignore TS6133
function convertCfnInputPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInputPropsValidator(properties).assertSuccess();
  return {
    "InputDefinition": convertCfnInputInputDefinitionPropertyToCloudFormation(properties.inputDefinition),
    "InputDescription": cdk.stringToCloudFormation(properties.inputDescription),
    "InputName": cdk.stringToCloudFormation(properties.inputName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnInputPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInputProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInputProps>();
  ret.addPropertyResult("inputDefinition", "InputDefinition", (properties.InputDefinition != null ? CfnInputInputDefinitionPropertyFromCloudFormation(properties.InputDefinition) : undefined));
  ret.addPropertyResult("inputDescription", "InputDescription", (properties.InputDescription != null ? cfn_parse.FromCloudFormation.getString(properties.InputDescription) : undefined));
  ret.addPropertyResult("inputName", "InputName", (properties.InputName != null ? cfn_parse.FromCloudFormation.getString(properties.InputName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}