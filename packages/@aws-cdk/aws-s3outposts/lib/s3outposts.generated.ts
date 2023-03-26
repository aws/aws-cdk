// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:09.335Z","fingerprint":"Dzp74br9GwuZzPBI/N9ftqg0H84TXh7KcmB2KmIeqCo="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAccessPoint`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html
 */
export interface CfnAccessPointProps {

    /**
     * The Amazon Resource Name (ARN) of the S3 on Outposts bucket that is associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html#cfn-s3outposts-accesspoint-bucket
     */
    readonly bucket: string;

    /**
     * The name of this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html#cfn-s3outposts-accesspoint-name
     */
    readonly name: string;

    /**
     * The virtual private cloud (VPC) configuration for this access point, if one exists.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html#cfn-s3outposts-accesspoint-vpcconfiguration
     */
    readonly vpcConfiguration: CfnAccessPoint.VpcConfigurationProperty | cdk.IResolvable;

    /**
     * The access point policy associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html#cfn-s3outposts-accesspoint-policy
     */
    readonly policy?: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnAccessPointProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessPointProps`
 *
 * @returns the result of the validation.
 */
function CfnAccessPointPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnAccessPointPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPointPropsValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Name: cdk.stringToCloudFormation(properties.name),
        VpcConfiguration: cfnAccessPointVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration),
        Policy: cdk.objectToCloudFormation(properties.policy),
    };
}

// @ts-ignore TS6133
function CfnAccessPointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPointProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPointProps>();
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
export class CfnAccessPoint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3Outposts::AccessPoint";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccessPoint {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAccessPointPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAccessPoint(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * This resource contains the details of the S3 on Outposts bucket access point ARN. This resource is read-only.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The Amazon Resource Name (ARN) of the S3 on Outposts bucket that is associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html#cfn-s3outposts-accesspoint-bucket
     */
    public bucket: string;

    /**
     * The name of this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html#cfn-s3outposts-accesspoint-name
     */
    public name: string;

    /**
     * The virtual private cloud (VPC) configuration for this access point, if one exists.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html#cfn-s3outposts-accesspoint-vpcconfiguration
     */
    public vpcConfiguration: CfnAccessPoint.VpcConfigurationProperty | cdk.IResolvable;

    /**
     * The access point policy associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html#cfn-s3outposts-accesspoint-policy
     */
    public policy: any | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::S3Outposts::AccessPoint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAccessPointProps) {
        super(scope, id, { type: CfnAccessPoint.CFN_RESOURCE_TYPE_NAME, properties: props });
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
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessPoint.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            bucket: this.bucket,
            name: this.name,
            vpcConfiguration: this.vpcConfiguration,
            policy: this.policy,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAccessPointPropsToCloudFormation(props);
    }
}

export namespace CfnAccessPoint {
    /**
     * Contains the virtual private cloud (VPC) configuration for the specified access point.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-accesspoint-vpcconfiguration.html
     */
    export interface VpcConfigurationProperty {
        /**
         * The ID of the VPC configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-accesspoint-vpcconfiguration.html#cfn-s3outposts-accesspoint-vpcconfiguration-vpcid
         */
        readonly vpcId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `VpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccessPoint_VpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnAccessPointVpcConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPoint_VpcConfigurationPropertyValidator(properties).assertSuccess();
    return {
        VpcId: cdk.stringToCloudFormation(properties.vpcId),
    };
}

// @ts-ignore TS6133
function CfnAccessPointVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPoint.VpcConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.VpcConfigurationProperty>();
    ret.addPropertyResult('vpcId', 'VpcId', properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnBucket`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html
 */
export interface CfnBucketProps {

    /**
     * A name for the S3 on Outposts bucket. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the bucket name. The bucket name must contain only lowercase letters, numbers, periods (.), and dashes (-) and must follow [Amazon S3 bucket restrictions and limitations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/BucketRestrictions.html) . For more information, see [Bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/BucketRestrictions.html#bucketnamingrules) .
     *
     * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you need to replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html#cfn-s3outposts-bucket-bucketname
     */
    readonly bucketName: string;

    /**
     * The ID of the Outpost of the specified bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html#cfn-s3outposts-bucket-outpostid
     */
    readonly outpostId: string;

    /**
     * Creates a new lifecycle configuration for the S3 on Outposts bucket or replaces an existing lifecycle configuration. Outposts buckets only support lifecycle configurations that delete/expire objects after a certain period of time and abort incomplete multipart uploads.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html#cfn-s3outposts-bucket-lifecycleconfiguration
     */
    readonly lifecycleConfiguration?: CfnBucket.LifecycleConfigurationProperty | cdk.IResolvable;

    /**
     * Sets the tags for an S3 on Outposts bucket. For more information, see [Using Amazon S3 on Outposts](https://docs.aws.amazon.com/AmazonS3/latest/userguide/S3onOutposts.html) .
     *
     * Use tags to organize your AWS bill to reflect your own cost structure. To do this, sign up to get your AWS account bill with tag key values included. Then, to see the cost of combined resources, organize your billing information according to resources with the same tag key values. For example, you can tag several resources with a specific application name, and then organize your billing information to see the total cost of that application across several services. For more information, see [Cost allocation and tags](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html) .
     *
     * > Within a bucket, if you add a tag that has the same key as an existing tag, the new value overwrites the old value. For more information, see [Using cost allocation and bucket tags](https://docs.aws.amazon.com/AmazonS3/latest/userguide/CostAllocTagging.html) .
     *
     * To use this resource, you must have permissions to perform the `s3-outposts:PutBucketTagging` . The S3 on Outposts bucket owner has this permission by default and can grant this permission to others. For more information about permissions, see [Permissions Related to Bucket Subresource Operations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-with-s3-actions.html#using-with-s3-actions-related-to-bucket-subresources) and [Managing access permissions to your Amazon S3 resources](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-access-control.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html#cfn-s3outposts-bucket-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnBucketProps`
 *
 * @param properties - the TypeScript properties of a `CfnBucketProps`
 *
 * @returns the result of the validation.
 */
function CfnBucketPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnBucketPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucketPropsValidator(properties).assertSuccess();
    return {
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        OutpostId: cdk.stringToCloudFormation(properties.outpostId),
        LifecycleConfiguration: cfnBucketLifecycleConfigurationPropertyToCloudFormation(properties.lifecycleConfiguration),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnBucketPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucketProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucketProps>();
    ret.addPropertyResult('bucketName', 'BucketName', cfn_parse.FromCloudFormation.getString(properties.BucketName));
    ret.addPropertyResult('outpostId', 'OutpostId', cfn_parse.FromCloudFormation.getString(properties.OutpostId));
    ret.addPropertyResult('lifecycleConfiguration', 'LifecycleConfiguration', properties.LifecycleConfiguration != null ? CfnBucketLifecycleConfigurationPropertyFromCloudFormation(properties.LifecycleConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
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
export class CfnBucket extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3Outposts::Bucket";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBucket {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnBucketPropsFromCloudFormation(resourceProperties);
        const ret = new CfnBucket(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the ARN of the specified bucket.
     *
     * Example: `arn:aws:s3Outposts:::DOC-EXAMPLE-BUCKET`
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * A name for the S3 on Outposts bucket. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the bucket name. The bucket name must contain only lowercase letters, numbers, periods (.), and dashes (-) and must follow [Amazon S3 bucket restrictions and limitations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/BucketRestrictions.html) . For more information, see [Bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/BucketRestrictions.html#bucketnamingrules) .
     *
     * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you need to replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html#cfn-s3outposts-bucket-bucketname
     */
    public bucketName: string;

    /**
     * The ID of the Outpost of the specified bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html#cfn-s3outposts-bucket-outpostid
     */
    public outpostId: string;

    /**
     * Creates a new lifecycle configuration for the S3 on Outposts bucket or replaces an existing lifecycle configuration. Outposts buckets only support lifecycle configurations that delete/expire objects after a certain period of time and abort incomplete multipart uploads.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html#cfn-s3outposts-bucket-lifecycleconfiguration
     */
    public lifecycleConfiguration: CfnBucket.LifecycleConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Sets the tags for an S3 on Outposts bucket. For more information, see [Using Amazon S3 on Outposts](https://docs.aws.amazon.com/AmazonS3/latest/userguide/S3onOutposts.html) .
     *
     * Use tags to organize your AWS bill to reflect your own cost structure. To do this, sign up to get your AWS account bill with tag key values included. Then, to see the cost of combined resources, organize your billing information according to resources with the same tag key values. For example, you can tag several resources with a specific application name, and then organize your billing information to see the total cost of that application across several services. For more information, see [Cost allocation and tags](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html) .
     *
     * > Within a bucket, if you add a tag that has the same key as an existing tag, the new value overwrites the old value. For more information, see [Using cost allocation and bucket tags](https://docs.aws.amazon.com/AmazonS3/latest/userguide/CostAllocTagging.html) .
     *
     * To use this resource, you must have permissions to perform the `s3-outposts:PutBucketTagging` . The S3 on Outposts bucket owner has this permission by default and can grant this permission to others. For more information about permissions, see [Permissions Related to Bucket Subresource Operations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-with-s3-actions.html#using-with-s3-actions-related-to-bucket-subresources) and [Managing access permissions to your Amazon S3 resources](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-access-control.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html#cfn-s3outposts-bucket-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::S3Outposts::Bucket`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBucketProps) {
        super(scope, id, { type: CfnBucket.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'bucketName', this);
        cdk.requireProperty(props, 'outpostId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.bucketName = props.bucketName;
        this.outpostId = props.outpostId;
        this.lifecycleConfiguration = props.lifecycleConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::S3Outposts::Bucket", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBucket.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            bucketName: this.bucketName,
            outpostId: this.outpostId,
            lifecycleConfiguration: this.lifecycleConfiguration,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBucketPropsToCloudFormation(props);
    }
}

export namespace CfnBucket {
    /**
     * Specifies the days since the initiation of an incomplete multipart upload that Amazon S3 on Outposts waits before permanently removing all parts of the upload. For more information, see [Aborting Incomplete Multipart Uploads Using a Bucket Lifecycle Policy](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html#mpu-abort-incomplete-mpu-lifecycle-config) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-abortincompletemultipartupload.html
     */
    export interface AbortIncompleteMultipartUploadProperty {
        /**
         * Specifies the number of days after initiation that Amazon S3 on Outposts aborts an incomplete multipart upload.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-abortincompletemultipartupload.html#cfn-s3outposts-bucket-abortincompletemultipartupload-daysafterinitiation
         */
        readonly daysAfterInitiation: number;
    }
}

/**
 * Determine whether the given properties match those of a `AbortIncompleteMultipartUploadProperty`
 *
 * @param properties - the TypeScript properties of a `AbortIncompleteMultipartUploadProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_AbortIncompleteMultipartUploadPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnBucketAbortIncompleteMultipartUploadPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_AbortIncompleteMultipartUploadPropertyValidator(properties).assertSuccess();
    return {
        DaysAfterInitiation: cdk.numberToCloudFormation(properties.daysAfterInitiation),
    };
}

// @ts-ignore TS6133
function CfnBucketAbortIncompleteMultipartUploadPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.AbortIncompleteMultipartUploadProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.AbortIncompleteMultipartUploadProperty>();
    ret.addPropertyResult('daysAfterInitiation', 'DaysAfterInitiation', cfn_parse.FromCloudFormation.getNumber(properties.DaysAfterInitiation));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filter.html
     */
    export interface FilterProperty {
        /**
         * `CfnBucket.FilterProperty.AndOperator`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filter.html#cfn-s3outposts-bucket-filter-andoperator
         */
        readonly andOperator?: CfnBucket.FilterAndOperatorProperty | cdk.IResolvable;
        /**
         * `CfnBucket.FilterProperty.Prefix`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filter.html#cfn-s3outposts-bucket-filter-prefix
         */
        readonly prefix?: string;
        /**
         * `CfnBucket.FilterProperty.Tag`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filter.html#cfn-s3outposts-bucket-filter-tag
         */
        readonly tag?: CfnBucket.FilterTagProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_FilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnBucketFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_FilterPropertyValidator(properties).assertSuccess();
    return {
        AndOperator: cfnBucketFilterAndOperatorPropertyToCloudFormation(properties.andOperator),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        Tag: cfnBucketFilterTagPropertyToCloudFormation(properties.tag),
    };
}

// @ts-ignore TS6133
function CfnBucketFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.FilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.FilterProperty>();
    ret.addPropertyResult('andOperator', 'AndOperator', properties.AndOperator != null ? CfnBucketFilterAndOperatorPropertyFromCloudFormation(properties.AndOperator) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('tag', 'Tag', properties.Tag != null ? CfnBucketFilterTagPropertyFromCloudFormation(properties.Tag) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filterandoperator.html
     */
    export interface FilterAndOperatorProperty {
        /**
         * `CfnBucket.FilterAndOperatorProperty.Prefix`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filterandoperator.html#cfn-s3outposts-bucket-filterandoperator-prefix
         */
        readonly prefix?: string;
        /**
         * `CfnBucket.FilterAndOperatorProperty.Tags`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filterandoperator.html#cfn-s3outposts-bucket-filterandoperator-tags
         */
        readonly tags: CfnBucket.FilterTagProperty[];
    }
}

/**
 * Determine whether the given properties match those of a `FilterAndOperatorProperty`
 *
 * @param properties - the TypeScript properties of a `FilterAndOperatorProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_FilterAndOperatorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnBucketFilterAndOperatorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_FilterAndOperatorPropertyValidator(properties).assertSuccess();
    return {
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        Tags: cdk.listMapper(cfnBucketFilterTagPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnBucketFilterAndOperatorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.FilterAndOperatorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.FilterAndOperatorProperty>();
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('tags', 'Tags', cfn_parse.FromCloudFormation.getArray(CfnBucketFilterTagPropertyFromCloudFormation)(properties.Tags) as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filtertag.html
     */
    export interface FilterTagProperty {
        /**
         * `CfnBucket.FilterTagProperty.Key`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filtertag.html#cfn-s3outposts-bucket-filtertag-key
         */
        readonly key: string;
        /**
         * `CfnBucket.FilterTagProperty.Value`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filtertag.html#cfn-s3outposts-bucket-filtertag-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `FilterTagProperty`
 *
 * @param properties - the TypeScript properties of a `FilterTagProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_FilterTagPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnBucketFilterTagPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_FilterTagPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnBucketFilterTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.FilterTagProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.FilterTagProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * The container for the lifecycle configuration for the objects stored in an S3 on Outposts bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-lifecycleconfiguration.html
     */
    export interface LifecycleConfigurationProperty {
        /**
         * The container for the lifecycle configuration rules for the objects stored in the S3 on Outposts bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-lifecycleconfiguration.html#cfn-s3outposts-bucket-lifecycleconfiguration-rules
         */
        readonly rules: Array<CfnBucket.RuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LifecycleConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LifecycleConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_LifecycleConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnBucketLifecycleConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_LifecycleConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Rules: cdk.listMapper(cfnBucketRulePropertyToCloudFormation)(properties.rules),
    };
}

// @ts-ignore TS6133
function CfnBucketLifecycleConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.LifecycleConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.LifecycleConfigurationProperty>();
    ret.addPropertyResult('rules', 'Rules', cfn_parse.FromCloudFormation.getArray(CfnBucketRulePropertyFromCloudFormation)(properties.Rules));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * A container for an Amazon S3 on Outposts bucket lifecycle rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-rule.html
     */
    export interface RuleProperty {
        /**
         * The container for the abort incomplete multipart upload rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-rule.html#cfn-s3outposts-bucket-rule-abortincompletemultipartupload
         */
        readonly abortIncompleteMultipartUpload?: CfnBucket.AbortIncompleteMultipartUploadProperty | cdk.IResolvable;
        /**
         * Specifies the expiration for the lifecycle of the object by specifying an expiry date.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-rule.html#cfn-s3outposts-bucket-rule-expirationdate
         */
        readonly expirationDate?: string;
        /**
         * Specifies the expiration for the lifecycle of the object in the form of days that the object has been in the S3 on Outposts bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-rule.html#cfn-s3outposts-bucket-rule-expirationindays
         */
        readonly expirationInDays?: number;
        /**
         * The container for the filter of the lifecycle rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-rule.html#cfn-s3outposts-bucket-rule-filter
         */
        readonly filter?: any | cdk.IResolvable;
        /**
         * The unique identifier for the lifecycle rule. The value can't be longer than 255 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-rule.html#cfn-s3outposts-bucket-rule-id
         */
        readonly id?: string;
        /**
         * If `Enabled` , the rule is currently being applied. If `Disabled` , the rule is not currently being applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-rule.html#cfn-s3outposts-bucket-rule-status
         */
        readonly status: string;
    }
}

/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_RulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnBucketRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
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
function CfnBucketRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.RuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.RuleProperty>();
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
 * Properties for defining a `CfnBucketPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucketpolicy.html
 */
export interface CfnBucketPolicyProps {

    /**
     * The name of the Amazon S3 Outposts bucket to which the policy applies.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucketpolicy.html#cfn-s3outposts-bucketpolicy-bucket
     */
    readonly bucket: string;

    /**
     * A policy document containing permissions to add to the specified bucket. In IAM, you must provide policy documents in JSON format. However, in CloudFormation, you can provide the policy in JSON or YAML format because CloudFormation converts YAML to JSON before submitting it to IAM. For more information, see the AWS::IAM::Policy [PolicyDocument](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-policydocument) resource description in this guide and [Access Policy Language Overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-policy-language-overview.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucketpolicy.html#cfn-s3outposts-bucketpolicy-policydocument
     */
    readonly policyDocument: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnBucketPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnBucketPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnBucketPolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnBucketPolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucketPolicyPropsValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        PolicyDocument: cdk.objectToCloudFormation(properties.policyDocument),
    };
}

// @ts-ignore TS6133
function CfnBucketPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucketPolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucketPolicyProps>();
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
export class CfnBucketPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3Outposts::BucketPolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBucketPolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnBucketPolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnBucketPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the Amazon S3 Outposts bucket to which the policy applies.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucketpolicy.html#cfn-s3outposts-bucketpolicy-bucket
     */
    public bucket: string;

    /**
     * A policy document containing permissions to add to the specified bucket. In IAM, you must provide policy documents in JSON format. However, in CloudFormation, you can provide the policy in JSON or YAML format because CloudFormation converts YAML to JSON before submitting it to IAM. For more information, see the AWS::IAM::Policy [PolicyDocument](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-policydocument) resource description in this guide and [Access Policy Language Overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-policy-language-overview.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucketpolicy.html#cfn-s3outposts-bucketpolicy-policydocument
     */
    public policyDocument: any | cdk.IResolvable;

    /**
     * Create a new `AWS::S3Outposts::BucketPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBucketPolicyProps) {
        super(scope, id, { type: CfnBucketPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'bucket', this);
        cdk.requireProperty(props, 'policyDocument', this);

        this.bucket = props.bucket;
        this.policyDocument = props.policyDocument;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBucketPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            bucket: this.bucket,
            policyDocument: this.policyDocument,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBucketPolicyPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnEndpoint`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html
 */
export interface CfnEndpointProps {

    /**
     * The ID of the Outpost.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-outpostid
     */
    readonly outpostId: string;

    /**
     * The ID of the security group to use with the endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-securitygroupid
     */
    readonly securityGroupId: string;

    /**
     * The ID of the subnet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-subnetid
     */
    readonly subnetId: string;

    /**
     * The container for the type of connectivity used to access the Amazon S3 on Outposts endpoint. To use the Amazon VPC , choose `Private` . To use the endpoint with an on-premises network, choose `CustomerOwnedIp` . If you choose `CustomerOwnedIp` , you must also provide the customer-owned IP address pool (CoIP pool).
     *
     * > `Private` is the default access type value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-accesstype
     */
    readonly accessType?: string;

    /**
     * The ID of the customer-owned IPv4 address pool (CoIP pool) for the endpoint. IP addresses are allocated from this pool for the endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-customerownedipv4pool
     */
    readonly customerOwnedIpv4Pool?: string;
}

/**
 * Determine whether the given properties match those of a `CfnEndpointProps`
 *
 * @param properties - the TypeScript properties of a `CfnEndpointProps`
 *
 * @returns the result of the validation.
 */
function CfnEndpointPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnEndpointPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
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
function CfnEndpointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpointProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpointProps>();
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
export class CfnEndpoint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3Outposts::Endpoint";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEndpoint {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnEndpointPropsFromCloudFormation(resourceProperties);
        const ret = new CfnEndpoint(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the endpoint.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The VPC CIDR block committed by this endpoint.
     * @cloudformationAttribute CidrBlock
     */
    public readonly attrCidrBlock: string;

    /**
     * The time the endpoint was created.
     * @cloudformationAttribute CreationTime
     */
    public readonly attrCreationTime: string;

    /**
     * The ID of the endpoint.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The network interface of the endpoint.
     * @cloudformationAttribute NetworkInterfaces
     */
    public readonly attrNetworkInterfaces: cdk.IResolvable;

    /**
     * The status of the endpoint.
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The ID of the Outpost.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-outpostid
     */
    public outpostId: string;

    /**
     * The ID of the security group to use with the endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-securitygroupid
     */
    public securityGroupId: string;

    /**
     * The ID of the subnet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-subnetid
     */
    public subnetId: string;

    /**
     * The container for the type of connectivity used to access the Amazon S3 on Outposts endpoint. To use the Amazon VPC , choose `Private` . To use the endpoint with an on-premises network, choose `CustomerOwnedIp` . If you choose `CustomerOwnedIp` , you must also provide the customer-owned IP address pool (CoIP pool).
     *
     * > `Private` is the default access type value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-accesstype
     */
    public accessType: string | undefined;

    /**
     * The ID of the customer-owned IPv4 address pool (CoIP pool) for the endpoint. IP addresses are allocated from this pool for the endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-customerownedipv4pool
     */
    public customerOwnedIpv4Pool: string | undefined;

    /**
     * Create a new `AWS::S3Outposts::Endpoint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEndpointProps) {
        super(scope, id, { type: CfnEndpoint.CFN_RESOURCE_TYPE_NAME, properties: props });
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
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEndpoint.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            outpostId: this.outpostId,
            securityGroupId: this.securityGroupId,
            subnetId: this.subnetId,
            accessType: this.accessType,
            customerOwnedIpv4Pool: this.customerOwnedIpv4Pool,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEndpointPropsToCloudFormation(props);
    }
}

export namespace CfnEndpoint {
    /**
     * The container for the network interface.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-endpoint-networkinterface.html
     */
    export interface NetworkInterfaceProperty {
        /**
         * The ID for the network interface.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-endpoint-networkinterface.html#cfn-s3outposts-endpoint-networkinterface-networkinterfaceid
         */
        readonly networkInterfaceId: string;
    }
}

/**
 * Determine whether the given properties match those of a `NetworkInterfaceProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkInterfaceProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_NetworkInterfacePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
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
function cfnEndpointNetworkInterfacePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_NetworkInterfacePropertyValidator(properties).assertSuccess();
    return {
        NetworkInterfaceId: cdk.stringToCloudFormation(properties.networkInterfaceId),
    };
}

// @ts-ignore TS6133
function CfnEndpointNetworkInterfacePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.NetworkInterfaceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.NetworkInterfaceProperty>();
    ret.addPropertyResult('networkInterfaceId', 'NetworkInterfaceId', cfn_parse.FromCloudFormation.getString(properties.NetworkInterfaceId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
