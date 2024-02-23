/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * A group object, which contains a specified group’s metadata and attributes.
 *
 * @cloudformationResource AWS::IdentityStore::Group
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html
 */
export class CfnGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IdentityStore::Group";

  /**
   * Build a CfnGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The identifier of the newly created group in the identity store.
   *
   * @cloudformationAttribute GroupId
   */
  public readonly attrGroupId: string;

  /**
   * A string containing the description of the group.
   */
  public description?: string;

  /**
   * A string containing the name of the group.
   */
  public displayName: string;

  /**
   * The globally unique identifier for the identity store.
   */
  public identityStoreId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGroupProps) {
    super(scope, id, {
      "type": CfnGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "displayName", this);
    cdk.requireProperty(props, "identityStoreId", this);

    this.attrGroupId = cdk.Token.asString(this.getAtt("GroupId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.displayName = props.displayName;
    this.identityStoreId = props.identityStoreId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "displayName": this.displayName,
      "identityStoreId": this.identityStoreId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html
 */
export interface CfnGroupProps {
  /**
   * A string containing the description of the group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html#cfn-identitystore-group-description
   */
  readonly description?: string;

  /**
   * A string containing the name of the group.
   *
   * This value is commonly displayed when the group is referenced.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html#cfn-identitystore-group-displayname
   */
  readonly displayName: string;

  /**
   * The globally unique identifier for the identity store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html#cfn-identitystore-group-identitystoreid
   */
  readonly identityStoreId: string;
}

/**
 * Determine whether the given properties match those of a `CfnGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("displayName", cdk.requiredValidator)(properties.displayName));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("identityStoreId", cdk.requiredValidator)(properties.identityStoreId));
  errors.collect(cdk.propertyValidator("identityStoreId", cdk.validateString)(properties.identityStoreId));
  return errors.wrap("supplied properties not correct for \"CfnGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGroupPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "IdentityStoreId": cdk.stringToCloudFormation(properties.identityStoreId)
  };
}

// @ts-ignore TS6133
function CfnGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGroupProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("identityStoreId", "IdentityStoreId", (properties.IdentityStoreId != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityStoreId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Contains the identifiers for a group, a group member, and a `GroupMembership` object in the identity store.
 *
 * @cloudformationResource AWS::IdentityStore::GroupMembership
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html
 */
export class CfnGroupMembership extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IdentityStore::GroupMembership";

  /**
   * Build a CfnGroupMembership from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGroupMembership {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGroupMembershipPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGroupMembership(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The identifier for a `GroupMembership` in the identity store.
   *
   * @cloudformationAttribute MembershipId
   */
  public readonly attrMembershipId: string;

  /**
   * The unique identifier for a group in the identity store.
   */
  public groupId: string;

  /**
   * The globally unique identifier for the identity store.
   */
  public identityStoreId: string;

  /**
   * An object containing the identifier of a group member.
   */
  public memberId: cdk.IResolvable | CfnGroupMembership.MemberIdProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGroupMembershipProps) {
    super(scope, id, {
      "type": CfnGroupMembership.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "groupId", this);
    cdk.requireProperty(props, "identityStoreId", this);
    cdk.requireProperty(props, "memberId", this);

    this.attrMembershipId = cdk.Token.asString(this.getAtt("MembershipId", cdk.ResolutionTypeHint.STRING));
    this.groupId = props.groupId;
    this.identityStoreId = props.identityStoreId;
    this.memberId = props.memberId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "groupId": this.groupId,
      "identityStoreId": this.identityStoreId,
      "memberId": this.memberId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGroupMembership.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGroupMembershipPropsToCloudFormation(props);
  }
}

export namespace CfnGroupMembership {
  /**
   * An object that contains the identifier of a group member.
   *
   * Setting the `UserID` field to the specific identifier for a user indicates that the user is a member of the group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-identitystore-groupmembership-memberid.html
   */
  export interface MemberIdProperty {
    /**
     * The identifier for a user in the identity store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-identitystore-groupmembership-memberid.html#cfn-identitystore-groupmembership-memberid-userid
     */
    readonly userId: string;
  }
}

/**
 * Properties for defining a `CfnGroupMembership`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html
 */
export interface CfnGroupMembershipProps {
  /**
   * The unique identifier for a group in the identity store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html#cfn-identitystore-groupmembership-groupid
   */
  readonly groupId: string;

  /**
   * The globally unique identifier for the identity store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html#cfn-identitystore-groupmembership-identitystoreid
   */
  readonly identityStoreId: string;

  /**
   * An object containing the identifier of a group member.
   *
   * Setting `MemberId` 's `UserId` field to a specific User's ID indicates we should consider that User as a group member.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html#cfn-identitystore-groupmembership-memberid
   */
  readonly memberId: cdk.IResolvable | CfnGroupMembership.MemberIdProperty;
}

/**
 * Determine whether the given properties match those of a `MemberIdProperty`
 *
 * @param properties - the TypeScript properties of a `MemberIdProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGroupMembershipMemberIdPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("userId", cdk.requiredValidator)(properties.userId));
  errors.collect(cdk.propertyValidator("userId", cdk.validateString)(properties.userId));
  return errors.wrap("supplied properties not correct for \"MemberIdProperty\"");
}

// @ts-ignore TS6133
function convertCfnGroupMembershipMemberIdPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGroupMembershipMemberIdPropertyValidator(properties).assertSuccess();
  return {
    "UserId": cdk.stringToCloudFormation(properties.userId)
  };
}

// @ts-ignore TS6133
function CfnGroupMembershipMemberIdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnGroupMembership.MemberIdProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGroupMembership.MemberIdProperty>();
  ret.addPropertyResult("userId", "UserId", (properties.UserId != null ? cfn_parse.FromCloudFormation.getString(properties.UserId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnGroupMembershipProps`
 *
 * @param properties - the TypeScript properties of a `CfnGroupMembershipProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGroupMembershipPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupId", cdk.requiredValidator)(properties.groupId));
  errors.collect(cdk.propertyValidator("groupId", cdk.validateString)(properties.groupId));
  errors.collect(cdk.propertyValidator("identityStoreId", cdk.requiredValidator)(properties.identityStoreId));
  errors.collect(cdk.propertyValidator("identityStoreId", cdk.validateString)(properties.identityStoreId));
  errors.collect(cdk.propertyValidator("memberId", cdk.requiredValidator)(properties.memberId));
  errors.collect(cdk.propertyValidator("memberId", CfnGroupMembershipMemberIdPropertyValidator)(properties.memberId));
  return errors.wrap("supplied properties not correct for \"CfnGroupMembershipProps\"");
}

// @ts-ignore TS6133
function convertCfnGroupMembershipPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGroupMembershipPropsValidator(properties).assertSuccess();
  return {
    "GroupId": cdk.stringToCloudFormation(properties.groupId),
    "IdentityStoreId": cdk.stringToCloudFormation(properties.identityStoreId),
    "MemberId": convertCfnGroupMembershipMemberIdPropertyToCloudFormation(properties.memberId)
  };
}

// @ts-ignore TS6133
function CfnGroupMembershipPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGroupMembershipProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGroupMembershipProps>();
  ret.addPropertyResult("groupId", "GroupId", (properties.GroupId != null ? cfn_parse.FromCloudFormation.getString(properties.GroupId) : undefined));
  ret.addPropertyResult("identityStoreId", "IdentityStoreId", (properties.IdentityStoreId != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityStoreId) : undefined));
  ret.addPropertyResult("memberId", "MemberId", (properties.MemberId != null ? CfnGroupMembershipMemberIdPropertyFromCloudFormation(properties.MemberId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}