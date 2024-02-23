/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::Detective::Graph` resource is an Amazon Detective resource type that creates a Detective behavior graph.
 *
 * The requesting account becomes the administrator account for the behavior graph.
 *
 * @cloudformationResource AWS::Detective::Graph
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-graph.html
 */
export class CfnGraph extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Detective::Graph";

  /**
   * Build a CfnGraph from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGraph {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGraphPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGraph(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the new behavior graph.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Indicates whether to automatically enable new organization accounts as member accounts in the organization behavior graph.
   */
  public autoEnableMembers?: boolean | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tag values to assign to the new behavior graph.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGraphProps = {}) {
    super(scope, id, {
      "type": CfnGraph.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.autoEnableMembers = props.autoEnableMembers;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Detective::Graph", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoEnableMembers": this.autoEnableMembers,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGraph.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGraphPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnGraph`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-graph.html
 */
export interface CfnGraphProps {
  /**
   * Indicates whether to automatically enable new organization accounts as member accounts in the organization behavior graph.
   *
   * By default, this property is set to `false` . If you want to change the value of this property, you must be the Detective administrator for the organization. For more information on setting a Detective administrator account, see [AWS::Detective::OrganizationAdmin](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-organizationadmin.html)
   *
   * @default - false
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-graph.html#cfn-detective-graph-autoenablemembers
   */
  readonly autoEnableMembers?: boolean | cdk.IResolvable;

  /**
   * The tag values to assign to the new behavior graph.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-graph.html#cfn-detective-graph-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnGraphProps`
 *
 * @param properties - the TypeScript properties of a `CfnGraphProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGraphPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoEnableMembers", cdk.validateBoolean)(properties.autoEnableMembers));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnGraphProps\"");
}

// @ts-ignore TS6133
function convertCfnGraphPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGraphPropsValidator(properties).assertSuccess();
  return {
    "AutoEnableMembers": cdk.booleanToCloudFormation(properties.autoEnableMembers),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnGraphPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGraphProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphProps>();
  ret.addPropertyResult("autoEnableMembers", "AutoEnableMembers", (properties.AutoEnableMembers != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoEnableMembers) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Detective::MemberInvitation` resource is an Amazon Detective resource type that creates an invitation to join a Detective behavior graph.
 *
 * The administrator account can choose whether to send an email notification of the invitation to the root user email address of the AWS account.
 *
 * @cloudformationResource AWS::Detective::MemberInvitation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html
 */
export class CfnMemberInvitation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Detective::MemberInvitation";

  /**
   * Build a CfnMemberInvitation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMemberInvitation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMemberInvitationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMemberInvitation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Whether to send an invitation email to the member account.
   */
  public disableEmailNotification?: boolean | cdk.IResolvable;

  /**
   * The ARN of the behavior graph to invite the account to contribute data to.
   */
  public graphArn: string;

  /**
   * The root user email address of the invited account.
   */
  public memberEmailAddress: string;

  /**
   * The AWS account identifier of the invited account.
   */
  public memberId: string;

  /**
   * Customized text to include in the invitation email message.
   */
  public message?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMemberInvitationProps) {
    super(scope, id, {
      "type": CfnMemberInvitation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "graphArn", this);
    cdk.requireProperty(props, "memberEmailAddress", this);
    cdk.requireProperty(props, "memberId", this);

    this.disableEmailNotification = props.disableEmailNotification;
    this.graphArn = props.graphArn;
    this.memberEmailAddress = props.memberEmailAddress;
    this.memberId = props.memberId;
    this.message = props.message;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "disableEmailNotification": this.disableEmailNotification,
      "graphArn": this.graphArn,
      "memberEmailAddress": this.memberEmailAddress,
      "memberId": this.memberId,
      "message": this.message
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMemberInvitation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMemberInvitationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnMemberInvitation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html
 */
export interface CfnMemberInvitationProps {
  /**
   * Whether to send an invitation email to the member account.
   *
   * If set to true, the member account does not receive an invitation email.
   *
   * @default - false
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html#cfn-detective-memberinvitation-disableemailnotification
   */
  readonly disableEmailNotification?: boolean | cdk.IResolvable;

  /**
   * The ARN of the behavior graph to invite the account to contribute data to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html#cfn-detective-memberinvitation-grapharn
   */
  readonly graphArn: string;

  /**
   * The root user email address of the invited account.
   *
   * If the email address provided is not the root user email address for the provided account, the invitation creation fails.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html#cfn-detective-memberinvitation-memberemailaddress
   */
  readonly memberEmailAddress: string;

  /**
   * The AWS account identifier of the invited account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html#cfn-detective-memberinvitation-memberid
   */
  readonly memberId: string;

  /**
   * Customized text to include in the invitation email message.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html#cfn-detective-memberinvitation-message
   */
  readonly message?: string;
}

/**
 * Determine whether the given properties match those of a `CfnMemberInvitationProps`
 *
 * @param properties - the TypeScript properties of a `CfnMemberInvitationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMemberInvitationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("disableEmailNotification", cdk.validateBoolean)(properties.disableEmailNotification));
  errors.collect(cdk.propertyValidator("graphArn", cdk.requiredValidator)(properties.graphArn));
  errors.collect(cdk.propertyValidator("graphArn", cdk.validateString)(properties.graphArn));
  errors.collect(cdk.propertyValidator("memberEmailAddress", cdk.requiredValidator)(properties.memberEmailAddress));
  errors.collect(cdk.propertyValidator("memberEmailAddress", cdk.validateString)(properties.memberEmailAddress));
  errors.collect(cdk.propertyValidator("memberId", cdk.requiredValidator)(properties.memberId));
  errors.collect(cdk.propertyValidator("memberId", cdk.validateString)(properties.memberId));
  errors.collect(cdk.propertyValidator("message", cdk.validateString)(properties.message));
  return errors.wrap("supplied properties not correct for \"CfnMemberInvitationProps\"");
}

// @ts-ignore TS6133
function convertCfnMemberInvitationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMemberInvitationPropsValidator(properties).assertSuccess();
  return {
    "DisableEmailNotification": cdk.booleanToCloudFormation(properties.disableEmailNotification),
    "GraphArn": cdk.stringToCloudFormation(properties.graphArn),
    "MemberEmailAddress": cdk.stringToCloudFormation(properties.memberEmailAddress),
    "MemberId": cdk.stringToCloudFormation(properties.memberId),
    "Message": cdk.stringToCloudFormation(properties.message)
  };
}

// @ts-ignore TS6133
function CfnMemberInvitationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMemberInvitationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMemberInvitationProps>();
  ret.addPropertyResult("disableEmailNotification", "DisableEmailNotification", (properties.DisableEmailNotification != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableEmailNotification) : undefined));
  ret.addPropertyResult("graphArn", "GraphArn", (properties.GraphArn != null ? cfn_parse.FromCloudFormation.getString(properties.GraphArn) : undefined));
  ret.addPropertyResult("memberEmailAddress", "MemberEmailAddress", (properties.MemberEmailAddress != null ? cfn_parse.FromCloudFormation.getString(properties.MemberEmailAddress) : undefined));
  ret.addPropertyResult("memberId", "MemberId", (properties.MemberId != null ? cfn_parse.FromCloudFormation.getString(properties.MemberId) : undefined));
  ret.addPropertyResult("message", "Message", (properties.Message != null ? cfn_parse.FromCloudFormation.getString(properties.Message) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Detective::OrganizationAdmin` resource is an Amazon Detective resource type that designates the Detective administrator account for the organization in the current region.
 *
 * If the account does not have Detective enabled, then this resource enables Detective for that account and creates a new behavior graph.
 *
 * @cloudformationResource AWS::Detective::OrganizationAdmin
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-organizationadmin.html
 */
export class CfnOrganizationAdmin extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Detective::OrganizationAdmin";

  /**
   * Build a CfnOrganizationAdmin from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnOrganizationAdmin {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnOrganizationAdminPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnOrganizationAdmin(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the behavior graph to invite the account to contribute data to.
   *
   * @cloudformationAttribute GraphArn
   */
  public readonly attrGraphArn: string;

  /**
   * The AWS account identifier of the account to designate as the Detective administrator account for the organization.
   */
  public accountId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnOrganizationAdminProps) {
    super(scope, id, {
      "type": CfnOrganizationAdmin.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accountId", this);

    this.attrGraphArn = cdk.Token.asString(this.getAtt("GraphArn", cdk.ResolutionTypeHint.STRING));
    this.accountId = props.accountId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accountId": this.accountId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnOrganizationAdmin.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnOrganizationAdminPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnOrganizationAdmin`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-organizationadmin.html
 */
export interface CfnOrganizationAdminProps {
  /**
   * The AWS account identifier of the account to designate as the Detective administrator account for the organization.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-organizationadmin.html#cfn-detective-organizationadmin-accountid
   */
  readonly accountId: string;
}

/**
 * Determine whether the given properties match those of a `CfnOrganizationAdminProps`
 *
 * @param properties - the TypeScript properties of a `CfnOrganizationAdminProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOrganizationAdminPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountId", cdk.requiredValidator)(properties.accountId));
  errors.collect(cdk.propertyValidator("accountId", cdk.validateString)(properties.accountId));
  return errors.wrap("supplied properties not correct for \"CfnOrganizationAdminProps\"");
}

// @ts-ignore TS6133
function convertCfnOrganizationAdminPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOrganizationAdminPropsValidator(properties).assertSuccess();
  return {
    "AccountId": cdk.stringToCloudFormation(properties.accountId)
  };
}

// @ts-ignore TS6133
function CfnOrganizationAdminPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOrganizationAdminProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOrganizationAdminProps>();
  ret.addPropertyResult("accountId", "AccountId", (properties.AccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AccountId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}