// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:53.143Z","fingerprint":"hlP40VZjaPWWOVlDKKyKPeg3iZVYtJbOuCUvdoOf0iM="}

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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html
 */
export interface CfnApplicationProps {

    /**
     * The runtime environment for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-runtimeenvironment
     */
    readonly runtimeEnvironment: string;

    /**
     * Specifies the IAM role that the application uses to access external resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-serviceexecutionrole
     */
    readonly serviceExecutionRole: string;

    /**
     * Use this parameter to configure the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-applicationconfiguration
     */
    readonly applicationConfiguration?: CfnApplication.ApplicationConfigurationProperty | cdk.IResolvable;

    /**
     * The description of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-applicationdescription
     */
    readonly applicationDescription?: string;

    /**
     * `AWS::KinesisAnalyticsV2::Application.ApplicationMaintenanceConfiguration`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-applicationmaintenanceconfiguration
     */
    readonly applicationMaintenanceConfiguration?: CfnApplication.ApplicationMaintenanceConfigurationProperty | cdk.IResolvable;

    /**
     * To create a Kinesis Data Analytics Studio notebook, you must set the mode to `INTERACTIVE` . However, for a Kinesis Data Analytics for Apache Flink application, the mode is optional.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-applicationmode
     */
    readonly applicationMode?: string;

    /**
     * The name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-applicationname
     */
    readonly applicationName?: string;

    /**
     * `AWS::KinesisAnalyticsV2::Application.RunConfiguration`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-runconfiguration
     */
    readonly runConfiguration?: CfnApplication.RunConfigurationProperty | cdk.IResolvable;

    /**
     * A list of one or more tags to assign to the application. A tag is a key-value pair that identifies an application. Note that the maximum number of application tags includes system tags. The maximum number of user-defined application tags is 50.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-tags
     */
    readonly tags?: cdk.CfnTag[];
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
    errors.collect(cdk.propertyValidator('applicationConfiguration', CfnApplication_ApplicationConfigurationPropertyValidator)(properties.applicationConfiguration));
    errors.collect(cdk.propertyValidator('applicationDescription', cdk.validateString)(properties.applicationDescription));
    errors.collect(cdk.propertyValidator('applicationMaintenanceConfiguration', CfnApplication_ApplicationMaintenanceConfigurationPropertyValidator)(properties.applicationMaintenanceConfiguration));
    errors.collect(cdk.propertyValidator('applicationMode', cdk.validateString)(properties.applicationMode));
    errors.collect(cdk.propertyValidator('applicationName', cdk.validateString)(properties.applicationName));
    errors.collect(cdk.propertyValidator('runConfiguration', CfnApplication_RunConfigurationPropertyValidator)(properties.runConfiguration));
    errors.collect(cdk.propertyValidator('runtimeEnvironment', cdk.requiredValidator)(properties.runtimeEnvironment));
    errors.collect(cdk.propertyValidator('runtimeEnvironment', cdk.validateString)(properties.runtimeEnvironment));
    errors.collect(cdk.propertyValidator('serviceExecutionRole', cdk.requiredValidator)(properties.serviceExecutionRole));
    errors.collect(cdk.propertyValidator('serviceExecutionRole', cdk.validateString)(properties.serviceExecutionRole));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnApplicationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application` resource.
 */
// @ts-ignore TS6133
function cfnApplicationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationPropsValidator(properties).assertSuccess();
    return {
        RuntimeEnvironment: cdk.stringToCloudFormation(properties.runtimeEnvironment),
        ServiceExecutionRole: cdk.stringToCloudFormation(properties.serviceExecutionRole),
        ApplicationConfiguration: cfnApplicationApplicationConfigurationPropertyToCloudFormation(properties.applicationConfiguration),
        ApplicationDescription: cdk.stringToCloudFormation(properties.applicationDescription),
        ApplicationMaintenanceConfiguration: cfnApplicationApplicationMaintenanceConfigurationPropertyToCloudFormation(properties.applicationMaintenanceConfiguration),
        ApplicationMode: cdk.stringToCloudFormation(properties.applicationMode),
        ApplicationName: cdk.stringToCloudFormation(properties.applicationName),
        RunConfiguration: cfnApplicationRunConfigurationPropertyToCloudFormation(properties.runConfiguration),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
    ret.addPropertyResult('runtimeEnvironment', 'RuntimeEnvironment', cfn_parse.FromCloudFormation.getString(properties.RuntimeEnvironment));
    ret.addPropertyResult('serviceExecutionRole', 'ServiceExecutionRole', cfn_parse.FromCloudFormation.getString(properties.ServiceExecutionRole));
    ret.addPropertyResult('applicationConfiguration', 'ApplicationConfiguration', properties.ApplicationConfiguration != null ? CfnApplicationApplicationConfigurationPropertyFromCloudFormation(properties.ApplicationConfiguration) : undefined);
    ret.addPropertyResult('applicationDescription', 'ApplicationDescription', properties.ApplicationDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationDescription) : undefined);
    ret.addPropertyResult('applicationMaintenanceConfiguration', 'ApplicationMaintenanceConfiguration', properties.ApplicationMaintenanceConfiguration != null ? CfnApplicationApplicationMaintenanceConfigurationPropertyFromCloudFormation(properties.ApplicationMaintenanceConfiguration) : undefined);
    ret.addPropertyResult('applicationMode', 'ApplicationMode', properties.ApplicationMode != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationMode) : undefined);
    ret.addPropertyResult('applicationName', 'ApplicationName', properties.ApplicationName != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationName) : undefined);
    ret.addPropertyResult('runConfiguration', 'RunConfiguration', properties.RunConfiguration != null ? CfnApplicationRunConfigurationPropertyFromCloudFormation(properties.RunConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::KinesisAnalyticsV2::Application`
 *
 * Creates an Amazon Kinesis Data Analytics application. For information about creating a Kinesis Data Analytics application, see [Creating an Application](https://docs.aws.amazon.com/kinesisanalytics/latest/java/getting-started.html) .
 *
 * @cloudformationResource AWS::KinesisAnalyticsV2::Application
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::KinesisAnalyticsV2::Application";

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
     * The runtime environment for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-runtimeenvironment
     */
    public runtimeEnvironment: string;

    /**
     * Specifies the IAM role that the application uses to access external resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-serviceexecutionrole
     */
    public serviceExecutionRole: string;

    /**
     * Use this parameter to configure the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-applicationconfiguration
     */
    public applicationConfiguration: CfnApplication.ApplicationConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The description of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-applicationdescription
     */
    public applicationDescription: string | undefined;

    /**
     * `AWS::KinesisAnalyticsV2::Application.ApplicationMaintenanceConfiguration`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-applicationmaintenanceconfiguration
     */
    public applicationMaintenanceConfiguration: CfnApplication.ApplicationMaintenanceConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * To create a Kinesis Data Analytics Studio notebook, you must set the mode to `INTERACTIVE` . However, for a Kinesis Data Analytics for Apache Flink application, the mode is optional.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-applicationmode
     */
    public applicationMode: string | undefined;

    /**
     * The name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-applicationname
     */
    public applicationName: string | undefined;

    /**
     * `AWS::KinesisAnalyticsV2::Application.RunConfiguration`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-runconfiguration
     */
    public runConfiguration: CfnApplication.RunConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * A list of one or more tags to assign to the application. A tag is a key-value pair that identifies an application. Note that the maximum number of application tags includes system tags. The maximum number of user-defined application tags is 50.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::KinesisAnalyticsV2::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
        super(scope, id, { type: CfnApplication.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'runtimeEnvironment', this);
        cdk.requireProperty(props, 'serviceExecutionRole', this);

        this.runtimeEnvironment = props.runtimeEnvironment;
        this.serviceExecutionRole = props.serviceExecutionRole;
        this.applicationConfiguration = props.applicationConfiguration;
        this.applicationDescription = props.applicationDescription;
        this.applicationMaintenanceConfiguration = props.applicationMaintenanceConfiguration;
        this.applicationMode = props.applicationMode;
        this.applicationName = props.applicationName;
        this.runConfiguration = props.runConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::KinesisAnalyticsV2::Application", props.tags, { tagPropertyName: 'tags' });
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
            runtimeEnvironment: this.runtimeEnvironment,
            serviceExecutionRole: this.serviceExecutionRole,
            applicationConfiguration: this.applicationConfiguration,
            applicationDescription: this.applicationDescription,
            applicationMaintenanceConfiguration: this.applicationMaintenanceConfiguration,
            applicationMode: this.applicationMode,
            applicationName: this.applicationName,
            runConfiguration: this.runConfiguration,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationPropsToCloudFormation(props);
    }
}

export namespace CfnApplication {
    /**
     * Describes code configuration for an application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationcodeconfiguration.html
     */
    export interface ApplicationCodeConfigurationProperty {
        /**
         * The location and type of the application code.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationcodeconfiguration.html#cfn-kinesisanalyticsv2-application-applicationcodeconfiguration-codecontent
         */
        readonly codeContent: CfnApplication.CodeContentProperty | cdk.IResolvable;
        /**
         * Specifies whether the code content is in text or zip format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationcodeconfiguration.html#cfn-kinesisanalyticsv2-application-applicationcodeconfiguration-codecontenttype
         */
        readonly codeContentType: string;
    }
}

/**
 * Determine whether the given properties match those of a `ApplicationCodeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationCodeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ApplicationCodeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('codeContent', cdk.requiredValidator)(properties.codeContent));
    errors.collect(cdk.propertyValidator('codeContent', CfnApplication_CodeContentPropertyValidator)(properties.codeContent));
    errors.collect(cdk.propertyValidator('codeContentType', cdk.requiredValidator)(properties.codeContentType));
    errors.collect(cdk.propertyValidator('codeContentType', cdk.validateString)(properties.codeContentType));
    return errors.wrap('supplied properties not correct for "ApplicationCodeConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ApplicationCodeConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ApplicationCodeConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ApplicationCodeConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationApplicationCodeConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_ApplicationCodeConfigurationPropertyValidator(properties).assertSuccess();
    return {
        CodeContent: cfnApplicationCodeContentPropertyToCloudFormation(properties.codeContent),
        CodeContentType: cdk.stringToCloudFormation(properties.codeContentType),
    };
}

// @ts-ignore TS6133
function CfnApplicationApplicationCodeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ApplicationCodeConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ApplicationCodeConfigurationProperty>();
    ret.addPropertyResult('codeContent', 'CodeContent', CfnApplicationCodeContentPropertyFromCloudFormation(properties.CodeContent));
    ret.addPropertyResult('codeContentType', 'CodeContentType', cfn_parse.FromCloudFormation.getString(properties.CodeContentType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Specifies the creation parameters for a Kinesis Data Analytics application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationconfiguration.html
     */
    export interface ApplicationConfigurationProperty {
        /**
         * The code location and type parameters for a Flink-based Kinesis Data Analytics application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationconfiguration.html#cfn-kinesisanalyticsv2-application-applicationconfiguration-applicationcodeconfiguration
         */
        readonly applicationCodeConfiguration?: CfnApplication.ApplicationCodeConfigurationProperty | cdk.IResolvable;
        /**
         * Describes whether snapshots are enabled for a Flink-based Kinesis Data Analytics application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationconfiguration.html#cfn-kinesisanalyticsv2-application-applicationconfiguration-applicationsnapshotconfiguration
         */
        readonly applicationSnapshotConfiguration?: CfnApplication.ApplicationSnapshotConfigurationProperty | cdk.IResolvable;
        /**
         * Describes execution properties for a Flink-based Kinesis Data Analytics application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationconfiguration.html#cfn-kinesisanalyticsv2-application-applicationconfiguration-environmentproperties
         */
        readonly environmentProperties?: CfnApplication.EnvironmentPropertiesProperty | cdk.IResolvable;
        /**
         * The creation and update parameters for a Flink-based Kinesis Data Analytics application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationconfiguration.html#cfn-kinesisanalyticsv2-application-applicationconfiguration-flinkapplicationconfiguration
         */
        readonly flinkApplicationConfiguration?: CfnApplication.FlinkApplicationConfigurationProperty | cdk.IResolvable;
        /**
         * The creation and update parameters for a SQL-based Kinesis Data Analytics application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationconfiguration.html#cfn-kinesisanalyticsv2-application-applicationconfiguration-sqlapplicationconfiguration
         */
        readonly sqlApplicationConfiguration?: CfnApplication.SqlApplicationConfigurationProperty | cdk.IResolvable;
        /**
         * The array of descriptions of VPC configurations available to the application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationconfiguration.html#cfn-kinesisanalyticsv2-application-applicationconfiguration-vpcconfigurations
         */
        readonly vpcConfigurations?: Array<CfnApplication.VpcConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The configuration parameters for a Kinesis Data Analytics Studio notebook.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationconfiguration.html#cfn-kinesisanalyticsv2-application-applicationconfiguration-zeppelinapplicationconfiguration
         */
        readonly zeppelinApplicationConfiguration?: CfnApplication.ZeppelinApplicationConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ApplicationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ApplicationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationCodeConfiguration', CfnApplication_ApplicationCodeConfigurationPropertyValidator)(properties.applicationCodeConfiguration));
    errors.collect(cdk.propertyValidator('applicationSnapshotConfiguration', CfnApplication_ApplicationSnapshotConfigurationPropertyValidator)(properties.applicationSnapshotConfiguration));
    errors.collect(cdk.propertyValidator('environmentProperties', CfnApplication_EnvironmentPropertiesPropertyValidator)(properties.environmentProperties));
    errors.collect(cdk.propertyValidator('flinkApplicationConfiguration', CfnApplication_FlinkApplicationConfigurationPropertyValidator)(properties.flinkApplicationConfiguration));
    errors.collect(cdk.propertyValidator('sqlApplicationConfiguration', CfnApplication_SqlApplicationConfigurationPropertyValidator)(properties.sqlApplicationConfiguration));
    errors.collect(cdk.propertyValidator('vpcConfigurations', cdk.listValidator(CfnApplication_VpcConfigurationPropertyValidator))(properties.vpcConfigurations));
    errors.collect(cdk.propertyValidator('zeppelinApplicationConfiguration', CfnApplication_ZeppelinApplicationConfigurationPropertyValidator)(properties.zeppelinApplicationConfiguration));
    return errors.wrap('supplied properties not correct for "ApplicationConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ApplicationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ApplicationConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ApplicationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationApplicationConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_ApplicationConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ApplicationCodeConfiguration: cfnApplicationApplicationCodeConfigurationPropertyToCloudFormation(properties.applicationCodeConfiguration),
        ApplicationSnapshotConfiguration: cfnApplicationApplicationSnapshotConfigurationPropertyToCloudFormation(properties.applicationSnapshotConfiguration),
        EnvironmentProperties: cfnApplicationEnvironmentPropertiesPropertyToCloudFormation(properties.environmentProperties),
        FlinkApplicationConfiguration: cfnApplicationFlinkApplicationConfigurationPropertyToCloudFormation(properties.flinkApplicationConfiguration),
        SqlApplicationConfiguration: cfnApplicationSqlApplicationConfigurationPropertyToCloudFormation(properties.sqlApplicationConfiguration),
        VpcConfigurations: cdk.listMapper(cfnApplicationVpcConfigurationPropertyToCloudFormation)(properties.vpcConfigurations),
        ZeppelinApplicationConfiguration: cfnApplicationZeppelinApplicationConfigurationPropertyToCloudFormation(properties.zeppelinApplicationConfiguration),
    };
}

// @ts-ignore TS6133
function CfnApplicationApplicationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ApplicationConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ApplicationConfigurationProperty>();
    ret.addPropertyResult('applicationCodeConfiguration', 'ApplicationCodeConfiguration', properties.ApplicationCodeConfiguration != null ? CfnApplicationApplicationCodeConfigurationPropertyFromCloudFormation(properties.ApplicationCodeConfiguration) : undefined);
    ret.addPropertyResult('applicationSnapshotConfiguration', 'ApplicationSnapshotConfiguration', properties.ApplicationSnapshotConfiguration != null ? CfnApplicationApplicationSnapshotConfigurationPropertyFromCloudFormation(properties.ApplicationSnapshotConfiguration) : undefined);
    ret.addPropertyResult('environmentProperties', 'EnvironmentProperties', properties.EnvironmentProperties != null ? CfnApplicationEnvironmentPropertiesPropertyFromCloudFormation(properties.EnvironmentProperties) : undefined);
    ret.addPropertyResult('flinkApplicationConfiguration', 'FlinkApplicationConfiguration', properties.FlinkApplicationConfiguration != null ? CfnApplicationFlinkApplicationConfigurationPropertyFromCloudFormation(properties.FlinkApplicationConfiguration) : undefined);
    ret.addPropertyResult('sqlApplicationConfiguration', 'SqlApplicationConfiguration', properties.SqlApplicationConfiguration != null ? CfnApplicationSqlApplicationConfigurationPropertyFromCloudFormation(properties.SqlApplicationConfiguration) : undefined);
    ret.addPropertyResult('vpcConfigurations', 'VpcConfigurations', properties.VpcConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationVpcConfigurationPropertyFromCloudFormation)(properties.VpcConfigurations) : undefined);
    ret.addPropertyResult('zeppelinApplicationConfiguration', 'ZeppelinApplicationConfiguration', properties.ZeppelinApplicationConfiguration != null ? CfnApplicationZeppelinApplicationConfigurationPropertyFromCloudFormation(properties.ZeppelinApplicationConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Specifies the maintence window parameters for a Kinesis Data Analytics application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationmaintenanceconfiguration.html
     */
    export interface ApplicationMaintenanceConfigurationProperty {
        /**
         * Specifies the start time of the maintence window.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationmaintenanceconfiguration.html#cfn-kinesisanalyticsv2-application-applicationmaintenanceconfiguration-applicationmaintenancewindowstarttime
         */
        readonly applicationMaintenanceWindowStartTime: string;
    }
}

/**
 * Determine whether the given properties match those of a `ApplicationMaintenanceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationMaintenanceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ApplicationMaintenanceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationMaintenanceWindowStartTime', cdk.requiredValidator)(properties.applicationMaintenanceWindowStartTime));
    errors.collect(cdk.propertyValidator('applicationMaintenanceWindowStartTime', cdk.validateString)(properties.applicationMaintenanceWindowStartTime));
    return errors.wrap('supplied properties not correct for "ApplicationMaintenanceConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ApplicationMaintenanceConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ApplicationMaintenanceConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ApplicationMaintenanceConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationApplicationMaintenanceConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_ApplicationMaintenanceConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ApplicationMaintenanceWindowStartTime: cdk.stringToCloudFormation(properties.applicationMaintenanceWindowStartTime),
    };
}

// @ts-ignore TS6133
function CfnApplicationApplicationMaintenanceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ApplicationMaintenanceConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ApplicationMaintenanceConfigurationProperty>();
    ret.addPropertyResult('applicationMaintenanceWindowStartTime', 'ApplicationMaintenanceWindowStartTime', cfn_parse.FromCloudFormation.getString(properties.ApplicationMaintenanceWindowStartTime));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Specifies the method and snapshot to use when restarting an application using previously saved application state.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationrestoreconfiguration.html
     */
    export interface ApplicationRestoreConfigurationProperty {
        /**
         * Specifies how the application should be restored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationrestoreconfiguration.html#cfn-kinesisanalyticsv2-application-applicationrestoreconfiguration-applicationrestoretype
         */
        readonly applicationRestoreType: string;
        /**
         * The identifier of an existing snapshot of application state to use to restart an application. The application uses this value if `RESTORE_FROM_CUSTOM_SNAPSHOT` is specified for the `ApplicationRestoreType` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationrestoreconfiguration.html#cfn-kinesisanalyticsv2-application-applicationrestoreconfiguration-snapshotname
         */
        readonly snapshotName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ApplicationRestoreConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationRestoreConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ApplicationRestoreConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationRestoreType', cdk.requiredValidator)(properties.applicationRestoreType));
    errors.collect(cdk.propertyValidator('applicationRestoreType', cdk.validateString)(properties.applicationRestoreType));
    errors.collect(cdk.propertyValidator('snapshotName', cdk.validateString)(properties.snapshotName));
    return errors.wrap('supplied properties not correct for "ApplicationRestoreConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ApplicationRestoreConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ApplicationRestoreConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ApplicationRestoreConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationApplicationRestoreConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_ApplicationRestoreConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ApplicationRestoreType: cdk.stringToCloudFormation(properties.applicationRestoreType),
        SnapshotName: cdk.stringToCloudFormation(properties.snapshotName),
    };
}

// @ts-ignore TS6133
function CfnApplicationApplicationRestoreConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ApplicationRestoreConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ApplicationRestoreConfigurationProperty>();
    ret.addPropertyResult('applicationRestoreType', 'ApplicationRestoreType', cfn_parse.FromCloudFormation.getString(properties.ApplicationRestoreType));
    ret.addPropertyResult('snapshotName', 'SnapshotName', properties.SnapshotName != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Describes whether snapshots are enabled for a Flink-based Kinesis Data Analytics application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationsnapshotconfiguration.html
     */
    export interface ApplicationSnapshotConfigurationProperty {
        /**
         * Describes whether snapshots are enabled for a Flink-based Kinesis Data Analytics application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-applicationsnapshotconfiguration.html#cfn-kinesisanalyticsv2-application-applicationsnapshotconfiguration-snapshotsenabled
         */
        readonly snapshotsEnabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ApplicationSnapshotConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationSnapshotConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ApplicationSnapshotConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('snapshotsEnabled', cdk.requiredValidator)(properties.snapshotsEnabled));
    errors.collect(cdk.propertyValidator('snapshotsEnabled', cdk.validateBoolean)(properties.snapshotsEnabled));
    return errors.wrap('supplied properties not correct for "ApplicationSnapshotConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ApplicationSnapshotConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ApplicationSnapshotConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ApplicationSnapshotConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationApplicationSnapshotConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_ApplicationSnapshotConfigurationPropertyValidator(properties).assertSuccess();
    return {
        SnapshotsEnabled: cdk.booleanToCloudFormation(properties.snapshotsEnabled),
    };
}

// @ts-ignore TS6133
function CfnApplicationApplicationSnapshotConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ApplicationSnapshotConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ApplicationSnapshotConfigurationProperty>();
    ret.addPropertyResult('snapshotsEnabled', 'SnapshotsEnabled', cfn_parse.FromCloudFormation.getBoolean(properties.SnapshotsEnabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * For a SQL-based Kinesis Data Analytics application, provides additional mapping information when the record format uses delimiters, such as CSV. For example, the following sample records use CSV format, where the records use the *'\n'* as the row delimiter and a comma (",") as the column delimiter:
     *
     * `"name1", "address1"`
     *
     * `"name2", "address2"`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-csvmappingparameters.html
     */
    export interface CSVMappingParametersProperty {
        /**
         * The column delimiter. For example, in a CSV format, a comma (",") is the typical column delimiter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-csvmappingparameters.html#cfn-kinesisanalyticsv2-application-csvmappingparameters-recordcolumndelimiter
         */
        readonly recordColumnDelimiter: string;
        /**
         * The row delimiter. For example, in a CSV format, *'\n'* is the typical row delimiter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-csvmappingparameters.html#cfn-kinesisanalyticsv2-application-csvmappingparameters-recordrowdelimiter
         */
        readonly recordRowDelimiter: string;
    }
}

/**
 * Determine whether the given properties match those of a `CSVMappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `CSVMappingParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_CSVMappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('recordColumnDelimiter', cdk.requiredValidator)(properties.recordColumnDelimiter));
    errors.collect(cdk.propertyValidator('recordColumnDelimiter', cdk.validateString)(properties.recordColumnDelimiter));
    errors.collect(cdk.propertyValidator('recordRowDelimiter', cdk.requiredValidator)(properties.recordRowDelimiter));
    errors.collect(cdk.propertyValidator('recordRowDelimiter', cdk.validateString)(properties.recordRowDelimiter));
    return errors.wrap('supplied properties not correct for "CSVMappingParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.CSVMappingParameters` resource
 *
 * @param properties - the TypeScript properties of a `CSVMappingParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.CSVMappingParameters` resource.
 */
// @ts-ignore TS6133
function cfnApplicationCSVMappingParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_CSVMappingParametersPropertyValidator(properties).assertSuccess();
    return {
        RecordColumnDelimiter: cdk.stringToCloudFormation(properties.recordColumnDelimiter),
        RecordRowDelimiter: cdk.stringToCloudFormation(properties.recordRowDelimiter),
    };
}

// @ts-ignore TS6133
function CfnApplicationCSVMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.CSVMappingParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.CSVMappingParametersProperty>();
    ret.addPropertyResult('recordColumnDelimiter', 'RecordColumnDelimiter', cfn_parse.FromCloudFormation.getString(properties.RecordColumnDelimiter));
    ret.addPropertyResult('recordRowDelimiter', 'RecordRowDelimiter', cfn_parse.FromCloudFormation.getString(properties.RecordRowDelimiter));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The configuration parameters for the default Amazon Glue database. You use this database for SQL queries that you write in a Kinesis Data Analytics Studio notebook.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-catalogconfiguration.html
     */
    export interface CatalogConfigurationProperty {
        /**
         * The configuration parameters for the default Amazon Glue database. You use this database for Apache Flink SQL queries and table API transforms that you write in a Kinesis Data Analytics Studio notebook.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-catalogconfiguration.html#cfn-kinesisanalyticsv2-application-catalogconfiguration-gluedatacatalogconfiguration
         */
        readonly glueDataCatalogConfiguration?: CfnApplication.GlueDataCatalogConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CatalogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CatalogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_CatalogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('glueDataCatalogConfiguration', CfnApplication_GlueDataCatalogConfigurationPropertyValidator)(properties.glueDataCatalogConfiguration));
    return errors.wrap('supplied properties not correct for "CatalogConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.CatalogConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CatalogConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.CatalogConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationCatalogConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_CatalogConfigurationPropertyValidator(properties).assertSuccess();
    return {
        GlueDataCatalogConfiguration: cfnApplicationGlueDataCatalogConfigurationPropertyToCloudFormation(properties.glueDataCatalogConfiguration),
    };
}

// @ts-ignore TS6133
function CfnApplicationCatalogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.CatalogConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.CatalogConfigurationProperty>();
    ret.addPropertyResult('glueDataCatalogConfiguration', 'GlueDataCatalogConfiguration', properties.GlueDataCatalogConfiguration != null ? CfnApplicationGlueDataCatalogConfigurationPropertyFromCloudFormation(properties.GlueDataCatalogConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Describes an application's checkpointing configuration. Checkpointing is the process of persisting application state for fault tolerance. For more information, see [Checkpoints for Fault Tolerance](https://docs.aws.amazon.com/https://ci.apache.org/projects/flink/flink-docs-release-1.8/concepts/programming-model.html#checkpoints-for-fault-tolerance) in the [Apache Flink Documentation](https://docs.aws.amazon.com/https://ci.apache.org/projects/flink/flink-docs-release-1.8/) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-checkpointconfiguration.html
     */
    export interface CheckpointConfigurationProperty {
        /**
         * Describes the interval in milliseconds between checkpoint operations.
         *
         * > If `CheckpointConfiguration.ConfigurationType` is `DEFAULT` , the application will use a `CheckpointInterval` value of 60000, even if this value is set to another value using this API or in application code.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-checkpointconfiguration.html#cfn-kinesisanalyticsv2-application-checkpointconfiguration-checkpointinterval
         */
        readonly checkpointInterval?: number;
        /**
         * Describes whether checkpointing is enabled for a Flink-based Kinesis Data Analytics application.
         *
         * > If `CheckpointConfiguration.ConfigurationType` is `DEFAULT` , the application will use a `CheckpointingEnabled` value of `true` , even if this value is set to another value using this API or in application code.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-checkpointconfiguration.html#cfn-kinesisanalyticsv2-application-checkpointconfiguration-checkpointingenabled
         */
        readonly checkpointingEnabled?: boolean | cdk.IResolvable;
        /**
         * Describes whether the application uses Kinesis Data Analytics' default checkpointing behavior. You must set this property to `CUSTOM` in order to set the `CheckpointingEnabled` , `CheckpointInterval` , or `MinPauseBetweenCheckpoints` parameters.
         *
         * > If this value is set to `DEFAULT` , the application will use the following values, even if they are set to other values using APIs or application code:
         * >
         * > - *CheckpointingEnabled:* true
         * > - *CheckpointInterval:* 60000
         * > - *MinPauseBetweenCheckpoints:* 5000
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-checkpointconfiguration.html#cfn-kinesisanalyticsv2-application-checkpointconfiguration-configurationtype
         */
        readonly configurationType: string;
        /**
         * Describes the minimum time in milliseconds after a checkpoint operation completes that a new checkpoint operation can start. If a checkpoint operation takes longer than the `CheckpointInterval` , the application otherwise performs continual checkpoint operations. For more information, see [Tuning Checkpointing](https://docs.aws.amazon.com/https://ci.apache.org/projects/flink/flink-docs-release-1.8/ops/state/large_state_tuning.html#tuning-checkpointing) in the [Apache Flink Documentation](https://docs.aws.amazon.com/https://ci.apache.org/projects/flink/flink-docs-release-1.8/) .
         *
         * > If `CheckpointConfiguration.ConfigurationType` is `DEFAULT` , the application will use a `MinPauseBetweenCheckpoints` value of 5000, even if this value is set using this API or in application code.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-checkpointconfiguration.html#cfn-kinesisanalyticsv2-application-checkpointconfiguration-minpausebetweencheckpoints
         */
        readonly minPauseBetweenCheckpoints?: number;
    }
}

/**
 * Determine whether the given properties match those of a `CheckpointConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CheckpointConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_CheckpointConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('checkpointInterval', cdk.validateNumber)(properties.checkpointInterval));
    errors.collect(cdk.propertyValidator('checkpointingEnabled', cdk.validateBoolean)(properties.checkpointingEnabled));
    errors.collect(cdk.propertyValidator('configurationType', cdk.requiredValidator)(properties.configurationType));
    errors.collect(cdk.propertyValidator('configurationType', cdk.validateString)(properties.configurationType));
    errors.collect(cdk.propertyValidator('minPauseBetweenCheckpoints', cdk.validateNumber)(properties.minPauseBetweenCheckpoints));
    return errors.wrap('supplied properties not correct for "CheckpointConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.CheckpointConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CheckpointConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.CheckpointConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationCheckpointConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_CheckpointConfigurationPropertyValidator(properties).assertSuccess();
    return {
        CheckpointInterval: cdk.numberToCloudFormation(properties.checkpointInterval),
        CheckpointingEnabled: cdk.booleanToCloudFormation(properties.checkpointingEnabled),
        ConfigurationType: cdk.stringToCloudFormation(properties.configurationType),
        MinPauseBetweenCheckpoints: cdk.numberToCloudFormation(properties.minPauseBetweenCheckpoints),
    };
}

// @ts-ignore TS6133
function CfnApplicationCheckpointConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.CheckpointConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.CheckpointConfigurationProperty>();
    ret.addPropertyResult('checkpointInterval', 'CheckpointInterval', properties.CheckpointInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.CheckpointInterval) : undefined);
    ret.addPropertyResult('checkpointingEnabled', 'CheckpointingEnabled', properties.CheckpointingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CheckpointingEnabled) : undefined);
    ret.addPropertyResult('configurationType', 'ConfigurationType', cfn_parse.FromCloudFormation.getString(properties.ConfigurationType));
    ret.addPropertyResult('minPauseBetweenCheckpoints', 'MinPauseBetweenCheckpoints', properties.MinPauseBetweenCheckpoints != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinPauseBetweenCheckpoints) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Specifies either the application code, or the location of the application code, for a Flink-based Kinesis Data Analytics application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-codecontent.html
     */
    export interface CodeContentProperty {
        /**
         * Information about the Amazon S3 bucket that contains the application code.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-codecontent.html#cfn-kinesisanalyticsv2-application-codecontent-s3contentlocation
         */
        readonly s3ContentLocation?: CfnApplication.S3ContentLocationProperty | cdk.IResolvable;
        /**
         * The text-format code for a Flink-based Kinesis Data Analytics application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-codecontent.html#cfn-kinesisanalyticsv2-application-codecontent-textcontent
         */
        readonly textContent?: string;
        /**
         * The zip-format code for a Flink-based Kinesis Data Analytics application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-codecontent.html#cfn-kinesisanalyticsv2-application-codecontent-zipfilecontent
         */
        readonly zipFileContent?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CodeContentProperty`
 *
 * @param properties - the TypeScript properties of a `CodeContentProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_CodeContentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3ContentLocation', CfnApplication_S3ContentLocationPropertyValidator)(properties.s3ContentLocation));
    errors.collect(cdk.propertyValidator('textContent', cdk.validateString)(properties.textContent));
    errors.collect(cdk.propertyValidator('zipFileContent', cdk.validateString)(properties.zipFileContent));
    return errors.wrap('supplied properties not correct for "CodeContentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.CodeContent` resource
 *
 * @param properties - the TypeScript properties of a `CodeContentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.CodeContent` resource.
 */
// @ts-ignore TS6133
function cfnApplicationCodeContentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_CodeContentPropertyValidator(properties).assertSuccess();
    return {
        S3ContentLocation: cfnApplicationS3ContentLocationPropertyToCloudFormation(properties.s3ContentLocation),
        TextContent: cdk.stringToCloudFormation(properties.textContent),
        ZipFileContent: cdk.stringToCloudFormation(properties.zipFileContent),
    };
}

// @ts-ignore TS6133
function CfnApplicationCodeContentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.CodeContentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.CodeContentProperty>();
    ret.addPropertyResult('s3ContentLocation', 'S3ContentLocation', properties.S3ContentLocation != null ? CfnApplicationS3ContentLocationPropertyFromCloudFormation(properties.S3ContentLocation) : undefined);
    ret.addPropertyResult('textContent', 'TextContent', properties.TextContent != null ? cfn_parse.FromCloudFormation.getString(properties.TextContent) : undefined);
    ret.addPropertyResult('zipFileContent', 'ZipFileContent', properties.ZipFileContent != null ? cfn_parse.FromCloudFormation.getString(properties.ZipFileContent) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The configuration of connectors and user-defined functions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-customartifactconfiguration.html
     */
    export interface CustomArtifactConfigurationProperty {
        /**
         * Set this to either `UDF` or `DEPENDENCY_JAR` . `UDF` stands for user-defined functions. This type of artifact must be in an S3 bucket. A `DEPENDENCY_JAR` can be in either Maven or an S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-customartifactconfiguration.html#cfn-kinesisanalyticsv2-application-customartifactconfiguration-artifacttype
         */
        readonly artifactType: string;
        /**
         * The parameters required to fully specify a Maven reference.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-customartifactconfiguration.html#cfn-kinesisanalyticsv2-application-customartifactconfiguration-mavenreference
         */
        readonly mavenReference?: CfnApplication.MavenReferenceProperty | cdk.IResolvable;
        /**
         * The location of the custom artifacts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-customartifactconfiguration.html#cfn-kinesisanalyticsv2-application-customartifactconfiguration-s3contentlocation
         */
        readonly s3ContentLocation?: CfnApplication.S3ContentLocationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CustomArtifactConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CustomArtifactConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_CustomArtifactConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('artifactType', cdk.requiredValidator)(properties.artifactType));
    errors.collect(cdk.propertyValidator('artifactType', cdk.validateString)(properties.artifactType));
    errors.collect(cdk.propertyValidator('mavenReference', CfnApplication_MavenReferencePropertyValidator)(properties.mavenReference));
    errors.collect(cdk.propertyValidator('s3ContentLocation', CfnApplication_S3ContentLocationPropertyValidator)(properties.s3ContentLocation));
    return errors.wrap('supplied properties not correct for "CustomArtifactConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.CustomArtifactConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CustomArtifactConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.CustomArtifactConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationCustomArtifactConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_CustomArtifactConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ArtifactType: cdk.stringToCloudFormation(properties.artifactType),
        MavenReference: cfnApplicationMavenReferencePropertyToCloudFormation(properties.mavenReference),
        S3ContentLocation: cfnApplicationS3ContentLocationPropertyToCloudFormation(properties.s3ContentLocation),
    };
}

// @ts-ignore TS6133
function CfnApplicationCustomArtifactConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.CustomArtifactConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.CustomArtifactConfigurationProperty>();
    ret.addPropertyResult('artifactType', 'ArtifactType', cfn_parse.FromCloudFormation.getString(properties.ArtifactType));
    ret.addPropertyResult('mavenReference', 'MavenReference', properties.MavenReference != null ? CfnApplicationMavenReferencePropertyFromCloudFormation(properties.MavenReference) : undefined);
    ret.addPropertyResult('s3ContentLocation', 'S3ContentLocation', properties.S3ContentLocation != null ? CfnApplicationS3ContentLocationPropertyFromCloudFormation(properties.S3ContentLocation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The information required to deploy a Kinesis Data Analytics Studio notebook as an application with durable state.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-deployasapplicationconfiguration.html
     */
    export interface DeployAsApplicationConfigurationProperty {
        /**
         * The description of an Amazon S3 object that contains the Amazon Data Analytics application, including the Amazon Resource Name (ARN) of the S3 bucket, the name of the Amazon S3 object that contains the data, and the version number of the Amazon S3 object that contains the data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-deployasapplicationconfiguration.html#cfn-kinesisanalyticsv2-application-deployasapplicationconfiguration-s3contentlocation
         */
        readonly s3ContentLocation: CfnApplication.S3ContentBaseLocationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DeployAsApplicationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DeployAsApplicationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_DeployAsApplicationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3ContentLocation', cdk.requiredValidator)(properties.s3ContentLocation));
    errors.collect(cdk.propertyValidator('s3ContentLocation', CfnApplication_S3ContentBaseLocationPropertyValidator)(properties.s3ContentLocation));
    return errors.wrap('supplied properties not correct for "DeployAsApplicationConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.DeployAsApplicationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `DeployAsApplicationConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.DeployAsApplicationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationDeployAsApplicationConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_DeployAsApplicationConfigurationPropertyValidator(properties).assertSuccess();
    return {
        S3ContentLocation: cfnApplicationS3ContentBaseLocationPropertyToCloudFormation(properties.s3ContentLocation),
    };
}

// @ts-ignore TS6133
function CfnApplicationDeployAsApplicationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.DeployAsApplicationConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.DeployAsApplicationConfigurationProperty>();
    ret.addPropertyResult('s3ContentLocation', 'S3ContentLocation', CfnApplicationS3ContentBaseLocationPropertyFromCloudFormation(properties.S3ContentLocation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Describes execution properties for a Flink-based Kinesis Data Analytics application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-environmentproperties.html
     */
    export interface EnvironmentPropertiesProperty {
        /**
         * Describes the execution property groups.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-environmentproperties.html#cfn-kinesisanalyticsv2-application-environmentproperties-propertygroups
         */
        readonly propertyGroups?: Array<CfnApplication.PropertyGroupProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EnvironmentPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `EnvironmentPropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_EnvironmentPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('propertyGroups', cdk.listValidator(CfnApplication_PropertyGroupPropertyValidator))(properties.propertyGroups));
    return errors.wrap('supplied properties not correct for "EnvironmentPropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.EnvironmentProperties` resource
 *
 * @param properties - the TypeScript properties of a `EnvironmentPropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.EnvironmentProperties` resource.
 */
// @ts-ignore TS6133
function cfnApplicationEnvironmentPropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_EnvironmentPropertiesPropertyValidator(properties).assertSuccess();
    return {
        PropertyGroups: cdk.listMapper(cfnApplicationPropertyGroupPropertyToCloudFormation)(properties.propertyGroups),
    };
}

// @ts-ignore TS6133
function CfnApplicationEnvironmentPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.EnvironmentPropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.EnvironmentPropertiesProperty>();
    ret.addPropertyResult('propertyGroups', 'PropertyGroups', properties.PropertyGroups != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationPropertyGroupPropertyFromCloudFormation)(properties.PropertyGroups) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Describes configuration parameters for a Flink-based Kinesis Data Analytics application or a Studio notebook.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-flinkapplicationconfiguration.html
     */
    export interface FlinkApplicationConfigurationProperty {
        /**
         * Describes an application's checkpointing configuration. Checkpointing is the process of persisting application state for fault tolerance. For more information, see [Checkpoints for Fault Tolerance](https://docs.aws.amazon.com/https://ci.apache.org/projects/flink/flink-docs-release-1.8/concepts/programming-model.html#checkpoints-for-fault-tolerance) in the [Apache Flink Documentation](https://docs.aws.amazon.com/https://ci.apache.org/projects/flink/flink-docs-release-1.8/) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-flinkapplicationconfiguration.html#cfn-kinesisanalyticsv2-application-flinkapplicationconfiguration-checkpointconfiguration
         */
        readonly checkpointConfiguration?: CfnApplication.CheckpointConfigurationProperty | cdk.IResolvable;
        /**
         * Describes configuration parameters for Amazon CloudWatch logging for an application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-flinkapplicationconfiguration.html#cfn-kinesisanalyticsv2-application-flinkapplicationconfiguration-monitoringconfiguration
         */
        readonly monitoringConfiguration?: CfnApplication.MonitoringConfigurationProperty | cdk.IResolvable;
        /**
         * Describes parameters for how an application executes multiple tasks simultaneously.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-flinkapplicationconfiguration.html#cfn-kinesisanalyticsv2-application-flinkapplicationconfiguration-parallelismconfiguration
         */
        readonly parallelismConfiguration?: CfnApplication.ParallelismConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FlinkApplicationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FlinkApplicationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_FlinkApplicationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('checkpointConfiguration', CfnApplication_CheckpointConfigurationPropertyValidator)(properties.checkpointConfiguration));
    errors.collect(cdk.propertyValidator('monitoringConfiguration', CfnApplication_MonitoringConfigurationPropertyValidator)(properties.monitoringConfiguration));
    errors.collect(cdk.propertyValidator('parallelismConfiguration', CfnApplication_ParallelismConfigurationPropertyValidator)(properties.parallelismConfiguration));
    return errors.wrap('supplied properties not correct for "FlinkApplicationConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.FlinkApplicationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `FlinkApplicationConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.FlinkApplicationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationFlinkApplicationConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_FlinkApplicationConfigurationPropertyValidator(properties).assertSuccess();
    return {
        CheckpointConfiguration: cfnApplicationCheckpointConfigurationPropertyToCloudFormation(properties.checkpointConfiguration),
        MonitoringConfiguration: cfnApplicationMonitoringConfigurationPropertyToCloudFormation(properties.monitoringConfiguration),
        ParallelismConfiguration: cfnApplicationParallelismConfigurationPropertyToCloudFormation(properties.parallelismConfiguration),
    };
}

// @ts-ignore TS6133
function CfnApplicationFlinkApplicationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.FlinkApplicationConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.FlinkApplicationConfigurationProperty>();
    ret.addPropertyResult('checkpointConfiguration', 'CheckpointConfiguration', properties.CheckpointConfiguration != null ? CfnApplicationCheckpointConfigurationPropertyFromCloudFormation(properties.CheckpointConfiguration) : undefined);
    ret.addPropertyResult('monitoringConfiguration', 'MonitoringConfiguration', properties.MonitoringConfiguration != null ? CfnApplicationMonitoringConfigurationPropertyFromCloudFormation(properties.MonitoringConfiguration) : undefined);
    ret.addPropertyResult('parallelismConfiguration', 'ParallelismConfiguration', properties.ParallelismConfiguration != null ? CfnApplicationParallelismConfigurationPropertyFromCloudFormation(properties.ParallelismConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Describes the starting parameters for a Flink-based Kinesis Data Analytics application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-flinkrunconfiguration.html
     */
    export interface FlinkRunConfigurationProperty {
        /**
         * When restoring from a snapshot, specifies whether the runtime is allowed to skip a state that cannot be mapped to the new program. This will happen if the program is updated between snapshots to remove stateful parameters, and state data in the snapshot no longer corresponds to valid application data. For more information, see [Allowing Non-Restored State](https://docs.aws.amazon.com/https://ci.apache.org/projects/flink/flink-docs-release-1.8/ops/state/savepoints.html#allowing-non-restored-state) in the [Apache Flink documentation](https://docs.aws.amazon.com/https://ci.apache.org/projects/flink/flink-docs-release-1.8/) .
         *
         * > This value defaults to `false` . If you update your application without specifying this parameter, `AllowNonRestoredState` will be set to `false` , even if it was previously set to `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-flinkrunconfiguration.html#cfn-kinesisanalyticsv2-application-flinkrunconfiguration-allownonrestoredstate
         */
        readonly allowNonRestoredState?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FlinkRunConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FlinkRunConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_FlinkRunConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowNonRestoredState', cdk.validateBoolean)(properties.allowNonRestoredState));
    return errors.wrap('supplied properties not correct for "FlinkRunConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.FlinkRunConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `FlinkRunConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.FlinkRunConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationFlinkRunConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_FlinkRunConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AllowNonRestoredState: cdk.booleanToCloudFormation(properties.allowNonRestoredState),
    };
}

// @ts-ignore TS6133
function CfnApplicationFlinkRunConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.FlinkRunConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.FlinkRunConfigurationProperty>();
    ret.addPropertyResult('allowNonRestoredState', 'AllowNonRestoredState', properties.AllowNonRestoredState != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowNonRestoredState) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The configuration of the Glue Data Catalog that you use for Apache Flink SQL queries and table API transforms that you write in an application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-gluedatacatalogconfiguration.html
     */
    export interface GlueDataCatalogConfigurationProperty {
        /**
         * The Amazon Resource Name (ARN) of the database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-gluedatacatalogconfiguration.html#cfn-kinesisanalyticsv2-application-gluedatacatalogconfiguration-databasearn
         */
        readonly databaseArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `GlueDataCatalogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `GlueDataCatalogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_GlueDataCatalogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('databaseArn', cdk.validateString)(properties.databaseArn));
    return errors.wrap('supplied properties not correct for "GlueDataCatalogConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.GlueDataCatalogConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `GlueDataCatalogConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.GlueDataCatalogConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationGlueDataCatalogConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_GlueDataCatalogConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DatabaseARN: cdk.stringToCloudFormation(properties.databaseArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationGlueDataCatalogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.GlueDataCatalogConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.GlueDataCatalogConfigurationProperty>();
    ret.addPropertyResult('databaseArn', 'DatabaseARN', properties.DatabaseARN != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseARN) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * When you configure the application input for a SQL-based Kinesis Data Analytics application, you specify the streaming source, the in-application stream name that is created, and the mapping between the two.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-input.html
     */
    export interface InputProperty {
        /**
         * Describes the number of in-application streams to create.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-input.html#cfn-kinesisanalyticsv2-application-input-inputparallelism
         */
        readonly inputParallelism?: CfnApplication.InputParallelismProperty | cdk.IResolvable;
        /**
         * The [InputProcessingConfiguration](https://docs.aws.amazon.com/kinesisanalytics/latest/apiv2/API_InputProcessingConfiguration.html) for the input. An input processor transforms records as they are received from the stream, before the application's SQL code executes. Currently, the only input processing configuration available is [InputLambdaProcessor](https://docs.aws.amazon.com/kinesisanalytics/latest/apiv2/API_InputLambdaProcessor.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-input.html#cfn-kinesisanalyticsv2-application-input-inputprocessingconfiguration
         */
        readonly inputProcessingConfiguration?: CfnApplication.InputProcessingConfigurationProperty | cdk.IResolvable;
        /**
         * Describes the format of the data in the streaming source, and how each data element maps to corresponding columns in the in-application stream that is being created.
         *
         * Also used to describe the format of the reference data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-input.html#cfn-kinesisanalyticsv2-application-input-inputschema
         */
        readonly inputSchema: CfnApplication.InputSchemaProperty | cdk.IResolvable;
        /**
         * If the streaming source is an Amazon Kinesis Data Firehose delivery stream, identifies the delivery stream's ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-input.html#cfn-kinesisanalyticsv2-application-input-kinesisfirehoseinput
         */
        readonly kinesisFirehoseInput?: CfnApplication.KinesisFirehoseInputProperty | cdk.IResolvable;
        /**
         * If the streaming source is an Amazon Kinesis data stream, identifies the stream's Amazon Resource Name (ARN).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-input.html#cfn-kinesisanalyticsv2-application-input-kinesisstreamsinput
         */
        readonly kinesisStreamsInput?: CfnApplication.KinesisStreamsInputProperty | cdk.IResolvable;
        /**
         * The name prefix to use when creating an in-application stream. Suppose that you specify a prefix " `MyInApplicationStream` ." Kinesis Data Analytics then creates one or more (as per the `InputParallelism` count you specified) in-application streams with the names " `MyInApplicationStream_001` ," " `MyInApplicationStream_002` ," and so on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-input.html#cfn-kinesisanalyticsv2-application-input-nameprefix
         */
        readonly namePrefix: string;
    }
}

/**
 * Determine whether the given properties match those of a `InputProperty`
 *
 * @param properties - the TypeScript properties of a `InputProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_InputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('inputParallelism', CfnApplication_InputParallelismPropertyValidator)(properties.inputParallelism));
    errors.collect(cdk.propertyValidator('inputProcessingConfiguration', CfnApplication_InputProcessingConfigurationPropertyValidator)(properties.inputProcessingConfiguration));
    errors.collect(cdk.propertyValidator('inputSchema', cdk.requiredValidator)(properties.inputSchema));
    errors.collect(cdk.propertyValidator('inputSchema', CfnApplication_InputSchemaPropertyValidator)(properties.inputSchema));
    errors.collect(cdk.propertyValidator('kinesisFirehoseInput', CfnApplication_KinesisFirehoseInputPropertyValidator)(properties.kinesisFirehoseInput));
    errors.collect(cdk.propertyValidator('kinesisStreamsInput', CfnApplication_KinesisStreamsInputPropertyValidator)(properties.kinesisStreamsInput));
    errors.collect(cdk.propertyValidator('namePrefix', cdk.requiredValidator)(properties.namePrefix));
    errors.collect(cdk.propertyValidator('namePrefix', cdk.validateString)(properties.namePrefix));
    return errors.wrap('supplied properties not correct for "InputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.Input` resource
 *
 * @param properties - the TypeScript properties of a `InputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.Input` resource.
 */
// @ts-ignore TS6133
function cfnApplicationInputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_InputPropertyValidator(properties).assertSuccess();
    return {
        InputParallelism: cfnApplicationInputParallelismPropertyToCloudFormation(properties.inputParallelism),
        InputProcessingConfiguration: cfnApplicationInputProcessingConfigurationPropertyToCloudFormation(properties.inputProcessingConfiguration),
        InputSchema: cfnApplicationInputSchemaPropertyToCloudFormation(properties.inputSchema),
        KinesisFirehoseInput: cfnApplicationKinesisFirehoseInputPropertyToCloudFormation(properties.kinesisFirehoseInput),
        KinesisStreamsInput: cfnApplicationKinesisStreamsInputPropertyToCloudFormation(properties.kinesisStreamsInput),
        NamePrefix: cdk.stringToCloudFormation(properties.namePrefix),
    };
}

// @ts-ignore TS6133
function CfnApplicationInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InputProperty>();
    ret.addPropertyResult('inputParallelism', 'InputParallelism', properties.InputParallelism != null ? CfnApplicationInputParallelismPropertyFromCloudFormation(properties.InputParallelism) : undefined);
    ret.addPropertyResult('inputProcessingConfiguration', 'InputProcessingConfiguration', properties.InputProcessingConfiguration != null ? CfnApplicationInputProcessingConfigurationPropertyFromCloudFormation(properties.InputProcessingConfiguration) : undefined);
    ret.addPropertyResult('inputSchema', 'InputSchema', CfnApplicationInputSchemaPropertyFromCloudFormation(properties.InputSchema));
    ret.addPropertyResult('kinesisFirehoseInput', 'KinesisFirehoseInput', properties.KinesisFirehoseInput != null ? CfnApplicationKinesisFirehoseInputPropertyFromCloudFormation(properties.KinesisFirehoseInput) : undefined);
    ret.addPropertyResult('kinesisStreamsInput', 'KinesisStreamsInput', properties.KinesisStreamsInput != null ? CfnApplicationKinesisStreamsInputPropertyFromCloudFormation(properties.KinesisStreamsInput) : undefined);
    ret.addPropertyResult('namePrefix', 'NamePrefix', cfn_parse.FromCloudFormation.getString(properties.NamePrefix));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * An object that contains the Amazon Resource Name (ARN) of the Amazon Lambda function that is used to preprocess records in the stream in a SQL-based Kinesis Data Analytics application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-inputlambdaprocessor.html
     */
    export interface InputLambdaProcessorProperty {
        /**
         * The ARN of the Amazon Lambda function that operates on records in the stream.
         *
         * > To specify an earlier version of the Lambda function than the latest, include the Lambda function version in the Lambda function ARN. For more information about Lambda ARNs, see [Example ARNs: Amazon Lambda](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html#arn-syntax-lambda)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-inputlambdaprocessor.html#cfn-kinesisanalyticsv2-application-inputlambdaprocessor-resourcearn
         */
        readonly resourceArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `InputLambdaProcessorProperty`
 *
 * @param properties - the TypeScript properties of a `InputLambdaProcessorProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_InputLambdaProcessorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    return errors.wrap('supplied properties not correct for "InputLambdaProcessorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.InputLambdaProcessor` resource
 *
 * @param properties - the TypeScript properties of a `InputLambdaProcessorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.InputLambdaProcessor` resource.
 */
// @ts-ignore TS6133
function cfnApplicationInputLambdaProcessorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_InputLambdaProcessorPropertyValidator(properties).assertSuccess();
    return {
        ResourceARN: cdk.stringToCloudFormation(properties.resourceArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationInputLambdaProcessorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InputLambdaProcessorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InputLambdaProcessorProperty>();
    ret.addPropertyResult('resourceArn', 'ResourceARN', cfn_parse.FromCloudFormation.getString(properties.ResourceARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * For a SQL-based Kinesis Data Analytics application, describes the number of in-application streams to create for a given streaming source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-inputparallelism.html
     */
    export interface InputParallelismProperty {
        /**
         * The number of in-application streams to create.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-inputparallelism.html#cfn-kinesisanalyticsv2-application-inputparallelism-count
         */
        readonly count?: number;
    }
}

/**
 * Determine whether the given properties match those of a `InputParallelismProperty`
 *
 * @param properties - the TypeScript properties of a `InputParallelismProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_InputParallelismPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('count', cdk.validateNumber)(properties.count));
    return errors.wrap('supplied properties not correct for "InputParallelismProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.InputParallelism` resource
 *
 * @param properties - the TypeScript properties of a `InputParallelismProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.InputParallelism` resource.
 */
// @ts-ignore TS6133
function cfnApplicationInputParallelismPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_InputParallelismPropertyValidator(properties).assertSuccess();
    return {
        Count: cdk.numberToCloudFormation(properties.count),
    };
}

// @ts-ignore TS6133
function CfnApplicationInputParallelismPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InputParallelismProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InputParallelismProperty>();
    ret.addPropertyResult('count', 'Count', properties.Count != null ? cfn_parse.FromCloudFormation.getNumber(properties.Count) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * For an SQL-based Amazon Kinesis Data Analytics application, describes a processor that is used to preprocess the records in the stream before being processed by your application code. Currently, the only input processor available is [Amazon Lambda](https://docs.aws.amazon.com/lambda/) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-inputprocessingconfiguration.html
     */
    export interface InputProcessingConfigurationProperty {
        /**
         * The [InputLambdaProcessor](https://docs.aws.amazon.com/kinesisanalytics/latest/apiv2/API_InputLambdaProcessor.html) that is used to preprocess the records in the stream before being processed by your application code.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-inputprocessingconfiguration.html#cfn-kinesisanalyticsv2-application-inputprocessingconfiguration-inputlambdaprocessor
         */
        readonly inputLambdaProcessor?: CfnApplication.InputLambdaProcessorProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InputProcessingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `InputProcessingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_InputProcessingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('inputLambdaProcessor', CfnApplication_InputLambdaProcessorPropertyValidator)(properties.inputLambdaProcessor));
    return errors.wrap('supplied properties not correct for "InputProcessingConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.InputProcessingConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `InputProcessingConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.InputProcessingConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationInputProcessingConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_InputProcessingConfigurationPropertyValidator(properties).assertSuccess();
    return {
        InputLambdaProcessor: cfnApplicationInputLambdaProcessorPropertyToCloudFormation(properties.inputLambdaProcessor),
    };
}

// @ts-ignore TS6133
function CfnApplicationInputProcessingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InputProcessingConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InputProcessingConfigurationProperty>();
    ret.addPropertyResult('inputLambdaProcessor', 'InputLambdaProcessor', properties.InputLambdaProcessor != null ? CfnApplicationInputLambdaProcessorPropertyFromCloudFormation(properties.InputLambdaProcessor) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * For a SQL-based Kinesis Data Analytics application, describes the format of the data in the streaming source, and how each data element maps to corresponding columns created in the in-application stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-inputschema.html
     */
    export interface InputSchemaProperty {
        /**
         * A list of `RecordColumn` objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-inputschema.html#cfn-kinesisanalyticsv2-application-inputschema-recordcolumns
         */
        readonly recordColumns: Array<CfnApplication.RecordColumnProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies the encoding of the records in the streaming source. For example, UTF-8.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-inputschema.html#cfn-kinesisanalyticsv2-application-inputschema-recordencoding
         */
        readonly recordEncoding?: string;
        /**
         * Specifies the format of the records on the streaming source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-inputschema.html#cfn-kinesisanalyticsv2-application-inputschema-recordformat
         */
        readonly recordFormat: CfnApplication.RecordFormatProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InputSchemaProperty`
 *
 * @param properties - the TypeScript properties of a `InputSchemaProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_InputSchemaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('recordColumns', cdk.requiredValidator)(properties.recordColumns));
    errors.collect(cdk.propertyValidator('recordColumns', cdk.listValidator(CfnApplication_RecordColumnPropertyValidator))(properties.recordColumns));
    errors.collect(cdk.propertyValidator('recordEncoding', cdk.validateString)(properties.recordEncoding));
    errors.collect(cdk.propertyValidator('recordFormat', cdk.requiredValidator)(properties.recordFormat));
    errors.collect(cdk.propertyValidator('recordFormat', CfnApplication_RecordFormatPropertyValidator)(properties.recordFormat));
    return errors.wrap('supplied properties not correct for "InputSchemaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.InputSchema` resource
 *
 * @param properties - the TypeScript properties of a `InputSchemaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.InputSchema` resource.
 */
// @ts-ignore TS6133
function cfnApplicationInputSchemaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_InputSchemaPropertyValidator(properties).assertSuccess();
    return {
        RecordColumns: cdk.listMapper(cfnApplicationRecordColumnPropertyToCloudFormation)(properties.recordColumns),
        RecordEncoding: cdk.stringToCloudFormation(properties.recordEncoding),
        RecordFormat: cfnApplicationRecordFormatPropertyToCloudFormation(properties.recordFormat),
    };
}

// @ts-ignore TS6133
function CfnApplicationInputSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InputSchemaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InputSchemaProperty>();
    ret.addPropertyResult('recordColumns', 'RecordColumns', cfn_parse.FromCloudFormation.getArray(CfnApplicationRecordColumnPropertyFromCloudFormation)(properties.RecordColumns));
    ret.addPropertyResult('recordEncoding', 'RecordEncoding', properties.RecordEncoding != null ? cfn_parse.FromCloudFormation.getString(properties.RecordEncoding) : undefined);
    ret.addPropertyResult('recordFormat', 'RecordFormat', CfnApplicationRecordFormatPropertyFromCloudFormation(properties.RecordFormat));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * For a SQL-based Kinesis Data Analytics application, provides additional mapping information when JSON is the record format on the streaming source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-jsonmappingparameters.html
     */
    export interface JSONMappingParametersProperty {
        /**
         * The path to the top-level parent that contains the records.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-jsonmappingparameters.html#cfn-kinesisanalyticsv2-application-jsonmappingparameters-recordrowpath
         */
        readonly recordRowPath: string;
    }
}

/**
 * Determine whether the given properties match those of a `JSONMappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `JSONMappingParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_JSONMappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('recordRowPath', cdk.requiredValidator)(properties.recordRowPath));
    errors.collect(cdk.propertyValidator('recordRowPath', cdk.validateString)(properties.recordRowPath));
    return errors.wrap('supplied properties not correct for "JSONMappingParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.JSONMappingParameters` resource
 *
 * @param properties - the TypeScript properties of a `JSONMappingParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.JSONMappingParameters` resource.
 */
// @ts-ignore TS6133
function cfnApplicationJSONMappingParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_JSONMappingParametersPropertyValidator(properties).assertSuccess();
    return {
        RecordRowPath: cdk.stringToCloudFormation(properties.recordRowPath),
    };
}

// @ts-ignore TS6133
function CfnApplicationJSONMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.JSONMappingParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.JSONMappingParametersProperty>();
    ret.addPropertyResult('recordRowPath', 'RecordRowPath', cfn_parse.FromCloudFormation.getString(properties.RecordRowPath));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * For a SQL-based Kinesis Data Analytics application, identifies a Kinesis Data Firehose delivery stream as the streaming source. You provide the delivery stream's Amazon Resource Name (ARN).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-kinesisfirehoseinput.html
     */
    export interface KinesisFirehoseInputProperty {
        /**
         * The Amazon Resource Name (ARN) of the delivery stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-kinesisfirehoseinput.html#cfn-kinesisanalyticsv2-application-kinesisfirehoseinput-resourcearn
         */
        readonly resourceArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisFirehoseInputProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseInputProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_KinesisFirehoseInputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    return errors.wrap('supplied properties not correct for "KinesisFirehoseInputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.KinesisFirehoseInput` resource
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseInputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.KinesisFirehoseInput` resource.
 */
// @ts-ignore TS6133
function cfnApplicationKinesisFirehoseInputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_KinesisFirehoseInputPropertyValidator(properties).assertSuccess();
    return {
        ResourceARN: cdk.stringToCloudFormation(properties.resourceArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationKinesisFirehoseInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.KinesisFirehoseInputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.KinesisFirehoseInputProperty>();
    ret.addPropertyResult('resourceArn', 'ResourceARN', cfn_parse.FromCloudFormation.getString(properties.ResourceARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Identifies a Kinesis data stream as the streaming source. You provide the stream's Amazon Resource Name (ARN).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-kinesisstreamsinput.html
     */
    export interface KinesisStreamsInputProperty {
        /**
         * The ARN of the input Kinesis data stream to read.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-kinesisstreamsinput.html#cfn-kinesisanalyticsv2-application-kinesisstreamsinput-resourcearn
         */
        readonly resourceArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisStreamsInputProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisStreamsInputProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_KinesisStreamsInputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    return errors.wrap('supplied properties not correct for "KinesisStreamsInputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.KinesisStreamsInput` resource
 *
 * @param properties - the TypeScript properties of a `KinesisStreamsInputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.KinesisStreamsInput` resource.
 */
// @ts-ignore TS6133
function cfnApplicationKinesisStreamsInputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_KinesisStreamsInputPropertyValidator(properties).assertSuccess();
    return {
        ResourceARN: cdk.stringToCloudFormation(properties.resourceArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationKinesisStreamsInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.KinesisStreamsInputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.KinesisStreamsInputProperty>();
    ret.addPropertyResult('resourceArn', 'ResourceARN', cfn_parse.FromCloudFormation.getString(properties.ResourceARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * When you configure a SQL-based Kinesis Data Analytics application's input at the time of creating or updating an application, provides additional mapping information specific to the record format (such as JSON, CSV, or record fields delimited by some delimiter) on the streaming source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-mappingparameters.html
     */
    export interface MappingParametersProperty {
        /**
         * Provides additional mapping information when the record format uses delimiters (for example, CSV).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-mappingparameters.html#cfn-kinesisanalyticsv2-application-mappingparameters-csvmappingparameters
         */
        readonly csvMappingParameters?: CfnApplication.CSVMappingParametersProperty | cdk.IResolvable;
        /**
         * Provides additional mapping information when JSON is the record format on the streaming source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-mappingparameters.html#cfn-kinesisanalyticsv2-application-mappingparameters-jsonmappingparameters
         */
        readonly jsonMappingParameters?: CfnApplication.JSONMappingParametersProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MappingParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_MappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('csvMappingParameters', CfnApplication_CSVMappingParametersPropertyValidator)(properties.csvMappingParameters));
    errors.collect(cdk.propertyValidator('jsonMappingParameters', CfnApplication_JSONMappingParametersPropertyValidator)(properties.jsonMappingParameters));
    return errors.wrap('supplied properties not correct for "MappingParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.MappingParameters` resource
 *
 * @param properties - the TypeScript properties of a `MappingParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.MappingParameters` resource.
 */
// @ts-ignore TS6133
function cfnApplicationMappingParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_MappingParametersPropertyValidator(properties).assertSuccess();
    return {
        CSVMappingParameters: cfnApplicationCSVMappingParametersPropertyToCloudFormation(properties.csvMappingParameters),
        JSONMappingParameters: cfnApplicationJSONMappingParametersPropertyToCloudFormation(properties.jsonMappingParameters),
    };
}

// @ts-ignore TS6133
function CfnApplicationMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.MappingParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.MappingParametersProperty>();
    ret.addPropertyResult('csvMappingParameters', 'CSVMappingParameters', properties.CSVMappingParameters != null ? CfnApplicationCSVMappingParametersPropertyFromCloudFormation(properties.CSVMappingParameters) : undefined);
    ret.addPropertyResult('jsonMappingParameters', 'JSONMappingParameters', properties.JSONMappingParameters != null ? CfnApplicationJSONMappingParametersPropertyFromCloudFormation(properties.JSONMappingParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The information required to specify a Maven reference. You can use Maven references to specify dependency JAR files.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-mavenreference.html
     */
    export interface MavenReferenceProperty {
        /**
         * The artifact ID of the Maven reference.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-mavenreference.html#cfn-kinesisanalyticsv2-application-mavenreference-artifactid
         */
        readonly artifactId: string;
        /**
         * The group ID of the Maven reference.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-mavenreference.html#cfn-kinesisanalyticsv2-application-mavenreference-groupid
         */
        readonly groupId: string;
        /**
         * The version of the Maven reference.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-mavenreference.html#cfn-kinesisanalyticsv2-application-mavenreference-version
         */
        readonly version: string;
    }
}

/**
 * Determine whether the given properties match those of a `MavenReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `MavenReferenceProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_MavenReferencePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('artifactId', cdk.requiredValidator)(properties.artifactId));
    errors.collect(cdk.propertyValidator('artifactId', cdk.validateString)(properties.artifactId));
    errors.collect(cdk.propertyValidator('groupId', cdk.requiredValidator)(properties.groupId));
    errors.collect(cdk.propertyValidator('groupId', cdk.validateString)(properties.groupId));
    errors.collect(cdk.propertyValidator('version', cdk.requiredValidator)(properties.version));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "MavenReferenceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.MavenReference` resource
 *
 * @param properties - the TypeScript properties of a `MavenReferenceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.MavenReference` resource.
 */
// @ts-ignore TS6133
function cfnApplicationMavenReferencePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_MavenReferencePropertyValidator(properties).assertSuccess();
    return {
        ArtifactId: cdk.stringToCloudFormation(properties.artifactId),
        GroupId: cdk.stringToCloudFormation(properties.groupId),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnApplicationMavenReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.MavenReferenceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.MavenReferenceProperty>();
    ret.addPropertyResult('artifactId', 'ArtifactId', cfn_parse.FromCloudFormation.getString(properties.ArtifactId));
    ret.addPropertyResult('groupId', 'GroupId', cfn_parse.FromCloudFormation.getString(properties.GroupId));
    ret.addPropertyResult('version', 'Version', cfn_parse.FromCloudFormation.getString(properties.Version));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Describes configuration parameters for Amazon CloudWatch logging for a Java-based Kinesis Data Analytics application. For more information about CloudWatch logging, see [Monitoring](https://docs.aws.amazon.com/kinesisanalytics/latest/java/monitoring-overview) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-monitoringconfiguration.html
     */
    export interface MonitoringConfigurationProperty {
        /**
         * Describes whether to use the default CloudWatch logging configuration for an application. You must set this property to `CUSTOM` in order to set the `LogLevel` or `MetricsLevel` parameters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-monitoringconfiguration.html#cfn-kinesisanalyticsv2-application-monitoringconfiguration-configurationtype
         */
        readonly configurationType: string;
        /**
         * Describes the verbosity of the CloudWatch Logs for an application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-monitoringconfiguration.html#cfn-kinesisanalyticsv2-application-monitoringconfiguration-loglevel
         */
        readonly logLevel?: string;
        /**
         * Describes the granularity of the CloudWatch Logs for an application. The `Parallelism` level is not recommended for applications with a Parallelism over 64 due to excessive costs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-monitoringconfiguration.html#cfn-kinesisanalyticsv2-application-monitoringconfiguration-metricslevel
         */
        readonly metricsLevel?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MonitoringConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MonitoringConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_MonitoringConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('configurationType', cdk.requiredValidator)(properties.configurationType));
    errors.collect(cdk.propertyValidator('configurationType', cdk.validateString)(properties.configurationType));
    errors.collect(cdk.propertyValidator('logLevel', cdk.validateString)(properties.logLevel));
    errors.collect(cdk.propertyValidator('metricsLevel', cdk.validateString)(properties.metricsLevel));
    return errors.wrap('supplied properties not correct for "MonitoringConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.MonitoringConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `MonitoringConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.MonitoringConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationMonitoringConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_MonitoringConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ConfigurationType: cdk.stringToCloudFormation(properties.configurationType),
        LogLevel: cdk.stringToCloudFormation(properties.logLevel),
        MetricsLevel: cdk.stringToCloudFormation(properties.metricsLevel),
    };
}

// @ts-ignore TS6133
function CfnApplicationMonitoringConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.MonitoringConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.MonitoringConfigurationProperty>();
    ret.addPropertyResult('configurationType', 'ConfigurationType', cfn_parse.FromCloudFormation.getString(properties.ConfigurationType));
    ret.addPropertyResult('logLevel', 'LogLevel', properties.LogLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LogLevel) : undefined);
    ret.addPropertyResult('metricsLevel', 'MetricsLevel', properties.MetricsLevel != null ? cfn_parse.FromCloudFormation.getString(properties.MetricsLevel) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Describes parameters for how a Flink-based Kinesis Data Analytics application executes multiple tasks simultaneously. For more information about parallelism, see [Parallel Execution](https://docs.aws.amazon.com/https://ci.apache.org/projects/flink/flink-docs-release-1.8/dev/parallel.html) in the [Apache Flink Documentation](https://docs.aws.amazon.com/https://ci.apache.org/projects/flink/flink-docs-release-1.8/) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-parallelismconfiguration.html
     */
    export interface ParallelismConfigurationProperty {
        /**
         * Describes whether the Kinesis Data Analytics service can increase the parallelism of the application in response to increased throughput.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-parallelismconfiguration.html#cfn-kinesisanalyticsv2-application-parallelismconfiguration-autoscalingenabled
         */
        readonly autoScalingEnabled?: boolean | cdk.IResolvable;
        /**
         * Describes whether the application uses the default parallelism for the Kinesis Data Analytics service. You must set this property to `CUSTOM` in order to change your application's `AutoScalingEnabled` , `Parallelism` , or `ParallelismPerKPU` properties.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-parallelismconfiguration.html#cfn-kinesisanalyticsv2-application-parallelismconfiguration-configurationtype
         */
        readonly configurationType: string;
        /**
         * Describes the initial number of parallel tasks that a Java-based Kinesis Data Analytics application can perform. The Kinesis Data Analytics service can increase this number automatically if [ParallelismConfiguration:AutoScalingEnabled](https://docs.aws.amazon.com/kinesisanalytics/latest/apiv2/API_ParallelismConfiguration.html#kinesisanalytics-Type-ParallelismConfiguration-AutoScalingEnabled.html) is set to `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-parallelismconfiguration.html#cfn-kinesisanalyticsv2-application-parallelismconfiguration-parallelism
         */
        readonly parallelism?: number;
        /**
         * Describes the number of parallel tasks that a Java-based Kinesis Data Analytics application can perform per Kinesis Processing Unit (KPU) used by the application. For more information about KPUs, see [Amazon Kinesis Data Analytics Pricing](https://docs.aws.amazon.com/kinesis/data-analytics/pricing/) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-parallelismconfiguration.html#cfn-kinesisanalyticsv2-application-parallelismconfiguration-parallelismperkpu
         */
        readonly parallelismPerKpu?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ParallelismConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ParallelismConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ParallelismConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('autoScalingEnabled', cdk.validateBoolean)(properties.autoScalingEnabled));
    errors.collect(cdk.propertyValidator('configurationType', cdk.requiredValidator)(properties.configurationType));
    errors.collect(cdk.propertyValidator('configurationType', cdk.validateString)(properties.configurationType));
    errors.collect(cdk.propertyValidator('parallelism', cdk.validateNumber)(properties.parallelism));
    errors.collect(cdk.propertyValidator('parallelismPerKpu', cdk.validateNumber)(properties.parallelismPerKpu));
    return errors.wrap('supplied properties not correct for "ParallelismConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ParallelismConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ParallelismConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ParallelismConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationParallelismConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_ParallelismConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AutoScalingEnabled: cdk.booleanToCloudFormation(properties.autoScalingEnabled),
        ConfigurationType: cdk.stringToCloudFormation(properties.configurationType),
        Parallelism: cdk.numberToCloudFormation(properties.parallelism),
        ParallelismPerKPU: cdk.numberToCloudFormation(properties.parallelismPerKpu),
    };
}

// @ts-ignore TS6133
function CfnApplicationParallelismConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ParallelismConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ParallelismConfigurationProperty>();
    ret.addPropertyResult('autoScalingEnabled', 'AutoScalingEnabled', properties.AutoScalingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoScalingEnabled) : undefined);
    ret.addPropertyResult('configurationType', 'ConfigurationType', cfn_parse.FromCloudFormation.getString(properties.ConfigurationType));
    ret.addPropertyResult('parallelism', 'Parallelism', properties.Parallelism != null ? cfn_parse.FromCloudFormation.getNumber(properties.Parallelism) : undefined);
    ret.addPropertyResult('parallelismPerKpu', 'ParallelismPerKPU', properties.ParallelismPerKPU != null ? cfn_parse.FromCloudFormation.getNumber(properties.ParallelismPerKPU) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Property key-value pairs passed into an application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-propertygroup.html
     */
    export interface PropertyGroupProperty {
        /**
         * Describes the key of an application execution property key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-propertygroup.html#cfn-kinesisanalyticsv2-application-propertygroup-propertygroupid
         */
        readonly propertyGroupId?: string;
        /**
         * Describes the value of an application execution property key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-propertygroup.html#cfn-kinesisanalyticsv2-application-propertygroup-propertymap
         */
        readonly propertyMap?: { [key: string]: (string) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PropertyGroupProperty`
 *
 * @param properties - the TypeScript properties of a `PropertyGroupProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_PropertyGroupPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('propertyGroupId', cdk.validateString)(properties.propertyGroupId));
    errors.collect(cdk.propertyValidator('propertyMap', cdk.hashValidator(cdk.validateString))(properties.propertyMap));
    return errors.wrap('supplied properties not correct for "PropertyGroupProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.PropertyGroup` resource
 *
 * @param properties - the TypeScript properties of a `PropertyGroupProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.PropertyGroup` resource.
 */
// @ts-ignore TS6133
function cfnApplicationPropertyGroupPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_PropertyGroupPropertyValidator(properties).assertSuccess();
    return {
        PropertyGroupId: cdk.stringToCloudFormation(properties.propertyGroupId),
        PropertyMap: cdk.hashMapper(cdk.stringToCloudFormation)(properties.propertyMap),
    };
}

// @ts-ignore TS6133
function CfnApplicationPropertyGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.PropertyGroupProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.PropertyGroupProperty>();
    ret.addPropertyResult('propertyGroupId', 'PropertyGroupId', properties.PropertyGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.PropertyGroupId) : undefined);
    ret.addPropertyResult('propertyMap', 'PropertyMap', properties.PropertyMap != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.PropertyMap) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * For a SQL-based Kinesis Data Analytics application, describes the mapping of each data element in the streaming source to the corresponding column in the in-application stream.
     *
     * Also used to describe the format of the reference data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-recordcolumn.html
     */
    export interface RecordColumnProperty {
        /**
         * A reference to the data element in the streaming input or the reference data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-recordcolumn.html#cfn-kinesisanalyticsv2-application-recordcolumn-mapping
         */
        readonly mapping?: string;
        /**
         * The name of the column that is created in the in-application input stream or reference table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-recordcolumn.html#cfn-kinesisanalyticsv2-application-recordcolumn-name
         */
        readonly name: string;
        /**
         * The type of column created in the in-application input stream or reference table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-recordcolumn.html#cfn-kinesisanalyticsv2-application-recordcolumn-sqltype
         */
        readonly sqlType: string;
    }
}

/**
 * Determine whether the given properties match those of a `RecordColumnProperty`
 *
 * @param properties - the TypeScript properties of a `RecordColumnProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_RecordColumnPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mapping', cdk.validateString)(properties.mapping));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('sqlType', cdk.requiredValidator)(properties.sqlType));
    errors.collect(cdk.propertyValidator('sqlType', cdk.validateString)(properties.sqlType));
    return errors.wrap('supplied properties not correct for "RecordColumnProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.RecordColumn` resource
 *
 * @param properties - the TypeScript properties of a `RecordColumnProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.RecordColumn` resource.
 */
// @ts-ignore TS6133
function cfnApplicationRecordColumnPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_RecordColumnPropertyValidator(properties).assertSuccess();
    return {
        Mapping: cdk.stringToCloudFormation(properties.mapping),
        Name: cdk.stringToCloudFormation(properties.name),
        SqlType: cdk.stringToCloudFormation(properties.sqlType),
    };
}

// @ts-ignore TS6133
function CfnApplicationRecordColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.RecordColumnProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.RecordColumnProperty>();
    ret.addPropertyResult('mapping', 'Mapping', properties.Mapping != null ? cfn_parse.FromCloudFormation.getString(properties.Mapping) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('sqlType', 'SqlType', cfn_parse.FromCloudFormation.getString(properties.SqlType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * For a SQL-based Kinesis Data Analytics application, describes the record format and relevant mapping information that should be applied to schematize the records on the stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-recordformat.html
     */
    export interface RecordFormatProperty {
        /**
         * When you configure application input at the time of creating or updating an application, provides additional mapping information specific to the record format (such as JSON, CSV, or record fields delimited by some delimiter) on the streaming source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-recordformat.html#cfn-kinesisanalyticsv2-application-recordformat-mappingparameters
         */
        readonly mappingParameters?: CfnApplication.MappingParametersProperty | cdk.IResolvable;
        /**
         * The type of record format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-recordformat.html#cfn-kinesisanalyticsv2-application-recordformat-recordformattype
         */
        readonly recordFormatType: string;
    }
}

/**
 * Determine whether the given properties match those of a `RecordFormatProperty`
 *
 * @param properties - the TypeScript properties of a `RecordFormatProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_RecordFormatPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mappingParameters', CfnApplication_MappingParametersPropertyValidator)(properties.mappingParameters));
    errors.collect(cdk.propertyValidator('recordFormatType', cdk.requiredValidator)(properties.recordFormatType));
    errors.collect(cdk.propertyValidator('recordFormatType', cdk.validateString)(properties.recordFormatType));
    return errors.wrap('supplied properties not correct for "RecordFormatProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.RecordFormat` resource
 *
 * @param properties - the TypeScript properties of a `RecordFormatProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.RecordFormat` resource.
 */
// @ts-ignore TS6133
function cfnApplicationRecordFormatPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_RecordFormatPropertyValidator(properties).assertSuccess();
    return {
        MappingParameters: cfnApplicationMappingParametersPropertyToCloudFormation(properties.mappingParameters),
        RecordFormatType: cdk.stringToCloudFormation(properties.recordFormatType),
    };
}

// @ts-ignore TS6133
function CfnApplicationRecordFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.RecordFormatProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.RecordFormatProperty>();
    ret.addPropertyResult('mappingParameters', 'MappingParameters', properties.MappingParameters != null ? CfnApplicationMappingParametersPropertyFromCloudFormation(properties.MappingParameters) : undefined);
    ret.addPropertyResult('recordFormatType', 'RecordFormatType', cfn_parse.FromCloudFormation.getString(properties.RecordFormatType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Describes the starting parameters for an Kinesis Data Analytics application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-runconfiguration.html
     */
    export interface RunConfigurationProperty {
        /**
         * Describes the restore behavior of a restarting application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-runconfiguration.html#cfn-kinesisanalyticsv2-application-runconfiguration-applicationrestoreconfiguration
         */
        readonly applicationRestoreConfiguration?: CfnApplication.ApplicationRestoreConfigurationProperty | cdk.IResolvable;
        /**
         * Describes the starting parameters for a Flink-based Kinesis Data Analytics application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-runconfiguration.html#cfn-kinesisanalyticsv2-application-runconfiguration-flinkrunconfiguration
         */
        readonly flinkRunConfiguration?: CfnApplication.FlinkRunConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RunConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `RunConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_RunConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationRestoreConfiguration', CfnApplication_ApplicationRestoreConfigurationPropertyValidator)(properties.applicationRestoreConfiguration));
    errors.collect(cdk.propertyValidator('flinkRunConfiguration', CfnApplication_FlinkRunConfigurationPropertyValidator)(properties.flinkRunConfiguration));
    return errors.wrap('supplied properties not correct for "RunConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.RunConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `RunConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.RunConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationRunConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_RunConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ApplicationRestoreConfiguration: cfnApplicationApplicationRestoreConfigurationPropertyToCloudFormation(properties.applicationRestoreConfiguration),
        FlinkRunConfiguration: cfnApplicationFlinkRunConfigurationPropertyToCloudFormation(properties.flinkRunConfiguration),
    };
}

// @ts-ignore TS6133
function CfnApplicationRunConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.RunConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.RunConfigurationProperty>();
    ret.addPropertyResult('applicationRestoreConfiguration', 'ApplicationRestoreConfiguration', properties.ApplicationRestoreConfiguration != null ? CfnApplicationApplicationRestoreConfigurationPropertyFromCloudFormation(properties.ApplicationRestoreConfiguration) : undefined);
    ret.addPropertyResult('flinkRunConfiguration', 'FlinkRunConfiguration', properties.FlinkRunConfiguration != null ? CfnApplicationFlinkRunConfigurationPropertyFromCloudFormation(properties.FlinkRunConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The base location of the Amazon Data Analytics application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-s3contentbaselocation.html
     */
    export interface S3ContentBaseLocationProperty {
        /**
         * The base path for the S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-s3contentbaselocation.html#cfn-kinesisanalyticsv2-application-s3contentbaselocation-basepath
         */
        readonly basePath?: string;
        /**
         * The Amazon Resource Name (ARN) of the S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-s3contentbaselocation.html#cfn-kinesisanalyticsv2-application-s3contentbaselocation-bucketarn
         */
        readonly bucketArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3ContentBaseLocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3ContentBaseLocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_S3ContentBaseLocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('basePath', cdk.validateString)(properties.basePath));
    errors.collect(cdk.propertyValidator('bucketArn', cdk.requiredValidator)(properties.bucketArn));
    errors.collect(cdk.propertyValidator('bucketArn', cdk.validateString)(properties.bucketArn));
    return errors.wrap('supplied properties not correct for "S3ContentBaseLocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.S3ContentBaseLocation` resource
 *
 * @param properties - the TypeScript properties of a `S3ContentBaseLocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.S3ContentBaseLocation` resource.
 */
// @ts-ignore TS6133
function cfnApplicationS3ContentBaseLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_S3ContentBaseLocationPropertyValidator(properties).assertSuccess();
    return {
        BasePath: cdk.stringToCloudFormation(properties.basePath),
        BucketARN: cdk.stringToCloudFormation(properties.bucketArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationS3ContentBaseLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.S3ContentBaseLocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.S3ContentBaseLocationProperty>();
    ret.addPropertyResult('basePath', 'BasePath', properties.BasePath != null ? cfn_parse.FromCloudFormation.getString(properties.BasePath) : undefined);
    ret.addPropertyResult('bucketArn', 'BucketARN', cfn_parse.FromCloudFormation.getString(properties.BucketARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The location of an application or a custom artifact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-s3contentlocation.html
     */
    export interface S3ContentLocationProperty {
        /**
         * The Amazon Resource Name (ARN) for the S3 bucket containing the application code.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-s3contentlocation.html#cfn-kinesisanalyticsv2-application-s3contentlocation-bucketarn
         */
        readonly bucketArn: string;
        /**
         * The file key for the object containing the application code.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-s3contentlocation.html#cfn-kinesisanalyticsv2-application-s3contentlocation-filekey
         */
        readonly fileKey: string;
        /**
         * The version of the object containing the application code.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-s3contentlocation.html#cfn-kinesisanalyticsv2-application-s3contentlocation-objectversion
         */
        readonly objectVersion?: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3ContentLocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3ContentLocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_S3ContentLocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketArn', cdk.requiredValidator)(properties.bucketArn));
    errors.collect(cdk.propertyValidator('bucketArn', cdk.validateString)(properties.bucketArn));
    errors.collect(cdk.propertyValidator('fileKey', cdk.requiredValidator)(properties.fileKey));
    errors.collect(cdk.propertyValidator('fileKey', cdk.validateString)(properties.fileKey));
    errors.collect(cdk.propertyValidator('objectVersion', cdk.validateString)(properties.objectVersion));
    return errors.wrap('supplied properties not correct for "S3ContentLocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.S3ContentLocation` resource
 *
 * @param properties - the TypeScript properties of a `S3ContentLocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.S3ContentLocation` resource.
 */
// @ts-ignore TS6133
function cfnApplicationS3ContentLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_S3ContentLocationPropertyValidator(properties).assertSuccess();
    return {
        BucketARN: cdk.stringToCloudFormation(properties.bucketArn),
        FileKey: cdk.stringToCloudFormation(properties.fileKey),
        ObjectVersion: cdk.stringToCloudFormation(properties.objectVersion),
    };
}

// @ts-ignore TS6133
function CfnApplicationS3ContentLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.S3ContentLocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.S3ContentLocationProperty>();
    ret.addPropertyResult('bucketArn', 'BucketARN', cfn_parse.FromCloudFormation.getString(properties.BucketARN));
    ret.addPropertyResult('fileKey', 'FileKey', cfn_parse.FromCloudFormation.getString(properties.FileKey));
    ret.addPropertyResult('objectVersion', 'ObjectVersion', properties.ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Describes the inputs, outputs, and reference data sources for a SQL-based Kinesis Data Analytics application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-sqlapplicationconfiguration.html
     */
    export interface SqlApplicationConfigurationProperty {
        /**
         * The array of [Input](https://docs.aws.amazon.com/kinesisanalytics/latest/apiv2/API_Input.html) objects describing the input streams used by the application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-sqlapplicationconfiguration.html#cfn-kinesisanalyticsv2-application-sqlapplicationconfiguration-inputs
         */
        readonly inputs?: Array<CfnApplication.InputProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SqlApplicationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SqlApplicationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_SqlApplicationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('inputs', cdk.listValidator(CfnApplication_InputPropertyValidator))(properties.inputs));
    return errors.wrap('supplied properties not correct for "SqlApplicationConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.SqlApplicationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SqlApplicationConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.SqlApplicationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationSqlApplicationConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_SqlApplicationConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Inputs: cdk.listMapper(cfnApplicationInputPropertyToCloudFormation)(properties.inputs),
    };
}

// @ts-ignore TS6133
function CfnApplicationSqlApplicationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.SqlApplicationConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.SqlApplicationConfigurationProperty>();
    ret.addPropertyResult('inputs', 'Inputs', properties.Inputs != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationInputPropertyFromCloudFormation)(properties.Inputs) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Describes the parameters of a VPC used by the application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-vpcconfiguration.html
     */
    export interface VpcConfigurationProperty {
        /**
         * The array of [SecurityGroup](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_SecurityGroup.html) IDs used by the VPC configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-vpcconfiguration.html#cfn-kinesisanalyticsv2-application-vpcconfiguration-securitygroupids
         */
        readonly securityGroupIds: string[];
        /**
         * The array of [Subnet](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_Subnet.html) IDs used by the VPC configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-vpcconfiguration.html#cfn-kinesisanalyticsv2-application-vpcconfiguration-subnetids
         */
        readonly subnetIds: string[];
    }
}

/**
 * Determine whether the given properties match those of a `VpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_VpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.requiredValidator)(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.requiredValidator)(properties.subnetIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    return errors.wrap('supplied properties not correct for "VpcConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.VpcConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `VpcConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.VpcConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationVpcConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_VpcConfigurationPropertyValidator(properties).assertSuccess();
    return {
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    };
}

// @ts-ignore TS6133
function CfnApplicationVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.VpcConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.VpcConfigurationProperty>();
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds));
    ret.addPropertyResult('subnetIds', 'SubnetIds', cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The configuration of a Kinesis Data Analytics Studio notebook.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-zeppelinapplicationconfiguration.html
     */
    export interface ZeppelinApplicationConfigurationProperty {
        /**
         * The Amazon Glue Data Catalog that you use in queries in a Kinesis Data Analytics Studio notebook.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-zeppelinapplicationconfiguration.html#cfn-kinesisanalyticsv2-application-zeppelinapplicationconfiguration-catalogconfiguration
         */
        readonly catalogConfiguration?: CfnApplication.CatalogConfigurationProperty | cdk.IResolvable;
        /**
         * A list of `CustomArtifactConfiguration` objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-zeppelinapplicationconfiguration.html#cfn-kinesisanalyticsv2-application-zeppelinapplicationconfiguration-customartifactsconfiguration
         */
        readonly customArtifactsConfiguration?: Array<CfnApplication.CustomArtifactConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The information required to deploy a Kinesis Data Analytics Studio notebook as an application with durable state.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-zeppelinapplicationconfiguration.html#cfn-kinesisanalyticsv2-application-zeppelinapplicationconfiguration-deployasapplicationconfiguration
         */
        readonly deployAsApplicationConfiguration?: CfnApplication.DeployAsApplicationConfigurationProperty | cdk.IResolvable;
        /**
         * The monitoring configuration of a Kinesis Data Analytics Studio notebook.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-zeppelinapplicationconfiguration.html#cfn-kinesisanalyticsv2-application-zeppelinapplicationconfiguration-monitoringconfiguration
         */
        readonly monitoringConfiguration?: CfnApplication.ZeppelinMonitoringConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ZeppelinApplicationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ZeppelinApplicationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ZeppelinApplicationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogConfiguration', CfnApplication_CatalogConfigurationPropertyValidator)(properties.catalogConfiguration));
    errors.collect(cdk.propertyValidator('customArtifactsConfiguration', cdk.listValidator(CfnApplication_CustomArtifactConfigurationPropertyValidator))(properties.customArtifactsConfiguration));
    errors.collect(cdk.propertyValidator('deployAsApplicationConfiguration', CfnApplication_DeployAsApplicationConfigurationPropertyValidator)(properties.deployAsApplicationConfiguration));
    errors.collect(cdk.propertyValidator('monitoringConfiguration', CfnApplication_ZeppelinMonitoringConfigurationPropertyValidator)(properties.monitoringConfiguration));
    return errors.wrap('supplied properties not correct for "ZeppelinApplicationConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ZeppelinApplicationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ZeppelinApplicationConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ZeppelinApplicationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationZeppelinApplicationConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_ZeppelinApplicationConfigurationPropertyValidator(properties).assertSuccess();
    return {
        CatalogConfiguration: cfnApplicationCatalogConfigurationPropertyToCloudFormation(properties.catalogConfiguration),
        CustomArtifactsConfiguration: cdk.listMapper(cfnApplicationCustomArtifactConfigurationPropertyToCloudFormation)(properties.customArtifactsConfiguration),
        DeployAsApplicationConfiguration: cfnApplicationDeployAsApplicationConfigurationPropertyToCloudFormation(properties.deployAsApplicationConfiguration),
        MonitoringConfiguration: cfnApplicationZeppelinMonitoringConfigurationPropertyToCloudFormation(properties.monitoringConfiguration),
    };
}

// @ts-ignore TS6133
function CfnApplicationZeppelinApplicationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ZeppelinApplicationConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ZeppelinApplicationConfigurationProperty>();
    ret.addPropertyResult('catalogConfiguration', 'CatalogConfiguration', properties.CatalogConfiguration != null ? CfnApplicationCatalogConfigurationPropertyFromCloudFormation(properties.CatalogConfiguration) : undefined);
    ret.addPropertyResult('customArtifactsConfiguration', 'CustomArtifactsConfiguration', properties.CustomArtifactsConfiguration != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationCustomArtifactConfigurationPropertyFromCloudFormation)(properties.CustomArtifactsConfiguration) : undefined);
    ret.addPropertyResult('deployAsApplicationConfiguration', 'DeployAsApplicationConfiguration', properties.DeployAsApplicationConfiguration != null ? CfnApplicationDeployAsApplicationConfigurationPropertyFromCloudFormation(properties.DeployAsApplicationConfiguration) : undefined);
    ret.addPropertyResult('monitoringConfiguration', 'MonitoringConfiguration', properties.MonitoringConfiguration != null ? CfnApplicationZeppelinMonitoringConfigurationPropertyFromCloudFormation(properties.MonitoringConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * Describes configuration parameters for Amazon CloudWatch logging for a Kinesis Data Analytics Studio notebook. For more information about CloudWatch logging, see [Monitoring](https://docs.aws.amazon.com/kinesisanalytics/latest/java/monitoring-overview.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-zeppelinmonitoringconfiguration.html
     */
    export interface ZeppelinMonitoringConfigurationProperty {
        /**
         * The verbosity of the CloudWatch Logs for an application. You can set it to `INFO` , `WARN` , `ERROR` , or `DEBUG` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-application-zeppelinmonitoringconfiguration.html#cfn-kinesisanalyticsv2-application-zeppelinmonitoringconfiguration-loglevel
         */
        readonly logLevel?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ZeppelinMonitoringConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ZeppelinMonitoringConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ZeppelinMonitoringConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logLevel', cdk.validateString)(properties.logLevel));
    return errors.wrap('supplied properties not correct for "ZeppelinMonitoringConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ZeppelinMonitoringConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ZeppelinMonitoringConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::Application.ZeppelinMonitoringConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationZeppelinMonitoringConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_ZeppelinMonitoringConfigurationPropertyValidator(properties).assertSuccess();
    return {
        LogLevel: cdk.stringToCloudFormation(properties.logLevel),
    };
}

// @ts-ignore TS6133
function CfnApplicationZeppelinMonitoringConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ZeppelinMonitoringConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ZeppelinMonitoringConfigurationProperty>();
    ret.addPropertyResult('logLevel', 'LogLevel', properties.LogLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LogLevel) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnApplicationCloudWatchLoggingOption`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationcloudwatchloggingoption.html
 */
export interface CfnApplicationCloudWatchLoggingOptionProps {

    /**
     * The name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationcloudwatchloggingoption.html#cfn-kinesisanalyticsv2-applicationcloudwatchloggingoption-applicationname
     */
    readonly applicationName: string;

    /**
     * Provides a description of Amazon CloudWatch logging options, including the log stream Amazon Resource Name (ARN).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationcloudwatchloggingoption.html#cfn-kinesisanalyticsv2-applicationcloudwatchloggingoption-cloudwatchloggingoption
     */
    readonly cloudWatchLoggingOption: CfnApplicationCloudWatchLoggingOption.CloudWatchLoggingOptionProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationCloudWatchLoggingOptionProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationCloudWatchLoggingOptionProps`
 *
 * @returns the result of the validation.
 */
function CfnApplicationCloudWatchLoggingOptionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationName', cdk.requiredValidator)(properties.applicationName));
    errors.collect(cdk.propertyValidator('applicationName', cdk.validateString)(properties.applicationName));
    errors.collect(cdk.propertyValidator('cloudWatchLoggingOption', cdk.requiredValidator)(properties.cloudWatchLoggingOption));
    errors.collect(cdk.propertyValidator('cloudWatchLoggingOption', CfnApplicationCloudWatchLoggingOption_CloudWatchLoggingOptionPropertyValidator)(properties.cloudWatchLoggingOption));
    return errors.wrap('supplied properties not correct for "CfnApplicationCloudWatchLoggingOptionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationCloudWatchLoggingOption` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationCloudWatchLoggingOptionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationCloudWatchLoggingOption` resource.
 */
// @ts-ignore TS6133
function cfnApplicationCloudWatchLoggingOptionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationCloudWatchLoggingOptionPropsValidator(properties).assertSuccess();
    return {
        ApplicationName: cdk.stringToCloudFormation(properties.applicationName),
        CloudWatchLoggingOption: cfnApplicationCloudWatchLoggingOptionCloudWatchLoggingOptionPropertyToCloudFormation(properties.cloudWatchLoggingOption),
    };
}

// @ts-ignore TS6133
function CfnApplicationCloudWatchLoggingOptionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationCloudWatchLoggingOptionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationCloudWatchLoggingOptionProps>();
    ret.addPropertyResult('applicationName', 'ApplicationName', cfn_parse.FromCloudFormation.getString(properties.ApplicationName));
    ret.addPropertyResult('cloudWatchLoggingOption', 'CloudWatchLoggingOption', CfnApplicationCloudWatchLoggingOptionCloudWatchLoggingOptionPropertyFromCloudFormation(properties.CloudWatchLoggingOption));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::KinesisAnalyticsV2::ApplicationCloudWatchLoggingOption`
 *
 * Adds an Amazon CloudWatch log stream to monitor application configuration errors.
 *
 * > Only one *ApplicationCloudWatchLoggingOption* resource can be attached per application.
 *
 * @cloudformationResource AWS::KinesisAnalyticsV2::ApplicationCloudWatchLoggingOption
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationcloudwatchloggingoption.html
 */
export class CfnApplicationCloudWatchLoggingOption extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::KinesisAnalyticsV2::ApplicationCloudWatchLoggingOption";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplicationCloudWatchLoggingOption {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnApplicationCloudWatchLoggingOptionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnApplicationCloudWatchLoggingOption(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationcloudwatchloggingoption.html#cfn-kinesisanalyticsv2-applicationcloudwatchloggingoption-applicationname
     */
    public applicationName: string;

    /**
     * Provides a description of Amazon CloudWatch logging options, including the log stream Amazon Resource Name (ARN).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationcloudwatchloggingoption.html#cfn-kinesisanalyticsv2-applicationcloudwatchloggingoption-cloudwatchloggingoption
     */
    public cloudWatchLoggingOption: CfnApplicationCloudWatchLoggingOption.CloudWatchLoggingOptionProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::KinesisAnalyticsV2::ApplicationCloudWatchLoggingOption`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationCloudWatchLoggingOptionProps) {
        super(scope, id, { type: CfnApplicationCloudWatchLoggingOption.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationName', this);
        cdk.requireProperty(props, 'cloudWatchLoggingOption', this);

        this.applicationName = props.applicationName;
        this.cloudWatchLoggingOption = props.cloudWatchLoggingOption;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplicationCloudWatchLoggingOption.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationName: this.applicationName,
            cloudWatchLoggingOption: this.cloudWatchLoggingOption,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationCloudWatchLoggingOptionPropsToCloudFormation(props);
    }
}

export namespace CfnApplicationCloudWatchLoggingOption {
    /**
     * Provides a description of Amazon CloudWatch logging options, including the log stream Amazon Resource Name (ARN).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationcloudwatchloggingoption-cloudwatchloggingoption.html
     */
    export interface CloudWatchLoggingOptionProperty {
        /**
         * The ARN of the CloudWatch log to receive application messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationcloudwatchloggingoption-cloudwatchloggingoption.html#cfn-kinesisanalyticsv2-applicationcloudwatchloggingoption-cloudwatchloggingoption-logstreamarn
         */
        readonly logStreamArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchLoggingOptionProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLoggingOptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationCloudWatchLoggingOption_CloudWatchLoggingOptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logStreamArn', cdk.requiredValidator)(properties.logStreamArn));
    errors.collect(cdk.propertyValidator('logStreamArn', cdk.validateString)(properties.logStreamArn));
    return errors.wrap('supplied properties not correct for "CloudWatchLoggingOptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationCloudWatchLoggingOption.CloudWatchLoggingOption` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchLoggingOptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationCloudWatchLoggingOption.CloudWatchLoggingOption` resource.
 */
// @ts-ignore TS6133
function cfnApplicationCloudWatchLoggingOptionCloudWatchLoggingOptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationCloudWatchLoggingOption_CloudWatchLoggingOptionPropertyValidator(properties).assertSuccess();
    return {
        LogStreamARN: cdk.stringToCloudFormation(properties.logStreamArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationCloudWatchLoggingOptionCloudWatchLoggingOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationCloudWatchLoggingOption.CloudWatchLoggingOptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationCloudWatchLoggingOption.CloudWatchLoggingOptionProperty>();
    ret.addPropertyResult('logStreamArn', 'LogStreamARN', cfn_parse.FromCloudFormation.getString(properties.LogStreamARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnApplicationOutput`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationoutput.html
 */
export interface CfnApplicationOutputProps {

    /**
     * The name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationoutput.html#cfn-kinesisanalyticsv2-applicationoutput-applicationname
     */
    readonly applicationName: string;

    /**
     * Describes a SQL-based Kinesis Data Analytics application's output configuration, in which you identify an in-application stream and a destination where you want the in-application stream data to be written. The destination can be a Kinesis data stream or a Kinesis Data Firehose delivery stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationoutput.html#cfn-kinesisanalyticsv2-applicationoutput-output
     */
    readonly output: CfnApplicationOutput.OutputProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationOutputProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationOutputProps`
 *
 * @returns the result of the validation.
 */
function CfnApplicationOutputPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationName', cdk.requiredValidator)(properties.applicationName));
    errors.collect(cdk.propertyValidator('applicationName', cdk.validateString)(properties.applicationName));
    errors.collect(cdk.propertyValidator('output', cdk.requiredValidator)(properties.output));
    errors.collect(cdk.propertyValidator('output', CfnApplicationOutput_OutputPropertyValidator)(properties.output));
    return errors.wrap('supplied properties not correct for "CfnApplicationOutputProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationOutput` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationOutputProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationOutput` resource.
 */
// @ts-ignore TS6133
function cfnApplicationOutputPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationOutputPropsValidator(properties).assertSuccess();
    return {
        ApplicationName: cdk.stringToCloudFormation(properties.applicationName),
        Output: cfnApplicationOutputOutputPropertyToCloudFormation(properties.output),
    };
}

// @ts-ignore TS6133
function CfnApplicationOutputPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationOutputProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutputProps>();
    ret.addPropertyResult('applicationName', 'ApplicationName', cfn_parse.FromCloudFormation.getString(properties.ApplicationName));
    ret.addPropertyResult('output', 'Output', CfnApplicationOutputOutputPropertyFromCloudFormation(properties.Output));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::KinesisAnalyticsV2::ApplicationOutput`
 *
 * Adds an external destination to your SQL-based Amazon Kinesis Data Analytics application.
 *
 * If you want Kinesis Data Analytics to deliver data from an in-application stream within your application to an external destination (such as an Kinesis data stream, a Kinesis Data Firehose delivery stream, or an Amazon Lambda function), you add the relevant configuration to your application using this operation. You can configure one or more outputs for your application. Each output configuration maps an in-application stream and an external destination.
 *
 * You can use one of the output configurations to deliver data from your in-application error stream to an external destination so that you can analyze the errors.
 *
 * Any configuration update, including adding a streaming source using this operation, results in a new version of the application. You can use the [DescribeApplication](https://docs.aws.amazon.com/kinesisanalytics/latest/apiv2/API_DescribeApplication.html) operation to find the current application version.
 *
 * > Creation of multiple outputs should be sequential (use of DependsOn) to avoid a problem with a stale application version ( *ConcurrentModificationException* ).
 *
 * @cloudformationResource AWS::KinesisAnalyticsV2::ApplicationOutput
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationoutput.html
 */
export class CfnApplicationOutput extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::KinesisAnalyticsV2::ApplicationOutput";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplicationOutput {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnApplicationOutputPropsFromCloudFormation(resourceProperties);
        const ret = new CfnApplicationOutput(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationoutput.html#cfn-kinesisanalyticsv2-applicationoutput-applicationname
     */
    public applicationName: string;

    /**
     * Describes a SQL-based Kinesis Data Analytics application's output configuration, in which you identify an in-application stream and a destination where you want the in-application stream data to be written. The destination can be a Kinesis data stream or a Kinesis Data Firehose delivery stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationoutput.html#cfn-kinesisanalyticsv2-applicationoutput-output
     */
    public output: CfnApplicationOutput.OutputProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::KinesisAnalyticsV2::ApplicationOutput`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationOutputProps) {
        super(scope, id, { type: CfnApplicationOutput.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationName', this);
        cdk.requireProperty(props, 'output', this);

        this.applicationName = props.applicationName;
        this.output = props.output;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplicationOutput.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationName: this.applicationName,
            output: this.output,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationOutputPropsToCloudFormation(props);
    }
}

export namespace CfnApplicationOutput {
    /**
     * Describes the data format when records are written to the destination in a SQL-based Kinesis Data Analytics application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationoutput-destinationschema.html
     */
    export interface DestinationSchemaProperty {
        /**
         * Specifies the format of the records on the output stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationoutput-destinationschema.html#cfn-kinesisanalyticsv2-applicationoutput-destinationschema-recordformattype
         */
        readonly recordFormatType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DestinationSchemaProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationSchemaProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationOutput_DestinationSchemaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('recordFormatType', cdk.validateString)(properties.recordFormatType));
    return errors.wrap('supplied properties not correct for "DestinationSchemaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationOutput.DestinationSchema` resource
 *
 * @param properties - the TypeScript properties of a `DestinationSchemaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationOutput.DestinationSchema` resource.
 */
// @ts-ignore TS6133
function cfnApplicationOutputDestinationSchemaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationOutput_DestinationSchemaPropertyValidator(properties).assertSuccess();
    return {
        RecordFormatType: cdk.stringToCloudFormation(properties.recordFormatType),
    };
}

// @ts-ignore TS6133
function CfnApplicationOutputDestinationSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationOutput.DestinationSchemaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutput.DestinationSchemaProperty>();
    ret.addPropertyResult('recordFormatType', 'RecordFormatType', properties.RecordFormatType != null ? cfn_parse.FromCloudFormation.getString(properties.RecordFormatType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationOutput {
    /**
     * For a SQL-based Kinesis Data Analytics application, when configuring application output, identifies a Kinesis Data Firehose delivery stream as the destination. You provide the stream Amazon Resource Name (ARN) of the delivery stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationoutput-kinesisfirehoseoutput.html
     */
    export interface KinesisFirehoseOutputProperty {
        /**
         * The ARN of the destination delivery stream to write to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationoutput-kinesisfirehoseoutput.html#cfn-kinesisanalyticsv2-applicationoutput-kinesisfirehoseoutput-resourcearn
         */
        readonly resourceArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisFirehoseOutputProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseOutputProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationOutput_KinesisFirehoseOutputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    return errors.wrap('supplied properties not correct for "KinesisFirehoseOutputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationOutput.KinesisFirehoseOutput` resource
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseOutputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationOutput.KinesisFirehoseOutput` resource.
 */
// @ts-ignore TS6133
function cfnApplicationOutputKinesisFirehoseOutputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationOutput_KinesisFirehoseOutputPropertyValidator(properties).assertSuccess();
    return {
        ResourceARN: cdk.stringToCloudFormation(properties.resourceArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationOutputKinesisFirehoseOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationOutput.KinesisFirehoseOutputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutput.KinesisFirehoseOutputProperty>();
    ret.addPropertyResult('resourceArn', 'ResourceARN', cfn_parse.FromCloudFormation.getString(properties.ResourceARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationOutput {
    /**
     * When you configure a SQL-based Kinesis Data Analytics application's output, identifies a Kinesis data stream as the destination. You provide the stream Amazon Resource Name (ARN).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationoutput-kinesisstreamsoutput.html
     */
    export interface KinesisStreamsOutputProperty {
        /**
         * The ARN of the destination Kinesis data stream to write to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationoutput-kinesisstreamsoutput.html#cfn-kinesisanalyticsv2-applicationoutput-kinesisstreamsoutput-resourcearn
         */
        readonly resourceArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisStreamsOutputProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisStreamsOutputProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationOutput_KinesisStreamsOutputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    return errors.wrap('supplied properties not correct for "KinesisStreamsOutputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationOutput.KinesisStreamsOutput` resource
 *
 * @param properties - the TypeScript properties of a `KinesisStreamsOutputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationOutput.KinesisStreamsOutput` resource.
 */
// @ts-ignore TS6133
function cfnApplicationOutputKinesisStreamsOutputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationOutput_KinesisStreamsOutputPropertyValidator(properties).assertSuccess();
    return {
        ResourceARN: cdk.stringToCloudFormation(properties.resourceArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationOutputKinesisStreamsOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationOutput.KinesisStreamsOutputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutput.KinesisStreamsOutputProperty>();
    ret.addPropertyResult('resourceArn', 'ResourceARN', cfn_parse.FromCloudFormation.getString(properties.ResourceARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationOutput {
    /**
     * When you configure a SQL-based Kinesis Data Analytics application's output, identifies an Amazon Lambda function as the destination. You provide the function Amazon Resource Name (ARN) of the Lambda function.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationoutput-lambdaoutput.html
     */
    export interface LambdaOutputProperty {
        /**
         * The Amazon Resource Name (ARN) of the destination Lambda function to write to.
         *
         * > To specify an earlier version of the Lambda function than the latest, include the Lambda function version in the Lambda function ARN. For more information about Lambda ARNs, see [Example ARNs: Amazon Lambda](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html#arn-syntax-lambda)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationoutput-lambdaoutput.html#cfn-kinesisanalyticsv2-applicationoutput-lambdaoutput-resourcearn
         */
        readonly resourceArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaOutputProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaOutputProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationOutput_LambdaOutputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    return errors.wrap('supplied properties not correct for "LambdaOutputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationOutput.LambdaOutput` resource
 *
 * @param properties - the TypeScript properties of a `LambdaOutputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationOutput.LambdaOutput` resource.
 */
// @ts-ignore TS6133
function cfnApplicationOutputLambdaOutputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationOutput_LambdaOutputPropertyValidator(properties).assertSuccess();
    return {
        ResourceARN: cdk.stringToCloudFormation(properties.resourceArn),
    };
}

// @ts-ignore TS6133
function CfnApplicationOutputLambdaOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationOutput.LambdaOutputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutput.LambdaOutputProperty>();
    ret.addPropertyResult('resourceArn', 'ResourceARN', cfn_parse.FromCloudFormation.getString(properties.ResourceARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationOutput {
    /**
     * Describes a SQL-based Kinesis Data Analytics application's output configuration, in which you identify an in-application stream and a destination where you want the in-application stream data to be written. The destination can be a Kinesis data stream or a Kinesis Data Firehose delivery stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationoutput-output.html
     */
    export interface OutputProperty {
        /**
         * Describes the data format when records are written to the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationoutput-output.html#cfn-kinesisanalyticsv2-applicationoutput-output-destinationschema
         */
        readonly destinationSchema: CfnApplicationOutput.DestinationSchemaProperty | cdk.IResolvable;
        /**
         * Identifies a Kinesis Data Firehose delivery stream as the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationoutput-output.html#cfn-kinesisanalyticsv2-applicationoutput-output-kinesisfirehoseoutput
         */
        readonly kinesisFirehoseOutput?: CfnApplicationOutput.KinesisFirehoseOutputProperty | cdk.IResolvable;
        /**
         * Identifies a Kinesis data stream as the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationoutput-output.html#cfn-kinesisanalyticsv2-applicationoutput-output-kinesisstreamsoutput
         */
        readonly kinesisStreamsOutput?: CfnApplicationOutput.KinesisStreamsOutputProperty | cdk.IResolvable;
        /**
         * Identifies an Amazon Lambda function as the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationoutput-output.html#cfn-kinesisanalyticsv2-applicationoutput-output-lambdaoutput
         */
        readonly lambdaOutput?: CfnApplicationOutput.LambdaOutputProperty | cdk.IResolvable;
        /**
         * The name of the in-application stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationoutput-output.html#cfn-kinesisanalyticsv2-applicationoutput-output-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OutputProperty`
 *
 * @param properties - the TypeScript properties of a `OutputProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationOutput_OutputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationSchema', cdk.requiredValidator)(properties.destinationSchema));
    errors.collect(cdk.propertyValidator('destinationSchema', CfnApplicationOutput_DestinationSchemaPropertyValidator)(properties.destinationSchema));
    errors.collect(cdk.propertyValidator('kinesisFirehoseOutput', CfnApplicationOutput_KinesisFirehoseOutputPropertyValidator)(properties.kinesisFirehoseOutput));
    errors.collect(cdk.propertyValidator('kinesisStreamsOutput', CfnApplicationOutput_KinesisStreamsOutputPropertyValidator)(properties.kinesisStreamsOutput));
    errors.collect(cdk.propertyValidator('lambdaOutput', CfnApplicationOutput_LambdaOutputPropertyValidator)(properties.lambdaOutput));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "OutputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationOutput.Output` resource
 *
 * @param properties - the TypeScript properties of a `OutputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationOutput.Output` resource.
 */
// @ts-ignore TS6133
function cfnApplicationOutputOutputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationOutput_OutputPropertyValidator(properties).assertSuccess();
    return {
        DestinationSchema: cfnApplicationOutputDestinationSchemaPropertyToCloudFormation(properties.destinationSchema),
        KinesisFirehoseOutput: cfnApplicationOutputKinesisFirehoseOutputPropertyToCloudFormation(properties.kinesisFirehoseOutput),
        KinesisStreamsOutput: cfnApplicationOutputKinesisStreamsOutputPropertyToCloudFormation(properties.kinesisStreamsOutput),
        LambdaOutput: cfnApplicationOutputLambdaOutputPropertyToCloudFormation(properties.lambdaOutput),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnApplicationOutputOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationOutput.OutputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutput.OutputProperty>();
    ret.addPropertyResult('destinationSchema', 'DestinationSchema', CfnApplicationOutputDestinationSchemaPropertyFromCloudFormation(properties.DestinationSchema));
    ret.addPropertyResult('kinesisFirehoseOutput', 'KinesisFirehoseOutput', properties.KinesisFirehoseOutput != null ? CfnApplicationOutputKinesisFirehoseOutputPropertyFromCloudFormation(properties.KinesisFirehoseOutput) : undefined);
    ret.addPropertyResult('kinesisStreamsOutput', 'KinesisStreamsOutput', properties.KinesisStreamsOutput != null ? CfnApplicationOutputKinesisStreamsOutputPropertyFromCloudFormation(properties.KinesisStreamsOutput) : undefined);
    ret.addPropertyResult('lambdaOutput', 'LambdaOutput', properties.LambdaOutput != null ? CfnApplicationOutputLambdaOutputPropertyFromCloudFormation(properties.LambdaOutput) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnApplicationReferenceDataSource`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationreferencedatasource.html
 */
export interface CfnApplicationReferenceDataSourceProps {

    /**
     * The name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationreferencedatasource.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-applicationname
     */
    readonly applicationName: string;

    /**
     * For a SQL-based Kinesis Data Analytics application, describes the reference data source by providing the source information (Amazon S3 bucket name and object key name), the resulting in-application table name that is created, and the necessary schema to map the data elements in the Amazon S3 object to the in-application table.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationreferencedatasource.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-referencedatasource
     */
    readonly referenceDataSource: CfnApplicationReferenceDataSource.ReferenceDataSourceProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationReferenceDataSourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationReferenceDataSourceProps`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSourcePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationName', cdk.requiredValidator)(properties.applicationName));
    errors.collect(cdk.propertyValidator('applicationName', cdk.validateString)(properties.applicationName));
    errors.collect(cdk.propertyValidator('referenceDataSource', cdk.requiredValidator)(properties.referenceDataSource));
    errors.collect(cdk.propertyValidator('referenceDataSource', CfnApplicationReferenceDataSource_ReferenceDataSourcePropertyValidator)(properties.referenceDataSource));
    return errors.wrap('supplied properties not correct for "CfnApplicationReferenceDataSourceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationReferenceDataSourceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourcePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSourcePropsValidator(properties).assertSuccess();
    return {
        ApplicationName: cdk.stringToCloudFormation(properties.applicationName),
        ReferenceDataSource: cfnApplicationReferenceDataSourceReferenceDataSourcePropertyToCloudFormation(properties.referenceDataSource),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSourceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSourceProps>();
    ret.addPropertyResult('applicationName', 'ApplicationName', cfn_parse.FromCloudFormation.getString(properties.ApplicationName));
    ret.addPropertyResult('referenceDataSource', 'ReferenceDataSource', CfnApplicationReferenceDataSourceReferenceDataSourcePropertyFromCloudFormation(properties.ReferenceDataSource));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource`
 *
 * Adds a reference data source to an existing SQL-based Kinesis Data Analytics application.
 *
 * Kinesis Data Analytics reads reference data (that is, an Amazon S3 object) and creates an in-application table within your application. In the request, you provide the source (S3 bucket name and object key name), name of the in-application table to create, and the necessary mapping information that describes how data in an Amazon S3 object maps to columns in the resulting in-application table.
 *
 * @cloudformationResource AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationreferencedatasource.html
 */
export class CfnApplicationReferenceDataSource extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplicationReferenceDataSource {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnApplicationReferenceDataSourcePropsFromCloudFormation(resourceProperties);
        const ret = new CfnApplicationReferenceDataSource(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationreferencedatasource.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-applicationname
     */
    public applicationName: string;

    /**
     * For a SQL-based Kinesis Data Analytics application, describes the reference data source by providing the source information (Amazon S3 bucket name and object key name), the resulting in-application table name that is created, and the necessary schema to map the data elements in the Amazon S3 object to the in-application table.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-applicationreferencedatasource.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-referencedatasource
     */
    public referenceDataSource: CfnApplicationReferenceDataSource.ReferenceDataSourceProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationReferenceDataSourceProps) {
        super(scope, id, { type: CfnApplicationReferenceDataSource.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationName', this);
        cdk.requireProperty(props, 'referenceDataSource', this);

        this.applicationName = props.applicationName;
        this.referenceDataSource = props.referenceDataSource;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplicationReferenceDataSource.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationName: this.applicationName,
            referenceDataSource: this.referenceDataSource,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationReferenceDataSourcePropsToCloudFormation(props);
    }
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * For a SQL-based Kinesis Data Analytics application, provides additional mapping information when the record format uses delimiters, such as CSV. For example, the following sample records use CSV format, where the records use the *'\n'* as the row delimiter and a comma (",") as the column delimiter:
     *
     * `"name1", "address1"`
     *
     * `"name2", "address2"`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-csvmappingparameters.html
     */
    export interface CSVMappingParametersProperty {
        /**
         * The column delimiter. For example, in a CSV format, a comma (",") is the typical column delimiter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-csvmappingparameters.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-csvmappingparameters-recordcolumndelimiter
         */
        readonly recordColumnDelimiter: string;
        /**
         * The row delimiter. For example, in a CSV format, *'\n'* is the typical row delimiter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-csvmappingparameters.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-csvmappingparameters-recordrowdelimiter
         */
        readonly recordRowDelimiter: string;
    }
}

/**
 * Determine whether the given properties match those of a `CSVMappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `CSVMappingParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_CSVMappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('recordColumnDelimiter', cdk.requiredValidator)(properties.recordColumnDelimiter));
    errors.collect(cdk.propertyValidator('recordColumnDelimiter', cdk.validateString)(properties.recordColumnDelimiter));
    errors.collect(cdk.propertyValidator('recordRowDelimiter', cdk.requiredValidator)(properties.recordRowDelimiter));
    errors.collect(cdk.propertyValidator('recordRowDelimiter', cdk.validateString)(properties.recordRowDelimiter));
    return errors.wrap('supplied properties not correct for "CSVMappingParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.CSVMappingParameters` resource
 *
 * @param properties - the TypeScript properties of a `CSVMappingParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.CSVMappingParameters` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceCSVMappingParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_CSVMappingParametersPropertyValidator(properties).assertSuccess();
    return {
        RecordColumnDelimiter: cdk.stringToCloudFormation(properties.recordColumnDelimiter),
        RecordRowDelimiter: cdk.stringToCloudFormation(properties.recordRowDelimiter),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceCSVMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.CSVMappingParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.CSVMappingParametersProperty>();
    ret.addPropertyResult('recordColumnDelimiter', 'RecordColumnDelimiter', cfn_parse.FromCloudFormation.getString(properties.RecordColumnDelimiter));
    ret.addPropertyResult('recordRowDelimiter', 'RecordRowDelimiter', cfn_parse.FromCloudFormation.getString(properties.RecordRowDelimiter));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * For a SQL-based Kinesis Data Analytics application, provides additional mapping information when JSON is the record format on the streaming source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-jsonmappingparameters.html
     */
    export interface JSONMappingParametersProperty {
        /**
         * The path to the top-level parent that contains the records.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-jsonmappingparameters.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-jsonmappingparameters-recordrowpath
         */
        readonly recordRowPath: string;
    }
}

/**
 * Determine whether the given properties match those of a `JSONMappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `JSONMappingParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_JSONMappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('recordRowPath', cdk.requiredValidator)(properties.recordRowPath));
    errors.collect(cdk.propertyValidator('recordRowPath', cdk.validateString)(properties.recordRowPath));
    return errors.wrap('supplied properties not correct for "JSONMappingParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.JSONMappingParameters` resource
 *
 * @param properties - the TypeScript properties of a `JSONMappingParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.JSONMappingParameters` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceJSONMappingParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_JSONMappingParametersPropertyValidator(properties).assertSuccess();
    return {
        RecordRowPath: cdk.stringToCloudFormation(properties.recordRowPath),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceJSONMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.JSONMappingParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.JSONMappingParametersProperty>();
    ret.addPropertyResult('recordRowPath', 'RecordRowPath', cfn_parse.FromCloudFormation.getString(properties.RecordRowPath));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * When you configure a SQL-based Kinesis Data Analytics application's input at the time of creating or updating an application, provides additional mapping information specific to the record format (such as JSON, CSV, or record fields delimited by some delimiter) on the streaming source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-mappingparameters.html
     */
    export interface MappingParametersProperty {
        /**
         * Provides additional mapping information when the record format uses delimiters (for example, CSV).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-mappingparameters.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-mappingparameters-csvmappingparameters
         */
        readonly csvMappingParameters?: CfnApplicationReferenceDataSource.CSVMappingParametersProperty | cdk.IResolvable;
        /**
         * Provides additional mapping information when JSON is the record format on the streaming source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-mappingparameters.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-mappingparameters-jsonmappingparameters
         */
        readonly jsonMappingParameters?: CfnApplicationReferenceDataSource.JSONMappingParametersProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MappingParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_MappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('csvMappingParameters', CfnApplicationReferenceDataSource_CSVMappingParametersPropertyValidator)(properties.csvMappingParameters));
    errors.collect(cdk.propertyValidator('jsonMappingParameters', CfnApplicationReferenceDataSource_JSONMappingParametersPropertyValidator)(properties.jsonMappingParameters));
    return errors.wrap('supplied properties not correct for "MappingParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.MappingParameters` resource
 *
 * @param properties - the TypeScript properties of a `MappingParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.MappingParameters` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceMappingParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_MappingParametersPropertyValidator(properties).assertSuccess();
    return {
        CSVMappingParameters: cfnApplicationReferenceDataSourceCSVMappingParametersPropertyToCloudFormation(properties.csvMappingParameters),
        JSONMappingParameters: cfnApplicationReferenceDataSourceJSONMappingParametersPropertyToCloudFormation(properties.jsonMappingParameters),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.MappingParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.MappingParametersProperty>();
    ret.addPropertyResult('csvMappingParameters', 'CSVMappingParameters', properties.CSVMappingParameters != null ? CfnApplicationReferenceDataSourceCSVMappingParametersPropertyFromCloudFormation(properties.CSVMappingParameters) : undefined);
    ret.addPropertyResult('jsonMappingParameters', 'JSONMappingParameters', properties.JSONMappingParameters != null ? CfnApplicationReferenceDataSourceJSONMappingParametersPropertyFromCloudFormation(properties.JSONMappingParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * For a SQL-based Kinesis Data Analytics application, describes the mapping of each data element in the streaming source to the corresponding column in the in-application stream.
     *
     * Also used to describe the format of the reference data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-recordcolumn.html
     */
    export interface RecordColumnProperty {
        /**
         * A reference to the data element in the streaming input or the reference data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-recordcolumn.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-recordcolumn-mapping
         */
        readonly mapping?: string;
        /**
         * The name of the column that is created in the in-application input stream or reference table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-recordcolumn.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-recordcolumn-name
         */
        readonly name: string;
        /**
         * The type of column created in the in-application input stream or reference table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-recordcolumn.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-recordcolumn-sqltype
         */
        readonly sqlType: string;
    }
}

/**
 * Determine whether the given properties match those of a `RecordColumnProperty`
 *
 * @param properties - the TypeScript properties of a `RecordColumnProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_RecordColumnPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mapping', cdk.validateString)(properties.mapping));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('sqlType', cdk.requiredValidator)(properties.sqlType));
    errors.collect(cdk.propertyValidator('sqlType', cdk.validateString)(properties.sqlType));
    return errors.wrap('supplied properties not correct for "RecordColumnProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.RecordColumn` resource
 *
 * @param properties - the TypeScript properties of a `RecordColumnProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.RecordColumn` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceRecordColumnPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_RecordColumnPropertyValidator(properties).assertSuccess();
    return {
        Mapping: cdk.stringToCloudFormation(properties.mapping),
        Name: cdk.stringToCloudFormation(properties.name),
        SqlType: cdk.stringToCloudFormation(properties.sqlType),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceRecordColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.RecordColumnProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.RecordColumnProperty>();
    ret.addPropertyResult('mapping', 'Mapping', properties.Mapping != null ? cfn_parse.FromCloudFormation.getString(properties.Mapping) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('sqlType', 'SqlType', cfn_parse.FromCloudFormation.getString(properties.SqlType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * For a SQL-based Kinesis Data Analytics application, describes the record format and relevant mapping information that should be applied to schematize the records on the stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-recordformat.html
     */
    export interface RecordFormatProperty {
        /**
         * When you configure application input at the time of creating or updating an application, provides additional mapping information specific to the record format (such as JSON, CSV, or record fields delimited by some delimiter) on the streaming source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-recordformat.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-recordformat-mappingparameters
         */
        readonly mappingParameters?: CfnApplicationReferenceDataSource.MappingParametersProperty | cdk.IResolvable;
        /**
         * The type of record format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-recordformat.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-recordformat-recordformattype
         */
        readonly recordFormatType: string;
    }
}

/**
 * Determine whether the given properties match those of a `RecordFormatProperty`
 *
 * @param properties - the TypeScript properties of a `RecordFormatProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_RecordFormatPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mappingParameters', CfnApplicationReferenceDataSource_MappingParametersPropertyValidator)(properties.mappingParameters));
    errors.collect(cdk.propertyValidator('recordFormatType', cdk.requiredValidator)(properties.recordFormatType));
    errors.collect(cdk.propertyValidator('recordFormatType', cdk.validateString)(properties.recordFormatType));
    return errors.wrap('supplied properties not correct for "RecordFormatProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.RecordFormat` resource
 *
 * @param properties - the TypeScript properties of a `RecordFormatProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.RecordFormat` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceRecordFormatPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_RecordFormatPropertyValidator(properties).assertSuccess();
    return {
        MappingParameters: cfnApplicationReferenceDataSourceMappingParametersPropertyToCloudFormation(properties.mappingParameters),
        RecordFormatType: cdk.stringToCloudFormation(properties.recordFormatType),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceRecordFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.RecordFormatProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.RecordFormatProperty>();
    ret.addPropertyResult('mappingParameters', 'MappingParameters', properties.MappingParameters != null ? CfnApplicationReferenceDataSourceMappingParametersPropertyFromCloudFormation(properties.MappingParameters) : undefined);
    ret.addPropertyResult('recordFormatType', 'RecordFormatType', cfn_parse.FromCloudFormation.getString(properties.RecordFormatType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * For a SQL-based Kinesis Data Analytics application, describes the reference data source by providing the source information (Amazon S3 bucket name and object key name), the resulting in-application table name that is created, and the necessary schema to map the data elements in the Amazon S3 object to the in-application table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-referencedatasource.html
     */
    export interface ReferenceDataSourceProperty {
        /**
         * Describes the format of the data in the streaming source, and how each data element maps to corresponding columns created in the in-application stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-referencedatasource.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-referencedatasource-referenceschema
         */
        readonly referenceSchema: CfnApplicationReferenceDataSource.ReferenceSchemaProperty | cdk.IResolvable;
        /**
         * Identifies the S3 bucket and object that contains the reference data. A Kinesis Data Analytics application loads reference data only once. If the data changes, you call the [UpdateApplication](https://docs.aws.amazon.com/kinesisanalytics/latest/apiv2/API_UpdateApplication.html) operation to trigger reloading of data into your application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-referencedatasource.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-referencedatasource-s3referencedatasource
         */
        readonly s3ReferenceDataSource?: CfnApplicationReferenceDataSource.S3ReferenceDataSourceProperty | cdk.IResolvable;
        /**
         * The name of the in-application table to create.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-referencedatasource.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-referencedatasource-tablename
         */
        readonly tableName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ReferenceDataSourceProperty`
 *
 * @param properties - the TypeScript properties of a `ReferenceDataSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_ReferenceDataSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('referenceSchema', cdk.requiredValidator)(properties.referenceSchema));
    errors.collect(cdk.propertyValidator('referenceSchema', CfnApplicationReferenceDataSource_ReferenceSchemaPropertyValidator)(properties.referenceSchema));
    errors.collect(cdk.propertyValidator('s3ReferenceDataSource', CfnApplicationReferenceDataSource_S3ReferenceDataSourcePropertyValidator)(properties.s3ReferenceDataSource));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    return errors.wrap('supplied properties not correct for "ReferenceDataSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.ReferenceDataSource` resource
 *
 * @param properties - the TypeScript properties of a `ReferenceDataSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.ReferenceDataSource` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceReferenceDataSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_ReferenceDataSourcePropertyValidator(properties).assertSuccess();
    return {
        ReferenceSchema: cfnApplicationReferenceDataSourceReferenceSchemaPropertyToCloudFormation(properties.referenceSchema),
        S3ReferenceDataSource: cfnApplicationReferenceDataSourceS3ReferenceDataSourcePropertyToCloudFormation(properties.s3ReferenceDataSource),
        TableName: cdk.stringToCloudFormation(properties.tableName),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceReferenceDataSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.ReferenceDataSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.ReferenceDataSourceProperty>();
    ret.addPropertyResult('referenceSchema', 'ReferenceSchema', CfnApplicationReferenceDataSourceReferenceSchemaPropertyFromCloudFormation(properties.ReferenceSchema));
    ret.addPropertyResult('s3ReferenceDataSource', 'S3ReferenceDataSource', properties.S3ReferenceDataSource != null ? CfnApplicationReferenceDataSourceS3ReferenceDataSourcePropertyFromCloudFormation(properties.S3ReferenceDataSource) : undefined);
    ret.addPropertyResult('tableName', 'TableName', properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * For a SQL-based Kinesis Data Analytics application, describes the format of the data in the streaming source, and how each data element maps to corresponding columns created in the in-application stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-referenceschema.html
     */
    export interface ReferenceSchemaProperty {
        /**
         * A list of `RecordColumn` objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-referenceschema.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-referenceschema-recordcolumns
         */
        readonly recordColumns: Array<CfnApplicationReferenceDataSource.RecordColumnProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies the encoding of the records in the streaming source. For example, UTF-8.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-referenceschema.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-referenceschema-recordencoding
         */
        readonly recordEncoding?: string;
        /**
         * Specifies the format of the records on the streaming source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-referenceschema.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-referenceschema-recordformat
         */
        readonly recordFormat: CfnApplicationReferenceDataSource.RecordFormatProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ReferenceSchemaProperty`
 *
 * @param properties - the TypeScript properties of a `ReferenceSchemaProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_ReferenceSchemaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('recordColumns', cdk.requiredValidator)(properties.recordColumns));
    errors.collect(cdk.propertyValidator('recordColumns', cdk.listValidator(CfnApplicationReferenceDataSource_RecordColumnPropertyValidator))(properties.recordColumns));
    errors.collect(cdk.propertyValidator('recordEncoding', cdk.validateString)(properties.recordEncoding));
    errors.collect(cdk.propertyValidator('recordFormat', cdk.requiredValidator)(properties.recordFormat));
    errors.collect(cdk.propertyValidator('recordFormat', CfnApplicationReferenceDataSource_RecordFormatPropertyValidator)(properties.recordFormat));
    return errors.wrap('supplied properties not correct for "ReferenceSchemaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.ReferenceSchema` resource
 *
 * @param properties - the TypeScript properties of a `ReferenceSchemaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.ReferenceSchema` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceReferenceSchemaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_ReferenceSchemaPropertyValidator(properties).assertSuccess();
    return {
        RecordColumns: cdk.listMapper(cfnApplicationReferenceDataSourceRecordColumnPropertyToCloudFormation)(properties.recordColumns),
        RecordEncoding: cdk.stringToCloudFormation(properties.recordEncoding),
        RecordFormat: cfnApplicationReferenceDataSourceRecordFormatPropertyToCloudFormation(properties.recordFormat),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceReferenceSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.ReferenceSchemaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.ReferenceSchemaProperty>();
    ret.addPropertyResult('recordColumns', 'RecordColumns', cfn_parse.FromCloudFormation.getArray(CfnApplicationReferenceDataSourceRecordColumnPropertyFromCloudFormation)(properties.RecordColumns));
    ret.addPropertyResult('recordEncoding', 'RecordEncoding', properties.RecordEncoding != null ? cfn_parse.FromCloudFormation.getString(properties.RecordEncoding) : undefined);
    ret.addPropertyResult('recordFormat', 'RecordFormat', CfnApplicationReferenceDataSourceRecordFormatPropertyFromCloudFormation(properties.RecordFormat));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationReferenceDataSource {
    /**
     * For an SQL-based Amazon Kinesis Data Analytics application, identifies the Amazon S3 bucket and object that contains the reference data.
     *
     * A Kinesis Data Analytics application loads reference data only once. If the data changes, you call the [UpdateApplication](https://docs.aws.amazon.com/kinesisanalytics/latest/apiv2/API_UpdateApplication.html) operation to trigger reloading of data into your application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-s3referencedatasource.html
     */
    export interface S3ReferenceDataSourceProperty {
        /**
         * The Amazon Resource Name (ARN) of the S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-s3referencedatasource.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-s3referencedatasource-bucketarn
         */
        readonly bucketArn: string;
        /**
         * The object key name containing the reference data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalyticsv2-applicationreferencedatasource-s3referencedatasource.html#cfn-kinesisanalyticsv2-applicationreferencedatasource-s3referencedatasource-filekey
         */
        readonly fileKey: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3ReferenceDataSourceProperty`
 *
 * @param properties - the TypeScript properties of a `S3ReferenceDataSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationReferenceDataSource_S3ReferenceDataSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketArn', cdk.requiredValidator)(properties.bucketArn));
    errors.collect(cdk.propertyValidator('bucketArn', cdk.validateString)(properties.bucketArn));
    errors.collect(cdk.propertyValidator('fileKey', cdk.requiredValidator)(properties.fileKey));
    errors.collect(cdk.propertyValidator('fileKey', cdk.validateString)(properties.fileKey));
    return errors.wrap('supplied properties not correct for "S3ReferenceDataSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.S3ReferenceDataSource` resource
 *
 * @param properties - the TypeScript properties of a `S3ReferenceDataSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KinesisAnalyticsV2::ApplicationReferenceDataSource.S3ReferenceDataSource` resource.
 */
// @ts-ignore TS6133
function cfnApplicationReferenceDataSourceS3ReferenceDataSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationReferenceDataSource_S3ReferenceDataSourcePropertyValidator(properties).assertSuccess();
    return {
        BucketARN: cdk.stringToCloudFormation(properties.bucketArn),
        FileKey: cdk.stringToCloudFormation(properties.fileKey),
    };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceS3ReferenceDataSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.S3ReferenceDataSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.S3ReferenceDataSourceProperty>();
    ret.addPropertyResult('bucketArn', 'BucketARN', cfn_parse.FromCloudFormation.getString(properties.BucketARN));
    ret.addPropertyResult('fileKey', 'FileKey', cfn_parse.FromCloudFormation.getString(properties.FileKey));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
