// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:01.169Z","fingerprint":"2agcH5mia78J9Eq4TyaXN8ojZgk7cFxYEj0JeQ99pZM="}

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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-application.html
 */
export interface CfnApplicationProps {

    /**
     * A name for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-application.html#cfn-appconfig-application-name
     */
    readonly name: string;

    /**
     * A description of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-application.html#cfn-appconfig-application-description
     */
    readonly description?: string;

    /**
     * Metadata to assign to the application. Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-application.html#cfn-appconfig-application-tags
     */
    readonly tags?: CfnApplication.TagsProperty[];
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
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnApplication_TagsPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnApplicationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppConfig::Application` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppConfig::Application` resource.
 */
// @ts-ignore TS6133
function cfnApplicationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cfnApplicationTagsPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationTagsPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppConfig::Application`
 *
 * The `AWS::AppConfig::Application` resource creates an application. In AWS AppConfig , an application is simply an organizational construct like a folder. This organizational construct has a relationship with some unit of executable code. For example, you could create an application called MyMobileApp to organize and manage configuration data for a mobile application installed by your users.
 *
 * AWS AppConfig requires that you create resources and deploy a configuration in the following order:
 *
 * - Create an application
 * - Create an environment
 * - Create a configuration profile
 * - Create a deployment strategy
 * - Deploy the configuration
 *
 * For more information, see [AWS AppConfig](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) in the *AWS AppConfig User Guide* .
 *
 * @cloudformationResource AWS::AppConfig::Application
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppConfig::Application";

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
     * A name for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-application.html#cfn-appconfig-application-name
     */
    public name: string;

    /**
     * A description of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-application.html#cfn-appconfig-application-description
     */
    public description: string | undefined;

    /**
     * Metadata to assign to the application. Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-application.html#cfn-appconfig-application-tags
     */
    public tags: CfnApplication.TagsProperty[] | undefined;

    /**
     * Create a new `AWS::AppConfig::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
        super(scope, id, { type: CfnApplication.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);

        this.name = props.name;
        this.description = props.description;
        this.tags = props.tags;
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
            name: this.name,
            description: this.description,
            tags: this.tags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationPropsToCloudFormation(props);
    }
}

export namespace CfnApplication {
    /**
     * Metadata to assign to the application. Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-application-tags.html
     */
    export interface TagsProperty {
        /**
         * The key-value string map. The valid character set is `[a-zA-Z+-=._:/]` . The tag key can be up to 128 characters and must not start with `aws:` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-application-tags.html#cfn-appconfig-application-tags-key
         */
        readonly key?: string;
        /**
         * The tag value can be up to 256 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-application-tags.html#cfn-appconfig-application-tags-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_TagsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppConfig::Application.Tags` resource
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppConfig::Application.Tags` resource.
 */
// @ts-ignore TS6133
function cfnApplicationTagsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_TagsPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnApplicationTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.TagsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.TagsProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnConfigurationProfile`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html
 */
export interface CfnConfigurationProfileProps {

    /**
     * The application ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-applicationid
     */
    readonly applicationId: string;

    /**
     * A URI to locate the configuration. You can specify the AWS AppConfig hosted configuration store, Systems Manager (SSM) document, an SSM Parameter Store parameter, or an Amazon S3 object. For the hosted configuration store and for feature flags, specify `hosted` . For an SSM document, specify either the document name in the format `ssm-document://<Document_name>` or the Amazon Resource Name (ARN). For a parameter, specify either the parameter name in the format `ssm-parameter://<Parameter_name>` or the ARN. For an Amazon S3 object, specify the URI in the following format: `s3://<bucket>/<objectKey>` . Here is an example: `s3://my-bucket/my-app/us-east-1/my-config.json`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-locationuri
     */
    readonly locationUri: string;

    /**
     * A name for the configuration profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-name
     */
    readonly name: string;

    /**
     * A description of the configuration profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-description
     */
    readonly description?: string;

    /**
     * The ARN of an IAM role with permission to access the configuration at the specified `LocationUri` .
     *
     * > A retrieval role ARN is not required for configurations stored in the AWS AppConfig hosted configuration store. It is required for all other sources that store your configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-retrievalrolearn
     */
    readonly retrievalRoleArn?: string;

    /**
     * Metadata to assign to the configuration profile. Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-tags
     */
    readonly tags?: CfnConfigurationProfile.TagsProperty[];

    /**
     * The type of configurations contained in the profile. AWS AppConfig supports `feature flags` and `freeform` configurations. We recommend you create feature flag configurations to enable or disable new features and freeform configurations to distribute configurations to an application. When calling this API, enter one of the following values for `Type` :
     *
     * `AWS.AppConfig.FeatureFlags`
     *
     * `AWS.Freeform`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-type
     */
    readonly type?: string;

    /**
     * A list of methods for validating the configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-validators
     */
    readonly validators?: Array<CfnConfigurationProfile.ValidatorsProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationProfileProps`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationProfilePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('locationUri', cdk.requiredValidator)(properties.locationUri));
    errors.collect(cdk.propertyValidator('locationUri', cdk.validateString)(properties.locationUri));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('retrievalRoleArn', cdk.validateString)(properties.retrievalRoleArn));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnConfigurationProfile_TagsPropertyValidator))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('validators', cdk.listValidator(CfnConfigurationProfile_ValidatorsPropertyValidator))(properties.validators));
    return errors.wrap('supplied properties not correct for "CfnConfigurationProfileProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppConfig::ConfigurationProfile` resource
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationProfileProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppConfig::ConfigurationProfile` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationProfilePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationProfilePropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        LocationUri: cdk.stringToCloudFormation(properties.locationUri),
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        RetrievalRoleArn: cdk.stringToCloudFormation(properties.retrievalRoleArn),
        Tags: cdk.listMapper(cfnConfigurationProfileTagsPropertyToCloudFormation)(properties.tags),
        Type: cdk.stringToCloudFormation(properties.type),
        Validators: cdk.listMapper(cfnConfigurationProfileValidatorsPropertyToCloudFormation)(properties.validators),
    };
}

// @ts-ignore TS6133
function CfnConfigurationProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationProfileProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationProfileProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('locationUri', 'LocationUri', cfn_parse.FromCloudFormation.getString(properties.LocationUri));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('retrievalRoleArn', 'RetrievalRoleArn', properties.RetrievalRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RetrievalRoleArn) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigurationProfileTagsPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addPropertyResult('validators', 'Validators', properties.Validators != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigurationProfileValidatorsPropertyFromCloudFormation)(properties.Validators) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppConfig::ConfigurationProfile`
 *
 * The `AWS::AppConfig::ConfigurationProfile` resource creates a configuration profile that enables AWS AppConfig to access the configuration source. Valid configuration sources include AWS Systems Manager (SSM) documents, SSM Parameter Store parameters, and Amazon S3 . A configuration profile includes the following information.
 *
 * - The Uri location of the configuration data.
 * - The AWS Identity and Access Management ( IAM ) role that provides access to the configuration data.
 * - A validator for the configuration data. Available validators include either a JSON Schema or the Amazon Resource Name (ARN) of an AWS Lambda function.
 *
 * AWS AppConfig requires that you create resources and deploy a configuration in the following order:
 *
 * - Create an application
 * - Create an environment
 * - Create a configuration profile
 * - Create a deployment strategy
 * - Deploy the configuration
 *
 * For more information, see [AWS AppConfig](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) in the *AWS AppConfig User Guide* .
 *
 * @cloudformationResource AWS::AppConfig::ConfigurationProfile
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html
 */
export class CfnConfigurationProfile extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppConfig::ConfigurationProfile";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigurationProfile {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnConfigurationProfilePropsFromCloudFormation(resourceProperties);
        const ret = new CfnConfigurationProfile(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The application ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-applicationid
     */
    public applicationId: string;

    /**
     * A URI to locate the configuration. You can specify the AWS AppConfig hosted configuration store, Systems Manager (SSM) document, an SSM Parameter Store parameter, or an Amazon S3 object. For the hosted configuration store and for feature flags, specify `hosted` . For an SSM document, specify either the document name in the format `ssm-document://<Document_name>` or the Amazon Resource Name (ARN). For a parameter, specify either the parameter name in the format `ssm-parameter://<Parameter_name>` or the ARN. For an Amazon S3 object, specify the URI in the following format: `s3://<bucket>/<objectKey>` . Here is an example: `s3://my-bucket/my-app/us-east-1/my-config.json`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-locationuri
     */
    public locationUri: string;

    /**
     * A name for the configuration profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-name
     */
    public name: string;

    /**
     * A description of the configuration profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-description
     */
    public description: string | undefined;

    /**
     * The ARN of an IAM role with permission to access the configuration at the specified `LocationUri` .
     *
     * > A retrieval role ARN is not required for configurations stored in the AWS AppConfig hosted configuration store. It is required for all other sources that store your configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-retrievalrolearn
     */
    public retrievalRoleArn: string | undefined;

    /**
     * Metadata to assign to the configuration profile. Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-tags
     */
    public tags: CfnConfigurationProfile.TagsProperty[] | undefined;

    /**
     * The type of configurations contained in the profile. AWS AppConfig supports `feature flags` and `freeform` configurations. We recommend you create feature flag configurations to enable or disable new features and freeform configurations to distribute configurations to an application. When calling this API, enter one of the following values for `Type` :
     *
     * `AWS.AppConfig.FeatureFlags`
     *
     * `AWS.Freeform`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-type
     */
    public type: string | undefined;

    /**
     * A list of methods for validating the configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-validators
     */
    public validators: Array<CfnConfigurationProfile.ValidatorsProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::AppConfig::ConfigurationProfile`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConfigurationProfileProps) {
        super(scope, id, { type: CfnConfigurationProfile.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);
        cdk.requireProperty(props, 'locationUri', this);
        cdk.requireProperty(props, 'name', this);

        this.applicationId = props.applicationId;
        this.locationUri = props.locationUri;
        this.name = props.name;
        this.description = props.description;
        this.retrievalRoleArn = props.retrievalRoleArn;
        this.tags = props.tags;
        this.type = props.type;
        this.validators = props.validators;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigurationProfile.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationId: this.applicationId,
            locationUri: this.locationUri,
            name: this.name,
            description: this.description,
            retrievalRoleArn: this.retrievalRoleArn,
            tags: this.tags,
            type: this.type,
            validators: this.validators,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConfigurationProfilePropsToCloudFormation(props);
    }
}

export namespace CfnConfigurationProfile {
    /**
     * Metadata to assign to the configuration profile. Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-configurationprofile-tags.html
     */
    export interface TagsProperty {
        /**
         * The key-value string map. The valid character set is `[a-zA-Z+-=._:/]` . The tag key can be up to 128 characters and must not start with `aws:` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-configurationprofile-tags.html#cfn-appconfig-configurationprofile-tags-key
         */
        readonly key?: string;
        /**
         * The tag value can be up to 256 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-configurationprofile-tags.html#cfn-appconfig-configurationprofile-tags-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationProfile_TagsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppConfig::ConfigurationProfile.Tags` resource
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppConfig::ConfigurationProfile.Tags` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationProfileTagsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationProfile_TagsPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnConfigurationProfileTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationProfile.TagsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationProfile.TagsProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfigurationProfile {
    /**
     * A validator provides a syntactic or semantic check to ensure the configuration that you want to deploy functions as intended. To validate your application configuration data, you provide a schema or an AWS Lambda function that runs against the configuration. The configuration deployment or update can only proceed when the configuration data is valid.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-configurationprofile-validators.html
     */
    export interface ValidatorsProperty {
        /**
         * Either the JSON Schema content or the Amazon Resource Name (ARN) of an Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-configurationprofile-validators.html#cfn-appconfig-configurationprofile-validators-content
         */
        readonly content?: string;
        /**
         * AWS AppConfig supports validators of type `JSON_SCHEMA` and `LAMBDA`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-configurationprofile-validators.html#cfn-appconfig-configurationprofile-validators-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ValidatorsProperty`
 *
 * @param properties - the TypeScript properties of a `ValidatorsProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationProfile_ValidatorsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('content', cdk.validateString)(properties.content));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "ValidatorsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppConfig::ConfigurationProfile.Validators` resource
 *
 * @param properties - the TypeScript properties of a `ValidatorsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppConfig::ConfigurationProfile.Validators` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationProfileValidatorsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationProfile_ValidatorsPropertyValidator(properties).assertSuccess();
    return {
        Content: cdk.stringToCloudFormation(properties.content),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnConfigurationProfileValidatorsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationProfile.ValidatorsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationProfile.ValidatorsProperty>();
    ret.addPropertyResult('content', 'Content', properties.Content != null ? cfn_parse.FromCloudFormation.getString(properties.Content) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDeployment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html
 */
export interface CfnDeploymentProps {

    /**
     * The application ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-applicationid
     */
    readonly applicationId: string;

    /**
     * The configuration profile ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-configurationprofileid
     */
    readonly configurationProfileId: string;

    /**
     * The configuration version to deploy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-configurationversion
     */
    readonly configurationVersion: string;

    /**
     * The deployment strategy ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-deploymentstrategyid
     */
    readonly deploymentStrategyId: string;

    /**
     * The environment ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-environmentid
     */
    readonly environmentId: string;

    /**
     * A description of the deployment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-description
     */
    readonly description?: string;

    /**
     * Metadata to assign to the deployment. Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-tags
     */
    readonly tags?: CfnDeployment.TagsProperty[];
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
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('configurationProfileId', cdk.requiredValidator)(properties.configurationProfileId));
    errors.collect(cdk.propertyValidator('configurationProfileId', cdk.validateString)(properties.configurationProfileId));
    errors.collect(cdk.propertyValidator('configurationVersion', cdk.requiredValidator)(properties.configurationVersion));
    errors.collect(cdk.propertyValidator('configurationVersion', cdk.validateString)(properties.configurationVersion));
    errors.collect(cdk.propertyValidator('deploymentStrategyId', cdk.requiredValidator)(properties.deploymentStrategyId));
    errors.collect(cdk.propertyValidator('deploymentStrategyId', cdk.validateString)(properties.deploymentStrategyId));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('environmentId', cdk.requiredValidator)(properties.environmentId));
    errors.collect(cdk.propertyValidator('environmentId', cdk.validateString)(properties.environmentId));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnDeployment_TagsPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDeploymentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppConfig::Deployment` resource
 *
 * @param properties - the TypeScript properties of a `CfnDeploymentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppConfig::Deployment` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeploymentPropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        ConfigurationProfileId: cdk.stringToCloudFormation(properties.configurationProfileId),
        ConfigurationVersion: cdk.stringToCloudFormation(properties.configurationVersion),
        DeploymentStrategyId: cdk.stringToCloudFormation(properties.deploymentStrategyId),
        EnvironmentId: cdk.stringToCloudFormation(properties.environmentId),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cfnDeploymentTagsPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDeploymentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('configurationProfileId', 'ConfigurationProfileId', cfn_parse.FromCloudFormation.getString(properties.ConfigurationProfileId));
    ret.addPropertyResult('configurationVersion', 'ConfigurationVersion', cfn_parse.FromCloudFormation.getString(properties.ConfigurationVersion));
    ret.addPropertyResult('deploymentStrategyId', 'DeploymentStrategyId', cfn_parse.FromCloudFormation.getString(properties.DeploymentStrategyId));
    ret.addPropertyResult('environmentId', 'EnvironmentId', cfn_parse.FromCloudFormation.getString(properties.EnvironmentId));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentTagsPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppConfig::Deployment`
 *
 * The `AWS::AppConfig::Deployment` resource starts a deployment. Starting a deployment in AWS AppConfig calls the `StartDeployment` API action. This call includes the IDs of the AWS AppConfig application, the environment, the configuration profile, and (optionally) the configuration data version to deploy. The call also includes the ID of the deployment strategy to use, which determines how the configuration data is deployed.
 *
 * AWS AppConfig monitors the distribution to all hosts and reports status. If a distribution fails, then AWS AppConfig rolls back the configuration.
 *
 * AWS AppConfig requires that you create resources and deploy a configuration in the following order:
 *
 * - Create an application
 * - Create an environment
 * - Create a configuration profile
 * - Create a deployment strategy
 * - Deploy the configuration
 *
 * For more information, see [AWS AppConfig](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) in the *AWS AppConfig User Guide* .
 *
 * @cloudformationResource AWS::AppConfig::Deployment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html
 */
export class CfnDeployment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppConfig::Deployment";

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
     * The application ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-applicationid
     */
    public applicationId: string;

    /**
     * The configuration profile ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-configurationprofileid
     */
    public configurationProfileId: string;

    /**
     * The configuration version to deploy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-configurationversion
     */
    public configurationVersion: string;

    /**
     * The deployment strategy ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-deploymentstrategyid
     */
    public deploymentStrategyId: string;

    /**
     * The environment ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-environmentid
     */
    public environmentId: string;

    /**
     * A description of the deployment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-description
     */
    public description: string | undefined;

    /**
     * Metadata to assign to the deployment. Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-tags
     */
    public tags: CfnDeployment.TagsProperty[] | undefined;

    /**
     * Create a new `AWS::AppConfig::Deployment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDeploymentProps) {
        super(scope, id, { type: CfnDeployment.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);
        cdk.requireProperty(props, 'configurationProfileId', this);
        cdk.requireProperty(props, 'configurationVersion', this);
        cdk.requireProperty(props, 'deploymentStrategyId', this);
        cdk.requireProperty(props, 'environmentId', this);

        this.applicationId = props.applicationId;
        this.configurationProfileId = props.configurationProfileId;
        this.configurationVersion = props.configurationVersion;
        this.deploymentStrategyId = props.deploymentStrategyId;
        this.environmentId = props.environmentId;
        this.description = props.description;
        this.tags = props.tags;
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
            applicationId: this.applicationId,
            configurationProfileId: this.configurationProfileId,
            configurationVersion: this.configurationVersion,
            deploymentStrategyId: this.deploymentStrategyId,
            environmentId: this.environmentId,
            description: this.description,
            tags: this.tags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDeploymentPropsToCloudFormation(props);
    }
}

export namespace CfnDeployment {
    /**
     * Metadata to assign to the deployment strategy. Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-deployment-tags.html
     */
    export interface TagsProperty {
        /**
         * The key-value string map. The valid character set is `[a-zA-Z+-=._:/]` . The tag key can be up to 128 characters and must not start with `aws:` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-deployment-tags.html#cfn-appconfig-deployment-tags-key
         */
        readonly key?: string;
        /**
         * The tag value can be up to 256 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-deployment-tags.html#cfn-appconfig-deployment-tags-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeployment_TagsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppConfig::Deployment.Tags` resource
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppConfig::Deployment.Tags` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentTagsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeployment_TagsPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnDeploymentTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.TagsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.TagsProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDeploymentStrategy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html
 */
export interface CfnDeploymentStrategyProps {

    /**
     * Total amount of time for a deployment to last.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-deploymentdurationinminutes
     */
    readonly deploymentDurationInMinutes: number;

    /**
     * The percentage of targets to receive a deployed configuration during each interval.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-growthfactor
     */
    readonly growthFactor: number;

    /**
     * A name for the deployment strategy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-name
     */
    readonly name: string;

    /**
     * Save the deployment strategy to a Systems Manager (SSM) document.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-replicateto
     */
    readonly replicateTo: string;

    /**
     * A description of the deployment strategy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-description
     */
    readonly description?: string;

    /**
     * Specifies the amount of time AWS AppConfig monitors for Amazon CloudWatch alarms after the configuration has been deployed to 100% of its targets, before considering the deployment to be complete. If an alarm is triggered during this time, AWS AppConfig rolls back the deployment. You must configure permissions for AWS AppConfig to roll back based on CloudWatch alarms. For more information, see [Configuring permissions for rollback based on Amazon CloudWatch alarms](https://docs.aws.amazon.com/appconfig/latest/userguide/getting-started-with-appconfig-cloudwatch-alarms-permissions.html) in the *AWS AppConfig User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-finalbaketimeinminutes
     */
    readonly finalBakeTimeInMinutes?: number;

    /**
     * The algorithm used to define how percentage grows over time. AWS AppConfig supports the following growth types:
     *
     * *Linear* : For this type, AWS AppConfig processes the deployment by dividing the total number of targets by the value specified for `Step percentage` . For example, a linear deployment that uses a `Step percentage` of 10 deploys the configuration to 10 percent of the hosts. After those deployments are complete, the system deploys the configuration to the next 10 percent. This continues until 100% of the targets have successfully received the configuration.
     *
     * *Exponential* : For this type, AWS AppConfig processes the deployment exponentially using the following formula: `G*(2^N)` . In this formula, `G` is the growth factor specified by the user and `N` is the number of steps until the configuration is deployed to all targets. For example, if you specify a growth factor of 2, then the system rolls out the configuration as follows:
     *
     * `2*(2^0)`
     *
     * `2*(2^1)`
     *
     * `2*(2^2)`
     *
     * Expressed numerically, the deployment rolls out as follows: 2% of the targets, 4% of the targets, 8% of the targets, and continues until the configuration has been deployed to all targets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-growthtype
     */
    readonly growthType?: string;

    /**
     * Assigns metadata to an AWS AppConfig resource. Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define. You can specify a maximum of 50 tags for a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-tags
     */
    readonly tags?: CfnDeploymentStrategy.TagsProperty[];
}

/**
 * Determine whether the given properties match those of a `CfnDeploymentStrategyProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeploymentStrategyProps`
 *
 * @returns the result of the validation.
 */
function CfnDeploymentStrategyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deploymentDurationInMinutes', cdk.requiredValidator)(properties.deploymentDurationInMinutes));
    errors.collect(cdk.propertyValidator('deploymentDurationInMinutes', cdk.validateNumber)(properties.deploymentDurationInMinutes));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('finalBakeTimeInMinutes', cdk.validateNumber)(properties.finalBakeTimeInMinutes));
    errors.collect(cdk.propertyValidator('growthFactor', cdk.requiredValidator)(properties.growthFactor));
    errors.collect(cdk.propertyValidator('growthFactor', cdk.validateNumber)(properties.growthFactor));
    errors.collect(cdk.propertyValidator('growthType', cdk.validateString)(properties.growthType));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('replicateTo', cdk.requiredValidator)(properties.replicateTo));
    errors.collect(cdk.propertyValidator('replicateTo', cdk.validateString)(properties.replicateTo));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnDeploymentStrategy_TagsPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDeploymentStrategyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppConfig::DeploymentStrategy` resource
 *
 * @param properties - the TypeScript properties of a `CfnDeploymentStrategyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppConfig::DeploymentStrategy` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentStrategyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeploymentStrategyPropsValidator(properties).assertSuccess();
    return {
        DeploymentDurationInMinutes: cdk.numberToCloudFormation(properties.deploymentDurationInMinutes),
        GrowthFactor: cdk.numberToCloudFormation(properties.growthFactor),
        Name: cdk.stringToCloudFormation(properties.name),
        ReplicateTo: cdk.stringToCloudFormation(properties.replicateTo),
        Description: cdk.stringToCloudFormation(properties.description),
        FinalBakeTimeInMinutes: cdk.numberToCloudFormation(properties.finalBakeTimeInMinutes),
        GrowthType: cdk.stringToCloudFormation(properties.growthType),
        Tags: cdk.listMapper(cfnDeploymentStrategyTagsPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDeploymentStrategyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentStrategyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentStrategyProps>();
    ret.addPropertyResult('deploymentDurationInMinutes', 'DeploymentDurationInMinutes', cfn_parse.FromCloudFormation.getNumber(properties.DeploymentDurationInMinutes));
    ret.addPropertyResult('growthFactor', 'GrowthFactor', cfn_parse.FromCloudFormation.getNumber(properties.GrowthFactor));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('replicateTo', 'ReplicateTo', cfn_parse.FromCloudFormation.getString(properties.ReplicateTo));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('finalBakeTimeInMinutes', 'FinalBakeTimeInMinutes', properties.FinalBakeTimeInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.FinalBakeTimeInMinutes) : undefined);
    ret.addPropertyResult('growthType', 'GrowthType', properties.GrowthType != null ? cfn_parse.FromCloudFormation.getString(properties.GrowthType) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentStrategyTagsPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppConfig::DeploymentStrategy`
 *
 * The `AWS::AppConfig::DeploymentStrategy` resource creates an AWS AppConfig deployment strategy. A deployment strategy defines important criteria for rolling out your configuration to the designated targets. A deployment strategy includes: the overall duration required, a percentage of targets to receive the deployment during each interval, an algorithm that defines how percentage grows, and bake time.
 *
 * AWS AppConfig requires that you create resources and deploy a configuration in the following order:
 *
 * - Create an application
 * - Create an environment
 * - Create a configuration profile
 * - Create a deployment strategy
 * - Deploy the configuration
 *
 * For more information, see [AWS AppConfig](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) in the *AWS AppConfig User Guide* .
 *
 * @cloudformationResource AWS::AppConfig::DeploymentStrategy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html
 */
export class CfnDeploymentStrategy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppConfig::DeploymentStrategy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeploymentStrategy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDeploymentStrategyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDeploymentStrategy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Total amount of time for a deployment to last.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-deploymentdurationinminutes
     */
    public deploymentDurationInMinutes: number;

    /**
     * The percentage of targets to receive a deployed configuration during each interval.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-growthfactor
     */
    public growthFactor: number;

    /**
     * A name for the deployment strategy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-name
     */
    public name: string;

    /**
     * Save the deployment strategy to a Systems Manager (SSM) document.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-replicateto
     */
    public replicateTo: string;

    /**
     * A description of the deployment strategy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-description
     */
    public description: string | undefined;

    /**
     * Specifies the amount of time AWS AppConfig monitors for Amazon CloudWatch alarms after the configuration has been deployed to 100% of its targets, before considering the deployment to be complete. If an alarm is triggered during this time, AWS AppConfig rolls back the deployment. You must configure permissions for AWS AppConfig to roll back based on CloudWatch alarms. For more information, see [Configuring permissions for rollback based on Amazon CloudWatch alarms](https://docs.aws.amazon.com/appconfig/latest/userguide/getting-started-with-appconfig-cloudwatch-alarms-permissions.html) in the *AWS AppConfig User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-finalbaketimeinminutes
     */
    public finalBakeTimeInMinutes: number | undefined;

    /**
     * The algorithm used to define how percentage grows over time. AWS AppConfig supports the following growth types:
     *
     * *Linear* : For this type, AWS AppConfig processes the deployment by dividing the total number of targets by the value specified for `Step percentage` . For example, a linear deployment that uses a `Step percentage` of 10 deploys the configuration to 10 percent of the hosts. After those deployments are complete, the system deploys the configuration to the next 10 percent. This continues until 100% of the targets have successfully received the configuration.
     *
     * *Exponential* : For this type, AWS AppConfig processes the deployment exponentially using the following formula: `G*(2^N)` . In this formula, `G` is the growth factor specified by the user and `N` is the number of steps until the configuration is deployed to all targets. For example, if you specify a growth factor of 2, then the system rolls out the configuration as follows:
     *
     * `2*(2^0)`
     *
     * `2*(2^1)`
     *
     * `2*(2^2)`
     *
     * Expressed numerically, the deployment rolls out as follows: 2% of the targets, 4% of the targets, 8% of the targets, and continues until the configuration has been deployed to all targets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-growthtype
     */
    public growthType: string | undefined;

    /**
     * Assigns metadata to an AWS AppConfig resource. Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define. You can specify a maximum of 50 tags for a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-tags
     */
    public tags: CfnDeploymentStrategy.TagsProperty[] | undefined;

    /**
     * Create a new `AWS::AppConfig::DeploymentStrategy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDeploymentStrategyProps) {
        super(scope, id, { type: CfnDeploymentStrategy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'deploymentDurationInMinutes', this);
        cdk.requireProperty(props, 'growthFactor', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'replicateTo', this);

        this.deploymentDurationInMinutes = props.deploymentDurationInMinutes;
        this.growthFactor = props.growthFactor;
        this.name = props.name;
        this.replicateTo = props.replicateTo;
        this.description = props.description;
        this.finalBakeTimeInMinutes = props.finalBakeTimeInMinutes;
        this.growthType = props.growthType;
        this.tags = props.tags;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeploymentStrategy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            deploymentDurationInMinutes: this.deploymentDurationInMinutes,
            growthFactor: this.growthFactor,
            name: this.name,
            replicateTo: this.replicateTo,
            description: this.description,
            finalBakeTimeInMinutes: this.finalBakeTimeInMinutes,
            growthType: this.growthType,
            tags: this.tags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDeploymentStrategyPropsToCloudFormation(props);
    }
}

export namespace CfnDeploymentStrategy {
    /**
     * Metadata to assign to the deployment strategy. Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-deploymentstrategy-tags.html
     */
    export interface TagsProperty {
        /**
         * The key-value string map. The valid character set is `[a-zA-Z+-=._:/]` . The tag key can be up to 128 characters and must not start with `aws:` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-deploymentstrategy-tags.html#cfn-appconfig-deploymentstrategy-tags-key
         */
        readonly key?: string;
        /**
         * The tag value can be up to 256 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-deploymentstrategy-tags.html#cfn-appconfig-deploymentstrategy-tags-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeploymentStrategy_TagsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppConfig::DeploymentStrategy.Tags` resource
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppConfig::DeploymentStrategy.Tags` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentStrategyTagsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeploymentStrategy_TagsPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnDeploymentStrategyTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentStrategy.TagsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentStrategy.TagsProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnEnvironment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html
 */
export interface CfnEnvironmentProps {

    /**
     * The application ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html#cfn-appconfig-environment-applicationid
     */
    readonly applicationId: string;

    /**
     * A name for the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html#cfn-appconfig-environment-name
     */
    readonly name: string;

    /**
     * A description of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html#cfn-appconfig-environment-description
     */
    readonly description?: string;

    /**
     * Amazon CloudWatch alarms to monitor during the deployment process.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html#cfn-appconfig-environment-monitors
     */
    readonly monitors?: Array<CfnEnvironment.MonitorsProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Metadata to assign to the environment. Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html#cfn-appconfig-environment-tags
     */
    readonly tags?: CfnEnvironment.TagsProperty[];
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
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('monitors', cdk.listValidator(CfnEnvironment_MonitorsPropertyValidator))(properties.monitors));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnEnvironment_TagsPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnEnvironmentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppConfig::Environment` resource
 *
 * @param properties - the TypeScript properties of a `CfnEnvironmentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppConfig::Environment` resource.
 */
// @ts-ignore TS6133
function cfnEnvironmentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnvironmentPropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        Monitors: cdk.listMapper(cfnEnvironmentMonitorsPropertyToCloudFormation)(properties.monitors),
        Tags: cdk.listMapper(cfnEnvironmentTagsPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnEnvironmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironmentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironmentProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('monitors', 'Monitors', properties.Monitors != null ? cfn_parse.FromCloudFormation.getArray(CfnEnvironmentMonitorsPropertyFromCloudFormation)(properties.Monitors) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnEnvironmentTagsPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppConfig::Environment`
 *
 * The `AWS::AppConfig::Environment` resource creates an environment, which is a logical deployment group of AWS AppConfig targets, such as applications in a `Beta` or `Production` environment. You define one or more environments for each AWS AppConfig application. You can also define environments for application subcomponents such as the `Web` , `Mobile` and `Back-end` components for your application. You can configure Amazon CloudWatch alarms for each environment. The system monitors alarms during a configuration deployment. If an alarm is triggered, the system rolls back the configuration.
 *
 * AWS AppConfig requires that you create resources and deploy a configuration in the following order:
 *
 * - Create an application
 * - Create an environment
 * - Create a configuration profile
 * - Create a deployment strategy
 * - Deploy the configuration
 *
 * For more information, see [AWS AppConfig](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) in the *AWS AppConfig User Guide* .
 *
 * @cloudformationResource AWS::AppConfig::Environment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html
 */
export class CfnEnvironment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppConfig::Environment";

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
     * The application ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html#cfn-appconfig-environment-applicationid
     */
    public applicationId: string;

    /**
     * A name for the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html#cfn-appconfig-environment-name
     */
    public name: string;

    /**
     * A description of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html#cfn-appconfig-environment-description
     */
    public description: string | undefined;

    /**
     * Amazon CloudWatch alarms to monitor during the deployment process.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html#cfn-appconfig-environment-monitors
     */
    public monitors: Array<CfnEnvironment.MonitorsProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Metadata to assign to the environment. Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html#cfn-appconfig-environment-tags
     */
    public tags: CfnEnvironment.TagsProperty[] | undefined;

    /**
     * Create a new `AWS::AppConfig::Environment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEnvironmentProps) {
        super(scope, id, { type: CfnEnvironment.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);
        cdk.requireProperty(props, 'name', this);

        this.applicationId = props.applicationId;
        this.name = props.name;
        this.description = props.description;
        this.monitors = props.monitors;
        this.tags = props.tags;
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
            applicationId: this.applicationId,
            name: this.name,
            description: this.description,
            monitors: this.monitors,
            tags: this.tags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEnvironmentPropsToCloudFormation(props);
    }
}

export namespace CfnEnvironment {
    /**
     * Amazon CloudWatch alarms to monitor during the deployment process.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-environment-monitors.html
     */
    export interface MonitorsProperty {
        /**
         * Amazon Resource Name (ARN) of the Amazon CloudWatch alarm.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-environment-monitors.html#cfn-appconfig-environment-monitors-alarmarn
         */
        readonly alarmArn?: string;
        /**
         * ARN of an AWS Identity and Access Management (IAM) role for AWS AppConfig to monitor `AlarmArn` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-environment-monitors.html#cfn-appconfig-environment-monitors-alarmrolearn
         */
        readonly alarmRoleArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MonitorsProperty`
 *
 * @param properties - the TypeScript properties of a `MonitorsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEnvironment_MonitorsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alarmArn', cdk.validateString)(properties.alarmArn));
    errors.collect(cdk.propertyValidator('alarmRoleArn', cdk.validateString)(properties.alarmRoleArn));
    return errors.wrap('supplied properties not correct for "MonitorsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppConfig::Environment.Monitors` resource
 *
 * @param properties - the TypeScript properties of a `MonitorsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppConfig::Environment.Monitors` resource.
 */
// @ts-ignore TS6133
function cfnEnvironmentMonitorsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnvironment_MonitorsPropertyValidator(properties).assertSuccess();
    return {
        AlarmArn: cdk.stringToCloudFormation(properties.alarmArn),
        AlarmRoleArn: cdk.stringToCloudFormation(properties.alarmRoleArn),
    };
}

// @ts-ignore TS6133
function CfnEnvironmentMonitorsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironment.MonitorsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.MonitorsProperty>();
    ret.addPropertyResult('alarmArn', 'AlarmArn', properties.AlarmArn != null ? cfn_parse.FromCloudFormation.getString(properties.AlarmArn) : undefined);
    ret.addPropertyResult('alarmRoleArn', 'AlarmRoleArn', properties.AlarmRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.AlarmRoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEnvironment {
    /**
     * Metadata to assign to the environment. Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-environment-tags.html
     */
    export interface TagsProperty {
        /**
         * The key-value string map. The valid character set is `[a-zA-Z+-=._:/]` . The tag key can be up to 128 characters and must not start with `aws:` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-environment-tags.html#cfn-appconfig-environment-tags-key
         */
        readonly key?: string;
        /**
         * The tag value can be up to 256 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-environment-tags.html#cfn-appconfig-environment-tags-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEnvironment_TagsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppConfig::Environment.Tags` resource
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppConfig::Environment.Tags` resource.
 */
// @ts-ignore TS6133
function cfnEnvironmentTagsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnvironment_TagsPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnEnvironmentTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironment.TagsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.TagsProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnHostedConfigurationVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html
 */
export interface CfnHostedConfigurationVersionProps {

    /**
     * The application ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-applicationid
     */
    readonly applicationId: string;

    /**
     * The configuration profile ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-configurationprofileid
     */
    readonly configurationProfileId: string;

    /**
     * The content of the configuration or the configuration data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-content
     */
    readonly content: string;

    /**
     * A standard MIME type describing the format of the configuration content. For more information, see [Content-Type](https://docs.aws.amazon.com/https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-contenttype
     */
    readonly contentType: string;

    /**
     * A description of the configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-description
     */
    readonly description?: string;

    /**
     * An optional locking token used to prevent race conditions from overwriting configuration updates when creating a new version. To ensure your data is not overwritten when creating multiple hosted configuration versions in rapid succession, specify the version number of the latest hosted configuration version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-latestversionnumber
     */
    readonly latestVersionNumber?: number;
}

/**
 * Determine whether the given properties match those of a `CfnHostedConfigurationVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnHostedConfigurationVersionProps`
 *
 * @returns the result of the validation.
 */
function CfnHostedConfigurationVersionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('configurationProfileId', cdk.requiredValidator)(properties.configurationProfileId));
    errors.collect(cdk.propertyValidator('configurationProfileId', cdk.validateString)(properties.configurationProfileId));
    errors.collect(cdk.propertyValidator('content', cdk.requiredValidator)(properties.content));
    errors.collect(cdk.propertyValidator('content', cdk.validateString)(properties.content));
    errors.collect(cdk.propertyValidator('contentType', cdk.requiredValidator)(properties.contentType));
    errors.collect(cdk.propertyValidator('contentType', cdk.validateString)(properties.contentType));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('latestVersionNumber', cdk.validateNumber)(properties.latestVersionNumber));
    return errors.wrap('supplied properties not correct for "CfnHostedConfigurationVersionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppConfig::HostedConfigurationVersion` resource
 *
 * @param properties - the TypeScript properties of a `CfnHostedConfigurationVersionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppConfig::HostedConfigurationVersion` resource.
 */
// @ts-ignore TS6133
function cfnHostedConfigurationVersionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnHostedConfigurationVersionPropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        ConfigurationProfileId: cdk.stringToCloudFormation(properties.configurationProfileId),
        Content: cdk.stringToCloudFormation(properties.content),
        ContentType: cdk.stringToCloudFormation(properties.contentType),
        Description: cdk.stringToCloudFormation(properties.description),
        LatestVersionNumber: cdk.numberToCloudFormation(properties.latestVersionNumber),
    };
}

// @ts-ignore TS6133
function CfnHostedConfigurationVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHostedConfigurationVersionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHostedConfigurationVersionProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('configurationProfileId', 'ConfigurationProfileId', cfn_parse.FromCloudFormation.getString(properties.ConfigurationProfileId));
    ret.addPropertyResult('content', 'Content', cfn_parse.FromCloudFormation.getString(properties.Content));
    ret.addPropertyResult('contentType', 'ContentType', cfn_parse.FromCloudFormation.getString(properties.ContentType));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('latestVersionNumber', 'LatestVersionNumber', properties.LatestVersionNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.LatestVersionNumber) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppConfig::HostedConfigurationVersion`
 *
 * Create a new configuration in the AWS AppConfig hosted configuration store. Configurations must be 1 MB or smaller. The AWS AppConfig hosted configuration store provides the following benefits over other configuration store options.
 *
 * - You don't need to set up and configure other services such as Amazon Simple Storage Service ( Amazon S3 ) or Parameter Store.
 * - You don't need to configure AWS Identity and Access Management ( IAM ) permissions to use the configuration store.
 * - You can store configurations in any content type.
 * - There is no cost to use the store.
 * - You can create a configuration and add it to the store when you create a configuration profile.
 *
 * @cloudformationResource AWS::AppConfig::HostedConfigurationVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html
 */
export class CfnHostedConfigurationVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppConfig::HostedConfigurationVersion";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHostedConfigurationVersion {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnHostedConfigurationVersionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnHostedConfigurationVersion(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The application ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-applicationid
     */
    public applicationId: string;

    /**
     * The configuration profile ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-configurationprofileid
     */
    public configurationProfileId: string;

    /**
     * The content of the configuration or the configuration data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-content
     */
    public content: string;

    /**
     * A standard MIME type describing the format of the configuration content. For more information, see [Content-Type](https://docs.aws.amazon.com/https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-contenttype
     */
    public contentType: string;

    /**
     * A description of the configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-description
     */
    public description: string | undefined;

    /**
     * An optional locking token used to prevent race conditions from overwriting configuration updates when creating a new version. To ensure your data is not overwritten when creating multiple hosted configuration versions in rapid succession, specify the version number of the latest hosted configuration version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-latestversionnumber
     */
    public latestVersionNumber: number | undefined;

    /**
     * Create a new `AWS::AppConfig::HostedConfigurationVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnHostedConfigurationVersionProps) {
        super(scope, id, { type: CfnHostedConfigurationVersion.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);
        cdk.requireProperty(props, 'configurationProfileId', this);
        cdk.requireProperty(props, 'content', this);
        cdk.requireProperty(props, 'contentType', this);

        this.applicationId = props.applicationId;
        this.configurationProfileId = props.configurationProfileId;
        this.content = props.content;
        this.contentType = props.contentType;
        this.description = props.description;
        this.latestVersionNumber = props.latestVersionNumber;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnHostedConfigurationVersion.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationId: this.applicationId,
            configurationProfileId: this.configurationProfileId,
            content: this.content,
            contentType: this.contentType,
            description: this.description,
            latestVersionNumber: this.latestVersionNumber,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnHostedConfigurationVersionPropsToCloudFormation(props);
    }
}
