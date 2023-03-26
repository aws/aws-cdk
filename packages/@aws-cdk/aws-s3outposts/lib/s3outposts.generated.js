"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnEndpoint = exports.CfnBucketPolicy = exports.CfnBucket = exports.CfnAccessPoint = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cfn_parse = require("@aws-cdk/core/lib/helpers-internal");
/**
 * Determine whether the given properties match those of a `CfnAccessPointProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessPointProps`
 *
 * @returns the result of the validation.
 */
function CfnAccessPointPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('policy', cdk.validateObject)(properties.policy));
    errors.collect(cdk.propertyValidator('vpcConfiguration', cdk.requiredValidator)(properties.vpcConfiguration));
    errors.collect(cdk.propertyValidator('vpcConfiguration', CfnAccessPoint_VpcConfigurationPropertyValidator)(properties.vpcConfiguration));
    return errors.wrap('supplied properties not correct for "CfnAccessPointProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::S3Outposts::AccessPoint` resource
 *
 * @param properties - the TypeScript properties of a `CfnAccessPointProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3Outposts::AccessPoint` resource.
 */
// @ts-ignore TS6133
function cfnAccessPointPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnAccessPointPropsValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Name: cdk.stringToCloudFormation(properties.name),
        VpcConfiguration: cfnAccessPointVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration),
        Policy: cdk.objectToCloudFormation(properties.policy),
    };
}
// @ts-ignore TS6133
function CfnAccessPointPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('vpcConfiguration', 'VpcConfiguration', CfnAccessPointVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration));
    ret.addPropertyResult('policy', 'Policy', properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::S3Outposts::AccessPoint`
 *
 * The AWS::S3Outposts::AccessPoint resource specifies an access point and associates it with the specified Amazon S3 on Outposts bucket. For more information, see [Managing data access with Amazon S3 access points](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-points.html) .
 *
 * > S3 on Outposts supports only VPC-style access points.
 *
 * @cloudformationResource AWS::S3Outposts::AccessPoint
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html
 */
class CfnAccessPoint extends cdk.CfnResource {
    /**
     * Create a new `AWS::S3Outposts::AccessPoint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnAccessPoint.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3outposts_CfnAccessPointProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnAccessPoint);
            }
            throw error;
        }
        cdk.requireProperty(props, 'bucket', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'vpcConfiguration', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.bucket = props.bucket;
        this.name = props.name;
        this.vpcConfiguration = props.vpcConfiguration;
        this.policy = props.policy;
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
        const propsResult = CfnAccessPointPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAccessPoint(scope, id, propsResult.value);
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessPoint.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            bucket: this.bucket,
            name: this.name,
            vpcConfiguration: this.vpcConfiguration,
            policy: this.policy,
        };
    }
    renderProperties(props) {
        return cfnAccessPointPropsToCloudFormation(props);
    }
}
exports.CfnAccessPoint = CfnAccessPoint;
_a = JSII_RTTI_SYMBOL_1;
CfnAccessPoint[_a] = { fqn: "@aws-cdk/aws-s3outposts.CfnAccessPoint", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnAccessPoint.CFN_RESOURCE_TYPE_NAME = "AWS::S3Outposts::AccessPoint";
/**
 * Determine whether the given properties match those of a `VpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccessPoint_VpcConfigurationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('vpcId', cdk.validateString)(properties.vpcId));
    return errors.wrap('supplied properties not correct for "VpcConfigurationProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::S3Outposts::AccessPoint.VpcConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `VpcConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3Outposts::AccessPoint.VpcConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnAccessPointVpcConfigurationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnAccessPoint_VpcConfigurationPropertyValidator(properties).assertSuccess();
    return {
        VpcId: cdk.stringToCloudFormation(properties.vpcId),
    };
}
// @ts-ignore TS6133
function CfnAccessPointVpcConfigurationPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('vpcId', 'VpcId', properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `CfnBucketProps`
 *
 * @param properties - the TypeScript properties of a `CfnBucketProps`
 *
 * @returns the result of the validation.
 */
function CfnBucketPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketName', cdk.requiredValidator)(properties.bucketName));
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    errors.collect(cdk.propertyValidator('lifecycleConfiguration', CfnBucket_LifecycleConfigurationPropertyValidator)(properties.lifecycleConfiguration));
    errors.collect(cdk.propertyValidator('outpostId', cdk.requiredValidator)(properties.outpostId));
    errors.collect(cdk.propertyValidator('outpostId', cdk.validateString)(properties.outpostId));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnBucketProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::S3Outposts::Bucket` resource
 *
 * @param properties - the TypeScript properties of a `CfnBucketProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3Outposts::Bucket` resource.
 */
// @ts-ignore TS6133
function cfnBucketPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnBucketPropsValidator(properties).assertSuccess();
    return {
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        OutpostId: cdk.stringToCloudFormation(properties.outpostId),
        LifecycleConfiguration: cfnBucketLifecycleConfigurationPropertyToCloudFormation(properties.lifecycleConfiguration),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnBucketPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('bucketName', 'BucketName', cfn_parse.FromCloudFormation.getString(properties.BucketName));
    ret.addPropertyResult('outpostId', 'OutpostId', cfn_parse.FromCloudFormation.getString(properties.OutpostId));
    ret.addPropertyResult('lifecycleConfiguration', 'LifecycleConfiguration', properties.LifecycleConfiguration != null ? CfnBucketLifecycleConfigurationPropertyFromCloudFormation(properties.LifecycleConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::S3Outposts::Bucket`
 *
 * The AWS::S3Outposts::Bucket resource specifies a new Amazon S3 on Outposts bucket. To create an S3 on Outposts bucket, you must have S3 on Outposts capacity provisioned on your Outpost. For more information, see [Using Amazon S3 on Outposts](https://docs.aws.amazon.com/AmazonS3/latest/userguide/S3onOutposts.html) .
 *
 * S3 on Outposts buckets support the following:
 *
 * - Tags
 * - Lifecycle configuration rules for deleting expired objects
 *
 * For a complete list of restrictions and Amazon S3 feature limitations on S3 on Outposts, see [Amazon S3 on Outposts Restrictions and Limitations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/S3OnOutpostsRestrictionsLimitations.html) .
 *
 * @cloudformationResource AWS::S3Outposts::Bucket
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html
 */
class CfnBucket extends cdk.CfnResource {
    /**
     * Create a new `AWS::S3Outposts::Bucket`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnBucket.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3outposts_CfnBucketProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnBucket);
            }
            throw error;
        }
        cdk.requireProperty(props, 'bucketName', this);
        cdk.requireProperty(props, 'outpostId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.bucketName = props.bucketName;
        this.outpostId = props.outpostId;
        this.lifecycleConfiguration = props.lifecycleConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::S3Outposts::Bucket", props.tags, { tagPropertyName: 'tags' });
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
        const propsResult = CfnBucketPropsFromCloudFormation(resourceProperties);
        const ret = new CfnBucket(scope, id, propsResult.value);
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBucket.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            bucketName: this.bucketName,
            outpostId: this.outpostId,
            lifecycleConfiguration: this.lifecycleConfiguration,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        return cfnBucketPropsToCloudFormation(props);
    }
}
exports.CfnBucket = CfnBucket;
_b = JSII_RTTI_SYMBOL_1;
CfnBucket[_b] = { fqn: "@aws-cdk/aws-s3outposts.CfnBucket", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnBucket.CFN_RESOURCE_TYPE_NAME = "AWS::S3Outposts::Bucket";
/**
 * Determine whether the given properties match those of a `AbortIncompleteMultipartUploadProperty`
 *
 * @param properties - the TypeScript properties of a `AbortIncompleteMultipartUploadProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_AbortIncompleteMultipartUploadPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('daysAfterInitiation', cdk.requiredValidator)(properties.daysAfterInitiation));
    errors.collect(cdk.propertyValidator('daysAfterInitiation', cdk.validateNumber)(properties.daysAfterInitiation));
    return errors.wrap('supplied properties not correct for "AbortIncompleteMultipartUploadProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::S3Outposts::Bucket.AbortIncompleteMultipartUpload` resource
 *
 * @param properties - the TypeScript properties of a `AbortIncompleteMultipartUploadProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3Outposts::Bucket.AbortIncompleteMultipartUpload` resource.
 */
// @ts-ignore TS6133
function cfnBucketAbortIncompleteMultipartUploadPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnBucket_AbortIncompleteMultipartUploadPropertyValidator(properties).assertSuccess();
    return {
        DaysAfterInitiation: cdk.numberToCloudFormation(properties.daysAfterInitiation),
    };
}
// @ts-ignore TS6133
function CfnBucketAbortIncompleteMultipartUploadPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('daysAfterInitiation', 'DaysAfterInitiation', cfn_parse.FromCloudFormation.getNumber(properties.DaysAfterInitiation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_FilterPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('andOperator', CfnBucket_FilterAndOperatorPropertyValidator)(properties.andOperator));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('tag', CfnBucket_FilterTagPropertyValidator)(properties.tag));
    return errors.wrap('supplied properties not correct for "FilterProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::S3Outposts::Bucket.Filter` resource
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3Outposts::Bucket.Filter` resource.
 */
// @ts-ignore TS6133
function cfnBucketFilterPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnBucket_FilterPropertyValidator(properties).assertSuccess();
    return {
        AndOperator: cfnBucketFilterAndOperatorPropertyToCloudFormation(properties.andOperator),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        Tag: cfnBucketFilterTagPropertyToCloudFormation(properties.tag),
    };
}
// @ts-ignore TS6133
function CfnBucketFilterPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('andOperator', 'AndOperator', properties.AndOperator != null ? CfnBucketFilterAndOperatorPropertyFromCloudFormation(properties.AndOperator) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('tag', 'Tag', properties.Tag != null ? CfnBucketFilterTagPropertyFromCloudFormation(properties.Tag) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `FilterAndOperatorProperty`
 *
 * @param properties - the TypeScript properties of a `FilterAndOperatorProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_FilterAndOperatorPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('tags', cdk.requiredValidator)(properties.tags));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnBucket_FilterTagPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "FilterAndOperatorProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::S3Outposts::Bucket.FilterAndOperator` resource
 *
 * @param properties - the TypeScript properties of a `FilterAndOperatorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3Outposts::Bucket.FilterAndOperator` resource.
 */
// @ts-ignore TS6133
function cfnBucketFilterAndOperatorPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnBucket_FilterAndOperatorPropertyValidator(properties).assertSuccess();
    return {
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        Tags: cdk.listMapper(cfnBucketFilterTagPropertyToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnBucketFilterAndOperatorPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('tags', 'Tags', cfn_parse.FromCloudFormation.getArray(CfnBucketFilterTagPropertyFromCloudFormation)(properties.Tags));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `FilterTagProperty`
 *
 * @param properties - the TypeScript properties of a `FilterTagProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_FilterTagPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "FilterTagProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::S3Outposts::Bucket.FilterTag` resource
 *
 * @param properties - the TypeScript properties of a `FilterTagProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3Outposts::Bucket.FilterTag` resource.
 */
// @ts-ignore TS6133
function cfnBucketFilterTagPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnBucket_FilterTagPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}
// @ts-ignore TS6133
function CfnBucketFilterTagPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `LifecycleConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LifecycleConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_LifecycleConfigurationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('rules', cdk.requiredValidator)(properties.rules));
    errors.collect(cdk.propertyValidator('rules', cdk.listValidator(CfnBucket_RulePropertyValidator))(properties.rules));
    return errors.wrap('supplied properties not correct for "LifecycleConfigurationProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::S3Outposts::Bucket.LifecycleConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LifecycleConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3Outposts::Bucket.LifecycleConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketLifecycleConfigurationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnBucket_LifecycleConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Rules: cdk.listMapper(cfnBucketRulePropertyToCloudFormation)(properties.rules),
    };
}
// @ts-ignore TS6133
function CfnBucketLifecycleConfigurationPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('rules', 'Rules', cfn_parse.FromCloudFormation.getArray(CfnBucketRulePropertyFromCloudFormation)(properties.Rules));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_RulePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('abortIncompleteMultipartUpload', CfnBucket_AbortIncompleteMultipartUploadPropertyValidator)(properties.abortIncompleteMultipartUpload));
    errors.collect(cdk.propertyValidator('expirationDate', cdk.validateString)(properties.expirationDate));
    errors.collect(cdk.propertyValidator('expirationInDays', cdk.validateNumber)(properties.expirationInDays));
    errors.collect(cdk.propertyValidator('filter', cdk.validateObject)(properties.filter));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('status', cdk.requiredValidator)(properties.status));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    return errors.wrap('supplied properties not correct for "RuleProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::S3Outposts::Bucket.Rule` resource
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3Outposts::Bucket.Rule` resource.
 */
// @ts-ignore TS6133
function cfnBucketRulePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnBucket_RulePropertyValidator(properties).assertSuccess();
    return {
        AbortIncompleteMultipartUpload: cfnBucketAbortIncompleteMultipartUploadPropertyToCloudFormation(properties.abortIncompleteMultipartUpload),
        ExpirationDate: cdk.stringToCloudFormation(properties.expirationDate),
        ExpirationInDays: cdk.numberToCloudFormation(properties.expirationInDays),
        Filter: cdk.objectToCloudFormation(properties.filter),
        Id: cdk.stringToCloudFormation(properties.id),
        Status: cdk.stringToCloudFormation(properties.status),
    };
}
// @ts-ignore TS6133
function CfnBucketRulePropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('abortIncompleteMultipartUpload', 'AbortIncompleteMultipartUpload', properties.AbortIncompleteMultipartUpload != null ? CfnBucketAbortIncompleteMultipartUploadPropertyFromCloudFormation(properties.AbortIncompleteMultipartUpload) : undefined);
    ret.addPropertyResult('expirationDate', 'ExpirationDate', properties.ExpirationDate != null ? cfn_parse.FromCloudFormation.getString(properties.ExpirationDate) : undefined);
    ret.addPropertyResult('expirationInDays', 'ExpirationInDays', properties.ExpirationInDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.ExpirationInDays) : undefined);
    ret.addPropertyResult('filter', 'Filter', properties.Filter != null ? cfn_parse.FromCloudFormation.getAny(properties.Filter) : undefined);
    ret.addPropertyResult('id', 'Id', properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined);
    ret.addPropertyResult('status', 'Status', cfn_parse.FromCloudFormation.getString(properties.Status));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `CfnBucketPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnBucketPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnBucketPolicyPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('policyDocument', cdk.requiredValidator)(properties.policyDocument));
    errors.collect(cdk.propertyValidator('policyDocument', cdk.validateObject)(properties.policyDocument));
    return errors.wrap('supplied properties not correct for "CfnBucketPolicyProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::S3Outposts::BucketPolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnBucketPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3Outposts::BucketPolicy` resource.
 */
// @ts-ignore TS6133
function cfnBucketPolicyPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnBucketPolicyPropsValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        PolicyDocument: cdk.objectToCloudFormation(properties.policyDocument),
    };
}
// @ts-ignore TS6133
function CfnBucketPolicyPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('policyDocument', 'PolicyDocument', cfn_parse.FromCloudFormation.getAny(properties.PolicyDocument));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::S3Outposts::BucketPolicy`
 *
 * This resource applies a bucket policy to an Amazon S3 on Outposts bucket.
 *
 * If you are using an identity other than the root user of the AWS account that owns the S3 on Outposts bucket, the calling identity must have the `s3-outposts:PutBucketPolicy` permissions on the specified Outposts bucket and belong to the bucket owner's account in order to use this resource.
 *
 * If you don't have `s3-outposts:PutBucketPolicy` permissions, S3 on Outposts returns a `403 Access Denied` error.
 *
 * > The root user of the AWS account that owns an Outposts bucket can *always* use this resource, even if the policy explicitly denies the root user the ability to perform actions on this resource.
 *
 * For more information, see the AWS::IAM::Policy [PolicyDocument](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-policydocument) resource description in this guide and [Access Policy Language Overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-policy-language-overview.html) .
 *
 * @cloudformationResource AWS::S3Outposts::BucketPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucketpolicy.html
 */
class CfnBucketPolicy extends cdk.CfnResource {
    /**
     * Create a new `AWS::S3Outposts::BucketPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnBucketPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3outposts_CfnBucketPolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnBucketPolicy);
            }
            throw error;
        }
        cdk.requireProperty(props, 'bucket', this);
        cdk.requireProperty(props, 'policyDocument', this);
        this.bucket = props.bucket;
        this.policyDocument = props.policyDocument;
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
        const propsResult = CfnBucketPolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnBucketPolicy(scope, id, propsResult.value);
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBucketPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            bucket: this.bucket,
            policyDocument: this.policyDocument,
        };
    }
    renderProperties(props) {
        return cfnBucketPolicyPropsToCloudFormation(props);
    }
}
exports.CfnBucketPolicy = CfnBucketPolicy;
_c = JSII_RTTI_SYMBOL_1;
CfnBucketPolicy[_c] = { fqn: "@aws-cdk/aws-s3outposts.CfnBucketPolicy", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnBucketPolicy.CFN_RESOURCE_TYPE_NAME = "AWS::S3Outposts::BucketPolicy";
/**
 * Determine whether the given properties match those of a `CfnEndpointProps`
 *
 * @param properties - the TypeScript properties of a `CfnEndpointProps`
 *
 * @returns the result of the validation.
 */
function CfnEndpointPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessType', cdk.validateString)(properties.accessType));
    errors.collect(cdk.propertyValidator('customerOwnedIpv4Pool', cdk.validateString)(properties.customerOwnedIpv4Pool));
    errors.collect(cdk.propertyValidator('outpostId', cdk.requiredValidator)(properties.outpostId));
    errors.collect(cdk.propertyValidator('outpostId', cdk.validateString)(properties.outpostId));
    errors.collect(cdk.propertyValidator('securityGroupId', cdk.requiredValidator)(properties.securityGroupId));
    errors.collect(cdk.propertyValidator('securityGroupId', cdk.validateString)(properties.securityGroupId));
    errors.collect(cdk.propertyValidator('subnetId', cdk.requiredValidator)(properties.subnetId));
    errors.collect(cdk.propertyValidator('subnetId', cdk.validateString)(properties.subnetId));
    return errors.wrap('supplied properties not correct for "CfnEndpointProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::S3Outposts::Endpoint` resource
 *
 * @param properties - the TypeScript properties of a `CfnEndpointProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3Outposts::Endpoint` resource.
 */
// @ts-ignore TS6133
function cfnEndpointPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnEndpointPropsValidator(properties).assertSuccess();
    return {
        OutpostId: cdk.stringToCloudFormation(properties.outpostId),
        SecurityGroupId: cdk.stringToCloudFormation(properties.securityGroupId),
        SubnetId: cdk.stringToCloudFormation(properties.subnetId),
        AccessType: cdk.stringToCloudFormation(properties.accessType),
        CustomerOwnedIpv4Pool: cdk.stringToCloudFormation(properties.customerOwnedIpv4Pool),
    };
}
// @ts-ignore TS6133
function CfnEndpointPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('outpostId', 'OutpostId', cfn_parse.FromCloudFormation.getString(properties.OutpostId));
    ret.addPropertyResult('securityGroupId', 'SecurityGroupId', cfn_parse.FromCloudFormation.getString(properties.SecurityGroupId));
    ret.addPropertyResult('subnetId', 'SubnetId', cfn_parse.FromCloudFormation.getString(properties.SubnetId));
    ret.addPropertyResult('accessType', 'AccessType', properties.AccessType != null ? cfn_parse.FromCloudFormation.getString(properties.AccessType) : undefined);
    ret.addPropertyResult('customerOwnedIpv4Pool', 'CustomerOwnedIpv4Pool', properties.CustomerOwnedIpv4Pool != null ? cfn_parse.FromCloudFormation.getString(properties.CustomerOwnedIpv4Pool) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * A CloudFormation `AWS::S3Outposts::Endpoint`
 *
 * This AWS::S3Outposts::Endpoint resource specifies an endpoint and associates it with the specified Outpost.
 *
 * Amazon S3 on Outposts access points simplify managing data access at scale for shared datasets in S3 on Outposts. S3 on Outposts uses endpoints to connect to S3 on Outposts buckets so that you can perform actions within your virtual private cloud (VPC). For more information, see [Accessing S3 on Outposts using VPC-only access points](https://docs.aws.amazon.com/AmazonS3/latest/userguide/AccessingS3Outposts.html) .
 *
 * > It can take up to 5 minutes for this resource to be created.
 *
 * @cloudformationResource AWS::S3Outposts::Endpoint
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html
 */
class CfnEndpoint extends cdk.CfnResource {
    /**
     * Create a new `AWS::S3Outposts::Endpoint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnEndpoint.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3outposts_CfnEndpointProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnEndpoint);
            }
            throw error;
        }
        cdk.requireProperty(props, 'outpostId', this);
        cdk.requireProperty(props, 'securityGroupId', this);
        cdk.requireProperty(props, 'subnetId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCidrBlock = cdk.Token.asString(this.getAtt('CidrBlock', cdk.ResolutionTypeHint.STRING));
        this.attrCreationTime = cdk.Token.asString(this.getAtt('CreationTime', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrNetworkInterfaces = this.getAtt('NetworkInterfaces', cdk.ResolutionTypeHint.STRING);
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));
        this.outpostId = props.outpostId;
        this.securityGroupId = props.securityGroupId;
        this.subnetId = props.subnetId;
        this.accessType = props.accessType;
        this.customerOwnedIpv4Pool = props.customerOwnedIpv4Pool;
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
        const propsResult = CfnEndpointPropsFromCloudFormation(resourceProperties);
        const ret = new CfnEndpoint(scope, id, propsResult.value);
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEndpoint.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            outpostId: this.outpostId,
            securityGroupId: this.securityGroupId,
            subnetId: this.subnetId,
            accessType: this.accessType,
            customerOwnedIpv4Pool: this.customerOwnedIpv4Pool,
        };
    }
    renderProperties(props) {
        return cfnEndpointPropsToCloudFormation(props);
    }
}
exports.CfnEndpoint = CfnEndpoint;
_d = JSII_RTTI_SYMBOL_1;
CfnEndpoint[_d] = { fqn: "@aws-cdk/aws-s3outposts.CfnEndpoint", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnEndpoint.CFN_RESOURCE_TYPE_NAME = "AWS::S3Outposts::Endpoint";
/**
 * Determine whether the given properties match those of a `NetworkInterfaceProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkInterfaceProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_NetworkInterfacePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('networkInterfaceId', cdk.requiredValidator)(properties.networkInterfaceId));
    errors.collect(cdk.propertyValidator('networkInterfaceId', cdk.validateString)(properties.networkInterfaceId));
    return errors.wrap('supplied properties not correct for "NetworkInterfaceProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::S3Outposts::Endpoint.NetworkInterface` resource
 *
 * @param properties - the TypeScript properties of a `NetworkInterfaceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3Outposts::Endpoint.NetworkInterface` resource.
 */
// @ts-ignore TS6133
function cfnEndpointNetworkInterfacePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnEndpoint_NetworkInterfacePropertyValidator(properties).assertSuccess();
    return {
        NetworkInterfaceId: cdk.stringToCloudFormation(properties.networkInterfaceId),
    };
}
// @ts-ignore TS6133
function CfnEndpointNetworkInterfacePropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('networkInterfaceId', 'NetworkInterfaceId', cfn_parse.FromCloudFormation.getString(properties.NetworkInterfaceId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczNvdXRwb3N0cy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzM291dHBvc3RzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFRQSxxQ0FBcUM7QUFDckMsZ0VBQWdFO0FBeUNoRTs7Ozs7O0dBTUc7QUFDSCxTQUFTLDRCQUE0QixDQUFDLFVBQWU7SUFDakQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztLQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMxRixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3ZGLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN0RixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFD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QUMsVUFBVSxDQUFDO0lBQ2xELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE9BQU8sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0Q7SUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxnQ0FBZ0MsRUFBd0MsQ0FBQztJQUNuRyxHQUFHLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLEVBQUUsb0JBQW9CLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0lBQ3pJLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vLyBHZW5lcmF0ZWQgZnJvbSB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIFJlc291cmNlIFNwZWNpZmljYXRpb25cbi8vIFNlZTogZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2Nmbi1yZXNvdXJjZS1zcGVjaWZpY2F0aW9uLmh0bWxcbi8vIEBjZm4ydHM6bWV0YUAge1wiZ2VuZXJhdGVkXCI6XCIyMDIzLTAxLTIyVDA5OjU0OjA5LjMzNVpcIixcImZpbmdlcnByaW50XCI6XCJEenA3NGJyOUd3dVp6UEJJL045ZnRxZzBIODRUWGg3S2NtQjJLbUllcUNvPVwifVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sXG5cbmltcG9ydCAqIGFzIGNvbnN0cnVjdHMgZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjZm5fcGFyc2UgZnJvbSAnQGF3cy1jZGsvY29yZS9saWIvaGVscGVycy1pbnRlcm5hbCc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuQWNjZXNzUG9pbnRgXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXMzb3V0cG9zdHMtYWNjZXNzcG9pbnQuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkFjY2Vzc1BvaW50UHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBTMyBvbiBPdXRwb3N0cyBidWNrZXQgdGhhdCBpcyBhc3NvY2lhdGVkIHdpdGggdGhpcyBhY2Nlc3MgcG9pbnQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zM291dHBvc3RzLWFjY2Vzc3BvaW50Lmh0bWwjY2ZuLXMzb3V0cG9zdHMtYWNjZXNzcG9pbnQtYnVja2V0XG4gICAgICovXG4gICAgcmVhZG9ubHkgYnVja2V0OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGlzIGFjY2VzcyBwb2ludC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXMzb3V0cG9zdHMtYWNjZXNzcG9pbnQuaHRtbCNjZm4tczNvdXRwb3N0cy1hY2Nlc3Nwb2ludC1uYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHZpcnR1YWwgcHJpdmF0ZSBjbG91ZCAoVlBDKSBjb25maWd1cmF0aW9uIGZvciB0aGlzIGFjY2VzcyBwb2ludCwgaWYgb25lIGV4aXN0cy5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXMzb3V0cG9zdHMtYWNjZXNzcG9pbnQuaHRtbCNjZm4tczNvdXRwb3N0cy1hY2Nlc3Nwb2ludC12cGNjb25maWd1cmF0aW9uXG4gICAgICovXG4gICAgcmVhZG9ubHkgdnBjQ29uZmlndXJhdGlvbjogQ2ZuQWNjZXNzUG9pbnQuVnBjQ29uZmlndXJhdGlvblByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFjY2VzcyBwb2ludCBwb2xpY3kgYXNzb2NpYXRlZCB3aXRoIHRoaXMgYWNjZXNzIHBvaW50LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtczNvdXRwb3N0cy1hY2Nlc3Nwb2ludC5odG1sI2Nmbi1zM291dHBvc3RzLWFjY2Vzc3BvaW50LXBvbGljeVxuICAgICAqL1xuICAgIHJlYWRvbmx5IHBvbGljeT86IGFueSB8IGNkay5JUmVzb2x2YWJsZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5BY2Nlc3NQb2ludFByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5BY2Nlc3NQb2ludFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkFjY2Vzc1BvaW50UHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdidWNrZXQnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuYnVja2V0KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdidWNrZXQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYnVja2V0KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCduYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLm5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncG9saWN5JywgY2RrLnZhbGlkYXRlT2JqZWN0KShwcm9wZXJ0aWVzLnBvbGljeSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndnBjQ29uZmlndXJhdGlvbicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy52cGNDb25maWd1cmF0aW9uKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd2cGNDb25maWd1cmF0aW9uJywgQ2ZuQWNjZXNzUG9pbnRfVnBjQ29uZmlndXJhdGlvblByb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLnZwY0NvbmZpZ3VyYXRpb24pKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuQWNjZXNzUG9pbnRQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6UzNPdXRwb3N0czo6QWNjZXNzUG9pbnRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkFjY2Vzc1BvaW50UHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlMzT3V0cG9zdHM6OkFjY2Vzc1BvaW50YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkFjY2Vzc1BvaW50UHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkFjY2Vzc1BvaW50UHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIEJ1Y2tldDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5idWNrZXQpLFxuICAgICAgICBOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLm5hbWUpLFxuICAgICAgICBWcGNDb25maWd1cmF0aW9uOiBjZm5BY2Nlc3NQb2ludFZwY0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy52cGNDb25maWd1cmF0aW9uKSxcbiAgICAgICAgUG9saWN5OiBjZGsub2JqZWN0VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnBvbGljeSksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkFjY2Vzc1BvaW50UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5BY2Nlc3NQb2ludFByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5BY2Nlc3NQb2ludFByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnYnVja2V0JywgJ0J1Y2tldCcsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuQnVja2V0KSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCduYW1lJywgJ05hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLk5hbWUpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3ZwY0NvbmZpZ3VyYXRpb24nLCAnVnBjQ29uZmlndXJhdGlvbicsIENmbkFjY2Vzc1BvaW50VnBjQ29uZmlndXJhdGlvblByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuVnBjQ29uZmlndXJhdGlvbikpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncG9saWN5JywgJ1BvbGljeScsIHByb3BlcnRpZXMuUG9saWN5ICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFueShwcm9wZXJ0aWVzLlBvbGljeSkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6UzNPdXRwb3N0czo6QWNjZXNzUG9pbnRgXG4gKlxuICogVGhlIEFXUzo6UzNPdXRwb3N0czo6QWNjZXNzUG9pbnQgcmVzb3VyY2Ugc3BlY2lmaWVzIGFuIGFjY2VzcyBwb2ludCBhbmQgYXNzb2NpYXRlcyBpdCB3aXRoIHRoZSBzcGVjaWZpZWQgQW1hem9uIFMzIG9uIE91dHBvc3RzIGJ1Y2tldC4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbTWFuYWdpbmcgZGF0YSBhY2Nlc3Mgd2l0aCBBbWF6b24gUzMgYWNjZXNzIHBvaW50c10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC91c2VyZ3VpZGUvYWNjZXNzLXBvaW50cy5odG1sKSAuXG4gKlxuICogPiBTMyBvbiBPdXRwb3N0cyBzdXBwb3J0cyBvbmx5IFZQQy1zdHlsZSBhY2Nlc3MgcG9pbnRzLlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6UzNPdXRwb3N0czo6QWNjZXNzUG9pbnRcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zM291dHBvc3RzLWFjY2Vzc3BvaW50Lmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmbkFjY2Vzc1BvaW50IGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6UzNPdXRwb3N0czo6QWNjZXNzUG9pbnRcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5BY2Nlc3NQb2ludCB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuQWNjZXNzUG9pbnRQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuQWNjZXNzUG9pbnQoc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyByZXNvdXJjZSBjb250YWlucyB0aGUgZGV0YWlscyBvZiB0aGUgUzMgb24gT3V0cG9zdHMgYnVja2V0IGFjY2VzcyBwb2ludCBBUk4uIFRoaXMgcmVzb3VyY2UgaXMgcmVhZC1vbmx5LlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBBcm5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0ckFybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBTMyBvbiBPdXRwb3N0cyBidWNrZXQgdGhhdCBpcyBhc3NvY2lhdGVkIHdpdGggdGhpcyBhY2Nlc3MgcG9pbnQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zM291dHBvc3RzLWFjY2Vzc3BvaW50Lmh0bWwjY2ZuLXMzb3V0cG9zdHMtYWNjZXNzcG9pbnQtYnVja2V0XG4gICAgICovXG4gICAgcHVibGljIGJ1Y2tldDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhpcyBhY2Nlc3MgcG9pbnQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zM291dHBvc3RzLWFjY2Vzc3BvaW50Lmh0bWwjY2ZuLXMzb3V0cG9zdHMtYWNjZXNzcG9pbnQtbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdmlydHVhbCBwcml2YXRlIGNsb3VkIChWUEMpIGNvbmZpZ3VyYXRpb24gZm9yIHRoaXMgYWNjZXNzIHBvaW50LCBpZiBvbmUgZXhpc3RzLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtczNvdXRwb3N0cy1hY2Nlc3Nwb2ludC5odG1sI2Nmbi1zM291dHBvc3RzLWFjY2Vzc3BvaW50LXZwY2NvbmZpZ3VyYXRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgdnBjQ29uZmlndXJhdGlvbjogQ2ZuQWNjZXNzUG9pbnQuVnBjQ29uZmlndXJhdGlvblByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFjY2VzcyBwb2ludCBwb2xpY3kgYXNzb2NpYXRlZCB3aXRoIHRoaXMgYWNjZXNzIHBvaW50LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtczNvdXRwb3N0cy1hY2Nlc3Nwb2ludC5odG1sI2Nmbi1zM291dHBvc3RzLWFjY2Vzc3BvaW50LXBvbGljeVxuICAgICAqL1xuICAgIHB1YmxpYyBwb2xpY3k6IGFueSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpTM091dHBvc3RzOjpBY2Nlc3NQb2ludGAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbkFjY2Vzc1BvaW50UHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbkFjY2Vzc1BvaW50LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnYnVja2V0JywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICduYW1lJywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICd2cGNDb25maWd1cmF0aW9uJywgdGhpcyk7XG4gICAgICAgIHRoaXMuYXR0ckFybiA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnQXJuJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcblxuICAgICAgICB0aGlzLmJ1Y2tldCA9IHByb3BzLmJ1Y2tldDtcbiAgICAgICAgdGhpcy5uYW1lID0gcHJvcHMubmFtZTtcbiAgICAgICAgdGhpcy52cGNDb25maWd1cmF0aW9uID0gcHJvcHMudnBjQ29uZmlndXJhdGlvbjtcbiAgICAgICAgdGhpcy5wb2xpY3kgPSBwcm9wcy5wb2xpY3k7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5BY2Nlc3NQb2ludC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYnVja2V0OiB0aGlzLmJ1Y2tldCxcbiAgICAgICAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgICAgIHZwY0NvbmZpZ3VyYXRpb246IHRoaXMudnBjQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgIHBvbGljeTogdGhpcy5wb2xpY3ksXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuQWNjZXNzUG9pbnRQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5BY2Nlc3NQb2ludCB7XG4gICAgLyoqXG4gICAgICogQ29udGFpbnMgdGhlIHZpcnR1YWwgcHJpdmF0ZSBjbG91ZCAoVlBDKSBjb25maWd1cmF0aW9uIGZvciB0aGUgc3BlY2lmaWVkIGFjY2VzcyBwb2ludC5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXMzb3V0cG9zdHMtYWNjZXNzcG9pbnQtdnBjY29uZmlndXJhdGlvbi5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBWcGNDb25maWd1cmF0aW9uUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIElEIG9mIHRoZSBWUEMgY29uZmlndXJhdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1zM291dHBvc3RzLWFjY2Vzc3BvaW50LXZwY2NvbmZpZ3VyYXRpb24uaHRtbCNjZm4tczNvdXRwb3N0cy1hY2Nlc3Nwb2ludC12cGNjb25maWd1cmF0aW9uLXZwY2lkXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSB2cGNJZD86IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgVnBjQ29uZmlndXJhdGlvblByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBWcGNDb25maWd1cmF0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQWNjZXNzUG9pbnRfVnBjQ29uZmlndXJhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndnBjSWQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMudnBjSWQpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiVnBjQ29uZmlndXJhdGlvblByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTM091dHBvc3RzOjpBY2Nlc3NQb2ludC5WcGNDb25maWd1cmF0aW9uYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBWcGNDb25maWd1cmF0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlMzT3V0cG9zdHM6OkFjY2Vzc1BvaW50LlZwY0NvbmZpZ3VyYXRpb25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQWNjZXNzUG9pbnRWcGNDb25maWd1cmF0aW9uUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkFjY2Vzc1BvaW50X1ZwY0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgVnBjSWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudnBjSWQpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5BY2Nlc3NQb2ludFZwY0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkFjY2Vzc1BvaW50LlZwY0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5BY2Nlc3NQb2ludC5WcGNDb25maWd1cmF0aW9uUHJvcGVydHk+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd2cGNJZCcsICdWcGNJZCcsIHByb3BlcnRpZXMuVnBjSWQgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuVnBjSWQpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5CdWNrZXRgXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXMzb3V0cG9zdHMtYnVja2V0Lmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5CdWNrZXRQcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBBIG5hbWUgZm9yIHRoZSBTMyBvbiBPdXRwb3N0cyBidWNrZXQuIElmIHlvdSBkb24ndCBzcGVjaWZ5IGEgbmFtZSwgQVdTIENsb3VkRm9ybWF0aW9uIGdlbmVyYXRlcyBhIHVuaXF1ZSBJRCBhbmQgdXNlcyB0aGF0IElEIGZvciB0aGUgYnVja2V0IG5hbWUuIFRoZSBidWNrZXQgbmFtZSBtdXN0IGNvbnRhaW4gb25seSBsb3dlcmNhc2UgbGV0dGVycywgbnVtYmVycywgcGVyaW9kcyAoLiksIGFuZCBkYXNoZXMgKC0pIGFuZCBtdXN0IGZvbGxvdyBbQW1hem9uIFMzIGJ1Y2tldCByZXN0cmljdGlvbnMgYW5kIGxpbWl0YXRpb25zXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L3VzZXJndWlkZS9CdWNrZXRSZXN0cmljdGlvbnMuaHRtbCkgLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtCdWNrZXQgbmFtaW5nIHJ1bGVzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L3VzZXJndWlkZS9CdWNrZXRSZXN0cmljdGlvbnMuaHRtbCNidWNrZXRuYW1pbmdydWxlcykgLlxuICAgICAqXG4gICAgICogPiBJZiB5b3Ugc3BlY2lmeSBhIG5hbWUsIHlvdSBjYW4ndCBwZXJmb3JtIHVwZGF0ZXMgdGhhdCByZXF1aXJlIHJlcGxhY2VtZW50IG9mIHRoaXMgcmVzb3VyY2UuIFlvdSBjYW4gcGVyZm9ybSB1cGRhdGVzIHRoYXQgcmVxdWlyZSBubyBvciBzb21lIGludGVycnVwdGlvbi4gSWYgeW91IG5lZWQgdG8gcmVwbGFjZSB0aGUgcmVzb3VyY2UsIHNwZWNpZnkgYSBuZXcgbmFtZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXMzb3V0cG9zdHMtYnVja2V0Lmh0bWwjY2ZuLXMzb3V0cG9zdHMtYnVja2V0LWJ1Y2tldG5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBidWNrZXROYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgSUQgb2YgdGhlIE91dHBvc3Qgb2YgdGhlIHNwZWNpZmllZCBidWNrZXQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zM291dHBvc3RzLWJ1Y2tldC5odG1sI2Nmbi1zM291dHBvc3RzLWJ1Y2tldC1vdXRwb3N0aWRcbiAgICAgKi9cbiAgICByZWFkb25seSBvdXRwb3N0SWQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgbGlmZWN5Y2xlIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBTMyBvbiBPdXRwb3N0cyBidWNrZXQgb3IgcmVwbGFjZXMgYW4gZXhpc3RpbmcgbGlmZWN5Y2xlIGNvbmZpZ3VyYXRpb24uIE91dHBvc3RzIGJ1Y2tldHMgb25seSBzdXBwb3J0IGxpZmVjeWNsZSBjb25maWd1cmF0aW9ucyB0aGF0IGRlbGV0ZS9leHBpcmUgb2JqZWN0cyBhZnRlciBhIGNlcnRhaW4gcGVyaW9kIG9mIHRpbWUgYW5kIGFib3J0IGluY29tcGxldGUgbXVsdGlwYXJ0IHVwbG9hZHMuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zM291dHBvc3RzLWJ1Y2tldC5odG1sI2Nmbi1zM291dHBvc3RzLWJ1Y2tldC1saWZlY3ljbGVjb25maWd1cmF0aW9uXG4gICAgICovXG4gICAgcmVhZG9ubHkgbGlmZWN5Y2xlQ29uZmlndXJhdGlvbj86IENmbkJ1Y2tldC5MaWZlY3ljbGVDb25maWd1cmF0aW9uUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB0YWdzIGZvciBhbiBTMyBvbiBPdXRwb3N0cyBidWNrZXQuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW1VzaW5nIEFtYXpvbiBTMyBvbiBPdXRwb3N0c10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC91c2VyZ3VpZGUvUzNvbk91dHBvc3RzLmh0bWwpIC5cbiAgICAgKlxuICAgICAqIFVzZSB0YWdzIHRvIG9yZ2FuaXplIHlvdXIgQVdTIGJpbGwgdG8gcmVmbGVjdCB5b3VyIG93biBjb3N0IHN0cnVjdHVyZS4gVG8gZG8gdGhpcywgc2lnbiB1cCB0byBnZXQgeW91ciBBV1MgYWNjb3VudCBiaWxsIHdpdGggdGFnIGtleSB2YWx1ZXMgaW5jbHVkZWQuIFRoZW4sIHRvIHNlZSB0aGUgY29zdCBvZiBjb21iaW5lZCByZXNvdXJjZXMsIG9yZ2FuaXplIHlvdXIgYmlsbGluZyBpbmZvcm1hdGlvbiBhY2NvcmRpbmcgdG8gcmVzb3VyY2VzIHdpdGggdGhlIHNhbWUgdGFnIGtleSB2YWx1ZXMuIEZvciBleGFtcGxlLCB5b3UgY2FuIHRhZyBzZXZlcmFsIHJlc291cmNlcyB3aXRoIGEgc3BlY2lmaWMgYXBwbGljYXRpb24gbmFtZSwgYW5kIHRoZW4gb3JnYW5pemUgeW91ciBiaWxsaW5nIGluZm9ybWF0aW9uIHRvIHNlZSB0aGUgdG90YWwgY29zdCBvZiB0aGF0IGFwcGxpY2F0aW9uIGFjcm9zcyBzZXZlcmFsIHNlcnZpY2VzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtDb3N0IGFsbG9jYXRpb24gYW5kIHRhZ3NdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hd3NhY2NvdW50YmlsbGluZy9sYXRlc3QvYWJvdXR2Mi9jb3N0LWFsbG9jLXRhZ3MuaHRtbCkgLlxuICAgICAqXG4gICAgICogPiBXaXRoaW4gYSBidWNrZXQsIGlmIHlvdSBhZGQgYSB0YWcgdGhhdCBoYXMgdGhlIHNhbWUga2V5IGFzIGFuIGV4aXN0aW5nIHRhZywgdGhlIG5ldyB2YWx1ZSBvdmVyd3JpdGVzIHRoZSBvbGQgdmFsdWUuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW1VzaW5nIGNvc3QgYWxsb2NhdGlvbiBhbmQgYnVja2V0IHRhZ3NdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvdXNlcmd1aWRlL0Nvc3RBbGxvY1RhZ2dpbmcuaHRtbCkgLlxuICAgICAqXG4gICAgICogVG8gdXNlIHRoaXMgcmVzb3VyY2UsIHlvdSBtdXN0IGhhdmUgcGVybWlzc2lvbnMgdG8gcGVyZm9ybSB0aGUgYHMzLW91dHBvc3RzOlB1dEJ1Y2tldFRhZ2dpbmdgIC4gVGhlIFMzIG9uIE91dHBvc3RzIGJ1Y2tldCBvd25lciBoYXMgdGhpcyBwZXJtaXNzaW9uIGJ5IGRlZmF1bHQgYW5kIGNhbiBncmFudCB0aGlzIHBlcm1pc3Npb24gdG8gb3RoZXJzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBwZXJtaXNzaW9ucywgc2VlIFtQZXJtaXNzaW9ucyBSZWxhdGVkIHRvIEJ1Y2tldCBTdWJyZXNvdXJjZSBPcGVyYXRpb25zXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L3VzZXJndWlkZS91c2luZy13aXRoLXMzLWFjdGlvbnMuaHRtbCN1c2luZy13aXRoLXMzLWFjdGlvbnMtcmVsYXRlZC10by1idWNrZXQtc3VicmVzb3VyY2VzKSBhbmQgW01hbmFnaW5nIGFjY2VzcyBwZXJtaXNzaW9ucyB0byB5b3VyIEFtYXpvbiBTMyByZXNvdXJjZXNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvdXNlcmd1aWRlL3MzLWFjY2Vzcy1jb250cm9sLmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXMzb3V0cG9zdHMtYnVja2V0Lmh0bWwjY2ZuLXMzb3V0cG9zdHMtYnVja2V0LXRhZ3NcbiAgICAgKi9cbiAgICByZWFkb25seSB0YWdzPzogY2RrLkNmblRhZ1tdO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkJ1Y2tldFByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5CdWNrZXRQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5CdWNrZXRQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2J1Y2tldE5hbWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuYnVja2V0TmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYnVja2V0TmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5idWNrZXROYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdsaWZlY3ljbGVDb25maWd1cmF0aW9uJywgQ2ZuQnVja2V0X0xpZmVjeWNsZUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5saWZlY3ljbGVDb25maWd1cmF0aW9uKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdvdXRwb3N0SWQnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMub3V0cG9zdElkKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdvdXRwb3N0SWQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMub3V0cG9zdElkKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0YWdzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlQ2ZuVGFnKSkocHJvcGVydGllcy50YWdzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmbkJ1Y2tldFByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTM091dHBvc3RzOjpCdWNrZXRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkJ1Y2tldFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTM091dHBvc3RzOjpCdWNrZXRgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQnVja2V0UHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkJ1Y2tldFByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBCdWNrZXROYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmJ1Y2tldE5hbWUpLFxuICAgICAgICBPdXRwb3N0SWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMub3V0cG9zdElkKSxcbiAgICAgICAgTGlmZWN5Y2xlQ29uZmlndXJhdGlvbjogY2ZuQnVja2V0TGlmZWN5Y2xlQ29uZmlndXJhdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmxpZmVjeWNsZUNvbmZpZ3VyYXRpb24pLFxuICAgICAgICBUYWdzOiBjZGsubGlzdE1hcHBlcihjZGsuY2ZuVGFnVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy50YWdzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuQnVja2V0UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5CdWNrZXRQcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuQnVja2V0UHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdidWNrZXROYW1lJywgJ0J1Y2tldE5hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkJ1Y2tldE5hbWUpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ291dHBvc3RJZCcsICdPdXRwb3N0SWQnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLk91dHBvc3RJZCkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbGlmZWN5Y2xlQ29uZmlndXJhdGlvbicsICdMaWZlY3ljbGVDb25maWd1cmF0aW9uJywgcHJvcGVydGllcy5MaWZlY3ljbGVDb25maWd1cmF0aW9uICE9IG51bGwgPyBDZm5CdWNrZXRMaWZlY3ljbGVDb25maWd1cmF0aW9uUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5MaWZlY3ljbGVDb25maWd1cmF0aW9uKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0YWdzJywgJ1RhZ3MnLCBwcm9wZXJ0aWVzLlRhZ3MgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRDZm5UYWcpKHByb3BlcnRpZXMuVGFncykgOiB1bmRlZmluZWQgYXMgYW55KTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OlMzT3V0cG9zdHM6OkJ1Y2tldGBcbiAqXG4gKiBUaGUgQVdTOjpTM091dHBvc3RzOjpCdWNrZXQgcmVzb3VyY2Ugc3BlY2lmaWVzIGEgbmV3IEFtYXpvbiBTMyBvbiBPdXRwb3N0cyBidWNrZXQuIFRvIGNyZWF0ZSBhbiBTMyBvbiBPdXRwb3N0cyBidWNrZXQsIHlvdSBtdXN0IGhhdmUgUzMgb24gT3V0cG9zdHMgY2FwYWNpdHkgcHJvdmlzaW9uZWQgb24geW91ciBPdXRwb3N0LiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtVc2luZyBBbWF6b24gUzMgb24gT3V0cG9zdHNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvdXNlcmd1aWRlL1Mzb25PdXRwb3N0cy5odG1sKSAuXG4gKlxuICogUzMgb24gT3V0cG9zdHMgYnVja2V0cyBzdXBwb3J0IHRoZSBmb2xsb3dpbmc6XG4gKlxuICogLSBUYWdzXG4gKiAtIExpZmVjeWNsZSBjb25maWd1cmF0aW9uIHJ1bGVzIGZvciBkZWxldGluZyBleHBpcmVkIG9iamVjdHNcbiAqXG4gKiBGb3IgYSBjb21wbGV0ZSBsaXN0IG9mIHJlc3RyaWN0aW9ucyBhbmQgQW1hem9uIFMzIGZlYXR1cmUgbGltaXRhdGlvbnMgb24gUzMgb24gT3V0cG9zdHMsIHNlZSBbQW1hem9uIFMzIG9uIE91dHBvc3RzIFJlc3RyaWN0aW9ucyBhbmQgTGltaXRhdGlvbnNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvdXNlcmd1aWRlL1MzT25PdXRwb3N0c1Jlc3RyaWN0aW9uc0xpbWl0YXRpb25zLmh0bWwpIC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OlMzT3V0cG9zdHM6OkJ1Y2tldFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXMzb3V0cG9zdHMtYnVja2V0Lmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmbkJ1Y2tldCBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OlMzT3V0cG9zdHM6OkJ1Y2tldFwiO1xuXG4gICAgLyoqXG4gICAgICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdFxuICAgICAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS5cbiAgICAgKiBVc2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlc291cmNlQXR0cmlidXRlczogYW55LCBvcHRpb25zOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyk6IENmbkJ1Y2tldCB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuQnVja2V0UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbkJ1Y2tldChzY29wZSwgaWQsIHByb3BzUmVzdWx0LnZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcEtleSwgcHJvcFZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHNSZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKSkgIHtcbiAgICAgICAgICAgIHJldC5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BLZXksIHByb3BWYWwpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMucGFyc2VyLmhhbmRsZUF0dHJpYnV0ZXMocmV0LCByZXNvdXJjZUF0dHJpYnV0ZXMsIGlkKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBBUk4gb2YgdGhlIHNwZWNpZmllZCBidWNrZXQuXG4gICAgICpcbiAgICAgKiBFeGFtcGxlOiBgYXJuOmF3czpzM091dHBvc3RzOjo6RE9DLUVYQU1QTEUtQlVDS0VUYFxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBBcm5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0ckFybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQSBuYW1lIGZvciB0aGUgUzMgb24gT3V0cG9zdHMgYnVja2V0LiBJZiB5b3UgZG9uJ3Qgc3BlY2lmeSBhIG5hbWUsIEFXUyBDbG91ZEZvcm1hdGlvbiBnZW5lcmF0ZXMgYSB1bmlxdWUgSUQgYW5kIHVzZXMgdGhhdCBJRCBmb3IgdGhlIGJ1Y2tldCBuYW1lLiBUaGUgYnVja2V0IG5hbWUgbXVzdCBjb250YWluIG9ubHkgbG93ZXJjYXNlIGxldHRlcnMsIG51bWJlcnMsIHBlcmlvZHMgKC4pLCBhbmQgZGFzaGVzICgtKSBhbmQgbXVzdCBmb2xsb3cgW0FtYXpvbiBTMyBidWNrZXQgcmVzdHJpY3Rpb25zIGFuZCBsaW1pdGF0aW9uc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC91c2VyZ3VpZGUvQnVja2V0UmVzdHJpY3Rpb25zLmh0bWwpIC4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbQnVja2V0IG5hbWluZyBydWxlc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC91c2VyZ3VpZGUvQnVja2V0UmVzdHJpY3Rpb25zLmh0bWwjYnVja2V0bmFtaW5ncnVsZXMpIC5cbiAgICAgKlxuICAgICAqID4gSWYgeW91IHNwZWNpZnkgYSBuYW1lLCB5b3UgY2FuJ3QgcGVyZm9ybSB1cGRhdGVzIHRoYXQgcmVxdWlyZSByZXBsYWNlbWVudCBvZiB0aGlzIHJlc291cmNlLiBZb3UgY2FuIHBlcmZvcm0gdXBkYXRlcyB0aGF0IHJlcXVpcmUgbm8gb3Igc29tZSBpbnRlcnJ1cHRpb24uIElmIHlvdSBuZWVkIHRvIHJlcGxhY2UgdGhlIHJlc291cmNlLCBzcGVjaWZ5IGEgbmV3IG5hbWUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zM291dHBvc3RzLWJ1Y2tldC5odG1sI2Nmbi1zM291dHBvc3RzLWJ1Y2tldC1idWNrZXRuYW1lXG4gICAgICovXG4gICAgcHVibGljIGJ1Y2tldE5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBJRCBvZiB0aGUgT3V0cG9zdCBvZiB0aGUgc3BlY2lmaWVkIGJ1Y2tldC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXMzb3V0cG9zdHMtYnVja2V0Lmh0bWwjY2ZuLXMzb3V0cG9zdHMtYnVja2V0LW91dHBvc3RpZFxuICAgICAqL1xuICAgIHB1YmxpYyBvdXRwb3N0SWQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgbGlmZWN5Y2xlIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBTMyBvbiBPdXRwb3N0cyBidWNrZXQgb3IgcmVwbGFjZXMgYW4gZXhpc3RpbmcgbGlmZWN5Y2xlIGNvbmZpZ3VyYXRpb24uIE91dHBvc3RzIGJ1Y2tldHMgb25seSBzdXBwb3J0IGxpZmVjeWNsZSBjb25maWd1cmF0aW9ucyB0aGF0IGRlbGV0ZS9leHBpcmUgb2JqZWN0cyBhZnRlciBhIGNlcnRhaW4gcGVyaW9kIG9mIHRpbWUgYW5kIGFib3J0IGluY29tcGxldGUgbXVsdGlwYXJ0IHVwbG9hZHMuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zM291dHBvc3RzLWJ1Y2tldC5odG1sI2Nmbi1zM291dHBvc3RzLWJ1Y2tldC1saWZlY3ljbGVjb25maWd1cmF0aW9uXG4gICAgICovXG4gICAgcHVibGljIGxpZmVjeWNsZUNvbmZpZ3VyYXRpb246IENmbkJ1Y2tldC5MaWZlY3ljbGVDb25maWd1cmF0aW9uUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB0YWdzIGZvciBhbiBTMyBvbiBPdXRwb3N0cyBidWNrZXQuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW1VzaW5nIEFtYXpvbiBTMyBvbiBPdXRwb3N0c10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC91c2VyZ3VpZGUvUzNvbk91dHBvc3RzLmh0bWwpIC5cbiAgICAgKlxuICAgICAqIFVzZSB0YWdzIHRvIG9yZ2FuaXplIHlvdXIgQVdTIGJpbGwgdG8gcmVmbGVjdCB5b3VyIG93biBjb3N0IHN0cnVjdHVyZS4gVG8gZG8gdGhpcywgc2lnbiB1cCB0byBnZXQgeW91ciBBV1MgYWNjb3VudCBiaWxsIHdpdGggdGFnIGtleSB2YWx1ZXMgaW5jbHVkZWQuIFRoZW4sIHRvIHNlZSB0aGUgY29zdCBvZiBjb21iaW5lZCByZXNvdXJjZXMsIG9yZ2FuaXplIHlvdXIgYmlsbGluZyBpbmZvcm1hdGlvbiBhY2NvcmRpbmcgdG8gcmVzb3VyY2VzIHdpdGggdGhlIHNhbWUgdGFnIGtleSB2YWx1ZXMuIEZvciBleGFtcGxlLCB5b3UgY2FuIHRhZyBzZXZlcmFsIHJlc291cmNlcyB3aXRoIGEgc3BlY2lmaWMgYXBwbGljYXRpb24gbmFtZSwgYW5kIHRoZW4gb3JnYW5pemUgeW91ciBiaWxsaW5nIGluZm9ybWF0aW9uIHRvIHNlZSB0aGUgdG90YWwgY29zdCBvZiB0aGF0IGFwcGxpY2F0aW9uIGFjcm9zcyBzZXZlcmFsIHNlcnZpY2VzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtDb3N0IGFsbG9jYXRpb24gYW5kIHRhZ3NdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hd3NhY2NvdW50YmlsbGluZy9sYXRlc3QvYWJvdXR2Mi9jb3N0LWFsbG9jLXRhZ3MuaHRtbCkgLlxuICAgICAqXG4gICAgICogPiBXaXRoaW4gYSBidWNrZXQsIGlmIHlvdSBhZGQgYSB0YWcgdGhhdCBoYXMgdGhlIHNhbWUga2V5IGFzIGFuIGV4aXN0aW5nIHRhZywgdGhlIG5ldyB2YWx1ZSBvdmVyd3JpdGVzIHRoZSBvbGQgdmFsdWUuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW1VzaW5nIGNvc3QgYWxsb2NhdGlvbiBhbmQgYnVja2V0IHRhZ3NdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvdXNlcmd1aWRlL0Nvc3RBbGxvY1RhZ2dpbmcuaHRtbCkgLlxuICAgICAqXG4gICAgICogVG8gdXNlIHRoaXMgcmVzb3VyY2UsIHlvdSBtdXN0IGhhdmUgcGVybWlzc2lvbnMgdG8gcGVyZm9ybSB0aGUgYHMzLW91dHBvc3RzOlB1dEJ1Y2tldFRhZ2dpbmdgIC4gVGhlIFMzIG9uIE91dHBvc3RzIGJ1Y2tldCBvd25lciBoYXMgdGhpcyBwZXJtaXNzaW9uIGJ5IGRlZmF1bHQgYW5kIGNhbiBncmFudCB0aGlzIHBlcm1pc3Npb24gdG8gb3RoZXJzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBwZXJtaXNzaW9ucywgc2VlIFtQZXJtaXNzaW9ucyBSZWxhdGVkIHRvIEJ1Y2tldCBTdWJyZXNvdXJjZSBPcGVyYXRpb25zXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L3VzZXJndWlkZS91c2luZy13aXRoLXMzLWFjdGlvbnMuaHRtbCN1c2luZy13aXRoLXMzLWFjdGlvbnMtcmVsYXRlZC10by1idWNrZXQtc3VicmVzb3VyY2VzKSBhbmQgW01hbmFnaW5nIGFjY2VzcyBwZXJtaXNzaW9ucyB0byB5b3VyIEFtYXpvbiBTMyByZXNvdXJjZXNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvdXNlcmd1aWRlL3MzLWFjY2Vzcy1jb250cm9sLmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXMzb3V0cG9zdHMtYnVja2V0Lmh0bWwjY2ZuLXMzb3V0cG9zdHMtYnVja2V0LXRhZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGFnczogY2RrLlRhZ01hbmFnZXI7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6UzNPdXRwb3N0czo6QnVja2V0YC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuQnVja2V0UHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbkJ1Y2tldC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2J1Y2tldE5hbWUnLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ291dHBvc3RJZCcsIHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJBcm4gPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ0FybicsIGNkay5SZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKSk7XG5cbiAgICAgICAgdGhpcy5idWNrZXROYW1lID0gcHJvcHMuYnVja2V0TmFtZTtcbiAgICAgICAgdGhpcy5vdXRwb3N0SWQgPSBwcm9wcy5vdXRwb3N0SWQ7XG4gICAgICAgIHRoaXMubGlmZWN5Y2xlQ29uZmlndXJhdGlvbiA9IHByb3BzLmxpZmVjeWNsZUNvbmZpZ3VyYXRpb247XG4gICAgICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5TVEFOREFSRCwgXCJBV1M6OlMzT3V0cG9zdHM6OkJ1Y2tldFwiLCBwcm9wcy50YWdzLCB7IHRhZ1Byb3BlcnR5TmFtZTogJ3RhZ3MnIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuQnVja2V0LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBidWNrZXROYW1lOiB0aGlzLmJ1Y2tldE5hbWUsXG4gICAgICAgICAgICBvdXRwb3N0SWQ6IHRoaXMub3V0cG9zdElkLFxuICAgICAgICAgICAgbGlmZWN5Y2xlQ29uZmlndXJhdGlvbjogdGhpcy5saWZlY3ljbGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgdGFnczogdGhpcy50YWdzLnJlbmRlclRhZ3MoKSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5CdWNrZXRQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5CdWNrZXQge1xuICAgIC8qKlxuICAgICAqIFNwZWNpZmllcyB0aGUgZGF5cyBzaW5jZSB0aGUgaW5pdGlhdGlvbiBvZiBhbiBpbmNvbXBsZXRlIG11bHRpcGFydCB1cGxvYWQgdGhhdCBBbWF6b24gUzMgb24gT3V0cG9zdHMgd2FpdHMgYmVmb3JlIHBlcm1hbmVudGx5IHJlbW92aW5nIGFsbCBwYXJ0cyBvZiB0aGUgdXBsb2FkLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtBYm9ydGluZyBJbmNvbXBsZXRlIE11bHRpcGFydCBVcGxvYWRzIFVzaW5nIGEgQnVja2V0IExpZmVjeWNsZSBQb2xpY3ldKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvdXNlcmd1aWRlL21wdW92ZXJ2aWV3Lmh0bWwjbXB1LWFib3J0LWluY29tcGxldGUtbXB1LWxpZmVjeWNsZS1jb25maWcpIC5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXMzb3V0cG9zdHMtYnVja2V0LWFib3J0aW5jb21wbGV0ZW11bHRpcGFydHVwbG9hZC5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBBYm9ydEluY29tcGxldGVNdWx0aXBhcnRVcGxvYWRQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGVjaWZpZXMgdGhlIG51bWJlciBvZiBkYXlzIGFmdGVyIGluaXRpYXRpb24gdGhhdCBBbWF6b24gUzMgb24gT3V0cG9zdHMgYWJvcnRzIGFuIGluY29tcGxldGUgbXVsdGlwYXJ0IHVwbG9hZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1zM291dHBvc3RzLWJ1Y2tldC1hYm9ydGluY29tcGxldGVtdWx0aXBhcnR1cGxvYWQuaHRtbCNjZm4tczNvdXRwb3N0cy1idWNrZXQtYWJvcnRpbmNvbXBsZXRlbXVsdGlwYXJ0dXBsb2FkLWRheXNhZnRlcmluaXRpYXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGRheXNBZnRlckluaXRpYXRpb246IG51bWJlcjtcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQWJvcnRJbmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEFib3J0SW5jb21wbGV0ZU11bHRpcGFydFVwbG9hZFByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkJ1Y2tldF9BYm9ydEluY29tcGxldGVNdWx0aXBhcnRVcGxvYWRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RheXNBZnRlckluaXRpYXRpb24nLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuZGF5c0FmdGVySW5pdGlhdGlvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZGF5c0FmdGVySW5pdGlhdGlvbicsIGNkay52YWxpZGF0ZU51bWJlcikocHJvcGVydGllcy5kYXlzQWZ0ZXJJbml0aWF0aW9uKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkFib3J0SW5jb21wbGV0ZU11bHRpcGFydFVwbG9hZFByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTM091dHBvc3RzOjpCdWNrZXQuQWJvcnRJbmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBBYm9ydEluY29tcGxldGVNdWx0aXBhcnRVcGxvYWRQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6UzNPdXRwb3N0czo6QnVja2V0LkFib3J0SW5jb21wbGV0ZU11bHRpcGFydFVwbG9hZGAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5CdWNrZXRBYm9ydEluY29tcGxldGVNdWx0aXBhcnRVcGxvYWRQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQnVja2V0X0Fib3J0SW5jb21wbGV0ZU11bHRpcGFydFVwbG9hZFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBEYXlzQWZ0ZXJJbml0aWF0aW9uOiBjZGsubnVtYmVyVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmRheXNBZnRlckluaXRpYXRpb24pLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5CdWNrZXRBYm9ydEluY29tcGxldGVNdWx0aXBhcnRVcGxvYWRQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkJ1Y2tldC5BYm9ydEluY29tcGxldGVNdWx0aXBhcnRVcGxvYWRQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5CdWNrZXQuQWJvcnRJbmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkUHJvcGVydHk+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdkYXlzQWZ0ZXJJbml0aWF0aW9uJywgJ0RheXNBZnRlckluaXRpYXRpb24nLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldE51bWJlcihwcm9wZXJ0aWVzLkRheXNBZnRlckluaXRpYXRpb24pKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5CdWNrZXQge1xuICAgIC8qKlxuICAgICAqXG4gICAgICpcbiAgICAgKiBAc3RydWN0XG4gICAgICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1zM291dHBvc3RzLWJ1Y2tldC1maWx0ZXIuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgRmlsdGVyUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkJ1Y2tldC5GaWx0ZXJQcm9wZXJ0eS5BbmRPcGVyYXRvcmBcbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1zM291dHBvc3RzLWJ1Y2tldC1maWx0ZXIuaHRtbCNjZm4tczNvdXRwb3N0cy1idWNrZXQtZmlsdGVyLWFuZG9wZXJhdG9yXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBhbmRPcGVyYXRvcj86IENmbkJ1Y2tldC5GaWx0ZXJBbmRPcGVyYXRvclByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlO1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkJ1Y2tldC5GaWx0ZXJQcm9wZXJ0eS5QcmVmaXhgXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtczNvdXRwb3N0cy1idWNrZXQtZmlsdGVyLmh0bWwjY2ZuLXMzb3V0cG9zdHMtYnVja2V0LWZpbHRlci1wcmVmaXhcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHByZWZpeD86IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5CdWNrZXQuRmlsdGVyUHJvcGVydHkuVGFnYFxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXMzb3V0cG9zdHMtYnVja2V0LWZpbHRlci5odG1sI2Nmbi1zM291dHBvc3RzLWJ1Y2tldC1maWx0ZXItdGFnXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSB0YWc/OiBDZm5CdWNrZXQuRmlsdGVyVGFnUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEZpbHRlclByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBGaWx0ZXJQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5CdWNrZXRfRmlsdGVyUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhbmRPcGVyYXRvcicsIENmbkJ1Y2tldF9GaWx0ZXJBbmRPcGVyYXRvclByb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLmFuZE9wZXJhdG9yKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdwcmVmaXgnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucHJlZml4KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0YWcnLCBDZm5CdWNrZXRfRmlsdGVyVGFnUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMudGFnKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkZpbHRlclByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTM091dHBvc3RzOjpCdWNrZXQuRmlsdGVyYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBGaWx0ZXJQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6UzNPdXRwb3N0czo6QnVja2V0LkZpbHRlcmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5CdWNrZXRGaWx0ZXJQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQnVja2V0X0ZpbHRlclByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBBbmRPcGVyYXRvcjogY2ZuQnVja2V0RmlsdGVyQW5kT3BlcmF0b3JQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hbmRPcGVyYXRvciksXG4gICAgICAgIFByZWZpeDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5wcmVmaXgpLFxuICAgICAgICBUYWc6IGNmbkJ1Y2tldEZpbHRlclRhZ1Byb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnRhZyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkJ1Y2tldEZpbHRlclByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuQnVja2V0LkZpbHRlclByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB7XG4gICAgaWYgKGNkay5pc1Jlc29sdmFibGVPYmplY3QocHJvcGVydGllcykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmbkJ1Y2tldC5GaWx0ZXJQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2FuZE9wZXJhdG9yJywgJ0FuZE9wZXJhdG9yJywgcHJvcGVydGllcy5BbmRPcGVyYXRvciAhPSBudWxsID8gQ2ZuQnVja2V0RmlsdGVyQW5kT3BlcmF0b3JQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLkFuZE9wZXJhdG9yKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdwcmVmaXgnLCAnUHJlZml4JywgcHJvcGVydGllcy5QcmVmaXggIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuUHJlZml4KSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0YWcnLCAnVGFnJywgcHJvcGVydGllcy5UYWcgIT0gbnVsbCA/IENmbkJ1Y2tldEZpbHRlclRhZ1Byb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuVGFnKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuQnVja2V0IHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtczNvdXRwb3N0cy1idWNrZXQtZmlsdGVyYW5kb3BlcmF0b3IuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgRmlsdGVyQW5kT3BlcmF0b3JQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuQnVja2V0LkZpbHRlckFuZE9wZXJhdG9yUHJvcGVydHkuUHJlZml4YFxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXMzb3V0cG9zdHMtYnVja2V0LWZpbHRlcmFuZG9wZXJhdG9yLmh0bWwjY2ZuLXMzb3V0cG9zdHMtYnVja2V0LWZpbHRlcmFuZG9wZXJhdG9yLXByZWZpeFxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgcHJlZml4Pzogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkJ1Y2tldC5GaWx0ZXJBbmRPcGVyYXRvclByb3BlcnR5LlRhZ3NgXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtczNvdXRwb3N0cy1idWNrZXQtZmlsdGVyYW5kb3BlcmF0b3IuaHRtbCNjZm4tczNvdXRwb3N0cy1idWNrZXQtZmlsdGVyYW5kb3BlcmF0b3ItdGFnc1xuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgdGFnczogQ2ZuQnVja2V0LkZpbHRlclRhZ1Byb3BlcnR5W107XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEZpbHRlckFuZE9wZXJhdG9yUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEZpbHRlckFuZE9wZXJhdG9yUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQnVja2V0X0ZpbHRlckFuZE9wZXJhdG9yUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdwcmVmaXgnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucHJlZml4KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0YWdzJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnRhZ3MpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhZ3MnLCBjZGsubGlzdFZhbGlkYXRvcihDZm5CdWNrZXRfRmlsdGVyVGFnUHJvcGVydHlWYWxpZGF0b3IpKShwcm9wZXJ0aWVzLnRhZ3MpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiRmlsdGVyQW5kT3BlcmF0b3JQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6UzNPdXRwb3N0czo6QnVja2V0LkZpbHRlckFuZE9wZXJhdG9yYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBGaWx0ZXJBbmRPcGVyYXRvclByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTM091dHBvc3RzOjpCdWNrZXQuRmlsdGVyQW5kT3BlcmF0b3JgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQnVja2V0RmlsdGVyQW5kT3BlcmF0b3JQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQnVja2V0X0ZpbHRlckFuZE9wZXJhdG9yUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIFByZWZpeDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5wcmVmaXgpLFxuICAgICAgICBUYWdzOiBjZGsubGlzdE1hcHBlcihjZm5CdWNrZXRGaWx0ZXJUYWdQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMudGFncyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkJ1Y2tldEZpbHRlckFuZE9wZXJhdG9yUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5CdWNrZXQuRmlsdGVyQW5kT3BlcmF0b3JQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5CdWNrZXQuRmlsdGVyQW5kT3BlcmF0b3JQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3ByZWZpeCcsICdQcmVmaXgnLCBwcm9wZXJ0aWVzLlByZWZpeCAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5QcmVmaXgpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3RhZ3MnLCAnVGFncycsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoQ2ZuQnVja2V0RmlsdGVyVGFnUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuVGFncykgYXMgYW55KTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5CdWNrZXQge1xuICAgIC8qKlxuICAgICAqXG4gICAgICpcbiAgICAgKiBAc3RydWN0XG4gICAgICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1zM291dHBvc3RzLWJ1Y2tldC1maWx0ZXJ0YWcuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgRmlsdGVyVGFnUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkJ1Y2tldC5GaWx0ZXJUYWdQcm9wZXJ0eS5LZXlgXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtczNvdXRwb3N0cy1idWNrZXQtZmlsdGVydGFnLmh0bWwjY2ZuLXMzb3V0cG9zdHMtYnVja2V0LWZpbHRlcnRhZy1rZXlcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGtleTogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkJ1Y2tldC5GaWx0ZXJUYWdQcm9wZXJ0eS5WYWx1ZWBcbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1zM291dHBvc3RzLWJ1Y2tldC1maWx0ZXJ0YWcuaHRtbCNjZm4tczNvdXRwb3N0cy1idWNrZXQtZmlsdGVydGFnLXZhbHVlXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSB2YWx1ZTogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBGaWx0ZXJUYWdQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgRmlsdGVyVGFnUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQnVja2V0X0ZpbHRlclRhZ1Byb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna2V5JywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmtleSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna2V5JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmtleSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndmFsdWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMudmFsdWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ZhbHVlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnZhbHVlKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkZpbHRlclRhZ1Byb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTM091dHBvc3RzOjpCdWNrZXQuRmlsdGVyVGFnYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBGaWx0ZXJUYWdQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6UzNPdXRwb3N0czo6QnVja2V0LkZpbHRlclRhZ2AgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5CdWNrZXRGaWx0ZXJUYWdQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQnVja2V0X0ZpbHRlclRhZ1Byb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBLZXk6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMua2V5KSxcbiAgICAgICAgVmFsdWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudmFsdWUpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5CdWNrZXRGaWx0ZXJUYWdQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkJ1Y2tldC5GaWx0ZXJUYWdQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5CdWNrZXQuRmlsdGVyVGFnUHJvcGVydHk+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdrZXknLCAnS2V5JywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5LZXkpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3ZhbHVlJywgJ1ZhbHVlJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5WYWx1ZSkpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbkJ1Y2tldCB7XG4gICAgLyoqXG4gICAgICogVGhlIGNvbnRhaW5lciBmb3IgdGhlIGxpZmVjeWNsZSBjb25maWd1cmF0aW9uIGZvciB0aGUgb2JqZWN0cyBzdG9yZWQgaW4gYW4gUzMgb24gT3V0cG9zdHMgYnVja2V0LlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtczNvdXRwb3N0cy1idWNrZXQtbGlmZWN5Y2xlY29uZmlndXJhdGlvbi5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBMaWZlY3ljbGVDb25maWd1cmF0aW9uUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGNvbnRhaW5lciBmb3IgdGhlIGxpZmVjeWNsZSBjb25maWd1cmF0aW9uIHJ1bGVzIGZvciB0aGUgb2JqZWN0cyBzdG9yZWQgaW4gdGhlIFMzIG9uIE91dHBvc3RzIGJ1Y2tldC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1zM291dHBvc3RzLWJ1Y2tldC1saWZlY3ljbGVjb25maWd1cmF0aW9uLmh0bWwjY2ZuLXMzb3V0cG9zdHMtYnVja2V0LWxpZmVjeWNsZWNvbmZpZ3VyYXRpb24tcnVsZXNcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHJ1bGVzOiBBcnJheTxDZm5CdWNrZXQuUnVsZVByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZTtcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgTGlmZWN5Y2xlQ29uZmlndXJhdGlvblByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBMaWZlY3ljbGVDb25maWd1cmF0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQnVja2V0X0xpZmVjeWNsZUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3J1bGVzJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnJ1bGVzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdydWxlcycsIGNkay5saXN0VmFsaWRhdG9yKENmbkJ1Y2tldF9SdWxlUHJvcGVydHlWYWxpZGF0b3IpKShwcm9wZXJ0aWVzLnJ1bGVzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkxpZmVjeWNsZUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6UzNPdXRwb3N0czo6QnVja2V0LkxpZmVjeWNsZUNvbmZpZ3VyYXRpb25gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYExpZmVjeWNsZUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6UzNPdXRwb3N0czo6QnVja2V0LkxpZmVjeWNsZUNvbmZpZ3VyYXRpb25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQnVja2V0TGlmZWN5Y2xlQ29uZmlndXJhdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5CdWNrZXRfTGlmZWN5Y2xlQ29uZmlndXJhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBSdWxlczogY2RrLmxpc3RNYXBwZXIoY2ZuQnVja2V0UnVsZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5ydWxlcyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkJ1Y2tldExpZmVjeWNsZUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkJ1Y2tldC5MaWZlY3ljbGVDb25maWd1cmF0aW9uUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuQnVja2V0LkxpZmVjeWNsZUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3J1bGVzJywgJ1J1bGVzJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShDZm5CdWNrZXRSdWxlUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuUnVsZXMpKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5CdWNrZXQge1xuICAgIC8qKlxuICAgICAqIEEgY29udGFpbmVyIGZvciBhbiBBbWF6b24gUzMgb24gT3V0cG9zdHMgYnVja2V0IGxpZmVjeWNsZSBydWxlLlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtczNvdXRwb3N0cy1idWNrZXQtcnVsZS5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBSdWxlUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGNvbnRhaW5lciBmb3IgdGhlIGFib3J0IGluY29tcGxldGUgbXVsdGlwYXJ0IHVwbG9hZCBydWxlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXMzb3V0cG9zdHMtYnVja2V0LXJ1bGUuaHRtbCNjZm4tczNvdXRwb3N0cy1idWNrZXQtcnVsZS1hYm9ydGluY29tcGxldGVtdWx0aXBhcnR1cGxvYWRcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGFib3J0SW5jb21wbGV0ZU11bHRpcGFydFVwbG9hZD86IENmbkJ1Y2tldC5BYm9ydEluY29tcGxldGVNdWx0aXBhcnRVcGxvYWRQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwZWNpZmllcyB0aGUgZXhwaXJhdGlvbiBmb3IgdGhlIGxpZmVjeWNsZSBvZiB0aGUgb2JqZWN0IGJ5IHNwZWNpZnlpbmcgYW4gZXhwaXJ5IGRhdGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtczNvdXRwb3N0cy1idWNrZXQtcnVsZS5odG1sI2Nmbi1zM291dHBvc3RzLWJ1Y2tldC1ydWxlLWV4cGlyYXRpb25kYXRlXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBleHBpcmF0aW9uRGF0ZT86IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwZWNpZmllcyB0aGUgZXhwaXJhdGlvbiBmb3IgdGhlIGxpZmVjeWNsZSBvZiB0aGUgb2JqZWN0IGluIHRoZSBmb3JtIG9mIGRheXMgdGhhdCB0aGUgb2JqZWN0IGhhcyBiZWVuIGluIHRoZSBTMyBvbiBPdXRwb3N0cyBidWNrZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtczNvdXRwb3N0cy1idWNrZXQtcnVsZS5odG1sI2Nmbi1zM291dHBvc3RzLWJ1Y2tldC1ydWxlLWV4cGlyYXRpb25pbmRheXNcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGV4cGlyYXRpb25JbkRheXM/OiBudW1iZXI7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgY29udGFpbmVyIGZvciB0aGUgZmlsdGVyIG9mIHRoZSBsaWZlY3ljbGUgcnVsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1zM291dHBvc3RzLWJ1Y2tldC1ydWxlLmh0bWwjY2ZuLXMzb3V0cG9zdHMtYnVja2V0LXJ1bGUtZmlsdGVyXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBmaWx0ZXI/OiBhbnkgfCBjZGsuSVJlc29sdmFibGU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBsaWZlY3ljbGUgcnVsZS4gVGhlIHZhbHVlIGNhbid0IGJlIGxvbmdlciB0aGFuIDI1NSBjaGFyYWN0ZXJzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXMzb3V0cG9zdHMtYnVja2V0LXJ1bGUuaHRtbCNjZm4tczNvdXRwb3N0cy1idWNrZXQtcnVsZS1pZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgaWQ/OiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBgRW5hYmxlZGAgLCB0aGUgcnVsZSBpcyBjdXJyZW50bHkgYmVpbmcgYXBwbGllZC4gSWYgYERpc2FibGVkYCAsIHRoZSBydWxlIGlzIG5vdCBjdXJyZW50bHkgYmVpbmcgYXBwbGllZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1zM291dHBvc3RzLWJ1Y2tldC1ydWxlLmh0bWwjY2ZuLXMzb3V0cG9zdHMtYnVja2V0LXJ1bGUtc3RhdHVzXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBzdGF0dXM6IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgUnVsZVByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBSdWxlUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQnVja2V0X1J1bGVQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Fib3J0SW5jb21wbGV0ZU11bHRpcGFydFVwbG9hZCcsIENmbkJ1Y2tldF9BYm9ydEluY29tcGxldGVNdWx0aXBhcnRVcGxvYWRQcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5hYm9ydEluY29tcGxldGVNdWx0aXBhcnRVcGxvYWQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2V4cGlyYXRpb25EYXRlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmV4cGlyYXRpb25EYXRlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdleHBpcmF0aW9uSW5EYXlzJywgY2RrLnZhbGlkYXRlTnVtYmVyKShwcm9wZXJ0aWVzLmV4cGlyYXRpb25JbkRheXMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2ZpbHRlcicsIGNkay52YWxpZGF0ZU9iamVjdCkocHJvcGVydGllcy5maWx0ZXIpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2lkJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmlkKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzdGF0dXMnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuc3RhdHVzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzdGF0dXMnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuc3RhdHVzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlJ1bGVQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6UzNPdXRwb3N0czo6QnVja2V0LlJ1bGVgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFJ1bGVQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6UzNPdXRwb3N0czo6QnVja2V0LlJ1bGVgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQnVja2V0UnVsZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5CdWNrZXRfUnVsZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBBYm9ydEluY29tcGxldGVNdWx0aXBhcnRVcGxvYWQ6IGNmbkJ1Y2tldEFib3J0SW5jb21wbGV0ZU11bHRpcGFydFVwbG9hZFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmFib3J0SW5jb21wbGV0ZU11bHRpcGFydFVwbG9hZCksXG4gICAgICAgIEV4cGlyYXRpb25EYXRlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmV4cGlyYXRpb25EYXRlKSxcbiAgICAgICAgRXhwaXJhdGlvbkluRGF5czogY2RrLm51bWJlclRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5leHBpcmF0aW9uSW5EYXlzKSxcbiAgICAgICAgRmlsdGVyOiBjZGsub2JqZWN0VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmZpbHRlciksXG4gICAgICAgIElkOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmlkKSxcbiAgICAgICAgU3RhdHVzOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnN0YXR1cyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkJ1Y2tldFJ1bGVQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkJ1Y2tldC5SdWxlUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuQnVja2V0LlJ1bGVQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2Fib3J0SW5jb21wbGV0ZU11bHRpcGFydFVwbG9hZCcsICdBYm9ydEluY29tcGxldGVNdWx0aXBhcnRVcGxvYWQnLCBwcm9wZXJ0aWVzLkFib3J0SW5jb21wbGV0ZU11bHRpcGFydFVwbG9hZCAhPSBudWxsID8gQ2ZuQnVja2V0QWJvcnRJbmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5BYm9ydEluY29tcGxldGVNdWx0aXBhcnRVcGxvYWQpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2V4cGlyYXRpb25EYXRlJywgJ0V4cGlyYXRpb25EYXRlJywgcHJvcGVydGllcy5FeHBpcmF0aW9uRGF0ZSAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5FeHBpcmF0aW9uRGF0ZSkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZXhwaXJhdGlvbkluRGF5cycsICdFeHBpcmF0aW9uSW5EYXlzJywgcHJvcGVydGllcy5FeHBpcmF0aW9uSW5EYXlzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldE51bWJlcihwcm9wZXJ0aWVzLkV4cGlyYXRpb25JbkRheXMpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2ZpbHRlcicsICdGaWx0ZXInLCBwcm9wZXJ0aWVzLkZpbHRlciAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBbnkocHJvcGVydGllcy5GaWx0ZXIpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2lkJywgJ0lkJywgcHJvcGVydGllcy5JZCAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5JZCkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnc3RhdHVzJywgJ1N0YXR1cycsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuU3RhdHVzKSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuQnVja2V0UG9saWN5YFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zM291dHBvc3RzLWJ1Y2tldHBvbGljeS5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQnVja2V0UG9saWN5UHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIEFtYXpvbiBTMyBPdXRwb3N0cyBidWNrZXQgdG8gd2hpY2ggdGhlIHBvbGljeSBhcHBsaWVzLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtczNvdXRwb3N0cy1idWNrZXRwb2xpY3kuaHRtbCNjZm4tczNvdXRwb3N0cy1idWNrZXRwb2xpY3ktYnVja2V0XG4gICAgICovXG4gICAgcmVhZG9ubHkgYnVja2V0OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBIHBvbGljeSBkb2N1bWVudCBjb250YWluaW5nIHBlcm1pc3Npb25zIHRvIGFkZCB0byB0aGUgc3BlY2lmaWVkIGJ1Y2tldC4gSW4gSUFNLCB5b3UgbXVzdCBwcm92aWRlIHBvbGljeSBkb2N1bWVudHMgaW4gSlNPTiBmb3JtYXQuIEhvd2V2ZXIsIGluIENsb3VkRm9ybWF0aW9uLCB5b3UgY2FuIHByb3ZpZGUgdGhlIHBvbGljeSBpbiBKU09OIG9yIFlBTUwgZm9ybWF0IGJlY2F1c2UgQ2xvdWRGb3JtYXRpb24gY29udmVydHMgWUFNTCB0byBKU09OIGJlZm9yZSBzdWJtaXR0aW5nIGl0IHRvIElBTS4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSB0aGUgQVdTOjpJQU06OlBvbGljeSBbUG9saWN5RG9jdW1lbnRdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1pYW0tcG9saWN5Lmh0bWwjY2ZuLWlhbS1wb2xpY3ktcG9saWN5ZG9jdW1lbnQpIHJlc291cmNlIGRlc2NyaXB0aW9uIGluIHRoaXMgZ3VpZGUgYW5kIFtBY2Nlc3MgUG9saWN5IExhbmd1YWdlIE92ZXJ2aWV3XShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L3VzZXJndWlkZS9hY2Nlc3MtcG9saWN5LWxhbmd1YWdlLW92ZXJ2aWV3Lmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXMzb3V0cG9zdHMtYnVja2V0cG9saWN5Lmh0bWwjY2ZuLXMzb3V0cG9zdHMtYnVja2V0cG9saWN5LXBvbGljeWRvY3VtZW50XG4gICAgICovXG4gICAgcmVhZG9ubHkgcG9saWN5RG9jdW1lbnQ6IGFueSB8IGNkay5JUmVzb2x2YWJsZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5CdWNrZXRQb2xpY3lQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuQnVja2V0UG9saWN5UHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQnVja2V0UG9saWN5UHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdidWNrZXQnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuYnVja2V0KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdidWNrZXQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYnVja2V0KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdwb2xpY3lEb2N1bWVudCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5wb2xpY3lEb2N1bWVudCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncG9saWN5RG9jdW1lbnQnLCBjZGsudmFsaWRhdGVPYmplY3QpKHByb3BlcnRpZXMucG9saWN5RG9jdW1lbnQpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuQnVja2V0UG9saWN5UHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlMzT3V0cG9zdHM6OkJ1Y2tldFBvbGljeWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuQnVja2V0UG9saWN5UHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlMzT3V0cG9zdHM6OkJ1Y2tldFBvbGljeWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5CdWNrZXRQb2xpY3lQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQnVja2V0UG9saWN5UHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIEJ1Y2tldDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5idWNrZXQpLFxuICAgICAgICBQb2xpY3lEb2N1bWVudDogY2RrLm9iamVjdFRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5wb2xpY3lEb2N1bWVudCksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkJ1Y2tldFBvbGljeVByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuQnVja2V0UG9saWN5UHJvcHM+IHtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmbkJ1Y2tldFBvbGljeVByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnYnVja2V0JywgJ0J1Y2tldCcsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuQnVja2V0KSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdwb2xpY3lEb2N1bWVudCcsICdQb2xpY3lEb2N1bWVudCcsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QW55KHByb3BlcnRpZXMuUG9saWN5RG9jdW1lbnQpKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OlMzT3V0cG9zdHM6OkJ1Y2tldFBvbGljeWBcbiAqXG4gKiBUaGlzIHJlc291cmNlIGFwcGxpZXMgYSBidWNrZXQgcG9saWN5IHRvIGFuIEFtYXpvbiBTMyBvbiBPdXRwb3N0cyBidWNrZXQuXG4gKlxuICogSWYgeW91IGFyZSB1c2luZyBhbiBpZGVudGl0eSBvdGhlciB0aGFuIHRoZSByb290IHVzZXIgb2YgdGhlIEFXUyBhY2NvdW50IHRoYXQgb3ducyB0aGUgUzMgb24gT3V0cG9zdHMgYnVja2V0LCB0aGUgY2FsbGluZyBpZGVudGl0eSBtdXN0IGhhdmUgdGhlIGBzMy1vdXRwb3N0czpQdXRCdWNrZXRQb2xpY3lgIHBlcm1pc3Npb25zIG9uIHRoZSBzcGVjaWZpZWQgT3V0cG9zdHMgYnVja2V0IGFuZCBiZWxvbmcgdG8gdGhlIGJ1Y2tldCBvd25lcidzIGFjY291bnQgaW4gb3JkZXIgdG8gdXNlIHRoaXMgcmVzb3VyY2UuXG4gKlxuICogSWYgeW91IGRvbid0IGhhdmUgYHMzLW91dHBvc3RzOlB1dEJ1Y2tldFBvbGljeWAgcGVybWlzc2lvbnMsIFMzIG9uIE91dHBvc3RzIHJldHVybnMgYSBgNDAzIEFjY2VzcyBEZW5pZWRgIGVycm9yLlxuICpcbiAqID4gVGhlIHJvb3QgdXNlciBvZiB0aGUgQVdTIGFjY291bnQgdGhhdCBvd25zIGFuIE91dHBvc3RzIGJ1Y2tldCBjYW4gKmFsd2F5cyogdXNlIHRoaXMgcmVzb3VyY2UsIGV2ZW4gaWYgdGhlIHBvbGljeSBleHBsaWNpdGx5IGRlbmllcyB0aGUgcm9vdCB1c2VyIHRoZSBhYmlsaXR5IHRvIHBlcmZvcm0gYWN0aW9ucyBvbiB0aGlzIHJlc291cmNlLlxuICpcbiAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgdGhlIEFXUzo6SUFNOjpQb2xpY3kgW1BvbGljeURvY3VtZW50XShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtaWFtLXBvbGljeS5odG1sI2Nmbi1pYW0tcG9saWN5LXBvbGljeWRvY3VtZW50KSByZXNvdXJjZSBkZXNjcmlwdGlvbiBpbiB0aGlzIGd1aWRlIGFuZCBbQWNjZXNzIFBvbGljeSBMYW5ndWFnZSBPdmVydmlld10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC91c2VyZ3VpZGUvYWNjZXNzLXBvbGljeS1sYW5ndWFnZS1vdmVydmlldy5odG1sKSAuXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpTM091dHBvc3RzOjpCdWNrZXRQb2xpY3lcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zM291dHBvc3RzLWJ1Y2tldHBvbGljeS5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5CdWNrZXRQb2xpY3kgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpTM091dHBvc3RzOjpCdWNrZXRQb2xpY3lcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5CdWNrZXRQb2xpY3kge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmbkJ1Y2tldFBvbGljeVByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHJlc291cmNlUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBDZm5CdWNrZXRQb2xpY3koc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIEFtYXpvbiBTMyBPdXRwb3N0cyBidWNrZXQgdG8gd2hpY2ggdGhlIHBvbGljeSBhcHBsaWVzLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtczNvdXRwb3N0cy1idWNrZXRwb2xpY3kuaHRtbCNjZm4tczNvdXRwb3N0cy1idWNrZXRwb2xpY3ktYnVja2V0XG4gICAgICovXG4gICAgcHVibGljIGJ1Y2tldDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQSBwb2xpY3kgZG9jdW1lbnQgY29udGFpbmluZyBwZXJtaXNzaW9ucyB0byBhZGQgdG8gdGhlIHNwZWNpZmllZCBidWNrZXQuIEluIElBTSwgeW91IG11c3QgcHJvdmlkZSBwb2xpY3kgZG9jdW1lbnRzIGluIEpTT04gZm9ybWF0LiBIb3dldmVyLCBpbiBDbG91ZEZvcm1hdGlvbiwgeW91IGNhbiBwcm92aWRlIHRoZSBwb2xpY3kgaW4gSlNPTiBvciBZQU1MIGZvcm1hdCBiZWNhdXNlIENsb3VkRm9ybWF0aW9uIGNvbnZlcnRzIFlBTUwgdG8gSlNPTiBiZWZvcmUgc3VibWl0dGluZyBpdCB0byBJQU0uIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgdGhlIEFXUzo6SUFNOjpQb2xpY3kgW1BvbGljeURvY3VtZW50XShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtaWFtLXBvbGljeS5odG1sI2Nmbi1pYW0tcG9saWN5LXBvbGljeWRvY3VtZW50KSByZXNvdXJjZSBkZXNjcmlwdGlvbiBpbiB0aGlzIGd1aWRlIGFuZCBbQWNjZXNzIFBvbGljeSBMYW5ndWFnZSBPdmVydmlld10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC91c2VyZ3VpZGUvYWNjZXNzLXBvbGljeS1sYW5ndWFnZS1vdmVydmlldy5odG1sKSAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zM291dHBvc3RzLWJ1Y2tldHBvbGljeS5odG1sI2Nmbi1zM291dHBvc3RzLWJ1Y2tldHBvbGljeS1wb2xpY3lkb2N1bWVudFxuICAgICAqL1xuICAgIHB1YmxpYyBwb2xpY3lEb2N1bWVudDogYW55IHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OlMzT3V0cG9zdHM6OkJ1Y2tldFBvbGljeWAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbkJ1Y2tldFBvbGljeVByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5CdWNrZXRQb2xpY3kuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdidWNrZXQnLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ3BvbGljeURvY3VtZW50JywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5idWNrZXQgPSBwcm9wcy5idWNrZXQ7XG4gICAgICAgIHRoaXMucG9saWN5RG9jdW1lbnQgPSBwcm9wcy5wb2xpY3lEb2N1bWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmbkJ1Y2tldFBvbGljeS5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYnVja2V0OiB0aGlzLmJ1Y2tldCxcbiAgICAgICAgICAgIHBvbGljeURvY3VtZW50OiB0aGlzLnBvbGljeURvY3VtZW50LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmbkJ1Y2tldFBvbGljeVByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmbkVuZHBvaW50YFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zM291dHBvc3RzLWVuZHBvaW50Lmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5FbmRwb2ludFByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBJRCBvZiB0aGUgT3V0cG9zdC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXMzb3V0cG9zdHMtZW5kcG9pbnQuaHRtbCNjZm4tczNvdXRwb3N0cy1lbmRwb2ludC1vdXRwb3N0aWRcbiAgICAgKi9cbiAgICByZWFkb25seSBvdXRwb3N0SWQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBJRCBvZiB0aGUgc2VjdXJpdHkgZ3JvdXAgdG8gdXNlIHdpdGggdGhlIGVuZHBvaW50LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtczNvdXRwb3N0cy1lbmRwb2ludC5odG1sI2Nmbi1zM291dHBvc3RzLWVuZHBvaW50LXNlY3VyaXR5Z3JvdXBpZFxuICAgICAqL1xuICAgIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXBJZDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIElEIG9mIHRoZSBzdWJuZXQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zM291dHBvc3RzLWVuZHBvaW50Lmh0bWwjY2ZuLXMzb3V0cG9zdHMtZW5kcG9pbnQtc3VibmV0aWRcbiAgICAgKi9cbiAgICByZWFkb25seSBzdWJuZXRJZDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNvbnRhaW5lciBmb3IgdGhlIHR5cGUgb2YgY29ubmVjdGl2aXR5IHVzZWQgdG8gYWNjZXNzIHRoZSBBbWF6b24gUzMgb24gT3V0cG9zdHMgZW5kcG9pbnQuIFRvIHVzZSB0aGUgQW1hem9uIFZQQyAsIGNob29zZSBgUHJpdmF0ZWAgLiBUbyB1c2UgdGhlIGVuZHBvaW50IHdpdGggYW4gb24tcHJlbWlzZXMgbmV0d29yaywgY2hvb3NlIGBDdXN0b21lck93bmVkSXBgIC4gSWYgeW91IGNob29zZSBgQ3VzdG9tZXJPd25lZElwYCAsIHlvdSBtdXN0IGFsc28gcHJvdmlkZSB0aGUgY3VzdG9tZXItb3duZWQgSVAgYWRkcmVzcyBwb29sIChDb0lQIHBvb2wpLlxuICAgICAqXG4gICAgICogPiBgUHJpdmF0ZWAgaXMgdGhlIGRlZmF1bHQgYWNjZXNzIHR5cGUgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zM291dHBvc3RzLWVuZHBvaW50Lmh0bWwjY2ZuLXMzb3V0cG9zdHMtZW5kcG9pbnQtYWNjZXNzdHlwZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGFjY2Vzc1R5cGU/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgSUQgb2YgdGhlIGN1c3RvbWVyLW93bmVkIElQdjQgYWRkcmVzcyBwb29sIChDb0lQIHBvb2wpIGZvciB0aGUgZW5kcG9pbnQuIElQIGFkZHJlc3NlcyBhcmUgYWxsb2NhdGVkIGZyb20gdGhpcyBwb29sIGZvciB0aGUgZW5kcG9pbnQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zM291dHBvc3RzLWVuZHBvaW50Lmh0bWwjY2ZuLXMzb3V0cG9zdHMtZW5kcG9pbnQtY3VzdG9tZXJvd25lZGlwdjRwb29sXG4gICAgICovXG4gICAgcmVhZG9ubHkgY3VzdG9tZXJPd25lZElwdjRQb29sPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkVuZHBvaW50UHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkVuZHBvaW50UHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuRW5kcG9pbnRQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2FjY2Vzc1R5cGUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYWNjZXNzVHlwZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY3VzdG9tZXJPd25lZElwdjRQb29sJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmN1c3RvbWVyT3duZWRJcHY0UG9vbCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignb3V0cG9zdElkJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLm91dHBvc3RJZCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignb3V0cG9zdElkJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLm91dHBvc3RJZCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc2VjdXJpdHlHcm91cElkJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnNlY3VyaXR5R3JvdXBJZCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc2VjdXJpdHlHcm91cElkJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnNlY3VyaXR5R3JvdXBJZCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc3VibmV0SWQnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuc3VibmV0SWQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3N1Ym5ldElkJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnN1Ym5ldElkKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmbkVuZHBvaW50UHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlMzT3V0cG9zdHM6OkVuZHBvaW50YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5FbmRwb2ludFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTM091dHBvc3RzOjpFbmRwb2ludGAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5FbmRwb2ludFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5FbmRwb2ludFByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBPdXRwb3N0SWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMub3V0cG9zdElkKSxcbiAgICAgICAgU2VjdXJpdHlHcm91cElkOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnNlY3VyaXR5R3JvdXBJZCksXG4gICAgICAgIFN1Ym5ldElkOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnN1Ym5ldElkKSxcbiAgICAgICAgQWNjZXNzVHlwZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hY2Nlc3NUeXBlKSxcbiAgICAgICAgQ3VzdG9tZXJPd25lZElwdjRQb29sOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmN1c3RvbWVyT3duZWRJcHY0UG9vbCksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkVuZHBvaW50UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5FbmRwb2ludFByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5FbmRwb2ludFByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnb3V0cG9zdElkJywgJ091dHBvc3RJZCcsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuT3V0cG9zdElkKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdzZWN1cml0eUdyb3VwSWQnLCAnU2VjdXJpdHlHcm91cElkJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5TZWN1cml0eUdyb3VwSWQpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3N1Ym5ldElkJywgJ1N1Ym5ldElkJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5TdWJuZXRJZCkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnYWNjZXNzVHlwZScsICdBY2Nlc3NUeXBlJywgcHJvcGVydGllcy5BY2Nlc3NUeXBlICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkFjY2Vzc1R5cGUpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2N1c3RvbWVyT3duZWRJcHY0UG9vbCcsICdDdXN0b21lck93bmVkSXB2NFBvb2wnLCBwcm9wZXJ0aWVzLkN1c3RvbWVyT3duZWRJcHY0UG9vbCAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5DdXN0b21lck93bmVkSXB2NFBvb2wpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OlMzT3V0cG9zdHM6OkVuZHBvaW50YFxuICpcbiAqIFRoaXMgQVdTOjpTM091dHBvc3RzOjpFbmRwb2ludCByZXNvdXJjZSBzcGVjaWZpZXMgYW4gZW5kcG9pbnQgYW5kIGFzc29jaWF0ZXMgaXQgd2l0aCB0aGUgc3BlY2lmaWVkIE91dHBvc3QuXG4gKlxuICogQW1hem9uIFMzIG9uIE91dHBvc3RzIGFjY2VzcyBwb2ludHMgc2ltcGxpZnkgbWFuYWdpbmcgZGF0YSBhY2Nlc3MgYXQgc2NhbGUgZm9yIHNoYXJlZCBkYXRhc2V0cyBpbiBTMyBvbiBPdXRwb3N0cy4gUzMgb24gT3V0cG9zdHMgdXNlcyBlbmRwb2ludHMgdG8gY29ubmVjdCB0byBTMyBvbiBPdXRwb3N0cyBidWNrZXRzIHNvIHRoYXQgeW91IGNhbiBwZXJmb3JtIGFjdGlvbnMgd2l0aGluIHlvdXIgdmlydHVhbCBwcml2YXRlIGNsb3VkIChWUEMpLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtBY2Nlc3NpbmcgUzMgb24gT3V0cG9zdHMgdXNpbmcgVlBDLW9ubHkgYWNjZXNzIHBvaW50c10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC91c2VyZ3VpZGUvQWNjZXNzaW5nUzNPdXRwb3N0cy5odG1sKSAuXG4gKlxuICogPiBJdCBjYW4gdGFrZSB1cCB0byA1IG1pbnV0ZXMgZm9yIHRoaXMgcmVzb3VyY2UgdG8gYmUgY3JlYXRlZC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OlMzT3V0cG9zdHM6OkVuZHBvaW50XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtczNvdXRwb3N0cy1lbmRwb2ludC5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5FbmRwb2ludCBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OlMzT3V0cG9zdHM6OkVuZHBvaW50XCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuRW5kcG9pbnQge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmbkVuZHBvaW50UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbkVuZHBvaW50KHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBBUk4gb2YgdGhlIGVuZHBvaW50LlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBBcm5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0ckFybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFZQQyBDSURSIGJsb2NrIGNvbW1pdHRlZCBieSB0aGlzIGVuZHBvaW50LlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBDaWRyQmxvY2tcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0ckNpZHJCbG9jazogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHRpbWUgdGhlIGVuZHBvaW50IHdhcyBjcmVhdGVkLlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBDcmVhdGlvblRpbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0ckNyZWF0aW9uVGltZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIElEIG9mIHRoZSBlbmRwb2ludC5cbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgSWRcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0cklkOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmV0d29yayBpbnRlcmZhY2Ugb2YgdGhlIGVuZHBvaW50LlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBOZXR3b3JrSW50ZXJmYWNlc1xuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyTmV0d29ya0ludGVyZmFjZXM6IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBzdGF0dXMgb2YgdGhlIGVuZHBvaW50LlxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBTdGF0dXNcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0clN0YXR1czogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIElEIG9mIHRoZSBPdXRwb3N0LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtczNvdXRwb3N0cy1lbmRwb2ludC5odG1sI2Nmbi1zM291dHBvc3RzLWVuZHBvaW50LW91dHBvc3RpZFxuICAgICAqL1xuICAgIHB1YmxpYyBvdXRwb3N0SWQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBJRCBvZiB0aGUgc2VjdXJpdHkgZ3JvdXAgdG8gdXNlIHdpdGggdGhlIGVuZHBvaW50LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtczNvdXRwb3N0cy1lbmRwb2ludC5odG1sI2Nmbi1zM291dHBvc3RzLWVuZHBvaW50LXNlY3VyaXR5Z3JvdXBpZFxuICAgICAqL1xuICAgIHB1YmxpYyBzZWN1cml0eUdyb3VwSWQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBJRCBvZiB0aGUgc3VibmV0LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtczNvdXRwb3N0cy1lbmRwb2ludC5odG1sI2Nmbi1zM291dHBvc3RzLWVuZHBvaW50LXN1Ym5ldGlkXG4gICAgICovXG4gICAgcHVibGljIHN1Ym5ldElkOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29udGFpbmVyIGZvciB0aGUgdHlwZSBvZiBjb25uZWN0aXZpdHkgdXNlZCB0byBhY2Nlc3MgdGhlIEFtYXpvbiBTMyBvbiBPdXRwb3N0cyBlbmRwb2ludC4gVG8gdXNlIHRoZSBBbWF6b24gVlBDICwgY2hvb3NlIGBQcml2YXRlYCAuIFRvIHVzZSB0aGUgZW5kcG9pbnQgd2l0aCBhbiBvbi1wcmVtaXNlcyBuZXR3b3JrLCBjaG9vc2UgYEN1c3RvbWVyT3duZWRJcGAgLiBJZiB5b3UgY2hvb3NlIGBDdXN0b21lck93bmVkSXBgICwgeW91IG11c3QgYWxzbyBwcm92aWRlIHRoZSBjdXN0b21lci1vd25lZCBJUCBhZGRyZXNzIHBvb2wgKENvSVAgcG9vbCkuXG4gICAgICpcbiAgICAgKiA+IGBQcml2YXRlYCBpcyB0aGUgZGVmYXVsdCBhY2Nlc3MgdHlwZSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXMzb3V0cG9zdHMtZW5kcG9pbnQuaHRtbCNjZm4tczNvdXRwb3N0cy1lbmRwb2ludC1hY2Nlc3N0eXBlXG4gICAgICovXG4gICAgcHVibGljIGFjY2Vzc1R5cGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBJRCBvZiB0aGUgY3VzdG9tZXItb3duZWQgSVB2NCBhZGRyZXNzIHBvb2wgKENvSVAgcG9vbCkgZm9yIHRoZSBlbmRwb2ludC4gSVAgYWRkcmVzc2VzIGFyZSBhbGxvY2F0ZWQgZnJvbSB0aGlzIHBvb2wgZm9yIHRoZSBlbmRwb2ludC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXMzb3V0cG9zdHMtZW5kcG9pbnQuaHRtbCNjZm4tczNvdXRwb3N0cy1lbmRwb2ludC1jdXN0b21lcm93bmVkaXB2NHBvb2xcbiAgICAgKi9cbiAgICBwdWJsaWMgY3VzdG9tZXJPd25lZElwdjRQb29sOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6UzNPdXRwb3N0czo6RW5kcG9pbnRgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5FbmRwb2ludFByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5FbmRwb2ludC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ291dHBvc3RJZCcsIHRoaXMpO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnc2VjdXJpdHlHcm91cElkJywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdzdWJuZXRJZCcsIHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJBcm4gPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ0FybicsIGNkay5SZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKSk7XG4gICAgICAgIHRoaXMuYXR0ckNpZHJCbG9jayA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnQ2lkckJsb2NrJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcbiAgICAgICAgdGhpcy5hdHRyQ3JlYXRpb25UaW1lID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdDcmVhdGlvblRpbWUnLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuICAgICAgICB0aGlzLmF0dHJJZCA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnSWQnLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuICAgICAgICB0aGlzLmF0dHJOZXR3b3JrSW50ZXJmYWNlcyA9IHRoaXMuZ2V0QXR0KCdOZXR3b3JrSW50ZXJmYWNlcycsIGNkay5SZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKTtcbiAgICAgICAgdGhpcy5hdHRyU3RhdHVzID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdTdGF0dXMnLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuXG4gICAgICAgIHRoaXMub3V0cG9zdElkID0gcHJvcHMub3V0cG9zdElkO1xuICAgICAgICB0aGlzLnNlY3VyaXR5R3JvdXBJZCA9IHByb3BzLnNlY3VyaXR5R3JvdXBJZDtcbiAgICAgICAgdGhpcy5zdWJuZXRJZCA9IHByb3BzLnN1Ym5ldElkO1xuICAgICAgICB0aGlzLmFjY2Vzc1R5cGUgPSBwcm9wcy5hY2Nlc3NUeXBlO1xuICAgICAgICB0aGlzLmN1c3RvbWVyT3duZWRJcHY0UG9vbCA9IHByb3BzLmN1c3RvbWVyT3duZWRJcHY0UG9vbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmbkVuZHBvaW50LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvdXRwb3N0SWQ6IHRoaXMub3V0cG9zdElkLFxuICAgICAgICAgICAgc2VjdXJpdHlHcm91cElkOiB0aGlzLnNlY3VyaXR5R3JvdXBJZCxcbiAgICAgICAgICAgIHN1Ym5ldElkOiB0aGlzLnN1Ym5ldElkLFxuICAgICAgICAgICAgYWNjZXNzVHlwZTogdGhpcy5hY2Nlc3NUeXBlLFxuICAgICAgICAgICAgY3VzdG9tZXJPd25lZElwdjRQb29sOiB0aGlzLmN1c3RvbWVyT3duZWRJcHY0UG9vbCxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5FbmRwb2ludFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbkVuZHBvaW50IHtcbiAgICAvKipcbiAgICAgKiBUaGUgY29udGFpbmVyIGZvciB0aGUgbmV0d29yayBpbnRlcmZhY2UuXG4gICAgICpcbiAgICAgKiBAc3RydWN0XG4gICAgICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1zM291dHBvc3RzLWVuZHBvaW50LW5ldHdvcmtpbnRlcmZhY2UuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya0ludGVyZmFjZVByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBJRCBmb3IgdGhlIG5ldHdvcmsgaW50ZXJmYWNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXMzb3V0cG9zdHMtZW5kcG9pbnQtbmV0d29ya2ludGVyZmFjZS5odG1sI2Nmbi1zM291dHBvc3RzLWVuZHBvaW50LW5ldHdvcmtpbnRlcmZhY2UtbmV0d29ya2ludGVyZmFjZWlkXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBuZXR3b3JrSW50ZXJmYWNlSWQ6IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgTmV0d29ya0ludGVyZmFjZVByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBOZXR3b3JrSW50ZXJmYWNlUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuRW5kcG9pbnRfTmV0d29ya0ludGVyZmFjZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmV0d29ya0ludGVyZmFjZUlkJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLm5ldHdvcmtJbnRlcmZhY2VJZCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmV0d29ya0ludGVyZmFjZUlkJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLm5ldHdvcmtJbnRlcmZhY2VJZCkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJOZXR3b3JrSW50ZXJmYWNlUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlMzT3V0cG9zdHM6OkVuZHBvaW50Lk5ldHdvcmtJbnRlcmZhY2VgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYE5ldHdvcmtJbnRlcmZhY2VQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6UzNPdXRwb3N0czo6RW5kcG9pbnQuTmV0d29ya0ludGVyZmFjZWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5FbmRwb2ludE5ldHdvcmtJbnRlcmZhY2VQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuRW5kcG9pbnRfTmV0d29ya0ludGVyZmFjZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBOZXR3b3JrSW50ZXJmYWNlSWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubmV0d29ya0ludGVyZmFjZUlkKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuRW5kcG9pbnROZXR3b3JrSW50ZXJmYWNlUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5FbmRwb2ludC5OZXR3b3JrSW50ZXJmYWNlUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuRW5kcG9pbnQuTmV0d29ya0ludGVyZmFjZVByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbmV0d29ya0ludGVyZmFjZUlkJywgJ05ldHdvcmtJbnRlcmZhY2VJZCcsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuTmV0d29ya0ludGVyZmFjZUlkKSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG4iXX0=