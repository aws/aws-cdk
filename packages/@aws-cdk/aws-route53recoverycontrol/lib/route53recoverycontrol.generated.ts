// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:03.420Z","fingerprint":"rPZeB6f8C4zw4vTVqjAdzf70qLohblg8MQPSyXByE/c="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnCluster`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-cluster.html
 */
export interface CfnClusterProps {

    /**
     * `AWS::Route53RecoveryControl::Cluster.ClusterEndpoints`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-cluster.html#cfn-route53recoverycontrol-cluster-clusterendpoints
     */
    readonly clusterEndpoints?: Array<CfnCluster.ClusterEndpointProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Name of the cluster. You can use any non-white space character in the name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-cluster.html#cfn-route53recoverycontrol-cluster-name
     */
    readonly name?: string;

    /**
     * The value for a tag.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-cluster.html#cfn-route53recoverycontrol-cluster-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterProps`
 *
 * @returns the result of the validation.
 */
function CfnClusterPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clusterEndpoints', cdk.listValidator(CfnCluster_ClusterEndpointPropertyValidator))(properties.clusterEndpoints));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnClusterProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::Cluster` resource
 *
 * @param properties - the TypeScript properties of a `CfnClusterProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::Cluster` resource.
 */
// @ts-ignore TS6133
function cfnClusterPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnClusterPropsValidator(properties).assertSuccess();
    return {
        ClusterEndpoints: cdk.listMapper(cfnClusterClusterEndpointPropertyToCloudFormation)(properties.clusterEndpoints),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnClusterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterProps>();
    ret.addPropertyResult('clusterEndpoints', 'ClusterEndpoints', properties.ClusterEndpoints != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterClusterEndpointPropertyFromCloudFormation)(properties.ClusterEndpoints) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Route53RecoveryControl::Cluster`
 *
 * Returns an array of all the clusters in an account.
 *
 * @cloudformationResource AWS::Route53RecoveryControl::Cluster
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-cluster.html
 */
export class CfnCluster extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryControl::Cluster";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCluster {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnClusterPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCluster(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the cluster.
     * @cloudformationAttribute ClusterArn
     */
    public readonly attrClusterArn: string;

    /**
     * Deployment status of a resource. Status can be one of the following: PENDING, DEPLOYED, PENDING_DELETION.
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * `AWS::Route53RecoveryControl::Cluster.ClusterEndpoints`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-cluster.html#cfn-route53recoverycontrol-cluster-clusterendpoints
     */
    public clusterEndpoints: Array<CfnCluster.ClusterEndpointProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Name of the cluster. You can use any non-white space character in the name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-cluster.html#cfn-route53recoverycontrol-cluster-name
     */
    public name: string | undefined;

    /**
     * The value for a tag.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-cluster.html#cfn-route53recoverycontrol-cluster-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Route53RecoveryControl::Cluster`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnClusterProps = {}) {
        super(scope, id, { type: CfnCluster.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrClusterArn = cdk.Token.asString(this.getAtt('ClusterArn', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.clusterEndpoints = props.clusterEndpoints;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryControl::Cluster", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCluster.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            clusterEndpoints: this.clusterEndpoints,
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnClusterPropsToCloudFormation(props);
    }
}

export namespace CfnCluster {
    /**
     * A cluster endpoint. Specify an endpoint when you want to set or retrieve a routing control state in the cluster.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-cluster-clusterendpoint.html
     */
    export interface ClusterEndpointProperty {
        /**
         * A cluster endpoint. Specify an endpoint and AWS Region when you want to set or retrieve a routing control state in the cluster.
         *
         * To get or update the routing control state, see the Amazon Route 53 Application Recovery Controller Routing Control Actions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-cluster-clusterendpoint.html#cfn-route53recoverycontrol-cluster-clusterendpoint-endpoint
         */
        readonly endpoint?: string;
        /**
         * The AWS Region for a cluster endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-cluster-clusterendpoint.html#cfn-route53recoverycontrol-cluster-clusterendpoint-region
         */
        readonly region?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ClusterEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `ClusterEndpointProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_ClusterEndpointPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endpoint', cdk.validateString)(properties.endpoint));
    errors.collect(cdk.propertyValidator('region', cdk.validateString)(properties.region));
    return errors.wrap('supplied properties not correct for "ClusterEndpointProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::Cluster.ClusterEndpoint` resource
 *
 * @param properties - the TypeScript properties of a `ClusterEndpointProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::Cluster.ClusterEndpoint` resource.
 */
// @ts-ignore TS6133
function cfnClusterClusterEndpointPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_ClusterEndpointPropertyValidator(properties).assertSuccess();
    return {
        Endpoint: cdk.stringToCloudFormation(properties.endpoint),
        Region: cdk.stringToCloudFormation(properties.region),
    };
}

// @ts-ignore TS6133
function CfnClusterClusterEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ClusterEndpointProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ClusterEndpointProperty>();
    ret.addPropertyResult('endpoint', 'Endpoint', properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined);
    ret.addPropertyResult('region', 'Region', properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnControlPanel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-controlpanel.html
 */
export interface CfnControlPanelProps {

    /**
     * The name of the control panel. You can use any non-white space character in the name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-controlpanel.html#cfn-route53recoverycontrol-controlpanel-name
     */
    readonly name: string;

    /**
     * The Amazon Resource Name (ARN) of the cluster for the control panel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-controlpanel.html#cfn-route53recoverycontrol-controlpanel-clusterarn
     */
    readonly clusterArn?: string;

    /**
     * The value for a tag.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-controlpanel.html#cfn-route53recoverycontrol-controlpanel-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnControlPanelProps`
 *
 * @param properties - the TypeScript properties of a `CfnControlPanelProps`
 *
 * @returns the result of the validation.
 */
function CfnControlPanelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clusterArn', cdk.validateString)(properties.clusterArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnControlPanelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::ControlPanel` resource
 *
 * @param properties - the TypeScript properties of a `CfnControlPanelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::ControlPanel` resource.
 */
// @ts-ignore TS6133
function cfnControlPanelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnControlPanelPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        ClusterArn: cdk.stringToCloudFormation(properties.clusterArn),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnControlPanelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnControlPanelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnControlPanelProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('clusterArn', 'ClusterArn', properties.ClusterArn != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterArn) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Route53RecoveryControl::ControlPanel`
 *
 * Creates a new control panel. A control panel represents a group of routing controls that can be changed together in a single transaction. You can use a control panel to centrally view the operational status of applications across your organization, and trigger multi-app failovers in a single transaction, for example, to fail over an Availability Zone or AWS Region .
 *
 * @cloudformationResource AWS::Route53RecoveryControl::ControlPanel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-controlpanel.html
 */
export class CfnControlPanel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryControl::ControlPanel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnControlPanel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnControlPanelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnControlPanel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the control panel.
     * @cloudformationAttribute ControlPanelArn
     */
    public readonly attrControlPanelArn: string;

    /**
     * The boolean flag that is set to true for the default control panel in the cluster.
     * @cloudformationAttribute DefaultControlPanel
     */
    public readonly attrDefaultControlPanel: cdk.IResolvable;

    /**
     * The number of routing controls in the control panel.
     * @cloudformationAttribute RoutingControlCount
     */
    public readonly attrRoutingControlCount: number;

    /**
     * The deployment status of control panel. Status can be one of the following: PENDING, DEPLOYED, PENDING_DELETION.
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The name of the control panel. You can use any non-white space character in the name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-controlpanel.html#cfn-route53recoverycontrol-controlpanel-name
     */
    public name: string;

    /**
     * The Amazon Resource Name (ARN) of the cluster for the control panel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-controlpanel.html#cfn-route53recoverycontrol-controlpanel-clusterarn
     */
    public clusterArn: string | undefined;

    /**
     * The value for a tag.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-controlpanel.html#cfn-route53recoverycontrol-controlpanel-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Route53RecoveryControl::ControlPanel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnControlPanelProps) {
        super(scope, id, { type: CfnControlPanel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrControlPanelArn = cdk.Token.asString(this.getAtt('ControlPanelArn', cdk.ResolutionTypeHint.STRING));
        this.attrDefaultControlPanel = this.getAtt('DefaultControlPanel', cdk.ResolutionTypeHint.STRING);
        this.attrRoutingControlCount = cdk.Token.asNumber(this.getAtt('RoutingControlCount', cdk.ResolutionTypeHint.NUMBER));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.clusterArn = props.clusterArn;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryControl::ControlPanel", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnControlPanel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            clusterArn: this.clusterArn,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnControlPanelPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnRoutingControl`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-routingcontrol.html
 */
export interface CfnRoutingControlProps {

    /**
     * The name of the routing control. You can use any non-white space character in the name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-routingcontrol.html#cfn-route53recoverycontrol-routingcontrol-name
     */
    readonly name: string;

    /**
     * The Amazon Resource Name (ARN) of the cluster that includes the routing control.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-routingcontrol.html#cfn-route53recoverycontrol-routingcontrol-clusterarn
     */
    readonly clusterArn?: string;

    /**
     * The Amazon Resource Name (ARN) of the control panel that includes the routing control.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-routingcontrol.html#cfn-route53recoverycontrol-routingcontrol-controlpanelarn
     */
    readonly controlPanelArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnRoutingControlProps`
 *
 * @param properties - the TypeScript properties of a `CfnRoutingControlProps`
 *
 * @returns the result of the validation.
 */
function CfnRoutingControlPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clusterArn', cdk.validateString)(properties.clusterArn));
    errors.collect(cdk.propertyValidator('controlPanelArn', cdk.validateString)(properties.controlPanelArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "CfnRoutingControlProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::RoutingControl` resource
 *
 * @param properties - the TypeScript properties of a `CfnRoutingControlProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::RoutingControl` resource.
 */
// @ts-ignore TS6133
function cfnRoutingControlPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRoutingControlPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        ClusterArn: cdk.stringToCloudFormation(properties.clusterArn),
        ControlPanelArn: cdk.stringToCloudFormation(properties.controlPanelArn),
    };
}

// @ts-ignore TS6133
function CfnRoutingControlPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoutingControlProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoutingControlProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('clusterArn', 'ClusterArn', properties.ClusterArn != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterArn) : undefined);
    ret.addPropertyResult('controlPanelArn', 'ControlPanelArn', properties.ControlPanelArn != null ? cfn_parse.FromCloudFormation.getString(properties.ControlPanelArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Route53RecoveryControl::RoutingControl`
 *
 * Defines a routing control. To get or update the routing control state, see the Recovery Cluster (data plane) API actions for Amazon Route 53 Application Recovery Controller.
 *
 * @cloudformationResource AWS::Route53RecoveryControl::RoutingControl
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-routingcontrol.html
 */
export class CfnRoutingControl extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryControl::RoutingControl";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRoutingControl {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRoutingControlPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRoutingControl(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the routing control.
     * @cloudformationAttribute RoutingControlArn
     */
    public readonly attrRoutingControlArn: string;

    /**
     * The deployment status of the routing control. Status can be one of the following: PENDING, DEPLOYED, PENDING_DELETION.
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The name of the routing control. You can use any non-white space character in the name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-routingcontrol.html#cfn-route53recoverycontrol-routingcontrol-name
     */
    public name: string;

    /**
     * The Amazon Resource Name (ARN) of the cluster that includes the routing control.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-routingcontrol.html#cfn-route53recoverycontrol-routingcontrol-clusterarn
     */
    public clusterArn: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of the control panel that includes the routing control.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-routingcontrol.html#cfn-route53recoverycontrol-routingcontrol-controlpanelarn
     */
    public controlPanelArn: string | undefined;

    /**
     * Create a new `AWS::Route53RecoveryControl::RoutingControl`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRoutingControlProps) {
        super(scope, id, { type: CfnRoutingControl.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrRoutingControlArn = cdk.Token.asString(this.getAtt('RoutingControlArn', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.clusterArn = props.clusterArn;
        this.controlPanelArn = props.controlPanelArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRoutingControl.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            clusterArn: this.clusterArn,
            controlPanelArn: this.controlPanelArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRoutingControlPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnSafetyRule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html
 */
export interface CfnSafetyRuleProps {

    /**
     * The Amazon Resource Name (ARN) for the control panel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-controlpanelarn
     */
    readonly controlPanelArn: string;

    /**
     * The name of the assertion rule. The name must be unique within a control panel. You can use any non-white space character in the name except the following: & > < ' (single quote) " (double quote) ; (semicolon)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-name
     */
    readonly name: string;

    /**
     * The criteria that you set for specific assertion controls (routing controls) that designate how many control states must be `ON` as the result of a transaction. For example, if you have three assertion controls, you might specify `ATLEAST 2` for your rule configuration. This means that at least two assertion controls must be `ON` , so that at least two AWS Regions have traffic flowing to them.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-ruleconfig
     */
    readonly ruleConfig: CfnSafetyRule.RuleConfigProperty | cdk.IResolvable;

    /**
     * An assertion rule enforces that, when you change a routing control state, that the criteria that you set in the rule configuration is met. Otherwise, the change to the routing control is not accepted. For example, the criteria might be that at least one routing control state is `On` after the transaction so that traffic continues to flow to at least one cell for the application. This ensures that you avoid a fail-open scenario.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-assertionrule
     */
    readonly assertionRule?: CfnSafetyRule.AssertionRuleProperty | cdk.IResolvable;

    /**
     * A gating rule verifies that a gating routing control or set of gating routing controls, evaluates as true, based on a rule configuration that you specify, which allows a set of routing control state changes to complete.
     *
     * For example, if you specify one gating routing control and you set the `Type` in the rule configuration to `OR` , that indicates that you must set the gating routing control to `On` for the rule to evaluate as true; that is, for the gating control "switch" to be "On". When you do that, then you can update the routing control states for the target routing controls that you specify in the gating rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-gatingrule
     */
    readonly gatingRule?: CfnSafetyRule.GatingRuleProperty | cdk.IResolvable;

    /**
     * The value for a tag.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnSafetyRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnSafetyRuleProps`
 *
 * @returns the result of the validation.
 */
function CfnSafetyRulePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('assertionRule', CfnSafetyRule_AssertionRulePropertyValidator)(properties.assertionRule));
    errors.collect(cdk.propertyValidator('controlPanelArn', cdk.requiredValidator)(properties.controlPanelArn));
    errors.collect(cdk.propertyValidator('controlPanelArn', cdk.validateString)(properties.controlPanelArn));
    errors.collect(cdk.propertyValidator('gatingRule', CfnSafetyRule_GatingRulePropertyValidator)(properties.gatingRule));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('ruleConfig', cdk.requiredValidator)(properties.ruleConfig));
    errors.collect(cdk.propertyValidator('ruleConfig', CfnSafetyRule_RuleConfigPropertyValidator)(properties.ruleConfig));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnSafetyRuleProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::SafetyRule` resource
 *
 * @param properties - the TypeScript properties of a `CfnSafetyRuleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::SafetyRule` resource.
 */
// @ts-ignore TS6133
function cfnSafetyRulePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSafetyRulePropsValidator(properties).assertSuccess();
    return {
        ControlPanelArn: cdk.stringToCloudFormation(properties.controlPanelArn),
        Name: cdk.stringToCloudFormation(properties.name),
        RuleConfig: cfnSafetyRuleRuleConfigPropertyToCloudFormation(properties.ruleConfig),
        AssertionRule: cfnSafetyRuleAssertionRulePropertyToCloudFormation(properties.assertionRule),
        GatingRule: cfnSafetyRuleGatingRulePropertyToCloudFormation(properties.gatingRule),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnSafetyRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSafetyRuleProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSafetyRuleProps>();
    ret.addPropertyResult('controlPanelArn', 'ControlPanelArn', cfn_parse.FromCloudFormation.getString(properties.ControlPanelArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('ruleConfig', 'RuleConfig', CfnSafetyRuleRuleConfigPropertyFromCloudFormation(properties.RuleConfig));
    ret.addPropertyResult('assertionRule', 'AssertionRule', properties.AssertionRule != null ? CfnSafetyRuleAssertionRulePropertyFromCloudFormation(properties.AssertionRule) : undefined);
    ret.addPropertyResult('gatingRule', 'GatingRule', properties.GatingRule != null ? CfnSafetyRuleGatingRulePropertyFromCloudFormation(properties.GatingRule) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Route53RecoveryControl::SafetyRule`
 *
 * List the safety rules (the assertion rules and gating rules) that you've defined for the routing controls in a control panel.
 *
 * @cloudformationResource AWS::Route53RecoveryControl::SafetyRule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html
 */
export class CfnSafetyRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryControl::SafetyRule";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSafetyRule {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSafetyRulePropsFromCloudFormation(resourceProperties);
        const ret = new CfnSafetyRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the safety rule.
     * @cloudformationAttribute SafetyRuleArn
     */
    public readonly attrSafetyRuleArn: string;

    /**
     * The deployment status of the safety rule. Status can be one of the following: PENDING, DEPLOYED, PENDING_DELETION.
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The Amazon Resource Name (ARN) for the control panel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-controlpanelarn
     */
    public controlPanelArn: string;

    /**
     * The name of the assertion rule. The name must be unique within a control panel. You can use any non-white space character in the name except the following: & > < ' (single quote) " (double quote) ; (semicolon)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-name
     */
    public name: string;

    /**
     * The criteria that you set for specific assertion controls (routing controls) that designate how many control states must be `ON` as the result of a transaction. For example, if you have three assertion controls, you might specify `ATLEAST 2` for your rule configuration. This means that at least two assertion controls must be `ON` , so that at least two AWS Regions have traffic flowing to them.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-ruleconfig
     */
    public ruleConfig: CfnSafetyRule.RuleConfigProperty | cdk.IResolvable;

    /**
     * An assertion rule enforces that, when you change a routing control state, that the criteria that you set in the rule configuration is met. Otherwise, the change to the routing control is not accepted. For example, the criteria might be that at least one routing control state is `On` after the transaction so that traffic continues to flow to at least one cell for the application. This ensures that you avoid a fail-open scenario.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-assertionrule
     */
    public assertionRule: CfnSafetyRule.AssertionRuleProperty | cdk.IResolvable | undefined;

    /**
     * A gating rule verifies that a gating routing control or set of gating routing controls, evaluates as true, based on a rule configuration that you specify, which allows a set of routing control state changes to complete.
     *
     * For example, if you specify one gating routing control and you set the `Type` in the rule configuration to `OR` , that indicates that you must set the gating routing control to `On` for the rule to evaluate as true; that is, for the gating control "switch" to be "On". When you do that, then you can update the routing control states for the target routing controls that you specify in the gating rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-gatingrule
     */
    public gatingRule: CfnSafetyRule.GatingRuleProperty | cdk.IResolvable | undefined;

    /**
     * The value for a tag.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoverycontrol-safetyrule.html#cfn-route53recoverycontrol-safetyrule-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Route53RecoveryControl::SafetyRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSafetyRuleProps) {
        super(scope, id, { type: CfnSafetyRule.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'controlPanelArn', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'ruleConfig', this);
        this.attrSafetyRuleArn = cdk.Token.asString(this.getAtt('SafetyRuleArn', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.controlPanelArn = props.controlPanelArn;
        this.name = props.name;
        this.ruleConfig = props.ruleConfig;
        this.assertionRule = props.assertionRule;
        this.gatingRule = props.gatingRule;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryControl::SafetyRule", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSafetyRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            controlPanelArn: this.controlPanelArn,
            name: this.name,
            ruleConfig: this.ruleConfig,
            assertionRule: this.assertionRule,
            gatingRule: this.gatingRule,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSafetyRulePropsToCloudFormation(props);
    }
}

export namespace CfnSafetyRule {
    /**
     * An assertion rule enforces that, when you change a routing control state, that the criteria that you set in the rule configuration is met. Otherwise, the change to the routing control is not accepted. For example, the criteria might be that at least one routing control state is `On` after the transaction so that traffic continues to flow to at least one cell for the application. This ensures that you avoid a fail-open scenario.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-assertionrule.html
     */
    export interface AssertionRuleProperty {
        /**
         * The routing controls that are part of transactions that are evaluated to determine if a request to change a routing control state is allowed. For example, you might include three routing controls, one for each of three AWS Regions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-assertionrule.html#cfn-route53recoverycontrol-safetyrule-assertionrule-assertedcontrols
         */
        readonly assertedControls: string[];
        /**
         * An evaluation period, in milliseconds (ms), during which any request against the target routing controls will fail. This helps prevent "flapping" of state. The wait period is 5000 ms by default, but you can choose a custom value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-assertionrule.html#cfn-route53recoverycontrol-safetyrule-assertionrule-waitperiodms
         */
        readonly waitPeriodMs: number;
    }
}

/**
 * Determine whether the given properties match those of a `AssertionRuleProperty`
 *
 * @param properties - the TypeScript properties of a `AssertionRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnSafetyRule_AssertionRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('assertedControls', cdk.requiredValidator)(properties.assertedControls));
    errors.collect(cdk.propertyValidator('assertedControls', cdk.listValidator(cdk.validateString))(properties.assertedControls));
    errors.collect(cdk.propertyValidator('waitPeriodMs', cdk.requiredValidator)(properties.waitPeriodMs));
    errors.collect(cdk.propertyValidator('waitPeriodMs', cdk.validateNumber)(properties.waitPeriodMs));
    return errors.wrap('supplied properties not correct for "AssertionRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::SafetyRule.AssertionRule` resource
 *
 * @param properties - the TypeScript properties of a `AssertionRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::SafetyRule.AssertionRule` resource.
 */
// @ts-ignore TS6133
function cfnSafetyRuleAssertionRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSafetyRule_AssertionRulePropertyValidator(properties).assertSuccess();
    return {
        AssertedControls: cdk.listMapper(cdk.stringToCloudFormation)(properties.assertedControls),
        WaitPeriodMs: cdk.numberToCloudFormation(properties.waitPeriodMs),
    };
}

// @ts-ignore TS6133
function CfnSafetyRuleAssertionRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSafetyRule.AssertionRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSafetyRule.AssertionRuleProperty>();
    ret.addPropertyResult('assertedControls', 'AssertedControls', cfn_parse.FromCloudFormation.getStringArray(properties.AssertedControls));
    ret.addPropertyResult('waitPeriodMs', 'WaitPeriodMs', cfn_parse.FromCloudFormation.getNumber(properties.WaitPeriodMs));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSafetyRule {
    /**
     * A gating rule verifies that a gating routing control or set of gating routing controls, evaluates as true, based on a rule configuration that you specify, which allows a set of routing control state changes to complete.
     *
     * For example, if you specify one gating routing control and you set the `Type` in the rule configuration to `OR` , that indicates that you must set the gating routing control to `On` for the rule to evaluate as true; that is, for the gating control "switch" to be "On". When you do that, then you can update the routing control states for the target routing controls that you specify in the gating rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-gatingrule.html
     */
    export interface GatingRuleProperty {
        /**
         * An array of gating routing control Amazon Resource Names (ARNs). For a simple "on/off" switch, specify the ARN for one routing control. The gating routing controls are evaluated by the rule configuration that you specify to determine if the target routing control states can be changed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-gatingrule.html#cfn-route53recoverycontrol-safetyrule-gatingrule-gatingcontrols
         */
        readonly gatingControls: string[];
        /**
         * An array of target routing control Amazon Resource Names (ARNs) for which the states can only be updated if the rule configuration that you specify evaluates to true for the gating routing control. As a simple example, if you have a single gating control, it acts as an overall "on/off" switch for a set of target routing controls. You can use this to manually override automated failover, for example.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-gatingrule.html#cfn-route53recoverycontrol-safetyrule-gatingrule-targetcontrols
         */
        readonly targetControls: string[];
        /**
         * An evaluation period, in milliseconds (ms), during which any request against the target routing controls will fail. This helps prevent "flapping" of state. The wait period is 5000 ms by default, but you can choose a custom value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-gatingrule.html#cfn-route53recoverycontrol-safetyrule-gatingrule-waitperiodms
         */
        readonly waitPeriodMs: number;
    }
}

/**
 * Determine whether the given properties match those of a `GatingRuleProperty`
 *
 * @param properties - the TypeScript properties of a `GatingRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnSafetyRule_GatingRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('gatingControls', cdk.requiredValidator)(properties.gatingControls));
    errors.collect(cdk.propertyValidator('gatingControls', cdk.listValidator(cdk.validateString))(properties.gatingControls));
    errors.collect(cdk.propertyValidator('targetControls', cdk.requiredValidator)(properties.targetControls));
    errors.collect(cdk.propertyValidator('targetControls', cdk.listValidator(cdk.validateString))(properties.targetControls));
    errors.collect(cdk.propertyValidator('waitPeriodMs', cdk.requiredValidator)(properties.waitPeriodMs));
    errors.collect(cdk.propertyValidator('waitPeriodMs', cdk.validateNumber)(properties.waitPeriodMs));
    return errors.wrap('supplied properties not correct for "GatingRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::SafetyRule.GatingRule` resource
 *
 * @param properties - the TypeScript properties of a `GatingRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::SafetyRule.GatingRule` resource.
 */
// @ts-ignore TS6133
function cfnSafetyRuleGatingRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSafetyRule_GatingRulePropertyValidator(properties).assertSuccess();
    return {
        GatingControls: cdk.listMapper(cdk.stringToCloudFormation)(properties.gatingControls),
        TargetControls: cdk.listMapper(cdk.stringToCloudFormation)(properties.targetControls),
        WaitPeriodMs: cdk.numberToCloudFormation(properties.waitPeriodMs),
    };
}

// @ts-ignore TS6133
function CfnSafetyRuleGatingRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSafetyRule.GatingRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSafetyRule.GatingRuleProperty>();
    ret.addPropertyResult('gatingControls', 'GatingControls', cfn_parse.FromCloudFormation.getStringArray(properties.GatingControls));
    ret.addPropertyResult('targetControls', 'TargetControls', cfn_parse.FromCloudFormation.getStringArray(properties.TargetControls));
    ret.addPropertyResult('waitPeriodMs', 'WaitPeriodMs', cfn_parse.FromCloudFormation.getNumber(properties.WaitPeriodMs));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSafetyRule {
    /**
     * The rule configuration for an assertion rule. That is, the criteria that you set for specific assertion controls (routing controls) that specify how many control states must be `ON` after a transaction completes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-ruleconfig.html
     */
    export interface RuleConfigProperty {
        /**
         * Logical negation of the rule. If the rule would usually evaluate true, it's evaluated as false, and vice versa.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-ruleconfig.html#cfn-route53recoverycontrol-safetyrule-ruleconfig-inverted
         */
        readonly inverted: boolean | cdk.IResolvable;
        /**
         * The value of N, when you specify an `ATLEAST` rule type. That is, `Threshold` is the number of controls that must be set when you specify an `ATLEAST` type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-ruleconfig.html#cfn-route53recoverycontrol-safetyrule-ruleconfig-threshold
         */
        readonly threshold: number;
        /**
         * A rule can be one of the following: `ATLEAST` , `AND` , or `OR` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoverycontrol-safetyrule-ruleconfig.html#cfn-route53recoverycontrol-safetyrule-ruleconfig-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `RuleConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RuleConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnSafetyRule_RuleConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('inverted', cdk.requiredValidator)(properties.inverted));
    errors.collect(cdk.propertyValidator('inverted', cdk.validateBoolean)(properties.inverted));
    errors.collect(cdk.propertyValidator('threshold', cdk.requiredValidator)(properties.threshold));
    errors.collect(cdk.propertyValidator('threshold', cdk.validateNumber)(properties.threshold));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "RuleConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::SafetyRule.RuleConfig` resource
 *
 * @param properties - the TypeScript properties of a `RuleConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryControl::SafetyRule.RuleConfig` resource.
 */
// @ts-ignore TS6133
function cfnSafetyRuleRuleConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSafetyRule_RuleConfigPropertyValidator(properties).assertSuccess();
    return {
        Inverted: cdk.booleanToCloudFormation(properties.inverted),
        Threshold: cdk.numberToCloudFormation(properties.threshold),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnSafetyRuleRuleConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSafetyRule.RuleConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSafetyRule.RuleConfigProperty>();
    ret.addPropertyResult('inverted', 'Inverted', cfn_parse.FromCloudFormation.getBoolean(properties.Inverted));
    ret.addPropertyResult('threshold', 'Threshold', cfn_parse.FromCloudFormation.getNumber(properties.Threshold));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
