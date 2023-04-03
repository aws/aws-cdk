// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-09T03:52:32.642Z","fingerprint":"5aN+k2uBTSqEqKqCANfRmeLoF+bktxhJCkPtz0Pbw1E="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnCustomActionType`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html
 */
export interface CfnCustomActionTypeProps {

    /**
     * The category of the custom action, such as a build action or a test action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-category
     */
    readonly category: string;

    /**
     * The details of the input artifact for the action, such as its commit ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-inputartifactdetails
     */
    readonly inputArtifactDetails: CfnCustomActionType.ArtifactDetailsProperty | cdk.IResolvable;

    /**
     * The details of the output artifact of the action, such as its commit ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-outputartifactdetails
     */
    readonly outputArtifactDetails: CfnCustomActionType.ArtifactDetailsProperty | cdk.IResolvable;

    /**
     * The provider of the service used in the custom action, such as CodeDeploy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-provider
     */
    readonly provider: string;

    /**
     * The version identifier of the custom action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-version
     */
    readonly version: string;

    /**
     * The configuration properties for the custom action.
     *
     * > You can refer to a name in the configuration properties of the custom action within the URL templates by following the format of {Config:name}, as long as the configuration property is both required and not secret. For more information, see [Create a Custom Action for a Pipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-create-custom-action.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-configurationproperties
     */
    readonly configurationProperties?: Array<CfnCustomActionType.ConfigurationPropertiesProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * URLs that provide users information about this custom action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-settings
     */
    readonly settings?: CfnCustomActionType.SettingsProperty | cdk.IResolvable;

    /**
     * The tags for the custom action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnCustomActionTypeProps`
 *
 * @param properties - the TypeScript properties of a `CfnCustomActionTypeProps`
 *
 * @returns the result of the validation.
 */
function CfnCustomActionTypePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('category', cdk.requiredValidator)(properties.category));
    errors.collect(cdk.propertyValidator('category', cdk.validateString)(properties.category));
    errors.collect(cdk.propertyValidator('configurationProperties', cdk.listValidator(CfnCustomActionType_ConfigurationPropertiesPropertyValidator))(properties.configurationProperties));
    errors.collect(cdk.propertyValidator('inputArtifactDetails', cdk.requiredValidator)(properties.inputArtifactDetails));
    errors.collect(cdk.propertyValidator('inputArtifactDetails', CfnCustomActionType_ArtifactDetailsPropertyValidator)(properties.inputArtifactDetails));
    errors.collect(cdk.propertyValidator('outputArtifactDetails', cdk.requiredValidator)(properties.outputArtifactDetails));
    errors.collect(cdk.propertyValidator('outputArtifactDetails', CfnCustomActionType_ArtifactDetailsPropertyValidator)(properties.outputArtifactDetails));
    errors.collect(cdk.propertyValidator('provider', cdk.requiredValidator)(properties.provider));
    errors.collect(cdk.propertyValidator('provider', cdk.validateString)(properties.provider));
    errors.collect(cdk.propertyValidator('settings', CfnCustomActionType_SettingsPropertyValidator)(properties.settings));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('version', cdk.requiredValidator)(properties.version));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "CfnCustomActionTypeProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::CustomActionType` resource
 *
 * @param properties - the TypeScript properties of a `CfnCustomActionTypeProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::CustomActionType` resource.
 */
// @ts-ignore TS6133
function cfnCustomActionTypePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCustomActionTypePropsValidator(properties).assertSuccess();
    return {
        Category: cdk.stringToCloudFormation(properties.category),
        InputArtifactDetails: cfnCustomActionTypeArtifactDetailsPropertyToCloudFormation(properties.inputArtifactDetails),
        OutputArtifactDetails: cfnCustomActionTypeArtifactDetailsPropertyToCloudFormation(properties.outputArtifactDetails),
        Provider: cdk.stringToCloudFormation(properties.provider),
        Version: cdk.stringToCloudFormation(properties.version),
        ConfigurationProperties: cdk.listMapper(cfnCustomActionTypeConfigurationPropertiesPropertyToCloudFormation)(properties.configurationProperties),
        Settings: cfnCustomActionTypeSettingsPropertyToCloudFormation(properties.settings),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnCustomActionTypePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomActionTypeProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomActionTypeProps>();
    ret.addPropertyResult('category', 'Category', cfn_parse.FromCloudFormation.getString(properties.Category));
    ret.addPropertyResult('inputArtifactDetails', 'InputArtifactDetails', CfnCustomActionTypeArtifactDetailsPropertyFromCloudFormation(properties.InputArtifactDetails));
    ret.addPropertyResult('outputArtifactDetails', 'OutputArtifactDetails', CfnCustomActionTypeArtifactDetailsPropertyFromCloudFormation(properties.OutputArtifactDetails));
    ret.addPropertyResult('provider', 'Provider', cfn_parse.FromCloudFormation.getString(properties.Provider));
    ret.addPropertyResult('version', 'Version', cfn_parse.FromCloudFormation.getString(properties.Version));
    ret.addPropertyResult('configurationProperties', 'ConfigurationProperties', properties.ConfigurationProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnCustomActionTypeConfigurationPropertiesPropertyFromCloudFormation)(properties.ConfigurationProperties) : undefined);
    ret.addPropertyResult('settings', 'Settings', properties.Settings != null ? CfnCustomActionTypeSettingsPropertyFromCloudFormation(properties.Settings) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CodePipeline::CustomActionType`
 *
 * The `AWS::CodePipeline::CustomActionType` resource creates a custom action for activities that aren't included in the CodePipeline default actions, such as running an internally developed build process or a test suite. You can use these custom actions in the stage of a pipeline. For more information, see [Create and Add a Custom Action in AWS CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-create-custom-action.html) in the *AWS CodePipeline User Guide* .
 *
 * @cloudformationResource AWS::CodePipeline::CustomActionType
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html
 */
export class CfnCustomActionType extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CodePipeline::CustomActionType";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCustomActionType {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCustomActionTypePropsFromCloudFormation(resourceProperties);
        const ret = new CfnCustomActionType(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The category of the custom action, such as a build action or a test action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-category
     */
    public category: string;

    /**
     * The details of the input artifact for the action, such as its commit ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-inputartifactdetails
     */
    public inputArtifactDetails: CfnCustomActionType.ArtifactDetailsProperty | cdk.IResolvable;

    /**
     * The details of the output artifact of the action, such as its commit ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-outputartifactdetails
     */
    public outputArtifactDetails: CfnCustomActionType.ArtifactDetailsProperty | cdk.IResolvable;

    /**
     * The provider of the service used in the custom action, such as CodeDeploy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-provider
     */
    public provider: string;

    /**
     * The version identifier of the custom action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-version
     */
    public version: string;

    /**
     * The configuration properties for the custom action.
     *
     * > You can refer to a name in the configuration properties of the custom action within the URL templates by following the format of {Config:name}, as long as the configuration property is both required and not secret. For more information, see [Create a Custom Action for a Pipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-create-custom-action.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-configurationproperties
     */
    public configurationProperties: Array<CfnCustomActionType.ConfigurationPropertiesProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * URLs that provide users information about this custom action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-settings
     */
    public settings: CfnCustomActionType.SettingsProperty | cdk.IResolvable | undefined;

    /**
     * The tags for the custom action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::CodePipeline::CustomActionType`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCustomActionTypeProps) {
        super(scope, id, { type: CfnCustomActionType.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'category', this);
        cdk.requireProperty(props, 'inputArtifactDetails', this);
        cdk.requireProperty(props, 'outputArtifactDetails', this);
        cdk.requireProperty(props, 'provider', this);
        cdk.requireProperty(props, 'version', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.category = props.category;
        this.inputArtifactDetails = props.inputArtifactDetails;
        this.outputArtifactDetails = props.outputArtifactDetails;
        this.provider = props.provider;
        this.version = props.version;
        this.configurationProperties = props.configurationProperties;
        this.settings = props.settings;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodePipeline::CustomActionType", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCustomActionType.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            category: this.category,
            inputArtifactDetails: this.inputArtifactDetails,
            outputArtifactDetails: this.outputArtifactDetails,
            provider: this.provider,
            version: this.version,
            configurationProperties: this.configurationProperties,
            settings: this.settings,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCustomActionTypePropsToCloudFormation(props);
    }
}

export namespace CfnCustomActionType {
    /**
     * Returns information about the details of an artifact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-artifactdetails.html
     */
    export interface ArtifactDetailsProperty {
        /**
         * The maximum number of artifacts allowed for the action type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-artifactdetails.html#cfn-codepipeline-customactiontype-artifactdetails-maximumcount
         */
        readonly maximumCount: number;
        /**
         * The minimum number of artifacts allowed for the action type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-artifactdetails.html#cfn-codepipeline-customactiontype-artifactdetails-minimumcount
         */
        readonly minimumCount: number;
    }
}

/**
 * Determine whether the given properties match those of a `ArtifactDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `ArtifactDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnCustomActionType_ArtifactDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maximumCount', cdk.requiredValidator)(properties.maximumCount));
    errors.collect(cdk.propertyValidator('maximumCount', cdk.validateNumber)(properties.maximumCount));
    errors.collect(cdk.propertyValidator('minimumCount', cdk.requiredValidator)(properties.minimumCount));
    errors.collect(cdk.propertyValidator('minimumCount', cdk.validateNumber)(properties.minimumCount));
    return errors.wrap('supplied properties not correct for "ArtifactDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::CustomActionType.ArtifactDetails` resource
 *
 * @param properties - the TypeScript properties of a `ArtifactDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::CustomActionType.ArtifactDetails` resource.
 */
// @ts-ignore TS6133
function cfnCustomActionTypeArtifactDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCustomActionType_ArtifactDetailsPropertyValidator(properties).assertSuccess();
    return {
        MaximumCount: cdk.numberToCloudFormation(properties.maximumCount),
        MinimumCount: cdk.numberToCloudFormation(properties.minimumCount),
    };
}

// @ts-ignore TS6133
function CfnCustomActionTypeArtifactDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomActionType.ArtifactDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomActionType.ArtifactDetailsProperty>();
    ret.addPropertyResult('maximumCount', 'MaximumCount', cfn_parse.FromCloudFormation.getNumber(properties.MaximumCount));
    ret.addPropertyResult('minimumCount', 'MinimumCount', cfn_parse.FromCloudFormation.getNumber(properties.MinimumCount));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCustomActionType {
    /**
     * The configuration properties for the custom action.
     *
     * > You can refer to a name in the configuration properties of the custom action within the URL templates by following the format of {Config:name}, as long as the configuration property is both required and not secret. For more information, see [Create a Custom Action for a Pipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-create-custom-action.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html
     */
    export interface ConfigurationPropertiesProperty {
        /**
         * The description of the action configuration property that is displayed to users.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-description
         */
        readonly description?: string;
        /**
         * Whether the configuration property is a key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-key
         */
        readonly key: boolean | cdk.IResolvable;
        /**
         * The name of the action configuration property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-name
         */
        readonly name: string;
        /**
         * Indicates that the property is used with `PollForJobs` . When creating a custom action, an action can have up to one queryable property. If it has one, that property must be both required and not secret.
         *
         * If you create a pipeline with a custom action type, and that custom action contains a queryable property, the value for that configuration property is subject to other restrictions. The value must be less than or equal to twenty (20) characters. The value can contain only alphanumeric characters, underscores, and hyphens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-queryable
         */
        readonly queryable?: boolean | cdk.IResolvable;
        /**
         * Whether the configuration property is a required value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-required
         */
        readonly required: boolean | cdk.IResolvable;
        /**
         * Whether the configuration property is secret. Secrets are hidden from all calls except for `GetJobDetails` , `GetThirdPartyJobDetails` , `PollForJobs` , and `PollForThirdPartyJobs` .
         *
         * When updating a pipeline, passing * * * * * without changing any other values of the action preserves the previous value of the secret.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-secret
         */
        readonly secret: boolean | cdk.IResolvable;
        /**
         * The type of the configuration property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ConfigurationPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationPropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnCustomActionType_ConfigurationPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateBoolean)(properties.key));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('queryable', cdk.validateBoolean)(properties.queryable));
    errors.collect(cdk.propertyValidator('required', cdk.requiredValidator)(properties.required));
    errors.collect(cdk.propertyValidator('required', cdk.validateBoolean)(properties.required));
    errors.collect(cdk.propertyValidator('secret', cdk.requiredValidator)(properties.secret));
    errors.collect(cdk.propertyValidator('secret', cdk.validateBoolean)(properties.secret));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "ConfigurationPropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::CustomActionType.ConfigurationProperties` resource
 *
 * @param properties - the TypeScript properties of a `ConfigurationPropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::CustomActionType.ConfigurationProperties` resource.
 */
// @ts-ignore TS6133
function cfnCustomActionTypeConfigurationPropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCustomActionType_ConfigurationPropertiesPropertyValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        Key: cdk.booleanToCloudFormation(properties.key),
        Name: cdk.stringToCloudFormation(properties.name),
        Queryable: cdk.booleanToCloudFormation(properties.queryable),
        Required: cdk.booleanToCloudFormation(properties.required),
        Secret: cdk.booleanToCloudFormation(properties.secret),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnCustomActionTypeConfigurationPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomActionType.ConfigurationPropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomActionType.ConfigurationPropertiesProperty>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getBoolean(properties.Key));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('queryable', 'Queryable', properties.Queryable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Queryable) : undefined);
    ret.addPropertyResult('required', 'Required', cfn_parse.FromCloudFormation.getBoolean(properties.Required));
    ret.addPropertyResult('secret', 'Secret', cfn_parse.FromCloudFormation.getBoolean(properties.Secret));
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCustomActionType {
    /**
     * `Settings` is a property of the `AWS::CodePipeline::CustomActionType` resource that provides URLs that users can access to view information about the CodePipeline custom action.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html
     */
    export interface SettingsProperty {
        /**
         * The URL returned to the CodePipeline console that provides a deep link to the resources of the external system, such as the configuration page for a CodeDeploy deployment group. This link is provided as part of the action display in the pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-entityurltemplate
         */
        readonly entityUrlTemplate?: string;
        /**
         * The URL returned to the CodePipeline console that contains a link to the top-level landing page for the external system, such as the console page for CodeDeploy. This link is shown on the pipeline view page in the CodePipeline console and provides a link to the execution entity of the external action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-executionurltemplate
         */
        readonly executionUrlTemplate?: string;
        /**
         * The URL returned to the CodePipeline console that contains a link to the page where customers can update or change the configuration of the external action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-revisionurltemplate
         */
        readonly revisionUrlTemplate?: string;
        /**
         * The URL of a sign-up page where users can sign up for an external service and perform initial configuration of the action provided by that service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-thirdpartyconfigurationurl
         */
        readonly thirdPartyConfigurationUrl?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnCustomActionType_SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('entityUrlTemplate', cdk.validateString)(properties.entityUrlTemplate));
    errors.collect(cdk.propertyValidator('executionUrlTemplate', cdk.validateString)(properties.executionUrlTemplate));
    errors.collect(cdk.propertyValidator('revisionUrlTemplate', cdk.validateString)(properties.revisionUrlTemplate));
    errors.collect(cdk.propertyValidator('thirdPartyConfigurationUrl', cdk.validateString)(properties.thirdPartyConfigurationUrl));
    return errors.wrap('supplied properties not correct for "SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::CustomActionType.Settings` resource
 *
 * @param properties - the TypeScript properties of a `SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::CustomActionType.Settings` resource.
 */
// @ts-ignore TS6133
function cfnCustomActionTypeSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCustomActionType_SettingsPropertyValidator(properties).assertSuccess();
    return {
        EntityUrlTemplate: cdk.stringToCloudFormation(properties.entityUrlTemplate),
        ExecutionUrlTemplate: cdk.stringToCloudFormation(properties.executionUrlTemplate),
        RevisionUrlTemplate: cdk.stringToCloudFormation(properties.revisionUrlTemplate),
        ThirdPartyConfigurationUrl: cdk.stringToCloudFormation(properties.thirdPartyConfigurationUrl),
    };
}

// @ts-ignore TS6133
function CfnCustomActionTypeSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomActionType.SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomActionType.SettingsProperty>();
    ret.addPropertyResult('entityUrlTemplate', 'EntityUrlTemplate', properties.EntityUrlTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.EntityUrlTemplate) : undefined);
    ret.addPropertyResult('executionUrlTemplate', 'ExecutionUrlTemplate', properties.ExecutionUrlTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionUrlTemplate) : undefined);
    ret.addPropertyResult('revisionUrlTemplate', 'RevisionUrlTemplate', properties.RevisionUrlTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.RevisionUrlTemplate) : undefined);
    ret.addPropertyResult('thirdPartyConfigurationUrl', 'ThirdPartyConfigurationUrl', properties.ThirdPartyConfigurationUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ThirdPartyConfigurationUrl) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnPipeline`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html
 */
export interface CfnPipelineProps {

    /**
     * The Amazon Resource Name (ARN) for CodePipeline to use to either perform actions with no `actionRoleArn` , or to use to assume roles for actions with an `actionRoleArn` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-rolearn
     */
    readonly roleArn: string;

    /**
     * Represents information about a stage and its definition.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-stages
     */
    readonly stages: Array<CfnPipeline.StageDeclarationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The S3 bucket where artifacts for the pipeline are stored.
     *
     * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-artifactstore
     */
    readonly artifactStore?: CfnPipeline.ArtifactStoreProperty | cdk.IResolvable;

    /**
     * A mapping of `artifactStore` objects and their corresponding AWS Regions. There must be an artifact store for the pipeline Region and for each cross-region action in the pipeline.
     *
     * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-artifactstores
     */
    readonly artifactStores?: Array<CfnPipeline.ArtifactStoreMapProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Represents the input of a `DisableStageTransition` action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-disableinboundstagetransitions
     */
    readonly disableInboundStageTransitions?: Array<CfnPipeline.StageTransitionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-name
     */
    readonly name?: string;

    /**
     * Indicates whether to rerun the CodePipeline pipeline after you update it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-restartexecutiononupdate
     */
    readonly restartExecutionOnUpdate?: boolean | cdk.IResolvable;

    /**
     * Specifies the tags applied to the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnPipelineProps`
 *
 * @param properties - the TypeScript properties of a `CfnPipelineProps`
 *
 * @returns the result of the validation.
 */
function CfnPipelinePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('artifactStore', CfnPipeline_ArtifactStorePropertyValidator)(properties.artifactStore));
    errors.collect(cdk.propertyValidator('artifactStores', cdk.listValidator(CfnPipeline_ArtifactStoreMapPropertyValidator))(properties.artifactStores));
    errors.collect(cdk.propertyValidator('disableInboundStageTransitions', cdk.listValidator(CfnPipeline_StageTransitionPropertyValidator))(properties.disableInboundStageTransitions));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('restartExecutionOnUpdate', cdk.validateBoolean)(properties.restartExecutionOnUpdate));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('stages', cdk.requiredValidator)(properties.stages));
    errors.collect(cdk.propertyValidator('stages', cdk.listValidator(CfnPipeline_StageDeclarationPropertyValidator))(properties.stages));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnPipelineProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline` resource
 *
 * @param properties - the TypeScript properties of a `CfnPipelineProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline` resource.
 */
// @ts-ignore TS6133
function cfnPipelinePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipelinePropsValidator(properties).assertSuccess();
    return {
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        Stages: cdk.listMapper(cfnPipelineStageDeclarationPropertyToCloudFormation)(properties.stages),
        ArtifactStore: cfnPipelineArtifactStorePropertyToCloudFormation(properties.artifactStore),
        ArtifactStores: cdk.listMapper(cfnPipelineArtifactStoreMapPropertyToCloudFormation)(properties.artifactStores),
        DisableInboundStageTransitions: cdk.listMapper(cfnPipelineStageTransitionPropertyToCloudFormation)(properties.disableInboundStageTransitions),
        Name: cdk.stringToCloudFormation(properties.name),
        RestartExecutionOnUpdate: cdk.booleanToCloudFormation(properties.restartExecutionOnUpdate),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnPipelinePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipelineProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipelineProps>();
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('stages', 'Stages', cfn_parse.FromCloudFormation.getArray(CfnPipelineStageDeclarationPropertyFromCloudFormation)(properties.Stages));
    ret.addPropertyResult('artifactStore', 'ArtifactStore', properties.ArtifactStore != null ? CfnPipelineArtifactStorePropertyFromCloudFormation(properties.ArtifactStore) : undefined);
    ret.addPropertyResult('artifactStores', 'ArtifactStores', properties.ArtifactStores != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineArtifactStoreMapPropertyFromCloudFormation)(properties.ArtifactStores) : undefined);
    ret.addPropertyResult('disableInboundStageTransitions', 'DisableInboundStageTransitions', properties.DisableInboundStageTransitions != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineStageTransitionPropertyFromCloudFormation)(properties.DisableInboundStageTransitions) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('restartExecutionOnUpdate', 'RestartExecutionOnUpdate', properties.RestartExecutionOnUpdate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RestartExecutionOnUpdate) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CodePipeline::Pipeline`
 *
 * The `AWS::CodePipeline::Pipeline` resource creates a CodePipeline pipeline that describes how software changes go through a release process. For more information, see [What Is CodePipeline?](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html) in the *AWS CodePipeline User Guide* .
 *
 * @cloudformationResource AWS::CodePipeline::Pipeline
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html
 */
export class CfnPipeline extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CodePipeline::Pipeline";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPipeline {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPipelinePropsFromCloudFormation(resourceProperties);
        const ret = new CfnPipeline(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The version of the pipeline.
     *
     * > A new pipeline is always assigned a version number of 1. This number increments when a pipeline is updated.
     * @cloudformationAttribute Version
     */
    public readonly attrVersion: string;

    /**
     * The Amazon Resource Name (ARN) for CodePipeline to use to either perform actions with no `actionRoleArn` , or to use to assume roles for actions with an `actionRoleArn` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-rolearn
     */
    public roleArn: string;

    /**
     * Represents information about a stage and its definition.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-stages
     */
    public stages: Array<CfnPipeline.StageDeclarationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The S3 bucket where artifacts for the pipeline are stored.
     *
     * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-artifactstore
     */
    public artifactStore: CfnPipeline.ArtifactStoreProperty | cdk.IResolvable | undefined;

    /**
     * A mapping of `artifactStore` objects and their corresponding AWS Regions. There must be an artifact store for the pipeline Region and for each cross-region action in the pipeline.
     *
     * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-artifactstores
     */
    public artifactStores: Array<CfnPipeline.ArtifactStoreMapProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Represents the input of a `DisableStageTransition` action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-disableinboundstagetransitions
     */
    public disableInboundStageTransitions: Array<CfnPipeline.StageTransitionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The name of the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-name
     */
    public name: string | undefined;

    /**
     * Indicates whether to rerun the CodePipeline pipeline after you update it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-restartexecutiononupdate
     */
    public restartExecutionOnUpdate: boolean | cdk.IResolvable | undefined;

    /**
     * Specifies the tags applied to the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::CodePipeline::Pipeline`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPipelineProps) {
        super(scope, id, { type: CfnPipeline.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'roleArn', this);
        cdk.requireProperty(props, 'stages', this);
        this.attrVersion = cdk.Token.asString(this.getAtt('Version', cdk.ResolutionTypeHint.STRING));

        this.roleArn = props.roleArn;
        this.stages = props.stages;
        this.artifactStore = props.artifactStore;
        this.artifactStores = props.artifactStores;
        this.disableInboundStageTransitions = props.disableInboundStageTransitions;
        this.name = props.name;
        this.restartExecutionOnUpdate = props.restartExecutionOnUpdate;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodePipeline::Pipeline", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPipeline.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            roleArn: this.roleArn,
            stages: this.stages,
            artifactStore: this.artifactStore,
            artifactStores: this.artifactStores,
            disableInboundStageTransitions: this.disableInboundStageTransitions,
            name: this.name,
            restartExecutionOnUpdate: this.restartExecutionOnUpdate,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPipelinePropsToCloudFormation(props);
    }
}

export namespace CfnPipeline {
    /**
     * Represents information about an action declaration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html
     */
    export interface ActionDeclarationProperty {
        /**
         * Specifies the action type and the provider of the action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-actiontypeid
         */
        readonly actionTypeId: CfnPipeline.ActionTypeIdProperty | cdk.IResolvable;
        /**
         * The action's configuration. These are key-value pairs that specify input values for an action. For more information, see [Action Structure Requirements in CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements) . For the list of configuration properties for the AWS CloudFormation action type in CodePipeline, see [Configuration Properties Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-action-reference.html) in the *AWS CloudFormation User Guide* . For template snippets with examples, see [Using Parameter Override Functions with CodePipeline Pipelines](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-parameter-override-functions.html) in the *AWS CloudFormation User Guide* .
         *
         * The values can be represented in either JSON or YAML format. For example, the JSON configuration item format is as follows:
         *
         * *JSON:*
         *
         * `"Configuration" : { Key : Value },`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-configuration
         */
        readonly configuration?: any | cdk.IResolvable;
        /**
         * The name or ID of the artifact consumed by the action, such as a test or build artifact. While the field is not a required parameter, most actions have an action configuration that requires a specified quantity of input artifacts. To refer to the action configuration specification by action provider, see the [Action structure reference](https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference.html) in the *AWS CodePipeline User Guide* .
         *
         * > For a CodeBuild action with multiple input artifacts, one of your input sources must be designated the PrimarySource. For more information, see the [CodeBuild action reference page](https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-CodeBuild.html) in the *AWS CodePipeline User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-inputartifacts
         */
        readonly inputArtifacts?: Array<CfnPipeline.InputArtifactProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The action declaration's name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-name
         */
        readonly name: string;
        /**
         * The variable namespace associated with the action. All variables produced as output by this action fall under this namespace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-actiondeclaration-namespace
         */
        readonly namespace?: string;
        /**
         * The name or ID of the result of the action declaration, such as a test or build artifact. While the field is not a required parameter, most actions have an action configuration that requires a specified quantity of output artifacts. To refer to the action configuration specification by action provider, see the [Action structure reference](https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference.html) in the *AWS CodePipeline User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-outputartifacts
         */
        readonly outputArtifacts?: Array<CfnPipeline.OutputArtifactProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The action declaration's AWS Region, such as us-east-1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-region
         */
        readonly region?: string;
        /**
         * The ARN of the IAM service role that performs the declared action. This is assumed through the roleArn for the pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-rolearn
         */
        readonly roleArn?: string;
        /**
         * The order in which actions are run.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-runorder
         */
        readonly runOrder?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ActionDeclarationProperty`
 *
 * @param properties - the TypeScript properties of a `ActionDeclarationProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_ActionDeclarationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actionTypeId', cdk.requiredValidator)(properties.actionTypeId));
    errors.collect(cdk.propertyValidator('actionTypeId', CfnPipeline_ActionTypeIdPropertyValidator)(properties.actionTypeId));
    errors.collect(cdk.propertyValidator('configuration', cdk.validateObject)(properties.configuration));
    errors.collect(cdk.propertyValidator('inputArtifacts', cdk.listValidator(CfnPipeline_InputArtifactPropertyValidator))(properties.inputArtifacts));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    errors.collect(cdk.propertyValidator('outputArtifacts', cdk.listValidator(CfnPipeline_OutputArtifactPropertyValidator))(properties.outputArtifacts));
    errors.collect(cdk.propertyValidator('region', cdk.validateString)(properties.region));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('runOrder', cdk.validateNumber)(properties.runOrder));
    return errors.wrap('supplied properties not correct for "ActionDeclarationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.ActionDeclaration` resource
 *
 * @param properties - the TypeScript properties of a `ActionDeclarationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.ActionDeclaration` resource.
 */
// @ts-ignore TS6133
function cfnPipelineActionDeclarationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_ActionDeclarationPropertyValidator(properties).assertSuccess();
    return {
        ActionTypeId: cfnPipelineActionTypeIdPropertyToCloudFormation(properties.actionTypeId),
        Configuration: cdk.objectToCloudFormation(properties.configuration),
        InputArtifacts: cdk.listMapper(cfnPipelineInputArtifactPropertyToCloudFormation)(properties.inputArtifacts),
        Name: cdk.stringToCloudFormation(properties.name),
        Namespace: cdk.stringToCloudFormation(properties.namespace),
        OutputArtifacts: cdk.listMapper(cfnPipelineOutputArtifactPropertyToCloudFormation)(properties.outputArtifacts),
        Region: cdk.stringToCloudFormation(properties.region),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        RunOrder: cdk.numberToCloudFormation(properties.runOrder),
    };
}

// @ts-ignore TS6133
function CfnPipelineActionDeclarationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.ActionDeclarationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.ActionDeclarationProperty>();
    ret.addPropertyResult('actionTypeId', 'ActionTypeId', CfnPipelineActionTypeIdPropertyFromCloudFormation(properties.ActionTypeId));
    ret.addPropertyResult('configuration', 'Configuration', properties.Configuration != null ? cfn_parse.FromCloudFormation.getAny(properties.Configuration) : undefined);
    ret.addPropertyResult('inputArtifacts', 'InputArtifacts', properties.InputArtifacts != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineInputArtifactPropertyFromCloudFormation)(properties.InputArtifacts) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('namespace', 'Namespace', properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined);
    ret.addPropertyResult('outputArtifacts', 'OutputArtifacts', properties.OutputArtifacts != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineOutputArtifactPropertyFromCloudFormation)(properties.OutputArtifacts) : undefined);
    ret.addPropertyResult('region', 'Region', properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addPropertyResult('runOrder', 'RunOrder', properties.RunOrder != null ? cfn_parse.FromCloudFormation.getNumber(properties.RunOrder) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * Represents information about an action type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-actiontypeid.html
     */
    export interface ActionTypeIdProperty {
        /**
         * A category defines what kind of action can be taken in the stage, and constrains the provider type for the action. Valid categories are limited to one of the values below.
         *
         * - `Source`
         * - `Build`
         * - `Test`
         * - `Deploy`
         * - `Invoke`
         * - `Approval`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-actiontypeid.html#cfn-codepipeline-pipeline-stages-actions-actiontypeid-category
         */
        readonly category: string;
        /**
         * The creator of the action being called. There are three valid values for the `Owner` field in the action category section within your pipeline structure: `AWS` , `ThirdParty` , and `Custom` . For more information, see [Valid Action Types and Providers in CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#actions-valid-providers) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-actiontypeid.html#cfn-codepipeline-pipeline-stages-actions-actiontypeid-owner
         */
        readonly owner: string;
        /**
         * The provider of the service being called by the action. Valid providers are determined by the action category. For example, an action in the Deploy category type might have a provider of CodeDeploy, which would be specified as `CodeDeploy` . For more information, see [Valid Action Types and Providers in CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#actions-valid-providers) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-actiontypeid.html#cfn-codepipeline-pipeline-stages-actions-actiontypeid-provider
         */
        readonly provider: string;
        /**
         * A string that describes the action version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-actiontypeid.html#cfn-codepipeline-pipeline-stages-actions-actiontypeid-version
         */
        readonly version: string;
    }
}

/**
 * Determine whether the given properties match those of a `ActionTypeIdProperty`
 *
 * @param properties - the TypeScript properties of a `ActionTypeIdProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_ActionTypeIdPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('category', cdk.requiredValidator)(properties.category));
    errors.collect(cdk.propertyValidator('category', cdk.validateString)(properties.category));
    errors.collect(cdk.propertyValidator('owner', cdk.requiredValidator)(properties.owner));
    errors.collect(cdk.propertyValidator('owner', cdk.validateString)(properties.owner));
    errors.collect(cdk.propertyValidator('provider', cdk.requiredValidator)(properties.provider));
    errors.collect(cdk.propertyValidator('provider', cdk.validateString)(properties.provider));
    errors.collect(cdk.propertyValidator('version', cdk.requiredValidator)(properties.version));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "ActionTypeIdProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.ActionTypeId` resource
 *
 * @param properties - the TypeScript properties of a `ActionTypeIdProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.ActionTypeId` resource.
 */
// @ts-ignore TS6133
function cfnPipelineActionTypeIdPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_ActionTypeIdPropertyValidator(properties).assertSuccess();
    return {
        Category: cdk.stringToCloudFormation(properties.category),
        Owner: cdk.stringToCloudFormation(properties.owner),
        Provider: cdk.stringToCloudFormation(properties.provider),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnPipelineActionTypeIdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.ActionTypeIdProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.ActionTypeIdProperty>();
    ret.addPropertyResult('category', 'Category', cfn_parse.FromCloudFormation.getString(properties.Category));
    ret.addPropertyResult('owner', 'Owner', cfn_parse.FromCloudFormation.getString(properties.Owner));
    ret.addPropertyResult('provider', 'Provider', cfn_parse.FromCloudFormation.getString(properties.Provider));
    ret.addPropertyResult('version', 'Version', cfn_parse.FromCloudFormation.getString(properties.Version));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * The S3 bucket where artifacts for the pipeline are stored.
     *
     * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore.html
     */
    export interface ArtifactStoreProperty {
        /**
         * The encryption key used to encrypt the data in the artifact store, such as an AWS Key Management Service ( AWS KMS) key. If this is undefined, the default key for Amazon S3 is used. To see an example artifact store encryption key field, see the example structure here: [AWS::CodePipeline::Pipeline](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore.html#cfn-codepipeline-pipeline-artifactstore-encryptionkey
         */
        readonly encryptionKey?: CfnPipeline.EncryptionKeyProperty | cdk.IResolvable;
        /**
         * The S3 bucket used for storing the artifacts for a pipeline. You can specify the name of an S3 bucket but not a folder in the bucket. A folder to contain the pipeline artifacts is created for you based on the name of the pipeline. You can use any S3 bucket in the same AWS Region as the pipeline to store your pipeline artifacts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore.html#cfn-codepipeline-pipeline-artifactstore-location
         */
        readonly location: string;
        /**
         * The type of the artifact store, such as S3.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore.html#cfn-codepipeline-pipeline-artifactstore-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `ArtifactStoreProperty`
 *
 * @param properties - the TypeScript properties of a `ArtifactStoreProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_ArtifactStorePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryptionKey', CfnPipeline_EncryptionKeyPropertyValidator)(properties.encryptionKey));
    errors.collect(cdk.propertyValidator('location', cdk.requiredValidator)(properties.location));
    errors.collect(cdk.propertyValidator('location', cdk.validateString)(properties.location));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "ArtifactStoreProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.ArtifactStore` resource
 *
 * @param properties - the TypeScript properties of a `ArtifactStoreProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.ArtifactStore` resource.
 */
// @ts-ignore TS6133
function cfnPipelineArtifactStorePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_ArtifactStorePropertyValidator(properties).assertSuccess();
    return {
        EncryptionKey: cfnPipelineEncryptionKeyPropertyToCloudFormation(properties.encryptionKey),
        Location: cdk.stringToCloudFormation(properties.location),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnPipelineArtifactStorePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.ArtifactStoreProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.ArtifactStoreProperty>();
    ret.addPropertyResult('encryptionKey', 'EncryptionKey', properties.EncryptionKey != null ? CfnPipelineEncryptionKeyPropertyFromCloudFormation(properties.EncryptionKey) : undefined);
    ret.addPropertyResult('location', 'Location', cfn_parse.FromCloudFormation.getString(properties.Location));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * A mapping of `artifactStore` objects and their corresponding AWS Regions. There must be an artifact store for the pipeline Region and for each cross-region action in the pipeline.
     *
     * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstoremap.html
     */
    export interface ArtifactStoreMapProperty {
        /**
         * Represents information about the S3 bucket where artifacts are stored for the pipeline.
         *
         * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstoremap.html#cfn-codepipeline-pipeline-artifactstoremap-artifactstore
         */
        readonly artifactStore: CfnPipeline.ArtifactStoreProperty | cdk.IResolvable;
        /**
         * The action declaration's AWS Region, such as us-east-1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstoremap.html#cfn-codepipeline-pipeline-artifactstoremap-region
         */
        readonly region: string;
    }
}

/**
 * Determine whether the given properties match those of a `ArtifactStoreMapProperty`
 *
 * @param properties - the TypeScript properties of a `ArtifactStoreMapProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_ArtifactStoreMapPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('artifactStore', cdk.requiredValidator)(properties.artifactStore));
    errors.collect(cdk.propertyValidator('artifactStore', CfnPipeline_ArtifactStorePropertyValidator)(properties.artifactStore));
    errors.collect(cdk.propertyValidator('region', cdk.requiredValidator)(properties.region));
    errors.collect(cdk.propertyValidator('region', cdk.validateString)(properties.region));
    return errors.wrap('supplied properties not correct for "ArtifactStoreMapProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.ArtifactStoreMap` resource
 *
 * @param properties - the TypeScript properties of a `ArtifactStoreMapProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.ArtifactStoreMap` resource.
 */
// @ts-ignore TS6133
function cfnPipelineArtifactStoreMapPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_ArtifactStoreMapPropertyValidator(properties).assertSuccess();
    return {
        ArtifactStore: cfnPipelineArtifactStorePropertyToCloudFormation(properties.artifactStore),
        Region: cdk.stringToCloudFormation(properties.region),
    };
}

// @ts-ignore TS6133
function CfnPipelineArtifactStoreMapPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.ArtifactStoreMapProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.ArtifactStoreMapProperty>();
    ret.addPropertyResult('artifactStore', 'ArtifactStore', CfnPipelineArtifactStorePropertyFromCloudFormation(properties.ArtifactStore));
    ret.addPropertyResult('region', 'Region', cfn_parse.FromCloudFormation.getString(properties.Region));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * Reserved for future use.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-blockers.html
     */
    export interface BlockerDeclarationProperty {
        /**
         * Reserved for future use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-blockers.html#cfn-codepipeline-pipeline-stages-blockers-name
         */
        readonly name: string;
        /**
         * Reserved for future use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-blockers.html#cfn-codepipeline-pipeline-stages-blockers-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `BlockerDeclarationProperty`
 *
 * @param properties - the TypeScript properties of a `BlockerDeclarationProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_BlockerDeclarationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "BlockerDeclarationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.BlockerDeclaration` resource
 *
 * @param properties - the TypeScript properties of a `BlockerDeclarationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.BlockerDeclaration` resource.
 */
// @ts-ignore TS6133
function cfnPipelineBlockerDeclarationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_BlockerDeclarationPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnPipelineBlockerDeclarationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.BlockerDeclarationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.BlockerDeclarationProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * Represents information about the key used to encrypt data in the artifact store, such as an AWS Key Management Service ( AWS KMS) key.
     *
     * `EncryptionKey` is a property of the [ArtifactStore](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore-encryptionkey.html
     */
    export interface EncryptionKeyProperty {
        /**
         * The ID used to identify the key. For an AWS KMS key, you can use the key ID, the key ARN, or the alias ARN.
         *
         * > Aliases are recognized only in the account that created the AWS KMS key. For cross-account actions, you can only use the key ID or key ARN to identify the key. Cross-account actions involve using the role from the other account (AccountB), so specifying the key ID will use the key from the other account (AccountB).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore-encryptionkey.html#cfn-codepipeline-pipeline-artifactstore-encryptionkey-id
         */
        readonly id: string;
        /**
         * The type of encryption key, such as an AWS KMS key. When creating or updating a pipeline, the value must be set to 'KMS'.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore-encryptionkey.html#cfn-codepipeline-pipeline-artifactstore-encryptionkey-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionKeyProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionKeyProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_EncryptionKeyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "EncryptionKeyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.EncryptionKey` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionKeyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.EncryptionKey` resource.
 */
// @ts-ignore TS6133
function cfnPipelineEncryptionKeyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_EncryptionKeyPropertyValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnPipelineEncryptionKeyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.EncryptionKeyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.EncryptionKeyProperty>();
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * Represents information about an artifact to be worked on, such as a test or build artifact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-inputartifacts.html
     */
    export interface InputArtifactProperty {
        /**
         * The name of the artifact to be worked on (for example, "My App").
         *
         * Artifacts are the files that are worked on by actions in the pipeline. See the action configuration for each action for details about artifact parameters. For example, the S3 source action input artifact is a file name (or file path), and the files are generally provided as a ZIP file. Example artifact name: SampleApp_Windows.zip
         *
         * The input artifact of an action must exactly match the output artifact declared in a preceding action, but the input artifact does not have to be the next action in strict sequence from the action that provided the output artifact. Actions in parallel can declare different output artifacts, which are in turn consumed by different following actions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-inputartifacts.html#cfn-codepipeline-pipeline-stages-actions-inputartifacts-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `InputArtifactProperty`
 *
 * @param properties - the TypeScript properties of a `InputArtifactProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_InputArtifactPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "InputArtifactProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.InputArtifact` resource
 *
 * @param properties - the TypeScript properties of a `InputArtifactProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.InputArtifact` resource.
 */
// @ts-ignore TS6133
function cfnPipelineInputArtifactPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_InputArtifactPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnPipelineInputArtifactPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.InputArtifactProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.InputArtifactProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * Represents information about the output of an action.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-outputartifacts.html
     */
    export interface OutputArtifactProperty {
        /**
         * The name of the output of an artifact, such as "My App".
         *
         * The output artifact name must exactly match the input artifact declared for a downstream action. However, the downstream action's input artifact does not have to be the next action in strict sequence from the action that provided the output artifact. Actions in parallel can declare different output artifacts, which are in turn consumed by different following actions.
         *
         * Output artifact names must be unique within a pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-outputartifacts.html#cfn-codepipeline-pipeline-stages-actions-outputartifacts-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `OutputArtifactProperty`
 *
 * @param properties - the TypeScript properties of a `OutputArtifactProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_OutputArtifactPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "OutputArtifactProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.OutputArtifact` resource
 *
 * @param properties - the TypeScript properties of a `OutputArtifactProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.OutputArtifact` resource.
 */
// @ts-ignore TS6133
function cfnPipelineOutputArtifactPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_OutputArtifactPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnPipelineOutputArtifactPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.OutputArtifactProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.OutputArtifactProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * Represents information about a stage and its definition.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages.html
     */
    export interface StageDeclarationProperty {
        /**
         * The actions included in a stage.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages.html#cfn-codepipeline-pipeline-stages-actions
         */
        readonly actions: Array<CfnPipeline.ActionDeclarationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Reserved for future use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages.html#cfn-codepipeline-pipeline-stages-blockers
         */
        readonly blockers?: Array<CfnPipeline.BlockerDeclarationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the stage.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages.html#cfn-codepipeline-pipeline-stages-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `StageDeclarationProperty`
 *
 * @param properties - the TypeScript properties of a `StageDeclarationProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_StageDeclarationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actions', cdk.requiredValidator)(properties.actions));
    errors.collect(cdk.propertyValidator('actions', cdk.listValidator(CfnPipeline_ActionDeclarationPropertyValidator))(properties.actions));
    errors.collect(cdk.propertyValidator('blockers', cdk.listValidator(CfnPipeline_BlockerDeclarationPropertyValidator))(properties.blockers));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "StageDeclarationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.StageDeclaration` resource
 *
 * @param properties - the TypeScript properties of a `StageDeclarationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.StageDeclaration` resource.
 */
// @ts-ignore TS6133
function cfnPipelineStageDeclarationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_StageDeclarationPropertyValidator(properties).assertSuccess();
    return {
        Actions: cdk.listMapper(cfnPipelineActionDeclarationPropertyToCloudFormation)(properties.actions),
        Blockers: cdk.listMapper(cfnPipelineBlockerDeclarationPropertyToCloudFormation)(properties.blockers),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnPipelineStageDeclarationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.StageDeclarationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.StageDeclarationProperty>();
    ret.addPropertyResult('actions', 'Actions', cfn_parse.FromCloudFormation.getArray(CfnPipelineActionDeclarationPropertyFromCloudFormation)(properties.Actions));
    ret.addPropertyResult('blockers', 'Blockers', properties.Blockers != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineBlockerDeclarationPropertyFromCloudFormation)(properties.Blockers) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPipeline {
    /**
     * The name of the pipeline in which you want to disable the flow of artifacts from one stage to another.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-disableinboundstagetransitions.html
     */
    export interface StageTransitionProperty {
        /**
         * The reason given to the user that a stage is disabled, such as waiting for manual approval or manual tests. This message is displayed in the pipeline console UI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-disableinboundstagetransitions.html#cfn-codepipeline-pipeline-disableinboundstagetransitions-reason
         */
        readonly reason: string;
        /**
         * The name of the stage where you want to disable the inbound or outbound transition of artifacts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-disableinboundstagetransitions.html#cfn-codepipeline-pipeline-disableinboundstagetransitions-stagename
         */
        readonly stageName: string;
    }
}

/**
 * Determine whether the given properties match those of a `StageTransitionProperty`
 *
 * @param properties - the TypeScript properties of a `StageTransitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnPipeline_StageTransitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('reason', cdk.requiredValidator)(properties.reason));
    errors.collect(cdk.propertyValidator('reason', cdk.validateString)(properties.reason));
    errors.collect(cdk.propertyValidator('stageName', cdk.requiredValidator)(properties.stageName));
    errors.collect(cdk.propertyValidator('stageName', cdk.validateString)(properties.stageName));
    return errors.wrap('supplied properties not correct for "StageTransitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.StageTransition` resource
 *
 * @param properties - the TypeScript properties of a `StageTransitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::Pipeline.StageTransition` resource.
 */
// @ts-ignore TS6133
function cfnPipelineStageTransitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPipeline_StageTransitionPropertyValidator(properties).assertSuccess();
    return {
        Reason: cdk.stringToCloudFormation(properties.reason),
        StageName: cdk.stringToCloudFormation(properties.stageName),
    };
}

// @ts-ignore TS6133
function CfnPipelineStageTransitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.StageTransitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.StageTransitionProperty>();
    ret.addPropertyResult('reason', 'Reason', cfn_parse.FromCloudFormation.getString(properties.Reason));
    ret.addPropertyResult('stageName', 'StageName', cfn_parse.FromCloudFormation.getString(properties.StageName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnWebhook`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html
 */
export interface CfnWebhookProps {

    /**
     * Supported options are GITHUB_HMAC, IP, and UNAUTHENTICATED.
     *
     * - For information about the authentication scheme implemented by GITHUB_HMAC, see [Securing your webhooks](https://docs.aws.amazon.com/https://developer.github.com/webhooks/securing/) on the GitHub Developer website.
     * - IP rejects webhooks trigger requests unless they originate from an IP address in the IP range whitelisted in the authentication configuration.
     * - UNAUTHENTICATED accepts all webhook trigger requests regardless of origin.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-authentication
     */
    readonly authentication: string;

    /**
     * Properties that configure the authentication applied to incoming webhook trigger requests. The required properties depend on the authentication type. For GITHUB_HMAC, only the `SecretToken` property must be set. For IP, only the `AllowedIPRange` property must be set to a valid CIDR range. For UNAUTHENTICATED, no properties can be set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-authenticationconfiguration
     */
    readonly authenticationConfiguration: CfnWebhook.WebhookAuthConfigurationProperty | cdk.IResolvable;

    /**
     * A list of rules applied to the body/payload sent in the POST request to a webhook URL. All defined rules must pass for the request to be accepted and the pipeline started.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-filters
     */
    readonly filters: Array<CfnWebhook.WebhookFilterRuleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the action in a pipeline you want to connect to the webhook. The action must be from the source (first) stage of the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-targetaction
     */
    readonly targetAction: string;

    /**
     * The name of the pipeline you want to connect to the webhook.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-targetpipeline
     */
    readonly targetPipeline: string;

    /**
     * The version number of the pipeline to be connected to the trigger request.
     *
     * Required: Yes
     *
     * Type: Integer
     *
     * Update requires: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-targetpipelineversion
     */
    readonly targetPipelineVersion: number;

    /**
     * The name of the webhook.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-name
     */
    readonly name?: string;

    /**
     * Configures a connection between the webhook that was created and the external tool with events to be detected.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-registerwiththirdparty
     */
    readonly registerWithThirdParty?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnWebhookProps`
 *
 * @param properties - the TypeScript properties of a `CfnWebhookProps`
 *
 * @returns the result of the validation.
 */
function CfnWebhookPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authentication', cdk.requiredValidator)(properties.authentication));
    errors.collect(cdk.propertyValidator('authentication', cdk.validateString)(properties.authentication));
    errors.collect(cdk.propertyValidator('authenticationConfiguration', cdk.requiredValidator)(properties.authenticationConfiguration));
    errors.collect(cdk.propertyValidator('authenticationConfiguration', CfnWebhook_WebhookAuthConfigurationPropertyValidator)(properties.authenticationConfiguration));
    errors.collect(cdk.propertyValidator('filters', cdk.requiredValidator)(properties.filters));
    errors.collect(cdk.propertyValidator('filters', cdk.listValidator(CfnWebhook_WebhookFilterRulePropertyValidator))(properties.filters));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('registerWithThirdParty', cdk.validateBoolean)(properties.registerWithThirdParty));
    errors.collect(cdk.propertyValidator('targetAction', cdk.requiredValidator)(properties.targetAction));
    errors.collect(cdk.propertyValidator('targetAction', cdk.validateString)(properties.targetAction));
    errors.collect(cdk.propertyValidator('targetPipeline', cdk.requiredValidator)(properties.targetPipeline));
    errors.collect(cdk.propertyValidator('targetPipeline', cdk.validateString)(properties.targetPipeline));
    errors.collect(cdk.propertyValidator('targetPipelineVersion', cdk.requiredValidator)(properties.targetPipelineVersion));
    errors.collect(cdk.propertyValidator('targetPipelineVersion', cdk.validateNumber)(properties.targetPipelineVersion));
    return errors.wrap('supplied properties not correct for "CfnWebhookProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::Webhook` resource
 *
 * @param properties - the TypeScript properties of a `CfnWebhookProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::Webhook` resource.
 */
// @ts-ignore TS6133
function cfnWebhookPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebhookPropsValidator(properties).assertSuccess();
    return {
        Authentication: cdk.stringToCloudFormation(properties.authentication),
        AuthenticationConfiguration: cfnWebhookWebhookAuthConfigurationPropertyToCloudFormation(properties.authenticationConfiguration),
        Filters: cdk.listMapper(cfnWebhookWebhookFilterRulePropertyToCloudFormation)(properties.filters),
        TargetAction: cdk.stringToCloudFormation(properties.targetAction),
        TargetPipeline: cdk.stringToCloudFormation(properties.targetPipeline),
        TargetPipelineVersion: cdk.numberToCloudFormation(properties.targetPipelineVersion),
        Name: cdk.stringToCloudFormation(properties.name),
        RegisterWithThirdParty: cdk.booleanToCloudFormation(properties.registerWithThirdParty),
    };
}

// @ts-ignore TS6133
function CfnWebhookPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebhookProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebhookProps>();
    ret.addPropertyResult('authentication', 'Authentication', cfn_parse.FromCloudFormation.getString(properties.Authentication));
    ret.addPropertyResult('authenticationConfiguration', 'AuthenticationConfiguration', CfnWebhookWebhookAuthConfigurationPropertyFromCloudFormation(properties.AuthenticationConfiguration));
    ret.addPropertyResult('filters', 'Filters', cfn_parse.FromCloudFormation.getArray(CfnWebhookWebhookFilterRulePropertyFromCloudFormation)(properties.Filters));
    ret.addPropertyResult('targetAction', 'TargetAction', cfn_parse.FromCloudFormation.getString(properties.TargetAction));
    ret.addPropertyResult('targetPipeline', 'TargetPipeline', cfn_parse.FromCloudFormation.getString(properties.TargetPipeline));
    ret.addPropertyResult('targetPipelineVersion', 'TargetPipelineVersion', cfn_parse.FromCloudFormation.getNumber(properties.TargetPipelineVersion));
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('registerWithThirdParty', 'RegisterWithThirdParty', properties.RegisterWithThirdParty != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RegisterWithThirdParty) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CodePipeline::Webhook`
 *
 * The `AWS::CodePipeline::Webhook` resource creates and registers your webhook. After the webhook is created and registered, it triggers your pipeline to start every time an external event occurs. For more information, see [Configure Your GitHub Pipelines to Use Webhooks for Change Detection](https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-webhooks-migration.html) in the *AWS CodePipeline User Guide* .
 *
 * We strongly recommend that you use AWS Secrets Manager to store your credentials. If you use Secrets Manager, you must have already configured and stored your secret parameters in Secrets Manager. For more information, see [Using Dynamic References to Specify Template Values](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) .
 *
 * > When passing secret parameters, do not enter the value directly into the template. The value is rendered as plaintext and is therefore readable. For security reasons, do not use plaintext in your AWS CloudFormation template to store your credentials.
 *
 * @cloudformationResource AWS::CodePipeline::Webhook
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html
 */
export class CfnWebhook extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CodePipeline::Webhook";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWebhook {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnWebhookPropsFromCloudFormation(resourceProperties);
        const ret = new CfnWebhook(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The webhook URL generated by AWS CodePipeline , such as `https://eu-central-1.webhooks.aws/trigger123456` .
     * @cloudformationAttribute Url
     */
    public readonly attrUrl: string;

    /**
     * Supported options are GITHUB_HMAC, IP, and UNAUTHENTICATED.
     *
     * - For information about the authentication scheme implemented by GITHUB_HMAC, see [Securing your webhooks](https://docs.aws.amazon.com/https://developer.github.com/webhooks/securing/) on the GitHub Developer website.
     * - IP rejects webhooks trigger requests unless they originate from an IP address in the IP range whitelisted in the authentication configuration.
     * - UNAUTHENTICATED accepts all webhook trigger requests regardless of origin.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-authentication
     */
    public authentication: string;

    /**
     * Properties that configure the authentication applied to incoming webhook trigger requests. The required properties depend on the authentication type. For GITHUB_HMAC, only the `SecretToken` property must be set. For IP, only the `AllowedIPRange` property must be set to a valid CIDR range. For UNAUTHENTICATED, no properties can be set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-authenticationconfiguration
     */
    public authenticationConfiguration: CfnWebhook.WebhookAuthConfigurationProperty | cdk.IResolvable;

    /**
     * A list of rules applied to the body/payload sent in the POST request to a webhook URL. All defined rules must pass for the request to be accepted and the pipeline started.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-filters
     */
    public filters: Array<CfnWebhook.WebhookFilterRuleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the action in a pipeline you want to connect to the webhook. The action must be from the source (first) stage of the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-targetaction
     */
    public targetAction: string;

    /**
     * The name of the pipeline you want to connect to the webhook.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-targetpipeline
     */
    public targetPipeline: string;

    /**
     * The version number of the pipeline to be connected to the trigger request.
     *
     * Required: Yes
     *
     * Type: Integer
     *
     * Update requires: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-targetpipelineversion
     */
    public targetPipelineVersion: number;

    /**
     * The name of the webhook.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-name
     */
    public name: string | undefined;

    /**
     * Configures a connection between the webhook that was created and the external tool with events to be detected.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-registerwiththirdparty
     */
    public registerWithThirdParty: boolean | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::CodePipeline::Webhook`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWebhookProps) {
        super(scope, id, { type: CfnWebhook.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'authentication', this);
        cdk.requireProperty(props, 'authenticationConfiguration', this);
        cdk.requireProperty(props, 'filters', this);
        cdk.requireProperty(props, 'targetAction', this);
        cdk.requireProperty(props, 'targetPipeline', this);
        cdk.requireProperty(props, 'targetPipelineVersion', this);
        this.attrUrl = cdk.Token.asString(this.getAtt('Url', cdk.ResolutionTypeHint.STRING));

        this.authentication = props.authentication;
        this.authenticationConfiguration = props.authenticationConfiguration;
        this.filters = props.filters;
        this.targetAction = props.targetAction;
        this.targetPipeline = props.targetPipeline;
        this.targetPipelineVersion = props.targetPipelineVersion;
        this.name = props.name;
        this.registerWithThirdParty = props.registerWithThirdParty;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnWebhook.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            authentication: this.authentication,
            authenticationConfiguration: this.authenticationConfiguration,
            filters: this.filters,
            targetAction: this.targetAction,
            targetPipeline: this.targetPipeline,
            targetPipelineVersion: this.targetPipelineVersion,
            name: this.name,
            registerWithThirdParty: this.registerWithThirdParty,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnWebhookPropsToCloudFormation(props);
    }
}

export namespace CfnWebhook {
    /**
     * The authentication applied to incoming webhook trigger requests.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookauthconfiguration.html
     */
    export interface WebhookAuthConfigurationProperty {
        /**
         * The property used to configure acceptance of webhooks in an IP address range. For IP, only the `AllowedIPRange` property must be set. This property must be set to a valid CIDR range.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookauthconfiguration.html#cfn-codepipeline-webhook-webhookauthconfiguration-allowediprange
         */
        readonly allowedIpRange?: string;
        /**
         * The property used to configure GitHub authentication. For GITHUB_HMAC, only the `SecretToken` property must be set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookauthconfiguration.html#cfn-codepipeline-webhook-webhookauthconfiguration-secrettoken
         */
        readonly secretToken?: string;
    }
}

/**
 * Determine whether the given properties match those of a `WebhookAuthConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WebhookAuthConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebhook_WebhookAuthConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowedIpRange', cdk.validateString)(properties.allowedIpRange));
    errors.collect(cdk.propertyValidator('secretToken', cdk.validateString)(properties.secretToken));
    return errors.wrap('supplied properties not correct for "WebhookAuthConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::Webhook.WebhookAuthConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `WebhookAuthConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::Webhook.WebhookAuthConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnWebhookWebhookAuthConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebhook_WebhookAuthConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AllowedIPRange: cdk.stringToCloudFormation(properties.allowedIpRange),
        SecretToken: cdk.stringToCloudFormation(properties.secretToken),
    };
}

// @ts-ignore TS6133
function CfnWebhookWebhookAuthConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebhook.WebhookAuthConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebhook.WebhookAuthConfigurationProperty>();
    ret.addPropertyResult('allowedIpRange', 'AllowedIPRange', properties.AllowedIPRange != null ? cfn_parse.FromCloudFormation.getString(properties.AllowedIPRange) : undefined);
    ret.addPropertyResult('secretToken', 'SecretToken', properties.SecretToken != null ? cfn_parse.FromCloudFormation.getString(properties.SecretToken) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWebhook {
    /**
     * The event criteria that specify when a webhook notification is sent to your URL.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookfilterrule.html
     */
    export interface WebhookFilterRuleProperty {
        /**
         * A JsonPath expression that is applied to the body/payload of the webhook. The value selected by the JsonPath expression must match the value specified in the `MatchEquals` field. Otherwise, the request is ignored. For more information, see [Java JsonPath implementation](https://docs.aws.amazon.com/https://github.com/json-path/JsonPath) in GitHub.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookfilterrule.html#cfn-codepipeline-webhook-webhookfilterrule-jsonpath
         */
        readonly jsonPath: string;
        /**
         * The value selected by the `JsonPath` expression must match what is supplied in the `MatchEquals` field. Otherwise, the request is ignored. Properties from the target action configuration can be included as placeholders in this value by surrounding the action configuration key with curly brackets. For example, if the value supplied here is "refs/heads/{Branch}" and the target action has an action configuration property called "Branch" with a value of "main", the `MatchEquals` value is evaluated as "refs/heads/main". For a list of action configuration properties for built-in action types, see [Pipeline Structure Reference Action Requirements](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookfilterrule.html#cfn-codepipeline-webhook-webhookfilterrule-matchequals
         */
        readonly matchEquals?: string;
    }
}

/**
 * Determine whether the given properties match those of a `WebhookFilterRuleProperty`
 *
 * @param properties - the TypeScript properties of a `WebhookFilterRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnWebhook_WebhookFilterRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('jsonPath', cdk.requiredValidator)(properties.jsonPath));
    errors.collect(cdk.propertyValidator('jsonPath', cdk.validateString)(properties.jsonPath));
    errors.collect(cdk.propertyValidator('matchEquals', cdk.validateString)(properties.matchEquals));
    return errors.wrap('supplied properties not correct for "WebhookFilterRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodePipeline::Webhook.WebhookFilterRule` resource
 *
 * @param properties - the TypeScript properties of a `WebhookFilterRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodePipeline::Webhook.WebhookFilterRule` resource.
 */
// @ts-ignore TS6133
function cfnWebhookWebhookFilterRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWebhook_WebhookFilterRulePropertyValidator(properties).assertSuccess();
    return {
        JsonPath: cdk.stringToCloudFormation(properties.jsonPath),
        MatchEquals: cdk.stringToCloudFormation(properties.matchEquals),
    };
}

// @ts-ignore TS6133
function CfnWebhookWebhookFilterRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebhook.WebhookFilterRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebhook.WebhookFilterRuleProperty>();
    ret.addPropertyResult('jsonPath', 'JsonPath', cfn_parse.FromCloudFormation.getString(properties.JsonPath));
    ret.addPropertyResult('matchEquals', 'MatchEquals', properties.MatchEquals != null ? cfn_parse.FromCloudFormation.getString(properties.MatchEquals) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
