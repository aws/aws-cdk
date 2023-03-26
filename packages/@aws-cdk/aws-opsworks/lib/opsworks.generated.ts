// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:32.099Z","fingerprint":"hXPVb3ncRzG0YYuNPx5UD6Cx28vNVzB4HlDBuBodEqg="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnApp`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html
 */
export interface CfnAppProps {

    /**
     * The app name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-name
     */
    readonly name: string;

    /**
     * The stack ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-stackid
     */
    readonly stackId: string;

    /**
     * The app type. Each supported type is associated with a particular layer. For example, PHP applications are associated with a PHP layer. AWS OpsWorks Stacks deploys an application to those instances that are members of the corresponding layer. If your app isn't one of the standard types, or you prefer to implement your own Deploy recipes, specify `other` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-type
     */
    readonly type: string;

    /**
     * A `Source` object that specifies the app repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-appsource
     */
    readonly appSource?: CfnApp.SourceProperty | cdk.IResolvable;

    /**
     * One or more user-defined key/value pairs to be added to the stack attributes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-attributes
     */
    readonly attributes?: { [key: string]: (string) } | cdk.IResolvable;

    /**
     * The app's data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-datasources
     */
    readonly dataSources?: Array<CfnApp.DataSourceProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A description of the app.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-description
     */
    readonly description?: string;

    /**
     * The app virtual host settings, with multiple domains separated by commas. For example: `'www.example.com, example.com'`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-domains
     */
    readonly domains?: string[];

    /**
     * Whether to enable SSL for the app.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-enablessl
     */
    readonly enableSsl?: boolean | cdk.IResolvable;

    /**
     * An array of `EnvironmentVariable` objects that specify environment variables to be associated with the app. After you deploy the app, these variables are defined on the associated app server instance. For more information, see [Environment Variables](https://docs.aws.amazon.com/opsworks/latest/userguide/workingapps-creating.html#workingapps-creating-environment) .
     *
     * There is no specific limit on the number of environment variables. However, the size of the associated data structure - which includes the variables' names, values, and protected flag values - cannot exceed 20 KB. This limit should accommodate most if not all use cases. Exceeding it will cause an exception with the message, "Environment: is too large (maximum is 20KB)."
     *
     * > If you have specified one or more environment variables, you cannot modify the stack's Chef version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-environment
     */
    readonly environment?: Array<CfnApp.EnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The app's short name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-shortname
     */
    readonly shortname?: string;

    /**
     * An `SslConfiguration` object with the SSL configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-sslconfiguration
     */
    readonly sslConfiguration?: CfnApp.SslConfigurationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnAppProps`
 *
 * @param properties - the TypeScript properties of a `CfnAppProps`
 *
 * @returns the result of the validation.
 */
function CfnAppPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appSource', CfnApp_SourcePropertyValidator)(properties.appSource));
    errors.collect(cdk.propertyValidator('attributes', cdk.hashValidator(cdk.validateString))(properties.attributes));
    errors.collect(cdk.propertyValidator('dataSources', cdk.listValidator(CfnApp_DataSourcePropertyValidator))(properties.dataSources));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('domains', cdk.listValidator(cdk.validateString))(properties.domains));
    errors.collect(cdk.propertyValidator('enableSsl', cdk.validateBoolean)(properties.enableSsl));
    errors.collect(cdk.propertyValidator('environment', cdk.listValidator(CfnApp_EnvironmentVariablePropertyValidator))(properties.environment));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('shortname', cdk.validateString)(properties.shortname));
    errors.collect(cdk.propertyValidator('sslConfiguration', CfnApp_SslConfigurationPropertyValidator)(properties.sslConfiguration));
    errors.collect(cdk.propertyValidator('stackId', cdk.requiredValidator)(properties.stackId));
    errors.collect(cdk.propertyValidator('stackId', cdk.validateString)(properties.stackId));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnAppProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::App` resource
 *
 * @param properties - the TypeScript properties of a `CfnAppProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::App` resource.
 */
// @ts-ignore TS6133
function cfnAppPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAppPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        StackId: cdk.stringToCloudFormation(properties.stackId),
        Type: cdk.stringToCloudFormation(properties.type),
        AppSource: cfnAppSourcePropertyToCloudFormation(properties.appSource),
        Attributes: cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
        DataSources: cdk.listMapper(cfnAppDataSourcePropertyToCloudFormation)(properties.dataSources),
        Description: cdk.stringToCloudFormation(properties.description),
        Domains: cdk.listMapper(cdk.stringToCloudFormation)(properties.domains),
        EnableSsl: cdk.booleanToCloudFormation(properties.enableSsl),
        Environment: cdk.listMapper(cfnAppEnvironmentVariablePropertyToCloudFormation)(properties.environment),
        Shortname: cdk.stringToCloudFormation(properties.shortname),
        SslConfiguration: cfnAppSslConfigurationPropertyToCloudFormation(properties.sslConfiguration),
    };
}

// @ts-ignore TS6133
function CfnAppPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('stackId', 'StackId', cfn_parse.FromCloudFormation.getString(properties.StackId));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('appSource', 'AppSource', properties.AppSource != null ? CfnAppSourcePropertyFromCloudFormation(properties.AppSource) : undefined);
    ret.addPropertyResult('attributes', 'Attributes', properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined);
    ret.addPropertyResult('dataSources', 'DataSources', properties.DataSources != null ? cfn_parse.FromCloudFormation.getArray(CfnAppDataSourcePropertyFromCloudFormation)(properties.DataSources) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('domains', 'Domains', properties.Domains != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Domains) : undefined);
    ret.addPropertyResult('enableSsl', 'EnableSsl', properties.EnableSsl != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableSsl) : undefined);
    ret.addPropertyResult('environment', 'Environment', properties.Environment != null ? cfn_parse.FromCloudFormation.getArray(CfnAppEnvironmentVariablePropertyFromCloudFormation)(properties.Environment) : undefined);
    ret.addPropertyResult('shortname', 'Shortname', properties.Shortname != null ? cfn_parse.FromCloudFormation.getString(properties.Shortname) : undefined);
    ret.addPropertyResult('sslConfiguration', 'SslConfiguration', properties.SslConfiguration != null ? CfnAppSslConfigurationPropertyFromCloudFormation(properties.SslConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::OpsWorks::App`
 *
 * Creates an app for a specified stack. For more information, see [Creating Apps](https://docs.aws.amazon.com/opsworks/latest/userguide/workingapps-creating.html) .
 *
 * *Required Permissions* : To use this action, an IAM user must have a Manage permissions level for the stack, or an attached policy that explicitly grants permissions. For more information on user permissions, see [Managing User Permissions](https://docs.aws.amazon.com/opsworks/latest/userguide/opsworks-security-users.html) .
 *
 * @cloudformationResource AWS::OpsWorks::App
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html
 */
export class CfnApp extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::OpsWorks::App";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApp {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAppPropsFromCloudFormation(resourceProperties);
        const ret = new CfnApp(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The app name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-name
     */
    public name: string;

    /**
     * The stack ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-stackid
     */
    public stackId: string;

    /**
     * The app type. Each supported type is associated with a particular layer. For example, PHP applications are associated with a PHP layer. AWS OpsWorks Stacks deploys an application to those instances that are members of the corresponding layer. If your app isn't one of the standard types, or you prefer to implement your own Deploy recipes, specify `other` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-type
     */
    public type: string;

    /**
     * A `Source` object that specifies the app repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-appsource
     */
    public appSource: CfnApp.SourceProperty | cdk.IResolvable | undefined;

    /**
     * One or more user-defined key/value pairs to be added to the stack attributes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-attributes
     */
    public attributes: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * The app's data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-datasources
     */
    public dataSources: Array<CfnApp.DataSourceProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A description of the app.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-description
     */
    public description: string | undefined;

    /**
     * The app virtual host settings, with multiple domains separated by commas. For example: `'www.example.com, example.com'`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-domains
     */
    public domains: string[] | undefined;

    /**
     * Whether to enable SSL for the app.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-enablessl
     */
    public enableSsl: boolean | cdk.IResolvable | undefined;

    /**
     * An array of `EnvironmentVariable` objects that specify environment variables to be associated with the app. After you deploy the app, these variables are defined on the associated app server instance. For more information, see [Environment Variables](https://docs.aws.amazon.com/opsworks/latest/userguide/workingapps-creating.html#workingapps-creating-environment) .
     *
     * There is no specific limit on the number of environment variables. However, the size of the associated data structure - which includes the variables' names, values, and protected flag values - cannot exceed 20 KB. This limit should accommodate most if not all use cases. Exceeding it will cause an exception with the message, "Environment: is too large (maximum is 20KB)."
     *
     * > If you have specified one or more environment variables, you cannot modify the stack's Chef version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-environment
     */
    public environment: Array<CfnApp.EnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The app's short name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-shortname
     */
    public shortname: string | undefined;

    /**
     * An `SslConfiguration` object with the SSL configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-sslconfiguration
     */
    public sslConfiguration: CfnApp.SslConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::OpsWorks::App`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAppProps) {
        super(scope, id, { type: CfnApp.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'stackId', this);
        cdk.requireProperty(props, 'type', this);

        this.name = props.name;
        this.stackId = props.stackId;
        this.type = props.type;
        this.appSource = props.appSource;
        this.attributes = props.attributes;
        this.dataSources = props.dataSources;
        this.description = props.description;
        this.domains = props.domains;
        this.enableSsl = props.enableSsl;
        this.environment = props.environment;
        this.shortname = props.shortname;
        this.sslConfiguration = props.sslConfiguration;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApp.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            stackId: this.stackId,
            type: this.type,
            appSource: this.appSource,
            attributes: this.attributes,
            dataSources: this.dataSources,
            description: this.description,
            domains: this.domains,
            enableSsl: this.enableSsl,
            environment: this.environment,
            shortname: this.shortname,
            sslConfiguration: this.sslConfiguration,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAppPropsToCloudFormation(props);
    }
}

export namespace CfnApp {
    /**
     * Describes an app's data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-datasource.html
     */
    export interface DataSourceProperty {
        /**
         * The data source's ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-datasource.html#cfn-opsworks-app-datasource-arn
         */
        readonly arn?: string;
        /**
         * The database name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-datasource.html#cfn-opsworks-app-datasource-databasename
         */
        readonly databaseName?: string;
        /**
         * The data source's type, `AutoSelectOpsworksMysqlInstance` , `OpsworksMysqlInstance` , `RdsDbInstance` , or `None` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-datasource.html#cfn-opsworks-app-datasource-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataSourceProperty`
 *
 * @param properties - the TypeScript properties of a `DataSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnApp_DataSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "DataSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::App.DataSource` resource
 *
 * @param properties - the TypeScript properties of a `DataSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::App.DataSource` resource.
 */
// @ts-ignore TS6133
function cfnAppDataSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApp_DataSourcePropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnAppDataSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApp.DataSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.DataSourceProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addPropertyResult('databaseName', 'DatabaseName', properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApp {
    /**
     * Represents an app's environment variable.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-environment.html
     */
    export interface EnvironmentVariableProperty {
        /**
         * (Required) The environment variable's name, which can consist of up to 64 characters and must be specified. The name can contain upper- and lowercase letters, numbers, and underscores (_), but it must start with a letter or underscore.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-environment.html#cfn-opsworks-app-environment-key
         */
        readonly key: string;
        /**
         * (Optional) Whether the variable's value is returned by the [DescribeApps](https://docs.aws.amazon.com/goto/WebAPI/opsworks-2013-02-18/DescribeApps) action. To hide an environment variable's value, set `Secure` to `true` . `DescribeApps` returns `*****FILTERED*****` instead of the actual value. The default value for `Secure` is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-environment.html#cfn-opsworks-app-environment-secure
         */
        readonly secure?: boolean | cdk.IResolvable;
        /**
         * (Optional) The environment variable's value, which can be left empty. If you specify a value, it can contain up to 256 characters, which must all be printable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-environment.html#value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `EnvironmentVariableProperty`
 *
 * @param properties - the TypeScript properties of a `EnvironmentVariableProperty`
 *
 * @returns the result of the validation.
 */
function CfnApp_EnvironmentVariablePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('secure', cdk.validateBoolean)(properties.secure));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "EnvironmentVariableProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::App.EnvironmentVariable` resource
 *
 * @param properties - the TypeScript properties of a `EnvironmentVariableProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::App.EnvironmentVariable` resource.
 */
// @ts-ignore TS6133
function cfnAppEnvironmentVariablePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApp_EnvironmentVariablePropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Secure: cdk.booleanToCloudFormation(properties.secure),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnAppEnvironmentVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApp.EnvironmentVariableProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.EnvironmentVariableProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('secure', 'Secure', properties.Secure != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Secure) : undefined);
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApp {
    /**
     * Contains the information required to retrieve an app or cookbook from a repository. For more information, see [Creating Apps](https://docs.aws.amazon.com/opsworks/latest/userguide/workingapps-creating.html) or [Custom Recipes and Cookbooks](https://docs.aws.amazon.com/opsworks/latest/userguide/workingcookbook.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html
     */
    export interface SourceProperty {
        /**
         * When included in a request, the parameter depends on the repository type.
         *
         * - For Amazon S3 bundles, set `Password` to the appropriate IAM secret access key.
         * - For HTTP bundles and Subversion repositories, set `Password` to the password.
         *
         * For more information on how to safely handle IAM credentials, see [](https://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html) .
         *
         * In responses, AWS OpsWorks Stacks returns `*****FILTERED*****` instead of the actual value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-custcookbooksource-pw
         */
        readonly password?: string;
        /**
         * The application's version. AWS OpsWorks Stacks enables you to easily deploy new versions of an application. One of the simplest approaches is to have branches or revisions in your repository that represent different versions that can potentially be deployed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-custcookbooksource-revision
         */
        readonly revision?: string;
        /**
         * In requests, the repository's SSH key.
         *
         * In responses, AWS OpsWorks Stacks returns `*****FILTERED*****` instead of the actual value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-custcookbooksource-sshkey
         */
        readonly sshKey?: string;
        /**
         * The repository type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-custcookbooksource-type
         */
        readonly type?: string;
        /**
         * The source URL. The following is an example of an Amazon S3 source URL: `https://s3.amazonaws.com/opsworks-demo-bucket/opsworks_cookbook_demo.tar.gz` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-custcookbooksource-url
         */
        readonly url?: string;
        /**
         * This parameter depends on the repository type.
         *
         * - For Amazon S3 bundles, set `Username` to the appropriate IAM access key ID.
         * - For HTTP bundles, Git repositories, and Subversion repositories, set `Username` to the user name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-custcookbooksource-username
         */
        readonly username?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SourceProperty`
 *
 * @param properties - the TypeScript properties of a `SourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnApp_SourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('revision', cdk.validateString)(properties.revision));
    errors.collect(cdk.propertyValidator('sshKey', cdk.validateString)(properties.sshKey));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    errors.collect(cdk.propertyValidator('username', cdk.validateString)(properties.username));
    return errors.wrap('supplied properties not correct for "SourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::App.Source` resource
 *
 * @param properties - the TypeScript properties of a `SourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::App.Source` resource.
 */
// @ts-ignore TS6133
function cfnAppSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApp_SourcePropertyValidator(properties).assertSuccess();
    return {
        Password: cdk.stringToCloudFormation(properties.password),
        Revision: cdk.stringToCloudFormation(properties.revision),
        SshKey: cdk.stringToCloudFormation(properties.sshKey),
        Type: cdk.stringToCloudFormation(properties.type),
        Url: cdk.stringToCloudFormation(properties.url),
        Username: cdk.stringToCloudFormation(properties.username),
    };
}

// @ts-ignore TS6133
function CfnAppSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApp.SourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.SourceProperty>();
    ret.addPropertyResult('password', 'Password', properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined);
    ret.addPropertyResult('revision', 'Revision', properties.Revision != null ? cfn_parse.FromCloudFormation.getString(properties.Revision) : undefined);
    ret.addPropertyResult('sshKey', 'SshKey', properties.SshKey != null ? cfn_parse.FromCloudFormation.getString(properties.SshKey) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addPropertyResult('url', 'Url', properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined);
    ret.addPropertyResult('username', 'Username', properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApp {
    /**
     * Describes an app's SSL configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html
     */
    export interface SslConfigurationProperty {
        /**
         * The contents of the certificate's domain.crt file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html#cfn-opsworks-app-sslconfig-certificate
         */
        readonly certificate?: string;
        /**
         * Optional. Can be used to specify an intermediate certificate authority key or client authentication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html#cfn-opsworks-app-sslconfig-chain
         */
        readonly chain?: string;
        /**
         * The private key; the contents of the certificate's domain.kex file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html#cfn-opsworks-app-sslconfig-privatekey
         */
        readonly privateKey?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SslConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SslConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApp_SslConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificate', cdk.validateString)(properties.certificate));
    errors.collect(cdk.propertyValidator('chain', cdk.validateString)(properties.chain));
    errors.collect(cdk.propertyValidator('privateKey', cdk.validateString)(properties.privateKey));
    return errors.wrap('supplied properties not correct for "SslConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::App.SslConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SslConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::App.SslConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnAppSslConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApp_SslConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Certificate: cdk.stringToCloudFormation(properties.certificate),
        Chain: cdk.stringToCloudFormation(properties.chain),
        PrivateKey: cdk.stringToCloudFormation(properties.privateKey),
    };
}

// @ts-ignore TS6133
function CfnAppSslConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApp.SslConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.SslConfigurationProperty>();
    ret.addPropertyResult('certificate', 'Certificate', properties.Certificate != null ? cfn_parse.FromCloudFormation.getString(properties.Certificate) : undefined);
    ret.addPropertyResult('chain', 'Chain', properties.Chain != null ? cfn_parse.FromCloudFormation.getString(properties.Chain) : undefined);
    ret.addPropertyResult('privateKey', 'PrivateKey', properties.PrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateKey) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnElasticLoadBalancerAttachment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elbattachment.html
 */
export interface CfnElasticLoadBalancerAttachmentProps {

    /**
     * The Elastic Load Balancing instance name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elbattachment.html#cfn-opsworks-elbattachment-elbname
     */
    readonly elasticLoadBalancerName: string;

    /**
     * The AWS OpsWorks layer ID to which the Elastic Load Balancing load balancer is attached.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elbattachment.html#cfn-opsworks-elbattachment-layerid
     */
    readonly layerId: string;
}

/**
 * Determine whether the given properties match those of a `CfnElasticLoadBalancerAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnElasticLoadBalancerAttachmentProps`
 *
 * @returns the result of the validation.
 */
function CfnElasticLoadBalancerAttachmentPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('elasticLoadBalancerName', cdk.requiredValidator)(properties.elasticLoadBalancerName));
    errors.collect(cdk.propertyValidator('elasticLoadBalancerName', cdk.validateString)(properties.elasticLoadBalancerName));
    errors.collect(cdk.propertyValidator('layerId', cdk.requiredValidator)(properties.layerId));
    errors.collect(cdk.propertyValidator('layerId', cdk.validateString)(properties.layerId));
    return errors.wrap('supplied properties not correct for "CfnElasticLoadBalancerAttachmentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::ElasticLoadBalancerAttachment` resource
 *
 * @param properties - the TypeScript properties of a `CfnElasticLoadBalancerAttachmentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::ElasticLoadBalancerAttachment` resource.
 */
// @ts-ignore TS6133
function cfnElasticLoadBalancerAttachmentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnElasticLoadBalancerAttachmentPropsValidator(properties).assertSuccess();
    return {
        ElasticLoadBalancerName: cdk.stringToCloudFormation(properties.elasticLoadBalancerName),
        LayerId: cdk.stringToCloudFormation(properties.layerId),
    };
}

// @ts-ignore TS6133
function CfnElasticLoadBalancerAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnElasticLoadBalancerAttachmentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnElasticLoadBalancerAttachmentProps>();
    ret.addPropertyResult('elasticLoadBalancerName', 'ElasticLoadBalancerName', cfn_parse.FromCloudFormation.getString(properties.ElasticLoadBalancerName));
    ret.addPropertyResult('layerId', 'LayerId', cfn_parse.FromCloudFormation.getString(properties.LayerId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::OpsWorks::ElasticLoadBalancerAttachment`
 *
 * Attaches an Elastic Load Balancing load balancer to an AWS OpsWorks layer that you specify.
 *
 * @cloudformationResource AWS::OpsWorks::ElasticLoadBalancerAttachment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elbattachment.html
 */
export class CfnElasticLoadBalancerAttachment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::OpsWorks::ElasticLoadBalancerAttachment";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnElasticLoadBalancerAttachment {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnElasticLoadBalancerAttachmentPropsFromCloudFormation(resourceProperties);
        const ret = new CfnElasticLoadBalancerAttachment(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Elastic Load Balancing instance name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elbattachment.html#cfn-opsworks-elbattachment-elbname
     */
    public elasticLoadBalancerName: string;

    /**
     * The AWS OpsWorks layer ID to which the Elastic Load Balancing load balancer is attached.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elbattachment.html#cfn-opsworks-elbattachment-layerid
     */
    public layerId: string;

    /**
     * Create a new `AWS::OpsWorks::ElasticLoadBalancerAttachment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnElasticLoadBalancerAttachmentProps) {
        super(scope, id, { type: CfnElasticLoadBalancerAttachment.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'elasticLoadBalancerName', this);
        cdk.requireProperty(props, 'layerId', this);

        this.elasticLoadBalancerName = props.elasticLoadBalancerName;
        this.layerId = props.layerId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnElasticLoadBalancerAttachment.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            elasticLoadBalancerName: this.elasticLoadBalancerName,
            layerId: this.layerId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnElasticLoadBalancerAttachmentPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnInstance`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html
 */
export interface CfnInstanceProps {

    /**
     * The instance type, such as `t2.micro` . For a list of supported instance types, open the stack in the console, choose *Instances* , and choose *+ Instance* . The *Size* list contains the currently supported types. For more information, see [Instance Families and Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html) . The parameter values that you use to specify the various types are in the *API Name* column of the *Available Instance Types* table.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-instancetype
     */
    readonly instanceType: string;

    /**
     * An array that contains the instance's layer IDs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-layerids
     */
    readonly layerIds: string[];

    /**
     * The stack ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-stackid
     */
    readonly stackId: string;

    /**
     * The default AWS OpsWorks Stacks agent version. You have the following options:
     *
     * - `INHERIT` - Use the stack's default agent version setting.
     * - *version_number* - Use the specified agent version. This value overrides the stack's default setting. To update the agent version, edit the instance configuration and specify a new version. AWS OpsWorks Stacks installs that version on the instance.
     *
     * The default setting is `INHERIT` . To specify an agent version, you must use the complete version number, not the abbreviated number shown on the console. For a list of available agent version numbers, call [DescribeAgentVersions](https://docs.aws.amazon.com/goto/WebAPI/opsworks-2013-02-18/DescribeAgentVersions) . AgentVersion cannot be set to Chef 12.2.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-agentversion
     */
    readonly agentVersion?: string;

    /**
     * A custom AMI ID to be used to create the instance. The AMI should be based on one of the supported operating systems. For more information, see [Using Custom AMIs](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-custom-ami.html) .
     *
     * > If you specify a custom AMI, you must set `Os` to `Custom` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-amiid
     */
    readonly amiId?: string;

    /**
     * The instance architecture. The default option is `x86_64` . Instance types do not necessarily support both architectures. For a list of the architectures that are supported by the different instance types, see [Instance Families and Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-architecture
     */
    readonly architecture?: string;

    /**
     * For load-based or time-based instances, the type. Windows stacks can use only time-based instances.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-autoscalingtype
     */
    readonly autoScalingType?: string;

    /**
     * The Availability Zone of the AWS OpsWorks instance, such as `us-east-2a` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-availabilityzone
     */
    readonly availabilityZone?: string;

    /**
     * An array of `BlockDeviceMapping` objects that specify the instance's block devices. For more information, see [Block Device Mapping](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html) . Note that block device mappings are not supported for custom AMIs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-blockdevicemappings
     */
    readonly blockDeviceMappings?: Array<CfnInstance.BlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Whether to create an Amazon EBS-optimized instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-ebsoptimized
     */
    readonly ebsOptimized?: boolean | cdk.IResolvable;

    /**
     * A list of Elastic IP addresses to associate with the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-elasticips
     */
    readonly elasticIps?: string[];

    /**
     * The instance host name. The following are character limits for instance host names.
     *
     * - Linux-based instances: 63 characters
     * - Windows-based instances: 15 characters
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-hostname
     */
    readonly hostname?: string;

    /**
     * Whether to install operating system and package updates when the instance boots. The default value is `true` . To control when updates are installed, set this value to `false` . You must then update your instances manually by using [CreateDeployment](https://docs.aws.amazon.com/goto/WebAPI/opsworks-2013-02-18/CreateDeployment) to run the `update_dependencies` stack command or by manually running `yum` (Amazon Linux) or `apt-get` (Ubuntu) on the instances.
     *
     * > We strongly recommend using the default value of `true` to ensure that your instances have the latest security updates.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-installupdatesonboot
     */
    readonly installUpdatesOnBoot?: boolean | cdk.IResolvable;

    /**
     * The instance's operating system, which must be set to one of the following.
     *
     * - A supported Linux operating system: An Amazon Linux version, such as `Amazon Linux 2` , `Amazon Linux 2018.03` , `Amazon Linux 2017.09` , `Amazon Linux 2017.03` , `Amazon Linux 2016.09` , `Amazon Linux 2016.03` , `Amazon Linux 2015.09` , or `Amazon Linux 2015.03` .
     * - A supported Ubuntu operating system, such as `Ubuntu 18.04 LTS` , `Ubuntu 16.04 LTS` , `Ubuntu 14.04 LTS` , or `Ubuntu 12.04 LTS` .
     * - `CentOS Linux 7`
     * - `Red Hat Enterprise Linux 7`
     * - A supported Windows operating system, such as `Microsoft Windows Server 2012 R2 Base` , `Microsoft Windows Server 2012 R2 with SQL Server Express` , `Microsoft Windows Server 2012 R2 with SQL Server Standard` , or `Microsoft Windows Server 2012 R2 with SQL Server Web` .
     * - A custom AMI: `Custom` .
     *
     * Not all operating systems are supported with all versions of Chef. For more information about the supported operating systems, see [AWS OpsWorks Stacks Operating Systems](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-os.html) .
     *
     * The default option is the current Amazon Linux version. If you set this parameter to `Custom` , you must use the [CreateInstance](https://docs.aws.amazon.com/goto/WebAPI/opsworks-2013-02-18/CreateInstance) action's AmiId parameter to specify the custom AMI that you want to use. Block device mappings are not supported if the value is `Custom` . For more information about how to use custom AMIs with AWS OpsWorks Stacks, see [Using Custom AMIs](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-custom-ami.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-os
     */
    readonly os?: string;

    /**
     * The instance root device type. For more information, see [Storage for the Root Device](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ComponentsAMIs.html#storage-for-the-root-device) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-rootdevicetype
     */
    readonly rootDeviceType?: string;

    /**
     * The instance's Amazon EC2 key-pair name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-sshkeyname
     */
    readonly sshKeyName?: string;

    /**
     * The ID of the instance's subnet. If the stack is running in a VPC, you can use this parameter to override the stack's default subnet ID value and direct AWS OpsWorks Stacks to launch the instance in a different subnet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-subnetid
     */
    readonly subnetId?: string;

    /**
     * The instance's tenancy option. The default option is no tenancy, or if the instance is running in a VPC, inherit tenancy settings from the VPC. The following are valid values for this parameter: `dedicated` , `default` , or `host` . Because there are costs associated with changes in tenancy options, we recommend that you research tenancy options before choosing them for your instances. For more information about dedicated hosts, see [Dedicated Hosts Overview](https://docs.aws.amazon.com/ec2/dedicated-hosts/) and [Amazon EC2 Dedicated Hosts](https://docs.aws.amazon.com/ec2/dedicated-hosts/) . For more information about dedicated instances, see [Dedicated Instances](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/dedicated-instance.html) and [Amazon EC2 Dedicated Instances](https://docs.aws.amazon.com/ec2/purchasing-options/dedicated-instances/) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-tenancy
     */
    readonly tenancy?: string;

    /**
     * The time-based scaling configuration for the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-timebasedautoscaling
     */
    readonly timeBasedAutoScaling?: CfnInstance.TimeBasedAutoScalingProperty | cdk.IResolvable;

    /**
     * The instance's virtualization type, `paravirtual` or `hvm` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-virtualizationtype
     */
    readonly virtualizationType?: string;

    /**
     * A list of AWS OpsWorks volume IDs to associate with the instance. For more information, see [`AWS::OpsWorks::Volume`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-volumes
     */
    readonly volumes?: string[];
}

/**
 * Determine whether the given properties match those of a `CfnInstanceProps`
 *
 * @param properties - the TypeScript properties of a `CfnInstanceProps`
 *
 * @returns the result of the validation.
 */
function CfnInstancePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('agentVersion', cdk.validateString)(properties.agentVersion));
    errors.collect(cdk.propertyValidator('amiId', cdk.validateString)(properties.amiId));
    errors.collect(cdk.propertyValidator('architecture', cdk.validateString)(properties.architecture));
    errors.collect(cdk.propertyValidator('autoScalingType', cdk.validateString)(properties.autoScalingType));
    errors.collect(cdk.propertyValidator('availabilityZone', cdk.validateString)(properties.availabilityZone));
    errors.collect(cdk.propertyValidator('blockDeviceMappings', cdk.listValidator(CfnInstance_BlockDeviceMappingPropertyValidator))(properties.blockDeviceMappings));
    errors.collect(cdk.propertyValidator('ebsOptimized', cdk.validateBoolean)(properties.ebsOptimized));
    errors.collect(cdk.propertyValidator('elasticIps', cdk.listValidator(cdk.validateString))(properties.elasticIps));
    errors.collect(cdk.propertyValidator('hostname', cdk.validateString)(properties.hostname));
    errors.collect(cdk.propertyValidator('installUpdatesOnBoot', cdk.validateBoolean)(properties.installUpdatesOnBoot));
    errors.collect(cdk.propertyValidator('instanceType', cdk.requiredValidator)(properties.instanceType));
    errors.collect(cdk.propertyValidator('instanceType', cdk.validateString)(properties.instanceType));
    errors.collect(cdk.propertyValidator('layerIds', cdk.requiredValidator)(properties.layerIds));
    errors.collect(cdk.propertyValidator('layerIds', cdk.listValidator(cdk.validateString))(properties.layerIds));
    errors.collect(cdk.propertyValidator('os', cdk.validateString)(properties.os));
    errors.collect(cdk.propertyValidator('rootDeviceType', cdk.validateString)(properties.rootDeviceType));
    errors.collect(cdk.propertyValidator('sshKeyName', cdk.validateString)(properties.sshKeyName));
    errors.collect(cdk.propertyValidator('stackId', cdk.requiredValidator)(properties.stackId));
    errors.collect(cdk.propertyValidator('stackId', cdk.validateString)(properties.stackId));
    errors.collect(cdk.propertyValidator('subnetId', cdk.validateString)(properties.subnetId));
    errors.collect(cdk.propertyValidator('tenancy', cdk.validateString)(properties.tenancy));
    errors.collect(cdk.propertyValidator('timeBasedAutoScaling', CfnInstance_TimeBasedAutoScalingPropertyValidator)(properties.timeBasedAutoScaling));
    errors.collect(cdk.propertyValidator('virtualizationType', cdk.validateString)(properties.virtualizationType));
    errors.collect(cdk.propertyValidator('volumes', cdk.listValidator(cdk.validateString))(properties.volumes));
    return errors.wrap('supplied properties not correct for "CfnInstanceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Instance` resource
 *
 * @param properties - the TypeScript properties of a `CfnInstanceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Instance` resource.
 */
// @ts-ignore TS6133
function cfnInstancePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstancePropsValidator(properties).assertSuccess();
    return {
        InstanceType: cdk.stringToCloudFormation(properties.instanceType),
        LayerIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.layerIds),
        StackId: cdk.stringToCloudFormation(properties.stackId),
        AgentVersion: cdk.stringToCloudFormation(properties.agentVersion),
        AmiId: cdk.stringToCloudFormation(properties.amiId),
        Architecture: cdk.stringToCloudFormation(properties.architecture),
        AutoScalingType: cdk.stringToCloudFormation(properties.autoScalingType),
        AvailabilityZone: cdk.stringToCloudFormation(properties.availabilityZone),
        BlockDeviceMappings: cdk.listMapper(cfnInstanceBlockDeviceMappingPropertyToCloudFormation)(properties.blockDeviceMappings),
        EbsOptimized: cdk.booleanToCloudFormation(properties.ebsOptimized),
        ElasticIps: cdk.listMapper(cdk.stringToCloudFormation)(properties.elasticIps),
        Hostname: cdk.stringToCloudFormation(properties.hostname),
        InstallUpdatesOnBoot: cdk.booleanToCloudFormation(properties.installUpdatesOnBoot),
        Os: cdk.stringToCloudFormation(properties.os),
        RootDeviceType: cdk.stringToCloudFormation(properties.rootDeviceType),
        SshKeyName: cdk.stringToCloudFormation(properties.sshKeyName),
        SubnetId: cdk.stringToCloudFormation(properties.subnetId),
        Tenancy: cdk.stringToCloudFormation(properties.tenancy),
        TimeBasedAutoScaling: cfnInstanceTimeBasedAutoScalingPropertyToCloudFormation(properties.timeBasedAutoScaling),
        VirtualizationType: cdk.stringToCloudFormation(properties.virtualizationType),
        Volumes: cdk.listMapper(cdk.stringToCloudFormation)(properties.volumes),
    };
}

// @ts-ignore TS6133
function CfnInstancePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceProps>();
    ret.addPropertyResult('instanceType', 'InstanceType', cfn_parse.FromCloudFormation.getString(properties.InstanceType));
    ret.addPropertyResult('layerIds', 'LayerIds', cfn_parse.FromCloudFormation.getStringArray(properties.LayerIds));
    ret.addPropertyResult('stackId', 'StackId', cfn_parse.FromCloudFormation.getString(properties.StackId));
    ret.addPropertyResult('agentVersion', 'AgentVersion', properties.AgentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.AgentVersion) : undefined);
    ret.addPropertyResult('amiId', 'AmiId', properties.AmiId != null ? cfn_parse.FromCloudFormation.getString(properties.AmiId) : undefined);
    ret.addPropertyResult('architecture', 'Architecture', properties.Architecture != null ? cfn_parse.FromCloudFormation.getString(properties.Architecture) : undefined);
    ret.addPropertyResult('autoScalingType', 'AutoScalingType', properties.AutoScalingType != null ? cfn_parse.FromCloudFormation.getString(properties.AutoScalingType) : undefined);
    ret.addPropertyResult('availabilityZone', 'AvailabilityZone', properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined);
    ret.addPropertyResult('blockDeviceMappings', 'BlockDeviceMappings', properties.BlockDeviceMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceBlockDeviceMappingPropertyFromCloudFormation)(properties.BlockDeviceMappings) : undefined);
    ret.addPropertyResult('ebsOptimized', 'EbsOptimized', properties.EbsOptimized != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EbsOptimized) : undefined);
    ret.addPropertyResult('elasticIps', 'ElasticIps', properties.ElasticIps != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ElasticIps) : undefined);
    ret.addPropertyResult('hostname', 'Hostname', properties.Hostname != null ? cfn_parse.FromCloudFormation.getString(properties.Hostname) : undefined);
    ret.addPropertyResult('installUpdatesOnBoot', 'InstallUpdatesOnBoot', properties.InstallUpdatesOnBoot != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InstallUpdatesOnBoot) : undefined);
    ret.addPropertyResult('os', 'Os', properties.Os != null ? cfn_parse.FromCloudFormation.getString(properties.Os) : undefined);
    ret.addPropertyResult('rootDeviceType', 'RootDeviceType', properties.RootDeviceType != null ? cfn_parse.FromCloudFormation.getString(properties.RootDeviceType) : undefined);
    ret.addPropertyResult('sshKeyName', 'SshKeyName', properties.SshKeyName != null ? cfn_parse.FromCloudFormation.getString(properties.SshKeyName) : undefined);
    ret.addPropertyResult('subnetId', 'SubnetId', properties.SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetId) : undefined);
    ret.addPropertyResult('tenancy', 'Tenancy', properties.Tenancy != null ? cfn_parse.FromCloudFormation.getString(properties.Tenancy) : undefined);
    ret.addPropertyResult('timeBasedAutoScaling', 'TimeBasedAutoScaling', properties.TimeBasedAutoScaling != null ? CfnInstanceTimeBasedAutoScalingPropertyFromCloudFormation(properties.TimeBasedAutoScaling) : undefined);
    ret.addPropertyResult('virtualizationType', 'VirtualizationType', properties.VirtualizationType != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualizationType) : undefined);
    ret.addPropertyResult('volumes', 'Volumes', properties.Volumes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Volumes) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::OpsWorks::Instance`
 *
 * Creates an instance in a specified stack. For more information, see [Adding an Instance to a Layer](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-add.html) .
 *
 * *Required Permissions* : To use this action, an IAM user must have a Manage permissions level for the stack, or an attached policy that explicitly grants permissions. For more information on user permissions, see [Managing User Permissions](https://docs.aws.amazon.com/opsworks/latest/userguide/opsworks-security-users.html) .
 *
 * @cloudformationResource AWS::OpsWorks::Instance
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html
 */
export class CfnInstance extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::OpsWorks::Instance";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstance {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnInstancePropsFromCloudFormation(resourceProperties);
        const ret = new CfnInstance(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Availability Zone of the AWS OpsWorks instance, such as `us-east-2a` .
     * @cloudformationAttribute AvailabilityZone
     */
    public readonly attrAvailabilityZone: string;

    /**
     * The private DNS name of the AWS OpsWorks instance.
     * @cloudformationAttribute PrivateDnsName
     */
    public readonly attrPrivateDnsName: string;

    /**
     * The private IP address of the AWS OpsWorks instance, such as `192.0.2.0` .
     * @cloudformationAttribute PrivateIp
     */
    public readonly attrPrivateIp: string;

    /**
     * The public DNS name of the AWS OpsWorks instance.
     * @cloudformationAttribute PublicDnsName
     */
    public readonly attrPublicDnsName: string;

    /**
     * The public IP address of the AWS OpsWorks instance, such as `192.0.2.0` .
     *
     * > Use this attribute only when the AWS OpsWorks instance is in an AWS OpsWorks layer that auto-assigns public IP addresses.
     * @cloudformationAttribute PublicIp
     */
    public readonly attrPublicIp: string;

    /**
     * The instance type, such as `t2.micro` . For a list of supported instance types, open the stack in the console, choose *Instances* , and choose *+ Instance* . The *Size* list contains the currently supported types. For more information, see [Instance Families and Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html) . The parameter values that you use to specify the various types are in the *API Name* column of the *Available Instance Types* table.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-instancetype
     */
    public instanceType: string;

    /**
     * An array that contains the instance's layer IDs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-layerids
     */
    public layerIds: string[];

    /**
     * The stack ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-stackid
     */
    public stackId: string;

    /**
     * The default AWS OpsWorks Stacks agent version. You have the following options:
     *
     * - `INHERIT` - Use the stack's default agent version setting.
     * - *version_number* - Use the specified agent version. This value overrides the stack's default setting. To update the agent version, edit the instance configuration and specify a new version. AWS OpsWorks Stacks installs that version on the instance.
     *
     * The default setting is `INHERIT` . To specify an agent version, you must use the complete version number, not the abbreviated number shown on the console. For a list of available agent version numbers, call [DescribeAgentVersions](https://docs.aws.amazon.com/goto/WebAPI/opsworks-2013-02-18/DescribeAgentVersions) . AgentVersion cannot be set to Chef 12.2.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-agentversion
     */
    public agentVersion: string | undefined;

    /**
     * A custom AMI ID to be used to create the instance. The AMI should be based on one of the supported operating systems. For more information, see [Using Custom AMIs](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-custom-ami.html) .
     *
     * > If you specify a custom AMI, you must set `Os` to `Custom` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-amiid
     */
    public amiId: string | undefined;

    /**
     * The instance architecture. The default option is `x86_64` . Instance types do not necessarily support both architectures. For a list of the architectures that are supported by the different instance types, see [Instance Families and Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-architecture
     */
    public architecture: string | undefined;

    /**
     * For load-based or time-based instances, the type. Windows stacks can use only time-based instances.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-autoscalingtype
     */
    public autoScalingType: string | undefined;

    /**
     * The Availability Zone of the AWS OpsWorks instance, such as `us-east-2a` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-availabilityzone
     */
    public availabilityZone: string | undefined;

    /**
     * An array of `BlockDeviceMapping` objects that specify the instance's block devices. For more information, see [Block Device Mapping](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html) . Note that block device mappings are not supported for custom AMIs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-blockdevicemappings
     */
    public blockDeviceMappings: Array<CfnInstance.BlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Whether to create an Amazon EBS-optimized instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-ebsoptimized
     */
    public ebsOptimized: boolean | cdk.IResolvable | undefined;

    /**
     * A list of Elastic IP addresses to associate with the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-elasticips
     */
    public elasticIps: string[] | undefined;

    /**
     * The instance host name. The following are character limits for instance host names.
     *
     * - Linux-based instances: 63 characters
     * - Windows-based instances: 15 characters
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-hostname
     */
    public hostname: string | undefined;

    /**
     * Whether to install operating system and package updates when the instance boots. The default value is `true` . To control when updates are installed, set this value to `false` . You must then update your instances manually by using [CreateDeployment](https://docs.aws.amazon.com/goto/WebAPI/opsworks-2013-02-18/CreateDeployment) to run the `update_dependencies` stack command or by manually running `yum` (Amazon Linux) or `apt-get` (Ubuntu) on the instances.
     *
     * > We strongly recommend using the default value of `true` to ensure that your instances have the latest security updates.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-installupdatesonboot
     */
    public installUpdatesOnBoot: boolean | cdk.IResolvable | undefined;

    /**
     * The instance's operating system, which must be set to one of the following.
     *
     * - A supported Linux operating system: An Amazon Linux version, such as `Amazon Linux 2` , `Amazon Linux 2018.03` , `Amazon Linux 2017.09` , `Amazon Linux 2017.03` , `Amazon Linux 2016.09` , `Amazon Linux 2016.03` , `Amazon Linux 2015.09` , or `Amazon Linux 2015.03` .
     * - A supported Ubuntu operating system, such as `Ubuntu 18.04 LTS` , `Ubuntu 16.04 LTS` , `Ubuntu 14.04 LTS` , or `Ubuntu 12.04 LTS` .
     * - `CentOS Linux 7`
     * - `Red Hat Enterprise Linux 7`
     * - A supported Windows operating system, such as `Microsoft Windows Server 2012 R2 Base` , `Microsoft Windows Server 2012 R2 with SQL Server Express` , `Microsoft Windows Server 2012 R2 with SQL Server Standard` , or `Microsoft Windows Server 2012 R2 with SQL Server Web` .
     * - A custom AMI: `Custom` .
     *
     * Not all operating systems are supported with all versions of Chef. For more information about the supported operating systems, see [AWS OpsWorks Stacks Operating Systems](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-os.html) .
     *
     * The default option is the current Amazon Linux version. If you set this parameter to `Custom` , you must use the [CreateInstance](https://docs.aws.amazon.com/goto/WebAPI/opsworks-2013-02-18/CreateInstance) action's AmiId parameter to specify the custom AMI that you want to use. Block device mappings are not supported if the value is `Custom` . For more information about how to use custom AMIs with AWS OpsWorks Stacks, see [Using Custom AMIs](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-custom-ami.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-os
     */
    public os: string | undefined;

    /**
     * The instance root device type. For more information, see [Storage for the Root Device](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ComponentsAMIs.html#storage-for-the-root-device) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-rootdevicetype
     */
    public rootDeviceType: string | undefined;

    /**
     * The instance's Amazon EC2 key-pair name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-sshkeyname
     */
    public sshKeyName: string | undefined;

    /**
     * The ID of the instance's subnet. If the stack is running in a VPC, you can use this parameter to override the stack's default subnet ID value and direct AWS OpsWorks Stacks to launch the instance in a different subnet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-subnetid
     */
    public subnetId: string | undefined;

    /**
     * The instance's tenancy option. The default option is no tenancy, or if the instance is running in a VPC, inherit tenancy settings from the VPC. The following are valid values for this parameter: `dedicated` , `default` , or `host` . Because there are costs associated with changes in tenancy options, we recommend that you research tenancy options before choosing them for your instances. For more information about dedicated hosts, see [Dedicated Hosts Overview](https://docs.aws.amazon.com/ec2/dedicated-hosts/) and [Amazon EC2 Dedicated Hosts](https://docs.aws.amazon.com/ec2/dedicated-hosts/) . For more information about dedicated instances, see [Dedicated Instances](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/dedicated-instance.html) and [Amazon EC2 Dedicated Instances](https://docs.aws.amazon.com/ec2/purchasing-options/dedicated-instances/) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-tenancy
     */
    public tenancy: string | undefined;

    /**
     * The time-based scaling configuration for the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-timebasedautoscaling
     */
    public timeBasedAutoScaling: CfnInstance.TimeBasedAutoScalingProperty | cdk.IResolvable | undefined;

    /**
     * The instance's virtualization type, `paravirtual` or `hvm` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-virtualizationtype
     */
    public virtualizationType: string | undefined;

    /**
     * A list of AWS OpsWorks volume IDs to associate with the instance. For more information, see [`AWS::OpsWorks::Volume`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-volumes
     */
    public volumes: string[] | undefined;

    /**
     * Create a new `AWS::OpsWorks::Instance`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnInstanceProps) {
        super(scope, id, { type: CfnInstance.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'instanceType', this);
        cdk.requireProperty(props, 'layerIds', this);
        cdk.requireProperty(props, 'stackId', this);
        this.attrAvailabilityZone = cdk.Token.asString(this.getAtt('AvailabilityZone', cdk.ResolutionTypeHint.STRING));
        this.attrPrivateDnsName = cdk.Token.asString(this.getAtt('PrivateDnsName', cdk.ResolutionTypeHint.STRING));
        this.attrPrivateIp = cdk.Token.asString(this.getAtt('PrivateIp', cdk.ResolutionTypeHint.STRING));
        this.attrPublicDnsName = cdk.Token.asString(this.getAtt('PublicDnsName', cdk.ResolutionTypeHint.STRING));
        this.attrPublicIp = cdk.Token.asString(this.getAtt('PublicIp', cdk.ResolutionTypeHint.STRING));

        this.instanceType = props.instanceType;
        this.layerIds = props.layerIds;
        this.stackId = props.stackId;
        this.agentVersion = props.agentVersion;
        this.amiId = props.amiId;
        this.architecture = props.architecture;
        this.autoScalingType = props.autoScalingType;
        this.availabilityZone = props.availabilityZone;
        this.blockDeviceMappings = props.blockDeviceMappings;
        this.ebsOptimized = props.ebsOptimized;
        this.elasticIps = props.elasticIps;
        this.hostname = props.hostname;
        this.installUpdatesOnBoot = props.installUpdatesOnBoot;
        this.os = props.os;
        this.rootDeviceType = props.rootDeviceType;
        this.sshKeyName = props.sshKeyName;
        this.subnetId = props.subnetId;
        this.tenancy = props.tenancy;
        this.timeBasedAutoScaling = props.timeBasedAutoScaling;
        this.virtualizationType = props.virtualizationType;
        this.volumes = props.volumes;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnInstance.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            instanceType: this.instanceType,
            layerIds: this.layerIds,
            stackId: this.stackId,
            agentVersion: this.agentVersion,
            amiId: this.amiId,
            architecture: this.architecture,
            autoScalingType: this.autoScalingType,
            availabilityZone: this.availabilityZone,
            blockDeviceMappings: this.blockDeviceMappings,
            ebsOptimized: this.ebsOptimized,
            elasticIps: this.elasticIps,
            hostname: this.hostname,
            installUpdatesOnBoot: this.installUpdatesOnBoot,
            os: this.os,
            rootDeviceType: this.rootDeviceType,
            sshKeyName: this.sshKeyName,
            subnetId: this.subnetId,
            tenancy: this.tenancy,
            timeBasedAutoScaling: this.timeBasedAutoScaling,
            virtualizationType: this.virtualizationType,
            volumes: this.volumes,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnInstancePropsToCloudFormation(props);
    }
}

export namespace CfnInstance {
    /**
     * Describes a block device mapping. This data type maps directly to the Amazon EC2 [BlockDeviceMapping](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_BlockDeviceMapping.html) data type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-blockdevicemapping.html
     */
    export interface BlockDeviceMappingProperty {
        /**
         * The device name that is exposed to the instance, such as `/dev/sdh` . For the root device, you can use the explicit device name or you can set this parameter to `ROOT_DEVICE` and AWS OpsWorks Stacks will provide the correct device name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-blockdevicemapping.html#cfn-opsworks-instance-blockdevicemapping-devicename
         */
        readonly deviceName?: string;
        /**
         * An `EBSBlockDevice` that defines how to configure an Amazon EBS volume when the instance is launched. You can specify either the `VirtualName` or `Ebs` , but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-blockdevicemapping.html#cfn-opsworks-instance-blockdevicemapping-ebs
         */
        readonly ebs?: CfnInstance.EbsBlockDeviceProperty | cdk.IResolvable;
        /**
         * Suppresses the specified device included in the AMI's block device mapping.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-blockdevicemapping.html#cfn-opsworks-instance-blockdevicemapping-nodevice
         */
        readonly noDevice?: string;
        /**
         * The virtual device name. For more information, see [BlockDeviceMapping](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_BlockDeviceMapping.html) . You can specify either the `VirtualName` or `Ebs` , but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-blockdevicemapping.html#cfn-opsworks-instance-blockdevicemapping-virtualname
         */
        readonly virtualName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `BlockDeviceMappingProperty`
 *
 * @param properties - the TypeScript properties of a `BlockDeviceMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstance_BlockDeviceMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deviceName', cdk.validateString)(properties.deviceName));
    errors.collect(cdk.propertyValidator('ebs', CfnInstance_EbsBlockDevicePropertyValidator)(properties.ebs));
    errors.collect(cdk.propertyValidator('noDevice', cdk.validateString)(properties.noDevice));
    errors.collect(cdk.propertyValidator('virtualName', cdk.validateString)(properties.virtualName));
    return errors.wrap('supplied properties not correct for "BlockDeviceMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Instance.BlockDeviceMapping` resource
 *
 * @param properties - the TypeScript properties of a `BlockDeviceMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Instance.BlockDeviceMapping` resource.
 */
// @ts-ignore TS6133
function cfnInstanceBlockDeviceMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstance_BlockDeviceMappingPropertyValidator(properties).assertSuccess();
    return {
        DeviceName: cdk.stringToCloudFormation(properties.deviceName),
        Ebs: cfnInstanceEbsBlockDevicePropertyToCloudFormation(properties.ebs),
        NoDevice: cdk.stringToCloudFormation(properties.noDevice),
        VirtualName: cdk.stringToCloudFormation(properties.virtualName),
    };
}

// @ts-ignore TS6133
function CfnInstanceBlockDeviceMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.BlockDeviceMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.BlockDeviceMappingProperty>();
    ret.addPropertyResult('deviceName', 'DeviceName', properties.DeviceName != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceName) : undefined);
    ret.addPropertyResult('ebs', 'Ebs', properties.Ebs != null ? CfnInstanceEbsBlockDevicePropertyFromCloudFormation(properties.Ebs) : undefined);
    ret.addPropertyResult('noDevice', 'NoDevice', properties.NoDevice != null ? cfn_parse.FromCloudFormation.getString(properties.NoDevice) : undefined);
    ret.addPropertyResult('virtualName', 'VirtualName', properties.VirtualName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstance {
    /**
     * Describes an Amazon EBS volume. This data type maps directly to the Amazon EC2 [EbsBlockDevice](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_EbsBlockDevice.html) data type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-ebsblockdevice.html
     */
    export interface EbsBlockDeviceProperty {
        /**
         * Whether the volume is deleted on instance termination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-ebsblockdevice.html#cfn-opsworks-instance-ebsblockdevice-deleteontermination
         */
        readonly deleteOnTermination?: boolean | cdk.IResolvable;
        /**
         * The number of I/O operations per second (IOPS) that the volume supports. For more information, see [EbsBlockDevice](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_EbsBlockDevice.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-ebsblockdevice.html#cfn-opsworks-instance-ebsblockdevice-iops
         */
        readonly iops?: number;
        /**
         * The snapshot ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-ebsblockdevice.html#cfn-opsworks-instance-ebsblockdevice-snapshotid
         */
        readonly snapshotId?: string;
        /**
         * The volume size, in GiB. For more information, see [EbsBlockDevice](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_EbsBlockDevice.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-ebsblockdevice.html#cfn-opsworks-instance-ebsblockdevice-volumesize
         */
        readonly volumeSize?: number;
        /**
         * The volume type. `gp2` for General Purpose (SSD) volumes, `io1` for Provisioned IOPS (SSD) volumes, `st1` for Throughput Optimized hard disk drives (HDD), `sc1` for Cold HDD,and `standard` for Magnetic volumes.
         *
         * If you specify the `io1` volume type, you must also specify a value for the `Iops` attribute. The maximum ratio of provisioned IOPS to requested volume size (in GiB) is 50:1. AWS uses the default volume size (in GiB) specified in the AMI attributes to set IOPS to 50 x (volume size).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-ebsblockdevice.html#cfn-opsworks-instance-ebsblockdevice-volumetype
         */
        readonly volumeType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EbsBlockDeviceProperty`
 *
 * @param properties - the TypeScript properties of a `EbsBlockDeviceProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstance_EbsBlockDevicePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deleteOnTermination', cdk.validateBoolean)(properties.deleteOnTermination));
    errors.collect(cdk.propertyValidator('iops', cdk.validateNumber)(properties.iops));
    errors.collect(cdk.propertyValidator('snapshotId', cdk.validateString)(properties.snapshotId));
    errors.collect(cdk.propertyValidator('volumeSize', cdk.validateNumber)(properties.volumeSize));
    errors.collect(cdk.propertyValidator('volumeType', cdk.validateString)(properties.volumeType));
    return errors.wrap('supplied properties not correct for "EbsBlockDeviceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Instance.EbsBlockDevice` resource
 *
 * @param properties - the TypeScript properties of a `EbsBlockDeviceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Instance.EbsBlockDevice` resource.
 */
// @ts-ignore TS6133
function cfnInstanceEbsBlockDevicePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstance_EbsBlockDevicePropertyValidator(properties).assertSuccess();
    return {
        DeleteOnTermination: cdk.booleanToCloudFormation(properties.deleteOnTermination),
        Iops: cdk.numberToCloudFormation(properties.iops),
        SnapshotId: cdk.stringToCloudFormation(properties.snapshotId),
        VolumeSize: cdk.numberToCloudFormation(properties.volumeSize),
        VolumeType: cdk.stringToCloudFormation(properties.volumeType),
    };
}

// @ts-ignore TS6133
function CfnInstanceEbsBlockDevicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.EbsBlockDeviceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.EbsBlockDeviceProperty>();
    ret.addPropertyResult('deleteOnTermination', 'DeleteOnTermination', properties.DeleteOnTermination != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteOnTermination) : undefined);
    ret.addPropertyResult('iops', 'Iops', properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined);
    ret.addPropertyResult('snapshotId', 'SnapshotId', properties.SnapshotId != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotId) : undefined);
    ret.addPropertyResult('volumeSize', 'VolumeSize', properties.VolumeSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumeSize) : undefined);
    ret.addPropertyResult('volumeType', 'VolumeType', properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstance {
    /**
     * Describes an instance's time-based auto scaling configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html
     */
    export interface TimeBasedAutoScalingProperty {
        /**
         * The schedule for Friday.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html#cfn-opsworks-instance-timebasedautoscaling-friday
         */
        readonly friday?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The schedule for Monday.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html#cfn-opsworks-instance-timebasedautoscaling-monday
         */
        readonly monday?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The schedule for Saturday.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html#cfn-opsworks-instance-timebasedautoscaling-saturday
         */
        readonly saturday?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The schedule for Sunday.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html#cfn-opsworks-instance-timebasedautoscaling-sunday
         */
        readonly sunday?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The schedule for Thursday.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html#cfn-opsworks-instance-timebasedautoscaling-thursday
         */
        readonly thursday?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The schedule for Tuesday.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html#cfn-opsworks-instance-timebasedautoscaling-tuesday
         */
        readonly tuesday?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The schedule for Wednesday.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html#cfn-opsworks-instance-timebasedautoscaling-wednesday
         */
        readonly wednesday?: { [key: string]: (string) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TimeBasedAutoScalingProperty`
 *
 * @param properties - the TypeScript properties of a `TimeBasedAutoScalingProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstance_TimeBasedAutoScalingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('friday', cdk.hashValidator(cdk.validateString))(properties.friday));
    errors.collect(cdk.propertyValidator('monday', cdk.hashValidator(cdk.validateString))(properties.monday));
    errors.collect(cdk.propertyValidator('saturday', cdk.hashValidator(cdk.validateString))(properties.saturday));
    errors.collect(cdk.propertyValidator('sunday', cdk.hashValidator(cdk.validateString))(properties.sunday));
    errors.collect(cdk.propertyValidator('thursday', cdk.hashValidator(cdk.validateString))(properties.thursday));
    errors.collect(cdk.propertyValidator('tuesday', cdk.hashValidator(cdk.validateString))(properties.tuesday));
    errors.collect(cdk.propertyValidator('wednesday', cdk.hashValidator(cdk.validateString))(properties.wednesday));
    return errors.wrap('supplied properties not correct for "TimeBasedAutoScalingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Instance.TimeBasedAutoScaling` resource
 *
 * @param properties - the TypeScript properties of a `TimeBasedAutoScalingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Instance.TimeBasedAutoScaling` resource.
 */
// @ts-ignore TS6133
function cfnInstanceTimeBasedAutoScalingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstance_TimeBasedAutoScalingPropertyValidator(properties).assertSuccess();
    return {
        Friday: cdk.hashMapper(cdk.stringToCloudFormation)(properties.friday),
        Monday: cdk.hashMapper(cdk.stringToCloudFormation)(properties.monday),
        Saturday: cdk.hashMapper(cdk.stringToCloudFormation)(properties.saturday),
        Sunday: cdk.hashMapper(cdk.stringToCloudFormation)(properties.sunday),
        Thursday: cdk.hashMapper(cdk.stringToCloudFormation)(properties.thursday),
        Tuesday: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tuesday),
        Wednesday: cdk.hashMapper(cdk.stringToCloudFormation)(properties.wednesday),
    };
}

// @ts-ignore TS6133
function CfnInstanceTimeBasedAutoScalingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.TimeBasedAutoScalingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.TimeBasedAutoScalingProperty>();
    ret.addPropertyResult('friday', 'Friday', properties.Friday != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Friday) : undefined);
    ret.addPropertyResult('monday', 'Monday', properties.Monday != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Monday) : undefined);
    ret.addPropertyResult('saturday', 'Saturday', properties.Saturday != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Saturday) : undefined);
    ret.addPropertyResult('sunday', 'Sunday', properties.Sunday != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Sunday) : undefined);
    ret.addPropertyResult('thursday', 'Thursday', properties.Thursday != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Thursday) : undefined);
    ret.addPropertyResult('tuesday', 'Tuesday', properties.Tuesday != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tuesday) : undefined);
    ret.addPropertyResult('wednesday', 'Wednesday', properties.Wednesday != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Wednesday) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnLayer`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html
 */
export interface CfnLayerProps {

    /**
     * Whether to automatically assign an [Elastic IP address](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html) to the layer's instances. For more information, see [How to Edit a Layer](https://docs.aws.amazon.com/opsworks/latest/userguide/workinglayers-basics-edit.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-autoassignelasticips
     */
    readonly autoAssignElasticIps: boolean | cdk.IResolvable;

    /**
     * For stacks that are running in a VPC, whether to automatically assign a public IP address to the layer's instances. For more information, see [How to Edit a Layer](https://docs.aws.amazon.com/opsworks/latest/userguide/workinglayers-basics-edit.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-autoassignpublicips
     */
    readonly autoAssignPublicIps: boolean | cdk.IResolvable;

    /**
     * Whether to disable auto healing for the layer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-enableautohealing
     */
    readonly enableAutoHealing: boolean | cdk.IResolvable;

    /**
     * The layer name, which is used by the console. Layer names can be a maximum of 32 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-name
     */
    readonly name: string;

    /**
     * For custom layers only, use this parameter to specify the layer's short name, which is used internally by AWS OpsWorks Stacks and by Chef recipes. The short name is also used as the name for the directory where your app files are installed. It can have a maximum of 32 characters, which are limited to the alphanumeric characters, '-', '_', and '.'.
     *
     * Built-in layer short names are defined by AWS OpsWorks Stacks. For more information, see the [Layer Reference](https://docs.aws.amazon.com/opsworks/latest/userguide/layers.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-shortname
     */
    readonly shortname: string;

    /**
     * The layer stack ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-stackid
     */
    readonly stackId: string;

    /**
     * The layer type. A stack cannot have more than one built-in layer of the same type. It can have any number of custom layers. Built-in layers are not available in Chef 12 stacks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-type
     */
    readonly type: string;

    /**
     * One or more user-defined key-value pairs to be added to the stack attributes.
     *
     * To create a cluster layer, set the `EcsClusterArn` attribute to the cluster's ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-attributes
     */
    readonly attributes?: { [key: string]: (string) } | cdk.IResolvable;

    /**
     * The ARN of an IAM profile to be used for the layer's EC2 instances. For more information about IAM ARNs, see [Using Identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-custominstanceprofilearn
     */
    readonly customInstanceProfileArn?: string;

    /**
     * A JSON-formatted string containing custom stack configuration and deployment attributes to be installed on the layer's instances. For more information, see [Using Custom JSON](https://docs.aws.amazon.com/opsworks/latest/userguide/workingcookbook-json-override.html) . This feature is supported as of version 1.7.42 of the AWS CLI .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-customjson
     */
    readonly customJson?: any | cdk.IResolvable;

    /**
     * A `LayerCustomRecipes` object that specifies the layer custom recipes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-customrecipes
     */
    readonly customRecipes?: CfnLayer.RecipesProperty | cdk.IResolvable;

    /**
     * An array containing the layer custom security group IDs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-customsecuritygroupids
     */
    readonly customSecurityGroupIds?: string[];

    /**
     * Whether to install operating system and package updates when the instance boots. The default value is `true` . To control when updates are installed, set this value to `false` . You must then update your instances manually by using [CreateDeployment](https://docs.aws.amazon.com/goto/WebAPI/opsworks-2013-02-18/CreateDeployment) to run the `update_dependencies` stack command or by manually running `yum` (Amazon Linux) or `apt-get` (Ubuntu) on the instances.
     *
     * > To ensure that your instances have the latest security updates, we strongly recommend using the default value of `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-installupdatesonboot
     */
    readonly installUpdatesOnBoot?: boolean | cdk.IResolvable;

    /**
     * A `LifeCycleEventConfiguration` object that you can use to configure the Shutdown event to specify an execution timeout and enable or disable Elastic Load Balancer connection draining.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-lifecycleeventconfiguration
     */
    readonly lifecycleEventConfiguration?: CfnLayer.LifecycleEventConfigurationProperty | cdk.IResolvable;

    /**
     * The load-based scaling configuration for the AWS OpsWorks layer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-loadbasedautoscaling
     */
    readonly loadBasedAutoScaling?: CfnLayer.LoadBasedAutoScalingProperty | cdk.IResolvable;

    /**
     * An array of `Package` objects that describes the layer packages.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-packages
     */
    readonly packages?: string[];

    /**
     * Specifies one or more sets of tags (key–value pairs) to associate with this AWS OpsWorks layer. Use tags to manage your resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * Whether to use Amazon EBS-optimized instances.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-useebsoptimizedinstances
     */
    readonly useEbsOptimizedInstances?: boolean | cdk.IResolvable;

    /**
     * A `VolumeConfigurations` object that describes the layer's Amazon EBS volumes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-volumeconfigurations
     */
    readonly volumeConfigurations?: Array<CfnLayer.VolumeConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnLayerProps`
 *
 * @param properties - the TypeScript properties of a `CfnLayerProps`
 *
 * @returns the result of the validation.
 */
function CfnLayerPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributes', cdk.hashValidator(cdk.validateString))(properties.attributes));
    errors.collect(cdk.propertyValidator('autoAssignElasticIps', cdk.requiredValidator)(properties.autoAssignElasticIps));
    errors.collect(cdk.propertyValidator('autoAssignElasticIps', cdk.validateBoolean)(properties.autoAssignElasticIps));
    errors.collect(cdk.propertyValidator('autoAssignPublicIps', cdk.requiredValidator)(properties.autoAssignPublicIps));
    errors.collect(cdk.propertyValidator('autoAssignPublicIps', cdk.validateBoolean)(properties.autoAssignPublicIps));
    errors.collect(cdk.propertyValidator('customInstanceProfileArn', cdk.validateString)(properties.customInstanceProfileArn));
    errors.collect(cdk.propertyValidator('customJson', cdk.validateObject)(properties.customJson));
    errors.collect(cdk.propertyValidator('customRecipes', CfnLayer_RecipesPropertyValidator)(properties.customRecipes));
    errors.collect(cdk.propertyValidator('customSecurityGroupIds', cdk.listValidator(cdk.validateString))(properties.customSecurityGroupIds));
    errors.collect(cdk.propertyValidator('enableAutoHealing', cdk.requiredValidator)(properties.enableAutoHealing));
    errors.collect(cdk.propertyValidator('enableAutoHealing', cdk.validateBoolean)(properties.enableAutoHealing));
    errors.collect(cdk.propertyValidator('installUpdatesOnBoot', cdk.validateBoolean)(properties.installUpdatesOnBoot));
    errors.collect(cdk.propertyValidator('lifecycleEventConfiguration', CfnLayer_LifecycleEventConfigurationPropertyValidator)(properties.lifecycleEventConfiguration));
    errors.collect(cdk.propertyValidator('loadBasedAutoScaling', CfnLayer_LoadBasedAutoScalingPropertyValidator)(properties.loadBasedAutoScaling));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('packages', cdk.listValidator(cdk.validateString))(properties.packages));
    errors.collect(cdk.propertyValidator('shortname', cdk.requiredValidator)(properties.shortname));
    errors.collect(cdk.propertyValidator('shortname', cdk.validateString)(properties.shortname));
    errors.collect(cdk.propertyValidator('stackId', cdk.requiredValidator)(properties.stackId));
    errors.collect(cdk.propertyValidator('stackId', cdk.validateString)(properties.stackId));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('useEbsOptimizedInstances', cdk.validateBoolean)(properties.useEbsOptimizedInstances));
    errors.collect(cdk.propertyValidator('volumeConfigurations', cdk.listValidator(CfnLayer_VolumeConfigurationPropertyValidator))(properties.volumeConfigurations));
    return errors.wrap('supplied properties not correct for "CfnLayerProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Layer` resource
 *
 * @param properties - the TypeScript properties of a `CfnLayerProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Layer` resource.
 */
// @ts-ignore TS6133
function cfnLayerPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLayerPropsValidator(properties).assertSuccess();
    return {
        AutoAssignElasticIps: cdk.booleanToCloudFormation(properties.autoAssignElasticIps),
        AutoAssignPublicIps: cdk.booleanToCloudFormation(properties.autoAssignPublicIps),
        EnableAutoHealing: cdk.booleanToCloudFormation(properties.enableAutoHealing),
        Name: cdk.stringToCloudFormation(properties.name),
        Shortname: cdk.stringToCloudFormation(properties.shortname),
        StackId: cdk.stringToCloudFormation(properties.stackId),
        Type: cdk.stringToCloudFormation(properties.type),
        Attributes: cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
        CustomInstanceProfileArn: cdk.stringToCloudFormation(properties.customInstanceProfileArn),
        CustomJson: cdk.objectToCloudFormation(properties.customJson),
        CustomRecipes: cfnLayerRecipesPropertyToCloudFormation(properties.customRecipes),
        CustomSecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.customSecurityGroupIds),
        InstallUpdatesOnBoot: cdk.booleanToCloudFormation(properties.installUpdatesOnBoot),
        LifecycleEventConfiguration: cfnLayerLifecycleEventConfigurationPropertyToCloudFormation(properties.lifecycleEventConfiguration),
        LoadBasedAutoScaling: cfnLayerLoadBasedAutoScalingPropertyToCloudFormation(properties.loadBasedAutoScaling),
        Packages: cdk.listMapper(cdk.stringToCloudFormation)(properties.packages),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        UseEbsOptimizedInstances: cdk.booleanToCloudFormation(properties.useEbsOptimizedInstances),
        VolumeConfigurations: cdk.listMapper(cfnLayerVolumeConfigurationPropertyToCloudFormation)(properties.volumeConfigurations),
    };
}

// @ts-ignore TS6133
function CfnLayerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLayerProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayerProps>();
    ret.addPropertyResult('autoAssignElasticIps', 'AutoAssignElasticIps', cfn_parse.FromCloudFormation.getBoolean(properties.AutoAssignElasticIps));
    ret.addPropertyResult('autoAssignPublicIps', 'AutoAssignPublicIps', cfn_parse.FromCloudFormation.getBoolean(properties.AutoAssignPublicIps));
    ret.addPropertyResult('enableAutoHealing', 'EnableAutoHealing', cfn_parse.FromCloudFormation.getBoolean(properties.EnableAutoHealing));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('shortname', 'Shortname', cfn_parse.FromCloudFormation.getString(properties.Shortname));
    ret.addPropertyResult('stackId', 'StackId', cfn_parse.FromCloudFormation.getString(properties.StackId));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('attributes', 'Attributes', properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined);
    ret.addPropertyResult('customInstanceProfileArn', 'CustomInstanceProfileArn', properties.CustomInstanceProfileArn != null ? cfn_parse.FromCloudFormation.getString(properties.CustomInstanceProfileArn) : undefined);
    ret.addPropertyResult('customJson', 'CustomJson', properties.CustomJson != null ? cfn_parse.FromCloudFormation.getAny(properties.CustomJson) : undefined);
    ret.addPropertyResult('customRecipes', 'CustomRecipes', properties.CustomRecipes != null ? CfnLayerRecipesPropertyFromCloudFormation(properties.CustomRecipes) : undefined);
    ret.addPropertyResult('customSecurityGroupIds', 'CustomSecurityGroupIds', properties.CustomSecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CustomSecurityGroupIds) : undefined);
    ret.addPropertyResult('installUpdatesOnBoot', 'InstallUpdatesOnBoot', properties.InstallUpdatesOnBoot != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InstallUpdatesOnBoot) : undefined);
    ret.addPropertyResult('lifecycleEventConfiguration', 'LifecycleEventConfiguration', properties.LifecycleEventConfiguration != null ? CfnLayerLifecycleEventConfigurationPropertyFromCloudFormation(properties.LifecycleEventConfiguration) : undefined);
    ret.addPropertyResult('loadBasedAutoScaling', 'LoadBasedAutoScaling', properties.LoadBasedAutoScaling != null ? CfnLayerLoadBasedAutoScalingPropertyFromCloudFormation(properties.LoadBasedAutoScaling) : undefined);
    ret.addPropertyResult('packages', 'Packages', properties.Packages != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Packages) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('useEbsOptimizedInstances', 'UseEbsOptimizedInstances', properties.UseEbsOptimizedInstances != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseEbsOptimizedInstances) : undefined);
    ret.addPropertyResult('volumeConfigurations', 'VolumeConfigurations', properties.VolumeConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnLayerVolumeConfigurationPropertyFromCloudFormation)(properties.VolumeConfigurations) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::OpsWorks::Layer`
 *
 * Creates a layer. For more information, see [How to Create a Layer](https://docs.aws.amazon.com/opsworks/latest/userguide/workinglayers-basics-create.html) .
 *
 * > You should use *CreateLayer* for noncustom layer types such as PHP App Server only if the stack does not have an existing layer of that type. A stack can have at most one instance of each noncustom layer; if you attempt to create a second instance, *CreateLayer* fails. A stack can have an arbitrary number of custom layers, so you can call *CreateLayer* as many times as you like for that layer type.
 *
 * *Required Permissions* : To use this action, an IAM user must have a Manage permissions level for the stack, or an attached policy that explicitly grants permissions. For more information on user permissions, see [Managing User Permissions](https://docs.aws.amazon.com/opsworks/latest/userguide/opsworks-security-users.html) .
 *
 * @cloudformationResource AWS::OpsWorks::Layer
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html
 */
export class CfnLayer extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::OpsWorks::Layer";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLayer {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLayerPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLayer(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Whether to automatically assign an [Elastic IP address](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html) to the layer's instances. For more information, see [How to Edit a Layer](https://docs.aws.amazon.com/opsworks/latest/userguide/workinglayers-basics-edit.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-autoassignelasticips
     */
    public autoAssignElasticIps: boolean | cdk.IResolvable;

    /**
     * For stacks that are running in a VPC, whether to automatically assign a public IP address to the layer's instances. For more information, see [How to Edit a Layer](https://docs.aws.amazon.com/opsworks/latest/userguide/workinglayers-basics-edit.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-autoassignpublicips
     */
    public autoAssignPublicIps: boolean | cdk.IResolvable;

    /**
     * Whether to disable auto healing for the layer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-enableautohealing
     */
    public enableAutoHealing: boolean | cdk.IResolvable;

    /**
     * The layer name, which is used by the console. Layer names can be a maximum of 32 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-name
     */
    public name: string;

    /**
     * For custom layers only, use this parameter to specify the layer's short name, which is used internally by AWS OpsWorks Stacks and by Chef recipes. The short name is also used as the name for the directory where your app files are installed. It can have a maximum of 32 characters, which are limited to the alphanumeric characters, '-', '_', and '.'.
     *
     * Built-in layer short names are defined by AWS OpsWorks Stacks. For more information, see the [Layer Reference](https://docs.aws.amazon.com/opsworks/latest/userguide/layers.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-shortname
     */
    public shortname: string;

    /**
     * The layer stack ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-stackid
     */
    public stackId: string;

    /**
     * The layer type. A stack cannot have more than one built-in layer of the same type. It can have any number of custom layers. Built-in layers are not available in Chef 12 stacks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-type
     */
    public type: string;

    /**
     * One or more user-defined key-value pairs to be added to the stack attributes.
     *
     * To create a cluster layer, set the `EcsClusterArn` attribute to the cluster's ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-attributes
     */
    public attributes: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * The ARN of an IAM profile to be used for the layer's EC2 instances. For more information about IAM ARNs, see [Using Identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-custominstanceprofilearn
     */
    public customInstanceProfileArn: string | undefined;

    /**
     * A JSON-formatted string containing custom stack configuration and deployment attributes to be installed on the layer's instances. For more information, see [Using Custom JSON](https://docs.aws.amazon.com/opsworks/latest/userguide/workingcookbook-json-override.html) . This feature is supported as of version 1.7.42 of the AWS CLI .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-customjson
     */
    public customJson: any | cdk.IResolvable | undefined;

    /**
     * A `LayerCustomRecipes` object that specifies the layer custom recipes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-customrecipes
     */
    public customRecipes: CfnLayer.RecipesProperty | cdk.IResolvable | undefined;

    /**
     * An array containing the layer custom security group IDs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-customsecuritygroupids
     */
    public customSecurityGroupIds: string[] | undefined;

    /**
     * Whether to install operating system and package updates when the instance boots. The default value is `true` . To control when updates are installed, set this value to `false` . You must then update your instances manually by using [CreateDeployment](https://docs.aws.amazon.com/goto/WebAPI/opsworks-2013-02-18/CreateDeployment) to run the `update_dependencies` stack command or by manually running `yum` (Amazon Linux) or `apt-get` (Ubuntu) on the instances.
     *
     * > To ensure that your instances have the latest security updates, we strongly recommend using the default value of `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-installupdatesonboot
     */
    public installUpdatesOnBoot: boolean | cdk.IResolvable | undefined;

    /**
     * A `LifeCycleEventConfiguration` object that you can use to configure the Shutdown event to specify an execution timeout and enable or disable Elastic Load Balancer connection draining.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-lifecycleeventconfiguration
     */
    public lifecycleEventConfiguration: CfnLayer.LifecycleEventConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The load-based scaling configuration for the AWS OpsWorks layer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-loadbasedautoscaling
     */
    public loadBasedAutoScaling: CfnLayer.LoadBasedAutoScalingProperty | cdk.IResolvable | undefined;

    /**
     * An array of `Package` objects that describes the layer packages.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-packages
     */
    public packages: string[] | undefined;

    /**
     * Specifies one or more sets of tags (key–value pairs) to associate with this AWS OpsWorks layer. Use tags to manage your resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Whether to use Amazon EBS-optimized instances.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-useebsoptimizedinstances
     */
    public useEbsOptimizedInstances: boolean | cdk.IResolvable | undefined;

    /**
     * A `VolumeConfigurations` object that describes the layer's Amazon EBS volumes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-volumeconfigurations
     */
    public volumeConfigurations: Array<CfnLayer.VolumeConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::OpsWorks::Layer`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLayerProps) {
        super(scope, id, { type: CfnLayer.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'autoAssignElasticIps', this);
        cdk.requireProperty(props, 'autoAssignPublicIps', this);
        cdk.requireProperty(props, 'enableAutoHealing', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'shortname', this);
        cdk.requireProperty(props, 'stackId', this);
        cdk.requireProperty(props, 'type', this);

        this.autoAssignElasticIps = props.autoAssignElasticIps;
        this.autoAssignPublicIps = props.autoAssignPublicIps;
        this.enableAutoHealing = props.enableAutoHealing;
        this.name = props.name;
        this.shortname = props.shortname;
        this.stackId = props.stackId;
        this.type = props.type;
        this.attributes = props.attributes;
        this.customInstanceProfileArn = props.customInstanceProfileArn;
        this.customJson = props.customJson;
        this.customRecipes = props.customRecipes;
        this.customSecurityGroupIds = props.customSecurityGroupIds;
        this.installUpdatesOnBoot = props.installUpdatesOnBoot;
        this.lifecycleEventConfiguration = props.lifecycleEventConfiguration;
        this.loadBasedAutoScaling = props.loadBasedAutoScaling;
        this.packages = props.packages;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::OpsWorks::Layer", props.tags, { tagPropertyName: 'tags' });
        this.useEbsOptimizedInstances = props.useEbsOptimizedInstances;
        this.volumeConfigurations = props.volumeConfigurations;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLayer.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            autoAssignElasticIps: this.autoAssignElasticIps,
            autoAssignPublicIps: this.autoAssignPublicIps,
            enableAutoHealing: this.enableAutoHealing,
            name: this.name,
            shortname: this.shortname,
            stackId: this.stackId,
            type: this.type,
            attributes: this.attributes,
            customInstanceProfileArn: this.customInstanceProfileArn,
            customJson: this.customJson,
            customRecipes: this.customRecipes,
            customSecurityGroupIds: this.customSecurityGroupIds,
            installUpdatesOnBoot: this.installUpdatesOnBoot,
            lifecycleEventConfiguration: this.lifecycleEventConfiguration,
            loadBasedAutoScaling: this.loadBasedAutoScaling,
            packages: this.packages,
            tags: this.tags.renderTags(),
            useEbsOptimizedInstances: this.useEbsOptimizedInstances,
            volumeConfigurations: this.volumeConfigurations,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLayerPropsToCloudFormation(props);
    }
}

export namespace CfnLayer {
    /**
     * Describes a load-based auto scaling upscaling or downscaling threshold configuration, which specifies when AWS OpsWorks Stacks starts or stops load-based instances.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling-autoscalingthresholds.html
     */
    export interface AutoScalingThresholdsProperty {
        /**
         * The CPU utilization threshold, as a percent of the available CPU. A value of -1 disables the threshold.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling-autoscalingthresholds.html#cfn-opsworks-layer-loadbasedautoscaling-autoscalingthresholds-cputhreshold
         */
        readonly cpuThreshold?: number;
        /**
         * The amount of time (in minutes) after a scaling event occurs that AWS OpsWorks Stacks should ignore metrics and suppress additional scaling events. For example, AWS OpsWorks Stacks adds new instances following an upscaling event but the instances won't start reducing the load until they have been booted and configured. There is no point in raising additional scaling events during that operation, which typically takes several minutes. `IgnoreMetricsTime` allows you to direct AWS OpsWorks Stacks to suppress scaling events long enough to get the new instances online.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling-autoscalingthresholds.html#cfn-opsworks-layer-loadbasedautoscaling-autoscalingthresholds-ignoremetricstime
         */
        readonly ignoreMetricsTime?: number;
        /**
         * The number of instances to add or remove when the load exceeds a threshold.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling-autoscalingthresholds.html#cfn-opsworks-layer-loadbasedautoscaling-autoscalingthresholds-instancecount
         */
        readonly instanceCount?: number;
        /**
         * The load threshold. A value of -1 disables the threshold. For more information about how load is computed, see [Load (computing)](https://docs.aws.amazon.com/http://en.wikipedia.org/wiki/Load_%28computing%29) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling-autoscalingthresholds.html#cfn-opsworks-layer-loadbasedautoscaling-autoscalingthresholds-loadthreshold
         */
        readonly loadThreshold?: number;
        /**
         * The memory utilization threshold, as a percent of the available memory. A value of -1 disables the threshold.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling-autoscalingthresholds.html#cfn-opsworks-layer-loadbasedautoscaling-autoscalingthresholds-memorythreshold
         */
        readonly memoryThreshold?: number;
        /**
         * The amount of time, in minutes, that the load must exceed a threshold before more instances are added or removed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling-autoscalingthresholds.html#cfn-opsworks-layer-loadbasedautoscaling-autoscalingthresholds-thresholdwaittime
         */
        readonly thresholdsWaitTime?: number;
    }
}

/**
 * Determine whether the given properties match those of a `AutoScalingThresholdsProperty`
 *
 * @param properties - the TypeScript properties of a `AutoScalingThresholdsProperty`
 *
 * @returns the result of the validation.
 */
function CfnLayer_AutoScalingThresholdsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cpuThreshold', cdk.validateNumber)(properties.cpuThreshold));
    errors.collect(cdk.propertyValidator('ignoreMetricsTime', cdk.validateNumber)(properties.ignoreMetricsTime));
    errors.collect(cdk.propertyValidator('instanceCount', cdk.validateNumber)(properties.instanceCount));
    errors.collect(cdk.propertyValidator('loadThreshold', cdk.validateNumber)(properties.loadThreshold));
    errors.collect(cdk.propertyValidator('memoryThreshold', cdk.validateNumber)(properties.memoryThreshold));
    errors.collect(cdk.propertyValidator('thresholdsWaitTime', cdk.validateNumber)(properties.thresholdsWaitTime));
    return errors.wrap('supplied properties not correct for "AutoScalingThresholdsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Layer.AutoScalingThresholds` resource
 *
 * @param properties - the TypeScript properties of a `AutoScalingThresholdsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Layer.AutoScalingThresholds` resource.
 */
// @ts-ignore TS6133
function cfnLayerAutoScalingThresholdsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLayer_AutoScalingThresholdsPropertyValidator(properties).assertSuccess();
    return {
        CpuThreshold: cdk.numberToCloudFormation(properties.cpuThreshold),
        IgnoreMetricsTime: cdk.numberToCloudFormation(properties.ignoreMetricsTime),
        InstanceCount: cdk.numberToCloudFormation(properties.instanceCount),
        LoadThreshold: cdk.numberToCloudFormation(properties.loadThreshold),
        MemoryThreshold: cdk.numberToCloudFormation(properties.memoryThreshold),
        ThresholdsWaitTime: cdk.numberToCloudFormation(properties.thresholdsWaitTime),
    };
}

// @ts-ignore TS6133
function CfnLayerAutoScalingThresholdsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLayer.AutoScalingThresholdsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayer.AutoScalingThresholdsProperty>();
    ret.addPropertyResult('cpuThreshold', 'CpuThreshold', properties.CpuThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.CpuThreshold) : undefined);
    ret.addPropertyResult('ignoreMetricsTime', 'IgnoreMetricsTime', properties.IgnoreMetricsTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.IgnoreMetricsTime) : undefined);
    ret.addPropertyResult('instanceCount', 'InstanceCount', properties.InstanceCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.InstanceCount) : undefined);
    ret.addPropertyResult('loadThreshold', 'LoadThreshold', properties.LoadThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.LoadThreshold) : undefined);
    ret.addPropertyResult('memoryThreshold', 'MemoryThreshold', properties.MemoryThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.MemoryThreshold) : undefined);
    ret.addPropertyResult('thresholdsWaitTime', 'ThresholdsWaitTime', properties.ThresholdsWaitTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThresholdsWaitTime) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLayer {
    /**
     * Specifies the lifecycle event configuration
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-lifecycleeventconfiguration.html
     */
    export interface LifecycleEventConfigurationProperty {
        /**
         * The Shutdown event configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-lifecycleeventconfiguration.html#cfn-opsworks-layer-lifecycleconfiguration-shutdowneventconfiguration
         */
        readonly shutdownEventConfiguration?: CfnLayer.ShutdownEventConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LifecycleEventConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LifecycleEventConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnLayer_LifecycleEventConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('shutdownEventConfiguration', CfnLayer_ShutdownEventConfigurationPropertyValidator)(properties.shutdownEventConfiguration));
    return errors.wrap('supplied properties not correct for "LifecycleEventConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Layer.LifecycleEventConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LifecycleEventConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Layer.LifecycleEventConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnLayerLifecycleEventConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLayer_LifecycleEventConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ShutdownEventConfiguration: cfnLayerShutdownEventConfigurationPropertyToCloudFormation(properties.shutdownEventConfiguration),
    };
}

// @ts-ignore TS6133
function CfnLayerLifecycleEventConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLayer.LifecycleEventConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayer.LifecycleEventConfigurationProperty>();
    ret.addPropertyResult('shutdownEventConfiguration', 'ShutdownEventConfiguration', properties.ShutdownEventConfiguration != null ? CfnLayerShutdownEventConfigurationPropertyFromCloudFormation(properties.ShutdownEventConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLayer {
    /**
     * Describes a layer's load-based auto scaling configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html
     */
    export interface LoadBasedAutoScalingProperty {
        /**
         * An `AutoScalingThresholds` object that describes the downscaling configuration, which defines how and when AWS OpsWorks Stacks reduces the number of instances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html#cfn-opsworks-layer-loadbasedautoscaling-downscaling
         */
        readonly downScaling?: CfnLayer.AutoScalingThresholdsProperty | cdk.IResolvable;
        /**
         * Whether load-based auto scaling is enabled for the layer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html#cfn-opsworks-layer-loadbasedautoscaling-enable
         */
        readonly enable?: boolean | cdk.IResolvable;
        /**
         * An `AutoScalingThresholds` object that describes the upscaling configuration, which defines how and when AWS OpsWorks Stacks increases the number of instances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html#cfn-opsworks-layer-loadbasedautoscaling-upscaling
         */
        readonly upScaling?: CfnLayer.AutoScalingThresholdsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LoadBasedAutoScalingProperty`
 *
 * @param properties - the TypeScript properties of a `LoadBasedAutoScalingProperty`
 *
 * @returns the result of the validation.
 */
function CfnLayer_LoadBasedAutoScalingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('downScaling', CfnLayer_AutoScalingThresholdsPropertyValidator)(properties.downScaling));
    errors.collect(cdk.propertyValidator('enable', cdk.validateBoolean)(properties.enable));
    errors.collect(cdk.propertyValidator('upScaling', CfnLayer_AutoScalingThresholdsPropertyValidator)(properties.upScaling));
    return errors.wrap('supplied properties not correct for "LoadBasedAutoScalingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Layer.LoadBasedAutoScaling` resource
 *
 * @param properties - the TypeScript properties of a `LoadBasedAutoScalingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Layer.LoadBasedAutoScaling` resource.
 */
// @ts-ignore TS6133
function cfnLayerLoadBasedAutoScalingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLayer_LoadBasedAutoScalingPropertyValidator(properties).assertSuccess();
    return {
        DownScaling: cfnLayerAutoScalingThresholdsPropertyToCloudFormation(properties.downScaling),
        Enable: cdk.booleanToCloudFormation(properties.enable),
        UpScaling: cfnLayerAutoScalingThresholdsPropertyToCloudFormation(properties.upScaling),
    };
}

// @ts-ignore TS6133
function CfnLayerLoadBasedAutoScalingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLayer.LoadBasedAutoScalingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayer.LoadBasedAutoScalingProperty>();
    ret.addPropertyResult('downScaling', 'DownScaling', properties.DownScaling != null ? CfnLayerAutoScalingThresholdsPropertyFromCloudFormation(properties.DownScaling) : undefined);
    ret.addPropertyResult('enable', 'Enable', properties.Enable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enable) : undefined);
    ret.addPropertyResult('upScaling', 'UpScaling', properties.UpScaling != null ? CfnLayerAutoScalingThresholdsPropertyFromCloudFormation(properties.UpScaling) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLayer {
    /**
     * AWS OpsWorks Stacks supports five lifecycle events: *setup* , *configuration* , *deploy* , *undeploy* , and *shutdown* . For each layer, AWS OpsWorks Stacks runs a set of standard recipes for each event. In addition, you can provide custom recipes for any or all layers and events. AWS OpsWorks Stacks runs custom event recipes after the standard recipes. `LayerCustomRecipes` specifies the custom recipes for a particular layer to be run in response to each of the five events.
     *
     * To specify a recipe, use the cookbook's directory name in the repository followed by two colons and the recipe name, which is the recipe's file name without the .rb extension. For example: phpapp2::dbsetup specifies the dbsetup.rb recipe in the repository's phpapp2 folder.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-recipes.html
     */
    export interface RecipesProperty {
        /**
         * An array of custom recipe names to be run following a `configure` event.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-recipes.html#cfn-opsworks-layer-customrecipes-configure
         */
        readonly configure?: string[];
        /**
         * An array of custom recipe names to be run following a `deploy` event.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-recipes.html#cfn-opsworks-layer-customrecipes-deploy
         */
        readonly deploy?: string[];
        /**
         * An array of custom recipe names to be run following a `setup` event.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-recipes.html#cfn-opsworks-layer-customrecipes-setup
         */
        readonly setup?: string[];
        /**
         * An array of custom recipe names to be run following a `shutdown` event.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-recipes.html#cfn-opsworks-layer-customrecipes-shutdown
         */
        readonly shutdown?: string[];
        /**
         * An array of custom recipe names to be run following a `undeploy` event.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-recipes.html#cfn-opsworks-layer-customrecipes-undeploy
         */
        readonly undeploy?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `RecipesProperty`
 *
 * @param properties - the TypeScript properties of a `RecipesProperty`
 *
 * @returns the result of the validation.
 */
function CfnLayer_RecipesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('configure', cdk.listValidator(cdk.validateString))(properties.configure));
    errors.collect(cdk.propertyValidator('deploy', cdk.listValidator(cdk.validateString))(properties.deploy));
    errors.collect(cdk.propertyValidator('setup', cdk.listValidator(cdk.validateString))(properties.setup));
    errors.collect(cdk.propertyValidator('shutdown', cdk.listValidator(cdk.validateString))(properties.shutdown));
    errors.collect(cdk.propertyValidator('undeploy', cdk.listValidator(cdk.validateString))(properties.undeploy));
    return errors.wrap('supplied properties not correct for "RecipesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Layer.Recipes` resource
 *
 * @param properties - the TypeScript properties of a `RecipesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Layer.Recipes` resource.
 */
// @ts-ignore TS6133
function cfnLayerRecipesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLayer_RecipesPropertyValidator(properties).assertSuccess();
    return {
        Configure: cdk.listMapper(cdk.stringToCloudFormation)(properties.configure),
        Deploy: cdk.listMapper(cdk.stringToCloudFormation)(properties.deploy),
        Setup: cdk.listMapper(cdk.stringToCloudFormation)(properties.setup),
        Shutdown: cdk.listMapper(cdk.stringToCloudFormation)(properties.shutdown),
        Undeploy: cdk.listMapper(cdk.stringToCloudFormation)(properties.undeploy),
    };
}

// @ts-ignore TS6133
function CfnLayerRecipesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLayer.RecipesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayer.RecipesProperty>();
    ret.addPropertyResult('configure', 'Configure', properties.Configure != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Configure) : undefined);
    ret.addPropertyResult('deploy', 'Deploy', properties.Deploy != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Deploy) : undefined);
    ret.addPropertyResult('setup', 'Setup', properties.Setup != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Setup) : undefined);
    ret.addPropertyResult('shutdown', 'Shutdown', properties.Shutdown != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Shutdown) : undefined);
    ret.addPropertyResult('undeploy', 'Undeploy', properties.Undeploy != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Undeploy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLayer {
    /**
     * The Shutdown event configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-lifecycleeventconfiguration-shutdowneventconfiguration.html
     */
    export interface ShutdownEventConfigurationProperty {
        /**
         * Whether to enable Elastic Load Balancing connection draining. For more information, see [Connection Draining](https://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/TerminologyandKeyConcepts.html#conn-drain)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-lifecycleeventconfiguration-shutdowneventconfiguration.html#cfn-opsworks-layer-lifecycleconfiguration-shutdowneventconfiguration-delayuntilelbconnectionsdrained
         */
        readonly delayUntilElbConnectionsDrained?: boolean | cdk.IResolvable;
        /**
         * The time, in seconds, that AWS OpsWorks Stacks waits after triggering a Shutdown event before shutting down an instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-lifecycleeventconfiguration-shutdowneventconfiguration.html#cfn-opsworks-layer-lifecycleconfiguration-shutdowneventconfiguration-executiontimeout
         */
        readonly executionTimeout?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ShutdownEventConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ShutdownEventConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnLayer_ShutdownEventConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('delayUntilElbConnectionsDrained', cdk.validateBoolean)(properties.delayUntilElbConnectionsDrained));
    errors.collect(cdk.propertyValidator('executionTimeout', cdk.validateNumber)(properties.executionTimeout));
    return errors.wrap('supplied properties not correct for "ShutdownEventConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Layer.ShutdownEventConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ShutdownEventConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Layer.ShutdownEventConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnLayerShutdownEventConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLayer_ShutdownEventConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DelayUntilElbConnectionsDrained: cdk.booleanToCloudFormation(properties.delayUntilElbConnectionsDrained),
        ExecutionTimeout: cdk.numberToCloudFormation(properties.executionTimeout),
    };
}

// @ts-ignore TS6133
function CfnLayerShutdownEventConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLayer.ShutdownEventConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayer.ShutdownEventConfigurationProperty>();
    ret.addPropertyResult('delayUntilElbConnectionsDrained', 'DelayUntilElbConnectionsDrained', properties.DelayUntilElbConnectionsDrained != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DelayUntilElbConnectionsDrained) : undefined);
    ret.addPropertyResult('executionTimeout', 'ExecutionTimeout', properties.ExecutionTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.ExecutionTimeout) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLayer {
    /**
     * Describes an Amazon EBS volume configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html
     */
    export interface VolumeConfigurationProperty {
        /**
         * Specifies whether an Amazon EBS volume is encrypted. For more information, see [Amazon EBS Encryption](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volumeconfiguration-encrypted
         */
        readonly encrypted?: boolean | cdk.IResolvable;
        /**
         * The number of I/O operations per second (IOPS) to provision for the volume. For PIOPS volumes, the IOPS per disk.
         *
         * If you specify `io1` for the volume type, you must specify this property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volconfig-iops
         */
        readonly iops?: number;
        /**
         * The volume mount point. For example "/dev/sdh".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volconfig-mountpoint
         */
        readonly mountPoint?: string;
        /**
         * The number of disks in the volume.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volconfig-numberofdisks
         */
        readonly numberOfDisks?: number;
        /**
         * The volume [RAID level](https://docs.aws.amazon.com/http://en.wikipedia.org/wiki/Standard_RAID_levels) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volconfig-raidlevel
         */
        readonly raidLevel?: number;
        /**
         * The volume size.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volconfig-size
         */
        readonly size?: number;
        /**
         * The volume type. For more information, see [Amazon EBS Volume Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html) .
         *
         * - `standard` - Magnetic. Magnetic volumes must have a minimum size of 1 GiB and a maximum size of 1024 GiB.
         * - `io1` - Provisioned IOPS (SSD). PIOPS volumes must have a minimum size of 4 GiB and a maximum size of 16384 GiB.
         * - `gp2` - General Purpose (SSD). General purpose volumes must have a minimum size of 1 GiB and a maximum size of 16384 GiB.
         * - `st1` - Throughput Optimized hard disk drive (HDD). Throughput optimized HDD volumes must have a minimum size of 500 GiB and a maximum size of 16384 GiB.
         * - `sc1` - Cold HDD. Cold HDD volumes must have a minimum size of 500 GiB and a maximum size of 16384 GiB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volconfig-volumetype
         */
        readonly volumeType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `VolumeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VolumeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnLayer_VolumeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encrypted', cdk.validateBoolean)(properties.encrypted));
    errors.collect(cdk.propertyValidator('iops', cdk.validateNumber)(properties.iops));
    errors.collect(cdk.propertyValidator('mountPoint', cdk.validateString)(properties.mountPoint));
    errors.collect(cdk.propertyValidator('numberOfDisks', cdk.validateNumber)(properties.numberOfDisks));
    errors.collect(cdk.propertyValidator('raidLevel', cdk.validateNumber)(properties.raidLevel));
    errors.collect(cdk.propertyValidator('size', cdk.validateNumber)(properties.size));
    errors.collect(cdk.propertyValidator('volumeType', cdk.validateString)(properties.volumeType));
    return errors.wrap('supplied properties not correct for "VolumeConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Layer.VolumeConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `VolumeConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Layer.VolumeConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnLayerVolumeConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLayer_VolumeConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Encrypted: cdk.booleanToCloudFormation(properties.encrypted),
        Iops: cdk.numberToCloudFormation(properties.iops),
        MountPoint: cdk.stringToCloudFormation(properties.mountPoint),
        NumberOfDisks: cdk.numberToCloudFormation(properties.numberOfDisks),
        RaidLevel: cdk.numberToCloudFormation(properties.raidLevel),
        Size: cdk.numberToCloudFormation(properties.size),
        VolumeType: cdk.stringToCloudFormation(properties.volumeType),
    };
}

// @ts-ignore TS6133
function CfnLayerVolumeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLayer.VolumeConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayer.VolumeConfigurationProperty>();
    ret.addPropertyResult('encrypted', 'Encrypted', properties.Encrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Encrypted) : undefined);
    ret.addPropertyResult('iops', 'Iops', properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined);
    ret.addPropertyResult('mountPoint', 'MountPoint', properties.MountPoint != null ? cfn_parse.FromCloudFormation.getString(properties.MountPoint) : undefined);
    ret.addPropertyResult('numberOfDisks', 'NumberOfDisks', properties.NumberOfDisks != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfDisks) : undefined);
    ret.addPropertyResult('raidLevel', 'RaidLevel', properties.RaidLevel != null ? cfn_parse.FromCloudFormation.getNumber(properties.RaidLevel) : undefined);
    ret.addPropertyResult('size', 'Size', properties.Size != null ? cfn_parse.FromCloudFormation.getNumber(properties.Size) : undefined);
    ret.addPropertyResult('volumeType', 'VolumeType', properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnStack`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html
 */
export interface CfnStackProps {

    /**
     * The Amazon Resource Name (ARN) of an IAM profile that is the default profile for all of the stack's EC2 instances. For more information about IAM ARNs, see [Using Identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultinstanceprof
     */
    readonly defaultInstanceProfileArn: string;

    /**
     * The stack name. Stack names can be a maximum of 64 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-name
     */
    readonly name: string;

    /**
     * The stack's IAM role, which allows AWS OpsWorks Stacks to work with AWS resources on your behalf. You must set this parameter to the Amazon Resource Name (ARN) for an existing IAM role. For more information about IAM ARNs, see [Using Identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-servicerolearn
     */
    readonly serviceRoleArn: string;

    /**
     * The default AWS OpsWorks Stacks agent version. You have the following options:
     *
     * - Auto-update - Set this parameter to `LATEST` . AWS OpsWorks Stacks automatically installs new agent versions on the stack's instances as soon as they are available.
     * - Fixed version - Set this parameter to your preferred agent version. To update the agent version, you must edit the stack configuration and specify a new version. AWS OpsWorks Stacks installs that version on the stack's instances.
     *
     * The default setting is the most recent release of the agent. To specify an agent version, you must use the complete version number, not the abbreviated number shown on the console. For a list of available agent version numbers, call [DescribeAgentVersions](https://docs.aws.amazon.com/goto/WebAPI/opsworks-2013-02-18/DescribeAgentVersions) . AgentVersion cannot be set to Chef 12.2.
     *
     * > You can also specify an agent version when you create or update an instance, which overrides the stack's default setting.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-agentversion
     */
    readonly agentVersion?: string;

    /**
     * One or more user-defined key-value pairs to be added to the stack attributes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-attributes
     */
    readonly attributes?: { [key: string]: (string) } | cdk.IResolvable;

    /**
     * A `ChefConfiguration` object that specifies whether to enable Berkshelf and the Berkshelf version on Chef 11.10 stacks. For more information, see [Create a New Stack](https://docs.aws.amazon.com/opsworks/latest/userguide/workingstacks-creating.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-chefconfiguration
     */
    readonly chefConfiguration?: CfnStack.ChefConfigurationProperty | cdk.IResolvable;

    /**
     * If you're cloning an AWS OpsWorks stack, a list of AWS OpsWorks application stack IDs from the source stack to include in the cloned stack.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-cloneappids
     */
    readonly cloneAppIds?: string[];

    /**
     * If you're cloning an AWS OpsWorks stack, indicates whether to clone the source stack's permissions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-clonepermissions
     */
    readonly clonePermissions?: boolean | cdk.IResolvable;

    /**
     * The configuration manager. When you create a stack we recommend that you use the configuration manager to specify the Chef version: 12, 11.10, or 11.4 for Linux stacks, or 12.2 for Windows stacks. The default value for Linux stacks is currently 12.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-configmanager
     */
    readonly configurationManager?: CfnStack.StackConfigurationManagerProperty | cdk.IResolvable;

    /**
     * Contains the information required to retrieve an app or cookbook from a repository. For more information, see [Adding Apps](https://docs.aws.amazon.com/opsworks/latest/userguide/workingapps-creating.html) or [Cookbooks and Recipes](https://docs.aws.amazon.com/opsworks/latest/userguide/workingcookbook.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-custcookbooksource
     */
    readonly customCookbooksSource?: CfnStack.SourceProperty | cdk.IResolvable;

    /**
     * A string that contains user-defined, custom JSON. It can be used to override the corresponding default stack configuration attribute values or to pass data to recipes. The string should be in the following format:
     *
     * `"{\"key1\": \"value1\", \"key2\": \"value2\",...}"`
     *
     * For more information about custom JSON, see [Use Custom JSON to Modify the Stack Configuration Attributes](https://docs.aws.amazon.com/opsworks/latest/userguide/workingstacks-json.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-custjson
     */
    readonly customJson?: any | cdk.IResolvable;

    /**
     * The stack's default Availability Zone, which must be in the specified region. For more information, see [Regions and Endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html) . If you also specify a value for `DefaultSubnetId` , the subnet must be in the same zone. For more information, see the `VpcId` parameter description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultaz
     */
    readonly defaultAvailabilityZone?: string;

    /**
     * The stack's default operating system, which is installed on every instance unless you specify a different operating system when you create the instance. You can specify one of the following.
     *
     * - A supported Linux operating system: An Amazon Linux version, such as `Amazon Linux 2` , `Amazon Linux 2018.03` , `Amazon Linux 2017.09` , `Amazon Linux 2017.03` , `Amazon Linux 2016.09` , `Amazon Linux 2016.03` , `Amazon Linux 2015.09` , or `Amazon Linux 2015.03` .
     * - A supported Ubuntu operating system, such as `Ubuntu 18.04 LTS` , `Ubuntu 16.04 LTS` , `Ubuntu 14.04 LTS` , or `Ubuntu 12.04 LTS` .
     * - `CentOS Linux 7`
     * - `Red Hat Enterprise Linux 7`
     * - A supported Windows operating system, such as `Microsoft Windows Server 2012 R2 Base` , `Microsoft Windows Server 2012 R2 with SQL Server Express` , `Microsoft Windows Server 2012 R2 with SQL Server Standard` , or `Microsoft Windows Server 2012 R2 with SQL Server Web` .
     * - A custom AMI: `Custom` . You specify the custom AMI you want to use when you create instances. For more information, see [Using Custom AMIs](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-custom-ami.html) .
     *
     * The default option is the current Amazon Linux version. Not all operating systems are supported with all versions of Chef. For more information about supported operating systems, see [AWS OpsWorks Stacks Operating Systems](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-os.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultos
     */
    readonly defaultOs?: string;

    /**
     * The default root device type. This value is the default for all instances in the stack, but you can override it when you create an instance. The default option is `instance-store` . For more information, see [Storage for the Root Device](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ComponentsAMIs.html#storage-for-the-root-device) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultrootdevicetype
     */
    readonly defaultRootDeviceType?: string;

    /**
     * A default Amazon EC2 key pair name. The default value is none. If you specify a key pair name, AWS OpsWorks installs the public key on the instance and you can use the private key with an SSH client to log in to the instance. For more information, see [Using SSH to Communicate with an Instance](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-ssh.html) and [Managing SSH Access](https://docs.aws.amazon.com/opsworks/latest/userguide/security-ssh-access.html) . You can override this setting by specifying a different key pair, or no key pair, when you [create an instance](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-add.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultsshkeyname
     */
    readonly defaultSshKeyName?: string;

    /**
     * The stack's default subnet ID. All instances are launched into this subnet unless you specify another subnet ID when you create the instance. This parameter is required if you specify a value for the `VpcId` parameter. If you also specify a value for `DefaultAvailabilityZone` , the subnet must be in that zone.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#defaultsubnet
     */
    readonly defaultSubnetId?: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Elastic Container Service ( Amazon ECS ) cluster to register with the AWS OpsWorks stack.
     *
     * > If you specify a cluster that's registered with another AWS OpsWorks stack, AWS CloudFormation deregisters the existing association before registering the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-ecsclusterarn
     */
    readonly ecsClusterArn?: string;

    /**
     * A list of Elastic IP addresses to register with the AWS OpsWorks stack.
     *
     * > If you specify an IP address that's registered with another AWS OpsWorks stack, AWS CloudFormation deregisters the existing association before registering the IP address.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-elasticips
     */
    readonly elasticIps?: Array<CfnStack.ElasticIpProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The stack's host name theme, with spaces replaced by underscores. The theme is used to generate host names for the stack's instances. By default, `HostnameTheme` is set to `Layer_Dependent` , which creates host names by appending integers to the layer's short name. The other themes are:
     *
     * - `Baked_Goods`
     * - `Clouds`
     * - `Europe_Cities`
     * - `Fruits`
     * - `Greek_Deities_and_Titans`
     * - `Legendary_creatures_from_Japan`
     * - `Planets_and_Moons`
     * - `Roman_Deities`
     * - `Scottish_Islands`
     * - `US_Cities`
     * - `Wild_Cats`
     *
     * To obtain a generated host name, call `GetHostNameSuggestion` , which returns a host name based on the current theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-hostnametheme
     */
    readonly hostnameTheme?: string;

    /**
     * The Amazon Relational Database Service ( Amazon RDS ) database instance to register with the AWS OpsWorks stack.
     *
     * > If you specify a database instance that's registered with another AWS OpsWorks stack, AWS CloudFormation deregisters the existing association before registering the database instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-rdsdbinstances
     */
    readonly rdsDbInstances?: Array<CfnStack.RdsDbInstanceProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * If you're cloning an AWS OpsWorks stack, the stack ID of the source AWS OpsWorks stack to clone.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-sourcestackid
     */
    readonly sourceStackId?: string;

    /**
     * A map that contains tag keys and tag values that are attached to a stack or layer.
     *
     * - The key cannot be empty.
     * - The key can be a maximum of 127 characters, and can contain only Unicode letters, numbers, or separators, or the following special characters: `+ - = . _ : /`
     * - The value can be a maximum 255 characters, and contain only Unicode letters, numbers, or separators, or the following special characters: `+ - = . _ : /`
     * - Leading and trailing white spaces are trimmed from both the key and value.
     * - A maximum of 40 tags is allowed for any resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * Whether the stack uses custom cookbooks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#usecustcookbooks
     */
    readonly useCustomCookbooks?: boolean | cdk.IResolvable;

    /**
     * Whether to associate the AWS OpsWorks Stacks built-in security groups with the stack's layers.
     *
     * AWS OpsWorks Stacks provides a standard set of built-in security groups, one for each layer, which are associated with layers by default. With `UseOpsworksSecurityGroups` you can instead provide your own custom security groups. `UseOpsworksSecurityGroups` has the following settings:
     *
     * - True - AWS OpsWorks Stacks automatically associates the appropriate built-in security group with each layer (default setting). You can associate additional security groups with a layer after you create it, but you cannot delete the built-in security group.
     * - False - AWS OpsWorks Stacks does not associate built-in security groups with layers. You must create appropriate EC2 security groups and associate a security group with each layer that you create. However, you can still manually associate a built-in security group with a layer on creation; custom security groups are required only for those layers that need custom settings.
     *
     * For more information, see [Create a New Stack](https://docs.aws.amazon.com/opsworks/latest/userguide/workingstacks-creating.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-useopsworkssecuritygroups
     */
    readonly useOpsworksSecurityGroups?: boolean | cdk.IResolvable;

    /**
     * The ID of the VPC that the stack is to be launched into. The VPC must be in the stack's region. All instances are launched into this VPC. You cannot change the ID later.
     *
     * - If your account supports EC2-Classic, the default value is `no VPC` .
     * - If your account does not support EC2-Classic, the default value is the default VPC for the specified region.
     *
     * If the VPC ID corresponds to a default VPC and you have specified either the `DefaultAvailabilityZone` or the `DefaultSubnetId` parameter only, AWS OpsWorks Stacks infers the value of the other parameter. If you specify neither parameter, AWS OpsWorks Stacks sets these parameters to the first valid Availability Zone for the specified region and the corresponding default VPC subnet ID, respectively.
     *
     * If you specify a nondefault VPC ID, note the following:
     *
     * - It must belong to a VPC in your account that is in the specified region.
     * - You must specify a value for `DefaultSubnetId` .
     *
     * For more information about how to use AWS OpsWorks Stacks with a VPC, see [Running a Stack in a VPC](https://docs.aws.amazon.com/opsworks/latest/userguide/workingstacks-vpc.html) . For more information about default VPC and EC2-Classic, see [Supported Platforms](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-supported-platforms.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-vpcid
     */
    readonly vpcId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnStackProps`
 *
 * @param properties - the TypeScript properties of a `CfnStackProps`
 *
 * @returns the result of the validation.
 */
function CfnStackPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('agentVersion', cdk.validateString)(properties.agentVersion));
    errors.collect(cdk.propertyValidator('attributes', cdk.hashValidator(cdk.validateString))(properties.attributes));
    errors.collect(cdk.propertyValidator('chefConfiguration', CfnStack_ChefConfigurationPropertyValidator)(properties.chefConfiguration));
    errors.collect(cdk.propertyValidator('cloneAppIds', cdk.listValidator(cdk.validateString))(properties.cloneAppIds));
    errors.collect(cdk.propertyValidator('clonePermissions', cdk.validateBoolean)(properties.clonePermissions));
    errors.collect(cdk.propertyValidator('configurationManager', CfnStack_StackConfigurationManagerPropertyValidator)(properties.configurationManager));
    errors.collect(cdk.propertyValidator('customCookbooksSource', CfnStack_SourcePropertyValidator)(properties.customCookbooksSource));
    errors.collect(cdk.propertyValidator('customJson', cdk.validateObject)(properties.customJson));
    errors.collect(cdk.propertyValidator('defaultAvailabilityZone', cdk.validateString)(properties.defaultAvailabilityZone));
    errors.collect(cdk.propertyValidator('defaultInstanceProfileArn', cdk.requiredValidator)(properties.defaultInstanceProfileArn));
    errors.collect(cdk.propertyValidator('defaultInstanceProfileArn', cdk.validateString)(properties.defaultInstanceProfileArn));
    errors.collect(cdk.propertyValidator('defaultOs', cdk.validateString)(properties.defaultOs));
    errors.collect(cdk.propertyValidator('defaultRootDeviceType', cdk.validateString)(properties.defaultRootDeviceType));
    errors.collect(cdk.propertyValidator('defaultSshKeyName', cdk.validateString)(properties.defaultSshKeyName));
    errors.collect(cdk.propertyValidator('defaultSubnetId', cdk.validateString)(properties.defaultSubnetId));
    errors.collect(cdk.propertyValidator('ecsClusterArn', cdk.validateString)(properties.ecsClusterArn));
    errors.collect(cdk.propertyValidator('elasticIps', cdk.listValidator(CfnStack_ElasticIpPropertyValidator))(properties.elasticIps));
    errors.collect(cdk.propertyValidator('hostnameTheme', cdk.validateString)(properties.hostnameTheme));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('rdsDbInstances', cdk.listValidator(CfnStack_RdsDbInstancePropertyValidator))(properties.rdsDbInstances));
    errors.collect(cdk.propertyValidator('serviceRoleArn', cdk.requiredValidator)(properties.serviceRoleArn));
    errors.collect(cdk.propertyValidator('serviceRoleArn', cdk.validateString)(properties.serviceRoleArn));
    errors.collect(cdk.propertyValidator('sourceStackId', cdk.validateString)(properties.sourceStackId));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('useCustomCookbooks', cdk.validateBoolean)(properties.useCustomCookbooks));
    errors.collect(cdk.propertyValidator('useOpsworksSecurityGroups', cdk.validateBoolean)(properties.useOpsworksSecurityGroups));
    errors.collect(cdk.propertyValidator('vpcId', cdk.validateString)(properties.vpcId));
    return errors.wrap('supplied properties not correct for "CfnStackProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Stack` resource
 *
 * @param properties - the TypeScript properties of a `CfnStackProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Stack` resource.
 */
// @ts-ignore TS6133
function cfnStackPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStackPropsValidator(properties).assertSuccess();
    return {
        DefaultInstanceProfileArn: cdk.stringToCloudFormation(properties.defaultInstanceProfileArn),
        Name: cdk.stringToCloudFormation(properties.name),
        ServiceRoleArn: cdk.stringToCloudFormation(properties.serviceRoleArn),
        AgentVersion: cdk.stringToCloudFormation(properties.agentVersion),
        Attributes: cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
        ChefConfiguration: cfnStackChefConfigurationPropertyToCloudFormation(properties.chefConfiguration),
        CloneAppIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.cloneAppIds),
        ClonePermissions: cdk.booleanToCloudFormation(properties.clonePermissions),
        ConfigurationManager: cfnStackStackConfigurationManagerPropertyToCloudFormation(properties.configurationManager),
        CustomCookbooksSource: cfnStackSourcePropertyToCloudFormation(properties.customCookbooksSource),
        CustomJson: cdk.objectToCloudFormation(properties.customJson),
        DefaultAvailabilityZone: cdk.stringToCloudFormation(properties.defaultAvailabilityZone),
        DefaultOs: cdk.stringToCloudFormation(properties.defaultOs),
        DefaultRootDeviceType: cdk.stringToCloudFormation(properties.defaultRootDeviceType),
        DefaultSshKeyName: cdk.stringToCloudFormation(properties.defaultSshKeyName),
        DefaultSubnetId: cdk.stringToCloudFormation(properties.defaultSubnetId),
        EcsClusterArn: cdk.stringToCloudFormation(properties.ecsClusterArn),
        ElasticIps: cdk.listMapper(cfnStackElasticIpPropertyToCloudFormation)(properties.elasticIps),
        HostnameTheme: cdk.stringToCloudFormation(properties.hostnameTheme),
        RdsDbInstances: cdk.listMapper(cfnStackRdsDbInstancePropertyToCloudFormation)(properties.rdsDbInstances),
        SourceStackId: cdk.stringToCloudFormation(properties.sourceStackId),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        UseCustomCookbooks: cdk.booleanToCloudFormation(properties.useCustomCookbooks),
        UseOpsworksSecurityGroups: cdk.booleanToCloudFormation(properties.useOpsworksSecurityGroups),
        VpcId: cdk.stringToCloudFormation(properties.vpcId),
    };
}

// @ts-ignore TS6133
function CfnStackPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStackProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStackProps>();
    ret.addPropertyResult('defaultInstanceProfileArn', 'DefaultInstanceProfileArn', cfn_parse.FromCloudFormation.getString(properties.DefaultInstanceProfileArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('serviceRoleArn', 'ServiceRoleArn', cfn_parse.FromCloudFormation.getString(properties.ServiceRoleArn));
    ret.addPropertyResult('agentVersion', 'AgentVersion', properties.AgentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.AgentVersion) : undefined);
    ret.addPropertyResult('attributes', 'Attributes', properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined);
    ret.addPropertyResult('chefConfiguration', 'ChefConfiguration', properties.ChefConfiguration != null ? CfnStackChefConfigurationPropertyFromCloudFormation(properties.ChefConfiguration) : undefined);
    ret.addPropertyResult('cloneAppIds', 'CloneAppIds', properties.CloneAppIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CloneAppIds) : undefined);
    ret.addPropertyResult('clonePermissions', 'ClonePermissions', properties.ClonePermissions != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ClonePermissions) : undefined);
    ret.addPropertyResult('configurationManager', 'ConfigurationManager', properties.ConfigurationManager != null ? CfnStackStackConfigurationManagerPropertyFromCloudFormation(properties.ConfigurationManager) : undefined);
    ret.addPropertyResult('customCookbooksSource', 'CustomCookbooksSource', properties.CustomCookbooksSource != null ? CfnStackSourcePropertyFromCloudFormation(properties.CustomCookbooksSource) : undefined);
    ret.addPropertyResult('customJson', 'CustomJson', properties.CustomJson != null ? cfn_parse.FromCloudFormation.getAny(properties.CustomJson) : undefined);
    ret.addPropertyResult('defaultAvailabilityZone', 'DefaultAvailabilityZone', properties.DefaultAvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAvailabilityZone) : undefined);
    ret.addPropertyResult('defaultOs', 'DefaultOs', properties.DefaultOs != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultOs) : undefined);
    ret.addPropertyResult('defaultRootDeviceType', 'DefaultRootDeviceType', properties.DefaultRootDeviceType != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultRootDeviceType) : undefined);
    ret.addPropertyResult('defaultSshKeyName', 'DefaultSshKeyName', properties.DefaultSshKeyName != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultSshKeyName) : undefined);
    ret.addPropertyResult('defaultSubnetId', 'DefaultSubnetId', properties.DefaultSubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultSubnetId) : undefined);
    ret.addPropertyResult('ecsClusterArn', 'EcsClusterArn', properties.EcsClusterArn != null ? cfn_parse.FromCloudFormation.getString(properties.EcsClusterArn) : undefined);
    ret.addPropertyResult('elasticIps', 'ElasticIps', properties.ElasticIps != null ? cfn_parse.FromCloudFormation.getArray(CfnStackElasticIpPropertyFromCloudFormation)(properties.ElasticIps) : undefined);
    ret.addPropertyResult('hostnameTheme', 'HostnameTheme', properties.HostnameTheme != null ? cfn_parse.FromCloudFormation.getString(properties.HostnameTheme) : undefined);
    ret.addPropertyResult('rdsDbInstances', 'RdsDbInstances', properties.RdsDbInstances != null ? cfn_parse.FromCloudFormation.getArray(CfnStackRdsDbInstancePropertyFromCloudFormation)(properties.RdsDbInstances) : undefined);
    ret.addPropertyResult('sourceStackId', 'SourceStackId', properties.SourceStackId != null ? cfn_parse.FromCloudFormation.getString(properties.SourceStackId) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('useCustomCookbooks', 'UseCustomCookbooks', properties.UseCustomCookbooks != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseCustomCookbooks) : undefined);
    ret.addPropertyResult('useOpsworksSecurityGroups', 'UseOpsworksSecurityGroups', properties.UseOpsworksSecurityGroups != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseOpsworksSecurityGroups) : undefined);
    ret.addPropertyResult('vpcId', 'VpcId', properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::OpsWorks::Stack`
 *
 * Creates a new stack. For more information, see [Create a New Stack](https://docs.aws.amazon.com/opsworks/latest/userguide/workingstacks-edit.html) .
 *
 * *Required Permissions* : To use this action, an IAM user must have an attached policy that explicitly grants permissions. For more information about user permissions, see [Managing User Permissions](https://docs.aws.amazon.com/opsworks/latest/userguide/opsworks-security-users.html) .
 *
 * @cloudformationResource AWS::OpsWorks::Stack
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html
 */
export class CfnStack extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::OpsWorks::Stack";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStack {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStackPropsFromCloudFormation(resourceProperties);
        const ret = new CfnStack(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of an IAM profile that is the default profile for all of the stack's EC2 instances. For more information about IAM ARNs, see [Using Identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultinstanceprof
     */
    public defaultInstanceProfileArn: string;

    /**
     * The stack name. Stack names can be a maximum of 64 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-name
     */
    public name: string;

    /**
     * The stack's IAM role, which allows AWS OpsWorks Stacks to work with AWS resources on your behalf. You must set this parameter to the Amazon Resource Name (ARN) for an existing IAM role. For more information about IAM ARNs, see [Using Identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-servicerolearn
     */
    public serviceRoleArn: string;

    /**
     * The default AWS OpsWorks Stacks agent version. You have the following options:
     *
     * - Auto-update - Set this parameter to `LATEST` . AWS OpsWorks Stacks automatically installs new agent versions on the stack's instances as soon as they are available.
     * - Fixed version - Set this parameter to your preferred agent version. To update the agent version, you must edit the stack configuration and specify a new version. AWS OpsWorks Stacks installs that version on the stack's instances.
     *
     * The default setting is the most recent release of the agent. To specify an agent version, you must use the complete version number, not the abbreviated number shown on the console. For a list of available agent version numbers, call [DescribeAgentVersions](https://docs.aws.amazon.com/goto/WebAPI/opsworks-2013-02-18/DescribeAgentVersions) . AgentVersion cannot be set to Chef 12.2.
     *
     * > You can also specify an agent version when you create or update an instance, which overrides the stack's default setting.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-agentversion
     */
    public agentVersion: string | undefined;

    /**
     * One or more user-defined key-value pairs to be added to the stack attributes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-attributes
     */
    public attributes: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * A `ChefConfiguration` object that specifies whether to enable Berkshelf and the Berkshelf version on Chef 11.10 stacks. For more information, see [Create a New Stack](https://docs.aws.amazon.com/opsworks/latest/userguide/workingstacks-creating.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-chefconfiguration
     */
    public chefConfiguration: CfnStack.ChefConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * If you're cloning an AWS OpsWorks stack, a list of AWS OpsWorks application stack IDs from the source stack to include in the cloned stack.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-cloneappids
     */
    public cloneAppIds: string[] | undefined;

    /**
     * If you're cloning an AWS OpsWorks stack, indicates whether to clone the source stack's permissions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-clonepermissions
     */
    public clonePermissions: boolean | cdk.IResolvable | undefined;

    /**
     * The configuration manager. When you create a stack we recommend that you use the configuration manager to specify the Chef version: 12, 11.10, or 11.4 for Linux stacks, or 12.2 for Windows stacks. The default value for Linux stacks is currently 12.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-configmanager
     */
    public configurationManager: CfnStack.StackConfigurationManagerProperty | cdk.IResolvable | undefined;

    /**
     * Contains the information required to retrieve an app or cookbook from a repository. For more information, see [Adding Apps](https://docs.aws.amazon.com/opsworks/latest/userguide/workingapps-creating.html) or [Cookbooks and Recipes](https://docs.aws.amazon.com/opsworks/latest/userguide/workingcookbook.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-custcookbooksource
     */
    public customCookbooksSource: CfnStack.SourceProperty | cdk.IResolvable | undefined;

    /**
     * A string that contains user-defined, custom JSON. It can be used to override the corresponding default stack configuration attribute values or to pass data to recipes. The string should be in the following format:
     *
     * `"{\"key1\": \"value1\", \"key2\": \"value2\",...}"`
     *
     * For more information about custom JSON, see [Use Custom JSON to Modify the Stack Configuration Attributes](https://docs.aws.amazon.com/opsworks/latest/userguide/workingstacks-json.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-custjson
     */
    public customJson: any | cdk.IResolvable | undefined;

    /**
     * The stack's default Availability Zone, which must be in the specified region. For more information, see [Regions and Endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html) . If you also specify a value for `DefaultSubnetId` , the subnet must be in the same zone. For more information, see the `VpcId` parameter description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultaz
     */
    public defaultAvailabilityZone: string | undefined;

    /**
     * The stack's default operating system, which is installed on every instance unless you specify a different operating system when you create the instance. You can specify one of the following.
     *
     * - A supported Linux operating system: An Amazon Linux version, such as `Amazon Linux 2` , `Amazon Linux 2018.03` , `Amazon Linux 2017.09` , `Amazon Linux 2017.03` , `Amazon Linux 2016.09` , `Amazon Linux 2016.03` , `Amazon Linux 2015.09` , or `Amazon Linux 2015.03` .
     * - A supported Ubuntu operating system, such as `Ubuntu 18.04 LTS` , `Ubuntu 16.04 LTS` , `Ubuntu 14.04 LTS` , or `Ubuntu 12.04 LTS` .
     * - `CentOS Linux 7`
     * - `Red Hat Enterprise Linux 7`
     * - A supported Windows operating system, such as `Microsoft Windows Server 2012 R2 Base` , `Microsoft Windows Server 2012 R2 with SQL Server Express` , `Microsoft Windows Server 2012 R2 with SQL Server Standard` , or `Microsoft Windows Server 2012 R2 with SQL Server Web` .
     * - A custom AMI: `Custom` . You specify the custom AMI you want to use when you create instances. For more information, see [Using Custom AMIs](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-custom-ami.html) .
     *
     * The default option is the current Amazon Linux version. Not all operating systems are supported with all versions of Chef. For more information about supported operating systems, see [AWS OpsWorks Stacks Operating Systems](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-os.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultos
     */
    public defaultOs: string | undefined;

    /**
     * The default root device type. This value is the default for all instances in the stack, but you can override it when you create an instance. The default option is `instance-store` . For more information, see [Storage for the Root Device](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ComponentsAMIs.html#storage-for-the-root-device) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultrootdevicetype
     */
    public defaultRootDeviceType: string | undefined;

    /**
     * A default Amazon EC2 key pair name. The default value is none. If you specify a key pair name, AWS OpsWorks installs the public key on the instance and you can use the private key with an SSH client to log in to the instance. For more information, see [Using SSH to Communicate with an Instance](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-ssh.html) and [Managing SSH Access](https://docs.aws.amazon.com/opsworks/latest/userguide/security-ssh-access.html) . You can override this setting by specifying a different key pair, or no key pair, when you [create an instance](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-add.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultsshkeyname
     */
    public defaultSshKeyName: string | undefined;

    /**
     * The stack's default subnet ID. All instances are launched into this subnet unless you specify another subnet ID when you create the instance. This parameter is required if you specify a value for the `VpcId` parameter. If you also specify a value for `DefaultAvailabilityZone` , the subnet must be in that zone.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#defaultsubnet
     */
    public defaultSubnetId: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Elastic Container Service ( Amazon ECS ) cluster to register with the AWS OpsWorks stack.
     *
     * > If you specify a cluster that's registered with another AWS OpsWorks stack, AWS CloudFormation deregisters the existing association before registering the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-ecsclusterarn
     */
    public ecsClusterArn: string | undefined;

    /**
     * A list of Elastic IP addresses to register with the AWS OpsWorks stack.
     *
     * > If you specify an IP address that's registered with another AWS OpsWorks stack, AWS CloudFormation deregisters the existing association before registering the IP address.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-elasticips
     */
    public elasticIps: Array<CfnStack.ElasticIpProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The stack's host name theme, with spaces replaced by underscores. The theme is used to generate host names for the stack's instances. By default, `HostnameTheme` is set to `Layer_Dependent` , which creates host names by appending integers to the layer's short name. The other themes are:
     *
     * - `Baked_Goods`
     * - `Clouds`
     * - `Europe_Cities`
     * - `Fruits`
     * - `Greek_Deities_and_Titans`
     * - `Legendary_creatures_from_Japan`
     * - `Planets_and_Moons`
     * - `Roman_Deities`
     * - `Scottish_Islands`
     * - `US_Cities`
     * - `Wild_Cats`
     *
     * To obtain a generated host name, call `GetHostNameSuggestion` , which returns a host name based on the current theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-hostnametheme
     */
    public hostnameTheme: string | undefined;

    /**
     * The Amazon Relational Database Service ( Amazon RDS ) database instance to register with the AWS OpsWorks stack.
     *
     * > If you specify a database instance that's registered with another AWS OpsWorks stack, AWS CloudFormation deregisters the existing association before registering the database instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-rdsdbinstances
     */
    public rdsDbInstances: Array<CfnStack.RdsDbInstanceProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * If you're cloning an AWS OpsWorks stack, the stack ID of the source AWS OpsWorks stack to clone.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-sourcestackid
     */
    public sourceStackId: string | undefined;

    /**
     * A map that contains tag keys and tag values that are attached to a stack or layer.
     *
     * - The key cannot be empty.
     * - The key can be a maximum of 127 characters, and can contain only Unicode letters, numbers, or separators, or the following special characters: `+ - = . _ : /`
     * - The value can be a maximum 255 characters, and contain only Unicode letters, numbers, or separators, or the following special characters: `+ - = . _ : /`
     * - Leading and trailing white spaces are trimmed from both the key and value.
     * - A maximum of 40 tags is allowed for any resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Whether the stack uses custom cookbooks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#usecustcookbooks
     */
    public useCustomCookbooks: boolean | cdk.IResolvable | undefined;

    /**
     * Whether to associate the AWS OpsWorks Stacks built-in security groups with the stack's layers.
     *
     * AWS OpsWorks Stacks provides a standard set of built-in security groups, one for each layer, which are associated with layers by default. With `UseOpsworksSecurityGroups` you can instead provide your own custom security groups. `UseOpsworksSecurityGroups` has the following settings:
     *
     * - True - AWS OpsWorks Stacks automatically associates the appropriate built-in security group with each layer (default setting). You can associate additional security groups with a layer after you create it, but you cannot delete the built-in security group.
     * - False - AWS OpsWorks Stacks does not associate built-in security groups with layers. You must create appropriate EC2 security groups and associate a security group with each layer that you create. However, you can still manually associate a built-in security group with a layer on creation; custom security groups are required only for those layers that need custom settings.
     *
     * For more information, see [Create a New Stack](https://docs.aws.amazon.com/opsworks/latest/userguide/workingstacks-creating.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-useopsworkssecuritygroups
     */
    public useOpsworksSecurityGroups: boolean | cdk.IResolvable | undefined;

    /**
     * The ID of the VPC that the stack is to be launched into. The VPC must be in the stack's region. All instances are launched into this VPC. You cannot change the ID later.
     *
     * - If your account supports EC2-Classic, the default value is `no VPC` .
     * - If your account does not support EC2-Classic, the default value is the default VPC for the specified region.
     *
     * If the VPC ID corresponds to a default VPC and you have specified either the `DefaultAvailabilityZone` or the `DefaultSubnetId` parameter only, AWS OpsWorks Stacks infers the value of the other parameter. If you specify neither parameter, AWS OpsWorks Stacks sets these parameters to the first valid Availability Zone for the specified region and the corresponding default VPC subnet ID, respectively.
     *
     * If you specify a nondefault VPC ID, note the following:
     *
     * - It must belong to a VPC in your account that is in the specified region.
     * - You must specify a value for `DefaultSubnetId` .
     *
     * For more information about how to use AWS OpsWorks Stacks with a VPC, see [Running a Stack in a VPC](https://docs.aws.amazon.com/opsworks/latest/userguide/workingstacks-vpc.html) . For more information about default VPC and EC2-Classic, see [Supported Platforms](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-supported-platforms.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-vpcid
     */
    public vpcId: string | undefined;

    /**
     * Create a new `AWS::OpsWorks::Stack`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStackProps) {
        super(scope, id, { type: CfnStack.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'defaultInstanceProfileArn', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'serviceRoleArn', this);

        this.defaultInstanceProfileArn = props.defaultInstanceProfileArn;
        this.name = props.name;
        this.serviceRoleArn = props.serviceRoleArn;
        this.agentVersion = props.agentVersion;
        this.attributes = props.attributes;
        this.chefConfiguration = props.chefConfiguration;
        this.cloneAppIds = props.cloneAppIds;
        this.clonePermissions = props.clonePermissions;
        this.configurationManager = props.configurationManager;
        this.customCookbooksSource = props.customCookbooksSource;
        this.customJson = props.customJson;
        this.defaultAvailabilityZone = props.defaultAvailabilityZone;
        this.defaultOs = props.defaultOs;
        this.defaultRootDeviceType = props.defaultRootDeviceType;
        this.defaultSshKeyName = props.defaultSshKeyName;
        this.defaultSubnetId = props.defaultSubnetId;
        this.ecsClusterArn = props.ecsClusterArn;
        this.elasticIps = props.elasticIps;
        this.hostnameTheme = props.hostnameTheme;
        this.rdsDbInstances = props.rdsDbInstances;
        this.sourceStackId = props.sourceStackId;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::OpsWorks::Stack", props.tags, { tagPropertyName: 'tags' });
        this.useCustomCookbooks = props.useCustomCookbooks;
        this.useOpsworksSecurityGroups = props.useOpsworksSecurityGroups;
        this.vpcId = props.vpcId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStack.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            defaultInstanceProfileArn: this.defaultInstanceProfileArn,
            name: this.name,
            serviceRoleArn: this.serviceRoleArn,
            agentVersion: this.agentVersion,
            attributes: this.attributes,
            chefConfiguration: this.chefConfiguration,
            cloneAppIds: this.cloneAppIds,
            clonePermissions: this.clonePermissions,
            configurationManager: this.configurationManager,
            customCookbooksSource: this.customCookbooksSource,
            customJson: this.customJson,
            defaultAvailabilityZone: this.defaultAvailabilityZone,
            defaultOs: this.defaultOs,
            defaultRootDeviceType: this.defaultRootDeviceType,
            defaultSshKeyName: this.defaultSshKeyName,
            defaultSubnetId: this.defaultSubnetId,
            ecsClusterArn: this.ecsClusterArn,
            elasticIps: this.elasticIps,
            hostnameTheme: this.hostnameTheme,
            rdsDbInstances: this.rdsDbInstances,
            sourceStackId: this.sourceStackId,
            tags: this.tags.renderTags(),
            useCustomCookbooks: this.useCustomCookbooks,
            useOpsworksSecurityGroups: this.useOpsworksSecurityGroups,
            vpcId: this.vpcId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStackPropsToCloudFormation(props);
    }
}

export namespace CfnStack {
    /**
     * Describes the Chef configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-chefconfiguration.html
     */
    export interface ChefConfigurationProperty {
        /**
         * The Berkshelf version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-chefconfiguration.html#cfn-opsworks-chefconfiguration-berkshelfversion
         */
        readonly berkshelfVersion?: string;
        /**
         * Whether to enable Berkshelf.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-chefconfiguration.html#cfn-opsworks-chefconfiguration-berkshelfversion
         */
        readonly manageBerkshelf?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ChefConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ChefConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStack_ChefConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('berkshelfVersion', cdk.validateString)(properties.berkshelfVersion));
    errors.collect(cdk.propertyValidator('manageBerkshelf', cdk.validateBoolean)(properties.manageBerkshelf));
    return errors.wrap('supplied properties not correct for "ChefConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Stack.ChefConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ChefConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Stack.ChefConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnStackChefConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStack_ChefConfigurationPropertyValidator(properties).assertSuccess();
    return {
        BerkshelfVersion: cdk.stringToCloudFormation(properties.berkshelfVersion),
        ManageBerkshelf: cdk.booleanToCloudFormation(properties.manageBerkshelf),
    };
}

// @ts-ignore TS6133
function CfnStackChefConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStack.ChefConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.ChefConfigurationProperty>();
    ret.addPropertyResult('berkshelfVersion', 'BerkshelfVersion', properties.BerkshelfVersion != null ? cfn_parse.FromCloudFormation.getString(properties.BerkshelfVersion) : undefined);
    ret.addPropertyResult('manageBerkshelf', 'ManageBerkshelf', properties.ManageBerkshelf != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ManageBerkshelf) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStack {
    /**
     * Describes an Elastic IP address.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-elasticip.html
     */
    export interface ElasticIpProperty {
        /**
         * The IP address.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-elasticip.html#cfn-opsworks-stack-elasticip-ip
         */
        readonly ip: string;
        /**
         * The name, which can be a maximum of 32 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-elasticip.html#cfn-opsworks-stack-elasticip-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ElasticIpProperty`
 *
 * @param properties - the TypeScript properties of a `ElasticIpProperty`
 *
 * @returns the result of the validation.
 */
function CfnStack_ElasticIpPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ip', cdk.requiredValidator)(properties.ip));
    errors.collect(cdk.propertyValidator('ip', cdk.validateString)(properties.ip));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "ElasticIpProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Stack.ElasticIp` resource
 *
 * @param properties - the TypeScript properties of a `ElasticIpProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Stack.ElasticIp` resource.
 */
// @ts-ignore TS6133
function cfnStackElasticIpPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStack_ElasticIpPropertyValidator(properties).assertSuccess();
    return {
        Ip: cdk.stringToCloudFormation(properties.ip),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnStackElasticIpPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStack.ElasticIpProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.ElasticIpProperty>();
    ret.addPropertyResult('ip', 'Ip', cfn_parse.FromCloudFormation.getString(properties.Ip));
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStack {
    /**
     * Describes an Amazon RDS instance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-rdsdbinstance.html
     */
    export interface RdsDbInstanceProperty {
        /**
         * AWS OpsWorks Stacks returns `*****FILTERED*****` instead of the actual value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-rdsdbinstance.html#cfn-opsworks-stack-rdsdbinstance-dbpassword
         */
        readonly dbPassword: string;
        /**
         * The master user name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-rdsdbinstance.html#cfn-opsworks-stack-rdsdbinstance-dbuser
         */
        readonly dbUser: string;
        /**
         * The instance's ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-rdsdbinstance.html#cfn-opsworks-stack-rdsdbinstance-rdsdbinstancearn
         */
        readonly rdsDbInstanceArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `RdsDbInstanceProperty`
 *
 * @param properties - the TypeScript properties of a `RdsDbInstanceProperty`
 *
 * @returns the result of the validation.
 */
function CfnStack_RdsDbInstancePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dbPassword', cdk.requiredValidator)(properties.dbPassword));
    errors.collect(cdk.propertyValidator('dbPassword', cdk.validateString)(properties.dbPassword));
    errors.collect(cdk.propertyValidator('dbUser', cdk.requiredValidator)(properties.dbUser));
    errors.collect(cdk.propertyValidator('dbUser', cdk.validateString)(properties.dbUser));
    errors.collect(cdk.propertyValidator('rdsDbInstanceArn', cdk.requiredValidator)(properties.rdsDbInstanceArn));
    errors.collect(cdk.propertyValidator('rdsDbInstanceArn', cdk.validateString)(properties.rdsDbInstanceArn));
    return errors.wrap('supplied properties not correct for "RdsDbInstanceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Stack.RdsDbInstance` resource
 *
 * @param properties - the TypeScript properties of a `RdsDbInstanceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Stack.RdsDbInstance` resource.
 */
// @ts-ignore TS6133
function cfnStackRdsDbInstancePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStack_RdsDbInstancePropertyValidator(properties).assertSuccess();
    return {
        DbPassword: cdk.stringToCloudFormation(properties.dbPassword),
        DbUser: cdk.stringToCloudFormation(properties.dbUser),
        RdsDbInstanceArn: cdk.stringToCloudFormation(properties.rdsDbInstanceArn),
    };
}

// @ts-ignore TS6133
function CfnStackRdsDbInstancePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStack.RdsDbInstanceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.RdsDbInstanceProperty>();
    ret.addPropertyResult('dbPassword', 'DbPassword', cfn_parse.FromCloudFormation.getString(properties.DbPassword));
    ret.addPropertyResult('dbUser', 'DbUser', cfn_parse.FromCloudFormation.getString(properties.DbUser));
    ret.addPropertyResult('rdsDbInstanceArn', 'RdsDbInstanceArn', cfn_parse.FromCloudFormation.getString(properties.RdsDbInstanceArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStack {
    /**
     * Contains the information required to retrieve an app or cookbook from a repository. For more information, see [Creating Apps](https://docs.aws.amazon.com/opsworks/latest/userguide/workingapps-creating.html) or [Custom Recipes and Cookbooks](https://docs.aws.amazon.com/opsworks/latest/userguide/workingcookbook.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html
     */
    export interface SourceProperty {
        /**
         * When included in a request, the parameter depends on the repository type.
         *
         * - For Amazon S3 bundles, set `Password` to the appropriate IAM secret access key.
         * - For HTTP bundles and Subversion repositories, set `Password` to the password.
         *
         * For more information on how to safely handle IAM credentials, see [](https://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html) .
         *
         * In responses, AWS OpsWorks Stacks returns `*****FILTERED*****` instead of the actual value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-custcookbooksource-password
         */
        readonly password?: string;
        /**
         * The application's version. AWS OpsWorks Stacks enables you to easily deploy new versions of an application. One of the simplest approaches is to have branches or revisions in your repository that represent different versions that can potentially be deployed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-custcookbooksource-revision
         */
        readonly revision?: string;
        /**
         * The repository's SSH key. For more information, see [Using Git Repository SSH Keys](https://docs.aws.amazon.com/opsworks/latest/userguide/workingapps-deploykeys.html) in the *AWS OpsWorks User Guide* . To pass in an SSH key as a parameter, see the following example:
         *
         * `"Parameters" : { "GitSSHKey" : { "Description" : "Change SSH key newlines to commas.", "Type" : "CommaDelimitedList", "NoEcho" : "true" }, ... "CustomCookbooksSource": { "Revision" : { "Ref": "GitRevision"}, "SshKey" : { "Fn::Join" : [ "\n", { "Ref": "GitSSHKey"} ] }, "Type": "git", "Url": { "Ref": "GitURL"} } ...`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-custcookbooksource-sshkey
         */
        readonly sshKey?: string;
        /**
         * The repository type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-custcookbooksource-type
         */
        readonly type?: string;
        /**
         * The source URL. The following is an example of an Amazon S3 source URL: `https://s3.amazonaws.com/opsworks-demo-bucket/opsworks_cookbook_demo.tar.gz` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-custcookbooksource-url
         */
        readonly url?: string;
        /**
         * This parameter depends on the repository type.
         *
         * - For Amazon S3 bundles, set `Username` to the appropriate IAM access key ID.
         * - For HTTP bundles, Git repositories, and Subversion repositories, set `Username` to the user name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-custcookbooksource-username
         */
        readonly username?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SourceProperty`
 *
 * @param properties - the TypeScript properties of a `SourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnStack_SourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('revision', cdk.validateString)(properties.revision));
    errors.collect(cdk.propertyValidator('sshKey', cdk.validateString)(properties.sshKey));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    errors.collect(cdk.propertyValidator('username', cdk.validateString)(properties.username));
    return errors.wrap('supplied properties not correct for "SourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Stack.Source` resource
 *
 * @param properties - the TypeScript properties of a `SourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Stack.Source` resource.
 */
// @ts-ignore TS6133
function cfnStackSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStack_SourcePropertyValidator(properties).assertSuccess();
    return {
        Password: cdk.stringToCloudFormation(properties.password),
        Revision: cdk.stringToCloudFormation(properties.revision),
        SshKey: cdk.stringToCloudFormation(properties.sshKey),
        Type: cdk.stringToCloudFormation(properties.type),
        Url: cdk.stringToCloudFormation(properties.url),
        Username: cdk.stringToCloudFormation(properties.username),
    };
}

// @ts-ignore TS6133
function CfnStackSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStack.SourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.SourceProperty>();
    ret.addPropertyResult('password', 'Password', properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined);
    ret.addPropertyResult('revision', 'Revision', properties.Revision != null ? cfn_parse.FromCloudFormation.getString(properties.Revision) : undefined);
    ret.addPropertyResult('sshKey', 'SshKey', properties.SshKey != null ? cfn_parse.FromCloudFormation.getString(properties.SshKey) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addPropertyResult('url', 'Url', properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined);
    ret.addPropertyResult('username', 'Username', properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStack {
    /**
     * Describes the configuration manager.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-stackconfigmanager.html
     */
    export interface StackConfigurationManagerProperty {
        /**
         * The name. This parameter must be set to `Chef` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-stackconfigmanager.html#cfn-opsworks-configmanager-name
         */
        readonly name?: string;
        /**
         * The Chef version. This parameter must be set to 12, 11.10, or 11.4 for Linux stacks, and to 12.2 for Windows stacks. The default value for Linux stacks is 12.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-stackconfigmanager.html#cfn-opsworks-configmanager-version
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `StackConfigurationManagerProperty`
 *
 * @param properties - the TypeScript properties of a `StackConfigurationManagerProperty`
 *
 * @returns the result of the validation.
 */
function CfnStack_StackConfigurationManagerPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "StackConfigurationManagerProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Stack.StackConfigurationManager` resource
 *
 * @param properties - the TypeScript properties of a `StackConfigurationManagerProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Stack.StackConfigurationManager` resource.
 */
// @ts-ignore TS6133
function cfnStackStackConfigurationManagerPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStack_StackConfigurationManagerPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnStackStackConfigurationManagerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStack.StackConfigurationManagerProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.StackConfigurationManagerProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnUserProfile`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html
 */
export interface CfnUserProfileProps {

    /**
     * The user's IAM ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-iamuserarn
     */
    readonly iamUserArn: string;

    /**
     * Whether users can specify their own SSH public key through the My Settings page. For more information, see [Managing User Permissions](https://docs.aws.amazon.com/opsworks/latest/userguide/security-settingsshkey.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-allowselfmanagement
     */
    readonly allowSelfManagement?: boolean | cdk.IResolvable;

    /**
     * The user's SSH public key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-sshpublickey
     */
    readonly sshPublicKey?: string;

    /**
     * The user's SSH user name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-sshusername
     */
    readonly sshUsername?: string;
}

/**
 * Determine whether the given properties match those of a `CfnUserProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserProfileProps`
 *
 * @returns the result of the validation.
 */
function CfnUserProfilePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowSelfManagement', cdk.validateBoolean)(properties.allowSelfManagement));
    errors.collect(cdk.propertyValidator('iamUserArn', cdk.requiredValidator)(properties.iamUserArn));
    errors.collect(cdk.propertyValidator('iamUserArn', cdk.validateString)(properties.iamUserArn));
    errors.collect(cdk.propertyValidator('sshPublicKey', cdk.validateString)(properties.sshPublicKey));
    errors.collect(cdk.propertyValidator('sshUsername', cdk.validateString)(properties.sshUsername));
    return errors.wrap('supplied properties not correct for "CfnUserProfileProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::UserProfile` resource
 *
 * @param properties - the TypeScript properties of a `CfnUserProfileProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::UserProfile` resource.
 */
// @ts-ignore TS6133
function cfnUserProfilePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnUserProfilePropsValidator(properties).assertSuccess();
    return {
        IamUserArn: cdk.stringToCloudFormation(properties.iamUserArn),
        AllowSelfManagement: cdk.booleanToCloudFormation(properties.allowSelfManagement),
        SshPublicKey: cdk.stringToCloudFormation(properties.sshPublicKey),
        SshUsername: cdk.stringToCloudFormation(properties.sshUsername),
    };
}

// @ts-ignore TS6133
function CfnUserProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserProfileProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserProfileProps>();
    ret.addPropertyResult('iamUserArn', 'IamUserArn', cfn_parse.FromCloudFormation.getString(properties.IamUserArn));
    ret.addPropertyResult('allowSelfManagement', 'AllowSelfManagement', properties.AllowSelfManagement != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowSelfManagement) : undefined);
    ret.addPropertyResult('sshPublicKey', 'SshPublicKey', properties.SshPublicKey != null ? cfn_parse.FromCloudFormation.getString(properties.SshPublicKey) : undefined);
    ret.addPropertyResult('sshUsername', 'SshUsername', properties.SshUsername != null ? cfn_parse.FromCloudFormation.getString(properties.SshUsername) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::OpsWorks::UserProfile`
 *
 * Describes a user's SSH information.
 *
 * @cloudformationResource AWS::OpsWorks::UserProfile
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html
 */
export class CfnUserProfile extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::OpsWorks::UserProfile";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserProfile {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnUserProfilePropsFromCloudFormation(resourceProperties);
        const ret = new CfnUserProfile(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The user's SSH user name, as a string.
     * @cloudformationAttribute SshUsername
     */
    public readonly attrSshUsername: string;

    /**
     * The user's IAM ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-iamuserarn
     */
    public iamUserArn: string;

    /**
     * Whether users can specify their own SSH public key through the My Settings page. For more information, see [Managing User Permissions](https://docs.aws.amazon.com/opsworks/latest/userguide/security-settingsshkey.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-allowselfmanagement
     */
    public allowSelfManagement: boolean | cdk.IResolvable | undefined;

    /**
     * The user's SSH public key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-sshpublickey
     */
    public sshPublicKey: string | undefined;

    /**
     * The user's SSH user name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-sshusername
     */
    public sshUsername: string | undefined;

    /**
     * Create a new `AWS::OpsWorks::UserProfile`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserProfileProps) {
        super(scope, id, { type: CfnUserProfile.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'iamUserArn', this);
        this.attrSshUsername = cdk.Token.asString(this.getAtt('SshUsername', cdk.ResolutionTypeHint.STRING));

        this.iamUserArn = props.iamUserArn;
        this.allowSelfManagement = props.allowSelfManagement;
        this.sshPublicKey = props.sshPublicKey;
        this.sshUsername = props.sshUsername;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserProfile.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            iamUserArn: this.iamUserArn,
            allowSelfManagement: this.allowSelfManagement,
            sshPublicKey: this.sshPublicKey,
            sshUsername: this.sshUsername,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnUserProfilePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnVolume`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html
 */
export interface CfnVolumeProps {

    /**
     * The Amazon EC2 volume ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html#cfn-opsworks-volume-ec2volumeid
     */
    readonly ec2VolumeId: string;

    /**
     * The stack ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html#cfn-opsworks-volume-stackid
     */
    readonly stackId: string;

    /**
     * The volume mount point. For example, "/mnt/disk1".
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html#cfn-opsworks-volume-mountpoint
     */
    readonly mountPoint?: string;

    /**
     * The volume name. Volume names are a maximum of 128 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html#cfn-opsworks-volume-name
     */
    readonly name?: string;
}

/**
 * Determine whether the given properties match those of a `CfnVolumeProps`
 *
 * @param properties - the TypeScript properties of a `CfnVolumeProps`
 *
 * @returns the result of the validation.
 */
function CfnVolumePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ec2VolumeId', cdk.requiredValidator)(properties.ec2VolumeId));
    errors.collect(cdk.propertyValidator('ec2VolumeId', cdk.validateString)(properties.ec2VolumeId));
    errors.collect(cdk.propertyValidator('mountPoint', cdk.validateString)(properties.mountPoint));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('stackId', cdk.requiredValidator)(properties.stackId));
    errors.collect(cdk.propertyValidator('stackId', cdk.validateString)(properties.stackId));
    return errors.wrap('supplied properties not correct for "CfnVolumeProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::OpsWorks::Volume` resource
 *
 * @param properties - the TypeScript properties of a `CfnVolumeProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::OpsWorks::Volume` resource.
 */
// @ts-ignore TS6133
function cfnVolumePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVolumePropsValidator(properties).assertSuccess();
    return {
        Ec2VolumeId: cdk.stringToCloudFormation(properties.ec2VolumeId),
        StackId: cdk.stringToCloudFormation(properties.stackId),
        MountPoint: cdk.stringToCloudFormation(properties.mountPoint),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnVolumePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVolumeProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVolumeProps>();
    ret.addPropertyResult('ec2VolumeId', 'Ec2VolumeId', cfn_parse.FromCloudFormation.getString(properties.Ec2VolumeId));
    ret.addPropertyResult('stackId', 'StackId', cfn_parse.FromCloudFormation.getString(properties.StackId));
    ret.addPropertyResult('mountPoint', 'MountPoint', properties.MountPoint != null ? cfn_parse.FromCloudFormation.getString(properties.MountPoint) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::OpsWorks::Volume`
 *
 * Describes an instance's Amazon EBS volume.
 *
 * @cloudformationResource AWS::OpsWorks::Volume
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html
 */
export class CfnVolume extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::OpsWorks::Volume";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVolume {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnVolumePropsFromCloudFormation(resourceProperties);
        const ret = new CfnVolume(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon EC2 volume ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html#cfn-opsworks-volume-ec2volumeid
     */
    public ec2VolumeId: string;

    /**
     * The stack ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html#cfn-opsworks-volume-stackid
     */
    public stackId: string;

    /**
     * The volume mount point. For example, "/mnt/disk1".
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html#cfn-opsworks-volume-mountpoint
     */
    public mountPoint: string | undefined;

    /**
     * The volume name. Volume names are a maximum of 128 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html#cfn-opsworks-volume-name
     */
    public name: string | undefined;

    /**
     * Create a new `AWS::OpsWorks::Volume`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnVolumeProps) {
        super(scope, id, { type: CfnVolume.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'ec2VolumeId', this);
        cdk.requireProperty(props, 'stackId', this);

        this.ec2VolumeId = props.ec2VolumeId;
        this.stackId = props.stackId;
        this.mountPoint = props.mountPoint;
        this.name = props.name;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnVolume.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            ec2VolumeId: this.ec2VolumeId,
            stackId: this.stackId,
            mountPoint: this.mountPoint,
            name: this.name,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnVolumePropsToCloudFormation(props);
    }
}
