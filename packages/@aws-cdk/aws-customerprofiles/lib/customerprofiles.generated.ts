// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:36.425Z","fingerprint":"yjDx8HfIuIArldvilhNwuO1xUsnnthOD1n9+SzjyeeI="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnDomain`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html
 */
export interface CfnDomainProps {

    /**
     * The unique name of the domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-domainname
     */
    readonly domainName: string;

    /**
     * The URL of the SQS dead letter queue, which is used for reporting errors associated with ingesting data from third party applications. You must set up a policy on the DeadLetterQueue for the SendMessage operation to enable Amazon Connect Customer Profiles to send messages to the DeadLetterQueue.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-deadletterqueueurl
     */
    readonly deadLetterQueueUrl?: string;

    /**
     * The default encryption key, which is an AWS managed key, is used when no specific type of encryption key is specified. It is used to encrypt all data before it is placed in permanent or semi-permanent storage.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-defaultencryptionkey
     */
    readonly defaultEncryptionKey?: string;

    /**
     * The default number of days until the data within the domain expires.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-defaultexpirationdays
     */
    readonly defaultExpirationDays?: number;

    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDomainProps`
 *
 * @param properties - the TypeScript properties of a `CfnDomainProps`
 *
 * @returns the result of the validation.
 */
function CfnDomainPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deadLetterQueueUrl', cdk.validateString)(properties.deadLetterQueueUrl));
    errors.collect(cdk.propertyValidator('defaultEncryptionKey', cdk.validateString)(properties.defaultEncryptionKey));
    errors.collect(cdk.propertyValidator('defaultExpirationDays', cdk.validateNumber)(properties.defaultExpirationDays));
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDomainProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Domain` resource
 *
 * @param properties - the TypeScript properties of a `CfnDomainProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Domain` resource.
 */
// @ts-ignore TS6133
function cfnDomainPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomainPropsValidator(properties).assertSuccess();
    return {
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        DeadLetterQueueUrl: cdk.stringToCloudFormation(properties.deadLetterQueueUrl),
        DefaultEncryptionKey: cdk.stringToCloudFormation(properties.defaultEncryptionKey),
        DefaultExpirationDays: cdk.numberToCloudFormation(properties.defaultExpirationDays),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDomainPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainProps>();
    ret.addPropertyResult('domainName', 'DomainName', cfn_parse.FromCloudFormation.getString(properties.DomainName));
    ret.addPropertyResult('deadLetterQueueUrl', 'DeadLetterQueueUrl', properties.DeadLetterQueueUrl != null ? cfn_parse.FromCloudFormation.getString(properties.DeadLetterQueueUrl) : undefined);
    ret.addPropertyResult('defaultEncryptionKey', 'DefaultEncryptionKey', properties.DefaultEncryptionKey != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultEncryptionKey) : undefined);
    ret.addPropertyResult('defaultExpirationDays', 'DefaultExpirationDays', properties.DefaultExpirationDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultExpirationDays) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CustomerProfiles::Domain`
 *
 * Specifies an Amazon Connect Customer Profiles Domain.
 *
 * @cloudformationResource AWS::CustomerProfiles::Domain
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html
 */
export class CfnDomain extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CustomerProfiles::Domain";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDomain {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDomainPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDomain(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The timestamp of when the domain was created.
     * @cloudformationAttribute CreatedAt
     */
    public readonly attrCreatedAt: string;

    /**
     * The timestamp of when the domain was most recently edited.
     * @cloudformationAttribute LastUpdatedAt
     */
    public readonly attrLastUpdatedAt: string;

    /**
     * The unique name of the domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-domainname
     */
    public domainName: string;

    /**
     * The URL of the SQS dead letter queue, which is used for reporting errors associated with ingesting data from third party applications. You must set up a policy on the DeadLetterQueue for the SendMessage operation to enable Amazon Connect Customer Profiles to send messages to the DeadLetterQueue.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-deadletterqueueurl
     */
    public deadLetterQueueUrl: string | undefined;

    /**
     * The default encryption key, which is an AWS managed key, is used when no specific type of encryption key is specified. It is used to encrypt all data before it is placed in permanent or semi-permanent storage.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-defaultencryptionkey
     */
    public defaultEncryptionKey: string | undefined;

    /**
     * The default number of days until the data within the domain expires.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-defaultexpirationdays
     */
    public defaultExpirationDays: number | undefined;

    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-domain.html#cfn-customerprofiles-domain-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::CustomerProfiles::Domain`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDomainProps) {
        super(scope, id, { type: CfnDomain.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'domainName', this);
        this.attrCreatedAt = cdk.Token.asString(this.getAtt('CreatedAt', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdatedAt = cdk.Token.asString(this.getAtt('LastUpdatedAt', cdk.ResolutionTypeHint.STRING));

        this.domainName = props.domainName;
        this.deadLetterQueueUrl = props.deadLetterQueueUrl;
        this.defaultEncryptionKey = props.defaultEncryptionKey;
        this.defaultExpirationDays = props.defaultExpirationDays;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CustomerProfiles::Domain", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDomain.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            domainName: this.domainName,
            deadLetterQueueUrl: this.deadLetterQueueUrl,
            defaultEncryptionKey: this.defaultEncryptionKey,
            defaultExpirationDays: this.defaultExpirationDays,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDomainPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnIntegration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html
 */
export interface CfnIntegrationProps {

    /**
     * The unique name of the domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-domainname
     */
    readonly domainName: string;

    /**
     * The configuration that controls how Customer Profiles retrieves data from the source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-flowdefinition
     */
    readonly flowDefinition?: CfnIntegration.FlowDefinitionProperty | cdk.IResolvable;

    /**
     * The name of the profile object type mapping to use.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-objecttypename
     */
    readonly objectTypeName?: string;

    /**
     * The object type mapping.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-objecttypenames
     */
    readonly objectTypeNames?: Array<CfnIntegration.ObjectTypeMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The URI of the S3 bucket or any other type of data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-uri
     */
    readonly uri?: string;
}

/**
 * Determine whether the given properties match those of a `CfnIntegrationProps`
 *
 * @param properties - the TypeScript properties of a `CfnIntegrationProps`
 *
 * @returns the result of the validation.
 */
function CfnIntegrationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('flowDefinition', CfnIntegration_FlowDefinitionPropertyValidator)(properties.flowDefinition));
    errors.collect(cdk.propertyValidator('objectTypeName', cdk.validateString)(properties.objectTypeName));
    errors.collect(cdk.propertyValidator('objectTypeNames', cdk.listValidator(CfnIntegration_ObjectTypeMappingPropertyValidator))(properties.objectTypeNames));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('uri', cdk.validateString)(properties.uri));
    return errors.wrap('supplied properties not correct for "CfnIntegrationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration` resource
 *
 * @param properties - the TypeScript properties of a `CfnIntegrationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegrationPropsValidator(properties).assertSuccess();
    return {
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        FlowDefinition: cfnIntegrationFlowDefinitionPropertyToCloudFormation(properties.flowDefinition),
        ObjectTypeName: cdk.stringToCloudFormation(properties.objectTypeName),
        ObjectTypeNames: cdk.listMapper(cfnIntegrationObjectTypeMappingPropertyToCloudFormation)(properties.objectTypeNames),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        Uri: cdk.stringToCloudFormation(properties.uri),
    };
}

// @ts-ignore TS6133
function CfnIntegrationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegrationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegrationProps>();
    ret.addPropertyResult('domainName', 'DomainName', cfn_parse.FromCloudFormation.getString(properties.DomainName));
    ret.addPropertyResult('flowDefinition', 'FlowDefinition', properties.FlowDefinition != null ? CfnIntegrationFlowDefinitionPropertyFromCloudFormation(properties.FlowDefinition) : undefined);
    ret.addPropertyResult('objectTypeName', 'ObjectTypeName', properties.ObjectTypeName != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectTypeName) : undefined);
    ret.addPropertyResult('objectTypeNames', 'ObjectTypeNames', properties.ObjectTypeNames != null ? cfn_parse.FromCloudFormation.getArray(CfnIntegrationObjectTypeMappingPropertyFromCloudFormation)(properties.ObjectTypeNames) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('uri', 'Uri', properties.Uri != null ? cfn_parse.FromCloudFormation.getString(properties.Uri) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CustomerProfiles::Integration`
 *
 * Specifies an Amazon Connect Customer Profiles Integration.
 *
 * @cloudformationResource AWS::CustomerProfiles::Integration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html
 */
export class CfnIntegration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CustomerProfiles::Integration";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIntegration {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnIntegrationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnIntegration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The timestamp of when the integration was created.
     * @cloudformationAttribute CreatedAt
     */
    public readonly attrCreatedAt: string;

    /**
     * The timestamp of when the integration was most recently edited.
     * @cloudformationAttribute LastUpdatedAt
     */
    public readonly attrLastUpdatedAt: string;

    /**
     * The unique name of the domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-domainname
     */
    public domainName: string;

    /**
     * The configuration that controls how Customer Profiles retrieves data from the source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-flowdefinition
     */
    public flowDefinition: CfnIntegration.FlowDefinitionProperty | cdk.IResolvable | undefined;

    /**
     * The name of the profile object type mapping to use.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-objecttypename
     */
    public objectTypeName: string | undefined;

    /**
     * The object type mapping.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-objecttypenames
     */
    public objectTypeNames: Array<CfnIntegration.ObjectTypeMappingProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The URI of the S3 bucket or any other type of data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-integration.html#cfn-customerprofiles-integration-uri
     */
    public uri: string | undefined;

    /**
     * Create a new `AWS::CustomerProfiles::Integration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnIntegrationProps) {
        super(scope, id, { type: CfnIntegration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'domainName', this);
        this.attrCreatedAt = cdk.Token.asString(this.getAtt('CreatedAt', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdatedAt = cdk.Token.asString(this.getAtt('LastUpdatedAt', cdk.ResolutionTypeHint.STRING));

        this.domainName = props.domainName;
        this.flowDefinition = props.flowDefinition;
        this.objectTypeName = props.objectTypeName;
        this.objectTypeNames = props.objectTypeNames;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CustomerProfiles::Integration", props.tags, { tagPropertyName: 'tags' });
        this.uri = props.uri;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnIntegration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            domainName: this.domainName,
            flowDefinition: this.flowDefinition,
            objectTypeName: this.objectTypeName,
            objectTypeNames: this.objectTypeNames,
            tags: this.tags.renderTags(),
            uri: this.uri,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnIntegrationPropsToCloudFormation(props);
    }
}

export namespace CfnIntegration {
    /**
     * The operation to be performed on the provided source fields.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-connectoroperator.html
     */
    export interface ConnectorOperatorProperty {
        /**
         * The operation to be performed on the provided Marketo source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-connectoroperator.html#cfn-customerprofiles-integration-connectoroperator-marketo
         */
        readonly marketo?: string;
        /**
         * The operation to be performed on the provided Amazon S3 source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-connectoroperator.html#cfn-customerprofiles-integration-connectoroperator-s3
         */
        readonly s3?: string;
        /**
         * The operation to be performed on the provided Salesforce source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-connectoroperator.html#cfn-customerprofiles-integration-connectoroperator-salesforce
         */
        readonly salesforce?: string;
        /**
         * The operation to be performed on the provided ServiceNow source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-connectoroperator.html#cfn-customerprofiles-integration-connectoroperator-servicenow
         */
        readonly serviceNow?: string;
        /**
         * The operation to be performed on the provided Zendesk source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-connectoroperator.html#cfn-customerprofiles-integration-connectoroperator-zendesk
         */
        readonly zendesk?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ConnectorOperatorProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectorOperatorProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_ConnectorOperatorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('marketo', cdk.validateString)(properties.marketo));
    errors.collect(cdk.propertyValidator('s3', cdk.validateString)(properties.s3));
    errors.collect(cdk.propertyValidator('salesforce', cdk.validateString)(properties.salesforce));
    errors.collect(cdk.propertyValidator('serviceNow', cdk.validateString)(properties.serviceNow));
    errors.collect(cdk.propertyValidator('zendesk', cdk.validateString)(properties.zendesk));
    return errors.wrap('supplied properties not correct for "ConnectorOperatorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.ConnectorOperator` resource
 *
 * @param properties - the TypeScript properties of a `ConnectorOperatorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.ConnectorOperator` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationConnectorOperatorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_ConnectorOperatorPropertyValidator(properties).assertSuccess();
    return {
        Marketo: cdk.stringToCloudFormation(properties.marketo),
        S3: cdk.stringToCloudFormation(properties.s3),
        Salesforce: cdk.stringToCloudFormation(properties.salesforce),
        ServiceNow: cdk.stringToCloudFormation(properties.serviceNow),
        Zendesk: cdk.stringToCloudFormation(properties.zendesk),
    };
}

// @ts-ignore TS6133
function CfnIntegrationConnectorOperatorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.ConnectorOperatorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.ConnectorOperatorProperty>();
    ret.addPropertyResult('marketo', 'Marketo', properties.Marketo != null ? cfn_parse.FromCloudFormation.getString(properties.Marketo) : undefined);
    ret.addPropertyResult('s3', 'S3', properties.S3 != null ? cfn_parse.FromCloudFormation.getString(properties.S3) : undefined);
    ret.addPropertyResult('salesforce', 'Salesforce', properties.Salesforce != null ? cfn_parse.FromCloudFormation.getString(properties.Salesforce) : undefined);
    ret.addPropertyResult('serviceNow', 'ServiceNow', properties.ServiceNow != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceNow) : undefined);
    ret.addPropertyResult('zendesk', 'Zendesk', properties.Zendesk != null ? cfn_parse.FromCloudFormation.getString(properties.Zendesk) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIntegration {
    /**
     * The configurations that control how Customer Profiles retrieves data from the source, Amazon AppFlow. Customer Profiles uses this information to create an AppFlow flow on behalf of customers.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-flowdefinition.html
     */
    export interface FlowDefinitionProperty {
        /**
         * A description of the flow you want to create.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-flowdefinition.html#cfn-customerprofiles-integration-flowdefinition-description
         */
        readonly description?: string;
        /**
         * The specified name of the flow. Use underscores (_) or hyphens (-) only. Spaces are not allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-flowdefinition.html#cfn-customerprofiles-integration-flowdefinition-flowname
         */
        readonly flowName: string;
        /**
         * The Amazon Resource Name (ARN) of the AWS Key Management Service (KMS) key you provide for encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-flowdefinition.html#cfn-customerprofiles-integration-flowdefinition-kmsarn
         */
        readonly kmsArn: string;
        /**
         * The configuration that controls how Customer Profiles retrieves data from the source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-flowdefinition.html#cfn-customerprofiles-integration-flowdefinition-sourceflowconfig
         */
        readonly sourceFlowConfig: CfnIntegration.SourceFlowConfigProperty | cdk.IResolvable;
        /**
         * A list of tasks that Customer Profiles performs while transferring the data in the flow run.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-flowdefinition.html#cfn-customerprofiles-integration-flowdefinition-tasks
         */
        readonly tasks: Array<CfnIntegration.TaskProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The trigger settings that determine how and when the flow runs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-flowdefinition.html#cfn-customerprofiles-integration-flowdefinition-triggerconfig
         */
        readonly triggerConfig: CfnIntegration.TriggerConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FlowDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `FlowDefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_FlowDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('flowName', cdk.requiredValidator)(properties.flowName));
    errors.collect(cdk.propertyValidator('flowName', cdk.validateString)(properties.flowName));
    errors.collect(cdk.propertyValidator('kmsArn', cdk.requiredValidator)(properties.kmsArn));
    errors.collect(cdk.propertyValidator('kmsArn', cdk.validateString)(properties.kmsArn));
    errors.collect(cdk.propertyValidator('sourceFlowConfig', cdk.requiredValidator)(properties.sourceFlowConfig));
    errors.collect(cdk.propertyValidator('sourceFlowConfig', CfnIntegration_SourceFlowConfigPropertyValidator)(properties.sourceFlowConfig));
    errors.collect(cdk.propertyValidator('tasks', cdk.requiredValidator)(properties.tasks));
    errors.collect(cdk.propertyValidator('tasks', cdk.listValidator(CfnIntegration_TaskPropertyValidator))(properties.tasks));
    errors.collect(cdk.propertyValidator('triggerConfig', cdk.requiredValidator)(properties.triggerConfig));
    errors.collect(cdk.propertyValidator('triggerConfig', CfnIntegration_TriggerConfigPropertyValidator)(properties.triggerConfig));
    return errors.wrap('supplied properties not correct for "FlowDefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.FlowDefinition` resource
 *
 * @param properties - the TypeScript properties of a `FlowDefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.FlowDefinition` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationFlowDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_FlowDefinitionPropertyValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        FlowName: cdk.stringToCloudFormation(properties.flowName),
        KmsArn: cdk.stringToCloudFormation(properties.kmsArn),
        SourceFlowConfig: cfnIntegrationSourceFlowConfigPropertyToCloudFormation(properties.sourceFlowConfig),
        Tasks: cdk.listMapper(cfnIntegrationTaskPropertyToCloudFormation)(properties.tasks),
        TriggerConfig: cfnIntegrationTriggerConfigPropertyToCloudFormation(properties.triggerConfig),
    };
}

// @ts-ignore TS6133
function CfnIntegrationFlowDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.FlowDefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.FlowDefinitionProperty>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('flowName', 'FlowName', cfn_parse.FromCloudFormation.getString(properties.FlowName));
    ret.addPropertyResult('kmsArn', 'KmsArn', cfn_parse.FromCloudFormation.getString(properties.KmsArn));
    ret.addPropertyResult('sourceFlowConfig', 'SourceFlowConfig', CfnIntegrationSourceFlowConfigPropertyFromCloudFormation(properties.SourceFlowConfig));
    ret.addPropertyResult('tasks', 'Tasks', cfn_parse.FromCloudFormation.getArray(CfnIntegrationTaskPropertyFromCloudFormation)(properties.Tasks));
    ret.addPropertyResult('triggerConfig', 'TriggerConfig', CfnIntegrationTriggerConfigPropertyFromCloudFormation(properties.TriggerConfig));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIntegration {
    /**
     * Specifies the configuration used when importing incremental records from the source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-incrementalpullconfig.html
     */
    export interface IncrementalPullConfigProperty {
        /**
         * A field that specifies the date time or timestamp field as the criteria to use when importing incremental records from the source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-incrementalpullconfig.html#cfn-customerprofiles-integration-incrementalpullconfig-datetimetypefieldname
         */
        readonly datetimeTypeFieldName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `IncrementalPullConfigProperty`
 *
 * @param properties - the TypeScript properties of a `IncrementalPullConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_IncrementalPullConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('datetimeTypeFieldName', cdk.validateString)(properties.datetimeTypeFieldName));
    return errors.wrap('supplied properties not correct for "IncrementalPullConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.IncrementalPullConfig` resource
 *
 * @param properties - the TypeScript properties of a `IncrementalPullConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.IncrementalPullConfig` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationIncrementalPullConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_IncrementalPullConfigPropertyValidator(properties).assertSuccess();
    return {
        DatetimeTypeFieldName: cdk.stringToCloudFormation(properties.datetimeTypeFieldName),
    };
}

// @ts-ignore TS6133
function CfnIntegrationIncrementalPullConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.IncrementalPullConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.IncrementalPullConfigProperty>();
    ret.addPropertyResult('datetimeTypeFieldName', 'DatetimeTypeFieldName', properties.DatetimeTypeFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DatetimeTypeFieldName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIntegration {
    /**
     * The properties that are applied when Marketo is being used as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-marketosourceproperties.html
     */
    export interface MarketoSourcePropertiesProperty {
        /**
         * The object specified in the Marketo flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-marketosourceproperties.html#cfn-customerprofiles-integration-marketosourceproperties-object
         */
        readonly object: string;
    }
}

/**
 * Determine whether the given properties match those of a `MarketoSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `MarketoSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_MarketoSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('object', cdk.requiredValidator)(properties.object));
    errors.collect(cdk.propertyValidator('object', cdk.validateString)(properties.object));
    return errors.wrap('supplied properties not correct for "MarketoSourcePropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.MarketoSourceProperties` resource
 *
 * @param properties - the TypeScript properties of a `MarketoSourcePropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.MarketoSourceProperties` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationMarketoSourcePropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_MarketoSourcePropertiesPropertyValidator(properties).assertSuccess();
    return {
        Object: cdk.stringToCloudFormation(properties.object),
    };
}

// @ts-ignore TS6133
function CfnIntegrationMarketoSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.MarketoSourcePropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.MarketoSourcePropertiesProperty>();
    ret.addPropertyResult('object', 'Object', cfn_parse.FromCloudFormation.getString(properties.Object));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIntegration {
    /**
     * A map in which each key is an event type from an external application such as Segment or Shopify, and each value is an `ObjectTypeName` (template) used to ingest the event.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-objecttypemapping.html
     */
    export interface ObjectTypeMappingProperty {
        /**
         * The key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-objecttypemapping.html#cfn-customerprofiles-integration-objecttypemapping-key
         */
        readonly key: string;
        /**
         * The value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-objecttypemapping.html#cfn-customerprofiles-integration-objecttypemapping-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `ObjectTypeMappingProperty`
 *
 * @param properties - the TypeScript properties of a `ObjectTypeMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_ObjectTypeMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "ObjectTypeMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.ObjectTypeMapping` resource
 *
 * @param properties - the TypeScript properties of a `ObjectTypeMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.ObjectTypeMapping` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationObjectTypeMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_ObjectTypeMappingPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnIntegrationObjectTypeMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.ObjectTypeMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.ObjectTypeMappingProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIntegration {
    /**
     * The properties that are applied when Amazon S3 is being used as the flow source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-s3sourceproperties.html
     */
    export interface S3SourcePropertiesProperty {
        /**
         * The Amazon S3 bucket name where the source files are stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-s3sourceproperties.html#cfn-customerprofiles-integration-s3sourceproperties-bucketname
         */
        readonly bucketName: string;
        /**
         * The object key for the Amazon S3 bucket in which the source files are stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-s3sourceproperties.html#cfn-customerprofiles-integration-s3sourceproperties-bucketprefix
         */
        readonly bucketPrefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3SourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `S3SourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_S3SourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketName', cdk.requiredValidator)(properties.bucketName));
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    errors.collect(cdk.propertyValidator('bucketPrefix', cdk.validateString)(properties.bucketPrefix));
    return errors.wrap('supplied properties not correct for "S3SourcePropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.S3SourceProperties` resource
 *
 * @param properties - the TypeScript properties of a `S3SourcePropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.S3SourceProperties` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationS3SourcePropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_S3SourcePropertiesPropertyValidator(properties).assertSuccess();
    return {
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        BucketPrefix: cdk.stringToCloudFormation(properties.bucketPrefix),
    };
}

// @ts-ignore TS6133
function CfnIntegrationS3SourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.S3SourcePropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.S3SourcePropertiesProperty>();
    ret.addPropertyResult('bucketName', 'BucketName', cfn_parse.FromCloudFormation.getString(properties.BucketName));
    ret.addPropertyResult('bucketPrefix', 'BucketPrefix', properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIntegration {
    /**
     * The properties that are applied when Salesforce is being used as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-salesforcesourceproperties.html
     */
    export interface SalesforceSourcePropertiesProperty {
        /**
         * The flag that enables dynamic fetching of new (recently added) fields in the Salesforce objects while running a flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-salesforcesourceproperties.html#cfn-customerprofiles-integration-salesforcesourceproperties-enabledynamicfieldupdate
         */
        readonly enableDynamicFieldUpdate?: boolean | cdk.IResolvable;
        /**
         * Indicates whether Amazon AppFlow includes deleted files in the flow run.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-salesforcesourceproperties.html#cfn-customerprofiles-integration-salesforcesourceproperties-includedeletedrecords
         */
        readonly includeDeletedRecords?: boolean | cdk.IResolvable;
        /**
         * The object specified in the Salesforce flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-salesforcesourceproperties.html#cfn-customerprofiles-integration-salesforcesourceproperties-object
         */
        readonly object: string;
    }
}

/**
 * Determine whether the given properties match those of a `SalesforceSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SalesforceSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_SalesforceSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enableDynamicFieldUpdate', cdk.validateBoolean)(properties.enableDynamicFieldUpdate));
    errors.collect(cdk.propertyValidator('includeDeletedRecords', cdk.validateBoolean)(properties.includeDeletedRecords));
    errors.collect(cdk.propertyValidator('object', cdk.requiredValidator)(properties.object));
    errors.collect(cdk.propertyValidator('object', cdk.validateString)(properties.object));
    return errors.wrap('supplied properties not correct for "SalesforceSourcePropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.SalesforceSourceProperties` resource
 *
 * @param properties - the TypeScript properties of a `SalesforceSourcePropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.SalesforceSourceProperties` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationSalesforceSourcePropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_SalesforceSourcePropertiesPropertyValidator(properties).assertSuccess();
    return {
        EnableDynamicFieldUpdate: cdk.booleanToCloudFormation(properties.enableDynamicFieldUpdate),
        IncludeDeletedRecords: cdk.booleanToCloudFormation(properties.includeDeletedRecords),
        Object: cdk.stringToCloudFormation(properties.object),
    };
}

// @ts-ignore TS6133
function CfnIntegrationSalesforceSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.SalesforceSourcePropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.SalesforceSourcePropertiesProperty>();
    ret.addPropertyResult('enableDynamicFieldUpdate', 'EnableDynamicFieldUpdate', properties.EnableDynamicFieldUpdate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableDynamicFieldUpdate) : undefined);
    ret.addPropertyResult('includeDeletedRecords', 'IncludeDeletedRecords', properties.IncludeDeletedRecords != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeDeletedRecords) : undefined);
    ret.addPropertyResult('object', 'Object', cfn_parse.FromCloudFormation.getString(properties.Object));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIntegration {
    /**
     * Specifies the configuration details of a scheduled-trigger flow that you define. Currently, these settings only apply to the scheduled-trigger type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html
     */
    export interface ScheduledTriggerPropertiesProperty {
        /**
         * Specifies whether a scheduled flow has an incremental data transfer or a complete data transfer for each flow run.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html#cfn-customerprofiles-integration-scheduledtriggerproperties-datapullmode
         */
        readonly dataPullMode?: string;
        /**
         * Specifies the date range for the records to import from the connector in the first flow run.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html#cfn-customerprofiles-integration-scheduledtriggerproperties-firstexecutionfrom
         */
        readonly firstExecutionFrom?: number;
        /**
         * Specifies the scheduled end time for a scheduled-trigger flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html#cfn-customerprofiles-integration-scheduledtriggerproperties-scheduleendtime
         */
        readonly scheduleEndTime?: number;
        /**
         * The scheduling expression that determines the rate at which the schedule will run, for example rate (5 minutes).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html#cfn-customerprofiles-integration-scheduledtriggerproperties-scheduleexpression
         */
        readonly scheduleExpression: string;
        /**
         * Specifies the optional offset that is added to the time interval for a schedule-triggered flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html#cfn-customerprofiles-integration-scheduledtriggerproperties-scheduleoffset
         */
        readonly scheduleOffset?: number;
        /**
         * Specifies the scheduled start time for a scheduled-trigger flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html#cfn-customerprofiles-integration-scheduledtriggerproperties-schedulestarttime
         */
        readonly scheduleStartTime?: number;
        /**
         * Specifies the time zone used when referring to the date and time of a scheduled-triggered flow, such as America/New_York.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-scheduledtriggerproperties.html#cfn-customerprofiles-integration-scheduledtriggerproperties-timezone
         */
        readonly timezone?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ScheduledTriggerPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduledTriggerPropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_ScheduledTriggerPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataPullMode', cdk.validateString)(properties.dataPullMode));
    errors.collect(cdk.propertyValidator('firstExecutionFrom', cdk.validateNumber)(properties.firstExecutionFrom));
    errors.collect(cdk.propertyValidator('scheduleEndTime', cdk.validateNumber)(properties.scheduleEndTime));
    errors.collect(cdk.propertyValidator('scheduleExpression', cdk.requiredValidator)(properties.scheduleExpression));
    errors.collect(cdk.propertyValidator('scheduleExpression', cdk.validateString)(properties.scheduleExpression));
    errors.collect(cdk.propertyValidator('scheduleOffset', cdk.validateNumber)(properties.scheduleOffset));
    errors.collect(cdk.propertyValidator('scheduleStartTime', cdk.validateNumber)(properties.scheduleStartTime));
    errors.collect(cdk.propertyValidator('timezone', cdk.validateString)(properties.timezone));
    return errors.wrap('supplied properties not correct for "ScheduledTriggerPropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.ScheduledTriggerProperties` resource
 *
 * @param properties - the TypeScript properties of a `ScheduledTriggerPropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.ScheduledTriggerProperties` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationScheduledTriggerPropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_ScheduledTriggerPropertiesPropertyValidator(properties).assertSuccess();
    return {
        DataPullMode: cdk.stringToCloudFormation(properties.dataPullMode),
        FirstExecutionFrom: cdk.numberToCloudFormation(properties.firstExecutionFrom),
        ScheduleEndTime: cdk.numberToCloudFormation(properties.scheduleEndTime),
        ScheduleExpression: cdk.stringToCloudFormation(properties.scheduleExpression),
        ScheduleOffset: cdk.numberToCloudFormation(properties.scheduleOffset),
        ScheduleStartTime: cdk.numberToCloudFormation(properties.scheduleStartTime),
        Timezone: cdk.stringToCloudFormation(properties.timezone),
    };
}

// @ts-ignore TS6133
function CfnIntegrationScheduledTriggerPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.ScheduledTriggerPropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.ScheduledTriggerPropertiesProperty>();
    ret.addPropertyResult('dataPullMode', 'DataPullMode', properties.DataPullMode != null ? cfn_parse.FromCloudFormation.getString(properties.DataPullMode) : undefined);
    ret.addPropertyResult('firstExecutionFrom', 'FirstExecutionFrom', properties.FirstExecutionFrom != null ? cfn_parse.FromCloudFormation.getNumber(properties.FirstExecutionFrom) : undefined);
    ret.addPropertyResult('scheduleEndTime', 'ScheduleEndTime', properties.ScheduleEndTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScheduleEndTime) : undefined);
    ret.addPropertyResult('scheduleExpression', 'ScheduleExpression', cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression));
    ret.addPropertyResult('scheduleOffset', 'ScheduleOffset', properties.ScheduleOffset != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScheduleOffset) : undefined);
    ret.addPropertyResult('scheduleStartTime', 'ScheduleStartTime', properties.ScheduleStartTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScheduleStartTime) : undefined);
    ret.addPropertyResult('timezone', 'Timezone', properties.Timezone != null ? cfn_parse.FromCloudFormation.getString(properties.Timezone) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIntegration {
    /**
     * The properties that are applied when ServiceNow is being used as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-servicenowsourceproperties.html
     */
    export interface ServiceNowSourcePropertiesProperty {
        /**
         * The object specified in the ServiceNow flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-servicenowsourceproperties.html#cfn-customerprofiles-integration-servicenowsourceproperties-object
         */
        readonly object: string;
    }
}

/**
 * Determine whether the given properties match those of a `ServiceNowSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceNowSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_ServiceNowSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('object', cdk.requiredValidator)(properties.object));
    errors.collect(cdk.propertyValidator('object', cdk.validateString)(properties.object));
    return errors.wrap('supplied properties not correct for "ServiceNowSourcePropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.ServiceNowSourceProperties` resource
 *
 * @param properties - the TypeScript properties of a `ServiceNowSourcePropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.ServiceNowSourceProperties` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationServiceNowSourcePropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_ServiceNowSourcePropertiesPropertyValidator(properties).assertSuccess();
    return {
        Object: cdk.stringToCloudFormation(properties.object),
    };
}

// @ts-ignore TS6133
function CfnIntegrationServiceNowSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.ServiceNowSourcePropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.ServiceNowSourcePropertiesProperty>();
    ret.addPropertyResult('object', 'Object', cfn_parse.FromCloudFormation.getString(properties.Object));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIntegration {
    /**
     * Specifies the information that is required to query a particular Amazon AppFlow connector. Customer Profiles supports Salesforce, Zendesk, Marketo, ServiceNow and Amazon S3.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceconnectorproperties.html
     */
    export interface SourceConnectorPropertiesProperty {
        /**
         * The properties that are applied when Marketo is being used as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceconnectorproperties.html#cfn-customerprofiles-integration-sourceconnectorproperties-marketo
         */
        readonly marketo?: CfnIntegration.MarketoSourcePropertiesProperty | cdk.IResolvable;
        /**
         * The properties that are applied when Amazon S3 is being used as the flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceconnectorproperties.html#cfn-customerprofiles-integration-sourceconnectorproperties-s3
         */
        readonly s3?: CfnIntegration.S3SourcePropertiesProperty | cdk.IResolvable;
        /**
         * The properties that are applied when Salesforce is being used as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceconnectorproperties.html#cfn-customerprofiles-integration-sourceconnectorproperties-salesforce
         */
        readonly salesforce?: CfnIntegration.SalesforceSourcePropertiesProperty | cdk.IResolvable;
        /**
         * The properties that are applied when ServiceNow is being used as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceconnectorproperties.html#cfn-customerprofiles-integration-sourceconnectorproperties-servicenow
         */
        readonly serviceNow?: CfnIntegration.ServiceNowSourcePropertiesProperty | cdk.IResolvable;
        /**
         * The properties that are applied when using Zendesk as a flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceconnectorproperties.html#cfn-customerprofiles-integration-sourceconnectorproperties-zendesk
         */
        readonly zendesk?: CfnIntegration.ZendeskSourcePropertiesProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SourceConnectorPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SourceConnectorPropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_SourceConnectorPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('marketo', CfnIntegration_MarketoSourcePropertiesPropertyValidator)(properties.marketo));
    errors.collect(cdk.propertyValidator('s3', CfnIntegration_S3SourcePropertiesPropertyValidator)(properties.s3));
    errors.collect(cdk.propertyValidator('salesforce', CfnIntegration_SalesforceSourcePropertiesPropertyValidator)(properties.salesforce));
    errors.collect(cdk.propertyValidator('serviceNow', CfnIntegration_ServiceNowSourcePropertiesPropertyValidator)(properties.serviceNow));
    errors.collect(cdk.propertyValidator('zendesk', CfnIntegration_ZendeskSourcePropertiesPropertyValidator)(properties.zendesk));
    return errors.wrap('supplied properties not correct for "SourceConnectorPropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.SourceConnectorProperties` resource
 *
 * @param properties - the TypeScript properties of a `SourceConnectorPropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.SourceConnectorProperties` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationSourceConnectorPropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_SourceConnectorPropertiesPropertyValidator(properties).assertSuccess();
    return {
        Marketo: cfnIntegrationMarketoSourcePropertiesPropertyToCloudFormation(properties.marketo),
        S3: cfnIntegrationS3SourcePropertiesPropertyToCloudFormation(properties.s3),
        Salesforce: cfnIntegrationSalesforceSourcePropertiesPropertyToCloudFormation(properties.salesforce),
        ServiceNow: cfnIntegrationServiceNowSourcePropertiesPropertyToCloudFormation(properties.serviceNow),
        Zendesk: cfnIntegrationZendeskSourcePropertiesPropertyToCloudFormation(properties.zendesk),
    };
}

// @ts-ignore TS6133
function CfnIntegrationSourceConnectorPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.SourceConnectorPropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.SourceConnectorPropertiesProperty>();
    ret.addPropertyResult('marketo', 'Marketo', properties.Marketo != null ? CfnIntegrationMarketoSourcePropertiesPropertyFromCloudFormation(properties.Marketo) : undefined);
    ret.addPropertyResult('s3', 'S3', properties.S3 != null ? CfnIntegrationS3SourcePropertiesPropertyFromCloudFormation(properties.S3) : undefined);
    ret.addPropertyResult('salesforce', 'Salesforce', properties.Salesforce != null ? CfnIntegrationSalesforceSourcePropertiesPropertyFromCloudFormation(properties.Salesforce) : undefined);
    ret.addPropertyResult('serviceNow', 'ServiceNow', properties.ServiceNow != null ? CfnIntegrationServiceNowSourcePropertiesPropertyFromCloudFormation(properties.ServiceNow) : undefined);
    ret.addPropertyResult('zendesk', 'Zendesk', properties.Zendesk != null ? CfnIntegrationZendeskSourcePropertiesPropertyFromCloudFormation(properties.Zendesk) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIntegration {
    /**
     * The configuration that controls how Customer Profiles retrieves data from the source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceflowconfig.html
     */
    export interface SourceFlowConfigProperty {
        /**
         * The name of the Amazon AppFlow connector profile. This name must be unique for each connector profile in the AWS account .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceflowconfig.html#cfn-customerprofiles-integration-sourceflowconfig-connectorprofilename
         */
        readonly connectorProfileName?: string;
        /**
         * The type of connector, such as Salesforce, Marketo, and so on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceflowconfig.html#cfn-customerprofiles-integration-sourceflowconfig-connectortype
         */
        readonly connectorType: string;
        /**
         * Defines the configuration for a scheduled incremental data pull. If a valid configuration is provided, the fields specified in the configuration are used when querying for the incremental data pull.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceflowconfig.html#cfn-customerprofiles-integration-sourceflowconfig-incrementalpullconfig
         */
        readonly incrementalPullConfig?: CfnIntegration.IncrementalPullConfigProperty | cdk.IResolvable;
        /**
         * Specifies the information that is required to query a particular source connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-sourceflowconfig.html#cfn-customerprofiles-integration-sourceflowconfig-sourceconnectorproperties
         */
        readonly sourceConnectorProperties: CfnIntegration.SourceConnectorPropertiesProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SourceFlowConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SourceFlowConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_SourceFlowConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('connectorProfileName', cdk.validateString)(properties.connectorProfileName));
    errors.collect(cdk.propertyValidator('connectorType', cdk.requiredValidator)(properties.connectorType));
    errors.collect(cdk.propertyValidator('connectorType', cdk.validateString)(properties.connectorType));
    errors.collect(cdk.propertyValidator('incrementalPullConfig', CfnIntegration_IncrementalPullConfigPropertyValidator)(properties.incrementalPullConfig));
    errors.collect(cdk.propertyValidator('sourceConnectorProperties', cdk.requiredValidator)(properties.sourceConnectorProperties));
    errors.collect(cdk.propertyValidator('sourceConnectorProperties', CfnIntegration_SourceConnectorPropertiesPropertyValidator)(properties.sourceConnectorProperties));
    return errors.wrap('supplied properties not correct for "SourceFlowConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.SourceFlowConfig` resource
 *
 * @param properties - the TypeScript properties of a `SourceFlowConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.SourceFlowConfig` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationSourceFlowConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_SourceFlowConfigPropertyValidator(properties).assertSuccess();
    return {
        ConnectorProfileName: cdk.stringToCloudFormation(properties.connectorProfileName),
        ConnectorType: cdk.stringToCloudFormation(properties.connectorType),
        IncrementalPullConfig: cfnIntegrationIncrementalPullConfigPropertyToCloudFormation(properties.incrementalPullConfig),
        SourceConnectorProperties: cfnIntegrationSourceConnectorPropertiesPropertyToCloudFormation(properties.sourceConnectorProperties),
    };
}

// @ts-ignore TS6133
function CfnIntegrationSourceFlowConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.SourceFlowConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.SourceFlowConfigProperty>();
    ret.addPropertyResult('connectorProfileName', 'ConnectorProfileName', properties.ConnectorProfileName != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorProfileName) : undefined);
    ret.addPropertyResult('connectorType', 'ConnectorType', cfn_parse.FromCloudFormation.getString(properties.ConnectorType));
    ret.addPropertyResult('incrementalPullConfig', 'IncrementalPullConfig', properties.IncrementalPullConfig != null ? CfnIntegrationIncrementalPullConfigPropertyFromCloudFormation(properties.IncrementalPullConfig) : undefined);
    ret.addPropertyResult('sourceConnectorProperties', 'SourceConnectorProperties', CfnIntegrationSourceConnectorPropertiesPropertyFromCloudFormation(properties.SourceConnectorProperties));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIntegration {
    /**
     * The `Task` property type specifies the class for modeling different type of tasks. Task implementation varies based on the TaskType.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-task.html
     */
    export interface TaskProperty {
        /**
         * The operation to be performed on the provided source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-task.html#cfn-customerprofiles-integration-task-connectoroperator
         */
        readonly connectorOperator?: CfnIntegration.ConnectorOperatorProperty | cdk.IResolvable;
        /**
         * A field in a destination connector, or a field value against which Amazon AppFlow validates a source field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-task.html#cfn-customerprofiles-integration-task-destinationfield
         */
        readonly destinationField?: string;
        /**
         * The source fields to which a particular task is applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-task.html#cfn-customerprofiles-integration-task-sourcefields
         */
        readonly sourceFields: string[];
        /**
         * A map used to store task-related information. The service looks for particular information based on the TaskType.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-task.html#cfn-customerprofiles-integration-task-taskproperties
         */
        readonly taskProperties?: Array<CfnIntegration.TaskPropertiesMapProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies the particular task implementation that Amazon AppFlow performs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-task.html#cfn-customerprofiles-integration-task-tasktype
         */
        readonly taskType: string;
    }
}

/**
 * Determine whether the given properties match those of a `TaskProperty`
 *
 * @param properties - the TypeScript properties of a `TaskProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_TaskPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('connectorOperator', CfnIntegration_ConnectorOperatorPropertyValidator)(properties.connectorOperator));
    errors.collect(cdk.propertyValidator('destinationField', cdk.validateString)(properties.destinationField));
    errors.collect(cdk.propertyValidator('sourceFields', cdk.requiredValidator)(properties.sourceFields));
    errors.collect(cdk.propertyValidator('sourceFields', cdk.listValidator(cdk.validateString))(properties.sourceFields));
    errors.collect(cdk.propertyValidator('taskProperties', cdk.listValidator(CfnIntegration_TaskPropertiesMapPropertyValidator))(properties.taskProperties));
    errors.collect(cdk.propertyValidator('taskType', cdk.requiredValidator)(properties.taskType));
    errors.collect(cdk.propertyValidator('taskType', cdk.validateString)(properties.taskType));
    return errors.wrap('supplied properties not correct for "TaskProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.Task` resource
 *
 * @param properties - the TypeScript properties of a `TaskProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.Task` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationTaskPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_TaskPropertyValidator(properties).assertSuccess();
    return {
        ConnectorOperator: cfnIntegrationConnectorOperatorPropertyToCloudFormation(properties.connectorOperator),
        DestinationField: cdk.stringToCloudFormation(properties.destinationField),
        SourceFields: cdk.listMapper(cdk.stringToCloudFormation)(properties.sourceFields),
        TaskProperties: cdk.listMapper(cfnIntegrationTaskPropertiesMapPropertyToCloudFormation)(properties.taskProperties),
        TaskType: cdk.stringToCloudFormation(properties.taskType),
    };
}

// @ts-ignore TS6133
function CfnIntegrationTaskPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.TaskProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.TaskProperty>();
    ret.addPropertyResult('connectorOperator', 'ConnectorOperator', properties.ConnectorOperator != null ? CfnIntegrationConnectorOperatorPropertyFromCloudFormation(properties.ConnectorOperator) : undefined);
    ret.addPropertyResult('destinationField', 'DestinationField', properties.DestinationField != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationField) : undefined);
    ret.addPropertyResult('sourceFields', 'SourceFields', cfn_parse.FromCloudFormation.getStringArray(properties.SourceFields));
    ret.addPropertyResult('taskProperties', 'TaskProperties', properties.TaskProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnIntegrationTaskPropertiesMapPropertyFromCloudFormation)(properties.TaskProperties) : undefined);
    ret.addPropertyResult('taskType', 'TaskType', cfn_parse.FromCloudFormation.getString(properties.TaskType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIntegration {
    /**
     * A map used to store task-related information. The execution service looks for particular information based on the `TaskType` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-taskpropertiesmap.html
     */
    export interface TaskPropertiesMapProperty {
        /**
         * The task property key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-taskpropertiesmap.html#cfn-customerprofiles-integration-taskpropertiesmap-operatorpropertykey
         */
        readonly operatorPropertyKey: string;
        /**
         * The task property value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-taskpropertiesmap.html#cfn-customerprofiles-integration-taskpropertiesmap-property
         */
        readonly property: string;
    }
}

/**
 * Determine whether the given properties match those of a `TaskPropertiesMapProperty`
 *
 * @param properties - the TypeScript properties of a `TaskPropertiesMapProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_TaskPropertiesMapPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('operatorPropertyKey', cdk.requiredValidator)(properties.operatorPropertyKey));
    errors.collect(cdk.propertyValidator('operatorPropertyKey', cdk.validateString)(properties.operatorPropertyKey));
    errors.collect(cdk.propertyValidator('property', cdk.requiredValidator)(properties.property));
    errors.collect(cdk.propertyValidator('property', cdk.validateString)(properties.property));
    return errors.wrap('supplied properties not correct for "TaskPropertiesMapProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.TaskPropertiesMap` resource
 *
 * @param properties - the TypeScript properties of a `TaskPropertiesMapProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.TaskPropertiesMap` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationTaskPropertiesMapPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_TaskPropertiesMapPropertyValidator(properties).assertSuccess();
    return {
        OperatorPropertyKey: cdk.stringToCloudFormation(properties.operatorPropertyKey),
        Property: cdk.stringToCloudFormation(properties.property),
    };
}

// @ts-ignore TS6133
function CfnIntegrationTaskPropertiesMapPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.TaskPropertiesMapProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.TaskPropertiesMapProperty>();
    ret.addPropertyResult('operatorPropertyKey', 'OperatorPropertyKey', cfn_parse.FromCloudFormation.getString(properties.OperatorPropertyKey));
    ret.addPropertyResult('property', 'Property', cfn_parse.FromCloudFormation.getString(properties.Property));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIntegration {
    /**
     * The trigger settings that determine how and when Amazon AppFlow runs the specified flow.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-triggerconfig.html
     */
    export interface TriggerConfigProperty {
        /**
         * Specifies the configuration details of a schedule-triggered flow that you define. Currently, these settings only apply to the Scheduled trigger type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-triggerconfig.html#cfn-customerprofiles-integration-triggerconfig-triggerproperties
         */
        readonly triggerProperties?: CfnIntegration.TriggerPropertiesProperty | cdk.IResolvable;
        /**
         * Specifies the type of flow trigger. It can be OnDemand, Scheduled, or Event.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-triggerconfig.html#cfn-customerprofiles-integration-triggerconfig-triggertype
         */
        readonly triggerType: string;
    }
}

/**
 * Determine whether the given properties match those of a `TriggerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TriggerConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_TriggerConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('triggerProperties', CfnIntegration_TriggerPropertiesPropertyValidator)(properties.triggerProperties));
    errors.collect(cdk.propertyValidator('triggerType', cdk.requiredValidator)(properties.triggerType));
    errors.collect(cdk.propertyValidator('triggerType', cdk.validateString)(properties.triggerType));
    return errors.wrap('supplied properties not correct for "TriggerConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.TriggerConfig` resource
 *
 * @param properties - the TypeScript properties of a `TriggerConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.TriggerConfig` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationTriggerConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_TriggerConfigPropertyValidator(properties).assertSuccess();
    return {
        TriggerProperties: cfnIntegrationTriggerPropertiesPropertyToCloudFormation(properties.triggerProperties),
        TriggerType: cdk.stringToCloudFormation(properties.triggerType),
    };
}

// @ts-ignore TS6133
function CfnIntegrationTriggerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.TriggerConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.TriggerConfigProperty>();
    ret.addPropertyResult('triggerProperties', 'TriggerProperties', properties.TriggerProperties != null ? CfnIntegrationTriggerPropertiesPropertyFromCloudFormation(properties.TriggerProperties) : undefined);
    ret.addPropertyResult('triggerType', 'TriggerType', cfn_parse.FromCloudFormation.getString(properties.TriggerType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIntegration {
    /**
     * Specifies the configuration details that control the trigger for a flow. Currently, these settings only apply to the Scheduled trigger type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-triggerproperties.html
     */
    export interface TriggerPropertiesProperty {
        /**
         * Specifies the configuration details of a schedule-triggered flow that you define.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-triggerproperties.html#cfn-customerprofiles-integration-triggerproperties-scheduled
         */
        readonly scheduled?: CfnIntegration.ScheduledTriggerPropertiesProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TriggerPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `TriggerPropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_TriggerPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('scheduled', CfnIntegration_ScheduledTriggerPropertiesPropertyValidator)(properties.scheduled));
    return errors.wrap('supplied properties not correct for "TriggerPropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.TriggerProperties` resource
 *
 * @param properties - the TypeScript properties of a `TriggerPropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.TriggerProperties` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationTriggerPropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_TriggerPropertiesPropertyValidator(properties).assertSuccess();
    return {
        Scheduled: cfnIntegrationScheduledTriggerPropertiesPropertyToCloudFormation(properties.scheduled),
    };
}

// @ts-ignore TS6133
function CfnIntegrationTriggerPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.TriggerPropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.TriggerPropertiesProperty>();
    ret.addPropertyResult('scheduled', 'Scheduled', properties.Scheduled != null ? CfnIntegrationScheduledTriggerPropertiesPropertyFromCloudFormation(properties.Scheduled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIntegration {
    /**
     * The properties that are applied when using Zendesk as a flow source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-zendesksourceproperties.html
     */
    export interface ZendeskSourcePropertiesProperty {
        /**
         * The object specified in the Zendesk flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-integration-zendesksourceproperties.html#cfn-customerprofiles-integration-zendesksourceproperties-object
         */
        readonly object: string;
    }
}

/**
 * Determine whether the given properties match those of a `ZendeskSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ZendeskSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnIntegration_ZendeskSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('object', cdk.requiredValidator)(properties.object));
    errors.collect(cdk.propertyValidator('object', cdk.validateString)(properties.object));
    return errors.wrap('supplied properties not correct for "ZendeskSourcePropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.ZendeskSourceProperties` resource
 *
 * @param properties - the TypeScript properties of a `ZendeskSourcePropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::Integration.ZendeskSourceProperties` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationZendeskSourcePropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIntegration_ZendeskSourcePropertiesPropertyValidator(properties).assertSuccess();
    return {
        Object: cdk.stringToCloudFormation(properties.object),
    };
}

// @ts-ignore TS6133
function CfnIntegrationZendeskSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegration.ZendeskSourcePropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.ZendeskSourcePropertiesProperty>();
    ret.addPropertyResult('object', 'Object', cfn_parse.FromCloudFormation.getString(properties.Object));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnObjectType`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html
 */
export interface CfnObjectTypeProps {

    /**
     * The unique name of the domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-domainname
     */
    readonly domainName: string;

    /**
     * Indicates whether a profile should be created when data is received if one doesn’t exist for an object of this type. The default is `FALSE` . If the AllowProfileCreation flag is set to `FALSE` , then the service tries to fetch a standard profile and associate this object with the profile. If it is set to `TRUE` , and if no match is found, then the service creates a new standard profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-allowprofilecreation
     */
    readonly allowProfileCreation?: boolean | cdk.IResolvable;

    /**
     * The description of the profile object type mapping.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-description
     */
    readonly description?: string;

    /**
     * The customer-provided key to encrypt the profile object that will be created in this profile object type mapping. If not specified the system will use the encryption key of the domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-encryptionkey
     */
    readonly encryptionKey?: string;

    /**
     * The number of days until the data of this type expires.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-expirationdays
     */
    readonly expirationDays?: number;

    /**
     * A list of field definitions for the object type mapping.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-fields
     */
    readonly fields?: Array<CfnObjectType.FieldMapProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of keys that can be used to map data to the profile or search for the profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-keys
     */
    readonly keys?: Array<CfnObjectType.KeyMapProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the profile object type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-objecttypename
     */
    readonly objectTypeName?: string;

    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * A unique identifier for the template mapping. This can be used instead of specifying the Keys and Fields properties directly.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-templateid
     */
    readonly templateId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnObjectTypeProps`
 *
 * @param properties - the TypeScript properties of a `CfnObjectTypeProps`
 *
 * @returns the result of the validation.
 */
function CfnObjectTypePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowProfileCreation', cdk.validateBoolean)(properties.allowProfileCreation));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('encryptionKey', cdk.validateString)(properties.encryptionKey));
    errors.collect(cdk.propertyValidator('expirationDays', cdk.validateNumber)(properties.expirationDays));
    errors.collect(cdk.propertyValidator('fields', cdk.listValidator(CfnObjectType_FieldMapPropertyValidator))(properties.fields));
    errors.collect(cdk.propertyValidator('keys', cdk.listValidator(CfnObjectType_KeyMapPropertyValidator))(properties.keys));
    errors.collect(cdk.propertyValidator('objectTypeName', cdk.validateString)(properties.objectTypeName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('templateId', cdk.validateString)(properties.templateId));
    return errors.wrap('supplied properties not correct for "CfnObjectTypeProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::ObjectType` resource
 *
 * @param properties - the TypeScript properties of a `CfnObjectTypeProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::ObjectType` resource.
 */
// @ts-ignore TS6133
function cfnObjectTypePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnObjectTypePropsValidator(properties).assertSuccess();
    return {
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        AllowProfileCreation: cdk.booleanToCloudFormation(properties.allowProfileCreation),
        Description: cdk.stringToCloudFormation(properties.description),
        EncryptionKey: cdk.stringToCloudFormation(properties.encryptionKey),
        ExpirationDays: cdk.numberToCloudFormation(properties.expirationDays),
        Fields: cdk.listMapper(cfnObjectTypeFieldMapPropertyToCloudFormation)(properties.fields),
        Keys: cdk.listMapper(cfnObjectTypeKeyMapPropertyToCloudFormation)(properties.keys),
        ObjectTypeName: cdk.stringToCloudFormation(properties.objectTypeName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TemplateId: cdk.stringToCloudFormation(properties.templateId),
    };
}

// @ts-ignore TS6133
function CfnObjectTypePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnObjectTypeProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnObjectTypeProps>();
    ret.addPropertyResult('domainName', 'DomainName', cfn_parse.FromCloudFormation.getString(properties.DomainName));
    ret.addPropertyResult('allowProfileCreation', 'AllowProfileCreation', properties.AllowProfileCreation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowProfileCreation) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('encryptionKey', 'EncryptionKey', properties.EncryptionKey != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionKey) : undefined);
    ret.addPropertyResult('expirationDays', 'ExpirationDays', properties.ExpirationDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.ExpirationDays) : undefined);
    ret.addPropertyResult('fields', 'Fields', properties.Fields != null ? cfn_parse.FromCloudFormation.getArray(CfnObjectTypeFieldMapPropertyFromCloudFormation)(properties.Fields) : undefined);
    ret.addPropertyResult('keys', 'Keys', properties.Keys != null ? cfn_parse.FromCloudFormation.getArray(CfnObjectTypeKeyMapPropertyFromCloudFormation)(properties.Keys) : undefined);
    ret.addPropertyResult('objectTypeName', 'ObjectTypeName', properties.ObjectTypeName != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectTypeName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('templateId', 'TemplateId', properties.TemplateId != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CustomerProfiles::ObjectType`
 *
 * Specifies an Amazon Connect Customer Profiles Object Type Mapping.
 *
 * @cloudformationResource AWS::CustomerProfiles::ObjectType
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html
 */
export class CfnObjectType extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CustomerProfiles::ObjectType";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnObjectType {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnObjectTypePropsFromCloudFormation(resourceProperties);
        const ret = new CfnObjectType(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The timestamp of when the object type was created.
     * @cloudformationAttribute CreatedAt
     */
    public readonly attrCreatedAt: string;

    /**
     * The timestamp of when the object type was most recently edited.
     * @cloudformationAttribute LastUpdatedAt
     */
    public readonly attrLastUpdatedAt: string;

    /**
     * The unique name of the domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-domainname
     */
    public domainName: string;

    /**
     * Indicates whether a profile should be created when data is received if one doesn’t exist for an object of this type. The default is `FALSE` . If the AllowProfileCreation flag is set to `FALSE` , then the service tries to fetch a standard profile and associate this object with the profile. If it is set to `TRUE` , and if no match is found, then the service creates a new standard profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-allowprofilecreation
     */
    public allowProfileCreation: boolean | cdk.IResolvable | undefined;

    /**
     * The description of the profile object type mapping.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-description
     */
    public description: string | undefined;

    /**
     * The customer-provided key to encrypt the profile object that will be created in this profile object type mapping. If not specified the system will use the encryption key of the domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-encryptionkey
     */
    public encryptionKey: string | undefined;

    /**
     * The number of days until the data of this type expires.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-expirationdays
     */
    public expirationDays: number | undefined;

    /**
     * A list of field definitions for the object type mapping.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-fields
     */
    public fields: Array<CfnObjectType.FieldMapProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A list of keys that can be used to map data to the profile or search for the profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-keys
     */
    public keys: Array<CfnObjectType.KeyMapProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The name of the profile object type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-objecttypename
     */
    public objectTypeName: string | undefined;

    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * A unique identifier for the template mapping. This can be used instead of specifying the Keys and Fields properties directly.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-customerprofiles-objecttype.html#cfn-customerprofiles-objecttype-templateid
     */
    public templateId: string | undefined;

    /**
     * Create a new `AWS::CustomerProfiles::ObjectType`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnObjectTypeProps) {
        super(scope, id, { type: CfnObjectType.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'domainName', this);
        this.attrCreatedAt = cdk.Token.asString(this.getAtt('CreatedAt', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdatedAt = cdk.Token.asString(this.getAtt('LastUpdatedAt', cdk.ResolutionTypeHint.STRING));

        this.domainName = props.domainName;
        this.allowProfileCreation = props.allowProfileCreation;
        this.description = props.description;
        this.encryptionKey = props.encryptionKey;
        this.expirationDays = props.expirationDays;
        this.fields = props.fields;
        this.keys = props.keys;
        this.objectTypeName = props.objectTypeName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CustomerProfiles::ObjectType", props.tags, { tagPropertyName: 'tags' });
        this.templateId = props.templateId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnObjectType.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            domainName: this.domainName,
            allowProfileCreation: this.allowProfileCreation,
            description: this.description,
            encryptionKey: this.encryptionKey,
            expirationDays: this.expirationDays,
            fields: this.fields,
            keys: this.keys,
            objectTypeName: this.objectTypeName,
            tags: this.tags.renderTags(),
            templateId: this.templateId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnObjectTypePropsToCloudFormation(props);
    }
}

export namespace CfnObjectType {
    /**
     * A map of the name and ObjectType field.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-fieldmap.html
     */
    export interface FieldMapProperty {
        /**
         * Name of the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-fieldmap.html#cfn-customerprofiles-objecttype-fieldmap-name
         */
        readonly name?: string;
        /**
         * Represents a field in a ProfileObjectType.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-fieldmap.html#cfn-customerprofiles-objecttype-fieldmap-objecttypefield
         */
        readonly objectTypeField?: CfnObjectType.ObjectTypeFieldProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FieldMapProperty`
 *
 * @param properties - the TypeScript properties of a `FieldMapProperty`
 *
 * @returns the result of the validation.
 */
function CfnObjectType_FieldMapPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('objectTypeField', CfnObjectType_ObjectTypeFieldPropertyValidator)(properties.objectTypeField));
    return errors.wrap('supplied properties not correct for "FieldMapProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::ObjectType.FieldMap` resource
 *
 * @param properties - the TypeScript properties of a `FieldMapProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::ObjectType.FieldMap` resource.
 */
// @ts-ignore TS6133
function cfnObjectTypeFieldMapPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnObjectType_FieldMapPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        ObjectTypeField: cfnObjectTypeObjectTypeFieldPropertyToCloudFormation(properties.objectTypeField),
    };
}

// @ts-ignore TS6133
function CfnObjectTypeFieldMapPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnObjectType.FieldMapProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnObjectType.FieldMapProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('objectTypeField', 'ObjectTypeField', properties.ObjectTypeField != null ? CfnObjectTypeObjectTypeFieldPropertyFromCloudFormation(properties.ObjectTypeField) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnObjectType {
    /**
     * A unique key map that can be used to map data to the profile.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-keymap.html
     */
    export interface KeyMapProperty {
        /**
         * Name of the key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-keymap.html#cfn-customerprofiles-objecttype-keymap-name
         */
        readonly name?: string;
        /**
         * A list of ObjectTypeKey.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-keymap.html#cfn-customerprofiles-objecttype-keymap-objecttypekeylist
         */
        readonly objectTypeKeyList?: Array<CfnObjectType.ObjectTypeKeyProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `KeyMapProperty`
 *
 * @param properties - the TypeScript properties of a `KeyMapProperty`
 *
 * @returns the result of the validation.
 */
function CfnObjectType_KeyMapPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('objectTypeKeyList', cdk.listValidator(CfnObjectType_ObjectTypeKeyPropertyValidator))(properties.objectTypeKeyList));
    return errors.wrap('supplied properties not correct for "KeyMapProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::ObjectType.KeyMap` resource
 *
 * @param properties - the TypeScript properties of a `KeyMapProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::ObjectType.KeyMap` resource.
 */
// @ts-ignore TS6133
function cfnObjectTypeKeyMapPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnObjectType_KeyMapPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        ObjectTypeKeyList: cdk.listMapper(cfnObjectTypeObjectTypeKeyPropertyToCloudFormation)(properties.objectTypeKeyList),
    };
}

// @ts-ignore TS6133
function CfnObjectTypeKeyMapPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnObjectType.KeyMapProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnObjectType.KeyMapProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('objectTypeKeyList', 'ObjectTypeKeyList', properties.ObjectTypeKeyList != null ? cfn_parse.FromCloudFormation.getArray(CfnObjectTypeObjectTypeKeyPropertyFromCloudFormation)(properties.ObjectTypeKeyList) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnObjectType {
    /**
     * Represents a field in a ProfileObjectType.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-objecttypefield.html
     */
    export interface ObjectTypeFieldProperty {
        /**
         * The content type of the field. Used for determining equality when searching.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-objecttypefield.html#cfn-customerprofiles-objecttype-objecttypefield-contenttype
         */
        readonly contentType?: string;
        /**
         * A field of a ProfileObject. For example: _source.FirstName, where “_source” is a ProfileObjectType of a Zendesk user and “FirstName” is a field in that ObjectType.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-objecttypefield.html#cfn-customerprofiles-objecttype-objecttypefield-source
         */
        readonly source?: string;
        /**
         * The location of the data in the standard ProfileObject model. For example: _profile.Address.PostalCode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-objecttypefield.html#cfn-customerprofiles-objecttype-objecttypefield-target
         */
        readonly target?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ObjectTypeFieldProperty`
 *
 * @param properties - the TypeScript properties of a `ObjectTypeFieldProperty`
 *
 * @returns the result of the validation.
 */
function CfnObjectType_ObjectTypeFieldPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('contentType', cdk.validateString)(properties.contentType));
    errors.collect(cdk.propertyValidator('source', cdk.validateString)(properties.source));
    errors.collect(cdk.propertyValidator('target', cdk.validateString)(properties.target));
    return errors.wrap('supplied properties not correct for "ObjectTypeFieldProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::ObjectType.ObjectTypeField` resource
 *
 * @param properties - the TypeScript properties of a `ObjectTypeFieldProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::ObjectType.ObjectTypeField` resource.
 */
// @ts-ignore TS6133
function cfnObjectTypeObjectTypeFieldPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnObjectType_ObjectTypeFieldPropertyValidator(properties).assertSuccess();
    return {
        ContentType: cdk.stringToCloudFormation(properties.contentType),
        Source: cdk.stringToCloudFormation(properties.source),
        Target: cdk.stringToCloudFormation(properties.target),
    };
}

// @ts-ignore TS6133
function CfnObjectTypeObjectTypeFieldPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnObjectType.ObjectTypeFieldProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnObjectType.ObjectTypeFieldProperty>();
    ret.addPropertyResult('contentType', 'ContentType', properties.ContentType != null ? cfn_parse.FromCloudFormation.getString(properties.ContentType) : undefined);
    ret.addPropertyResult('source', 'Source', properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined);
    ret.addPropertyResult('target', 'Target', properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnObjectType {
    /**
     * An object that defines the Key element of a ProfileObject. A Key is a special element that can be used to search for a customer profile.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-objecttypekey.html
     */
    export interface ObjectTypeKeyProperty {
        /**
         * The reference for the key name of the fields map.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-objecttypekey.html#cfn-customerprofiles-objecttype-objecttypekey-fieldnames
         */
        readonly fieldNames?: string[];
        /**
         * The types of keys that a ProfileObject can have. Each ProfileObject can have only 1 UNIQUE key but multiple PROFILE keys. PROFILE means that this key can be used to tie an object to a PROFILE. UNIQUE means that it can be used to uniquely identify an object. If a key a is marked as SECONDARY, it will be used to search for profiles after all other PROFILE keys have been searched. A LOOKUP_ONLY key is only used to match a profile but is not persisted to be used for searching of the profile. A NEW_ONLY key is only used if the profile does not already exist before the object is ingested, otherwise it is only used for matching objects to profiles.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-customerprofiles-objecttype-objecttypekey.html#cfn-customerprofiles-objecttype-objecttypekey-standardidentifiers
         */
        readonly standardIdentifiers?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ObjectTypeKeyProperty`
 *
 * @param properties - the TypeScript properties of a `ObjectTypeKeyProperty`
 *
 * @returns the result of the validation.
 */
function CfnObjectType_ObjectTypeKeyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fieldNames', cdk.listValidator(cdk.validateString))(properties.fieldNames));
    errors.collect(cdk.propertyValidator('standardIdentifiers', cdk.listValidator(cdk.validateString))(properties.standardIdentifiers));
    return errors.wrap('supplied properties not correct for "ObjectTypeKeyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CustomerProfiles::ObjectType.ObjectTypeKey` resource
 *
 * @param properties - the TypeScript properties of a `ObjectTypeKeyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CustomerProfiles::ObjectType.ObjectTypeKey` resource.
 */
// @ts-ignore TS6133
function cfnObjectTypeObjectTypeKeyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnObjectType_ObjectTypeKeyPropertyValidator(properties).assertSuccess();
    return {
        FieldNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.fieldNames),
        StandardIdentifiers: cdk.listMapper(cdk.stringToCloudFormation)(properties.standardIdentifiers),
    };
}

// @ts-ignore TS6133
function CfnObjectTypeObjectTypeKeyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnObjectType.ObjectTypeKeyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnObjectType.ObjectTypeKeyProperty>();
    ret.addPropertyResult('fieldNames', 'FieldNames', properties.FieldNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.FieldNames) : undefined);
    ret.addPropertyResult('standardIdentifiers', 'StandardIdentifiers', properties.StandardIdentifiers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.StandardIdentifiers) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
