"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnResourceSet = exports.CfnRecoveryGroup = exports.CfnReadinessCheck = exports.CfnCell = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cfn_parse = require("@aws-cdk/core/lib/helpers-internal");
/**
 * Determine whether the given properties match those of a `CfnCellProps`
 *
 * @param properties - the TypeScript properties of a `CfnCellProps`
 *
 * @returns the result of the validation.
 */
function CfnCellPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cellName', cdk.validateString)(properties.cellName));
    errors.collect(cdk.propertyValidator('cells', cdk.listValidator(cdk.validateString))(properties.cells));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnCellProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::Cell` resource
 *
 * @param properties - the TypeScript properties of a `CfnCellProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::Cell` resource.
 */
// @ts-ignore TS6133
function cfnCellPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnCellPropsValidator(properties).assertSuccess();
    return {
        CellName: cdk.stringToCloudFormation(properties.cellName),
        Cells: cdk.listMapper(cdk.stringToCloudFormation)(properties.cells),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnCellPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('cellName', 'CellName', properties.CellName != null ? cfn_parse.FromCloudFormation.getString(properties.CellName) : undefined);
    ret.addPropertyResult('cells', 'Cells', properties.Cells != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Cells) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::Route53RecoveryReadiness::Cell`
 *
 * Creates a cell in an account.
 *
 * @cloudformationResource AWS::Route53RecoveryReadiness::Cell
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-cell.html
 */
class CfnCell extends cdk.CfnResource {
    /**
     * Create a new `AWS::Route53RecoveryReadiness::Cell`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props = {}) {
        super(scope, id, { type: CfnCell.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53recoveryreadiness_CfnCellProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnCell);
            }
            throw error;
        }
        this.attrCellArn = cdk.Token.asString(this.getAtt('CellArn', cdk.ResolutionTypeHint.STRING));
        this.attrParentReadinessScopes = cdk.Token.asList(this.getAtt('ParentReadinessScopes', cdk.ResolutionTypeHint.STRING_LIST));
        this.cellName = props.cellName;
        this.cells = props.cells;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryReadiness::Cell", props.tags, { tagPropertyName: 'tags' });
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
        const propsResult = CfnCellPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCell(scope, id, propsResult.value);
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCell.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            cellName: this.cellName,
            cells: this.cells,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        return cfnCellPropsToCloudFormation(props);
    }
}
exports.CfnCell = CfnCell;
_a = JSII_RTTI_SYMBOL_1;
CfnCell[_a] = { fqn: "@aws-cdk/aws-route53recoveryreadiness.CfnCell", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnCell.CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryReadiness::Cell";
/**
 * Determine whether the given properties match those of a `CfnReadinessCheckProps`
 *
 * @param properties - the TypeScript properties of a `CfnReadinessCheckProps`
 *
 * @returns the result of the validation.
 */
function CfnReadinessCheckPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('readinessCheckName', cdk.validateString)(properties.readinessCheckName));
    errors.collect(cdk.propertyValidator('resourceSetName', cdk.validateString)(properties.resourceSetName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnReadinessCheckProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ReadinessCheck` resource
 *
 * @param properties - the TypeScript properties of a `CfnReadinessCheckProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ReadinessCheck` resource.
 */
// @ts-ignore TS6133
function cfnReadinessCheckPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnReadinessCheckPropsValidator(properties).assertSuccess();
    return {
        ReadinessCheckName: cdk.stringToCloudFormation(properties.readinessCheckName),
        ResourceSetName: cdk.stringToCloudFormation(properties.resourceSetName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnReadinessCheckPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('readinessCheckName', 'ReadinessCheckName', properties.ReadinessCheckName != null ? cfn_parse.FromCloudFormation.getString(properties.ReadinessCheckName) : undefined);
    ret.addPropertyResult('resourceSetName', 'ResourceSetName', properties.ResourceSetName != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceSetName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::Route53RecoveryReadiness::ReadinessCheck`
 *
 * Creates a readiness check in an account. A readiness check monitors a resource set in your application, such as a set of Amazon Aurora instances, that Application Recovery Controller is auditing recovery readiness for. The audits run once every minute on every resource that's associated with a readiness check.
 *
 * @cloudformationResource AWS::Route53RecoveryReadiness::ReadinessCheck
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-readinesscheck.html
 */
class CfnReadinessCheck extends cdk.CfnResource {
    /**
     * Create a new `AWS::Route53RecoveryReadiness::ReadinessCheck`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props = {}) {
        super(scope, id, { type: CfnReadinessCheck.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53recoveryreadiness_CfnReadinessCheckProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnReadinessCheck);
            }
            throw error;
        }
        this.attrReadinessCheckArn = cdk.Token.asString(this.getAtt('ReadinessCheckArn', cdk.ResolutionTypeHint.STRING));
        this.readinessCheckName = props.readinessCheckName;
        this.resourceSetName = props.resourceSetName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryReadiness::ReadinessCheck", props.tags, { tagPropertyName: 'tags' });
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
        const propsResult = CfnReadinessCheckPropsFromCloudFormation(resourceProperties);
        const ret = new CfnReadinessCheck(scope, id, propsResult.value);
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnReadinessCheck.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            readinessCheckName: this.readinessCheckName,
            resourceSetName: this.resourceSetName,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        return cfnReadinessCheckPropsToCloudFormation(props);
    }
}
exports.CfnReadinessCheck = CfnReadinessCheck;
_b = JSII_RTTI_SYMBOL_1;
CfnReadinessCheck[_b] = { fqn: "@aws-cdk/aws-route53recoveryreadiness.CfnReadinessCheck", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnReadinessCheck.CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryReadiness::ReadinessCheck";
/**
 * Determine whether the given properties match those of a `CfnRecoveryGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnRecoveryGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnRecoveryGroupPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cells', cdk.listValidator(cdk.validateString))(properties.cells));
    errors.collect(cdk.propertyValidator('recoveryGroupName', cdk.validateString)(properties.recoveryGroupName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnRecoveryGroupProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::RecoveryGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnRecoveryGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::RecoveryGroup` resource.
 */
// @ts-ignore TS6133
function cfnRecoveryGroupPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnRecoveryGroupPropsValidator(properties).assertSuccess();
    return {
        Cells: cdk.listMapper(cdk.stringToCloudFormation)(properties.cells),
        RecoveryGroupName: cdk.stringToCloudFormation(properties.recoveryGroupName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnRecoveryGroupPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('cells', 'Cells', properties.Cells != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Cells) : undefined);
    ret.addPropertyResult('recoveryGroupName', 'RecoveryGroupName', properties.RecoveryGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.RecoveryGroupName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::Route53RecoveryReadiness::RecoveryGroup`
 *
 * Creates a recovery group in an account. A recovery group corresponds to an application and includes a list of the cells that make up the application.
 *
 * @cloudformationResource AWS::Route53RecoveryReadiness::RecoveryGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-recoverygroup.html
 */
class CfnRecoveryGroup extends cdk.CfnResource {
    /**
     * Create a new `AWS::Route53RecoveryReadiness::RecoveryGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props = {}) {
        super(scope, id, { type: CfnRecoveryGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53recoveryreadiness_CfnRecoveryGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnRecoveryGroup);
            }
            throw error;
        }
        this.attrRecoveryGroupArn = cdk.Token.asString(this.getAtt('RecoveryGroupArn', cdk.ResolutionTypeHint.STRING));
        this.cells = props.cells;
        this.recoveryGroupName = props.recoveryGroupName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryReadiness::RecoveryGroup", props.tags, { tagPropertyName: 'tags' });
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
        const propsResult = CfnRecoveryGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnRecoveryGroup(scope, id, propsResult.value);
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRecoveryGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            cells: this.cells,
            recoveryGroupName: this.recoveryGroupName,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        return cfnRecoveryGroupPropsToCloudFormation(props);
    }
}
exports.CfnRecoveryGroup = CfnRecoveryGroup;
_c = JSII_RTTI_SYMBOL_1;
CfnRecoveryGroup[_c] = { fqn: "@aws-cdk/aws-route53recoveryreadiness.CfnRecoveryGroup", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnRecoveryGroup.CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryReadiness::RecoveryGroup";
/**
 * Determine whether the given properties match those of a `CfnResourceSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceSetProps`
 *
 * @returns the result of the validation.
 */
function CfnResourceSetPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceSetName', cdk.validateString)(properties.resourceSetName));
    errors.collect(cdk.propertyValidator('resourceSetType', cdk.requiredValidator)(properties.resourceSetType));
    errors.collect(cdk.propertyValidator('resourceSetType', cdk.validateString)(properties.resourceSetType));
    errors.collect(cdk.propertyValidator('resources', cdk.requiredValidator)(properties.resources));
    errors.collect(cdk.propertyValidator('resources', cdk.listValidator(CfnResourceSet_ResourcePropertyValidator))(properties.resources));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnResourceSetProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnResourceSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet` resource.
 */
// @ts-ignore TS6133
function cfnResourceSetPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnResourceSetPropsValidator(properties).assertSuccess();
    return {
        Resources: cdk.listMapper(cfnResourceSetResourcePropertyToCloudFormation)(properties.resources),
        ResourceSetType: cdk.stringToCloudFormation(properties.resourceSetType),
        ResourceSetName: cdk.stringToCloudFormation(properties.resourceSetName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnResourceSetPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('resources', 'Resources', cfn_parse.FromCloudFormation.getArray(CfnResourceSetResourcePropertyFromCloudFormation)(properties.Resources));
    ret.addPropertyResult('resourceSetType', 'ResourceSetType', cfn_parse.FromCloudFormation.getString(properties.ResourceSetType));
    ret.addPropertyResult('resourceSetName', 'ResourceSetName', properties.ResourceSetName != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceSetName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::Route53RecoveryReadiness::ResourceSet`
 *
 * Creates a resource set. A resource set is a set of resources of one type that span multiple cells. You can associate a resource set with a readiness check to monitor the resources for failover readiness.
 *
 * @cloudformationResource AWS::Route53RecoveryReadiness::ResourceSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html
 */
class CfnResourceSet extends cdk.CfnResource {
    /**
     * Create a new `AWS::Route53RecoveryReadiness::ResourceSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnResourceSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_route53recoveryreadiness_CfnResourceSetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnResourceSet);
            }
            throw error;
        }
        cdk.requireProperty(props, 'resourceSetType', this);
        cdk.requireProperty(props, 'resources', this);
        this.attrResourceSetArn = cdk.Token.asString(this.getAtt('ResourceSetArn', cdk.ResolutionTypeHint.STRING));
        this.resources = props.resources;
        this.resourceSetType = props.resourceSetType;
        this.resourceSetName = props.resourceSetName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryReadiness::ResourceSet", props.tags, { tagPropertyName: 'tags' });
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
        const propsResult = CfnResourceSetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnResourceSet(scope, id, propsResult.value);
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            resources: this.resources,
            resourceSetType: this.resourceSetType,
            resourceSetName: this.resourceSetName,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        return cfnResourceSetPropsToCloudFormation(props);
    }
}
exports.CfnResourceSet = CfnResourceSet;
_d = JSII_RTTI_SYMBOL_1;
CfnResourceSet[_d] = { fqn: "@aws-cdk/aws-route53recoveryreadiness.CfnResourceSet", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnResourceSet.CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryReadiness::ResourceSet";
/**
 * Determine whether the given properties match those of a `DNSTargetResourceProperty`
 *
 * @param properties - the TypeScript properties of a `DNSTargetResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceSet_DNSTargetResourcePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('hostedZoneArn', cdk.validateString)(properties.hostedZoneArn));
    errors.collect(cdk.propertyValidator('recordSetId', cdk.validateString)(properties.recordSetId));
    errors.collect(cdk.propertyValidator('recordType', cdk.validateString)(properties.recordType));
    errors.collect(cdk.propertyValidator('targetResource', CfnResourceSet_TargetResourcePropertyValidator)(properties.targetResource));
    return errors.wrap('supplied properties not correct for "DNSTargetResourceProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.DNSTargetResource` resource
 *
 * @param properties - the TypeScript properties of a `DNSTargetResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.DNSTargetResource` resource.
 */
// @ts-ignore TS6133
function cfnResourceSetDNSTargetResourcePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnResourceSet_DNSTargetResourcePropertyValidator(properties).assertSuccess();
    return {
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        HostedZoneArn: cdk.stringToCloudFormation(properties.hostedZoneArn),
        RecordSetId: cdk.stringToCloudFormation(properties.recordSetId),
        RecordType: cdk.stringToCloudFormation(properties.recordType),
        TargetResource: cfnResourceSetTargetResourcePropertyToCloudFormation(properties.targetResource),
    };
}
// @ts-ignore TS6133
function CfnResourceSetDNSTargetResourcePropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('domainName', 'DomainName', properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined);
    ret.addPropertyResult('hostedZoneArn', 'HostedZoneArn', properties.HostedZoneArn != null ? cfn_parse.FromCloudFormation.getString(properties.HostedZoneArn) : undefined);
    ret.addPropertyResult('recordSetId', 'RecordSetId', properties.RecordSetId != null ? cfn_parse.FromCloudFormation.getString(properties.RecordSetId) : undefined);
    ret.addPropertyResult('recordType', 'RecordType', properties.RecordType != null ? cfn_parse.FromCloudFormation.getString(properties.RecordType) : undefined);
    ret.addPropertyResult('targetResource', 'TargetResource', properties.TargetResource != null ? CfnResourceSetTargetResourcePropertyFromCloudFormation(properties.TargetResource) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `NLBResourceProperty`
 *
 * @param properties - the TypeScript properties of a `NLBResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceSet_NLBResourcePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    return errors.wrap('supplied properties not correct for "NLBResourceProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.NLBResource` resource
 *
 * @param properties - the TypeScript properties of a `NLBResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.NLBResource` resource.
 */
// @ts-ignore TS6133
function cfnResourceSetNLBResourcePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnResourceSet_NLBResourcePropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
    };
}
// @ts-ignore TS6133
function CfnResourceSetNLBResourcePropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `R53ResourceRecordProperty`
 *
 * @param properties - the TypeScript properties of a `R53ResourceRecordProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceSet_R53ResourceRecordPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('recordSetId', cdk.validateString)(properties.recordSetId));
    return errors.wrap('supplied properties not correct for "R53ResourceRecordProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.R53ResourceRecord` resource
 *
 * @param properties - the TypeScript properties of a `R53ResourceRecordProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.R53ResourceRecord` resource.
 */
// @ts-ignore TS6133
function cfnResourceSetR53ResourceRecordPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnResourceSet_R53ResourceRecordPropertyValidator(properties).assertSuccess();
    return {
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        RecordSetId: cdk.stringToCloudFormation(properties.recordSetId),
    };
}
// @ts-ignore TS6133
function CfnResourceSetR53ResourceRecordPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('domainName', 'DomainName', properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined);
    ret.addPropertyResult('recordSetId', 'RecordSetId', properties.RecordSetId != null ? cfn_parse.FromCloudFormation.getString(properties.RecordSetId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `ResourceProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceSet_ResourcePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('componentId', cdk.validateString)(properties.componentId));
    errors.collect(cdk.propertyValidator('dnsTargetResource', CfnResourceSet_DNSTargetResourcePropertyValidator)(properties.dnsTargetResource));
    errors.collect(cdk.propertyValidator('readinessScopes', cdk.listValidator(cdk.validateString))(properties.readinessScopes));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    return errors.wrap('supplied properties not correct for "ResourceProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.Resource` resource
 *
 * @param properties - the TypeScript properties of a `ResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.Resource` resource.
 */
// @ts-ignore TS6133
function cfnResourceSetResourcePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnResourceSet_ResourcePropertyValidator(properties).assertSuccess();
    return {
        ComponentId: cdk.stringToCloudFormation(properties.componentId),
        DnsTargetResource: cfnResourceSetDNSTargetResourcePropertyToCloudFormation(properties.dnsTargetResource),
        ReadinessScopes: cdk.listMapper(cdk.stringToCloudFormation)(properties.readinessScopes),
        ResourceArn: cdk.stringToCloudFormation(properties.resourceArn),
    };
}
// @ts-ignore TS6133
function CfnResourceSetResourcePropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('componentId', 'ComponentId', properties.ComponentId != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentId) : undefined);
    ret.addPropertyResult('dnsTargetResource', 'DnsTargetResource', properties.DnsTargetResource != null ? CfnResourceSetDNSTargetResourcePropertyFromCloudFormation(properties.DnsTargetResource) : undefined);
    ret.addPropertyResult('readinessScopes', 'ReadinessScopes', properties.ReadinessScopes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ReadinessScopes) : undefined);
    ret.addPropertyResult('resourceArn', 'ResourceArn', properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `TargetResourceProperty`
 *
 * @param properties - the TypeScript properties of a `TargetResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceSet_TargetResourcePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('nlbResource', CfnResourceSet_NLBResourcePropertyValidator)(properties.nlbResource));
    errors.collect(cdk.propertyValidator('r53Resource', CfnResourceSet_R53ResourceRecordPropertyValidator)(properties.r53Resource));
    return errors.wrap('supplied properties not correct for "TargetResourceProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.TargetResource` resource
 *
 * @param properties - the TypeScript properties of a `TargetResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.TargetResource` resource.
 */
// @ts-ignore TS6133
function cfnResourceSetTargetResourcePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnResourceSet_TargetResourcePropertyValidator(properties).assertSuccess();
    return {
        NLBResource: cfnResourceSetNLBResourcePropertyToCloudFormation(properties.nlbResource),
        R53Resource: cfnResourceSetR53ResourceRecordPropertyToCloudFormation(properties.r53Resource),
    };
}
// @ts-ignore TS6133
function CfnResourceSetTargetResourcePropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('nlbResource', 'NLBResource', properties.NLBResource != null ? CfnResourceSetNLBResourcePropertyFromCloudFormation(properties.NLBResource) : undefined);
    ret.addPropertyResult('r53Resource', 'R53Resource', properties.R53Resource != null ? CfnResourceSetR53ResourceRecordPropertyFromCloudFormation(properties.R53Resource) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBUUEscUNBQXFDO0FBQ3JDLGdFQUFnRTtBQWtDaEU7Ozs7OztHQU1HO0FBQ0gsU0FBUyxxQkFBcUIsQ0FBQyxVQUFlO0lBQzFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUM7S0FBRTtJQUNuRSxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNDLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0c7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzNGLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3hHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FB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QXNELENBQUMsVUFBZTtJQUMzRSxJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNwQyxPQUFPLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsVUFBVSxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQ2xELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE9BQU8sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxnQ0FBZ0MsRUFBeUMsQ0FBQztJQUNwRyxHQUFHLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLGFBQWEsRUFBRSxVQUFVLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsbURBQW1ELENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5SyxHQUFHLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLGFBQWEsRUFBRSxVQUFVLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMseURBQXlELENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNwTCxHQUFHLENBQUMsZ0NBQWdDLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLy8gR2VuZXJhdGVkIGZyb20gdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBSZXNvdXJjZSBTcGVjaWZpY2F0aW9uXG4vLyBTZWU6IGRvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9jZm4tcmVzb3VyY2Utc3BlY2lmaWNhdGlvbi5odG1sXG4vLyBAY2ZuMnRzOm1ldGFAIHtcImdlbmVyYXRlZFwiOlwiMjAyMy0wMS0yMlQwOTo1NDowNC45NDRaXCIsXCJmaW5nZXJwcmludFwiOlwiUk1LbUlMWTFTc2RLdHpCMWExQ1JjMTNHTUlkby80N1hsbVJ2MktvMHdLOD1cIn1cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY2ZuX3BhcnNlIGZyb20gJ0Bhd3MtY2RrL2NvcmUvbGliL2hlbHBlcnMtaW50ZXJuYWwnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmbkNlbGxgXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1jZWxsLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5DZWxsUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGNlbGwgdG8gY3JlYXRlLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLWNlbGwuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLWNlbGwtY2VsbG5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBjZWxsTmFtZT86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEEgbGlzdCBvZiBjZWxsIEFtYXpvbiBSZXNvdXJjZSBOYW1lcyAoQVJOcykgY29udGFpbmVkIHdpdGhpbiB0aGlzIGNlbGwsIGZvciB1c2UgaW4gbmVzdGVkIGNlbGxzLiBGb3IgZXhhbXBsZSwgQXZhaWxhYmlsaXR5IFpvbmVzIHdpdGhpbiBzcGVjaWZpYyBBV1MgUmVnaW9ucyAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtY2VsbC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtY2VsbC1jZWxsc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IGNlbGxzPzogc3RyaW5nW107XG5cbiAgICAvKipcbiAgICAgKiBBIGNvbGxlY3Rpb24gb2YgdGFncyBhc3NvY2lhdGVkIHdpdGggYSByZXNvdXJjZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1jZWxsLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1jZWxsLXRhZ3NcbiAgICAgKi9cbiAgICByZWFkb25seSB0YWdzPzogY2RrLkNmblRhZ1tdO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkNlbGxQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuQ2VsbFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkNlbGxQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2NlbGxOYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmNlbGxOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjZWxscycsIGNkay5saXN0VmFsaWRhdG9yKGNkay52YWxpZGF0ZVN0cmluZykpKHByb3BlcnRpZXMuY2VsbHMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhZ3MnLCBjZGsubGlzdFZhbGlkYXRvcihjZGsudmFsaWRhdGVDZm5UYWcpKShwcm9wZXJ0aWVzLnRhZ3MpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuQ2VsbFByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpSb3V0ZTUzUmVjb3ZlcnlSZWFkaW5lc3M6OkNlbGxgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkNlbGxQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6Um91dGU1M1JlY292ZXJ5UmVhZGluZXNzOjpDZWxsYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkNlbGxQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQ2VsbFByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBDZWxsTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5jZWxsTmFtZSksXG4gICAgICAgIENlbGxzOiBjZGsubGlzdE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5jZWxscyksXG4gICAgICAgIFRhZ3M6IGNkay5saXN0TWFwcGVyKGNkay5jZm5UYWdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLnRhZ3MpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5DZWxsUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5DZWxsUHJvcHM+IHtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmbkNlbGxQcm9wcz4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2NlbGxOYW1lJywgJ0NlbGxOYW1lJywgcHJvcGVydGllcy5DZWxsTmFtZSAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5DZWxsTmFtZSkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnY2VsbHMnLCAnQ2VsbHMnLCBwcm9wZXJ0aWVzLkNlbGxzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZ0FycmF5KHByb3BlcnRpZXMuQ2VsbHMpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3RhZ3MnLCAnVGFncycsIHByb3BlcnRpZXMuVGFncyAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldENmblRhZykocHJvcGVydGllcy5UYWdzKSA6IHVuZGVmaW5lZCBhcyBhbnkpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6Um91dGU1M1JlY292ZXJ5UmVhZGluZXNzOjpDZWxsYFxuICpcbiAqIENyZWF0ZXMgYSBjZWxsIGluIGFuIGFjY291bnQuXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpSb3V0ZTUzUmVjb3ZlcnlSZWFkaW5lc3M6OkNlbGxcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtY2VsbC5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5DZWxsIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6Um91dGU1M1JlY292ZXJ5UmVhZGluZXNzOjpDZWxsXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuQ2VsbCB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuQ2VsbFByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHJlc291cmNlUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBDZm5DZWxsKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgY2VsbC5cbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgQ2VsbEFyblxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyQ2VsbEFybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJlYWRpbmVzcyBzY29wZSBmb3IgdGhlIGNlbGwsIHdoaWNoIGNhbiBiZSBhIGNlbGwgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb3IgYSByZWNvdmVyeSBncm91cCBBUk4uIFRoaXMgaXMgYSBsaXN0IGJ1dCBjdXJyZW50bHkgY2FuIGhhdmUgb25seSBvbmUgZWxlbWVudC5cbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgUGFyZW50UmVhZGluZXNzU2NvcGVzXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJQYXJlbnRSZWFkaW5lc3NTY29wZXM6IHN0cmluZ1tdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGNlbGwgdG8gY3JlYXRlLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLWNlbGwuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLWNlbGwtY2VsbG5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgY2VsbE5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIEEgbGlzdCBvZiBjZWxsIEFtYXpvbiBSZXNvdXJjZSBOYW1lcyAoQVJOcykgY29udGFpbmVkIHdpdGhpbiB0aGlzIGNlbGwsIGZvciB1c2UgaW4gbmVzdGVkIGNlbGxzLiBGb3IgZXhhbXBsZSwgQXZhaWxhYmlsaXR5IFpvbmVzIHdpdGhpbiBzcGVjaWZpYyBBV1MgUmVnaW9ucyAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtY2VsbC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtY2VsbC1jZWxsc1xuICAgICAqL1xuICAgIHB1YmxpYyBjZWxsczogc3RyaW5nW10gfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBBIGNvbGxlY3Rpb24gb2YgdGFncyBhc3NvY2lhdGVkIHdpdGggYSByZXNvdXJjZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1jZWxsLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1jZWxsLXRhZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGFnczogY2RrLlRhZ01hbmFnZXI7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6Um91dGU1M1JlY292ZXJ5UmVhZGluZXNzOjpDZWxsYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuQ2VsbFByb3BzID0ge30pIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbkNlbGwuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIHRoaXMuYXR0ckNlbGxBcm4gPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ0NlbGxBcm4nLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuICAgICAgICB0aGlzLmF0dHJQYXJlbnRSZWFkaW5lc3NTY29wZXMgPSBjZGsuVG9rZW4uYXNMaXN0KHRoaXMuZ2V0QXR0KCdQYXJlbnRSZWFkaW5lc3NTY29wZXMnLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklOR19MSVNUKSk7XG5cbiAgICAgICAgdGhpcy5jZWxsTmFtZSA9IHByb3BzLmNlbGxOYW1lO1xuICAgICAgICB0aGlzLmNlbGxzID0gcHJvcHMuY2VsbHM7XG4gICAgICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5TVEFOREFSRCwgXCJBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6Q2VsbFwiLCBwcm9wcy50YWdzLCB7IHRhZ1Byb3BlcnR5TmFtZTogJ3RhZ3MnIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuQ2VsbC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2VsbE5hbWU6IHRoaXMuY2VsbE5hbWUsXG4gICAgICAgICAgICBjZWxsczogdGhpcy5jZWxscyxcbiAgICAgICAgICAgIHRhZ3M6IHRoaXMudGFncy5yZW5kZXJUYWdzKCksXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuQ2VsbFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmblJlYWRpbmVzc0NoZWNrYFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVhZGluZXNzY2hlY2suaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblJlYWRpbmVzc0NoZWNrUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHJlYWRpbmVzcyBjaGVjayB0byBjcmVhdGUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVhZGluZXNzY2hlY2suaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlYWRpbmVzc2NoZWNrLXJlYWRpbmVzc2NoZWNrbmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IHJlYWRpbmVzc0NoZWNrTmFtZT86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSByZXNvdXJjZSBzZXQgdG8gY2hlY2suXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVhZGluZXNzY2hlY2suaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlYWRpbmVzc2NoZWNrLXJlc291cmNlc2V0bmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IHJlc291cmNlU2V0TmFtZT86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEEgY29sbGVjdGlvbiBvZiB0YWdzIGFzc29jaWF0ZWQgd2l0aCBhIHJlc291cmNlLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlYWRpbmVzc2NoZWNrLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZWFkaW5lc3NjaGVjay10YWdzXG4gICAgICovXG4gICAgcmVhZG9ubHkgdGFncz86IGNkay5DZm5UYWdbXTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5SZWFkaW5lc3NDaGVja1Byb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5SZWFkaW5lc3NDaGVja1Byb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblJlYWRpbmVzc0NoZWNrUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZWFkaW5lc3NDaGVja05hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucmVhZGluZXNzQ2hlY2tOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZXNvdXJjZVNldE5hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucmVzb3VyY2VTZXROYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0YWdzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlQ2ZuVGFnKSkocHJvcGVydGllcy50YWdzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmblJlYWRpbmVzc0NoZWNrUHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVhZGluZXNzQ2hlY2tgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblJlYWRpbmVzc0NoZWNrUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVhZGluZXNzQ2hlY2tgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUmVhZGluZXNzQ2hlY2tQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuUmVhZGluZXNzQ2hlY2tQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgUmVhZGluZXNzQ2hlY2tOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnJlYWRpbmVzc0NoZWNrTmFtZSksXG4gICAgICAgIFJlc291cmNlU2V0TmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yZXNvdXJjZVNldE5hbWUpLFxuICAgICAgICBUYWdzOiBjZGsubGlzdE1hcHBlcihjZGsuY2ZuVGFnVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy50YWdzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUmVhZGluZXNzQ2hlY2tQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblJlYWRpbmVzc0NoZWNrUHJvcHM+IHtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblJlYWRpbmVzc0NoZWNrUHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyZWFkaW5lc3NDaGVja05hbWUnLCAnUmVhZGluZXNzQ2hlY2tOYW1lJywgcHJvcGVydGllcy5SZWFkaW5lc3NDaGVja05hbWUgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUmVhZGluZXNzQ2hlY2tOYW1lKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyZXNvdXJjZVNldE5hbWUnLCAnUmVzb3VyY2VTZXROYW1lJywgcHJvcGVydGllcy5SZXNvdXJjZVNldE5hbWUgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUmVzb3VyY2VTZXROYW1lKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0YWdzJywgJ1RhZ3MnLCBwcm9wZXJ0aWVzLlRhZ3MgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRDZm5UYWcpKHByb3BlcnRpZXMuVGFncykgOiB1bmRlZmluZWQgYXMgYW55KTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVhZGluZXNzQ2hlY2tgXG4gKlxuICogQ3JlYXRlcyBhIHJlYWRpbmVzcyBjaGVjayBpbiBhbiBhY2NvdW50LiBBIHJlYWRpbmVzcyBjaGVjayBtb25pdG9ycyBhIHJlc291cmNlIHNldCBpbiB5b3VyIGFwcGxpY2F0aW9uLCBzdWNoIGFzIGEgc2V0IG9mIEFtYXpvbiBBdXJvcmEgaW5zdGFuY2VzLCB0aGF0IEFwcGxpY2F0aW9uIFJlY292ZXJ5IENvbnRyb2xsZXIgaXMgYXVkaXRpbmcgcmVjb3ZlcnkgcmVhZGluZXNzIGZvci4gVGhlIGF1ZGl0cyBydW4gb25jZSBldmVyeSBtaW51dGUgb24gZXZlcnkgcmVzb3VyY2UgdGhhdCdzIGFzc29jaWF0ZWQgd2l0aCBhIHJlYWRpbmVzcyBjaGVjay5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVhZGluZXNzQ2hlY2tcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVhZGluZXNzY2hlY2suaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuUmVhZGluZXNzQ2hlY2sgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpSb3V0ZTUzUmVjb3ZlcnlSZWFkaW5lc3M6OlJlYWRpbmVzc0NoZWNrXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuUmVhZGluZXNzQ2hlY2sge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmblJlYWRpbmVzc0NoZWNrUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmblJlYWRpbmVzc0NoZWNrKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgcmVhZGluZXNzIGNoZWNrLlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBSZWFkaW5lc3NDaGVja0FyblxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyUmVhZGluZXNzQ2hlY2tBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSByZWFkaW5lc3MgY2hlY2sgdG8gY3JlYXRlLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlYWRpbmVzc2NoZWNrLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZWFkaW5lc3NjaGVjay1yZWFkaW5lc3NjaGVja25hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZGluZXNzQ2hlY2tOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgcmVzb3VyY2Ugc2V0IHRvIGNoZWNrLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlYWRpbmVzc2NoZWNrLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZWFkaW5lc3NjaGVjay1yZXNvdXJjZXNldG5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVzb3VyY2VTZXROYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBBIGNvbGxlY3Rpb24gb2YgdGFncyBhc3NvY2lhdGVkIHdpdGggYSByZXNvdXJjZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZWFkaW5lc3NjaGVjay5odG1sI2Nmbi1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVhZGluZXNzY2hlY2stdGFnc1xuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0YWdzOiBjZGsuVGFnTWFuYWdlcjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpSb3V0ZTUzUmVjb3ZlcnlSZWFkaW5lc3M6OlJlYWRpbmVzc0NoZWNrYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuUmVhZGluZXNzQ2hlY2tQcm9wcyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5SZWFkaW5lc3NDaGVjay5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgdGhpcy5hdHRyUmVhZGluZXNzQ2hlY2tBcm4gPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ1JlYWRpbmVzc0NoZWNrQXJuJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcblxuICAgICAgICB0aGlzLnJlYWRpbmVzc0NoZWNrTmFtZSA9IHByb3BzLnJlYWRpbmVzc0NoZWNrTmFtZTtcbiAgICAgICAgdGhpcy5yZXNvdXJjZVNldE5hbWUgPSBwcm9wcy5yZXNvdXJjZVNldE5hbWU7XG4gICAgICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5TVEFOREFSRCwgXCJBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVhZGluZXNzQ2hlY2tcIiwgcHJvcHMudGFncywgeyB0YWdQcm9wZXJ0eU5hbWU6ICd0YWdzJyB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmblJlYWRpbmVzc0NoZWNrLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZWFkaW5lc3NDaGVja05hbWU6IHRoaXMucmVhZGluZXNzQ2hlY2tOYW1lLFxuICAgICAgICAgICAgcmVzb3VyY2VTZXROYW1lOiB0aGlzLnJlc291cmNlU2V0TmFtZSxcbiAgICAgICAgICAgIHRhZ3M6IHRoaXMudGFncy5yZW5kZXJUYWdzKCksXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuUmVhZGluZXNzQ2hlY2tQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5SZWNvdmVyeUdyb3VwYFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVjb3Zlcnlncm91cC5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuUmVjb3ZlcnlHcm91cFByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIEEgbGlzdCBvZiB0aGUgY2VsbCBBbWF6b24gUmVzb3VyY2UgTmFtZXMgKEFSTnMpIGluIHRoZSByZWNvdmVyeSBncm91cC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZWNvdmVyeWdyb3VwLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZWNvdmVyeWdyb3VwLWNlbGxzXG4gICAgICovXG4gICAgcmVhZG9ubHkgY2VsbHM/OiBzdHJpbmdbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSByZWNvdmVyeSBncm91cCB0byBjcmVhdGUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVjb3Zlcnlncm91cC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVjb3Zlcnlncm91cC1yZWNvdmVyeWdyb3VwbmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IHJlY292ZXJ5R3JvdXBOYW1lPzogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQSBjb2xsZWN0aW9uIG9mIHRhZ3MgYXNzb2NpYXRlZCB3aXRoIGEgcmVzb3VyY2UuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVjb3Zlcnlncm91cC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVjb3Zlcnlncm91cC10YWdzXG4gICAgICovXG4gICAgcmVhZG9ubHkgdGFncz86IGNkay5DZm5UYWdbXTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5SZWNvdmVyeUdyb3VwUHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblJlY292ZXJ5R3JvdXBQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5SZWNvdmVyeUdyb3VwUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjZWxscycsIGNkay5saXN0VmFsaWRhdG9yKGNkay52YWxpZGF0ZVN0cmluZykpKHByb3BlcnRpZXMuY2VsbHMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JlY292ZXJ5R3JvdXBOYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnJlY292ZXJ5R3JvdXBOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0YWdzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlQ2ZuVGFnKSkocHJvcGVydGllcy50YWdzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmblJlY292ZXJ5R3JvdXBQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6Um91dGU1M1JlY292ZXJ5UmVhZGluZXNzOjpSZWNvdmVyeUdyb3VwYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5SZWNvdmVyeUdyb3VwUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVjb3ZlcnlHcm91cGAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5SZWNvdmVyeUdyb3VwUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblJlY292ZXJ5R3JvdXBQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgQ2VsbHM6IGNkay5saXN0TWFwcGVyKGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLmNlbGxzKSxcbiAgICAgICAgUmVjb3ZlcnlHcm91cE5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmVjb3ZlcnlHcm91cE5hbWUpLFxuICAgICAgICBUYWdzOiBjZGsubGlzdE1hcHBlcihjZGsuY2ZuVGFnVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy50YWdzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUmVjb3ZlcnlHcm91cFByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuUmVjb3ZlcnlHcm91cFByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5SZWNvdmVyeUdyb3VwUHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdjZWxscycsICdDZWxscycsIHByb3BlcnRpZXMuQ2VsbHMgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nQXJyYXkocHJvcGVydGllcy5DZWxscykgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncmVjb3ZlcnlHcm91cE5hbWUnLCAnUmVjb3ZlcnlHcm91cE5hbWUnLCBwcm9wZXJ0aWVzLlJlY292ZXJ5R3JvdXBOYW1lICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlJlY292ZXJ5R3JvdXBOYW1lKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0YWdzJywgJ1RhZ3MnLCBwcm9wZXJ0aWVzLlRhZ3MgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRDZm5UYWcpKHByb3BlcnRpZXMuVGFncykgOiB1bmRlZmluZWQgYXMgYW55KTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVjb3ZlcnlHcm91cGBcbiAqXG4gKiBDcmVhdGVzIGEgcmVjb3ZlcnkgZ3JvdXAgaW4gYW4gYWNjb3VudC4gQSByZWNvdmVyeSBncm91cCBjb3JyZXNwb25kcyB0byBhbiBhcHBsaWNhdGlvbiBhbmQgaW5jbHVkZXMgYSBsaXN0IG9mIHRoZSBjZWxscyB0aGF0IG1ha2UgdXAgdGhlIGFwcGxpY2F0aW9uLlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6Um91dGU1M1JlY292ZXJ5UmVhZGluZXNzOjpSZWNvdmVyeUdyb3VwXG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlY292ZXJ5Z3JvdXAuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuUmVjb3ZlcnlHcm91cCBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVjb3ZlcnlHcm91cFwiO1xuXG4gICAgLyoqXG4gICAgICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdFxuICAgICAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS5cbiAgICAgKiBVc2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlc291cmNlQXR0cmlidXRlczogYW55LCBvcHRpb25zOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyk6IENmblJlY292ZXJ5R3JvdXAge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmblJlY292ZXJ5R3JvdXBQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuUmVjb3ZlcnlHcm91cChzY29wZSwgaWQsIHByb3BzUmVzdWx0LnZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcEtleSwgcHJvcFZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHNSZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKSkgIHtcbiAgICAgICAgICAgIHJldC5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BLZXksIHByb3BWYWwpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMucGFyc2VyLmhhbmRsZUF0dHJpYnV0ZXMocmV0LCByZXNvdXJjZUF0dHJpYnV0ZXMsIGlkKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIHJlY292ZXJ5IGdyb3VwLlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBSZWNvdmVyeUdyb3VwQXJuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJSZWNvdmVyeUdyb3VwQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBIGxpc3Qgb2YgdGhlIGNlbGwgQW1hem9uIFJlc291cmNlIE5hbWVzIChBUk5zKSBpbiB0aGUgcmVjb3ZlcnkgZ3JvdXAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVjb3Zlcnlncm91cC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVjb3Zlcnlncm91cC1jZWxsc1xuICAgICAqL1xuICAgIHB1YmxpYyBjZWxsczogc3RyaW5nW10gfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgcmVjb3ZlcnkgZ3JvdXAgdG8gY3JlYXRlLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlY292ZXJ5Z3JvdXAuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlY292ZXJ5Z3JvdXAtcmVjb3Zlcnlncm91cG5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVjb3ZlcnlHcm91cE5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIEEgY29sbGVjdGlvbiBvZiB0YWdzIGFzc29jaWF0ZWQgd2l0aCBhIHJlc291cmNlLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlY292ZXJ5Z3JvdXAuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlY292ZXJ5Z3JvdXAtdGFnc1xuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0YWdzOiBjZGsuVGFnTWFuYWdlcjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpSb3V0ZTUzUmVjb3ZlcnlSZWFkaW5lc3M6OlJlY292ZXJ5R3JvdXBgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5SZWNvdmVyeUdyb3VwUHJvcHMgPSB7fSkge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuUmVjb3ZlcnlHcm91cC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgdGhpcy5hdHRyUmVjb3ZlcnlHcm91cEFybiA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnUmVjb3ZlcnlHcm91cEFybicsIGNkay5SZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKSk7XG5cbiAgICAgICAgdGhpcy5jZWxscyA9IHByb3BzLmNlbGxzO1xuICAgICAgICB0aGlzLnJlY292ZXJ5R3JvdXBOYW1lID0gcHJvcHMucmVjb3ZlcnlHcm91cE5hbWU7XG4gICAgICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5TVEFOREFSRCwgXCJBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVjb3ZlcnlHcm91cFwiLCBwcm9wcy50YWdzLCB7IHRhZ1Byb3BlcnR5TmFtZTogJ3RhZ3MnIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuUmVjb3ZlcnlHcm91cC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2VsbHM6IHRoaXMuY2VsbHMsXG4gICAgICAgICAgICByZWNvdmVyeUdyb3VwTmFtZTogdGhpcy5yZWNvdmVyeUdyb3VwTmFtZSxcbiAgICAgICAgICAgIHRhZ3M6IHRoaXMudGFncy5yZW5kZXJUYWdzKCksXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuUmVjb3ZlcnlHcm91cFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmblJlc291cmNlU2V0YFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblJlc291cmNlU2V0UHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogQSBsaXN0IG9mIHJlc291cmNlIG9iamVjdHMgaW4gdGhlIHJlc291cmNlIHNldC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZXNvdXJjZXNldC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtcmVzb3VyY2VzXG4gICAgICovXG4gICAgcmVhZG9ubHkgcmVzb3VyY2VzOiBBcnJheTxDZm5SZXNvdXJjZVNldC5SZXNvdXJjZVByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSByZXNvdXJjZSB0eXBlIG9mIHRoZSByZXNvdXJjZXMgaW4gdGhlIHJlc291cmNlIHNldC4gRW50ZXIgb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzIGZvciByZXNvdXJjZSB0eXBlOlxuICAgICAqXG4gICAgICogQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCwgQVdTOjpDbG91ZFdhdGNoOjpBbGFybSwgQVdTOjpFQzI6OkN1c3RvbWVyR2F0ZXdheSwgQVdTOjpEeW5hbW9EQjo6VGFibGUsIEFXUzo6RUMyOjpWb2x1bWUsIEFXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmc6OkxvYWRCYWxhbmNlciwgQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXIsIEFXUzo6TVNLOjpDbHVzdGVyLCBBV1M6OlJEUzo6REJDbHVzdGVyLCBBV1M6OlJvdXRlNTM6OkhlYWx0aENoZWNrLCBBV1M6OlNRUzo6UXVldWUsIEFXUzo6U05TOjpUb3BpYywgQVdTOjpTTlM6OlN1YnNjcmlwdGlvbiwgQVdTOjpFQzI6OlZQQywgQVdTOjpFQzI6OlZQTkNvbm5lY3Rpb24sIEFXUzo6RUMyOjpWUE5HYXRld2F5LCBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6RE5TVGFyZ2V0UmVzb3VyY2UuXG4gICAgICpcbiAgICAgKiBOb3RlIHRoYXQgQVdTOjpSb3V0ZTUzUmVjb3ZlcnlSZWFkaW5lc3M6OkROU1RhcmdldFJlc291cmNlIGlzIG9ubHkgdXNlZCBmb3IgdGhpcyBzZXR0aW5nLiBJdCBpc24ndCBhbiBhY3R1YWwgQVdTIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlc291cmNlc2V0LXJlc291cmNlc2V0dHlwZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IHJlc291cmNlU2V0VHlwZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHJlc291cmNlIHNldCB0byBjcmVhdGUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlc291cmNlc2V0LXJlc291cmNlc2V0bmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IHJlc291cmNlU2V0TmFtZT86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEEgdGFnIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBwYXJhbWV0ZXJzIGZvciBhIHJlc291cmNlIHNldC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZXNvdXJjZXNldC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtdGFnc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IHRhZ3M/OiBjZGsuQ2ZuVGFnW107XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuUmVzb3VyY2VTZXRQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuUmVzb3VyY2VTZXRQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5SZXNvdXJjZVNldFByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVzb3VyY2VTZXROYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnJlc291cmNlU2V0TmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVzb3VyY2VTZXRUeXBlJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnJlc291cmNlU2V0VHlwZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVzb3VyY2VTZXRUeXBlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnJlc291cmNlU2V0VHlwZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVzb3VyY2VzJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnJlc291cmNlcykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVzb3VyY2VzJywgY2RrLmxpc3RWYWxpZGF0b3IoQ2ZuUmVzb3VyY2VTZXRfUmVzb3VyY2VQcm9wZXJ0eVZhbGlkYXRvcikpKHByb3BlcnRpZXMucmVzb3VyY2VzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0YWdzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlQ2ZuVGFnKSkocHJvcGVydGllcy50YWdzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmblJlc291cmNlU2V0UHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVzb3VyY2VTZXRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblJlc291cmNlU2V0UHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVzb3VyY2VTZXRgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUmVzb3VyY2VTZXRQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuUmVzb3VyY2VTZXRQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgUmVzb3VyY2VzOiBjZGsubGlzdE1hcHBlcihjZm5SZXNvdXJjZVNldFJlc291cmNlUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLnJlc291cmNlcyksXG4gICAgICAgIFJlc291cmNlU2V0VHlwZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yZXNvdXJjZVNldFR5cGUpLFxuICAgICAgICBSZXNvdXJjZVNldE5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmVzb3VyY2VTZXROYW1lKSxcbiAgICAgICAgVGFnczogY2RrLmxpc3RNYXBwZXIoY2RrLmNmblRhZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMudGFncyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblJlc291cmNlU2V0UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5SZXNvdXJjZVNldFByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5SZXNvdXJjZVNldFByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncmVzb3VyY2VzJywgJ1Jlc291cmNlcycsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoQ2ZuUmVzb3VyY2VTZXRSZXNvdXJjZVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLlJlc291cmNlcykpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncmVzb3VyY2VTZXRUeXBlJywgJ1Jlc291cmNlU2V0VHlwZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUmVzb3VyY2VTZXRUeXBlKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyZXNvdXJjZVNldE5hbWUnLCAnUmVzb3VyY2VTZXROYW1lJywgcHJvcGVydGllcy5SZXNvdXJjZVNldE5hbWUgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUmVzb3VyY2VTZXROYW1lKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0YWdzJywgJ1RhZ3MnLCBwcm9wZXJ0aWVzLlRhZ3MgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRDZm5UYWcpKHByb3BlcnRpZXMuVGFncykgOiB1bmRlZmluZWQgYXMgYW55KTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVzb3VyY2VTZXRgXG4gKlxuICogQ3JlYXRlcyBhIHJlc291cmNlIHNldC4gQSByZXNvdXJjZSBzZXQgaXMgYSBzZXQgb2YgcmVzb3VyY2VzIG9mIG9uZSB0eXBlIHRoYXQgc3BhbiBtdWx0aXBsZSBjZWxscy4gWW91IGNhbiBhc3NvY2lhdGUgYSByZXNvdXJjZSBzZXQgd2l0aCBhIHJlYWRpbmVzcyBjaGVjayB0byBtb25pdG9yIHRoZSByZXNvdXJjZXMgZm9yIGZhaWxvdmVyIHJlYWRpbmVzcy5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVzb3VyY2VTZXRcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuUmVzb3VyY2VTZXQgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpSb3V0ZTUzUmVjb3ZlcnlSZWFkaW5lc3M6OlJlc291cmNlU2V0XCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuUmVzb3VyY2VTZXQge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmblJlc291cmNlU2V0UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmblJlc291cmNlU2V0KHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgcmVzb3VyY2Ugc2V0LlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBSZXNvdXJjZVNldEFyblxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyUmVzb3VyY2VTZXRBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEEgbGlzdCBvZiByZXNvdXJjZSBvYmplY3RzIGluIHRoZSByZXNvdXJjZSBzZXQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlc291cmNlc2V0LXJlc291cmNlc1xuICAgICAqL1xuICAgIHB1YmxpYyByZXNvdXJjZXM6IEFycmF5PENmblJlc291cmNlU2V0LlJlc291cmNlUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJlc291cmNlIHR5cGUgb2YgdGhlIHJlc291cmNlcyBpbiB0aGUgcmVzb3VyY2Ugc2V0LiBFbnRlciBvbmUgb2YgdGhlIGZvbGxvd2luZyB2YWx1ZXMgZm9yIHJlc291cmNlIHR5cGU6XG4gICAgICpcbiAgICAgKiBBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwLCBBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtLCBBV1M6OkVDMjo6Q3VzdG9tZXJHYXRld2F5LCBBV1M6OkR5bmFtb0RCOjpUYWJsZSwgQVdTOjpFQzI6OlZvbHVtZSwgQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZzo6TG9hZEJhbGFuY2VyLCBBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OkxvYWRCYWxhbmNlciwgQVdTOjpNU0s6OkNsdXN0ZXIsIEFXUzo6UkRTOjpEQkNsdXN0ZXIsIEFXUzo6Um91dGU1Mzo6SGVhbHRoQ2hlY2ssIEFXUzo6U1FTOjpRdWV1ZSwgQVdTOjpTTlM6OlRvcGljLCBBV1M6OlNOUzo6U3Vic2NyaXB0aW9uLCBBV1M6OkVDMjo6VlBDLCBBV1M6OkVDMjo6VlBOQ29ubmVjdGlvbiwgQVdTOjpFQzI6OlZQTkdhdGV3YXksIEFXUzo6Um91dGU1M1JlY292ZXJ5UmVhZGluZXNzOjpETlNUYXJnZXRSZXNvdXJjZS5cbiAgICAgKlxuICAgICAqIE5vdGUgdGhhdCBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6RE5TVGFyZ2V0UmVzb3VyY2UgaXMgb25seSB1c2VkIGZvciB0aGlzIHNldHRpbmcuIEl0IGlzbid0IGFuIGFjdHVhbCBBV1MgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZXNvdXJjZXNldC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtcmVzb3VyY2VzZXR0eXBlXG4gICAgICovXG4gICAgcHVibGljIHJlc291cmNlU2V0VHlwZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHJlc291cmNlIHNldCB0byBjcmVhdGUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlc291cmNlc2V0LXJlc291cmNlc2V0bmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyByZXNvdXJjZVNldE5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIEEgdGFnIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBwYXJhbWV0ZXJzIGZvciBhIHJlc291cmNlIHNldC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZXNvdXJjZXNldC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtdGFnc1xuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0YWdzOiBjZGsuVGFnTWFuYWdlcjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpSb3V0ZTUzUmVjb3ZlcnlSZWFkaW5lc3M6OlJlc291cmNlU2V0YC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuUmVzb3VyY2VTZXRQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuUmVzb3VyY2VTZXQuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdyZXNvdXJjZVNldFR5cGUnLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ3Jlc291cmNlcycsIHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJSZXNvdXJjZVNldEFybiA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnUmVzb3VyY2VTZXRBcm4nLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuXG4gICAgICAgIHRoaXMucmVzb3VyY2VzID0gcHJvcHMucmVzb3VyY2VzO1xuICAgICAgICB0aGlzLnJlc291cmNlU2V0VHlwZSA9IHByb3BzLnJlc291cmNlU2V0VHlwZTtcbiAgICAgICAgdGhpcy5yZXNvdXJjZVNldE5hbWUgPSBwcm9wcy5yZXNvdXJjZVNldE5hbWU7XG4gICAgICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5TVEFOREFSRCwgXCJBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVzb3VyY2VTZXRcIiwgcHJvcHMudGFncywgeyB0YWdQcm9wZXJ0eU5hbWU6ICd0YWdzJyB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmblJlc291cmNlU2V0LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNvdXJjZXM6IHRoaXMucmVzb3VyY2VzLFxuICAgICAgICAgICAgcmVzb3VyY2VTZXRUeXBlOiB0aGlzLnJlc291cmNlU2V0VHlwZSxcbiAgICAgICAgICAgIHJlc291cmNlU2V0TmFtZTogdGhpcy5yZXNvdXJjZVNldE5hbWUsXG4gICAgICAgICAgICB0YWdzOiB0aGlzLnRhZ3MucmVuZGVyVGFncygpLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmblJlc291cmNlU2V0UHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuUmVzb3VyY2VTZXQge1xuICAgIC8qKlxuICAgICAqIEEgY29tcG9uZW50IGZvciBETlMvcm91dGluZyBjb250cm9sIHJlYWRpbmVzcyBjaGVja3MgYW5kIGFyY2hpdGVjdHVyZSBjaGVja3MuXG4gICAgICpcbiAgICAgKiBAc3RydWN0XG4gICAgICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtZG5zdGFyZ2V0cmVzb3VyY2UuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgRE5TVGFyZ2V0UmVzb3VyY2VQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZG9tYWluIG5hbWUgdGhhdCBhY3RzIGFzIGFuIGluZ3Jlc3MgcG9pbnQgdG8gYSBwb3J0aW9uIG9mIHRoZSBjdXN0b21lciBhcHBsaWNhdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtZG5zdGFyZ2V0cmVzb3VyY2UuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlc291cmNlc2V0LWRuc3RhcmdldHJlc291cmNlLWRvbWFpbm5hbWVcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGRvbWFpbk5hbWU/OiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgaG9zdGVkIHpvbmUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgdGhhdCBjb250YWlucyB0aGUgRE5TIHJlY29yZCB3aXRoIHRoZSBwcm92aWRlZCBuYW1lIG9mIHRoZSB0YXJnZXQgcmVzb3VyY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlc291cmNlc2V0LWRuc3RhcmdldHJlc291cmNlLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZXNvdXJjZXNldC1kbnN0YXJnZXRyZXNvdXJjZS1ob3N0ZWR6b25lYXJuXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBob3N0ZWRab25lQXJuPzogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIFJvdXRlIDUzIHJlY29yZCBzZXQgSUQgdGhhdCB1bmlxdWVseSBpZGVudGlmaWVzIGEgRE5TIHJlY29yZCwgZ2l2ZW4gYSBuYW1lIGFuZCBhIHR5cGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlc291cmNlc2V0LWRuc3RhcmdldHJlc291cmNlLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZXNvdXJjZXNldC1kbnN0YXJnZXRyZXNvdXJjZS1yZWNvcmRzZXRpZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgcmVjb3JkU2V0SWQ/OiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdHlwZSBvZiBETlMgcmVjb3JkIG9mIHRoZSB0YXJnZXQgcmVzb3VyY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlc291cmNlc2V0LWRuc3RhcmdldHJlc291cmNlLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZXNvdXJjZXNldC1kbnN0YXJnZXRyZXNvdXJjZS1yZWNvcmR0eXBlXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSByZWNvcmRUeXBlPzogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHRhcmdldCByZXNvdXJjZSB0aGF0IHRoZSBSb3V0ZSA1MyByZWNvcmQgcG9pbnRzIHRvLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZXNvdXJjZXNldC1kbnN0YXJnZXRyZXNvdXJjZS5odG1sI2Nmbi1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtZG5zdGFyZ2V0cmVzb3VyY2UtdGFyZ2V0cmVzb3VyY2VcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHRhcmdldFJlc291cmNlPzogQ2ZuUmVzb3VyY2VTZXQuVGFyZ2V0UmVzb3VyY2VQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgRE5TVGFyZ2V0UmVzb3VyY2VQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgRE5TVGFyZ2V0UmVzb3VyY2VQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5SZXNvdXJjZVNldF9ETlNUYXJnZXRSZXNvdXJjZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZG9tYWluTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5kb21haW5OYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdob3N0ZWRab25lQXJuJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmhvc3RlZFpvbmVBcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JlY29yZFNldElkJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnJlY29yZFNldElkKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZWNvcmRUeXBlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnJlY29yZFR5cGUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhcmdldFJlc291cmNlJywgQ2ZuUmVzb3VyY2VTZXRfVGFyZ2V0UmVzb3VyY2VQcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy50YXJnZXRSZXNvdXJjZSkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJETlNUYXJnZXRSZXNvdXJjZVByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpSb3V0ZTUzUmVjb3ZlcnlSZWFkaW5lc3M6OlJlc291cmNlU2V0LkROU1RhcmdldFJlc291cmNlYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBETlNUYXJnZXRSZXNvdXJjZVByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpSb3V0ZTUzUmVjb3ZlcnlSZWFkaW5lc3M6OlJlc291cmNlU2V0LkROU1RhcmdldFJlc291cmNlYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblJlc291cmNlU2V0RE5TVGFyZ2V0UmVzb3VyY2VQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuUmVzb3VyY2VTZXRfRE5TVGFyZ2V0UmVzb3VyY2VQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRG9tYWluTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kb21haW5OYW1lKSxcbiAgICAgICAgSG9zdGVkWm9uZUFybjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5ob3N0ZWRab25lQXJuKSxcbiAgICAgICAgUmVjb3JkU2V0SWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmVjb3JkU2V0SWQpLFxuICAgICAgICBSZWNvcmRUeXBlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnJlY29yZFR5cGUpLFxuICAgICAgICBUYXJnZXRSZXNvdXJjZTogY2ZuUmVzb3VyY2VTZXRUYXJnZXRSZXNvdXJjZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnRhcmdldFJlc291cmNlKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUmVzb3VyY2VTZXRETlNUYXJnZXRSZXNvdXJjZVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuUmVzb3VyY2VTZXQuRE5TVGFyZ2V0UmVzb3VyY2VQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5SZXNvdXJjZVNldC5ETlNUYXJnZXRSZXNvdXJjZVByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZG9tYWluTmFtZScsICdEb21haW5OYW1lJywgcHJvcGVydGllcy5Eb21haW5OYW1lICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkRvbWFpbk5hbWUpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2hvc3RlZFpvbmVBcm4nLCAnSG9zdGVkWm9uZUFybicsIHByb3BlcnRpZXMuSG9zdGVkWm9uZUFybiAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5Ib3N0ZWRab25lQXJuKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyZWNvcmRTZXRJZCcsICdSZWNvcmRTZXRJZCcsIHByb3BlcnRpZXMuUmVjb3JkU2V0SWQgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUmVjb3JkU2V0SWQpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3JlY29yZFR5cGUnLCAnUmVjb3JkVHlwZScsIHByb3BlcnRpZXMuUmVjb3JkVHlwZSAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5SZWNvcmRUeXBlKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0YXJnZXRSZXNvdXJjZScsICdUYXJnZXRSZXNvdXJjZScsIHByb3BlcnRpZXMuVGFyZ2V0UmVzb3VyY2UgIT0gbnVsbCA/IENmblJlc291cmNlU2V0VGFyZ2V0UmVzb3VyY2VQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLlRhcmdldFJlc291cmNlKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuUmVzb3VyY2VTZXQge1xuICAgIC8qKlxuICAgICAqIFRoZSBOZXR3b3JrIExvYWQgQmFsYW5jZXIgcmVzb3VyY2UgdGhhdCBhIEROUyB0YXJnZXQgcmVzb3VyY2UgcG9pbnRzIHRvLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlc291cmNlc2V0LW5sYnJlc291cmNlLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIE5MQlJlc291cmNlUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIE5ldHdvcmsgTG9hZCBCYWxhbmNlciByZXNvdXJjZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtbmxicmVzb3VyY2UuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlc291cmNlc2V0LW5sYnJlc291cmNlLWFyblxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgYXJuPzogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBOTEJSZXNvdXJjZVByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBOTEJSZXNvdXJjZVByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblJlc291cmNlU2V0X05MQlJlc291cmNlUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhcm4nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYXJuKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIk5MQlJlc291cmNlUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVzb3VyY2VTZXQuTkxCUmVzb3VyY2VgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYE5MQlJlc291cmNlUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVzb3VyY2VTZXQuTkxCUmVzb3VyY2VgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUmVzb3VyY2VTZXROTEJSZXNvdXJjZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5SZXNvdXJjZVNldF9OTEJSZXNvdXJjZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBBcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYXJuKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUmVzb3VyY2VTZXROTEJSZXNvdXJjZVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuUmVzb3VyY2VTZXQuTkxCUmVzb3VyY2VQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5SZXNvdXJjZVNldC5OTEJSZXNvdXJjZVByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnYXJuJywgJ0FybicsIHByb3BlcnRpZXMuQXJuICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkFybikgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmblJlc291cmNlU2V0IHtcbiAgICAvKipcbiAgICAgKiBUaGUgUm91dGUgNTMgcmVzb3VyY2UgdGhhdCBhIEROUyB0YXJnZXQgcmVzb3VyY2UgcmVjb3JkIHBvaW50cyB0by5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZXNvdXJjZXNldC1yNTNyZXNvdXJjZXJlY29yZC5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBSNTNSZXNvdXJjZVJlY29yZFByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBETlMgdGFyZ2V0IGRvbWFpbiBuYW1lLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZXNvdXJjZXNldC1yNTNyZXNvdXJjZXJlY29yZC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtcjUzcmVzb3VyY2VyZWNvcmQtZG9tYWlubmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgZG9tYWluTmFtZT86IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBSb3V0ZSA1MyBSZXNvdXJjZSBSZWNvcmQgU2V0IElELlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZXNvdXJjZXNldC1yNTNyZXNvdXJjZXJlY29yZC5odG1sI2Nmbi1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtcjUzcmVzb3VyY2VyZWNvcmQtcmVjb3Jkc2V0aWRcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHJlY29yZFNldElkPzogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBSNTNSZXNvdXJjZVJlY29yZFByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBSNTNSZXNvdXJjZVJlY29yZFByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblJlc291cmNlU2V0X1I1M1Jlc291cmNlUmVjb3JkUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkb21haW5OYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRvbWFpbk5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JlY29yZFNldElkJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnJlY29yZFNldElkKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlI1M1Jlc291cmNlUmVjb3JkUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVzb3VyY2VTZXQuUjUzUmVzb3VyY2VSZWNvcmRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFI1M1Jlc291cmNlUmVjb3JkUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVzb3VyY2VTZXQuUjUzUmVzb3VyY2VSZWNvcmRgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUmVzb3VyY2VTZXRSNTNSZXNvdXJjZVJlY29yZFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5SZXNvdXJjZVNldF9SNTNSZXNvdXJjZVJlY29yZFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBEb21haW5OYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmRvbWFpbk5hbWUpLFxuICAgICAgICBSZWNvcmRTZXRJZDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yZWNvcmRTZXRJZCksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblJlc291cmNlU2V0UjUzUmVzb3VyY2VSZWNvcmRQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblJlc291cmNlU2V0LlI1M1Jlc291cmNlUmVjb3JkUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuUmVzb3VyY2VTZXQuUjUzUmVzb3VyY2VSZWNvcmRQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2RvbWFpbk5hbWUnLCAnRG9tYWluTmFtZScsIHByb3BlcnRpZXMuRG9tYWluTmFtZSAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5Eb21haW5OYW1lKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyZWNvcmRTZXRJZCcsICdSZWNvcmRTZXRJZCcsIHByb3BlcnRpZXMuUmVjb3JkU2V0SWQgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUmVjb3JkU2V0SWQpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5SZXNvdXJjZVNldCB7XG4gICAgLyoqXG4gICAgICogVGhlIHJlc291cmNlIGVsZW1lbnQgb2YgYSByZXNvdXJjZSBzZXQuXG4gICAgICpcbiAgICAgKiBAc3RydWN0XG4gICAgICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtcmVzb3VyY2UuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVzb3VyY2VQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgY29tcG9uZW50IGlkZW50aWZpZXIgb2YgdGhlIHJlc291cmNlLCBnZW5lcmF0ZWQgd2hlbiBETlMgdGFyZ2V0IHJlc291cmNlIGlzIHVzZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlc291cmNlc2V0LXJlc291cmNlLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZXNvdXJjZXNldC1yZXNvdXJjZS1jb21wb25lbnRpZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgY29tcG9uZW50SWQ/OiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGNvbXBvbmVudCBmb3IgRE5TL3JvdXRpbmcgY29udHJvbCByZWFkaW5lc3MgY2hlY2tzLiBUaGlzIGlzIGEgcmVxdWlyZWQgc2V0dGluZyB3aGVuIGBSZXNvdXJjZVNldGAgYFJlc291cmNlU2V0VHlwZWAgaXMgc2V0IHRvIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6RE5TVGFyZ2V0UmVzb3VyY2VgIC4gRG8gbm90IHNldCBpdCBmb3IgYW55IG90aGVyIGBSZXNvdXJjZVNldFR5cGVgIHNldHRpbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlc291cmNlc2V0LXJlc291cmNlLmh0bWwjY2ZuLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZXNvdXJjZXNldC1yZXNvdXJjZS1kbnN0YXJnZXRyZXNvdXJjZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgZG5zVGFyZ2V0UmVzb3VyY2U/OiBDZm5SZXNvdXJjZVNldC5ETlNUYXJnZXRSZXNvdXJjZVByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHJlY292ZXJ5IGdyb3VwIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9yIHRoZSBjZWxsIEFSTiB0aGF0IHRoZSByZWFkaW5lc3MgY2hlY2tzIGZvciB0aGlzIHJlc291cmNlIHNldCBhcmUgc2NvcGVkIHRvLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJvdXRlNTNyZWNvdmVyeXJlYWRpbmVzcy1yZXNvdXJjZXNldC1yZXNvdXJjZS5odG1sI2Nmbi1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtcmVzb3VyY2UtcmVhZGluZXNzc2NvcGVzXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSByZWFkaW5lc3NTY29wZXM/OiBzdHJpbmdbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgQVdTIHJlc291cmNlLiBUaGlzIGlzIGEgcmVxdWlyZWQgc2V0dGluZyBmb3IgYWxsIGBSZXNvdXJjZVNldGAgYFJlc291cmNlU2V0VHlwZWAgc2V0dGluZ3MgZXhjZXB0IGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6RE5TVGFyZ2V0UmVzb3VyY2VgIC4gRG8gbm90IHNldCB0aGlzIHdoZW4gYFJlc291cmNlU2V0VHlwZWAgaXMgc2V0IHRvIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6RE5TVGFyZ2V0UmVzb3VyY2VgIC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtcmVzb3VyY2UuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlc291cmNlc2V0LXJlc291cmNlLXJlc291cmNlYXJuXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSByZXNvdXJjZUFybj86IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgUmVzb3VyY2VQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUmVzb3VyY2VQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5SZXNvdXJjZVNldF9SZXNvdXJjZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY29tcG9uZW50SWQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuY29tcG9uZW50SWQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Ruc1RhcmdldFJlc291cmNlJywgQ2ZuUmVzb3VyY2VTZXRfRE5TVGFyZ2V0UmVzb3VyY2VQcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5kbnNUYXJnZXRSZXNvdXJjZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVhZGluZXNzU2NvcGVzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5yZWFkaW5lc3NTY29wZXMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3Jlc291cmNlQXJuJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnJlc291cmNlQXJuKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlJlc291cmNlUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVzb3VyY2VTZXQuUmVzb3VyY2VgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFJlc291cmNlUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVzb3VyY2VTZXQuUmVzb3VyY2VgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUmVzb3VyY2VTZXRSZXNvdXJjZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5SZXNvdXJjZVNldF9SZXNvdXJjZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBDb21wb25lbnRJZDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5jb21wb25lbnRJZCksXG4gICAgICAgIERuc1RhcmdldFJlc291cmNlOiBjZm5SZXNvdXJjZVNldEROU1RhcmdldFJlc291cmNlUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZG5zVGFyZ2V0UmVzb3VyY2UpLFxuICAgICAgICBSZWFkaW5lc3NTY29wZXM6IGNkay5saXN0TWFwcGVyKGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLnJlYWRpbmVzc1Njb3BlcyksXG4gICAgICAgIFJlc291cmNlQXJuOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnJlc291cmNlQXJuKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuUmVzb3VyY2VTZXRSZXNvdXJjZVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuUmVzb3VyY2VTZXQuUmVzb3VyY2VQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5SZXNvdXJjZVNldC5SZXNvdXJjZVByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnY29tcG9uZW50SWQnLCAnQ29tcG9uZW50SWQnLCBwcm9wZXJ0aWVzLkNvbXBvbmVudElkICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkNvbXBvbmVudElkKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdkbnNUYXJnZXRSZXNvdXJjZScsICdEbnNUYXJnZXRSZXNvdXJjZScsIHByb3BlcnRpZXMuRG5zVGFyZ2V0UmVzb3VyY2UgIT0gbnVsbCA/IENmblJlc291cmNlU2V0RE5TVGFyZ2V0UmVzb3VyY2VQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLkRuc1RhcmdldFJlc291cmNlKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyZWFkaW5lc3NTY29wZXMnLCAnUmVhZGluZXNzU2NvcGVzJywgcHJvcGVydGllcy5SZWFkaW5lc3NTY29wZXMgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nQXJyYXkocHJvcGVydGllcy5SZWFkaW5lc3NTY29wZXMpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3Jlc291cmNlQXJuJywgJ1Jlc291cmNlQXJuJywgcHJvcGVydGllcy5SZXNvdXJjZUFybiAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5SZXNvdXJjZUFybikgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmblJlc291cmNlU2V0IHtcbiAgICAvKipcbiAgICAgKiBUaGUgdGFyZ2V0IHJlc291cmNlIHRoYXQgdGhlIFJvdXRlIDUzIHJlY29yZCBwb2ludHMgdG8uXG4gICAgICpcbiAgICAgKiBAc3RydWN0XG4gICAgICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtdGFyZ2V0cmVzb3VyY2UuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGFyZ2V0UmVzb3VyY2VQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgTmV0d29yayBMb2FkIEJhbGFuY2VyIHJlc291cmNlIHRoYXQgYSBETlMgdGFyZ2V0IHJlc291cmNlIHBvaW50cyB0by5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtdGFyZ2V0cmVzb3VyY2UuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlc291cmNlc2V0LXRhcmdldHJlc291cmNlLW5sYnJlc291cmNlXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBubGJSZXNvdXJjZT86IENmblJlc291cmNlU2V0Lk5MQlJlc291cmNlUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgUm91dGUgNTMgcmVzb3VyY2UgdGhhdCBhIEROUyB0YXJnZXQgcmVzb3VyY2UgcmVjb3JkIHBvaW50cyB0by5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yb3V0ZTUzcmVjb3ZlcnlyZWFkaW5lc3MtcmVzb3VyY2VzZXQtdGFyZ2V0cmVzb3VyY2UuaHRtbCNjZm4tcm91dGU1M3JlY292ZXJ5cmVhZGluZXNzLXJlc291cmNlc2V0LXRhcmdldHJlc291cmNlLXI1M3Jlc291cmNlXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSByNTNSZXNvdXJjZT86IENmblJlc291cmNlU2V0LlI1M1Jlc291cmNlUmVjb3JkUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYFRhcmdldFJlc291cmNlUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFRhcmdldFJlc291cmNlUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuUmVzb3VyY2VTZXRfVGFyZ2V0UmVzb3VyY2VQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25sYlJlc291cmNlJywgQ2ZuUmVzb3VyY2VTZXRfTkxCUmVzb3VyY2VQcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5ubGJSZXNvdXJjZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncjUzUmVzb3VyY2UnLCBDZm5SZXNvdXJjZVNldF9SNTNSZXNvdXJjZVJlY29yZFByb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLnI1M1Jlc291cmNlKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlRhcmdldFJlc291cmNlUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVzb3VyY2VTZXQuVGFyZ2V0UmVzb3VyY2VgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFRhcmdldFJlc291cmNlUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJvdXRlNTNSZWNvdmVyeVJlYWRpbmVzczo6UmVzb3VyY2VTZXQuVGFyZ2V0UmVzb3VyY2VgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUmVzb3VyY2VTZXRUYXJnZXRSZXNvdXJjZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5SZXNvdXJjZVNldF9UYXJnZXRSZXNvdXJjZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBOTEJSZXNvdXJjZTogY2ZuUmVzb3VyY2VTZXROTEJSZXNvdXJjZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLm5sYlJlc291cmNlKSxcbiAgICAgICAgUjUzUmVzb3VyY2U6IGNmblJlc291cmNlU2V0UjUzUmVzb3VyY2VSZWNvcmRQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yNTNSZXNvdXJjZSksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblJlc291cmNlU2V0VGFyZ2V0UmVzb3VyY2VQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblJlc291cmNlU2V0LlRhcmdldFJlc291cmNlUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuUmVzb3VyY2VTZXQuVGFyZ2V0UmVzb3VyY2VQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ25sYlJlc291cmNlJywgJ05MQlJlc291cmNlJywgcHJvcGVydGllcy5OTEJSZXNvdXJjZSAhPSBudWxsID8gQ2ZuUmVzb3VyY2VTZXROTEJSZXNvdXJjZVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuTkxCUmVzb3VyY2UpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3I1M1Jlc291cmNlJywgJ1I1M1Jlc291cmNlJywgcHJvcGVydGllcy5SNTNSZXNvdXJjZSAhPSBudWxsID8gQ2ZuUmVzb3VyY2VTZXRSNTNSZXNvdXJjZVJlY29yZFByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuUjUzUmVzb3VyY2UpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cbiJdfQ==