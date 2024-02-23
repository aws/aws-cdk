/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * > This is the latest version of *AWS WAF* , named AWS WAF V2, released in November, 2019.
 *
 * For information, including how to migrate your AWS WAF resources from the prior release, see the [AWS WAF developer guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
 *
 * Use an `IPSet` to identify web requests that originate from specific IP addresses or ranges of IP addresses. For example, if you're receiving a lot of requests from a ranges of IP addresses, you can configure AWS WAF to block them using an IP set that lists those IP addresses.
 *
 * You use an IP set by providing its Amazon Resource Name (ARN) to the rule statement `IPSetReferenceStatement` , when you add a rule to a rule group or web ACL.
 *
 * @cloudformationResource AWS::WAFv2::IPSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html
 */
export class CfnIPSet extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFv2::IPSet";

  /**
   * Build a CfnIPSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIPSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIPSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIPSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the IP set.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the IP set.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Contains an array of strings that specifies zero or more IP addresses or blocks of IP addresses that you want AWS WAF to inspect for in incoming requests.
   */
  public addresses: Array<string>;

  /**
   * A description of the IP set that helps with identification.
   */
  public description?: string;

  /**
   * The version of the IP addresses, either `IPV4` or `IPV6` .
   */
  public ipAddressVersion: string;

  /**
   * The name of the IP set.
   */
  public name?: string;

  /**
   * Specifies whether this is for an Amazon CloudFront distribution or for a regional application.
   */
  public scope: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Key:value pairs associated with an AWS resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIPSetProps) {
    super(scope, id, {
      "type": CfnIPSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "addresses", this);
    cdk.requireProperty(props, "ipAddressVersion", this);
    cdk.requireProperty(props, "scope", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.addresses = props.addresses;
    this.description = props.description;
    this.ipAddressVersion = props.ipAddressVersion;
    this.name = props.name;
    this.scope = props.scope;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::WAFv2::IPSet", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "addresses": this.addresses,
      "description": this.description,
      "ipAddressVersion": this.ipAddressVersion,
      "name": this.name,
      "scope": this.scope,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIPSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIPSetPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnIPSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html
 */
export interface CfnIPSetProps {
  /**
   * Contains an array of strings that specifies zero or more IP addresses or blocks of IP addresses that you want AWS WAF to inspect for in incoming requests.
   *
   * All addresses must be specified using Classless Inter-Domain Routing (CIDR) notation. AWS WAF supports all IPv4 and IPv6 CIDR ranges except for `/0` .
   *
   * Example address strings:
   *
   * - For requests that originated from the IP address 192.0.2.44, specify `192.0.2.44/32` .
   * - For requests that originated from IP addresses from 192.0.2.0 to 192.0.2.255, specify `192.0.2.0/24` .
   * - For requests that originated from the IP address 1111:0000:0000:0000:0000:0000:0000:0111, specify `1111:0000:0000:0000:0000:0000:0000:0111/128` .
   * - For requests that originated from IP addresses 1111:0000:0000:0000:0000:0000:0000:0000 to 1111:0000:0000:0000:ffff:ffff:ffff:ffff, specify `1111:0000:0000:0000:0000:0000:0000:0000/64` .
   *
   * For more information about CIDR notation, see the Wikipedia entry [Classless Inter-Domain Routing](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) .
   *
   * Example JSON `Addresses` specifications:
   *
   * - Empty array: `"Addresses": []`
   * - Array with one address: `"Addresses": ["192.0.2.44/32"]`
   * - Array with three addresses: `"Addresses": ["192.0.2.44/32", "192.0.2.0/24", "192.0.0.0/16"]`
   * - INVALID specification: `"Addresses": [""]` INVALID
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-addresses
   */
  readonly addresses: Array<string>;

  /**
   * A description of the IP set that helps with identification.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-description
   */
  readonly description?: string;

  /**
   * The version of the IP addresses, either `IPV4` or `IPV6` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-ipaddressversion
   */
  readonly ipAddressVersion: string;

  /**
   * The name of the IP set.
   *
   * You cannot change the name of an `IPSet` after you create it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-name
   */
  readonly name?: string;

  /**
   * Specifies whether this is for an Amazon CloudFront distribution or for a regional application.
   *
   * A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AWS AppSync GraphQL API, an Amazon Cognito user pool, an AWS App Runner service, or an AWS Verified Access instance. Valid Values are `CLOUDFRONT` and `REGIONAL` .
   *
   * > For `CLOUDFRONT` , you must create your WAFv2 resources in the US East (N. Virginia) Region, `us-east-1` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-scope
   */
  readonly scope: string;

  /**
   * Key:value pairs associated with an AWS resource.
   *
   * The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
   *
   * > To modify tags on existing resources, use the AWS WAF APIs or command line interface. With AWS CloudFormation , you can only add tags to AWS WAF resources during resource creation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnIPSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnIPSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIPSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addresses", cdk.requiredValidator)(properties.addresses));
  errors.collect(cdk.propertyValidator("addresses", cdk.listValidator(cdk.validateString))(properties.addresses));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("ipAddressVersion", cdk.requiredValidator)(properties.ipAddressVersion));
  errors.collect(cdk.propertyValidator("ipAddressVersion", cdk.validateString)(properties.ipAddressVersion));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("scope", cdk.requiredValidator)(properties.scope));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnIPSetProps\"");
}

// @ts-ignore TS6133
function convertCfnIPSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIPSetPropsValidator(properties).assertSuccess();
  return {
    "Addresses": cdk.listMapper(cdk.stringToCloudFormation)(properties.addresses),
    "Description": cdk.stringToCloudFormation(properties.description),
    "IPAddressVersion": cdk.stringToCloudFormation(properties.ipAddressVersion),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Scope": cdk.stringToCloudFormation(properties.scope),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnIPSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIPSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIPSetProps>();
  ret.addPropertyResult("addresses", "Addresses", (properties.Addresses != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Addresses) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("ipAddressVersion", "IPAddressVersion", (properties.IPAddressVersion != null ? cfn_parse.FromCloudFormation.getString(properties.IPAddressVersion) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Defines an association between logging destinations and a web ACL resource, for logging from AWS WAF .
 *
 * As part of the association, you can specify parts of the standard logging fields to keep out of the logs and you can specify filters so that you log only a subset of the logging records.
 *
 * > You can define one logging destination per web ACL.
 *
 * You can access information about the traffic that AWS WAF inspects using the following steps:
 *
 * - Create your logging destination. You can use an Amazon CloudWatch Logs log group, an Amazon Simple Storage Service (Amazon S3) bucket, or an Amazon Kinesis Data Firehose.
 *
 * The name that you give the destination must start with `aws-waf-logs-` . Depending on the type of destination, you might need to configure additional settings or permissions.
 *
 * For configuration requirements and pricing information for each destination type, see [Logging web ACL traffic](https://docs.aws.amazon.com/waf/latest/developerguide/logging.html) in the *AWS WAF Developer Guide* .
 * - Associate your logging destination to your web ACL using a `PutLoggingConfiguration` request.
 *
 * When you successfully enable logging using a `PutLoggingConfiguration` request, AWS WAF creates an additional role or policy that is required to write logs to the logging destination. For an Amazon CloudWatch Logs log group, AWS WAF creates a resource policy on the log group. For an Amazon S3 bucket, AWS WAF creates a bucket policy. For an Amazon Kinesis Data Firehose, AWS WAF creates a service-linked role.
 *
 * For additional information about web ACL logging, see [Logging web ACL traffic information](https://docs.aws.amazon.com/waf/latest/developerguide/logging.html) in the *AWS WAF Developer Guide* .
 *
 * @cloudformationResource AWS::WAFv2::LoggingConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html
 */
export class CfnLoggingConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFv2::LoggingConfiguration";

  /**
   * Build a CfnLoggingConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLoggingConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLoggingConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLoggingConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Indicates whether the logging configuration was created by AWS Firewall Manager , as part of an AWS WAF policy configuration. If true, only Firewall Manager can modify or delete the configuration.
   *
   * @cloudformationAttribute ManagedByFirewallManager
   */
  public readonly attrManagedByFirewallManager: cdk.IResolvable;

  /**
   * The logging destination configuration that you want to associate with the web ACL.
   */
  public logDestinationConfigs: Array<string>;

  /**
   * Filtering that specifies which web requests are kept in the logs and which are dropped.
   */
  public loggingFilter?: any | cdk.IResolvable;

  /**
   * The parts of the request that you want to keep out of the logs.
   */
  public redactedFields?: Array<CfnLoggingConfiguration.FieldToMatchProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the web ACL that you want to associate with `LogDestinationConfigs` .
   */
  public resourceArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLoggingConfigurationProps) {
    super(scope, id, {
      "type": CfnLoggingConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "logDestinationConfigs", this);
    cdk.requireProperty(props, "resourceArn", this);

    this.attrManagedByFirewallManager = this.getAtt("ManagedByFirewallManager");
    this.logDestinationConfigs = props.logDestinationConfigs;
    this.loggingFilter = props.loggingFilter;
    this.redactedFields = props.redactedFields;
    this.resourceArn = props.resourceArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "logDestinationConfigs": this.logDestinationConfigs,
      "loggingFilter": this.loggingFilter,
      "redactedFields": this.redactedFields,
      "resourceArn": this.resourceArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLoggingConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLoggingConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnLoggingConfiguration {
  /**
   * The parts of the request that you want to keep out of the logs.
   *
   * This is used in the logging configuration `RedactedFields` specification.
   *
   * Example JSON for a `QueryString` field to match:
   *
   * `"FieldToMatch": { "QueryString": {} }`
   *
   * Example JSON for a `Method` field to match specification:
   *
   * `"FieldToMatch": { "Method": { "Name": "DELETE" } }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-fieldtomatch.html
   */
  export interface FieldToMatchProperty {
    /**
     * Redact the request body JSON.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-fieldtomatch.html#cfn-wafv2-loggingconfiguration-fieldtomatch-jsonbody
     */
    readonly jsonBody?: any | cdk.IResolvable;

    /**
     * Redact the indicated HTTP method.
     *
     * The method indicates the type of operation that the request is asking the origin to perform.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-fieldtomatch.html#cfn-wafv2-loggingconfiguration-fieldtomatch-method
     */
    readonly method?: any | cdk.IResolvable;

    /**
     * Redact the query string.
     *
     * This is the part of a URL that appears after a `?` character, if any.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-fieldtomatch.html#cfn-wafv2-loggingconfiguration-fieldtomatch-querystring
     */
    readonly queryString?: any | cdk.IResolvable;

    /**
     * Redact a single header.
     *
     * Provide the name of the header to inspect, for example, `User-Agent` or `Referer` . This setting isn't case sensitive.
     *
     * Example JSON: `"SingleHeader": { "Name": "haystack" }`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-fieldtomatch.html#cfn-wafv2-loggingconfiguration-fieldtomatch-singleheader
     */
    readonly singleHeader?: any | cdk.IResolvable;

    /**
     * Redact the request URI path.
     *
     * This is the part of the web request that identifies a resource, for example, `/images/daily-ad.jpg` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-fieldtomatch.html#cfn-wafv2-loggingconfiguration-fieldtomatch-uripath
     */
    readonly uriPath?: any | cdk.IResolvable;
  }

  /**
   * Filtering that specifies which web requests are kept in the logs and which are dropped, defined for a web ACL's `LoggingConfiguration` .
   *
   * You can filter on the rule action and on the web request labels that were applied by matching rules during web ACL evaluation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-loggingfilter.html
   */
  export interface LoggingFilterProperty {
    /**
     * Default handling for logs that don't match any of the specified filtering conditions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-loggingfilter.html#cfn-wafv2-loggingconfiguration-loggingfilter-defaultbehavior
     */
    readonly defaultBehavior: string;

    /**
     * The filters that you want to apply to the logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-loggingfilter.html#cfn-wafv2-loggingconfiguration-loggingfilter-filters
     */
    readonly filters: Array<CfnLoggingConfiguration.FilterProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * A single logging filter, used in `LoggingFilter` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-filter.html
   */
  export interface FilterProperty {
    /**
     * How to handle logs that satisfy the filter's conditions and requirement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-filter.html#cfn-wafv2-loggingconfiguration-filter-behavior
     */
    readonly behavior: string;

    /**
     * Match conditions for the filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-filter.html#cfn-wafv2-loggingconfiguration-filter-conditions
     */
    readonly conditions: Array<CfnLoggingConfiguration.ConditionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Logic to apply to the filtering conditions.
     *
     * You can specify that, in order to satisfy the filter, a log must match all conditions or must match at least one condition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-filter.html#cfn-wafv2-loggingconfiguration-filter-requirement
     */
    readonly requirement: string;
  }

  /**
   * A single match condition for a log filter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-condition.html
   */
  export interface ConditionProperty {
    /**
     * A single action condition.
     *
     * This is the action setting that a log record must contain in order to meet the condition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-condition.html#cfn-wafv2-loggingconfiguration-condition-actioncondition
     */
    readonly actionCondition?: CfnLoggingConfiguration.ActionConditionProperty | cdk.IResolvable;

    /**
     * A single label name condition.
     *
     * This is the fully qualified label name that a log record must contain in order to meet the condition. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-condition.html#cfn-wafv2-loggingconfiguration-condition-labelnamecondition
     */
    readonly labelNameCondition?: cdk.IResolvable | CfnLoggingConfiguration.LabelNameConditionProperty;
  }

  /**
   * A single label name condition for a condition in a logging filter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-labelnamecondition.html
   */
  export interface LabelNameConditionProperty {
    /**
     * The label name that a log record must contain in order to meet the condition.
     *
     * This must be a fully qualified label name. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-labelnamecondition.html#cfn-wafv2-loggingconfiguration-labelnamecondition-labelname
     */
    readonly labelName: string;
  }

  /**
   * A single action condition for a condition in a logging filter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-actioncondition.html
   */
  export interface ActionConditionProperty {
    /**
     * The action setting that a log record must contain in order to meet the condition.
     *
     * This is the action that AWS WAF applied to the web request.
     *
     * For rule groups, this is either the configured rule action setting, or if you've applied a rule action override to the rule, it's the override action. The value `EXCLUDED_AS_COUNT` matches on excluded rules and also on rules that have a rule action override of Count.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-actioncondition.html#cfn-wafv2-loggingconfiguration-actioncondition-action
     */
    readonly action: string;
  }

  /**
   * Inspect the body of the web request as JSON. The body immediately follows the request headers.
   *
   * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
   *
   * Use the specifications in this object to indicate which parts of the JSON body to inspect using the rule's inspection criteria. AWS WAF inspects only the parts of the JSON that result from the matches that you indicate.
   *
   * Example JSON: `"JsonBody": { "MatchPattern": { "All": {} }, "MatchScope": "ALL" }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-jsonbody.html
   */
  export interface JsonBodyProperty {
    /**
     * What AWS WAF should do if it fails to completely parse the JSON body. The options are the following:.
     *
     * - `EVALUATE_AS_STRING` - Inspect the body as plain text. AWS WAF applies the text transformations and inspection criteria that you defined for the JSON inspection to the body text string.
     * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
     * - `NO_MATCH` - Treat the web request as not matching the rule statement.
     *
     * If you don't provide this setting, AWS WAF parses and evaluates the content only up to the first parsing failure that it encounters.
     *
     * AWS WAF does its best to parse the entire JSON body, but might be forced to stop for reasons such as invalid characters, duplicate keys, truncation, and any content whose root node isn't an object or an array.
     *
     * AWS WAF parses the JSON in the following examples as two valid key, value pairs:
     *
     * - Missing comma: `{"key1":"value1""key2":"value2"}`
     * - Missing colon: `{"key1":"value1","key2""value2"}`
     * - Extra colons: `{"key1"::"value1","key2""value2"}`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-jsonbody.html#cfn-wafv2-loggingconfiguration-jsonbody-invalidfallbackbehavior
     */
    readonly invalidFallbackBehavior?: string;

    /**
     * The patterns to look for in the JSON body.
     *
     * AWS WAF inspects the results of these pattern matches against the rule inspection criteria.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-jsonbody.html#cfn-wafv2-loggingconfiguration-jsonbody-matchpattern
     */
    readonly matchPattern: cdk.IResolvable | CfnLoggingConfiguration.MatchPatternProperty;

    /**
     * The parts of the JSON to match against using the `MatchPattern` .
     *
     * If you specify `ALL` , AWS WAF matches against keys and values.
     *
     * `All` does not require a match to be found in the keys and a match to be found in the values. It requires a match to be found in the keys or the values or both. To require a match in the keys and in the values, use a logical `AND` statement to combine two match rules, one that inspects the keys and another that inspects the values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-jsonbody.html#cfn-wafv2-loggingconfiguration-jsonbody-matchscope
     */
    readonly matchScope: string;
  }

  /**
   * The patterns to look for in the JSON body.
   *
   * AWS WAF inspects the results of these pattern matches against the rule inspection criteria.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-matchpattern.html
   */
  export interface MatchPatternProperty {
    /**
     * Match all of the elements.
     *
     * You must specify either this setting or the `IncludedPaths` setting, but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-matchpattern.html#cfn-wafv2-loggingconfiguration-matchpattern-all
     */
    readonly all?: any | cdk.IResolvable;

    /**
     * Match only the specified include paths.
     *
     * Provide the include paths using JSON Pointer syntax. For example, `"IncludedPaths": ["/dogs/0/name", "/dogs/1/name"]` . For information about this syntax, see the Internet Engineering Task Force (IETF) documentation [JavaScript Object Notation (JSON) Pointer](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6901) .
     *
     * You must specify either this setting or the `All` setting, but not both.
     *
     * > Don't use this option to include all paths. Instead, use the `All` setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-matchpattern.html#cfn-wafv2-loggingconfiguration-matchpattern-includedpaths
     */
    readonly includedPaths?: Array<string>;
  }

  /**
   * Inspect one of the headers in the web request, identified by name, for example, `User-Agent` or `Referer` .
   *
   * The name isn't case sensitive.
   *
   * You can filter and inspect all headers with the `FieldToMatch` setting `Headers` .
   *
   * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
   *
   * Example JSON: `"SingleHeader": { "Name": "haystack" }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-singleheader.html
   */
  export interface SingleHeaderProperty {
    /**
     * The name of the query header to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-singleheader.html#cfn-wafv2-loggingconfiguration-singleheader-name
     */
    readonly name: string;
  }
}

/**
 * Properties for defining a `CfnLoggingConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html
 */
export interface CfnLoggingConfigurationProps {
  /**
   * The logging destination configuration that you want to associate with the web ACL.
   *
   * > You can associate one logging destination to a web ACL.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html#cfn-wafv2-loggingconfiguration-logdestinationconfigs
   */
  readonly logDestinationConfigs: Array<string>;

  /**
   * Filtering that specifies which web requests are kept in the logs and which are dropped.
   *
   * You can filter on the rule action and on the web request labels that were applied by matching rules during web ACL evaluation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html#cfn-wafv2-loggingconfiguration-loggingfilter
   */
  readonly loggingFilter?: any | cdk.IResolvable;

  /**
   * The parts of the request that you want to keep out of the logs.
   *
   * For example, if you redact the `SingleHeader` field, the `HEADER` field in the logs will be `REDACTED` for all rules that use the `SingleHeader` `FieldToMatch` setting.
   *
   * Redaction applies only to the component that's specified in the rule's `FieldToMatch` setting, so the `SingleHeader` redaction doesn't apply to rules that use the `Headers` `FieldToMatch` .
   *
   * > You can specify only the following fields for redaction: `UriPath` , `QueryString` , `SingleHeader` , and `Method` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html#cfn-wafv2-loggingconfiguration-redactedfields
   */
  readonly redactedFields?: Array<CfnLoggingConfiguration.FieldToMatchProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the web ACL that you want to associate with `LogDestinationConfigs` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html#cfn-wafv2-loggingconfiguration-resourcearn
   */
  readonly resourceArn: string;
}

/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationFieldToMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("jsonBody", cdk.validateObject)(properties.jsonBody));
  errors.collect(cdk.propertyValidator("method", cdk.validateObject)(properties.method));
  errors.collect(cdk.propertyValidator("queryString", cdk.validateObject)(properties.queryString));
  errors.collect(cdk.propertyValidator("singleHeader", cdk.validateObject)(properties.singleHeader));
  errors.collect(cdk.propertyValidator("uriPath", cdk.validateObject)(properties.uriPath));
  return errors.wrap("supplied properties not correct for \"FieldToMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationFieldToMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationFieldToMatchPropertyValidator(properties).assertSuccess();
  return {
    "JsonBody": cdk.objectToCloudFormation(properties.jsonBody),
    "Method": cdk.objectToCloudFormation(properties.method),
    "QueryString": cdk.objectToCloudFormation(properties.queryString),
    "SingleHeader": cdk.objectToCloudFormation(properties.singleHeader),
    "UriPath": cdk.objectToCloudFormation(properties.uriPath)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationFieldToMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.FieldToMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.FieldToMatchProperty>();
  ret.addPropertyResult("jsonBody", "JsonBody", (properties.JsonBody != null ? cfn_parse.FromCloudFormation.getAny(properties.JsonBody) : undefined));
  ret.addPropertyResult("method", "Method", (properties.Method != null ? cfn_parse.FromCloudFormation.getAny(properties.Method) : undefined));
  ret.addPropertyResult("queryString", "QueryString", (properties.QueryString != null ? cfn_parse.FromCloudFormation.getAny(properties.QueryString) : undefined));
  ret.addPropertyResult("singleHeader", "SingleHeader", (properties.SingleHeader != null ? cfn_parse.FromCloudFormation.getAny(properties.SingleHeader) : undefined));
  ret.addPropertyResult("uriPath", "UriPath", (properties.UriPath != null ? cfn_parse.FromCloudFormation.getAny(properties.UriPath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LabelNameConditionProperty`
 *
 * @param properties - the TypeScript properties of a `LabelNameConditionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationLabelNameConditionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("labelName", cdk.requiredValidator)(properties.labelName));
  errors.collect(cdk.propertyValidator("labelName", cdk.validateString)(properties.labelName));
  return errors.wrap("supplied properties not correct for \"LabelNameConditionProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationLabelNameConditionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationLabelNameConditionPropertyValidator(properties).assertSuccess();
  return {
    "LabelName": cdk.stringToCloudFormation(properties.labelName)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationLabelNameConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoggingConfiguration.LabelNameConditionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.LabelNameConditionProperty>();
  ret.addPropertyResult("labelName", "LabelName", (properties.LabelName != null ? cfn_parse.FromCloudFormation.getString(properties.LabelName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionConditionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionConditionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationActionConditionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  return errors.wrap("supplied properties not correct for \"ActionConditionProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationActionConditionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationActionConditionPropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationActionConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.ActionConditionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.ActionConditionProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConditionProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationConditionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actionCondition", CfnLoggingConfigurationActionConditionPropertyValidator)(properties.actionCondition));
  errors.collect(cdk.propertyValidator("labelNameCondition", CfnLoggingConfigurationLabelNameConditionPropertyValidator)(properties.labelNameCondition));
  return errors.wrap("supplied properties not correct for \"ConditionProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationConditionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationConditionPropertyValidator(properties).assertSuccess();
  return {
    "ActionCondition": convertCfnLoggingConfigurationActionConditionPropertyToCloudFormation(properties.actionCondition),
    "LabelNameCondition": convertCfnLoggingConfigurationLabelNameConditionPropertyToCloudFormation(properties.labelNameCondition)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.ConditionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.ConditionProperty>();
  ret.addPropertyResult("actionCondition", "ActionCondition", (properties.ActionCondition != null ? CfnLoggingConfigurationActionConditionPropertyFromCloudFormation(properties.ActionCondition) : undefined));
  ret.addPropertyResult("labelNameCondition", "LabelNameCondition", (properties.LabelNameCondition != null ? CfnLoggingConfigurationLabelNameConditionPropertyFromCloudFormation(properties.LabelNameCondition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("behavior", cdk.requiredValidator)(properties.behavior));
  errors.collect(cdk.propertyValidator("behavior", cdk.validateString)(properties.behavior));
  errors.collect(cdk.propertyValidator("conditions", cdk.requiredValidator)(properties.conditions));
  errors.collect(cdk.propertyValidator("conditions", cdk.listValidator(CfnLoggingConfigurationConditionPropertyValidator))(properties.conditions));
  errors.collect(cdk.propertyValidator("requirement", cdk.requiredValidator)(properties.requirement));
  errors.collect(cdk.propertyValidator("requirement", cdk.validateString)(properties.requirement));
  return errors.wrap("supplied properties not correct for \"FilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationFilterPropertyValidator(properties).assertSuccess();
  return {
    "Behavior": cdk.stringToCloudFormation(properties.behavior),
    "Conditions": cdk.listMapper(convertCfnLoggingConfigurationConditionPropertyToCloudFormation)(properties.conditions),
    "Requirement": cdk.stringToCloudFormation(properties.requirement)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.FilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.FilterProperty>();
  ret.addPropertyResult("behavior", "Behavior", (properties.Behavior != null ? cfn_parse.FromCloudFormation.getString(properties.Behavior) : undefined));
  ret.addPropertyResult("conditions", "Conditions", (properties.Conditions != null ? cfn_parse.FromCloudFormation.getArray(CfnLoggingConfigurationConditionPropertyFromCloudFormation)(properties.Conditions) : undefined));
  ret.addPropertyResult("requirement", "Requirement", (properties.Requirement != null ? cfn_parse.FromCloudFormation.getString(properties.Requirement) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoggingFilterProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationLoggingFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultBehavior", cdk.requiredValidator)(properties.defaultBehavior));
  errors.collect(cdk.propertyValidator("defaultBehavior", cdk.validateString)(properties.defaultBehavior));
  errors.collect(cdk.propertyValidator("filters", cdk.requiredValidator)(properties.filters));
  errors.collect(cdk.propertyValidator("filters", cdk.listValidator(CfnLoggingConfigurationFilterPropertyValidator))(properties.filters));
  return errors.wrap("supplied properties not correct for \"LoggingFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationLoggingFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationLoggingFilterPropertyValidator(properties).assertSuccess();
  return {
    "DefaultBehavior": cdk.stringToCloudFormation(properties.defaultBehavior),
    "Filters": cdk.listMapper(convertCfnLoggingConfigurationFilterPropertyToCloudFormation)(properties.filters)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationLoggingFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoggingConfiguration.LoggingFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.LoggingFilterProperty>();
  ret.addPropertyResult("defaultBehavior", "DefaultBehavior", (properties.DefaultBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultBehavior) : undefined));
  ret.addPropertyResult("filters", "Filters", (properties.Filters != null ? cfn_parse.FromCloudFormation.getArray(CfnLoggingConfigurationFilterPropertyFromCloudFormation)(properties.Filters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLoggingConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnLoggingConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logDestinationConfigs", cdk.requiredValidator)(properties.logDestinationConfigs));
  errors.collect(cdk.propertyValidator("logDestinationConfigs", cdk.listValidator(cdk.validateString))(properties.logDestinationConfigs));
  errors.collect(cdk.propertyValidator("loggingFilter", cdk.validateObject)(properties.loggingFilter));
  errors.collect(cdk.propertyValidator("redactedFields", cdk.listValidator(CfnLoggingConfigurationFieldToMatchPropertyValidator))(properties.redactedFields));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  return errors.wrap("supplied properties not correct for \"CfnLoggingConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationPropsValidator(properties).assertSuccess();
  return {
    "LogDestinationConfigs": cdk.listMapper(cdk.stringToCloudFormation)(properties.logDestinationConfigs),
    "LoggingFilter": cdk.objectToCloudFormation(properties.loggingFilter),
    "RedactedFields": cdk.listMapper(convertCfnLoggingConfigurationFieldToMatchPropertyToCloudFormation)(properties.redactedFields),
    "ResourceArn": cdk.stringToCloudFormation(properties.resourceArn)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfigurationProps>();
  ret.addPropertyResult("logDestinationConfigs", "LogDestinationConfigs", (properties.LogDestinationConfigs != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LogDestinationConfigs) : undefined));
  ret.addPropertyResult("loggingFilter", "LoggingFilter", (properties.LoggingFilter != null ? cfn_parse.FromCloudFormation.getAny(properties.LoggingFilter) : undefined));
  ret.addPropertyResult("redactedFields", "RedactedFields", (properties.RedactedFields != null ? cfn_parse.FromCloudFormation.getArray(CfnLoggingConfigurationFieldToMatchPropertyFromCloudFormation)(properties.RedactedFields) : undefined));
  ret.addPropertyResult("resourceArn", "ResourceArn", (properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MatchPatternProperty`
 *
 * @param properties - the TypeScript properties of a `MatchPatternProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationMatchPatternPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("all", cdk.validateObject)(properties.all));
  errors.collect(cdk.propertyValidator("includedPaths", cdk.listValidator(cdk.validateString))(properties.includedPaths));
  return errors.wrap("supplied properties not correct for \"MatchPatternProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationMatchPatternPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationMatchPatternPropertyValidator(properties).assertSuccess();
  return {
    "All": cdk.objectToCloudFormation(properties.all),
    "IncludedPaths": cdk.listMapper(cdk.stringToCloudFormation)(properties.includedPaths)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationMatchPatternPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoggingConfiguration.MatchPatternProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.MatchPatternProperty>();
  ret.addPropertyResult("all", "All", (properties.All != null ? cfn_parse.FromCloudFormation.getAny(properties.All) : undefined));
  ret.addPropertyResult("includedPaths", "IncludedPaths", (properties.IncludedPaths != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludedPaths) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JsonBodyProperty`
 *
 * @param properties - the TypeScript properties of a `JsonBodyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationJsonBodyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("invalidFallbackBehavior", cdk.validateString)(properties.invalidFallbackBehavior));
  errors.collect(cdk.propertyValidator("matchPattern", cdk.requiredValidator)(properties.matchPattern));
  errors.collect(cdk.propertyValidator("matchPattern", CfnLoggingConfigurationMatchPatternPropertyValidator)(properties.matchPattern));
  errors.collect(cdk.propertyValidator("matchScope", cdk.requiredValidator)(properties.matchScope));
  errors.collect(cdk.propertyValidator("matchScope", cdk.validateString)(properties.matchScope));
  return errors.wrap("supplied properties not correct for \"JsonBodyProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationJsonBodyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationJsonBodyPropertyValidator(properties).assertSuccess();
  return {
    "InvalidFallbackBehavior": cdk.stringToCloudFormation(properties.invalidFallbackBehavior),
    "MatchPattern": convertCfnLoggingConfigurationMatchPatternPropertyToCloudFormation(properties.matchPattern),
    "MatchScope": cdk.stringToCloudFormation(properties.matchScope)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationJsonBodyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoggingConfiguration.JsonBodyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.JsonBodyProperty>();
  ret.addPropertyResult("invalidFallbackBehavior", "InvalidFallbackBehavior", (properties.InvalidFallbackBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.InvalidFallbackBehavior) : undefined));
  ret.addPropertyResult("matchPattern", "MatchPattern", (properties.MatchPattern != null ? CfnLoggingConfigurationMatchPatternPropertyFromCloudFormation(properties.MatchPattern) : undefined));
  ret.addPropertyResult("matchScope", "MatchScope", (properties.MatchScope != null ? cfn_parse.FromCloudFormation.getString(properties.MatchScope) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SingleHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `SingleHeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationSingleHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"SingleHeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationSingleHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationSingleHeaderPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationSingleHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoggingConfiguration.SingleHeaderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.SingleHeaderProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > This is the latest version of *AWS WAF* , named AWS WAF V2, released in November, 2019.
 *
 * For information, including how to migrate your AWS WAF resources from the prior release, see the [AWS WAF developer guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
 *
 * Use an `RegexPatternSet` to have AWS WAF inspect a web request component for a specific set of regular expression patterns.
 *
 * You use a regex pattern set by providing its Amazon Resource Name (ARN) to the rule statement `RegexPatternSetReferenceStatement` , when you add a rule to a rule group or web ACL.
 *
 * @cloudformationResource AWS::WAFv2::RegexPatternSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html
 */
export class CfnRegexPatternSet extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFv2::RegexPatternSet";

  /**
   * Build a CfnRegexPatternSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRegexPatternSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRegexPatternSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRegexPatternSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the regex pattern set.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the regex pattern set.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A description of the set that helps with identification.
   */
  public description?: string;

  /**
   * The name of the set.
   */
  public name?: string;

  /**
   * The regular expression patterns in the set.
   */
  public regularExpressionList: Array<string>;

  /**
   * Specifies whether this is for an Amazon CloudFront distribution or for a regional application.
   */
  public scope: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Key:value pairs associated with an AWS resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRegexPatternSetProps) {
    super(scope, id, {
      "type": CfnRegexPatternSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "regularExpressionList", this);
    cdk.requireProperty(props, "scope", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.regularExpressionList = props.regularExpressionList;
    this.scope = props.scope;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::WAFv2::RegexPatternSet", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "regularExpressionList": this.regularExpressionList,
      "scope": this.scope,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRegexPatternSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRegexPatternSetPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRegexPatternSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html
 */
export interface CfnRegexPatternSetProps {
  /**
   * A description of the set that helps with identification.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html#cfn-wafv2-regexpatternset-description
   */
  readonly description?: string;

  /**
   * The name of the set.
   *
   * You cannot change the name after you create the set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html#cfn-wafv2-regexpatternset-name
   */
  readonly name?: string;

  /**
   * The regular expression patterns in the set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html#cfn-wafv2-regexpatternset-regularexpressionlist
   */
  readonly regularExpressionList: Array<string>;

  /**
   * Specifies whether this is for an Amazon CloudFront distribution or for a regional application.
   *
   * A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AWS AppSync GraphQL API, an Amazon Cognito user pool, an AWS App Runner service, or an AWS Verified Access instance. Valid Values are `CLOUDFRONT` and `REGIONAL` .
   *
   * > For `CLOUDFRONT` , you must create your WAFv2 resources in the US East (N. Virginia) Region, `us-east-1` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html#cfn-wafv2-regexpatternset-scope
   */
  readonly scope: string;

  /**
   * Key:value pairs associated with an AWS resource.
   *
   * The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
   *
   * > To modify tags on existing resources, use the AWS WAF APIs or command line interface. With AWS CloudFormation , you can only add tags to AWS WAF resources during resource creation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html#cfn-wafv2-regexpatternset-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnRegexPatternSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnRegexPatternSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRegexPatternSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("regularExpressionList", cdk.requiredValidator)(properties.regularExpressionList));
  errors.collect(cdk.propertyValidator("regularExpressionList", cdk.listValidator(cdk.validateString))(properties.regularExpressionList));
  errors.collect(cdk.propertyValidator("scope", cdk.requiredValidator)(properties.scope));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRegexPatternSetProps\"");
}

// @ts-ignore TS6133
function convertCfnRegexPatternSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRegexPatternSetPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RegularExpressionList": cdk.listMapper(cdk.stringToCloudFormation)(properties.regularExpressionList),
    "Scope": cdk.stringToCloudFormation(properties.scope),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRegexPatternSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRegexPatternSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRegexPatternSetProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("regularExpressionList", "RegularExpressionList", (properties.RegularExpressionList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.RegularExpressionList) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > This is the latest version of *AWS WAF* , named AWS WAF V2, released in November, 2019.
 *
 * For information, including how to migrate your AWS WAF resources from the prior release, see the [AWS WAF developer guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
 *
 * Use an `RuleGroup` to define a collection of rules for inspecting and controlling web requests. You use a rule group in an `WebACL` by providing its Amazon Resource Name (ARN) to the rule statement `RuleGroupReferenceStatement` , when you add rules to the web ACL.
 *
 * When you create a rule group, you define an immutable capacity limit. If you update a rule group, you must stay within the capacity. This allows others to reuse the rule group with confidence in its capacity requirements.
 *
 * @cloudformationResource AWS::WAFv2::RuleGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html
 */
export class CfnRuleGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFv2::RuleGroup";

  /**
   * Build a CfnRuleGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRuleGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRuleGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRuleGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the rule group.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the rule group.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The label namespace prefix for this rule group. All labels added by rules in this rule group have this prefix.
   *
   * The syntax for the label namespace prefix for a rule group is the following: `awswaf:<account ID>:rule group:<rule group name>:`
   *
   * When a rule with a label matches a web request, AWS WAF adds the fully qualified label to the request. A fully qualified label is made up of the label namespace from the rule group or web ACL where the rule is defined and the label from the rule, separated by a colon.
   *
   * @cloudformationAttribute LabelNamespace
   */
  public readonly attrLabelNamespace: string;

  /**
   * The labels that one or more rules in this rule group add to matching web requests.
   */
  public availableLabels?: Array<cdk.IResolvable | CfnRuleGroup.LabelSummaryProperty> | cdk.IResolvable;

  /**
   * The web ACL capacity units (WCUs) required for this rule group.
   */
  public capacity: number;

  /**
   * The labels that one or more rules in this rule group match against in label match statements.
   */
  public consumedLabels?: Array<cdk.IResolvable | CfnRuleGroup.LabelSummaryProperty> | cdk.IResolvable;

  /**
   * A map of custom response keys and content bodies.
   */
  public customResponseBodies?: cdk.IResolvable | Record<string, CfnRuleGroup.CustomResponseBodyProperty | cdk.IResolvable>;

  /**
   * A description of the rule group that helps with identification.
   */
  public description?: string;

  /**
   * The name of the rule group.
   */
  public name?: string;

  /**
   * The rule statements used to identify the web requests that you want to allow, block, or count.
   */
  public rules?: Array<cdk.IResolvable | CfnRuleGroup.RuleProperty> | cdk.IResolvable;

  /**
   * Specifies whether this is for an Amazon CloudFront distribution or for a regional application.
   */
  public scope: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Key:value pairs associated with an AWS resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Defines and enables Amazon CloudWatch metrics and web request sample collection.
   */
  public visibilityConfig: cdk.IResolvable | CfnRuleGroup.VisibilityConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRuleGroupProps) {
    super(scope, id, {
      "type": CfnRuleGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "capacity", this);
    cdk.requireProperty(props, "scope", this);
    cdk.requireProperty(props, "visibilityConfig", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLabelNamespace = cdk.Token.asString(this.getAtt("LabelNamespace", cdk.ResolutionTypeHint.STRING));
    this.availableLabels = props.availableLabels;
    this.capacity = props.capacity;
    this.consumedLabels = props.consumedLabels;
    this.customResponseBodies = props.customResponseBodies;
    this.description = props.description;
    this.name = props.name;
    this.rules = props.rules;
    this.scope = props.scope;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::WAFv2::RuleGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.visibilityConfig = props.visibilityConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "availableLabels": this.availableLabels,
      "capacity": this.capacity,
      "consumedLabels": this.consumedLabels,
      "customResponseBodies": this.customResponseBodies,
      "description": this.description,
      "name": this.name,
      "rules": this.rules,
      "scope": this.scope,
      "tags": this.tags.renderTags(),
      "visibilityConfig": this.visibilityConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRuleGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRuleGroupPropsToCloudFormation(props);
  }
}

export namespace CfnRuleGroup {
  /**
   * List of labels used by one or more of the rules of a `RuleGroup` .
   *
   * This summary object is used for the following rule group lists:
   *
   * - `AvailableLabels` - Labels that rules add to matching requests. These labels are defined in the `RuleLabels` for a rule.
   * - `ConsumedLabels` - Labels that rules match against. These labels are defined in a `LabelMatchStatement` specification, in the `Statement` definition of a rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-labelsummary.html
   */
  export interface LabelSummaryProperty {
    /**
     * An individual label specification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-labelsummary.html#cfn-wafv2-rulegroup-labelsummary-name
     */
    readonly name?: string;
  }

  /**
   * The response body to use in a custom response to a web request.
   *
   * This is referenced by key from `CustomResponse` `CustomResponseBodyKey` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customresponsebody.html
   */
  export interface CustomResponseBodyProperty {
    /**
     * The payload of the custom response.
     *
     * You can use JSON escape strings in JSON content. To do this, you must specify JSON content in the `ContentType` setting.
     *
     * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customresponsebody.html#cfn-wafv2-rulegroup-customresponsebody-content
     */
    readonly content: string;

    /**
     * The type of content in the payload that you are defining in the `Content` string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customresponsebody.html#cfn-wafv2-rulegroup-customresponsebody-contenttype
     */
    readonly contentType: string;
  }

  /**
   * A single rule, which you can use in a `WebACL` or `RuleGroup` to identify web requests that you want to manage in some way.
   *
   * Each rule includes one top-level `Statement` that AWS WAF uses to identify matching web requests, and parameters that govern how AWS WAF handles them.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html
   */
  export interface RuleProperty {
    /**
     * The action that AWS WAF should take on a web request when it matches the rule statement.
     *
     * Settings at the web ACL level can override the rule action setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-action
     */
    readonly action?: cdk.IResolvable | CfnRuleGroup.RuleActionProperty;

    /**
     * Specifies how AWS WAF should handle `CAPTCHA` evaluations.
     *
     * If you don't specify this, AWS WAF uses the `CAPTCHA` configuration that's defined for the web ACL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-captchaconfig
     */
    readonly captchaConfig?: CfnRuleGroup.CaptchaConfigProperty | cdk.IResolvable;

    /**
     * Specifies how AWS WAF should handle `Challenge` evaluations.
     *
     * If you don't specify this, AWS WAF uses the challenge configuration that's defined for the web ACL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-challengeconfig
     */
    readonly challengeConfig?: CfnRuleGroup.ChallengeConfigProperty | cdk.IResolvable;

    /**
     * The name of the rule.
     *
     * If you change the name of a `Rule` after you create it and you want the rule's metric name to reflect the change, update the metric name in the rule's `VisibilityConfig` settings. AWS WAF doesn't automatically update the metric name when you update the rule name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-name
     */
    readonly name: string;

    /**
     * If you define more than one `Rule` in a `WebACL` , AWS WAF evaluates each request against the `Rules` in order based on the value of `Priority` .
     *
     * AWS WAF processes rules with lower priority first. The priorities don't need to be consecutive, but they must all be different.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-priority
     */
    readonly priority: number;

    /**
     * Labels to apply to web requests that match the rule match statement.
     *
     * AWS WAF applies fully qualified labels to matching web requests. A fully qualified label is the concatenation of a label namespace and a rule label. The rule's rule group or web ACL defines the label namespace.
     *
     * Rules that run after this rule in the web ACL can match against these labels using a `LabelMatchStatement` .
     *
     * For each label, provide a case-sensitive string containing optional namespaces and a label name, according to the following guidelines:
     *
     * - Separate each component of the label with a colon.
     * - Each namespace or name can have up to 128 characters.
     * - You can specify up to 5 namespaces in a label.
     * - Don't use the following reserved words in your label specification: `aws` , `waf` , `managed` , `rulegroup` , `webacl` , `regexpatternset` , or `ipset` .
     *
     * For example, `myLabelName` or `nameSpace1:nameSpace2:myLabelName` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-rulelabels
     */
    readonly ruleLabels?: Array<cdk.IResolvable | CfnRuleGroup.LabelProperty> | cdk.IResolvable;

    /**
     * The AWS WAF processing statement for the rule, for example `ByteMatchStatement` or `SizeConstraintStatement` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-statement
     */
    readonly statement: cdk.IResolvable | CfnRuleGroup.StatementProperty;

    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection.
     *
     * If you change the name of a `Rule` after you create it and you want the rule's metric name to reflect the change, update the metric name as well. AWS WAF doesn't automatically update the metric name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-visibilityconfig
     */
    readonly visibilityConfig: cdk.IResolvable | CfnRuleGroup.VisibilityConfigProperty;
  }

  /**
   * The action that AWS WAF should take on a web request when it matches a rule's statement.
   *
   * Settings at the web ACL level can override the rule action setting.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ruleaction.html
   */
  export interface RuleActionProperty {
    /**
     * Instructs AWS WAF to allow the web request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ruleaction.html#cfn-wafv2-rulegroup-ruleaction-allow
     */
    readonly allow?: any | cdk.IResolvable;

    /**
     * Instructs AWS WAF to block the web request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ruleaction.html#cfn-wafv2-rulegroup-ruleaction-block
     */
    readonly block?: any | cdk.IResolvable;

    /**
     * Specifies that AWS WAF should run a `CAPTCHA` check against the request:.
     *
     * - If the request includes a valid, unexpired `CAPTCHA` token, AWS WAF allows the web request inspection to proceed to the next rule, similar to a `CountAction` .
     * - If the request doesn't include a valid, unexpired `CAPTCHA` token, AWS WAF discontinues the web ACL evaluation of the request and blocks it from going to its intended destination.
     *
     * AWS WAF generates a response that it sends back to the client, which includes the following:
     *
     * - The header `x-amzn-waf-action` with a value of `captcha` .
     * - The HTTP status code `405 Method Not Allowed` .
     * - If the request contains an `Accept` header with a value of `text/html` , the response includes a `CAPTCHA` challenge.
     *
     * You can configure the expiration time in the `CaptchaConfig` `ImmunityTimeProperty` setting at the rule and web ACL level. The rule setting overrides the web ACL setting.
     *
     * This action option is available for rules. It isn't available for web ACL default actions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ruleaction.html#cfn-wafv2-rulegroup-ruleaction-captcha
     */
    readonly captcha?: any | cdk.IResolvable;

    /**
     * Instructs AWS WAF to run a `Challenge` check against the web request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ruleaction.html#cfn-wafv2-rulegroup-ruleaction-challenge
     */
    readonly challenge?: any | cdk.IResolvable;

    /**
     * Instructs AWS WAF to count the web request and then continue evaluating the request using the remaining rules in the web ACL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ruleaction.html#cfn-wafv2-rulegroup-ruleaction-count
     */
    readonly count?: any | cdk.IResolvable;
  }

  /**
   * The processing guidance for a rule, used by AWS WAF to determine whether a web request matches the rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html
   */
  export interface StatementProperty {
    /**
     * A logical rule statement used to combine other rule statements with AND logic.
     *
     * You provide more than one `Statement` within the `AndStatement` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-andstatement
     */
    readonly andStatement?: CfnRuleGroup.AndStatementProperty | cdk.IResolvable;

    /**
     * A rule statement that defines a string match search for AWS WAF to apply to web requests.
     *
     * The byte match statement provides the bytes to search for, the location in requests that you want AWS WAF to search, and other settings. The bytes to search for are typically a string that corresponds with ASCII characters. In the AWS WAF console and the developer guide, this is called a string match statement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-bytematchstatement
     */
    readonly byteMatchStatement?: CfnRuleGroup.ByteMatchStatementProperty | cdk.IResolvable;

    /**
     * A rule statement that labels web requests by country and region and that matches against web requests based on country code.
     *
     * A geo match rule labels every request that it inspects regardless of whether it finds a match.
     *
     * - To manage requests only by country, you can use this statement by itself and specify the countries that you want to match against in the `CountryCodes` array.
     * - Otherwise, configure your geo match rule with Count action so that it only labels requests. Then, add one or more label match rules to run after the geo match rule and configure them to match against the geographic labels and handle the requests as needed.
     *
     * AWS WAF labels requests using the alpha-2 country and region codes from the International Organization for Standardization (ISO) 3166 standard. AWS WAF determines the codes using either the IP address in the web request origin or, if you specify it, the address in the geo match `ForwardedIPConfig` .
     *
     * If you use the web request origin, the label formats are `awswaf:clientip:geo:region:<ISO country code>-<ISO region code>` and `awswaf:clientip:geo:country:<ISO country code>` .
     *
     * If you use a forwarded IP address, the label formats are `awswaf:forwardedip:geo:region:<ISO country code>-<ISO region code>` and `awswaf:forwardedip:geo:country:<ISO country code>` .
     *
     * For additional details, see [Geographic match rule statement](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-geo-match.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-geomatchstatement
     */
    readonly geoMatchStatement?: CfnRuleGroup.GeoMatchStatementProperty | cdk.IResolvable;

    /**
     * A rule statement used to detect web requests coming from particular IP addresses or address ranges.
     *
     * To use this, create an `IPSet` that specifies the addresses you want to detect, then use the ARN of that set in this statement.
     *
     * Each IP set rule statement references an IP set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-ipsetreferencestatement
     */
    readonly ipSetReferenceStatement?: CfnRuleGroup.IPSetReferenceStatementProperty | cdk.IResolvable;

    /**
     * A rule statement to match against labels that have been added to the web request by rules that have already run in the web ACL.
     *
     * The label match statement provides the label or namespace string to search for. The label string can represent a part or all of the fully qualified label name that had been added to the web request. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label. If you do not provide the fully qualified name in your label match string, AWS WAF performs the search for labels that were added in the same context as the label match statement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-labelmatchstatement
     */
    readonly labelMatchStatement?: cdk.IResolvable | CfnRuleGroup.LabelMatchStatementProperty;

    /**
     * A logical rule statement used to negate the results of another rule statement.
     *
     * You provide one `Statement` within the `NotStatement` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-notstatement
     */
    readonly notStatement?: cdk.IResolvable | CfnRuleGroup.NotStatementProperty;

    /**
     * A logical rule statement used to combine other rule statements with OR logic.
     *
     * You provide more than one `Statement` within the `OrStatement` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-orstatement
     */
    readonly orStatement?: cdk.IResolvable | CfnRuleGroup.OrStatementProperty;

    /**
     * A rate-based rule counts incoming requests and rate limits requests when they are coming at too fast a rate.
     *
     * The rule categorizes requests according to your aggregation criteria, collects them into aggregation instances, and counts and rate limits the requests for each instance.
     *
     * You can specify individual aggregation keys, like IP address or HTTP method. You can also specify aggregation key combinations, like IP address and HTTP method, or HTTP method, query argument, and cookie.
     *
     * Each unique set of values for the aggregation keys that you specify is a separate aggregation instance, with the value from each key contributing to the aggregation instance definition.
     *
     * For example, assume the rule evaluates web requests with the following IP address and HTTP method values:
     *
     * - IP address 10.1.1.1, HTTP method POST
     * - IP address 10.1.1.1, HTTP method GET
     * - IP address 127.0.0.0, HTTP method POST
     * - IP address 10.1.1.1, HTTP method GET
     *
     * The rule would create different aggregation instances according to your aggregation criteria, for example:
     *
     * - If the aggregation criteria is just the IP address, then each individual address is an aggregation instance, and AWS WAF counts requests separately for each. The aggregation instances and request counts for our example would be the following:
     *
     * - IP address 10.1.1.1: count 3
     * - IP address 127.0.0.0: count 1
     * - If the aggregation criteria is HTTP method, then each individual HTTP method is an aggregation instance. The aggregation instances and request counts for our example would be the following:
     *
     * - HTTP method POST: count 2
     * - HTTP method GET: count 2
     * - If the aggregation criteria is IP address and HTTP method, then each IP address and each HTTP method would contribute to the combined aggregation instance. The aggregation instances and request counts for our example would be the following:
     *
     * - IP address 10.1.1.1, HTTP method POST: count 1
     * - IP address 10.1.1.1, HTTP method GET: count 2
     * - IP address 127.0.0.0, HTTP method POST: count 1
     *
     * For any n-tuple of aggregation keys, each unique combination of values for the keys defines a separate aggregation instance, which AWS WAF counts and rate-limits individually.
     *
     * You can optionally nest another statement inside the rate-based statement, to narrow the scope of the rule so that it only counts and rate limits requests that match the nested statement. You can use this nested scope-down statement in conjunction with your aggregation key specifications or you can just count and rate limit all requests that match the scope-down statement, without additional aggregation. When you choose to just manage all requests that match a scope-down statement, the aggregation instance is singular for the rule.
     *
     * You cannot nest a `RateBasedStatement` inside another statement, for example inside a `NotStatement` or `OrStatement` . You can define a `RateBasedStatement` inside a web ACL and inside a rule group.
     *
     * For additional information about the options, see [Rate limiting web requests using rate-based rules](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rate-based-rules.html) in the *AWS WAF Developer Guide* .
     *
     * If you only aggregate on the individual IP address or forwarded IP address, you can retrieve the list of IP addresses that AWS WAF is currently rate limiting for a rule through the API call `GetRateBasedStatementManagedKeys` . This option is not available for other aggregation configurations.
     *
     * AWS WAF tracks and manages web requests separately for each instance of a rate-based rule that you use. For example, if you provide the same rate-based rule settings in two web ACLs, each of the two rule statements represents a separate instance of the rate-based rule and gets its own tracking and management by AWS WAF . If you define a rate-based rule inside a rule group, and then use that rule group in multiple places, each use creates a separate instance of the rate-based rule that gets its own tracking and management by AWS WAF .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-ratebasedstatement
     */
    readonly rateBasedStatement?: cdk.IResolvable | CfnRuleGroup.RateBasedStatementProperty;

    /**
     * A rule statement used to search web request components for a match against a single regular expression.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-regexmatchstatement
     */
    readonly regexMatchStatement?: cdk.IResolvable | CfnRuleGroup.RegexMatchStatementProperty;

    /**
     * A rule statement used to search web request components for matches with regular expressions.
     *
     * To use this, create a `RegexPatternSet` that specifies the expressions that you want to detect, then use the ARN of that set in this statement. A web request matches the pattern set rule statement if the request component matches any of the patterns in the set.
     *
     * Each regex pattern set rule statement references a regex pattern set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-regexpatternsetreferencestatement
     */
    readonly regexPatternSetReferenceStatement?: cdk.IResolvable | CfnRuleGroup.RegexPatternSetReferenceStatementProperty;

    /**
     * A rule statement that compares a number of bytes against the size of a request component, using a comparison operator, such as greater than (>) or less than (<).
     *
     * For example, you can use a size constraint statement to look for query strings that are longer than 100 bytes.
     *
     * If you configure AWS WAF to inspect the request body, AWS WAF inspects only the number of bytes of the body up to the limit for the web ACL. By default, for regional web ACLs, this limit is 8 KB (8,192 bytes) and for CloudFront web ACLs, this limit is 16 KB (16,384 bytes). For CloudFront web ACLs, you can increase the limit in the web ACL `AssociationConfig` , for additional fees. If you know that the request body for your web requests should never exceed the inspection limit, you could use a size constraint statement to block requests that have a larger request body size.
     *
     * If you choose URI for the value of Part of the request to filter on, the slash (/) in the URI counts as one character. For example, the URI `/logo.jpg` is nine characters long.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-sizeconstraintstatement
     */
    readonly sizeConstraintStatement?: cdk.IResolvable | CfnRuleGroup.SizeConstraintStatementProperty;

    /**
     * A rule statement that inspects for malicious SQL code.
     *
     * Attackers insert malicious SQL code into web requests to do things like modify your database or extract data from it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-sqlimatchstatement
     */
    readonly sqliMatchStatement?: cdk.IResolvable | CfnRuleGroup.SqliMatchStatementProperty;

    /**
     * A rule statement that inspects for cross-site scripting (XSS) attacks.
     *
     * In XSS attacks, the attacker uses vulnerabilities in a benign website as a vehicle to inject malicious client-site scripts into other legitimate web browsers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-xssmatchstatement
     */
    readonly xssMatchStatement?: cdk.IResolvable | CfnRuleGroup.XssMatchStatementProperty;
  }

  /**
   * A rule statement that compares a number of bytes against the size of a request component, using a comparison operator, such as greater than (>) or less than (<).
   *
   * For example, you can use a size constraint statement to look for query strings that are longer than 100 bytes.
   *
   * If you configure AWS WAF to inspect the request body, AWS WAF inspects only the number of bytes of the body up to the limit for the web ACL. By default, for regional web ACLs, this limit is 8 KB (8,192 bytes) and for CloudFront web ACLs, this limit is 16 KB (16,384 bytes). For CloudFront web ACLs, you can increase the limit in the web ACL `AssociationConfig` , for additional fees. If you know that the request body for your web requests should never exceed the inspection limit, you could use a size constraint statement to block requests that have a larger request body size.
   *
   * If you choose URI for the value of Part of the request to filter on, the slash (/) in the URI counts as one character. For example, the URI `/logo.jpg` is nine characters long.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sizeconstraintstatement.html
   */
  export interface SizeConstraintStatementProperty {
    /**
     * The operator to use to compare the request part to the size setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sizeconstraintstatement.html#cfn-wafv2-rulegroup-sizeconstraintstatement-comparisonoperator
     */
    readonly comparisonOperator: string;

    /**
     * The part of the web request that you want AWS WAF to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sizeconstraintstatement.html#cfn-wafv2-rulegroup-sizeconstraintstatement-fieldtomatch
     */
    readonly fieldToMatch: CfnRuleGroup.FieldToMatchProperty | cdk.IResolvable;

    /**
     * The size, in byte, to compare to the request part, after any transformations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sizeconstraintstatement.html#cfn-wafv2-rulegroup-sizeconstraintstatement-size
     */
    readonly size: number;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sizeconstraintstatement.html#cfn-wafv2-rulegroup-sizeconstraintstatement-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnRuleGroup.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-texttransformation.html
   */
  export interface TextTransformationProperty {
    /**
     * Sets the relative processing order for multiple transformations.
     *
     * AWS WAF processes all transformations, from lowest priority to highest, before inspecting the transformed content. The priorities don't need to be consecutive, but they must all be different.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-texttransformation.html#cfn-wafv2-rulegroup-texttransformation-priority
     */
    readonly priority: number;

    /**
     * For detailed descriptions of each of the transformation types, see [Text transformations](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-transformation.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-texttransformation.html#cfn-wafv2-rulegroup-texttransformation-type
     */
    readonly type: string;
  }

  /**
   * The part of the web request that you want AWS WAF to inspect.
   *
   * Include the single `FieldToMatch` type that you want to inspect, with additional specifications as needed, according to the type. You specify a single request component in `FieldToMatch` for each rule statement that requires it. To inspect more than one component of the web request, create a separate rule statement for each component.
   *
   * Example JSON for a `QueryString` field to match:
   *
   * `"FieldToMatch": { "QueryString": {} }`
   *
   * Example JSON for a `Method` field to match specification:
   *
   * `"FieldToMatch": { "Method": { "Name": "DELETE" } }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html
   */
  export interface FieldToMatchProperty {
    /**
     * Inspect all query arguments.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-allqueryarguments
     */
    readonly allQueryArguments?: any | cdk.IResolvable;

    /**
     * Inspect the request body as plain text.
     *
     * The request body immediately follows the request headers. This is the part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form.
     *
     * A limited amount of the request body is forwarded to AWS WAF for inspection by the underlying host service. For regional resources, the limit is 8 KB (8,192 bytes) and for CloudFront distributions, the limit is 16 KB (16,384 bytes). For CloudFront distributions, you can increase the limit in the web ACL's `AssociationConfig` , for additional processing fees.
     *
     * For information about how to handle oversized request bodies, see the `Body` object configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-body
     */
    readonly body?: CfnRuleGroup.BodyProperty | cdk.IResolvable;

    /**
     * Inspect the request cookies.
     *
     * You must configure scope and pattern matching filters in the `Cookies` object, to define the set of cookies and the parts of the cookies that AWS WAF inspects.
     *
     * Only the first 8 KB (8192 bytes) of a request's cookies and only the first 200 cookies are forwarded to AWS WAF for inspection by the underlying host service. You must configure how to handle any oversize cookie content in the `Cookies` object. AWS WAF applies the pattern matching filters to the cookies that it receives from the underlying host service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-cookies
     */
    readonly cookies?: CfnRuleGroup.CookiesProperty | cdk.IResolvable;

    /**
     * Inspect the request headers.
     *
     * You must configure scope and pattern matching filters in the `Headers` object, to define the set of headers to and the parts of the headers that AWS WAF inspects.
     *
     * Only the first 8 KB (8192 bytes) of a request's headers and only the first 200 headers are forwarded to AWS WAF for inspection by the underlying host service. You must configure how to handle any oversize header content in the `Headers` object. AWS WAF applies the pattern matching filters to the headers that it receives from the underlying host service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-headers
     */
    readonly headers?: CfnRuleGroup.HeadersProperty | cdk.IResolvable;

    /**
     * Inspect the request body as JSON.
     *
     * The request body immediately follows the request headers. This is the part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form.
     *
     * A limited amount of the request body is forwarded to AWS WAF for inspection by the underlying host service. For regional resources, the limit is 8 KB (8,192 bytes) and for CloudFront distributions, the limit is 16 KB (16,384 bytes). For CloudFront distributions, you can increase the limit in the web ACL's `AssociationConfig` , for additional processing fees.
     *
     * For information about how to handle oversized request bodies, see the `JsonBody` object configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-jsonbody
     */
    readonly jsonBody?: cdk.IResolvable | CfnRuleGroup.JsonBodyProperty;

    /**
     * Inspect the HTTP method.
     *
     * The method indicates the type of operation that the request is asking the origin to perform.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-method
     */
    readonly method?: any | cdk.IResolvable;

    /**
     * Inspect the query string.
     *
     * This is the part of a URL that appears after a `?` character, if any.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-querystring
     */
    readonly queryString?: any | cdk.IResolvable;

    /**
     * Inspect a single header.
     *
     * Provide the name of the header to inspect, for example, `User-Agent` or `Referer` . This setting isn't case sensitive.
     *
     * Example JSON: `"SingleHeader": { "Name": "haystack" }`
     *
     * Alternately, you can filter and inspect all headers with the `Headers` `FieldToMatch` setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-singleheader
     */
    readonly singleHeader?: any | cdk.IResolvable;

    /**
     * Inspect a single query argument.
     *
     * Provide the name of the query argument to inspect, such as *UserName* or *SalesRegion* . The name can be up to 30 characters long and isn't case sensitive.
     *
     * Example JSON: `"SingleQueryArgument": { "Name": "myArgument" }`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-singlequeryargument
     */
    readonly singleQueryArgument?: any | cdk.IResolvable;

    /**
     * Inspect the request URI path.
     *
     * This is the part of the web request that identifies a resource, for example, `/images/daily-ad.jpg` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-uripath
     */
    readonly uriPath?: any | cdk.IResolvable;
  }

  /**
   * Inspect the body of the web request as JSON. The body immediately follows the request headers.
   *
   * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
   *
   * Use the specifications in this object to indicate which parts of the JSON body to inspect using the rule's inspection criteria. AWS WAF inspects only the parts of the JSON that result from the matches that you indicate.
   *
   * Example JSON: `"JsonBody": { "MatchPattern": { "All": {} }, "MatchScope": "ALL" }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonbody.html
   */
  export interface JsonBodyProperty {
    /**
     * What AWS WAF should do if it fails to completely parse the JSON body. The options are the following:.
     *
     * - `EVALUATE_AS_STRING` - Inspect the body as plain text. AWS WAF applies the text transformations and inspection criteria that you defined for the JSON inspection to the body text string.
     * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
     * - `NO_MATCH` - Treat the web request as not matching the rule statement.
     *
     * If you don't provide this setting, AWS WAF parses and evaluates the content only up to the first parsing failure that it encounters.
     *
     * AWS WAF does its best to parse the entire JSON body, but might be forced to stop for reasons such as invalid characters, duplicate keys, truncation, and any content whose root node isn't an object or an array.
     *
     * AWS WAF parses the JSON in the following examples as two valid key, value pairs:
     *
     * - Missing comma: `{"key1":"value1""key2":"value2"}`
     * - Missing colon: `{"key1":"value1","key2""value2"}`
     * - Extra colons: `{"key1"::"value1","key2""value2"}`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonbody.html#cfn-wafv2-rulegroup-jsonbody-invalidfallbackbehavior
     */
    readonly invalidFallbackBehavior?: string;

    /**
     * The patterns to look for in the JSON body.
     *
     * AWS WAF inspects the results of these pattern matches against the rule inspection criteria.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonbody.html#cfn-wafv2-rulegroup-jsonbody-matchpattern
     */
    readonly matchPattern: cdk.IResolvable | CfnRuleGroup.JsonMatchPatternProperty;

    /**
     * The parts of the JSON to match against using the `MatchPattern` .
     *
     * If you specify `ALL` , AWS WAF matches against keys and values.
     *
     * `All` does not require a match to be found in the keys and a match to be found in the values. It requires a match to be found in the keys or the values or both. To require a match in the keys and in the values, use a logical `AND` statement to combine two match rules, one that inspects the keys and another that inspects the values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonbody.html#cfn-wafv2-rulegroup-jsonbody-matchscope
     */
    readonly matchScope: string;

    /**
     * What AWS WAF should do if the body is larger than AWS WAF can inspect.
     *
     * AWS WAF does not support inspecting the entire contents of the web request body if the body exceeds the limit for the resource type. If the body is larger than the limit, the underlying host service only forwards the contents that are below the limit to AWS WAF for inspection.
     *
     * The default limit is 8 KB (8,192 bytes) for regional resources and 16 KB (16,384 bytes) for CloudFront distributions. For CloudFront distributions, you can increase the limit in the web ACL `AssociationConfig` , for additional processing fees.
     *
     * The options for oversize handling are the following:
     *
     * - `CONTINUE` - Inspect the available body contents normally, according to the rule inspection criteria.
     * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
     * - `NO_MATCH` - Treat the web request as not matching the rule statement.
     *
     * You can combine the `MATCH` or `NO_MATCH` settings for oversize handling with your rule and web ACL action settings, so that you block any request whose body is over the limit.
     *
     * Default: `CONTINUE`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonbody.html#cfn-wafv2-rulegroup-jsonbody-oversizehandling
     */
    readonly oversizeHandling?: string;
  }

  /**
   * The patterns to look for in the JSON body.
   *
   * AWS WAF inspects the results of these pattern matches against the rule inspection criteria. This is used with the `FieldToMatch` option `JsonBody` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonmatchpattern.html
   */
  export interface JsonMatchPatternProperty {
    /**
     * Match all of the elements. See also `MatchScope` in the `JsonBody` `FieldToMatch` specification.
     *
     * You must specify either this setting or the `IncludedPaths` setting, but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonmatchpattern.html#cfn-wafv2-rulegroup-jsonmatchpattern-all
     */
    readonly all?: any | cdk.IResolvable;

    /**
     * Match only the specified include paths. See also `MatchScope` in the `JsonBody` `FieldToMatch` specification.
     *
     * Provide the include paths using JSON Pointer syntax. For example, `"IncludedPaths": ["/dogs/0/name", "/dogs/1/name"]` . For information about this syntax, see the Internet Engineering Task Force (IETF) documentation [JavaScript Object Notation (JSON) Pointer](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6901) .
     *
     * You must specify either this setting or the `All` setting, but not both.
     *
     * > Don't use this option to include all paths. Instead, use the `All` setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonmatchpattern.html#cfn-wafv2-rulegroup-jsonmatchpattern-includedpaths
     */
    readonly includedPaths?: Array<string>;
  }

  /**
   * Inspect all headers in the web request.
   *
   * You can specify the parts of the headers to inspect and you can narrow the set of headers to inspect by including or excluding specific keys.
   *
   * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
   *
   * If you want to inspect just the value of a single header, use the `SingleHeader` `FieldToMatch` setting instead.
   *
   * Example JSON: `"Headers": { "MatchPattern": { "All": {} }, "MatchScope": "KEY", "OversizeHandling": "MATCH" }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headers.html
   */
  export interface HeadersProperty {
    /**
     * The filter to use to identify the subset of headers to inspect in a web request.
     *
     * You must specify exactly one setting: either `All` , `IncludedHeaders` , or `ExcludedHeaders` .
     *
     * Example JSON: `"MatchPattern": { "ExcludedHeaders": [ "KeyToExclude1", "KeyToExclude2" ] }`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headers.html#cfn-wafv2-rulegroup-headers-matchpattern
     */
    readonly matchPattern: CfnRuleGroup.HeaderMatchPatternProperty | cdk.IResolvable;

    /**
     * The parts of the headers to match with the rule inspection criteria.
     *
     * If you specify `ALL` , AWS WAF inspects both keys and values.
     *
     * `All` does not require a match to be found in the keys and a match to be found in the values. It requires a match to be found in the keys or the values or both. To require a match in the keys and in the values, use a logical `AND` statement to combine two match rules, one that inspects the keys and another that inspects the values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headers.html#cfn-wafv2-rulegroup-headers-matchscope
     */
    readonly matchScope: string;

    /**
     * What AWS WAF should do if the headers of the request are more numerous or larger than AWS WAF can inspect.
     *
     * AWS WAF does not support inspecting the entire contents of request headers when they exceed 8 KB (8192 bytes) or 200 total headers. The underlying host service forwards a maximum of 200 headers and at most 8 KB of header contents to AWS WAF .
     *
     * The options for oversize handling are the following:
     *
     * - `CONTINUE` - Inspect the available headers normally, according to the rule inspection criteria.
     * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
     * - `NO_MATCH` - Treat the web request as not matching the rule statement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headers.html#cfn-wafv2-rulegroup-headers-oversizehandling
     */
    readonly oversizeHandling: string;
  }

  /**
   * The filter to use to identify the subset of headers to inspect in a web request.
   *
   * You must specify exactly one setting: either `All` , `IncludedHeaders` , or `ExcludedHeaders` .
   *
   * Example JSON: `"MatchPattern": { "ExcludedHeaders": [ "KeyToExclude1", "KeyToExclude2" ] }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headermatchpattern.html
   */
  export interface HeaderMatchPatternProperty {
    /**
     * Inspect all headers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headermatchpattern.html#cfn-wafv2-rulegroup-headermatchpattern-all
     */
    readonly all?: any | cdk.IResolvable;

    /**
     * Inspect only the headers whose keys don't match any of the strings specified here.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headermatchpattern.html#cfn-wafv2-rulegroup-headermatchpattern-excludedheaders
     */
    readonly excludedHeaders?: Array<string>;

    /**
     * Inspect only the headers that have a key that matches one of the strings specified here.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headermatchpattern.html#cfn-wafv2-rulegroup-headermatchpattern-includedheaders
     */
    readonly includedHeaders?: Array<string>;
  }

  /**
   * Inspect the cookies in the web request.
   *
   * You can specify the parts of the cookies to inspect and you can narrow the set of cookies to inspect by including or excluding specific keys.
   *
   * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
   *
   * Example JSON: `"Cookies": { "MatchPattern": { "All": {} }, "MatchScope": "KEY", "OversizeHandling": "MATCH" }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookies.html
   */
  export interface CookiesProperty {
    /**
     * The filter to use to identify the subset of cookies to inspect in a web request.
     *
     * You must specify exactly one setting: either `All` , `IncludedCookies` , or `ExcludedCookies` .
     *
     * Example JSON: `"MatchPattern": { "IncludedCookies": [ "session-id-time", "session-id" ] }`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookies.html#cfn-wafv2-rulegroup-cookies-matchpattern
     */
    readonly matchPattern: CfnRuleGroup.CookieMatchPatternProperty | cdk.IResolvable;

    /**
     * The parts of the cookies to inspect with the rule inspection criteria.
     *
     * If you specify `ALL` , AWS WAF inspects both keys and values.
     *
     * `All` does not require a match to be found in the keys and a match to be found in the values. It requires a match to be found in the keys or the values or both. To require a match in the keys and in the values, use a logical `AND` statement to combine two match rules, one that inspects the keys and another that inspects the values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookies.html#cfn-wafv2-rulegroup-cookies-matchscope
     */
    readonly matchScope: string;

    /**
     * What AWS WAF should do if the cookies of the request are more numerous or larger than AWS WAF can inspect.
     *
     * AWS WAF does not support inspecting the entire contents of request cookies when they exceed 8 KB (8192 bytes) or 200 total cookies. The underlying host service forwards a maximum of 200 cookies and at most 8 KB of cookie contents to AWS WAF .
     *
     * The options for oversize handling are the following:
     *
     * - `CONTINUE` - Inspect the available cookies normally, according to the rule inspection criteria.
     * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
     * - `NO_MATCH` - Treat the web request as not matching the rule statement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookies.html#cfn-wafv2-rulegroup-cookies-oversizehandling
     */
    readonly oversizeHandling: string;
  }

  /**
   * The filter to use to identify the subset of cookies to inspect in a web request.
   *
   * You must specify exactly one setting: either `All` , `IncludedCookies` , or `ExcludedCookies` .
   *
   * Example JSON: `"MatchPattern": { "IncludedCookies": [ "session-id-time", "session-id" ] }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookiematchpattern.html
   */
  export interface CookieMatchPatternProperty {
    /**
     * Inspect all cookies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookiematchpattern.html#cfn-wafv2-rulegroup-cookiematchpattern-all
     */
    readonly all?: any | cdk.IResolvable;

    /**
     * Inspect only the cookies whose keys don't match any of the strings specified here.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookiematchpattern.html#cfn-wafv2-rulegroup-cookiematchpattern-excludedcookies
     */
    readonly excludedCookies?: Array<string>;

    /**
     * Inspect only the cookies that have a key that matches one of the strings specified here.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookiematchpattern.html#cfn-wafv2-rulegroup-cookiematchpattern-includedcookies
     */
    readonly includedCookies?: Array<string>;
  }

  /**
   * Inspect the body of the web request. The body immediately follows the request headers.
   *
   * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-body.html
   */
  export interface BodyProperty {
    /**
     * What AWS WAF should do if the body is larger than AWS WAF can inspect.
     *
     * AWS WAF does not support inspecting the entire contents of the web request body if the body exceeds the limit for the resource type. If the body is larger than the limit, the underlying host service only forwards the contents that are below the limit to AWS WAF for inspection.
     *
     * The default limit is 8 KB (8,192 bytes) for regional resources and 16 KB (16,384 bytes) for CloudFront distributions. For CloudFront distributions, you can increase the limit in the web ACL `AssociationConfig` , for additional processing fees.
     *
     * The options for oversize handling are the following:
     *
     * - `CONTINUE` - Inspect the available body contents normally, according to the rule inspection criteria.
     * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
     * - `NO_MATCH` - Treat the web request as not matching the rule statement.
     *
     * You can combine the `MATCH` or `NO_MATCH` settings for oversize handling with your rule and web ACL action settings, so that you block any request whose body is over the limit.
     *
     * Default: `CONTINUE`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-body.html#cfn-wafv2-rulegroup-body-oversizehandling
     */
    readonly oversizeHandling?: string;
  }

  /**
   * A logical rule statement used to combine other rule statements with AND logic.
   *
   * You provide more than one `Statement` within the `AndStatement` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-andstatement.html
   */
  export interface AndStatementProperty {
    /**
     * The statements to combine with AND logic.
     *
     * You can use any statements that can be nested.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-andstatement.html#cfn-wafv2-rulegroup-andstatement-statements
     */
    readonly statements: Array<cdk.IResolvable | CfnRuleGroup.StatementProperty> | cdk.IResolvable;
  }

  /**
   * A rule statement that inspects for cross-site scripting (XSS) attacks.
   *
   * In XSS attacks, the attacker uses vulnerabilities in a benign website as a vehicle to inject malicious client-site scripts into other legitimate web browsers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-xssmatchstatement.html
   */
  export interface XssMatchStatementProperty {
    /**
     * The part of the web request that you want AWS WAF to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-xssmatchstatement.html#cfn-wafv2-rulegroup-xssmatchstatement-fieldtomatch
     */
    readonly fieldToMatch: CfnRuleGroup.FieldToMatchProperty | cdk.IResolvable;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-xssmatchstatement.html#cfn-wafv2-rulegroup-xssmatchstatement-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnRuleGroup.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * A logical rule statement used to negate the results of another rule statement.
   *
   * You provide one `Statement` within the `NotStatement` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-notstatement.html
   */
  export interface NotStatementProperty {
    /**
     * The statement to negate.
     *
     * You can use any statement that can be nested.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-notstatement.html#cfn-wafv2-rulegroup-notstatement-statement
     */
    readonly statement: cdk.IResolvable | CfnRuleGroup.StatementProperty;
  }

  /**
   * A rule statement that defines a string match search for AWS WAF to apply to web requests.
   *
   * The byte match statement provides the bytes to search for, the location in requests that you want AWS WAF to search, and other settings. The bytes to search for are typically a string that corresponds with ASCII characters. In the AWS WAF console and the developer guide, this is called a string match statement.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-bytematchstatement.html
   */
  export interface ByteMatchStatementProperty {
    /**
     * The part of the web request that you want AWS WAF to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-bytematchstatement.html#cfn-wafv2-rulegroup-bytematchstatement-fieldtomatch
     */
    readonly fieldToMatch: CfnRuleGroup.FieldToMatchProperty | cdk.IResolvable;

    /**
     * The area within the portion of the web request that you want AWS WAF to search for `SearchString` .
     *
     * Valid values include the following:
     *
     * *CONTAINS*
     *
     * The specified part of the web request must include the value of `SearchString` , but the location doesn't matter.
     *
     * *CONTAINS_WORD*
     *
     * The specified part of the web request must include the value of `SearchString` , and `SearchString` must contain only alphanumeric characters or underscore (A-Z, a-z, 0-9, or _). In addition, `SearchString` must be a word, which means that both of the following are true:
     *
     * - `SearchString` is at the beginning of the specified part of the web request or is preceded by a character other than an alphanumeric character or underscore (_). Examples include the value of a header and `;BadBot` .
     * - `SearchString` is at the end of the specified part of the web request or is followed by a character other than an alphanumeric character or underscore (_), for example, `BadBot;` and `-BadBot;` .
     *
     * *EXACTLY*
     *
     * The value of the specified part of the web request must exactly match the value of `SearchString` .
     *
     * *STARTS_WITH*
     *
     * The value of `SearchString` must appear at the beginning of the specified part of the web request.
     *
     * *ENDS_WITH*
     *
     * The value of `SearchString` must appear at the end of the specified part of the web request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-bytematchstatement.html#cfn-wafv2-rulegroup-bytematchstatement-positionalconstraint
     */
    readonly positionalConstraint: string;

    /**
     * A string value that you want AWS WAF to search for.
     *
     * AWS WAF searches only in the part of web requests that you designate for inspection in `FieldToMatch` . The maximum length of the value is 200 bytes. For alphabetic characters A-Z and a-z, the value is case sensitive.
     *
     * Don't encode this string. Provide the value that you want AWS WAF to search for. AWS CloudFormation automatically base64 encodes the value for you.
     *
     * For example, suppose the value of `Type` is `HEADER` and the value of `Data` is `User-Agent` . If you want to search the `User-Agent` header for the value `BadBot` , you provide the string `BadBot` in the value of `SearchString` .
     *
     * You must specify either `SearchString` or `SearchStringBase64` in a `ByteMatchStatement` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-bytematchstatement.html#cfn-wafv2-rulegroup-bytematchstatement-searchstring
     */
    readonly searchString?: string;

    /**
     * String to search for in a web request component, base64-encoded.
     *
     * If you don't want to encode the string, specify the unencoded value in `SearchString` instead.
     *
     * You must specify either `SearchString` or `SearchStringBase64` in a `ByteMatchStatement` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-bytematchstatement.html#cfn-wafv2-rulegroup-bytematchstatement-searchstringbase64
     */
    readonly searchStringBase64?: string;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-bytematchstatement.html#cfn-wafv2-rulegroup-bytematchstatement-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnRuleGroup.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * A rate-based rule counts incoming requests and rate limits requests when they are coming at too fast a rate.
   *
   * The rule categorizes requests according to your aggregation criteria, collects them into aggregation instances, and counts and rate limits the requests for each instance.
   *
   * You can specify individual aggregation keys, like IP address or HTTP method. You can also specify aggregation key combinations, like IP address and HTTP method, or HTTP method, query argument, and cookie.
   *
   * Each unique set of values for the aggregation keys that you specify is a separate aggregation instance, with the value from each key contributing to the aggregation instance definition.
   *
   * For example, assume the rule evaluates web requests with the following IP address and HTTP method values:
   *
   * - IP address 10.1.1.1, HTTP method POST
   * - IP address 10.1.1.1, HTTP method GET
   * - IP address 127.0.0.0, HTTP method POST
   * - IP address 10.1.1.1, HTTP method GET
   *
   * The rule would create different aggregation instances according to your aggregation criteria, for example:
   *
   * - If the aggregation criteria is just the IP address, then each individual address is an aggregation instance, and AWS WAF counts requests separately for each. The aggregation instances and request counts for our example would be the following:
   *
   * - IP address 10.1.1.1: count 3
   * - IP address 127.0.0.0: count 1
   * - If the aggregation criteria is HTTP method, then each individual HTTP method is an aggregation instance. The aggregation instances and request counts for our example would be the following:
   *
   * - HTTP method POST: count 2
   * - HTTP method GET: count 2
   * - If the aggregation criteria is IP address and HTTP method, then each IP address and each HTTP method would contribute to the combined aggregation instance. The aggregation instances and request counts for our example would be the following:
   *
   * - IP address 10.1.1.1, HTTP method POST: count 1
   * - IP address 10.1.1.1, HTTP method GET: count 2
   * - IP address 127.0.0.0, HTTP method POST: count 1
   *
   * For any n-tuple of aggregation keys, each unique combination of values for the keys defines a separate aggregation instance, which AWS WAF counts and rate-limits individually.
   *
   * You can optionally nest another statement inside the rate-based statement, to narrow the scope of the rule so that it only counts and rate limits requests that match the nested statement. You can use this nested scope-down statement in conjunction with your aggregation key specifications or you can just count and rate limit all requests that match the scope-down statement, without additional aggregation. When you choose to just manage all requests that match a scope-down statement, the aggregation instance is singular for the rule.
   *
   * You cannot nest a `RateBasedStatement` inside another statement, for example inside a `NotStatement` or `OrStatement` . You can define a `RateBasedStatement` inside a web ACL and inside a rule group.
   *
   * For additional information about the options, see [Rate limiting web requests using rate-based rules](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rate-based-rules.html) in the *AWS WAF Developer Guide* .
   *
   * If you only aggregate on the individual IP address or forwarded IP address, you can retrieve the list of IP addresses that AWS WAF is currently rate limiting for a rule through the API call `GetRateBasedStatementManagedKeys` . This option is not available for other aggregation configurations.
   *
   * AWS WAF tracks and manages web requests separately for each instance of a rate-based rule that you use. For example, if you provide the same rate-based rule settings in two web ACLs, each of the two rule statements represents a separate instance of the rate-based rule and gets its own tracking and management by AWS WAF . If you define a rate-based rule inside a rule group, and then use that rule group in multiple places, each use creates a separate instance of the rate-based rule that gets its own tracking and management by AWS WAF .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatement.html
   */
  export interface RateBasedStatementProperty {
    /**
     * Setting that indicates how to aggregate the request counts.
     *
     * > Web requests that are missing any of the components specified in the aggregation keys are omitted from the rate-based rule evaluation and handling.
     *
     * - `CONSTANT` - Count and limit the requests that match the rate-based rule's scope-down statement. With this option, the counted requests aren't further aggregated. The scope-down statement is the only specification used. When the count of all requests that satisfy the scope-down statement goes over the limit, AWS WAF applies the rule action to all requests that satisfy the scope-down statement.
     *
     * With this option, you must configure the `ScopeDownStatement` property.
     * - `CUSTOM_KEYS` - Aggregate the request counts using one or more web request components as the aggregate keys.
     *
     * With this option, you must specify the aggregate keys in the `CustomKeys` property.
     *
     * To aggregate on only the IP address or only the forwarded IP address, don't use custom keys. Instead, set the aggregate key type to `IP` or `FORWARDED_IP` .
     * - `FORWARDED_IP` - Aggregate the request counts on the first IP address in an HTTP header.
     *
     * With this option, you must specify the header to use in the `ForwardedIPConfig` property.
     *
     * To aggregate on a combination of the forwarded IP address with other aggregate keys, use `CUSTOM_KEYS` .
     * - `IP` - Aggregate the request counts on the IP address from the web request origin.
     *
     * To aggregate on a combination of the IP address with other aggregate keys, use `CUSTOM_KEYS` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatement.html#cfn-wafv2-rulegroup-ratebasedstatement-aggregatekeytype
     */
    readonly aggregateKeyType: string;

    /**
     * Specifies the aggregate keys to use in a rate-base rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatement.html#cfn-wafv2-rulegroup-ratebasedstatement-customkeys
     */
    readonly customKeys?: Array<cdk.IResolvable | CfnRuleGroup.RateBasedStatementCustomKeyProperty> | cdk.IResolvable;

    /**
     * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin.
     *
     * Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * This is required if you specify a forwarded IP in the rule's aggregate key settings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatement.html#cfn-wafv2-rulegroup-ratebasedstatement-forwardedipconfig
     */
    readonly forwardedIpConfig?: CfnRuleGroup.ForwardedIPConfigurationProperty | cdk.IResolvable;

    /**
     * The limit on requests per 5-minute period for a single aggregation instance for the rate-based rule.
     *
     * If the rate-based statement includes a `ScopeDownStatement` , this limit is applied only to the requests that match the statement.
     *
     * Examples:
     *
     * - If you aggregate on just the IP address, this is the limit on requests from any single IP address.
     * - If you aggregate on the HTTP method and the query argument name "city", then this is the limit on requests for any single method, city pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatement.html#cfn-wafv2-rulegroup-ratebasedstatement-limit
     */
    readonly limit: number;

    /**
     * An optional nested statement that narrows the scope of the web requests that are evaluated and managed by the rate-based statement.
     *
     * When you use a scope-down statement, the rate-based rule only tracks and rate limits requests that match the scope-down statement. You can use any nestable `Statement` in the scope-down statement, and you can nest statements at any level, the same as you can for a rule statement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatement.html#cfn-wafv2-rulegroup-ratebasedstatement-scopedownstatement
     */
    readonly scopeDownStatement?: cdk.IResolvable | CfnRuleGroup.StatementProperty;
  }

  /**
   * Specifies a single custom aggregate key for a rate-base rule.
   *
   * > Web requests that are missing any of the components specified in the aggregation keys are omitted from the rate-based rule evaluation and handling.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatementcustomkey.html
   */
  export interface RateBasedStatementCustomKeyProperty {
    /**
     * Use the value of a cookie in the request as an aggregate key.
     *
     * Each distinct value in the cookie contributes to the aggregation instance. If you use a single cookie as your custom key, then each value fully defines an aggregation instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatementcustomkey.html#cfn-wafv2-rulegroup-ratebasedstatementcustomkey-cookie
     */
    readonly cookie?: cdk.IResolvable | CfnRuleGroup.RateLimitCookieProperty;

    /**
     * Use the first IP address in an HTTP header as an aggregate key.
     *
     * Each distinct forwarded IP address contributes to the aggregation instance.
     *
     * When you specify an IP or forwarded IP in the custom key settings, you must also specify at least one other key to use. You can aggregate on only the forwarded IP address by specifying `FORWARDED_IP` in your rate-based statement's `AggregateKeyType` .
     *
     * With this option, you must specify the header to use in the rate-based rule's `ForwardedIPConfig` property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatementcustomkey.html#cfn-wafv2-rulegroup-ratebasedstatementcustomkey-forwardedip
     */
    readonly forwardedIp?: any | cdk.IResolvable;

    /**
     * Use the value of a header in the request as an aggregate key.
     *
     * Each distinct value in the header contributes to the aggregation instance. If you use a single header as your custom key, then each value fully defines an aggregation instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatementcustomkey.html#cfn-wafv2-rulegroup-ratebasedstatementcustomkey-header
     */
    readonly header?: cdk.IResolvable | CfnRuleGroup.RateLimitHeaderProperty;

    /**
     * Use the request's HTTP method as an aggregate key.
     *
     * Each distinct HTTP method contributes to the aggregation instance. If you use just the HTTP method as your custom key, then each method fully defines an aggregation instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatementcustomkey.html#cfn-wafv2-rulegroup-ratebasedstatementcustomkey-httpmethod
     */
    readonly httpMethod?: any | cdk.IResolvable;

    /**
     * Use the request's originating IP address as an aggregate key. Each distinct IP address contributes to the aggregation instance.
     *
     * When you specify an IP or forwarded IP in the custom key settings, you must also specify at least one other key to use. You can aggregate on only the IP address by specifying `IP` in your rate-based statement's `AggregateKeyType` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatementcustomkey.html#cfn-wafv2-rulegroup-ratebasedstatementcustomkey-ip
     */
    readonly ip?: any | cdk.IResolvable;

    /**
     * Use the specified label namespace as an aggregate key.
     *
     * Each distinct fully qualified label name that has the specified label namespace contributes to the aggregation instance. If you use just one label namespace as your custom key, then each label name fully defines an aggregation instance.
     *
     * This uses only labels that have been added to the request by rules that are evaluated before this rate-based rule in the web ACL.
     *
     * For information about label namespaces and names, see [Label syntax and naming requirements](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-label-requirements.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatementcustomkey.html#cfn-wafv2-rulegroup-ratebasedstatementcustomkey-labelnamespace
     */
    readonly labelNamespace?: cdk.IResolvable | CfnRuleGroup.RateLimitLabelNamespaceProperty;

    /**
     * Use the specified query argument as an aggregate key.
     *
     * Each distinct value for the named query argument contributes to the aggregation instance. If you use a single query argument as your custom key, then each value fully defines an aggregation instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatementcustomkey.html#cfn-wafv2-rulegroup-ratebasedstatementcustomkey-queryargument
     */
    readonly queryArgument?: cdk.IResolvable | CfnRuleGroup.RateLimitQueryArgumentProperty;

    /**
     * Use the request's query string as an aggregate key.
     *
     * Each distinct string contributes to the aggregation instance. If you use just the query string as your custom key, then each string fully defines an aggregation instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatementcustomkey.html#cfn-wafv2-rulegroup-ratebasedstatementcustomkey-querystring
     */
    readonly queryString?: cdk.IResolvable | CfnRuleGroup.RateLimitQueryStringProperty;

    /**
     * Use the request's URI path as an aggregate key.
     *
     * Each distinct URI path contributes to the aggregation instance. If you use just the URI path as your custom key, then each URI path fully defines an aggregation instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatementcustomkey.html#cfn-wafv2-rulegroup-ratebasedstatementcustomkey-uripath
     */
    readonly uriPath?: cdk.IResolvable | CfnRuleGroup.RateLimitUriPathProperty;
  }

  /**
   * Specifies a cookie as an aggregate key for a rate-based rule.
   *
   * Each distinct value in the cookie contributes to the aggregation instance. If you use a single cookie as your custom key, then each value fully defines an aggregation instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratelimitcookie.html
   */
  export interface RateLimitCookieProperty {
    /**
     * The name of the cookie to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratelimitcookie.html#cfn-wafv2-rulegroup-ratelimitcookie-name
     */
    readonly name: string;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * Text transformations are used in rule match statements, to transform the `FieldToMatch` request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, AWS WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratelimitcookie.html#cfn-wafv2-rulegroup-ratelimitcookie-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnRuleGroup.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * Specifies a query argument in the request as an aggregate key for a rate-based rule.
   *
   * Each distinct value for the named query argument contributes to the aggregation instance. If you use a single query argument as your custom key, then each value fully defines an aggregation instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratelimitqueryargument.html
   */
  export interface RateLimitQueryArgumentProperty {
    /**
     * The name of the query argument to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratelimitqueryargument.html#cfn-wafv2-rulegroup-ratelimitqueryargument-name
     */
    readonly name: string;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * Text transformations are used in rule match statements, to transform the `FieldToMatch` request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, AWS WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratelimitqueryargument.html#cfn-wafv2-rulegroup-ratelimitqueryargument-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnRuleGroup.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * Specifies a header as an aggregate key for a rate-based rule.
   *
   * Each distinct value in the header contributes to the aggregation instance. If you use a single header as your custom key, then each value fully defines an aggregation instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratelimitheader.html
   */
  export interface RateLimitHeaderProperty {
    /**
     * The name of the header to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratelimitheader.html#cfn-wafv2-rulegroup-ratelimitheader-name
     */
    readonly name: string;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * Text transformations are used in rule match statements, to transform the `FieldToMatch` request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, AWS WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratelimitheader.html#cfn-wafv2-rulegroup-ratelimitheader-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnRuleGroup.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * Specifies the request's query string as an aggregate key for a rate-based rule.
   *
   * Each distinct string contributes to the aggregation instance. If you use just the query string as your custom key, then each string fully defines an aggregation instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratelimitquerystring.html
   */
  export interface RateLimitQueryStringProperty {
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * Text transformations are used in rule match statements, to transform the `FieldToMatch` request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, AWS WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratelimitquerystring.html#cfn-wafv2-rulegroup-ratelimitquerystring-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnRuleGroup.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * Specifies the request's URI path as an aggregate key for a rate-based rule.
   *
   * Each distinct URI path contributes to the aggregation instance. If you use just the URI path as your custom key, then each URI path fully defines an aggregation instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratelimituripath.html
   */
  export interface RateLimitUriPathProperty {
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * Text transformations are used in rule match statements, to transform the `FieldToMatch` request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, AWS WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratelimituripath.html#cfn-wafv2-rulegroup-ratelimituripath-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnRuleGroup.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * Specifies a label namespace to use as an aggregate key for a rate-based rule.
   *
   * Each distinct fully qualified label name that has the specified label namespace contributes to the aggregation instance. If you use just one label namespace as your custom key, then each label name fully defines an aggregation instance.
   *
   * This uses only labels that have been added to the request by rules that are evaluated before this rate-based rule in the web ACL.
   *
   * For information about label namespaces and names, see [Label syntax and naming requirements](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-label-requirements.html) in the *AWS WAF Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratelimitlabelnamespace.html
   */
  export interface RateLimitLabelNamespaceProperty {
    /**
     * The namespace to use for aggregation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratelimitlabelnamespace.html#cfn-wafv2-rulegroup-ratelimitlabelnamespace-namespace
     */
    readonly namespace: string;
  }

  /**
   * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin.
   *
   * Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
   *
   * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
   *
   * This configuration is used for `GeoMatchStatement` and `RateBasedStatement` . For `IPSetReferenceStatement` , use `IPSetForwardedIPConfig` instead.
   *
   * AWS WAF only evaluates the first IP address found in the specified HTTP header.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-forwardedipconfiguration.html
   */
  export interface ForwardedIPConfigurationProperty {
    /**
     * The match status to assign to the web request if the request doesn't have a valid IP address in the specified position.
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * You can specify the following fallback behaviors:
     *
     * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
     * - `NO_MATCH` - Treat the web request as not matching the rule statement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-forwardedipconfiguration.html#cfn-wafv2-rulegroup-forwardedipconfiguration-fallbackbehavior
     */
    readonly fallbackBehavior: string;

    /**
     * The name of the HTTP header to use for the IP address.
     *
     * For example, to use the X-Forwarded-For (XFF) header, set this to `X-Forwarded-For` .
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-forwardedipconfiguration.html#cfn-wafv2-rulegroup-forwardedipconfiguration-headername
     */
    readonly headerName: string;
  }

  /**
   * A rule statement that labels web requests by country and region and that matches against web requests based on country code.
   *
   * A geo match rule labels every request that it inspects regardless of whether it finds a match.
   *
   * - To manage requests only by country, you can use this statement by itself and specify the countries that you want to match against in the `CountryCodes` array.
   * - Otherwise, configure your geo match rule with Count action so that it only labels requests. Then, add one or more label match rules to run after the geo match rule and configure them to match against the geographic labels and handle the requests as needed.
   *
   * AWS WAF labels requests using the alpha-2 country and region codes from the International Organization for Standardization (ISO) 3166 standard. AWS WAF determines the codes using either the IP address in the web request origin or, if you specify it, the address in the geo match `ForwardedIPConfig` .
   *
   * If you use the web request origin, the label formats are `awswaf:clientip:geo:region:<ISO country code>-<ISO region code>` and `awswaf:clientip:geo:country:<ISO country code>` .
   *
   * If you use a forwarded IP address, the label formats are `awswaf:forwardedip:geo:region:<ISO country code>-<ISO region code>` and `awswaf:forwardedip:geo:country:<ISO country code>` .
   *
   * For additional details, see [Geographic match rule statement](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-geo-match.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-geomatchstatement.html
   */
  export interface GeoMatchStatementProperty {
    /**
     * An array of two-character country codes that you want to match against, for example, `[ "US", "CN" ]` , from the alpha-2 country ISO codes of the ISO 3166 international standard.
     *
     * When you use a geo match statement just for the region and country labels that it adds to requests, you still have to supply a country code for the rule to evaluate. In this case, you configure the rule to only count matching requests, but it will still generate logging and count metrics for any matches. You can reduce the logging and metrics that the rule produces by specifying a country that's unlikely to be a source of traffic to your site.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-geomatchstatement.html#cfn-wafv2-rulegroup-geomatchstatement-countrycodes
     */
    readonly countryCodes?: Array<string>;

    /**
     * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin.
     *
     * Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-geomatchstatement.html#cfn-wafv2-rulegroup-geomatchstatement-forwardedipconfig
     */
    readonly forwardedIpConfig?: CfnRuleGroup.ForwardedIPConfigurationProperty | cdk.IResolvable;
  }

  /**
   * A rule statement to match against labels that have been added to the web request by rules that have already run in the web ACL.
   *
   * The label match statement provides the label or namespace string to search for. The label string can represent a part or all of the fully qualified label name that had been added to the web request. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label. If you do not provide the fully qualified name in your label match string, AWS WAF performs the search for labels that were added in the same context as the label match statement.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-labelmatchstatement.html
   */
  export interface LabelMatchStatementProperty {
    /**
     * The string to match against. The setting you provide for this depends on the match statement's `Scope` setting:.
     *
     * - If the `Scope` indicates `LABEL` , then this specification must include the name and can include any number of preceding namespace specifications and prefix up to providing the fully qualified label name.
     * - If the `Scope` indicates `NAMESPACE` , then this specification can include any number of contiguous namespace strings, and can include the entire label namespace prefix from the rule group or web ACL where the label originates.
     *
     * Labels are case sensitive and components of a label must be separated by colon, for example `NS1:NS2:name` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-labelmatchstatement.html#cfn-wafv2-rulegroup-labelmatchstatement-key
     */
    readonly key: string;

    /**
     * Specify whether you want to match using the label name or just the namespace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-labelmatchstatement.html#cfn-wafv2-rulegroup-labelmatchstatement-scope
     */
    readonly scope: string;
  }

  /**
   * A rule statement used to search web request components for a match against a single regular expression.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexmatchstatement.html
   */
  export interface RegexMatchStatementProperty {
    /**
     * The part of the web request that you want AWS WAF to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexmatchstatement.html#cfn-wafv2-rulegroup-regexmatchstatement-fieldtomatch
     */
    readonly fieldToMatch: CfnRuleGroup.FieldToMatchProperty | cdk.IResolvable;

    /**
     * The string representing the regular expression.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexmatchstatement.html#cfn-wafv2-rulegroup-regexmatchstatement-regexstring
     */
    readonly regexString: string;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexmatchstatement.html#cfn-wafv2-rulegroup-regexmatchstatement-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnRuleGroup.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * A rule statement that inspects for malicious SQL code.
   *
   * Attackers insert malicious SQL code into web requests to do things like modify your database or extract data from it.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sqlimatchstatement.html
   */
  export interface SqliMatchStatementProperty {
    /**
     * The part of the web request that you want AWS WAF to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sqlimatchstatement.html#cfn-wafv2-rulegroup-sqlimatchstatement-fieldtomatch
     */
    readonly fieldToMatch: CfnRuleGroup.FieldToMatchProperty | cdk.IResolvable;

    /**
     * The sensitivity that you want AWS WAF to use to inspect for SQL injection attacks.
     *
     * `HIGH` detects more attacks, but might generate more false positives, especially if your web requests frequently contain unusual strings. For information about identifying and mitigating false positives, see [Testing and tuning](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html) in the *AWS WAF Developer Guide* .
     *
     * `LOW` is generally a better choice for resources that already have other protections against SQL injection attacks or that have a low tolerance for false positives.
     *
     * Default: `LOW`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sqlimatchstatement.html#cfn-wafv2-rulegroup-sqlimatchstatement-sensitivitylevel
     */
    readonly sensitivityLevel?: string;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sqlimatchstatement.html#cfn-wafv2-rulegroup-sqlimatchstatement-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnRuleGroup.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * A rule statement used to search web request components for matches with regular expressions.
   *
   * To use this, create a `RegexPatternSet` that specifies the expressions that you want to detect, then use the ARN of that set in this statement. A web request matches the pattern set rule statement if the request component matches any of the patterns in the set.
   *
   * Each regex pattern set rule statement references a regex pattern set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexpatternsetreferencestatement.html
   */
  export interface RegexPatternSetReferenceStatementProperty {
    /**
     * The Amazon Resource Name (ARN) of the `RegexPatternSet` that this statement references.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexpatternsetreferencestatement.html#cfn-wafv2-rulegroup-regexpatternsetreferencestatement-arn
     */
    readonly arn: string;

    /**
     * The part of the web request that you want AWS WAF to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexpatternsetreferencestatement.html#cfn-wafv2-rulegroup-regexpatternsetreferencestatement-fieldtomatch
     */
    readonly fieldToMatch: CfnRuleGroup.FieldToMatchProperty | cdk.IResolvable;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexpatternsetreferencestatement.html#cfn-wafv2-rulegroup-regexpatternsetreferencestatement-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnRuleGroup.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * A logical rule statement used to combine other rule statements with OR logic.
   *
   * You provide more than one `Statement` within the `OrStatement` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-orstatement.html
   */
  export interface OrStatementProperty {
    /**
     * The statements to combine with OR logic.
     *
     * You can use any statements that can be nested.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-orstatement.html#cfn-wafv2-rulegroup-orstatement-statements
     */
    readonly statements: Array<cdk.IResolvable | CfnRuleGroup.StatementProperty> | cdk.IResolvable;
  }

  /**
   * A rule statement used to detect web requests coming from particular IP addresses or address ranges.
   *
   * To use this, create an `IPSet` that specifies the addresses you want to detect, then use the ARN of that set in this statement.
   *
   * Each IP set rule statement references an IP set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ipsetreferencestatement.html
   */
  export interface IPSetReferenceStatementProperty {
    /**
     * The Amazon Resource Name (ARN) of the `IPSet` that this statement references.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ipsetreferencestatement.html#cfn-wafv2-rulegroup-ipsetreferencestatement-arn
     */
    readonly arn: string;

    /**
     * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin.
     *
     * Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ipsetreferencestatement.html#cfn-wafv2-rulegroup-ipsetreferencestatement-ipsetforwardedipconfig
     */
    readonly ipSetForwardedIpConfig?: CfnRuleGroup.IPSetForwardedIPConfigurationProperty | cdk.IResolvable;
  }

  /**
   * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin.
   *
   * Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
   *
   * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
   *
   * This configuration is used only for `IPSetReferenceStatement` . For `GeoMatchStatement` and `RateBasedStatement` , use `ForwardedIPConfig` instead.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ipsetforwardedipconfiguration.html
   */
  export interface IPSetForwardedIPConfigurationProperty {
    /**
     * The match status to assign to the web request if the request doesn't have a valid IP address in the specified position.
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * You can specify the following fallback behaviors:
     *
     * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
     * - `NO_MATCH` - Treat the web request as not matching the rule statement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ipsetforwardedipconfiguration.html#cfn-wafv2-rulegroup-ipsetforwardedipconfiguration-fallbackbehavior
     */
    readonly fallbackBehavior: string;

    /**
     * The name of the HTTP header to use for the IP address.
     *
     * For example, to use the X-Forwarded-For (XFF) header, set this to `X-Forwarded-For` .
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ipsetforwardedipconfiguration.html#cfn-wafv2-rulegroup-ipsetforwardedipconfiguration-headername
     */
    readonly headerName: string;

    /**
     * The position in the header to search for the IP address.
     *
     * The header can contain IP addresses of the original client and also of proxies. For example, the header value could be `10.1.1.1, 127.0.0.0, 10.10.10.10` where the first IP address identifies the original client and the rest identify proxies that the request went through.
     *
     * The options for this setting are the following:
     *
     * - FIRST - Inspect the first IP address in the list of IP addresses in the header. This is usually the client's original IP.
     * - LAST - Inspect the last IP address in the list of IP addresses in the header.
     * - ANY - Inspect all IP addresses in the header for a match. If the header contains more than 10 IP addresses, AWS WAF inspects the last 10.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ipsetforwardedipconfiguration.html#cfn-wafv2-rulegroup-ipsetforwardedipconfiguration-position
     */
    readonly position: string;
  }

  /**
   * Specifies how AWS WAF should handle `Challenge` evaluations.
   *
   * This is available at the web ACL level and in each rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-challengeconfig.html
   */
  export interface ChallengeConfigProperty {
    /**
     * Determines how long a challenge timestamp in the token remains valid after the client successfully responds to a challenge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-challengeconfig.html#cfn-wafv2-rulegroup-challengeconfig-immunitytimeproperty
     */
    readonly immunityTimeProperty?: CfnRuleGroup.ImmunityTimePropertyProperty | cdk.IResolvable;
  }

  /**
   * Used for CAPTCHA and challenge token settings.
   *
   * Determines how long a `CAPTCHA` or challenge timestamp remains valid after AWS WAF updates it for a successful `CAPTCHA` or challenge response.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-immunitytimeproperty.html
   */
  export interface ImmunityTimePropertyProperty {
    /**
     * The amount of time, in seconds, that a `CAPTCHA` or challenge timestamp is considered valid by AWS WAF .
     *
     * The default setting is 300.
     *
     * For the Challenge action, the minimum setting is 300.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-immunitytimeproperty.html#cfn-wafv2-rulegroup-immunitytimeproperty-immunitytime
     */
    readonly immunityTime: number;
  }

  /**
   * A single label container.
   *
   * This is used as an element of a label array in `RuleLabels` inside a rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-label.html
   */
  export interface LabelProperty {
    /**
     * The label string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-label.html#cfn-wafv2-rulegroup-label-name
     */
    readonly name: string;
  }

  /**
   * Defines and enables Amazon CloudWatch metrics and web request sample collection.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-visibilityconfig.html
   */
  export interface VisibilityConfigProperty {
    /**
     * Indicates whether the associated resource sends metrics to Amazon CloudWatch.
     *
     * For the list of available metrics, see [AWS WAF Metrics](https://docs.aws.amazon.com/waf/latest/developerguide/monitoring-cloudwatch.html#waf-metrics) in the *AWS WAF Developer Guide* .
     *
     * For web ACLs, the metrics are for web requests that have the web ACL default action applied. AWS WAF applies the default action to web requests that pass the inspection of all rules in the web ACL without being either allowed or blocked. For more information,
     * see [The web ACL default action](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-default-action.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-visibilityconfig.html#cfn-wafv2-rulegroup-visibilityconfig-cloudwatchmetricsenabled
     */
    readonly cloudWatchMetricsEnabled: boolean | cdk.IResolvable;

    /**
     * A name of the Amazon CloudWatch metric dimension.
     *
     * The name can contain only the characters: A-Z, a-z, 0-9, - (hyphen), and _ (underscore). The name can be from one to 128 characters long. It can't contain whitespace or metric names that are reserved for AWS WAF , for example `All` and `Default_Action` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-visibilityconfig.html#cfn-wafv2-rulegroup-visibilityconfig-metricname
     */
    readonly metricName: string;

    /**
     * Indicates whether AWS WAF should store a sampling of the web requests that match the rules.
     *
     * You can view the sampled requests through the AWS WAF console.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-visibilityconfig.html#cfn-wafv2-rulegroup-visibilityconfig-sampledrequestsenabled
     */
    readonly sampledRequestsEnabled: boolean | cdk.IResolvable;
  }

  /**
   * Specifies how AWS WAF should handle `CAPTCHA` evaluations.
   *
   * This is available at the web ACL level and in each rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-captchaconfig.html
   */
  export interface CaptchaConfigProperty {
    /**
     * Determines how long a `CAPTCHA` timestamp in the token remains valid after the client successfully solves a `CAPTCHA` puzzle.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-captchaconfig.html#cfn-wafv2-rulegroup-captchaconfig-immunitytimeproperty
     */
    readonly immunityTimeProperty?: CfnRuleGroup.ImmunityTimePropertyProperty | cdk.IResolvable;
  }

  /**
   * A custom header for custom request and response handling.
   *
   * This is used in `CustomResponse` and `CustomRequestHandling`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customhttpheader.html
   */
  export interface CustomHTTPHeaderProperty {
    /**
     * The name of the custom header.
     *
     * For custom request header insertion, when AWS WAF inserts the header into the request, it prefixes this name `x-amzn-waf-` , to avoid confusion with the headers that are already in the request. For example, for the header name `sample` , AWS WAF inserts the header `x-amzn-waf-sample` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customhttpheader.html#cfn-wafv2-rulegroup-customhttpheader-name
     */
    readonly name: string;

    /**
     * The value of the custom header.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customhttpheader.html#cfn-wafv2-rulegroup-customhttpheader-value
     */
    readonly value: string;
  }

  /**
   * Custom request handling behavior that inserts custom headers into a web request.
   *
   * You can add custom request handling for AWS WAF to use when the rule action doesn't block the request. For example, `CaptchaAction` for requests with valid t okens, and `AllowAction` .
   *
   * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the *AWS WAF Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customrequesthandling.html
   */
  export interface CustomRequestHandlingProperty {
    /**
     * The HTTP headers to insert into the request. Duplicate header names are not allowed.
     *
     * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customrequesthandling.html#cfn-wafv2-rulegroup-customrequesthandling-insertheaders
     */
    readonly insertHeaders: Array<CfnRuleGroup.CustomHTTPHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * A custom response to send to the client.
   *
   * You can define a custom response for rule actions and default web ACL actions that are set to `Block` .
   *
   * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF developer guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customresponse.html
   */
  export interface CustomResponseProperty {
    /**
     * References the response body that you want AWS WAF to return to the web request client.
     *
     * You can define a custom response for a rule action or a default web ACL action that is set to block. To do this, you first define the response body key and value in the `CustomResponseBodies` setting for the `WebACL` or `RuleGroup` where you want to use it. Then, in the rule action or web ACL default action `BlockAction` setting, you reference the response body using this key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customresponse.html#cfn-wafv2-rulegroup-customresponse-customresponsebodykey
     */
    readonly customResponseBodyKey?: string;

    /**
     * The HTTP status code to return to the client.
     *
     * For a list of status codes that you can use in your custom responses, see [Supported status codes for custom response](https://docs.aws.amazon.com/waf/latest/developerguide/customizing-the-response-status-codes.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customresponse.html#cfn-wafv2-rulegroup-customresponse-responsecode
     */
    readonly responseCode: number;

    /**
     * The HTTP headers to use in the response.
     *
     * You can specify any header name except for `content-type` . Duplicate header names are not allowed.
     *
     * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customresponse.html#cfn-wafv2-rulegroup-customresponse-responseheaders
     */
    readonly responseHeaders?: Array<CfnRuleGroup.CustomHTTPHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Inspect one of the headers in the web request, identified by name, for example, `User-Agent` or `Referer` .
   *
   * The name isn't case sensitive.
   *
   * You can filter and inspect all headers with the `FieldToMatch` setting `Headers` .
   *
   * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
   *
   * Example JSON: `"SingleHeader": { "Name": "haystack" }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-singleheader.html
   */
  export interface SingleHeaderProperty {
    /**
     * The name of the query header to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-singleheader.html#cfn-wafv2-rulegroup-singleheader-name
     */
    readonly name: string;
  }

  /**
   * Inspect one query argument in the web request, identified by name, for example *UserName* or *SalesRegion* .
   *
   * The name isn't case sensitive.
   *
   * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
   *
   * Example JSON: `"SingleQueryArgument": { "Name": "myArgument" }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-singlequeryargument.html
   */
  export interface SingleQueryArgumentProperty {
    /**
     * The name of the query argument to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-singlequeryargument.html#cfn-wafv2-rulegroup-singlequeryargument-name
     */
    readonly name: string;
  }

  /**
   * Allow traffic towards application.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-allow.html
   */
  export interface AllowProperty {
    /**
     * Custom request handling.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-allow.html#cfn-wafv2-rulegroup-allow-customrequesthandling
     */
    readonly customRequestHandling?: CfnRuleGroup.CustomRequestHandlingProperty | cdk.IResolvable;
  }

  /**
   * Block traffic towards application.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-block.html
   */
  export interface BlockProperty {
    /**
     * Custom response.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-block.html#cfn-wafv2-rulegroup-block-customresponse
     */
    readonly customResponse?: CfnRuleGroup.CustomResponseProperty | cdk.IResolvable;
  }

  /**
   * Checks valid token exists with request.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-captcha.html
   */
  export interface CaptchaProperty {
    /**
     * Custom request handling.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-captcha.html#cfn-wafv2-rulegroup-captcha-customrequesthandling
     */
    readonly customRequestHandling?: CfnRuleGroup.CustomRequestHandlingProperty | cdk.IResolvable;
  }

  /**
   * Checks that the request has a valid token with an unexpired challenge timestamp and, if not, returns a browser challenge to the client.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-challenge.html
   */
  export interface ChallengeProperty {
    /**
     * Custom request handling.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-challenge.html#cfn-wafv2-rulegroup-challenge-customrequesthandling
     */
    readonly customRequestHandling?: CfnRuleGroup.CustomRequestHandlingProperty | cdk.IResolvable;
  }

  /**
   * Count traffic towards application.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-count.html
   */
  export interface CountProperty {
    /**
     * Custom request handling.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-count.html#cfn-wafv2-rulegroup-count-customrequesthandling
     */
    readonly customRequestHandling?: CfnRuleGroup.CustomRequestHandlingProperty | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnRuleGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html
 */
export interface CfnRuleGroupProps {
  /**
   * The labels that one or more rules in this rule group add to matching web requests.
   *
   * These labels are defined in the `RuleLabels` for a `Rule` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-availablelabels
   */
  readonly availableLabels?: Array<cdk.IResolvable | CfnRuleGroup.LabelSummaryProperty> | cdk.IResolvable;

  /**
   * The web ACL capacity units (WCUs) required for this rule group.
   *
   * When you create your own rule group, you define this, and you cannot change it after creation. When you add or modify the rules in a rule group, AWS WAF enforces this limit.
   *
   * AWS WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. AWS WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. The WCU limit for web ACLs is 1,500.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-capacity
   */
  readonly capacity: number;

  /**
   * The labels that one or more rules in this rule group match against in label match statements.
   *
   * These labels are defined in a `LabelMatchStatement` specification, in the `Statement` definition of a rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-consumedlabels
   */
  readonly consumedLabels?: Array<cdk.IResolvable | CfnRuleGroup.LabelSummaryProperty> | cdk.IResolvable;

  /**
   * A map of custom response keys and content bodies.
   *
   * When you create a rule with a block action, you can send a custom response to the web request. You define these for the rule group, and then use them in the rules that you define in the rule group.
   *
   * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the *AWS WAF Developer Guide* .
   *
   * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the *AWS WAF Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-customresponsebodies
   */
  readonly customResponseBodies?: cdk.IResolvable | Record<string, CfnRuleGroup.CustomResponseBodyProperty | cdk.IResolvable>;

  /**
   * A description of the rule group that helps with identification.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-description
   */
  readonly description?: string;

  /**
   * The name of the rule group.
   *
   * You cannot change the name of a rule group after you create it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-name
   */
  readonly name?: string;

  /**
   * The rule statements used to identify the web requests that you want to allow, block, or count.
   *
   * Each rule includes one top-level statement that AWS WAF uses to identify matching web requests, and parameters that govern how AWS WAF handles them.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-rules
   */
  readonly rules?: Array<cdk.IResolvable | CfnRuleGroup.RuleProperty> | cdk.IResolvable;

  /**
   * Specifies whether this is for an Amazon CloudFront distribution or for a regional application.
   *
   * A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AWS AppSync GraphQL API, an Amazon Cognito user pool, an AWS App Runner service, or an AWS Verified Access instance. Valid Values are `CLOUDFRONT` and `REGIONAL` .
   *
   * > For `CLOUDFRONT` , you must create your WAFv2 resources in the US East (N. Virginia) Region, `us-east-1` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-scope
   */
  readonly scope: string;

  /**
   * Key:value pairs associated with an AWS resource.
   *
   * The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
   *
   * > To modify tags on existing resources, use the AWS WAF APIs or command line interface. With AWS CloudFormation , you can only add tags to AWS WAF resources during resource creation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Defines and enables Amazon CloudWatch metrics and web request sample collection.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-visibilityconfig
   */
  readonly visibilityConfig: cdk.IResolvable | CfnRuleGroup.VisibilityConfigProperty;
}

/**
 * Determine whether the given properties match those of a `LabelSummaryProperty`
 *
 * @param properties - the TypeScript properties of a `LabelSummaryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupLabelSummaryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"LabelSummaryProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupLabelSummaryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupLabelSummaryPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupLabelSummaryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.LabelSummaryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.LabelSummaryProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomResponseBodyProperty`
 *
 * @param properties - the TypeScript properties of a `CustomResponseBodyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupCustomResponseBodyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("content", cdk.requiredValidator)(properties.content));
  errors.collect(cdk.propertyValidator("content", cdk.validateString)(properties.content));
  errors.collect(cdk.propertyValidator("contentType", cdk.requiredValidator)(properties.contentType));
  errors.collect(cdk.propertyValidator("contentType", cdk.validateString)(properties.contentType));
  return errors.wrap("supplied properties not correct for \"CustomResponseBodyProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupCustomResponseBodyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupCustomResponseBodyPropertyValidator(properties).assertSuccess();
  return {
    "Content": cdk.stringToCloudFormation(properties.content),
    "ContentType": cdk.stringToCloudFormation(properties.contentType)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupCustomResponseBodyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CustomResponseBodyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CustomResponseBodyProperty>();
  ret.addPropertyResult("content", "Content", (properties.Content != null ? cfn_parse.FromCloudFormation.getString(properties.Content) : undefined));
  ret.addPropertyResult("contentType", "ContentType", (properties.ContentType != null ? cfn_parse.FromCloudFormation.getString(properties.ContentType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleActionProperty`
 *
 * @param properties - the TypeScript properties of a `RuleActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRuleActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allow", cdk.validateObject)(properties.allow));
  errors.collect(cdk.propertyValidator("block", cdk.validateObject)(properties.block));
  errors.collect(cdk.propertyValidator("captcha", cdk.validateObject)(properties.captcha));
  errors.collect(cdk.propertyValidator("challenge", cdk.validateObject)(properties.challenge));
  errors.collect(cdk.propertyValidator("count", cdk.validateObject)(properties.count));
  return errors.wrap("supplied properties not correct for \"RuleActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRuleActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRuleActionPropertyValidator(properties).assertSuccess();
  return {
    "Allow": cdk.objectToCloudFormation(properties.allow),
    "Block": cdk.objectToCloudFormation(properties.block),
    "Captcha": cdk.objectToCloudFormation(properties.captcha),
    "Challenge": cdk.objectToCloudFormation(properties.challenge),
    "Count": cdk.objectToCloudFormation(properties.count)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRuleActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RuleActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RuleActionProperty>();
  ret.addPropertyResult("allow", "Allow", (properties.Allow != null ? cfn_parse.FromCloudFormation.getAny(properties.Allow) : undefined));
  ret.addPropertyResult("block", "Block", (properties.Block != null ? cfn_parse.FromCloudFormation.getAny(properties.Block) : undefined));
  ret.addPropertyResult("captcha", "Captcha", (properties.Captcha != null ? cfn_parse.FromCloudFormation.getAny(properties.Captcha) : undefined));
  ret.addPropertyResult("challenge", "Challenge", (properties.Challenge != null ? cfn_parse.FromCloudFormation.getAny(properties.Challenge) : undefined));
  ret.addPropertyResult("count", "Count", (properties.Count != null ? cfn_parse.FromCloudFormation.getAny(properties.Count) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TextTransformationProperty`
 *
 * @param properties - the TypeScript properties of a `TextTransformationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupTextTransformationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("priority", cdk.requiredValidator)(properties.priority));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"TextTransformationProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupTextTransformationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupTextTransformationPropertyValidator(properties).assertSuccess();
  return {
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupTextTransformationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.TextTransformationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.TextTransformationProperty>();
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JsonMatchPatternProperty`
 *
 * @param properties - the TypeScript properties of a `JsonMatchPatternProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupJsonMatchPatternPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("all", cdk.validateObject)(properties.all));
  errors.collect(cdk.propertyValidator("includedPaths", cdk.listValidator(cdk.validateString))(properties.includedPaths));
  return errors.wrap("supplied properties not correct for \"JsonMatchPatternProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupJsonMatchPatternPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupJsonMatchPatternPropertyValidator(properties).assertSuccess();
  return {
    "All": cdk.objectToCloudFormation(properties.all),
    "IncludedPaths": cdk.listMapper(cdk.stringToCloudFormation)(properties.includedPaths)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupJsonMatchPatternPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.JsonMatchPatternProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.JsonMatchPatternProperty>();
  ret.addPropertyResult("all", "All", (properties.All != null ? cfn_parse.FromCloudFormation.getAny(properties.All) : undefined));
  ret.addPropertyResult("includedPaths", "IncludedPaths", (properties.IncludedPaths != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludedPaths) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JsonBodyProperty`
 *
 * @param properties - the TypeScript properties of a `JsonBodyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupJsonBodyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("invalidFallbackBehavior", cdk.validateString)(properties.invalidFallbackBehavior));
  errors.collect(cdk.propertyValidator("matchPattern", cdk.requiredValidator)(properties.matchPattern));
  errors.collect(cdk.propertyValidator("matchPattern", CfnRuleGroupJsonMatchPatternPropertyValidator)(properties.matchPattern));
  errors.collect(cdk.propertyValidator("matchScope", cdk.requiredValidator)(properties.matchScope));
  errors.collect(cdk.propertyValidator("matchScope", cdk.validateString)(properties.matchScope));
  errors.collect(cdk.propertyValidator("oversizeHandling", cdk.validateString)(properties.oversizeHandling));
  return errors.wrap("supplied properties not correct for \"JsonBodyProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupJsonBodyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupJsonBodyPropertyValidator(properties).assertSuccess();
  return {
    "InvalidFallbackBehavior": cdk.stringToCloudFormation(properties.invalidFallbackBehavior),
    "MatchPattern": convertCfnRuleGroupJsonMatchPatternPropertyToCloudFormation(properties.matchPattern),
    "MatchScope": cdk.stringToCloudFormation(properties.matchScope),
    "OversizeHandling": cdk.stringToCloudFormation(properties.oversizeHandling)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupJsonBodyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.JsonBodyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.JsonBodyProperty>();
  ret.addPropertyResult("invalidFallbackBehavior", "InvalidFallbackBehavior", (properties.InvalidFallbackBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.InvalidFallbackBehavior) : undefined));
  ret.addPropertyResult("matchPattern", "MatchPattern", (properties.MatchPattern != null ? CfnRuleGroupJsonMatchPatternPropertyFromCloudFormation(properties.MatchPattern) : undefined));
  ret.addPropertyResult("matchScope", "MatchScope", (properties.MatchScope != null ? cfn_parse.FromCloudFormation.getString(properties.MatchScope) : undefined));
  ret.addPropertyResult("oversizeHandling", "OversizeHandling", (properties.OversizeHandling != null ? cfn_parse.FromCloudFormation.getString(properties.OversizeHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HeaderMatchPatternProperty`
 *
 * @param properties - the TypeScript properties of a `HeaderMatchPatternProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupHeaderMatchPatternPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("all", cdk.validateObject)(properties.all));
  errors.collect(cdk.propertyValidator("excludedHeaders", cdk.listValidator(cdk.validateString))(properties.excludedHeaders));
  errors.collect(cdk.propertyValidator("includedHeaders", cdk.listValidator(cdk.validateString))(properties.includedHeaders));
  return errors.wrap("supplied properties not correct for \"HeaderMatchPatternProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupHeaderMatchPatternPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupHeaderMatchPatternPropertyValidator(properties).assertSuccess();
  return {
    "All": cdk.objectToCloudFormation(properties.all),
    "ExcludedHeaders": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedHeaders),
    "IncludedHeaders": cdk.listMapper(cdk.stringToCloudFormation)(properties.includedHeaders)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupHeaderMatchPatternPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.HeaderMatchPatternProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.HeaderMatchPatternProperty>();
  ret.addPropertyResult("all", "All", (properties.All != null ? cfn_parse.FromCloudFormation.getAny(properties.All) : undefined));
  ret.addPropertyResult("excludedHeaders", "ExcludedHeaders", (properties.ExcludedHeaders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludedHeaders) : undefined));
  ret.addPropertyResult("includedHeaders", "IncludedHeaders", (properties.IncludedHeaders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludedHeaders) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HeadersProperty`
 *
 * @param properties - the TypeScript properties of a `HeadersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupHeadersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("matchPattern", cdk.requiredValidator)(properties.matchPattern));
  errors.collect(cdk.propertyValidator("matchPattern", CfnRuleGroupHeaderMatchPatternPropertyValidator)(properties.matchPattern));
  errors.collect(cdk.propertyValidator("matchScope", cdk.requiredValidator)(properties.matchScope));
  errors.collect(cdk.propertyValidator("matchScope", cdk.validateString)(properties.matchScope));
  errors.collect(cdk.propertyValidator("oversizeHandling", cdk.requiredValidator)(properties.oversizeHandling));
  errors.collect(cdk.propertyValidator("oversizeHandling", cdk.validateString)(properties.oversizeHandling));
  return errors.wrap("supplied properties not correct for \"HeadersProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupHeadersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupHeadersPropertyValidator(properties).assertSuccess();
  return {
    "MatchPattern": convertCfnRuleGroupHeaderMatchPatternPropertyToCloudFormation(properties.matchPattern),
    "MatchScope": cdk.stringToCloudFormation(properties.matchScope),
    "OversizeHandling": cdk.stringToCloudFormation(properties.oversizeHandling)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupHeadersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.HeadersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.HeadersProperty>();
  ret.addPropertyResult("matchPattern", "MatchPattern", (properties.MatchPattern != null ? CfnRuleGroupHeaderMatchPatternPropertyFromCloudFormation(properties.MatchPattern) : undefined));
  ret.addPropertyResult("matchScope", "MatchScope", (properties.MatchScope != null ? cfn_parse.FromCloudFormation.getString(properties.MatchScope) : undefined));
  ret.addPropertyResult("oversizeHandling", "OversizeHandling", (properties.OversizeHandling != null ? cfn_parse.FromCloudFormation.getString(properties.OversizeHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CookieMatchPatternProperty`
 *
 * @param properties - the TypeScript properties of a `CookieMatchPatternProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupCookieMatchPatternPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("all", cdk.validateObject)(properties.all));
  errors.collect(cdk.propertyValidator("excludedCookies", cdk.listValidator(cdk.validateString))(properties.excludedCookies));
  errors.collect(cdk.propertyValidator("includedCookies", cdk.listValidator(cdk.validateString))(properties.includedCookies));
  return errors.wrap("supplied properties not correct for \"CookieMatchPatternProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupCookieMatchPatternPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupCookieMatchPatternPropertyValidator(properties).assertSuccess();
  return {
    "All": cdk.objectToCloudFormation(properties.all),
    "ExcludedCookies": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedCookies),
    "IncludedCookies": cdk.listMapper(cdk.stringToCloudFormation)(properties.includedCookies)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupCookieMatchPatternPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CookieMatchPatternProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CookieMatchPatternProperty>();
  ret.addPropertyResult("all", "All", (properties.All != null ? cfn_parse.FromCloudFormation.getAny(properties.All) : undefined));
  ret.addPropertyResult("excludedCookies", "ExcludedCookies", (properties.ExcludedCookies != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludedCookies) : undefined));
  ret.addPropertyResult("includedCookies", "IncludedCookies", (properties.IncludedCookies != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludedCookies) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CookiesProperty`
 *
 * @param properties - the TypeScript properties of a `CookiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupCookiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("matchPattern", cdk.requiredValidator)(properties.matchPattern));
  errors.collect(cdk.propertyValidator("matchPattern", CfnRuleGroupCookieMatchPatternPropertyValidator)(properties.matchPattern));
  errors.collect(cdk.propertyValidator("matchScope", cdk.requiredValidator)(properties.matchScope));
  errors.collect(cdk.propertyValidator("matchScope", cdk.validateString)(properties.matchScope));
  errors.collect(cdk.propertyValidator("oversizeHandling", cdk.requiredValidator)(properties.oversizeHandling));
  errors.collect(cdk.propertyValidator("oversizeHandling", cdk.validateString)(properties.oversizeHandling));
  return errors.wrap("supplied properties not correct for \"CookiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupCookiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupCookiesPropertyValidator(properties).assertSuccess();
  return {
    "MatchPattern": convertCfnRuleGroupCookieMatchPatternPropertyToCloudFormation(properties.matchPattern),
    "MatchScope": cdk.stringToCloudFormation(properties.matchScope),
    "OversizeHandling": cdk.stringToCloudFormation(properties.oversizeHandling)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupCookiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CookiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CookiesProperty>();
  ret.addPropertyResult("matchPattern", "MatchPattern", (properties.MatchPattern != null ? CfnRuleGroupCookieMatchPatternPropertyFromCloudFormation(properties.MatchPattern) : undefined));
  ret.addPropertyResult("matchScope", "MatchScope", (properties.MatchScope != null ? cfn_parse.FromCloudFormation.getString(properties.MatchScope) : undefined));
  ret.addPropertyResult("oversizeHandling", "OversizeHandling", (properties.OversizeHandling != null ? cfn_parse.FromCloudFormation.getString(properties.OversizeHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BodyProperty`
 *
 * @param properties - the TypeScript properties of a `BodyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupBodyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("oversizeHandling", cdk.validateString)(properties.oversizeHandling));
  return errors.wrap("supplied properties not correct for \"BodyProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupBodyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupBodyPropertyValidator(properties).assertSuccess();
  return {
    "OversizeHandling": cdk.stringToCloudFormation(properties.oversizeHandling)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupBodyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.BodyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.BodyProperty>();
  ret.addPropertyResult("oversizeHandling", "OversizeHandling", (properties.OversizeHandling != null ? cfn_parse.FromCloudFormation.getString(properties.OversizeHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupFieldToMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allQueryArguments", cdk.validateObject)(properties.allQueryArguments));
  errors.collect(cdk.propertyValidator("body", CfnRuleGroupBodyPropertyValidator)(properties.body));
  errors.collect(cdk.propertyValidator("cookies", CfnRuleGroupCookiesPropertyValidator)(properties.cookies));
  errors.collect(cdk.propertyValidator("headers", CfnRuleGroupHeadersPropertyValidator)(properties.headers));
  errors.collect(cdk.propertyValidator("jsonBody", CfnRuleGroupJsonBodyPropertyValidator)(properties.jsonBody));
  errors.collect(cdk.propertyValidator("method", cdk.validateObject)(properties.method));
  errors.collect(cdk.propertyValidator("queryString", cdk.validateObject)(properties.queryString));
  errors.collect(cdk.propertyValidator("singleHeader", cdk.validateObject)(properties.singleHeader));
  errors.collect(cdk.propertyValidator("singleQueryArgument", cdk.validateObject)(properties.singleQueryArgument));
  errors.collect(cdk.propertyValidator("uriPath", cdk.validateObject)(properties.uriPath));
  return errors.wrap("supplied properties not correct for \"FieldToMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupFieldToMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupFieldToMatchPropertyValidator(properties).assertSuccess();
  return {
    "AllQueryArguments": cdk.objectToCloudFormation(properties.allQueryArguments),
    "Body": convertCfnRuleGroupBodyPropertyToCloudFormation(properties.body),
    "Cookies": convertCfnRuleGroupCookiesPropertyToCloudFormation(properties.cookies),
    "Headers": convertCfnRuleGroupHeadersPropertyToCloudFormation(properties.headers),
    "JsonBody": convertCfnRuleGroupJsonBodyPropertyToCloudFormation(properties.jsonBody),
    "Method": cdk.objectToCloudFormation(properties.method),
    "QueryString": cdk.objectToCloudFormation(properties.queryString),
    "SingleHeader": cdk.objectToCloudFormation(properties.singleHeader),
    "SingleQueryArgument": cdk.objectToCloudFormation(properties.singleQueryArgument),
    "UriPath": cdk.objectToCloudFormation(properties.uriPath)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupFieldToMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.FieldToMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.FieldToMatchProperty>();
  ret.addPropertyResult("allQueryArguments", "AllQueryArguments", (properties.AllQueryArguments != null ? cfn_parse.FromCloudFormation.getAny(properties.AllQueryArguments) : undefined));
  ret.addPropertyResult("body", "Body", (properties.Body != null ? CfnRuleGroupBodyPropertyFromCloudFormation(properties.Body) : undefined));
  ret.addPropertyResult("cookies", "Cookies", (properties.Cookies != null ? CfnRuleGroupCookiesPropertyFromCloudFormation(properties.Cookies) : undefined));
  ret.addPropertyResult("headers", "Headers", (properties.Headers != null ? CfnRuleGroupHeadersPropertyFromCloudFormation(properties.Headers) : undefined));
  ret.addPropertyResult("jsonBody", "JsonBody", (properties.JsonBody != null ? CfnRuleGroupJsonBodyPropertyFromCloudFormation(properties.JsonBody) : undefined));
  ret.addPropertyResult("method", "Method", (properties.Method != null ? cfn_parse.FromCloudFormation.getAny(properties.Method) : undefined));
  ret.addPropertyResult("queryString", "QueryString", (properties.QueryString != null ? cfn_parse.FromCloudFormation.getAny(properties.QueryString) : undefined));
  ret.addPropertyResult("singleHeader", "SingleHeader", (properties.SingleHeader != null ? cfn_parse.FromCloudFormation.getAny(properties.SingleHeader) : undefined));
  ret.addPropertyResult("singleQueryArgument", "SingleQueryArgument", (properties.SingleQueryArgument != null ? cfn_parse.FromCloudFormation.getAny(properties.SingleQueryArgument) : undefined));
  ret.addPropertyResult("uriPath", "UriPath", (properties.UriPath != null ? cfn_parse.FromCloudFormation.getAny(properties.UriPath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SizeConstraintStatementProperty`
 *
 * @param properties - the TypeScript properties of a `SizeConstraintStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupSizeConstraintStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.requiredValidator)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.validateString)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnRuleGroupFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("size", cdk.requiredValidator)(properties.size));
  errors.collect(cdk.propertyValidator("size", cdk.validateNumber)(properties.size));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnRuleGroupTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"SizeConstraintStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupSizeConstraintStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupSizeConstraintStatementPropertyValidator(properties).assertSuccess();
  return {
    "ComparisonOperator": cdk.stringToCloudFormation(properties.comparisonOperator),
    "FieldToMatch": convertCfnRuleGroupFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "Size": cdk.numberToCloudFormation(properties.size),
    "TextTransformations": cdk.listMapper(convertCfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupSizeConstraintStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.SizeConstraintStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.SizeConstraintStatementProperty>();
  ret.addPropertyResult("comparisonOperator", "ComparisonOperator", (properties.ComparisonOperator != null ? cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator) : undefined));
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnRuleGroupFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("size", "Size", (properties.Size != null ? cfn_parse.FromCloudFormation.getNumber(properties.Size) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AndStatementProperty`
 *
 * @param properties - the TypeScript properties of a `AndStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupAndStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("statements", cdk.requiredValidator)(properties.statements));
  errors.collect(cdk.propertyValidator("statements", cdk.listValidator(CfnRuleGroupStatementPropertyValidator))(properties.statements));
  return errors.wrap("supplied properties not correct for \"AndStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupAndStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupAndStatementPropertyValidator(properties).assertSuccess();
  return {
    "Statements": cdk.listMapper(convertCfnRuleGroupStatementPropertyToCloudFormation)(properties.statements)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupAndStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.AndStatementProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.AndStatementProperty>();
  ret.addPropertyResult("statements", "Statements", (properties.Statements != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupStatementPropertyFromCloudFormation)(properties.Statements) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `XssMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `XssMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupXssMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnRuleGroupFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnRuleGroupTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"XssMatchStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupXssMatchStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupXssMatchStatementPropertyValidator(properties).assertSuccess();
  return {
    "FieldToMatch": convertCfnRuleGroupFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "TextTransformations": cdk.listMapper(convertCfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupXssMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.XssMatchStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.XssMatchStatementProperty>();
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnRuleGroupFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NotStatementProperty`
 *
 * @param properties - the TypeScript properties of a `NotStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupNotStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("statement", cdk.requiredValidator)(properties.statement));
  errors.collect(cdk.propertyValidator("statement", CfnRuleGroupStatementPropertyValidator)(properties.statement));
  return errors.wrap("supplied properties not correct for \"NotStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupNotStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupNotStatementPropertyValidator(properties).assertSuccess();
  return {
    "Statement": convertCfnRuleGroupStatementPropertyToCloudFormation(properties.statement)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupNotStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.NotStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.NotStatementProperty>();
  ret.addPropertyResult("statement", "Statement", (properties.Statement != null ? CfnRuleGroupStatementPropertyFromCloudFormation(properties.Statement) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ByteMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `ByteMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupByteMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnRuleGroupFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("positionalConstraint", cdk.requiredValidator)(properties.positionalConstraint));
  errors.collect(cdk.propertyValidator("positionalConstraint", cdk.validateString)(properties.positionalConstraint));
  errors.collect(cdk.propertyValidator("searchString", cdk.validateString)(properties.searchString));
  errors.collect(cdk.propertyValidator("searchStringBase64", cdk.validateString)(properties.searchStringBase64));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnRuleGroupTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"ByteMatchStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupByteMatchStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupByteMatchStatementPropertyValidator(properties).assertSuccess();
  return {
    "FieldToMatch": convertCfnRuleGroupFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "PositionalConstraint": cdk.stringToCloudFormation(properties.positionalConstraint),
    "SearchString": cdk.stringToCloudFormation(properties.searchString),
    "SearchStringBase64": cdk.stringToCloudFormation(properties.searchStringBase64),
    "TextTransformations": cdk.listMapper(convertCfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupByteMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.ByteMatchStatementProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.ByteMatchStatementProperty>();
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnRuleGroupFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("positionalConstraint", "PositionalConstraint", (properties.PositionalConstraint != null ? cfn_parse.FromCloudFormation.getString(properties.PositionalConstraint) : undefined));
  ret.addPropertyResult("searchString", "SearchString", (properties.SearchString != null ? cfn_parse.FromCloudFormation.getString(properties.SearchString) : undefined));
  ret.addPropertyResult("searchStringBase64", "SearchStringBase64", (properties.SearchStringBase64 != null ? cfn_parse.FromCloudFormation.getString(properties.SearchStringBase64) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateLimitCookieProperty`
 *
 * @param properties - the TypeScript properties of a `RateLimitCookieProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRateLimitCookiePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnRuleGroupTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"RateLimitCookieProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRateLimitCookiePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRateLimitCookiePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "TextTransformations": cdk.listMapper(convertCfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRateLimitCookiePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RateLimitCookieProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RateLimitCookieProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateLimitQueryArgumentProperty`
 *
 * @param properties - the TypeScript properties of a `RateLimitQueryArgumentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRateLimitQueryArgumentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnRuleGroupTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"RateLimitQueryArgumentProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRateLimitQueryArgumentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRateLimitQueryArgumentPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "TextTransformations": cdk.listMapper(convertCfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRateLimitQueryArgumentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RateLimitQueryArgumentProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RateLimitQueryArgumentProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateLimitHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `RateLimitHeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRateLimitHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnRuleGroupTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"RateLimitHeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRateLimitHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRateLimitHeaderPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "TextTransformations": cdk.listMapper(convertCfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRateLimitHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RateLimitHeaderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RateLimitHeaderProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateLimitQueryStringProperty`
 *
 * @param properties - the TypeScript properties of a `RateLimitQueryStringProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRateLimitQueryStringPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnRuleGroupTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"RateLimitQueryStringProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRateLimitQueryStringPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRateLimitQueryStringPropertyValidator(properties).assertSuccess();
  return {
    "TextTransformations": cdk.listMapper(convertCfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRateLimitQueryStringPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RateLimitQueryStringProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RateLimitQueryStringProperty>();
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateLimitUriPathProperty`
 *
 * @param properties - the TypeScript properties of a `RateLimitUriPathProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRateLimitUriPathPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnRuleGroupTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"RateLimitUriPathProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRateLimitUriPathPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRateLimitUriPathPropertyValidator(properties).assertSuccess();
  return {
    "TextTransformations": cdk.listMapper(convertCfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRateLimitUriPathPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RateLimitUriPathProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RateLimitUriPathProperty>();
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateLimitLabelNamespaceProperty`
 *
 * @param properties - the TypeScript properties of a `RateLimitLabelNamespaceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRateLimitLabelNamespacePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("namespace", cdk.requiredValidator)(properties.namespace));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  return errors.wrap("supplied properties not correct for \"RateLimitLabelNamespaceProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRateLimitLabelNamespacePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRateLimitLabelNamespacePropertyValidator(properties).assertSuccess();
  return {
    "Namespace": cdk.stringToCloudFormation(properties.namespace)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRateLimitLabelNamespacePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RateLimitLabelNamespaceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RateLimitLabelNamespaceProperty>();
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateBasedStatementCustomKeyProperty`
 *
 * @param properties - the TypeScript properties of a `RateBasedStatementCustomKeyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRateBasedStatementCustomKeyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cookie", CfnRuleGroupRateLimitCookiePropertyValidator)(properties.cookie));
  errors.collect(cdk.propertyValidator("forwardedIp", cdk.validateObject)(properties.forwardedIp));
  errors.collect(cdk.propertyValidator("httpMethod", cdk.validateObject)(properties.httpMethod));
  errors.collect(cdk.propertyValidator("header", CfnRuleGroupRateLimitHeaderPropertyValidator)(properties.header));
  errors.collect(cdk.propertyValidator("ip", cdk.validateObject)(properties.ip));
  errors.collect(cdk.propertyValidator("labelNamespace", CfnRuleGroupRateLimitLabelNamespacePropertyValidator)(properties.labelNamespace));
  errors.collect(cdk.propertyValidator("queryArgument", CfnRuleGroupRateLimitQueryArgumentPropertyValidator)(properties.queryArgument));
  errors.collect(cdk.propertyValidator("queryString", CfnRuleGroupRateLimitQueryStringPropertyValidator)(properties.queryString));
  errors.collect(cdk.propertyValidator("uriPath", CfnRuleGroupRateLimitUriPathPropertyValidator)(properties.uriPath));
  return errors.wrap("supplied properties not correct for \"RateBasedStatementCustomKeyProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRateBasedStatementCustomKeyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRateBasedStatementCustomKeyPropertyValidator(properties).assertSuccess();
  return {
    "Cookie": convertCfnRuleGroupRateLimitCookiePropertyToCloudFormation(properties.cookie),
    "ForwardedIP": cdk.objectToCloudFormation(properties.forwardedIp),
    "HTTPMethod": cdk.objectToCloudFormation(properties.httpMethod),
    "Header": convertCfnRuleGroupRateLimitHeaderPropertyToCloudFormation(properties.header),
    "IP": cdk.objectToCloudFormation(properties.ip),
    "LabelNamespace": convertCfnRuleGroupRateLimitLabelNamespacePropertyToCloudFormation(properties.labelNamespace),
    "QueryArgument": convertCfnRuleGroupRateLimitQueryArgumentPropertyToCloudFormation(properties.queryArgument),
    "QueryString": convertCfnRuleGroupRateLimitQueryStringPropertyToCloudFormation(properties.queryString),
    "UriPath": convertCfnRuleGroupRateLimitUriPathPropertyToCloudFormation(properties.uriPath)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRateBasedStatementCustomKeyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RateBasedStatementCustomKeyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RateBasedStatementCustomKeyProperty>();
  ret.addPropertyResult("cookie", "Cookie", (properties.Cookie != null ? CfnRuleGroupRateLimitCookiePropertyFromCloudFormation(properties.Cookie) : undefined));
  ret.addPropertyResult("forwardedIp", "ForwardedIP", (properties.ForwardedIP != null ? cfn_parse.FromCloudFormation.getAny(properties.ForwardedIP) : undefined));
  ret.addPropertyResult("header", "Header", (properties.Header != null ? CfnRuleGroupRateLimitHeaderPropertyFromCloudFormation(properties.Header) : undefined));
  ret.addPropertyResult("httpMethod", "HTTPMethod", (properties.HTTPMethod != null ? cfn_parse.FromCloudFormation.getAny(properties.HTTPMethod) : undefined));
  ret.addPropertyResult("ip", "IP", (properties.IP != null ? cfn_parse.FromCloudFormation.getAny(properties.IP) : undefined));
  ret.addPropertyResult("labelNamespace", "LabelNamespace", (properties.LabelNamespace != null ? CfnRuleGroupRateLimitLabelNamespacePropertyFromCloudFormation(properties.LabelNamespace) : undefined));
  ret.addPropertyResult("queryArgument", "QueryArgument", (properties.QueryArgument != null ? CfnRuleGroupRateLimitQueryArgumentPropertyFromCloudFormation(properties.QueryArgument) : undefined));
  ret.addPropertyResult("queryString", "QueryString", (properties.QueryString != null ? CfnRuleGroupRateLimitQueryStringPropertyFromCloudFormation(properties.QueryString) : undefined));
  ret.addPropertyResult("uriPath", "UriPath", (properties.UriPath != null ? CfnRuleGroupRateLimitUriPathPropertyFromCloudFormation(properties.UriPath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ForwardedIPConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ForwardedIPConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupForwardedIPConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fallbackBehavior", cdk.requiredValidator)(properties.fallbackBehavior));
  errors.collect(cdk.propertyValidator("fallbackBehavior", cdk.validateString)(properties.fallbackBehavior));
  errors.collect(cdk.propertyValidator("headerName", cdk.requiredValidator)(properties.headerName));
  errors.collect(cdk.propertyValidator("headerName", cdk.validateString)(properties.headerName));
  return errors.wrap("supplied properties not correct for \"ForwardedIPConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupForwardedIPConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupForwardedIPConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "FallbackBehavior": cdk.stringToCloudFormation(properties.fallbackBehavior),
    "HeaderName": cdk.stringToCloudFormation(properties.headerName)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupForwardedIPConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.ForwardedIPConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.ForwardedIPConfigurationProperty>();
  ret.addPropertyResult("fallbackBehavior", "FallbackBehavior", (properties.FallbackBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.FallbackBehavior) : undefined));
  ret.addPropertyResult("headerName", "HeaderName", (properties.HeaderName != null ? cfn_parse.FromCloudFormation.getString(properties.HeaderName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateBasedStatementProperty`
 *
 * @param properties - the TypeScript properties of a `RateBasedStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRateBasedStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aggregateKeyType", cdk.requiredValidator)(properties.aggregateKeyType));
  errors.collect(cdk.propertyValidator("aggregateKeyType", cdk.validateString)(properties.aggregateKeyType));
  errors.collect(cdk.propertyValidator("customKeys", cdk.listValidator(CfnRuleGroupRateBasedStatementCustomKeyPropertyValidator))(properties.customKeys));
  errors.collect(cdk.propertyValidator("forwardedIpConfig", CfnRuleGroupForwardedIPConfigurationPropertyValidator)(properties.forwardedIpConfig));
  errors.collect(cdk.propertyValidator("limit", cdk.requiredValidator)(properties.limit));
  errors.collect(cdk.propertyValidator("limit", cdk.validateNumber)(properties.limit));
  errors.collect(cdk.propertyValidator("scopeDownStatement", CfnRuleGroupStatementPropertyValidator)(properties.scopeDownStatement));
  return errors.wrap("supplied properties not correct for \"RateBasedStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRateBasedStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRateBasedStatementPropertyValidator(properties).assertSuccess();
  return {
    "AggregateKeyType": cdk.stringToCloudFormation(properties.aggregateKeyType),
    "CustomKeys": cdk.listMapper(convertCfnRuleGroupRateBasedStatementCustomKeyPropertyToCloudFormation)(properties.customKeys),
    "ForwardedIPConfig": convertCfnRuleGroupForwardedIPConfigurationPropertyToCloudFormation(properties.forwardedIpConfig),
    "Limit": cdk.numberToCloudFormation(properties.limit),
    "ScopeDownStatement": convertCfnRuleGroupStatementPropertyToCloudFormation(properties.scopeDownStatement)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRateBasedStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RateBasedStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RateBasedStatementProperty>();
  ret.addPropertyResult("aggregateKeyType", "AggregateKeyType", (properties.AggregateKeyType != null ? cfn_parse.FromCloudFormation.getString(properties.AggregateKeyType) : undefined));
  ret.addPropertyResult("customKeys", "CustomKeys", (properties.CustomKeys != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupRateBasedStatementCustomKeyPropertyFromCloudFormation)(properties.CustomKeys) : undefined));
  ret.addPropertyResult("forwardedIpConfig", "ForwardedIPConfig", (properties.ForwardedIPConfig != null ? CfnRuleGroupForwardedIPConfigurationPropertyFromCloudFormation(properties.ForwardedIPConfig) : undefined));
  ret.addPropertyResult("limit", "Limit", (properties.Limit != null ? cfn_parse.FromCloudFormation.getNumber(properties.Limit) : undefined));
  ret.addPropertyResult("scopeDownStatement", "ScopeDownStatement", (properties.ScopeDownStatement != null ? CfnRuleGroupStatementPropertyFromCloudFormation(properties.ScopeDownStatement) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GeoMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `GeoMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupGeoMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("countryCodes", cdk.listValidator(cdk.validateString))(properties.countryCodes));
  errors.collect(cdk.propertyValidator("forwardedIpConfig", CfnRuleGroupForwardedIPConfigurationPropertyValidator)(properties.forwardedIpConfig));
  return errors.wrap("supplied properties not correct for \"GeoMatchStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupGeoMatchStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupGeoMatchStatementPropertyValidator(properties).assertSuccess();
  return {
    "CountryCodes": cdk.listMapper(cdk.stringToCloudFormation)(properties.countryCodes),
    "ForwardedIPConfig": convertCfnRuleGroupForwardedIPConfigurationPropertyToCloudFormation(properties.forwardedIpConfig)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupGeoMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.GeoMatchStatementProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.GeoMatchStatementProperty>();
  ret.addPropertyResult("countryCodes", "CountryCodes", (properties.CountryCodes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CountryCodes) : undefined));
  ret.addPropertyResult("forwardedIpConfig", "ForwardedIPConfig", (properties.ForwardedIPConfig != null ? CfnRuleGroupForwardedIPConfigurationPropertyFromCloudFormation(properties.ForwardedIPConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LabelMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `LabelMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupLabelMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("scope", cdk.requiredValidator)(properties.scope));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  return errors.wrap("supplied properties not correct for \"LabelMatchStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupLabelMatchStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupLabelMatchStatementPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Scope": cdk.stringToCloudFormation(properties.scope)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupLabelMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.LabelMatchStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.LabelMatchStatementProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RegexMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `RegexMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRegexMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnRuleGroupFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("regexString", cdk.requiredValidator)(properties.regexString));
  errors.collect(cdk.propertyValidator("regexString", cdk.validateString)(properties.regexString));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnRuleGroupTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"RegexMatchStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRegexMatchStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRegexMatchStatementPropertyValidator(properties).assertSuccess();
  return {
    "FieldToMatch": convertCfnRuleGroupFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "RegexString": cdk.stringToCloudFormation(properties.regexString),
    "TextTransformations": cdk.listMapper(convertCfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRegexMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RegexMatchStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RegexMatchStatementProperty>();
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnRuleGroupFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("regexString", "RegexString", (properties.RegexString != null ? cfn_parse.FromCloudFormation.getString(properties.RegexString) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SqliMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `SqliMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupSqliMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnRuleGroupFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("sensitivityLevel", cdk.validateString)(properties.sensitivityLevel));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnRuleGroupTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"SqliMatchStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupSqliMatchStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupSqliMatchStatementPropertyValidator(properties).assertSuccess();
  return {
    "FieldToMatch": convertCfnRuleGroupFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "SensitivityLevel": cdk.stringToCloudFormation(properties.sensitivityLevel),
    "TextTransformations": cdk.listMapper(convertCfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupSqliMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.SqliMatchStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.SqliMatchStatementProperty>();
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnRuleGroupFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("sensitivityLevel", "SensitivityLevel", (properties.SensitivityLevel != null ? cfn_parse.FromCloudFormation.getString(properties.SensitivityLevel) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RegexPatternSetReferenceStatementProperty`
 *
 * @param properties - the TypeScript properties of a `RegexPatternSetReferenceStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRegexPatternSetReferenceStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.requiredValidator)(properties.arn));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnRuleGroupFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnRuleGroupTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"RegexPatternSetReferenceStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRegexPatternSetReferenceStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRegexPatternSetReferenceStatementPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "FieldToMatch": convertCfnRuleGroupFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "TextTransformations": cdk.listMapper(convertCfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRegexPatternSetReferenceStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RegexPatternSetReferenceStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RegexPatternSetReferenceStatementProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnRuleGroupFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OrStatementProperty`
 *
 * @param properties - the TypeScript properties of a `OrStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupOrStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("statements", cdk.requiredValidator)(properties.statements));
  errors.collect(cdk.propertyValidator("statements", cdk.listValidator(CfnRuleGroupStatementPropertyValidator))(properties.statements));
  return errors.wrap("supplied properties not correct for \"OrStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupOrStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupOrStatementPropertyValidator(properties).assertSuccess();
  return {
    "Statements": cdk.listMapper(convertCfnRuleGroupStatementPropertyToCloudFormation)(properties.statements)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupOrStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.OrStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.OrStatementProperty>();
  ret.addPropertyResult("statements", "Statements", (properties.Statements != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupStatementPropertyFromCloudFormation)(properties.Statements) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IPSetForwardedIPConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetForwardedIPConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupIPSetForwardedIPConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fallbackBehavior", cdk.requiredValidator)(properties.fallbackBehavior));
  errors.collect(cdk.propertyValidator("fallbackBehavior", cdk.validateString)(properties.fallbackBehavior));
  errors.collect(cdk.propertyValidator("headerName", cdk.requiredValidator)(properties.headerName));
  errors.collect(cdk.propertyValidator("headerName", cdk.validateString)(properties.headerName));
  errors.collect(cdk.propertyValidator("position", cdk.requiredValidator)(properties.position));
  errors.collect(cdk.propertyValidator("position", cdk.validateString)(properties.position));
  return errors.wrap("supplied properties not correct for \"IPSetForwardedIPConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupIPSetForwardedIPConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupIPSetForwardedIPConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "FallbackBehavior": cdk.stringToCloudFormation(properties.fallbackBehavior),
    "HeaderName": cdk.stringToCloudFormation(properties.headerName),
    "Position": cdk.stringToCloudFormation(properties.position)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupIPSetForwardedIPConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.IPSetForwardedIPConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.IPSetForwardedIPConfigurationProperty>();
  ret.addPropertyResult("fallbackBehavior", "FallbackBehavior", (properties.FallbackBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.FallbackBehavior) : undefined));
  ret.addPropertyResult("headerName", "HeaderName", (properties.HeaderName != null ? cfn_parse.FromCloudFormation.getString(properties.HeaderName) : undefined));
  ret.addPropertyResult("position", "Position", (properties.Position != null ? cfn_parse.FromCloudFormation.getString(properties.Position) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IPSetReferenceStatementProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetReferenceStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupIPSetReferenceStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.requiredValidator)(properties.arn));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("ipSetForwardedIpConfig", CfnRuleGroupIPSetForwardedIPConfigurationPropertyValidator)(properties.ipSetForwardedIpConfig));
  return errors.wrap("supplied properties not correct for \"IPSetReferenceStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupIPSetReferenceStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupIPSetReferenceStatementPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "IPSetForwardedIPConfig": convertCfnRuleGroupIPSetForwardedIPConfigurationPropertyToCloudFormation(properties.ipSetForwardedIpConfig)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupIPSetReferenceStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.IPSetReferenceStatementProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.IPSetReferenceStatementProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addPropertyResult("ipSetForwardedIpConfig", "IPSetForwardedIPConfig", (properties.IPSetForwardedIPConfig != null ? CfnRuleGroupIPSetForwardedIPConfigurationPropertyFromCloudFormation(properties.IPSetForwardedIPConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StatementProperty`
 *
 * @param properties - the TypeScript properties of a `StatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("andStatement", CfnRuleGroupAndStatementPropertyValidator)(properties.andStatement));
  errors.collect(cdk.propertyValidator("byteMatchStatement", CfnRuleGroupByteMatchStatementPropertyValidator)(properties.byteMatchStatement));
  errors.collect(cdk.propertyValidator("geoMatchStatement", CfnRuleGroupGeoMatchStatementPropertyValidator)(properties.geoMatchStatement));
  errors.collect(cdk.propertyValidator("ipSetReferenceStatement", CfnRuleGroupIPSetReferenceStatementPropertyValidator)(properties.ipSetReferenceStatement));
  errors.collect(cdk.propertyValidator("labelMatchStatement", CfnRuleGroupLabelMatchStatementPropertyValidator)(properties.labelMatchStatement));
  errors.collect(cdk.propertyValidator("notStatement", CfnRuleGroupNotStatementPropertyValidator)(properties.notStatement));
  errors.collect(cdk.propertyValidator("orStatement", CfnRuleGroupOrStatementPropertyValidator)(properties.orStatement));
  errors.collect(cdk.propertyValidator("rateBasedStatement", CfnRuleGroupRateBasedStatementPropertyValidator)(properties.rateBasedStatement));
  errors.collect(cdk.propertyValidator("regexMatchStatement", CfnRuleGroupRegexMatchStatementPropertyValidator)(properties.regexMatchStatement));
  errors.collect(cdk.propertyValidator("regexPatternSetReferenceStatement", CfnRuleGroupRegexPatternSetReferenceStatementPropertyValidator)(properties.regexPatternSetReferenceStatement));
  errors.collect(cdk.propertyValidator("sizeConstraintStatement", CfnRuleGroupSizeConstraintStatementPropertyValidator)(properties.sizeConstraintStatement));
  errors.collect(cdk.propertyValidator("sqliMatchStatement", CfnRuleGroupSqliMatchStatementPropertyValidator)(properties.sqliMatchStatement));
  errors.collect(cdk.propertyValidator("xssMatchStatement", CfnRuleGroupXssMatchStatementPropertyValidator)(properties.xssMatchStatement));
  return errors.wrap("supplied properties not correct for \"StatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupStatementPropertyValidator(properties).assertSuccess();
  return {
    "AndStatement": convertCfnRuleGroupAndStatementPropertyToCloudFormation(properties.andStatement),
    "ByteMatchStatement": convertCfnRuleGroupByteMatchStatementPropertyToCloudFormation(properties.byteMatchStatement),
    "GeoMatchStatement": convertCfnRuleGroupGeoMatchStatementPropertyToCloudFormation(properties.geoMatchStatement),
    "IPSetReferenceStatement": convertCfnRuleGroupIPSetReferenceStatementPropertyToCloudFormation(properties.ipSetReferenceStatement),
    "LabelMatchStatement": convertCfnRuleGroupLabelMatchStatementPropertyToCloudFormation(properties.labelMatchStatement),
    "NotStatement": convertCfnRuleGroupNotStatementPropertyToCloudFormation(properties.notStatement),
    "OrStatement": convertCfnRuleGroupOrStatementPropertyToCloudFormation(properties.orStatement),
    "RateBasedStatement": convertCfnRuleGroupRateBasedStatementPropertyToCloudFormation(properties.rateBasedStatement),
    "RegexMatchStatement": convertCfnRuleGroupRegexMatchStatementPropertyToCloudFormation(properties.regexMatchStatement),
    "RegexPatternSetReferenceStatement": convertCfnRuleGroupRegexPatternSetReferenceStatementPropertyToCloudFormation(properties.regexPatternSetReferenceStatement),
    "SizeConstraintStatement": convertCfnRuleGroupSizeConstraintStatementPropertyToCloudFormation(properties.sizeConstraintStatement),
    "SqliMatchStatement": convertCfnRuleGroupSqliMatchStatementPropertyToCloudFormation(properties.sqliMatchStatement),
    "XssMatchStatement": convertCfnRuleGroupXssMatchStatementPropertyToCloudFormation(properties.xssMatchStatement)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.StatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.StatementProperty>();
  ret.addPropertyResult("andStatement", "AndStatement", (properties.AndStatement != null ? CfnRuleGroupAndStatementPropertyFromCloudFormation(properties.AndStatement) : undefined));
  ret.addPropertyResult("byteMatchStatement", "ByteMatchStatement", (properties.ByteMatchStatement != null ? CfnRuleGroupByteMatchStatementPropertyFromCloudFormation(properties.ByteMatchStatement) : undefined));
  ret.addPropertyResult("geoMatchStatement", "GeoMatchStatement", (properties.GeoMatchStatement != null ? CfnRuleGroupGeoMatchStatementPropertyFromCloudFormation(properties.GeoMatchStatement) : undefined));
  ret.addPropertyResult("ipSetReferenceStatement", "IPSetReferenceStatement", (properties.IPSetReferenceStatement != null ? CfnRuleGroupIPSetReferenceStatementPropertyFromCloudFormation(properties.IPSetReferenceStatement) : undefined));
  ret.addPropertyResult("labelMatchStatement", "LabelMatchStatement", (properties.LabelMatchStatement != null ? CfnRuleGroupLabelMatchStatementPropertyFromCloudFormation(properties.LabelMatchStatement) : undefined));
  ret.addPropertyResult("notStatement", "NotStatement", (properties.NotStatement != null ? CfnRuleGroupNotStatementPropertyFromCloudFormation(properties.NotStatement) : undefined));
  ret.addPropertyResult("orStatement", "OrStatement", (properties.OrStatement != null ? CfnRuleGroupOrStatementPropertyFromCloudFormation(properties.OrStatement) : undefined));
  ret.addPropertyResult("rateBasedStatement", "RateBasedStatement", (properties.RateBasedStatement != null ? CfnRuleGroupRateBasedStatementPropertyFromCloudFormation(properties.RateBasedStatement) : undefined));
  ret.addPropertyResult("regexMatchStatement", "RegexMatchStatement", (properties.RegexMatchStatement != null ? CfnRuleGroupRegexMatchStatementPropertyFromCloudFormation(properties.RegexMatchStatement) : undefined));
  ret.addPropertyResult("regexPatternSetReferenceStatement", "RegexPatternSetReferenceStatement", (properties.RegexPatternSetReferenceStatement != null ? CfnRuleGroupRegexPatternSetReferenceStatementPropertyFromCloudFormation(properties.RegexPatternSetReferenceStatement) : undefined));
  ret.addPropertyResult("sizeConstraintStatement", "SizeConstraintStatement", (properties.SizeConstraintStatement != null ? CfnRuleGroupSizeConstraintStatementPropertyFromCloudFormation(properties.SizeConstraintStatement) : undefined));
  ret.addPropertyResult("sqliMatchStatement", "SqliMatchStatement", (properties.SqliMatchStatement != null ? CfnRuleGroupSqliMatchStatementPropertyFromCloudFormation(properties.SqliMatchStatement) : undefined));
  ret.addPropertyResult("xssMatchStatement", "XssMatchStatement", (properties.XssMatchStatement != null ? CfnRuleGroupXssMatchStatementPropertyFromCloudFormation(properties.XssMatchStatement) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ImmunityTimePropertyProperty`
 *
 * @param properties - the TypeScript properties of a `ImmunityTimePropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupImmunityTimePropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("immunityTime", cdk.requiredValidator)(properties.immunityTime));
  errors.collect(cdk.propertyValidator("immunityTime", cdk.validateNumber)(properties.immunityTime));
  return errors.wrap("supplied properties not correct for \"ImmunityTimePropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupImmunityTimePropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupImmunityTimePropertyPropertyValidator(properties).assertSuccess();
  return {
    "ImmunityTime": cdk.numberToCloudFormation(properties.immunityTime)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupImmunityTimePropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.ImmunityTimePropertyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.ImmunityTimePropertyProperty>();
  ret.addPropertyResult("immunityTime", "ImmunityTime", (properties.ImmunityTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.ImmunityTime) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ChallengeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ChallengeConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupChallengeConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("immunityTimeProperty", CfnRuleGroupImmunityTimePropertyPropertyValidator)(properties.immunityTimeProperty));
  return errors.wrap("supplied properties not correct for \"ChallengeConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupChallengeConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupChallengeConfigPropertyValidator(properties).assertSuccess();
  return {
    "ImmunityTimeProperty": convertCfnRuleGroupImmunityTimePropertyPropertyToCloudFormation(properties.immunityTimeProperty)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupChallengeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.ChallengeConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.ChallengeConfigProperty>();
  ret.addPropertyResult("immunityTimeProperty", "ImmunityTimeProperty", (properties.ImmunityTimeProperty != null ? CfnRuleGroupImmunityTimePropertyPropertyFromCloudFormation(properties.ImmunityTimeProperty) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LabelProperty`
 *
 * @param properties - the TypeScript properties of a `LabelProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupLabelPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"LabelProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupLabelPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupLabelPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupLabelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.LabelProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.LabelProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VisibilityConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VisibilityConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupVisibilityConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchMetricsEnabled", cdk.requiredValidator)(properties.cloudWatchMetricsEnabled));
  errors.collect(cdk.propertyValidator("cloudWatchMetricsEnabled", cdk.validateBoolean)(properties.cloudWatchMetricsEnabled));
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("sampledRequestsEnabled", cdk.requiredValidator)(properties.sampledRequestsEnabled));
  errors.collect(cdk.propertyValidator("sampledRequestsEnabled", cdk.validateBoolean)(properties.sampledRequestsEnabled));
  return errors.wrap("supplied properties not correct for \"VisibilityConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupVisibilityConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupVisibilityConfigPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchMetricsEnabled": cdk.booleanToCloudFormation(properties.cloudWatchMetricsEnabled),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "SampledRequestsEnabled": cdk.booleanToCloudFormation(properties.sampledRequestsEnabled)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupVisibilityConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.VisibilityConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.VisibilityConfigProperty>();
  ret.addPropertyResult("cloudWatchMetricsEnabled", "CloudWatchMetricsEnabled", (properties.CloudWatchMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CloudWatchMetricsEnabled) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("sampledRequestsEnabled", "SampledRequestsEnabled", (properties.SampledRequestsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SampledRequestsEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CaptchaConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CaptchaConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupCaptchaConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("immunityTimeProperty", CfnRuleGroupImmunityTimePropertyPropertyValidator)(properties.immunityTimeProperty));
  return errors.wrap("supplied properties not correct for \"CaptchaConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupCaptchaConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupCaptchaConfigPropertyValidator(properties).assertSuccess();
  return {
    "ImmunityTimeProperty": convertCfnRuleGroupImmunityTimePropertyPropertyToCloudFormation(properties.immunityTimeProperty)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupCaptchaConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CaptchaConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CaptchaConfigProperty>();
  ret.addPropertyResult("immunityTimeProperty", "ImmunityTimeProperty", (properties.ImmunityTimeProperty != null ? CfnRuleGroupImmunityTimePropertyPropertyFromCloudFormation(properties.ImmunityTimeProperty) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", CfnRuleGroupRuleActionPropertyValidator)(properties.action));
  errors.collect(cdk.propertyValidator("captchaConfig", CfnRuleGroupCaptchaConfigPropertyValidator)(properties.captchaConfig));
  errors.collect(cdk.propertyValidator("challengeConfig", CfnRuleGroupChallengeConfigPropertyValidator)(properties.challengeConfig));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("priority", cdk.requiredValidator)(properties.priority));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("ruleLabels", cdk.listValidator(CfnRuleGroupLabelPropertyValidator))(properties.ruleLabels));
  errors.collect(cdk.propertyValidator("statement", cdk.requiredValidator)(properties.statement));
  errors.collect(cdk.propertyValidator("statement", CfnRuleGroupStatementPropertyValidator)(properties.statement));
  errors.collect(cdk.propertyValidator("visibilityConfig", cdk.requiredValidator)(properties.visibilityConfig));
  errors.collect(cdk.propertyValidator("visibilityConfig", CfnRuleGroupVisibilityConfigPropertyValidator)(properties.visibilityConfig));
  return errors.wrap("supplied properties not correct for \"RuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupRulePropertyValidator(properties).assertSuccess();
  return {
    "Action": convertCfnRuleGroupRuleActionPropertyToCloudFormation(properties.action),
    "CaptchaConfig": convertCfnRuleGroupCaptchaConfigPropertyToCloudFormation(properties.captchaConfig),
    "ChallengeConfig": convertCfnRuleGroupChallengeConfigPropertyToCloudFormation(properties.challengeConfig),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "RuleLabels": cdk.listMapper(convertCfnRuleGroupLabelPropertyToCloudFormation)(properties.ruleLabels),
    "Statement": convertCfnRuleGroupStatementPropertyToCloudFormation(properties.statement),
    "VisibilityConfig": convertCfnRuleGroupVisibilityConfigPropertyToCloudFormation(properties.visibilityConfig)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.RuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RuleProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? CfnRuleGroupRuleActionPropertyFromCloudFormation(properties.Action) : undefined));
  ret.addPropertyResult("captchaConfig", "CaptchaConfig", (properties.CaptchaConfig != null ? CfnRuleGroupCaptchaConfigPropertyFromCloudFormation(properties.CaptchaConfig) : undefined));
  ret.addPropertyResult("challengeConfig", "ChallengeConfig", (properties.ChallengeConfig != null ? CfnRuleGroupChallengeConfigPropertyFromCloudFormation(properties.ChallengeConfig) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("ruleLabels", "RuleLabels", (properties.RuleLabels != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupLabelPropertyFromCloudFormation)(properties.RuleLabels) : undefined));
  ret.addPropertyResult("statement", "Statement", (properties.Statement != null ? CfnRuleGroupStatementPropertyFromCloudFormation(properties.Statement) : undefined));
  ret.addPropertyResult("visibilityConfig", "VisibilityConfig", (properties.VisibilityConfig != null ? CfnRuleGroupVisibilityConfigPropertyFromCloudFormation(properties.VisibilityConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRuleGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnRuleGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availableLabels", cdk.listValidator(CfnRuleGroupLabelSummaryPropertyValidator))(properties.availableLabels));
  errors.collect(cdk.propertyValidator("capacity", cdk.requiredValidator)(properties.capacity));
  errors.collect(cdk.propertyValidator("capacity", cdk.validateNumber)(properties.capacity));
  errors.collect(cdk.propertyValidator("consumedLabels", cdk.listValidator(CfnRuleGroupLabelSummaryPropertyValidator))(properties.consumedLabels));
  errors.collect(cdk.propertyValidator("customResponseBodies", cdk.hashValidator(CfnRuleGroupCustomResponseBodyPropertyValidator))(properties.customResponseBodies));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("rules", cdk.listValidator(CfnRuleGroupRulePropertyValidator))(properties.rules));
  errors.collect(cdk.propertyValidator("scope", cdk.requiredValidator)(properties.scope));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("visibilityConfig", cdk.requiredValidator)(properties.visibilityConfig));
  errors.collect(cdk.propertyValidator("visibilityConfig", CfnRuleGroupVisibilityConfigPropertyValidator)(properties.visibilityConfig));
  return errors.wrap("supplied properties not correct for \"CfnRuleGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupPropsValidator(properties).assertSuccess();
  return {
    "AvailableLabels": cdk.listMapper(convertCfnRuleGroupLabelSummaryPropertyToCloudFormation)(properties.availableLabels),
    "Capacity": cdk.numberToCloudFormation(properties.capacity),
    "ConsumedLabels": cdk.listMapper(convertCfnRuleGroupLabelSummaryPropertyToCloudFormation)(properties.consumedLabels),
    "CustomResponseBodies": cdk.hashMapper(convertCfnRuleGroupCustomResponseBodyPropertyToCloudFormation)(properties.customResponseBodies),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Rules": cdk.listMapper(convertCfnRuleGroupRulePropertyToCloudFormation)(properties.rules),
    "Scope": cdk.stringToCloudFormation(properties.scope),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VisibilityConfig": convertCfnRuleGroupVisibilityConfigPropertyToCloudFormation(properties.visibilityConfig)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroupProps>();
  ret.addPropertyResult("availableLabels", "AvailableLabels", (properties.AvailableLabels != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupLabelSummaryPropertyFromCloudFormation)(properties.AvailableLabels) : undefined));
  ret.addPropertyResult("capacity", "Capacity", (properties.Capacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.Capacity) : undefined));
  ret.addPropertyResult("consumedLabels", "ConsumedLabels", (properties.ConsumedLabels != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupLabelSummaryPropertyFromCloudFormation)(properties.ConsumedLabels) : undefined));
  ret.addPropertyResult("customResponseBodies", "CustomResponseBodies", (properties.CustomResponseBodies != null ? cfn_parse.FromCloudFormation.getMap(CfnRuleGroupCustomResponseBodyPropertyFromCloudFormation)(properties.CustomResponseBodies) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupRulePropertyFromCloudFormation)(properties.Rules) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("visibilityConfig", "VisibilityConfig", (properties.VisibilityConfig != null ? CfnRuleGroupVisibilityConfigPropertyFromCloudFormation(properties.VisibilityConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomHTTPHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `CustomHTTPHeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupCustomHTTPHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"CustomHTTPHeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupCustomHTTPHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupCustomHTTPHeaderPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupCustomHTTPHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CustomHTTPHeaderProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CustomHTTPHeaderProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomRequestHandlingProperty`
 *
 * @param properties - the TypeScript properties of a `CustomRequestHandlingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupCustomRequestHandlingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("insertHeaders", cdk.requiredValidator)(properties.insertHeaders));
  errors.collect(cdk.propertyValidator("insertHeaders", cdk.listValidator(CfnRuleGroupCustomHTTPHeaderPropertyValidator))(properties.insertHeaders));
  return errors.wrap("supplied properties not correct for \"CustomRequestHandlingProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupCustomRequestHandlingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupCustomRequestHandlingPropertyValidator(properties).assertSuccess();
  return {
    "InsertHeaders": cdk.listMapper(convertCfnRuleGroupCustomHTTPHeaderPropertyToCloudFormation)(properties.insertHeaders)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupCustomRequestHandlingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CustomRequestHandlingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CustomRequestHandlingProperty>();
  ret.addPropertyResult("insertHeaders", "InsertHeaders", (properties.InsertHeaders != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupCustomHTTPHeaderPropertyFromCloudFormation)(properties.InsertHeaders) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomResponseProperty`
 *
 * @param properties - the TypeScript properties of a `CustomResponseProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupCustomResponsePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customResponseBodyKey", cdk.validateString)(properties.customResponseBodyKey));
  errors.collect(cdk.propertyValidator("responseCode", cdk.requiredValidator)(properties.responseCode));
  errors.collect(cdk.propertyValidator("responseCode", cdk.validateNumber)(properties.responseCode));
  errors.collect(cdk.propertyValidator("responseHeaders", cdk.listValidator(CfnRuleGroupCustomHTTPHeaderPropertyValidator))(properties.responseHeaders));
  return errors.wrap("supplied properties not correct for \"CustomResponseProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupCustomResponsePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupCustomResponsePropertyValidator(properties).assertSuccess();
  return {
    "CustomResponseBodyKey": cdk.stringToCloudFormation(properties.customResponseBodyKey),
    "ResponseCode": cdk.numberToCloudFormation(properties.responseCode),
    "ResponseHeaders": cdk.listMapper(convertCfnRuleGroupCustomHTTPHeaderPropertyToCloudFormation)(properties.responseHeaders)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupCustomResponsePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CustomResponseProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CustomResponseProperty>();
  ret.addPropertyResult("customResponseBodyKey", "CustomResponseBodyKey", (properties.CustomResponseBodyKey != null ? cfn_parse.FromCloudFormation.getString(properties.CustomResponseBodyKey) : undefined));
  ret.addPropertyResult("responseCode", "ResponseCode", (properties.ResponseCode != null ? cfn_parse.FromCloudFormation.getNumber(properties.ResponseCode) : undefined));
  ret.addPropertyResult("responseHeaders", "ResponseHeaders", (properties.ResponseHeaders != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupCustomHTTPHeaderPropertyFromCloudFormation)(properties.ResponseHeaders) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SingleHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `SingleHeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupSingleHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"SingleHeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupSingleHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupSingleHeaderPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupSingleHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.SingleHeaderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.SingleHeaderProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SingleQueryArgumentProperty`
 *
 * @param properties - the TypeScript properties of a `SingleQueryArgumentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupSingleQueryArgumentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"SingleQueryArgumentProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupSingleQueryArgumentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupSingleQueryArgumentPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupSingleQueryArgumentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleGroup.SingleQueryArgumentProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.SingleQueryArgumentProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AllowProperty`
 *
 * @param properties - the TypeScript properties of a `AllowProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupAllowPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customRequestHandling", CfnRuleGroupCustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
  return errors.wrap("supplied properties not correct for \"AllowProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupAllowPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupAllowPropertyValidator(properties).assertSuccess();
  return {
    "CustomRequestHandling": convertCfnRuleGroupCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupAllowPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.AllowProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.AllowProperty>();
  ret.addPropertyResult("customRequestHandling", "CustomRequestHandling", (properties.CustomRequestHandling != null ? CfnRuleGroupCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BlockProperty`
 *
 * @param properties - the TypeScript properties of a `BlockProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupBlockPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customResponse", CfnRuleGroupCustomResponsePropertyValidator)(properties.customResponse));
  return errors.wrap("supplied properties not correct for \"BlockProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupBlockPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupBlockPropertyValidator(properties).assertSuccess();
  return {
    "CustomResponse": convertCfnRuleGroupCustomResponsePropertyToCloudFormation(properties.customResponse)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupBlockPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.BlockProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.BlockProperty>();
  ret.addPropertyResult("customResponse", "CustomResponse", (properties.CustomResponse != null ? CfnRuleGroupCustomResponsePropertyFromCloudFormation(properties.CustomResponse) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CaptchaProperty`
 *
 * @param properties - the TypeScript properties of a `CaptchaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupCaptchaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customRequestHandling", CfnRuleGroupCustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
  return errors.wrap("supplied properties not correct for \"CaptchaProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupCaptchaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupCaptchaPropertyValidator(properties).assertSuccess();
  return {
    "CustomRequestHandling": convertCfnRuleGroupCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupCaptchaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CaptchaProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CaptchaProperty>();
  ret.addPropertyResult("customRequestHandling", "CustomRequestHandling", (properties.CustomRequestHandling != null ? CfnRuleGroupCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ChallengeProperty`
 *
 * @param properties - the TypeScript properties of a `ChallengeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupChallengePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customRequestHandling", CfnRuleGroupCustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
  return errors.wrap("supplied properties not correct for \"ChallengeProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupChallengePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupChallengePropertyValidator(properties).assertSuccess();
  return {
    "CustomRequestHandling": convertCfnRuleGroupCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupChallengePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.ChallengeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.ChallengeProperty>();
  ret.addPropertyResult("customRequestHandling", "CustomRequestHandling", (properties.CustomRequestHandling != null ? CfnRuleGroupCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CountProperty`
 *
 * @param properties - the TypeScript properties of a `CountProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupCountPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customRequestHandling", CfnRuleGroupCustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
  return errors.wrap("supplied properties not correct for \"CountProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupCountPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupCountPropertyValidator(properties).assertSuccess();
  return {
    "CustomRequestHandling": convertCfnRuleGroupCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupCountPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CountProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CountProperty>();
  ret.addPropertyResult("customRequestHandling", "CustomRequestHandling", (properties.CustomRequestHandling != null ? CfnRuleGroupCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > This is the latest version of *AWS WAF* , named AWS WAF V2, released in November, 2019.
 *
 * For information, including how to migrate your AWS WAF resources from the prior release, see the [AWS WAF developer guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
 *
 * Use an `WebACL` to define a collection of rules to use to inspect and control web requests. Each rule in a web ACL has a statement that defines what to look for in web requests and an action that AWS WAF applies to requests that match the statement. In the web ACL, you assign a default action to take (allow, block) for any request that doesn't match any of the rules.
 *
 * The rules in a web ACL can be a combination of explicitly defined rules and rule groups that you reference from the web ACL. The rule groups can be rule groups that you manage or rule groups that are managed by others.
 *
 * You can associate a web ACL with one or more AWS resources to protect. The resources can be an Amazon CloudFront distribution, an Amazon API Gateway REST API, an Application Load Balancer , an AWS AppSync GraphQL API , an Amazon Cognito user pool, an AWS App Runner service, or an AWS Verified Access instance.
 *
 * For more information, see [Web access control lists (web ACLs)](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl.html) in the *AWS WAF developer guide* .
 *
 * *Web ACLs used in AWS Shield Advanced automatic application layer DDoS mitigation*
 *
 * If you use Shield Advanced automatic application layer DDoS mitigation, the web ACLs that you use with automatic mitigation have a rule group rule whose name starts with `ShieldMitigationRuleGroup` . This rule is used for automatic mitigations and it's managed for you in the web ACL by Shield Advanced and AWS WAF . You'll see the rule listed among the web ACL rules when you view the web ACL through the AWS WAF interfaces.
 *
 * When you manage the web ACL through AWS CloudFormation interfaces, you won't see the Shield Advanced rule. AWS CloudFormation doesn't include this type of rule in the stack drift status between the actual configuration of the web ACL and your web ACL template.
 *
 * Don't add the Shield Advanced rule group rule to your web ACL template. The rule shouldn't be in your template. When you update the web ACL template in a stack, the Shield Advanced rule is maintained for you by AWS WAF in the resulting web ACL.
 *
 * For more information, see [Shield Advanced automatic application layer DDoS mitigation](https://docs.aws.amazon.com/waf/latest/developerguide/ddos-automatic-app-layer-response.html) in the *AWS Shield Advanced developer guide* .
 *
 * @cloudformationResource AWS::WAFv2::WebACL
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html
 */
export class CfnWebACL extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFv2::WebACL";

  /**
   * Build a CfnWebACL from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWebACL {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWebACLPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWebACL(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the web ACL.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The web ACL capacity units (WCUs) currently being used by this web ACL.
   *
   * AWS WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. AWS WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. The WCU limit for web ACLs is 1,500.
   *
   * @cloudformationAttribute Capacity
   */
  public readonly attrCapacity: number;

  /**
   * The ID of the web ACL.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The label namespace prefix for this web ACL. All labels added by rules in this web ACL have this prefix.
   *
   * The syntax for the label namespace prefix for a web ACL is the following: `awswaf:<account ID>:webacl:<web ACL name>:`
   *
   * When a rule with a label matches a web request, AWS WAF adds the fully qualified label to the request. A fully qualified label is made up of the label namespace from the rule group or web ACL where the rule is defined and the label from the rule, separated by a colon.
   *
   * @cloudformationAttribute LabelNamespace
   */
  public readonly attrLabelNamespace: string;

  /**
   * Specifies custom configurations for the associations between the web ACL and protected resources.
   */
  public associationConfig?: CfnWebACL.AssociationConfigProperty | cdk.IResolvable;

  /**
   * Specifies how AWS WAF should handle `CAPTCHA` evaluations for rules that don't have their own `CaptchaConfig` settings.
   */
  public captchaConfig?: CfnWebACL.CaptchaConfigProperty | cdk.IResolvable;

  /**
   * Specifies how AWS WAF should handle challenge evaluations for rules that don't have their own `ChallengeConfig` settings.
   */
  public challengeConfig?: CfnWebACL.ChallengeConfigProperty | cdk.IResolvable;

  /**
   * A map of custom response keys and content bodies.
   */
  public customResponseBodies?: cdk.IResolvable | Record<string, CfnWebACL.CustomResponseBodyProperty | cdk.IResolvable>;

  /**
   * The action to perform if none of the `Rules` contained in the `WebACL` match.
   */
  public defaultAction: CfnWebACL.DefaultActionProperty | cdk.IResolvable;

  /**
   * A description of the web ACL that helps with identification.
   */
  public description?: string;

  /**
   * The name of the web ACL.
   */
  public name?: string;

  /**
   * The rule statements used to identify the web requests that you want to manage.
   */
  public rules?: Array<cdk.IResolvable | CfnWebACL.RuleProperty> | cdk.IResolvable;

  /**
   * Specifies whether this is for an Amazon CloudFront distribution or for a regional application.
   */
  public scope: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Key:value pairs associated with an AWS resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Specifies the domains that AWS WAF should accept in a web request token.
   */
  public tokenDomains?: Array<string>;

  /**
   * Defines and enables Amazon CloudWatch metrics and web request sample collection.
   */
  public visibilityConfig: cdk.IResolvable | CfnWebACL.VisibilityConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWebACLProps) {
    super(scope, id, {
      "type": CfnWebACL.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "defaultAction", this);
    cdk.requireProperty(props, "scope", this);
    cdk.requireProperty(props, "visibilityConfig", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCapacity = cdk.Token.asNumber(this.getAtt("Capacity", cdk.ResolutionTypeHint.NUMBER));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLabelNamespace = cdk.Token.asString(this.getAtt("LabelNamespace", cdk.ResolutionTypeHint.STRING));
    this.associationConfig = props.associationConfig;
    this.captchaConfig = props.captchaConfig;
    this.challengeConfig = props.challengeConfig;
    this.customResponseBodies = props.customResponseBodies;
    this.defaultAction = props.defaultAction;
    this.description = props.description;
    this.name = props.name;
    this.rules = props.rules;
    this.scope = props.scope;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::WAFv2::WebACL", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.tokenDomains = props.tokenDomains;
    this.visibilityConfig = props.visibilityConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "associationConfig": this.associationConfig,
      "captchaConfig": this.captchaConfig,
      "challengeConfig": this.challengeConfig,
      "customResponseBodies": this.customResponseBodies,
      "defaultAction": this.defaultAction,
      "description": this.description,
      "name": this.name,
      "rules": this.rules,
      "scope": this.scope,
      "tags": this.tags.renderTags(),
      "tokenDomains": this.tokenDomains,
      "visibilityConfig": this.visibilityConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWebACL.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWebACLPropsToCloudFormation(props);
  }
}

export namespace CfnWebACL {
  /**
   * Specifies custom configurations for the associations between the web ACL and protected resources.
   *
   * Use this to customize the maximum size of the request body that your protected CloudFront distributions forward to AWS WAF for inspection. The default is 16 KB (16,384 bytes).
   *
   * > You are charged additional fees when your protected resources forward body sizes that are larger than the default. For more information, see [AWS WAF Pricing](https://docs.aws.amazon.com/waf/pricing/) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-associationconfig.html
   */
  export interface AssociationConfigProperty {
    /**
     * Customizes the maximum size of the request body that your protected CloudFront distributions forward to AWS WAF for inspection.
     *
     * The default size is 16 KB (16,384 bytes).
     *
     * > You are charged additional fees when your protected resources forward body sizes that are larger than the default. For more information, see [AWS WAF Pricing](https://docs.aws.amazon.com/waf/pricing/) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-associationconfig.html#cfn-wafv2-webacl-associationconfig-requestbody
     */
    readonly requestBody?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnWebACL.RequestBodyAssociatedResourceTypeConfigProperty>;
  }

  /**
   * Customizes the maximum size of the request body that your protected CloudFront distributions forward to AWS WAF for inspection.
   *
   * The default size is 16 KB (16,384 bytes).
   *
   * > You are charged additional fees when your protected resources forward body sizes that are larger than the default. For more information, see [AWS WAF Pricing](https://docs.aws.amazon.com/waf/pricing/) .
   *
   * This is used in the `AssociationConfig` of the web ACL.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-requestbodyassociatedresourcetypeconfig.html
   */
  export interface RequestBodyAssociatedResourceTypeConfigProperty {
    /**
     * Specifies the maximum size of the web request body component that an associated CloudFront distribution should send to AWS WAF for inspection.
     *
     * This applies to statements in the web ACL that inspect the body or JSON body.
     *
     * Default: `16 KB (16,384 bytes)`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-requestbodyassociatedresourcetypeconfig.html#cfn-wafv2-webacl-requestbodyassociatedresourcetypeconfig-defaultsizeinspectionlimit
     */
    readonly defaultSizeInspectionLimit: string;
  }

  /**
   * In a `WebACL` , this is the action that you want AWS WAF to perform when a web request doesn't match any of the rules in the `WebACL` .
   *
   * The default action must be a terminating action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-defaultaction.html
   */
  export interface DefaultActionProperty {
    /**
     * Specifies that AWS WAF should allow requests by default.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-defaultaction.html#cfn-wafv2-webacl-defaultaction-allow
     */
    readonly allow?: CfnWebACL.AllowActionProperty | cdk.IResolvable;

    /**
     * Specifies that AWS WAF should block requests by default.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-defaultaction.html#cfn-wafv2-webacl-defaultaction-block
     */
    readonly block?: CfnWebACL.BlockActionProperty | cdk.IResolvable;
  }

  /**
   * Specifies that AWS WAF should block the request and optionally defines additional custom handling for the response to the web request.
   *
   * This is used in the context of other settings, for example to specify values for a rule action or a web ACL default action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-blockaction.html
   */
  export interface BlockActionProperty {
    /**
     * Defines a custom response for the web request.
     *
     * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-blockaction.html#cfn-wafv2-webacl-blockaction-customresponse
     */
    readonly customResponse?: CfnWebACL.CustomResponseProperty | cdk.IResolvable;
  }

  /**
   * A custom response to send to the client.
   *
   * You can define a custom response for rule actions and default web ACL actions that are set to the block action.
   *
   * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF developer guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customresponse.html
   */
  export interface CustomResponseProperty {
    /**
     * References the response body that you want AWS WAF to return to the web request client.
     *
     * You can define a custom response for a rule action or a default web ACL action that is set to block. To do this, you first define the response body key and value in the `CustomResponseBodies` setting for the `WebACL` or `RuleGroup` where you want to use it. Then, in the rule action or web ACL default action `BlockAction` setting, you reference the response body using this key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customresponse.html#cfn-wafv2-webacl-customresponse-customresponsebodykey
     */
    readonly customResponseBodyKey?: string;

    /**
     * The HTTP status code to return to the client.
     *
     * For a list of status codes that you can use in your custom responses, see [Supported status codes for custom response](https://docs.aws.amazon.com/waf/latest/developerguide/customizing-the-response-status-codes.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customresponse.html#cfn-wafv2-webacl-customresponse-responsecode
     */
    readonly responseCode: number;

    /**
     * The HTTP headers to use in the response.
     *
     * You can specify any header name except for `content-type` . Duplicate header names are not allowed.
     *
     * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customresponse.html#cfn-wafv2-webacl-customresponse-responseheaders
     */
    readonly responseHeaders?: Array<CfnWebACL.CustomHTTPHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * A custom header for custom request and response handling.
   *
   * This is used in `CustomResponse` and `CustomRequestHandling` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customhttpheader.html
   */
  export interface CustomHTTPHeaderProperty {
    /**
     * The name of the custom header.
     *
     * For custom request header insertion, when AWS WAF inserts the header into the request, it prefixes this name `x-amzn-waf-` , to avoid confusion with the headers that are already in the request. For example, for the header name `sample` , AWS WAF inserts the header `x-amzn-waf-sample` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customhttpheader.html#cfn-wafv2-webacl-customhttpheader-name
     */
    readonly name: string;

    /**
     * The value of the custom header.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customhttpheader.html#cfn-wafv2-webacl-customhttpheader-value
     */
    readonly value: string;
  }

  /**
   * Specifies that AWS WAF should allow the request and optionally defines additional custom handling for the request.
   *
   * This is used in the context of other settings, for example to specify values for a rule action or a web ACL default action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-allowaction.html
   */
  export interface AllowActionProperty {
    /**
     * Defines custom handling for the web request.
     *
     * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-allowaction.html#cfn-wafv2-webacl-allowaction-customrequesthandling
     */
    readonly customRequestHandling?: CfnWebACL.CustomRequestHandlingProperty | cdk.IResolvable;
  }

  /**
   * Custom request handling behavior that inserts custom headers into a web request.
   *
   * You can add custom request handling for AWS WAF to use when the rule action doesn't block the request. For example, `CaptchaAction` for requests with valid t okens, and `AllowAction` .
   *
   * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the *AWS WAF Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customrequesthandling.html
   */
  export interface CustomRequestHandlingProperty {
    /**
     * The HTTP headers to insert into the request. Duplicate header names are not allowed.
     *
     * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customrequesthandling.html#cfn-wafv2-webacl-customrequesthandling-insertheaders
     */
    readonly insertHeaders: Array<CfnWebACL.CustomHTTPHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The response body to use in a custom response to a web request.
   *
   * This is referenced by key from `CustomResponse` `CustomResponseBodyKey` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customresponsebody.html
   */
  export interface CustomResponseBodyProperty {
    /**
     * The payload of the custom response.
     *
     * You can use JSON escape strings in JSON content. To do this, you must specify JSON content in the `ContentType` setting.
     *
     * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customresponsebody.html#cfn-wafv2-webacl-customresponsebody-content
     */
    readonly content: string;

    /**
     * The type of content in the payload that you are defining in the `Content` string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customresponsebody.html#cfn-wafv2-webacl-customresponsebody-contenttype
     */
    readonly contentType: string;
  }

  /**
   * Specifies how AWS WAF should handle `Challenge` evaluations.
   *
   * This is available at the web ACL level and in each rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-challengeconfig.html
   */
  export interface ChallengeConfigProperty {
    /**
     * Determines how long a challenge timestamp in the token remains valid after the client successfully responds to a challenge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-challengeconfig.html#cfn-wafv2-webacl-challengeconfig-immunitytimeproperty
     */
    readonly immunityTimeProperty?: CfnWebACL.ImmunityTimePropertyProperty | cdk.IResolvable;
  }

  /**
   * Used for CAPTCHA and challenge token settings.
   *
   * Determines how long a `CAPTCHA` or challenge timestamp remains valid after AWS WAF updates it for a successful `CAPTCHA` or challenge response.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-immunitytimeproperty.html
   */
  export interface ImmunityTimePropertyProperty {
    /**
     * The amount of time, in seconds, that a `CAPTCHA` or challenge timestamp is considered valid by AWS WAF .
     *
     * The default setting is 300.
     *
     * For the Challenge action, the minimum setting is 300.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-immunitytimeproperty.html#cfn-wafv2-webacl-immunitytimeproperty-immunitytime
     */
    readonly immunityTime: number;
  }

  /**
   * A single rule, which you can use in a `WebACL` or `RuleGroup` to identify web requests that you want to manage in some way.
   *
   * Each rule includes one top-level `Statement` that AWS WAF uses to identify matching web requests, and parameters that govern how AWS WAF handles them.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html
   */
  export interface RuleProperty {
    /**
     * The action that AWS WAF should take on a web request when it matches the rule's statement.
     *
     * Settings at the web ACL level can override the rule action setting.
     *
     * This is used only for rules whose statements don't reference a rule group. Rule statements that reference a rule group are `RuleGroupReferenceStatement` and `ManagedRuleGroupStatement` .
     *
     * You must set either this `Action` setting or the rule's `OverrideAction` , but not both:
     *
     * - If the rule statement doesn't reference a rule group, you must set this rule action setting and you must not set the rule's override action setting.
     * - If the rule statement references a rule group, you must not set this action setting, because the actions are already set on the rules inside the rule group. You must set the rule's override action setting to indicate specifically whether to override the actions that are set on the rules in the rule group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-action
     */
    readonly action?: cdk.IResolvable | CfnWebACL.RuleActionProperty;

    /**
     * Specifies how AWS WAF should handle `CAPTCHA` evaluations.
     *
     * If you don't specify this, AWS WAF uses the `CAPTCHA` configuration that's defined for the web ACL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-captchaconfig
     */
    readonly captchaConfig?: CfnWebACL.CaptchaConfigProperty | cdk.IResolvable;

    /**
     * Specifies how AWS WAF should handle `Challenge` evaluations.
     *
     * If you don't specify this, AWS WAF uses the challenge configuration that's defined for the web ACL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-challengeconfig
     */
    readonly challengeConfig?: CfnWebACL.ChallengeConfigProperty | cdk.IResolvable;

    /**
     * The name of the rule.
     *
     * If you change the name of a `Rule` after you create it and you want the rule's metric name to reflect the change, update the metric name in the rule's `VisibilityConfig` settings. AWS WAF doesn't automatically update the metric name when you update the rule name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-name
     */
    readonly name: string;

    /**
     * The override action to apply to the rules in a rule group, instead of the individual rule action settings.
     *
     * This is used only for rules whose statements reference a rule group. Rule statements that reference a rule group are `RuleGroupReferenceStatement` and `ManagedRuleGroupStatement` .
     *
     * Set the override action to none to leave the rule group rule actions in effect. Set it to count to only count matches, regardless of the rule action settings.
     *
     * You must set either this `OverrideAction` setting or the `Action` setting, but not both:
     *
     * - If the rule statement references a rule group, you must set this override action setting and you must not set the rule's action setting.
     * - If the rule statement doesn't reference a rule group, you must set the rule action setting and you must not set the rule's override action setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-overrideaction
     */
    readonly overrideAction?: cdk.IResolvable | CfnWebACL.OverrideActionProperty;

    /**
     * If you define more than one `Rule` in a `WebACL` , AWS WAF evaluates each request against the `Rules` in order based on the value of `Priority` .
     *
     * AWS WAF processes rules with lower priority first. The priorities don't need to be consecutive, but they must all be different.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-priority
     */
    readonly priority: number;

    /**
     * Labels to apply to web requests that match the rule match statement.
     *
     * AWS WAF applies fully qualified labels to matching web requests. A fully qualified label is the concatenation of a label namespace and a rule label. The rule's rule group or web ACL defines the label namespace.
     *
     * Rules that run after this rule in the web ACL can match against these labels using a `LabelMatchStatement` .
     *
     * For each label, provide a case-sensitive string containing optional namespaces and a label name, according to the following guidelines:
     *
     * - Separate each component of the label with a colon.
     * - Each namespace or name can have up to 128 characters.
     * - You can specify up to 5 namespaces in a label.
     * - Don't use the following reserved words in your label specification: `aws` , `waf` , `managed` , `rulegroup` , `webacl` , `regexpatternset` , or `ipset` .
     *
     * For example, `myLabelName` or `nameSpace1:nameSpace2:myLabelName` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-rulelabels
     */
    readonly ruleLabels?: Array<cdk.IResolvable | CfnWebACL.LabelProperty> | cdk.IResolvable;

    /**
     * The AWS WAF processing statement for the rule, for example `ByteMatchStatement` or `SizeConstraintStatement` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-statement
     */
    readonly statement: cdk.IResolvable | CfnWebACL.StatementProperty;

    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection.
     *
     * If you change the name of a `Rule` after you create it and you want the rule's metric name to reflect the change, update the metric name as well. AWS WAF doesn't automatically update the metric name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-visibilityconfig
     */
    readonly visibilityConfig: cdk.IResolvable | CfnWebACL.VisibilityConfigProperty;
  }

  /**
   * The action that AWS WAF should take on a web request when it matches a rule's statement.
   *
   * Settings at the web ACL level can override the rule action setting.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleaction.html
   */
  export interface RuleActionProperty {
    /**
     * Instructs AWS WAF to allow the web request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleaction.html#cfn-wafv2-webacl-ruleaction-allow
     */
    readonly allow?: CfnWebACL.AllowActionProperty | cdk.IResolvable;

    /**
     * Instructs AWS WAF to block the web request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleaction.html#cfn-wafv2-webacl-ruleaction-block
     */
    readonly block?: CfnWebACL.BlockActionProperty | cdk.IResolvable;

    /**
     * Specifies that AWS WAF should run a `CAPTCHA` check against the request:.
     *
     * - If the request includes a valid, unexpired `CAPTCHA` token, AWS WAF allows the web request inspection to proceed to the next rule, similar to a `CountAction` .
     * - If the request doesn't include a valid, unexpired `CAPTCHA` token, AWS WAF discontinues the web ACL evaluation of the request and blocks it from going to its intended destination.
     *
     * AWS WAF generates a response that it sends back to the client, which includes the following:
     *
     * - The header `x-amzn-waf-action` with a value of `captcha` .
     * - The HTTP status code `405 Method Not Allowed` .
     * - If the request contains an `Accept` header with a value of `text/html` , the response includes a `CAPTCHA` challenge.
     *
     * You can configure the expiration time in the `CaptchaConfig` `ImmunityTimeProperty` setting at the rule and web ACL level. The rule setting overrides the web ACL setting.
     *
     * This action option is available for rules. It isn't available for web ACL default actions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleaction.html#cfn-wafv2-webacl-ruleaction-captcha
     */
    readonly captcha?: CfnWebACL.CaptchaActionProperty | cdk.IResolvable;

    /**
     * Instructs AWS WAF to run a `Challenge` check against the web request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleaction.html#cfn-wafv2-webacl-ruleaction-challenge
     */
    readonly challenge?: CfnWebACL.ChallengeActionProperty | cdk.IResolvable;

    /**
     * Instructs AWS WAF to count the web request and then continue evaluating the request using the remaining rules in the web ACL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleaction.html#cfn-wafv2-webacl-ruleaction-count
     */
    readonly count?: CfnWebACL.CountActionProperty | cdk.IResolvable;
  }

  /**
   * Specifies that AWS WAF should run a `CAPTCHA` check against the request:.
   *
   * - If the request includes a valid, unexpired `CAPTCHA` token, AWS WAF allows the web request inspection to proceed to the next rule, similar to a `CountAction` .
   * - If the request doesn't include a valid, unexpired `CAPTCHA` token, AWS WAF discontinues the web ACL evaluation of the request and blocks it from going to its intended destination.
   *
   * AWS WAF generates a response that it sends back to the client, which includes the following:
   *
   * - The header `x-amzn-waf-action` with a value of `captcha` .
   * - The HTTP status code `405 Method Not Allowed` .
   * - If the request contains an `Accept` header with a value of `text/html` , the response includes a `CAPTCHA` challenge.
   *
   * You can configure the expiration time in the `CaptchaConfig` `ImmunityTimeProperty` setting at the rule and web ACL level. The rule setting overrides the web ACL setting.
   *
   * This action option is available for rules. It isn't available for web ACL default actions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-captchaaction.html
   */
  export interface CaptchaActionProperty {
    /**
     * Defines custom handling for the web request, used when the `CAPTCHA` inspection determines that the request's token is valid and unexpired.
     *
     * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-captchaaction.html#cfn-wafv2-webacl-captchaaction-customrequesthandling
     */
    readonly customRequestHandling?: CfnWebACL.CustomRequestHandlingProperty | cdk.IResolvable;
  }

  /**
   * Specifies that AWS WAF should count the request. Optionally defines additional custom handling for the request.
   *
   * This is used in the context of other settings, for example to specify values for a rule action or a web ACL default action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-countaction.html
   */
  export interface CountActionProperty {
    /**
     * Defines custom handling for the web request.
     *
     * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-countaction.html#cfn-wafv2-webacl-countaction-customrequesthandling
     */
    readonly customRequestHandling?: CfnWebACL.CustomRequestHandlingProperty | cdk.IResolvable;
  }

  /**
   * Specifies that AWS WAF should run a `Challenge` check against the request to verify that the request is coming from a legitimate client session:  - If the request includes a valid, unexpired challenge token, AWS WAF applies any custom request handling and labels that you've configured and then allows the web request inspection to proceed to the next rule, similar to a `CountAction` .
   *
   * - If the request doesn't include a valid, unexpired challenge token, AWS WAF discontinues the web ACL evaluation of the request and blocks it from going to its intended destination.
   *
   * AWS WAF then generates a challenge response that it sends back to the client, which includes the following:
   *
   * - The header `x-amzn-waf-action` with a value of `challenge` .
   * - The HTTP status code `202 Request Accepted` .
   * - If the request contains an `Accept` header with a value of `text/html` , the response includes a JavaScript page interstitial with a challenge script.
   *
   * Challenges run silent browser interrogations in the background, and don't generally affect the end user experience.
   *
   * A challenge enforces token acquisition using an interstitial JavaScript challenge that inspects the client session for legitimate behavior. The challenge blocks bots or at least increases the cost of operating sophisticated bots.
   *
   * After the client session successfully responds to the challenge, it receives a new token from AWS WAF , which the challenge script uses to resubmit the original request.
   *
   * You can configure the expiration time in the `ChallengeConfig` `ImmunityTimeProperty` setting at the rule and web ACL level. The rule setting overrides the web ACL setting.
   *
   * This action option is available for rules. It isn't available for web ACL default actions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-challengeaction.html
   */
  export interface ChallengeActionProperty {
    /**
     * Defines custom handling for the web request, used when the challenge inspection determines that the request's token is valid and unexpired.
     *
     * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF developer guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-challengeaction.html#cfn-wafv2-webacl-challengeaction-customrequesthandling
     */
    readonly customRequestHandling?: CfnWebACL.CustomRequestHandlingProperty | cdk.IResolvable;
  }

  /**
   * The processing guidance for a rule, used by AWS WAF to determine whether a web request matches the rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html
   */
  export interface StatementProperty {
    /**
     * A logical rule statement used to combine other rule statements with AND logic.
     *
     * You provide more than one `Statement` within the `AndStatement` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-andstatement
     */
    readonly andStatement?: CfnWebACL.AndStatementProperty | cdk.IResolvable;

    /**
     * A rule statement that defines a string match search for AWS WAF to apply to web requests.
     *
     * The byte match statement provides the bytes to search for, the location in requests that you want AWS WAF to search, and other settings. The bytes to search for are typically a string that corresponds with ASCII characters. In the AWS WAF console and the developer guide, this is called a string match statement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-bytematchstatement
     */
    readonly byteMatchStatement?: CfnWebACL.ByteMatchStatementProperty | cdk.IResolvable;

    /**
     * A rule statement that labels web requests by country and region and that matches against web requests based on country code.
     *
     * A geo match rule labels every request that it inspects regardless of whether it finds a match.
     *
     * - To manage requests only by country, you can use this statement by itself and specify the countries that you want to match against in the `CountryCodes` array.
     * - Otherwise, configure your geo match rule with Count action so that it only labels requests. Then, add one or more label match rules to run after the geo match rule and configure them to match against the geographic labels and handle the requests as needed.
     *
     * AWS WAF labels requests using the alpha-2 country and region codes from the International Organization for Standardization (ISO) 3166 standard. AWS WAF determines the codes using either the IP address in the web request origin or, if you specify it, the address in the geo match `ForwardedIPConfig` .
     *
     * If you use the web request origin, the label formats are `awswaf:clientip:geo:region:<ISO country code>-<ISO region code>` and `awswaf:clientip:geo:country:<ISO country code>` .
     *
     * If you use a forwarded IP address, the label formats are `awswaf:forwardedip:geo:region:<ISO country code>-<ISO region code>` and `awswaf:forwardedip:geo:country:<ISO country code>` .
     *
     * For additional details, see [Geographic match rule statement](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-geo-match.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-geomatchstatement
     */
    readonly geoMatchStatement?: CfnWebACL.GeoMatchStatementProperty | cdk.IResolvable;

    /**
     * A rule statement used to detect web requests coming from particular IP addresses or address ranges.
     *
     * To use this, create an `IPSet` that specifies the addresses you want to detect, then use the ARN of that set in this statement.
     *
     * Each IP set rule statement references an IP set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-ipsetreferencestatement
     */
    readonly ipSetReferenceStatement?: CfnWebACL.IPSetReferenceStatementProperty | cdk.IResolvable;

    /**
     * A rule statement to match against labels that have been added to the web request by rules that have already run in the web ACL.
     *
     * The label match statement provides the label or namespace string to search for. The label string can represent a part or all of the fully qualified label name that had been added to the web request. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label. If you do not provide the fully qualified name in your label match string, AWS WAF performs the search for labels that were added in the same context as the label match statement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-labelmatchstatement
     */
    readonly labelMatchStatement?: cdk.IResolvable | CfnWebACL.LabelMatchStatementProperty;

    /**
     * A rule statement used to run the rules that are defined in a managed rule group.
     *
     * To use this, provide the vendor name and the name of the rule group in this statement. You can retrieve the required names through the API call `ListAvailableManagedRuleGroups` .
     *
     * You cannot nest a `ManagedRuleGroupStatement` , for example for use inside a `NotStatement` or `OrStatement` . It can only be referenced as a top-level statement within a rule.
     *
     * > You are charged additional fees when you use the AWS WAF Bot Control managed rule group `AWSManagedRulesBotControlRuleSet` , the AWS WAF Fraud Control account takeover prevention (ATP) managed rule group `AWSManagedRulesATPRuleSet` , or the AWS WAF Fraud Control account creation fraud prevention (ACFP) managed rule group `AWSManagedRulesACFPRuleSet` . For more information, see [AWS WAF Pricing](https://docs.aws.amazon.com/waf/pricing/) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-managedrulegroupstatement
     */
    readonly managedRuleGroupStatement?: cdk.IResolvable | CfnWebACL.ManagedRuleGroupStatementProperty;

    /**
     * A logical rule statement used to negate the results of another rule statement.
     *
     * You provide one `Statement` within the `NotStatement` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-notstatement
     */
    readonly notStatement?: cdk.IResolvable | CfnWebACL.NotStatementProperty;

    /**
     * A logical rule statement used to combine other rule statements with OR logic.
     *
     * You provide more than one `Statement` within the `OrStatement` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-orstatement
     */
    readonly orStatement?: cdk.IResolvable | CfnWebACL.OrStatementProperty;

    /**
     * A rate-based rule counts incoming requests and rate limits requests when they are coming at too fast a rate.
     *
     * The rule categorizes requests according to your aggregation criteria, collects them into aggregation instances, and counts and rate limits the requests for each instance.
     *
     * You can specify individual aggregation keys, like IP address or HTTP method. You can also specify aggregation key combinations, like IP address and HTTP method, or HTTP method, query argument, and cookie.
     *
     * Each unique set of values for the aggregation keys that you specify is a separate aggregation instance, with the value from each key contributing to the aggregation instance definition.
     *
     * For example, assume the rule evaluates web requests with the following IP address and HTTP method values:
     *
     * - IP address 10.1.1.1, HTTP method POST
     * - IP address 10.1.1.1, HTTP method GET
     * - IP address 127.0.0.0, HTTP method POST
     * - IP address 10.1.1.1, HTTP method GET
     *
     * The rule would create different aggregation instances according to your aggregation criteria, for example:
     *
     * - If the aggregation criteria is just the IP address, then each individual address is an aggregation instance, and AWS WAF counts requests separately for each. The aggregation instances and request counts for our example would be the following:
     *
     * - IP address 10.1.1.1: count 3
     * - IP address 127.0.0.0: count 1
     * - If the aggregation criteria is HTTP method, then each individual HTTP method is an aggregation instance. The aggregation instances and request counts for our example would be the following:
     *
     * - HTTP method POST: count 2
     * - HTTP method GET: count 2
     * - If the aggregation criteria is IP address and HTTP method, then each IP address and each HTTP method would contribute to the combined aggregation instance. The aggregation instances and request counts for our example would be the following:
     *
     * - IP address 10.1.1.1, HTTP method POST: count 1
     * - IP address 10.1.1.1, HTTP method GET: count 2
     * - IP address 127.0.0.0, HTTP method POST: count 1
     *
     * For any n-tuple of aggregation keys, each unique combination of values for the keys defines a separate aggregation instance, which AWS WAF counts and rate-limits individually.
     *
     * You can optionally nest another statement inside the rate-based statement, to narrow the scope of the rule so that it only counts and rate limits requests that match the nested statement. You can use this nested scope-down statement in conjunction with your aggregation key specifications or you can just count and rate limit all requests that match the scope-down statement, without additional aggregation. When you choose to just manage all requests that match a scope-down statement, the aggregation instance is singular for the rule.
     *
     * You cannot nest a `RateBasedStatement` inside another statement, for example inside a `NotStatement` or `OrStatement` . You can define a `RateBasedStatement` inside a web ACL and inside a rule group.
     *
     * For additional information about the options, see [Rate limiting web requests using rate-based rules](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rate-based-rules.html) in the *AWS WAF Developer Guide* .
     *
     * If you only aggregate on the individual IP address or forwarded IP address, you can retrieve the list of IP addresses that AWS WAF is currently rate limiting for a rule through the API call `GetRateBasedStatementManagedKeys` . This option is not available for other aggregation configurations.
     *
     * AWS WAF tracks and manages web requests separately for each instance of a rate-based rule that you use. For example, if you provide the same rate-based rule settings in two web ACLs, each of the two rule statements represents a separate instance of the rate-based rule and gets its own tracking and management by AWS WAF . If you define a rate-based rule inside a rule group, and then use that rule group in multiple places, each use creates a separate instance of the rate-based rule that gets its own tracking and management by AWS WAF .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-ratebasedstatement
     */
    readonly rateBasedStatement?: cdk.IResolvable | CfnWebACL.RateBasedStatementProperty;

    /**
     * A rule statement used to search web request components for a match against a single regular expression.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-regexmatchstatement
     */
    readonly regexMatchStatement?: cdk.IResolvable | CfnWebACL.RegexMatchStatementProperty;

    /**
     * A rule statement used to search web request components for matches with regular expressions.
     *
     * To use this, create a `RegexPatternSet` that specifies the expressions that you want to detect, then use the ARN of that set in this statement. A web request matches the pattern set rule statement if the request component matches any of the patterns in the set.
     *
     * Each regex pattern set rule statement references a regex pattern set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-regexpatternsetreferencestatement
     */
    readonly regexPatternSetReferenceStatement?: cdk.IResolvable | CfnWebACL.RegexPatternSetReferenceStatementProperty;

    /**
     * A rule statement used to run the rules that are defined in a `RuleGroup` .
     *
     * To use this, create a rule group with your rules, then provide the ARN of the rule group in this statement.
     *
     * You cannot nest a `RuleGroupReferenceStatement` , for example for use inside a `NotStatement` or `OrStatement` . You cannot use a rule group reference statement inside another rule group. You can only reference a rule group as a top-level statement within a rule that you define in a web ACL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-rulegroupreferencestatement
     */
    readonly ruleGroupReferenceStatement?: cdk.IResolvable | CfnWebACL.RuleGroupReferenceStatementProperty;

    /**
     * A rule statement that compares a number of bytes against the size of a request component, using a comparison operator, such as greater than (>) or less than (<).
     *
     * For example, you can use a size constraint statement to look for query strings that are longer than 100 bytes.
     *
     * If you configure AWS WAF to inspect the request body, AWS WAF inspects only the number of bytes of the body up to the limit for the web ACL. By default, for regional web ACLs, this limit is 8 KB (8,192 bytes) and for CloudFront web ACLs, this limit is 16 KB (16,384 bytes). For CloudFront web ACLs, you can increase the limit in the web ACL `AssociationConfig` , for additional fees. If you know that the request body for your web requests should never exceed the inspection limit, you could use a size constraint statement to block requests that have a larger request body size.
     *
     * If you choose URI for the value of Part of the request to filter on, the slash (/) in the URI counts as one character. For example, the URI `/logo.jpg` is nine characters long.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-sizeconstraintstatement
     */
    readonly sizeConstraintStatement?: cdk.IResolvable | CfnWebACL.SizeConstraintStatementProperty;

    /**
     * A rule statement that inspects for malicious SQL code.
     *
     * Attackers insert malicious SQL code into web requests to do things like modify your database or extract data from it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-sqlimatchstatement
     */
    readonly sqliMatchStatement?: cdk.IResolvable | CfnWebACL.SqliMatchStatementProperty;

    /**
     * A rule statement that inspects for cross-site scripting (XSS) attacks.
     *
     * In XSS attacks, the attacker uses vulnerabilities in a benign website as a vehicle to inject malicious client-site scripts into other legitimate web browsers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-xssmatchstatement
     */
    readonly xssMatchStatement?: cdk.IResolvable | CfnWebACL.XssMatchStatementProperty;
  }

  /**
   * A rule statement that compares a number of bytes against the size of a request component, using a comparison operator, such as greater than (>) or less than (<).
   *
   * For example, you can use a size constraint statement to look for query strings that are longer than 100 bytes.
   *
   * If you configure AWS WAF to inspect the request body, AWS WAF inspects only the number of bytes of the body up to the limit for the web ACL. By default, for regional web ACLs, this limit is 8 KB (8,192 bytes) and for CloudFront web ACLs, this limit is 16 KB (16,384 bytes). For CloudFront web ACLs, you can increase the limit in the web ACL `AssociationConfig` , for additional fees. If you know that the request body for your web requests should never exceed the inspection limit, you could use a size constraint statement to block requests that have a larger request body size.
   *
   * If you choose URI for the value of Part of the request to filter on, the slash (/) in the URI counts as one character. For example, the URI `/logo.jpg` is nine characters long.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sizeconstraintstatement.html
   */
  export interface SizeConstraintStatementProperty {
    /**
     * The operator to use to compare the request part to the size setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sizeconstraintstatement.html#cfn-wafv2-webacl-sizeconstraintstatement-comparisonoperator
     */
    readonly comparisonOperator: string;

    /**
     * The part of the web request that you want AWS WAF to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sizeconstraintstatement.html#cfn-wafv2-webacl-sizeconstraintstatement-fieldtomatch
     */
    readonly fieldToMatch: CfnWebACL.FieldToMatchProperty | cdk.IResolvable;

    /**
     * The size, in byte, to compare to the request part, after any transformations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sizeconstraintstatement.html#cfn-wafv2-webacl-sizeconstraintstatement-size
     */
    readonly size: number;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sizeconstraintstatement.html#cfn-wafv2-webacl-sizeconstraintstatement-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnWebACL.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-texttransformation.html
   */
  export interface TextTransformationProperty {
    /**
     * Sets the relative processing order for multiple transformations.
     *
     * AWS WAF processes all transformations, from lowest priority to highest, before inspecting the transformed content. The priorities don't need to be consecutive, but they must all be different.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-texttransformation.html#cfn-wafv2-webacl-texttransformation-priority
     */
    readonly priority: number;

    /**
     * For detailed descriptions of each of the transformation types, see [Text transformations](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-transformation.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-texttransformation.html#cfn-wafv2-webacl-texttransformation-type
     */
    readonly type: string;
  }

  /**
   * The part of the web request that you want AWS WAF to inspect.
   *
   * Include the single `FieldToMatch` type that you want to inspect, with additional specifications as needed, according to the type. You specify a single request component in `FieldToMatch` for each rule statement that requires it. To inspect more than one component of the web request, create a separate rule statement for each component.
   *
   * Example JSON for a `QueryString` field to match:
   *
   * `"FieldToMatch": { "QueryString": {} }`
   *
   * Example JSON for a `Method` field to match specification:
   *
   * `"FieldToMatch": { "Method": { "Name": "DELETE" } }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html
   */
  export interface FieldToMatchProperty {
    /**
     * Inspect all query arguments.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-allqueryarguments
     */
    readonly allQueryArguments?: any | cdk.IResolvable;

    /**
     * Inspect the request body as plain text.
     *
     * The request body immediately follows the request headers. This is the part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form.
     *
     * A limited amount of the request body is forwarded to AWS WAF for inspection by the underlying host service. For regional resources, the limit is 8 KB (8,192 bytes) and for CloudFront distributions, the limit is 16 KB (16,384 bytes). For CloudFront distributions, you can increase the limit in the web ACL's `AssociationConfig` , for additional processing fees.
     *
     * For information about how to handle oversized request bodies, see the `Body` object configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-body
     */
    readonly body?: CfnWebACL.BodyProperty | cdk.IResolvable;

    /**
     * Inspect the request cookies.
     *
     * You must configure scope and pattern matching filters in the `Cookies` object, to define the set of cookies and the parts of the cookies that AWS WAF inspects.
     *
     * Only the first 8 KB (8192 bytes) of a request's cookies and only the first 200 cookies are forwarded to AWS WAF for inspection by the underlying host service. You must configure how to handle any oversize cookie content in the `Cookies` object. AWS WAF applies the pattern matching filters to the cookies that it receives from the underlying host service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-cookies
     */
    readonly cookies?: CfnWebACL.CookiesProperty | cdk.IResolvable;

    /**
     * Inspect the request headers.
     *
     * You must configure scope and pattern matching filters in the `Headers` object, to define the set of headers to and the parts of the headers that AWS WAF inspects.
     *
     * Only the first 8 KB (8192 bytes) of a request's headers and only the first 200 headers are forwarded to AWS WAF for inspection by the underlying host service. You must configure how to handle any oversize header content in the `Headers` object. AWS WAF applies the pattern matching filters to the headers that it receives from the underlying host service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-headers
     */
    readonly headers?: CfnWebACL.HeadersProperty | cdk.IResolvable;

    /**
     * Inspect the request body as JSON.
     *
     * The request body immediately follows the request headers. This is the part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form.
     *
     * A limited amount of the request body is forwarded to AWS WAF for inspection by the underlying host service. For regional resources, the limit is 8 KB (8,192 bytes) and for CloudFront distributions, the limit is 16 KB (16,384 bytes). For CloudFront distributions, you can increase the limit in the web ACL's `AssociationConfig` , for additional processing fees.
     *
     * For information about how to handle oversized request bodies, see the `JsonBody` object configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-jsonbody
     */
    readonly jsonBody?: cdk.IResolvable | CfnWebACL.JsonBodyProperty;

    /**
     * Inspect the HTTP method.
     *
     * The method indicates the type of operation that the request is asking the origin to perform.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-method
     */
    readonly method?: any | cdk.IResolvable;

    /**
     * Inspect the query string.
     *
     * This is the part of a URL that appears after a `?` character, if any.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-querystring
     */
    readonly queryString?: any | cdk.IResolvable;

    /**
     * Inspect a single header.
     *
     * Provide the name of the header to inspect, for example, `User-Agent` or `Referer` . This setting isn't case sensitive.
     *
     * Example JSON: `"SingleHeader": { "Name": "haystack" }`
     *
     * Alternately, you can filter and inspect all headers with the `Headers` `FieldToMatch` setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-singleheader
     */
    readonly singleHeader?: any | cdk.IResolvable;

    /**
     * Inspect a single query argument.
     *
     * Provide the name of the query argument to inspect, such as *UserName* or *SalesRegion* . The name can be up to 30 characters long and isn't case sensitive.
     *
     * Example JSON: `"SingleQueryArgument": { "Name": "myArgument" }`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-singlequeryargument
     */
    readonly singleQueryArgument?: any | cdk.IResolvable;

    /**
     * Inspect the request URI path.
     *
     * This is the part of the web request that identifies a resource, for example, `/images/daily-ad.jpg` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-uripath
     */
    readonly uriPath?: any | cdk.IResolvable;
  }

  /**
   * Inspect the body of the web request as JSON. The body immediately follows the request headers.
   *
   * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
   *
   * Use the specifications in this object to indicate which parts of the JSON body to inspect using the rule's inspection criteria. AWS WAF inspects only the parts of the JSON that result from the matches that you indicate.
   *
   * Example JSON: `"JsonBody": { "MatchPattern": { "All": {} }, "MatchScope": "ALL" }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonbody.html
   */
  export interface JsonBodyProperty {
    /**
     * What AWS WAF should do if it fails to completely parse the JSON body. The options are the following:.
     *
     * - `EVALUATE_AS_STRING` - Inspect the body as plain text. AWS WAF applies the text transformations and inspection criteria that you defined for the JSON inspection to the body text string.
     * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
     * - `NO_MATCH` - Treat the web request as not matching the rule statement.
     *
     * If you don't provide this setting, AWS WAF parses and evaluates the content only up to the first parsing failure that it encounters.
     *
     * AWS WAF does its best to parse the entire JSON body, but might be forced to stop for reasons such as invalid characters, duplicate keys, truncation, and any content whose root node isn't an object or an array.
     *
     * AWS WAF parses the JSON in the following examples as two valid key, value pairs:
     *
     * - Missing comma: `{"key1":"value1""key2":"value2"}`
     * - Missing colon: `{"key1":"value1","key2""value2"}`
     * - Extra colons: `{"key1"::"value1","key2""value2"}`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonbody.html#cfn-wafv2-webacl-jsonbody-invalidfallbackbehavior
     */
    readonly invalidFallbackBehavior?: string;

    /**
     * The patterns to look for in the JSON body.
     *
     * AWS WAF inspects the results of these pattern matches against the rule inspection criteria.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonbody.html#cfn-wafv2-webacl-jsonbody-matchpattern
     */
    readonly matchPattern: cdk.IResolvable | CfnWebACL.JsonMatchPatternProperty;

    /**
     * The parts of the JSON to match against using the `MatchPattern` .
     *
     * If you specify `ALL` , AWS WAF matches against keys and values.
     *
     * `All` does not require a match to be found in the keys and a match to be found in the values. It requires a match to be found in the keys or the values or both. To require a match in the keys and in the values, use a logical `AND` statement to combine two match rules, one that inspects the keys and another that inspects the values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonbody.html#cfn-wafv2-webacl-jsonbody-matchscope
     */
    readonly matchScope: string;

    /**
     * What AWS WAF should do if the body is larger than AWS WAF can inspect.
     *
     * AWS WAF does not support inspecting the entire contents of the web request body if the body exceeds the limit for the resource type. If the body is larger than the limit, the underlying host service only forwards the contents that are below the limit to AWS WAF for inspection.
     *
     * The default limit is 8 KB (8,192 bytes) for regional resources and 16 KB (16,384 bytes) for CloudFront distributions. For CloudFront distributions, you can increase the limit in the web ACL `AssociationConfig` , for additional processing fees.
     *
     * The options for oversize handling are the following:
     *
     * - `CONTINUE` - Inspect the available body contents normally, according to the rule inspection criteria.
     * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
     * - `NO_MATCH` - Treat the web request as not matching the rule statement.
     *
     * You can combine the `MATCH` or `NO_MATCH` settings for oversize handling with your rule and web ACL action settings, so that you block any request whose body is over the limit.
     *
     * Default: `CONTINUE`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonbody.html#cfn-wafv2-webacl-jsonbody-oversizehandling
     */
    readonly oversizeHandling?: string;
  }

  /**
   * The patterns to look for in the JSON body.
   *
   * AWS WAF inspects the results of these pattern matches against the rule inspection criteria. This is used with the `FieldToMatch` option `JsonBody` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonmatchpattern.html
   */
  export interface JsonMatchPatternProperty {
    /**
     * Match all of the elements. See also `MatchScope` in the `JsonBody` `FieldToMatch` specification.
     *
     * You must specify either this setting or the `IncludedPaths` setting, but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonmatchpattern.html#cfn-wafv2-webacl-jsonmatchpattern-all
     */
    readonly all?: any | cdk.IResolvable;

    /**
     * Match only the specified include paths. See also `MatchScope` in the `JsonBody` `FieldToMatch` specification.
     *
     * Provide the include paths using JSON Pointer syntax. For example, `"IncludedPaths": ["/dogs/0/name", "/dogs/1/name"]` . For information about this syntax, see the Internet Engineering Task Force (IETF) documentation [JavaScript Object Notation (JSON) Pointer](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6901) .
     *
     * You must specify either this setting or the `All` setting, but not both.
     *
     * > Don't use this option to include all paths. Instead, use the `All` setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonmatchpattern.html#cfn-wafv2-webacl-jsonmatchpattern-includedpaths
     */
    readonly includedPaths?: Array<string>;
  }

  /**
   * Inspect all headers in the web request.
   *
   * You can specify the parts of the headers to inspect and you can narrow the set of headers to inspect by including or excluding specific keys.
   *
   * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
   *
   * If you want to inspect just the value of a single header, use the `SingleHeader` `FieldToMatch` setting instead.
   *
   * Example JSON: `"Headers": { "MatchPattern": { "All": {} }, "MatchScope": "KEY", "OversizeHandling": "MATCH" }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headers.html
   */
  export interface HeadersProperty {
    /**
     * The filter to use to identify the subset of headers to inspect in a web request.
     *
     * You must specify exactly one setting: either `All` , `IncludedHeaders` , or `ExcludedHeaders` .
     *
     * Example JSON: `"MatchPattern": { "ExcludedHeaders": [ "KeyToExclude1", "KeyToExclude2" ] }`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headers.html#cfn-wafv2-webacl-headers-matchpattern
     */
    readonly matchPattern: CfnWebACL.HeaderMatchPatternProperty | cdk.IResolvable;

    /**
     * The parts of the headers to match with the rule inspection criteria.
     *
     * If you specify `ALL` , AWS WAF inspects both keys and values.
     *
     * `All` does not require a match to be found in the keys and a match to be found in the values. It requires a match to be found in the keys or the values or both. To require a match in the keys and in the values, use a logical `AND` statement to combine two match rules, one that inspects the keys and another that inspects the values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headers.html#cfn-wafv2-webacl-headers-matchscope
     */
    readonly matchScope: string;

    /**
     * What AWS WAF should do if the headers of the request are more numerous or larger than AWS WAF can inspect.
     *
     * AWS WAF does not support inspecting the entire contents of request headers when they exceed 8 KB (8192 bytes) or 200 total headers. The underlying host service forwards a maximum of 200 headers and at most 8 KB of header contents to AWS WAF .
     *
     * The options for oversize handling are the following:
     *
     * - `CONTINUE` - Inspect the available headers normally, according to the rule inspection criteria.
     * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
     * - `NO_MATCH` - Treat the web request as not matching the rule statement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headers.html#cfn-wafv2-webacl-headers-oversizehandling
     */
    readonly oversizeHandling: string;
  }

  /**
   * The filter to use to identify the subset of headers to inspect in a web request.
   *
   * You must specify exactly one setting: either `All` , `IncludedHeaders` , or `ExcludedHeaders` .
   *
   * Example JSON: `"MatchPattern": { "ExcludedHeaders": [ "KeyToExclude1", "KeyToExclude2" ] }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headermatchpattern.html
   */
  export interface HeaderMatchPatternProperty {
    /**
     * Inspect all headers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headermatchpattern.html#cfn-wafv2-webacl-headermatchpattern-all
     */
    readonly all?: any | cdk.IResolvable;

    /**
     * Inspect only the headers whose keys don't match any of the strings specified here.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headermatchpattern.html#cfn-wafv2-webacl-headermatchpattern-excludedheaders
     */
    readonly excludedHeaders?: Array<string>;

    /**
     * Inspect only the headers that have a key that matches one of the strings specified here.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headermatchpattern.html#cfn-wafv2-webacl-headermatchpattern-includedheaders
     */
    readonly includedHeaders?: Array<string>;
  }

  /**
   * Inspect the cookies in the web request.
   *
   * You can specify the parts of the cookies to inspect and you can narrow the set of cookies to inspect by including or excluding specific keys.
   *
   * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
   *
   * Example JSON: `"Cookies": { "MatchPattern": { "All": {} }, "MatchScope": "KEY", "OversizeHandling": "MATCH" }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookies.html
   */
  export interface CookiesProperty {
    /**
     * The filter to use to identify the subset of cookies to inspect in a web request.
     *
     * You must specify exactly one setting: either `All` , `IncludedCookies` , or `ExcludedCookies` .
     *
     * Example JSON: `"MatchPattern": { "IncludedCookies": [ "session-id-time", "session-id" ] }`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookies.html#cfn-wafv2-webacl-cookies-matchpattern
     */
    readonly matchPattern: CfnWebACL.CookieMatchPatternProperty | cdk.IResolvable;

    /**
     * The parts of the cookies to inspect with the rule inspection criteria.
     *
     * If you specify `ALL` , AWS WAF inspects both keys and values.
     *
     * `All` does not require a match to be found in the keys and a match to be found in the values. It requires a match to be found in the keys or the values or both. To require a match in the keys and in the values, use a logical `AND` statement to combine two match rules, one that inspects the keys and another that inspects the values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookies.html#cfn-wafv2-webacl-cookies-matchscope
     */
    readonly matchScope: string;

    /**
     * What AWS WAF should do if the cookies of the request are more numerous or larger than AWS WAF can inspect.
     *
     * AWS WAF does not support inspecting the entire contents of request cookies when they exceed 8 KB (8192 bytes) or 200 total cookies. The underlying host service forwards a maximum of 200 cookies and at most 8 KB of cookie contents to AWS WAF .
     *
     * The options for oversize handling are the following:
     *
     * - `CONTINUE` - Inspect the available cookies normally, according to the rule inspection criteria.
     * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
     * - `NO_MATCH` - Treat the web request as not matching the rule statement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookies.html#cfn-wafv2-webacl-cookies-oversizehandling
     */
    readonly oversizeHandling: string;
  }

  /**
   * The filter to use to identify the subset of cookies to inspect in a web request.
   *
   * You must specify exactly one setting: either `All` , `IncludedCookies` , or `ExcludedCookies` .
   *
   * Example JSON: `"MatchPattern": { "IncludedCookies": [ "session-id-time", "session-id" ] }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookiematchpattern.html
   */
  export interface CookieMatchPatternProperty {
    /**
     * Inspect all cookies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookiematchpattern.html#cfn-wafv2-webacl-cookiematchpattern-all
     */
    readonly all?: any | cdk.IResolvable;

    /**
     * Inspect only the cookies whose keys don't match any of the strings specified here.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookiematchpattern.html#cfn-wafv2-webacl-cookiematchpattern-excludedcookies
     */
    readonly excludedCookies?: Array<string>;

    /**
     * Inspect only the cookies that have a key that matches one of the strings specified here.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookiematchpattern.html#cfn-wafv2-webacl-cookiematchpattern-includedcookies
     */
    readonly includedCookies?: Array<string>;
  }

  /**
   * Inspect the body of the web request. The body immediately follows the request headers.
   *
   * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-body.html
   */
  export interface BodyProperty {
    /**
     * What AWS WAF should do if the body is larger than AWS WAF can inspect.
     *
     * AWS WAF does not support inspecting the entire contents of the web request body if the body exceeds the limit for the resource type. If the body is larger than the limit, the underlying host service only forwards the contents that are below the limit to AWS WAF for inspection.
     *
     * The default limit is 8 KB (8,192 bytes) for regional resources and 16 KB (16,384 bytes) for CloudFront distributions. For CloudFront distributions, you can increase the limit in the web ACL `AssociationConfig` , for additional processing fees.
     *
     * The options for oversize handling are the following:
     *
     * - `CONTINUE` - Inspect the available body contents normally, according to the rule inspection criteria.
     * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
     * - `NO_MATCH` - Treat the web request as not matching the rule statement.
     *
     * You can combine the `MATCH` or `NO_MATCH` settings for oversize handling with your rule and web ACL action settings, so that you block any request whose body is over the limit.
     *
     * Default: `CONTINUE`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-body.html#cfn-wafv2-webacl-body-oversizehandling
     */
    readonly oversizeHandling?: string;
  }

  /**
   * A logical rule statement used to combine other rule statements with AND logic.
   *
   * You provide more than one `Statement` within the `AndStatement` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-andstatement.html
   */
  export interface AndStatementProperty {
    /**
     * The statements to combine with AND logic.
     *
     * You can use any statements that can be nested.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-andstatement.html#cfn-wafv2-webacl-andstatement-statements
     */
    readonly statements: Array<cdk.IResolvable | CfnWebACL.StatementProperty> | cdk.IResolvable;
  }

  /**
   * A rule statement that inspects for cross-site scripting (XSS) attacks.
   *
   * In XSS attacks, the attacker uses vulnerabilities in a benign website as a vehicle to inject malicious client-site scripts into other legitimate web browsers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-xssmatchstatement.html
   */
  export interface XssMatchStatementProperty {
    /**
     * The part of the web request that you want AWS WAF to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-xssmatchstatement.html#cfn-wafv2-webacl-xssmatchstatement-fieldtomatch
     */
    readonly fieldToMatch: CfnWebACL.FieldToMatchProperty | cdk.IResolvable;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-xssmatchstatement.html#cfn-wafv2-webacl-xssmatchstatement-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnWebACL.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * A logical rule statement used to negate the results of another rule statement.
   *
   * You provide one `Statement` within the `NotStatement` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-notstatement.html
   */
  export interface NotStatementProperty {
    /**
     * The statement to negate.
     *
     * You can use any statement that can be nested.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-notstatement.html#cfn-wafv2-webacl-notstatement-statement
     */
    readonly statement: cdk.IResolvable | CfnWebACL.StatementProperty;
  }

  /**
   * A rule statement that defines a string match search for AWS WAF to apply to web requests.
   *
   * The byte match statement provides the bytes to search for, the location in requests that you want AWS WAF to search, and other settings. The bytes to search for are typically a string that corresponds with ASCII characters. In the AWS WAF console and the developer guide, this is called a string match statement.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-bytematchstatement.html
   */
  export interface ByteMatchStatementProperty {
    /**
     * The part of the web request that you want AWS WAF to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-bytematchstatement.html#cfn-wafv2-webacl-bytematchstatement-fieldtomatch
     */
    readonly fieldToMatch: CfnWebACL.FieldToMatchProperty | cdk.IResolvable;

    /**
     * The area within the portion of the web request that you want AWS WAF to search for `SearchString` .
     *
     * Valid values include the following:
     *
     * *CONTAINS*
     *
     * The specified part of the web request must include the value of `SearchString` , but the location doesn't matter.
     *
     * *CONTAINS_WORD*
     *
     * The specified part of the web request must include the value of `SearchString` , and `SearchString` must contain only alphanumeric characters or underscore (A-Z, a-z, 0-9, or _). In addition, `SearchString` must be a word, which means that both of the following are true:
     *
     * - `SearchString` is at the beginning of the specified part of the web request or is preceded by a character other than an alphanumeric character or underscore (_). Examples include the value of a header and `;BadBot` .
     * - `SearchString` is at the end of the specified part of the web request or is followed by a character other than an alphanumeric character or underscore (_), for example, `BadBot;` and `-BadBot;` .
     *
     * *EXACTLY*
     *
     * The value of the specified part of the web request must exactly match the value of `SearchString` .
     *
     * *STARTS_WITH*
     *
     * The value of `SearchString` must appear at the beginning of the specified part of the web request.
     *
     * *ENDS_WITH*
     *
     * The value of `SearchString` must appear at the end of the specified part of the web request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-bytematchstatement.html#cfn-wafv2-webacl-bytematchstatement-positionalconstraint
     */
    readonly positionalConstraint: string;

    /**
     * A string value that you want AWS WAF to search for.
     *
     * AWS WAF searches only in the part of web requests that you designate for inspection in `FieldToMatch` . The maximum length of the value is 200 bytes. For alphabetic characters A-Z and a-z, the value is case sensitive.
     *
     * Don't encode this string. Provide the value that you want AWS WAF to search for. AWS CloudFormation automatically base64 encodes the value for you.
     *
     * For example, suppose the value of `Type` is `HEADER` and the value of `Data` is `User-Agent` . If you want to search the `User-Agent` header for the value `BadBot` , you provide the string `BadBot` in the value of `SearchString` .
     *
     * You must specify either `SearchString` or `SearchStringBase64` in a `ByteMatchStatement` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-bytematchstatement.html#cfn-wafv2-webacl-bytematchstatement-searchstring
     */
    readonly searchString?: string;

    /**
     * String to search for in a web request component, base64-encoded.
     *
     * If you don't want to encode the string, specify the unencoded value in `SearchString` instead.
     *
     * You must specify either `SearchString` or `SearchStringBase64` in a `ByteMatchStatement` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-bytematchstatement.html#cfn-wafv2-webacl-bytematchstatement-searchstringbase64
     */
    readonly searchStringBase64?: string;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-bytematchstatement.html#cfn-wafv2-webacl-bytematchstatement-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnWebACL.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * A rate-based rule counts incoming requests and rate limits requests when they are coming at too fast a rate.
   *
   * The rule categorizes requests according to your aggregation criteria, collects them into aggregation instances, and counts and rate limits the requests for each instance.
   *
   * You can specify individual aggregation keys, like IP address or HTTP method. You can also specify aggregation key combinations, like IP address and HTTP method, or HTTP method, query argument, and cookie.
   *
   * Each unique set of values for the aggregation keys that you specify is a separate aggregation instance, with the value from each key contributing to the aggregation instance definition.
   *
   * For example, assume the rule evaluates web requests with the following IP address and HTTP method values:
   *
   * - IP address 10.1.1.1, HTTP method POST
   * - IP address 10.1.1.1, HTTP method GET
   * - IP address 127.0.0.0, HTTP method POST
   * - IP address 10.1.1.1, HTTP method GET
   *
   * The rule would create different aggregation instances according to your aggregation criteria, for example:
   *
   * - If the aggregation criteria is just the IP address, then each individual address is an aggregation instance, and AWS WAF counts requests separately for each. The aggregation instances and request counts for our example would be the following:
   *
   * - IP address 10.1.1.1: count 3
   * - IP address 127.0.0.0: count 1
   * - If the aggregation criteria is HTTP method, then each individual HTTP method is an aggregation instance. The aggregation instances and request counts for our example would be the following:
   *
   * - HTTP method POST: count 2
   * - HTTP method GET: count 2
   * - If the aggregation criteria is IP address and HTTP method, then each IP address and each HTTP method would contribute to the combined aggregation instance. The aggregation instances and request counts for our example would be the following:
   *
   * - IP address 10.1.1.1, HTTP method POST: count 1
   * - IP address 10.1.1.1, HTTP method GET: count 2
   * - IP address 127.0.0.0, HTTP method POST: count 1
   *
   * For any n-tuple of aggregation keys, each unique combination of values for the keys defines a separate aggregation instance, which AWS WAF counts and rate-limits individually.
   *
   * You can optionally nest another statement inside the rate-based statement, to narrow the scope of the rule so that it only counts and rate limits requests that match the nested statement. You can use this nested scope-down statement in conjunction with your aggregation key specifications or you can just count and rate limit all requests that match the scope-down statement, without additional aggregation. When you choose to just manage all requests that match a scope-down statement, the aggregation instance is singular for the rule.
   *
   * You cannot nest a `RateBasedStatement` inside another statement, for example inside a `NotStatement` or `OrStatement` . You can define a `RateBasedStatement` inside a web ACL and inside a rule group.
   *
   * For additional information about the options, see [Rate limiting web requests using rate-based rules](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rate-based-rules.html) in the *AWS WAF Developer Guide* .
   *
   * If you only aggregate on the individual IP address or forwarded IP address, you can retrieve the list of IP addresses that AWS WAF is currently rate limiting for a rule through the API call `GetRateBasedStatementManagedKeys` . This option is not available for other aggregation configurations.
   *
   * AWS WAF tracks and manages web requests separately for each instance of a rate-based rule that you use. For example, if you provide the same rate-based rule settings in two web ACLs, each of the two rule statements represents a separate instance of the rate-based rule and gets its own tracking and management by AWS WAF . If you define a rate-based rule inside a rule group, and then use that rule group in multiple places, each use creates a separate instance of the rate-based rule that gets its own tracking and management by AWS WAF .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatement.html
   */
  export interface RateBasedStatementProperty {
    /**
     * Setting that indicates how to aggregate the request counts.
     *
     * > Web requests that are missing any of the components specified in the aggregation keys are omitted from the rate-based rule evaluation and handling.
     *
     * - `CONSTANT` - Count and limit the requests that match the rate-based rule's scope-down statement. With this option, the counted requests aren't further aggregated. The scope-down statement is the only specification used. When the count of all requests that satisfy the scope-down statement goes over the limit, AWS WAF applies the rule action to all requests that satisfy the scope-down statement.
     *
     * With this option, you must configure the `ScopeDownStatement` property.
     * - `CUSTOM_KEYS` - Aggregate the request counts using one or more web request components as the aggregate keys.
     *
     * With this option, you must specify the aggregate keys in the `CustomKeys` property.
     *
     * To aggregate on only the IP address or only the forwarded IP address, don't use custom keys. Instead, set the aggregate key type to `IP` or `FORWARDED_IP` .
     * - `FORWARDED_IP` - Aggregate the request counts on the first IP address in an HTTP header.
     *
     * With this option, you must specify the header to use in the `ForwardedIPConfig` property.
     *
     * To aggregate on a combination of the forwarded IP address with other aggregate keys, use `CUSTOM_KEYS` .
     * - `IP` - Aggregate the request counts on the IP address from the web request origin.
     *
     * To aggregate on a combination of the IP address with other aggregate keys, use `CUSTOM_KEYS` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatement.html#cfn-wafv2-webacl-ratebasedstatement-aggregatekeytype
     */
    readonly aggregateKeyType: string;

    /**
     * Specifies the aggregate keys to use in a rate-base rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatement.html#cfn-wafv2-webacl-ratebasedstatement-customkeys
     */
    readonly customKeys?: Array<cdk.IResolvable | CfnWebACL.RateBasedStatementCustomKeyProperty> | cdk.IResolvable;

    /**
     * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin.
     *
     * Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * This is required if you specify a forwarded IP in the rule's aggregate key settings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatement.html#cfn-wafv2-webacl-ratebasedstatement-forwardedipconfig
     */
    readonly forwardedIpConfig?: CfnWebACL.ForwardedIPConfigurationProperty | cdk.IResolvable;

    /**
     * The limit on requests per 5-minute period for a single aggregation instance for the rate-based rule.
     *
     * If the rate-based statement includes a `ScopeDownStatement` , this limit is applied only to the requests that match the statement.
     *
     * Examples:
     *
     * - If you aggregate on just the IP address, this is the limit on requests from any single IP address.
     * - If you aggregate on the HTTP method and the query argument name "city", then this is the limit on requests for any single method, city pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatement.html#cfn-wafv2-webacl-ratebasedstatement-limit
     */
    readonly limit: number;

    /**
     * An optional nested statement that narrows the scope of the web requests that are evaluated and managed by the rate-based statement.
     *
     * When you use a scope-down statement, the rate-based rule only tracks and rate limits requests that match the scope-down statement. You can use any nestable `Statement` in the scope-down statement, and you can nest statements at any level, the same as you can for a rule statement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatement.html#cfn-wafv2-webacl-ratebasedstatement-scopedownstatement
     */
    readonly scopeDownStatement?: cdk.IResolvable | CfnWebACL.StatementProperty;
  }

  /**
   * Specifies a single custom aggregate key for a rate-base rule.
   *
   * > Web requests that are missing any of the components specified in the aggregation keys are omitted from the rate-based rule evaluation and handling.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatementcustomkey.html
   */
  export interface RateBasedStatementCustomKeyProperty {
    /**
     * Use the value of a cookie in the request as an aggregate key.
     *
     * Each distinct value in the cookie contributes to the aggregation instance. If you use a single cookie as your custom key, then each value fully defines an aggregation instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatementcustomkey.html#cfn-wafv2-webacl-ratebasedstatementcustomkey-cookie
     */
    readonly cookie?: cdk.IResolvable | CfnWebACL.RateLimitCookieProperty;

    /**
     * Use the first IP address in an HTTP header as an aggregate key.
     *
     * Each distinct forwarded IP address contributes to the aggregation instance.
     *
     * When you specify an IP or forwarded IP in the custom key settings, you must also specify at least one other key to use. You can aggregate on only the forwarded IP address by specifying `FORWARDED_IP` in your rate-based statement's `AggregateKeyType` .
     *
     * With this option, you must specify the header to use in the rate-based rule's `ForwardedIPConfig` property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatementcustomkey.html#cfn-wafv2-webacl-ratebasedstatementcustomkey-forwardedip
     */
    readonly forwardedIp?: any | cdk.IResolvable;

    /**
     * Use the value of a header in the request as an aggregate key.
     *
     * Each distinct value in the header contributes to the aggregation instance. If you use a single header as your custom key, then each value fully defines an aggregation instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatementcustomkey.html#cfn-wafv2-webacl-ratebasedstatementcustomkey-header
     */
    readonly header?: cdk.IResolvable | CfnWebACL.RateLimitHeaderProperty;

    /**
     * Use the request's HTTP method as an aggregate key.
     *
     * Each distinct HTTP method contributes to the aggregation instance. If you use just the HTTP method as your custom key, then each method fully defines an aggregation instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatementcustomkey.html#cfn-wafv2-webacl-ratebasedstatementcustomkey-httpmethod
     */
    readonly httpMethod?: any | cdk.IResolvable;

    /**
     * Use the request's originating IP address as an aggregate key. Each distinct IP address contributes to the aggregation instance.
     *
     * When you specify an IP or forwarded IP in the custom key settings, you must also specify at least one other key to use. You can aggregate on only the IP address by specifying `IP` in your rate-based statement's `AggregateKeyType` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatementcustomkey.html#cfn-wafv2-webacl-ratebasedstatementcustomkey-ip
     */
    readonly ip?: any | cdk.IResolvable;

    /**
     * Use the specified label namespace as an aggregate key.
     *
     * Each distinct fully qualified label name that has the specified label namespace contributes to the aggregation instance. If you use just one label namespace as your custom key, then each label name fully defines an aggregation instance.
     *
     * This uses only labels that have been added to the request by rules that are evaluated before this rate-based rule in the web ACL.
     *
     * For information about label namespaces and names, see [Label syntax and naming requirements](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-label-requirements.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatementcustomkey.html#cfn-wafv2-webacl-ratebasedstatementcustomkey-labelnamespace
     */
    readonly labelNamespace?: cdk.IResolvable | CfnWebACL.RateLimitLabelNamespaceProperty;

    /**
     * Use the specified query argument as an aggregate key.
     *
     * Each distinct value for the named query argument contributes to the aggregation instance. If you use a single query argument as your custom key, then each value fully defines an aggregation instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatementcustomkey.html#cfn-wafv2-webacl-ratebasedstatementcustomkey-queryargument
     */
    readonly queryArgument?: cdk.IResolvable | CfnWebACL.RateLimitQueryArgumentProperty;

    /**
     * Use the request's query string as an aggregate key.
     *
     * Each distinct string contributes to the aggregation instance. If you use just the query string as your custom key, then each string fully defines an aggregation instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatementcustomkey.html#cfn-wafv2-webacl-ratebasedstatementcustomkey-querystring
     */
    readonly queryString?: cdk.IResolvable | CfnWebACL.RateLimitQueryStringProperty;

    /**
     * Use the request's URI path as an aggregate key.
     *
     * Each distinct URI path contributes to the aggregation instance. If you use just the URI path as your custom key, then each URI path fully defines an aggregation instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatementcustomkey.html#cfn-wafv2-webacl-ratebasedstatementcustomkey-uripath
     */
    readonly uriPath?: cdk.IResolvable | CfnWebACL.RateLimitUriPathProperty;
  }

  /**
   * Specifies a cookie as an aggregate key for a rate-based rule.
   *
   * Each distinct value in the cookie contributes to the aggregation instance. If you use a single cookie as your custom key, then each value fully defines an aggregation instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratelimitcookie.html
   */
  export interface RateLimitCookieProperty {
    /**
     * The name of the cookie to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratelimitcookie.html#cfn-wafv2-webacl-ratelimitcookie-name
     */
    readonly name: string;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * Text transformations are used in rule match statements, to transform the `FieldToMatch` request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, AWS WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratelimitcookie.html#cfn-wafv2-webacl-ratelimitcookie-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnWebACL.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * Specifies a query argument in the request as an aggregate key for a rate-based rule.
   *
   * Each distinct value for the named query argument contributes to the aggregation instance. If you use a single query argument as your custom key, then each value fully defines an aggregation instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratelimitqueryargument.html
   */
  export interface RateLimitQueryArgumentProperty {
    /**
     * The name of the query argument to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratelimitqueryargument.html#cfn-wafv2-webacl-ratelimitqueryargument-name
     */
    readonly name: string;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * Text transformations are used in rule match statements, to transform the `FieldToMatch` request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, AWS WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratelimitqueryargument.html#cfn-wafv2-webacl-ratelimitqueryargument-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnWebACL.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * Specifies a header as an aggregate key for a rate-based rule.
   *
   * Each distinct value in the header contributes to the aggregation instance. If you use a single header as your custom key, then each value fully defines an aggregation instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratelimitheader.html
   */
  export interface RateLimitHeaderProperty {
    /**
     * The name of the header to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratelimitheader.html#cfn-wafv2-webacl-ratelimitheader-name
     */
    readonly name: string;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * Text transformations are used in rule match statements, to transform the `FieldToMatch` request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, AWS WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratelimitheader.html#cfn-wafv2-webacl-ratelimitheader-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnWebACL.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * Specifies the request's query string as an aggregate key for a rate-based rule.
   *
   * Each distinct string contributes to the aggregation instance. If you use just the query string as your custom key, then each string fully defines an aggregation instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratelimitquerystring.html
   */
  export interface RateLimitQueryStringProperty {
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * Text transformations are used in rule match statements, to transform the `FieldToMatch` request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, AWS WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratelimitquerystring.html#cfn-wafv2-webacl-ratelimitquerystring-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnWebACL.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * Specifies the request's URI path as an aggregate key for a rate-based rule.
   *
   * Each distinct URI path contributes to the aggregation instance. If you use just the URI path as your custom key, then each URI path fully defines an aggregation instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratelimituripath.html
   */
  export interface RateLimitUriPathProperty {
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * Text transformations are used in rule match statements, to transform the `FieldToMatch` request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, AWS WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratelimituripath.html#cfn-wafv2-webacl-ratelimituripath-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnWebACL.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * Specifies a label namespace to use as an aggregate key for a rate-based rule.
   *
   * Each distinct fully qualified label name that has the specified label namespace contributes to the aggregation instance. If you use just one label namespace as your custom key, then each label name fully defines an aggregation instance.
   *
   * This uses only labels that have been added to the request by rules that are evaluated before this rate-based rule in the web ACL.
   *
   * For information about label namespaces and names, see [Label syntax and naming requirements](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-label-requirements.html) in the *AWS WAF Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratelimitlabelnamespace.html
   */
  export interface RateLimitLabelNamespaceProperty {
    /**
     * The namespace to use for aggregation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratelimitlabelnamespace.html#cfn-wafv2-webacl-ratelimitlabelnamespace-namespace
     */
    readonly namespace: string;
  }

  /**
   * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin.
   *
   * Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
   *
   * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
   *
   * This configuration is used for `GeoMatchStatement` and `RateBasedStatement` . For `IPSetReferenceStatement` , use `IPSetForwardedIPConfig` instead.
   *
   * AWS WAF only evaluates the first IP address found in the specified HTTP header.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-forwardedipconfiguration.html
   */
  export interface ForwardedIPConfigurationProperty {
    /**
     * The match status to assign to the web request if the request doesn't have a valid IP address in the specified position.
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * You can specify the following fallback behaviors:
     *
     * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
     * - `NO_MATCH` - Treat the web request as not matching the rule statement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-forwardedipconfiguration.html#cfn-wafv2-webacl-forwardedipconfiguration-fallbackbehavior
     */
    readonly fallbackBehavior: string;

    /**
     * The name of the HTTP header to use for the IP address.
     *
     * For example, to use the X-Forwarded-For (XFF) header, set this to `X-Forwarded-For` .
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-forwardedipconfiguration.html#cfn-wafv2-webacl-forwardedipconfiguration-headername
     */
    readonly headerName: string;
  }

  /**
   * A rule statement that labels web requests by country and region and that matches against web requests based on country code.
   *
   * A geo match rule labels every request that it inspects regardless of whether it finds a match.
   *
   * - To manage requests only by country, you can use this statement by itself and specify the countries that you want to match against in the `CountryCodes` array.
   * - Otherwise, configure your geo match rule with Count action so that it only labels requests. Then, add one or more label match rules to run after the geo match rule and configure them to match against the geographic labels and handle the requests as needed.
   *
   * AWS WAF labels requests using the alpha-2 country and region codes from the International Organization for Standardization (ISO) 3166 standard. AWS WAF determines the codes using either the IP address in the web request origin or, if you specify it, the address in the geo match `ForwardedIPConfig` .
   *
   * If you use the web request origin, the label formats are `awswaf:clientip:geo:region:<ISO country code>-<ISO region code>` and `awswaf:clientip:geo:country:<ISO country code>` .
   *
   * If you use a forwarded IP address, the label formats are `awswaf:forwardedip:geo:region:<ISO country code>-<ISO region code>` and `awswaf:forwardedip:geo:country:<ISO country code>` .
   *
   * For additional details, see [Geographic match rule statement](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-geo-match.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-geomatchstatement.html
   */
  export interface GeoMatchStatementProperty {
    /**
     * An array of two-character country codes that you want to match against, for example, `[ "US", "CN" ]` , from the alpha-2 country ISO codes of the ISO 3166 international standard.
     *
     * When you use a geo match statement just for the region and country labels that it adds to requests, you still have to supply a country code for the rule to evaluate. In this case, you configure the rule to only count matching requests, but it will still generate logging and count metrics for any matches. You can reduce the logging and metrics that the rule produces by specifying a country that's unlikely to be a source of traffic to your site.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-geomatchstatement.html#cfn-wafv2-webacl-geomatchstatement-countrycodes
     */
    readonly countryCodes?: Array<string>;

    /**
     * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin.
     *
     * Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-geomatchstatement.html#cfn-wafv2-webacl-geomatchstatement-forwardedipconfig
     */
    readonly forwardedIpConfig?: CfnWebACL.ForwardedIPConfigurationProperty | cdk.IResolvable;
  }

  /**
   * A rule statement used to run the rules that are defined in a `RuleGroup` .
   *
   * To use this, create a rule group with your rules, then provide the ARN of the rule group in this statement.
   *
   * You cannot nest a `RuleGroupReferenceStatement` , for example for use inside a `NotStatement` or `OrStatement` . You cannot use a rule group reference statement inside another rule group. You can only reference a rule group as a top-level statement within a rule that you define in a web ACL.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rulegroupreferencestatement.html
   */
  export interface RuleGroupReferenceStatementProperty {
    /**
     * The Amazon Resource Name (ARN) of the entity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rulegroupreferencestatement.html#cfn-wafv2-webacl-rulegroupreferencestatement-arn
     */
    readonly arn: string;

    /**
     * Rules in the referenced rule group whose actions are set to `Count` .
     *
     * > Instead of this option, use `RuleActionOverrides` . It accepts any valid action setting, including `Count` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rulegroupreferencestatement.html#cfn-wafv2-webacl-rulegroupreferencestatement-excludedrules
     */
    readonly excludedRules?: Array<CfnWebACL.ExcludedRuleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Action settings to use in the place of the rule actions that are configured inside the rule group.
     *
     * You specify one override for each rule whose action you want to change.
     *
     * You can use overrides for testing, for example you can override all of rule actions to `Count` and then monitor the resulting count metrics to understand how the rule group would handle your web traffic. You can also permanently override some or all actions, to modify how the rule group manages your web traffic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rulegroupreferencestatement.html#cfn-wafv2-webacl-rulegroupreferencestatement-ruleactionoverrides
     */
    readonly ruleActionOverrides?: Array<cdk.IResolvable | CfnWebACL.RuleActionOverrideProperty> | cdk.IResolvable;
  }

  /**
   * Action setting to use in the place of a rule action that is configured inside the rule group.
   *
   * You specify one override for each rule whose action you want to change.
   *
   * You can use overrides for testing, for example you can override all of rule actions to `Count` and then monitor the resulting count metrics to understand how the rule group would handle your web traffic. You can also permanently override some or all actions, to modify how the rule group manages your web traffic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleactionoverride.html
   */
  export interface RuleActionOverrideProperty {
    /**
     * The override action to use, in place of the configured action of the rule in the rule group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleactionoverride.html#cfn-wafv2-webacl-ruleactionoverride-actiontouse
     */
    readonly actionToUse: cdk.IResolvable | CfnWebACL.RuleActionProperty;

    /**
     * The name of the rule to override.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleactionoverride.html#cfn-wafv2-webacl-ruleactionoverride-name
     */
    readonly name: string;
  }

  /**
   * Specifies a single rule in a rule group whose action you want to override to `Count` .
   *
   * > Instead of this option, use `RuleActionOverrides` . It accepts any valid action setting, including `Count` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-excludedrule.html
   */
  export interface ExcludedRuleProperty {
    /**
     * The name of the rule whose action you want to override to `Count` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-excludedrule.html#cfn-wafv2-webacl-excludedrule-name
     */
    readonly name: string;
  }

  /**
   * A rule statement to match against labels that have been added to the web request by rules that have already run in the web ACL.
   *
   * The label match statement provides the label or namespace string to search for. The label string can represent a part or all of the fully qualified label name that had been added to the web request. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label. If you do not provide the fully qualified name in your label match string, AWS WAF performs the search for labels that were added in the same context as the label match statement.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-labelmatchstatement.html
   */
  export interface LabelMatchStatementProperty {
    /**
     * The string to match against. The setting you provide for this depends on the match statement's `Scope` setting:.
     *
     * - If the `Scope` indicates `LABEL` , then this specification must include the name and can include any number of preceding namespace specifications and prefix up to providing the fully qualified label name.
     * - If the `Scope` indicates `NAMESPACE` , then this specification can include any number of contiguous namespace strings, and can include the entire label namespace prefix from the rule group or web ACL where the label originates.
     *
     * Labels are case sensitive and components of a label must be separated by colon, for example `NS1:NS2:name` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-labelmatchstatement.html#cfn-wafv2-webacl-labelmatchstatement-key
     */
    readonly key: string;

    /**
     * Specify whether you want to match using the label name or just the namespace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-labelmatchstatement.html#cfn-wafv2-webacl-labelmatchstatement-scope
     */
    readonly scope: string;
  }

  /**
   * A rule statement used to search web request components for a match against a single regular expression.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexmatchstatement.html
   */
  export interface RegexMatchStatementProperty {
    /**
     * The part of the web request that you want AWS WAF to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexmatchstatement.html#cfn-wafv2-webacl-regexmatchstatement-fieldtomatch
     */
    readonly fieldToMatch: CfnWebACL.FieldToMatchProperty | cdk.IResolvable;

    /**
     * The string representing the regular expression.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexmatchstatement.html#cfn-wafv2-webacl-regexmatchstatement-regexstring
     */
    readonly regexString: string;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexmatchstatement.html#cfn-wafv2-webacl-regexmatchstatement-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnWebACL.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * A rule statement that inspects for malicious SQL code.
   *
   * Attackers insert malicious SQL code into web requests to do things like modify your database or extract data from it.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sqlimatchstatement.html
   */
  export interface SqliMatchStatementProperty {
    /**
     * The part of the web request that you want AWS WAF to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sqlimatchstatement.html#cfn-wafv2-webacl-sqlimatchstatement-fieldtomatch
     */
    readonly fieldToMatch: CfnWebACL.FieldToMatchProperty | cdk.IResolvable;

    /**
     * The sensitivity that you want AWS WAF to use to inspect for SQL injection attacks.
     *
     * `HIGH` detects more attacks, but might generate more false positives, especially if your web requests frequently contain unusual strings. For information about identifying and mitigating false positives, see [Testing and tuning](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html) in the *AWS WAF Developer Guide* .
     *
     * `LOW` is generally a better choice for resources that already have other protections against SQL injection attacks or that have a low tolerance for false positives.
     *
     * Default: `LOW`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sqlimatchstatement.html#cfn-wafv2-webacl-sqlimatchstatement-sensitivitylevel
     */
    readonly sensitivityLevel?: string;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sqlimatchstatement.html#cfn-wafv2-webacl-sqlimatchstatement-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnWebACL.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * A rule statement used to search web request components for matches with regular expressions.
   *
   * To use this, create a `RegexPatternSet` that specifies the expressions that you want to detect, then use that set in this statement. A web request matches the pattern set rule statement if the request component matches any of the patterns in the set.
   *
   * Each regex pattern set rule statement references a regex pattern set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexpatternsetreferencestatement.html
   */
  export interface RegexPatternSetReferenceStatementProperty {
    /**
     * The Amazon Resource Name (ARN) of the `RegexPatternSet` that this statement references.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexpatternsetreferencestatement.html#cfn-wafv2-webacl-regexpatternsetreferencestatement-arn
     */
    readonly arn: string;

    /**
     * The part of the web request that you want AWS WAF to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexpatternsetreferencestatement.html#cfn-wafv2-webacl-regexpatternsetreferencestatement-fieldtomatch
     */
    readonly fieldToMatch: CfnWebACL.FieldToMatchProperty | cdk.IResolvable;

    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexpatternsetreferencestatement.html#cfn-wafv2-webacl-regexpatternsetreferencestatement-texttransformations
     */
    readonly textTransformations: Array<cdk.IResolvable | CfnWebACL.TextTransformationProperty> | cdk.IResolvable;
  }

  /**
   * A logical rule statement used to combine other rule statements with OR logic.
   *
   * You provide more than one `Statement` within the `OrStatement` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-orstatement.html
   */
  export interface OrStatementProperty {
    /**
     * The statements to combine with OR logic.
     *
     * You can use any statements that can be nested.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-orstatement.html#cfn-wafv2-webacl-orstatement-statements
     */
    readonly statements: Array<cdk.IResolvable | CfnWebACL.StatementProperty> | cdk.IResolvable;
  }

  /**
   * A rule statement used to run the rules that are defined in a managed rule group.
   *
   * To use this, provide the vendor name and the name of the rule group in this statement. You can retrieve the required names through the API call `ListAvailableManagedRuleGroups` .
   *
   * You cannot nest a `ManagedRuleGroupStatement` , for example for use inside a `NotStatement` or `OrStatement` . You cannot use a managed rule group statement inside another rule group. You can only use a managed rule group statement as a top-level statement in a rule that you define in a web ACL.
   *
   * > You are charged additional fees when you use the AWS WAF Bot Control managed rule group `AWSManagedRulesBotControlRuleSet` , the AWS WAF Fraud Control account takeover prevention (ATP) managed rule group `AWSManagedRulesATPRuleSet` , or the AWS WAF Fraud Control account creation fraud prevention (ACFP) managed rule group `AWSManagedRulesACFPRuleSet` . For more information, see [AWS WAF Pricing](https://docs.aws.amazon.com/waf/pricing/) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html
   */
  export interface ManagedRuleGroupStatementProperty {
    /**
     * Rules in the referenced rule group whose actions are set to `Count` .
     *
     * > Instead of this option, use `RuleActionOverrides` . It accepts any valid action setting, including `Count` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html#cfn-wafv2-webacl-managedrulegroupstatement-excludedrules
     */
    readonly excludedRules?: Array<CfnWebACL.ExcludedRuleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Additional information that's used by a managed rule group. Many managed rule groups don't require this.
     *
     * The rule groups used for intelligent threat mitigation require additional configuration:
     *
     * - Use the `AWSManagedRulesACFPRuleSet` configuration object to configure the account creation fraud prevention managed rule group. The configuration includes the registration and sign-up pages of your application and the locations in the account creation request payload of data, such as the user email and phone number fields.
     * - Use the `AWSManagedRulesATPRuleSet` configuration object to configure the account takeover prevention managed rule group. The configuration includes the sign-in page of your application and the locations in the login request payload of data such as the username and password.
     * - Use the `AWSManagedRulesBotControlRuleSet` configuration object to configure the protection level that you want the Bot Control rule group to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html#cfn-wafv2-webacl-managedrulegroupstatement-managedrulegroupconfigs
     */
    readonly managedRuleGroupConfigs?: Array<cdk.IResolvable | CfnWebACL.ManagedRuleGroupConfigProperty> | cdk.IResolvable;

    /**
     * The name of the managed rule group.
     *
     * You use this, along with the vendor name, to identify the rule group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html#cfn-wafv2-webacl-managedrulegroupstatement-name
     */
    readonly name: string;

    /**
     * Action settings to use in the place of the rule actions that are configured inside the rule group.
     *
     * You specify one override for each rule whose action you want to change.
     *
     * You can use overrides for testing, for example you can override all of rule actions to `Count` and then monitor the resulting count metrics to understand how the rule group would handle your web traffic. You can also permanently override some or all actions, to modify how the rule group manages your web traffic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html#cfn-wafv2-webacl-managedrulegroupstatement-ruleactionoverrides
     */
    readonly ruleActionOverrides?: Array<cdk.IResolvable | CfnWebACL.RuleActionOverrideProperty> | cdk.IResolvable;

    /**
     * An optional nested statement that narrows the scope of the web requests that are evaluated by the managed rule group.
     *
     * Requests are only evaluated by the rule group if they match the scope-down statement. You can use any nestable `Statement` in the scope-down statement, and you can nest statements at any level, the same as you can for a rule statement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html#cfn-wafv2-webacl-managedrulegroupstatement-scopedownstatement
     */
    readonly scopeDownStatement?: cdk.IResolvable | CfnWebACL.StatementProperty;

    /**
     * The name of the managed rule group vendor.
     *
     * You use this, along with the rule group name, to identify a rule group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html#cfn-wafv2-webacl-managedrulegroupstatement-vendorname
     */
    readonly vendorName: string;

    /**
     * The version of the managed rule group to use.
     *
     * If you specify this, the version setting is fixed until you change it. If you don't specify this, AWS WAF uses the vendor's default version, and then keeps the version at the vendor's default when the vendor updates the managed rule group settings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html#cfn-wafv2-webacl-managedrulegroupstatement-version
     */
    readonly version?: string;
  }

  /**
   * Additional information that's used by a managed rule group. Many managed rule groups don't require this.
   *
   * The rule groups used for intelligent threat mitigation require additional configuration:
   *
   * - Use the `AWSManagedRulesACFPRuleSet` configuration object to configure the account creation fraud prevention managed rule group. The configuration includes the registration and sign-up pages of your application and the locations in the account creation request payload of data, such as the user email and phone number fields.
   * - Use the `AWSManagedRulesATPRuleSet` configuration object to configure the account takeover prevention managed rule group. The configuration includes the sign-in page of your application and the locations in the login request payload of data such as the username and password.
   * - Use the `AWSManagedRulesBotControlRuleSet` configuration object to configure the protection level that you want the Bot Control rule group to use.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupconfig.html
   */
  export interface ManagedRuleGroupConfigProperty {
    /**
     * Additional configuration for using the account creation fraud prevention (ACFP) managed rule group, `AWSManagedRulesACFPRuleSet` .
     *
     * Use this to provide account creation request information to the rule group. For web ACLs that protect CloudFront distributions, use this to also provide the information about how your distribution responds to account creation requests.
     *
     * For information about using the ACFP managed rule group, see [AWS WAF Fraud Control account creation fraud prevention (ACFP) rule group](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-acfp.html) and [AWS WAF Fraud Control account creation fraud prevention (ACFP)](https://docs.aws.amazon.com/waf/latest/developerguide/waf-acfp.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupconfig.html#cfn-wafv2-webacl-managedrulegroupconfig-awsmanagedrulesacfpruleset
     */
    readonly awsManagedRulesAcfpRuleSet?: CfnWebACL.AWSManagedRulesACFPRuleSetProperty | cdk.IResolvable;

    /**
     * Additional configuration for using the account takeover prevention (ATP) managed rule group, `AWSManagedRulesATPRuleSet` .
     *
     * Use this to provide login request information to the rule group. For web ACLs that protect CloudFront distributions, use this to also provide the information about how your distribution responds to login requests.
     *
     * This configuration replaces the individual configuration fields in `ManagedRuleGroupConfig` and provides additional feature configuration.
     *
     * For information about using the ATP managed rule group, see [AWS WAF Fraud Control account takeover prevention (ATP) rule group](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-atp.html) and [AWS WAF Fraud Control account takeover prevention (ATP)](https://docs.aws.amazon.com/waf/latest/developerguide/waf-atp.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupconfig.html#cfn-wafv2-webacl-managedrulegroupconfig-awsmanagedrulesatpruleset
     */
    readonly awsManagedRulesAtpRuleSet?: CfnWebACL.AWSManagedRulesATPRuleSetProperty | cdk.IResolvable;

    /**
     * Additional configuration for using the Bot Control managed rule group.
     *
     * Use this to specify the inspection level that you want to use. For information about using the Bot Control managed rule group, see [AWS WAF Bot Control rule group](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-bot.html) and [AWS WAF Bot Control](https://docs.aws.amazon.com/waf/latest/developerguide/waf-bot-control.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupconfig.html#cfn-wafv2-webacl-managedrulegroupconfig-awsmanagedrulesbotcontrolruleset
     */
    readonly awsManagedRulesBotControlRuleSet?: CfnWebACL.AWSManagedRulesBotControlRuleSetProperty | cdk.IResolvable;

    /**
     * > Instead of this setting, provide your configuration under `AWSManagedRulesATPRuleSet` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupconfig.html#cfn-wafv2-webacl-managedrulegroupconfig-loginpath
     */
    readonly loginPath?: string;

    /**
     * > Instead of this setting, provide your configuration under the request inspection configuration for `AWSManagedRulesATPRuleSet` or `AWSManagedRulesACFPRuleSet` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupconfig.html#cfn-wafv2-webacl-managedrulegroupconfig-passwordfield
     */
    readonly passwordField?: CfnWebACL.FieldIdentifierProperty | cdk.IResolvable;

    /**
     * > Instead of this setting, provide your configuration under the request inspection configuration for `AWSManagedRulesATPRuleSet` or `AWSManagedRulesACFPRuleSet` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupconfig.html#cfn-wafv2-webacl-managedrulegroupconfig-payloadtype
     */
    readonly payloadType?: string;

    /**
     * > Instead of this setting, provide your configuration under the request inspection configuration for `AWSManagedRulesATPRuleSet` or `AWSManagedRulesACFPRuleSet` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupconfig.html#cfn-wafv2-webacl-managedrulegroupconfig-usernamefield
     */
    readonly usernameField?: CfnWebACL.FieldIdentifierProperty | cdk.IResolvable;
  }

  /**
   * The identifier of a field in the web request payload that contains customer data.
   *
   * This data type is used to specify fields in the `RequestInspection` and `RequestInspectionACFP` configurations, which are used in the managed rule group configurations `AWSManagedRulesATPRuleSet` and `AWSManagedRulesACFPRuleSet` , respectively.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldidentifier.html
   */
  export interface FieldIdentifierProperty {
    /**
     * The name of the field.
     *
     * When the `PayloadType` in the request inspection is `JSON` , this identifier must be in JSON pointer syntax. For example `/form/username` . For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation [JavaScript Object Notation (JSON) Pointer](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6901) .
     *
     * When the `PayloadType` is `FORM_ENCODED` , use the HTML form names. For example, `username` .
     *
     * For more information, see the descriptions for each field type in the request inspection properties.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldidentifier.html#cfn-wafv2-webacl-fieldidentifier-identifier
     */
    readonly identifier: string;
  }

  /**
   * Details for your use of the account takeover prevention managed rule group, `AWSManagedRulesATPRuleSet` .
   *
   * This configuration is used in `ManagedRuleGroupConfig` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesatpruleset.html
   */
  export interface AWSManagedRulesATPRuleSetProperty {
    /**
     * Allow the use of regular expressions in the login page path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesatpruleset.html#cfn-wafv2-webacl-awsmanagedrulesatpruleset-enableregexinpath
     */
    readonly enableRegexInPath?: boolean | cdk.IResolvable;

    /**
     * The path of the login endpoint for your application.
     *
     * For example, for the URL `https://example.com/web/login` , you would provide the path `/web/login` . Login paths that start with the path that you provide are considered a match. For example `/web/login` matches the login paths `/web/login` , `/web/login/` , `/web/loginPage` , and `/web/login/thisPage` , but doesn't match the login path `/home/web/login` or `/website/login` .
     *
     * The rule group inspects only HTTP `POST` requests to your specified login endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesatpruleset.html#cfn-wafv2-webacl-awsmanagedrulesatpruleset-loginpath
     */
    readonly loginPath: string;

    /**
     * The criteria for inspecting login requests, used by the ATP rule group to validate credentials usage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesatpruleset.html#cfn-wafv2-webacl-awsmanagedrulesatpruleset-requestinspection
     */
    readonly requestInspection?: cdk.IResolvable | CfnWebACL.RequestInspectionProperty;

    /**
     * The criteria for inspecting responses to login requests, used by the ATP rule group to track login failure rates.
     *
     * > Response inspection is available only in web ACLs that protect Amazon CloudFront distributions.
     *
     * The ATP rule group evaluates the responses that your protected resources send back to client login attempts, keeping count of successful and failed attempts for each IP address and client session. Using this information, the rule group labels and mitigates requests from client sessions and IP addresses that have had too many failed login attempts in a short amount of time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesatpruleset.html#cfn-wafv2-webacl-awsmanagedrulesatpruleset-responseinspection
     */
    readonly responseInspection?: cdk.IResolvable | CfnWebACL.ResponseInspectionProperty;
  }

  /**
   * The criteria for inspecting responses to login requests and account creation requests, used by the ATP and ACFP rule groups to track login and account creation success and failure rates.
   *
   * > Response inspection is available only in web ACLs that protect Amazon CloudFront distributions.
   *
   * The rule groups evaluates the responses that your protected resources send back to client login and account creation attempts, keeping count of successful and failed attempts from each IP address and client session. Using this information, the rule group labels and mitigates requests from client sessions and IP addresses with too much suspicious activity in a short amount of time.
   *
   * This is part of the `AWSManagedRulesATPRuleSet` and `AWSManagedRulesACFPRuleSet` configurations in `ManagedRuleGroupConfig` .
   *
   * Enable response inspection by configuring exactly one component of the response to inspect, for example, `Header` or `StatusCode` . You can't configure more than one component for inspection. If you don't configure any of the response inspection options, response inspection is disabled.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspection.html
   */
  export interface ResponseInspectionProperty {
    /**
     * Configures inspection of the response body for success and failure indicators.
     *
     * AWS WAF can inspect the first 65,536 bytes (64 KB) of the response body.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspection.html#cfn-wafv2-webacl-responseinspection-bodycontains
     */
    readonly bodyContains?: cdk.IResolvable | CfnWebACL.ResponseInspectionBodyContainsProperty;

    /**
     * Configures inspection of the response header for success and failure indicators.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspection.html#cfn-wafv2-webacl-responseinspection-header
     */
    readonly header?: cdk.IResolvable | CfnWebACL.ResponseInspectionHeaderProperty;

    /**
     * Configures inspection of the response JSON for success and failure indicators.
     *
     * AWS WAF can inspect the first 65,536 bytes (64 KB) of the response JSON.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspection.html#cfn-wafv2-webacl-responseinspection-json
     */
    readonly json?: cdk.IResolvable | CfnWebACL.ResponseInspectionJsonProperty;

    /**
     * Configures inspection of the response status code for success and failure indicators.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspection.html#cfn-wafv2-webacl-responseinspection-statuscode
     */
    readonly statusCode?: cdk.IResolvable | CfnWebACL.ResponseInspectionStatusCodeProperty;
  }

  /**
   * Configures inspection of the response header. This is part of the `ResponseInspection` configuration for `AWSManagedRulesATPRuleSet` and `AWSManagedRulesACFPRuleSet` .
   *
   * > Response inspection is available only in web ACLs that protect Amazon CloudFront distributions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspectionheader.html
   */
  export interface ResponseInspectionHeaderProperty {
    /**
     * Values in the response header with the specified name that indicate a failed login or account creation attempt.
     *
     * To be counted as a failure, the value must be an exact match, including case. Each value must be unique among the success and failure values.
     *
     * JSON examples: `"FailureValues": [ "LoginFailed", "Failed login" ]` and `"FailureValues": [ "AccountCreationFailed" ]`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspectionheader.html#cfn-wafv2-webacl-responseinspectionheader-failurevalues
     */
    readonly failureValues: Array<string>;

    /**
     * The name of the header to match against. The name must be an exact match, including case.
     *
     * JSON example: `"Name": [ "RequestResult" ]`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspectionheader.html#cfn-wafv2-webacl-responseinspectionheader-name
     */
    readonly name: string;

    /**
     * Values in the response header with the specified name that indicate a successful login or account creation attempt.
     *
     * To be counted as a success, the value must be an exact match, including case. Each value must be unique among the success and failure values.
     *
     * JSON examples: `"SuccessValues": [ "LoginPassed", "Successful login" ]` and `"SuccessValues": [ "AccountCreated", "Successful account creation" ]`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspectionheader.html#cfn-wafv2-webacl-responseinspectionheader-successvalues
     */
    readonly successValues: Array<string>;
  }

  /**
   * Configures inspection of the response body.
   *
   * AWS WAF can inspect the first 65,536 bytes (64 KB) of the response body. This is part of the `ResponseInspection` configuration for `AWSManagedRulesATPRuleSet` and `AWSManagedRulesACFPRuleSet` .
   *
   * > Response inspection is available only in web ACLs that protect Amazon CloudFront distributions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspectionbodycontains.html
   */
  export interface ResponseInspectionBodyContainsProperty {
    /**
     * Strings in the body of the response that indicate a failed login or account creation attempt.
     *
     * To be counted as a failure, the string can be anywhere in the body and must be an exact match, including case. Each string must be unique among the success and failure strings.
     *
     * JSON example: `"FailureStrings": [ "Request failed" ]`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspectionbodycontains.html#cfn-wafv2-webacl-responseinspectionbodycontains-failurestrings
     */
    readonly failureStrings: Array<string>;

    /**
     * Strings in the body of the response that indicate a successful login or account creation attempt.
     *
     * To be counted as a success, the string can be anywhere in the body and must be an exact match, including case. Each string must be unique among the success and failure strings.
     *
     * JSON examples: `"SuccessStrings": [ "Login successful" ]` and `"SuccessStrings": [ "Account creation successful", "Welcome to our site!" ]`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspectionbodycontains.html#cfn-wafv2-webacl-responseinspectionbodycontains-successstrings
     */
    readonly successStrings: Array<string>;
  }

  /**
   * Configures inspection of the response JSON.
   *
   * AWS WAF can inspect the first 65,536 bytes (64 KB) of the response JSON. This is part of the `ResponseInspection` configuration for `AWSManagedRulesATPRuleSet` and `AWSManagedRulesACFPRuleSet` .
   *
   * > Response inspection is available only in web ACLs that protect Amazon CloudFront distributions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspectionjson.html
   */
  export interface ResponseInspectionJsonProperty {
    /**
     * Values for the specified identifier in the response JSON that indicate a failed login or account creation attempt.
     *
     * To be counted as a failure, the value must be an exact match, including case. Each value must be unique among the success and failure values.
     *
     * JSON example: `"FailureValues": [ "False", "Failed" ]`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspectionjson.html#cfn-wafv2-webacl-responseinspectionjson-failurevalues
     */
    readonly failureValues: Array<string>;

    /**
     * The identifier for the value to match against in the JSON.
     *
     * The identifier must be an exact match, including case.
     *
     * JSON examples: `"Identifier": [ "/login/success" ]` and `"Identifier": [ "/sign-up/success" ]`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspectionjson.html#cfn-wafv2-webacl-responseinspectionjson-identifier
     */
    readonly identifier: string;

    /**
     * Values for the specified identifier in the response JSON that indicate a successful login or account creation attempt.
     *
     * To be counted as a success, the value must be an exact match, including case. Each value must be unique among the success and failure values.
     *
     * JSON example: `"SuccessValues": [ "True", "Succeeded" ]`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspectionjson.html#cfn-wafv2-webacl-responseinspectionjson-successvalues
     */
    readonly successValues: Array<string>;
  }

  /**
   * Configures inspection of the response status code. This is part of the `ResponseInspection` configuration for `AWSManagedRulesATPRuleSet` and `AWSManagedRulesACFPRuleSet` .
   *
   * > Response inspection is available only in web ACLs that protect Amazon CloudFront distributions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspectionstatuscode.html
   */
  export interface ResponseInspectionStatusCodeProperty {
    /**
     * Status codes in the response that indicate a failed login or account creation attempt.
     *
     * To be counted as a failure, the response status code must match one of these. Each code must be unique among the success and failure status codes.
     *
     * JSON example: `"FailureCodes": [ 400, 404 ]`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspectionstatuscode.html#cfn-wafv2-webacl-responseinspectionstatuscode-failurecodes
     */
    readonly failureCodes: Array<number> | cdk.IResolvable;

    /**
     * Status codes in the response that indicate a successful login or account creation attempt.
     *
     * To be counted as a success, the response status code must match one of these. Each code must be unique among the success and failure status codes.
     *
     * JSON example: `"SuccessCodes": [ 200, 201 ]`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-responseinspectionstatuscode.html#cfn-wafv2-webacl-responseinspectionstatuscode-successcodes
     */
    readonly successCodes: Array<number> | cdk.IResolvable;
  }

  /**
   * The criteria for inspecting login requests, used by the ATP rule group to validate credentials usage.
   *
   * This is part of the `AWSManagedRulesATPRuleSet` configuration in `ManagedRuleGroupConfig` .
   *
   * In these settings, you specify how your application accepts login attempts by providing the request payload type and the names of the fields within the request body where the username and password are provided.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-requestinspection.html
   */
  export interface RequestInspectionProperty {
    /**
     * The name of the field in the request payload that contains your customer's password.
     *
     * How you specify this depends on the request inspection payload type.
     *
     * - For JSON payloads, specify the field name in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation [JavaScript Object Notation (JSON) Pointer](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6901) .
     *
     * For example, for the JSON payload `{ "form": { "password": "THE_PASSWORD" } }` , the password field specification is `/form/password` .
     * - For form encoded payload types, use the HTML form names.
     *
     * For example, for an HTML form with the input element named `password1` , the password field specification is `password1` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-requestinspection.html#cfn-wafv2-webacl-requestinspection-passwordfield
     */
    readonly passwordField: CfnWebACL.FieldIdentifierProperty | cdk.IResolvable;

    /**
     * The payload type for your login endpoint, either JSON or form encoded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-requestinspection.html#cfn-wafv2-webacl-requestinspection-payloadtype
     */
    readonly payloadType: string;

    /**
     * The name of the field in the request payload that contains your customer's username.
     *
     * How you specify this depends on the request inspection payload type.
     *
     * - For JSON payloads, specify the field name in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation [JavaScript Object Notation (JSON) Pointer](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6901) .
     *
     * For example, for the JSON payload `{ "form": { "username": "THE_USERNAME" } }` , the username field specification is `/form/username` .
     * - For form encoded payload types, use the HTML form names.
     *
     * For example, for an HTML form with the input element named `username1` , the username field specification is `username1`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-requestinspection.html#cfn-wafv2-webacl-requestinspection-usernamefield
     */
    readonly usernameField: CfnWebACL.FieldIdentifierProperty | cdk.IResolvable;
  }

  /**
   * Details for your use of the Bot Control managed rule group, `AWSManagedRulesBotControlRuleSet` .
   *
   * This configuration is used in `ManagedRuleGroupConfig` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesbotcontrolruleset.html
   */
  export interface AWSManagedRulesBotControlRuleSetProperty {
    /**
     * Applies only to the targeted inspection level.
     *
     * Determines whether to use machine learning (ML) to analyze your web traffic for bot-related activity. Machine learning is required for the Bot Control rules `TGT_ML_CoordinatedActivityLow` and `TGT_ML_CoordinatedActivityMedium` , which
     * inspect for anomalous behavior that might indicate distributed, coordinated bot activity.
     *
     * For more information about this choice, see the listing for these rules in the table at [Bot Control rules listing](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-bot.html#aws-managed-rule-groups-bot-rules) in the *AWS WAF Developer Guide* .
     *
     * Default: `TRUE`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesbotcontrolruleset.html#cfn-wafv2-webacl-awsmanagedrulesbotcontrolruleset-enablemachinelearning
     */
    readonly enableMachineLearning?: boolean | cdk.IResolvable;

    /**
     * The inspection level to use for the Bot Control rule group.
     *
     * The common level is the least expensive. The targeted level includes all common level rules and adds rules with more advanced inspection criteria. For details, see [AWS WAF Bot Control rule group](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-bot.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesbotcontrolruleset.html#cfn-wafv2-webacl-awsmanagedrulesbotcontrolruleset-inspectionlevel
     */
    readonly inspectionLevel: string;
  }

  /**
   * Details for your use of the account creation fraud prevention managed rule group, `AWSManagedRulesACFPRuleSet` .
   *
   * This configuration is used in `ManagedRuleGroupConfig` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesacfpruleset.html
   */
  export interface AWSManagedRulesACFPRuleSetProperty {
    /**
     * The path of the account creation endpoint for your application.
     *
     * This is the page on your website that accepts the completed registration form for a new user. This page must accept `POST` requests.
     *
     * For example, for the URL `https://example.com/web/newaccount` , you would provide the path `/web/newaccount` . Account creation page paths that start with the path that you provide are considered a match. For example `/web/newaccount` matches the account creation paths `/web/newaccount` , `/web/newaccount/` , `/web/newaccountPage` , and `/web/newaccount/thisPage` , but doesn't match the path `/home/web/newaccount` or `/website/newaccount` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesacfpruleset.html#cfn-wafv2-webacl-awsmanagedrulesacfpruleset-creationpath
     */
    readonly creationPath: string;

    /**
     * Allow the use of regular expressions in the registration page path and the account creation path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesacfpruleset.html#cfn-wafv2-webacl-awsmanagedrulesacfpruleset-enableregexinpath
     */
    readonly enableRegexInPath?: boolean | cdk.IResolvable;

    /**
     * The path of the account registration endpoint for your application.
     *
     * This is the page on your website that presents the registration form to new users.
     *
     * > This page must accept `GET` text/html requests.
     *
     * For example, for the URL `https://example.com/web/registration` , you would provide the path `/web/registration` . Registration page paths that start with the path that you provide are considered a match. For example `/web/registration` matches the registration paths `/web/registration` , `/web/registration/` , `/web/registrationPage` , and `/web/registration/thisPage` , but doesn't match the path `/home/web/registration` or `/website/registration` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesacfpruleset.html#cfn-wafv2-webacl-awsmanagedrulesacfpruleset-registrationpagepath
     */
    readonly registrationPagePath: string;

    /**
     * The criteria for inspecting account creation requests, used by the ACFP rule group to validate and track account creation attempts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesacfpruleset.html#cfn-wafv2-webacl-awsmanagedrulesacfpruleset-requestinspection
     */
    readonly requestInspection: cdk.IResolvable | CfnWebACL.RequestInspectionACFPProperty;

    /**
     * The criteria for inspecting responses to account creation requests, used by the ACFP rule group to track account creation success rates.
     *
     * > Response inspection is available only in web ACLs that protect Amazon CloudFront distributions.
     *
     * The ACFP rule group evaluates the responses that your protected resources send back to client account creation attempts, keeping count of successful and failed attempts from each IP address and client session. Using this information, the rule group labels and mitigates requests from client sessions and IP addresses that have had too many successful account creation attempts in a short amount of time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesacfpruleset.html#cfn-wafv2-webacl-awsmanagedrulesacfpruleset-responseinspection
     */
    readonly responseInspection?: cdk.IResolvable | CfnWebACL.ResponseInspectionProperty;
  }

  /**
   * The criteria for inspecting account creation requests, used by the ACFP rule group to validate and track account creation attempts.
   *
   * This is part of the `AWSManagedRulesACFPRuleSet` configuration in `ManagedRuleGroupConfig` .
   *
   * In these settings, you specify how your application accepts account creation attempts by providing the request payload type and the names of the fields within the request body where the username, password, email, and primary address and phone number fields are provided.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-requestinspectionacfp.html
   */
  export interface RequestInspectionACFPProperty {
    /**
     * The names of the fields in the request payload that contain your customer's primary physical address.
     *
     * Order the address fields in the array exactly as they are ordered in the request payload.
     *
     * How you specify the address fields depends on the request inspection payload type.
     *
     * - For JSON payloads, specify the field identifiers in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation [JavaScript Object Notation (JSON) Pointer](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6901) .
     *
     * For example, for the JSON payload `{ "form": { "primaryaddressline1": "THE_ADDRESS1", "primaryaddressline2": "THE_ADDRESS2", "primaryaddressline3": "THE_ADDRESS3" } }` , the address field idenfiers are `/form/primaryaddressline1` , `/form/primaryaddressline2` , and `/form/primaryaddressline3` .
     * - For form encoded payload types, use the HTML form names.
     *
     * For example, for an HTML form with input elements named `primaryaddressline1` , `primaryaddressline2` , and `primaryaddressline3` , the address fields identifiers are `primaryaddressline1` , `primaryaddressline2` , and `primaryaddressline3` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-requestinspectionacfp.html#cfn-wafv2-webacl-requestinspectionacfp-addressfields
     */
    readonly addressFields?: Array<CfnWebACL.FieldIdentifierProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the field in the request payload that contains your customer's email.
     *
     * How you specify this depends on the request inspection payload type.
     *
     * - For JSON payloads, specify the field name in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation [JavaScript Object Notation (JSON) Pointer](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6901) .
     *
     * For example, for the JSON payload `{ "form": { "email": "THE_EMAIL" } }` , the email field specification is `/form/email` .
     * - For form encoded payload types, use the HTML form names.
     *
     * For example, for an HTML form with the input element named `email1` , the email field specification is `email1` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-requestinspectionacfp.html#cfn-wafv2-webacl-requestinspectionacfp-emailfield
     */
    readonly emailField?: CfnWebACL.FieldIdentifierProperty | cdk.IResolvable;

    /**
     * The name of the field in the request payload that contains your customer's password.
     *
     * How you specify this depends on the request inspection payload type.
     *
     * - For JSON payloads, specify the field name in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation [JavaScript Object Notation (JSON) Pointer](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6901) .
     *
     * For example, for the JSON payload `{ "form": { "password": "THE_PASSWORD" } }` , the password field specification is `/form/password` .
     * - For form encoded payload types, use the HTML form names.
     *
     * For example, for an HTML form with the input element named `password1` , the password field specification is `password1` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-requestinspectionacfp.html#cfn-wafv2-webacl-requestinspectionacfp-passwordfield
     */
    readonly passwordField?: CfnWebACL.FieldIdentifierProperty | cdk.IResolvable;

    /**
     * The payload type for your account creation endpoint, either JSON or form encoded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-requestinspectionacfp.html#cfn-wafv2-webacl-requestinspectionacfp-payloadtype
     */
    readonly payloadType: string;

    /**
     * The names of the fields in the request payload that contain your customer's primary phone number.
     *
     * Order the phone number fields in the array exactly as they are ordered in the request payload.
     *
     * How you specify the phone number fields depends on the request inspection payload type.
     *
     * - For JSON payloads, specify the field identifiers in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation [JavaScript Object Notation (JSON) Pointer](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6901) .
     *
     * For example, for the JSON payload `{ "form": { "primaryphoneline1": "THE_PHONE1", "primaryphoneline2": "THE_PHONE2", "primaryphoneline3": "THE_PHONE3" } }` , the phone number field identifiers are `/form/primaryphoneline1` , `/form/primaryphoneline2` , and `/form/primaryphoneline3` .
     * - For form encoded payload types, use the HTML form names.
     *
     * For example, for an HTML form with input elements named `primaryphoneline1` , `primaryphoneline2` , and `primaryphoneline3` , the phone number field identifiers are `primaryphoneline1` , `primaryphoneline2` , and `primaryphoneline3` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-requestinspectionacfp.html#cfn-wafv2-webacl-requestinspectionacfp-phonenumberfields
     */
    readonly phoneNumberFields?: Array<CfnWebACL.FieldIdentifierProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the field in the request payload that contains your customer's username.
     *
     * How you specify this depends on the request inspection payload type.
     *
     * - For JSON payloads, specify the field name in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation [JavaScript Object Notation (JSON) Pointer](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6901) .
     *
     * For example, for the JSON payload `{ "form": { "username": "THE_USERNAME" } }` , the username field specification is `/form/username` .
     * - For form encoded payload types, use the HTML form names.
     *
     * For example, for an HTML form with the input element named `username1` , the username field specification is `username1`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-requestinspectionacfp.html#cfn-wafv2-webacl-requestinspectionacfp-usernamefield
     */
    readonly usernameField?: CfnWebACL.FieldIdentifierProperty | cdk.IResolvable;
  }

  /**
   * A rule statement used to detect web requests coming from particular IP addresses or address ranges.
   *
   * To use this, create an `IPSet` that specifies the addresses you want to detect, then use the ARN of that set in this statement.
   *
   * Each IP set rule statement references an IP set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ipsetreferencestatement.html
   */
  export interface IPSetReferenceStatementProperty {
    /**
     * The Amazon Resource Name (ARN) of the `IPSet` that this statement references.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ipsetreferencestatement.html#cfn-wafv2-webacl-ipsetreferencestatement-arn
     */
    readonly arn: string;

    /**
     * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin.
     *
     * Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ipsetreferencestatement.html#cfn-wafv2-webacl-ipsetreferencestatement-ipsetforwardedipconfig
     */
    readonly ipSetForwardedIpConfig?: CfnWebACL.IPSetForwardedIPConfigurationProperty | cdk.IResolvable;
  }

  /**
   * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin.
   *
   * Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
   *
   * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
   *
   * This configuration is used only for `IPSetReferenceStatement` . For `GeoMatchStatement` and `RateBasedStatement` , use `ForwardedIPConfig` instead.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ipsetforwardedipconfiguration.html
   */
  export interface IPSetForwardedIPConfigurationProperty {
    /**
     * The match status to assign to the web request if the request doesn't have a valid IP address in the specified position.
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * You can specify the following fallback behaviors:
     *
     * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
     * - `NO_MATCH` - Treat the web request as not matching the rule statement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ipsetforwardedipconfiguration.html#cfn-wafv2-webacl-ipsetforwardedipconfiguration-fallbackbehavior
     */
    readonly fallbackBehavior: string;

    /**
     * The name of the HTTP header to use for the IP address.
     *
     * For example, to use the X-Forwarded-For (XFF) header, set this to `X-Forwarded-For` .
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ipsetforwardedipconfiguration.html#cfn-wafv2-webacl-ipsetforwardedipconfiguration-headername
     */
    readonly headerName: string;

    /**
     * The position in the header to search for the IP address.
     *
     * The header can contain IP addresses of the original client and also of proxies. For example, the header value could be `10.1.1.1, 127.0.0.0, 10.10.10.10` where the first IP address identifies the original client and the rest identify proxies that the request went through.
     *
     * The options for this setting are the following:
     *
     * - FIRST - Inspect the first IP address in the list of IP addresses in the header. This is usually the client's original IP.
     * - LAST - Inspect the last IP address in the list of IP addresses in the header.
     * - ANY - Inspect all IP addresses in the header for a match. If the header contains more than 10 IP addresses, AWS WAF inspects the last 10.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ipsetforwardedipconfiguration.html#cfn-wafv2-webacl-ipsetforwardedipconfiguration-position
     */
    readonly position: string;
  }

  /**
   * The action to use in the place of the action that results from the rule group evaluation.
   *
   * Set the override action to none to leave the result of the rule group alone. Set it to count to override the result to count only.
   *
   * You can only use this for rule statements that reference a rule group, like `RuleGroupReferenceStatement` and `ManagedRuleGroupStatement` .
   *
   * > This option is usually set to none. It does not affect how the rules in the rule group are evaluated. If you want the rules in the rule group to only count matches, do not use this and instead use the rule action override option, with `Count` action, in your rule group reference statement settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-overrideaction.html
   */
  export interface OverrideActionProperty {
    /**
     * Override the rule group evaluation result to count only.
     *
     * > This option is usually set to none. It does not affect how the rules in the rule group are evaluated. If you want the rules in the rule group to only count matches, do not use this and instead use the rule action override option, with `Count` action, in your rule group reference statement settings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-overrideaction.html#cfn-wafv2-webacl-overrideaction-count
     */
    readonly count?: any | cdk.IResolvable;

    /**
     * Don't override the rule group evaluation result.
     *
     * This is the most common setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-overrideaction.html#cfn-wafv2-webacl-overrideaction-none
     */
    readonly none?: any | cdk.IResolvable;
  }

  /**
   * A single label container.
   *
   * This is used as an element of a label array in `RuleLabels` inside a rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-label.html
   */
  export interface LabelProperty {
    /**
     * The label string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-label.html#cfn-wafv2-webacl-label-name
     */
    readonly name: string;
  }

  /**
   * Defines and enables Amazon CloudWatch metrics and web request sample collection.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-visibilityconfig.html
   */
  export interface VisibilityConfigProperty {
    /**
     * Indicates whether the associated resource sends metrics to Amazon CloudWatch.
     *
     * For the list of available metrics, see [AWS WAF Metrics](https://docs.aws.amazon.com/waf/latest/developerguide/monitoring-cloudwatch.html#waf-metrics) in the *AWS WAF Developer Guide* .
     *
     * For web ACLs, the metrics are for web requests that have the web ACL default action applied. AWS WAF applies the default action to web requests that pass the inspection of all rules in the web ACL without being either allowed or blocked. For more information,
     * see [The web ACL default action](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-default-action.html) in the *AWS WAF Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-visibilityconfig.html#cfn-wafv2-webacl-visibilityconfig-cloudwatchmetricsenabled
     */
    readonly cloudWatchMetricsEnabled: boolean | cdk.IResolvable;

    /**
     * A name of the Amazon CloudWatch metric dimension.
     *
     * The name can contain only the characters: A-Z, a-z, 0-9, - (hyphen), and _ (underscore). The name can be from one to 128 characters long. It can't contain whitespace or metric names that are reserved for AWS WAF , for example `All` and `Default_Action` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-visibilityconfig.html#cfn-wafv2-webacl-visibilityconfig-metricname
     */
    readonly metricName: string;

    /**
     * Indicates whether AWS WAF should store a sampling of the web requests that match the rules.
     *
     * You can view the sampled requests through the AWS WAF console.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-visibilityconfig.html#cfn-wafv2-webacl-visibilityconfig-sampledrequestsenabled
     */
    readonly sampledRequestsEnabled: boolean | cdk.IResolvable;
  }

  /**
   * Specifies how AWS WAF should handle `CAPTCHA` evaluations for rules that don't have their own `CaptchaConfig` settings.
   *
   * If you don't specify this, AWS WAF uses its default settings for `CaptchaConfig` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-captchaconfig.html
   */
  export interface CaptchaConfigProperty {
    /**
     * Determines how long a `CAPTCHA` timestamp in the token remains valid after the client successfully solves a `CAPTCHA` puzzle.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-captchaconfig.html#cfn-wafv2-webacl-captchaconfig-immunitytimeproperty
     */
    readonly immunityTimeProperty?: CfnWebACL.ImmunityTimePropertyProperty | cdk.IResolvable;
  }

  /**
   * Inspect one of the headers in the web request, identified by name, for example, `User-Agent` or `Referer` .
   *
   * The name isn't case sensitive.
   *
   * You can filter and inspect all headers with the `FieldToMatch` setting `Headers` .
   *
   * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
   *
   * Example JSON: `"SingleHeader": { "Name": "haystack" }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-singleheader.html
   */
  export interface SingleHeaderProperty {
    /**
     * The name of the query header to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-singleheader.html#cfn-wafv2-webacl-singleheader-name
     */
    readonly name: string;
  }

  /**
   * Inspect one query argument in the web request, identified by name, for example *UserName* or *SalesRegion* .
   *
   * The name isn't case sensitive.
   *
   * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
   *
   * Example JSON: `"SingleQueryArgument": { "Name": "myArgument" }`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-singlequeryargument.html
   */
  export interface SingleQueryArgumentProperty {
    /**
     * The name of the query argument to inspect.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-singlequeryargument.html#cfn-wafv2-webacl-singlequeryargument-name
     */
    readonly name: string;
  }
}

/**
 * Properties for defining a `CfnWebACL`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html
 */
export interface CfnWebACLProps {
  /**
   * Specifies custom configurations for the associations between the web ACL and protected resources.
   *
   * Use this to customize the maximum size of the request body that your protected CloudFront distributions forward to AWS WAF for inspection. The default is 16 KB (16,384 bytes).
   *
   * > You are charged additional fees when your protected resources forward body sizes that are larger than the default. For more information, see [AWS WAF Pricing](https://docs.aws.amazon.com/waf/pricing/) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-associationconfig
   */
  readonly associationConfig?: CfnWebACL.AssociationConfigProperty | cdk.IResolvable;

  /**
   * Specifies how AWS WAF should handle `CAPTCHA` evaluations for rules that don't have their own `CaptchaConfig` settings.
   *
   * If you don't specify this, AWS WAF uses its default settings for `CaptchaConfig` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-captchaconfig
   */
  readonly captchaConfig?: CfnWebACL.CaptchaConfigProperty | cdk.IResolvable;

  /**
   * Specifies how AWS WAF should handle challenge evaluations for rules that don't have their own `ChallengeConfig` settings.
   *
   * If you don't specify this, AWS WAF uses its default settings for `ChallengeConfig` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-challengeconfig
   */
  readonly challengeConfig?: CfnWebACL.ChallengeConfigProperty | cdk.IResolvable;

  /**
   * A map of custom response keys and content bodies.
   *
   * When you create a rule with a block action, you can send a custom response to the web request. You define these for the web ACL, and then use them in the rules and default actions that you define in the web ACL.
   *
   * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the *AWS WAF Developer Guide* .
   *
   * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the *AWS WAF Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-customresponsebodies
   */
  readonly customResponseBodies?: cdk.IResolvable | Record<string, CfnWebACL.CustomResponseBodyProperty | cdk.IResolvable>;

  /**
   * The action to perform if none of the `Rules` contained in the `WebACL` match.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-defaultaction
   */
  readonly defaultAction: CfnWebACL.DefaultActionProperty | cdk.IResolvable;

  /**
   * A description of the web ACL that helps with identification.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-description
   */
  readonly description?: string;

  /**
   * The name of the web ACL.
   *
   * You cannot change the name of a web ACL after you create it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-name
   */
  readonly name?: string;

  /**
   * The rule statements used to identify the web requests that you want to manage.
   *
   * Each rule includes one top-level statement that AWS WAF uses to identify matching web requests, and parameters that govern how AWS WAF handles them.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-rules
   */
  readonly rules?: Array<cdk.IResolvable | CfnWebACL.RuleProperty> | cdk.IResolvable;

  /**
   * Specifies whether this is for an Amazon CloudFront distribution or for a regional application.
   *
   * A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AWS AppSync GraphQL API, an Amazon Cognito user pool, an AWS App Runner service, or an AWS Verified Access instance. Valid Values are `CLOUDFRONT` and `REGIONAL` .
   *
   * > For `CLOUDFRONT` , you must create your WAFv2 resources in the US East (N. Virginia) Region, `us-east-1` .
   *
   * For information about how to define the association of the web ACL with your resource, see `WebACLAssociation` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-scope
   */
  readonly scope: string;

  /**
   * Key:value pairs associated with an AWS resource.
   *
   * The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
   *
   * > To modify tags on existing resources, use the AWS WAF APIs or command line interface. With AWS CloudFormation , you can only add tags to AWS WAF resources during resource creation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Specifies the domains that AWS WAF should accept in a web request token.
   *
   * This enables the use of tokens across multiple protected websites. When AWS WAF provides a token, it uses the domain of the AWS resource that the web ACL is protecting. If you don't specify a list of token domains, AWS WAF accepts tokens only for the domain of the protected resource. With a token domain list, AWS WAF accepts the resource's host domain plus all domains in the token domain list, including their prefixed subdomains.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-tokendomains
   */
  readonly tokenDomains?: Array<string>;

  /**
   * Defines and enables Amazon CloudWatch metrics and web request sample collection.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-visibilityconfig
   */
  readonly visibilityConfig: cdk.IResolvable | CfnWebACL.VisibilityConfigProperty;
}

/**
 * Determine whether the given properties match those of a `RequestBodyAssociatedResourceTypeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RequestBodyAssociatedResourceTypeConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRequestBodyAssociatedResourceTypeConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultSizeInspectionLimit", cdk.requiredValidator)(properties.defaultSizeInspectionLimit));
  errors.collect(cdk.propertyValidator("defaultSizeInspectionLimit", cdk.validateString)(properties.defaultSizeInspectionLimit));
  return errors.wrap("supplied properties not correct for \"RequestBodyAssociatedResourceTypeConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRequestBodyAssociatedResourceTypeConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRequestBodyAssociatedResourceTypeConfigPropertyValidator(properties).assertSuccess();
  return {
    "DefaultSizeInspectionLimit": cdk.stringToCloudFormation(properties.defaultSizeInspectionLimit)
  };
}

// @ts-ignore TS6133
function CfnWebACLRequestBodyAssociatedResourceTypeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RequestBodyAssociatedResourceTypeConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RequestBodyAssociatedResourceTypeConfigProperty>();
  ret.addPropertyResult("defaultSizeInspectionLimit", "DefaultSizeInspectionLimit", (properties.DefaultSizeInspectionLimit != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultSizeInspectionLimit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AssociationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AssociationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLAssociationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("requestBody", cdk.hashValidator(CfnWebACLRequestBodyAssociatedResourceTypeConfigPropertyValidator))(properties.requestBody));
  return errors.wrap("supplied properties not correct for \"AssociationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLAssociationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLAssociationConfigPropertyValidator(properties).assertSuccess();
  return {
    "RequestBody": cdk.hashMapper(convertCfnWebACLRequestBodyAssociatedResourceTypeConfigPropertyToCloudFormation)(properties.requestBody)
  };
}

// @ts-ignore TS6133
function CfnWebACLAssociationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.AssociationConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.AssociationConfigProperty>();
  ret.addPropertyResult("requestBody", "RequestBody", (properties.RequestBody != null ? cfn_parse.FromCloudFormation.getMap(CfnWebACLRequestBodyAssociatedResourceTypeConfigPropertyFromCloudFormation)(properties.RequestBody) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomHTTPHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `CustomHTTPHeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLCustomHTTPHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"CustomHTTPHeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLCustomHTTPHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLCustomHTTPHeaderPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnWebACLCustomHTTPHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CustomHTTPHeaderProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CustomHTTPHeaderProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomResponseProperty`
 *
 * @param properties - the TypeScript properties of a `CustomResponseProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLCustomResponsePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customResponseBodyKey", cdk.validateString)(properties.customResponseBodyKey));
  errors.collect(cdk.propertyValidator("responseCode", cdk.requiredValidator)(properties.responseCode));
  errors.collect(cdk.propertyValidator("responseCode", cdk.validateNumber)(properties.responseCode));
  errors.collect(cdk.propertyValidator("responseHeaders", cdk.listValidator(CfnWebACLCustomHTTPHeaderPropertyValidator))(properties.responseHeaders));
  return errors.wrap("supplied properties not correct for \"CustomResponseProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLCustomResponsePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLCustomResponsePropertyValidator(properties).assertSuccess();
  return {
    "CustomResponseBodyKey": cdk.stringToCloudFormation(properties.customResponseBodyKey),
    "ResponseCode": cdk.numberToCloudFormation(properties.responseCode),
    "ResponseHeaders": cdk.listMapper(convertCfnWebACLCustomHTTPHeaderPropertyToCloudFormation)(properties.responseHeaders)
  };
}

// @ts-ignore TS6133
function CfnWebACLCustomResponsePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CustomResponseProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CustomResponseProperty>();
  ret.addPropertyResult("customResponseBodyKey", "CustomResponseBodyKey", (properties.CustomResponseBodyKey != null ? cfn_parse.FromCloudFormation.getString(properties.CustomResponseBodyKey) : undefined));
  ret.addPropertyResult("responseCode", "ResponseCode", (properties.ResponseCode != null ? cfn_parse.FromCloudFormation.getNumber(properties.ResponseCode) : undefined));
  ret.addPropertyResult("responseHeaders", "ResponseHeaders", (properties.ResponseHeaders != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLCustomHTTPHeaderPropertyFromCloudFormation)(properties.ResponseHeaders) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BlockActionProperty`
 *
 * @param properties - the TypeScript properties of a `BlockActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLBlockActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customResponse", CfnWebACLCustomResponsePropertyValidator)(properties.customResponse));
  return errors.wrap("supplied properties not correct for \"BlockActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLBlockActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLBlockActionPropertyValidator(properties).assertSuccess();
  return {
    "CustomResponse": convertCfnWebACLCustomResponsePropertyToCloudFormation(properties.customResponse)
  };
}

// @ts-ignore TS6133
function CfnWebACLBlockActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.BlockActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.BlockActionProperty>();
  ret.addPropertyResult("customResponse", "CustomResponse", (properties.CustomResponse != null ? CfnWebACLCustomResponsePropertyFromCloudFormation(properties.CustomResponse) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomRequestHandlingProperty`
 *
 * @param properties - the TypeScript properties of a `CustomRequestHandlingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLCustomRequestHandlingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("insertHeaders", cdk.requiredValidator)(properties.insertHeaders));
  errors.collect(cdk.propertyValidator("insertHeaders", cdk.listValidator(CfnWebACLCustomHTTPHeaderPropertyValidator))(properties.insertHeaders));
  return errors.wrap("supplied properties not correct for \"CustomRequestHandlingProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLCustomRequestHandlingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLCustomRequestHandlingPropertyValidator(properties).assertSuccess();
  return {
    "InsertHeaders": cdk.listMapper(convertCfnWebACLCustomHTTPHeaderPropertyToCloudFormation)(properties.insertHeaders)
  };
}

// @ts-ignore TS6133
function CfnWebACLCustomRequestHandlingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CustomRequestHandlingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CustomRequestHandlingProperty>();
  ret.addPropertyResult("insertHeaders", "InsertHeaders", (properties.InsertHeaders != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLCustomHTTPHeaderPropertyFromCloudFormation)(properties.InsertHeaders) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AllowActionProperty`
 *
 * @param properties - the TypeScript properties of a `AllowActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLAllowActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customRequestHandling", CfnWebACLCustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
  return errors.wrap("supplied properties not correct for \"AllowActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLAllowActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLAllowActionPropertyValidator(properties).assertSuccess();
  return {
    "CustomRequestHandling": convertCfnWebACLCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling)
  };
}

// @ts-ignore TS6133
function CfnWebACLAllowActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.AllowActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.AllowActionProperty>();
  ret.addPropertyResult("customRequestHandling", "CustomRequestHandling", (properties.CustomRequestHandling != null ? CfnWebACLCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DefaultActionProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLDefaultActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allow", CfnWebACLAllowActionPropertyValidator)(properties.allow));
  errors.collect(cdk.propertyValidator("block", CfnWebACLBlockActionPropertyValidator)(properties.block));
  return errors.wrap("supplied properties not correct for \"DefaultActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLDefaultActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLDefaultActionPropertyValidator(properties).assertSuccess();
  return {
    "Allow": convertCfnWebACLAllowActionPropertyToCloudFormation(properties.allow),
    "Block": convertCfnWebACLBlockActionPropertyToCloudFormation(properties.block)
  };
}

// @ts-ignore TS6133
function CfnWebACLDefaultActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.DefaultActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.DefaultActionProperty>();
  ret.addPropertyResult("allow", "Allow", (properties.Allow != null ? CfnWebACLAllowActionPropertyFromCloudFormation(properties.Allow) : undefined));
  ret.addPropertyResult("block", "Block", (properties.Block != null ? CfnWebACLBlockActionPropertyFromCloudFormation(properties.Block) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomResponseBodyProperty`
 *
 * @param properties - the TypeScript properties of a `CustomResponseBodyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLCustomResponseBodyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("content", cdk.requiredValidator)(properties.content));
  errors.collect(cdk.propertyValidator("content", cdk.validateString)(properties.content));
  errors.collect(cdk.propertyValidator("contentType", cdk.requiredValidator)(properties.contentType));
  errors.collect(cdk.propertyValidator("contentType", cdk.validateString)(properties.contentType));
  return errors.wrap("supplied properties not correct for \"CustomResponseBodyProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLCustomResponseBodyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLCustomResponseBodyPropertyValidator(properties).assertSuccess();
  return {
    "Content": cdk.stringToCloudFormation(properties.content),
    "ContentType": cdk.stringToCloudFormation(properties.contentType)
  };
}

// @ts-ignore TS6133
function CfnWebACLCustomResponseBodyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CustomResponseBodyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CustomResponseBodyProperty>();
  ret.addPropertyResult("content", "Content", (properties.Content != null ? cfn_parse.FromCloudFormation.getString(properties.Content) : undefined));
  ret.addPropertyResult("contentType", "ContentType", (properties.ContentType != null ? cfn_parse.FromCloudFormation.getString(properties.ContentType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ImmunityTimePropertyProperty`
 *
 * @param properties - the TypeScript properties of a `ImmunityTimePropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLImmunityTimePropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("immunityTime", cdk.requiredValidator)(properties.immunityTime));
  errors.collect(cdk.propertyValidator("immunityTime", cdk.validateNumber)(properties.immunityTime));
  return errors.wrap("supplied properties not correct for \"ImmunityTimePropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLImmunityTimePropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLImmunityTimePropertyPropertyValidator(properties).assertSuccess();
  return {
    "ImmunityTime": cdk.numberToCloudFormation(properties.immunityTime)
  };
}

// @ts-ignore TS6133
function CfnWebACLImmunityTimePropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ImmunityTimePropertyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ImmunityTimePropertyProperty>();
  ret.addPropertyResult("immunityTime", "ImmunityTime", (properties.ImmunityTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.ImmunityTime) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ChallengeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ChallengeConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLChallengeConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("immunityTimeProperty", CfnWebACLImmunityTimePropertyPropertyValidator)(properties.immunityTimeProperty));
  return errors.wrap("supplied properties not correct for \"ChallengeConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLChallengeConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLChallengeConfigPropertyValidator(properties).assertSuccess();
  return {
    "ImmunityTimeProperty": convertCfnWebACLImmunityTimePropertyPropertyToCloudFormation(properties.immunityTimeProperty)
  };
}

// @ts-ignore TS6133
function CfnWebACLChallengeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ChallengeConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ChallengeConfigProperty>();
  ret.addPropertyResult("immunityTimeProperty", "ImmunityTimeProperty", (properties.ImmunityTimeProperty != null ? CfnWebACLImmunityTimePropertyPropertyFromCloudFormation(properties.ImmunityTimeProperty) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CaptchaActionProperty`
 *
 * @param properties - the TypeScript properties of a `CaptchaActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLCaptchaActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customRequestHandling", CfnWebACLCustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
  return errors.wrap("supplied properties not correct for \"CaptchaActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLCaptchaActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLCaptchaActionPropertyValidator(properties).assertSuccess();
  return {
    "CustomRequestHandling": convertCfnWebACLCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling)
  };
}

// @ts-ignore TS6133
function CfnWebACLCaptchaActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CaptchaActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CaptchaActionProperty>();
  ret.addPropertyResult("customRequestHandling", "CustomRequestHandling", (properties.CustomRequestHandling != null ? CfnWebACLCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CountActionProperty`
 *
 * @param properties - the TypeScript properties of a `CountActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLCountActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customRequestHandling", CfnWebACLCustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
  return errors.wrap("supplied properties not correct for \"CountActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLCountActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLCountActionPropertyValidator(properties).assertSuccess();
  return {
    "CustomRequestHandling": convertCfnWebACLCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling)
  };
}

// @ts-ignore TS6133
function CfnWebACLCountActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CountActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CountActionProperty>();
  ret.addPropertyResult("customRequestHandling", "CustomRequestHandling", (properties.CustomRequestHandling != null ? CfnWebACLCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ChallengeActionProperty`
 *
 * @param properties - the TypeScript properties of a `ChallengeActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLChallengeActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customRequestHandling", CfnWebACLCustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
  return errors.wrap("supplied properties not correct for \"ChallengeActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLChallengeActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLChallengeActionPropertyValidator(properties).assertSuccess();
  return {
    "CustomRequestHandling": convertCfnWebACLCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling)
  };
}

// @ts-ignore TS6133
function CfnWebACLChallengeActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ChallengeActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ChallengeActionProperty>();
  ret.addPropertyResult("customRequestHandling", "CustomRequestHandling", (properties.CustomRequestHandling != null ? CfnWebACLCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleActionProperty`
 *
 * @param properties - the TypeScript properties of a `RuleActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRuleActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allow", CfnWebACLAllowActionPropertyValidator)(properties.allow));
  errors.collect(cdk.propertyValidator("block", CfnWebACLBlockActionPropertyValidator)(properties.block));
  errors.collect(cdk.propertyValidator("captcha", CfnWebACLCaptchaActionPropertyValidator)(properties.captcha));
  errors.collect(cdk.propertyValidator("challenge", CfnWebACLChallengeActionPropertyValidator)(properties.challenge));
  errors.collect(cdk.propertyValidator("count", CfnWebACLCountActionPropertyValidator)(properties.count));
  return errors.wrap("supplied properties not correct for \"RuleActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRuleActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRuleActionPropertyValidator(properties).assertSuccess();
  return {
    "Allow": convertCfnWebACLAllowActionPropertyToCloudFormation(properties.allow),
    "Block": convertCfnWebACLBlockActionPropertyToCloudFormation(properties.block),
    "Captcha": convertCfnWebACLCaptchaActionPropertyToCloudFormation(properties.captcha),
    "Challenge": convertCfnWebACLChallengeActionPropertyToCloudFormation(properties.challenge),
    "Count": convertCfnWebACLCountActionPropertyToCloudFormation(properties.count)
  };
}

// @ts-ignore TS6133
function CfnWebACLRuleActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RuleActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RuleActionProperty>();
  ret.addPropertyResult("allow", "Allow", (properties.Allow != null ? CfnWebACLAllowActionPropertyFromCloudFormation(properties.Allow) : undefined));
  ret.addPropertyResult("block", "Block", (properties.Block != null ? CfnWebACLBlockActionPropertyFromCloudFormation(properties.Block) : undefined));
  ret.addPropertyResult("captcha", "Captcha", (properties.Captcha != null ? CfnWebACLCaptchaActionPropertyFromCloudFormation(properties.Captcha) : undefined));
  ret.addPropertyResult("challenge", "Challenge", (properties.Challenge != null ? CfnWebACLChallengeActionPropertyFromCloudFormation(properties.Challenge) : undefined));
  ret.addPropertyResult("count", "Count", (properties.Count != null ? CfnWebACLCountActionPropertyFromCloudFormation(properties.Count) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TextTransformationProperty`
 *
 * @param properties - the TypeScript properties of a `TextTransformationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLTextTransformationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("priority", cdk.requiredValidator)(properties.priority));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"TextTransformationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLTextTransformationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLTextTransformationPropertyValidator(properties).assertSuccess();
  return {
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnWebACLTextTransformationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.TextTransformationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.TextTransformationProperty>();
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JsonMatchPatternProperty`
 *
 * @param properties - the TypeScript properties of a `JsonMatchPatternProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLJsonMatchPatternPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("all", cdk.validateObject)(properties.all));
  errors.collect(cdk.propertyValidator("includedPaths", cdk.listValidator(cdk.validateString))(properties.includedPaths));
  return errors.wrap("supplied properties not correct for \"JsonMatchPatternProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLJsonMatchPatternPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLJsonMatchPatternPropertyValidator(properties).assertSuccess();
  return {
    "All": cdk.objectToCloudFormation(properties.all),
    "IncludedPaths": cdk.listMapper(cdk.stringToCloudFormation)(properties.includedPaths)
  };
}

// @ts-ignore TS6133
function CfnWebACLJsonMatchPatternPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.JsonMatchPatternProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.JsonMatchPatternProperty>();
  ret.addPropertyResult("all", "All", (properties.All != null ? cfn_parse.FromCloudFormation.getAny(properties.All) : undefined));
  ret.addPropertyResult("includedPaths", "IncludedPaths", (properties.IncludedPaths != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludedPaths) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JsonBodyProperty`
 *
 * @param properties - the TypeScript properties of a `JsonBodyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLJsonBodyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("invalidFallbackBehavior", cdk.validateString)(properties.invalidFallbackBehavior));
  errors.collect(cdk.propertyValidator("matchPattern", cdk.requiredValidator)(properties.matchPattern));
  errors.collect(cdk.propertyValidator("matchPattern", CfnWebACLJsonMatchPatternPropertyValidator)(properties.matchPattern));
  errors.collect(cdk.propertyValidator("matchScope", cdk.requiredValidator)(properties.matchScope));
  errors.collect(cdk.propertyValidator("matchScope", cdk.validateString)(properties.matchScope));
  errors.collect(cdk.propertyValidator("oversizeHandling", cdk.validateString)(properties.oversizeHandling));
  return errors.wrap("supplied properties not correct for \"JsonBodyProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLJsonBodyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLJsonBodyPropertyValidator(properties).assertSuccess();
  return {
    "InvalidFallbackBehavior": cdk.stringToCloudFormation(properties.invalidFallbackBehavior),
    "MatchPattern": convertCfnWebACLJsonMatchPatternPropertyToCloudFormation(properties.matchPattern),
    "MatchScope": cdk.stringToCloudFormation(properties.matchScope),
    "OversizeHandling": cdk.stringToCloudFormation(properties.oversizeHandling)
  };
}

// @ts-ignore TS6133
function CfnWebACLJsonBodyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.JsonBodyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.JsonBodyProperty>();
  ret.addPropertyResult("invalidFallbackBehavior", "InvalidFallbackBehavior", (properties.InvalidFallbackBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.InvalidFallbackBehavior) : undefined));
  ret.addPropertyResult("matchPattern", "MatchPattern", (properties.MatchPattern != null ? CfnWebACLJsonMatchPatternPropertyFromCloudFormation(properties.MatchPattern) : undefined));
  ret.addPropertyResult("matchScope", "MatchScope", (properties.MatchScope != null ? cfn_parse.FromCloudFormation.getString(properties.MatchScope) : undefined));
  ret.addPropertyResult("oversizeHandling", "OversizeHandling", (properties.OversizeHandling != null ? cfn_parse.FromCloudFormation.getString(properties.OversizeHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HeaderMatchPatternProperty`
 *
 * @param properties - the TypeScript properties of a `HeaderMatchPatternProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLHeaderMatchPatternPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("all", cdk.validateObject)(properties.all));
  errors.collect(cdk.propertyValidator("excludedHeaders", cdk.listValidator(cdk.validateString))(properties.excludedHeaders));
  errors.collect(cdk.propertyValidator("includedHeaders", cdk.listValidator(cdk.validateString))(properties.includedHeaders));
  return errors.wrap("supplied properties not correct for \"HeaderMatchPatternProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLHeaderMatchPatternPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLHeaderMatchPatternPropertyValidator(properties).assertSuccess();
  return {
    "All": cdk.objectToCloudFormation(properties.all),
    "ExcludedHeaders": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedHeaders),
    "IncludedHeaders": cdk.listMapper(cdk.stringToCloudFormation)(properties.includedHeaders)
  };
}

// @ts-ignore TS6133
function CfnWebACLHeaderMatchPatternPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.HeaderMatchPatternProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.HeaderMatchPatternProperty>();
  ret.addPropertyResult("all", "All", (properties.All != null ? cfn_parse.FromCloudFormation.getAny(properties.All) : undefined));
  ret.addPropertyResult("excludedHeaders", "ExcludedHeaders", (properties.ExcludedHeaders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludedHeaders) : undefined));
  ret.addPropertyResult("includedHeaders", "IncludedHeaders", (properties.IncludedHeaders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludedHeaders) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HeadersProperty`
 *
 * @param properties - the TypeScript properties of a `HeadersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLHeadersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("matchPattern", cdk.requiredValidator)(properties.matchPattern));
  errors.collect(cdk.propertyValidator("matchPattern", CfnWebACLHeaderMatchPatternPropertyValidator)(properties.matchPattern));
  errors.collect(cdk.propertyValidator("matchScope", cdk.requiredValidator)(properties.matchScope));
  errors.collect(cdk.propertyValidator("matchScope", cdk.validateString)(properties.matchScope));
  errors.collect(cdk.propertyValidator("oversizeHandling", cdk.requiredValidator)(properties.oversizeHandling));
  errors.collect(cdk.propertyValidator("oversizeHandling", cdk.validateString)(properties.oversizeHandling));
  return errors.wrap("supplied properties not correct for \"HeadersProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLHeadersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLHeadersPropertyValidator(properties).assertSuccess();
  return {
    "MatchPattern": convertCfnWebACLHeaderMatchPatternPropertyToCloudFormation(properties.matchPattern),
    "MatchScope": cdk.stringToCloudFormation(properties.matchScope),
    "OversizeHandling": cdk.stringToCloudFormation(properties.oversizeHandling)
  };
}

// @ts-ignore TS6133
function CfnWebACLHeadersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.HeadersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.HeadersProperty>();
  ret.addPropertyResult("matchPattern", "MatchPattern", (properties.MatchPattern != null ? CfnWebACLHeaderMatchPatternPropertyFromCloudFormation(properties.MatchPattern) : undefined));
  ret.addPropertyResult("matchScope", "MatchScope", (properties.MatchScope != null ? cfn_parse.FromCloudFormation.getString(properties.MatchScope) : undefined));
  ret.addPropertyResult("oversizeHandling", "OversizeHandling", (properties.OversizeHandling != null ? cfn_parse.FromCloudFormation.getString(properties.OversizeHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CookieMatchPatternProperty`
 *
 * @param properties - the TypeScript properties of a `CookieMatchPatternProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLCookieMatchPatternPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("all", cdk.validateObject)(properties.all));
  errors.collect(cdk.propertyValidator("excludedCookies", cdk.listValidator(cdk.validateString))(properties.excludedCookies));
  errors.collect(cdk.propertyValidator("includedCookies", cdk.listValidator(cdk.validateString))(properties.includedCookies));
  return errors.wrap("supplied properties not correct for \"CookieMatchPatternProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLCookieMatchPatternPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLCookieMatchPatternPropertyValidator(properties).assertSuccess();
  return {
    "All": cdk.objectToCloudFormation(properties.all),
    "ExcludedCookies": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedCookies),
    "IncludedCookies": cdk.listMapper(cdk.stringToCloudFormation)(properties.includedCookies)
  };
}

// @ts-ignore TS6133
function CfnWebACLCookieMatchPatternPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CookieMatchPatternProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CookieMatchPatternProperty>();
  ret.addPropertyResult("all", "All", (properties.All != null ? cfn_parse.FromCloudFormation.getAny(properties.All) : undefined));
  ret.addPropertyResult("excludedCookies", "ExcludedCookies", (properties.ExcludedCookies != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludedCookies) : undefined));
  ret.addPropertyResult("includedCookies", "IncludedCookies", (properties.IncludedCookies != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludedCookies) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CookiesProperty`
 *
 * @param properties - the TypeScript properties of a `CookiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLCookiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("matchPattern", cdk.requiredValidator)(properties.matchPattern));
  errors.collect(cdk.propertyValidator("matchPattern", CfnWebACLCookieMatchPatternPropertyValidator)(properties.matchPattern));
  errors.collect(cdk.propertyValidator("matchScope", cdk.requiredValidator)(properties.matchScope));
  errors.collect(cdk.propertyValidator("matchScope", cdk.validateString)(properties.matchScope));
  errors.collect(cdk.propertyValidator("oversizeHandling", cdk.requiredValidator)(properties.oversizeHandling));
  errors.collect(cdk.propertyValidator("oversizeHandling", cdk.validateString)(properties.oversizeHandling));
  return errors.wrap("supplied properties not correct for \"CookiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLCookiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLCookiesPropertyValidator(properties).assertSuccess();
  return {
    "MatchPattern": convertCfnWebACLCookieMatchPatternPropertyToCloudFormation(properties.matchPattern),
    "MatchScope": cdk.stringToCloudFormation(properties.matchScope),
    "OversizeHandling": cdk.stringToCloudFormation(properties.oversizeHandling)
  };
}

// @ts-ignore TS6133
function CfnWebACLCookiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CookiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CookiesProperty>();
  ret.addPropertyResult("matchPattern", "MatchPattern", (properties.MatchPattern != null ? CfnWebACLCookieMatchPatternPropertyFromCloudFormation(properties.MatchPattern) : undefined));
  ret.addPropertyResult("matchScope", "MatchScope", (properties.MatchScope != null ? cfn_parse.FromCloudFormation.getString(properties.MatchScope) : undefined));
  ret.addPropertyResult("oversizeHandling", "OversizeHandling", (properties.OversizeHandling != null ? cfn_parse.FromCloudFormation.getString(properties.OversizeHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BodyProperty`
 *
 * @param properties - the TypeScript properties of a `BodyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLBodyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("oversizeHandling", cdk.validateString)(properties.oversizeHandling));
  return errors.wrap("supplied properties not correct for \"BodyProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLBodyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLBodyPropertyValidator(properties).assertSuccess();
  return {
    "OversizeHandling": cdk.stringToCloudFormation(properties.oversizeHandling)
  };
}

// @ts-ignore TS6133
function CfnWebACLBodyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.BodyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.BodyProperty>();
  ret.addPropertyResult("oversizeHandling", "OversizeHandling", (properties.OversizeHandling != null ? cfn_parse.FromCloudFormation.getString(properties.OversizeHandling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLFieldToMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allQueryArguments", cdk.validateObject)(properties.allQueryArguments));
  errors.collect(cdk.propertyValidator("body", CfnWebACLBodyPropertyValidator)(properties.body));
  errors.collect(cdk.propertyValidator("cookies", CfnWebACLCookiesPropertyValidator)(properties.cookies));
  errors.collect(cdk.propertyValidator("headers", CfnWebACLHeadersPropertyValidator)(properties.headers));
  errors.collect(cdk.propertyValidator("jsonBody", CfnWebACLJsonBodyPropertyValidator)(properties.jsonBody));
  errors.collect(cdk.propertyValidator("method", cdk.validateObject)(properties.method));
  errors.collect(cdk.propertyValidator("queryString", cdk.validateObject)(properties.queryString));
  errors.collect(cdk.propertyValidator("singleHeader", cdk.validateObject)(properties.singleHeader));
  errors.collect(cdk.propertyValidator("singleQueryArgument", cdk.validateObject)(properties.singleQueryArgument));
  errors.collect(cdk.propertyValidator("uriPath", cdk.validateObject)(properties.uriPath));
  return errors.wrap("supplied properties not correct for \"FieldToMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLFieldToMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLFieldToMatchPropertyValidator(properties).assertSuccess();
  return {
    "AllQueryArguments": cdk.objectToCloudFormation(properties.allQueryArguments),
    "Body": convertCfnWebACLBodyPropertyToCloudFormation(properties.body),
    "Cookies": convertCfnWebACLCookiesPropertyToCloudFormation(properties.cookies),
    "Headers": convertCfnWebACLHeadersPropertyToCloudFormation(properties.headers),
    "JsonBody": convertCfnWebACLJsonBodyPropertyToCloudFormation(properties.jsonBody),
    "Method": cdk.objectToCloudFormation(properties.method),
    "QueryString": cdk.objectToCloudFormation(properties.queryString),
    "SingleHeader": cdk.objectToCloudFormation(properties.singleHeader),
    "SingleQueryArgument": cdk.objectToCloudFormation(properties.singleQueryArgument),
    "UriPath": cdk.objectToCloudFormation(properties.uriPath)
  };
}

// @ts-ignore TS6133
function CfnWebACLFieldToMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.FieldToMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.FieldToMatchProperty>();
  ret.addPropertyResult("allQueryArguments", "AllQueryArguments", (properties.AllQueryArguments != null ? cfn_parse.FromCloudFormation.getAny(properties.AllQueryArguments) : undefined));
  ret.addPropertyResult("body", "Body", (properties.Body != null ? CfnWebACLBodyPropertyFromCloudFormation(properties.Body) : undefined));
  ret.addPropertyResult("cookies", "Cookies", (properties.Cookies != null ? CfnWebACLCookiesPropertyFromCloudFormation(properties.Cookies) : undefined));
  ret.addPropertyResult("headers", "Headers", (properties.Headers != null ? CfnWebACLHeadersPropertyFromCloudFormation(properties.Headers) : undefined));
  ret.addPropertyResult("jsonBody", "JsonBody", (properties.JsonBody != null ? CfnWebACLJsonBodyPropertyFromCloudFormation(properties.JsonBody) : undefined));
  ret.addPropertyResult("method", "Method", (properties.Method != null ? cfn_parse.FromCloudFormation.getAny(properties.Method) : undefined));
  ret.addPropertyResult("queryString", "QueryString", (properties.QueryString != null ? cfn_parse.FromCloudFormation.getAny(properties.QueryString) : undefined));
  ret.addPropertyResult("singleHeader", "SingleHeader", (properties.SingleHeader != null ? cfn_parse.FromCloudFormation.getAny(properties.SingleHeader) : undefined));
  ret.addPropertyResult("singleQueryArgument", "SingleQueryArgument", (properties.SingleQueryArgument != null ? cfn_parse.FromCloudFormation.getAny(properties.SingleQueryArgument) : undefined));
  ret.addPropertyResult("uriPath", "UriPath", (properties.UriPath != null ? cfn_parse.FromCloudFormation.getAny(properties.UriPath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SizeConstraintStatementProperty`
 *
 * @param properties - the TypeScript properties of a `SizeConstraintStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLSizeConstraintStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.requiredValidator)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.validateString)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnWebACLFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("size", cdk.requiredValidator)(properties.size));
  errors.collect(cdk.propertyValidator("size", cdk.validateNumber)(properties.size));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnWebACLTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"SizeConstraintStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLSizeConstraintStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLSizeConstraintStatementPropertyValidator(properties).assertSuccess();
  return {
    "ComparisonOperator": cdk.stringToCloudFormation(properties.comparisonOperator),
    "FieldToMatch": convertCfnWebACLFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "Size": cdk.numberToCloudFormation(properties.size),
    "TextTransformations": cdk.listMapper(convertCfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnWebACLSizeConstraintStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.SizeConstraintStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.SizeConstraintStatementProperty>();
  ret.addPropertyResult("comparisonOperator", "ComparisonOperator", (properties.ComparisonOperator != null ? cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator) : undefined));
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnWebACLFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("size", "Size", (properties.Size != null ? cfn_parse.FromCloudFormation.getNumber(properties.Size) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AndStatementProperty`
 *
 * @param properties - the TypeScript properties of a `AndStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLAndStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("statements", cdk.requiredValidator)(properties.statements));
  errors.collect(cdk.propertyValidator("statements", cdk.listValidator(CfnWebACLStatementPropertyValidator))(properties.statements));
  return errors.wrap("supplied properties not correct for \"AndStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLAndStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLAndStatementPropertyValidator(properties).assertSuccess();
  return {
    "Statements": cdk.listMapper(convertCfnWebACLStatementPropertyToCloudFormation)(properties.statements)
  };
}

// @ts-ignore TS6133
function CfnWebACLAndStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.AndStatementProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.AndStatementProperty>();
  ret.addPropertyResult("statements", "Statements", (properties.Statements != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLStatementPropertyFromCloudFormation)(properties.Statements) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `XssMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `XssMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLXssMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnWebACLFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnWebACLTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"XssMatchStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLXssMatchStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLXssMatchStatementPropertyValidator(properties).assertSuccess();
  return {
    "FieldToMatch": convertCfnWebACLFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "TextTransformations": cdk.listMapper(convertCfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnWebACLXssMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.XssMatchStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.XssMatchStatementProperty>();
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnWebACLFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NotStatementProperty`
 *
 * @param properties - the TypeScript properties of a `NotStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLNotStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("statement", cdk.requiredValidator)(properties.statement));
  errors.collect(cdk.propertyValidator("statement", CfnWebACLStatementPropertyValidator)(properties.statement));
  return errors.wrap("supplied properties not correct for \"NotStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLNotStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLNotStatementPropertyValidator(properties).assertSuccess();
  return {
    "Statement": convertCfnWebACLStatementPropertyToCloudFormation(properties.statement)
  };
}

// @ts-ignore TS6133
function CfnWebACLNotStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.NotStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.NotStatementProperty>();
  ret.addPropertyResult("statement", "Statement", (properties.Statement != null ? CfnWebACLStatementPropertyFromCloudFormation(properties.Statement) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ByteMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `ByteMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLByteMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnWebACLFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("positionalConstraint", cdk.requiredValidator)(properties.positionalConstraint));
  errors.collect(cdk.propertyValidator("positionalConstraint", cdk.validateString)(properties.positionalConstraint));
  errors.collect(cdk.propertyValidator("searchString", cdk.validateString)(properties.searchString));
  errors.collect(cdk.propertyValidator("searchStringBase64", cdk.validateString)(properties.searchStringBase64));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnWebACLTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"ByteMatchStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLByteMatchStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLByteMatchStatementPropertyValidator(properties).assertSuccess();
  return {
    "FieldToMatch": convertCfnWebACLFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "PositionalConstraint": cdk.stringToCloudFormation(properties.positionalConstraint),
    "SearchString": cdk.stringToCloudFormation(properties.searchString),
    "SearchStringBase64": cdk.stringToCloudFormation(properties.searchStringBase64),
    "TextTransformations": cdk.listMapper(convertCfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnWebACLByteMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ByteMatchStatementProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ByteMatchStatementProperty>();
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnWebACLFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("positionalConstraint", "PositionalConstraint", (properties.PositionalConstraint != null ? cfn_parse.FromCloudFormation.getString(properties.PositionalConstraint) : undefined));
  ret.addPropertyResult("searchString", "SearchString", (properties.SearchString != null ? cfn_parse.FromCloudFormation.getString(properties.SearchString) : undefined));
  ret.addPropertyResult("searchStringBase64", "SearchStringBase64", (properties.SearchStringBase64 != null ? cfn_parse.FromCloudFormation.getString(properties.SearchStringBase64) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateLimitCookieProperty`
 *
 * @param properties - the TypeScript properties of a `RateLimitCookieProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRateLimitCookiePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnWebACLTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"RateLimitCookieProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRateLimitCookiePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRateLimitCookiePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "TextTransformations": cdk.listMapper(convertCfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnWebACLRateLimitCookiePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RateLimitCookieProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RateLimitCookieProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateLimitQueryArgumentProperty`
 *
 * @param properties - the TypeScript properties of a `RateLimitQueryArgumentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRateLimitQueryArgumentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnWebACLTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"RateLimitQueryArgumentProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRateLimitQueryArgumentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRateLimitQueryArgumentPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "TextTransformations": cdk.listMapper(convertCfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnWebACLRateLimitQueryArgumentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RateLimitQueryArgumentProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RateLimitQueryArgumentProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateLimitHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `RateLimitHeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRateLimitHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnWebACLTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"RateLimitHeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRateLimitHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRateLimitHeaderPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "TextTransformations": cdk.listMapper(convertCfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnWebACLRateLimitHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RateLimitHeaderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RateLimitHeaderProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateLimitQueryStringProperty`
 *
 * @param properties - the TypeScript properties of a `RateLimitQueryStringProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRateLimitQueryStringPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnWebACLTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"RateLimitQueryStringProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRateLimitQueryStringPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRateLimitQueryStringPropertyValidator(properties).assertSuccess();
  return {
    "TextTransformations": cdk.listMapper(convertCfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnWebACLRateLimitQueryStringPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RateLimitQueryStringProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RateLimitQueryStringProperty>();
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateLimitUriPathProperty`
 *
 * @param properties - the TypeScript properties of a `RateLimitUriPathProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRateLimitUriPathPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnWebACLTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"RateLimitUriPathProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRateLimitUriPathPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRateLimitUriPathPropertyValidator(properties).assertSuccess();
  return {
    "TextTransformations": cdk.listMapper(convertCfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnWebACLRateLimitUriPathPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RateLimitUriPathProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RateLimitUriPathProperty>();
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateLimitLabelNamespaceProperty`
 *
 * @param properties - the TypeScript properties of a `RateLimitLabelNamespaceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRateLimitLabelNamespacePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("namespace", cdk.requiredValidator)(properties.namespace));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  return errors.wrap("supplied properties not correct for \"RateLimitLabelNamespaceProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRateLimitLabelNamespacePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRateLimitLabelNamespacePropertyValidator(properties).assertSuccess();
  return {
    "Namespace": cdk.stringToCloudFormation(properties.namespace)
  };
}

// @ts-ignore TS6133
function CfnWebACLRateLimitLabelNamespacePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RateLimitLabelNamespaceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RateLimitLabelNamespaceProperty>();
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateBasedStatementCustomKeyProperty`
 *
 * @param properties - the TypeScript properties of a `RateBasedStatementCustomKeyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRateBasedStatementCustomKeyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cookie", CfnWebACLRateLimitCookiePropertyValidator)(properties.cookie));
  errors.collect(cdk.propertyValidator("forwardedIp", cdk.validateObject)(properties.forwardedIp));
  errors.collect(cdk.propertyValidator("httpMethod", cdk.validateObject)(properties.httpMethod));
  errors.collect(cdk.propertyValidator("header", CfnWebACLRateLimitHeaderPropertyValidator)(properties.header));
  errors.collect(cdk.propertyValidator("ip", cdk.validateObject)(properties.ip));
  errors.collect(cdk.propertyValidator("labelNamespace", CfnWebACLRateLimitLabelNamespacePropertyValidator)(properties.labelNamespace));
  errors.collect(cdk.propertyValidator("queryArgument", CfnWebACLRateLimitQueryArgumentPropertyValidator)(properties.queryArgument));
  errors.collect(cdk.propertyValidator("queryString", CfnWebACLRateLimitQueryStringPropertyValidator)(properties.queryString));
  errors.collect(cdk.propertyValidator("uriPath", CfnWebACLRateLimitUriPathPropertyValidator)(properties.uriPath));
  return errors.wrap("supplied properties not correct for \"RateBasedStatementCustomKeyProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRateBasedStatementCustomKeyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRateBasedStatementCustomKeyPropertyValidator(properties).assertSuccess();
  return {
    "Cookie": convertCfnWebACLRateLimitCookiePropertyToCloudFormation(properties.cookie),
    "ForwardedIP": cdk.objectToCloudFormation(properties.forwardedIp),
    "HTTPMethod": cdk.objectToCloudFormation(properties.httpMethod),
    "Header": convertCfnWebACLRateLimitHeaderPropertyToCloudFormation(properties.header),
    "IP": cdk.objectToCloudFormation(properties.ip),
    "LabelNamespace": convertCfnWebACLRateLimitLabelNamespacePropertyToCloudFormation(properties.labelNamespace),
    "QueryArgument": convertCfnWebACLRateLimitQueryArgumentPropertyToCloudFormation(properties.queryArgument),
    "QueryString": convertCfnWebACLRateLimitQueryStringPropertyToCloudFormation(properties.queryString),
    "UriPath": convertCfnWebACLRateLimitUriPathPropertyToCloudFormation(properties.uriPath)
  };
}

// @ts-ignore TS6133
function CfnWebACLRateBasedStatementCustomKeyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RateBasedStatementCustomKeyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RateBasedStatementCustomKeyProperty>();
  ret.addPropertyResult("cookie", "Cookie", (properties.Cookie != null ? CfnWebACLRateLimitCookiePropertyFromCloudFormation(properties.Cookie) : undefined));
  ret.addPropertyResult("forwardedIp", "ForwardedIP", (properties.ForwardedIP != null ? cfn_parse.FromCloudFormation.getAny(properties.ForwardedIP) : undefined));
  ret.addPropertyResult("header", "Header", (properties.Header != null ? CfnWebACLRateLimitHeaderPropertyFromCloudFormation(properties.Header) : undefined));
  ret.addPropertyResult("httpMethod", "HTTPMethod", (properties.HTTPMethod != null ? cfn_parse.FromCloudFormation.getAny(properties.HTTPMethod) : undefined));
  ret.addPropertyResult("ip", "IP", (properties.IP != null ? cfn_parse.FromCloudFormation.getAny(properties.IP) : undefined));
  ret.addPropertyResult("labelNamespace", "LabelNamespace", (properties.LabelNamespace != null ? CfnWebACLRateLimitLabelNamespacePropertyFromCloudFormation(properties.LabelNamespace) : undefined));
  ret.addPropertyResult("queryArgument", "QueryArgument", (properties.QueryArgument != null ? CfnWebACLRateLimitQueryArgumentPropertyFromCloudFormation(properties.QueryArgument) : undefined));
  ret.addPropertyResult("queryString", "QueryString", (properties.QueryString != null ? CfnWebACLRateLimitQueryStringPropertyFromCloudFormation(properties.QueryString) : undefined));
  ret.addPropertyResult("uriPath", "UriPath", (properties.UriPath != null ? CfnWebACLRateLimitUriPathPropertyFromCloudFormation(properties.UriPath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ForwardedIPConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ForwardedIPConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLForwardedIPConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fallbackBehavior", cdk.requiredValidator)(properties.fallbackBehavior));
  errors.collect(cdk.propertyValidator("fallbackBehavior", cdk.validateString)(properties.fallbackBehavior));
  errors.collect(cdk.propertyValidator("headerName", cdk.requiredValidator)(properties.headerName));
  errors.collect(cdk.propertyValidator("headerName", cdk.validateString)(properties.headerName));
  return errors.wrap("supplied properties not correct for \"ForwardedIPConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLForwardedIPConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLForwardedIPConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "FallbackBehavior": cdk.stringToCloudFormation(properties.fallbackBehavior),
    "HeaderName": cdk.stringToCloudFormation(properties.headerName)
  };
}

// @ts-ignore TS6133
function CfnWebACLForwardedIPConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ForwardedIPConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ForwardedIPConfigurationProperty>();
  ret.addPropertyResult("fallbackBehavior", "FallbackBehavior", (properties.FallbackBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.FallbackBehavior) : undefined));
  ret.addPropertyResult("headerName", "HeaderName", (properties.HeaderName != null ? cfn_parse.FromCloudFormation.getString(properties.HeaderName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RateBasedStatementProperty`
 *
 * @param properties - the TypeScript properties of a `RateBasedStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRateBasedStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aggregateKeyType", cdk.requiredValidator)(properties.aggregateKeyType));
  errors.collect(cdk.propertyValidator("aggregateKeyType", cdk.validateString)(properties.aggregateKeyType));
  errors.collect(cdk.propertyValidator("customKeys", cdk.listValidator(CfnWebACLRateBasedStatementCustomKeyPropertyValidator))(properties.customKeys));
  errors.collect(cdk.propertyValidator("forwardedIpConfig", CfnWebACLForwardedIPConfigurationPropertyValidator)(properties.forwardedIpConfig));
  errors.collect(cdk.propertyValidator("limit", cdk.requiredValidator)(properties.limit));
  errors.collect(cdk.propertyValidator("limit", cdk.validateNumber)(properties.limit));
  errors.collect(cdk.propertyValidator("scopeDownStatement", CfnWebACLStatementPropertyValidator)(properties.scopeDownStatement));
  return errors.wrap("supplied properties not correct for \"RateBasedStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRateBasedStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRateBasedStatementPropertyValidator(properties).assertSuccess();
  return {
    "AggregateKeyType": cdk.stringToCloudFormation(properties.aggregateKeyType),
    "CustomKeys": cdk.listMapper(convertCfnWebACLRateBasedStatementCustomKeyPropertyToCloudFormation)(properties.customKeys),
    "ForwardedIPConfig": convertCfnWebACLForwardedIPConfigurationPropertyToCloudFormation(properties.forwardedIpConfig),
    "Limit": cdk.numberToCloudFormation(properties.limit),
    "ScopeDownStatement": convertCfnWebACLStatementPropertyToCloudFormation(properties.scopeDownStatement)
  };
}

// @ts-ignore TS6133
function CfnWebACLRateBasedStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RateBasedStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RateBasedStatementProperty>();
  ret.addPropertyResult("aggregateKeyType", "AggregateKeyType", (properties.AggregateKeyType != null ? cfn_parse.FromCloudFormation.getString(properties.AggregateKeyType) : undefined));
  ret.addPropertyResult("customKeys", "CustomKeys", (properties.CustomKeys != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLRateBasedStatementCustomKeyPropertyFromCloudFormation)(properties.CustomKeys) : undefined));
  ret.addPropertyResult("forwardedIpConfig", "ForwardedIPConfig", (properties.ForwardedIPConfig != null ? CfnWebACLForwardedIPConfigurationPropertyFromCloudFormation(properties.ForwardedIPConfig) : undefined));
  ret.addPropertyResult("limit", "Limit", (properties.Limit != null ? cfn_parse.FromCloudFormation.getNumber(properties.Limit) : undefined));
  ret.addPropertyResult("scopeDownStatement", "ScopeDownStatement", (properties.ScopeDownStatement != null ? CfnWebACLStatementPropertyFromCloudFormation(properties.ScopeDownStatement) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GeoMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `GeoMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLGeoMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("countryCodes", cdk.listValidator(cdk.validateString))(properties.countryCodes));
  errors.collect(cdk.propertyValidator("forwardedIpConfig", CfnWebACLForwardedIPConfigurationPropertyValidator)(properties.forwardedIpConfig));
  return errors.wrap("supplied properties not correct for \"GeoMatchStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLGeoMatchStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLGeoMatchStatementPropertyValidator(properties).assertSuccess();
  return {
    "CountryCodes": cdk.listMapper(cdk.stringToCloudFormation)(properties.countryCodes),
    "ForwardedIPConfig": convertCfnWebACLForwardedIPConfigurationPropertyToCloudFormation(properties.forwardedIpConfig)
  };
}

// @ts-ignore TS6133
function CfnWebACLGeoMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.GeoMatchStatementProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.GeoMatchStatementProperty>();
  ret.addPropertyResult("countryCodes", "CountryCodes", (properties.CountryCodes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CountryCodes) : undefined));
  ret.addPropertyResult("forwardedIpConfig", "ForwardedIPConfig", (properties.ForwardedIPConfig != null ? CfnWebACLForwardedIPConfigurationPropertyFromCloudFormation(properties.ForwardedIPConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleActionOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `RuleActionOverrideProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRuleActionOverridePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actionToUse", cdk.requiredValidator)(properties.actionToUse));
  errors.collect(cdk.propertyValidator("actionToUse", CfnWebACLRuleActionPropertyValidator)(properties.actionToUse));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"RuleActionOverrideProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRuleActionOverridePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRuleActionOverridePropertyValidator(properties).assertSuccess();
  return {
    "ActionToUse": convertCfnWebACLRuleActionPropertyToCloudFormation(properties.actionToUse),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnWebACLRuleActionOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RuleActionOverrideProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RuleActionOverrideProperty>();
  ret.addPropertyResult("actionToUse", "ActionToUse", (properties.ActionToUse != null ? CfnWebACLRuleActionPropertyFromCloudFormation(properties.ActionToUse) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExcludedRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ExcludedRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLExcludedRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"ExcludedRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLExcludedRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLExcludedRulePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnWebACLExcludedRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ExcludedRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ExcludedRuleProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleGroupReferenceStatementProperty`
 *
 * @param properties - the TypeScript properties of a `RuleGroupReferenceStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRuleGroupReferenceStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.requiredValidator)(properties.arn));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("excludedRules", cdk.listValidator(CfnWebACLExcludedRulePropertyValidator))(properties.excludedRules));
  errors.collect(cdk.propertyValidator("ruleActionOverrides", cdk.listValidator(CfnWebACLRuleActionOverridePropertyValidator))(properties.ruleActionOverrides));
  return errors.wrap("supplied properties not correct for \"RuleGroupReferenceStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRuleGroupReferenceStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRuleGroupReferenceStatementPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "ExcludedRules": cdk.listMapper(convertCfnWebACLExcludedRulePropertyToCloudFormation)(properties.excludedRules),
    "RuleActionOverrides": cdk.listMapper(convertCfnWebACLRuleActionOverridePropertyToCloudFormation)(properties.ruleActionOverrides)
  };
}

// @ts-ignore TS6133
function CfnWebACLRuleGroupReferenceStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RuleGroupReferenceStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RuleGroupReferenceStatementProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addPropertyResult("excludedRules", "ExcludedRules", (properties.ExcludedRules != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLExcludedRulePropertyFromCloudFormation)(properties.ExcludedRules) : undefined));
  ret.addPropertyResult("ruleActionOverrides", "RuleActionOverrides", (properties.RuleActionOverrides != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLRuleActionOverridePropertyFromCloudFormation)(properties.RuleActionOverrides) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LabelMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `LabelMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLLabelMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("scope", cdk.requiredValidator)(properties.scope));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  return errors.wrap("supplied properties not correct for \"LabelMatchStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLLabelMatchStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLLabelMatchStatementPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Scope": cdk.stringToCloudFormation(properties.scope)
  };
}

// @ts-ignore TS6133
function CfnWebACLLabelMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.LabelMatchStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.LabelMatchStatementProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RegexMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `RegexMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRegexMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnWebACLFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("regexString", cdk.requiredValidator)(properties.regexString));
  errors.collect(cdk.propertyValidator("regexString", cdk.validateString)(properties.regexString));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnWebACLTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"RegexMatchStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRegexMatchStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRegexMatchStatementPropertyValidator(properties).assertSuccess();
  return {
    "FieldToMatch": convertCfnWebACLFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "RegexString": cdk.stringToCloudFormation(properties.regexString),
    "TextTransformations": cdk.listMapper(convertCfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnWebACLRegexMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RegexMatchStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RegexMatchStatementProperty>();
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnWebACLFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("regexString", "RegexString", (properties.RegexString != null ? cfn_parse.FromCloudFormation.getString(properties.RegexString) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SqliMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `SqliMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLSqliMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnWebACLFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("sensitivityLevel", cdk.validateString)(properties.sensitivityLevel));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnWebACLTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"SqliMatchStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLSqliMatchStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLSqliMatchStatementPropertyValidator(properties).assertSuccess();
  return {
    "FieldToMatch": convertCfnWebACLFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "SensitivityLevel": cdk.stringToCloudFormation(properties.sensitivityLevel),
    "TextTransformations": cdk.listMapper(convertCfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnWebACLSqliMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.SqliMatchStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.SqliMatchStatementProperty>();
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnWebACLFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("sensitivityLevel", "SensitivityLevel", (properties.SensitivityLevel != null ? cfn_parse.FromCloudFormation.getString(properties.SensitivityLevel) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RegexPatternSetReferenceStatementProperty`
 *
 * @param properties - the TypeScript properties of a `RegexPatternSetReferenceStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRegexPatternSetReferenceStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.requiredValidator)(properties.arn));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("fieldToMatch", cdk.requiredValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("fieldToMatch", CfnWebACLFieldToMatchPropertyValidator)(properties.fieldToMatch));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.requiredValidator)(properties.textTransformations));
  errors.collect(cdk.propertyValidator("textTransformations", cdk.listValidator(CfnWebACLTextTransformationPropertyValidator))(properties.textTransformations));
  return errors.wrap("supplied properties not correct for \"RegexPatternSetReferenceStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRegexPatternSetReferenceStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRegexPatternSetReferenceStatementPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "FieldToMatch": convertCfnWebACLFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
    "TextTransformations": cdk.listMapper(convertCfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations)
  };
}

// @ts-ignore TS6133
function CfnWebACLRegexPatternSetReferenceStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RegexPatternSetReferenceStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RegexPatternSetReferenceStatementProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addPropertyResult("fieldToMatch", "FieldToMatch", (properties.FieldToMatch != null ? CfnWebACLFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch) : undefined));
  ret.addPropertyResult("textTransformations", "TextTransformations", (properties.TextTransformations != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OrStatementProperty`
 *
 * @param properties - the TypeScript properties of a `OrStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLOrStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("statements", cdk.requiredValidator)(properties.statements));
  errors.collect(cdk.propertyValidator("statements", cdk.listValidator(CfnWebACLStatementPropertyValidator))(properties.statements));
  return errors.wrap("supplied properties not correct for \"OrStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLOrStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLOrStatementPropertyValidator(properties).assertSuccess();
  return {
    "Statements": cdk.listMapper(convertCfnWebACLStatementPropertyToCloudFormation)(properties.statements)
  };
}

// @ts-ignore TS6133
function CfnWebACLOrStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.OrStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.OrStatementProperty>();
  ret.addPropertyResult("statements", "Statements", (properties.Statements != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLStatementPropertyFromCloudFormation)(properties.Statements) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FieldIdentifierProperty`
 *
 * @param properties - the TypeScript properties of a `FieldIdentifierProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLFieldIdentifierPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("identifier", cdk.requiredValidator)(properties.identifier));
  errors.collect(cdk.propertyValidator("identifier", cdk.validateString)(properties.identifier));
  return errors.wrap("supplied properties not correct for \"FieldIdentifierProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLFieldIdentifierPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLFieldIdentifierPropertyValidator(properties).assertSuccess();
  return {
    "Identifier": cdk.stringToCloudFormation(properties.identifier)
  };
}

// @ts-ignore TS6133
function CfnWebACLFieldIdentifierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.FieldIdentifierProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.FieldIdentifierProperty>();
  ret.addPropertyResult("identifier", "Identifier", (properties.Identifier != null ? cfn_parse.FromCloudFormation.getString(properties.Identifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResponseInspectionHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `ResponseInspectionHeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLResponseInspectionHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("failureValues", cdk.requiredValidator)(properties.failureValues));
  errors.collect(cdk.propertyValidator("failureValues", cdk.listValidator(cdk.validateString))(properties.failureValues));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("successValues", cdk.requiredValidator)(properties.successValues));
  errors.collect(cdk.propertyValidator("successValues", cdk.listValidator(cdk.validateString))(properties.successValues));
  return errors.wrap("supplied properties not correct for \"ResponseInspectionHeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLResponseInspectionHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLResponseInspectionHeaderPropertyValidator(properties).assertSuccess();
  return {
    "FailureValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.failureValues),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SuccessValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.successValues)
  };
}

// @ts-ignore TS6133
function CfnWebACLResponseInspectionHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.ResponseInspectionHeaderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ResponseInspectionHeaderProperty>();
  ret.addPropertyResult("failureValues", "FailureValues", (properties.FailureValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.FailureValues) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("successValues", "SuccessValues", (properties.SuccessValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SuccessValues) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResponseInspectionBodyContainsProperty`
 *
 * @param properties - the TypeScript properties of a `ResponseInspectionBodyContainsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLResponseInspectionBodyContainsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("failureStrings", cdk.requiredValidator)(properties.failureStrings));
  errors.collect(cdk.propertyValidator("failureStrings", cdk.listValidator(cdk.validateString))(properties.failureStrings));
  errors.collect(cdk.propertyValidator("successStrings", cdk.requiredValidator)(properties.successStrings));
  errors.collect(cdk.propertyValidator("successStrings", cdk.listValidator(cdk.validateString))(properties.successStrings));
  return errors.wrap("supplied properties not correct for \"ResponseInspectionBodyContainsProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLResponseInspectionBodyContainsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLResponseInspectionBodyContainsPropertyValidator(properties).assertSuccess();
  return {
    "FailureStrings": cdk.listMapper(cdk.stringToCloudFormation)(properties.failureStrings),
    "SuccessStrings": cdk.listMapper(cdk.stringToCloudFormation)(properties.successStrings)
  };
}

// @ts-ignore TS6133
function CfnWebACLResponseInspectionBodyContainsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.ResponseInspectionBodyContainsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ResponseInspectionBodyContainsProperty>();
  ret.addPropertyResult("failureStrings", "FailureStrings", (properties.FailureStrings != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.FailureStrings) : undefined));
  ret.addPropertyResult("successStrings", "SuccessStrings", (properties.SuccessStrings != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SuccessStrings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResponseInspectionJsonProperty`
 *
 * @param properties - the TypeScript properties of a `ResponseInspectionJsonProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLResponseInspectionJsonPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("failureValues", cdk.requiredValidator)(properties.failureValues));
  errors.collect(cdk.propertyValidator("failureValues", cdk.listValidator(cdk.validateString))(properties.failureValues));
  errors.collect(cdk.propertyValidator("identifier", cdk.requiredValidator)(properties.identifier));
  errors.collect(cdk.propertyValidator("identifier", cdk.validateString)(properties.identifier));
  errors.collect(cdk.propertyValidator("successValues", cdk.requiredValidator)(properties.successValues));
  errors.collect(cdk.propertyValidator("successValues", cdk.listValidator(cdk.validateString))(properties.successValues));
  return errors.wrap("supplied properties not correct for \"ResponseInspectionJsonProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLResponseInspectionJsonPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLResponseInspectionJsonPropertyValidator(properties).assertSuccess();
  return {
    "FailureValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.failureValues),
    "Identifier": cdk.stringToCloudFormation(properties.identifier),
    "SuccessValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.successValues)
  };
}

// @ts-ignore TS6133
function CfnWebACLResponseInspectionJsonPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.ResponseInspectionJsonProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ResponseInspectionJsonProperty>();
  ret.addPropertyResult("failureValues", "FailureValues", (properties.FailureValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.FailureValues) : undefined));
  ret.addPropertyResult("identifier", "Identifier", (properties.Identifier != null ? cfn_parse.FromCloudFormation.getString(properties.Identifier) : undefined));
  ret.addPropertyResult("successValues", "SuccessValues", (properties.SuccessValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SuccessValues) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResponseInspectionStatusCodeProperty`
 *
 * @param properties - the TypeScript properties of a `ResponseInspectionStatusCodeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLResponseInspectionStatusCodePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("failureCodes", cdk.requiredValidator)(properties.failureCodes));
  errors.collect(cdk.propertyValidator("failureCodes", cdk.listValidator(cdk.validateNumber))(properties.failureCodes));
  errors.collect(cdk.propertyValidator("successCodes", cdk.requiredValidator)(properties.successCodes));
  errors.collect(cdk.propertyValidator("successCodes", cdk.listValidator(cdk.validateNumber))(properties.successCodes));
  return errors.wrap("supplied properties not correct for \"ResponseInspectionStatusCodeProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLResponseInspectionStatusCodePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLResponseInspectionStatusCodePropertyValidator(properties).assertSuccess();
  return {
    "FailureCodes": cdk.listMapper(cdk.numberToCloudFormation)(properties.failureCodes),
    "SuccessCodes": cdk.listMapper(cdk.numberToCloudFormation)(properties.successCodes)
  };
}

// @ts-ignore TS6133
function CfnWebACLResponseInspectionStatusCodePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.ResponseInspectionStatusCodeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ResponseInspectionStatusCodeProperty>();
  ret.addPropertyResult("failureCodes", "FailureCodes", (properties.FailureCodes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.FailureCodes) : undefined));
  ret.addPropertyResult("successCodes", "SuccessCodes", (properties.SuccessCodes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.SuccessCodes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResponseInspectionProperty`
 *
 * @param properties - the TypeScript properties of a `ResponseInspectionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLResponseInspectionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bodyContains", CfnWebACLResponseInspectionBodyContainsPropertyValidator)(properties.bodyContains));
  errors.collect(cdk.propertyValidator("header", CfnWebACLResponseInspectionHeaderPropertyValidator)(properties.header));
  errors.collect(cdk.propertyValidator("json", CfnWebACLResponseInspectionJsonPropertyValidator)(properties.json));
  errors.collect(cdk.propertyValidator("statusCode", CfnWebACLResponseInspectionStatusCodePropertyValidator)(properties.statusCode));
  return errors.wrap("supplied properties not correct for \"ResponseInspectionProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLResponseInspectionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLResponseInspectionPropertyValidator(properties).assertSuccess();
  return {
    "BodyContains": convertCfnWebACLResponseInspectionBodyContainsPropertyToCloudFormation(properties.bodyContains),
    "Header": convertCfnWebACLResponseInspectionHeaderPropertyToCloudFormation(properties.header),
    "Json": convertCfnWebACLResponseInspectionJsonPropertyToCloudFormation(properties.json),
    "StatusCode": convertCfnWebACLResponseInspectionStatusCodePropertyToCloudFormation(properties.statusCode)
  };
}

// @ts-ignore TS6133
function CfnWebACLResponseInspectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.ResponseInspectionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ResponseInspectionProperty>();
  ret.addPropertyResult("bodyContains", "BodyContains", (properties.BodyContains != null ? CfnWebACLResponseInspectionBodyContainsPropertyFromCloudFormation(properties.BodyContains) : undefined));
  ret.addPropertyResult("header", "Header", (properties.Header != null ? CfnWebACLResponseInspectionHeaderPropertyFromCloudFormation(properties.Header) : undefined));
  ret.addPropertyResult("json", "Json", (properties.Json != null ? CfnWebACLResponseInspectionJsonPropertyFromCloudFormation(properties.Json) : undefined));
  ret.addPropertyResult("statusCode", "StatusCode", (properties.StatusCode != null ? CfnWebACLResponseInspectionStatusCodePropertyFromCloudFormation(properties.StatusCode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RequestInspectionProperty`
 *
 * @param properties - the TypeScript properties of a `RequestInspectionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRequestInspectionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("passwordField", cdk.requiredValidator)(properties.passwordField));
  errors.collect(cdk.propertyValidator("passwordField", CfnWebACLFieldIdentifierPropertyValidator)(properties.passwordField));
  errors.collect(cdk.propertyValidator("payloadType", cdk.requiredValidator)(properties.payloadType));
  errors.collect(cdk.propertyValidator("payloadType", cdk.validateString)(properties.payloadType));
  errors.collect(cdk.propertyValidator("usernameField", cdk.requiredValidator)(properties.usernameField));
  errors.collect(cdk.propertyValidator("usernameField", CfnWebACLFieldIdentifierPropertyValidator)(properties.usernameField));
  return errors.wrap("supplied properties not correct for \"RequestInspectionProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRequestInspectionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRequestInspectionPropertyValidator(properties).assertSuccess();
  return {
    "PasswordField": convertCfnWebACLFieldIdentifierPropertyToCloudFormation(properties.passwordField),
    "PayloadType": cdk.stringToCloudFormation(properties.payloadType),
    "UsernameField": convertCfnWebACLFieldIdentifierPropertyToCloudFormation(properties.usernameField)
  };
}

// @ts-ignore TS6133
function CfnWebACLRequestInspectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RequestInspectionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RequestInspectionProperty>();
  ret.addPropertyResult("passwordField", "PasswordField", (properties.PasswordField != null ? CfnWebACLFieldIdentifierPropertyFromCloudFormation(properties.PasswordField) : undefined));
  ret.addPropertyResult("payloadType", "PayloadType", (properties.PayloadType != null ? cfn_parse.FromCloudFormation.getString(properties.PayloadType) : undefined));
  ret.addPropertyResult("usernameField", "UsernameField", (properties.UsernameField != null ? CfnWebACLFieldIdentifierPropertyFromCloudFormation(properties.UsernameField) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AWSManagedRulesATPRuleSetProperty`
 *
 * @param properties - the TypeScript properties of a `AWSManagedRulesATPRuleSetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLAWSManagedRulesATPRuleSetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enableRegexInPath", cdk.validateBoolean)(properties.enableRegexInPath));
  errors.collect(cdk.propertyValidator("loginPath", cdk.requiredValidator)(properties.loginPath));
  errors.collect(cdk.propertyValidator("loginPath", cdk.validateString)(properties.loginPath));
  errors.collect(cdk.propertyValidator("requestInspection", CfnWebACLRequestInspectionPropertyValidator)(properties.requestInspection));
  errors.collect(cdk.propertyValidator("responseInspection", CfnWebACLResponseInspectionPropertyValidator)(properties.responseInspection));
  return errors.wrap("supplied properties not correct for \"AWSManagedRulesATPRuleSetProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLAWSManagedRulesATPRuleSetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLAWSManagedRulesATPRuleSetPropertyValidator(properties).assertSuccess();
  return {
    "EnableRegexInPath": cdk.booleanToCloudFormation(properties.enableRegexInPath),
    "LoginPath": cdk.stringToCloudFormation(properties.loginPath),
    "RequestInspection": convertCfnWebACLRequestInspectionPropertyToCloudFormation(properties.requestInspection),
    "ResponseInspection": convertCfnWebACLResponseInspectionPropertyToCloudFormation(properties.responseInspection)
  };
}

// @ts-ignore TS6133
function CfnWebACLAWSManagedRulesATPRuleSetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.AWSManagedRulesATPRuleSetProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.AWSManagedRulesATPRuleSetProperty>();
  ret.addPropertyResult("enableRegexInPath", "EnableRegexInPath", (properties.EnableRegexInPath != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableRegexInPath) : undefined));
  ret.addPropertyResult("loginPath", "LoginPath", (properties.LoginPath != null ? cfn_parse.FromCloudFormation.getString(properties.LoginPath) : undefined));
  ret.addPropertyResult("requestInspection", "RequestInspection", (properties.RequestInspection != null ? CfnWebACLRequestInspectionPropertyFromCloudFormation(properties.RequestInspection) : undefined));
  ret.addPropertyResult("responseInspection", "ResponseInspection", (properties.ResponseInspection != null ? CfnWebACLResponseInspectionPropertyFromCloudFormation(properties.ResponseInspection) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AWSManagedRulesBotControlRuleSetProperty`
 *
 * @param properties - the TypeScript properties of a `AWSManagedRulesBotControlRuleSetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLAWSManagedRulesBotControlRuleSetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enableMachineLearning", cdk.validateBoolean)(properties.enableMachineLearning));
  errors.collect(cdk.propertyValidator("inspectionLevel", cdk.requiredValidator)(properties.inspectionLevel));
  errors.collect(cdk.propertyValidator("inspectionLevel", cdk.validateString)(properties.inspectionLevel));
  return errors.wrap("supplied properties not correct for \"AWSManagedRulesBotControlRuleSetProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLAWSManagedRulesBotControlRuleSetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLAWSManagedRulesBotControlRuleSetPropertyValidator(properties).assertSuccess();
  return {
    "EnableMachineLearning": cdk.booleanToCloudFormation(properties.enableMachineLearning),
    "InspectionLevel": cdk.stringToCloudFormation(properties.inspectionLevel)
  };
}

// @ts-ignore TS6133
function CfnWebACLAWSManagedRulesBotControlRuleSetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.AWSManagedRulesBotControlRuleSetProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.AWSManagedRulesBotControlRuleSetProperty>();
  ret.addPropertyResult("enableMachineLearning", "EnableMachineLearning", (properties.EnableMachineLearning != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableMachineLearning) : undefined));
  ret.addPropertyResult("inspectionLevel", "InspectionLevel", (properties.InspectionLevel != null ? cfn_parse.FromCloudFormation.getString(properties.InspectionLevel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RequestInspectionACFPProperty`
 *
 * @param properties - the TypeScript properties of a `RequestInspectionACFPProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRequestInspectionACFPPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addressFields", cdk.listValidator(CfnWebACLFieldIdentifierPropertyValidator))(properties.addressFields));
  errors.collect(cdk.propertyValidator("emailField", CfnWebACLFieldIdentifierPropertyValidator)(properties.emailField));
  errors.collect(cdk.propertyValidator("passwordField", CfnWebACLFieldIdentifierPropertyValidator)(properties.passwordField));
  errors.collect(cdk.propertyValidator("payloadType", cdk.requiredValidator)(properties.payloadType));
  errors.collect(cdk.propertyValidator("payloadType", cdk.validateString)(properties.payloadType));
  errors.collect(cdk.propertyValidator("phoneNumberFields", cdk.listValidator(CfnWebACLFieldIdentifierPropertyValidator))(properties.phoneNumberFields));
  errors.collect(cdk.propertyValidator("usernameField", CfnWebACLFieldIdentifierPropertyValidator)(properties.usernameField));
  return errors.wrap("supplied properties not correct for \"RequestInspectionACFPProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRequestInspectionACFPPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRequestInspectionACFPPropertyValidator(properties).assertSuccess();
  return {
    "AddressFields": cdk.listMapper(convertCfnWebACLFieldIdentifierPropertyToCloudFormation)(properties.addressFields),
    "EmailField": convertCfnWebACLFieldIdentifierPropertyToCloudFormation(properties.emailField),
    "PasswordField": convertCfnWebACLFieldIdentifierPropertyToCloudFormation(properties.passwordField),
    "PayloadType": cdk.stringToCloudFormation(properties.payloadType),
    "PhoneNumberFields": cdk.listMapper(convertCfnWebACLFieldIdentifierPropertyToCloudFormation)(properties.phoneNumberFields),
    "UsernameField": convertCfnWebACLFieldIdentifierPropertyToCloudFormation(properties.usernameField)
  };
}

// @ts-ignore TS6133
function CfnWebACLRequestInspectionACFPPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RequestInspectionACFPProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RequestInspectionACFPProperty>();
  ret.addPropertyResult("addressFields", "AddressFields", (properties.AddressFields != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLFieldIdentifierPropertyFromCloudFormation)(properties.AddressFields) : undefined));
  ret.addPropertyResult("emailField", "EmailField", (properties.EmailField != null ? CfnWebACLFieldIdentifierPropertyFromCloudFormation(properties.EmailField) : undefined));
  ret.addPropertyResult("passwordField", "PasswordField", (properties.PasswordField != null ? CfnWebACLFieldIdentifierPropertyFromCloudFormation(properties.PasswordField) : undefined));
  ret.addPropertyResult("payloadType", "PayloadType", (properties.PayloadType != null ? cfn_parse.FromCloudFormation.getString(properties.PayloadType) : undefined));
  ret.addPropertyResult("phoneNumberFields", "PhoneNumberFields", (properties.PhoneNumberFields != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLFieldIdentifierPropertyFromCloudFormation)(properties.PhoneNumberFields) : undefined));
  ret.addPropertyResult("usernameField", "UsernameField", (properties.UsernameField != null ? CfnWebACLFieldIdentifierPropertyFromCloudFormation(properties.UsernameField) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AWSManagedRulesACFPRuleSetProperty`
 *
 * @param properties - the TypeScript properties of a `AWSManagedRulesACFPRuleSetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLAWSManagedRulesACFPRuleSetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("creationPath", cdk.requiredValidator)(properties.creationPath));
  errors.collect(cdk.propertyValidator("creationPath", cdk.validateString)(properties.creationPath));
  errors.collect(cdk.propertyValidator("enableRegexInPath", cdk.validateBoolean)(properties.enableRegexInPath));
  errors.collect(cdk.propertyValidator("registrationPagePath", cdk.requiredValidator)(properties.registrationPagePath));
  errors.collect(cdk.propertyValidator("registrationPagePath", cdk.validateString)(properties.registrationPagePath));
  errors.collect(cdk.propertyValidator("requestInspection", cdk.requiredValidator)(properties.requestInspection));
  errors.collect(cdk.propertyValidator("requestInspection", CfnWebACLRequestInspectionACFPPropertyValidator)(properties.requestInspection));
  errors.collect(cdk.propertyValidator("responseInspection", CfnWebACLResponseInspectionPropertyValidator)(properties.responseInspection));
  return errors.wrap("supplied properties not correct for \"AWSManagedRulesACFPRuleSetProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLAWSManagedRulesACFPRuleSetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLAWSManagedRulesACFPRuleSetPropertyValidator(properties).assertSuccess();
  return {
    "CreationPath": cdk.stringToCloudFormation(properties.creationPath),
    "EnableRegexInPath": cdk.booleanToCloudFormation(properties.enableRegexInPath),
    "RegistrationPagePath": cdk.stringToCloudFormation(properties.registrationPagePath),
    "RequestInspection": convertCfnWebACLRequestInspectionACFPPropertyToCloudFormation(properties.requestInspection),
    "ResponseInspection": convertCfnWebACLResponseInspectionPropertyToCloudFormation(properties.responseInspection)
  };
}

// @ts-ignore TS6133
function CfnWebACLAWSManagedRulesACFPRuleSetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.AWSManagedRulesACFPRuleSetProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.AWSManagedRulesACFPRuleSetProperty>();
  ret.addPropertyResult("creationPath", "CreationPath", (properties.CreationPath != null ? cfn_parse.FromCloudFormation.getString(properties.CreationPath) : undefined));
  ret.addPropertyResult("enableRegexInPath", "EnableRegexInPath", (properties.EnableRegexInPath != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableRegexInPath) : undefined));
  ret.addPropertyResult("registrationPagePath", "RegistrationPagePath", (properties.RegistrationPagePath != null ? cfn_parse.FromCloudFormation.getString(properties.RegistrationPagePath) : undefined));
  ret.addPropertyResult("requestInspection", "RequestInspection", (properties.RequestInspection != null ? CfnWebACLRequestInspectionACFPPropertyFromCloudFormation(properties.RequestInspection) : undefined));
  ret.addPropertyResult("responseInspection", "ResponseInspection", (properties.ResponseInspection != null ? CfnWebACLResponseInspectionPropertyFromCloudFormation(properties.ResponseInspection) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ManagedRuleGroupConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ManagedRuleGroupConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLManagedRuleGroupConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsManagedRulesAcfpRuleSet", CfnWebACLAWSManagedRulesACFPRuleSetPropertyValidator)(properties.awsManagedRulesAcfpRuleSet));
  errors.collect(cdk.propertyValidator("awsManagedRulesAtpRuleSet", CfnWebACLAWSManagedRulesATPRuleSetPropertyValidator)(properties.awsManagedRulesAtpRuleSet));
  errors.collect(cdk.propertyValidator("awsManagedRulesBotControlRuleSet", CfnWebACLAWSManagedRulesBotControlRuleSetPropertyValidator)(properties.awsManagedRulesBotControlRuleSet));
  errors.collect(cdk.propertyValidator("loginPath", cdk.validateString)(properties.loginPath));
  errors.collect(cdk.propertyValidator("passwordField", CfnWebACLFieldIdentifierPropertyValidator)(properties.passwordField));
  errors.collect(cdk.propertyValidator("payloadType", cdk.validateString)(properties.payloadType));
  errors.collect(cdk.propertyValidator("usernameField", CfnWebACLFieldIdentifierPropertyValidator)(properties.usernameField));
  return errors.wrap("supplied properties not correct for \"ManagedRuleGroupConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLManagedRuleGroupConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLManagedRuleGroupConfigPropertyValidator(properties).assertSuccess();
  return {
    "AWSManagedRulesACFPRuleSet": convertCfnWebACLAWSManagedRulesACFPRuleSetPropertyToCloudFormation(properties.awsManagedRulesAcfpRuleSet),
    "AWSManagedRulesATPRuleSet": convertCfnWebACLAWSManagedRulesATPRuleSetPropertyToCloudFormation(properties.awsManagedRulesAtpRuleSet),
    "AWSManagedRulesBotControlRuleSet": convertCfnWebACLAWSManagedRulesBotControlRuleSetPropertyToCloudFormation(properties.awsManagedRulesBotControlRuleSet),
    "LoginPath": cdk.stringToCloudFormation(properties.loginPath),
    "PasswordField": convertCfnWebACLFieldIdentifierPropertyToCloudFormation(properties.passwordField),
    "PayloadType": cdk.stringToCloudFormation(properties.payloadType),
    "UsernameField": convertCfnWebACLFieldIdentifierPropertyToCloudFormation(properties.usernameField)
  };
}

// @ts-ignore TS6133
function CfnWebACLManagedRuleGroupConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.ManagedRuleGroupConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ManagedRuleGroupConfigProperty>();
  ret.addPropertyResult("awsManagedRulesAcfpRuleSet", "AWSManagedRulesACFPRuleSet", (properties.AWSManagedRulesACFPRuleSet != null ? CfnWebACLAWSManagedRulesACFPRuleSetPropertyFromCloudFormation(properties.AWSManagedRulesACFPRuleSet) : undefined));
  ret.addPropertyResult("awsManagedRulesAtpRuleSet", "AWSManagedRulesATPRuleSet", (properties.AWSManagedRulesATPRuleSet != null ? CfnWebACLAWSManagedRulesATPRuleSetPropertyFromCloudFormation(properties.AWSManagedRulesATPRuleSet) : undefined));
  ret.addPropertyResult("awsManagedRulesBotControlRuleSet", "AWSManagedRulesBotControlRuleSet", (properties.AWSManagedRulesBotControlRuleSet != null ? CfnWebACLAWSManagedRulesBotControlRuleSetPropertyFromCloudFormation(properties.AWSManagedRulesBotControlRuleSet) : undefined));
  ret.addPropertyResult("loginPath", "LoginPath", (properties.LoginPath != null ? cfn_parse.FromCloudFormation.getString(properties.LoginPath) : undefined));
  ret.addPropertyResult("passwordField", "PasswordField", (properties.PasswordField != null ? CfnWebACLFieldIdentifierPropertyFromCloudFormation(properties.PasswordField) : undefined));
  ret.addPropertyResult("payloadType", "PayloadType", (properties.PayloadType != null ? cfn_parse.FromCloudFormation.getString(properties.PayloadType) : undefined));
  ret.addPropertyResult("usernameField", "UsernameField", (properties.UsernameField != null ? CfnWebACLFieldIdentifierPropertyFromCloudFormation(properties.UsernameField) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ManagedRuleGroupStatementProperty`
 *
 * @param properties - the TypeScript properties of a `ManagedRuleGroupStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLManagedRuleGroupStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("excludedRules", cdk.listValidator(CfnWebACLExcludedRulePropertyValidator))(properties.excludedRules));
  errors.collect(cdk.propertyValidator("managedRuleGroupConfigs", cdk.listValidator(CfnWebACLManagedRuleGroupConfigPropertyValidator))(properties.managedRuleGroupConfigs));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("ruleActionOverrides", cdk.listValidator(CfnWebACLRuleActionOverridePropertyValidator))(properties.ruleActionOverrides));
  errors.collect(cdk.propertyValidator("scopeDownStatement", CfnWebACLStatementPropertyValidator)(properties.scopeDownStatement));
  errors.collect(cdk.propertyValidator("vendorName", cdk.requiredValidator)(properties.vendorName));
  errors.collect(cdk.propertyValidator("vendorName", cdk.validateString)(properties.vendorName));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"ManagedRuleGroupStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLManagedRuleGroupStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLManagedRuleGroupStatementPropertyValidator(properties).assertSuccess();
  return {
    "ExcludedRules": cdk.listMapper(convertCfnWebACLExcludedRulePropertyToCloudFormation)(properties.excludedRules),
    "ManagedRuleGroupConfigs": cdk.listMapper(convertCfnWebACLManagedRuleGroupConfigPropertyToCloudFormation)(properties.managedRuleGroupConfigs),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RuleActionOverrides": cdk.listMapper(convertCfnWebACLRuleActionOverridePropertyToCloudFormation)(properties.ruleActionOverrides),
    "ScopeDownStatement": convertCfnWebACLStatementPropertyToCloudFormation(properties.scopeDownStatement),
    "VendorName": cdk.stringToCloudFormation(properties.vendorName),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnWebACLManagedRuleGroupStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.ManagedRuleGroupStatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ManagedRuleGroupStatementProperty>();
  ret.addPropertyResult("excludedRules", "ExcludedRules", (properties.ExcludedRules != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLExcludedRulePropertyFromCloudFormation)(properties.ExcludedRules) : undefined));
  ret.addPropertyResult("managedRuleGroupConfigs", "ManagedRuleGroupConfigs", (properties.ManagedRuleGroupConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLManagedRuleGroupConfigPropertyFromCloudFormation)(properties.ManagedRuleGroupConfigs) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("ruleActionOverrides", "RuleActionOverrides", (properties.RuleActionOverrides != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLRuleActionOverridePropertyFromCloudFormation)(properties.RuleActionOverrides) : undefined));
  ret.addPropertyResult("scopeDownStatement", "ScopeDownStatement", (properties.ScopeDownStatement != null ? CfnWebACLStatementPropertyFromCloudFormation(properties.ScopeDownStatement) : undefined));
  ret.addPropertyResult("vendorName", "VendorName", (properties.VendorName != null ? cfn_parse.FromCloudFormation.getString(properties.VendorName) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IPSetForwardedIPConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetForwardedIPConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLIPSetForwardedIPConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fallbackBehavior", cdk.requiredValidator)(properties.fallbackBehavior));
  errors.collect(cdk.propertyValidator("fallbackBehavior", cdk.validateString)(properties.fallbackBehavior));
  errors.collect(cdk.propertyValidator("headerName", cdk.requiredValidator)(properties.headerName));
  errors.collect(cdk.propertyValidator("headerName", cdk.validateString)(properties.headerName));
  errors.collect(cdk.propertyValidator("position", cdk.requiredValidator)(properties.position));
  errors.collect(cdk.propertyValidator("position", cdk.validateString)(properties.position));
  return errors.wrap("supplied properties not correct for \"IPSetForwardedIPConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLIPSetForwardedIPConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLIPSetForwardedIPConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "FallbackBehavior": cdk.stringToCloudFormation(properties.fallbackBehavior),
    "HeaderName": cdk.stringToCloudFormation(properties.headerName),
    "Position": cdk.stringToCloudFormation(properties.position)
  };
}

// @ts-ignore TS6133
function CfnWebACLIPSetForwardedIPConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.IPSetForwardedIPConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.IPSetForwardedIPConfigurationProperty>();
  ret.addPropertyResult("fallbackBehavior", "FallbackBehavior", (properties.FallbackBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.FallbackBehavior) : undefined));
  ret.addPropertyResult("headerName", "HeaderName", (properties.HeaderName != null ? cfn_parse.FromCloudFormation.getString(properties.HeaderName) : undefined));
  ret.addPropertyResult("position", "Position", (properties.Position != null ? cfn_parse.FromCloudFormation.getString(properties.Position) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IPSetReferenceStatementProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetReferenceStatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLIPSetReferenceStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.requiredValidator)(properties.arn));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("ipSetForwardedIpConfig", CfnWebACLIPSetForwardedIPConfigurationPropertyValidator)(properties.ipSetForwardedIpConfig));
  return errors.wrap("supplied properties not correct for \"IPSetReferenceStatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLIPSetReferenceStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLIPSetReferenceStatementPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "IPSetForwardedIPConfig": convertCfnWebACLIPSetForwardedIPConfigurationPropertyToCloudFormation(properties.ipSetForwardedIpConfig)
  };
}

// @ts-ignore TS6133
function CfnWebACLIPSetReferenceStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.IPSetReferenceStatementProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.IPSetReferenceStatementProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addPropertyResult("ipSetForwardedIpConfig", "IPSetForwardedIPConfig", (properties.IPSetForwardedIPConfig != null ? CfnWebACLIPSetForwardedIPConfigurationPropertyFromCloudFormation(properties.IPSetForwardedIPConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StatementProperty`
 *
 * @param properties - the TypeScript properties of a `StatementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLStatementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("andStatement", CfnWebACLAndStatementPropertyValidator)(properties.andStatement));
  errors.collect(cdk.propertyValidator("byteMatchStatement", CfnWebACLByteMatchStatementPropertyValidator)(properties.byteMatchStatement));
  errors.collect(cdk.propertyValidator("geoMatchStatement", CfnWebACLGeoMatchStatementPropertyValidator)(properties.geoMatchStatement));
  errors.collect(cdk.propertyValidator("ipSetReferenceStatement", CfnWebACLIPSetReferenceStatementPropertyValidator)(properties.ipSetReferenceStatement));
  errors.collect(cdk.propertyValidator("labelMatchStatement", CfnWebACLLabelMatchStatementPropertyValidator)(properties.labelMatchStatement));
  errors.collect(cdk.propertyValidator("managedRuleGroupStatement", CfnWebACLManagedRuleGroupStatementPropertyValidator)(properties.managedRuleGroupStatement));
  errors.collect(cdk.propertyValidator("notStatement", CfnWebACLNotStatementPropertyValidator)(properties.notStatement));
  errors.collect(cdk.propertyValidator("orStatement", CfnWebACLOrStatementPropertyValidator)(properties.orStatement));
  errors.collect(cdk.propertyValidator("rateBasedStatement", CfnWebACLRateBasedStatementPropertyValidator)(properties.rateBasedStatement));
  errors.collect(cdk.propertyValidator("regexMatchStatement", CfnWebACLRegexMatchStatementPropertyValidator)(properties.regexMatchStatement));
  errors.collect(cdk.propertyValidator("regexPatternSetReferenceStatement", CfnWebACLRegexPatternSetReferenceStatementPropertyValidator)(properties.regexPatternSetReferenceStatement));
  errors.collect(cdk.propertyValidator("ruleGroupReferenceStatement", CfnWebACLRuleGroupReferenceStatementPropertyValidator)(properties.ruleGroupReferenceStatement));
  errors.collect(cdk.propertyValidator("sizeConstraintStatement", CfnWebACLSizeConstraintStatementPropertyValidator)(properties.sizeConstraintStatement));
  errors.collect(cdk.propertyValidator("sqliMatchStatement", CfnWebACLSqliMatchStatementPropertyValidator)(properties.sqliMatchStatement));
  errors.collect(cdk.propertyValidator("xssMatchStatement", CfnWebACLXssMatchStatementPropertyValidator)(properties.xssMatchStatement));
  return errors.wrap("supplied properties not correct for \"StatementProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLStatementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLStatementPropertyValidator(properties).assertSuccess();
  return {
    "AndStatement": convertCfnWebACLAndStatementPropertyToCloudFormation(properties.andStatement),
    "ByteMatchStatement": convertCfnWebACLByteMatchStatementPropertyToCloudFormation(properties.byteMatchStatement),
    "GeoMatchStatement": convertCfnWebACLGeoMatchStatementPropertyToCloudFormation(properties.geoMatchStatement),
    "IPSetReferenceStatement": convertCfnWebACLIPSetReferenceStatementPropertyToCloudFormation(properties.ipSetReferenceStatement),
    "LabelMatchStatement": convertCfnWebACLLabelMatchStatementPropertyToCloudFormation(properties.labelMatchStatement),
    "ManagedRuleGroupStatement": convertCfnWebACLManagedRuleGroupStatementPropertyToCloudFormation(properties.managedRuleGroupStatement),
    "NotStatement": convertCfnWebACLNotStatementPropertyToCloudFormation(properties.notStatement),
    "OrStatement": convertCfnWebACLOrStatementPropertyToCloudFormation(properties.orStatement),
    "RateBasedStatement": convertCfnWebACLRateBasedStatementPropertyToCloudFormation(properties.rateBasedStatement),
    "RegexMatchStatement": convertCfnWebACLRegexMatchStatementPropertyToCloudFormation(properties.regexMatchStatement),
    "RegexPatternSetReferenceStatement": convertCfnWebACLRegexPatternSetReferenceStatementPropertyToCloudFormation(properties.regexPatternSetReferenceStatement),
    "RuleGroupReferenceStatement": convertCfnWebACLRuleGroupReferenceStatementPropertyToCloudFormation(properties.ruleGroupReferenceStatement),
    "SizeConstraintStatement": convertCfnWebACLSizeConstraintStatementPropertyToCloudFormation(properties.sizeConstraintStatement),
    "SqliMatchStatement": convertCfnWebACLSqliMatchStatementPropertyToCloudFormation(properties.sqliMatchStatement),
    "XssMatchStatement": convertCfnWebACLXssMatchStatementPropertyToCloudFormation(properties.xssMatchStatement)
  };
}

// @ts-ignore TS6133
function CfnWebACLStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.StatementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.StatementProperty>();
  ret.addPropertyResult("andStatement", "AndStatement", (properties.AndStatement != null ? CfnWebACLAndStatementPropertyFromCloudFormation(properties.AndStatement) : undefined));
  ret.addPropertyResult("byteMatchStatement", "ByteMatchStatement", (properties.ByteMatchStatement != null ? CfnWebACLByteMatchStatementPropertyFromCloudFormation(properties.ByteMatchStatement) : undefined));
  ret.addPropertyResult("geoMatchStatement", "GeoMatchStatement", (properties.GeoMatchStatement != null ? CfnWebACLGeoMatchStatementPropertyFromCloudFormation(properties.GeoMatchStatement) : undefined));
  ret.addPropertyResult("ipSetReferenceStatement", "IPSetReferenceStatement", (properties.IPSetReferenceStatement != null ? CfnWebACLIPSetReferenceStatementPropertyFromCloudFormation(properties.IPSetReferenceStatement) : undefined));
  ret.addPropertyResult("labelMatchStatement", "LabelMatchStatement", (properties.LabelMatchStatement != null ? CfnWebACLLabelMatchStatementPropertyFromCloudFormation(properties.LabelMatchStatement) : undefined));
  ret.addPropertyResult("managedRuleGroupStatement", "ManagedRuleGroupStatement", (properties.ManagedRuleGroupStatement != null ? CfnWebACLManagedRuleGroupStatementPropertyFromCloudFormation(properties.ManagedRuleGroupStatement) : undefined));
  ret.addPropertyResult("notStatement", "NotStatement", (properties.NotStatement != null ? CfnWebACLNotStatementPropertyFromCloudFormation(properties.NotStatement) : undefined));
  ret.addPropertyResult("orStatement", "OrStatement", (properties.OrStatement != null ? CfnWebACLOrStatementPropertyFromCloudFormation(properties.OrStatement) : undefined));
  ret.addPropertyResult("rateBasedStatement", "RateBasedStatement", (properties.RateBasedStatement != null ? CfnWebACLRateBasedStatementPropertyFromCloudFormation(properties.RateBasedStatement) : undefined));
  ret.addPropertyResult("regexMatchStatement", "RegexMatchStatement", (properties.RegexMatchStatement != null ? CfnWebACLRegexMatchStatementPropertyFromCloudFormation(properties.RegexMatchStatement) : undefined));
  ret.addPropertyResult("regexPatternSetReferenceStatement", "RegexPatternSetReferenceStatement", (properties.RegexPatternSetReferenceStatement != null ? CfnWebACLRegexPatternSetReferenceStatementPropertyFromCloudFormation(properties.RegexPatternSetReferenceStatement) : undefined));
  ret.addPropertyResult("ruleGroupReferenceStatement", "RuleGroupReferenceStatement", (properties.RuleGroupReferenceStatement != null ? CfnWebACLRuleGroupReferenceStatementPropertyFromCloudFormation(properties.RuleGroupReferenceStatement) : undefined));
  ret.addPropertyResult("sizeConstraintStatement", "SizeConstraintStatement", (properties.SizeConstraintStatement != null ? CfnWebACLSizeConstraintStatementPropertyFromCloudFormation(properties.SizeConstraintStatement) : undefined));
  ret.addPropertyResult("sqliMatchStatement", "SqliMatchStatement", (properties.SqliMatchStatement != null ? CfnWebACLSqliMatchStatementPropertyFromCloudFormation(properties.SqliMatchStatement) : undefined));
  ret.addPropertyResult("xssMatchStatement", "XssMatchStatement", (properties.XssMatchStatement != null ? CfnWebACLXssMatchStatementPropertyFromCloudFormation(properties.XssMatchStatement) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OverrideActionProperty`
 *
 * @param properties - the TypeScript properties of a `OverrideActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLOverrideActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("count", cdk.validateObject)(properties.count));
  errors.collect(cdk.propertyValidator("none", cdk.validateObject)(properties.none));
  return errors.wrap("supplied properties not correct for \"OverrideActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLOverrideActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLOverrideActionPropertyValidator(properties).assertSuccess();
  return {
    "Count": cdk.objectToCloudFormation(properties.count),
    "None": cdk.objectToCloudFormation(properties.none)
  };
}

// @ts-ignore TS6133
function CfnWebACLOverrideActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.OverrideActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.OverrideActionProperty>();
  ret.addPropertyResult("count", "Count", (properties.Count != null ? cfn_parse.FromCloudFormation.getAny(properties.Count) : undefined));
  ret.addPropertyResult("none", "None", (properties.None != null ? cfn_parse.FromCloudFormation.getAny(properties.None) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LabelProperty`
 *
 * @param properties - the TypeScript properties of a `LabelProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLLabelPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"LabelProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLLabelPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLLabelPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnWebACLLabelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.LabelProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.LabelProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VisibilityConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VisibilityConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLVisibilityConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchMetricsEnabled", cdk.requiredValidator)(properties.cloudWatchMetricsEnabled));
  errors.collect(cdk.propertyValidator("cloudWatchMetricsEnabled", cdk.validateBoolean)(properties.cloudWatchMetricsEnabled));
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("sampledRequestsEnabled", cdk.requiredValidator)(properties.sampledRequestsEnabled));
  errors.collect(cdk.propertyValidator("sampledRequestsEnabled", cdk.validateBoolean)(properties.sampledRequestsEnabled));
  return errors.wrap("supplied properties not correct for \"VisibilityConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLVisibilityConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLVisibilityConfigPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchMetricsEnabled": cdk.booleanToCloudFormation(properties.cloudWatchMetricsEnabled),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "SampledRequestsEnabled": cdk.booleanToCloudFormation(properties.sampledRequestsEnabled)
  };
}

// @ts-ignore TS6133
function CfnWebACLVisibilityConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.VisibilityConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.VisibilityConfigProperty>();
  ret.addPropertyResult("cloudWatchMetricsEnabled", "CloudWatchMetricsEnabled", (properties.CloudWatchMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CloudWatchMetricsEnabled) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("sampledRequestsEnabled", "SampledRequestsEnabled", (properties.SampledRequestsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SampledRequestsEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CaptchaConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CaptchaConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLCaptchaConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("immunityTimeProperty", CfnWebACLImmunityTimePropertyPropertyValidator)(properties.immunityTimeProperty));
  return errors.wrap("supplied properties not correct for \"CaptchaConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLCaptchaConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLCaptchaConfigPropertyValidator(properties).assertSuccess();
  return {
    "ImmunityTimeProperty": convertCfnWebACLImmunityTimePropertyPropertyToCloudFormation(properties.immunityTimeProperty)
  };
}

// @ts-ignore TS6133
function CfnWebACLCaptchaConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CaptchaConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CaptchaConfigProperty>();
  ret.addPropertyResult("immunityTimeProperty", "ImmunityTimeProperty", (properties.ImmunityTimeProperty != null ? CfnWebACLImmunityTimePropertyPropertyFromCloudFormation(properties.ImmunityTimeProperty) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", CfnWebACLRuleActionPropertyValidator)(properties.action));
  errors.collect(cdk.propertyValidator("captchaConfig", CfnWebACLCaptchaConfigPropertyValidator)(properties.captchaConfig));
  errors.collect(cdk.propertyValidator("challengeConfig", CfnWebACLChallengeConfigPropertyValidator)(properties.challengeConfig));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("overrideAction", CfnWebACLOverrideActionPropertyValidator)(properties.overrideAction));
  errors.collect(cdk.propertyValidator("priority", cdk.requiredValidator)(properties.priority));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("ruleLabels", cdk.listValidator(CfnWebACLLabelPropertyValidator))(properties.ruleLabels));
  errors.collect(cdk.propertyValidator("statement", cdk.requiredValidator)(properties.statement));
  errors.collect(cdk.propertyValidator("statement", CfnWebACLStatementPropertyValidator)(properties.statement));
  errors.collect(cdk.propertyValidator("visibilityConfig", cdk.requiredValidator)(properties.visibilityConfig));
  errors.collect(cdk.propertyValidator("visibilityConfig", CfnWebACLVisibilityConfigPropertyValidator)(properties.visibilityConfig));
  return errors.wrap("supplied properties not correct for \"RuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLRulePropertyValidator(properties).assertSuccess();
  return {
    "Action": convertCfnWebACLRuleActionPropertyToCloudFormation(properties.action),
    "CaptchaConfig": convertCfnWebACLCaptchaConfigPropertyToCloudFormation(properties.captchaConfig),
    "ChallengeConfig": convertCfnWebACLChallengeConfigPropertyToCloudFormation(properties.challengeConfig),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OverrideAction": convertCfnWebACLOverrideActionPropertyToCloudFormation(properties.overrideAction),
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "RuleLabels": cdk.listMapper(convertCfnWebACLLabelPropertyToCloudFormation)(properties.ruleLabels),
    "Statement": convertCfnWebACLStatementPropertyToCloudFormation(properties.statement),
    "VisibilityConfig": convertCfnWebACLVisibilityConfigPropertyToCloudFormation(properties.visibilityConfig)
  };
}

// @ts-ignore TS6133
function CfnWebACLRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.RuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RuleProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? CfnWebACLRuleActionPropertyFromCloudFormation(properties.Action) : undefined));
  ret.addPropertyResult("captchaConfig", "CaptchaConfig", (properties.CaptchaConfig != null ? CfnWebACLCaptchaConfigPropertyFromCloudFormation(properties.CaptchaConfig) : undefined));
  ret.addPropertyResult("challengeConfig", "ChallengeConfig", (properties.ChallengeConfig != null ? CfnWebACLChallengeConfigPropertyFromCloudFormation(properties.ChallengeConfig) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("overrideAction", "OverrideAction", (properties.OverrideAction != null ? CfnWebACLOverrideActionPropertyFromCloudFormation(properties.OverrideAction) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("ruleLabels", "RuleLabels", (properties.RuleLabels != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLLabelPropertyFromCloudFormation)(properties.RuleLabels) : undefined));
  ret.addPropertyResult("statement", "Statement", (properties.Statement != null ? CfnWebACLStatementPropertyFromCloudFormation(properties.Statement) : undefined));
  ret.addPropertyResult("visibilityConfig", "VisibilityConfig", (properties.VisibilityConfig != null ? CfnWebACLVisibilityConfigPropertyFromCloudFormation(properties.VisibilityConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnWebACLProps`
 *
 * @param properties - the TypeScript properties of a `CfnWebACLProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("associationConfig", CfnWebACLAssociationConfigPropertyValidator)(properties.associationConfig));
  errors.collect(cdk.propertyValidator("captchaConfig", CfnWebACLCaptchaConfigPropertyValidator)(properties.captchaConfig));
  errors.collect(cdk.propertyValidator("challengeConfig", CfnWebACLChallengeConfigPropertyValidator)(properties.challengeConfig));
  errors.collect(cdk.propertyValidator("customResponseBodies", cdk.hashValidator(CfnWebACLCustomResponseBodyPropertyValidator))(properties.customResponseBodies));
  errors.collect(cdk.propertyValidator("defaultAction", cdk.requiredValidator)(properties.defaultAction));
  errors.collect(cdk.propertyValidator("defaultAction", CfnWebACLDefaultActionPropertyValidator)(properties.defaultAction));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("rules", cdk.listValidator(CfnWebACLRulePropertyValidator))(properties.rules));
  errors.collect(cdk.propertyValidator("scope", cdk.requiredValidator)(properties.scope));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("tokenDomains", cdk.listValidator(cdk.validateString))(properties.tokenDomains));
  errors.collect(cdk.propertyValidator("visibilityConfig", cdk.requiredValidator)(properties.visibilityConfig));
  errors.collect(cdk.propertyValidator("visibilityConfig", CfnWebACLVisibilityConfigPropertyValidator)(properties.visibilityConfig));
  return errors.wrap("supplied properties not correct for \"CfnWebACLProps\"");
}

// @ts-ignore TS6133
function convertCfnWebACLPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLPropsValidator(properties).assertSuccess();
  return {
    "AssociationConfig": convertCfnWebACLAssociationConfigPropertyToCloudFormation(properties.associationConfig),
    "CaptchaConfig": convertCfnWebACLCaptchaConfigPropertyToCloudFormation(properties.captchaConfig),
    "ChallengeConfig": convertCfnWebACLChallengeConfigPropertyToCloudFormation(properties.challengeConfig),
    "CustomResponseBodies": cdk.hashMapper(convertCfnWebACLCustomResponseBodyPropertyToCloudFormation)(properties.customResponseBodies),
    "DefaultAction": convertCfnWebACLDefaultActionPropertyToCloudFormation(properties.defaultAction),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Rules": cdk.listMapper(convertCfnWebACLRulePropertyToCloudFormation)(properties.rules),
    "Scope": cdk.stringToCloudFormation(properties.scope),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TokenDomains": cdk.listMapper(cdk.stringToCloudFormation)(properties.tokenDomains),
    "VisibilityConfig": convertCfnWebACLVisibilityConfigPropertyToCloudFormation(properties.visibilityConfig)
  };
}

// @ts-ignore TS6133
function CfnWebACLPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACLProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACLProps>();
  ret.addPropertyResult("associationConfig", "AssociationConfig", (properties.AssociationConfig != null ? CfnWebACLAssociationConfigPropertyFromCloudFormation(properties.AssociationConfig) : undefined));
  ret.addPropertyResult("captchaConfig", "CaptchaConfig", (properties.CaptchaConfig != null ? CfnWebACLCaptchaConfigPropertyFromCloudFormation(properties.CaptchaConfig) : undefined));
  ret.addPropertyResult("challengeConfig", "ChallengeConfig", (properties.ChallengeConfig != null ? CfnWebACLChallengeConfigPropertyFromCloudFormation(properties.ChallengeConfig) : undefined));
  ret.addPropertyResult("customResponseBodies", "CustomResponseBodies", (properties.CustomResponseBodies != null ? cfn_parse.FromCloudFormation.getMap(CfnWebACLCustomResponseBodyPropertyFromCloudFormation)(properties.CustomResponseBodies) : undefined));
  ret.addPropertyResult("defaultAction", "DefaultAction", (properties.DefaultAction != null ? CfnWebACLDefaultActionPropertyFromCloudFormation(properties.DefaultAction) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLRulePropertyFromCloudFormation)(properties.Rules) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("tokenDomains", "TokenDomains", (properties.TokenDomains != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TokenDomains) : undefined));
  ret.addPropertyResult("visibilityConfig", "VisibilityConfig", (properties.VisibilityConfig != null ? CfnWebACLVisibilityConfigPropertyFromCloudFormation(properties.VisibilityConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SingleHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `SingleHeaderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLSingleHeaderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"SingleHeaderProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLSingleHeaderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLSingleHeaderPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnWebACLSingleHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.SingleHeaderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.SingleHeaderProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SingleQueryArgumentProperty`
 *
 * @param properties - the TypeScript properties of a `SingleQueryArgumentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLSingleQueryArgumentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"SingleQueryArgumentProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebACLSingleQueryArgumentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLSingleQueryArgumentPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnWebACLSingleQueryArgumentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebACL.SingleQueryArgumentProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.SingleQueryArgumentProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > This is the latest version of *AWS WAF* , named AWS WAF V2, released in November, 2019.
 *
 * For information, including how to migrate your AWS WAF resources from the prior release, see the [AWS WAF developer guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
 *
 * Use a web ACL association to define an association between a web ACL and a regional application resource, to protect the resource. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AWS AppSync GraphQL API, an Amazon Cognito user pool, an AWS App Runner service, or an AWS Verified Access instance.
 *
 * For Amazon CloudFront , don't use this resource. Instead, use your CloudFront distribution configuration. To associate a web ACL with a distribution, provide the Amazon Resource Name (ARN) of the `WebACL` to your CloudFront distribution configuration. To disassociate a web ACL, provide an empty ARN. For information, see [AWS::CloudFront::Distribution](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html) .
 *
 * *Required permissions for customer-managed IAM policies*
 *
 * This call requires permissions that are specific to the protected resource type. For details, see [Permissions for AssociateWebACL](https://docs.aws.amazon.com/waf/latest/developerguide/security_iam_service-with-iam.html#security_iam_action-AssociateWebACL) in the *AWS WAF Developer Guide* .
 *
 * *Temporary inconsistencies during updates*
 *
 * When you create or change a web ACL or other AWS WAF resources, the changes take a small amount of time to propagate to all areas where the resources are stored. The propagation time can be from a few seconds to a number of minutes.
 *
 * The following are examples of the temporary inconsistencies that you might notice during change propagation:
 *
 * - After you create a web ACL, if you try to associate it with a resource, you might get an exception indicating that the web ACL is unavailable.
 * - After you add a rule group to a web ACL, the new rule group rules might be in effect in one area where the web ACL is used and not in another.
 * - After you change a rule action setting, you might see the old action in some places and the new action in others.
 * - After you add an IP address to an IP set that is in use in a blocking rule, the new address might be blocked in one area while still allowed in another.
 *
 * @cloudformationResource AWS::WAFv2::WebACLAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webaclassociation.html
 */
export class CfnWebACLAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WAFv2::WebACLAssociation";

  /**
   * Build a CfnWebACLAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWebACLAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWebACLAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWebACLAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the resource to associate with the web ACL.
   */
  public resourceArn: string;

  /**
   * The Amazon Resource Name (ARN) of the web ACL that you want to associate with the resource.
   */
  public webAclArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWebACLAssociationProps) {
    super(scope, id, {
      "type": CfnWebACLAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "resourceArn", this);
    cdk.requireProperty(props, "webAclArn", this);

    this.resourceArn = props.resourceArn;
    this.webAclArn = props.webAclArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "resourceArn": this.resourceArn,
      "webAclArn": this.webAclArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWebACLAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWebACLAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnWebACLAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webaclassociation.html
 */
export interface CfnWebACLAssociationProps {
  /**
   * The Amazon Resource Name (ARN) of the resource to associate with the web ACL.
   *
   * The ARN must be in one of the following formats:
   *
   * - For an Application Load Balancer: `arn: *partition* :elasticloadbalancing: *region* : *account-id* :loadbalancer/app/ *load-balancer-name* / *load-balancer-id*`
   * - For an Amazon API Gateway REST API: `arn: *partition* :apigateway: *region* ::/restapis/ *api-id* /stages/ *stage-name*`
   * - For an AWS AppSync GraphQL API: `arn: *partition* :appsync: *region* : *account-id* :apis/ *GraphQLApiId*`
   * - For an Amazon Cognito user pool: `arn: *partition* :cognito-idp: *region* : *account-id* :userpool/ *user-pool-id*`
   * - For an AWS App Runner service: `arn: *partition* :apprunner: *region* : *account-id* :service/ *apprunner-service-name* / *apprunner-service-id*`
   * - For an AWS Verified Access instance: `arn: *partition* :ec2: *region* : *account-id* :verified-access-instance/ *instance-id*`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webaclassociation.html#cfn-wafv2-webaclassociation-resourcearn
   */
  readonly resourceArn: string;

  /**
   * The Amazon Resource Name (ARN) of the web ACL that you want to associate with the resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webaclassociation.html#cfn-wafv2-webaclassociation-webaclarn
   */
  readonly webAclArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnWebACLAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnWebACLAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebACLAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("webAclArn", cdk.requiredValidator)(properties.webAclArn));
  errors.collect(cdk.propertyValidator("webAclArn", cdk.validateString)(properties.webAclArn));
  return errors.wrap("supplied properties not correct for \"CfnWebACLAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnWebACLAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebACLAssociationPropsValidator(properties).assertSuccess();
  return {
    "ResourceArn": cdk.stringToCloudFormation(properties.resourceArn),
    "WebACLArn": cdk.stringToCloudFormation(properties.webAclArn)
  };
}

// @ts-ignore TS6133
function CfnWebACLAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACLAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACLAssociationProps>();
  ret.addPropertyResult("resourceArn", "ResourceArn", (properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined));
  ret.addPropertyResult("webAclArn", "WebACLArn", (properties.WebACLArn != null ? cfn_parse.FromCloudFormation.getString(properties.WebACLArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}