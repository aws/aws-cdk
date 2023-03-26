// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:31.871Z","fingerprint":"vWN4VS8CAqlK7bnIss43IYvXrKMB8rJhiEeLQCQlpI0="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAccessPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html
 */
export interface CfnAccessPolicyProps {

    /**
     * The description of the policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html#cfn-opensearchserverless-accesspolicy-description
     */
    readonly description?: string;

    /**
     * The name of the policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html#cfn-opensearchserverless-accesspolicy-name
     */
    readonly name?: string;

    /**
     * The JSON policy document without any whitespaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html#cfn-opensearchserverless-accesspolicy-policy
     */
    readonly policy?: string;

    /**
     * The type of access policy. Currently the only option is `data` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html#cfn-opensearchserverless-accesspolicy-type
     */
    readonly type?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAccessPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnAccessPolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('policy', cdk.validateString)(properties.policy));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnAccessPolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchServerless::AccessPolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnAccessPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchServerless::AccessPolicy` resource.
 */
// @ts-ignore TS6133
function cfnAccessPolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPolicyPropsValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        Policy: cdk.stringToCloudFormation(properties.policy),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnAccessPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicyProps>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('policy', 'Policy', properties.Policy != null ? cfn_parse.FromCloudFormation.getString(properties.Policy) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::OpenSearchServerless::AccessPolicy`
 *
 * Creates a data access policy for OpenSearch Serverless. Access policies limit access to collections and the resources within them, and allow a user to access that data irrespective of the access mechanism or network source. For more information, see [Data access control for Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-data-access.html) .
 *
 * @cloudformationResource AWS::OpenSearchServerless::AccessPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html
 */
export class CfnAccessPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::OpenSearchServerless::AccessPolicy";

    /**
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
        const ret = new CfnAccessPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The description of the policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html#cfn-opensearchserverless-accesspolicy-description
     */
    public description: string | undefined;

    /**
     * The name of the policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html#cfn-opensearchserverless-accesspolicy-name
     */
    public name: string | undefined;

    /**
     * The JSON policy document without any whitespaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html#cfn-opensearchserverless-accesspolicy-policy
     */
    public policy: string | undefined;

    /**
     * The type of access policy. Currently the only option is `data` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-accesspolicy.html#cfn-opensearchserverless-accesspolicy-type
     */
    public type: string | undefined;

    /**
     * Create a new `AWS::OpenSearchServerless::AccessPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAccessPolicyProps = {}) {
        super(scope, id, { type: CfnAccessPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });

        this.description = props.description;
        this.name = props.name;
        this.policy = props.policy;
        this.type = props.type;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            description: this.description,
            name: this.name,
            policy: this.policy,
            type: this.type,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAccessPolicyPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnCollection`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html
 */
export interface CfnCollectionProps {

    /**
     * The name of the collection.
     *
     * Collection names must meet the following criteria:
     *
     * - Starts with a lowercase letter
     * - Unique to your account and AWS Region
     * - Contains between 3 and 28 characters
     * - Contains only lowercase letters a-z, the numbers 0-9, and the hyphen (-)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html#cfn-opensearchserverless-collection-name
     */
    readonly name: string;

    /**
     * A description of the collection.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html#cfn-opensearchserverless-collection-description
     */
    readonly description?: string;

    /**
     * An arbitrary set of tags (key–value pairs) to associate with the collection.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html#cfn-opensearchserverless-collection-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The type of collection. Possible values are `SEARCH` and `TIMESERIES` . For more information, see [Choosing a collection type](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-overview.html#serverless-usecase) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html#cfn-opensearchserverless-collection-type
     */
    readonly type?: string;
}

/**
 * Determine whether the given properties match those of a `CfnCollectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnCollectionProps`
 *
 * @returns the result of the validation.
 */
function CfnCollectionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnCollectionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchServerless::Collection` resource
 *
 * @param properties - the TypeScript properties of a `CfnCollectionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchServerless::Collection` resource.
 */
// @ts-ignore TS6133
function cfnCollectionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCollectionPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnCollectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCollectionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCollectionProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::OpenSearchServerless::Collection`
 *
 * Specifies an OpenSearch Serverless collection. For more information, see [Creating and managing Amazon OpenSearch Serverless collections](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-manage.html) in the *Amazon OpenSearch Service Developer Guide* .
 *
 * > You must create a matching [encryption policy](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-encryption.html) in order for a collection to be created successfully. You can specify the policy resource within the same CloudFormation template as the collection resource if you use the [DependsOn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) attribute. See [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html#aws-resource-opensearchserverless-collection--examples) for a sample template. Otherwise the encryption policy must already exist before you create the collection.
 *
 * @cloudformationResource AWS::OpenSearchServerless::Collection
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html
 */
export class CfnCollection extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::OpenSearchServerless::Collection";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCollection {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCollectionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCollection(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the collection. For example, `arn:aws:aoss:us-east-1:123456789012:collection/07tjusf2h91cunochc` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Collection-specific endpoint used to submit index, search, and data upload requests to an OpenSearch Serverless collection. For example, `https://07tjusf2h91cunochc.us-east-1.aoss.amazonaws.com` .
     * @cloudformationAttribute CollectionEndpoint
     */
    public readonly attrCollectionEndpoint: string;

    /**
     * Collection-specific endpoint used to access OpenSearch Dashboards. For example, `https://07tjusf2h91cunochc.us-east-1.aoss.amazonaws.com/_dashboards` .
     * @cloudformationAttribute DashboardEndpoint
     */
    public readonly attrDashboardEndpoint: string;

    /**
     * A unique identifier for the collection. For example, `07tjusf2h91cunochc` .
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The name of the collection.
     *
     * Collection names must meet the following criteria:
     *
     * - Starts with a lowercase letter
     * - Unique to your account and AWS Region
     * - Contains between 3 and 28 characters
     * - Contains only lowercase letters a-z, the numbers 0-9, and the hyphen (-)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html#cfn-opensearchserverless-collection-name
     */
    public name: string;

    /**
     * A description of the collection.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html#cfn-opensearchserverless-collection-description
     */
    public description: string | undefined;

    /**
     * An arbitrary set of tags (key–value pairs) to associate with the collection.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html#cfn-opensearchserverless-collection-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The type of collection. Possible values are `SEARCH` and `TIMESERIES` . For more information, see [Choosing a collection type](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-overview.html#serverless-usecase) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-collection.html#cfn-opensearchserverless-collection-type
     */
    public type: string | undefined;

    /**
     * Create a new `AWS::OpenSearchServerless::Collection`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCollectionProps) {
        super(scope, id, { type: CfnCollection.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCollectionEndpoint = cdk.Token.asString(this.getAtt('CollectionEndpoint', cdk.ResolutionTypeHint.STRING));
        this.attrDashboardEndpoint = cdk.Token.asString(this.getAtt('DashboardEndpoint', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::OpenSearchServerless::Collection", props.tags, { tagPropertyName: 'tags' });
        this.type = props.type;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCollection.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            description: this.description,
            tags: this.tags.renderTags(),
            type: this.type,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCollectionPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnSecurityConfig`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html
 */
export interface CfnSecurityConfigProps {

    /**
     * The description of the security configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html#cfn-opensearchserverless-securityconfig-description
     */
    readonly description?: string;

    /**
     * The name of the security configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html#cfn-opensearchserverless-securityconfig-name
     */
    readonly name?: string;

    /**
     * SAML options for the security configuration in the form of a key-value map.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html#cfn-opensearchserverless-securityconfig-samloptions
     */
    readonly samlOptions?: CfnSecurityConfig.SamlConfigOptionsProperty | cdk.IResolvable;

    /**
     * The type of security configuration. Currently the only option is `saml` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html#cfn-opensearchserverless-securityconfig-type
     */
    readonly type?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSecurityConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnSecurityConfigProps`
 *
 * @returns the result of the validation.
 */
function CfnSecurityConfigPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('samlOptions', CfnSecurityConfig_SamlConfigOptionsPropertyValidator)(properties.samlOptions));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnSecurityConfigProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchServerless::SecurityConfig` resource
 *
 * @param properties - the TypeScript properties of a `CfnSecurityConfigProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchServerless::SecurityConfig` resource.
 */
// @ts-ignore TS6133
function cfnSecurityConfigPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSecurityConfigPropsValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        SamlOptions: cfnSecurityConfigSamlConfigOptionsPropertyToCloudFormation(properties.samlOptions),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnSecurityConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityConfigProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityConfigProps>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('samlOptions', 'SamlOptions', properties.SamlOptions != null ? CfnSecurityConfigSamlConfigOptionsPropertyFromCloudFormation(properties.SamlOptions) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::OpenSearchServerless::SecurityConfig`
 *
 * Specifies a security configuration for OpenSearch Serverless. For more information, see [SAML authentication for Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-saml.html) .
 *
 * @cloudformationResource AWS::OpenSearchServerless::SecurityConfig
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html
 */
export class CfnSecurityConfig extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::OpenSearchServerless::SecurityConfig";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSecurityConfig {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSecurityConfigPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSecurityConfig(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier of the security configuration. For example, `saml/123456789012/myprovider` .
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The description of the security configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html#cfn-opensearchserverless-securityconfig-description
     */
    public description: string | undefined;

    /**
     * The name of the security configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html#cfn-opensearchserverless-securityconfig-name
     */
    public name: string | undefined;

    /**
     * SAML options for the security configuration in the form of a key-value map.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html#cfn-opensearchserverless-securityconfig-samloptions
     */
    public samlOptions: CfnSecurityConfig.SamlConfigOptionsProperty | cdk.IResolvable | undefined;

    /**
     * The type of security configuration. Currently the only option is `saml` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securityconfig.html#cfn-opensearchserverless-securityconfig-type
     */
    public type: string | undefined;

    /**
     * Create a new `AWS::OpenSearchServerless::SecurityConfig`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSecurityConfigProps = {}) {
        super(scope, id, { type: CfnSecurityConfig.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.description = props.description;
        this.name = props.name;
        this.samlOptions = props.samlOptions;
        this.type = props.type;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSecurityConfig.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            description: this.description,
            name: this.name,
            samlOptions: this.samlOptions,
            type: this.type,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSecurityConfigPropsToCloudFormation(props);
    }
}

export namespace CfnSecurityConfig {
    /**
     * Describes SAML options for an OpenSearch Serverless security configuration in the form of a key-value map.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchserverless-securityconfig-samlconfigoptions.html
     */
    export interface SamlConfigOptionsProperty {
        /**
         * The group attribute for this SAML integration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchserverless-securityconfig-samlconfigoptions.html#cfn-opensearchserverless-securityconfig-samlconfigoptions-groupattribute
         */
        readonly groupAttribute?: string;
        /**
         * The XML IdP metadata file generated from your identity provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchserverless-securityconfig-samlconfigoptions.html#cfn-opensearchserverless-securityconfig-samlconfigoptions-metadata
         */
        readonly metadata: string;
        /**
         * The session timeout, in minutes. Default is 60 minutes (12 hours).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchserverless-securityconfig-samlconfigoptions.html#cfn-opensearchserverless-securityconfig-samlconfigoptions-sessiontimeout
         */
        readonly sessionTimeout?: number;
        /**
         * A user attribute for this SAML integration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchserverless-securityconfig-samlconfigoptions.html#cfn-opensearchserverless-securityconfig-samlconfigoptions-userattribute
         */
        readonly userAttribute?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SamlConfigOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `SamlConfigOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnSecurityConfig_SamlConfigOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('groupAttribute', cdk.validateString)(properties.groupAttribute));
    errors.collect(cdk.propertyValidator('metadata', cdk.requiredValidator)(properties.metadata));
    errors.collect(cdk.propertyValidator('metadata', cdk.validateString)(properties.metadata));
    errors.collect(cdk.propertyValidator('sessionTimeout', cdk.validateNumber)(properties.sessionTimeout));
    errors.collect(cdk.propertyValidator('userAttribute', cdk.validateString)(properties.userAttribute));
    return errors.wrap('supplied properties not correct for "SamlConfigOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchServerless::SecurityConfig.SamlConfigOptions` resource
 *
 * @param properties - the TypeScript properties of a `SamlConfigOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchServerless::SecurityConfig.SamlConfigOptions` resource.
 */
// @ts-ignore TS6133
function cfnSecurityConfigSamlConfigOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSecurityConfig_SamlConfigOptionsPropertyValidator(properties).assertSuccess();
    return {
        GroupAttribute: cdk.stringToCloudFormation(properties.groupAttribute),
        Metadata: cdk.stringToCloudFormation(properties.metadata),
        SessionTimeout: cdk.numberToCloudFormation(properties.sessionTimeout),
        UserAttribute: cdk.stringToCloudFormation(properties.userAttribute),
    };
}

// @ts-ignore TS6133
function CfnSecurityConfigSamlConfigOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityConfig.SamlConfigOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityConfig.SamlConfigOptionsProperty>();
    ret.addPropertyResult('groupAttribute', 'GroupAttribute', properties.GroupAttribute != null ? cfn_parse.FromCloudFormation.getString(properties.GroupAttribute) : undefined);
    ret.addPropertyResult('metadata', 'Metadata', cfn_parse.FromCloudFormation.getString(properties.Metadata));
    ret.addPropertyResult('sessionTimeout', 'SessionTimeout', properties.SessionTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.SessionTimeout) : undefined);
    ret.addPropertyResult('userAttribute', 'UserAttribute', properties.UserAttribute != null ? cfn_parse.FromCloudFormation.getString(properties.UserAttribute) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnSecurityPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html
 */
export interface CfnSecurityPolicyProps {

    /**
     * The JSON policy document without any whitespaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html#cfn-opensearchserverless-securitypolicy-policy
     */
    readonly policy: string;

    /**
     * The description of the security policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html#cfn-opensearchserverless-securitypolicy-description
     */
    readonly description?: string;

    /**
     * The name of the policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html#cfn-opensearchserverless-securitypolicy-name
     */
    readonly name?: string;

    /**
     * The type of security policy. Can be either `encryption` or `network` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html#cfn-opensearchserverless-securitypolicy-type
     */
    readonly type?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSecurityPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnSecurityPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnSecurityPolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('policy', cdk.requiredValidator)(properties.policy));
    errors.collect(cdk.propertyValidator('policy', cdk.validateString)(properties.policy));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnSecurityPolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchServerless::SecurityPolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnSecurityPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchServerless::SecurityPolicy` resource.
 */
// @ts-ignore TS6133
function cfnSecurityPolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSecurityPolicyPropsValidator(properties).assertSuccess();
    return {
        Policy: cdk.stringToCloudFormation(properties.policy),
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnSecurityPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityPolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityPolicyProps>();
    ret.addPropertyResult('policy', 'Policy', cfn_parse.FromCloudFormation.getString(properties.Policy));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::OpenSearchServerless::SecurityPolicy`
 *
 * Creates an encryption or network policy to be used by one or more OpenSearch Serverless collections.
 *
 * Network policies specify access to a collection and its OpenSearch Dashboards endpoint from public networks or specific VPC endpoints. For more information, see [Network access for Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-network.html) .
 *
 * Encryption policies specify a KMS encryption key to assign to particular collections. For more information, see [Encryption at rest for Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-encryption.html) .
 *
 * @cloudformationResource AWS::OpenSearchServerless::SecurityPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html
 */
export class CfnSecurityPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::OpenSearchServerless::SecurityPolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSecurityPolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSecurityPolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSecurityPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The JSON policy document without any whitespaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html#cfn-opensearchserverless-securitypolicy-policy
     */
    public policy: string;

    /**
     * The description of the security policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html#cfn-opensearchserverless-securitypolicy-description
     */
    public description: string | undefined;

    /**
     * The name of the policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html#cfn-opensearchserverless-securitypolicy-name
     */
    public name: string | undefined;

    /**
     * The type of security policy. Can be either `encryption` or `network` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-securitypolicy.html#cfn-opensearchserverless-securitypolicy-type
     */
    public type: string | undefined;

    /**
     * Create a new `AWS::OpenSearchServerless::SecurityPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSecurityPolicyProps) {
        super(scope, id, { type: CfnSecurityPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'policy', this);

        this.policy = props.policy;
        this.description = props.description;
        this.name = props.name;
        this.type = props.type;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSecurityPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            policy: this.policy,
            description: this.description,
            name: this.name,
            type: this.type,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSecurityPolicyPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnVpcEndpoint`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html
 */
export interface CfnVpcEndpointProps {

    /**
     * The name of the endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html#cfn-opensearchserverless-vpcendpoint-name
     */
    readonly name: string;

    /**
     * The ID of the VPC from which you access OpenSearch Serverless.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html#cfn-opensearchserverless-vpcendpoint-vpcid
     */
    readonly vpcId: string;

    /**
     * The unique identifiers of the security groups that define the ports, protocols, and sources for inbound traffic that you are authorizing into your endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html#cfn-opensearchserverless-vpcendpoint-securitygroupids
     */
    readonly securityGroupIds?: string[];

    /**
     * The ID of the subnets from which you access OpenSearch Serverless.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html#cfn-opensearchserverless-vpcendpoint-subnetids
     */
    readonly subnetIds?: string[];
}

/**
 * Determine whether the given properties match those of a `CfnVpcEndpointProps`
 *
 * @param properties - the TypeScript properties of a `CfnVpcEndpointProps`
 *
 * @returns the result of the validation.
 */
function CfnVpcEndpointPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    errors.collect(cdk.propertyValidator('vpcId', cdk.requiredValidator)(properties.vpcId));
    errors.collect(cdk.propertyValidator('vpcId', cdk.validateString)(properties.vpcId));
    return errors.wrap('supplied properties not correct for "CfnVpcEndpointProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpenSearchServerless::VpcEndpoint` resource
 *
 * @param properties - the TypeScript properties of a `CfnVpcEndpointProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpenSearchServerless::VpcEndpoint` resource.
 */
// @ts-ignore TS6133
function cfnVpcEndpointPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVpcEndpointPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        VpcId: cdk.stringToCloudFormation(properties.vpcId),
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    };
}

// @ts-ignore TS6133
function CfnVpcEndpointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVpcEndpointProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVpcEndpointProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('vpcId', 'VpcId', cfn_parse.FromCloudFormation.getString(properties.VpcId));
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds) : undefined);
    ret.addPropertyResult('subnetIds', 'SubnetIds', properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::OpenSearchServerless::VpcEndpoint`
 *
 * Creates an OpenSearch Serverless-managed interface VPC endpoint. For more information, see [Access Amazon OpenSearch Serverless using an interface endpoint](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-vpc.html) .
 *
 * @cloudformationResource AWS::OpenSearchServerless::VpcEndpoint
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html
 */
export class CfnVpcEndpoint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::OpenSearchServerless::VpcEndpoint";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVpcEndpoint {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnVpcEndpointPropsFromCloudFormation(resourceProperties);
        const ret = new CfnVpcEndpoint(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier of the endpoint. For example, `vpce-050f79086ee71ac05` .
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The name of the endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html#cfn-opensearchserverless-vpcendpoint-name
     */
    public name: string;

    /**
     * The ID of the VPC from which you access OpenSearch Serverless.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html#cfn-opensearchserverless-vpcendpoint-vpcid
     */
    public vpcId: string;

    /**
     * The unique identifiers of the security groups that define the ports, protocols, and sources for inbound traffic that you are authorizing into your endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html#cfn-opensearchserverless-vpcendpoint-securitygroupids
     */
    public securityGroupIds: string[] | undefined;

    /**
     * The ID of the subnets from which you access OpenSearch Serverless.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchserverless-vpcendpoint.html#cfn-opensearchserverless-vpcendpoint-subnetids
     */
    public subnetIds: string[] | undefined;

    /**
     * Create a new `AWS::OpenSearchServerless::VpcEndpoint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnVpcEndpointProps) {
        super(scope, id, { type: CfnVpcEndpoint.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'vpcId', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.vpcId = props.vpcId;
        this.securityGroupIds = props.securityGroupIds;
        this.subnetIds = props.subnetIds;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnVpcEndpoint.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            vpcId: this.vpcId,
            securityGroupIds: this.securityGroupIds,
            subnetIds: this.subnetIds,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnVpcEndpointPropsToCloudFormation(props);
    }
}
