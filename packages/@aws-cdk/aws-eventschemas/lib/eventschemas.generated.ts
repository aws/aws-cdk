// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:06.283Z","fingerprint":"AVzGujT+mGx5kLMMIL5kyrONN6MAdD9lkAjy0McWj6o="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnDiscoverer`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html
 */
export interface CfnDiscovererProps {

    /**
     * The ARN of the event bus.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html#cfn-eventschemas-discoverer-sourcearn
     */
    readonly sourceArn: string;

    /**
     * Allows for the discovery of the event schemas that are sent to the event bus from another account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html#cfn-eventschemas-discoverer-crossaccount
     */
    readonly crossAccount?: boolean | cdk.IResolvable;

    /**
     * A description for the discoverer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html#cfn-eventschemas-discoverer-description
     */
    readonly description?: string;

    /**
     * Tags associated with the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html#cfn-eventschemas-discoverer-tags
     */
    readonly tags?: CfnDiscoverer.TagsEntryProperty[];
}

/**
 * Determine whether the given properties match those of a `CfnDiscovererProps`
 *
 * @param properties - the TypeScript properties of a `CfnDiscovererProps`
 *
 * @returns the result of the validation.
 */
function CfnDiscovererPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('crossAccount', cdk.validateBoolean)(properties.crossAccount));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('sourceArn', cdk.requiredValidator)(properties.sourceArn));
    errors.collect(cdk.propertyValidator('sourceArn', cdk.validateString)(properties.sourceArn));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnDiscoverer_TagsEntryPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDiscovererProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EventSchemas::Discoverer` resource
 *
 * @param properties - the TypeScript properties of a `CfnDiscovererProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EventSchemas::Discoverer` resource.
 */
// @ts-ignore TS6133
function cfnDiscovererPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDiscovererPropsValidator(properties).assertSuccess();
    return {
        SourceArn: cdk.stringToCloudFormation(properties.sourceArn),
        CrossAccount: cdk.booleanToCloudFormation(properties.crossAccount),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cfnDiscovererTagsEntryPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDiscovererPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDiscovererProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDiscovererProps>();
    ret.addPropertyResult('sourceArn', 'SourceArn', cfn_parse.FromCloudFormation.getString(properties.SourceArn));
    ret.addPropertyResult('crossAccount', 'CrossAccount', properties.CrossAccount != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CrossAccount) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnDiscovererTagsEntryPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EventSchemas::Discoverer`
 *
 * Use the `AWS::EventSchemas::Discoverer` resource to specify a *discoverer* that is associated with an event bus. A discoverer allows the Amazon EventBridge Schema Registry to automatically generate schemas based on events on an event bus.
 *
 * @cloudformationResource AWS::EventSchemas::Discoverer
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html
 */
export class CfnDiscoverer extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EventSchemas::Discoverer";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDiscoverer {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDiscovererPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDiscoverer(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Defines whether event schemas from other accounts are discovered. Default is True.
     * @cloudformationAttribute CrossAccount
     */
    public readonly attrCrossAccount: cdk.IResolvable;

    /**
     * The ARN of the discoverer.
     * @cloudformationAttribute DiscovererArn
     */
    public readonly attrDiscovererArn: string;

    /**
     * The ID of the discoverer.
     * @cloudformationAttribute DiscovererId
     */
    public readonly attrDiscovererId: string;

    /**
     * The ARN of the event bus.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html#cfn-eventschemas-discoverer-sourcearn
     */
    public sourceArn: string;

    /**
     * Allows for the discovery of the event schemas that are sent to the event bus from another account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html#cfn-eventschemas-discoverer-crossaccount
     */
    public crossAccount: boolean | cdk.IResolvable | undefined;

    /**
     * A description for the discoverer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html#cfn-eventschemas-discoverer-description
     */
    public description: string | undefined;

    /**
     * Tags associated with the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html#cfn-eventschemas-discoverer-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::EventSchemas::Discoverer`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDiscovererProps) {
        super(scope, id, { type: CfnDiscoverer.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'sourceArn', this);
        this.attrCrossAccount = this.getAtt('CrossAccount', cdk.ResolutionTypeHint.STRING);
        this.attrDiscovererArn = cdk.Token.asString(this.getAtt('DiscovererArn', cdk.ResolutionTypeHint.STRING));
        this.attrDiscovererId = cdk.Token.asString(this.getAtt('DiscovererId', cdk.ResolutionTypeHint.STRING));

        this.sourceArn = props.sourceArn;
        this.crossAccount = props.crossAccount;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EventSchemas::Discoverer", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDiscoverer.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            sourceArn: this.sourceArn,
            crossAccount: this.crossAccount,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDiscovererPropsToCloudFormation(props);
    }
}

export namespace CfnDiscoverer {
    /**
     * Tags to associate with the discoverer.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-discoverer-tagsentry.html
     */
    export interface TagsEntryProperty {
        /**
         * They key of a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-discoverer-tagsentry.html#cfn-eventschemas-discoverer-tagsentry-key
         */
        readonly key: string;
        /**
         * They value of a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-discoverer-tagsentry.html#cfn-eventschemas-discoverer-tagsentry-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `TagsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the result of the validation.
 */
function CfnDiscoverer_TagsEntryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsEntryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EventSchemas::Discoverer.TagsEntry` resource
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EventSchemas::Discoverer.TagsEntry` resource.
 */
// @ts-ignore TS6133
function cfnDiscovererTagsEntryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDiscoverer_TagsEntryPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnDiscovererTagsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDiscoverer.TagsEntryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDiscoverer.TagsEntryProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnRegistry`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registry.html
 */
export interface CfnRegistryProps {

    /**
     * A description of the registry to be created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registry.html#cfn-eventschemas-registry-description
     */
    readonly description?: string;

    /**
     * The name of the schema registry.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registry.html#cfn-eventschemas-registry-registryname
     */
    readonly registryName?: string;

    /**
     * Tags to associate with the registry.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registry.html#cfn-eventschemas-registry-tags
     */
    readonly tags?: CfnRegistry.TagsEntryProperty[];
}

/**
 * Determine whether the given properties match those of a `CfnRegistryProps`
 *
 * @param properties - the TypeScript properties of a `CfnRegistryProps`
 *
 * @returns the result of the validation.
 */
function CfnRegistryPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('registryName', cdk.validateString)(properties.registryName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnRegistry_TagsEntryPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnRegistryProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EventSchemas::Registry` resource
 *
 * @param properties - the TypeScript properties of a `CfnRegistryProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EventSchemas::Registry` resource.
 */
// @ts-ignore TS6133
function cfnRegistryPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRegistryPropsValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        RegistryName: cdk.stringToCloudFormation(properties.registryName),
        Tags: cdk.listMapper(cfnRegistryTagsEntryPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnRegistryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRegistryProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRegistryProps>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('registryName', 'RegistryName', properties.RegistryName != null ? cfn_parse.FromCloudFormation.getString(properties.RegistryName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnRegistryTagsEntryPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EventSchemas::Registry`
 *
 * Use the `AWS::EventSchemas::Registry` to specify a schema registry. Schema registries are containers for Schemas. Registries collect and organize schemas so that your schemas are in logical groups.
 *
 * @cloudformationResource AWS::EventSchemas::Registry
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registry.html
 */
export class CfnRegistry extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EventSchemas::Registry";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRegistry {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRegistryPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRegistry(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the registry.
     * @cloudformationAttribute RegistryArn
     */
    public readonly attrRegistryArn: string;

    /**
     * The name of the registry.
     * @cloudformationAttribute RegistryName
     */
    public readonly attrRegistryName: string;

    /**
     * A description of the registry to be created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registry.html#cfn-eventschemas-registry-description
     */
    public description: string | undefined;

    /**
     * The name of the schema registry.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registry.html#cfn-eventschemas-registry-registryname
     */
    public registryName: string | undefined;

    /**
     * Tags to associate with the registry.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registry.html#cfn-eventschemas-registry-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::EventSchemas::Registry`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRegistryProps = {}) {
        super(scope, id, { type: CfnRegistry.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrRegistryArn = cdk.Token.asString(this.getAtt('RegistryArn', cdk.ResolutionTypeHint.STRING));
        this.attrRegistryName = cdk.Token.asString(this.getAtt('RegistryName', cdk.ResolutionTypeHint.STRING));

        this.description = props.description;
        this.registryName = props.registryName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EventSchemas::Registry", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRegistry.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            description: this.description,
            registryName: this.registryName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRegistryPropsToCloudFormation(props);
    }
}

export namespace CfnRegistry {
    /**
     * Tags to associate with the schema registry.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-registry-tagsentry.html
     */
    export interface TagsEntryProperty {
        /**
         * They key of a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-registry-tagsentry.html#cfn-eventschemas-registry-tagsentry-key
         */
        readonly key: string;
        /**
         * They value of a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-registry-tagsentry.html#cfn-eventschemas-registry-tagsentry-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `TagsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the result of the validation.
 */
function CfnRegistry_TagsEntryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsEntryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EventSchemas::Registry.TagsEntry` resource
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EventSchemas::Registry.TagsEntry` resource.
 */
// @ts-ignore TS6133
function cfnRegistryTagsEntryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRegistry_TagsEntryPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnRegistryTagsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRegistry.TagsEntryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRegistry.TagsEntryProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnRegistryPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registrypolicy.html
 */
export interface CfnRegistryPolicyProps {

    /**
     * A resource-based policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registrypolicy.html#cfn-eventschemas-registrypolicy-policy
     */
    readonly policy: any | cdk.IResolvable;

    /**
     * The name of the registry.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registrypolicy.html#cfn-eventschemas-registrypolicy-registryname
     */
    readonly registryName: string;

    /**
     * The revision ID of the policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registrypolicy.html#cfn-eventschemas-registrypolicy-revisionid
     */
    readonly revisionId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnRegistryPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnRegistryPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnRegistryPolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('policy', cdk.requiredValidator)(properties.policy));
    errors.collect(cdk.propertyValidator('policy', cdk.validateObject)(properties.policy));
    errors.collect(cdk.propertyValidator('registryName', cdk.requiredValidator)(properties.registryName));
    errors.collect(cdk.propertyValidator('registryName', cdk.validateString)(properties.registryName));
    errors.collect(cdk.propertyValidator('revisionId', cdk.validateString)(properties.revisionId));
    return errors.wrap('supplied properties not correct for "CfnRegistryPolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EventSchemas::RegistryPolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnRegistryPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EventSchemas::RegistryPolicy` resource.
 */
// @ts-ignore TS6133
function cfnRegistryPolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRegistryPolicyPropsValidator(properties).assertSuccess();
    return {
        Policy: cdk.objectToCloudFormation(properties.policy),
        RegistryName: cdk.stringToCloudFormation(properties.registryName),
        RevisionId: cdk.stringToCloudFormation(properties.revisionId),
    };
}

// @ts-ignore TS6133
function CfnRegistryPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRegistryPolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRegistryPolicyProps>();
    ret.addPropertyResult('policy', 'Policy', cfn_parse.FromCloudFormation.getAny(properties.Policy));
    ret.addPropertyResult('registryName', 'RegistryName', cfn_parse.FromCloudFormation.getString(properties.RegistryName));
    ret.addPropertyResult('revisionId', 'RevisionId', properties.RevisionId != null ? cfn_parse.FromCloudFormation.getString(properties.RevisionId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EventSchemas::RegistryPolicy`
 *
 * Use the `AWS::EventSchemas::RegistryPolicy` resource to specify resource-based policies for an EventBridge Schema Registry.
 *
 * @cloudformationResource AWS::EventSchemas::RegistryPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registrypolicy.html
 */
export class CfnRegistryPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EventSchemas::RegistryPolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRegistryPolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRegistryPolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRegistryPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID of the policy.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * A resource-based policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registrypolicy.html#cfn-eventschemas-registrypolicy-policy
     */
    public policy: any | cdk.IResolvable;

    /**
     * The name of the registry.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registrypolicy.html#cfn-eventschemas-registrypolicy-registryname
     */
    public registryName: string;

    /**
     * The revision ID of the policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registrypolicy.html#cfn-eventschemas-registrypolicy-revisionid
     */
    public revisionId: string | undefined;

    /**
     * Create a new `AWS::EventSchemas::RegistryPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRegistryPolicyProps) {
        super(scope, id, { type: CfnRegistryPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'policy', this);
        cdk.requireProperty(props, 'registryName', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.policy = props.policy;
        this.registryName = props.registryName;
        this.revisionId = props.revisionId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRegistryPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            policy: this.policy,
            registryName: this.registryName,
            revisionId: this.revisionId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRegistryPolicyPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnSchema`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html
 */
export interface CfnSchemaProps {

    /**
     * The source of the schema definition.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-content
     */
    readonly content: string;

    /**
     * The name of the schema registry.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-registryname
     */
    readonly registryName: string;

    /**
     * The type of schema.
     *
     * Valid types include `OpenApi3` and `JSONSchemaDraft4` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-type
     */
    readonly type: string;

    /**
     * A description of the schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-description
     */
    readonly description?: string;

    /**
     * The name of the schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-schemaname
     */
    readonly schemaName?: string;

    /**
     * Tags associated with the schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-tags
     */
    readonly tags?: CfnSchema.TagsEntryProperty[];
}

/**
 * Determine whether the given properties match those of a `CfnSchemaProps`
 *
 * @param properties - the TypeScript properties of a `CfnSchemaProps`
 *
 * @returns the result of the validation.
 */
function CfnSchemaPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('content', cdk.requiredValidator)(properties.content));
    errors.collect(cdk.propertyValidator('content', cdk.validateString)(properties.content));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('registryName', cdk.requiredValidator)(properties.registryName));
    errors.collect(cdk.propertyValidator('registryName', cdk.validateString)(properties.registryName));
    errors.collect(cdk.propertyValidator('schemaName', cdk.validateString)(properties.schemaName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnSchema_TagsEntryPropertyValidator))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnSchemaProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EventSchemas::Schema` resource
 *
 * @param properties - the TypeScript properties of a `CfnSchemaProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EventSchemas::Schema` resource.
 */
// @ts-ignore TS6133
function cfnSchemaPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchemaPropsValidator(properties).assertSuccess();
    return {
        Content: cdk.stringToCloudFormation(properties.content),
        RegistryName: cdk.stringToCloudFormation(properties.registryName),
        Type: cdk.stringToCloudFormation(properties.type),
        Description: cdk.stringToCloudFormation(properties.description),
        SchemaName: cdk.stringToCloudFormation(properties.schemaName),
        Tags: cdk.listMapper(cfnSchemaTagsEntryPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnSchemaPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchemaProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchemaProps>();
    ret.addPropertyResult('content', 'Content', cfn_parse.FromCloudFormation.getString(properties.Content));
    ret.addPropertyResult('registryName', 'RegistryName', cfn_parse.FromCloudFormation.getString(properties.RegistryName));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('schemaName', 'SchemaName', properties.SchemaName != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnSchemaTagsEntryPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EventSchemas::Schema`
 *
 * Use the `AWS::EventSchemas::Schema` resource to specify an event schema.
 *
 * @cloudformationResource AWS::EventSchemas::Schema
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html
 */
export class CfnSchema extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EventSchemas::Schema";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSchema {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSchemaPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSchema(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the schema.
     * @cloudformationAttribute SchemaArn
     */
    public readonly attrSchemaArn: string;

    /**
     * The name of the schema.
     * @cloudformationAttribute SchemaName
     */
    public readonly attrSchemaName: string;

    /**
     * The version number of the schema.
     * @cloudformationAttribute SchemaVersion
     */
    public readonly attrSchemaVersion: string;

    /**
     * The source of the schema definition.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-content
     */
    public content: string;

    /**
     * The name of the schema registry.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-registryname
     */
    public registryName: string;

    /**
     * The type of schema.
     *
     * Valid types include `OpenApi3` and `JSONSchemaDraft4` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-type
     */
    public type: string;

    /**
     * A description of the schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-description
     */
    public description: string | undefined;

    /**
     * The name of the schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-schemaname
     */
    public schemaName: string | undefined;

    /**
     * Tags associated with the schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::EventSchemas::Schema`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSchemaProps) {
        super(scope, id, { type: CfnSchema.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'content', this);
        cdk.requireProperty(props, 'registryName', this);
        cdk.requireProperty(props, 'type', this);
        this.attrSchemaArn = cdk.Token.asString(this.getAtt('SchemaArn', cdk.ResolutionTypeHint.STRING));
        this.attrSchemaName = cdk.Token.asString(this.getAtt('SchemaName', cdk.ResolutionTypeHint.STRING));
        this.attrSchemaVersion = cdk.Token.asString(this.getAtt('SchemaVersion', cdk.ResolutionTypeHint.STRING));

        this.content = props.content;
        this.registryName = props.registryName;
        this.type = props.type;
        this.description = props.description;
        this.schemaName = props.schemaName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EventSchemas::Schema", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSchema.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            content: this.content,
            registryName: this.registryName,
            type: this.type,
            description: this.description,
            schemaName: this.schemaName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSchemaPropsToCloudFormation(props);
    }
}

export namespace CfnSchema {
    /**
     * Tags to associate with the schema.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-schema-tagsentry.html
     */
    export interface TagsEntryProperty {
        /**
         * They key of a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-schema-tagsentry.html#cfn-eventschemas-schema-tagsentry-key
         */
        readonly key: string;
        /**
         * They value of a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-schema-tagsentry.html#cfn-eventschemas-schema-tagsentry-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `TagsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchema_TagsEntryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsEntryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EventSchemas::Schema.TagsEntry` resource
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EventSchemas::Schema.TagsEntry` resource.
 */
// @ts-ignore TS6133
function cfnSchemaTagsEntryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchema_TagsEntryPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnSchemaTagsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchema.TagsEntryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchema.TagsEntryProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
