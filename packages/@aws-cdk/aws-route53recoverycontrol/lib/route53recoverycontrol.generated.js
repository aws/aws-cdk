"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnSafetyRule = exports.CfnRoutingControl = exports.CfnControlPanel = exports.CfnCluster = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cfn_parse = require("@aws-cdk/core/lib/helpers-internal");
/**
 * Determine whether the given properties match those of a `CfnClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterProps`
 *
 * @returns the result of the validation.
 */
function CfnClusterPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnClusterPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnClusterPropsValidator(properties).assertSuccess();
    return {
        ClusterEndpoints: cdk.listMapper(cfnClusterClusterEndpointPropertyToCloudFormation)(properties.clusterEndpoints),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnClusterPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('clusterEndpoints', 'ClusterEndpoints', properties.ClusterEndpoints != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterClusterEndpointPropertyFromCloudFormation)(properties.ClusterEndpoints) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined);
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
class CfnCluster extends cdk.CfnResource {
    /**
     * Create a new `AWS::Route53RecoveryControl::Cluster`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props = {}) {
        super(scope, id, { type: CfnCluster.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53recoverycontrol_CfnClusterProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnCluster);
            }
            throw error;
        }
        this.attrClusterArn = cdk.Token.asString(this.getAtt('ClusterArn', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));
        this.clusterEndpoints = props.clusterEndpoints;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryControl::Cluster", props.tags, { tagPropertyName: 'tags' });
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnClusterPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCluster(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCluster.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            clusterEndpoints: this.clusterEndpoints,
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        return cfnClusterPropsToCloudFormation(props);
    }
}
exports.CfnCluster = CfnCluster;
_a = JSII_RTTI_SYMBOL_1;
CfnCluster[_a] = { fqn: "@aws-cdk/aws-route53recoverycontrol.CfnCluster", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnCluster.CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryControl::Cluster";
/**
 * Determine whether the given properties match those of a `ClusterEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `ClusterEndpointProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_ClusterEndpointPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnClusterClusterEndpointPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnCluster_ClusterEndpointPropertyValidator(properties).assertSuccess();
    return {
        Endpoint: cdk.stringToCloudFormation(properties.endpoint),
        Region: cdk.stringToCloudFormation(properties.region),
    };
}
// @ts-ignore TS6133
function CfnClusterClusterEndpointPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('endpoint', 'Endpoint', properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined);
    ret.addPropertyResult('region', 'Region', properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `CfnControlPanelProps`
 *
 * @param properties - the TypeScript properties of a `CfnControlPanelProps`
 *
 * @returns the result of the validation.
 */
function CfnControlPanelPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnControlPanelPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnControlPanelPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        ClusterArn: cdk.stringToCloudFormation(properties.clusterArn),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnControlPanelPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('clusterArn', 'ClusterArn', properties.ClusterArn != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterArn) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined);
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
class CfnControlPanel extends cdk.CfnResource {
    /**
     * Create a new `AWS::Route53RecoveryControl::ControlPanel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnControlPanel.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53recoverycontrol_CfnControlPanelProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnControlPanel);
            }
            throw error;
        }
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
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnControlPanelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnControlPanel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnControlPanel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            name: this.name,
            clusterArn: this.clusterArn,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        return cfnControlPanelPropsToCloudFormation(props);
    }
}
exports.CfnControlPanel = CfnControlPanel;
_b = JSII_RTTI_SYMBOL_1;
CfnControlPanel[_b] = { fqn: "@aws-cdk/aws-route53recoverycontrol.CfnControlPanel", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnControlPanel.CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryControl::ControlPanel";
/**
 * Determine whether the given properties match those of a `CfnRoutingControlProps`
 *
 * @param properties - the TypeScript properties of a `CfnRoutingControlProps`
 *
 * @returns the result of the validation.
 */
function CfnRoutingControlPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnRoutingControlPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnRoutingControlPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        ClusterArn: cdk.stringToCloudFormation(properties.clusterArn),
        ControlPanelArn: cdk.stringToCloudFormation(properties.controlPanelArn),
    };
}
// @ts-ignore TS6133
function CfnRoutingControlPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnRoutingControl extends cdk.CfnResource {
    /**
     * Create a new `AWS::Route53RecoveryControl::RoutingControl`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnRoutingControl.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53recoverycontrol_CfnRoutingControlProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnRoutingControl);
            }
            throw error;
        }
        cdk.requireProperty(props, 'name', this);
        this.attrRoutingControlArn = cdk.Token.asString(this.getAtt('RoutingControlArn', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));
        this.name = props.name;
        this.clusterArn = props.clusterArn;
        this.controlPanelArn = props.controlPanelArn;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRoutingControlPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRoutingControl(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRoutingControl.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            name: this.name,
            clusterArn: this.clusterArn,
            controlPanelArn: this.controlPanelArn,
        };
    }
    renderProperties(props) {
        return cfnRoutingControlPropsToCloudFormation(props);
    }
}
exports.CfnRoutingControl = CfnRoutingControl;
_c = JSII_RTTI_SYMBOL_1;
CfnRoutingControl[_c] = { fqn: "@aws-cdk/aws-route53recoverycontrol.CfnRoutingControl", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnRoutingControl.CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryControl::RoutingControl";
/**
 * Determine whether the given properties match those of a `CfnSafetyRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnSafetyRuleProps`
 *
 * @returns the result of the validation.
 */
function CfnSafetyRulePropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnSafetyRulePropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
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
function CfnSafetyRulePropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('controlPanelArn', 'ControlPanelArn', cfn_parse.FromCloudFormation.getString(properties.ControlPanelArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('ruleConfig', 'RuleConfig', CfnSafetyRuleRuleConfigPropertyFromCloudFormation(properties.RuleConfig));
    ret.addPropertyResult('assertionRule', 'AssertionRule', properties.AssertionRule != null ? CfnSafetyRuleAssertionRulePropertyFromCloudFormation(properties.AssertionRule) : undefined);
    ret.addPropertyResult('gatingRule', 'GatingRule', properties.GatingRule != null ? CfnSafetyRuleGatingRulePropertyFromCloudFormation(properties.GatingRule) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined);
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
class CfnSafetyRule extends cdk.CfnResource {
    /**
     * Create a new `AWS::Route53RecoveryControl::SafetyRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnSafetyRule.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53recoverycontrol_CfnSafetyRuleProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnSafetyRule);
            }
            throw error;
        }
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
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSafetyRulePropsFromCloudFormation(resourceProperties);
        const ret = new CfnSafetyRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSafetyRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            controlPanelArn: this.controlPanelArn,
            name: this.name,
            ruleConfig: this.ruleConfig,
            assertionRule: this.assertionRule,
            gatingRule: this.gatingRule,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        return cfnSafetyRulePropsToCloudFormation(props);
    }
}
exports.CfnSafetyRule = CfnSafetyRule;
_d = JSII_RTTI_SYMBOL_1;
CfnSafetyRule[_d] = { fqn: "@aws-cdk/aws-route53recoverycontrol.CfnSafetyRule", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnSafetyRule.CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryControl::SafetyRule";
/**
 * Determine whether the given properties match those of a `AssertionRuleProperty`
 *
 * @param properties - the TypeScript properties of a `AssertionRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnSafetyRule_AssertionRulePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnSafetyRuleAssertionRulePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSafetyRule_AssertionRulePropertyValidator(properties).assertSuccess();
    return {
        AssertedControls: cdk.listMapper(cdk.stringToCloudFormation)(properties.assertedControls),
        WaitPeriodMs: cdk.numberToCloudFormation(properties.waitPeriodMs),
    };
}
// @ts-ignore TS6133
function CfnSafetyRuleAssertionRulePropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('assertedControls', 'AssertedControls', cfn_parse.FromCloudFormation.getStringArray(properties.AssertedControls));
    ret.addPropertyResult('waitPeriodMs', 'WaitPeriodMs', cfn_parse.FromCloudFormation.getNumber(properties.WaitPeriodMs));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `GatingRuleProperty`
 *
 * @param properties - the TypeScript properties of a `GatingRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnSafetyRule_GatingRulePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnSafetyRuleGatingRulePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSafetyRule_GatingRulePropertyValidator(properties).assertSuccess();
    return {
        GatingControls: cdk.listMapper(cdk.stringToCloudFormation)(properties.gatingControls),
        TargetControls: cdk.listMapper(cdk.stringToCloudFormation)(properties.targetControls),
        WaitPeriodMs: cdk.numberToCloudFormation(properties.waitPeriodMs),
    };
}
// @ts-ignore TS6133
function CfnSafetyRuleGatingRulePropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('gatingControls', 'GatingControls', cfn_parse.FromCloudFormation.getStringArray(properties.GatingControls));
    ret.addPropertyResult('targetControls', 'TargetControls', cfn_parse.FromCloudFormation.getStringArray(properties.TargetControls));
    ret.addPropertyResult('waitPeriodMs', 'WaitPeriodMs', cfn_parse.FromCloudFormation.getNumber(properties.WaitPeriodMs));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `RuleConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RuleConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnSafetyRule_RuleConfigPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnSafetyRuleRuleConfigPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSafetyRule_RuleConfigPropertyValidator(properties).assertSuccess();
    return {
        Inverted: cdk.booleanToCloudFormation(properties.inverted),
        Threshold: cdk.numberToCloudFormation(properties.threshold),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}
// @ts-ignore TS6133
function CfnSafetyRuleRuleConfigPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('inverted', 'Inverted', cfn_parse.FromCloudFormation.getBoolean(properties.Inverted));
    ret.addPropertyResult('threshold', 'Threshold', cfn_parse.FromCloudFormation.getNumber(properties.Threshold));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGU1M3JlY292ZXJ5Y29udHJvbC5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb3V0ZTUzcmVjb3Zlcnljb250cm9sLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFRQSxxQ0FBcUM7QUFDckMsZ0VBQWdFO0FBa0NoRTs7Ozs7O0dBTUc7QUFDSCxTQUFTLHdCQUF3QixDQUFDLFVBQWU7SUFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztLQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDdkosTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNuRixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJ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Q0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzVHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDOUcsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMvRixHQUFHLENBQUMsZ0NBQWdDLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLy8gR2VuZXJhdGVkIGZyb20gdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBSZXNvdXJjZSBTcGVjaWZpY2F0aW9uXG4vLyBTZWU6IGRvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9jZm4tcmVzb3VyY2Utc3BlY2lmaWNhdGlvbi5odG1sXG4vLyBAY2ZuMnRzOm1ldGFAIHtcImdlbmVyYXRlZFwiOlwiMjAyMy0wMS0yMlQwOTo1NDowMy40MjBaXCIsXCJmaW5nZXJwcmludFwiOlwiclBaZUI2ZjhDNHp3NHZUVnFqQWR6ZjcwcUxvaGJsZzhNUVBTeVhCeUUvYz1cIn1cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY2ZuX3BhcnNlIGZyb20gJ0Bhd3MtY2RrL2NvcmUvbGliL2hlbHBlcnMtaW50ZXJuYWwnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmbkNsdXN0ZXJgXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtY2x1c3Rlci5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQ2x1c3RlclByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIGBBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OkNsdXN0ZXIuQ2x1c3RlckVuZHBvaW50c2BcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtY2x1c3Rlci5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNsdXN0ZXItY2x1c3RlcmVuZHBvaW50c1xuICAgICAqL1xuICAgIHJlYWRvbmx5IGNsdXN0ZXJFbmRwb2ludHM/OiBBcnJheTxDZm5DbHVzdGVyLkNsdXN0ZXJFbmRwb2ludFByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIE5hbWUgb2YgdGhlIGNsdXN0ZXIuIFlvdSBjYW4gdXNlIGFueSBub24td2hpdGUgc3BhY2UgY2hhcmFjdGVyIGluIHRoZSBuYW1lLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5Y29udHJvbC1jbHVzdGVyLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtY2x1c3Rlci1uYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSB2YWx1ZSBmb3IgYSB0YWcuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNsdXN0ZXIuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5Y29udHJvbC1jbHVzdGVyLXRhZ3NcbiAgICAgKi9cbiAgICByZWFkb25seSB0YWdzPzogY2RrLkNmblRhZ1tdO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkNsdXN0ZXJQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuQ2x1c3RlclByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkNsdXN0ZXJQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2NsdXN0ZXJFbmRwb2ludHMnLCBjZGsubGlzdFZhbGlkYXRvcihDZm5DbHVzdGVyX0NsdXN0ZXJFbmRwb2ludFByb3BlcnR5VmFsaWRhdG9yKSkocHJvcGVydGllcy5jbHVzdGVyRW5kcG9pbnRzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCduYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLm5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhZ3MnLCBjZGsubGlzdFZhbGlkYXRvcihjZGsudmFsaWRhdGVDZm5UYWcpKShwcm9wZXJ0aWVzLnRhZ3MpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuQ2x1c3RlclByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpSb3V0ZTUzUmVjb3ZlcnlDb250cm9sOjpDbHVzdGVyYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5DbHVzdGVyUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OkNsdXN0ZXJgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQ2x1c3RlclByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5DbHVzdGVyUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIENsdXN0ZXJFbmRwb2ludHM6IGNkay5saXN0TWFwcGVyKGNmbkNsdXN0ZXJDbHVzdGVyRW5kcG9pbnRQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuY2x1c3RlckVuZHBvaW50cyksXG4gICAgICAgIE5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubmFtZSksXG4gICAgICAgIFRhZ3M6IGNkay5saXN0TWFwcGVyKGNkay5jZm5UYWdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLnRhZ3MpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5DbHVzdGVyUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5DbHVzdGVyUHJvcHM+IHtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmbkNsdXN0ZXJQcm9wcz4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2NsdXN0ZXJFbmRwb2ludHMnLCAnQ2x1c3RlckVuZHBvaW50cycsIHByb3BlcnRpZXMuQ2x1c3RlckVuZHBvaW50cyAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShDZm5DbHVzdGVyQ2x1c3RlckVuZHBvaW50UHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuQ2x1c3RlckVuZHBvaW50cykgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbmFtZScsICdOYW1lJywgcHJvcGVydGllcy5OYW1lICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLk5hbWUpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3RhZ3MnLCAnVGFncycsIHByb3BlcnRpZXMuVGFncyAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldENmblRhZykocHJvcGVydGllcy5UYWdzKSA6IHVuZGVmaW5lZCBhcyBhbnkpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6Um91dGU1M1JlY292ZXJ5Q29udHJvbDo6Q2x1c3RlcmBcbiAqXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB0aGUgY2x1c3RlcnMgaW4gYW4gYWNjb3VudC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OkNsdXN0ZXJcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNsdXN0ZXIuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuQ2x1c3RlciBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OkNsdXN0ZXJcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5DbHVzdGVyIHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5DbHVzdGVyUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbkNsdXN0ZXIoc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBjbHVzdGVyLlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBDbHVzdGVyQXJuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJDbHVzdGVyQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBEZXBsb3ltZW50IHN0YXR1cyBvZiBhIHJlc291cmNlLiBTdGF0dXMgY2FuIGJlIG9uZSBvZiB0aGUgZm9sbG93aW5nOiBQRU5ESU5HLCBERVBMT1lFRCwgUEVORElOR19ERUxFVElPTi5cbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgU3RhdHVzXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJTdGF0dXM6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIGBBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OkNsdXN0ZXIuQ2x1c3RlckVuZHBvaW50c2BcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtY2x1c3Rlci5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNsdXN0ZXItY2x1c3RlcmVuZHBvaW50c1xuICAgICAqL1xuICAgIHB1YmxpYyBjbHVzdGVyRW5kcG9pbnRzOiBBcnJheTxDZm5DbHVzdGVyLkNsdXN0ZXJFbmRwb2ludFByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIE5hbWUgb2YgdGhlIGNsdXN0ZXIuIFlvdSBjYW4gdXNlIGFueSBub24td2hpdGUgc3BhY2UgY2hhcmFjdGVyIGluIHRoZSBuYW1lLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5Y29udHJvbC1jbHVzdGVyLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtY2x1c3Rlci1uYW1lXG4gICAgICovXG4gICAgcHVibGljIG5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFRoZSB2YWx1ZSBmb3IgYSB0YWcuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNsdXN0ZXIuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5Y29udHJvbC1jbHVzdGVyLXRhZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGFnczogY2RrLlRhZ01hbmFnZXI7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6Um91dGU1M1JlY292ZXJ5Q29udHJvbDo6Q2x1c3RlcmAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbkNsdXN0ZXJQcm9wcyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5DbHVzdGVyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICB0aGlzLmF0dHJDbHVzdGVyQXJuID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdDbHVzdGVyQXJuJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcbiAgICAgICAgdGhpcy5hdHRyU3RhdHVzID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdTdGF0dXMnLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuXG4gICAgICAgIHRoaXMuY2x1c3RlckVuZHBvaW50cyA9IHByb3BzLmNsdXN0ZXJFbmRwb2ludHM7XG4gICAgICAgIHRoaXMubmFtZSA9IHByb3BzLm5hbWU7XG4gICAgICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5TVEFOREFSRCwgXCJBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OkNsdXN0ZXJcIiwgcHJvcHMudGFncywgeyB0YWdQcm9wZXJ0eU5hbWU6ICd0YWdzJyB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmbkNsdXN0ZXIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNsdXN0ZXJFbmRwb2ludHM6IHRoaXMuY2x1c3RlckVuZHBvaW50cyxcbiAgICAgICAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgICAgIHRhZ3M6IHRoaXMudGFncy5yZW5kZXJUYWdzKCksXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuQ2x1c3RlclByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbkNsdXN0ZXIge1xuICAgIC8qKlxuICAgICAqIEEgY2x1c3RlciBlbmRwb2ludC4gU3BlY2lmeSBhbiBlbmRwb2ludCB3aGVuIHlvdSB3YW50IHRvIHNldCBvciByZXRyaWV2ZSBhIHJvdXRpbmcgY29udHJvbCBzdGF0ZSBpbiB0aGUgY2x1c3Rlci5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtY2x1c3Rlci1jbHVzdGVyZW5kcG9pbnQuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2x1c3RlckVuZHBvaW50UHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBjbHVzdGVyIGVuZHBvaW50LiBTcGVjaWZ5IGFuIGVuZHBvaW50IGFuZCBBV1MgUmVnaW9uIHdoZW4geW91IHdhbnQgdG8gc2V0IG9yIHJldHJpZXZlIGEgcm91dGluZyBjb250cm9sIHN0YXRlIGluIHRoZSBjbHVzdGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUbyBnZXQgb3IgdXBkYXRlIHRoZSByb3V0aW5nIGNvbnRyb2wgc3RhdGUsIHNlZSB0aGUgQW1hem9uIFJvdXRlIDUzIEFwcGxpY2F0aW9uIFJlY292ZXJ5IENvbnRyb2xsZXIgUm91dGluZyBDb250cm9sIEFjdGlvbnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcm91dGU1M3JlY292ZXJ5Y29udHJvbC1jbHVzdGVyLWNsdXN0ZXJlbmRwb2ludC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNsdXN0ZXItY2x1c3RlcmVuZHBvaW50LWVuZHBvaW50XG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBlbmRwb2ludD86IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBBV1MgUmVnaW9uIGZvciBhIGNsdXN0ZXIgZW5kcG9pbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcm91dGU1M3JlY292ZXJ5Y29udHJvbC1jbHVzdGVyLWNsdXN0ZXJlbmRwb2ludC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNsdXN0ZXItY2x1c3RlcmVuZHBvaW50LXJlZ2lvblxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDbHVzdGVyRW5kcG9pbnRQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2x1c3RlckVuZHBvaW50UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQ2x1c3Rlcl9DbHVzdGVyRW5kcG9pbnRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2VuZHBvaW50JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmVuZHBvaW50KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZWdpb24nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucmVnaW9uKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNsdXN0ZXJFbmRwb2ludFByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpSb3V0ZTUzUmVjb3ZlcnlDb250cm9sOjpDbHVzdGVyLkNsdXN0ZXJFbmRwb2ludGAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2x1c3RlckVuZHBvaW50UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OkNsdXN0ZXIuQ2x1c3RlckVuZHBvaW50YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkNsdXN0ZXJDbHVzdGVyRW5kcG9pbnRQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQ2x1c3Rlcl9DbHVzdGVyRW5kcG9pbnRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRW5kcG9pbnQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZW5kcG9pbnQpLFxuICAgICAgICBSZWdpb246IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmVnaW9uKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuQ2x1c3RlckNsdXN0ZXJFbmRwb2ludFByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuQ2x1c3Rlci5DbHVzdGVyRW5kcG9pbnRQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5DbHVzdGVyLkNsdXN0ZXJFbmRwb2ludFByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZW5kcG9pbnQnLCAnRW5kcG9pbnQnLCBwcm9wZXJ0aWVzLkVuZHBvaW50ICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkVuZHBvaW50KSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyZWdpb24nLCAnUmVnaW9uJywgcHJvcGVydGllcy5SZWdpb24gIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUmVnaW9uKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuQ29udHJvbFBhbmVsYFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNvbnRyb2xwYW5lbC5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQ29udHJvbFBhbmVsUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGNvbnRyb2wgcGFuZWwuIFlvdSBjYW4gdXNlIGFueSBub24td2hpdGUgc3BhY2UgY2hhcmFjdGVyIGluIHRoZSBuYW1lLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5Y29udHJvbC1jb250cm9scGFuZWwuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5Y29udHJvbC1jb250cm9scGFuZWwtbmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgY2x1c3RlciBmb3IgdGhlIGNvbnRyb2wgcGFuZWwuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNvbnRyb2xwYW5lbC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNvbnRyb2xwYW5lbC1jbHVzdGVyYXJuXG4gICAgICovXG4gICAgcmVhZG9ubHkgY2x1c3RlckFybj86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSB2YWx1ZSBmb3IgYSB0YWcuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNvbnRyb2xwYW5lbC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNvbnRyb2xwYW5lbC10YWdzXG4gICAgICovXG4gICAgcmVhZG9ubHkgdGFncz86IGNkay5DZm5UYWdbXTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5Db250cm9sUGFuZWxQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuQ29udHJvbFBhbmVsUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQ29udHJvbFBhbmVsUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjbHVzdGVyQXJuJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmNsdXN0ZXJBcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25hbWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMubmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5uYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0YWdzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlQ2ZuVGFnKSkocHJvcGVydGllcy50YWdzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmbkNvbnRyb2xQYW5lbFByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpSb3V0ZTUzUmVjb3ZlcnlDb250cm9sOjpDb250cm9sUGFuZWxgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkNvbnRyb2xQYW5lbFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpSb3V0ZTUzUmVjb3ZlcnlDb250cm9sOjpDb250cm9sUGFuZWxgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQ29udHJvbFBhbmVsUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkNvbnRyb2xQYW5lbFByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLm5hbWUpLFxuICAgICAgICBDbHVzdGVyQXJuOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmNsdXN0ZXJBcm4pLFxuICAgICAgICBUYWdzOiBjZGsubGlzdE1hcHBlcihjZGsuY2ZuVGFnVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy50YWdzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuQ29udHJvbFBhbmVsUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5Db250cm9sUGFuZWxQcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuQ29udHJvbFBhbmVsUHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCduYW1lJywgJ05hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLk5hbWUpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2NsdXN0ZXJBcm4nLCAnQ2x1c3RlckFybicsIHByb3BlcnRpZXMuQ2x1c3RlckFybiAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5DbHVzdGVyQXJuKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0YWdzJywgJ1RhZ3MnLCBwcm9wZXJ0aWVzLlRhZ3MgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRDZm5UYWcpKHByb3BlcnRpZXMuVGFncykgOiB1bmRlZmluZWQgYXMgYW55KTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OkNvbnRyb2xQYW5lbGBcbiAqXG4gKiBDcmVhdGVzIGEgbmV3IGNvbnRyb2wgcGFuZWwuIEEgY29udHJvbCBwYW5lbCByZXByZXNlbnRzIGEgZ3JvdXAgb2Ygcm91dGluZyBjb250cm9scyB0aGF0IGNhbiBiZSBjaGFuZ2VkIHRvZ2V0aGVyIGluIGEgc2luZ2xlIHRyYW5zYWN0aW9uLiBZb3UgY2FuIHVzZSBhIGNvbnRyb2wgcGFuZWwgdG8gY2VudHJhbGx5IHZpZXcgdGhlIG9wZXJhdGlvbmFsIHN0YXR1cyBvZiBhcHBsaWNhdGlvbnMgYWNyb3NzIHlvdXIgb3JnYW5pemF0aW9uLCBhbmQgdHJpZ2dlciBtdWx0aS1hcHAgZmFpbG92ZXJzIGluIGEgc2luZ2xlIHRyYW5zYWN0aW9uLCBmb3IgZXhhbXBsZSwgdG8gZmFpbCBvdmVyIGFuIEF2YWlsYWJpbGl0eSBab25lIG9yIEFXUyBSZWdpb24gLlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6Um91dGU1M1JlY292ZXJ5Q29udHJvbDo6Q29udHJvbFBhbmVsXG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5Y29udHJvbC1jb250cm9scGFuZWwuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuQ29udHJvbFBhbmVsIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6Um91dGU1M1JlY292ZXJ5Q29udHJvbDo6Q29udHJvbFBhbmVsXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuQ29udHJvbFBhbmVsIHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5Db250cm9sUGFuZWxQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuQ29udHJvbFBhbmVsKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgY29udHJvbCBwYW5lbC5cbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgQ29udHJvbFBhbmVsQXJuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJDb250cm9sUGFuZWxBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBib29sZWFuIGZsYWcgdGhhdCBpcyBzZXQgdG8gdHJ1ZSBmb3IgdGhlIGRlZmF1bHQgY29udHJvbCBwYW5lbCBpbiB0aGUgY2x1c3Rlci5cbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgRGVmYXVsdENvbnRyb2xQYW5lbFxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyRGVmYXVsdENvbnRyb2xQYW5lbDogY2RrLklSZXNvbHZhYmxlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiByb3V0aW5nIGNvbnRyb2xzIGluIHRoZSBjb250cm9sIHBhbmVsLlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBSb3V0aW5nQ29udHJvbENvdW50XG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJSb3V0aW5nQ29udHJvbENvdW50OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVwbG95bWVudCBzdGF0dXMgb2YgY29udHJvbCBwYW5lbC4gU3RhdHVzIGNhbiBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZzogUEVORElORywgREVQTE9ZRUQsIFBFTkRJTkdfREVMRVRJT04uXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIFN0YXR1c1xuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyU3RhdHVzOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgY29udHJvbCBwYW5lbC4gWW91IGNhbiB1c2UgYW55IG5vbi13aGl0ZSBzcGFjZSBjaGFyYWN0ZXIgaW4gdGhlIG5hbWUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNvbnRyb2xwYW5lbC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNvbnRyb2xwYW5lbC1uYW1lXG4gICAgICovXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgY2x1c3RlciBmb3IgdGhlIGNvbnRyb2wgcGFuZWwuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNvbnRyb2xwYW5lbC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNvbnRyb2xwYW5lbC1jbHVzdGVyYXJuXG4gICAgICovXG4gICAgcHVibGljIGNsdXN0ZXJBcm46IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFRoZSB2YWx1ZSBmb3IgYSB0YWcuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNvbnRyb2xwYW5lbC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLWNvbnRyb2xwYW5lbC10YWdzXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHRhZ3M6IGNkay5UYWdNYW5hZ2VyO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OkNvbnRyb2xQYW5lbGAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbkNvbnRyb2xQYW5lbFByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5Db250cm9sUGFuZWwuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICduYW1lJywgdGhpcyk7XG4gICAgICAgIHRoaXMuYXR0ckNvbnRyb2xQYW5lbEFybiA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnQ29udHJvbFBhbmVsQXJuJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcbiAgICAgICAgdGhpcy5hdHRyRGVmYXVsdENvbnRyb2xQYW5lbCA9IHRoaXMuZ2V0QXR0KCdEZWZhdWx0Q29udHJvbFBhbmVsJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpO1xuICAgICAgICB0aGlzLmF0dHJSb3V0aW5nQ29udHJvbENvdW50ID0gY2RrLlRva2VuLmFzTnVtYmVyKHRoaXMuZ2V0QXR0KCdSb3V0aW5nQ29udHJvbENvdW50JywgY2RrLlJlc29sdXRpb25UeXBlSGludC5OVU1CRVIpKTtcbiAgICAgICAgdGhpcy5hdHRyU3RhdHVzID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdTdGF0dXMnLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuXG4gICAgICAgIHRoaXMubmFtZSA9IHByb3BzLm5hbWU7XG4gICAgICAgIHRoaXMuY2x1c3RlckFybiA9IHByb3BzLmNsdXN0ZXJBcm47XG4gICAgICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5TVEFOREFSRCwgXCJBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OkNvbnRyb2xQYW5lbFwiLCBwcm9wcy50YWdzLCB7IHRhZ1Byb3BlcnR5TmFtZTogJ3RhZ3MnIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuQ29udHJvbFBhbmVsLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAgICAgICBjbHVzdGVyQXJuOiB0aGlzLmNsdXN0ZXJBcm4sXG4gICAgICAgICAgICB0YWdzOiB0aGlzLnRhZ3MucmVuZGVyVGFncygpLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmbkNvbnRyb2xQYW5lbFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmblJvdXRpbmdDb250cm9sYFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXJvdXRpbmdjb250cm9sLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5Sb3V0aW5nQ29udHJvbFByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSByb3V0aW5nIGNvbnRyb2wuIFlvdSBjYW4gdXNlIGFueSBub24td2hpdGUgc3BhY2UgY2hhcmFjdGVyIGluIHRoZSBuYW1lLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5Y29udHJvbC1yb3V0aW5nY29udHJvbC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXJvdXRpbmdjb250cm9sLW5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIGNsdXN0ZXIgdGhhdCBpbmNsdWRlcyB0aGUgcm91dGluZyBjb250cm9sLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5Y29udHJvbC1yb3V0aW5nY29udHJvbC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXJvdXRpbmdjb250cm9sLWNsdXN0ZXJhcm5cbiAgICAgKi9cbiAgICByZWFkb25seSBjbHVzdGVyQXJuPzogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBjb250cm9sIHBhbmVsIHRoYXQgaW5jbHVkZXMgdGhlIHJvdXRpbmcgY29udHJvbC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtcm91dGluZ2NvbnRyb2wuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5Y29udHJvbC1yb3V0aW5nY29udHJvbC1jb250cm9scGFuZWxhcm5cbiAgICAgKi9cbiAgICByZWFkb25seSBjb250cm9sUGFuZWxBcm4/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuUm91dGluZ0NvbnRyb2xQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuUm91dGluZ0NvbnRyb2xQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5Sb3V0aW5nQ29udHJvbFByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY2x1c3RlckFybicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5jbHVzdGVyQXJuKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjb250cm9sUGFuZWxBcm4nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuY29udHJvbFBhbmVsQXJuKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCduYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLm5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubmFtZSkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5Sb3V0aW5nQ29udHJvbFByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpSb3V0ZTUzUmVjb3ZlcnlDb250cm9sOjpSb3V0aW5nQ29udHJvbGAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuUm91dGluZ0NvbnRyb2xQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6Um91dGU1M1JlY292ZXJ5Q29udHJvbDo6Um91dGluZ0NvbnRyb2xgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUm91dGluZ0NvbnRyb2xQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuUm91dGluZ0NvbnRyb2xQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5uYW1lKSxcbiAgICAgICAgQ2x1c3RlckFybjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5jbHVzdGVyQXJuKSxcbiAgICAgICAgQ29udHJvbFBhbmVsQXJuOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmNvbnRyb2xQYW5lbEFybiksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblJvdXRpbmdDb250cm9sUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5Sb3V0aW5nQ29udHJvbFByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5Sb3V0aW5nQ29udHJvbFByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbmFtZScsICdOYW1lJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5OYW1lKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdjbHVzdGVyQXJuJywgJ0NsdXN0ZXJBcm4nLCBwcm9wZXJ0aWVzLkNsdXN0ZXJBcm4gIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuQ2x1c3RlckFybikgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnY29udHJvbFBhbmVsQXJuJywgJ0NvbnRyb2xQYW5lbEFybicsIHByb3BlcnRpZXMuQ29udHJvbFBhbmVsQXJuICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkNvbnRyb2xQYW5lbEFybikgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6Um91dGU1M1JlY292ZXJ5Q29udHJvbDo6Um91dGluZ0NvbnRyb2xgXG4gKlxuICogRGVmaW5lcyBhIHJvdXRpbmcgY29udHJvbC4gVG8gZ2V0IG9yIHVwZGF0ZSB0aGUgcm91dGluZyBjb250cm9sIHN0YXRlLCBzZWUgdGhlIFJlY292ZXJ5IENsdXN0ZXIgKGRhdGEgcGxhbmUpIEFQSSBhY3Rpb25zIGZvciBBbWF6b24gUm91dGUgNTMgQXBwbGljYXRpb24gUmVjb3ZlcnkgQ29udHJvbGxlci5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OlJvdXRpbmdDb250cm9sXG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5Y29udHJvbC1yb3V0aW5nY29udHJvbC5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5Sb3V0aW5nQ29udHJvbCBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OlJvdXRpbmdDb250cm9sXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuUm91dGluZ0NvbnRyb2wge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmblJvdXRpbmdDb250cm9sUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmblJvdXRpbmdDb250cm9sKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgcm91dGluZyBjb250cm9sLlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBSb3V0aW5nQ29udHJvbEFyblxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyUm91dGluZ0NvbnRyb2xBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZXBsb3ltZW50IHN0YXR1cyBvZiB0aGUgcm91dGluZyBjb250cm9sLiBTdGF0dXMgY2FuIGJlIG9uZSBvZiB0aGUgZm9sbG93aW5nOiBQRU5ESU5HLCBERVBMT1lFRCwgUEVORElOR19ERUxFVElPTi5cbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgU3RhdHVzXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJTdGF0dXM6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSByb3V0aW5nIGNvbnRyb2wuIFlvdSBjYW4gdXNlIGFueSBub24td2hpdGUgc3BhY2UgY2hhcmFjdGVyIGluIHRoZSBuYW1lLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5Y29udHJvbC1yb3V0aW5nY29udHJvbC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXJvdXRpbmdjb250cm9sLW5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBjbHVzdGVyIHRoYXQgaW5jbHVkZXMgdGhlIHJvdXRpbmcgY29udHJvbC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtcm91dGluZ2NvbnRyb2wuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5Y29udHJvbC1yb3V0aW5nY29udHJvbC1jbHVzdGVyYXJuXG4gICAgICovXG4gICAgcHVibGljIGNsdXN0ZXJBcm46IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgY29udHJvbCBwYW5lbCB0aGF0IGluY2x1ZGVzIHRoZSByb3V0aW5nIGNvbnRyb2wuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXJvdXRpbmdjb250cm9sLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtcm91dGluZ2NvbnRyb2wtY29udHJvbHBhbmVsYXJuXG4gICAgICovXG4gICAgcHVibGljIGNvbnRyb2xQYW5lbEFybjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OlJvdXRpbmdDb250cm9sYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuUm91dGluZ0NvbnRyb2xQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuUm91dGluZ0NvbnRyb2wuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICduYW1lJywgdGhpcyk7XG4gICAgICAgIHRoaXMuYXR0clJvdXRpbmdDb250cm9sQXJuID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdSb3V0aW5nQ29udHJvbEFybicsIGNkay5SZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKSk7XG4gICAgICAgIHRoaXMuYXR0clN0YXR1cyA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnU3RhdHVzJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcblxuICAgICAgICB0aGlzLm5hbWUgPSBwcm9wcy5uYW1lO1xuICAgICAgICB0aGlzLmNsdXN0ZXJBcm4gPSBwcm9wcy5jbHVzdGVyQXJuO1xuICAgICAgICB0aGlzLmNvbnRyb2xQYW5lbEFybiA9IHByb3BzLmNvbnRyb2xQYW5lbEFybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmblJvdXRpbmdDb250cm9sLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAgICAgICBjbHVzdGVyQXJuOiB0aGlzLmNsdXN0ZXJBcm4sXG4gICAgICAgICAgICBjb250cm9sUGFuZWxBcm46IHRoaXMuY29udHJvbFBhbmVsQXJuLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmblJvdXRpbmdDb250cm9sUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuU2FmZXR5UnVsZWBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5TYWZldHlSdWxlUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIGZvciB0aGUgY29udHJvbCBwYW5lbC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtc2FmZXR5cnVsZS5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXNhZmV0eXJ1bGUtY29udHJvbHBhbmVsYXJuXG4gICAgICovXG4gICAgcmVhZG9ubHkgY29udHJvbFBhbmVsQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYXNzZXJ0aW9uIHJ1bGUuIFRoZSBuYW1lIG11c3QgYmUgdW5pcXVlIHdpdGhpbiBhIGNvbnRyb2wgcGFuZWwuIFlvdSBjYW4gdXNlIGFueSBub24td2hpdGUgc3BhY2UgY2hhcmFjdGVyIGluIHRoZSBuYW1lIGV4Y2VwdCB0aGUgZm9sbG93aW5nOiAmID4gPCAnIChzaW5nbGUgcXVvdGUpIFwiIChkb3VibGUgcXVvdGUpIDsgKHNlbWljb2xvbilcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtc2FmZXR5cnVsZS5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXNhZmV0eXJ1bGUtbmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBjcml0ZXJpYSB0aGF0IHlvdSBzZXQgZm9yIHNwZWNpZmljIGFzc2VydGlvbiBjb250cm9scyAocm91dGluZyBjb250cm9scykgdGhhdCBkZXNpZ25hdGUgaG93IG1hbnkgY29udHJvbCBzdGF0ZXMgbXVzdCBiZSBgT05gIGFzIHRoZSByZXN1bHQgb2YgYSB0cmFuc2FjdGlvbi4gRm9yIGV4YW1wbGUsIGlmIHlvdSBoYXZlIHRocmVlIGFzc2VydGlvbiBjb250cm9scywgeW91IG1pZ2h0IHNwZWNpZnkgYEFUTEVBU1QgMmAgZm9yIHlvdXIgcnVsZSBjb25maWd1cmF0aW9uLiBUaGlzIG1lYW5zIHRoYXQgYXQgbGVhc3QgdHdvIGFzc2VydGlvbiBjb250cm9scyBtdXN0IGJlIGBPTmAgLCBzbyB0aGF0IGF0IGxlYXN0IHR3byBBV1MgUmVnaW9ucyBoYXZlIHRyYWZmaWMgZmxvd2luZyB0byB0aGVtLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtc2FmZXR5cnVsZS1ydWxlY29uZmlnXG4gICAgICovXG4gICAgcmVhZG9ubHkgcnVsZUNvbmZpZzogQ2ZuU2FmZXR5UnVsZS5SdWxlQ29uZmlnUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhc3NlcnRpb24gcnVsZSBlbmZvcmNlcyB0aGF0LCB3aGVuIHlvdSBjaGFuZ2UgYSByb3V0aW5nIGNvbnRyb2wgc3RhdGUsIHRoYXQgdGhlIGNyaXRlcmlhIHRoYXQgeW91IHNldCBpbiB0aGUgcnVsZSBjb25maWd1cmF0aW9uIGlzIG1ldC4gT3RoZXJ3aXNlLCB0aGUgY2hhbmdlIHRvIHRoZSByb3V0aW5nIGNvbnRyb2wgaXMgbm90IGFjY2VwdGVkLiBGb3IgZXhhbXBsZSwgdGhlIGNyaXRlcmlhIG1pZ2h0IGJlIHRoYXQgYXQgbGVhc3Qgb25lIHJvdXRpbmcgY29udHJvbCBzdGF0ZSBpcyBgT25gIGFmdGVyIHRoZSB0cmFuc2FjdGlvbiBzbyB0aGF0IHRyYWZmaWMgY29udGludWVzIHRvIGZsb3cgdG8gYXQgbGVhc3Qgb25lIGNlbGwgZm9yIHRoZSBhcHBsaWNhdGlvbi4gVGhpcyBlbnN1cmVzIHRoYXQgeW91IGF2b2lkIGEgZmFpbC1vcGVuIHNjZW5hcmlvLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtc2FmZXR5cnVsZS1hc3NlcnRpb25ydWxlXG4gICAgICovXG4gICAgcmVhZG9ubHkgYXNzZXJ0aW9uUnVsZT86IENmblNhZmV0eVJ1bGUuQXNzZXJ0aW9uUnVsZVByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gICAgLyoqXG4gICAgICogQSBnYXRpbmcgcnVsZSB2ZXJpZmllcyB0aGF0IGEgZ2F0aW5nIHJvdXRpbmcgY29udHJvbCBvciBzZXQgb2YgZ2F0aW5nIHJvdXRpbmcgY29udHJvbHMsIGV2YWx1YXRlcyBhcyB0cnVlLCBiYXNlZCBvbiBhIHJ1bGUgY29uZmlndXJhdGlvbiB0aGF0IHlvdSBzcGVjaWZ5LCB3aGljaCBhbGxvd3MgYSBzZXQgb2Ygcm91dGluZyBjb250cm9sIHN0YXRlIGNoYW5nZXMgdG8gY29tcGxldGUuXG4gICAgICpcbiAgICAgKiBGb3IgZXhhbXBsZSwgaWYgeW91IHNwZWNpZnkgb25lIGdhdGluZyByb3V0aW5nIGNvbnRyb2wgYW5kIHlvdSBzZXQgdGhlIGBUeXBlYCBpbiB0aGUgcnVsZSBjb25maWd1cmF0aW9uIHRvIGBPUmAgLCB0aGF0IGluZGljYXRlcyB0aGF0IHlvdSBtdXN0IHNldCB0aGUgZ2F0aW5nIHJvdXRpbmcgY29udHJvbCB0byBgT25gIGZvciB0aGUgcnVsZSB0byBldmFsdWF0ZSBhcyB0cnVlOyB0aGF0IGlzLCBmb3IgdGhlIGdhdGluZyBjb250cm9sIFwic3dpdGNoXCIgdG8gYmUgXCJPblwiLiBXaGVuIHlvdSBkbyB0aGF0LCB0aGVuIHlvdSBjYW4gdXBkYXRlIHRoZSByb3V0aW5nIGNvbnRyb2wgc3RhdGVzIGZvciB0aGUgdGFyZ2V0IHJvdXRpbmcgY29udHJvbHMgdGhhdCB5b3Ugc3BlY2lmeSBpbiB0aGUgZ2F0aW5nIHJ1bGUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXNhZmV0eXJ1bGUuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLWdhdGluZ3J1bGVcbiAgICAgKi9cbiAgICByZWFkb25seSBnYXRpbmdSdWxlPzogQ2ZuU2FmZXR5UnVsZS5HYXRpbmdSdWxlUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdmFsdWUgZm9yIGEgdGFnLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtc2FmZXR5cnVsZS10YWdzXG4gICAgICovXG4gICAgcmVhZG9ubHkgdGFncz86IGNkay5DZm5UYWdbXTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5TYWZldHlSdWxlUHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblNhZmV0eVJ1bGVQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5TYWZldHlSdWxlUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhc3NlcnRpb25SdWxlJywgQ2ZuU2FmZXR5UnVsZV9Bc3NlcnRpb25SdWxlUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMuYXNzZXJ0aW9uUnVsZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY29udHJvbFBhbmVsQXJuJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmNvbnRyb2xQYW5lbEFybikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY29udHJvbFBhbmVsQXJuJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmNvbnRyb2xQYW5lbEFybikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZ2F0aW5nUnVsZScsIENmblNhZmV0eVJ1bGVfR2F0aW5nUnVsZVByb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLmdhdGluZ1J1bGUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25hbWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMubmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5uYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdydWxlQ29uZmlnJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnJ1bGVDb25maWcpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3J1bGVDb25maWcnLCBDZm5TYWZldHlSdWxlX1J1bGVDb25maWdQcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5ydWxlQ29uZmlnKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0YWdzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlQ2ZuVGFnKSkocHJvcGVydGllcy50YWdzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmblNhZmV0eVJ1bGVQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6Um91dGU1M1JlY292ZXJ5Q29udHJvbDo6U2FmZXR5UnVsZWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuU2FmZXR5UnVsZVByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpSb3V0ZTUzUmVjb3ZlcnlDb250cm9sOjpTYWZldHlSdWxlYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblNhZmV0eVJ1bGVQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuU2FmZXR5UnVsZVByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBDb250cm9sUGFuZWxBcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuY29udHJvbFBhbmVsQXJuKSxcbiAgICAgICAgTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5uYW1lKSxcbiAgICAgICAgUnVsZUNvbmZpZzogY2ZuU2FmZXR5UnVsZVJ1bGVDb25maWdQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5ydWxlQ29uZmlnKSxcbiAgICAgICAgQXNzZXJ0aW9uUnVsZTogY2ZuU2FmZXR5UnVsZUFzc2VydGlvblJ1bGVQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hc3NlcnRpb25SdWxlKSxcbiAgICAgICAgR2F0aW5nUnVsZTogY2ZuU2FmZXR5UnVsZUdhdGluZ1J1bGVQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5nYXRpbmdSdWxlKSxcbiAgICAgICAgVGFnczogY2RrLmxpc3RNYXBwZXIoY2RrLmNmblRhZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMudGFncyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblNhZmV0eVJ1bGVQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblNhZmV0eVJ1bGVQcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuU2FmZXR5UnVsZVByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnY29udHJvbFBhbmVsQXJuJywgJ0NvbnRyb2xQYW5lbEFybicsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuQ29udHJvbFBhbmVsQXJuKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCduYW1lJywgJ05hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLk5hbWUpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3J1bGVDb25maWcnLCAnUnVsZUNvbmZpZycsIENmblNhZmV0eVJ1bGVSdWxlQ29uZmlnUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5SdWxlQ29uZmlnKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdhc3NlcnRpb25SdWxlJywgJ0Fzc2VydGlvblJ1bGUnLCBwcm9wZXJ0aWVzLkFzc2VydGlvblJ1bGUgIT0gbnVsbCA/IENmblNhZmV0eVJ1bGVBc3NlcnRpb25SdWxlUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5Bc3NlcnRpb25SdWxlKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdnYXRpbmdSdWxlJywgJ0dhdGluZ1J1bGUnLCBwcm9wZXJ0aWVzLkdhdGluZ1J1bGUgIT0gbnVsbCA/IENmblNhZmV0eVJ1bGVHYXRpbmdSdWxlUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5HYXRpbmdSdWxlKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0YWdzJywgJ1RhZ3MnLCBwcm9wZXJ0aWVzLlRhZ3MgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRDZm5UYWcpKHByb3BlcnRpZXMuVGFncykgOiB1bmRlZmluZWQgYXMgYW55KTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OlNhZmV0eVJ1bGVgXG4gKlxuICogTGlzdCB0aGUgc2FmZXR5IHJ1bGVzICh0aGUgYXNzZXJ0aW9uIHJ1bGVzIGFuZCBnYXRpbmcgcnVsZXMpIHRoYXQgeW91J3ZlIGRlZmluZWQgZm9yIHRoZSByb3V0aW5nIGNvbnRyb2xzIGluIGEgY29udHJvbCBwYW5lbC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OlNhZmV0eVJ1bGVcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXNhZmV0eXJ1bGUuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuU2FmZXR5UnVsZSBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OlNhZmV0eVJ1bGVcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5TYWZldHlSdWxlIHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5TYWZldHlSdWxlUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmblNhZmV0eVJ1bGUoc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBzYWZldHkgcnVsZS5cbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgU2FmZXR5UnVsZUFyblxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyU2FmZXR5UnVsZUFybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlcGxveW1lbnQgc3RhdHVzIG9mIHRoZSBzYWZldHkgcnVsZS4gU3RhdHVzIGNhbiBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZzogUEVORElORywgREVQTE9ZRUQsIFBFTkRJTkdfREVMRVRJT04uXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIFN0YXR1c1xuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyU3RhdHVzOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgZm9yIHRoZSBjb250cm9sIHBhbmVsLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtc2FmZXR5cnVsZS1jb250cm9scGFuZWxhcm5cbiAgICAgKi9cbiAgICBwdWJsaWMgY29udHJvbFBhbmVsQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYXNzZXJ0aW9uIHJ1bGUuIFRoZSBuYW1lIG11c3QgYmUgdW5pcXVlIHdpdGhpbiBhIGNvbnRyb2wgcGFuZWwuIFlvdSBjYW4gdXNlIGFueSBub24td2hpdGUgc3BhY2UgY2hhcmFjdGVyIGluIHRoZSBuYW1lIGV4Y2VwdCB0aGUgZm9sbG93aW5nOiAmID4gPCAnIChzaW5nbGUgcXVvdGUpIFwiIChkb3VibGUgcXVvdGUpIDsgKHNlbWljb2xvbilcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtc2FmZXR5cnVsZS5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXNhZmV0eXJ1bGUtbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY3JpdGVyaWEgdGhhdCB5b3Ugc2V0IGZvciBzcGVjaWZpYyBhc3NlcnRpb24gY29udHJvbHMgKHJvdXRpbmcgY29udHJvbHMpIHRoYXQgZGVzaWduYXRlIGhvdyBtYW55IGNvbnRyb2wgc3RhdGVzIG11c3QgYmUgYE9OYCBhcyB0aGUgcmVzdWx0IG9mIGEgdHJhbnNhY3Rpb24uIEZvciBleGFtcGxlLCBpZiB5b3UgaGF2ZSB0aHJlZSBhc3NlcnRpb24gY29udHJvbHMsIHlvdSBtaWdodCBzcGVjaWZ5IGBBVExFQVNUIDJgIGZvciB5b3VyIHJ1bGUgY29uZmlndXJhdGlvbi4gVGhpcyBtZWFucyB0aGF0IGF0IGxlYXN0IHR3byBhc3NlcnRpb24gY29udHJvbHMgbXVzdCBiZSBgT05gICwgc28gdGhhdCBhdCBsZWFzdCB0d28gQVdTIFJlZ2lvbnMgaGF2ZSB0cmFmZmljIGZsb3dpbmcgdG8gdGhlbS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtc2FmZXR5cnVsZS5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXNhZmV0eXJ1bGUtcnVsZWNvbmZpZ1xuICAgICAqL1xuICAgIHB1YmxpYyBydWxlQ29uZmlnOiBDZm5TYWZldHlSdWxlLlJ1bGVDb25maWdQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIEFuIGFzc2VydGlvbiBydWxlIGVuZm9yY2VzIHRoYXQsIHdoZW4geW91IGNoYW5nZSBhIHJvdXRpbmcgY29udHJvbCBzdGF0ZSwgdGhhdCB0aGUgY3JpdGVyaWEgdGhhdCB5b3Ugc2V0IGluIHRoZSBydWxlIGNvbmZpZ3VyYXRpb24gaXMgbWV0LiBPdGhlcndpc2UsIHRoZSBjaGFuZ2UgdG8gdGhlIHJvdXRpbmcgY29udHJvbCBpcyBub3QgYWNjZXB0ZWQuIEZvciBleGFtcGxlLCB0aGUgY3JpdGVyaWEgbWlnaHQgYmUgdGhhdCBhdCBsZWFzdCBvbmUgcm91dGluZyBjb250cm9sIHN0YXRlIGlzIGBPbmAgYWZ0ZXIgdGhlIHRyYW5zYWN0aW9uIHNvIHRoYXQgdHJhZmZpYyBjb250aW51ZXMgdG8gZmxvdyB0byBhdCBsZWFzdCBvbmUgY2VsbCBmb3IgdGhlIGFwcGxpY2F0aW9uLiBUaGlzIGVuc3VyZXMgdGhhdCB5b3UgYXZvaWQgYSBmYWlsLW9wZW4gc2NlbmFyaW8uXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXNhZmV0eXJ1bGUuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLWFzc2VydGlvbnJ1bGVcbiAgICAgKi9cbiAgICBwdWJsaWMgYXNzZXJ0aW9uUnVsZTogQ2ZuU2FmZXR5UnVsZS5Bc3NlcnRpb25SdWxlUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBBIGdhdGluZyBydWxlIHZlcmlmaWVzIHRoYXQgYSBnYXRpbmcgcm91dGluZyBjb250cm9sIG9yIHNldCBvZiBnYXRpbmcgcm91dGluZyBjb250cm9scywgZXZhbHVhdGVzIGFzIHRydWUsIGJhc2VkIG9uIGEgcnVsZSBjb25maWd1cmF0aW9uIHRoYXQgeW91IHNwZWNpZnksIHdoaWNoIGFsbG93cyBhIHNldCBvZiByb3V0aW5nIGNvbnRyb2wgc3RhdGUgY2hhbmdlcyB0byBjb21wbGV0ZS5cbiAgICAgKlxuICAgICAqIEZvciBleGFtcGxlLCBpZiB5b3Ugc3BlY2lmeSBvbmUgZ2F0aW5nIHJvdXRpbmcgY29udHJvbCBhbmQgeW91IHNldCB0aGUgYFR5cGVgIGluIHRoZSBydWxlIGNvbmZpZ3VyYXRpb24gdG8gYE9SYCAsIHRoYXQgaW5kaWNhdGVzIHRoYXQgeW91IG11c3Qgc2V0IHRoZSBnYXRpbmcgcm91dGluZyBjb250cm9sIHRvIGBPbmAgZm9yIHRoZSBydWxlIHRvIGV2YWx1YXRlIGFzIHRydWU7IHRoYXQgaXMsIGZvciB0aGUgZ2F0aW5nIGNvbnRyb2wgXCJzd2l0Y2hcIiB0byBiZSBcIk9uXCIuIFdoZW4geW91IGRvIHRoYXQsIHRoZW4geW91IGNhbiB1cGRhdGUgdGhlIHJvdXRpbmcgY29udHJvbCBzdGF0ZXMgZm9yIHRoZSB0YXJnZXQgcm91dGluZyBjb250cm9scyB0aGF0IHlvdSBzcGVjaWZ5IGluIHRoZSBnYXRpbmcgcnVsZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtc2FmZXR5cnVsZS5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXNhZmV0eXJ1bGUtZ2F0aW5ncnVsZVxuICAgICAqL1xuICAgIHB1YmxpYyBnYXRpbmdSdWxlOiBDZm5TYWZldHlSdWxlLkdhdGluZ1J1bGVQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFRoZSB2YWx1ZSBmb3IgYSB0YWcuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXNhZmV0eXJ1bGUuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLXRhZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGFnczogY2RrLlRhZ01hbmFnZXI7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6Um91dGU1M1JlY292ZXJ5Q29udHJvbDo6U2FmZXR5UnVsZWAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmblNhZmV0eVJ1bGVQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuU2FmZXR5UnVsZS5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2NvbnRyb2xQYW5lbEFybicsIHRoaXMpO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnbmFtZScsIHRoaXMpO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAncnVsZUNvbmZpZycsIHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJTYWZldHlSdWxlQXJuID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdTYWZldHlSdWxlQXJuJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcbiAgICAgICAgdGhpcy5hdHRyU3RhdHVzID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdTdGF0dXMnLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuXG4gICAgICAgIHRoaXMuY29udHJvbFBhbmVsQXJuID0gcHJvcHMuY29udHJvbFBhbmVsQXJuO1xuICAgICAgICB0aGlzLm5hbWUgPSBwcm9wcy5uYW1lO1xuICAgICAgICB0aGlzLnJ1bGVDb25maWcgPSBwcm9wcy5ydWxlQ29uZmlnO1xuICAgICAgICB0aGlzLmFzc2VydGlvblJ1bGUgPSBwcm9wcy5hc3NlcnRpb25SdWxlO1xuICAgICAgICB0aGlzLmdhdGluZ1J1bGUgPSBwcm9wcy5nYXRpbmdSdWxlO1xuICAgICAgICB0aGlzLnRhZ3MgPSBuZXcgY2RrLlRhZ01hbmFnZXIoY2RrLlRhZ1R5cGUuU1RBTkRBUkQsIFwiQVdTOjpSb3V0ZTUzUmVjb3ZlcnlDb250cm9sOjpTYWZldHlSdWxlXCIsIHByb3BzLnRhZ3MsIHsgdGFnUHJvcGVydHlOYW1lOiAndGFncycgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5TYWZldHlSdWxlLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb250cm9sUGFuZWxBcm46IHRoaXMuY29udHJvbFBhbmVsQXJuLFxuICAgICAgICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgICAgICAgcnVsZUNvbmZpZzogdGhpcy5ydWxlQ29uZmlnLFxuICAgICAgICAgICAgYXNzZXJ0aW9uUnVsZTogdGhpcy5hc3NlcnRpb25SdWxlLFxuICAgICAgICAgICAgZ2F0aW5nUnVsZTogdGhpcy5nYXRpbmdSdWxlLFxuICAgICAgICAgICAgdGFnczogdGhpcy50YWdzLnJlbmRlclRhZ3MoKSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5TYWZldHlSdWxlUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuU2FmZXR5UnVsZSB7XG4gICAgLyoqXG4gICAgICogQW4gYXNzZXJ0aW9uIHJ1bGUgZW5mb3JjZXMgdGhhdCwgd2hlbiB5b3UgY2hhbmdlIGEgcm91dGluZyBjb250cm9sIHN0YXRlLCB0aGF0IHRoZSBjcml0ZXJpYSB0aGF0IHlvdSBzZXQgaW4gdGhlIHJ1bGUgY29uZmlndXJhdGlvbiBpcyBtZXQuIE90aGVyd2lzZSwgdGhlIGNoYW5nZSB0byB0aGUgcm91dGluZyBjb250cm9sIGlzIG5vdCBhY2NlcHRlZC4gRm9yIGV4YW1wbGUsIHRoZSBjcml0ZXJpYSBtaWdodCBiZSB0aGF0IGF0IGxlYXN0IG9uZSByb3V0aW5nIGNvbnRyb2wgc3RhdGUgaXMgYE9uYCBhZnRlciB0aGUgdHJhbnNhY3Rpb24gc28gdGhhdCB0cmFmZmljIGNvbnRpbnVlcyB0byBmbG93IHRvIGF0IGxlYXN0IG9uZSBjZWxsIGZvciB0aGUgYXBwbGljYXRpb24uIFRoaXMgZW5zdXJlcyB0aGF0IHlvdSBhdm9pZCBhIGZhaWwtb3BlbiBzY2VuYXJpby5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtc2FmZXR5cnVsZS1hc3NlcnRpb25ydWxlLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIEFzc2VydGlvblJ1bGVQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcm91dGluZyBjb250cm9scyB0aGF0IGFyZSBwYXJ0IG9mIHRyYW5zYWN0aW9ucyB0aGF0IGFyZSBldmFsdWF0ZWQgdG8gZGV0ZXJtaW5lIGlmIGEgcmVxdWVzdCB0byBjaGFuZ2UgYSByb3V0aW5nIGNvbnRyb2wgc3RhdGUgaXMgYWxsb3dlZC4gRm9yIGV4YW1wbGUsIHlvdSBtaWdodCBpbmNsdWRlIHRocmVlIHJvdXRpbmcgY29udHJvbHMsIG9uZSBmb3IgZWFjaCBvZiB0aHJlZSBBV1MgUmVnaW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXNhZmV0eXJ1bGUtYXNzZXJ0aW9ucnVsZS5odG1sI2Nmbi1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXNhZmV0eXJ1bGUtYXNzZXJ0aW9ucnVsZS1hc3NlcnRlZGNvbnRyb2xzXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBhc3NlcnRlZENvbnRyb2xzOiBzdHJpbmdbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGV2YWx1YXRpb24gcGVyaW9kLCBpbiBtaWxsaXNlY29uZHMgKG1zKSwgZHVyaW5nIHdoaWNoIGFueSByZXF1ZXN0IGFnYWluc3QgdGhlIHRhcmdldCByb3V0aW5nIGNvbnRyb2xzIHdpbGwgZmFpbC4gVGhpcyBoZWxwcyBwcmV2ZW50IFwiZmxhcHBpbmdcIiBvZiBzdGF0ZS4gVGhlIHdhaXQgcGVyaW9kIGlzIDUwMDAgbXMgYnkgZGVmYXVsdCwgYnV0IHlvdSBjYW4gY2hvb3NlIGEgY3VzdG9tIHZhbHVlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtc2FmZXR5cnVsZS1hc3NlcnRpb25ydWxlLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtc2FmZXR5cnVsZS1hc3NlcnRpb25ydWxlLXdhaXRwZXJpb2Rtc1xuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgd2FpdFBlcmlvZE1zOiBudW1iZXI7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEFzc2VydGlvblJ1bGVQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQXNzZXJ0aW9uUnVsZVByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblNhZmV0eVJ1bGVfQXNzZXJ0aW9uUnVsZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXNzZXJ0ZWRDb250cm9scycsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5hc3NlcnRlZENvbnRyb2xzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhc3NlcnRlZENvbnRyb2xzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5hc3NlcnRlZENvbnRyb2xzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd3YWl0UGVyaW9kTXMnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMud2FpdFBlcmlvZE1zKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd3YWl0UGVyaW9kTXMnLCBjZGsudmFsaWRhdGVOdW1iZXIpKHByb3BlcnRpZXMud2FpdFBlcmlvZE1zKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkFzc2VydGlvblJ1bGVQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6Um91dGU1M1JlY292ZXJ5Q29udHJvbDo6U2FmZXR5UnVsZS5Bc3NlcnRpb25SdWxlYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBBc3NlcnRpb25SdWxlUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OlNhZmV0eVJ1bGUuQXNzZXJ0aW9uUnVsZWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5TYWZldHlSdWxlQXNzZXJ0aW9uUnVsZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5TYWZldHlSdWxlX0Fzc2VydGlvblJ1bGVQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgQXNzZXJ0ZWRDb250cm9sczogY2RrLmxpc3RNYXBwZXIoY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuYXNzZXJ0ZWRDb250cm9scyksXG4gICAgICAgIFdhaXRQZXJpb2RNczogY2RrLm51bWJlclRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy53YWl0UGVyaW9kTXMpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5TYWZldHlSdWxlQXNzZXJ0aW9uUnVsZVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuU2FmZXR5UnVsZS5Bc3NlcnRpb25SdWxlUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuU2FmZXR5UnVsZS5Bc3NlcnRpb25SdWxlUHJvcGVydHk+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdhc3NlcnRlZENvbnRyb2xzJywgJ0Fzc2VydGVkQ29udHJvbHMnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZ0FycmF5KHByb3BlcnRpZXMuQXNzZXJ0ZWRDb250cm9scykpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnd2FpdFBlcmlvZE1zJywgJ1dhaXRQZXJpb2RNcycsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0TnVtYmVyKHByb3BlcnRpZXMuV2FpdFBlcmlvZE1zKSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuU2FmZXR5UnVsZSB7XG4gICAgLyoqXG4gICAgICogQSBnYXRpbmcgcnVsZSB2ZXJpZmllcyB0aGF0IGEgZ2F0aW5nIHJvdXRpbmcgY29udHJvbCBvciBzZXQgb2YgZ2F0aW5nIHJvdXRpbmcgY29udHJvbHMsIGV2YWx1YXRlcyBhcyB0cnVlLCBiYXNlZCBvbiBhIHJ1bGUgY29uZmlndXJhdGlvbiB0aGF0IHlvdSBzcGVjaWZ5LCB3aGljaCBhbGxvd3MgYSBzZXQgb2Ygcm91dGluZyBjb250cm9sIHN0YXRlIGNoYW5nZXMgdG8gY29tcGxldGUuXG4gICAgICpcbiAgICAgKiBGb3IgZXhhbXBsZSwgaWYgeW91IHNwZWNpZnkgb25lIGdhdGluZyByb3V0aW5nIGNvbnRyb2wgYW5kIHlvdSBzZXQgdGhlIGBUeXBlYCBpbiB0aGUgcnVsZSBjb25maWd1cmF0aW9uIHRvIGBPUmAgLCB0aGF0IGluZGljYXRlcyB0aGF0IHlvdSBtdXN0IHNldCB0aGUgZ2F0aW5nIHJvdXRpbmcgY29udHJvbCB0byBgT25gIGZvciB0aGUgcnVsZSB0byBldmFsdWF0ZSBhcyB0cnVlOyB0aGF0IGlzLCBmb3IgdGhlIGdhdGluZyBjb250cm9sIFwic3dpdGNoXCIgdG8gYmUgXCJPblwiLiBXaGVuIHlvdSBkbyB0aGF0LCB0aGVuIHlvdSBjYW4gdXBkYXRlIHRoZSByb3V0aW5nIGNvbnRyb2wgc3RhdGVzIGZvciB0aGUgdGFyZ2V0IHJvdXRpbmcgY29udHJvbHMgdGhhdCB5b3Ugc3BlY2lmeSBpbiB0aGUgZ2F0aW5nIHJ1bGUuXG4gICAgICpcbiAgICAgKiBAc3RydWN0XG4gICAgICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXNhZmV0eXJ1bGUtZ2F0aW5ncnVsZS5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBHYXRpbmdSdWxlUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQW4gYXJyYXkgb2YgZ2F0aW5nIHJvdXRpbmcgY29udHJvbCBBbWF6b24gUmVzb3VyY2UgTmFtZXMgKEFSTnMpLiBGb3IgYSBzaW1wbGUgXCJvbi9vZmZcIiBzd2l0Y2gsIHNwZWNpZnkgdGhlIEFSTiBmb3Igb25lIHJvdXRpbmcgY29udHJvbC4gVGhlIGdhdGluZyByb3V0aW5nIGNvbnRyb2xzIGFyZSBldmFsdWF0ZWQgYnkgdGhlIHJ1bGUgY29uZmlndXJhdGlvbiB0aGF0IHlvdSBzcGVjaWZ5IHRvIGRldGVybWluZSBpZiB0aGUgdGFyZ2V0IHJvdXRpbmcgY29udHJvbCBzdGF0ZXMgY2FuIGJlIGNoYW5nZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLWdhdGluZ3J1bGUuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLWdhdGluZ3J1bGUtZ2F0aW5nY29udHJvbHNcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGdhdGluZ0NvbnRyb2xzOiBzdHJpbmdbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGFycmF5IG9mIHRhcmdldCByb3V0aW5nIGNvbnRyb2wgQW1hem9uIFJlc291cmNlIE5hbWVzIChBUk5zKSBmb3Igd2hpY2ggdGhlIHN0YXRlcyBjYW4gb25seSBiZSB1cGRhdGVkIGlmIHRoZSBydWxlIGNvbmZpZ3VyYXRpb24gdGhhdCB5b3Ugc3BlY2lmeSBldmFsdWF0ZXMgdG8gdHJ1ZSBmb3IgdGhlIGdhdGluZyByb3V0aW5nIGNvbnRyb2wuIEFzIGEgc2ltcGxlIGV4YW1wbGUsIGlmIHlvdSBoYXZlIGEgc2luZ2xlIGdhdGluZyBjb250cm9sLCBpdCBhY3RzIGFzIGFuIG92ZXJhbGwgXCJvbi9vZmZcIiBzd2l0Y2ggZm9yIGEgc2V0IG9mIHRhcmdldCByb3V0aW5nIGNvbnRyb2xzLiBZb3UgY2FuIHVzZSB0aGlzIHRvIG1hbnVhbGx5IG92ZXJyaWRlIGF1dG9tYXRlZCBmYWlsb3ZlciwgZm9yIGV4YW1wbGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLWdhdGluZ3J1bGUuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLWdhdGluZ3J1bGUtdGFyZ2V0Y29udHJvbHNcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHRhcmdldENvbnRyb2xzOiBzdHJpbmdbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGV2YWx1YXRpb24gcGVyaW9kLCBpbiBtaWxsaXNlY29uZHMgKG1zKSwgZHVyaW5nIHdoaWNoIGFueSByZXF1ZXN0IGFnYWluc3QgdGhlIHRhcmdldCByb3V0aW5nIGNvbnRyb2xzIHdpbGwgZmFpbC4gVGhpcyBoZWxwcyBwcmV2ZW50IFwiZmxhcHBpbmdcIiBvZiBzdGF0ZS4gVGhlIHdhaXQgcGVyaW9kIGlzIDUwMDAgbXMgYnkgZGVmYXVsdCwgYnV0IHlvdSBjYW4gY2hvb3NlIGEgY3VzdG9tIHZhbHVlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtc2FmZXR5cnVsZS1nYXRpbmdydWxlLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeWNvbnRyb2wtc2FmZXR5cnVsZS1nYXRpbmdydWxlLXdhaXRwZXJpb2Rtc1xuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgd2FpdFBlcmlvZE1zOiBudW1iZXI7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEdhdGluZ1J1bGVQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgR2F0aW5nUnVsZVByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblNhZmV0eVJ1bGVfR2F0aW5nUnVsZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZ2F0aW5nQ29udHJvbHMnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuZ2F0aW5nQ29udHJvbHMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2dhdGluZ0NvbnRyb2xzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5nYXRpbmdDb250cm9scykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGFyZ2V0Q29udHJvbHMnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMudGFyZ2V0Q29udHJvbHMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhcmdldENvbnRyb2xzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy50YXJnZXRDb250cm9scykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignd2FpdFBlcmlvZE1zJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLndhaXRQZXJpb2RNcykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignd2FpdFBlcmlvZE1zJywgY2RrLnZhbGlkYXRlTnVtYmVyKShwcm9wZXJ0aWVzLndhaXRQZXJpb2RNcykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJHYXRpbmdSdWxlUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OlNhZmV0eVJ1bGUuR2F0aW5nUnVsZWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgR2F0aW5nUnVsZVByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpSb3V0ZTUzUmVjb3ZlcnlDb250cm9sOjpTYWZldHlSdWxlLkdhdGluZ1J1bGVgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuU2FmZXR5UnVsZUdhdGluZ1J1bGVQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuU2FmZXR5UnVsZV9HYXRpbmdSdWxlUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIEdhdGluZ0NvbnRyb2xzOiBjZGsubGlzdE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5nYXRpbmdDb250cm9scyksXG4gICAgICAgIFRhcmdldENvbnRyb2xzOiBjZGsubGlzdE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy50YXJnZXRDb250cm9scyksXG4gICAgICAgIFdhaXRQZXJpb2RNczogY2RrLm51bWJlclRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy53YWl0UGVyaW9kTXMpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5TYWZldHlSdWxlR2F0aW5nUnVsZVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuU2FmZXR5UnVsZS5HYXRpbmdSdWxlUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuU2FmZXR5UnVsZS5HYXRpbmdSdWxlUHJvcGVydHk+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdnYXRpbmdDb250cm9scycsICdHYXRpbmdDb250cm9scycsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nQXJyYXkocHJvcGVydGllcy5HYXRpbmdDb250cm9scykpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndGFyZ2V0Q29udHJvbHMnLCAnVGFyZ2V0Q29udHJvbHMnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZ0FycmF5KHByb3BlcnRpZXMuVGFyZ2V0Q29udHJvbHMpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3dhaXRQZXJpb2RNcycsICdXYWl0UGVyaW9kTXMnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldE51bWJlcihwcm9wZXJ0aWVzLldhaXRQZXJpb2RNcykpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmblNhZmV0eVJ1bGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBydWxlIGNvbmZpZ3VyYXRpb24gZm9yIGFuIGFzc2VydGlvbiBydWxlLiBUaGF0IGlzLCB0aGUgY3JpdGVyaWEgdGhhdCB5b3Ugc2V0IGZvciBzcGVjaWZpYyBhc3NlcnRpb24gY29udHJvbHMgKHJvdXRpbmcgY29udHJvbHMpIHRoYXQgc3BlY2lmeSBob3cgbWFueSBjb250cm9sIHN0YXRlcyBtdXN0IGJlIGBPTmAgYWZ0ZXIgYSB0cmFuc2FjdGlvbiBjb21wbGV0ZXMuXG4gICAgICpcbiAgICAgKiBAc3RydWN0XG4gICAgICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yb3V0ZTUzcmVjb3Zlcnljb250cm9sLXNhZmV0eXJ1bGUtcnVsZWNvbmZpZy5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBSdWxlQ29uZmlnUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogTG9naWNhbCBuZWdhdGlvbiBvZiB0aGUgcnVsZS4gSWYgdGhlIHJ1bGUgd291bGQgdXN1YWxseSBldmFsdWF0ZSB0cnVlLCBpdCdzIGV2YWx1YXRlZCBhcyBmYWxzZSwgYW5kIHZpY2UgdmVyc2EuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLXJ1bGVjb25maWcuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLXJ1bGVjb25maWctaW52ZXJ0ZWRcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGludmVydGVkOiBib29sZWFuIHwgY2RrLklSZXNvbHZhYmxlO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHZhbHVlIG9mIE4sIHdoZW4geW91IHNwZWNpZnkgYW4gYEFUTEVBU1RgIHJ1bGUgdHlwZS4gVGhhdCBpcywgYFRocmVzaG9sZGAgaXMgdGhlIG51bWJlciBvZiBjb250cm9scyB0aGF0IG11c3QgYmUgc2V0IHdoZW4geW91IHNwZWNpZnkgYW4gYEFUTEVBU1RgIHR5cGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLXJ1bGVjb25maWcuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLXJ1bGVjb25maWctdGhyZXNob2xkXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSB0aHJlc2hvbGQ6IG51bWJlcjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgcnVsZSBjYW4gYmUgb25lIG9mIHRoZSBmb2xsb3dpbmc6IGBBVExFQVNUYCAsIGBBTkRgICwgb3IgYE9SYCAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLXJ1bGVjb25maWcuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5Y29udHJvbC1zYWZldHlydWxlLXJ1bGVjb25maWctdHlwZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBSdWxlQ29uZmlnUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFJ1bGVDb25maWdQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5TYWZldHlSdWxlX1J1bGVDb25maWdQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2ludmVydGVkJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmludmVydGVkKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdpbnZlcnRlZCcsIGNkay52YWxpZGF0ZUJvb2xlYW4pKHByb3BlcnRpZXMuaW52ZXJ0ZWQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RocmVzaG9sZCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy50aHJlc2hvbGQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RocmVzaG9sZCcsIGNkay52YWxpZGF0ZU51bWJlcikocHJvcGVydGllcy50aHJlc2hvbGQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3R5cGUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMudHlwZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50eXBlKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlJ1bGVDb25maWdQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6Um91dGU1M1JlY292ZXJ5Q29udHJvbDo6U2FmZXR5UnVsZS5SdWxlQ29uZmlnYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBSdWxlQ29uZmlnUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeUNvbnRyb2w6OlNhZmV0eVJ1bGUuUnVsZUNvbmZpZ2AgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5TYWZldHlSdWxlUnVsZUNvbmZpZ1Byb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5TYWZldHlSdWxlX1J1bGVDb25maWdQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgSW52ZXJ0ZWQ6IGNkay5ib29sZWFuVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmludmVydGVkKSxcbiAgICAgICAgVGhyZXNob2xkOiBjZGsubnVtYmVyVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnRocmVzaG9sZCksXG4gICAgICAgIFR5cGU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudHlwZSksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblNhZmV0eVJ1bGVSdWxlQ29uZmlnUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5TYWZldHlSdWxlLlJ1bGVDb25maWdQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5TYWZldHlSdWxlLlJ1bGVDb25maWdQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2ludmVydGVkJywgJ0ludmVydGVkJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRCb29sZWFuKHByb3BlcnRpZXMuSW52ZXJ0ZWQpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3RocmVzaG9sZCcsICdUaHJlc2hvbGQnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldE51bWJlcihwcm9wZXJ0aWVzLlRocmVzaG9sZCkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndHlwZScsICdUeXBlJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5UeXBlKSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG4iXX0=