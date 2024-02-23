/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates or updates an account-level data protection policy that applies to all log groups in the account.
 *
 * A data protection policy can help safeguard sensitive data that's ingested by your log groups by auditing and masking the sensitive log data. Each account can have only one account-level policy.
 *
 * > Sensitive data is detected and masked when it is ingested into a log group. When you set a data protection policy, log events ingested into the log groups before that time are not masked.
 *
 * If you create a data protection policy for your whole account, it applies to both existing log groups and all log groups that are created later in this account. The account policy is applied to existing log groups with eventual consistency. It might take up to 5 minutes before sensitive data in existing log groups begins to be masked.
 *
 * By default, when a user views a log event that includes masked data, the sensitive data is replaced by asterisks. A user who has the `logs:Unmask` permission can use a [GetLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_GetLogEvents.html) or [FilterLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_FilterLogEvents.html) operation with the `unmask` parameter set to `true` to view the unmasked log events. Users with the `logs:Unmask` can also view unmasked data in the CloudWatch Logs console by running a CloudWatch Logs Insights query with the `unmask` query command.
 *
 * For more information, including a list of types of data that can be audited and masked, see [Protect sensitive log data with masking](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html) .
 *
 * To create an account-level policy, you must be signed on with the `logs:PutDataProtectionPolicy` and `logs:PutAccountPolicy` permissions.
 *
 * An account-level policy applies to all log groups in the account. You can also create a data protection policy that applies to just one log group. If a log group has its own data protection policy and the account also has an account-level data protection policy, then the two policies are cumulative. Any sensitive term specified in either policy is masked.
 *
 * @cloudformationResource AWS::Logs::AccountPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-accountpolicy.html
 */
export class CfnAccountPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Logs::AccountPolicy";

  /**
   * Build a CfnAccountPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccountPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAccountPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccountPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The account ID of the account where this policy was created. For example, `123456789012` .
   *
   * @cloudformationAttribute AccountId
   */
  public readonly attrAccountId: string;

  /**
   * Specify the data protection policy, in JSON.
   */
  public policyDocument: string;

  /**
   * A name for the policy.
   */
  public policyName: string;

  /**
   * Currently the only valid value for this parameter is `DATA_PROTECTION_POLICY` .
   */
  public policyType: string;

  /**
   * Currently the only valid value for this parameter is `ALL` , which specifies that the data protection policy applies to all log groups in the account.
   */
  public scope?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccountPolicyProps) {
    super(scope, id, {
      "type": CfnAccountPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policyDocument", this);
    cdk.requireProperty(props, "policyName", this);
    cdk.requireProperty(props, "policyType", this);

    this.attrAccountId = cdk.Token.asString(this.getAtt("AccountId", cdk.ResolutionTypeHint.STRING));
    this.policyDocument = props.policyDocument;
    this.policyName = props.policyName;
    this.policyType = props.policyType;
    this.scope = props.scope;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policyDocument": this.policyDocument,
      "policyName": this.policyName,
      "policyType": this.policyType,
      "scope": this.scope
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccountPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccountPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAccountPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-accountpolicy.html
 */
export interface CfnAccountPolicyProps {
  /**
   * Specify the data protection policy, in JSON.
   *
   * This policy must include two JSON blocks:
   *
   * - The first block must include both a `DataIdentifer` array and an `Operation` property with an `Audit` action. The `DataIdentifer` array lists the types of sensitive data that you want to mask. For more information about the available options, see [Types of data that you can mask](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data-types.html) .
   *
   * The `Operation` property with an `Audit` action is required to find the sensitive data terms. This `Audit` action must contain a `FindingsDestination` object. You can optionally use that `FindingsDestination` object to list one or more destinations to send audit findings to. If you specify destinations such as log groups, Kinesis Data Firehose streams, and S3 buckets, they must already exist.
   * - The second block must include both a `DataIdentifer` array and an `Operation` property with an `Deidentify` action. The `DataIdentifer` array must exactly match the `DataIdentifer` array in the first block of the policy.
   *
   * The `Operation` property with the `Deidentify` action is what actually masks the data, and it must contain the `"MaskConfig": {}` object. The `"MaskConfig": {}` object must be empty.
   *
   * > The contents of the two `DataIdentifer` arrays must match exactly.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-accountpolicy.html#cfn-logs-accountpolicy-policydocument
   */
  readonly policyDocument: string;

  /**
   * A name for the policy.
   *
   * This must be unique within the account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-accountpolicy.html#cfn-logs-accountpolicy-policyname
   */
  readonly policyName: string;

  /**
   * Currently the only valid value for this parameter is `DATA_PROTECTION_POLICY` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-accountpolicy.html#cfn-logs-accountpolicy-policytype
   */
  readonly policyType: string;

  /**
   * Currently the only valid value for this parameter is `ALL` , which specifies that the data protection policy applies to all log groups in the account.
   *
   * If you omit this parameter, the default of `ALL` is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-accountpolicy.html#cfn-logs-accountpolicy-scope
   */
  readonly scope?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAccountPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccountPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccountPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateString)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyName", cdk.requiredValidator)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyType", cdk.requiredValidator)(properties.policyType));
  errors.collect(cdk.propertyValidator("policyType", cdk.validateString)(properties.policyType));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  return errors.wrap("supplied properties not correct for \"CfnAccountPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnAccountPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccountPolicyPropsValidator(properties).assertSuccess();
  return {
    "PolicyDocument": cdk.stringToCloudFormation(properties.policyDocument),
    "PolicyName": cdk.stringToCloudFormation(properties.policyName),
    "PolicyType": cdk.stringToCloudFormation(properties.policyType),
    "Scope": cdk.stringToCloudFormation(properties.scope)
  };
}

// @ts-ignore TS6133
function CfnAccountPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccountPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccountPolicyProps>();
  ret.addPropertyResult("policyDocument", "PolicyDocument", (properties.PolicyDocument != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyDocument) : undefined));
  ret.addPropertyResult("policyName", "PolicyName", (properties.PolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyName) : undefined));
  ret.addPropertyResult("policyType", "PolicyType", (properties.PolicyType != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyType) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::Logs::Destination resource specifies a CloudWatch Logs destination.
 *
 * A destination encapsulates a physical resource (such as an Amazon Kinesis data stream) and enables you to subscribe that resource to a stream of log events.
 *
 * @cloudformationResource AWS::Logs::Destination
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html
 */
export class CfnDestination extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Logs::Destination";

  /**
   * Build a CfnDestination from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDestination {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDestinationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDestination(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the CloudWatch Logs destination, such as `arn:aws:logs:us-west-1:123456789012:destination:MyDestination` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the destination.
   */
  public destinationName: string;

  /**
   * An IAM policy document that governs which AWS accounts can create subscription filters against this destination.
   */
  public destinationPolicy?: string;

  /**
   * The ARN of an IAM role that permits CloudWatch Logs to send data to the specified AWS resource.
   */
  public roleArn: string;

  /**
   * The Amazon Resource Name (ARN) of the physical target where the log events are delivered (for example, a Kinesis stream).
   */
  public targetArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDestinationProps) {
    super(scope, id, {
      "type": CfnDestination.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "destinationName", this);
    cdk.requireProperty(props, "roleArn", this);
    cdk.requireProperty(props, "targetArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.destinationName = props.destinationName;
    this.destinationPolicy = props.destinationPolicy;
    this.roleArn = props.roleArn;
    this.targetArn = props.targetArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "destinationName": this.destinationName,
      "destinationPolicy": this.destinationPolicy,
      "roleArn": this.roleArn,
      "targetArn": this.targetArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDestination.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDestinationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDestination`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html
 */
export interface CfnDestinationProps {
  /**
   * The name of the destination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html#cfn-logs-destination-destinationname
   */
  readonly destinationName: string;

  /**
   * An IAM policy document that governs which AWS accounts can create subscription filters against this destination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html#cfn-logs-destination-destinationpolicy
   */
  readonly destinationPolicy?: string;

  /**
   * The ARN of an IAM role that permits CloudWatch Logs to send data to the specified AWS resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html#cfn-logs-destination-rolearn
   */
  readonly roleArn: string;

  /**
   * The Amazon Resource Name (ARN) of the physical target where the log events are delivered (for example, a Kinesis stream).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-destination.html#cfn-logs-destination-targetarn
   */
  readonly targetArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnDestinationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDestinationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDestinationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationName", cdk.requiredValidator)(properties.destinationName));
  errors.collect(cdk.propertyValidator("destinationName", cdk.validateString)(properties.destinationName));
  errors.collect(cdk.propertyValidator("destinationPolicy", cdk.validateString)(properties.destinationPolicy));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("targetArn", cdk.requiredValidator)(properties.targetArn));
  errors.collect(cdk.propertyValidator("targetArn", cdk.validateString)(properties.targetArn));
  return errors.wrap("supplied properties not correct for \"CfnDestinationProps\"");
}

// @ts-ignore TS6133
function convertCfnDestinationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDestinationPropsValidator(properties).assertSuccess();
  return {
    "DestinationName": cdk.stringToCloudFormation(properties.destinationName),
    "DestinationPolicy": cdk.stringToCloudFormation(properties.destinationPolicy),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "TargetArn": cdk.stringToCloudFormation(properties.targetArn)
  };
}

// @ts-ignore TS6133
function CfnDestinationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDestinationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDestinationProps>();
  ret.addPropertyResult("destinationName", "DestinationName", (properties.DestinationName != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationName) : undefined));
  ret.addPropertyResult("destinationPolicy", "DestinationPolicy", (properties.DestinationPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationPolicy) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("targetArn", "TargetArn", (properties.TargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Logs::LogGroup` resource specifies a log group.
 *
 * A log group defines common properties for log streams, such as their retention and access control rules. Each log stream must belong to one log group.
 *
 * You can create up to 1,000,000 log groups per Region per account. You must use the following guidelines when naming a log group:
 *
 * - Log group names must be unique within a Region for an AWS account.
 * - Log group names can be between 1 and 512 characters long.
 * - Log group names consist of the following characters: a-z, A-Z, 0-9, '_' (underscore), '-' (hyphen), '/' (forward slash), and '.' (period).
 *
 * @cloudformationResource AWS::Logs::LogGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html
 */
export class CfnLogGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Logs::LogGroup";

  /**
   * Build a CfnLogGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLogGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLogGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLogGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the log group, such as `arn:aws:logs:us-west-1:123456789012:log-group:/mystack-testgroup-12ABC1AB12A1:*`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Creates a data protection policy and assigns it to the log group.
   */
  public dataProtectionPolicy?: any | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the AWS KMS key to use when encrypting log data.
   */
  public kmsKeyId?: string;

  /**
   * Specifies the log group class for this log group. There are two classes:.
   */
  public logGroupClass?: string;

  /**
   * The name of the log group.
   */
  public logGroupName?: string;

  /**
   * The number of days to retain the log events in the specified log group.
   */
  public retentionInDays?: number;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to the log group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLogGroupProps = {}) {
    super(scope, id, {
      "type": CfnLogGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.dataProtectionPolicy = props.dataProtectionPolicy;
    this.kmsKeyId = props.kmsKeyId;
    this.logGroupClass = props.logGroupClass;
    this.logGroupName = props.logGroupName;
    this.retentionInDays = props.retentionInDays;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Logs::LogGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::Logs::LogGroup' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dataProtectionPolicy": this.dataProtectionPolicy,
      "kmsKeyId": this.kmsKeyId,
      "logGroupClass": this.logGroupClass,
      "logGroupName": this.logGroupName,
      "retentionInDays": this.retentionInDays,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLogGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLogGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLogGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html
 */
export interface CfnLogGroupProps {
  /**
   * Creates a data protection policy and assigns it to the log group.
   *
   * A data protection policy can help safeguard sensitive data that's ingested by the log group by auditing and masking the sensitive log data. When a user who does not have permission to view masked data views a log event that includes masked data, the sensitive data is replaced by asterisks.
   *
   * For more information, including a list of types of data that can be audited and masked, see [Protect sensitive log data with masking](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-dataprotectionpolicy
   */
  readonly dataProtectionPolicy?: any | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the AWS KMS key to use when encrypting log data.
   *
   * To associate an AWS KMS key with the log group, specify the ARN of that KMS key here. If you do so, ingested data is encrypted using this key. This association is stored as long as the data encrypted with the KMS key is still within CloudWatch Logs . This enables CloudWatch Logs to decrypt this data whenever it is requested.
   *
   * If you attempt to associate a KMS key with the log group but the KMS key doesn't exist or is deactivated, you will receive an `InvalidParameterException` error.
   *
   * Log group data is always encrypted in CloudWatch Logs . If you omit this key, the encryption does not use AWS KMS . For more information, see [Encrypt log data in CloudWatch Logs using AWS Key Management Service](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * Specifies the log group class for this log group. There are two classes:.
   *
   * - The `Standard` log class supports all CloudWatch Logs features.
   * - The `Infrequent Access` log class supports a subset of CloudWatch Logs features and incurs lower costs.
   *
   * For details about the features supported by each class, see [Log classes](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html)
   *
   * @default - "STANDARD"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-loggroupclass
   */
  readonly logGroupClass?: string;

  /**
   * The name of the log group.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique ID for the log group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-loggroupname
   */
  readonly logGroupName?: string;

  /**
   * The number of days to retain the log events in the specified log group.
   *
   * Possible values are: 1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1096, 1827, 2192, 2557, 2922, 3288, and 3653.
   *
   * To set a log group so that its log events do not expire, use [DeleteRetentionPolicy](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_DeleteRetentionPolicy.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-retentionindays
   */
  readonly retentionInDays?: number;

  /**
   * An array of key-value pairs to apply to the log group.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnLogGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnLogGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLogGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataProtectionPolicy", cdk.validateObject)(properties.dataProtectionPolicy));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("logGroupClass", cdk.validateString)(properties.logGroupClass));
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("retentionInDays", cdk.validateNumber)(properties.retentionInDays));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLogGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnLogGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLogGroupPropsValidator(properties).assertSuccess();
  return {
    "DataProtectionPolicy": cdk.objectToCloudFormation(properties.dataProtectionPolicy),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "LogGroupClass": cdk.stringToCloudFormation(properties.logGroupClass),
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName),
    "RetentionInDays": cdk.numberToCloudFormation(properties.retentionInDays),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLogGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLogGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLogGroupProps>();
  ret.addPropertyResult("dataProtectionPolicy", "DataProtectionPolicy", (properties.DataProtectionPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.DataProtectionPolicy) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("logGroupClass", "LogGroupClass", (properties.LogGroupClass != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupClass) : undefined));
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addPropertyResult("retentionInDays", "RetentionInDays", (properties.RetentionInDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetentionInDays) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Logs::LogStream` resource specifies an Amazon CloudWatch Logs log stream in a specific log group.
 *
 * A log stream represents the sequence of events coming from an application instance or resource that you are monitoring.
 *
 * There is no limit on the number of log streams that you can create for a log group.
 *
 * You must use the following guidelines when naming a log stream:
 *
 * - Log stream names must be unique within the log group.
 * - Log stream names can be between 1 and 512 characters long.
 * - The ':' (colon) and '*' (asterisk) characters are not allowed.
 *
 * @cloudformationResource AWS::Logs::LogStream
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-logstream.html
 */
export class CfnLogStream extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Logs::LogStream";

  /**
   * Build a CfnLogStream from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLogStream {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLogStreamPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLogStream(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the log group where the log stream is created.
   */
  public logGroupName: string;

  /**
   * The name of the log stream.
   */
  public logStreamName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLogStreamProps) {
    super(scope, id, {
      "type": CfnLogStream.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "logGroupName", this);

    this.logGroupName = props.logGroupName;
    this.logStreamName = props.logStreamName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "logGroupName": this.logGroupName,
      "logStreamName": this.logStreamName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLogStream.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLogStreamPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLogStream`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-logstream.html
 */
export interface CfnLogStreamProps {
  /**
   * The name of the log group where the log stream is created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-logstream.html#cfn-logs-logstream-loggroupname
   */
  readonly logGroupName: string;

  /**
   * The name of the log stream.
   *
   * The name must be unique within the log group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-logstream.html#cfn-logs-logstream-logstreamname
   */
  readonly logStreamName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnLogStreamProps`
 *
 * @param properties - the TypeScript properties of a `CfnLogStreamProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLogStreamPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroupName", cdk.requiredValidator)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("logStreamName", cdk.validateString)(properties.logStreamName));
  return errors.wrap("supplied properties not correct for \"CfnLogStreamProps\"");
}

// @ts-ignore TS6133
function convertCfnLogStreamPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLogStreamPropsValidator(properties).assertSuccess();
  return {
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName),
    "LogStreamName": cdk.stringToCloudFormation(properties.logStreamName)
  };
}

// @ts-ignore TS6133
function CfnLogStreamPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLogStreamProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLogStreamProps>();
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addPropertyResult("logStreamName", "LogStreamName", (properties.LogStreamName != null ? cfn_parse.FromCloudFormation.getString(properties.LogStreamName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Logs::MetricFilter` resource specifies a metric filter that describes how CloudWatch Logs extracts information from logs and transforms it into Amazon CloudWatch metrics.
 *
 * If you have multiple metric filters that are associated with a log group, all the filters are applied to the log streams in that group.
 *
 * The maximum number of metric filters that can be associated with a log group is 100.
 *
 * @cloudformationResource AWS::Logs::MetricFilter
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html
 */
export class CfnMetricFilter extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Logs::MetricFilter";

  /**
   * Build a CfnMetricFilter from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMetricFilter {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMetricFilterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMetricFilter(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the metric filter.
   */
  public filterName?: string;

  /**
   * A filter pattern for extracting metric data out of ingested log events.
   */
  public filterPattern: string;

  /**
   * The name of an existing log group that you want to associate with this metric filter.
   */
  public logGroupName: string;

  /**
   * The metric transformations.
   */
  public metricTransformations: Array<cdk.IResolvable | CfnMetricFilter.MetricTransformationProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMetricFilterProps) {
    super(scope, id, {
      "type": CfnMetricFilter.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "filterPattern", this);
    cdk.requireProperty(props, "logGroupName", this);
    cdk.requireProperty(props, "metricTransformations", this);

    this.filterName = props.filterName;
    this.filterPattern = props.filterPattern;
    this.logGroupName = props.logGroupName;
    this.metricTransformations = props.metricTransformations;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "filterName": this.filterName,
      "filterPattern": this.filterPattern,
      "logGroupName": this.logGroupName,
      "metricTransformations": this.metricTransformations
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMetricFilter.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMetricFilterPropsToCloudFormation(props);
  }
}

export namespace CfnMetricFilter {
  /**
   * `MetricTransformation` is a property of the `AWS::Logs::MetricFilter` resource that describes how to transform log streams into a CloudWatch metric.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html
   */
  export interface MetricTransformationProperty {
    /**
     * (Optional) The value to emit when a filter pattern does not match a log event.
     *
     * This value can be null.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-logs-metricfilter-metrictransformation-defaultvalue
     */
    readonly defaultValue?: number;

    /**
     * The fields to use as dimensions for the metric. One metric filter can include as many as three dimensions.
     *
     * > Metrics extracted from log events are charged as custom metrics. To prevent unexpected high charges, do not specify high-cardinality fields such as `IPAddress` or `requestID` as dimensions. Each different value found for a dimension is treated as a separate metric and accrues charges as a separate custom metric.
     * >
     * > CloudWatch Logs disables a metric filter if it generates 1000 different name/value pairs for your specified dimensions within a certain amount of time. This helps to prevent accidental high charges.
     * >
     * > You can also set up a billing alarm to alert you if your charges are higher than expected. For more information, see [Creating a Billing Alarm to Monitor Your Estimated AWS Charges](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-logs-metricfilter-metrictransformation-dimensions
     */
    readonly dimensions?: Array<CfnMetricFilter.DimensionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the CloudWatch metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-logs-metricfilter-metrictransformation-metricname
     */
    readonly metricName: string;

    /**
     * A custom namespace to contain your metric in CloudWatch.
     *
     * Use namespaces to group together metrics that are similar. For more information, see [Namespaces](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Namespace) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-logs-metricfilter-metrictransformation-metricnamespace
     */
    readonly metricNamespace: string;

    /**
     * The value that is published to the CloudWatch metric.
     *
     * For example, if you're counting the occurrences of a particular term like `Error` , specify 1 for the metric value. If you're counting the number of bytes transferred, reference the value that is in the log event by using $. followed by the name of the field that you specified in the filter pattern, such as `$.size` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-logs-metricfilter-metrictransformation-metricvalue
     */
    readonly metricValue: string;

    /**
     * The unit to assign to the metric.
     *
     * If you omit this, the unit is set as `None` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-logs-metricfilter-metrictransformation-unit
     */
    readonly unit?: string;
  }

  /**
   * Specifies the CloudWatch metric dimensions to publish with this metric.
   *
   * Because dimensions are part of the unique identifier for a metric, whenever a unique dimension name/value pair is extracted from your logs, you are creating a new variation of that metric.
   *
   * For more information about publishing dimensions with metrics created by metric filters, see [Publishing dimensions with metrics from values in JSON or space-delimited log events](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html#logs-metric-filters-dimensions) .
   *
   * > Metrics extracted from log events are charged as custom metrics. To prevent unexpected high charges, do not specify high-cardinality fields such as `IPAddress` or `requestID` as dimensions. Each different value found for a dimension is treated as a separate metric and accrues charges as a separate custom metric.
   * >
   * > To help prevent accidental high charges, Amazon disables a metric filter if it generates 1000 different name/value pairs for the dimensions that you have specified within a certain amount of time.
   * >
   * > You can also set up a billing alarm to alert you if your charges are higher than expected. For more information, see [Creating a Billing Alarm to Monitor Your Estimated AWS Charges](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-dimension.html
   */
  export interface DimensionProperty {
    /**
     * The name for the CloudWatch metric dimension that the metric filter creates.
     *
     * Dimension names must contain only ASCII characters, must include at least one non-whitespace character, and cannot start with a colon (:).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-dimension.html#cfn-logs-metricfilter-dimension-key
     */
    readonly key: string;

    /**
     * The log event field that will contain the value for this dimension.
     *
     * This dimension will only be published for a metric if the value is found in the log event. For example, `$.eventType` for JSON log events, or `$server` for space-delimited log events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-dimension.html#cfn-logs-metricfilter-dimension-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnMetricFilter`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html
 */
export interface CfnMetricFilterProps {
  /**
   * The name of the metric filter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-logs-metricfilter-filtername
   */
  readonly filterName?: string;

  /**
   * A filter pattern for extracting metric data out of ingested log events.
   *
   * For more information, see [Filter and Pattern Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-logs-metricfilter-filterpattern
   */
  readonly filterPattern: string;

  /**
   * The name of an existing log group that you want to associate with this metric filter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-logs-metricfilter-loggroupname
   */
  readonly logGroupName: string;

  /**
   * The metric transformations.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html#cfn-logs-metricfilter-metrictransformations
   */
  readonly metricTransformations: Array<cdk.IResolvable | CfnMetricFilter.MetricTransformationProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `DimensionProperty`
 *
 * @param properties - the TypeScript properties of a `DimensionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMetricFilterDimensionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"DimensionProperty\"");
}

// @ts-ignore TS6133
function convertCfnMetricFilterDimensionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMetricFilterDimensionPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnMetricFilterDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMetricFilter.DimensionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMetricFilter.DimensionProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricTransformationProperty`
 *
 * @param properties - the TypeScript properties of a `MetricTransformationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMetricFilterMetricTransformationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultValue", cdk.validateNumber)(properties.defaultValue));
  errors.collect(cdk.propertyValidator("dimensions", cdk.listValidator(CfnMetricFilterDimensionPropertyValidator))(properties.dimensions));
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricNamespace", cdk.requiredValidator)(properties.metricNamespace));
  errors.collect(cdk.propertyValidator("metricNamespace", cdk.validateString)(properties.metricNamespace));
  errors.collect(cdk.propertyValidator("metricValue", cdk.requiredValidator)(properties.metricValue));
  errors.collect(cdk.propertyValidator("metricValue", cdk.validateString)(properties.metricValue));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  return errors.wrap("supplied properties not correct for \"MetricTransformationProperty\"");
}

// @ts-ignore TS6133
function convertCfnMetricFilterMetricTransformationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMetricFilterMetricTransformationPropertyValidator(properties).assertSuccess();
  return {
    "DefaultValue": cdk.numberToCloudFormation(properties.defaultValue),
    "Dimensions": cdk.listMapper(convertCfnMetricFilterDimensionPropertyToCloudFormation)(properties.dimensions),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "MetricNamespace": cdk.stringToCloudFormation(properties.metricNamespace),
    "MetricValue": cdk.stringToCloudFormation(properties.metricValue),
    "Unit": cdk.stringToCloudFormation(properties.unit)
  };
}

// @ts-ignore TS6133
function CfnMetricFilterMetricTransformationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMetricFilter.MetricTransformationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMetricFilter.MetricTransformationProperty>();
  ret.addPropertyResult("defaultValue", "DefaultValue", (properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultValue) : undefined));
  ret.addPropertyResult("dimensions", "Dimensions", (properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnMetricFilterDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("metricNamespace", "MetricNamespace", (properties.MetricNamespace != null ? cfn_parse.FromCloudFormation.getString(properties.MetricNamespace) : undefined));
  ret.addPropertyResult("metricValue", "MetricValue", (properties.MetricValue != null ? cfn_parse.FromCloudFormation.getString(properties.MetricValue) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMetricFilterProps`
 *
 * @param properties - the TypeScript properties of a `CfnMetricFilterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMetricFilterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filterName", cdk.validateString)(properties.filterName));
  errors.collect(cdk.propertyValidator("filterPattern", cdk.requiredValidator)(properties.filterPattern));
  errors.collect(cdk.propertyValidator("filterPattern", cdk.validateString)(properties.filterPattern));
  errors.collect(cdk.propertyValidator("logGroupName", cdk.requiredValidator)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("metricTransformations", cdk.requiredValidator)(properties.metricTransformations));
  errors.collect(cdk.propertyValidator("metricTransformations", cdk.listValidator(CfnMetricFilterMetricTransformationPropertyValidator))(properties.metricTransformations));
  return errors.wrap("supplied properties not correct for \"CfnMetricFilterProps\"");
}

// @ts-ignore TS6133
function convertCfnMetricFilterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMetricFilterPropsValidator(properties).assertSuccess();
  return {
    "FilterName": cdk.stringToCloudFormation(properties.filterName),
    "FilterPattern": cdk.stringToCloudFormation(properties.filterPattern),
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName),
    "MetricTransformations": cdk.listMapper(convertCfnMetricFilterMetricTransformationPropertyToCloudFormation)(properties.metricTransformations)
  };
}

// @ts-ignore TS6133
function CfnMetricFilterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMetricFilterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMetricFilterProps>();
  ret.addPropertyResult("filterName", "FilterName", (properties.FilterName != null ? cfn_parse.FromCloudFormation.getString(properties.FilterName) : undefined));
  ret.addPropertyResult("filterPattern", "FilterPattern", (properties.FilterPattern != null ? cfn_parse.FromCloudFormation.getString(properties.FilterPattern) : undefined));
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addPropertyResult("metricTransformations", "MetricTransformations", (properties.MetricTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnMetricFilterMetricTransformationPropertyFromCloudFormation)(properties.MetricTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a query definition for CloudWatch Logs Insights.
 *
 * For more information, see [Analyzing Log Data with CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) .
 *
 * @cloudformationResource AWS::Logs::QueryDefinition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html
 */
export class CfnQueryDefinition extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Logs::QueryDefinition";

  /**
   * Build a CfnQueryDefinition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnQueryDefinition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnQueryDefinitionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnQueryDefinition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the query definition.
   *
   * @cloudformationAttribute QueryDefinitionId
   */
  public readonly attrQueryDefinitionId: string;

  /**
   * Use this parameter if you want the query to query only certain log groups.
   */
  public logGroupNames?: Array<string>;

  /**
   * A name for the query definition.
   */
  public name: string;

  /**
   * The query string to use for this query definition.
   */
  public queryString: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnQueryDefinitionProps) {
    super(scope, id, {
      "type": CfnQueryDefinition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "queryString", this);

    this.attrQueryDefinitionId = cdk.Token.asString(this.getAtt("QueryDefinitionId", cdk.ResolutionTypeHint.STRING));
    this.logGroupNames = props.logGroupNames;
    this.name = props.name;
    this.queryString = props.queryString;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "logGroupNames": this.logGroupNames,
      "name": this.name,
      "queryString": this.queryString
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnQueryDefinition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnQueryDefinitionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnQueryDefinition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html
 */
export interface CfnQueryDefinitionProps {
  /**
   * Use this parameter if you want the query to query only certain log groups.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html#cfn-logs-querydefinition-loggroupnames
   */
  readonly logGroupNames?: Array<string>;

  /**
   * A name for the query definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html#cfn-logs-querydefinition-name
   */
  readonly name: string;

  /**
   * The query string to use for this query definition.
   *
   * For more information, see [CloudWatch Logs Insights Query Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html#cfn-logs-querydefinition-querystring
   */
  readonly queryString: string;
}

/**
 * Determine whether the given properties match those of a `CfnQueryDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnQueryDefinitionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnQueryDefinitionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroupNames", cdk.listValidator(cdk.validateString))(properties.logGroupNames));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("queryString", cdk.requiredValidator)(properties.queryString));
  errors.collect(cdk.propertyValidator("queryString", cdk.validateString)(properties.queryString));
  return errors.wrap("supplied properties not correct for \"CfnQueryDefinitionProps\"");
}

// @ts-ignore TS6133
function convertCfnQueryDefinitionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnQueryDefinitionPropsValidator(properties).assertSuccess();
  return {
    "LogGroupNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.logGroupNames),
    "Name": cdk.stringToCloudFormation(properties.name),
    "QueryString": cdk.stringToCloudFormation(properties.queryString)
  };
}

// @ts-ignore TS6133
function CfnQueryDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnQueryDefinitionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQueryDefinitionProps>();
  ret.addPropertyResult("logGroupNames", "LogGroupNames", (properties.LogGroupNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LogGroupNames) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("queryString", "QueryString", (properties.QueryString != null ? cfn_parse.FromCloudFormation.getString(properties.QueryString) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates or updates a resource policy that allows other AWS services to put log events to this account.
 *
 * An account can have up to 10 resource policies per AWS Region.
 *
 * @cloudformationResource AWS::Logs::ResourcePolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-resourcepolicy.html
 */
export class CfnResourcePolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Logs::ResourcePolicy";

  /**
   * Build a CfnResourcePolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourcePolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourcePolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourcePolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The details of the policy.
   */
  public policyDocument: string;

  /**
   * The name of the resource policy.
   */
  public policyName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourcePolicyProps) {
    super(scope, id, {
      "type": CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policyDocument", this);
    cdk.requireProperty(props, "policyName", this);

    this.policyDocument = props.policyDocument;
    this.policyName = props.policyName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourcePolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnResourcePolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-resourcepolicy.html
 */
export interface CfnResourcePolicyProps {
  /**
   * The details of the policy.
   *
   * It must be formatted in JSON, and you must use backslashes to escape characters that need to be escaped in JSON strings, such as double quote marks.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-resourcepolicy.html#cfn-logs-resourcepolicy-policydocument
   */
  readonly policyDocument: string;

  /**
   * The name of the resource policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-resourcepolicy.html#cfn-logs-resourcepolicy-policyname
   */
  readonly policyName: string;
}

/**
 * Determine whether the given properties match those of a `CfnResourcePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourcePolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourcePolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateString)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyName", cdk.requiredValidator)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  return errors.wrap("supplied properties not correct for \"CfnResourcePolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnResourcePolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourcePolicyPropsValidator(properties).assertSuccess();
  return {
    "PolicyDocument": cdk.stringToCloudFormation(properties.policyDocument),
    "PolicyName": cdk.stringToCloudFormation(properties.policyName)
  };
}

// @ts-ignore TS6133
function CfnResourcePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourcePolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourcePolicyProps>();
  ret.addPropertyResult("policyDocument", "PolicyDocument", (properties.PolicyDocument != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyDocument) : undefined));
  ret.addPropertyResult("policyName", "PolicyName", (properties.PolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Logs::SubscriptionFilter` resource specifies a subscription filter and associates it with the specified log group.
 *
 * Subscription filters allow you to subscribe to a real-time stream of log events and have them delivered to a specific destination. Currently, the supported destinations are:
 *
 * - An Amazon Kinesis data stream belonging to the same account as the subscription filter, for same-account delivery.
 * - A logical destination that belongs to a different account, for cross-account delivery.
 * - An Amazon Kinesis Firehose delivery stream that belongs to the same account as the subscription filter, for same-account delivery.
 * - An AWS Lambda function that belongs to the same account as the subscription filter, for same-account delivery.
 *
 * There can be as many as two subscription filters associated with a log group.
 *
 * @cloudformationResource AWS::Logs::SubscriptionFilter
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html
 */
export class CfnSubscriptionFilter extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Logs::SubscriptionFilter";

  /**
   * Build a CfnSubscriptionFilter from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSubscriptionFilter {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSubscriptionFilterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSubscriptionFilter(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the destination.
   */
  public destinationArn: string;

  /**
   * The method used to distribute log data to the destination, which can be either random or grouped by log stream.
   */
  public distribution?: string;

  /**
   * The name of the subscription filter.
   */
  public filterName?: string;

  /**
   * The filtering expressions that restrict what gets delivered to the destination AWS resource.
   */
  public filterPattern: string;

  /**
   * The log group to associate with the subscription filter.
   */
  public logGroupName: string;

  /**
   * The ARN of an IAM role that grants CloudWatch Logs permissions to deliver ingested log events to the destination stream.
   */
  public roleArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSubscriptionFilterProps) {
    super(scope, id, {
      "type": CfnSubscriptionFilter.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "destinationArn", this);
    cdk.requireProperty(props, "filterPattern", this);
    cdk.requireProperty(props, "logGroupName", this);

    this.destinationArn = props.destinationArn;
    this.distribution = props.distribution;
    this.filterName = props.filterName;
    this.filterPattern = props.filterPattern;
    this.logGroupName = props.logGroupName;
    this.roleArn = props.roleArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "destinationArn": this.destinationArn,
      "distribution": this.distribution,
      "filterName": this.filterName,
      "filterPattern": this.filterPattern,
      "logGroupName": this.logGroupName,
      "roleArn": this.roleArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSubscriptionFilter.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSubscriptionFilterPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSubscriptionFilter`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html
 */
export interface CfnSubscriptionFilterProps {
  /**
   * The Amazon Resource Name (ARN) of the destination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-destinationarn
   */
  readonly destinationArn: string;

  /**
   * The method used to distribute log data to the destination, which can be either random or grouped by log stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-distribution
   */
  readonly distribution?: string;

  /**
   * The name of the subscription filter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-filtername
   */
  readonly filterName?: string;

  /**
   * The filtering expressions that restrict what gets delivered to the destination AWS resource.
   *
   * For more information about the filter pattern syntax, see [Filter and Pattern Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-filterpattern
   */
  readonly filterPattern: string;

  /**
   * The log group to associate with the subscription filter.
   *
   * All log events that are uploaded to this log group are filtered and delivered to the specified AWS resource if the filter pattern matches the log events.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-loggroupname
   */
  readonly logGroupName: string;

  /**
   * The ARN of an IAM role that grants CloudWatch Logs permissions to deliver ingested log events to the destination stream.
   *
   * You don't need to provide the ARN when you are working with a logical destination for cross-account delivery.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-logs-subscriptionfilter-rolearn
   */
  readonly roleArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSubscriptionFilterProps`
 *
 * @param properties - the TypeScript properties of a `CfnSubscriptionFilterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSubscriptionFilterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationArn", cdk.requiredValidator)(properties.destinationArn));
  errors.collect(cdk.propertyValidator("destinationArn", cdk.validateString)(properties.destinationArn));
  errors.collect(cdk.propertyValidator("distribution", cdk.validateString)(properties.distribution));
  errors.collect(cdk.propertyValidator("filterName", cdk.validateString)(properties.filterName));
  errors.collect(cdk.propertyValidator("filterPattern", cdk.requiredValidator)(properties.filterPattern));
  errors.collect(cdk.propertyValidator("filterPattern", cdk.validateString)(properties.filterPattern));
  errors.collect(cdk.propertyValidator("logGroupName", cdk.requiredValidator)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CfnSubscriptionFilterProps\"");
}

// @ts-ignore TS6133
function convertCfnSubscriptionFilterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSubscriptionFilterPropsValidator(properties).assertSuccess();
  return {
    "DestinationArn": cdk.stringToCloudFormation(properties.destinationArn),
    "Distribution": cdk.stringToCloudFormation(properties.distribution),
    "FilterName": cdk.stringToCloudFormation(properties.filterName),
    "FilterPattern": cdk.stringToCloudFormation(properties.filterPattern),
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnSubscriptionFilterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSubscriptionFilterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSubscriptionFilterProps>();
  ret.addPropertyResult("destinationArn", "DestinationArn", (properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined));
  ret.addPropertyResult("distribution", "Distribution", (properties.Distribution != null ? cfn_parse.FromCloudFormation.getString(properties.Distribution) : undefined));
  ret.addPropertyResult("filterName", "FilterName", (properties.FilterName != null ? cfn_parse.FromCloudFormation.getString(properties.FilterName) : undefined));
  ret.addPropertyResult("filterPattern", "FilterPattern", (properties.FilterPattern != null ? cfn_parse.FromCloudFormation.getString(properties.FilterPattern) : undefined));
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This structure contains information about one *delivery* in your account.
 *
 * A delivery is a connection between a logical *delivery source* and a logical *delivery destination* .
 *
 * For more information, see [CreateDelivery](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_CreateDelivery.html) .
 *
 * You can't update an existing delivery. You can only create and delete deliveries.
 *
 * @cloudformationResource AWS::Logs::Delivery
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-delivery.html
 */
export class CfnDelivery extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Logs::Delivery";

  /**
   * Build a CfnDelivery from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDelivery {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDeliveryPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDelivery(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) that uniquely identifies this delivery.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Displays whether the delivery destination associated with this delivery is CloudWatch Logs, Amazon S3, or Kinesis Data Firehose.
   *
   * @cloudformationAttribute DeliveryDestinationType
   */
  public readonly attrDeliveryDestinationType: string;

  /**
   * The unique ID that identifies this delivery in your account.
   *
   * @cloudformationAttribute DeliveryId
   */
  public readonly attrDeliveryId: string;

  /**
   * The ARN of the delivery destination that is associated with this delivery.
   */
  public deliveryDestinationArn: string;

  /**
   * The name of the delivery source that is associated with this delivery.
   */
  public deliverySourceName: string;

  /**
   * The tags that have been assigned to this delivery.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeliveryProps) {
    super(scope, id, {
      "type": CfnDelivery.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "deliveryDestinationArn", this);
    cdk.requireProperty(props, "deliverySourceName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrDeliveryDestinationType = cdk.Token.asString(this.getAtt("DeliveryDestinationType", cdk.ResolutionTypeHint.STRING));
    this.attrDeliveryId = cdk.Token.asString(this.getAtt("DeliveryId", cdk.ResolutionTypeHint.STRING));
    this.deliveryDestinationArn = props.deliveryDestinationArn;
    this.deliverySourceName = props.deliverySourceName;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deliveryDestinationArn": this.deliveryDestinationArn,
      "deliverySourceName": this.deliverySourceName,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDelivery.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDeliveryPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDelivery`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-delivery.html
 */
export interface CfnDeliveryProps {
  /**
   * The ARN of the delivery destination that is associated with this delivery.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-delivery.html#cfn-logs-delivery-deliverydestinationarn
   */
  readonly deliveryDestinationArn: string;

  /**
   * The name of the delivery source that is associated with this delivery.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-delivery.html#cfn-logs-delivery-deliverysourcename
   */
  readonly deliverySourceName: string;

  /**
   * The tags that have been assigned to this delivery.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-delivery.html#cfn-logs-delivery-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnDeliveryProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeliveryProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deliveryDestinationArn", cdk.requiredValidator)(properties.deliveryDestinationArn));
  errors.collect(cdk.propertyValidator("deliveryDestinationArn", cdk.validateString)(properties.deliveryDestinationArn));
  errors.collect(cdk.propertyValidator("deliverySourceName", cdk.requiredValidator)(properties.deliverySourceName));
  errors.collect(cdk.propertyValidator("deliverySourceName", cdk.validateString)(properties.deliverySourceName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDeliveryProps\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryPropsValidator(properties).assertSuccess();
  return {
    "DeliveryDestinationArn": cdk.stringToCloudFormation(properties.deliveryDestinationArn),
    "DeliverySourceName": cdk.stringToCloudFormation(properties.deliverySourceName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDeliveryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryProps>();
  ret.addPropertyResult("deliveryDestinationArn", "DeliveryDestinationArn", (properties.DeliveryDestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryDestinationArn) : undefined));
  ret.addPropertyResult("deliverySourceName", "DeliverySourceName", (properties.DeliverySourceName != null ? cfn_parse.FromCloudFormation.getString(properties.DeliverySourceName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This structure contains information about one *delivery destination* in your account.
 *
 * A delivery destination is an AWS resource that represents an AWS service that logs can be sent to. CloudWatch Logs, Amazon S3, are supported as Kinesis Data Firehose delivery destinations.
 *
 * To configure logs delivery between a supported AWS service and a destination, you must do the following:
 *
 * - Create a delivery source, which is a logical object that represents the resource that is actually sending the logs. For more information, see [PutDeliverySource](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutDeliverySource.html) .
 * - Create a *delivery destination* , which is a logical object that represents the actual delivery destination.
 * - If you are delivering logs cross-account, you must use [PutDeliveryDestinationPolicy](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutDeliveryDestinationPolicy.html) in the destination account to assign an IAM policy to the destination. This policy allows delivery to that destination.
 * - Create a *delivery* by pairing exactly one delivery source and one delivery destination. For more information, see [CreateDelivery](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_CreateDelivery.html) .
 *
 * You can configure a single delivery source to send logs to multiple destinations by creating multiple deliveries. You can also create multiple deliveries to configure multiple delivery sources to send logs to the same delivery destination.
 *
 * @cloudformationResource AWS::Logs::DeliveryDestination
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-deliverydestination.html
 */
export class CfnDeliveryDestination extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Logs::DeliveryDestination";

  /**
   * Build a CfnDeliveryDestination from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeliveryDestination {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDeliveryDestinationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDeliveryDestination(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) that uniquely identifies this delivery destination.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Displays whether this delivery destination is CloudWatch Logs, Amazon S3, or Kinesis Data Firehose.
   *
   * @cloudformationAttribute DeliveryDestinationType
   */
  public readonly attrDeliveryDestinationType: string;

  /**
   * A structure that contains information about one delivery destination policy.
   */
  public deliveryDestinationPolicy?: any | cdk.IResolvable;

  /**
   * The ARN of the AWS destination that this delivery destination represents.
   */
  public destinationResourceArn?: string;

  /**
   * The name of this delivery destination.
   */
  public name: string;

  /**
   * The tags that have been assigned to this delivery destination.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeliveryDestinationProps) {
    super(scope, id, {
      "type": CfnDeliveryDestination.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrDeliveryDestinationType = cdk.Token.asString(this.getAtt("DeliveryDestinationType", cdk.ResolutionTypeHint.STRING));
    this.deliveryDestinationPolicy = props.deliveryDestinationPolicy;
    this.destinationResourceArn = props.destinationResourceArn;
    this.name = props.name;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deliveryDestinationPolicy": this.deliveryDestinationPolicy,
      "destinationResourceArn": this.destinationResourceArn,
      "name": this.name,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeliveryDestination.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDeliveryDestinationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDeliveryDestination`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-deliverydestination.html
 */
export interface CfnDeliveryDestinationProps {
  /**
   * A structure that contains information about one delivery destination policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-deliverydestination.html#cfn-logs-deliverydestination-deliverydestinationpolicy
   */
  readonly deliveryDestinationPolicy?: any | cdk.IResolvable;

  /**
   * The ARN of the AWS destination that this delivery destination represents.
   *
   * That AWS destination can be a log group in CloudWatch Logs, an Amazon S3 bucket, or a delivery stream in Kinesis Data Firehose.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-deliverydestination.html#cfn-logs-deliverydestination-destinationresourcearn
   */
  readonly destinationResourceArn?: string;

  /**
   * The name of this delivery destination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-deliverydestination.html#cfn-logs-deliverydestination-name
   */
  readonly name: string;

  /**
   * The tags that have been assigned to this delivery destination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-deliverydestination.html#cfn-logs-deliverydestination-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnDeliveryDestinationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeliveryDestinationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryDestinationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deliveryDestinationPolicy", cdk.validateObject)(properties.deliveryDestinationPolicy));
  errors.collect(cdk.propertyValidator("destinationResourceArn", cdk.validateString)(properties.destinationResourceArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDeliveryDestinationProps\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryDestinationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryDestinationPropsValidator(properties).assertSuccess();
  return {
    "DeliveryDestinationPolicy": cdk.objectToCloudFormation(properties.deliveryDestinationPolicy),
    "DestinationResourceArn": cdk.stringToCloudFormation(properties.destinationResourceArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDeliveryDestinationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryDestinationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryDestinationProps>();
  ret.addPropertyResult("deliveryDestinationPolicy", "DeliveryDestinationPolicy", (properties.DeliveryDestinationPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.DeliveryDestinationPolicy) : undefined));
  ret.addPropertyResult("destinationResourceArn", "DestinationResourceArn", (properties.DestinationResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationResourceArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This structure contains information about one *delivery source* in your account.
 *
 * A delivery source is an AWS resource that sends logs to an AWS destination. The destination can be CloudWatch Logs, Amazon S3, or Kinesis Data Firehose.
 *
 * Only some AWS services support being configured as a delivery source. These services are listed as *Supported [V2 Permissions]* in the table at [Enabling logging from AWS services.](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html)
 *
 * To configure logs delivery between a supported AWS service and a destination, you must do the following:
 *
 * - Create a delivery source, which is a logical object that represents the resource that is actually sending the logs. For more information, see [PutDeliverySource](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutDeliverySource.html) .
 * - Create a *delivery destination* , which is a logical object that represents the actual delivery destination. For more information, see [PutDeliveryDestination](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutDeliveryDestination.html) .
 * - If you are delivering logs cross-account, you must use [PutDeliveryDestinationPolicy](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutDeliveryDestinationPolicy.html) in the destination account to assign an IAM policy to the destination. This policy allows delivery to that destination.
 * - Create a *delivery* by pairing exactly one delivery source and one delivery destination. For more information, see [CreateDelivery](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_CreateDelivery.html) .
 *
 * You can configure a single delivery source to send logs to multiple destinations by creating multiple deliveries. You can also create multiple deliveries to configure multiple delivery sources to send logs to the same delivery destination.
 *
 * @cloudformationResource AWS::Logs::DeliverySource
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-deliverysource.html
 */
export class CfnDeliverySource extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Logs::DeliverySource";

  /**
   * Build a CfnDeliverySource from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeliverySource {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDeliverySourcePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDeliverySource(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) that uniquely identifies this delivery source.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * This array contains the ARN of the AWS resource that sends logs and is represented by this delivery source. Currently, only one ARN can be in the array.
   *
   * @cloudformationAttribute ResourceArns
   */
  public readonly attrResourceArns: Array<string>;

  /**
   * The AWS service that is sending logs.
   *
   * @cloudformationAttribute Service
   */
  public readonly attrService: string;

  /**
   * The type of log that the source is sending.
   */
  public logType?: string;

  /**
   * The unique name of the delivery source.
   */
  public name: string;

  /**
   * The Amazon Resource Name (ARN) that uniquely identifies this delivery source.
   */
  public resourceArn?: string;

  /**
   * The tags that have been assigned to this delivery source.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeliverySourceProps) {
    super(scope, id, {
      "type": CfnDeliverySource.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrResourceArns = cdk.Token.asList(this.getAtt("ResourceArns", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrService = cdk.Token.asString(this.getAtt("Service", cdk.ResolutionTypeHint.STRING));
    this.logType = props.logType;
    this.name = props.name;
    this.resourceArn = props.resourceArn;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "logType": this.logType,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeliverySource.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDeliverySourcePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDeliverySource`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-deliverysource.html
 */
export interface CfnDeliverySourceProps {
  /**
   * The type of log that the source is sending.
   *
   * For valid values for this parameter, see the documentation for the source service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-deliverysource.html#cfn-logs-deliverysource-logtype
   */
  readonly logType?: string;

  /**
   * The unique name of the delivery source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-deliverysource.html#cfn-logs-deliverysource-name
   */
  readonly name: string;

  /**
   * The Amazon Resource Name (ARN) that uniquely identifies this delivery source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-deliverysource.html#cfn-logs-deliverysource-resourcearn
   */
  readonly resourceArn?: string;

  /**
   * The tags that have been assigned to this delivery source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-deliverysource.html#cfn-logs-deliverysource-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnDeliverySourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeliverySourceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliverySourcePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logType", cdk.validateString)(properties.logType));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDeliverySourceProps\"");
}

// @ts-ignore TS6133
function convertCfnDeliverySourcePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliverySourcePropsValidator(properties).assertSuccess();
  return {
    "LogType": cdk.stringToCloudFormation(properties.logType),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ResourceArn": cdk.stringToCloudFormation(properties.resourceArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDeliverySourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliverySourceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliverySourceProps>();
  ret.addPropertyResult("logType", "LogType", (properties.LogType != null ? cfn_parse.FromCloudFormation.getString(properties.LogType) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("resourceArn", "ResourceArn", (properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates or updates an *anomaly detector* that regularly scans one or more log groups and look for patterns and anomalies in the logs.
 *
 * An anomaly detector can help surface issues by automatically discovering anomalies in your log event traffic. An anomaly detector uses machine learning algorithms to scan log events and find *patterns* . A pattern is a shared text structure that recurs among your log fields. Patterns provide a useful tool for analyzing large sets of logs because a large number of log events can often be compressed into a few patterns.
 *
 * The anomaly detector uses pattern recognition to find `anomalies` , which are unusual log events. It compares current log events and patterns with trained baselines.
 *
 * Fields within a pattern are called *tokens* . Fields that vary within a pattern, such as a request ID or timestamp, are referred to as *dynamic tokens* and represented by `<*>` .
 *
 * For more information see [Log anomaly detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/LogsAnomalyDetection.html) .
 *
 * @cloudformationResource AWS::Logs::LogAnomalyDetector
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loganomalydetector.html
 */
export class CfnLogAnomalyDetector extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Logs::LogAnomalyDetector";

  /**
   * Build a CfnLogAnomalyDetector from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLogAnomalyDetector {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLogAnomalyDetectorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLogAnomalyDetector(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the anomaly detector.
   *
   * @cloudformationAttribute AnomalyDetectorArn
   */
  public readonly attrAnomalyDetectorArn: string;

  /**
   * Specifies whether the anomaly detector is currently active.
   *
   * @cloudformationAttribute AnomalyDetectorStatus
   */
  public readonly attrAnomalyDetectorStatus: string;

  /**
   * The time that the anomaly detector was created.
   *
   * @cloudformationAttribute CreationTimeStamp
   */
  public readonly attrCreationTimeStamp: cdk.IResolvable;

  /**
   * The time that the anomaly detector was most recently modified.
   *
   * @cloudformationAttribute LastModifiedTimeStamp
   */
  public readonly attrLastModifiedTimeStamp: cdk.IResolvable;

  /**
   * The ID of the account to create the anomaly detector in.
   */
  public accountId?: string;

  /**
   * The number of days to have visibility on an anomaly.
   */
  public anomalyVisibilityTime?: number;

  /**
   * A name for this anomaly detector.
   */
  public detectorName?: string;

  /**
   * Specifies how often the anomaly detector is to run and look for anomalies.
   */
  public evaluationFrequency?: string;

  /**
   * You can use this parameter to limit the anomaly detection model to examine only log events that match the pattern you specify here.
   */
  public filterPattern?: string;

  /**
   * Optionally assigns a AWS KMS key to secure this anomaly detector and its findings.
   */
  public kmsKeyId?: string;

  /**
   * The ARN of the log group that is associated with this anomaly detector.
   */
  public logGroupArnList?: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLogAnomalyDetectorProps = {}) {
    super(scope, id, {
      "type": CfnLogAnomalyDetector.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrAnomalyDetectorArn = cdk.Token.asString(this.getAtt("AnomalyDetectorArn", cdk.ResolutionTypeHint.STRING));
    this.attrAnomalyDetectorStatus = cdk.Token.asString(this.getAtt("AnomalyDetectorStatus", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTimeStamp = this.getAtt("CreationTimeStamp", cdk.ResolutionTypeHint.NUMBER);
    this.attrLastModifiedTimeStamp = this.getAtt("LastModifiedTimeStamp", cdk.ResolutionTypeHint.NUMBER);
    this.accountId = props.accountId;
    this.anomalyVisibilityTime = props.anomalyVisibilityTime;
    this.detectorName = props.detectorName;
    this.evaluationFrequency = props.evaluationFrequency;
    this.filterPattern = props.filterPattern;
    this.kmsKeyId = props.kmsKeyId;
    this.logGroupArnList = props.logGroupArnList;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accountId": this.accountId,
      "anomalyVisibilityTime": this.anomalyVisibilityTime,
      "detectorName": this.detectorName,
      "evaluationFrequency": this.evaluationFrequency,
      "filterPattern": this.filterPattern,
      "kmsKeyId": this.kmsKeyId,
      "logGroupArnList": this.logGroupArnList
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLogAnomalyDetector.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLogAnomalyDetectorPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLogAnomalyDetector`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loganomalydetector.html
 */
export interface CfnLogAnomalyDetectorProps {
  /**
   * The ID of the account to create the anomaly detector in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loganomalydetector.html#cfn-logs-loganomalydetector-accountid
   */
  readonly accountId?: string;

  /**
   * The number of days to have visibility on an anomaly.
   *
   * After this time period has elapsed for an anomaly, it will be automatically baselined and the anomaly detector will treat new occurrences of a similar anomaly as normal. Therefore, if you do not correct the cause of an anomaly during the time period specified in `AnomalyVisibilityTime` , it will be considered normal going forward and will not be detected as an anomaly.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loganomalydetector.html#cfn-logs-loganomalydetector-anomalyvisibilitytime
   */
  readonly anomalyVisibilityTime?: number;

  /**
   * A name for this anomaly detector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loganomalydetector.html#cfn-logs-loganomalydetector-detectorname
   */
  readonly detectorName?: string;

  /**
   * Specifies how often the anomaly detector is to run and look for anomalies.
   *
   * Set this value according to the frequency that the log group receives new logs. For example, if the log group receives new log events every 10 minutes, then 15 minutes might be a good setting for `EvaluationFrequency` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loganomalydetector.html#cfn-logs-loganomalydetector-evaluationfrequency
   */
  readonly evaluationFrequency?: string;

  /**
   * You can use this parameter to limit the anomaly detection model to examine only log events that match the pattern you specify here.
   *
   * For more information, see [Filter and Pattern Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loganomalydetector.html#cfn-logs-loganomalydetector-filterpattern
   */
  readonly filterPattern?: string;

  /**
   * Optionally assigns a AWS KMS key to secure this anomaly detector and its findings.
   *
   * If a key is assigned, the anomalies found and the model used by this detector are encrypted at rest with the key. If a key is assigned to an anomaly detector, a user must have permissions for both this key and for the anomaly detector to retrieve information about the anomalies that it finds.
   *
   * For more information about using a AWS KMS key and to see the required IAM policy, see [Use a AWS KMS key with an anomaly detector](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/LogsAnomalyDetection-KMS.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loganomalydetector.html#cfn-logs-loganomalydetector-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * The ARN of the log group that is associated with this anomaly detector.
   *
   * You can specify only one log group ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loganomalydetector.html#cfn-logs-loganomalydetector-loggrouparnlist
   */
  readonly logGroupArnList?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `CfnLogAnomalyDetectorProps`
 *
 * @param properties - the TypeScript properties of a `CfnLogAnomalyDetectorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLogAnomalyDetectorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountId", cdk.validateString)(properties.accountId));
  errors.collect(cdk.propertyValidator("anomalyVisibilityTime", cdk.validateNumber)(properties.anomalyVisibilityTime));
  errors.collect(cdk.propertyValidator("detectorName", cdk.validateString)(properties.detectorName));
  errors.collect(cdk.propertyValidator("evaluationFrequency", cdk.validateString)(properties.evaluationFrequency));
  errors.collect(cdk.propertyValidator("filterPattern", cdk.validateString)(properties.filterPattern));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("logGroupArnList", cdk.listValidator(cdk.validateString))(properties.logGroupArnList));
  return errors.wrap("supplied properties not correct for \"CfnLogAnomalyDetectorProps\"");
}

// @ts-ignore TS6133
function convertCfnLogAnomalyDetectorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLogAnomalyDetectorPropsValidator(properties).assertSuccess();
  return {
    "AccountId": cdk.stringToCloudFormation(properties.accountId),
    "AnomalyVisibilityTime": cdk.numberToCloudFormation(properties.anomalyVisibilityTime),
    "DetectorName": cdk.stringToCloudFormation(properties.detectorName),
    "EvaluationFrequency": cdk.stringToCloudFormation(properties.evaluationFrequency),
    "FilterPattern": cdk.stringToCloudFormation(properties.filterPattern),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "LogGroupArnList": cdk.listMapper(cdk.stringToCloudFormation)(properties.logGroupArnList)
  };
}

// @ts-ignore TS6133
function CfnLogAnomalyDetectorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLogAnomalyDetectorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLogAnomalyDetectorProps>();
  ret.addPropertyResult("accountId", "AccountId", (properties.AccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AccountId) : undefined));
  ret.addPropertyResult("anomalyVisibilityTime", "AnomalyVisibilityTime", (properties.AnomalyVisibilityTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.AnomalyVisibilityTime) : undefined));
  ret.addPropertyResult("detectorName", "DetectorName", (properties.DetectorName != null ? cfn_parse.FromCloudFormation.getString(properties.DetectorName) : undefined));
  ret.addPropertyResult("evaluationFrequency", "EvaluationFrequency", (properties.EvaluationFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.EvaluationFrequency) : undefined));
  ret.addPropertyResult("filterPattern", "FilterPattern", (properties.FilterPattern != null ? cfn_parse.FromCloudFormation.getString(properties.FilterPattern) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("logGroupArnList", "LogGroupArnList", (properties.LogGroupArnList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LogGroupArnList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}