/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a notification rule for a resource.
 *
 * The rule specifies the events you want notifications about and the targets (such as AWS Chatbot topics or AWS Chatbot clients configured for Slack) where you want to receive them.
 *
 * @cloudformationResource AWS::CodeStarNotifications::NotificationRule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html
 */
export class CfnNotificationRule extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodeStarNotifications::NotificationRule";

  /**
   * Build a CfnNotificationRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNotificationRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnNotificationRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnNotificationRule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the notification rule.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  public createdBy?: string;

  /**
   * The level of detail to include in the notifications for this resource.
   */
  public detailType: string;

  public eventTypeId?: string;

  /**
   * A list of event types associated with this notification rule.
   */
  public eventTypeIds: Array<string>;

  /**
   * The name for the notification rule.
   */
  public name: string;

  /**
   * The Amazon Resource Name (ARN) of the resource to associate with the notification rule.
   */
  public resource: string;

  /**
   * The status of the notification rule.
   */
  public status?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tags to apply to this notification rule.
   */
  public tagsRaw?: Record<string, string>;

  public targetAddress?: string;

  /**
   * A list of Amazon Resource Names (ARNs) of Amazon Simple Notification Service topics and AWS Chatbot clients to associate with the notification rule.
   */
  public targets: Array<cdk.IResolvable | CfnNotificationRule.TargetProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnNotificationRuleProps) {
    super(scope, id, {
      "type": CfnNotificationRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "detailType", this);
    cdk.requireProperty(props, "eventTypeIds", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "resource", this);
    cdk.requireProperty(props, "targets", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.createdBy = props.createdBy;
    this.detailType = props.detailType;
    this.eventTypeId = props.eventTypeId;
    this.eventTypeIds = props.eventTypeIds;
    this.name = props.name;
    this.resource = props.resource;
    this.status = props.status;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::CodeStarNotifications::NotificationRule", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targetAddress = props.targetAddress;
    this.targets = props.targets;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "createdBy": this.createdBy,
      "detailType": this.detailType,
      "eventTypeId": this.eventTypeId,
      "eventTypeIds": this.eventTypeIds,
      "name": this.name,
      "resource": this.resource,
      "status": this.status,
      "tags": this.tags.renderTags(),
      "targetAddress": this.targetAddress,
      "targets": this.targets
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnNotificationRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnNotificationRulePropsToCloudFormation(props);
  }
}

export namespace CfnNotificationRule {
  /**
   * Information about the AWS Chatbot topics or AWS Chatbot clients associated with a notification rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codestarnotifications-notificationrule-target.html
   */
  export interface TargetProperty {
    /**
     * The Amazon Resource Name (ARN) of the AWS Chatbot topic or AWS Chatbot client.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codestarnotifications-notificationrule-target.html#cfn-codestarnotifications-notificationrule-target-targetaddress
     */
    readonly targetAddress: string;

    /**
     * The target type. Can be an Amazon Simple Notification Service topic or AWS Chatbot client.
     *
     * - Amazon Simple Notification Service topics are specified as `SNS` .
     * - AWS Chatbot clients are specified as `AWSChatbotSlack` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codestarnotifications-notificationrule-target.html#cfn-codestarnotifications-notificationrule-target-targettype
     */
    readonly targetType: string;
  }
}

/**
 * Properties for defining a `CfnNotificationRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html
 */
export interface CfnNotificationRuleProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-createdby
   */
  readonly createdBy?: string;

  /**
   * The level of detail to include in the notifications for this resource.
   *
   * `BASIC` will include only the contents of the event as it would appear in Amazon CloudWatch. `FULL` will include any supplemental information provided by AWS CodeStar Notifications and/or the service for the resource for which the notification is created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-detailtype
   */
  readonly detailType: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-eventtypeid
   */
  readonly eventTypeId?: string;

  /**
   * A list of event types associated with this notification rule.
   *
   * For a complete list of event types and IDs, see [Notification concepts](https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#concepts-api) in the *Developer Tools Console User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-eventtypeids
   */
  readonly eventTypeIds: Array<string>;

  /**
   * The name for the notification rule.
   *
   * Notification rule names must be unique in your AWS account .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-name
   */
  readonly name: string;

  /**
   * The Amazon Resource Name (ARN) of the resource to associate with the notification rule.
   *
   * Supported resources include pipelines in AWS CodePipeline , repositories in AWS CodeCommit , and build projects in AWS CodeBuild .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-resource
   */
  readonly resource: string;

  /**
   * The status of the notification rule.
   *
   * The default value is `ENABLED` . If the status is set to `DISABLED` , notifications aren't sent for the notification rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-status
   */
  readonly status?: string;

  /**
   * A list of tags to apply to this notification rule.
   *
   * Key names cannot start with " `aws` ".
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-targetaddress
   */
  readonly targetAddress?: string;

  /**
   * A list of Amazon Resource Names (ARNs) of Amazon Simple Notification Service topics and AWS Chatbot clients to associate with the notification rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-targets
   */
  readonly targets: Array<cdk.IResolvable | CfnNotificationRule.TargetProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `TargetProperty`
 *
 * @param properties - the TypeScript properties of a `TargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNotificationRuleTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetAddress", cdk.requiredValidator)(properties.targetAddress));
  errors.collect(cdk.propertyValidator("targetAddress", cdk.validateString)(properties.targetAddress));
  errors.collect(cdk.propertyValidator("targetType", cdk.requiredValidator)(properties.targetType));
  errors.collect(cdk.propertyValidator("targetType", cdk.validateString)(properties.targetType));
  return errors.wrap("supplied properties not correct for \"TargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnNotificationRuleTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNotificationRuleTargetPropertyValidator(properties).assertSuccess();
  return {
    "TargetAddress": cdk.stringToCloudFormation(properties.targetAddress),
    "TargetType": cdk.stringToCloudFormation(properties.targetType)
  };
}

// @ts-ignore TS6133
function CfnNotificationRuleTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnNotificationRule.TargetProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNotificationRule.TargetProperty>();
  ret.addPropertyResult("targetAddress", "TargetAddress", (properties.TargetAddress != null ? cfn_parse.FromCloudFormation.getString(properties.TargetAddress) : undefined));
  ret.addPropertyResult("targetType", "TargetType", (properties.TargetType != null ? cfn_parse.FromCloudFormation.getString(properties.TargetType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnNotificationRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnNotificationRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNotificationRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("createdBy", cdk.validateString)(properties.createdBy));
  errors.collect(cdk.propertyValidator("detailType", cdk.requiredValidator)(properties.detailType));
  errors.collect(cdk.propertyValidator("detailType", cdk.validateString)(properties.detailType));
  errors.collect(cdk.propertyValidator("eventTypeId", cdk.validateString)(properties.eventTypeId));
  errors.collect(cdk.propertyValidator("eventTypeIds", cdk.requiredValidator)(properties.eventTypeIds));
  errors.collect(cdk.propertyValidator("eventTypeIds", cdk.listValidator(cdk.validateString))(properties.eventTypeIds));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("resource", cdk.requiredValidator)(properties.resource));
  errors.collect(cdk.propertyValidator("resource", cdk.validateString)(properties.resource));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("targetAddress", cdk.validateString)(properties.targetAddress));
  errors.collect(cdk.propertyValidator("targets", cdk.requiredValidator)(properties.targets));
  errors.collect(cdk.propertyValidator("targets", cdk.listValidator(CfnNotificationRuleTargetPropertyValidator))(properties.targets));
  return errors.wrap("supplied properties not correct for \"CfnNotificationRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnNotificationRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNotificationRulePropsValidator(properties).assertSuccess();
  return {
    "CreatedBy": cdk.stringToCloudFormation(properties.createdBy),
    "DetailType": cdk.stringToCloudFormation(properties.detailType),
    "EventTypeId": cdk.stringToCloudFormation(properties.eventTypeId),
    "EventTypeIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.eventTypeIds),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Resource": cdk.stringToCloudFormation(properties.resource),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "TargetAddress": cdk.stringToCloudFormation(properties.targetAddress),
    "Targets": cdk.listMapper(convertCfnNotificationRuleTargetPropertyToCloudFormation)(properties.targets)
  };
}

// @ts-ignore TS6133
function CfnNotificationRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNotificationRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNotificationRuleProps>();
  ret.addPropertyResult("createdBy", "CreatedBy", (properties.CreatedBy != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedBy) : undefined));
  ret.addPropertyResult("detailType", "DetailType", (properties.DetailType != null ? cfn_parse.FromCloudFormation.getString(properties.DetailType) : undefined));
  ret.addPropertyResult("eventTypeId", "EventTypeId", (properties.EventTypeId != null ? cfn_parse.FromCloudFormation.getString(properties.EventTypeId) : undefined));
  ret.addPropertyResult("eventTypeIds", "EventTypeIds", (properties.EventTypeIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EventTypeIds) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("resource", "Resource", (properties.Resource != null ? cfn_parse.FromCloudFormation.getString(properties.Resource) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("targetAddress", "TargetAddress", (properties.TargetAddress != null ? cfn_parse.FromCloudFormation.getString(properties.TargetAddress) : undefined));
  ret.addPropertyResult("targets", "Targets", (properties.Targets != null ? cfn_parse.FromCloudFormation.getArray(CfnNotificationRuleTargetPropertyFromCloudFormation)(properties.Targets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}