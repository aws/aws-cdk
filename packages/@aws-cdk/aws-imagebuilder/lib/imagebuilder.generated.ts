// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:29.410Z","fingerprint":"QQMay7nwg53YdTGp59Hjo0p5n88zpdYXBcHRJHgsi1g="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnComponent`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html
 */
export interface CfnComponentProps {

    /**
     * The name of the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-name
     */
    readonly name: string;

    /**
     * The operating system platform of the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-platform
     */
    readonly platform: string;

    /**
     * The component version. For example, `1.0.0` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-version
     */
    readonly version: string;

    /**
     * The change description of the component. Describes what change has been made in this version, or what makes this version different from other versions of this component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-changedescription
     */
    readonly changeDescription?: string;

    /**
     * Component `data` contains inline YAML document content for the component. Alternatively, you can specify the `uri` of a YAML document file stored in Amazon S3. However, you cannot specify both properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-data
     */
    readonly data?: string;

    /**
     * Describes the contents of the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-description
     */
    readonly description?: string;

    /**
     * The ID of the KMS key that is used to encrypt this component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * The operating system (OS) version supported by the component. If the OS information is available, a prefix match is performed against the base image OS version during image recipe creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-supportedosversions
     */
    readonly supportedOsVersions?: string[];

    /**
     * The tags that apply to the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-tags
     */
    readonly tags?: { [key: string]: (string) };

    /**
     * The `uri` of a YAML component document file. This must be an S3 URL ( `s3://bucket/key` ), and the requester must have permission to access the S3 bucket it points to. If you use Amazon S3, you can specify component content up to your service quota.
     *
     * Alternatively, you can specify the YAML document inline, using the component `data` property. You cannot specify both properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-uri
     */
    readonly uri?: string;
}

/**
 * Determine whether the given properties match those of a `CfnComponentProps`
 *
 * @param properties - the TypeScript properties of a `CfnComponentProps`
 *
 * @returns the result of the validation.
 */
function CfnComponentPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('changeDescription', cdk.validateString)(properties.changeDescription));
    errors.collect(cdk.propertyValidator('data', cdk.validateString)(properties.data));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('platform', cdk.requiredValidator)(properties.platform));
    errors.collect(cdk.propertyValidator('platform', cdk.validateString)(properties.platform));
    errors.collect(cdk.propertyValidator('supportedOsVersions', cdk.listValidator(cdk.validateString))(properties.supportedOsVersions));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('uri', cdk.validateString)(properties.uri));
    errors.collect(cdk.propertyValidator('version', cdk.requiredValidator)(properties.version));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "CfnComponentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::Component` resource
 *
 * @param properties - the TypeScript properties of a `CfnComponentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::Component` resource.
 */
// @ts-ignore TS6133
function cfnComponentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Platform: cdk.stringToCloudFormation(properties.platform),
        Version: cdk.stringToCloudFormation(properties.version),
        ChangeDescription: cdk.stringToCloudFormation(properties.changeDescription),
        Data: cdk.stringToCloudFormation(properties.data),
        Description: cdk.stringToCloudFormation(properties.description),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        SupportedOsVersions: cdk.listMapper(cdk.stringToCloudFormation)(properties.supportedOsVersions),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
        Uri: cdk.stringToCloudFormation(properties.uri),
    };
}

// @ts-ignore TS6133
function CfnComponentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('platform', 'Platform', cfn_parse.FromCloudFormation.getString(properties.Platform));
    ret.addPropertyResult('version', 'Version', cfn_parse.FromCloudFormation.getString(properties.Version));
    ret.addPropertyResult('changeDescription', 'ChangeDescription', properties.ChangeDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ChangeDescription) : undefined);
    ret.addPropertyResult('data', 'Data', properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('supportedOsVersions', 'SupportedOsVersions', properties.SupportedOsVersions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SupportedOsVersions) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addPropertyResult('uri', 'Uri', properties.Uri != null ? cfn_parse.FromCloudFormation.getString(properties.Uri) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ImageBuilder::Component`
 *
 * Creates a new component that can be used to build, validate, test, and assess your image. The component is based on a YAML document that you specify using exactly one of the following methods:
 *
 * - Inline, using the `data` property in the request body.
 * - A URL that points to a YAML document file stored in Amazon S3, using the `uri` property in the request body.
 *
 * @cloudformationResource AWS::ImageBuilder::Component
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html
 */
export class CfnComponent extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ImageBuilder::Component";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnComponent {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnComponentPropsFromCloudFormation(resourceProperties);
        const ret = new CfnComponent(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the Amazon Resource Name (ARN) of the component. The following pattern is applied: `^arn:aws[^:]*:imagebuilder:[^:]+:(?:\d{12}|aws):(?:image-recipe|infrastructure-configuration|distribution-configuration|component|image|image-pipeline)/[a-z0-9-_]+(?:/(?:(?:x|\d+)\.(?:x|\d+)\.(?:x|\d+))(?:/\d+)?)?$` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Returns the encryption status of the component. For example `true` or `false` .
     * @cloudformationAttribute Encrypted
     */
    public readonly attrEncrypted: cdk.IResolvable;

    /**
     * Returns the name of the component.
     * @cloudformationAttribute Name
     */
    public readonly attrName: string;

    /**
     * Image Builder determines the component type based on the phases that are defined in the component document. If there is only one phase, and its name is "test", then the type is `TEST` . For all other components, the type is `BUILD` .
     * @cloudformationAttribute Type
     */
    public readonly attrType: string;

    /**
     * The name of the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-name
     */
    public name: string;

    /**
     * The operating system platform of the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-platform
     */
    public platform: string;

    /**
     * The component version. For example, `1.0.0` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-version
     */
    public version: string;

    /**
     * The change description of the component. Describes what change has been made in this version, or what makes this version different from other versions of this component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-changedescription
     */
    public changeDescription: string | undefined;

    /**
     * Component `data` contains inline YAML document content for the component. Alternatively, you can specify the `uri` of a YAML document file stored in Amazon S3. However, you cannot specify both properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-data
     */
    public data: string | undefined;

    /**
     * Describes the contents of the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-description
     */
    public description: string | undefined;

    /**
     * The ID of the KMS key that is used to encrypt this component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-kmskeyid
     */
    public kmsKeyId: string | undefined;

    /**
     * The operating system (OS) version supported by the component. If the OS information is available, a prefix match is performed against the base image OS version during image recipe creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-supportedosversions
     */
    public supportedOsVersions: string[] | undefined;

    /**
     * The tags that apply to the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The `uri` of a YAML component document file. This must be an S3 URL ( `s3://bucket/key` ), and the requester must have permission to access the S3 bucket it points to. If you use Amazon S3, you can specify component content up to your service quota.
     *
     * Alternatively, you can specify the YAML document inline, using the component `data` property. You cannot specify both properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-uri
     */
    public uri: string | undefined;

    /**
     * Create a new `AWS::ImageBuilder::Component`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnComponentProps) {
        super(scope, id, { type: CfnComponent.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'platform', this);
        cdk.requireProperty(props, 'version', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrEncrypted = this.getAtt('Encrypted', cdk.ResolutionTypeHint.STRING);
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));
        this.attrType = cdk.Token.asString(this.getAtt('Type', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.platform = props.platform;
        this.version = props.version;
        this.changeDescription = props.changeDescription;
        this.data = props.data;
        this.description = props.description;
        this.kmsKeyId = props.kmsKeyId;
        this.supportedOsVersions = props.supportedOsVersions;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ImageBuilder::Component", props.tags, { tagPropertyName: 'tags' });
        this.uri = props.uri;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnComponent.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            platform: this.platform,
            version: this.version,
            changeDescription: this.changeDescription,
            data: this.data,
            description: this.description,
            kmsKeyId: this.kmsKeyId,
            supportedOsVersions: this.supportedOsVersions,
            tags: this.tags.renderTags(),
            uri: this.uri,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnComponentPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnContainerRecipe`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html
 */
export interface CfnContainerRecipeProps {

    /**
     * Build and test components that are included in the container recipe. Recipes require a minimum of one build component, and can have a maximum of 20 build and test components in any combination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-components
     */
    readonly components: Array<CfnContainerRecipe.ComponentConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies the type of container, such as Docker.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-containertype
     */
    readonly containerType: string;

    /**
     * The name of the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-name
     */
    readonly name: string;

    /**
     * The base image for the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-parentimage
     */
    readonly parentImage: string;

    /**
     * The destination repository for the container image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-targetrepository
     */
    readonly targetRepository: CfnContainerRecipe.TargetContainerRepositoryProperty | cdk.IResolvable;

    /**
     * The semantic version of the container recipe.
     *
     * > The semantic version has four nodes: <major>.<minor>.<patch>/<build>. You can assign values for the first three, and can filter on all of them.
     * >
     * > *Assignment:* For the first three nodes you can assign any positive integer value, including zero, with an upper limit of 2^30-1, or 1073741823 for each node. Image Builder automatically assigns the build number to the fourth node.
     * >
     * > *Patterns:* You can use any numeric pattern that adheres to the assignment requirements for the nodes that you can assign. For example, you might choose a software version pattern, such as 1.0.0, or a date, such as 2021.01.01.
     * >
     * > *Filtering:* With semantic versioning, you have the flexibility to use wildcards (x) to specify the most recent versions or nodes when selecting the base image or components for your recipe. When you use a wildcard in any node, all nodes to the right of the first wildcard must also be wildcards.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-version
     */
    readonly version: string;

    /**
     * The description of the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-description
     */
    readonly description?: string;

    /**
     * Dockerfiles are text documents that are used to build Docker containers, and ensure that they contain all of the elements required by the application running inside. The template data consists of contextual variables where Image Builder places build information or scripts, based on your container image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-dockerfiletemplatedata
     */
    readonly dockerfileTemplateData?: string;

    /**
     * The S3 URI for the Dockerfile that will be used to build your container image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-dockerfiletemplateuri
     */
    readonly dockerfileTemplateUri?: string;

    /**
     * Specifies the operating system version for the base image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-imageosversionoverride
     */
    readonly imageOsVersionOverride?: string;

    /**
     * A group of options that can be used to configure an instance for building and testing container images.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-instanceconfiguration
     */
    readonly instanceConfiguration?: CfnContainerRecipe.InstanceConfigurationProperty | cdk.IResolvable;

    /**
     * Identifies which KMS key is used to encrypt the container image for distribution to the target Region.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * Specifies the operating system platform when you use a custom base image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-platformoverride
     */
    readonly platformOverride?: string;

    /**
     * Tags that are attached to the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-tags
     */
    readonly tags?: { [key: string]: (string) };

    /**
     * The working directory for use during build and test workflows.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-workingdirectory
     */
    readonly workingDirectory?: string;
}

/**
 * Determine whether the given properties match those of a `CfnContainerRecipeProps`
 *
 * @param properties - the TypeScript properties of a `CfnContainerRecipeProps`
 *
 * @returns the result of the validation.
 */
function CfnContainerRecipePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('components', cdk.requiredValidator)(properties.components));
    errors.collect(cdk.propertyValidator('components', cdk.listValidator(CfnContainerRecipe_ComponentConfigurationPropertyValidator))(properties.components));
    errors.collect(cdk.propertyValidator('containerType', cdk.requiredValidator)(properties.containerType));
    errors.collect(cdk.propertyValidator('containerType', cdk.validateString)(properties.containerType));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('dockerfileTemplateData', cdk.validateString)(properties.dockerfileTemplateData));
    errors.collect(cdk.propertyValidator('dockerfileTemplateUri', cdk.validateString)(properties.dockerfileTemplateUri));
    errors.collect(cdk.propertyValidator('imageOsVersionOverride', cdk.validateString)(properties.imageOsVersionOverride));
    errors.collect(cdk.propertyValidator('instanceConfiguration', CfnContainerRecipe_InstanceConfigurationPropertyValidator)(properties.instanceConfiguration));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('parentImage', cdk.requiredValidator)(properties.parentImage));
    errors.collect(cdk.propertyValidator('parentImage', cdk.validateString)(properties.parentImage));
    errors.collect(cdk.propertyValidator('platformOverride', cdk.validateString)(properties.platformOverride));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('targetRepository', cdk.requiredValidator)(properties.targetRepository));
    errors.collect(cdk.propertyValidator('targetRepository', CfnContainerRecipe_TargetContainerRepositoryPropertyValidator)(properties.targetRepository));
    errors.collect(cdk.propertyValidator('version', cdk.requiredValidator)(properties.version));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    errors.collect(cdk.propertyValidator('workingDirectory', cdk.validateString)(properties.workingDirectory));
    return errors.wrap('supplied properties not correct for "CfnContainerRecipeProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ContainerRecipe` resource
 *
 * @param properties - the TypeScript properties of a `CfnContainerRecipeProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ContainerRecipe` resource.
 */
// @ts-ignore TS6133
function cfnContainerRecipePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContainerRecipePropsValidator(properties).assertSuccess();
    return {
        Components: cdk.listMapper(cfnContainerRecipeComponentConfigurationPropertyToCloudFormation)(properties.components),
        ContainerType: cdk.stringToCloudFormation(properties.containerType),
        Name: cdk.stringToCloudFormation(properties.name),
        ParentImage: cdk.stringToCloudFormation(properties.parentImage),
        TargetRepository: cfnContainerRecipeTargetContainerRepositoryPropertyToCloudFormation(properties.targetRepository),
        Version: cdk.stringToCloudFormation(properties.version),
        Description: cdk.stringToCloudFormation(properties.description),
        DockerfileTemplateData: cdk.stringToCloudFormation(properties.dockerfileTemplateData),
        DockerfileTemplateUri: cdk.stringToCloudFormation(properties.dockerfileTemplateUri),
        ImageOsVersionOverride: cdk.stringToCloudFormation(properties.imageOsVersionOverride),
        InstanceConfiguration: cfnContainerRecipeInstanceConfigurationPropertyToCloudFormation(properties.instanceConfiguration),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        PlatformOverride: cdk.stringToCloudFormation(properties.platformOverride),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
        WorkingDirectory: cdk.stringToCloudFormation(properties.workingDirectory),
    };
}

// @ts-ignore TS6133
function CfnContainerRecipePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerRecipeProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerRecipeProps>();
    ret.addPropertyResult('components', 'Components', cfn_parse.FromCloudFormation.getArray(CfnContainerRecipeComponentConfigurationPropertyFromCloudFormation)(properties.Components));
    ret.addPropertyResult('containerType', 'ContainerType', cfn_parse.FromCloudFormation.getString(properties.ContainerType));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('parentImage', 'ParentImage', cfn_parse.FromCloudFormation.getString(properties.ParentImage));
    ret.addPropertyResult('targetRepository', 'TargetRepository', CfnContainerRecipeTargetContainerRepositoryPropertyFromCloudFormation(properties.TargetRepository));
    ret.addPropertyResult('version', 'Version', cfn_parse.FromCloudFormation.getString(properties.Version));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('dockerfileTemplateData', 'DockerfileTemplateData', properties.DockerfileTemplateData != null ? cfn_parse.FromCloudFormation.getString(properties.DockerfileTemplateData) : undefined);
    ret.addPropertyResult('dockerfileTemplateUri', 'DockerfileTemplateUri', properties.DockerfileTemplateUri != null ? cfn_parse.FromCloudFormation.getString(properties.DockerfileTemplateUri) : undefined);
    ret.addPropertyResult('imageOsVersionOverride', 'ImageOsVersionOverride', properties.ImageOsVersionOverride != null ? cfn_parse.FromCloudFormation.getString(properties.ImageOsVersionOverride) : undefined);
    ret.addPropertyResult('instanceConfiguration', 'InstanceConfiguration', properties.InstanceConfiguration != null ? CfnContainerRecipeInstanceConfigurationPropertyFromCloudFormation(properties.InstanceConfiguration) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('platformOverride', 'PlatformOverride', properties.PlatformOverride != null ? cfn_parse.FromCloudFormation.getString(properties.PlatformOverride) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addPropertyResult('workingDirectory', 'WorkingDirectory', properties.WorkingDirectory != null ? cfn_parse.FromCloudFormation.getString(properties.WorkingDirectory) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ImageBuilder::ContainerRecipe`
 *
 * Creates a new container recipe. Container recipes define how images are configured, tested, and assessed.
 *
 * @cloudformationResource AWS::ImageBuilder::ContainerRecipe
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html
 */
export class CfnContainerRecipe extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ImageBuilder::ContainerRecipe";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContainerRecipe {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnContainerRecipePropsFromCloudFormation(resourceProperties);
        const ret = new CfnContainerRecipe(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the Amazon Resource Name (ARN) of the container recipe. For example, `arn:aws:imagebuilder:us-east-1:123456789012:container-recipe/mybasicrecipe/2020.12.17` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Returns the name of the container recipe.
     * @cloudformationAttribute Name
     */
    public readonly attrName: string;

    /**
     * Build and test components that are included in the container recipe. Recipes require a minimum of one build component, and can have a maximum of 20 build and test components in any combination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-components
     */
    public components: Array<CfnContainerRecipe.ComponentConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies the type of container, such as Docker.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-containertype
     */
    public containerType: string;

    /**
     * The name of the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-name
     */
    public name: string;

    /**
     * The base image for the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-parentimage
     */
    public parentImage: string;

    /**
     * The destination repository for the container image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-targetrepository
     */
    public targetRepository: CfnContainerRecipe.TargetContainerRepositoryProperty | cdk.IResolvable;

    /**
     * The semantic version of the container recipe.
     *
     * > The semantic version has four nodes: <major>.<minor>.<patch>/<build>. You can assign values for the first three, and can filter on all of them.
     * >
     * > *Assignment:* For the first three nodes you can assign any positive integer value, including zero, with an upper limit of 2^30-1, or 1073741823 for each node. Image Builder automatically assigns the build number to the fourth node.
     * >
     * > *Patterns:* You can use any numeric pattern that adheres to the assignment requirements for the nodes that you can assign. For example, you might choose a software version pattern, such as 1.0.0, or a date, such as 2021.01.01.
     * >
     * > *Filtering:* With semantic versioning, you have the flexibility to use wildcards (x) to specify the most recent versions or nodes when selecting the base image or components for your recipe. When you use a wildcard in any node, all nodes to the right of the first wildcard must also be wildcards.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-version
     */
    public version: string;

    /**
     * The description of the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-description
     */
    public description: string | undefined;

    /**
     * Dockerfiles are text documents that are used to build Docker containers, and ensure that they contain all of the elements required by the application running inside. The template data consists of contextual variables where Image Builder places build information or scripts, based on your container image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-dockerfiletemplatedata
     */
    public dockerfileTemplateData: string | undefined;

    /**
     * The S3 URI for the Dockerfile that will be used to build your container image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-dockerfiletemplateuri
     */
    public dockerfileTemplateUri: string | undefined;

    /**
     * Specifies the operating system version for the base image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-imageosversionoverride
     */
    public imageOsVersionOverride: string | undefined;

    /**
     * A group of options that can be used to configure an instance for building and testing container images.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-instanceconfiguration
     */
    public instanceConfiguration: CfnContainerRecipe.InstanceConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Identifies which KMS key is used to encrypt the container image for distribution to the target Region.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-kmskeyid
     */
    public kmsKeyId: string | undefined;

    /**
     * Specifies the operating system platform when you use a custom base image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-platformoverride
     */
    public platformOverride: string | undefined;

    /**
     * Tags that are attached to the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The working directory for use during build and test workflows.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-workingdirectory
     */
    public workingDirectory: string | undefined;

    /**
     * Create a new `AWS::ImageBuilder::ContainerRecipe`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnContainerRecipeProps) {
        super(scope, id, { type: CfnContainerRecipe.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'components', this);
        cdk.requireProperty(props, 'containerType', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'parentImage', this);
        cdk.requireProperty(props, 'targetRepository', this);
        cdk.requireProperty(props, 'version', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));

        this.components = props.components;
        this.containerType = props.containerType;
        this.name = props.name;
        this.parentImage = props.parentImage;
        this.targetRepository = props.targetRepository;
        this.version = props.version;
        this.description = props.description;
        this.dockerfileTemplateData = props.dockerfileTemplateData;
        this.dockerfileTemplateUri = props.dockerfileTemplateUri;
        this.imageOsVersionOverride = props.imageOsVersionOverride;
        this.instanceConfiguration = props.instanceConfiguration;
        this.kmsKeyId = props.kmsKeyId;
        this.platformOverride = props.platformOverride;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ImageBuilder::ContainerRecipe", props.tags, { tagPropertyName: 'tags' });
        this.workingDirectory = props.workingDirectory;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnContainerRecipe.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            components: this.components,
            containerType: this.containerType,
            name: this.name,
            parentImage: this.parentImage,
            targetRepository: this.targetRepository,
            version: this.version,
            description: this.description,
            dockerfileTemplateData: this.dockerfileTemplateData,
            dockerfileTemplateUri: this.dockerfileTemplateUri,
            imageOsVersionOverride: this.imageOsVersionOverride,
            instanceConfiguration: this.instanceConfiguration,
            kmsKeyId: this.kmsKeyId,
            platformOverride: this.platformOverride,
            tags: this.tags.renderTags(),
            workingDirectory: this.workingDirectory,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnContainerRecipePropsToCloudFormation(props);
    }
}

export namespace CfnContainerRecipe {
    /**
     * Configuration details of the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentconfiguration.html
     */
    export interface ComponentConfigurationProperty {
        /**
         * The Amazon Resource Name (ARN) of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentconfiguration.html#cfn-imagebuilder-containerrecipe-componentconfiguration-componentarn
         */
        readonly componentArn?: string;
        /**
         * A group of parameter settings that Image Builder uses to configure the component for a specific recipe.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentconfiguration.html#cfn-imagebuilder-containerrecipe-componentconfiguration-parameters
         */
        readonly parameters?: Array<CfnContainerRecipe.ComponentParameterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnContainerRecipe_ComponentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('componentArn', cdk.validateString)(properties.componentArn));
    errors.collect(cdk.propertyValidator('parameters', cdk.listValidator(CfnContainerRecipe_ComponentParameterPropertyValidator))(properties.parameters));
    return errors.wrap('supplied properties not correct for "ComponentConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ContainerRecipe.ComponentConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ComponentConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ContainerRecipe.ComponentConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnContainerRecipeComponentConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContainerRecipe_ComponentConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ComponentArn: cdk.stringToCloudFormation(properties.componentArn),
        Parameters: cdk.listMapper(cfnContainerRecipeComponentParameterPropertyToCloudFormation)(properties.parameters),
    };
}

// @ts-ignore TS6133
function CfnContainerRecipeComponentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerRecipe.ComponentConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerRecipe.ComponentConfigurationProperty>();
    ret.addPropertyResult('componentArn', 'ComponentArn', properties.ComponentArn != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentArn) : undefined);
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? cfn_parse.FromCloudFormation.getArray(CfnContainerRecipeComponentParameterPropertyFromCloudFormation)(properties.Parameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContainerRecipe {
    /**
     * Contains a key/value pair that sets the named component parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentparameter.html
     */
    export interface ComponentParameterProperty {
        /**
         * The name of the component parameter to set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentparameter.html#cfn-imagebuilder-containerrecipe-componentparameter-name
         */
        readonly name: string;
        /**
         * Sets the value for the named component parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentparameter.html#cfn-imagebuilder-containerrecipe-componentparameter-value
         */
        readonly value: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ComponentParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnContainerRecipe_ComponentParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.listValidator(cdk.validateString))(properties.value));
    return errors.wrap('supplied properties not correct for "ComponentParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ContainerRecipe.ComponentParameter` resource
 *
 * @param properties - the TypeScript properties of a `ComponentParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ContainerRecipe.ComponentParameter` resource.
 */
// @ts-ignore TS6133
function cfnContainerRecipeComponentParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContainerRecipe_ComponentParameterPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cdk.listMapper(cdk.stringToCloudFormation)(properties.value),
    };
}

// @ts-ignore TS6133
function CfnContainerRecipeComponentParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerRecipe.ComponentParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerRecipe.ComponentParameterProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getStringArray(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContainerRecipe {
    /**
     * Amazon EBS-specific block device mapping specifications.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html
     */
    export interface EbsInstanceBlockDeviceSpecificationProperty {
        /**
         * Use to configure delete on termination of the associated device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-deleteontermination
         */
        readonly deleteOnTermination?: boolean | cdk.IResolvable;
        /**
         * Use to configure device encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-encrypted
         */
        readonly encrypted?: boolean | cdk.IResolvable;
        /**
         * Use to configure device IOPS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-iops
         */
        readonly iops?: number;
        /**
         * Use to configure the KMS key to use when encrypting the device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-kmskeyid
         */
        readonly kmsKeyId?: string;
        /**
         * The snapshot that defines the device contents.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-snapshotid
         */
        readonly snapshotId?: string;
        /**
         * *For GP3 volumes only* – The throughput in MiB/s that the volume supports.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-throughput
         */
        readonly throughput?: number;
        /**
         * Use to override the device's volume size.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-volumesize
         */
        readonly volumeSize?: number;
        /**
         * Use to override the device's volume type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-volumetype
         */
        readonly volumeType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EbsInstanceBlockDeviceSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `EbsInstanceBlockDeviceSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnContainerRecipe_EbsInstanceBlockDeviceSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deleteOnTermination', cdk.validateBoolean)(properties.deleteOnTermination));
    errors.collect(cdk.propertyValidator('encrypted', cdk.validateBoolean)(properties.encrypted));
    errors.collect(cdk.propertyValidator('iops', cdk.validateNumber)(properties.iops));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('snapshotId', cdk.validateString)(properties.snapshotId));
    errors.collect(cdk.propertyValidator('throughput', cdk.validateNumber)(properties.throughput));
    errors.collect(cdk.propertyValidator('volumeSize', cdk.validateNumber)(properties.volumeSize));
    errors.collect(cdk.propertyValidator('volumeType', cdk.validateString)(properties.volumeType));
    return errors.wrap('supplied properties not correct for "EbsInstanceBlockDeviceSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ContainerRecipe.EbsInstanceBlockDeviceSpecification` resource
 *
 * @param properties - the TypeScript properties of a `EbsInstanceBlockDeviceSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ContainerRecipe.EbsInstanceBlockDeviceSpecification` resource.
 */
// @ts-ignore TS6133
function cfnContainerRecipeEbsInstanceBlockDeviceSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContainerRecipe_EbsInstanceBlockDeviceSpecificationPropertyValidator(properties).assertSuccess();
    return {
        DeleteOnTermination: cdk.booleanToCloudFormation(properties.deleteOnTermination),
        Encrypted: cdk.booleanToCloudFormation(properties.encrypted),
        Iops: cdk.numberToCloudFormation(properties.iops),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        SnapshotId: cdk.stringToCloudFormation(properties.snapshotId),
        Throughput: cdk.numberToCloudFormation(properties.throughput),
        VolumeSize: cdk.numberToCloudFormation(properties.volumeSize),
        VolumeType: cdk.stringToCloudFormation(properties.volumeType),
    };
}

// @ts-ignore TS6133
function CfnContainerRecipeEbsInstanceBlockDeviceSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerRecipe.EbsInstanceBlockDeviceSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerRecipe.EbsInstanceBlockDeviceSpecificationProperty>();
    ret.addPropertyResult('deleteOnTermination', 'DeleteOnTermination', properties.DeleteOnTermination != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteOnTermination) : undefined);
    ret.addPropertyResult('encrypted', 'Encrypted', properties.Encrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Encrypted) : undefined);
    ret.addPropertyResult('iops', 'Iops', properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('snapshotId', 'SnapshotId', properties.SnapshotId != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotId) : undefined);
    ret.addPropertyResult('throughput', 'Throughput', properties.Throughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.Throughput) : undefined);
    ret.addPropertyResult('volumeSize', 'VolumeSize', properties.VolumeSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumeSize) : undefined);
    ret.addPropertyResult('volumeType', 'VolumeType', properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContainerRecipe {
    /**
     * Defines block device mappings for the instance used to configure your image.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceblockdevicemapping.html
     */
    export interface InstanceBlockDeviceMappingProperty {
        /**
         * The device to which these mappings apply.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceblockdevicemapping.html#cfn-imagebuilder-containerrecipe-instanceblockdevicemapping-devicename
         */
        readonly deviceName?: string;
        /**
         * Use to manage Amazon EBS-specific configuration for this mapping.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceblockdevicemapping.html#cfn-imagebuilder-containerrecipe-instanceblockdevicemapping-ebs
         */
        readonly ebs?: CfnContainerRecipe.EbsInstanceBlockDeviceSpecificationProperty | cdk.IResolvable;
        /**
         * Use to remove a mapping from the base image.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceblockdevicemapping.html#cfn-imagebuilder-containerrecipe-instanceblockdevicemapping-nodevice
         */
        readonly noDevice?: string;
        /**
         * Use to manage instance ephemeral devices.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceblockdevicemapping.html#cfn-imagebuilder-containerrecipe-instanceblockdevicemapping-virtualname
         */
        readonly virtualName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `InstanceBlockDeviceMappingProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceBlockDeviceMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnContainerRecipe_InstanceBlockDeviceMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deviceName', cdk.validateString)(properties.deviceName));
    errors.collect(cdk.propertyValidator('ebs', CfnContainerRecipe_EbsInstanceBlockDeviceSpecificationPropertyValidator)(properties.ebs));
    errors.collect(cdk.propertyValidator('noDevice', cdk.validateString)(properties.noDevice));
    errors.collect(cdk.propertyValidator('virtualName', cdk.validateString)(properties.virtualName));
    return errors.wrap('supplied properties not correct for "InstanceBlockDeviceMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ContainerRecipe.InstanceBlockDeviceMapping` resource
 *
 * @param properties - the TypeScript properties of a `InstanceBlockDeviceMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ContainerRecipe.InstanceBlockDeviceMapping` resource.
 */
// @ts-ignore TS6133
function cfnContainerRecipeInstanceBlockDeviceMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContainerRecipe_InstanceBlockDeviceMappingPropertyValidator(properties).assertSuccess();
    return {
        DeviceName: cdk.stringToCloudFormation(properties.deviceName),
        Ebs: cfnContainerRecipeEbsInstanceBlockDeviceSpecificationPropertyToCloudFormation(properties.ebs),
        NoDevice: cdk.stringToCloudFormation(properties.noDevice),
        VirtualName: cdk.stringToCloudFormation(properties.virtualName),
    };
}

// @ts-ignore TS6133
function CfnContainerRecipeInstanceBlockDeviceMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerRecipe.InstanceBlockDeviceMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerRecipe.InstanceBlockDeviceMappingProperty>();
    ret.addPropertyResult('deviceName', 'DeviceName', properties.DeviceName != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceName) : undefined);
    ret.addPropertyResult('ebs', 'Ebs', properties.Ebs != null ? CfnContainerRecipeEbsInstanceBlockDeviceSpecificationPropertyFromCloudFormation(properties.Ebs) : undefined);
    ret.addPropertyResult('noDevice', 'NoDevice', properties.NoDevice != null ? cfn_parse.FromCloudFormation.getString(properties.NoDevice) : undefined);
    ret.addPropertyResult('virtualName', 'VirtualName', properties.VirtualName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContainerRecipe {
    /**
     * Defines a custom base AMI and block device mapping configurations of an instance used for building and testing container images.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceconfiguration.html
     */
    export interface InstanceConfigurationProperty {
        /**
         * Defines the block devices to attach for building an instance from this Image Builder AMI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceconfiguration.html#cfn-imagebuilder-containerrecipe-instanceconfiguration-blockdevicemappings
         */
        readonly blockDeviceMappings?: Array<CfnContainerRecipe.InstanceBlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The AMI ID to use as the base image for a container build and test instance. If not specified, Image Builder will use the appropriate ECS-optimized AMI as a base image.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceconfiguration.html#cfn-imagebuilder-containerrecipe-instanceconfiguration-image
         */
        readonly image?: string;
    }
}

/**
 * Determine whether the given properties match those of a `InstanceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnContainerRecipe_InstanceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('blockDeviceMappings', cdk.listValidator(CfnContainerRecipe_InstanceBlockDeviceMappingPropertyValidator))(properties.blockDeviceMappings));
    errors.collect(cdk.propertyValidator('image', cdk.validateString)(properties.image));
    return errors.wrap('supplied properties not correct for "InstanceConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ContainerRecipe.InstanceConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `InstanceConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ContainerRecipe.InstanceConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnContainerRecipeInstanceConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContainerRecipe_InstanceConfigurationPropertyValidator(properties).assertSuccess();
    return {
        BlockDeviceMappings: cdk.listMapper(cfnContainerRecipeInstanceBlockDeviceMappingPropertyToCloudFormation)(properties.blockDeviceMappings),
        Image: cdk.stringToCloudFormation(properties.image),
    };
}

// @ts-ignore TS6133
function CfnContainerRecipeInstanceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerRecipe.InstanceConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerRecipe.InstanceConfigurationProperty>();
    ret.addPropertyResult('blockDeviceMappings', 'BlockDeviceMappings', properties.BlockDeviceMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnContainerRecipeInstanceBlockDeviceMappingPropertyFromCloudFormation)(properties.BlockDeviceMappings) : undefined);
    ret.addPropertyResult('image', 'Image', properties.Image != null ? cfn_parse.FromCloudFormation.getString(properties.Image) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContainerRecipe {
    /**
     * The container repository where the output container image is stored.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-targetcontainerrepository.html
     */
    export interface TargetContainerRepositoryProperty {
        /**
         * The name of the container repository where the output container image is stored. This name is prefixed by the repository location.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-targetcontainerrepository.html#cfn-imagebuilder-containerrecipe-targetcontainerrepository-repositoryname
         */
        readonly repositoryName?: string;
        /**
         * Specifies the service in which this image was registered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-targetcontainerrepository.html#cfn-imagebuilder-containerrecipe-targetcontainerrepository-service
         */
        readonly service?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TargetContainerRepositoryProperty`
 *
 * @param properties - the TypeScript properties of a `TargetContainerRepositoryProperty`
 *
 * @returns the result of the validation.
 */
function CfnContainerRecipe_TargetContainerRepositoryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('repositoryName', cdk.validateString)(properties.repositoryName));
    errors.collect(cdk.propertyValidator('service', cdk.validateString)(properties.service));
    return errors.wrap('supplied properties not correct for "TargetContainerRepositoryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ContainerRecipe.TargetContainerRepository` resource
 *
 * @param properties - the TypeScript properties of a `TargetContainerRepositoryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ContainerRecipe.TargetContainerRepository` resource.
 */
// @ts-ignore TS6133
function cfnContainerRecipeTargetContainerRepositoryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContainerRecipe_TargetContainerRepositoryPropertyValidator(properties).assertSuccess();
    return {
        RepositoryName: cdk.stringToCloudFormation(properties.repositoryName),
        Service: cdk.stringToCloudFormation(properties.service),
    };
}

// @ts-ignore TS6133
function CfnContainerRecipeTargetContainerRepositoryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerRecipe.TargetContainerRepositoryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerRecipe.TargetContainerRepositoryProperty>();
    ret.addPropertyResult('repositoryName', 'RepositoryName', properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined);
    ret.addPropertyResult('service', 'Service', properties.Service != null ? cfn_parse.FromCloudFormation.getString(properties.Service) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDistributionConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html
 */
export interface CfnDistributionConfigurationProps {

    /**
     * The distributions of this distribution configuration formatted as an array of Distribution objects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-distributions
     */
    readonly distributions: Array<CfnDistributionConfiguration.DistributionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of this distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-name
     */
    readonly name: string;

    /**
     * The description of this distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-description
     */
    readonly description?: string;

    /**
     * The tags of this distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnDistributionConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDistributionConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnDistributionConfigurationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('distributions', cdk.requiredValidator)(properties.distributions));
    errors.collect(cdk.propertyValidator('distributions', cdk.listValidator(CfnDistributionConfiguration_DistributionPropertyValidator))(properties.distributions));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDistributionConfigurationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CfnDistributionConfigurationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDistributionConfigurationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistributionConfigurationPropsValidator(properties).assertSuccess();
    return {
        Distributions: cdk.listMapper(cfnDistributionConfigurationDistributionPropertyToCloudFormation)(properties.distributions),
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfigurationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfigurationProps>();
    ret.addPropertyResult('distributions', 'Distributions', cfn_parse.FromCloudFormation.getArray(CfnDistributionConfigurationDistributionPropertyFromCloudFormation)(properties.Distributions));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ImageBuilder::DistributionConfiguration`
 *
 * A distribution configuration allows you to specify the name and description of your output AMI, authorize other AWS account s to launch the AMI, and replicate the AMI to other AWS Regions . It also allows you to export the AMI to Amazon S3 .
 *
 * @cloudformationResource AWS::ImageBuilder::DistributionConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html
 */
export class CfnDistributionConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ImageBuilder::DistributionConfiguration";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDistributionConfiguration {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDistributionConfigurationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDistributionConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the Amazon Resource Name (ARN) of this distribution configuration. The following pattern is applied: `^arn:aws[^:]*:imagebuilder:[^:]+:(?:\d{12}|aws):(?:image-recipe|infrastructure-configuration|distribution-configuration|component|image|image-pipeline)/[a-z0-9-_]+(?:/(?:(?:x|\d+)\.(?:x|\d+)\.(?:x|\d+))(?:/\d+)?)?$` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Returns the name of the distribution configuration.
     * @cloudformationAttribute Name
     */
    public readonly attrName: string;

    /**
     * The distributions of this distribution configuration formatted as an array of Distribution objects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-distributions
     */
    public distributions: Array<CfnDistributionConfiguration.DistributionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of this distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-name
     */
    public name: string;

    /**
     * The description of this distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-description
     */
    public description: string | undefined;

    /**
     * The tags of this distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ImageBuilder::DistributionConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDistributionConfigurationProps) {
        super(scope, id, { type: CfnDistributionConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'distributions', this);
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));

        this.distributions = props.distributions;
        this.name = props.name;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ImageBuilder::DistributionConfiguration", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDistributionConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            distributions: this.distributions,
            name: this.name,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDistributionConfigurationPropsToCloudFormation(props);
    }
}

export namespace CfnDistributionConfiguration {
    /**
     * Define and configure the output AMIs of the pipeline.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html
     */
    export interface AmiDistributionConfigurationProperty {
        /**
         * The tags to apply to AMIs distributed to this Region.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-amitags
         */
        readonly amiTags?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The description of the AMI distribution configuration. Minimum and maximum length are in characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-description
         */
        readonly description?: string;
        /**
         * The KMS key identifier used to encrypt the distributed image.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-kmskeyid
         */
        readonly kmsKeyId?: string;
        /**
         * Launch permissions can be used to configure which AWS account s can use the AMI to launch instances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-launchpermissionconfiguration
         */
        readonly launchPermissionConfiguration?: CfnDistributionConfiguration.LaunchPermissionConfigurationProperty | cdk.IResolvable;
        /**
         * The name of the output AMI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-name
         */
        readonly name?: string;
        /**
         * The ID of an account to which you want to distribute an image.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-targetaccountids
         */
        readonly targetAccountIds?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AmiDistributionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AmiDistributionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistributionConfiguration_AmiDistributionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('amiTags', cdk.hashValidator(cdk.validateString))(properties.amiTags));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('launchPermissionConfiguration', CfnDistributionConfiguration_LaunchPermissionConfigurationPropertyValidator)(properties.launchPermissionConfiguration));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('targetAccountIds', cdk.listValidator(cdk.validateString))(properties.targetAccountIds));
    return errors.wrap('supplied properties not correct for "AmiDistributionConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.AmiDistributionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `AmiDistributionConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.AmiDistributionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDistributionConfigurationAmiDistributionConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistributionConfiguration_AmiDistributionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AmiTags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.amiTags),
        Description: cdk.stringToCloudFormation(properties.description),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        LaunchPermissionConfiguration: cfnDistributionConfigurationLaunchPermissionConfigurationPropertyToCloudFormation(properties.launchPermissionConfiguration),
        Name: cdk.stringToCloudFormation(properties.name),
        TargetAccountIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.targetAccountIds),
    };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationAmiDistributionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfiguration.AmiDistributionConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.AmiDistributionConfigurationProperty>();
    ret.addPropertyResult('amiTags', 'AmiTags', properties.AmiTags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AmiTags) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('launchPermissionConfiguration', 'LaunchPermissionConfiguration', properties.LaunchPermissionConfiguration != null ? CfnDistributionConfigurationLaunchPermissionConfigurationPropertyFromCloudFormation(properties.LaunchPermissionConfiguration) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('targetAccountIds', 'TargetAccountIds', properties.TargetAccountIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.TargetAccountIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistributionConfiguration {
    /**
     * Container distribution settings for encryption, licensing, and sharing in a specific Region.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-containerdistributionconfiguration.html
     */
    export interface ContainerDistributionConfigurationProperty {
        /**
         * Tags that are attached to the container distribution configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-containerdistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-containerdistributionconfiguration-containertags
         */
        readonly containerTags?: string[];
        /**
         * The description of the container distribution configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-containerdistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-containerdistributionconfiguration-description
         */
        readonly description?: string;
        /**
         * The destination repository for the container distribution configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-containerdistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-containerdistributionconfiguration-targetrepository
         */
        readonly targetRepository?: CfnDistributionConfiguration.TargetContainerRepositoryProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ContainerDistributionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ContainerDistributionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistributionConfiguration_ContainerDistributionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('containerTags', cdk.listValidator(cdk.validateString))(properties.containerTags));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('targetRepository', CfnDistributionConfiguration_TargetContainerRepositoryPropertyValidator)(properties.targetRepository));
    return errors.wrap('supplied properties not correct for "ContainerDistributionConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.ContainerDistributionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ContainerDistributionConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.ContainerDistributionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDistributionConfigurationContainerDistributionConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistributionConfiguration_ContainerDistributionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ContainerTags: cdk.listMapper(cdk.stringToCloudFormation)(properties.containerTags),
        Description: cdk.stringToCloudFormation(properties.description),
        TargetRepository: cfnDistributionConfigurationTargetContainerRepositoryPropertyToCloudFormation(properties.targetRepository),
    };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationContainerDistributionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfiguration.ContainerDistributionConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.ContainerDistributionConfigurationProperty>();
    ret.addPropertyResult('containerTags', 'ContainerTags', properties.ContainerTags != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ContainerTags) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('targetRepository', 'TargetRepository', properties.TargetRepository != null ? CfnDistributionConfigurationTargetContainerRepositoryPropertyFromCloudFormation(properties.TargetRepository) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistributionConfiguration {
    /**
     * The distribution configuration distribution defines the settings for a specific Region in the Distribution Configuration. You must specify whether the distribution is for an AMI or a container image. To do so, include exactly one of the following data types for your distribution:
     *
     * - amiDistributionConfiguration
     * - containerDistributionConfiguration
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html
     */
    export interface DistributionProperty {
        /**
         * The specific AMI settings, such as launch permissions and AMI tags. For details, see example schema below.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-amidistributionconfiguration
         */
        readonly amiDistributionConfiguration?: any | cdk.IResolvable;
        /**
         * Container distribution settings for encryption, licensing, and sharing in a specific Region. For details, see example schema below.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-containerdistributionconfiguration
         */
        readonly containerDistributionConfiguration?: any | cdk.IResolvable;
        /**
         * The Windows faster-launching configurations to use for AMI distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-fastlaunchconfigurations
         */
        readonly fastLaunchConfigurations?: Array<CfnDistributionConfiguration.FastLaunchConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A group of launchTemplateConfiguration settings that apply to image distribution for specified accounts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-launchtemplateconfigurations
         */
        readonly launchTemplateConfigurations?: Array<CfnDistributionConfiguration.LaunchTemplateConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The License Manager Configuration to associate with the AMI in the specified Region. For more information, see the [LicenseConfiguration API](https://docs.aws.amazon.com/license-manager/latest/APIReference/API_LicenseConfiguration.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-licenseconfigurationarns
         */
        readonly licenseConfigurationArns?: string[];
        /**
         * The target Region for the Distribution Configuration. For example, `eu-west-1` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-region
         */
        readonly region: string;
    }
}

/**
 * Determine whether the given properties match those of a `DistributionProperty`
 *
 * @param properties - the TypeScript properties of a `DistributionProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistributionConfiguration_DistributionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('amiDistributionConfiguration', cdk.validateObject)(properties.amiDistributionConfiguration));
    errors.collect(cdk.propertyValidator('containerDistributionConfiguration', cdk.validateObject)(properties.containerDistributionConfiguration));
    errors.collect(cdk.propertyValidator('fastLaunchConfigurations', cdk.listValidator(CfnDistributionConfiguration_FastLaunchConfigurationPropertyValidator))(properties.fastLaunchConfigurations));
    errors.collect(cdk.propertyValidator('launchTemplateConfigurations', cdk.listValidator(CfnDistributionConfiguration_LaunchTemplateConfigurationPropertyValidator))(properties.launchTemplateConfigurations));
    errors.collect(cdk.propertyValidator('licenseConfigurationArns', cdk.listValidator(cdk.validateString))(properties.licenseConfigurationArns));
    errors.collect(cdk.propertyValidator('region', cdk.requiredValidator)(properties.region));
    errors.collect(cdk.propertyValidator('region', cdk.validateString)(properties.region));
    return errors.wrap('supplied properties not correct for "DistributionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.Distribution` resource
 *
 * @param properties - the TypeScript properties of a `DistributionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.Distribution` resource.
 */
// @ts-ignore TS6133
function cfnDistributionConfigurationDistributionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistributionConfiguration_DistributionPropertyValidator(properties).assertSuccess();
    return {
        AmiDistributionConfiguration: cdk.objectToCloudFormation(properties.amiDistributionConfiguration),
        ContainerDistributionConfiguration: cdk.objectToCloudFormation(properties.containerDistributionConfiguration),
        FastLaunchConfigurations: cdk.listMapper(cfnDistributionConfigurationFastLaunchConfigurationPropertyToCloudFormation)(properties.fastLaunchConfigurations),
        LaunchTemplateConfigurations: cdk.listMapper(cfnDistributionConfigurationLaunchTemplateConfigurationPropertyToCloudFormation)(properties.launchTemplateConfigurations),
        LicenseConfigurationArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.licenseConfigurationArns),
        Region: cdk.stringToCloudFormation(properties.region),
    };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationDistributionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfiguration.DistributionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.DistributionProperty>();
    ret.addPropertyResult('amiDistributionConfiguration', 'AmiDistributionConfiguration', properties.AmiDistributionConfiguration != null ? cfn_parse.FromCloudFormation.getAny(properties.AmiDistributionConfiguration) : undefined);
    ret.addPropertyResult('containerDistributionConfiguration', 'ContainerDistributionConfiguration', properties.ContainerDistributionConfiguration != null ? cfn_parse.FromCloudFormation.getAny(properties.ContainerDistributionConfiguration) : undefined);
    ret.addPropertyResult('fastLaunchConfigurations', 'FastLaunchConfigurations', properties.FastLaunchConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionConfigurationFastLaunchConfigurationPropertyFromCloudFormation)(properties.FastLaunchConfigurations) : undefined);
    ret.addPropertyResult('launchTemplateConfigurations', 'LaunchTemplateConfigurations', properties.LaunchTemplateConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionConfigurationLaunchTemplateConfigurationPropertyFromCloudFormation)(properties.LaunchTemplateConfigurations) : undefined);
    ret.addPropertyResult('licenseConfigurationArns', 'LicenseConfigurationArns', properties.LicenseConfigurationArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.LicenseConfigurationArns) : undefined);
    ret.addPropertyResult('region', 'Region', cfn_parse.FromCloudFormation.getString(properties.Region));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistributionConfiguration {
    /**
     * Define and configure faster launching for output Windows AMIs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html
     */
    export interface FastLaunchConfigurationProperty {
        /**
         * The owner account ID for the fast-launch enabled Windows AMI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchconfiguration-accountid
         */
        readonly accountId?: string;
        /**
         * A Boolean that represents the current state of faster launching for the Windows AMI. Set to `true` to start using Windows faster launching, or `false` to stop using it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchconfiguration-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * The launch template that the fast-launch enabled Windows AMI uses when it launches Windows instances to create pre-provisioned snapshots.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchconfiguration-launchtemplate
         */
        readonly launchTemplate?: CfnDistributionConfiguration.FastLaunchLaunchTemplateSpecificationProperty | cdk.IResolvable;
        /**
         * The maximum number of parallel instances that are launched for creating resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchconfiguration-maxparallellaunches
         */
        readonly maxParallelLaunches?: number;
        /**
         * Configuration settings for managing the number of snapshots that are created from pre-provisioned instances for the Windows AMI when faster launching is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchconfiguration-snapshotconfiguration
         */
        readonly snapshotConfiguration?: CfnDistributionConfiguration.FastLaunchSnapshotConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FastLaunchConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FastLaunchConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistributionConfiguration_FastLaunchConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accountId', cdk.validateString)(properties.accountId));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('launchTemplate', CfnDistributionConfiguration_FastLaunchLaunchTemplateSpecificationPropertyValidator)(properties.launchTemplate));
    errors.collect(cdk.propertyValidator('maxParallelLaunches', cdk.validateNumber)(properties.maxParallelLaunches));
    errors.collect(cdk.propertyValidator('snapshotConfiguration', CfnDistributionConfiguration_FastLaunchSnapshotConfigurationPropertyValidator)(properties.snapshotConfiguration));
    return errors.wrap('supplied properties not correct for "FastLaunchConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.FastLaunchConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `FastLaunchConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.FastLaunchConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDistributionConfigurationFastLaunchConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistributionConfiguration_FastLaunchConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AccountId: cdk.stringToCloudFormation(properties.accountId),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        LaunchTemplate: cfnDistributionConfigurationFastLaunchLaunchTemplateSpecificationPropertyToCloudFormation(properties.launchTemplate),
        MaxParallelLaunches: cdk.numberToCloudFormation(properties.maxParallelLaunches),
        SnapshotConfiguration: cfnDistributionConfigurationFastLaunchSnapshotConfigurationPropertyToCloudFormation(properties.snapshotConfiguration),
    };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationFastLaunchConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfiguration.FastLaunchConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.FastLaunchConfigurationProperty>();
    ret.addPropertyResult('accountId', 'AccountId', properties.AccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AccountId) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('launchTemplate', 'LaunchTemplate', properties.LaunchTemplate != null ? CfnDistributionConfigurationFastLaunchLaunchTemplateSpecificationPropertyFromCloudFormation(properties.LaunchTemplate) : undefined);
    ret.addPropertyResult('maxParallelLaunches', 'MaxParallelLaunches', properties.MaxParallelLaunches != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxParallelLaunches) : undefined);
    ret.addPropertyResult('snapshotConfiguration', 'SnapshotConfiguration', properties.SnapshotConfiguration != null ? CfnDistributionConfigurationFastLaunchSnapshotConfigurationPropertyFromCloudFormation(properties.SnapshotConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistributionConfiguration {
    /**
     * Identifies the launch template that the associated Windows AMI uses for launching an instance when faster launching is enabled.
     *
     * > You can specify either the `launchTemplateName` or the `launchTemplateId` , but not both.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification.html
     */
    export interface FastLaunchLaunchTemplateSpecificationProperty {
        /**
         * The ID of the launch template to use for faster launching for a Windows AMI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification.html#cfn-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification-launchtemplateid
         */
        readonly launchTemplateId?: string;
        /**
         * The name of the launch template to use for faster launching for a Windows AMI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification.html#cfn-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification-launchtemplatename
         */
        readonly launchTemplateName?: string;
        /**
         * The version of the launch template to use for faster launching for a Windows AMI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification.html#cfn-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification-launchtemplateversion
         */
        readonly launchTemplateVersion?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FastLaunchLaunchTemplateSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `FastLaunchLaunchTemplateSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistributionConfiguration_FastLaunchLaunchTemplateSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('launchTemplateId', cdk.validateString)(properties.launchTemplateId));
    errors.collect(cdk.propertyValidator('launchTemplateName', cdk.validateString)(properties.launchTemplateName));
    errors.collect(cdk.propertyValidator('launchTemplateVersion', cdk.validateString)(properties.launchTemplateVersion));
    return errors.wrap('supplied properties not correct for "FastLaunchLaunchTemplateSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.FastLaunchLaunchTemplateSpecification` resource
 *
 * @param properties - the TypeScript properties of a `FastLaunchLaunchTemplateSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.FastLaunchLaunchTemplateSpecification` resource.
 */
// @ts-ignore TS6133
function cfnDistributionConfigurationFastLaunchLaunchTemplateSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistributionConfiguration_FastLaunchLaunchTemplateSpecificationPropertyValidator(properties).assertSuccess();
    return {
        LaunchTemplateId: cdk.stringToCloudFormation(properties.launchTemplateId),
        LaunchTemplateName: cdk.stringToCloudFormation(properties.launchTemplateName),
        LaunchTemplateVersion: cdk.stringToCloudFormation(properties.launchTemplateVersion),
    };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationFastLaunchLaunchTemplateSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfiguration.FastLaunchLaunchTemplateSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.FastLaunchLaunchTemplateSpecificationProperty>();
    ret.addPropertyResult('launchTemplateId', 'LaunchTemplateId', properties.LaunchTemplateId != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchTemplateId) : undefined);
    ret.addPropertyResult('launchTemplateName', 'LaunchTemplateName', properties.LaunchTemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchTemplateName) : undefined);
    ret.addPropertyResult('launchTemplateVersion', 'LaunchTemplateVersion', properties.LaunchTemplateVersion != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchTemplateVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistributionConfiguration {
    /**
     * Configuration settings for creating and managing pre-provisioned snapshots for a fast-launch enabled Windows AMI.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchsnapshotconfiguration.html
     */
    export interface FastLaunchSnapshotConfigurationProperty {
        /**
         * The number of pre-provisioned snapshots to keep on hand for a fast-launch enabled Windows AMI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchsnapshotconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchsnapshotconfiguration-targetresourcecount
         */
        readonly targetResourceCount?: number;
    }
}

/**
 * Determine whether the given properties match those of a `FastLaunchSnapshotConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FastLaunchSnapshotConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistributionConfiguration_FastLaunchSnapshotConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('targetResourceCount', cdk.validateNumber)(properties.targetResourceCount));
    return errors.wrap('supplied properties not correct for "FastLaunchSnapshotConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.FastLaunchSnapshotConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `FastLaunchSnapshotConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.FastLaunchSnapshotConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDistributionConfigurationFastLaunchSnapshotConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistributionConfiguration_FastLaunchSnapshotConfigurationPropertyValidator(properties).assertSuccess();
    return {
        TargetResourceCount: cdk.numberToCloudFormation(properties.targetResourceCount),
    };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationFastLaunchSnapshotConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfiguration.FastLaunchSnapshotConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.FastLaunchSnapshotConfigurationProperty>();
    ret.addPropertyResult('targetResourceCount', 'TargetResourceCount', properties.TargetResourceCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetResourceCount) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistributionConfiguration {
    /**
     * Describes the configuration for a launch permission. The launch permission modification request is sent to the [Amazon EC2 ModifyImageAttribute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyImageAttribute.html) API on behalf of the user for each Region they have selected to distribute the AMI. To make an AMI public, set the launch permission authorized accounts to `all` . See the examples for making an AMI public at [Amazon EC2 ModifyImageAttribute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyImageAttribute.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchpermissionconfiguration.html
     */
    export interface LaunchPermissionConfigurationProperty {
        /**
         * The ARN for an AWS Organization that you want to share your AMI with. For more information, see [What is AWS Organizations ?](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchpermissionconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchpermissionconfiguration-organizationarns
         */
        readonly organizationArns?: string[];
        /**
         * The ARN for an AWS Organizations organizational unit (OU) that you want to share your AMI with. For more information about key concepts for AWS Organizations , see [AWS Organizations terminology and concepts](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_getting-started_concepts.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchpermissionconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchpermissionconfiguration-organizationalunitarns
         */
        readonly organizationalUnitArns?: string[];
        /**
         * The name of the group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchpermissionconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchpermissionconfiguration-usergroups
         */
        readonly userGroups?: string[];
        /**
         * The AWS account ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchpermissionconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchpermissionconfiguration-userids
         */
        readonly userIds?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `LaunchPermissionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LaunchPermissionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistributionConfiguration_LaunchPermissionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('organizationArns', cdk.listValidator(cdk.validateString))(properties.organizationArns));
    errors.collect(cdk.propertyValidator('organizationalUnitArns', cdk.listValidator(cdk.validateString))(properties.organizationalUnitArns));
    errors.collect(cdk.propertyValidator('userGroups', cdk.listValidator(cdk.validateString))(properties.userGroups));
    errors.collect(cdk.propertyValidator('userIds', cdk.listValidator(cdk.validateString))(properties.userIds));
    return errors.wrap('supplied properties not correct for "LaunchPermissionConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.LaunchPermissionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LaunchPermissionConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.LaunchPermissionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDistributionConfigurationLaunchPermissionConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistributionConfiguration_LaunchPermissionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        OrganizationArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationArns),
        OrganizationalUnitArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationalUnitArns),
        UserGroups: cdk.listMapper(cdk.stringToCloudFormation)(properties.userGroups),
        UserIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.userIds),
    };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationLaunchPermissionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfiguration.LaunchPermissionConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.LaunchPermissionConfigurationProperty>();
    ret.addPropertyResult('organizationArns', 'OrganizationArns', properties.OrganizationArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.OrganizationArns) : undefined);
    ret.addPropertyResult('organizationalUnitArns', 'OrganizationalUnitArns', properties.OrganizationalUnitArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.OrganizationalUnitArns) : undefined);
    ret.addPropertyResult('userGroups', 'UserGroups', properties.UserGroups != null ? cfn_parse.FromCloudFormation.getStringArray(properties.UserGroups) : undefined);
    ret.addPropertyResult('userIds', 'UserIds', properties.UserIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.UserIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistributionConfiguration {
    /**
     * Identifies an Amazon EC2 launch template to use for a specific account.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchtemplateconfiguration.html
     */
    export interface LaunchTemplateConfigurationProperty {
        /**
         * The account ID that this configuration applies to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchtemplateconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchtemplateconfiguration-accountid
         */
        readonly accountId?: string;
        /**
         * Identifies the Amazon EC2 launch template to use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchtemplateconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchtemplateconfiguration-launchtemplateid
         */
        readonly launchTemplateId?: string;
        /**
         * Set the specified Amazon EC2 launch template as the default launch template for the specified account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchtemplateconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchtemplateconfiguration-setdefaultversion
         */
        readonly setDefaultVersion?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LaunchTemplateConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LaunchTemplateConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistributionConfiguration_LaunchTemplateConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accountId', cdk.validateString)(properties.accountId));
    errors.collect(cdk.propertyValidator('launchTemplateId', cdk.validateString)(properties.launchTemplateId));
    errors.collect(cdk.propertyValidator('setDefaultVersion', cdk.validateBoolean)(properties.setDefaultVersion));
    return errors.wrap('supplied properties not correct for "LaunchTemplateConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.LaunchTemplateConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LaunchTemplateConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.LaunchTemplateConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDistributionConfigurationLaunchTemplateConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistributionConfiguration_LaunchTemplateConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AccountId: cdk.stringToCloudFormation(properties.accountId),
        LaunchTemplateId: cdk.stringToCloudFormation(properties.launchTemplateId),
        SetDefaultVersion: cdk.booleanToCloudFormation(properties.setDefaultVersion),
    };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationLaunchTemplateConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfiguration.LaunchTemplateConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.LaunchTemplateConfigurationProperty>();
    ret.addPropertyResult('accountId', 'AccountId', properties.AccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AccountId) : undefined);
    ret.addPropertyResult('launchTemplateId', 'LaunchTemplateId', properties.LaunchTemplateId != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchTemplateId) : undefined);
    ret.addPropertyResult('setDefaultVersion', 'SetDefaultVersion', properties.SetDefaultVersion != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SetDefaultVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistributionConfiguration {
    /**
     * The container repository where the output container image is stored.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-targetcontainerrepository.html
     */
    export interface TargetContainerRepositoryProperty {
        /**
         * The name of the container repository where the output container image is stored. This name is prefixed by the repository location.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-targetcontainerrepository.html#cfn-imagebuilder-distributionconfiguration-targetcontainerrepository-repositoryname
         */
        readonly repositoryName?: string;
        /**
         * Specifies the service in which this image was registered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-targetcontainerrepository.html#cfn-imagebuilder-distributionconfiguration-targetcontainerrepository-service
         */
        readonly service?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TargetContainerRepositoryProperty`
 *
 * @param properties - the TypeScript properties of a `TargetContainerRepositoryProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistributionConfiguration_TargetContainerRepositoryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('repositoryName', cdk.validateString)(properties.repositoryName));
    errors.collect(cdk.propertyValidator('service', cdk.validateString)(properties.service));
    return errors.wrap('supplied properties not correct for "TargetContainerRepositoryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.TargetContainerRepository` resource
 *
 * @param properties - the TypeScript properties of a `TargetContainerRepositoryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::DistributionConfiguration.TargetContainerRepository` resource.
 */
// @ts-ignore TS6133
function cfnDistributionConfigurationTargetContainerRepositoryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistributionConfiguration_TargetContainerRepositoryPropertyValidator(properties).assertSuccess();
    return {
        RepositoryName: cdk.stringToCloudFormation(properties.repositoryName),
        Service: cdk.stringToCloudFormation(properties.service),
    };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationTargetContainerRepositoryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfiguration.TargetContainerRepositoryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.TargetContainerRepositoryProperty>();
    ret.addPropertyResult('repositoryName', 'RepositoryName', properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined);
    ret.addPropertyResult('service', 'Service', properties.Service != null ? cfn_parse.FromCloudFormation.getString(properties.Service) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnImage`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html
 */
export interface CfnImageProps {

    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-infrastructureconfigurationarn
     */
    readonly infrastructureConfigurationArn: string;

    /**
     * The Amazon Resource Name (ARN) of the container recipe that is used for this pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-containerrecipearn
     */
    readonly containerRecipeArn?: string;

    /**
     * The Amazon Resource Name (ARN) of the distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-distributionconfigurationarn
     */
    readonly distributionConfigurationArn?: string;

    /**
     * Indicates whether Image Builder collects additional information about the image, such as the operating system (OS) version and package list.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-enhancedimagemetadataenabled
     */
    readonly enhancedImageMetadataEnabled?: boolean | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-imagerecipearn
     */
    readonly imageRecipeArn?: string;

    /**
     * The configuration settings for your image test components, which includes a toggle that allows you to turn off tests, and a timeout setting.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-imagetestsconfiguration
     */
    readonly imageTestsConfiguration?: CfnImage.ImageTestsConfigurationProperty | cdk.IResolvable;

    /**
     * The tags of the image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnImageProps`
 *
 * @param properties - the TypeScript properties of a `CfnImageProps`
 *
 * @returns the result of the validation.
 */
function CfnImagePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('containerRecipeArn', cdk.validateString)(properties.containerRecipeArn));
    errors.collect(cdk.propertyValidator('distributionConfigurationArn', cdk.validateString)(properties.distributionConfigurationArn));
    errors.collect(cdk.propertyValidator('enhancedImageMetadataEnabled', cdk.validateBoolean)(properties.enhancedImageMetadataEnabled));
    errors.collect(cdk.propertyValidator('imageRecipeArn', cdk.validateString)(properties.imageRecipeArn));
    errors.collect(cdk.propertyValidator('imageTestsConfiguration', CfnImage_ImageTestsConfigurationPropertyValidator)(properties.imageTestsConfiguration));
    errors.collect(cdk.propertyValidator('infrastructureConfigurationArn', cdk.requiredValidator)(properties.infrastructureConfigurationArn));
    errors.collect(cdk.propertyValidator('infrastructureConfigurationArn', cdk.validateString)(properties.infrastructureConfigurationArn));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnImageProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::Image` resource
 *
 * @param properties - the TypeScript properties of a `CfnImageProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::Image` resource.
 */
// @ts-ignore TS6133
function cfnImagePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnImagePropsValidator(properties).assertSuccess();
    return {
        InfrastructureConfigurationArn: cdk.stringToCloudFormation(properties.infrastructureConfigurationArn),
        ContainerRecipeArn: cdk.stringToCloudFormation(properties.containerRecipeArn),
        DistributionConfigurationArn: cdk.stringToCloudFormation(properties.distributionConfigurationArn),
        EnhancedImageMetadataEnabled: cdk.booleanToCloudFormation(properties.enhancedImageMetadataEnabled),
        ImageRecipeArn: cdk.stringToCloudFormation(properties.imageRecipeArn),
        ImageTestsConfiguration: cfnImageImageTestsConfigurationPropertyToCloudFormation(properties.imageTestsConfiguration),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnImagePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageProps>();
    ret.addPropertyResult('infrastructureConfigurationArn', 'InfrastructureConfigurationArn', cfn_parse.FromCloudFormation.getString(properties.InfrastructureConfigurationArn));
    ret.addPropertyResult('containerRecipeArn', 'ContainerRecipeArn', properties.ContainerRecipeArn != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerRecipeArn) : undefined);
    ret.addPropertyResult('distributionConfigurationArn', 'DistributionConfigurationArn', properties.DistributionConfigurationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DistributionConfigurationArn) : undefined);
    ret.addPropertyResult('enhancedImageMetadataEnabled', 'EnhancedImageMetadataEnabled', properties.EnhancedImageMetadataEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnhancedImageMetadataEnabled) : undefined);
    ret.addPropertyResult('imageRecipeArn', 'ImageRecipeArn', properties.ImageRecipeArn != null ? cfn_parse.FromCloudFormation.getString(properties.ImageRecipeArn) : undefined);
    ret.addPropertyResult('imageTestsConfiguration', 'ImageTestsConfiguration', properties.ImageTestsConfiguration != null ? CfnImageImageTestsConfigurationPropertyFromCloudFormation(properties.ImageTestsConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ImageBuilder::Image`
 *
 * An image build version. An image is a customized, secure, and up-to-date “golden” server image that is pre-installed and pre-configured with software and settings to meet specific IT standards.
 *
 * @cloudformationResource AWS::ImageBuilder::Image
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html
 */
export class CfnImage extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ImageBuilder::Image";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnImage {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnImagePropsFromCloudFormation(resourceProperties);
        const ret = new CfnImage(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the Amazon Resource Name (ARN) of the image. For example, `arn:aws:imagebuilder:us-west-2:123456789012:image/mybasicrecipe/2019.12.03/1` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Returns the AMI ID of the Amazon EC2 AMI in the Region in which you are using Image Builder. Values are returned only for AMIs, and not for container images.
     * @cloudformationAttribute ImageId
     */
    public readonly attrImageId: string;

    /**
     * Returns a list of URIs for container images created in the context Region. Values are returned only for container images, and not for AMIs.
     * @cloudformationAttribute ImageUri
     */
    public readonly attrImageUri: string;

    /**
     * Returns the name of the image.
     * @cloudformationAttribute Name
     */
    public readonly attrName: string;

    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-infrastructureconfigurationarn
     */
    public infrastructureConfigurationArn: string;

    /**
     * The Amazon Resource Name (ARN) of the container recipe that is used for this pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-containerrecipearn
     */
    public containerRecipeArn: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of the distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-distributionconfigurationarn
     */
    public distributionConfigurationArn: string | undefined;

    /**
     * Indicates whether Image Builder collects additional information about the image, such as the operating system (OS) version and package list.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-enhancedimagemetadataenabled
     */
    public enhancedImageMetadataEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * The Amazon Resource Name (ARN) of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-imagerecipearn
     */
    public imageRecipeArn: string | undefined;

    /**
     * The configuration settings for your image test components, which includes a toggle that allows you to turn off tests, and a timeout setting.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-imagetestsconfiguration
     */
    public imageTestsConfiguration: CfnImage.ImageTestsConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The tags of the image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ImageBuilder::Image`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnImageProps) {
        super(scope, id, { type: CfnImage.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'infrastructureConfigurationArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrImageId = cdk.Token.asString(this.getAtt('ImageId', cdk.ResolutionTypeHint.STRING));
        this.attrImageUri = cdk.Token.asString(this.getAtt('ImageUri', cdk.ResolutionTypeHint.STRING));
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));

        this.infrastructureConfigurationArn = props.infrastructureConfigurationArn;
        this.containerRecipeArn = props.containerRecipeArn;
        this.distributionConfigurationArn = props.distributionConfigurationArn;
        this.enhancedImageMetadataEnabled = props.enhancedImageMetadataEnabled;
        this.imageRecipeArn = props.imageRecipeArn;
        this.imageTestsConfiguration = props.imageTestsConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ImageBuilder::Image", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnImage.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            infrastructureConfigurationArn: this.infrastructureConfigurationArn,
            containerRecipeArn: this.containerRecipeArn,
            distributionConfigurationArn: this.distributionConfigurationArn,
            enhancedImageMetadataEnabled: this.enhancedImageMetadataEnabled,
            imageRecipeArn: this.imageRecipeArn,
            imageTestsConfiguration: this.imageTestsConfiguration,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnImagePropsToCloudFormation(props);
    }
}

export namespace CfnImage {
    /**
     * When you create an image or container recipe with Image Builder , you can add the build or test components that are used to create the final image. You must have at least one build component to create a recipe, but test components are not required. If you have added tests, they run after the image is created, to ensure that the target image is functional and can be used reliably for launching Amazon EC2 instances.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-imagetestsconfiguration.html
     */
    export interface ImageTestsConfigurationProperty {
        /**
         * Determines if tests should run after building the image. Image Builder defaults to enable tests to run following the image build, before image distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-imagetestsconfiguration.html#cfn-imagebuilder-image-imagetestsconfiguration-imagetestsenabled
         */
        readonly imageTestsEnabled?: boolean | cdk.IResolvable;
        /**
         * The maximum time in minutes that tests are permitted to run.
         *
         * > The timeoutMinutes attribute is not currently active. This value is ignored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-imagetestsconfiguration.html#cfn-imagebuilder-image-imagetestsconfiguration-timeoutminutes
         */
        readonly timeoutMinutes?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ImageTestsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ImageTestsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnImage_ImageTestsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('imageTestsEnabled', cdk.validateBoolean)(properties.imageTestsEnabled));
    errors.collect(cdk.propertyValidator('timeoutMinutes', cdk.validateNumber)(properties.timeoutMinutes));
    return errors.wrap('supplied properties not correct for "ImageTestsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::Image.ImageTestsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ImageTestsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::Image.ImageTestsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnImageImageTestsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnImage_ImageTestsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ImageTestsEnabled: cdk.booleanToCloudFormation(properties.imageTestsEnabled),
        TimeoutMinutes: cdk.numberToCloudFormation(properties.timeoutMinutes),
    };
}

// @ts-ignore TS6133
function CfnImageImageTestsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImage.ImageTestsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImage.ImageTestsConfigurationProperty>();
    ret.addPropertyResult('imageTestsEnabled', 'ImageTestsEnabled', properties.ImageTestsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ImageTestsEnabled) : undefined);
    ret.addPropertyResult('timeoutMinutes', 'TimeoutMinutes', properties.TimeoutMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutMinutes) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnImagePipeline`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html
 */
export interface CfnImagePipelineProps {

    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-infrastructureconfigurationarn
     */
    readonly infrastructureConfigurationArn: string;

    /**
     * The name of the image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-name
     */
    readonly name: string;

    /**
     * The Amazon Resource Name (ARN) of the container recipe that is used for this pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-containerrecipearn
     */
    readonly containerRecipeArn?: string;

    /**
     * The description of this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-description
     */
    readonly description?: string;

    /**
     * The Amazon Resource Name (ARN) of the distribution configuration associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-distributionconfigurationarn
     */
    readonly distributionConfigurationArn?: string;

    /**
     * Collects additional information about the image being created, including the operating system (OS) version and package list. This information is used to enhance the overall experience of using EC2 Image Builder. Enabled by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-enhancedimagemetadataenabled
     */
    readonly enhancedImageMetadataEnabled?: boolean | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the image recipe associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-imagerecipearn
     */
    readonly imageRecipeArn?: string;

    /**
     * The configuration of the image tests that run after image creation to ensure the quality of the image that was created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-imagetestsconfiguration
     */
    readonly imageTestsConfiguration?: CfnImagePipeline.ImageTestsConfigurationProperty | cdk.IResolvable;

    /**
     * The schedule of the image pipeline. A schedule configures how often and when a pipeline automatically creates a new image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-schedule
     */
    readonly schedule?: CfnImagePipeline.ScheduleProperty | cdk.IResolvable;

    /**
     * The status of the image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-status
     */
    readonly status?: string;

    /**
     * The tags of this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnImagePipelineProps`
 *
 * @param properties - the TypeScript properties of a `CfnImagePipelineProps`
 *
 * @returns the result of the validation.
 */
function CfnImagePipelinePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('containerRecipeArn', cdk.validateString)(properties.containerRecipeArn));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('distributionConfigurationArn', cdk.validateString)(properties.distributionConfigurationArn));
    errors.collect(cdk.propertyValidator('enhancedImageMetadataEnabled', cdk.validateBoolean)(properties.enhancedImageMetadataEnabled));
    errors.collect(cdk.propertyValidator('imageRecipeArn', cdk.validateString)(properties.imageRecipeArn));
    errors.collect(cdk.propertyValidator('imageTestsConfiguration', CfnImagePipeline_ImageTestsConfigurationPropertyValidator)(properties.imageTestsConfiguration));
    errors.collect(cdk.propertyValidator('infrastructureConfigurationArn', cdk.requiredValidator)(properties.infrastructureConfigurationArn));
    errors.collect(cdk.propertyValidator('infrastructureConfigurationArn', cdk.validateString)(properties.infrastructureConfigurationArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('schedule', CfnImagePipeline_SchedulePropertyValidator)(properties.schedule));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnImagePipelineProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ImagePipeline` resource
 *
 * @param properties - the TypeScript properties of a `CfnImagePipelineProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ImagePipeline` resource.
 */
// @ts-ignore TS6133
function cfnImagePipelinePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnImagePipelinePropsValidator(properties).assertSuccess();
    return {
        InfrastructureConfigurationArn: cdk.stringToCloudFormation(properties.infrastructureConfigurationArn),
        Name: cdk.stringToCloudFormation(properties.name),
        ContainerRecipeArn: cdk.stringToCloudFormation(properties.containerRecipeArn),
        Description: cdk.stringToCloudFormation(properties.description),
        DistributionConfigurationArn: cdk.stringToCloudFormation(properties.distributionConfigurationArn),
        EnhancedImageMetadataEnabled: cdk.booleanToCloudFormation(properties.enhancedImageMetadataEnabled),
        ImageRecipeArn: cdk.stringToCloudFormation(properties.imageRecipeArn),
        ImageTestsConfiguration: cfnImagePipelineImageTestsConfigurationPropertyToCloudFormation(properties.imageTestsConfiguration),
        Schedule: cfnImagePipelineSchedulePropertyToCloudFormation(properties.schedule),
        Status: cdk.stringToCloudFormation(properties.status),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnImagePipelinePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImagePipelineProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImagePipelineProps>();
    ret.addPropertyResult('infrastructureConfigurationArn', 'InfrastructureConfigurationArn', cfn_parse.FromCloudFormation.getString(properties.InfrastructureConfigurationArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('containerRecipeArn', 'ContainerRecipeArn', properties.ContainerRecipeArn != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerRecipeArn) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('distributionConfigurationArn', 'DistributionConfigurationArn', properties.DistributionConfigurationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DistributionConfigurationArn) : undefined);
    ret.addPropertyResult('enhancedImageMetadataEnabled', 'EnhancedImageMetadataEnabled', properties.EnhancedImageMetadataEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnhancedImageMetadataEnabled) : undefined);
    ret.addPropertyResult('imageRecipeArn', 'ImageRecipeArn', properties.ImageRecipeArn != null ? cfn_parse.FromCloudFormation.getString(properties.ImageRecipeArn) : undefined);
    ret.addPropertyResult('imageTestsConfiguration', 'ImageTestsConfiguration', properties.ImageTestsConfiguration != null ? CfnImagePipelineImageTestsConfigurationPropertyFromCloudFormation(properties.ImageTestsConfiguration) : undefined);
    ret.addPropertyResult('schedule', 'Schedule', properties.Schedule != null ? CfnImagePipelineSchedulePropertyFromCloudFormation(properties.Schedule) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ImageBuilder::ImagePipeline`
 *
 * An image pipeline is the automation configuration for building secure OS images on AWS . The Image Builder image pipeline is associated with an image recipe that defines the build, validation, and test phases for an image build lifecycle. An image pipeline can be associated with an infrastructure configuration that defines where your image is built. You can define attributes, such as instance type, subnets, security groups, logging, and other infrastructure-related configurations. You can also associate your image pipeline with a distribution configuration to define how you would like to deploy your image.
 *
 * @cloudformationResource AWS::ImageBuilder::ImagePipeline
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html
 */
export class CfnImagePipeline extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ImageBuilder::ImagePipeline";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnImagePipeline {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnImagePipelinePropsFromCloudFormation(resourceProperties);
        const ret = new CfnImagePipeline(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the Amazon Resource Name (ARN) of the image pipeline. For example, `arn:aws:imagebuilder:us-west-2:123456789012:image-pipeline/mywindows2016pipeline` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Returns the name of the image pipeline.
     * @cloudformationAttribute Name
     */
    public readonly attrName: string;

    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-infrastructureconfigurationarn
     */
    public infrastructureConfigurationArn: string;

    /**
     * The name of the image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-name
     */
    public name: string;

    /**
     * The Amazon Resource Name (ARN) of the container recipe that is used for this pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-containerrecipearn
     */
    public containerRecipeArn: string | undefined;

    /**
     * The description of this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-description
     */
    public description: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of the distribution configuration associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-distributionconfigurationarn
     */
    public distributionConfigurationArn: string | undefined;

    /**
     * Collects additional information about the image being created, including the operating system (OS) version and package list. This information is used to enhance the overall experience of using EC2 Image Builder. Enabled by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-enhancedimagemetadataenabled
     */
    public enhancedImageMetadataEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * The Amazon Resource Name (ARN) of the image recipe associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-imagerecipearn
     */
    public imageRecipeArn: string | undefined;

    /**
     * The configuration of the image tests that run after image creation to ensure the quality of the image that was created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-imagetestsconfiguration
     */
    public imageTestsConfiguration: CfnImagePipeline.ImageTestsConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The schedule of the image pipeline. A schedule configures how often and when a pipeline automatically creates a new image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-schedule
     */
    public schedule: CfnImagePipeline.ScheduleProperty | cdk.IResolvable | undefined;

    /**
     * The status of the image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-status
     */
    public status: string | undefined;

    /**
     * The tags of this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ImageBuilder::ImagePipeline`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnImagePipelineProps) {
        super(scope, id, { type: CfnImagePipeline.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'infrastructureConfigurationArn', this);
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));

        this.infrastructureConfigurationArn = props.infrastructureConfigurationArn;
        this.name = props.name;
        this.containerRecipeArn = props.containerRecipeArn;
        this.description = props.description;
        this.distributionConfigurationArn = props.distributionConfigurationArn;
        this.enhancedImageMetadataEnabled = props.enhancedImageMetadataEnabled;
        this.imageRecipeArn = props.imageRecipeArn;
        this.imageTestsConfiguration = props.imageTestsConfiguration;
        this.schedule = props.schedule;
        this.status = props.status;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ImageBuilder::ImagePipeline", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnImagePipeline.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            infrastructureConfigurationArn: this.infrastructureConfigurationArn,
            name: this.name,
            containerRecipeArn: this.containerRecipeArn,
            description: this.description,
            distributionConfigurationArn: this.distributionConfigurationArn,
            enhancedImageMetadataEnabled: this.enhancedImageMetadataEnabled,
            imageRecipeArn: this.imageRecipeArn,
            imageTestsConfiguration: this.imageTestsConfiguration,
            schedule: this.schedule,
            status: this.status,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnImagePipelinePropsToCloudFormation(props);
    }
}

export namespace CfnImagePipeline {
    /**
     * When you create an image or container recipe with Image Builder , you can add the build or test components that your image pipeline uses to create the final image. You must have at least one build component to create a recipe, but test components are not required. Your pipeline runs tests after it builds the image, to ensure that the target image is functional and can be used reliably for launching Amazon EC2 instances.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-imagetestsconfiguration.html
     */
    export interface ImageTestsConfigurationProperty {
        /**
         * Defines if tests should be executed when building this image. For example, `true` or `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-imagetestsconfiguration.html#cfn-imagebuilder-imagepipeline-imagetestsconfiguration-imagetestsenabled
         */
        readonly imageTestsEnabled?: boolean | cdk.IResolvable;
        /**
         * The maximum time in minutes that tests are permitted to run.
         *
         * > The timeoutMinutes attribute is not currently active. This value is ignored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-imagetestsconfiguration.html#cfn-imagebuilder-imagepipeline-imagetestsconfiguration-timeoutminutes
         */
        readonly timeoutMinutes?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ImageTestsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ImageTestsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnImagePipeline_ImageTestsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('imageTestsEnabled', cdk.validateBoolean)(properties.imageTestsEnabled));
    errors.collect(cdk.propertyValidator('timeoutMinutes', cdk.validateNumber)(properties.timeoutMinutes));
    return errors.wrap('supplied properties not correct for "ImageTestsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ImagePipeline.ImageTestsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ImageTestsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ImagePipeline.ImageTestsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnImagePipelineImageTestsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnImagePipeline_ImageTestsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ImageTestsEnabled: cdk.booleanToCloudFormation(properties.imageTestsEnabled),
        TimeoutMinutes: cdk.numberToCloudFormation(properties.timeoutMinutes),
    };
}

// @ts-ignore TS6133
function CfnImagePipelineImageTestsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImagePipeline.ImageTestsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImagePipeline.ImageTestsConfigurationProperty>();
    ret.addPropertyResult('imageTestsEnabled', 'ImageTestsEnabled', properties.ImageTestsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ImageTestsEnabled) : undefined);
    ret.addPropertyResult('timeoutMinutes', 'TimeoutMinutes', properties.TimeoutMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutMinutes) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnImagePipeline {
    /**
     * A schedule configures how often and when a pipeline will automatically create a new image.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-schedule.html
     */
    export interface ScheduleProperty {
        /**
         * The condition configures when the pipeline should trigger a new image build. When the `pipelineExecutionStartCondition` is set to `EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE` , and you use semantic version filters on the base image or components in your image recipe, Image Builder will build a new image only when there are new versions of the image or components in your recipe that match the semantic version filter. When it is set to `EXPRESSION_MATCH_ONLY` , it will build a new image every time the CRON expression matches the current time. For semantic version syntax, see [CreateComponent](https://docs.aws.amazon.com/imagebuilder/latest/APIReference/API_CreateComponent.html) in the *Image Builder API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-schedule.html#cfn-imagebuilder-imagepipeline-schedule-pipelineexecutionstartcondition
         */
        readonly pipelineExecutionStartCondition?: string;
        /**
         * The cron expression determines how often EC2 Image Builder evaluates your `pipelineExecutionStartCondition` .
         *
         * For information on how to format a cron expression in Image Builder, see [Use cron expressions in EC2 Image Builder](https://docs.aws.amazon.com/imagebuilder/latest/userguide/image-builder-cron.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-schedule.html#cfn-imagebuilder-imagepipeline-schedule-scheduleexpression
         */
        readonly scheduleExpression?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ScheduleProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleProperty`
 *
 * @returns the result of the validation.
 */
function CfnImagePipeline_SchedulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('pipelineExecutionStartCondition', cdk.validateString)(properties.pipelineExecutionStartCondition));
    errors.collect(cdk.propertyValidator('scheduleExpression', cdk.validateString)(properties.scheduleExpression));
    return errors.wrap('supplied properties not correct for "ScheduleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ImagePipeline.Schedule` resource
 *
 * @param properties - the TypeScript properties of a `ScheduleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ImagePipeline.Schedule` resource.
 */
// @ts-ignore TS6133
function cfnImagePipelineSchedulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnImagePipeline_SchedulePropertyValidator(properties).assertSuccess();
    return {
        PipelineExecutionStartCondition: cdk.stringToCloudFormation(properties.pipelineExecutionStartCondition),
        ScheduleExpression: cdk.stringToCloudFormation(properties.scheduleExpression),
    };
}

// @ts-ignore TS6133
function CfnImagePipelineSchedulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImagePipeline.ScheduleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImagePipeline.ScheduleProperty>();
    ret.addPropertyResult('pipelineExecutionStartCondition', 'PipelineExecutionStartCondition', properties.PipelineExecutionStartCondition != null ? cfn_parse.FromCloudFormation.getString(properties.PipelineExecutionStartCondition) : undefined);
    ret.addPropertyResult('scheduleExpression', 'ScheduleExpression', properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnImageRecipe`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html
 */
export interface CfnImageRecipeProps {

    /**
     * The components of the image recipe. Components are orchestration documents that define a sequence of steps for downloading, installing, configuring, and testing software packages. They also define validation and security hardening steps. A component is defined using a YAML document format.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-components
     */
    readonly components: Array<CfnImageRecipe.ComponentConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-name
     */
    readonly name: string;

    /**
     * The parent image of the image recipe. The string must be either an Image ARN or an AMI ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-parentimage
     */
    readonly parentImage: string;

    /**
     * The semantic version of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-version
     */
    readonly version: string;

    /**
     * Before you create a new AMI, Image Builder launches temporary Amazon EC2 instances to build and test your image configuration. Instance configuration adds a layer of control over those instances. You can define settings and add scripts to run when an instance is launched from your AMI.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-additionalinstanceconfiguration
     */
    readonly additionalInstanceConfiguration?: CfnImageRecipe.AdditionalInstanceConfigurationProperty | cdk.IResolvable;

    /**
     * The block device mappings to apply when creating images from this recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-blockdevicemappings
     */
    readonly blockDeviceMappings?: Array<CfnImageRecipe.InstanceBlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The description of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-description
     */
    readonly description?: string;

    /**
     * The tags of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-tags
     */
    readonly tags?: { [key: string]: (string) };

    /**
     * The working directory to be used during build and test workflows.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-workingdirectory
     */
    readonly workingDirectory?: string;
}

/**
 * Determine whether the given properties match those of a `CfnImageRecipeProps`
 *
 * @param properties - the TypeScript properties of a `CfnImageRecipeProps`
 *
 * @returns the result of the validation.
 */
function CfnImageRecipePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('additionalInstanceConfiguration', CfnImageRecipe_AdditionalInstanceConfigurationPropertyValidator)(properties.additionalInstanceConfiguration));
    errors.collect(cdk.propertyValidator('blockDeviceMappings', cdk.listValidator(CfnImageRecipe_InstanceBlockDeviceMappingPropertyValidator))(properties.blockDeviceMappings));
    errors.collect(cdk.propertyValidator('components', cdk.requiredValidator)(properties.components));
    errors.collect(cdk.propertyValidator('components', cdk.listValidator(CfnImageRecipe_ComponentConfigurationPropertyValidator))(properties.components));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('parentImage', cdk.requiredValidator)(properties.parentImage));
    errors.collect(cdk.propertyValidator('parentImage', cdk.validateString)(properties.parentImage));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('version', cdk.requiredValidator)(properties.version));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    errors.collect(cdk.propertyValidator('workingDirectory', cdk.validateString)(properties.workingDirectory));
    return errors.wrap('supplied properties not correct for "CfnImageRecipeProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ImageRecipe` resource
 *
 * @param properties - the TypeScript properties of a `CfnImageRecipeProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ImageRecipe` resource.
 */
// @ts-ignore TS6133
function cfnImageRecipePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnImageRecipePropsValidator(properties).assertSuccess();
    return {
        Components: cdk.listMapper(cfnImageRecipeComponentConfigurationPropertyToCloudFormation)(properties.components),
        Name: cdk.stringToCloudFormation(properties.name),
        ParentImage: cdk.stringToCloudFormation(properties.parentImage),
        Version: cdk.stringToCloudFormation(properties.version),
        AdditionalInstanceConfiguration: cfnImageRecipeAdditionalInstanceConfigurationPropertyToCloudFormation(properties.additionalInstanceConfiguration),
        BlockDeviceMappings: cdk.listMapper(cfnImageRecipeInstanceBlockDeviceMappingPropertyToCloudFormation)(properties.blockDeviceMappings),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
        WorkingDirectory: cdk.stringToCloudFormation(properties.workingDirectory),
    };
}

// @ts-ignore TS6133
function CfnImageRecipePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageRecipeProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageRecipeProps>();
    ret.addPropertyResult('components', 'Components', cfn_parse.FromCloudFormation.getArray(CfnImageRecipeComponentConfigurationPropertyFromCloudFormation)(properties.Components));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('parentImage', 'ParentImage', cfn_parse.FromCloudFormation.getString(properties.ParentImage));
    ret.addPropertyResult('version', 'Version', cfn_parse.FromCloudFormation.getString(properties.Version));
    ret.addPropertyResult('additionalInstanceConfiguration', 'AdditionalInstanceConfiguration', properties.AdditionalInstanceConfiguration != null ? CfnImageRecipeAdditionalInstanceConfigurationPropertyFromCloudFormation(properties.AdditionalInstanceConfiguration) : undefined);
    ret.addPropertyResult('blockDeviceMappings', 'BlockDeviceMappings', properties.BlockDeviceMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnImageRecipeInstanceBlockDeviceMappingPropertyFromCloudFormation)(properties.BlockDeviceMappings) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addPropertyResult('workingDirectory', 'WorkingDirectory', properties.WorkingDirectory != null ? cfn_parse.FromCloudFormation.getString(properties.WorkingDirectory) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ImageBuilder::ImageRecipe`
 *
 * An Image Builder image recipe is a document that defines the base image and the components to be applied to the base image to produce the desired configuration for the output image. You can use an image recipe to duplicate builds. Image Builder image recipes can be shared, branched, and edited using the console wizard, the AWS CLI , or the API. You can use image recipes with your version control software to maintain shareable versioned image recipes.
 *
 * @cloudformationResource AWS::ImageBuilder::ImageRecipe
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html
 */
export class CfnImageRecipe extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ImageBuilder::ImageRecipe";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnImageRecipe {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnImageRecipePropsFromCloudFormation(resourceProperties);
        const ret = new CfnImageRecipe(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the Amazon Resource Name (ARN) of the image recipe. For example, `arn:aws:imagebuilder:us-east-1:123456789012:image-recipe/mybasicrecipe/2019.12.03` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the image recipe.
     * @cloudformationAttribute Name
     */
    public readonly attrName: string;

    /**
     * The components of the image recipe. Components are orchestration documents that define a sequence of steps for downloading, installing, configuring, and testing software packages. They also define validation and security hardening steps. A component is defined using a YAML document format.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-components
     */
    public components: Array<CfnImageRecipe.ComponentConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-name
     */
    public name: string;

    /**
     * The parent image of the image recipe. The string must be either an Image ARN or an AMI ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-parentimage
     */
    public parentImage: string;

    /**
     * The semantic version of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-version
     */
    public version: string;

    /**
     * Before you create a new AMI, Image Builder launches temporary Amazon EC2 instances to build and test your image configuration. Instance configuration adds a layer of control over those instances. You can define settings and add scripts to run when an instance is launched from your AMI.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-additionalinstanceconfiguration
     */
    public additionalInstanceConfiguration: CfnImageRecipe.AdditionalInstanceConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The block device mappings to apply when creating images from this recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-blockdevicemappings
     */
    public blockDeviceMappings: Array<CfnImageRecipe.InstanceBlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The description of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-description
     */
    public description: string | undefined;

    /**
     * The tags of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The working directory to be used during build and test workflows.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-workingdirectory
     */
    public workingDirectory: string | undefined;

    /**
     * Create a new `AWS::ImageBuilder::ImageRecipe`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnImageRecipeProps) {
        super(scope, id, { type: CfnImageRecipe.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'components', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'parentImage', this);
        cdk.requireProperty(props, 'version', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));

        this.components = props.components;
        this.name = props.name;
        this.parentImage = props.parentImage;
        this.version = props.version;
        this.additionalInstanceConfiguration = props.additionalInstanceConfiguration;
        this.blockDeviceMappings = props.blockDeviceMappings;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ImageBuilder::ImageRecipe", props.tags, { tagPropertyName: 'tags' });
        this.workingDirectory = props.workingDirectory;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnImageRecipe.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            components: this.components,
            name: this.name,
            parentImage: this.parentImage,
            version: this.version,
            additionalInstanceConfiguration: this.additionalInstanceConfiguration,
            blockDeviceMappings: this.blockDeviceMappings,
            description: this.description,
            tags: this.tags.renderTags(),
            workingDirectory: this.workingDirectory,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnImageRecipePropsToCloudFormation(props);
    }
}

export namespace CfnImageRecipe {
    /**
     * In addition to your infrastructure configuration, these settings provide an extra layer of control over your build instances. You can also specify commands to run on launch for all of your build instances.
     *
     * Image Builder does not automatically install the Systems Manager agent on Windows instances. If your base image includes the Systems Manager agent, then the AMI that you create will also include the agent. For Linux instances, if the base image does not already include the Systems Manager agent, Image Builder installs it. For Linux instances where Image Builder installs the Systems Manager agent, you can choose whether to keep it for the AMI that you create.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-additionalinstanceconfiguration.html
     */
    export interface AdditionalInstanceConfigurationProperty {
        /**
         * Contains settings for the Systems Manager agent on your build instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-additionalinstanceconfiguration.html#cfn-imagebuilder-imagerecipe-additionalinstanceconfiguration-systemsmanageragent
         */
        readonly systemsManagerAgent?: CfnImageRecipe.SystemsManagerAgentProperty | cdk.IResolvable;
        /**
         * Use this property to provide commands or a command script to run when you launch your build instance.
         *
         * The userDataOverride property replaces any commands that Image Builder might have added to ensure that Systems Manager is installed on your Linux build instance. If you override the user data, make sure that you add commands to install Systems Manager, if it is not pre-installed on your base image.
         *
         * > The user data is always base 64 encoded. For example, the following commands are encoded as `IyEvYmluL2Jhc2gKbWtkaXIgLXAgL3Zhci9iYi8KdG91Y2ggL3Zhci$` :
         * >
         * > *#!/bin/bash*
         * >
         * > mkdir -p /var/bb/
         * >
         * > touch /var
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-additionalinstanceconfiguration.html#cfn-imagebuilder-imagerecipe-additionalinstanceconfiguration-userdataoverride
         */
        readonly userDataOverride?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AdditionalInstanceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AdditionalInstanceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnImageRecipe_AdditionalInstanceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('systemsManagerAgent', CfnImageRecipe_SystemsManagerAgentPropertyValidator)(properties.systemsManagerAgent));
    errors.collect(cdk.propertyValidator('userDataOverride', cdk.validateString)(properties.userDataOverride));
    return errors.wrap('supplied properties not correct for "AdditionalInstanceConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ImageRecipe.AdditionalInstanceConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `AdditionalInstanceConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ImageRecipe.AdditionalInstanceConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnImageRecipeAdditionalInstanceConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnImageRecipe_AdditionalInstanceConfigurationPropertyValidator(properties).assertSuccess();
    return {
        SystemsManagerAgent: cfnImageRecipeSystemsManagerAgentPropertyToCloudFormation(properties.systemsManagerAgent),
        UserDataOverride: cdk.stringToCloudFormation(properties.userDataOverride),
    };
}

// @ts-ignore TS6133
function CfnImageRecipeAdditionalInstanceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageRecipe.AdditionalInstanceConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageRecipe.AdditionalInstanceConfigurationProperty>();
    ret.addPropertyResult('systemsManagerAgent', 'SystemsManagerAgent', properties.SystemsManagerAgent != null ? CfnImageRecipeSystemsManagerAgentPropertyFromCloudFormation(properties.SystemsManagerAgent) : undefined);
    ret.addPropertyResult('userDataOverride', 'UserDataOverride', properties.UserDataOverride != null ? cfn_parse.FromCloudFormation.getString(properties.UserDataOverride) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnImageRecipe {
    /**
     * Configuration details of the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentconfiguration.html
     */
    export interface ComponentConfigurationProperty {
        /**
         * The Amazon Resource Name (ARN) of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentconfiguration.html#cfn-imagebuilder-imagerecipe-componentconfiguration-componentarn
         */
        readonly componentArn?: string;
        /**
         * A group of parameter settings that Image Builder uses to configure the component for a specific recipe.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentconfiguration.html#cfn-imagebuilder-imagerecipe-componentconfiguration-parameters
         */
        readonly parameters?: Array<CfnImageRecipe.ComponentParameterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnImageRecipe_ComponentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('componentArn', cdk.validateString)(properties.componentArn));
    errors.collect(cdk.propertyValidator('parameters', cdk.listValidator(CfnImageRecipe_ComponentParameterPropertyValidator))(properties.parameters));
    return errors.wrap('supplied properties not correct for "ComponentConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ImageRecipe.ComponentConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ComponentConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ImageRecipe.ComponentConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnImageRecipeComponentConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnImageRecipe_ComponentConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ComponentArn: cdk.stringToCloudFormation(properties.componentArn),
        Parameters: cdk.listMapper(cfnImageRecipeComponentParameterPropertyToCloudFormation)(properties.parameters),
    };
}

// @ts-ignore TS6133
function CfnImageRecipeComponentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageRecipe.ComponentConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageRecipe.ComponentConfigurationProperty>();
    ret.addPropertyResult('componentArn', 'ComponentArn', properties.ComponentArn != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentArn) : undefined);
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? cfn_parse.FromCloudFormation.getArray(CfnImageRecipeComponentParameterPropertyFromCloudFormation)(properties.Parameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnImageRecipe {
    /**
     * Contains a key/value pair that sets the named component parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentparameter.html
     */
    export interface ComponentParameterProperty {
        /**
         * The name of the component parameter to set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentparameter.html#cfn-imagebuilder-imagerecipe-componentparameter-name
         */
        readonly name: string;
        /**
         * Sets the value for the named component parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentparameter.html#cfn-imagebuilder-imagerecipe-componentparameter-value
         */
        readonly value: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ComponentParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnImageRecipe_ComponentParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.listValidator(cdk.validateString))(properties.value));
    return errors.wrap('supplied properties not correct for "ComponentParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ImageRecipe.ComponentParameter` resource
 *
 * @param properties - the TypeScript properties of a `ComponentParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ImageRecipe.ComponentParameter` resource.
 */
// @ts-ignore TS6133
function cfnImageRecipeComponentParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnImageRecipe_ComponentParameterPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cdk.listMapper(cdk.stringToCloudFormation)(properties.value),
    };
}

// @ts-ignore TS6133
function CfnImageRecipeComponentParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageRecipe.ComponentParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageRecipe.ComponentParameterProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getStringArray(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnImageRecipe {
    /**
     * The image recipe EBS instance block device specification includes the Amazon EBS-specific block device mapping specifications for the image.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html
     */
    export interface EbsInstanceBlockDeviceSpecificationProperty {
        /**
         * Configures delete on termination of the associated device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-deleteontermination
         */
        readonly deleteOnTermination?: boolean | cdk.IResolvable;
        /**
         * Use to configure device encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-encrypted
         */
        readonly encrypted?: boolean | cdk.IResolvable;
        /**
         * Use to configure device IOPS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-iops
         */
        readonly iops?: number;
        /**
         * Use to configure the KMS key to use when encrypting the device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-kmskeyid
         */
        readonly kmsKeyId?: string;
        /**
         * The snapshot that defines the device contents.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-snapshotid
         */
        readonly snapshotId?: string;
        /**
         * *For GP3 volumes only* – The throughput in MiB/s that the volume supports.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-throughput
         */
        readonly throughput?: number;
        /**
         * Overrides the volume size of the device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-volumesize
         */
        readonly volumeSize?: number;
        /**
         * Overrides the volume type of the device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-volumetype
         */
        readonly volumeType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EbsInstanceBlockDeviceSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `EbsInstanceBlockDeviceSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnImageRecipe_EbsInstanceBlockDeviceSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deleteOnTermination', cdk.validateBoolean)(properties.deleteOnTermination));
    errors.collect(cdk.propertyValidator('encrypted', cdk.validateBoolean)(properties.encrypted));
    errors.collect(cdk.propertyValidator('iops', cdk.validateNumber)(properties.iops));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('snapshotId', cdk.validateString)(properties.snapshotId));
    errors.collect(cdk.propertyValidator('throughput', cdk.validateNumber)(properties.throughput));
    errors.collect(cdk.propertyValidator('volumeSize', cdk.validateNumber)(properties.volumeSize));
    errors.collect(cdk.propertyValidator('volumeType', cdk.validateString)(properties.volumeType));
    return errors.wrap('supplied properties not correct for "EbsInstanceBlockDeviceSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ImageRecipe.EbsInstanceBlockDeviceSpecification` resource
 *
 * @param properties - the TypeScript properties of a `EbsInstanceBlockDeviceSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ImageRecipe.EbsInstanceBlockDeviceSpecification` resource.
 */
// @ts-ignore TS6133
function cfnImageRecipeEbsInstanceBlockDeviceSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnImageRecipe_EbsInstanceBlockDeviceSpecificationPropertyValidator(properties).assertSuccess();
    return {
        DeleteOnTermination: cdk.booleanToCloudFormation(properties.deleteOnTermination),
        Encrypted: cdk.booleanToCloudFormation(properties.encrypted),
        Iops: cdk.numberToCloudFormation(properties.iops),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        SnapshotId: cdk.stringToCloudFormation(properties.snapshotId),
        Throughput: cdk.numberToCloudFormation(properties.throughput),
        VolumeSize: cdk.numberToCloudFormation(properties.volumeSize),
        VolumeType: cdk.stringToCloudFormation(properties.volumeType),
    };
}

// @ts-ignore TS6133
function CfnImageRecipeEbsInstanceBlockDeviceSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageRecipe.EbsInstanceBlockDeviceSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageRecipe.EbsInstanceBlockDeviceSpecificationProperty>();
    ret.addPropertyResult('deleteOnTermination', 'DeleteOnTermination', properties.DeleteOnTermination != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteOnTermination) : undefined);
    ret.addPropertyResult('encrypted', 'Encrypted', properties.Encrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Encrypted) : undefined);
    ret.addPropertyResult('iops', 'Iops', properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('snapshotId', 'SnapshotId', properties.SnapshotId != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotId) : undefined);
    ret.addPropertyResult('throughput', 'Throughput', properties.Throughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.Throughput) : undefined);
    ret.addPropertyResult('volumeSize', 'VolumeSize', properties.VolumeSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumeSize) : undefined);
    ret.addPropertyResult('volumeType', 'VolumeType', properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnImageRecipe {
    /**
     * Defines block device mappings for the instance used to configure your image.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-instanceblockdevicemapping.html
     */
    export interface InstanceBlockDeviceMappingProperty {
        /**
         * The device to which these mappings apply.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-instanceblockdevicemapping.html#cfn-imagebuilder-imagerecipe-instanceblockdevicemapping-devicename
         */
        readonly deviceName?: string;
        /**
         * Use to manage Amazon EBS-specific configuration for this mapping.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-instanceblockdevicemapping.html#cfn-imagebuilder-imagerecipe-instanceblockdevicemapping-ebs
         */
        readonly ebs?: CfnImageRecipe.EbsInstanceBlockDeviceSpecificationProperty | cdk.IResolvable;
        /**
         * Enter an empty string to remove a mapping from the parent image.
         *
         * The following is an example of an empty string value in the `NoDevice` field.
         *
         * `NoDevice:""`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-instanceblockdevicemapping.html#cfn-imagebuilder-imagerecipe-instanceblockdevicemapping-nodevice
         */
        readonly noDevice?: string;
        /**
         * Manages the instance ephemeral devices.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-instanceblockdevicemapping.html#cfn-imagebuilder-imagerecipe-instanceblockdevicemapping-virtualname
         */
        readonly virtualName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `InstanceBlockDeviceMappingProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceBlockDeviceMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnImageRecipe_InstanceBlockDeviceMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deviceName', cdk.validateString)(properties.deviceName));
    errors.collect(cdk.propertyValidator('ebs', CfnImageRecipe_EbsInstanceBlockDeviceSpecificationPropertyValidator)(properties.ebs));
    errors.collect(cdk.propertyValidator('noDevice', cdk.validateString)(properties.noDevice));
    errors.collect(cdk.propertyValidator('virtualName', cdk.validateString)(properties.virtualName));
    return errors.wrap('supplied properties not correct for "InstanceBlockDeviceMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ImageRecipe.InstanceBlockDeviceMapping` resource
 *
 * @param properties - the TypeScript properties of a `InstanceBlockDeviceMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ImageRecipe.InstanceBlockDeviceMapping` resource.
 */
// @ts-ignore TS6133
function cfnImageRecipeInstanceBlockDeviceMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnImageRecipe_InstanceBlockDeviceMappingPropertyValidator(properties).assertSuccess();
    return {
        DeviceName: cdk.stringToCloudFormation(properties.deviceName),
        Ebs: cfnImageRecipeEbsInstanceBlockDeviceSpecificationPropertyToCloudFormation(properties.ebs),
        NoDevice: cdk.stringToCloudFormation(properties.noDevice),
        VirtualName: cdk.stringToCloudFormation(properties.virtualName),
    };
}

// @ts-ignore TS6133
function CfnImageRecipeInstanceBlockDeviceMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageRecipe.InstanceBlockDeviceMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageRecipe.InstanceBlockDeviceMappingProperty>();
    ret.addPropertyResult('deviceName', 'DeviceName', properties.DeviceName != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceName) : undefined);
    ret.addPropertyResult('ebs', 'Ebs', properties.Ebs != null ? CfnImageRecipeEbsInstanceBlockDeviceSpecificationPropertyFromCloudFormation(properties.Ebs) : undefined);
    ret.addPropertyResult('noDevice', 'NoDevice', properties.NoDevice != null ? cfn_parse.FromCloudFormation.getString(properties.NoDevice) : undefined);
    ret.addPropertyResult('virtualName', 'VirtualName', properties.VirtualName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnImageRecipe {
    /**
     * Contains settings for the Systems Manager agent on your build instance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-systemsmanageragent.html
     */
    export interface SystemsManagerAgentProperty {
        /**
         * Controls whether the Systems Manager agent is removed from your final build image, prior to creating the new AMI. If this is set to true, then the agent is removed from the final image. If it's set to false, then the agent is left in, so that it is included in the new AMI. The default value is false.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-systemsmanageragent.html#cfn-imagebuilder-imagerecipe-systemsmanageragent-uninstallafterbuild
         */
        readonly uninstallAfterBuild?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SystemsManagerAgentProperty`
 *
 * @param properties - the TypeScript properties of a `SystemsManagerAgentProperty`
 *
 * @returns the result of the validation.
 */
function CfnImageRecipe_SystemsManagerAgentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('uninstallAfterBuild', cdk.validateBoolean)(properties.uninstallAfterBuild));
    return errors.wrap('supplied properties not correct for "SystemsManagerAgentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::ImageRecipe.SystemsManagerAgent` resource
 *
 * @param properties - the TypeScript properties of a `SystemsManagerAgentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::ImageRecipe.SystemsManagerAgent` resource.
 */
// @ts-ignore TS6133
function cfnImageRecipeSystemsManagerAgentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnImageRecipe_SystemsManagerAgentPropertyValidator(properties).assertSuccess();
    return {
        UninstallAfterBuild: cdk.booleanToCloudFormation(properties.uninstallAfterBuild),
    };
}

// @ts-ignore TS6133
function CfnImageRecipeSystemsManagerAgentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageRecipe.SystemsManagerAgentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageRecipe.SystemsManagerAgentProperty>();
    ret.addPropertyResult('uninstallAfterBuild', 'UninstallAfterBuild', properties.UninstallAfterBuild != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UninstallAfterBuild) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnInfrastructureConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html
 */
export interface CfnInfrastructureConfigurationProps {

    /**
     * The instance profile of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-instanceprofilename
     */
    readonly instanceProfileName: string;

    /**
     * The name of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-name
     */
    readonly name: string;

    /**
     * The description of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-description
     */
    readonly description?: string;

    /**
     * The instance metadata option settings for the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-instancemetadataoptions
     */
    readonly instanceMetadataOptions?: CfnInfrastructureConfiguration.InstanceMetadataOptionsProperty | cdk.IResolvable;

    /**
     * The instance types of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-instancetypes
     */
    readonly instanceTypes?: string[];

    /**
     * The Amazon EC2 key pair of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-keypair
     */
    readonly keyPair?: string;

    /**
     * The logging configuration defines where Image Builder uploads your logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-logging
     */
    readonly logging?: CfnInfrastructureConfiguration.LoggingProperty | cdk.IResolvable;

    /**
     * The tags attached to the resource created by Image Builder.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-resourcetags
     */
    readonly resourceTags?: { [key: string]: (string) } | cdk.IResolvable;

    /**
     * The security group IDs of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-securitygroupids
     */
    readonly securityGroupIds?: string[];

    /**
     * The Amazon Resource Name (ARN) of the SNS topic for the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-snstopicarn
     */
    readonly snsTopicArn?: string;

    /**
     * The subnet ID of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-subnetid
     */
    readonly subnetId?: string;

    /**
     * The tags of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-tags
     */
    readonly tags?: { [key: string]: (string) };

    /**
     * The terminate instance on failure configuration of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-terminateinstanceonfailure
     */
    readonly terminateInstanceOnFailure?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnInfrastructureConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnInfrastructureConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnInfrastructureConfigurationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('instanceMetadataOptions', CfnInfrastructureConfiguration_InstanceMetadataOptionsPropertyValidator)(properties.instanceMetadataOptions));
    errors.collect(cdk.propertyValidator('instanceProfileName', cdk.requiredValidator)(properties.instanceProfileName));
    errors.collect(cdk.propertyValidator('instanceProfileName', cdk.validateString)(properties.instanceProfileName));
    errors.collect(cdk.propertyValidator('instanceTypes', cdk.listValidator(cdk.validateString))(properties.instanceTypes));
    errors.collect(cdk.propertyValidator('keyPair', cdk.validateString)(properties.keyPair));
    errors.collect(cdk.propertyValidator('logging', CfnInfrastructureConfiguration_LoggingPropertyValidator)(properties.logging));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('resourceTags', cdk.hashValidator(cdk.validateString))(properties.resourceTags));
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('snsTopicArn', cdk.validateString)(properties.snsTopicArn));
    errors.collect(cdk.propertyValidator('subnetId', cdk.validateString)(properties.subnetId));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('terminateInstanceOnFailure', cdk.validateBoolean)(properties.terminateInstanceOnFailure));
    return errors.wrap('supplied properties not correct for "CfnInfrastructureConfigurationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::InfrastructureConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CfnInfrastructureConfigurationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::InfrastructureConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnInfrastructureConfigurationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInfrastructureConfigurationPropsValidator(properties).assertSuccess();
    return {
        InstanceProfileName: cdk.stringToCloudFormation(properties.instanceProfileName),
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        InstanceMetadataOptions: cfnInfrastructureConfigurationInstanceMetadataOptionsPropertyToCloudFormation(properties.instanceMetadataOptions),
        InstanceTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.instanceTypes),
        KeyPair: cdk.stringToCloudFormation(properties.keyPair),
        Logging: cfnInfrastructureConfigurationLoggingPropertyToCloudFormation(properties.logging),
        ResourceTags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.resourceTags),
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SnsTopicArn: cdk.stringToCloudFormation(properties.snsTopicArn),
        SubnetId: cdk.stringToCloudFormation(properties.subnetId),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
        TerminateInstanceOnFailure: cdk.booleanToCloudFormation(properties.terminateInstanceOnFailure),
    };
}

// @ts-ignore TS6133
function CfnInfrastructureConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInfrastructureConfigurationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInfrastructureConfigurationProps>();
    ret.addPropertyResult('instanceProfileName', 'InstanceProfileName', cfn_parse.FromCloudFormation.getString(properties.InstanceProfileName));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('instanceMetadataOptions', 'InstanceMetadataOptions', properties.InstanceMetadataOptions != null ? CfnInfrastructureConfigurationInstanceMetadataOptionsPropertyFromCloudFormation(properties.InstanceMetadataOptions) : undefined);
    ret.addPropertyResult('instanceTypes', 'InstanceTypes', properties.InstanceTypes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.InstanceTypes) : undefined);
    ret.addPropertyResult('keyPair', 'KeyPair', properties.KeyPair != null ? cfn_parse.FromCloudFormation.getString(properties.KeyPair) : undefined);
    ret.addPropertyResult('logging', 'Logging', properties.Logging != null ? CfnInfrastructureConfigurationLoggingPropertyFromCloudFormation(properties.Logging) : undefined);
    ret.addPropertyResult('resourceTags', 'ResourceTags', properties.ResourceTags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ResourceTags) : undefined);
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds) : undefined);
    ret.addPropertyResult('snsTopicArn', 'SnsTopicArn', properties.SnsTopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.SnsTopicArn) : undefined);
    ret.addPropertyResult('subnetId', 'SubnetId', properties.SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetId) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addPropertyResult('terminateInstanceOnFailure', 'TerminateInstanceOnFailure', properties.TerminateInstanceOnFailure != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TerminateInstanceOnFailure) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ImageBuilder::InfrastructureConfiguration`
 *
 * The infrastructure configuration allows you to specify the infrastructure within which to build and test your image. In the infrastructure configuration, you can specify instance types, subnets, and security groups to associate with your instance. You can also associate an Amazon EC2 key pair with the instance used to build your image. This allows you to log on to your instance to troubleshoot if your build fails and you set terminateInstanceOnFailure to false.
 *
 * @cloudformationResource AWS::ImageBuilder::InfrastructureConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html
 */
export class CfnInfrastructureConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ImageBuilder::InfrastructureConfiguration";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInfrastructureConfiguration {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnInfrastructureConfigurationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnInfrastructureConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the Amazon Resource Name (ARN) of the infrastructure configuration. The following pattern is applied: `^arn:aws[^:]*:imagebuilder:[^:]+:(?:\d{12}|aws):(?:image-recipe|infrastructure-configuration|distribution-configuration|component|image|image-pipeline)/[a-z0-9-_]+(?:/(?:(?:x|\d+)\.(?:x|\d+)\.(?:x|\d+))(?:/\d+)?)?$` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the infrastructure configuration.
     * @cloudformationAttribute Name
     */
    public readonly attrName: string;

    /**
     * The instance profile of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-instanceprofilename
     */
    public instanceProfileName: string;

    /**
     * The name of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-name
     */
    public name: string;

    /**
     * The description of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-description
     */
    public description: string | undefined;

    /**
     * The instance metadata option settings for the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-instancemetadataoptions
     */
    public instanceMetadataOptions: CfnInfrastructureConfiguration.InstanceMetadataOptionsProperty | cdk.IResolvable | undefined;

    /**
     * The instance types of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-instancetypes
     */
    public instanceTypes: string[] | undefined;

    /**
     * The Amazon EC2 key pair of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-keypair
     */
    public keyPair: string | undefined;

    /**
     * The logging configuration defines where Image Builder uploads your logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-logging
     */
    public logging: CfnInfrastructureConfiguration.LoggingProperty | cdk.IResolvable | undefined;

    /**
     * The tags attached to the resource created by Image Builder.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-resourcetags
     */
    public resourceTags: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * The security group IDs of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-securitygroupids
     */
    public securityGroupIds: string[] | undefined;

    /**
     * The Amazon Resource Name (ARN) of the SNS topic for the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-snstopicarn
     */
    public snsTopicArn: string | undefined;

    /**
     * The subnet ID of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-subnetid
     */
    public subnetId: string | undefined;

    /**
     * The tags of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The terminate instance on failure configuration of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-terminateinstanceonfailure
     */
    public terminateInstanceOnFailure: boolean | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::ImageBuilder::InfrastructureConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnInfrastructureConfigurationProps) {
        super(scope, id, { type: CfnInfrastructureConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'instanceProfileName', this);
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));

        this.instanceProfileName = props.instanceProfileName;
        this.name = props.name;
        this.description = props.description;
        this.instanceMetadataOptions = props.instanceMetadataOptions;
        this.instanceTypes = props.instanceTypes;
        this.keyPair = props.keyPair;
        this.logging = props.logging;
        this.resourceTags = props.resourceTags;
        this.securityGroupIds = props.securityGroupIds;
        this.snsTopicArn = props.snsTopicArn;
        this.subnetId = props.subnetId;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ImageBuilder::InfrastructureConfiguration", props.tags, { tagPropertyName: 'tags' });
        this.terminateInstanceOnFailure = props.terminateInstanceOnFailure;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnInfrastructureConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            instanceProfileName: this.instanceProfileName,
            name: this.name,
            description: this.description,
            instanceMetadataOptions: this.instanceMetadataOptions,
            instanceTypes: this.instanceTypes,
            keyPair: this.keyPair,
            logging: this.logging,
            resourceTags: this.resourceTags,
            securityGroupIds: this.securityGroupIds,
            snsTopicArn: this.snsTopicArn,
            subnetId: this.subnetId,
            tags: this.tags.renderTags(),
            terminateInstanceOnFailure: this.terminateInstanceOnFailure,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnInfrastructureConfigurationPropsToCloudFormation(props);
    }
}

export namespace CfnInfrastructureConfiguration {
    /**
     * The instance metadata options that apply to the HTTP requests that pipeline builds use to launch EC2 build and test instances. For more information about instance metadata options, see [Configure the instance metadata options](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-options.html) in the **Amazon EC2 User Guide** for Linux instances, or [Configure the instance metadata options](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/configuring-instance-metadata-options.html) in the **Amazon EC2 Windows Guide** for Windows instances.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-instancemetadataoptions.html
     */
    export interface InstanceMetadataOptionsProperty {
        /**
         * Limit the number of hops that an instance metadata request can traverse to reach its destination. The default is one hop. However, if HTTP tokens are required, container image builds need a minimum of two hops.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-instancemetadataoptions.html#cfn-imagebuilder-infrastructureconfiguration-instancemetadataoptions-httpputresponsehoplimit
         */
        readonly httpPutResponseHopLimit?: number;
        /**
         * Indicates whether a signed token header is required for instance metadata retrieval requests. The values affect the response as follows:
         *
         * - *required* – When you retrieve the IAM role credentials, version 2.0 credentials are returned in all cases.
         * - *optional* – You can include a signed token header in your request to retrieve instance metadata, or you can leave it out. If you include it, version 2.0 credentials are returned for the IAM role. Otherwise, version 1.0 credentials are returned.
         *
         * The default setting is *optional* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-instancemetadataoptions.html#cfn-imagebuilder-infrastructureconfiguration-instancemetadataoptions-httptokens
         */
        readonly httpTokens?: string;
    }
}

/**
 * Determine whether the given properties match those of a `InstanceMetadataOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceMetadataOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnInfrastructureConfiguration_InstanceMetadataOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('httpPutResponseHopLimit', cdk.validateNumber)(properties.httpPutResponseHopLimit));
    errors.collect(cdk.propertyValidator('httpTokens', cdk.validateString)(properties.httpTokens));
    return errors.wrap('supplied properties not correct for "InstanceMetadataOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::InfrastructureConfiguration.InstanceMetadataOptions` resource
 *
 * @param properties - the TypeScript properties of a `InstanceMetadataOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::InfrastructureConfiguration.InstanceMetadataOptions` resource.
 */
// @ts-ignore TS6133
function cfnInfrastructureConfigurationInstanceMetadataOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInfrastructureConfiguration_InstanceMetadataOptionsPropertyValidator(properties).assertSuccess();
    return {
        HttpPutResponseHopLimit: cdk.numberToCloudFormation(properties.httpPutResponseHopLimit),
        HttpTokens: cdk.stringToCloudFormation(properties.httpTokens),
    };
}

// @ts-ignore TS6133
function CfnInfrastructureConfigurationInstanceMetadataOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInfrastructureConfiguration.InstanceMetadataOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInfrastructureConfiguration.InstanceMetadataOptionsProperty>();
    ret.addPropertyResult('httpPutResponseHopLimit', 'HttpPutResponseHopLimit', properties.HttpPutResponseHopLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.HttpPutResponseHopLimit) : undefined);
    ret.addPropertyResult('httpTokens', 'HttpTokens', properties.HttpTokens != null ? cfn_parse.FromCloudFormation.getString(properties.HttpTokens) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInfrastructureConfiguration {
    /**
     * Logging configuration defines where Image Builder uploads your logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-logging.html
     */
    export interface LoggingProperty {
        /**
         * The Amazon S3 logging configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-logging.html#cfn-imagebuilder-infrastructureconfiguration-logging-s3logs
         */
        readonly s3Logs?: CfnInfrastructureConfiguration.S3LogsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LoggingProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingProperty`
 *
 * @returns the result of the validation.
 */
function CfnInfrastructureConfiguration_LoggingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3Logs', CfnInfrastructureConfiguration_S3LogsPropertyValidator)(properties.s3Logs));
    return errors.wrap('supplied properties not correct for "LoggingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::InfrastructureConfiguration.Logging` resource
 *
 * @param properties - the TypeScript properties of a `LoggingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::InfrastructureConfiguration.Logging` resource.
 */
// @ts-ignore TS6133
function cfnInfrastructureConfigurationLoggingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInfrastructureConfiguration_LoggingPropertyValidator(properties).assertSuccess();
    return {
        S3Logs: cfnInfrastructureConfigurationS3LogsPropertyToCloudFormation(properties.s3Logs),
    };
}

// @ts-ignore TS6133
function CfnInfrastructureConfigurationLoggingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInfrastructureConfiguration.LoggingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInfrastructureConfiguration.LoggingProperty>();
    ret.addPropertyResult('s3Logs', 'S3Logs', properties.S3Logs != null ? CfnInfrastructureConfigurationS3LogsPropertyFromCloudFormation(properties.S3Logs) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInfrastructureConfiguration {
    /**
     * Amazon S3 logging configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-s3logs.html
     */
    export interface S3LogsProperty {
        /**
         * The S3 bucket in which to store the logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-s3logs.html#cfn-imagebuilder-infrastructureconfiguration-s3logs-s3bucketname
         */
        readonly s3BucketName?: string;
        /**
         * The Amazon S3 path to the bucket where the logs are stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-s3logs.html#cfn-imagebuilder-infrastructureconfiguration-s3logs-s3keyprefix
         */
        readonly s3KeyPrefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3LogsProperty`
 *
 * @param properties - the TypeScript properties of a `S3LogsProperty`
 *
 * @returns the result of the validation.
 */
function CfnInfrastructureConfiguration_S3LogsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3BucketName', cdk.validateString)(properties.s3BucketName));
    errors.collect(cdk.propertyValidator('s3KeyPrefix', cdk.validateString)(properties.s3KeyPrefix));
    return errors.wrap('supplied properties not correct for "S3LogsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ImageBuilder::InfrastructureConfiguration.S3Logs` resource
 *
 * @param properties - the TypeScript properties of a `S3LogsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ImageBuilder::InfrastructureConfiguration.S3Logs` resource.
 */
// @ts-ignore TS6133
function cfnInfrastructureConfigurationS3LogsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInfrastructureConfiguration_S3LogsPropertyValidator(properties).assertSuccess();
    return {
        S3BucketName: cdk.stringToCloudFormation(properties.s3BucketName),
        S3KeyPrefix: cdk.stringToCloudFormation(properties.s3KeyPrefix),
    };
}

// @ts-ignore TS6133
function CfnInfrastructureConfigurationS3LogsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInfrastructureConfiguration.S3LogsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInfrastructureConfiguration.S3LogsProperty>();
    ret.addPropertyResult('s3BucketName', 'S3BucketName', properties.S3BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketName) : undefined);
    ret.addPropertyResult('s3KeyPrefix', 'S3KeyPrefix', properties.S3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3KeyPrefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
