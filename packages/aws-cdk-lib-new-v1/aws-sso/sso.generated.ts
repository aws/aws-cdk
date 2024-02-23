/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Assigns access to a Principal for a specified AWS account using a specified permission set.
 *
 * > The term *principal* here refers to a user or group that is defined in IAM Identity Center .
 *
 * @cloudformationResource AWS::SSO::Assignment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-assignment.html
 */
export class CfnAssignment extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSO::Assignment";

  /**
   * Build a CfnAssignment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAssignment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAssignmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAssignment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the IAM Identity Center instance under which the operation will be executed.
   */
  public instanceArn: string;

  /**
   * The ARN of the permission set.
   */
  public permissionSetArn: string;

  /**
   * An identifier for an object in IAM Identity Center, such as a user or group.
   */
  public principalId: string;

  /**
   * The entity type for which the assignment will be created.
   */
  public principalType: string;

  /**
   * TargetID is an AWS account identifier, (For example, 123456789012).
   */
  public targetId: string;

  /**
   * The entity type for which the assignment will be created.
   */
  public targetType: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAssignmentProps) {
    super(scope, id, {
      "type": CfnAssignment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "permissionSetArn", this);
    cdk.requireProperty(props, "principalId", this);
    cdk.requireProperty(props, "principalType", this);
    cdk.requireProperty(props, "targetId", this);
    cdk.requireProperty(props, "targetType", this);

    this.instanceArn = props.instanceArn;
    this.permissionSetArn = props.permissionSetArn;
    this.principalId = props.principalId;
    this.principalType = props.principalType;
    this.targetId = props.targetId;
    this.targetType = props.targetType;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "instanceArn": this.instanceArn,
      "permissionSetArn": this.permissionSetArn,
      "principalId": this.principalId,
      "principalType": this.principalType,
      "targetId": this.targetId,
      "targetType": this.targetType
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssignment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAssignmentPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAssignment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-assignment.html
 */
export interface CfnAssignmentProps {
  /**
   * The ARN of the IAM Identity Center instance under which the operation will be executed.
   *
   * For more information about ARNs, see [Amazon Resource Names (ARNs) and AWS Service Namespaces](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html) in the *AWS General Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-assignment.html#cfn-sso-assignment-instancearn
   */
  readonly instanceArn: string;

  /**
   * The ARN of the permission set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-assignment.html#cfn-sso-assignment-permissionsetarn
   */
  readonly permissionSetArn: string;

  /**
   * An identifier for an object in IAM Identity Center, such as a user or group.
   *
   * PrincipalIds are GUIDs (For example, f81d4fae-7dec-11d0-a765-00a0c91e6bf6). For more information about PrincipalIds in IAM Identity Center, see the [IAM Identity Center Identity Store API Reference](https://docs.aws.amazon.com//singlesignon/latest/IdentityStoreAPIReference/welcome.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-assignment.html#cfn-sso-assignment-principalid
   */
  readonly principalId: string;

  /**
   * The entity type for which the assignment will be created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-assignment.html#cfn-sso-assignment-principaltype
   */
  readonly principalType: string;

  /**
   * TargetID is an AWS account identifier, (For example, 123456789012).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-assignment.html#cfn-sso-assignment-targetid
   */
  readonly targetId: string;

  /**
   * The entity type for which the assignment will be created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-assignment.html#cfn-sso-assignment-targettype
   */
  readonly targetType: string;
}

/**
 * Determine whether the given properties match those of a `CfnAssignmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssignmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssignmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("permissionSetArn", cdk.requiredValidator)(properties.permissionSetArn));
  errors.collect(cdk.propertyValidator("permissionSetArn", cdk.validateString)(properties.permissionSetArn));
  errors.collect(cdk.propertyValidator("principalId", cdk.requiredValidator)(properties.principalId));
  errors.collect(cdk.propertyValidator("principalId", cdk.validateString)(properties.principalId));
  errors.collect(cdk.propertyValidator("principalType", cdk.requiredValidator)(properties.principalType));
  errors.collect(cdk.propertyValidator("principalType", cdk.validateString)(properties.principalType));
  errors.collect(cdk.propertyValidator("targetId", cdk.requiredValidator)(properties.targetId));
  errors.collect(cdk.propertyValidator("targetId", cdk.validateString)(properties.targetId));
  errors.collect(cdk.propertyValidator("targetType", cdk.requiredValidator)(properties.targetType));
  errors.collect(cdk.propertyValidator("targetType", cdk.validateString)(properties.targetType));
  return errors.wrap("supplied properties not correct for \"CfnAssignmentProps\"");
}

// @ts-ignore TS6133
function convertCfnAssignmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssignmentPropsValidator(properties).assertSuccess();
  return {
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "PermissionSetArn": cdk.stringToCloudFormation(properties.permissionSetArn),
    "PrincipalId": cdk.stringToCloudFormation(properties.principalId),
    "PrincipalType": cdk.stringToCloudFormation(properties.principalType),
    "TargetId": cdk.stringToCloudFormation(properties.targetId),
    "TargetType": cdk.stringToCloudFormation(properties.targetType)
  };
}

// @ts-ignore TS6133
function CfnAssignmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssignmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssignmentProps>();
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("permissionSetArn", "PermissionSetArn", (properties.PermissionSetArn != null ? cfn_parse.FromCloudFormation.getString(properties.PermissionSetArn) : undefined));
  ret.addPropertyResult("principalId", "PrincipalId", (properties.PrincipalId != null ? cfn_parse.FromCloudFormation.getString(properties.PrincipalId) : undefined));
  ret.addPropertyResult("principalType", "PrincipalType", (properties.PrincipalType != null ? cfn_parse.FromCloudFormation.getString(properties.PrincipalType) : undefined));
  ret.addPropertyResult("targetId", "TargetId", (properties.TargetId != null ? cfn_parse.FromCloudFormation.getString(properties.TargetId) : undefined));
  ret.addPropertyResult("targetType", "TargetType", (properties.TargetType != null ? cfn_parse.FromCloudFormation.getString(properties.TargetType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Enables the attribute-based access control (ABAC) feature for the specified IAM Identity Center instance.
 *
 * You can also specify new attributes to add to your ABAC configuration during the enabling process. For more information about ABAC, see [Attribute-Based Access Control](https://docs.aws.amazon.com//singlesignon/latest/userguide/abac.html) in the *IAM Identity Center User Guide* .
 *
 * > The `InstanceAccessControlAttributeConfiguration` property has been deprecated but is still supported for backwards compatibility purposes. We recommend that you use the `AccessControlAttributes` property instead.
 *
 * @cloudformationResource AWS::SSO::InstanceAccessControlAttributeConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-instanceaccesscontrolattributeconfiguration.html
 */
export class CfnInstanceAccessControlAttributeConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSO::InstanceAccessControlAttributeConfiguration";

  /**
   * Build a CfnInstanceAccessControlAttributeConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstanceAccessControlAttributeConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnInstanceAccessControlAttributeConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnInstanceAccessControlAttributeConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Lists the attributes that are configured for ABAC in the specified IAM Identity Center instance.
   */
  public accessControlAttributes?: Array<CfnInstanceAccessControlAttributeConfiguration.AccessControlAttributeProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The InstanceAccessControlAttributeConfiguration property has been deprecated but is still supported for backwards compatibility purposes.
   *
   * @deprecated this property has been deprecated
   */
  public instanceAccessControlAttributeConfiguration?: CfnInstanceAccessControlAttributeConfiguration.InstanceAccessControlAttributeConfigurationProperty | cdk.IResolvable;

  /**
   * The ARN of the IAM Identity Center instance under which the operation will be executed.
   */
  public instanceArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnInstanceAccessControlAttributeConfigurationProps) {
    super(scope, id, {
      "type": CfnInstanceAccessControlAttributeConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceArn", this);

    this.accessControlAttributes = props.accessControlAttributes;
    this.instanceAccessControlAttributeConfiguration = props.instanceAccessControlAttributeConfiguration;
    this.instanceArn = props.instanceArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessControlAttributes": this.accessControlAttributes,
      "instanceAccessControlAttributeConfiguration": this.instanceAccessControlAttributeConfiguration,
      "instanceArn": this.instanceArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnInstanceAccessControlAttributeConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnInstanceAccessControlAttributeConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnInstanceAccessControlAttributeConfiguration {
  /**
   * These are IAM Identity Center identity store attributes that you can configure for use in attributes-based access control (ABAC).
   *
   * You can create permissions policies that determine who can access your AWS resources based upon the configured attribute values. When you enable ABAC and specify `AccessControlAttributes` , IAM Identity Center passes the attribute values of the authenticated user into IAM for use in policy evaluation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sso-instanceaccesscontrolattributeconfiguration-accesscontrolattribute.html
   */
  export interface AccessControlAttributeProperty {
    /**
     * The name of the attribute associated with your identities in your identity source.
     *
     * This is used to map a specified attribute in your identity source with an attribute in IAM Identity Center .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sso-instanceaccesscontrolattributeconfiguration-accesscontrolattribute.html#cfn-sso-instanceaccesscontrolattributeconfiguration-accesscontrolattribute-key
     */
    readonly key: string;

    /**
     * The value used for mapping a specified attribute to an identity source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sso-instanceaccesscontrolattributeconfiguration-accesscontrolattribute.html#cfn-sso-instanceaccesscontrolattributeconfiguration-accesscontrolattribute-value
     */
    readonly value: CfnInstanceAccessControlAttributeConfiguration.AccessControlAttributeValueProperty | cdk.IResolvable;
  }

  /**
   * The value used for mapping a specified attribute to an identity source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sso-instanceaccesscontrolattributeconfiguration-accesscontrolattributevalue.html
   */
  export interface AccessControlAttributeValueProperty {
    /**
     * The identity source to use when mapping a specified attribute to IAM Identity Center .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sso-instanceaccesscontrolattributeconfiguration-accesscontrolattributevalue.html#cfn-sso-instanceaccesscontrolattributeconfiguration-accesscontrolattributevalue-source
     */
    readonly source: Array<string>;
  }

  /**
   * The InstanceAccessControlAttributeConfiguration property has been deprecated but is still supported for backwards compatibility purposes.
   *
   * We recomend that you use  AccessControlAttributes property instead.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sso-instanceaccesscontrolattributeconfiguration-instanceaccesscontrolattributeconfiguration.html
   */
  export interface InstanceAccessControlAttributeConfigurationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sso-instanceaccesscontrolattributeconfiguration-instanceaccesscontrolattributeconfiguration.html#cfn-sso-instanceaccesscontrolattributeconfiguration-instanceaccesscontrolattributeconfiguration-accesscontrolattributes
     */
    readonly accessControlAttributes: Array<CfnInstanceAccessControlAttributeConfiguration.AccessControlAttributeProperty | cdk.IResolvable> | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnInstanceAccessControlAttributeConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-instanceaccesscontrolattributeconfiguration.html
 */
export interface CfnInstanceAccessControlAttributeConfigurationProps {
  /**
   * Lists the attributes that are configured for ABAC in the specified IAM Identity Center instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-instanceaccesscontrolattributeconfiguration.html#cfn-sso-instanceaccesscontrolattributeconfiguration-accesscontrolattributes
   */
  readonly accessControlAttributes?: Array<CfnInstanceAccessControlAttributeConfiguration.AccessControlAttributeProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The InstanceAccessControlAttributeConfiguration property has been deprecated but is still supported for backwards compatibility purposes.
   *
   * We recomend that you use  AccessControlAttributes property instead.
   *
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-instanceaccesscontrolattributeconfiguration.html#cfn-sso-instanceaccesscontrolattributeconfiguration-instanceaccesscontrolattributeconfiguration
   */
  readonly instanceAccessControlAttributeConfiguration?: CfnInstanceAccessControlAttributeConfiguration.InstanceAccessControlAttributeConfigurationProperty | cdk.IResolvable;

  /**
   * The ARN of the IAM Identity Center instance under which the operation will be executed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-instanceaccesscontrolattributeconfiguration.html#cfn-sso-instanceaccesscontrolattributeconfiguration-instancearn
   */
  readonly instanceArn: string;
}

/**
 * Determine whether the given properties match those of a `AccessControlAttributeValueProperty`
 *
 * @param properties - the TypeScript properties of a `AccessControlAttributeValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceAccessControlAttributeConfigurationAccessControlAttributeValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("source", cdk.requiredValidator)(properties.source));
  errors.collect(cdk.propertyValidator("source", cdk.listValidator(cdk.validateString))(properties.source));
  return errors.wrap("supplied properties not correct for \"AccessControlAttributeValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceAccessControlAttributeConfigurationAccessControlAttributeValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceAccessControlAttributeConfigurationAccessControlAttributeValuePropertyValidator(properties).assertSuccess();
  return {
    "Source": cdk.listMapper(cdk.stringToCloudFormation)(properties.source)
  };
}

// @ts-ignore TS6133
function CfnInstanceAccessControlAttributeConfigurationAccessControlAttributeValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceAccessControlAttributeConfiguration.AccessControlAttributeValueProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceAccessControlAttributeConfiguration.AccessControlAttributeValueProperty>();
  ret.addPropertyResult("source", "Source", (properties.Source != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Source) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessControlAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `AccessControlAttributeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceAccessControlAttributeConfigurationAccessControlAttributePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", CfnInstanceAccessControlAttributeConfigurationAccessControlAttributeValuePropertyValidator)(properties.value));
  return errors.wrap("supplied properties not correct for \"AccessControlAttributeProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceAccessControlAttributeConfigurationAccessControlAttributePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceAccessControlAttributeConfigurationAccessControlAttributePropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": convertCfnInstanceAccessControlAttributeConfigurationAccessControlAttributeValuePropertyToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnInstanceAccessControlAttributeConfigurationAccessControlAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceAccessControlAttributeConfiguration.AccessControlAttributeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceAccessControlAttributeConfiguration.AccessControlAttributeProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? CfnInstanceAccessControlAttributeConfigurationAccessControlAttributeValuePropertyFromCloudFormation(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceAccessControlAttributeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceAccessControlAttributeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceAccessControlAttributeConfigurationInstanceAccessControlAttributeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessControlAttributes", cdk.requiredValidator)(properties.accessControlAttributes));
  errors.collect(cdk.propertyValidator("accessControlAttributes", cdk.listValidator(CfnInstanceAccessControlAttributeConfigurationAccessControlAttributePropertyValidator))(properties.accessControlAttributes));
  return errors.wrap("supplied properties not correct for \"InstanceAccessControlAttributeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceAccessControlAttributeConfigurationInstanceAccessControlAttributeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceAccessControlAttributeConfigurationInstanceAccessControlAttributeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AccessControlAttributes": cdk.listMapper(convertCfnInstanceAccessControlAttributeConfigurationAccessControlAttributePropertyToCloudFormation)(properties.accessControlAttributes)
  };
}

// @ts-ignore TS6133
function CfnInstanceAccessControlAttributeConfigurationInstanceAccessControlAttributeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceAccessControlAttributeConfiguration.InstanceAccessControlAttributeConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceAccessControlAttributeConfiguration.InstanceAccessControlAttributeConfigurationProperty>();
  ret.addPropertyResult("accessControlAttributes", "AccessControlAttributes", (properties.AccessControlAttributes != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceAccessControlAttributeConfigurationAccessControlAttributePropertyFromCloudFormation)(properties.AccessControlAttributes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnInstanceAccessControlAttributeConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnInstanceAccessControlAttributeConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceAccessControlAttributeConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessControlAttributes", cdk.listValidator(CfnInstanceAccessControlAttributeConfigurationAccessControlAttributePropertyValidator))(properties.accessControlAttributes));
  errors.collect(cdk.propertyValidator("instanceAccessControlAttributeConfiguration", CfnInstanceAccessControlAttributeConfigurationInstanceAccessControlAttributeConfigurationPropertyValidator)(properties.instanceAccessControlAttributeConfiguration));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  return errors.wrap("supplied properties not correct for \"CfnInstanceAccessControlAttributeConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnInstanceAccessControlAttributeConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceAccessControlAttributeConfigurationPropsValidator(properties).assertSuccess();
  return {
    "AccessControlAttributes": cdk.listMapper(convertCfnInstanceAccessControlAttributeConfigurationAccessControlAttributePropertyToCloudFormation)(properties.accessControlAttributes),
    "InstanceAccessControlAttributeConfiguration": convertCfnInstanceAccessControlAttributeConfigurationInstanceAccessControlAttributeConfigurationPropertyToCloudFormation(properties.instanceAccessControlAttributeConfiguration),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn)
  };
}

// @ts-ignore TS6133
function CfnInstanceAccessControlAttributeConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceAccessControlAttributeConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceAccessControlAttributeConfigurationProps>();
  ret.addPropertyResult("accessControlAttributes", "AccessControlAttributes", (properties.AccessControlAttributes != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceAccessControlAttributeConfigurationAccessControlAttributePropertyFromCloudFormation)(properties.AccessControlAttributes) : undefined));
  ret.addPropertyResult("instanceAccessControlAttributeConfiguration", "InstanceAccessControlAttributeConfiguration", (properties.InstanceAccessControlAttributeConfiguration != null ? CfnInstanceAccessControlAttributeConfigurationInstanceAccessControlAttributeConfigurationPropertyFromCloudFormation(properties.InstanceAccessControlAttributeConfiguration) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a permission set within a specified IAM Identity Center instance.
 *
 * @cloudformationResource AWS::SSO::PermissionSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html
 */
export class CfnPermissionSet extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSO::PermissionSet";

  /**
   * Build a CfnPermissionSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPermissionSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPermissionSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPermissionSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The permission set ARN of the permission set, such as `arn:aws:sso:::permissionSet/ins-instanceid/ps-permissionsetid` .
   *
   * @cloudformationAttribute PermissionSetArn
   */
  public readonly attrPermissionSetArn: string;

  /**
   * Specifies the names and paths of the customer managed policies that you have attached to your permission set.
   */
  public customerManagedPolicyReferences?: Array<CfnPermissionSet.CustomerManagedPolicyReferenceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the `PermissionSet` .
   */
  public description?: string;

  /**
   * The inline policy that is attached to the permission set.
   */
  public inlinePolicy?: any | cdk.IResolvable;

  /**
   * The ARN of the IAM Identity Center instance under which the operation will be executed.
   */
  public instanceArn: string;

  /**
   * A structure that stores the details of the AWS managed policy.
   */
  public managedPolicies?: Array<string>;

  /**
   * The name of the permission set.
   */
  public name: string;

  /**
   * Specifies the configuration of the AWS managed or customer managed policy that you want to set as a permissions boundary.
   */
  public permissionsBoundary?: cdk.IResolvable | CfnPermissionSet.PermissionsBoundaryProperty;

  /**
   * Used to redirect users within the application during the federation authentication process.
   */
  public relayStateType?: string;

  /**
   * The length of time that the application user sessions are valid for in the ISO-8601 standard.
   */
  public sessionDuration?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to attach to the new `PermissionSet` .
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPermissionSetProps) {
    super(scope, id, {
      "type": CfnPermissionSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "name", this);

    this.attrPermissionSetArn = cdk.Token.asString(this.getAtt("PermissionSetArn", cdk.ResolutionTypeHint.STRING));
    this.customerManagedPolicyReferences = props.customerManagedPolicyReferences;
    this.description = props.description;
    this.inlinePolicy = props.inlinePolicy;
    this.instanceArn = props.instanceArn;
    this.managedPolicies = props.managedPolicies;
    this.name = props.name;
    this.permissionsBoundary = props.permissionsBoundary;
    this.relayStateType = props.relayStateType;
    this.sessionDuration = props.sessionDuration;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SSO::PermissionSet", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "customerManagedPolicyReferences": this.customerManagedPolicyReferences,
      "description": this.description,
      "inlinePolicy": this.inlinePolicy,
      "instanceArn": this.instanceArn,
      "managedPolicies": this.managedPolicies,
      "name": this.name,
      "permissionsBoundary": this.permissionsBoundary,
      "relayStateType": this.relayStateType,
      "sessionDuration": this.sessionDuration,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPermissionSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPermissionSetPropsToCloudFormation(props);
  }
}

export namespace CfnPermissionSet {
  /**
   * Specifies the name and path of a customer managed policy.
   *
   * You must have an IAM policy that matches the name and path in each AWS account where you want to deploy your permission set.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sso-permissionset-customermanagedpolicyreference.html
   */
  export interface CustomerManagedPolicyReferenceProperty {
    /**
     * The name of the IAM policy that you have configured in each account where you want to deploy your permission set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sso-permissionset-customermanagedpolicyreference.html#cfn-sso-permissionset-customermanagedpolicyreference-name
     */
    readonly name: string;

    /**
     * The path to the IAM policy that you have configured in each account where you want to deploy your permission set.
     *
     * The default is `/` . For more information, see [Friendly names and paths](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-friendly-names) in the *IAM User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sso-permissionset-customermanagedpolicyreference.html#cfn-sso-permissionset-customermanagedpolicyreference-path
     */
    readonly path?: string;
  }

  /**
   * Specifies the configuration of the AWS managed or customer managed policy that you want to set as a permissions boundary.
   *
   * Specify either `CustomerManagedPolicyReference` to use the name and path of a customer managed policy, or `ManagedPolicyArn` to use the ARN of an AWS managed policy. A permissions boundary represents the maximum permissions that any policy can grant your role. For more information, see [Permissions boundaries for IAM entities](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) in the *IAM User Guide* .
   *
   * > Policies used as permissions boundaries don't provide permissions. You must also attach an IAM policy to the role. To learn how the effective permissions for a role are evaluated, see [IAM JSON policy evaluation logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) in the *IAM User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sso-permissionset-permissionsboundary.html
   */
  export interface PermissionsBoundaryProperty {
    /**
     * Specifies the name and path of a customer managed policy.
     *
     * You must have an IAM policy that matches the name and path in each AWS account where you want to deploy your permission set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sso-permissionset-permissionsboundary.html#cfn-sso-permissionset-permissionsboundary-customermanagedpolicyreference
     */
    readonly customerManagedPolicyReference?: CfnPermissionSet.CustomerManagedPolicyReferenceProperty | cdk.IResolvable;

    /**
     * The AWS managed policy ARN that you want to attach to a permission set as a permissions boundary.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sso-permissionset-permissionsboundary.html#cfn-sso-permissionset-permissionsboundary-managedpolicyarn
     */
    readonly managedPolicyArn?: string;
  }
}

/**
 * Properties for defining a `CfnPermissionSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html
 */
export interface CfnPermissionSetProps {
  /**
   * Specifies the names and paths of the customer managed policies that you have attached to your permission set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-customermanagedpolicyreferences
   */
  readonly customerManagedPolicyReferences?: Array<CfnPermissionSet.CustomerManagedPolicyReferenceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the `PermissionSet` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-description
   */
  readonly description?: string;

  /**
   * The inline policy that is attached to the permission set.
   *
   * > For `Length Constraints` , if a valid ARN is provided for a permission set, it is possible for an empty inline policy to be returned.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-inlinepolicy
   */
  readonly inlinePolicy?: any | cdk.IResolvable;

  /**
   * The ARN of the IAM Identity Center instance under which the operation will be executed.
   *
   * For more information about ARNs, see [Amazon Resource Names (ARNs) and AWS Service Namespaces](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html) in the *AWS General Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-instancearn
   */
  readonly instanceArn: string;

  /**
   * A structure that stores the details of the AWS managed policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-managedpolicies
   */
  readonly managedPolicies?: Array<string>;

  /**
   * The name of the permission set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-name
   */
  readonly name: string;

  /**
   * Specifies the configuration of the AWS managed or customer managed policy that you want to set as a permissions boundary.
   *
   * Specify either `CustomerManagedPolicyReference` to use the name and path of a customer managed policy, or `ManagedPolicyArn` to use the ARN of an AWS managed policy. A permissions boundary represents the maximum permissions that any policy can grant your role. For more information, see [Permissions boundaries for IAM entities](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) in the *IAM User Guide* .
   *
   * > Policies used as permissions boundaries don't provide permissions. You must also attach an IAM policy to the role. To learn how the effective permissions for a role are evaluated, see [IAM JSON policy evaluation logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) in the *IAM User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-permissionsboundary
   */
  readonly permissionsBoundary?: cdk.IResolvable | CfnPermissionSet.PermissionsBoundaryProperty;

  /**
   * Used to redirect users within the application during the federation authentication process.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-relaystatetype
   */
  readonly relayStateType?: string;

  /**
   * The length of time that the application user sessions are valid for in the ISO-8601 standard.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-sessionduration
   */
  readonly sessionDuration?: string;

  /**
   * The tags to attach to the new `PermissionSet` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CustomerManagedPolicyReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `CustomerManagedPolicyReferenceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPermissionSetCustomerManagedPolicyReferencePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  return errors.wrap("supplied properties not correct for \"CustomerManagedPolicyReferenceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPermissionSetCustomerManagedPolicyReferencePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPermissionSetCustomerManagedPolicyReferencePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Path": cdk.stringToCloudFormation(properties.path)
  };
}

// @ts-ignore TS6133
function CfnPermissionSetCustomerManagedPolicyReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissionSet.CustomerManagedPolicyReferenceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissionSet.CustomerManagedPolicyReferenceProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PermissionsBoundaryProperty`
 *
 * @param properties - the TypeScript properties of a `PermissionsBoundaryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPermissionSetPermissionsBoundaryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customerManagedPolicyReference", CfnPermissionSetCustomerManagedPolicyReferencePropertyValidator)(properties.customerManagedPolicyReference));
  errors.collect(cdk.propertyValidator("managedPolicyArn", cdk.validateString)(properties.managedPolicyArn));
  return errors.wrap("supplied properties not correct for \"PermissionsBoundaryProperty\"");
}

// @ts-ignore TS6133
function convertCfnPermissionSetPermissionsBoundaryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPermissionSetPermissionsBoundaryPropertyValidator(properties).assertSuccess();
  return {
    "CustomerManagedPolicyReference": convertCfnPermissionSetCustomerManagedPolicyReferencePropertyToCloudFormation(properties.customerManagedPolicyReference),
    "ManagedPolicyArn": cdk.stringToCloudFormation(properties.managedPolicyArn)
  };
}

// @ts-ignore TS6133
function CfnPermissionSetPermissionsBoundaryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPermissionSet.PermissionsBoundaryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissionSet.PermissionsBoundaryProperty>();
  ret.addPropertyResult("customerManagedPolicyReference", "CustomerManagedPolicyReference", (properties.CustomerManagedPolicyReference != null ? CfnPermissionSetCustomerManagedPolicyReferencePropertyFromCloudFormation(properties.CustomerManagedPolicyReference) : undefined));
  ret.addPropertyResult("managedPolicyArn", "ManagedPolicyArn", (properties.ManagedPolicyArn != null ? cfn_parse.FromCloudFormation.getString(properties.ManagedPolicyArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPermissionSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnPermissionSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPermissionSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customerManagedPolicyReferences", cdk.listValidator(CfnPermissionSetCustomerManagedPolicyReferencePropertyValidator))(properties.customerManagedPolicyReferences));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("inlinePolicy", cdk.validateObject)(properties.inlinePolicy));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("managedPolicies", cdk.listValidator(cdk.validateString))(properties.managedPolicies));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("permissionsBoundary", CfnPermissionSetPermissionsBoundaryPropertyValidator)(properties.permissionsBoundary));
  errors.collect(cdk.propertyValidator("relayStateType", cdk.validateString)(properties.relayStateType));
  errors.collect(cdk.propertyValidator("sessionDuration", cdk.validateString)(properties.sessionDuration));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPermissionSetProps\"");
}

// @ts-ignore TS6133
function convertCfnPermissionSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPermissionSetPropsValidator(properties).assertSuccess();
  return {
    "CustomerManagedPolicyReferences": cdk.listMapper(convertCfnPermissionSetCustomerManagedPolicyReferencePropertyToCloudFormation)(properties.customerManagedPolicyReferences),
    "Description": cdk.stringToCloudFormation(properties.description),
    "InlinePolicy": cdk.objectToCloudFormation(properties.inlinePolicy),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "ManagedPolicies": cdk.listMapper(cdk.stringToCloudFormation)(properties.managedPolicies),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PermissionsBoundary": convertCfnPermissionSetPermissionsBoundaryPropertyToCloudFormation(properties.permissionsBoundary),
    "RelayStateType": cdk.stringToCloudFormation(properties.relayStateType),
    "SessionDuration": cdk.stringToCloudFormation(properties.sessionDuration),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPermissionSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissionSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissionSetProps>();
  ret.addPropertyResult("customerManagedPolicyReferences", "CustomerManagedPolicyReferences", (properties.CustomerManagedPolicyReferences != null ? cfn_parse.FromCloudFormation.getArray(CfnPermissionSetCustomerManagedPolicyReferencePropertyFromCloudFormation)(properties.CustomerManagedPolicyReferences) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("inlinePolicy", "InlinePolicy", (properties.InlinePolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.InlinePolicy) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("managedPolicies", "ManagedPolicies", (properties.ManagedPolicies != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ManagedPolicies) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("permissionsBoundary", "PermissionsBoundary", (properties.PermissionsBoundary != null ? CfnPermissionSetPermissionsBoundaryPropertyFromCloudFormation(properties.PermissionsBoundary) : undefined));
  ret.addPropertyResult("relayStateType", "RelayStateType", (properties.RelayStateType != null ? cfn_parse.FromCloudFormation.getString(properties.RelayStateType) : undefined));
  ret.addPropertyResult("sessionDuration", "SessionDuration", (properties.SessionDuration != null ? cfn_parse.FromCloudFormation.getString(properties.SessionDuration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}