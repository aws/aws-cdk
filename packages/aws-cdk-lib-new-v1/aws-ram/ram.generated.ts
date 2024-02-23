/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a customer managed permission for a specified resource type that you can attach to resource shares.
 *
 * It is created in the AWS Region in which you call the operation.
 *
 * @cloudformationResource AWS::RAM::Permission
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-permission.html
 */
export class CfnPermission extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RAM::Permission";

  /**
   * Build a CfnPermission from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPermission {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPermissionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPermission(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the new permission.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Specifies whether this permission is the default for new resource shares that include resources of the associated resource type.
   *
   * @cloudformationAttribute IsResourceTypeDefault
   */
  public readonly attrIsResourceTypeDefault: cdk.IResolvable;

  /**
   * The type of managed permission. This can be one of the following values:
   *
   * - *AWS_MANAGED_PERMISSION* – AWS created and manages this managed permission. You can associate it with your resource shares, but you can't modify it.
   * - *CUSTOMER_MANAGED_PERMISSION* – You, or another principal in your account created this managed permission. You can associate it with your resource shares and create new versions that have different permissions.
   *
   * @cloudformationAttribute PermissionType
   */
  public readonly attrPermissionType: string;

  /**
   * The version number for this version of the permission.
   *
   * @cloudformationAttribute Version
   */
  public readonly attrVersion: string;

  /**
   * Specifies the name of the customer managed permission.
   */
  public name: string;

  /**
   * A string in JSON format string that contains the following elements of a resource-based policy:.
   */
  public policyTemplate: any | cdk.IResolvable;

  /**
   * Specifies the name of the resource type that this customer managed permission applies to.
   */
  public resourceType: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies a list of one or more tag key and value pairs to attach to the permission.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPermissionProps) {
    super(scope, id, {
      "type": CfnPermission.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "policyTemplate", this);
    cdk.requireProperty(props, "resourceType", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrIsResourceTypeDefault = this.getAtt("IsResourceTypeDefault");
    this.attrPermissionType = cdk.Token.asString(this.getAtt("PermissionType", cdk.ResolutionTypeHint.STRING));
    this.attrVersion = cdk.Token.asString(this.getAtt("Version", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.policyTemplate = props.policyTemplate;
    this.resourceType = props.resourceType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RAM::Permission", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "policyTemplate": this.policyTemplate,
      "resourceType": this.resourceType,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPermission.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPermissionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPermission`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-permission.html
 */
export interface CfnPermissionProps {
  /**
   * Specifies the name of the customer managed permission.
   *
   * The name must be unique within the AWS Region .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-permission.html#cfn-ram-permission-name
   */
  readonly name: string;

  /**
   * A string in JSON format string that contains the following elements of a resource-based policy:.
   *
   * - *Effect* : must be set to `ALLOW` .
   * - *Action* : specifies the actions that are allowed by this customer managed permission. The list must contain only actions that are supported by the specified resource type. For a list of all actions supported by each resource type, see [Actions, resources, and condition keys for AWS services](https://docs.aws.amazon.com/service-authorization/latest/reference/reference_policies_actions-resources-contextkeys.html) in the *AWS Identity and Access Management User Guide* .
   * - *Condition* : (optional) specifies conditional parameters that must evaluate to true when a user attempts an action for that action to be allowed. For more information about the Condition element, see [IAM policies: Condition element](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html) in the *AWS Identity and Access Management User Guide* .
   *
   * This template can't include either the `Resource` or `Principal` elements. Those are both filled in by AWS RAM when it instantiates the resource-based policy on each resource shared using this managed permission. The `Resource` comes from the ARN of the specific resource that you are sharing. The `Principal` comes from the list of identities added to the resource share.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-permission.html#cfn-ram-permission-policytemplate
   */
  readonly policyTemplate: any | cdk.IResolvable;

  /**
   * Specifies the name of the resource type that this customer managed permission applies to.
   *
   * The format is `*<service-code>* : *<resource-type>*` and is not case sensitive. For example, to specify an Amazon EC2 Subnet, you can use the string `ec2:subnet` . To see the list of valid values for this parameter, query the [ListResourceTypes](https://docs.aws.amazon.com/ram/latest/APIReference/API_ListResourceTypes.html) operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-permission.html#cfn-ram-permission-resourcetype
   */
  readonly resourceType: string;

  /**
   * Specifies a list of one or more tag key and value pairs to attach to the permission.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-permission.html#cfn-ram-permission-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnPermissionProps`
 *
 * @param properties - the TypeScript properties of a `CfnPermissionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPermissionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("policyTemplate", cdk.requiredValidator)(properties.policyTemplate));
  errors.collect(cdk.propertyValidator("policyTemplate", cdk.validateObject)(properties.policyTemplate));
  errors.collect(cdk.propertyValidator("resourceType", cdk.requiredValidator)(properties.resourceType));
  errors.collect(cdk.propertyValidator("resourceType", cdk.validateString)(properties.resourceType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPermissionProps\"");
}

// @ts-ignore TS6133
function convertCfnPermissionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPermissionPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "PolicyTemplate": cdk.objectToCloudFormation(properties.policyTemplate),
    "ResourceType": cdk.stringToCloudFormation(properties.resourceType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPermissionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissionProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("policyTemplate", "PolicyTemplate", (properties.PolicyTemplate != null ? cfn_parse.FromCloudFormation.getAny(properties.PolicyTemplate) : undefined));
  ret.addPropertyResult("resourceType", "ResourceType", (properties.ResourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a resource share.
 *
 * You can provide a list of the Amazon Resource Names (ARNs) for the resources that you want to share, a list of principals you want to share the resources with, and the permissions to grant those principals.
 *
 * > Sharing a resource makes it available for use by principals outside of the AWS account that created the resource. Sharing doesn't change any permissions or quotas that apply to the resource in the account that created it.
 *
 * @cloudformationResource AWS::RAM::ResourceShare
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html
 */
export class CfnResourceShare extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RAM::ResourceShare";

  /**
   * Build a CfnResourceShare from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceShare {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourceSharePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourceShare(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the resource share.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Specifies whether principals outside your organization in AWS Organizations can be associated with a resource share.
   */
  public allowExternalPrincipals?: boolean | cdk.IResolvable;

  /**
   * Specifies the name of the resource share.
   */
  public name: string;

  /**
   * Specifies the [Amazon Resource Names (ARNs)](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html) of the AWS RAM permission to associate with the resource share. If you do not specify an ARN for the permission, AWS RAM automatically attaches the default version of the permission for each resource type. You can associate only one permission with each resource type included in the resource share.
   */
  public permissionArns?: Array<string>;

  /**
   * Specifies the principals to associate with the resource share. The possible values are:.
   */
  public principals?: Array<string>;

  /**
   * Specifies a list of one or more ARNs of the resources to associate with the resource share.
   */
  public resourceArns?: Array<string>;

  public sources?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies one or more tags to attach to the resource share itself.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourceShareProps) {
    super(scope, id, {
      "type": CfnResourceShare.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.allowExternalPrincipals = props.allowExternalPrincipals;
    this.name = props.name;
    this.permissionArns = props.permissionArns;
    this.principals = props.principals;
    this.resourceArns = props.resourceArns;
    this.sources = props.sources;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RAM::ResourceShare", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "allowExternalPrincipals": this.allowExternalPrincipals,
      "name": this.name,
      "permissionArns": this.permissionArns,
      "principals": this.principals,
      "resourceArns": this.resourceArns,
      "sources": this.sources,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceShare.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourceSharePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnResourceShare`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html
 */
export interface CfnResourceShareProps {
  /**
   * Specifies whether principals outside your organization in AWS Organizations can be associated with a resource share.
   *
   * A value of `true` lets you share with individual AWS accounts that are *not* in your organization. A value of `false` only has meaning if your account is a member of an AWS Organization. The default value is `true` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-allowexternalprincipals
   */
  readonly allowExternalPrincipals?: boolean | cdk.IResolvable;

  /**
   * Specifies the name of the resource share.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-name
   */
  readonly name: string;

  /**
   * Specifies the [Amazon Resource Names (ARNs)](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html) of the AWS RAM permission to associate with the resource share. If you do not specify an ARN for the permission, AWS RAM automatically attaches the default version of the permission for each resource type. You can associate only one permission with each resource type included in the resource share.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-permissionarns
   */
  readonly permissionArns?: Array<string>;

  /**
   * Specifies the principals to associate with the resource share. The possible values are:.
   *
   * - An AWS account ID
   * - An Amazon Resource Name (ARN) of an organization in AWS Organizations
   * - An ARN of an organizational unit (OU) in AWS Organizations
   * - An ARN of an IAM role
   * - An ARN of an IAM user
   *
   * > Not all resource types can be shared with IAM roles and users. For more information, see the column *Can share with IAM roles and users* in the tables on [Shareable AWS resources](https://docs.aws.amazon.com/ram/latest/userguide/shareable.html) in the *AWS Resource Access Manager User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-principals
   */
  readonly principals?: Array<string>;

  /**
   * Specifies a list of one or more ARNs of the resources to associate with the resource share.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-resourcearns
   */
  readonly resourceArns?: Array<string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-sources
   */
  readonly sources?: Array<string>;

  /**
   * Specifies one or more tags to attach to the resource share itself.
   *
   * It doesn't attach the tags to the resources associated with the resource share.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnResourceShareProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceShareProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceSharePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowExternalPrincipals", cdk.validateBoolean)(properties.allowExternalPrincipals));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("permissionArns", cdk.listValidator(cdk.validateString))(properties.permissionArns));
  errors.collect(cdk.propertyValidator("principals", cdk.listValidator(cdk.validateString))(properties.principals));
  errors.collect(cdk.propertyValidator("resourceArns", cdk.listValidator(cdk.validateString))(properties.resourceArns));
  errors.collect(cdk.propertyValidator("sources", cdk.listValidator(cdk.validateString))(properties.sources));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnResourceShareProps\"");
}

// @ts-ignore TS6133
function convertCfnResourceSharePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceSharePropsValidator(properties).assertSuccess();
  return {
    "AllowExternalPrincipals": cdk.booleanToCloudFormation(properties.allowExternalPrincipals),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PermissionArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.permissionArns),
    "Principals": cdk.listMapper(cdk.stringToCloudFormation)(properties.principals),
    "ResourceArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceArns),
    "Sources": cdk.listMapper(cdk.stringToCloudFormation)(properties.sources),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnResourceSharePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceShareProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceShareProps>();
  ret.addPropertyResult("allowExternalPrincipals", "AllowExternalPrincipals", (properties.AllowExternalPrincipals != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowExternalPrincipals) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("permissionArns", "PermissionArns", (properties.PermissionArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PermissionArns) : undefined));
  ret.addPropertyResult("principals", "Principals", (properties.Principals != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Principals) : undefined));
  ret.addPropertyResult("resourceArns", "ResourceArns", (properties.ResourceArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ResourceArns) : undefined));
  ret.addPropertyResult("sources", "Sources", (properties.Sources != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Sources) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}