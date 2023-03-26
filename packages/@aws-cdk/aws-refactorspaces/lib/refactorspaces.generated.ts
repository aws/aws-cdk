// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:52.080Z","fingerprint":"Ovz4oL6FeRdT/f+E1D5xpnHZmcnmOm4ncBO9VszJaY4="}

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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html
 */
export interface CfnApplicationProps {

    /**
     * The endpoint URL of the Amazon API Gateway proxy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-apigatewayproxy
     */
    readonly apiGatewayProxy?: CfnApplication.ApiGatewayProxyInputProperty | cdk.IResolvable;

    /**
     * The unique identifier of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-environmentidentifier
     */
    readonly environmentIdentifier?: string;

    /**
     * The name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-name
     */
    readonly name?: string;

    /**
     * The proxy type of the proxy created within the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-proxytype
     */
    readonly proxyType?: string;

    /**
     * The tags assigned to the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The ID of the virtual private cloud (VPC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-vpcid
     */
    readonly vpcId?: string;
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
    errors.collect(cdk.propertyValidator('apiGatewayProxy', CfnApplication_ApiGatewayProxyInputPropertyValidator)(properties.apiGatewayProxy));
    errors.collect(cdk.propertyValidator('environmentIdentifier', cdk.validateString)(properties.environmentIdentifier));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('proxyType', cdk.validateString)(properties.proxyType));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('vpcId', cdk.validateString)(properties.vpcId));
    return errors.wrap('supplied properties not correct for "CfnApplicationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RefactorSpaces::Application` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RefactorSpaces::Application` resource.
 */
// @ts-ignore TS6133
function cfnApplicationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationPropsValidator(properties).assertSuccess();
    return {
        ApiGatewayProxy: cfnApplicationApiGatewayProxyInputPropertyToCloudFormation(properties.apiGatewayProxy),
        EnvironmentIdentifier: cdk.stringToCloudFormation(properties.environmentIdentifier),
        Name: cdk.stringToCloudFormation(properties.name),
        ProxyType: cdk.stringToCloudFormation(properties.proxyType),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VpcId: cdk.stringToCloudFormation(properties.vpcId),
    };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
    ret.addPropertyResult('apiGatewayProxy', 'ApiGatewayProxy', properties.ApiGatewayProxy != null ? CfnApplicationApiGatewayProxyInputPropertyFromCloudFormation(properties.ApiGatewayProxy) : undefined);
    ret.addPropertyResult('environmentIdentifier', 'EnvironmentIdentifier', properties.EnvironmentIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentIdentifier) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('proxyType', 'ProxyType', properties.ProxyType != null ? cfn_parse.FromCloudFormation.getString(properties.ProxyType) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('vpcId', 'VpcId', properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::RefactorSpaces::Application`
 *
 * Creates an AWS Migration Hub Refactor Spaces application. The account that owns the environment also owns the applications created inside the environment, regardless of the account that creates the application. Refactor Spaces provisions an Amazon API Gateway , API Gateway VPC link, and Network Load Balancer for the application proxy inside your account.
 *
 * @cloudformationResource AWS::RefactorSpaces::Application
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RefactorSpaces::Application";

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
     * The resource ID of the API Gateway for the proxy.
     * @cloudformationAttribute ApiGatewayId
     */
    public readonly attrApiGatewayId: string;

    /**
     * The unique identifier of the application.
     * @cloudformationAttribute ApplicationIdentifier
     */
    public readonly attrApplicationIdentifier: string;

    /**
     * The Amazon Resource Name (ARN) of the application.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The Amazon Resource Name (ARN) of the Network Load Balancer .
     * @cloudformationAttribute NlbArn
     */
    public readonly attrNlbArn: string;

    /**
     * The name of the Network Load Balancer configured by the API Gateway proxy.
     * @cloudformationAttribute NlbName
     */
    public readonly attrNlbName: string;

    /**
     * The endpoint URL of the Amazon API Gateway proxy.
     * @cloudformationAttribute ProxyUrl
     */
    public readonly attrProxyUrl: string;

    /**
     * The name of the API Gateway stage. The name defaults to `prod` .
     * @cloudformationAttribute StageName
     */
    public readonly attrStageName: string;

    /**
     * The `VpcLink` ID of the API Gateway proxy.
     * @cloudformationAttribute VpcLinkId
     */
    public readonly attrVpcLinkId: string;

    /**
     * The endpoint URL of the Amazon API Gateway proxy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-apigatewayproxy
     */
    public apiGatewayProxy: CfnApplication.ApiGatewayProxyInputProperty | cdk.IResolvable | undefined;

    /**
     * The unique identifier of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-environmentidentifier
     */
    public environmentIdentifier: string | undefined;

    /**
     * The name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-name
     */
    public name: string | undefined;

    /**
     * The proxy type of the proxy created within the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-proxytype
     */
    public proxyType: string | undefined;

    /**
     * The tags assigned to the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The ID of the virtual private cloud (VPC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-vpcid
     */
    public vpcId: string | undefined;

    /**
     * Create a new `AWS::RefactorSpaces::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps = {}) {
        super(scope, id, { type: CfnApplication.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrApiGatewayId = cdk.Token.asString(this.getAtt('ApiGatewayId', cdk.ResolutionTypeHint.STRING));
        this.attrApplicationIdentifier = cdk.Token.asString(this.getAtt('ApplicationIdentifier', cdk.ResolutionTypeHint.STRING));
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrNlbArn = cdk.Token.asString(this.getAtt('NlbArn', cdk.ResolutionTypeHint.STRING));
        this.attrNlbName = cdk.Token.asString(this.getAtt('NlbName', cdk.ResolutionTypeHint.STRING));
        this.attrProxyUrl = cdk.Token.asString(this.getAtt('ProxyUrl', cdk.ResolutionTypeHint.STRING));
        this.attrStageName = cdk.Token.asString(this.getAtt('StageName', cdk.ResolutionTypeHint.STRING));
        this.attrVpcLinkId = cdk.Token.asString(this.getAtt('VpcLinkId', cdk.ResolutionTypeHint.STRING));

        this.apiGatewayProxy = props.apiGatewayProxy;
        this.environmentIdentifier = props.environmentIdentifier;
        this.name = props.name;
        this.proxyType = props.proxyType;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RefactorSpaces::Application", props.tags, { tagPropertyName: 'tags' });
        this.vpcId = props.vpcId;
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
            apiGatewayProxy: this.apiGatewayProxy,
            environmentIdentifier: this.environmentIdentifier,
            name: this.name,
            proxyType: this.proxyType,
            tags: this.tags.renderTags(),
            vpcId: this.vpcId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationPropsToCloudFormation(props);
    }
}

export namespace CfnApplication {
    /**
     * A wrapper object holding the Amazon API Gateway endpoint input.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-application-apigatewayproxyinput.html
     */
    export interface ApiGatewayProxyInputProperty {
        /**
         * The type of endpoint to use for the API Gateway proxy. If no value is specified in the request, the value is set to `REGIONAL` by default.
         *
         * If the value is set to `PRIVATE` in the request, this creates a private API endpoint that is isolated from the public internet. The private endpoint can only be accessed by using Amazon Virtual Private Cloud ( Amazon VPC ) endpoints for Amazon API Gateway that have been granted access.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-application-apigatewayproxyinput.html#cfn-refactorspaces-application-apigatewayproxyinput-endpointtype
         */
        readonly endpointType?: string;
        /**
         * The name of the API Gateway stage. The name defaults to `prod` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-application-apigatewayproxyinput.html#cfn-refactorspaces-application-apigatewayproxyinput-stagename
         */
        readonly stageName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ApiGatewayProxyInputProperty`
 *
 * @param properties - the TypeScript properties of a `ApiGatewayProxyInputProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ApiGatewayProxyInputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endpointType', cdk.validateString)(properties.endpointType));
    errors.collect(cdk.propertyValidator('stageName', cdk.validateString)(properties.stageName));
    return errors.wrap('supplied properties not correct for "ApiGatewayProxyInputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RefactorSpaces::Application.ApiGatewayProxyInput` resource
 *
 * @param properties - the TypeScript properties of a `ApiGatewayProxyInputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RefactorSpaces::Application.ApiGatewayProxyInput` resource.
 */
// @ts-ignore TS6133
function cfnApplicationApiGatewayProxyInputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_ApiGatewayProxyInputPropertyValidator(properties).assertSuccess();
    return {
        EndpointType: cdk.stringToCloudFormation(properties.endpointType),
        StageName: cdk.stringToCloudFormation(properties.stageName),
    };
}

// @ts-ignore TS6133
function CfnApplicationApiGatewayProxyInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ApiGatewayProxyInputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ApiGatewayProxyInputProperty>();
    ret.addPropertyResult('endpointType', 'EndpointType', properties.EndpointType != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointType) : undefined);
    ret.addPropertyResult('stageName', 'StageName', properties.StageName != null ? cfn_parse.FromCloudFormation.getString(properties.StageName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnEnvironment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html
 */
export interface CfnEnvironmentProps {

    /**
     * A description of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-description
     */
    readonly description?: string;

    /**
     * The name of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-name
     */
    readonly name?: string;

    /**
     * The network fabric type of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-networkfabrictype
     */
    readonly networkFabricType?: string;

    /**
     * The tags assigned to the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-tags
     */
    readonly tags?: cdk.CfnTag[];
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
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('networkFabricType', cdk.validateString)(properties.networkFabricType));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnEnvironmentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RefactorSpaces::Environment` resource
 *
 * @param properties - the TypeScript properties of a `CfnEnvironmentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RefactorSpaces::Environment` resource.
 */
// @ts-ignore TS6133
function cfnEnvironmentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnvironmentPropsValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        NetworkFabricType: cdk.stringToCloudFormation(properties.networkFabricType),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnEnvironmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironmentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironmentProps>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('networkFabricType', 'NetworkFabricType', properties.NetworkFabricType != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkFabricType) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::RefactorSpaces::Environment`
 *
 * Creates an AWS Migration Hub Refactor Spaces environment. The caller owns the environment resource, and all Refactor Spaces applications, services, and routes created within the environment. They are referred to as the *environment owner* . The environment owner has cross-account visibility and control of Refactor Spaces resources that are added to the environment by other accounts that the environment is shared with. When creating an environment, Refactor Spaces provisions a transit gateway in your account.
 *
 * @cloudformationResource AWS::RefactorSpaces::Environment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html
 */
export class CfnEnvironment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RefactorSpaces::Environment";

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
     * The Amazon Resource Name (ARN) of the environment.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The unique identifier of the environment.
     * @cloudformationAttribute EnvironmentIdentifier
     */
    public readonly attrEnvironmentIdentifier: string;

    /**
     * The ID of the AWS Transit Gateway set up by the environment.
     * @cloudformationAttribute TransitGatewayId
     */
    public readonly attrTransitGatewayId: string;

    /**
     * A description of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-description
     */
    public description: string | undefined;

    /**
     * The name of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-name
     */
    public name: string | undefined;

    /**
     * The network fabric type of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-networkfabrictype
     */
    public networkFabricType: string | undefined;

    /**
     * The tags assigned to the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::RefactorSpaces::Environment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEnvironmentProps = {}) {
        super(scope, id, { type: CfnEnvironment.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrEnvironmentIdentifier = cdk.Token.asString(this.getAtt('EnvironmentIdentifier', cdk.ResolutionTypeHint.STRING));
        this.attrTransitGatewayId = cdk.Token.asString(this.getAtt('TransitGatewayId', cdk.ResolutionTypeHint.STRING));

        this.description = props.description;
        this.name = props.name;
        this.networkFabricType = props.networkFabricType;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RefactorSpaces::Environment", props.tags, { tagPropertyName: 'tags' });
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
            description: this.description,
            name: this.name,
            networkFabricType: this.networkFabricType,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEnvironmentPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnRoute`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html
 */
export interface CfnRouteProps {

    /**
     * The unique identifier of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-applicationidentifier
     */
    readonly applicationIdentifier: string;

    /**
     * The unique identifier of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-environmentidentifier
     */
    readonly environmentIdentifier: string;

    /**
     * The unique identifier of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-serviceidentifier
     */
    readonly serviceIdentifier: string;

    /**
     * Configuration for the default route type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-defaultroute
     */
    readonly defaultRoute?: CfnRoute.DefaultRouteInputProperty | cdk.IResolvable;

    /**
     * The route type of the route.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-routetype
     */
    readonly routeType?: string;

    /**
     * The tags assigned to the route.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The configuration for the URI path route type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-uripathroute
     */
    readonly uriPathRoute?: CfnRoute.UriPathRouteInputProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnRouteProps`
 *
 * @param properties - the TypeScript properties of a `CfnRouteProps`
 *
 * @returns the result of the validation.
 */
function CfnRoutePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationIdentifier', cdk.requiredValidator)(properties.applicationIdentifier));
    errors.collect(cdk.propertyValidator('applicationIdentifier', cdk.validateString)(properties.applicationIdentifier));
    errors.collect(cdk.propertyValidator('defaultRoute', CfnRoute_DefaultRouteInputPropertyValidator)(properties.defaultRoute));
    errors.collect(cdk.propertyValidator('environmentIdentifier', cdk.requiredValidator)(properties.environmentIdentifier));
    errors.collect(cdk.propertyValidator('environmentIdentifier', cdk.validateString)(properties.environmentIdentifier));
    errors.collect(cdk.propertyValidator('routeType', cdk.validateString)(properties.routeType));
    errors.collect(cdk.propertyValidator('serviceIdentifier', cdk.requiredValidator)(properties.serviceIdentifier));
    errors.collect(cdk.propertyValidator('serviceIdentifier', cdk.validateString)(properties.serviceIdentifier));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('uriPathRoute', CfnRoute_UriPathRouteInputPropertyValidator)(properties.uriPathRoute));
    return errors.wrap('supplied properties not correct for "CfnRouteProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RefactorSpaces::Route` resource
 *
 * @param properties - the TypeScript properties of a `CfnRouteProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RefactorSpaces::Route` resource.
 */
// @ts-ignore TS6133
function cfnRoutePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoutePropsValidator(properties).assertSuccess();
    return {
        ApplicationIdentifier: cdk.stringToCloudFormation(properties.applicationIdentifier),
        EnvironmentIdentifier: cdk.stringToCloudFormation(properties.environmentIdentifier),
        ServiceIdentifier: cdk.stringToCloudFormation(properties.serviceIdentifier),
        DefaultRoute: cfnRouteDefaultRouteInputPropertyToCloudFormation(properties.defaultRoute),
        RouteType: cdk.stringToCloudFormation(properties.routeType),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        UriPathRoute: cfnRouteUriPathRouteInputPropertyToCloudFormation(properties.uriPathRoute),
    };
}

// @ts-ignore TS6133
function CfnRoutePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRouteProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRouteProps>();
    ret.addPropertyResult('applicationIdentifier', 'ApplicationIdentifier', cfn_parse.FromCloudFormation.getString(properties.ApplicationIdentifier));
    ret.addPropertyResult('environmentIdentifier', 'EnvironmentIdentifier', cfn_parse.FromCloudFormation.getString(properties.EnvironmentIdentifier));
    ret.addPropertyResult('serviceIdentifier', 'ServiceIdentifier', cfn_parse.FromCloudFormation.getString(properties.ServiceIdentifier));
    ret.addPropertyResult('defaultRoute', 'DefaultRoute', properties.DefaultRoute != null ? CfnRouteDefaultRouteInputPropertyFromCloudFormation(properties.DefaultRoute) : undefined);
    ret.addPropertyResult('routeType', 'RouteType', properties.RouteType != null ? cfn_parse.FromCloudFormation.getString(properties.RouteType) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('uriPathRoute', 'UriPathRoute', properties.UriPathRoute != null ? CfnRouteUriPathRouteInputPropertyFromCloudFormation(properties.UriPathRoute) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::RefactorSpaces::Route`
 *
 * Creates an AWS Migration Hub Refactor Spaces route. The account owner of the service resource is always the environment owner, regardless of which account creates the route. Routes target a service in the application. If an application does not have any routes, then the first route must be created as a `DEFAULT` `RouteType` .
 *
 * When created, the default route defaults to an active state so state is not a required input. However, like all other state values the state of the default route can be updated after creation, but only when all other routes are also inactive. Conversely, no route can be active without the default route also being active.
 *
 * > In the `AWS::RefactorSpaces::Route` resource, you can only update the `ActivationState` property, which resides under the `UriPathRoute` and `DefaultRoute` properties. All other properties associated with the `AWS::RefactorSpaces::Route` cannot be updated, even though the property description might indicate otherwise. Updating all other properties will result in the replacement of Route.
 *
 * When you create a route, Refactor Spaces configures the Amazon API Gateway to send traffic to the target service as follows:
 *
 * - If the service has a URL endpoint, and the endpoint resolves to a private IP address, Refactor Spaces routes traffic using the API Gateway VPC link.
 * - If the service has a URL endpoint, and the endpoint resolves to a public IP address, Refactor Spaces routes traffic over the public internet.
 * - If the service has an AWS Lambda function endpoint, then Refactor Spaces configures the Lambda function's resource policy to allow the application's API Gateway to invoke the function.
 *
 * A one-time health check is performed on the service when either the route is updated from inactive to active, or when it is created with an active state. If the health check fails, the route transitions the route state to `FAILED` , an error code of `SERVICE_ENDPOINT_HEALTH_CHECK_FAILURE` is provided, and no traffic is sent to the service.
 *
 * For Lambda functions, the Lambda function state is checked. If the function is not active, the function configuration is updated so that Lambda resources are provisioned. If the Lambda state is `Failed` , then the route creation fails. For more information, see the [GetFunctionConfiguration's State response parameter](https://docs.aws.amazon.com/lambda/latest/dg/API_GetFunctionConfiguration.html#SSS-GetFunctionConfiguration-response-State) in the *AWS Lambda Developer Guide* .
 *
 * For Lambda endpoints, a check is performed to determine that a Lambda function with the specified ARN exists. If it does not exist, the health check fails. For public URLs, a connection is opened to the public endpoint. If the URL is not reachable, the health check fails.
 *
 * For private URLS, a target group is created on the Elastic Load Balancing and the target group health check is run. The `HealthCheckProtocol` , `HealthCheckPort` , and `HealthCheckPath` are the same protocol, port, and path specified in the URL or health URL, if used. All other settings use the default values, as described in [Health checks for your target groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) . The health check is considered successful if at least one target within the target group transitions to a healthy state.
 *
 * Services can have HTTP or HTTPS URL endpoints. For HTTPS URLs, publicly-signed certificates are supported. Private Certificate Authorities (CAs) are permitted only if the CA's domain is also publicly resolvable.
 *
 * @cloudformationResource AWS::RefactorSpaces::Route
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html
 */
export class CfnRoute extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RefactorSpaces::Route";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRoute {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRoutePropsFromCloudFormation(resourceProperties);
        const ret = new CfnRoute(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the route.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * A mapping of Amazon API Gateway path resources to resource IDs.
     * @cloudformationAttribute PathResourceToId
     */
    public readonly attrPathResourceToId: string;

    /**
     * The unique identifier of the route.
     * @cloudformationAttribute RouteIdentifier
     */
    public readonly attrRouteIdentifier: string;

    /**
     * The unique identifier of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-applicationidentifier
     */
    public applicationIdentifier: string;

    /**
     * The unique identifier of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-environmentidentifier
     */
    public environmentIdentifier: string;

    /**
     * The unique identifier of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-serviceidentifier
     */
    public serviceIdentifier: string;

    /**
     * Configuration for the default route type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-defaultroute
     */
    public defaultRoute: CfnRoute.DefaultRouteInputProperty | cdk.IResolvable | undefined;

    /**
     * The route type of the route.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-routetype
     */
    public routeType: string | undefined;

    /**
     * The tags assigned to the route.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The configuration for the URI path route type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-uripathroute
     */
    public uriPathRoute: CfnRoute.UriPathRouteInputProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::RefactorSpaces::Route`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRouteProps) {
        super(scope, id, { type: CfnRoute.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationIdentifier', this);
        cdk.requireProperty(props, 'environmentIdentifier', this);
        cdk.requireProperty(props, 'serviceIdentifier', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrPathResourceToId = cdk.Token.asString(this.getAtt('PathResourceToId', cdk.ResolutionTypeHint.STRING));
        this.attrRouteIdentifier = cdk.Token.asString(this.getAtt('RouteIdentifier', cdk.ResolutionTypeHint.STRING));

        this.applicationIdentifier = props.applicationIdentifier;
        this.environmentIdentifier = props.environmentIdentifier;
        this.serviceIdentifier = props.serviceIdentifier;
        this.defaultRoute = props.defaultRoute;
        this.routeType = props.routeType;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RefactorSpaces::Route", props.tags, { tagPropertyName: 'tags' });
        this.uriPathRoute = props.uriPathRoute;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRoute.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationIdentifier: this.applicationIdentifier,
            environmentIdentifier: this.environmentIdentifier,
            serviceIdentifier: this.serviceIdentifier,
            defaultRoute: this.defaultRoute,
            routeType: this.routeType,
            tags: this.tags.renderTags(),
            uriPathRoute: this.uriPathRoute,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRoutePropsToCloudFormation(props);
    }
}

export namespace CfnRoute {
    /**
     * The configuration for the default route type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-defaultrouteinput.html
     */
    export interface DefaultRouteInputProperty {
        /**
         * If set to `ACTIVE` , traffic is forwarded to this route’s service after the route is created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-defaultrouteinput.html#cfn-refactorspaces-route-defaultrouteinput-activationstate
         */
        readonly activationState: string;
    }
}

/**
 * Determine whether the given properties match those of a `DefaultRouteInputProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultRouteInputProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_DefaultRouteInputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('activationState', cdk.requiredValidator)(properties.activationState));
    errors.collect(cdk.propertyValidator('activationState', cdk.validateString)(properties.activationState));
    return errors.wrap('supplied properties not correct for "DefaultRouteInputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RefactorSpaces::Route.DefaultRouteInput` resource
 *
 * @param properties - the TypeScript properties of a `DefaultRouteInputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RefactorSpaces::Route.DefaultRouteInput` resource.
 */
// @ts-ignore TS6133
function cfnRouteDefaultRouteInputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_DefaultRouteInputPropertyValidator(properties).assertSuccess();
    return {
        ActivationState: cdk.stringToCloudFormation(properties.activationState),
    };
}

// @ts-ignore TS6133
function CfnRouteDefaultRouteInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.DefaultRouteInputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.DefaultRouteInputProperty>();
    ret.addPropertyResult('activationState', 'ActivationState', cfn_parse.FromCloudFormation.getString(properties.ActivationState));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * The configuration for the URI path route type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html
     */
    export interface UriPathRouteInputProperty {
        /**
         * If set to `ACTIVE` , traffic is forwarded to this route’s service after the route is created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html#cfn-refactorspaces-route-uripathrouteinput-activationstate
         */
        readonly activationState: string;
        /**
         * Indicates whether to match all subpaths of the given source path. If this value is `false` , requests must match the source path exactly before they are forwarded to this route's service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html#cfn-refactorspaces-route-uripathrouteinput-includechildpaths
         */
        readonly includeChildPaths?: boolean | cdk.IResolvable;
        /**
         * A list of HTTP methods to match. An empty list matches all values. If a method is present, only HTTP requests using that method are forwarded to this route’s service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html#cfn-refactorspaces-route-uripathrouteinput-methods
         */
        readonly methods?: string[];
        /**
         * The path to use to match traffic. Paths must start with `/` and are relative to the base of the application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html#cfn-refactorspaces-route-uripathrouteinput-sourcepath
         */
        readonly sourcePath?: string;
    }
}

/**
 * Determine whether the given properties match those of a `UriPathRouteInputProperty`
 *
 * @param properties - the TypeScript properties of a `UriPathRouteInputProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_UriPathRouteInputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('activationState', cdk.requiredValidator)(properties.activationState));
    errors.collect(cdk.propertyValidator('activationState', cdk.validateString)(properties.activationState));
    errors.collect(cdk.propertyValidator('includeChildPaths', cdk.validateBoolean)(properties.includeChildPaths));
    errors.collect(cdk.propertyValidator('methods', cdk.listValidator(cdk.validateString))(properties.methods));
    errors.collect(cdk.propertyValidator('sourcePath', cdk.validateString)(properties.sourcePath));
    return errors.wrap('supplied properties not correct for "UriPathRouteInputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RefactorSpaces::Route.UriPathRouteInput` resource
 *
 * @param properties - the TypeScript properties of a `UriPathRouteInputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RefactorSpaces::Route.UriPathRouteInput` resource.
 */
// @ts-ignore TS6133
function cfnRouteUriPathRouteInputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_UriPathRouteInputPropertyValidator(properties).assertSuccess();
    return {
        ActivationState: cdk.stringToCloudFormation(properties.activationState),
        IncludeChildPaths: cdk.booleanToCloudFormation(properties.includeChildPaths),
        Methods: cdk.listMapper(cdk.stringToCloudFormation)(properties.methods),
        SourcePath: cdk.stringToCloudFormation(properties.sourcePath),
    };
}

// @ts-ignore TS6133
function CfnRouteUriPathRouteInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.UriPathRouteInputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.UriPathRouteInputProperty>();
    ret.addPropertyResult('activationState', 'ActivationState', cfn_parse.FromCloudFormation.getString(properties.ActivationState));
    ret.addPropertyResult('includeChildPaths', 'IncludeChildPaths', properties.IncludeChildPaths != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeChildPaths) : undefined);
    ret.addPropertyResult('methods', 'Methods', properties.Methods != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Methods) : undefined);
    ret.addPropertyResult('sourcePath', 'SourcePath', properties.SourcePath != null ? cfn_parse.FromCloudFormation.getString(properties.SourcePath) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnService`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html
 */
export interface CfnServiceProps {

    /**
     * The unique identifier of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-applicationidentifier
     */
    readonly applicationIdentifier: string;

    /**
     * The unique identifier of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-environmentidentifier
     */
    readonly environmentIdentifier: string;

    /**
     * A description of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-description
     */
    readonly description?: string;

    /**
     * The endpoint type of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-endpointtype
     */
    readonly endpointType?: string;

    /**
     * A summary of the configuration for the AWS Lambda endpoint type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-lambdaendpoint
     */
    readonly lambdaEndpoint?: CfnService.LambdaEndpointInputProperty | cdk.IResolvable;

    /**
     * The name of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-name
     */
    readonly name?: string;

    /**
     * The tags assigned to the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The summary of the configuration for the URL endpoint type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-urlendpoint
     */
    readonly urlEndpoint?: CfnService.UrlEndpointInputProperty | cdk.IResolvable;

    /**
     * The ID of the virtual private cloud (VPC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-vpcid
     */
    readonly vpcId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnServiceProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceProps`
 *
 * @returns the result of the validation.
 */
function CfnServicePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationIdentifier', cdk.requiredValidator)(properties.applicationIdentifier));
    errors.collect(cdk.propertyValidator('applicationIdentifier', cdk.validateString)(properties.applicationIdentifier));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('endpointType', cdk.validateString)(properties.endpointType));
    errors.collect(cdk.propertyValidator('environmentIdentifier', cdk.requiredValidator)(properties.environmentIdentifier));
    errors.collect(cdk.propertyValidator('environmentIdentifier', cdk.validateString)(properties.environmentIdentifier));
    errors.collect(cdk.propertyValidator('lambdaEndpoint', CfnService_LambdaEndpointInputPropertyValidator)(properties.lambdaEndpoint));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('urlEndpoint', CfnService_UrlEndpointInputPropertyValidator)(properties.urlEndpoint));
    errors.collect(cdk.propertyValidator('vpcId', cdk.validateString)(properties.vpcId));
    return errors.wrap('supplied properties not correct for "CfnServiceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RefactorSpaces::Service` resource
 *
 * @param properties - the TypeScript properties of a `CfnServiceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RefactorSpaces::Service` resource.
 */
// @ts-ignore TS6133
function cfnServicePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnServicePropsValidator(properties).assertSuccess();
    return {
        ApplicationIdentifier: cdk.stringToCloudFormation(properties.applicationIdentifier),
        EnvironmentIdentifier: cdk.stringToCloudFormation(properties.environmentIdentifier),
        Description: cdk.stringToCloudFormation(properties.description),
        EndpointType: cdk.stringToCloudFormation(properties.endpointType),
        LambdaEndpoint: cfnServiceLambdaEndpointInputPropertyToCloudFormation(properties.lambdaEndpoint),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        UrlEndpoint: cfnServiceUrlEndpointInputPropertyToCloudFormation(properties.urlEndpoint),
        VpcId: cdk.stringToCloudFormation(properties.vpcId),
    };
}

// @ts-ignore TS6133
function CfnServicePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceProps>();
    ret.addPropertyResult('applicationIdentifier', 'ApplicationIdentifier', cfn_parse.FromCloudFormation.getString(properties.ApplicationIdentifier));
    ret.addPropertyResult('environmentIdentifier', 'EnvironmentIdentifier', cfn_parse.FromCloudFormation.getString(properties.EnvironmentIdentifier));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('endpointType', 'EndpointType', properties.EndpointType != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointType) : undefined);
    ret.addPropertyResult('lambdaEndpoint', 'LambdaEndpoint', properties.LambdaEndpoint != null ? CfnServiceLambdaEndpointInputPropertyFromCloudFormation(properties.LambdaEndpoint) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('urlEndpoint', 'UrlEndpoint', properties.UrlEndpoint != null ? CfnServiceUrlEndpointInputPropertyFromCloudFormation(properties.UrlEndpoint) : undefined);
    ret.addPropertyResult('vpcId', 'VpcId', properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::RefactorSpaces::Service`
 *
 * Creates an AWS Migration Hub Refactor Spaces service. The account owner of the service is always the environment owner, regardless of which account in the environment creates the service. Services have either a URL endpoint in a virtual private cloud (VPC), or a Lambda function endpoint.
 *
 * > If an AWS resource is launched in a service VPC, and you want it to be accessible to all of an environment’s services with VPCs and routes, apply the `RefactorSpacesSecurityGroup` to the resource. Alternatively, to add more cross-account constraints, apply your own security group.
 *
 * @cloudformationResource AWS::RefactorSpaces::Service
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html
 */
export class CfnService extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RefactorSpaces::Service";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnService {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnServicePropsFromCloudFormation(resourceProperties);
        const ret = new CfnService(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the service.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The unique identifier of the service.
     * @cloudformationAttribute ServiceIdentifier
     */
    public readonly attrServiceIdentifier: string;

    /**
     * The unique identifier of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-applicationidentifier
     */
    public applicationIdentifier: string;

    /**
     * The unique identifier of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-environmentidentifier
     */
    public environmentIdentifier: string;

    /**
     * A description of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-description
     */
    public description: string | undefined;

    /**
     * The endpoint type of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-endpointtype
     */
    public endpointType: string | undefined;

    /**
     * A summary of the configuration for the AWS Lambda endpoint type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-lambdaendpoint
     */
    public lambdaEndpoint: CfnService.LambdaEndpointInputProperty | cdk.IResolvable | undefined;

    /**
     * The name of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-name
     */
    public name: string | undefined;

    /**
     * The tags assigned to the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The summary of the configuration for the URL endpoint type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-urlendpoint
     */
    public urlEndpoint: CfnService.UrlEndpointInputProperty | cdk.IResolvable | undefined;

    /**
     * The ID of the virtual private cloud (VPC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-vpcid
     */
    public vpcId: string | undefined;

    /**
     * Create a new `AWS::RefactorSpaces::Service`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnServiceProps) {
        super(scope, id, { type: CfnService.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationIdentifier', this);
        cdk.requireProperty(props, 'environmentIdentifier', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrServiceIdentifier = cdk.Token.asString(this.getAtt('ServiceIdentifier', cdk.ResolutionTypeHint.STRING));

        this.applicationIdentifier = props.applicationIdentifier;
        this.environmentIdentifier = props.environmentIdentifier;
        this.description = props.description;
        this.endpointType = props.endpointType;
        this.lambdaEndpoint = props.lambdaEndpoint;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RefactorSpaces::Service", props.tags, { tagPropertyName: 'tags' });
        this.urlEndpoint = props.urlEndpoint;
        this.vpcId = props.vpcId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnService.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationIdentifier: this.applicationIdentifier,
            environmentIdentifier: this.environmentIdentifier,
            description: this.description,
            endpointType: this.endpointType,
            lambdaEndpoint: this.lambdaEndpoint,
            name: this.name,
            tags: this.tags.renderTags(),
            urlEndpoint: this.urlEndpoint,
            vpcId: this.vpcId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnServicePropsToCloudFormation(props);
    }
}

export namespace CfnService {
    /**
     * The input for the AWS Lambda endpoint type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-service-lambdaendpointinput.html
     */
    export interface LambdaEndpointInputProperty {
        /**
         * The Amazon Resource Name (ARN) of the Lambda function or alias.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-service-lambdaendpointinput.html#cfn-refactorspaces-service-lambdaendpointinput-arn
         */
        readonly arn: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaEndpointInputProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaEndpointInputProperty`
 *
 * @returns the result of the validation.
 */
function CfnService_LambdaEndpointInputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    return errors.wrap('supplied properties not correct for "LambdaEndpointInputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RefactorSpaces::Service.LambdaEndpointInput` resource
 *
 * @param properties - the TypeScript properties of a `LambdaEndpointInputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RefactorSpaces::Service.LambdaEndpointInput` resource.
 */
// @ts-ignore TS6133
function cfnServiceLambdaEndpointInputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnService_LambdaEndpointInputPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
    };
}

// @ts-ignore TS6133
function CfnServiceLambdaEndpointInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.LambdaEndpointInputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.LambdaEndpointInputProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnService {
    /**
     * The configuration for the URL endpoint type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-service-urlendpointinput.html
     */
    export interface UrlEndpointInputProperty {
        /**
         * The health check URL of the URL endpoint type. If the URL is a public endpoint, the `HealthUrl` must also be a public endpoint. If the URL is a private endpoint inside a virtual private cloud (VPC), the health URL must also be a private endpoint, and the host must be the same as the URL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-service-urlendpointinput.html#cfn-refactorspaces-service-urlendpointinput-healthurl
         */
        readonly healthUrl?: string;
        /**
         * The URL to route traffic to. The URL must be an [rfc3986-formatted URL](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc3986) . If the host is a domain name, the name must be resolvable over the public internet. If the scheme is `https` , the top level domain of the host must be listed in the [IANA root zone database](https://docs.aws.amazon.com/https://www.iana.org/domains/root/db) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-service-urlendpointinput.html#cfn-refactorspaces-service-urlendpointinput-url
         */
        readonly url: string;
    }
}

/**
 * Determine whether the given properties match those of a `UrlEndpointInputProperty`
 *
 * @param properties - the TypeScript properties of a `UrlEndpointInputProperty`
 *
 * @returns the result of the validation.
 */
function CfnService_UrlEndpointInputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('healthUrl', cdk.validateString)(properties.healthUrl));
    errors.collect(cdk.propertyValidator('url', cdk.requiredValidator)(properties.url));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    return errors.wrap('supplied properties not correct for "UrlEndpointInputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RefactorSpaces::Service.UrlEndpointInput` resource
 *
 * @param properties - the TypeScript properties of a `UrlEndpointInputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RefactorSpaces::Service.UrlEndpointInput` resource.
 */
// @ts-ignore TS6133
function cfnServiceUrlEndpointInputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnService_UrlEndpointInputPropertyValidator(properties).assertSuccess();
    return {
        HealthUrl: cdk.stringToCloudFormation(properties.healthUrl),
        Url: cdk.stringToCloudFormation(properties.url),
    };
}

// @ts-ignore TS6133
function CfnServiceUrlEndpointInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.UrlEndpointInputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.UrlEndpointInputProperty>();
    ret.addPropertyResult('healthUrl', 'HealthUrl', properties.HealthUrl != null ? cfn_parse.FromCloudFormation.getString(properties.HealthUrl) : undefined);
    ret.addPropertyResult('url', 'Url', cfn_parse.FromCloudFormation.getString(properties.Url));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
