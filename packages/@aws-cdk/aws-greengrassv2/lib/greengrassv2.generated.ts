// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:21.676Z","fingerprint":"DEqFzdbj046RUqSvwRWUAeM0aRpvXgRVT3Lvay1RFrg="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnComponentVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html
 */
export interface CfnComponentVersionProps {

    /**
     * The recipe to use to create the component. The recipe defines the component's metadata, parameters, dependencies, lifecycle, artifacts, and platform compatibility.
     *
     * You must specify either `InlineRecipe` or `LambdaFunction` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html#cfn-greengrassv2-componentversion-inlinerecipe
     */
    readonly inlineRecipe?: string;

    /**
     * The parameters to create a component from a Lambda function.
     *
     * You must specify either `InlineRecipe` or `LambdaFunction` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html#cfn-greengrassv2-componentversion-lambdafunction
     */
    readonly lambdaFunction?: CfnComponentVersion.LambdaFunctionRecipeSourceProperty | cdk.IResolvable;

    /**
     * Application-specific metadata to attach to the component version. You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tag your AWS IoT Greengrass Version 2 resources](https://docs.aws.amazon.com/greengrass/v2/developerguide/tag-resources.html) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
     *
     * ```json
     * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
     * }
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html#cfn-greengrassv2-componentversion-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnComponentVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnComponentVersionProps`
 *
 * @returns the result of the validation.
 */
function CfnComponentVersionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('inlineRecipe', cdk.validateString)(properties.inlineRecipe));
    errors.collect(cdk.propertyValidator('lambdaFunction', CfnComponentVersion_LambdaFunctionRecipeSourcePropertyValidator)(properties.lambdaFunction));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnComponentVersionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion` resource
 *
 * @param properties - the TypeScript properties of a `CfnComponentVersionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion` resource.
 */
// @ts-ignore TS6133
function cfnComponentVersionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentVersionPropsValidator(properties).assertSuccess();
    return {
        InlineRecipe: cdk.stringToCloudFormation(properties.inlineRecipe),
        LambdaFunction: cfnComponentVersionLambdaFunctionRecipeSourcePropertyToCloudFormation(properties.lambdaFunction),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnComponentVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentVersionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersionProps>();
    ret.addPropertyResult('inlineRecipe', 'InlineRecipe', properties.InlineRecipe != null ? cfn_parse.FromCloudFormation.getString(properties.InlineRecipe) : undefined);
    ret.addPropertyResult('lambdaFunction', 'LambdaFunction', properties.LambdaFunction != null ? CfnComponentVersionLambdaFunctionRecipeSourcePropertyFromCloudFormation(properties.LambdaFunction) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::GreengrassV2::ComponentVersion`
 *
 * Creates a component. Components are software that run on AWS IoT Greengrass core devices. After you develop and test a component on your core device, you can use this operation to upload your component to AWS IoT Greengrass . Then, you can deploy the component to other core devices.
 *
 * You can use this operation to do the following:
 *
 * - *Create components from recipes*
 *
 * Create a component from a recipe, which is a file that defines the component's metadata, parameters, dependencies, lifecycle, artifacts, and platform capability. For more information, see [AWS IoT Greengrass component recipe reference](https://docs.aws.amazon.com/greengrass/v2/developerguide/component-recipe-reference.html) in the *AWS IoT Greengrass V2 Developer Guide* .
 *
 * To create a component from a recipe, specify `inlineRecipe` when you call this operation.
 * - *Create components from Lambda functions*
 *
 * Create a component from an AWS Lambda function that runs on AWS IoT Greengrass . This creates a recipe and artifacts from the Lambda function's deployment package. You can use this operation to migrate Lambda functions from AWS IoT Greengrass V1 to AWS IoT Greengrass V2 .
 *
 * This function only accepts Lambda functions that use the following runtimes:
 *
 * - Python 2.7 – `python2.7`
 * - Python 3.7 – `python3.7`
 * - Python 3.8 – `python3.8`
 * - Java 8 – `java8`
 * - Node.js 10 – `nodejs10.x`
 * - Node.js 12 – `nodejs12.x`
 *
 * To create a component from a Lambda function, specify `lambdaFunction` when you call this operation.
 *
 * @cloudformationResource AWS::GreengrassV2::ComponentVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html
 */
export class CfnComponentVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GreengrassV2::ComponentVersion";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnComponentVersion {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnComponentVersionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnComponentVersion(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the component version.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the component.
     * @cloudformationAttribute ComponentName
     */
    public readonly attrComponentName: string;

    /**
     * The version of the component.
     * @cloudformationAttribute ComponentVersion
     */
    public readonly attrComponentVersion: string;

    /**
     * The recipe to use to create the component. The recipe defines the component's metadata, parameters, dependencies, lifecycle, artifacts, and platform compatibility.
     *
     * You must specify either `InlineRecipe` or `LambdaFunction` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html#cfn-greengrassv2-componentversion-inlinerecipe
     */
    public inlineRecipe: string | undefined;

    /**
     * The parameters to create a component from a Lambda function.
     *
     * You must specify either `InlineRecipe` or `LambdaFunction` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html#cfn-greengrassv2-componentversion-lambdafunction
     */
    public lambdaFunction: CfnComponentVersion.LambdaFunctionRecipeSourceProperty | cdk.IResolvable | undefined;

    /**
     * Application-specific metadata to attach to the component version. You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tag your AWS IoT Greengrass Version 2 resources](https://docs.aws.amazon.com/greengrass/v2/developerguide/tag-resources.html) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
     *
     * ```json
     * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
     * }
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html#cfn-greengrassv2-componentversion-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::GreengrassV2::ComponentVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnComponentVersionProps = {}) {
        super(scope, id, { type: CfnComponentVersion.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrComponentName = cdk.Token.asString(this.getAtt('ComponentName', cdk.ResolutionTypeHint.STRING));
        this.attrComponentVersion = cdk.Token.asString(this.getAtt('ComponentVersion', cdk.ResolutionTypeHint.STRING));

        this.inlineRecipe = props.inlineRecipe;
        this.lambdaFunction = props.lambdaFunction;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::GreengrassV2::ComponentVersion", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnComponentVersion.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            inlineRecipe: this.inlineRecipe,
            lambdaFunction: this.lambdaFunction,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnComponentVersionPropsToCloudFormation(props);
    }
}

export namespace CfnComponentVersion {
    /**
     * Contains information about a component dependency for a Lambda function component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentdependencyrequirement.html
     */
    export interface ComponentDependencyRequirementProperty {
        /**
         * The type of this dependency. Choose from the following options:
         *
         * - `SOFT` – The component doesn't restart if the dependency changes state.
         * - `HARD` – The component restarts if the dependency changes state.
         *
         * Default: `HARD`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentdependencyrequirement.html#cfn-greengrassv2-componentversion-componentdependencyrequirement-dependencytype
         */
        readonly dependencyType?: string;
        /**
         * The component version requirement for the component dependency.
         *
         * AWS IoT Greengrass uses semantic version constraints. For more information, see [Semantic Versioning](https://docs.aws.amazon.com/https://semver.org/) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentdependencyrequirement.html#cfn-greengrassv2-componentversion-componentdependencyrequirement-versionrequirement
         */
        readonly versionRequirement?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentDependencyRequirementProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentDependencyRequirementProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentVersion_ComponentDependencyRequirementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dependencyType', cdk.validateString)(properties.dependencyType));
    errors.collect(cdk.propertyValidator('versionRequirement', cdk.validateString)(properties.versionRequirement));
    return errors.wrap('supplied properties not correct for "ComponentDependencyRequirementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.ComponentDependencyRequirement` resource
 *
 * @param properties - the TypeScript properties of a `ComponentDependencyRequirementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.ComponentDependencyRequirement` resource.
 */
// @ts-ignore TS6133
function cfnComponentVersionComponentDependencyRequirementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentVersion_ComponentDependencyRequirementPropertyValidator(properties).assertSuccess();
    return {
        DependencyType: cdk.stringToCloudFormation(properties.dependencyType),
        VersionRequirement: cdk.stringToCloudFormation(properties.versionRequirement),
    };
}

// @ts-ignore TS6133
function CfnComponentVersionComponentDependencyRequirementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentVersion.ComponentDependencyRequirementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.ComponentDependencyRequirementProperty>();
    ret.addPropertyResult('dependencyType', 'DependencyType', properties.DependencyType != null ? cfn_parse.FromCloudFormation.getString(properties.DependencyType) : undefined);
    ret.addPropertyResult('versionRequirement', 'VersionRequirement', properties.VersionRequirement != null ? cfn_parse.FromCloudFormation.getString(properties.VersionRequirement) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentVersion {
    /**
     * Contains information about a platform that a component supports.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentplatform.html
     */
    export interface ComponentPlatformProperty {
        /**
         * A dictionary of attributes for the platform. The AWS IoT Greengrass Core software defines the `os` and `platform` by default. You can specify additional platform attributes for a core device when you deploy the AWS IoT Greengrass nucleus component. For more information, see the [AWS IoT Greengrass nucleus component](https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-nucleus-component.html) in the *AWS IoT Greengrass V2 Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentplatform.html#cfn-greengrassv2-componentversion-componentplatform-attributes
         */
        readonly attributes?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The friendly name of the platform. This name helps you identify the platform.
         *
         * If you omit this parameter, AWS IoT Greengrass creates a friendly name from the `os` and `architecture` of the platform.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentplatform.html#cfn-greengrassv2-componentversion-componentplatform-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentPlatformProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentPlatformProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentVersion_ComponentPlatformPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributes', cdk.hashValidator(cdk.validateString))(properties.attributes));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "ComponentPlatformProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.ComponentPlatform` resource
 *
 * @param properties - the TypeScript properties of a `ComponentPlatformProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.ComponentPlatform` resource.
 */
// @ts-ignore TS6133
function cfnComponentVersionComponentPlatformPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentVersion_ComponentPlatformPropertyValidator(properties).assertSuccess();
    return {
        Attributes: cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnComponentVersionComponentPlatformPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentVersion.ComponentPlatformProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.ComponentPlatformProperty>();
    ret.addPropertyResult('attributes', 'Attributes', properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentVersion {
    /**
     * Contains information about a container in which AWS Lambda functions run on AWS IoT Greengrass core devices.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdacontainerparams.html
     */
    export interface LambdaContainerParamsProperty {
        /**
         * The list of system devices that the container can access.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdacontainerparams.html#cfn-greengrassv2-componentversion-lambdacontainerparams-devices
         */
        readonly devices?: Array<CfnComponentVersion.LambdaDeviceMountProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The memory size of the container, expressed in kilobytes.
         *
         * Default: `16384` (16 MB)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdacontainerparams.html#cfn-greengrassv2-componentversion-lambdacontainerparams-memorysizeinkb
         */
        readonly memorySizeInKb?: number;
        /**
         * Whether or not the container can read information from the device's `/sys` folder.
         *
         * Default: `false`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdacontainerparams.html#cfn-greengrassv2-componentversion-lambdacontainerparams-mountrosysfs
         */
        readonly mountRoSysfs?: boolean | cdk.IResolvable;
        /**
         * The list of volumes that the container can access.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdacontainerparams.html#cfn-greengrassv2-componentversion-lambdacontainerparams-volumes
         */
        readonly volumes?: Array<CfnComponentVersion.LambdaVolumeMountProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaContainerParamsProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaContainerParamsProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentVersion_LambdaContainerParamsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('devices', cdk.listValidator(CfnComponentVersion_LambdaDeviceMountPropertyValidator))(properties.devices));
    errors.collect(cdk.propertyValidator('memorySizeInKb', cdk.validateNumber)(properties.memorySizeInKb));
    errors.collect(cdk.propertyValidator('mountRoSysfs', cdk.validateBoolean)(properties.mountRoSysfs));
    errors.collect(cdk.propertyValidator('volumes', cdk.listValidator(CfnComponentVersion_LambdaVolumeMountPropertyValidator))(properties.volumes));
    return errors.wrap('supplied properties not correct for "LambdaContainerParamsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.LambdaContainerParams` resource
 *
 * @param properties - the TypeScript properties of a `LambdaContainerParamsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.LambdaContainerParams` resource.
 */
// @ts-ignore TS6133
function cfnComponentVersionLambdaContainerParamsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentVersion_LambdaContainerParamsPropertyValidator(properties).assertSuccess();
    return {
        Devices: cdk.listMapper(cfnComponentVersionLambdaDeviceMountPropertyToCloudFormation)(properties.devices),
        MemorySizeInKB: cdk.numberToCloudFormation(properties.memorySizeInKb),
        MountROSysfs: cdk.booleanToCloudFormation(properties.mountRoSysfs),
        Volumes: cdk.listMapper(cfnComponentVersionLambdaVolumeMountPropertyToCloudFormation)(properties.volumes),
    };
}

// @ts-ignore TS6133
function CfnComponentVersionLambdaContainerParamsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentVersion.LambdaContainerParamsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.LambdaContainerParamsProperty>();
    ret.addPropertyResult('devices', 'Devices', properties.Devices != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentVersionLambdaDeviceMountPropertyFromCloudFormation)(properties.Devices) : undefined);
    ret.addPropertyResult('memorySizeInKb', 'MemorySizeInKB', properties.MemorySizeInKB != null ? cfn_parse.FromCloudFormation.getNumber(properties.MemorySizeInKB) : undefined);
    ret.addPropertyResult('mountRoSysfs', 'MountROSysfs', properties.MountROSysfs != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MountROSysfs) : undefined);
    ret.addPropertyResult('volumes', 'Volumes', properties.Volumes != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentVersionLambdaVolumeMountPropertyFromCloudFormation)(properties.Volumes) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentVersion {
    /**
     * Contains information about a device that Linux processes in a container can access.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdadevicemount.html
     */
    export interface LambdaDeviceMountProperty {
        /**
         * Whether or not to add the component's system user as an owner of the device.
         *
         * Default: `false`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdadevicemount.html#cfn-greengrassv2-componentversion-lambdadevicemount-addgroupowner
         */
        readonly addGroupOwner?: boolean | cdk.IResolvable;
        /**
         * The mount path for the device in the file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdadevicemount.html#cfn-greengrassv2-componentversion-lambdadevicemount-path
         */
        readonly path?: string;
        /**
         * The permission to access the device: read/only ( `ro` ) or read/write ( `rw` ).
         *
         * Default: `ro`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdadevicemount.html#cfn-greengrassv2-componentversion-lambdadevicemount-permission
         */
        readonly permission?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaDeviceMountProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaDeviceMountProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentVersion_LambdaDeviceMountPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('addGroupOwner', cdk.validateBoolean)(properties.addGroupOwner));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    errors.collect(cdk.propertyValidator('permission', cdk.validateString)(properties.permission));
    return errors.wrap('supplied properties not correct for "LambdaDeviceMountProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.LambdaDeviceMount` resource
 *
 * @param properties - the TypeScript properties of a `LambdaDeviceMountProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.LambdaDeviceMount` resource.
 */
// @ts-ignore TS6133
function cfnComponentVersionLambdaDeviceMountPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentVersion_LambdaDeviceMountPropertyValidator(properties).assertSuccess();
    return {
        AddGroupOwner: cdk.booleanToCloudFormation(properties.addGroupOwner),
        Path: cdk.stringToCloudFormation(properties.path),
        Permission: cdk.stringToCloudFormation(properties.permission),
    };
}

// @ts-ignore TS6133
function CfnComponentVersionLambdaDeviceMountPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentVersion.LambdaDeviceMountProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.LambdaDeviceMountProperty>();
    ret.addPropertyResult('addGroupOwner', 'AddGroupOwner', properties.AddGroupOwner != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AddGroupOwner) : undefined);
    ret.addPropertyResult('path', 'Path', properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined);
    ret.addPropertyResult('permission', 'Permission', properties.Permission != null ? cfn_parse.FromCloudFormation.getString(properties.Permission) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentVersion {
    /**
     * Contains information about an event source for an AWS Lambda function. The event source defines the topics on which this Lambda function subscribes to receive messages that run the function.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaeventsource.html
     */
    export interface LambdaEventSourceProperty {
        /**
         * The topic to which to subscribe to receive event messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaeventsource.html#cfn-greengrassv2-componentversion-lambdaeventsource-topic
         */
        readonly topic?: string;
        /**
         * The type of event source. Choose from the following options:
         *
         * - `PUB_SUB` – Subscribe to local publish/subscribe messages. This event source type doesn't support MQTT wildcards ( `+` and `#` ) in the event source topic.
         * - `IOT_CORE` – Subscribe to AWS IoT Core MQTT messages. This event source type supports MQTT wildcards ( `+` and `#` ) in the event source topic.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaeventsource.html#cfn-greengrassv2-componentversion-lambdaeventsource-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaEventSourceProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaEventSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentVersion_LambdaEventSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('topic', cdk.validateString)(properties.topic));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "LambdaEventSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.LambdaEventSource` resource
 *
 * @param properties - the TypeScript properties of a `LambdaEventSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.LambdaEventSource` resource.
 */
// @ts-ignore TS6133
function cfnComponentVersionLambdaEventSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentVersion_LambdaEventSourcePropertyValidator(properties).assertSuccess();
    return {
        Topic: cdk.stringToCloudFormation(properties.topic),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnComponentVersionLambdaEventSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentVersion.LambdaEventSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.LambdaEventSourceProperty>();
    ret.addPropertyResult('topic', 'Topic', properties.Topic != null ? cfn_parse.FromCloudFormation.getString(properties.Topic) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentVersion {
    /**
     * Contains parameters for a Lambda function that runs on AWS IoT Greengrass .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html
     */
    export interface LambdaExecutionParametersProperty {
        /**
         * The map of environment variables that are available to the Lambda function when it runs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-environmentvariables
         */
        readonly environmentVariables?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The list of event sources to which to subscribe to receive work messages. The Lambda function runs when it receives a message from an event source. You can subscribe this function to local publish/subscribe messages and AWS IoT Core MQTT messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-eventsources
         */
        readonly eventSources?: Array<CfnComponentVersion.LambdaEventSourceProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The list of arguments to pass to the Lambda function when it runs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-execargs
         */
        readonly execArgs?: string[];
        /**
         * The encoding type that the Lambda function supports.
         *
         * Default: `json`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-inputpayloadencodingtype
         */
        readonly inputPayloadEncodingType?: string;
        /**
         * The parameters for the Linux process that contains the Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-linuxprocessparams
         */
        readonly linuxProcessParams?: CfnComponentVersion.LambdaLinuxProcessParamsProperty | cdk.IResolvable;
        /**
         * The maximum amount of time in seconds that a non-pinned Lambda function can idle before the AWS IoT Greengrass Core software stops its process.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-maxidletimeinseconds
         */
        readonly maxIdleTimeInSeconds?: number;
        /**
         * The maximum number of instances that a non-pinned Lambda function can run at the same time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-maxinstancescount
         */
        readonly maxInstancesCount?: number;
        /**
         * The maximum size of the message queue for the Lambda function component. The AWS IoT Greengrass core device stores messages in a FIFO (first-in-first-out) queue until it can run the Lambda function to consume each message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-maxqueuesize
         */
        readonly maxQueueSize?: number;
        /**
         * Whether or not the Lambda function is pinned, or long-lived.
         *
         * - A pinned Lambda function starts when the AWS IoT Greengrass Core starts and keeps running in its own container.
         * - A non-pinned Lambda function starts only when it receives a work item and exists after it idles for `maxIdleTimeInSeconds` . If the function has multiple work items, the AWS IoT Greengrass Core software creates multiple instances of the function.
         *
         * Default: `true`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-pinned
         */
        readonly pinned?: boolean | cdk.IResolvable;
        /**
         * The interval in seconds at which a pinned (also known as long-lived) Lambda function component sends status updates to the Lambda manager component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-statustimeoutinseconds
         */
        readonly statusTimeoutInSeconds?: number;
        /**
         * The maximum amount of time in seconds that the Lambda function can process a work item.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-timeoutinseconds
         */
        readonly timeoutInSeconds?: number;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaExecutionParametersProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaExecutionParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentVersion_LambdaExecutionParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('environmentVariables', cdk.hashValidator(cdk.validateString))(properties.environmentVariables));
    errors.collect(cdk.propertyValidator('eventSources', cdk.listValidator(CfnComponentVersion_LambdaEventSourcePropertyValidator))(properties.eventSources));
    errors.collect(cdk.propertyValidator('execArgs', cdk.listValidator(cdk.validateString))(properties.execArgs));
    errors.collect(cdk.propertyValidator('inputPayloadEncodingType', cdk.validateString)(properties.inputPayloadEncodingType));
    errors.collect(cdk.propertyValidator('linuxProcessParams', CfnComponentVersion_LambdaLinuxProcessParamsPropertyValidator)(properties.linuxProcessParams));
    errors.collect(cdk.propertyValidator('maxIdleTimeInSeconds', cdk.validateNumber)(properties.maxIdleTimeInSeconds));
    errors.collect(cdk.propertyValidator('maxInstancesCount', cdk.validateNumber)(properties.maxInstancesCount));
    errors.collect(cdk.propertyValidator('maxQueueSize', cdk.validateNumber)(properties.maxQueueSize));
    errors.collect(cdk.propertyValidator('pinned', cdk.validateBoolean)(properties.pinned));
    errors.collect(cdk.propertyValidator('statusTimeoutInSeconds', cdk.validateNumber)(properties.statusTimeoutInSeconds));
    errors.collect(cdk.propertyValidator('timeoutInSeconds', cdk.validateNumber)(properties.timeoutInSeconds));
    return errors.wrap('supplied properties not correct for "LambdaExecutionParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.LambdaExecutionParameters` resource
 *
 * @param properties - the TypeScript properties of a `LambdaExecutionParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.LambdaExecutionParameters` resource.
 */
// @ts-ignore TS6133
function cfnComponentVersionLambdaExecutionParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentVersion_LambdaExecutionParametersPropertyValidator(properties).assertSuccess();
    return {
        EnvironmentVariables: cdk.hashMapper(cdk.stringToCloudFormation)(properties.environmentVariables),
        EventSources: cdk.listMapper(cfnComponentVersionLambdaEventSourcePropertyToCloudFormation)(properties.eventSources),
        ExecArgs: cdk.listMapper(cdk.stringToCloudFormation)(properties.execArgs),
        InputPayloadEncodingType: cdk.stringToCloudFormation(properties.inputPayloadEncodingType),
        LinuxProcessParams: cfnComponentVersionLambdaLinuxProcessParamsPropertyToCloudFormation(properties.linuxProcessParams),
        MaxIdleTimeInSeconds: cdk.numberToCloudFormation(properties.maxIdleTimeInSeconds),
        MaxInstancesCount: cdk.numberToCloudFormation(properties.maxInstancesCount),
        MaxQueueSize: cdk.numberToCloudFormation(properties.maxQueueSize),
        Pinned: cdk.booleanToCloudFormation(properties.pinned),
        StatusTimeoutInSeconds: cdk.numberToCloudFormation(properties.statusTimeoutInSeconds),
        TimeoutInSeconds: cdk.numberToCloudFormation(properties.timeoutInSeconds),
    };
}

// @ts-ignore TS6133
function CfnComponentVersionLambdaExecutionParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentVersion.LambdaExecutionParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.LambdaExecutionParametersProperty>();
    ret.addPropertyResult('environmentVariables', 'EnvironmentVariables', properties.EnvironmentVariables != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.EnvironmentVariables) : undefined);
    ret.addPropertyResult('eventSources', 'EventSources', properties.EventSources != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentVersionLambdaEventSourcePropertyFromCloudFormation)(properties.EventSources) : undefined);
    ret.addPropertyResult('execArgs', 'ExecArgs', properties.ExecArgs != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExecArgs) : undefined);
    ret.addPropertyResult('inputPayloadEncodingType', 'InputPayloadEncodingType', properties.InputPayloadEncodingType != null ? cfn_parse.FromCloudFormation.getString(properties.InputPayloadEncodingType) : undefined);
    ret.addPropertyResult('linuxProcessParams', 'LinuxProcessParams', properties.LinuxProcessParams != null ? CfnComponentVersionLambdaLinuxProcessParamsPropertyFromCloudFormation(properties.LinuxProcessParams) : undefined);
    ret.addPropertyResult('maxIdleTimeInSeconds', 'MaxIdleTimeInSeconds', properties.MaxIdleTimeInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxIdleTimeInSeconds) : undefined);
    ret.addPropertyResult('maxInstancesCount', 'MaxInstancesCount', properties.MaxInstancesCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxInstancesCount) : undefined);
    ret.addPropertyResult('maxQueueSize', 'MaxQueueSize', properties.MaxQueueSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxQueueSize) : undefined);
    ret.addPropertyResult('pinned', 'Pinned', properties.Pinned != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Pinned) : undefined);
    ret.addPropertyResult('statusTimeoutInSeconds', 'StatusTimeoutInSeconds', properties.StatusTimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.StatusTimeoutInSeconds) : undefined);
    ret.addPropertyResult('timeoutInSeconds', 'TimeoutInSeconds', properties.TimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInSeconds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentVersion {
    /**
     * Contains information about an AWS Lambda function to import to create a component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html
     */
    export interface LambdaFunctionRecipeSourceProperty {
        /**
         * The component versions on which this Lambda function component depends.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-componentdependencies
         */
        readonly componentDependencies?: { [key: string]: (CfnComponentVersion.ComponentDependencyRequirementProperty | cdk.IResolvable) } | cdk.IResolvable;
        /**
         * The system and runtime parameters for the Lambda function as it runs on the AWS IoT Greengrass core device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-componentlambdaparameters
         */
        readonly componentLambdaParameters?: CfnComponentVersion.LambdaExecutionParametersProperty | cdk.IResolvable;
        /**
         * The name of the component.
         *
         * Defaults to the name of the Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-componentname
         */
        readonly componentName?: string;
        /**
         * The platforms that the component version supports.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-componentplatforms
         */
        readonly componentPlatforms?: Array<CfnComponentVersion.ComponentPlatformProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The version of the component.
         *
         * Defaults to the version of the Lambda function as a semantic version. For example, if your function version is `3` , the component version becomes `3.0.0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-componentversion
         */
        readonly componentVersion?: string;
        /**
         * The ARN of the Lambda function. The ARN must include the version of the function to import. You can't use version aliases like `$LATEST` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-lambdaarn
         */
        readonly lambdaArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaFunctionRecipeSourceProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaFunctionRecipeSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentVersion_LambdaFunctionRecipeSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('componentDependencies', cdk.hashValidator(CfnComponentVersion_ComponentDependencyRequirementPropertyValidator))(properties.componentDependencies));
    errors.collect(cdk.propertyValidator('componentLambdaParameters', CfnComponentVersion_LambdaExecutionParametersPropertyValidator)(properties.componentLambdaParameters));
    errors.collect(cdk.propertyValidator('componentName', cdk.validateString)(properties.componentName));
    errors.collect(cdk.propertyValidator('componentPlatforms', cdk.listValidator(CfnComponentVersion_ComponentPlatformPropertyValidator))(properties.componentPlatforms));
    errors.collect(cdk.propertyValidator('componentVersion', cdk.validateString)(properties.componentVersion));
    errors.collect(cdk.propertyValidator('lambdaArn', cdk.validateString)(properties.lambdaArn));
    return errors.wrap('supplied properties not correct for "LambdaFunctionRecipeSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.LambdaFunctionRecipeSource` resource
 *
 * @param properties - the TypeScript properties of a `LambdaFunctionRecipeSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.LambdaFunctionRecipeSource` resource.
 */
// @ts-ignore TS6133
function cfnComponentVersionLambdaFunctionRecipeSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentVersion_LambdaFunctionRecipeSourcePropertyValidator(properties).assertSuccess();
    return {
        ComponentDependencies: cdk.hashMapper(cfnComponentVersionComponentDependencyRequirementPropertyToCloudFormation)(properties.componentDependencies),
        ComponentLambdaParameters: cfnComponentVersionLambdaExecutionParametersPropertyToCloudFormation(properties.componentLambdaParameters),
        ComponentName: cdk.stringToCloudFormation(properties.componentName),
        ComponentPlatforms: cdk.listMapper(cfnComponentVersionComponentPlatformPropertyToCloudFormation)(properties.componentPlatforms),
        ComponentVersion: cdk.stringToCloudFormation(properties.componentVersion),
        LambdaArn: cdk.stringToCloudFormation(properties.lambdaArn),
    };
}

// @ts-ignore TS6133
function CfnComponentVersionLambdaFunctionRecipeSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentVersion.LambdaFunctionRecipeSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.LambdaFunctionRecipeSourceProperty>();
    ret.addPropertyResult('componentDependencies', 'ComponentDependencies', properties.ComponentDependencies != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentVersionComponentDependencyRequirementPropertyFromCloudFormation)(properties.ComponentDependencies) : undefined);
    ret.addPropertyResult('componentLambdaParameters', 'ComponentLambdaParameters', properties.ComponentLambdaParameters != null ? CfnComponentVersionLambdaExecutionParametersPropertyFromCloudFormation(properties.ComponentLambdaParameters) : undefined);
    ret.addPropertyResult('componentName', 'ComponentName', properties.ComponentName != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentName) : undefined);
    ret.addPropertyResult('componentPlatforms', 'ComponentPlatforms', properties.ComponentPlatforms != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentVersionComponentPlatformPropertyFromCloudFormation)(properties.ComponentPlatforms) : undefined);
    ret.addPropertyResult('componentVersion', 'ComponentVersion', properties.ComponentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentVersion) : undefined);
    ret.addPropertyResult('lambdaArn', 'LambdaArn', properties.LambdaArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentVersion {
    /**
     * Contains parameters for a Linux process that contains an AWS Lambda function.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdalinuxprocessparams.html
     */
    export interface LambdaLinuxProcessParamsProperty {
        /**
         * The parameters for the container in which the Lambda function runs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdalinuxprocessparams.html#cfn-greengrassv2-componentversion-lambdalinuxprocessparams-containerparams
         */
        readonly containerParams?: CfnComponentVersion.LambdaContainerParamsProperty | cdk.IResolvable;
        /**
         * The isolation mode for the process that contains the Lambda function. The process can run in an isolated runtime environment inside the AWS IoT Greengrass container, or as a regular process outside any container.
         *
         * Default: `GreengrassContainer`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdalinuxprocessparams.html#cfn-greengrassv2-componentversion-lambdalinuxprocessparams-isolationmode
         */
        readonly isolationMode?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaLinuxProcessParamsProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaLinuxProcessParamsProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentVersion_LambdaLinuxProcessParamsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('containerParams', CfnComponentVersion_LambdaContainerParamsPropertyValidator)(properties.containerParams));
    errors.collect(cdk.propertyValidator('isolationMode', cdk.validateString)(properties.isolationMode));
    return errors.wrap('supplied properties not correct for "LambdaLinuxProcessParamsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.LambdaLinuxProcessParams` resource
 *
 * @param properties - the TypeScript properties of a `LambdaLinuxProcessParamsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.LambdaLinuxProcessParams` resource.
 */
// @ts-ignore TS6133
function cfnComponentVersionLambdaLinuxProcessParamsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentVersion_LambdaLinuxProcessParamsPropertyValidator(properties).assertSuccess();
    return {
        ContainerParams: cfnComponentVersionLambdaContainerParamsPropertyToCloudFormation(properties.containerParams),
        IsolationMode: cdk.stringToCloudFormation(properties.isolationMode),
    };
}

// @ts-ignore TS6133
function CfnComponentVersionLambdaLinuxProcessParamsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentVersion.LambdaLinuxProcessParamsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.LambdaLinuxProcessParamsProperty>();
    ret.addPropertyResult('containerParams', 'ContainerParams', properties.ContainerParams != null ? CfnComponentVersionLambdaContainerParamsPropertyFromCloudFormation(properties.ContainerParams) : undefined);
    ret.addPropertyResult('isolationMode', 'IsolationMode', properties.IsolationMode != null ? cfn_parse.FromCloudFormation.getString(properties.IsolationMode) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponentVersion {
    /**
     * Contains information about a volume that Linux processes in a container can access. When you define a volume, the AWS IoT Greengrass Core software mounts the source files to the destination inside the container.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdavolumemount.html
     */
    export interface LambdaVolumeMountProperty {
        /**
         * Whether or not to add the AWS IoT Greengrass user group as an owner of the volume.
         *
         * Default: `false`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdavolumemount.html#cfn-greengrassv2-componentversion-lambdavolumemount-addgroupowner
         */
        readonly addGroupOwner?: boolean | cdk.IResolvable;
        /**
         * The path to the logical volume in the file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdavolumemount.html#cfn-greengrassv2-componentversion-lambdavolumemount-destinationpath
         */
        readonly destinationPath?: string;
        /**
         * The permission to access the volume: read/only ( `ro` ) or read/write ( `rw` ).
         *
         * Default: `ro`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdavolumemount.html#cfn-greengrassv2-componentversion-lambdavolumemount-permission
         */
        readonly permission?: string;
        /**
         * The path to the physical volume in the file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdavolumemount.html#cfn-greengrassv2-componentversion-lambdavolumemount-sourcepath
         */
        readonly sourcePath?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaVolumeMountProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaVolumeMountProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponentVersion_LambdaVolumeMountPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('addGroupOwner', cdk.validateBoolean)(properties.addGroupOwner));
    errors.collect(cdk.propertyValidator('destinationPath', cdk.validateString)(properties.destinationPath));
    errors.collect(cdk.propertyValidator('permission', cdk.validateString)(properties.permission));
    errors.collect(cdk.propertyValidator('sourcePath', cdk.validateString)(properties.sourcePath));
    return errors.wrap('supplied properties not correct for "LambdaVolumeMountProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.LambdaVolumeMount` resource
 *
 * @param properties - the TypeScript properties of a `LambdaVolumeMountProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::ComponentVersion.LambdaVolumeMount` resource.
 */
// @ts-ignore TS6133
function cfnComponentVersionLambdaVolumeMountPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentVersion_LambdaVolumeMountPropertyValidator(properties).assertSuccess();
    return {
        AddGroupOwner: cdk.booleanToCloudFormation(properties.addGroupOwner),
        DestinationPath: cdk.stringToCloudFormation(properties.destinationPath),
        Permission: cdk.stringToCloudFormation(properties.permission),
        SourcePath: cdk.stringToCloudFormation(properties.sourcePath),
    };
}

// @ts-ignore TS6133
function CfnComponentVersionLambdaVolumeMountPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentVersion.LambdaVolumeMountProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.LambdaVolumeMountProperty>();
    ret.addPropertyResult('addGroupOwner', 'AddGroupOwner', properties.AddGroupOwner != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AddGroupOwner) : undefined);
    ret.addPropertyResult('destinationPath', 'DestinationPath', properties.DestinationPath != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationPath) : undefined);
    ret.addPropertyResult('permission', 'Permission', properties.Permission != null ? cfn_parse.FromCloudFormation.getString(properties.Permission) : undefined);
    ret.addPropertyResult('sourcePath', 'SourcePath', properties.SourcePath != null ? cfn_parse.FromCloudFormation.getString(properties.SourcePath) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDeployment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html
 */
export interface CfnDeploymentProps {

    /**
     * The ARN of the target AWS IoT thing or thing group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-targetarn
     */
    readonly targetArn: string;

    /**
     * The components to deploy. This is a dictionary, where each key is the name of a component, and each key's value is the version and configuration to deploy for that component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-components
     */
    readonly components?: { [key: string]: (CfnDeployment.ComponentDeploymentSpecificationProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The name of the deployment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-deploymentname
     */
    readonly deploymentName?: string;

    /**
     * The deployment policies for the deployment. These policies define how the deployment updates components and handles failure.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-deploymentpolicies
     */
    readonly deploymentPolicies?: CfnDeployment.DeploymentPoliciesProperty | cdk.IResolvable;

    /**
     * The job configuration for the deployment configuration. The job configuration specifies the rollout, timeout, and stop configurations for the deployment configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-iotjobconfiguration
     */
    readonly iotJobConfiguration?: CfnDeployment.DeploymentIoTJobConfigurationProperty | cdk.IResolvable;

    /**
     * Application-specific metadata to attach to the deployment. You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tag your AWS IoT Greengrass Version 2 resources](https://docs.aws.amazon.com/greengrass/v2/developerguide/tag-resources.html) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
     *
     * ```json
     * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
     * }
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnDeploymentProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeploymentProps`
 *
 * @returns the result of the validation.
 */
function CfnDeploymentPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('components', cdk.hashValidator(CfnDeployment_ComponentDeploymentSpecificationPropertyValidator))(properties.components));
    errors.collect(cdk.propertyValidator('deploymentName', cdk.validateString)(properties.deploymentName));
    errors.collect(cdk.propertyValidator('deploymentPolicies', CfnDeployment_DeploymentPoliciesPropertyValidator)(properties.deploymentPolicies));
    errors.collect(cdk.propertyValidator('iotJobConfiguration', CfnDeployment_DeploymentIoTJobConfigurationPropertyValidator)(properties.iotJobConfiguration));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('targetArn', cdk.requiredValidator)(properties.targetArn));
    errors.collect(cdk.propertyValidator('targetArn', cdk.validateString)(properties.targetArn));
    return errors.wrap('supplied properties not correct for "CfnDeploymentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment` resource
 *
 * @param properties - the TypeScript properties of a `CfnDeploymentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeploymentPropsValidator(properties).assertSuccess();
    return {
        TargetArn: cdk.stringToCloudFormation(properties.targetArn),
        Components: cdk.hashMapper(cfnDeploymentComponentDeploymentSpecificationPropertyToCloudFormation)(properties.components),
        DeploymentName: cdk.stringToCloudFormation(properties.deploymentName),
        DeploymentPolicies: cfnDeploymentDeploymentPoliciesPropertyToCloudFormation(properties.deploymentPolicies),
        IotJobConfiguration: cfnDeploymentDeploymentIoTJobConfigurationPropertyToCloudFormation(properties.iotJobConfiguration),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDeploymentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentProps>();
    ret.addPropertyResult('targetArn', 'TargetArn', cfn_parse.FromCloudFormation.getString(properties.TargetArn));
    ret.addPropertyResult('components', 'Components', properties.Components != null ? cfn_parse.FromCloudFormation.getMap(CfnDeploymentComponentDeploymentSpecificationPropertyFromCloudFormation)(properties.Components) : undefined);
    ret.addPropertyResult('deploymentName', 'DeploymentName', properties.DeploymentName != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentName) : undefined);
    ret.addPropertyResult('deploymentPolicies', 'DeploymentPolicies', properties.DeploymentPolicies != null ? CfnDeploymentDeploymentPoliciesPropertyFromCloudFormation(properties.DeploymentPolicies) : undefined);
    ret.addPropertyResult('iotJobConfiguration', 'IotJobConfiguration', properties.IotJobConfiguration != null ? CfnDeploymentDeploymentIoTJobConfigurationPropertyFromCloudFormation(properties.IotJobConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::GreengrassV2::Deployment`
 *
 * Creates a continuous deployment for a target, which is a AWS IoT Greengrass core device or group of core devices. When you add a new core device to a group of core devices that has a deployment, AWS IoT Greengrass deploys that group's deployment to the new device.
 *
 * You can define one deployment for each target. When you create a new deployment for a target that has an existing deployment, you replace the previous deployment. AWS IoT Greengrass applies the new deployment to the target devices.
 *
 * You can only add, update, or delete up to 10 deployments at a time to a single target.
 *
 * Every deployment has a revision number that indicates how many deployment revisions you define for a target. Use this operation to create a new revision of an existing deployment. This operation returns the revision number of the new deployment when you create it.
 *
 * For more information, see the [Create deployments](https://docs.aws.amazon.com/greengrass/v2/latest/developerguide/create-deployments.html) in the *AWS IoT Greengrass V2 Developer Guide* .
 *
 * > Deployment resources are deleted when you delete stacks. To keep the deployments in a stack, you must specify `"DeletionPolicy": "Retain"` on each deployment resource in the stack template that you want to keep. For more information, see [DeletionPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html) .
 * >
 * > You can only delete up to 10 deployment resources at a time. If you delete more than 10 resources, you receive an error.
 *
 * @cloudformationResource AWS::GreengrassV2::Deployment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html
 */
export class CfnDeployment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GreengrassV2::Deployment";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeployment {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDeploymentPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDeployment(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID of the deployment.
     * @cloudformationAttribute DeploymentId
     */
    public readonly attrDeploymentId: string;

    /**
     * The ARN of the target AWS IoT thing or thing group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-targetarn
     */
    public targetArn: string;

    /**
     * The components to deploy. This is a dictionary, where each key is the name of a component, and each key's value is the version and configuration to deploy for that component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-components
     */
    public components: { [key: string]: (CfnDeployment.ComponentDeploymentSpecificationProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * The name of the deployment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-deploymentname
     */
    public deploymentName: string | undefined;

    /**
     * The deployment policies for the deployment. These policies define how the deployment updates components and handles failure.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-deploymentpolicies
     */
    public deploymentPolicies: CfnDeployment.DeploymentPoliciesProperty | cdk.IResolvable | undefined;

    /**
     * The job configuration for the deployment configuration. The job configuration specifies the rollout, timeout, and stop configurations for the deployment configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-iotjobconfiguration
     */
    public iotJobConfiguration: CfnDeployment.DeploymentIoTJobConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Application-specific metadata to attach to the deployment. You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tag your AWS IoT Greengrass Version 2 resources](https://docs.aws.amazon.com/greengrass/v2/developerguide/tag-resources.html) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
     *
     * ```json
     * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
     * }
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::GreengrassV2::Deployment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDeploymentProps) {
        super(scope, id, { type: CfnDeployment.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'targetArn', this);
        this.attrDeploymentId = cdk.Token.asString(this.getAtt('DeploymentId', cdk.ResolutionTypeHint.STRING));

        this.targetArn = props.targetArn;
        this.components = props.components;
        this.deploymentName = props.deploymentName;
        this.deploymentPolicies = props.deploymentPolicies;
        this.iotJobConfiguration = props.iotJobConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::GreengrassV2::Deployment", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeployment.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            targetArn: this.targetArn,
            components: this.components,
            deploymentName: this.deploymentName,
            deploymentPolicies: this.deploymentPolicies,
            iotJobConfiguration: this.iotJobConfiguration,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDeploymentPropsToCloudFormation(props);
    }
}

export namespace CfnDeployment {
    /**
     * Contains information about a deployment's update to a component's configuration on AWS IoT Greengrass core devices. For more information, see [Update component configurations](https://docs.aws.amazon.com/greengrass/v2/developerguide/update-component-configurations.html) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentconfigurationupdate.html
     */
    export interface ComponentConfigurationUpdateProperty {
        /**
         * A serialized JSON string that contains the configuration object to merge to target devices. The core device merges this configuration with the component's existing configuration. If this is the first time a component deploys on a device, the core device merges this configuration with the component's default configuration. This means that the core device keeps it's existing configuration for keys and values that you don't specify in this object. For more information, see [Merge configuration updates](https://docs.aws.amazon.com/greengrass/v2/developerguide/update-component-configurations.html#merge-configuration-update) in the *AWS IoT Greengrass V2 Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentconfigurationupdate.html#cfn-greengrassv2-deployment-componentconfigurationupdate-merge
         */
        readonly merge?: string;
        /**
         * The list of configuration nodes to reset to default values on target devices. Use JSON pointers to specify each node to reset. JSON pointers start with a forward slash ( `/` ) and use forward slashes to separate the key for each level in the object. For more information, see the [JSON pointer specification](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6901) and [Reset configuration updates](https://docs.aws.amazon.com/greengrass/v2/developerguide/update-component-configurations.html#reset-configuration-update) in the *AWS IoT Greengrass V2 Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentconfigurationupdate.html#cfn-greengrassv2-deployment-componentconfigurationupdate-reset
         */
        readonly reset?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ComponentConfigurationUpdateProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentConfigurationUpdateProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeployment_ComponentConfigurationUpdatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('merge', cdk.validateString)(properties.merge));
    errors.collect(cdk.propertyValidator('reset', cdk.listValidator(cdk.validateString))(properties.reset));
    return errors.wrap('supplied properties not correct for "ComponentConfigurationUpdateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.ComponentConfigurationUpdate` resource
 *
 * @param properties - the TypeScript properties of a `ComponentConfigurationUpdateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.ComponentConfigurationUpdate` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentComponentConfigurationUpdatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeployment_ComponentConfigurationUpdatePropertyValidator(properties).assertSuccess();
    return {
        Merge: cdk.stringToCloudFormation(properties.merge),
        Reset: cdk.listMapper(cdk.stringToCloudFormation)(properties.reset),
    };
}

// @ts-ignore TS6133
function CfnDeploymentComponentConfigurationUpdatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.ComponentConfigurationUpdateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.ComponentConfigurationUpdateProperty>();
    ret.addPropertyResult('merge', 'Merge', properties.Merge != null ? cfn_parse.FromCloudFormation.getString(properties.Merge) : undefined);
    ret.addPropertyResult('reset', 'Reset', properties.Reset != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Reset) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDeployment {
    /**
     * Contains information about a component to deploy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentdeploymentspecification.html
     */
    export interface ComponentDeploymentSpecificationProperty {
        /**
         * The version of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentdeploymentspecification.html#cfn-greengrassv2-deployment-componentdeploymentspecification-componentversion
         */
        readonly componentVersion?: string;
        /**
         * The configuration updates to deploy for the component. You can define reset updates and merge updates. A reset updates the keys that you specify to the default configuration for the component. A merge updates the core device's component configuration with the keys and values that you specify. The AWS IoT Greengrass Core software applies reset updates before it applies merge updates. For more information, see [Update component configuration](https://docs.aws.amazon.com/greengrass/v2/developerguide/update-component-configurations.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentdeploymentspecification.html#cfn-greengrassv2-deployment-componentdeploymentspecification-configurationupdate
         */
        readonly configurationUpdate?: CfnDeployment.ComponentConfigurationUpdateProperty | cdk.IResolvable;
        /**
         * The system user and group that the  software uses to run component processes on the core device. If you omit this parameter, the  software uses the system user and group that you configure for the core device. For more information, see [Configure the user and group that run components](https://docs.aws.amazon.com/greengrass/v2/developerguide/configure-greengrass-core-v2.html#configure-component-user) in the *AWS IoT Greengrass V2 Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentdeploymentspecification.html#cfn-greengrassv2-deployment-componentdeploymentspecification-runwith
         */
        readonly runWith?: CfnDeployment.ComponentRunWithProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentDeploymentSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentDeploymentSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeployment_ComponentDeploymentSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('componentVersion', cdk.validateString)(properties.componentVersion));
    errors.collect(cdk.propertyValidator('configurationUpdate', CfnDeployment_ComponentConfigurationUpdatePropertyValidator)(properties.configurationUpdate));
    errors.collect(cdk.propertyValidator('runWith', CfnDeployment_ComponentRunWithPropertyValidator)(properties.runWith));
    return errors.wrap('supplied properties not correct for "ComponentDeploymentSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.ComponentDeploymentSpecification` resource
 *
 * @param properties - the TypeScript properties of a `ComponentDeploymentSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.ComponentDeploymentSpecification` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentComponentDeploymentSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeployment_ComponentDeploymentSpecificationPropertyValidator(properties).assertSuccess();
    return {
        ComponentVersion: cdk.stringToCloudFormation(properties.componentVersion),
        ConfigurationUpdate: cfnDeploymentComponentConfigurationUpdatePropertyToCloudFormation(properties.configurationUpdate),
        RunWith: cfnDeploymentComponentRunWithPropertyToCloudFormation(properties.runWith),
    };
}

// @ts-ignore TS6133
function CfnDeploymentComponentDeploymentSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.ComponentDeploymentSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.ComponentDeploymentSpecificationProperty>();
    ret.addPropertyResult('componentVersion', 'ComponentVersion', properties.ComponentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentVersion) : undefined);
    ret.addPropertyResult('configurationUpdate', 'ConfigurationUpdate', properties.ConfigurationUpdate != null ? CfnDeploymentComponentConfigurationUpdatePropertyFromCloudFormation(properties.ConfigurationUpdate) : undefined);
    ret.addPropertyResult('runWith', 'RunWith', properties.RunWith != null ? CfnDeploymentComponentRunWithPropertyFromCloudFormation(properties.RunWith) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDeployment {
    /**
     * Contains information system user and group that the AWS IoT Greengrass Core software uses to run component processes on the core device. For more information, see [Configure the user and group that run components](https://docs.aws.amazon.com/greengrass/v2/developerguide/configure-greengrass-core-v2.html#configure-component-user) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentrunwith.html
     */
    export interface ComponentRunWithProperty {
        /**
         * The POSIX system user and (optional) group to use to run this component. Specify the user and group separated by a colon ( `:` ) in the following format: `user:group` . The group is optional. If you don't specify a group, the AWS IoT Greengrass Core software uses the primary user for the group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentrunwith.html#cfn-greengrassv2-deployment-componentrunwith-posixuser
         */
        readonly posixUser?: string;
        /**
         * The system resource limits to apply to this component's process on the core device. AWS IoT Greengrass supports this feature only on Linux core devices.
         *
         * If you omit this parameter, the AWS IoT Greengrass Core software uses the default system resource limits that you configure on the AWS IoT Greengrass nucleus component. For more information, see [Configure system resource limits for components](https://docs.aws.amazon.com/greengrass/v2/developerguide/configure-greengrass-core-v2.html#configure-component-system-resource-limits) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentrunwith.html#cfn-greengrassv2-deployment-componentrunwith-systemresourcelimits
         */
        readonly systemResourceLimits?: CfnDeployment.SystemResourceLimitsProperty | cdk.IResolvable;
        /**
         * The Windows user to use to run this component on Windows core devices. The user must exist on each Windows core device, and its name and password must be in the LocalSystem account's Credentials Manager instance.
         *
         * If you omit this parameter, the AWS IoT Greengrass Core software uses the default Windows user that you configure on the AWS IoT Greengrass nucleus component. For more information, see [Configure the user and group that run components](https://docs.aws.amazon.com/greengrass/v2/developerguide/configure-greengrass-core-v2.html#configure-component-user) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentrunwith.html#cfn-greengrassv2-deployment-componentrunwith-windowsuser
         */
        readonly windowsUser?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentRunWithProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentRunWithProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeployment_ComponentRunWithPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('posixUser', cdk.validateString)(properties.posixUser));
    errors.collect(cdk.propertyValidator('systemResourceLimits', CfnDeployment_SystemResourceLimitsPropertyValidator)(properties.systemResourceLimits));
    errors.collect(cdk.propertyValidator('windowsUser', cdk.validateString)(properties.windowsUser));
    return errors.wrap('supplied properties not correct for "ComponentRunWithProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.ComponentRunWith` resource
 *
 * @param properties - the TypeScript properties of a `ComponentRunWithProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.ComponentRunWith` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentComponentRunWithPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeployment_ComponentRunWithPropertyValidator(properties).assertSuccess();
    return {
        PosixUser: cdk.stringToCloudFormation(properties.posixUser),
        SystemResourceLimits: cfnDeploymentSystemResourceLimitsPropertyToCloudFormation(properties.systemResourceLimits),
        WindowsUser: cdk.stringToCloudFormation(properties.windowsUser),
    };
}

// @ts-ignore TS6133
function CfnDeploymentComponentRunWithPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.ComponentRunWithProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.ComponentRunWithProperty>();
    ret.addPropertyResult('posixUser', 'PosixUser', properties.PosixUser != null ? cfn_parse.FromCloudFormation.getString(properties.PosixUser) : undefined);
    ret.addPropertyResult('systemResourceLimits', 'SystemResourceLimits', properties.SystemResourceLimits != null ? CfnDeploymentSystemResourceLimitsPropertyFromCloudFormation(properties.SystemResourceLimits) : undefined);
    ret.addPropertyResult('windowsUser', 'WindowsUser', properties.WindowsUser != null ? cfn_parse.FromCloudFormation.getString(properties.WindowsUser) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDeployment {
    /**
     * Contains information about a deployment's policy that defines when components are safe to update.
     *
     * Each component on a device can report whether or not it's ready to update. After a component and its dependencies are ready, they can apply the update in the deployment. You can configure whether or not the deployment notifies components of an update and waits for a response. You specify the amount of time each component has to respond to the update notification.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentcomponentupdatepolicy.html
     */
    export interface DeploymentComponentUpdatePolicyProperty {
        /**
         * Whether or not to notify components and wait for components to become safe to update. Choose from the following options:
         *
         * - `NOTIFY_COMPONENTS` – The deployment notifies each component before it stops and updates that component. Components can use the [SubscribeToComponentUpdates](https://docs.aws.amazon.com/greengrass/v2/developerguide/interprocess-communication.html#ipc-operation-subscribetocomponentupdates) IPC operation to receive these notifications. Then, components can respond with the [DeferComponentUpdate](https://docs.aws.amazon.com/greengrass/v2/developerguide/interprocess-communication.html#ipc-operation-defercomponentupdate) IPC operation. For more information, see the [Create deployments](https://docs.aws.amazon.com/greengrass/v2/latest/developerguide/create-deployments.html) in the *AWS IoT Greengrass V2 Developer Guide* .
         * - `SKIP_NOTIFY_COMPONENTS` – The deployment doesn't notify components or wait for them to be safe to update.
         *
         * Default: `NOTIFY_COMPONENTS`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentcomponentupdatepolicy.html#cfn-greengrassv2-deployment-deploymentcomponentupdatepolicy-action
         */
        readonly action?: string;
        /**
         * The amount of time in seconds that each component on a device has to report that it's safe to update. If the component waits for longer than this timeout, then the deployment proceeds on the device.
         *
         * Default: `60`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentcomponentupdatepolicy.html#cfn-greengrassv2-deployment-deploymentcomponentupdatepolicy-timeoutinseconds
         */
        readonly timeoutInSeconds?: number;
    }
}

/**
 * Determine whether the given properties match those of a `DeploymentComponentUpdatePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentComponentUpdatePolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeployment_DeploymentComponentUpdatePolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.validateString)(properties.action));
    errors.collect(cdk.propertyValidator('timeoutInSeconds', cdk.validateNumber)(properties.timeoutInSeconds));
    return errors.wrap('supplied properties not correct for "DeploymentComponentUpdatePolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.DeploymentComponentUpdatePolicy` resource
 *
 * @param properties - the TypeScript properties of a `DeploymentComponentUpdatePolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.DeploymentComponentUpdatePolicy` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentDeploymentComponentUpdatePolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeployment_DeploymentComponentUpdatePolicyPropertyValidator(properties).assertSuccess();
    return {
        Action: cdk.stringToCloudFormation(properties.action),
        TimeoutInSeconds: cdk.numberToCloudFormation(properties.timeoutInSeconds),
    };
}

// @ts-ignore TS6133
function CfnDeploymentDeploymentComponentUpdatePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.DeploymentComponentUpdatePolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.DeploymentComponentUpdatePolicyProperty>();
    ret.addPropertyResult('action', 'Action', properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined);
    ret.addPropertyResult('timeoutInSeconds', 'TimeoutInSeconds', properties.TimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInSeconds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDeployment {
    /**
     * Contains information about how long a component on a core device can validate its configuration updates before it times out. Components can use the [SubscribeToValidateConfigurationUpdates](https://docs.aws.amazon.com/greengrass/v2/developerguide/interprocess-communication.html#ipc-operation-subscribetovalidateconfigurationupdates) IPC operation to receive notifications when a deployment specifies a configuration update. Then, components can respond with the [SendConfigurationValidityReport](https://docs.aws.amazon.com/greengrass/v2/developerguide/interprocess-communication.html#ipc-operation-sendconfigurationvalidityreport) IPC operation. For more information, see the [Create deployments](https://docs.aws.amazon.com/greengrass/v2/latest/developerguide/create-deployments.html) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentconfigurationvalidationpolicy.html
     */
    export interface DeploymentConfigurationValidationPolicyProperty {
        /**
         * The amount of time in seconds that a component can validate its configuration updates. If the validation time exceeds this timeout, then the deployment proceeds for the device.
         *
         * Default: `30`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentconfigurationvalidationpolicy.html#cfn-greengrassv2-deployment-deploymentconfigurationvalidationpolicy-timeoutinseconds
         */
        readonly timeoutInSeconds?: number;
    }
}

/**
 * Determine whether the given properties match those of a `DeploymentConfigurationValidationPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentConfigurationValidationPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeployment_DeploymentConfigurationValidationPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('timeoutInSeconds', cdk.validateNumber)(properties.timeoutInSeconds));
    return errors.wrap('supplied properties not correct for "DeploymentConfigurationValidationPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.DeploymentConfigurationValidationPolicy` resource
 *
 * @param properties - the TypeScript properties of a `DeploymentConfigurationValidationPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.DeploymentConfigurationValidationPolicy` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentDeploymentConfigurationValidationPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeployment_DeploymentConfigurationValidationPolicyPropertyValidator(properties).assertSuccess();
    return {
        TimeoutInSeconds: cdk.numberToCloudFormation(properties.timeoutInSeconds),
    };
}

// @ts-ignore TS6133
function CfnDeploymentDeploymentConfigurationValidationPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.DeploymentConfigurationValidationPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.DeploymentConfigurationValidationPolicyProperty>();
    ret.addPropertyResult('timeoutInSeconds', 'TimeoutInSeconds', properties.TimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInSeconds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDeployment {
    /**
     * Contains information about an AWS IoT job configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentiotjobconfiguration.html
     */
    export interface DeploymentIoTJobConfigurationProperty {
        /**
         * The stop configuration for the job. This configuration defines when and how to stop a job rollout.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentiotjobconfiguration.html#cfn-greengrassv2-deployment-deploymentiotjobconfiguration-abortconfig
         */
        readonly abortConfig?: CfnDeployment.IoTJobAbortConfigProperty | cdk.IResolvable;
        /**
         * The rollout configuration for the job. This configuration defines the rate at which the job rolls out to the fleet of target devices.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentiotjobconfiguration.html#cfn-greengrassv2-deployment-deploymentiotjobconfiguration-jobexecutionsrolloutconfig
         */
        readonly jobExecutionsRolloutConfig?: CfnDeployment.IoTJobExecutionsRolloutConfigProperty | cdk.IResolvable;
        /**
         * The timeout configuration for the job. This configuration defines the amount of time each device has to complete the job.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentiotjobconfiguration.html#cfn-greengrassv2-deployment-deploymentiotjobconfiguration-timeoutconfig
         */
        readonly timeoutConfig?: CfnDeployment.IoTJobTimeoutConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DeploymentIoTJobConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentIoTJobConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeployment_DeploymentIoTJobConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('abortConfig', CfnDeployment_IoTJobAbortConfigPropertyValidator)(properties.abortConfig));
    errors.collect(cdk.propertyValidator('jobExecutionsRolloutConfig', CfnDeployment_IoTJobExecutionsRolloutConfigPropertyValidator)(properties.jobExecutionsRolloutConfig));
    errors.collect(cdk.propertyValidator('timeoutConfig', CfnDeployment_IoTJobTimeoutConfigPropertyValidator)(properties.timeoutConfig));
    return errors.wrap('supplied properties not correct for "DeploymentIoTJobConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.DeploymentIoTJobConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `DeploymentIoTJobConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.DeploymentIoTJobConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentDeploymentIoTJobConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeployment_DeploymentIoTJobConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AbortConfig: cfnDeploymentIoTJobAbortConfigPropertyToCloudFormation(properties.abortConfig),
        JobExecutionsRolloutConfig: cfnDeploymentIoTJobExecutionsRolloutConfigPropertyToCloudFormation(properties.jobExecutionsRolloutConfig),
        TimeoutConfig: cfnDeploymentIoTJobTimeoutConfigPropertyToCloudFormation(properties.timeoutConfig),
    };
}

// @ts-ignore TS6133
function CfnDeploymentDeploymentIoTJobConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.DeploymentIoTJobConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.DeploymentIoTJobConfigurationProperty>();
    ret.addPropertyResult('abortConfig', 'AbortConfig', properties.AbortConfig != null ? CfnDeploymentIoTJobAbortConfigPropertyFromCloudFormation(properties.AbortConfig) : undefined);
    ret.addPropertyResult('jobExecutionsRolloutConfig', 'JobExecutionsRolloutConfig', properties.JobExecutionsRolloutConfig != null ? CfnDeploymentIoTJobExecutionsRolloutConfigPropertyFromCloudFormation(properties.JobExecutionsRolloutConfig) : undefined);
    ret.addPropertyResult('timeoutConfig', 'TimeoutConfig', properties.TimeoutConfig != null ? CfnDeploymentIoTJobTimeoutConfigPropertyFromCloudFormation(properties.TimeoutConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDeployment {
    /**
     * Contains information about policies that define how a deployment updates components and handles failure.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentpolicies.html
     */
    export interface DeploymentPoliciesProperty {
        /**
         * The component update policy for the configuration deployment. This policy defines when it's safe to deploy the configuration to devices.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentpolicies.html#cfn-greengrassv2-deployment-deploymentpolicies-componentupdatepolicy
         */
        readonly componentUpdatePolicy?: CfnDeployment.DeploymentComponentUpdatePolicyProperty | cdk.IResolvable;
        /**
         * The configuration validation policy for the configuration deployment. This policy defines how long each component has to validate its configure updates.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentpolicies.html#cfn-greengrassv2-deployment-deploymentpolicies-configurationvalidationpolicy
         */
        readonly configurationValidationPolicy?: CfnDeployment.DeploymentConfigurationValidationPolicyProperty | cdk.IResolvable;
        /**
         * The failure handling policy for the configuration deployment. This policy defines what to do if the deployment fails.
         *
         * Default: `ROLLBACK`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentpolicies.html#cfn-greengrassv2-deployment-deploymentpolicies-failurehandlingpolicy
         */
        readonly failureHandlingPolicy?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeploymentPoliciesProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentPoliciesProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeployment_DeploymentPoliciesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('componentUpdatePolicy', CfnDeployment_DeploymentComponentUpdatePolicyPropertyValidator)(properties.componentUpdatePolicy));
    errors.collect(cdk.propertyValidator('configurationValidationPolicy', CfnDeployment_DeploymentConfigurationValidationPolicyPropertyValidator)(properties.configurationValidationPolicy));
    errors.collect(cdk.propertyValidator('failureHandlingPolicy', cdk.validateString)(properties.failureHandlingPolicy));
    return errors.wrap('supplied properties not correct for "DeploymentPoliciesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.DeploymentPolicies` resource
 *
 * @param properties - the TypeScript properties of a `DeploymentPoliciesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.DeploymentPolicies` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentDeploymentPoliciesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeployment_DeploymentPoliciesPropertyValidator(properties).assertSuccess();
    return {
        ComponentUpdatePolicy: cfnDeploymentDeploymentComponentUpdatePolicyPropertyToCloudFormation(properties.componentUpdatePolicy),
        ConfigurationValidationPolicy: cfnDeploymentDeploymentConfigurationValidationPolicyPropertyToCloudFormation(properties.configurationValidationPolicy),
        FailureHandlingPolicy: cdk.stringToCloudFormation(properties.failureHandlingPolicy),
    };
}

// @ts-ignore TS6133
function CfnDeploymentDeploymentPoliciesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.DeploymentPoliciesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.DeploymentPoliciesProperty>();
    ret.addPropertyResult('componentUpdatePolicy', 'ComponentUpdatePolicy', properties.ComponentUpdatePolicy != null ? CfnDeploymentDeploymentComponentUpdatePolicyPropertyFromCloudFormation(properties.ComponentUpdatePolicy) : undefined);
    ret.addPropertyResult('configurationValidationPolicy', 'ConfigurationValidationPolicy', properties.ConfigurationValidationPolicy != null ? CfnDeploymentDeploymentConfigurationValidationPolicyPropertyFromCloudFormation(properties.ConfigurationValidationPolicy) : undefined);
    ret.addPropertyResult('failureHandlingPolicy', 'FailureHandlingPolicy', properties.FailureHandlingPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.FailureHandlingPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDeployment {
    /**
     * Contains a list of criteria that define when and how to cancel a configuration deployment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortconfig.html
     */
    export interface IoTJobAbortConfigProperty {
        /**
         * The list of criteria that define when and how to cancel the configuration deployment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortconfig.html#cfn-greengrassv2-deployment-iotjobabortconfig-criterialist
         */
        readonly criteriaList: Array<CfnDeployment.IoTJobAbortCriteriaProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `IoTJobAbortConfigProperty`
 *
 * @param properties - the TypeScript properties of a `IoTJobAbortConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeployment_IoTJobAbortConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('criteriaList', cdk.requiredValidator)(properties.criteriaList));
    errors.collect(cdk.propertyValidator('criteriaList', cdk.listValidator(CfnDeployment_IoTJobAbortCriteriaPropertyValidator))(properties.criteriaList));
    return errors.wrap('supplied properties not correct for "IoTJobAbortConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.IoTJobAbortConfig` resource
 *
 * @param properties - the TypeScript properties of a `IoTJobAbortConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.IoTJobAbortConfig` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentIoTJobAbortConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeployment_IoTJobAbortConfigPropertyValidator(properties).assertSuccess();
    return {
        CriteriaList: cdk.listMapper(cfnDeploymentIoTJobAbortCriteriaPropertyToCloudFormation)(properties.criteriaList),
    };
}

// @ts-ignore TS6133
function CfnDeploymentIoTJobAbortConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.IoTJobAbortConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.IoTJobAbortConfigProperty>();
    ret.addPropertyResult('criteriaList', 'CriteriaList', cfn_parse.FromCloudFormation.getArray(CfnDeploymentIoTJobAbortCriteriaPropertyFromCloudFormation)(properties.CriteriaList));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDeployment {
    /**
     * Contains criteria that define when and how to cancel a job.
     *
     * The deployment stops if the following conditions are true:
     *
     * - The number of things that receive the deployment exceeds the `minNumberOfExecutedThings` .
     * - The percentage of failures with type `failureType` exceeds the `thresholdPercentage` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortcriteria.html
     */
    export interface IoTJobAbortCriteriaProperty {
        /**
         * The action to perform when the criteria are met.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortcriteria.html#cfn-greengrassv2-deployment-iotjobabortcriteria-action
         */
        readonly action: string;
        /**
         * The type of job deployment failure that can cancel a job.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortcriteria.html#cfn-greengrassv2-deployment-iotjobabortcriteria-failuretype
         */
        readonly failureType: string;
        /**
         * The minimum number of things that receive the configuration before the job can cancel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortcriteria.html#cfn-greengrassv2-deployment-iotjobabortcriteria-minnumberofexecutedthings
         */
        readonly minNumberOfExecutedThings: number;
        /**
         * The minimum percentage of `failureType` failures that occur before the job can cancel.
         *
         * This parameter supports up to two digits after the decimal (for example, you can specify `10.9` or `10.99` , but not `10.999` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortcriteria.html#cfn-greengrassv2-deployment-iotjobabortcriteria-thresholdpercentage
         */
        readonly thresholdPercentage: number;
    }
}

/**
 * Determine whether the given properties match those of a `IoTJobAbortCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `IoTJobAbortCriteriaProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeployment_IoTJobAbortCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', cdk.validateString)(properties.action));
    errors.collect(cdk.propertyValidator('failureType', cdk.requiredValidator)(properties.failureType));
    errors.collect(cdk.propertyValidator('failureType', cdk.validateString)(properties.failureType));
    errors.collect(cdk.propertyValidator('minNumberOfExecutedThings', cdk.requiredValidator)(properties.minNumberOfExecutedThings));
    errors.collect(cdk.propertyValidator('minNumberOfExecutedThings', cdk.validateNumber)(properties.minNumberOfExecutedThings));
    errors.collect(cdk.propertyValidator('thresholdPercentage', cdk.requiredValidator)(properties.thresholdPercentage));
    errors.collect(cdk.propertyValidator('thresholdPercentage', cdk.validateNumber)(properties.thresholdPercentage));
    return errors.wrap('supplied properties not correct for "IoTJobAbortCriteriaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.IoTJobAbortCriteria` resource
 *
 * @param properties - the TypeScript properties of a `IoTJobAbortCriteriaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.IoTJobAbortCriteria` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentIoTJobAbortCriteriaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeployment_IoTJobAbortCriteriaPropertyValidator(properties).assertSuccess();
    return {
        Action: cdk.stringToCloudFormation(properties.action),
        FailureType: cdk.stringToCloudFormation(properties.failureType),
        MinNumberOfExecutedThings: cdk.numberToCloudFormation(properties.minNumberOfExecutedThings),
        ThresholdPercentage: cdk.numberToCloudFormation(properties.thresholdPercentage),
    };
}

// @ts-ignore TS6133
function CfnDeploymentIoTJobAbortCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.IoTJobAbortCriteriaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.IoTJobAbortCriteriaProperty>();
    ret.addPropertyResult('action', 'Action', cfn_parse.FromCloudFormation.getString(properties.Action));
    ret.addPropertyResult('failureType', 'FailureType', cfn_parse.FromCloudFormation.getString(properties.FailureType));
    ret.addPropertyResult('minNumberOfExecutedThings', 'MinNumberOfExecutedThings', cfn_parse.FromCloudFormation.getNumber(properties.MinNumberOfExecutedThings));
    ret.addPropertyResult('thresholdPercentage', 'ThresholdPercentage', cfn_parse.FromCloudFormation.getNumber(properties.ThresholdPercentage));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDeployment {
    /**
     * Contains information about the rollout configuration for a job. This configuration defines the rate at which the job deploys a configuration to a fleet of target devices.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexecutionsrolloutconfig.html
     */
    export interface IoTJobExecutionsRolloutConfigProperty {
        /**
         * The exponential rate to increase the job rollout rate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexecutionsrolloutconfig.html#cfn-greengrassv2-deployment-iotjobexecutionsrolloutconfig-exponentialrate
         */
        readonly exponentialRate?: CfnDeployment.IoTJobExponentialRolloutRateProperty | cdk.IResolvable;
        /**
         * The maximum number of devices that receive a pending job notification, per minute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexecutionsrolloutconfig.html#cfn-greengrassv2-deployment-iotjobexecutionsrolloutconfig-maximumperminute
         */
        readonly maximumPerMinute?: number;
    }
}

/**
 * Determine whether the given properties match those of a `IoTJobExecutionsRolloutConfigProperty`
 *
 * @param properties - the TypeScript properties of a `IoTJobExecutionsRolloutConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeployment_IoTJobExecutionsRolloutConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('exponentialRate', CfnDeployment_IoTJobExponentialRolloutRatePropertyValidator)(properties.exponentialRate));
    errors.collect(cdk.propertyValidator('maximumPerMinute', cdk.validateNumber)(properties.maximumPerMinute));
    return errors.wrap('supplied properties not correct for "IoTJobExecutionsRolloutConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.IoTJobExecutionsRolloutConfig` resource
 *
 * @param properties - the TypeScript properties of a `IoTJobExecutionsRolloutConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.IoTJobExecutionsRolloutConfig` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentIoTJobExecutionsRolloutConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeployment_IoTJobExecutionsRolloutConfigPropertyValidator(properties).assertSuccess();
    return {
        ExponentialRate: cfnDeploymentIoTJobExponentialRolloutRatePropertyToCloudFormation(properties.exponentialRate),
        MaximumPerMinute: cdk.numberToCloudFormation(properties.maximumPerMinute),
    };
}

// @ts-ignore TS6133
function CfnDeploymentIoTJobExecutionsRolloutConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.IoTJobExecutionsRolloutConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.IoTJobExecutionsRolloutConfigProperty>();
    ret.addPropertyResult('exponentialRate', 'ExponentialRate', properties.ExponentialRate != null ? CfnDeploymentIoTJobExponentialRolloutRatePropertyFromCloudFormation(properties.ExponentialRate) : undefined);
    ret.addPropertyResult('maximumPerMinute', 'MaximumPerMinute', properties.MaximumPerMinute != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumPerMinute) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDeployment {
    /**
     * Contains information about an exponential rollout rate for a configuration deployment job.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexponentialrolloutrate.html
     */
    export interface IoTJobExponentialRolloutRateProperty {
        /**
         * The minimum number of devices that receive a pending job notification, per minute, when the job starts. This parameter defines the initial rollout rate of the job.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexponentialrolloutrate.html#cfn-greengrassv2-deployment-iotjobexponentialrolloutrate-baserateperminute
         */
        readonly baseRatePerMinute: number;
        /**
         * The exponential factor to increase the rollout rate for the job.
         *
         * This parameter supports up to one digit after the decimal (for example, you can specify `1.5` , but not `1.55` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexponentialrolloutrate.html#cfn-greengrassv2-deployment-iotjobexponentialrolloutrate-incrementfactor
         */
        readonly incrementFactor: number;
        /**
         * The criteria to increase the rollout rate for the job.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexponentialrolloutrate.html#cfn-greengrassv2-deployment-iotjobexponentialrolloutrate-rateincreasecriteria
         */
        readonly rateIncreaseCriteria: any | cdk.IResolvable | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `IoTJobExponentialRolloutRateProperty`
 *
 * @param properties - the TypeScript properties of a `IoTJobExponentialRolloutRateProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeployment_IoTJobExponentialRolloutRatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('baseRatePerMinute', cdk.requiredValidator)(properties.baseRatePerMinute));
    errors.collect(cdk.propertyValidator('baseRatePerMinute', cdk.validateNumber)(properties.baseRatePerMinute));
    errors.collect(cdk.propertyValidator('incrementFactor', cdk.requiredValidator)(properties.incrementFactor));
    errors.collect(cdk.propertyValidator('incrementFactor', cdk.validateNumber)(properties.incrementFactor));
    errors.collect(cdk.propertyValidator('rateIncreaseCriteria', cdk.requiredValidator)(properties.rateIncreaseCriteria));
    errors.collect(cdk.propertyValidator('rateIncreaseCriteria', cdk.validateObject)(properties.rateIncreaseCriteria));
    return errors.wrap('supplied properties not correct for "IoTJobExponentialRolloutRateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.IoTJobExponentialRolloutRate` resource
 *
 * @param properties - the TypeScript properties of a `IoTJobExponentialRolloutRateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.IoTJobExponentialRolloutRate` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentIoTJobExponentialRolloutRatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeployment_IoTJobExponentialRolloutRatePropertyValidator(properties).assertSuccess();
    return {
        BaseRatePerMinute: cdk.numberToCloudFormation(properties.baseRatePerMinute),
        IncrementFactor: cdk.numberToCloudFormation(properties.incrementFactor),
        RateIncreaseCriteria: cdk.objectToCloudFormation(properties.rateIncreaseCriteria),
    };
}

// @ts-ignore TS6133
function CfnDeploymentIoTJobExponentialRolloutRatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.IoTJobExponentialRolloutRateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.IoTJobExponentialRolloutRateProperty>();
    ret.addPropertyResult('baseRatePerMinute', 'BaseRatePerMinute', cfn_parse.FromCloudFormation.getNumber(properties.BaseRatePerMinute));
    ret.addPropertyResult('incrementFactor', 'IncrementFactor', cfn_parse.FromCloudFormation.getNumber(properties.IncrementFactor));
    ret.addPropertyResult('rateIncreaseCriteria', 'RateIncreaseCriteria', cfn_parse.FromCloudFormation.getAny(properties.RateIncreaseCriteria));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDeployment {
    /**
     * Contains information about the timeout configuration for a job.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobtimeoutconfig.html
     */
    export interface IoTJobTimeoutConfigProperty {
        /**
         * The amount of time, in minutes, that devices have to complete the job. The timer starts when the job status is set to `IN_PROGRESS` . If the job status doesn't change to a terminal state before the time expires, then the job status is set to `TIMED_OUT` .
         *
         * The timeout interval must be between 1 minute and 7 days (10080 minutes).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobtimeoutconfig.html#cfn-greengrassv2-deployment-iotjobtimeoutconfig-inprogresstimeoutinminutes
         */
        readonly inProgressTimeoutInMinutes?: number;
    }
}

/**
 * Determine whether the given properties match those of a `IoTJobTimeoutConfigProperty`
 *
 * @param properties - the TypeScript properties of a `IoTJobTimeoutConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeployment_IoTJobTimeoutConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('inProgressTimeoutInMinutes', cdk.validateNumber)(properties.inProgressTimeoutInMinutes));
    return errors.wrap('supplied properties not correct for "IoTJobTimeoutConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.IoTJobTimeoutConfig` resource
 *
 * @param properties - the TypeScript properties of a `IoTJobTimeoutConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.IoTJobTimeoutConfig` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentIoTJobTimeoutConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeployment_IoTJobTimeoutConfigPropertyValidator(properties).assertSuccess();
    return {
        InProgressTimeoutInMinutes: cdk.numberToCloudFormation(properties.inProgressTimeoutInMinutes),
    };
}

// @ts-ignore TS6133
function CfnDeploymentIoTJobTimeoutConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.IoTJobTimeoutConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.IoTJobTimeoutConfigProperty>();
    ret.addPropertyResult('inProgressTimeoutInMinutes', 'InProgressTimeoutInMinutes', properties.InProgressTimeoutInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.InProgressTimeoutInMinutes) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDeployment {
    /**
     * Contains information about system resource limits that the  software applies to a component's processes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-systemresourcelimits.html
     */
    export interface SystemResourceLimitsProperty {
        /**
         * The maximum amount of CPU time that a component's processes can use on the core device. A core device's total CPU time is equivalent to the device's number of CPU cores. For example, on a core device with 4 CPU cores, you can set this value to 2 to limit the component's processes to 50 percent usage of each CPU core. On a device with 1 CPU core, you can set this value to 0.25 to limit the component's processes to 25 percent usage of the CPU. If you set this value to a number greater than the number of CPU cores, the AWS IoT Greengrass Core software doesn't limit the component's CPU usage.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-systemresourcelimits.html#cfn-greengrassv2-deployment-systemresourcelimits-cpus
         */
        readonly cpus?: number;
        /**
         * The maximum amount of RAM, expressed in kilobytes, that a component's processes can use on the core device. For more information, see [Configure system resource limits for components](https://docs.aws.amazon.com/greengrass/v2/developerguide/configure-greengrass-core-v2.html#configure-component-system-resource-limits) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-systemresourcelimits.html#cfn-greengrassv2-deployment-systemresourcelimits-memory
         */
        readonly memory?: number;
    }
}

/**
 * Determine whether the given properties match those of a `SystemResourceLimitsProperty`
 *
 * @param properties - the TypeScript properties of a `SystemResourceLimitsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeployment_SystemResourceLimitsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cpus', cdk.validateNumber)(properties.cpus));
    errors.collect(cdk.propertyValidator('memory', cdk.validateNumber)(properties.memory));
    return errors.wrap('supplied properties not correct for "SystemResourceLimitsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.SystemResourceLimits` resource
 *
 * @param properties - the TypeScript properties of a `SystemResourceLimitsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GreengrassV2::Deployment.SystemResourceLimits` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentSystemResourceLimitsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeployment_SystemResourceLimitsPropertyValidator(properties).assertSuccess();
    return {
        Cpus: cdk.numberToCloudFormation(properties.cpus),
        Memory: cdk.numberToCloudFormation(properties.memory),
    };
}

// @ts-ignore TS6133
function CfnDeploymentSystemResourceLimitsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.SystemResourceLimitsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.SystemResourceLimitsProperty>();
    ret.addPropertyResult('cpus', 'Cpus', properties.Cpus != null ? cfn_parse.FromCloudFormation.getNumber(properties.Cpus) : undefined);
    ret.addPropertyResult('memory', 'Memory', properties.Memory != null ? cfn_parse.FromCloudFormation.getNumber(properties.Memory) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
