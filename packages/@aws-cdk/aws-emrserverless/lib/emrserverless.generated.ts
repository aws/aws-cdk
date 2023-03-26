// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:05.784Z","fingerprint":"XPE0tUybITWV/SPP0btbFlkBTtUMcpsqbleA6iq9ay4="}

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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html
 */
export interface CfnApplicationProps {

    /**
     * The EMR release version associated with the application.
     *
     * *Minimum* : 1
     *
     * *Maximum* : 64
     *
     * *Pattern* : `^[A-Za-z0-9._/-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-releaselabel
     */
    readonly releaseLabel: string;

    /**
     * The type of application, such as Spark or Hive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-type
     */
    readonly type: string;

    /**
     * The CPU architecture type of the application. Allowed values: `X86_64` or `ARM64`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-architecture
     */
    readonly architecture?: string;

    /**
     * The configuration for an application to automatically start on job submission.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-autostartconfiguration
     */
    readonly autoStartConfiguration?: CfnApplication.AutoStartConfigurationProperty | cdk.IResolvable;

    /**
     * The configuration for an application to automatically stop after a certain amount of time being idle.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-autostopconfiguration
     */
    readonly autoStopConfiguration?: CfnApplication.AutoStopConfigurationProperty | cdk.IResolvable;

    /**
     * The initial capacity of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-initialcapacity
     */
    readonly initialCapacity?: Array<CfnApplication.InitialCapacityConfigKeyValuePairProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The maximum capacity of the application. This is cumulative across all workers at any given point in time during the lifespan of the application is created. No new resources will be created once any one of the defined limits is hit.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-maximumcapacity
     */
    readonly maximumCapacity?: CfnApplication.MaximumAllowedResourcesProperty | cdk.IResolvable;

    /**
     * The name of the application.
     *
     * *Minimum* : 1
     *
     * *Maximum* : 64
     *
     * *Pattern* : `^[A-Za-z0-9._\\/#-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-name
     */
    readonly name?: string;

    /**
     * The network configuration for customer VPC connectivity for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-networkconfiguration
     */
    readonly networkConfiguration?: CfnApplication.NetworkConfigurationProperty | cdk.IResolvable;

    /**
     * The tags assigned to the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-tags
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
    errors.collect(cdk.propertyValidator('architecture', cdk.validateString)(properties.architecture));
    errors.collect(cdk.propertyValidator('autoStartConfiguration', CfnApplication_AutoStartConfigurationPropertyValidator)(properties.autoStartConfiguration));
    errors.collect(cdk.propertyValidator('autoStopConfiguration', CfnApplication_AutoStopConfigurationPropertyValidator)(properties.autoStopConfiguration));
    errors.collect(cdk.propertyValidator('initialCapacity', cdk.listValidator(CfnApplication_InitialCapacityConfigKeyValuePairPropertyValidator))(properties.initialCapacity));
    errors.collect(cdk.propertyValidator('maximumCapacity', CfnApplication_MaximumAllowedResourcesPropertyValidator)(properties.maximumCapacity));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('networkConfiguration', CfnApplication_NetworkConfigurationPropertyValidator)(properties.networkConfiguration));
    errors.collect(cdk.propertyValidator('releaseLabel', cdk.requiredValidator)(properties.releaseLabel));
    errors.collect(cdk.propertyValidator('releaseLabel', cdk.validateString)(properties.releaseLabel));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnApplicationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMRServerless::Application` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMRServerless::Application` resource.
 */
// @ts-ignore TS6133
function cfnApplicationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationPropsValidator(properties).assertSuccess();
    return {
        ReleaseLabel: cdk.stringToCloudFormation(properties.releaseLabel),
        Type: cdk.stringToCloudFormation(properties.type),
        Architecture: cdk.stringToCloudFormation(properties.architecture),
        AutoStartConfiguration: cfnApplicationAutoStartConfigurationPropertyToCloudFormation(properties.autoStartConfiguration),
        AutoStopConfiguration: cfnApplicationAutoStopConfigurationPropertyToCloudFormation(properties.autoStopConfiguration),
        InitialCapacity: cdk.listMapper(cfnApplicationInitialCapacityConfigKeyValuePairPropertyToCloudFormation)(properties.initialCapacity),
        MaximumCapacity: cfnApplicationMaximumAllowedResourcesPropertyToCloudFormation(properties.maximumCapacity),
        Name: cdk.stringToCloudFormation(properties.name),
        NetworkConfiguration: cfnApplicationNetworkConfigurationPropertyToCloudFormation(properties.networkConfiguration),
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
    ret.addPropertyResult('releaseLabel', 'ReleaseLabel', cfn_parse.FromCloudFormation.getString(properties.ReleaseLabel));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('architecture', 'Architecture', properties.Architecture != null ? cfn_parse.FromCloudFormation.getString(properties.Architecture) : undefined);
    ret.addPropertyResult('autoStartConfiguration', 'AutoStartConfiguration', properties.AutoStartConfiguration != null ? CfnApplicationAutoStartConfigurationPropertyFromCloudFormation(properties.AutoStartConfiguration) : undefined);
    ret.addPropertyResult('autoStopConfiguration', 'AutoStopConfiguration', properties.AutoStopConfiguration != null ? CfnApplicationAutoStopConfigurationPropertyFromCloudFormation(properties.AutoStopConfiguration) : undefined);
    ret.addPropertyResult('initialCapacity', 'InitialCapacity', properties.InitialCapacity != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationInitialCapacityConfigKeyValuePairPropertyFromCloudFormation)(properties.InitialCapacity) : undefined);
    ret.addPropertyResult('maximumCapacity', 'MaximumCapacity', properties.MaximumCapacity != null ? CfnApplicationMaximumAllowedResourcesPropertyFromCloudFormation(properties.MaximumCapacity) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('networkConfiguration', 'NetworkConfiguration', properties.NetworkConfiguration != null ? CfnApplicationNetworkConfigurationPropertyFromCloudFormation(properties.NetworkConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EMRServerless::Application`
 *
 * The `AWS::EMRServerless::Application` resource specifies an EMR Serverless application. An application uses open source analytics frameworks to run jobs that process data. To create an application, you must specify the release version for the open source framework version you want to use and the type of application you want, such as Apache Spark or Apache Hive. After you create an application, you can submit data processing jobs or interactive requests to it.
 *
 * @cloudformationResource AWS::EMRServerless::Application
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EMRServerless::Application";

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
     * The ID of the application, such as `ab4rp1abcs8xz47n3x0example` .
     * @cloudformationAttribute ApplicationId
     */
    public readonly attrApplicationId: string;

    /**
     * The Amazon Resource Name (ARN) of the project.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The EMR release version associated with the application.
     *
     * *Minimum* : 1
     *
     * *Maximum* : 64
     *
     * *Pattern* : `^[A-Za-z0-9._/-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-releaselabel
     */
    public releaseLabel: string;

    /**
     * The type of application, such as Spark or Hive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-type
     */
    public type: string;

    /**
     * The CPU architecture type of the application. Allowed values: `X86_64` or `ARM64`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-architecture
     */
    public architecture: string | undefined;

    /**
     * The configuration for an application to automatically start on job submission.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-autostartconfiguration
     */
    public autoStartConfiguration: CfnApplication.AutoStartConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The configuration for an application to automatically stop after a certain amount of time being idle.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-autostopconfiguration
     */
    public autoStopConfiguration: CfnApplication.AutoStopConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The initial capacity of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-initialcapacity
     */
    public initialCapacity: Array<CfnApplication.InitialCapacityConfigKeyValuePairProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The maximum capacity of the application. This is cumulative across all workers at any given point in time during the lifespan of the application is created. No new resources will be created once any one of the defined limits is hit.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-maximumcapacity
     */
    public maximumCapacity: CfnApplication.MaximumAllowedResourcesProperty | cdk.IResolvable | undefined;

    /**
     * The name of the application.
     *
     * *Minimum* : 1
     *
     * *Maximum* : 64
     *
     * *Pattern* : `^[A-Za-z0-9._\\/#-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-name
     */
    public name: string | undefined;

    /**
     * The network configuration for customer VPC connectivity for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-networkconfiguration
     */
    public networkConfiguration: CfnApplication.NetworkConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The tags assigned to the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::EMRServerless::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
        super(scope, id, { type: CfnApplication.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'releaseLabel', this);
        cdk.requireProperty(props, 'type', this);
        this.attrApplicationId = cdk.Token.asString(this.getAtt('ApplicationId', cdk.ResolutionTypeHint.STRING));
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.releaseLabel = props.releaseLabel;
        this.type = props.type;
        this.architecture = props.architecture;
        this.autoStartConfiguration = props.autoStartConfiguration;
        this.autoStopConfiguration = props.autoStopConfiguration;
        this.initialCapacity = props.initialCapacity;
        this.maximumCapacity = props.maximumCapacity;
        this.name = props.name;
        this.networkConfiguration = props.networkConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EMRServerless::Application", props.tags, { tagPropertyName: 'tags' });
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
            releaseLabel: this.releaseLabel,
            type: this.type,
            architecture: this.architecture,
            autoStartConfiguration: this.autoStartConfiguration,
            autoStopConfiguration: this.autoStopConfiguration,
            initialCapacity: this.initialCapacity,
            maximumCapacity: this.maximumCapacity,
            name: this.name,
            networkConfiguration: this.networkConfiguration,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationPropsToCloudFormation(props);
    }
}

export namespace CfnApplication {
    /**
     * The conﬁguration for an application to automatically start on job submission.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-autostartconfiguration.html
     */
    export interface AutoStartConfigurationProperty {
        /**
         * Enables the application to automatically start on job submission. Defaults to true.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-autostartconfiguration.html#cfn-emrserverless-application-autostartconfiguration-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AutoStartConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AutoStartConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_AutoStartConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "AutoStartConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMRServerless::Application.AutoStartConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `AutoStartConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMRServerless::Application.AutoStartConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationAutoStartConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_AutoStartConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnApplicationAutoStartConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.AutoStartConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.AutoStartConfigurationProperty>();
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The conﬁguration for an application to automatically stop after a certain amount of time being idle.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-autostopconfiguration.html
     */
    export interface AutoStopConfigurationProperty {
        /**
         * Enables the application to automatically stop after a certain amount of time being idle. Defaults to true.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-autostopconfiguration.html#cfn-emrserverless-application-autostopconfiguration-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * The amount of idle time in minutes after which your application will automatically stop. Defaults to 15 minutes.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 10080
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-autostopconfiguration.html#cfn-emrserverless-application-autostopconfiguration-idletimeoutminutes
         */
        readonly idleTimeoutMinutes?: number;
    }
}

/**
 * Determine whether the given properties match those of a `AutoStopConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AutoStopConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_AutoStopConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('idleTimeoutMinutes', cdk.validateNumber)(properties.idleTimeoutMinutes));
    return errors.wrap('supplied properties not correct for "AutoStopConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMRServerless::Application.AutoStopConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `AutoStopConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMRServerless::Application.AutoStopConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationAutoStopConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_AutoStopConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        IdleTimeoutMinutes: cdk.numberToCloudFormation(properties.idleTimeoutMinutes),
    };
}

// @ts-ignore TS6133
function CfnApplicationAutoStopConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.AutoStopConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.AutoStopConfigurationProperty>();
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('idleTimeoutMinutes', 'IdleTimeoutMinutes', properties.IdleTimeoutMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.IdleTimeoutMinutes) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The initial capacity configuration per worker.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfig.html
     */
    export interface InitialCapacityConfigProperty {
        /**
         * The resource configuration of the initial capacity configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfig.html#cfn-emrserverless-application-initialcapacityconfig-workerconfiguration
         */
        readonly workerConfiguration: CfnApplication.WorkerConfigurationProperty | cdk.IResolvable;
        /**
         * The number of workers in the initial capacity configuration.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 1000000
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfig.html#cfn-emrserverless-application-initialcapacityconfig-workercount
         */
        readonly workerCount: number;
    }
}

/**
 * Determine whether the given properties match those of a `InitialCapacityConfigProperty`
 *
 * @param properties - the TypeScript properties of a `InitialCapacityConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_InitialCapacityConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('workerConfiguration', cdk.requiredValidator)(properties.workerConfiguration));
    errors.collect(cdk.propertyValidator('workerConfiguration', CfnApplication_WorkerConfigurationPropertyValidator)(properties.workerConfiguration));
    errors.collect(cdk.propertyValidator('workerCount', cdk.requiredValidator)(properties.workerCount));
    errors.collect(cdk.propertyValidator('workerCount', cdk.validateNumber)(properties.workerCount));
    return errors.wrap('supplied properties not correct for "InitialCapacityConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMRServerless::Application.InitialCapacityConfig` resource
 *
 * @param properties - the TypeScript properties of a `InitialCapacityConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMRServerless::Application.InitialCapacityConfig` resource.
 */
// @ts-ignore TS6133
function cfnApplicationInitialCapacityConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_InitialCapacityConfigPropertyValidator(properties).assertSuccess();
    return {
        WorkerConfiguration: cfnApplicationWorkerConfigurationPropertyToCloudFormation(properties.workerConfiguration),
        WorkerCount: cdk.numberToCloudFormation(properties.workerCount),
    };
}

// @ts-ignore TS6133
function CfnApplicationInitialCapacityConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InitialCapacityConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InitialCapacityConfigProperty>();
    ret.addPropertyResult('workerConfiguration', 'WorkerConfiguration', CfnApplicationWorkerConfigurationPropertyFromCloudFormation(properties.WorkerConfiguration));
    ret.addPropertyResult('workerCount', 'WorkerCount', cfn_parse.FromCloudFormation.getNumber(properties.WorkerCount));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The initial capacity configuration per worker.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfigkeyvaluepair.html
     */
    export interface InitialCapacityConfigKeyValuePairProperty {
        /**
         * The worker type for an analytics framework. For Spark applications, the key can either be set to `Driver` or `Executor` . For Hive applications, it can be set to `HiveDriver` or `TezTask` .
         *
         * *Minimum* : 1
         *
         * *Maximum* : 50
         *
         * *Pattern* : `^[a-zA-Z]+[-_]*[a-zA-Z]+$`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfigkeyvaluepair.html#cfn-emrserverless-application-initialcapacityconfigkeyvaluepair-key
         */
        readonly key: string;
        /**
         * The value for the initial capacity configuration per worker.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfigkeyvaluepair.html#cfn-emrserverless-application-initialcapacityconfigkeyvaluepair-value
         */
        readonly value: CfnApplication.InitialCapacityConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InitialCapacityConfigKeyValuePairProperty`
 *
 * @param properties - the TypeScript properties of a `InitialCapacityConfigKeyValuePairProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_InitialCapacityConfigKeyValuePairPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', CfnApplication_InitialCapacityConfigPropertyValidator)(properties.value));
    return errors.wrap('supplied properties not correct for "InitialCapacityConfigKeyValuePairProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMRServerless::Application.InitialCapacityConfigKeyValuePair` resource
 *
 * @param properties - the TypeScript properties of a `InitialCapacityConfigKeyValuePairProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMRServerless::Application.InitialCapacityConfigKeyValuePair` resource.
 */
// @ts-ignore TS6133
function cfnApplicationInitialCapacityConfigKeyValuePairPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_InitialCapacityConfigKeyValuePairPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cfnApplicationInitialCapacityConfigPropertyToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnApplicationInitialCapacityConfigKeyValuePairPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InitialCapacityConfigKeyValuePairProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InitialCapacityConfigKeyValuePairProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', CfnApplicationInitialCapacityConfigPropertyFromCloudFormation(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The maximum allowed cumulative resources for an application. No new resources will be created once the limit is hit.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-maximumallowedresources.html
     */
    export interface MaximumAllowedResourcesProperty {
        /**
         * The maximum allowed CPU for an application.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 15
         *
         * *Pattern* : `^[1-9][0-9]*(\\s)?(vCPU|vcpu|VCPU)?$`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-maximumallowedresources.html#cfn-emrserverless-application-maximumallowedresources-cpu
         */
        readonly cpu: string;
        /**
         * The maximum allowed disk for an application.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 15
         *
         * *Pattern* : `^[1-9][0-9]*(\\s)?(GB|gb|gB|Gb)$"`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-maximumallowedresources.html#cfn-emrserverless-application-maximumallowedresources-disk
         */
        readonly disk?: string;
        /**
         * The maximum allowed resources for an application.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 15
         *
         * *Pattern* : `^[1-9][0-9]*(\\s)?(GB|gb|gB|Gb)?$`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-maximumallowedresources.html#cfn-emrserverless-application-maximumallowedresources-memory
         */
        readonly memory: string;
    }
}

/**
 * Determine whether the given properties match those of a `MaximumAllowedResourcesProperty`
 *
 * @param properties - the TypeScript properties of a `MaximumAllowedResourcesProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_MaximumAllowedResourcesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cpu', cdk.requiredValidator)(properties.cpu));
    errors.collect(cdk.propertyValidator('cpu', cdk.validateString)(properties.cpu));
    errors.collect(cdk.propertyValidator('disk', cdk.validateString)(properties.disk));
    errors.collect(cdk.propertyValidator('memory', cdk.requiredValidator)(properties.memory));
    errors.collect(cdk.propertyValidator('memory', cdk.validateString)(properties.memory));
    return errors.wrap('supplied properties not correct for "MaximumAllowedResourcesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMRServerless::Application.MaximumAllowedResources` resource
 *
 * @param properties - the TypeScript properties of a `MaximumAllowedResourcesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMRServerless::Application.MaximumAllowedResources` resource.
 */
// @ts-ignore TS6133
function cfnApplicationMaximumAllowedResourcesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_MaximumAllowedResourcesPropertyValidator(properties).assertSuccess();
    return {
        Cpu: cdk.stringToCloudFormation(properties.cpu),
        Disk: cdk.stringToCloudFormation(properties.disk),
        Memory: cdk.stringToCloudFormation(properties.memory),
    };
}

// @ts-ignore TS6133
function CfnApplicationMaximumAllowedResourcesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.MaximumAllowedResourcesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.MaximumAllowedResourcesProperty>();
    ret.addPropertyResult('cpu', 'Cpu', cfn_parse.FromCloudFormation.getString(properties.Cpu));
    ret.addPropertyResult('disk', 'Disk', properties.Disk != null ? cfn_parse.FromCloudFormation.getString(properties.Disk) : undefined);
    ret.addPropertyResult('memory', 'Memory', cfn_parse.FromCloudFormation.getString(properties.Memory));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The network configuration for customer VPC connectivity.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-networkconfiguration.html
     */
    export interface NetworkConfigurationProperty {
        /**
         * The array of security group Ids for customer VPC connectivity.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 32
         *
         * *Pattern* : `^[-0-9a-zA-Z]+`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-networkconfiguration.html#cfn-emrserverless-application-networkconfiguration-securitygroupids
         */
        readonly securityGroupIds?: string[];
        /**
         * The array of subnet Ids for customer VPC connectivity.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 32
         *
         * *Pattern* : `^[-0-9a-zA-Z]+`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-networkconfiguration.html#cfn-emrserverless-application-networkconfiguration-subnetids
         */
        readonly subnetIds?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `NetworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_NetworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    return errors.wrap('supplied properties not correct for "NetworkConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMRServerless::Application.NetworkConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMRServerless::Application.NetworkConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationNetworkConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_NetworkConfigurationPropertyValidator(properties).assertSuccess();
    return {
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    };
}

// @ts-ignore TS6133
function CfnApplicationNetworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.NetworkConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.NetworkConfigurationProperty>();
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds) : undefined);
    ret.addPropertyResult('subnetIds', 'SubnetIds', properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The resource configuration of the initial capacity configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-workerconfiguration.html
     */
    export interface WorkerConfigurationProperty {
        /**
         * *Minimum* : 1
         *
         * *Maximum* : 15
         *
         * *Pattern* : `^[1-9][0-9]*(\\s)?(vCPU|vcpu|VCPU)?$`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-workerconfiguration.html#cfn-emrserverless-application-workerconfiguration-cpu
         */
        readonly cpu: string;
        /**
         * *Minimum* : 1
         *
         * *Maximum* : 15
         *
         * *Pattern* : `^[1-9][0-9]*(\\s)?(GB|gb|gB|Gb)$"`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-workerconfiguration.html#cfn-emrserverless-application-workerconfiguration-disk
         */
        readonly disk?: string;
        /**
         * *Minimum* : 1
         *
         * *Maximum* : 15
         *
         * *Pattern* : `^[1-9][0-9]*(\\s)?(GB|gb|gB|Gb)?$`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-workerconfiguration.html#cfn-emrserverless-application-workerconfiguration-memory
         */
        readonly memory: string;
    }
}

/**
 * Determine whether the given properties match those of a `WorkerConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WorkerConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_WorkerConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cpu', cdk.requiredValidator)(properties.cpu));
    errors.collect(cdk.propertyValidator('cpu', cdk.validateString)(properties.cpu));
    errors.collect(cdk.propertyValidator('disk', cdk.validateString)(properties.disk));
    errors.collect(cdk.propertyValidator('memory', cdk.requiredValidator)(properties.memory));
    errors.collect(cdk.propertyValidator('memory', cdk.validateString)(properties.memory));
    return errors.wrap('supplied properties not correct for "WorkerConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EMRServerless::Application.WorkerConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `WorkerConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EMRServerless::Application.WorkerConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationWorkerConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_WorkerConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Cpu: cdk.stringToCloudFormation(properties.cpu),
        Disk: cdk.stringToCloudFormation(properties.disk),
        Memory: cdk.stringToCloudFormation(properties.memory),
    };
}

// @ts-ignore TS6133
function CfnApplicationWorkerConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.WorkerConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.WorkerConfigurationProperty>();
    ret.addPropertyResult('cpu', 'Cpu', cfn_parse.FromCloudFormation.getString(properties.Cpu));
    ret.addPropertyResult('disk', 'Disk', properties.Disk != null ? cfn_parse.FromCloudFormation.getString(properties.Disk) : undefined);
    ret.addPropertyResult('memory', 'Memory', cfn_parse.FromCloudFormation.getString(properties.Memory));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
