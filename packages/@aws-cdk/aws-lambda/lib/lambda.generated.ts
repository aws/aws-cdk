// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-11T08:25:19.204Z","fingerprint":"2QRIIFa1I5221DSqtH0VHZcqNAUXsuErQ2pZDrdL8+0="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAlias`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html
 */
export interface CfnAliasProps {

    /**
     * The name of the Lambda function.
     *
     * **Name formats** - *Function name* - `MyFunction` .
     * - *Function ARN* - `arn:aws:lambda:us-west-2:123456789012:function:MyFunction` .
     * - *Partial ARN* - `123456789012:function:MyFunction` .
     *
     * The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-functionname
     */
    readonly functionName: string;

    /**
     * The function version that the alias invokes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-functionversion
     */
    readonly functionVersion: string;

    /**
     * The name of the alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-name
     */
    readonly name: string;

    /**
     * A description of the alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-description
     */
    readonly description?: string;

    /**
     * Specifies a [provisioned concurrency](https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html) configuration for a function's alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-provisionedconcurrencyconfig
     */
    readonly provisionedConcurrencyConfig?: CfnAlias.ProvisionedConcurrencyConfigurationProperty | cdk.IResolvable;

    /**
     * The [routing configuration](https://docs.aws.amazon.com/lambda/latest/dg/lambda-traffic-shifting-using-aliases.html) of the alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-routingconfig
     */
    readonly routingConfig?: CfnAlias.AliasRoutingConfigurationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnAliasProps`
 *
 * @param properties - the TypeScript properties of a `CfnAliasProps`
 *
 * @returns the result of the validation.
 */
function CfnAliasPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('functionName', cdk.requiredValidator)(properties.functionName));
    errors.collect(cdk.propertyValidator('functionName', cdk.validateString)(properties.functionName));
    errors.collect(cdk.propertyValidator('functionVersion', cdk.requiredValidator)(properties.functionVersion));
    errors.collect(cdk.propertyValidator('functionVersion', cdk.validateString)(properties.functionVersion));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('provisionedConcurrencyConfig', CfnAlias_ProvisionedConcurrencyConfigurationPropertyValidator)(properties.provisionedConcurrencyConfig));
    errors.collect(cdk.propertyValidator('routingConfig', CfnAlias_AliasRoutingConfigurationPropertyValidator)(properties.routingConfig));
    return errors.wrap('supplied properties not correct for "CfnAliasProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Alias` resource
 *
 * @param properties - the TypeScript properties of a `CfnAliasProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Alias` resource.
 */
// @ts-ignore TS6133
function cfnAliasPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAliasPropsValidator(properties).assertSuccess();
    return {
        FunctionName: cdk.stringToCloudFormation(properties.functionName),
        FunctionVersion: cdk.stringToCloudFormation(properties.functionVersion),
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        ProvisionedConcurrencyConfig: cfnAliasProvisionedConcurrencyConfigurationPropertyToCloudFormation(properties.provisionedConcurrencyConfig),
        RoutingConfig: cfnAliasAliasRoutingConfigurationPropertyToCloudFormation(properties.routingConfig),
    };
}

// @ts-ignore TS6133
function CfnAliasPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAliasProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAliasProps>();
    ret.addPropertyResult('functionName', 'FunctionName', cfn_parse.FromCloudFormation.getString(properties.FunctionName));
    ret.addPropertyResult('functionVersion', 'FunctionVersion', cfn_parse.FromCloudFormation.getString(properties.FunctionVersion));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('provisionedConcurrencyConfig', 'ProvisionedConcurrencyConfig', properties.ProvisionedConcurrencyConfig != null ? CfnAliasProvisionedConcurrencyConfigurationPropertyFromCloudFormation(properties.ProvisionedConcurrencyConfig) : undefined);
    ret.addPropertyResult('routingConfig', 'RoutingConfig', properties.RoutingConfig != null ? CfnAliasAliasRoutingConfigurationPropertyFromCloudFormation(properties.RoutingConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lambda::Alias`
 *
 * The `AWS::Lambda::Alias` resource creates an [alias](https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html) for a Lambda function version. Use aliases to provide clients with a function identifier that you can update to invoke a different version.
 *
 * You can also map an alias to split invocation requests between two versions. Use the `RoutingConfig` parameter to specify a second version and the percentage of invocation requests that it receives.
 *
 * @cloudformationResource AWS::Lambda::Alias
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html
 */
export class CfnAlias extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lambda::Alias";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAlias {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAliasPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAlias(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the Lambda function.
     *
     * **Name formats** - *Function name* - `MyFunction` .
     * - *Function ARN* - `arn:aws:lambda:us-west-2:123456789012:function:MyFunction` .
     * - *Partial ARN* - `123456789012:function:MyFunction` .
     *
     * The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-functionname
     */
    public functionName: string;

    /**
     * The function version that the alias invokes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-functionversion
     */
    public functionVersion: string;

    /**
     * The name of the alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-name
     */
    public name: string;

    /**
     * A description of the alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-description
     */
    public description: string | undefined;

    /**
     * Specifies a [provisioned concurrency](https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html) configuration for a function's alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-provisionedconcurrencyconfig
     */
    public provisionedConcurrencyConfig: CfnAlias.ProvisionedConcurrencyConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The [routing configuration](https://docs.aws.amazon.com/lambda/latest/dg/lambda-traffic-shifting-using-aliases.html) of the alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-routingconfig
     */
    public routingConfig: CfnAlias.AliasRoutingConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Lambda::Alias`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAliasProps) {
        super(scope, id, { type: CfnAlias.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'functionName', this);
        cdk.requireProperty(props, 'functionVersion', this);
        cdk.requireProperty(props, 'name', this);

        this.functionName = props.functionName;
        this.functionVersion = props.functionVersion;
        this.name = props.name;
        this.description = props.description;
        this.provisionedConcurrencyConfig = props.provisionedConcurrencyConfig;
        this.routingConfig = props.routingConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAlias.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            functionName: this.functionName,
            functionVersion: this.functionVersion,
            name: this.name,
            description: this.description,
            provisionedConcurrencyConfig: this.provisionedConcurrencyConfig,
            routingConfig: this.routingConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAliasPropsToCloudFormation(props);
    }
}

export namespace CfnAlias {
    /**
     * The [traffic-shifting](https://docs.aws.amazon.com/lambda/latest/dg/lambda-traffic-shifting-using-aliases.html) configuration of a Lambda function alias.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-aliasroutingconfiguration.html
     */
    export interface AliasRoutingConfigurationProperty {
        /**
         * The second version, and the percentage of traffic that's routed to it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-aliasroutingconfiguration.html#cfn-lambda-alias-aliasroutingconfiguration-additionalversionweights
         */
        readonly additionalVersionWeights: Array<CfnAlias.VersionWeightProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AliasRoutingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AliasRoutingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAlias_AliasRoutingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('additionalVersionWeights', cdk.requiredValidator)(properties.additionalVersionWeights));
    errors.collect(cdk.propertyValidator('additionalVersionWeights', cdk.listValidator(CfnAlias_VersionWeightPropertyValidator))(properties.additionalVersionWeights));
    return errors.wrap('supplied properties not correct for "AliasRoutingConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Alias.AliasRoutingConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `AliasRoutingConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Alias.AliasRoutingConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnAliasAliasRoutingConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAlias_AliasRoutingConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AdditionalVersionWeights: cdk.listMapper(cfnAliasVersionWeightPropertyToCloudFormation)(properties.additionalVersionWeights),
    };
}

// @ts-ignore TS6133
function CfnAliasAliasRoutingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlias.AliasRoutingConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlias.AliasRoutingConfigurationProperty>();
    ret.addPropertyResult('additionalVersionWeights', 'AdditionalVersionWeights', cfn_parse.FromCloudFormation.getArray(CfnAliasVersionWeightPropertyFromCloudFormation)(properties.AdditionalVersionWeights));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAlias {
    /**
     * A provisioned concurrency configuration for a function's alias.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-provisionedconcurrencyconfiguration.html
     */
    export interface ProvisionedConcurrencyConfigurationProperty {
        /**
         * The amount of provisioned concurrency to allocate for the alias.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-provisionedconcurrencyconfiguration.html#cfn-lambda-alias-provisionedconcurrencyconfiguration-provisionedconcurrentexecutions
         */
        readonly provisionedConcurrentExecutions: number;
    }
}

/**
 * Determine whether the given properties match those of a `ProvisionedConcurrencyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionedConcurrencyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAlias_ProvisionedConcurrencyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('provisionedConcurrentExecutions', cdk.requiredValidator)(properties.provisionedConcurrentExecutions));
    errors.collect(cdk.propertyValidator('provisionedConcurrentExecutions', cdk.validateNumber)(properties.provisionedConcurrentExecutions));
    return errors.wrap('supplied properties not correct for "ProvisionedConcurrencyConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Alias.ProvisionedConcurrencyConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ProvisionedConcurrencyConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Alias.ProvisionedConcurrencyConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnAliasProvisionedConcurrencyConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAlias_ProvisionedConcurrencyConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ProvisionedConcurrentExecutions: cdk.numberToCloudFormation(properties.provisionedConcurrentExecutions),
    };
}

// @ts-ignore TS6133
function CfnAliasProvisionedConcurrencyConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlias.ProvisionedConcurrencyConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlias.ProvisionedConcurrencyConfigurationProperty>();
    ret.addPropertyResult('provisionedConcurrentExecutions', 'ProvisionedConcurrentExecutions', cfn_parse.FromCloudFormation.getNumber(properties.ProvisionedConcurrentExecutions));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAlias {
    /**
     * The [traffic-shifting](https://docs.aws.amazon.com/lambda/latest/dg/lambda-traffic-shifting-using-aliases.html) configuration of a Lambda function alias.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-versionweight.html
     */
    export interface VersionWeightProperty {
        /**
         * The qualifier of the second version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-versionweight.html#cfn-lambda-alias-versionweight-functionversion
         */
        readonly functionVersion: string;
        /**
         * The percentage of traffic that the alias routes to the second version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-versionweight.html#cfn-lambda-alias-versionweight-functionweight
         */
        readonly functionWeight: number;
    }
}

/**
 * Determine whether the given properties match those of a `VersionWeightProperty`
 *
 * @param properties - the TypeScript properties of a `VersionWeightProperty`
 *
 * @returns the result of the validation.
 */
function CfnAlias_VersionWeightPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('functionVersion', cdk.requiredValidator)(properties.functionVersion));
    errors.collect(cdk.propertyValidator('functionVersion', cdk.validateString)(properties.functionVersion));
    errors.collect(cdk.propertyValidator('functionWeight', cdk.requiredValidator)(properties.functionWeight));
    errors.collect(cdk.propertyValidator('functionWeight', cdk.validateNumber)(properties.functionWeight));
    return errors.wrap('supplied properties not correct for "VersionWeightProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Alias.VersionWeight` resource
 *
 * @param properties - the TypeScript properties of a `VersionWeightProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Alias.VersionWeight` resource.
 */
// @ts-ignore TS6133
function cfnAliasVersionWeightPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAlias_VersionWeightPropertyValidator(properties).assertSuccess();
    return {
        FunctionVersion: cdk.stringToCloudFormation(properties.functionVersion),
        FunctionWeight: cdk.numberToCloudFormation(properties.functionWeight),
    };
}

// @ts-ignore TS6133
function CfnAliasVersionWeightPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlias.VersionWeightProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlias.VersionWeightProperty>();
    ret.addPropertyResult('functionVersion', 'FunctionVersion', cfn_parse.FromCloudFormation.getString(properties.FunctionVersion));
    ret.addPropertyResult('functionWeight', 'FunctionWeight', cfn_parse.FromCloudFormation.getNumber(properties.FunctionWeight));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnCodeSigningConfig`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-codesigningconfig.html
 */
export interface CfnCodeSigningConfigProps {

    /**
     * List of allowed publishers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-codesigningconfig.html#cfn-lambda-codesigningconfig-allowedpublishers
     */
    readonly allowedPublishers: CfnCodeSigningConfig.AllowedPublishersProperty | cdk.IResolvable;

    /**
     * The code signing policy controls the validation failure action for signature mismatch or expiry.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-codesigningconfig.html#cfn-lambda-codesigningconfig-codesigningpolicies
     */
    readonly codeSigningPolicies?: CfnCodeSigningConfig.CodeSigningPoliciesProperty | cdk.IResolvable;

    /**
     * Code signing configuration description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-codesigningconfig.html#cfn-lambda-codesigningconfig-description
     */
    readonly description?: string;
}

/**
 * Determine whether the given properties match those of a `CfnCodeSigningConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnCodeSigningConfigProps`
 *
 * @returns the result of the validation.
 */
function CfnCodeSigningConfigPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowedPublishers', cdk.requiredValidator)(properties.allowedPublishers));
    errors.collect(cdk.propertyValidator('allowedPublishers', CfnCodeSigningConfig_AllowedPublishersPropertyValidator)(properties.allowedPublishers));
    errors.collect(cdk.propertyValidator('codeSigningPolicies', CfnCodeSigningConfig_CodeSigningPoliciesPropertyValidator)(properties.codeSigningPolicies));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    return errors.wrap('supplied properties not correct for "CfnCodeSigningConfigProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::CodeSigningConfig` resource
 *
 * @param properties - the TypeScript properties of a `CfnCodeSigningConfigProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::CodeSigningConfig` resource.
 */
// @ts-ignore TS6133
function cfnCodeSigningConfigPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCodeSigningConfigPropsValidator(properties).assertSuccess();
    return {
        AllowedPublishers: cfnCodeSigningConfigAllowedPublishersPropertyToCloudFormation(properties.allowedPublishers),
        CodeSigningPolicies: cfnCodeSigningConfigCodeSigningPoliciesPropertyToCloudFormation(properties.codeSigningPolicies),
        Description: cdk.stringToCloudFormation(properties.description),
    };
}

// @ts-ignore TS6133
function CfnCodeSigningConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCodeSigningConfigProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCodeSigningConfigProps>();
    ret.addPropertyResult('allowedPublishers', 'AllowedPublishers', CfnCodeSigningConfigAllowedPublishersPropertyFromCloudFormation(properties.AllowedPublishers));
    ret.addPropertyResult('codeSigningPolicies', 'CodeSigningPolicies', properties.CodeSigningPolicies != null ? CfnCodeSigningConfigCodeSigningPoliciesPropertyFromCloudFormation(properties.CodeSigningPolicies) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lambda::CodeSigningConfig`
 *
 * Details about a [Code signing configuration](https://docs.aws.amazon.com/lambda/latest/dg/configuration-codesigning.html) .
 *
 * @cloudformationResource AWS::Lambda::CodeSigningConfig
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-codesigningconfig.html
 */
export class CfnCodeSigningConfig extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lambda::CodeSigningConfig";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCodeSigningConfig {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCodeSigningConfigPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCodeSigningConfig(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the code signing configuration.
     * @cloudformationAttribute CodeSigningConfigArn
     */
    public readonly attrCodeSigningConfigArn: string;

    /**
     * The code signing configuration ID.
     * @cloudformationAttribute CodeSigningConfigId
     */
    public readonly attrCodeSigningConfigId: string;

    /**
     * List of allowed publishers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-codesigningconfig.html#cfn-lambda-codesigningconfig-allowedpublishers
     */
    public allowedPublishers: CfnCodeSigningConfig.AllowedPublishersProperty | cdk.IResolvable;

    /**
     * The code signing policy controls the validation failure action for signature mismatch or expiry.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-codesigningconfig.html#cfn-lambda-codesigningconfig-codesigningpolicies
     */
    public codeSigningPolicies: CfnCodeSigningConfig.CodeSigningPoliciesProperty | cdk.IResolvable | undefined;

    /**
     * Code signing configuration description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-codesigningconfig.html#cfn-lambda-codesigningconfig-description
     */
    public description: string | undefined;

    /**
     * Create a new `AWS::Lambda::CodeSigningConfig`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCodeSigningConfigProps) {
        super(scope, id, { type: CfnCodeSigningConfig.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'allowedPublishers', this);
        this.attrCodeSigningConfigArn = cdk.Token.asString(this.getAtt('CodeSigningConfigArn', cdk.ResolutionTypeHint.STRING));
        this.attrCodeSigningConfigId = cdk.Token.asString(this.getAtt('CodeSigningConfigId', cdk.ResolutionTypeHint.STRING));

        this.allowedPublishers = props.allowedPublishers;
        this.codeSigningPolicies = props.codeSigningPolicies;
        this.description = props.description;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCodeSigningConfig.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            allowedPublishers: this.allowedPublishers,
            codeSigningPolicies: this.codeSigningPolicies,
            description: this.description,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCodeSigningConfigPropsToCloudFormation(props);
    }
}

export namespace CfnCodeSigningConfig {
    /**
     * List of signing profiles that can sign a code package.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-codesigningconfig-allowedpublishers.html
     */
    export interface AllowedPublishersProperty {
        /**
         * The Amazon Resource Name (ARN) for each of the signing profiles. A signing profile defines a trusted user who can sign a code package.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-codesigningconfig-allowedpublishers.html#cfn-lambda-codesigningconfig-allowedpublishers-signingprofileversionarns
         */
        readonly signingProfileVersionArns: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AllowedPublishersProperty`
 *
 * @param properties - the TypeScript properties of a `AllowedPublishersProperty`
 *
 * @returns the result of the validation.
 */
function CfnCodeSigningConfig_AllowedPublishersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('signingProfileVersionArns', cdk.requiredValidator)(properties.signingProfileVersionArns));
    errors.collect(cdk.propertyValidator('signingProfileVersionArns', cdk.listValidator(cdk.validateString))(properties.signingProfileVersionArns));
    return errors.wrap('supplied properties not correct for "AllowedPublishersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::CodeSigningConfig.AllowedPublishers` resource
 *
 * @param properties - the TypeScript properties of a `AllowedPublishersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::CodeSigningConfig.AllowedPublishers` resource.
 */
// @ts-ignore TS6133
function cfnCodeSigningConfigAllowedPublishersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCodeSigningConfig_AllowedPublishersPropertyValidator(properties).assertSuccess();
    return {
        SigningProfileVersionArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.signingProfileVersionArns),
    };
}

// @ts-ignore TS6133
function CfnCodeSigningConfigAllowedPublishersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCodeSigningConfig.AllowedPublishersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCodeSigningConfig.AllowedPublishersProperty>();
    ret.addPropertyResult('signingProfileVersionArns', 'SigningProfileVersionArns', cfn_parse.FromCloudFormation.getStringArray(properties.SigningProfileVersionArns));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCodeSigningConfig {
    /**
     * Code signing configuration [policies](https://docs.aws.amazon.com/lambda/latest/dg/configuration-codesigning.html#config-codesigning-policies) specify the validation failure action for signature mismatch or expiry.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-codesigningconfig-codesigningpolicies.html
     */
    export interface CodeSigningPoliciesProperty {
        /**
         * Code signing configuration policy for deployment validation failure. If you set the policy to `Enforce` , Lambda blocks the deployment request if signature validation checks fail. If you set the policy to `Warn` , Lambda allows the deployment and creates a CloudWatch log.
         *
         * Default value: `Warn`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-codesigningconfig-codesigningpolicies.html#cfn-lambda-codesigningconfig-codesigningpolicies-untrustedartifactondeployment
         */
        readonly untrustedArtifactOnDeployment: string;
    }
}

/**
 * Determine whether the given properties match those of a `CodeSigningPoliciesProperty`
 *
 * @param properties - the TypeScript properties of a `CodeSigningPoliciesProperty`
 *
 * @returns the result of the validation.
 */
function CfnCodeSigningConfig_CodeSigningPoliciesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('untrustedArtifactOnDeployment', cdk.requiredValidator)(properties.untrustedArtifactOnDeployment));
    errors.collect(cdk.propertyValidator('untrustedArtifactOnDeployment', cdk.validateString)(properties.untrustedArtifactOnDeployment));
    return errors.wrap('supplied properties not correct for "CodeSigningPoliciesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::CodeSigningConfig.CodeSigningPolicies` resource
 *
 * @param properties - the TypeScript properties of a `CodeSigningPoliciesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::CodeSigningConfig.CodeSigningPolicies` resource.
 */
// @ts-ignore TS6133
function cfnCodeSigningConfigCodeSigningPoliciesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCodeSigningConfig_CodeSigningPoliciesPropertyValidator(properties).assertSuccess();
    return {
        UntrustedArtifactOnDeployment: cdk.stringToCloudFormation(properties.untrustedArtifactOnDeployment),
    };
}

// @ts-ignore TS6133
function CfnCodeSigningConfigCodeSigningPoliciesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCodeSigningConfig.CodeSigningPoliciesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCodeSigningConfig.CodeSigningPoliciesProperty>();
    ret.addPropertyResult('untrustedArtifactOnDeployment', 'UntrustedArtifactOnDeployment', cfn_parse.FromCloudFormation.getString(properties.UntrustedArtifactOnDeployment));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnEventInvokeConfig`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html
 */
export interface CfnEventInvokeConfigProps {

    /**
     * The name of the Lambda function.
     *
     * *Minimum* : `1`
     *
     * *Maximum* : `64`
     *
     * *Pattern* : `([a-zA-Z0-9-_]+)`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html#cfn-lambda-eventinvokeconfig-functionname
     */
    readonly functionName: string;

    /**
     * The identifier of a version or alias.
     *
     * - *Version* - A version number.
     * - *Alias* - An alias name.
     * - *Latest* - To specify the unpublished version, use `$LATEST` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html#cfn-lambda-eventinvokeconfig-qualifier
     */
    readonly qualifier: string;

    /**
     * A destination for events after they have been sent to a function for processing.
     *
     * **Destinations** - *Function* - The Amazon Resource Name (ARN) of a Lambda function.
     * - *Queue* - The ARN of a standard SQS queue.
     * - *Topic* - The ARN of a standard SNS topic.
     * - *Event Bus* - The ARN of an Amazon EventBridge event bus.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html#cfn-lambda-eventinvokeconfig-destinationconfig
     */
    readonly destinationConfig?: CfnEventInvokeConfig.DestinationConfigProperty | cdk.IResolvable;

    /**
     * The maximum age of a request that Lambda sends to a function for processing.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html#cfn-lambda-eventinvokeconfig-maximumeventageinseconds
     */
    readonly maximumEventAgeInSeconds?: number;

    /**
     * The maximum number of times to retry when the function returns an error.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html#cfn-lambda-eventinvokeconfig-maximumretryattempts
     */
    readonly maximumRetryAttempts?: number;
}

/**
 * Determine whether the given properties match those of a `CfnEventInvokeConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnEventInvokeConfigProps`
 *
 * @returns the result of the validation.
 */
function CfnEventInvokeConfigPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationConfig', CfnEventInvokeConfig_DestinationConfigPropertyValidator)(properties.destinationConfig));
    errors.collect(cdk.propertyValidator('functionName', cdk.requiredValidator)(properties.functionName));
    errors.collect(cdk.propertyValidator('functionName', cdk.validateString)(properties.functionName));
    errors.collect(cdk.propertyValidator('maximumEventAgeInSeconds', cdk.validateNumber)(properties.maximumEventAgeInSeconds));
    errors.collect(cdk.propertyValidator('maximumRetryAttempts', cdk.validateNumber)(properties.maximumRetryAttempts));
    errors.collect(cdk.propertyValidator('qualifier', cdk.requiredValidator)(properties.qualifier));
    errors.collect(cdk.propertyValidator('qualifier', cdk.validateString)(properties.qualifier));
    return errors.wrap('supplied properties not correct for "CfnEventInvokeConfigProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::EventInvokeConfig` resource
 *
 * @param properties - the TypeScript properties of a `CfnEventInvokeConfigProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::EventInvokeConfig` resource.
 */
// @ts-ignore TS6133
function cfnEventInvokeConfigPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventInvokeConfigPropsValidator(properties).assertSuccess();
    return {
        FunctionName: cdk.stringToCloudFormation(properties.functionName),
        Qualifier: cdk.stringToCloudFormation(properties.qualifier),
        DestinationConfig: cfnEventInvokeConfigDestinationConfigPropertyToCloudFormation(properties.destinationConfig),
        MaximumEventAgeInSeconds: cdk.numberToCloudFormation(properties.maximumEventAgeInSeconds),
        MaximumRetryAttempts: cdk.numberToCloudFormation(properties.maximumRetryAttempts),
    };
}

// @ts-ignore TS6133
function CfnEventInvokeConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventInvokeConfigProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventInvokeConfigProps>();
    ret.addPropertyResult('functionName', 'FunctionName', cfn_parse.FromCloudFormation.getString(properties.FunctionName));
    ret.addPropertyResult('qualifier', 'Qualifier', cfn_parse.FromCloudFormation.getString(properties.Qualifier));
    ret.addPropertyResult('destinationConfig', 'DestinationConfig', properties.DestinationConfig != null ? CfnEventInvokeConfigDestinationConfigPropertyFromCloudFormation(properties.DestinationConfig) : undefined);
    ret.addPropertyResult('maximumEventAgeInSeconds', 'MaximumEventAgeInSeconds', properties.MaximumEventAgeInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumEventAgeInSeconds) : undefined);
    ret.addPropertyResult('maximumRetryAttempts', 'MaximumRetryAttempts', properties.MaximumRetryAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRetryAttempts) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lambda::EventInvokeConfig`
 *
 * The `AWS::Lambda::EventInvokeConfig` resource configures options for [asynchronous invocation](https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html) on a version or an alias.
 *
 * By default, Lambda retries an asynchronous invocation twice if the function returns an error. It retains events in a queue for up to six hours. When an event fails all processing attempts or stays in the asynchronous invocation queue for too long, Lambda discards it.
 *
 * @cloudformationResource AWS::Lambda::EventInvokeConfig
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html
 */
export class CfnEventInvokeConfig extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lambda::EventInvokeConfig";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEventInvokeConfig {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnEventInvokeConfigPropsFromCloudFormation(resourceProperties);
        const ret = new CfnEventInvokeConfig(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the Lambda function.
     *
     * *Minimum* : `1`
     *
     * *Maximum* : `64`
     *
     * *Pattern* : `([a-zA-Z0-9-_]+)`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html#cfn-lambda-eventinvokeconfig-functionname
     */
    public functionName: string;

    /**
     * The identifier of a version or alias.
     *
     * - *Version* - A version number.
     * - *Alias* - An alias name.
     * - *Latest* - To specify the unpublished version, use `$LATEST` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html#cfn-lambda-eventinvokeconfig-qualifier
     */
    public qualifier: string;

    /**
     * A destination for events after they have been sent to a function for processing.
     *
     * **Destinations** - *Function* - The Amazon Resource Name (ARN) of a Lambda function.
     * - *Queue* - The ARN of a standard SQS queue.
     * - *Topic* - The ARN of a standard SNS topic.
     * - *Event Bus* - The ARN of an Amazon EventBridge event bus.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html#cfn-lambda-eventinvokeconfig-destinationconfig
     */
    public destinationConfig: CfnEventInvokeConfig.DestinationConfigProperty | cdk.IResolvable | undefined;

    /**
     * The maximum age of a request that Lambda sends to a function for processing.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html#cfn-lambda-eventinvokeconfig-maximumeventageinseconds
     */
    public maximumEventAgeInSeconds: number | undefined;

    /**
     * The maximum number of times to retry when the function returns an error.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html#cfn-lambda-eventinvokeconfig-maximumretryattempts
     */
    public maximumRetryAttempts: number | undefined;

    /**
     * Create a new `AWS::Lambda::EventInvokeConfig`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEventInvokeConfigProps) {
        super(scope, id, { type: CfnEventInvokeConfig.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'functionName', this);
        cdk.requireProperty(props, 'qualifier', this);

        this.functionName = props.functionName;
        this.qualifier = props.qualifier;
        this.destinationConfig = props.destinationConfig;
        this.maximumEventAgeInSeconds = props.maximumEventAgeInSeconds;
        this.maximumRetryAttempts = props.maximumRetryAttempts;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEventInvokeConfig.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            functionName: this.functionName,
            qualifier: this.qualifier,
            destinationConfig: this.destinationConfig,
            maximumEventAgeInSeconds: this.maximumEventAgeInSeconds,
            maximumRetryAttempts: this.maximumRetryAttempts,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEventInvokeConfigPropsToCloudFormation(props);
    }
}

export namespace CfnEventInvokeConfig {
    /**
     * A configuration object that specifies the destination of an event after Lambda processes it.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventinvokeconfig-destinationconfig.html
     */
    export interface DestinationConfigProperty {
        /**
         * The destination configuration for failed invocations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventinvokeconfig-destinationconfig.html#cfn-lambda-eventinvokeconfig-destinationconfig-onfailure
         */
        readonly onFailure?: CfnEventInvokeConfig.OnFailureProperty | cdk.IResolvable;
        /**
         * The destination configuration for successful invocations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventinvokeconfig-destinationconfig.html#cfn-lambda-eventinvokeconfig-destinationconfig-onsuccess
         */
        readonly onSuccess?: CfnEventInvokeConfig.OnSuccessProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DestinationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventInvokeConfig_DestinationConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('onFailure', CfnEventInvokeConfig_OnFailurePropertyValidator)(properties.onFailure));
    errors.collect(cdk.propertyValidator('onSuccess', CfnEventInvokeConfig_OnSuccessPropertyValidator)(properties.onSuccess));
    return errors.wrap('supplied properties not correct for "DestinationConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::EventInvokeConfig.DestinationConfig` resource
 *
 * @param properties - the TypeScript properties of a `DestinationConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::EventInvokeConfig.DestinationConfig` resource.
 */
// @ts-ignore TS6133
function cfnEventInvokeConfigDestinationConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventInvokeConfig_DestinationConfigPropertyValidator(properties).assertSuccess();
    return {
        OnFailure: cfnEventInvokeConfigOnFailurePropertyToCloudFormation(properties.onFailure),
        OnSuccess: cfnEventInvokeConfigOnSuccessPropertyToCloudFormation(properties.onSuccess),
    };
}

// @ts-ignore TS6133
function CfnEventInvokeConfigDestinationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventInvokeConfig.DestinationConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventInvokeConfig.DestinationConfigProperty>();
    ret.addPropertyResult('onFailure', 'OnFailure', properties.OnFailure != null ? CfnEventInvokeConfigOnFailurePropertyFromCloudFormation(properties.OnFailure) : undefined);
    ret.addPropertyResult('onSuccess', 'OnSuccess', properties.OnSuccess != null ? CfnEventInvokeConfigOnSuccessPropertyFromCloudFormation(properties.OnSuccess) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEventInvokeConfig {
    /**
     * A destination for events that failed processing.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventinvokeconfig-destinationconfig-onfailure.html
     */
    export interface OnFailureProperty {
        /**
         * The Amazon Resource Name (ARN) of the destination resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventinvokeconfig-destinationconfig-onfailure.html#cfn-lambda-eventinvokeconfig-destinationconfig-onfailure-destination
         */
        readonly destination: string;
    }
}

/**
 * Determine whether the given properties match those of a `OnFailureProperty`
 *
 * @param properties - the TypeScript properties of a `OnFailureProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventInvokeConfig_OnFailurePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', cdk.requiredValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('destination', cdk.validateString)(properties.destination));
    return errors.wrap('supplied properties not correct for "OnFailureProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::EventInvokeConfig.OnFailure` resource
 *
 * @param properties - the TypeScript properties of a `OnFailureProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::EventInvokeConfig.OnFailure` resource.
 */
// @ts-ignore TS6133
function cfnEventInvokeConfigOnFailurePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventInvokeConfig_OnFailurePropertyValidator(properties).assertSuccess();
    return {
        Destination: cdk.stringToCloudFormation(properties.destination),
    };
}

// @ts-ignore TS6133
function CfnEventInvokeConfigOnFailurePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventInvokeConfig.OnFailureProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventInvokeConfig.OnFailureProperty>();
    ret.addPropertyResult('destination', 'Destination', cfn_parse.FromCloudFormation.getString(properties.Destination));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEventInvokeConfig {
    /**
     * A destination for events that were processed successfully.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventinvokeconfig-destinationconfig-onsuccess.html
     */
    export interface OnSuccessProperty {
        /**
         * The Amazon Resource Name (ARN) of the destination resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventinvokeconfig-destinationconfig-onsuccess.html#cfn-lambda-eventinvokeconfig-destinationconfig-onsuccess-destination
         */
        readonly destination: string;
    }
}

/**
 * Determine whether the given properties match those of a `OnSuccessProperty`
 *
 * @param properties - the TypeScript properties of a `OnSuccessProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventInvokeConfig_OnSuccessPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', cdk.requiredValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('destination', cdk.validateString)(properties.destination));
    return errors.wrap('supplied properties not correct for "OnSuccessProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::EventInvokeConfig.OnSuccess` resource
 *
 * @param properties - the TypeScript properties of a `OnSuccessProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::EventInvokeConfig.OnSuccess` resource.
 */
// @ts-ignore TS6133
function cfnEventInvokeConfigOnSuccessPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventInvokeConfig_OnSuccessPropertyValidator(properties).assertSuccess();
    return {
        Destination: cdk.stringToCloudFormation(properties.destination),
    };
}

// @ts-ignore TS6133
function CfnEventInvokeConfigOnSuccessPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventInvokeConfig.OnSuccessProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventInvokeConfig.OnSuccessProperty>();
    ret.addPropertyResult('destination', 'Destination', cfn_parse.FromCloudFormation.getString(properties.Destination));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnEventSourceMapping`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html
 */
export interface CfnEventSourceMappingProps {

    /**
     * The name of the Lambda function.
     *
     * **Name formats** - *Function name* – `MyFunction` .
     * - *Function ARN* – `arn:aws:lambda:us-west-2:123456789012:function:MyFunction` .
     * - *Version or Alias ARN* – `arn:aws:lambda:us-west-2:123456789012:function:MyFunction:PROD` .
     * - *Partial ARN* – `123456789012:function:MyFunction` .
     *
     * The length constraint applies only to the full ARN. If you specify only the function name, it's limited to 64 characters in length.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-functionname
     */
    readonly functionName: string;

    /**
     * Specific configuration settings for an Amazon Managed Streaming for Apache Kafka (Amazon MSK) event source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-amazonmanagedkafkaeventsourceconfig
     */
    readonly amazonManagedKafkaEventSourceConfig?: CfnEventSourceMapping.AmazonManagedKafkaEventSourceConfigProperty | cdk.IResolvable;

    /**
     * The maximum number of records in each batch that Lambda pulls from your stream or queue and sends to your function. Lambda passes all of the records in the batch to the function in a single call, up to the payload limit for synchronous invocation (6 MB).
     *
     * - *Amazon Kinesis* – Default 100. Max 10,000.
     * - *Amazon DynamoDB Streams* – Default 100. Max 10,000.
     * - *Amazon Simple Queue Service* – Default 10. For standard queues the max is 10,000. For FIFO queues the max is 10.
     * - *Amazon Managed Streaming for Apache Kafka* – Default 100. Max 10,000.
     * - *Self-managed Apache Kafka* – Default 100. Max 10,000.
     * - *Amazon MQ (ActiveMQ and RabbitMQ)* – Default 100. Max 10,000.
     * - *DocumentDB* – Default 100. Max 10,000.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-batchsize
     */
    readonly batchSize?: number;

    /**
     * (Kinesis and DynamoDB Streams only) If the function returns an error, split the batch in two and retry. The default value is false.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-bisectbatchonfunctionerror
     */
    readonly bisectBatchOnFunctionError?: boolean | cdk.IResolvable;

    /**
     * (Kinesis and DynamoDB Streams only) An Amazon SQS queue or Amazon SNS topic destination for discarded records.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-destinationconfig
     */
    readonly destinationConfig?: CfnEventSourceMapping.DestinationConfigProperty | cdk.IResolvable;

    /**
     * When true, the event source mapping is active. When false, Lambda pauses polling and invocation.
     *
     * Default: True
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the event source.
     *
     * - *Amazon Kinesis* – The ARN of the data stream or a stream consumer.
     * - *Amazon DynamoDB Streams* – The ARN of the stream.
     * - *Amazon Simple Queue Service* – The ARN of the queue.
     * - *Amazon Managed Streaming for Apache Kafka* – The ARN of the cluster.
     * - *Amazon MQ* – The ARN of the broker.
     * - *Amazon DocumentDB* – The ARN of the DocumentDB change stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-eventsourcearn
     */
    readonly eventSourceArn?: string;

    /**
     * An object that defines the filter criteria that determine whether Lambda should process an event. For more information, see [Lambda event filtering](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventfiltering.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-filtercriteria
     */
    readonly filterCriteria?: CfnEventSourceMapping.FilterCriteriaProperty | cdk.IResolvable;

    /**
     * (Streams and SQS) A list of current response type enums applied to the event source mapping.
     *
     * Valid Values: `ReportBatchItemFailures`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-functionresponsetypes
     */
    readonly functionResponseTypes?: string[];

    /**
     * The maximum amount of time, in seconds, that Lambda spends gathering records before invoking the function.
     *
     * *Default ( Kinesis , DynamoDB , Amazon SQS event sources)* : 0
     *
     * *Default ( Amazon MSK , Kafka, Amazon MQ , Amazon DocumentDB event sources)* : 500 ms
     *
     * *Related setting:* For Amazon SQS event sources, when you set `BatchSize` to a value greater than 10, you must set `MaximumBatchingWindowInSeconds` to at least 1.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-maximumbatchingwindowinseconds
     */
    readonly maximumBatchingWindowInSeconds?: number;

    /**
     * (Kinesis and DynamoDB Streams only) Discard records older than the specified age. The default value is -1,
     * which sets the maximum age to infinite. When the value is set to infinite, Lambda never discards old records.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-maximumrecordageinseconds
     */
    readonly maximumRecordAgeInSeconds?: number;

    /**
     * (Kinesis and DynamoDB Streams only) Discard records after the specified number of retries. The default value is -1,
     * which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, Lambda retries failed records until the record expires in the event source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-maximumretryattempts
     */
    readonly maximumRetryAttempts?: number;

    /**
     * (Kinesis and DynamoDB Streams only) The number of batches to process concurrently from each shard. The default value is 1.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-parallelizationfactor
     */
    readonly parallelizationFactor?: number;

    /**
     * (Amazon MQ) The name of the Amazon MQ broker destination queue to consume.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-queues
     */
    readonly queues?: string[];

    /**
     * ( Amazon Simple Queue Service only) The scaling configuration for the event source. For more information, see [Configuring maximum concurrency for Amazon SQS event sources](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html#events-sqs-max-concurrency) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-scalingconfig
     */
    readonly scalingConfig?: CfnEventSourceMapping.ScalingConfigProperty | cdk.IResolvable;

    /**
     * The self-managed Apache Kafka cluster for your event source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-selfmanagedeventsource
     */
    readonly selfManagedEventSource?: CfnEventSourceMapping.SelfManagedEventSourceProperty | cdk.IResolvable;

    /**
     * Specific configuration settings for a self-managed Apache Kafka event source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-selfmanagedkafkaeventsourceconfig
     */
    readonly selfManagedKafkaEventSourceConfig?: CfnEventSourceMapping.SelfManagedKafkaEventSourceConfigProperty | cdk.IResolvable;

    /**
     * An array of the authentication protocol, VPC components, or virtual host to secure and define your event source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-sourceaccessconfigurations
     */
    readonly sourceAccessConfigurations?: Array<CfnEventSourceMapping.SourceAccessConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The position in a stream from which to start reading. Required for Amazon Kinesis and Amazon DynamoDB.
     *
     * - *LATEST* - Read only new records.
     * - *TRIM_HORIZON* - Process all available records.
     * - *AT_TIMESTAMP* - Specify a time from which to start reading records.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-startingposition
     */
    readonly startingPosition?: string;

    /**
     * With `StartingPosition` set to `AT_TIMESTAMP` , the time from which to start reading, in Unix time seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-startingpositiontimestamp
     */
    readonly startingPositionTimestamp?: number;

    /**
     * The name of the Kafka topic.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-topics
     */
    readonly topics?: string[];

    /**
     * (Kinesis and DynamoDB Streams only) The duration in seconds of a processing window for DynamoDB and Kinesis Streams event sources. A value of 0 seconds indicates no tumbling window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-tumblingwindowinseconds
     */
    readonly tumblingWindowInSeconds?: number;
}

/**
 * Determine whether the given properties match those of a `CfnEventSourceMappingProps`
 *
 * @param properties - the TypeScript properties of a `CfnEventSourceMappingProps`
 *
 * @returns the result of the validation.
 */
function CfnEventSourceMappingPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('amazonManagedKafkaEventSourceConfig', CfnEventSourceMapping_AmazonManagedKafkaEventSourceConfigPropertyValidator)(properties.amazonManagedKafkaEventSourceConfig));
    errors.collect(cdk.propertyValidator('batchSize', cdk.validateNumber)(properties.batchSize));
    errors.collect(cdk.propertyValidator('bisectBatchOnFunctionError', cdk.validateBoolean)(properties.bisectBatchOnFunctionError));
    errors.collect(cdk.propertyValidator('destinationConfig', CfnEventSourceMapping_DestinationConfigPropertyValidator)(properties.destinationConfig));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('eventSourceArn', cdk.validateString)(properties.eventSourceArn));
    errors.collect(cdk.propertyValidator('filterCriteria', CfnEventSourceMapping_FilterCriteriaPropertyValidator)(properties.filterCriteria));
    errors.collect(cdk.propertyValidator('functionName', cdk.requiredValidator)(properties.functionName));
    errors.collect(cdk.propertyValidator('functionName', cdk.validateString)(properties.functionName));
    errors.collect(cdk.propertyValidator('functionResponseTypes', cdk.listValidator(cdk.validateString))(properties.functionResponseTypes));
    errors.collect(cdk.propertyValidator('maximumBatchingWindowInSeconds', cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
    errors.collect(cdk.propertyValidator('maximumRecordAgeInSeconds', cdk.validateNumber)(properties.maximumRecordAgeInSeconds));
    errors.collect(cdk.propertyValidator('maximumRetryAttempts', cdk.validateNumber)(properties.maximumRetryAttempts));
    errors.collect(cdk.propertyValidator('parallelizationFactor', cdk.validateNumber)(properties.parallelizationFactor));
    errors.collect(cdk.propertyValidator('queues', cdk.listValidator(cdk.validateString))(properties.queues));
    errors.collect(cdk.propertyValidator('scalingConfig', CfnEventSourceMapping_ScalingConfigPropertyValidator)(properties.scalingConfig));
    errors.collect(cdk.propertyValidator('selfManagedEventSource', CfnEventSourceMapping_SelfManagedEventSourcePropertyValidator)(properties.selfManagedEventSource));
    errors.collect(cdk.propertyValidator('selfManagedKafkaEventSourceConfig', CfnEventSourceMapping_SelfManagedKafkaEventSourceConfigPropertyValidator)(properties.selfManagedKafkaEventSourceConfig));
    errors.collect(cdk.propertyValidator('sourceAccessConfigurations', cdk.listValidator(CfnEventSourceMapping_SourceAccessConfigurationPropertyValidator))(properties.sourceAccessConfigurations));
    errors.collect(cdk.propertyValidator('startingPosition', cdk.validateString)(properties.startingPosition));
    errors.collect(cdk.propertyValidator('startingPositionTimestamp', cdk.validateNumber)(properties.startingPositionTimestamp));
    errors.collect(cdk.propertyValidator('topics', cdk.listValidator(cdk.validateString))(properties.topics));
    errors.collect(cdk.propertyValidator('tumblingWindowInSeconds', cdk.validateNumber)(properties.tumblingWindowInSeconds));
    return errors.wrap('supplied properties not correct for "CfnEventSourceMappingProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping` resource
 *
 * @param properties - the TypeScript properties of a `CfnEventSourceMappingProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping` resource.
 */
// @ts-ignore TS6133
function cfnEventSourceMappingPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventSourceMappingPropsValidator(properties).assertSuccess();
    return {
        FunctionName: cdk.stringToCloudFormation(properties.functionName),
        AmazonManagedKafkaEventSourceConfig: cfnEventSourceMappingAmazonManagedKafkaEventSourceConfigPropertyToCloudFormation(properties.amazonManagedKafkaEventSourceConfig),
        BatchSize: cdk.numberToCloudFormation(properties.batchSize),
        BisectBatchOnFunctionError: cdk.booleanToCloudFormation(properties.bisectBatchOnFunctionError),
        DestinationConfig: cfnEventSourceMappingDestinationConfigPropertyToCloudFormation(properties.destinationConfig),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        EventSourceArn: cdk.stringToCloudFormation(properties.eventSourceArn),
        FilterCriteria: cfnEventSourceMappingFilterCriteriaPropertyToCloudFormation(properties.filterCriteria),
        FunctionResponseTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.functionResponseTypes),
        MaximumBatchingWindowInSeconds: cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
        MaximumRecordAgeInSeconds: cdk.numberToCloudFormation(properties.maximumRecordAgeInSeconds),
        MaximumRetryAttempts: cdk.numberToCloudFormation(properties.maximumRetryAttempts),
        ParallelizationFactor: cdk.numberToCloudFormation(properties.parallelizationFactor),
        Queues: cdk.listMapper(cdk.stringToCloudFormation)(properties.queues),
        ScalingConfig: cfnEventSourceMappingScalingConfigPropertyToCloudFormation(properties.scalingConfig),
        SelfManagedEventSource: cfnEventSourceMappingSelfManagedEventSourcePropertyToCloudFormation(properties.selfManagedEventSource),
        SelfManagedKafkaEventSourceConfig: cfnEventSourceMappingSelfManagedKafkaEventSourceConfigPropertyToCloudFormation(properties.selfManagedKafkaEventSourceConfig),
        SourceAccessConfigurations: cdk.listMapper(cfnEventSourceMappingSourceAccessConfigurationPropertyToCloudFormation)(properties.sourceAccessConfigurations),
        StartingPosition: cdk.stringToCloudFormation(properties.startingPosition),
        StartingPositionTimestamp: cdk.numberToCloudFormation(properties.startingPositionTimestamp),
        Topics: cdk.listMapper(cdk.stringToCloudFormation)(properties.topics),
        TumblingWindowInSeconds: cdk.numberToCloudFormation(properties.tumblingWindowInSeconds),
    };
}

// @ts-ignore TS6133
function CfnEventSourceMappingPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventSourceMappingProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventSourceMappingProps>();
    ret.addPropertyResult('functionName', 'FunctionName', cfn_parse.FromCloudFormation.getString(properties.FunctionName));
    ret.addPropertyResult('amazonManagedKafkaEventSourceConfig', 'AmazonManagedKafkaEventSourceConfig', properties.AmazonManagedKafkaEventSourceConfig != null ? CfnEventSourceMappingAmazonManagedKafkaEventSourceConfigPropertyFromCloudFormation(properties.AmazonManagedKafkaEventSourceConfig) : undefined);
    ret.addPropertyResult('batchSize', 'BatchSize', properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined);
    ret.addPropertyResult('bisectBatchOnFunctionError', 'BisectBatchOnFunctionError', properties.BisectBatchOnFunctionError != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BisectBatchOnFunctionError) : undefined);
    ret.addPropertyResult('destinationConfig', 'DestinationConfig', properties.DestinationConfig != null ? CfnEventSourceMappingDestinationConfigPropertyFromCloudFormation(properties.DestinationConfig) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('eventSourceArn', 'EventSourceArn', properties.EventSourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.EventSourceArn) : undefined);
    ret.addPropertyResult('filterCriteria', 'FilterCriteria', properties.FilterCriteria != null ? CfnEventSourceMappingFilterCriteriaPropertyFromCloudFormation(properties.FilterCriteria) : undefined);
    ret.addPropertyResult('functionResponseTypes', 'FunctionResponseTypes', properties.FunctionResponseTypes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.FunctionResponseTypes) : undefined);
    ret.addPropertyResult('maximumBatchingWindowInSeconds', 'MaximumBatchingWindowInSeconds', properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined);
    ret.addPropertyResult('maximumRecordAgeInSeconds', 'MaximumRecordAgeInSeconds', properties.MaximumRecordAgeInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRecordAgeInSeconds) : undefined);
    ret.addPropertyResult('maximumRetryAttempts', 'MaximumRetryAttempts', properties.MaximumRetryAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRetryAttempts) : undefined);
    ret.addPropertyResult('parallelizationFactor', 'ParallelizationFactor', properties.ParallelizationFactor != null ? cfn_parse.FromCloudFormation.getNumber(properties.ParallelizationFactor) : undefined);
    ret.addPropertyResult('queues', 'Queues', properties.Queues != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Queues) : undefined);
    ret.addPropertyResult('scalingConfig', 'ScalingConfig', properties.ScalingConfig != null ? CfnEventSourceMappingScalingConfigPropertyFromCloudFormation(properties.ScalingConfig) : undefined);
    ret.addPropertyResult('selfManagedEventSource', 'SelfManagedEventSource', properties.SelfManagedEventSource != null ? CfnEventSourceMappingSelfManagedEventSourcePropertyFromCloudFormation(properties.SelfManagedEventSource) : undefined);
    ret.addPropertyResult('selfManagedKafkaEventSourceConfig', 'SelfManagedKafkaEventSourceConfig', properties.SelfManagedKafkaEventSourceConfig != null ? CfnEventSourceMappingSelfManagedKafkaEventSourceConfigPropertyFromCloudFormation(properties.SelfManagedKafkaEventSourceConfig) : undefined);
    ret.addPropertyResult('sourceAccessConfigurations', 'SourceAccessConfigurations', properties.SourceAccessConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnEventSourceMappingSourceAccessConfigurationPropertyFromCloudFormation)(properties.SourceAccessConfigurations) : undefined);
    ret.addPropertyResult('startingPosition', 'StartingPosition', properties.StartingPosition != null ? cfn_parse.FromCloudFormation.getString(properties.StartingPosition) : undefined);
    ret.addPropertyResult('startingPositionTimestamp', 'StartingPositionTimestamp', properties.StartingPositionTimestamp != null ? cfn_parse.FromCloudFormation.getNumber(properties.StartingPositionTimestamp) : undefined);
    ret.addPropertyResult('topics', 'Topics', properties.Topics != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Topics) : undefined);
    ret.addPropertyResult('tumblingWindowInSeconds', 'TumblingWindowInSeconds', properties.TumblingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TumblingWindowInSeconds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lambda::EventSourceMapping`
 *
 * The `AWS::Lambda::EventSourceMapping` resource creates a mapping between an event source and an AWS Lambda function. Lambda reads items from the event source and triggers the function.
 *
 * For details about each event source type, see the following topics. In particular, each of the topics describes the required and optional parameters for the specific event source.
 *
 * - [Configuring a Dynamo DB stream as an event source](https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html#services-dynamodb-eventsourcemapping)
 * - [Configuring a Kinesis stream as an event source](https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html#services-kinesis-eventsourcemapping)
 * - [Configuring an SQS queue as an event source](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html#events-sqs-eventsource)
 * - [Configuring an MQ broker as an event source](https://docs.aws.amazon.com/lambda/latest/dg/with-mq.html#services-mq-eventsourcemapping)
 * - [Configuring MSK as an event source](https://docs.aws.amazon.com/lambda/latest/dg/with-msk.html)
 * - [Configuring Self-Managed Apache Kafka as an event source](https://docs.aws.amazon.com/lambda/latest/dg/kafka-smaa.html)
 * - [Configuring Amazon DocumentDB as an event source](https://docs.aws.amazon.com/lambda/latest/dg/with-documentdb.html)
 *
 * @cloudformationResource AWS::Lambda::EventSourceMapping
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html
 */
export class CfnEventSourceMapping extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lambda::EventSourceMapping";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEventSourceMapping {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnEventSourceMappingPropsFromCloudFormation(resourceProperties);
        const ret = new CfnEventSourceMapping(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The event source mapping's ID.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The name of the Lambda function.
     *
     * **Name formats** - *Function name* – `MyFunction` .
     * - *Function ARN* – `arn:aws:lambda:us-west-2:123456789012:function:MyFunction` .
     * - *Version or Alias ARN* – `arn:aws:lambda:us-west-2:123456789012:function:MyFunction:PROD` .
     * - *Partial ARN* – `123456789012:function:MyFunction` .
     *
     * The length constraint applies only to the full ARN. If you specify only the function name, it's limited to 64 characters in length.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-functionname
     */
    public functionName: string;

    /**
     * Specific configuration settings for an Amazon Managed Streaming for Apache Kafka (Amazon MSK) event source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-amazonmanagedkafkaeventsourceconfig
     */
    public amazonManagedKafkaEventSourceConfig: CfnEventSourceMapping.AmazonManagedKafkaEventSourceConfigProperty | cdk.IResolvable | undefined;

    /**
     * The maximum number of records in each batch that Lambda pulls from your stream or queue and sends to your function. Lambda passes all of the records in the batch to the function in a single call, up to the payload limit for synchronous invocation (6 MB).
     *
     * - *Amazon Kinesis* – Default 100. Max 10,000.
     * - *Amazon DynamoDB Streams* – Default 100. Max 10,000.
     * - *Amazon Simple Queue Service* – Default 10. For standard queues the max is 10,000. For FIFO queues the max is 10.
     * - *Amazon Managed Streaming for Apache Kafka* – Default 100. Max 10,000.
     * - *Self-managed Apache Kafka* – Default 100. Max 10,000.
     * - *Amazon MQ (ActiveMQ and RabbitMQ)* – Default 100. Max 10,000.
     * - *DocumentDB* – Default 100. Max 10,000.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-batchsize
     */
    public batchSize: number | undefined;

    /**
     * (Kinesis and DynamoDB Streams only) If the function returns an error, split the batch in two and retry. The default value is false.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-bisectbatchonfunctionerror
     */
    public bisectBatchOnFunctionError: boolean | cdk.IResolvable | undefined;

    /**
     * (Kinesis and DynamoDB Streams only) An Amazon SQS queue or Amazon SNS topic destination for discarded records.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-destinationconfig
     */
    public destinationConfig: CfnEventSourceMapping.DestinationConfigProperty | cdk.IResolvable | undefined;

    /**
     * When true, the event source mapping is active. When false, Lambda pauses polling and invocation.
     *
     * Default: True
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-enabled
     */
    public enabled: boolean | cdk.IResolvable | undefined;

    /**
     * The Amazon Resource Name (ARN) of the event source.
     *
     * - *Amazon Kinesis* – The ARN of the data stream or a stream consumer.
     * - *Amazon DynamoDB Streams* – The ARN of the stream.
     * - *Amazon Simple Queue Service* – The ARN of the queue.
     * - *Amazon Managed Streaming for Apache Kafka* – The ARN of the cluster.
     * - *Amazon MQ* – The ARN of the broker.
     * - *Amazon DocumentDB* – The ARN of the DocumentDB change stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-eventsourcearn
     */
    public eventSourceArn: string | undefined;

    /**
     * An object that defines the filter criteria that determine whether Lambda should process an event. For more information, see [Lambda event filtering](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventfiltering.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-filtercriteria
     */
    public filterCriteria: CfnEventSourceMapping.FilterCriteriaProperty | cdk.IResolvable | undefined;

    /**
     * (Streams and SQS) A list of current response type enums applied to the event source mapping.
     *
     * Valid Values: `ReportBatchItemFailures`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-functionresponsetypes
     */
    public functionResponseTypes: string[] | undefined;

    /**
     * The maximum amount of time, in seconds, that Lambda spends gathering records before invoking the function.
     *
     * *Default ( Kinesis , DynamoDB , Amazon SQS event sources)* : 0
     *
     * *Default ( Amazon MSK , Kafka, Amazon MQ , Amazon DocumentDB event sources)* : 500 ms
     *
     * *Related setting:* For Amazon SQS event sources, when you set `BatchSize` to a value greater than 10, you must set `MaximumBatchingWindowInSeconds` to at least 1.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-maximumbatchingwindowinseconds
     */
    public maximumBatchingWindowInSeconds: number | undefined;

    /**
     * (Kinesis and DynamoDB Streams only) Discard records older than the specified age. The default value is -1,
     * which sets the maximum age to infinite. When the value is set to infinite, Lambda never discards old records.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-maximumrecordageinseconds
     */
    public maximumRecordAgeInSeconds: number | undefined;

    /**
     * (Kinesis and DynamoDB Streams only) Discard records after the specified number of retries. The default value is -1,
     * which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, Lambda retries failed records until the record expires in the event source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-maximumretryattempts
     */
    public maximumRetryAttempts: number | undefined;

    /**
     * (Kinesis and DynamoDB Streams only) The number of batches to process concurrently from each shard. The default value is 1.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-parallelizationfactor
     */
    public parallelizationFactor: number | undefined;

    /**
     * (Amazon MQ) The name of the Amazon MQ broker destination queue to consume.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-queues
     */
    public queues: string[] | undefined;

    /**
     * ( Amazon Simple Queue Service only) The scaling configuration for the event source. For more information, see [Configuring maximum concurrency for Amazon SQS event sources](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html#events-sqs-max-concurrency) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-scalingconfig
     */
    public scalingConfig: CfnEventSourceMapping.ScalingConfigProperty | cdk.IResolvable | undefined;

    /**
     * The self-managed Apache Kafka cluster for your event source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-selfmanagedeventsource
     */
    public selfManagedEventSource: CfnEventSourceMapping.SelfManagedEventSourceProperty | cdk.IResolvable | undefined;

    /**
     * Specific configuration settings for a self-managed Apache Kafka event source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-selfmanagedkafkaeventsourceconfig
     */
    public selfManagedKafkaEventSourceConfig: CfnEventSourceMapping.SelfManagedKafkaEventSourceConfigProperty | cdk.IResolvable | undefined;

    /**
     * An array of the authentication protocol, VPC components, or virtual host to secure and define your event source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-sourceaccessconfigurations
     */
    public sourceAccessConfigurations: Array<CfnEventSourceMapping.SourceAccessConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The position in a stream from which to start reading. Required for Amazon Kinesis and Amazon DynamoDB.
     *
     * - *LATEST* - Read only new records.
     * - *TRIM_HORIZON* - Process all available records.
     * - *AT_TIMESTAMP* - Specify a time from which to start reading records.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-startingposition
     */
    public startingPosition: string | undefined;

    /**
     * With `StartingPosition` set to `AT_TIMESTAMP` , the time from which to start reading, in Unix time seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-startingpositiontimestamp
     */
    public startingPositionTimestamp: number | undefined;

    /**
     * The name of the Kafka topic.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-topics
     */
    public topics: string[] | undefined;

    /**
     * (Kinesis and DynamoDB Streams only) The duration in seconds of a processing window for DynamoDB and Kinesis Streams event sources. A value of 0 seconds indicates no tumbling window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-tumblingwindowinseconds
     */
    public tumblingWindowInSeconds: number | undefined;

    /**
     * Create a new `AWS::Lambda::EventSourceMapping`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEventSourceMappingProps) {
        super(scope, id, { type: CfnEventSourceMapping.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'functionName', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.functionName = props.functionName;
        this.amazonManagedKafkaEventSourceConfig = props.amazonManagedKafkaEventSourceConfig;
        this.batchSize = props.batchSize;
        this.bisectBatchOnFunctionError = props.bisectBatchOnFunctionError;
        this.destinationConfig = props.destinationConfig;
        this.enabled = props.enabled;
        this.eventSourceArn = props.eventSourceArn;
        this.filterCriteria = props.filterCriteria;
        this.functionResponseTypes = props.functionResponseTypes;
        this.maximumBatchingWindowInSeconds = props.maximumBatchingWindowInSeconds;
        this.maximumRecordAgeInSeconds = props.maximumRecordAgeInSeconds;
        this.maximumRetryAttempts = props.maximumRetryAttempts;
        this.parallelizationFactor = props.parallelizationFactor;
        this.queues = props.queues;
        this.scalingConfig = props.scalingConfig;
        this.selfManagedEventSource = props.selfManagedEventSource;
        this.selfManagedKafkaEventSourceConfig = props.selfManagedKafkaEventSourceConfig;
        this.sourceAccessConfigurations = props.sourceAccessConfigurations;
        this.startingPosition = props.startingPosition;
        this.startingPositionTimestamp = props.startingPositionTimestamp;
        this.topics = props.topics;
        this.tumblingWindowInSeconds = props.tumblingWindowInSeconds;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEventSourceMapping.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            functionName: this.functionName,
            amazonManagedKafkaEventSourceConfig: this.amazonManagedKafkaEventSourceConfig,
            batchSize: this.batchSize,
            bisectBatchOnFunctionError: this.bisectBatchOnFunctionError,
            destinationConfig: this.destinationConfig,
            enabled: this.enabled,
            eventSourceArn: this.eventSourceArn,
            filterCriteria: this.filterCriteria,
            functionResponseTypes: this.functionResponseTypes,
            maximumBatchingWindowInSeconds: this.maximumBatchingWindowInSeconds,
            maximumRecordAgeInSeconds: this.maximumRecordAgeInSeconds,
            maximumRetryAttempts: this.maximumRetryAttempts,
            parallelizationFactor: this.parallelizationFactor,
            queues: this.queues,
            scalingConfig: this.scalingConfig,
            selfManagedEventSource: this.selfManagedEventSource,
            selfManagedKafkaEventSourceConfig: this.selfManagedKafkaEventSourceConfig,
            sourceAccessConfigurations: this.sourceAccessConfigurations,
            startingPosition: this.startingPosition,
            startingPositionTimestamp: this.startingPositionTimestamp,
            topics: this.topics,
            tumblingWindowInSeconds: this.tumblingWindowInSeconds,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEventSourceMappingPropsToCloudFormation(props);
    }
}

export namespace CfnEventSourceMapping {
    /**
     * Specific configuration settings for an Amazon Managed Streaming for Apache Kafka (Amazon MSK) event source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-amazonmanagedkafkaeventsourceconfig.html
     */
    export interface AmazonManagedKafkaEventSourceConfigProperty {
        /**
         * The identifier for the Kafka consumer group to join. The consumer group ID must be unique among all your Kafka event sources. After creating a Kafka event source mapping with the consumer group ID specified, you cannot update this value. For more information, see [Customizable consumer group ID](https://docs.aws.amazon.com/lambda/latest/dg/with-msk.html#services-msk-consumer-group-id) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-amazonmanagedkafkaeventsourceconfig.html#cfn-lambda-eventsourcemapping-amazonmanagedkafkaeventsourceconfig-consumergroupid
         */
        readonly consumerGroupId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AmazonManagedKafkaEventSourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AmazonManagedKafkaEventSourceConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventSourceMapping_AmazonManagedKafkaEventSourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('consumerGroupId', cdk.validateString)(properties.consumerGroupId));
    return errors.wrap('supplied properties not correct for "AmazonManagedKafkaEventSourceConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.AmazonManagedKafkaEventSourceConfig` resource
 *
 * @param properties - the TypeScript properties of a `AmazonManagedKafkaEventSourceConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.AmazonManagedKafkaEventSourceConfig` resource.
 */
// @ts-ignore TS6133
function cfnEventSourceMappingAmazonManagedKafkaEventSourceConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventSourceMapping_AmazonManagedKafkaEventSourceConfigPropertyValidator(properties).assertSuccess();
    return {
        ConsumerGroupId: cdk.stringToCloudFormation(properties.consumerGroupId),
    };
}

// @ts-ignore TS6133
function CfnEventSourceMappingAmazonManagedKafkaEventSourceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventSourceMapping.AmazonManagedKafkaEventSourceConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventSourceMapping.AmazonManagedKafkaEventSourceConfigProperty>();
    ret.addPropertyResult('consumerGroupId', 'ConsumerGroupId', properties.ConsumerGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.ConsumerGroupId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEventSourceMapping {
    /**
     * A configuration object that specifies the destination of an event after Lambda processes it.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-destinationconfig.html
     */
    export interface DestinationConfigProperty {
        /**
         * The destination configuration for failed invocations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-destinationconfig.html#cfn-lambda-eventsourcemapping-destinationconfig-onfailure
         */
        readonly onFailure?: CfnEventSourceMapping.OnFailureProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DestinationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventSourceMapping_DestinationConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('onFailure', CfnEventSourceMapping_OnFailurePropertyValidator)(properties.onFailure));
    return errors.wrap('supplied properties not correct for "DestinationConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.DestinationConfig` resource
 *
 * @param properties - the TypeScript properties of a `DestinationConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.DestinationConfig` resource.
 */
// @ts-ignore TS6133
function cfnEventSourceMappingDestinationConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventSourceMapping_DestinationConfigPropertyValidator(properties).assertSuccess();
    return {
        OnFailure: cfnEventSourceMappingOnFailurePropertyToCloudFormation(properties.onFailure),
    };
}

// @ts-ignore TS6133
function CfnEventSourceMappingDestinationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventSourceMapping.DestinationConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventSourceMapping.DestinationConfigProperty>();
    ret.addPropertyResult('onFailure', 'OnFailure', properties.OnFailure != null ? CfnEventSourceMappingOnFailurePropertyFromCloudFormation(properties.OnFailure) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEventSourceMapping {
    /**
     * The list of bootstrap servers for your Kafka brokers in the following format: `"KafkaBootstrapServers": ["abc.xyz.com:xxxx","abc2.xyz.com:xxxx"]` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-endpoints.html
     */
    export interface EndpointsProperty {
        /**
         * The list of bootstrap servers for your Kafka brokers in the following format: `"KafkaBootstrapServers": ["abc.xyz.com:xxxx","abc2.xyz.com:xxxx"]` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-endpoints.html#cfn-lambda-eventsourcemapping-endpoints-kafkabootstrapservers
         */
        readonly kafkaBootstrapServers?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `EndpointsProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventSourceMapping_EndpointsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('kafkaBootstrapServers', cdk.listValidator(cdk.validateString))(properties.kafkaBootstrapServers));
    return errors.wrap('supplied properties not correct for "EndpointsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.Endpoints` resource
 *
 * @param properties - the TypeScript properties of a `EndpointsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.Endpoints` resource.
 */
// @ts-ignore TS6133
function cfnEventSourceMappingEndpointsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventSourceMapping_EndpointsPropertyValidator(properties).assertSuccess();
    return {
        KafkaBootstrapServers: cdk.listMapper(cdk.stringToCloudFormation)(properties.kafkaBootstrapServers),
    };
}

// @ts-ignore TS6133
function CfnEventSourceMappingEndpointsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventSourceMapping.EndpointsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventSourceMapping.EndpointsProperty>();
    ret.addPropertyResult('kafkaBootstrapServers', 'KafkaBootstrapServers', properties.KafkaBootstrapServers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.KafkaBootstrapServers) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEventSourceMapping {
    /**
     * A structure within a `FilterCriteria` object that defines an event filtering pattern.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-filter.html
     */
    export interface FilterProperty {
        /**
         * A filter pattern. For more information on the syntax of a filter pattern, see [Filter rule syntax](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventfiltering.html#filtering-syntax) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-filter.html#cfn-lambda-eventsourcemapping-filter-pattern
         */
        readonly pattern?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventSourceMapping_FilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('pattern', cdk.validateString)(properties.pattern));
    return errors.wrap('supplied properties not correct for "FilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.Filter` resource
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.Filter` resource.
 */
// @ts-ignore TS6133
function cfnEventSourceMappingFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventSourceMapping_FilterPropertyValidator(properties).assertSuccess();
    return {
        Pattern: cdk.stringToCloudFormation(properties.pattern),
    };
}

// @ts-ignore TS6133
function CfnEventSourceMappingFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventSourceMapping.FilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventSourceMapping.FilterProperty>();
    ret.addPropertyResult('pattern', 'Pattern', properties.Pattern != null ? cfn_parse.FromCloudFormation.getString(properties.Pattern) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEventSourceMapping {
    /**
     * An object that contains the filters for an event source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-filtercriteria.html
     */
    export interface FilterCriteriaProperty {
        /**
         * A list of filters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-filtercriteria.html#cfn-lambda-eventsourcemapping-filtercriteria-filters
         */
        readonly filters?: Array<CfnEventSourceMapping.FilterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FilterCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `FilterCriteriaProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventSourceMapping_FilterCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('filters', cdk.listValidator(CfnEventSourceMapping_FilterPropertyValidator))(properties.filters));
    return errors.wrap('supplied properties not correct for "FilterCriteriaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.FilterCriteria` resource
 *
 * @param properties - the TypeScript properties of a `FilterCriteriaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.FilterCriteria` resource.
 */
// @ts-ignore TS6133
function cfnEventSourceMappingFilterCriteriaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventSourceMapping_FilterCriteriaPropertyValidator(properties).assertSuccess();
    return {
        Filters: cdk.listMapper(cfnEventSourceMappingFilterPropertyToCloudFormation)(properties.filters),
    };
}

// @ts-ignore TS6133
function CfnEventSourceMappingFilterCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventSourceMapping.FilterCriteriaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventSourceMapping.FilterCriteriaProperty>();
    ret.addPropertyResult('filters', 'Filters', properties.Filters != null ? cfn_parse.FromCloudFormation.getArray(CfnEventSourceMappingFilterPropertyFromCloudFormation)(properties.Filters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEventSourceMapping {
    /**
     * A destination for events that failed processing.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-onfailure.html
     */
    export interface OnFailureProperty {
        /**
         * The Amazon Resource Name (ARN) of the destination resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-onfailure.html#cfn-lambda-eventsourcemapping-onfailure-destination
         */
        readonly destination?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OnFailureProperty`
 *
 * @param properties - the TypeScript properties of a `OnFailureProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventSourceMapping_OnFailurePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', cdk.validateString)(properties.destination));
    return errors.wrap('supplied properties not correct for "OnFailureProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.OnFailure` resource
 *
 * @param properties - the TypeScript properties of a `OnFailureProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.OnFailure` resource.
 */
// @ts-ignore TS6133
function cfnEventSourceMappingOnFailurePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventSourceMapping_OnFailurePropertyValidator(properties).assertSuccess();
    return {
        Destination: cdk.stringToCloudFormation(properties.destination),
    };
}

// @ts-ignore TS6133
function CfnEventSourceMappingOnFailurePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventSourceMapping.OnFailureProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventSourceMapping.OnFailureProperty>();
    ret.addPropertyResult('destination', 'Destination', properties.Destination != null ? cfn_parse.FromCloudFormation.getString(properties.Destination) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEventSourceMapping {
    /**
     * ( Amazon Simple Queue Service only) The scaling configuration for the event source. For more information, see [Configuring maximum concurrency for Amazon SQS event sources](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html#events-sqs-max-concurrency) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-scalingconfig.html
     */
    export interface ScalingConfigProperty {
        /**
         * Limits the number of concurrent instances that the Amazon SQS event source can invoke.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-scalingconfig.html#cfn-lambda-eventsourcemapping-scalingconfig-maximumconcurrency
         */
        readonly maximumConcurrency?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ScalingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventSourceMapping_ScalingConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maximumConcurrency', cdk.validateNumber)(properties.maximumConcurrency));
    return errors.wrap('supplied properties not correct for "ScalingConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.ScalingConfig` resource
 *
 * @param properties - the TypeScript properties of a `ScalingConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.ScalingConfig` resource.
 */
// @ts-ignore TS6133
function cfnEventSourceMappingScalingConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventSourceMapping_ScalingConfigPropertyValidator(properties).assertSuccess();
    return {
        MaximumConcurrency: cdk.numberToCloudFormation(properties.maximumConcurrency),
    };
}

// @ts-ignore TS6133
function CfnEventSourceMappingScalingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventSourceMapping.ScalingConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventSourceMapping.ScalingConfigProperty>();
    ret.addPropertyResult('maximumConcurrency', 'MaximumConcurrency', properties.MaximumConcurrency != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumConcurrency) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEventSourceMapping {
    /**
     * The self-managed Apache Kafka cluster for your event source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-selfmanagedeventsource.html
     */
    export interface SelfManagedEventSourceProperty {
        /**
         * The list of bootstrap servers for your Kafka brokers in the following format: `"KafkaBootstrapServers": ["abc.xyz.com:xxxx","abc2.xyz.com:xxxx"]` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-selfmanagedeventsource.html#cfn-lambda-eventsourcemapping-selfmanagedeventsource-endpoints
         */
        readonly endpoints?: CfnEventSourceMapping.EndpointsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SelfManagedEventSourceProperty`
 *
 * @param properties - the TypeScript properties of a `SelfManagedEventSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventSourceMapping_SelfManagedEventSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endpoints', CfnEventSourceMapping_EndpointsPropertyValidator)(properties.endpoints));
    return errors.wrap('supplied properties not correct for "SelfManagedEventSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.SelfManagedEventSource` resource
 *
 * @param properties - the TypeScript properties of a `SelfManagedEventSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.SelfManagedEventSource` resource.
 */
// @ts-ignore TS6133
function cfnEventSourceMappingSelfManagedEventSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventSourceMapping_SelfManagedEventSourcePropertyValidator(properties).assertSuccess();
    return {
        Endpoints: cfnEventSourceMappingEndpointsPropertyToCloudFormation(properties.endpoints),
    };
}

// @ts-ignore TS6133
function CfnEventSourceMappingSelfManagedEventSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventSourceMapping.SelfManagedEventSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventSourceMapping.SelfManagedEventSourceProperty>();
    ret.addPropertyResult('endpoints', 'Endpoints', properties.Endpoints != null ? CfnEventSourceMappingEndpointsPropertyFromCloudFormation(properties.Endpoints) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEventSourceMapping {
    /**
     * Specific configuration settings for a self-managed Apache Kafka event source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-selfmanagedkafkaeventsourceconfig.html
     */
    export interface SelfManagedKafkaEventSourceConfigProperty {
        /**
         * The identifier for the Kafka consumer group to join. The consumer group ID must be unique among all your Kafka event sources. After creating a Kafka event source mapping with the consumer group ID specified, you cannot update this value. For more information, see [Customizable consumer group ID](https://docs.aws.amazon.com/lambda/latest/dg/with-msk.html#services-msk-consumer-group-id) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-selfmanagedkafkaeventsourceconfig.html#cfn-lambda-eventsourcemapping-selfmanagedkafkaeventsourceconfig-consumergroupid
         */
        readonly consumerGroupId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SelfManagedKafkaEventSourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SelfManagedKafkaEventSourceConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventSourceMapping_SelfManagedKafkaEventSourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('consumerGroupId', cdk.validateString)(properties.consumerGroupId));
    return errors.wrap('supplied properties not correct for "SelfManagedKafkaEventSourceConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.SelfManagedKafkaEventSourceConfig` resource
 *
 * @param properties - the TypeScript properties of a `SelfManagedKafkaEventSourceConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.SelfManagedKafkaEventSourceConfig` resource.
 */
// @ts-ignore TS6133
function cfnEventSourceMappingSelfManagedKafkaEventSourceConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventSourceMapping_SelfManagedKafkaEventSourceConfigPropertyValidator(properties).assertSuccess();
    return {
        ConsumerGroupId: cdk.stringToCloudFormation(properties.consumerGroupId),
    };
}

// @ts-ignore TS6133
function CfnEventSourceMappingSelfManagedKafkaEventSourceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventSourceMapping.SelfManagedKafkaEventSourceConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventSourceMapping.SelfManagedKafkaEventSourceConfigProperty>();
    ret.addPropertyResult('consumerGroupId', 'ConsumerGroupId', properties.ConsumerGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.ConsumerGroupId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEventSourceMapping {
    /**
     * An array of the authentication protocol, VPC components, or virtual host to secure and define your event source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-sourceaccessconfiguration.html
     */
    export interface SourceAccessConfigurationProperty {
        /**
         * The type of authentication protocol, VPC components, or virtual host for your event source. For example: `"Type":"SASL_SCRAM_512_AUTH"` .
         *
         * - `BASIC_AUTH` – (Amazon MQ) The AWS Secrets Manager secret that stores your broker credentials.
         * - `BASIC_AUTH` – (Self-managed Apache Kafka) The Secrets Manager ARN of your secret key used for SASL/PLAIN authentication of your Apache Kafka brokers.
         * - `VPC_SUBNET` – (Self-managed Apache Kafka) The subnets associated with your VPC. Lambda connects to these subnets to fetch data from your self-managed Apache Kafka cluster.
         * - `VPC_SECURITY_GROUP` – (Self-managed Apache Kafka) The VPC security group used to manage access to your self-managed Apache Kafka brokers.
         * - `SASL_SCRAM_256_AUTH` – (Self-managed Apache Kafka) The Secrets Manager ARN of your secret key used for SASL SCRAM-256 authentication of your self-managed Apache Kafka brokers.
         * - `SASL_SCRAM_512_AUTH` – (Amazon MSK, Self-managed Apache Kafka) The Secrets Manager ARN of your secret key used for SASL SCRAM-512 authentication of your self-managed Apache Kafka brokers.
         * - `VIRTUAL_HOST` –- (RabbitMQ) The name of the virtual host in your RabbitMQ broker. Lambda uses this RabbitMQ host as the event source. This property cannot be specified in an UpdateEventSourceMapping API call.
         * - `CLIENT_CERTIFICATE_TLS_AUTH` – (Amazon MSK, self-managed Apache Kafka) The Secrets Manager ARN of your secret key containing the certificate chain (X.509 PEM), private key (PKCS#8 PEM), and private key password (optional) used for mutual TLS authentication of your MSK/Apache Kafka brokers.
         * - `SERVER_ROOT_CA_CERTIFICATE` – (Self-managed Apache Kafka) The Secrets Manager ARN of your secret key containing the root CA certificate (X.509 PEM) used for TLS encryption of your Apache Kafka brokers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-sourceaccessconfiguration.html#cfn-lambda-eventsourcemapping-sourceaccessconfiguration-type
         */
        readonly type?: string;
        /**
         * The value for your chosen configuration in `Type` . For example: `"URI": "arn:aws:secretsmanager:us-east-1:01234567890:secret:MyBrokerSecretName"` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-sourceaccessconfiguration.html#cfn-lambda-eventsourcemapping-sourceaccessconfiguration-uri
         */
        readonly uri?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SourceAccessConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SourceAccessConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnEventSourceMapping_SourceAccessConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('uri', cdk.validateString)(properties.uri));
    return errors.wrap('supplied properties not correct for "SourceAccessConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.SourceAccessConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SourceAccessConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::EventSourceMapping.SourceAccessConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnEventSourceMappingSourceAccessConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventSourceMapping_SourceAccessConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        URI: cdk.stringToCloudFormation(properties.uri),
    };
}

// @ts-ignore TS6133
function CfnEventSourceMappingSourceAccessConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventSourceMapping.SourceAccessConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventSourceMapping.SourceAccessConfigurationProperty>();
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addPropertyResult('uri', 'URI', properties.URI != null ? cfn_parse.FromCloudFormation.getString(properties.URI) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnFunction`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html
 */
export interface CfnFunctionProps {

    /**
     * The code for the function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-code
     */
    readonly code: CfnFunction.CodeProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the function's execution role.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-role
     */
    readonly role: string;

    /**
     * The instruction set architecture that the function supports. Enter a string array with one of the valid values (arm64 or x86_64). The default value is `x86_64` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-architectures
     */
    readonly architectures?: string[];

    /**
     * To enable code signing for this function, specify the ARN of a code-signing configuration. A code-signing configuration
     * includes a set of signing profiles, which define the trusted publishers for this function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-codesigningconfigarn
     */
    readonly codeSigningConfigArn?: string;

    /**
     * A dead-letter queue configuration that specifies the queue or topic where Lambda sends asynchronous events when they fail processing. For more information, see [Dead-letter queues](https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html#invocation-dlq) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-deadletterconfig
     */
    readonly deadLetterConfig?: CfnFunction.DeadLetterConfigProperty | cdk.IResolvable;

    /**
     * A description of the function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-description
     */
    readonly description?: string;

    /**
     * Environment variables that are accessible from function code during execution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-environment
     */
    readonly environment?: CfnFunction.EnvironmentProperty | cdk.IResolvable;

    /**
     * The size of the function's `/tmp` directory in MB. The default value is 512, but it can be any whole number between 512 and 10,240 MB.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-ephemeralstorage
     */
    readonly ephemeralStorage?: CfnFunction.EphemeralStorageProperty | cdk.IResolvable;

    /**
     * Connection settings for an Amazon EFS file system. To connect a function to a file system, a mount target must be available in every Availability Zone that your function connects to. If your template contains an [AWS::EFS::MountTarget](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html) resource, you must also specify a `DependsOn` attribute to ensure that the mount target is created or updated before the function.
     *
     * For more information about using the `DependsOn` attribute, see [DependsOn Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-filesystemconfigs
     */
    readonly fileSystemConfigs?: Array<CfnFunction.FileSystemConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the Lambda function, up to 64 characters in length. If you don't specify a name, AWS CloudFormation generates one.
     *
     * If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-functionname
     */
    readonly functionName?: string;

    /**
     * The name of the method within your code that Lambda calls to run your function. Handler is required if the deployment package is a .zip file archive. The format includes the file name. It can also include namespaces and other qualifiers, depending on the runtime. For more information, see [Lambda programming model](https://docs.aws.amazon.com/lambda/latest/dg/foundation-progmodel.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-handler
     */
    readonly handler?: string;

    /**
     * Configuration values that override the container image Dockerfile settings. For more information, see [Container image settings](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html#images-parms) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-imageconfig
     */
    readonly imageConfig?: CfnFunction.ImageConfigProperty | cdk.IResolvable;

    /**
     * The ARN of the AWS Key Management Service ( AWS KMS ) customer managed key that's used to encrypt your function's [environment variables](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html#configuration-envvars-encryption) . When [Lambda SnapStart](https://docs.aws.amazon.com/lambda/latest/dg/snapstart-security.html) is activated, this key is also used to encrypt your function's snapshot. If you don't provide a customer managed key, Lambda uses a default service key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-kmskeyarn
     */
    readonly kmsKeyArn?: string;

    /**
     * A list of [function layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) to add to the function's execution environment. Specify each layer by its ARN, including the version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-layers
     */
    readonly layers?: string[];

    /**
     * The amount of [memory available to the function](https://docs.aws.amazon.com/lambda/latest/dg/configuration-function-common.html#configuration-memory-console) at runtime. Increasing the function memory also increases its CPU allocation. The default value is 128 MB. The value can be any multiple of 1 MB.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-memorysize
     */
    readonly memorySize?: number;

    /**
     * The type of deployment package. Set to `Image` for container image and set `Zip` for .zip file archive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-packagetype
     */
    readonly packageType?: string;

    /**
     * The number of simultaneous executions to reserve for the function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-reservedconcurrentexecutions
     */
    readonly reservedConcurrentExecutions?: number;

    /**
     * The identifier of the function's [runtime](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) . Runtime is required if the deployment package is a .zip file archive.
     *
     * The following list includes deprecated runtimes. For more information, see [Runtime deprecation policy](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html#runtime-support-policy) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-runtime
     */
    readonly runtime?: string;

    /**
     * Sets the runtime management configuration for a function's version. For more information, see [Runtime updates](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-update.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-runtimemanagementconfig
     */
    readonly runtimeManagementConfig?: CfnFunction.RuntimeManagementConfigProperty | cdk.IResolvable;

    /**
     * The function's [AWS Lambda SnapStart](https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html) setting.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-snapstart
     */
    readonly snapStart?: CfnFunction.SnapStartProperty | cdk.IResolvable;

    /**
     * A list of [tags](https://docs.aws.amazon.com/lambda/latest/dg/tagging.html) to apply to the function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The amount of time (in seconds) that Lambda allows a function to run before stopping it. The default is 3 seconds. The maximum allowed value is 900 seconds. For more information, see [Lambda execution environment](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-context.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-timeout
     */
    readonly timeout?: number;

    /**
     * Set `Mode` to `Active` to sample and trace a subset of incoming requests with [X-Ray](https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-tracingconfig
     */
    readonly tracingConfig?: CfnFunction.TracingConfigProperty | cdk.IResolvable;

    /**
     * For network connectivity to AWS resources in a [VPC](https://docs.aws.amazon.com/lambda/latest/dg/configuration-network.html) , specify a list of security groups and subnets in the VPC.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-vpcconfig
     */
    readonly vpcConfig?: CfnFunction.VpcConfigProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnFunctionProps`
 *
 * @param properties - the TypeScript properties of a `CfnFunctionProps`
 *
 * @returns the result of the validation.
 */
function CfnFunctionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('architectures', cdk.listValidator(cdk.validateString))(properties.architectures));
    errors.collect(cdk.propertyValidator('code', cdk.requiredValidator)(properties.code));
    errors.collect(cdk.propertyValidator('code', CfnFunction_CodePropertyValidator)(properties.code));
    errors.collect(cdk.propertyValidator('codeSigningConfigArn', cdk.validateString)(properties.codeSigningConfigArn));
    errors.collect(cdk.propertyValidator('deadLetterConfig', CfnFunction_DeadLetterConfigPropertyValidator)(properties.deadLetterConfig));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('environment', CfnFunction_EnvironmentPropertyValidator)(properties.environment));
    errors.collect(cdk.propertyValidator('ephemeralStorage', CfnFunction_EphemeralStoragePropertyValidator)(properties.ephemeralStorage));
    errors.collect(cdk.propertyValidator('fileSystemConfigs', cdk.listValidator(CfnFunction_FileSystemConfigPropertyValidator))(properties.fileSystemConfigs));
    errors.collect(cdk.propertyValidator('functionName', cdk.validateString)(properties.functionName));
    errors.collect(cdk.propertyValidator('handler', cdk.validateString)(properties.handler));
    errors.collect(cdk.propertyValidator('imageConfig', CfnFunction_ImageConfigPropertyValidator)(properties.imageConfig));
    errors.collect(cdk.propertyValidator('kmsKeyArn', cdk.validateString)(properties.kmsKeyArn));
    errors.collect(cdk.propertyValidator('layers', cdk.listValidator(cdk.validateString))(properties.layers));
    errors.collect(cdk.propertyValidator('memorySize', cdk.validateNumber)(properties.memorySize));
    errors.collect(cdk.propertyValidator('packageType', cdk.validateString)(properties.packageType));
    errors.collect(cdk.propertyValidator('reservedConcurrentExecutions', cdk.validateNumber)(properties.reservedConcurrentExecutions));
    errors.collect(cdk.propertyValidator('role', cdk.requiredValidator)(properties.role));
    errors.collect(cdk.propertyValidator('role', cdk.validateString)(properties.role));
    errors.collect(cdk.propertyValidator('runtime', cdk.validateString)(properties.runtime));
    errors.collect(cdk.propertyValidator('runtimeManagementConfig', CfnFunction_RuntimeManagementConfigPropertyValidator)(properties.runtimeManagementConfig));
    errors.collect(cdk.propertyValidator('snapStart', CfnFunction_SnapStartPropertyValidator)(properties.snapStart));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('timeout', cdk.validateNumber)(properties.timeout));
    errors.collect(cdk.propertyValidator('tracingConfig', CfnFunction_TracingConfigPropertyValidator)(properties.tracingConfig));
    errors.collect(cdk.propertyValidator('vpcConfig', CfnFunction_VpcConfigPropertyValidator)(properties.vpcConfig));
    return errors.wrap('supplied properties not correct for "CfnFunctionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Function` resource
 *
 * @param properties - the TypeScript properties of a `CfnFunctionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Function` resource.
 */
// @ts-ignore TS6133
function cfnFunctionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunctionPropsValidator(properties).assertSuccess();
    return {
        Code: cfnFunctionCodePropertyToCloudFormation(properties.code),
        Role: cdk.stringToCloudFormation(properties.role),
        Architectures: cdk.listMapper(cdk.stringToCloudFormation)(properties.architectures),
        CodeSigningConfigArn: cdk.stringToCloudFormation(properties.codeSigningConfigArn),
        DeadLetterConfig: cfnFunctionDeadLetterConfigPropertyToCloudFormation(properties.deadLetterConfig),
        Description: cdk.stringToCloudFormation(properties.description),
        Environment: cfnFunctionEnvironmentPropertyToCloudFormation(properties.environment),
        EphemeralStorage: cfnFunctionEphemeralStoragePropertyToCloudFormation(properties.ephemeralStorage),
        FileSystemConfigs: cdk.listMapper(cfnFunctionFileSystemConfigPropertyToCloudFormation)(properties.fileSystemConfigs),
        FunctionName: cdk.stringToCloudFormation(properties.functionName),
        Handler: cdk.stringToCloudFormation(properties.handler),
        ImageConfig: cfnFunctionImageConfigPropertyToCloudFormation(properties.imageConfig),
        KmsKeyArn: cdk.stringToCloudFormation(properties.kmsKeyArn),
        Layers: cdk.listMapper(cdk.stringToCloudFormation)(properties.layers),
        MemorySize: cdk.numberToCloudFormation(properties.memorySize),
        PackageType: cdk.stringToCloudFormation(properties.packageType),
        ReservedConcurrentExecutions: cdk.numberToCloudFormation(properties.reservedConcurrentExecutions),
        Runtime: cdk.stringToCloudFormation(properties.runtime),
        RuntimeManagementConfig: cfnFunctionRuntimeManagementConfigPropertyToCloudFormation(properties.runtimeManagementConfig),
        SnapStart: cfnFunctionSnapStartPropertyToCloudFormation(properties.snapStart),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        Timeout: cdk.numberToCloudFormation(properties.timeout),
        TracingConfig: cfnFunctionTracingConfigPropertyToCloudFormation(properties.tracingConfig),
        VpcConfig: cfnFunctionVpcConfigPropertyToCloudFormation(properties.vpcConfig),
    };
}

// @ts-ignore TS6133
function CfnFunctionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionProps>();
    ret.addPropertyResult('code', 'Code', CfnFunctionCodePropertyFromCloudFormation(properties.Code));
    ret.addPropertyResult('role', 'Role', cfn_parse.FromCloudFormation.getString(properties.Role));
    ret.addPropertyResult('architectures', 'Architectures', properties.Architectures != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Architectures) : undefined);
    ret.addPropertyResult('codeSigningConfigArn', 'CodeSigningConfigArn', properties.CodeSigningConfigArn != null ? cfn_parse.FromCloudFormation.getString(properties.CodeSigningConfigArn) : undefined);
    ret.addPropertyResult('deadLetterConfig', 'DeadLetterConfig', properties.DeadLetterConfig != null ? CfnFunctionDeadLetterConfigPropertyFromCloudFormation(properties.DeadLetterConfig) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('environment', 'Environment', properties.Environment != null ? CfnFunctionEnvironmentPropertyFromCloudFormation(properties.Environment) : undefined);
    ret.addPropertyResult('ephemeralStorage', 'EphemeralStorage', properties.EphemeralStorage != null ? CfnFunctionEphemeralStoragePropertyFromCloudFormation(properties.EphemeralStorage) : undefined);
    ret.addPropertyResult('fileSystemConfigs', 'FileSystemConfigs', properties.FileSystemConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnFunctionFileSystemConfigPropertyFromCloudFormation)(properties.FileSystemConfigs) : undefined);
    ret.addPropertyResult('functionName', 'FunctionName', properties.FunctionName != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionName) : undefined);
    ret.addPropertyResult('handler', 'Handler', properties.Handler != null ? cfn_parse.FromCloudFormation.getString(properties.Handler) : undefined);
    ret.addPropertyResult('imageConfig', 'ImageConfig', properties.ImageConfig != null ? CfnFunctionImageConfigPropertyFromCloudFormation(properties.ImageConfig) : undefined);
    ret.addPropertyResult('kmsKeyArn', 'KmsKeyArn', properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined);
    ret.addPropertyResult('layers', 'Layers', properties.Layers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Layers) : undefined);
    ret.addPropertyResult('memorySize', 'MemorySize', properties.MemorySize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MemorySize) : undefined);
    ret.addPropertyResult('packageType', 'PackageType', properties.PackageType != null ? cfn_parse.FromCloudFormation.getString(properties.PackageType) : undefined);
    ret.addPropertyResult('reservedConcurrentExecutions', 'ReservedConcurrentExecutions', properties.ReservedConcurrentExecutions != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReservedConcurrentExecutions) : undefined);
    ret.addPropertyResult('runtime', 'Runtime', properties.Runtime != null ? cfn_parse.FromCloudFormation.getString(properties.Runtime) : undefined);
    ret.addPropertyResult('runtimeManagementConfig', 'RuntimeManagementConfig', properties.RuntimeManagementConfig != null ? CfnFunctionRuntimeManagementConfigPropertyFromCloudFormation(properties.RuntimeManagementConfig) : undefined);
    ret.addPropertyResult('snapStart', 'SnapStart', properties.SnapStart != null ? CfnFunctionSnapStartPropertyFromCloudFormation(properties.SnapStart) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('timeout', 'Timeout', properties.Timeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.Timeout) : undefined);
    ret.addPropertyResult('tracingConfig', 'TracingConfig', properties.TracingConfig != null ? CfnFunctionTracingConfigPropertyFromCloudFormation(properties.TracingConfig) : undefined);
    ret.addPropertyResult('vpcConfig', 'VpcConfig', properties.VpcConfig != null ? CfnFunctionVpcConfigPropertyFromCloudFormation(properties.VpcConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lambda::Function`
 *
 * The `AWS::Lambda::Function` resource creates a Lambda function. To create a function, you need a [deployment package](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-package.html) and an [execution role](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html) . The deployment package is a .zip file archive or container image that contains your function code. The execution role grants the function permission to use AWS services, such as Amazon CloudWatch Logs for log streaming and AWS X-Ray for request tracing.
 *
 * You set the package type to `Image` if the deployment package is a [container image](https://docs.aws.amazon.com/lambda/latest/dg/lambda-images.html) . For a container image, the code property must include the URI of a container image in the Amazon ECR registry. You do not need to specify the handler and runtime properties.
 *
 * You set the package type to `Zip` if the deployment package is a [.zip file archive](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-package.html#gettingstarted-package-zip) . For a .zip file archive, the code property specifies the location of the .zip file. You must also specify the handler and runtime properties. For a Python example, see [Deploy Python Lambda functions with .zip file archives](https://docs.aws.amazon.com/lambda/latest/dg/python-package.html) .
 *
 * You can use [code signing](https://docs.aws.amazon.com/lambda/latest/dg/configuration-codesigning.html) if your deployment package is a .zip file archive. To enable code signing for this function, specify the ARN of a code-signing configuration. When a user attempts to deploy a code package with `UpdateFunctionCode` , Lambda checks that the code package has a valid signature from a trusted publisher. The code-signing configuration includes a set of signing profiles, which define the trusted publishers for this function.
 *
 * Note that you configure [provisioned concurrency](https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html) on a `AWS::Lambda::Version` or a `AWS::Lambda::Alias` .
 *
 * For a complete introduction to Lambda functions, see [What is Lambda?](https://docs.aws.amazon.com/lambda/latest/dg/lambda-welcome.html) in the *Lambda developer guide.*
 *
 * @cloudformationResource AWS::Lambda::Function
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html
 */
export class CfnFunction extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lambda::Function";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFunction {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFunctionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnFunction(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the function.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     *
     * @cloudformationAttribute SnapStartResponse.ApplyOn
     */
    public readonly attrSnapStartResponseApplyOn: string;

    /**
     *
     * @cloudformationAttribute SnapStartResponse.OptimizationStatus
     */
    public readonly attrSnapStartResponseOptimizationStatus: string;

    /**
     * The code for the function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-code
     */
    public code: CfnFunction.CodeProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the function's execution role.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-role
     */
    public role: string;

    /**
     * The instruction set architecture that the function supports. Enter a string array with one of the valid values (arm64 or x86_64). The default value is `x86_64` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-architectures
     */
    public architectures: string[] | undefined;

    /**
     * To enable code signing for this function, specify the ARN of a code-signing configuration. A code-signing configuration
     * includes a set of signing profiles, which define the trusted publishers for this function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-codesigningconfigarn
     */
    public codeSigningConfigArn: string | undefined;

    /**
     * A dead-letter queue configuration that specifies the queue or topic where Lambda sends asynchronous events when they fail processing. For more information, see [Dead-letter queues](https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html#invocation-dlq) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-deadletterconfig
     */
    public deadLetterConfig: CfnFunction.DeadLetterConfigProperty | cdk.IResolvable | undefined;

    /**
     * A description of the function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-description
     */
    public description: string | undefined;

    /**
     * Environment variables that are accessible from function code during execution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-environment
     */
    public environment: CfnFunction.EnvironmentProperty | cdk.IResolvable | undefined;

    /**
     * The size of the function's `/tmp` directory in MB. The default value is 512, but it can be any whole number between 512 and 10,240 MB.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-ephemeralstorage
     */
    public ephemeralStorage: CfnFunction.EphemeralStorageProperty | cdk.IResolvable | undefined;

    /**
     * Connection settings for an Amazon EFS file system. To connect a function to a file system, a mount target must be available in every Availability Zone that your function connects to. If your template contains an [AWS::EFS::MountTarget](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html) resource, you must also specify a `DependsOn` attribute to ensure that the mount target is created or updated before the function.
     *
     * For more information about using the `DependsOn` attribute, see [DependsOn Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-filesystemconfigs
     */
    public fileSystemConfigs: Array<CfnFunction.FileSystemConfigProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The name of the Lambda function, up to 64 characters in length. If you don't specify a name, AWS CloudFormation generates one.
     *
     * If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-functionname
     */
    public functionName: string | undefined;

    /**
     * The name of the method within your code that Lambda calls to run your function. Handler is required if the deployment package is a .zip file archive. The format includes the file name. It can also include namespaces and other qualifiers, depending on the runtime. For more information, see [Lambda programming model](https://docs.aws.amazon.com/lambda/latest/dg/foundation-progmodel.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-handler
     */
    public handler: string | undefined;

    /**
     * Configuration values that override the container image Dockerfile settings. For more information, see [Container image settings](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html#images-parms) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-imageconfig
     */
    public imageConfig: CfnFunction.ImageConfigProperty | cdk.IResolvable | undefined;

    /**
     * The ARN of the AWS Key Management Service ( AWS KMS ) customer managed key that's used to encrypt your function's [environment variables](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html#configuration-envvars-encryption) . When [Lambda SnapStart](https://docs.aws.amazon.com/lambda/latest/dg/snapstart-security.html) is activated, this key is also used to encrypt your function's snapshot. If you don't provide a customer managed key, Lambda uses a default service key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-kmskeyarn
     */
    public kmsKeyArn: string | undefined;

    /**
     * A list of [function layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) to add to the function's execution environment. Specify each layer by its ARN, including the version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-layers
     */
    public layers: string[] | undefined;

    /**
     * The amount of [memory available to the function](https://docs.aws.amazon.com/lambda/latest/dg/configuration-function-common.html#configuration-memory-console) at runtime. Increasing the function memory also increases its CPU allocation. The default value is 128 MB. The value can be any multiple of 1 MB.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-memorysize
     */
    public memorySize: number | undefined;

    /**
     * The type of deployment package. Set to `Image` for container image and set `Zip` for .zip file archive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-packagetype
     */
    public packageType: string | undefined;

    /**
     * The number of simultaneous executions to reserve for the function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-reservedconcurrentexecutions
     */
    public reservedConcurrentExecutions: number | undefined;

    /**
     * The identifier of the function's [runtime](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) . Runtime is required if the deployment package is a .zip file archive.
     *
     * The following list includes deprecated runtimes. For more information, see [Runtime deprecation policy](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html#runtime-support-policy) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-runtime
     */
    public runtime: string | undefined;

    /**
     * Sets the runtime management configuration for a function's version. For more information, see [Runtime updates](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-update.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-runtimemanagementconfig
     */
    public runtimeManagementConfig: CfnFunction.RuntimeManagementConfigProperty | cdk.IResolvable | undefined;

    /**
     * The function's [AWS Lambda SnapStart](https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html) setting.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-snapstart
     */
    public snapStart: CfnFunction.SnapStartProperty | cdk.IResolvable | undefined;

    /**
     * A list of [tags](https://docs.aws.amazon.com/lambda/latest/dg/tagging.html) to apply to the function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The amount of time (in seconds) that Lambda allows a function to run before stopping it. The default is 3 seconds. The maximum allowed value is 900 seconds. For more information, see [Lambda execution environment](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-context.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-timeout
     */
    public timeout: number | undefined;

    /**
     * Set `Mode` to `Active` to sample and trace a subset of incoming requests with [X-Ray](https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-tracingconfig
     */
    public tracingConfig: CfnFunction.TracingConfigProperty | cdk.IResolvable | undefined;

    /**
     * For network connectivity to AWS resources in a [VPC](https://docs.aws.amazon.com/lambda/latest/dg/configuration-network.html) , specify a list of security groups and subnets in the VPC.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-vpcconfig
     */
    public vpcConfig: CfnFunction.VpcConfigProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Lambda::Function`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFunctionProps) {
        super(scope, id, { type: CfnFunction.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'code', this);
        cdk.requireProperty(props, 'role', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrSnapStartResponseApplyOn = cdk.Token.asString(this.getAtt('SnapStartResponse.ApplyOn', cdk.ResolutionTypeHint.STRING));
        this.attrSnapStartResponseOptimizationStatus = cdk.Token.asString(this.getAtt('SnapStartResponse.OptimizationStatus', cdk.ResolutionTypeHint.STRING));

        this.code = props.code;
        this.role = props.role;
        this.architectures = props.architectures;
        this.codeSigningConfigArn = props.codeSigningConfigArn;
        this.deadLetterConfig = props.deadLetterConfig;
        this.description = props.description;
        this.environment = props.environment;
        this.ephemeralStorage = props.ephemeralStorage;
        this.fileSystemConfigs = props.fileSystemConfigs;
        this.functionName = props.functionName;
        this.handler = props.handler;
        this.imageConfig = props.imageConfig;
        this.kmsKeyArn = props.kmsKeyArn;
        this.layers = props.layers;
        this.memorySize = props.memorySize;
        this.packageType = props.packageType;
        this.reservedConcurrentExecutions = props.reservedConcurrentExecutions;
        this.runtime = props.runtime;
        this.runtimeManagementConfig = props.runtimeManagementConfig;
        this.snapStart = props.snapStart;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lambda::Function", props.tags, { tagPropertyName: 'tags' });
        this.timeout = props.timeout;
        this.tracingConfig = props.tracingConfig;
        this.vpcConfig = props.vpcConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFunction.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            code: this.code,
            role: this.role,
            architectures: this.architectures,
            codeSigningConfigArn: this.codeSigningConfigArn,
            deadLetterConfig: this.deadLetterConfig,
            description: this.description,
            environment: this.environment,
            ephemeralStorage: this.ephemeralStorage,
            fileSystemConfigs: this.fileSystemConfigs,
            functionName: this.functionName,
            handler: this.handler,
            imageConfig: this.imageConfig,
            kmsKeyArn: this.kmsKeyArn,
            layers: this.layers,
            memorySize: this.memorySize,
            packageType: this.packageType,
            reservedConcurrentExecutions: this.reservedConcurrentExecutions,
            runtime: this.runtime,
            runtimeManagementConfig: this.runtimeManagementConfig,
            snapStart: this.snapStart,
            tags: this.tags.renderTags(),
            timeout: this.timeout,
            tracingConfig: this.tracingConfig,
            vpcConfig: this.vpcConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFunctionPropsToCloudFormation(props);
    }
}

export namespace CfnFunction {
    /**
     * The [deployment package](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-package.html) for a Lambda function. To deploy a function defined as a container image, you specify the location of a container image in the Amazon ECR registry. For a .zip file deployment package, you can specify the location of an object in Amazon S3. For Node.js and Python functions, you can specify the function code inline in the template.
     *
     * Changes to a deployment package in Amazon S3 are not detected automatically during stack updates. To update the function code, change the object key or version in the template.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html
     */
    export interface CodeProperty {
        /**
         * URI of a [container image](https://docs.aws.amazon.com/lambda/latest/dg/lambda-images.html) in the Amazon ECR registry.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-imageuri
         */
        readonly imageUri?: string;
        /**
         * An Amazon S3 bucket in the same AWS Region as your function. The bucket can be in a different AWS account .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-s3bucket
         */
        readonly s3Bucket?: string;
        /**
         * The Amazon S3 key of the deployment package.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-s3key
         */
        readonly s3Key?: string;
        /**
         * For versioned objects, the version of the deployment package object to use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-s3objectversion
         */
        readonly s3ObjectVersion?: string;
        /**
         * (Node.js and Python) The source code of your Lambda function. If you include your function source inline with this parameter, AWS CloudFormation places it in a file named `index` and zips it to create a [deployment package](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-package.html) . This zip file cannot exceed 4MB. For the `Handler` property, the first part of the handler identifier must be `index` . For example, `index.handler` .
         *
         * For JSON, you must escape quotes and special characters such as newline ( `\n` ) with a backslash.
         *
         * If you specify a function that interacts with an AWS CloudFormation custom resource, you don't have to write your own functions to send responses to the custom resource that invoked the function. AWS CloudFormation provides a response module ( [cfn-response](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-lambda-function-code-cfnresponsemodule.html) ) that simplifies sending responses. See [Using AWS Lambda with AWS CloudFormation](https://docs.aws.amazon.com/lambda/latest/dg/services-cloudformation.html) for details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-zipfile
         */
        readonly zipFile?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CodeProperty`
 *
 * @param properties - the TypeScript properties of a `CodeProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_CodePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('imageUri', cdk.validateString)(properties.imageUri));
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.validateString)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Key', cdk.validateString)(properties.s3Key));
    errors.collect(cdk.propertyValidator('s3ObjectVersion', cdk.validateString)(properties.s3ObjectVersion));
    errors.collect(cdk.propertyValidator('zipFile', cdk.validateString)(properties.zipFile));
    return errors.wrap('supplied properties not correct for "CodeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Function.Code` resource
 *
 * @param properties - the TypeScript properties of a `CodeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Function.Code` resource.
 */
// @ts-ignore TS6133
function cfnFunctionCodePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_CodePropertyValidator(properties).assertSuccess();
    return {
        ImageUri: cdk.stringToCloudFormation(properties.imageUri),
        S3Bucket: cdk.stringToCloudFormation(properties.s3Bucket),
        S3Key: cdk.stringToCloudFormation(properties.s3Key),
        S3ObjectVersion: cdk.stringToCloudFormation(properties.s3ObjectVersion),
        ZipFile: cdk.stringToCloudFormation(properties.zipFile),
    };
}

// @ts-ignore TS6133
function CfnFunctionCodePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.CodeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.CodeProperty>();
    ret.addPropertyResult('imageUri', 'ImageUri', properties.ImageUri != null ? cfn_parse.FromCloudFormation.getString(properties.ImageUri) : undefined);
    ret.addPropertyResult('s3Bucket', 'S3Bucket', properties.S3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.S3Bucket) : undefined);
    ret.addPropertyResult('s3Key', 'S3Key', properties.S3Key != null ? cfn_parse.FromCloudFormation.getString(properties.S3Key) : undefined);
    ret.addPropertyResult('s3ObjectVersion', 'S3ObjectVersion', properties.S3ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.S3ObjectVersion) : undefined);
    ret.addPropertyResult('zipFile', 'ZipFile', properties.ZipFile != null ? cfn_parse.FromCloudFormation.getString(properties.ZipFile) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     * The [dead-letter queue](https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html#dlq) for failed asynchronous invocations.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-deadletterconfig.html
     */
    export interface DeadLetterConfigProperty {
        /**
         * The Amazon Resource Name (ARN) of an Amazon SQS queue or Amazon SNS topic.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-deadletterconfig.html#cfn-lambda-function-deadletterconfig-targetarn
         */
        readonly targetArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeadLetterConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DeadLetterConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_DeadLetterConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('targetArn', cdk.validateString)(properties.targetArn));
    return errors.wrap('supplied properties not correct for "DeadLetterConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Function.DeadLetterConfig` resource
 *
 * @param properties - the TypeScript properties of a `DeadLetterConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Function.DeadLetterConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionDeadLetterConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_DeadLetterConfigPropertyValidator(properties).assertSuccess();
    return {
        TargetArn: cdk.stringToCloudFormation(properties.targetArn),
    };
}

// @ts-ignore TS6133
function CfnFunctionDeadLetterConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.DeadLetterConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.DeadLetterConfigProperty>();
    ret.addPropertyResult('targetArn', 'TargetArn', properties.TargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     * A function's environment variable settings. You can use environment variables to adjust your function's behavior without updating code. An environment variable is a pair of strings that are stored in a function's version-specific configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-environment.html
     */
    export interface EnvironmentProperty {
        /**
         * Environment variable key-value pairs. For more information, see [Using Lambda environment variables](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-environment.html#cfn-lambda-function-environment-variables
         */
        readonly variables?: { [key: string]: (string) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EnvironmentProperty`
 *
 * @param properties - the TypeScript properties of a `EnvironmentProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_EnvironmentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('variables', cdk.hashValidator(cdk.validateString))(properties.variables));
    return errors.wrap('supplied properties not correct for "EnvironmentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Function.Environment` resource
 *
 * @param properties - the TypeScript properties of a `EnvironmentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Function.Environment` resource.
 */
// @ts-ignore TS6133
function cfnFunctionEnvironmentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_EnvironmentPropertyValidator(properties).assertSuccess();
    return {
        Variables: cdk.hashMapper(cdk.stringToCloudFormation)(properties.variables),
    };
}

// @ts-ignore TS6133
function CfnFunctionEnvironmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.EnvironmentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.EnvironmentProperty>();
    ret.addPropertyResult('variables', 'Variables', properties.Variables != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Variables) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     * The size of the function's `/tmp` directory in MB. The default value is 512, but it can be any whole number between 512 and 10,240 MB.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-ephemeralstorage.html
     */
    export interface EphemeralStorageProperty {
        /**
         * The size of the function's `/tmp` directory.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-ephemeralstorage.html#cfn-lambda-function-ephemeralstorage-size
         */
        readonly size: number;
    }
}

/**
 * Determine whether the given properties match those of a `EphemeralStorageProperty`
 *
 * @param properties - the TypeScript properties of a `EphemeralStorageProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_EphemeralStoragePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('size', cdk.requiredValidator)(properties.size));
    errors.collect(cdk.propertyValidator('size', cdk.validateNumber)(properties.size));
    return errors.wrap('supplied properties not correct for "EphemeralStorageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Function.EphemeralStorage` resource
 *
 * @param properties - the TypeScript properties of a `EphemeralStorageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Function.EphemeralStorage` resource.
 */
// @ts-ignore TS6133
function cfnFunctionEphemeralStoragePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_EphemeralStoragePropertyValidator(properties).assertSuccess();
    return {
        Size: cdk.numberToCloudFormation(properties.size),
    };
}

// @ts-ignore TS6133
function CfnFunctionEphemeralStoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.EphemeralStorageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.EphemeralStorageProperty>();
    ret.addPropertyResult('size', 'Size', cfn_parse.FromCloudFormation.getNumber(properties.Size));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     * Details about the connection between a Lambda function and an [Amazon EFS file system](https://docs.aws.amazon.com/lambda/latest/dg/configuration-filesystem.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-filesystemconfig.html
     */
    export interface FileSystemConfigProperty {
        /**
         * The Amazon Resource Name (ARN) of the Amazon EFS access point that provides access to the file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-filesystemconfig.html#cfn-lambda-function-filesystemconfig-arn
         */
        readonly arn: string;
        /**
         * The path where the function can access the file system, starting with `/mnt/` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-filesystemconfig.html#cfn-lambda-function-filesystemconfig-localmountpath
         */
        readonly localMountPath: string;
    }
}

/**
 * Determine whether the given properties match those of a `FileSystemConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FileSystemConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_FileSystemConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('localMountPath', cdk.requiredValidator)(properties.localMountPath));
    errors.collect(cdk.propertyValidator('localMountPath', cdk.validateString)(properties.localMountPath));
    return errors.wrap('supplied properties not correct for "FileSystemConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Function.FileSystemConfig` resource
 *
 * @param properties - the TypeScript properties of a `FileSystemConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Function.FileSystemConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionFileSystemConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_FileSystemConfigPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        LocalMountPath: cdk.stringToCloudFormation(properties.localMountPath),
    };
}

// @ts-ignore TS6133
function CfnFunctionFileSystemConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.FileSystemConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.FileSystemConfigProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addPropertyResult('localMountPath', 'LocalMountPath', cfn_parse.FromCloudFormation.getString(properties.LocalMountPath));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     * Configuration values that override the container image Dockerfile settings. For more information, see [Container image settings](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html#images-parms) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html
     */
    export interface ImageConfigProperty {
        /**
         * Specifies parameters that you want to pass in with ENTRYPOINT. You can specify a maximum of 1,500 parameters in the list.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html#cfn-lambda-function-imageconfig-command
         */
        readonly command?: string[];
        /**
         * Specifies the entry point to their application, which is typically the location of the runtime executable. You can specify a maximum of 1,500 string entries in the list.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html#cfn-lambda-function-imageconfig-entrypoint
         */
        readonly entryPoint?: string[];
        /**
         * Specifies the working directory. The length of the directory string cannot exceed 1,000 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html#cfn-lambda-function-imageconfig-workingdirectory
         */
        readonly workingDirectory?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ImageConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ImageConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_ImageConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('command', cdk.listValidator(cdk.validateString))(properties.command));
    errors.collect(cdk.propertyValidator('entryPoint', cdk.listValidator(cdk.validateString))(properties.entryPoint));
    errors.collect(cdk.propertyValidator('workingDirectory', cdk.validateString)(properties.workingDirectory));
    return errors.wrap('supplied properties not correct for "ImageConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Function.ImageConfig` resource
 *
 * @param properties - the TypeScript properties of a `ImageConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Function.ImageConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionImageConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_ImageConfigPropertyValidator(properties).assertSuccess();
    return {
        Command: cdk.listMapper(cdk.stringToCloudFormation)(properties.command),
        EntryPoint: cdk.listMapper(cdk.stringToCloudFormation)(properties.entryPoint),
        WorkingDirectory: cdk.stringToCloudFormation(properties.workingDirectory),
    };
}

// @ts-ignore TS6133
function CfnFunctionImageConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.ImageConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.ImageConfigProperty>();
    ret.addPropertyResult('command', 'Command', properties.Command != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Command) : undefined);
    ret.addPropertyResult('entryPoint', 'EntryPoint', properties.EntryPoint != null ? cfn_parse.FromCloudFormation.getStringArray(properties.EntryPoint) : undefined);
    ret.addPropertyResult('workingDirectory', 'WorkingDirectory', properties.WorkingDirectory != null ? cfn_parse.FromCloudFormation.getString(properties.WorkingDirectory) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     * Sets the runtime management configuration for a function's version. For more information, see [Runtime updates](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-update.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-runtimemanagementconfig.html
     */
    export interface RuntimeManagementConfigProperty {
        /**
         * The ARN of the runtime version you want the function to use.
         *
         * > This is only required if you're using the *Manual* runtime update mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-runtimemanagementconfig.html#cfn-lambda-function-runtimemanagementconfig-runtimeversionarn
         */
        readonly runtimeVersionArn?: string;
        /**
         * Specify the runtime update mode.
         *
         * - *Auto (default)* - Automatically update to the most recent and secure runtime version using a [Two-phase runtime version rollout](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-update.html#runtime-management-two-phase) . This is the best choice for most customers to ensure they always benefit from runtime updates.
         * - *FunctionUpdate* - Lambda updates the runtime of you function to the most recent and secure runtime version when you update your function. This approach synchronizes runtime updates with function deployments, giving you control over when runtime updates are applied and allowing you to detect and mitigate rare runtime update incompatibilities early. When using this setting, you need to regularly update your functions to keep their runtime up-to-date.
         * - *Manual* - You specify a runtime version in your function configuration. The function will use this runtime version indefinitely. In the rare case where a new runtime version is incompatible with an existing function, this allows you to roll back your function to an earlier runtime version. For more information, see [Roll back a runtime version](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-update.html#runtime-management-rollback) .
         *
         * *Valid Values* : `Auto` | `FunctionUpdate` | `Manual`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-runtimemanagementconfig.html#cfn-lambda-function-runtimemanagementconfig-updateruntimeon
         */
        readonly updateRuntimeOn: string;
    }
}

/**
 * Determine whether the given properties match those of a `RuntimeManagementConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RuntimeManagementConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_RuntimeManagementConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('runtimeVersionArn', cdk.validateString)(properties.runtimeVersionArn));
    errors.collect(cdk.propertyValidator('updateRuntimeOn', cdk.requiredValidator)(properties.updateRuntimeOn));
    errors.collect(cdk.propertyValidator('updateRuntimeOn', cdk.validateString)(properties.updateRuntimeOn));
    return errors.wrap('supplied properties not correct for "RuntimeManagementConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Function.RuntimeManagementConfig` resource
 *
 * @param properties - the TypeScript properties of a `RuntimeManagementConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Function.RuntimeManagementConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionRuntimeManagementConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_RuntimeManagementConfigPropertyValidator(properties).assertSuccess();
    return {
        RuntimeVersionArn: cdk.stringToCloudFormation(properties.runtimeVersionArn),
        UpdateRuntimeOn: cdk.stringToCloudFormation(properties.updateRuntimeOn),
    };
}

// @ts-ignore TS6133
function CfnFunctionRuntimeManagementConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.RuntimeManagementConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.RuntimeManagementConfigProperty>();
    ret.addPropertyResult('runtimeVersionArn', 'RuntimeVersionArn', properties.RuntimeVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.RuntimeVersionArn) : undefined);
    ret.addPropertyResult('updateRuntimeOn', 'UpdateRuntimeOn', cfn_parse.FromCloudFormation.getString(properties.UpdateRuntimeOn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     * The function's [AWS Lambda SnapStart](https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html) setting.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-snapstart.html
     */
    export interface SnapStartProperty {
        /**
         * Set `ApplyOn` to `PublishedVersions` to create a snapshot of the initialized execution environment when you publish a function version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-snapstart.html#cfn-lambda-function-snapstart-applyon
         */
        readonly applyOn: string;
    }
}

/**
 * Determine whether the given properties match those of a `SnapStartProperty`
 *
 * @param properties - the TypeScript properties of a `SnapStartProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_SnapStartPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applyOn', cdk.requiredValidator)(properties.applyOn));
    errors.collect(cdk.propertyValidator('applyOn', cdk.validateString)(properties.applyOn));
    return errors.wrap('supplied properties not correct for "SnapStartProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Function.SnapStart` resource
 *
 * @param properties - the TypeScript properties of a `SnapStartProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Function.SnapStart` resource.
 */
// @ts-ignore TS6133
function cfnFunctionSnapStartPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_SnapStartPropertyValidator(properties).assertSuccess();
    return {
        ApplyOn: cdk.stringToCloudFormation(properties.applyOn),
    };
}

// @ts-ignore TS6133
function CfnFunctionSnapStartPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.SnapStartProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.SnapStartProperty>();
    ret.addPropertyResult('applyOn', 'ApplyOn', cfn_parse.FromCloudFormation.getString(properties.ApplyOn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-snapstartresponse.html
     */
    export interface SnapStartResponseProperty {
        /**
         * `CfnFunction.SnapStartResponseProperty.ApplyOn`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-snapstartresponse.html#cfn-lambda-function-snapstartresponse-applyon
         */
        readonly applyOn?: string;
        /**
         * `CfnFunction.SnapStartResponseProperty.OptimizationStatus`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-snapstartresponse.html#cfn-lambda-function-snapstartresponse-optimizationstatus
         */
        readonly optimizationStatus?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SnapStartResponseProperty`
 *
 * @param properties - the TypeScript properties of a `SnapStartResponseProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_SnapStartResponsePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applyOn', cdk.validateString)(properties.applyOn));
    errors.collect(cdk.propertyValidator('optimizationStatus', cdk.validateString)(properties.optimizationStatus));
    return errors.wrap('supplied properties not correct for "SnapStartResponseProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Function.SnapStartResponse` resource
 *
 * @param properties - the TypeScript properties of a `SnapStartResponseProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Function.SnapStartResponse` resource.
 */
// @ts-ignore TS6133
function cfnFunctionSnapStartResponsePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_SnapStartResponsePropertyValidator(properties).assertSuccess();
    return {
        ApplyOn: cdk.stringToCloudFormation(properties.applyOn),
        OptimizationStatus: cdk.stringToCloudFormation(properties.optimizationStatus),
    };
}

// @ts-ignore TS6133
function CfnFunctionSnapStartResponsePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.SnapStartResponseProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.SnapStartResponseProperty>();
    ret.addPropertyResult('applyOn', 'ApplyOn', properties.ApplyOn != null ? cfn_parse.FromCloudFormation.getString(properties.ApplyOn) : undefined);
    ret.addPropertyResult('optimizationStatus', 'OptimizationStatus', properties.OptimizationStatus != null ? cfn_parse.FromCloudFormation.getString(properties.OptimizationStatus) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     * The function's [AWS X-Ray](https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html) tracing configuration. To sample and record incoming requests, set `Mode` to `Active` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-tracingconfig.html
     */
    export interface TracingConfigProperty {
        /**
         * The tracing mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-tracingconfig.html#cfn-lambda-function-tracingconfig-mode
         */
        readonly mode?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TracingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TracingConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_TracingConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mode', cdk.validateString)(properties.mode));
    return errors.wrap('supplied properties not correct for "TracingConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Function.TracingConfig` resource
 *
 * @param properties - the TypeScript properties of a `TracingConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Function.TracingConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionTracingConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_TracingConfigPropertyValidator(properties).assertSuccess();
    return {
        Mode: cdk.stringToCloudFormation(properties.mode),
    };
}

// @ts-ignore TS6133
function CfnFunctionTracingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.TracingConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.TracingConfigProperty>();
    ret.addPropertyResult('mode', 'Mode', properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     * The VPC security groups and subnets that are attached to a Lambda function. When you connect a function to a VPC, Lambda creates an elastic network interface for each combination of security group and subnet in the function's VPC configuration. The function can only access resources and the internet through that VPC. For more information, see [VPC Settings](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html) .
     *
     * > When you delete a function, AWS CloudFormation monitors the state of its network interfaces and waits for Lambda to delete them before proceeding. If the VPC is defined in the same stack, the network interfaces need to be deleted by Lambda before AWS CloudFormation can delete the VPC's resources.
     * >
     * > To monitor network interfaces, AWS CloudFormation needs the `ec2:DescribeNetworkInterfaces` permission. It obtains this from the user or role that modifies the stack. If you don't provide this permission, AWS CloudFormation does not wait for network interfaces to be deleted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html
     */
    export interface VpcConfigProperty {
        /**
         * A list of VPC security group IDs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html#cfn-lambda-function-vpcconfig-securitygroupids
         */
        readonly securityGroupIds?: string[];
        /**
         * A list of VPC subnet IDs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html#cfn-lambda-function-vpcconfig-subnetids
         */
        readonly subnetIds?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `VpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_VpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    return errors.wrap('supplied properties not correct for "VpcConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Function.VpcConfig` resource
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Function.VpcConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionVpcConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_VpcConfigPropertyValidator(properties).assertSuccess();
    return {
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    };
}

// @ts-ignore TS6133
function CfnFunctionVpcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.VpcConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.VpcConfigProperty>();
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds) : undefined);
    ret.addPropertyResult('subnetIds', 'SubnetIds', properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnLayerVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html
 */
export interface CfnLayerVersionProps {

    /**
     * The function layer archive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-content
     */
    readonly content: CfnLayerVersion.ContentProperty | cdk.IResolvable;

    /**
     * A list of compatible [instruction set architectures](https://docs.aws.amazon.com/lambda/latest/dg/foundation-arch.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-compatiblearchitectures
     */
    readonly compatibleArchitectures?: string[];

    /**
     * A list of compatible [function runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) . Used for filtering with [ListLayers](https://docs.aws.amazon.com/lambda/latest/dg/API_ListLayers.html) and [ListLayerVersions](https://docs.aws.amazon.com/lambda/latest/dg/API_ListLayerVersions.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-compatibleruntimes
     */
    readonly compatibleRuntimes?: string[];

    /**
     * The description of the version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-description
     */
    readonly description?: string;

    /**
     * The name or Amazon Resource Name (ARN) of the layer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-layername
     */
    readonly layerName?: string;

    /**
     * The layer's software license. It can be any of the following:
     *
     * - An [SPDX license identifier](https://docs.aws.amazon.com/https://spdx.org/licenses/) . For example, `MIT` .
     * - The URL of a license hosted on the internet. For example, `https://opensource.org/licenses/MIT` .
     * - The full text of the license.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-licenseinfo
     */
    readonly licenseInfo?: string;
}

/**
 * Determine whether the given properties match those of a `CfnLayerVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnLayerVersionProps`
 *
 * @returns the result of the validation.
 */
function CfnLayerVersionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('compatibleArchitectures', cdk.listValidator(cdk.validateString))(properties.compatibleArchitectures));
    errors.collect(cdk.propertyValidator('compatibleRuntimes', cdk.listValidator(cdk.validateString))(properties.compatibleRuntimes));
    errors.collect(cdk.propertyValidator('content', cdk.requiredValidator)(properties.content));
    errors.collect(cdk.propertyValidator('content', CfnLayerVersion_ContentPropertyValidator)(properties.content));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('layerName', cdk.validateString)(properties.layerName));
    errors.collect(cdk.propertyValidator('licenseInfo', cdk.validateString)(properties.licenseInfo));
    return errors.wrap('supplied properties not correct for "CfnLayerVersionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::LayerVersion` resource
 *
 * @param properties - the TypeScript properties of a `CfnLayerVersionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::LayerVersion` resource.
 */
// @ts-ignore TS6133
function cfnLayerVersionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLayerVersionPropsValidator(properties).assertSuccess();
    return {
        Content: cfnLayerVersionContentPropertyToCloudFormation(properties.content),
        CompatibleArchitectures: cdk.listMapper(cdk.stringToCloudFormation)(properties.compatibleArchitectures),
        CompatibleRuntimes: cdk.listMapper(cdk.stringToCloudFormation)(properties.compatibleRuntimes),
        Description: cdk.stringToCloudFormation(properties.description),
        LayerName: cdk.stringToCloudFormation(properties.layerName),
        LicenseInfo: cdk.stringToCloudFormation(properties.licenseInfo),
    };
}

// @ts-ignore TS6133
function CfnLayerVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLayerVersionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayerVersionProps>();
    ret.addPropertyResult('content', 'Content', CfnLayerVersionContentPropertyFromCloudFormation(properties.Content));
    ret.addPropertyResult('compatibleArchitectures', 'CompatibleArchitectures', properties.CompatibleArchitectures != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CompatibleArchitectures) : undefined);
    ret.addPropertyResult('compatibleRuntimes', 'CompatibleRuntimes', properties.CompatibleRuntimes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CompatibleRuntimes) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('layerName', 'LayerName', properties.LayerName != null ? cfn_parse.FromCloudFormation.getString(properties.LayerName) : undefined);
    ret.addPropertyResult('licenseInfo', 'LicenseInfo', properties.LicenseInfo != null ? cfn_parse.FromCloudFormation.getString(properties.LicenseInfo) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lambda::LayerVersion`
 *
 * The `AWS::Lambda::LayerVersion` resource creates a [Lambda layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) from a ZIP archive.
 *
 * @cloudformationResource AWS::Lambda::LayerVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html
 */
export class CfnLayerVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lambda::LayerVersion";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLayerVersion {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLayerVersionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLayerVersion(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The function layer archive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-content
     */
    public content: CfnLayerVersion.ContentProperty | cdk.IResolvable;

    /**
     * A list of compatible [instruction set architectures](https://docs.aws.amazon.com/lambda/latest/dg/foundation-arch.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-compatiblearchitectures
     */
    public compatibleArchitectures: string[] | undefined;

    /**
     * A list of compatible [function runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) . Used for filtering with [ListLayers](https://docs.aws.amazon.com/lambda/latest/dg/API_ListLayers.html) and [ListLayerVersions](https://docs.aws.amazon.com/lambda/latest/dg/API_ListLayerVersions.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-compatibleruntimes
     */
    public compatibleRuntimes: string[] | undefined;

    /**
     * The description of the version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-description
     */
    public description: string | undefined;

    /**
     * The name or Amazon Resource Name (ARN) of the layer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-layername
     */
    public layerName: string | undefined;

    /**
     * The layer's software license. It can be any of the following:
     *
     * - An [SPDX license identifier](https://docs.aws.amazon.com/https://spdx.org/licenses/) . For example, `MIT` .
     * - The URL of a license hosted on the internet. For example, `https://opensource.org/licenses/MIT` .
     * - The full text of the license.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-licenseinfo
     */
    public licenseInfo: string | undefined;

    /**
     * Create a new `AWS::Lambda::LayerVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLayerVersionProps) {
        super(scope, id, { type: CfnLayerVersion.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'content', this);

        this.content = props.content;
        this.compatibleArchitectures = props.compatibleArchitectures;
        this.compatibleRuntimes = props.compatibleRuntimes;
        this.description = props.description;
        this.layerName = props.layerName;
        this.licenseInfo = props.licenseInfo;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLayerVersion.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            content: this.content,
            compatibleArchitectures: this.compatibleArchitectures,
            compatibleRuntimes: this.compatibleRuntimes,
            description: this.description,
            layerName: this.layerName,
            licenseInfo: this.licenseInfo,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLayerVersionPropsToCloudFormation(props);
    }
}

export namespace CfnLayerVersion {
    /**
     * A ZIP archive that contains the contents of an [Lambda layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-layerversion-content.html
     */
    export interface ContentProperty {
        /**
         * The Amazon S3 bucket of the layer archive.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-layerversion-content.html#cfn-lambda-layerversion-content-s3bucket
         */
        readonly s3Bucket: string;
        /**
         * The Amazon S3 key of the layer archive.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-layerversion-content.html#cfn-lambda-layerversion-content-s3key
         */
        readonly s3Key: string;
        /**
         * For versioned objects, the version of the layer archive object to use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-layerversion-content.html#cfn-lambda-layerversion-content-s3objectversion
         */
        readonly s3ObjectVersion?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ContentProperty`
 *
 * @param properties - the TypeScript properties of a `ContentProperty`
 *
 * @returns the result of the validation.
 */
function CfnLayerVersion_ContentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.requiredValidator)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.validateString)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Key', cdk.requiredValidator)(properties.s3Key));
    errors.collect(cdk.propertyValidator('s3Key', cdk.validateString)(properties.s3Key));
    errors.collect(cdk.propertyValidator('s3ObjectVersion', cdk.validateString)(properties.s3ObjectVersion));
    return errors.wrap('supplied properties not correct for "ContentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::LayerVersion.Content` resource
 *
 * @param properties - the TypeScript properties of a `ContentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::LayerVersion.Content` resource.
 */
// @ts-ignore TS6133
function cfnLayerVersionContentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLayerVersion_ContentPropertyValidator(properties).assertSuccess();
    return {
        S3Bucket: cdk.stringToCloudFormation(properties.s3Bucket),
        S3Key: cdk.stringToCloudFormation(properties.s3Key),
        S3ObjectVersion: cdk.stringToCloudFormation(properties.s3ObjectVersion),
    };
}

// @ts-ignore TS6133
function CfnLayerVersionContentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLayerVersion.ContentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayerVersion.ContentProperty>();
    ret.addPropertyResult('s3Bucket', 'S3Bucket', cfn_parse.FromCloudFormation.getString(properties.S3Bucket));
    ret.addPropertyResult('s3Key', 'S3Key', cfn_parse.FromCloudFormation.getString(properties.S3Key));
    ret.addPropertyResult('s3ObjectVersion', 'S3ObjectVersion', properties.S3ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.S3ObjectVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnLayerVersionPermission`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html
 */
export interface CfnLayerVersionPermissionProps {

    /**
     * The API action that grants access to the layer. For example, `lambda:GetLayerVersion` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html#cfn-lambda-layerversionpermission-action
     */
    readonly action: string;

    /**
     * The name or Amazon Resource Name (ARN) of the layer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html#cfn-lambda-layerversionpermission-layerversionarn
     */
    readonly layerVersionArn: string;

    /**
     * An account ID, or `*` to grant layer usage permission to all accounts in an organization, or all AWS accounts (if `organizationId` is not specified). For the last case, make sure that you really do want all AWS accounts to have usage permission to this layer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html#cfn-lambda-layerversionpermission-principal
     */
    readonly principal: string;

    /**
     * With the principal set to `*` , grant permission to all accounts in the specified organization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html#cfn-lambda-layerversionpermission-organizationid
     */
    readonly organizationId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnLayerVersionPermissionProps`
 *
 * @param properties - the TypeScript properties of a `CfnLayerVersionPermissionProps`
 *
 * @returns the result of the validation.
 */
function CfnLayerVersionPermissionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', cdk.validateString)(properties.action));
    errors.collect(cdk.propertyValidator('layerVersionArn', cdk.requiredValidator)(properties.layerVersionArn));
    errors.collect(cdk.propertyValidator('layerVersionArn', cdk.validateString)(properties.layerVersionArn));
    errors.collect(cdk.propertyValidator('organizationId', cdk.validateString)(properties.organizationId));
    errors.collect(cdk.propertyValidator('principal', cdk.requiredValidator)(properties.principal));
    errors.collect(cdk.propertyValidator('principal', cdk.validateString)(properties.principal));
    return errors.wrap('supplied properties not correct for "CfnLayerVersionPermissionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::LayerVersionPermission` resource
 *
 * @param properties - the TypeScript properties of a `CfnLayerVersionPermissionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::LayerVersionPermission` resource.
 */
// @ts-ignore TS6133
function cfnLayerVersionPermissionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLayerVersionPermissionPropsValidator(properties).assertSuccess();
    return {
        Action: cdk.stringToCloudFormation(properties.action),
        LayerVersionArn: cdk.stringToCloudFormation(properties.layerVersionArn),
        Principal: cdk.stringToCloudFormation(properties.principal),
        OrganizationId: cdk.stringToCloudFormation(properties.organizationId),
    };
}

// @ts-ignore TS6133
function CfnLayerVersionPermissionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLayerVersionPermissionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayerVersionPermissionProps>();
    ret.addPropertyResult('action', 'Action', cfn_parse.FromCloudFormation.getString(properties.Action));
    ret.addPropertyResult('layerVersionArn', 'LayerVersionArn', cfn_parse.FromCloudFormation.getString(properties.LayerVersionArn));
    ret.addPropertyResult('principal', 'Principal', cfn_parse.FromCloudFormation.getString(properties.Principal));
    ret.addPropertyResult('organizationId', 'OrganizationId', properties.OrganizationId != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lambda::LayerVersionPermission`
 *
 * The `AWS::Lambda::LayerVersionPermission` resource adds permissions to the resource-based policy of a version of an [Lambda layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) . Use this action to grant layer usage permission to other accounts. You can grant permission to a single account, all AWS accounts, or all accounts in an organization.
 *
 * > Since the release of the [UpdateReplacePolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatereplacepolicy.html) both `UpdateReplacePolicy` and `DeletionPolicy` are required to protect your Resources/LayerPermissions from deletion.
 *
 * @cloudformationResource AWS::Lambda::LayerVersionPermission
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html
 */
export class CfnLayerVersionPermission extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lambda::LayerVersionPermission";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLayerVersionPermission {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLayerVersionPermissionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLayerVersionPermission(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The API action that grants access to the layer. For example, `lambda:GetLayerVersion` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html#cfn-lambda-layerversionpermission-action
     */
    public action: string;

    /**
     * The name or Amazon Resource Name (ARN) of the layer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html#cfn-lambda-layerversionpermission-layerversionarn
     */
    public layerVersionArn: string;

    /**
     * An account ID, or `*` to grant layer usage permission to all accounts in an organization, or all AWS accounts (if `organizationId` is not specified). For the last case, make sure that you really do want all AWS accounts to have usage permission to this layer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html#cfn-lambda-layerversionpermission-principal
     */
    public principal: string;

    /**
     * With the principal set to `*` , grant permission to all accounts in the specified organization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html#cfn-lambda-layerversionpermission-organizationid
     */
    public organizationId: string | undefined;

    /**
     * Create a new `AWS::Lambda::LayerVersionPermission`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLayerVersionPermissionProps) {
        super(scope, id, { type: CfnLayerVersionPermission.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'action', this);
        cdk.requireProperty(props, 'layerVersionArn', this);
        cdk.requireProperty(props, 'principal', this);

        this.action = props.action;
        this.layerVersionArn = props.layerVersionArn;
        this.principal = props.principal;
        this.organizationId = props.organizationId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLayerVersionPermission.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            action: this.action,
            layerVersionArn: this.layerVersionArn,
            principal: this.principal,
            organizationId: this.organizationId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLayerVersionPermissionPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnPermission`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html
 */
export interface CfnPermissionProps {

    /**
     * The action that the principal can use on the function. For example, `lambda:InvokeFunction` or `lambda:GetFunction` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-action
     */
    readonly action: string;

    /**
     * The name of the Lambda function, version, or alias.
     *
     * **Name formats** - *Function name* – `my-function` (name-only), `my-function:v1` (with alias).
     * - *Function ARN* – `arn:aws:lambda:us-west-2:123456789012:function:my-function` .
     * - *Partial ARN* – `123456789012:function:my-function` .
     *
     * You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-functionname
     */
    readonly functionName: string;

    /**
     * The AWS service or AWS account that invokes the function. If you specify a service, use `SourceArn` or `SourceAccount` to limit who can invoke the function through that service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-principal
     */
    readonly principal: string;

    /**
     * For Alexa Smart Home functions, a token that the invoker must supply.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-eventsourcetoken
     */
    readonly eventSourceToken?: string;

    /**
     * The type of authentication that your function URL uses. Set to `AWS_IAM` if you want to restrict access to authenticated users only. Set to `NONE` if you want to bypass IAM authentication to create a public endpoint. For more information, see [Security and auth model for Lambda function URLs](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-functionurlauthtype
     */
    readonly functionUrlAuthType?: string;

    /**
     * The identifier for your organization in AWS Organizations . Use this to grant permissions to all the AWS accounts under this organization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-principalorgid
     */
    readonly principalOrgId?: string;

    /**
     * For AWS service , the ID of the AWS account that owns the resource. Use this together with `SourceArn` to ensure that the specified account owns the resource. It is possible for an Amazon S3 bucket to be deleted by its owner and recreated by another account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-sourceaccount
     */
    readonly sourceAccount?: string;

    /**
     * For AWS services , the ARN of the AWS resource that invokes the function. For example, an Amazon S3 bucket or Amazon SNS topic.
     *
     * Note that Lambda configures the comparison using the `StringLike` operator.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-sourcearn
     */
    readonly sourceArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPermissionProps`
 *
 * @param properties - the TypeScript properties of a `CfnPermissionProps`
 *
 * @returns the result of the validation.
 */
function CfnPermissionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', cdk.validateString)(properties.action));
    errors.collect(cdk.propertyValidator('eventSourceToken', cdk.validateString)(properties.eventSourceToken));
    errors.collect(cdk.propertyValidator('functionName', cdk.requiredValidator)(properties.functionName));
    errors.collect(cdk.propertyValidator('functionName', cdk.validateString)(properties.functionName));
    errors.collect(cdk.propertyValidator('functionUrlAuthType', cdk.validateString)(properties.functionUrlAuthType));
    errors.collect(cdk.propertyValidator('principal', cdk.requiredValidator)(properties.principal));
    errors.collect(cdk.propertyValidator('principal', cdk.validateString)(properties.principal));
    errors.collect(cdk.propertyValidator('principalOrgId', cdk.validateString)(properties.principalOrgId));
    errors.collect(cdk.propertyValidator('sourceAccount', cdk.validateString)(properties.sourceAccount));
    errors.collect(cdk.propertyValidator('sourceArn', cdk.validateString)(properties.sourceArn));
    return errors.wrap('supplied properties not correct for "CfnPermissionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Permission` resource
 *
 * @param properties - the TypeScript properties of a `CfnPermissionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Permission` resource.
 */
// @ts-ignore TS6133
function cfnPermissionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPermissionPropsValidator(properties).assertSuccess();
    return {
        Action: cdk.stringToCloudFormation(properties.action),
        FunctionName: cdk.stringToCloudFormation(properties.functionName),
        Principal: cdk.stringToCloudFormation(properties.principal),
        EventSourceToken: cdk.stringToCloudFormation(properties.eventSourceToken),
        FunctionUrlAuthType: cdk.stringToCloudFormation(properties.functionUrlAuthType),
        PrincipalOrgID: cdk.stringToCloudFormation(properties.principalOrgId),
        SourceAccount: cdk.stringToCloudFormation(properties.sourceAccount),
        SourceArn: cdk.stringToCloudFormation(properties.sourceArn),
    };
}

// @ts-ignore TS6133
function CfnPermissionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissionProps>();
    ret.addPropertyResult('action', 'Action', cfn_parse.FromCloudFormation.getString(properties.Action));
    ret.addPropertyResult('functionName', 'FunctionName', cfn_parse.FromCloudFormation.getString(properties.FunctionName));
    ret.addPropertyResult('principal', 'Principal', cfn_parse.FromCloudFormation.getString(properties.Principal));
    ret.addPropertyResult('eventSourceToken', 'EventSourceToken', properties.EventSourceToken != null ? cfn_parse.FromCloudFormation.getString(properties.EventSourceToken) : undefined);
    ret.addPropertyResult('functionUrlAuthType', 'FunctionUrlAuthType', properties.FunctionUrlAuthType != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionUrlAuthType) : undefined);
    ret.addPropertyResult('principalOrgId', 'PrincipalOrgID', properties.PrincipalOrgID != null ? cfn_parse.FromCloudFormation.getString(properties.PrincipalOrgID) : undefined);
    ret.addPropertyResult('sourceAccount', 'SourceAccount', properties.SourceAccount != null ? cfn_parse.FromCloudFormation.getString(properties.SourceAccount) : undefined);
    ret.addPropertyResult('sourceArn', 'SourceArn', properties.SourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lambda::Permission`
 *
 * The `AWS::Lambda::Permission` resource grants an AWS service or another account permission to use a function. You can apply the policy at the function level, or specify a qualifier to restrict access to a single version or alias. If you use a qualifier, the invoker must use the full Amazon Resource Name (ARN) of that version or alias to invoke the function.
 *
 * To grant permission to another account, specify the account ID as the `Principal` . To grant permission to an organization defined in AWS Organizations , specify the organization ID as the `PrincipalOrgID` . For AWS services, the principal is a domain-style identifier defined by the service, like `s3.amazonaws.com` or `sns.amazonaws.com` . For AWS services, you can also specify the ARN of the associated resource as the `SourceArn` . If you grant permission to a service principal without specifying the source, other accounts could potentially configure resources in their account to invoke your Lambda function.
 *
 * If your function has a function URL, you can specify the `FunctionUrlAuthType` parameter. This adds a condition to your permission that only applies when your function URL's `AuthType` matches the specified `FunctionUrlAuthType` . For more information about the `AuthType` parameter, see [Security and auth model for Lambda function URLs](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html) .
 *
 * This resource adds a statement to a resource-based permission policy for the function. For more information about function policies, see [Lambda Function Policies](https://docs.aws.amazon.com/lambda/latest/dg/access-control-resource-based.html) .
 *
 * @cloudformationResource AWS::Lambda::Permission
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html
 */
export class CfnPermission extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lambda::Permission";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPermission {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPermissionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPermission(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The action that the principal can use on the function. For example, `lambda:InvokeFunction` or `lambda:GetFunction` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-action
     */
    public action: string;

    /**
     * The name of the Lambda function, version, or alias.
     *
     * **Name formats** - *Function name* – `my-function` (name-only), `my-function:v1` (with alias).
     * - *Function ARN* – `arn:aws:lambda:us-west-2:123456789012:function:my-function` .
     * - *Partial ARN* – `123456789012:function:my-function` .
     *
     * You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-functionname
     */
    public functionName: string;

    /**
     * The AWS service or AWS account that invokes the function. If you specify a service, use `SourceArn` or `SourceAccount` to limit who can invoke the function through that service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-principal
     */
    public principal: string;

    /**
     * For Alexa Smart Home functions, a token that the invoker must supply.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-eventsourcetoken
     */
    public eventSourceToken: string | undefined;

    /**
     * The type of authentication that your function URL uses. Set to `AWS_IAM` if you want to restrict access to authenticated users only. Set to `NONE` if you want to bypass IAM authentication to create a public endpoint. For more information, see [Security and auth model for Lambda function URLs](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-functionurlauthtype
     */
    public functionUrlAuthType: string | undefined;

    /**
     * The identifier for your organization in AWS Organizations . Use this to grant permissions to all the AWS accounts under this organization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-principalorgid
     */
    public principalOrgId: string | undefined;

    /**
     * For AWS service , the ID of the AWS account that owns the resource. Use this together with `SourceArn` to ensure that the specified account owns the resource. It is possible for an Amazon S3 bucket to be deleted by its owner and recreated by another account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-sourceaccount
     */
    public sourceAccount: string | undefined;

    /**
     * For AWS services , the ARN of the AWS resource that invokes the function. For example, an Amazon S3 bucket or Amazon SNS topic.
     *
     * Note that Lambda configures the comparison using the `StringLike` operator.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-sourcearn
     */
    public sourceArn: string | undefined;

    /**
     * Create a new `AWS::Lambda::Permission`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPermissionProps) {
        super(scope, id, { type: CfnPermission.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'action', this);
        cdk.requireProperty(props, 'functionName', this);
        cdk.requireProperty(props, 'principal', this);

        this.action = props.action;
        this.functionName = props.functionName;
        this.principal = props.principal;
        this.eventSourceToken = props.eventSourceToken;
        this.functionUrlAuthType = props.functionUrlAuthType;
        this.principalOrgId = props.principalOrgId;
        this.sourceAccount = props.sourceAccount;
        this.sourceArn = props.sourceArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPermission.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            action: this.action,
            functionName: this.functionName,
            principal: this.principal,
            eventSourceToken: this.eventSourceToken,
            functionUrlAuthType: this.functionUrlAuthType,
            principalOrgId: this.principalOrgId,
            sourceAccount: this.sourceAccount,
            sourceArn: this.sourceArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPermissionPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnUrl`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html
 */
export interface CfnUrlProps {

    /**
     * The type of authentication that your function URL uses. Set to `AWS_IAM` if you want to restrict access to authenticated users only. Set to `NONE` if you want to bypass IAM authentication to create a public endpoint. For more information, see [Security and auth model for Lambda function URLs](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html#cfn-lambda-url-authtype
     */
    readonly authType: string;

    /**
     * The name of the Lambda function.
     *
     * **Name formats** - *Function name* - `my-function` .
     * - *Function ARN* - `arn:aws:lambda:us-west-2:123456789012:function:my-function` .
     * - *Partial ARN* - `123456789012:function:my-function` .
     *
     * The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html#cfn-lambda-url-targetfunctionarn
     */
    readonly targetFunctionArn: string;

    /**
     * The [Cross-Origin Resource Sharing (CORS)](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) settings for your function URL.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html#cfn-lambda-url-cors
     */
    readonly cors?: CfnUrl.CorsProperty | cdk.IResolvable;

    /**
     * `AWS::Lambda::Url.InvokeMode`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html#cfn-lambda-url-invokemode
     */
    readonly invokeMode?: string;

    /**
     * The alias name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html#cfn-lambda-url-qualifier
     */
    readonly qualifier?: string;
}

/**
 * Determine whether the given properties match those of a `CfnUrlProps`
 *
 * @param properties - the TypeScript properties of a `CfnUrlProps`
 *
 * @returns the result of the validation.
 */
function CfnUrlPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authType', cdk.requiredValidator)(properties.authType));
    errors.collect(cdk.propertyValidator('authType', cdk.validateString)(properties.authType));
    errors.collect(cdk.propertyValidator('cors', CfnUrl_CorsPropertyValidator)(properties.cors));
    errors.collect(cdk.propertyValidator('invokeMode', cdk.validateString)(properties.invokeMode));
    errors.collect(cdk.propertyValidator('qualifier', cdk.validateString)(properties.qualifier));
    errors.collect(cdk.propertyValidator('targetFunctionArn', cdk.requiredValidator)(properties.targetFunctionArn));
    errors.collect(cdk.propertyValidator('targetFunctionArn', cdk.validateString)(properties.targetFunctionArn));
    return errors.wrap('supplied properties not correct for "CfnUrlProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Url` resource
 *
 * @param properties - the TypeScript properties of a `CfnUrlProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Url` resource.
 */
// @ts-ignore TS6133
function cfnUrlPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnUrlPropsValidator(properties).assertSuccess();
    return {
        AuthType: cdk.stringToCloudFormation(properties.authType),
        TargetFunctionArn: cdk.stringToCloudFormation(properties.targetFunctionArn),
        Cors: cfnUrlCorsPropertyToCloudFormation(properties.cors),
        InvokeMode: cdk.stringToCloudFormation(properties.invokeMode),
        Qualifier: cdk.stringToCloudFormation(properties.qualifier),
    };
}

// @ts-ignore TS6133
function CfnUrlPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUrlProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUrlProps>();
    ret.addPropertyResult('authType', 'AuthType', cfn_parse.FromCloudFormation.getString(properties.AuthType));
    ret.addPropertyResult('targetFunctionArn', 'TargetFunctionArn', cfn_parse.FromCloudFormation.getString(properties.TargetFunctionArn));
    ret.addPropertyResult('cors', 'Cors', properties.Cors != null ? CfnUrlCorsPropertyFromCloudFormation(properties.Cors) : undefined);
    ret.addPropertyResult('invokeMode', 'InvokeMode', properties.InvokeMode != null ? cfn_parse.FromCloudFormation.getString(properties.InvokeMode) : undefined);
    ret.addPropertyResult('qualifier', 'Qualifier', properties.Qualifier != null ? cfn_parse.FromCloudFormation.getString(properties.Qualifier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lambda::Url`
 *
 * The `AWS::Lambda::Url` resource creates a function URL with the specified configuration parameters. A [function URL](https://docs.aws.amazon.com/lambda/latest/dg/lambda-urls.html) is a dedicated HTTP(S) endpoint that you can use to invoke your function.
 *
 * @cloudformationResource AWS::Lambda::Url
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html
 */
export class CfnUrl extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lambda::Url";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUrl {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnUrlPropsFromCloudFormation(resourceProperties);
        const ret = new CfnUrl(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the function.
     * @cloudformationAttribute FunctionArn
     */
    public readonly attrFunctionArn: string;

    /**
     * The HTTP URL endpoint for your function.
     * @cloudformationAttribute FunctionUrl
     */
    public readonly attrFunctionUrl: string;

    /**
     * The type of authentication that your function URL uses. Set to `AWS_IAM` if you want to restrict access to authenticated users only. Set to `NONE` if you want to bypass IAM authentication to create a public endpoint. For more information, see [Security and auth model for Lambda function URLs](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html#cfn-lambda-url-authtype
     */
    public authType: string;

    /**
     * The name of the Lambda function.
     *
     * **Name formats** - *Function name* - `my-function` .
     * - *Function ARN* - `arn:aws:lambda:us-west-2:123456789012:function:my-function` .
     * - *Partial ARN* - `123456789012:function:my-function` .
     *
     * The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html#cfn-lambda-url-targetfunctionarn
     */
    public targetFunctionArn: string;

    /**
     * The [Cross-Origin Resource Sharing (CORS)](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) settings for your function URL.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html#cfn-lambda-url-cors
     */
    public cors: CfnUrl.CorsProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Lambda::Url.InvokeMode`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html#cfn-lambda-url-invokemode
     */
    public invokeMode: string | undefined;

    /**
     * The alias name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html#cfn-lambda-url-qualifier
     */
    public qualifier: string | undefined;

    /**
     * Create a new `AWS::Lambda::Url`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUrlProps) {
        super(scope, id, { type: CfnUrl.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'authType', this);
        cdk.requireProperty(props, 'targetFunctionArn', this);
        this.attrFunctionArn = cdk.Token.asString(this.getAtt('FunctionArn', cdk.ResolutionTypeHint.STRING));
        this.attrFunctionUrl = cdk.Token.asString(this.getAtt('FunctionUrl', cdk.ResolutionTypeHint.STRING));

        this.authType = props.authType;
        this.targetFunctionArn = props.targetFunctionArn;
        this.cors = props.cors;
        this.invokeMode = props.invokeMode;
        this.qualifier = props.qualifier;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnUrl.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            authType: this.authType,
            targetFunctionArn: this.targetFunctionArn,
            cors: this.cors,
            invokeMode: this.invokeMode,
            qualifier: this.qualifier,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnUrlPropsToCloudFormation(props);
    }
}

export namespace CfnUrl {
    /**
     * The [Cross-Origin Resource Sharing (CORS)](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) settings for your function URL. Use CORS to grant access to your function URL from any origin. You can also use CORS to control access for specific HTTP headers and methods in requests to your function URL.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-url-cors.html
     */
    export interface CorsProperty {
        /**
         * Whether you want to allow cookies or other credentials in requests to your function URL. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-url-cors.html#cfn-lambda-url-cors-allowcredentials
         */
        readonly allowCredentials?: boolean | cdk.IResolvable;
        /**
         * The HTTP headers that origins can include in requests to your function URL. For example: `Date` , `Keep-Alive` , `X-Custom-Header` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-url-cors.html#cfn-lambda-url-cors-allowheaders
         */
        readonly allowHeaders?: string[];
        /**
         * The HTTP methods that are allowed when calling your function URL. For example: `GET` , `POST` , `DELETE` , or the wildcard character ( `*` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-url-cors.html#cfn-lambda-url-cors-allowmethods
         */
        readonly allowMethods?: string[];
        /**
         * The origins that can access your function URL. You can list any number of specific origins, separated by a comma. For example: `https://www.example.com` , `http://localhost:60905` .
         *
         * Alternatively, you can grant access to all origins with the wildcard character ( `*` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-url-cors.html#cfn-lambda-url-cors-alloworigins
         */
        readonly allowOrigins?: string[];
        /**
         * The HTTP headers in your function response that you want to expose to origins that call your function URL. For example: `Date` , `Keep-Alive` , `X-Custom-Header` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-url-cors.html#cfn-lambda-url-cors-exposeheaders
         */
        readonly exposeHeaders?: string[];
        /**
         * The maximum amount of time, in seconds, that browsers can cache results of a preflight request. By default, this is set to `0` , which means the browser will not cache results.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-url-cors.html#cfn-lambda-url-cors-maxage
         */
        readonly maxAge?: number;
    }
}

/**
 * Determine whether the given properties match those of a `CorsProperty`
 *
 * @param properties - the TypeScript properties of a `CorsProperty`
 *
 * @returns the result of the validation.
 */
function CfnUrl_CorsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowCredentials', cdk.validateBoolean)(properties.allowCredentials));
    errors.collect(cdk.propertyValidator('allowHeaders', cdk.listValidator(cdk.validateString))(properties.allowHeaders));
    errors.collect(cdk.propertyValidator('allowMethods', cdk.listValidator(cdk.validateString))(properties.allowMethods));
    errors.collect(cdk.propertyValidator('allowOrigins', cdk.listValidator(cdk.validateString))(properties.allowOrigins));
    errors.collect(cdk.propertyValidator('exposeHeaders', cdk.listValidator(cdk.validateString))(properties.exposeHeaders));
    errors.collect(cdk.propertyValidator('maxAge', cdk.validateNumber)(properties.maxAge));
    return errors.wrap('supplied properties not correct for "CorsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Url.Cors` resource
 *
 * @param properties - the TypeScript properties of a `CorsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Url.Cors` resource.
 */
// @ts-ignore TS6133
function cfnUrlCorsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnUrl_CorsPropertyValidator(properties).assertSuccess();
    return {
        AllowCredentials: cdk.booleanToCloudFormation(properties.allowCredentials),
        AllowHeaders: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowHeaders),
        AllowMethods: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowMethods),
        AllowOrigins: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowOrigins),
        ExposeHeaders: cdk.listMapper(cdk.stringToCloudFormation)(properties.exposeHeaders),
        MaxAge: cdk.numberToCloudFormation(properties.maxAge),
    };
}

// @ts-ignore TS6133
function CfnUrlCorsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUrl.CorsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUrl.CorsProperty>();
    ret.addPropertyResult('allowCredentials', 'AllowCredentials', properties.AllowCredentials != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowCredentials) : undefined);
    ret.addPropertyResult('allowHeaders', 'AllowHeaders', properties.AllowHeaders != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AllowHeaders) : undefined);
    ret.addPropertyResult('allowMethods', 'AllowMethods', properties.AllowMethods != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AllowMethods) : undefined);
    ret.addPropertyResult('allowOrigins', 'AllowOrigins', properties.AllowOrigins != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AllowOrigins) : undefined);
    ret.addPropertyResult('exposeHeaders', 'ExposeHeaders', properties.ExposeHeaders != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExposeHeaders) : undefined);
    ret.addPropertyResult('maxAge', 'MaxAge', properties.MaxAge != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxAge) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html
 */
export interface CfnVersionProps {

    /**
     * The name of the Lambda function.
     *
     * **Name formats** - *Function name* - `MyFunction` .
     * - *Function ARN* - `arn:aws:lambda:us-west-2:123456789012:function:MyFunction` .
     * - *Partial ARN* - `123456789012:function:MyFunction` .
     *
     * The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html#cfn-lambda-version-functionname
     */
    readonly functionName: string;

    /**
     * Only publish a version if the hash value matches the value that's specified. Use this option to avoid publishing a version if the function code has changed since you last updated it. Updates are not supported for this property.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html#cfn-lambda-version-codesha256
     */
    readonly codeSha256?: string;

    /**
     * A description for the version to override the description in the function configuration. Updates are not supported for this property.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html#cfn-lambda-version-description
     */
    readonly description?: string;

    /**
     * Specifies a provisioned concurrency configuration for a function's version. Updates are not supported for this property.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html#cfn-lambda-version-provisionedconcurrencyconfig
     */
    readonly provisionedConcurrencyConfig?: CfnVersion.ProvisionedConcurrencyConfigurationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnVersionProps`
 *
 * @returns the result of the validation.
 */
function CfnVersionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('codeSha256', cdk.validateString)(properties.codeSha256));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('functionName', cdk.requiredValidator)(properties.functionName));
    errors.collect(cdk.propertyValidator('functionName', cdk.validateString)(properties.functionName));
    errors.collect(cdk.propertyValidator('provisionedConcurrencyConfig', CfnVersion_ProvisionedConcurrencyConfigurationPropertyValidator)(properties.provisionedConcurrencyConfig));
    return errors.wrap('supplied properties not correct for "CfnVersionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Version` resource
 *
 * @param properties - the TypeScript properties of a `CfnVersionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Version` resource.
 */
// @ts-ignore TS6133
function cfnVersionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVersionPropsValidator(properties).assertSuccess();
    return {
        FunctionName: cdk.stringToCloudFormation(properties.functionName),
        CodeSha256: cdk.stringToCloudFormation(properties.codeSha256),
        Description: cdk.stringToCloudFormation(properties.description),
        ProvisionedConcurrencyConfig: cfnVersionProvisionedConcurrencyConfigurationPropertyToCloudFormation(properties.provisionedConcurrencyConfig),
    };
}

// @ts-ignore TS6133
function CfnVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVersionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVersionProps>();
    ret.addPropertyResult('functionName', 'FunctionName', cfn_parse.FromCloudFormation.getString(properties.FunctionName));
    ret.addPropertyResult('codeSha256', 'CodeSha256', properties.CodeSha256 != null ? cfn_parse.FromCloudFormation.getString(properties.CodeSha256) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('provisionedConcurrencyConfig', 'ProvisionedConcurrencyConfig', properties.ProvisionedConcurrencyConfig != null ? CfnVersionProvisionedConcurrencyConfigurationPropertyFromCloudFormation(properties.ProvisionedConcurrencyConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lambda::Version`
 *
 * The `AWS::Lambda::Version` resource creates a [version](https://docs.aws.amazon.com/lambda/latest/dg/versioning-aliases.html) from the current code and configuration of a function. Use versions to create a snapshot of your function code and configuration that doesn't change.
 *
 * @cloudformationResource AWS::Lambda::Version
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html
 */
export class CfnVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lambda::Version";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVersion {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnVersionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnVersion(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The version number.
     * @cloudformationAttribute Version
     */
    public readonly attrVersion: string;

    /**
     * The name of the Lambda function.
     *
     * **Name formats** - *Function name* - `MyFunction` .
     * - *Function ARN* - `arn:aws:lambda:us-west-2:123456789012:function:MyFunction` .
     * - *Partial ARN* - `123456789012:function:MyFunction` .
     *
     * The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html#cfn-lambda-version-functionname
     */
    public functionName: string;

    /**
     * Only publish a version if the hash value matches the value that's specified. Use this option to avoid publishing a version if the function code has changed since you last updated it. Updates are not supported for this property.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html#cfn-lambda-version-codesha256
     */
    public codeSha256: string | undefined;

    /**
     * A description for the version to override the description in the function configuration. Updates are not supported for this property.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html#cfn-lambda-version-description
     */
    public description: string | undefined;

    /**
     * Specifies a provisioned concurrency configuration for a function's version. Updates are not supported for this property.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html#cfn-lambda-version-provisionedconcurrencyconfig
     */
    public provisionedConcurrencyConfig: CfnVersion.ProvisionedConcurrencyConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Lambda::Version`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnVersionProps) {
        super(scope, id, { type: CfnVersion.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'functionName', this);
        this.attrVersion = cdk.Token.asString(this.getAtt('Version', cdk.ResolutionTypeHint.STRING));

        this.functionName = props.functionName;
        this.codeSha256 = props.codeSha256;
        this.description = props.description;
        this.provisionedConcurrencyConfig = props.provisionedConcurrencyConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnVersion.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            functionName: this.functionName,
            codeSha256: this.codeSha256,
            description: this.description,
            provisionedConcurrencyConfig: this.provisionedConcurrencyConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnVersionPropsToCloudFormation(props);
    }
}

export namespace CfnVersion {
    /**
     * A [provisioned concurrency](https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html) configuration for a function's version.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-version-provisionedconcurrencyconfiguration.html
     */
    export interface ProvisionedConcurrencyConfigurationProperty {
        /**
         * The amount of provisioned concurrency to allocate for the version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-version-provisionedconcurrencyconfiguration.html#cfn-lambda-version-provisionedconcurrencyconfiguration-provisionedconcurrentexecutions
         */
        readonly provisionedConcurrentExecutions: number;
    }
}

/**
 * Determine whether the given properties match those of a `ProvisionedConcurrencyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionedConcurrencyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnVersion_ProvisionedConcurrencyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('provisionedConcurrentExecutions', cdk.requiredValidator)(properties.provisionedConcurrentExecutions));
    errors.collect(cdk.propertyValidator('provisionedConcurrentExecutions', cdk.validateNumber)(properties.provisionedConcurrentExecutions));
    return errors.wrap('supplied properties not correct for "ProvisionedConcurrencyConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lambda::Version.ProvisionedConcurrencyConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ProvisionedConcurrencyConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lambda::Version.ProvisionedConcurrencyConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnVersionProvisionedConcurrencyConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVersion_ProvisionedConcurrencyConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ProvisionedConcurrentExecutions: cdk.numberToCloudFormation(properties.provisionedConcurrentExecutions),
    };
}

// @ts-ignore TS6133
function CfnVersionProvisionedConcurrencyConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVersion.ProvisionedConcurrencyConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVersion.ProvisionedConcurrencyConfigurationProperty>();
    ret.addPropertyResult('provisionedConcurrentExecutions', 'ProvisionedConcurrentExecutions', cfn_parse.FromCloudFormation.getNumber(properties.ProvisionedConcurrentExecutions));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
