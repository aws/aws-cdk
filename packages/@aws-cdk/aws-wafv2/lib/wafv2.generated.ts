// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:32.231Z","fingerprint":"bccDiiGDb1rWIRGxMCFB6gT4sk92VsOawLn21YfoOGk="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnIPSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html
 */
export interface CfnIPSetProps {

    /**
     * Contains an array of strings that specifies zero or more IP addresses or blocks of IP addresses. All addresses must be specified using Classless Inter-Domain Routing (CIDR) notation. AWS WAF supports all IPv4 and IPv6 CIDR ranges except for `/0` .
     *
     * Example address strings:
     *
     * - To configure AWS WAF to allow, block, or count requests that originated from the IP address 192.0.2.44, specify `192.0.2.44/32` .
     * - To configure AWS WAF to allow, block, or count requests that originated from IP addresses from 192.0.2.0 to 192.0.2.255, specify `192.0.2.0/24` .
     * - To configure AWS WAF to allow, block, or count requests that originated from the IP address 1111:0000:0000:0000:0000:0000:0000:0111, specify `1111:0000:0000:0000:0000:0000:0000:0111/128` .
     * - To configure AWS WAF to allow, block, or count requests that originated from IP addresses 1111:0000:0000:0000:0000:0000:0000:0000 to 1111:0000:0000:0000:ffff:ffff:ffff:ffff, specify `1111:0000:0000:0000:0000:0000:0000:0000/64` .
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-addresses
     */
    readonly addresses: string[];

    /**
     * The version of the IP addresses, either `IPV4` or `IPV6` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-ipaddressversion
     */
    readonly ipAddressVersion: string;

    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AWS AppSync GraphQL API, or an Amazon Cognito user pool. Valid Values are `CLOUDFRONT` and `REGIONAL` .
     *
     * > For `CLOUDFRONT` , you must create your WAFv2 resources in the US East (N. Virginia) Region, `us-east-1` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-scope
     */
    readonly scope: string;

    /**
     * A description of the IP set that helps with identification.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-description
     */
    readonly description?: string;

    /**
     * The name of the IP set. You cannot change the name of an `IPSet` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-name
     */
    readonly name?: string;

    /**
     * Key:value pairs associated with an AWS resource. The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
     *
     * > To modify tags on existing resources, use the AWS WAF APIs or command line interface. With AWS CloudFormation , you can only add tags to AWS WAF resources during resource creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnIPSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnIPSetProps`
 *
 * @returns the result of the validation.
 */
function CfnIPSetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('addresses', cdk.requiredValidator)(properties.addresses));
    errors.collect(cdk.propertyValidator('addresses', cdk.listValidator(cdk.validateString))(properties.addresses));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('ipAddressVersion', cdk.requiredValidator)(properties.ipAddressVersion));
    errors.collect(cdk.propertyValidator('ipAddressVersion', cdk.validateString)(properties.ipAddressVersion));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('scope', cdk.requiredValidator)(properties.scope));
    errors.collect(cdk.propertyValidator('scope', cdk.validateString)(properties.scope));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnIPSetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::IPSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnIPSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::IPSet` resource.
 */
// @ts-ignore TS6133
function cfnIPSetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIPSetPropsValidator(properties).assertSuccess();
    return {
        Addresses: cdk.listMapper(cdk.stringToCloudFormation)(properties.addresses),
        IPAddressVersion: cdk.stringToCloudFormation(properties.ipAddressVersion),
        Scope: cdk.stringToCloudFormation(properties.scope),
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnIPSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIPSetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIPSetProps>();
    ret.addPropertyResult('addresses', 'Addresses', cfn_parse.FromCloudFormation.getStringArray(properties.Addresses));
    ret.addPropertyResult('ipAddressVersion', 'IPAddressVersion', cfn_parse.FromCloudFormation.getString(properties.IPAddressVersion));
    ret.addPropertyResult('scope', 'Scope', cfn_parse.FromCloudFormation.getString(properties.Scope));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFv2::IPSet`
 *
 * > This is the latest version of *AWS WAF* , named AWS WAF V2, released in November, 2019. For information, including how to migrate your AWS WAF resources from the prior release, see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
 *
 * Use an `IPSet` to identify web requests that originate from specific IP addresses or ranges of IP addresses. For example, if you're receiving a lot of requests from a ranges of IP addresses, you can configure AWS WAF to block them using an IP set that lists those IP addresses.
 *
 * You use an IP set by providing its Amazon Resource Name (ARN) to the rule statement `IPSetReferenceStatement` , when you add a rule to a rule group or web ACL.
 *
 * @cloudformationResource AWS::WAFv2::IPSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html
 */
export class CfnIPSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFv2::IPSet";

    /**
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
        const ret = new CfnIPSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the IP set.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the IP set.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * Contains an array of strings that specifies zero or more IP addresses or blocks of IP addresses. All addresses must be specified using Classless Inter-Domain Routing (CIDR) notation. AWS WAF supports all IPv4 and IPv6 CIDR ranges except for `/0` .
     *
     * Example address strings:
     *
     * - To configure AWS WAF to allow, block, or count requests that originated from the IP address 192.0.2.44, specify `192.0.2.44/32` .
     * - To configure AWS WAF to allow, block, or count requests that originated from IP addresses from 192.0.2.0 to 192.0.2.255, specify `192.0.2.0/24` .
     * - To configure AWS WAF to allow, block, or count requests that originated from the IP address 1111:0000:0000:0000:0000:0000:0000:0111, specify `1111:0000:0000:0000:0000:0000:0000:0111/128` .
     * - To configure AWS WAF to allow, block, or count requests that originated from IP addresses 1111:0000:0000:0000:0000:0000:0000:0000 to 1111:0000:0000:0000:ffff:ffff:ffff:ffff, specify `1111:0000:0000:0000:0000:0000:0000:0000/64` .
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-addresses
     */
    public addresses: string[];

    /**
     * The version of the IP addresses, either `IPV4` or `IPV6` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-ipaddressversion
     */
    public ipAddressVersion: string;

    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AWS AppSync GraphQL API, or an Amazon Cognito user pool. Valid Values are `CLOUDFRONT` and `REGIONAL` .
     *
     * > For `CLOUDFRONT` , you must create your WAFv2 resources in the US East (N. Virginia) Region, `us-east-1` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-scope
     */
    public scope: string;

    /**
     * A description of the IP set that helps with identification.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-description
     */
    public description: string | undefined;

    /**
     * The name of the IP set. You cannot change the name of an `IPSet` after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-name
     */
    public name: string | undefined;

    /**
     * Key:value pairs associated with an AWS resource. The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
     *
     * > To modify tags on existing resources, use the AWS WAF APIs or command line interface. With AWS CloudFormation , you can only add tags to AWS WAF resources during resource creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-ipset.html#cfn-wafv2-ipset-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::WAFv2::IPSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnIPSetProps) {
        super(scope, id, { type: CfnIPSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'addresses', this);
        cdk.requireProperty(props, 'ipAddressVersion', this);
        cdk.requireProperty(props, 'scope', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.addresses = props.addresses;
        this.ipAddressVersion = props.ipAddressVersion;
        this.scope = props.scope;
        this.description = props.description;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::WAFv2::IPSet", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnIPSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            addresses: this.addresses,
            ipAddressVersion: this.ipAddressVersion,
            scope: this.scope,
            description: this.description,
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnIPSetPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnLoggingConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html
 */
export interface CfnLoggingConfigurationProps {

    /**
     * The logging destination configuration that you want to associate with the web ACL.
     *
     * > You can associate one logging destination to a web ACL.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html#cfn-wafv2-loggingconfiguration-logdestinationconfigs
     */
    readonly logDestinationConfigs: string[];

    /**
     * The Amazon Resource Name (ARN) of the web ACL that you want to associate with `LogDestinationConfigs` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html#cfn-wafv2-loggingconfiguration-resourcearn
     */
    readonly resourceArn: string;

    /**
     * Filtering that specifies which web requests are kept in the logs and which are dropped. You can filter on the rule action and on the web request labels that were applied by matching rules during web ACL evaluation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html#cfn-wafv2-loggingconfiguration-loggingfilter
     */
    readonly loggingFilter?: any | cdk.IResolvable;

    /**
     * The parts of the request that you want to keep out of the logs. For example, if you redact the `SingleHeader` field, the `HEADER` field in the logs will be `xxx` .
     *
     * > You can specify only the following fields for redaction: `UriPath` , `QueryString` , `SingleHeader` , `Method` , and `JsonBody` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html#cfn-wafv2-loggingconfiguration-redactedfields
     */
    readonly redactedFields?: Array<CfnLoggingConfiguration.FieldToMatchProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnLoggingConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnLoggingConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnLoggingConfigurationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logDestinationConfigs', cdk.requiredValidator)(properties.logDestinationConfigs));
    errors.collect(cdk.propertyValidator('logDestinationConfigs', cdk.listValidator(cdk.validateString))(properties.logDestinationConfigs));
    errors.collect(cdk.propertyValidator('loggingFilter', cdk.validateObject)(properties.loggingFilter));
    errors.collect(cdk.propertyValidator('redactedFields', cdk.listValidator(CfnLoggingConfiguration_FieldToMatchPropertyValidator))(properties.redactedFields));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    return errors.wrap('supplied properties not correct for "CfnLoggingConfigurationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CfnLoggingConfigurationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnLoggingConfigurationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoggingConfigurationPropsValidator(properties).assertSuccess();
    return {
        LogDestinationConfigs: cdk.listMapper(cdk.stringToCloudFormation)(properties.logDestinationConfigs),
        ResourceArn: cdk.stringToCloudFormation(properties.resourceArn),
        LoggingFilter: cdk.objectToCloudFormation(properties.loggingFilter),
        RedactedFields: cdk.listMapper(cfnLoggingConfigurationFieldToMatchPropertyToCloudFormation)(properties.redactedFields),
    };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfigurationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfigurationProps>();
    ret.addPropertyResult('logDestinationConfigs', 'LogDestinationConfigs', cfn_parse.FromCloudFormation.getStringArray(properties.LogDestinationConfigs));
    ret.addPropertyResult('resourceArn', 'ResourceArn', cfn_parse.FromCloudFormation.getString(properties.ResourceArn));
    ret.addPropertyResult('loggingFilter', 'LoggingFilter', properties.LoggingFilter != null ? cfn_parse.FromCloudFormation.getAny(properties.LoggingFilter) : undefined);
    ret.addPropertyResult('redactedFields', 'RedactedFields', properties.RedactedFields != null ? cfn_parse.FromCloudFormation.getArray(CfnLoggingConfigurationFieldToMatchPropertyFromCloudFormation)(properties.RedactedFields) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFv2::LoggingConfiguration`
 *
 * Defines an association between logging destinations and a web ACL resource, for logging from AWS WAF . As part of the association, you can specify parts of the standard logging fields to keep out of the logs and you can specify filters so that you log only a subset of the logging records.
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
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html
 */
export class CfnLoggingConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFv2::LoggingConfiguration";

    /**
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
        const ret = new CfnLoggingConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Indicates whether the logging configuration was created by AWS Firewall Manager , as part of an AWS WAF policy configuration. If true, only Firewall Manager can modify or delete the configuration.
     * @cloudformationAttribute ManagedByFirewallManager
     */
    public readonly attrManagedByFirewallManager: cdk.IResolvable;

    /**
     * The logging destination configuration that you want to associate with the web ACL.
     *
     * > You can associate one logging destination to a web ACL.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html#cfn-wafv2-loggingconfiguration-logdestinationconfigs
     */
    public logDestinationConfigs: string[];

    /**
     * The Amazon Resource Name (ARN) of the web ACL that you want to associate with `LogDestinationConfigs` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html#cfn-wafv2-loggingconfiguration-resourcearn
     */
    public resourceArn: string;

    /**
     * Filtering that specifies which web requests are kept in the logs and which are dropped. You can filter on the rule action and on the web request labels that were applied by matching rules during web ACL evaluation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html#cfn-wafv2-loggingconfiguration-loggingfilter
     */
    public loggingFilter: any | cdk.IResolvable | undefined;

    /**
     * The parts of the request that you want to keep out of the logs. For example, if you redact the `SingleHeader` field, the `HEADER` field in the logs will be `xxx` .
     *
     * > You can specify only the following fields for redaction: `UriPath` , `QueryString` , `SingleHeader` , `Method` , and `JsonBody` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-loggingconfiguration.html#cfn-wafv2-loggingconfiguration-redactedfields
     */
    public redactedFields: Array<CfnLoggingConfiguration.FieldToMatchProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WAFv2::LoggingConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLoggingConfigurationProps) {
        super(scope, id, { type: CfnLoggingConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'logDestinationConfigs', this);
        cdk.requireProperty(props, 'resourceArn', this);
        this.attrManagedByFirewallManager = this.getAtt('ManagedByFirewallManager', cdk.ResolutionTypeHint.STRING);

        this.logDestinationConfigs = props.logDestinationConfigs;
        this.resourceArn = props.resourceArn;
        this.loggingFilter = props.loggingFilter;
        this.redactedFields = props.redactedFields;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLoggingConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            logDestinationConfigs: this.logDestinationConfigs,
            resourceArn: this.resourceArn,
            loggingFilter: this.loggingFilter,
            redactedFields: this.redactedFields,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLoggingConfigurationPropsToCloudFormation(props);
    }
}

export namespace CfnLoggingConfiguration {
    /**
     * A single action condition for a condition in a logging filter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-actioncondition.html
     */
    export interface ActionConditionProperty {
        /**
         * The action setting that a log record must contain in order to meet the condition. This is the action that AWS WAF applied to the web request.
         *
         * For rule groups, this is either the configured rule action setting, or if you've applied a rule action override to the rule, it's the override action. The value `EXCLUDED_AS_COUNT` matches on excluded rules and also on rules that have a rule action override of Count.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-actioncondition.html#cfn-wafv2-loggingconfiguration-actioncondition-action
         */
        readonly action: string;
    }
}

/**
 * Determine whether the given properties match those of a `ActionConditionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionConditionProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoggingConfiguration_ActionConditionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', cdk.validateString)(properties.action));
    return errors.wrap('supplied properties not correct for "ActionConditionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.ActionCondition` resource
 *
 * @param properties - the TypeScript properties of a `ActionConditionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.ActionCondition` resource.
 */
// @ts-ignore TS6133
function cfnLoggingConfigurationActionConditionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoggingConfiguration_ActionConditionPropertyValidator(properties).assertSuccess();
    return {
        Action: cdk.stringToCloudFormation(properties.action),
    };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationActionConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.ActionConditionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.ActionConditionProperty>();
    ret.addPropertyResult('action', 'Action', cfn_parse.FromCloudFormation.getString(properties.Action));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoggingConfiguration {
    /**
     * A single match condition for a log filter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-condition.html
     */
    export interface ConditionProperty {
        /**
         * A single action condition. This is the action setting that a log record must contain in order to meet the condition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-condition.html#cfn-wafv2-loggingconfiguration-condition-actioncondition
         */
        readonly actionCondition?: CfnLoggingConfiguration.ActionConditionProperty | cdk.IResolvable;
        /**
         * A single label name condition. This is the fully qualified label name that a log record must contain in order to meet the condition. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-condition.html#cfn-wafv2-loggingconfiguration-condition-labelnamecondition
         */
        readonly labelNameCondition?: CfnLoggingConfiguration.LabelNameConditionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ConditionProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoggingConfiguration_ConditionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actionCondition', CfnLoggingConfiguration_ActionConditionPropertyValidator)(properties.actionCondition));
    errors.collect(cdk.propertyValidator('labelNameCondition', CfnLoggingConfiguration_LabelNameConditionPropertyValidator)(properties.labelNameCondition));
    return errors.wrap('supplied properties not correct for "ConditionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.Condition` resource
 *
 * @param properties - the TypeScript properties of a `ConditionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.Condition` resource.
 */
// @ts-ignore TS6133
function cfnLoggingConfigurationConditionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoggingConfiguration_ConditionPropertyValidator(properties).assertSuccess();
    return {
        ActionCondition: cfnLoggingConfigurationActionConditionPropertyToCloudFormation(properties.actionCondition),
        LabelNameCondition: cfnLoggingConfigurationLabelNameConditionPropertyToCloudFormation(properties.labelNameCondition),
    };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.ConditionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.ConditionProperty>();
    ret.addPropertyResult('actionCondition', 'ActionCondition', properties.ActionCondition != null ? CfnLoggingConfigurationActionConditionPropertyFromCloudFormation(properties.ActionCondition) : undefined);
    ret.addPropertyResult('labelNameCondition', 'LabelNameCondition', properties.LabelNameCondition != null ? CfnLoggingConfigurationLabelNameConditionPropertyFromCloudFormation(properties.LabelNameCondition) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoggingConfiguration {
    /**
     * The parts of the request that you want to keep out of the logs. This is used in the logging configuration `RedactedFields` specification.
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-fieldtomatch.html
     */
    export interface FieldToMatchProperty {
        /**
         * Redact the request body JSON.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-fieldtomatch.html#cfn-wafv2-loggingconfiguration-fieldtomatch-jsonbody
         */
        readonly jsonBody?: any | cdk.IResolvable;
        /**
         * Redact the indicated HTTP method. The method indicates the type of operation that the request is asking the origin to perform.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-fieldtomatch.html#cfn-wafv2-loggingconfiguration-fieldtomatch-method
         */
        readonly method?: any | cdk.IResolvable;
        /**
         * Redact the query string. This is the part of a URL that appears after a `?` character, if any.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-fieldtomatch.html#cfn-wafv2-loggingconfiguration-fieldtomatch-querystring
         */
        readonly queryString?: any | cdk.IResolvable;
        /**
         * Redact a single header. Provide the name of the header to inspect, for example, `User-Agent` or `Referer` . This setting isn't case sensitive.
         *
         * Example JSON: `"SingleHeader": { "Name": "haystack" }`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-fieldtomatch.html#cfn-wafv2-loggingconfiguration-fieldtomatch-singleheader
         */
        readonly singleHeader?: any | cdk.IResolvable;
        /**
         * Redact the request URI path. This is the part of the web request that identifies a resource, for example, `/images/daily-ad.jpg` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-fieldtomatch.html#cfn-wafv2-loggingconfiguration-fieldtomatch-uripath
         */
        readonly uriPath?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoggingConfiguration_FieldToMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('jsonBody', cdk.validateObject)(properties.jsonBody));
    errors.collect(cdk.propertyValidator('method', cdk.validateObject)(properties.method));
    errors.collect(cdk.propertyValidator('queryString', cdk.validateObject)(properties.queryString));
    errors.collect(cdk.propertyValidator('singleHeader', cdk.validateObject)(properties.singleHeader));
    errors.collect(cdk.propertyValidator('uriPath', cdk.validateObject)(properties.uriPath));
    return errors.wrap('supplied properties not correct for "FieldToMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.FieldToMatch` resource
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.FieldToMatch` resource.
 */
// @ts-ignore TS6133
function cfnLoggingConfigurationFieldToMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoggingConfiguration_FieldToMatchPropertyValidator(properties).assertSuccess();
    return {
        JsonBody: cdk.objectToCloudFormation(properties.jsonBody),
        Method: cdk.objectToCloudFormation(properties.method),
        QueryString: cdk.objectToCloudFormation(properties.queryString),
        SingleHeader: cdk.objectToCloudFormation(properties.singleHeader),
        UriPath: cdk.objectToCloudFormation(properties.uriPath),
    };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationFieldToMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.FieldToMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.FieldToMatchProperty>();
    ret.addPropertyResult('jsonBody', 'JsonBody', properties.JsonBody != null ? cfn_parse.FromCloudFormation.getAny(properties.JsonBody) : undefined);
    ret.addPropertyResult('method', 'Method', properties.Method != null ? cfn_parse.FromCloudFormation.getAny(properties.Method) : undefined);
    ret.addPropertyResult('queryString', 'QueryString', properties.QueryString != null ? cfn_parse.FromCloudFormation.getAny(properties.QueryString) : undefined);
    ret.addPropertyResult('singleHeader', 'SingleHeader', properties.SingleHeader != null ? cfn_parse.FromCloudFormation.getAny(properties.SingleHeader) : undefined);
    ret.addPropertyResult('uriPath', 'UriPath', properties.UriPath != null ? cfn_parse.FromCloudFormation.getAny(properties.UriPath) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoggingConfiguration {
    /**
     * A single logging filter, used in `LoggingFilter` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-filter.html
     */
    export interface FilterProperty {
        /**
         * How to handle logs that satisfy the filter's conditions and requirement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-filter.html#cfn-wafv2-loggingconfiguration-filter-behavior
         */
        readonly behavior: string;
        /**
         * Match conditions for the filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-filter.html#cfn-wafv2-loggingconfiguration-filter-conditions
         */
        readonly conditions: Array<CfnLoggingConfiguration.ConditionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Logic to apply to the filtering conditions. You can specify that, in order to satisfy the filter, a log must match all conditions or must match at least one condition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-filter.html#cfn-wafv2-loggingconfiguration-filter-requirement
         */
        readonly requirement: string;
    }
}

/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoggingConfiguration_FilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('behavior', cdk.requiredValidator)(properties.behavior));
    errors.collect(cdk.propertyValidator('behavior', cdk.validateString)(properties.behavior));
    errors.collect(cdk.propertyValidator('conditions', cdk.requiredValidator)(properties.conditions));
    errors.collect(cdk.propertyValidator('conditions', cdk.listValidator(CfnLoggingConfiguration_ConditionPropertyValidator))(properties.conditions));
    errors.collect(cdk.propertyValidator('requirement', cdk.requiredValidator)(properties.requirement));
    errors.collect(cdk.propertyValidator('requirement', cdk.validateString)(properties.requirement));
    return errors.wrap('supplied properties not correct for "FilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.Filter` resource
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.Filter` resource.
 */
// @ts-ignore TS6133
function cfnLoggingConfigurationFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoggingConfiguration_FilterPropertyValidator(properties).assertSuccess();
    return {
        Behavior: cdk.stringToCloudFormation(properties.behavior),
        Conditions: cdk.listMapper(cfnLoggingConfigurationConditionPropertyToCloudFormation)(properties.conditions),
        Requirement: cdk.stringToCloudFormation(properties.requirement),
    };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.FilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.FilterProperty>();
    ret.addPropertyResult('behavior', 'Behavior', cfn_parse.FromCloudFormation.getString(properties.Behavior));
    ret.addPropertyResult('conditions', 'Conditions', cfn_parse.FromCloudFormation.getArray(CfnLoggingConfigurationConditionPropertyFromCloudFormation)(properties.Conditions));
    ret.addPropertyResult('requirement', 'Requirement', cfn_parse.FromCloudFormation.getString(properties.Requirement));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoggingConfiguration {
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-jsonbody.html
     */
    export interface JsonBodyProperty {
        /**
         * What AWS WAF should do if it fails to completely parse the JSON body. The options are the following:
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-jsonbody.html#cfn-wafv2-loggingconfiguration-jsonbody-invalidfallbackbehavior
         */
        readonly invalidFallbackBehavior?: string;
        /**
         * The patterns to look for in the JSON body. AWS WAF inspects the results of these pattern matches against the rule inspection criteria.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-jsonbody.html#cfn-wafv2-loggingconfiguration-jsonbody-matchpattern
         */
        readonly matchPattern: CfnLoggingConfiguration.MatchPatternProperty | cdk.IResolvable;
        /**
         * The parts of the JSON to match against using the `MatchPattern` . If you specify `All` , AWS WAF matches against keys and values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-jsonbody.html#cfn-wafv2-loggingconfiguration-jsonbody-matchscope
         */
        readonly matchScope: string;
    }
}

/**
 * Determine whether the given properties match those of a `JsonBodyProperty`
 *
 * @param properties - the TypeScript properties of a `JsonBodyProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoggingConfiguration_JsonBodyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('invalidFallbackBehavior', cdk.validateString)(properties.invalidFallbackBehavior));
    errors.collect(cdk.propertyValidator('matchPattern', cdk.requiredValidator)(properties.matchPattern));
    errors.collect(cdk.propertyValidator('matchPattern', CfnLoggingConfiguration_MatchPatternPropertyValidator)(properties.matchPattern));
    errors.collect(cdk.propertyValidator('matchScope', cdk.requiredValidator)(properties.matchScope));
    errors.collect(cdk.propertyValidator('matchScope', cdk.validateString)(properties.matchScope));
    return errors.wrap('supplied properties not correct for "JsonBodyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.JsonBody` resource
 *
 * @param properties - the TypeScript properties of a `JsonBodyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.JsonBody` resource.
 */
// @ts-ignore TS6133
function cfnLoggingConfigurationJsonBodyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoggingConfiguration_JsonBodyPropertyValidator(properties).assertSuccess();
    return {
        InvalidFallbackBehavior: cdk.stringToCloudFormation(properties.invalidFallbackBehavior),
        MatchPattern: cfnLoggingConfigurationMatchPatternPropertyToCloudFormation(properties.matchPattern),
        MatchScope: cdk.stringToCloudFormation(properties.matchScope),
    };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationJsonBodyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.JsonBodyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.JsonBodyProperty>();
    ret.addPropertyResult('invalidFallbackBehavior', 'InvalidFallbackBehavior', properties.InvalidFallbackBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.InvalidFallbackBehavior) : undefined);
    ret.addPropertyResult('matchPattern', 'MatchPattern', CfnLoggingConfigurationMatchPatternPropertyFromCloudFormation(properties.MatchPattern));
    ret.addPropertyResult('matchScope', 'MatchScope', cfn_parse.FromCloudFormation.getString(properties.MatchScope));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoggingConfiguration {
    /**
     * A single label name condition for a condition in a logging filter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-labelnamecondition.html
     */
    export interface LabelNameConditionProperty {
        /**
         * The label name that a log record must contain in order to meet the condition. This must be a fully qualified label name. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-labelnamecondition.html#cfn-wafv2-loggingconfiguration-labelnamecondition-labelname
         */
        readonly labelName: string;
    }
}

/**
 * Determine whether the given properties match those of a `LabelNameConditionProperty`
 *
 * @param properties - the TypeScript properties of a `LabelNameConditionProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoggingConfiguration_LabelNameConditionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('labelName', cdk.requiredValidator)(properties.labelName));
    errors.collect(cdk.propertyValidator('labelName', cdk.validateString)(properties.labelName));
    return errors.wrap('supplied properties not correct for "LabelNameConditionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.LabelNameCondition` resource
 *
 * @param properties - the TypeScript properties of a `LabelNameConditionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.LabelNameCondition` resource.
 */
// @ts-ignore TS6133
function cfnLoggingConfigurationLabelNameConditionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoggingConfiguration_LabelNameConditionPropertyValidator(properties).assertSuccess();
    return {
        LabelName: cdk.stringToCloudFormation(properties.labelName),
    };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationLabelNameConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.LabelNameConditionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.LabelNameConditionProperty>();
    ret.addPropertyResult('labelName', 'LabelName', cfn_parse.FromCloudFormation.getString(properties.LabelName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoggingConfiguration {
    /**
     * Filtering that specifies which web requests are kept in the logs and which are dropped, defined for a web ACL's `LoggingConfiguration` .
     *
     * You can filter on the rule action and on the web request labels that were applied by matching rules during web ACL evaluation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-loggingfilter.html
     */
    export interface LoggingFilterProperty {
        /**
         * Default handling for logs that don't match any of the specified filtering conditions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-loggingfilter.html#cfn-wafv2-loggingconfiguration-loggingfilter-defaultbehavior
         */
        readonly defaultBehavior: string;
        /**
         * The filters that you want to apply to the logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-loggingfilter.html#cfn-wafv2-loggingconfiguration-loggingfilter-filters
         */
        readonly filters: Array<CfnLoggingConfiguration.FilterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LoggingFilterProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoggingConfiguration_LoggingFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultBehavior', cdk.requiredValidator)(properties.defaultBehavior));
    errors.collect(cdk.propertyValidator('defaultBehavior', cdk.validateString)(properties.defaultBehavior));
    errors.collect(cdk.propertyValidator('filters', cdk.requiredValidator)(properties.filters));
    errors.collect(cdk.propertyValidator('filters', cdk.listValidator(CfnLoggingConfiguration_FilterPropertyValidator))(properties.filters));
    return errors.wrap('supplied properties not correct for "LoggingFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.LoggingFilter` resource
 *
 * @param properties - the TypeScript properties of a `LoggingFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.LoggingFilter` resource.
 */
// @ts-ignore TS6133
function cfnLoggingConfigurationLoggingFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoggingConfiguration_LoggingFilterPropertyValidator(properties).assertSuccess();
    return {
        DefaultBehavior: cdk.stringToCloudFormation(properties.defaultBehavior),
        Filters: cdk.listMapper(cfnLoggingConfigurationFilterPropertyToCloudFormation)(properties.filters),
    };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationLoggingFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.LoggingFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.LoggingFilterProperty>();
    ret.addPropertyResult('defaultBehavior', 'DefaultBehavior', cfn_parse.FromCloudFormation.getString(properties.DefaultBehavior));
    ret.addPropertyResult('filters', 'Filters', cfn_parse.FromCloudFormation.getArray(CfnLoggingConfigurationFilterPropertyFromCloudFormation)(properties.Filters));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoggingConfiguration {
    /**
     * The patterns to look for in the JSON body. AWS WAF inspects the results of these pattern matches against the rule inspection criteria.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-matchpattern.html
     */
    export interface MatchPatternProperty {
        /**
         * Match all of the elements.
         *
         * You must specify either this setting or the `IncludedPaths` setting, but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-matchpattern.html#cfn-wafv2-loggingconfiguration-matchpattern-all
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-matchpattern.html#cfn-wafv2-loggingconfiguration-matchpattern-includedpaths
         */
        readonly includedPaths?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `MatchPatternProperty`
 *
 * @param properties - the TypeScript properties of a `MatchPatternProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoggingConfiguration_MatchPatternPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('all', cdk.validateObject)(properties.all));
    errors.collect(cdk.propertyValidator('includedPaths', cdk.listValidator(cdk.validateString))(properties.includedPaths));
    return errors.wrap('supplied properties not correct for "MatchPatternProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.MatchPattern` resource
 *
 * @param properties - the TypeScript properties of a `MatchPatternProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.MatchPattern` resource.
 */
// @ts-ignore TS6133
function cfnLoggingConfigurationMatchPatternPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoggingConfiguration_MatchPatternPropertyValidator(properties).assertSuccess();
    return {
        All: cdk.objectToCloudFormation(properties.all),
        IncludedPaths: cdk.listMapper(cdk.stringToCloudFormation)(properties.includedPaths),
    };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationMatchPatternPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.MatchPatternProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.MatchPatternProperty>();
    ret.addPropertyResult('all', 'All', properties.All != null ? cfn_parse.FromCloudFormation.getAny(properties.All) : undefined);
    ret.addPropertyResult('includedPaths', 'IncludedPaths', properties.IncludedPaths != null ? cfn_parse.FromCloudFormation.getStringArray(properties.IncludedPaths) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoggingConfiguration {
    /**
     * Inspect one of the headers in the web request, identified by name, for example, `User-Agent` or `Referer` . The name isn't case sensitive.
     *
     * You can filter and inspect all headers with the `FieldToMatch` setting `Headers` .
     *
     * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
     *
     * Example JSON: `"SingleHeader": { "Name": "haystack" }`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-singleheader.html
     */
    export interface SingleHeaderProperty {
        /**
         * The name of the query header to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-loggingconfiguration-singleheader.html#cfn-wafv2-loggingconfiguration-singleheader-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `SingleHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `SingleHeaderProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoggingConfiguration_SingleHeaderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "SingleHeaderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.SingleHeader` resource
 *
 * @param properties - the TypeScript properties of a `SingleHeaderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::LoggingConfiguration.SingleHeader` resource.
 */
// @ts-ignore TS6133
function cfnLoggingConfigurationSingleHeaderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoggingConfiguration_SingleHeaderPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationSingleHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.SingleHeaderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.SingleHeaderProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnRegexPatternSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html
 */
export interface CfnRegexPatternSetProps {

    /**
     * The regular expression patterns in the set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html#cfn-wafv2-regexpatternset-regularexpressionlist
     */
    readonly regularExpressionList: string[];

    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AWS AppSync GraphQL API, or an Amazon Cognito user pool. Valid Values are `CLOUDFRONT` and `REGIONAL` .
     *
     * > For `CLOUDFRONT` , you must create your WAFv2 resources in the US East (N. Virginia) Region, `us-east-1` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html#cfn-wafv2-regexpatternset-scope
     */
    readonly scope: string;

    /**
     * A description of the set that helps with identification.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html#cfn-wafv2-regexpatternset-description
     */
    readonly description?: string;

    /**
     * The name of the set. You cannot change the name after you create the set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html#cfn-wafv2-regexpatternset-name
     */
    readonly name?: string;

    /**
     * Key:value pairs associated with an AWS resource. The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
     *
     * > To modify tags on existing resources, use the AWS WAF APIs or command line interface. With AWS CloudFormation , you can only add tags to AWS WAF resources during resource creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html#cfn-wafv2-regexpatternset-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnRegexPatternSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnRegexPatternSetProps`
 *
 * @returns the result of the validation.
 */
function CfnRegexPatternSetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('regularExpressionList', cdk.requiredValidator)(properties.regularExpressionList));
    errors.collect(cdk.propertyValidator('regularExpressionList', cdk.listValidator(cdk.validateString))(properties.regularExpressionList));
    errors.collect(cdk.propertyValidator('scope', cdk.requiredValidator)(properties.scope));
    errors.collect(cdk.propertyValidator('scope', cdk.validateString)(properties.scope));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnRegexPatternSetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RegexPatternSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnRegexPatternSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RegexPatternSet` resource.
 */
// @ts-ignore TS6133
function cfnRegexPatternSetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRegexPatternSetPropsValidator(properties).assertSuccess();
    return {
        RegularExpressionList: cdk.listMapper(cdk.stringToCloudFormation)(properties.regularExpressionList),
        Scope: cdk.stringToCloudFormation(properties.scope),
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnRegexPatternSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRegexPatternSetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRegexPatternSetProps>();
    ret.addPropertyResult('regularExpressionList', 'RegularExpressionList', cfn_parse.FromCloudFormation.getStringArray(properties.RegularExpressionList));
    ret.addPropertyResult('scope', 'Scope', cfn_parse.FromCloudFormation.getString(properties.Scope));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFv2::RegexPatternSet`
 *
 * > This is the latest version of *AWS WAF* , named AWS WAF V2, released in November, 2019. For information, including how to migrate your AWS WAF resources from the prior release, see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
 *
 * Use an `RegexPatternSet` to have AWS WAF inspect a web request component for a specific set of regular expression patterns.
 *
 * You use a regex pattern set by providing its Amazon Resource Name (ARN) to the rule statement `RegexPatternSetReferenceStatement` , when you add a rule to a rule group or web ACL.
 *
 * @cloudformationResource AWS::WAFv2::RegexPatternSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html
 */
export class CfnRegexPatternSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFv2::RegexPatternSet";

    /**
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
        const ret = new CfnRegexPatternSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the regex pattern set.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the regex pattern set.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The regular expression patterns in the set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html#cfn-wafv2-regexpatternset-regularexpressionlist
     */
    public regularExpressionList: string[];

    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AWS AppSync GraphQL API, or an Amazon Cognito user pool. Valid Values are `CLOUDFRONT` and `REGIONAL` .
     *
     * > For `CLOUDFRONT` , you must create your WAFv2 resources in the US East (N. Virginia) Region, `us-east-1` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html#cfn-wafv2-regexpatternset-scope
     */
    public scope: string;

    /**
     * A description of the set that helps with identification.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html#cfn-wafv2-regexpatternset-description
     */
    public description: string | undefined;

    /**
     * The name of the set. You cannot change the name after you create the set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html#cfn-wafv2-regexpatternset-name
     */
    public name: string | undefined;

    /**
     * Key:value pairs associated with an AWS resource. The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
     *
     * > To modify tags on existing resources, use the AWS WAF APIs or command line interface. With AWS CloudFormation , you can only add tags to AWS WAF resources during resource creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-regexpatternset.html#cfn-wafv2-regexpatternset-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::WAFv2::RegexPatternSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRegexPatternSetProps) {
        super(scope, id, { type: CfnRegexPatternSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'regularExpressionList', this);
        cdk.requireProperty(props, 'scope', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.regularExpressionList = props.regularExpressionList;
        this.scope = props.scope;
        this.description = props.description;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::WAFv2::RegexPatternSet", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRegexPatternSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            regularExpressionList: this.regularExpressionList,
            scope: this.scope,
            description: this.description,
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRegexPatternSetPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnRuleGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html
 */
export interface CfnRuleGroupProps {

    /**
     * The web ACL capacity units (WCUs) required for this rule group.
     *
     * When you create your own rule group, you define this, and you cannot change it after creation. When you add or modify the rules in a rule group, AWS WAF enforces this limit.
     *
     * AWS WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. AWS WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. The WCU limit for web ACLs is 1,500.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-capacity
     */
    readonly capacity: number;

    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AWS AppSync GraphQL API, or an Amazon Cognito user pool. Valid Values are `CLOUDFRONT` and `REGIONAL` .
     *
     * > For `CLOUDFRONT` , you must create your WAFv2 resources in the US East (N. Virginia) Region, `us-east-1` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-scope
     */
    readonly scope: string;

    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-visibilityconfig
     */
    readonly visibilityConfig: CfnRuleGroup.VisibilityConfigProperty | cdk.IResolvable;

    /**
     * The labels that one or more rules in this rule group add to matching web requests. These labels are defined in the `RuleLabels` for a `Rule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-availablelabels
     */
    readonly availableLabels?: Array<CfnRuleGroup.LabelSummaryProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The labels that one or more rules in this rule group match against in label match statements. These labels are defined in a `LabelMatchStatement` specification, in the `Statement` definition of a rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-consumedlabels
     */
    readonly consumedLabels?: Array<CfnRuleGroup.LabelSummaryProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A map of custom response keys and content bodies. When you create a rule with a block action, you can send a custom response to the web request. You define these for the rule group, and then use them in the rules that you define in the rule group.
     *
     * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
     *
     * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-customresponsebodies
     */
    readonly customResponseBodies?: { [key: string]: (CfnRuleGroup.CustomResponseBodyProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * A description of the rule group that helps with identification.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-description
     */
    readonly description?: string;

    /**
     * The name of the rule group. You cannot change the name of a rule group after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-name
     */
    readonly name?: string;

    /**
     * The rule statements used to identify the web requests that you want to allow, block, or count. Each rule includes one top-level statement that AWS WAF uses to identify matching web requests, and parameters that govern how AWS WAF handles them.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-rules
     */
    readonly rules?: Array<CfnRuleGroup.RuleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Key:value pairs associated with an AWS resource. The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
     *
     * > To modify tags on existing resources, use the AWS WAF APIs or command line interface. With AWS CloudFormation , you can only add tags to AWS WAF resources during resource creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnRuleGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnRuleGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availableLabels', cdk.listValidator(CfnRuleGroup_LabelSummaryPropertyValidator))(properties.availableLabels));
    errors.collect(cdk.propertyValidator('capacity', cdk.requiredValidator)(properties.capacity));
    errors.collect(cdk.propertyValidator('capacity', cdk.validateNumber)(properties.capacity));
    errors.collect(cdk.propertyValidator('consumedLabels', cdk.listValidator(CfnRuleGroup_LabelSummaryPropertyValidator))(properties.consumedLabels));
    errors.collect(cdk.propertyValidator('customResponseBodies', cdk.hashValidator(CfnRuleGroup_CustomResponseBodyPropertyValidator))(properties.customResponseBodies));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('rules', cdk.listValidator(CfnRuleGroup_RulePropertyValidator))(properties.rules));
    errors.collect(cdk.propertyValidator('scope', cdk.requiredValidator)(properties.scope));
    errors.collect(cdk.propertyValidator('scope', cdk.validateString)(properties.scope));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('visibilityConfig', cdk.requiredValidator)(properties.visibilityConfig));
    errors.collect(cdk.propertyValidator('visibilityConfig', CfnRuleGroup_VisibilityConfigPropertyValidator)(properties.visibilityConfig));
    return errors.wrap('supplied properties not correct for "CfnRuleGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnRuleGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroupPropsValidator(properties).assertSuccess();
    return {
        Capacity: cdk.numberToCloudFormation(properties.capacity),
        Scope: cdk.stringToCloudFormation(properties.scope),
        VisibilityConfig: cfnRuleGroupVisibilityConfigPropertyToCloudFormation(properties.visibilityConfig),
        AvailableLabels: cdk.listMapper(cfnRuleGroupLabelSummaryPropertyToCloudFormation)(properties.availableLabels),
        ConsumedLabels: cdk.listMapper(cfnRuleGroupLabelSummaryPropertyToCloudFormation)(properties.consumedLabels),
        CustomResponseBodies: cdk.hashMapper(cfnRuleGroupCustomResponseBodyPropertyToCloudFormation)(properties.customResponseBodies),
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        Rules: cdk.listMapper(cfnRuleGroupRulePropertyToCloudFormation)(properties.rules),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroupProps>();
    ret.addPropertyResult('capacity', 'Capacity', cfn_parse.FromCloudFormation.getNumber(properties.Capacity));
    ret.addPropertyResult('scope', 'Scope', cfn_parse.FromCloudFormation.getString(properties.Scope));
    ret.addPropertyResult('visibilityConfig', 'VisibilityConfig', CfnRuleGroupVisibilityConfigPropertyFromCloudFormation(properties.VisibilityConfig));
    ret.addPropertyResult('availableLabels', 'AvailableLabels', properties.AvailableLabels != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupLabelSummaryPropertyFromCloudFormation)(properties.AvailableLabels) : undefined);
    ret.addPropertyResult('consumedLabels', 'ConsumedLabels', properties.ConsumedLabels != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupLabelSummaryPropertyFromCloudFormation)(properties.ConsumedLabels) : undefined);
    ret.addPropertyResult('customResponseBodies', 'CustomResponseBodies', properties.CustomResponseBodies != null ? cfn_parse.FromCloudFormation.getMap(CfnRuleGroupCustomResponseBodyPropertyFromCloudFormation)(properties.CustomResponseBodies) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('rules', 'Rules', properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupRulePropertyFromCloudFormation)(properties.Rules) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFv2::RuleGroup`
 *
 * > This is the latest version of *AWS WAF* , named AWS WAF V2, released in November, 2019. For information, including how to migrate your AWS WAF resources from the prior release, see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
 *
 * Use an `RuleGroup` to define a collection of rules for inspecting and controlling web requests. You use a rule group in an `WebACL` by providing its Amazon Resource Name (ARN) to the rule statement `RuleGroupReferenceStatement` , when you add rules to the web ACL.
 *
 * When you create a rule group, you define an immutable capacity limit. If you update a rule group, you must stay within the capacity. This allows others to reuse the rule group with confidence in its capacity requirements.
 *
 * @cloudformationResource AWS::WAFv2::RuleGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html
 */
export class CfnRuleGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFv2::RuleGroup";

    /**
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
        const ret = new CfnRuleGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the rule group.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the rule group.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The label namespace prefix for this rule group. All labels added by rules in this rule group have this prefix.
     *
     * The syntax for the label namespace prefix for a rule group is the following: `awswaf:<account ID>:rule group:<rule group name>:`
     *
     * When a rule with a label matches a web request, AWS WAF adds the fully qualified label to the request. A fully qualified label is made up of the label namespace from the rule group or web ACL where the rule is defined and the label from the rule, separated by a colon.
     * @cloudformationAttribute LabelNamespace
     */
    public readonly attrLabelNamespace: string;

    /**
     * The web ACL capacity units (WCUs) required for this rule group.
     *
     * When you create your own rule group, you define this, and you cannot change it after creation. When you add or modify the rules in a rule group, AWS WAF enforces this limit.
     *
     * AWS WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. AWS WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. The WCU limit for web ACLs is 1,500.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-capacity
     */
    public capacity: number;

    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AWS AppSync GraphQL API, or an Amazon Cognito user pool. Valid Values are `CLOUDFRONT` and `REGIONAL` .
     *
     * > For `CLOUDFRONT` , you must create your WAFv2 resources in the US East (N. Virginia) Region, `us-east-1` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-scope
     */
    public scope: string;

    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-visibilityconfig
     */
    public visibilityConfig: CfnRuleGroup.VisibilityConfigProperty | cdk.IResolvable;

    /**
     * The labels that one or more rules in this rule group add to matching web requests. These labels are defined in the `RuleLabels` for a `Rule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-availablelabels
     */
    public availableLabels: Array<CfnRuleGroup.LabelSummaryProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The labels that one or more rules in this rule group match against in label match statements. These labels are defined in a `LabelMatchStatement` specification, in the `Statement` definition of a rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-consumedlabels
     */
    public consumedLabels: Array<CfnRuleGroup.LabelSummaryProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A map of custom response keys and content bodies. When you create a rule with a block action, you can send a custom response to the web request. You define these for the rule group, and then use them in the rules that you define in the rule group.
     *
     * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
     *
     * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-customresponsebodies
     */
    public customResponseBodies: { [key: string]: (CfnRuleGroup.CustomResponseBodyProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * A description of the rule group that helps with identification.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-description
     */
    public description: string | undefined;

    /**
     * The name of the rule group. You cannot change the name of a rule group after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-name
     */
    public name: string | undefined;

    /**
     * The rule statements used to identify the web requests that you want to allow, block, or count. Each rule includes one top-level statement that AWS WAF uses to identify matching web requests, and parameters that govern how AWS WAF handles them.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-rules
     */
    public rules: Array<CfnRuleGroup.RuleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Key:value pairs associated with an AWS resource. The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
     *
     * > To modify tags on existing resources, use the AWS WAF APIs or command line interface. With AWS CloudFormation , you can only add tags to AWS WAF resources during resource creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-rulegroup.html#cfn-wafv2-rulegroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::WAFv2::RuleGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRuleGroupProps) {
        super(scope, id, { type: CfnRuleGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'capacity', this);
        cdk.requireProperty(props, 'scope', this);
        cdk.requireProperty(props, 'visibilityConfig', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrLabelNamespace = cdk.Token.asString(this.getAtt('LabelNamespace', cdk.ResolutionTypeHint.STRING));

        this.capacity = props.capacity;
        this.scope = props.scope;
        this.visibilityConfig = props.visibilityConfig;
        this.availableLabels = props.availableLabels;
        this.consumedLabels = props.consumedLabels;
        this.customResponseBodies = props.customResponseBodies;
        this.description = props.description;
        this.name = props.name;
        this.rules = props.rules;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::WAFv2::RuleGroup", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRuleGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            capacity: this.capacity,
            scope: this.scope,
            visibilityConfig: this.visibilityConfig,
            availableLabels: this.availableLabels,
            consumedLabels: this.consumedLabels,
            customResponseBodies: this.customResponseBodies,
            description: this.description,
            name: this.name,
            rules: this.rules,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRuleGroupPropsToCloudFormation(props);
    }
}

export namespace CfnRuleGroup {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-allow.html
     */
    export interface AllowProperty {
        /**
         * `CfnRuleGroup.AllowProperty.CustomRequestHandling`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-allow.html#cfn-wafv2-rulegroup-allow-customrequesthandling
         */
        readonly customRequestHandling?: CfnRuleGroup.CustomRequestHandlingProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AllowProperty`
 *
 * @param properties - the TypeScript properties of a `AllowProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_AllowPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customRequestHandling', CfnRuleGroup_CustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
    return errors.wrap('supplied properties not correct for "AllowProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Allow` resource
 *
 * @param properties - the TypeScript properties of a `AllowProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Allow` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupAllowPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_AllowPropertyValidator(properties).assertSuccess();
    return {
        CustomRequestHandling: cfnRuleGroupCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupAllowPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.AllowProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.AllowProperty>();
    ret.addPropertyResult('customRequestHandling', 'CustomRequestHandling', properties.CustomRequestHandling != null ? CfnRuleGroupCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A logical rule statement used to combine other rule statements with AND logic. You provide more than one `Statement` within the `AndStatement` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-andstatement.html
     */
    export interface AndStatementProperty {
        /**
         * The statements to combine with AND logic. You can use any statements that can be nested.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-andstatement.html#cfn-wafv2-rulegroup-andstatement-statements
         */
        readonly statements: Array<CfnRuleGroup.StatementProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AndStatementProperty`
 *
 * @param properties - the TypeScript properties of a `AndStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_AndStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('statements', cdk.requiredValidator)(properties.statements));
    errors.collect(cdk.propertyValidator('statements', cdk.listValidator(CfnRuleGroup_StatementPropertyValidator))(properties.statements));
    return errors.wrap('supplied properties not correct for "AndStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.AndStatement` resource
 *
 * @param properties - the TypeScript properties of a `AndStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.AndStatement` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupAndStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_AndStatementPropertyValidator(properties).assertSuccess();
    return {
        Statements: cdk.listMapper(cfnRuleGroupStatementPropertyToCloudFormation)(properties.statements),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupAndStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.AndStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.AndStatementProperty>();
    ret.addPropertyResult('statements', 'Statements', cfn_parse.FromCloudFormation.getArray(CfnRuleGroupStatementPropertyFromCloudFormation)(properties.Statements));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-block.html
     */
    export interface BlockProperty {
        /**
         * `CfnRuleGroup.BlockProperty.CustomResponse`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-block.html#cfn-wafv2-rulegroup-block-customresponse
         */
        readonly customResponse?: CfnRuleGroup.CustomResponseProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `BlockProperty`
 *
 * @param properties - the TypeScript properties of a `BlockProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_BlockPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customResponse', CfnRuleGroup_CustomResponsePropertyValidator)(properties.customResponse));
    return errors.wrap('supplied properties not correct for "BlockProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Block` resource
 *
 * @param properties - the TypeScript properties of a `BlockProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Block` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupBlockPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_BlockPropertyValidator(properties).assertSuccess();
    return {
        CustomResponse: cfnRuleGroupCustomResponsePropertyToCloudFormation(properties.customResponse),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupBlockPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.BlockProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.BlockProperty>();
    ret.addPropertyResult('customResponse', 'CustomResponse', properties.CustomResponse != null ? CfnRuleGroupCustomResponsePropertyFromCloudFormation(properties.CustomResponse) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Inspect the body of the web request. The body immediately follows the request headers.
     *
     * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-body.html
     */
    export interface BodyProperty {
        /**
         * What AWS WAF should do if the body is larger than AWS WAF can inspect. AWS WAF does not support inspecting the entire contents of the body of a web request when the body exceeds 8 KB (8192 bytes). Only the first 8 KB of the request body are forwarded to AWS WAF by the underlying host service.
         *
         * The options for oversize handling are the following:
         *
         * - `CONTINUE` - Inspect the body normally, according to the rule inspection criteria.
         * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
         * - `NO_MATCH` - Treat the web request as not matching the rule statement.
         *
         * You can combine the `MATCH` or `NO_MATCH` settings for oversize handling with your rule and web ACL action settings, so that you block any request whose body is over 8 KB.
         *
         * Default: `CONTINUE`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-body.html#cfn-wafv2-rulegroup-body-oversizehandling
         */
        readonly oversizeHandling?: string;
    }
}

/**
 * Determine whether the given properties match those of a `BodyProperty`
 *
 * @param properties - the TypeScript properties of a `BodyProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_BodyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('oversizeHandling', cdk.validateString)(properties.oversizeHandling));
    return errors.wrap('supplied properties not correct for "BodyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Body` resource
 *
 * @param properties - the TypeScript properties of a `BodyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Body` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupBodyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_BodyPropertyValidator(properties).assertSuccess();
    return {
        OversizeHandling: cdk.stringToCloudFormation(properties.oversizeHandling),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupBodyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.BodyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.BodyProperty>();
    ret.addPropertyResult('oversizeHandling', 'OversizeHandling', properties.OversizeHandling != null ? cfn_parse.FromCloudFormation.getString(properties.OversizeHandling) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A rule statement that defines a string match search for AWS WAF to apply to web requests. The byte match statement provides the bytes to search for, the location in requests that you want AWS WAF to search, and other settings. The bytes to search for are typically a string that corresponds with ASCII characters. In the AWS WAF console and the developer guide, this is called a string match statement.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-bytematchstatement.html
     */
    export interface ByteMatchStatementProperty {
        /**
         * The part of the web request that you want AWS WAF to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-bytematchstatement.html#cfn-wafv2-rulegroup-bytematchstatement-fieldtomatch
         */
        readonly fieldToMatch: CfnRuleGroup.FieldToMatchProperty | cdk.IResolvable;
        /**
         * The area within the portion of the web request that you want AWS WAF to search for `SearchString` . Valid values include the following:
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-bytematchstatement.html#cfn-wafv2-rulegroup-bytematchstatement-positionalconstraint
         */
        readonly positionalConstraint: string;
        /**
         * A string value that you want AWS WAF to search for. AWS WAF searches only in the part of web requests that you designate for inspection in `FieldToMatch` . The maximum length of the value is 200 bytes. For alphabetic characters A-Z and a-z, the value is case sensitive.
         *
         * Don't encode this string. Provide the value that you want AWS WAF to search for. AWS CloudFormation automatically base64 encodes the value for you.
         *
         * For example, suppose the value of `Type` is `HEADER` and the value of `Data` is `User-Agent` . If you want to search the `User-Agent` header for the value `BadBot` , you provide the string `BadBot` in the value of `SearchString` .
         *
         * You must specify either `SearchString` or `SearchStringBase64` in a `ByteMatchStatement` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-bytematchstatement.html#cfn-wafv2-rulegroup-bytematchstatement-searchstring
         */
        readonly searchString?: string;
        /**
         * String to search for in a web request component, base64-encoded. If you don't want to encode the string, specify the unencoded value in `SearchString` instead.
         *
         * You must specify either `SearchString` or `SearchStringBase64` in a `ByteMatchStatement` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-bytematchstatement.html#cfn-wafv2-rulegroup-bytematchstatement-searchstringbase64
         */
        readonly searchStringBase64?: string;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-bytematchstatement.html#cfn-wafv2-rulegroup-bytematchstatement-texttransformations
         */
        readonly textTransformations: Array<CfnRuleGroup.TextTransformationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ByteMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `ByteMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_ByteMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnRuleGroup_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('positionalConstraint', cdk.requiredValidator)(properties.positionalConstraint));
    errors.collect(cdk.propertyValidator('positionalConstraint', cdk.validateString)(properties.positionalConstraint));
    errors.collect(cdk.propertyValidator('searchString', cdk.validateString)(properties.searchString));
    errors.collect(cdk.propertyValidator('searchStringBase64', cdk.validateString)(properties.searchStringBase64));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.requiredValidator)(properties.textTransformations));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.listValidator(CfnRuleGroup_TextTransformationPropertyValidator))(properties.textTransformations));
    return errors.wrap('supplied properties not correct for "ByteMatchStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.ByteMatchStatement` resource
 *
 * @param properties - the TypeScript properties of a `ByteMatchStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.ByteMatchStatement` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupByteMatchStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_ByteMatchStatementPropertyValidator(properties).assertSuccess();
    return {
        FieldToMatch: cfnRuleGroupFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        PositionalConstraint: cdk.stringToCloudFormation(properties.positionalConstraint),
        SearchString: cdk.stringToCloudFormation(properties.searchString),
        SearchStringBase64: cdk.stringToCloudFormation(properties.searchStringBase64),
        TextTransformations: cdk.listMapper(cfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupByteMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.ByteMatchStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.ByteMatchStatementProperty>();
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnRuleGroupFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('positionalConstraint', 'PositionalConstraint', cfn_parse.FromCloudFormation.getString(properties.PositionalConstraint));
    ret.addPropertyResult('searchString', 'SearchString', properties.SearchString != null ? cfn_parse.FromCloudFormation.getString(properties.SearchString) : undefined);
    ret.addPropertyResult('searchStringBase64', 'SearchStringBase64', properties.SearchStringBase64 != null ? cfn_parse.FromCloudFormation.getString(properties.SearchStringBase64) : undefined);
    ret.addPropertyResult('textTransformations', 'TextTransformations', cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-captcha.html
     */
    export interface CaptchaProperty {
        /**
         * `CfnRuleGroup.CaptchaProperty.CustomRequestHandling`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-captcha.html#cfn-wafv2-rulegroup-captcha-customrequesthandling
         */
        readonly customRequestHandling?: CfnRuleGroup.CustomRequestHandlingProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CaptchaProperty`
 *
 * @param properties - the TypeScript properties of a `CaptchaProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_CaptchaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customRequestHandling', CfnRuleGroup_CustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
    return errors.wrap('supplied properties not correct for "CaptchaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Captcha` resource
 *
 * @param properties - the TypeScript properties of a `CaptchaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Captcha` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupCaptchaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_CaptchaPropertyValidator(properties).assertSuccess();
    return {
        CustomRequestHandling: cfnRuleGroupCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupCaptchaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CaptchaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CaptchaProperty>();
    ret.addPropertyResult('customRequestHandling', 'CustomRequestHandling', properties.CustomRequestHandling != null ? CfnRuleGroupCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Specifies how AWS WAF should handle `CAPTCHA` evaluations. This is available at the web ACL level and in each rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-captchaconfig.html
     */
    export interface CaptchaConfigProperty {
        /**
         * Determines how long a `CAPTCHA` timestamp in the token remains valid after the client successfully solves a `CAPTCHA` puzzle.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-captchaconfig.html#cfn-wafv2-rulegroup-captchaconfig-immunitytimeproperty
         */
        readonly immunityTimeProperty?: CfnRuleGroup.ImmunityTimePropertyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CaptchaConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CaptchaConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_CaptchaConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('immunityTimeProperty', CfnRuleGroup_ImmunityTimePropertyPropertyValidator)(properties.immunityTimeProperty));
    return errors.wrap('supplied properties not correct for "CaptchaConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.CaptchaConfig` resource
 *
 * @param properties - the TypeScript properties of a `CaptchaConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.CaptchaConfig` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupCaptchaConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_CaptchaConfigPropertyValidator(properties).assertSuccess();
    return {
        ImmunityTimeProperty: cfnRuleGroupImmunityTimePropertyPropertyToCloudFormation(properties.immunityTimeProperty),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupCaptchaConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CaptchaConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CaptchaConfigProperty>();
    ret.addPropertyResult('immunityTimeProperty', 'ImmunityTimeProperty', properties.ImmunityTimeProperty != null ? CfnRuleGroupImmunityTimePropertyPropertyFromCloudFormation(properties.ImmunityTimeProperty) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-challenge.html
     */
    export interface ChallengeProperty {
        /**
         * `CfnRuleGroup.ChallengeProperty.CustomRequestHandling`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-challenge.html#cfn-wafv2-rulegroup-challenge-customrequesthandling
         */
        readonly customRequestHandling?: CfnRuleGroup.CustomRequestHandlingProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ChallengeProperty`
 *
 * @param properties - the TypeScript properties of a `ChallengeProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_ChallengePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customRequestHandling', CfnRuleGroup_CustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
    return errors.wrap('supplied properties not correct for "ChallengeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Challenge` resource
 *
 * @param properties - the TypeScript properties of a `ChallengeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Challenge` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupChallengePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_ChallengePropertyValidator(properties).assertSuccess();
    return {
        CustomRequestHandling: cfnRuleGroupCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupChallengePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.ChallengeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.ChallengeProperty>();
    ret.addPropertyResult('customRequestHandling', 'CustomRequestHandling', properties.CustomRequestHandling != null ? CfnRuleGroupCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Specifies how AWS WAF should handle `Challenge` evaluations. This is available at the web ACL level and in each rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-challengeconfig.html
     */
    export interface ChallengeConfigProperty {
        /**
         * Determines how long a challenge timestamp in the token remains valid after the client successfully responds to a challenge.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-challengeconfig.html#cfn-wafv2-rulegroup-challengeconfig-immunitytimeproperty
         */
        readonly immunityTimeProperty?: CfnRuleGroup.ImmunityTimePropertyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ChallengeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ChallengeConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_ChallengeConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('immunityTimeProperty', CfnRuleGroup_ImmunityTimePropertyPropertyValidator)(properties.immunityTimeProperty));
    return errors.wrap('supplied properties not correct for "ChallengeConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.ChallengeConfig` resource
 *
 * @param properties - the TypeScript properties of a `ChallengeConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.ChallengeConfig` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupChallengeConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_ChallengeConfigPropertyValidator(properties).assertSuccess();
    return {
        ImmunityTimeProperty: cfnRuleGroupImmunityTimePropertyPropertyToCloudFormation(properties.immunityTimeProperty),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupChallengeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.ChallengeConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.ChallengeConfigProperty>();
    ret.addPropertyResult('immunityTimeProperty', 'ImmunityTimeProperty', properties.ImmunityTimeProperty != null ? CfnRuleGroupImmunityTimePropertyPropertyFromCloudFormation(properties.ImmunityTimeProperty) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * The filter to use to identify the subset of cookies to inspect in a web request.
     *
     * You must specify exactly one setting: either `All` , `IncludedCookies` , or `ExcludedCookies` .
     *
     * Example JSON: `"MatchPattern": { "IncludedCookies": {"KeyToInclude1", "KeyToInclude2", "KeyToInclude3"} }`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookiematchpattern.html
     */
    export interface CookieMatchPatternProperty {
        /**
         * Inspect all cookies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookiematchpattern.html#cfn-wafv2-rulegroup-cookiematchpattern-all
         */
        readonly all?: any | cdk.IResolvable;
        /**
         * Inspect only the cookies whose keys don't match any of the strings specified here.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookiematchpattern.html#cfn-wafv2-rulegroup-cookiematchpattern-excludedcookies
         */
        readonly excludedCookies?: string[];
        /**
         * Inspect only the cookies that have a key that matches one of the strings specified here.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookiematchpattern.html#cfn-wafv2-rulegroup-cookiematchpattern-includedcookies
         */
        readonly includedCookies?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `CookieMatchPatternProperty`
 *
 * @param properties - the TypeScript properties of a `CookieMatchPatternProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_CookieMatchPatternPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('all', cdk.validateObject)(properties.all));
    errors.collect(cdk.propertyValidator('excludedCookies', cdk.listValidator(cdk.validateString))(properties.excludedCookies));
    errors.collect(cdk.propertyValidator('includedCookies', cdk.listValidator(cdk.validateString))(properties.includedCookies));
    return errors.wrap('supplied properties not correct for "CookieMatchPatternProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.CookieMatchPattern` resource
 *
 * @param properties - the TypeScript properties of a `CookieMatchPatternProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.CookieMatchPattern` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupCookieMatchPatternPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_CookieMatchPatternPropertyValidator(properties).assertSuccess();
    return {
        All: cdk.objectToCloudFormation(properties.all),
        ExcludedCookies: cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedCookies),
        IncludedCookies: cdk.listMapper(cdk.stringToCloudFormation)(properties.includedCookies),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupCookieMatchPatternPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CookieMatchPatternProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CookieMatchPatternProperty>();
    ret.addPropertyResult('all', 'All', properties.All != null ? cfn_parse.FromCloudFormation.getAny(properties.All) : undefined);
    ret.addPropertyResult('excludedCookies', 'ExcludedCookies', properties.ExcludedCookies != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExcludedCookies) : undefined);
    ret.addPropertyResult('includedCookies', 'IncludedCookies', properties.IncludedCookies != null ? cfn_parse.FromCloudFormation.getStringArray(properties.IncludedCookies) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Inspect the cookies in the web request. You can specify the parts of the cookies to inspect and you can narrow the set of cookies to inspect by including or excluding specific keys.
     *
     * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
     *
     * Example JSON: `"Cookies": { "MatchPattern": { "All": {} }, "MatchScope": "KEY", "OversizeHandling": "MATCH" }`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookies.html
     */
    export interface CookiesProperty {
        /**
         * The filter to use to identify the subset of cookies to inspect in a web request.
         *
         * You must specify exactly one setting: either `All` , `IncludedCookies` , or `ExcludedCookies` .
         *
         * Example JSON: `"MatchPattern": { "IncludedCookies": {"KeyToInclude1", "KeyToInclude2", "KeyToInclude3"} }`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookies.html#cfn-wafv2-rulegroup-cookies-matchpattern
         */
        readonly matchPattern: CfnRuleGroup.CookieMatchPatternProperty | cdk.IResolvable;
        /**
         * The parts of the cookies to inspect with the rule inspection criteria. If you specify `All` , AWS WAF inspects both keys and values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookies.html#cfn-wafv2-rulegroup-cookies-matchscope
         */
        readonly matchScope: string;
        /**
         * What AWS WAF should do if the cookies of the request are larger than AWS WAF can inspect. AWS WAF does not support inspecting the entire contents of request cookies when they exceed 8 KB (8192 bytes) or 200 total cookies. The underlying host service forwards a maximum of 200 cookies and at most 8 KB of cookie contents to AWS WAF .
         *
         * The options for oversize handling are the following:
         *
         * - `CONTINUE` - Inspect the cookies normally, according to the rule inspection criteria.
         * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
         * - `NO_MATCH` - Treat the web request as not matching the rule statement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-cookies.html#cfn-wafv2-rulegroup-cookies-oversizehandling
         */
        readonly oversizeHandling: string;
    }
}

/**
 * Determine whether the given properties match those of a `CookiesProperty`
 *
 * @param properties - the TypeScript properties of a `CookiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_CookiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('matchPattern', cdk.requiredValidator)(properties.matchPattern));
    errors.collect(cdk.propertyValidator('matchPattern', CfnRuleGroup_CookieMatchPatternPropertyValidator)(properties.matchPattern));
    errors.collect(cdk.propertyValidator('matchScope', cdk.requiredValidator)(properties.matchScope));
    errors.collect(cdk.propertyValidator('matchScope', cdk.validateString)(properties.matchScope));
    errors.collect(cdk.propertyValidator('oversizeHandling', cdk.requiredValidator)(properties.oversizeHandling));
    errors.collect(cdk.propertyValidator('oversizeHandling', cdk.validateString)(properties.oversizeHandling));
    return errors.wrap('supplied properties not correct for "CookiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Cookies` resource
 *
 * @param properties - the TypeScript properties of a `CookiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Cookies` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupCookiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_CookiesPropertyValidator(properties).assertSuccess();
    return {
        MatchPattern: cfnRuleGroupCookieMatchPatternPropertyToCloudFormation(properties.matchPattern),
        MatchScope: cdk.stringToCloudFormation(properties.matchScope),
        OversizeHandling: cdk.stringToCloudFormation(properties.oversizeHandling),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupCookiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CookiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CookiesProperty>();
    ret.addPropertyResult('matchPattern', 'MatchPattern', CfnRuleGroupCookieMatchPatternPropertyFromCloudFormation(properties.MatchPattern));
    ret.addPropertyResult('matchScope', 'MatchScope', cfn_parse.FromCloudFormation.getString(properties.MatchScope));
    ret.addPropertyResult('oversizeHandling', 'OversizeHandling', cfn_parse.FromCloudFormation.getString(properties.OversizeHandling));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-count.html
     */
    export interface CountProperty {
        /**
         * `CfnRuleGroup.CountProperty.CustomRequestHandling`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-count.html#cfn-wafv2-rulegroup-count-customrequesthandling
         */
        readonly customRequestHandling?: CfnRuleGroup.CustomRequestHandlingProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CountProperty`
 *
 * @param properties - the TypeScript properties of a `CountProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_CountPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customRequestHandling', CfnRuleGroup_CustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
    return errors.wrap('supplied properties not correct for "CountProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Count` resource
 *
 * @param properties - the TypeScript properties of a `CountProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Count` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupCountPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_CountPropertyValidator(properties).assertSuccess();
    return {
        CustomRequestHandling: cfnRuleGroupCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupCountPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CountProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CountProperty>();
    ret.addPropertyResult('customRequestHandling', 'CustomRequestHandling', properties.CustomRequestHandling != null ? CfnRuleGroupCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A custom header for custom request and response handling. This is used in `CustomResponse` and `CustomRequestHandling`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customhttpheader.html
     */
    export interface CustomHTTPHeaderProperty {
        /**
         * The name of the custom header.
         *
         * For custom request header insertion, when AWS WAF inserts the header into the request, it prefixes this name `x-amzn-waf-` , to avoid confusion with the headers that are already in the request. For example, for the header name `sample` , AWS WAF inserts the header `x-amzn-waf-sample` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customhttpheader.html#cfn-wafv2-rulegroup-customhttpheader-name
         */
        readonly name: string;
        /**
         * The value of the custom header.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customhttpheader.html#cfn-wafv2-rulegroup-customhttpheader-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomHTTPHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `CustomHTTPHeaderProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_CustomHTTPHeaderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "CustomHTTPHeaderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.CustomHTTPHeader` resource
 *
 * @param properties - the TypeScript properties of a `CustomHTTPHeaderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.CustomHTTPHeader` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupCustomHTTPHeaderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_CustomHTTPHeaderPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupCustomHTTPHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CustomHTTPHeaderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CustomHTTPHeaderProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Custom request handling behavior that inserts custom headers into a web request. You can add custom request handling for AWS WAF to use when the rule action doesn't block the request. For example, `CaptchaAction` for requests with valid t okens, and `AllowAction` .
     *
     * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customrequesthandling.html
     */
    export interface CustomRequestHandlingProperty {
        /**
         * The HTTP headers to insert into the request. Duplicate header names are not allowed.
         *
         * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customrequesthandling.html#cfn-wafv2-rulegroup-customrequesthandling-insertheaders
         */
        readonly insertHeaders: Array<CfnRuleGroup.CustomHTTPHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CustomRequestHandlingProperty`
 *
 * @param properties - the TypeScript properties of a `CustomRequestHandlingProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_CustomRequestHandlingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('insertHeaders', cdk.requiredValidator)(properties.insertHeaders));
    errors.collect(cdk.propertyValidator('insertHeaders', cdk.listValidator(CfnRuleGroup_CustomHTTPHeaderPropertyValidator))(properties.insertHeaders));
    return errors.wrap('supplied properties not correct for "CustomRequestHandlingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.CustomRequestHandling` resource
 *
 * @param properties - the TypeScript properties of a `CustomRequestHandlingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.CustomRequestHandling` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupCustomRequestHandlingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_CustomRequestHandlingPropertyValidator(properties).assertSuccess();
    return {
        InsertHeaders: cdk.listMapper(cfnRuleGroupCustomHTTPHeaderPropertyToCloudFormation)(properties.insertHeaders),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupCustomRequestHandlingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CustomRequestHandlingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CustomRequestHandlingProperty>();
    ret.addPropertyResult('insertHeaders', 'InsertHeaders', cfn_parse.FromCloudFormation.getArray(CfnRuleGroupCustomHTTPHeaderPropertyFromCloudFormation)(properties.InsertHeaders));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A custom response to send to the client. You can define a custom response for rule actions and default web ACL actions that are set to `Block` .
     *
     * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customresponse.html
     */
    export interface CustomResponseProperty {
        /**
         * References the response body that you want AWS WAF to return to the web request client. You can define a custom response for a rule action or a default web ACL action that is set to block. To do this, you first define the response body key and value in the `CustomResponseBodies` setting for the `WebACL` or `RuleGroup` where you want to use it. Then, in the rule action or web ACL default action `BlockAction` setting, you reference the response body using this key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customresponse.html#cfn-wafv2-rulegroup-customresponse-customresponsebodykey
         */
        readonly customResponseBodyKey?: string;
        /**
         * The HTTP status code to return to the client.
         *
         * For a list of status codes that you can use in your custom responses, see [Supported status codes for custom response](https://docs.aws.amazon.com/waf/latest/developerguide/customizing-the-response-status-codes.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customresponse.html#cfn-wafv2-rulegroup-customresponse-responsecode
         */
        readonly responseCode: number;
        /**
         * The HTTP headers to use in the response. Duplicate header names are not allowed.
         *
         * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customresponse.html#cfn-wafv2-rulegroup-customresponse-responseheaders
         */
        readonly responseHeaders?: Array<CfnRuleGroup.CustomHTTPHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CustomResponseProperty`
 *
 * @param properties - the TypeScript properties of a `CustomResponseProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_CustomResponsePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customResponseBodyKey', cdk.validateString)(properties.customResponseBodyKey));
    errors.collect(cdk.propertyValidator('responseCode', cdk.requiredValidator)(properties.responseCode));
    errors.collect(cdk.propertyValidator('responseCode', cdk.validateNumber)(properties.responseCode));
    errors.collect(cdk.propertyValidator('responseHeaders', cdk.listValidator(CfnRuleGroup_CustomHTTPHeaderPropertyValidator))(properties.responseHeaders));
    return errors.wrap('supplied properties not correct for "CustomResponseProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.CustomResponse` resource
 *
 * @param properties - the TypeScript properties of a `CustomResponseProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.CustomResponse` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupCustomResponsePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_CustomResponsePropertyValidator(properties).assertSuccess();
    return {
        CustomResponseBodyKey: cdk.stringToCloudFormation(properties.customResponseBodyKey),
        ResponseCode: cdk.numberToCloudFormation(properties.responseCode),
        ResponseHeaders: cdk.listMapper(cfnRuleGroupCustomHTTPHeaderPropertyToCloudFormation)(properties.responseHeaders),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupCustomResponsePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CustomResponseProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CustomResponseProperty>();
    ret.addPropertyResult('customResponseBodyKey', 'CustomResponseBodyKey', properties.CustomResponseBodyKey != null ? cfn_parse.FromCloudFormation.getString(properties.CustomResponseBodyKey) : undefined);
    ret.addPropertyResult('responseCode', 'ResponseCode', cfn_parse.FromCloudFormation.getNumber(properties.ResponseCode));
    ret.addPropertyResult('responseHeaders', 'ResponseHeaders', properties.ResponseHeaders != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupCustomHTTPHeaderPropertyFromCloudFormation)(properties.ResponseHeaders) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * The response body to use in a custom response to a web request. This is referenced by key from `CustomResponse` `CustomResponseBodyKey` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customresponsebody.html
     */
    export interface CustomResponseBodyProperty {
        /**
         * The payload of the custom response.
         *
         * You can use JSON escape strings in JSON content. To do this, you must specify JSON content in the `ContentType` setting.
         *
         * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customresponsebody.html#cfn-wafv2-rulegroup-customresponsebody-content
         */
        readonly content: string;
        /**
         * The type of content in the payload that you are defining in the `Content` string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-customresponsebody.html#cfn-wafv2-rulegroup-customresponsebody-contenttype
         */
        readonly contentType: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomResponseBodyProperty`
 *
 * @param properties - the TypeScript properties of a `CustomResponseBodyProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_CustomResponseBodyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('content', cdk.requiredValidator)(properties.content));
    errors.collect(cdk.propertyValidator('content', cdk.validateString)(properties.content));
    errors.collect(cdk.propertyValidator('contentType', cdk.requiredValidator)(properties.contentType));
    errors.collect(cdk.propertyValidator('contentType', cdk.validateString)(properties.contentType));
    return errors.wrap('supplied properties not correct for "CustomResponseBodyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.CustomResponseBody` resource
 *
 * @param properties - the TypeScript properties of a `CustomResponseBodyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.CustomResponseBody` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupCustomResponseBodyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_CustomResponseBodyPropertyValidator(properties).assertSuccess();
    return {
        Content: cdk.stringToCloudFormation(properties.content),
        ContentType: cdk.stringToCloudFormation(properties.contentType),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupCustomResponseBodyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.CustomResponseBodyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.CustomResponseBodyProperty>();
    ret.addPropertyResult('content', 'Content', cfn_parse.FromCloudFormation.getString(properties.Content));
    ret.addPropertyResult('contentType', 'ContentType', cfn_parse.FromCloudFormation.getString(properties.ContentType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * The part of the web request that you want AWS WAF to inspect. Include the single `FieldToMatch` type that you want to inspect, with additional specifications as needed, according to the type. You specify a single request component in `FieldToMatch` for each rule statement that requires it. To inspect more than one component of the web request, create a separate rule statement for each component.
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html
     */
    export interface FieldToMatchProperty {
        /**
         * Inspect all query arguments.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-allqueryarguments
         */
        readonly allQueryArguments?: any | cdk.IResolvable;
        /**
         * Inspect the request body as plain text. The request body immediately follows the request headers. This is the part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form.
         *
         * Only the first 8 KB (8192 bytes) of the request body are forwarded to AWS WAF for inspection by the underlying host service. For information about how to handle oversized request bodies, see the `Body` object configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-body
         */
        readonly body?: CfnRuleGroup.BodyProperty | cdk.IResolvable;
        /**
         * Inspect the request cookies. You must configure scope and pattern matching filters in the `Cookies` object, to define the set of cookies and the parts of the cookies that AWS WAF inspects.
         *
         * Only the first 8 KB (8192 bytes) of a request's cookies and only the first 200 cookies are forwarded to AWS WAF for inspection by the underlying host service. You must configure how to handle any oversize cookie content in the `Cookies` object. AWS WAF applies the pattern matching filters to the cookies that it receives from the underlying host service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-cookies
         */
        readonly cookies?: CfnRuleGroup.CookiesProperty | cdk.IResolvable;
        /**
         * Inspect the request headers. You must configure scope and pattern matching filters in the `Headers` object, to define the set of headers to and the parts of the headers that AWS WAF inspects.
         *
         * Only the first 8 KB (8192 bytes) of a request's headers and only the first 200 headers are forwarded to AWS WAF for inspection by the underlying host service. You must configure how to handle any oversize header content in the `Headers` object. AWS WAF applies the pattern matching filters to the headers that it receives from the underlying host service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-headers
         */
        readonly headers?: CfnRuleGroup.HeadersProperty | cdk.IResolvable;
        /**
         * Inspect the request body as JSON. The request body immediately follows the request headers. This is the part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form.
         *
         * Only the first 8 KB (8192 bytes) of the request body are forwarded to AWS WAF for inspection by the underlying host service. For information about how to handle oversized request bodies, see the `JsonBody` object configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-jsonbody
         */
        readonly jsonBody?: CfnRuleGroup.JsonBodyProperty | cdk.IResolvable;
        /**
         * Inspect the HTTP method. The method indicates the type of operation that the request is asking the origin to perform.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-method
         */
        readonly method?: any | cdk.IResolvable;
        /**
         * Inspect the query string. This is the part of a URL that appears after a `?` character, if any.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-querystring
         */
        readonly queryString?: any | cdk.IResolvable;
        /**
         * Inspect a single header. Provide the name of the header to inspect, for example, `User-Agent` or `Referer` . This setting isn't case sensitive.
         *
         * Example JSON: `"SingleHeader": { "Name": "haystack" }`
         *
         * Alternately, you can filter and inspect all headers with the `Headers` `FieldToMatch` setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-singleheader
         */
        readonly singleHeader?: any | cdk.IResolvable;
        /**
         * Inspect a single query argument. Provide the name of the query argument to inspect, such as *UserName* or *SalesRegion* . The name can be up to 30 characters long and isn't case sensitive.
         *
         * Example JSON: `"SingleQueryArgument": { "Name": "myArgument" }`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-singlequeryargument
         */
        readonly singleQueryArgument?: any | cdk.IResolvable;
        /**
         * Inspect the request URI path. This is the part of the web request that identifies a resource, for example, `/images/daily-ad.jpg` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-fieldtomatch.html#cfn-wafv2-rulegroup-fieldtomatch-uripath
         */
        readonly uriPath?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_FieldToMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allQueryArguments', cdk.validateObject)(properties.allQueryArguments));
    errors.collect(cdk.propertyValidator('body', CfnRuleGroup_BodyPropertyValidator)(properties.body));
    errors.collect(cdk.propertyValidator('cookies', CfnRuleGroup_CookiesPropertyValidator)(properties.cookies));
    errors.collect(cdk.propertyValidator('headers', CfnRuleGroup_HeadersPropertyValidator)(properties.headers));
    errors.collect(cdk.propertyValidator('jsonBody', CfnRuleGroup_JsonBodyPropertyValidator)(properties.jsonBody));
    errors.collect(cdk.propertyValidator('method', cdk.validateObject)(properties.method));
    errors.collect(cdk.propertyValidator('queryString', cdk.validateObject)(properties.queryString));
    errors.collect(cdk.propertyValidator('singleHeader', cdk.validateObject)(properties.singleHeader));
    errors.collect(cdk.propertyValidator('singleQueryArgument', cdk.validateObject)(properties.singleQueryArgument));
    errors.collect(cdk.propertyValidator('uriPath', cdk.validateObject)(properties.uriPath));
    return errors.wrap('supplied properties not correct for "FieldToMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.FieldToMatch` resource
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.FieldToMatch` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupFieldToMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_FieldToMatchPropertyValidator(properties).assertSuccess();
    return {
        AllQueryArguments: cdk.objectToCloudFormation(properties.allQueryArguments),
        Body: cfnRuleGroupBodyPropertyToCloudFormation(properties.body),
        Cookies: cfnRuleGroupCookiesPropertyToCloudFormation(properties.cookies),
        Headers: cfnRuleGroupHeadersPropertyToCloudFormation(properties.headers),
        JsonBody: cfnRuleGroupJsonBodyPropertyToCloudFormation(properties.jsonBody),
        Method: cdk.objectToCloudFormation(properties.method),
        QueryString: cdk.objectToCloudFormation(properties.queryString),
        SingleHeader: cdk.objectToCloudFormation(properties.singleHeader),
        SingleQueryArgument: cdk.objectToCloudFormation(properties.singleQueryArgument),
        UriPath: cdk.objectToCloudFormation(properties.uriPath),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupFieldToMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.FieldToMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.FieldToMatchProperty>();
    ret.addPropertyResult('allQueryArguments', 'AllQueryArguments', properties.AllQueryArguments != null ? cfn_parse.FromCloudFormation.getAny(properties.AllQueryArguments) : undefined);
    ret.addPropertyResult('body', 'Body', properties.Body != null ? CfnRuleGroupBodyPropertyFromCloudFormation(properties.Body) : undefined);
    ret.addPropertyResult('cookies', 'Cookies', properties.Cookies != null ? CfnRuleGroupCookiesPropertyFromCloudFormation(properties.Cookies) : undefined);
    ret.addPropertyResult('headers', 'Headers', properties.Headers != null ? CfnRuleGroupHeadersPropertyFromCloudFormation(properties.Headers) : undefined);
    ret.addPropertyResult('jsonBody', 'JsonBody', properties.JsonBody != null ? CfnRuleGroupJsonBodyPropertyFromCloudFormation(properties.JsonBody) : undefined);
    ret.addPropertyResult('method', 'Method', properties.Method != null ? cfn_parse.FromCloudFormation.getAny(properties.Method) : undefined);
    ret.addPropertyResult('queryString', 'QueryString', properties.QueryString != null ? cfn_parse.FromCloudFormation.getAny(properties.QueryString) : undefined);
    ret.addPropertyResult('singleHeader', 'SingleHeader', properties.SingleHeader != null ? cfn_parse.FromCloudFormation.getAny(properties.SingleHeader) : undefined);
    ret.addPropertyResult('singleQueryArgument', 'SingleQueryArgument', properties.SingleQueryArgument != null ? cfn_parse.FromCloudFormation.getAny(properties.SingleQueryArgument) : undefined);
    ret.addPropertyResult('uriPath', 'UriPath', properties.UriPath != null ? cfn_parse.FromCloudFormation.getAny(properties.UriPath) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin. Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * This configuration is used for `GeoMatchStatement` and `RateBasedStatement` . For `IPSetReferenceStatement` , use `IPSetForwardedIPConfig` instead.
     *
     * AWS WAF only evaluates the first IP address found in the specified HTTP header.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-forwardedipconfiguration.html
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-forwardedipconfiguration.html#cfn-wafv2-rulegroup-forwardedipconfiguration-fallbackbehavior
         */
        readonly fallbackBehavior: string;
        /**
         * The name of the HTTP header to use for the IP address. For example, to use the X-Forwarded-For (XFF) header, set this to `X-Forwarded-For` .
         *
         * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-forwardedipconfiguration.html#cfn-wafv2-rulegroup-forwardedipconfiguration-headername
         */
        readonly headerName: string;
    }
}

/**
 * Determine whether the given properties match those of a `ForwardedIPConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ForwardedIPConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_ForwardedIPConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fallbackBehavior', cdk.requiredValidator)(properties.fallbackBehavior));
    errors.collect(cdk.propertyValidator('fallbackBehavior', cdk.validateString)(properties.fallbackBehavior));
    errors.collect(cdk.propertyValidator('headerName', cdk.requiredValidator)(properties.headerName));
    errors.collect(cdk.propertyValidator('headerName', cdk.validateString)(properties.headerName));
    return errors.wrap('supplied properties not correct for "ForwardedIPConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.ForwardedIPConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ForwardedIPConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.ForwardedIPConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupForwardedIPConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_ForwardedIPConfigurationPropertyValidator(properties).assertSuccess();
    return {
        FallbackBehavior: cdk.stringToCloudFormation(properties.fallbackBehavior),
        HeaderName: cdk.stringToCloudFormation(properties.headerName),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupForwardedIPConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.ForwardedIPConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.ForwardedIPConfigurationProperty>();
    ret.addPropertyResult('fallbackBehavior', 'FallbackBehavior', cfn_parse.FromCloudFormation.getString(properties.FallbackBehavior));
    ret.addPropertyResult('headerName', 'HeaderName', cfn_parse.FromCloudFormation.getString(properties.HeaderName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A rule statement that labels web requests by country and region and that matches against web requests based on country code. A geo match rule labels every request that it inspects regardless of whether it finds a match.
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-geomatchstatement.html
     */
    export interface GeoMatchStatementProperty {
        /**
         * An array of two-character country codes that you want to match against, for example, `[ "US", "CN" ]` , from the alpha-2 country ISO codes of the ISO 3166 international standard.
         *
         * When you use a geo match statement just for the region and country labels that it adds to requests, you still have to supply a country code for the rule to evaluate. In this case, you configure the rule to only count matching requests, but it will still generate logging and count metrics for any matches. You can reduce the logging and metrics that the rule produces by specifying a country that's unlikely to be a source of traffic to your site.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-geomatchstatement.html#cfn-wafv2-rulegroup-geomatchstatement-countrycodes
         */
        readonly countryCodes?: string[];
        /**
         * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin. Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
         *
         * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-geomatchstatement.html#cfn-wafv2-rulegroup-geomatchstatement-forwardedipconfig
         */
        readonly forwardedIpConfig?: CfnRuleGroup.ForwardedIPConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `GeoMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `GeoMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_GeoMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('countryCodes', cdk.listValidator(cdk.validateString))(properties.countryCodes));
    errors.collect(cdk.propertyValidator('forwardedIpConfig', CfnRuleGroup_ForwardedIPConfigurationPropertyValidator)(properties.forwardedIpConfig));
    return errors.wrap('supplied properties not correct for "GeoMatchStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.GeoMatchStatement` resource
 *
 * @param properties - the TypeScript properties of a `GeoMatchStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.GeoMatchStatement` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupGeoMatchStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_GeoMatchStatementPropertyValidator(properties).assertSuccess();
    return {
        CountryCodes: cdk.listMapper(cdk.stringToCloudFormation)(properties.countryCodes),
        ForwardedIPConfig: cfnRuleGroupForwardedIPConfigurationPropertyToCloudFormation(properties.forwardedIpConfig),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupGeoMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.GeoMatchStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.GeoMatchStatementProperty>();
    ret.addPropertyResult('countryCodes', 'CountryCodes', properties.CountryCodes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CountryCodes) : undefined);
    ret.addPropertyResult('forwardedIpConfig', 'ForwardedIPConfig', properties.ForwardedIPConfig != null ? CfnRuleGroupForwardedIPConfigurationPropertyFromCloudFormation(properties.ForwardedIPConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * The filter to use to identify the subset of headers to inspect in a web request.
     *
     * You must specify exactly one setting: either `All` , `IncludedHeaders` , or `ExcludedHeaders` .
     *
     * Example JSON: `"MatchPattern": { "ExcludedHeaders": {"KeyToExclude1", "KeyToExclude2"} }`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headermatchpattern.html
     */
    export interface HeaderMatchPatternProperty {
        /**
         * Inspect all headers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headermatchpattern.html#cfn-wafv2-rulegroup-headermatchpattern-all
         */
        readonly all?: any | cdk.IResolvable;
        /**
         * Inspect only the headers whose keys don't match any of the strings specified here.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headermatchpattern.html#cfn-wafv2-rulegroup-headermatchpattern-excludedheaders
         */
        readonly excludedHeaders?: string[];
        /**
         * Inspect only the headers that have a key that matches one of the strings specified here.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headermatchpattern.html#cfn-wafv2-rulegroup-headermatchpattern-includedheaders
         */
        readonly includedHeaders?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `HeaderMatchPatternProperty`
 *
 * @param properties - the TypeScript properties of a `HeaderMatchPatternProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_HeaderMatchPatternPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('all', cdk.validateObject)(properties.all));
    errors.collect(cdk.propertyValidator('excludedHeaders', cdk.listValidator(cdk.validateString))(properties.excludedHeaders));
    errors.collect(cdk.propertyValidator('includedHeaders', cdk.listValidator(cdk.validateString))(properties.includedHeaders));
    return errors.wrap('supplied properties not correct for "HeaderMatchPatternProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.HeaderMatchPattern` resource
 *
 * @param properties - the TypeScript properties of a `HeaderMatchPatternProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.HeaderMatchPattern` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupHeaderMatchPatternPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_HeaderMatchPatternPropertyValidator(properties).assertSuccess();
    return {
        All: cdk.objectToCloudFormation(properties.all),
        ExcludedHeaders: cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedHeaders),
        IncludedHeaders: cdk.listMapper(cdk.stringToCloudFormation)(properties.includedHeaders),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupHeaderMatchPatternPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.HeaderMatchPatternProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.HeaderMatchPatternProperty>();
    ret.addPropertyResult('all', 'All', properties.All != null ? cfn_parse.FromCloudFormation.getAny(properties.All) : undefined);
    ret.addPropertyResult('excludedHeaders', 'ExcludedHeaders', properties.ExcludedHeaders != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExcludedHeaders) : undefined);
    ret.addPropertyResult('includedHeaders', 'IncludedHeaders', properties.IncludedHeaders != null ? cfn_parse.FromCloudFormation.getStringArray(properties.IncludedHeaders) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Inspect all headers in the web request. You can specify the parts of the headers to inspect and you can narrow the set of headers to inspect by including or excluding specific keys.
     *
     * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
     *
     * If you want to inspect just the value of a single header, use the `SingleHeader` `FieldToMatch` setting instead.
     *
     * Example JSON: `"Headers": { "MatchPattern": { "All": {} }, "MatchScope": "KEY", "OversizeHandling": "MATCH" }`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headers.html
     */
    export interface HeadersProperty {
        /**
         * The filter to use to identify the subset of headers to inspect in a web request.
         *
         * You must specify exactly one setting: either `All` , `IncludedHeaders` , or `ExcludedHeaders` .
         *
         * Example JSON: `"MatchPattern": { "ExcludedHeaders": {"KeyToExclude1", "KeyToExclude2"} }`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headers.html#cfn-wafv2-rulegroup-headers-matchpattern
         */
        readonly matchPattern: CfnRuleGroup.HeaderMatchPatternProperty | cdk.IResolvable;
        /**
         * The parts of the headers to match with the rule inspection criteria. If you specify `All` , AWS WAF inspects both keys and values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headers.html#cfn-wafv2-rulegroup-headers-matchscope
         */
        readonly matchScope: string;
        /**
         * What AWS WAF should do if the headers of the request are larger than AWS WAF can inspect. AWS WAF does not support inspecting the entire contents of request headers when they exceed 8 KB (8192 bytes) or 200 total headers. The underlying host service forwards a maximum of 200 headers and at most 8 KB of header contents to AWS WAF .
         *
         * The options for oversize handling are the following:
         *
         * - `CONTINUE` - Inspect the headers normally, according to the rule inspection criteria.
         * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
         * - `NO_MATCH` - Treat the web request as not matching the rule statement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-headers.html#cfn-wafv2-rulegroup-headers-oversizehandling
         */
        readonly oversizeHandling: string;
    }
}

/**
 * Determine whether the given properties match those of a `HeadersProperty`
 *
 * @param properties - the TypeScript properties of a `HeadersProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_HeadersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('matchPattern', cdk.requiredValidator)(properties.matchPattern));
    errors.collect(cdk.propertyValidator('matchPattern', CfnRuleGroup_HeaderMatchPatternPropertyValidator)(properties.matchPattern));
    errors.collect(cdk.propertyValidator('matchScope', cdk.requiredValidator)(properties.matchScope));
    errors.collect(cdk.propertyValidator('matchScope', cdk.validateString)(properties.matchScope));
    errors.collect(cdk.propertyValidator('oversizeHandling', cdk.requiredValidator)(properties.oversizeHandling));
    errors.collect(cdk.propertyValidator('oversizeHandling', cdk.validateString)(properties.oversizeHandling));
    return errors.wrap('supplied properties not correct for "HeadersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Headers` resource
 *
 * @param properties - the TypeScript properties of a `HeadersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Headers` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupHeadersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_HeadersPropertyValidator(properties).assertSuccess();
    return {
        MatchPattern: cfnRuleGroupHeaderMatchPatternPropertyToCloudFormation(properties.matchPattern),
        MatchScope: cdk.stringToCloudFormation(properties.matchScope),
        OversizeHandling: cdk.stringToCloudFormation(properties.oversizeHandling),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupHeadersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.HeadersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.HeadersProperty>();
    ret.addPropertyResult('matchPattern', 'MatchPattern', CfnRuleGroupHeaderMatchPatternPropertyFromCloudFormation(properties.MatchPattern));
    ret.addPropertyResult('matchScope', 'MatchScope', cfn_parse.FromCloudFormation.getString(properties.MatchScope));
    ret.addPropertyResult('oversizeHandling', 'OversizeHandling', cfn_parse.FromCloudFormation.getString(properties.OversizeHandling));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin. Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * This configuration is used only for `IPSetReferenceStatement` . For `GeoMatchStatement` and `RateBasedStatement` , use `ForwardedIPConfig` instead.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ipsetforwardedipconfiguration.html
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ipsetforwardedipconfiguration.html#cfn-wafv2-rulegroup-ipsetforwardedipconfiguration-fallbackbehavior
         */
        readonly fallbackBehavior: string;
        /**
         * The name of the HTTP header to use for the IP address. For example, to use the X-Forwarded-For (XFF) header, set this to `X-Forwarded-For` .
         *
         * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ipsetforwardedipconfiguration.html#cfn-wafv2-rulegroup-ipsetforwardedipconfiguration-headername
         */
        readonly headerName: string;
        /**
         * The position in the header to search for the IP address. The header can contain IP addresses of the original client and also of proxies. For example, the header value could be `10.1.1.1, 127.0.0.0, 10.10.10.10` where the first IP address identifies the original client and the rest identify proxies that the request went through.
         *
         * The options for this setting are the following:
         *
         * - FIRST - Inspect the first IP address in the list of IP addresses in the header. This is usually the client's original IP.
         * - LAST - Inspect the last IP address in the list of IP addresses in the header.
         * - ANY - Inspect all IP addresses in the header for a match. If the header contains more than 10 IP addresses, AWS WAF inspects the last 10.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ipsetforwardedipconfiguration.html#cfn-wafv2-rulegroup-ipsetforwardedipconfiguration-position
         */
        readonly position: string;
    }
}

/**
 * Determine whether the given properties match those of a `IPSetForwardedIPConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetForwardedIPConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_IPSetForwardedIPConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fallbackBehavior', cdk.requiredValidator)(properties.fallbackBehavior));
    errors.collect(cdk.propertyValidator('fallbackBehavior', cdk.validateString)(properties.fallbackBehavior));
    errors.collect(cdk.propertyValidator('headerName', cdk.requiredValidator)(properties.headerName));
    errors.collect(cdk.propertyValidator('headerName', cdk.validateString)(properties.headerName));
    errors.collect(cdk.propertyValidator('position', cdk.requiredValidator)(properties.position));
    errors.collect(cdk.propertyValidator('position', cdk.validateString)(properties.position));
    return errors.wrap('supplied properties not correct for "IPSetForwardedIPConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.IPSetForwardedIPConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `IPSetForwardedIPConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.IPSetForwardedIPConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupIPSetForwardedIPConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_IPSetForwardedIPConfigurationPropertyValidator(properties).assertSuccess();
    return {
        FallbackBehavior: cdk.stringToCloudFormation(properties.fallbackBehavior),
        HeaderName: cdk.stringToCloudFormation(properties.headerName),
        Position: cdk.stringToCloudFormation(properties.position),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupIPSetForwardedIPConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.IPSetForwardedIPConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.IPSetForwardedIPConfigurationProperty>();
    ret.addPropertyResult('fallbackBehavior', 'FallbackBehavior', cfn_parse.FromCloudFormation.getString(properties.FallbackBehavior));
    ret.addPropertyResult('headerName', 'HeaderName', cfn_parse.FromCloudFormation.getString(properties.HeaderName));
    ret.addPropertyResult('position', 'Position', cfn_parse.FromCloudFormation.getString(properties.Position));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A rule statement used to detect web requests coming from particular IP addresses or address ranges. To use this, create an `IPSet` that specifies the addresses you want to detect, then use the ARN of that set in this statement.
     *
     * Each IP set rule statement references an IP set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ipsetreferencestatement.html
     */
    export interface IPSetReferenceStatementProperty {
        /**
         * The Amazon Resource Name (ARN) of the `IPSet` that this statement references.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ipsetreferencestatement.html#cfn-wafv2-rulegroup-ipsetreferencestatement-arn
         */
        readonly arn: string;
        /**
         * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin. Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
         *
         * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ipsetreferencestatement.html#cfn-wafv2-rulegroup-ipsetreferencestatement-ipsetforwardedipconfig
         */
        readonly ipSetForwardedIpConfig?: CfnRuleGroup.IPSetForwardedIPConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `IPSetReferenceStatementProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetReferenceStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_IPSetReferenceStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('ipSetForwardedIpConfig', CfnRuleGroup_IPSetForwardedIPConfigurationPropertyValidator)(properties.ipSetForwardedIpConfig));
    return errors.wrap('supplied properties not correct for "IPSetReferenceStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.IPSetReferenceStatement` resource
 *
 * @param properties - the TypeScript properties of a `IPSetReferenceStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.IPSetReferenceStatement` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupIPSetReferenceStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_IPSetReferenceStatementPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        IPSetForwardedIPConfig: cfnRuleGroupIPSetForwardedIPConfigurationPropertyToCloudFormation(properties.ipSetForwardedIpConfig),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupIPSetReferenceStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.IPSetReferenceStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.IPSetReferenceStatementProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addPropertyResult('ipSetForwardedIpConfig', 'IPSetForwardedIPConfig', properties.IPSetForwardedIPConfig != null ? CfnRuleGroupIPSetForwardedIPConfigurationPropertyFromCloudFormation(properties.IPSetForwardedIPConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Used for CAPTCHA and challenge token settings. Determines how long a `CAPTCHA` or challenge timestamp remains valid after AWS WAF updates it for a successful `CAPTCHA` or challenge response.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-immunitytimeproperty.html
     */
    export interface ImmunityTimePropertyProperty {
        /**
         * The amount of time, in seconds, that a `CAPTCHA` or challenge timestamp is considered valid by AWS WAF . The default setting is 300.
         *
         * For the Challenge action, the minimum setting is 300.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-immunitytimeproperty.html#cfn-wafv2-rulegroup-immunitytimeproperty-immunitytime
         */
        readonly immunityTime: number;
    }
}

/**
 * Determine whether the given properties match those of a `ImmunityTimePropertyProperty`
 *
 * @param properties - the TypeScript properties of a `ImmunityTimePropertyProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_ImmunityTimePropertyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('immunityTime', cdk.requiredValidator)(properties.immunityTime));
    errors.collect(cdk.propertyValidator('immunityTime', cdk.validateNumber)(properties.immunityTime));
    return errors.wrap('supplied properties not correct for "ImmunityTimePropertyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.ImmunityTimeProperty` resource
 *
 * @param properties - the TypeScript properties of a `ImmunityTimePropertyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.ImmunityTimeProperty` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupImmunityTimePropertyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_ImmunityTimePropertyPropertyValidator(properties).assertSuccess();
    return {
        ImmunityTime: cdk.numberToCloudFormation(properties.immunityTime),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupImmunityTimePropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.ImmunityTimePropertyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.ImmunityTimePropertyProperty>();
    ret.addPropertyResult('immunityTime', 'ImmunityTime', cfn_parse.FromCloudFormation.getNumber(properties.ImmunityTime));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonbody.html
     */
    export interface JsonBodyProperty {
        /**
         * What AWS WAF should do if it fails to completely parse the JSON body. The options are the following:
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonbody.html#cfn-wafv2-rulegroup-jsonbody-invalidfallbackbehavior
         */
        readonly invalidFallbackBehavior?: string;
        /**
         * The patterns to look for in the JSON body. AWS WAF inspects the results of these pattern matches against the rule inspection criteria.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonbody.html#cfn-wafv2-rulegroup-jsonbody-matchpattern
         */
        readonly matchPattern: CfnRuleGroup.JsonMatchPatternProperty | cdk.IResolvable;
        /**
         * The parts of the JSON to match against using the `MatchPattern` . If you specify `All` , AWS WAF matches against keys and values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonbody.html#cfn-wafv2-rulegroup-jsonbody-matchscope
         */
        readonly matchScope: string;
        /**
         * What AWS WAF should do if the body is larger than AWS WAF can inspect. AWS WAF does not support inspecting the entire contents of the body of a web request when the body exceeds 8 KB (8192 bytes). Only the first 8 KB of the request body are forwarded to AWS WAF by the underlying host service.
         *
         * The options for oversize handling are the following:
         *
         * - `CONTINUE` - Inspect the body normally, according to the rule inspection criteria.
         * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
         * - `NO_MATCH` - Treat the web request as not matching the rule statement.
         *
         * You can combine the `MATCH` or `NO_MATCH` settings for oversize handling with your rule and web ACL action settings, so that you block any request whose body is over 8 KB.
         *
         * Default: `CONTINUE`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonbody.html#cfn-wafv2-rulegroup-jsonbody-oversizehandling
         */
        readonly oversizeHandling?: string;
    }
}

/**
 * Determine whether the given properties match those of a `JsonBodyProperty`
 *
 * @param properties - the TypeScript properties of a `JsonBodyProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_JsonBodyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('invalidFallbackBehavior', cdk.validateString)(properties.invalidFallbackBehavior));
    errors.collect(cdk.propertyValidator('matchPattern', cdk.requiredValidator)(properties.matchPattern));
    errors.collect(cdk.propertyValidator('matchPattern', CfnRuleGroup_JsonMatchPatternPropertyValidator)(properties.matchPattern));
    errors.collect(cdk.propertyValidator('matchScope', cdk.requiredValidator)(properties.matchScope));
    errors.collect(cdk.propertyValidator('matchScope', cdk.validateString)(properties.matchScope));
    errors.collect(cdk.propertyValidator('oversizeHandling', cdk.validateString)(properties.oversizeHandling));
    return errors.wrap('supplied properties not correct for "JsonBodyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.JsonBody` resource
 *
 * @param properties - the TypeScript properties of a `JsonBodyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.JsonBody` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupJsonBodyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_JsonBodyPropertyValidator(properties).assertSuccess();
    return {
        InvalidFallbackBehavior: cdk.stringToCloudFormation(properties.invalidFallbackBehavior),
        MatchPattern: cfnRuleGroupJsonMatchPatternPropertyToCloudFormation(properties.matchPattern),
        MatchScope: cdk.stringToCloudFormation(properties.matchScope),
        OversizeHandling: cdk.stringToCloudFormation(properties.oversizeHandling),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupJsonBodyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.JsonBodyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.JsonBodyProperty>();
    ret.addPropertyResult('invalidFallbackBehavior', 'InvalidFallbackBehavior', properties.InvalidFallbackBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.InvalidFallbackBehavior) : undefined);
    ret.addPropertyResult('matchPattern', 'MatchPattern', CfnRuleGroupJsonMatchPatternPropertyFromCloudFormation(properties.MatchPattern));
    ret.addPropertyResult('matchScope', 'MatchScope', cfn_parse.FromCloudFormation.getString(properties.MatchScope));
    ret.addPropertyResult('oversizeHandling', 'OversizeHandling', properties.OversizeHandling != null ? cfn_parse.FromCloudFormation.getString(properties.OversizeHandling) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * The patterns to look for in the JSON body. AWS WAF inspects the results of these pattern matches against the rule inspection criteria. This is used with the `FieldToMatch` option `JsonBody` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonmatchpattern.html
     */
    export interface JsonMatchPatternProperty {
        /**
         * Match all of the elements. See also `MatchScope` in the `JsonBody` `FieldToMatch` specification.
         *
         * You must specify either this setting or the `IncludedPaths` setting, but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonmatchpattern.html#cfn-wafv2-rulegroup-jsonmatchpattern-all
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-jsonmatchpattern.html#cfn-wafv2-rulegroup-jsonmatchpattern-includedpaths
         */
        readonly includedPaths?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `JsonMatchPatternProperty`
 *
 * @param properties - the TypeScript properties of a `JsonMatchPatternProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_JsonMatchPatternPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('all', cdk.validateObject)(properties.all));
    errors.collect(cdk.propertyValidator('includedPaths', cdk.listValidator(cdk.validateString))(properties.includedPaths));
    return errors.wrap('supplied properties not correct for "JsonMatchPatternProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.JsonMatchPattern` resource
 *
 * @param properties - the TypeScript properties of a `JsonMatchPatternProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.JsonMatchPattern` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupJsonMatchPatternPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_JsonMatchPatternPropertyValidator(properties).assertSuccess();
    return {
        All: cdk.objectToCloudFormation(properties.all),
        IncludedPaths: cdk.listMapper(cdk.stringToCloudFormation)(properties.includedPaths),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupJsonMatchPatternPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.JsonMatchPatternProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.JsonMatchPatternProperty>();
    ret.addPropertyResult('all', 'All', properties.All != null ? cfn_parse.FromCloudFormation.getAny(properties.All) : undefined);
    ret.addPropertyResult('includedPaths', 'IncludedPaths', properties.IncludedPaths != null ? cfn_parse.FromCloudFormation.getStringArray(properties.IncludedPaths) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A single label container. This is used as an element of a label array in `RuleLabels` inside a rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-label.html
     */
    export interface LabelProperty {
        /**
         * The label string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-label.html#cfn-wafv2-rulegroup-label-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `LabelProperty`
 *
 * @param properties - the TypeScript properties of a `LabelProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_LabelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "LabelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Label` resource
 *
 * @param properties - the TypeScript properties of a `LabelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Label` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupLabelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_LabelPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupLabelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.LabelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.LabelProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A rule statement to match against labels that have been added to the web request by rules that have already run in the web ACL.
     *
     * The label match statement provides the label or namespace string to search for. The label string can represent a part or all of the fully qualified label name that had been added to the web request. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label. If you do not provide the fully qualified name in your label match string, AWS WAF performs the search for labels that were added in the same context as the label match statement.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-labelmatchstatement.html
     */
    export interface LabelMatchStatementProperty {
        /**
         * The string to match against. The setting you provide for this depends on the match statement's `Scope` setting:
         *
         * - If the `Scope` indicates `LABEL` , then this specification must include the name and can include any number of preceding namespace specifications and prefix up to providing the fully qualified label name.
         * - If the `Scope` indicates `NAMESPACE` , then this specification can include any number of contiguous namespace strings, and can include the entire label namespace prefix from the rule group or web ACL where the label originates.
         *
         * Labels are case sensitive and components of a label must be separated by colon, for example `NS1:NS2:name` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-labelmatchstatement.html#cfn-wafv2-rulegroup-labelmatchstatement-key
         */
        readonly key: string;
        /**
         * Specify whether you want to match using the label name or just the namespace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-labelmatchstatement.html#cfn-wafv2-rulegroup-labelmatchstatement-scope
         */
        readonly scope: string;
    }
}

/**
 * Determine whether the given properties match those of a `LabelMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `LabelMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_LabelMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('scope', cdk.requiredValidator)(properties.scope));
    errors.collect(cdk.propertyValidator('scope', cdk.validateString)(properties.scope));
    return errors.wrap('supplied properties not correct for "LabelMatchStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.LabelMatchStatement` resource
 *
 * @param properties - the TypeScript properties of a `LabelMatchStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.LabelMatchStatement` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupLabelMatchStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_LabelMatchStatementPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Scope: cdk.stringToCloudFormation(properties.scope),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupLabelMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.LabelMatchStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.LabelMatchStatementProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('scope', 'Scope', cfn_parse.FromCloudFormation.getString(properties.Scope));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * List of labels used by one or more of the rules of a `RuleGroup` . This summary object is used for the following rule group lists:
     *
     * - `AvailableLabels` - Labels that rules add to matching requests. These labels are defined in the `RuleLabels` for a rule.
     * - `ConsumedLabels` - Labels that rules match against. These labels are defined in a `LabelMatchStatement` specification, in the `Statement` definition of a rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-labelsummary.html
     */
    export interface LabelSummaryProperty {
        /**
         * An individual label specification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-labelsummary.html#cfn-wafv2-rulegroup-labelsummary-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LabelSummaryProperty`
 *
 * @param properties - the TypeScript properties of a `LabelSummaryProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_LabelSummaryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "LabelSummaryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.LabelSummary` resource
 *
 * @param properties - the TypeScript properties of a `LabelSummaryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.LabelSummary` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupLabelSummaryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_LabelSummaryPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupLabelSummaryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.LabelSummaryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.LabelSummaryProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A logical rule statement used to negate the results of another rule statement. You provide one `Statement` within the `NotStatement` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-notstatement.html
     */
    export interface NotStatementProperty {
        /**
         * The statement to negate. You can use any statement that can be nested.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-notstatement.html#cfn-wafv2-rulegroup-notstatement-statement
         */
        readonly statement: CfnRuleGroup.StatementProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NotStatementProperty`
 *
 * @param properties - the TypeScript properties of a `NotStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_NotStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('statement', cdk.requiredValidator)(properties.statement));
    errors.collect(cdk.propertyValidator('statement', CfnRuleGroup_StatementPropertyValidator)(properties.statement));
    return errors.wrap('supplied properties not correct for "NotStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.NotStatement` resource
 *
 * @param properties - the TypeScript properties of a `NotStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.NotStatement` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupNotStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_NotStatementPropertyValidator(properties).assertSuccess();
    return {
        Statement: cfnRuleGroupStatementPropertyToCloudFormation(properties.statement),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupNotStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.NotStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.NotStatementProperty>();
    ret.addPropertyResult('statement', 'Statement', CfnRuleGroupStatementPropertyFromCloudFormation(properties.Statement));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A logical rule statement used to combine other rule statements with OR logic. You provide more than one `Statement` within the `OrStatement` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-orstatement.html
     */
    export interface OrStatementProperty {
        /**
         * The statements to combine with OR logic. You can use any statements that can be nested.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-orstatement.html#cfn-wafv2-rulegroup-orstatement-statements
         */
        readonly statements: Array<CfnRuleGroup.StatementProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `OrStatementProperty`
 *
 * @param properties - the TypeScript properties of a `OrStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_OrStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('statements', cdk.requiredValidator)(properties.statements));
    errors.collect(cdk.propertyValidator('statements', cdk.listValidator(CfnRuleGroup_StatementPropertyValidator))(properties.statements));
    return errors.wrap('supplied properties not correct for "OrStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.OrStatement` resource
 *
 * @param properties - the TypeScript properties of a `OrStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.OrStatement` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupOrStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_OrStatementPropertyValidator(properties).assertSuccess();
    return {
        Statements: cdk.listMapper(cfnRuleGroupStatementPropertyToCloudFormation)(properties.statements),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupOrStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.OrStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.OrStatementProperty>();
    ret.addPropertyResult('statements', 'Statements', cfn_parse.FromCloudFormation.getArray(CfnRuleGroupStatementPropertyFromCloudFormation)(properties.Statements));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A rate-based rule tracks the rate of requests for each originating IP address, and triggers the rule action when the rate exceeds a limit that you specify on the number of requests in any 5-minute time span. You can use this to put a temporary block on requests from an IP address that is sending excessive requests.
     *
     * AWS WAF tracks and manages web requests separately for each instance of a rate-based rule that you use. For example, if you provide the same rate-based rule settings in two web ACLs, each of the two rule statements represents a separate instance of the rate-based rule and gets its own tracking and management by AWS WAF . If you define a rate-based rule inside a rule group, and then use that rule group in multiple places, each use creates a separate instance of the rate-based rule that gets its own tracking and management by AWS WAF .
     *
     * When the rule action triggers, AWS WAF blocks additional requests from the IP address until the request rate falls below the limit.
     *
     * You can optionally nest another statement inside the rate-based statement, to narrow the scope of the rule so that it only counts requests that match the nested statement. For example, based on recent requests that you have seen from an attacker, you might create a rate-based rule with a nested AND rule statement that contains the following nested statements:
     *
     * - An IP match statement with an IP set that specified the address 192.0.2.44.
     * - A string match statement that searches in the User-Agent header for the string BadBot.
     *
     * In this rate-based rule, you also define a rate limit. For this example, the rate limit is 1,000. Requests that meet the criteria of both of the nested statements are counted. If the count exceeds 1,000 requests per five minutes, the rule action triggers. Requests that do not meet the criteria of both of the nested statements are not counted towards the rate limit and are not affected by this rule.
     *
     * You cannot nest a `RateBasedStatement` inside another statement, for example inside a `NotStatement` or `OrStatement` . You can define a `RateBasedStatement` inside a web ACL and inside a rule group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatement.html
     */
    export interface RateBasedStatementProperty {
        /**
         * Setting that indicates how to aggregate the request counts. The options are the following:
         *
         * - IP - Aggregate the request counts on the IP address from the web request origin.
         * - FORWARDED_IP - Aggregate the request counts on the first IP address in an HTTP header. If you use this, configure the `ForwardedIPConfig` , to specify the header to use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatement.html#cfn-wafv2-rulegroup-ratebasedstatement-aggregatekeytype
         */
        readonly aggregateKeyType: string;
        /**
         * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin. Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
         *
         * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
         *
         * This is required if `AggregateKeyType` is set to `FORWARDED_IP` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatement.html#cfn-wafv2-rulegroup-ratebasedstatement-forwardedipconfig
         */
        readonly forwardedIpConfig?: CfnRuleGroup.ForwardedIPConfigurationProperty | cdk.IResolvable;
        /**
         * The limit on requests per 5-minute period for a single originating IP address. If the statement includes a `ScopeDownStatement` , this limit is applied only to the requests that match the statement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatement.html#cfn-wafv2-rulegroup-ratebasedstatement-limit
         */
        readonly limit: number;
        /**
         * An optional nested statement that narrows the scope of the web requests that are evaluated by the rate-based statement. Requests are only tracked by the rate-based statement if they match the scope-down statement. You can use any nestable statement in the scope-down statement, and you can nest statements at any level, the same as you can for a rule statement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ratebasedstatement.html#cfn-wafv2-rulegroup-ratebasedstatement-scopedownstatement
         */
        readonly scopeDownStatement?: CfnRuleGroup.StatementProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RateBasedStatementProperty`
 *
 * @param properties - the TypeScript properties of a `RateBasedStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_RateBasedStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('aggregateKeyType', cdk.requiredValidator)(properties.aggregateKeyType));
    errors.collect(cdk.propertyValidator('aggregateKeyType', cdk.validateString)(properties.aggregateKeyType));
    errors.collect(cdk.propertyValidator('forwardedIpConfig', CfnRuleGroup_ForwardedIPConfigurationPropertyValidator)(properties.forwardedIpConfig));
    errors.collect(cdk.propertyValidator('limit', cdk.requiredValidator)(properties.limit));
    errors.collect(cdk.propertyValidator('limit', cdk.validateNumber)(properties.limit));
    errors.collect(cdk.propertyValidator('scopeDownStatement', CfnRuleGroup_StatementPropertyValidator)(properties.scopeDownStatement));
    return errors.wrap('supplied properties not correct for "RateBasedStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.RateBasedStatement` resource
 *
 * @param properties - the TypeScript properties of a `RateBasedStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.RateBasedStatement` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupRateBasedStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_RateBasedStatementPropertyValidator(properties).assertSuccess();
    return {
        AggregateKeyType: cdk.stringToCloudFormation(properties.aggregateKeyType),
        ForwardedIPConfig: cfnRuleGroupForwardedIPConfigurationPropertyToCloudFormation(properties.forwardedIpConfig),
        Limit: cdk.numberToCloudFormation(properties.limit),
        ScopeDownStatement: cfnRuleGroupStatementPropertyToCloudFormation(properties.scopeDownStatement),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupRateBasedStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.RateBasedStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RateBasedStatementProperty>();
    ret.addPropertyResult('aggregateKeyType', 'AggregateKeyType', cfn_parse.FromCloudFormation.getString(properties.AggregateKeyType));
    ret.addPropertyResult('forwardedIpConfig', 'ForwardedIPConfig', properties.ForwardedIPConfig != null ? CfnRuleGroupForwardedIPConfigurationPropertyFromCloudFormation(properties.ForwardedIPConfig) : undefined);
    ret.addPropertyResult('limit', 'Limit', cfn_parse.FromCloudFormation.getNumber(properties.Limit));
    ret.addPropertyResult('scopeDownStatement', 'ScopeDownStatement', properties.ScopeDownStatement != null ? CfnRuleGroupStatementPropertyFromCloudFormation(properties.ScopeDownStatement) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A rule statement used to search web request components for a match against a single regular expression.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexmatchstatement.html
     */
    export interface RegexMatchStatementProperty {
        /**
         * The part of the web request that you want AWS WAF to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexmatchstatement.html#cfn-wafv2-rulegroup-regexmatchstatement-fieldtomatch
         */
        readonly fieldToMatch: CfnRuleGroup.FieldToMatchProperty | cdk.IResolvable;
        /**
         * The string representing the regular expression.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexmatchstatement.html#cfn-wafv2-rulegroup-regexmatchstatement-regexstring
         */
        readonly regexString: string;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexmatchstatement.html#cfn-wafv2-rulegroup-regexmatchstatement-texttransformations
         */
        readonly textTransformations: Array<CfnRuleGroup.TextTransformationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RegexMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `RegexMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_RegexMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnRuleGroup_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('regexString', cdk.requiredValidator)(properties.regexString));
    errors.collect(cdk.propertyValidator('regexString', cdk.validateString)(properties.regexString));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.requiredValidator)(properties.textTransformations));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.listValidator(CfnRuleGroup_TextTransformationPropertyValidator))(properties.textTransformations));
    return errors.wrap('supplied properties not correct for "RegexMatchStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.RegexMatchStatement` resource
 *
 * @param properties - the TypeScript properties of a `RegexMatchStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.RegexMatchStatement` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupRegexMatchStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_RegexMatchStatementPropertyValidator(properties).assertSuccess();
    return {
        FieldToMatch: cfnRuleGroupFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        RegexString: cdk.stringToCloudFormation(properties.regexString),
        TextTransformations: cdk.listMapper(cfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupRegexMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.RegexMatchStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RegexMatchStatementProperty>();
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnRuleGroupFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('regexString', 'RegexString', cfn_parse.FromCloudFormation.getString(properties.RegexString));
    ret.addPropertyResult('textTransformations', 'TextTransformations', cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A rule statement used to search web request components for matches with regular expressions. To use this, create a `RegexPatternSet` that specifies the expressions that you want to detect, then use the ARN of that set in this statement. A web request matches the pattern set rule statement if the request component matches any of the patterns in the set.
     *
     * Each regex pattern set rule statement references a regex pattern set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexpatternsetreferencestatement.html
     */
    export interface RegexPatternSetReferenceStatementProperty {
        /**
         * The Amazon Resource Name (ARN) of the `RegexPatternSet` that this statement references.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexpatternsetreferencestatement.html#cfn-wafv2-rulegroup-regexpatternsetreferencestatement-arn
         */
        readonly arn: string;
        /**
         * The part of the web request that you want AWS WAF to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexpatternsetreferencestatement.html#cfn-wafv2-rulegroup-regexpatternsetreferencestatement-fieldtomatch
         */
        readonly fieldToMatch: CfnRuleGroup.FieldToMatchProperty | cdk.IResolvable;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-regexpatternsetreferencestatement.html#cfn-wafv2-rulegroup-regexpatternsetreferencestatement-texttransformations
         */
        readonly textTransformations: Array<CfnRuleGroup.TextTransformationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RegexPatternSetReferenceStatementProperty`
 *
 * @param properties - the TypeScript properties of a `RegexPatternSetReferenceStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_RegexPatternSetReferenceStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnRuleGroup_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.requiredValidator)(properties.textTransformations));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.listValidator(CfnRuleGroup_TextTransformationPropertyValidator))(properties.textTransformations));
    return errors.wrap('supplied properties not correct for "RegexPatternSetReferenceStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.RegexPatternSetReferenceStatement` resource
 *
 * @param properties - the TypeScript properties of a `RegexPatternSetReferenceStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.RegexPatternSetReferenceStatement` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupRegexPatternSetReferenceStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_RegexPatternSetReferenceStatementPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        FieldToMatch: cfnRuleGroupFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        TextTransformations: cdk.listMapper(cfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupRegexPatternSetReferenceStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.RegexPatternSetReferenceStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RegexPatternSetReferenceStatementProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnRuleGroupFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('textTransformations', 'TextTransformations', cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A single rule, which you can use in a `WebACL` or `RuleGroup` to identify web requests that you want to allow, block, or count. Each rule includes one top-level `Statement` that AWS WAF uses to identify matching web requests, and parameters that govern how AWS WAF handles them.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html
     */
    export interface RuleProperty {
        /**
         * The action that AWS WAF should take on a web request when it matches the rule statement. Settings at the web ACL level can override the rule action setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-action
         */
        readonly action?: CfnRuleGroup.RuleActionProperty | cdk.IResolvable;
        /**
         * Specifies how AWS WAF should handle `CAPTCHA` evaluations. If you don't specify this, AWS WAF uses the `CAPTCHA` configuration that's defined for the web ACL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-captchaconfig
         */
        readonly captchaConfig?: CfnRuleGroup.CaptchaConfigProperty | cdk.IResolvable;
        /**
         * Specifies how AWS WAF should handle `Challenge` evaluations. If you don't specify this, AWS WAF uses the challenge configuration that's defined for the web ACL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-challengeconfig
         */
        readonly challengeConfig?: CfnRuleGroup.ChallengeConfigProperty | cdk.IResolvable;
        /**
         * The name of the rule. You can't change the name of a `Rule` after you create it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-name
         */
        readonly name: string;
        /**
         * If you define more than one `Rule` in a `WebACL` , AWS WAF evaluates each request against the `Rules` in order based on the value of `Priority` . AWS WAF processes rules with lower priority first. The priorities don't need to be consecutive, but they must all be different.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-priority
         */
        readonly priority: number;
        /**
         * Labels to apply to web requests that match the rule match statement. AWS WAF applies fully qualified labels to matching web requests. A fully qualified label is the concatenation of a label namespace and a rule label. The rule's rule group or web ACL defines the label namespace.
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-rulelabels
         */
        readonly ruleLabels?: Array<CfnRuleGroup.LabelProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The AWS WAF processing statement for the rule, for example `ByteMatchStatement` or `SizeConstraintStatement` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-statement
         */
        readonly statement: CfnRuleGroup.StatementProperty | cdk.IResolvable;
        /**
         * Defines and enables Amazon CloudWatch metrics and web request sample collection.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-rule.html#cfn-wafv2-rulegroup-rule-visibilityconfig
         */
        readonly visibilityConfig: CfnRuleGroup.VisibilityConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_RulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', CfnRuleGroup_RuleActionPropertyValidator)(properties.action));
    errors.collect(cdk.propertyValidator('captchaConfig', CfnRuleGroup_CaptchaConfigPropertyValidator)(properties.captchaConfig));
    errors.collect(cdk.propertyValidator('challengeConfig', CfnRuleGroup_ChallengeConfigPropertyValidator)(properties.challengeConfig));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('priority', cdk.requiredValidator)(properties.priority));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('ruleLabels', cdk.listValidator(CfnRuleGroup_LabelPropertyValidator))(properties.ruleLabels));
    errors.collect(cdk.propertyValidator('statement', cdk.requiredValidator)(properties.statement));
    errors.collect(cdk.propertyValidator('statement', CfnRuleGroup_StatementPropertyValidator)(properties.statement));
    errors.collect(cdk.propertyValidator('visibilityConfig', cdk.requiredValidator)(properties.visibilityConfig));
    errors.collect(cdk.propertyValidator('visibilityConfig', CfnRuleGroup_VisibilityConfigPropertyValidator)(properties.visibilityConfig));
    return errors.wrap('supplied properties not correct for "RuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Rule` resource
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Rule` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_RulePropertyValidator(properties).assertSuccess();
    return {
        Action: cfnRuleGroupRuleActionPropertyToCloudFormation(properties.action),
        CaptchaConfig: cfnRuleGroupCaptchaConfigPropertyToCloudFormation(properties.captchaConfig),
        ChallengeConfig: cfnRuleGroupChallengeConfigPropertyToCloudFormation(properties.challengeConfig),
        Name: cdk.stringToCloudFormation(properties.name),
        Priority: cdk.numberToCloudFormation(properties.priority),
        RuleLabels: cdk.listMapper(cfnRuleGroupLabelPropertyToCloudFormation)(properties.ruleLabels),
        Statement: cfnRuleGroupStatementPropertyToCloudFormation(properties.statement),
        VisibilityConfig: cfnRuleGroupVisibilityConfigPropertyToCloudFormation(properties.visibilityConfig),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.RuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RuleProperty>();
    ret.addPropertyResult('action', 'Action', properties.Action != null ? CfnRuleGroupRuleActionPropertyFromCloudFormation(properties.Action) : undefined);
    ret.addPropertyResult('captchaConfig', 'CaptchaConfig', properties.CaptchaConfig != null ? CfnRuleGroupCaptchaConfigPropertyFromCloudFormation(properties.CaptchaConfig) : undefined);
    ret.addPropertyResult('challengeConfig', 'ChallengeConfig', properties.ChallengeConfig != null ? CfnRuleGroupChallengeConfigPropertyFromCloudFormation(properties.ChallengeConfig) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('priority', 'Priority', cfn_parse.FromCloudFormation.getNumber(properties.Priority));
    ret.addPropertyResult('ruleLabels', 'RuleLabels', properties.RuleLabels != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleGroupLabelPropertyFromCloudFormation)(properties.RuleLabels) : undefined);
    ret.addPropertyResult('statement', 'Statement', CfnRuleGroupStatementPropertyFromCloudFormation(properties.Statement));
    ret.addPropertyResult('visibilityConfig', 'VisibilityConfig', CfnRuleGroupVisibilityConfigPropertyFromCloudFormation(properties.VisibilityConfig));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * The action that AWS WAF should take on a web request when it matches a rule's statement. Settings at the web ACL level can override the rule action setting.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ruleaction.html
     */
    export interface RuleActionProperty {
        /**
         * Instructs AWS WAF to allow the web request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ruleaction.html#cfn-wafv2-rulegroup-ruleaction-allow
         */
        readonly allow?: any | cdk.IResolvable;
        /**
         * Instructs AWS WAF to block the web request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ruleaction.html#cfn-wafv2-rulegroup-ruleaction-block
         */
        readonly block?: any | cdk.IResolvable;
        /**
         * Specifies that AWS WAF should run a `CAPTCHA` check against the request:
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ruleaction.html#cfn-wafv2-rulegroup-ruleaction-captcha
         */
        readonly captcha?: any | cdk.IResolvable;
        /**
         * Instructs AWS WAF to run a `Challenge` check against the web request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ruleaction.html#cfn-wafv2-rulegroup-ruleaction-challenge
         */
        readonly challenge?: CfnRuleGroup.ChallengeProperty | cdk.IResolvable;
        /**
         * Instructs AWS WAF to count the web request and then continue evaluating the request using the remaining rules in the web ACL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-ruleaction.html#cfn-wafv2-rulegroup-ruleaction-count
         */
        readonly count?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RuleActionProperty`
 *
 * @param properties - the TypeScript properties of a `RuleActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_RuleActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allow', cdk.validateObject)(properties.allow));
    errors.collect(cdk.propertyValidator('block', cdk.validateObject)(properties.block));
    errors.collect(cdk.propertyValidator('captcha', cdk.validateObject)(properties.captcha));
    errors.collect(cdk.propertyValidator('challenge', CfnRuleGroup_ChallengePropertyValidator)(properties.challenge));
    errors.collect(cdk.propertyValidator('count', cdk.validateObject)(properties.count));
    return errors.wrap('supplied properties not correct for "RuleActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.RuleAction` resource
 *
 * @param properties - the TypeScript properties of a `RuleActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.RuleAction` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupRuleActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_RuleActionPropertyValidator(properties).assertSuccess();
    return {
        Allow: cdk.objectToCloudFormation(properties.allow),
        Block: cdk.objectToCloudFormation(properties.block),
        Captcha: cdk.objectToCloudFormation(properties.captcha),
        Challenge: cfnRuleGroupChallengePropertyToCloudFormation(properties.challenge),
        Count: cdk.objectToCloudFormation(properties.count),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupRuleActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.RuleActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.RuleActionProperty>();
    ret.addPropertyResult('allow', 'Allow', properties.Allow != null ? cfn_parse.FromCloudFormation.getAny(properties.Allow) : undefined);
    ret.addPropertyResult('block', 'Block', properties.Block != null ? cfn_parse.FromCloudFormation.getAny(properties.Block) : undefined);
    ret.addPropertyResult('captcha', 'Captcha', properties.Captcha != null ? cfn_parse.FromCloudFormation.getAny(properties.Captcha) : undefined);
    ret.addPropertyResult('challenge', 'Challenge', properties.Challenge != null ? CfnRuleGroupChallengePropertyFromCloudFormation(properties.Challenge) : undefined);
    ret.addPropertyResult('count', 'Count', properties.Count != null ? cfn_parse.FromCloudFormation.getAny(properties.Count) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Inspect one of the headers in the web request, identified by name, for example, `User-Agent` or `Referer` . The name isn't case sensitive.
     *
     * You can filter and inspect all headers with the `FieldToMatch` setting `Headers` .
     *
     * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
     *
     * Example JSON: `"SingleHeader": { "Name": "haystack" }`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-singleheader.html
     */
    export interface SingleHeaderProperty {
        /**
         * The name of the query header to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-singleheader.html#cfn-wafv2-rulegroup-singleheader-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `SingleHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `SingleHeaderProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_SingleHeaderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "SingleHeaderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.SingleHeader` resource
 *
 * @param properties - the TypeScript properties of a `SingleHeaderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.SingleHeader` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupSingleHeaderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_SingleHeaderPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupSingleHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.SingleHeaderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.SingleHeaderProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Inspect one query argument in the web request, identified by name, for example *UserName* or *SalesRegion* . The name isn't case sensitive.
     *
     * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
     *
     * Example JSON: `"SingleQueryArgument": { "Name": "myArgument" }`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-singlequeryargument.html
     */
    export interface SingleQueryArgumentProperty {
        /**
         * The name of the query argument to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-singlequeryargument.html#cfn-wafv2-rulegroup-singlequeryargument-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `SingleQueryArgumentProperty`
 *
 * @param properties - the TypeScript properties of a `SingleQueryArgumentProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_SingleQueryArgumentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "SingleQueryArgumentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.SingleQueryArgument` resource
 *
 * @param properties - the TypeScript properties of a `SingleQueryArgumentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.SingleQueryArgument` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupSingleQueryArgumentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_SingleQueryArgumentPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupSingleQueryArgumentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.SingleQueryArgumentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.SingleQueryArgumentProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A rule statement that compares a number of bytes against the size of a request component, using a comparison operator, such as greater than (>) or less than (<). For example, you can use a size constraint statement to look for query strings that are longer than 100 bytes.
     *
     * If you configure AWS WAF to inspect the request body, AWS WAF inspects only the first 8192 bytes (8 KB). If the request body for your web requests never exceeds 8192 bytes, you could use a size constraint statement to block requests that have a request body greater than 8192 bytes.
     *
     * If you choose URI for the value of Part of the request to filter on, the slash (/) in the URI counts as one character. For example, the URI `/logo.jpg` is nine characters long.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sizeconstraintstatement.html
     */
    export interface SizeConstraintStatementProperty {
        /**
         * The operator to use to compare the request part to the size setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sizeconstraintstatement.html#cfn-wafv2-rulegroup-sizeconstraintstatement-comparisonoperator
         */
        readonly comparisonOperator: string;
        /**
         * The part of the web request that you want AWS WAF to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sizeconstraintstatement.html#cfn-wafv2-rulegroup-sizeconstraintstatement-fieldtomatch
         */
        readonly fieldToMatch: CfnRuleGroup.FieldToMatchProperty | cdk.IResolvable;
        /**
         * The size, in byte, to compare to the request part, after any transformations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sizeconstraintstatement.html#cfn-wafv2-rulegroup-sizeconstraintstatement-size
         */
        readonly size: number;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sizeconstraintstatement.html#cfn-wafv2-rulegroup-sizeconstraintstatement-texttransformations
         */
        readonly textTransformations: Array<CfnRuleGroup.TextTransformationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SizeConstraintStatementProperty`
 *
 * @param properties - the TypeScript properties of a `SizeConstraintStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_SizeConstraintStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.requiredValidator)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.validateString)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnRuleGroup_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('size', cdk.requiredValidator)(properties.size));
    errors.collect(cdk.propertyValidator('size', cdk.validateNumber)(properties.size));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.requiredValidator)(properties.textTransformations));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.listValidator(CfnRuleGroup_TextTransformationPropertyValidator))(properties.textTransformations));
    return errors.wrap('supplied properties not correct for "SizeConstraintStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.SizeConstraintStatement` resource
 *
 * @param properties - the TypeScript properties of a `SizeConstraintStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.SizeConstraintStatement` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupSizeConstraintStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_SizeConstraintStatementPropertyValidator(properties).assertSuccess();
    return {
        ComparisonOperator: cdk.stringToCloudFormation(properties.comparisonOperator),
        FieldToMatch: cfnRuleGroupFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        Size: cdk.numberToCloudFormation(properties.size),
        TextTransformations: cdk.listMapper(cfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupSizeConstraintStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.SizeConstraintStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.SizeConstraintStatementProperty>();
    ret.addPropertyResult('comparisonOperator', 'ComparisonOperator', cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator));
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnRuleGroupFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('size', 'Size', cfn_parse.FromCloudFormation.getNumber(properties.Size));
    ret.addPropertyResult('textTransformations', 'TextTransformations', cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A rule statement that inspects for malicious SQL code. Attackers insert malicious SQL code into web requests to do things like modify your database or extract data from it.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sqlimatchstatement.html
     */
    export interface SqliMatchStatementProperty {
        /**
         * The part of the web request that you want AWS WAF to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sqlimatchstatement.html#cfn-wafv2-rulegroup-sqlimatchstatement-fieldtomatch
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sqlimatchstatement.html#cfn-wafv2-rulegroup-sqlimatchstatement-sensitivitylevel
         */
        readonly sensitivityLevel?: string;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-sqlimatchstatement.html#cfn-wafv2-rulegroup-sqlimatchstatement-texttransformations
         */
        readonly textTransformations: Array<CfnRuleGroup.TextTransformationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SqliMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `SqliMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_SqliMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnRuleGroup_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('sensitivityLevel', cdk.validateString)(properties.sensitivityLevel));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.requiredValidator)(properties.textTransformations));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.listValidator(CfnRuleGroup_TextTransformationPropertyValidator))(properties.textTransformations));
    return errors.wrap('supplied properties not correct for "SqliMatchStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.SqliMatchStatement` resource
 *
 * @param properties - the TypeScript properties of a `SqliMatchStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.SqliMatchStatement` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupSqliMatchStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_SqliMatchStatementPropertyValidator(properties).assertSuccess();
    return {
        FieldToMatch: cfnRuleGroupFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        SensitivityLevel: cdk.stringToCloudFormation(properties.sensitivityLevel),
        TextTransformations: cdk.listMapper(cfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupSqliMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.SqliMatchStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.SqliMatchStatementProperty>();
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnRuleGroupFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('sensitivityLevel', 'SensitivityLevel', properties.SensitivityLevel != null ? cfn_parse.FromCloudFormation.getString(properties.SensitivityLevel) : undefined);
    ret.addPropertyResult('textTransformations', 'TextTransformations', cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * The processing guidance for a rule, used by AWS WAF to determine whether a web request matches the rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html
     */
    export interface StatementProperty {
        /**
         * A logical rule statement used to combine other rule statements with AND logic. You provide more than one `Statement` within the `AndStatement` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-andstatement
         */
        readonly andStatement?: CfnRuleGroup.AndStatementProperty | cdk.IResolvable;
        /**
         * A rule statement that defines a string match search for AWS WAF to apply to web requests. The byte match statement provides the bytes to search for, the location in requests that you want AWS WAF to search, and other settings. The bytes to search for are typically a string that corresponds with ASCII characters. In the AWS WAF console and the developer guide, this is called a string match statement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-bytematchstatement
         */
        readonly byteMatchStatement?: CfnRuleGroup.ByteMatchStatementProperty | cdk.IResolvable;
        /**
         * A rule statement that labels web requests by country and region and that matches against web requests based on country code. A geo match rule labels every request that it inspects regardless of whether it finds a match.
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-geomatchstatement
         */
        readonly geoMatchStatement?: CfnRuleGroup.GeoMatchStatementProperty | cdk.IResolvable;
        /**
         * A rule statement used to detect web requests coming from particular IP addresses or address ranges. To use this, create an `IPSet` that specifies the addresses you want to detect, then use the ARN of that set in this statement.
         *
         * Each IP set rule statement references an IP set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-ipsetreferencestatement
         */
        readonly ipSetReferenceStatement?: CfnRuleGroup.IPSetReferenceStatementProperty | cdk.IResolvable;
        /**
         * A rule statement to match against labels that have been added to the web request by rules that have already run in the web ACL.
         *
         * The label match statement provides the label or namespace string to search for. The label string can represent a part or all of the fully qualified label name that had been added to the web request. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label. If you do not provide the fully qualified name in your label match string, AWS WAF performs the search for labels that were added in the same context as the label match statement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-labelmatchstatement
         */
        readonly labelMatchStatement?: CfnRuleGroup.LabelMatchStatementProperty | cdk.IResolvable;
        /**
         * A logical rule statement used to negate the results of another rule statement. You provide one `Statement` within the `NotStatement` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-notstatement
         */
        readonly notStatement?: CfnRuleGroup.NotStatementProperty | cdk.IResolvable;
        /**
         * A logical rule statement used to combine other rule statements with OR logic. You provide more than one `Statement` within the `OrStatement` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-orstatement
         */
        readonly orStatement?: CfnRuleGroup.OrStatementProperty | cdk.IResolvable;
        /**
         * A rate-based rule tracks the rate of requests for each originating IP address, and triggers the rule action when the rate exceeds a limit that you specify on the number of requests in any 5-minute time span. You can use this to put a temporary block on requests from an IP address that is sending excessive requests.
         *
         * AWS WAF tracks and manages web requests separately for each instance of a rate-based rule that you use. For example, if you provide the same rate-based rule settings in two web ACLs, each of the two rule statements represents a separate instance of the rate-based rule and gets its own tracking and management by AWS WAF . If you define a rate-based rule inside a rule group, and then use that rule group in multiple places, each use creates a separate instance of the rate-based rule that gets its own tracking and management by AWS WAF .
         *
         * When the rule action triggers, AWS WAF blocks additional requests from the IP address until the request rate falls below the limit.
         *
         * You can optionally nest another statement inside the rate-based statement, to narrow the scope of the rule so that it only counts requests that match the nested statement. For example, based on recent requests that you have seen from an attacker, you might create a rate-based rule with a nested AND rule statement that contains the following nested statements:
         *
         * - An IP match statement with an IP set that specified the address 192.0.2.44.
         * - A string match statement that searches in the User-Agent header for the string BadBot.
         *
         * In this rate-based rule, you also define a rate limit. For this example, the rate limit is 1,000. Requests that meet the criteria of both of the nested statements are counted. If the count exceeds 1,000 requests per five minutes, the rule action triggers. Requests that do not meet the criteria of both of the nested statements are not counted towards the rate limit and are not affected by this rule.
         *
         * You cannot nest a `RateBasedStatement` inside another statement, for example inside a `NotStatement` or `OrStatement` . You can define a `RateBasedStatement` inside a web ACL and inside a rule group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-ratebasedstatement
         */
        readonly rateBasedStatement?: CfnRuleGroup.RateBasedStatementProperty | cdk.IResolvable;
        /**
         * A rule statement used to search web request components for a match against a single regular expression.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-regexmatchstatement
         */
        readonly regexMatchStatement?: CfnRuleGroup.RegexMatchStatementProperty | cdk.IResolvable;
        /**
         * A rule statement used to search web request components for matches with regular expressions. To use this, create a `RegexPatternSet` that specifies the expressions that you want to detect, then use the ARN of that set in this statement. A web request matches the pattern set rule statement if the request component matches any of the patterns in the set.
         *
         * Each regex pattern set rule statement references a regex pattern set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-regexpatternsetreferencestatement
         */
        readonly regexPatternSetReferenceStatement?: CfnRuleGroup.RegexPatternSetReferenceStatementProperty | cdk.IResolvable;
        /**
         * A rule statement that compares a number of bytes against the size of a request component, using a comparison operator, such as greater than (>) or less than (<). For example, you can use a size constraint statement to look for query strings that are longer than 100 bytes.
         *
         * If you configure AWS WAF to inspect the request body, AWS WAF inspects only the first 8192 bytes (8 KB). If the request body for your web requests never exceeds 8192 bytes, you could use a size constraint statement to block requests that have a request body greater than 8192 bytes.
         *
         * If you choose URI for the value of Part of the request to filter on, the slash (/) in the URI counts as one character. For example, the URI `/logo.jpg` is nine characters long.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-sizeconstraintstatement
         */
        readonly sizeConstraintStatement?: CfnRuleGroup.SizeConstraintStatementProperty | cdk.IResolvable;
        /**
         * A rule statement that inspects for malicious SQL code. Attackers insert malicious SQL code into web requests to do things like modify your database or extract data from it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-sqlimatchstatement
         */
        readonly sqliMatchStatement?: CfnRuleGroup.SqliMatchStatementProperty | cdk.IResolvable;
        /**
         * A rule statement that inspects for cross-site scripting (XSS) attacks. In XSS attacks, the attacker uses vulnerabilities in a benign website as a vehicle to inject malicious client-site scripts into other legitimate web browsers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-statement.html#cfn-wafv2-rulegroup-statement-xssmatchstatement
         */
        readonly xssMatchStatement?: CfnRuleGroup.XssMatchStatementProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `StatementProperty`
 *
 * @param properties - the TypeScript properties of a `StatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_StatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('andStatement', CfnRuleGroup_AndStatementPropertyValidator)(properties.andStatement));
    errors.collect(cdk.propertyValidator('byteMatchStatement', CfnRuleGroup_ByteMatchStatementPropertyValidator)(properties.byteMatchStatement));
    errors.collect(cdk.propertyValidator('geoMatchStatement', CfnRuleGroup_GeoMatchStatementPropertyValidator)(properties.geoMatchStatement));
    errors.collect(cdk.propertyValidator('ipSetReferenceStatement', CfnRuleGroup_IPSetReferenceStatementPropertyValidator)(properties.ipSetReferenceStatement));
    errors.collect(cdk.propertyValidator('labelMatchStatement', CfnRuleGroup_LabelMatchStatementPropertyValidator)(properties.labelMatchStatement));
    errors.collect(cdk.propertyValidator('notStatement', CfnRuleGroup_NotStatementPropertyValidator)(properties.notStatement));
    errors.collect(cdk.propertyValidator('orStatement', CfnRuleGroup_OrStatementPropertyValidator)(properties.orStatement));
    errors.collect(cdk.propertyValidator('rateBasedStatement', CfnRuleGroup_RateBasedStatementPropertyValidator)(properties.rateBasedStatement));
    errors.collect(cdk.propertyValidator('regexMatchStatement', CfnRuleGroup_RegexMatchStatementPropertyValidator)(properties.regexMatchStatement));
    errors.collect(cdk.propertyValidator('regexPatternSetReferenceStatement', CfnRuleGroup_RegexPatternSetReferenceStatementPropertyValidator)(properties.regexPatternSetReferenceStatement));
    errors.collect(cdk.propertyValidator('sizeConstraintStatement', CfnRuleGroup_SizeConstraintStatementPropertyValidator)(properties.sizeConstraintStatement));
    errors.collect(cdk.propertyValidator('sqliMatchStatement', CfnRuleGroup_SqliMatchStatementPropertyValidator)(properties.sqliMatchStatement));
    errors.collect(cdk.propertyValidator('xssMatchStatement', CfnRuleGroup_XssMatchStatementPropertyValidator)(properties.xssMatchStatement));
    return errors.wrap('supplied properties not correct for "StatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Statement` resource
 *
 * @param properties - the TypeScript properties of a `StatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.Statement` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_StatementPropertyValidator(properties).assertSuccess();
    return {
        AndStatement: cfnRuleGroupAndStatementPropertyToCloudFormation(properties.andStatement),
        ByteMatchStatement: cfnRuleGroupByteMatchStatementPropertyToCloudFormation(properties.byteMatchStatement),
        GeoMatchStatement: cfnRuleGroupGeoMatchStatementPropertyToCloudFormation(properties.geoMatchStatement),
        IPSetReferenceStatement: cfnRuleGroupIPSetReferenceStatementPropertyToCloudFormation(properties.ipSetReferenceStatement),
        LabelMatchStatement: cfnRuleGroupLabelMatchStatementPropertyToCloudFormation(properties.labelMatchStatement),
        NotStatement: cfnRuleGroupNotStatementPropertyToCloudFormation(properties.notStatement),
        OrStatement: cfnRuleGroupOrStatementPropertyToCloudFormation(properties.orStatement),
        RateBasedStatement: cfnRuleGroupRateBasedStatementPropertyToCloudFormation(properties.rateBasedStatement),
        RegexMatchStatement: cfnRuleGroupRegexMatchStatementPropertyToCloudFormation(properties.regexMatchStatement),
        RegexPatternSetReferenceStatement: cfnRuleGroupRegexPatternSetReferenceStatementPropertyToCloudFormation(properties.regexPatternSetReferenceStatement),
        SizeConstraintStatement: cfnRuleGroupSizeConstraintStatementPropertyToCloudFormation(properties.sizeConstraintStatement),
        SqliMatchStatement: cfnRuleGroupSqliMatchStatementPropertyToCloudFormation(properties.sqliMatchStatement),
        XssMatchStatement: cfnRuleGroupXssMatchStatementPropertyToCloudFormation(properties.xssMatchStatement),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.StatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.StatementProperty>();
    ret.addPropertyResult('andStatement', 'AndStatement', properties.AndStatement != null ? CfnRuleGroupAndStatementPropertyFromCloudFormation(properties.AndStatement) : undefined);
    ret.addPropertyResult('byteMatchStatement', 'ByteMatchStatement', properties.ByteMatchStatement != null ? CfnRuleGroupByteMatchStatementPropertyFromCloudFormation(properties.ByteMatchStatement) : undefined);
    ret.addPropertyResult('geoMatchStatement', 'GeoMatchStatement', properties.GeoMatchStatement != null ? CfnRuleGroupGeoMatchStatementPropertyFromCloudFormation(properties.GeoMatchStatement) : undefined);
    ret.addPropertyResult('ipSetReferenceStatement', 'IPSetReferenceStatement', properties.IPSetReferenceStatement != null ? CfnRuleGroupIPSetReferenceStatementPropertyFromCloudFormation(properties.IPSetReferenceStatement) : undefined);
    ret.addPropertyResult('labelMatchStatement', 'LabelMatchStatement', properties.LabelMatchStatement != null ? CfnRuleGroupLabelMatchStatementPropertyFromCloudFormation(properties.LabelMatchStatement) : undefined);
    ret.addPropertyResult('notStatement', 'NotStatement', properties.NotStatement != null ? CfnRuleGroupNotStatementPropertyFromCloudFormation(properties.NotStatement) : undefined);
    ret.addPropertyResult('orStatement', 'OrStatement', properties.OrStatement != null ? CfnRuleGroupOrStatementPropertyFromCloudFormation(properties.OrStatement) : undefined);
    ret.addPropertyResult('rateBasedStatement', 'RateBasedStatement', properties.RateBasedStatement != null ? CfnRuleGroupRateBasedStatementPropertyFromCloudFormation(properties.RateBasedStatement) : undefined);
    ret.addPropertyResult('regexMatchStatement', 'RegexMatchStatement', properties.RegexMatchStatement != null ? CfnRuleGroupRegexMatchStatementPropertyFromCloudFormation(properties.RegexMatchStatement) : undefined);
    ret.addPropertyResult('regexPatternSetReferenceStatement', 'RegexPatternSetReferenceStatement', properties.RegexPatternSetReferenceStatement != null ? CfnRuleGroupRegexPatternSetReferenceStatementPropertyFromCloudFormation(properties.RegexPatternSetReferenceStatement) : undefined);
    ret.addPropertyResult('sizeConstraintStatement', 'SizeConstraintStatement', properties.SizeConstraintStatement != null ? CfnRuleGroupSizeConstraintStatementPropertyFromCloudFormation(properties.SizeConstraintStatement) : undefined);
    ret.addPropertyResult('sqliMatchStatement', 'SqliMatchStatement', properties.SqliMatchStatement != null ? CfnRuleGroupSqliMatchStatementPropertyFromCloudFormation(properties.SqliMatchStatement) : undefined);
    ret.addPropertyResult('xssMatchStatement', 'XssMatchStatement', properties.XssMatchStatement != null ? CfnRuleGroupXssMatchStatementPropertyFromCloudFormation(properties.XssMatchStatement) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-texttransformation.html
     */
    export interface TextTransformationProperty {
        /**
         * Sets the relative processing order for multiple transformations that are defined for a rule statement. AWS WAF processes all transformations, from lowest priority to highest, before inspecting the transformed content. The priorities don't need to be consecutive, but they must all be different.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-texttransformation.html#cfn-wafv2-rulegroup-texttransformation-priority
         */
        readonly priority: number;
        /**
         * You can specify the following transformation types:
         *
         * *BASE64_DECODE* - Decode a `Base64` -encoded string.
         *
         * *BASE64_DECODE_EXT* - Decode a `Base64` -encoded string, but use a forgiving implementation that ignores characters that aren't valid.
         *
         * *CMD_LINE* - Command-line transformations. These are helpful in reducing effectiveness of attackers who inject an operating system command-line command and use unusual formatting to disguise some or all of the command.
         *
         * - Delete the following characters: `\ " ' ^`
         * - Delete spaces before the following characters: `/ (`
         * - Replace the following characters with a space: `, ;`
         * - Replace multiple spaces with one space
         * - Convert uppercase letters (A-Z) to lowercase (a-z)
         *
         * *COMPRESS_WHITE_SPACE* - Replace these characters with a space character (decimal 32):
         *
         * - `\f` , formfeed, decimal 12
         * - `\t` , tab, decimal 9
         * - `\n` , newline, decimal 10
         * - `\r` , carriage return, decimal 13
         * - `\v` , vertical tab, decimal 11
         * - Non-breaking space, decimal 160
         *
         * `COMPRESS_WHITE_SPACE` also replaces multiple spaces with one space.
         *
         * *CSS_DECODE* - Decode characters that were encoded using CSS 2.x escape rules `syndata.html#characters` . This function uses up to two bytes in the decoding process, so it can help to uncover ASCII characters that were encoded using CSS encoding that wouldn’t typically be encoded. It's also useful in countering evasion, which is a combination of a backslash and non-hexadecimal characters. For example, `ja\vascript` for javascript.
         *
         * *ESCAPE_SEQ_DECODE* - Decode the following ANSI C escape sequences: `\a` , `\b` , `\f` , `\n` , `\r` , `\t` , `\v` , `\\` , `\?` , `\'` , `\"` , `\xHH` (hexadecimal), `\0OOO` (octal). Encodings that aren't valid remain in the output.
         *
         * *HEX_DECODE* - Decode a string of hexadecimal characters into a binary.
         *
         * *HTML_ENTITY_DECODE* - Replace HTML-encoded characters with unencoded characters. `HTML_ENTITY_DECODE` performs these operations:
         *
         * - Replaces `(ampersand)quot;` with `"`
         * - Replaces `(ampersand)nbsp;` with a non-breaking space, decimal 160
         * - Replaces `(ampersand)lt;` with a "less than" symbol
         * - Replaces `(ampersand)gt;` with `>`
         * - Replaces characters that are represented in hexadecimal format, `(ampersand)#xhhhh;` , with the corresponding characters
         * - Replaces characters that are represented in decimal format, `(ampersand)#nnnn;` , with the corresponding characters
         *
         * *JS_DECODE* - Decode JavaScript escape sequences. If a `\` `u` `HHHH` code is in the full-width ASCII code range of `FF01-FF5E` , then the higher byte is used to detect and adjust the lower byte. If not, only the lower byte is used and the higher byte is zeroed, causing a possible loss of information.
         *
         * *LOWERCASE* - Convert uppercase letters (A-Z) to lowercase (a-z).
         *
         * *MD5* - Calculate an MD5 hash from the data in the input. The computed hash is in a raw binary form.
         *
         * *NONE* - Specify `NONE` if you don't want any text transformations.
         *
         * *NORMALIZE_PATH* - Remove multiple slashes, directory self-references, and directory back-references that are not at the beginning of the input from an input string.
         *
         * *NORMALIZE_PATH_WIN* - This is the same as `NORMALIZE_PATH` , but first converts backslash characters to forward slashes.
         *
         * *REMOVE_NULLS* - Remove all `NULL` bytes from the input.
         *
         * *REPLACE_COMMENTS* - Replace each occurrence of a C-style comment ( `/* ... * /` ) with a single space. Multiple consecutive occurrences are not compressed. Unterminated comments are also replaced with a space (ASCII 0x20). However, a standalone termination of a comment ( `* /` ) is not acted upon.
         *
         * *REPLACE_NULLS* - Replace NULL bytes in the input with space characters (ASCII `0x20` ).
         *
         * *SQL_HEX_DECODE* - Decode SQL hex data. Example ( `0x414243` ) will be decoded to ( `ABC` ).
         *
         * *URL_DECODE* - Decode a URL-encoded value.
         *
         * *URL_DECODE_UNI* - Like `URL_DECODE` , but with support for Microsoft-specific `%u` encoding. If the code is in the full-width ASCII code range of `FF01-FF5E` , the higher byte is used to detect and adjust the lower byte. Otherwise, only the lower byte is used and the higher byte is zeroed.
         *
         * *UTF8_TO_UNICODE* - Convert all UTF-8 character sequences to Unicode. This helps input normalization, and minimizing false-positives and false-negatives for non-English languages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-texttransformation.html#cfn-wafv2-rulegroup-texttransformation-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `TextTransformationProperty`
 *
 * @param properties - the TypeScript properties of a `TextTransformationProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_TextTransformationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('priority', cdk.requiredValidator)(properties.priority));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "TextTransformationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.TextTransformation` resource
 *
 * @param properties - the TypeScript properties of a `TextTransformationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.TextTransformation` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupTextTransformationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_TextTransformationPropertyValidator(properties).assertSuccess();
    return {
        Priority: cdk.numberToCloudFormation(properties.priority),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupTextTransformationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.TextTransformationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.TextTransformationProperty>();
    ret.addPropertyResult('priority', 'Priority', cfn_parse.FromCloudFormation.getNumber(properties.Priority));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-visibilityconfig.html
     */
    export interface VisibilityConfigProperty {
        /**
         * A boolean indicating whether the associated resource sends metrics to Amazon CloudWatch. For the list of available metrics, see [AWS WAF Metrics](https://docs.aws.amazon.com/waf/latest/developerguide/monitoring-cloudwatch.html#waf-metrics) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-visibilityconfig.html#cfn-wafv2-rulegroup-visibilityconfig-cloudwatchmetricsenabled
         */
        readonly cloudWatchMetricsEnabled: boolean | cdk.IResolvable;
        /**
         * A name of the Amazon CloudWatch metric dimension. The name can contain only the characters: A-Z, a-z, 0-9, - (hyphen), and _ (underscore). The name can be from one to 128 characters long. It can't contain whitespace or metric names that are reserved for AWS WAF , for example `All` and `Default_Action` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-visibilityconfig.html#cfn-wafv2-rulegroup-visibilityconfig-metricname
         */
        readonly metricName: string;
        /**
         * A boolean indicating whether AWS WAF should store a sampling of the web requests that match the rules. You can view the sampled requests through the AWS WAF console.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-visibilityconfig.html#cfn-wafv2-rulegroup-visibilityconfig-sampledrequestsenabled
         */
        readonly sampledRequestsEnabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VisibilityConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VisibilityConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_VisibilityConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchMetricsEnabled', cdk.requiredValidator)(properties.cloudWatchMetricsEnabled));
    errors.collect(cdk.propertyValidator('cloudWatchMetricsEnabled', cdk.validateBoolean)(properties.cloudWatchMetricsEnabled));
    errors.collect(cdk.propertyValidator('metricName', cdk.requiredValidator)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('sampledRequestsEnabled', cdk.requiredValidator)(properties.sampledRequestsEnabled));
    errors.collect(cdk.propertyValidator('sampledRequestsEnabled', cdk.validateBoolean)(properties.sampledRequestsEnabled));
    return errors.wrap('supplied properties not correct for "VisibilityConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.VisibilityConfig` resource
 *
 * @param properties - the TypeScript properties of a `VisibilityConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.VisibilityConfig` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupVisibilityConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_VisibilityConfigPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchMetricsEnabled: cdk.booleanToCloudFormation(properties.cloudWatchMetricsEnabled),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        SampledRequestsEnabled: cdk.booleanToCloudFormation(properties.sampledRequestsEnabled),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupVisibilityConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.VisibilityConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.VisibilityConfigProperty>();
    ret.addPropertyResult('cloudWatchMetricsEnabled', 'CloudWatchMetricsEnabled', cfn_parse.FromCloudFormation.getBoolean(properties.CloudWatchMetricsEnabled));
    ret.addPropertyResult('metricName', 'MetricName', cfn_parse.FromCloudFormation.getString(properties.MetricName));
    ret.addPropertyResult('sampledRequestsEnabled', 'SampledRequestsEnabled', cfn_parse.FromCloudFormation.getBoolean(properties.SampledRequestsEnabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRuleGroup {
    /**
     * A rule statement that inspects for cross-site scripting (XSS) attacks. In XSS attacks, the attacker uses vulnerabilities in a benign website as a vehicle to inject malicious client-site scripts into other legitimate web browsers.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-xssmatchstatement.html
     */
    export interface XssMatchStatementProperty {
        /**
         * The part of the web request that you want AWS WAF to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-xssmatchstatement.html#cfn-wafv2-rulegroup-xssmatchstatement-fieldtomatch
         */
        readonly fieldToMatch: CfnRuleGroup.FieldToMatchProperty | cdk.IResolvable;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-rulegroup-xssmatchstatement.html#cfn-wafv2-rulegroup-xssmatchstatement-texttransformations
         */
        readonly textTransformations: Array<CfnRuleGroup.TextTransformationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `XssMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `XssMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroup_XssMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnRuleGroup_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.requiredValidator)(properties.textTransformations));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.listValidator(CfnRuleGroup_TextTransformationPropertyValidator))(properties.textTransformations));
    return errors.wrap('supplied properties not correct for "XssMatchStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.XssMatchStatement` resource
 *
 * @param properties - the TypeScript properties of a `XssMatchStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::RuleGroup.XssMatchStatement` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupXssMatchStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroup_XssMatchStatementPropertyValidator(properties).assertSuccess();
    return {
        FieldToMatch: cfnRuleGroupFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        TextTransformations: cdk.listMapper(cfnRuleGroupTextTransformationPropertyToCloudFormation)(properties.textTransformations),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupXssMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroup.XssMatchStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroup.XssMatchStatementProperty>();
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnRuleGroupFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('textTransformations', 'TextTransformations', cfn_parse.FromCloudFormation.getArray(CfnRuleGroupTextTransformationPropertyFromCloudFormation)(properties.TextTransformations));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnWebACL`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html
 */
export interface CfnWebACLProps {

    /**
     * The action to perform if none of the `Rules` contained in the `WebACL` match.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-defaultaction
     */
    readonly defaultAction: CfnWebACL.DefaultActionProperty | cdk.IResolvable;

    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AWS AppSync GraphQL API, or an Amazon Cognito user pool. Valid Values are `CLOUDFRONT` and `REGIONAL` .
     *
     * > For `CLOUDFRONT` , you must create your WAFv2 resources in the US East (N. Virginia) Region, `us-east-1` .
     *
     * For information about how to define the association of the web ACL with your resource, see `WebACLAssociation` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-scope
     */
    readonly scope: string;

    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-visibilityconfig
     */
    readonly visibilityConfig: CfnWebACL.VisibilityConfigProperty | cdk.IResolvable;

    /**
     * Specifies how AWS WAF should handle `CAPTCHA` evaluations for rules that don't have their own `CaptchaConfig` settings. If you don't specify this, AWS WAF uses its default settings for `CaptchaConfig` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-captchaconfig
     */
    readonly captchaConfig?: CfnWebACL.CaptchaConfigProperty | cdk.IResolvable;

    /**
     * Specifies how AWS WAF should handle challenge evaluations for rules that don't have their own `ChallengeConfig` settings. If you don't specify this, AWS WAF uses its default settings for `ChallengeConfig` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-challengeconfig
     */
    readonly challengeConfig?: CfnWebACL.ChallengeConfigProperty | cdk.IResolvable;

    /**
     * A map of custom response keys and content bodies. When you create a rule with a block action, you can send a custom response to the web request. You define these for the web ACL, and then use them in the rules and default actions that you define in the web ACL.
     *
     * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
     *
     * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-customresponsebodies
     */
    readonly customResponseBodies?: { [key: string]: (CfnWebACL.CustomResponseBodyProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * A description of the web ACL that helps with identification.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-description
     */
    readonly description?: string;

    /**
     * The name of the web ACL. You cannot change the name of a web ACL after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-name
     */
    readonly name?: string;

    /**
     * The rule statements used to identify the web requests that you want to allow, block, or count. Each rule includes one top-level statement that AWS WAF uses to identify matching web requests, and parameters that govern how AWS WAF handles them.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-rules
     */
    readonly rules?: Array<CfnWebACL.RuleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Key:value pairs associated with an AWS resource. The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
     *
     * > To modify tags on existing resources, use the AWS WAF APIs or command line interface. With AWS CloudFormation , you can only add tags to AWS WAF resources during resource creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * Specifies the domains that AWS WAF should accept in a web request token. This enables the use of tokens across multiple protected websites. When AWS WAF provides a token, it uses the domain of the AWS resource that the web ACL is protecting. If you don't specify a list of token domains, AWS WAF accepts tokens only for the domain of the protected resource. With a token domain list, AWS WAF accepts the resource's host domain plus all domains in the token domain list, including their prefixed subdomains.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-tokendomains
     */
    readonly tokenDomains?: string[];
}

/**
 * Determine whether the given properties match those of a `CfnWebACLProps`
 *
 * @param properties - the TypeScript properties of a `CfnWebACLProps`
 *
 * @returns the result of the validation.
 */
function CfnWebACLPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('captchaConfig', CfnWebACL_CaptchaConfigPropertyValidator)(properties.captchaConfig));
    errors.collect(cdk.propertyValidator('challengeConfig', CfnWebACL_ChallengeConfigPropertyValidator)(properties.challengeConfig));
    errors.collect(cdk.propertyValidator('customResponseBodies', cdk.hashValidator(CfnWebACL_CustomResponseBodyPropertyValidator))(properties.customResponseBodies));
    errors.collect(cdk.propertyValidator('defaultAction', cdk.requiredValidator)(properties.defaultAction));
    errors.collect(cdk.propertyValidator('defaultAction', CfnWebACL_DefaultActionPropertyValidator)(properties.defaultAction));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('rules', cdk.listValidator(CfnWebACL_RulePropertyValidator))(properties.rules));
    errors.collect(cdk.propertyValidator('scope', cdk.requiredValidator)(properties.scope));
    errors.collect(cdk.propertyValidator('scope', cdk.validateString)(properties.scope));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('tokenDomains', cdk.listValidator(cdk.validateString))(properties.tokenDomains));
    errors.collect(cdk.propertyValidator('visibilityConfig', cdk.requiredValidator)(properties.visibilityConfig));
    errors.collect(cdk.propertyValidator('visibilityConfig', CfnWebACL_VisibilityConfigPropertyValidator)(properties.visibilityConfig));
    return errors.wrap('supplied properties not correct for "CfnWebACLProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL` resource
 *
 * @param properties - the TypeScript properties of a `CfnWebACLProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL` resource.
 */
// @ts-ignore TS6133
function cfnWebACLPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACLPropsValidator(properties).assertSuccess();
    return {
        DefaultAction: cfnWebACLDefaultActionPropertyToCloudFormation(properties.defaultAction),
        Scope: cdk.stringToCloudFormation(properties.scope),
        VisibilityConfig: cfnWebACLVisibilityConfigPropertyToCloudFormation(properties.visibilityConfig),
        CaptchaConfig: cfnWebACLCaptchaConfigPropertyToCloudFormation(properties.captchaConfig),
        ChallengeConfig: cfnWebACLChallengeConfigPropertyToCloudFormation(properties.challengeConfig),
        CustomResponseBodies: cdk.hashMapper(cfnWebACLCustomResponseBodyPropertyToCloudFormation)(properties.customResponseBodies),
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        Rules: cdk.listMapper(cfnWebACLRulePropertyToCloudFormation)(properties.rules),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TokenDomains: cdk.listMapper(cdk.stringToCloudFormation)(properties.tokenDomains),
    };
}

// @ts-ignore TS6133
function CfnWebACLPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACLProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACLProps>();
    ret.addPropertyResult('defaultAction', 'DefaultAction', CfnWebACLDefaultActionPropertyFromCloudFormation(properties.DefaultAction));
    ret.addPropertyResult('scope', 'Scope', cfn_parse.FromCloudFormation.getString(properties.Scope));
    ret.addPropertyResult('visibilityConfig', 'VisibilityConfig', CfnWebACLVisibilityConfigPropertyFromCloudFormation(properties.VisibilityConfig));
    ret.addPropertyResult('captchaConfig', 'CaptchaConfig', properties.CaptchaConfig != null ? CfnWebACLCaptchaConfigPropertyFromCloudFormation(properties.CaptchaConfig) : undefined);
    ret.addPropertyResult('challengeConfig', 'ChallengeConfig', properties.ChallengeConfig != null ? CfnWebACLChallengeConfigPropertyFromCloudFormation(properties.ChallengeConfig) : undefined);
    ret.addPropertyResult('customResponseBodies', 'CustomResponseBodies', properties.CustomResponseBodies != null ? cfn_parse.FromCloudFormation.getMap(CfnWebACLCustomResponseBodyPropertyFromCloudFormation)(properties.CustomResponseBodies) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('rules', 'Rules', properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLRulePropertyFromCloudFormation)(properties.Rules) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('tokenDomains', 'TokenDomains', properties.TokenDomains != null ? cfn_parse.FromCloudFormation.getStringArray(properties.TokenDomains) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFv2::WebACL`
 *
 * > This is the latest version of *AWS WAF* , named AWS WAF V2, released in November, 2019. For information, including how to migrate your AWS WAF resources from the prior release, see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
 *
 * Use an `WebACL` to define a collection of rules to use to inspect and control web requests. Each rule has an action defined (allow, block, or count) for requests that match the statement of the rule. In the web ACL, you specify a default action to take (allow, block) for any request that doesn't match any of the rules. The rules in a web ACL can contain rule statements that you define explicitly and rule statements that reference rule groups and managed rule groups. You can associate a web ACL with one or more AWS resources to protect. The resources can be an Amazon CloudFront distribution, an Amazon API Gateway REST API, an Application Load Balancer , an AWS AppSync GraphQL API, or an Amazon Cognito user pool.
 *
 * @cloudformationResource AWS::WAFv2::WebACL
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html
 */
export class CfnWebACL extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFv2::WebACL";

    /**
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
        const ret = new CfnWebACL(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the web ACL.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The web ACL capacity units (WCUs) currently being used by this web ACL.
     *
     * AWS WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. AWS WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. The WCU limit for web ACLs is 1,500.
     * @cloudformationAttribute Capacity
     */
    public readonly attrCapacity: number;

    /**
     * The ID of the web ACL.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The label namespace prefix for this web ACL. All labels added by rules in this web ACL have this prefix.
     *
     * The syntax for the label namespace prefix for a web ACL is the following: `awswaf:<account ID>:webacl:<web ACL name>:`
     *
     * When a rule with a label matches a web request, AWS WAF adds the fully qualified label to the request. A fully qualified label is made up of the label namespace from the rule group or web ACL where the rule is defined and the label from the rule, separated by a colon.
     * @cloudformationAttribute LabelNamespace
     */
    public readonly attrLabelNamespace: string;

    /**
     * The action to perform if none of the `Rules` contained in the `WebACL` match.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-defaultaction
     */
    public defaultAction: CfnWebACL.DefaultActionProperty | cdk.IResolvable;

    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AWS AppSync GraphQL API, or an Amazon Cognito user pool. Valid Values are `CLOUDFRONT` and `REGIONAL` .
     *
     * > For `CLOUDFRONT` , you must create your WAFv2 resources in the US East (N. Virginia) Region, `us-east-1` .
     *
     * For information about how to define the association of the web ACL with your resource, see `WebACLAssociation` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-scope
     */
    public scope: string;

    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-visibilityconfig
     */
    public visibilityConfig: CfnWebACL.VisibilityConfigProperty | cdk.IResolvable;

    /**
     * Specifies how AWS WAF should handle `CAPTCHA` evaluations for rules that don't have their own `CaptchaConfig` settings. If you don't specify this, AWS WAF uses its default settings for `CaptchaConfig` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-captchaconfig
     */
    public captchaConfig: CfnWebACL.CaptchaConfigProperty | cdk.IResolvable | undefined;

    /**
     * Specifies how AWS WAF should handle challenge evaluations for rules that don't have their own `ChallengeConfig` settings. If you don't specify this, AWS WAF uses its default settings for `ChallengeConfig` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-challengeconfig
     */
    public challengeConfig: CfnWebACL.ChallengeConfigProperty | cdk.IResolvable | undefined;

    /**
     * A map of custom response keys and content bodies. When you create a rule with a block action, you can send a custom response to the web request. You define these for the web ACL, and then use them in the rules and default actions that you define in the web ACL.
     *
     * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
     *
     * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-customresponsebodies
     */
    public customResponseBodies: { [key: string]: (CfnWebACL.CustomResponseBodyProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * A description of the web ACL that helps with identification.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-description
     */
    public description: string | undefined;

    /**
     * The name of the web ACL. You cannot change the name of a web ACL after you create it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-name
     */
    public name: string | undefined;

    /**
     * The rule statements used to identify the web requests that you want to allow, block, or count. Each rule includes one top-level statement that AWS WAF uses to identify matching web requests, and parameters that govern how AWS WAF handles them.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-rules
     */
    public rules: Array<CfnWebACL.RuleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Key:value pairs associated with an AWS resource. The key:value pair can be anything you define. Typically, the tag key represents a category (such as "environment") and the tag value represents a specific value within that category (such as "test," "development," or "production"). You can add up to 50 tags to each AWS resource.
     *
     * > To modify tags on existing resources, use the AWS WAF APIs or command line interface. With AWS CloudFormation , you can only add tags to AWS WAF resources during resource creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Specifies the domains that AWS WAF should accept in a web request token. This enables the use of tokens across multiple protected websites. When AWS WAF provides a token, it uses the domain of the AWS resource that the web ACL is protecting. If you don't specify a list of token domains, AWS WAF accepts tokens only for the domain of the protected resource. With a token domain list, AWS WAF accepts the resource's host domain plus all domains in the token domain list, including their prefixed subdomains.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html#cfn-wafv2-webacl-tokendomains
     */
    public tokenDomains: string[] | undefined;

    /**
     * Create a new `AWS::WAFv2::WebACL`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWebACLProps) {
        super(scope, id, { type: CfnWebACL.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'defaultAction', this);
        cdk.requireProperty(props, 'scope', this);
        cdk.requireProperty(props, 'visibilityConfig', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCapacity = cdk.Token.asNumber(this.getAtt('Capacity', cdk.ResolutionTypeHint.NUMBER));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrLabelNamespace = cdk.Token.asString(this.getAtt('LabelNamespace', cdk.ResolutionTypeHint.STRING));

        this.defaultAction = props.defaultAction;
        this.scope = props.scope;
        this.visibilityConfig = props.visibilityConfig;
        this.captchaConfig = props.captchaConfig;
        this.challengeConfig = props.challengeConfig;
        this.customResponseBodies = props.customResponseBodies;
        this.description = props.description;
        this.name = props.name;
        this.rules = props.rules;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::WAFv2::WebACL", props.tags, { tagPropertyName: 'tags' });
        this.tokenDomains = props.tokenDomains;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnWebACL.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            defaultAction: this.defaultAction,
            scope: this.scope,
            visibilityConfig: this.visibilityConfig,
            captchaConfig: this.captchaConfig,
            challengeConfig: this.challengeConfig,
            customResponseBodies: this.customResponseBodies,
            description: this.description,
            name: this.name,
            rules: this.rules,
            tags: this.tags.renderTags(),
            tokenDomains: this.tokenDomains,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnWebACLPropsToCloudFormation(props);
    }
}

export namespace CfnWebACL {
    /**
     * Details for your use of the Bot Control managed rule group, used in `ManagedRuleGroupConfig` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesbotcontrolruleset.html
     */
    export interface AWSManagedRulesBotControlRuleSetProperty {
        /**
         * The inspection level to use for the Bot Control rule group. The common level is the least expensive. The targeted level includes all common level rules and adds rules with more advanced inspection criteria. For details, see [AWS WAF Bot Control rule group](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-bot.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-awsmanagedrulesbotcontrolruleset.html#cfn-wafv2-webacl-awsmanagedrulesbotcontrolruleset-inspectionlevel
         */
        readonly inspectionLevel: string;
    }
}

/**
 * Determine whether the given properties match those of a `AWSManagedRulesBotControlRuleSetProperty`
 *
 * @param properties - the TypeScript properties of a `AWSManagedRulesBotControlRuleSetProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_AWSManagedRulesBotControlRuleSetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('inspectionLevel', cdk.requiredValidator)(properties.inspectionLevel));
    errors.collect(cdk.propertyValidator('inspectionLevel', cdk.validateString)(properties.inspectionLevel));
    return errors.wrap('supplied properties not correct for "AWSManagedRulesBotControlRuleSetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.AWSManagedRulesBotControlRuleSet` resource
 *
 * @param properties - the TypeScript properties of a `AWSManagedRulesBotControlRuleSetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.AWSManagedRulesBotControlRuleSet` resource.
 */
// @ts-ignore TS6133
function cfnWebACLAWSManagedRulesBotControlRuleSetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_AWSManagedRulesBotControlRuleSetPropertyValidator(properties).assertSuccess();
    return {
        InspectionLevel: cdk.stringToCloudFormation(properties.inspectionLevel),
    };
}

// @ts-ignore TS6133
function CfnWebACLAWSManagedRulesBotControlRuleSetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.AWSManagedRulesBotControlRuleSetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.AWSManagedRulesBotControlRuleSetProperty>();
    ret.addPropertyResult('inspectionLevel', 'InspectionLevel', cfn_parse.FromCloudFormation.getString(properties.InspectionLevel));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Specifies that AWS WAF should allow the request and optionally defines additional custom handling for the request.
     *
     * This is used in the context of other settings, for example to specify values for a rule action or a web ACL default action.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-allowaction.html
     */
    export interface AllowActionProperty {
        /**
         * Defines custom handling for the web request.
         *
         * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-allowaction.html#cfn-wafv2-webacl-allowaction-customrequesthandling
         */
        readonly customRequestHandling?: CfnWebACL.CustomRequestHandlingProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AllowActionProperty`
 *
 * @param properties - the TypeScript properties of a `AllowActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_AllowActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customRequestHandling', CfnWebACL_CustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
    return errors.wrap('supplied properties not correct for "AllowActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.AllowAction` resource
 *
 * @param properties - the TypeScript properties of a `AllowActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.AllowAction` resource.
 */
// @ts-ignore TS6133
function cfnWebACLAllowActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_AllowActionPropertyValidator(properties).assertSuccess();
    return {
        CustomRequestHandling: cfnWebACLCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling),
    };
}

// @ts-ignore TS6133
function CfnWebACLAllowActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.AllowActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.AllowActionProperty>();
    ret.addPropertyResult('customRequestHandling', 'CustomRequestHandling', properties.CustomRequestHandling != null ? CfnWebACLCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A logical rule statement used to combine other rule statements with AND logic. You provide more than one `Statement` within the `AndStatement` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-andstatement.html
     */
    export interface AndStatementProperty {
        /**
         * The statements to combine with AND logic. You can use any statements that can be nested.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-andstatement.html#cfn-wafv2-webacl-andstatement-statements
         */
        readonly statements: Array<CfnWebACL.StatementProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AndStatementProperty`
 *
 * @param properties - the TypeScript properties of a `AndStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_AndStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('statements', cdk.requiredValidator)(properties.statements));
    errors.collect(cdk.propertyValidator('statements', cdk.listValidator(CfnWebACL_StatementPropertyValidator))(properties.statements));
    return errors.wrap('supplied properties not correct for "AndStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.AndStatement` resource
 *
 * @param properties - the TypeScript properties of a `AndStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.AndStatement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLAndStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_AndStatementPropertyValidator(properties).assertSuccess();
    return {
        Statements: cdk.listMapper(cfnWebACLStatementPropertyToCloudFormation)(properties.statements),
    };
}

// @ts-ignore TS6133
function CfnWebACLAndStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.AndStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.AndStatementProperty>();
    ret.addPropertyResult('statements', 'Statements', cfn_parse.FromCloudFormation.getArray(CfnWebACLStatementPropertyFromCloudFormation)(properties.Statements));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Specifies that AWS WAF should block the request and optionally defines additional custom handling for the response to the web request.
     *
     * This is used in the context of other settings, for example to specify values for a rule action or a web ACL default action.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-blockaction.html
     */
    export interface BlockActionProperty {
        /**
         * Defines a custom response for the web request.
         *
         * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-blockaction.html#cfn-wafv2-webacl-blockaction-customresponse
         */
        readonly customResponse?: CfnWebACL.CustomResponseProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `BlockActionProperty`
 *
 * @param properties - the TypeScript properties of a `BlockActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_BlockActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customResponse', CfnWebACL_CustomResponsePropertyValidator)(properties.customResponse));
    return errors.wrap('supplied properties not correct for "BlockActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.BlockAction` resource
 *
 * @param properties - the TypeScript properties of a `BlockActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.BlockAction` resource.
 */
// @ts-ignore TS6133
function cfnWebACLBlockActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_BlockActionPropertyValidator(properties).assertSuccess();
    return {
        CustomResponse: cfnWebACLCustomResponsePropertyToCloudFormation(properties.customResponse),
    };
}

// @ts-ignore TS6133
function CfnWebACLBlockActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.BlockActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.BlockActionProperty>();
    ret.addPropertyResult('customResponse', 'CustomResponse', properties.CustomResponse != null ? CfnWebACLCustomResponsePropertyFromCloudFormation(properties.CustomResponse) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Inspect the body of the web request. The body immediately follows the request headers.
     *
     * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-body.html
     */
    export interface BodyProperty {
        /**
         * What AWS WAF should do if the body is larger than AWS WAF can inspect. AWS WAF does not support inspecting the entire contents of the body of a web request when the body exceeds 8 KB (8192 bytes). Only the first 8 KB of the request body are forwarded to AWS WAF by the underlying host service.
         *
         * The options for oversize handling are the following:
         *
         * - `CONTINUE` - Inspect the body normally, according to the rule inspection criteria.
         * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
         * - `NO_MATCH` - Treat the web request as not matching the rule statement.
         *
         * You can combine the `MATCH` or `NO_MATCH` settings for oversize handling with your rule and web ACL action settings, so that you block any request whose body is over 8 KB.
         *
         * Default: `CONTINUE`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-body.html#cfn-wafv2-webacl-body-oversizehandling
         */
        readonly oversizeHandling?: string;
    }
}

/**
 * Determine whether the given properties match those of a `BodyProperty`
 *
 * @param properties - the TypeScript properties of a `BodyProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_BodyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('oversizeHandling', cdk.validateString)(properties.oversizeHandling));
    return errors.wrap('supplied properties not correct for "BodyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.Body` resource
 *
 * @param properties - the TypeScript properties of a `BodyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.Body` resource.
 */
// @ts-ignore TS6133
function cfnWebACLBodyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_BodyPropertyValidator(properties).assertSuccess();
    return {
        OversizeHandling: cdk.stringToCloudFormation(properties.oversizeHandling),
    };
}

// @ts-ignore TS6133
function CfnWebACLBodyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.BodyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.BodyProperty>();
    ret.addPropertyResult('oversizeHandling', 'OversizeHandling', properties.OversizeHandling != null ? cfn_parse.FromCloudFormation.getString(properties.OversizeHandling) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A rule statement that defines a string match search for AWS WAF to apply to web requests. The byte match statement provides the bytes to search for, the location in requests that you want AWS WAF to search, and other settings. The bytes to search for are typically a string that corresponds with ASCII characters. In the AWS WAF console and the developer guide, this is called a string match statement.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-bytematchstatement.html
     */
    export interface ByteMatchStatementProperty {
        /**
         * The part of the web request that you want AWS WAF to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-bytematchstatement.html#cfn-wafv2-webacl-bytematchstatement-fieldtomatch
         */
        readonly fieldToMatch: CfnWebACL.FieldToMatchProperty | cdk.IResolvable;
        /**
         * The area within the portion of the web request that you want AWS WAF to search for `SearchString` . Valid values include the following:
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-bytematchstatement.html#cfn-wafv2-webacl-bytematchstatement-positionalconstraint
         */
        readonly positionalConstraint: string;
        /**
         * A string value that you want AWS WAF to search for. AWS WAF searches only in the part of web requests that you designate for inspection in `FieldToMatch` . The maximum length of the value is 200 bytes. For alphabetic characters A-Z and a-z, the value is case sensitive.
         *
         * Don't encode this string. Provide the value that you want AWS WAF to search for. AWS CloudFormation automatically base64 encodes the value for you.
         *
         * For example, suppose the value of `Type` is `HEADER` and the value of `Data` is `User-Agent` . If you want to search the `User-Agent` header for the value `BadBot` , you provide the string `BadBot` in the value of `SearchString` .
         *
         * You must specify either `SearchString` or `SearchStringBase64` in a `ByteMatchStatement` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-bytematchstatement.html#cfn-wafv2-webacl-bytematchstatement-searchstring
         */
        readonly searchString?: string;
        /**
         * String to search for in a web request component, base64-encoded. If you don't want to encode the string, specify the unencoded value in `SearchString` instead.
         *
         * You must specify either `SearchString` or `SearchStringBase64` in a `ByteMatchStatement` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-bytematchstatement.html#cfn-wafv2-webacl-bytematchstatement-searchstringbase64
         */
        readonly searchStringBase64?: string;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-bytematchstatement.html#cfn-wafv2-webacl-bytematchstatement-texttransformations
         */
        readonly textTransformations: Array<CfnWebACL.TextTransformationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ByteMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `ByteMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_ByteMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnWebACL_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('positionalConstraint', cdk.requiredValidator)(properties.positionalConstraint));
    errors.collect(cdk.propertyValidator('positionalConstraint', cdk.validateString)(properties.positionalConstraint));
    errors.collect(cdk.propertyValidator('searchString', cdk.validateString)(properties.searchString));
    errors.collect(cdk.propertyValidator('searchStringBase64', cdk.validateString)(properties.searchStringBase64));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.requiredValidator)(properties.textTransformations));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.listValidator(CfnWebACL_TextTransformationPropertyValidator))(properties.textTransformations));
    return errors.wrap('supplied properties not correct for "ByteMatchStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ByteMatchStatement` resource
 *
 * @param properties - the TypeScript properties of a `ByteMatchStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ByteMatchStatement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLByteMatchStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_ByteMatchStatementPropertyValidator(properties).assertSuccess();
    return {
        FieldToMatch: cfnWebACLFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        PositionalConstraint: cdk.stringToCloudFormation(properties.positionalConstraint),
        SearchString: cdk.stringToCloudFormation(properties.searchString),
        SearchStringBase64: cdk.stringToCloudFormation(properties.searchStringBase64),
        TextTransformations: cdk.listMapper(cfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations),
    };
}

// @ts-ignore TS6133
function CfnWebACLByteMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ByteMatchStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ByteMatchStatementProperty>();
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnWebACLFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('positionalConstraint', 'PositionalConstraint', cfn_parse.FromCloudFormation.getString(properties.PositionalConstraint));
    ret.addPropertyResult('searchString', 'SearchString', properties.SearchString != null ? cfn_parse.FromCloudFormation.getString(properties.SearchString) : undefined);
    ret.addPropertyResult('searchStringBase64', 'SearchStringBase64', properties.SearchStringBase64 != null ? cfn_parse.FromCloudFormation.getString(properties.SearchStringBase64) : undefined);
    ret.addPropertyResult('textTransformations', 'TextTransformations', cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Specifies that AWS WAF should run a `CAPTCHA` check against the request:
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-captchaaction.html
     */
    export interface CaptchaActionProperty {
        /**
         * Defines custom handling for the web request, used when the `CAPTCHA` inspection determines that the request's token is valid and unexpired.
         *
         * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-captchaaction.html#cfn-wafv2-webacl-captchaaction-customrequesthandling
         */
        readonly customRequestHandling?: CfnWebACL.CustomRequestHandlingProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CaptchaActionProperty`
 *
 * @param properties - the TypeScript properties of a `CaptchaActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_CaptchaActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customRequestHandling', CfnWebACL_CustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
    return errors.wrap('supplied properties not correct for "CaptchaActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CaptchaAction` resource
 *
 * @param properties - the TypeScript properties of a `CaptchaActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CaptchaAction` resource.
 */
// @ts-ignore TS6133
function cfnWebACLCaptchaActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_CaptchaActionPropertyValidator(properties).assertSuccess();
    return {
        CustomRequestHandling: cfnWebACLCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling),
    };
}

// @ts-ignore TS6133
function CfnWebACLCaptchaActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CaptchaActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CaptchaActionProperty>();
    ret.addPropertyResult('customRequestHandling', 'CustomRequestHandling', properties.CustomRequestHandling != null ? CfnWebACLCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Specifies how AWS WAF should handle `CAPTCHA` evaluations for rules that don't have their own `CaptchaConfig` settings. If you don't specify this, AWS WAF uses its default settings for `CaptchaConfig` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-captchaconfig.html
     */
    export interface CaptchaConfigProperty {
        /**
         * Determines how long a `CAPTCHA` timestamp in the token remains valid after the client successfully solves a `CAPTCHA` puzzle.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-captchaconfig.html#cfn-wafv2-webacl-captchaconfig-immunitytimeproperty
         */
        readonly immunityTimeProperty?: CfnWebACL.ImmunityTimePropertyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CaptchaConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CaptchaConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_CaptchaConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('immunityTimeProperty', CfnWebACL_ImmunityTimePropertyPropertyValidator)(properties.immunityTimeProperty));
    return errors.wrap('supplied properties not correct for "CaptchaConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CaptchaConfig` resource
 *
 * @param properties - the TypeScript properties of a `CaptchaConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CaptchaConfig` resource.
 */
// @ts-ignore TS6133
function cfnWebACLCaptchaConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_CaptchaConfigPropertyValidator(properties).assertSuccess();
    return {
        ImmunityTimeProperty: cfnWebACLImmunityTimePropertyPropertyToCloudFormation(properties.immunityTimeProperty),
    };
}

// @ts-ignore TS6133
function CfnWebACLCaptchaConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CaptchaConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CaptchaConfigProperty>();
    ret.addPropertyResult('immunityTimeProperty', 'ImmunityTimeProperty', properties.ImmunityTimeProperty != null ? CfnWebACLImmunityTimePropertyPropertyFromCloudFormation(properties.ImmunityTimeProperty) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Specifies that AWS WAF should run a `Challenge` check against the request to verify that the request is coming from a legitimate client session:
     *
     * - If the request includes a valid, unexpired challenge token, AWS WAF applies any custom request handling and labels that you've configured and then allows the web request inspection to proceed to the next rule, similar to a `CountAction` .
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-challengeaction.html
     */
    export interface ChallengeActionProperty {
        /**
         * Defines custom handling for the web request, used when the challenge inspection determines that the request's token is valid and unexpired.
         *
         * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-challengeaction.html#cfn-wafv2-webacl-challengeaction-customrequesthandling
         */
        readonly customRequestHandling?: CfnWebACL.CustomRequestHandlingProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ChallengeActionProperty`
 *
 * @param properties - the TypeScript properties of a `ChallengeActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_ChallengeActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customRequestHandling', CfnWebACL_CustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
    return errors.wrap('supplied properties not correct for "ChallengeActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ChallengeAction` resource
 *
 * @param properties - the TypeScript properties of a `ChallengeActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ChallengeAction` resource.
 */
// @ts-ignore TS6133
function cfnWebACLChallengeActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_ChallengeActionPropertyValidator(properties).assertSuccess();
    return {
        CustomRequestHandling: cfnWebACLCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling),
    };
}

// @ts-ignore TS6133
function CfnWebACLChallengeActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ChallengeActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ChallengeActionProperty>();
    ret.addPropertyResult('customRequestHandling', 'CustomRequestHandling', properties.CustomRequestHandling != null ? CfnWebACLCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Specifies how AWS WAF should handle `Challenge` evaluations. This is available at the web ACL level and in each rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-challengeconfig.html
     */
    export interface ChallengeConfigProperty {
        /**
         * Determines how long a challenge timestamp in the token remains valid after the client successfully responds to a challenge.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-challengeconfig.html#cfn-wafv2-webacl-challengeconfig-immunitytimeproperty
         */
        readonly immunityTimeProperty?: CfnWebACL.ImmunityTimePropertyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ChallengeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ChallengeConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_ChallengeConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('immunityTimeProperty', CfnWebACL_ImmunityTimePropertyPropertyValidator)(properties.immunityTimeProperty));
    return errors.wrap('supplied properties not correct for "ChallengeConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ChallengeConfig` resource
 *
 * @param properties - the TypeScript properties of a `ChallengeConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ChallengeConfig` resource.
 */
// @ts-ignore TS6133
function cfnWebACLChallengeConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_ChallengeConfigPropertyValidator(properties).assertSuccess();
    return {
        ImmunityTimeProperty: cfnWebACLImmunityTimePropertyPropertyToCloudFormation(properties.immunityTimeProperty),
    };
}

// @ts-ignore TS6133
function CfnWebACLChallengeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ChallengeConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ChallengeConfigProperty>();
    ret.addPropertyResult('immunityTimeProperty', 'ImmunityTimeProperty', properties.ImmunityTimeProperty != null ? CfnWebACLImmunityTimePropertyPropertyFromCloudFormation(properties.ImmunityTimeProperty) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * The filter to use to identify the subset of cookies to inspect in a web request.
     *
     * You must specify exactly one setting: either `All` , `IncludedCookies` , or `ExcludedCookies` .
     *
     * Example JSON: `"MatchPattern": { "IncludedCookies": {"KeyToInclude1", "KeyToInclude2", "KeyToInclude3"} }`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookiematchpattern.html
     */
    export interface CookieMatchPatternProperty {
        /**
         * Inspect all cookies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookiematchpattern.html#cfn-wafv2-webacl-cookiematchpattern-all
         */
        readonly all?: any | cdk.IResolvable;
        /**
         * Inspect only the cookies whose keys don't match any of the strings specified here.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookiematchpattern.html#cfn-wafv2-webacl-cookiematchpattern-excludedcookies
         */
        readonly excludedCookies?: string[];
        /**
         * Inspect only the cookies that have a key that matches one of the strings specified here.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookiematchpattern.html#cfn-wafv2-webacl-cookiematchpattern-includedcookies
         */
        readonly includedCookies?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `CookieMatchPatternProperty`
 *
 * @param properties - the TypeScript properties of a `CookieMatchPatternProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_CookieMatchPatternPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('all', cdk.validateObject)(properties.all));
    errors.collect(cdk.propertyValidator('excludedCookies', cdk.listValidator(cdk.validateString))(properties.excludedCookies));
    errors.collect(cdk.propertyValidator('includedCookies', cdk.listValidator(cdk.validateString))(properties.includedCookies));
    return errors.wrap('supplied properties not correct for "CookieMatchPatternProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CookieMatchPattern` resource
 *
 * @param properties - the TypeScript properties of a `CookieMatchPatternProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CookieMatchPattern` resource.
 */
// @ts-ignore TS6133
function cfnWebACLCookieMatchPatternPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_CookieMatchPatternPropertyValidator(properties).assertSuccess();
    return {
        All: cdk.objectToCloudFormation(properties.all),
        ExcludedCookies: cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedCookies),
        IncludedCookies: cdk.listMapper(cdk.stringToCloudFormation)(properties.includedCookies),
    };
}

// @ts-ignore TS6133
function CfnWebACLCookieMatchPatternPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CookieMatchPatternProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CookieMatchPatternProperty>();
    ret.addPropertyResult('all', 'All', properties.All != null ? cfn_parse.FromCloudFormation.getAny(properties.All) : undefined);
    ret.addPropertyResult('excludedCookies', 'ExcludedCookies', properties.ExcludedCookies != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExcludedCookies) : undefined);
    ret.addPropertyResult('includedCookies', 'IncludedCookies', properties.IncludedCookies != null ? cfn_parse.FromCloudFormation.getStringArray(properties.IncludedCookies) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Inspect the cookies in the web request. You can specify the parts of the cookies to inspect and you can narrow the set of cookies to inspect by including or excluding specific keys.
     *
     * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
     *
     * Example JSON: `"Cookies": { "MatchPattern": { "All": {} }, "MatchScope": "KEY", "OversizeHandling": "MATCH" }`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookies.html
     */
    export interface CookiesProperty {
        /**
         * The filter to use to identify the subset of cookies to inspect in a web request.
         *
         * You must specify exactly one setting: either `All` , `IncludedCookies` , or `ExcludedCookies` .
         *
         * Example JSON: `"MatchPattern": { "IncludedCookies": {"KeyToInclude1", "KeyToInclude2", "KeyToInclude3"} }`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookies.html#cfn-wafv2-webacl-cookies-matchpattern
         */
        readonly matchPattern: CfnWebACL.CookieMatchPatternProperty | cdk.IResolvable;
        /**
         * The parts of the cookies to inspect with the rule inspection criteria. If you specify `All` , AWS WAF inspects both keys and values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookies.html#cfn-wafv2-webacl-cookies-matchscope
         */
        readonly matchScope: string;
        /**
         * What AWS WAF should do if the cookies of the request are larger than AWS WAF can inspect. AWS WAF does not support inspecting the entire contents of request cookies when they exceed 8 KB (8192 bytes) or 200 total cookies. The underlying host service forwards a maximum of 200 cookies and at most 8 KB of cookie contents to AWS WAF .
         *
         * The options for oversize handling are the following:
         *
         * - `CONTINUE` - Inspect the cookies normally, according to the rule inspection criteria.
         * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
         * - `NO_MATCH` - Treat the web request as not matching the rule statement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-cookies.html#cfn-wafv2-webacl-cookies-oversizehandling
         */
        readonly oversizeHandling: string;
    }
}

/**
 * Determine whether the given properties match those of a `CookiesProperty`
 *
 * @param properties - the TypeScript properties of a `CookiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_CookiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('matchPattern', cdk.requiredValidator)(properties.matchPattern));
    errors.collect(cdk.propertyValidator('matchPattern', CfnWebACL_CookieMatchPatternPropertyValidator)(properties.matchPattern));
    errors.collect(cdk.propertyValidator('matchScope', cdk.requiredValidator)(properties.matchScope));
    errors.collect(cdk.propertyValidator('matchScope', cdk.validateString)(properties.matchScope));
    errors.collect(cdk.propertyValidator('oversizeHandling', cdk.requiredValidator)(properties.oversizeHandling));
    errors.collect(cdk.propertyValidator('oversizeHandling', cdk.validateString)(properties.oversizeHandling));
    return errors.wrap('supplied properties not correct for "CookiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.Cookies` resource
 *
 * @param properties - the TypeScript properties of a `CookiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.Cookies` resource.
 */
// @ts-ignore TS6133
function cfnWebACLCookiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_CookiesPropertyValidator(properties).assertSuccess();
    return {
        MatchPattern: cfnWebACLCookieMatchPatternPropertyToCloudFormation(properties.matchPattern),
        MatchScope: cdk.stringToCloudFormation(properties.matchScope),
        OversizeHandling: cdk.stringToCloudFormation(properties.oversizeHandling),
    };
}

// @ts-ignore TS6133
function CfnWebACLCookiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CookiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CookiesProperty>();
    ret.addPropertyResult('matchPattern', 'MatchPattern', CfnWebACLCookieMatchPatternPropertyFromCloudFormation(properties.MatchPattern));
    ret.addPropertyResult('matchScope', 'MatchScope', cfn_parse.FromCloudFormation.getString(properties.MatchScope));
    ret.addPropertyResult('oversizeHandling', 'OversizeHandling', cfn_parse.FromCloudFormation.getString(properties.OversizeHandling));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Specifies that AWS WAF should count the request. Optionally defines additional custom handling for the request.
     *
     * This is used in the context of other settings, for example to specify values for a rule action or a web ACL default action.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-countaction.html
     */
    export interface CountActionProperty {
        /**
         * Defines custom handling for the web request.
         *
         * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-countaction.html#cfn-wafv2-webacl-countaction-customrequesthandling
         */
        readonly customRequestHandling?: CfnWebACL.CustomRequestHandlingProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CountActionProperty`
 *
 * @param properties - the TypeScript properties of a `CountActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_CountActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customRequestHandling', CfnWebACL_CustomRequestHandlingPropertyValidator)(properties.customRequestHandling));
    return errors.wrap('supplied properties not correct for "CountActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CountAction` resource
 *
 * @param properties - the TypeScript properties of a `CountActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CountAction` resource.
 */
// @ts-ignore TS6133
function cfnWebACLCountActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_CountActionPropertyValidator(properties).assertSuccess();
    return {
        CustomRequestHandling: cfnWebACLCustomRequestHandlingPropertyToCloudFormation(properties.customRequestHandling),
    };
}

// @ts-ignore TS6133
function CfnWebACLCountActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CountActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CountActionProperty>();
    ret.addPropertyResult('customRequestHandling', 'CustomRequestHandling', properties.CustomRequestHandling != null ? CfnWebACLCustomRequestHandlingPropertyFromCloudFormation(properties.CustomRequestHandling) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A custom header for custom request and response handling. This is used in `CustomResponse` and `CustomRequestHandling` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customhttpheader.html
     */
    export interface CustomHTTPHeaderProperty {
        /**
         * The name of the custom header.
         *
         * For custom request header insertion, when AWS WAF inserts the header into the request, it prefixes this name `x-amzn-waf-` , to avoid confusion with the headers that are already in the request. For example, for the header name `sample` , AWS WAF inserts the header `x-amzn-waf-sample` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customhttpheader.html#cfn-wafv2-webacl-customhttpheader-name
         */
        readonly name: string;
        /**
         * The value of the custom header.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customhttpheader.html#cfn-wafv2-webacl-customhttpheader-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomHTTPHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `CustomHTTPHeaderProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_CustomHTTPHeaderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "CustomHTTPHeaderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CustomHTTPHeader` resource
 *
 * @param properties - the TypeScript properties of a `CustomHTTPHeaderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CustomHTTPHeader` resource.
 */
// @ts-ignore TS6133
function cfnWebACLCustomHTTPHeaderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_CustomHTTPHeaderPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnWebACLCustomHTTPHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CustomHTTPHeaderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CustomHTTPHeaderProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Custom request handling behavior that inserts custom headers into a web request. You can add custom request handling for AWS WAF to use when the rule action doesn't block the request. For example, `CaptchaAction` for requests with valid t okens, and `AllowAction` .
     *
     * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customrequesthandling.html
     */
    export interface CustomRequestHandlingProperty {
        /**
         * The HTTP headers to insert into the request. Duplicate header names are not allowed.
         *
         * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customrequesthandling.html#cfn-wafv2-webacl-customrequesthandling-insertheaders
         */
        readonly insertHeaders: Array<CfnWebACL.CustomHTTPHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CustomRequestHandlingProperty`
 *
 * @param properties - the TypeScript properties of a `CustomRequestHandlingProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_CustomRequestHandlingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('insertHeaders', cdk.requiredValidator)(properties.insertHeaders));
    errors.collect(cdk.propertyValidator('insertHeaders', cdk.listValidator(CfnWebACL_CustomHTTPHeaderPropertyValidator))(properties.insertHeaders));
    return errors.wrap('supplied properties not correct for "CustomRequestHandlingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CustomRequestHandling` resource
 *
 * @param properties - the TypeScript properties of a `CustomRequestHandlingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CustomRequestHandling` resource.
 */
// @ts-ignore TS6133
function cfnWebACLCustomRequestHandlingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_CustomRequestHandlingPropertyValidator(properties).assertSuccess();
    return {
        InsertHeaders: cdk.listMapper(cfnWebACLCustomHTTPHeaderPropertyToCloudFormation)(properties.insertHeaders),
    };
}

// @ts-ignore TS6133
function CfnWebACLCustomRequestHandlingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CustomRequestHandlingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CustomRequestHandlingProperty>();
    ret.addPropertyResult('insertHeaders', 'InsertHeaders', cfn_parse.FromCloudFormation.getArray(CfnWebACLCustomHTTPHeaderPropertyFromCloudFormation)(properties.InsertHeaders));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A custom response to send to the client. You can define a custom response for rule actions and default web ACL actions that are set to the block action.
     *
     * For information about customizing web requests and responses, see [Customizing web requests and responses in AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-custom-request-response.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customresponse.html
     */
    export interface CustomResponseProperty {
        /**
         * References the response body that you want AWS WAF to return to the web request client. You can define a custom response for a rule action or a default web ACL action that is set to block. To do this, you first define the response body key and value in the `CustomResponseBodies` setting for the `WebACL` or `RuleGroup` where you want to use it. Then, in the rule action or web ACL default action `BlockAction` setting, you reference the response body using this key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customresponse.html#cfn-wafv2-webacl-customresponse-customresponsebodykey
         */
        readonly customResponseBodyKey?: string;
        /**
         * The HTTP status code to return to the client.
         *
         * For a list of status codes that you can use in your custom responses, see [Supported status codes for custom response](https://docs.aws.amazon.com/waf/latest/developerguide/customizing-the-response-status-codes.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customresponse.html#cfn-wafv2-webacl-customresponse-responsecode
         */
        readonly responseCode: number;
        /**
         * The HTTP headers to use in the response. Duplicate header names are not allowed.
         *
         * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customresponse.html#cfn-wafv2-webacl-customresponse-responseheaders
         */
        readonly responseHeaders?: Array<CfnWebACL.CustomHTTPHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CustomResponseProperty`
 *
 * @param properties - the TypeScript properties of a `CustomResponseProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_CustomResponsePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customResponseBodyKey', cdk.validateString)(properties.customResponseBodyKey));
    errors.collect(cdk.propertyValidator('responseCode', cdk.requiredValidator)(properties.responseCode));
    errors.collect(cdk.propertyValidator('responseCode', cdk.validateNumber)(properties.responseCode));
    errors.collect(cdk.propertyValidator('responseHeaders', cdk.listValidator(CfnWebACL_CustomHTTPHeaderPropertyValidator))(properties.responseHeaders));
    return errors.wrap('supplied properties not correct for "CustomResponseProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CustomResponse` resource
 *
 * @param properties - the TypeScript properties of a `CustomResponseProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CustomResponse` resource.
 */
// @ts-ignore TS6133
function cfnWebACLCustomResponsePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_CustomResponsePropertyValidator(properties).assertSuccess();
    return {
        CustomResponseBodyKey: cdk.stringToCloudFormation(properties.customResponseBodyKey),
        ResponseCode: cdk.numberToCloudFormation(properties.responseCode),
        ResponseHeaders: cdk.listMapper(cfnWebACLCustomHTTPHeaderPropertyToCloudFormation)(properties.responseHeaders),
    };
}

// @ts-ignore TS6133
function CfnWebACLCustomResponsePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CustomResponseProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CustomResponseProperty>();
    ret.addPropertyResult('customResponseBodyKey', 'CustomResponseBodyKey', properties.CustomResponseBodyKey != null ? cfn_parse.FromCloudFormation.getString(properties.CustomResponseBodyKey) : undefined);
    ret.addPropertyResult('responseCode', 'ResponseCode', cfn_parse.FromCloudFormation.getNumber(properties.ResponseCode));
    ret.addPropertyResult('responseHeaders', 'ResponseHeaders', properties.ResponseHeaders != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLCustomHTTPHeaderPropertyFromCloudFormation)(properties.ResponseHeaders) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * The response body to use in a custom response to a web request. This is referenced by key from `CustomResponse` `CustomResponseBodyKey` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customresponsebody.html
     */
    export interface CustomResponseBodyProperty {
        /**
         * The payload of the custom response.
         *
         * You can use JSON escape strings in JSON content. To do this, you must specify JSON content in the `ContentType` setting.
         *
         * For information about the limits on count and size for custom request and response settings, see [AWS WAF quotas](https://docs.aws.amazon.com/waf/latest/developerguide/limits.html) in the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customresponsebody.html#cfn-wafv2-webacl-customresponsebody-content
         */
        readonly content: string;
        /**
         * The type of content in the payload that you are defining in the `Content` string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-customresponsebody.html#cfn-wafv2-webacl-customresponsebody-contenttype
         */
        readonly contentType: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomResponseBodyProperty`
 *
 * @param properties - the TypeScript properties of a `CustomResponseBodyProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_CustomResponseBodyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('content', cdk.requiredValidator)(properties.content));
    errors.collect(cdk.propertyValidator('content', cdk.validateString)(properties.content));
    errors.collect(cdk.propertyValidator('contentType', cdk.requiredValidator)(properties.contentType));
    errors.collect(cdk.propertyValidator('contentType', cdk.validateString)(properties.contentType));
    return errors.wrap('supplied properties not correct for "CustomResponseBodyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CustomResponseBody` resource
 *
 * @param properties - the TypeScript properties of a `CustomResponseBodyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.CustomResponseBody` resource.
 */
// @ts-ignore TS6133
function cfnWebACLCustomResponseBodyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_CustomResponseBodyPropertyValidator(properties).assertSuccess();
    return {
        Content: cdk.stringToCloudFormation(properties.content),
        ContentType: cdk.stringToCloudFormation(properties.contentType),
    };
}

// @ts-ignore TS6133
function CfnWebACLCustomResponseBodyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.CustomResponseBodyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.CustomResponseBodyProperty>();
    ret.addPropertyResult('content', 'Content', cfn_parse.FromCloudFormation.getString(properties.Content));
    ret.addPropertyResult('contentType', 'ContentType', cfn_parse.FromCloudFormation.getString(properties.ContentType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * In a `WebACL` , this is the action that you want AWS WAF to perform when a web request doesn't match any of the rules in the `WebACL` . The default action must be a terminating action.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-defaultaction.html
     */
    export interface DefaultActionProperty {
        /**
         * Specifies that AWS WAF should allow requests by default.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-defaultaction.html#cfn-wafv2-webacl-defaultaction-allow
         */
        readonly allow?: CfnWebACL.AllowActionProperty | cdk.IResolvable;
        /**
         * Specifies that AWS WAF should block requests by default.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-defaultaction.html#cfn-wafv2-webacl-defaultaction-block
         */
        readonly block?: CfnWebACL.BlockActionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DefaultActionProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_DefaultActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allow', CfnWebACL_AllowActionPropertyValidator)(properties.allow));
    errors.collect(cdk.propertyValidator('block', CfnWebACL_BlockActionPropertyValidator)(properties.block));
    return errors.wrap('supplied properties not correct for "DefaultActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.DefaultAction` resource
 *
 * @param properties - the TypeScript properties of a `DefaultActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.DefaultAction` resource.
 */
// @ts-ignore TS6133
function cfnWebACLDefaultActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_DefaultActionPropertyValidator(properties).assertSuccess();
    return {
        Allow: cfnWebACLAllowActionPropertyToCloudFormation(properties.allow),
        Block: cfnWebACLBlockActionPropertyToCloudFormation(properties.block),
    };
}

// @ts-ignore TS6133
function CfnWebACLDefaultActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.DefaultActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.DefaultActionProperty>();
    ret.addPropertyResult('allow', 'Allow', properties.Allow != null ? CfnWebACLAllowActionPropertyFromCloudFormation(properties.Allow) : undefined);
    ret.addPropertyResult('block', 'Block', properties.Block != null ? CfnWebACLBlockActionPropertyFromCloudFormation(properties.Block) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Specifies a single rule in a rule group whose action you want to override to `Count` .
     *
     * > Instead of this option, use `RuleActionOverrides` . It accepts any valid action setting, including `Count` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-excludedrule.html
     */
    export interface ExcludedRuleProperty {
        /**
         * The name of the rule whose action you want to override to `Count` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-excludedrule.html#cfn-wafv2-webacl-excludedrule-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `ExcludedRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ExcludedRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_ExcludedRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "ExcludedRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ExcludedRule` resource
 *
 * @param properties - the TypeScript properties of a `ExcludedRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ExcludedRule` resource.
 */
// @ts-ignore TS6133
function cfnWebACLExcludedRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_ExcludedRulePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnWebACLExcludedRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ExcludedRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ExcludedRuleProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * The identifier of the username or password field, used in the `ManagedRuleGroupConfig` settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldidentifier.html
     */
    export interface FieldIdentifierProperty {
        /**
         * The name of the username or password field, used in the `ManagedRuleGroupConfig` settings.
         *
         * When the `PayloadType` is `JSON` , the identifier must be in JSON pointer syntax. For example `/form/username` . For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation [JavaScript Object Notation (JSON) Pointer](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6901) .
         *
         * When the `PayloadType` is `FORM_ENCODED` , use the HTML form names. For example, `username` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldidentifier.html#cfn-wafv2-webacl-fieldidentifier-identifier
         */
        readonly identifier: string;
    }
}

/**
 * Determine whether the given properties match those of a `FieldIdentifierProperty`
 *
 * @param properties - the TypeScript properties of a `FieldIdentifierProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_FieldIdentifierPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('identifier', cdk.requiredValidator)(properties.identifier));
    errors.collect(cdk.propertyValidator('identifier', cdk.validateString)(properties.identifier));
    return errors.wrap('supplied properties not correct for "FieldIdentifierProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.FieldIdentifier` resource
 *
 * @param properties - the TypeScript properties of a `FieldIdentifierProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.FieldIdentifier` resource.
 */
// @ts-ignore TS6133
function cfnWebACLFieldIdentifierPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_FieldIdentifierPropertyValidator(properties).assertSuccess();
    return {
        Identifier: cdk.stringToCloudFormation(properties.identifier),
    };
}

// @ts-ignore TS6133
function CfnWebACLFieldIdentifierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.FieldIdentifierProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.FieldIdentifierProperty>();
    ret.addPropertyResult('identifier', 'Identifier', cfn_parse.FromCloudFormation.getString(properties.Identifier));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * The part of the web request that you want AWS WAF to inspect. Include the single `FieldToMatch` type that you want to inspect, with additional specifications as needed, according to the type. You specify a single request component in `FieldToMatch` for each rule statement that requires it. To inspect more than one component of the web request, create a separate rule statement for each component.
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html
     */
    export interface FieldToMatchProperty {
        /**
         * Inspect all query arguments.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-allqueryarguments
         */
        readonly allQueryArguments?: any | cdk.IResolvable;
        /**
         * Inspect the request body as plain text. The request body immediately follows the request headers. This is the part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form.
         *
         * Only the first 8 KB (8192 bytes) of the request body are forwarded to AWS WAF for inspection by the underlying host service. For information about how to handle oversized request bodies, see the `Body` object configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-body
         */
        readonly body?: CfnWebACL.BodyProperty | cdk.IResolvable;
        /**
         * Inspect the request cookies. You must configure scope and pattern matching filters in the `Cookies` object, to define the set of cookies and the parts of the cookies that AWS WAF inspects.
         *
         * Only the first 8 KB (8192 bytes) of a request's cookies and only the first 200 cookies are forwarded to AWS WAF for inspection by the underlying host service. You must configure how to handle any oversize cookie content in the `Cookies` object. AWS WAF applies the pattern matching filters to the cookies that it receives from the underlying host service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-cookies
         */
        readonly cookies?: CfnWebACL.CookiesProperty | cdk.IResolvable;
        /**
         * Inspect the request headers. You must configure scope and pattern matching filters in the `Headers` object, to define the set of headers to and the parts of the headers that AWS WAF inspects.
         *
         * Only the first 8 KB (8192 bytes) of a request's headers and only the first 200 headers are forwarded to AWS WAF for inspection by the underlying host service. You must configure how to handle any oversize header content in the `Headers` object. AWS WAF applies the pattern matching filters to the headers that it receives from the underlying host service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-headers
         */
        readonly headers?: CfnWebACL.HeadersProperty | cdk.IResolvable;
        /**
         * Inspect the request body as JSON. The request body immediately follows the request headers. This is the part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form.
         *
         * Only the first 8 KB (8192 bytes) of the request body are forwarded to AWS WAF for inspection by the underlying host service. For information about how to handle oversized request bodies, see the `JsonBody` object configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-jsonbody
         */
        readonly jsonBody?: CfnWebACL.JsonBodyProperty | cdk.IResolvable;
        /**
         * Inspect the HTTP method. The method indicates the type of operation that the request is asking the origin to perform.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-method
         */
        readonly method?: any | cdk.IResolvable;
        /**
         * Inspect the query string. This is the part of a URL that appears after a `?` character, if any.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-querystring
         */
        readonly queryString?: any | cdk.IResolvable;
        /**
         * Inspect a single header. Provide the name of the header to inspect, for example, `User-Agent` or `Referer` . This setting isn't case sensitive.
         *
         * Example JSON: `"SingleHeader": { "Name": "haystack" }`
         *
         * Alternately, you can filter and inspect all headers with the `Headers` `FieldToMatch` setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-singleheader
         */
        readonly singleHeader?: any | cdk.IResolvable;
        /**
         * Inspect a single query argument. Provide the name of the query argument to inspect, such as *UserName* or *SalesRegion* . The name can be up to 30 characters long and isn't case sensitive.
         *
         * Example JSON: `"SingleQueryArgument": { "Name": "myArgument" }`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-singlequeryargument
         */
        readonly singleQueryArgument?: any | cdk.IResolvable;
        /**
         * Inspect the request URI path. This is the part of the web request that identifies a resource, for example, `/images/daily-ad.jpg` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-fieldtomatch.html#cfn-wafv2-webacl-fieldtomatch-uripath
         */
        readonly uriPath?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FieldToMatchProperty`
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_FieldToMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allQueryArguments', cdk.validateObject)(properties.allQueryArguments));
    errors.collect(cdk.propertyValidator('body', CfnWebACL_BodyPropertyValidator)(properties.body));
    errors.collect(cdk.propertyValidator('cookies', CfnWebACL_CookiesPropertyValidator)(properties.cookies));
    errors.collect(cdk.propertyValidator('headers', CfnWebACL_HeadersPropertyValidator)(properties.headers));
    errors.collect(cdk.propertyValidator('jsonBody', CfnWebACL_JsonBodyPropertyValidator)(properties.jsonBody));
    errors.collect(cdk.propertyValidator('method', cdk.validateObject)(properties.method));
    errors.collect(cdk.propertyValidator('queryString', cdk.validateObject)(properties.queryString));
    errors.collect(cdk.propertyValidator('singleHeader', cdk.validateObject)(properties.singleHeader));
    errors.collect(cdk.propertyValidator('singleQueryArgument', cdk.validateObject)(properties.singleQueryArgument));
    errors.collect(cdk.propertyValidator('uriPath', cdk.validateObject)(properties.uriPath));
    return errors.wrap('supplied properties not correct for "FieldToMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.FieldToMatch` resource
 *
 * @param properties - the TypeScript properties of a `FieldToMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.FieldToMatch` resource.
 */
// @ts-ignore TS6133
function cfnWebACLFieldToMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_FieldToMatchPropertyValidator(properties).assertSuccess();
    return {
        AllQueryArguments: cdk.objectToCloudFormation(properties.allQueryArguments),
        Body: cfnWebACLBodyPropertyToCloudFormation(properties.body),
        Cookies: cfnWebACLCookiesPropertyToCloudFormation(properties.cookies),
        Headers: cfnWebACLHeadersPropertyToCloudFormation(properties.headers),
        JsonBody: cfnWebACLJsonBodyPropertyToCloudFormation(properties.jsonBody),
        Method: cdk.objectToCloudFormation(properties.method),
        QueryString: cdk.objectToCloudFormation(properties.queryString),
        SingleHeader: cdk.objectToCloudFormation(properties.singleHeader),
        SingleQueryArgument: cdk.objectToCloudFormation(properties.singleQueryArgument),
        UriPath: cdk.objectToCloudFormation(properties.uriPath),
    };
}

// @ts-ignore TS6133
function CfnWebACLFieldToMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.FieldToMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.FieldToMatchProperty>();
    ret.addPropertyResult('allQueryArguments', 'AllQueryArguments', properties.AllQueryArguments != null ? cfn_parse.FromCloudFormation.getAny(properties.AllQueryArguments) : undefined);
    ret.addPropertyResult('body', 'Body', properties.Body != null ? CfnWebACLBodyPropertyFromCloudFormation(properties.Body) : undefined);
    ret.addPropertyResult('cookies', 'Cookies', properties.Cookies != null ? CfnWebACLCookiesPropertyFromCloudFormation(properties.Cookies) : undefined);
    ret.addPropertyResult('headers', 'Headers', properties.Headers != null ? CfnWebACLHeadersPropertyFromCloudFormation(properties.Headers) : undefined);
    ret.addPropertyResult('jsonBody', 'JsonBody', properties.JsonBody != null ? CfnWebACLJsonBodyPropertyFromCloudFormation(properties.JsonBody) : undefined);
    ret.addPropertyResult('method', 'Method', properties.Method != null ? cfn_parse.FromCloudFormation.getAny(properties.Method) : undefined);
    ret.addPropertyResult('queryString', 'QueryString', properties.QueryString != null ? cfn_parse.FromCloudFormation.getAny(properties.QueryString) : undefined);
    ret.addPropertyResult('singleHeader', 'SingleHeader', properties.SingleHeader != null ? cfn_parse.FromCloudFormation.getAny(properties.SingleHeader) : undefined);
    ret.addPropertyResult('singleQueryArgument', 'SingleQueryArgument', properties.SingleQueryArgument != null ? cfn_parse.FromCloudFormation.getAny(properties.SingleQueryArgument) : undefined);
    ret.addPropertyResult('uriPath', 'UriPath', properties.UriPath != null ? cfn_parse.FromCloudFormation.getAny(properties.UriPath) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin. Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * This configuration is used for `GeoMatchStatement` and `RateBasedStatement` . For `IPSetReferenceStatement` , use `IPSetForwardedIPConfig` instead.
     *
     * AWS WAF only evaluates the first IP address found in the specified HTTP header.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-forwardedipconfiguration.html
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-forwardedipconfiguration.html#cfn-wafv2-webacl-forwardedipconfiguration-fallbackbehavior
         */
        readonly fallbackBehavior: string;
        /**
         * The name of the HTTP header to use for the IP address. For example, to use the X-Forwarded-For (XFF) header, set this to `X-Forwarded-For` .
         *
         * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-forwardedipconfiguration.html#cfn-wafv2-webacl-forwardedipconfiguration-headername
         */
        readonly headerName: string;
    }
}

/**
 * Determine whether the given properties match those of a `ForwardedIPConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ForwardedIPConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_ForwardedIPConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fallbackBehavior', cdk.requiredValidator)(properties.fallbackBehavior));
    errors.collect(cdk.propertyValidator('fallbackBehavior', cdk.validateString)(properties.fallbackBehavior));
    errors.collect(cdk.propertyValidator('headerName', cdk.requiredValidator)(properties.headerName));
    errors.collect(cdk.propertyValidator('headerName', cdk.validateString)(properties.headerName));
    return errors.wrap('supplied properties not correct for "ForwardedIPConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ForwardedIPConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ForwardedIPConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ForwardedIPConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnWebACLForwardedIPConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_ForwardedIPConfigurationPropertyValidator(properties).assertSuccess();
    return {
        FallbackBehavior: cdk.stringToCloudFormation(properties.fallbackBehavior),
        HeaderName: cdk.stringToCloudFormation(properties.headerName),
    };
}

// @ts-ignore TS6133
function CfnWebACLForwardedIPConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ForwardedIPConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ForwardedIPConfigurationProperty>();
    ret.addPropertyResult('fallbackBehavior', 'FallbackBehavior', cfn_parse.FromCloudFormation.getString(properties.FallbackBehavior));
    ret.addPropertyResult('headerName', 'HeaderName', cfn_parse.FromCloudFormation.getString(properties.HeaderName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A rule statement that labels web requests by country and region and that matches against web requests based on country code. A geo match rule labels every request that it inspects regardless of whether it finds a match.
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-geomatchstatement.html
     */
    export interface GeoMatchStatementProperty {
        /**
         * An array of two-character country codes that you want to match against, for example, `[ "US", "CN" ]` , from the alpha-2 country ISO codes of the ISO 3166 international standard.
         *
         * When you use a geo match statement just for the region and country labels that it adds to requests, you still have to supply a country code for the rule to evaluate. In this case, you configure the rule to only count matching requests, but it will still generate logging and count metrics for any matches. You can reduce the logging and metrics that the rule produces by specifying a country that's unlikely to be a source of traffic to your site.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-geomatchstatement.html#cfn-wafv2-webacl-geomatchstatement-countrycodes
         */
        readonly countryCodes?: string[];
        /**
         * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin. Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
         *
         * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-geomatchstatement.html#cfn-wafv2-webacl-geomatchstatement-forwardedipconfig
         */
        readonly forwardedIpConfig?: CfnWebACL.ForwardedIPConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `GeoMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `GeoMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_GeoMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('countryCodes', cdk.listValidator(cdk.validateString))(properties.countryCodes));
    errors.collect(cdk.propertyValidator('forwardedIpConfig', CfnWebACL_ForwardedIPConfigurationPropertyValidator)(properties.forwardedIpConfig));
    return errors.wrap('supplied properties not correct for "GeoMatchStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.GeoMatchStatement` resource
 *
 * @param properties - the TypeScript properties of a `GeoMatchStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.GeoMatchStatement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLGeoMatchStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_GeoMatchStatementPropertyValidator(properties).assertSuccess();
    return {
        CountryCodes: cdk.listMapper(cdk.stringToCloudFormation)(properties.countryCodes),
        ForwardedIPConfig: cfnWebACLForwardedIPConfigurationPropertyToCloudFormation(properties.forwardedIpConfig),
    };
}

// @ts-ignore TS6133
function CfnWebACLGeoMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.GeoMatchStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.GeoMatchStatementProperty>();
    ret.addPropertyResult('countryCodes', 'CountryCodes', properties.CountryCodes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CountryCodes) : undefined);
    ret.addPropertyResult('forwardedIpConfig', 'ForwardedIPConfig', properties.ForwardedIPConfig != null ? CfnWebACLForwardedIPConfigurationPropertyFromCloudFormation(properties.ForwardedIPConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * The filter to use to identify the subset of headers to inspect in a web request.
     *
     * You must specify exactly one setting: either `All` , `IncludedHeaders` , or `ExcludedHeaders` .
     *
     * Example JSON: `"MatchPattern": { "ExcludedHeaders": {"KeyToExclude1", "KeyToExclude2"} }`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headermatchpattern.html
     */
    export interface HeaderMatchPatternProperty {
        /**
         * Inspect all headers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headermatchpattern.html#cfn-wafv2-webacl-headermatchpattern-all
         */
        readonly all?: any | cdk.IResolvable;
        /**
         * Inspect only the headers whose keys don't match any of the strings specified here.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headermatchpattern.html#cfn-wafv2-webacl-headermatchpattern-excludedheaders
         */
        readonly excludedHeaders?: string[];
        /**
         * Inspect only the headers that have a key that matches one of the strings specified here.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headermatchpattern.html#cfn-wafv2-webacl-headermatchpattern-includedheaders
         */
        readonly includedHeaders?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `HeaderMatchPatternProperty`
 *
 * @param properties - the TypeScript properties of a `HeaderMatchPatternProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_HeaderMatchPatternPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('all', cdk.validateObject)(properties.all));
    errors.collect(cdk.propertyValidator('excludedHeaders', cdk.listValidator(cdk.validateString))(properties.excludedHeaders));
    errors.collect(cdk.propertyValidator('includedHeaders', cdk.listValidator(cdk.validateString))(properties.includedHeaders));
    return errors.wrap('supplied properties not correct for "HeaderMatchPatternProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.HeaderMatchPattern` resource
 *
 * @param properties - the TypeScript properties of a `HeaderMatchPatternProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.HeaderMatchPattern` resource.
 */
// @ts-ignore TS6133
function cfnWebACLHeaderMatchPatternPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_HeaderMatchPatternPropertyValidator(properties).assertSuccess();
    return {
        All: cdk.objectToCloudFormation(properties.all),
        ExcludedHeaders: cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedHeaders),
        IncludedHeaders: cdk.listMapper(cdk.stringToCloudFormation)(properties.includedHeaders),
    };
}

// @ts-ignore TS6133
function CfnWebACLHeaderMatchPatternPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.HeaderMatchPatternProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.HeaderMatchPatternProperty>();
    ret.addPropertyResult('all', 'All', properties.All != null ? cfn_parse.FromCloudFormation.getAny(properties.All) : undefined);
    ret.addPropertyResult('excludedHeaders', 'ExcludedHeaders', properties.ExcludedHeaders != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExcludedHeaders) : undefined);
    ret.addPropertyResult('includedHeaders', 'IncludedHeaders', properties.IncludedHeaders != null ? cfn_parse.FromCloudFormation.getStringArray(properties.IncludedHeaders) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Inspect all headers in the web request. You can specify the parts of the headers to inspect and you can narrow the set of headers to inspect by including or excluding specific keys.
     *
     * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
     *
     * If you want to inspect just the value of a single header, use the `SingleHeader` `FieldToMatch` setting instead.
     *
     * Example JSON: `"Headers": { "MatchPattern": { "All": {} }, "MatchScope": "KEY", "OversizeHandling": "MATCH" }`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headers.html
     */
    export interface HeadersProperty {
        /**
         * The filter to use to identify the subset of headers to inspect in a web request.
         *
         * You must specify exactly one setting: either `All` , `IncludedHeaders` , or `ExcludedHeaders` .
         *
         * Example JSON: `"MatchPattern": { "ExcludedHeaders": {"KeyToExclude1", "KeyToExclude2"} }`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headers.html#cfn-wafv2-webacl-headers-matchpattern
         */
        readonly matchPattern: CfnWebACL.HeaderMatchPatternProperty | cdk.IResolvable;
        /**
         * The parts of the headers to match with the rule inspection criteria. If you specify `All` , AWS WAF inspects both keys and values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headers.html#cfn-wafv2-webacl-headers-matchscope
         */
        readonly matchScope: string;
        /**
         * What AWS WAF should do if the headers of the request are larger than AWS WAF can inspect. AWS WAF does not support inspecting the entire contents of request headers when they exceed 8 KB (8192 bytes) or 200 total headers. The underlying host service forwards a maximum of 200 headers and at most 8 KB of header contents to AWS WAF .
         *
         * The options for oversize handling are the following:
         *
         * - `CONTINUE` - Inspect the headers normally, according to the rule inspection criteria.
         * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
         * - `NO_MATCH` - Treat the web request as not matching the rule statement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-headers.html#cfn-wafv2-webacl-headers-oversizehandling
         */
        readonly oversizeHandling: string;
    }
}

/**
 * Determine whether the given properties match those of a `HeadersProperty`
 *
 * @param properties - the TypeScript properties of a `HeadersProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_HeadersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('matchPattern', cdk.requiredValidator)(properties.matchPattern));
    errors.collect(cdk.propertyValidator('matchPattern', CfnWebACL_HeaderMatchPatternPropertyValidator)(properties.matchPattern));
    errors.collect(cdk.propertyValidator('matchScope', cdk.requiredValidator)(properties.matchScope));
    errors.collect(cdk.propertyValidator('matchScope', cdk.validateString)(properties.matchScope));
    errors.collect(cdk.propertyValidator('oversizeHandling', cdk.requiredValidator)(properties.oversizeHandling));
    errors.collect(cdk.propertyValidator('oversizeHandling', cdk.validateString)(properties.oversizeHandling));
    return errors.wrap('supplied properties not correct for "HeadersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.Headers` resource
 *
 * @param properties - the TypeScript properties of a `HeadersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.Headers` resource.
 */
// @ts-ignore TS6133
function cfnWebACLHeadersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_HeadersPropertyValidator(properties).assertSuccess();
    return {
        MatchPattern: cfnWebACLHeaderMatchPatternPropertyToCloudFormation(properties.matchPattern),
        MatchScope: cdk.stringToCloudFormation(properties.matchScope),
        OversizeHandling: cdk.stringToCloudFormation(properties.oversizeHandling),
    };
}

// @ts-ignore TS6133
function CfnWebACLHeadersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.HeadersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.HeadersProperty>();
    ret.addPropertyResult('matchPattern', 'MatchPattern', CfnWebACLHeaderMatchPatternPropertyFromCloudFormation(properties.MatchPattern));
    ret.addPropertyResult('matchScope', 'MatchScope', cfn_parse.FromCloudFormation.getString(properties.MatchScope));
    ret.addPropertyResult('oversizeHandling', 'OversizeHandling', cfn_parse.FromCloudFormation.getString(properties.OversizeHandling));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin. Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
     *
     * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
     *
     * This configuration is used only for `IPSetReferenceStatement` . For `GeoMatchStatement` and `RateBasedStatement` , use `ForwardedIPConfig` instead.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ipsetforwardedipconfiguration.html
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ipsetforwardedipconfiguration.html#cfn-wafv2-webacl-ipsetforwardedipconfiguration-fallbackbehavior
         */
        readonly fallbackBehavior: string;
        /**
         * The name of the HTTP header to use for the IP address. For example, to use the X-Forwarded-For (XFF) header, set this to `X-Forwarded-For` .
         *
         * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ipsetforwardedipconfiguration.html#cfn-wafv2-webacl-ipsetforwardedipconfiguration-headername
         */
        readonly headerName: string;
        /**
         * The position in the header to search for the IP address. The header can contain IP addresses of the original client and also of proxies. For example, the header value could be `10.1.1.1, 127.0.0.0, 10.10.10.10` where the first IP address identifies the original client and the rest identify proxies that the request went through.
         *
         * The options for this setting are the following:
         *
         * - FIRST - Inspect the first IP address in the list of IP addresses in the header. This is usually the client's original IP.
         * - LAST - Inspect the last IP address in the list of IP addresses in the header.
         * - ANY - Inspect all IP addresses in the header for a match. If the header contains more than 10 IP addresses, AWS WAF inspects the last 10.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ipsetforwardedipconfiguration.html#cfn-wafv2-webacl-ipsetforwardedipconfiguration-position
         */
        readonly position: string;
    }
}

/**
 * Determine whether the given properties match those of a `IPSetForwardedIPConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetForwardedIPConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_IPSetForwardedIPConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fallbackBehavior', cdk.requiredValidator)(properties.fallbackBehavior));
    errors.collect(cdk.propertyValidator('fallbackBehavior', cdk.validateString)(properties.fallbackBehavior));
    errors.collect(cdk.propertyValidator('headerName', cdk.requiredValidator)(properties.headerName));
    errors.collect(cdk.propertyValidator('headerName', cdk.validateString)(properties.headerName));
    errors.collect(cdk.propertyValidator('position', cdk.requiredValidator)(properties.position));
    errors.collect(cdk.propertyValidator('position', cdk.validateString)(properties.position));
    return errors.wrap('supplied properties not correct for "IPSetForwardedIPConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.IPSetForwardedIPConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `IPSetForwardedIPConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.IPSetForwardedIPConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnWebACLIPSetForwardedIPConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_IPSetForwardedIPConfigurationPropertyValidator(properties).assertSuccess();
    return {
        FallbackBehavior: cdk.stringToCloudFormation(properties.fallbackBehavior),
        HeaderName: cdk.stringToCloudFormation(properties.headerName),
        Position: cdk.stringToCloudFormation(properties.position),
    };
}

// @ts-ignore TS6133
function CfnWebACLIPSetForwardedIPConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.IPSetForwardedIPConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.IPSetForwardedIPConfigurationProperty>();
    ret.addPropertyResult('fallbackBehavior', 'FallbackBehavior', cfn_parse.FromCloudFormation.getString(properties.FallbackBehavior));
    ret.addPropertyResult('headerName', 'HeaderName', cfn_parse.FromCloudFormation.getString(properties.HeaderName));
    ret.addPropertyResult('position', 'Position', cfn_parse.FromCloudFormation.getString(properties.Position));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A rule statement used to detect web requests coming from particular IP addresses or address ranges. To use this, create an `IPSet` that specifies the addresses you want to detect, then use the ARN of that set in this statement.
     *
     * Each IP set rule statement references an IP set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ipsetreferencestatement.html
     */
    export interface IPSetReferenceStatementProperty {
        /**
         * The Amazon Resource Name (ARN) of the `IPSet` that this statement references.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ipsetreferencestatement.html#cfn-wafv2-webacl-ipsetreferencestatement-arn
         */
        readonly arn: string;
        /**
         * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin. Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
         *
         * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ipsetreferencestatement.html#cfn-wafv2-webacl-ipsetreferencestatement-ipsetforwardedipconfig
         */
        readonly ipSetForwardedIpConfig?: CfnWebACL.IPSetForwardedIPConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `IPSetReferenceStatementProperty`
 *
 * @param properties - the TypeScript properties of a `IPSetReferenceStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_IPSetReferenceStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('ipSetForwardedIpConfig', CfnWebACL_IPSetForwardedIPConfigurationPropertyValidator)(properties.ipSetForwardedIpConfig));
    return errors.wrap('supplied properties not correct for "IPSetReferenceStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.IPSetReferenceStatement` resource
 *
 * @param properties - the TypeScript properties of a `IPSetReferenceStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.IPSetReferenceStatement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLIPSetReferenceStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_IPSetReferenceStatementPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        IPSetForwardedIPConfig: cfnWebACLIPSetForwardedIPConfigurationPropertyToCloudFormation(properties.ipSetForwardedIpConfig),
    };
}

// @ts-ignore TS6133
function CfnWebACLIPSetReferenceStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.IPSetReferenceStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.IPSetReferenceStatementProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addPropertyResult('ipSetForwardedIpConfig', 'IPSetForwardedIPConfig', properties.IPSetForwardedIPConfig != null ? CfnWebACLIPSetForwardedIPConfigurationPropertyFromCloudFormation(properties.IPSetForwardedIPConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Used for CAPTCHA and challenge token settings. Determines how long a `CAPTCHA` or challenge timestamp remains valid after AWS WAF updates it for a successful `CAPTCHA` or challenge response.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-immunitytimeproperty.html
     */
    export interface ImmunityTimePropertyProperty {
        /**
         * The amount of time, in seconds, that a `CAPTCHA` or challenge timestamp is considered valid by AWS WAF . The default setting is 300.
         *
         * For the Challenge action, the minimum setting is 300.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-immunitytimeproperty.html#cfn-wafv2-webacl-immunitytimeproperty-immunitytime
         */
        readonly immunityTime: number;
    }
}

/**
 * Determine whether the given properties match those of a `ImmunityTimePropertyProperty`
 *
 * @param properties - the TypeScript properties of a `ImmunityTimePropertyProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_ImmunityTimePropertyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('immunityTime', cdk.requiredValidator)(properties.immunityTime));
    errors.collect(cdk.propertyValidator('immunityTime', cdk.validateNumber)(properties.immunityTime));
    return errors.wrap('supplied properties not correct for "ImmunityTimePropertyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ImmunityTimeProperty` resource
 *
 * @param properties - the TypeScript properties of a `ImmunityTimePropertyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ImmunityTimeProperty` resource.
 */
// @ts-ignore TS6133
function cfnWebACLImmunityTimePropertyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_ImmunityTimePropertyPropertyValidator(properties).assertSuccess();
    return {
        ImmunityTime: cdk.numberToCloudFormation(properties.immunityTime),
    };
}

// @ts-ignore TS6133
function CfnWebACLImmunityTimePropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ImmunityTimePropertyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ImmunityTimePropertyProperty>();
    ret.addPropertyResult('immunityTime', 'ImmunityTime', cfn_parse.FromCloudFormation.getNumber(properties.ImmunityTime));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonbody.html
     */
    export interface JsonBodyProperty {
        /**
         * What AWS WAF should do if it fails to completely parse the JSON body. The options are the following:
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonbody.html#cfn-wafv2-webacl-jsonbody-invalidfallbackbehavior
         */
        readonly invalidFallbackBehavior?: string;
        /**
         * The patterns to look for in the JSON body. AWS WAF inspects the results of these pattern matches against the rule inspection criteria.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonbody.html#cfn-wafv2-webacl-jsonbody-matchpattern
         */
        readonly matchPattern: CfnWebACL.JsonMatchPatternProperty | cdk.IResolvable;
        /**
         * The parts of the JSON to match against using the `MatchPattern` . If you specify `All` , AWS WAF matches against keys and values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonbody.html#cfn-wafv2-webacl-jsonbody-matchscope
         */
        readonly matchScope: string;
        /**
         * What AWS WAF should do if the body is larger than AWS WAF can inspect. AWS WAF does not support inspecting the entire contents of the body of a web request when the body exceeds 8 KB (8192 bytes). Only the first 8 KB of the request body are forwarded to AWS WAF by the underlying host service.
         *
         * The options for oversize handling are the following:
         *
         * - `CONTINUE` - Inspect the body normally, according to the rule inspection criteria.
         * - `MATCH` - Treat the web request as matching the rule statement. AWS WAF applies the rule action to the request.
         * - `NO_MATCH` - Treat the web request as not matching the rule statement.
         *
         * You can combine the `MATCH` or `NO_MATCH` settings for oversize handling with your rule and web ACL action settings, so that you block any request whose body is over 8 KB.
         *
         * Default: `CONTINUE`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonbody.html#cfn-wafv2-webacl-jsonbody-oversizehandling
         */
        readonly oversizeHandling?: string;
    }
}

/**
 * Determine whether the given properties match those of a `JsonBodyProperty`
 *
 * @param properties - the TypeScript properties of a `JsonBodyProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_JsonBodyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('invalidFallbackBehavior', cdk.validateString)(properties.invalidFallbackBehavior));
    errors.collect(cdk.propertyValidator('matchPattern', cdk.requiredValidator)(properties.matchPattern));
    errors.collect(cdk.propertyValidator('matchPattern', CfnWebACL_JsonMatchPatternPropertyValidator)(properties.matchPattern));
    errors.collect(cdk.propertyValidator('matchScope', cdk.requiredValidator)(properties.matchScope));
    errors.collect(cdk.propertyValidator('matchScope', cdk.validateString)(properties.matchScope));
    errors.collect(cdk.propertyValidator('oversizeHandling', cdk.validateString)(properties.oversizeHandling));
    return errors.wrap('supplied properties not correct for "JsonBodyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.JsonBody` resource
 *
 * @param properties - the TypeScript properties of a `JsonBodyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.JsonBody` resource.
 */
// @ts-ignore TS6133
function cfnWebACLJsonBodyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_JsonBodyPropertyValidator(properties).assertSuccess();
    return {
        InvalidFallbackBehavior: cdk.stringToCloudFormation(properties.invalidFallbackBehavior),
        MatchPattern: cfnWebACLJsonMatchPatternPropertyToCloudFormation(properties.matchPattern),
        MatchScope: cdk.stringToCloudFormation(properties.matchScope),
        OversizeHandling: cdk.stringToCloudFormation(properties.oversizeHandling),
    };
}

// @ts-ignore TS6133
function CfnWebACLJsonBodyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.JsonBodyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.JsonBodyProperty>();
    ret.addPropertyResult('invalidFallbackBehavior', 'InvalidFallbackBehavior', properties.InvalidFallbackBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.InvalidFallbackBehavior) : undefined);
    ret.addPropertyResult('matchPattern', 'MatchPattern', CfnWebACLJsonMatchPatternPropertyFromCloudFormation(properties.MatchPattern));
    ret.addPropertyResult('matchScope', 'MatchScope', cfn_parse.FromCloudFormation.getString(properties.MatchScope));
    ret.addPropertyResult('oversizeHandling', 'OversizeHandling', properties.OversizeHandling != null ? cfn_parse.FromCloudFormation.getString(properties.OversizeHandling) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * The patterns to look for in the JSON body. AWS WAF inspects the results of these pattern matches against the rule inspection criteria. This is used with the `FieldToMatch` option `JsonBody` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonmatchpattern.html
     */
    export interface JsonMatchPatternProperty {
        /**
         * Match all of the elements. See also `MatchScope` in the `JsonBody` `FieldToMatch` specification.
         *
         * You must specify either this setting or the `IncludedPaths` setting, but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonmatchpattern.html#cfn-wafv2-webacl-jsonmatchpattern-all
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-jsonmatchpattern.html#cfn-wafv2-webacl-jsonmatchpattern-includedpaths
         */
        readonly includedPaths?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `JsonMatchPatternProperty`
 *
 * @param properties - the TypeScript properties of a `JsonMatchPatternProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_JsonMatchPatternPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('all', cdk.validateObject)(properties.all));
    errors.collect(cdk.propertyValidator('includedPaths', cdk.listValidator(cdk.validateString))(properties.includedPaths));
    return errors.wrap('supplied properties not correct for "JsonMatchPatternProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.JsonMatchPattern` resource
 *
 * @param properties - the TypeScript properties of a `JsonMatchPatternProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.JsonMatchPattern` resource.
 */
// @ts-ignore TS6133
function cfnWebACLJsonMatchPatternPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_JsonMatchPatternPropertyValidator(properties).assertSuccess();
    return {
        All: cdk.objectToCloudFormation(properties.all),
        IncludedPaths: cdk.listMapper(cdk.stringToCloudFormation)(properties.includedPaths),
    };
}

// @ts-ignore TS6133
function CfnWebACLJsonMatchPatternPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.JsonMatchPatternProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.JsonMatchPatternProperty>();
    ret.addPropertyResult('all', 'All', properties.All != null ? cfn_parse.FromCloudFormation.getAny(properties.All) : undefined);
    ret.addPropertyResult('includedPaths', 'IncludedPaths', properties.IncludedPaths != null ? cfn_parse.FromCloudFormation.getStringArray(properties.IncludedPaths) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A single label container. This is used as an element of a label array in `RuleLabels` inside a rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-label.html
     */
    export interface LabelProperty {
        /**
         * The label string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-label.html#cfn-wafv2-webacl-label-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `LabelProperty`
 *
 * @param properties - the TypeScript properties of a `LabelProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_LabelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "LabelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.Label` resource
 *
 * @param properties - the TypeScript properties of a `LabelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.Label` resource.
 */
// @ts-ignore TS6133
function cfnWebACLLabelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_LabelPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnWebACLLabelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.LabelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.LabelProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A rule statement to match against labels that have been added to the web request by rules that have already run in the web ACL.
     *
     * The label match statement provides the label or namespace string to search for. The label string can represent a part or all of the fully qualified label name that had been added to the web request. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label. If you do not provide the fully qualified name in your label match string, AWS WAF performs the search for labels that were added in the same context as the label match statement.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-labelmatchstatement.html
     */
    export interface LabelMatchStatementProperty {
        /**
         * The string to match against. The setting you provide for this depends on the match statement's `Scope` setting:
         *
         * - If the `Scope` indicates `LABEL` , then this specification must include the name and can include any number of preceding namespace specifications and prefix up to providing the fully qualified label name.
         * - If the `Scope` indicates `NAMESPACE` , then this specification can include any number of contiguous namespace strings, and can include the entire label namespace prefix from the rule group or web ACL where the label originates.
         *
         * Labels are case sensitive and components of a label must be separated by colon, for example `NS1:NS2:name` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-labelmatchstatement.html#cfn-wafv2-webacl-labelmatchstatement-key
         */
        readonly key: string;
        /**
         * Specify whether you want to match using the label name or just the namespace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-labelmatchstatement.html#cfn-wafv2-webacl-labelmatchstatement-scope
         */
        readonly scope: string;
    }
}

/**
 * Determine whether the given properties match those of a `LabelMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `LabelMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_LabelMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('scope', cdk.requiredValidator)(properties.scope));
    errors.collect(cdk.propertyValidator('scope', cdk.validateString)(properties.scope));
    return errors.wrap('supplied properties not correct for "LabelMatchStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.LabelMatchStatement` resource
 *
 * @param properties - the TypeScript properties of a `LabelMatchStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.LabelMatchStatement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLLabelMatchStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_LabelMatchStatementPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Scope: cdk.stringToCloudFormation(properties.scope),
    };
}

// @ts-ignore TS6133
function CfnWebACLLabelMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.LabelMatchStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.LabelMatchStatementProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('scope', 'Scope', cfn_parse.FromCloudFormation.getString(properties.Scope));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Additional information that's used by a managed rule group. Many managed rule groups don't require this.
     *
     * Use the `AWSManagedRulesBotControlRuleSet` configuration object to configure the protection level that you want the Bot Control rule group to use.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupconfig.html
     */
    export interface ManagedRuleGroupConfigProperty {
        /**
         * Additional configuration for using the Bot Control managed rule group. Use this to specify the inspection level that you want to use. For information about using the Bot Control managed rule group, see [AWS WAF Bot Control rule group](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-bot.html) and [AWS WAF Bot Control](https://docs.aws.amazon.com/waf/latest/developerguide/waf-bot-control.html) in the *AWS WAF Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupconfig.html#cfn-wafv2-webacl-managedrulegroupconfig-awsmanagedrulesbotcontrolruleset
         */
        readonly awsManagedRulesBotControlRuleSet?: CfnWebACL.AWSManagedRulesBotControlRuleSetProperty | cdk.IResolvable;
        /**
         * The path of the login endpoint for your application. For example, for the URL `https://example.com/web/login` , you would provide the path `/web/login` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupconfig.html#cfn-wafv2-webacl-managedrulegroupconfig-loginpath
         */
        readonly loginPath?: string;
        /**
         * Details about your login page password field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupconfig.html#cfn-wafv2-webacl-managedrulegroupconfig-passwordfield
         */
        readonly passwordField?: CfnWebACL.FieldIdentifierProperty | cdk.IResolvable;
        /**
         * The payload type for your login endpoint, either JSON or form encoded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupconfig.html#cfn-wafv2-webacl-managedrulegroupconfig-payloadtype
         */
        readonly payloadType?: string;
        /**
         * Details about your login page username field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupconfig.html#cfn-wafv2-webacl-managedrulegroupconfig-usernamefield
         */
        readonly usernameField?: CfnWebACL.FieldIdentifierProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ManagedRuleGroupConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ManagedRuleGroupConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_ManagedRuleGroupConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsManagedRulesBotControlRuleSet', CfnWebACL_AWSManagedRulesBotControlRuleSetPropertyValidator)(properties.awsManagedRulesBotControlRuleSet));
    errors.collect(cdk.propertyValidator('loginPath', cdk.validateString)(properties.loginPath));
    errors.collect(cdk.propertyValidator('passwordField', CfnWebACL_FieldIdentifierPropertyValidator)(properties.passwordField));
    errors.collect(cdk.propertyValidator('payloadType', cdk.validateString)(properties.payloadType));
    errors.collect(cdk.propertyValidator('usernameField', CfnWebACL_FieldIdentifierPropertyValidator)(properties.usernameField));
    return errors.wrap('supplied properties not correct for "ManagedRuleGroupConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ManagedRuleGroupConfig` resource
 *
 * @param properties - the TypeScript properties of a `ManagedRuleGroupConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ManagedRuleGroupConfig` resource.
 */
// @ts-ignore TS6133
function cfnWebACLManagedRuleGroupConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_ManagedRuleGroupConfigPropertyValidator(properties).assertSuccess();
    return {
        AWSManagedRulesBotControlRuleSet: cfnWebACLAWSManagedRulesBotControlRuleSetPropertyToCloudFormation(properties.awsManagedRulesBotControlRuleSet),
        LoginPath: cdk.stringToCloudFormation(properties.loginPath),
        PasswordField: cfnWebACLFieldIdentifierPropertyToCloudFormation(properties.passwordField),
        PayloadType: cdk.stringToCloudFormation(properties.payloadType),
        UsernameField: cfnWebACLFieldIdentifierPropertyToCloudFormation(properties.usernameField),
    };
}

// @ts-ignore TS6133
function CfnWebACLManagedRuleGroupConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ManagedRuleGroupConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ManagedRuleGroupConfigProperty>();
    ret.addPropertyResult('awsManagedRulesBotControlRuleSet', 'AWSManagedRulesBotControlRuleSet', properties.AWSManagedRulesBotControlRuleSet != null ? CfnWebACLAWSManagedRulesBotControlRuleSetPropertyFromCloudFormation(properties.AWSManagedRulesBotControlRuleSet) : undefined);
    ret.addPropertyResult('loginPath', 'LoginPath', properties.LoginPath != null ? cfn_parse.FromCloudFormation.getString(properties.LoginPath) : undefined);
    ret.addPropertyResult('passwordField', 'PasswordField', properties.PasswordField != null ? CfnWebACLFieldIdentifierPropertyFromCloudFormation(properties.PasswordField) : undefined);
    ret.addPropertyResult('payloadType', 'PayloadType', properties.PayloadType != null ? cfn_parse.FromCloudFormation.getString(properties.PayloadType) : undefined);
    ret.addPropertyResult('usernameField', 'UsernameField', properties.UsernameField != null ? CfnWebACLFieldIdentifierPropertyFromCloudFormation(properties.UsernameField) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A rule statement used to run the rules that are defined in a managed rule group. To use this, provide the vendor name and the name of the rule group in this statement.
     *
     * You cannot nest a `ManagedRuleGroupStatement` , for example for use inside a `NotStatement` or `OrStatement` . It can only be referenced as a top-level statement within a rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html
     */
    export interface ManagedRuleGroupStatementProperty {
        /**
         * Rules in the referenced rule group whose actions are set to `Count` .
         *
         * > Instead of this option, use `RuleActionOverrides` . It accepts any valid action setting, including `Count` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html#cfn-wafv2-webacl-managedrulegroupstatement-excludedrules
         */
        readonly excludedRules?: Array<CfnWebACL.ExcludedRuleProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Additional information that's used by a managed rule group. Many managed rule groups don't require this.
         *
         * Use the `AWSManagedRulesBotControlRuleSet` configuration object to configure the protection level that you want the Bot Control rule group to use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html#cfn-wafv2-webacl-managedrulegroupstatement-managedrulegroupconfigs
         */
        readonly managedRuleGroupConfigs?: Array<CfnWebACL.ManagedRuleGroupConfigProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the managed rule group. You use this, along with the vendor name, to identify the rule group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html#cfn-wafv2-webacl-managedrulegroupstatement-name
         */
        readonly name: string;
        /**
         * Action settings to use in the place of the rule actions that are configured inside the rule group. You specify one override for each rule whose action you want to change.
         *
         * You can use overrides for testing, for example you can override all of rule actions to `Count` and then monitor the resulting count metrics to understand how the rule group would handle your web traffic. You can also permanently override some or all actions, to modify how the rule group manages your web traffic.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html#cfn-wafv2-webacl-managedrulegroupstatement-ruleactionoverrides
         */
        readonly ruleActionOverrides?: Array<CfnWebACL.RuleActionOverrideProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * An optional nested statement that narrows the scope of the web requests that are evaluated by the managed rule group. Requests are only evaluated by the rule group if they match the scope-down statement. You can use any nestable `Statement` in the scope-down statement, and you can nest statements at any level, the same as you can for a rule statement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html#cfn-wafv2-webacl-managedrulegroupstatement-scopedownstatement
         */
        readonly scopeDownStatement?: CfnWebACL.StatementProperty | cdk.IResolvable;
        /**
         * The name of the managed rule group vendor. You use this, along with the rule group name, to identify the rule group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html#cfn-wafv2-webacl-managedrulegroupstatement-vendorname
         */
        readonly vendorName: string;
        /**
         * The version of the managed rule group to use. If you specify this, the version setting is fixed until you change it. If you don't specify this, AWS WAF uses the vendor's default version, and then keeps the version at the vendor's default when the vendor updates the managed rule group settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-managedrulegroupstatement.html#cfn-wafv2-webacl-managedrulegroupstatement-version
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ManagedRuleGroupStatementProperty`
 *
 * @param properties - the TypeScript properties of a `ManagedRuleGroupStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_ManagedRuleGroupStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('excludedRules', cdk.listValidator(CfnWebACL_ExcludedRulePropertyValidator))(properties.excludedRules));
    errors.collect(cdk.propertyValidator('managedRuleGroupConfigs', cdk.listValidator(CfnWebACL_ManagedRuleGroupConfigPropertyValidator))(properties.managedRuleGroupConfigs));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('ruleActionOverrides', cdk.listValidator(CfnWebACL_RuleActionOverridePropertyValidator))(properties.ruleActionOverrides));
    errors.collect(cdk.propertyValidator('scopeDownStatement', CfnWebACL_StatementPropertyValidator)(properties.scopeDownStatement));
    errors.collect(cdk.propertyValidator('vendorName', cdk.requiredValidator)(properties.vendorName));
    errors.collect(cdk.propertyValidator('vendorName', cdk.validateString)(properties.vendorName));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "ManagedRuleGroupStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ManagedRuleGroupStatement` resource
 *
 * @param properties - the TypeScript properties of a `ManagedRuleGroupStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.ManagedRuleGroupStatement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLManagedRuleGroupStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_ManagedRuleGroupStatementPropertyValidator(properties).assertSuccess();
    return {
        ExcludedRules: cdk.listMapper(cfnWebACLExcludedRulePropertyToCloudFormation)(properties.excludedRules),
        ManagedRuleGroupConfigs: cdk.listMapper(cfnWebACLManagedRuleGroupConfigPropertyToCloudFormation)(properties.managedRuleGroupConfigs),
        Name: cdk.stringToCloudFormation(properties.name),
        RuleActionOverrides: cdk.listMapper(cfnWebACLRuleActionOverridePropertyToCloudFormation)(properties.ruleActionOverrides),
        ScopeDownStatement: cfnWebACLStatementPropertyToCloudFormation(properties.scopeDownStatement),
        VendorName: cdk.stringToCloudFormation(properties.vendorName),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnWebACLManagedRuleGroupStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.ManagedRuleGroupStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.ManagedRuleGroupStatementProperty>();
    ret.addPropertyResult('excludedRules', 'ExcludedRules', properties.ExcludedRules != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLExcludedRulePropertyFromCloudFormation)(properties.ExcludedRules) : undefined);
    ret.addPropertyResult('managedRuleGroupConfigs', 'ManagedRuleGroupConfigs', properties.ManagedRuleGroupConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLManagedRuleGroupConfigPropertyFromCloudFormation)(properties.ManagedRuleGroupConfigs) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('ruleActionOverrides', 'RuleActionOverrides', properties.RuleActionOverrides != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLRuleActionOverridePropertyFromCloudFormation)(properties.RuleActionOverrides) : undefined);
    ret.addPropertyResult('scopeDownStatement', 'ScopeDownStatement', properties.ScopeDownStatement != null ? CfnWebACLStatementPropertyFromCloudFormation(properties.ScopeDownStatement) : undefined);
    ret.addPropertyResult('vendorName', 'VendorName', cfn_parse.FromCloudFormation.getString(properties.VendorName));
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A logical rule statement used to negate the results of another rule statement. You provide one `Statement` within the `NotStatement` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-notstatement.html
     */
    export interface NotStatementProperty {
        /**
         * The statement to negate. You can use any statement that can be nested.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-notstatement.html#cfn-wafv2-webacl-notstatement-statement
         */
        readonly statement: CfnWebACL.StatementProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NotStatementProperty`
 *
 * @param properties - the TypeScript properties of a `NotStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_NotStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('statement', cdk.requiredValidator)(properties.statement));
    errors.collect(cdk.propertyValidator('statement', CfnWebACL_StatementPropertyValidator)(properties.statement));
    return errors.wrap('supplied properties not correct for "NotStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.NotStatement` resource
 *
 * @param properties - the TypeScript properties of a `NotStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.NotStatement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLNotStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_NotStatementPropertyValidator(properties).assertSuccess();
    return {
        Statement: cfnWebACLStatementPropertyToCloudFormation(properties.statement),
    };
}

// @ts-ignore TS6133
function CfnWebACLNotStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.NotStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.NotStatementProperty>();
    ret.addPropertyResult('statement', 'Statement', CfnWebACLStatementPropertyFromCloudFormation(properties.Statement));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A logical rule statement used to combine other rule statements with OR logic. You provide more than one `Statement` within the `OrStatement` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-orstatement.html
     */
    export interface OrStatementProperty {
        /**
         * The statements to combine with OR logic. You can use any statements that can be nested.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-orstatement.html#cfn-wafv2-webacl-orstatement-statements
         */
        readonly statements: Array<CfnWebACL.StatementProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `OrStatementProperty`
 *
 * @param properties - the TypeScript properties of a `OrStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_OrStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('statements', cdk.requiredValidator)(properties.statements));
    errors.collect(cdk.propertyValidator('statements', cdk.listValidator(CfnWebACL_StatementPropertyValidator))(properties.statements));
    return errors.wrap('supplied properties not correct for "OrStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.OrStatement` resource
 *
 * @param properties - the TypeScript properties of a `OrStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.OrStatement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLOrStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_OrStatementPropertyValidator(properties).assertSuccess();
    return {
        Statements: cdk.listMapper(cfnWebACLStatementPropertyToCloudFormation)(properties.statements),
    };
}

// @ts-ignore TS6133
function CfnWebACLOrStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.OrStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.OrStatementProperty>();
    ret.addPropertyResult('statements', 'Statements', cfn_parse.FromCloudFormation.getArray(CfnWebACLStatementPropertyFromCloudFormation)(properties.Statements));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * The action to use in the place of the action that results from the rule group evaluation. Set the override action to none to leave the result of the rule group alone. Set it to count to override the result to count only.
     *
     * You can only use this for rule statements that reference a rule group, like `RuleGroupReferenceStatement` and `ManagedRuleGroupStatement` .
     *
     * > This option is usually set to none. It does not affect how the rules in the rule group are evaluated. If you want the rules in the rule group to only count matches, do not use this and instead use the rule action override option, with `Count` action, in your rule group reference statement settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-overrideaction.html
     */
    export interface OverrideActionProperty {
        /**
         * Override the rule group evaluation result to count only.
         *
         * > This option is usually set to none. It does not affect how the rules in the rule group are evaluated. If you want the rules in the rule group to only count matches, do not use this and instead use the rule action override option, with `Count` action, in your rule group reference statement settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-overrideaction.html#cfn-wafv2-webacl-overrideaction-count
         */
        readonly count?: any | cdk.IResolvable;
        /**
         * Don't override the rule group evaluation result. This is the most common setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-overrideaction.html#cfn-wafv2-webacl-overrideaction-none
         */
        readonly none?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `OverrideActionProperty`
 *
 * @param properties - the TypeScript properties of a `OverrideActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_OverrideActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('count', cdk.validateObject)(properties.count));
    errors.collect(cdk.propertyValidator('none', cdk.validateObject)(properties.none));
    return errors.wrap('supplied properties not correct for "OverrideActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.OverrideAction` resource
 *
 * @param properties - the TypeScript properties of a `OverrideActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.OverrideAction` resource.
 */
// @ts-ignore TS6133
function cfnWebACLOverrideActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_OverrideActionPropertyValidator(properties).assertSuccess();
    return {
        Count: cdk.objectToCloudFormation(properties.count),
        None: cdk.objectToCloudFormation(properties.none),
    };
}

// @ts-ignore TS6133
function CfnWebACLOverrideActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.OverrideActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.OverrideActionProperty>();
    ret.addPropertyResult('count', 'Count', properties.Count != null ? cfn_parse.FromCloudFormation.getAny(properties.Count) : undefined);
    ret.addPropertyResult('none', 'None', properties.None != null ? cfn_parse.FromCloudFormation.getAny(properties.None) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A rate-based rule tracks the rate of requests for each originating IP address, and triggers the rule action when the rate exceeds a limit that you specify on the number of requests in any 5-minute time span. You can use this to put a temporary block on requests from an IP address that is sending excessive requests.
     *
     * AWS WAF tracks and manages web requests separately for each instance of a rate-based rule that you use. For example, if you provide the same rate-based rule settings in two web ACLs, each of the two rule statements represents a separate instance of the rate-based rule and gets its own tracking and management by AWS WAF . If you define a rate-based rule inside a rule group, and then use that rule group in multiple places, each use creates a separate instance of the rate-based rule that gets its own tracking and management by AWS WAF .
     *
     * When the rule action triggers, AWS WAF blocks additional requests from the IP address until the request rate falls below the limit.
     *
     * You can optionally nest another statement inside the rate-based statement, to narrow the scope of the rule so that it only counts requests that match the nested statement. For example, based on recent requests that you have seen from an attacker, you might create a rate-based rule with a nested AND rule statement that contains the following nested statements:
     *
     * - An IP match statement with an IP set that specified the address 192.0.2.44.
     * - A string match statement that searches in the User-Agent header for the string BadBot.
     *
     * In this rate-based rule, you also define a rate limit. For this example, the rate limit is 1,000. Requests that meet the criteria of both of the nested statements are counted. If the count exceeds 1,000 requests per five minutes, the rule action triggers. Requests that do not meet the criteria of both of the nested statements are not counted towards the rate limit and are not affected by this rule.
     *
     * You cannot nest a `RateBasedStatement` inside another statement, for example inside a `NotStatement` or `OrStatement` . You can define a `RateBasedStatement` inside a web ACL and inside a rule group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatement.html
     */
    export interface RateBasedStatementProperty {
        /**
         * Setting that indicates how to aggregate the request counts. The options are the following:
         *
         * - IP - Aggregate the request counts on the IP address from the web request origin.
         * - FORWARDED_IP - Aggregate the request counts on the first IP address in an HTTP header. If you use this, configure the `ForwardedIPConfig` , to specify the header to use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatement.html#cfn-wafv2-webacl-ratebasedstatement-aggregatekeytype
         */
        readonly aggregateKeyType: string;
        /**
         * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin. Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.
         *
         * > If the specified header isn't present in the request, AWS WAF doesn't apply the rule to the web request at all.
         *
         * This is required if `AggregateKeyType` is set to `FORWARDED_IP` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatement.html#cfn-wafv2-webacl-ratebasedstatement-forwardedipconfig
         */
        readonly forwardedIpConfig?: CfnWebACL.ForwardedIPConfigurationProperty | cdk.IResolvable;
        /**
         * The limit on requests per 5-minute period for a single originating IP address. If the statement includes a `ScopeDownStatement` , this limit is applied only to the requests that match the statement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatement.html#cfn-wafv2-webacl-ratebasedstatement-limit
         */
        readonly limit: number;
        /**
         * An optional nested statement that narrows the scope of the web requests that are evaluated by the rate-based statement. Requests are only tracked by the rate-based statement if they match the scope-down statement. You can use any nestable `Statement` in the scope-down statement, and you can nest statements at any level, the same as you can for a rule statement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ratebasedstatement.html#cfn-wafv2-webacl-ratebasedstatement-scopedownstatement
         */
        readonly scopeDownStatement?: CfnWebACL.StatementProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RateBasedStatementProperty`
 *
 * @param properties - the TypeScript properties of a `RateBasedStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_RateBasedStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('aggregateKeyType', cdk.requiredValidator)(properties.aggregateKeyType));
    errors.collect(cdk.propertyValidator('aggregateKeyType', cdk.validateString)(properties.aggregateKeyType));
    errors.collect(cdk.propertyValidator('forwardedIpConfig', CfnWebACL_ForwardedIPConfigurationPropertyValidator)(properties.forwardedIpConfig));
    errors.collect(cdk.propertyValidator('limit', cdk.requiredValidator)(properties.limit));
    errors.collect(cdk.propertyValidator('limit', cdk.validateNumber)(properties.limit));
    errors.collect(cdk.propertyValidator('scopeDownStatement', CfnWebACL_StatementPropertyValidator)(properties.scopeDownStatement));
    return errors.wrap('supplied properties not correct for "RateBasedStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.RateBasedStatement` resource
 *
 * @param properties - the TypeScript properties of a `RateBasedStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.RateBasedStatement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLRateBasedStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_RateBasedStatementPropertyValidator(properties).assertSuccess();
    return {
        AggregateKeyType: cdk.stringToCloudFormation(properties.aggregateKeyType),
        ForwardedIPConfig: cfnWebACLForwardedIPConfigurationPropertyToCloudFormation(properties.forwardedIpConfig),
        Limit: cdk.numberToCloudFormation(properties.limit),
        ScopeDownStatement: cfnWebACLStatementPropertyToCloudFormation(properties.scopeDownStatement),
    };
}

// @ts-ignore TS6133
function CfnWebACLRateBasedStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.RateBasedStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RateBasedStatementProperty>();
    ret.addPropertyResult('aggregateKeyType', 'AggregateKeyType', cfn_parse.FromCloudFormation.getString(properties.AggregateKeyType));
    ret.addPropertyResult('forwardedIpConfig', 'ForwardedIPConfig', properties.ForwardedIPConfig != null ? CfnWebACLForwardedIPConfigurationPropertyFromCloudFormation(properties.ForwardedIPConfig) : undefined);
    ret.addPropertyResult('limit', 'Limit', cfn_parse.FromCloudFormation.getNumber(properties.Limit));
    ret.addPropertyResult('scopeDownStatement', 'ScopeDownStatement', properties.ScopeDownStatement != null ? CfnWebACLStatementPropertyFromCloudFormation(properties.ScopeDownStatement) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A rule statement used to search web request components for a match against a single regular expression.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexmatchstatement.html
     */
    export interface RegexMatchStatementProperty {
        /**
         * The part of the web request that you want AWS WAF to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexmatchstatement.html#cfn-wafv2-webacl-regexmatchstatement-fieldtomatch
         */
        readonly fieldToMatch: CfnWebACL.FieldToMatchProperty | cdk.IResolvable;
        /**
         * The string representing the regular expression.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexmatchstatement.html#cfn-wafv2-webacl-regexmatchstatement-regexstring
         */
        readonly regexString: string;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexmatchstatement.html#cfn-wafv2-webacl-regexmatchstatement-texttransformations
         */
        readonly textTransformations: Array<CfnWebACL.TextTransformationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RegexMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `RegexMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_RegexMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnWebACL_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('regexString', cdk.requiredValidator)(properties.regexString));
    errors.collect(cdk.propertyValidator('regexString', cdk.validateString)(properties.regexString));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.requiredValidator)(properties.textTransformations));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.listValidator(CfnWebACL_TextTransformationPropertyValidator))(properties.textTransformations));
    return errors.wrap('supplied properties not correct for "RegexMatchStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.RegexMatchStatement` resource
 *
 * @param properties - the TypeScript properties of a `RegexMatchStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.RegexMatchStatement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLRegexMatchStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_RegexMatchStatementPropertyValidator(properties).assertSuccess();
    return {
        FieldToMatch: cfnWebACLFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        RegexString: cdk.stringToCloudFormation(properties.regexString),
        TextTransformations: cdk.listMapper(cfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations),
    };
}

// @ts-ignore TS6133
function CfnWebACLRegexMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.RegexMatchStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RegexMatchStatementProperty>();
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnWebACLFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('regexString', 'RegexString', cfn_parse.FromCloudFormation.getString(properties.RegexString));
    ret.addPropertyResult('textTransformations', 'TextTransformations', cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A rule statement used to search web request components for matches with regular expressions. To use this, create a `RegexPatternSet` that specifies the expressions that you want to detect, then use that set in this statement. A web request matches the pattern set rule statement if the request component matches any of the patterns in the set.
     *
     * Each regex pattern set rule statement references a regex pattern set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexpatternsetreferencestatement.html
     */
    export interface RegexPatternSetReferenceStatementProperty {
        /**
         * The Amazon Resource Name (ARN) of the `RegexPatternSet` that this statement references.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexpatternsetreferencestatement.html#cfn-wafv2-webacl-regexpatternsetreferencestatement-arn
         */
        readonly arn: string;
        /**
         * The part of the web request that you want AWS WAF to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexpatternsetreferencestatement.html#cfn-wafv2-webacl-regexpatternsetreferencestatement-fieldtomatch
         */
        readonly fieldToMatch: CfnWebACL.FieldToMatchProperty | cdk.IResolvable;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-regexpatternsetreferencestatement.html#cfn-wafv2-webacl-regexpatternsetreferencestatement-texttransformations
         */
        readonly textTransformations: Array<CfnWebACL.TextTransformationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RegexPatternSetReferenceStatementProperty`
 *
 * @param properties - the TypeScript properties of a `RegexPatternSetReferenceStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_RegexPatternSetReferenceStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnWebACL_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.requiredValidator)(properties.textTransformations));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.listValidator(CfnWebACL_TextTransformationPropertyValidator))(properties.textTransformations));
    return errors.wrap('supplied properties not correct for "RegexPatternSetReferenceStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.RegexPatternSetReferenceStatement` resource
 *
 * @param properties - the TypeScript properties of a `RegexPatternSetReferenceStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.RegexPatternSetReferenceStatement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLRegexPatternSetReferenceStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_RegexPatternSetReferenceStatementPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        FieldToMatch: cfnWebACLFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        TextTransformations: cdk.listMapper(cfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations),
    };
}

// @ts-ignore TS6133
function CfnWebACLRegexPatternSetReferenceStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.RegexPatternSetReferenceStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RegexPatternSetReferenceStatementProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnWebACLFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('textTransformations', 'TextTransformations', cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A single rule, which you can use in a `WebACL` or `RuleGroup` to identify web requests that you want to allow, block, or count. Each rule includes one top-level `Statement` that AWS WAF uses to identify matching web requests, and parameters that govern how AWS WAF handles them.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html
     */
    export interface RuleProperty {
        /**
         * The action that AWS WAF should take on a web request when it matches the rule's statement. Settings at the web ACL level can override the rule action setting.
         *
         * This is used only for rules whose statements don't reference a rule group. Rule statements that reference a rule group are `RuleGroupReferenceStatement` and `ManagedRuleGroupStatement` .
         *
         * You must set either this `Action` setting or the rule's `OverrideAction` , but not both:
         *
         * - If the rule statement doesn't reference a rule group, you must set this rule action setting and you must not set the rule's override action setting.
         * - If the rule statement references a rule group, you must not set this action setting, because the actions are already set on the rules inside the rule group. You must set the rule's override action setting to indicate specifically whether to override the actions that are set on the rules in the rule group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-action
         */
        readonly action?: CfnWebACL.RuleActionProperty | cdk.IResolvable;
        /**
         * Specifies how AWS WAF should handle `CAPTCHA` evaluations. If you don't specify this, AWS WAF uses the `CAPTCHA` configuration that's defined for the web ACL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-captchaconfig
         */
        readonly captchaConfig?: CfnWebACL.CaptchaConfigProperty | cdk.IResolvable;
        /**
         * Specifies how AWS WAF should handle `Challenge` evaluations. If you don't specify this, AWS WAF uses the challenge configuration that's defined for the web ACL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-challengeconfig
         */
        readonly challengeConfig?: CfnWebACL.ChallengeConfigProperty | cdk.IResolvable;
        /**
         * The name of the rule. You can't change the name of a `Rule` after you create it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-name
         */
        readonly name: string;
        /**
         * The override action to apply to the rules in a rule group, instead of the individual rule action settings. This is used only for rules whose statements reference a rule group. Rule statements that reference a rule group are `RuleGroupReferenceStatement` and `ManagedRuleGroupStatement` .
         *
         * Set the override action to none to leave the rule group rule actions in effect. Set it to count to only count matches, regardless of the rule action settings.
         *
         * You must set either this `OverrideAction` setting or the `Action` setting, but not both:
         *
         * - If the rule statement references a rule group, you must set this override action setting and you must not set the rule's action setting.
         * - If the rule statement doesn't reference a rule group, you must set the rule action setting and you must not set the rule's override action setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-overrideaction
         */
        readonly overrideAction?: CfnWebACL.OverrideActionProperty | cdk.IResolvable;
        /**
         * If you define more than one `Rule` in a `WebACL` , AWS WAF evaluates each request against the `Rules` in order based on the value of `Priority` . AWS WAF processes rules with lower priority first. The priorities don't need to be consecutive, but they must all be different.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-priority
         */
        readonly priority: number;
        /**
         * Labels to apply to web requests that match the rule match statement. AWS WAF applies fully qualified labels to matching web requests. A fully qualified label is the concatenation of a label namespace and a rule label. The rule's rule group or web ACL defines the label namespace.
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-rulelabels
         */
        readonly ruleLabels?: Array<CfnWebACL.LabelProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The AWS WAF processing statement for the rule, for example `ByteMatchStatement` or `SizeConstraintStatement` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-statement
         */
        readonly statement: CfnWebACL.StatementProperty | cdk.IResolvable;
        /**
         * Defines and enables Amazon CloudWatch metrics and web request sample collection.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rule.html#cfn-wafv2-webacl-rule-visibilityconfig
         */
        readonly visibilityConfig: CfnWebACL.VisibilityConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_RulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', CfnWebACL_RuleActionPropertyValidator)(properties.action));
    errors.collect(cdk.propertyValidator('captchaConfig', CfnWebACL_CaptchaConfigPropertyValidator)(properties.captchaConfig));
    errors.collect(cdk.propertyValidator('challengeConfig', CfnWebACL_ChallengeConfigPropertyValidator)(properties.challengeConfig));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('overrideAction', CfnWebACL_OverrideActionPropertyValidator)(properties.overrideAction));
    errors.collect(cdk.propertyValidator('priority', cdk.requiredValidator)(properties.priority));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('ruleLabels', cdk.listValidator(CfnWebACL_LabelPropertyValidator))(properties.ruleLabels));
    errors.collect(cdk.propertyValidator('statement', cdk.requiredValidator)(properties.statement));
    errors.collect(cdk.propertyValidator('statement', CfnWebACL_StatementPropertyValidator)(properties.statement));
    errors.collect(cdk.propertyValidator('visibilityConfig', cdk.requiredValidator)(properties.visibilityConfig));
    errors.collect(cdk.propertyValidator('visibilityConfig', CfnWebACL_VisibilityConfigPropertyValidator)(properties.visibilityConfig));
    return errors.wrap('supplied properties not correct for "RuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.Rule` resource
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.Rule` resource.
 */
// @ts-ignore TS6133
function cfnWebACLRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_RulePropertyValidator(properties).assertSuccess();
    return {
        Action: cfnWebACLRuleActionPropertyToCloudFormation(properties.action),
        CaptchaConfig: cfnWebACLCaptchaConfigPropertyToCloudFormation(properties.captchaConfig),
        ChallengeConfig: cfnWebACLChallengeConfigPropertyToCloudFormation(properties.challengeConfig),
        Name: cdk.stringToCloudFormation(properties.name),
        OverrideAction: cfnWebACLOverrideActionPropertyToCloudFormation(properties.overrideAction),
        Priority: cdk.numberToCloudFormation(properties.priority),
        RuleLabels: cdk.listMapper(cfnWebACLLabelPropertyToCloudFormation)(properties.ruleLabels),
        Statement: cfnWebACLStatementPropertyToCloudFormation(properties.statement),
        VisibilityConfig: cfnWebACLVisibilityConfigPropertyToCloudFormation(properties.visibilityConfig),
    };
}

// @ts-ignore TS6133
function CfnWebACLRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.RuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RuleProperty>();
    ret.addPropertyResult('action', 'Action', properties.Action != null ? CfnWebACLRuleActionPropertyFromCloudFormation(properties.Action) : undefined);
    ret.addPropertyResult('captchaConfig', 'CaptchaConfig', properties.CaptchaConfig != null ? CfnWebACLCaptchaConfigPropertyFromCloudFormation(properties.CaptchaConfig) : undefined);
    ret.addPropertyResult('challengeConfig', 'ChallengeConfig', properties.ChallengeConfig != null ? CfnWebACLChallengeConfigPropertyFromCloudFormation(properties.ChallengeConfig) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('overrideAction', 'OverrideAction', properties.OverrideAction != null ? CfnWebACLOverrideActionPropertyFromCloudFormation(properties.OverrideAction) : undefined);
    ret.addPropertyResult('priority', 'Priority', cfn_parse.FromCloudFormation.getNumber(properties.Priority));
    ret.addPropertyResult('ruleLabels', 'RuleLabels', properties.RuleLabels != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLLabelPropertyFromCloudFormation)(properties.RuleLabels) : undefined);
    ret.addPropertyResult('statement', 'Statement', CfnWebACLStatementPropertyFromCloudFormation(properties.Statement));
    ret.addPropertyResult('visibilityConfig', 'VisibilityConfig', CfnWebACLVisibilityConfigPropertyFromCloudFormation(properties.VisibilityConfig));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * The action that AWS WAF should take on a web request when it matches a rule's statement. Settings at the web ACL level can override the rule action setting.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleaction.html
     */
    export interface RuleActionProperty {
        /**
         * Instructs AWS WAF to allow the web request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleaction.html#cfn-wafv2-webacl-ruleaction-allow
         */
        readonly allow?: CfnWebACL.AllowActionProperty | cdk.IResolvable;
        /**
         * Instructs AWS WAF to block the web request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleaction.html#cfn-wafv2-webacl-ruleaction-block
         */
        readonly block?: CfnWebACL.BlockActionProperty | cdk.IResolvable;
        /**
         * Specifies that AWS WAF should run a `CAPTCHA` check against the request:
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleaction.html#cfn-wafv2-webacl-ruleaction-captcha
         */
        readonly captcha?: CfnWebACL.CaptchaActionProperty | cdk.IResolvable;
        /**
         * Instructs AWS WAF to run a `Challenge` check against the web request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleaction.html#cfn-wafv2-webacl-ruleaction-challenge
         */
        readonly challenge?: CfnWebACL.ChallengeActionProperty | cdk.IResolvable;
        /**
         * Instructs AWS WAF to count the web request and then continue evaluating the request using the remaining rules in the web ACL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleaction.html#cfn-wafv2-webacl-ruleaction-count
         */
        readonly count?: CfnWebACL.CountActionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RuleActionProperty`
 *
 * @param properties - the TypeScript properties of a `RuleActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_RuleActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allow', CfnWebACL_AllowActionPropertyValidator)(properties.allow));
    errors.collect(cdk.propertyValidator('block', CfnWebACL_BlockActionPropertyValidator)(properties.block));
    errors.collect(cdk.propertyValidator('captcha', CfnWebACL_CaptchaActionPropertyValidator)(properties.captcha));
    errors.collect(cdk.propertyValidator('challenge', CfnWebACL_ChallengeActionPropertyValidator)(properties.challenge));
    errors.collect(cdk.propertyValidator('count', CfnWebACL_CountActionPropertyValidator)(properties.count));
    return errors.wrap('supplied properties not correct for "RuleActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.RuleAction` resource
 *
 * @param properties - the TypeScript properties of a `RuleActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.RuleAction` resource.
 */
// @ts-ignore TS6133
function cfnWebACLRuleActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_RuleActionPropertyValidator(properties).assertSuccess();
    return {
        Allow: cfnWebACLAllowActionPropertyToCloudFormation(properties.allow),
        Block: cfnWebACLBlockActionPropertyToCloudFormation(properties.block),
        Captcha: cfnWebACLCaptchaActionPropertyToCloudFormation(properties.captcha),
        Challenge: cfnWebACLChallengeActionPropertyToCloudFormation(properties.challenge),
        Count: cfnWebACLCountActionPropertyToCloudFormation(properties.count),
    };
}

// @ts-ignore TS6133
function CfnWebACLRuleActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.RuleActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RuleActionProperty>();
    ret.addPropertyResult('allow', 'Allow', properties.Allow != null ? CfnWebACLAllowActionPropertyFromCloudFormation(properties.Allow) : undefined);
    ret.addPropertyResult('block', 'Block', properties.Block != null ? CfnWebACLBlockActionPropertyFromCloudFormation(properties.Block) : undefined);
    ret.addPropertyResult('captcha', 'Captcha', properties.Captcha != null ? CfnWebACLCaptchaActionPropertyFromCloudFormation(properties.Captcha) : undefined);
    ret.addPropertyResult('challenge', 'Challenge', properties.Challenge != null ? CfnWebACLChallengeActionPropertyFromCloudFormation(properties.Challenge) : undefined);
    ret.addPropertyResult('count', 'Count', properties.Count != null ? CfnWebACLCountActionPropertyFromCloudFormation(properties.Count) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Action setting to use in the place of a rule action that is configured inside the rule group. You specify one override for each rule whose action you want to change.
     *
     * You can use overrides for testing, for example you can override all of rule actions to `Count` and then monitor the resulting count metrics to understand how the rule group would handle your web traffic. You can also permanently override some or all actions, to modify how the rule group manages your web traffic.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleactionoverride.html
     */
    export interface RuleActionOverrideProperty {
        /**
         * The override action to use, in place of the configured action of the rule in the rule group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleactionoverride.html#cfn-wafv2-webacl-ruleactionoverride-actiontouse
         */
        readonly actionToUse: CfnWebACL.RuleActionProperty | cdk.IResolvable;
        /**
         * The name of the rule to override.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleactionoverride.html#cfn-wafv2-webacl-ruleactionoverride-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `RuleActionOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `RuleActionOverrideProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_RuleActionOverridePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actionToUse', cdk.requiredValidator)(properties.actionToUse));
    errors.collect(cdk.propertyValidator('actionToUse', CfnWebACL_RuleActionPropertyValidator)(properties.actionToUse));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "RuleActionOverrideProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.RuleActionOverride` resource
 *
 * @param properties - the TypeScript properties of a `RuleActionOverrideProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.RuleActionOverride` resource.
 */
// @ts-ignore TS6133
function cfnWebACLRuleActionOverridePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_RuleActionOverridePropertyValidator(properties).assertSuccess();
    return {
        ActionToUse: cfnWebACLRuleActionPropertyToCloudFormation(properties.actionToUse),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnWebACLRuleActionOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.RuleActionOverrideProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RuleActionOverrideProperty>();
    ret.addPropertyResult('actionToUse', 'ActionToUse', CfnWebACLRuleActionPropertyFromCloudFormation(properties.ActionToUse));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A rule statement used to run the rules that are defined in a `RuleGroup` . To use this, create a rule group with your rules, then provide the ARN of the rule group in this statement.
     *
     * You cannot nest a `RuleGroupReferenceStatement` , for example for use inside a `NotStatement` or `OrStatement` . You can only use a rule group reference statement at the top level inside a web ACL.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rulegroupreferencestatement.html
     */
    export interface RuleGroupReferenceStatementProperty {
        /**
         * The Amazon Resource Name (ARN) of the entity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rulegroupreferencestatement.html#cfn-wafv2-webacl-rulegroupreferencestatement-arn
         */
        readonly arn: string;
        /**
         * Rules in the referenced rule group whose actions are set to `Count` .
         *
         * > Instead of this option, use `RuleActionOverrides` . It accepts any valid action setting, including `Count` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rulegroupreferencestatement.html#cfn-wafv2-webacl-rulegroupreferencestatement-excludedrules
         */
        readonly excludedRules?: Array<CfnWebACL.ExcludedRuleProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Action settings to use in the place of the rule actions that are configured inside the rule group. You specify one override for each rule whose action you want to change.
         *
         * You can use overrides for testing, for example you can override all of rule actions to `Count` and then monitor the resulting count metrics to understand how the rule group would handle your web traffic. You can also permanently override some or all actions, to modify how the rule group manages your web traffic.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-rulegroupreferencestatement.html#cfn-wafv2-webacl-rulegroupreferencestatement-ruleactionoverrides
         */
        readonly ruleActionOverrides?: Array<CfnWebACL.RuleActionOverrideProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RuleGroupReferenceStatementProperty`
 *
 * @param properties - the TypeScript properties of a `RuleGroupReferenceStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_RuleGroupReferenceStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('excludedRules', cdk.listValidator(CfnWebACL_ExcludedRulePropertyValidator))(properties.excludedRules));
    errors.collect(cdk.propertyValidator('ruleActionOverrides', cdk.listValidator(CfnWebACL_RuleActionOverridePropertyValidator))(properties.ruleActionOverrides));
    return errors.wrap('supplied properties not correct for "RuleGroupReferenceStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.RuleGroupReferenceStatement` resource
 *
 * @param properties - the TypeScript properties of a `RuleGroupReferenceStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.RuleGroupReferenceStatement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLRuleGroupReferenceStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_RuleGroupReferenceStatementPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        ExcludedRules: cdk.listMapper(cfnWebACLExcludedRulePropertyToCloudFormation)(properties.excludedRules),
        RuleActionOverrides: cdk.listMapper(cfnWebACLRuleActionOverridePropertyToCloudFormation)(properties.ruleActionOverrides),
    };
}

// @ts-ignore TS6133
function CfnWebACLRuleGroupReferenceStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.RuleGroupReferenceStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.RuleGroupReferenceStatementProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addPropertyResult('excludedRules', 'ExcludedRules', properties.ExcludedRules != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLExcludedRulePropertyFromCloudFormation)(properties.ExcludedRules) : undefined);
    ret.addPropertyResult('ruleActionOverrides', 'RuleActionOverrides', properties.RuleActionOverrides != null ? cfn_parse.FromCloudFormation.getArray(CfnWebACLRuleActionOverridePropertyFromCloudFormation)(properties.RuleActionOverrides) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Inspect one of the headers in the web request, identified by name, for example, `User-Agent` or `Referer` . The name isn't case sensitive.
     *
     * You can filter and inspect all headers with the `FieldToMatch` setting `Headers` .
     *
     * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
     *
     * Example JSON: `"SingleHeader": { "Name": "haystack" }`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-singleheader.html
     */
    export interface SingleHeaderProperty {
        /**
         * The name of the query header to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-singleheader.html#cfn-wafv2-webacl-singleheader-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `SingleHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `SingleHeaderProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_SingleHeaderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "SingleHeaderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.SingleHeader` resource
 *
 * @param properties - the TypeScript properties of a `SingleHeaderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.SingleHeader` resource.
 */
// @ts-ignore TS6133
function cfnWebACLSingleHeaderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_SingleHeaderPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnWebACLSingleHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.SingleHeaderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.SingleHeaderProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Inspect one query argument in the web request, identified by name, for example *UserName* or *SalesRegion* . The name isn't case sensitive.
     *
     * This is used to indicate the web request component to inspect, in the `FieldToMatch` specification.
     *
     * Example JSON: `"SingleQueryArgument": { "Name": "myArgument" }`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-singlequeryargument.html
     */
    export interface SingleQueryArgumentProperty {
        /**
         * The name of the query argument to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-singlequeryargument.html#cfn-wafv2-webacl-singlequeryargument-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `SingleQueryArgumentProperty`
 *
 * @param properties - the TypeScript properties of a `SingleQueryArgumentProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_SingleQueryArgumentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "SingleQueryArgumentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.SingleQueryArgument` resource
 *
 * @param properties - the TypeScript properties of a `SingleQueryArgumentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.SingleQueryArgument` resource.
 */
// @ts-ignore TS6133
function cfnWebACLSingleQueryArgumentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_SingleQueryArgumentPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnWebACLSingleQueryArgumentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.SingleQueryArgumentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.SingleQueryArgumentProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A rule statement that compares a number of bytes against the size of a request component, using a comparison operator, such as greater than (>) or less than (<). For example, you can use a size constraint statement to look for query strings that are longer than 100 bytes.
     *
     * If you configure AWS WAF to inspect the request body, AWS WAF inspects only the first 8192 bytes (8 KB). If the request body for your web requests never exceeds 8192 bytes, you could use a size constraint statement to block requests that have a request body greater than 8192 bytes.
     *
     * If you choose URI for the value of Part of the request to filter on, the slash (/) in the URI counts as one character. For example, the URI `/logo.jpg` is nine characters long.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sizeconstraintstatement.html
     */
    export interface SizeConstraintStatementProperty {
        /**
         * The operator to use to compare the request part to the size setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sizeconstraintstatement.html#cfn-wafv2-webacl-sizeconstraintstatement-comparisonoperator
         */
        readonly comparisonOperator: string;
        /**
         * The part of the web request that you want AWS WAF to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sizeconstraintstatement.html#cfn-wafv2-webacl-sizeconstraintstatement-fieldtomatch
         */
        readonly fieldToMatch: CfnWebACL.FieldToMatchProperty | cdk.IResolvable;
        /**
         * The size, in byte, to compare to the request part, after any transformations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sizeconstraintstatement.html#cfn-wafv2-webacl-sizeconstraintstatement-size
         */
        readonly size: number;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sizeconstraintstatement.html#cfn-wafv2-webacl-sizeconstraintstatement-texttransformations
         */
        readonly textTransformations: Array<CfnWebACL.TextTransformationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SizeConstraintStatementProperty`
 *
 * @param properties - the TypeScript properties of a `SizeConstraintStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_SizeConstraintStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.requiredValidator)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.validateString)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnWebACL_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('size', cdk.requiredValidator)(properties.size));
    errors.collect(cdk.propertyValidator('size', cdk.validateNumber)(properties.size));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.requiredValidator)(properties.textTransformations));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.listValidator(CfnWebACL_TextTransformationPropertyValidator))(properties.textTransformations));
    return errors.wrap('supplied properties not correct for "SizeConstraintStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.SizeConstraintStatement` resource
 *
 * @param properties - the TypeScript properties of a `SizeConstraintStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.SizeConstraintStatement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLSizeConstraintStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_SizeConstraintStatementPropertyValidator(properties).assertSuccess();
    return {
        ComparisonOperator: cdk.stringToCloudFormation(properties.comparisonOperator),
        FieldToMatch: cfnWebACLFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        Size: cdk.numberToCloudFormation(properties.size),
        TextTransformations: cdk.listMapper(cfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations),
    };
}

// @ts-ignore TS6133
function CfnWebACLSizeConstraintStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.SizeConstraintStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.SizeConstraintStatementProperty>();
    ret.addPropertyResult('comparisonOperator', 'ComparisonOperator', cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator));
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnWebACLFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('size', 'Size', cfn_parse.FromCloudFormation.getNumber(properties.Size));
    ret.addPropertyResult('textTransformations', 'TextTransformations', cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A rule statement that inspects for malicious SQL code. Attackers insert malicious SQL code into web requests to do things like modify your database or extract data from it.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sqlimatchstatement.html
     */
    export interface SqliMatchStatementProperty {
        /**
         * The part of the web request that you want AWS WAF to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sqlimatchstatement.html#cfn-wafv2-webacl-sqlimatchstatement-fieldtomatch
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sqlimatchstatement.html#cfn-wafv2-webacl-sqlimatchstatement-sensitivitylevel
         */
        readonly sensitivityLevel?: string;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-sqlimatchstatement.html#cfn-wafv2-webacl-sqlimatchstatement-texttransformations
         */
        readonly textTransformations: Array<CfnWebACL.TextTransformationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SqliMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `SqliMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_SqliMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnWebACL_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('sensitivityLevel', cdk.validateString)(properties.sensitivityLevel));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.requiredValidator)(properties.textTransformations));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.listValidator(CfnWebACL_TextTransformationPropertyValidator))(properties.textTransformations));
    return errors.wrap('supplied properties not correct for "SqliMatchStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.SqliMatchStatement` resource
 *
 * @param properties - the TypeScript properties of a `SqliMatchStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.SqliMatchStatement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLSqliMatchStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_SqliMatchStatementPropertyValidator(properties).assertSuccess();
    return {
        FieldToMatch: cfnWebACLFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        SensitivityLevel: cdk.stringToCloudFormation(properties.sensitivityLevel),
        TextTransformations: cdk.listMapper(cfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations),
    };
}

// @ts-ignore TS6133
function CfnWebACLSqliMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.SqliMatchStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.SqliMatchStatementProperty>();
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnWebACLFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('sensitivityLevel', 'SensitivityLevel', properties.SensitivityLevel != null ? cfn_parse.FromCloudFormation.getString(properties.SensitivityLevel) : undefined);
    ret.addPropertyResult('textTransformations', 'TextTransformations', cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * The processing guidance for a rule, used by AWS WAF to determine whether a web request matches the rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html
     */
    export interface StatementProperty {
        /**
         * A logical rule statement used to combine other rule statements with AND logic. You provide more than one `Statement` within the `AndStatement` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-andstatement
         */
        readonly andStatement?: CfnWebACL.AndStatementProperty | cdk.IResolvable;
        /**
         * A rule statement that defines a string match search for AWS WAF to apply to web requests. The byte match statement provides the bytes to search for, the location in requests that you want AWS WAF to search, and other settings. The bytes to search for are typically a string that corresponds with ASCII characters. In the AWS WAF console and the developer guide, this is called a string match statement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-bytematchstatement
         */
        readonly byteMatchStatement?: CfnWebACL.ByteMatchStatementProperty | cdk.IResolvable;
        /**
         * A rule statement that labels web requests by country and region and that matches against web requests based on country code. A geo match rule labels every request that it inspects regardless of whether it finds a match.
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-geomatchstatement
         */
        readonly geoMatchStatement?: CfnWebACL.GeoMatchStatementProperty | cdk.IResolvable;
        /**
         * A rule statement used to detect web requests coming from particular IP addresses or address ranges. To use this, create an `IPSet` that specifies the addresses you want to detect, then use the ARN of that set in this statement.
         *
         * Each IP set rule statement references an IP set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-ipsetreferencestatement
         */
        readonly ipSetReferenceStatement?: CfnWebACL.IPSetReferenceStatementProperty | cdk.IResolvable;
        /**
         * A rule statement to match against labels that have been added to the web request by rules that have already run in the web ACL.
         *
         * The label match statement provides the label or namespace string to search for. The label string can represent a part or all of the fully qualified label name that had been added to the web request. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label. If you do not provide the fully qualified name in your label match string, AWS WAF performs the search for labels that were added in the same context as the label match statement.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-labelmatchstatement
         */
        readonly labelMatchStatement?: CfnWebACL.LabelMatchStatementProperty | cdk.IResolvable;
        /**
         * A rule statement used to run the rules that are defined in a managed rule group. To use this, provide the vendor name and the name of the rule group in this statement.
         *
         * You cannot nest a `ManagedRuleGroupStatement` , for example for use inside a `NotStatement` or `OrStatement` . It can only be referenced as a top-level statement within a rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-managedrulegroupstatement
         */
        readonly managedRuleGroupStatement?: CfnWebACL.ManagedRuleGroupStatementProperty | cdk.IResolvable;
        /**
         * A logical rule statement used to negate the results of another rule statement. You provide one `Statement` within the `NotStatement` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-notstatement
         */
        readonly notStatement?: CfnWebACL.NotStatementProperty | cdk.IResolvable;
        /**
         * A logical rule statement used to combine other rule statements with OR logic. You provide more than one `Statement` within the `OrStatement` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-orstatement
         */
        readonly orStatement?: CfnWebACL.OrStatementProperty | cdk.IResolvable;
        /**
         * A rate-based rule tracks the rate of requests for each originating IP address, and triggers the rule action when the rate exceeds a limit that you specify on the number of requests in any 5-minute time span. You can use this to put a temporary block on requests from an IP address that is sending excessive requests.
         *
         * AWS WAF tracks and manages web requests separately for each instance of a rate-based rule that you use. For example, if you provide the same rate-based rule settings in two web ACLs, each of the two rule statements represents a separate instance of the rate-based rule and gets its own tracking and management by AWS WAF . If you define a rate-based rule inside a rule group, and then use that rule group in multiple places, each use creates a separate instance of the rate-based rule that gets its own tracking and management by AWS WAF .
         *
         * When the rule action triggers, AWS WAF blocks additional requests from the IP address until the request rate falls below the limit.
         *
         * You can optionally nest another statement inside the rate-based statement, to narrow the scope of the rule so that it only counts requests that match the nested statement. For example, based on recent requests that you have seen from an attacker, you might create a rate-based rule with a nested AND rule statement that contains the following nested statements:
         *
         * - An IP match statement with an IP set that specified the address 192.0.2.44.
         * - A string match statement that searches in the User-Agent header for the string BadBot.
         *
         * In this rate-based rule, you also define a rate limit. For this example, the rate limit is 1,000. Requests that meet the criteria of both of the nested statements are counted. If the count exceeds 1,000 requests per five minutes, the rule action triggers. Requests that do not meet the criteria of both of the nested statements are not counted towards the rate limit and are not affected by this rule.
         *
         * You cannot nest a `RateBasedStatement` inside another statement, for example inside a `NotStatement` or `OrStatement` . You can define a `RateBasedStatement` inside a web ACL and inside a rule group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-ratebasedstatement
         */
        readonly rateBasedStatement?: CfnWebACL.RateBasedStatementProperty | cdk.IResolvable;
        /**
         * A rule statement used to search web request components for a match against a single regular expression.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-regexmatchstatement
         */
        readonly regexMatchStatement?: CfnWebACL.RegexMatchStatementProperty | cdk.IResolvable;
        /**
         * A rule statement used to search web request components for matches with regular expressions. To use this, create a `RegexPatternSet` that specifies the expressions that you want to detect, then use the ARN of that set in this statement. A web request matches the pattern set rule statement if the request component matches any of the patterns in the set.
         *
         * Each regex pattern set rule statement references a regex pattern set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, AWS WAF automatically updates all rules that reference it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-regexpatternsetreferencestatement
         */
        readonly regexPatternSetReferenceStatement?: CfnWebACL.RegexPatternSetReferenceStatementProperty | cdk.IResolvable;
        /**
         * A rule statement used to run the rules that are defined in a `RuleGroup` . To use this, create a rule group with your rules, then provide the ARN of the rule group in this statement.
         *
         * You cannot nest a `RuleGroupReferenceStatement` , for example for use inside a `NotStatement` or `OrStatement` . You can only use a rule group reference statement at the top level inside a web ACL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-rulegroupreferencestatement
         */
        readonly ruleGroupReferenceStatement?: CfnWebACL.RuleGroupReferenceStatementProperty | cdk.IResolvable;
        /**
         * A rule statement that compares a number of bytes against the size of a request component, using a comparison operator, such as greater than (>) or less than (<). For example, you can use a size constraint statement to look for query strings that are longer than 100 bytes.
         *
         * If you configure AWS WAF to inspect the request body, AWS WAF inspects only the first 8192 bytes (8 KB). If the request body for your web requests never exceeds 8192 bytes, you could use a size constraint statement to block requests that have a request body greater than 8192 bytes.
         *
         * If you choose URI for the value of Part of the request to filter on, the slash (/) in the URI counts as one character. For example, the URI `/logo.jpg` is nine characters long.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-sizeconstraintstatement
         */
        readonly sizeConstraintStatement?: CfnWebACL.SizeConstraintStatementProperty | cdk.IResolvable;
        /**
         * A rule statement that inspects for malicious SQL code. Attackers insert malicious SQL code into web requests to do things like modify your database or extract data from it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-sqlimatchstatement
         */
        readonly sqliMatchStatement?: CfnWebACL.SqliMatchStatementProperty | cdk.IResolvable;
        /**
         * A rule statement that inspects for cross-site scripting (XSS) attacks. In XSS attacks, the attacker uses vulnerabilities in a benign website as a vehicle to inject malicious client-site scripts into other legitimate web browsers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-statement.html#cfn-wafv2-webacl-statement-xssmatchstatement
         */
        readonly xssMatchStatement?: CfnWebACL.XssMatchStatementProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `StatementProperty`
 *
 * @param properties - the TypeScript properties of a `StatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_StatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('andStatement', CfnWebACL_AndStatementPropertyValidator)(properties.andStatement));
    errors.collect(cdk.propertyValidator('byteMatchStatement', CfnWebACL_ByteMatchStatementPropertyValidator)(properties.byteMatchStatement));
    errors.collect(cdk.propertyValidator('geoMatchStatement', CfnWebACL_GeoMatchStatementPropertyValidator)(properties.geoMatchStatement));
    errors.collect(cdk.propertyValidator('ipSetReferenceStatement', CfnWebACL_IPSetReferenceStatementPropertyValidator)(properties.ipSetReferenceStatement));
    errors.collect(cdk.propertyValidator('labelMatchStatement', CfnWebACL_LabelMatchStatementPropertyValidator)(properties.labelMatchStatement));
    errors.collect(cdk.propertyValidator('managedRuleGroupStatement', CfnWebACL_ManagedRuleGroupStatementPropertyValidator)(properties.managedRuleGroupStatement));
    errors.collect(cdk.propertyValidator('notStatement', CfnWebACL_NotStatementPropertyValidator)(properties.notStatement));
    errors.collect(cdk.propertyValidator('orStatement', CfnWebACL_OrStatementPropertyValidator)(properties.orStatement));
    errors.collect(cdk.propertyValidator('rateBasedStatement', CfnWebACL_RateBasedStatementPropertyValidator)(properties.rateBasedStatement));
    errors.collect(cdk.propertyValidator('regexMatchStatement', CfnWebACL_RegexMatchStatementPropertyValidator)(properties.regexMatchStatement));
    errors.collect(cdk.propertyValidator('regexPatternSetReferenceStatement', CfnWebACL_RegexPatternSetReferenceStatementPropertyValidator)(properties.regexPatternSetReferenceStatement));
    errors.collect(cdk.propertyValidator('ruleGroupReferenceStatement', CfnWebACL_RuleGroupReferenceStatementPropertyValidator)(properties.ruleGroupReferenceStatement));
    errors.collect(cdk.propertyValidator('sizeConstraintStatement', CfnWebACL_SizeConstraintStatementPropertyValidator)(properties.sizeConstraintStatement));
    errors.collect(cdk.propertyValidator('sqliMatchStatement', CfnWebACL_SqliMatchStatementPropertyValidator)(properties.sqliMatchStatement));
    errors.collect(cdk.propertyValidator('xssMatchStatement', CfnWebACL_XssMatchStatementPropertyValidator)(properties.xssMatchStatement));
    return errors.wrap('supplied properties not correct for "StatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.Statement` resource
 *
 * @param properties - the TypeScript properties of a `StatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.Statement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_StatementPropertyValidator(properties).assertSuccess();
    return {
        AndStatement: cfnWebACLAndStatementPropertyToCloudFormation(properties.andStatement),
        ByteMatchStatement: cfnWebACLByteMatchStatementPropertyToCloudFormation(properties.byteMatchStatement),
        GeoMatchStatement: cfnWebACLGeoMatchStatementPropertyToCloudFormation(properties.geoMatchStatement),
        IPSetReferenceStatement: cfnWebACLIPSetReferenceStatementPropertyToCloudFormation(properties.ipSetReferenceStatement),
        LabelMatchStatement: cfnWebACLLabelMatchStatementPropertyToCloudFormation(properties.labelMatchStatement),
        ManagedRuleGroupStatement: cfnWebACLManagedRuleGroupStatementPropertyToCloudFormation(properties.managedRuleGroupStatement),
        NotStatement: cfnWebACLNotStatementPropertyToCloudFormation(properties.notStatement),
        OrStatement: cfnWebACLOrStatementPropertyToCloudFormation(properties.orStatement),
        RateBasedStatement: cfnWebACLRateBasedStatementPropertyToCloudFormation(properties.rateBasedStatement),
        RegexMatchStatement: cfnWebACLRegexMatchStatementPropertyToCloudFormation(properties.regexMatchStatement),
        RegexPatternSetReferenceStatement: cfnWebACLRegexPatternSetReferenceStatementPropertyToCloudFormation(properties.regexPatternSetReferenceStatement),
        RuleGroupReferenceStatement: cfnWebACLRuleGroupReferenceStatementPropertyToCloudFormation(properties.ruleGroupReferenceStatement),
        SizeConstraintStatement: cfnWebACLSizeConstraintStatementPropertyToCloudFormation(properties.sizeConstraintStatement),
        SqliMatchStatement: cfnWebACLSqliMatchStatementPropertyToCloudFormation(properties.sqliMatchStatement),
        XssMatchStatement: cfnWebACLXssMatchStatementPropertyToCloudFormation(properties.xssMatchStatement),
    };
}

// @ts-ignore TS6133
function CfnWebACLStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.StatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.StatementProperty>();
    ret.addPropertyResult('andStatement', 'AndStatement', properties.AndStatement != null ? CfnWebACLAndStatementPropertyFromCloudFormation(properties.AndStatement) : undefined);
    ret.addPropertyResult('byteMatchStatement', 'ByteMatchStatement', properties.ByteMatchStatement != null ? CfnWebACLByteMatchStatementPropertyFromCloudFormation(properties.ByteMatchStatement) : undefined);
    ret.addPropertyResult('geoMatchStatement', 'GeoMatchStatement', properties.GeoMatchStatement != null ? CfnWebACLGeoMatchStatementPropertyFromCloudFormation(properties.GeoMatchStatement) : undefined);
    ret.addPropertyResult('ipSetReferenceStatement', 'IPSetReferenceStatement', properties.IPSetReferenceStatement != null ? CfnWebACLIPSetReferenceStatementPropertyFromCloudFormation(properties.IPSetReferenceStatement) : undefined);
    ret.addPropertyResult('labelMatchStatement', 'LabelMatchStatement', properties.LabelMatchStatement != null ? CfnWebACLLabelMatchStatementPropertyFromCloudFormation(properties.LabelMatchStatement) : undefined);
    ret.addPropertyResult('managedRuleGroupStatement', 'ManagedRuleGroupStatement', properties.ManagedRuleGroupStatement != null ? CfnWebACLManagedRuleGroupStatementPropertyFromCloudFormation(properties.ManagedRuleGroupStatement) : undefined);
    ret.addPropertyResult('notStatement', 'NotStatement', properties.NotStatement != null ? CfnWebACLNotStatementPropertyFromCloudFormation(properties.NotStatement) : undefined);
    ret.addPropertyResult('orStatement', 'OrStatement', properties.OrStatement != null ? CfnWebACLOrStatementPropertyFromCloudFormation(properties.OrStatement) : undefined);
    ret.addPropertyResult('rateBasedStatement', 'RateBasedStatement', properties.RateBasedStatement != null ? CfnWebACLRateBasedStatementPropertyFromCloudFormation(properties.RateBasedStatement) : undefined);
    ret.addPropertyResult('regexMatchStatement', 'RegexMatchStatement', properties.RegexMatchStatement != null ? CfnWebACLRegexMatchStatementPropertyFromCloudFormation(properties.RegexMatchStatement) : undefined);
    ret.addPropertyResult('regexPatternSetReferenceStatement', 'RegexPatternSetReferenceStatement', properties.RegexPatternSetReferenceStatement != null ? CfnWebACLRegexPatternSetReferenceStatementPropertyFromCloudFormation(properties.RegexPatternSetReferenceStatement) : undefined);
    ret.addPropertyResult('ruleGroupReferenceStatement', 'RuleGroupReferenceStatement', properties.RuleGroupReferenceStatement != null ? CfnWebACLRuleGroupReferenceStatementPropertyFromCloudFormation(properties.RuleGroupReferenceStatement) : undefined);
    ret.addPropertyResult('sizeConstraintStatement', 'SizeConstraintStatement', properties.SizeConstraintStatement != null ? CfnWebACLSizeConstraintStatementPropertyFromCloudFormation(properties.SizeConstraintStatement) : undefined);
    ret.addPropertyResult('sqliMatchStatement', 'SqliMatchStatement', properties.SqliMatchStatement != null ? CfnWebACLSqliMatchStatementPropertyFromCloudFormation(properties.SqliMatchStatement) : undefined);
    ret.addPropertyResult('xssMatchStatement', 'XssMatchStatement', properties.XssMatchStatement != null ? CfnWebACLXssMatchStatementPropertyFromCloudFormation(properties.XssMatchStatement) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-texttransformation.html
     */
    export interface TextTransformationProperty {
        /**
         * Sets the relative processing order for multiple transformations that are defined for a rule statement. AWS WAF processes all transformations, from lowest priority to highest, before inspecting the transformed content. The priorities don't need to be consecutive, but they must all be different.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-texttransformation.html#cfn-wafv2-webacl-texttransformation-priority
         */
        readonly priority: number;
        /**
         * You can specify the following transformation types:
         *
         * *BASE64_DECODE* - Decode a `Base64` -encoded string.
         *
         * *BASE64_DECODE_EXT* - Decode a `Base64` -encoded string, but use a forgiving implementation that ignores characters that aren't valid.
         *
         * *CMD_LINE* - Command-line transformations. These are helpful in reducing effectiveness of attackers who inject an operating system command-line command and use unusual formatting to disguise some or all of the command.
         *
         * - Delete the following characters: `\ " ' ^`
         * - Delete spaces before the following characters: `/ (`
         * - Replace the following characters with a space: `, ;`
         * - Replace multiple spaces with one space
         * - Convert uppercase letters (A-Z) to lowercase (a-z)
         *
         * *COMPRESS_WHITE_SPACE* - Replace these characters with a space character (decimal 32):
         *
         * - `\f` , formfeed, decimal 12
         * - `\t` , tab, decimal 9
         * - `\n` , newline, decimal 10
         * - `\r` , carriage return, decimal 13
         * - `\v` , vertical tab, decimal 11
         * - Non-breaking space, decimal 160
         *
         * `COMPRESS_WHITE_SPACE` also replaces multiple spaces with one space.
         *
         * *CSS_DECODE* - Decode characters that were encoded using CSS 2.x escape rules `syndata.html#characters` . This function uses up to two bytes in the decoding process, so it can help to uncover ASCII characters that were encoded using CSS encoding that wouldn’t typically be encoded. It's also useful in countering evasion, which is a combination of a backslash and non-hexadecimal characters. For example, `ja\vascript` for javascript.
         *
         * *ESCAPE_SEQ_DECODE* - Decode the following ANSI C escape sequences: `\a` , `\b` , `\f` , `\n` , `\r` , `\t` , `\v` , `\\` , `\?` , `\'` , `\"` , `\xHH` (hexadecimal), `\0OOO` (octal). Encodings that aren't valid remain in the output.
         *
         * *HEX_DECODE* - Decode a string of hexadecimal characters into a binary.
         *
         * *HTML_ENTITY_DECODE* - Replace HTML-encoded characters with unencoded characters. `HTML_ENTITY_DECODE` performs these operations:
         *
         * - Replaces `(ampersand)quot;` with `"`
         * - Replaces `(ampersand)nbsp;` with a non-breaking space, decimal 160
         * - Replaces `(ampersand)lt;` with a "less than" symbol
         * - Replaces `(ampersand)gt;` with `>`
         * - Replaces characters that are represented in hexadecimal format, `(ampersand)#xhhhh;` , with the corresponding characters
         * - Replaces characters that are represented in decimal format, `(ampersand)#nnnn;` , with the corresponding characters
         *
         * *JS_DECODE* - Decode JavaScript escape sequences. If a `\` `u` `HHHH` code is in the full-width ASCII code range of `FF01-FF5E` , then the higher byte is used to detect and adjust the lower byte. If not, only the lower byte is used and the higher byte is zeroed, causing a possible loss of information.
         *
         * *LOWERCASE* - Convert uppercase letters (A-Z) to lowercase (a-z).
         *
         * *MD5* - Calculate an MD5 hash from the data in the input. The computed hash is in a raw binary form.
         *
         * *NONE* - Specify `NONE` if you don't want any text transformations.
         *
         * *NORMALIZE_PATH* - Remove multiple slashes, directory self-references, and directory back-references that are not at the beginning of the input from an input string.
         *
         * *NORMALIZE_PATH_WIN* - This is the same as `NORMALIZE_PATH` , but first converts backslash characters to forward slashes.
         *
         * *REMOVE_NULLS* - Remove all `NULL` bytes from the input.
         *
         * *REPLACE_COMMENTS* - Replace each occurrence of a C-style comment ( `/* ... * /` ) with a single space. Multiple consecutive occurrences are not compressed. Unterminated comments are also replaced with a space (ASCII 0x20). However, a standalone termination of a comment ( `* /` ) is not acted upon.
         *
         * *REPLACE_NULLS* - Replace NULL bytes in the input with space characters (ASCII `0x20` ).
         *
         * *SQL_HEX_DECODE* - Decode SQL hex data. Example ( `0x414243` ) will be decoded to ( `ABC` ).
         *
         * *URL_DECODE* - Decode a URL-encoded value.
         *
         * *URL_DECODE_UNI* - Like `URL_DECODE` , but with support for Microsoft-specific `%u` encoding. If the code is in the full-width ASCII code range of `FF01-FF5E` , the higher byte is used to detect and adjust the lower byte. Otherwise, only the lower byte is used and the higher byte is zeroed.
         *
         * *UTF8_TO_UNICODE* - Convert all UTF-8 character sequences to Unicode. This helps input normalization, and minimizing false-positives and false-negatives for non-English languages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-texttransformation.html#cfn-wafv2-webacl-texttransformation-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `TextTransformationProperty`
 *
 * @param properties - the TypeScript properties of a `TextTransformationProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_TextTransformationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('priority', cdk.requiredValidator)(properties.priority));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "TextTransformationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.TextTransformation` resource
 *
 * @param properties - the TypeScript properties of a `TextTransformationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.TextTransformation` resource.
 */
// @ts-ignore TS6133
function cfnWebACLTextTransformationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_TextTransformationPropertyValidator(properties).assertSuccess();
    return {
        Priority: cdk.numberToCloudFormation(properties.priority),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnWebACLTextTransformationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.TextTransformationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.TextTransformationProperty>();
    ret.addPropertyResult('priority', 'Priority', cfn_parse.FromCloudFormation.getNumber(properties.Priority));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-visibilityconfig.html
     */
    export interface VisibilityConfigProperty {
        /**
         * A boolean indicating whether the associated resource sends metrics to Amazon CloudWatch. For the list of available metrics, see [AWS WAF Metrics](https://docs.aws.amazon.com/waf/latest/developerguide/monitoring-cloudwatch.html#waf-metrics) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-visibilityconfig.html#cfn-wafv2-webacl-visibilityconfig-cloudwatchmetricsenabled
         */
        readonly cloudWatchMetricsEnabled: boolean | cdk.IResolvable;
        /**
         * A name of the Amazon CloudWatch metric dimension. The name can contain only the characters: A-Z, a-z, 0-9, - (hyphen), and _ (underscore). The name can be from one to 128 characters long. It can't contain whitespace or metric names that are reserved for AWS WAF , for example `All` and `Default_Action` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-visibilityconfig.html#cfn-wafv2-webacl-visibilityconfig-metricname
         */
        readonly metricName: string;
        /**
         * A boolean indicating whether AWS WAF should store a sampling of the web requests that match the rules. You can view the sampled requests through the AWS WAF console.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-visibilityconfig.html#cfn-wafv2-webacl-visibilityconfig-sampledrequestsenabled
         */
        readonly sampledRequestsEnabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VisibilityConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VisibilityConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_VisibilityConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchMetricsEnabled', cdk.requiredValidator)(properties.cloudWatchMetricsEnabled));
    errors.collect(cdk.propertyValidator('cloudWatchMetricsEnabled', cdk.validateBoolean)(properties.cloudWatchMetricsEnabled));
    errors.collect(cdk.propertyValidator('metricName', cdk.requiredValidator)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('sampledRequestsEnabled', cdk.requiredValidator)(properties.sampledRequestsEnabled));
    errors.collect(cdk.propertyValidator('sampledRequestsEnabled', cdk.validateBoolean)(properties.sampledRequestsEnabled));
    return errors.wrap('supplied properties not correct for "VisibilityConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.VisibilityConfig` resource
 *
 * @param properties - the TypeScript properties of a `VisibilityConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.VisibilityConfig` resource.
 */
// @ts-ignore TS6133
function cfnWebACLVisibilityConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_VisibilityConfigPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchMetricsEnabled: cdk.booleanToCloudFormation(properties.cloudWatchMetricsEnabled),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        SampledRequestsEnabled: cdk.booleanToCloudFormation(properties.sampledRequestsEnabled),
    };
}

// @ts-ignore TS6133
function CfnWebACLVisibilityConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.VisibilityConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.VisibilityConfigProperty>();
    ret.addPropertyResult('cloudWatchMetricsEnabled', 'CloudWatchMetricsEnabled', cfn_parse.FromCloudFormation.getBoolean(properties.CloudWatchMetricsEnabled));
    ret.addPropertyResult('metricName', 'MetricName', cfn_parse.FromCloudFormation.getString(properties.MetricName));
    ret.addPropertyResult('sampledRequestsEnabled', 'SampledRequestsEnabled', cfn_parse.FromCloudFormation.getBoolean(properties.SampledRequestsEnabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebACL {
    /**
     * A rule statement that inspects for cross-site scripting (XSS) attacks. In XSS attacks, the attacker uses vulnerabilities in a benign website as a vehicle to inject malicious client-site scripts into other legitimate web browsers.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-xssmatchstatement.html
     */
    export interface XssMatchStatementProperty {
        /**
         * The part of the web request that you want AWS WAF to inspect.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-xssmatchstatement.html#cfn-wafv2-webacl-xssmatchstatement-fieldtomatch
         */
        readonly fieldToMatch: CfnWebACL.FieldToMatchProperty | cdk.IResolvable;
        /**
         * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, AWS WAF performs all transformations on the content of the request component identified by `FieldToMatch` , starting from the lowest priority setting, before inspecting the content for a match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-xssmatchstatement.html#cfn-wafv2-webacl-xssmatchstatement-texttransformations
         */
        readonly textTransformations: Array<CfnWebACL.TextTransformationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `XssMatchStatementProperty`
 *
 * @param properties - the TypeScript properties of a `XssMatchStatementProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebACL_XssMatchStatementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fieldToMatch', cdk.requiredValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('fieldToMatch', CfnWebACL_FieldToMatchPropertyValidator)(properties.fieldToMatch));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.requiredValidator)(properties.textTransformations));
    errors.collect(cdk.propertyValidator('textTransformations', cdk.listValidator(CfnWebACL_TextTransformationPropertyValidator))(properties.textTransformations));
    return errors.wrap('supplied properties not correct for "XssMatchStatementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.XssMatchStatement` resource
 *
 * @param properties - the TypeScript properties of a `XssMatchStatementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACL.XssMatchStatement` resource.
 */
// @ts-ignore TS6133
function cfnWebACLXssMatchStatementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACL_XssMatchStatementPropertyValidator(properties).assertSuccess();
    return {
        FieldToMatch: cfnWebACLFieldToMatchPropertyToCloudFormation(properties.fieldToMatch),
        TextTransformations: cdk.listMapper(cfnWebACLTextTransformationPropertyToCloudFormation)(properties.textTransformations),
    };
}

// @ts-ignore TS6133
function CfnWebACLXssMatchStatementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACL.XssMatchStatementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACL.XssMatchStatementProperty>();
    ret.addPropertyResult('fieldToMatch', 'FieldToMatch', CfnWebACLFieldToMatchPropertyFromCloudFormation(properties.FieldToMatch));
    ret.addPropertyResult('textTransformations', 'TextTransformations', cfn_parse.FromCloudFormation.getArray(CfnWebACLTextTransformationPropertyFromCloudFormation)(properties.TextTransformations));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnWebACLAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webaclassociation.html
 */
export interface CfnWebACLAssociationProps {

    /**
     * The Amazon Resource Name (ARN) of the resource to associate with the web ACL.
     *
     * The ARN must be in one of the following formats:
     *
     * - For an Application Load Balancer: `arn:aws:elasticloadbalancing: *region* : *account-id* :loadbalancer/app/ *load-balancer-name* / *load-balancer-id*`
     * - For an Amazon API Gateway REST API: `arn:aws:apigateway: *region* ::/restapis/ *api-id* /stages/ *stage-name*`
     * - For an AWS AppSync GraphQL API: `arn:aws:appsync: *region* : *account-id* :apis/ *GraphQLApiId*`
     * - For an Amazon Cognito user pool: `arn:aws:cognito-idp: *region* : *account-id* :userpool/ *user-pool-id*`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webaclassociation.html#cfn-wafv2-webaclassociation-resourcearn
     */
    readonly resourceArn: string;

    /**
     * The Amazon Resource Name (ARN) of the web ACL that you want to associate with the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webaclassociation.html#cfn-wafv2-webaclassociation-webaclarn
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
function CfnWebACLAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('webAclArn', cdk.requiredValidator)(properties.webAclArn));
    errors.collect(cdk.propertyValidator('webAclArn', cdk.validateString)(properties.webAclArn));
    return errors.wrap('supplied properties not correct for "CfnWebACLAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WAFv2::WebACLAssociation` resource
 *
 * @param properties - the TypeScript properties of a `CfnWebACLAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WAFv2::WebACLAssociation` resource.
 */
// @ts-ignore TS6133
function cfnWebACLAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebACLAssociationPropsValidator(properties).assertSuccess();
    return {
        ResourceArn: cdk.stringToCloudFormation(properties.resourceArn),
        WebACLArn: cdk.stringToCloudFormation(properties.webAclArn),
    };
}

// @ts-ignore TS6133
function CfnWebACLAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebACLAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebACLAssociationProps>();
    ret.addPropertyResult('resourceArn', 'ResourceArn', cfn_parse.FromCloudFormation.getString(properties.ResourceArn));
    ret.addPropertyResult('webAclArn', 'WebACLArn', cfn_parse.FromCloudFormation.getString(properties.WebACLArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WAFv2::WebACLAssociation`
 *
 * > This is the latest version of *AWS WAF* , named AWS WAF V2, released in November, 2019. For information, including how to migrate your AWS WAF resources from the prior release, see the [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) .
 *
 * Use a web ACL association to define an association between a web ACL and a regional application resource, to protect the resource. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AWS AppSync GraphQL API, or an Amazon Cognito user pool.
 *
 * For Amazon CloudFront , don't use this resource. Instead, use your CloudFront distribution configuration. To associate a web ACL with a distribution, provide the Amazon Resource Name (ARN) of the `WebACL` to your CloudFront distribution configuration. To disassociate a web ACL, provide an empty ARN. For information, see [AWS::CloudFront::Distribution](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html) .
 *
 * When you create a web ACL or make changes to a web ACL or web ACL components, like rules and rule groups, AWS WAF propagates the changes everywhere that the web ACL and its components are stored and used. Your changes are applied within seconds, but there might be a brief period of inconsistency when the changes have arrived in some places and not in others. So, for example, if you change a rule action setting, the action might be the old action in one area and the new action in another area. Or if you add an IP address to an IP set used in a blocking rule, the new address might briefly be blocked in one area while still allowed in another. This temporary inconsistency can occur when you first associate a web ACL with an AWS resource and when you change a web ACL that is already associated with a resource. Generally, any inconsistencies of this type last only a few seconds.
 *
 * @cloudformationResource AWS::WAFv2::WebACLAssociation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webaclassociation.html
 */
export class CfnWebACLAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WAFv2::WebACLAssociation";

    /**
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
        const ret = new CfnWebACLAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the resource to associate with the web ACL.
     *
     * The ARN must be in one of the following formats:
     *
     * - For an Application Load Balancer: `arn:aws:elasticloadbalancing: *region* : *account-id* :loadbalancer/app/ *load-balancer-name* / *load-balancer-id*`
     * - For an Amazon API Gateway REST API: `arn:aws:apigateway: *region* ::/restapis/ *api-id* /stages/ *stage-name*`
     * - For an AWS AppSync GraphQL API: `arn:aws:appsync: *region* : *account-id* :apis/ *GraphQLApiId*`
     * - For an Amazon Cognito user pool: `arn:aws:cognito-idp: *region* : *account-id* :userpool/ *user-pool-id*`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webaclassociation.html#cfn-wafv2-webaclassociation-resourcearn
     */
    public resourceArn: string;

    /**
     * The Amazon Resource Name (ARN) of the web ACL that you want to associate with the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webaclassociation.html#cfn-wafv2-webaclassociation-webaclarn
     */
    public webAclArn: string;

    /**
     * Create a new `AWS::WAFv2::WebACLAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWebACLAssociationProps) {
        super(scope, id, { type: CfnWebACLAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'resourceArn', this);
        cdk.requireProperty(props, 'webAclArn', this);

        this.resourceArn = props.resourceArn;
        this.webAclArn = props.webAclArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnWebACLAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            resourceArn: this.resourceArn,
            webAclArn: this.webAclArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnWebACLAssociationPropsToCloudFormation(props);
    }
}
