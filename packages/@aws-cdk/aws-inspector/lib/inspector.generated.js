"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnResourceGroup = exports.CfnAssessmentTemplate = exports.CfnAssessmentTarget = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cfn_parse = require("@aws-cdk/core/lib/helpers-internal");
/**
 * Determine whether the given properties match those of a `CfnAssessmentTargetProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssessmentTargetProps`
 *
 * @returns the result of the validation.
 */
function CfnAssessmentTargetPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('assessmentTargetName', cdk.validateString)(properties.assessmentTargetName));
    errors.collect(cdk.propertyValidator('resourceGroupArn', cdk.validateString)(properties.resourceGroupArn));
    return errors.wrap('supplied properties not correct for "CfnAssessmentTargetProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Inspector::AssessmentTarget` resource
 *
 * @param properties - the TypeScript properties of a `CfnAssessmentTargetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Inspector::AssessmentTarget` resource.
 */
// @ts-ignore TS6133
function cfnAssessmentTargetPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnAssessmentTargetPropsValidator(properties).assertSuccess();
    return {
        AssessmentTargetName: cdk.stringToCloudFormation(properties.assessmentTargetName),
        ResourceGroupArn: cdk.stringToCloudFormation(properties.resourceGroupArn),
    };
}
// @ts-ignore TS6133
function CfnAssessmentTargetPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('assessmentTargetName', 'AssessmentTargetName', properties.AssessmentTargetName != null ? cfn_parse.FromCloudFormation.getString(properties.AssessmentTargetName) : undefined);
    ret.addPropertyResult('resourceGroupArn', 'ResourceGroupArn', properties.ResourceGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceGroupArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::Inspector::AssessmentTarget`
 *
 * The `AWS::Inspector::AssessmentTarget` resource is used to create Amazon Inspector assessment targets, which specify the Amazon EC2 instances that will be analyzed during an assessment run.
 *
 * @cloudformationResource AWS::Inspector::AssessmentTarget
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttarget.html
 */
class CfnAssessmentTarget extends cdk.CfnResource {
    /**
     * Create a new `AWS::Inspector::AssessmentTarget`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props = {}) {
        super(scope, id, { type: CfnAssessmentTarget.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_inspector_CfnAssessmentTargetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnAssessmentTarget);
            }
            throw error;
        }
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.assessmentTargetName = props.assessmentTargetName;
        this.resourceGroupArn = props.resourceGroupArn;
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
        const propsResult = CfnAssessmentTargetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAssessmentTarget(scope, id, propsResult.value);
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssessmentTarget.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            assessmentTargetName: this.assessmentTargetName,
            resourceGroupArn: this.resourceGroupArn,
        };
    }
    renderProperties(props) {
        return cfnAssessmentTargetPropsToCloudFormation(props);
    }
}
exports.CfnAssessmentTarget = CfnAssessmentTarget;
_a = JSII_RTTI_SYMBOL_1;
CfnAssessmentTarget[_a] = { fqn: "@aws-cdk/aws-inspector.CfnAssessmentTarget", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnAssessmentTarget.CFN_RESOURCE_TYPE_NAME = "AWS::Inspector::AssessmentTarget";
/**
 * Determine whether the given properties match those of a `CfnAssessmentTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssessmentTemplateProps`
 *
 * @returns the result of the validation.
 */
function CfnAssessmentTemplatePropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('assessmentTargetArn', cdk.requiredValidator)(properties.assessmentTargetArn));
    errors.collect(cdk.propertyValidator('assessmentTargetArn', cdk.validateString)(properties.assessmentTargetArn));
    errors.collect(cdk.propertyValidator('assessmentTemplateName', cdk.validateString)(properties.assessmentTemplateName));
    errors.collect(cdk.propertyValidator('durationInSeconds', cdk.requiredValidator)(properties.durationInSeconds));
    errors.collect(cdk.propertyValidator('durationInSeconds', cdk.validateNumber)(properties.durationInSeconds));
    errors.collect(cdk.propertyValidator('rulesPackageArns', cdk.requiredValidator)(properties.rulesPackageArns));
    errors.collect(cdk.propertyValidator('rulesPackageArns', cdk.listValidator(cdk.validateString))(properties.rulesPackageArns));
    errors.collect(cdk.propertyValidator('userAttributesForFindings', cdk.listValidator(cdk.validateCfnTag))(properties.userAttributesForFindings));
    return errors.wrap('supplied properties not correct for "CfnAssessmentTemplateProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Inspector::AssessmentTemplate` resource
 *
 * @param properties - the TypeScript properties of a `CfnAssessmentTemplateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Inspector::AssessmentTemplate` resource.
 */
// @ts-ignore TS6133
function cfnAssessmentTemplatePropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnAssessmentTemplatePropsValidator(properties).assertSuccess();
    return {
        AssessmentTargetArn: cdk.stringToCloudFormation(properties.assessmentTargetArn),
        DurationInSeconds: cdk.numberToCloudFormation(properties.durationInSeconds),
        RulesPackageArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.rulesPackageArns),
        AssessmentTemplateName: cdk.stringToCloudFormation(properties.assessmentTemplateName),
        UserAttributesForFindings: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.userAttributesForFindings),
    };
}
// @ts-ignore TS6133
function CfnAssessmentTemplatePropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('assessmentTargetArn', 'AssessmentTargetArn', cfn_parse.FromCloudFormation.getString(properties.AssessmentTargetArn));
    ret.addPropertyResult('durationInSeconds', 'DurationInSeconds', cfn_parse.FromCloudFormation.getNumber(properties.DurationInSeconds));
    ret.addPropertyResult('rulesPackageArns', 'RulesPackageArns', cfn_parse.FromCloudFormation.getStringArray(properties.RulesPackageArns));
    ret.addPropertyResult('assessmentTemplateName', 'AssessmentTemplateName', properties.AssessmentTemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.AssessmentTemplateName) : undefined);
    ret.addPropertyResult('userAttributesForFindings', 'UserAttributesForFindings', properties.UserAttributesForFindings != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.UserAttributesForFindings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::Inspector::AssessmentTemplate`
 *
 * The `AWS::Inspector::AssessmentTemplate` resource creates an Amazon Inspector assessment template, which specifies the Inspector assessment targets that will be evaluated by an assessment run and its related configurations.
 *
 * @cloudformationResource AWS::Inspector::AssessmentTemplate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html
 */
class CfnAssessmentTemplate extends cdk.CfnResource {
    /**
     * Create a new `AWS::Inspector::AssessmentTemplate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnAssessmentTemplate.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_inspector_CfnAssessmentTemplateProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnAssessmentTemplate);
            }
            throw error;
        }
        cdk.requireProperty(props, 'assessmentTargetArn', this);
        cdk.requireProperty(props, 'durationInSeconds', this);
        cdk.requireProperty(props, 'rulesPackageArns', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.assessmentTargetArn = props.assessmentTargetArn;
        this.durationInSeconds = props.durationInSeconds;
        this.rulesPackageArns = props.rulesPackageArns;
        this.assessmentTemplateName = props.assessmentTemplateName;
        this.userAttributesForFindings = props.userAttributesForFindings;
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
        const propsResult = CfnAssessmentTemplatePropsFromCloudFormation(resourceProperties);
        const ret = new CfnAssessmentTemplate(scope, id, propsResult.value);
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssessmentTemplate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            assessmentTargetArn: this.assessmentTargetArn,
            durationInSeconds: this.durationInSeconds,
            rulesPackageArns: this.rulesPackageArns,
            assessmentTemplateName: this.assessmentTemplateName,
            userAttributesForFindings: this.userAttributesForFindings,
        };
    }
    renderProperties(props) {
        return cfnAssessmentTemplatePropsToCloudFormation(props);
    }
}
exports.CfnAssessmentTemplate = CfnAssessmentTemplate;
_b = JSII_RTTI_SYMBOL_1;
CfnAssessmentTemplate[_b] = { fqn: "@aws-cdk/aws-inspector.CfnAssessmentTemplate", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnAssessmentTemplate.CFN_RESOURCE_TYPE_NAME = "AWS::Inspector::AssessmentTemplate";
/**
 * Determine whether the given properties match those of a `CfnResourceGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnResourceGroupPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceGroupTags', cdk.requiredValidator)(properties.resourceGroupTags));
    errors.collect(cdk.propertyValidator('resourceGroupTags', cdk.listValidator(cdk.validateCfnTag))(properties.resourceGroupTags));
    return errors.wrap('supplied properties not correct for "CfnResourceGroupProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::Inspector::ResourceGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnResourceGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Inspector::ResourceGroup` resource.
 */
// @ts-ignore TS6133
function cfnResourceGroupPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnResourceGroupPropsValidator(properties).assertSuccess();
    return {
        ResourceGroupTags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.resourceGroupTags),
    };
}
// @ts-ignore TS6133
function CfnResourceGroupPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('resourceGroupTags', 'ResourceGroupTags', cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.ResourceGroupTags));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::Inspector::ResourceGroup`
 *
 * The `AWS::Inspector::ResourceGroup` resource is used to create Amazon Inspector resource groups. A resource group defines a set of tags that, when queried, identify the AWS resources that make up the assessment target.
 *
 * @cloudformationResource AWS::Inspector::ResourceGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-resourcegroup.html
 */
class CfnResourceGroup extends cdk.CfnResource {
    /**
     * Create a new `AWS::Inspector::ResourceGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnResourceGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_inspector_CfnResourceGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnResourceGroup);
            }
            throw error;
        }
        cdk.requireProperty(props, 'resourceGroupTags', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.resourceGroupTags = props.resourceGroupTags;
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
        const propsResult = CfnResourceGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnResourceGroup(scope, id, propsResult.value);
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            resourceGroupTags: this.resourceGroupTags,
        };
    }
    renderProperties(props) {
        return cfnResourceGroupPropsToCloudFormation(props);
    }
}
exports.CfnResourceGroup = CfnResourceGroup;
_c = JSII_RTTI_SYMBOL_1;
CfnResourceGroup[_c] = { fqn: "@aws-cdk/aws-inspector.CfnResourceGroup", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnResourceGroup.CFN_RESOURCE_TYPE_NAME = "AWS::Inspector::ResourceGroup";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zcGVjdG9yLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluc3BlY3Rvci5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBUUEscUNBQXFDO0FBQ3JDLGdFQUFnRTtBQTJCaEU7Ozs7OztHQU1HO0FBQ0gsU0FBUyxpQ0FBaUMsQ0FBQyxVQUFlO0lBQ3RELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUM7S0FBRTtJQUNuRSxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNDLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0c7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztJQUNuSCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztJQUMzRyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsb0JBQW9CO0FBQ3BCLFNBQVMsd0NBQXdDLENBQUMsVUFBZTtJQUM3RCxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sVUFB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NkJBQTZCLEVBQUUsZ0JBQWdCLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUMvRixTQUFTLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUM5RTtJQUVELElBQWMsYUFBYTtRQUN2QixPQUFPO1lBQ0gsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtTQUM1QyxDQUFDO0tBQ0w7SUFFUyxnQkFBZ0IsQ0FBQyxLQUEyQjtRQUNsRCxPQUFPLHFDQUFxQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3ZEOztBQTFFTCw0Q0EyRUM7OztBQTFFRzs7R0FFRztBQUNvQix1Q0FBc0IsR0FBRywrQkFBK0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8vIEdlbmVyYXRlZCBmcm9tIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gUmVzb3VyY2UgU3BlY2lmaWNhdGlvblxuLy8gU2VlOiBkb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvY2ZuLXJlc291cmNlLXNwZWNpZmljYXRpb24uaHRtbFxuLy8gQGNmbjJ0czptZXRhQCB7XCJnZW5lcmF0ZWRcIjpcIjIwMjMtMDEtMjJUMDk6NTI6MjkuNjE0WlwiLFwiZmluZ2VycHJpbnRcIjpcInhXSU1rd0puOHRBME5HTWtnUE8yT0pRc1pMamkrSE5hRnlHbC95TmhkdmM9XCJ9XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuaW1wb3J0ICogYXMgY29uc3RydWN0cyBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNmbl9wYXJzZSBmcm9tICdAYXdzLWNkay9jb3JlL2xpYi9oZWxwZXJzLWludGVybmFsJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5Bc3Nlc3NtZW50VGFyZ2V0YFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1pbnNwZWN0b3ItYXNzZXNzbWVudHRhcmdldC5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQXNzZXNzbWVudFRhcmdldFByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBBbWF6b24gSW5zcGVjdG9yIGFzc2Vzc21lbnQgdGFyZ2V0LiBUaGUgbmFtZSBtdXN0IGJlIHVuaXF1ZSB3aXRoaW4gdGhlIEFXUyBhY2NvdW50IC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWluc3BlY3Rvci1hc3Nlc3NtZW50dGFyZ2V0Lmh0bWwjY2ZuLWluc3BlY3Rvci1hc3Nlc3NtZW50dGFyZ2V0LWFzc2Vzc21lbnR0YXJnZXRuYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgYXNzZXNzbWVudFRhcmdldE5hbWU/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQVJOIHRoYXQgc3BlY2lmaWVzIHRoZSByZXNvdXJjZSBncm91cCB0aGF0IGlzIHVzZWQgdG8gY3JlYXRlIHRoZSBhc3Nlc3NtZW50IHRhcmdldC4gSWYgYHJlc291cmNlR3JvdXBBcm5gIGlzIG5vdCBzcGVjaWZpZWQsIGFsbCBFQzIgaW5zdGFuY2VzIGluIHRoZSBjdXJyZW50IEFXUyBhY2NvdW50IGFuZCBSZWdpb24gYXJlIGluY2x1ZGVkIGluIHRoZSBhc3Nlc3NtZW50IHRhcmdldC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWluc3BlY3Rvci1hc3Nlc3NtZW50dGFyZ2V0Lmh0bWwjY2ZuLWluc3BlY3Rvci1hc3Nlc3NtZW50dGFyZ2V0LXJlc291cmNlZ3JvdXBhcm5cbiAgICAgKi9cbiAgICByZWFkb25seSByZXNvdXJjZUdyb3VwQXJuPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkFzc2Vzc21lbnRUYXJnZXRQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuQXNzZXNzbWVudFRhcmdldFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkFzc2Vzc21lbnRUYXJnZXRQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Fzc2Vzc21lbnRUYXJnZXROYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmFzc2Vzc21lbnRUYXJnZXROYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZXNvdXJjZUdyb3VwQXJuJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnJlc291cmNlR3JvdXBBcm4pKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuQXNzZXNzbWVudFRhcmdldFByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpJbnNwZWN0b3I6OkFzc2Vzc21lbnRUYXJnZXRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkFzc2Vzc21lbnRUYXJnZXRQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6SW5zcGVjdG9yOjpBc3Nlc3NtZW50VGFyZ2V0YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkFzc2Vzc21lbnRUYXJnZXRQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQXNzZXNzbWVudFRhcmdldFByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBBc3Nlc3NtZW50VGFyZ2V0TmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hc3Nlc3NtZW50VGFyZ2V0TmFtZSksXG4gICAgICAgIFJlc291cmNlR3JvdXBBcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmVzb3VyY2VHcm91cEFybiksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkFzc2Vzc21lbnRUYXJnZXRQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkFzc2Vzc21lbnRUYXJnZXRQcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuQXNzZXNzbWVudFRhcmdldFByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnYXNzZXNzbWVudFRhcmdldE5hbWUnLCAnQXNzZXNzbWVudFRhcmdldE5hbWUnLCBwcm9wZXJ0aWVzLkFzc2Vzc21lbnRUYXJnZXROYW1lICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkFzc2Vzc21lbnRUYXJnZXROYW1lKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdyZXNvdXJjZUdyb3VwQXJuJywgJ1Jlc291cmNlR3JvdXBBcm4nLCBwcm9wZXJ0aWVzLlJlc291cmNlR3JvdXBBcm4gIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUmVzb3VyY2VHcm91cEFybikgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6SW5zcGVjdG9yOjpBc3Nlc3NtZW50VGFyZ2V0YFxuICpcbiAqIFRoZSBgQVdTOjpJbnNwZWN0b3I6OkFzc2Vzc21lbnRUYXJnZXRgIHJlc291cmNlIGlzIHVzZWQgdG8gY3JlYXRlIEFtYXpvbiBJbnNwZWN0b3IgYXNzZXNzbWVudCB0YXJnZXRzLCB3aGljaCBzcGVjaWZ5IHRoZSBBbWF6b24gRUMyIGluc3RhbmNlcyB0aGF0IHdpbGwgYmUgYW5hbHl6ZWQgZHVyaW5nIGFuIGFzc2Vzc21lbnQgcnVuLlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6SW5zcGVjdG9yOjpBc3Nlc3NtZW50VGFyZ2V0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtaW5zcGVjdG9yLWFzc2Vzc21lbnR0YXJnZXQuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuQXNzZXNzbWVudFRhcmdldCBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6Okluc3BlY3Rvcjo6QXNzZXNzbWVudFRhcmdldFwiO1xuXG4gICAgLyoqXG4gICAgICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdFxuICAgICAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS5cbiAgICAgKiBVc2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlc291cmNlQXR0cmlidXRlczogYW55LCBvcHRpb25zOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyk6IENmbkFzc2Vzc21lbnRUYXJnZXQge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmbkFzc2Vzc21lbnRUYXJnZXRQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuQXNzZXNzbWVudFRhcmdldChzY29wZSwgaWQsIHByb3BzUmVzdWx0LnZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcEtleSwgcHJvcFZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHNSZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKSkgIHtcbiAgICAgICAgICAgIHJldC5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BLZXksIHByb3BWYWwpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMucGFyc2VyLmhhbmRsZUF0dHJpYnV0ZXMocmV0LCByZXNvdXJjZUF0dHJpYnV0ZXMsIGlkKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgdGhhdCBzcGVjaWZpZXMgdGhlIGFzc2Vzc21lbnQgdGFyZ2V0IHRoYXQgaXMgY3JlYXRlZC5cbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgQXJuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBBbWF6b24gSW5zcGVjdG9yIGFzc2Vzc21lbnQgdGFyZ2V0LiBUaGUgbmFtZSBtdXN0IGJlIHVuaXF1ZSB3aXRoaW4gdGhlIEFXUyBhY2NvdW50IC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWluc3BlY3Rvci1hc3Nlc3NtZW50dGFyZ2V0Lmh0bWwjY2ZuLWluc3BlY3Rvci1hc3Nlc3NtZW50dGFyZ2V0LWFzc2Vzc21lbnR0YXJnZXRuYW1lXG4gICAgICovXG4gICAgcHVibGljIGFzc2Vzc21lbnRUYXJnZXROYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQVJOIHRoYXQgc3BlY2lmaWVzIHRoZSByZXNvdXJjZSBncm91cCB0aGF0IGlzIHVzZWQgdG8gY3JlYXRlIHRoZSBhc3Nlc3NtZW50IHRhcmdldC4gSWYgYHJlc291cmNlR3JvdXBBcm5gIGlzIG5vdCBzcGVjaWZpZWQsIGFsbCBFQzIgaW5zdGFuY2VzIGluIHRoZSBjdXJyZW50IEFXUyBhY2NvdW50IGFuZCBSZWdpb24gYXJlIGluY2x1ZGVkIGluIHRoZSBhc3Nlc3NtZW50IHRhcmdldC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWluc3BlY3Rvci1hc3Nlc3NtZW50dGFyZ2V0Lmh0bWwjY2ZuLWluc3BlY3Rvci1hc3Nlc3NtZW50dGFyZ2V0LXJlc291cmNlZ3JvdXBhcm5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVzb3VyY2VHcm91cEFybjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6Okluc3BlY3Rvcjo6QXNzZXNzbWVudFRhcmdldGAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbkFzc2Vzc21lbnRUYXJnZXRQcm9wcyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5Bc3Nlc3NtZW50VGFyZ2V0LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICB0aGlzLmF0dHJBcm4gPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ0FybicsIGNkay5SZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKSk7XG5cbiAgICAgICAgdGhpcy5hc3Nlc3NtZW50VGFyZ2V0TmFtZSA9IHByb3BzLmFzc2Vzc21lbnRUYXJnZXROYW1lO1xuICAgICAgICB0aGlzLnJlc291cmNlR3JvdXBBcm4gPSBwcm9wcy5yZXNvdXJjZUdyb3VwQXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuQXNzZXNzbWVudFRhcmdldC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXNzZXNzbWVudFRhcmdldE5hbWU6IHRoaXMuYXNzZXNzbWVudFRhcmdldE5hbWUsXG4gICAgICAgICAgICByZXNvdXJjZUdyb3VwQXJuOiB0aGlzLnJlc291cmNlR3JvdXBBcm4sXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuQXNzZXNzbWVudFRhcmdldFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmbkFzc2Vzc21lbnRUZW1wbGF0ZWBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtaW5zcGVjdG9yLWFzc2Vzc21lbnR0ZW1wbGF0ZS5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQXNzZXNzbWVudFRlbXBsYXRlUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFSTiBvZiB0aGUgYXNzZXNzbWVudCB0YXJnZXQgdG8gYmUgaW5jbHVkZWQgaW4gdGhlIGFzc2Vzc21lbnQgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1pbnNwZWN0b3ItYXNzZXNzbWVudHRlbXBsYXRlLmh0bWwjY2ZuLWluc3BlY3Rvci1hc3Nlc3NtZW50dGVtcGxhdGUtYXNzZXNzbWVudHRhcmdldGFyblxuICAgICAqL1xuICAgIHJlYWRvbmx5IGFzc2Vzc21lbnRUYXJnZXRBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkdXJhdGlvbiBvZiB0aGUgYXNzZXNzbWVudCBydW4gaW4gc2Vjb25kcy5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWluc3BlY3Rvci1hc3Nlc3NtZW50dGVtcGxhdGUuaHRtbCNjZm4taW5zcGVjdG9yLWFzc2Vzc21lbnR0ZW1wbGF0ZS1kdXJhdGlvbmluc2Vjb25kc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IGR1cmF0aW9uSW5TZWNvbmRzOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQVJOcyBvZiB0aGUgcnVsZXMgcGFja2FnZXMgdGhhdCB5b3Ugd2FudCB0byB1c2UgaW4gdGhlIGFzc2Vzc21lbnQgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1pbnNwZWN0b3ItYXNzZXNzbWVudHRlbXBsYXRlLmh0bWwjY2ZuLWluc3BlY3Rvci1hc3Nlc3NtZW50dGVtcGxhdGUtcnVsZXNwYWNrYWdlYXJuc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IHJ1bGVzUGFja2FnZUFybnM6IHN0cmluZ1tdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHVzZXItZGVmaW5lZCBuYW1lIHRoYXQgaWRlbnRpZmllcyB0aGUgYXNzZXNzbWVudCB0ZW1wbGF0ZSB0aGF0IHlvdSB3YW50IHRvIGNyZWF0ZS4gWW91IGNhbiBjcmVhdGUgc2V2ZXJhbCBhc3Nlc3NtZW50IHRlbXBsYXRlcyBmb3IgdGhlIHNhbWUgYXNzZXNzbWVudCB0YXJnZXQuIFRoZSBuYW1lcyBvZiB0aGUgYXNzZXNzbWVudCB0ZW1wbGF0ZXMgdGhhdCBjb3JyZXNwb25kIHRvIGEgcGFydGljdWxhciBhc3Nlc3NtZW50IHRhcmdldCBtdXN0IGJlIHVuaXF1ZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWluc3BlY3Rvci1hc3Nlc3NtZW50dGVtcGxhdGUuaHRtbCNjZm4taW5zcGVjdG9yLWFzc2Vzc21lbnR0ZW1wbGF0ZS1hc3Nlc3NtZW50dGVtcGxhdGVuYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgYXNzZXNzbWVudFRlbXBsYXRlTmFtZT86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSB1c2VyLWRlZmluZWQgYXR0cmlidXRlcyB0aGF0IGFyZSBhc3NpZ25lZCB0byBldmVyeSBmaW5kaW5nIHRoYXQgaXMgZ2VuZXJhdGVkIGJ5IHRoZSBhc3Nlc3NtZW50IHJ1biB0aGF0IHVzZXMgdGhpcyBhc3Nlc3NtZW50IHRlbXBsYXRlLiBXaXRoaW4gYW4gYXNzZXNzbWVudCB0ZW1wbGF0ZSwgZWFjaCBrZXkgbXVzdCBiZSB1bmlxdWUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1pbnNwZWN0b3ItYXNzZXNzbWVudHRlbXBsYXRlLmh0bWwjY2ZuLWluc3BlY3Rvci1hc3Nlc3NtZW50dGVtcGxhdGUtdXNlcmF0dHJpYnV0ZXNmb3JmaW5kaW5nc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IHVzZXJBdHRyaWJ1dGVzRm9yRmluZGluZ3M/OiBBcnJheTxjZGsuQ2ZuVGFnIHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5Bc3Nlc3NtZW50VGVtcGxhdGVQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuQXNzZXNzbWVudFRlbXBsYXRlUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQXNzZXNzbWVudFRlbXBsYXRlUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhc3Nlc3NtZW50VGFyZ2V0QXJuJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmFzc2Vzc21lbnRUYXJnZXRBcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Fzc2Vzc21lbnRUYXJnZXRBcm4nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYXNzZXNzbWVudFRhcmdldEFybikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXNzZXNzbWVudFRlbXBsYXRlTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5hc3Nlc3NtZW50VGVtcGxhdGVOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkdXJhdGlvbkluU2Vjb25kcycsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5kdXJhdGlvbkluU2Vjb25kcykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZHVyYXRpb25JblNlY29uZHMnLCBjZGsudmFsaWRhdGVOdW1iZXIpKHByb3BlcnRpZXMuZHVyYXRpb25JblNlY29uZHMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3J1bGVzUGFja2FnZUFybnMnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMucnVsZXNQYWNrYWdlQXJucykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncnVsZXNQYWNrYWdlQXJucycsIGNkay5saXN0VmFsaWRhdG9yKGNkay52YWxpZGF0ZVN0cmluZykpKHByb3BlcnRpZXMucnVsZXNQYWNrYWdlQXJucykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndXNlckF0dHJpYnV0ZXNGb3JGaW5kaW5ncycsIGNkay5saXN0VmFsaWRhdG9yKGNkay52YWxpZGF0ZUNmblRhZykpKHByb3BlcnRpZXMudXNlckF0dHJpYnV0ZXNGb3JGaW5kaW5ncykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5Bc3Nlc3NtZW50VGVtcGxhdGVQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6SW5zcGVjdG9yOjpBc3Nlc3NtZW50VGVtcGxhdGVgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkFzc2Vzc21lbnRUZW1wbGF0ZVByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpJbnNwZWN0b3I6OkFzc2Vzc21lbnRUZW1wbGF0ZWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5Bc3Nlc3NtZW50VGVtcGxhdGVQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQXNzZXNzbWVudFRlbXBsYXRlUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIEFzc2Vzc21lbnRUYXJnZXRBcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYXNzZXNzbWVudFRhcmdldEFybiksXG4gICAgICAgIER1cmF0aW9uSW5TZWNvbmRzOiBjZGsubnVtYmVyVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmR1cmF0aW9uSW5TZWNvbmRzKSxcbiAgICAgICAgUnVsZXNQYWNrYWdlQXJuczogY2RrLmxpc3RNYXBwZXIoY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMucnVsZXNQYWNrYWdlQXJucyksXG4gICAgICAgIEFzc2Vzc21lbnRUZW1wbGF0ZU5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYXNzZXNzbWVudFRlbXBsYXRlTmFtZSksXG4gICAgICAgIFVzZXJBdHRyaWJ1dGVzRm9yRmluZGluZ3M6IGNkay5saXN0TWFwcGVyKGNkay5jZm5UYWdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLnVzZXJBdHRyaWJ1dGVzRm9yRmluZGluZ3MpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5Bc3Nlc3NtZW50VGVtcGxhdGVQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkFzc2Vzc21lbnRUZW1wbGF0ZVByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5Bc3Nlc3NtZW50VGVtcGxhdGVQcm9wcz4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2Fzc2Vzc21lbnRUYXJnZXRBcm4nLCAnQXNzZXNzbWVudFRhcmdldEFybicsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuQXNzZXNzbWVudFRhcmdldEFybikpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZHVyYXRpb25JblNlY29uZHMnLCAnRHVyYXRpb25JblNlY29uZHMnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldE51bWJlcihwcm9wZXJ0aWVzLkR1cmF0aW9uSW5TZWNvbmRzKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdydWxlc1BhY2thZ2VBcm5zJywgJ1J1bGVzUGFja2FnZUFybnMnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZ0FycmF5KHByb3BlcnRpZXMuUnVsZXNQYWNrYWdlQXJucykpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnYXNzZXNzbWVudFRlbXBsYXRlTmFtZScsICdBc3Nlc3NtZW50VGVtcGxhdGVOYW1lJywgcHJvcGVydGllcy5Bc3Nlc3NtZW50VGVtcGxhdGVOYW1lICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkFzc2Vzc21lbnRUZW1wbGF0ZU5hbWUpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3VzZXJBdHRyaWJ1dGVzRm9yRmluZGluZ3MnLCAnVXNlckF0dHJpYnV0ZXNGb3JGaW5kaW5ncycsIHByb3BlcnRpZXMuVXNlckF0dHJpYnV0ZXNGb3JGaW5kaW5ncyAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldENmblRhZykocHJvcGVydGllcy5Vc2VyQXR0cmlidXRlc0ZvckZpbmRpbmdzKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpJbnNwZWN0b3I6OkFzc2Vzc21lbnRUZW1wbGF0ZWBcbiAqXG4gKiBUaGUgYEFXUzo6SW5zcGVjdG9yOjpBc3Nlc3NtZW50VGVtcGxhdGVgIHJlc291cmNlIGNyZWF0ZXMgYW4gQW1hem9uIEluc3BlY3RvciBhc3Nlc3NtZW50IHRlbXBsYXRlLCB3aGljaCBzcGVjaWZpZXMgdGhlIEluc3BlY3RvciBhc3Nlc3NtZW50IHRhcmdldHMgdGhhdCB3aWxsIGJlIGV2YWx1YXRlZCBieSBhbiBhc3Nlc3NtZW50IHJ1biBhbmQgaXRzIHJlbGF0ZWQgY29uZmlndXJhdGlvbnMuXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpJbnNwZWN0b3I6OkFzc2Vzc21lbnRUZW1wbGF0ZVxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWluc3BlY3Rvci1hc3Nlc3NtZW50dGVtcGxhdGUuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuQXNzZXNzbWVudFRlbXBsYXRlIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6SW5zcGVjdG9yOjpBc3Nlc3NtZW50VGVtcGxhdGVcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5Bc3Nlc3NtZW50VGVtcGxhdGUge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmbkFzc2Vzc21lbnRUZW1wbGF0ZVByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHJlc291cmNlUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBDZm5Bc3Nlc3NtZW50VGVtcGxhdGUoc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIHRoYXQgc3BlY2lmaWVzIHRoZSBhc3Nlc3NtZW50IHRlbXBsYXRlIHRoYXQgaXMgY3JlYXRlZC5cbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgQXJuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBBUk4gb2YgdGhlIGFzc2Vzc21lbnQgdGFyZ2V0IHRvIGJlIGluY2x1ZGVkIGluIHRoZSBhc3Nlc3NtZW50IHRlbXBsYXRlLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtaW5zcGVjdG9yLWFzc2Vzc21lbnR0ZW1wbGF0ZS5odG1sI2Nmbi1pbnNwZWN0b3ItYXNzZXNzbWVudHRlbXBsYXRlLWFzc2Vzc21lbnR0YXJnZXRhcm5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXNzZXNzbWVudFRhcmdldEFybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGR1cmF0aW9uIG9mIHRoZSBhc3Nlc3NtZW50IHJ1biBpbiBzZWNvbmRzLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtaW5zcGVjdG9yLWFzc2Vzc21lbnR0ZW1wbGF0ZS5odG1sI2Nmbi1pbnNwZWN0b3ItYXNzZXNzbWVudHRlbXBsYXRlLWR1cmF0aW9uaW5zZWNvbmRzXG4gICAgICovXG4gICAgcHVibGljIGR1cmF0aW9uSW5TZWNvbmRzOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQVJOcyBvZiB0aGUgcnVsZXMgcGFja2FnZXMgdGhhdCB5b3Ugd2FudCB0byB1c2UgaW4gdGhlIGFzc2Vzc21lbnQgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1pbnNwZWN0b3ItYXNzZXNzbWVudHRlbXBsYXRlLmh0bWwjY2ZuLWluc3BlY3Rvci1hc3Nlc3NtZW50dGVtcGxhdGUtcnVsZXNwYWNrYWdlYXJuc1xuICAgICAqL1xuICAgIHB1YmxpYyBydWxlc1BhY2thZ2VBcm5zOiBzdHJpbmdbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSB1c2VyLWRlZmluZWQgbmFtZSB0aGF0IGlkZW50aWZpZXMgdGhlIGFzc2Vzc21lbnQgdGVtcGxhdGUgdGhhdCB5b3Ugd2FudCB0byBjcmVhdGUuIFlvdSBjYW4gY3JlYXRlIHNldmVyYWwgYXNzZXNzbWVudCB0ZW1wbGF0ZXMgZm9yIHRoZSBzYW1lIGFzc2Vzc21lbnQgdGFyZ2V0LiBUaGUgbmFtZXMgb2YgdGhlIGFzc2Vzc21lbnQgdGVtcGxhdGVzIHRoYXQgY29ycmVzcG9uZCB0byBhIHBhcnRpY3VsYXIgYXNzZXNzbWVudCB0YXJnZXQgbXVzdCBiZSB1bmlxdWUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1pbnNwZWN0b3ItYXNzZXNzbWVudHRlbXBsYXRlLmh0bWwjY2ZuLWluc3BlY3Rvci1hc3Nlc3NtZW50dGVtcGxhdGUtYXNzZXNzbWVudHRlbXBsYXRlbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBhc3Nlc3NtZW50VGVtcGxhdGVOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdXNlci1kZWZpbmVkIGF0dHJpYnV0ZXMgdGhhdCBhcmUgYXNzaWduZWQgdG8gZXZlcnkgZmluZGluZyB0aGF0IGlzIGdlbmVyYXRlZCBieSB0aGUgYXNzZXNzbWVudCBydW4gdGhhdCB1c2VzIHRoaXMgYXNzZXNzbWVudCB0ZW1wbGF0ZS4gV2l0aGluIGFuIGFzc2Vzc21lbnQgdGVtcGxhdGUsIGVhY2gga2V5IG11c3QgYmUgdW5pcXVlLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtaW5zcGVjdG9yLWFzc2Vzc21lbnR0ZW1wbGF0ZS5odG1sI2Nmbi1pbnNwZWN0b3ItYXNzZXNzbWVudHRlbXBsYXRlLXVzZXJhdHRyaWJ1dGVzZm9yZmluZGluZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgdXNlckF0dHJpYnV0ZXNGb3JGaW5kaW5nczogQXJyYXk8Y2RrLkNmblRhZyB8IGNkay5JUmVzb2x2YWJsZT4gfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6SW5zcGVjdG9yOjpBc3Nlc3NtZW50VGVtcGxhdGVgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5Bc3Nlc3NtZW50VGVtcGxhdGVQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuQXNzZXNzbWVudFRlbXBsYXRlLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnYXNzZXNzbWVudFRhcmdldEFybicsIHRoaXMpO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnZHVyYXRpb25JblNlY29uZHMnLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ3J1bGVzUGFja2FnZUFybnMnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRyQXJuID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdBcm4nLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuXG4gICAgICAgIHRoaXMuYXNzZXNzbWVudFRhcmdldEFybiA9IHByb3BzLmFzc2Vzc21lbnRUYXJnZXRBcm47XG4gICAgICAgIHRoaXMuZHVyYXRpb25JblNlY29uZHMgPSBwcm9wcy5kdXJhdGlvbkluU2Vjb25kcztcbiAgICAgICAgdGhpcy5ydWxlc1BhY2thZ2VBcm5zID0gcHJvcHMucnVsZXNQYWNrYWdlQXJucztcbiAgICAgICAgdGhpcy5hc3Nlc3NtZW50VGVtcGxhdGVOYW1lID0gcHJvcHMuYXNzZXNzbWVudFRlbXBsYXRlTmFtZTtcbiAgICAgICAgdGhpcy51c2VyQXR0cmlidXRlc0ZvckZpbmRpbmdzID0gcHJvcHMudXNlckF0dHJpYnV0ZXNGb3JGaW5kaW5ncztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmbkFzc2Vzc21lbnRUZW1wbGF0ZS5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXNzZXNzbWVudFRhcmdldEFybjogdGhpcy5hc3Nlc3NtZW50VGFyZ2V0QXJuLFxuICAgICAgICAgICAgZHVyYXRpb25JblNlY29uZHM6IHRoaXMuZHVyYXRpb25JblNlY29uZHMsXG4gICAgICAgICAgICBydWxlc1BhY2thZ2VBcm5zOiB0aGlzLnJ1bGVzUGFja2FnZUFybnMsXG4gICAgICAgICAgICBhc3Nlc3NtZW50VGVtcGxhdGVOYW1lOiB0aGlzLmFzc2Vzc21lbnRUZW1wbGF0ZU5hbWUsXG4gICAgICAgICAgICB1c2VyQXR0cmlidXRlc0ZvckZpbmRpbmdzOiB0aGlzLnVzZXJBdHRyaWJ1dGVzRm9yRmluZGluZ3MsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuQXNzZXNzbWVudFRlbXBsYXRlUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuUmVzb3VyY2VHcm91cGBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtaW5zcGVjdG9yLXJlc291cmNlZ3JvdXAuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblJlc291cmNlR3JvdXBQcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdGFncyAoa2V5IGFuZCB2YWx1ZSBwYWlycykgdGhhdCB3aWxsIGJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgcmVzb3VyY2UgZ3JvdXAuXG4gICAgICpcbiAgICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtUYWddKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJlc291cmNlLXRhZ3MuaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtaW5zcGVjdG9yLXJlc291cmNlZ3JvdXAuaHRtbCNjZm4taW5zcGVjdG9yLXJlc291cmNlZ3JvdXAtcmVzb3VyY2Vncm91cHRhZ3NcbiAgICAgKi9cbiAgICByZWFkb25seSByZXNvdXJjZUdyb3VwVGFnczogQXJyYXk8Y2RrLkNmblRhZyB8IGNkay5JUmVzb2x2YWJsZT4gfCBjZGsuSVJlc29sdmFibGU7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuUmVzb3VyY2VHcm91cFByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5SZXNvdXJjZUdyb3VwUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuUmVzb3VyY2VHcm91cFByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVzb3VyY2VHcm91cFRhZ3MnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMucmVzb3VyY2VHcm91cFRhZ3MpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3Jlc291cmNlR3JvdXBUYWdzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlQ2ZuVGFnKSkocHJvcGVydGllcy5yZXNvdXJjZUdyb3VwVGFncykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5SZXNvdXJjZUdyb3VwUHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6Okluc3BlY3Rvcjo6UmVzb3VyY2VHcm91cGAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuUmVzb3VyY2VHcm91cFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpJbnNwZWN0b3I6OlJlc291cmNlR3JvdXBgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuUmVzb3VyY2VHcm91cFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5SZXNvdXJjZUdyb3VwUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIFJlc291cmNlR3JvdXBUYWdzOiBjZGsubGlzdE1hcHBlcihjZGsuY2ZuVGFnVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5yZXNvdXJjZUdyb3VwVGFncyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblJlc291cmNlR3JvdXBQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblJlc291cmNlR3JvdXBQcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuUmVzb3VyY2VHcm91cFByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncmVzb3VyY2VHcm91cFRhZ3MnLCAnUmVzb3VyY2VHcm91cFRhZ3MnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFycmF5KGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0Q2ZuVGFnKShwcm9wZXJ0aWVzLlJlc291cmNlR3JvdXBUYWdzKSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpJbnNwZWN0b3I6OlJlc291cmNlR3JvdXBgXG4gKlxuICogVGhlIGBBV1M6Okluc3BlY3Rvcjo6UmVzb3VyY2VHcm91cGAgcmVzb3VyY2UgaXMgdXNlZCB0byBjcmVhdGUgQW1hem9uIEluc3BlY3RvciByZXNvdXJjZSBncm91cHMuIEEgcmVzb3VyY2UgZ3JvdXAgZGVmaW5lcyBhIHNldCBvZiB0YWdzIHRoYXQsIHdoZW4gcXVlcmllZCwgaWRlbnRpZnkgdGhlIEFXUyByZXNvdXJjZXMgdGhhdCBtYWtlIHVwIHRoZSBhc3Nlc3NtZW50IHRhcmdldC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6Okluc3BlY3Rvcjo6UmVzb3VyY2VHcm91cFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWluc3BlY3Rvci1yZXNvdXJjZWdyb3VwLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmblJlc291cmNlR3JvdXAgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpJbnNwZWN0b3I6OlJlc291cmNlR3JvdXBcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5SZXNvdXJjZUdyb3VwIHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5SZXNvdXJjZUdyb3VwUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmblJlc291cmNlR3JvdXAoc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIHRoYXQgc3BlY2lmaWVzIHRoZSByZXNvdXJjZSBncm91cCB0aGF0IGlzIGNyZWF0ZWQuXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIEFyblxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdGFncyAoa2V5IGFuZCB2YWx1ZSBwYWlycykgdGhhdCB3aWxsIGJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgcmVzb3VyY2UgZ3JvdXAuXG4gICAgICpcbiAgICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtUYWddKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJlc291cmNlLXRhZ3MuaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtaW5zcGVjdG9yLXJlc291cmNlZ3JvdXAuaHRtbCNjZm4taW5zcGVjdG9yLXJlc291cmNlZ3JvdXAtcmVzb3VyY2Vncm91cHRhZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVzb3VyY2VHcm91cFRhZ3M6IEFycmF5PGNkay5DZm5UYWcgfCBjZGsuSVJlc29sdmFibGU+IHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6Okluc3BlY3Rvcjo6UmVzb3VyY2VHcm91cGAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmblJlc291cmNlR3JvdXBQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuUmVzb3VyY2VHcm91cC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ3Jlc291cmNlR3JvdXBUYWdzJywgdGhpcyk7XG4gICAgICAgIHRoaXMuYXR0ckFybiA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnQXJuJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcblxuICAgICAgICB0aGlzLnJlc291cmNlR3JvdXBUYWdzID0gcHJvcHMucmVzb3VyY2VHcm91cFRhZ3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5SZXNvdXJjZUdyb3VwLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNvdXJjZUdyb3VwVGFnczogdGhpcy5yZXNvdXJjZUdyb3VwVGFncyxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5SZXNvdXJjZUdyb3VwUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG4iXX0=