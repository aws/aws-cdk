"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnCampaign = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cfn_parse = require("@aws-cdk/core/lib/helpers-internal");
/**
 * Determine whether the given properties match those of a `CfnCampaignProps`
 *
 * @param properties - the TypeScript properties of a `CfnCampaignProps`
 *
 * @returns the result of the validation.
 */
function CfnCampaignPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('connectInstanceArn', cdk.requiredValidator)(properties.connectInstanceArn));
    errors.collect(cdk.propertyValidator('connectInstanceArn', cdk.validateString)(properties.connectInstanceArn));
    errors.collect(cdk.propertyValidator('dialerConfig', cdk.requiredValidator)(properties.dialerConfig));
    errors.collect(cdk.propertyValidator('dialerConfig', CfnCampaign_DialerConfigPropertyValidator)(properties.dialerConfig));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('outboundCallConfig', cdk.requiredValidator)(properties.outboundCallConfig));
    errors.collect(cdk.propertyValidator('outboundCallConfig', CfnCampaign_OutboundCallConfigPropertyValidator)(properties.outboundCallConfig));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnCampaignProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign` resource
 *
 * @param properties - the TypeScript properties of a `CfnCampaignProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign` resource.
 */
// @ts-ignore TS6133
function cfnCampaignPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnCampaignPropsValidator(properties).assertSuccess();
    return {
        ConnectInstanceArn: cdk.stringToCloudFormation(properties.connectInstanceArn),
        DialerConfig: cfnCampaignDialerConfigPropertyToCloudFormation(properties.dialerConfig),
        Name: cdk.stringToCloudFormation(properties.name),
        OutboundCallConfig: cfnCampaignOutboundCallConfigPropertyToCloudFormation(properties.outboundCallConfig),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnCampaignPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('connectInstanceArn', 'ConnectInstanceArn', cfn_parse.FromCloudFormation.getString(properties.ConnectInstanceArn));
    ret.addPropertyResult('dialerConfig', 'DialerConfig', CfnCampaignDialerConfigPropertyFromCloudFormation(properties.DialerConfig));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('outboundCallConfig', 'OutboundCallConfig', CfnCampaignOutboundCallConfigPropertyFromCloudFormation(properties.OutboundCallConfig));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::ConnectCampaigns::Campaign`
 *
 * Contains information about an outbound campaign.
 *
 * @cloudformationResource AWS::ConnectCampaigns::Campaign
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html
 */
class CfnCampaign extends cdk.CfnResource {
    /**
     * Create a new `AWS::ConnectCampaigns::Campaign`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnCampaign.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_connectcampaigns_CfnCampaignProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnCampaign);
            }
            throw error;
        }
        cdk.requireProperty(props, 'connectInstanceArn', this);
        cdk.requireProperty(props, 'dialerConfig', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'outboundCallConfig', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.connectInstanceArn = props.connectInstanceArn;
        this.dialerConfig = props.dialerConfig;
        this.name = props.name;
        this.outboundCallConfig = props.outboundCallConfig;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ConnectCampaigns::Campaign", props.tags, { tagPropertyName: 'tags' });
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
        const propsResult = CfnCampaignPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCampaign(scope, id, propsResult.value);
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCampaign.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            connectInstanceArn: this.connectInstanceArn,
            dialerConfig: this.dialerConfig,
            name: this.name,
            outboundCallConfig: this.outboundCallConfig,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        return cfnCampaignPropsToCloudFormation(props);
    }
}
exports.CfnCampaign = CfnCampaign;
_a = JSII_RTTI_SYMBOL_1;
CfnCampaign[_a] = { fqn: "@aws-cdk/aws-connectcampaigns.CfnCampaign", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnCampaign.CFN_RESOURCE_TYPE_NAME = "AWS::ConnectCampaigns::Campaign";
/**
 * Determine whether the given properties match those of a `DialerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DialerConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_DialerConfigPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('predictiveDialerConfig', CfnCampaign_PredictiveDialerConfigPropertyValidator)(properties.predictiveDialerConfig));
    errors.collect(cdk.propertyValidator('progressiveDialerConfig', CfnCampaign_ProgressiveDialerConfigPropertyValidator)(properties.progressiveDialerConfig));
    return errors.wrap('supplied properties not correct for "DialerConfigProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.DialerConfig` resource
 *
 * @param properties - the TypeScript properties of a `DialerConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.DialerConfig` resource.
 */
// @ts-ignore TS6133
function cfnCampaignDialerConfigPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnCampaign_DialerConfigPropertyValidator(properties).assertSuccess();
    return {
        PredictiveDialerConfig: cfnCampaignPredictiveDialerConfigPropertyToCloudFormation(properties.predictiveDialerConfig),
        ProgressiveDialerConfig: cfnCampaignProgressiveDialerConfigPropertyToCloudFormation(properties.progressiveDialerConfig),
    };
}
// @ts-ignore TS6133
function CfnCampaignDialerConfigPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('predictiveDialerConfig', 'PredictiveDialerConfig', properties.PredictiveDialerConfig != null ? CfnCampaignPredictiveDialerConfigPropertyFromCloudFormation(properties.PredictiveDialerConfig) : undefined);
    ret.addPropertyResult('progressiveDialerConfig', 'ProgressiveDialerConfig', properties.ProgressiveDialerConfig != null ? CfnCampaignProgressiveDialerConfigPropertyFromCloudFormation(properties.ProgressiveDialerConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `OutboundCallConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OutboundCallConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_OutboundCallConfigPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('connectContactFlowArn', cdk.requiredValidator)(properties.connectContactFlowArn));
    errors.collect(cdk.propertyValidator('connectContactFlowArn', cdk.validateString)(properties.connectContactFlowArn));
    errors.collect(cdk.propertyValidator('connectQueueArn', cdk.requiredValidator)(properties.connectQueueArn));
    errors.collect(cdk.propertyValidator('connectQueueArn', cdk.validateString)(properties.connectQueueArn));
    errors.collect(cdk.propertyValidator('connectSourcePhoneNumber', cdk.validateString)(properties.connectSourcePhoneNumber));
    return errors.wrap('supplied properties not correct for "OutboundCallConfigProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.OutboundCallConfig` resource
 *
 * @param properties - the TypeScript properties of a `OutboundCallConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.OutboundCallConfig` resource.
 */
// @ts-ignore TS6133
function cfnCampaignOutboundCallConfigPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnCampaign_OutboundCallConfigPropertyValidator(properties).assertSuccess();
    return {
        ConnectContactFlowArn: cdk.stringToCloudFormation(properties.connectContactFlowArn),
        ConnectQueueArn: cdk.stringToCloudFormation(properties.connectQueueArn),
        ConnectSourcePhoneNumber: cdk.stringToCloudFormation(properties.connectSourcePhoneNumber),
    };
}
// @ts-ignore TS6133
function CfnCampaignOutboundCallConfigPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('connectContactFlowArn', 'ConnectContactFlowArn', cfn_parse.FromCloudFormation.getString(properties.ConnectContactFlowArn));
    ret.addPropertyResult('connectQueueArn', 'ConnectQueueArn', cfn_parse.FromCloudFormation.getString(properties.ConnectQueueArn));
    ret.addPropertyResult('connectSourcePhoneNumber', 'ConnectSourcePhoneNumber', properties.ConnectSourcePhoneNumber != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectSourcePhoneNumber) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `PredictiveDialerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PredictiveDialerConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_PredictiveDialerConfigPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bandwidthAllocation', cdk.requiredValidator)(properties.bandwidthAllocation));
    errors.collect(cdk.propertyValidator('bandwidthAllocation', cdk.validateNumber)(properties.bandwidthAllocation));
    return errors.wrap('supplied properties not correct for "PredictiveDialerConfigProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.PredictiveDialerConfig` resource
 *
 * @param properties - the TypeScript properties of a `PredictiveDialerConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.PredictiveDialerConfig` resource.
 */
// @ts-ignore TS6133
function cfnCampaignPredictiveDialerConfigPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnCampaign_PredictiveDialerConfigPropertyValidator(properties).assertSuccess();
    return {
        BandwidthAllocation: cdk.numberToCloudFormation(properties.bandwidthAllocation),
    };
}
// @ts-ignore TS6133
function CfnCampaignPredictiveDialerConfigPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('bandwidthAllocation', 'BandwidthAllocation', cfn_parse.FromCloudFormation.getNumber(properties.BandwidthAllocation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `ProgressiveDialerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ProgressiveDialerConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_ProgressiveDialerConfigPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bandwidthAllocation', cdk.requiredValidator)(properties.bandwidthAllocation));
    errors.collect(cdk.propertyValidator('bandwidthAllocation', cdk.validateNumber)(properties.bandwidthAllocation));
    return errors.wrap('supplied properties not correct for "ProgressiveDialerConfigProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.ProgressiveDialerConfig` resource
 *
 * @param properties - the TypeScript properties of a `ProgressiveDialerConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ConnectCampaigns::Campaign.ProgressiveDialerConfig` resource.
 */
// @ts-ignore TS6133
function cfnCampaignProgressiveDialerConfigPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnCampaign_ProgressiveDialerConfigPropertyValidator(properties).assertSuccess();
    return {
        BandwidthAllocation: cdk.numberToCloudFormation(properties.bandwidthAllocation),
    };
}
// @ts-ignore TS6133
function CfnCampaignProgressiveDialerConfigPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('bandwidthAllocation', 'BandwidthAllocation', cfn_parse.FromCloudFormation.getNumber(properties.BandwidthAllocation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGNhbXBhaWducy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25uZWN0Y2FtcGFpZ25zLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFRQSxxQ0FBcUM7QUFDckMsZ0VBQWdFO0FBZ0RoRTs7Ozs7O0dBTUc7QUFDSCxTQUFTLHlCQUF5QixDQUFDLFVBQWU7SUFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztLQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7SUFDbEgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7SUFDL0csTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ3RHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFD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QyxVQUFVLENBQUMsQ0FBQztLQUM3RDtJQUNELE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLGdDQUFnQyxFQUErQyxDQUFDO0lBQzFHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxxQkFBcUIsRUFBRSxxQkFBcUIsRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7SUFDNUksR0FBRyxDQUFDLGdDQUFnQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8vIEdlbmVyYXRlZCBmcm9tIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gUmVzb3VyY2UgU3BlY2lmaWNhdGlvblxuLy8gU2VlOiBkb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvY2ZuLXJlc291cmNlLXNwZWNpZmljYXRpb24uaHRtbFxuLy8gQGNmbjJ0czptZXRhQCB7XCJnZW5lcmF0ZWRcIjpcIjIwMjMtMDEtMjJUMTA6MTQ6MzQuODkyWlwiLFwiZmluZ2VycHJpbnRcIjpcImkxcHBXNXRXUStNUzZPTkowQ1czWkNiZXpUMG1obnBXeFhYQjFJc0t2TVU9XCJ9XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuaW1wb3J0ICogYXMgY29uc3RydWN0cyBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNmbl9wYXJzZSBmcm9tICdAYXdzLWNkay9jb3JlL2xpYi9oZWxwZXJzLWludGVybmFsJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5DYW1wYWlnbmBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtY29ubmVjdGNhbXBhaWducy1jYW1wYWlnbi5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQ2FtcGFpZ25Qcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIEFtYXpvbiBDb25uZWN0IGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtY29ubmVjdGNhbXBhaWducy1jYW1wYWlnbi5odG1sI2Nmbi1jb25uZWN0Y2FtcGFpZ25zLWNhbXBhaWduLWNvbm5lY3RpbnN0YW5jZWFyblxuICAgICAqL1xuICAgIHJlYWRvbmx5IGNvbm5lY3RJbnN0YW5jZUFybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQ29udGFpbnMgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGRpYWxlciBjb25maWd1cmF0aW9uLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtY29ubmVjdGNhbXBhaWducy1jYW1wYWlnbi5odG1sI2Nmbi1jb25uZWN0Y2FtcGFpZ25zLWNhbXBhaWduLWRpYWxlcmNvbmZpZ1xuICAgICAqL1xuICAgIHJlYWRvbmx5IGRpYWxlckNvbmZpZzogQ2ZuQ2FtcGFpZ24uRGlhbGVyQ29uZmlnUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgY2FtcGFpZ24uXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1jb25uZWN0Y2FtcGFpZ25zLWNhbXBhaWduLmh0bWwjY2ZuLWNvbm5lY3RjYW1wYWlnbnMtY2FtcGFpZ24tbmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIENvbnRhaW5zIGluZm9ybWF0aW9uIGFib3V0IHRoZSBvdXRib3VuZCBjYWxsIGNvbmZpZ3VyYXRpb24uXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1jb25uZWN0Y2FtcGFpZ25zLWNhbXBhaWduLmh0bWwjY2ZuLWNvbm5lY3RjYW1wYWlnbnMtY2FtcGFpZ24tb3V0Ym91bmRjYWxsY29uZmlnXG4gICAgICovXG4gICAgcmVhZG9ubHkgb3V0Ym91bmRDYWxsQ29uZmlnOiBDZm5DYW1wYWlnbi5PdXRib3VuZENhbGxDb25maWdQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSB0YWdzIHVzZWQgdG8gb3JnYW5pemUsIHRyYWNrLCBvciBjb250cm9sIGFjY2VzcyBmb3IgdGhpcyByZXNvdXJjZS4gRm9yIGV4YW1wbGUsIHsgXCJ0YWdzXCI6IHtcImtleTFcIjpcInZhbHVlMVwiLCBcImtleTJcIjpcInZhbHVlMlwifSB9LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtY29ubmVjdGNhbXBhaWducy1jYW1wYWlnbi5odG1sI2Nmbi1jb25uZWN0Y2FtcGFpZ25zLWNhbXBhaWduLXRhZ3NcbiAgICAgKi9cbiAgICByZWFkb25seSB0YWdzPzogY2RrLkNmblRhZ1tdO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkNhbXBhaWduUHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkNhbXBhaWduUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQ2FtcGFpZ25Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Nvbm5lY3RJbnN0YW5jZUFybicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5jb25uZWN0SW5zdGFuY2VBcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Nvbm5lY3RJbnN0YW5jZUFybicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5jb25uZWN0SW5zdGFuY2VBcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RpYWxlckNvbmZpZycsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5kaWFsZXJDb25maWcpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RpYWxlckNvbmZpZycsIENmbkNhbXBhaWduX0RpYWxlckNvbmZpZ1Byb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLmRpYWxlckNvbmZpZykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5uYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCduYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLm5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ291dGJvdW5kQ2FsbENvbmZpZycsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5vdXRib3VuZENhbGxDb25maWcpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ291dGJvdW5kQ2FsbENvbmZpZycsIENmbkNhbXBhaWduX091dGJvdW5kQ2FsbENvbmZpZ1Byb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLm91dGJvdW5kQ2FsbENvbmZpZykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGFncycsIGNkay5saXN0VmFsaWRhdG9yKGNkay52YWxpZGF0ZUNmblRhZykpKHByb3BlcnRpZXMudGFncykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5DYW1wYWlnblByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpDb25uZWN0Q2FtcGFpZ25zOjpDYW1wYWlnbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuQ2FtcGFpZ25Qcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6Q29ubmVjdENhbXBhaWduczo6Q2FtcGFpZ25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQ2FtcGFpZ25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQ2FtcGFpZ25Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgQ29ubmVjdEluc3RhbmNlQXJuOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmNvbm5lY3RJbnN0YW5jZUFybiksXG4gICAgICAgIERpYWxlckNvbmZpZzogY2ZuQ2FtcGFpZ25EaWFsZXJDb25maWdQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kaWFsZXJDb25maWcpLFxuICAgICAgICBOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLm5hbWUpLFxuICAgICAgICBPdXRib3VuZENhbGxDb25maWc6IGNmbkNhbXBhaWduT3V0Ym91bmRDYWxsQ29uZmlnUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMub3V0Ym91bmRDYWxsQ29uZmlnKSxcbiAgICAgICAgVGFnczogY2RrLmxpc3RNYXBwZXIoY2RrLmNmblRhZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMudGFncyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkNhbXBhaWduUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5DYW1wYWlnblByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5DYW1wYWlnblByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnY29ubmVjdEluc3RhbmNlQXJuJywgJ0Nvbm5lY3RJbnN0YW5jZUFybicsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuQ29ubmVjdEluc3RhbmNlQXJuKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdkaWFsZXJDb25maWcnLCAnRGlhbGVyQ29uZmlnJywgQ2ZuQ2FtcGFpZ25EaWFsZXJDb25maWdQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLkRpYWxlckNvbmZpZykpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbmFtZScsICdOYW1lJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5OYW1lKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdvdXRib3VuZENhbGxDb25maWcnLCAnT3V0Ym91bmRDYWxsQ29uZmlnJywgQ2ZuQ2FtcGFpZ25PdXRib3VuZENhbGxDb25maWdQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLk91dGJvdW5kQ2FsbENvbmZpZykpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndGFncycsICdUYWdzJywgcHJvcGVydGllcy5UYWdzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFycmF5KGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0Q2ZuVGFnKShwcm9wZXJ0aWVzLlRhZ3MpIDogdW5kZWZpbmVkIGFzIGFueSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpDb25uZWN0Q2FtcGFpZ25zOjpDYW1wYWlnbmBcbiAqXG4gKiBDb250YWlucyBpbmZvcm1hdGlvbiBhYm91dCBhbiBvdXRib3VuZCBjYW1wYWlnbi5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OkNvbm5lY3RDYW1wYWlnbnM6OkNhbXBhaWduXG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtY29ubmVjdGNhbXBhaWducy1jYW1wYWlnbi5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5DYW1wYWlnbiBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OkNvbm5lY3RDYW1wYWlnbnM6OkNhbXBhaWduXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuQ2FtcGFpZ24ge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmbkNhbXBhaWduUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbkNhbXBhaWduKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgaGlnaC12b2x1bWUgb3V0Ym91bmQgY2FtcGFpZ24uXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIEFyblxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIEFtYXpvbiBDb25uZWN0IGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtY29ubmVjdGNhbXBhaWducy1jYW1wYWlnbi5odG1sI2Nmbi1jb25uZWN0Y2FtcGFpZ25zLWNhbXBhaWduLWNvbm5lY3RpbnN0YW5jZWFyblxuICAgICAqL1xuICAgIHB1YmxpYyBjb25uZWN0SW5zdGFuY2VBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIENvbnRhaW5zIGluZm9ybWF0aW9uIGFib3V0IHRoZSBkaWFsZXIgY29uZmlndXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWNvbm5lY3RjYW1wYWlnbnMtY2FtcGFpZ24uaHRtbCNjZm4tY29ubmVjdGNhbXBhaWducy1jYW1wYWlnbi1kaWFsZXJjb25maWdcbiAgICAgKi9cbiAgICBwdWJsaWMgZGlhbGVyQ29uZmlnOiBDZm5DYW1wYWlnbi5EaWFsZXJDb25maWdQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBjYW1wYWlnbi5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWNvbm5lY3RjYW1wYWlnbnMtY2FtcGFpZ24uaHRtbCNjZm4tY29ubmVjdGNhbXBhaWducy1jYW1wYWlnbi1uYW1lXG4gICAgICovXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIENvbnRhaW5zIGluZm9ybWF0aW9uIGFib3V0IHRoZSBvdXRib3VuZCBjYWxsIGNvbmZpZ3VyYXRpb24uXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1jb25uZWN0Y2FtcGFpZ25zLWNhbXBhaWduLmh0bWwjY2ZuLWNvbm5lY3RjYW1wYWlnbnMtY2FtcGFpZ24tb3V0Ym91bmRjYWxsY29uZmlnXG4gICAgICovXG4gICAgcHVibGljIG91dGJvdW5kQ2FsbENvbmZpZzogQ2ZuQ2FtcGFpZ24uT3V0Ym91bmRDYWxsQ29uZmlnUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdGFncyB1c2VkIHRvIG9yZ2FuaXplLCB0cmFjaywgb3IgY29udHJvbCBhY2Nlc3MgZm9yIHRoaXMgcmVzb3VyY2UuIEZvciBleGFtcGxlLCB7IFwidGFnc1wiOiB7XCJrZXkxXCI6XCJ2YWx1ZTFcIiwgXCJrZXkyXCI6XCJ2YWx1ZTJcIn0gfS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWNvbm5lY3RjYW1wYWlnbnMtY2FtcGFpZ24uaHRtbCNjZm4tY29ubmVjdGNhbXBhaWducy1jYW1wYWlnbi10YWdzXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHRhZ3M6IGNkay5UYWdNYW5hZ2VyO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OkNvbm5lY3RDYW1wYWlnbnM6OkNhbXBhaWduYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuQ2FtcGFpZ25Qcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuQ2FtcGFpZ24uQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdjb25uZWN0SW5zdGFuY2VBcm4nLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2RpYWxlckNvbmZpZycsIHRoaXMpO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnbmFtZScsIHRoaXMpO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnb3V0Ym91bmRDYWxsQ29uZmlnJywgdGhpcyk7XG4gICAgICAgIHRoaXMuYXR0ckFybiA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnQXJuJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcblxuICAgICAgICB0aGlzLmNvbm5lY3RJbnN0YW5jZUFybiA9IHByb3BzLmNvbm5lY3RJbnN0YW5jZUFybjtcbiAgICAgICAgdGhpcy5kaWFsZXJDb25maWcgPSBwcm9wcy5kaWFsZXJDb25maWc7XG4gICAgICAgIHRoaXMubmFtZSA9IHByb3BzLm5hbWU7XG4gICAgICAgIHRoaXMub3V0Ym91bmRDYWxsQ29uZmlnID0gcHJvcHMub3V0Ym91bmRDYWxsQ29uZmlnO1xuICAgICAgICB0aGlzLnRhZ3MgPSBuZXcgY2RrLlRhZ01hbmFnZXIoY2RrLlRhZ1R5cGUuU1RBTkRBUkQsIFwiQVdTOjpDb25uZWN0Q2FtcGFpZ25zOjpDYW1wYWlnblwiLCBwcm9wcy50YWdzLCB7IHRhZ1Byb3BlcnR5TmFtZTogJ3RhZ3MnIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuQ2FtcGFpZ24uQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbm5lY3RJbnN0YW5jZUFybjogdGhpcy5jb25uZWN0SW5zdGFuY2VBcm4sXG4gICAgICAgICAgICBkaWFsZXJDb25maWc6IHRoaXMuZGlhbGVyQ29uZmlnLFxuICAgICAgICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgICAgICAgb3V0Ym91bmRDYWxsQ29uZmlnOiB0aGlzLm91dGJvdW5kQ2FsbENvbmZpZyxcbiAgICAgICAgICAgIHRhZ3M6IHRoaXMudGFncy5yZW5kZXJUYWdzKCksXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuQ2FtcGFpZ25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5DYW1wYWlnbiB7XG4gICAgLyoqXG4gICAgICogQ29udGFpbnMgZGlhbGVyIGNvbmZpZ3VyYXRpb24gZm9yIGFuIG91dGJvdW5kIGNhbXBhaWduLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtY29ubmVjdGNhbXBhaWducy1jYW1wYWlnbi1kaWFsZXJjb25maWcuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGlhbGVyQ29uZmlnUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHByZWRpY3RpdmUgZGlhbGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWNvbm5lY3RjYW1wYWlnbnMtY2FtcGFpZ24tZGlhbGVyY29uZmlnLmh0bWwjY2ZuLWNvbm5lY3RjYW1wYWlnbnMtY2FtcGFpZ24tZGlhbGVyY29uZmlnLXByZWRpY3RpdmVkaWFsZXJjb25maWdcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHByZWRpY3RpdmVEaWFsZXJDb25maWc/OiBDZm5DYW1wYWlnbi5QcmVkaWN0aXZlRGlhbGVyQ29uZmlnUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgY29uZmlndXJhdGlvbiBvZiB0aGUgcHJvZ3Jlc3NpdmUgZGlhbGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWNvbm5lY3RjYW1wYWlnbnMtY2FtcGFpZ24tZGlhbGVyY29uZmlnLmh0bWwjY2ZuLWNvbm5lY3RjYW1wYWlnbnMtY2FtcGFpZ24tZGlhbGVyY29uZmlnLXByb2dyZXNzaXZlZGlhbGVyY29uZmlnXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBwcm9ncmVzc2l2ZURpYWxlckNvbmZpZz86IENmbkNhbXBhaWduLlByb2dyZXNzaXZlRGlhbGVyQ29uZmlnUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYERpYWxlckNvbmZpZ1Byb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBEaWFsZXJDb25maWdQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5DYW1wYWlnbl9EaWFsZXJDb25maWdQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ByZWRpY3RpdmVEaWFsZXJDb25maWcnLCBDZm5DYW1wYWlnbl9QcmVkaWN0aXZlRGlhbGVyQ29uZmlnUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMucHJlZGljdGl2ZURpYWxlckNvbmZpZykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncHJvZ3Jlc3NpdmVEaWFsZXJDb25maWcnLCBDZm5DYW1wYWlnbl9Qcm9ncmVzc2l2ZURpYWxlckNvbmZpZ1Byb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLnByb2dyZXNzaXZlRGlhbGVyQ29uZmlnKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkRpYWxlckNvbmZpZ1Byb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpDb25uZWN0Q2FtcGFpZ25zOjpDYW1wYWlnbi5EaWFsZXJDb25maWdgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYERpYWxlckNvbmZpZ1Byb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpDb25uZWN0Q2FtcGFpZ25zOjpDYW1wYWlnbi5EaWFsZXJDb25maWdgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQ2FtcGFpZ25EaWFsZXJDb25maWdQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQ2FtcGFpZ25fRGlhbGVyQ29uZmlnUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIFByZWRpY3RpdmVEaWFsZXJDb25maWc6IGNmbkNhbXBhaWduUHJlZGljdGl2ZURpYWxlckNvbmZpZ1Byb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnByZWRpY3RpdmVEaWFsZXJDb25maWcpLFxuICAgICAgICBQcm9ncmVzc2l2ZURpYWxlckNvbmZpZzogY2ZuQ2FtcGFpZ25Qcm9ncmVzc2l2ZURpYWxlckNvbmZpZ1Byb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnByb2dyZXNzaXZlRGlhbGVyQ29uZmlnKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuQ2FtcGFpZ25EaWFsZXJDb25maWdQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkNhbXBhaWduLkRpYWxlckNvbmZpZ1Byb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB7XG4gICAgaWYgKGNkay5pc1Jlc29sdmFibGVPYmplY3QocHJvcGVydGllcykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmbkNhbXBhaWduLkRpYWxlckNvbmZpZ1Byb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncHJlZGljdGl2ZURpYWxlckNvbmZpZycsICdQcmVkaWN0aXZlRGlhbGVyQ29uZmlnJywgcHJvcGVydGllcy5QcmVkaWN0aXZlRGlhbGVyQ29uZmlnICE9IG51bGwgPyBDZm5DYW1wYWlnblByZWRpY3RpdmVEaWFsZXJDb25maWdQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLlByZWRpY3RpdmVEaWFsZXJDb25maWcpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3Byb2dyZXNzaXZlRGlhbGVyQ29uZmlnJywgJ1Byb2dyZXNzaXZlRGlhbGVyQ29uZmlnJywgcHJvcGVydGllcy5Qcm9ncmVzc2l2ZURpYWxlckNvbmZpZyAhPSBudWxsID8gQ2ZuQ2FtcGFpZ25Qcm9ncmVzc2l2ZURpYWxlckNvbmZpZ1Byb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuUHJvZ3Jlc3NpdmVEaWFsZXJDb25maWcpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5DYW1wYWlnbiB7XG4gICAgLyoqXG4gICAgICogQ29udGFpbnMgb3V0Ym91bmQgY2FsbCBjb25maWd1cmF0aW9uIGZvciBhbiBvdXRib3VuZCBjYW1wYWlnbi5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWNvbm5lY3RjYW1wYWlnbnMtY2FtcGFpZ24tb3V0Ym91bmRjYWxsY29uZmlnLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIE91dGJvdW5kQ2FsbENvbmZpZ1Byb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgZmxvdy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1jb25uZWN0Y2FtcGFpZ25zLWNhbXBhaWduLW91dGJvdW5kY2FsbGNvbmZpZy5odG1sI2Nmbi1jb25uZWN0Y2FtcGFpZ25zLWNhbXBhaWduLW91dGJvdW5kY2FsbGNvbmZpZy1jb25uZWN0Y29udGFjdGZsb3dhcm5cbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGNvbm5lY3RDb250YWN0Rmxvd0Fybjogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBxdWV1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1jb25uZWN0Y2FtcGFpZ25zLWNhbXBhaWduLW91dGJvdW5kY2FsbGNvbmZpZy5odG1sI2Nmbi1jb25uZWN0Y2FtcGFpZ25zLWNhbXBhaWduLW91dGJvdW5kY2FsbGNvbmZpZy1jb25uZWN0cXVldWVhcm5cbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGNvbm5lY3RRdWV1ZUFybjogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHBob25lIG51bWJlciBhc3NvY2lhdGVkIHdpdGggdGhlIG91dGJvdW5kIGNhbGwuIFRoaXMgaXMgdGhlIGNhbGxlciBJRCB0aGF0IGlzIGRpc3BsYXllZCB0byBjdXN0b21lcnMgd2hlbiBhbiBhZ2VudCBjYWxscyB0aGVtLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWNvbm5lY3RjYW1wYWlnbnMtY2FtcGFpZ24tb3V0Ym91bmRjYWxsY29uZmlnLmh0bWwjY2ZuLWNvbm5lY3RjYW1wYWlnbnMtY2FtcGFpZ24tb3V0Ym91bmRjYWxsY29uZmlnLWNvbm5lY3Rzb3VyY2VwaG9uZW51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgY29ubmVjdFNvdXJjZVBob25lTnVtYmVyPzogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBPdXRib3VuZENhbGxDb25maWdQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgT3V0Ym91bmRDYWxsQ29uZmlnUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQ2FtcGFpZ25fT3V0Ym91bmRDYWxsQ29uZmlnUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjb25uZWN0Q29udGFjdEZsb3dBcm4nLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuY29ubmVjdENvbnRhY3RGbG93QXJuKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjb25uZWN0Q29udGFjdEZsb3dBcm4nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuY29ubmVjdENvbnRhY3RGbG93QXJuKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjb25uZWN0UXVldWVBcm4nLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuY29ubmVjdFF1ZXVlQXJuKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjb25uZWN0UXVldWVBcm4nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuY29ubmVjdFF1ZXVlQXJuKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjb25uZWN0U291cmNlUGhvbmVOdW1iZXInLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuY29ubmVjdFNvdXJjZVBob25lTnVtYmVyKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIk91dGJvdW5kQ2FsbENvbmZpZ1Byb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpDb25uZWN0Q2FtcGFpZ25zOjpDYW1wYWlnbi5PdXRib3VuZENhbGxDb25maWdgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYE91dGJvdW5kQ2FsbENvbmZpZ1Byb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpDb25uZWN0Q2FtcGFpZ25zOjpDYW1wYWlnbi5PdXRib3VuZENhbGxDb25maWdgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQ2FtcGFpZ25PdXRib3VuZENhbGxDb25maWdQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQ2FtcGFpZ25fT3V0Ym91bmRDYWxsQ29uZmlnUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIENvbm5lY3RDb250YWN0Rmxvd0FybjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5jb25uZWN0Q29udGFjdEZsb3dBcm4pLFxuICAgICAgICBDb25uZWN0UXVldWVBcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuY29ubmVjdFF1ZXVlQXJuKSxcbiAgICAgICAgQ29ubmVjdFNvdXJjZVBob25lTnVtYmVyOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmNvbm5lY3RTb3VyY2VQaG9uZU51bWJlciksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkNhbXBhaWduT3V0Ym91bmRDYWxsQ29uZmlnUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5DYW1wYWlnbi5PdXRib3VuZENhbGxDb25maWdQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5DYW1wYWlnbi5PdXRib3VuZENhbGxDb25maWdQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2Nvbm5lY3RDb250YWN0Rmxvd0FybicsICdDb25uZWN0Q29udGFjdEZsb3dBcm4nLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkNvbm5lY3RDb250YWN0Rmxvd0FybikpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnY29ubmVjdFF1ZXVlQXJuJywgJ0Nvbm5lY3RRdWV1ZUFybicsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuQ29ubmVjdFF1ZXVlQXJuKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdjb25uZWN0U291cmNlUGhvbmVOdW1iZXInLCAnQ29ubmVjdFNvdXJjZVBob25lTnVtYmVyJywgcHJvcGVydGllcy5Db25uZWN0U291cmNlUGhvbmVOdW1iZXIgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuQ29ubmVjdFNvdXJjZVBob25lTnVtYmVyKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuQ2FtcGFpZ24ge1xuICAgIC8qKlxuICAgICAqIENvbnRhaW5zIHByZWRpY3RpdmUgZGlhbGVyIGNvbmZpZ3VyYXRpb24gZm9yIGFuIG91dGJvdW5kIGNhbXBhaWduLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtY29ubmVjdGNhbXBhaWducy1jYW1wYWlnbi1wcmVkaWN0aXZlZGlhbGVyY29uZmlnLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIFByZWRpY3RpdmVEaWFsZXJDb25maWdQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCYW5kd2lkdGggYWxsb2NhdGlvbiBmb3IgdGhlIHByZWRpY3RpdmUgZGlhbGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWNvbm5lY3RjYW1wYWlnbnMtY2FtcGFpZ24tcHJlZGljdGl2ZWRpYWxlcmNvbmZpZy5odG1sI2Nmbi1jb25uZWN0Y2FtcGFpZ25zLWNhbXBhaWduLXByZWRpY3RpdmVkaWFsZXJjb25maWctYmFuZHdpZHRoYWxsb2NhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgYmFuZHdpZHRoQWxsb2NhdGlvbjogbnVtYmVyO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBQcmVkaWN0aXZlRGlhbGVyQ29uZmlnUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFByZWRpY3RpdmVEaWFsZXJDb25maWdQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5DYW1wYWlnbl9QcmVkaWN0aXZlRGlhbGVyQ29uZmlnUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdiYW5kd2lkdGhBbGxvY2F0aW9uJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmJhbmR3aWR0aEFsbG9jYXRpb24pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2JhbmR3aWR0aEFsbG9jYXRpb24nLCBjZGsudmFsaWRhdGVOdW1iZXIpKHByb3BlcnRpZXMuYmFuZHdpZHRoQWxsb2NhdGlvbikpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJQcmVkaWN0aXZlRGlhbGVyQ29uZmlnUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkNvbm5lY3RDYW1wYWlnbnM6OkNhbXBhaWduLlByZWRpY3RpdmVEaWFsZXJDb25maWdgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFByZWRpY3RpdmVEaWFsZXJDb25maWdQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6Q29ubmVjdENhbXBhaWduczo6Q2FtcGFpZ24uUHJlZGljdGl2ZURpYWxlckNvbmZpZ2AgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5DYW1wYWlnblByZWRpY3RpdmVEaWFsZXJDb25maWdQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQ2FtcGFpZ25fUHJlZGljdGl2ZURpYWxlckNvbmZpZ1Byb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBCYW5kd2lkdGhBbGxvY2F0aW9uOiBjZGsubnVtYmVyVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmJhbmR3aWR0aEFsbG9jYXRpb24pLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5DYW1wYWlnblByZWRpY3RpdmVEaWFsZXJDb25maWdQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkNhbXBhaWduLlByZWRpY3RpdmVEaWFsZXJDb25maWdQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5DYW1wYWlnbi5QcmVkaWN0aXZlRGlhbGVyQ29uZmlnUHJvcGVydHk+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdiYW5kd2lkdGhBbGxvY2F0aW9uJywgJ0JhbmR3aWR0aEFsbG9jYXRpb24nLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldE51bWJlcihwcm9wZXJ0aWVzLkJhbmR3aWR0aEFsbG9jYXRpb24pKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5DYW1wYWlnbiB7XG4gICAgLyoqXG4gICAgICogQ29udGFpbnMgcHJvZ3Jlc3NpdmUgZGlhbGVyIGNvbmZpZ3VyYXRpb24gZm9yIGFuIG91dGJvdW5kIGNhbXBhaWduLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtY29ubmVjdGNhbXBhaWducy1jYW1wYWlnbi1wcm9ncmVzc2l2ZWRpYWxlcmNvbmZpZy5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBQcm9ncmVzc2l2ZURpYWxlckNvbmZpZ1Byb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJhbmR3aWR0aCBhbGxvY2F0aW9uIGZvciB0aGUgcHJvZ3Jlc3NpdmUgZGlhbGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWNvbm5lY3RjYW1wYWlnbnMtY2FtcGFpZ24tcHJvZ3Jlc3NpdmVkaWFsZXJjb25maWcuaHRtbCNjZm4tY29ubmVjdGNhbXBhaWducy1jYW1wYWlnbi1wcm9ncmVzc2l2ZWRpYWxlcmNvbmZpZy1iYW5kd2lkdGhhbGxvY2F0aW9uXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBiYW5kd2lkdGhBbGxvY2F0aW9uOiBudW1iZXI7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYFByb2dyZXNzaXZlRGlhbGVyQ29uZmlnUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFByb2dyZXNzaXZlRGlhbGVyQ29uZmlnUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQ2FtcGFpZ25fUHJvZ3Jlc3NpdmVEaWFsZXJDb25maWdQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2JhbmR3aWR0aEFsbG9jYXRpb24nLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuYmFuZHdpZHRoQWxsb2NhdGlvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYmFuZHdpZHRoQWxsb2NhdGlvbicsIGNkay52YWxpZGF0ZU51bWJlcikocHJvcGVydGllcy5iYW5kd2lkdGhBbGxvY2F0aW9uKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlByb2dyZXNzaXZlRGlhbGVyQ29uZmlnUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkNvbm5lY3RDYW1wYWlnbnM6OkNhbXBhaWduLlByb2dyZXNzaXZlRGlhbGVyQ29uZmlnYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBQcm9ncmVzc2l2ZURpYWxlckNvbmZpZ1Byb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpDb25uZWN0Q2FtcGFpZ25zOjpDYW1wYWlnbi5Qcm9ncmVzc2l2ZURpYWxlckNvbmZpZ2AgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5DYW1wYWlnblByb2dyZXNzaXZlRGlhbGVyQ29uZmlnUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkNhbXBhaWduX1Byb2dyZXNzaXZlRGlhbGVyQ29uZmlnUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIEJhbmR3aWR0aEFsbG9jYXRpb246IGNkay5udW1iZXJUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYmFuZHdpZHRoQWxsb2NhdGlvbiksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkNhbXBhaWduUHJvZ3Jlc3NpdmVEaWFsZXJDb25maWdQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkNhbXBhaWduLlByb2dyZXNzaXZlRGlhbGVyQ29uZmlnUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuQ2FtcGFpZ24uUHJvZ3Jlc3NpdmVEaWFsZXJDb25maWdQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2JhbmR3aWR0aEFsbG9jYXRpb24nLCAnQmFuZHdpZHRoQWxsb2NhdGlvbicsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0TnVtYmVyKHByb3BlcnRpZXMuQmFuZHdpZHRoQWxsb2NhdGlvbikpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuIl19