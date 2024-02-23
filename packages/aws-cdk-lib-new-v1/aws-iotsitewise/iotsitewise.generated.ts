/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates an access policy that grants the specified identity (IAM Identity Center user, IAM Identity Center group, or IAM user) access to the specified AWS IoT SiteWise Monitor portal or project resource.
 *
 * @cloudformationResource AWS::IoTSiteWise::AccessPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html
 */
export class CfnAccessPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTSiteWise::AccessPolicy";

  /**
   * Build a CfnAccessPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccessPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAccessPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccessPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of the access policy, which has the following format.
   *
   * `arn:${Partition}:iotsitewise:${Region}:${Account}:access-policy/${AccessPolicyId}`
   *
   * @cloudformationAttribute AccessPolicyArn
   */
  public readonly attrAccessPolicyArn: string;

  /**
   * The ID of the access policy.
   *
   * @cloudformationAttribute AccessPolicyId
   */
  public readonly attrAccessPolicyId: string;

  /**
   * The identity for this access policy.
   */
  public accessPolicyIdentity: CfnAccessPolicy.AccessPolicyIdentityProperty | cdk.IResolvable;

  /**
   * The permission level for this access policy.
   */
  public accessPolicyPermission: string;

  /**
   * The AWS IoT SiteWise Monitor resource for this access policy.
   */
  public accessPolicyResource: CfnAccessPolicy.AccessPolicyResourceProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccessPolicyProps) {
    super(scope, id, {
      "type": CfnAccessPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accessPolicyIdentity", this);
    cdk.requireProperty(props, "accessPolicyPermission", this);
    cdk.requireProperty(props, "accessPolicyResource", this);

    this.attrAccessPolicyArn = cdk.Token.asString(this.getAtt("AccessPolicyArn", cdk.ResolutionTypeHint.STRING));
    this.attrAccessPolicyId = cdk.Token.asString(this.getAtt("AccessPolicyId", cdk.ResolutionTypeHint.STRING));
    this.accessPolicyIdentity = props.accessPolicyIdentity;
    this.accessPolicyPermission = props.accessPolicyPermission;
    this.accessPolicyResource = props.accessPolicyResource;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessPolicyIdentity": this.accessPolicyIdentity,
      "accessPolicyPermission": this.accessPolicyPermission,
      "accessPolicyResource": this.accessPolicyResource
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccessPolicyPropsToCloudFormation(props);
  }
}

export namespace CfnAccessPolicy {
  /**
   * The AWS IoT SiteWise Monitor resource for this access policy.
   *
   * Choose either a portal or a project.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-accesspolicyresource.html
   */
  export interface AccessPolicyResourceProperty {
    /**
     * The AWS IoT SiteWise Monitor portal for this access policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-accesspolicyresource.html#cfn-iotsitewise-accesspolicy-accesspolicyresource-portal
     */
    readonly portal?: cdk.IResolvable | CfnAccessPolicy.PortalProperty;

    /**
     * The AWS IoT SiteWise Monitor project for this access policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-accesspolicyresource.html#cfn-iotsitewise-accesspolicy-accesspolicyresource-project
     */
    readonly project?: cdk.IResolvable | CfnAccessPolicy.ProjectProperty;
  }

  /**
   * The `Project` property type specifies the AWS IoT SiteWise Monitor project for an [AWS::IoTSiteWise::AccessPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-project.html
   */
  export interface ProjectProperty {
    /**
     * The ID of the project.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-project.html#cfn-iotsitewise-accesspolicy-project-id
     */
    readonly id?: string;
  }

  /**
   * The `Portal` property type specifies the AWS IoT SiteWise Monitor portal for an [AWS::IoTSiteWise::AccessPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-portal.html
   */
  export interface PortalProperty {
    /**
     * The ID of the portal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-portal.html#cfn-iotsitewise-accesspolicy-portal-id
     */
    readonly id?: string;
  }

  /**
   * The identity (IAM Identity Center user, IAM Identity Center group, or IAM user) to which this access policy applies.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-accesspolicyidentity.html
   */
  export interface AccessPolicyIdentityProperty {
    /**
     * An IAM role identity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-accesspolicyidentity.html#cfn-iotsitewise-accesspolicy-accesspolicyidentity-iamrole
     */
    readonly iamRole?: CfnAccessPolicy.IamRoleProperty | cdk.IResolvable;

    /**
     * An IAM user identity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-accesspolicyidentity.html#cfn-iotsitewise-accesspolicy-accesspolicyidentity-iamuser
     */
    readonly iamUser?: CfnAccessPolicy.IamUserProperty | cdk.IResolvable;

    /**
     * The IAM Identity Center user to which this access policy maps.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-accesspolicyidentity.html#cfn-iotsitewise-accesspolicy-accesspolicyidentity-user
     */
    readonly user?: cdk.IResolvable | CfnAccessPolicy.UserProperty;
  }

  /**
   * The `User` property type specifies the AWS IoT SiteWise Monitor user for an [AWS::IoTSiteWise::AccessPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-user.html
   */
  export interface UserProperty {
    /**
     * The ID of the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-user.html#cfn-iotsitewise-accesspolicy-user-id
     */
    readonly id?: string;
  }

  /**
   * Contains information about an AWS Identity and Access Management user.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-iamuser.html
   */
  export interface IamUserProperty {
    /**
     * The ARN of the IAM user. For more information, see [IAM ARNs](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html) in the *IAM User Guide* .
     *
     * > If you delete the IAM user, access policies that contain this identity include an empty `arn` . You can delete the access policy for the IAM user that no longer exists.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-iamuser.html#cfn-iotsitewise-accesspolicy-iamuser-arn
     */
    readonly arn?: string;
  }

  /**
   * Contains information about an AWS Identity and Access Management role.
   *
   * For more information, see [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) in the *IAM User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-iamrole.html
   */
  export interface IamRoleProperty {
    /**
     * The ARN of the IAM role.
     *
     * For more information, see [IAM ARNs](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html) in the *IAM User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-iamrole.html#cfn-iotsitewise-accesspolicy-iamrole-arn
     */
    readonly arn?: string;
  }
}

/**
 * Properties for defining a `CfnAccessPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html
 */
export interface CfnAccessPolicyProps {
  /**
   * The identity for this access policy.
   *
   * Choose an IAM Identity Center user, an IAM Identity Center group, or an IAM user.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html#cfn-iotsitewise-accesspolicy-accesspolicyidentity
   */
  readonly accessPolicyIdentity: CfnAccessPolicy.AccessPolicyIdentityProperty | cdk.IResolvable;

  /**
   * The permission level for this access policy.
   *
   * Choose either a `ADMINISTRATOR` or `VIEWER` . Note that a project `ADMINISTRATOR` is also known as a project owner.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html#cfn-iotsitewise-accesspolicy-accesspolicypermission
   */
  readonly accessPolicyPermission: string;

  /**
   * The AWS IoT SiteWise Monitor resource for this access policy.
   *
   * Choose either a portal or a project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html#cfn-iotsitewise-accesspolicy-accesspolicyresource
   */
  readonly accessPolicyResource: CfnAccessPolicy.AccessPolicyResourceProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ProjectProperty`
 *
 * @param properties - the TypeScript properties of a `ProjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPolicyProjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  return errors.wrap("supplied properties not correct for \"ProjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPolicyProjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPolicyProjectPropertyValidator(properties).assertSuccess();
  return {
    "id": cdk.stringToCloudFormation(properties.id)
  };
}

// @ts-ignore TS6133
function CfnAccessPolicyProjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAccessPolicy.ProjectProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicy.ProjectProperty>();
  ret.addPropertyResult("id", "id", (properties.id != null ? cfn_parse.FromCloudFormation.getString(properties.id) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PortalProperty`
 *
 * @param properties - the TypeScript properties of a `PortalProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPolicyPortalPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  return errors.wrap("supplied properties not correct for \"PortalProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPolicyPortalPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPolicyPortalPropertyValidator(properties).assertSuccess();
  return {
    "id": cdk.stringToCloudFormation(properties.id)
  };
}

// @ts-ignore TS6133
function CfnAccessPolicyPortalPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAccessPolicy.PortalProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicy.PortalProperty>();
  ret.addPropertyResult("id", "id", (properties.id != null ? cfn_parse.FromCloudFormation.getString(properties.id) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessPolicyResourceProperty`
 *
 * @param properties - the TypeScript properties of a `AccessPolicyResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPolicyAccessPolicyResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("portal", CfnAccessPolicyPortalPropertyValidator)(properties.portal));
  errors.collect(cdk.propertyValidator("project", CfnAccessPolicyProjectPropertyValidator)(properties.project));
  return errors.wrap("supplied properties not correct for \"AccessPolicyResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPolicyAccessPolicyResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPolicyAccessPolicyResourcePropertyValidator(properties).assertSuccess();
  return {
    "Portal": convertCfnAccessPolicyPortalPropertyToCloudFormation(properties.portal),
    "Project": convertCfnAccessPolicyProjectPropertyToCloudFormation(properties.project)
  };
}

// @ts-ignore TS6133
function CfnAccessPolicyAccessPolicyResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPolicy.AccessPolicyResourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicy.AccessPolicyResourceProperty>();
  ret.addPropertyResult("portal", "Portal", (properties.Portal != null ? CfnAccessPolicyPortalPropertyFromCloudFormation(properties.Portal) : undefined));
  ret.addPropertyResult("project", "Project", (properties.Project != null ? CfnAccessPolicyProjectPropertyFromCloudFormation(properties.Project) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UserProperty`
 *
 * @param properties - the TypeScript properties of a `UserProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPolicyUserPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  return errors.wrap("supplied properties not correct for \"UserProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPolicyUserPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPolicyUserPropertyValidator(properties).assertSuccess();
  return {
    "id": cdk.stringToCloudFormation(properties.id)
  };
}

// @ts-ignore TS6133
function CfnAccessPolicyUserPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAccessPolicy.UserProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicy.UserProperty>();
  ret.addPropertyResult("id", "id", (properties.id != null ? cfn_parse.FromCloudFormation.getString(properties.id) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IamUserProperty`
 *
 * @param properties - the TypeScript properties of a `IamUserProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPolicyIamUserPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  return errors.wrap("supplied properties not correct for \"IamUserProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPolicyIamUserPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPolicyIamUserPropertyValidator(properties).assertSuccess();
  return {
    "arn": cdk.stringToCloudFormation(properties.arn)
  };
}

// @ts-ignore TS6133
function CfnAccessPolicyIamUserPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPolicy.IamUserProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicy.IamUserProperty>();
  ret.addPropertyResult("arn", "arn", (properties.arn != null ? cfn_parse.FromCloudFormation.getString(properties.arn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IamRoleProperty`
 *
 * @param properties - the TypeScript properties of a `IamRoleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPolicyIamRolePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  return errors.wrap("supplied properties not correct for \"IamRoleProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPolicyIamRolePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPolicyIamRolePropertyValidator(properties).assertSuccess();
  return {
    "arn": cdk.stringToCloudFormation(properties.arn)
  };
}

// @ts-ignore TS6133
function CfnAccessPolicyIamRolePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPolicy.IamRoleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicy.IamRoleProperty>();
  ret.addPropertyResult("arn", "arn", (properties.arn != null ? cfn_parse.FromCloudFormation.getString(properties.arn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessPolicyIdentityProperty`
 *
 * @param properties - the TypeScript properties of a `AccessPolicyIdentityProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPolicyAccessPolicyIdentityPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("iamRole", CfnAccessPolicyIamRolePropertyValidator)(properties.iamRole));
  errors.collect(cdk.propertyValidator("iamUser", CfnAccessPolicyIamUserPropertyValidator)(properties.iamUser));
  errors.collect(cdk.propertyValidator("user", CfnAccessPolicyUserPropertyValidator)(properties.user));
  return errors.wrap("supplied properties not correct for \"AccessPolicyIdentityProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPolicyAccessPolicyIdentityPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPolicyAccessPolicyIdentityPropertyValidator(properties).assertSuccess();
  return {
    "IamRole": convertCfnAccessPolicyIamRolePropertyToCloudFormation(properties.iamRole),
    "IamUser": convertCfnAccessPolicyIamUserPropertyToCloudFormation(properties.iamUser),
    "User": convertCfnAccessPolicyUserPropertyToCloudFormation(properties.user)
  };
}

// @ts-ignore TS6133
function CfnAccessPolicyAccessPolicyIdentityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPolicy.AccessPolicyIdentityProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicy.AccessPolicyIdentityProperty>();
  ret.addPropertyResult("iamRole", "IamRole", (properties.IamRole != null ? CfnAccessPolicyIamRolePropertyFromCloudFormation(properties.IamRole) : undefined));
  ret.addPropertyResult("iamUser", "IamUser", (properties.IamUser != null ? CfnAccessPolicyIamUserPropertyFromCloudFormation(properties.IamUser) : undefined));
  ret.addPropertyResult("user", "User", (properties.User != null ? CfnAccessPolicyUserPropertyFromCloudFormation(properties.User) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAccessPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessPolicyIdentity", cdk.requiredValidator)(properties.accessPolicyIdentity));
  errors.collect(cdk.propertyValidator("accessPolicyIdentity", CfnAccessPolicyAccessPolicyIdentityPropertyValidator)(properties.accessPolicyIdentity));
  errors.collect(cdk.propertyValidator("accessPolicyPermission", cdk.requiredValidator)(properties.accessPolicyPermission));
  errors.collect(cdk.propertyValidator("accessPolicyPermission", cdk.validateString)(properties.accessPolicyPermission));
  errors.collect(cdk.propertyValidator("accessPolicyResource", cdk.requiredValidator)(properties.accessPolicyResource));
  errors.collect(cdk.propertyValidator("accessPolicyResource", CfnAccessPolicyAccessPolicyResourcePropertyValidator)(properties.accessPolicyResource));
  return errors.wrap("supplied properties not correct for \"CfnAccessPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnAccessPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPolicyPropsValidator(properties).assertSuccess();
  return {
    "AccessPolicyIdentity": convertCfnAccessPolicyAccessPolicyIdentityPropertyToCloudFormation(properties.accessPolicyIdentity),
    "AccessPolicyPermission": cdk.stringToCloudFormation(properties.accessPolicyPermission),
    "AccessPolicyResource": convertCfnAccessPolicyAccessPolicyResourcePropertyToCloudFormation(properties.accessPolicyResource)
  };
}

// @ts-ignore TS6133
function CfnAccessPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicyProps>();
  ret.addPropertyResult("accessPolicyIdentity", "AccessPolicyIdentity", (properties.AccessPolicyIdentity != null ? CfnAccessPolicyAccessPolicyIdentityPropertyFromCloudFormation(properties.AccessPolicyIdentity) : undefined));
  ret.addPropertyResult("accessPolicyPermission", "AccessPolicyPermission", (properties.AccessPolicyPermission != null ? cfn_parse.FromCloudFormation.getString(properties.AccessPolicyPermission) : undefined));
  ret.addPropertyResult("accessPolicyResource", "AccessPolicyResource", (properties.AccessPolicyResource != null ? CfnAccessPolicyAccessPolicyResourcePropertyFromCloudFormation(properties.AccessPolicyResource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an asset from an existing asset model.
 *
 * For more information, see [Creating assets](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/create-assets.html) in the *AWS IoT SiteWise User Guide* .
 *
 * @cloudformationResource AWS::IoTSiteWise::Asset
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html
 */
export class CfnAsset extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTSiteWise::Asset";

  /**
   * Build a CfnAsset from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAsset {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAssetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAsset(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the asset.
   *
   * @cloudformationAttribute AssetArn
   */
  public readonly attrAssetArn: string;

  /**
   * The ID of the asset.
   *
   * @cloudformationAttribute AssetId
   */
  public readonly attrAssetId: string;

  /**
   * A description for the asset.
   */
  public assetDescription?: string;

  /**
   * A list of asset hierarchies that each contain a `hierarchyLogicalId` .
   */
  public assetHierarchies?: Array<CfnAsset.AssetHierarchyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The ID of the asset model from which to create the asset.
   */
  public assetModelId: string;

  /**
   * A unique, friendly name for the asset.
   */
  public assetName: string;

  /**
   * The list of asset properties for the asset.
   */
  public assetProperties?: Array<CfnAsset.AssetPropertyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of key-value pairs that contain metadata for the asset.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAssetProps) {
    super(scope, id, {
      "type": CfnAsset.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "assetModelId", this);
    cdk.requireProperty(props, "assetName", this);

    this.attrAssetArn = cdk.Token.asString(this.getAtt("AssetArn", cdk.ResolutionTypeHint.STRING));
    this.attrAssetId = cdk.Token.asString(this.getAtt("AssetId", cdk.ResolutionTypeHint.STRING));
    this.assetDescription = props.assetDescription;
    this.assetHierarchies = props.assetHierarchies;
    this.assetModelId = props.assetModelId;
    this.assetName = props.assetName;
    this.assetProperties = props.assetProperties;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTSiteWise::Asset", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "assetDescription": this.assetDescription,
      "assetHierarchies": this.assetHierarchies,
      "assetModelId": this.assetModelId,
      "assetName": this.assetName,
      "assetProperties": this.assetProperties,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAsset.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAssetPropsToCloudFormation(props);
  }
}

export namespace CfnAsset {
  /**
   * Contains asset property information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assetproperty.html
   */
  export interface AssetPropertyProperty {
    /**
     * The property alias that identifies the property, such as an OPC-UA server data stream path (for example, `/company/windfarm/3/turbine/7/temperature` ).
     *
     * For more information, see [Mapping industrial data streams to asset properties](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/connect-data-streams.html) in the *AWS IoT SiteWise User Guide* .
     *
     * The property alias must have 1-1000 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assetproperty.html#cfn-iotsitewise-asset-assetproperty-alias
     */
    readonly alias?: string;

    /**
     * The `LogicalID` of the asset property.
     *
     * The maximum length is 256 characters, with the pattern `[^\u0000-\u001F\u007F]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assetproperty.html#cfn-iotsitewise-asset-assetproperty-logicalid
     */
    readonly logicalId: string;

    /**
     * The MQTT notification state ( `ENABLED` or `DISABLED` ) for this asset property.
     *
     * When the notification state is `ENABLED` , AWS IoT SiteWise publishes property value updates to a unique MQTT topic. For more information, see [Interacting with other services](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/interact-with-other-services.html) in the *AWS IoT SiteWise User Guide* .
     *
     * If you omit this parameter, the notification state is set to `DISABLED` .
     *
     * > You must use all caps for the NotificationState parameter. If you use lower case letters, you will receive a schema validation error.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assetproperty.html#cfn-iotsitewise-asset-assetproperty-notificationstate
     */
    readonly notificationState?: string;

    /**
     * The unit (such as `Newtons` or `RPM` ) of the asset property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assetproperty.html#cfn-iotsitewise-asset-assetproperty-unit
     */
    readonly unit?: string;
  }

  /**
   * Describes an asset hierarchy that contains a `childAssetId` and `hierarchyLogicalId` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assethierarchy.html
   */
  export interface AssetHierarchyProperty {
    /**
     * The Id of the child asset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assethierarchy.html#cfn-iotsitewise-asset-assethierarchy-childassetid
     */
    readonly childAssetId: string;

    /**
     * The `LogicalID` of the hierarchy. This ID is a `hierarchyLogicalId` .
     *
     * The maximum length is 256 characters, with the pattern `[^\u0000-\u001F\u007F]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assethierarchy.html#cfn-iotsitewise-asset-assethierarchy-logicalid
     */
    readonly logicalId: string;
  }
}

/**
 * Properties for defining a `CfnAsset`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html
 */
export interface CfnAssetProps {
  /**
   * A description for the asset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-assetdescription
   */
  readonly assetDescription?: string;

  /**
   * A list of asset hierarchies that each contain a `hierarchyLogicalId` .
   *
   * A hierarchy specifies allowed parent/child asset relationships.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-assethierarchies
   */
  readonly assetHierarchies?: Array<CfnAsset.AssetHierarchyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The ID of the asset model from which to create the asset.
   *
   * This can be either the actual ID in UUID format, or else `externalId:` followed by the external ID, if it has one. For more information, see [Referencing objects with external IDs](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/object-ids.html#external-id-references) in the *AWS IoT SiteWise User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-assetmodelid
   */
  readonly assetModelId: string;

  /**
   * A unique, friendly name for the asset.
   *
   * The maximum length is 256 characters with the pattern `[^\u0000-\u001F\u007F]+` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-assetname
   */
  readonly assetName: string;

  /**
   * The list of asset properties for the asset.
   *
   * This object doesn't include properties that you define in composite models. You can find composite model properties in the `assetCompositeModels` object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-assetproperties
   */
  readonly assetProperties?: Array<CfnAsset.AssetPropertyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A list of key-value pairs that contain metadata for the asset.
   *
   * For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AssetPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `AssetPropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetAssetPropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alias", cdk.validateString)(properties.alias));
  errors.collect(cdk.propertyValidator("logicalId", cdk.requiredValidator)(properties.logicalId));
  errors.collect(cdk.propertyValidator("logicalId", cdk.validateString)(properties.logicalId));
  errors.collect(cdk.propertyValidator("notificationState", cdk.validateString)(properties.notificationState));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  return errors.wrap("supplied properties not correct for \"AssetPropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssetAssetPropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetAssetPropertyPropertyValidator(properties).assertSuccess();
  return {
    "Alias": cdk.stringToCloudFormation(properties.alias),
    "LogicalId": cdk.stringToCloudFormation(properties.logicalId),
    "NotificationState": cdk.stringToCloudFormation(properties.notificationState),
    "Unit": cdk.stringToCloudFormation(properties.unit)
  };
}

// @ts-ignore TS6133
function CfnAssetAssetPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAsset.AssetPropertyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAsset.AssetPropertyProperty>();
  ret.addPropertyResult("alias", "Alias", (properties.Alias != null ? cfn_parse.FromCloudFormation.getString(properties.Alias) : undefined));
  ret.addPropertyResult("logicalId", "LogicalId", (properties.LogicalId != null ? cfn_parse.FromCloudFormation.getString(properties.LogicalId) : undefined));
  ret.addPropertyResult("notificationState", "NotificationState", (properties.NotificationState != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationState) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AssetHierarchyProperty`
 *
 * @param properties - the TypeScript properties of a `AssetHierarchyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetAssetHierarchyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("childAssetId", cdk.requiredValidator)(properties.childAssetId));
  errors.collect(cdk.propertyValidator("childAssetId", cdk.validateString)(properties.childAssetId));
  errors.collect(cdk.propertyValidator("logicalId", cdk.requiredValidator)(properties.logicalId));
  errors.collect(cdk.propertyValidator("logicalId", cdk.validateString)(properties.logicalId));
  return errors.wrap("supplied properties not correct for \"AssetHierarchyProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssetAssetHierarchyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetAssetHierarchyPropertyValidator(properties).assertSuccess();
  return {
    "ChildAssetId": cdk.stringToCloudFormation(properties.childAssetId),
    "LogicalId": cdk.stringToCloudFormation(properties.logicalId)
  };
}

// @ts-ignore TS6133
function CfnAssetAssetHierarchyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAsset.AssetHierarchyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAsset.AssetHierarchyProperty>();
  ret.addPropertyResult("childAssetId", "ChildAssetId", (properties.ChildAssetId != null ? cfn_parse.FromCloudFormation.getString(properties.ChildAssetId) : undefined));
  ret.addPropertyResult("logicalId", "LogicalId", (properties.LogicalId != null ? cfn_parse.FromCloudFormation.getString(properties.LogicalId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAssetProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assetDescription", cdk.validateString)(properties.assetDescription));
  errors.collect(cdk.propertyValidator("assetHierarchies", cdk.listValidator(CfnAssetAssetHierarchyPropertyValidator))(properties.assetHierarchies));
  errors.collect(cdk.propertyValidator("assetModelId", cdk.requiredValidator)(properties.assetModelId));
  errors.collect(cdk.propertyValidator("assetModelId", cdk.validateString)(properties.assetModelId));
  errors.collect(cdk.propertyValidator("assetName", cdk.requiredValidator)(properties.assetName));
  errors.collect(cdk.propertyValidator("assetName", cdk.validateString)(properties.assetName));
  errors.collect(cdk.propertyValidator("assetProperties", cdk.listValidator(CfnAssetAssetPropertyPropertyValidator))(properties.assetProperties));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAssetProps\"");
}

// @ts-ignore TS6133
function convertCfnAssetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetPropsValidator(properties).assertSuccess();
  return {
    "AssetDescription": cdk.stringToCloudFormation(properties.assetDescription),
    "AssetHierarchies": cdk.listMapper(convertCfnAssetAssetHierarchyPropertyToCloudFormation)(properties.assetHierarchies),
    "AssetModelId": cdk.stringToCloudFormation(properties.assetModelId),
    "AssetName": cdk.stringToCloudFormation(properties.assetName),
    "AssetProperties": cdk.listMapper(convertCfnAssetAssetPropertyPropertyToCloudFormation)(properties.assetProperties),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAssetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetProps>();
  ret.addPropertyResult("assetDescription", "AssetDescription", (properties.AssetDescription != null ? cfn_parse.FromCloudFormation.getString(properties.AssetDescription) : undefined));
  ret.addPropertyResult("assetHierarchies", "AssetHierarchies", (properties.AssetHierarchies != null ? cfn_parse.FromCloudFormation.getArray(CfnAssetAssetHierarchyPropertyFromCloudFormation)(properties.AssetHierarchies) : undefined));
  ret.addPropertyResult("assetModelId", "AssetModelId", (properties.AssetModelId != null ? cfn_parse.FromCloudFormation.getString(properties.AssetModelId) : undefined));
  ret.addPropertyResult("assetName", "AssetName", (properties.AssetName != null ? cfn_parse.FromCloudFormation.getString(properties.AssetName) : undefined));
  ret.addPropertyResult("assetProperties", "AssetProperties", (properties.AssetProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnAssetAssetPropertyPropertyFromCloudFormation)(properties.AssetProperties) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an asset model from specified property and hierarchy definitions.
 *
 * You create assets from asset models. With asset models, you can easily create assets of the same type that have standardized definitions. Each asset created from a model inherits the asset model's property and hierarchy definitions. For more information, see [Defining asset models](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/define-models.html) in the *AWS IoT SiteWise User Guide* .
 *
 * @cloudformationResource AWS::IoTSiteWise::AssetModel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html
 */
export class CfnAssetModel extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTSiteWise::AssetModel";

  /**
   * Build a CfnAssetModel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAssetModel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAssetModelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAssetModel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the asset model, which has the following format.
   *
   * @cloudformationAttribute AssetModelArn
   */
  public readonly attrAssetModelArn: string;

  /**
   * The ID of the asset model.
   *
   * @cloudformationAttribute AssetModelId
   */
  public readonly attrAssetModelId: string;

  /**
   * The composite asset models that are part of this asset model.
   */
  public assetModelCompositeModels?: Array<CfnAssetModel.AssetModelCompositeModelProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A description for the asset model.
   */
  public assetModelDescription?: string;

  /**
   * The hierarchy definitions of the asset model.
   */
  public assetModelHierarchies?: Array<CfnAssetModel.AssetModelHierarchyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A unique, friendly name for the asset model.
   */
  public assetModelName: string;

  /**
   * The property definitions of the asset model.
   */
  public assetModelProperties?: Array<CfnAssetModel.AssetModelPropertyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of key-value pairs that contain metadata for the asset.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAssetModelProps) {
    super(scope, id, {
      "type": CfnAssetModel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "assetModelName", this);

    this.attrAssetModelArn = cdk.Token.asString(this.getAtt("AssetModelArn", cdk.ResolutionTypeHint.STRING));
    this.attrAssetModelId = cdk.Token.asString(this.getAtt("AssetModelId", cdk.ResolutionTypeHint.STRING));
    this.assetModelCompositeModels = props.assetModelCompositeModels;
    this.assetModelDescription = props.assetModelDescription;
    this.assetModelHierarchies = props.assetModelHierarchies;
    this.assetModelName = props.assetModelName;
    this.assetModelProperties = props.assetModelProperties;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTSiteWise::AssetModel", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "assetModelCompositeModels": this.assetModelCompositeModels,
      "assetModelDescription": this.assetModelDescription,
      "assetModelHierarchies": this.assetModelHierarchies,
      "assetModelName": this.assetModelName,
      "assetModelProperties": this.assetModelProperties,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssetModel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAssetModelPropsToCloudFormation(props);
  }
}

export namespace CfnAssetModel {
  /**
   * Contains information about a composite model in an asset model.
   *
   * This object contains the asset property definitions that you define in the composite model. You can use composite asset models to define alarms on this asset model.
   *
   * If you use the `AssetModelCompositeModel` property to create an alarm, you must use the following information to define three asset model properties:
   *
   * - Use an asset model property to specify the alarm type.
   *
   * - The name must be `AWS/ALARM_TYPE` .
   * - The data type must be `STRING` .
   * - For the `Type` property, the type name must be `Attribute` and the default value must be `IOT_EVENTS` .
   * - Use an asset model property to specify the alarm source.
   *
   * - The name must be `AWS/ALARM_SOURCE` .
   * - The data type must be `STRING` .
   * - For the `Type` property, the type name must be `Attribute` and the default value must be the ARN of the alarm model that you created in AWS IoT Events .
   *
   * > For the ARN of the alarm model, you can use the `Fn::Sub` intrinsic function to substitute the `AWS::Partition` , `AWS::Region` , and `AWS::AccountId` variables in an input string with values that you specify.
   * >
   * > For example, `Fn::Sub: "arn:${AWS::Partition}:iotevents:${AWS::Region}:${AWS::AccountId}:alarmModel/TestAlarmModel"` .
   * >
   * > Replace `TestAlarmModel` with the name of your alarm model.
   * >
   * > For more information about using the `Fn::Sub` intrinsic function, see [Fn::Sub](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-sub.html) .
   * - Use an asset model property to specify the state of the alarm.
   *
   * - The name must be `AWS/ALARM_STATE` .
   * - The data type must be `STRUCT` .
   * - The `DataTypeSpec` value must be `AWS/ALARM_STATE` .
   * - For the `Type` property, the type name must be `Measurement` .
   *
   * At the bottom of this page, we provide a YAML example that you can modify to create an alarm.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelcompositemodel.html
   */
  export interface AssetModelCompositeModelProperty {
    /**
     * The asset property definitions for this composite model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelcompositemodel.html#cfn-iotsitewise-assetmodel-assetmodelcompositemodel-compositemodelproperties
     */
    readonly compositeModelProperties?: Array<CfnAssetModel.AssetModelPropertyProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The description of the composite model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelcompositemodel.html#cfn-iotsitewise-assetmodel-assetmodelcompositemodel-description
     */
    readonly description?: string;

    /**
     * The name of the composite model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelcompositemodel.html#cfn-iotsitewise-assetmodel-assetmodelcompositemodel-name
     */
    readonly name: string;

    /**
     * The type of the composite model.
     *
     * For alarm composite models, this type is `AWS/ALARM` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelcompositemodel.html#cfn-iotsitewise-assetmodel-assetmodelcompositemodel-type
     */
    readonly type: string;
  }

  /**
   * Contains information about an asset model property.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelproperty.html
   */
  export interface AssetModelPropertyProperty {
    /**
     * The data type of the asset model property.
     *
     * The value can be `STRING` , `INTEGER` , `DOUBLE` , `BOOLEAN` , or `STRUCT` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelproperty.html#cfn-iotsitewise-assetmodel-assetmodelproperty-datatype
     */
    readonly dataType: string;

    /**
     * The data type of the structure for this property.
     *
     * This parameter exists on properties that have the `STRUCT` data type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelproperty.html#cfn-iotsitewise-assetmodel-assetmodelproperty-datatypespec
     */
    readonly dataTypeSpec?: string;

    /**
     * The `LogicalID` of the asset model property.
     *
     * The maximum length is 256 characters, with the pattern `[^\\u0000-\\u001F\\u007F]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelproperty.html#cfn-iotsitewise-assetmodel-assetmodelproperty-logicalid
     */
    readonly logicalId: string;

    /**
     * The name of the asset model property.
     *
     * The maximum length is 256 characters with the pattern `[^\u0000-\u001F\u007F]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelproperty.html#cfn-iotsitewise-assetmodel-assetmodelproperty-name
     */
    readonly name: string;

    /**
     * Contains a property type, which can be one of `Attribute` , `Measurement` , `Metric` , or `Transform` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelproperty.html#cfn-iotsitewise-assetmodel-assetmodelproperty-type
     */
    readonly type: cdk.IResolvable | CfnAssetModel.PropertyTypeProperty;

    /**
     * The unit of the asset model property, such as `Newtons` or `RPM` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelproperty.html#cfn-iotsitewise-assetmodel-assetmodelproperty-unit
     */
    readonly unit?: string;
  }

  /**
   * Contains a property type, which can be one of `Attribute` , `Measurement` , `Metric` , or `Transform` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-propertytype.html
   */
  export interface PropertyTypeProperty {
    /**
     * Specifies an asset attribute property.
     *
     * An attribute generally contains static information, such as the serial number of an [industrial IoT](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/Internet_of_things#Industrial_applications) wind turbine.
     *
     * This is required if the `TypeName` is `Attribute` and has a `DefaultValue` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-propertytype.html#cfn-iotsitewise-assetmodel-propertytype-attribute
     */
    readonly attribute?: CfnAssetModel.AttributeProperty | cdk.IResolvable;

    /**
     * Specifies an asset metric property.
     *
     * A metric contains a mathematical expression that uses aggregate functions to process all input data points over a time interval and output a single data point, such as to calculate the average hourly temperature.
     *
     * This is required if the `TypeName` is `Metric` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-propertytype.html#cfn-iotsitewise-assetmodel-propertytype-metric
     */
    readonly metric?: cdk.IResolvable | CfnAssetModel.MetricProperty;

    /**
     * Specifies an asset transform property.
     *
     * A transform contains a mathematical expression that maps a property's data points from one form to another, such as a unit conversion from Celsius to Fahrenheit.
     *
     * This is required if the `TypeName` is `Transform` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-propertytype.html#cfn-iotsitewise-assetmodel-propertytype-transform
     */
    readonly transform?: cdk.IResolvable | CfnAssetModel.TransformProperty;

    /**
     * The type of property type, which can be one of `Attribute` , `Measurement` , `Metric` , or `Transform` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-propertytype.html#cfn-iotsitewise-assetmodel-propertytype-typename
     */
    readonly typeName: string;
  }

  /**
   * Contains an asset attribute property.
   *
   * For more information, see [Defining data properties](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/asset-properties.html#attributes) in the *AWS IoT SiteWise User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-attribute.html
   */
  export interface AttributeProperty {
    /**
     * The default value of the asset model property attribute.
     *
     * All assets that you create from the asset model contain this attribute value. You can update an attribute's value after you create an asset. For more information, see [Updating attribute values](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/update-attribute-values.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-attribute.html#cfn-iotsitewise-assetmodel-attribute-defaultvalue
     */
    readonly defaultValue?: string;
  }

  /**
   * Contains an asset metric property.
   *
   * With metrics, you can calculate aggregate functions, such as an average, maximum, or minimum, as specified through an expression. A metric maps several values to a single value (such as a sum).
   *
   * The maximum number of dependent/cascading variables used in any one metric calculation is 10. Therefore, a *root* metric can have up to 10 cascading metrics in its computational dependency tree. Additionally, a metric can only have a data type of `DOUBLE` and consume properties with data types of `INTEGER` or `DOUBLE` .
   *
   * For more information, see [Defining data properties](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/asset-properties.html#metrics) in the *AWS IoT SiteWise User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-metric.html
   */
  export interface MetricProperty {
    /**
     * The mathematical expression that defines the metric aggregation function.
     *
     * You can specify up to 10 variables per expression. You can specify up to 10 functions per expression.
     *
     * For more information, see [Quotas](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/quotas.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-metric.html#cfn-iotsitewise-assetmodel-metric-expression
     */
    readonly expression: string;

    /**
     * The list of variables used in the expression.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-metric.html#cfn-iotsitewise-assetmodel-metric-variables
     */
    readonly variables: Array<CfnAssetModel.ExpressionVariableProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The window (time interval) over which AWS IoT SiteWise computes the metric's aggregation expression.
     *
     * AWS IoT SiteWise computes one data point per `window` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-metric.html#cfn-iotsitewise-assetmodel-metric-window
     */
    readonly window: cdk.IResolvable | CfnAssetModel.MetricWindowProperty;
  }

  /**
   * Contains expression variable information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-expressionvariable.html
   */
  export interface ExpressionVariableProperty {
    /**
     * The friendly name of the variable to be used in the expression.
     *
     * The maximum length is 64 characters with the pattern `^[a-z][a-z0-9_]*$` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-expressionvariable.html#cfn-iotsitewise-assetmodel-expressionvariable-name
     */
    readonly name: string;

    /**
     * The variable that identifies an asset property from which to use values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-expressionvariable.html#cfn-iotsitewise-assetmodel-expressionvariable-value
     */
    readonly value: cdk.IResolvable | CfnAssetModel.VariableValueProperty;
  }

  /**
   * Identifies a property value used in an expression.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-variablevalue.html
   */
  export interface VariableValueProperty {
    /**
     * The `LogicalID` of the hierarchy to query for the `PropertyLogicalID` .
     *
     * You use a `hierarchyLogicalID` instead of a model ID because you can have several hierarchies using the same model and therefore the same property. For example, you might have separately grouped assets that come from the same asset model. For more information, see [Defining relationships between assets](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/asset-hierarchies.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-variablevalue.html#cfn-iotsitewise-assetmodel-variablevalue-hierarchylogicalid
     */
    readonly hierarchyLogicalId?: string;

    /**
     * The `LogicalID` of the property to use as the variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-variablevalue.html#cfn-iotsitewise-assetmodel-variablevalue-propertylogicalid
     */
    readonly propertyLogicalId: string;
  }

  /**
   * Contains a time interval window used for data aggregate computations (for example, average, sum, count, and so on).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-metricwindow.html
   */
  export interface MetricWindowProperty {
    /**
     * The tumbling time interval window.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-metricwindow.html#cfn-iotsitewise-assetmodel-metricwindow-tumbling
     */
    readonly tumbling?: cdk.IResolvable | CfnAssetModel.TumblingWindowProperty;
  }

  /**
   * Contains a tumbling window, which is a repeating fixed-sized, non-overlapping, and contiguous time window.
   *
   * You can use this window in metrics to aggregate data from properties and other assets.
   *
   * You can use `m` , `h` , `d` , and `w` when you specify an interval or offset. Note that `m` represents minutes, `h` represents hours, `d` represents days, and `w` represents weeks. You can also use `s` to represent seconds in `offset` .
   *
   * The `interval` and `offset` parameters support the [ISO 8601 format](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/ISO_8601) . For example, `PT5S` represents 5 seconds, `PT5M` represents 5 minutes, and `PT5H` represents 5 hours.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-tumblingwindow.html
   */
  export interface TumblingWindowProperty {
    /**
     * The time interval for the tumbling window. The interval time must be between 1 minute and 1 week.
     *
     * AWS IoT SiteWise computes the `1w` interval the end of Sunday at midnight each week (UTC), the `1d` interval at the end of each day at midnight (UTC), the `1h` interval at the end of each hour, and so on.
     *
     * When AWS IoT SiteWise aggregates data points for metric computations, the start of each interval is exclusive and the end of each interval is inclusive. AWS IoT SiteWise places the computed data point at the end of the interval.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-tumblingwindow.html#cfn-iotsitewise-assetmodel-tumblingwindow-interval
     */
    readonly interval: string;

    /**
     * The offset for the tumbling window. The `offset` parameter accepts the following:.
     *
     * - The offset time.
     *
     * For example, if you specify `18h` for `offset` and `1d` for `interval` , AWS IoT SiteWise aggregates data in one of the following ways:
     *
     * - If you create the metric before or at 6 PM (UTC), you get the first aggregation result at 6 PM (UTC) on the day when you create the metric.
     * - If you create the metric after 6 PM (UTC), you get the first aggregation result at 6 PM (UTC) the next day.
     * - The ISO 8601 format.
     *
     * For example, if you specify `PT18H` for `offset` and `1d` for `interval` , AWS IoT SiteWise aggregates data in one of the following ways:
     *
     * - If you create the metric before or at 6 PM (UTC), you get the first aggregation result at 6 PM (UTC) on the day when you create the metric.
     * - If you create the metric after 6 PM (UTC), you get the first aggregation result at 6 PM (UTC) the next day.
     * - The 24-hour clock.
     *
     * For example, if you specify `00:03:00` for `offset` , `5m` for `interval` , and you create the metric at 2 PM (UTC), you get the first aggregation result at 2:03 PM (UTC). You get the second aggregation result at 2:08 PM (UTC).
     * - The offset time zone.
     *
     * For example, if you specify `2021-07-23T18:00-08` for `offset` and `1d` for `interval` , AWS IoT SiteWise aggregates data in one of the following ways:
     *
     * - If you create the metric before or at 6 PM (PST), you get the first aggregation result at 6 PM (PST) on the day when you create the metric.
     * - If you create the metric after 6 PM (PST), you get the first aggregation result at 6 PM (PST) the next day.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-tumblingwindow.html#cfn-iotsitewise-assetmodel-tumblingwindow-offset
     */
    readonly offset?: string;
  }

  /**
   * Contains an asset transform property.
   *
   * A transform is a one-to-one mapping of a property's data points from one form to another. For example, you can use a transform to convert a Celsius data stream to Fahrenheit by applying the transformation expression to each data point of the Celsius stream. Transforms can only input properties that are `INTEGER` , `DOUBLE` , or `BOOLEAN` type. Booleans convert to `0` ( `FALSE` ) and `1` ( `TRUE` )..
   *
   * For more information, see [Defining data properties](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/asset-properties.html#transforms) in the *AWS IoT SiteWise User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-transform.html
   */
  export interface TransformProperty {
    /**
     * The mathematical expression that defines the transformation function.
     *
     * You can specify up to 10 variables per expression. You can specify up to 10 functions per expression.
     *
     * For more information, see [Quotas](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/quotas.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-transform.html#cfn-iotsitewise-assetmodel-transform-expression
     */
    readonly expression: string;

    /**
     * The list of variables used in the expression.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-transform.html#cfn-iotsitewise-assetmodel-transform-variables
     */
    readonly variables: Array<CfnAssetModel.ExpressionVariableProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Describes an asset hierarchy that contains a hierarchy's name, `LogicalID` , and child asset model ID that specifies the type of asset that can be in this hierarchy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelhierarchy.html
   */
  export interface AssetModelHierarchyProperty {
    /**
     * The Id of the asset model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelhierarchy.html#cfn-iotsitewise-assetmodel-assetmodelhierarchy-childassetmodelid
     */
    readonly childAssetModelId: string;

    /**
     * The `LogicalID` of the asset model hierarchy. This ID is a `hierarchyLogicalId` .
     *
     * The maximum length is 256 characters, with the pattern `[^\u0000-\u001F\u007F]+`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelhierarchy.html#cfn-iotsitewise-assetmodel-assetmodelhierarchy-logicalid
     */
    readonly logicalId: string;

    /**
     * The name of the asset model hierarchy.
     *
     * The maximum length is 256 characters with the pattern `[^\u0000-\u001F\u007F]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelhierarchy.html#cfn-iotsitewise-assetmodel-assetmodelhierarchy-name
     */
    readonly name: string;
  }
}

/**
 * Properties for defining a `CfnAssetModel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html
 */
export interface CfnAssetModelProps {
  /**
   * The composite asset models that are part of this asset model.
   *
   * Composite asset models are asset models that contain specific properties. Each composite model has a type that defines the properties that the composite model supports. You can use composite asset models to define alarms on this asset model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-assetmodelcompositemodels
   */
  readonly assetModelCompositeModels?: Array<CfnAssetModel.AssetModelCompositeModelProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A description for the asset model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-assetmodeldescription
   */
  readonly assetModelDescription?: string;

  /**
   * The hierarchy definitions of the asset model.
   *
   * Each hierarchy specifies an asset model whose assets can be children of any other assets created from this asset model. For more information, see [Defining relationships between assets](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/asset-hierarchies.html) in the *AWS IoT SiteWise User Guide* .
   *
   * You can specify up to 10 hierarchies per asset model. For more information, see [Quotas](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/quotas.html) in the *AWS IoT SiteWise User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-assetmodelhierarchies
   */
  readonly assetModelHierarchies?: Array<CfnAssetModel.AssetModelHierarchyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A unique, friendly name for the asset model.
   *
   * The maximum length is 256 characters with the pattern `[^\u0000-\u001F\u007F]+` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-assetmodelname
   */
  readonly assetModelName: string;

  /**
   * The property definitions of the asset model.
   *
   * For more information, see [Defining data properties](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/asset-properties.html) in the *AWS IoT SiteWise User Guide* .
   *
   * You can specify up to 200 properties per asset model. For more information, see [Quotas](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/quotas.html) in the *AWS IoT SiteWise User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-assetmodelproperties
   */
  readonly assetModelProperties?: Array<CfnAssetModel.AssetModelPropertyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A list of key-value pairs that contain metadata for the asset.
   *
   * For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-tags
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
function CfnAssetModelAttributePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultValue", cdk.validateString)(properties.defaultValue));
  return errors.wrap("supplied properties not correct for \"AttributeProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssetModelAttributePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetModelAttributePropertyValidator(properties).assertSuccess();
  return {
    "DefaultValue": cdk.stringToCloudFormation(properties.defaultValue)
  };
}

// @ts-ignore TS6133
function CfnAssetModelAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.AttributeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.AttributeProperty>();
  ret.addPropertyResult("defaultValue", "DefaultValue", (properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VariableValueProperty`
 *
 * @param properties - the TypeScript properties of a `VariableValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetModelVariableValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hierarchyLogicalId", cdk.validateString)(properties.hierarchyLogicalId));
  errors.collect(cdk.propertyValidator("propertyLogicalId", cdk.requiredValidator)(properties.propertyLogicalId));
  errors.collect(cdk.propertyValidator("propertyLogicalId", cdk.validateString)(properties.propertyLogicalId));
  return errors.wrap("supplied properties not correct for \"VariableValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssetModelVariableValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetModelVariableValuePropertyValidator(properties).assertSuccess();
  return {
    "HierarchyLogicalId": cdk.stringToCloudFormation(properties.hierarchyLogicalId),
    "PropertyLogicalId": cdk.stringToCloudFormation(properties.propertyLogicalId)
  };
}

// @ts-ignore TS6133
function CfnAssetModelVariableValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAssetModel.VariableValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.VariableValueProperty>();
  ret.addPropertyResult("hierarchyLogicalId", "HierarchyLogicalId", (properties.HierarchyLogicalId != null ? cfn_parse.FromCloudFormation.getString(properties.HierarchyLogicalId) : undefined));
  ret.addPropertyResult("propertyLogicalId", "PropertyLogicalId", (properties.PropertyLogicalId != null ? cfn_parse.FromCloudFormation.getString(properties.PropertyLogicalId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExpressionVariableProperty`
 *
 * @param properties - the TypeScript properties of a `ExpressionVariableProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetModelExpressionVariablePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", CfnAssetModelVariableValuePropertyValidator)(properties.value));
  return errors.wrap("supplied properties not correct for \"ExpressionVariableProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssetModelExpressionVariablePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetModelExpressionVariablePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": convertCfnAssetModelVariableValuePropertyToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnAssetModelExpressionVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.ExpressionVariableProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.ExpressionVariableProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? CfnAssetModelVariableValuePropertyFromCloudFormation(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TumblingWindowProperty`
 *
 * @param properties - the TypeScript properties of a `TumblingWindowProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetModelTumblingWindowPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("interval", cdk.requiredValidator)(properties.interval));
  errors.collect(cdk.propertyValidator("interval", cdk.validateString)(properties.interval));
  errors.collect(cdk.propertyValidator("offset", cdk.validateString)(properties.offset));
  return errors.wrap("supplied properties not correct for \"TumblingWindowProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssetModelTumblingWindowPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetModelTumblingWindowPropertyValidator(properties).assertSuccess();
  return {
    "Interval": cdk.stringToCloudFormation(properties.interval),
    "Offset": cdk.stringToCloudFormation(properties.offset)
  };
}

// @ts-ignore TS6133
function CfnAssetModelTumblingWindowPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAssetModel.TumblingWindowProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.TumblingWindowProperty>();
  ret.addPropertyResult("interval", "Interval", (properties.Interval != null ? cfn_parse.FromCloudFormation.getString(properties.Interval) : undefined));
  ret.addPropertyResult("offset", "Offset", (properties.Offset != null ? cfn_parse.FromCloudFormation.getString(properties.Offset) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricWindowProperty`
 *
 * @param properties - the TypeScript properties of a `MetricWindowProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetModelMetricWindowPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("tumbling", CfnAssetModelTumblingWindowPropertyValidator)(properties.tumbling));
  return errors.wrap("supplied properties not correct for \"MetricWindowProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssetModelMetricWindowPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetModelMetricWindowPropertyValidator(properties).assertSuccess();
  return {
    "Tumbling": convertCfnAssetModelTumblingWindowPropertyToCloudFormation(properties.tumbling)
  };
}

// @ts-ignore TS6133
function CfnAssetModelMetricWindowPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAssetModel.MetricWindowProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.MetricWindowProperty>();
  ret.addPropertyResult("tumbling", "Tumbling", (properties.Tumbling != null ? CfnAssetModelTumblingWindowPropertyFromCloudFormation(properties.Tumbling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricProperty`
 *
 * @param properties - the TypeScript properties of a `MetricProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetModelMetricPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("expression", cdk.requiredValidator)(properties.expression));
  errors.collect(cdk.propertyValidator("expression", cdk.validateString)(properties.expression));
  errors.collect(cdk.propertyValidator("variables", cdk.requiredValidator)(properties.variables));
  errors.collect(cdk.propertyValidator("variables", cdk.listValidator(CfnAssetModelExpressionVariablePropertyValidator))(properties.variables));
  errors.collect(cdk.propertyValidator("window", cdk.requiredValidator)(properties.window));
  errors.collect(cdk.propertyValidator("window", CfnAssetModelMetricWindowPropertyValidator)(properties.window));
  return errors.wrap("supplied properties not correct for \"MetricProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssetModelMetricPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetModelMetricPropertyValidator(properties).assertSuccess();
  return {
    "Expression": cdk.stringToCloudFormation(properties.expression),
    "Variables": cdk.listMapper(convertCfnAssetModelExpressionVariablePropertyToCloudFormation)(properties.variables),
    "Window": convertCfnAssetModelMetricWindowPropertyToCloudFormation(properties.window)
  };
}

// @ts-ignore TS6133
function CfnAssetModelMetricPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAssetModel.MetricProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.MetricProperty>();
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined));
  ret.addPropertyResult("variables", "Variables", (properties.Variables != null ? cfn_parse.FromCloudFormation.getArray(CfnAssetModelExpressionVariablePropertyFromCloudFormation)(properties.Variables) : undefined));
  ret.addPropertyResult("window", "Window", (properties.Window != null ? CfnAssetModelMetricWindowPropertyFromCloudFormation(properties.Window) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TransformProperty`
 *
 * @param properties - the TypeScript properties of a `TransformProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetModelTransformPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("expression", cdk.requiredValidator)(properties.expression));
  errors.collect(cdk.propertyValidator("expression", cdk.validateString)(properties.expression));
  errors.collect(cdk.propertyValidator("variables", cdk.requiredValidator)(properties.variables));
  errors.collect(cdk.propertyValidator("variables", cdk.listValidator(CfnAssetModelExpressionVariablePropertyValidator))(properties.variables));
  return errors.wrap("supplied properties not correct for \"TransformProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssetModelTransformPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetModelTransformPropertyValidator(properties).assertSuccess();
  return {
    "Expression": cdk.stringToCloudFormation(properties.expression),
    "Variables": cdk.listMapper(convertCfnAssetModelExpressionVariablePropertyToCloudFormation)(properties.variables)
  };
}

// @ts-ignore TS6133
function CfnAssetModelTransformPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAssetModel.TransformProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.TransformProperty>();
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined));
  ret.addPropertyResult("variables", "Variables", (properties.Variables != null ? cfn_parse.FromCloudFormation.getArray(CfnAssetModelExpressionVariablePropertyFromCloudFormation)(properties.Variables) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PropertyTypeProperty`
 *
 * @param properties - the TypeScript properties of a `PropertyTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetModelPropertyTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attribute", CfnAssetModelAttributePropertyValidator)(properties.attribute));
  errors.collect(cdk.propertyValidator("metric", CfnAssetModelMetricPropertyValidator)(properties.metric));
  errors.collect(cdk.propertyValidator("transform", CfnAssetModelTransformPropertyValidator)(properties.transform));
  errors.collect(cdk.propertyValidator("typeName", cdk.requiredValidator)(properties.typeName));
  errors.collect(cdk.propertyValidator("typeName", cdk.validateString)(properties.typeName));
  return errors.wrap("supplied properties not correct for \"PropertyTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssetModelPropertyTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetModelPropertyTypePropertyValidator(properties).assertSuccess();
  return {
    "Attribute": convertCfnAssetModelAttributePropertyToCloudFormation(properties.attribute),
    "Metric": convertCfnAssetModelMetricPropertyToCloudFormation(properties.metric),
    "Transform": convertCfnAssetModelTransformPropertyToCloudFormation(properties.transform),
    "TypeName": cdk.stringToCloudFormation(properties.typeName)
  };
}

// @ts-ignore TS6133
function CfnAssetModelPropertyTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAssetModel.PropertyTypeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.PropertyTypeProperty>();
  ret.addPropertyResult("attribute", "Attribute", (properties.Attribute != null ? CfnAssetModelAttributePropertyFromCloudFormation(properties.Attribute) : undefined));
  ret.addPropertyResult("metric", "Metric", (properties.Metric != null ? CfnAssetModelMetricPropertyFromCloudFormation(properties.Metric) : undefined));
  ret.addPropertyResult("transform", "Transform", (properties.Transform != null ? CfnAssetModelTransformPropertyFromCloudFormation(properties.Transform) : undefined));
  ret.addPropertyResult("typeName", "TypeName", (properties.TypeName != null ? cfn_parse.FromCloudFormation.getString(properties.TypeName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AssetModelPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `AssetModelPropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetModelAssetModelPropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataType", cdk.requiredValidator)(properties.dataType));
  errors.collect(cdk.propertyValidator("dataType", cdk.validateString)(properties.dataType));
  errors.collect(cdk.propertyValidator("dataTypeSpec", cdk.validateString)(properties.dataTypeSpec));
  errors.collect(cdk.propertyValidator("logicalId", cdk.requiredValidator)(properties.logicalId));
  errors.collect(cdk.propertyValidator("logicalId", cdk.validateString)(properties.logicalId));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", CfnAssetModelPropertyTypePropertyValidator)(properties.type));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  return errors.wrap("supplied properties not correct for \"AssetModelPropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssetModelAssetModelPropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetModelAssetModelPropertyPropertyValidator(properties).assertSuccess();
  return {
    "DataType": cdk.stringToCloudFormation(properties.dataType),
    "DataTypeSpec": cdk.stringToCloudFormation(properties.dataTypeSpec),
    "LogicalId": cdk.stringToCloudFormation(properties.logicalId),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Type": convertCfnAssetModelPropertyTypePropertyToCloudFormation(properties.type),
    "Unit": cdk.stringToCloudFormation(properties.unit)
  };
}

// @ts-ignore TS6133
function CfnAssetModelAssetModelPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.AssetModelPropertyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.AssetModelPropertyProperty>();
  ret.addPropertyResult("dataType", "DataType", (properties.DataType != null ? cfn_parse.FromCloudFormation.getString(properties.DataType) : undefined));
  ret.addPropertyResult("dataTypeSpec", "DataTypeSpec", (properties.DataTypeSpec != null ? cfn_parse.FromCloudFormation.getString(properties.DataTypeSpec) : undefined));
  ret.addPropertyResult("logicalId", "LogicalId", (properties.LogicalId != null ? cfn_parse.FromCloudFormation.getString(properties.LogicalId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? CfnAssetModelPropertyTypePropertyFromCloudFormation(properties.Type) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AssetModelCompositeModelProperty`
 *
 * @param properties - the TypeScript properties of a `AssetModelCompositeModelProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetModelAssetModelCompositeModelPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("compositeModelProperties", cdk.listValidator(CfnAssetModelAssetModelPropertyPropertyValidator))(properties.compositeModelProperties));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"AssetModelCompositeModelProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssetModelAssetModelCompositeModelPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetModelAssetModelCompositeModelPropertyValidator(properties).assertSuccess();
  return {
    "CompositeModelProperties": cdk.listMapper(convertCfnAssetModelAssetModelPropertyPropertyToCloudFormation)(properties.compositeModelProperties),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAssetModelAssetModelCompositeModelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.AssetModelCompositeModelProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.AssetModelCompositeModelProperty>();
  ret.addPropertyResult("compositeModelProperties", "CompositeModelProperties", (properties.CompositeModelProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnAssetModelAssetModelPropertyPropertyFromCloudFormation)(properties.CompositeModelProperties) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AssetModelHierarchyProperty`
 *
 * @param properties - the TypeScript properties of a `AssetModelHierarchyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetModelAssetModelHierarchyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("childAssetModelId", cdk.requiredValidator)(properties.childAssetModelId));
  errors.collect(cdk.propertyValidator("childAssetModelId", cdk.validateString)(properties.childAssetModelId));
  errors.collect(cdk.propertyValidator("logicalId", cdk.requiredValidator)(properties.logicalId));
  errors.collect(cdk.propertyValidator("logicalId", cdk.validateString)(properties.logicalId));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"AssetModelHierarchyProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssetModelAssetModelHierarchyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetModelAssetModelHierarchyPropertyValidator(properties).assertSuccess();
  return {
    "ChildAssetModelId": cdk.stringToCloudFormation(properties.childAssetModelId),
    "LogicalId": cdk.stringToCloudFormation(properties.logicalId),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnAssetModelAssetModelHierarchyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.AssetModelHierarchyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.AssetModelHierarchyProperty>();
  ret.addPropertyResult("childAssetModelId", "ChildAssetModelId", (properties.ChildAssetModelId != null ? cfn_parse.FromCloudFormation.getString(properties.ChildAssetModelId) : undefined));
  ret.addPropertyResult("logicalId", "LogicalId", (properties.LogicalId != null ? cfn_parse.FromCloudFormation.getString(properties.LogicalId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAssetModelProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssetModelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetModelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assetModelCompositeModels", cdk.listValidator(CfnAssetModelAssetModelCompositeModelPropertyValidator))(properties.assetModelCompositeModels));
  errors.collect(cdk.propertyValidator("assetModelDescription", cdk.validateString)(properties.assetModelDescription));
  errors.collect(cdk.propertyValidator("assetModelHierarchies", cdk.listValidator(CfnAssetModelAssetModelHierarchyPropertyValidator))(properties.assetModelHierarchies));
  errors.collect(cdk.propertyValidator("assetModelName", cdk.requiredValidator)(properties.assetModelName));
  errors.collect(cdk.propertyValidator("assetModelName", cdk.validateString)(properties.assetModelName));
  errors.collect(cdk.propertyValidator("assetModelProperties", cdk.listValidator(CfnAssetModelAssetModelPropertyPropertyValidator))(properties.assetModelProperties));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAssetModelProps\"");
}

// @ts-ignore TS6133
function convertCfnAssetModelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetModelPropsValidator(properties).assertSuccess();
  return {
    "AssetModelCompositeModels": cdk.listMapper(convertCfnAssetModelAssetModelCompositeModelPropertyToCloudFormation)(properties.assetModelCompositeModels),
    "AssetModelDescription": cdk.stringToCloudFormation(properties.assetModelDescription),
    "AssetModelHierarchies": cdk.listMapper(convertCfnAssetModelAssetModelHierarchyPropertyToCloudFormation)(properties.assetModelHierarchies),
    "AssetModelName": cdk.stringToCloudFormation(properties.assetModelName),
    "AssetModelProperties": cdk.listMapper(convertCfnAssetModelAssetModelPropertyPropertyToCloudFormation)(properties.assetModelProperties),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAssetModelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModelProps>();
  ret.addPropertyResult("assetModelCompositeModels", "AssetModelCompositeModels", (properties.AssetModelCompositeModels != null ? cfn_parse.FromCloudFormation.getArray(CfnAssetModelAssetModelCompositeModelPropertyFromCloudFormation)(properties.AssetModelCompositeModels) : undefined));
  ret.addPropertyResult("assetModelDescription", "AssetModelDescription", (properties.AssetModelDescription != null ? cfn_parse.FromCloudFormation.getString(properties.AssetModelDescription) : undefined));
  ret.addPropertyResult("assetModelHierarchies", "AssetModelHierarchies", (properties.AssetModelHierarchies != null ? cfn_parse.FromCloudFormation.getArray(CfnAssetModelAssetModelHierarchyPropertyFromCloudFormation)(properties.AssetModelHierarchies) : undefined));
  ret.addPropertyResult("assetModelName", "AssetModelName", (properties.AssetModelName != null ? cfn_parse.FromCloudFormation.getString(properties.AssetModelName) : undefined));
  ret.addPropertyResult("assetModelProperties", "AssetModelProperties", (properties.AssetModelProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnAssetModelAssetModelPropertyPropertyFromCloudFormation)(properties.AssetModelProperties) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a dashboard in an AWS IoT SiteWise Monitor project.
 *
 * @cloudformationResource AWS::IoTSiteWise::Dashboard
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html
 */
export class CfnDashboard extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTSiteWise::Dashboard";

  /**
   * Build a CfnDashboard from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDashboard {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDashboardPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDashboard(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of the dashboard, which has the following format.
   *
   * `arn:${Partition}:iotsitewise:${Region}:${Account}:dashboard/${DashboardId}`
   *
   * @cloudformationAttribute DashboardArn
   */
  public readonly attrDashboardArn: string;

  /**
   * The ID of the dashboard.
   *
   * @cloudformationAttribute DashboardId
   */
  public readonly attrDashboardId: string;

  /**
   * The dashboard definition specified in a JSON literal.
   */
  public dashboardDefinition: string;

  /**
   * A description for the dashboard.
   */
  public dashboardDescription: string;

  /**
   * A friendly name for the dashboard.
   */
  public dashboardName: string;

  /**
   * The ID of the project in which to create the dashboard.
   */
  public projectId?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of key-value pairs that contain metadata for the dashboard.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDashboardProps) {
    super(scope, id, {
      "type": CfnDashboard.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "dashboardDefinition", this);
    cdk.requireProperty(props, "dashboardDescription", this);
    cdk.requireProperty(props, "dashboardName", this);

    this.attrDashboardArn = cdk.Token.asString(this.getAtt("DashboardArn", cdk.ResolutionTypeHint.STRING));
    this.attrDashboardId = cdk.Token.asString(this.getAtt("DashboardId", cdk.ResolutionTypeHint.STRING));
    this.dashboardDefinition = props.dashboardDefinition;
    this.dashboardDescription = props.dashboardDescription;
    this.dashboardName = props.dashboardName;
    this.projectId = props.projectId;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTSiteWise::Dashboard", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dashboardDefinition": this.dashboardDefinition,
      "dashboardDescription": this.dashboardDescription,
      "dashboardName": this.dashboardName,
      "projectId": this.projectId,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDashboard.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDashboardPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDashboard`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html
 */
export interface CfnDashboardProps {
  /**
   * The dashboard definition specified in a JSON literal.
   *
   * For detailed information, see [Creating dashboards (CLI)](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/create-dashboards-using-aws-cli.html) in the *AWS IoT SiteWise User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html#cfn-iotsitewise-dashboard-dashboarddefinition
   */
  readonly dashboardDefinition: string;

  /**
   * A description for the dashboard.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html#cfn-iotsitewise-dashboard-dashboarddescription
   */
  readonly dashboardDescription: string;

  /**
   * A friendly name for the dashboard.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html#cfn-iotsitewise-dashboard-dashboardname
   */
  readonly dashboardName: string;

  /**
   * The ID of the project in which to create the dashboard.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html#cfn-iotsitewise-dashboard-projectid
   */
  readonly projectId?: string;

  /**
   * A list of key-value pairs that contain metadata for the dashboard.
   *
   * For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html#cfn-iotsitewise-dashboard-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnDashboardProps`
 *
 * @param properties - the TypeScript properties of a `CfnDashboardProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDashboardPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dashboardDefinition", cdk.requiredValidator)(properties.dashboardDefinition));
  errors.collect(cdk.propertyValidator("dashboardDefinition", cdk.validateString)(properties.dashboardDefinition));
  errors.collect(cdk.propertyValidator("dashboardDescription", cdk.requiredValidator)(properties.dashboardDescription));
  errors.collect(cdk.propertyValidator("dashboardDescription", cdk.validateString)(properties.dashboardDescription));
  errors.collect(cdk.propertyValidator("dashboardName", cdk.requiredValidator)(properties.dashboardName));
  errors.collect(cdk.propertyValidator("dashboardName", cdk.validateString)(properties.dashboardName));
  errors.collect(cdk.propertyValidator("projectId", cdk.validateString)(properties.projectId));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDashboardProps\"");
}

// @ts-ignore TS6133
function convertCfnDashboardPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDashboardPropsValidator(properties).assertSuccess();
  return {
    "DashboardDefinition": cdk.stringToCloudFormation(properties.dashboardDefinition),
    "DashboardDescription": cdk.stringToCloudFormation(properties.dashboardDescription),
    "DashboardName": cdk.stringToCloudFormation(properties.dashboardName),
    "ProjectId": cdk.stringToCloudFormation(properties.projectId),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDashboardPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboardProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboardProps>();
  ret.addPropertyResult("dashboardDefinition", "DashboardDefinition", (properties.DashboardDefinition != null ? cfn_parse.FromCloudFormation.getString(properties.DashboardDefinition) : undefined));
  ret.addPropertyResult("dashboardDescription", "DashboardDescription", (properties.DashboardDescription != null ? cfn_parse.FromCloudFormation.getString(properties.DashboardDescription) : undefined));
  ret.addPropertyResult("dashboardName", "DashboardName", (properties.DashboardName != null ? cfn_parse.FromCloudFormation.getString(properties.DashboardName) : undefined));
  ret.addPropertyResult("projectId", "ProjectId", (properties.ProjectId != null ? cfn_parse.FromCloudFormation.getString(properties.ProjectId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a gateway, which is a virtual or edge device that delivers industrial data streams from local servers to AWS IoT SiteWise .
 *
 * For more information, see [Ingesting data using a gateway](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/gateway-connector.html) in the *AWS IoT SiteWise User Guide* .
 *
 * @cloudformationResource AWS::IoTSiteWise::Gateway
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html
 */
export class CfnGateway extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTSiteWise::Gateway";

  /**
   * Build a CfnGateway from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGateway {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGatewayPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGateway(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID for the gateway.
   *
   * @cloudformationAttribute GatewayId
   */
  public readonly attrGatewayId: string;

  /**
   * A list of gateway capability summaries that each contain a namespace and status.
   */
  public gatewayCapabilitySummaries?: Array<CfnGateway.GatewayCapabilitySummaryProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A unique, friendly name for the gateway.
   */
  public gatewayName: string;

  /**
   * The gateway's platform.
   */
  public gatewayPlatform: CfnGateway.GatewayPlatformProperty | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of key-value pairs that contain metadata for the gateway.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGatewayProps) {
    super(scope, id, {
      "type": CfnGateway.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "gatewayName", this);
    cdk.requireProperty(props, "gatewayPlatform", this);

    this.attrGatewayId = cdk.Token.asString(this.getAtt("GatewayId", cdk.ResolutionTypeHint.STRING));
    this.gatewayCapabilitySummaries = props.gatewayCapabilitySummaries;
    this.gatewayName = props.gatewayName;
    this.gatewayPlatform = props.gatewayPlatform;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTSiteWise::Gateway", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "gatewayCapabilitySummaries": this.gatewayCapabilitySummaries,
      "gatewayName": this.gatewayName,
      "gatewayPlatform": this.gatewayPlatform,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGateway.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGatewayPropsToCloudFormation(props);
  }
}

export namespace CfnGateway {
  /**
   * Contains a summary of a gateway capability configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-gatewaycapabilitysummary.html
   */
  export interface GatewayCapabilitySummaryProperty {
    /**
     * The JSON document that defines the configuration for the gateway capability.
     *
     * For more information, see [Configuring data sources (CLI)](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/configure-sources.html#configure-source-cli) in the *AWS IoT SiteWise User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-gatewaycapabilitysummary.html#cfn-iotsitewise-gateway-gatewaycapabilitysummary-capabilityconfiguration
     */
    readonly capabilityConfiguration?: string;

    /**
     * The namespace of the capability configuration.
     *
     * For example, if you configure OPC-UA sources from the AWS IoT SiteWise console, your OPC-UA capability configuration has the namespace `iotsitewise:opcuacollector:version` , where `version` is a number such as `1` .
     *
     * The maximum length is 512 characters with the pattern `^[a-zA-Z]+:[a-zA-Z]+:[0-9]+$` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-gatewaycapabilitysummary.html#cfn-iotsitewise-gateway-gatewaycapabilitysummary-capabilitynamespace
     */
    readonly capabilityNamespace: string;
  }

  /**
   * Contains a gateway's platform information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-gatewayplatform.html
   */
  export interface GatewayPlatformProperty {
    /**
     * A gateway that runs on AWS IoT Greengrass .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-gatewayplatform.html#cfn-iotsitewise-gateway-gatewayplatform-greengrass
     */
    readonly greengrass?: CfnGateway.GreengrassProperty | cdk.IResolvable;

    /**
     * A gateway that runs on AWS IoT Greengrass V2 .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-gatewayplatform.html#cfn-iotsitewise-gateway-gatewayplatform-greengrassv2
     */
    readonly greengrassV2?: CfnGateway.GreengrassV2Property | cdk.IResolvable;
  }

  /**
   * Contains details for a gateway that runs on AWS IoT Greengrass V2 .
   *
   * To create a gateway that runs on AWS IoT Greengrass V2 , you must deploy the IoT SiteWise Edge component to your gateway device. Your [Greengrass device role](https://docs.aws.amazon.com/greengrass/v2/developerguide/device-service-role.html) must use the `AWSIoTSiteWiseEdgeAccess` policy. For more information, see [Using AWS IoT SiteWise at the edge](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/sw-gateways.html) in the *AWS IoT SiteWise User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-greengrassv2.html
   */
  export interface GreengrassV2Property {
    /**
     * The name of the AWS IoT thing for your AWS IoT Greengrass V2 core device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-greengrassv2.html#cfn-iotsitewise-gateway-greengrassv2-coredevicethingname
     */
    readonly coreDeviceThingName: string;
  }

  /**
   * Contains details for a gateway that runs on AWS IoT Greengrass .
   *
   * To create a gateway that runs on AWS IoT Greengrass , you must add the IoT SiteWise connector to a Greengrass group and deploy it. Your Greengrass group must also have permissions to upload data to AWS IoT SiteWise . For more information, see [Ingesting data using a gateway](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/gateway-connector.html) in the *AWS IoT SiteWise User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-greengrass.html
   */
  export interface GreengrassProperty {
    /**
     * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of the Greengrass group. For more information about how to find a group's ARN, see [ListGroups](https://docs.aws.amazon.com/greengrass/latest/apireference/listgroups-get.html) and [GetGroup](https://docs.aws.amazon.com/greengrass/latest/apireference/getgroup-get.html) in the *AWS IoT Greengrass API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-greengrass.html#cfn-iotsitewise-gateway-greengrass-grouparn
     */
    readonly groupArn: string;
  }
}

/**
 * Properties for defining a `CfnGateway`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html
 */
export interface CfnGatewayProps {
  /**
   * A list of gateway capability summaries that each contain a namespace and status.
   *
   * Each gateway capability defines data sources for the gateway. To retrieve a capability configuration's definition, use [DescribeGatewayCapabilityConfiguration](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_DescribeGatewayCapabilityConfiguration.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html#cfn-iotsitewise-gateway-gatewaycapabilitysummaries
   */
  readonly gatewayCapabilitySummaries?: Array<CfnGateway.GatewayCapabilitySummaryProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A unique, friendly name for the gateway.
   *
   * The maximum length is 256 characters with the pattern `[^\u0000-\u001F\u007F]+` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html#cfn-iotsitewise-gateway-gatewayname
   */
  readonly gatewayName: string;

  /**
   * The gateway's platform.
   *
   * You can only specify one platform in a gateway.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html#cfn-iotsitewise-gateway-gatewayplatform
   */
  readonly gatewayPlatform: CfnGateway.GatewayPlatformProperty | cdk.IResolvable;

  /**
   * A list of key-value pairs that contain metadata for the gateway.
   *
   * For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html#cfn-iotsitewise-gateway-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `GatewayCapabilitySummaryProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayCapabilitySummaryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayGatewayCapabilitySummaryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capabilityConfiguration", cdk.validateString)(properties.capabilityConfiguration));
  errors.collect(cdk.propertyValidator("capabilityNamespace", cdk.requiredValidator)(properties.capabilityNamespace));
  errors.collect(cdk.propertyValidator("capabilityNamespace", cdk.validateString)(properties.capabilityNamespace));
  return errors.wrap("supplied properties not correct for \"GatewayCapabilitySummaryProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayGatewayCapabilitySummaryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayGatewayCapabilitySummaryPropertyValidator(properties).assertSuccess();
  return {
    "CapabilityConfiguration": cdk.stringToCloudFormation(properties.capabilityConfiguration),
    "CapabilityNamespace": cdk.stringToCloudFormation(properties.capabilityNamespace)
  };
}

// @ts-ignore TS6133
function CfnGatewayGatewayCapabilitySummaryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGateway.GatewayCapabilitySummaryProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGateway.GatewayCapabilitySummaryProperty>();
  ret.addPropertyResult("capabilityConfiguration", "CapabilityConfiguration", (properties.CapabilityConfiguration != null ? cfn_parse.FromCloudFormation.getString(properties.CapabilityConfiguration) : undefined));
  ret.addPropertyResult("capabilityNamespace", "CapabilityNamespace", (properties.CapabilityNamespace != null ? cfn_parse.FromCloudFormation.getString(properties.CapabilityNamespace) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GreengrassV2Property`
 *
 * @param properties - the TypeScript properties of a `GreengrassV2Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayGreengrassV2PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("coreDeviceThingName", cdk.requiredValidator)(properties.coreDeviceThingName));
  errors.collect(cdk.propertyValidator("coreDeviceThingName", cdk.validateString)(properties.coreDeviceThingName));
  return errors.wrap("supplied properties not correct for \"GreengrassV2Property\"");
}

// @ts-ignore TS6133
function convertCfnGatewayGreengrassV2PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayGreengrassV2PropertyValidator(properties).assertSuccess();
  return {
    "CoreDeviceThingName": cdk.stringToCloudFormation(properties.coreDeviceThingName)
  };
}

// @ts-ignore TS6133
function CfnGatewayGreengrassV2PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGateway.GreengrassV2Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGateway.GreengrassV2Property>();
  ret.addPropertyResult("coreDeviceThingName", "CoreDeviceThingName", (properties.CoreDeviceThingName != null ? cfn_parse.FromCloudFormation.getString(properties.CoreDeviceThingName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GreengrassProperty`
 *
 * @param properties - the TypeScript properties of a `GreengrassProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayGreengrassPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupArn", cdk.requiredValidator)(properties.groupArn));
  errors.collect(cdk.propertyValidator("groupArn", cdk.validateString)(properties.groupArn));
  return errors.wrap("supplied properties not correct for \"GreengrassProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayGreengrassPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayGreengrassPropertyValidator(properties).assertSuccess();
  return {
    "GroupArn": cdk.stringToCloudFormation(properties.groupArn)
  };
}

// @ts-ignore TS6133
function CfnGatewayGreengrassPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGateway.GreengrassProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGateway.GreengrassProperty>();
  ret.addPropertyResult("groupArn", "GroupArn", (properties.GroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.GroupArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GatewayPlatformProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayPlatformProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayGatewayPlatformPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("greengrass", CfnGatewayGreengrassPropertyValidator)(properties.greengrass));
  errors.collect(cdk.propertyValidator("greengrassV2", CfnGatewayGreengrassV2PropertyValidator)(properties.greengrassV2));
  return errors.wrap("supplied properties not correct for \"GatewayPlatformProperty\"");
}

// @ts-ignore TS6133
function convertCfnGatewayGatewayPlatformPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayGatewayPlatformPropertyValidator(properties).assertSuccess();
  return {
    "Greengrass": convertCfnGatewayGreengrassPropertyToCloudFormation(properties.greengrass),
    "GreengrassV2": convertCfnGatewayGreengrassV2PropertyToCloudFormation(properties.greengrassV2)
  };
}

// @ts-ignore TS6133
function CfnGatewayGatewayPlatformPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGateway.GatewayPlatformProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGateway.GatewayPlatformProperty>();
  ret.addPropertyResult("greengrass", "Greengrass", (properties.Greengrass != null ? CfnGatewayGreengrassPropertyFromCloudFormation(properties.Greengrass) : undefined));
  ret.addPropertyResult("greengrassV2", "GreengrassV2", (properties.GreengrassV2 != null ? CfnGatewayGreengrassV2PropertyFromCloudFormation(properties.GreengrassV2) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnGatewayProps`
 *
 * @param properties - the TypeScript properties of a `CfnGatewayProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("gatewayCapabilitySummaries", cdk.listValidator(CfnGatewayGatewayCapabilitySummaryPropertyValidator))(properties.gatewayCapabilitySummaries));
  errors.collect(cdk.propertyValidator("gatewayName", cdk.requiredValidator)(properties.gatewayName));
  errors.collect(cdk.propertyValidator("gatewayName", cdk.validateString)(properties.gatewayName));
  errors.collect(cdk.propertyValidator("gatewayPlatform", cdk.requiredValidator)(properties.gatewayPlatform));
  errors.collect(cdk.propertyValidator("gatewayPlatform", CfnGatewayGatewayPlatformPropertyValidator)(properties.gatewayPlatform));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnGatewayProps\"");
}

// @ts-ignore TS6133
function convertCfnGatewayPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayPropsValidator(properties).assertSuccess();
  return {
    "GatewayCapabilitySummaries": cdk.listMapper(convertCfnGatewayGatewayCapabilitySummaryPropertyToCloudFormation)(properties.gatewayCapabilitySummaries),
    "GatewayName": cdk.stringToCloudFormation(properties.gatewayName),
    "GatewayPlatform": convertCfnGatewayGatewayPlatformPropertyToCloudFormation(properties.gatewayPlatform),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnGatewayPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayProps>();
  ret.addPropertyResult("gatewayCapabilitySummaries", "GatewayCapabilitySummaries", (properties.GatewayCapabilitySummaries != null ? cfn_parse.FromCloudFormation.getArray(CfnGatewayGatewayCapabilitySummaryPropertyFromCloudFormation)(properties.GatewayCapabilitySummaries) : undefined));
  ret.addPropertyResult("gatewayName", "GatewayName", (properties.GatewayName != null ? cfn_parse.FromCloudFormation.getString(properties.GatewayName) : undefined));
  ret.addPropertyResult("gatewayPlatform", "GatewayPlatform", (properties.GatewayPlatform != null ? CfnGatewayGatewayPlatformPropertyFromCloudFormation(properties.GatewayPlatform) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a portal, which can contain projects and dashboards.
 *
 * Before you can create a portal, you must enable IAM Identity Center . AWS IoT SiteWise Monitor uses IAM Identity Center to manage user permissions. For more information, see [Enabling IAM Identity Center](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/monitor-get-started.html#mon-gs-sso) in the *AWS IoT SiteWise User Guide* .
 *
 * > Before you can sign in to a new portal, you must add at least one IAM Identity Center user or group to that portal. For more information, see [Adding or removing portal administrators](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/administer-portals.html#portal-change-admins) in the *AWS IoT SiteWise User Guide* .
 *
 * @cloudformationResource AWS::IoTSiteWise::Portal
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html
 */
export class CfnPortal extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTSiteWise::Portal";

  /**
   * Build a CfnPortal from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPortal {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPortalPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPortal(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of the portal, which has the following format.
   *
   * `arn:${Partition}:iotsitewise:${Region}:${Account}:portal/${PortalId}`
   *
   * @cloudformationAttribute PortalArn
   */
  public readonly attrPortalArn: string;

  /**
   * The IAM Identity Center application generated client ID (used with IAM Identity Center APIs).
   *
   * @cloudformationAttribute PortalClientId
   */
  public readonly attrPortalClientId: string;

  /**
   * The ID of the created portal.
   *
   * @cloudformationAttribute PortalId
   */
  public readonly attrPortalId: string;

  /**
   * The public URL for the AWS IoT SiteWise Monitor portal.
   *
   * @cloudformationAttribute PortalStartUrl
   */
  public readonly attrPortalStartUrl: string;

  /**
   * Contains the configuration information of an alarm created in an AWS IoT SiteWise Monitor portal.
   */
  public alarms?: any | cdk.IResolvable;

  /**
   * The email address that sends alarm notifications.
   */
  public notificationSenderEmail?: string;

  /**
   * The service to use to authenticate users to the portal. Choose from the following options:.
   */
  public portalAuthMode?: string;

  /**
   * The AWS administrator's contact email address.
   */
  public portalContactEmail: string;

  /**
   * A description for the portal.
   */
  public portalDescription?: string;

  /**
   * A friendly name for the portal.
   */
  public portalName: string;

  /**
   * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of a service role that allows the portal's users to access your AWS IoT SiteWise resources on your behalf. For more information, see [Using service roles for AWS IoT SiteWise Monitor](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/monitor-service-role.html) in the *AWS IoT SiteWise User Guide* .
   */
  public roleArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of key-value pairs that contain metadata for the portal.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPortalProps) {
    super(scope, id, {
      "type": CfnPortal.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "portalContactEmail", this);
    cdk.requireProperty(props, "portalName", this);
    cdk.requireProperty(props, "roleArn", this);

    this.attrPortalArn = cdk.Token.asString(this.getAtt("PortalArn", cdk.ResolutionTypeHint.STRING));
    this.attrPortalClientId = cdk.Token.asString(this.getAtt("PortalClientId", cdk.ResolutionTypeHint.STRING));
    this.attrPortalId = cdk.Token.asString(this.getAtt("PortalId", cdk.ResolutionTypeHint.STRING));
    this.attrPortalStartUrl = cdk.Token.asString(this.getAtt("PortalStartUrl", cdk.ResolutionTypeHint.STRING));
    this.alarms = props.alarms;
    this.notificationSenderEmail = props.notificationSenderEmail;
    this.portalAuthMode = props.portalAuthMode;
    this.portalContactEmail = props.portalContactEmail;
    this.portalDescription = props.portalDescription;
    this.portalName = props.portalName;
    this.roleArn = props.roleArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTSiteWise::Portal", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "alarms": this.alarms,
      "notificationSenderEmail": this.notificationSenderEmail,
      "portalAuthMode": this.portalAuthMode,
      "portalContactEmail": this.portalContactEmail,
      "portalDescription": this.portalDescription,
      "portalName": this.portalName,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPortal.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPortalPropsToCloudFormation(props);
  }
}

export namespace CfnPortal {
  /**
   * Contains the configuration information of an alarm created in an AWS IoT SiteWise Monitor portal.
   *
   * You can use the alarm to monitor an asset property and get notified when the asset property value is outside a specified range. For more information, see [Monitoring with alarms](https://docs.aws.amazon.com/iot-sitewise/latest/appguide/monitor-alarms.html) in the *AWS IoT SiteWise Application Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-portal-alarms.html
   */
  export interface AlarmsProperty {
    /**
     * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of the IAM role that allows the alarm to perform actions and access AWS resources and services, such as AWS IoT Events .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-portal-alarms.html#cfn-iotsitewise-portal-alarms-alarmrolearn
     */
    readonly alarmRoleArn?: string;

    /**
     * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of the Lambda function that manages alarm notifications. For more information, see [Managing alarm notifications](https://docs.aws.amazon.com/iotevents/latest/developerguide/lambda-support.html) in the *AWS IoT Events Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-portal-alarms.html#cfn-iotsitewise-portal-alarms-notificationlambdaarn
     */
    readonly notificationLambdaArn?: string;
  }
}

/**
 * Properties for defining a `CfnPortal`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html
 */
export interface CfnPortalProps {
  /**
   * Contains the configuration information of an alarm created in an AWS IoT SiteWise Monitor portal.
   *
   * You can use the alarm to monitor an asset property and get notified when the asset property value is outside a specified range. For more information, see [Monitoring with alarms](https://docs.aws.amazon.com/iot-sitewise/latest/appguide/monitor-alarms.html) in the *AWS IoT SiteWise Application Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-alarms
   */
  readonly alarms?: any | cdk.IResolvable;

  /**
   * The email address that sends alarm notifications.
   *
   * > If you use the [AWS IoT Events managed Lambda function](https://docs.aws.amazon.com/iotevents/latest/developerguide/lambda-support.html) to manage your emails, you must [verify the sender email address in Amazon SES](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-notificationsenderemail
   */
  readonly notificationSenderEmail?: string;

  /**
   * The service to use to authenticate users to the portal. Choose from the following options:.
   *
   * - `SSO` – The portal uses AWS IAM Identity Center to authenticate users and manage user permissions. Before you can create a portal that uses IAM Identity Center , you must enable IAM Identity Center . For more information, see [Enabling IAM Identity Center](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/monitor-get-started.html#mon-gs-sso) in the *AWS IoT SiteWise User Guide* . This option is only available in AWS Regions other than the China Regions.
   * - `IAM` – The portal uses AWS Identity and Access Management ( IAM ) to authenticate users and manage user permissions.
   *
   * You can't change this value after you create a portal.
   *
   * Default: `SSO`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-portalauthmode
   */
  readonly portalAuthMode?: string;

  /**
   * The AWS administrator's contact email address.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-portalcontactemail
   */
  readonly portalContactEmail: string;

  /**
   * A description for the portal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-portaldescription
   */
  readonly portalDescription?: string;

  /**
   * A friendly name for the portal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-portalname
   */
  readonly portalName: string;

  /**
   * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of a service role that allows the portal's users to access your AWS IoT SiteWise resources on your behalf. For more information, see [Using service roles for AWS IoT SiteWise Monitor](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/monitor-service-role.html) in the *AWS IoT SiteWise User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-rolearn
   */
  readonly roleArn: string;

  /**
   * A list of key-value pairs that contain metadata for the portal.
   *
   * For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AlarmsProperty`
 *
 * @param properties - the TypeScript properties of a `AlarmsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPortalAlarmsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alarmRoleArn", cdk.validateString)(properties.alarmRoleArn));
  errors.collect(cdk.propertyValidator("notificationLambdaArn", cdk.validateString)(properties.notificationLambdaArn));
  return errors.wrap("supplied properties not correct for \"AlarmsProperty\"");
}

// @ts-ignore TS6133
function convertCfnPortalAlarmsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPortalAlarmsPropertyValidator(properties).assertSuccess();
  return {
    "AlarmRoleArn": cdk.stringToCloudFormation(properties.alarmRoleArn),
    "NotificationLambdaArn": cdk.stringToCloudFormation(properties.notificationLambdaArn)
  };
}

// @ts-ignore TS6133
function CfnPortalAlarmsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPortal.AlarmsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPortal.AlarmsProperty>();
  ret.addPropertyResult("alarmRoleArn", "AlarmRoleArn", (properties.AlarmRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.AlarmRoleArn) : undefined));
  ret.addPropertyResult("notificationLambdaArn", "NotificationLambdaArn", (properties.NotificationLambdaArn != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationLambdaArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPortalProps`
 *
 * @param properties - the TypeScript properties of a `CfnPortalProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPortalPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alarms", cdk.validateObject)(properties.alarms));
  errors.collect(cdk.propertyValidator("notificationSenderEmail", cdk.validateString)(properties.notificationSenderEmail));
  errors.collect(cdk.propertyValidator("portalAuthMode", cdk.validateString)(properties.portalAuthMode));
  errors.collect(cdk.propertyValidator("portalContactEmail", cdk.requiredValidator)(properties.portalContactEmail));
  errors.collect(cdk.propertyValidator("portalContactEmail", cdk.validateString)(properties.portalContactEmail));
  errors.collect(cdk.propertyValidator("portalDescription", cdk.validateString)(properties.portalDescription));
  errors.collect(cdk.propertyValidator("portalName", cdk.requiredValidator)(properties.portalName));
  errors.collect(cdk.propertyValidator("portalName", cdk.validateString)(properties.portalName));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPortalProps\"");
}

// @ts-ignore TS6133
function convertCfnPortalPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPortalPropsValidator(properties).assertSuccess();
  return {
    "Alarms": cdk.objectToCloudFormation(properties.alarms),
    "NotificationSenderEmail": cdk.stringToCloudFormation(properties.notificationSenderEmail),
    "PortalAuthMode": cdk.stringToCloudFormation(properties.portalAuthMode),
    "PortalContactEmail": cdk.stringToCloudFormation(properties.portalContactEmail),
    "PortalDescription": cdk.stringToCloudFormation(properties.portalDescription),
    "PortalName": cdk.stringToCloudFormation(properties.portalName),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPortalPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPortalProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPortalProps>();
  ret.addPropertyResult("alarms", "Alarms", (properties.Alarms != null ? cfn_parse.FromCloudFormation.getAny(properties.Alarms) : undefined));
  ret.addPropertyResult("notificationSenderEmail", "NotificationSenderEmail", (properties.NotificationSenderEmail != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationSenderEmail) : undefined));
  ret.addPropertyResult("portalAuthMode", "PortalAuthMode", (properties.PortalAuthMode != null ? cfn_parse.FromCloudFormation.getString(properties.PortalAuthMode) : undefined));
  ret.addPropertyResult("portalContactEmail", "PortalContactEmail", (properties.PortalContactEmail != null ? cfn_parse.FromCloudFormation.getString(properties.PortalContactEmail) : undefined));
  ret.addPropertyResult("portalDescription", "PortalDescription", (properties.PortalDescription != null ? cfn_parse.FromCloudFormation.getString(properties.PortalDescription) : undefined));
  ret.addPropertyResult("portalName", "PortalName", (properties.PortalName != null ? cfn_parse.FromCloudFormation.getString(properties.PortalName) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a project in the specified portal.
 *
 * > Make sure that the project name and description don't contain confidential information.
 *
 * @cloudformationResource AWS::IoTSiteWise::Project
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html
 */
export class CfnProject extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTSiteWise::Project";

  /**
   * Build a CfnProject from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProject {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnProjectPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnProject(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of the project, which has the following format.
   *
   * `arn:${Partition}:iotsitewise:${Region}:${Account}:project/${ProjectId}`
   *
   * @cloudformationAttribute ProjectArn
   */
  public readonly attrProjectArn: string;

  /**
   * The ID of the project.
   *
   * @cloudformationAttribute ProjectId
   */
  public readonly attrProjectId: string;

  /**
   * A list that contains the IDs of each asset associated with the project.
   */
  public assetIds?: Array<string>;

  /**
   * The ID of the portal in which to create the project.
   */
  public portalId: string;

  /**
   * A description for the project.
   */
  public projectDescription?: string;

  /**
   * A friendly name for the project.
   */
  public projectName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of key-value pairs that contain metadata for the project.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnProjectProps) {
    super(scope, id, {
      "type": CfnProject.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "portalId", this);
    cdk.requireProperty(props, "projectName", this);

    this.attrProjectArn = cdk.Token.asString(this.getAtt("ProjectArn", cdk.ResolutionTypeHint.STRING));
    this.attrProjectId = cdk.Token.asString(this.getAtt("ProjectId", cdk.ResolutionTypeHint.STRING));
    this.assetIds = props.assetIds;
    this.portalId = props.portalId;
    this.projectDescription = props.projectDescription;
    this.projectName = props.projectName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTSiteWise::Project", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "assetIds": this.assetIds,
      "portalId": this.portalId,
      "projectDescription": this.projectDescription,
      "projectName": this.projectName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnProject.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnProjectPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnProject`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html
 */
export interface CfnProjectProps {
  /**
   * A list that contains the IDs of each asset associated with the project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html#cfn-iotsitewise-project-assetids
   */
  readonly assetIds?: Array<string>;

  /**
   * The ID of the portal in which to create the project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html#cfn-iotsitewise-project-portalid
   */
  readonly portalId: string;

  /**
   * A description for the project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html#cfn-iotsitewise-project-projectdescription
   */
  readonly projectDescription?: string;

  /**
   * A friendly name for the project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html#cfn-iotsitewise-project-projectname
   */
  readonly projectName: string;

  /**
   * A list of key-value pairs that contain metadata for the project.
   *
   * For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html#cfn-iotsitewise-project-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnProjectProps`
 *
 * @param properties - the TypeScript properties of a `CfnProjectProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProjectPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assetIds", cdk.listValidator(cdk.validateString))(properties.assetIds));
  errors.collect(cdk.propertyValidator("portalId", cdk.requiredValidator)(properties.portalId));
  errors.collect(cdk.propertyValidator("portalId", cdk.validateString)(properties.portalId));
  errors.collect(cdk.propertyValidator("projectDescription", cdk.validateString)(properties.projectDescription));
  errors.collect(cdk.propertyValidator("projectName", cdk.requiredValidator)(properties.projectName));
  errors.collect(cdk.propertyValidator("projectName", cdk.validateString)(properties.projectName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnProjectProps\"");
}

// @ts-ignore TS6133
function convertCfnProjectPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProjectPropsValidator(properties).assertSuccess();
  return {
    "AssetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.assetIds),
    "PortalId": cdk.stringToCloudFormation(properties.portalId),
    "ProjectDescription": cdk.stringToCloudFormation(properties.projectDescription),
    "ProjectName": cdk.stringToCloudFormation(properties.projectName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnProjectPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProjectProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProjectProps>();
  ret.addPropertyResult("assetIds", "AssetIds", (properties.AssetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AssetIds) : undefined));
  ret.addPropertyResult("portalId", "PortalId", (properties.PortalId != null ? cfn_parse.FromCloudFormation.getString(properties.PortalId) : undefined));
  ret.addPropertyResult("projectDescription", "ProjectDescription", (properties.ProjectDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ProjectDescription) : undefined));
  ret.addPropertyResult("projectName", "ProjectName", (properties.ProjectName != null ? cfn_parse.FromCloudFormation.getString(properties.ProjectName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}