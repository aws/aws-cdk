// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-09T03:50:30.194Z","fingerprint":"3yMGotKPqnbYOUnrF/WjpXzohgWkVSxe3pXmGFOuuHI="}

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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-application.html
 */
export interface CfnApplicationProps {

    /**
     * A name for the Elastic Beanstalk application. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the application name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-application.html#cfn-elasticbeanstalk-application-applicationname
     */
    readonly applicationName?: string;

    /**
     * Your description of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-application.html#cfn-elasticbeanstalk-application-description
     */
    readonly description?: string;

    /**
     * Specifies an application resource lifecycle configuration to prevent your application from accumulating too many versions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-application.html#cfn-elasticbeanstalk-application-resourcelifecycleconfig
     */
    readonly resourceLifecycleConfig?: CfnApplication.ApplicationResourceLifecycleConfigProperty | cdk.IResolvable;
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
    errors.collect(cdk.propertyValidator('applicationName', cdk.validateString)(properties.applicationName));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('resourceLifecycleConfig', CfnApplication_ApplicationResourceLifecycleConfigPropertyValidator)(properties.resourceLifecycleConfig));
    return errors.wrap('supplied properties not correct for "CfnApplicationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Application` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Application` resource.
 */
// @ts-ignore TS6133
function cfnApplicationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationPropsValidator(properties).assertSuccess();
    return {
        ApplicationName: cdk.stringToCloudFormation(properties.applicationName),
        Description: cdk.stringToCloudFormation(properties.description),
        ResourceLifecycleConfig: cfnApplicationApplicationResourceLifecycleConfigPropertyToCloudFormation(properties.resourceLifecycleConfig),
    };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
    ret.addPropertyResult('applicationName', 'ApplicationName', properties.ApplicationName != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationName) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('resourceLifecycleConfig', 'ResourceLifecycleConfig', properties.ResourceLifecycleConfig != null ? CfnApplicationApplicationResourceLifecycleConfigPropertyFromCloudFormation(properties.ResourceLifecycleConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ElasticBeanstalk::Application`
 *
 * Specify an AWS Elastic Beanstalk application by using the AWS::ElasticBeanstalk::Application resource in an AWS CloudFormation template.
 *
 * The AWS::ElasticBeanstalk::Application resource is an AWS Elastic Beanstalk Beanstalk resource type that specifies an Elastic Beanstalk application.
 *
 * @cloudformationResource AWS::ElasticBeanstalk::Application
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElasticBeanstalk::Application";

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
     * A name for the Elastic Beanstalk application. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the application name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-application.html#cfn-elasticbeanstalk-application-applicationname
     */
    public applicationName: string | undefined;

    /**
     * Your description of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-application.html#cfn-elasticbeanstalk-application-description
     */
    public description: string | undefined;

    /**
     * Specifies an application resource lifecycle configuration to prevent your application from accumulating too many versions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-application.html#cfn-elasticbeanstalk-application-resourcelifecycleconfig
     */
    public resourceLifecycleConfig: CfnApplication.ApplicationResourceLifecycleConfigProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::ElasticBeanstalk::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps = {}) {
        super(scope, id, { type: CfnApplication.CFN_RESOURCE_TYPE_NAME, properties: props });

        this.applicationName = props.applicationName;
        this.description = props.description;
        this.resourceLifecycleConfig = props.resourceLifecycleConfig;
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
            applicationName: this.applicationName,
            description: this.description,
            resourceLifecycleConfig: this.resourceLifecycleConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationPropsToCloudFormation(props);
    }
}

export namespace CfnApplication {
    /**
     * Use the `ApplicationResourceLifecycleConfig` property type to specify lifecycle settings for resources that belong to an AWS Elastic Beanstalk application when defining an AWS::ElasticBeanstalk::Application resource in an AWS CloudFormation template.
     *
     * The resource lifecycle configuration for an application. Defines lifecycle settings for resources that belong to the application, and the service role that Elastic Beanstalk assumes in order to apply lifecycle settings. The version lifecycle configuration defines lifecycle settings for application versions.
     *
     * `ApplicationResourceLifecycleConfig` is a property of the [AWS::ElasticBeanstalk::Application](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk.html) resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationresourcelifecycleconfig.html
     */
    export interface ApplicationResourceLifecycleConfigProperty {
        /**
         * The ARN of an IAM service role that Elastic Beanstalk has permission to assume.
         *
         * The `ServiceRole` property is required the first time that you provide a `ResourceLifecycleConfig` for the application. After you provide it once, Elastic Beanstalk persists the Service Role with the application, and you don't need to specify it again. You can, however, specify it in subsequent updates to change the Service Role to another value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationresourcelifecycleconfig.html#cfn-elasticbeanstalk-application-applicationresourcelifecycleconfig-servicerole
         */
        readonly serviceRole?: string;
        /**
         * Defines lifecycle settings for application versions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationresourcelifecycleconfig.html#cfn-elasticbeanstalk-application-applicationresourcelifecycleconfig-versionlifecycleconfig
         */
        readonly versionLifecycleConfig?: CfnApplication.ApplicationVersionLifecycleConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ApplicationResourceLifecycleConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationResourceLifecycleConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ApplicationResourceLifecycleConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('serviceRole', cdk.validateString)(properties.serviceRole));
    errors.collect(cdk.propertyValidator('versionLifecycleConfig', CfnApplication_ApplicationVersionLifecycleConfigPropertyValidator)(properties.versionLifecycleConfig));
    return errors.wrap('supplied properties not correct for "ApplicationResourceLifecycleConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Application.ApplicationResourceLifecycleConfig` resource
 *
 * @param properties - the TypeScript properties of a `ApplicationResourceLifecycleConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Application.ApplicationResourceLifecycleConfig` resource.
 */
// @ts-ignore TS6133
function cfnApplicationApplicationResourceLifecycleConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_ApplicationResourceLifecycleConfigPropertyValidator(properties).assertSuccess();
    return {
        ServiceRole: cdk.stringToCloudFormation(properties.serviceRole),
        VersionLifecycleConfig: cfnApplicationApplicationVersionLifecycleConfigPropertyToCloudFormation(properties.versionLifecycleConfig),
    };
}

// @ts-ignore TS6133
function CfnApplicationApplicationResourceLifecycleConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ApplicationResourceLifecycleConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ApplicationResourceLifecycleConfigProperty>();
    ret.addPropertyResult('serviceRole', 'ServiceRole', properties.ServiceRole != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceRole) : undefined);
    ret.addPropertyResult('versionLifecycleConfig', 'VersionLifecycleConfig', properties.VersionLifecycleConfig != null ? CfnApplicationApplicationVersionLifecycleConfigPropertyFromCloudFormation(properties.VersionLifecycleConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Use the `ApplicationVersionLifecycleConfig` property type to specify application version lifecycle settings for an AWS Elastic Beanstalk application when defining an AWS::ElasticBeanstalk::Application resource in an AWS CloudFormation template.
     *
     * The application version lifecycle settings for an application. Defines the rules that Elastic Beanstalk applies to an application's versions in order to avoid hitting the per-region limit for application versions.
     *
     * When Elastic Beanstalk deletes an application version from its database, you can no longer deploy that version to an environment. The source bundle remains in S3 unless you configure the rule to delete it.
     *
     * `ApplicationVersionLifecycleConfig` is a property of the [ApplicationResourceLifecycleConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationresourcelifecycleconfig.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationversionlifecycleconfig.html
     */
    export interface ApplicationVersionLifecycleConfigProperty {
        /**
         * Specify a max age rule to restrict the length of time that application versions are retained for an application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationversionlifecycleconfig.html#cfn-elasticbeanstalk-application-applicationversionlifecycleconfig-maxagerule
         */
        readonly maxAgeRule?: CfnApplication.MaxAgeRuleProperty | cdk.IResolvable;
        /**
         * Specify a max count rule to restrict the number of application versions that are retained for an application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationversionlifecycleconfig.html#cfn-elasticbeanstalk-application-applicationversionlifecycleconfig-maxcountrule
         */
        readonly maxCountRule?: CfnApplication.MaxCountRuleProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ApplicationVersionLifecycleConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationVersionLifecycleConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ApplicationVersionLifecycleConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxAgeRule', CfnApplication_MaxAgeRulePropertyValidator)(properties.maxAgeRule));
    errors.collect(cdk.propertyValidator('maxCountRule', CfnApplication_MaxCountRulePropertyValidator)(properties.maxCountRule));
    return errors.wrap('supplied properties not correct for "ApplicationVersionLifecycleConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Application.ApplicationVersionLifecycleConfig` resource
 *
 * @param properties - the TypeScript properties of a `ApplicationVersionLifecycleConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Application.ApplicationVersionLifecycleConfig` resource.
 */
// @ts-ignore TS6133
function cfnApplicationApplicationVersionLifecycleConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_ApplicationVersionLifecycleConfigPropertyValidator(properties).assertSuccess();
    return {
        MaxAgeRule: cfnApplicationMaxAgeRulePropertyToCloudFormation(properties.maxAgeRule),
        MaxCountRule: cfnApplicationMaxCountRulePropertyToCloudFormation(properties.maxCountRule),
    };
}

// @ts-ignore TS6133
function CfnApplicationApplicationVersionLifecycleConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ApplicationVersionLifecycleConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ApplicationVersionLifecycleConfigProperty>();
    ret.addPropertyResult('maxAgeRule', 'MaxAgeRule', properties.MaxAgeRule != null ? CfnApplicationMaxAgeRulePropertyFromCloudFormation(properties.MaxAgeRule) : undefined);
    ret.addPropertyResult('maxCountRule', 'MaxCountRule', properties.MaxCountRule != null ? CfnApplicationMaxCountRulePropertyFromCloudFormation(properties.MaxCountRule) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Use the `MaxAgeRule` property type to specify a max age rule to restrict the length of time that application versions are retained for an AWS Elastic Beanstalk application when defining an AWS::ElasticBeanstalk::Application resource in an AWS CloudFormation template.
     *
     * A lifecycle rule that deletes application versions after the specified number of days.
     *
     * `MaxAgeRule` is a property of the [ApplicationVersionLifecycleConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationversionlifecycleconfig.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxagerule.html
     */
    export interface MaxAgeRuleProperty {
        /**
         * Set to `true` to delete a version's source bundle from Amazon S3 when Elastic Beanstalk deletes the application version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxagerule.html#cfn-elasticbeanstalk-application-maxagerule-deletesourcefroms3
         */
        readonly deleteSourceFromS3?: boolean | cdk.IResolvable;
        /**
         * Specify `true` to apply the rule, or `false` to disable it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxagerule.html#cfn-elasticbeanstalk-application-maxagerule-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * Specify the number of days to retain an application versions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxagerule.html#cfn-elasticbeanstalk-application-maxagerule-maxageindays
         */
        readonly maxAgeInDays?: number;
    }
}

/**
 * Determine whether the given properties match those of a `MaxAgeRuleProperty`
 *
 * @param properties - the TypeScript properties of a `MaxAgeRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_MaxAgeRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deleteSourceFromS3', cdk.validateBoolean)(properties.deleteSourceFromS3));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('maxAgeInDays', cdk.validateNumber)(properties.maxAgeInDays));
    return errors.wrap('supplied properties not correct for "MaxAgeRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Application.MaxAgeRule` resource
 *
 * @param properties - the TypeScript properties of a `MaxAgeRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Application.MaxAgeRule` resource.
 */
// @ts-ignore TS6133
function cfnApplicationMaxAgeRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_MaxAgeRulePropertyValidator(properties).assertSuccess();
    return {
        DeleteSourceFromS3: cdk.booleanToCloudFormation(properties.deleteSourceFromS3),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        MaxAgeInDays: cdk.numberToCloudFormation(properties.maxAgeInDays),
    };
}

// @ts-ignore TS6133
function CfnApplicationMaxAgeRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.MaxAgeRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.MaxAgeRuleProperty>();
    ret.addPropertyResult('deleteSourceFromS3', 'DeleteSourceFromS3', properties.DeleteSourceFromS3 != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteSourceFromS3) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('maxAgeInDays', 'MaxAgeInDays', properties.MaxAgeInDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxAgeInDays) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Use the `MaxAgeRule` property type to specify a max count rule to restrict the number of application versions that are retained for an AWS Elastic Beanstalk application when defining an AWS::ElasticBeanstalk::Application resource in an AWS CloudFormation template.
     *
     * A lifecycle rule that deletes the oldest application version when the maximum count is exceeded.
     *
     * `MaxCountRule` is a property of the [ApplicationVersionLifecycleConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationversionlifecycleconfig.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxcountrule.html
     */
    export interface MaxCountRuleProperty {
        /**
         * Set to `true` to delete a version's source bundle from Amazon S3 when Elastic Beanstalk deletes the application version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxcountrule.html#cfn-elasticbeanstalk-application-maxcountrule-deletesourcefroms3
         */
        readonly deleteSourceFromS3?: boolean | cdk.IResolvable;
        /**
         * Specify `true` to apply the rule, or `false` to disable it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxcountrule.html#cfn-elasticbeanstalk-application-maxcountrule-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * Specify the maximum number of application versions to retain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxcountrule.html#cfn-elasticbeanstalk-application-maxcountrule-maxcount
         */
        readonly maxCount?: number;
    }
}

/**
 * Determine whether the given properties match those of a `MaxCountRuleProperty`
 *
 * @param properties - the TypeScript properties of a `MaxCountRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_MaxCountRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deleteSourceFromS3', cdk.validateBoolean)(properties.deleteSourceFromS3));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('maxCount', cdk.validateNumber)(properties.maxCount));
    return errors.wrap('supplied properties not correct for "MaxCountRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Application.MaxCountRule` resource
 *
 * @param properties - the TypeScript properties of a `MaxCountRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Application.MaxCountRule` resource.
 */
// @ts-ignore TS6133
function cfnApplicationMaxCountRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_MaxCountRulePropertyValidator(properties).assertSuccess();
    return {
        DeleteSourceFromS3: cdk.booleanToCloudFormation(properties.deleteSourceFromS3),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        MaxCount: cdk.numberToCloudFormation(properties.maxCount),
    };
}

// @ts-ignore TS6133
function CfnApplicationMaxCountRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.MaxCountRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.MaxCountRuleProperty>();
    ret.addPropertyResult('deleteSourceFromS3', 'DeleteSourceFromS3', properties.DeleteSourceFromS3 != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteSourceFromS3) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('maxCount', 'MaxCount', properties.MaxCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCount) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnApplicationVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-applicationversion.html
 */
export interface CfnApplicationVersionProps {

    /**
     * The name of the Elastic Beanstalk application that is associated with this application version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-applicationversion.html#cfn-elasticbeanstalk-applicationversion-applicationname
     */
    readonly applicationName: string;

    /**
     * The Amazon S3 bucket and key that identify the location of the source bundle for this version.
     *
     * > The Amazon S3 bucket must be in the same region as the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-applicationversion.html#cfn-elasticbeanstalk-applicationversion-sourcebundle
     */
    readonly sourceBundle: CfnApplicationVersion.SourceBundleProperty | cdk.IResolvable;

    /**
     * A description of this application version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-applicationversion.html#cfn-elasticbeanstalk-applicationversion-description
     */
    readonly description?: string;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationVersionProps`
 *
 * @returns the result of the validation.
 */
function CfnApplicationVersionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationName', cdk.requiredValidator)(properties.applicationName));
    errors.collect(cdk.propertyValidator('applicationName', cdk.validateString)(properties.applicationName));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('sourceBundle', cdk.requiredValidator)(properties.sourceBundle));
    errors.collect(cdk.propertyValidator('sourceBundle', CfnApplicationVersion_SourceBundlePropertyValidator)(properties.sourceBundle));
    return errors.wrap('supplied properties not correct for "CfnApplicationVersionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::ApplicationVersion` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationVersionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::ApplicationVersion` resource.
 */
// @ts-ignore TS6133
function cfnApplicationVersionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationVersionPropsValidator(properties).assertSuccess();
    return {
        ApplicationName: cdk.stringToCloudFormation(properties.applicationName),
        SourceBundle: cfnApplicationVersionSourceBundlePropertyToCloudFormation(properties.sourceBundle),
        Description: cdk.stringToCloudFormation(properties.description),
    };
}

// @ts-ignore TS6133
function CfnApplicationVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationVersionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationVersionProps>();
    ret.addPropertyResult('applicationName', 'ApplicationName', cfn_parse.FromCloudFormation.getString(properties.ApplicationName));
    ret.addPropertyResult('sourceBundle', 'SourceBundle', CfnApplicationVersionSourceBundlePropertyFromCloudFormation(properties.SourceBundle));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ElasticBeanstalk::ApplicationVersion`
 *
 * Specify an AWS Elastic Beanstalk application version by using the AWS::ElasticBeanstalk::ApplicationVersion resource in an AWS CloudFormation template.
 *
 * The AWS::ElasticBeanstalk::ApplicationVersion resource is an AWS Elastic Beanstalk resource type that specifies an application version, an iteration of deployable code, for an Elastic Beanstalk application.
 *
 * > After you create an application version with a specified Amazon S3 bucket and key location, you can't change that Amazon S3 location. If you change the Amazon S3 location, an attempt to launch an environment from the application version will fail.
 *
 * @cloudformationResource AWS::ElasticBeanstalk::ApplicationVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-applicationversion.html
 */
export class CfnApplicationVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElasticBeanstalk::ApplicationVersion";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplicationVersion {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnApplicationVersionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnApplicationVersion(scope, id, propsResult.value);
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
     * The name of the Elastic Beanstalk application that is associated with this application version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-applicationversion.html#cfn-elasticbeanstalk-applicationversion-applicationname
     */
    public applicationName: string;

    /**
     * The Amazon S3 bucket and key that identify the location of the source bundle for this version.
     *
     * > The Amazon S3 bucket must be in the same region as the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-applicationversion.html#cfn-elasticbeanstalk-applicationversion-sourcebundle
     */
    public sourceBundle: CfnApplicationVersion.SourceBundleProperty | cdk.IResolvable;

    /**
     * A description of this application version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-applicationversion.html#cfn-elasticbeanstalk-applicationversion-description
     */
    public description: string | undefined;

    /**
     * Create a new `AWS::ElasticBeanstalk::ApplicationVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationVersionProps) {
        super(scope, id, { type: CfnApplicationVersion.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationName', this);
        cdk.requireProperty(props, 'sourceBundle', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.applicationName = props.applicationName;
        this.sourceBundle = props.sourceBundle;
        this.description = props.description;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplicationVersion.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationName: this.applicationName,
            sourceBundle: this.sourceBundle,
            description: this.description,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationVersionPropsToCloudFormation(props);
    }
}

export namespace CfnApplicationVersion {
    /**
     * Use the `SourceBundle` property type to specify the Amazon S3 location of the source bundle for an AWS Elastic Beanstalk application version when defining an AWS::ElasticBeanstalk::ApplicationVersion resource in an AWS CloudFormation template.
     *
     * The `SourceBundle` property is an embedded property of the [AWS::ElasticBeanstalk::ApplicationVersion](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-sourcebundle.html) resource. It specifies the Amazon S3 location of the source bundle for an AWS Elastic Beanstalk application version.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-applicationversion-sourcebundle.html
     */
    export interface SourceBundleProperty {
        /**
         * The Amazon S3 bucket where the data is located.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-applicationversion-sourcebundle.html#cfn-elasticbeanstalk-applicationversion-sourcebundle-s3bucket
         */
        readonly s3Bucket: string;
        /**
         * The Amazon S3 key where the data is located.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-applicationversion-sourcebundle.html#cfn-elasticbeanstalk-applicationversion-sourcebundle-s3key
         */
        readonly s3Key: string;
    }
}

/**
 * Determine whether the given properties match those of a `SourceBundleProperty`
 *
 * @param properties - the TypeScript properties of a `SourceBundleProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationVersion_SourceBundlePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.requiredValidator)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.validateString)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Key', cdk.requiredValidator)(properties.s3Key));
    errors.collect(cdk.propertyValidator('s3Key', cdk.validateString)(properties.s3Key));
    return errors.wrap('supplied properties not correct for "SourceBundleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::ApplicationVersion.SourceBundle` resource
 *
 * @param properties - the TypeScript properties of a `SourceBundleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::ApplicationVersion.SourceBundle` resource.
 */
// @ts-ignore TS6133
function cfnApplicationVersionSourceBundlePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationVersion_SourceBundlePropertyValidator(properties).assertSuccess();
    return {
        S3Bucket: cdk.stringToCloudFormation(properties.s3Bucket),
        S3Key: cdk.stringToCloudFormation(properties.s3Key),
    };
}

// @ts-ignore TS6133
function CfnApplicationVersionSourceBundlePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationVersion.SourceBundleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationVersion.SourceBundleProperty>();
    ret.addPropertyResult('s3Bucket', 'S3Bucket', cfn_parse.FromCloudFormation.getString(properties.S3Bucket));
    ret.addPropertyResult('s3Key', 'S3Key', cfn_parse.FromCloudFormation.getString(properties.S3Key));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnConfigurationTemplate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html
 */
export interface CfnConfigurationTemplateProps {

    /**
     * The name of the Elastic Beanstalk application to associate with this configuration template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-applicationname
     */
    readonly applicationName: string;

    /**
     * An optional description for this configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-description
     */
    readonly description?: string;

    /**
     * The ID of an environment whose settings you want to use to create the configuration template. You must specify `EnvironmentId` if you don't specify `PlatformArn` , `SolutionStackName` , or `SourceConfiguration` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-environmentid
     */
    readonly environmentId?: string;

    /**
     * Option values for the Elastic Beanstalk configuration, such as the instance type. If specified, these values override the values obtained from the solution stack or the source configuration template. For a complete list of Elastic Beanstalk configuration options, see [Option Values](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options.html) in the *AWS Elastic Beanstalk Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-optionsettings
     */
    readonly optionSettings?: Array<CfnConfigurationTemplate.ConfigurationOptionSettingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the custom platform. For more information, see [Custom Platforms](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/custom-platforms.html) in the *AWS Elastic Beanstalk Developer Guide* .
     *
     * > If you specify `PlatformArn` , then don't specify `SolutionStackName` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-platformarn
     */
    readonly platformArn?: string;

    /**
     * The name of an Elastic Beanstalk solution stack (platform version) that this configuration uses. For example, `64bit Amazon Linux 2013.09 running Tomcat 7 Java 7` . A solution stack specifies the operating system, runtime, and application server for a configuration template. It also determines the set of configuration options as well as the possible and default values. For more information, see [Supported Platforms](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.platforms.html) in the *AWS Elastic Beanstalk Developer Guide* .
     *
     * You must specify `SolutionStackName` if you don't specify `PlatformArn` , `EnvironmentId` , or `SourceConfiguration` .
     *
     * Use the [`ListAvailableSolutionStacks`](https://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_ListAvailableSolutionStacks.html) API to obtain a list of available solution stacks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-solutionstackname
     */
    readonly solutionStackName?: string;

    /**
     * An Elastic Beanstalk configuration template to base this one on. If specified, Elastic Beanstalk uses the configuration values from the specified configuration template to create a new configuration.
     *
     * Values specified in `OptionSettings` override any values obtained from the `SourceConfiguration` .
     *
     * You must specify `SourceConfiguration` if you don't specify `PlatformArn` , `EnvironmentId` , or `SolutionStackName` .
     *
     * Constraint: If both solution stack name and source configuration are specified, the solution stack of the source configuration template must match the specified solution stack name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-sourceconfiguration
     */
    readonly sourceConfiguration?: CfnConfigurationTemplate.SourceConfigurationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationTemplateProps`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationTemplatePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationName', cdk.requiredValidator)(properties.applicationName));
    errors.collect(cdk.propertyValidator('applicationName', cdk.validateString)(properties.applicationName));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('environmentId', cdk.validateString)(properties.environmentId));
    errors.collect(cdk.propertyValidator('optionSettings', cdk.listValidator(CfnConfigurationTemplate_ConfigurationOptionSettingPropertyValidator))(properties.optionSettings));
    errors.collect(cdk.propertyValidator('platformArn', cdk.validateString)(properties.platformArn));
    errors.collect(cdk.propertyValidator('solutionStackName', cdk.validateString)(properties.solutionStackName));
    errors.collect(cdk.propertyValidator('sourceConfiguration', CfnConfigurationTemplate_SourceConfigurationPropertyValidator)(properties.sourceConfiguration));
    return errors.wrap('supplied properties not correct for "CfnConfigurationTemplateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::ConfigurationTemplate` resource
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationTemplateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::ConfigurationTemplate` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationTemplatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationTemplatePropsValidator(properties).assertSuccess();
    return {
        ApplicationName: cdk.stringToCloudFormation(properties.applicationName),
        Description: cdk.stringToCloudFormation(properties.description),
        EnvironmentId: cdk.stringToCloudFormation(properties.environmentId),
        OptionSettings: cdk.listMapper(cfnConfigurationTemplateConfigurationOptionSettingPropertyToCloudFormation)(properties.optionSettings),
        PlatformArn: cdk.stringToCloudFormation(properties.platformArn),
        SolutionStackName: cdk.stringToCloudFormation(properties.solutionStackName),
        SourceConfiguration: cfnConfigurationTemplateSourceConfigurationPropertyToCloudFormation(properties.sourceConfiguration),
    };
}

// @ts-ignore TS6133
function CfnConfigurationTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationTemplateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationTemplateProps>();
    ret.addPropertyResult('applicationName', 'ApplicationName', cfn_parse.FromCloudFormation.getString(properties.ApplicationName));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('environmentId', 'EnvironmentId', properties.EnvironmentId != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentId) : undefined);
    ret.addPropertyResult('optionSettings', 'OptionSettings', properties.OptionSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigurationTemplateConfigurationOptionSettingPropertyFromCloudFormation)(properties.OptionSettings) : undefined);
    ret.addPropertyResult('platformArn', 'PlatformArn', properties.PlatformArn != null ? cfn_parse.FromCloudFormation.getString(properties.PlatformArn) : undefined);
    ret.addPropertyResult('solutionStackName', 'SolutionStackName', properties.SolutionStackName != null ? cfn_parse.FromCloudFormation.getString(properties.SolutionStackName) : undefined);
    ret.addPropertyResult('sourceConfiguration', 'SourceConfiguration', properties.SourceConfiguration != null ? CfnConfigurationTemplateSourceConfigurationPropertyFromCloudFormation(properties.SourceConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ElasticBeanstalk::ConfigurationTemplate`
 *
 * Specify an AWS Elastic Beanstalk configuration template by using the AWS::ElasticBeanstalk::ConfigurationTemplate resource in an AWS CloudFormation template.
 *
 * The AWS::ElasticBeanstalk::ConfigurationTemplate resource is an AWS Elastic Beanstalk resource type that specifies an Elastic Beanstalk configuration template, associated with a specific Elastic Beanstalk application. You define application configuration settings in a configuration template. You can then use the configuration template to deploy different versions of the application with the same configuration settings.
 *
 * > The Elastic Beanstalk console and documentation often refer to configuration templates as *saved configurations* . When you set configuration options in a saved configuration (configuration template), Elastic Beanstalk applies them with a particular precedence as part of applying options from multiple sources. For more information, see [Configuration Options](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options.html) in the *AWS Elastic Beanstalk Developer Guide* .
 *
 * @cloudformationResource AWS::ElasticBeanstalk::ConfigurationTemplate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html
 */
export class CfnConfigurationTemplate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElasticBeanstalk::ConfigurationTemplate";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigurationTemplate {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnConfigurationTemplatePropsFromCloudFormation(resourceProperties);
        const ret = new CfnConfigurationTemplate(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute TemplateName
     */
    public readonly attrTemplateName: string;

    /**
     * The name of the Elastic Beanstalk application to associate with this configuration template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-applicationname
     */
    public applicationName: string;

    /**
     * An optional description for this configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-description
     */
    public description: string | undefined;

    /**
     * The ID of an environment whose settings you want to use to create the configuration template. You must specify `EnvironmentId` if you don't specify `PlatformArn` , `SolutionStackName` , or `SourceConfiguration` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-environmentid
     */
    public environmentId: string | undefined;

    /**
     * Option values for the Elastic Beanstalk configuration, such as the instance type. If specified, these values override the values obtained from the solution stack or the source configuration template. For a complete list of Elastic Beanstalk configuration options, see [Option Values](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options.html) in the *AWS Elastic Beanstalk Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-optionsettings
     */
    public optionSettings: Array<CfnConfigurationTemplate.ConfigurationOptionSettingProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The Amazon Resource Name (ARN) of the custom platform. For more information, see [Custom Platforms](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/custom-platforms.html) in the *AWS Elastic Beanstalk Developer Guide* .
     *
     * > If you specify `PlatformArn` , then don't specify `SolutionStackName` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-platformarn
     */
    public platformArn: string | undefined;

    /**
     * The name of an Elastic Beanstalk solution stack (platform version) that this configuration uses. For example, `64bit Amazon Linux 2013.09 running Tomcat 7 Java 7` . A solution stack specifies the operating system, runtime, and application server for a configuration template. It also determines the set of configuration options as well as the possible and default values. For more information, see [Supported Platforms](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.platforms.html) in the *AWS Elastic Beanstalk Developer Guide* .
     *
     * You must specify `SolutionStackName` if you don't specify `PlatformArn` , `EnvironmentId` , or `SourceConfiguration` .
     *
     * Use the [`ListAvailableSolutionStacks`](https://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_ListAvailableSolutionStacks.html) API to obtain a list of available solution stacks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-solutionstackname
     */
    public solutionStackName: string | undefined;

    /**
     * An Elastic Beanstalk configuration template to base this one on. If specified, Elastic Beanstalk uses the configuration values from the specified configuration template to create a new configuration.
     *
     * Values specified in `OptionSettings` override any values obtained from the `SourceConfiguration` .
     *
     * You must specify `SourceConfiguration` if you don't specify `PlatformArn` , `EnvironmentId` , or `SolutionStackName` .
     *
     * Constraint: If both solution stack name and source configuration are specified, the solution stack of the source configuration template must match the specified solution stack name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-sourceconfiguration
     */
    public sourceConfiguration: CfnConfigurationTemplate.SourceConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::ElasticBeanstalk::ConfigurationTemplate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConfigurationTemplateProps) {
        super(scope, id, { type: CfnConfigurationTemplate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationName', this);
        this.attrTemplateName = cdk.Token.asString(this.getAtt('TemplateName', cdk.ResolutionTypeHint.STRING));

        this.applicationName = props.applicationName;
        this.description = props.description;
        this.environmentId = props.environmentId;
        this.optionSettings = props.optionSettings;
        this.platformArn = props.platformArn;
        this.solutionStackName = props.solutionStackName;
        this.sourceConfiguration = props.sourceConfiguration;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigurationTemplate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationName: this.applicationName,
            description: this.description,
            environmentId: this.environmentId,
            optionSettings: this.optionSettings,
            platformArn: this.platformArn,
            solutionStackName: this.solutionStackName,
            sourceConfiguration: this.sourceConfiguration,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConfigurationTemplatePropsToCloudFormation(props);
    }
}

export namespace CfnConfigurationTemplate {
    /**
     * Use the `ConfigurationOptionSetting` property type to specify an option for an AWS Elastic Beanstalk configuration template when defining an AWS::ElasticBeanstalk::ConfigurationTemplate resource in an AWS CloudFormation template.
     *
     * The `ConfigurationOptionSetting` property type specifies an option for an AWS Elastic Beanstalk configuration template.
     *
     * The `OptionSettings` property of the [AWS::ElasticBeanstalk::ConfigurationTemplate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-beanstalk-configurationtemplate.html) resource contains a list of `ConfigurationOptionSetting` property types.
     *
     * For a list of possible namespaces and option values, see [Option Values](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options.html) in the *AWS Elastic Beanstalk Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-configurationoptionsetting.html
     */
    export interface ConfigurationOptionSettingProperty {
        /**
         * A unique namespace that identifies the option's associated AWS resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-configurationoptionsetting.html#cfn-elasticbeanstalk-configurationtemplate-configurationoptionsetting-namespace
         */
        readonly namespace: string;
        /**
         * The name of the configuration option.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-configurationoptionsetting.html#cfn-elasticbeanstalk-configurationtemplate-configurationoptionsetting-optionname
         */
        readonly optionName: string;
        /**
         * A unique resource name for the option setting. Use it for a time–based scaling configuration option.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-configurationoptionsetting.html#cfn-elasticbeanstalk-configurationtemplate-configurationoptionsetting-resourcename
         */
        readonly resourceName?: string;
        /**
         * The current value for the configuration option.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-configurationoptionsetting.html#cfn-elasticbeanstalk-configurationtemplate-configurationoptionsetting-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ConfigurationOptionSettingProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationOptionSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationTemplate_ConfigurationOptionSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('namespace', cdk.requiredValidator)(properties.namespace));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    errors.collect(cdk.propertyValidator('optionName', cdk.requiredValidator)(properties.optionName));
    errors.collect(cdk.propertyValidator('optionName', cdk.validateString)(properties.optionName));
    errors.collect(cdk.propertyValidator('resourceName', cdk.validateString)(properties.resourceName));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "ConfigurationOptionSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::ConfigurationTemplate.ConfigurationOptionSetting` resource
 *
 * @param properties - the TypeScript properties of a `ConfigurationOptionSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::ConfigurationTemplate.ConfigurationOptionSetting` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationTemplateConfigurationOptionSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationTemplate_ConfigurationOptionSettingPropertyValidator(properties).assertSuccess();
    return {
        Namespace: cdk.stringToCloudFormation(properties.namespace),
        OptionName: cdk.stringToCloudFormation(properties.optionName),
        ResourceName: cdk.stringToCloudFormation(properties.resourceName),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnConfigurationTemplateConfigurationOptionSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationTemplate.ConfigurationOptionSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationTemplate.ConfigurationOptionSettingProperty>();
    ret.addPropertyResult('namespace', 'Namespace', cfn_parse.FromCloudFormation.getString(properties.Namespace));
    ret.addPropertyResult('optionName', 'OptionName', cfn_parse.FromCloudFormation.getString(properties.OptionName));
    ret.addPropertyResult('resourceName', 'ResourceName', properties.ResourceName != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceName) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfigurationTemplate {
    /**
     * Use the `SourceConfiguration` property type to specify another AWS Elastic Beanstalk configuration template as the base to creating a new AWS::ElasticBeanstalk::ConfigurationTemplate resource in an AWS CloudFormation template.
     *
     * An AWS Elastic Beanstalk configuration template to base a new one on. You can use it to define a [AWS::ElasticBeanstalk::ConfigurationTemplate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-beanstalk-configurationtemplate.html) resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-sourceconfiguration.html
     */
    export interface SourceConfigurationProperty {
        /**
         * The name of the application associated with the configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-sourceconfiguration.html#cfn-elasticbeanstalk-configurationtemplate-sourceconfiguration-applicationname
         */
        readonly applicationName: string;
        /**
         * The name of the configuration template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-sourceconfiguration.html#cfn-elasticbeanstalk-configurationtemplate-sourceconfiguration-templatename
         */
        readonly templateName: string;
    }
}

/**
 * Determine whether the given properties match those of a `SourceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SourceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationTemplate_SourceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationName', cdk.requiredValidator)(properties.applicationName));
    errors.collect(cdk.propertyValidator('applicationName', cdk.validateString)(properties.applicationName));
    errors.collect(cdk.propertyValidator('templateName', cdk.requiredValidator)(properties.templateName));
    errors.collect(cdk.propertyValidator('templateName', cdk.validateString)(properties.templateName));
    return errors.wrap('supplied properties not correct for "SourceConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::ConfigurationTemplate.SourceConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SourceConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::ConfigurationTemplate.SourceConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationTemplateSourceConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationTemplate_SourceConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ApplicationName: cdk.stringToCloudFormation(properties.applicationName),
        TemplateName: cdk.stringToCloudFormation(properties.templateName),
    };
}

// @ts-ignore TS6133
function CfnConfigurationTemplateSourceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationTemplate.SourceConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationTemplate.SourceConfigurationProperty>();
    ret.addPropertyResult('applicationName', 'ApplicationName', cfn_parse.FromCloudFormation.getString(properties.ApplicationName));
    ret.addPropertyResult('templateName', 'TemplateName', cfn_parse.FromCloudFormation.getString(properties.TemplateName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnEnvironment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html
 */
export interface CfnEnvironmentProps {

    /**
     * The name of the application that is associated with this environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-applicationname
     */
    readonly applicationName: string;

    /**
     * If specified, the environment attempts to use this value as the prefix for the CNAME in your Elastic Beanstalk environment URL. If not specified, the CNAME is generated automatically by appending a random alphanumeric string to the environment name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-cnameprefix
     */
    readonly cnamePrefix?: string;

    /**
     * Your description for this environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-description
     */
    readonly description?: string;

    /**
     * A unique name for the environment.
     *
     * Constraint: Must be from 4 to 40 characters in length. The name can contain only letters, numbers, and hyphens. It can't start or end with a hyphen. This name must be unique within a region in your account.
     *
     * If you don't specify the `CNAMEPrefix` parameter, the environment name becomes part of the CNAME, and therefore part of the visible URL for your application.
     *
     * If you don't specify an environment name, AWS CloudFormation generates a unique physical ID and uses that ID for the environment name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-environmentname
     */
    readonly environmentName?: string;

    /**
     * > The operations role feature of AWS Elastic Beanstalk is in beta release and is subject to change.
     *
     * The Amazon Resource Name (ARN) of an existing IAM role to be used as the environment's operations role. If specified, Elastic Beanstalk uses the operations role for permissions to downstream services during this call and during subsequent calls acting on this environment. To specify an operations role, you must have the `iam:PassRole` permission for the role.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-operationsrole
     */
    readonly operationsRole?: string;

    /**
     * Key-value pairs defining configuration options for this environment, such as the instance type. These options override the values that are defined in the solution stack or the [configuration template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-beanstalk-configurationtemplate.html) . If you remove any options during a stack update, the removed options retain their current values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-optionsettings
     */
    readonly optionSettings?: Array<CfnEnvironment.OptionSettingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the custom platform to use with the environment. For more information, see [Custom Platforms](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/custom-platforms.html) in the *AWS Elastic Beanstalk Developer Guide* .
     *
     * > If you specify `PlatformArn` , don't specify `SolutionStackName` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-platformarn
     */
    readonly platformArn?: string;

    /**
     * The name of an Elastic Beanstalk solution stack (platform version) to use with the environment. If specified, Elastic Beanstalk sets the configuration values to the default values associated with the specified solution stack. For a list of current solution stacks, see [Elastic Beanstalk Supported Platforms](https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platforms-supported.html) in the *AWS Elastic Beanstalk Platforms* guide.
     *
     * > If you specify `SolutionStackName` , don't specify `PlatformArn` or `TemplateName` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-solutionstackname
     */
    readonly solutionStackName?: string;

    /**
     * Specifies the tags applied to resources in the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The name of the Elastic Beanstalk configuration template to use with the environment.
     *
     * > If you specify `TemplateName` , then don't specify `SolutionStackName` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-templatename
     */
    readonly templateName?: string;

    /**
     * Specifies the tier to use in creating this environment. The environment tier that you choose determines whether Elastic Beanstalk provisions resources to support a web application that handles HTTP(S) requests or a web application that handles background-processing tasks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-tier
     */
    readonly tier?: CfnEnvironment.TierProperty | cdk.IResolvable;

    /**
     * The name of the application version to deploy.
     *
     * Default: If not specified, Elastic Beanstalk attempts to deploy the sample application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-versionlabel
     */
    readonly versionLabel?: string;
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
    errors.collect(cdk.propertyValidator('applicationName', cdk.requiredValidator)(properties.applicationName));
    errors.collect(cdk.propertyValidator('applicationName', cdk.validateString)(properties.applicationName));
    errors.collect(cdk.propertyValidator('cnamePrefix', cdk.validateString)(properties.cnamePrefix));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('environmentName', cdk.validateString)(properties.environmentName));
    errors.collect(cdk.propertyValidator('operationsRole', cdk.validateString)(properties.operationsRole));
    errors.collect(cdk.propertyValidator('optionSettings', cdk.listValidator(CfnEnvironment_OptionSettingPropertyValidator))(properties.optionSettings));
    errors.collect(cdk.propertyValidator('platformArn', cdk.validateString)(properties.platformArn));
    errors.collect(cdk.propertyValidator('solutionStackName', cdk.validateString)(properties.solutionStackName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('templateName', cdk.validateString)(properties.templateName));
    errors.collect(cdk.propertyValidator('tier', CfnEnvironment_TierPropertyValidator)(properties.tier));
    errors.collect(cdk.propertyValidator('versionLabel', cdk.validateString)(properties.versionLabel));
    return errors.wrap('supplied properties not correct for "CfnEnvironmentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Environment` resource
 *
 * @param properties - the TypeScript properties of a `CfnEnvironmentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Environment` resource.
 */
// @ts-ignore TS6133
function cfnEnvironmentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnvironmentPropsValidator(properties).assertSuccess();
    return {
        ApplicationName: cdk.stringToCloudFormation(properties.applicationName),
        CNAMEPrefix: cdk.stringToCloudFormation(properties.cnamePrefix),
        Description: cdk.stringToCloudFormation(properties.description),
        EnvironmentName: cdk.stringToCloudFormation(properties.environmentName),
        OperationsRole: cdk.stringToCloudFormation(properties.operationsRole),
        OptionSettings: cdk.listMapper(cfnEnvironmentOptionSettingPropertyToCloudFormation)(properties.optionSettings),
        PlatformArn: cdk.stringToCloudFormation(properties.platformArn),
        SolutionStackName: cdk.stringToCloudFormation(properties.solutionStackName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TemplateName: cdk.stringToCloudFormation(properties.templateName),
        Tier: cfnEnvironmentTierPropertyToCloudFormation(properties.tier),
        VersionLabel: cdk.stringToCloudFormation(properties.versionLabel),
    };
}

// @ts-ignore TS6133
function CfnEnvironmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironmentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironmentProps>();
    ret.addPropertyResult('applicationName', 'ApplicationName', cfn_parse.FromCloudFormation.getString(properties.ApplicationName));
    ret.addPropertyResult('cnamePrefix', 'CNAMEPrefix', properties.CNAMEPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.CNAMEPrefix) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('environmentName', 'EnvironmentName', properties.EnvironmentName != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentName) : undefined);
    ret.addPropertyResult('operationsRole', 'OperationsRole', properties.OperationsRole != null ? cfn_parse.FromCloudFormation.getString(properties.OperationsRole) : undefined);
    ret.addPropertyResult('optionSettings', 'OptionSettings', properties.OptionSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnEnvironmentOptionSettingPropertyFromCloudFormation)(properties.OptionSettings) : undefined);
    ret.addPropertyResult('platformArn', 'PlatformArn', properties.PlatformArn != null ? cfn_parse.FromCloudFormation.getString(properties.PlatformArn) : undefined);
    ret.addPropertyResult('solutionStackName', 'SolutionStackName', properties.SolutionStackName != null ? cfn_parse.FromCloudFormation.getString(properties.SolutionStackName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('templateName', 'TemplateName', properties.TemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateName) : undefined);
    ret.addPropertyResult('tier', 'Tier', properties.Tier != null ? CfnEnvironmentTierPropertyFromCloudFormation(properties.Tier) : undefined);
    ret.addPropertyResult('versionLabel', 'VersionLabel', properties.VersionLabel != null ? cfn_parse.FromCloudFormation.getString(properties.VersionLabel) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ElasticBeanstalk::Environment`
 *
 * Specify an AWS Elastic Beanstalk environment by using the AWS::ElasticBeanstalk::Environment resource in an AWS CloudFormation template.
 *
 * The AWS::ElasticBeanstalk::Environment resource is an AWS Elastic Beanstalk resource type that specifies an Elastic Beanstalk environment.
 *
 * @cloudformationResource AWS::ElasticBeanstalk::Environment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html
 */
export class CfnEnvironment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElasticBeanstalk::Environment";

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
     * For load-balanced, autoscaling environments, the URL to the load balancer. For single-instance environments, the IP address of the instance.
     *
     * Example load balancer URL:
     *
     * Example instance IP address:
     *
     * `192.0.2.0`
     * @cloudformationAttribute EndpointURL
     */
    public readonly attrEndpointUrl: string;

    /**
     * The name of the application that is associated with this environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-applicationname
     */
    public applicationName: string;

    /**
     * If specified, the environment attempts to use this value as the prefix for the CNAME in your Elastic Beanstalk environment URL. If not specified, the CNAME is generated automatically by appending a random alphanumeric string to the environment name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-cnameprefix
     */
    public cnamePrefix: string | undefined;

    /**
     * Your description for this environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-description
     */
    public description: string | undefined;

    /**
     * A unique name for the environment.
     *
     * Constraint: Must be from 4 to 40 characters in length. The name can contain only letters, numbers, and hyphens. It can't start or end with a hyphen. This name must be unique within a region in your account.
     *
     * If you don't specify the `CNAMEPrefix` parameter, the environment name becomes part of the CNAME, and therefore part of the visible URL for your application.
     *
     * If you don't specify an environment name, AWS CloudFormation generates a unique physical ID and uses that ID for the environment name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-environmentname
     */
    public environmentName: string | undefined;

    /**
     * > The operations role feature of AWS Elastic Beanstalk is in beta release and is subject to change.
     *
     * The Amazon Resource Name (ARN) of an existing IAM role to be used as the environment's operations role. If specified, Elastic Beanstalk uses the operations role for permissions to downstream services during this call and during subsequent calls acting on this environment. To specify an operations role, you must have the `iam:PassRole` permission for the role.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-operationsrole
     */
    public operationsRole: string | undefined;

    /**
     * Key-value pairs defining configuration options for this environment, such as the instance type. These options override the values that are defined in the solution stack or the [configuration template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-beanstalk-configurationtemplate.html) . If you remove any options during a stack update, the removed options retain their current values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-optionsettings
     */
    public optionSettings: Array<CfnEnvironment.OptionSettingProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The Amazon Resource Name (ARN) of the custom platform to use with the environment. For more information, see [Custom Platforms](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/custom-platforms.html) in the *AWS Elastic Beanstalk Developer Guide* .
     *
     * > If you specify `PlatformArn` , don't specify `SolutionStackName` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-platformarn
     */
    public platformArn: string | undefined;

    /**
     * The name of an Elastic Beanstalk solution stack (platform version) to use with the environment. If specified, Elastic Beanstalk sets the configuration values to the default values associated with the specified solution stack. For a list of current solution stacks, see [Elastic Beanstalk Supported Platforms](https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platforms-supported.html) in the *AWS Elastic Beanstalk Platforms* guide.
     *
     * > If you specify `SolutionStackName` , don't specify `PlatformArn` or `TemplateName` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-solutionstackname
     */
    public solutionStackName: string | undefined;

    /**
     * Specifies the tags applied to resources in the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The name of the Elastic Beanstalk configuration template to use with the environment.
     *
     * > If you specify `TemplateName` , then don't specify `SolutionStackName` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-templatename
     */
    public templateName: string | undefined;

    /**
     * Specifies the tier to use in creating this environment. The environment tier that you choose determines whether Elastic Beanstalk provisions resources to support a web application that handles HTTP(S) requests or a web application that handles background-processing tasks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-tier
     */
    public tier: CfnEnvironment.TierProperty | cdk.IResolvable | undefined;

    /**
     * The name of the application version to deploy.
     *
     * Default: If not specified, Elastic Beanstalk attempts to deploy the sample application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-versionlabel
     */
    public versionLabel: string | undefined;

    /**
     * Create a new `AWS::ElasticBeanstalk::Environment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEnvironmentProps) {
        super(scope, id, { type: CfnEnvironment.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationName', this);
        this.attrEndpointUrl = cdk.Token.asString(this.getAtt('EndpointURL', cdk.ResolutionTypeHint.STRING));

        this.applicationName = props.applicationName;
        this.cnamePrefix = props.cnamePrefix;
        this.description = props.description;
        this.environmentName = props.environmentName;
        this.operationsRole = props.operationsRole;
        this.optionSettings = props.optionSettings;
        this.platformArn = props.platformArn;
        this.solutionStackName = props.solutionStackName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ElasticBeanstalk::Environment", props.tags, { tagPropertyName: 'tags' });
        this.templateName = props.templateName;
        this.tier = props.tier;
        this.versionLabel = props.versionLabel;
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
            applicationName: this.applicationName,
            cnamePrefix: this.cnamePrefix,
            description: this.description,
            environmentName: this.environmentName,
            operationsRole: this.operationsRole,
            optionSettings: this.optionSettings,
            platformArn: this.platformArn,
            solutionStackName: this.solutionStackName,
            tags: this.tags.renderTags(),
            templateName: this.templateName,
            tier: this.tier,
            versionLabel: this.versionLabel,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEnvironmentPropsToCloudFormation(props);
    }
}

export namespace CfnEnvironment {
    /**
     * Use the `OptionSetting` property type to specify an option for an AWS Elastic Beanstalk environment when defining an AWS::ElasticBeanstalk::Environment resource in an AWS CloudFormation template.
     *
     * The `OptionSetting` property type specifies an option for an AWS Elastic Beanstalk environment.
     *
     * The `OptionSettings` property of the [AWS::ElasticBeanstalk::Environment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-environment.html) resource contains a list of `OptionSetting` property types.
     *
     * For a list of possible namespaces and option values, see [Option Values](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options.html) in the *AWS Elastic Beanstalk Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-optionsetting.html
     */
    export interface OptionSettingProperty {
        /**
         * A unique namespace that identifies the option's associated AWS resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-optionsetting.html#cfn-elasticbeanstalk-environment-optionsetting-namespace
         */
        readonly namespace: string;
        /**
         * The name of the configuration option.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-optionsetting.html#cfn-elasticbeanstalk-environment-optionsetting-optionname
         */
        readonly optionName: string;
        /**
         * A unique resource name for the option setting. Use it for a time–based scaling configuration option.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-optionsetting.html#cfn-elasticbeanstalk-environment-optionsetting-resourcename
         */
        readonly resourceName?: string;
        /**
         * The current value for the configuration option.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-optionsetting.html#cfn-elasticbeanstalk-environment-optionsetting-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OptionSettingProperty`
 *
 * @param properties - the TypeScript properties of a `OptionSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnEnvironment_OptionSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('namespace', cdk.requiredValidator)(properties.namespace));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    errors.collect(cdk.propertyValidator('optionName', cdk.requiredValidator)(properties.optionName));
    errors.collect(cdk.propertyValidator('optionName', cdk.validateString)(properties.optionName));
    errors.collect(cdk.propertyValidator('resourceName', cdk.validateString)(properties.resourceName));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "OptionSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Environment.OptionSetting` resource
 *
 * @param properties - the TypeScript properties of a `OptionSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Environment.OptionSetting` resource.
 */
// @ts-ignore TS6133
function cfnEnvironmentOptionSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnvironment_OptionSettingPropertyValidator(properties).assertSuccess();
    return {
        Namespace: cdk.stringToCloudFormation(properties.namespace),
        OptionName: cdk.stringToCloudFormation(properties.optionName),
        ResourceName: cdk.stringToCloudFormation(properties.resourceName),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnEnvironmentOptionSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironment.OptionSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.OptionSettingProperty>();
    ret.addPropertyResult('namespace', 'Namespace', cfn_parse.FromCloudFormation.getString(properties.Namespace));
    ret.addPropertyResult('optionName', 'OptionName', cfn_parse.FromCloudFormation.getString(properties.OptionName));
    ret.addPropertyResult('resourceName', 'ResourceName', properties.ResourceName != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceName) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEnvironment {
    /**
     * Use the `Tier` property type to specify the environment tier for an AWS Elastic Beanstalk environment when defining an AWS::ElasticBeanstalk::Environment resource in an AWS CloudFormation template.
     *
     * Describes the environment tier for an [AWS::ElasticBeanstalk::Environment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-environment.html) resource. For more information, see [Environment Tiers](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features-managing-env-tiers.html) in the *AWS Elastic Beanstalk Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-tier.html
     */
    export interface TierProperty {
        /**
         * The name of this environment tier.
         *
         * Valid values:
         *
         * - For *Web server tier* – `WebServer`
         * - For *Worker tier* – `Worker`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-tier.html#cfn-elasticbeanstalk-environment-tier-name
         */
        readonly name?: string;
        /**
         * The type of this environment tier.
         *
         * Valid values:
         *
         * - For *Web server tier* – `Standard`
         * - For *Worker tier* – `SQS/HTTP`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-tier.html#cfn-elasticbeanstalk-environment-tier-type
         */
        readonly type?: string;
        /**
         * The version of this environment tier. When you don't set a value to it, Elastic Beanstalk uses the latest compatible worker tier version.
         *
         * > This member is deprecated. Any specific version that you set may become out of date. We recommend leaving it unspecified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-tier.html#cfn-elasticbeanstalk-environment-tier-version
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TierProperty`
 *
 * @param properties - the TypeScript properties of a `TierProperty`
 *
 * @returns the result of the validation.
 */
function CfnEnvironment_TierPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "TierProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Environment.Tier` resource
 *
 * @param properties - the TypeScript properties of a `TierProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticBeanstalk::Environment.Tier` resource.
 */
// @ts-ignore TS6133
function cfnEnvironmentTierPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnvironment_TierPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Type: cdk.stringToCloudFormation(properties.type),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnEnvironmentTierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironment.TierProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.TierProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
