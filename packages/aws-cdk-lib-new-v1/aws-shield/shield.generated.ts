/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Provides permissions for the AWS Shield Advanced Shield response team (SRT) to access your account and your resource protections, to help you mitigate potential distributed denial of service (DDoS) attacks.
 *
 * *Configure `AWS::Shield::DRTAccess` for one account*
 *
 * To configure this resource through AWS CloudFormation , you must be subscribed to AWS Shield Advanced . You can subscribe through the [Shield Advanced console](https://docs.aws.amazon.com/wafv2/shieldv2#/) and through the APIs. For more information, see [Subscribe to AWS Shield Advanced](https://docs.aws.amazon.com/waf/latest/developerguide/enable-ddos-prem.html) .
 *
 * See example templates for Shield Advanced in AWS CloudFormation at [aws-samples/aws-shield-advanced-examples](https://docs.aws.amazon.com/https://github.com/aws-samples/aws-shield-advanced-examples) .
 *
 * *Configure Shield Advanced using AWS CloudFormation and AWS Firewall Manager*
 *
 * You might be able to use Firewall Manager with AWS CloudFormation to configure Shield Advanced across multiple accounts and protected resources. To do this, your accounts must be part of an organization in AWS Organizations . You can use Firewall Manager to configure Shield Advanced protections for any resource types except for Amazon Route 53 or AWS Global Accelerator .
 *
 * For an example of this, see the one-click configuration guidance published by the AWS technical community at [One-click deployment of Shield Advanced](https://docs.aws.amazon.com/https://youtu.be/LCA3FwMk_QE) .
 *
 * @cloudformationResource AWS::Shield::DRTAccess
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-drtaccess.html
 */
export class CfnDRTAccess extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Shield::DRTAccess";

  /**
   * Build a CfnDRTAccess from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDRTAccess {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDRTAccessPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDRTAccess(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the account that submitted the template.
   *
   * @cloudformationAttribute AccountId
   */
  public readonly attrAccountId: string;

  /**
   * Authorizes the Shield Response Team (SRT) to access the specified Amazon S3 bucket containing log data such as Application Load Balancer access logs, CloudFront logs, or logs from third party sources.
   */
  public logBucketList?: Array<string>;

  /**
   * Authorizes the Shield Response Team (SRT) using the specified role, to access your AWS account to assist with DDoS attack mitigation during potential attacks.
   */
  public roleArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDRTAccessProps) {
    super(scope, id, {
      "type": CfnDRTAccess.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "roleArn", this);

    this.attrAccountId = cdk.Token.asString(this.getAtt("AccountId", cdk.ResolutionTypeHint.STRING));
    this.logBucketList = props.logBucketList;
    this.roleArn = props.roleArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "logBucketList": this.logBucketList,
      "roleArn": this.roleArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDRTAccess.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDRTAccessPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDRTAccess`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-drtaccess.html
 */
export interface CfnDRTAccessProps {
  /**
   * Authorizes the Shield Response Team (SRT) to access the specified Amazon S3 bucket containing log data such as Application Load Balancer access logs, CloudFront logs, or logs from third party sources.
   *
   * You can associate up to 10 Amazon S3 buckets with your subscription.
   *
   * Use this to share information with the SRT that's not available in AWS WAF logs.
   *
   * To use the services of the SRT, you must be subscribed to the [Business Support plan](https://docs.aws.amazon.com/premiumsupport/business-support/) or the [Enterprise Support plan](https://docs.aws.amazon.com/premiumsupport/enterprise-support/) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-drtaccess.html#cfn-shield-drtaccess-logbucketlist
   */
  readonly logBucketList?: Array<string>;

  /**
   * Authorizes the Shield Response Team (SRT) using the specified role, to access your AWS account to assist with DDoS attack mitigation during potential attacks.
   *
   * This enables the SRT to inspect your AWS WAF configuration and logs and to create or update AWS WAF rules and web ACLs.
   *
   * You can associate only one `RoleArn` with your subscription. If you submit this update for an account that already has an associated role, the new `RoleArn` will replace the existing `RoleArn` .
   *
   * This change requires the following:
   *
   * - You must be subscribed to the [Business Support plan](https://docs.aws.amazon.com/premiumsupport/business-support/) or the [Enterprise Support plan](https://docs.aws.amazon.com/premiumsupport/enterprise-support/) .
   * - You must have the `iam:PassRole` permission. For more information, see [Granting a user permissions to pass a role to an AWS service](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_passrole.html) .
   * - The `AWSShieldDRTAccessPolicy` managed policy must be attached to the role that you specify in the request. You can access this policy in the IAM console at [AWSShieldDRTAccessPolicy](https://docs.aws.amazon.com/iam/home?#/policies/arn:aws:iam::aws:policy/service-role/AWSShieldDRTAccessPolicy) . For information, see [Adding and removing IAM identity permissions](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html) .
   * - The role must trust the service principal `drt.shield.amazonaws.com` . For information, see [IAM JSON policy elements: Principal](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html) .
   *
   * The SRT will have access only to your AWS WAF and Shield resources. By submitting this request, you provide permissions to the SRT to inspect your AWS WAF and Shield configuration and logs, and to create and update AWS WAF rules and web ACLs on your behalf. The SRT takes these actions only if explicitly authorized by you.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-drtaccess.html#cfn-shield-drtaccess-rolearn
   */
  readonly roleArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnDRTAccessProps`
 *
 * @param properties - the TypeScript properties of a `CfnDRTAccessProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDRTAccessPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logBucketList", cdk.listValidator(cdk.validateString))(properties.logBucketList));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CfnDRTAccessProps\"");
}

// @ts-ignore TS6133
function convertCfnDRTAccessPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDRTAccessPropsValidator(properties).assertSuccess();
  return {
    "LogBucketList": cdk.listMapper(cdk.stringToCloudFormation)(properties.logBucketList),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnDRTAccessPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDRTAccessProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDRTAccessProps>();
  ret.addPropertyResult("logBucketList", "LogBucketList", (properties.LogBucketList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LogBucketList) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Authorizes the Shield Response Team (SRT) to use email and phone to notify contacts about escalations to the SRT and to initiate proactive customer support.
 *
 * To enable proactive engagement, you must be subscribed to the [Business Support plan](https://docs.aws.amazon.com/premiumsupport/business-support/) or the [Enterprise Support plan](https://docs.aws.amazon.com/premiumsupport/enterprise-support/) .
 *
 * *Configure `AWS::Shield::ProactiveEngagement` for one account*
 *
 * To configure this resource through AWS CloudFormation , you must be subscribed to AWS Shield Advanced . You can subscribe through the [Shield Advanced console](https://docs.aws.amazon.com/wafv2/shieldv2#/) and through the APIs. For more information, see [Subscribe to AWS Shield Advanced](https://docs.aws.amazon.com/waf/latest/developerguide/enable-ddos-prem.html) .
 *
 * See example templates for Shield Advanced in AWS CloudFormation at [aws-samples/aws-shield-advanced-examples](https://docs.aws.amazon.com/https://github.com/aws-samples/aws-shield-advanced-examples) .
 *
 * *Configure Shield Advanced using AWS CloudFormation and AWS Firewall Manager*
 *
 * You might be able to use Firewall Manager with AWS CloudFormation to configure Shield Advanced across multiple accounts and protected resources. To do this, your accounts must be part of an organization in AWS Organizations . You can use Firewall Manager to configure Shield Advanced protections for any resource types except for Amazon Route 53 or AWS Global Accelerator .
 *
 * For an example of this, see the one-click configuration guidance published by the AWS technical community at [One-click deployment of Shield Advanced](https://docs.aws.amazon.com/https://youtu.be/LCA3FwMk_QE) .
 *
 * @cloudformationResource AWS::Shield::ProactiveEngagement
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-proactiveengagement.html
 */
export class CfnProactiveEngagement extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Shield::ProactiveEngagement";

  /**
   * Build a CfnProactiveEngagement from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProactiveEngagement {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnProactiveEngagementPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnProactiveEngagement(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the account that submitted the template.
   *
   * @cloudformationAttribute AccountId
   */
  public readonly attrAccountId: string;

  /**
   * The list of email addresses and phone numbers that the Shield Response Team (SRT) can use to contact you for escalations to the SRT and to initiate proactive customer support, plus any relevant notes.
   */
  public emergencyContactList: Array<CfnProactiveEngagement.EmergencyContactProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies whether proactive engagement is enabled or disabled.
   */
  public proactiveEngagementStatus: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnProactiveEngagementProps) {
    super(scope, id, {
      "type": CfnProactiveEngagement.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "emergencyContactList", this);
    cdk.requireProperty(props, "proactiveEngagementStatus", this);

    this.attrAccountId = cdk.Token.asString(this.getAtt("AccountId", cdk.ResolutionTypeHint.STRING));
    this.emergencyContactList = props.emergencyContactList;
    this.proactiveEngagementStatus = props.proactiveEngagementStatus;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "emergencyContactList": this.emergencyContactList,
      "proactiveEngagementStatus": this.proactiveEngagementStatus
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnProactiveEngagement.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnProactiveEngagementPropsToCloudFormation(props);
  }
}

export namespace CfnProactiveEngagement {
  /**
   * Contact information that the SRT can use to contact you if you have proactive engagement enabled, for escalations to the SRT and to initiate proactive customer support.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-shield-proactiveengagement-emergencycontact.html
   */
  export interface EmergencyContactProperty {
    /**
     * Additional notes regarding the contact.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-shield-proactiveengagement-emergencycontact.html#cfn-shield-proactiveengagement-emergencycontact-contactnotes
     */
    readonly contactNotes?: string;

    /**
     * The email address for the contact.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-shield-proactiveengagement-emergencycontact.html#cfn-shield-proactiveengagement-emergencycontact-emailaddress
     */
    readonly emailAddress: string;

    /**
     * The phone number for the contact.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-shield-proactiveengagement-emergencycontact.html#cfn-shield-proactiveengagement-emergencycontact-phonenumber
     */
    readonly phoneNumber?: string;
  }
}

/**
 * Properties for defining a `CfnProactiveEngagement`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-proactiveengagement.html
 */
export interface CfnProactiveEngagementProps {
  /**
   * The list of email addresses and phone numbers that the Shield Response Team (SRT) can use to contact you for escalations to the SRT and to initiate proactive customer support, plus any relevant notes.
   *
   * To enable proactive engagement, the contact list must include at least one phone number.
   *
   * If you provide more than one contact, in the notes, indicate the circumstances under which each contact should be used. Include primary and secondary contact designations, and provide the hours of availability and time zones for each contact.
   *
   * Example contact notes:
   *
   * - This is a hotline that's staffed 24x7x365. Please work with the responding analyst and they will get the appropriate person on the call.
   * - Please contact the secondary phone number if the hotline doesn't respond within 5 minutes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-proactiveengagement.html#cfn-shield-proactiveengagement-emergencycontactlist
   */
  readonly emergencyContactList: Array<CfnProactiveEngagement.EmergencyContactProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies whether proactive engagement is enabled or disabled.
   *
   * Valid values:
   *
   * `ENABLED` - The Shield Response Team (SRT) will use email and phone to notify contacts about escalations to the SRT and to initiate proactive customer support.
   *
   * `DISABLED` - The SRT will not proactively notify contacts about escalations or to initiate proactive customer support.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-proactiveengagement.html#cfn-shield-proactiveengagement-proactiveengagementstatus
   */
  readonly proactiveEngagementStatus: string;
}

/**
 * Determine whether the given properties match those of a `EmergencyContactProperty`
 *
 * @param properties - the TypeScript properties of a `EmergencyContactProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProactiveEngagementEmergencyContactPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contactNotes", cdk.validateString)(properties.contactNotes));
  errors.collect(cdk.propertyValidator("emailAddress", cdk.requiredValidator)(properties.emailAddress));
  errors.collect(cdk.propertyValidator("emailAddress", cdk.validateString)(properties.emailAddress));
  errors.collect(cdk.propertyValidator("phoneNumber", cdk.validateString)(properties.phoneNumber));
  return errors.wrap("supplied properties not correct for \"EmergencyContactProperty\"");
}

// @ts-ignore TS6133
function convertCfnProactiveEngagementEmergencyContactPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProactiveEngagementEmergencyContactPropertyValidator(properties).assertSuccess();
  return {
    "ContactNotes": cdk.stringToCloudFormation(properties.contactNotes),
    "EmailAddress": cdk.stringToCloudFormation(properties.emailAddress),
    "PhoneNumber": cdk.stringToCloudFormation(properties.phoneNumber)
  };
}

// @ts-ignore TS6133
function CfnProactiveEngagementEmergencyContactPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProactiveEngagement.EmergencyContactProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProactiveEngagement.EmergencyContactProperty>();
  ret.addPropertyResult("contactNotes", "ContactNotes", (properties.ContactNotes != null ? cfn_parse.FromCloudFormation.getString(properties.ContactNotes) : undefined));
  ret.addPropertyResult("emailAddress", "EmailAddress", (properties.EmailAddress != null ? cfn_parse.FromCloudFormation.getString(properties.EmailAddress) : undefined));
  ret.addPropertyResult("phoneNumber", "PhoneNumber", (properties.PhoneNumber != null ? cfn_parse.FromCloudFormation.getString(properties.PhoneNumber) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnProactiveEngagementProps`
 *
 * @param properties - the TypeScript properties of a `CfnProactiveEngagementProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProactiveEngagementPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("emergencyContactList", cdk.requiredValidator)(properties.emergencyContactList));
  errors.collect(cdk.propertyValidator("emergencyContactList", cdk.listValidator(CfnProactiveEngagementEmergencyContactPropertyValidator))(properties.emergencyContactList));
  errors.collect(cdk.propertyValidator("proactiveEngagementStatus", cdk.requiredValidator)(properties.proactiveEngagementStatus));
  errors.collect(cdk.propertyValidator("proactiveEngagementStatus", cdk.validateString)(properties.proactiveEngagementStatus));
  return errors.wrap("supplied properties not correct for \"CfnProactiveEngagementProps\"");
}

// @ts-ignore TS6133
function convertCfnProactiveEngagementPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProactiveEngagementPropsValidator(properties).assertSuccess();
  return {
    "EmergencyContactList": cdk.listMapper(convertCfnProactiveEngagementEmergencyContactPropertyToCloudFormation)(properties.emergencyContactList),
    "ProactiveEngagementStatus": cdk.stringToCloudFormation(properties.proactiveEngagementStatus)
  };
}

// @ts-ignore TS6133
function CfnProactiveEngagementPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProactiveEngagementProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProactiveEngagementProps>();
  ret.addPropertyResult("emergencyContactList", "EmergencyContactList", (properties.EmergencyContactList != null ? cfn_parse.FromCloudFormation.getArray(CfnProactiveEngagementEmergencyContactPropertyFromCloudFormation)(properties.EmergencyContactList) : undefined));
  ret.addPropertyResult("proactiveEngagementStatus", "ProactiveEngagementStatus", (properties.ProactiveEngagementStatus != null ? cfn_parse.FromCloudFormation.getString(properties.ProactiveEngagementStatus) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Enables AWS Shield Advanced for a specific AWS resource.
 *
 * The resource can be an Amazon CloudFront distribution, Amazon Route 53 hosted zone, AWS Global Accelerator standard accelerator, Elastic IP Address, Application Load Balancer, or a Classic Load Balancer. You can protect Amazon EC2 instances and Network Load Balancers by association with protected Amazon EC2 Elastic IP addresses.
 *
 * *Configure a single `AWS::Shield::Protection`*
 *
 * Use this protection to protect a single resource at a time.
 *
 * To configure this Shield Advanced protection through AWS CloudFormation , you must be subscribed to Shield Advanced . You can subscribe through the [Shield Advanced console](https://docs.aws.amazon.com/wafv2/shieldv2#/) and through the APIs. For more information, see [Subscribe to AWS Shield Advanced](https://docs.aws.amazon.com/waf/latest/developerguide/enable-ddos-prem.html) .
 *
 * See example templates for Shield Advanced in AWS CloudFormation at [aws-samples/aws-shield-advanced-examples](https://docs.aws.amazon.com/https://github.com/aws-samples/aws-shield-advanced-examples) .
 *
 * *Configure Shield Advanced using AWS CloudFormation and AWS Firewall Manager*
 *
 * You might be able to use Firewall Manager with AWS CloudFormation to configure Shield Advanced across multiple accounts and protected resources. To do this, your accounts must be part of an organization in AWS Organizations . You can use Firewall Manager to configure Shield Advanced protections for any resource types except for Amazon Route 53 or AWS Global Accelerator .
 *
 * For an example of this, see the one-click configuration guidance published by the AWS technical community at [One-click deployment of Shield Advanced](https://docs.aws.amazon.com/https://youtu.be/LCA3FwMk_QE) .
 *
 * *Configure multiple protections through the Shield Advanced console*
 *
 * You can add protection to multiple resources at once through the [Shield Advanced console](https://docs.aws.amazon.com/wafv2/shieldv2#/) . For more information see [Getting Started with AWS Shield Advanced](https://docs.aws.amazon.com/waf/latest/developerguide/getting-started-ddos.html) and [Managing resource protections in AWS Shield Advanced](https://docs.aws.amazon.com/waf/latest/developerguide/ddos-manage-protected-resources.html) .
 *
 * @cloudformationResource AWS::Shield::Protection
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-protection.html
 */
export class CfnProtection extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Shield::Protection";

  /**
   * Build a CfnProtection from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProtection {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnProtectionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnProtection(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN (Amazon Resource Name) of the new protection.
   *
   * @cloudformationAttribute ProtectionArn
   */
  public readonly attrProtectionArn: string;

  /**
   * The ID of the new protection.
   *
   * @cloudformationAttribute ProtectionId
   */
  public readonly attrProtectionId: string;

  /**
   * The automatic application layer DDoS mitigation settings for the protection.
   */
  public applicationLayerAutomaticResponseConfiguration?: CfnProtection.ApplicationLayerAutomaticResponseConfigurationProperty | cdk.IResolvable;

  /**
   * The ARN (Amazon Resource Name) of the health check to associate with the protection.
   */
  public healthCheckArns?: Array<string>;

  /**
   * The name of the protection. For example, `My CloudFront distributions` .
   */
  public name: string;

  /**
   * The ARN (Amazon Resource Name) of the AWS resource that is protected.
   */
  public resourceArn: string;

  /**
   * Key:value pairs associated with an AWS resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnProtectionProps) {
    super(scope, id, {
      "type": CfnProtection.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "resourceArn", this);

    this.attrProtectionArn = cdk.Token.asString(this.getAtt("ProtectionArn", cdk.ResolutionTypeHint.STRING));
    this.attrProtectionId = cdk.Token.asString(this.getAtt("ProtectionId", cdk.ResolutionTypeHint.STRING));
    this.applicationLayerAutomaticResponseConfiguration = props.applicationLayerAutomaticResponseConfiguration;
    this.healthCheckArns = props.healthCheckArns;
    this.name = props.name;
    this.resourceArn = props.resourceArn;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationLayerAutomaticResponseConfiguration": this.applicationLayerAutomaticResponseConfiguration,
      "healthCheckArns": this.healthCheckArns,
      "name": this.name,
      "resourceArn": this.resourceArn,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnProtection.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnProtectionPropsToCloudFormation(props);
  }
}

export namespace CfnProtection {
  /**
   * The automatic application layer DDoS mitigation settings for a `Protection` .
   *
   * This configuration determines whether Shield Advanced automatically manages rules in the web ACL in order to respond to application layer events that Shield Advanced determines to be DDoS attacks.
   *
   * If you use AWS CloudFormation to manage the web ACLs that you use with Shield Advanced automatic mitigation, see the guidance for the `AWS::WAFv2::WebACL` resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-shield-protection-applicationlayerautomaticresponseconfiguration.html
   */
  export interface ApplicationLayerAutomaticResponseConfigurationProperty {
    /**
     * Specifies the action setting that Shield Advanced should use in the AWS WAF rules that it creates on behalf of the protected resource in response to DDoS attacks.
     *
     * You specify this as part of the configuration for the automatic application layer DDoS mitigation feature, when you enable or update automatic mitigation. Shield Advanced creates the AWS WAF rules in a Shield Advanced-managed rule group, inside the web ACL that you have associated with the resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-shield-protection-applicationlayerautomaticresponseconfiguration.html#cfn-shield-protection-applicationlayerautomaticresponseconfiguration-action
     */
    readonly action: CfnProtection.ActionProperty | cdk.IResolvable;

    /**
     * Indicates whether automatic application layer DDoS mitigation is enabled for the protection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-shield-protection-applicationlayerautomaticresponseconfiguration.html#cfn-shield-protection-applicationlayerautomaticresponseconfiguration-status
     */
    readonly status: string;
  }

  /**
   * Specifies the action setting that Shield Advanced should use in the AWS WAF rules that it creates on behalf of the protected resource in response to DDoS attacks.
   *
   * You specify this as part of the configuration for the automatic application layer DDoS mitigation feature, when you enable or update automatic mitigation. Shield Advanced creates the AWS WAF rules in a Shield Advanced-managed rule group, inside the web ACL that you have associated with the resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-shield-protection-action.html
   */
  export interface ActionProperty {
    /**
     * Specifies that Shield Advanced should configure its AWS WAF rules with the AWS WAF `Block` action.
     *
     * You must specify exactly one action, either `Block` or `Count` .
     *
     * Example JSON: `{ "Block": {} }`
     *
     * Example YAML: `Block: {}`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-shield-protection-action.html#cfn-shield-protection-action-block
     */
    readonly block?: any | cdk.IResolvable;

    /**
     * Specifies that Shield Advanced should configure its AWS WAF rules with the AWS WAF `Count` action.
     *
     * You must specify exactly one action, either `Block` or `Count` .
     *
     * Example JSON: `{ "Count": {} }`
     *
     * Example YAML: `Count: {}`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-shield-protection-action.html#cfn-shield-protection-action-count
     */
    readonly count?: any | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnProtection`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-protection.html
 */
export interface CfnProtectionProps {
  /**
   * The automatic application layer DDoS mitigation settings for the protection.
   *
   * This configuration determines whether Shield Advanced automatically manages rules in the web ACL in order to respond to application layer events that Shield Advanced determines to be DDoS attacks.
   *
   * If you use AWS CloudFormation to manage the web ACLs that you use with Shield Advanced automatic mitigation, see the additional guidance about web ACL management in the `AWS::WAFv2::WebACL` resource description.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-protection.html#cfn-shield-protection-applicationlayerautomaticresponseconfiguration
   */
  readonly applicationLayerAutomaticResponseConfiguration?: CfnProtection.ApplicationLayerAutomaticResponseConfigurationProperty | cdk.IResolvable;

  /**
   * The ARN (Amazon Resource Name) of the health check to associate with the protection.
   *
   * Health-based detection provides improved responsiveness and accuracy in attack detection and mitigation.
   *
   * You can use this option with any resource type except for Route 53 hosted zones.
   *
   * For more information, see [Configuring health-based detection using health checks](https://docs.aws.amazon.com/waf/latest/developerguide/ddos-advanced-health-checks.html) in the *AWS Shield Advanced Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-protection.html#cfn-shield-protection-healthcheckarns
   */
  readonly healthCheckArns?: Array<string>;

  /**
   * The name of the protection. For example, `My CloudFront distributions` .
   *
   * > If you change the name of an existing protection, Shield Advanced deletes the protection and replaces it with a new one. While this is happening, the protection isn't available on the AWS resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-protection.html#cfn-shield-protection-name
   */
  readonly name: string;

  /**
   * The ARN (Amazon Resource Name) of the AWS resource that is protected.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-protection.html#cfn-shield-protection-resourcearn
   */
  readonly resourceArn: string;

  /**
   * Key:value pairs associated with an AWS resource.
   *
   * The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-protection.html#cfn-shield-protection-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProtectionActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("block", cdk.validateObject)(properties.block));
  errors.collect(cdk.propertyValidator("count", cdk.validateObject)(properties.count));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnProtectionActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProtectionActionPropertyValidator(properties).assertSuccess();
  return {
    "Block": cdk.objectToCloudFormation(properties.block),
    "Count": cdk.objectToCloudFormation(properties.count)
  };
}

// @ts-ignore TS6133
function CfnProtectionActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProtection.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProtection.ActionProperty>();
  ret.addPropertyResult("block", "Block", (properties.Block != null ? cfn_parse.FromCloudFormation.getAny(properties.Block) : undefined));
  ret.addPropertyResult("count", "Count", (properties.Count != null ? cfn_parse.FromCloudFormation.getAny(properties.Count) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ApplicationLayerAutomaticResponseConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationLayerAutomaticResponseConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProtectionApplicationLayerAutomaticResponseConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", CfnProtectionActionPropertyValidator)(properties.action));
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"ApplicationLayerAutomaticResponseConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnProtectionApplicationLayerAutomaticResponseConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProtectionApplicationLayerAutomaticResponseConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Action": convertCfnProtectionActionPropertyToCloudFormation(properties.action),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnProtectionApplicationLayerAutomaticResponseConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProtection.ApplicationLayerAutomaticResponseConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProtection.ApplicationLayerAutomaticResponseConfigurationProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? CfnProtectionActionPropertyFromCloudFormation(properties.Action) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnProtectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnProtectionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProtectionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationLayerAutomaticResponseConfiguration", CfnProtectionApplicationLayerAutomaticResponseConfigurationPropertyValidator)(properties.applicationLayerAutomaticResponseConfiguration));
  errors.collect(cdk.propertyValidator("healthCheckArns", cdk.listValidator(cdk.validateString))(properties.healthCheckArns));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnProtectionProps\"");
}

// @ts-ignore TS6133
function convertCfnProtectionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProtectionPropsValidator(properties).assertSuccess();
  return {
    "ApplicationLayerAutomaticResponseConfiguration": convertCfnProtectionApplicationLayerAutomaticResponseConfigurationPropertyToCloudFormation(properties.applicationLayerAutomaticResponseConfiguration),
    "HealthCheckArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.healthCheckArns),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ResourceArn": cdk.stringToCloudFormation(properties.resourceArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnProtectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProtectionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProtectionProps>();
  ret.addPropertyResult("applicationLayerAutomaticResponseConfiguration", "ApplicationLayerAutomaticResponseConfiguration", (properties.ApplicationLayerAutomaticResponseConfiguration != null ? CfnProtectionApplicationLayerAutomaticResponseConfigurationPropertyFromCloudFormation(properties.ApplicationLayerAutomaticResponseConfiguration) : undefined));
  ret.addPropertyResult("healthCheckArns", "HealthCheckArns", (properties.HealthCheckArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.HealthCheckArns) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("resourceArn", "ResourceArn", (properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a grouping of protected resources so they can be handled as a collective.
 *
 * This resource grouping improves the accuracy of detection and reduces false positives.
 *
 * To configure this resource through AWS CloudFormation , you must be subscribed to AWS Shield Advanced . You can subscribe through the [Shield Advanced console](https://docs.aws.amazon.com/wafv2/shieldv2#/) and through the APIs. For more information, see [Subscribe to AWS Shield Advanced](https://docs.aws.amazon.com/waf/latest/developerguide/enable-ddos-prem.html) .
 *
 * @cloudformationResource AWS::Shield::ProtectionGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-protectiongroup.html
 */
export class CfnProtectionGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Shield::ProtectionGroup";

  /**
   * Build a CfnProtectionGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProtectionGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnProtectionGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnProtectionGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN (Amazon Resource Name) of the new protection group.
   *
   * @cloudformationAttribute ProtectionGroupArn
   */
  public readonly attrProtectionGroupArn: string;

  /**
   * Defines how AWS Shield combines resource data for the group in order to detect, mitigate, and report events.
   */
  public aggregation: string;

  /**
   * The ARNs (Amazon Resource Names) of the resources to include in the protection group.
   */
  public members?: Array<string>;

  /**
   * The criteria to use to choose the protected resources for inclusion in the group.
   */
  public pattern: string;

  /**
   * The name of the protection group.
   */
  public protectionGroupId: string;

  /**
   * The resource type to include in the protection group.
   */
  public resourceType?: string;

  /**
   * Key:value pairs associated with an AWS resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnProtectionGroupProps) {
    super(scope, id, {
      "type": CfnProtectionGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "aggregation", this);
    cdk.requireProperty(props, "pattern", this);
    cdk.requireProperty(props, "protectionGroupId", this);

    this.attrProtectionGroupArn = cdk.Token.asString(this.getAtt("ProtectionGroupArn", cdk.ResolutionTypeHint.STRING));
    this.aggregation = props.aggregation;
    this.members = props.members;
    this.pattern = props.pattern;
    this.protectionGroupId = props.protectionGroupId;
    this.resourceType = props.resourceType;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "aggregation": this.aggregation,
      "members": this.members,
      "pattern": this.pattern,
      "protectionGroupId": this.protectionGroupId,
      "resourceType": this.resourceType,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnProtectionGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnProtectionGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnProtectionGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-protectiongroup.html
 */
export interface CfnProtectionGroupProps {
  /**
   * Defines how AWS Shield combines resource data for the group in order to detect, mitigate, and report events.
   *
   * - Sum - Use the total traffic across the group. This is a good choice for most cases. Examples include Elastic IP addresses for EC2 instances that scale manually or automatically.
   * - Mean - Use the average of the traffic across the group. This is a good choice for resources that share traffic uniformly. Examples include accelerators and load balancers.
   * - Max - Use the highest traffic from each resource. This is useful for resources that don't share traffic and for resources that share that traffic in a non-uniform way. Examples include Amazon CloudFront distributions and origin resources for CloudFront distributions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-protectiongroup.html#cfn-shield-protectiongroup-aggregation
   */
  readonly aggregation: string;

  /**
   * The ARNs (Amazon Resource Names) of the resources to include in the protection group.
   *
   * You must set this when you set `Pattern` to `ARBITRARY` and you must not set it for any other `Pattern` setting.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-protectiongroup.html#cfn-shield-protectiongroup-members
   */
  readonly members?: Array<string>;

  /**
   * The criteria to use to choose the protected resources for inclusion in the group.
   *
   * You can include all resources that have protections, provide a list of resource ARNs (Amazon Resource Names), or include all resources of a specified resource type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-protectiongroup.html#cfn-shield-protectiongroup-pattern
   */
  readonly pattern: string;

  /**
   * The name of the protection group.
   *
   * You use this to identify the protection group in lists and to manage the protection group, for example to update, delete, or describe it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-protectiongroup.html#cfn-shield-protectiongroup-protectiongroupid
   */
  readonly protectionGroupId: string;

  /**
   * The resource type to include in the protection group.
   *
   * All protected resources of this type are included in the protection group. You must set this when you set `Pattern` to `BY_RESOURCE_TYPE` and you must not set it for any other `Pattern` setting.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-protectiongroup.html#cfn-shield-protectiongroup-resourcetype
   */
  readonly resourceType?: string;

  /**
   * Key:value pairs associated with an AWS resource.
   *
   * The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-shield-protectiongroup.html#cfn-shield-protectiongroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnProtectionGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnProtectionGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProtectionGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aggregation", cdk.requiredValidator)(properties.aggregation));
  errors.collect(cdk.propertyValidator("aggregation", cdk.validateString)(properties.aggregation));
  errors.collect(cdk.propertyValidator("members", cdk.listValidator(cdk.validateString))(properties.members));
  errors.collect(cdk.propertyValidator("pattern", cdk.requiredValidator)(properties.pattern));
  errors.collect(cdk.propertyValidator("pattern", cdk.validateString)(properties.pattern));
  errors.collect(cdk.propertyValidator("protectionGroupId", cdk.requiredValidator)(properties.protectionGroupId));
  errors.collect(cdk.propertyValidator("protectionGroupId", cdk.validateString)(properties.protectionGroupId));
  errors.collect(cdk.propertyValidator("resourceType", cdk.validateString)(properties.resourceType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnProtectionGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnProtectionGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProtectionGroupPropsValidator(properties).assertSuccess();
  return {
    "Aggregation": cdk.stringToCloudFormation(properties.aggregation),
    "Members": cdk.listMapper(cdk.stringToCloudFormation)(properties.members),
    "Pattern": cdk.stringToCloudFormation(properties.pattern),
    "ProtectionGroupId": cdk.stringToCloudFormation(properties.protectionGroupId),
    "ResourceType": cdk.stringToCloudFormation(properties.resourceType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnProtectionGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProtectionGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProtectionGroupProps>();
  ret.addPropertyResult("aggregation", "Aggregation", (properties.Aggregation != null ? cfn_parse.FromCloudFormation.getString(properties.Aggregation) : undefined));
  ret.addPropertyResult("members", "Members", (properties.Members != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Members) : undefined));
  ret.addPropertyResult("pattern", "Pattern", (properties.Pattern != null ? cfn_parse.FromCloudFormation.getString(properties.Pattern) : undefined));
  ret.addPropertyResult("protectionGroupId", "ProtectionGroupId", (properties.ProtectionGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.ProtectionGroupId) : undefined));
  ret.addPropertyResult("resourceType", "ResourceType", (properties.ResourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}