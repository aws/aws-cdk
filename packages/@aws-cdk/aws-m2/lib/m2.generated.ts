// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:06.571Z","fingerprint":"Gu6hhzhVpk1ZamCbOGObjyLNMjALF99wMRb+hF+CWq8="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html
 */
export interface CfnApplicationProps {

    /**
     * The application definition for a particular application. You can specify either inline JSON or an Amazon S3 bucket location.
     *
     * For information about application definitions, see the [AWS Mainframe Modernization User Guide](https://docs.aws.amazon.com/m2/latest/userguide/applications-m2-definition.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-definition
     */
    readonly definition: CfnApplication.DefinitionProperty | cdk.IResolvable;

    /**
     * The type of the target platform for this application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-enginetype
     */
    readonly engineType: string;

    /**
     * The name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-name
     */
    readonly name: string;

    /**
     * The description of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-description
     */
    readonly description?: string;

    /**
     * The identifier of a customer managed key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the result of the validation.
 */
function CfnApplicationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('definition', cdk.requiredValidator)(properties.definition));
    errors.collect(cdk.propertyValidator('definition', CfnApplication_DefinitionPropertyValidator)(properties.definition));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('engineType', cdk.requiredValidator)(properties.engineType));
    errors.collect(cdk.propertyValidator('engineType', cdk.validateString)(properties.engineType));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnApplicationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::M2::Application` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::M2::Application` resource.
 */
// @ts-ignore TS6133
function cfnApplicationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationPropsValidator(properties).assertSuccess();
    return {
        Definition: cfnApplicationDefinitionPropertyToCloudFormation(properties.definition),
        EngineType: cdk.stringToCloudFormation(properties.engineType),
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
    ret.addPropertyResult('definition', 'Definition', CfnApplicationDefinitionPropertyFromCloudFormation(properties.Definition));
    ret.addPropertyResult('engineType', 'EngineType', cfn_parse.FromCloudFormation.getString(properties.EngineType));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::M2::Application`
 *
 * Specifies a new application with given parameters. Requires an existing runtime environment and application definition file.
 *
 * For information about application definitions, see the [AWS Mainframe Modernization User Guide](https://docs.aws.amazon.com/m2/latest/userguide/applications-m2-definition.html) .
 *
 * @cloudformationResource AWS::M2::Application
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::M2::Application";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnApplicationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnApplication(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the application.
     * @cloudformationAttribute ApplicationArn
     */
    public readonly attrApplicationArn: string;

    /**
     * The identifier of the application.
     * @cloudformationAttribute ApplicationId
     */
    public readonly attrApplicationId: string;

    /**
     * The application definition for a particular application. You can specify either inline JSON or an Amazon S3 bucket location.
     *
     * For information about application definitions, see the [AWS Mainframe Modernization User Guide](https://docs.aws.amazon.com/m2/latest/userguide/applications-m2-definition.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-definition
     */
    public definition: CfnApplication.DefinitionProperty | cdk.IResolvable;

    /**
     * The type of the target platform for this application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-enginetype
     */
    public engineType: string;

    /**
     * The name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-name
     */
    public name: string;

    /**
     * The description of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-description
     */
    public description: string | undefined;

    /**
     * The identifier of a customer managed key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-kmskeyid
     */
    public kmsKeyId: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-application.html#cfn-m2-application-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::M2::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
        super(scope, id, { type: CfnApplication.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'definition', this);
        cdk.requireProperty(props, 'engineType', this);
        cdk.requireProperty(props, 'name', this);
        this.attrApplicationArn = cdk.Token.asString(this.getAtt('ApplicationArn', cdk.ResolutionTypeHint.STRING));
        this.attrApplicationId = cdk.Token.asString(this.getAtt('ApplicationId', cdk.ResolutionTypeHint.STRING));

        this.definition = props.definition;
        this.engineType = props.engineType;
        this.name = props.name;
        this.description = props.description;
        this.kmsKeyId = props.kmsKeyId;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::M2::Application", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplication.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            definition: this.definition,
            engineType: this.engineType,
            name: this.name,
            description: this.description,
            kmsKeyId: this.kmsKeyId,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationPropsToCloudFormation(props);
    }
}

export namespace CfnApplication {
    /**
     * The application definition for a particular application. You can specify either inline JSON or an Amazon S3 bucket location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-application-definition.html
     */
    export interface DefinitionProperty {
        /**
         * The content of the application definition. This is a JSON object that contains the resource configuration/definitions that identify an application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-application-definition.html#cfn-m2-application-definition-content
         */
        readonly content?: string;
        /**
         * The S3 bucket that contains the application definition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-application-definition.html#cfn-m2-application-definition-s3location
         */
        readonly s3Location?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `DefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_DefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('content', cdk.validateString)(properties.content));
    errors.collect(cdk.propertyValidator('s3Location', cdk.validateString)(properties.s3Location));
    return errors.wrap('supplied properties not correct for "DefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::M2::Application.Definition` resource
 *
 * @param properties - the TypeScript properties of a `DefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::M2::Application.Definition` resource.
 */
// @ts-ignore TS6133
function cfnApplicationDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_DefinitionPropertyValidator(properties).assertSuccess();
    return {
        Content: cdk.stringToCloudFormation(properties.content),
        S3Location: cdk.stringToCloudFormation(properties.s3Location),
    };
}

// @ts-ignore TS6133
function CfnApplicationDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.DefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.DefinitionProperty>();
    ret.addPropertyResult('content', 'Content', properties.Content != null ? cfn_parse.FromCloudFormation.getString(properties.Content) : undefined);
    ret.addPropertyResult('s3Location', 'S3Location', properties.S3Location != null ? cfn_parse.FromCloudFormation.getString(properties.S3Location) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnEnvironment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html
 */
export interface CfnEnvironmentProps {

    /**
     * The target platform for the runtime environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-enginetype
     */
    readonly engineType: string;

    /**
     * The instance type of the runtime environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-instancetype
     */
    readonly instanceType: string;

    /**
     * The name of the runtime environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-name
     */
    readonly name: string;

    /**
     * The description of the runtime environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-description
     */
    readonly description?: string;

    /**
     * The version of the runtime engine.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-engineversion
     */
    readonly engineVersion?: string;

    /**
     * Defines the details of a high availability configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-highavailabilityconfig
     */
    readonly highAvailabilityConfig?: CfnEnvironment.HighAvailabilityConfigProperty | cdk.IResolvable;

    /**
     * The identifier of a customer managed key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * Configures the maintenance window you want for the runtime environment. If you do not provide a value, a random system-generated value will be assigned.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-preferredmaintenancewindow
     */
    readonly preferredMaintenanceWindow?: string;

    /**
     * Specifies whether the runtime environment is publicly accessible.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-publiclyaccessible
     */
    readonly publiclyAccessible?: boolean | cdk.IResolvable;

    /**
     * The list of security groups for the VPC associated with this runtime environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-securitygroupids
     */
    readonly securityGroupIds?: string[];

    /**
     * Defines the storage configuration for a runtime environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-storageconfigurations
     */
    readonly storageConfigurations?: Array<CfnEnvironment.StorageConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The list of subnets associated with the VPC for this runtime environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-subnetids
     */
    readonly subnetIds?: string[];

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnEnvironmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnEnvironmentProps`
 *
 * @returns the result of the validation.
 */
function CfnEnvironmentPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('engineType', cdk.requiredValidator)(properties.engineType));
    errors.collect(cdk.propertyValidator('engineType', cdk.validateString)(properties.engineType));
    errors.collect(cdk.propertyValidator('engineVersion', cdk.validateString)(properties.engineVersion));
    errors.collect(cdk.propertyValidator('highAvailabilityConfig', CfnEnvironment_HighAvailabilityConfigPropertyValidator)(properties.highAvailabilityConfig));
    errors.collect(cdk.propertyValidator('instanceType', cdk.requiredValidator)(properties.instanceType));
    errors.collect(cdk.propertyValidator('instanceType', cdk.validateString)(properties.instanceType));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('preferredMaintenanceWindow', cdk.validateString)(properties.preferredMaintenanceWindow));
    errors.collect(cdk.propertyValidator('publiclyAccessible', cdk.validateBoolean)(properties.publiclyAccessible));
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('storageConfigurations', cdk.listValidator(CfnEnvironment_StorageConfigurationPropertyValidator))(properties.storageConfigurations));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnEnvironmentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::M2::Environment` resource
 *
 * @param properties - the TypeScript properties of a `CfnEnvironmentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::M2::Environment` resource.
 */
// @ts-ignore TS6133
function cfnEnvironmentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnvironmentPropsValidator(properties).assertSuccess();
    return {
        EngineType: cdk.stringToCloudFormation(properties.engineType),
        InstanceType: cdk.stringToCloudFormation(properties.instanceType),
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        EngineVersion: cdk.stringToCloudFormation(properties.engineVersion),
        HighAvailabilityConfig: cfnEnvironmentHighAvailabilityConfigPropertyToCloudFormation(properties.highAvailabilityConfig),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        PreferredMaintenanceWindow: cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
        PubliclyAccessible: cdk.booleanToCloudFormation(properties.publiclyAccessible),
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        StorageConfigurations: cdk.listMapper(cfnEnvironmentStorageConfigurationPropertyToCloudFormation)(properties.storageConfigurations),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnEnvironmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironmentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironmentProps>();
    ret.addPropertyResult('engineType', 'EngineType', cfn_parse.FromCloudFormation.getString(properties.EngineType));
    ret.addPropertyResult('instanceType', 'InstanceType', cfn_parse.FromCloudFormation.getString(properties.InstanceType));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('engineVersion', 'EngineVersion', properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined);
    ret.addPropertyResult('highAvailabilityConfig', 'HighAvailabilityConfig', properties.HighAvailabilityConfig != null ? CfnEnvironmentHighAvailabilityConfigPropertyFromCloudFormation(properties.HighAvailabilityConfig) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('preferredMaintenanceWindow', 'PreferredMaintenanceWindow', properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined);
    ret.addPropertyResult('publiclyAccessible', 'PubliclyAccessible', properties.PubliclyAccessible != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PubliclyAccessible) : undefined);
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds) : undefined);
    ret.addPropertyResult('storageConfigurations', 'StorageConfigurations', properties.StorageConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnEnvironmentStorageConfigurationPropertyFromCloudFormation)(properties.StorageConfigurations) : undefined);
    ret.addPropertyResult('subnetIds', 'SubnetIds', properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::M2::Environment`
 *
 * Specifies a runtime environment for a given runtime engine.
 *
 * @cloudformationResource AWS::M2::Environment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html
 */
export class CfnEnvironment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::M2::Environment";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEnvironment {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnEnvironmentPropsFromCloudFormation(resourceProperties);
        const ret = new CfnEnvironment(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the runtime environment.
     * @cloudformationAttribute EnvironmentArn
     */
    public readonly attrEnvironmentArn: string;

    /**
     * The unique identifier of the runtime environment.
     * @cloudformationAttribute EnvironmentId
     */
    public readonly attrEnvironmentId: string;

    /**
     * The target platform for the runtime environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-enginetype
     */
    public engineType: string;

    /**
     * The instance type of the runtime environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-instancetype
     */
    public instanceType: string;

    /**
     * The name of the runtime environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-name
     */
    public name: string;

    /**
     * The description of the runtime environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-description
     */
    public description: string | undefined;

    /**
     * The version of the runtime engine.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-engineversion
     */
    public engineVersion: string | undefined;

    /**
     * Defines the details of a high availability configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-highavailabilityconfig
     */
    public highAvailabilityConfig: CfnEnvironment.HighAvailabilityConfigProperty | cdk.IResolvable | undefined;

    /**
     * The identifier of a customer managed key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-kmskeyid
     */
    public kmsKeyId: string | undefined;

    /**
     * Configures the maintenance window you want for the runtime environment. If you do not provide a value, a random system-generated value will be assigned.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-preferredmaintenancewindow
     */
    public preferredMaintenanceWindow: string | undefined;

    /**
     * Specifies whether the runtime environment is publicly accessible.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-publiclyaccessible
     */
    public publiclyAccessible: boolean | cdk.IResolvable | undefined;

    /**
     * The list of security groups for the VPC associated with this runtime environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-securitygroupids
     */
    public securityGroupIds: string[] | undefined;

    /**
     * Defines the storage configuration for a runtime environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-storageconfigurations
     */
    public storageConfigurations: Array<CfnEnvironment.StorageConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The list of subnets associated with the VPC for this runtime environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-subnetids
     */
    public subnetIds: string[] | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-m2-environment.html#cfn-m2-environment-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::M2::Environment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEnvironmentProps) {
        super(scope, id, { type: CfnEnvironment.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'engineType', this);
        cdk.requireProperty(props, 'instanceType', this);
        cdk.requireProperty(props, 'name', this);
        this.attrEnvironmentArn = cdk.Token.asString(this.getAtt('EnvironmentArn', cdk.ResolutionTypeHint.STRING));
        this.attrEnvironmentId = cdk.Token.asString(this.getAtt('EnvironmentId', cdk.ResolutionTypeHint.STRING));

        this.engineType = props.engineType;
        this.instanceType = props.instanceType;
        this.name = props.name;
        this.description = props.description;
        this.engineVersion = props.engineVersion;
        this.highAvailabilityConfig = props.highAvailabilityConfig;
        this.kmsKeyId = props.kmsKeyId;
        this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
        this.publiclyAccessible = props.publiclyAccessible;
        this.securityGroupIds = props.securityGroupIds;
        this.storageConfigurations = props.storageConfigurations;
        this.subnetIds = props.subnetIds;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::M2::Environment", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEnvironment.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            engineType: this.engineType,
            instanceType: this.instanceType,
            name: this.name,
            description: this.description,
            engineVersion: this.engineVersion,
            highAvailabilityConfig: this.highAvailabilityConfig,
            kmsKeyId: this.kmsKeyId,
            preferredMaintenanceWindow: this.preferredMaintenanceWindow,
            publiclyAccessible: this.publiclyAccessible,
            securityGroupIds: this.securityGroupIds,
            storageConfigurations: this.storageConfigurations,
            subnetIds: this.subnetIds,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEnvironmentPropsToCloudFormation(props);
    }
}

export namespace CfnEnvironment {
    /**
     * Defines the storage configuration for an Amazon EFS file system.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-efsstorageconfiguration.html
     */
    export interface EfsStorageConfigurationProperty {
        /**
         * The file system identifier.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-efsstorageconfiguration.html#cfn-m2-environment-efsstorageconfiguration-filesystemid
         */
        readonly fileSystemId: string;
        /**
         * The mount point for the file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-efsstorageconfiguration.html#cfn-m2-environment-efsstorageconfiguration-mountpoint
         */
        readonly mountPoint: string;
    }
}

/**
 * Determine whether the given properties match those of a `EfsStorageConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EfsStorageConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnEnvironment_EfsStorageConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fileSystemId', cdk.requiredValidator)(properties.fileSystemId));
    errors.collect(cdk.propertyValidator('fileSystemId', cdk.validateString)(properties.fileSystemId));
    errors.collect(cdk.propertyValidator('mountPoint', cdk.requiredValidator)(properties.mountPoint));
    errors.collect(cdk.propertyValidator('mountPoint', cdk.validateString)(properties.mountPoint));
    return errors.wrap('supplied properties not correct for "EfsStorageConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::M2::Environment.EfsStorageConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `EfsStorageConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::M2::Environment.EfsStorageConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnEnvironmentEfsStorageConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnvironment_EfsStorageConfigurationPropertyValidator(properties).assertSuccess();
    return {
        FileSystemId: cdk.stringToCloudFormation(properties.fileSystemId),
        MountPoint: cdk.stringToCloudFormation(properties.mountPoint),
    };
}

// @ts-ignore TS6133
function CfnEnvironmentEfsStorageConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironment.EfsStorageConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.EfsStorageConfigurationProperty>();
    ret.addPropertyResult('fileSystemId', 'FileSystemId', cfn_parse.FromCloudFormation.getString(properties.FileSystemId));
    ret.addPropertyResult('mountPoint', 'MountPoint', cfn_parse.FromCloudFormation.getString(properties.MountPoint));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEnvironment {
    /**
     * Defines the storage configuration for an Amazon FSx file system.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-fsxstorageconfiguration.html
     */
    export interface FsxStorageConfigurationProperty {
        /**
         * The file system identifier.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-fsxstorageconfiguration.html#cfn-m2-environment-fsxstorageconfiguration-filesystemid
         */
        readonly fileSystemId: string;
        /**
         * The mount point for the file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-fsxstorageconfiguration.html#cfn-m2-environment-fsxstorageconfiguration-mountpoint
         */
        readonly mountPoint: string;
    }
}

/**
 * Determine whether the given properties match those of a `FsxStorageConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FsxStorageConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnEnvironment_FsxStorageConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fileSystemId', cdk.requiredValidator)(properties.fileSystemId));
    errors.collect(cdk.propertyValidator('fileSystemId', cdk.validateString)(properties.fileSystemId));
    errors.collect(cdk.propertyValidator('mountPoint', cdk.requiredValidator)(properties.mountPoint));
    errors.collect(cdk.propertyValidator('mountPoint', cdk.validateString)(properties.mountPoint));
    return errors.wrap('supplied properties not correct for "FsxStorageConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::M2::Environment.FsxStorageConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `FsxStorageConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::M2::Environment.FsxStorageConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnEnvironmentFsxStorageConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnvironment_FsxStorageConfigurationPropertyValidator(properties).assertSuccess();
    return {
        FileSystemId: cdk.stringToCloudFormation(properties.fileSystemId),
        MountPoint: cdk.stringToCloudFormation(properties.mountPoint),
    };
}

// @ts-ignore TS6133
function CfnEnvironmentFsxStorageConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironment.FsxStorageConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.FsxStorageConfigurationProperty>();
    ret.addPropertyResult('fileSystemId', 'FileSystemId', cfn_parse.FromCloudFormation.getString(properties.FileSystemId));
    ret.addPropertyResult('mountPoint', 'MountPoint', cfn_parse.FromCloudFormation.getString(properties.MountPoint));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEnvironment {
    /**
     * Defines the details of a high availability configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-highavailabilityconfig.html
     */
    export interface HighAvailabilityConfigProperty {
        /**
         * The number of instances in a high availability configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-highavailabilityconfig.html#cfn-m2-environment-highavailabilityconfig-desiredcapacity
         */
        readonly desiredCapacity: number;
    }
}

/**
 * Determine whether the given properties match those of a `HighAvailabilityConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HighAvailabilityConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnEnvironment_HighAvailabilityConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('desiredCapacity', cdk.requiredValidator)(properties.desiredCapacity));
    errors.collect(cdk.propertyValidator('desiredCapacity', cdk.validateNumber)(properties.desiredCapacity));
    return errors.wrap('supplied properties not correct for "HighAvailabilityConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::M2::Environment.HighAvailabilityConfig` resource
 *
 * @param properties - the TypeScript properties of a `HighAvailabilityConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::M2::Environment.HighAvailabilityConfig` resource.
 */
// @ts-ignore TS6133
function cfnEnvironmentHighAvailabilityConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnvironment_HighAvailabilityConfigPropertyValidator(properties).assertSuccess();
    return {
        DesiredCapacity: cdk.numberToCloudFormation(properties.desiredCapacity),
    };
}

// @ts-ignore TS6133
function CfnEnvironmentHighAvailabilityConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironment.HighAvailabilityConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.HighAvailabilityConfigProperty>();
    ret.addPropertyResult('desiredCapacity', 'DesiredCapacity', cfn_parse.FromCloudFormation.getNumber(properties.DesiredCapacity));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEnvironment {
    /**
     * Defines the storage configuration for a runtime environment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-storageconfiguration.html
     */
    export interface StorageConfigurationProperty {
        /**
         * Defines the storage configuration for an Amazon EFS file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-storageconfiguration.html#cfn-m2-environment-storageconfiguration-efs
         */
        readonly efs?: CfnEnvironment.EfsStorageConfigurationProperty | cdk.IResolvable;
        /**
         * Defines the storage configuration for an Amazon FSx file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-m2-environment-storageconfiguration.html#cfn-m2-environment-storageconfiguration-fsx
         */
        readonly fsx?: CfnEnvironment.FsxStorageConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `StorageConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `StorageConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnEnvironment_StorageConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('efs', CfnEnvironment_EfsStorageConfigurationPropertyValidator)(properties.efs));
    errors.collect(cdk.propertyValidator('fsx', CfnEnvironment_FsxStorageConfigurationPropertyValidator)(properties.fsx));
    return errors.wrap('supplied properties not correct for "StorageConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::M2::Environment.StorageConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `StorageConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::M2::Environment.StorageConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnEnvironmentStorageConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnvironment_StorageConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Efs: cfnEnvironmentEfsStorageConfigurationPropertyToCloudFormation(properties.efs),
        Fsx: cfnEnvironmentFsxStorageConfigurationPropertyToCloudFormation(properties.fsx),
    };
}

// @ts-ignore TS6133
function CfnEnvironmentStorageConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironment.StorageConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.StorageConfigurationProperty>();
    ret.addPropertyResult('efs', 'Efs', properties.Efs != null ? CfnEnvironmentEfsStorageConfigurationPropertyFromCloudFormation(properties.Efs) : undefined);
    ret.addPropertyResult('fsx', 'Fsx', properties.Fsx != null ? CfnEnvironmentFsxStorageConfigurationPropertyFromCloudFormation(properties.Fsx) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
