/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";

/**
 * Creates a new AWS secret access key and corresponding AWS access key ID for the specified user.
 *
 * The default status for new keys is `Active` .
 *
 * For information about quotas on the number of keys you can create, see [IAM and AWS STS quotas](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html) in the *IAM User Guide* .
 *
 * > To ensure the security of your AWS account , the secret access key is accessible only during key and user creation. You must save the key (for example, in a text file) if you want to be able to access it again. If a secret key is lost, you can rotate access keys by increasing the value of the `serial` property.
 *
 * @cloudformationResource AWS::IAM::AccessKey
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-accesskey.html
 */
export class CfnAccessKey extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::AccessKey";

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Returns the secret access key for the specified AWS::IAM::AccessKey resource. For example: wJalrXUtnFEMI/K7MDENG/bPxRfiCYzEXAMPLEKEY.
   *
   * @cloudformationAttribute SecretAccessKey
   */
  public readonly attrSecretAccessKey: string;

  /**
   * This value is specific to CloudFormation and can only be *incremented* .
   */
  public serial?: number;

  /**
   * The status of the access key.
   */
  public status?: string;

  /**
   * The name of the IAM user that the new key will belong to.
   */
  public userName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccessKeyProps) {
    super(scope, id, {
      "type": CfnAccessKey.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "userName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrSecretAccessKey = cdk.Token.asString(this.getAtt("SecretAccessKey", cdk.ResolutionTypeHint.STRING));
    this.serial = props.serial;
    this.status = props.status;
    this.userName = props.userName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "serial": this.serial,
      "status": this.status,
      "userName": this.userName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessKey.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccessKeyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAccessKey`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-accesskey.html
 */
export interface CfnAccessKeyProps {
  /**
   * This value is specific to CloudFormation and can only be *incremented* .
   *
   * Incrementing this value notifies CloudFormation that you want to rotate your access key. When you update your stack, CloudFormation will replace the existing access key with a new key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-accesskey.html#cfn-iam-accesskey-serial
   */
  readonly serial?: number;

  /**
   * The status of the access key.
   *
   * `Active` means that the key is valid for API calls, while `Inactive` means it is not.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-accesskey.html#cfn-iam-accesskey-status
   */
  readonly status?: string;

  /**
   * The name of the IAM user that the new key will belong to.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-accesskey.html#cfn-iam-accesskey-username
   */
  readonly userName: string;
}

/**
 * Determine whether the given properties match those of a `CfnAccessKeyProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessKeyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessKeyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("serial", cdk.validateNumber)(properties.serial));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("userName", cdk.requiredValidator)(properties.userName));
  errors.collect(cdk.propertyValidator("userName", cdk.validateString)(properties.userName));
  return errors.wrap("supplied properties not correct for \"CfnAccessKeyProps\"");
}

// @ts-ignore TS6133
function convertCfnAccessKeyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessKeyPropsValidator(properties).assertSuccess();
  return {
    "Serial": cdk.numberToCloudFormation(properties.serial),
    "Status": cdk.stringToCloudFormation(properties.status),
    "UserName": cdk.stringToCloudFormation(properties.userName)
  };
}

/**
 * Creates a new group.
 *
 * For information about the number of groups you can create, see [Limitations on IAM Entities](https://docs.aws.amazon.com/IAM/latest/UserGuide/LimitationsOnEntities.html) in the *IAM User Guide* .
 *
 * @cloudformationResource AWS::IAM::Group
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-group.html
 */
export class CfnGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::Group";

  /**
   * Returns the Amazon Resource Name (ARN) for the specified `AWS::IAM::Group` resource. For example: `arn:aws:iam::123456789012:group/mystack-mygroup-1DZETITOWEKVO` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the group to create. Do not include the path in this value.
   */
  public groupName?: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM policy you want to attach.
   */
  public managedPolicyArns?: Array<string>;

  /**
   * The path to the group. For more information about paths, see [IAM identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the *IAM User Guide* .
   */
  public path?: string;

  /**
   * Adds or updates an inline policy document that is embedded in the specified IAM group.
   */
  public policies?: Array<cdk.IResolvable | CfnGroup.PolicyProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGroupProps = {}) {
    super(scope, id, {
      "type": CfnGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.groupName = props.groupName;
    this.managedPolicyArns = props.managedPolicyArns;
    this.path = props.path;
    this.policies = props.policies;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "groupName": this.groupName,
      "managedPolicyArns": this.managedPolicyArns,
      "path": this.path,
      "policies": this.policies
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

export namespace CfnGroup {
  /**
   * Contains information about an attached policy.
   *
   * An attached policy is a managed policy that has been attached to a user, group, or role.
   *
   * For more information about managed policies, see [Managed Policies and Inline Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/policies-managed-vs-inline.html) in the *IAM User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-group-policy.html
   */
  export interface PolicyProperty {
    /**
     * The policy document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-group-policy.html#cfn-iam-group-policy-policydocument
     */
    readonly policyDocument: any | cdk.IResolvable;

    /**
     * The friendly name (not ARN) identifying the policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-group-policy.html#cfn-iam-group-policy-policyname
     */
    readonly policyName: string;
  }
}

/**
 * Properties for defining a `CfnGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-group.html
 */
export interface CfnGroupProps {
  /**
   * The name of the group to create. Do not include the path in this value.
   *
   * The group name must be unique within the account. Group names are not distinguished by case. For example, you cannot create groups named both "ADMINS" and "admins". If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the group name.
   *
   * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * If you specify a name, you must specify the `CAPABILITY_NAMED_IAM` value to acknowledge your template's capabilities. For more information, see [Acknowledging IAM Resources in AWS CloudFormation Templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities) .
   *
   * > Naming an IAM resource can cause an unrecoverable error if you reuse the same template in multiple Regions. To prevent this, we recommend using `Fn::Join` and `AWS::Region` to create a Region-specific name, as in the following example: `{"Fn::Join": ["", [{"Ref": "AWS::Region"}, {"Ref": "MyResourceName"}]]}` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-group.html#cfn-iam-group-groupname
   */
  readonly groupName?: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM policy you want to attach.
   *
   * For more information about ARNs, see [Amazon Resource Names (ARNs)](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) in the *AWS General Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-group.html#cfn-iam-group-managedpolicyarns
   */
  readonly managedPolicyArns?: Array<string>;

  /**
   * The path to the group. For more information about paths, see [IAM identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the *IAM User Guide* .
   *
   * This parameter is optional. If it is not included, it defaults to a slash (/).
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! ( `\u0021` ) through the DEL character ( `\u007F` ), including most punctuation characters, digits, and upper and lowercased letters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-group.html#cfn-iam-group-path
   */
  readonly path?: string;

  /**
   * Adds or updates an inline policy document that is embedded in the specified IAM group.
   *
   * To view AWS::IAM::Group snippets, see [Declaring an IAM Group Resource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-iam.html#scenario-iam-group) .
   *
   * > The name of each inline policy for a role, user, or group must be unique. If you don't choose unique names, updates to the IAM identity will fail.
   *
   * For information about limits on the number of inline policies that you can embed in a group, see [Limitations on IAM Entities](https://docs.aws.amazon.com/IAM/latest/UserGuide/LimitationsOnEntities.html) in the *IAM User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-group.html#cfn-iam-group-policies
   */
  readonly policies?: Array<cdk.IResolvable | CfnGroup.PolicyProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `PolicyProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGroupPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyName", cdk.requiredValidator)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  return errors.wrap("supplied properties not correct for \"PolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnGroupPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGroupPolicyPropertyValidator(properties).assertSuccess();
  return {
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument),
    "PolicyName": cdk.stringToCloudFormation(properties.policyName)
  };
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
  errors.collect(cdk.propertyValidator("groupName", cdk.validateString)(properties.groupName));
  errors.collect(cdk.propertyValidator("managedPolicyArns", cdk.listValidator(cdk.validateString))(properties.managedPolicyArns));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("policies", cdk.listValidator(CfnGroupPolicyPropertyValidator))(properties.policies));
  return errors.wrap("supplied properties not correct for \"CfnGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGroupPropsValidator(properties).assertSuccess();
  return {
    "GroupName": cdk.stringToCloudFormation(properties.groupName),
    "ManagedPolicyArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.managedPolicyArns),
    "Path": cdk.stringToCloudFormation(properties.path),
    "Policies": cdk.listMapper(convertCfnGroupPolicyPropertyToCloudFormation)(properties.policies)
  };
}

/**
 * Adds or updates an inline policy document that is embedded in the specified IAM group.
 *
 * A group can also have managed policies attached to it. To attach a managed policy to a group, use [`AWS::IAM::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-group.html) . To create a new managed policy, use [`AWS::IAM::ManagedPolicy`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-managedpolicy.html) . For information about policies, see [Managed policies and inline policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/policies-managed-vs-inline.html) in the *IAM User Guide* .
 *
 * For information about the maximum number of inline policies that you can embed in a group, see [IAM and AWS STS quotas](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html) in the *IAM User Guide* .
 *
 * @cloudformationResource AWS::IAM::GroupPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-grouppolicy.html
 */
export class CfnGroupPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::GroupPolicy";

  /**
   * The name of the group to associate the policy with.
   */
  public groupName: string;

  /**
   * The policy document.
   */
  public policyDocument?: any | cdk.IResolvable;

  /**
   * The name of the policy document.
   */
  public policyName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGroupPolicyProps) {
    super(scope, id, {
      "type": CfnGroupPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "groupName", this);
    cdk.requireProperty(props, "policyName", this);

    this.groupName = props.groupName;
    this.policyDocument = props.policyDocument;
    this.policyName = props.policyName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "groupName": this.groupName,
      "policyDocument": this.policyDocument,
      "policyName": this.policyName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGroupPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGroupPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnGroupPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-grouppolicy.html
 */
export interface CfnGroupPolicyProps {
  /**
   * The name of the group to associate the policy with.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-grouppolicy.html#cfn-iam-grouppolicy-groupname
   */
  readonly groupName: string;

  /**
   * The policy document.
   *
   * You must provide policies in JSON format in IAM. However, for AWS CloudFormation templates formatted in YAML, you can provide the policy in JSON or YAML format. AWS CloudFormation always converts a YAML policy to JSON format before submitting it to IAM.
   *
   * The [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) used to validate this parameter is a string of characters consisting of the following:
   *
   * - Any printable ASCII character ranging from the space character ( `\u0020` ) through the end of the ASCII character range
   * - The printable characters in the Basic Latin and Latin-1 Supplement character set (through `\u00FF` )
   * - The special characters tab ( `\u0009` ), line feed ( `\u000A` ), and carriage return ( `\u000D` )
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-grouppolicy.html#cfn-iam-grouppolicy-policydocument
   */
  readonly policyDocument?: any | cdk.IResolvable;

  /**
   * The name of the policy document.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-grouppolicy.html#cfn-iam-grouppolicy-policyname
   */
  readonly policyName: string;
}

/**
 * Determine whether the given properties match those of a `CfnGroupPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnGroupPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGroupPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupName", cdk.requiredValidator)(properties.groupName));
  errors.collect(cdk.propertyValidator("groupName", cdk.validateString)(properties.groupName));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyName", cdk.requiredValidator)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  return errors.wrap("supplied properties not correct for \"CfnGroupPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnGroupPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGroupPolicyPropsValidator(properties).assertSuccess();
  return {
    "GroupName": cdk.stringToCloudFormation(properties.groupName),
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument),
    "PolicyName": cdk.stringToCloudFormation(properties.policyName)
  };
}

/**
 * Creates a new instance profile. For information about instance profiles, see [Using instance profiles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) .
 *
 * For information about the number of instance profiles you can create, see [IAM object quotas](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html) in the *IAM User Guide* .
 *
 * @cloudformationResource AWS::IAM::InstanceProfile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-instanceprofile.html
 */
export class CfnInstanceProfile extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::InstanceProfile";

  /**
   * Returns the Amazon Resource Name (ARN) for the instance profile. For example:
   *
   * `{"Fn::GetAtt" : ["MyProfile", "Arn"] }`
   *
   * This returns a value such as `arn:aws:iam::1234567890:instance-profile/MyProfile-ASDNSDLKJ` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the instance profile to create.
   */
  public instanceProfileName?: string;

  /**
   * The path to the instance profile.
   */
  public path?: string;

  /**
   * The name of the role to associate with the instance profile.
   */
  public roles: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnInstanceProfileProps) {
    super(scope, id, {
      "type": CfnInstanceProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "roles", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.instanceProfileName = props.instanceProfileName;
    this.path = props.path;
    this.roles = props.roles;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "instanceProfileName": this.instanceProfileName,
      "path": this.path,
      "roles": this.roles
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnInstanceProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnInstanceProfilePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnInstanceProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-instanceprofile.html
 */
export interface CfnInstanceProfileProps {
  /**
   * The name of the instance profile to create.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-instanceprofile.html#cfn-iam-instanceprofile-instanceprofilename
   */
  readonly instanceProfileName?: string;

  /**
   * The path to the instance profile.
   *
   * For more information about paths, see [IAM Identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the *IAM User Guide* .
   *
   * This parameter is optional. If it is not included, it defaults to a slash (/).
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! ( `\u0021` ) through the DEL character ( `\u007F` ), including most punctuation characters, digits, and upper and lowercased letters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-instanceprofile.html#cfn-iam-instanceprofile-path
   */
  readonly path?: string;

  /**
   * The name of the role to associate with the instance profile.
   *
   * Only one role can be assigned to an EC2 instance at a time, and all applications on the instance share the same role and permissions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-instanceprofile.html#cfn-iam-instanceprofile-roles
   */
  readonly roles: Array<string>;
}

/**
 * Determine whether the given properties match those of a `CfnInstanceProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnInstanceProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceProfileName", cdk.validateString)(properties.instanceProfileName));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("roles", cdk.requiredValidator)(properties.roles));
  errors.collect(cdk.propertyValidator("roles", cdk.listValidator(cdk.validateString))(properties.roles));
  return errors.wrap("supplied properties not correct for \"CfnInstanceProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnInstanceProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceProfilePropsValidator(properties).assertSuccess();
  return {
    "InstanceProfileName": cdk.stringToCloudFormation(properties.instanceProfileName),
    "Path": cdk.stringToCloudFormation(properties.path),
    "Roles": cdk.listMapper(cdk.stringToCloudFormation)(properties.roles)
  };
}

/**
 * Creates a new managed policy for your AWS account .
 *
 * This operation creates a policy version with a version identifier of `v1` and sets v1 as the policy's default version. For more information about policy versions, see [Versioning for managed policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/policies-managed-versions.html) in the *IAM User Guide* .
 *
 * As a best practice, you can validate your IAM policies. To learn more, see [Validating IAM policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_policy-validator.html) in the *IAM User Guide* .
 *
 * For more information about managed policies in general, see [Managed policies and inline policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/policies-managed-vs-inline.html) in the *IAM User Guide* .
 *
 * @cloudformationResource AWS::IAM::ManagedPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-managedpolicy.html
 */
export class CfnManagedPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::ManagedPolicy";

  /**
   * The number of principal entities (users, groups, and roles) that the policy is attached to.
   *
   * @cloudformationAttribute AttachmentCount
   */
  public readonly attrAttachmentCount: number;

  /**
   * The date and time, in [ISO 8601 date-time format](https://docs.aws.amazon.com/http://www.iso.org/iso/iso8601) , when the policy was created.
   *
   * @cloudformationAttribute CreateDate
   */
  public readonly attrCreateDate: string;

  /**
   * The identifier for the version of the policy that is set as the default (operative) version.
   *
   * For more information about policy versions, see [Versioning for managed policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/policies-managed-versions.html) in the *IAM User Guide* .
   *
   * @cloudformationAttribute DefaultVersionId
   */
  public readonly attrDefaultVersionId: string;

  /**
   * Specifies whether the policy can be attached to an IAM user, group, or role.
   *
   * @cloudformationAttribute IsAttachable
   */
  public readonly attrIsAttachable: cdk.IResolvable;

  /**
   * The number of entities (users and roles) for which the policy is used as the permissions boundary.
   *
   * For more information about permissions boundaries, see [Permissions boundaries for IAM identities](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) in the *IAM User Guide* .
   *
   * @cloudformationAttribute PermissionsBoundaryUsageCount
   */
  public readonly attrPermissionsBoundaryUsageCount: number;

  /**
   * Amazon Resource Name (ARN) of the managed policy
   *
   * @cloudformationAttribute PolicyArn
   */
  public readonly attrPolicyArn: string;

  /**
   * The stable and unique string identifying the policy.
   *
   * For more information about IDs, see [IAM identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the *IAM User Guide* .
   *
   * @cloudformationAttribute PolicyId
   */
  public readonly attrPolicyId: string;

  /**
   * The date and time, in [ISO 8601 date-time format](https://docs.aws.amazon.com/http://www.iso.org/iso/iso8601) , when the policy was last updated.
   *
   * When a policy has only one version, this field contains the date and time when the policy was created. When a policy has more than one version, this field contains the date and time when the most recent policy version was created.
   *
   * @cloudformationAttribute UpdateDate
   */
  public readonly attrUpdateDate: string;

  /**
   * A friendly description of the policy.
   */
  public description?: string;

  /**
   * The name (friendly name, not ARN) of the group to attach the policy to.
   */
  public groups?: Array<string>;

  /**
   * The friendly name of the policy.
   */
  public managedPolicyName?: string;

  /**
   * The path for the policy.
   */
  public path?: string;

  /**
   * The JSON policy document that you want to use as the content for the new policy.
   */
  public policyDocument: any | cdk.IResolvable;

  /**
   * The name (friendly name, not ARN) of the role to attach the policy to.
   */
  public roles?: Array<string>;

  /**
   * The name (friendly name, not ARN) of the IAM user to attach the policy to.
   */
  public users?: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnManagedPolicyProps) {
    super(scope, id, {
      "type": CfnManagedPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policyDocument", this);

    this.attrAttachmentCount = cdk.Token.asNumber(this.getAtt("AttachmentCount", cdk.ResolutionTypeHint.NUMBER));
    this.attrCreateDate = cdk.Token.asString(this.getAtt("CreateDate", cdk.ResolutionTypeHint.STRING));
    this.attrDefaultVersionId = cdk.Token.asString(this.getAtt("DefaultVersionId", cdk.ResolutionTypeHint.STRING));
    this.attrIsAttachable = this.getAtt("IsAttachable");
    this.attrPermissionsBoundaryUsageCount = cdk.Token.asNumber(this.getAtt("PermissionsBoundaryUsageCount", cdk.ResolutionTypeHint.NUMBER));
    this.attrPolicyArn = cdk.Token.asString(this.getAtt("PolicyArn", cdk.ResolutionTypeHint.STRING));
    this.attrPolicyId = cdk.Token.asString(this.getAtt("PolicyId", cdk.ResolutionTypeHint.STRING));
    this.attrUpdateDate = cdk.Token.asString(this.getAtt("UpdateDate", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.groups = props.groups;
    this.managedPolicyName = props.managedPolicyName;
    this.path = props.path;
    this.policyDocument = props.policyDocument;
    this.roles = props.roles;
    this.users = props.users;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "groups": this.groups,
      "managedPolicyName": this.managedPolicyName,
      "path": this.path,
      "policyDocument": this.policyDocument,
      "roles": this.roles,
      "users": this.users
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnManagedPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnManagedPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnManagedPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-managedpolicy.html
 */
export interface CfnManagedPolicyProps {
  /**
   * A friendly description of the policy.
   *
   * Typically used to store information about the permissions defined in the policy. For example, "Grants access to production DynamoDB tables."
   *
   * The policy description is immutable. After a value is assigned, it cannot be changed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-managedpolicy.html#cfn-iam-managedpolicy-description
   */
  readonly description?: string;

  /**
   * The name (friendly name, not ARN) of the group to attach the policy to.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-managedpolicy.html#cfn-iam-managedpolicy-groups
   */
  readonly groups?: Array<string>;

  /**
   * The friendly name of the policy.
   *
   * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * If you specify a name, you must specify the `CAPABILITY_NAMED_IAM` value to acknowledge your template's capabilities. For more information, see [Acknowledging IAM Resources in AWS CloudFormation Templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities) .
   *
   * > Naming an IAM resource can cause an unrecoverable error if you reuse the same template in multiple Regions. To prevent this, we recommend using `Fn::Join` and `AWS::Region` to create a Region-specific name, as in the following example: `{"Fn::Join": ["", [{"Ref": "AWS::Region"}, {"Ref": "MyResourceName"}]]}` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-managedpolicy.html#cfn-iam-managedpolicy-managedpolicyname
   */
  readonly managedPolicyName?: string;

  /**
   * The path for the policy.
   *
   * For more information about paths, see [IAM identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the *IAM User Guide* .
   *
   * This parameter is optional. If it is not included, it defaults to a slash (/).
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! ( `\u0021` ) through the DEL character ( `\u007F` ), including most punctuation characters, digits, and upper and lowercased letters.
   *
   * > You cannot use an asterisk (*) in the path name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-managedpolicy.html#cfn-iam-managedpolicy-path
   */
  readonly path?: string;

  /**
   * The JSON policy document that you want to use as the content for the new policy.
   *
   * You must provide policies in JSON format in IAM. However, for AWS CloudFormation templates formatted in YAML, you can provide the policy in JSON or YAML format. AWS CloudFormation always converts a YAML policy to JSON format before submitting it to IAM.
   *
   * The maximum length of the policy document that you can pass in this operation, including whitespace, is listed below. To view the maximum character counts of a managed policy with no whitespaces, see [IAM and AWS STS character quotas](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html#reference_iam-quotas-entity-length) .
   *
   * To learn more about JSON policy grammar, see [Grammar of the IAM JSON policy language](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_grammar.html) in the *IAM User Guide* .
   *
   * The [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) used to validate this parameter is a string of characters consisting of the following:
   *
   * - Any printable ASCII character ranging from the space character ( `\u0020` ) through the end of the ASCII character range
   * - The printable characters in the Basic Latin and Latin-1 Supplement character set (through `\u00FF` )
   * - The special characters tab ( `\u0009` ), line feed ( `\u000A` ), and carriage return ( `\u000D` )
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-managedpolicy.html#cfn-iam-managedpolicy-policydocument
   */
  readonly policyDocument: any | cdk.IResolvable;

  /**
   * The name (friendly name, not ARN) of the role to attach the policy to.
   *
   * This parameter allows (per its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * > If an external policy (such as `AWS::IAM::Policy` or `AWS::IAM::ManagedPolicy` ) has a `Ref` to a role and if a resource (such as `AWS::ECS::Service` ) also has a `Ref` to the same role, add a `DependsOn` attribute to the resource to make the resource depend on the external policy. This dependency ensures that the role's policy is available throughout the resource's lifecycle. For example, when you delete a stack with an `AWS::ECS::Service` resource, the `DependsOn` attribute ensures that AWS CloudFormation deletes the `AWS::ECS::Service` resource before deleting its role's policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-managedpolicy.html#cfn-iam-managedpolicy-roles
   */
  readonly roles?: Array<string>;

  /**
   * The name (friendly name, not ARN) of the IAM user to attach the policy to.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-managedpolicy.html#cfn-iam-managedpolicy-users
   */
  readonly users?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `CfnManagedPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnManagedPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnManagedPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("groups", cdk.listValidator(cdk.validateString))(properties.groups));
  errors.collect(cdk.propertyValidator("managedPolicyName", cdk.validateString)(properties.managedPolicyName));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("roles", cdk.listValidator(cdk.validateString))(properties.roles));
  errors.collect(cdk.propertyValidator("users", cdk.listValidator(cdk.validateString))(properties.users));
  return errors.wrap("supplied properties not correct for \"CfnManagedPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnManagedPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnManagedPolicyPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Groups": cdk.listMapper(cdk.stringToCloudFormation)(properties.groups),
    "ManagedPolicyName": cdk.stringToCloudFormation(properties.managedPolicyName),
    "Path": cdk.stringToCloudFormation(properties.path),
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument),
    "Roles": cdk.listMapper(cdk.stringToCloudFormation)(properties.roles),
    "Users": cdk.listMapper(cdk.stringToCloudFormation)(properties.users)
  };
}

/**
 * Creates or updates an IAM entity to describe an identity provider (IdP) that supports [OpenID Connect (OIDC)](https://docs.aws.amazon.com/http://openid.net/connect/) .
 *
 * The OIDC provider that you create with this operation can be used as a principal in a role's trust policy. Such a policy establishes a trust relationship between AWS and the OIDC provider.
 *
 * When you create the IAM OIDC provider, you specify the following:
 *
 * - The URL of the OIDC identity provider (IdP) to trust
 * - A list of client IDs (also known as audiences) that identify the application or applications that are allowed to authenticate using the OIDC provider
 * - A list of tags that are attached to the specified IAM OIDC provider
 * - A list of thumbprints of one or more server certificates that the IdP uses
 *
 * You get all of this information from the OIDC IdP that you want to use to access AWS .
 *
 * When you update the IAM OIDC provider, you specify the following:
 *
 * - The URL of the OIDC identity provider (IdP) to trust
 * - A list of client IDs (also known as audiences) that replaces the existing list of client IDs associated with the OIDC IdP
 * - A list of tags that replaces the existing list of tags attached to the specified IAM OIDC provider
 * - A list of thumbprints that replaces the existing list of server certificates thumbprints that the IdP uses
 *
 * > The trust for the OIDC provider is derived from the IAM provider that this operation creates. Therefore, it is best to limit access to the [CreateOpenIDConnectProvider](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateOpenIDConnectProvider.html) operation to highly privileged users.
 *
 * @cloudformationResource AWS::IAM::OIDCProvider
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html
 */
export class CfnOIDCProvider extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::OIDCProvider";

  /**
   * Returns the Amazon Resource Name (ARN) for the specified `AWS::IAM::OIDCProvider` resource.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A list of client IDs (also known as audiences) that are associated with the specified IAM OIDC provider resource object.
   */
  public clientIdList?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tags that are attached to the specified IAM OIDC provider.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A list of certificate thumbprints that are associated with the specified IAM OIDC provider resource object.
   */
  public thumbprintList: Array<string>;

  /**
   * The URL that the IAM OIDC provider resource object is associated with.
   */
  public url?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnOIDCProviderProps) {
    super(scope, id, {
      "type": CfnOIDCProvider.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "thumbprintList", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.clientIdList = props.clientIdList;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IAM::OIDCProvider", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.thumbprintList = props.thumbprintList;
    this.url = props.url;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clientIdList": this.clientIdList,
      "tags": this.tags.renderTags(),
      "thumbprintList": this.thumbprintList,
      "url": this.url
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnOIDCProvider.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnOIDCProviderPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnOIDCProvider`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html
 */
export interface CfnOIDCProviderProps {
  /**
   * A list of client IDs (also known as audiences) that are associated with the specified IAM OIDC provider resource object.
   *
   * For more information, see [CreateOpenIDConnectProvider](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateOpenIDConnectProvider.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html#cfn-iam-oidcprovider-clientidlist
   */
  readonly clientIdList?: Array<string>;

  /**
   * A list of tags that are attached to the specified IAM OIDC provider.
   *
   * The returned list of tags is sorted by tag key. For more information about tagging, see [Tagging IAM resources](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_tags.html) in the *IAM User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html#cfn-iam-oidcprovider-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A list of certificate thumbprints that are associated with the specified IAM OIDC provider resource object.
   *
   * For more information, see [CreateOpenIDConnectProvider](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateOpenIDConnectProvider.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html#cfn-iam-oidcprovider-thumbprintlist
   */
  readonly thumbprintList: Array<string>;

  /**
   * The URL that the IAM OIDC provider resource object is associated with.
   *
   * For more information, see [CreateOpenIDConnectProvider](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateOpenIDConnectProvider.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html#cfn-iam-oidcprovider-url
   */
  readonly url?: string;
}

/**
 * Determine whether the given properties match those of a `CfnOIDCProviderProps`
 *
 * @param properties - the TypeScript properties of a `CfnOIDCProviderProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOIDCProviderPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientIdList", cdk.listValidator(cdk.validateString))(properties.clientIdList));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("thumbprintList", cdk.requiredValidator)(properties.thumbprintList));
  errors.collect(cdk.propertyValidator("thumbprintList", cdk.listValidator(cdk.validateString))(properties.thumbprintList));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"CfnOIDCProviderProps\"");
}

// @ts-ignore TS6133
function convertCfnOIDCProviderPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOIDCProviderPropsValidator(properties).assertSuccess();
  return {
    "ClientIdList": cdk.listMapper(cdk.stringToCloudFormation)(properties.clientIdList),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "ThumbprintList": cdk.listMapper(cdk.stringToCloudFormation)(properties.thumbprintList),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

/**
 * Adds or updates an inline policy document that is embedded in the specified IAM group, user or role.
 *
 * An IAM user can also have a managed policy attached to it. For information about policies, see [Managed Policies and Inline Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/policies-managed-vs-inline.html) in the *IAM User Guide* .
 *
 * The Groups, Roles, and Users properties are optional. However, you must specify at least one of these properties.
 *
 * For information about policy documents see [Creating IAM policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html) in the *IAM User Guide* .
 *
 * For information about limits on the number of inline policies that you can embed in an identity, see [Limitations on IAM Entities](https://docs.aws.amazon.com/IAM/latest/UserGuide/LimitationsOnEntities.html) in the *IAM User Guide* .
 *
 * > This resource does not support [drift detection](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html) . The following inline policy resource types support drift detection:
 * >
 * > - [`AWS::IAM::GroupPolicy`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-grouppolicy.html)
 * > - [`AWS::IAM::RolePolicy`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-rolepolicy.html)
 * > - [`AWS::IAM::UserPolicy`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-userpolicy.html)
 *
 * @cloudformationResource AWS::IAM::Policy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html
 */
export class CfnPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::Policy";

  /**
   * The provider-assigned unique ID for this resource
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the group to associate the policy with.
   */
  public groups?: Array<string>;

  /**
   * The policy document.
   */
  public policyDocument: any | cdk.IResolvable;

  /**
   * The name of the policy document.
   */
  public policyName: string;

  /**
   * The name of the role to associate the policy with.
   */
  public roles?: Array<string>;

  /**
   * The name of the user to associate the policy with.
   */
  public users?: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPolicyProps) {
    super(scope, id, {
      "type": CfnPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policyDocument", this);
    cdk.requireProperty(props, "policyName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.groups = props.groups;
    this.policyDocument = props.policyDocument;
    this.policyName = props.policyName;
    this.roles = props.roles;
    this.users = props.users;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "groups": this.groups,
      "policyDocument": this.policyDocument,
      "policyName": this.policyName,
      "roles": this.roles,
      "users": this.users
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html
 */
export interface CfnPolicyProps {
  /**
   * The name of the group to associate the policy with.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-groups
   */
  readonly groups?: Array<string>;

  /**
   * The policy document.
   *
   * You must provide policies in JSON format in IAM. However, for AWS CloudFormation templates formatted in YAML, you can provide the policy in JSON or YAML format. AWS CloudFormation always converts a YAML policy to JSON format before submitting it to IAM.
   *
   * The [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) used to validate this parameter is a string of characters consisting of the following:
   *
   * - Any printable ASCII character ranging from the space character ( `\u0020` ) through the end of the ASCII character range
   * - The printable characters in the Basic Latin and Latin-1 Supplement character set (through `\u00FF` )
   * - The special characters tab ( `\u0009` ), line feed ( `\u000A` ), and carriage return ( `\u000D` )
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-policydocument
   */
  readonly policyDocument: any | cdk.IResolvable;

  /**
   * The name of the policy document.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-policyname
   */
  readonly policyName: string;

  /**
   * The name of the role to associate the policy with.
   *
   * This parameter allows (per its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * > If an external policy (such as `AWS::IAM::Policy` or `AWS::IAM::ManagedPolicy` ) has a `Ref` to a role and if a resource (such as `AWS::ECS::Service` ) also has a `Ref` to the same role, add a `DependsOn` attribute to the resource to make the resource depend on the external policy. This dependency ensures that the role's policy is available throughout the resource's lifecycle. For example, when you delete a stack with an `AWS::ECS::Service` resource, the `DependsOn` attribute ensures that AWS CloudFormation deletes the `AWS::ECS::Service` resource before deleting its role's policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-roles
   */
  readonly roles?: Array<string>;

  /**
   * The name of the user to associate the policy with.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-users
   */
  readonly users?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `CfnPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groups", cdk.listValidator(cdk.validateString))(properties.groups));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyName", cdk.requiredValidator)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  errors.collect(cdk.propertyValidator("roles", cdk.listValidator(cdk.validateString))(properties.roles));
  errors.collect(cdk.propertyValidator("users", cdk.listValidator(cdk.validateString))(properties.users));
  return errors.wrap("supplied properties not correct for \"CfnPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPolicyPropsValidator(properties).assertSuccess();
  return {
    "Groups": cdk.listMapper(cdk.stringToCloudFormation)(properties.groups),
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument),
    "PolicyName": cdk.stringToCloudFormation(properties.policyName),
    "Roles": cdk.listMapper(cdk.stringToCloudFormation)(properties.roles),
    "Users": cdk.listMapper(cdk.stringToCloudFormation)(properties.users)
  };
}

/**
 * Creates a new role for your AWS account Interface
 */
export interface ICfnRole extends constructs.IConstruct {
  /**
   * Returns the Amazon Resource Name (ARN) for the role. For example:
   *
   * `{"Fn::GetAtt" : ["MyRole", "Arn"] }`
   *
   * This will return a value such as `arn:aws:iam::1234567890:role/MyRole-AJJHDSKSDF` .
   *
   * @cloudformationAttribute Arn
   */
  readonly attrArn: string;
}

/**
 * Creates a new role for your AWS account .
 *
 * For more information about roles, see [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) in the *IAM User Guide* . For information about quotas for role names and the number of roles you can create, see [IAM and AWS STS quotas](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html) in the *IAM User Guide* .
 *
 * @cloudformationResource AWS::IAM::Role
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html
 */
export class CfnRole extends cdk.CfnResource implements ICfnRole, cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::Role";

  /**
   * Returns the Amazon Resource Name (ARN) for the role. For example:
   *
   * `{"Fn::GetAtt" : ["MyRole", "Arn"] }`
   *
   * This will return a value such as `arn:aws:iam::1234567890:role/MyRole-AJJHDSKSDF` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the stable and unique string identifying the role. For example, `AIDAJQABLZS4A3QDU576Q` .
   *
   * For more information about IDs, see [IAM Identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html) in the *IAM User Guide* .
   *
   * @cloudformationAttribute RoleId
   */
  public readonly attrRoleId: string;

  /**
   * The trust policy that is associated with this role.
   */
  public assumeRolePolicyDocument: any | cdk.IResolvable;

  /**
   * A description of the role that you provide.
   */
  public description?: string;

  /**
   * A list of Amazon Resource Names (ARNs) of the IAM managed policies that you want to attach to the role.
   */
  public managedPolicyArns?: Array<string>;

  /**
   * The maximum session duration (in seconds) that you want to set for the specified role.
   */
  public maxSessionDuration?: number;

  /**
   * The path to the role. For more information about paths, see [IAM Identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the *IAM User Guide* .
   */
  public path?: string;

  /**
   * The ARN of the policy used to set the permissions boundary for the role.
   */
  public permissionsBoundary?: string;

  /**
   * Adds or updates an inline policy document that is embedded in the specified IAM role.
   */
  public policies?: Array<cdk.IResolvable | CfnRole.PolicyProperty> | cdk.IResolvable;

  /**
   * A name for the IAM role, up to 64 characters in length.
   */
  public roleName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tags that are attached to the role.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRoleProps) {
    super(scope, id, {
      "type": CfnRole.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "assumeRolePolicyDocument", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrRoleId = cdk.Token.asString(this.getAtt("RoleId", cdk.ResolutionTypeHint.STRING));
    this.assumeRolePolicyDocument = props.assumeRolePolicyDocument;
    this.description = props.description;
    this.managedPolicyArns = props.managedPolicyArns;
    this.maxSessionDuration = props.maxSessionDuration;
    this.path = props.path;
    this.permissionsBoundary = props.permissionsBoundary;
    this.policies = props.policies;
    // check if policies is of array type and add some other array to it
    if (this.policies && Array.isArray(this.policies)) {
      this.policies.push({
        "policyName": "Inline",
        "policyDocument": {},
      });
    }
    if (this.policies )
    this.policies
    this.roleName = props.roleName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IAM::Role", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "assumeRolePolicyDocument": this.assumeRolePolicyDocument,
      "description": this.description,
      "managedPolicyArns": this.managedPolicyArns,
      "maxSessionDuration": this.maxSessionDuration,
      "path": this.path,
      "permissionsBoundary": this.permissionsBoundary,
      "policies": this.policies,
      "roleName": this.roleName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRole.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRolePropsToCloudFormation(props);
  }
}

export namespace CfnRole {
  /**
   * Contains information about an attached policy.
   *
   * An attached policy is a managed policy that has been attached to a user, group, or role.
   *
   * For more information about managed policies, refer to [Managed Policies and Inline Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/policies-managed-vs-inline.html) in the *IAM User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-role-policy.html
   */
  export interface PolicyProperty {
    /**
     * The entire contents of the policy that defines permissions.
     *
     * For more information, see [Overview of JSON policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policies-json) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-role-policy.html#cfn-iam-role-policy-policydocument
     */
    readonly policyDocument: any | cdk.IResolvable;

    /**
     * The friendly name (not ARN) identifying the policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-role-policy.html#cfn-iam-role-policy-policyname
     */
    readonly policyName: string;
  }
}

/**
 * Properties for defining a `CfnRole`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html
 */
export interface CfnRoleProps {
  /**
   * The trust policy that is associated with this role.
   *
   * Trust policies define which entities can assume the role. You can associate only one trust policy with a role. For an example of a policy that can be used to assume a role, see [Template Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#aws-resource-iam-role--examples) . For more information about the elements that you can use in an IAM policy, see [IAM Policy Elements Reference](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html) in the *IAM User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-assumerolepolicydocument
   */
  readonly assumeRolePolicyDocument: any | cdk.IResolvable;

  /**
   * A description of the role that you provide.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-description
   */
  readonly description?: string;

  /**
   * A list of Amazon Resource Names (ARNs) of the IAM managed policies that you want to attach to the role.
   *
   * For more information about ARNs, see [Amazon Resource Names (ARNs) and AWS Service Namespaces](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) in the *AWS General Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-managedpolicyarns
   */
  readonly managedPolicyArns?: Array<string>;

  /**
   * The maximum session duration (in seconds) that you want to set for the specified role.
   *
   * If you do not specify a value for this setting, the default value of one hour is applied. This setting can have a value from 1 hour to 12 hours.
   *
   * Anyone who assumes the role from the AWS CLI or API can use the `DurationSeconds` API parameter or the `duration-seconds` AWS CLI parameter to request a longer session. The `MaxSessionDuration` setting determines the maximum duration that can be requested using the `DurationSeconds` parameter. If users don't specify a value for the `DurationSeconds` parameter, their security credentials are valid for one hour by default. This applies when you use the `AssumeRole*` API operations or the `assume-role*` AWS CLI operations but does not apply when you use those operations to create a console URL. For more information, see [Using IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html) in the *IAM User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-maxsessionduration
   */
  readonly maxSessionDuration?: number;

  /**
   * The path to the role. For more information about paths, see [IAM Identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the *IAM User Guide* .
   *
   * This parameter is optional. If it is not included, it defaults to a slash (/).
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! ( `\u0021` ) through the DEL character ( `\u007F` ), including most punctuation characters, digits, and upper and lowercased letters.
   *
   * @default - "/"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-path
   */
  readonly path?: string;

  /**
   * The ARN of the policy used to set the permissions boundary for the role.
   *
   * For more information about permissions boundaries, see [Permissions boundaries for IAM identities](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) in the *IAM User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-permissionsboundary
   */
  readonly permissionsBoundary?: string;

  /**
   * Adds or updates an inline policy document that is embedded in the specified IAM role.
   *
   * When you embed an inline policy in a role, the inline policy is used as part of the role's access (permissions) policy. The role's trust policy is created at the same time as the role. You can update a role's trust policy later. For more information about IAM roles, go to [Using Roles to Delegate Permissions and Federate Identities](https://docs.aws.amazon.com/IAM/latest/UserGuide/roles-toplevel.html) .
   *
   * A role can also have an attached managed policy. For information about policies, see [Managed Policies and Inline Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/policies-managed-vs-inline.html) in the *IAM User Guide* .
   *
   * For information about limits on the number of inline policies that you can embed with a role, see [Limitations on IAM Entities](https://docs.aws.amazon.com/IAM/latest/UserGuide/LimitationsOnEntities.html) in the *IAM User Guide* .
   *
   * > If an external policy (such as `AWS::IAM::Policy` or `AWS::IAM::ManagedPolicy` ) has a `Ref` to a role and if a resource (such as `AWS::ECS::Service` ) also has a `Ref` to the same role, add a `DependsOn` attribute to the resource to make the resource depend on the external policy. This dependency ensures that the role's policy is available throughout the resource's lifecycle. For example, when you delete a stack with an `AWS::ECS::Service` resource, the `DependsOn` attribute ensures that AWS CloudFormation deletes the `AWS::ECS::Service` resource before deleting its role's policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-policies
   */
  readonly policies?: Array<cdk.IResolvable | CfnRole.PolicyProperty> | cdk.IResolvable;

  /**
   * A name for the IAM role, up to 64 characters in length.
   *
   * For valid values, see the `RoleName` parameter for the [`CreateRole`](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateRole.html) action in the *IAM User Guide* .
   *
   * This parameter allows (per its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-. The role name must be unique within the account. Role names are not distinguished by case. For example, you cannot create roles named both "Role1" and "role1".
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the role name.
   *
   * If you specify a name, you must specify the `CAPABILITY_NAMED_IAM` value to acknowledge your template's capabilities. For more information, see [Acknowledging IAM Resources in AWS CloudFormation Templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities) .
   *
   * > Naming an IAM resource can cause an unrecoverable error if you reuse the same template in multiple Regions. To prevent this, we recommend using `Fn::Join` and `AWS::Region` to create a Region-specific name, as in the following example: `{"Fn::Join": ["", [{"Ref": "AWS::Region"}, {"Ref": "MyResourceName"}]]}` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-rolename
   */
  readonly roleName?: string;

  /**
   * A list of tags that are attached to the role.
   *
   * For more information about tagging, see [Tagging IAM resources](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_tags.html) in the *IAM User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `PolicyProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRolePolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyName", cdk.requiredValidator)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  return errors.wrap("supplied properties not correct for \"PolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnRolePolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRolePolicyPropertyValidator(properties).assertSuccess();
  return {
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument),
    "PolicyName": cdk.stringToCloudFormation(properties.policyName)
  };
}

/**
 * Determine whether the given properties match those of a `CfnRoleProps`
 *
 * @param properties - the TypeScript properties of a `CfnRoleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRolePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assumeRolePolicyDocument", cdk.requiredValidator)(properties.assumeRolePolicyDocument));
  errors.collect(cdk.propertyValidator("assumeRolePolicyDocument", cdk.validateObject)(properties.assumeRolePolicyDocument));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("managedPolicyArns", cdk.listValidator(cdk.validateString))(properties.managedPolicyArns));
  errors.collect(cdk.propertyValidator("maxSessionDuration", cdk.validateNumber)(properties.maxSessionDuration));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("permissionsBoundary", cdk.validateString)(properties.permissionsBoundary));
  errors.collect(cdk.propertyValidator("policies", cdk.listValidator(CfnRolePolicyPropertyValidator))(properties.policies));
  errors.collect(cdk.propertyValidator("roleName", cdk.validateString)(properties.roleName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRoleProps\"");
}

// @ts-ignore TS6133
function convertCfnRolePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRolePropsValidator(properties).assertSuccess();
  return {
    "AssumeRolePolicyDocument": cdk.objectToCloudFormation(properties.assumeRolePolicyDocument),
    "Description": cdk.stringToCloudFormation(properties.description),
    "ManagedPolicyArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.managedPolicyArns),
    "MaxSessionDuration": cdk.numberToCloudFormation(properties.maxSessionDuration),
    "Path": cdk.stringToCloudFormation(properties.path),
    "PermissionsBoundary": cdk.stringToCloudFormation(properties.permissionsBoundary),
    "Policies": cdk.listMapper(convertCfnRolePolicyPropertyToCloudFormation)(properties.policies),
    "RoleName": cdk.stringToCloudFormation(properties.roleName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

/**
 * Adds or updates an inline policy document that is embedded in the specified IAM role.
 *
 * When you embed an inline policy in a role, the inline policy is used as part of the role's access (permissions) policy. The role's trust policy is created at the same time as the role, using [`CreateRole`](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateRole.html) . You can update a role's trust policy using [`UpdateAssumeRolePolicy`](https://docs.aws.amazon.com/IAM/latest/APIReference/API_UpdateAssumeRolePolicy.html) . For information about roles, see [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/roles-toplevel.html) in the *IAM User Guide* .
 *
 * A role can also have a managed policy attached to it. To attach a managed policy to a role, use [`AWS::IAM::Role`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html) . To create a new managed policy, use [`AWS::IAM::ManagedPolicy`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-managedpolicy.html) . For information about policies, see [Managed policies and inline policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/policies-managed-vs-inline.html) in the *IAM User Guide* .
 *
 * For information about the maximum number of inline policies that you can embed with a role, see [IAM and AWS STS quotas](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html) in the *IAM User Guide* .
 *
 * @cloudformationResource AWS::IAM::RolePolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-rolepolicy.html
 */
export class CfnRolePolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::RolePolicy";

  /**
   * The policy document.
   */
  public policyDocument?: any | cdk.IResolvable;

  /**
   * The name of the policy document.
   */
  public policyName: string;

  /**
   * The name of the role to associate the policy with.
   */
  public roleName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRolePolicyProps) {
    super(scope, id, {
      "type": CfnRolePolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policyName", this);
    cdk.requireProperty(props, "roleName", this);

    this.policyDocument = props.policyDocument;
    this.policyName = props.policyName;
    this.roleName = props.roleName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policyDocument": this.policyDocument,
      "policyName": this.policyName,
      "roleName": this.roleName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRolePolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRolePolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRolePolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-rolepolicy.html
 */
export interface CfnRolePolicyProps {
  /**
   * The policy document.
   *
   * You must provide policies in JSON format in IAM. However, for AWS CloudFormation templates formatted in YAML, you can provide the policy in JSON or YAML format. AWS CloudFormation always converts a YAML policy to JSON format before submitting it to IAM.
   *
   * The [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) used to validate this parameter is a string of characters consisting of the following:
   *
   * - Any printable ASCII character ranging from the space character ( `\u0020` ) through the end of the ASCII character range
   * - The printable characters in the Basic Latin and Latin-1 Supplement character set (through `\u00FF` )
   * - The special characters tab ( `\u0009` ), line feed ( `\u000A` ), and carriage return ( `\u000D` )
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-rolepolicy.html#cfn-iam-rolepolicy-policydocument
   */
  readonly policyDocument?: any | cdk.IResolvable;

  /**
   * The name of the policy document.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-rolepolicy.html#cfn-iam-rolepolicy-policyname
   */
  readonly policyName: string;

  /**
   * The name of the role to associate the policy with.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-rolepolicy.html#cfn-iam-rolepolicy-rolename
   */
  readonly roleName: string;
}

/**
 * Determine whether the given properties match those of a `CfnRolePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnRolePolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRolePolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyName", cdk.requiredValidator)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  errors.collect(cdk.propertyValidator("roleName", cdk.requiredValidator)(properties.roleName));
  errors.collect(cdk.propertyValidator("roleName", cdk.validateString)(properties.roleName));
  return errors.wrap("supplied properties not correct for \"CfnRolePolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnRolePolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRolePolicyPropsValidator(properties).assertSuccess();
  return {
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument),
    "PolicyName": cdk.stringToCloudFormation(properties.policyName),
    "RoleName": cdk.stringToCloudFormation(properties.roleName)
  };
}

/**
 * Creates an IAM resource that describes an identity provider (IdP) that supports SAML 2.0.
 *
 * The SAML provider resource that you create with this operation can be used as a principal in an IAM role's trust policy. Such a policy can enable federated users who sign in using the SAML IdP to assume the role. You can create an IAM role that supports Web-based single sign-on (SSO) to the AWS Management Console or one that supports API access to AWS .
 *
 * When you create the SAML provider resource, you upload a SAML metadata document that you get from your IdP. That document includes the issuer's name, expiration information, and keys that can be used to validate the SAML authentication response (assertions) that the IdP sends. You must generate the metadata document using the identity management software that is used as your organization's IdP.
 *
 * > This operation requires [Signature Version 4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) .
 *
 * For more information, see [Enabling SAML 2.0 federated users to access the AWS Management Console](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_enable-console-saml.html) and [About SAML 2.0-based federation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_saml.html) in the *IAM User Guide* .
 *
 * @cloudformationResource AWS::IAM::SAMLProvider
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-samlprovider.html
 */
export class CfnSAMLProvider extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::SAMLProvider";

  /**
   * Returns the Amazon Resource Name (ARN) for the specified `AWS::IAM::SAMLProvider` resource.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the provider to create.
   */
  public name?: string;

  /**
   * An XML document generated by an identity provider (IdP) that supports SAML 2.0. The document includes the issuer's name, expiration information, and keys that can be used to validate the SAML authentication response (assertions) that are received from the IdP. You must generate the metadata document using the identity management software that is used as your organization's IdP.
   */
  public samlMetadataDocument: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tags that you want to attach to the new IAM SAML provider.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSAMLProviderProps) {
    super(scope, id, {
      "type": CfnSAMLProvider.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "samlMetadataDocument", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.samlMetadataDocument = props.samlMetadataDocument;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IAM::SAMLProvider", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "samlMetadataDocument": this.samlMetadataDocument,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSAMLProvider.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSAMLProviderPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSAMLProvider`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-samlprovider.html
 */
export interface CfnSAMLProviderProps {
  /**
   * The name of the provider to create.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-samlprovider.html#cfn-iam-samlprovider-name
   */
  readonly name?: string;

  /**
   * An XML document generated by an identity provider (IdP) that supports SAML 2.0. The document includes the issuer's name, expiration information, and keys that can be used to validate the SAML authentication response (assertions) that are received from the IdP. You must generate the metadata document using the identity management software that is used as your organization's IdP.
   *
   * For more information, see [About SAML 2.0-based federation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_saml.html) in the *IAM User Guide*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-samlprovider.html#cfn-iam-samlprovider-samlmetadatadocument
   */
  readonly samlMetadataDocument: string;

  /**
   * A list of tags that you want to attach to the new IAM SAML provider.
   *
   * Each tag consists of a key name and an associated value. For more information about tagging, see [Tagging IAM resources](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_tags.html) in the *IAM User Guide* .
   *
   * > If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-samlprovider.html#cfn-iam-samlprovider-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnSAMLProviderProps`
 *
 * @param properties - the TypeScript properties of a `CfnSAMLProviderProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSAMLProviderPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("samlMetadataDocument", cdk.requiredValidator)(properties.samlMetadataDocument));
  errors.collect(cdk.propertyValidator("samlMetadataDocument", cdk.validateString)(properties.samlMetadataDocument));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSAMLProviderProps\"");
}

// @ts-ignore TS6133
function convertCfnSAMLProviderPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSAMLProviderPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "SamlMetadataDocument": cdk.stringToCloudFormation(properties.samlMetadataDocument),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

/**
 * Uploads a server certificate entity for the AWS account .
 *
 * The server certificate entity includes a public key certificate, a private key, and an optional certificate chain, which should all be PEM-encoded.
 *
 * We recommend that you use [AWS Certificate Manager](https://docs.aws.amazon.com/acm/) to provision, manage, and deploy your server certificates. With ACM you can request a certificate, deploy it to AWS resources, and let ACM handle certificate renewals for you. Certificates provided by ACM are free. For more information about using ACM, see the [AWS Certificate Manager User Guide](https://docs.aws.amazon.com/acm/latest/userguide/) .
 *
 * For more information about working with server certificates, see [Working with server certificates](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_server-certs.html) in the *IAM User Guide* . This topic includes a list of AWS services that can use the server certificates that you manage with IAM.
 *
 * For information about the number of server certificates you can upload, see [IAM and AWS STS quotas](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html) in the *IAM User Guide* .
 *
 * > Because the body of the public key certificate, private key, and the certificate chain can be large, you should use POST rather than GET when calling `UploadServerCertificate` . For information about setting up signatures and authorization through the API, see [Signing AWS API requests](https://docs.aws.amazon.com/general/latest/gr/signing_aws_api_requests.html) in the *AWS General Reference* . For general information about using the Query API with IAM, see [Calling the API by making HTTP query requests](https://docs.aws.amazon.com/IAM/latest/UserGuide/programming.html) in the *IAM User Guide* .
 *
 * @cloudformationResource AWS::IAM::ServerCertificate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-servercertificate.html
 */
export class CfnServerCertificate extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::ServerCertificate";

  /**
   * Returns the Amazon Resource Name (ARN) for the specified `AWS::IAM::ServerCertificate` resource.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The contents of the public key certificate.
   */
  public certificateBody?: string;

  /**
   * The contents of the public key certificate chain.
   */
  public certificateChain?: string;

  /**
   * The path for the server certificate.
   */
  public path?: string;

  /**
   * The contents of the private key in PEM-encoded format.
   */
  public privateKey?: string;

  /**
   * The name for the server certificate.
   */
  public serverCertificateName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tags that are attached to the server certificate.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServerCertificateProps = {}) {
    super(scope, id, {
      "type": CfnServerCertificate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.certificateBody = props.certificateBody;
    this.certificateChain = props.certificateChain;
    this.path = props.path;
    this.privateKey = props.privateKey;
    this.serverCertificateName = props.serverCertificateName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IAM::ServerCertificate", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "certificateBody": this.certificateBody,
      "certificateChain": this.certificateChain,
      "path": this.path,
      "privateKey": this.privateKey,
      "serverCertificateName": this.serverCertificateName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnServerCertificate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServerCertificatePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnServerCertificate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-servercertificate.html
 */
export interface CfnServerCertificateProps {
  /**
   * The contents of the public key certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-servercertificate.html#cfn-iam-servercertificate-certificatebody
   */
  readonly certificateBody?: string;

  /**
   * The contents of the public key certificate chain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-servercertificate.html#cfn-iam-servercertificate-certificatechain
   */
  readonly certificateChain?: string;

  /**
   * The path for the server certificate.
   *
   * For more information about paths, see [IAM identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the *IAM User Guide* .
   *
   * This parameter is optional. If it is not included, it defaults to a slash (/). This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! ( `\u0021` ) through the DEL character ( `\u007F` ), including most punctuation characters, digits, and upper and lowercased letters.
   *
   * > If you are uploading a server certificate specifically for use with Amazon CloudFront distributions, you must specify a path using the `path` parameter. The path must begin with `/cloudfront` and must include a trailing slash (for example, `/cloudfront/test/` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-servercertificate.html#cfn-iam-servercertificate-path
   */
  readonly path?: string;

  /**
   * The contents of the private key in PEM-encoded format.
   *
   * The [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) used to validate this parameter is a string of characters consisting of the following:
   *
   * - Any printable ASCII character ranging from the space character ( `\u0020` ) through the end of the ASCII character range
   * - The printable characters in the Basic Latin and Latin-1 Supplement character set (through `\u00FF` )
   * - The special characters tab ( `\u0009` ), line feed ( `\u000A` ), and carriage return ( `\u000D` )
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-servercertificate.html#cfn-iam-servercertificate-privatekey
   */
  readonly privateKey?: string;

  /**
   * The name for the server certificate.
   *
   * Do not include the path in this value. The name of the certificate cannot contain any spaces.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-servercertificate.html#cfn-iam-servercertificate-servercertificatename
   */
  readonly serverCertificateName?: string;

  /**
   * A list of tags that are attached to the server certificate.
   *
   * For more information about tagging, see [Tagging IAM resources](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_tags.html) in the *IAM User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-servercertificate.html#cfn-iam-servercertificate-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnServerCertificateProps`
 *
 * @param properties - the TypeScript properties of a `CfnServerCertificateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServerCertificatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateBody", cdk.validateString)(properties.certificateBody));
  errors.collect(cdk.propertyValidator("certificateChain", cdk.validateString)(properties.certificateChain));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("privateKey", cdk.validateString)(properties.privateKey));
  errors.collect(cdk.propertyValidator("serverCertificateName", cdk.validateString)(properties.serverCertificateName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnServerCertificateProps\"");
}

// @ts-ignore TS6133
function convertCfnServerCertificatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServerCertificatePropsValidator(properties).assertSuccess();
  return {
    "CertificateBody": cdk.stringToCloudFormation(properties.certificateBody),
    "CertificateChain": cdk.stringToCloudFormation(properties.certificateChain),
    "Path": cdk.stringToCloudFormation(properties.path),
    "PrivateKey": cdk.stringToCloudFormation(properties.privateKey),
    "ServerCertificateName": cdk.stringToCloudFormation(properties.serverCertificateName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

/**
 * Creates an IAM role that is linked to a specific AWS service.
 *
 * The service controls the attached policies and when the role can be deleted. This helps ensure that the service is not broken by an unexpectedly changed or deleted role, which could put your AWS resources into an unknown state. Allowing the service to control the role helps improve service stability and proper cleanup when a service and its role are no longer needed. For more information, see [Using service-linked roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html) in the *IAM User Guide* .
 *
 * To attach a policy to this service-linked role, you must make the request using the AWS service that depends on this role.
 *
 * @cloudformationResource AWS::IAM::ServiceLinkedRole
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-servicelinkedrole.html
 */
export class CfnServiceLinkedRole extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::ServiceLinkedRole";

  /**
   * Returns the friendly name that identifies the role. For example, `AWSServiceRoleForAutoScaling` or `AWSServiceRoleForAutoScaling_TestSuffix` if a `CustomSuffix` is specified.
   *
   * @cloudformationAttribute RoleName
   */
  public readonly attrRoleName: string;

  /**
   * The service principal for the AWS service to which this role is attached.
   */
  public awsServiceName?: string;

  /**
   * A string that you provide, which is combined with the service-provided prefix to form the complete role name.
   */
  public customSuffix?: string;

  /**
   * The description of the role.
   */
  public description?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServiceLinkedRoleProps = {}) {
    super(scope, id, {
      "type": CfnServiceLinkedRole.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrRoleName = cdk.Token.asString(this.getAtt("RoleName", cdk.ResolutionTypeHint.STRING));
    this.awsServiceName = props.awsServiceName;
    this.customSuffix = props.customSuffix;
    this.description = props.description;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "awsServiceName": this.awsServiceName,
      "customSuffix": this.customSuffix,
      "description": this.description
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnServiceLinkedRole.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServiceLinkedRolePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnServiceLinkedRole`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-servicelinkedrole.html
 */
export interface CfnServiceLinkedRoleProps {
  /**
   * The service principal for the AWS service to which this role is attached.
   *
   * You use a string similar to a URL but without the http:// in front. For example: `elasticbeanstalk.amazonaws.com` .
   *
   * Service principals are unique and case-sensitive. To find the exact service principal for your service-linked role, see [AWS services that work with IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_aws-services-that-work-with-iam.html) in the *IAM User Guide* . Look for the services that have *Yes* in the *Service-Linked Role* column. Choose the *Yes* link to view the service-linked role documentation for that service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-servicelinkedrole.html#cfn-iam-servicelinkedrole-awsservicename
   */
  readonly awsServiceName?: string;

  /**
   * A string that you provide, which is combined with the service-provided prefix to form the complete role name.
   *
   * If you make multiple requests for the same service, then you must supply a different `CustomSuffix` for each request. Otherwise the request fails with a duplicate role name error. For example, you could add `-1` or `-debug` to the suffix.
   *
   * Some services do not support the `CustomSuffix` parameter. If you provide an optional suffix and the operation fails, try the operation again without the suffix.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-servicelinkedrole.html#cfn-iam-servicelinkedrole-customsuffix
   */
  readonly customSuffix?: string;

  /**
   * The description of the role.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-servicelinkedrole.html#cfn-iam-servicelinkedrole-description
   */
  readonly description?: string;
}

/**
 * Determine whether the given properties match those of a `CfnServiceLinkedRoleProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceLinkedRoleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceLinkedRolePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsServiceName", cdk.validateString)(properties.awsServiceName));
  errors.collect(cdk.propertyValidator("customSuffix", cdk.validateString)(properties.customSuffix));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  return errors.wrap("supplied properties not correct for \"CfnServiceLinkedRoleProps\"");
}

// @ts-ignore TS6133
function convertCfnServiceLinkedRolePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceLinkedRolePropsValidator(properties).assertSuccess();
  return {
    "AWSServiceName": cdk.stringToCloudFormation(properties.awsServiceName),
    "CustomSuffix": cdk.stringToCloudFormation(properties.customSuffix),
    "Description": cdk.stringToCloudFormation(properties.description)
  };
}

/**
 * Creates a new IAM user for your AWS account .
 *
 * For information about quotas for the number of IAM users you can create, see [IAM and AWS STS quotas](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html) in the *IAM User Guide* .
 *
 * @cloudformationResource AWS::IAM::User
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-user.html
 */
export class CfnUser extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::User";

  /**
   * Returns the Amazon Resource Name (ARN) for the specified `AWS::IAM::User` resource. For example: `arn:aws:iam::123456789012:user/mystack-myuser-1CCXAFG2H2U4D` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A list of group names to which you want to add the user.
   */
  public groups?: Array<string>;

  /**
   * Creates a password for the specified IAM user.
   */
  public loginProfile?: cdk.IResolvable | CfnUser.LoginProfileProperty;

  /**
   * A list of Amazon Resource Names (ARNs) of the IAM managed policies that you want to attach to the user.
   */
  public managedPolicyArns?: Array<string>;

  /**
   * The path for the user name.
   */
  public path?: string;

  /**
   * The ARN of the managed policy that is used to set the permissions boundary for the user.
   */
  public permissionsBoundary?: string;

  /**
   * Adds or updates an inline policy document that is embedded in the specified IAM user.
   */
  public policies?: Array<cdk.IResolvable | CfnUser.PolicyProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tags that you want to attach to the new user.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The name of the user to create. Do not include the path in this value.
   */
  public userName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserProps = {}) {
    super(scope, id, {
      "type": CfnUser.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.groups = props.groups;
    this.loginProfile = props.loginProfile;
    this.managedPolicyArns = props.managedPolicyArns;
    this.path = props.path;
    this.permissionsBoundary = props.permissionsBoundary;
    this.policies = props.policies;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IAM::User", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.userName = props.userName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "groups": this.groups,
      "loginProfile": this.loginProfile,
      "managedPolicyArns": this.managedPolicyArns,
      "path": this.path,
      "permissionsBoundary": this.permissionsBoundary,
      "policies": this.policies,
      "tags": this.tags.renderTags(),
      "userName": this.userName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUser.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPropsToCloudFormation(props);
  }
}

export namespace CfnUser {
  /**
   * Creates a password for the specified user, giving the user the ability to access AWS services through the AWS Management Console .
   *
   * For more information about managing passwords, see [Managing Passwords](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_ManagingLogins.html) in the *IAM User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-user-loginprofile.html
   */
  export interface LoginProfileProperty {
    /**
     * The user's password.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-user-loginprofile.html#cfn-iam-user-loginprofile-password
     */
    readonly password: string;

    /**
     * Specifies whether the user is required to set a new password on next sign-in.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-user-loginprofile.html#cfn-iam-user-loginprofile-passwordresetrequired
     */
    readonly passwordResetRequired?: boolean | cdk.IResolvable;
  }

  /**
   * Contains information about an attached policy.
   *
   * An attached policy is a managed policy that has been attached to a user, group, or role.
   *
   * For more information about managed policies, refer to [Managed Policies and Inline Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/policies-managed-vs-inline.html) in the *IAM User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-user-policy.html
   */
  export interface PolicyProperty {
    /**
     * The entire contents of the policy that defines permissions.
     *
     * For more information, see [Overview of JSON policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policies-json) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-user-policy.html#cfn-iam-user-policy-policydocument
     */
    readonly policyDocument: any | cdk.IResolvable;

    /**
     * The friendly name (not ARN) identifying the policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-user-policy.html#cfn-iam-user-policy-policyname
     */
    readonly policyName: string;
  }
}

/**
 * Properties for defining a `CfnUser`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-user.html
 */
export interface CfnUserProps {
  /**
   * A list of group names to which you want to add the user.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-user.html#cfn-iam-user-groups
   */
  readonly groups?: Array<string>;

  /**
   * Creates a password for the specified IAM user.
   *
   * A password allows an IAM user to access AWS services through the AWS Management Console .
   *
   * You can use the AWS CLI , the AWS API, or the *Users* page in the IAM console to create a password for any IAM user. Use [ChangePassword](https://docs.aws.amazon.com/IAM/latest/APIReference/API_ChangePassword.html) to update your own existing password in the *My Security Credentials* page in the AWS Management Console .
   *
   * For more information about managing passwords, see [Managing passwords](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_ManagingLogins.html) in the *IAM User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-user.html#cfn-iam-user-loginprofile
   */
  readonly loginProfile?: cdk.IResolvable | CfnUser.LoginProfileProperty;

  /**
   * A list of Amazon Resource Names (ARNs) of the IAM managed policies that you want to attach to the user.
   *
   * For more information about ARNs, see [Amazon Resource Names (ARNs) and AWS Service Namespaces](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) in the *AWS General Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-user.html#cfn-iam-user-managedpolicyarns
   */
  readonly managedPolicyArns?: Array<string>;

  /**
   * The path for the user name.
   *
   * For more information about paths, see [IAM identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the *IAM User Guide* .
   *
   * This parameter is optional. If it is not included, it defaults to a slash (/).
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! ( `\u0021` ) through the DEL character ( `\u007F` ), including most punctuation characters, digits, and upper and lowercased letters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-user.html#cfn-iam-user-path
   */
  readonly path?: string;

  /**
   * The ARN of the managed policy that is used to set the permissions boundary for the user.
   *
   * A permissions boundary policy defines the maximum permissions that identity-based policies can grant to an entity, but does not grant permissions. Permissions boundaries do not define the maximum permissions that a resource-based policy can grant to an entity. To learn more, see [Permissions boundaries for IAM entities](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) in the *IAM User Guide* .
   *
   * For more information about policy types, see [Policy types](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policy-types) in the *IAM User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-user.html#cfn-iam-user-permissionsboundary
   */
  readonly permissionsBoundary?: string;

  /**
   * Adds or updates an inline policy document that is embedded in the specified IAM user.
   *
   * To view AWS::IAM::User snippets, see [Declaring an IAM User Resource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-iam.html#scenario-iam-user) .
   *
   * > The name of each policy for a role, user, or group must be unique. If you don't choose unique names, updates to the IAM identity will fail.
   *
   * For information about limits on the number of inline policies that you can embed in a user, see [Limitations on IAM Entities](https://docs.aws.amazon.com/IAM/latest/UserGuide/LimitationsOnEntities.html) in the *IAM User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-user.html#cfn-iam-user-policies
   */
  readonly policies?: Array<cdk.IResolvable | CfnUser.PolicyProperty> | cdk.IResolvable;

  /**
   * A list of tags that you want to attach to the new user.
   *
   * Each tag consists of a key name and an associated value. For more information about tagging, see [Tagging IAM resources](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_tags.html) in the *IAM User Guide* .
   *
   * > If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-user.html#cfn-iam-user-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name of the user to create. Do not include the path in this value.
   *
   * This parameter allows (per its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-. The user name must be unique within the account. User names are not distinguished by case. For example, you cannot create users named both "John" and "john".
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the user name.
   *
   * If you specify a name, you must specify the `CAPABILITY_NAMED_IAM` value to acknowledge your template's capabilities. For more information, see [Acknowledging IAM Resources in AWS CloudFormation Templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities) .
   *
   * > Naming an IAM resource can cause an unrecoverable error if you reuse the same template in multiple Regions. To prevent this, we recommend using `Fn::Join` and `AWS::Region` to create a Region-specific name, as in the following example: `{"Fn::Join": ["", [{"Ref": "AWS::Region"}, {"Ref": "MyResourceName"}]]}` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-user.html#cfn-iam-user-username
   */
  readonly userName?: string;
}

/**
 * Determine whether the given properties match those of a `LoginProfileProperty`
 *
 * @param properties - the TypeScript properties of a `LoginProfileProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserLoginProfilePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("password", cdk.requiredValidator)(properties.password));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("passwordResetRequired", cdk.validateBoolean)(properties.passwordResetRequired));
  return errors.wrap("supplied properties not correct for \"LoginProfileProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserLoginProfilePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserLoginProfilePropertyValidator(properties).assertSuccess();
  return {
    "Password": cdk.stringToCloudFormation(properties.password),
    "PasswordResetRequired": cdk.booleanToCloudFormation(properties.passwordResetRequired)
  };
}

/**
 * Determine whether the given properties match those of a `PolicyProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyName", cdk.requiredValidator)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  return errors.wrap("supplied properties not correct for \"PolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPolicyPropertyValidator(properties).assertSuccess();
  return {
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument),
    "PolicyName": cdk.stringToCloudFormation(properties.policyName)
  };
}

/**
 * Determine whether the given properties match those of a `CfnUserProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groups", cdk.listValidator(cdk.validateString))(properties.groups));
  errors.collect(cdk.propertyValidator("loginProfile", CfnUserLoginProfilePropertyValidator)(properties.loginProfile));
  errors.collect(cdk.propertyValidator("managedPolicyArns", cdk.listValidator(cdk.validateString))(properties.managedPolicyArns));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("permissionsBoundary", cdk.validateString)(properties.permissionsBoundary));
  errors.collect(cdk.propertyValidator("policies", cdk.listValidator(CfnUserPolicyPropertyValidator))(properties.policies));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("userName", cdk.validateString)(properties.userName));
  return errors.wrap("supplied properties not correct for \"CfnUserProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPropsValidator(properties).assertSuccess();
  return {
    "Groups": cdk.listMapper(cdk.stringToCloudFormation)(properties.groups),
    "LoginProfile": convertCfnUserLoginProfilePropertyToCloudFormation(properties.loginProfile),
    "ManagedPolicyArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.managedPolicyArns),
    "Path": cdk.stringToCloudFormation(properties.path),
    "PermissionsBoundary": cdk.stringToCloudFormation(properties.permissionsBoundary),
    "Policies": cdk.listMapper(convertCfnUserPolicyPropertyToCloudFormation)(properties.policies),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UserName": cdk.stringToCloudFormation(properties.userName)
  };
}

/**
 * Adds or updates an inline policy document that is embedded in the specified IAM user.
 *
 * An IAM user can also have a managed policy attached to it. To attach a managed policy to a user, use [`AWS::IAM::User`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-user.html) . To create a new managed policy, use [`AWS::IAM::ManagedPolicy`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-managedpolicy.html) . For information about policies, see [Managed policies and inline policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/policies-managed-vs-inline.html) in the *IAM User Guide* .
 *
 * For information about the maximum number of inline policies that you can embed in a user, see [IAM and AWS STS quotas](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html) in the *IAM User Guide* .
 *
 * @cloudformationResource AWS::IAM::UserPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-userpolicy.html
 */
export class CfnUserPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::UserPolicy";

  /**
   * The policy document.
   */
  public policyDocument?: any | cdk.IResolvable;

  /**
   * The name of the policy document.
   */
  public policyName: string;

  /**
   * The name of the user to associate the policy with.
   */
  public userName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserPolicyProps) {
    super(scope, id, {
      "type": CfnUserPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policyName", this);
    cdk.requireProperty(props, "userName", this);

    this.policyDocument = props.policyDocument;
    this.policyName = props.policyName;
    this.userName = props.userName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policyDocument": this.policyDocument,
      "policyName": this.policyName,
      "userName": this.userName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnUserPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-userpolicy.html
 */
export interface CfnUserPolicyProps {
  /**
   * The policy document.
   *
   * You must provide policies in JSON format in IAM. However, for AWS CloudFormation templates formatted in YAML, you can provide the policy in JSON or YAML format. AWS CloudFormation always converts a YAML policy to JSON format before submitting it to IAM.
   *
   * The [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) used to validate this parameter is a string of characters consisting of the following:
   *
   * - Any printable ASCII character ranging from the space character ( `\u0020` ) through the end of the ASCII character range
   * - The printable characters in the Basic Latin and Latin-1 Supplement character set (through `\u00FF` )
   * - The special characters tab ( `\u0009` ), line feed ( `\u000A` ), and carriage return ( `\u000D` )
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-userpolicy.html#cfn-iam-userpolicy-policydocument
   */
  readonly policyDocument?: any | cdk.IResolvable;

  /**
   * The name of the policy document.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-userpolicy.html#cfn-iam-userpolicy-policyname
   */
  readonly policyName: string;

  /**
   * The name of the user to associate the policy with.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-userpolicy.html#cfn-iam-userpolicy-username
   */
  readonly userName: string;
}

/**
 * Determine whether the given properties match those of a `CfnUserPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyName", cdk.requiredValidator)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  errors.collect(cdk.propertyValidator("userName", cdk.requiredValidator)(properties.userName));
  errors.collect(cdk.propertyValidator("userName", cdk.validateString)(properties.userName));
  return errors.wrap("supplied properties not correct for \"CfnUserPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPolicyPropsValidator(properties).assertSuccess();
  return {
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument),
    "PolicyName": cdk.stringToCloudFormation(properties.policyName),
    "UserName": cdk.stringToCloudFormation(properties.userName)
  };
}

/**
 * Adds the specified user to the specified group.
 *
 * @cloudformationResource AWS::IAM::UserToGroupAddition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-usertogroupaddition.html
 */
export class CfnUserToGroupAddition extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::UserToGroupAddition";

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the group to update.
   */
  public groupName: string;

  /**
   * A list of the names of the users that you want to add to the group.
   */
  public users: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserToGroupAdditionProps) {
    super(scope, id, {
      "type": CfnUserToGroupAddition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "groupName", this);
    cdk.requireProperty(props, "users", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.groupName = props.groupName;
    this.users = props.users;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "groupName": this.groupName,
      "users": this.users
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserToGroupAddition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserToGroupAdditionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnUserToGroupAddition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-usertogroupaddition.html
 */
export interface CfnUserToGroupAdditionProps {
  /**
   * The name of the group to update.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-usertogroupaddition.html#cfn-iam-usertogroupaddition-groupname
   */
  readonly groupName: string;

  /**
   * A list of the names of the users that you want to add to the group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-usertogroupaddition.html#cfn-iam-usertogroupaddition-users
   */
  readonly users: Array<string>;
}

/**
 * Determine whether the given properties match those of a `CfnUserToGroupAdditionProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserToGroupAdditionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserToGroupAdditionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupName", cdk.requiredValidator)(properties.groupName));
  errors.collect(cdk.propertyValidator("groupName", cdk.validateString)(properties.groupName));
  errors.collect(cdk.propertyValidator("users", cdk.requiredValidator)(properties.users));
  errors.collect(cdk.propertyValidator("users", cdk.listValidator(cdk.validateString))(properties.users));
  return errors.wrap("supplied properties not correct for \"CfnUserToGroupAdditionProps\"");
}

// @ts-ignore TS6133
function convertCfnUserToGroupAdditionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserToGroupAdditionPropsValidator(properties).assertSuccess();
  return {
    "GroupName": cdk.stringToCloudFormation(properties.groupName),
    "Users": cdk.listMapper(cdk.stringToCloudFormation)(properties.users)
  };
}

/**
 * Creates a new virtual MFA device for the AWS account .
 *
 * After creating the virtual MFA, use [EnableMFADevice](https://docs.aws.amazon.com/IAM/latest/APIReference/API_EnableMFADevice.html) to attach the MFA device to an IAM user. For more information about creating and working with virtual MFA devices, see [Using a virtual MFA device](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_VirtualMFA.html) in the *IAM User Guide* .
 *
 * For information about the maximum number of MFA devices you can create, see [IAM and AWS STS quotas](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html) in the *IAM User Guide* .
 *
 * > The seed information contained in the QR code and the Base32 string should be treated like any other secret access information. In other words, protect the seed information as you would your AWS access keys or your passwords. After you provision your virtual device, you should ensure that the information is destroyed following secure procedures.
 *
 * @cloudformationResource AWS::IAM::VirtualMFADevice
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-virtualmfadevice.html
 */
export class CfnVirtualMFADevice extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IAM::VirtualMFADevice";

  /**
   * Returns the serial number for the specified `AWS::IAM::VirtualMFADevice` resource.
   *
   * @cloudformationAttribute SerialNumber
   */
  public readonly attrSerialNumber: string;

  /**
   * The path for the virtual MFA device.
   */
  public path?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tags that you want to attach to the new IAM virtual MFA device.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The IAM user associated with this virtual MFA device.
   */
  public users: Array<string>;

  /**
   * The name of the virtual MFA device, which must be unique.
   */
  public virtualMfaDeviceName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVirtualMFADeviceProps) {
    super(scope, id, {
      "type": CfnVirtualMFADevice.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "users", this);

    this.attrSerialNumber = cdk.Token.asString(this.getAtt("SerialNumber", cdk.ResolutionTypeHint.STRING));
    this.path = props.path;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IAM::VirtualMFADevice", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.users = props.users;
    this.virtualMfaDeviceName = props.virtualMfaDeviceName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "path": this.path,
      "tags": this.tags.renderTags(),
      "users": this.users,
      "virtualMfaDeviceName": this.virtualMfaDeviceName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVirtualMFADevice.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVirtualMFADevicePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnVirtualMFADevice`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-virtualmfadevice.html
 */
export interface CfnVirtualMFADeviceProps {
  /**
   * The path for the virtual MFA device.
   *
   * For more information about paths, see [IAM identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the *IAM User Guide* .
   *
   * This parameter is optional. If it is not included, it defaults to a slash (/).
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes. In addition, it can contain any ASCII character from the ! ( `\u0021` ) through the DEL character ( `\u007F` ), including most punctuation characters, digits, and upper and lowercased letters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-virtualmfadevice.html#cfn-iam-virtualmfadevice-path
   */
  readonly path?: string;

  /**
   * A list of tags that you want to attach to the new IAM virtual MFA device.
   *
   * Each tag consists of a key name and an associated value. For more information about tagging, see [Tagging IAM resources](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_tags.html) in the *IAM User Guide* .
   *
   * > If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request fails and the resource is not created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-virtualmfadevice.html#cfn-iam-virtualmfadevice-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The IAM user associated with this virtual MFA device.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-virtualmfadevice.html#cfn-iam-virtualmfadevice-users
   */
  readonly users: Array<string>;

  /**
   * The name of the virtual MFA device, which must be unique.
   *
   * Use with path to uniquely identify a virtual MFA device.
   *
   * This parameter allows (through its [regex pattern](https://docs.aws.amazon.com/http://wikipedia.org/wiki/regex) ) a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-virtualmfadevice.html#cfn-iam-virtualmfadevice-virtualmfadevicename
   */
  readonly virtualMfaDeviceName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnVirtualMFADeviceProps`
 *
 * @param properties - the TypeScript properties of a `CfnVirtualMFADeviceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVirtualMFADevicePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("users", cdk.requiredValidator)(properties.users));
  errors.collect(cdk.propertyValidator("users", cdk.listValidator(cdk.validateString))(properties.users));
  errors.collect(cdk.propertyValidator("virtualMfaDeviceName", cdk.validateString)(properties.virtualMfaDeviceName));
  return errors.wrap("supplied properties not correct for \"CfnVirtualMFADeviceProps\"");
}

// @ts-ignore TS6133
function convertCfnVirtualMFADevicePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVirtualMFADevicePropsValidator(properties).assertSuccess();
  return {
    "Path": cdk.stringToCloudFormation(properties.path),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Users": cdk.listMapper(cdk.stringToCloudFormation)(properties.users),
    "VirtualMfaDeviceName": cdk.stringToCloudFormation(properties.virtualMfaDeviceName)
  };
}