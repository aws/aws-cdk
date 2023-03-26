// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T06:40:00.648Z","fingerprint":"wp3/ux7MuVi2iehzuanU3Or1g/45a0dxlUH8h36YVQw="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnGatewayRoute`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html
 */
export interface CfnGatewayRouteProps {

    /**
     * The name of the service mesh that the resource resides in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-meshname
     */
    readonly meshName: string;

    /**
     * The specifications of the gateway route.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-spec
     */
    readonly spec: CfnGatewayRoute.GatewayRouteSpecProperty | cdk.IResolvable;

    /**
     * The virtual gateway that the gateway route is associated with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-virtualgatewayname
     */
    readonly virtualGatewayName: string;

    /**
     * The name of the gateway route.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-gatewayroutename
     */
    readonly gatewayRouteName?: string;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-meshowner
     */
    readonly meshOwner?: string;

    /**
     * Optional metadata that you can apply to the gateway route to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnGatewayRouteProps`
 *
 * @param properties - the TypeScript properties of a `CfnGatewayRouteProps`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoutePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('gatewayRouteName', cdk.validateString)(properties.gatewayRouteName));
    errors.collect(cdk.propertyValidator('meshName', cdk.requiredValidator)(properties.meshName));
    errors.collect(cdk.propertyValidator('meshName', cdk.validateString)(properties.meshName));
    errors.collect(cdk.propertyValidator('meshOwner', cdk.validateString)(properties.meshOwner));
    errors.collect(cdk.propertyValidator('spec', cdk.requiredValidator)(properties.spec));
    errors.collect(cdk.propertyValidator('spec', CfnGatewayRoute_GatewayRouteSpecPropertyValidator)(properties.spec));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('virtualGatewayName', cdk.requiredValidator)(properties.virtualGatewayName));
    errors.collect(cdk.propertyValidator('virtualGatewayName', cdk.validateString)(properties.virtualGatewayName));
    return errors.wrap('supplied properties not correct for "CfnGatewayRouteProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute` resource
 *
 * @param properties - the TypeScript properties of a `CfnGatewayRouteProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRoutePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoutePropsValidator(properties).assertSuccess();
    return {
        MeshName: cdk.stringToCloudFormation(properties.meshName),
        Spec: cfnGatewayRouteGatewayRouteSpecPropertyToCloudFormation(properties.spec),
        VirtualGatewayName: cdk.stringToCloudFormation(properties.virtualGatewayName),
        GatewayRouteName: cdk.stringToCloudFormation(properties.gatewayRouteName),
        MeshOwner: cdk.stringToCloudFormation(properties.meshOwner),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnGatewayRoutePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRouteProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRouteProps>();
    ret.addPropertyResult('meshName', 'MeshName', cfn_parse.FromCloudFormation.getString(properties.MeshName));
    ret.addPropertyResult('spec', 'Spec', CfnGatewayRouteGatewayRouteSpecPropertyFromCloudFormation(properties.Spec));
    ret.addPropertyResult('virtualGatewayName', 'VirtualGatewayName', cfn_parse.FromCloudFormation.getString(properties.VirtualGatewayName));
    ret.addPropertyResult('gatewayRouteName', 'GatewayRouteName', properties.GatewayRouteName != null ? cfn_parse.FromCloudFormation.getString(properties.GatewayRouteName) : undefined);
    ret.addPropertyResult('meshOwner', 'MeshOwner', properties.MeshOwner != null ? cfn_parse.FromCloudFormation.getString(properties.MeshOwner) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppMesh::GatewayRoute`
 *
 * Creates a gateway route.
 *
 * A gateway route is attached to a virtual gateway and routes traffic to an existing virtual service. If a route matches a request, it can distribute traffic to a target virtual service.
 *
 * For more information about gateway routes, see [Gateway routes](https://docs.aws.amazon.com/app-mesh/latest/userguide/gateway-routes.html) .
 *
 * @cloudformationResource AWS::AppMesh::GatewayRoute
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html
 */
export class CfnGatewayRoute extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppMesh::GatewayRoute";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGatewayRoute {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnGatewayRoutePropsFromCloudFormation(resourceProperties);
        const ret = new CfnGatewayRoute(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The full Amazon Resource Name (ARN) for the gateway route.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the gateway route.
     * @cloudformationAttribute GatewayRouteName
     */
    public readonly attrGatewayRouteName: string;

    /**
     * The name of the service mesh that the gateway route resides in.
     * @cloudformationAttribute MeshName
     */
    public readonly attrMeshName: string;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     * @cloudformationAttribute MeshOwner
     */
    public readonly attrMeshOwner: string;

    /**
     * The IAM account ID of the resource owner. If the account ID is not your own, then it's the ID of the mesh owner or of another account that the mesh is shared with. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     * @cloudformationAttribute ResourceOwner
     */
    public readonly attrResourceOwner: string;

    /**
     * The unique identifier for the gateway route.
     * @cloudformationAttribute Uid
     */
    public readonly attrUid: string;

    /**
     * The name of the virtual gateway that the gateway route is associated with.
     * @cloudformationAttribute VirtualGatewayName
     */
    public readonly attrVirtualGatewayName: string;

    /**
     * The name of the service mesh that the resource resides in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-meshname
     */
    public meshName: string;

    /**
     * The specifications of the gateway route.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-spec
     */
    public spec: CfnGatewayRoute.GatewayRouteSpecProperty | cdk.IResolvable;

    /**
     * The virtual gateway that the gateway route is associated with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-virtualgatewayname
     */
    public virtualGatewayName: string;

    /**
     * The name of the gateway route.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-gatewayroutename
     */
    public gatewayRouteName: string | undefined;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-meshowner
     */
    public meshOwner: string | undefined;

    /**
     * Optional metadata that you can apply to the gateway route to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-gatewayroute.html#cfn-appmesh-gatewayroute-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::AppMesh::GatewayRoute`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGatewayRouteProps) {
        super(scope, id, { type: CfnGatewayRoute.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'meshName', this);
        cdk.requireProperty(props, 'spec', this);
        cdk.requireProperty(props, 'virtualGatewayName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrGatewayRouteName = cdk.Token.asString(this.getAtt('GatewayRouteName', cdk.ResolutionTypeHint.STRING));
        this.attrMeshName = cdk.Token.asString(this.getAtt('MeshName', cdk.ResolutionTypeHint.STRING));
        this.attrMeshOwner = cdk.Token.asString(this.getAtt('MeshOwner', cdk.ResolutionTypeHint.STRING));
        this.attrResourceOwner = cdk.Token.asString(this.getAtt('ResourceOwner', cdk.ResolutionTypeHint.STRING));
        this.attrUid = cdk.Token.asString(this.getAtt('Uid', cdk.ResolutionTypeHint.STRING));
        this.attrVirtualGatewayName = cdk.Token.asString(this.getAtt('VirtualGatewayName', cdk.ResolutionTypeHint.STRING));

        this.meshName = props.meshName;
        this.spec = props.spec;
        this.virtualGatewayName = props.virtualGatewayName;
        this.gatewayRouteName = props.gatewayRouteName;
        this.meshOwner = props.meshOwner;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppMesh::GatewayRoute", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnGatewayRoute.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            meshName: this.meshName,
            spec: this.spec,
            virtualGatewayName: this.virtualGatewayName,
            gatewayRouteName: this.gatewayRouteName,
            meshOwner: this.meshOwner,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnGatewayRoutePropsToCloudFormation(props);
    }
}

export namespace CfnGatewayRoute {
    /**
     * An object representing the gateway route host name to match.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutehostnamematch.html
     */
    export interface GatewayRouteHostnameMatchProperty {
        /**
         * The exact host name to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutehostnamematch.html#cfn-appmesh-gatewayroute-gatewayroutehostnamematch-exact
         */
        readonly exact?: string;
        /**
         * The specified ending characters of the host name to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutehostnamematch.html#cfn-appmesh-gatewayroute-gatewayroutehostnamematch-suffix
         */
        readonly suffix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `GatewayRouteHostnameMatchProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayRouteHostnameMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_GatewayRouteHostnameMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('exact', cdk.validateString)(properties.exact));
    errors.collect(cdk.propertyValidator('suffix', cdk.validateString)(properties.suffix));
    return errors.wrap('supplied properties not correct for "GatewayRouteHostnameMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GatewayRouteHostnameMatch` resource
 *
 * @param properties - the TypeScript properties of a `GatewayRouteHostnameMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GatewayRouteHostnameMatch` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteGatewayRouteHostnameMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_GatewayRouteHostnameMatchPropertyValidator(properties).assertSuccess();
    return {
        Exact: cdk.stringToCloudFormation(properties.exact),
        Suffix: cdk.stringToCloudFormation(properties.suffix),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteHostnameMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GatewayRouteHostnameMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GatewayRouteHostnameMatchProperty>();
    ret.addPropertyResult('exact', 'Exact', properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined);
    ret.addPropertyResult('suffix', 'Suffix', properties.Suffix != null ? cfn_parse.FromCloudFormation.getString(properties.Suffix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object representing the gateway route host name to rewrite.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutehostnamerewrite.html
     */
    export interface GatewayRouteHostnameRewriteProperty {
        /**
         * The default target host name to write to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutehostnamerewrite.html#cfn-appmesh-gatewayroute-gatewayroutehostnamerewrite-defaulttargethostname
         */
        readonly defaultTargetHostname?: string;
    }
}

/**
 * Determine whether the given properties match those of a `GatewayRouteHostnameRewriteProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayRouteHostnameRewriteProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_GatewayRouteHostnameRewritePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultTargetHostname', cdk.validateString)(properties.defaultTargetHostname));
    return errors.wrap('supplied properties not correct for "GatewayRouteHostnameRewriteProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GatewayRouteHostnameRewrite` resource
 *
 * @param properties - the TypeScript properties of a `GatewayRouteHostnameRewriteProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GatewayRouteHostnameRewrite` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteGatewayRouteHostnameRewritePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_GatewayRouteHostnameRewritePropertyValidator(properties).assertSuccess();
    return {
        DefaultTargetHostname: cdk.stringToCloudFormation(properties.defaultTargetHostname),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteHostnameRewritePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GatewayRouteHostnameRewriteProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GatewayRouteHostnameRewriteProperty>();
    ret.addPropertyResult('defaultTargetHostname', 'DefaultTargetHostname', properties.DefaultTargetHostname != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultTargetHostname) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object representing the method header to be matched.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutemetadatamatch.html
     */
    export interface GatewayRouteMetadataMatchProperty {
        /**
         * The exact method header to be matched on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutemetadatamatch.html#cfn-appmesh-gatewayroute-gatewayroutemetadatamatch-exact
         */
        readonly exact?: string;
        /**
         * The specified beginning characters of the method header to be matched on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutemetadatamatch.html#cfn-appmesh-gatewayroute-gatewayroutemetadatamatch-prefix
         */
        readonly prefix?: string;
        /**
         * An object that represents the range of values to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutemetadatamatch.html#cfn-appmesh-gatewayroute-gatewayroutemetadatamatch-range
         */
        readonly range?: CfnGatewayRoute.GatewayRouteRangeMatchProperty | cdk.IResolvable;
        /**
         * The regex used to match the method header.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutemetadatamatch.html#cfn-appmesh-gatewayroute-gatewayroutemetadatamatch-regex
         */
        readonly regex?: string;
        /**
         * The specified ending characters of the method header to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutemetadatamatch.html#cfn-appmesh-gatewayroute-gatewayroutemetadatamatch-suffix
         */
        readonly suffix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `GatewayRouteMetadataMatchProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayRouteMetadataMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_GatewayRouteMetadataMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('exact', cdk.validateString)(properties.exact));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('range', CfnGatewayRoute_GatewayRouteRangeMatchPropertyValidator)(properties.range));
    errors.collect(cdk.propertyValidator('regex', cdk.validateString)(properties.regex));
    errors.collect(cdk.propertyValidator('suffix', cdk.validateString)(properties.suffix));
    return errors.wrap('supplied properties not correct for "GatewayRouteMetadataMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GatewayRouteMetadataMatch` resource
 *
 * @param properties - the TypeScript properties of a `GatewayRouteMetadataMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GatewayRouteMetadataMatch` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteGatewayRouteMetadataMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_GatewayRouteMetadataMatchPropertyValidator(properties).assertSuccess();
    return {
        Exact: cdk.stringToCloudFormation(properties.exact),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        Range: cfnGatewayRouteGatewayRouteRangeMatchPropertyToCloudFormation(properties.range),
        Regex: cdk.stringToCloudFormation(properties.regex),
        Suffix: cdk.stringToCloudFormation(properties.suffix),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteMetadataMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GatewayRouteMetadataMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GatewayRouteMetadataMatchProperty>();
    ret.addPropertyResult('exact', 'Exact', properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('range', 'Range', properties.Range != null ? CfnGatewayRouteGatewayRouteRangeMatchPropertyFromCloudFormation(properties.Range) : undefined);
    ret.addPropertyResult('regex', 'Regex', properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined);
    ret.addPropertyResult('suffix', 'Suffix', properties.Suffix != null ? cfn_parse.FromCloudFormation.getString(properties.Suffix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object that represents the range of values to match on. The first character of the range is included in the range, though the last character is not. For example, if the range specified were 1-100, only values 1-99 would be matched.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayrouterangematch.html
     */
    export interface GatewayRouteRangeMatchProperty {
        /**
         * The end of the range.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayrouterangematch.html#cfn-appmesh-gatewayroute-gatewayrouterangematch-end
         */
        readonly end: number;
        /**
         * The start of the range.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayrouterangematch.html#cfn-appmesh-gatewayroute-gatewayrouterangematch-start
         */
        readonly start: number;
    }
}

/**
 * Determine whether the given properties match those of a `GatewayRouteRangeMatchProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayRouteRangeMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_GatewayRouteRangeMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('end', cdk.requiredValidator)(properties.end));
    errors.collect(cdk.propertyValidator('end', cdk.validateNumber)(properties.end));
    errors.collect(cdk.propertyValidator('start', cdk.requiredValidator)(properties.start));
    errors.collect(cdk.propertyValidator('start', cdk.validateNumber)(properties.start));
    return errors.wrap('supplied properties not correct for "GatewayRouteRangeMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GatewayRouteRangeMatch` resource
 *
 * @param properties - the TypeScript properties of a `GatewayRouteRangeMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GatewayRouteRangeMatch` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteGatewayRouteRangeMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_GatewayRouteRangeMatchPropertyValidator(properties).assertSuccess();
    return {
        End: cdk.numberToCloudFormation(properties.end),
        Start: cdk.numberToCloudFormation(properties.start),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteRangeMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GatewayRouteRangeMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GatewayRouteRangeMatchProperty>();
    ret.addPropertyResult('end', 'End', cfn_parse.FromCloudFormation.getNumber(properties.End));
    ret.addPropertyResult('start', 'Start', cfn_parse.FromCloudFormation.getNumber(properties.Start));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object that represents a gateway route specification. Specify one gateway route type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutespec.html
     */
    export interface GatewayRouteSpecProperty {
        /**
         * An object that represents the specification of a gRPC gateway route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutespec.html#cfn-appmesh-gatewayroute-gatewayroutespec-grpcroute
         */
        readonly grpcRoute?: CfnGatewayRoute.GrpcGatewayRouteProperty | cdk.IResolvable;
        /**
         * An object that represents the specification of an HTTP/2 gateway route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutespec.html#cfn-appmesh-gatewayroute-gatewayroutespec-http2route
         */
        readonly http2Route?: CfnGatewayRoute.HttpGatewayRouteProperty | cdk.IResolvable;
        /**
         * An object that represents the specification of an HTTP gateway route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutespec.html#cfn-appmesh-gatewayroute-gatewayroutespec-httproute
         */
        readonly httpRoute?: CfnGatewayRoute.HttpGatewayRouteProperty | cdk.IResolvable;
        /**
         * The ordering of the gateway routes spec.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutespec.html#cfn-appmesh-gatewayroute-gatewayroutespec-priority
         */
        readonly priority?: number;
    }
}

/**
 * Determine whether the given properties match those of a `GatewayRouteSpecProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayRouteSpecProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_GatewayRouteSpecPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('grpcRoute', CfnGatewayRoute_GrpcGatewayRoutePropertyValidator)(properties.grpcRoute));
    errors.collect(cdk.propertyValidator('http2Route', CfnGatewayRoute_HttpGatewayRoutePropertyValidator)(properties.http2Route));
    errors.collect(cdk.propertyValidator('httpRoute', CfnGatewayRoute_HttpGatewayRoutePropertyValidator)(properties.httpRoute));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    return errors.wrap('supplied properties not correct for "GatewayRouteSpecProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GatewayRouteSpec` resource
 *
 * @param properties - the TypeScript properties of a `GatewayRouteSpecProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GatewayRouteSpec` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteGatewayRouteSpecPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_GatewayRouteSpecPropertyValidator(properties).assertSuccess();
    return {
        GrpcRoute: cfnGatewayRouteGrpcGatewayRoutePropertyToCloudFormation(properties.grpcRoute),
        Http2Route: cfnGatewayRouteHttpGatewayRoutePropertyToCloudFormation(properties.http2Route),
        HttpRoute: cfnGatewayRouteHttpGatewayRoutePropertyToCloudFormation(properties.httpRoute),
        Priority: cdk.numberToCloudFormation(properties.priority),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteSpecPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GatewayRouteSpecProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GatewayRouteSpecProperty>();
    ret.addPropertyResult('grpcRoute', 'GrpcRoute', properties.GrpcRoute != null ? CfnGatewayRouteGrpcGatewayRoutePropertyFromCloudFormation(properties.GrpcRoute) : undefined);
    ret.addPropertyResult('http2Route', 'Http2Route', properties.Http2Route != null ? CfnGatewayRouteHttpGatewayRoutePropertyFromCloudFormation(properties.Http2Route) : undefined);
    ret.addPropertyResult('httpRoute', 'HttpRoute', properties.HttpRoute != null ? CfnGatewayRouteHttpGatewayRoutePropertyFromCloudFormation(properties.HttpRoute) : undefined);
    ret.addPropertyResult('priority', 'Priority', properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object that represents a gateway route target.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutetarget.html
     */
    export interface GatewayRouteTargetProperty {
        /**
         * The port number of the gateway route target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutetarget.html#cfn-appmesh-gatewayroute-gatewayroutetarget-port
         */
        readonly port?: number;
        /**
         * An object that represents a virtual service gateway route target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutetarget.html#cfn-appmesh-gatewayroute-gatewayroutetarget-virtualservice
         */
        readonly virtualService: CfnGatewayRoute.GatewayRouteVirtualServiceProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `GatewayRouteTargetProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayRouteTargetProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_GatewayRouteTargetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('virtualService', cdk.requiredValidator)(properties.virtualService));
    errors.collect(cdk.propertyValidator('virtualService', CfnGatewayRoute_GatewayRouteVirtualServicePropertyValidator)(properties.virtualService));
    return errors.wrap('supplied properties not correct for "GatewayRouteTargetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GatewayRouteTarget` resource
 *
 * @param properties - the TypeScript properties of a `GatewayRouteTargetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GatewayRouteTarget` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteGatewayRouteTargetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_GatewayRouteTargetPropertyValidator(properties).assertSuccess();
    return {
        Port: cdk.numberToCloudFormation(properties.port),
        VirtualService: cfnGatewayRouteGatewayRouteVirtualServicePropertyToCloudFormation(properties.virtualService),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GatewayRouteTargetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GatewayRouteTargetProperty>();
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('virtualService', 'VirtualService', CfnGatewayRouteGatewayRouteVirtualServicePropertyFromCloudFormation(properties.VirtualService));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object that represents the virtual service that traffic is routed to.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutevirtualservice.html
     */
    export interface GatewayRouteVirtualServiceProperty {
        /**
         * The name of the virtual service that traffic is routed to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-gatewayroutevirtualservice.html#cfn-appmesh-gatewayroute-gatewayroutevirtualservice-virtualservicename
         */
        readonly virtualServiceName: string;
    }
}

/**
 * Determine whether the given properties match those of a `GatewayRouteVirtualServiceProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayRouteVirtualServiceProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_GatewayRouteVirtualServicePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('virtualServiceName', cdk.requiredValidator)(properties.virtualServiceName));
    errors.collect(cdk.propertyValidator('virtualServiceName', cdk.validateString)(properties.virtualServiceName));
    return errors.wrap('supplied properties not correct for "GatewayRouteVirtualServiceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GatewayRouteVirtualService` resource
 *
 * @param properties - the TypeScript properties of a `GatewayRouteVirtualServiceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GatewayRouteVirtualService` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteGatewayRouteVirtualServicePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_GatewayRouteVirtualServicePropertyValidator(properties).assertSuccess();
    return {
        VirtualServiceName: cdk.stringToCloudFormation(properties.virtualServiceName),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteGatewayRouteVirtualServicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GatewayRouteVirtualServiceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GatewayRouteVirtualServiceProperty>();
    ret.addPropertyResult('virtualServiceName', 'VirtualServiceName', cfn_parse.FromCloudFormation.getString(properties.VirtualServiceName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object that represents a gRPC gateway route.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroute.html
     */
    export interface GrpcGatewayRouteProperty {
        /**
         * An object that represents the action to take if a match is determined.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroute.html#cfn-appmesh-gatewayroute-grpcgatewayroute-action
         */
        readonly action: CfnGatewayRoute.GrpcGatewayRouteActionProperty | cdk.IResolvable;
        /**
         * An object that represents the criteria for determining a request match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroute.html#cfn-appmesh-gatewayroute-grpcgatewayroute-match
         */
        readonly match: CfnGatewayRoute.GrpcGatewayRouteMatchProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `GrpcGatewayRouteProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcGatewayRouteProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_GrpcGatewayRoutePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', CfnGatewayRoute_GrpcGatewayRouteActionPropertyValidator)(properties.action));
    errors.collect(cdk.propertyValidator('match', cdk.requiredValidator)(properties.match));
    errors.collect(cdk.propertyValidator('match', CfnGatewayRoute_GrpcGatewayRouteMatchPropertyValidator)(properties.match));
    return errors.wrap('supplied properties not correct for "GrpcGatewayRouteProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GrpcGatewayRoute` resource
 *
 * @param properties - the TypeScript properties of a `GrpcGatewayRouteProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GrpcGatewayRoute` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteGrpcGatewayRoutePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_GrpcGatewayRoutePropertyValidator(properties).assertSuccess();
    return {
        Action: cfnGatewayRouteGrpcGatewayRouteActionPropertyToCloudFormation(properties.action),
        Match: cfnGatewayRouteGrpcGatewayRouteMatchPropertyToCloudFormation(properties.match),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteGrpcGatewayRoutePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GrpcGatewayRouteProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GrpcGatewayRouteProperty>();
    ret.addPropertyResult('action', 'Action', CfnGatewayRouteGrpcGatewayRouteActionPropertyFromCloudFormation(properties.Action));
    ret.addPropertyResult('match', 'Match', CfnGatewayRouteGrpcGatewayRouteMatchPropertyFromCloudFormation(properties.Match));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object that represents the action to take if a match is determined.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayrouteaction.html
     */
    export interface GrpcGatewayRouteActionProperty {
        /**
         * The gateway route action to rewrite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayrouteaction.html#cfn-appmesh-gatewayroute-grpcgatewayrouteaction-rewrite
         */
        readonly rewrite?: CfnGatewayRoute.GrpcGatewayRouteRewriteProperty | cdk.IResolvable;
        /**
         * An object that represents the target that traffic is routed to when a request matches the gateway route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayrouteaction.html#cfn-appmesh-gatewayroute-grpcgatewayrouteaction-target
         */
        readonly target: CfnGatewayRoute.GatewayRouteTargetProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `GrpcGatewayRouteActionProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcGatewayRouteActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_GrpcGatewayRouteActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('rewrite', CfnGatewayRoute_GrpcGatewayRouteRewritePropertyValidator)(properties.rewrite));
    errors.collect(cdk.propertyValidator('target', cdk.requiredValidator)(properties.target));
    errors.collect(cdk.propertyValidator('target', CfnGatewayRoute_GatewayRouteTargetPropertyValidator)(properties.target));
    return errors.wrap('supplied properties not correct for "GrpcGatewayRouteActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GrpcGatewayRouteAction` resource
 *
 * @param properties - the TypeScript properties of a `GrpcGatewayRouteActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GrpcGatewayRouteAction` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteGrpcGatewayRouteActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_GrpcGatewayRouteActionPropertyValidator(properties).assertSuccess();
    return {
        Rewrite: cfnGatewayRouteGrpcGatewayRouteRewritePropertyToCloudFormation(properties.rewrite),
        Target: cfnGatewayRouteGatewayRouteTargetPropertyToCloudFormation(properties.target),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteGrpcGatewayRouteActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GrpcGatewayRouteActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GrpcGatewayRouteActionProperty>();
    ret.addPropertyResult('rewrite', 'Rewrite', properties.Rewrite != null ? CfnGatewayRouteGrpcGatewayRouteRewritePropertyFromCloudFormation(properties.Rewrite) : undefined);
    ret.addPropertyResult('target', 'Target', CfnGatewayRouteGatewayRouteTargetPropertyFromCloudFormation(properties.Target));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object that represents the criteria for determining a request match.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutematch.html
     */
    export interface GrpcGatewayRouteMatchProperty {
        /**
         * The gateway route host name to be matched on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutematch.html#cfn-appmesh-gatewayroute-grpcgatewayroutematch-hostname
         */
        readonly hostname?: CfnGatewayRoute.GatewayRouteHostnameMatchProperty | cdk.IResolvable;
        /**
         * The gateway route metadata to be matched on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutematch.html#cfn-appmesh-gatewayroute-grpcgatewayroutematch-metadata
         */
        readonly metadata?: Array<CfnGatewayRoute.GrpcGatewayRouteMetadataProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The gateway route port to be matched on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutematch.html#cfn-appmesh-gatewayroute-grpcgatewayroutematch-port
         */
        readonly port?: number;
        /**
         * The fully qualified domain name for the service to match from the request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutematch.html#cfn-appmesh-gatewayroute-grpcgatewayroutematch-servicename
         */
        readonly serviceName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `GrpcGatewayRouteMatchProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcGatewayRouteMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_GrpcGatewayRouteMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('hostname', CfnGatewayRoute_GatewayRouteHostnameMatchPropertyValidator)(properties.hostname));
    errors.collect(cdk.propertyValidator('metadata', cdk.listValidator(CfnGatewayRoute_GrpcGatewayRouteMetadataPropertyValidator))(properties.metadata));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('serviceName', cdk.validateString)(properties.serviceName));
    return errors.wrap('supplied properties not correct for "GrpcGatewayRouteMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GrpcGatewayRouteMatch` resource
 *
 * @param properties - the TypeScript properties of a `GrpcGatewayRouteMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GrpcGatewayRouteMatch` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteGrpcGatewayRouteMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_GrpcGatewayRouteMatchPropertyValidator(properties).assertSuccess();
    return {
        Hostname: cfnGatewayRouteGatewayRouteHostnameMatchPropertyToCloudFormation(properties.hostname),
        Metadata: cdk.listMapper(cfnGatewayRouteGrpcGatewayRouteMetadataPropertyToCloudFormation)(properties.metadata),
        Port: cdk.numberToCloudFormation(properties.port),
        ServiceName: cdk.stringToCloudFormation(properties.serviceName),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteGrpcGatewayRouteMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GrpcGatewayRouteMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GrpcGatewayRouteMatchProperty>();
    ret.addPropertyResult('hostname', 'Hostname', properties.Hostname != null ? CfnGatewayRouteGatewayRouteHostnameMatchPropertyFromCloudFormation(properties.Hostname) : undefined);
    ret.addPropertyResult('metadata', 'Metadata', properties.Metadata != null ? cfn_parse.FromCloudFormation.getArray(CfnGatewayRouteGrpcGatewayRouteMetadataPropertyFromCloudFormation)(properties.Metadata) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('serviceName', 'ServiceName', properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object representing the metadata of the gateway route.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutemetadata.html
     */
    export interface GrpcGatewayRouteMetadataProperty {
        /**
         * Specify `True` to match anything except the match criteria. The default value is `False` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutemetadata.html#cfn-appmesh-gatewayroute-grpcgatewayroutemetadata-invert
         */
        readonly invert?: boolean | cdk.IResolvable;
        /**
         * The criteria for determining a metadata match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutemetadata.html#cfn-appmesh-gatewayroute-grpcgatewayroutemetadata-match
         */
        readonly match?: CfnGatewayRoute.GatewayRouteMetadataMatchProperty | cdk.IResolvable;
        /**
         * A name for the gateway route metadata.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayroutemetadata.html#cfn-appmesh-gatewayroute-grpcgatewayroutemetadata-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `GrpcGatewayRouteMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcGatewayRouteMetadataProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_GrpcGatewayRouteMetadataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('invert', cdk.validateBoolean)(properties.invert));
    errors.collect(cdk.propertyValidator('match', CfnGatewayRoute_GatewayRouteMetadataMatchPropertyValidator)(properties.match));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "GrpcGatewayRouteMetadataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GrpcGatewayRouteMetadata` resource
 *
 * @param properties - the TypeScript properties of a `GrpcGatewayRouteMetadataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GrpcGatewayRouteMetadata` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteGrpcGatewayRouteMetadataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_GrpcGatewayRouteMetadataPropertyValidator(properties).assertSuccess();
    return {
        Invert: cdk.booleanToCloudFormation(properties.invert),
        Match: cfnGatewayRouteGatewayRouteMetadataMatchPropertyToCloudFormation(properties.match),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteGrpcGatewayRouteMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GrpcGatewayRouteMetadataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GrpcGatewayRouteMetadataProperty>();
    ret.addPropertyResult('invert', 'Invert', properties.Invert != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Invert) : undefined);
    ret.addPropertyResult('match', 'Match', properties.Match != null ? CfnGatewayRouteGatewayRouteMetadataMatchPropertyFromCloudFormation(properties.Match) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object that represents the gateway route to rewrite.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayrouterewrite.html
     */
    export interface GrpcGatewayRouteRewriteProperty {
        /**
         * The host name of the gateway route to rewrite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-grpcgatewayrouterewrite.html#cfn-appmesh-gatewayroute-grpcgatewayrouterewrite-hostname
         */
        readonly hostname?: CfnGatewayRoute.GatewayRouteHostnameRewriteProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `GrpcGatewayRouteRewriteProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcGatewayRouteRewriteProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_GrpcGatewayRouteRewritePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('hostname', CfnGatewayRoute_GatewayRouteHostnameRewritePropertyValidator)(properties.hostname));
    return errors.wrap('supplied properties not correct for "GrpcGatewayRouteRewriteProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GrpcGatewayRouteRewrite` resource
 *
 * @param properties - the TypeScript properties of a `GrpcGatewayRouteRewriteProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.GrpcGatewayRouteRewrite` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteGrpcGatewayRouteRewritePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_GrpcGatewayRouteRewritePropertyValidator(properties).assertSuccess();
    return {
        Hostname: cfnGatewayRouteGatewayRouteHostnameRewritePropertyToCloudFormation(properties.hostname),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteGrpcGatewayRouteRewritePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.GrpcGatewayRouteRewriteProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.GrpcGatewayRouteRewriteProperty>();
    ret.addPropertyResult('hostname', 'Hostname', properties.Hostname != null ? CfnGatewayRouteGatewayRouteHostnameRewritePropertyFromCloudFormation(properties.Hostname) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object that represents an HTTP gateway route.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroute.html
     */
    export interface HttpGatewayRouteProperty {
        /**
         * An object that represents the action to take if a match is determined.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroute.html#cfn-appmesh-gatewayroute-httpgatewayroute-action
         */
        readonly action: CfnGatewayRoute.HttpGatewayRouteActionProperty | cdk.IResolvable;
        /**
         * An object that represents the criteria for determining a request match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroute.html#cfn-appmesh-gatewayroute-httpgatewayroute-match
         */
        readonly match: CfnGatewayRoute.HttpGatewayRouteMatchProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRouteProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_HttpGatewayRoutePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', CfnGatewayRoute_HttpGatewayRouteActionPropertyValidator)(properties.action));
    errors.collect(cdk.propertyValidator('match', cdk.requiredValidator)(properties.match));
    errors.collect(cdk.propertyValidator('match', CfnGatewayRoute_HttpGatewayRouteMatchPropertyValidator)(properties.match));
    return errors.wrap('supplied properties not correct for "HttpGatewayRouteProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRoute` resource
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRoute` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteHttpGatewayRoutePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_HttpGatewayRoutePropertyValidator(properties).assertSuccess();
    return {
        Action: cfnGatewayRouteHttpGatewayRouteActionPropertyToCloudFormation(properties.action),
        Match: cfnGatewayRouteHttpGatewayRouteMatchPropertyToCloudFormation(properties.match),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRoutePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRouteProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRouteProperty>();
    ret.addPropertyResult('action', 'Action', CfnGatewayRouteHttpGatewayRouteActionPropertyFromCloudFormation(properties.Action));
    ret.addPropertyResult('match', 'Match', CfnGatewayRouteHttpGatewayRouteMatchPropertyFromCloudFormation(properties.Match));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object that represents the action to take if a match is determined.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteaction.html
     */
    export interface HttpGatewayRouteActionProperty {
        /**
         * The gateway route action to rewrite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteaction.html#cfn-appmesh-gatewayroute-httpgatewayrouteaction-rewrite
         */
        readonly rewrite?: CfnGatewayRoute.HttpGatewayRouteRewriteProperty | cdk.IResolvable;
        /**
         * An object that represents the target that traffic is routed to when a request matches the gateway route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteaction.html#cfn-appmesh-gatewayroute-httpgatewayrouteaction-target
         */
        readonly target: CfnGatewayRoute.GatewayRouteTargetProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRouteActionProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_HttpGatewayRouteActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('rewrite', CfnGatewayRoute_HttpGatewayRouteRewritePropertyValidator)(properties.rewrite));
    errors.collect(cdk.propertyValidator('target', cdk.requiredValidator)(properties.target));
    errors.collect(cdk.propertyValidator('target', CfnGatewayRoute_GatewayRouteTargetPropertyValidator)(properties.target));
    return errors.wrap('supplied properties not correct for "HttpGatewayRouteActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRouteAction` resource
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRouteAction` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteHttpGatewayRouteActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_HttpGatewayRouteActionPropertyValidator(properties).assertSuccess();
    return {
        Rewrite: cfnGatewayRouteHttpGatewayRouteRewritePropertyToCloudFormation(properties.rewrite),
        Target: cfnGatewayRouteGatewayRouteTargetPropertyToCloudFormation(properties.target),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRouteActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRouteActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRouteActionProperty>();
    ret.addPropertyResult('rewrite', 'Rewrite', properties.Rewrite != null ? CfnGatewayRouteHttpGatewayRouteRewritePropertyFromCloudFormation(properties.Rewrite) : undefined);
    ret.addPropertyResult('target', 'Target', CfnGatewayRouteGatewayRouteTargetPropertyFromCloudFormation(properties.Target));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object that represents the HTTP header in the gateway route.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheader.html
     */
    export interface HttpGatewayRouteHeaderProperty {
        /**
         * Specify `True` to match anything except the match criteria. The default value is `False` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheader.html#cfn-appmesh-gatewayroute-httpgatewayrouteheader-invert
         */
        readonly invert?: boolean | cdk.IResolvable;
        /**
         * An object that represents the method and value to match with the header value sent in a request. Specify one match method.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheader.html#cfn-appmesh-gatewayroute-httpgatewayrouteheader-match
         */
        readonly match?: CfnGatewayRoute.HttpGatewayRouteHeaderMatchProperty | cdk.IResolvable;
        /**
         * A name for the HTTP header in the gateway route that will be matched on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheader.html#cfn-appmesh-gatewayroute-httpgatewayrouteheader-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRouteHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteHeaderProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_HttpGatewayRouteHeaderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('invert', cdk.validateBoolean)(properties.invert));
    errors.collect(cdk.propertyValidator('match', CfnGatewayRoute_HttpGatewayRouteHeaderMatchPropertyValidator)(properties.match));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "HttpGatewayRouteHeaderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRouteHeader` resource
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteHeaderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRouteHeader` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteHttpGatewayRouteHeaderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_HttpGatewayRouteHeaderPropertyValidator(properties).assertSuccess();
    return {
        Invert: cdk.booleanToCloudFormation(properties.invert),
        Match: cfnGatewayRouteHttpGatewayRouteHeaderMatchPropertyToCloudFormation(properties.match),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRouteHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRouteHeaderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRouteHeaderProperty>();
    ret.addPropertyResult('invert', 'Invert', properties.Invert != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Invert) : undefined);
    ret.addPropertyResult('match', 'Match', properties.Match != null ? CfnGatewayRouteHttpGatewayRouteHeaderMatchPropertyFromCloudFormation(properties.Match) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object that represents the method and value to match with the header value sent in a request. Specify one match method.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheadermatch.html
     */
    export interface HttpGatewayRouteHeaderMatchProperty {
        /**
         * The value sent by the client must match the specified value exactly.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheadermatch.html#cfn-appmesh-gatewayroute-httpgatewayrouteheadermatch-exact
         */
        readonly exact?: string;
        /**
         * The value sent by the client must begin with the specified characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheadermatch.html#cfn-appmesh-gatewayroute-httpgatewayrouteheadermatch-prefix
         */
        readonly prefix?: string;
        /**
         * An object that represents the range of values to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheadermatch.html#cfn-appmesh-gatewayroute-httpgatewayrouteheadermatch-range
         */
        readonly range?: CfnGatewayRoute.GatewayRouteRangeMatchProperty | cdk.IResolvable;
        /**
         * The value sent by the client must include the specified characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheadermatch.html#cfn-appmesh-gatewayroute-httpgatewayrouteheadermatch-regex
         */
        readonly regex?: string;
        /**
         * The value sent by the client must end with the specified characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteheadermatch.html#cfn-appmesh-gatewayroute-httpgatewayrouteheadermatch-suffix
         */
        readonly suffix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRouteHeaderMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteHeaderMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_HttpGatewayRouteHeaderMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('exact', cdk.validateString)(properties.exact));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('range', CfnGatewayRoute_GatewayRouteRangeMatchPropertyValidator)(properties.range));
    errors.collect(cdk.propertyValidator('regex', cdk.validateString)(properties.regex));
    errors.collect(cdk.propertyValidator('suffix', cdk.validateString)(properties.suffix));
    return errors.wrap('supplied properties not correct for "HttpGatewayRouteHeaderMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRouteHeaderMatch` resource
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteHeaderMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRouteHeaderMatch` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteHttpGatewayRouteHeaderMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_HttpGatewayRouteHeaderMatchPropertyValidator(properties).assertSuccess();
    return {
        Exact: cdk.stringToCloudFormation(properties.exact),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        Range: cfnGatewayRouteGatewayRouteRangeMatchPropertyToCloudFormation(properties.range),
        Regex: cdk.stringToCloudFormation(properties.regex),
        Suffix: cdk.stringToCloudFormation(properties.suffix),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRouteHeaderMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRouteHeaderMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRouteHeaderMatchProperty>();
    ret.addPropertyResult('exact', 'Exact', properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('range', 'Range', properties.Range != null ? CfnGatewayRouteGatewayRouteRangeMatchPropertyFromCloudFormation(properties.Range) : undefined);
    ret.addPropertyResult('regex', 'Regex', properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined);
    ret.addPropertyResult('suffix', 'Suffix', properties.Suffix != null ? cfn_parse.FromCloudFormation.getString(properties.Suffix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object that represents the criteria for determining a request match.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html
     */
    export interface HttpGatewayRouteMatchProperty {
        /**
         * The client request headers to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html#cfn-appmesh-gatewayroute-httpgatewayroutematch-headers
         */
        readonly headers?: Array<CfnGatewayRoute.HttpGatewayRouteHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The host name to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html#cfn-appmesh-gatewayroute-httpgatewayroutematch-hostname
         */
        readonly hostname?: CfnGatewayRoute.GatewayRouteHostnameMatchProperty | cdk.IResolvable;
        /**
         * The method to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html#cfn-appmesh-gatewayroute-httpgatewayroutematch-method
         */
        readonly method?: string;
        /**
         * The path to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html#cfn-appmesh-gatewayroute-httpgatewayroutematch-path
         */
        readonly path?: CfnGatewayRoute.HttpPathMatchProperty | cdk.IResolvable;
        /**
         * The port number to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html#cfn-appmesh-gatewayroute-httpgatewayroutematch-port
         */
        readonly port?: number;
        /**
         * Specifies the path to match requests with. This parameter must always start with `/` , which by itself matches all requests to the virtual service name. You can also match for path-based routing of requests. For example, if your virtual service name is `my-service.local` and you want the route to match requests to `my-service.local/metrics` , your prefix should be `/metrics` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html#cfn-appmesh-gatewayroute-httpgatewayroutematch-prefix
         */
        readonly prefix?: string;
        /**
         * The query parameter to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutematch.html#cfn-appmesh-gatewayroute-httpgatewayroutematch-queryparameters
         */
        readonly queryParameters?: Array<CfnGatewayRoute.QueryParameterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRouteMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_HttpGatewayRouteMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('headers', cdk.listValidator(CfnGatewayRoute_HttpGatewayRouteHeaderPropertyValidator))(properties.headers));
    errors.collect(cdk.propertyValidator('hostname', CfnGatewayRoute_GatewayRouteHostnameMatchPropertyValidator)(properties.hostname));
    errors.collect(cdk.propertyValidator('method', cdk.validateString)(properties.method));
    errors.collect(cdk.propertyValidator('path', CfnGatewayRoute_HttpPathMatchPropertyValidator)(properties.path));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('queryParameters', cdk.listValidator(CfnGatewayRoute_QueryParameterPropertyValidator))(properties.queryParameters));
    return errors.wrap('supplied properties not correct for "HttpGatewayRouteMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRouteMatch` resource
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRouteMatch` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteHttpGatewayRouteMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_HttpGatewayRouteMatchPropertyValidator(properties).assertSuccess();
    return {
        Headers: cdk.listMapper(cfnGatewayRouteHttpGatewayRouteHeaderPropertyToCloudFormation)(properties.headers),
        Hostname: cfnGatewayRouteGatewayRouteHostnameMatchPropertyToCloudFormation(properties.hostname),
        Method: cdk.stringToCloudFormation(properties.method),
        Path: cfnGatewayRouteHttpPathMatchPropertyToCloudFormation(properties.path),
        Port: cdk.numberToCloudFormation(properties.port),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        QueryParameters: cdk.listMapper(cfnGatewayRouteQueryParameterPropertyToCloudFormation)(properties.queryParameters),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRouteMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRouteMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRouteMatchProperty>();
    ret.addPropertyResult('headers', 'Headers', properties.Headers != null ? cfn_parse.FromCloudFormation.getArray(CfnGatewayRouteHttpGatewayRouteHeaderPropertyFromCloudFormation)(properties.Headers) : undefined);
    ret.addPropertyResult('hostname', 'Hostname', properties.Hostname != null ? CfnGatewayRouteGatewayRouteHostnameMatchPropertyFromCloudFormation(properties.Hostname) : undefined);
    ret.addPropertyResult('method', 'Method', properties.Method != null ? cfn_parse.FromCloudFormation.getString(properties.Method) : undefined);
    ret.addPropertyResult('path', 'Path', properties.Path != null ? CfnGatewayRouteHttpPathMatchPropertyFromCloudFormation(properties.Path) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('queryParameters', 'QueryParameters', properties.QueryParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnGatewayRouteQueryParameterPropertyFromCloudFormation)(properties.QueryParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object that represents the path to rewrite.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutepathrewrite.html
     */
    export interface HttpGatewayRoutePathRewriteProperty {
        /**
         * The exact path to rewrite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayroutepathrewrite.html#cfn-appmesh-gatewayroute-httpgatewayroutepathrewrite-exact
         */
        readonly exact?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRoutePathRewriteProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRoutePathRewriteProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_HttpGatewayRoutePathRewritePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('exact', cdk.validateString)(properties.exact));
    return errors.wrap('supplied properties not correct for "HttpGatewayRoutePathRewriteProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRoutePathRewrite` resource
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRoutePathRewriteProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRoutePathRewrite` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteHttpGatewayRoutePathRewritePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_HttpGatewayRoutePathRewritePropertyValidator(properties).assertSuccess();
    return {
        Exact: cdk.stringToCloudFormation(properties.exact),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRoutePathRewritePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRoutePathRewriteProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRoutePathRewriteProperty>();
    ret.addPropertyResult('exact', 'Exact', properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object representing the beginning characters of the route to rewrite.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteprefixrewrite.html
     */
    export interface HttpGatewayRoutePrefixRewriteProperty {
        /**
         * The default prefix used to replace the incoming route prefix when rewritten.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteprefixrewrite.html#cfn-appmesh-gatewayroute-httpgatewayrouteprefixrewrite-defaultprefix
         */
        readonly defaultPrefix?: string;
        /**
         * The value used to replace the incoming route prefix when rewritten.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouteprefixrewrite.html#cfn-appmesh-gatewayroute-httpgatewayrouteprefixrewrite-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRoutePrefixRewriteProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRoutePrefixRewriteProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_HttpGatewayRoutePrefixRewritePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultPrefix', cdk.validateString)(properties.defaultPrefix));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "HttpGatewayRoutePrefixRewriteProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRoutePrefixRewrite` resource
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRoutePrefixRewriteProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRoutePrefixRewrite` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteHttpGatewayRoutePrefixRewritePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_HttpGatewayRoutePrefixRewritePropertyValidator(properties).assertSuccess();
    return {
        DefaultPrefix: cdk.stringToCloudFormation(properties.defaultPrefix),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRoutePrefixRewritePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty>();
    ret.addPropertyResult('defaultPrefix', 'DefaultPrefix', properties.DefaultPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultPrefix) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object representing the gateway route to rewrite.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouterewrite.html
     */
    export interface HttpGatewayRouteRewriteProperty {
        /**
         * The host name to rewrite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouterewrite.html#cfn-appmesh-gatewayroute-httpgatewayrouterewrite-hostname
         */
        readonly hostname?: CfnGatewayRoute.GatewayRouteHostnameRewriteProperty | cdk.IResolvable;
        /**
         * The path to rewrite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouterewrite.html#cfn-appmesh-gatewayroute-httpgatewayrouterewrite-path
         */
        readonly path?: CfnGatewayRoute.HttpGatewayRoutePathRewriteProperty | cdk.IResolvable;
        /**
         * The specified beginning characters to rewrite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpgatewayrouterewrite.html#cfn-appmesh-gatewayroute-httpgatewayrouterewrite-prefix
         */
        readonly prefix?: CfnGatewayRoute.HttpGatewayRoutePrefixRewriteProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HttpGatewayRouteRewriteProperty`
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteRewriteProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_HttpGatewayRouteRewritePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('hostname', CfnGatewayRoute_GatewayRouteHostnameRewritePropertyValidator)(properties.hostname));
    errors.collect(cdk.propertyValidator('path', CfnGatewayRoute_HttpGatewayRoutePathRewritePropertyValidator)(properties.path));
    errors.collect(cdk.propertyValidator('prefix', CfnGatewayRoute_HttpGatewayRoutePrefixRewritePropertyValidator)(properties.prefix));
    return errors.wrap('supplied properties not correct for "HttpGatewayRouteRewriteProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRouteRewrite` resource
 *
 * @param properties - the TypeScript properties of a `HttpGatewayRouteRewriteProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpGatewayRouteRewrite` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteHttpGatewayRouteRewritePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_HttpGatewayRouteRewritePropertyValidator(properties).assertSuccess();
    return {
        Hostname: cfnGatewayRouteGatewayRouteHostnameRewritePropertyToCloudFormation(properties.hostname),
        Path: cfnGatewayRouteHttpGatewayRoutePathRewritePropertyToCloudFormation(properties.path),
        Prefix: cfnGatewayRouteHttpGatewayRoutePrefixRewritePropertyToCloudFormation(properties.prefix),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpGatewayRouteRewritePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpGatewayRouteRewriteProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpGatewayRouteRewriteProperty>();
    ret.addPropertyResult('hostname', 'Hostname', properties.Hostname != null ? CfnGatewayRouteGatewayRouteHostnameRewritePropertyFromCloudFormation(properties.Hostname) : undefined);
    ret.addPropertyResult('path', 'Path', properties.Path != null ? CfnGatewayRouteHttpGatewayRoutePathRewritePropertyFromCloudFormation(properties.Path) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? CfnGatewayRouteHttpGatewayRoutePrefixRewritePropertyFromCloudFormation(properties.Prefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object representing the path to match in the request.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httppathmatch.html
     */
    export interface HttpPathMatchProperty {
        /**
         * The exact path to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httppathmatch.html#cfn-appmesh-gatewayroute-httppathmatch-exact
         */
        readonly exact?: string;
        /**
         * The regex used to match the path.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httppathmatch.html#cfn-appmesh-gatewayroute-httppathmatch-regex
         */
        readonly regex?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HttpPathMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HttpPathMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_HttpPathMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('exact', cdk.validateString)(properties.exact));
    errors.collect(cdk.propertyValidator('regex', cdk.validateString)(properties.regex));
    return errors.wrap('supplied properties not correct for "HttpPathMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpPathMatch` resource
 *
 * @param properties - the TypeScript properties of a `HttpPathMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpPathMatch` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteHttpPathMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_HttpPathMatchPropertyValidator(properties).assertSuccess();
    return {
        Exact: cdk.stringToCloudFormation(properties.exact),
        Regex: cdk.stringToCloudFormation(properties.regex),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpPathMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpPathMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpPathMatchProperty>();
    ret.addPropertyResult('exact', 'Exact', properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined);
    ret.addPropertyResult('regex', 'Regex', properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object representing the query parameter to match.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpqueryparametermatch.html
     */
    export interface HttpQueryParameterMatchProperty {
        /**
         * The exact query parameter to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-httpqueryparametermatch.html#cfn-appmesh-gatewayroute-httpqueryparametermatch-exact
         */
        readonly exact?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HttpQueryParameterMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HttpQueryParameterMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_HttpQueryParameterMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('exact', cdk.validateString)(properties.exact));
    return errors.wrap('supplied properties not correct for "HttpQueryParameterMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpQueryParameterMatch` resource
 *
 * @param properties - the TypeScript properties of a `HttpQueryParameterMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.HttpQueryParameterMatch` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteHttpQueryParameterMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_HttpQueryParameterMatchPropertyValidator(properties).assertSuccess();
    return {
        Exact: cdk.stringToCloudFormation(properties.exact),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteHttpQueryParameterMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.HttpQueryParameterMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.HttpQueryParameterMatchProperty>();
    ret.addPropertyResult('exact', 'Exact', properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGatewayRoute {
    /**
     * An object that represents the query parameter in the request.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-queryparameter.html
     */
    export interface QueryParameterProperty {
        /**
         * The query parameter to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-queryparameter.html#cfn-appmesh-gatewayroute-queryparameter-match
         */
        readonly match?: CfnGatewayRoute.HttpQueryParameterMatchProperty | cdk.IResolvable;
        /**
         * A name for the query parameter that will be matched on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-gatewayroute-queryparameter.html#cfn-appmesh-gatewayroute-queryparameter-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `QueryParameterProperty`
 *
 * @param properties - the TypeScript properties of a `QueryParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnGatewayRoute_QueryParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('match', CfnGatewayRoute_HttpQueryParameterMatchPropertyValidator)(properties.match));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "QueryParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.QueryParameter` resource
 *
 * @param properties - the TypeScript properties of a `QueryParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::GatewayRoute.QueryParameter` resource.
 */
// @ts-ignore TS6133
function cfnGatewayRouteQueryParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayRoute_QueryParameterPropertyValidator(properties).assertSuccess();
    return {
        Match: cfnGatewayRouteHttpQueryParameterMatchPropertyToCloudFormation(properties.match),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnGatewayRouteQueryParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayRoute.QueryParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayRoute.QueryParameterProperty>();
    ret.addPropertyResult('match', 'Match', properties.Match != null ? CfnGatewayRouteHttpQueryParameterMatchPropertyFromCloudFormation(properties.Match) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnMesh`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-mesh.html
 */
export interface CfnMeshProps {

    /**
     * The name to use for the service mesh.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-mesh.html#cfn-appmesh-mesh-meshname
     */
    readonly meshName?: string;

    /**
     * The service mesh specification to apply.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-mesh.html#cfn-appmesh-mesh-spec
     */
    readonly spec?: CfnMesh.MeshSpecProperty | cdk.IResolvable;

    /**
     * Optional metadata that you can apply to the service mesh to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-mesh.html#cfn-appmesh-mesh-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnMeshProps`
 *
 * @param properties - the TypeScript properties of a `CfnMeshProps`
 *
 * @returns the result of the validation.
 */
function CfnMeshPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('meshName', cdk.validateString)(properties.meshName));
    errors.collect(cdk.propertyValidator('spec', CfnMesh_MeshSpecPropertyValidator)(properties.spec));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnMeshProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Mesh` resource
 *
 * @param properties - the TypeScript properties of a `CfnMeshProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Mesh` resource.
 */
// @ts-ignore TS6133
function cfnMeshPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMeshPropsValidator(properties).assertSuccess();
    return {
        MeshName: cdk.stringToCloudFormation(properties.meshName),
        Spec: cfnMeshMeshSpecPropertyToCloudFormation(properties.spec),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnMeshPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMeshProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMeshProps>();
    ret.addPropertyResult('meshName', 'MeshName', properties.MeshName != null ? cfn_parse.FromCloudFormation.getString(properties.MeshName) : undefined);
    ret.addPropertyResult('spec', 'Spec', properties.Spec != null ? CfnMeshMeshSpecPropertyFromCloudFormation(properties.Spec) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppMesh::Mesh`
 *
 * Creates a service mesh.
 *
 * A service mesh is a logical boundary for network traffic between services that are represented by resources within the mesh. After you create your service mesh, you can create virtual services, virtual nodes, virtual routers, and routes to distribute traffic between the applications in your mesh.
 *
 * For more information about service meshes, see [Service meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/meshes.html) .
 *
 * @cloudformationResource AWS::AppMesh::Mesh
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-mesh.html
 */
export class CfnMesh extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppMesh::Mesh";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMesh {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnMeshPropsFromCloudFormation(resourceProperties);
        const ret = new CfnMesh(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The full Amazon Resource Name (ARN) for the mesh.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the service mesh.
     * @cloudformationAttribute MeshName
     */
    public readonly attrMeshName: string;

    /**
     * The IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     * @cloudformationAttribute MeshOwner
     */
    public readonly attrMeshOwner: string;

    /**
     * The IAM account ID of the resource owner. If the account ID is not your own, then it's the ID of the mesh owner or of another account that the mesh is shared with. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     * @cloudformationAttribute ResourceOwner
     */
    public readonly attrResourceOwner: string;

    /**
     * The unique identifier for the mesh.
     * @cloudformationAttribute Uid
     */
    public readonly attrUid: string;

    /**
     * The name to use for the service mesh.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-mesh.html#cfn-appmesh-mesh-meshname
     */
    public meshName: string | undefined;

    /**
     * The service mesh specification to apply.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-mesh.html#cfn-appmesh-mesh-spec
     */
    public spec: CfnMesh.MeshSpecProperty | cdk.IResolvable | undefined;

    /**
     * Optional metadata that you can apply to the service mesh to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-mesh.html#cfn-appmesh-mesh-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::AppMesh::Mesh`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMeshProps = {}) {
        super(scope, id, { type: CfnMesh.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrMeshName = cdk.Token.asString(this.getAtt('MeshName', cdk.ResolutionTypeHint.STRING));
        this.attrMeshOwner = cdk.Token.asString(this.getAtt('MeshOwner', cdk.ResolutionTypeHint.STRING));
        this.attrResourceOwner = cdk.Token.asString(this.getAtt('ResourceOwner', cdk.ResolutionTypeHint.STRING));
        this.attrUid = cdk.Token.asString(this.getAtt('Uid', cdk.ResolutionTypeHint.STRING));

        this.meshName = props.meshName;
        this.spec = props.spec;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppMesh::Mesh", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMesh.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            meshName: this.meshName,
            spec: this.spec,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnMeshPropsToCloudFormation(props);
    }
}

export namespace CfnMesh {
    /**
     * An object that represents the egress filter rules for a service mesh.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-egressfilter.html
     */
    export interface EgressFilterProperty {
        /**
         * The egress filter type. By default, the type is `DROP_ALL` , which allows egress only from virtual nodes to other defined resources in the service mesh (and any traffic to `*.amazonaws.com` for AWS API calls). You can set the egress filter type to `ALLOW_ALL` to allow egress to any endpoint inside or outside of the service mesh.
         *
         * > If you specify any backends on a virtual node when using `ALLOW_ALL` , you must specifiy all egress for that virtual node as backends. Otherwise, `ALLOW_ALL` will no longer work for that virtual node.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-egressfilter.html#cfn-appmesh-mesh-egressfilter-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `EgressFilterProperty`
 *
 * @param properties - the TypeScript properties of a `EgressFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnMesh_EgressFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "EgressFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Mesh.EgressFilter` resource
 *
 * @param properties - the TypeScript properties of a `EgressFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Mesh.EgressFilter` resource.
 */
// @ts-ignore TS6133
function cfnMeshEgressFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMesh_EgressFilterPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnMeshEgressFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMesh.EgressFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMesh.EgressFilterProperty>();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMesh {
    /**
     * An object that represents the service discovery information for a service mesh.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-meshservicediscovery.html
     */
    export interface MeshServiceDiscoveryProperty {
        /**
         * The IP version to use to control traffic within the mesh.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-meshservicediscovery.html#cfn-appmesh-mesh-meshservicediscovery-ippreference
         */
        readonly ipPreference?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MeshServiceDiscoveryProperty`
 *
 * @param properties - the TypeScript properties of a `MeshServiceDiscoveryProperty`
 *
 * @returns the result of the validation.
 */
function CfnMesh_MeshServiceDiscoveryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ipPreference', cdk.validateString)(properties.ipPreference));
    return errors.wrap('supplied properties not correct for "MeshServiceDiscoveryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Mesh.MeshServiceDiscovery` resource
 *
 * @param properties - the TypeScript properties of a `MeshServiceDiscoveryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Mesh.MeshServiceDiscovery` resource.
 */
// @ts-ignore TS6133
function cfnMeshMeshServiceDiscoveryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMesh_MeshServiceDiscoveryPropertyValidator(properties).assertSuccess();
    return {
        IpPreference: cdk.stringToCloudFormation(properties.ipPreference),
    };
}

// @ts-ignore TS6133
function CfnMeshMeshServiceDiscoveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMesh.MeshServiceDiscoveryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMesh.MeshServiceDiscoveryProperty>();
    ret.addPropertyResult('ipPreference', 'IpPreference', properties.IpPreference != null ? cfn_parse.FromCloudFormation.getString(properties.IpPreference) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMesh {
    /**
     * An object that represents the specification of a service mesh.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-meshspec.html
     */
    export interface MeshSpecProperty {
        /**
         * The egress filter rules for the service mesh.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-meshspec.html#cfn-appmesh-mesh-meshspec-egressfilter
         */
        readonly egressFilter?: CfnMesh.EgressFilterProperty | cdk.IResolvable;
        /**
         * `CfnMesh.MeshSpecProperty.ServiceDiscovery`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-mesh-meshspec.html#cfn-appmesh-mesh-meshspec-servicediscovery
         */
        readonly serviceDiscovery?: CfnMesh.MeshServiceDiscoveryProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MeshSpecProperty`
 *
 * @param properties - the TypeScript properties of a `MeshSpecProperty`
 *
 * @returns the result of the validation.
 */
function CfnMesh_MeshSpecPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('egressFilter', CfnMesh_EgressFilterPropertyValidator)(properties.egressFilter));
    errors.collect(cdk.propertyValidator('serviceDiscovery', CfnMesh_MeshServiceDiscoveryPropertyValidator)(properties.serviceDiscovery));
    return errors.wrap('supplied properties not correct for "MeshSpecProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Mesh.MeshSpec` resource
 *
 * @param properties - the TypeScript properties of a `MeshSpecProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Mesh.MeshSpec` resource.
 */
// @ts-ignore TS6133
function cfnMeshMeshSpecPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMesh_MeshSpecPropertyValidator(properties).assertSuccess();
    return {
        EgressFilter: cfnMeshEgressFilterPropertyToCloudFormation(properties.egressFilter),
        ServiceDiscovery: cfnMeshMeshServiceDiscoveryPropertyToCloudFormation(properties.serviceDiscovery),
    };
}

// @ts-ignore TS6133
function CfnMeshMeshSpecPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMesh.MeshSpecProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMesh.MeshSpecProperty>();
    ret.addPropertyResult('egressFilter', 'EgressFilter', properties.EgressFilter != null ? CfnMeshEgressFilterPropertyFromCloudFormation(properties.EgressFilter) : undefined);
    ret.addPropertyResult('serviceDiscovery', 'ServiceDiscovery', properties.ServiceDiscovery != null ? CfnMeshMeshServiceDiscoveryPropertyFromCloudFormation(properties.ServiceDiscovery) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnRoute`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html
 */
export interface CfnRouteProps {

    /**
     * The name of the service mesh to create the route in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-meshname
     */
    readonly meshName: string;

    /**
     * The route specification to apply.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-spec
     */
    readonly spec: CfnRoute.RouteSpecProperty | cdk.IResolvable;

    /**
     * The name of the virtual router in which to create the route. If the virtual router is in a shared mesh, then you must be the owner of the virtual router resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-virtualroutername
     */
    readonly virtualRouterName: string;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then the account that you specify must share the mesh with your account before you can create the resource in the service mesh. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-meshowner
     */
    readonly meshOwner?: string;

    /**
     * The name to use for the route.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-routename
     */
    readonly routeName?: string;

    /**
     * Optional metadata that you can apply to the route to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-tags
     */
    readonly tags?: cdk.CfnTag[];
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
    errors.collect(cdk.propertyValidator('meshName', cdk.requiredValidator)(properties.meshName));
    errors.collect(cdk.propertyValidator('meshName', cdk.validateString)(properties.meshName));
    errors.collect(cdk.propertyValidator('meshOwner', cdk.validateString)(properties.meshOwner));
    errors.collect(cdk.propertyValidator('routeName', cdk.validateString)(properties.routeName));
    errors.collect(cdk.propertyValidator('spec', cdk.requiredValidator)(properties.spec));
    errors.collect(cdk.propertyValidator('spec', CfnRoute_RouteSpecPropertyValidator)(properties.spec));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('virtualRouterName', cdk.requiredValidator)(properties.virtualRouterName));
    errors.collect(cdk.propertyValidator('virtualRouterName', cdk.validateString)(properties.virtualRouterName));
    return errors.wrap('supplied properties not correct for "CfnRouteProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route` resource
 *
 * @param properties - the TypeScript properties of a `CfnRouteProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route` resource.
 */
// @ts-ignore TS6133
function cfnRoutePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoutePropsValidator(properties).assertSuccess();
    return {
        MeshName: cdk.stringToCloudFormation(properties.meshName),
        Spec: cfnRouteRouteSpecPropertyToCloudFormation(properties.spec),
        VirtualRouterName: cdk.stringToCloudFormation(properties.virtualRouterName),
        MeshOwner: cdk.stringToCloudFormation(properties.meshOwner),
        RouteName: cdk.stringToCloudFormation(properties.routeName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnRoutePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRouteProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRouteProps>();
    ret.addPropertyResult('meshName', 'MeshName', cfn_parse.FromCloudFormation.getString(properties.MeshName));
    ret.addPropertyResult('spec', 'Spec', CfnRouteRouteSpecPropertyFromCloudFormation(properties.Spec));
    ret.addPropertyResult('virtualRouterName', 'VirtualRouterName', cfn_parse.FromCloudFormation.getString(properties.VirtualRouterName));
    ret.addPropertyResult('meshOwner', 'MeshOwner', properties.MeshOwner != null ? cfn_parse.FromCloudFormation.getString(properties.MeshOwner) : undefined);
    ret.addPropertyResult('routeName', 'RouteName', properties.RouteName != null ? cfn_parse.FromCloudFormation.getString(properties.RouteName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppMesh::Route`
 *
 * Creates a route that is associated with a virtual router.
 *
 * You can route several different protocols and define a retry policy for a route. Traffic can be routed to one or more virtual nodes.
 *
 * For more information about routes, see [Routes](https://docs.aws.amazon.com/app-mesh/latest/userguide/routes.html) .
 *
 * @cloudformationResource AWS::AppMesh::Route
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html
 */
export class CfnRoute extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppMesh::Route";

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
     * The full Amazon Resource Name (ARN) for the route.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the service mesh that the route resides in.
     * @cloudformationAttribute MeshName
     */
    public readonly attrMeshName: string;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     * @cloudformationAttribute MeshOwner
     */
    public readonly attrMeshOwner: string;

    /**
     * The AWS IAM account ID of the resource owner. If the account ID is not your own, then it's the ID of the mesh owner or of another account that the mesh is shared with. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     * @cloudformationAttribute ResourceOwner
     */
    public readonly attrResourceOwner: string;

    /**
     * The name of the route.
     * @cloudformationAttribute RouteName
     */
    public readonly attrRouteName: string;

    /**
     * The unique identifier for the route.
     * @cloudformationAttribute Uid
     */
    public readonly attrUid: string;

    /**
     * The name of the virtual router that the route is associated with.
     * @cloudformationAttribute VirtualRouterName
     */
    public readonly attrVirtualRouterName: string;

    /**
     * The name of the service mesh to create the route in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-meshname
     */
    public meshName: string;

    /**
     * The route specification to apply.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-spec
     */
    public spec: CfnRoute.RouteSpecProperty | cdk.IResolvable;

    /**
     * The name of the virtual router in which to create the route. If the virtual router is in a shared mesh, then you must be the owner of the virtual router resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-virtualroutername
     */
    public virtualRouterName: string;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then the account that you specify must share the mesh with your account before you can create the resource in the service mesh. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-meshowner
     */
    public meshOwner: string | undefined;

    /**
     * The name to use for the route.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-routename
     */
    public routeName: string | undefined;

    /**
     * Optional metadata that you can apply to the route to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-route.html#cfn-appmesh-route-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::AppMesh::Route`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRouteProps) {
        super(scope, id, { type: CfnRoute.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'meshName', this);
        cdk.requireProperty(props, 'spec', this);
        cdk.requireProperty(props, 'virtualRouterName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrMeshName = cdk.Token.asString(this.getAtt('MeshName', cdk.ResolutionTypeHint.STRING));
        this.attrMeshOwner = cdk.Token.asString(this.getAtt('MeshOwner', cdk.ResolutionTypeHint.STRING));
        this.attrResourceOwner = cdk.Token.asString(this.getAtt('ResourceOwner', cdk.ResolutionTypeHint.STRING));
        this.attrRouteName = cdk.Token.asString(this.getAtt('RouteName', cdk.ResolutionTypeHint.STRING));
        this.attrUid = cdk.Token.asString(this.getAtt('Uid', cdk.ResolutionTypeHint.STRING));
        this.attrVirtualRouterName = cdk.Token.asString(this.getAtt('VirtualRouterName', cdk.ResolutionTypeHint.STRING));

        this.meshName = props.meshName;
        this.spec = props.spec;
        this.virtualRouterName = props.virtualRouterName;
        this.meshOwner = props.meshOwner;
        this.routeName = props.routeName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppMesh::Route", props.tags, { tagPropertyName: 'tags' });
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
            meshName: this.meshName,
            spec: this.spec,
            virtualRouterName: this.virtualRouterName,
            meshOwner: this.meshOwner,
            routeName: this.routeName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRoutePropsToCloudFormation(props);
    }
}

export namespace CfnRoute {
    /**
     * An object that represents a duration of time.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-duration.html
     */
    export interface DurationProperty {
        /**
         * A unit of time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-duration.html#cfn-appmesh-route-duration-unit
         */
        readonly unit: string;
        /**
         * A number of time units.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-duration.html#cfn-appmesh-route-duration-value
         */
        readonly value: number;
    }
}

/**
 * Determine whether the given properties match those of a `DurationProperty`
 *
 * @param properties - the TypeScript properties of a `DurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_DurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('unit', cdk.requiredValidator)(properties.unit));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateNumber)(properties.value));
    return errors.wrap('supplied properties not correct for "DurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.Duration` resource
 *
 * @param properties - the TypeScript properties of a `DurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.Duration` resource.
 */
// @ts-ignore TS6133
function cfnRouteDurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_DurationPropertyValidator(properties).assertSuccess();
    return {
        Unit: cdk.stringToCloudFormation(properties.unit),
        Value: cdk.numberToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnRouteDurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.DurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.DurationProperty>();
    ret.addPropertyResult('unit', 'Unit', cfn_parse.FromCloudFormation.getString(properties.Unit));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getNumber(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents a retry policy. Specify at least one value for at least one of the types of `RetryEvents` , a value for `maxRetries` , and a value for `perRetryTimeout` . Both `server-error` and `gateway-error` under `httpRetryEvents` include the Envoy `reset` policy. For more information on the `reset` policy, see the [Envoy documentation](https://docs.aws.amazon.com/https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/router_filter#x-envoy-retry-on) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcretrypolicy.html
     */
    export interface GrpcRetryPolicyProperty {
        /**
         * Specify at least one of the valid values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcretrypolicy.html#cfn-appmesh-route-grpcretrypolicy-grpcretryevents
         */
        readonly grpcRetryEvents?: string[];
        /**
         * Specify at least one of the following values.
         *
         * - *server-error* – HTTP status codes 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, and 511
         * - *gateway-error* – HTTP status codes 502, 503, and 504
         * - *client-error* – HTTP status code 409
         * - *stream-error* – Retry on refused stream
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcretrypolicy.html#cfn-appmesh-route-grpcretrypolicy-httpretryevents
         */
        readonly httpRetryEvents?: string[];
        /**
         * The maximum number of retry attempts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcretrypolicy.html#cfn-appmesh-route-grpcretrypolicy-maxretries
         */
        readonly maxRetries: number;
        /**
         * The timeout for each retry attempt.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcretrypolicy.html#cfn-appmesh-route-grpcretrypolicy-perretrytimeout
         */
        readonly perRetryTimeout: CfnRoute.DurationProperty | cdk.IResolvable;
        /**
         * Specify a valid value. The event occurs before any processing of a request has started and is encountered when the upstream is temporarily or permanently unavailable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcretrypolicy.html#cfn-appmesh-route-grpcretrypolicy-tcpretryevents
         */
        readonly tcpRetryEvents?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `GrpcRetryPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcRetryPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_GrpcRetryPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('grpcRetryEvents', cdk.listValidator(cdk.validateString))(properties.grpcRetryEvents));
    errors.collect(cdk.propertyValidator('httpRetryEvents', cdk.listValidator(cdk.validateString))(properties.httpRetryEvents));
    errors.collect(cdk.propertyValidator('maxRetries', cdk.requiredValidator)(properties.maxRetries));
    errors.collect(cdk.propertyValidator('maxRetries', cdk.validateNumber)(properties.maxRetries));
    errors.collect(cdk.propertyValidator('perRetryTimeout', cdk.requiredValidator)(properties.perRetryTimeout));
    errors.collect(cdk.propertyValidator('perRetryTimeout', CfnRoute_DurationPropertyValidator)(properties.perRetryTimeout));
    errors.collect(cdk.propertyValidator('tcpRetryEvents', cdk.listValidator(cdk.validateString))(properties.tcpRetryEvents));
    return errors.wrap('supplied properties not correct for "GrpcRetryPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.GrpcRetryPolicy` resource
 *
 * @param properties - the TypeScript properties of a `GrpcRetryPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.GrpcRetryPolicy` resource.
 */
// @ts-ignore TS6133
function cfnRouteGrpcRetryPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_GrpcRetryPolicyPropertyValidator(properties).assertSuccess();
    return {
        GrpcRetryEvents: cdk.listMapper(cdk.stringToCloudFormation)(properties.grpcRetryEvents),
        HttpRetryEvents: cdk.listMapper(cdk.stringToCloudFormation)(properties.httpRetryEvents),
        MaxRetries: cdk.numberToCloudFormation(properties.maxRetries),
        PerRetryTimeout: cfnRouteDurationPropertyToCloudFormation(properties.perRetryTimeout),
        TcpRetryEvents: cdk.listMapper(cdk.stringToCloudFormation)(properties.tcpRetryEvents),
    };
}

// @ts-ignore TS6133
function CfnRouteGrpcRetryPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.GrpcRetryPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.GrpcRetryPolicyProperty>();
    ret.addPropertyResult('grpcRetryEvents', 'GrpcRetryEvents', properties.GrpcRetryEvents != null ? cfn_parse.FromCloudFormation.getStringArray(properties.GrpcRetryEvents) : undefined);
    ret.addPropertyResult('httpRetryEvents', 'HttpRetryEvents', properties.HttpRetryEvents != null ? cfn_parse.FromCloudFormation.getStringArray(properties.HttpRetryEvents) : undefined);
    ret.addPropertyResult('maxRetries', 'MaxRetries', cfn_parse.FromCloudFormation.getNumber(properties.MaxRetries));
    ret.addPropertyResult('perRetryTimeout', 'PerRetryTimeout', CfnRouteDurationPropertyFromCloudFormation(properties.PerRetryTimeout));
    ret.addPropertyResult('tcpRetryEvents', 'TcpRetryEvents', properties.TcpRetryEvents != null ? cfn_parse.FromCloudFormation.getStringArray(properties.TcpRetryEvents) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents a gRPC route type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroute.html
     */
    export interface GrpcRouteProperty {
        /**
         * An object that represents the action to take if a match is determined.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroute.html#cfn-appmesh-route-grpcroute-action
         */
        readonly action: CfnRoute.GrpcRouteActionProperty | cdk.IResolvable;
        /**
         * An object that represents the criteria for determining a request match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroute.html#cfn-appmesh-route-grpcroute-match
         */
        readonly match: CfnRoute.GrpcRouteMatchProperty | cdk.IResolvable;
        /**
         * An object that represents a retry policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroute.html#cfn-appmesh-route-grpcroute-retrypolicy
         */
        readonly retryPolicy?: CfnRoute.GrpcRetryPolicyProperty | cdk.IResolvable;
        /**
         * An object that represents types of timeouts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroute.html#cfn-appmesh-route-grpcroute-timeout
         */
        readonly timeout?: CfnRoute.GrpcTimeoutProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `GrpcRouteProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcRouteProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_GrpcRoutePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', CfnRoute_GrpcRouteActionPropertyValidator)(properties.action));
    errors.collect(cdk.propertyValidator('match', cdk.requiredValidator)(properties.match));
    errors.collect(cdk.propertyValidator('match', CfnRoute_GrpcRouteMatchPropertyValidator)(properties.match));
    errors.collect(cdk.propertyValidator('retryPolicy', CfnRoute_GrpcRetryPolicyPropertyValidator)(properties.retryPolicy));
    errors.collect(cdk.propertyValidator('timeout', CfnRoute_GrpcTimeoutPropertyValidator)(properties.timeout));
    return errors.wrap('supplied properties not correct for "GrpcRouteProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.GrpcRoute` resource
 *
 * @param properties - the TypeScript properties of a `GrpcRouteProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.GrpcRoute` resource.
 */
// @ts-ignore TS6133
function cfnRouteGrpcRoutePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_GrpcRoutePropertyValidator(properties).assertSuccess();
    return {
        Action: cfnRouteGrpcRouteActionPropertyToCloudFormation(properties.action),
        Match: cfnRouteGrpcRouteMatchPropertyToCloudFormation(properties.match),
        RetryPolicy: cfnRouteGrpcRetryPolicyPropertyToCloudFormation(properties.retryPolicy),
        Timeout: cfnRouteGrpcTimeoutPropertyToCloudFormation(properties.timeout),
    };
}

// @ts-ignore TS6133
function CfnRouteGrpcRoutePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.GrpcRouteProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.GrpcRouteProperty>();
    ret.addPropertyResult('action', 'Action', CfnRouteGrpcRouteActionPropertyFromCloudFormation(properties.Action));
    ret.addPropertyResult('match', 'Match', CfnRouteGrpcRouteMatchPropertyFromCloudFormation(properties.Match));
    ret.addPropertyResult('retryPolicy', 'RetryPolicy', properties.RetryPolicy != null ? CfnRouteGrpcRetryPolicyPropertyFromCloudFormation(properties.RetryPolicy) : undefined);
    ret.addPropertyResult('timeout', 'Timeout', properties.Timeout != null ? CfnRouteGrpcTimeoutPropertyFromCloudFormation(properties.Timeout) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents the action to take if a match is determined.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcrouteaction.html
     */
    export interface GrpcRouteActionProperty {
        /**
         * An object that represents the targets that traffic is routed to when a request matches the route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcrouteaction.html#cfn-appmesh-route-grpcrouteaction-weightedtargets
         */
        readonly weightedTargets: Array<CfnRoute.WeightedTargetProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `GrpcRouteActionProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcRouteActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_GrpcRouteActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('weightedTargets', cdk.requiredValidator)(properties.weightedTargets));
    errors.collect(cdk.propertyValidator('weightedTargets', cdk.listValidator(CfnRoute_WeightedTargetPropertyValidator))(properties.weightedTargets));
    return errors.wrap('supplied properties not correct for "GrpcRouteActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.GrpcRouteAction` resource
 *
 * @param properties - the TypeScript properties of a `GrpcRouteActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.GrpcRouteAction` resource.
 */
// @ts-ignore TS6133
function cfnRouteGrpcRouteActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_GrpcRouteActionPropertyValidator(properties).assertSuccess();
    return {
        WeightedTargets: cdk.listMapper(cfnRouteWeightedTargetPropertyToCloudFormation)(properties.weightedTargets),
    };
}

// @ts-ignore TS6133
function CfnRouteGrpcRouteActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.GrpcRouteActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.GrpcRouteActionProperty>();
    ret.addPropertyResult('weightedTargets', 'WeightedTargets', cfn_parse.FromCloudFormation.getArray(CfnRouteWeightedTargetPropertyFromCloudFormation)(properties.WeightedTargets));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents the criteria for determining a request match.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutematch.html
     */
    export interface GrpcRouteMatchProperty {
        /**
         * An object that represents the data to match from the request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutematch.html#cfn-appmesh-route-grpcroutematch-metadata
         */
        readonly metadata?: Array<CfnRoute.GrpcRouteMetadataProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The method name to match from the request. If you specify a name, you must also specify a `serviceName` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutematch.html#cfn-appmesh-route-grpcroutematch-methodname
         */
        readonly methodName?: string;
        /**
         * The port number to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutematch.html#cfn-appmesh-route-grpcroutematch-port
         */
        readonly port?: number;
        /**
         * The fully qualified domain name for the service to match from the request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutematch.html#cfn-appmesh-route-grpcroutematch-servicename
         */
        readonly serviceName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `GrpcRouteMatchProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcRouteMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_GrpcRouteMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('metadata', cdk.listValidator(CfnRoute_GrpcRouteMetadataPropertyValidator))(properties.metadata));
    errors.collect(cdk.propertyValidator('methodName', cdk.validateString)(properties.methodName));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('serviceName', cdk.validateString)(properties.serviceName));
    return errors.wrap('supplied properties not correct for "GrpcRouteMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.GrpcRouteMatch` resource
 *
 * @param properties - the TypeScript properties of a `GrpcRouteMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.GrpcRouteMatch` resource.
 */
// @ts-ignore TS6133
function cfnRouteGrpcRouteMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_GrpcRouteMatchPropertyValidator(properties).assertSuccess();
    return {
        Metadata: cdk.listMapper(cfnRouteGrpcRouteMetadataPropertyToCloudFormation)(properties.metadata),
        MethodName: cdk.stringToCloudFormation(properties.methodName),
        Port: cdk.numberToCloudFormation(properties.port),
        ServiceName: cdk.stringToCloudFormation(properties.serviceName),
    };
}

// @ts-ignore TS6133
function CfnRouteGrpcRouteMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.GrpcRouteMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.GrpcRouteMatchProperty>();
    ret.addPropertyResult('metadata', 'Metadata', properties.Metadata != null ? cfn_parse.FromCloudFormation.getArray(CfnRouteGrpcRouteMetadataPropertyFromCloudFormation)(properties.Metadata) : undefined);
    ret.addPropertyResult('methodName', 'MethodName', properties.MethodName != null ? cfn_parse.FromCloudFormation.getString(properties.MethodName) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('serviceName', 'ServiceName', properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents the match metadata for the route.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadata.html
     */
    export interface GrpcRouteMetadataProperty {
        /**
         * Specify `True` to match anything except the match criteria. The default value is `False` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadata.html#cfn-appmesh-route-grpcroutemetadata-invert
         */
        readonly invert?: boolean | cdk.IResolvable;
        /**
         * An object that represents the data to match from the request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadata.html#cfn-appmesh-route-grpcroutemetadata-match
         */
        readonly match?: CfnRoute.GrpcRouteMetadataMatchMethodProperty | cdk.IResolvable;
        /**
         * The name of the route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadata.html#cfn-appmesh-route-grpcroutemetadata-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `GrpcRouteMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcRouteMetadataProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_GrpcRouteMetadataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('invert', cdk.validateBoolean)(properties.invert));
    errors.collect(cdk.propertyValidator('match', CfnRoute_GrpcRouteMetadataMatchMethodPropertyValidator)(properties.match));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "GrpcRouteMetadataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.GrpcRouteMetadata` resource
 *
 * @param properties - the TypeScript properties of a `GrpcRouteMetadataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.GrpcRouteMetadata` resource.
 */
// @ts-ignore TS6133
function cfnRouteGrpcRouteMetadataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_GrpcRouteMetadataPropertyValidator(properties).assertSuccess();
    return {
        Invert: cdk.booleanToCloudFormation(properties.invert),
        Match: cfnRouteGrpcRouteMetadataMatchMethodPropertyToCloudFormation(properties.match),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnRouteGrpcRouteMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.GrpcRouteMetadataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.GrpcRouteMetadataProperty>();
    ret.addPropertyResult('invert', 'Invert', properties.Invert != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Invert) : undefined);
    ret.addPropertyResult('match', 'Match', properties.Match != null ? CfnRouteGrpcRouteMetadataMatchMethodPropertyFromCloudFormation(properties.Match) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents the match method. Specify one of the match values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadatamatchmethod.html
     */
    export interface GrpcRouteMetadataMatchMethodProperty {
        /**
         * The value sent by the client must match the specified value exactly.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadatamatchmethod.html#cfn-appmesh-route-grpcroutemetadatamatchmethod-exact
         */
        readonly exact?: string;
        /**
         * The value sent by the client must begin with the specified characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadatamatchmethod.html#cfn-appmesh-route-grpcroutemetadatamatchmethod-prefix
         */
        readonly prefix?: string;
        /**
         * An object that represents the range of values to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadatamatchmethod.html#cfn-appmesh-route-grpcroutemetadatamatchmethod-range
         */
        readonly range?: CfnRoute.MatchRangeProperty | cdk.IResolvable;
        /**
         * The value sent by the client must include the specified characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadatamatchmethod.html#cfn-appmesh-route-grpcroutemetadatamatchmethod-regex
         */
        readonly regex?: string;
        /**
         * The value sent by the client must end with the specified characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpcroutemetadatamatchmethod.html#cfn-appmesh-route-grpcroutemetadatamatchmethod-suffix
         */
        readonly suffix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `GrpcRouteMetadataMatchMethodProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcRouteMetadataMatchMethodProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_GrpcRouteMetadataMatchMethodPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('exact', cdk.validateString)(properties.exact));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('range', CfnRoute_MatchRangePropertyValidator)(properties.range));
    errors.collect(cdk.propertyValidator('regex', cdk.validateString)(properties.regex));
    errors.collect(cdk.propertyValidator('suffix', cdk.validateString)(properties.suffix));
    return errors.wrap('supplied properties not correct for "GrpcRouteMetadataMatchMethodProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.GrpcRouteMetadataMatchMethod` resource
 *
 * @param properties - the TypeScript properties of a `GrpcRouteMetadataMatchMethodProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.GrpcRouteMetadataMatchMethod` resource.
 */
// @ts-ignore TS6133
function cfnRouteGrpcRouteMetadataMatchMethodPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_GrpcRouteMetadataMatchMethodPropertyValidator(properties).assertSuccess();
    return {
        Exact: cdk.stringToCloudFormation(properties.exact),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        Range: cfnRouteMatchRangePropertyToCloudFormation(properties.range),
        Regex: cdk.stringToCloudFormation(properties.regex),
        Suffix: cdk.stringToCloudFormation(properties.suffix),
    };
}

// @ts-ignore TS6133
function CfnRouteGrpcRouteMetadataMatchMethodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.GrpcRouteMetadataMatchMethodProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.GrpcRouteMetadataMatchMethodProperty>();
    ret.addPropertyResult('exact', 'Exact', properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('range', 'Range', properties.Range != null ? CfnRouteMatchRangePropertyFromCloudFormation(properties.Range) : undefined);
    ret.addPropertyResult('regex', 'Regex', properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined);
    ret.addPropertyResult('suffix', 'Suffix', properties.Suffix != null ? cfn_parse.FromCloudFormation.getString(properties.Suffix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents types of timeouts.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpctimeout.html
     */
    export interface GrpcTimeoutProperty {
        /**
         * An object that represents an idle timeout. An idle timeout bounds the amount of time that a connection may be idle. The default value is none.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpctimeout.html#cfn-appmesh-route-grpctimeout-idle
         */
        readonly idle?: CfnRoute.DurationProperty | cdk.IResolvable;
        /**
         * An object that represents a per request timeout. The default value is 15 seconds. If you set a higher timeout, then make sure that the higher value is set for each App Mesh resource in a conversation. For example, if a virtual node backend uses a virtual router provider to route to another virtual node, then the timeout should be greater than 15 seconds for the source and destination virtual node and the route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-grpctimeout.html#cfn-appmesh-route-grpctimeout-perrequest
         */
        readonly perRequest?: CfnRoute.DurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `GrpcTimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcTimeoutProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_GrpcTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('idle', CfnRoute_DurationPropertyValidator)(properties.idle));
    errors.collect(cdk.propertyValidator('perRequest', CfnRoute_DurationPropertyValidator)(properties.perRequest));
    return errors.wrap('supplied properties not correct for "GrpcTimeoutProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.GrpcTimeout` resource
 *
 * @param properties - the TypeScript properties of a `GrpcTimeoutProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.GrpcTimeout` resource.
 */
// @ts-ignore TS6133
function cfnRouteGrpcTimeoutPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_GrpcTimeoutPropertyValidator(properties).assertSuccess();
    return {
        Idle: cfnRouteDurationPropertyToCloudFormation(properties.idle),
        PerRequest: cfnRouteDurationPropertyToCloudFormation(properties.perRequest),
    };
}

// @ts-ignore TS6133
function CfnRouteGrpcTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.GrpcTimeoutProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.GrpcTimeoutProperty>();
    ret.addPropertyResult('idle', 'Idle', properties.Idle != null ? CfnRouteDurationPropertyFromCloudFormation(properties.Idle) : undefined);
    ret.addPropertyResult('perRequest', 'PerRequest', properties.PerRequest != null ? CfnRouteDurationPropertyFromCloudFormation(properties.PerRequest) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents the method and value to match with the header value sent in a request. Specify one match method.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-headermatchmethod.html
     */
    export interface HeaderMatchMethodProperty {
        /**
         * The value sent by the client must match the specified value exactly.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-headermatchmethod.html#cfn-appmesh-route-headermatchmethod-exact
         */
        readonly exact?: string;
        /**
         * The value sent by the client must begin with the specified characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-headermatchmethod.html#cfn-appmesh-route-headermatchmethod-prefix
         */
        readonly prefix?: string;
        /**
         * An object that represents the range of values to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-headermatchmethod.html#cfn-appmesh-route-headermatchmethod-range
         */
        readonly range?: CfnRoute.MatchRangeProperty | cdk.IResolvable;
        /**
         * The value sent by the client must include the specified characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-headermatchmethod.html#cfn-appmesh-route-headermatchmethod-regex
         */
        readonly regex?: string;
        /**
         * The value sent by the client must end with the specified characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-headermatchmethod.html#cfn-appmesh-route-headermatchmethod-suffix
         */
        readonly suffix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HeaderMatchMethodProperty`
 *
 * @param properties - the TypeScript properties of a `HeaderMatchMethodProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_HeaderMatchMethodPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('exact', cdk.validateString)(properties.exact));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('range', CfnRoute_MatchRangePropertyValidator)(properties.range));
    errors.collect(cdk.propertyValidator('regex', cdk.validateString)(properties.regex));
    errors.collect(cdk.propertyValidator('suffix', cdk.validateString)(properties.suffix));
    return errors.wrap('supplied properties not correct for "HeaderMatchMethodProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.HeaderMatchMethod` resource
 *
 * @param properties - the TypeScript properties of a `HeaderMatchMethodProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.HeaderMatchMethod` resource.
 */
// @ts-ignore TS6133
function cfnRouteHeaderMatchMethodPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_HeaderMatchMethodPropertyValidator(properties).assertSuccess();
    return {
        Exact: cdk.stringToCloudFormation(properties.exact),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        Range: cfnRouteMatchRangePropertyToCloudFormation(properties.range),
        Regex: cdk.stringToCloudFormation(properties.regex),
        Suffix: cdk.stringToCloudFormation(properties.suffix),
    };
}

// @ts-ignore TS6133
function CfnRouteHeaderMatchMethodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HeaderMatchMethodProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HeaderMatchMethodProperty>();
    ret.addPropertyResult('exact', 'Exact', properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('range', 'Range', properties.Range != null ? CfnRouteMatchRangePropertyFromCloudFormation(properties.Range) : undefined);
    ret.addPropertyResult('regex', 'Regex', properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined);
    ret.addPropertyResult('suffix', 'Suffix', properties.Suffix != null ? cfn_parse.FromCloudFormation.getString(properties.Suffix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object representing the path to match in the request.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httppathmatch.html
     */
    export interface HttpPathMatchProperty {
        /**
         * The exact path to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httppathmatch.html#cfn-appmesh-route-httppathmatch-exact
         */
        readonly exact?: string;
        /**
         * The regex used to match the path.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httppathmatch.html#cfn-appmesh-route-httppathmatch-regex
         */
        readonly regex?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HttpPathMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HttpPathMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_HttpPathMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('exact', cdk.validateString)(properties.exact));
    errors.collect(cdk.propertyValidator('regex', cdk.validateString)(properties.regex));
    return errors.wrap('supplied properties not correct for "HttpPathMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpPathMatch` resource
 *
 * @param properties - the TypeScript properties of a `HttpPathMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpPathMatch` resource.
 */
// @ts-ignore TS6133
function cfnRouteHttpPathMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_HttpPathMatchPropertyValidator(properties).assertSuccess();
    return {
        Exact: cdk.stringToCloudFormation(properties.exact),
        Regex: cdk.stringToCloudFormation(properties.regex),
    };
}

// @ts-ignore TS6133
function CfnRouteHttpPathMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpPathMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpPathMatchProperty>();
    ret.addPropertyResult('exact', 'Exact', properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined);
    ret.addPropertyResult('regex', 'Regex', properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object representing the query parameter to match.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httpqueryparametermatch.html
     */
    export interface HttpQueryParameterMatchProperty {
        /**
         * The exact query parameter to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httpqueryparametermatch.html#cfn-appmesh-route-httpqueryparametermatch-exact
         */
        readonly exact?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HttpQueryParameterMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HttpQueryParameterMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_HttpQueryParameterMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('exact', cdk.validateString)(properties.exact));
    return errors.wrap('supplied properties not correct for "HttpQueryParameterMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpQueryParameterMatch` resource
 *
 * @param properties - the TypeScript properties of a `HttpQueryParameterMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpQueryParameterMatch` resource.
 */
// @ts-ignore TS6133
function cfnRouteHttpQueryParameterMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_HttpQueryParameterMatchPropertyValidator(properties).assertSuccess();
    return {
        Exact: cdk.stringToCloudFormation(properties.exact),
    };
}

// @ts-ignore TS6133
function CfnRouteHttpQueryParameterMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpQueryParameterMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpQueryParameterMatchProperty>();
    ret.addPropertyResult('exact', 'Exact', properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents a retry policy. Specify at least one value for at least one of the types of `RetryEvents` , a value for `maxRetries` , and a value for `perRetryTimeout` . Both `server-error` and `gateway-error` under `httpRetryEvents` include the Envoy `reset` policy. For more information on the `reset` policy, see the [Envoy documentation](https://docs.aws.amazon.com/https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/router_filter#x-envoy-retry-on) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httpretrypolicy.html
     */
    export interface HttpRetryPolicyProperty {
        /**
         * Specify at least one of the following values.
         *
         * - *server-error* – HTTP status codes 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, and 511
         * - *gateway-error* – HTTP status codes 502, 503, and 504
         * - *client-error* – HTTP status code 409
         * - *stream-error* – Retry on refused stream
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httpretrypolicy.html#cfn-appmesh-route-httpretrypolicy-httpretryevents
         */
        readonly httpRetryEvents?: string[];
        /**
         * The maximum number of retry attempts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httpretrypolicy.html#cfn-appmesh-route-httpretrypolicy-maxretries
         */
        readonly maxRetries: number;
        /**
         * The timeout for each retry attempt.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httpretrypolicy.html#cfn-appmesh-route-httpretrypolicy-perretrytimeout
         */
        readonly perRetryTimeout: CfnRoute.DurationProperty | cdk.IResolvable;
        /**
         * Specify a valid value. The event occurs before any processing of a request has started and is encountered when the upstream is temporarily or permanently unavailable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httpretrypolicy.html#cfn-appmesh-route-httpretrypolicy-tcpretryevents
         */
        readonly tcpRetryEvents?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `HttpRetryPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `HttpRetryPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_HttpRetryPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('httpRetryEvents', cdk.listValidator(cdk.validateString))(properties.httpRetryEvents));
    errors.collect(cdk.propertyValidator('maxRetries', cdk.requiredValidator)(properties.maxRetries));
    errors.collect(cdk.propertyValidator('maxRetries', cdk.validateNumber)(properties.maxRetries));
    errors.collect(cdk.propertyValidator('perRetryTimeout', cdk.requiredValidator)(properties.perRetryTimeout));
    errors.collect(cdk.propertyValidator('perRetryTimeout', CfnRoute_DurationPropertyValidator)(properties.perRetryTimeout));
    errors.collect(cdk.propertyValidator('tcpRetryEvents', cdk.listValidator(cdk.validateString))(properties.tcpRetryEvents));
    return errors.wrap('supplied properties not correct for "HttpRetryPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpRetryPolicy` resource
 *
 * @param properties - the TypeScript properties of a `HttpRetryPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpRetryPolicy` resource.
 */
// @ts-ignore TS6133
function cfnRouteHttpRetryPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_HttpRetryPolicyPropertyValidator(properties).assertSuccess();
    return {
        HttpRetryEvents: cdk.listMapper(cdk.stringToCloudFormation)(properties.httpRetryEvents),
        MaxRetries: cdk.numberToCloudFormation(properties.maxRetries),
        PerRetryTimeout: cfnRouteDurationPropertyToCloudFormation(properties.perRetryTimeout),
        TcpRetryEvents: cdk.listMapper(cdk.stringToCloudFormation)(properties.tcpRetryEvents),
    };
}

// @ts-ignore TS6133
function CfnRouteHttpRetryPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpRetryPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpRetryPolicyProperty>();
    ret.addPropertyResult('httpRetryEvents', 'HttpRetryEvents', properties.HttpRetryEvents != null ? cfn_parse.FromCloudFormation.getStringArray(properties.HttpRetryEvents) : undefined);
    ret.addPropertyResult('maxRetries', 'MaxRetries', cfn_parse.FromCloudFormation.getNumber(properties.MaxRetries));
    ret.addPropertyResult('perRetryTimeout', 'PerRetryTimeout', CfnRouteDurationPropertyFromCloudFormation(properties.PerRetryTimeout));
    ret.addPropertyResult('tcpRetryEvents', 'TcpRetryEvents', properties.TcpRetryEvents != null ? cfn_parse.FromCloudFormation.getStringArray(properties.TcpRetryEvents) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents an HTTP or HTTP/2 route type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproute.html
     */
    export interface HttpRouteProperty {
        /**
         * An object that represents the action to take if a match is determined.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproute.html#cfn-appmesh-route-httproute-action
         */
        readonly action: CfnRoute.HttpRouteActionProperty | cdk.IResolvable;
        /**
         * An object that represents the criteria for determining a request match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproute.html#cfn-appmesh-route-httproute-match
         */
        readonly match: CfnRoute.HttpRouteMatchProperty | cdk.IResolvable;
        /**
         * An object that represents a retry policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproute.html#cfn-appmesh-route-httproute-retrypolicy
         */
        readonly retryPolicy?: CfnRoute.HttpRetryPolicyProperty | cdk.IResolvable;
        /**
         * An object that represents types of timeouts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproute.html#cfn-appmesh-route-httproute-timeout
         */
        readonly timeout?: CfnRoute.HttpTimeoutProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HttpRouteProperty`
 *
 * @param properties - the TypeScript properties of a `HttpRouteProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_HttpRoutePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', CfnRoute_HttpRouteActionPropertyValidator)(properties.action));
    errors.collect(cdk.propertyValidator('match', cdk.requiredValidator)(properties.match));
    errors.collect(cdk.propertyValidator('match', CfnRoute_HttpRouteMatchPropertyValidator)(properties.match));
    errors.collect(cdk.propertyValidator('retryPolicy', CfnRoute_HttpRetryPolicyPropertyValidator)(properties.retryPolicy));
    errors.collect(cdk.propertyValidator('timeout', CfnRoute_HttpTimeoutPropertyValidator)(properties.timeout));
    return errors.wrap('supplied properties not correct for "HttpRouteProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpRoute` resource
 *
 * @param properties - the TypeScript properties of a `HttpRouteProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpRoute` resource.
 */
// @ts-ignore TS6133
function cfnRouteHttpRoutePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_HttpRoutePropertyValidator(properties).assertSuccess();
    return {
        Action: cfnRouteHttpRouteActionPropertyToCloudFormation(properties.action),
        Match: cfnRouteHttpRouteMatchPropertyToCloudFormation(properties.match),
        RetryPolicy: cfnRouteHttpRetryPolicyPropertyToCloudFormation(properties.retryPolicy),
        Timeout: cfnRouteHttpTimeoutPropertyToCloudFormation(properties.timeout),
    };
}

// @ts-ignore TS6133
function CfnRouteHttpRoutePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpRouteProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpRouteProperty>();
    ret.addPropertyResult('action', 'Action', CfnRouteHttpRouteActionPropertyFromCloudFormation(properties.Action));
    ret.addPropertyResult('match', 'Match', CfnRouteHttpRouteMatchPropertyFromCloudFormation(properties.Match));
    ret.addPropertyResult('retryPolicy', 'RetryPolicy', properties.RetryPolicy != null ? CfnRouteHttpRetryPolicyPropertyFromCloudFormation(properties.RetryPolicy) : undefined);
    ret.addPropertyResult('timeout', 'Timeout', properties.Timeout != null ? CfnRouteHttpTimeoutPropertyFromCloudFormation(properties.Timeout) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents the action to take if a match is determined.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httprouteaction.html
     */
    export interface HttpRouteActionProperty {
        /**
         * An object that represents the targets that traffic is routed to when a request matches the route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httprouteaction.html#cfn-appmesh-route-httprouteaction-weightedtargets
         */
        readonly weightedTargets: Array<CfnRoute.WeightedTargetProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HttpRouteActionProperty`
 *
 * @param properties - the TypeScript properties of a `HttpRouteActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_HttpRouteActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('weightedTargets', cdk.requiredValidator)(properties.weightedTargets));
    errors.collect(cdk.propertyValidator('weightedTargets', cdk.listValidator(CfnRoute_WeightedTargetPropertyValidator))(properties.weightedTargets));
    return errors.wrap('supplied properties not correct for "HttpRouteActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpRouteAction` resource
 *
 * @param properties - the TypeScript properties of a `HttpRouteActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpRouteAction` resource.
 */
// @ts-ignore TS6133
function cfnRouteHttpRouteActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_HttpRouteActionPropertyValidator(properties).assertSuccess();
    return {
        WeightedTargets: cdk.listMapper(cfnRouteWeightedTargetPropertyToCloudFormation)(properties.weightedTargets),
    };
}

// @ts-ignore TS6133
function CfnRouteHttpRouteActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpRouteActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpRouteActionProperty>();
    ret.addPropertyResult('weightedTargets', 'WeightedTargets', cfn_parse.FromCloudFormation.getArray(CfnRouteWeightedTargetPropertyFromCloudFormation)(properties.WeightedTargets));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents the HTTP header in the request.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httprouteheader.html
     */
    export interface HttpRouteHeaderProperty {
        /**
         * Specify `True` to match anything except the match criteria. The default value is `False` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httprouteheader.html#cfn-appmesh-route-httprouteheader-invert
         */
        readonly invert?: boolean | cdk.IResolvable;
        /**
         * The `HeaderMatchMethod` object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httprouteheader.html#cfn-appmesh-route-httprouteheader-match
         */
        readonly match?: CfnRoute.HeaderMatchMethodProperty | cdk.IResolvable;
        /**
         * A name for the HTTP header in the client request that will be matched on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httprouteheader.html#cfn-appmesh-route-httprouteheader-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `HttpRouteHeaderProperty`
 *
 * @param properties - the TypeScript properties of a `HttpRouteHeaderProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_HttpRouteHeaderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('invert', cdk.validateBoolean)(properties.invert));
    errors.collect(cdk.propertyValidator('match', CfnRoute_HeaderMatchMethodPropertyValidator)(properties.match));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "HttpRouteHeaderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpRouteHeader` resource
 *
 * @param properties - the TypeScript properties of a `HttpRouteHeaderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpRouteHeader` resource.
 */
// @ts-ignore TS6133
function cfnRouteHttpRouteHeaderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_HttpRouteHeaderPropertyValidator(properties).assertSuccess();
    return {
        Invert: cdk.booleanToCloudFormation(properties.invert),
        Match: cfnRouteHeaderMatchMethodPropertyToCloudFormation(properties.match),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnRouteHttpRouteHeaderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpRouteHeaderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpRouteHeaderProperty>();
    ret.addPropertyResult('invert', 'Invert', properties.Invert != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Invert) : undefined);
    ret.addPropertyResult('match', 'Match', properties.Match != null ? CfnRouteHeaderMatchMethodPropertyFromCloudFormation(properties.Match) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents the requirements for a route to match HTTP requests for a virtual router.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html
     */
    export interface HttpRouteMatchProperty {
        /**
         * The client request headers to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html#cfn-appmesh-route-httproutematch-headers
         */
        readonly headers?: Array<CfnRoute.HttpRouteHeaderProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The client request method to match on. Specify only one.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html#cfn-appmesh-route-httproutematch-method
         */
        readonly method?: string;
        /**
         * The client request path to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html#cfn-appmesh-route-httproutematch-path
         */
        readonly path?: CfnRoute.HttpPathMatchProperty | cdk.IResolvable;
        /**
         * The port number to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html#cfn-appmesh-route-httproutematch-port
         */
        readonly port?: number;
        /**
         * Specifies the path to match requests with. This parameter must always start with `/` , which by itself matches all requests to the virtual service name. You can also match for path-based routing of requests. For example, if your virtual service name is `my-service.local` and you want the route to match requests to `my-service.local/metrics` , your prefix should be `/metrics` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html#cfn-appmesh-route-httproutematch-prefix
         */
        readonly prefix?: string;
        /**
         * The client request query parameters to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html#cfn-appmesh-route-httproutematch-queryparameters
         */
        readonly queryParameters?: Array<CfnRoute.QueryParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The client request scheme to match on. Specify only one. Applicable only for HTTP2 routes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httproutematch.html#cfn-appmesh-route-httproutematch-scheme
         */
        readonly scheme?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HttpRouteMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HttpRouteMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_HttpRouteMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('headers', cdk.listValidator(CfnRoute_HttpRouteHeaderPropertyValidator))(properties.headers));
    errors.collect(cdk.propertyValidator('method', cdk.validateString)(properties.method));
    errors.collect(cdk.propertyValidator('path', CfnRoute_HttpPathMatchPropertyValidator)(properties.path));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('queryParameters', cdk.listValidator(CfnRoute_QueryParameterPropertyValidator))(properties.queryParameters));
    errors.collect(cdk.propertyValidator('scheme', cdk.validateString)(properties.scheme));
    return errors.wrap('supplied properties not correct for "HttpRouteMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpRouteMatch` resource
 *
 * @param properties - the TypeScript properties of a `HttpRouteMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpRouteMatch` resource.
 */
// @ts-ignore TS6133
function cfnRouteHttpRouteMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_HttpRouteMatchPropertyValidator(properties).assertSuccess();
    return {
        Headers: cdk.listMapper(cfnRouteHttpRouteHeaderPropertyToCloudFormation)(properties.headers),
        Method: cdk.stringToCloudFormation(properties.method),
        Path: cfnRouteHttpPathMatchPropertyToCloudFormation(properties.path),
        Port: cdk.numberToCloudFormation(properties.port),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        QueryParameters: cdk.listMapper(cfnRouteQueryParameterPropertyToCloudFormation)(properties.queryParameters),
        Scheme: cdk.stringToCloudFormation(properties.scheme),
    };
}

// @ts-ignore TS6133
function CfnRouteHttpRouteMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpRouteMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpRouteMatchProperty>();
    ret.addPropertyResult('headers', 'Headers', properties.Headers != null ? cfn_parse.FromCloudFormation.getArray(CfnRouteHttpRouteHeaderPropertyFromCloudFormation)(properties.Headers) : undefined);
    ret.addPropertyResult('method', 'Method', properties.Method != null ? cfn_parse.FromCloudFormation.getString(properties.Method) : undefined);
    ret.addPropertyResult('path', 'Path', properties.Path != null ? CfnRouteHttpPathMatchPropertyFromCloudFormation(properties.Path) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('queryParameters', 'QueryParameters', properties.QueryParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnRouteQueryParameterPropertyFromCloudFormation)(properties.QueryParameters) : undefined);
    ret.addPropertyResult('scheme', 'Scheme', properties.Scheme != null ? cfn_parse.FromCloudFormation.getString(properties.Scheme) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents types of timeouts.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httptimeout.html
     */
    export interface HttpTimeoutProperty {
        /**
         * An object that represents an idle timeout. An idle timeout bounds the amount of time that a connection may be idle. The default value is none.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httptimeout.html#cfn-appmesh-route-httptimeout-idle
         */
        readonly idle?: CfnRoute.DurationProperty | cdk.IResolvable;
        /**
         * An object that represents a per request timeout. The default value is 15 seconds. If you set a higher timeout, then make sure that the higher value is set for each App Mesh resource in a conversation. For example, if a virtual node backend uses a virtual router provider to route to another virtual node, then the timeout should be greater than 15 seconds for the source and destination virtual node and the route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-httptimeout.html#cfn-appmesh-route-httptimeout-perrequest
         */
        readonly perRequest?: CfnRoute.DurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HttpTimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `HttpTimeoutProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_HttpTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('idle', CfnRoute_DurationPropertyValidator)(properties.idle));
    errors.collect(cdk.propertyValidator('perRequest', CfnRoute_DurationPropertyValidator)(properties.perRequest));
    return errors.wrap('supplied properties not correct for "HttpTimeoutProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpTimeout` resource
 *
 * @param properties - the TypeScript properties of a `HttpTimeoutProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.HttpTimeout` resource.
 */
// @ts-ignore TS6133
function cfnRouteHttpTimeoutPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_HttpTimeoutPropertyValidator(properties).assertSuccess();
    return {
        Idle: cfnRouteDurationPropertyToCloudFormation(properties.idle),
        PerRequest: cfnRouteDurationPropertyToCloudFormation(properties.perRequest),
    };
}

// @ts-ignore TS6133
function CfnRouteHttpTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.HttpTimeoutProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.HttpTimeoutProperty>();
    ret.addPropertyResult('idle', 'Idle', properties.Idle != null ? CfnRouteDurationPropertyFromCloudFormation(properties.Idle) : undefined);
    ret.addPropertyResult('perRequest', 'PerRequest', properties.PerRequest != null ? CfnRouteDurationPropertyFromCloudFormation(properties.PerRequest) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents the range of values to match on. The first character of the range is included in the range, though the last character is not. For example, if the range specified were 1-100, only values 1-99 would be matched.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-matchrange.html
     */
    export interface MatchRangeProperty {
        /**
         * The end of the range.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-matchrange.html#cfn-appmesh-route-matchrange-end
         */
        readonly end: number;
        /**
         * The start of the range.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-matchrange.html#cfn-appmesh-route-matchrange-start
         */
        readonly start: number;
    }
}

/**
 * Determine whether the given properties match those of a `MatchRangeProperty`
 *
 * @param properties - the TypeScript properties of a `MatchRangeProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_MatchRangePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('end', cdk.requiredValidator)(properties.end));
    errors.collect(cdk.propertyValidator('end', cdk.validateNumber)(properties.end));
    errors.collect(cdk.propertyValidator('start', cdk.requiredValidator)(properties.start));
    errors.collect(cdk.propertyValidator('start', cdk.validateNumber)(properties.start));
    return errors.wrap('supplied properties not correct for "MatchRangeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.MatchRange` resource
 *
 * @param properties - the TypeScript properties of a `MatchRangeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.MatchRange` resource.
 */
// @ts-ignore TS6133
function cfnRouteMatchRangePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_MatchRangePropertyValidator(properties).assertSuccess();
    return {
        End: cdk.numberToCloudFormation(properties.end),
        Start: cdk.numberToCloudFormation(properties.start),
    };
}

// @ts-ignore TS6133
function CfnRouteMatchRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.MatchRangeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.MatchRangeProperty>();
    ret.addPropertyResult('end', 'End', cfn_parse.FromCloudFormation.getNumber(properties.End));
    ret.addPropertyResult('start', 'Start', cfn_parse.FromCloudFormation.getNumber(properties.Start));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents the query parameter in the request.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-queryparameter.html
     */
    export interface QueryParameterProperty {
        /**
         * The query parameter to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-queryparameter.html#cfn-appmesh-route-queryparameter-match
         */
        readonly match?: CfnRoute.HttpQueryParameterMatchProperty | cdk.IResolvable;
        /**
         * A name for the query parameter that will be matched on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-queryparameter.html#cfn-appmesh-route-queryparameter-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `QueryParameterProperty`
 *
 * @param properties - the TypeScript properties of a `QueryParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_QueryParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('match', CfnRoute_HttpQueryParameterMatchPropertyValidator)(properties.match));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "QueryParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.QueryParameter` resource
 *
 * @param properties - the TypeScript properties of a `QueryParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.QueryParameter` resource.
 */
// @ts-ignore TS6133
function cfnRouteQueryParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_QueryParameterPropertyValidator(properties).assertSuccess();
    return {
        Match: cfnRouteHttpQueryParameterMatchPropertyToCloudFormation(properties.match),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnRouteQueryParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.QueryParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.QueryParameterProperty>();
    ret.addPropertyResult('match', 'Match', properties.Match != null ? CfnRouteHttpQueryParameterMatchPropertyFromCloudFormation(properties.Match) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents a route specification. Specify one route type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-routespec.html
     */
    export interface RouteSpecProperty {
        /**
         * An object that represents the specification of a gRPC route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-routespec.html#cfn-appmesh-route-routespec-grpcroute
         */
        readonly grpcRoute?: CfnRoute.GrpcRouteProperty | cdk.IResolvable;
        /**
         * An object that represents the specification of an HTTP/2 route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-routespec.html#cfn-appmesh-route-routespec-http2route
         */
        readonly http2Route?: CfnRoute.HttpRouteProperty | cdk.IResolvable;
        /**
         * An object that represents the specification of an HTTP route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-routespec.html#cfn-appmesh-route-routespec-httproute
         */
        readonly httpRoute?: CfnRoute.HttpRouteProperty | cdk.IResolvable;
        /**
         * The priority for the route. Routes are matched based on the specified value, where 0 is the highest priority.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-routespec.html#cfn-appmesh-route-routespec-priority
         */
        readonly priority?: number;
        /**
         * An object that represents the specification of a TCP route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-routespec.html#cfn-appmesh-route-routespec-tcproute
         */
        readonly tcpRoute?: CfnRoute.TcpRouteProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RouteSpecProperty`
 *
 * @param properties - the TypeScript properties of a `RouteSpecProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_RouteSpecPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('grpcRoute', CfnRoute_GrpcRoutePropertyValidator)(properties.grpcRoute));
    errors.collect(cdk.propertyValidator('http2Route', CfnRoute_HttpRoutePropertyValidator)(properties.http2Route));
    errors.collect(cdk.propertyValidator('httpRoute', CfnRoute_HttpRoutePropertyValidator)(properties.httpRoute));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('tcpRoute', CfnRoute_TcpRoutePropertyValidator)(properties.tcpRoute));
    return errors.wrap('supplied properties not correct for "RouteSpecProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.RouteSpec` resource
 *
 * @param properties - the TypeScript properties of a `RouteSpecProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.RouteSpec` resource.
 */
// @ts-ignore TS6133
function cfnRouteRouteSpecPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_RouteSpecPropertyValidator(properties).assertSuccess();
    return {
        GrpcRoute: cfnRouteGrpcRoutePropertyToCloudFormation(properties.grpcRoute),
        Http2Route: cfnRouteHttpRoutePropertyToCloudFormation(properties.http2Route),
        HttpRoute: cfnRouteHttpRoutePropertyToCloudFormation(properties.httpRoute),
        Priority: cdk.numberToCloudFormation(properties.priority),
        TcpRoute: cfnRouteTcpRoutePropertyToCloudFormation(properties.tcpRoute),
    };
}

// @ts-ignore TS6133
function CfnRouteRouteSpecPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.RouteSpecProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.RouteSpecProperty>();
    ret.addPropertyResult('grpcRoute', 'GrpcRoute', properties.GrpcRoute != null ? CfnRouteGrpcRoutePropertyFromCloudFormation(properties.GrpcRoute) : undefined);
    ret.addPropertyResult('http2Route', 'Http2Route', properties.Http2Route != null ? CfnRouteHttpRoutePropertyFromCloudFormation(properties.Http2Route) : undefined);
    ret.addPropertyResult('httpRoute', 'HttpRoute', properties.HttpRoute != null ? CfnRouteHttpRoutePropertyFromCloudFormation(properties.HttpRoute) : undefined);
    ret.addPropertyResult('priority', 'Priority', properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined);
    ret.addPropertyResult('tcpRoute', 'TcpRoute', properties.TcpRoute != null ? CfnRouteTcpRoutePropertyFromCloudFormation(properties.TcpRoute) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents a TCP route type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcproute.html
     */
    export interface TcpRouteProperty {
        /**
         * The action to take if a match is determined.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcproute.html#cfn-appmesh-route-tcproute-action
         */
        readonly action: CfnRoute.TcpRouteActionProperty | cdk.IResolvable;
        /**
         * An object that represents the criteria for determining a request match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcproute.html#cfn-appmesh-route-tcproute-match
         */
        readonly match?: CfnRoute.TcpRouteMatchProperty | cdk.IResolvable;
        /**
         * An object that represents types of timeouts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcproute.html#cfn-appmesh-route-tcproute-timeout
         */
        readonly timeout?: CfnRoute.TcpTimeoutProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TcpRouteProperty`
 *
 * @param properties - the TypeScript properties of a `TcpRouteProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_TcpRoutePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', CfnRoute_TcpRouteActionPropertyValidator)(properties.action));
    errors.collect(cdk.propertyValidator('match', CfnRoute_TcpRouteMatchPropertyValidator)(properties.match));
    errors.collect(cdk.propertyValidator('timeout', CfnRoute_TcpTimeoutPropertyValidator)(properties.timeout));
    return errors.wrap('supplied properties not correct for "TcpRouteProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.TcpRoute` resource
 *
 * @param properties - the TypeScript properties of a `TcpRouteProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.TcpRoute` resource.
 */
// @ts-ignore TS6133
function cfnRouteTcpRoutePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_TcpRoutePropertyValidator(properties).assertSuccess();
    return {
        Action: cfnRouteTcpRouteActionPropertyToCloudFormation(properties.action),
        Match: cfnRouteTcpRouteMatchPropertyToCloudFormation(properties.match),
        Timeout: cfnRouteTcpTimeoutPropertyToCloudFormation(properties.timeout),
    };
}

// @ts-ignore TS6133
function CfnRouteTcpRoutePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.TcpRouteProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.TcpRouteProperty>();
    ret.addPropertyResult('action', 'Action', CfnRouteTcpRouteActionPropertyFromCloudFormation(properties.Action));
    ret.addPropertyResult('match', 'Match', properties.Match != null ? CfnRouteTcpRouteMatchPropertyFromCloudFormation(properties.Match) : undefined);
    ret.addPropertyResult('timeout', 'Timeout', properties.Timeout != null ? CfnRouteTcpTimeoutPropertyFromCloudFormation(properties.Timeout) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents the action to take if a match is determined.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcprouteaction.html
     */
    export interface TcpRouteActionProperty {
        /**
         * An object that represents the targets that traffic is routed to when a request matches the route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcprouteaction.html#cfn-appmesh-route-tcprouteaction-weightedtargets
         */
        readonly weightedTargets: Array<CfnRoute.WeightedTargetProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TcpRouteActionProperty`
 *
 * @param properties - the TypeScript properties of a `TcpRouteActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_TcpRouteActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('weightedTargets', cdk.requiredValidator)(properties.weightedTargets));
    errors.collect(cdk.propertyValidator('weightedTargets', cdk.listValidator(CfnRoute_WeightedTargetPropertyValidator))(properties.weightedTargets));
    return errors.wrap('supplied properties not correct for "TcpRouteActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.TcpRouteAction` resource
 *
 * @param properties - the TypeScript properties of a `TcpRouteActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.TcpRouteAction` resource.
 */
// @ts-ignore TS6133
function cfnRouteTcpRouteActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_TcpRouteActionPropertyValidator(properties).assertSuccess();
    return {
        WeightedTargets: cdk.listMapper(cfnRouteWeightedTargetPropertyToCloudFormation)(properties.weightedTargets),
    };
}

// @ts-ignore TS6133
function CfnRouteTcpRouteActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.TcpRouteActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.TcpRouteActionProperty>();
    ret.addPropertyResult('weightedTargets', 'WeightedTargets', cfn_parse.FromCloudFormation.getArray(CfnRouteWeightedTargetPropertyFromCloudFormation)(properties.WeightedTargets));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object representing the TCP route to match.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcproutematch.html
     */
    export interface TcpRouteMatchProperty {
        /**
         * The port number to match on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcproutematch.html#cfn-appmesh-route-tcproutematch-port
         */
        readonly port?: number;
    }
}

/**
 * Determine whether the given properties match those of a `TcpRouteMatchProperty`
 *
 * @param properties - the TypeScript properties of a `TcpRouteMatchProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_TcpRouteMatchPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    return errors.wrap('supplied properties not correct for "TcpRouteMatchProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.TcpRouteMatch` resource
 *
 * @param properties - the TypeScript properties of a `TcpRouteMatchProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.TcpRouteMatch` resource.
 */
// @ts-ignore TS6133
function cfnRouteTcpRouteMatchPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_TcpRouteMatchPropertyValidator(properties).assertSuccess();
    return {
        Port: cdk.numberToCloudFormation(properties.port),
    };
}

// @ts-ignore TS6133
function CfnRouteTcpRouteMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.TcpRouteMatchProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.TcpRouteMatchProperty>();
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents types of timeouts.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcptimeout.html
     */
    export interface TcpTimeoutProperty {
        /**
         * An object that represents an idle timeout. An idle timeout bounds the amount of time that a connection may be idle. The default value is none.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-tcptimeout.html#cfn-appmesh-route-tcptimeout-idle
         */
        readonly idle?: CfnRoute.DurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TcpTimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `TcpTimeoutProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_TcpTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('idle', CfnRoute_DurationPropertyValidator)(properties.idle));
    return errors.wrap('supplied properties not correct for "TcpTimeoutProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.TcpTimeout` resource
 *
 * @param properties - the TypeScript properties of a `TcpTimeoutProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.TcpTimeout` resource.
 */
// @ts-ignore TS6133
function cfnRouteTcpTimeoutPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_TcpTimeoutPropertyValidator(properties).assertSuccess();
    return {
        Idle: cfnRouteDurationPropertyToCloudFormation(properties.idle),
    };
}

// @ts-ignore TS6133
function CfnRouteTcpTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.TcpTimeoutProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.TcpTimeoutProperty>();
    ret.addPropertyResult('idle', 'Idle', properties.Idle != null ? CfnRouteDurationPropertyFromCloudFormation(properties.Idle) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRoute {
    /**
     * An object that represents a target and its relative weight. Traffic is distributed across targets according to their relative weight. For example, a weighted target with a relative weight of 50 receives five times as much traffic as one with a relative weight of 10. The total weight for all targets combined must be less than or equal to 100.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-weightedtarget.html
     */
    export interface WeightedTargetProperty {
        /**
         * The targeted port of the weighted object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-weightedtarget.html#cfn-appmesh-route-weightedtarget-port
         */
        readonly port?: number;
        /**
         * The virtual node to associate with the weighted target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-weightedtarget.html#cfn-appmesh-route-weightedtarget-virtualnode
         */
        readonly virtualNode: string;
        /**
         * The relative weight of the weighted target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-route-weightedtarget.html#cfn-appmesh-route-weightedtarget-weight
         */
        readonly weight: number;
    }
}

/**
 * Determine whether the given properties match those of a `WeightedTargetProperty`
 *
 * @param properties - the TypeScript properties of a `WeightedTargetProperty`
 *
 * @returns the result of the validation.
 */
function CfnRoute_WeightedTargetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('virtualNode', cdk.requiredValidator)(properties.virtualNode));
    errors.collect(cdk.propertyValidator('virtualNode', cdk.validateString)(properties.virtualNode));
    errors.collect(cdk.propertyValidator('weight', cdk.requiredValidator)(properties.weight));
    errors.collect(cdk.propertyValidator('weight', cdk.validateNumber)(properties.weight));
    return errors.wrap('supplied properties not correct for "WeightedTargetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::Route.WeightedTarget` resource
 *
 * @param properties - the TypeScript properties of a `WeightedTargetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::Route.WeightedTarget` resource.
 */
// @ts-ignore TS6133
function cfnRouteWeightedTargetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoute_WeightedTargetPropertyValidator(properties).assertSuccess();
    return {
        Port: cdk.numberToCloudFormation(properties.port),
        VirtualNode: cdk.stringToCloudFormation(properties.virtualNode),
        Weight: cdk.numberToCloudFormation(properties.weight),
    };
}

// @ts-ignore TS6133
function CfnRouteWeightedTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.WeightedTargetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.WeightedTargetProperty>();
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('virtualNode', 'VirtualNode', cfn_parse.FromCloudFormation.getString(properties.VirtualNode));
    ret.addPropertyResult('weight', 'Weight', cfn_parse.FromCloudFormation.getNumber(properties.Weight));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnVirtualGateway`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html
 */
export interface CfnVirtualGatewayProps {

    /**
     * The name of the service mesh that the virtual gateway resides in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html#cfn-appmesh-virtualgateway-meshname
     */
    readonly meshName: string;

    /**
     * The specifications of the virtual gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html#cfn-appmesh-virtualgateway-spec
     */
    readonly spec: CfnVirtualGateway.VirtualGatewaySpecProperty | cdk.IResolvable;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html#cfn-appmesh-virtualgateway-meshowner
     */
    readonly meshOwner?: string;

    /**
     * Optional metadata that you can apply to the virtual gateway to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html#cfn-appmesh-virtualgateway-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The name of the virtual gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html#cfn-appmesh-virtualgateway-virtualgatewayname
     */
    readonly virtualGatewayName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnVirtualGatewayProps`
 *
 * @param properties - the TypeScript properties of a `CfnVirtualGatewayProps`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGatewayPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('meshName', cdk.requiredValidator)(properties.meshName));
    errors.collect(cdk.propertyValidator('meshName', cdk.validateString)(properties.meshName));
    errors.collect(cdk.propertyValidator('meshOwner', cdk.validateString)(properties.meshOwner));
    errors.collect(cdk.propertyValidator('spec', cdk.requiredValidator)(properties.spec));
    errors.collect(cdk.propertyValidator('spec', CfnVirtualGateway_VirtualGatewaySpecPropertyValidator)(properties.spec));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('virtualGatewayName', cdk.validateString)(properties.virtualGatewayName));
    return errors.wrap('supplied properties not correct for "CfnVirtualGatewayProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway` resource
 *
 * @param properties - the TypeScript properties of a `CfnVirtualGatewayProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGatewayPropsValidator(properties).assertSuccess();
    return {
        MeshName: cdk.stringToCloudFormation(properties.meshName),
        Spec: cfnVirtualGatewayVirtualGatewaySpecPropertyToCloudFormation(properties.spec),
        MeshOwner: cdk.stringToCloudFormation(properties.meshOwner),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VirtualGatewayName: cdk.stringToCloudFormation(properties.virtualGatewayName),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGatewayProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGatewayProps>();
    ret.addPropertyResult('meshName', 'MeshName', cfn_parse.FromCloudFormation.getString(properties.MeshName));
    ret.addPropertyResult('spec', 'Spec', CfnVirtualGatewayVirtualGatewaySpecPropertyFromCloudFormation(properties.Spec));
    ret.addPropertyResult('meshOwner', 'MeshOwner', properties.MeshOwner != null ? cfn_parse.FromCloudFormation.getString(properties.MeshOwner) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('virtualGatewayName', 'VirtualGatewayName', properties.VirtualGatewayName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualGatewayName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppMesh::VirtualGateway`
 *
 * Creates a virtual gateway.
 *
 * A virtual gateway allows resources outside your mesh to communicate to resources that are inside your mesh. The virtual gateway represents an Envoy proxy running in an Amazon ECS task, in a Kubernetes service, or on an Amazon EC2 instance. Unlike a virtual node, which represents an Envoy running with an application, a virtual gateway represents Envoy deployed by itself.
 *
 * For more information about virtual gateways, see [Virtual gateways](https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_gateways.html) .
 *
 * @cloudformationResource AWS::AppMesh::VirtualGateway
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html
 */
export class CfnVirtualGateway extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppMesh::VirtualGateway";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVirtualGateway {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnVirtualGatewayPropsFromCloudFormation(resourceProperties);
        const ret = new CfnVirtualGateway(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The full Amazon Resource Name (ARN) for the virtual gateway.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the service mesh that the virtual gateway resides in.
     * @cloudformationAttribute MeshName
     */
    public readonly attrMeshName: string;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     * @cloudformationAttribute MeshOwner
     */
    public readonly attrMeshOwner: string;

    /**
     * The AWS IAM account ID of the resource owner. If the account ID is not your own, then it's the ID of the mesh owner or of another account that the mesh is shared with. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     * @cloudformationAttribute ResourceOwner
     */
    public readonly attrResourceOwner: string;

    /**
     * The unique identifier for the virtual gateway.
     * @cloudformationAttribute Uid
     */
    public readonly attrUid: string;

    /**
     * The name of the virtual gateway.
     * @cloudformationAttribute VirtualGatewayName
     */
    public readonly attrVirtualGatewayName: string;

    /**
     * The name of the service mesh that the virtual gateway resides in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html#cfn-appmesh-virtualgateway-meshname
     */
    public meshName: string;

    /**
     * The specifications of the virtual gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html#cfn-appmesh-virtualgateway-spec
     */
    public spec: CfnVirtualGateway.VirtualGatewaySpecProperty | cdk.IResolvable;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html#cfn-appmesh-virtualgateway-meshowner
     */
    public meshOwner: string | undefined;

    /**
     * Optional metadata that you can apply to the virtual gateway to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html#cfn-appmesh-virtualgateway-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The name of the virtual gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualgateway.html#cfn-appmesh-virtualgateway-virtualgatewayname
     */
    public virtualGatewayName: string | undefined;

    /**
     * Create a new `AWS::AppMesh::VirtualGateway`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnVirtualGatewayProps) {
        super(scope, id, { type: CfnVirtualGateway.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'meshName', this);
        cdk.requireProperty(props, 'spec', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrMeshName = cdk.Token.asString(this.getAtt('MeshName', cdk.ResolutionTypeHint.STRING));
        this.attrMeshOwner = cdk.Token.asString(this.getAtt('MeshOwner', cdk.ResolutionTypeHint.STRING));
        this.attrResourceOwner = cdk.Token.asString(this.getAtt('ResourceOwner', cdk.ResolutionTypeHint.STRING));
        this.attrUid = cdk.Token.asString(this.getAtt('Uid', cdk.ResolutionTypeHint.STRING));
        this.attrVirtualGatewayName = cdk.Token.asString(this.getAtt('VirtualGatewayName', cdk.ResolutionTypeHint.STRING));

        this.meshName = props.meshName;
        this.spec = props.spec;
        this.meshOwner = props.meshOwner;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppMesh::VirtualGateway", props.tags, { tagPropertyName: 'tags' });
        this.virtualGatewayName = props.virtualGatewayName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnVirtualGateway.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            meshName: this.meshName,
            spec: this.spec,
            meshOwner: this.meshOwner,
            tags: this.tags.renderTags(),
            virtualGatewayName: this.virtualGatewayName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnVirtualGatewayPropsToCloudFormation(props);
    }
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents the key value pairs for the JSON.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-jsonformatref.html
     */
    export interface JsonFormatRefProperty {
        /**
         * The specified key for the JSON.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-jsonformatref.html#cfn-appmesh-virtualgateway-jsonformatref-key
         */
        readonly key: string;
        /**
         * The specified value for the JSON.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-jsonformatref.html#cfn-appmesh-virtualgateway-jsonformatref-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `JsonFormatRefProperty`
 *
 * @param properties - the TypeScript properties of a `JsonFormatRefProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_JsonFormatRefPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "JsonFormatRefProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.JsonFormatRef` resource
 *
 * @param properties - the TypeScript properties of a `JsonFormatRefProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.JsonFormatRef` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayJsonFormatRefPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_JsonFormatRefPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayJsonFormatRefPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.JsonFormatRefProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.JsonFormatRefProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents the format for the logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-loggingformat.html
     */
    export interface LoggingFormatProperty {
        /**
         * The logging format for JSON.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-loggingformat.html#cfn-appmesh-virtualgateway-loggingformat-json
         */
        readonly json?: Array<CfnVirtualGateway.JsonFormatRefProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The logging format for text.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-loggingformat.html#cfn-appmesh-virtualgateway-loggingformat-text
         */
        readonly text?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LoggingFormatProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingFormatProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_LoggingFormatPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('json', cdk.listValidator(CfnVirtualGateway_JsonFormatRefPropertyValidator))(properties.json));
    errors.collect(cdk.propertyValidator('text', cdk.validateString)(properties.text));
    return errors.wrap('supplied properties not correct for "LoggingFormatProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.LoggingFormat` resource
 *
 * @param properties - the TypeScript properties of a `LoggingFormatProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.LoggingFormat` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayLoggingFormatPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_LoggingFormatPropertyValidator(properties).assertSuccess();
    return {
        Json: cdk.listMapper(cfnVirtualGatewayJsonFormatRefPropertyToCloudFormation)(properties.json),
        Text: cdk.stringToCloudFormation(properties.text),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayLoggingFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.LoggingFormatProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.LoggingFormatProperty>();
    ret.addPropertyResult('json', 'Json', properties.Json != null ? cfn_parse.FromCloudFormation.getArray(CfnVirtualGatewayJsonFormatRefPropertyFromCloudFormation)(properties.Json) : undefined);
    ret.addPropertyResult('text', 'Text', properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents the methods by which a subject alternative name on a peer Transport Layer Security (TLS) certificate can be matched.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-subjectalternativenamematchers.html
     */
    export interface SubjectAlternativeNameMatchersProperty {
        /**
         * The values sent must match the specified values exactly.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-subjectalternativenamematchers.html#cfn-appmesh-virtualgateway-subjectalternativenamematchers-exact
         */
        readonly exact?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `SubjectAlternativeNameMatchersProperty`
 *
 * @param properties - the TypeScript properties of a `SubjectAlternativeNameMatchersProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_SubjectAlternativeNameMatchersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('exact', cdk.listValidator(cdk.validateString))(properties.exact));
    return errors.wrap('supplied properties not correct for "SubjectAlternativeNameMatchersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.SubjectAlternativeNameMatchers` resource
 *
 * @param properties - the TypeScript properties of a `SubjectAlternativeNameMatchersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.SubjectAlternativeNameMatchers` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewaySubjectAlternativeNameMatchersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_SubjectAlternativeNameMatchersPropertyValidator(properties).assertSuccess();
    return {
        Exact: cdk.listMapper(cdk.stringToCloudFormation)(properties.exact),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewaySubjectAlternativeNameMatchersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.SubjectAlternativeNameMatchersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.SubjectAlternativeNameMatchersProperty>();
    ret.addPropertyResult('exact', 'Exact', properties.Exact != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Exact) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents the subject alternative names secured by the certificate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-subjectalternativenames.html
     */
    export interface SubjectAlternativeNamesProperty {
        /**
         * An object that represents the criteria for determining a SANs match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-subjectalternativenames.html#cfn-appmesh-virtualgateway-subjectalternativenames-match
         */
        readonly match: CfnVirtualGateway.SubjectAlternativeNameMatchersProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SubjectAlternativeNamesProperty`
 *
 * @param properties - the TypeScript properties of a `SubjectAlternativeNamesProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_SubjectAlternativeNamesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('match', cdk.requiredValidator)(properties.match));
    errors.collect(cdk.propertyValidator('match', CfnVirtualGateway_SubjectAlternativeNameMatchersPropertyValidator)(properties.match));
    return errors.wrap('supplied properties not correct for "SubjectAlternativeNamesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.SubjectAlternativeNames` resource
 *
 * @param properties - the TypeScript properties of a `SubjectAlternativeNamesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.SubjectAlternativeNames` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewaySubjectAlternativeNamesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_SubjectAlternativeNamesPropertyValidator(properties).assertSuccess();
    return {
        Match: cfnVirtualGatewaySubjectAlternativeNameMatchersPropertyToCloudFormation(properties.match),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewaySubjectAlternativeNamesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.SubjectAlternativeNamesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.SubjectAlternativeNamesProperty>();
    ret.addPropertyResult('match', 'Match', CfnVirtualGatewaySubjectAlternativeNameMatchersPropertyFromCloudFormation(properties.Match));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * The access log configuration for a virtual gateway.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayaccesslog.html
     */
    export interface VirtualGatewayAccessLogProperty {
        /**
         * The file object to send virtual gateway access logs to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayaccesslog.html#cfn-appmesh-virtualgateway-virtualgatewayaccesslog-file
         */
        readonly file?: CfnVirtualGateway.VirtualGatewayFileAccessLogProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayAccessLogProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayAccessLogProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayAccessLogPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('file', CfnVirtualGateway_VirtualGatewayFileAccessLogPropertyValidator)(properties.file));
    return errors.wrap('supplied properties not correct for "VirtualGatewayAccessLogProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayAccessLog` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayAccessLogProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayAccessLog` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayAccessLogPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayAccessLogPropertyValidator(properties).assertSuccess();
    return {
        File: cfnVirtualGatewayVirtualGatewayFileAccessLogPropertyToCloudFormation(properties.file),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayAccessLogPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayAccessLogProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayAccessLogProperty>();
    ret.addPropertyResult('file', 'File', properties.File != null ? CfnVirtualGatewayVirtualGatewayFileAccessLogPropertyFromCloudFormation(properties.File) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents the default properties for a backend.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaybackenddefaults.html
     */
    export interface VirtualGatewayBackendDefaultsProperty {
        /**
         * A reference to an object that represents a client policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaybackenddefaults.html#cfn-appmesh-virtualgateway-virtualgatewaybackenddefaults-clientpolicy
         */
        readonly clientPolicy?: CfnVirtualGateway.VirtualGatewayClientPolicyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayBackendDefaultsProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayBackendDefaultsProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayBackendDefaultsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clientPolicy', CfnVirtualGateway_VirtualGatewayClientPolicyPropertyValidator)(properties.clientPolicy));
    return errors.wrap('supplied properties not correct for "VirtualGatewayBackendDefaultsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayBackendDefaults` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayBackendDefaultsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayBackendDefaults` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayBackendDefaultsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayBackendDefaultsPropertyValidator(properties).assertSuccess();
    return {
        ClientPolicy: cfnVirtualGatewayVirtualGatewayClientPolicyPropertyToCloudFormation(properties.clientPolicy),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayBackendDefaultsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayBackendDefaultsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayBackendDefaultsProperty>();
    ret.addPropertyResult('clientPolicy', 'ClientPolicy', properties.ClientPolicy != null ? CfnVirtualGatewayVirtualGatewayClientPolicyPropertyFromCloudFormation(properties.ClientPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a client policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclientpolicy.html
     */
    export interface VirtualGatewayClientPolicyProperty {
        /**
         * A reference to an object that represents a Transport Layer Security (TLS) client policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclientpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayclientpolicy-tls
         */
        readonly tls?: CfnVirtualGateway.VirtualGatewayClientPolicyTlsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayClientPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayClientPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayClientPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('tls', CfnVirtualGateway_VirtualGatewayClientPolicyTlsPropertyValidator)(properties.tls));
    return errors.wrap('supplied properties not correct for "VirtualGatewayClientPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayClientPolicy` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayClientPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayClientPolicy` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayClientPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayClientPolicyPropertyValidator(properties).assertSuccess();
    return {
        TLS: cfnVirtualGatewayVirtualGatewayClientPolicyTlsPropertyToCloudFormation(properties.tls),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayClientPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayClientPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayClientPolicyProperty>();
    ret.addPropertyResult('tls', 'TLS', properties.TLS != null ? CfnVirtualGatewayVirtualGatewayClientPolicyTlsPropertyFromCloudFormation(properties.TLS) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a Transport Layer Security (TLS) client policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclientpolicytls.html
     */
    export interface VirtualGatewayClientPolicyTlsProperty {
        /**
         * A reference to an object that represents a virtual gateway's client's Transport Layer Security (TLS) certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclientpolicytls.html#cfn-appmesh-virtualgateway-virtualgatewayclientpolicytls-certificate
         */
        readonly certificate?: CfnVirtualGateway.VirtualGatewayClientTlsCertificateProperty | cdk.IResolvable;
        /**
         * Whether the policy is enforced. The default is `True` , if a value isn't specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclientpolicytls.html#cfn-appmesh-virtualgateway-virtualgatewayclientpolicytls-enforce
         */
        readonly enforce?: boolean | cdk.IResolvable;
        /**
         * One or more ports that the policy is enforced for.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclientpolicytls.html#cfn-appmesh-virtualgateway-virtualgatewayclientpolicytls-ports
         */
        readonly ports?: number[] | cdk.IResolvable;
        /**
         * A reference to an object that represents a Transport Layer Security (TLS) validation context.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclientpolicytls.html#cfn-appmesh-virtualgateway-virtualgatewayclientpolicytls-validation
         */
        readonly validation: CfnVirtualGateway.VirtualGatewayTlsValidationContextProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayClientPolicyTlsProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayClientPolicyTlsProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayClientPolicyTlsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificate', CfnVirtualGateway_VirtualGatewayClientTlsCertificatePropertyValidator)(properties.certificate));
    errors.collect(cdk.propertyValidator('enforce', cdk.validateBoolean)(properties.enforce));
    errors.collect(cdk.propertyValidator('ports', cdk.listValidator(cdk.validateNumber))(properties.ports));
    errors.collect(cdk.propertyValidator('validation', cdk.requiredValidator)(properties.validation));
    errors.collect(cdk.propertyValidator('validation', CfnVirtualGateway_VirtualGatewayTlsValidationContextPropertyValidator)(properties.validation));
    return errors.wrap('supplied properties not correct for "VirtualGatewayClientPolicyTlsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayClientPolicyTls` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayClientPolicyTlsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayClientPolicyTls` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayClientPolicyTlsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayClientPolicyTlsPropertyValidator(properties).assertSuccess();
    return {
        Certificate: cfnVirtualGatewayVirtualGatewayClientTlsCertificatePropertyToCloudFormation(properties.certificate),
        Enforce: cdk.booleanToCloudFormation(properties.enforce),
        Ports: cdk.listMapper(cdk.numberToCloudFormation)(properties.ports),
        Validation: cfnVirtualGatewayVirtualGatewayTlsValidationContextPropertyToCloudFormation(properties.validation),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayClientPolicyTlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayClientPolicyTlsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayClientPolicyTlsProperty>();
    ret.addPropertyResult('certificate', 'Certificate', properties.Certificate != null ? CfnVirtualGatewayVirtualGatewayClientTlsCertificatePropertyFromCloudFormation(properties.Certificate) : undefined);
    ret.addPropertyResult('enforce', 'Enforce', properties.Enforce != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enforce) : undefined);
    ret.addPropertyResult('ports', 'Ports', properties.Ports != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.Ports) : undefined);
    ret.addPropertyResult('validation', 'Validation', CfnVirtualGatewayVirtualGatewayTlsValidationContextPropertyFromCloudFormation(properties.Validation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents the virtual gateway's client's Transport Layer Security (TLS) certificate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclienttlscertificate.html
     */
    export interface VirtualGatewayClientTlsCertificateProperty {
        /**
         * An object that represents a local file certificate. The certificate must meet specific requirements and you must have proxy authorization enabled. For more information, see [Transport Layer Security (TLS)](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclienttlscertificate.html#cfn-appmesh-virtualgateway-virtualgatewayclienttlscertificate-file
         */
        readonly file?: CfnVirtualGateway.VirtualGatewayListenerTlsFileCertificateProperty | cdk.IResolvable;
        /**
         * A reference to an object that represents a virtual gateway's client's Secret Discovery Service certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayclienttlscertificate.html#cfn-appmesh-virtualgateway-virtualgatewayclienttlscertificate-sds
         */
        readonly sds?: CfnVirtualGateway.VirtualGatewayListenerTlsSdsCertificateProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayClientTlsCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayClientTlsCertificateProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayClientTlsCertificatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('file', CfnVirtualGateway_VirtualGatewayListenerTlsFileCertificatePropertyValidator)(properties.file));
    errors.collect(cdk.propertyValidator('sds', CfnVirtualGateway_VirtualGatewayListenerTlsSdsCertificatePropertyValidator)(properties.sds));
    return errors.wrap('supplied properties not correct for "VirtualGatewayClientTlsCertificateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayClientTlsCertificate` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayClientTlsCertificateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayClientTlsCertificate` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayClientTlsCertificatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayClientTlsCertificatePropertyValidator(properties).assertSuccess();
    return {
        File: cfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyToCloudFormation(properties.file),
        SDS: cfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyToCloudFormation(properties.sds),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayClientTlsCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayClientTlsCertificateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayClientTlsCertificateProperty>();
    ret.addPropertyResult('file', 'File', properties.File != null ? CfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyFromCloudFormation(properties.File) : undefined);
    ret.addPropertyResult('sds', 'SDS', properties.SDS != null ? CfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyFromCloudFormation(properties.SDS) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents the type of virtual gateway connection pool.
     *
     * Only one protocol is used at a time and should be the same protocol as the one chosen under port mapping.
     *
     * If not present the default value for `maxPendingRequests` is `2147483647` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayconnectionpool.html
     */
    export interface VirtualGatewayConnectionPoolProperty {
        /**
         * An object that represents a type of connection pool.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayconnectionpool.html#cfn-appmesh-virtualgateway-virtualgatewayconnectionpool-grpc
         */
        readonly grpc?: CfnVirtualGateway.VirtualGatewayGrpcConnectionPoolProperty | cdk.IResolvable;
        /**
         * An object that represents a type of connection pool.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayconnectionpool.html#cfn-appmesh-virtualgateway-virtualgatewayconnectionpool-http
         */
        readonly http?: CfnVirtualGateway.VirtualGatewayHttpConnectionPoolProperty | cdk.IResolvable;
        /**
         * An object that represents a type of connection pool.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayconnectionpool.html#cfn-appmesh-virtualgateway-virtualgatewayconnectionpool-http2
         */
        readonly http2?: CfnVirtualGateway.VirtualGatewayHttp2ConnectionPoolProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('grpc', CfnVirtualGateway_VirtualGatewayGrpcConnectionPoolPropertyValidator)(properties.grpc));
    errors.collect(cdk.propertyValidator('http', CfnVirtualGateway_VirtualGatewayHttpConnectionPoolPropertyValidator)(properties.http));
    errors.collect(cdk.propertyValidator('http2', CfnVirtualGateway_VirtualGatewayHttp2ConnectionPoolPropertyValidator)(properties.http2));
    return errors.wrap('supplied properties not correct for "VirtualGatewayConnectionPoolProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayConnectionPool` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayConnectionPoolProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayConnectionPool` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayConnectionPoolPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayConnectionPoolPropertyValidator(properties).assertSuccess();
    return {
        GRPC: cfnVirtualGatewayVirtualGatewayGrpcConnectionPoolPropertyToCloudFormation(properties.grpc),
        HTTP: cfnVirtualGatewayVirtualGatewayHttpConnectionPoolPropertyToCloudFormation(properties.http),
        HTTP2: cfnVirtualGatewayVirtualGatewayHttp2ConnectionPoolPropertyToCloudFormation(properties.http2),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayConnectionPoolProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayConnectionPoolProperty>();
    ret.addPropertyResult('grpc', 'GRPC', properties.GRPC != null ? CfnVirtualGatewayVirtualGatewayGrpcConnectionPoolPropertyFromCloudFormation(properties.GRPC) : undefined);
    ret.addPropertyResult('http', 'HTTP', properties.HTTP != null ? CfnVirtualGatewayVirtualGatewayHttpConnectionPoolPropertyFromCloudFormation(properties.HTTP) : undefined);
    ret.addPropertyResult('http2', 'HTTP2', properties.HTTP2 != null ? CfnVirtualGatewayVirtualGatewayHttp2ConnectionPoolPropertyFromCloudFormation(properties.HTTP2) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents an access log file.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayfileaccesslog.html
     */
    export interface VirtualGatewayFileAccessLogProperty {
        /**
         * The specified format for the virtual gateway access logs. It can be either `json_format` or `text_format` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayfileaccesslog.html#cfn-appmesh-virtualgateway-virtualgatewayfileaccesslog-format
         */
        readonly format?: CfnVirtualGateway.LoggingFormatProperty | cdk.IResolvable;
        /**
         * The file path to write access logs to. You can use `/dev/stdout` to send access logs to standard out and configure your Envoy container to use a log driver, such as `awslogs` , to export the access logs to a log storage service such as Amazon CloudWatch Logs. You can also specify a path in the Envoy container's file system to write the files to disk.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayfileaccesslog.html#cfn-appmesh-virtualgateway-virtualgatewayfileaccesslog-path
         */
        readonly path: string;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayFileAccessLogProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayFileAccessLogProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayFileAccessLogPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('format', CfnVirtualGateway_LoggingFormatPropertyValidator)(properties.format));
    errors.collect(cdk.propertyValidator('path', cdk.requiredValidator)(properties.path));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    return errors.wrap('supplied properties not correct for "VirtualGatewayFileAccessLogProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayFileAccessLog` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayFileAccessLogProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayFileAccessLog` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayFileAccessLogPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayFileAccessLogPropertyValidator(properties).assertSuccess();
    return {
        Format: cfnVirtualGatewayLoggingFormatPropertyToCloudFormation(properties.format),
        Path: cdk.stringToCloudFormation(properties.path),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayFileAccessLogPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayFileAccessLogProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayFileAccessLogProperty>();
    ret.addPropertyResult('format', 'Format', properties.Format != null ? CfnVirtualGatewayLoggingFormatPropertyFromCloudFormation(properties.Format) : undefined);
    ret.addPropertyResult('path', 'Path', cfn_parse.FromCloudFormation.getString(properties.Path));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a type of connection pool.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaygrpcconnectionpool.html
     */
    export interface VirtualGatewayGrpcConnectionPoolProperty {
        /**
         * Maximum number of inflight requests Envoy can concurrently support across hosts in upstream cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaygrpcconnectionpool.html#cfn-appmesh-virtualgateway-virtualgatewaygrpcconnectionpool-maxrequests
         */
        readonly maxRequests: number;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayGrpcConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayGrpcConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayGrpcConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxRequests', cdk.requiredValidator)(properties.maxRequests));
    errors.collect(cdk.propertyValidator('maxRequests', cdk.validateNumber)(properties.maxRequests));
    return errors.wrap('supplied properties not correct for "VirtualGatewayGrpcConnectionPoolProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayGrpcConnectionPool` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayGrpcConnectionPoolProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayGrpcConnectionPool` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayGrpcConnectionPoolPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayGrpcConnectionPoolPropertyValidator(properties).assertSuccess();
    return {
        MaxRequests: cdk.numberToCloudFormation(properties.maxRequests),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayGrpcConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayGrpcConnectionPoolProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayGrpcConnectionPoolProperty>();
    ret.addPropertyResult('maxRequests', 'MaxRequests', cfn_parse.FromCloudFormation.getNumber(properties.MaxRequests));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents the health check policy for a virtual gateway's listener.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html
     */
    export interface VirtualGatewayHealthCheckPolicyProperty {
        /**
         * The number of consecutive successful health checks that must occur before declaring the listener healthy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy-healthythreshold
         */
        readonly healthyThreshold: number;
        /**
         * The time period in milliseconds between each health check execution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy-intervalmillis
         */
        readonly intervalMillis: number;
        /**
         * The destination path for the health check request. This value is only used if the specified protocol is HTTP or HTTP/2. For any other protocol, this value is ignored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy-path
         */
        readonly path?: string;
        /**
         * The destination port for the health check request. This port must match the port defined in the `PortMapping` for the listener.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy-port
         */
        readonly port?: number;
        /**
         * The protocol for the health check request. If you specify `grpc` , then your service must conform to the [GRPC Health Checking Protocol](https://docs.aws.amazon.com/https://github.com/grpc/grpc/blob/master/doc/health-checking.md) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy-protocol
         */
        readonly protocol: string;
        /**
         * The amount of time to wait when receiving a response from the health check, in milliseconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy-timeoutmillis
         */
        readonly timeoutMillis: number;
        /**
         * The number of consecutive failed health checks that must occur before declaring a virtual gateway unhealthy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy.html#cfn-appmesh-virtualgateway-virtualgatewayhealthcheckpolicy-unhealthythreshold
         */
        readonly unhealthyThreshold: number;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayHealthCheckPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayHealthCheckPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayHealthCheckPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('healthyThreshold', cdk.requiredValidator)(properties.healthyThreshold));
    errors.collect(cdk.propertyValidator('healthyThreshold', cdk.validateNumber)(properties.healthyThreshold));
    errors.collect(cdk.propertyValidator('intervalMillis', cdk.requiredValidator)(properties.intervalMillis));
    errors.collect(cdk.propertyValidator('intervalMillis', cdk.validateNumber)(properties.intervalMillis));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('protocol', cdk.requiredValidator)(properties.protocol));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    errors.collect(cdk.propertyValidator('timeoutMillis', cdk.requiredValidator)(properties.timeoutMillis));
    errors.collect(cdk.propertyValidator('timeoutMillis', cdk.validateNumber)(properties.timeoutMillis));
    errors.collect(cdk.propertyValidator('unhealthyThreshold', cdk.requiredValidator)(properties.unhealthyThreshold));
    errors.collect(cdk.propertyValidator('unhealthyThreshold', cdk.validateNumber)(properties.unhealthyThreshold));
    return errors.wrap('supplied properties not correct for "VirtualGatewayHealthCheckPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayHealthCheckPolicy` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayHealthCheckPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayHealthCheckPolicy` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayHealthCheckPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayHealthCheckPolicyPropertyValidator(properties).assertSuccess();
    return {
        HealthyThreshold: cdk.numberToCloudFormation(properties.healthyThreshold),
        IntervalMillis: cdk.numberToCloudFormation(properties.intervalMillis),
        Path: cdk.stringToCloudFormation(properties.path),
        Port: cdk.numberToCloudFormation(properties.port),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
        TimeoutMillis: cdk.numberToCloudFormation(properties.timeoutMillis),
        UnhealthyThreshold: cdk.numberToCloudFormation(properties.unhealthyThreshold),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayHealthCheckPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayHealthCheckPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayHealthCheckPolicyProperty>();
    ret.addPropertyResult('healthyThreshold', 'HealthyThreshold', cfn_parse.FromCloudFormation.getNumber(properties.HealthyThreshold));
    ret.addPropertyResult('intervalMillis', 'IntervalMillis', cfn_parse.FromCloudFormation.getNumber(properties.IntervalMillis));
    ret.addPropertyResult('path', 'Path', properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('protocol', 'Protocol', cfn_parse.FromCloudFormation.getString(properties.Protocol));
    ret.addPropertyResult('timeoutMillis', 'TimeoutMillis', cfn_parse.FromCloudFormation.getNumber(properties.TimeoutMillis));
    ret.addPropertyResult('unhealthyThreshold', 'UnhealthyThreshold', cfn_parse.FromCloudFormation.getNumber(properties.UnhealthyThreshold));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a type of connection pool.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhttp2connectionpool.html
     */
    export interface VirtualGatewayHttp2ConnectionPoolProperty {
        /**
         * Maximum number of inflight requests Envoy can concurrently support across hosts in upstream cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhttp2connectionpool.html#cfn-appmesh-virtualgateway-virtualgatewayhttp2connectionpool-maxrequests
         */
        readonly maxRequests: number;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayHttp2ConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayHttp2ConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayHttp2ConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxRequests', cdk.requiredValidator)(properties.maxRequests));
    errors.collect(cdk.propertyValidator('maxRequests', cdk.validateNumber)(properties.maxRequests));
    return errors.wrap('supplied properties not correct for "VirtualGatewayHttp2ConnectionPoolProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayHttp2ConnectionPool` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayHttp2ConnectionPoolProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayHttp2ConnectionPool` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayHttp2ConnectionPoolPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayHttp2ConnectionPoolPropertyValidator(properties).assertSuccess();
    return {
        MaxRequests: cdk.numberToCloudFormation(properties.maxRequests),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayHttp2ConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayHttp2ConnectionPoolProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayHttp2ConnectionPoolProperty>();
    ret.addPropertyResult('maxRequests', 'MaxRequests', cfn_parse.FromCloudFormation.getNumber(properties.MaxRequests));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a type of connection pool.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhttpconnectionpool.html
     */
    export interface VirtualGatewayHttpConnectionPoolProperty {
        /**
         * Maximum number of outbound TCP connections Envoy can establish concurrently with all hosts in upstream cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhttpconnectionpool.html#cfn-appmesh-virtualgateway-virtualgatewayhttpconnectionpool-maxconnections
         */
        readonly maxConnections: number;
        /**
         * Number of overflowing requests after `max_connections` Envoy will queue to upstream cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayhttpconnectionpool.html#cfn-appmesh-virtualgateway-virtualgatewayhttpconnectionpool-maxpendingrequests
         */
        readonly maxPendingRequests?: number;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayHttpConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayHttpConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayHttpConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxConnections', cdk.requiredValidator)(properties.maxConnections));
    errors.collect(cdk.propertyValidator('maxConnections', cdk.validateNumber)(properties.maxConnections));
    errors.collect(cdk.propertyValidator('maxPendingRequests', cdk.validateNumber)(properties.maxPendingRequests));
    return errors.wrap('supplied properties not correct for "VirtualGatewayHttpConnectionPoolProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayHttpConnectionPool` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayHttpConnectionPoolProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayHttpConnectionPool` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayHttpConnectionPoolPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayHttpConnectionPoolPropertyValidator(properties).assertSuccess();
    return {
        MaxConnections: cdk.numberToCloudFormation(properties.maxConnections),
        MaxPendingRequests: cdk.numberToCloudFormation(properties.maxPendingRequests),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayHttpConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayHttpConnectionPoolProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayHttpConnectionPoolProperty>();
    ret.addPropertyResult('maxConnections', 'MaxConnections', cfn_parse.FromCloudFormation.getNumber(properties.MaxConnections));
    ret.addPropertyResult('maxPendingRequests', 'MaxPendingRequests', properties.MaxPendingRequests != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxPendingRequests) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a listener for a virtual gateway.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistener.html
     */
    export interface VirtualGatewayListenerProperty {
        /**
         * The connection pool information for the listener.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistener.html#cfn-appmesh-virtualgateway-virtualgatewaylistener-connectionpool
         */
        readonly connectionPool?: CfnVirtualGateway.VirtualGatewayConnectionPoolProperty | cdk.IResolvable;
        /**
         * The health check information for the listener.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistener.html#cfn-appmesh-virtualgateway-virtualgatewaylistener-healthcheck
         */
        readonly healthCheck?: CfnVirtualGateway.VirtualGatewayHealthCheckPolicyProperty | cdk.IResolvable;
        /**
         * The port mapping information for the listener.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistener.html#cfn-appmesh-virtualgateway-virtualgatewaylistener-portmapping
         */
        readonly portMapping: CfnVirtualGateway.VirtualGatewayPortMappingProperty | cdk.IResolvable;
        /**
         * A reference to an object that represents the Transport Layer Security (TLS) properties for the listener.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistener.html#cfn-appmesh-virtualgateway-virtualgatewaylistener-tls
         */
        readonly tls?: CfnVirtualGateway.VirtualGatewayListenerTlsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayListenerPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('connectionPool', CfnVirtualGateway_VirtualGatewayConnectionPoolPropertyValidator)(properties.connectionPool));
    errors.collect(cdk.propertyValidator('healthCheck', CfnVirtualGateway_VirtualGatewayHealthCheckPolicyPropertyValidator)(properties.healthCheck));
    errors.collect(cdk.propertyValidator('portMapping', cdk.requiredValidator)(properties.portMapping));
    errors.collect(cdk.propertyValidator('portMapping', CfnVirtualGateway_VirtualGatewayPortMappingPropertyValidator)(properties.portMapping));
    errors.collect(cdk.propertyValidator('tls', CfnVirtualGateway_VirtualGatewayListenerTlsPropertyValidator)(properties.tls));
    return errors.wrap('supplied properties not correct for "VirtualGatewayListenerProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListener` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListener` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayListenerPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayListenerPropertyValidator(properties).assertSuccess();
    return {
        ConnectionPool: cfnVirtualGatewayVirtualGatewayConnectionPoolPropertyToCloudFormation(properties.connectionPool),
        HealthCheck: cfnVirtualGatewayVirtualGatewayHealthCheckPolicyPropertyToCloudFormation(properties.healthCheck),
        PortMapping: cfnVirtualGatewayVirtualGatewayPortMappingPropertyToCloudFormation(properties.portMapping),
        TLS: cfnVirtualGatewayVirtualGatewayListenerTlsPropertyToCloudFormation(properties.tls),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayListenerProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerProperty>();
    ret.addPropertyResult('connectionPool', 'ConnectionPool', properties.ConnectionPool != null ? CfnVirtualGatewayVirtualGatewayConnectionPoolPropertyFromCloudFormation(properties.ConnectionPool) : undefined);
    ret.addPropertyResult('healthCheck', 'HealthCheck', properties.HealthCheck != null ? CfnVirtualGatewayVirtualGatewayHealthCheckPolicyPropertyFromCloudFormation(properties.HealthCheck) : undefined);
    ret.addPropertyResult('portMapping', 'PortMapping', CfnVirtualGatewayVirtualGatewayPortMappingPropertyFromCloudFormation(properties.PortMapping));
    ret.addPropertyResult('tls', 'TLS', properties.TLS != null ? CfnVirtualGatewayVirtualGatewayListenerTlsPropertyFromCloudFormation(properties.TLS) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents the Transport Layer Security (TLS) properties for a listener.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertls.html
     */
    export interface VirtualGatewayListenerTlsProperty {
        /**
         * An object that represents a Transport Layer Security (TLS) certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertls.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertls-certificate
         */
        readonly certificate: CfnVirtualGateway.VirtualGatewayListenerTlsCertificateProperty | cdk.IResolvable;
        /**
         * Specify one of the following modes.
         *
         * - ** STRICT – Listener only accepts connections with TLS enabled.
         * - ** PERMISSIVE – Listener accepts connections with or without TLS enabled.
         * - ** DISABLED – Listener only accepts connections without TLS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertls.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertls-mode
         */
        readonly mode: string;
        /**
         * A reference to an object that represents a virtual gateway's listener's Transport Layer Security (TLS) validation context.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertls.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertls-validation
         */
        readonly validation?: CfnVirtualGateway.VirtualGatewayListenerTlsValidationContextProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerTlsProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayListenerTlsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificate', cdk.requiredValidator)(properties.certificate));
    errors.collect(cdk.propertyValidator('certificate', CfnVirtualGateway_VirtualGatewayListenerTlsCertificatePropertyValidator)(properties.certificate));
    errors.collect(cdk.propertyValidator('mode', cdk.requiredValidator)(properties.mode));
    errors.collect(cdk.propertyValidator('mode', cdk.validateString)(properties.mode));
    errors.collect(cdk.propertyValidator('validation', CfnVirtualGateway_VirtualGatewayListenerTlsValidationContextPropertyValidator)(properties.validation));
    return errors.wrap('supplied properties not correct for "VirtualGatewayListenerTlsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListenerTls` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListenerTls` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayListenerTlsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayListenerTlsPropertyValidator(properties).assertSuccess();
    return {
        Certificate: cfnVirtualGatewayVirtualGatewayListenerTlsCertificatePropertyToCloudFormation(properties.certificate),
        Mode: cdk.stringToCloudFormation(properties.mode),
        Validation: cfnVirtualGatewayVirtualGatewayListenerTlsValidationContextPropertyToCloudFormation(properties.validation),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayListenerTlsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerTlsProperty>();
    ret.addPropertyResult('certificate', 'Certificate', CfnVirtualGatewayVirtualGatewayListenerTlsCertificatePropertyFromCloudFormation(properties.Certificate));
    ret.addPropertyResult('mode', 'Mode', cfn_parse.FromCloudFormation.getString(properties.Mode));
    ret.addPropertyResult('validation', 'Validation', properties.Validation != null ? CfnVirtualGatewayVirtualGatewayListenerTlsValidationContextPropertyFromCloudFormation(properties.Validation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents an AWS Certificate Manager certificate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsacmcertificate.html
     */
    export interface VirtualGatewayListenerTlsAcmCertificateProperty {
        /**
         * The Amazon Resource Name (ARN) for the certificate. The certificate must meet specific requirements and you must have proxy authorization enabled. For more information, see [Transport Layer Security (TLS)](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html#virtual-node-tls-prerequisites) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsacmcertificate.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlsacmcertificate-certificatearn
         */
        readonly certificateArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerTlsAcmCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsAcmCertificateProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayListenerTlsAcmCertificatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateArn', cdk.requiredValidator)(properties.certificateArn));
    errors.collect(cdk.propertyValidator('certificateArn', cdk.validateString)(properties.certificateArn));
    return errors.wrap('supplied properties not correct for "VirtualGatewayListenerTlsAcmCertificateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListenerTlsAcmCertificate` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsAcmCertificateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListenerTlsAcmCertificate` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayListenerTlsAcmCertificatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayListenerTlsAcmCertificatePropertyValidator(properties).assertSuccess();
    return {
        CertificateArn: cdk.stringToCloudFormation(properties.certificateArn),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsAcmCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayListenerTlsAcmCertificateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerTlsAcmCertificateProperty>();
    ret.addPropertyResult('certificateArn', 'CertificateArn', cfn_parse.FromCloudFormation.getString(properties.CertificateArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a listener's Transport Layer Security (TLS) certificate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlscertificate.html
     */
    export interface VirtualGatewayListenerTlsCertificateProperty {
        /**
         * A reference to an object that represents an AWS Certificate Manager certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlscertificate.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlscertificate-acm
         */
        readonly acm?: CfnVirtualGateway.VirtualGatewayListenerTlsAcmCertificateProperty | cdk.IResolvable;
        /**
         * A reference to an object that represents a local file certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlscertificate.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlscertificate-file
         */
        readonly file?: CfnVirtualGateway.VirtualGatewayListenerTlsFileCertificateProperty | cdk.IResolvable;
        /**
         * A reference to an object that represents a virtual gateway's listener's Secret Discovery Service certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlscertificate.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlscertificate-sds
         */
        readonly sds?: CfnVirtualGateway.VirtualGatewayListenerTlsSdsCertificateProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerTlsCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsCertificateProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayListenerTlsCertificatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acm', CfnVirtualGateway_VirtualGatewayListenerTlsAcmCertificatePropertyValidator)(properties.acm));
    errors.collect(cdk.propertyValidator('file', CfnVirtualGateway_VirtualGatewayListenerTlsFileCertificatePropertyValidator)(properties.file));
    errors.collect(cdk.propertyValidator('sds', CfnVirtualGateway_VirtualGatewayListenerTlsSdsCertificatePropertyValidator)(properties.sds));
    return errors.wrap('supplied properties not correct for "VirtualGatewayListenerTlsCertificateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListenerTlsCertificate` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsCertificateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListenerTlsCertificate` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayListenerTlsCertificatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayListenerTlsCertificatePropertyValidator(properties).assertSuccess();
    return {
        ACM: cfnVirtualGatewayVirtualGatewayListenerTlsAcmCertificatePropertyToCloudFormation(properties.acm),
        File: cfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyToCloudFormation(properties.file),
        SDS: cfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyToCloudFormation(properties.sds),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayListenerTlsCertificateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerTlsCertificateProperty>();
    ret.addPropertyResult('acm', 'ACM', properties.ACM != null ? CfnVirtualGatewayVirtualGatewayListenerTlsAcmCertificatePropertyFromCloudFormation(properties.ACM) : undefined);
    ret.addPropertyResult('file', 'File', properties.File != null ? CfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyFromCloudFormation(properties.File) : undefined);
    ret.addPropertyResult('sds', 'SDS', properties.SDS != null ? CfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyFromCloudFormation(properties.SDS) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a local file certificate. The certificate must meet specific requirements and you must have proxy authorization enabled. For more information, see [Transport Layer Security (TLS)](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html#virtual-node-tls-prerequisites) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsfilecertificate.html
     */
    export interface VirtualGatewayListenerTlsFileCertificateProperty {
        /**
         * The certificate chain for the certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsfilecertificate.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlsfilecertificate-certificatechain
         */
        readonly certificateChain: string;
        /**
         * The private key for a certificate stored on the file system of the mesh endpoint that the proxy is running on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsfilecertificate.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlsfilecertificate-privatekey
         */
        readonly privateKey: string;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerTlsFileCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsFileCertificateProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayListenerTlsFileCertificatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateChain', cdk.requiredValidator)(properties.certificateChain));
    errors.collect(cdk.propertyValidator('certificateChain', cdk.validateString)(properties.certificateChain));
    errors.collect(cdk.propertyValidator('privateKey', cdk.requiredValidator)(properties.privateKey));
    errors.collect(cdk.propertyValidator('privateKey', cdk.validateString)(properties.privateKey));
    return errors.wrap('supplied properties not correct for "VirtualGatewayListenerTlsFileCertificateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListenerTlsFileCertificate` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsFileCertificateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListenerTlsFileCertificate` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayListenerTlsFileCertificatePropertyValidator(properties).assertSuccess();
    return {
        CertificateChain: cdk.stringToCloudFormation(properties.certificateChain),
        PrivateKey: cdk.stringToCloudFormation(properties.privateKey),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsFileCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayListenerTlsFileCertificateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerTlsFileCertificateProperty>();
    ret.addPropertyResult('certificateChain', 'CertificateChain', cfn_parse.FromCloudFormation.getString(properties.CertificateChain));
    ret.addPropertyResult('privateKey', 'PrivateKey', cfn_parse.FromCloudFormation.getString(properties.PrivateKey));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents the virtual gateway's listener's Secret Discovery Service certificate.The proxy must be configured with a local SDS provider via a Unix Domain Socket. See App Mesh [TLS documentation](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html) for more info.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlssdscertificate.html
     */
    export interface VirtualGatewayListenerTlsSdsCertificateProperty {
        /**
         * A reference to an object that represents the name of the secret secret requested from the Secret Discovery Service provider representing Transport Layer Security (TLS) materials like a certificate or certificate chain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlssdscertificate.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlssdscertificate-secretname
         */
        readonly secretName: string;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerTlsSdsCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsSdsCertificateProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayListenerTlsSdsCertificatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('secretName', cdk.requiredValidator)(properties.secretName));
    errors.collect(cdk.propertyValidator('secretName', cdk.validateString)(properties.secretName));
    return errors.wrap('supplied properties not correct for "VirtualGatewayListenerTlsSdsCertificateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListenerTlsSdsCertificate` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsSdsCertificateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListenerTlsSdsCertificate` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayListenerTlsSdsCertificatePropertyValidator(properties).assertSuccess();
    return {
        SecretName: cdk.stringToCloudFormation(properties.secretName),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsSdsCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayListenerTlsSdsCertificateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerTlsSdsCertificateProperty>();
    ret.addPropertyResult('secretName', 'SecretName', cfn_parse.FromCloudFormation.getString(properties.SecretName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a virtual gateway's listener's Transport Layer Security (TLS) validation context.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontext.html
     */
    export interface VirtualGatewayListenerTlsValidationContextProperty {
        /**
         * A reference to an object that represents the SANs for a virtual gateway listener's Transport Layer Security (TLS) validation context.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontext.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontext-subjectalternativenames
         */
        readonly subjectAlternativeNames?: CfnVirtualGateway.SubjectAlternativeNamesProperty | cdk.IResolvable;
        /**
         * A reference to where to retrieve the trust chain when validating a peer’s Transport Layer Security (TLS) certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontext.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontext-trust
         */
        readonly trust: CfnVirtualGateway.VirtualGatewayListenerTlsValidationContextTrustProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerTlsValidationContextProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsValidationContextProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayListenerTlsValidationContextPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('subjectAlternativeNames', CfnVirtualGateway_SubjectAlternativeNamesPropertyValidator)(properties.subjectAlternativeNames));
    errors.collect(cdk.propertyValidator('trust', cdk.requiredValidator)(properties.trust));
    errors.collect(cdk.propertyValidator('trust', CfnVirtualGateway_VirtualGatewayListenerTlsValidationContextTrustPropertyValidator)(properties.trust));
    return errors.wrap('supplied properties not correct for "VirtualGatewayListenerTlsValidationContextProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListenerTlsValidationContext` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsValidationContextProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListenerTlsValidationContext` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayListenerTlsValidationContextPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayListenerTlsValidationContextPropertyValidator(properties).assertSuccess();
    return {
        SubjectAlternativeNames: cfnVirtualGatewaySubjectAlternativeNamesPropertyToCloudFormation(properties.subjectAlternativeNames),
        Trust: cfnVirtualGatewayVirtualGatewayListenerTlsValidationContextTrustPropertyToCloudFormation(properties.trust),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsValidationContextPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayListenerTlsValidationContextProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerTlsValidationContextProperty>();
    ret.addPropertyResult('subjectAlternativeNames', 'SubjectAlternativeNames', properties.SubjectAlternativeNames != null ? CfnVirtualGatewaySubjectAlternativeNamesPropertyFromCloudFormation(properties.SubjectAlternativeNames) : undefined);
    ret.addPropertyResult('trust', 'Trust', CfnVirtualGatewayVirtualGatewayListenerTlsValidationContextTrustPropertyFromCloudFormation(properties.Trust));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a virtual gateway's listener's Transport Layer Security (TLS) validation context trust.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontexttrust.html
     */
    export interface VirtualGatewayListenerTlsValidationContextTrustProperty {
        /**
         * An object that represents a Transport Layer Security (TLS) validation context trust for a local file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontexttrust.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontexttrust-file
         */
        readonly file?: CfnVirtualGateway.VirtualGatewayTlsValidationContextFileTrustProperty | cdk.IResolvable;
        /**
         * A reference to an object that represents a virtual gateway's listener's Transport Layer Security (TLS) Secret Discovery Service validation context trust.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontexttrust.html#cfn-appmesh-virtualgateway-virtualgatewaylistenertlsvalidationcontexttrust-sds
         */
        readonly sds?: CfnVirtualGateway.VirtualGatewayTlsValidationContextSdsTrustProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayListenerTlsValidationContextTrustProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsValidationContextTrustProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayListenerTlsValidationContextTrustPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('file', CfnVirtualGateway_VirtualGatewayTlsValidationContextFileTrustPropertyValidator)(properties.file));
    errors.collect(cdk.propertyValidator('sds', CfnVirtualGateway_VirtualGatewayTlsValidationContextSdsTrustPropertyValidator)(properties.sds));
    return errors.wrap('supplied properties not correct for "VirtualGatewayListenerTlsValidationContextTrustProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListenerTlsValidationContextTrust` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayListenerTlsValidationContextTrustProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayListenerTlsValidationContextTrust` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayListenerTlsValidationContextTrustPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayListenerTlsValidationContextTrustPropertyValidator(properties).assertSuccess();
    return {
        File: cfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyToCloudFormation(properties.file),
        SDS: cfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyToCloudFormation(properties.sds),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayListenerTlsValidationContextTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayListenerTlsValidationContextTrustProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayListenerTlsValidationContextTrustProperty>();
    ret.addPropertyResult('file', 'File', properties.File != null ? CfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyFromCloudFormation(properties.File) : undefined);
    ret.addPropertyResult('sds', 'SDS', properties.SDS != null ? CfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyFromCloudFormation(properties.SDS) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents logging information.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylogging.html
     */
    export interface VirtualGatewayLoggingProperty {
        /**
         * The access log configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaylogging.html#cfn-appmesh-virtualgateway-virtualgatewaylogging-accesslog
         */
        readonly accessLog?: CfnVirtualGateway.VirtualGatewayAccessLogProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayLoggingProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayLoggingProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayLoggingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessLog', CfnVirtualGateway_VirtualGatewayAccessLogPropertyValidator)(properties.accessLog));
    return errors.wrap('supplied properties not correct for "VirtualGatewayLoggingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayLogging` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayLoggingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayLogging` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayLoggingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayLoggingPropertyValidator(properties).assertSuccess();
    return {
        AccessLog: cfnVirtualGatewayVirtualGatewayAccessLogPropertyToCloudFormation(properties.accessLog),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayLoggingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayLoggingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayLoggingProperty>();
    ret.addPropertyResult('accessLog', 'AccessLog', properties.AccessLog != null ? CfnVirtualGatewayVirtualGatewayAccessLogPropertyFromCloudFormation(properties.AccessLog) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a port mapping.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayportmapping.html
     */
    export interface VirtualGatewayPortMappingProperty {
        /**
         * The port used for the port mapping. Specify one protocol.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayportmapping.html#cfn-appmesh-virtualgateway-virtualgatewayportmapping-port
         */
        readonly port: number;
        /**
         * The protocol used for the port mapping.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayportmapping.html#cfn-appmesh-virtualgateway-virtualgatewayportmapping-protocol
         */
        readonly protocol: string;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayPortMappingProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayPortMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayPortMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('port', cdk.requiredValidator)(properties.port));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('protocol', cdk.requiredValidator)(properties.protocol));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    return errors.wrap('supplied properties not correct for "VirtualGatewayPortMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayPortMapping` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayPortMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayPortMapping` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayPortMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayPortMappingPropertyValidator(properties).assertSuccess();
    return {
        Port: cdk.numberToCloudFormation(properties.port),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayPortMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayPortMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayPortMappingProperty>();
    ret.addPropertyResult('port', 'Port', cfn_parse.FromCloudFormation.getNumber(properties.Port));
    ret.addPropertyResult('protocol', 'Protocol', cfn_parse.FromCloudFormation.getString(properties.Protocol));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents the specification of a service mesh resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayspec.html
     */
    export interface VirtualGatewaySpecProperty {
        /**
         * A reference to an object that represents the defaults for backends.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayspec.html#cfn-appmesh-virtualgateway-virtualgatewayspec-backenddefaults
         */
        readonly backendDefaults?: CfnVirtualGateway.VirtualGatewayBackendDefaultsProperty | cdk.IResolvable;
        /**
         * The listeners that the mesh endpoint is expected to receive inbound traffic from. You can specify one listener.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayspec.html#cfn-appmesh-virtualgateway-virtualgatewayspec-listeners
         */
        readonly listeners: Array<CfnVirtualGateway.VirtualGatewayListenerProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * An object that represents logging information.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewayspec.html#cfn-appmesh-virtualgateway-virtualgatewayspec-logging
         */
        readonly logging?: CfnVirtualGateway.VirtualGatewayLoggingProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewaySpecProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewaySpecProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewaySpecPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('backendDefaults', CfnVirtualGateway_VirtualGatewayBackendDefaultsPropertyValidator)(properties.backendDefaults));
    errors.collect(cdk.propertyValidator('listeners', cdk.requiredValidator)(properties.listeners));
    errors.collect(cdk.propertyValidator('listeners', cdk.listValidator(CfnVirtualGateway_VirtualGatewayListenerPropertyValidator))(properties.listeners));
    errors.collect(cdk.propertyValidator('logging', CfnVirtualGateway_VirtualGatewayLoggingPropertyValidator)(properties.logging));
    return errors.wrap('supplied properties not correct for "VirtualGatewaySpecProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewaySpec` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewaySpecProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewaySpec` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewaySpecPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewaySpecPropertyValidator(properties).assertSuccess();
    return {
        BackendDefaults: cfnVirtualGatewayVirtualGatewayBackendDefaultsPropertyToCloudFormation(properties.backendDefaults),
        Listeners: cdk.listMapper(cfnVirtualGatewayVirtualGatewayListenerPropertyToCloudFormation)(properties.listeners),
        Logging: cfnVirtualGatewayVirtualGatewayLoggingPropertyToCloudFormation(properties.logging),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewaySpecPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewaySpecProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewaySpecProperty>();
    ret.addPropertyResult('backendDefaults', 'BackendDefaults', properties.BackendDefaults != null ? CfnVirtualGatewayVirtualGatewayBackendDefaultsPropertyFromCloudFormation(properties.BackendDefaults) : undefined);
    ret.addPropertyResult('listeners', 'Listeners', cfn_parse.FromCloudFormation.getArray(CfnVirtualGatewayVirtualGatewayListenerPropertyFromCloudFormation)(properties.Listeners));
    ret.addPropertyResult('logging', 'Logging', properties.Logging != null ? CfnVirtualGatewayVirtualGatewayLoggingPropertyFromCloudFormation(properties.Logging) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a Transport Layer Security (TLS) validation context.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontext.html
     */
    export interface VirtualGatewayTlsValidationContextProperty {
        /**
         * A reference to an object that represents the SANs for a virtual gateway's listener's Transport Layer Security (TLS) validation context.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontext.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontext-subjectalternativenames
         */
        readonly subjectAlternativeNames?: CfnVirtualGateway.SubjectAlternativeNamesProperty | cdk.IResolvable;
        /**
         * A reference to where to retrieve the trust chain when validating a peer’s Transport Layer Security (TLS) certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontext.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontext-trust
         */
        readonly trust: CfnVirtualGateway.VirtualGatewayTlsValidationContextTrustProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayTlsValidationContextProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayTlsValidationContextProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayTlsValidationContextPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('subjectAlternativeNames', CfnVirtualGateway_SubjectAlternativeNamesPropertyValidator)(properties.subjectAlternativeNames));
    errors.collect(cdk.propertyValidator('trust', cdk.requiredValidator)(properties.trust));
    errors.collect(cdk.propertyValidator('trust', CfnVirtualGateway_VirtualGatewayTlsValidationContextTrustPropertyValidator)(properties.trust));
    return errors.wrap('supplied properties not correct for "VirtualGatewayTlsValidationContextProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayTlsValidationContext` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayTlsValidationContextProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayTlsValidationContext` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayTlsValidationContextPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayTlsValidationContextPropertyValidator(properties).assertSuccess();
    return {
        SubjectAlternativeNames: cfnVirtualGatewaySubjectAlternativeNamesPropertyToCloudFormation(properties.subjectAlternativeNames),
        Trust: cfnVirtualGatewayVirtualGatewayTlsValidationContextTrustPropertyToCloudFormation(properties.trust),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayTlsValidationContextPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayTlsValidationContextProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayTlsValidationContextProperty>();
    ret.addPropertyResult('subjectAlternativeNames', 'SubjectAlternativeNames', properties.SubjectAlternativeNames != null ? CfnVirtualGatewaySubjectAlternativeNamesPropertyFromCloudFormation(properties.SubjectAlternativeNames) : undefined);
    ret.addPropertyResult('trust', 'Trust', CfnVirtualGatewayVirtualGatewayTlsValidationContextTrustPropertyFromCloudFormation(properties.Trust));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a Transport Layer Security (TLS) validation context trust for an AWS Certificate Manager certificate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextacmtrust.html
     */
    export interface VirtualGatewayTlsValidationContextAcmTrustProperty {
        /**
         * One or more ACM Amazon Resource Name (ARN)s.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextacmtrust.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextacmtrust-certificateauthorityarns
         */
        readonly certificateAuthorityArns: string[];
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayTlsValidationContextAcmTrustProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayTlsValidationContextAcmTrustProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayTlsValidationContextAcmTrustPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateAuthorityArns', cdk.requiredValidator)(properties.certificateAuthorityArns));
    errors.collect(cdk.propertyValidator('certificateAuthorityArns', cdk.listValidator(cdk.validateString))(properties.certificateAuthorityArns));
    return errors.wrap('supplied properties not correct for "VirtualGatewayTlsValidationContextAcmTrustProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayTlsValidationContextAcmTrust` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayTlsValidationContextAcmTrustProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayTlsValidationContextAcmTrust` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayTlsValidationContextAcmTrustPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayTlsValidationContextAcmTrustPropertyValidator(properties).assertSuccess();
    return {
        CertificateAuthorityArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.certificateAuthorityArns),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayTlsValidationContextAcmTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayTlsValidationContextAcmTrustProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayTlsValidationContextAcmTrustProperty>();
    ret.addPropertyResult('certificateAuthorityArns', 'CertificateAuthorityArns', cfn_parse.FromCloudFormation.getStringArray(properties.CertificateAuthorityArns));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a Transport Layer Security (TLS) validation context trust for a local file.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextfiletrust.html
     */
    export interface VirtualGatewayTlsValidationContextFileTrustProperty {
        /**
         * The certificate trust chain for a certificate stored on the file system of the virtual node that the proxy is running on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextfiletrust.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextfiletrust-certificatechain
         */
        readonly certificateChain: string;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayTlsValidationContextFileTrustProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayTlsValidationContextFileTrustProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayTlsValidationContextFileTrustPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateChain', cdk.requiredValidator)(properties.certificateChain));
    errors.collect(cdk.propertyValidator('certificateChain', cdk.validateString)(properties.certificateChain));
    return errors.wrap('supplied properties not correct for "VirtualGatewayTlsValidationContextFileTrustProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayTlsValidationContextFileTrust` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayTlsValidationContextFileTrustProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayTlsValidationContextFileTrust` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayTlsValidationContextFileTrustPropertyValidator(properties).assertSuccess();
    return {
        CertificateChain: cdk.stringToCloudFormation(properties.certificateChain),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayTlsValidationContextFileTrustProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayTlsValidationContextFileTrustProperty>();
    ret.addPropertyResult('certificateChain', 'CertificateChain', cfn_parse.FromCloudFormation.getString(properties.CertificateChain));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a virtual gateway's listener's Transport Layer Security (TLS) Secret Discovery Service validation context trust. The proxy must be configured with a local SDS provider via a Unix Domain Socket. See App Mesh [TLS documentation](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html) for more info.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextsdstrust.html
     */
    export interface VirtualGatewayTlsValidationContextSdsTrustProperty {
        /**
         * A reference to an object that represents the name of the secret for a virtual gateway's Transport Layer Security (TLS) Secret Discovery Service validation context trust.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextsdstrust.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontextsdstrust-secretname
         */
        readonly secretName: string;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayTlsValidationContextSdsTrustProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayTlsValidationContextSdsTrustProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayTlsValidationContextSdsTrustPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('secretName', cdk.requiredValidator)(properties.secretName));
    errors.collect(cdk.propertyValidator('secretName', cdk.validateString)(properties.secretName));
    return errors.wrap('supplied properties not correct for "VirtualGatewayTlsValidationContextSdsTrustProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayTlsValidationContextSdsTrust` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayTlsValidationContextSdsTrustProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayTlsValidationContextSdsTrust` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayTlsValidationContextSdsTrustPropertyValidator(properties).assertSuccess();
    return {
        SecretName: cdk.stringToCloudFormation(properties.secretName),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayTlsValidationContextSdsTrustProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayTlsValidationContextSdsTrustProperty>();
    ret.addPropertyResult('secretName', 'SecretName', cfn_parse.FromCloudFormation.getString(properties.SecretName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualGateway {
    /**
     * An object that represents a Transport Layer Security (TLS) validation context trust.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontexttrust.html
     */
    export interface VirtualGatewayTlsValidationContextTrustProperty {
        /**
         * A reference to an object that represents a Transport Layer Security (TLS) validation context trust for an AWS Certificate Manager certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontexttrust.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontexttrust-acm
         */
        readonly acm?: CfnVirtualGateway.VirtualGatewayTlsValidationContextAcmTrustProperty | cdk.IResolvable;
        /**
         * An object that represents a Transport Layer Security (TLS) validation context trust for a local file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontexttrust.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontexttrust-file
         */
        readonly file?: CfnVirtualGateway.VirtualGatewayTlsValidationContextFileTrustProperty | cdk.IResolvable;
        /**
         * A reference to an object that represents a virtual gateway's Transport Layer Security (TLS) Secret Discovery Service validation context trust.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualgateway-virtualgatewaytlsvalidationcontexttrust.html#cfn-appmesh-virtualgateway-virtualgatewaytlsvalidationcontexttrust-sds
         */
        readonly sds?: CfnVirtualGateway.VirtualGatewayTlsValidationContextSdsTrustProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualGatewayTlsValidationContextTrustProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayTlsValidationContextTrustProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualGateway_VirtualGatewayTlsValidationContextTrustPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acm', CfnVirtualGateway_VirtualGatewayTlsValidationContextAcmTrustPropertyValidator)(properties.acm));
    errors.collect(cdk.propertyValidator('file', CfnVirtualGateway_VirtualGatewayTlsValidationContextFileTrustPropertyValidator)(properties.file));
    errors.collect(cdk.propertyValidator('sds', CfnVirtualGateway_VirtualGatewayTlsValidationContextSdsTrustPropertyValidator)(properties.sds));
    return errors.wrap('supplied properties not correct for "VirtualGatewayTlsValidationContextTrustProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayTlsValidationContextTrust` resource
 *
 * @param properties - the TypeScript properties of a `VirtualGatewayTlsValidationContextTrustProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualGateway.VirtualGatewayTlsValidationContextTrust` resource.
 */
// @ts-ignore TS6133
function cfnVirtualGatewayVirtualGatewayTlsValidationContextTrustPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualGateway_VirtualGatewayTlsValidationContextTrustPropertyValidator(properties).assertSuccess();
    return {
        ACM: cfnVirtualGatewayVirtualGatewayTlsValidationContextAcmTrustPropertyToCloudFormation(properties.acm),
        File: cfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyToCloudFormation(properties.file),
        SDS: cfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyToCloudFormation(properties.sds),
    };
}

// @ts-ignore TS6133
function CfnVirtualGatewayVirtualGatewayTlsValidationContextTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualGateway.VirtualGatewayTlsValidationContextTrustProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualGateway.VirtualGatewayTlsValidationContextTrustProperty>();
    ret.addPropertyResult('acm', 'ACM', properties.ACM != null ? CfnVirtualGatewayVirtualGatewayTlsValidationContextAcmTrustPropertyFromCloudFormation(properties.ACM) : undefined);
    ret.addPropertyResult('file', 'File', properties.File != null ? CfnVirtualGatewayVirtualGatewayTlsValidationContextFileTrustPropertyFromCloudFormation(properties.File) : undefined);
    ret.addPropertyResult('sds', 'SDS', properties.SDS != null ? CfnVirtualGatewayVirtualGatewayTlsValidationContextSdsTrustPropertyFromCloudFormation(properties.SDS) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnVirtualNode`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html
 */
export interface CfnVirtualNodeProps {

    /**
     * The name of the service mesh to create the virtual node in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html#cfn-appmesh-virtualnode-meshname
     */
    readonly meshName: string;

    /**
     * The virtual node specification to apply.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html#cfn-appmesh-virtualnode-spec
     */
    readonly spec: CfnVirtualNode.VirtualNodeSpecProperty | cdk.IResolvable;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then the account that you specify must share the mesh with your account before you can create the resource in the service mesh. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html#cfn-appmesh-virtualnode-meshowner
     */
    readonly meshOwner?: string;

    /**
     * Optional metadata that you can apply to the virtual node to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html#cfn-appmesh-virtualnode-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The name to use for the virtual node.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html#cfn-appmesh-virtualnode-virtualnodename
     */
    readonly virtualNodeName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnVirtualNodeProps`
 *
 * @param properties - the TypeScript properties of a `CfnVirtualNodeProps`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNodePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('meshName', cdk.requiredValidator)(properties.meshName));
    errors.collect(cdk.propertyValidator('meshName', cdk.validateString)(properties.meshName));
    errors.collect(cdk.propertyValidator('meshOwner', cdk.validateString)(properties.meshOwner));
    errors.collect(cdk.propertyValidator('spec', cdk.requiredValidator)(properties.spec));
    errors.collect(cdk.propertyValidator('spec', CfnVirtualNode_VirtualNodeSpecPropertyValidator)(properties.spec));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('virtualNodeName', cdk.validateString)(properties.virtualNodeName));
    return errors.wrap('supplied properties not correct for "CfnVirtualNodeProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode` resource
 *
 * @param properties - the TypeScript properties of a `CfnVirtualNodeProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNodePropsValidator(properties).assertSuccess();
    return {
        MeshName: cdk.stringToCloudFormation(properties.meshName),
        Spec: cfnVirtualNodeVirtualNodeSpecPropertyToCloudFormation(properties.spec),
        MeshOwner: cdk.stringToCloudFormation(properties.meshOwner),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VirtualNodeName: cdk.stringToCloudFormation(properties.virtualNodeName),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNodeProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNodeProps>();
    ret.addPropertyResult('meshName', 'MeshName', cfn_parse.FromCloudFormation.getString(properties.MeshName));
    ret.addPropertyResult('spec', 'Spec', CfnVirtualNodeVirtualNodeSpecPropertyFromCloudFormation(properties.Spec));
    ret.addPropertyResult('meshOwner', 'MeshOwner', properties.MeshOwner != null ? cfn_parse.FromCloudFormation.getString(properties.MeshOwner) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('virtualNodeName', 'VirtualNodeName', properties.VirtualNodeName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualNodeName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppMesh::VirtualNode`
 *
 * Creates a virtual node within a service mesh.
 *
 * A virtual node acts as a logical pointer to a particular task group, such as an Amazon ECS service or a Kubernetes deployment. When you create a virtual node, you can specify the service discovery information for your task group, and whether the proxy running in a task group will communicate with other proxies using Transport Layer Security (TLS).
 *
 * You define a `listener` for any inbound traffic that your virtual node expects. Any virtual service that your virtual node expects to communicate to is specified as a `backend` .
 *
 * The response metadata for your new virtual node contains the `arn` that is associated with the virtual node. Set this value to the full ARN; for example, `arn:aws:appmesh:us-west-2:123456789012:myMesh/default/virtualNode/myApp` ) as the `APPMESH_RESOURCE_ARN` environment variable for your task group's Envoy proxy container in your task definition or pod spec. This is then mapped to the `node.id` and `node.cluster` Envoy parameters.
 *
 * > By default, App Mesh uses the name of the resource you specified in `APPMESH_RESOURCE_ARN` when Envoy is referring to itself in metrics and traces. You can override this behavior by setting the `APPMESH_RESOURCE_CLUSTER` environment variable with your own name.
 *
 * For more information about virtual nodes, see [Virtual nodes](https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_nodes.html) . You must be using `1.15.0` or later of the Envoy image when setting these variables. For more information about App Mesh Envoy variables, see [Envoy image](https://docs.aws.amazon.com/app-mesh/latest/userguide/envoy.html) in the AWS App Mesh User Guide.
 *
 * @cloudformationResource AWS::AppMesh::VirtualNode
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html
 */
export class CfnVirtualNode extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppMesh::VirtualNode";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVirtualNode {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnVirtualNodePropsFromCloudFormation(resourceProperties);
        const ret = new CfnVirtualNode(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The full Amazon Resource Name (ARN) for the virtual node.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the service mesh that the virtual node resides in.
     * @cloudformationAttribute MeshName
     */
    public readonly attrMeshName: string;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     * @cloudformationAttribute MeshOwner
     */
    public readonly attrMeshOwner: string;

    /**
     * The AWS IAM account ID of the resource owner. If the account ID is not your own, then it's the ID of the mesh owner or of another account that the mesh is shared with. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     * @cloudformationAttribute ResourceOwner
     */
    public readonly attrResourceOwner: string;

    /**
     * The unique identifier for the virtual node.
     * @cloudformationAttribute Uid
     */
    public readonly attrUid: string;

    /**
     * The name of the virtual node.
     * @cloudformationAttribute VirtualNodeName
     */
    public readonly attrVirtualNodeName: string;

    /**
     * The name of the service mesh to create the virtual node in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html#cfn-appmesh-virtualnode-meshname
     */
    public meshName: string;

    /**
     * The virtual node specification to apply.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html#cfn-appmesh-virtualnode-spec
     */
    public spec: CfnVirtualNode.VirtualNodeSpecProperty | cdk.IResolvable;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then the account that you specify must share the mesh with your account before you can create the resource in the service mesh. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html#cfn-appmesh-virtualnode-meshowner
     */
    public meshOwner: string | undefined;

    /**
     * Optional metadata that you can apply to the virtual node to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html#cfn-appmesh-virtualnode-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The name to use for the virtual node.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualnode.html#cfn-appmesh-virtualnode-virtualnodename
     */
    public virtualNodeName: string | undefined;

    /**
     * Create a new `AWS::AppMesh::VirtualNode`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnVirtualNodeProps) {
        super(scope, id, { type: CfnVirtualNode.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'meshName', this);
        cdk.requireProperty(props, 'spec', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrMeshName = cdk.Token.asString(this.getAtt('MeshName', cdk.ResolutionTypeHint.STRING));
        this.attrMeshOwner = cdk.Token.asString(this.getAtt('MeshOwner', cdk.ResolutionTypeHint.STRING));
        this.attrResourceOwner = cdk.Token.asString(this.getAtt('ResourceOwner', cdk.ResolutionTypeHint.STRING));
        this.attrUid = cdk.Token.asString(this.getAtt('Uid', cdk.ResolutionTypeHint.STRING));
        this.attrVirtualNodeName = cdk.Token.asString(this.getAtt('VirtualNodeName', cdk.ResolutionTypeHint.STRING));

        this.meshName = props.meshName;
        this.spec = props.spec;
        this.meshOwner = props.meshOwner;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppMesh::VirtualNode", props.tags, { tagPropertyName: 'tags' });
        this.virtualNodeName = props.virtualNodeName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnVirtualNode.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            meshName: this.meshName,
            spec: this.spec,
            meshOwner: this.meshOwner,
            tags: this.tags.renderTags(),
            virtualNodeName: this.virtualNodeName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnVirtualNodePropsToCloudFormation(props);
    }
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the access logging information for a virtual node.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-accesslog.html
     */
    export interface AccessLogProperty {
        /**
         * The file object to send virtual node access logs to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-accesslog.html#cfn-appmesh-virtualnode-accesslog-file
         */
        readonly file?: CfnVirtualNode.FileAccessLogProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AccessLogProperty`
 *
 * @param properties - the TypeScript properties of a `AccessLogProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_AccessLogPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('file', CfnVirtualNode_FileAccessLogPropertyValidator)(properties.file));
    return errors.wrap('supplied properties not correct for "AccessLogProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.AccessLog` resource
 *
 * @param properties - the TypeScript properties of a `AccessLogProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.AccessLog` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeAccessLogPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_AccessLogPropertyValidator(properties).assertSuccess();
    return {
        File: cfnVirtualNodeFileAccessLogPropertyToCloudFormation(properties.file),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeAccessLogPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.AccessLogProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.AccessLogProperty>();
    ret.addPropertyResult('file', 'File', properties.File != null ? CfnVirtualNodeFileAccessLogPropertyFromCloudFormation(properties.File) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the AWS Cloud Map attribute information for your virtual node.
     *
     * > AWS Cloud Map is not available in the eu-south-1 Region.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapinstanceattribute.html
     */
    export interface AwsCloudMapInstanceAttributeProperty {
        /**
         * The name of an AWS Cloud Map service instance attribute key. Any AWS Cloud Map service instance that contains the specified key and value is returned.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapinstanceattribute.html#cfn-appmesh-virtualnode-awscloudmapinstanceattribute-key
         */
        readonly key: string;
        /**
         * The value of an AWS Cloud Map service instance attribute key. Any AWS Cloud Map service instance that contains the specified key and value is returned.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapinstanceattribute.html#cfn-appmesh-virtualnode-awscloudmapinstanceattribute-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `AwsCloudMapInstanceAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `AwsCloudMapInstanceAttributeProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_AwsCloudMapInstanceAttributePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "AwsCloudMapInstanceAttributeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.AwsCloudMapInstanceAttribute` resource
 *
 * @param properties - the TypeScript properties of a `AwsCloudMapInstanceAttributeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.AwsCloudMapInstanceAttribute` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeAwsCloudMapInstanceAttributePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_AwsCloudMapInstanceAttributePropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeAwsCloudMapInstanceAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.AwsCloudMapInstanceAttributeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.AwsCloudMapInstanceAttributeProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the AWS Cloud Map service discovery information for your virtual node.
     *
     * > AWS Cloud Map is not available in the eu-south-1 Region.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapservicediscovery.html
     */
    export interface AwsCloudMapServiceDiscoveryProperty {
        /**
         * A string map that contains attributes with values that you can use to filter instances by any custom attribute that you specified when you registered the instance. Only instances that match all of the specified key/value pairs will be returned.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapservicediscovery.html#cfn-appmesh-virtualnode-awscloudmapservicediscovery-attributes
         */
        readonly attributes?: Array<CfnVirtualNode.AwsCloudMapInstanceAttributeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The preferred IP version that this virtual node uses. Setting the IP preference on the virtual node only overrides the IP preference set for the mesh on this specific node.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapservicediscovery.html#cfn-appmesh-virtualnode-awscloudmapservicediscovery-ippreference
         */
        readonly ipPreference?: string;
        /**
         * The name of the AWS Cloud Map namespace to use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapservicediscovery.html#cfn-appmesh-virtualnode-awscloudmapservicediscovery-namespacename
         */
        readonly namespaceName: string;
        /**
         * The name of the AWS Cloud Map service to use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-awscloudmapservicediscovery.html#cfn-appmesh-virtualnode-awscloudmapservicediscovery-servicename
         */
        readonly serviceName: string;
    }
}

/**
 * Determine whether the given properties match those of a `AwsCloudMapServiceDiscoveryProperty`
 *
 * @param properties - the TypeScript properties of a `AwsCloudMapServiceDiscoveryProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_AwsCloudMapServiceDiscoveryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributes', cdk.listValidator(CfnVirtualNode_AwsCloudMapInstanceAttributePropertyValidator))(properties.attributes));
    errors.collect(cdk.propertyValidator('ipPreference', cdk.validateString)(properties.ipPreference));
    errors.collect(cdk.propertyValidator('namespaceName', cdk.requiredValidator)(properties.namespaceName));
    errors.collect(cdk.propertyValidator('namespaceName', cdk.validateString)(properties.namespaceName));
    errors.collect(cdk.propertyValidator('serviceName', cdk.requiredValidator)(properties.serviceName));
    errors.collect(cdk.propertyValidator('serviceName', cdk.validateString)(properties.serviceName));
    return errors.wrap('supplied properties not correct for "AwsCloudMapServiceDiscoveryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.AwsCloudMapServiceDiscovery` resource
 *
 * @param properties - the TypeScript properties of a `AwsCloudMapServiceDiscoveryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.AwsCloudMapServiceDiscovery` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeAwsCloudMapServiceDiscoveryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_AwsCloudMapServiceDiscoveryPropertyValidator(properties).assertSuccess();
    return {
        Attributes: cdk.listMapper(cfnVirtualNodeAwsCloudMapInstanceAttributePropertyToCloudFormation)(properties.attributes),
        IpPreference: cdk.stringToCloudFormation(properties.ipPreference),
        NamespaceName: cdk.stringToCloudFormation(properties.namespaceName),
        ServiceName: cdk.stringToCloudFormation(properties.serviceName),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeAwsCloudMapServiceDiscoveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.AwsCloudMapServiceDiscoveryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.AwsCloudMapServiceDiscoveryProperty>();
    ret.addPropertyResult('attributes', 'Attributes', properties.Attributes != null ? cfn_parse.FromCloudFormation.getArray(CfnVirtualNodeAwsCloudMapInstanceAttributePropertyFromCloudFormation)(properties.Attributes) : undefined);
    ret.addPropertyResult('ipPreference', 'IpPreference', properties.IpPreference != null ? cfn_parse.FromCloudFormation.getString(properties.IpPreference) : undefined);
    ret.addPropertyResult('namespaceName', 'NamespaceName', cfn_parse.FromCloudFormation.getString(properties.NamespaceName));
    ret.addPropertyResult('serviceName', 'ServiceName', cfn_parse.FromCloudFormation.getString(properties.ServiceName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the backends that a virtual node is expected to send outbound traffic to.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-backend.html
     */
    export interface BackendProperty {
        /**
         * Specifies a virtual service to use as a backend.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-backend.html#cfn-appmesh-virtualnode-backend-virtualservice
         */
        readonly virtualService?: CfnVirtualNode.VirtualServiceBackendProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `BackendProperty`
 *
 * @param properties - the TypeScript properties of a `BackendProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_BackendPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('virtualService', CfnVirtualNode_VirtualServiceBackendPropertyValidator)(properties.virtualService));
    return errors.wrap('supplied properties not correct for "BackendProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.Backend` resource
 *
 * @param properties - the TypeScript properties of a `BackendProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.Backend` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeBackendPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_BackendPropertyValidator(properties).assertSuccess();
    return {
        VirtualService: cfnVirtualNodeVirtualServiceBackendPropertyToCloudFormation(properties.virtualService),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeBackendPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.BackendProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.BackendProperty>();
    ret.addPropertyResult('virtualService', 'VirtualService', properties.VirtualService != null ? CfnVirtualNodeVirtualServiceBackendPropertyFromCloudFormation(properties.VirtualService) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the default properties for a backend.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-backenddefaults.html
     */
    export interface BackendDefaultsProperty {
        /**
         * A reference to an object that represents a client policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-backenddefaults.html#cfn-appmesh-virtualnode-backenddefaults-clientpolicy
         */
        readonly clientPolicy?: CfnVirtualNode.ClientPolicyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `BackendDefaultsProperty`
 *
 * @param properties - the TypeScript properties of a `BackendDefaultsProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_BackendDefaultsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clientPolicy', CfnVirtualNode_ClientPolicyPropertyValidator)(properties.clientPolicy));
    return errors.wrap('supplied properties not correct for "BackendDefaultsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.BackendDefaults` resource
 *
 * @param properties - the TypeScript properties of a `BackendDefaultsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.BackendDefaults` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeBackendDefaultsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_BackendDefaultsPropertyValidator(properties).assertSuccess();
    return {
        ClientPolicy: cfnVirtualNodeClientPolicyPropertyToCloudFormation(properties.clientPolicy),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeBackendDefaultsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.BackendDefaultsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.BackendDefaultsProperty>();
    ret.addPropertyResult('clientPolicy', 'ClientPolicy', properties.ClientPolicy != null ? CfnVirtualNodeClientPolicyPropertyFromCloudFormation(properties.ClientPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a client policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clientpolicy.html
     */
    export interface ClientPolicyProperty {
        /**
         * A reference to an object that represents a Transport Layer Security (TLS) client policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clientpolicy.html#cfn-appmesh-virtualnode-clientpolicy-tls
         */
        readonly tls?: CfnVirtualNode.ClientPolicyTlsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ClientPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ClientPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_ClientPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('tls', CfnVirtualNode_ClientPolicyTlsPropertyValidator)(properties.tls));
    return errors.wrap('supplied properties not correct for "ClientPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ClientPolicy` resource
 *
 * @param properties - the TypeScript properties of a `ClientPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ClientPolicy` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeClientPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_ClientPolicyPropertyValidator(properties).assertSuccess();
    return {
        TLS: cfnVirtualNodeClientPolicyTlsPropertyToCloudFormation(properties.tls),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeClientPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ClientPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ClientPolicyProperty>();
    ret.addPropertyResult('tls', 'TLS', properties.TLS != null ? CfnVirtualNodeClientPolicyTlsPropertyFromCloudFormation(properties.TLS) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * A reference to an object that represents a Transport Layer Security (TLS) client policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clientpolicytls.html
     */
    export interface ClientPolicyTlsProperty {
        /**
         * A reference to an object that represents a client's TLS certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clientpolicytls.html#cfn-appmesh-virtualnode-clientpolicytls-certificate
         */
        readonly certificate?: CfnVirtualNode.ClientTlsCertificateProperty | cdk.IResolvable;
        /**
         * Whether the policy is enforced. The default is `True` , if a value isn't specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clientpolicytls.html#cfn-appmesh-virtualnode-clientpolicytls-enforce
         */
        readonly enforce?: boolean | cdk.IResolvable;
        /**
         * One or more ports that the policy is enforced for.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clientpolicytls.html#cfn-appmesh-virtualnode-clientpolicytls-ports
         */
        readonly ports?: number[] | cdk.IResolvable;
        /**
         * A reference to an object that represents a TLS validation context.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clientpolicytls.html#cfn-appmesh-virtualnode-clientpolicytls-validation
         */
        readonly validation: CfnVirtualNode.TlsValidationContextProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ClientPolicyTlsProperty`
 *
 * @param properties - the TypeScript properties of a `ClientPolicyTlsProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_ClientPolicyTlsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificate', CfnVirtualNode_ClientTlsCertificatePropertyValidator)(properties.certificate));
    errors.collect(cdk.propertyValidator('enforce', cdk.validateBoolean)(properties.enforce));
    errors.collect(cdk.propertyValidator('ports', cdk.listValidator(cdk.validateNumber))(properties.ports));
    errors.collect(cdk.propertyValidator('validation', cdk.requiredValidator)(properties.validation));
    errors.collect(cdk.propertyValidator('validation', CfnVirtualNode_TlsValidationContextPropertyValidator)(properties.validation));
    return errors.wrap('supplied properties not correct for "ClientPolicyTlsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ClientPolicyTls` resource
 *
 * @param properties - the TypeScript properties of a `ClientPolicyTlsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ClientPolicyTls` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeClientPolicyTlsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_ClientPolicyTlsPropertyValidator(properties).assertSuccess();
    return {
        Certificate: cfnVirtualNodeClientTlsCertificatePropertyToCloudFormation(properties.certificate),
        Enforce: cdk.booleanToCloudFormation(properties.enforce),
        Ports: cdk.listMapper(cdk.numberToCloudFormation)(properties.ports),
        Validation: cfnVirtualNodeTlsValidationContextPropertyToCloudFormation(properties.validation),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeClientPolicyTlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ClientPolicyTlsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ClientPolicyTlsProperty>();
    ret.addPropertyResult('certificate', 'Certificate', properties.Certificate != null ? CfnVirtualNodeClientTlsCertificatePropertyFromCloudFormation(properties.Certificate) : undefined);
    ret.addPropertyResult('enforce', 'Enforce', properties.Enforce != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enforce) : undefined);
    ret.addPropertyResult('ports', 'Ports', properties.Ports != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.Ports) : undefined);
    ret.addPropertyResult('validation', 'Validation', CfnVirtualNodeTlsValidationContextPropertyFromCloudFormation(properties.Validation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the client's certificate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clienttlscertificate.html
     */
    export interface ClientTlsCertificateProperty {
        /**
         * An object that represents a local file certificate. The certificate must meet specific requirements and you must have proxy authorization enabled. For more information, see [Transport Layer Security (TLS)](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clienttlscertificate.html#cfn-appmesh-virtualnode-clienttlscertificate-file
         */
        readonly file?: CfnVirtualNode.ListenerTlsFileCertificateProperty | cdk.IResolvable;
        /**
         * A reference to an object that represents a client's TLS Secret Discovery Service certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-clienttlscertificate.html#cfn-appmesh-virtualnode-clienttlscertificate-sds
         */
        readonly sds?: CfnVirtualNode.ListenerTlsSdsCertificateProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ClientTlsCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `ClientTlsCertificateProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_ClientTlsCertificatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('file', CfnVirtualNode_ListenerTlsFileCertificatePropertyValidator)(properties.file));
    errors.collect(cdk.propertyValidator('sds', CfnVirtualNode_ListenerTlsSdsCertificatePropertyValidator)(properties.sds));
    return errors.wrap('supplied properties not correct for "ClientTlsCertificateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ClientTlsCertificate` resource
 *
 * @param properties - the TypeScript properties of a `ClientTlsCertificateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ClientTlsCertificate` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeClientTlsCertificatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_ClientTlsCertificatePropertyValidator(properties).assertSuccess();
    return {
        File: cfnVirtualNodeListenerTlsFileCertificatePropertyToCloudFormation(properties.file),
        SDS: cfnVirtualNodeListenerTlsSdsCertificatePropertyToCloudFormation(properties.sds),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeClientTlsCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ClientTlsCertificateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ClientTlsCertificateProperty>();
    ret.addPropertyResult('file', 'File', properties.File != null ? CfnVirtualNodeListenerTlsFileCertificatePropertyFromCloudFormation(properties.File) : undefined);
    ret.addPropertyResult('sds', 'SDS', properties.SDS != null ? CfnVirtualNodeListenerTlsSdsCertificatePropertyFromCloudFormation(properties.SDS) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the DNS service discovery information for your virtual node.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-dnsservicediscovery.html
     */
    export interface DnsServiceDiscoveryProperty {
        /**
         * Specifies the DNS service discovery hostname for the virtual node.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-dnsservicediscovery.html#cfn-appmesh-virtualnode-dnsservicediscovery-hostname
         */
        readonly hostname: string;
        /**
         * The preferred IP version that this virtual node uses. Setting the IP preference on the virtual node only overrides the IP preference set for the mesh on this specific node.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-dnsservicediscovery.html#cfn-appmesh-virtualnode-dnsservicediscovery-ippreference
         */
        readonly ipPreference?: string;
        /**
         * Specifies the DNS response type for the virtual node.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-dnsservicediscovery.html#cfn-appmesh-virtualnode-dnsservicediscovery-responsetype
         */
        readonly responseType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DnsServiceDiscoveryProperty`
 *
 * @param properties - the TypeScript properties of a `DnsServiceDiscoveryProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_DnsServiceDiscoveryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('hostname', cdk.requiredValidator)(properties.hostname));
    errors.collect(cdk.propertyValidator('hostname', cdk.validateString)(properties.hostname));
    errors.collect(cdk.propertyValidator('ipPreference', cdk.validateString)(properties.ipPreference));
    errors.collect(cdk.propertyValidator('responseType', cdk.validateString)(properties.responseType));
    return errors.wrap('supplied properties not correct for "DnsServiceDiscoveryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.DnsServiceDiscovery` resource
 *
 * @param properties - the TypeScript properties of a `DnsServiceDiscoveryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.DnsServiceDiscovery` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeDnsServiceDiscoveryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_DnsServiceDiscoveryPropertyValidator(properties).assertSuccess();
    return {
        Hostname: cdk.stringToCloudFormation(properties.hostname),
        IpPreference: cdk.stringToCloudFormation(properties.ipPreference),
        ResponseType: cdk.stringToCloudFormation(properties.responseType),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeDnsServiceDiscoveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.DnsServiceDiscoveryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.DnsServiceDiscoveryProperty>();
    ret.addPropertyResult('hostname', 'Hostname', cfn_parse.FromCloudFormation.getString(properties.Hostname));
    ret.addPropertyResult('ipPreference', 'IpPreference', properties.IpPreference != null ? cfn_parse.FromCloudFormation.getString(properties.IpPreference) : undefined);
    ret.addPropertyResult('responseType', 'ResponseType', properties.ResponseType != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a duration of time.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-duration.html
     */
    export interface DurationProperty {
        /**
         * A unit of time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-duration.html#cfn-appmesh-virtualnode-duration-unit
         */
        readonly unit: string;
        /**
         * A number of time units.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-duration.html#cfn-appmesh-virtualnode-duration-value
         */
        readonly value: number;
    }
}

/**
 * Determine whether the given properties match those of a `DurationProperty`
 *
 * @param properties - the TypeScript properties of a `DurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_DurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('unit', cdk.requiredValidator)(properties.unit));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateNumber)(properties.value));
    return errors.wrap('supplied properties not correct for "DurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.Duration` resource
 *
 * @param properties - the TypeScript properties of a `DurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.Duration` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeDurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_DurationPropertyValidator(properties).assertSuccess();
    return {
        Unit: cdk.stringToCloudFormation(properties.unit),
        Value: cdk.numberToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeDurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.DurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.DurationProperty>();
    ret.addPropertyResult('unit', 'Unit', cfn_parse.FromCloudFormation.getString(properties.Unit));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getNumber(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents an access log file.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-fileaccesslog.html
     */
    export interface FileAccessLogProperty {
        /**
         * The specified format for the logs. The format is either `json_format` or `text_format` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-fileaccesslog.html#cfn-appmesh-virtualnode-fileaccesslog-format
         */
        readonly format?: CfnVirtualNode.LoggingFormatProperty | cdk.IResolvable;
        /**
         * The file path to write access logs to. You can use `/dev/stdout` to send access logs to standard out and configure your Envoy container to use a log driver, such as `awslogs` , to export the access logs to a log storage service such as Amazon CloudWatch Logs. You can also specify a path in the Envoy container's file system to write the files to disk.
         *
         * > The Envoy process must have write permissions to the path that you specify here. Otherwise, Envoy fails to bootstrap properly.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-fileaccesslog.html#cfn-appmesh-virtualnode-fileaccesslog-path
         */
        readonly path: string;
    }
}

/**
 * Determine whether the given properties match those of a `FileAccessLogProperty`
 *
 * @param properties - the TypeScript properties of a `FileAccessLogProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_FileAccessLogPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('format', CfnVirtualNode_LoggingFormatPropertyValidator)(properties.format));
    errors.collect(cdk.propertyValidator('path', cdk.requiredValidator)(properties.path));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    return errors.wrap('supplied properties not correct for "FileAccessLogProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.FileAccessLog` resource
 *
 * @param properties - the TypeScript properties of a `FileAccessLogProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.FileAccessLog` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeFileAccessLogPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_FileAccessLogPropertyValidator(properties).assertSuccess();
    return {
        Format: cfnVirtualNodeLoggingFormatPropertyToCloudFormation(properties.format),
        Path: cdk.stringToCloudFormation(properties.path),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeFileAccessLogPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.FileAccessLogProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.FileAccessLogProperty>();
    ret.addPropertyResult('format', 'Format', properties.Format != null ? CfnVirtualNodeLoggingFormatPropertyFromCloudFormation(properties.Format) : undefined);
    ret.addPropertyResult('path', 'Path', cfn_parse.FromCloudFormation.getString(properties.Path));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents types of timeouts.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-grpctimeout.html
     */
    export interface GrpcTimeoutProperty {
        /**
         * An object that represents an idle timeout. An idle timeout bounds the amount of time that a connection may be idle. The default value is none.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-grpctimeout.html#cfn-appmesh-virtualnode-grpctimeout-idle
         */
        readonly idle?: CfnVirtualNode.DurationProperty | cdk.IResolvable;
        /**
         * An object that represents a per request timeout. The default value is 15 seconds. If you set a higher timeout, then make sure that the higher value is set for each App Mesh resource in a conversation. For example, if a virtual node backend uses a virtual router provider to route to another virtual node, then the timeout should be greater than 15 seconds for the source and destination virtual node and the route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-grpctimeout.html#cfn-appmesh-virtualnode-grpctimeout-perrequest
         */
        readonly perRequest?: CfnVirtualNode.DurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `GrpcTimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `GrpcTimeoutProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_GrpcTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('idle', CfnVirtualNode_DurationPropertyValidator)(properties.idle));
    errors.collect(cdk.propertyValidator('perRequest', CfnVirtualNode_DurationPropertyValidator)(properties.perRequest));
    return errors.wrap('supplied properties not correct for "GrpcTimeoutProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.GrpcTimeout` resource
 *
 * @param properties - the TypeScript properties of a `GrpcTimeoutProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.GrpcTimeout` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeGrpcTimeoutPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_GrpcTimeoutPropertyValidator(properties).assertSuccess();
    return {
        Idle: cfnVirtualNodeDurationPropertyToCloudFormation(properties.idle),
        PerRequest: cfnVirtualNodeDurationPropertyToCloudFormation(properties.perRequest),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeGrpcTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.GrpcTimeoutProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.GrpcTimeoutProperty>();
    ret.addPropertyResult('idle', 'Idle', properties.Idle != null ? CfnVirtualNodeDurationPropertyFromCloudFormation(properties.Idle) : undefined);
    ret.addPropertyResult('perRequest', 'PerRequest', properties.PerRequest != null ? CfnVirtualNodeDurationPropertyFromCloudFormation(properties.PerRequest) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the health check policy for a virtual node's listener.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html
     */
    export interface HealthCheckProperty {
        /**
         * The number of consecutive successful health checks that must occur before declaring listener healthy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html#cfn-appmesh-virtualnode-healthcheck-healthythreshold
         */
        readonly healthyThreshold: number;
        /**
         * The time period in milliseconds between each health check execution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html#cfn-appmesh-virtualnode-healthcheck-intervalmillis
         */
        readonly intervalMillis: number;
        /**
         * The destination path for the health check request. This value is only used if the specified protocol is HTTP or HTTP/2. For any other protocol, this value is ignored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html#cfn-appmesh-virtualnode-healthcheck-path
         */
        readonly path?: string;
        /**
         * The destination port for the health check request. This port must match the port defined in the `PortMapping` for the listener.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html#cfn-appmesh-virtualnode-healthcheck-port
         */
        readonly port?: number;
        /**
         * The protocol for the health check request. If you specify `grpc` , then your service must conform to the [GRPC Health Checking Protocol](https://docs.aws.amazon.com/https://github.com/grpc/grpc/blob/master/doc/health-checking.md) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html#cfn-appmesh-virtualnode-healthcheck-protocol
         */
        readonly protocol: string;
        /**
         * The amount of time to wait when receiving a response from the health check, in milliseconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html#cfn-appmesh-virtualnode-healthcheck-timeoutmillis
         */
        readonly timeoutMillis: number;
        /**
         * The number of consecutive failed health checks that must occur before declaring a virtual node unhealthy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-healthcheck.html#cfn-appmesh-virtualnode-healthcheck-unhealthythreshold
         */
        readonly unhealthyThreshold: number;
    }
}

/**
 * Determine whether the given properties match those of a `HealthCheckProperty`
 *
 * @param properties - the TypeScript properties of a `HealthCheckProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_HealthCheckPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('healthyThreshold', cdk.requiredValidator)(properties.healthyThreshold));
    errors.collect(cdk.propertyValidator('healthyThreshold', cdk.validateNumber)(properties.healthyThreshold));
    errors.collect(cdk.propertyValidator('intervalMillis', cdk.requiredValidator)(properties.intervalMillis));
    errors.collect(cdk.propertyValidator('intervalMillis', cdk.validateNumber)(properties.intervalMillis));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('protocol', cdk.requiredValidator)(properties.protocol));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    errors.collect(cdk.propertyValidator('timeoutMillis', cdk.requiredValidator)(properties.timeoutMillis));
    errors.collect(cdk.propertyValidator('timeoutMillis', cdk.validateNumber)(properties.timeoutMillis));
    errors.collect(cdk.propertyValidator('unhealthyThreshold', cdk.requiredValidator)(properties.unhealthyThreshold));
    errors.collect(cdk.propertyValidator('unhealthyThreshold', cdk.validateNumber)(properties.unhealthyThreshold));
    return errors.wrap('supplied properties not correct for "HealthCheckProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.HealthCheck` resource
 *
 * @param properties - the TypeScript properties of a `HealthCheckProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.HealthCheck` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeHealthCheckPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_HealthCheckPropertyValidator(properties).assertSuccess();
    return {
        HealthyThreshold: cdk.numberToCloudFormation(properties.healthyThreshold),
        IntervalMillis: cdk.numberToCloudFormation(properties.intervalMillis),
        Path: cdk.stringToCloudFormation(properties.path),
        Port: cdk.numberToCloudFormation(properties.port),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
        TimeoutMillis: cdk.numberToCloudFormation(properties.timeoutMillis),
        UnhealthyThreshold: cdk.numberToCloudFormation(properties.unhealthyThreshold),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeHealthCheckPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.HealthCheckProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.HealthCheckProperty>();
    ret.addPropertyResult('healthyThreshold', 'HealthyThreshold', cfn_parse.FromCloudFormation.getNumber(properties.HealthyThreshold));
    ret.addPropertyResult('intervalMillis', 'IntervalMillis', cfn_parse.FromCloudFormation.getNumber(properties.IntervalMillis));
    ret.addPropertyResult('path', 'Path', properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('protocol', 'Protocol', cfn_parse.FromCloudFormation.getString(properties.Protocol));
    ret.addPropertyResult('timeoutMillis', 'TimeoutMillis', cfn_parse.FromCloudFormation.getNumber(properties.TimeoutMillis));
    ret.addPropertyResult('unhealthyThreshold', 'UnhealthyThreshold', cfn_parse.FromCloudFormation.getNumber(properties.UnhealthyThreshold));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents types of timeouts.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-httptimeout.html
     */
    export interface HttpTimeoutProperty {
        /**
         * An object that represents an idle timeout. An idle timeout bounds the amount of time that a connection may be idle. The default value is none.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-httptimeout.html#cfn-appmesh-virtualnode-httptimeout-idle
         */
        readonly idle?: CfnVirtualNode.DurationProperty | cdk.IResolvable;
        /**
         * An object that represents a per request timeout. The default value is 15 seconds. If you set a higher timeout, then make sure that the higher value is set for each App Mesh resource in a conversation. For example, if a virtual node backend uses a virtual router provider to route to another virtual node, then the timeout should be greater than 15 seconds for the source and destination virtual node and the route.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-httptimeout.html#cfn-appmesh-virtualnode-httptimeout-perrequest
         */
        readonly perRequest?: CfnVirtualNode.DurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HttpTimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `HttpTimeoutProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_HttpTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('idle', CfnVirtualNode_DurationPropertyValidator)(properties.idle));
    errors.collect(cdk.propertyValidator('perRequest', CfnVirtualNode_DurationPropertyValidator)(properties.perRequest));
    return errors.wrap('supplied properties not correct for "HttpTimeoutProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.HttpTimeout` resource
 *
 * @param properties - the TypeScript properties of a `HttpTimeoutProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.HttpTimeout` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeHttpTimeoutPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_HttpTimeoutPropertyValidator(properties).assertSuccess();
    return {
        Idle: cfnVirtualNodeDurationPropertyToCloudFormation(properties.idle),
        PerRequest: cfnVirtualNodeDurationPropertyToCloudFormation(properties.perRequest),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeHttpTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.HttpTimeoutProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.HttpTimeoutProperty>();
    ret.addPropertyResult('idle', 'Idle', properties.Idle != null ? CfnVirtualNodeDurationPropertyFromCloudFormation(properties.Idle) : undefined);
    ret.addPropertyResult('perRequest', 'PerRequest', properties.PerRequest != null ? CfnVirtualNodeDurationPropertyFromCloudFormation(properties.PerRequest) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the key value pairs for the JSON.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-jsonformatref.html
     */
    export interface JsonFormatRefProperty {
        /**
         * The specified key for the JSON.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-jsonformatref.html#cfn-appmesh-virtualnode-jsonformatref-key
         */
        readonly key: string;
        /**
         * The specified value for the JSON.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-jsonformatref.html#cfn-appmesh-virtualnode-jsonformatref-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `JsonFormatRefProperty`
 *
 * @param properties - the TypeScript properties of a `JsonFormatRefProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_JsonFormatRefPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "JsonFormatRefProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.JsonFormatRef` resource
 *
 * @param properties - the TypeScript properties of a `JsonFormatRefProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.JsonFormatRef` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeJsonFormatRefPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_JsonFormatRefPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeJsonFormatRefPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.JsonFormatRefProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.JsonFormatRefProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a listener for a virtual node.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listener.html
     */
    export interface ListenerProperty {
        /**
         * The connection pool information for the listener.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listener.html#cfn-appmesh-virtualnode-listener-connectionpool
         */
        readonly connectionPool?: CfnVirtualNode.VirtualNodeConnectionPoolProperty | cdk.IResolvable;
        /**
         * The health check information for the listener.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listener.html#cfn-appmesh-virtualnode-listener-healthcheck
         */
        readonly healthCheck?: CfnVirtualNode.HealthCheckProperty | cdk.IResolvable;
        /**
         * The outlier detection information for the listener.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listener.html#cfn-appmesh-virtualnode-listener-outlierdetection
         */
        readonly outlierDetection?: CfnVirtualNode.OutlierDetectionProperty | cdk.IResolvable;
        /**
         * The port mapping information for the listener.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listener.html#cfn-appmesh-virtualnode-listener-portmapping
         */
        readonly portMapping: CfnVirtualNode.PortMappingProperty | cdk.IResolvable;
        /**
         * A reference to an object that represents the Transport Layer Security (TLS) properties for a listener.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listener.html#cfn-appmesh-virtualnode-listener-tls
         */
        readonly tls?: CfnVirtualNode.ListenerTlsProperty | cdk.IResolvable;
        /**
         * An object that represents timeouts for different protocols.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listener.html#cfn-appmesh-virtualnode-listener-timeout
         */
        readonly timeout?: CfnVirtualNode.ListenerTimeoutProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ListenerProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_ListenerPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('connectionPool', CfnVirtualNode_VirtualNodeConnectionPoolPropertyValidator)(properties.connectionPool));
    errors.collect(cdk.propertyValidator('healthCheck', CfnVirtualNode_HealthCheckPropertyValidator)(properties.healthCheck));
    errors.collect(cdk.propertyValidator('outlierDetection', CfnVirtualNode_OutlierDetectionPropertyValidator)(properties.outlierDetection));
    errors.collect(cdk.propertyValidator('portMapping', cdk.requiredValidator)(properties.portMapping));
    errors.collect(cdk.propertyValidator('portMapping', CfnVirtualNode_PortMappingPropertyValidator)(properties.portMapping));
    errors.collect(cdk.propertyValidator('tls', CfnVirtualNode_ListenerTlsPropertyValidator)(properties.tls));
    errors.collect(cdk.propertyValidator('timeout', CfnVirtualNode_ListenerTimeoutPropertyValidator)(properties.timeout));
    return errors.wrap('supplied properties not correct for "ListenerProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.Listener` resource
 *
 * @param properties - the TypeScript properties of a `ListenerProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.Listener` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeListenerPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_ListenerPropertyValidator(properties).assertSuccess();
    return {
        ConnectionPool: cfnVirtualNodeVirtualNodeConnectionPoolPropertyToCloudFormation(properties.connectionPool),
        HealthCheck: cfnVirtualNodeHealthCheckPropertyToCloudFormation(properties.healthCheck),
        OutlierDetection: cfnVirtualNodeOutlierDetectionPropertyToCloudFormation(properties.outlierDetection),
        PortMapping: cfnVirtualNodePortMappingPropertyToCloudFormation(properties.portMapping),
        TLS: cfnVirtualNodeListenerTlsPropertyToCloudFormation(properties.tls),
        Timeout: cfnVirtualNodeListenerTimeoutPropertyToCloudFormation(properties.timeout),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ListenerProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerProperty>();
    ret.addPropertyResult('connectionPool', 'ConnectionPool', properties.ConnectionPool != null ? CfnVirtualNodeVirtualNodeConnectionPoolPropertyFromCloudFormation(properties.ConnectionPool) : undefined);
    ret.addPropertyResult('healthCheck', 'HealthCheck', properties.HealthCheck != null ? CfnVirtualNodeHealthCheckPropertyFromCloudFormation(properties.HealthCheck) : undefined);
    ret.addPropertyResult('outlierDetection', 'OutlierDetection', properties.OutlierDetection != null ? CfnVirtualNodeOutlierDetectionPropertyFromCloudFormation(properties.OutlierDetection) : undefined);
    ret.addPropertyResult('portMapping', 'PortMapping', CfnVirtualNodePortMappingPropertyFromCloudFormation(properties.PortMapping));
    ret.addPropertyResult('tls', 'TLS', properties.TLS != null ? CfnVirtualNodeListenerTlsPropertyFromCloudFormation(properties.TLS) : undefined);
    ret.addPropertyResult('timeout', 'Timeout', properties.Timeout != null ? CfnVirtualNodeListenerTimeoutPropertyFromCloudFormation(properties.Timeout) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents timeouts for different protocols.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertimeout.html
     */
    export interface ListenerTimeoutProperty {
        /**
         * An object that represents types of timeouts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertimeout.html#cfn-appmesh-virtualnode-listenertimeout-grpc
         */
        readonly grpc?: CfnVirtualNode.GrpcTimeoutProperty | cdk.IResolvable;
        /**
         * An object that represents types of timeouts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertimeout.html#cfn-appmesh-virtualnode-listenertimeout-http
         */
        readonly http?: CfnVirtualNode.HttpTimeoutProperty | cdk.IResolvable;
        /**
         * An object that represents types of timeouts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertimeout.html#cfn-appmesh-virtualnode-listenertimeout-http2
         */
        readonly http2?: CfnVirtualNode.HttpTimeoutProperty | cdk.IResolvable;
        /**
         * An object that represents types of timeouts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertimeout.html#cfn-appmesh-virtualnode-listenertimeout-tcp
         */
        readonly tcp?: CfnVirtualNode.TcpTimeoutProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ListenerTimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTimeoutProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_ListenerTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('grpc', CfnVirtualNode_GrpcTimeoutPropertyValidator)(properties.grpc));
    errors.collect(cdk.propertyValidator('http', CfnVirtualNode_HttpTimeoutPropertyValidator)(properties.http));
    errors.collect(cdk.propertyValidator('http2', CfnVirtualNode_HttpTimeoutPropertyValidator)(properties.http2));
    errors.collect(cdk.propertyValidator('tcp', CfnVirtualNode_TcpTimeoutPropertyValidator)(properties.tcp));
    return errors.wrap('supplied properties not correct for "ListenerTimeoutProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTimeout` resource
 *
 * @param properties - the TypeScript properties of a `ListenerTimeoutProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTimeout` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeListenerTimeoutPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_ListenerTimeoutPropertyValidator(properties).assertSuccess();
    return {
        GRPC: cfnVirtualNodeGrpcTimeoutPropertyToCloudFormation(properties.grpc),
        HTTP: cfnVirtualNodeHttpTimeoutPropertyToCloudFormation(properties.http),
        HTTP2: cfnVirtualNodeHttpTimeoutPropertyToCloudFormation(properties.http2),
        TCP: cfnVirtualNodeTcpTimeoutPropertyToCloudFormation(properties.tcp),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ListenerTimeoutProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTimeoutProperty>();
    ret.addPropertyResult('grpc', 'GRPC', properties.GRPC != null ? CfnVirtualNodeGrpcTimeoutPropertyFromCloudFormation(properties.GRPC) : undefined);
    ret.addPropertyResult('http', 'HTTP', properties.HTTP != null ? CfnVirtualNodeHttpTimeoutPropertyFromCloudFormation(properties.HTTP) : undefined);
    ret.addPropertyResult('http2', 'HTTP2', properties.HTTP2 != null ? CfnVirtualNodeHttpTimeoutPropertyFromCloudFormation(properties.HTTP2) : undefined);
    ret.addPropertyResult('tcp', 'TCP', properties.TCP != null ? CfnVirtualNodeTcpTimeoutPropertyFromCloudFormation(properties.TCP) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the Transport Layer Security (TLS) properties for a listener.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertls.html
     */
    export interface ListenerTlsProperty {
        /**
         * A reference to an object that represents a listener's Transport Layer Security (TLS) certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertls.html#cfn-appmesh-virtualnode-listenertls-certificate
         */
        readonly certificate: CfnVirtualNode.ListenerTlsCertificateProperty | cdk.IResolvable;
        /**
         * Specify one of the following modes.
         *
         * - ** STRICT – Listener only accepts connections with TLS enabled.
         * - ** PERMISSIVE – Listener accepts connections with or without TLS enabled.
         * - ** DISABLED – Listener only accepts connections without TLS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertls.html#cfn-appmesh-virtualnode-listenertls-mode
         */
        readonly mode: string;
        /**
         * A reference to an object that represents a listener's Transport Layer Security (TLS) validation context.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertls.html#cfn-appmesh-virtualnode-listenertls-validation
         */
        readonly validation?: CfnVirtualNode.ListenerTlsValidationContextProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ListenerTlsProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTlsProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_ListenerTlsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificate', cdk.requiredValidator)(properties.certificate));
    errors.collect(cdk.propertyValidator('certificate', CfnVirtualNode_ListenerTlsCertificatePropertyValidator)(properties.certificate));
    errors.collect(cdk.propertyValidator('mode', cdk.requiredValidator)(properties.mode));
    errors.collect(cdk.propertyValidator('mode', cdk.validateString)(properties.mode));
    errors.collect(cdk.propertyValidator('validation', CfnVirtualNode_ListenerTlsValidationContextPropertyValidator)(properties.validation));
    return errors.wrap('supplied properties not correct for "ListenerTlsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTls` resource
 *
 * @param properties - the TypeScript properties of a `ListenerTlsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTls` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeListenerTlsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_ListenerTlsPropertyValidator(properties).assertSuccess();
    return {
        Certificate: cfnVirtualNodeListenerTlsCertificatePropertyToCloudFormation(properties.certificate),
        Mode: cdk.stringToCloudFormation(properties.mode),
        Validation: cfnVirtualNodeListenerTlsValidationContextPropertyToCloudFormation(properties.validation),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ListenerTlsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTlsProperty>();
    ret.addPropertyResult('certificate', 'Certificate', CfnVirtualNodeListenerTlsCertificatePropertyFromCloudFormation(properties.Certificate));
    ret.addPropertyResult('mode', 'Mode', cfn_parse.FromCloudFormation.getString(properties.Mode));
    ret.addPropertyResult('validation', 'Validation', properties.Validation != null ? CfnVirtualNodeListenerTlsValidationContextPropertyFromCloudFormation(properties.Validation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents an AWS Certificate Manager certificate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsacmcertificate.html
     */
    export interface ListenerTlsAcmCertificateProperty {
        /**
         * The Amazon Resource Name (ARN) for the certificate. The certificate must meet specific requirements and you must have proxy authorization enabled. For more information, see [Transport Layer Security (TLS)](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html#virtual-node-tls-prerequisites) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsacmcertificate.html#cfn-appmesh-virtualnode-listenertlsacmcertificate-certificatearn
         */
        readonly certificateArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `ListenerTlsAcmCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTlsAcmCertificateProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_ListenerTlsAcmCertificatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateArn', cdk.requiredValidator)(properties.certificateArn));
    errors.collect(cdk.propertyValidator('certificateArn', cdk.validateString)(properties.certificateArn));
    return errors.wrap('supplied properties not correct for "ListenerTlsAcmCertificateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTlsAcmCertificate` resource
 *
 * @param properties - the TypeScript properties of a `ListenerTlsAcmCertificateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTlsAcmCertificate` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeListenerTlsAcmCertificatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_ListenerTlsAcmCertificatePropertyValidator(properties).assertSuccess();
    return {
        CertificateArn: cdk.stringToCloudFormation(properties.certificateArn),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsAcmCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ListenerTlsAcmCertificateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTlsAcmCertificateProperty>();
    ret.addPropertyResult('certificateArn', 'CertificateArn', cfn_parse.FromCloudFormation.getString(properties.CertificateArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a listener's Transport Layer Security (TLS) certificate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlscertificate.html
     */
    export interface ListenerTlsCertificateProperty {
        /**
         * A reference to an object that represents an AWS Certificate Manager certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlscertificate.html#cfn-appmesh-virtualnode-listenertlscertificate-acm
         */
        readonly acm?: CfnVirtualNode.ListenerTlsAcmCertificateProperty | cdk.IResolvable;
        /**
         * A reference to an object that represents a local file certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlscertificate.html#cfn-appmesh-virtualnode-listenertlscertificate-file
         */
        readonly file?: CfnVirtualNode.ListenerTlsFileCertificateProperty | cdk.IResolvable;
        /**
         * A reference to an object that represents a listener's Secret Discovery Service certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlscertificate.html#cfn-appmesh-virtualnode-listenertlscertificate-sds
         */
        readonly sds?: CfnVirtualNode.ListenerTlsSdsCertificateProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ListenerTlsCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTlsCertificateProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_ListenerTlsCertificatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acm', CfnVirtualNode_ListenerTlsAcmCertificatePropertyValidator)(properties.acm));
    errors.collect(cdk.propertyValidator('file', CfnVirtualNode_ListenerTlsFileCertificatePropertyValidator)(properties.file));
    errors.collect(cdk.propertyValidator('sds', CfnVirtualNode_ListenerTlsSdsCertificatePropertyValidator)(properties.sds));
    return errors.wrap('supplied properties not correct for "ListenerTlsCertificateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTlsCertificate` resource
 *
 * @param properties - the TypeScript properties of a `ListenerTlsCertificateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTlsCertificate` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeListenerTlsCertificatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_ListenerTlsCertificatePropertyValidator(properties).assertSuccess();
    return {
        ACM: cfnVirtualNodeListenerTlsAcmCertificatePropertyToCloudFormation(properties.acm),
        File: cfnVirtualNodeListenerTlsFileCertificatePropertyToCloudFormation(properties.file),
        SDS: cfnVirtualNodeListenerTlsSdsCertificatePropertyToCloudFormation(properties.sds),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ListenerTlsCertificateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTlsCertificateProperty>();
    ret.addPropertyResult('acm', 'ACM', properties.ACM != null ? CfnVirtualNodeListenerTlsAcmCertificatePropertyFromCloudFormation(properties.ACM) : undefined);
    ret.addPropertyResult('file', 'File', properties.File != null ? CfnVirtualNodeListenerTlsFileCertificatePropertyFromCloudFormation(properties.File) : undefined);
    ret.addPropertyResult('sds', 'SDS', properties.SDS != null ? CfnVirtualNodeListenerTlsSdsCertificatePropertyFromCloudFormation(properties.SDS) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a local file certificate. The certificate must meet specific requirements and you must have proxy authorization enabled. For more information, see [Transport Layer Security (TLS)](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html#virtual-node-tls-prerequisites) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsfilecertificate.html
     */
    export interface ListenerTlsFileCertificateProperty {
        /**
         * The certificate chain for the certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsfilecertificate.html#cfn-appmesh-virtualnode-listenertlsfilecertificate-certificatechain
         */
        readonly certificateChain: string;
        /**
         * The private key for a certificate stored on the file system of the virtual node that the proxy is running on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsfilecertificate.html#cfn-appmesh-virtualnode-listenertlsfilecertificate-privatekey
         */
        readonly privateKey: string;
    }
}

/**
 * Determine whether the given properties match those of a `ListenerTlsFileCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTlsFileCertificateProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_ListenerTlsFileCertificatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateChain', cdk.requiredValidator)(properties.certificateChain));
    errors.collect(cdk.propertyValidator('certificateChain', cdk.validateString)(properties.certificateChain));
    errors.collect(cdk.propertyValidator('privateKey', cdk.requiredValidator)(properties.privateKey));
    errors.collect(cdk.propertyValidator('privateKey', cdk.validateString)(properties.privateKey));
    return errors.wrap('supplied properties not correct for "ListenerTlsFileCertificateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTlsFileCertificate` resource
 *
 * @param properties - the TypeScript properties of a `ListenerTlsFileCertificateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTlsFileCertificate` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeListenerTlsFileCertificatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_ListenerTlsFileCertificatePropertyValidator(properties).assertSuccess();
    return {
        CertificateChain: cdk.stringToCloudFormation(properties.certificateChain),
        PrivateKey: cdk.stringToCloudFormation(properties.privateKey),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsFileCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ListenerTlsFileCertificateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTlsFileCertificateProperty>();
    ret.addPropertyResult('certificateChain', 'CertificateChain', cfn_parse.FromCloudFormation.getString(properties.CertificateChain));
    ret.addPropertyResult('privateKey', 'PrivateKey', cfn_parse.FromCloudFormation.getString(properties.PrivateKey));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the listener's Secret Discovery Service certificate. The proxy must be configured with a local SDS provider via a Unix Domain Socket. See App Mesh [TLS documentation](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html) for more info.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlssdscertificate.html
     */
    export interface ListenerTlsSdsCertificateProperty {
        /**
         * A reference to an object that represents the name of the secret requested from the Secret Discovery Service provider representing Transport Layer Security (TLS) materials like a certificate or certificate chain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlssdscertificate.html#cfn-appmesh-virtualnode-listenertlssdscertificate-secretname
         */
        readonly secretName: string;
    }
}

/**
 * Determine whether the given properties match those of a `ListenerTlsSdsCertificateProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTlsSdsCertificateProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_ListenerTlsSdsCertificatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('secretName', cdk.requiredValidator)(properties.secretName));
    errors.collect(cdk.propertyValidator('secretName', cdk.validateString)(properties.secretName));
    return errors.wrap('supplied properties not correct for "ListenerTlsSdsCertificateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTlsSdsCertificate` resource
 *
 * @param properties - the TypeScript properties of a `ListenerTlsSdsCertificateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTlsSdsCertificate` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeListenerTlsSdsCertificatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_ListenerTlsSdsCertificatePropertyValidator(properties).assertSuccess();
    return {
        SecretName: cdk.stringToCloudFormation(properties.secretName),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsSdsCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ListenerTlsSdsCertificateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTlsSdsCertificateProperty>();
    ret.addPropertyResult('secretName', 'SecretName', cfn_parse.FromCloudFormation.getString(properties.SecretName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a listener's Transport Layer Security (TLS) validation context.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsvalidationcontext.html
     */
    export interface ListenerTlsValidationContextProperty {
        /**
         * A reference to an object that represents the SANs for a listener's Transport Layer Security (TLS) validation context.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsvalidationcontext.html#cfn-appmesh-virtualnode-listenertlsvalidationcontext-subjectalternativenames
         */
        readonly subjectAlternativeNames?: CfnVirtualNode.SubjectAlternativeNamesProperty | cdk.IResolvable;
        /**
         * A reference to where to retrieve the trust chain when validating a peer’s Transport Layer Security (TLS) certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsvalidationcontext.html#cfn-appmesh-virtualnode-listenertlsvalidationcontext-trust
         */
        readonly trust: CfnVirtualNode.ListenerTlsValidationContextTrustProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ListenerTlsValidationContextProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTlsValidationContextProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_ListenerTlsValidationContextPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('subjectAlternativeNames', CfnVirtualNode_SubjectAlternativeNamesPropertyValidator)(properties.subjectAlternativeNames));
    errors.collect(cdk.propertyValidator('trust', cdk.requiredValidator)(properties.trust));
    errors.collect(cdk.propertyValidator('trust', CfnVirtualNode_ListenerTlsValidationContextTrustPropertyValidator)(properties.trust));
    return errors.wrap('supplied properties not correct for "ListenerTlsValidationContextProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTlsValidationContext` resource
 *
 * @param properties - the TypeScript properties of a `ListenerTlsValidationContextProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTlsValidationContext` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeListenerTlsValidationContextPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_ListenerTlsValidationContextPropertyValidator(properties).assertSuccess();
    return {
        SubjectAlternativeNames: cfnVirtualNodeSubjectAlternativeNamesPropertyToCloudFormation(properties.subjectAlternativeNames),
        Trust: cfnVirtualNodeListenerTlsValidationContextTrustPropertyToCloudFormation(properties.trust),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsValidationContextPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ListenerTlsValidationContextProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTlsValidationContextProperty>();
    ret.addPropertyResult('subjectAlternativeNames', 'SubjectAlternativeNames', properties.SubjectAlternativeNames != null ? CfnVirtualNodeSubjectAlternativeNamesPropertyFromCloudFormation(properties.SubjectAlternativeNames) : undefined);
    ret.addPropertyResult('trust', 'Trust', CfnVirtualNodeListenerTlsValidationContextTrustPropertyFromCloudFormation(properties.Trust));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a listener's Transport Layer Security (TLS) validation context trust.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsvalidationcontexttrust.html
     */
    export interface ListenerTlsValidationContextTrustProperty {
        /**
         * An object that represents a Transport Layer Security (TLS) validation context trust for a local file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsvalidationcontexttrust.html#cfn-appmesh-virtualnode-listenertlsvalidationcontexttrust-file
         */
        readonly file?: CfnVirtualNode.TlsValidationContextFileTrustProperty | cdk.IResolvable;
        /**
         * A reference to an object that represents a listener's Transport Layer Security (TLS) Secret Discovery Service validation context trust.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-listenertlsvalidationcontexttrust.html#cfn-appmesh-virtualnode-listenertlsvalidationcontexttrust-sds
         */
        readonly sds?: CfnVirtualNode.TlsValidationContextSdsTrustProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ListenerTlsValidationContextTrustProperty`
 *
 * @param properties - the TypeScript properties of a `ListenerTlsValidationContextTrustProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_ListenerTlsValidationContextTrustPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('file', CfnVirtualNode_TlsValidationContextFileTrustPropertyValidator)(properties.file));
    errors.collect(cdk.propertyValidator('sds', CfnVirtualNode_TlsValidationContextSdsTrustPropertyValidator)(properties.sds));
    return errors.wrap('supplied properties not correct for "ListenerTlsValidationContextTrustProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTlsValidationContextTrust` resource
 *
 * @param properties - the TypeScript properties of a `ListenerTlsValidationContextTrustProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ListenerTlsValidationContextTrust` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeListenerTlsValidationContextTrustPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_ListenerTlsValidationContextTrustPropertyValidator(properties).assertSuccess();
    return {
        File: cfnVirtualNodeTlsValidationContextFileTrustPropertyToCloudFormation(properties.file),
        SDS: cfnVirtualNodeTlsValidationContextSdsTrustPropertyToCloudFormation(properties.sds),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeListenerTlsValidationContextTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ListenerTlsValidationContextTrustProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ListenerTlsValidationContextTrustProperty>();
    ret.addPropertyResult('file', 'File', properties.File != null ? CfnVirtualNodeTlsValidationContextFileTrustPropertyFromCloudFormation(properties.File) : undefined);
    ret.addPropertyResult('sds', 'SDS', properties.SDS != null ? CfnVirtualNodeTlsValidationContextSdsTrustPropertyFromCloudFormation(properties.SDS) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the logging information for a virtual node.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-logging.html
     */
    export interface LoggingProperty {
        /**
         * The access log configuration for a virtual node.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-logging.html#cfn-appmesh-virtualnode-logging-accesslog
         */
        readonly accessLog?: CfnVirtualNode.AccessLogProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LoggingProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_LoggingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessLog', CfnVirtualNode_AccessLogPropertyValidator)(properties.accessLog));
    return errors.wrap('supplied properties not correct for "LoggingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.Logging` resource
 *
 * @param properties - the TypeScript properties of a `LoggingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.Logging` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeLoggingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_LoggingPropertyValidator(properties).assertSuccess();
    return {
        AccessLog: cfnVirtualNodeAccessLogPropertyToCloudFormation(properties.accessLog),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeLoggingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.LoggingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.LoggingProperty>();
    ret.addPropertyResult('accessLog', 'AccessLog', properties.AccessLog != null ? CfnVirtualNodeAccessLogPropertyFromCloudFormation(properties.AccessLog) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the format for the logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-loggingformat.html
     */
    export interface LoggingFormatProperty {
        /**
         * The logging format for JSON.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-loggingformat.html#cfn-appmesh-virtualnode-loggingformat-json
         */
        readonly json?: Array<CfnVirtualNode.JsonFormatRefProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The logging format for text.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-loggingformat.html#cfn-appmesh-virtualnode-loggingformat-text
         */
        readonly text?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LoggingFormatProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingFormatProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_LoggingFormatPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('json', cdk.listValidator(CfnVirtualNode_JsonFormatRefPropertyValidator))(properties.json));
    errors.collect(cdk.propertyValidator('text', cdk.validateString)(properties.text));
    return errors.wrap('supplied properties not correct for "LoggingFormatProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.LoggingFormat` resource
 *
 * @param properties - the TypeScript properties of a `LoggingFormatProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.LoggingFormat` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeLoggingFormatPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_LoggingFormatPropertyValidator(properties).assertSuccess();
    return {
        Json: cdk.listMapper(cfnVirtualNodeJsonFormatRefPropertyToCloudFormation)(properties.json),
        Text: cdk.stringToCloudFormation(properties.text),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeLoggingFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.LoggingFormatProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.LoggingFormatProperty>();
    ret.addPropertyResult('json', 'Json', properties.Json != null ? cfn_parse.FromCloudFormation.getArray(CfnVirtualNodeJsonFormatRefPropertyFromCloudFormation)(properties.Json) : undefined);
    ret.addPropertyResult('text', 'Text', properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the outlier detection for a virtual node's listener.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-outlierdetection.html
     */
    export interface OutlierDetectionProperty {
        /**
         * The base amount of time for which a host is ejected.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-outlierdetection.html#cfn-appmesh-virtualnode-outlierdetection-baseejectionduration
         */
        readonly baseEjectionDuration: CfnVirtualNode.DurationProperty | cdk.IResolvable;
        /**
         * The time interval between ejection sweep analysis.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-outlierdetection.html#cfn-appmesh-virtualnode-outlierdetection-interval
         */
        readonly interval: CfnVirtualNode.DurationProperty | cdk.IResolvable;
        /**
         * Maximum percentage of hosts in load balancing pool for upstream service that can be ejected. Will eject at least one host regardless of the value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-outlierdetection.html#cfn-appmesh-virtualnode-outlierdetection-maxejectionpercent
         */
        readonly maxEjectionPercent: number;
        /**
         * Number of consecutive `5xx` errors required for ejection.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-outlierdetection.html#cfn-appmesh-virtualnode-outlierdetection-maxservererrors
         */
        readonly maxServerErrors: number;
    }
}

/**
 * Determine whether the given properties match those of a `OutlierDetectionProperty`
 *
 * @param properties - the TypeScript properties of a `OutlierDetectionProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_OutlierDetectionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('baseEjectionDuration', cdk.requiredValidator)(properties.baseEjectionDuration));
    errors.collect(cdk.propertyValidator('baseEjectionDuration', CfnVirtualNode_DurationPropertyValidator)(properties.baseEjectionDuration));
    errors.collect(cdk.propertyValidator('interval', cdk.requiredValidator)(properties.interval));
    errors.collect(cdk.propertyValidator('interval', CfnVirtualNode_DurationPropertyValidator)(properties.interval));
    errors.collect(cdk.propertyValidator('maxEjectionPercent', cdk.requiredValidator)(properties.maxEjectionPercent));
    errors.collect(cdk.propertyValidator('maxEjectionPercent', cdk.validateNumber)(properties.maxEjectionPercent));
    errors.collect(cdk.propertyValidator('maxServerErrors', cdk.requiredValidator)(properties.maxServerErrors));
    errors.collect(cdk.propertyValidator('maxServerErrors', cdk.validateNumber)(properties.maxServerErrors));
    return errors.wrap('supplied properties not correct for "OutlierDetectionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.OutlierDetection` resource
 *
 * @param properties - the TypeScript properties of a `OutlierDetectionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.OutlierDetection` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeOutlierDetectionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_OutlierDetectionPropertyValidator(properties).assertSuccess();
    return {
        BaseEjectionDuration: cfnVirtualNodeDurationPropertyToCloudFormation(properties.baseEjectionDuration),
        Interval: cfnVirtualNodeDurationPropertyToCloudFormation(properties.interval),
        MaxEjectionPercent: cdk.numberToCloudFormation(properties.maxEjectionPercent),
        MaxServerErrors: cdk.numberToCloudFormation(properties.maxServerErrors),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeOutlierDetectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.OutlierDetectionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.OutlierDetectionProperty>();
    ret.addPropertyResult('baseEjectionDuration', 'BaseEjectionDuration', CfnVirtualNodeDurationPropertyFromCloudFormation(properties.BaseEjectionDuration));
    ret.addPropertyResult('interval', 'Interval', CfnVirtualNodeDurationPropertyFromCloudFormation(properties.Interval));
    ret.addPropertyResult('maxEjectionPercent', 'MaxEjectionPercent', cfn_parse.FromCloudFormation.getNumber(properties.MaxEjectionPercent));
    ret.addPropertyResult('maxServerErrors', 'MaxServerErrors', cfn_parse.FromCloudFormation.getNumber(properties.MaxServerErrors));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object representing a virtual node or virtual router listener port mapping.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-portmapping.html
     */
    export interface PortMappingProperty {
        /**
         * The port used for the port mapping.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-portmapping.html#cfn-appmesh-virtualnode-portmapping-port
         */
        readonly port: number;
        /**
         * The protocol used for the port mapping. Specify `http` , `http2` , `grpc` , or `tcp` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-portmapping.html#cfn-appmesh-virtualnode-portmapping-protocol
         */
        readonly protocol: string;
    }
}

/**
 * Determine whether the given properties match those of a `PortMappingProperty`
 *
 * @param properties - the TypeScript properties of a `PortMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_PortMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('port', cdk.requiredValidator)(properties.port));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('protocol', cdk.requiredValidator)(properties.protocol));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    return errors.wrap('supplied properties not correct for "PortMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.PortMapping` resource
 *
 * @param properties - the TypeScript properties of a `PortMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.PortMapping` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodePortMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_PortMappingPropertyValidator(properties).assertSuccess();
    return {
        Port: cdk.numberToCloudFormation(properties.port),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodePortMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.PortMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.PortMappingProperty>();
    ret.addPropertyResult('port', 'Port', cfn_parse.FromCloudFormation.getNumber(properties.Port));
    ret.addPropertyResult('protocol', 'Protocol', cfn_parse.FromCloudFormation.getString(properties.Protocol));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the service discovery information for a virtual node.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-servicediscovery.html
     */
    export interface ServiceDiscoveryProperty {
        /**
         * Specifies any AWS Cloud Map information for the virtual node.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-servicediscovery.html#cfn-appmesh-virtualnode-servicediscovery-awscloudmap
         */
        readonly awsCloudMap?: CfnVirtualNode.AwsCloudMapServiceDiscoveryProperty | cdk.IResolvable;
        /**
         * Specifies the DNS information for the virtual node.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-servicediscovery.html#cfn-appmesh-virtualnode-servicediscovery-dns
         */
        readonly dns?: CfnVirtualNode.DnsServiceDiscoveryProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ServiceDiscoveryProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceDiscoveryProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_ServiceDiscoveryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsCloudMap', CfnVirtualNode_AwsCloudMapServiceDiscoveryPropertyValidator)(properties.awsCloudMap));
    errors.collect(cdk.propertyValidator('dns', CfnVirtualNode_DnsServiceDiscoveryPropertyValidator)(properties.dns));
    return errors.wrap('supplied properties not correct for "ServiceDiscoveryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ServiceDiscovery` resource
 *
 * @param properties - the TypeScript properties of a `ServiceDiscoveryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.ServiceDiscovery` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeServiceDiscoveryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_ServiceDiscoveryPropertyValidator(properties).assertSuccess();
    return {
        AWSCloudMap: cfnVirtualNodeAwsCloudMapServiceDiscoveryPropertyToCloudFormation(properties.awsCloudMap),
        DNS: cfnVirtualNodeDnsServiceDiscoveryPropertyToCloudFormation(properties.dns),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeServiceDiscoveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.ServiceDiscoveryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.ServiceDiscoveryProperty>();
    ret.addPropertyResult('awsCloudMap', 'AWSCloudMap', properties.AWSCloudMap != null ? CfnVirtualNodeAwsCloudMapServiceDiscoveryPropertyFromCloudFormation(properties.AWSCloudMap) : undefined);
    ret.addPropertyResult('dns', 'DNS', properties.DNS != null ? CfnVirtualNodeDnsServiceDiscoveryPropertyFromCloudFormation(properties.DNS) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the methods by which a subject alternative name on a peer Transport Layer Security (TLS) certificate can be matched.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-subjectalternativenamematchers.html
     */
    export interface SubjectAlternativeNameMatchersProperty {
        /**
         * The values sent must match the specified values exactly.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-subjectalternativenamematchers.html#cfn-appmesh-virtualnode-subjectalternativenamematchers-exact
         */
        readonly exact?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `SubjectAlternativeNameMatchersProperty`
 *
 * @param properties - the TypeScript properties of a `SubjectAlternativeNameMatchersProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_SubjectAlternativeNameMatchersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('exact', cdk.listValidator(cdk.validateString))(properties.exact));
    return errors.wrap('supplied properties not correct for "SubjectAlternativeNameMatchersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.SubjectAlternativeNameMatchers` resource
 *
 * @param properties - the TypeScript properties of a `SubjectAlternativeNameMatchersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.SubjectAlternativeNameMatchers` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeSubjectAlternativeNameMatchersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_SubjectAlternativeNameMatchersPropertyValidator(properties).assertSuccess();
    return {
        Exact: cdk.listMapper(cdk.stringToCloudFormation)(properties.exact),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeSubjectAlternativeNameMatchersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.SubjectAlternativeNameMatchersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.SubjectAlternativeNameMatchersProperty>();
    ret.addPropertyResult('exact', 'Exact', properties.Exact != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Exact) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the subject alternative names secured by the certificate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-subjectalternativenames.html
     */
    export interface SubjectAlternativeNamesProperty {
        /**
         * An object that represents the criteria for determining a SANs match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-subjectalternativenames.html#cfn-appmesh-virtualnode-subjectalternativenames-match
         */
        readonly match: CfnVirtualNode.SubjectAlternativeNameMatchersProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SubjectAlternativeNamesProperty`
 *
 * @param properties - the TypeScript properties of a `SubjectAlternativeNamesProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_SubjectAlternativeNamesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('match', cdk.requiredValidator)(properties.match));
    errors.collect(cdk.propertyValidator('match', CfnVirtualNode_SubjectAlternativeNameMatchersPropertyValidator)(properties.match));
    return errors.wrap('supplied properties not correct for "SubjectAlternativeNamesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.SubjectAlternativeNames` resource
 *
 * @param properties - the TypeScript properties of a `SubjectAlternativeNamesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.SubjectAlternativeNames` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeSubjectAlternativeNamesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_SubjectAlternativeNamesPropertyValidator(properties).assertSuccess();
    return {
        Match: cfnVirtualNodeSubjectAlternativeNameMatchersPropertyToCloudFormation(properties.match),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeSubjectAlternativeNamesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.SubjectAlternativeNamesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.SubjectAlternativeNamesProperty>();
    ret.addPropertyResult('match', 'Match', CfnVirtualNodeSubjectAlternativeNameMatchersPropertyFromCloudFormation(properties.Match));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents types of timeouts.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tcptimeout.html
     */
    export interface TcpTimeoutProperty {
        /**
         * An object that represents an idle timeout. An idle timeout bounds the amount of time that a connection may be idle. The default value is none.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tcptimeout.html#cfn-appmesh-virtualnode-tcptimeout-idle
         */
        readonly idle?: CfnVirtualNode.DurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TcpTimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `TcpTimeoutProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_TcpTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('idle', CfnVirtualNode_DurationPropertyValidator)(properties.idle));
    return errors.wrap('supplied properties not correct for "TcpTimeoutProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.TcpTimeout` resource
 *
 * @param properties - the TypeScript properties of a `TcpTimeoutProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.TcpTimeout` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeTcpTimeoutPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_TcpTimeoutPropertyValidator(properties).assertSuccess();
    return {
        Idle: cfnVirtualNodeDurationPropertyToCloudFormation(properties.idle),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeTcpTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.TcpTimeoutProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.TcpTimeoutProperty>();
    ret.addPropertyResult('idle', 'Idle', properties.Idle != null ? CfnVirtualNodeDurationPropertyFromCloudFormation(properties.Idle) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents how the proxy will validate its peer during Transport Layer Security (TLS) negotiation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontext.html
     */
    export interface TlsValidationContextProperty {
        /**
         * A reference to an object that represents the SANs for a Transport Layer Security (TLS) validation context. If you don't specify SANs on the *terminating* mesh endpoint, the Envoy proxy for that node doesn't verify the SAN on a peer client certificate. If you don't specify SANs on the *originating* mesh endpoint, the SAN on the certificate provided by the terminating endpoint must match the mesh endpoint service discovery configuration. Since SPIRE vended certificates have a SPIFFE ID as a name, you must set the SAN since the name doesn't match the service discovery name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontext.html#cfn-appmesh-virtualnode-tlsvalidationcontext-subjectalternativenames
         */
        readonly subjectAlternativeNames?: CfnVirtualNode.SubjectAlternativeNamesProperty | cdk.IResolvable;
        /**
         * A reference to where to retrieve the trust chain when validating a peer’s Transport Layer Security (TLS) certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontext.html#cfn-appmesh-virtualnode-tlsvalidationcontext-trust
         */
        readonly trust: CfnVirtualNode.TlsValidationContextTrustProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TlsValidationContextProperty`
 *
 * @param properties - the TypeScript properties of a `TlsValidationContextProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_TlsValidationContextPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('subjectAlternativeNames', CfnVirtualNode_SubjectAlternativeNamesPropertyValidator)(properties.subjectAlternativeNames));
    errors.collect(cdk.propertyValidator('trust', cdk.requiredValidator)(properties.trust));
    errors.collect(cdk.propertyValidator('trust', CfnVirtualNode_TlsValidationContextTrustPropertyValidator)(properties.trust));
    return errors.wrap('supplied properties not correct for "TlsValidationContextProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.TlsValidationContext` resource
 *
 * @param properties - the TypeScript properties of a `TlsValidationContextProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.TlsValidationContext` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeTlsValidationContextPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_TlsValidationContextPropertyValidator(properties).assertSuccess();
    return {
        SubjectAlternativeNames: cfnVirtualNodeSubjectAlternativeNamesPropertyToCloudFormation(properties.subjectAlternativeNames),
        Trust: cfnVirtualNodeTlsValidationContextTrustPropertyToCloudFormation(properties.trust),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeTlsValidationContextPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.TlsValidationContextProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.TlsValidationContextProperty>();
    ret.addPropertyResult('subjectAlternativeNames', 'SubjectAlternativeNames', properties.SubjectAlternativeNames != null ? CfnVirtualNodeSubjectAlternativeNamesPropertyFromCloudFormation(properties.SubjectAlternativeNames) : undefined);
    ret.addPropertyResult('trust', 'Trust', CfnVirtualNodeTlsValidationContextTrustPropertyFromCloudFormation(properties.Trust));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a Transport Layer Security (TLS) validation context trust for an AWS Certificate Manager certificate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontextacmtrust.html
     */
    export interface TlsValidationContextAcmTrustProperty {
        /**
         * One or more ACM Amazon Resource Name (ARN)s.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontextacmtrust.html#cfn-appmesh-virtualnode-tlsvalidationcontextacmtrust-certificateauthorityarns
         */
        readonly certificateAuthorityArns: string[];
    }
}

/**
 * Determine whether the given properties match those of a `TlsValidationContextAcmTrustProperty`
 *
 * @param properties - the TypeScript properties of a `TlsValidationContextAcmTrustProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_TlsValidationContextAcmTrustPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateAuthorityArns', cdk.requiredValidator)(properties.certificateAuthorityArns));
    errors.collect(cdk.propertyValidator('certificateAuthorityArns', cdk.listValidator(cdk.validateString))(properties.certificateAuthorityArns));
    return errors.wrap('supplied properties not correct for "TlsValidationContextAcmTrustProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.TlsValidationContextAcmTrust` resource
 *
 * @param properties - the TypeScript properties of a `TlsValidationContextAcmTrustProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.TlsValidationContextAcmTrust` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeTlsValidationContextAcmTrustPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_TlsValidationContextAcmTrustPropertyValidator(properties).assertSuccess();
    return {
        CertificateAuthorityArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.certificateAuthorityArns),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeTlsValidationContextAcmTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.TlsValidationContextAcmTrustProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.TlsValidationContextAcmTrustProperty>();
    ret.addPropertyResult('certificateAuthorityArns', 'CertificateAuthorityArns', cfn_parse.FromCloudFormation.getStringArray(properties.CertificateAuthorityArns));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a Transport Layer Security (TLS) validation context trust for a local file.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontextfiletrust.html
     */
    export interface TlsValidationContextFileTrustProperty {
        /**
         * The certificate trust chain for a certificate stored on the file system of the virtual node that the proxy is running on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontextfiletrust.html#cfn-appmesh-virtualnode-tlsvalidationcontextfiletrust-certificatechain
         */
        readonly certificateChain: string;
    }
}

/**
 * Determine whether the given properties match those of a `TlsValidationContextFileTrustProperty`
 *
 * @param properties - the TypeScript properties of a `TlsValidationContextFileTrustProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_TlsValidationContextFileTrustPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateChain', cdk.requiredValidator)(properties.certificateChain));
    errors.collect(cdk.propertyValidator('certificateChain', cdk.validateString)(properties.certificateChain));
    return errors.wrap('supplied properties not correct for "TlsValidationContextFileTrustProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.TlsValidationContextFileTrust` resource
 *
 * @param properties - the TypeScript properties of a `TlsValidationContextFileTrustProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.TlsValidationContextFileTrust` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeTlsValidationContextFileTrustPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_TlsValidationContextFileTrustPropertyValidator(properties).assertSuccess();
    return {
        CertificateChain: cdk.stringToCloudFormation(properties.certificateChain),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeTlsValidationContextFileTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.TlsValidationContextFileTrustProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.TlsValidationContextFileTrustProperty>();
    ret.addPropertyResult('certificateChain', 'CertificateChain', cfn_parse.FromCloudFormation.getString(properties.CertificateChain));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a Transport Layer Security (TLS) Secret Discovery Service validation context trust. The proxy must be configured with a local SDS provider via a Unix Domain Socket. See App Mesh [TLS documentation](https://docs.aws.amazon.com/app-mesh/latest/userguide/tls.html) for more info.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontextsdstrust.html
     */
    export interface TlsValidationContextSdsTrustProperty {
        /**
         * A reference to an object that represents the name of the secret for a Transport Layer Security (TLS) Secret Discovery Service validation context trust.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontextsdstrust.html#cfn-appmesh-virtualnode-tlsvalidationcontextsdstrust-secretname
         */
        readonly secretName: string;
    }
}

/**
 * Determine whether the given properties match those of a `TlsValidationContextSdsTrustProperty`
 *
 * @param properties - the TypeScript properties of a `TlsValidationContextSdsTrustProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_TlsValidationContextSdsTrustPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('secretName', cdk.requiredValidator)(properties.secretName));
    errors.collect(cdk.propertyValidator('secretName', cdk.validateString)(properties.secretName));
    return errors.wrap('supplied properties not correct for "TlsValidationContextSdsTrustProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.TlsValidationContextSdsTrust` resource
 *
 * @param properties - the TypeScript properties of a `TlsValidationContextSdsTrustProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.TlsValidationContextSdsTrust` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeTlsValidationContextSdsTrustPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_TlsValidationContextSdsTrustPropertyValidator(properties).assertSuccess();
    return {
        SecretName: cdk.stringToCloudFormation(properties.secretName),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeTlsValidationContextSdsTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.TlsValidationContextSdsTrustProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.TlsValidationContextSdsTrustProperty>();
    ret.addPropertyResult('secretName', 'SecretName', cfn_parse.FromCloudFormation.getString(properties.SecretName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a Transport Layer Security (TLS) validation context trust.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontexttrust.html
     */
    export interface TlsValidationContextTrustProperty {
        /**
         * A reference to an object that represents a Transport Layer Security (TLS) validation context trust for an AWS Certificate Manager certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontexttrust.html#cfn-appmesh-virtualnode-tlsvalidationcontexttrust-acm
         */
        readonly acm?: CfnVirtualNode.TlsValidationContextAcmTrustProperty | cdk.IResolvable;
        /**
         * An object that represents a Transport Layer Security (TLS) validation context trust for a local file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontexttrust.html#cfn-appmesh-virtualnode-tlsvalidationcontexttrust-file
         */
        readonly file?: CfnVirtualNode.TlsValidationContextFileTrustProperty | cdk.IResolvable;
        /**
         * A reference to an object that represents a Transport Layer Security (TLS) Secret Discovery Service validation context trust.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-tlsvalidationcontexttrust.html#cfn-appmesh-virtualnode-tlsvalidationcontexttrust-sds
         */
        readonly sds?: CfnVirtualNode.TlsValidationContextSdsTrustProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TlsValidationContextTrustProperty`
 *
 * @param properties - the TypeScript properties of a `TlsValidationContextTrustProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_TlsValidationContextTrustPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acm', CfnVirtualNode_TlsValidationContextAcmTrustPropertyValidator)(properties.acm));
    errors.collect(cdk.propertyValidator('file', CfnVirtualNode_TlsValidationContextFileTrustPropertyValidator)(properties.file));
    errors.collect(cdk.propertyValidator('sds', CfnVirtualNode_TlsValidationContextSdsTrustPropertyValidator)(properties.sds));
    return errors.wrap('supplied properties not correct for "TlsValidationContextTrustProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.TlsValidationContextTrust` resource
 *
 * @param properties - the TypeScript properties of a `TlsValidationContextTrustProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.TlsValidationContextTrust` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeTlsValidationContextTrustPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_TlsValidationContextTrustPropertyValidator(properties).assertSuccess();
    return {
        ACM: cfnVirtualNodeTlsValidationContextAcmTrustPropertyToCloudFormation(properties.acm),
        File: cfnVirtualNodeTlsValidationContextFileTrustPropertyToCloudFormation(properties.file),
        SDS: cfnVirtualNodeTlsValidationContextSdsTrustPropertyToCloudFormation(properties.sds),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeTlsValidationContextTrustPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.TlsValidationContextTrustProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.TlsValidationContextTrustProperty>();
    ret.addPropertyResult('acm', 'ACM', properties.ACM != null ? CfnVirtualNodeTlsValidationContextAcmTrustPropertyFromCloudFormation(properties.ACM) : undefined);
    ret.addPropertyResult('file', 'File', properties.File != null ? CfnVirtualNodeTlsValidationContextFileTrustPropertyFromCloudFormation(properties.File) : undefined);
    ret.addPropertyResult('sds', 'SDS', properties.SDS != null ? CfnVirtualNodeTlsValidationContextSdsTrustPropertyFromCloudFormation(properties.SDS) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the type of virtual node connection pool.
     *
     * Only one protocol is used at a time and should be the same protocol as the one chosen under port mapping.
     *
     * If not present the default value for `maxPendingRequests` is `2147483647` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodeconnectionpool.html
     */
    export interface VirtualNodeConnectionPoolProperty {
        /**
         * An object that represents a type of connection pool.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodeconnectionpool.html#cfn-appmesh-virtualnode-virtualnodeconnectionpool-grpc
         */
        readonly grpc?: CfnVirtualNode.VirtualNodeGrpcConnectionPoolProperty | cdk.IResolvable;
        /**
         * An object that represents a type of connection pool.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodeconnectionpool.html#cfn-appmesh-virtualnode-virtualnodeconnectionpool-http
         */
        readonly http?: CfnVirtualNode.VirtualNodeHttpConnectionPoolProperty | cdk.IResolvable;
        /**
         * An object that represents a type of connection pool.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodeconnectionpool.html#cfn-appmesh-virtualnode-virtualnodeconnectionpool-http2
         */
        readonly http2?: CfnVirtualNode.VirtualNodeHttp2ConnectionPoolProperty | cdk.IResolvable;
        /**
         * An object that represents a type of connection pool.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodeconnectionpool.html#cfn-appmesh-virtualnode-virtualnodeconnectionpool-tcp
         */
        readonly tcp?: CfnVirtualNode.VirtualNodeTcpConnectionPoolProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualNodeConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualNodeConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_VirtualNodeConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('grpc', CfnVirtualNode_VirtualNodeGrpcConnectionPoolPropertyValidator)(properties.grpc));
    errors.collect(cdk.propertyValidator('http', CfnVirtualNode_VirtualNodeHttpConnectionPoolPropertyValidator)(properties.http));
    errors.collect(cdk.propertyValidator('http2', CfnVirtualNode_VirtualNodeHttp2ConnectionPoolPropertyValidator)(properties.http2));
    errors.collect(cdk.propertyValidator('tcp', CfnVirtualNode_VirtualNodeTcpConnectionPoolPropertyValidator)(properties.tcp));
    return errors.wrap('supplied properties not correct for "VirtualNodeConnectionPoolProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.VirtualNodeConnectionPool` resource
 *
 * @param properties - the TypeScript properties of a `VirtualNodeConnectionPoolProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.VirtualNodeConnectionPool` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeVirtualNodeConnectionPoolPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_VirtualNodeConnectionPoolPropertyValidator(properties).assertSuccess();
    return {
        GRPC: cfnVirtualNodeVirtualNodeGrpcConnectionPoolPropertyToCloudFormation(properties.grpc),
        HTTP: cfnVirtualNodeVirtualNodeHttpConnectionPoolPropertyToCloudFormation(properties.http),
        HTTP2: cfnVirtualNodeVirtualNodeHttp2ConnectionPoolPropertyToCloudFormation(properties.http2),
        TCP: cfnVirtualNodeVirtualNodeTcpConnectionPoolPropertyToCloudFormation(properties.tcp),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.VirtualNodeConnectionPoolProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.VirtualNodeConnectionPoolProperty>();
    ret.addPropertyResult('grpc', 'GRPC', properties.GRPC != null ? CfnVirtualNodeVirtualNodeGrpcConnectionPoolPropertyFromCloudFormation(properties.GRPC) : undefined);
    ret.addPropertyResult('http', 'HTTP', properties.HTTP != null ? CfnVirtualNodeVirtualNodeHttpConnectionPoolPropertyFromCloudFormation(properties.HTTP) : undefined);
    ret.addPropertyResult('http2', 'HTTP2', properties.HTTP2 != null ? CfnVirtualNodeVirtualNodeHttp2ConnectionPoolPropertyFromCloudFormation(properties.HTTP2) : undefined);
    ret.addPropertyResult('tcp', 'TCP', properties.TCP != null ? CfnVirtualNodeVirtualNodeTcpConnectionPoolPropertyFromCloudFormation(properties.TCP) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a type of connection pool.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodegrpcconnectionpool.html
     */
    export interface VirtualNodeGrpcConnectionPoolProperty {
        /**
         * Maximum number of inflight requests Envoy can concurrently support across hosts in upstream cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodegrpcconnectionpool.html#cfn-appmesh-virtualnode-virtualnodegrpcconnectionpool-maxrequests
         */
        readonly maxRequests: number;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualNodeGrpcConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualNodeGrpcConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_VirtualNodeGrpcConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxRequests', cdk.requiredValidator)(properties.maxRequests));
    errors.collect(cdk.propertyValidator('maxRequests', cdk.validateNumber)(properties.maxRequests));
    return errors.wrap('supplied properties not correct for "VirtualNodeGrpcConnectionPoolProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.VirtualNodeGrpcConnectionPool` resource
 *
 * @param properties - the TypeScript properties of a `VirtualNodeGrpcConnectionPoolProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.VirtualNodeGrpcConnectionPool` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeVirtualNodeGrpcConnectionPoolPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_VirtualNodeGrpcConnectionPoolPropertyValidator(properties).assertSuccess();
    return {
        MaxRequests: cdk.numberToCloudFormation(properties.maxRequests),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeGrpcConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.VirtualNodeGrpcConnectionPoolProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.VirtualNodeGrpcConnectionPoolProperty>();
    ret.addPropertyResult('maxRequests', 'MaxRequests', cfn_parse.FromCloudFormation.getNumber(properties.MaxRequests));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a type of connection pool.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodehttp2connectionpool.html
     */
    export interface VirtualNodeHttp2ConnectionPoolProperty {
        /**
         * Maximum number of inflight requests Envoy can concurrently support across hosts in upstream cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodehttp2connectionpool.html#cfn-appmesh-virtualnode-virtualnodehttp2connectionpool-maxrequests
         */
        readonly maxRequests: number;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualNodeHttp2ConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualNodeHttp2ConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_VirtualNodeHttp2ConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxRequests', cdk.requiredValidator)(properties.maxRequests));
    errors.collect(cdk.propertyValidator('maxRequests', cdk.validateNumber)(properties.maxRequests));
    return errors.wrap('supplied properties not correct for "VirtualNodeHttp2ConnectionPoolProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.VirtualNodeHttp2ConnectionPool` resource
 *
 * @param properties - the TypeScript properties of a `VirtualNodeHttp2ConnectionPoolProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.VirtualNodeHttp2ConnectionPool` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeVirtualNodeHttp2ConnectionPoolPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_VirtualNodeHttp2ConnectionPoolPropertyValidator(properties).assertSuccess();
    return {
        MaxRequests: cdk.numberToCloudFormation(properties.maxRequests),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeHttp2ConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.VirtualNodeHttp2ConnectionPoolProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.VirtualNodeHttp2ConnectionPoolProperty>();
    ret.addPropertyResult('maxRequests', 'MaxRequests', cfn_parse.FromCloudFormation.getNumber(properties.MaxRequests));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a type of connection pool.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodehttpconnectionpool.html
     */
    export interface VirtualNodeHttpConnectionPoolProperty {
        /**
         * Maximum number of outbound TCP connections Envoy can establish concurrently with all hosts in upstream cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodehttpconnectionpool.html#cfn-appmesh-virtualnode-virtualnodehttpconnectionpool-maxconnections
         */
        readonly maxConnections: number;
        /**
         * Number of overflowing requests after `max_connections` Envoy will queue to upstream cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodehttpconnectionpool.html#cfn-appmesh-virtualnode-virtualnodehttpconnectionpool-maxpendingrequests
         */
        readonly maxPendingRequests?: number;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualNodeHttpConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualNodeHttpConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_VirtualNodeHttpConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxConnections', cdk.requiredValidator)(properties.maxConnections));
    errors.collect(cdk.propertyValidator('maxConnections', cdk.validateNumber)(properties.maxConnections));
    errors.collect(cdk.propertyValidator('maxPendingRequests', cdk.validateNumber)(properties.maxPendingRequests));
    return errors.wrap('supplied properties not correct for "VirtualNodeHttpConnectionPoolProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.VirtualNodeHttpConnectionPool` resource
 *
 * @param properties - the TypeScript properties of a `VirtualNodeHttpConnectionPoolProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.VirtualNodeHttpConnectionPool` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeVirtualNodeHttpConnectionPoolPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_VirtualNodeHttpConnectionPoolPropertyValidator(properties).assertSuccess();
    return {
        MaxConnections: cdk.numberToCloudFormation(properties.maxConnections),
        MaxPendingRequests: cdk.numberToCloudFormation(properties.maxPendingRequests),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeHttpConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.VirtualNodeHttpConnectionPoolProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.VirtualNodeHttpConnectionPoolProperty>();
    ret.addPropertyResult('maxConnections', 'MaxConnections', cfn_parse.FromCloudFormation.getNumber(properties.MaxConnections));
    ret.addPropertyResult('maxPendingRequests', 'MaxPendingRequests', properties.MaxPendingRequests != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxPendingRequests) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents the specification of a virtual node.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodespec.html
     */
    export interface VirtualNodeSpecProperty {
        /**
         * A reference to an object that represents the defaults for backends.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodespec.html#cfn-appmesh-virtualnode-virtualnodespec-backenddefaults
         */
        readonly backendDefaults?: CfnVirtualNode.BackendDefaultsProperty | cdk.IResolvable;
        /**
         * The backends that the virtual node is expected to send outbound traffic to.
         *
         * > App Mesh doesn't validate the existence of those virtual services specified in backends. This is to prevent a cyclic dependency between virtual nodes and virtual services creation. Make sure the virtual service name is correct. The virtual service can be created afterwards if it doesn't already exist.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodespec.html#cfn-appmesh-virtualnode-virtualnodespec-backends
         */
        readonly backends?: Array<CfnVirtualNode.BackendProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The listener that the virtual node is expected to receive inbound traffic from. You can specify one listener.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodespec.html#cfn-appmesh-virtualnode-virtualnodespec-listeners
         */
        readonly listeners?: Array<CfnVirtualNode.ListenerProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The inbound and outbound access logging information for the virtual node.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodespec.html#cfn-appmesh-virtualnode-virtualnodespec-logging
         */
        readonly logging?: CfnVirtualNode.LoggingProperty | cdk.IResolvable;
        /**
         * The service discovery information for the virtual node. If your virtual node does not expect ingress traffic, you can omit this parameter. If you specify a `listener` , then you must specify service discovery information.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodespec.html#cfn-appmesh-virtualnode-virtualnodespec-servicediscovery
         */
        readonly serviceDiscovery?: CfnVirtualNode.ServiceDiscoveryProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualNodeSpecProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualNodeSpecProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_VirtualNodeSpecPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('backendDefaults', CfnVirtualNode_BackendDefaultsPropertyValidator)(properties.backendDefaults));
    errors.collect(cdk.propertyValidator('backends', cdk.listValidator(CfnVirtualNode_BackendPropertyValidator))(properties.backends));
    errors.collect(cdk.propertyValidator('listeners', cdk.listValidator(CfnVirtualNode_ListenerPropertyValidator))(properties.listeners));
    errors.collect(cdk.propertyValidator('logging', CfnVirtualNode_LoggingPropertyValidator)(properties.logging));
    errors.collect(cdk.propertyValidator('serviceDiscovery', CfnVirtualNode_ServiceDiscoveryPropertyValidator)(properties.serviceDiscovery));
    return errors.wrap('supplied properties not correct for "VirtualNodeSpecProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.VirtualNodeSpec` resource
 *
 * @param properties - the TypeScript properties of a `VirtualNodeSpecProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.VirtualNodeSpec` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeVirtualNodeSpecPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_VirtualNodeSpecPropertyValidator(properties).assertSuccess();
    return {
        BackendDefaults: cfnVirtualNodeBackendDefaultsPropertyToCloudFormation(properties.backendDefaults),
        Backends: cdk.listMapper(cfnVirtualNodeBackendPropertyToCloudFormation)(properties.backends),
        Listeners: cdk.listMapper(cfnVirtualNodeListenerPropertyToCloudFormation)(properties.listeners),
        Logging: cfnVirtualNodeLoggingPropertyToCloudFormation(properties.logging),
        ServiceDiscovery: cfnVirtualNodeServiceDiscoveryPropertyToCloudFormation(properties.serviceDiscovery),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeSpecPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.VirtualNodeSpecProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.VirtualNodeSpecProperty>();
    ret.addPropertyResult('backendDefaults', 'BackendDefaults', properties.BackendDefaults != null ? CfnVirtualNodeBackendDefaultsPropertyFromCloudFormation(properties.BackendDefaults) : undefined);
    ret.addPropertyResult('backends', 'Backends', properties.Backends != null ? cfn_parse.FromCloudFormation.getArray(CfnVirtualNodeBackendPropertyFromCloudFormation)(properties.Backends) : undefined);
    ret.addPropertyResult('listeners', 'Listeners', properties.Listeners != null ? cfn_parse.FromCloudFormation.getArray(CfnVirtualNodeListenerPropertyFromCloudFormation)(properties.Listeners) : undefined);
    ret.addPropertyResult('logging', 'Logging', properties.Logging != null ? CfnVirtualNodeLoggingPropertyFromCloudFormation(properties.Logging) : undefined);
    ret.addPropertyResult('serviceDiscovery', 'ServiceDiscovery', properties.ServiceDiscovery != null ? CfnVirtualNodeServiceDiscoveryPropertyFromCloudFormation(properties.ServiceDiscovery) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a type of connection pool.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodetcpconnectionpool.html
     */
    export interface VirtualNodeTcpConnectionPoolProperty {
        /**
         * Maximum number of outbound TCP connections Envoy can establish concurrently with all hosts in upstream cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualnodetcpconnectionpool.html#cfn-appmesh-virtualnode-virtualnodetcpconnectionpool-maxconnections
         */
        readonly maxConnections: number;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualNodeTcpConnectionPoolProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualNodeTcpConnectionPoolProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_VirtualNodeTcpConnectionPoolPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxConnections', cdk.requiredValidator)(properties.maxConnections));
    errors.collect(cdk.propertyValidator('maxConnections', cdk.validateNumber)(properties.maxConnections));
    return errors.wrap('supplied properties not correct for "VirtualNodeTcpConnectionPoolProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.VirtualNodeTcpConnectionPool` resource
 *
 * @param properties - the TypeScript properties of a `VirtualNodeTcpConnectionPoolProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.VirtualNodeTcpConnectionPool` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeVirtualNodeTcpConnectionPoolPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_VirtualNodeTcpConnectionPoolPropertyValidator(properties).assertSuccess();
    return {
        MaxConnections: cdk.numberToCloudFormation(properties.maxConnections),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeVirtualNodeTcpConnectionPoolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.VirtualNodeTcpConnectionPoolProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.VirtualNodeTcpConnectionPoolProperty>();
    ret.addPropertyResult('maxConnections', 'MaxConnections', cfn_parse.FromCloudFormation.getNumber(properties.MaxConnections));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualNode {
    /**
     * An object that represents a virtual service backend for a virtual node.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualservicebackend.html
     */
    export interface VirtualServiceBackendProperty {
        /**
         * A reference to an object that represents the client policy for a backend.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualservicebackend.html#cfn-appmesh-virtualnode-virtualservicebackend-clientpolicy
         */
        readonly clientPolicy?: CfnVirtualNode.ClientPolicyProperty | cdk.IResolvable;
        /**
         * The name of the virtual service that is acting as a virtual node backend.
         *
         * > App Mesh doesn't validate the existence of those virtual services specified in backends. This is to prevent a cyclic dependency between virtual nodes and virtual services creation. Make sure the virtual service name is correct. The virtual service can be created afterwards if it doesn't already exist.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-virtualservicebackend.html#cfn-appmesh-virtualnode-virtualservicebackend-virtualservicename
         */
        readonly virtualServiceName: string;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualServiceBackendProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualServiceBackendProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualNode_VirtualServiceBackendPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clientPolicy', CfnVirtualNode_ClientPolicyPropertyValidator)(properties.clientPolicy));
    errors.collect(cdk.propertyValidator('virtualServiceName', cdk.requiredValidator)(properties.virtualServiceName));
    errors.collect(cdk.propertyValidator('virtualServiceName', cdk.validateString)(properties.virtualServiceName));
    return errors.wrap('supplied properties not correct for "VirtualServiceBackendProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.VirtualServiceBackend` resource
 *
 * @param properties - the TypeScript properties of a `VirtualServiceBackendProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualNode.VirtualServiceBackend` resource.
 */
// @ts-ignore TS6133
function cfnVirtualNodeVirtualServiceBackendPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualNode_VirtualServiceBackendPropertyValidator(properties).assertSuccess();
    return {
        ClientPolicy: cfnVirtualNodeClientPolicyPropertyToCloudFormation(properties.clientPolicy),
        VirtualServiceName: cdk.stringToCloudFormation(properties.virtualServiceName),
    };
}

// @ts-ignore TS6133
function CfnVirtualNodeVirtualServiceBackendPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualNode.VirtualServiceBackendProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualNode.VirtualServiceBackendProperty>();
    ret.addPropertyResult('clientPolicy', 'ClientPolicy', properties.ClientPolicy != null ? CfnVirtualNodeClientPolicyPropertyFromCloudFormation(properties.ClientPolicy) : undefined);
    ret.addPropertyResult('virtualServiceName', 'VirtualServiceName', cfn_parse.FromCloudFormation.getString(properties.VirtualServiceName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnVirtualRouter`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html
 */
export interface CfnVirtualRouterProps {

    /**
     * The name of the service mesh to create the virtual router in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html#cfn-appmesh-virtualrouter-meshname
     */
    readonly meshName: string;

    /**
     * The virtual router specification to apply.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html#cfn-appmesh-virtualrouter-spec
     */
    readonly spec: CfnVirtualRouter.VirtualRouterSpecProperty | cdk.IResolvable;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then the account that you specify must share the mesh with your account before you can create the resource in the service mesh. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html#cfn-appmesh-virtualrouter-meshowner
     */
    readonly meshOwner?: string;

    /**
     * Optional metadata that you can apply to the virtual router to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html#cfn-appmesh-virtualrouter-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The name to use for the virtual router.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html#cfn-appmesh-virtualrouter-virtualroutername
     */
    readonly virtualRouterName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnVirtualRouterProps`
 *
 * @param properties - the TypeScript properties of a `CfnVirtualRouterProps`
 *
 * @returns the result of the validation.
 */
function CfnVirtualRouterPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('meshName', cdk.requiredValidator)(properties.meshName));
    errors.collect(cdk.propertyValidator('meshName', cdk.validateString)(properties.meshName));
    errors.collect(cdk.propertyValidator('meshOwner', cdk.validateString)(properties.meshOwner));
    errors.collect(cdk.propertyValidator('spec', cdk.requiredValidator)(properties.spec));
    errors.collect(cdk.propertyValidator('spec', CfnVirtualRouter_VirtualRouterSpecPropertyValidator)(properties.spec));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('virtualRouterName', cdk.validateString)(properties.virtualRouterName));
    return errors.wrap('supplied properties not correct for "CfnVirtualRouterProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualRouter` resource
 *
 * @param properties - the TypeScript properties of a `CfnVirtualRouterProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualRouter` resource.
 */
// @ts-ignore TS6133
function cfnVirtualRouterPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualRouterPropsValidator(properties).assertSuccess();
    return {
        MeshName: cdk.stringToCloudFormation(properties.meshName),
        Spec: cfnVirtualRouterVirtualRouterSpecPropertyToCloudFormation(properties.spec),
        MeshOwner: cdk.stringToCloudFormation(properties.meshOwner),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VirtualRouterName: cdk.stringToCloudFormation(properties.virtualRouterName),
    };
}

// @ts-ignore TS6133
function CfnVirtualRouterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualRouterProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualRouterProps>();
    ret.addPropertyResult('meshName', 'MeshName', cfn_parse.FromCloudFormation.getString(properties.MeshName));
    ret.addPropertyResult('spec', 'Spec', CfnVirtualRouterVirtualRouterSpecPropertyFromCloudFormation(properties.Spec));
    ret.addPropertyResult('meshOwner', 'MeshOwner', properties.MeshOwner != null ? cfn_parse.FromCloudFormation.getString(properties.MeshOwner) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('virtualRouterName', 'VirtualRouterName', properties.VirtualRouterName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualRouterName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppMesh::VirtualRouter`
 *
 * Creates a virtual router within a service mesh.
 *
 * Specify a `listener` for any inbound traffic that your virtual router receives. Create a virtual router for each protocol and port that you need to route. Virtual routers handle traffic for one or more virtual services within your mesh. After you create your virtual router, create and associate routes for your virtual router that direct incoming requests to different virtual nodes.
 *
 * For more information about virtual routers, see [Virtual routers](https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_routers.html) .
 *
 * @cloudformationResource AWS::AppMesh::VirtualRouter
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html
 */
export class CfnVirtualRouter extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppMesh::VirtualRouter";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVirtualRouter {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnVirtualRouterPropsFromCloudFormation(resourceProperties);
        const ret = new CfnVirtualRouter(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The full Amazon Resource Name (ARN) for the virtual router.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the service mesh that the virtual router resides in.
     * @cloudformationAttribute MeshName
     */
    public readonly attrMeshName: string;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     * @cloudformationAttribute MeshOwner
     */
    public readonly attrMeshOwner: string;

    /**
     * The AWS IAM account ID of the resource owner. If the account ID is not your own, then it's the ID of the mesh owner or of another account that the mesh is shared with. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     * @cloudformationAttribute ResourceOwner
     */
    public readonly attrResourceOwner: string;

    /**
     * The unique identifier for the virtual router.
     * @cloudformationAttribute Uid
     */
    public readonly attrUid: string;

    /**
     * The name of the virtual router.
     * @cloudformationAttribute VirtualRouterName
     */
    public readonly attrVirtualRouterName: string;

    /**
     * The name of the service mesh to create the virtual router in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html#cfn-appmesh-virtualrouter-meshname
     */
    public meshName: string;

    /**
     * The virtual router specification to apply.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html#cfn-appmesh-virtualrouter-spec
     */
    public spec: CfnVirtualRouter.VirtualRouterSpecProperty | cdk.IResolvable;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then the account that you specify must share the mesh with your account before you can create the resource in the service mesh. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html#cfn-appmesh-virtualrouter-meshowner
     */
    public meshOwner: string | undefined;

    /**
     * Optional metadata that you can apply to the virtual router to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html#cfn-appmesh-virtualrouter-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The name to use for the virtual router.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualrouter.html#cfn-appmesh-virtualrouter-virtualroutername
     */
    public virtualRouterName: string | undefined;

    /**
     * Create a new `AWS::AppMesh::VirtualRouter`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnVirtualRouterProps) {
        super(scope, id, { type: CfnVirtualRouter.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'meshName', this);
        cdk.requireProperty(props, 'spec', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrMeshName = cdk.Token.asString(this.getAtt('MeshName', cdk.ResolutionTypeHint.STRING));
        this.attrMeshOwner = cdk.Token.asString(this.getAtt('MeshOwner', cdk.ResolutionTypeHint.STRING));
        this.attrResourceOwner = cdk.Token.asString(this.getAtt('ResourceOwner', cdk.ResolutionTypeHint.STRING));
        this.attrUid = cdk.Token.asString(this.getAtt('Uid', cdk.ResolutionTypeHint.STRING));
        this.attrVirtualRouterName = cdk.Token.asString(this.getAtt('VirtualRouterName', cdk.ResolutionTypeHint.STRING));

        this.meshName = props.meshName;
        this.spec = props.spec;
        this.meshOwner = props.meshOwner;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppMesh::VirtualRouter", props.tags, { tagPropertyName: 'tags' });
        this.virtualRouterName = props.virtualRouterName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnVirtualRouter.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            meshName: this.meshName,
            spec: this.spec,
            meshOwner: this.meshOwner,
            tags: this.tags.renderTags(),
            virtualRouterName: this.virtualRouterName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnVirtualRouterPropsToCloudFormation(props);
    }
}

export namespace CfnVirtualRouter {
    /**
     * An object representing a virtual router listener port mapping.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualrouter-portmapping.html
     */
    export interface PortMappingProperty {
        /**
         * The port used for the port mapping.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualrouter-portmapping.html#cfn-appmesh-virtualrouter-portmapping-port
         */
        readonly port: number;
        /**
         * The protocol used for the port mapping. Specify one protocol.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualrouter-portmapping.html#cfn-appmesh-virtualrouter-portmapping-protocol
         */
        readonly protocol: string;
    }
}

/**
 * Determine whether the given properties match those of a `PortMappingProperty`
 *
 * @param properties - the TypeScript properties of a `PortMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualRouter_PortMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('port', cdk.requiredValidator)(properties.port));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('protocol', cdk.requiredValidator)(properties.protocol));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    return errors.wrap('supplied properties not correct for "PortMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualRouter.PortMapping` resource
 *
 * @param properties - the TypeScript properties of a `PortMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualRouter.PortMapping` resource.
 */
// @ts-ignore TS6133
function cfnVirtualRouterPortMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualRouter_PortMappingPropertyValidator(properties).assertSuccess();
    return {
        Port: cdk.numberToCloudFormation(properties.port),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
    };
}

// @ts-ignore TS6133
function CfnVirtualRouterPortMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualRouter.PortMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualRouter.PortMappingProperty>();
    ret.addPropertyResult('port', 'Port', cfn_parse.FromCloudFormation.getNumber(properties.Port));
    ret.addPropertyResult('protocol', 'Protocol', cfn_parse.FromCloudFormation.getString(properties.Protocol));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualRouter {
    /**
     * An object that represents a virtual router listener.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualrouter-virtualrouterlistener.html
     */
    export interface VirtualRouterListenerProperty {
        /**
         * The port mapping information for the listener.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualrouter-virtualrouterlistener.html#cfn-appmesh-virtualrouter-virtualrouterlistener-portmapping
         */
        readonly portMapping: CfnVirtualRouter.PortMappingProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualRouterListenerProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualRouterListenerProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualRouter_VirtualRouterListenerPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('portMapping', cdk.requiredValidator)(properties.portMapping));
    errors.collect(cdk.propertyValidator('portMapping', CfnVirtualRouter_PortMappingPropertyValidator)(properties.portMapping));
    return errors.wrap('supplied properties not correct for "VirtualRouterListenerProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualRouter.VirtualRouterListener` resource
 *
 * @param properties - the TypeScript properties of a `VirtualRouterListenerProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualRouter.VirtualRouterListener` resource.
 */
// @ts-ignore TS6133
function cfnVirtualRouterVirtualRouterListenerPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualRouter_VirtualRouterListenerPropertyValidator(properties).assertSuccess();
    return {
        PortMapping: cfnVirtualRouterPortMappingPropertyToCloudFormation(properties.portMapping),
    };
}

// @ts-ignore TS6133
function CfnVirtualRouterVirtualRouterListenerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualRouter.VirtualRouterListenerProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualRouter.VirtualRouterListenerProperty>();
    ret.addPropertyResult('portMapping', 'PortMapping', CfnVirtualRouterPortMappingPropertyFromCloudFormation(properties.PortMapping));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualRouter {
    /**
     * An object that represents the specification of a virtual router.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualrouter-virtualrouterspec.html
     */
    export interface VirtualRouterSpecProperty {
        /**
         * The listeners that the virtual router is expected to receive inbound traffic from.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualrouter-virtualrouterspec.html#cfn-appmesh-virtualrouter-virtualrouterspec-listeners
         */
        readonly listeners: Array<CfnVirtualRouter.VirtualRouterListenerProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualRouterSpecProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualRouterSpecProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualRouter_VirtualRouterSpecPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('listeners', cdk.requiredValidator)(properties.listeners));
    errors.collect(cdk.propertyValidator('listeners', cdk.listValidator(CfnVirtualRouter_VirtualRouterListenerPropertyValidator))(properties.listeners));
    return errors.wrap('supplied properties not correct for "VirtualRouterSpecProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualRouter.VirtualRouterSpec` resource
 *
 * @param properties - the TypeScript properties of a `VirtualRouterSpecProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualRouter.VirtualRouterSpec` resource.
 */
// @ts-ignore TS6133
function cfnVirtualRouterVirtualRouterSpecPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualRouter_VirtualRouterSpecPropertyValidator(properties).assertSuccess();
    return {
        Listeners: cdk.listMapper(cfnVirtualRouterVirtualRouterListenerPropertyToCloudFormation)(properties.listeners),
    };
}

// @ts-ignore TS6133
function CfnVirtualRouterVirtualRouterSpecPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualRouter.VirtualRouterSpecProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualRouter.VirtualRouterSpecProperty>();
    ret.addPropertyResult('listeners', 'Listeners', cfn_parse.FromCloudFormation.getArray(CfnVirtualRouterVirtualRouterListenerPropertyFromCloudFormation)(properties.Listeners));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnVirtualService`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html
 */
export interface CfnVirtualServiceProps {

    /**
     * The name of the service mesh to create the virtual service in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html#cfn-appmesh-virtualservice-meshname
     */
    readonly meshName: string;

    /**
     * The virtual service specification to apply.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html#cfn-appmesh-virtualservice-spec
     */
    readonly spec: CfnVirtualService.VirtualServiceSpecProperty | cdk.IResolvable;

    /**
     * The name to use for the virtual service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html#cfn-appmesh-virtualservice-virtualservicename
     */
    readonly virtualServiceName: string;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then the account that you specify must share the mesh with your account before you can create the resource in the service mesh. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html#cfn-appmesh-virtualservice-meshowner
     */
    readonly meshOwner?: string;

    /**
     * Optional metadata that you can apply to the virtual service to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html#cfn-appmesh-virtualservice-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnVirtualServiceProps`
 *
 * @param properties - the TypeScript properties of a `CfnVirtualServiceProps`
 *
 * @returns the result of the validation.
 */
function CfnVirtualServicePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('meshName', cdk.requiredValidator)(properties.meshName));
    errors.collect(cdk.propertyValidator('meshName', cdk.validateString)(properties.meshName));
    errors.collect(cdk.propertyValidator('meshOwner', cdk.validateString)(properties.meshOwner));
    errors.collect(cdk.propertyValidator('spec', cdk.requiredValidator)(properties.spec));
    errors.collect(cdk.propertyValidator('spec', CfnVirtualService_VirtualServiceSpecPropertyValidator)(properties.spec));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('virtualServiceName', cdk.requiredValidator)(properties.virtualServiceName));
    errors.collect(cdk.propertyValidator('virtualServiceName', cdk.validateString)(properties.virtualServiceName));
    return errors.wrap('supplied properties not correct for "CfnVirtualServiceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualService` resource
 *
 * @param properties - the TypeScript properties of a `CfnVirtualServiceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualService` resource.
 */
// @ts-ignore TS6133
function cfnVirtualServicePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualServicePropsValidator(properties).assertSuccess();
    return {
        MeshName: cdk.stringToCloudFormation(properties.meshName),
        Spec: cfnVirtualServiceVirtualServiceSpecPropertyToCloudFormation(properties.spec),
        VirtualServiceName: cdk.stringToCloudFormation(properties.virtualServiceName),
        MeshOwner: cdk.stringToCloudFormation(properties.meshOwner),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnVirtualServicePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualServiceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualServiceProps>();
    ret.addPropertyResult('meshName', 'MeshName', cfn_parse.FromCloudFormation.getString(properties.MeshName));
    ret.addPropertyResult('spec', 'Spec', CfnVirtualServiceVirtualServiceSpecPropertyFromCloudFormation(properties.Spec));
    ret.addPropertyResult('virtualServiceName', 'VirtualServiceName', cfn_parse.FromCloudFormation.getString(properties.VirtualServiceName));
    ret.addPropertyResult('meshOwner', 'MeshOwner', properties.MeshOwner != null ? cfn_parse.FromCloudFormation.getString(properties.MeshOwner) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppMesh::VirtualService`
 *
 * Creates a virtual service within a service mesh.
 *
 * A virtual service is an abstraction of a real service that is provided by a virtual node directly or indirectly by means of a virtual router. Dependent services call your virtual service by its `virtualServiceName` , and those requests are routed to the virtual node or virtual router that is specified as the provider for the virtual service.
 *
 * For more information about virtual services, see [Virtual services](https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_services.html) .
 *
 * @cloudformationResource AWS::AppMesh::VirtualService
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html
 */
export class CfnVirtualService extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppMesh::VirtualService";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVirtualService {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnVirtualServicePropsFromCloudFormation(resourceProperties);
        const ret = new CfnVirtualService(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The full Amazon Resource Name (ARN) for the virtual service.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the service mesh that the virtual service resides in.
     * @cloudformationAttribute MeshName
     */
    public readonly attrMeshName: string;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then it's the ID of the account that shared the mesh with your account. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     * @cloudformationAttribute MeshOwner
     */
    public readonly attrMeshOwner: string;

    /**
     * The AWS IAM account ID of the resource owner. If the account ID is not your own, then it's the ID of the mesh owner or of another account that the mesh is shared with. For more information about mesh sharing, see [Working with Shared Meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     * @cloudformationAttribute ResourceOwner
     */
    public readonly attrResourceOwner: string;

    /**
     * The unique identifier for the virtual service.
     * @cloudformationAttribute Uid
     */
    public readonly attrUid: string;

    /**
     * The name of the virtual service.
     * @cloudformationAttribute VirtualServiceName
     */
    public readonly attrVirtualServiceName: string;

    /**
     * The name of the service mesh to create the virtual service in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html#cfn-appmesh-virtualservice-meshname
     */
    public meshName: string;

    /**
     * The virtual service specification to apply.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html#cfn-appmesh-virtualservice-spec
     */
    public spec: CfnVirtualService.VirtualServiceSpecProperty | cdk.IResolvable;

    /**
     * The name to use for the virtual service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html#cfn-appmesh-virtualservice-virtualservicename
     */
    public virtualServiceName: string;

    /**
     * The AWS IAM account ID of the service mesh owner. If the account ID is not your own, then the account that you specify must share the mesh with your account before you can create the resource in the service mesh. For more information about mesh sharing, see [Working with shared meshes](https://docs.aws.amazon.com/app-mesh/latest/userguide/sharing.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html#cfn-appmesh-virtualservice-meshowner
     */
    public meshOwner: string | undefined;

    /**
     * Optional metadata that you can apply to the virtual service to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appmesh-virtualservice.html#cfn-appmesh-virtualservice-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::AppMesh::VirtualService`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnVirtualServiceProps) {
        super(scope, id, { type: CfnVirtualService.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'meshName', this);
        cdk.requireProperty(props, 'spec', this);
        cdk.requireProperty(props, 'virtualServiceName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrMeshName = cdk.Token.asString(this.getAtt('MeshName', cdk.ResolutionTypeHint.STRING));
        this.attrMeshOwner = cdk.Token.asString(this.getAtt('MeshOwner', cdk.ResolutionTypeHint.STRING));
        this.attrResourceOwner = cdk.Token.asString(this.getAtt('ResourceOwner', cdk.ResolutionTypeHint.STRING));
        this.attrUid = cdk.Token.asString(this.getAtt('Uid', cdk.ResolutionTypeHint.STRING));
        this.attrVirtualServiceName = cdk.Token.asString(this.getAtt('VirtualServiceName', cdk.ResolutionTypeHint.STRING));

        this.meshName = props.meshName;
        this.spec = props.spec;
        this.virtualServiceName = props.virtualServiceName;
        this.meshOwner = props.meshOwner;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppMesh::VirtualService", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnVirtualService.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            meshName: this.meshName,
            spec: this.spec,
            virtualServiceName: this.virtualServiceName,
            meshOwner: this.meshOwner,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnVirtualServicePropsToCloudFormation(props);
    }
}

export namespace CfnVirtualService {
    /**
     * An object that represents a virtual node service provider.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualnodeserviceprovider.html
     */
    export interface VirtualNodeServiceProviderProperty {
        /**
         * The name of the virtual node that is acting as a service provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualnodeserviceprovider.html#cfn-appmesh-virtualservice-virtualnodeserviceprovider-virtualnodename
         */
        readonly virtualNodeName: string;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualNodeServiceProviderProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualNodeServiceProviderProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualService_VirtualNodeServiceProviderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('virtualNodeName', cdk.requiredValidator)(properties.virtualNodeName));
    errors.collect(cdk.propertyValidator('virtualNodeName', cdk.validateString)(properties.virtualNodeName));
    return errors.wrap('supplied properties not correct for "VirtualNodeServiceProviderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualService.VirtualNodeServiceProvider` resource
 *
 * @param properties - the TypeScript properties of a `VirtualNodeServiceProviderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualService.VirtualNodeServiceProvider` resource.
 */
// @ts-ignore TS6133
function cfnVirtualServiceVirtualNodeServiceProviderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualService_VirtualNodeServiceProviderPropertyValidator(properties).assertSuccess();
    return {
        VirtualNodeName: cdk.stringToCloudFormation(properties.virtualNodeName),
    };
}

// @ts-ignore TS6133
function CfnVirtualServiceVirtualNodeServiceProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualService.VirtualNodeServiceProviderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualService.VirtualNodeServiceProviderProperty>();
    ret.addPropertyResult('virtualNodeName', 'VirtualNodeName', cfn_parse.FromCloudFormation.getString(properties.VirtualNodeName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualService {
    /**
     * An object that represents a virtual node service provider.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualrouterserviceprovider.html
     */
    export interface VirtualRouterServiceProviderProperty {
        /**
         * The name of the virtual router that is acting as a service provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualrouterserviceprovider.html#cfn-appmesh-virtualservice-virtualrouterserviceprovider-virtualroutername
         */
        readonly virtualRouterName: string;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualRouterServiceProviderProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualRouterServiceProviderProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualService_VirtualRouterServiceProviderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('virtualRouterName', cdk.requiredValidator)(properties.virtualRouterName));
    errors.collect(cdk.propertyValidator('virtualRouterName', cdk.validateString)(properties.virtualRouterName));
    return errors.wrap('supplied properties not correct for "VirtualRouterServiceProviderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualService.VirtualRouterServiceProvider` resource
 *
 * @param properties - the TypeScript properties of a `VirtualRouterServiceProviderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualService.VirtualRouterServiceProvider` resource.
 */
// @ts-ignore TS6133
function cfnVirtualServiceVirtualRouterServiceProviderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualService_VirtualRouterServiceProviderPropertyValidator(properties).assertSuccess();
    return {
        VirtualRouterName: cdk.stringToCloudFormation(properties.virtualRouterName),
    };
}

// @ts-ignore TS6133
function CfnVirtualServiceVirtualRouterServiceProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualService.VirtualRouterServiceProviderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualService.VirtualRouterServiceProviderProperty>();
    ret.addPropertyResult('virtualRouterName', 'VirtualRouterName', cfn_parse.FromCloudFormation.getString(properties.VirtualRouterName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualService {
    /**
     * An object that represents the provider for a virtual service.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualserviceprovider.html
     */
    export interface VirtualServiceProviderProperty {
        /**
         * The virtual node associated with a virtual service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualserviceprovider.html#cfn-appmesh-virtualservice-virtualserviceprovider-virtualnode
         */
        readonly virtualNode?: CfnVirtualService.VirtualNodeServiceProviderProperty | cdk.IResolvable;
        /**
         * The virtual router associated with a virtual service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualserviceprovider.html#cfn-appmesh-virtualservice-virtualserviceprovider-virtualrouter
         */
        readonly virtualRouter?: CfnVirtualService.VirtualRouterServiceProviderProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualServiceProviderProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualServiceProviderProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualService_VirtualServiceProviderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('virtualNode', CfnVirtualService_VirtualNodeServiceProviderPropertyValidator)(properties.virtualNode));
    errors.collect(cdk.propertyValidator('virtualRouter', CfnVirtualService_VirtualRouterServiceProviderPropertyValidator)(properties.virtualRouter));
    return errors.wrap('supplied properties not correct for "VirtualServiceProviderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualService.VirtualServiceProvider` resource
 *
 * @param properties - the TypeScript properties of a `VirtualServiceProviderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualService.VirtualServiceProvider` resource.
 */
// @ts-ignore TS6133
function cfnVirtualServiceVirtualServiceProviderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualService_VirtualServiceProviderPropertyValidator(properties).assertSuccess();
    return {
        VirtualNode: cfnVirtualServiceVirtualNodeServiceProviderPropertyToCloudFormation(properties.virtualNode),
        VirtualRouter: cfnVirtualServiceVirtualRouterServiceProviderPropertyToCloudFormation(properties.virtualRouter),
    };
}

// @ts-ignore TS6133
function CfnVirtualServiceVirtualServiceProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualService.VirtualServiceProviderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualService.VirtualServiceProviderProperty>();
    ret.addPropertyResult('virtualNode', 'VirtualNode', properties.VirtualNode != null ? CfnVirtualServiceVirtualNodeServiceProviderPropertyFromCloudFormation(properties.VirtualNode) : undefined);
    ret.addPropertyResult('virtualRouter', 'VirtualRouter', properties.VirtualRouter != null ? CfnVirtualServiceVirtualRouterServiceProviderPropertyFromCloudFormation(properties.VirtualRouter) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVirtualService {
    /**
     * An object that represents the specification of a virtual service.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualservicespec.html
     */
    export interface VirtualServiceSpecProperty {
        /**
         * The App Mesh object that is acting as the provider for a virtual service. You can specify a single virtual node or virtual router.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualservice-virtualservicespec.html#cfn-appmesh-virtualservice-virtualservicespec-provider
         */
        readonly provider?: CfnVirtualService.VirtualServiceProviderProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VirtualServiceSpecProperty`
 *
 * @param properties - the TypeScript properties of a `VirtualServiceSpecProperty`
 *
 * @returns the result of the validation.
 */
function CfnVirtualService_VirtualServiceSpecPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('provider', CfnVirtualService_VirtualServiceProviderPropertyValidator)(properties.provider));
    return errors.wrap('supplied properties not correct for "VirtualServiceSpecProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppMesh::VirtualService.VirtualServiceSpec` resource
 *
 * @param properties - the TypeScript properties of a `VirtualServiceSpecProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppMesh::VirtualService.VirtualServiceSpec` resource.
 */
// @ts-ignore TS6133
function cfnVirtualServiceVirtualServiceSpecPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVirtualService_VirtualServiceSpecPropertyValidator(properties).assertSuccess();
    return {
        Provider: cfnVirtualServiceVirtualServiceProviderPropertyToCloudFormation(properties.provider),
    };
}

// @ts-ignore TS6133
function CfnVirtualServiceVirtualServiceSpecPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVirtualService.VirtualServiceSpecProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVirtualService.VirtualServiceSpecProperty>();
    ret.addPropertyResult('provider', 'Provider', properties.Provider != null ? CfnVirtualServiceVirtualServiceProviderPropertyFromCloudFormation(properties.Provider) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
