// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-30T13:43:08.622Z","fingerprint":"Q2J0sgl0rqKPDG29L/e90nFOfE/1qP6MHSHzXb3KtTM="}

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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html
 */
export interface CfnAccessPointProps {

    /**
     * The name of the bucket associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-bucket
     */
    readonly bucket: string;

    /**
     * The AWS account ID associated with the S3 bucket associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-bucketaccountid
     */
    readonly bucketAccountId?: string;

    /**
     * The name of this access point. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the access point name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-name
     */
    readonly name?: string;

    /**
     * The access point policy associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-policy
     */
    readonly policy?: any | cdk.IResolvable;

    /**
     * The container element for a bucket's policy status.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-policystatus
     */
    readonly policyStatus?: any | cdk.IResolvable;

    /**
     * The PublicAccessBlock configuration that you want to apply to this Amazon S3 bucket. You can enable the configuration options in any combination. For more information about when Amazon S3 considers a bucket or object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-publicaccessblockconfiguration
     */
    readonly publicAccessBlockConfiguration?: CfnAccessPoint.PublicAccessBlockConfigurationProperty | cdk.IResolvable;

    /**
     * The Virtual Private Cloud (VPC) configuration for this access point, if one exists.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-vpcconfiguration
     */
    readonly vpcConfiguration?: CfnAccessPoint.VpcConfigurationProperty | cdk.IResolvable;
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
    errors.collect(cdk.propertyValidator('bucketAccountId', cdk.validateString)(properties.bucketAccountId));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('policy', cdk.validateObject)(properties.policy));
    errors.collect(cdk.propertyValidator('policyStatus', cdk.validateObject)(properties.policyStatus));
    errors.collect(cdk.propertyValidator('publicAccessBlockConfiguration', CfnAccessPoint_PublicAccessBlockConfigurationPropertyValidator)(properties.publicAccessBlockConfiguration));
    errors.collect(cdk.propertyValidator('vpcConfiguration', CfnAccessPoint_VpcConfigurationPropertyValidator)(properties.vpcConfiguration));
    return errors.wrap('supplied properties not correct for "CfnAccessPointProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::AccessPoint` resource
 *
 * @param properties - the TypeScript properties of a `CfnAccessPointProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::AccessPoint` resource.
 */
// @ts-ignore TS6133
function cfnAccessPointPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPointPropsValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        BucketAccountId: cdk.stringToCloudFormation(properties.bucketAccountId),
        Name: cdk.stringToCloudFormation(properties.name),
        Policy: cdk.objectToCloudFormation(properties.policy),
        PolicyStatus: cdk.objectToCloudFormation(properties.policyStatus),
        PublicAccessBlockConfiguration: cfnAccessPointPublicAccessBlockConfigurationPropertyToCloudFormation(properties.publicAccessBlockConfiguration),
        VpcConfiguration: cfnAccessPointVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration),
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
    ret.addPropertyResult('bucketAccountId', 'BucketAccountId', properties.BucketAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.BucketAccountId) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('policy', 'Policy', properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined);
    ret.addPropertyResult('policyStatus', 'PolicyStatus', properties.PolicyStatus != null ? cfn_parse.FromCloudFormation.getAny(properties.PolicyStatus) : undefined);
    ret.addPropertyResult('publicAccessBlockConfiguration', 'PublicAccessBlockConfiguration', properties.PublicAccessBlockConfiguration != null ? CfnAccessPointPublicAccessBlockConfigurationPropertyFromCloudFormation(properties.PublicAccessBlockConfiguration) : undefined);
    ret.addPropertyResult('vpcConfiguration', 'VpcConfiguration', properties.VpcConfiguration != null ? CfnAccessPointVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::S3::AccessPoint`
 *
 * The AWS::S3::AccessPoint resource is an Amazon S3 resource type that you can use to access buckets.
 *
 * @cloudformationResource AWS::S3::AccessPoint
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html
 */
export class CfnAccessPoint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3::AccessPoint";

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
     * The alias for this access point.
     * @cloudformationAttribute Alias
     */
    public readonly attrAlias: string;

    /**
     * This property contains the details of the ARN for the access point.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of this access point.
     * @cloudformationAttribute Name
     */
    public readonly attrName: string;

    /**
     * Indicates whether this access point allows access from the internet. If `VpcConfiguration` is specified for this access point, then `NetworkOrigin` is `VPC` , and the access point doesn't allow access from the internet. Otherwise, `NetworkOrigin` is `Internet` , and the access point allows access from the internet, subject to the access point and bucket access policies.
     *
     * *Allowed values* : `VPC` | `Internet`
     * @cloudformationAttribute NetworkOrigin
     */
    public readonly attrNetworkOrigin: string;

    /**
     * The name of the bucket associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-bucket
     */
    public bucket: string;

    /**
     * The AWS account ID associated with the S3 bucket associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-bucketaccountid
     */
    public bucketAccountId: string | undefined;

    /**
     * The name of this access point. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the access point name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-name
     */
    public name: string | undefined;

    /**
     * The access point policy associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-policy
     */
    public policy: any | cdk.IResolvable | undefined;

    /**
     * The container element for a bucket's policy status.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-policystatus
     */
    public policyStatus: any | cdk.IResolvable | undefined;

    /**
     * The PublicAccessBlock configuration that you want to apply to this Amazon S3 bucket. You can enable the configuration options in any combination. For more information about when Amazon S3 considers a bucket or object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-publicaccessblockconfiguration
     */
    public publicAccessBlockConfiguration: CfnAccessPoint.PublicAccessBlockConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The Virtual Private Cloud (VPC) configuration for this access point, if one exists.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-vpcconfiguration
     */
    public vpcConfiguration: CfnAccessPoint.VpcConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::S3::AccessPoint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAccessPointProps) {
        super(scope, id, { type: CfnAccessPoint.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'bucket', this);
        this.attrAlias = cdk.Token.asString(this.getAtt('Alias', cdk.ResolutionTypeHint.STRING));
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));
        this.attrNetworkOrigin = cdk.Token.asString(this.getAtt('NetworkOrigin', cdk.ResolutionTypeHint.STRING));

        this.bucket = props.bucket;
        this.bucketAccountId = props.bucketAccountId;
        this.name = props.name;
        this.policy = props.policy;
        this.policyStatus = props.policyStatus;
        this.publicAccessBlockConfiguration = props.publicAccessBlockConfiguration;
        this.vpcConfiguration = props.vpcConfiguration;
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

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            bucket: this.bucket,
            bucketAccountId: this.bucketAccountId,
            name: this.name,
            policy: this.policy,
            policyStatus: this.policyStatus,
            publicAccessBlockConfiguration: this.publicAccessBlockConfiguration,
            vpcConfiguration: this.vpcConfiguration,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAccessPointPropsToCloudFormation(props);
    }
}

export namespace CfnAccessPoint {
    /**
     * The container element for a bucket's policy status.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-policystatus.html
     */
    export interface PolicyStatusProperty {
        /**
         * The policy status for this bucket. `TRUE` indicates that this bucket is public. `FALSE` indicates that the bucket is not public.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-policystatus.html#cfn-s3-accesspoint-policystatus-ispublic
         */
        readonly isPublic?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PolicyStatusProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyStatusProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccessPoint_PolicyStatusPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('isPublic', cdk.validateString)(properties.isPublic));
    return errors.wrap('supplied properties not correct for "PolicyStatusProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::AccessPoint.PolicyStatus` resource
 *
 * @param properties - the TypeScript properties of a `PolicyStatusProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::AccessPoint.PolicyStatus` resource.
 */
// @ts-ignore TS6133
function cfnAccessPointPolicyStatusPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPoint_PolicyStatusPropertyValidator(properties).assertSuccess();
    return {
        IsPublic: cdk.stringToCloudFormation(properties.isPublic),
    };
}

// @ts-ignore TS6133
function CfnAccessPointPolicyStatusPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPoint.PolicyStatusProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.PolicyStatusProperty>();
    ret.addPropertyResult('isPublic', 'IsPublic', properties.IsPublic != null ? cfn_parse.FromCloudFormation.getString(properties.IsPublic) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAccessPoint {
    /**
     * The PublicAccessBlock configuration that you want to apply to this Amazon S3 bucket. You can enable the configuration options in any combination. For more information about when Amazon S3 considers a bucket or object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-publicaccessblockconfiguration.html
     */
    export interface PublicAccessBlockConfigurationProperty {
        /**
         * Specifies whether Amazon S3 should block public access control lists (ACLs) for this bucket and objects in this bucket. Setting this element to `TRUE` causes the following behavior:
         *
         * - PUT Bucket ACL and PUT Object ACL calls fail if the specified ACL is public.
         * - PUT Object calls fail if the request includes a public ACL.
         * - PUT Bucket calls fail if the request includes a public ACL.
         *
         * Enabling this setting doesn't affect existing policies or ACLs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-publicaccessblockconfiguration.html#cfn-s3-accesspoint-publicaccessblockconfiguration-blockpublicacls
         */
        readonly blockPublicAcls?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should block public bucket policies for this bucket. Setting this element to `TRUE` causes Amazon S3 to reject calls to PUT Bucket policy if the specified bucket policy allows public access.
         *
         * Enabling this setting doesn't affect existing bucket policies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-publicaccessblockconfiguration.html#cfn-s3-accesspoint-publicaccessblockconfiguration-blockpublicpolicy
         */
        readonly blockPublicPolicy?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should ignore public ACLs for this bucket and objects in this bucket. Setting this element to `TRUE` causes Amazon S3 to ignore all public ACLs on this bucket and objects in this bucket.
         *
         * Enabling this setting doesn't affect the persistence of any existing ACLs and doesn't prevent new public ACLs from being set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-publicaccessblockconfiguration.html#cfn-s3-accesspoint-publicaccessblockconfiguration-ignorepublicacls
         */
        readonly ignorePublicAcls?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should restrict public bucket policies for this bucket. Setting this element to `TRUE` restricts access to this bucket to only AWS service principals and authorized users within this account if the bucket has a public policy.
         *
         * Enabling this setting doesn't affect previously stored bucket policies, except that public and cross-account access within any public bucket policy, including non-public delegation to specific accounts, is blocked.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-publicaccessblockconfiguration.html#cfn-s3-accesspoint-publicaccessblockconfiguration-restrictpublicbuckets
         */
        readonly restrictPublicBuckets?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PublicAccessBlockConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `PublicAccessBlockConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccessPoint_PublicAccessBlockConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('blockPublicAcls', cdk.validateBoolean)(properties.blockPublicAcls));
    errors.collect(cdk.propertyValidator('blockPublicPolicy', cdk.validateBoolean)(properties.blockPublicPolicy));
    errors.collect(cdk.propertyValidator('ignorePublicAcls', cdk.validateBoolean)(properties.ignorePublicAcls));
    errors.collect(cdk.propertyValidator('restrictPublicBuckets', cdk.validateBoolean)(properties.restrictPublicBuckets));
    return errors.wrap('supplied properties not correct for "PublicAccessBlockConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::AccessPoint.PublicAccessBlockConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `PublicAccessBlockConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::AccessPoint.PublicAccessBlockConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnAccessPointPublicAccessBlockConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPoint_PublicAccessBlockConfigurationPropertyValidator(properties).assertSuccess();
    return {
        BlockPublicAcls: cdk.booleanToCloudFormation(properties.blockPublicAcls),
        BlockPublicPolicy: cdk.booleanToCloudFormation(properties.blockPublicPolicy),
        IgnorePublicAcls: cdk.booleanToCloudFormation(properties.ignorePublicAcls),
        RestrictPublicBuckets: cdk.booleanToCloudFormation(properties.restrictPublicBuckets),
    };
}

// @ts-ignore TS6133
function CfnAccessPointPublicAccessBlockConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPoint.PublicAccessBlockConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.PublicAccessBlockConfigurationProperty>();
    ret.addPropertyResult('blockPublicAcls', 'BlockPublicAcls', properties.BlockPublicAcls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BlockPublicAcls) : undefined);
    ret.addPropertyResult('blockPublicPolicy', 'BlockPublicPolicy', properties.BlockPublicPolicy != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BlockPublicPolicy) : undefined);
    ret.addPropertyResult('ignorePublicAcls', 'IgnorePublicAcls', properties.IgnorePublicAcls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IgnorePublicAcls) : undefined);
    ret.addPropertyResult('restrictPublicBuckets', 'RestrictPublicBuckets', properties.RestrictPublicBuckets != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RestrictPublicBuckets) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAccessPoint {
    /**
     * The Virtual Private Cloud (VPC) configuration for this access point.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-vpcconfiguration.html
     */
    export interface VpcConfigurationProperty {
        /**
         * If this field is specified, the access point will only allow connections from the specified VPC ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-vpcconfiguration.html#cfn-s3-accesspoint-vpcconfiguration-vpcid
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
 * Renders the AWS CloudFormation properties of an `AWS::S3::AccessPoint.VpcConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `VpcConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::AccessPoint.VpcConfiguration` resource.
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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html
 */
export interface CfnBucketProps {

    /**
     * Configures the transfer acceleration state for an Amazon S3 bucket. For more information, see [Amazon S3 Transfer Acceleration](https://docs.aws.amazon.com/AmazonS3/latest/dev/transfer-acceleration.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-accelerateconfiguration
     */
    readonly accelerateConfiguration?: CfnBucket.AccelerateConfigurationProperty | cdk.IResolvable;

    /**
     * A canned access control list (ACL) that grants predefined permissions to the bucket. For more information about canned ACLs, see [Canned ACL](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl) in the *Amazon S3 User Guide* .
     *
     * Be aware that the syntax for this property differs from the information provided in the *Amazon S3 User Guide* . The AccessControl property is case-sensitive and must be one of the following values: Private, PublicRead, PublicReadWrite, AuthenticatedRead, LogDeliveryWrite, BucketOwnerRead, BucketOwnerFullControl, or AwsExecRead.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-accesscontrol
     */
    readonly accessControl?: string;

    /**
     * Specifies the configuration and any analyses for the analytics filter of an Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-analyticsconfigurations
     */
    readonly analyticsConfigurations?: Array<CfnBucket.AnalyticsConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies default encryption for a bucket using server-side encryption with Amazon S3-managed keys (SSE-S3) or AWS KMS-managed keys (SSE-KMS) bucket. For information about the Amazon S3 default encryption feature, see [Amazon S3 Default Encryption for S3 Buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-bucketencryption
     */
    readonly bucketEncryption?: CfnBucket.BucketEncryptionProperty | cdk.IResolvable;

    /**
     * A name for the bucket. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the bucket name. The bucket name must contain only lowercase letters, numbers, periods (.), and dashes (-) and must follow [Amazon S3 bucket restrictions and limitations](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html) . For more information, see [Rules for naming Amazon S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html#bucketnamingrules) in the *Amazon S3 User Guide* .
     *
     * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you need to replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-name
     */
    readonly bucketName?: string;

    /**
     * Describes the cross-origin access configuration for objects in an Amazon S3 bucket. For more information, see [Enabling Cross-Origin Resource Sharing](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-crossoriginconfig
     */
    readonly corsConfiguration?: CfnBucket.CorsConfigurationProperty | cdk.IResolvable;

    /**
     * Defines how Amazon S3 handles Intelligent-Tiering storage.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-intelligenttieringconfigurations
     */
    readonly intelligentTieringConfigurations?: Array<CfnBucket.IntelligentTieringConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies the inventory configuration for an Amazon S3 bucket. For more information, see [GET Bucket inventory](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketGETInventoryConfig.html) in the *Amazon S3 API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-inventoryconfigurations
     */
    readonly inventoryConfigurations?: Array<CfnBucket.InventoryConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies the lifecycle configuration for objects in an Amazon S3 bucket. For more information, see [Object Lifecycle Management](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lifecycle-mgmt.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-lifecycleconfig
     */
    readonly lifecycleConfiguration?: CfnBucket.LifecycleConfigurationProperty | cdk.IResolvable;

    /**
     * Settings that define where logs are stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-loggingconfig
     */
    readonly loggingConfiguration?: CfnBucket.LoggingConfigurationProperty | cdk.IResolvable;

    /**
     * Specifies a metrics configuration for the CloudWatch request metrics (specified by the metrics configuration ID) from an Amazon S3 bucket. If you're updating an existing metrics configuration, note that this is a full replacement of the existing metrics configuration. If you don't include the elements you want to keep, they are erased. For more information, see [PutBucketMetricsConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTMetricConfiguration.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-metricsconfigurations
     */
    readonly metricsConfigurations?: Array<CfnBucket.MetricsConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Configuration that defines how Amazon S3 handles bucket notifications.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-notification
     */
    readonly notificationConfiguration?: CfnBucket.NotificationConfigurationProperty | cdk.IResolvable;

    /**
     * Places an Object Lock configuration on the specified bucket. The rule specified in the Object Lock configuration will be applied by default to every new object placed in the specified bucket. For more information, see [Locking Objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lock.html) .
     *
     * > - The `DefaultRetention` settings require both a mode and a period.
     * > - The `DefaultRetention` period can be either `Days` or `Years` but you must select one. You cannot specify `Days` and `Years` at the same time.
     * > - You can only enable Object Lock for new buckets. If you want to turn on Object Lock for an existing bucket, contact AWS Support.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-objectlockconfiguration
     */
    readonly objectLockConfiguration?: CfnBucket.ObjectLockConfigurationProperty | cdk.IResolvable;

    /**
     * Indicates whether this bucket has an Object Lock configuration enabled. Enable `ObjectLockEnabled` when you apply `ObjectLockConfiguration` to a bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-objectlockenabled
     */
    readonly objectLockEnabled?: boolean | cdk.IResolvable;

    /**
     * Configuration that defines how Amazon S3 handles Object Ownership rules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-ownershipcontrols
     */
    readonly ownershipControls?: CfnBucket.OwnershipControlsProperty | cdk.IResolvable;

    /**
     * Configuration that defines how Amazon S3 handles public access.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-publicaccessblockconfiguration
     */
    readonly publicAccessBlockConfiguration?: CfnBucket.PublicAccessBlockConfigurationProperty | cdk.IResolvable;

    /**
     * Configuration for replicating objects in an S3 bucket. To enable replication, you must also enable versioning by using the `VersioningConfiguration` property.
     *
     * Amazon S3 can store replicated objects in a single destination bucket or multiple destination buckets. The destination bucket or buckets must already exist.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-replicationconfiguration
     */
    readonly replicationConfiguration?: CfnBucket.ReplicationConfigurationProperty | cdk.IResolvable;

    /**
     * An arbitrary set of tags (key-value pairs) for this S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * Enables multiple versions of all objects in this bucket. You might enable versioning to prevent objects from being deleted or overwritten by mistake or to archive objects so that you can retrieve previous versions of them.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-versioning
     */
    readonly versioningConfiguration?: CfnBucket.VersioningConfigurationProperty | cdk.IResolvable;

    /**
     * Information used to configure the bucket as a static website. For more information, see [Hosting Websites on Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-websiteconfiguration
     */
    readonly websiteConfiguration?: CfnBucket.WebsiteConfigurationProperty | cdk.IResolvable;
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
    errors.collect(cdk.propertyValidator('accelerateConfiguration', CfnBucket_AccelerateConfigurationPropertyValidator)(properties.accelerateConfiguration));
    errors.collect(cdk.propertyValidator('accessControl', cdk.validateString)(properties.accessControl));
    errors.collect(cdk.propertyValidator('analyticsConfigurations', cdk.listValidator(CfnBucket_AnalyticsConfigurationPropertyValidator))(properties.analyticsConfigurations));
    errors.collect(cdk.propertyValidator('bucketEncryption', CfnBucket_BucketEncryptionPropertyValidator)(properties.bucketEncryption));
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    errors.collect(cdk.propertyValidator('corsConfiguration', CfnBucket_CorsConfigurationPropertyValidator)(properties.corsConfiguration));
    errors.collect(cdk.propertyValidator('intelligentTieringConfigurations', cdk.listValidator(CfnBucket_IntelligentTieringConfigurationPropertyValidator))(properties.intelligentTieringConfigurations));
    errors.collect(cdk.propertyValidator('inventoryConfigurations', cdk.listValidator(CfnBucket_InventoryConfigurationPropertyValidator))(properties.inventoryConfigurations));
    errors.collect(cdk.propertyValidator('lifecycleConfiguration', CfnBucket_LifecycleConfigurationPropertyValidator)(properties.lifecycleConfiguration));
    errors.collect(cdk.propertyValidator('loggingConfiguration', CfnBucket_LoggingConfigurationPropertyValidator)(properties.loggingConfiguration));
    errors.collect(cdk.propertyValidator('metricsConfigurations', cdk.listValidator(CfnBucket_MetricsConfigurationPropertyValidator))(properties.metricsConfigurations));
    errors.collect(cdk.propertyValidator('notificationConfiguration', CfnBucket_NotificationConfigurationPropertyValidator)(properties.notificationConfiguration));
    errors.collect(cdk.propertyValidator('objectLockConfiguration', CfnBucket_ObjectLockConfigurationPropertyValidator)(properties.objectLockConfiguration));
    errors.collect(cdk.propertyValidator('objectLockEnabled', cdk.validateBoolean)(properties.objectLockEnabled));
    errors.collect(cdk.propertyValidator('ownershipControls', CfnBucket_OwnershipControlsPropertyValidator)(properties.ownershipControls));
    errors.collect(cdk.propertyValidator('publicAccessBlockConfiguration', CfnBucket_PublicAccessBlockConfigurationPropertyValidator)(properties.publicAccessBlockConfiguration));
    errors.collect(cdk.propertyValidator('replicationConfiguration', CfnBucket_ReplicationConfigurationPropertyValidator)(properties.replicationConfiguration));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('versioningConfiguration', CfnBucket_VersioningConfigurationPropertyValidator)(properties.versioningConfiguration));
    errors.collect(cdk.propertyValidator('websiteConfiguration', CfnBucket_WebsiteConfigurationPropertyValidator)(properties.websiteConfiguration));
    return errors.wrap('supplied properties not correct for "CfnBucketProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket` resource
 *
 * @param properties - the TypeScript properties of a `CfnBucketProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket` resource.
 */
// @ts-ignore TS6133
function cfnBucketPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucketPropsValidator(properties).assertSuccess();
    return {
        AccelerateConfiguration: cfnBucketAccelerateConfigurationPropertyToCloudFormation(properties.accelerateConfiguration),
        AccessControl: cdk.stringToCloudFormation(properties.accessControl),
        AnalyticsConfigurations: cdk.listMapper(cfnBucketAnalyticsConfigurationPropertyToCloudFormation)(properties.analyticsConfigurations),
        BucketEncryption: cfnBucketBucketEncryptionPropertyToCloudFormation(properties.bucketEncryption),
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        CorsConfiguration: cfnBucketCorsConfigurationPropertyToCloudFormation(properties.corsConfiguration),
        IntelligentTieringConfigurations: cdk.listMapper(cfnBucketIntelligentTieringConfigurationPropertyToCloudFormation)(properties.intelligentTieringConfigurations),
        InventoryConfigurations: cdk.listMapper(cfnBucketInventoryConfigurationPropertyToCloudFormation)(properties.inventoryConfigurations),
        LifecycleConfiguration: cfnBucketLifecycleConfigurationPropertyToCloudFormation(properties.lifecycleConfiguration),
        LoggingConfiguration: cfnBucketLoggingConfigurationPropertyToCloudFormation(properties.loggingConfiguration),
        MetricsConfigurations: cdk.listMapper(cfnBucketMetricsConfigurationPropertyToCloudFormation)(properties.metricsConfigurations),
        NotificationConfiguration: cfnBucketNotificationConfigurationPropertyToCloudFormation(properties.notificationConfiguration),
        ObjectLockConfiguration: cfnBucketObjectLockConfigurationPropertyToCloudFormation(properties.objectLockConfiguration),
        ObjectLockEnabled: cdk.booleanToCloudFormation(properties.objectLockEnabled),
        OwnershipControls: cfnBucketOwnershipControlsPropertyToCloudFormation(properties.ownershipControls),
        PublicAccessBlockConfiguration: cfnBucketPublicAccessBlockConfigurationPropertyToCloudFormation(properties.publicAccessBlockConfiguration),
        ReplicationConfiguration: cfnBucketReplicationConfigurationPropertyToCloudFormation(properties.replicationConfiguration),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VersioningConfiguration: cfnBucketVersioningConfigurationPropertyToCloudFormation(properties.versioningConfiguration),
        WebsiteConfiguration: cfnBucketWebsiteConfigurationPropertyToCloudFormation(properties.websiteConfiguration),
    };
}

// @ts-ignore TS6133
function CfnBucketPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucketProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucketProps>();
    ret.addPropertyResult('accelerateConfiguration', 'AccelerateConfiguration', properties.AccelerateConfiguration != null ? CfnBucketAccelerateConfigurationPropertyFromCloudFormation(properties.AccelerateConfiguration) : undefined);
    ret.addPropertyResult('accessControl', 'AccessControl', properties.AccessControl != null ? cfn_parse.FromCloudFormation.getString(properties.AccessControl) : undefined);
    ret.addPropertyResult('analyticsConfigurations', 'AnalyticsConfigurations', properties.AnalyticsConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketAnalyticsConfigurationPropertyFromCloudFormation)(properties.AnalyticsConfigurations) : undefined);
    ret.addPropertyResult('bucketEncryption', 'BucketEncryption', properties.BucketEncryption != null ? CfnBucketBucketEncryptionPropertyFromCloudFormation(properties.BucketEncryption) : undefined);
    ret.addPropertyResult('bucketName', 'BucketName', properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined);
    ret.addPropertyResult('corsConfiguration', 'CorsConfiguration', properties.CorsConfiguration != null ? CfnBucketCorsConfigurationPropertyFromCloudFormation(properties.CorsConfiguration) : undefined);
    ret.addPropertyResult('intelligentTieringConfigurations', 'IntelligentTieringConfigurations', properties.IntelligentTieringConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketIntelligentTieringConfigurationPropertyFromCloudFormation)(properties.IntelligentTieringConfigurations) : undefined);
    ret.addPropertyResult('inventoryConfigurations', 'InventoryConfigurations', properties.InventoryConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketInventoryConfigurationPropertyFromCloudFormation)(properties.InventoryConfigurations) : undefined);
    ret.addPropertyResult('lifecycleConfiguration', 'LifecycleConfiguration', properties.LifecycleConfiguration != null ? CfnBucketLifecycleConfigurationPropertyFromCloudFormation(properties.LifecycleConfiguration) : undefined);
    ret.addPropertyResult('loggingConfiguration', 'LoggingConfiguration', properties.LoggingConfiguration != null ? CfnBucketLoggingConfigurationPropertyFromCloudFormation(properties.LoggingConfiguration) : undefined);
    ret.addPropertyResult('metricsConfigurations', 'MetricsConfigurations', properties.MetricsConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketMetricsConfigurationPropertyFromCloudFormation)(properties.MetricsConfigurations) : undefined);
    ret.addPropertyResult('notificationConfiguration', 'NotificationConfiguration', properties.NotificationConfiguration != null ? CfnBucketNotificationConfigurationPropertyFromCloudFormation(properties.NotificationConfiguration) : undefined);
    ret.addPropertyResult('objectLockConfiguration', 'ObjectLockConfiguration', properties.ObjectLockConfiguration != null ? CfnBucketObjectLockConfigurationPropertyFromCloudFormation(properties.ObjectLockConfiguration) : undefined);
    ret.addPropertyResult('objectLockEnabled', 'ObjectLockEnabled', properties.ObjectLockEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ObjectLockEnabled) : undefined);
    ret.addPropertyResult('ownershipControls', 'OwnershipControls', properties.OwnershipControls != null ? CfnBucketOwnershipControlsPropertyFromCloudFormation(properties.OwnershipControls) : undefined);
    ret.addPropertyResult('publicAccessBlockConfiguration', 'PublicAccessBlockConfiguration', properties.PublicAccessBlockConfiguration != null ? CfnBucketPublicAccessBlockConfigurationPropertyFromCloudFormation(properties.PublicAccessBlockConfiguration) : undefined);
    ret.addPropertyResult('replicationConfiguration', 'ReplicationConfiguration', properties.ReplicationConfiguration != null ? CfnBucketReplicationConfigurationPropertyFromCloudFormation(properties.ReplicationConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('versioningConfiguration', 'VersioningConfiguration', properties.VersioningConfiguration != null ? CfnBucketVersioningConfigurationPropertyFromCloudFormation(properties.VersioningConfiguration) : undefined);
    ret.addPropertyResult('websiteConfiguration', 'WebsiteConfiguration', properties.WebsiteConfiguration != null ? CfnBucketWebsiteConfigurationPropertyFromCloudFormation(properties.WebsiteConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::S3::Bucket`
 *
 * The `AWS::S3::Bucket` resource creates an Amazon S3 bucket in the same AWS Region where you create the AWS CloudFormation stack.
 *
 * To control how AWS CloudFormation handles the bucket when the stack is deleted, you can set a deletion policy for your bucket. You can choose to *retain* the bucket or to *delete* the bucket. For more information, see [DeletionPolicy Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html) .
 *
 * > You can only delete empty buckets. Deletion fails for buckets that have contents.
 *
 * @cloudformationResource AWS::S3::Bucket
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html
 */
export class CfnBucket extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3::Bucket";

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
     * Returns the Amazon Resource Name (ARN) of the specified bucket.
     *
     * Example: `arn:aws:s3:::DOC-EXAMPLE-BUCKET`
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Returns the IPv4 DNS name of the specified bucket.
     *
     * Example: `DOC-EXAMPLE-BUCKET.s3.amazonaws.com`
     * @cloudformationAttribute DomainName
     */
    public readonly attrDomainName: string;

    /**
     * Returns the IPv6 DNS name of the specified bucket.
     *
     * Example: `DOC-EXAMPLE-BUCKET.s3.dualstack.us-east-2.amazonaws.com`
     *
     * For more information about dual-stack endpoints, see [Using Amazon S3 Dual-Stack Endpoints](https://docs.aws.amazon.com/AmazonS3/latest/dev/dual-stack-endpoints.html) .
     * @cloudformationAttribute DualStackDomainName
     */
    public readonly attrDualStackDomainName: string;

    /**
     * Returns the regional domain name of the specified bucket.
     *
     * Example: `DOC-EXAMPLE-BUCKET.s3.us-east-2.amazonaws.com`
     * @cloudformationAttribute RegionalDomainName
     */
    public readonly attrRegionalDomainName: string;

    /**
     * Returns the Amazon S3 website endpoint for the specified bucket.
     *
     * Example (IPv4): `http://DOC-EXAMPLE-BUCKET.s3-website.us-east-2.amazonaws.com`
     *
     * Example (IPv6): `http://DOC-EXAMPLE-BUCKET.s3.dualstack.us-east-2.amazonaws.com`
     * @cloudformationAttribute WebsiteURL
     */
    public readonly attrWebsiteUrl: string;

    /**
     * Configures the transfer acceleration state for an Amazon S3 bucket. For more information, see [Amazon S3 Transfer Acceleration](https://docs.aws.amazon.com/AmazonS3/latest/dev/transfer-acceleration.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-accelerateconfiguration
     */
    public accelerateConfiguration: CfnBucket.AccelerateConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * A canned access control list (ACL) that grants predefined permissions to the bucket. For more information about canned ACLs, see [Canned ACL](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl) in the *Amazon S3 User Guide* .
     *
     * Be aware that the syntax for this property differs from the information provided in the *Amazon S3 User Guide* . The AccessControl property is case-sensitive and must be one of the following values: Private, PublicRead, PublicReadWrite, AuthenticatedRead, LogDeliveryWrite, BucketOwnerRead, BucketOwnerFullControl, or AwsExecRead.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-accesscontrol
     */
    public accessControl: string | undefined;

    /**
     * Specifies the configuration and any analyses for the analytics filter of an Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-analyticsconfigurations
     */
    public analyticsConfigurations: Array<CfnBucket.AnalyticsConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Specifies default encryption for a bucket using server-side encryption with Amazon S3-managed keys (SSE-S3) or AWS KMS-managed keys (SSE-KMS) bucket. For information about the Amazon S3 default encryption feature, see [Amazon S3 Default Encryption for S3 Buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-bucketencryption
     */
    public bucketEncryption: CfnBucket.BucketEncryptionProperty | cdk.IResolvable | undefined;

    /**
     * A name for the bucket. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the bucket name. The bucket name must contain only lowercase letters, numbers, periods (.), and dashes (-) and must follow [Amazon S3 bucket restrictions and limitations](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html) . For more information, see [Rules for naming Amazon S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html#bucketnamingrules) in the *Amazon S3 User Guide* .
     *
     * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you need to replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-name
     */
    public bucketName: string | undefined;

    /**
     * Describes the cross-origin access configuration for objects in an Amazon S3 bucket. For more information, see [Enabling Cross-Origin Resource Sharing](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-crossoriginconfig
     */
    public corsConfiguration: CfnBucket.CorsConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Defines how Amazon S3 handles Intelligent-Tiering storage.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-intelligenttieringconfigurations
     */
    public intelligentTieringConfigurations: Array<CfnBucket.IntelligentTieringConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Specifies the inventory configuration for an Amazon S3 bucket. For more information, see [GET Bucket inventory](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketGETInventoryConfig.html) in the *Amazon S3 API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-inventoryconfigurations
     */
    public inventoryConfigurations: Array<CfnBucket.InventoryConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Specifies the lifecycle configuration for objects in an Amazon S3 bucket. For more information, see [Object Lifecycle Management](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lifecycle-mgmt.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-lifecycleconfig
     */
    public lifecycleConfiguration: CfnBucket.LifecycleConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Settings that define where logs are stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-loggingconfig
     */
    public loggingConfiguration: CfnBucket.LoggingConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Specifies a metrics configuration for the CloudWatch request metrics (specified by the metrics configuration ID) from an Amazon S3 bucket. If you're updating an existing metrics configuration, note that this is a full replacement of the existing metrics configuration. If you don't include the elements you want to keep, they are erased. For more information, see [PutBucketMetricsConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTMetricConfiguration.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-metricsconfigurations
     */
    public metricsConfigurations: Array<CfnBucket.MetricsConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Configuration that defines how Amazon S3 handles bucket notifications.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-notification
     */
    public notificationConfiguration: CfnBucket.NotificationConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Places an Object Lock configuration on the specified bucket. The rule specified in the Object Lock configuration will be applied by default to every new object placed in the specified bucket. For more information, see [Locking Objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lock.html) .
     *
     * > - The `DefaultRetention` settings require both a mode and a period.
     * > - The `DefaultRetention` period can be either `Days` or `Years` but you must select one. You cannot specify `Days` and `Years` at the same time.
     * > - You can only enable Object Lock for new buckets. If you want to turn on Object Lock for an existing bucket, contact AWS Support.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-objectlockconfiguration
     */
    public objectLockConfiguration: CfnBucket.ObjectLockConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Indicates whether this bucket has an Object Lock configuration enabled. Enable `ObjectLockEnabled` when you apply `ObjectLockConfiguration` to a bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-objectlockenabled
     */
    public objectLockEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * Configuration that defines how Amazon S3 handles Object Ownership rules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-ownershipcontrols
     */
    public ownershipControls: CfnBucket.OwnershipControlsProperty | cdk.IResolvable | undefined;

    /**
     * Configuration that defines how Amazon S3 handles public access.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-publicaccessblockconfiguration
     */
    public publicAccessBlockConfiguration: CfnBucket.PublicAccessBlockConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Configuration for replicating objects in an S3 bucket. To enable replication, you must also enable versioning by using the `VersioningConfiguration` property.
     *
     * Amazon S3 can store replicated objects in a single destination bucket or multiple destination buckets. The destination bucket or buckets must already exist.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-replicationconfiguration
     */
    public replicationConfiguration: CfnBucket.ReplicationConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * An arbitrary set of tags (key-value pairs) for this S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Enables multiple versions of all objects in this bucket. You might enable versioning to prevent objects from being deleted or overwritten by mistake or to archive objects so that you can retrieve previous versions of them.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-versioning
     */
    public versioningConfiguration: CfnBucket.VersioningConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Information used to configure the bucket as a static website. For more information, see [Hosting Websites on Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-websiteconfiguration
     */
    public websiteConfiguration: CfnBucket.WebsiteConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::S3::Bucket`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBucketProps = {}) {
        super(scope, id, { type: CfnBucket.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrDomainName = cdk.Token.asString(this.getAtt('DomainName', cdk.ResolutionTypeHint.STRING));
        this.attrDualStackDomainName = cdk.Token.asString(this.getAtt('DualStackDomainName', cdk.ResolutionTypeHint.STRING));
        this.attrRegionalDomainName = cdk.Token.asString(this.getAtt('RegionalDomainName', cdk.ResolutionTypeHint.STRING));
        this.attrWebsiteUrl = cdk.Token.asString(this.getAtt('WebsiteURL', cdk.ResolutionTypeHint.STRING));

        this.accelerateConfiguration = props.accelerateConfiguration;
        this.accessControl = props.accessControl;
        this.analyticsConfigurations = props.analyticsConfigurations;
        this.bucketEncryption = props.bucketEncryption;
        this.bucketName = props.bucketName;
        this.corsConfiguration = props.corsConfiguration;
        this.intelligentTieringConfigurations = props.intelligentTieringConfigurations;
        this.inventoryConfigurations = props.inventoryConfigurations;
        this.lifecycleConfiguration = props.lifecycleConfiguration;
        this.loggingConfiguration = props.loggingConfiguration;
        this.metricsConfigurations = props.metricsConfigurations;
        this.notificationConfiguration = props.notificationConfiguration;
        this.objectLockConfiguration = props.objectLockConfiguration;
        this.objectLockEnabled = props.objectLockEnabled;
        this.ownershipControls = props.ownershipControls;
        this.publicAccessBlockConfiguration = props.publicAccessBlockConfiguration;
        this.replicationConfiguration = props.replicationConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::S3::Bucket", props.tags, { tagPropertyName: 'tags' });
        this.versioningConfiguration = props.versioningConfiguration;
        this.websiteConfiguration = props.websiteConfiguration;
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
              ? ['\'AWS::S3::Bucket\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
              : [] });
        }
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

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            accelerateConfiguration: this.accelerateConfiguration,
            accessControl: this.accessControl,
            analyticsConfigurations: this.analyticsConfigurations,
            bucketEncryption: this.bucketEncryption,
            bucketName: this.bucketName,
            corsConfiguration: this.corsConfiguration,
            intelligentTieringConfigurations: this.intelligentTieringConfigurations,
            inventoryConfigurations: this.inventoryConfigurations,
            lifecycleConfiguration: this.lifecycleConfiguration,
            loggingConfiguration: this.loggingConfiguration,
            metricsConfigurations: this.metricsConfigurations,
            notificationConfiguration: this.notificationConfiguration,
            objectLockConfiguration: this.objectLockConfiguration,
            objectLockEnabled: this.objectLockEnabled,
            ownershipControls: this.ownershipControls,
            publicAccessBlockConfiguration: this.publicAccessBlockConfiguration,
            replicationConfiguration: this.replicationConfiguration,
            tags: this.tags.renderTags(),
            versioningConfiguration: this.versioningConfiguration,
            websiteConfiguration: this.websiteConfiguration,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBucketPropsToCloudFormation(props);
    }
}

export namespace CfnBucket {
    /**
     * Specifies the days since the initiation of an incomplete multipart upload that Amazon S3 will wait before permanently removing all parts of the upload. For more information, see [Stopping Incomplete Multipart Uploads Using a Bucket Lifecycle Policy](https://docs.aws.amazon.com/AmazonS3/latest/dev/mpuoverview.html#mpu-abort-incomplete-mpu-lifecycle-config) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-abortincompletemultipartupload.html
     */
    export interface AbortIncompleteMultipartUploadProperty {
        /**
         * Specifies the number of days after which Amazon S3 stops an incomplete multipart upload.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-abortincompletemultipartupload.html#cfn-s3-bucket-abortincompletemultipartupload-daysafterinitiation
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
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.AbortIncompleteMultipartUpload` resource
 *
 * @param properties - the TypeScript properties of a `AbortIncompleteMultipartUploadProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.AbortIncompleteMultipartUpload` resource.
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
     * Configures the transfer acceleration state for an Amazon S3 bucket. For more information, see [Amazon S3 Transfer Acceleration](https://docs.aws.amazon.com/AmazonS3/latest/dev/transfer-acceleration.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accelerateconfiguration.html
     */
    export interface AccelerateConfigurationProperty {
        /**
         * Specifies the transfer acceleration status of the bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accelerateconfiguration.html#cfn-s3-bucket-accelerateconfiguration-accelerationstatus
         */
        readonly accelerationStatus: string;
    }
}

/**
 * Determine whether the given properties match those of a `AccelerateConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AccelerateConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_AccelerateConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accelerationStatus', cdk.requiredValidator)(properties.accelerationStatus));
    errors.collect(cdk.propertyValidator('accelerationStatus', cdk.validateString)(properties.accelerationStatus));
    return errors.wrap('supplied properties not correct for "AccelerateConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.AccelerateConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `AccelerateConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.AccelerateConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketAccelerateConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_AccelerateConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AccelerationStatus: cdk.stringToCloudFormation(properties.accelerationStatus),
    };
}

// @ts-ignore TS6133
function CfnBucketAccelerateConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.AccelerateConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.AccelerateConfigurationProperty>();
    ret.addPropertyResult('accelerationStatus', 'AccelerationStatus', cfn_parse.FromCloudFormation.getString(properties.AccelerationStatus));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specify this only in a cross-account scenario (where source and destination bucket owners are not the same), and you want to change replica ownership to the AWS account that owns the destination bucket. If this is not specified in the replication configuration, the replicas are owned by same AWS account that owns the source object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accesscontroltranslation.html
     */
    export interface AccessControlTranslationProperty {
        /**
         * Specifies the replica ownership. For default and valid values, see [PUT bucket replication](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTreplication.html) in the *Amazon S3 API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accesscontroltranslation.html#cfn-s3-bucket-accesscontroltranslation-owner
         */
        readonly owner: string;
    }
}

/**
 * Determine whether the given properties match those of a `AccessControlTranslationProperty`
 *
 * @param properties - the TypeScript properties of a `AccessControlTranslationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_AccessControlTranslationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('owner', cdk.requiredValidator)(properties.owner));
    errors.collect(cdk.propertyValidator('owner', cdk.validateString)(properties.owner));
    return errors.wrap('supplied properties not correct for "AccessControlTranslationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.AccessControlTranslation` resource
 *
 * @param properties - the TypeScript properties of a `AccessControlTranslationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.AccessControlTranslation` resource.
 */
// @ts-ignore TS6133
function cfnBucketAccessControlTranslationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_AccessControlTranslationPropertyValidator(properties).assertSuccess();
    return {
        Owner: cdk.stringToCloudFormation(properties.owner),
    };
}

// @ts-ignore TS6133
function CfnBucketAccessControlTranslationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.AccessControlTranslationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.AccessControlTranslationProperty>();
    ret.addPropertyResult('owner', 'Owner', cfn_parse.FromCloudFormation.getString(properties.Owner));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies the configuration and any analyses for the analytics filter of an Amazon S3 bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html
     */
    export interface AnalyticsConfigurationProperty {
        /**
         * The ID that identifies the analytics configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html#cfn-s3-bucket-analyticsconfiguration-id
         */
        readonly id: string;
        /**
         * The prefix that an object must have to be included in the analytics results.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html#cfn-s3-bucket-analyticsconfiguration-prefix
         */
        readonly prefix?: string;
        /**
         * Contains data related to access patterns to be collected and made available to analyze the tradeoffs between different storage classes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html#cfn-s3-bucket-analyticsconfiguration-storageclassanalysis
         */
        readonly storageClassAnalysis: CfnBucket.StorageClassAnalysisProperty | cdk.IResolvable;
        /**
         * The tags to use when evaluating an analytics filter.
         *
         * The analytics only includes objects that meet the filter's criteria. If no filter is specified, all of the contents of the bucket are included in the analysis.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html#cfn-s3-bucket-analyticsconfiguration-tagfilters
         */
        readonly tagFilters?: Array<CfnBucket.TagFilterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AnalyticsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AnalyticsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_AnalyticsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('storageClassAnalysis', cdk.requiredValidator)(properties.storageClassAnalysis));
    errors.collect(cdk.propertyValidator('storageClassAnalysis', CfnBucket_StorageClassAnalysisPropertyValidator)(properties.storageClassAnalysis));
    errors.collect(cdk.propertyValidator('tagFilters', cdk.listValidator(CfnBucket_TagFilterPropertyValidator))(properties.tagFilters));
    return errors.wrap('supplied properties not correct for "AnalyticsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.AnalyticsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `AnalyticsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.AnalyticsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketAnalyticsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_AnalyticsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        StorageClassAnalysis: cfnBucketStorageClassAnalysisPropertyToCloudFormation(properties.storageClassAnalysis),
        TagFilters: cdk.listMapper(cfnBucketTagFilterPropertyToCloudFormation)(properties.tagFilters),
    };
}

// @ts-ignore TS6133
function CfnBucketAnalyticsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.AnalyticsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.AnalyticsConfigurationProperty>();
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('storageClassAnalysis', 'StorageClassAnalysis', CfnBucketStorageClassAnalysisPropertyFromCloudFormation(properties.StorageClassAnalysis));
    ret.addPropertyResult('tagFilters', 'TagFilters', properties.TagFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketTagFilterPropertyFromCloudFormation)(properties.TagFilters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies default encryption for a bucket using server-side encryption with Amazon S3-managed keys (SSE-S3) or AWS KMS-managed keys (SSE-KMS) bucket. For information about the Amazon S3 default encryption feature, see [Amazon S3 Default Encryption for S3 Buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-bucketencryption.html
     */
    export interface BucketEncryptionProperty {
        /**
         * Specifies the default server-side-encryption configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-bucketencryption.html#cfn-s3-bucket-bucketencryption-serversideencryptionconfiguration
         */
        readonly serverSideEncryptionConfiguration: Array<CfnBucket.ServerSideEncryptionRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `BucketEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `BucketEncryptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_BucketEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('serverSideEncryptionConfiguration', cdk.requiredValidator)(properties.serverSideEncryptionConfiguration));
    errors.collect(cdk.propertyValidator('serverSideEncryptionConfiguration', cdk.listValidator(CfnBucket_ServerSideEncryptionRulePropertyValidator))(properties.serverSideEncryptionConfiguration));
    return errors.wrap('supplied properties not correct for "BucketEncryptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.BucketEncryption` resource
 *
 * @param properties - the TypeScript properties of a `BucketEncryptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.BucketEncryption` resource.
 */
// @ts-ignore TS6133
function cfnBucketBucketEncryptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_BucketEncryptionPropertyValidator(properties).assertSuccess();
    return {
        ServerSideEncryptionConfiguration: cdk.listMapper(cfnBucketServerSideEncryptionRulePropertyToCloudFormation)(properties.serverSideEncryptionConfiguration),
    };
}

// @ts-ignore TS6133
function CfnBucketBucketEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.BucketEncryptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.BucketEncryptionProperty>();
    ret.addPropertyResult('serverSideEncryptionConfiguration', 'ServerSideEncryptionConfiguration', cfn_parse.FromCloudFormation.getArray(CfnBucketServerSideEncryptionRulePropertyFromCloudFormation)(properties.ServerSideEncryptionConfiguration));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Describes the cross-origin access configuration for objects in an Amazon S3 bucket. For more information, see [Enabling Cross-Origin Resource Sharing](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors.html
     */
    export interface CorsConfigurationProperty {
        /**
         * A set of origins and methods (cross-origin access that you want to allow). You can add up to 100 rules to the configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors.html#cfn-s3-bucket-cors-corsrule
         */
        readonly corsRules: Array<CfnBucket.CorsRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CorsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CorsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_CorsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('corsRules', cdk.requiredValidator)(properties.corsRules));
    errors.collect(cdk.propertyValidator('corsRules', cdk.listValidator(CfnBucket_CorsRulePropertyValidator))(properties.corsRules));
    return errors.wrap('supplied properties not correct for "CorsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.CorsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CorsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.CorsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketCorsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_CorsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        CorsRules: cdk.listMapper(cfnBucketCorsRulePropertyToCloudFormation)(properties.corsRules),
    };
}

// @ts-ignore TS6133
function CfnBucketCorsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.CorsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.CorsConfigurationProperty>();
    ret.addPropertyResult('corsRules', 'CorsRules', cfn_parse.FromCloudFormation.getArray(CfnBucketCorsRulePropertyFromCloudFormation)(properties.CorsRules));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies a cross-origin access rule for an Amazon S3 bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors-corsrule.html
     */
    export interface CorsRuleProperty {
        /**
         * Headers that are specified in the `Access-Control-Request-Headers` header. These headers are allowed in a preflight OPTIONS request. In response to any preflight OPTIONS request, Amazon S3 returns any requested headers that are allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors-corsrule.html#cfn-s3-bucket-cors-corsrule-allowedheaders
         */
        readonly allowedHeaders?: string[];
        /**
         * An HTTP method that you allow the origin to run.
         *
         * *Allowed values* : `GET` | `PUT` | `HEAD` | `POST` | `DELETE`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors-corsrule.html#cfn-s3-bucket-cors-corsrule-allowedmethods
         */
        readonly allowedMethods: string[];
        /**
         * One or more origins you want customers to be able to access the bucket from.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors-corsrule.html#cfn-s3-bucket-cors-corsrule-allowedorigins
         */
        readonly allowedOrigins: string[];
        /**
         * One or more headers in the response that you want customers to be able to access from their applications (for example, from a JavaScript `XMLHttpRequest` object).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors-corsrule.html#cfn-s3-bucket-cors-corsrule-exposedheaders
         */
        readonly exposedHeaders?: string[];
        /**
         * A unique identifier for this rule. The value must be no more than 255 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors-corsrule.html#cfn-s3-bucket-cors-corsrule-id
         */
        readonly id?: string;
        /**
         * The time in seconds that your browser is to cache the preflight response for the specified resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors-corsrule.html#cfn-s3-bucket-cors-corsrule-maxage
         */
        readonly maxAge?: number;
    }
}

/**
 * Determine whether the given properties match those of a `CorsRuleProperty`
 *
 * @param properties - the TypeScript properties of a `CorsRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_CorsRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowedHeaders', cdk.listValidator(cdk.validateString))(properties.allowedHeaders));
    errors.collect(cdk.propertyValidator('allowedMethods', cdk.requiredValidator)(properties.allowedMethods));
    errors.collect(cdk.propertyValidator('allowedMethods', cdk.listValidator(cdk.validateString))(properties.allowedMethods));
    errors.collect(cdk.propertyValidator('allowedOrigins', cdk.requiredValidator)(properties.allowedOrigins));
    errors.collect(cdk.propertyValidator('allowedOrigins', cdk.listValidator(cdk.validateString))(properties.allowedOrigins));
    errors.collect(cdk.propertyValidator('exposedHeaders', cdk.listValidator(cdk.validateString))(properties.exposedHeaders));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('maxAge', cdk.validateNumber)(properties.maxAge));
    return errors.wrap('supplied properties not correct for "CorsRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.CorsRule` resource
 *
 * @param properties - the TypeScript properties of a `CorsRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.CorsRule` resource.
 */
// @ts-ignore TS6133
function cfnBucketCorsRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_CorsRulePropertyValidator(properties).assertSuccess();
    return {
        AllowedHeaders: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedHeaders),
        AllowedMethods: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedMethods),
        AllowedOrigins: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedOrigins),
        ExposedHeaders: cdk.listMapper(cdk.stringToCloudFormation)(properties.exposedHeaders),
        Id: cdk.stringToCloudFormation(properties.id),
        MaxAge: cdk.numberToCloudFormation(properties.maxAge),
    };
}

// @ts-ignore TS6133
function CfnBucketCorsRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.CorsRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.CorsRuleProperty>();
    ret.addPropertyResult('allowedHeaders', 'AllowedHeaders', properties.AllowedHeaders != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AllowedHeaders) : undefined);
    ret.addPropertyResult('allowedMethods', 'AllowedMethods', cfn_parse.FromCloudFormation.getStringArray(properties.AllowedMethods));
    ret.addPropertyResult('allowedOrigins', 'AllowedOrigins', cfn_parse.FromCloudFormation.getStringArray(properties.AllowedOrigins));
    ret.addPropertyResult('exposedHeaders', 'ExposedHeaders', properties.ExposedHeaders != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExposedHeaders) : undefined);
    ret.addPropertyResult('id', 'Id', properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined);
    ret.addPropertyResult('maxAge', 'MaxAge', properties.MaxAge != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxAge) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies how data related to the storage class analysis for an Amazon S3 bucket should be exported.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html
     */
    export interface DataExportProperty {
        /**
         * The place to store the data for an analysis.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html#cfn-s3-bucket-dataexport-destination
         */
        readonly destination: CfnBucket.DestinationProperty | cdk.IResolvable;
        /**
         * The version of the output schema to use when exporting data. Must be `V_1` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html#cfn-s3-bucket-dataexport-outputschemaversion
         */
        readonly outputSchemaVersion: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataExportProperty`
 *
 * @param properties - the TypeScript properties of a `DataExportProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_DataExportPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', cdk.requiredValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('destination', CfnBucket_DestinationPropertyValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('outputSchemaVersion', cdk.requiredValidator)(properties.outputSchemaVersion));
    errors.collect(cdk.propertyValidator('outputSchemaVersion', cdk.validateString)(properties.outputSchemaVersion));
    return errors.wrap('supplied properties not correct for "DataExportProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.DataExport` resource
 *
 * @param properties - the TypeScript properties of a `DataExportProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.DataExport` resource.
 */
// @ts-ignore TS6133
function cfnBucketDataExportPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_DataExportPropertyValidator(properties).assertSuccess();
    return {
        Destination: cfnBucketDestinationPropertyToCloudFormation(properties.destination),
        OutputSchemaVersion: cdk.stringToCloudFormation(properties.outputSchemaVersion),
    };
}

// @ts-ignore TS6133
function CfnBucketDataExportPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.DataExportProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.DataExportProperty>();
    ret.addPropertyResult('destination', 'Destination', CfnBucketDestinationPropertyFromCloudFormation(properties.Destination));
    ret.addPropertyResult('outputSchemaVersion', 'OutputSchemaVersion', cfn_parse.FromCloudFormation.getString(properties.OutputSchemaVersion));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * The container element for specifying the default Object Lock retention settings for new objects placed in the specified bucket.
     *
     * > - The `DefaultRetention` settings require both a mode and a period.
     * > - The `DefaultRetention` period can be either `Days` or `Years` but you must select one. You cannot specify `Days` and `Years` at the same time.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html
     */
    export interface DefaultRetentionProperty {
        /**
         * The number of days that you want to specify for the default retention period. If Object Lock is turned on, you must specify `Mode` and specify either `Days` or `Years` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html#cfn-s3-bucket-defaultretention-days
         */
        readonly days?: number;
        /**
         * The default Object Lock retention mode you want to apply to new objects placed in the specified bucket. If Object Lock is turned on, you must specify `Mode` and specify either `Days` or `Years` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html#cfn-s3-bucket-defaultretention-mode
         */
        readonly mode?: string;
        /**
         * The number of years that you want to specify for the default retention period. If Object Lock is turned on, you must specify `Mode` and specify either `Days` or `Years` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html#cfn-s3-bucket-defaultretention-years
         */
        readonly years?: number;
    }
}

/**
 * Determine whether the given properties match those of a `DefaultRetentionProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultRetentionProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_DefaultRetentionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('days', cdk.validateNumber)(properties.days));
    errors.collect(cdk.propertyValidator('mode', cdk.validateString)(properties.mode));
    errors.collect(cdk.propertyValidator('years', cdk.validateNumber)(properties.years));
    return errors.wrap('supplied properties not correct for "DefaultRetentionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.DefaultRetention` resource
 *
 * @param properties - the TypeScript properties of a `DefaultRetentionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.DefaultRetention` resource.
 */
// @ts-ignore TS6133
function cfnBucketDefaultRetentionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_DefaultRetentionPropertyValidator(properties).assertSuccess();
    return {
        Days: cdk.numberToCloudFormation(properties.days),
        Mode: cdk.stringToCloudFormation(properties.mode),
        Years: cdk.numberToCloudFormation(properties.years),
    };
}

// @ts-ignore TS6133
function CfnBucketDefaultRetentionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.DefaultRetentionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.DefaultRetentionProperty>();
    ret.addPropertyResult('days', 'Days', properties.Days != null ? cfn_parse.FromCloudFormation.getNumber(properties.Days) : undefined);
    ret.addPropertyResult('mode', 'Mode', properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined);
    ret.addPropertyResult('years', 'Years', properties.Years != null ? cfn_parse.FromCloudFormation.getNumber(properties.Years) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies whether Amazon S3 replicates delete markers. If you specify a `Filter` in your replication configuration, you must also include a `DeleteMarkerReplication` element. If your `Filter` includes a `Tag` element, the `DeleteMarkerReplication` `Status` must be set to Disabled, because Amazon S3 does not support replicating delete markers for tag-based rules. For an example configuration, see [Basic Rule Configuration](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-add-config.html#replication-config-min-rule-config) .
     *
     * For more information about delete marker replication, see [Basic Rule Configuration](https://docs.aws.amazon.com/AmazonS3/latest/dev/delete-marker-replication.html) .
     *
     * > If you are using an earlier version of the replication configuration, Amazon S3 handles replication of delete markers differently. For more information, see [Backward Compatibility](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-add-config.html#replication-backward-compat-considerations) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-deletemarkerreplication.html
     */
    export interface DeleteMarkerReplicationProperty {
        /**
         * Indicates whether to replicate delete markers. Disabled by default.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-deletemarkerreplication.html#cfn-s3-bucket-deletemarkerreplication-status
         */
        readonly status?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeleteMarkerReplicationProperty`
 *
 * @param properties - the TypeScript properties of a `DeleteMarkerReplicationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_DeleteMarkerReplicationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    return errors.wrap('supplied properties not correct for "DeleteMarkerReplicationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.DeleteMarkerReplication` resource
 *
 * @param properties - the TypeScript properties of a `DeleteMarkerReplicationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.DeleteMarkerReplication` resource.
 */
// @ts-ignore TS6133
function cfnBucketDeleteMarkerReplicationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_DeleteMarkerReplicationPropertyValidator(properties).assertSuccess();
    return {
        Status: cdk.stringToCloudFormation(properties.status),
    };
}

// @ts-ignore TS6133
function CfnBucketDeleteMarkerReplicationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.DeleteMarkerReplicationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.DeleteMarkerReplicationProperty>();
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies information about where to publish analysis or configuration results for an Amazon S3 bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html
     */
    export interface DestinationProperty {
        /**
         * The account ID that owns the destination S3 bucket. If no account ID is provided, the owner is not validated before exporting data.
         *
         * > Although this value is optional, we strongly recommend that you set it to help prevent problems if the destination bucket ownership changes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html#cfn-s3-bucket-destination-bucketaccountid
         */
        readonly bucketAccountId?: string;
        /**
         * The Amazon Resource Name (ARN) of the bucket to which data is exported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html#cfn-s3-bucket-destination-bucketarn
         */
        readonly bucketArn: string;
        /**
         * Specifies the file format used when exporting data to Amazon S3.
         *
         * *Allowed values* : `CSV` | `ORC` | `Parquet`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html#cfn-s3-bucket-destination-format
         */
        readonly format: string;
        /**
         * The prefix to use when exporting data. The prefix is prepended to all results.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html#cfn-s3-bucket-destination-prefix
         */
        readonly prefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DestinationProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_DestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketAccountId', cdk.validateString)(properties.bucketAccountId));
    errors.collect(cdk.propertyValidator('bucketArn', cdk.requiredValidator)(properties.bucketArn));
    errors.collect(cdk.propertyValidator('bucketArn', cdk.validateString)(properties.bucketArn));
    errors.collect(cdk.propertyValidator('format', cdk.requiredValidator)(properties.format));
    errors.collect(cdk.propertyValidator('format', cdk.validateString)(properties.format));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    return errors.wrap('supplied properties not correct for "DestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.Destination` resource
 *
 * @param properties - the TypeScript properties of a `DestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.Destination` resource.
 */
// @ts-ignore TS6133
function cfnBucketDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_DestinationPropertyValidator(properties).assertSuccess();
    return {
        BucketAccountId: cdk.stringToCloudFormation(properties.bucketAccountId),
        BucketArn: cdk.stringToCloudFormation(properties.bucketArn),
        Format: cdk.stringToCloudFormation(properties.format),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
    };
}

// @ts-ignore TS6133
function CfnBucketDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.DestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.DestinationProperty>();
    ret.addPropertyResult('bucketAccountId', 'BucketAccountId', properties.BucketAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.BucketAccountId) : undefined);
    ret.addPropertyResult('bucketArn', 'BucketArn', cfn_parse.FromCloudFormation.getString(properties.BucketArn));
    ret.addPropertyResult('format', 'Format', cfn_parse.FromCloudFormation.getString(properties.Format));
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies encryption-related information for an Amazon S3 bucket that is a destination for replicated objects.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-encryptionconfiguration.html
     */
    export interface EncryptionConfigurationProperty {
        /**
         * Specifies the ID (Key ARN or Alias ARN) of the customer managed AWS KMS key stored in AWS Key Management Service (KMS) for the destination bucket. Amazon S3 uses this key to encrypt replica objects. Amazon S3 only supports symmetric encryption KMS keys. For more information, see [Asymmetric keys in AWS KMS](https://docs.aws.amazon.com//kms/latest/developerguide/symmetric-asymmetric.html) in the *AWS Key Management Service Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-encryptionconfiguration.html#cfn-s3-bucket-encryptionconfiguration-replicakmskeyid
         */
        readonly replicaKmsKeyId: string;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_EncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('replicaKmsKeyId', cdk.requiredValidator)(properties.replicaKmsKeyId));
    errors.collect(cdk.propertyValidator('replicaKmsKeyId', cdk.validateString)(properties.replicaKmsKeyId));
    return errors.wrap('supplied properties not correct for "EncryptionConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.EncryptionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.EncryptionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_EncryptionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ReplicaKmsKeyID: cdk.stringToCloudFormation(properties.replicaKmsKeyId),
    };
}

// @ts-ignore TS6133
function CfnBucketEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.EncryptionConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.EncryptionConfigurationProperty>();
    ret.addPropertyResult('replicaKmsKeyId', 'ReplicaKmsKeyID', cfn_parse.FromCloudFormation.getString(properties.ReplicaKmsKeyID));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Amazon S3 can send events to Amazon EventBridge whenever certain events happen in your bucket, see [Using EventBridge](https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventBridge.html) in the *Amazon S3 User Guide* .
     *
     * Unlike other destinations, delivery of events to EventBridge can be either enabled or disabled for a bucket. If enabled, all events will be sent to EventBridge and you can use EventBridge rules to route events to additional targets. For more information, see [What Is Amazon EventBridge](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html) in the *Amazon EventBridge User Guide*
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-eventbridgeconfig.html
     */
    export interface EventBridgeConfigurationProperty {
        /**
         * Enables delivery of events to Amazon EventBridge.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-eventbridgeconfig.html#cfn-s3-bucket-eventbridgeconfiguration-eventbridgeenabled
         */
        readonly eventBridgeEnabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EventBridgeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EventBridgeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_EventBridgeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('eventBridgeEnabled', cdk.validateBoolean)(properties.eventBridgeEnabled));
    return errors.wrap('supplied properties not correct for "EventBridgeConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.EventBridgeConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `EventBridgeConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.EventBridgeConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketEventBridgeConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_EventBridgeConfigurationPropertyValidator(properties).assertSuccess();
    return {
        EventBridgeEnabled: cdk.booleanToCloudFormation(properties.eventBridgeEnabled),
    };
}

// @ts-ignore TS6133
function CfnBucketEventBridgeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.EventBridgeConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.EventBridgeConfigurationProperty>();
    ret.addPropertyResult('eventBridgeEnabled', 'EventBridgeEnabled', properties.EventBridgeEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EventBridgeEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies the Amazon S3 object key name to filter on and whether to filter on the suffix or prefix of the key name.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key-rules.html
     */
    export interface FilterRuleProperty {
        /**
         * The object key name prefix or suffix identifying one or more objects to which the filtering rule applies. The maximum length is 1,024 characters. Overlapping prefixes and suffixes are not supported. For more information, see [Configuring Event Notifications](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key-rules.html#cfn-s3-bucket-notificationconfiguraiton-config-filter-s3key-rules-name
         */
        readonly name: string;
        /**
         * The value that the filter searches for in object key names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key-rules.html#cfn-s3-bucket-notificationconfiguraiton-config-filter-s3key-rules-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `FilterRuleProperty`
 *
 * @param properties - the TypeScript properties of a `FilterRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_FilterRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "FilterRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.FilterRule` resource
 *
 * @param properties - the TypeScript properties of a `FilterRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.FilterRule` resource.
 */
// @ts-ignore TS6133
function cfnBucketFilterRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_FilterRulePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnBucketFilterRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.FilterRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.FilterRuleProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies the S3 Intelligent-Tiering configuration for an Amazon S3 bucket.
     *
     * For information about the S3 Intelligent-Tiering storage class, see [Storage class for automatically optimizing frequently and infrequently accessed objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/storage-class-intro.html#sc-dynamic-data-access) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html
     */
    export interface IntelligentTieringConfigurationProperty {
        /**
         * The ID used to identify the S3 Intelligent-Tiering configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html#cfn-s3-bucket-intelligenttieringconfiguration-id
         */
        readonly id: string;
        /**
         * An object key name prefix that identifies the subset of objects to which the rule applies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html#cfn-s3-bucket-intelligenttieringconfiguration-prefix
         */
        readonly prefix?: string;
        /**
         * Specifies the status of the configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html#cfn-s3-bucket-intelligenttieringconfiguration-status
         */
        readonly status: string;
        /**
         * A container for a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html#cfn-s3-bucket-intelligenttieringconfiguration-tagfilters
         */
        readonly tagFilters?: Array<CfnBucket.TagFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies a list of S3 Intelligent-Tiering storage class tiers in the configuration. At least one tier must be defined in the list. At most, you can specify two tiers in the list, one for each available AccessTier: `ARCHIVE_ACCESS` and `DEEP_ARCHIVE_ACCESS` .
         *
         * > You only need Intelligent Tiering Configuration enabled on a bucket if you want to automatically move objects stored in the Intelligent-Tiering storage class to Archive Access or Deep Archive Access tiers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html#cfn-s3-bucket-intelligenttieringconfiguration-tierings
         */
        readonly tierings: Array<CfnBucket.TieringProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `IntelligentTieringConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `IntelligentTieringConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_IntelligentTieringConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('status', cdk.requiredValidator)(properties.status));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    errors.collect(cdk.propertyValidator('tagFilters', cdk.listValidator(CfnBucket_TagFilterPropertyValidator))(properties.tagFilters));
    errors.collect(cdk.propertyValidator('tierings', cdk.requiredValidator)(properties.tierings));
    errors.collect(cdk.propertyValidator('tierings', cdk.listValidator(CfnBucket_TieringPropertyValidator))(properties.tierings));
    return errors.wrap('supplied properties not correct for "IntelligentTieringConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.IntelligentTieringConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `IntelligentTieringConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.IntelligentTieringConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketIntelligentTieringConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_IntelligentTieringConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        Status: cdk.stringToCloudFormation(properties.status),
        TagFilters: cdk.listMapper(cfnBucketTagFilterPropertyToCloudFormation)(properties.tagFilters),
        Tierings: cdk.listMapper(cfnBucketTieringPropertyToCloudFormation)(properties.tierings),
    };
}

// @ts-ignore TS6133
function CfnBucketIntelligentTieringConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.IntelligentTieringConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.IntelligentTieringConfigurationProperty>();
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('status', 'Status', cfn_parse.FromCloudFormation.getString(properties.Status));
    ret.addPropertyResult('tagFilters', 'TagFilters', properties.TagFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketTagFilterPropertyFromCloudFormation)(properties.TagFilters) : undefined);
    ret.addPropertyResult('tierings', 'Tierings', cfn_parse.FromCloudFormation.getArray(CfnBucketTieringPropertyFromCloudFormation)(properties.Tierings));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies the inventory configuration for an Amazon S3 bucket. For more information, see [GET Bucket inventory](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketGETInventoryConfig.html) in the *Amazon S3 API Reference* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html
     */
    export interface InventoryConfigurationProperty {
        /**
         * Contains information about where to publish the inventory results.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-destination
         */
        readonly destination: CfnBucket.DestinationProperty | cdk.IResolvable;
        /**
         * Specifies whether the inventory is enabled or disabled. If set to `True` , an inventory list is generated. If set to `False` , no inventory list is generated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * The ID used to identify the inventory configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-id
         */
        readonly id: string;
        /**
         * Object versions to include in the inventory list. If set to `All` , the list includes all the object versions, which adds the version-related fields `VersionId` , `IsLatest` , and `DeleteMarker` to the list. If set to `Current` , the list does not contain these version-related fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-includedobjectversions
         */
        readonly includedObjectVersions: string;
        /**
         * Contains the optional fields that are included in the inventory results.
         *
         * *Valid values* : `Size | LastModifiedDate | StorageClass | ETag | IsMultipartUploaded | ReplicationStatus | EncryptionStatus | ObjectLockRetainUntilDate | ObjectLockMode | ObjectLockLegalHoldStatus | IntelligentTieringAccessTier | BucketKeyStatus`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-optionalfields
         */
        readonly optionalFields?: string[];
        /**
         * Specifies the inventory filter prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-prefix
         */
        readonly prefix?: string;
        /**
         * Specifies the schedule for generating inventory results.
         *
         * *Allowed values* : `Daily` | `Weekly`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-schedulefrequency
         */
        readonly scheduleFrequency: string;
    }
}

/**
 * Determine whether the given properties match those of a `InventoryConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `InventoryConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_InventoryConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', cdk.requiredValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('destination', CfnBucket_DestinationPropertyValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('includedObjectVersions', cdk.requiredValidator)(properties.includedObjectVersions));
    errors.collect(cdk.propertyValidator('includedObjectVersions', cdk.validateString)(properties.includedObjectVersions));
    errors.collect(cdk.propertyValidator('optionalFields', cdk.listValidator(cdk.validateString))(properties.optionalFields));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('scheduleFrequency', cdk.requiredValidator)(properties.scheduleFrequency));
    errors.collect(cdk.propertyValidator('scheduleFrequency', cdk.validateString)(properties.scheduleFrequency));
    return errors.wrap('supplied properties not correct for "InventoryConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.InventoryConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `InventoryConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.InventoryConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketInventoryConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_InventoryConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Destination: cfnBucketDestinationPropertyToCloudFormation(properties.destination),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        Id: cdk.stringToCloudFormation(properties.id),
        IncludedObjectVersions: cdk.stringToCloudFormation(properties.includedObjectVersions),
        OptionalFields: cdk.listMapper(cdk.stringToCloudFormation)(properties.optionalFields),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        ScheduleFrequency: cdk.stringToCloudFormation(properties.scheduleFrequency),
    };
}

// @ts-ignore TS6133
function CfnBucketInventoryConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.InventoryConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.InventoryConfigurationProperty>();
    ret.addPropertyResult('destination', 'Destination', CfnBucketDestinationPropertyFromCloudFormation(properties.Destination));
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('includedObjectVersions', 'IncludedObjectVersions', cfn_parse.FromCloudFormation.getString(properties.IncludedObjectVersions));
    ret.addPropertyResult('optionalFields', 'OptionalFields', properties.OptionalFields != null ? cfn_parse.FromCloudFormation.getStringArray(properties.OptionalFields) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('scheduleFrequency', 'ScheduleFrequency', cfn_parse.FromCloudFormation.getString(properties.ScheduleFrequency));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Describes the AWS Lambda functions to invoke and the events for which to invoke them.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-lambdaconfig.html
     */
    export interface LambdaConfigurationProperty {
        /**
         * The Amazon S3 bucket event for which to invoke the AWS Lambda function. For more information, see [Supported Event Types](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-lambdaconfig.html#cfn-s3-bucket-notificationconfig-lambdaconfig-event
         */
        readonly event: string;
        /**
         * The filtering rules that determine which objects invoke the AWS Lambda function. For example, you can create a filter so that only image files with a `.jpg` extension invoke the function when they are added to the Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-lambdaconfig.html#cfn-s3-bucket-notificationconfig-lambdaconfig-filter
         */
        readonly filter?: CfnBucket.NotificationFilterProperty | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the AWS Lambda function that Amazon S3 invokes when the specified event type occurs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-lambdaconfig.html#cfn-s3-bucket-notificationconfig-lambdaconfig-function
         */
        readonly function: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_LambdaConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('event', cdk.requiredValidator)(properties.event));
    errors.collect(cdk.propertyValidator('event', cdk.validateString)(properties.event));
    errors.collect(cdk.propertyValidator('filter', CfnBucket_NotificationFilterPropertyValidator)(properties.filter));
    errors.collect(cdk.propertyValidator('function', cdk.requiredValidator)(properties.function));
    errors.collect(cdk.propertyValidator('function', cdk.validateString)(properties.function));
    return errors.wrap('supplied properties not correct for "LambdaConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.LambdaConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LambdaConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.LambdaConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketLambdaConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_LambdaConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Event: cdk.stringToCloudFormation(properties.event),
        Filter: cfnBucketNotificationFilterPropertyToCloudFormation(properties.filter),
        Function: cdk.stringToCloudFormation(properties.function),
    };
}

// @ts-ignore TS6133
function CfnBucketLambdaConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.LambdaConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.LambdaConfigurationProperty>();
    ret.addPropertyResult('event', 'Event', cfn_parse.FromCloudFormation.getString(properties.Event));
    ret.addPropertyResult('filter', 'Filter', properties.Filter != null ? CfnBucketNotificationFilterPropertyFromCloudFormation(properties.Filter) : undefined);
    ret.addPropertyResult('function', 'Function', cfn_parse.FromCloudFormation.getString(properties.Function));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies the lifecycle configuration for objects in an Amazon S3 bucket. For more information, see [Object Lifecycle Management](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lifecycle-mgmt.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig.html
     */
    export interface LifecycleConfigurationProperty {
        /**
         * A lifecycle rule for individual objects in an Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig.html#cfn-s3-bucket-lifecycleconfig-rules
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
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.LifecycleConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LifecycleConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.LifecycleConfiguration` resource.
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
     * Describes where logs are stored and the prefix that Amazon S3 assigns to all log object keys for a bucket. For examples and more information, see [PUT Bucket logging](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTlogging.html) in the *Amazon S3 API Reference* .
     *
     * > To successfully complete the `AWS::S3::Bucket LoggingConfiguration` request, you must have `s3:PutObject` and `s3:PutObjectAcl` in your IAM permissions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-loggingconfig.html
     */
    export interface LoggingConfigurationProperty {
        /**
         * The name of the bucket where Amazon S3 should store server access log files. You can store log files in any bucket that you own. By default, logs are stored in the bucket where the `LoggingConfiguration` property is defined.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-loggingconfig.html#cfn-s3-bucket-loggingconfig-destinationbucketname
         */
        readonly destinationBucketName?: string;
        /**
         * A prefix for all log object keys. If you store log files from multiple Amazon S3 buckets in a single bucket, you can use a prefix to distinguish which log files came from which bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-loggingconfig.html#cfn-s3-bucket-loggingconfig-logfileprefix
         */
        readonly logFilePrefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LoggingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_LoggingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationBucketName', cdk.validateString)(properties.destinationBucketName));
    errors.collect(cdk.propertyValidator('logFilePrefix', cdk.validateString)(properties.logFilePrefix));
    return errors.wrap('supplied properties not correct for "LoggingConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.LoggingConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LoggingConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.LoggingConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketLoggingConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_LoggingConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DestinationBucketName: cdk.stringToCloudFormation(properties.destinationBucketName),
        LogFilePrefix: cdk.stringToCloudFormation(properties.logFilePrefix),
    };
}

// @ts-ignore TS6133
function CfnBucketLoggingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.LoggingConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.LoggingConfigurationProperty>();
    ret.addPropertyResult('destinationBucketName', 'DestinationBucketName', properties.DestinationBucketName != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationBucketName) : undefined);
    ret.addPropertyResult('logFilePrefix', 'LogFilePrefix', properties.LogFilePrefix != null ? cfn_parse.FromCloudFormation.getString(properties.LogFilePrefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * A container specifying replication metrics-related settings enabling replication metrics and events.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metrics.html
     */
    export interface MetricsProperty {
        /**
         * A container specifying the time threshold for emitting the `s3:Replication:OperationMissedThreshold` event.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metrics.html#cfn-s3-bucket-metrics-eventthreshold
         */
        readonly eventThreshold?: CfnBucket.ReplicationTimeValueProperty | cdk.IResolvable;
        /**
         * Specifies whether the replication metrics are enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metrics.html#cfn-s3-bucket-metrics-status
         */
        readonly status: string;
    }
}

/**
 * Determine whether the given properties match those of a `MetricsProperty`
 *
 * @param properties - the TypeScript properties of a `MetricsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_MetricsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('eventThreshold', CfnBucket_ReplicationTimeValuePropertyValidator)(properties.eventThreshold));
    errors.collect(cdk.propertyValidator('status', cdk.requiredValidator)(properties.status));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    return errors.wrap('supplied properties not correct for "MetricsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.Metrics` resource
 *
 * @param properties - the TypeScript properties of a `MetricsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.Metrics` resource.
 */
// @ts-ignore TS6133
function cfnBucketMetricsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_MetricsPropertyValidator(properties).assertSuccess();
    return {
        EventThreshold: cfnBucketReplicationTimeValuePropertyToCloudFormation(properties.eventThreshold),
        Status: cdk.stringToCloudFormation(properties.status),
    };
}

// @ts-ignore TS6133
function CfnBucketMetricsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.MetricsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.MetricsProperty>();
    ret.addPropertyResult('eventThreshold', 'EventThreshold', properties.EventThreshold != null ? CfnBucketReplicationTimeValuePropertyFromCloudFormation(properties.EventThreshold) : undefined);
    ret.addPropertyResult('status', 'Status', cfn_parse.FromCloudFormation.getString(properties.Status));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies a metrics configuration for the CloudWatch request metrics (specified by the metrics configuration ID) from an Amazon S3 bucket. If you're updating an existing metrics configuration, note that this is a full replacement of the existing metrics configuration. If you don't include the elements you want to keep, they are erased. For examples, see [AWS::S3::Bucket](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#aws-properties-s3-bucket--examples) . For more information, see [PUT Bucket metrics](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTMetricConfiguration.html) in the *Amazon S3 API Reference* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html
     */
    export interface MetricsConfigurationProperty {
        /**
         * The access point that was used while performing operations on the object. The metrics configuration only includes objects that meet the filter's criteria.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html#cfn-s3-bucket-metricsconfiguration-accesspointarn
         */
        readonly accessPointArn?: string;
        /**
         * The ID used to identify the metrics configuration. This can be any value you choose that helps you identify your metrics configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html#cfn-s3-bucket-metricsconfiguration-id
         */
        readonly id: string;
        /**
         * The prefix that an object must have to be included in the metrics results.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html#cfn-s3-bucket-metricsconfiguration-prefix
         */
        readonly prefix?: string;
        /**
         * Specifies a list of tag filters to use as a metrics configuration filter. The metrics configuration includes only objects that meet the filter's criteria.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html#cfn-s3-bucket-metricsconfiguration-tagfilters
         */
        readonly tagFilters?: Array<CfnBucket.TagFilterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MetricsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MetricsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_MetricsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessPointArn', cdk.validateString)(properties.accessPointArn));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('tagFilters', cdk.listValidator(CfnBucket_TagFilterPropertyValidator))(properties.tagFilters));
    return errors.wrap('supplied properties not correct for "MetricsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.MetricsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `MetricsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.MetricsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketMetricsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_MetricsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AccessPointArn: cdk.stringToCloudFormation(properties.accessPointArn),
        Id: cdk.stringToCloudFormation(properties.id),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        TagFilters: cdk.listMapper(cfnBucketTagFilterPropertyToCloudFormation)(properties.tagFilters),
    };
}

// @ts-ignore TS6133
function CfnBucketMetricsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.MetricsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.MetricsConfigurationProperty>();
    ret.addPropertyResult('accessPointArn', 'AccessPointArn', properties.AccessPointArn != null ? cfn_parse.FromCloudFormation.getString(properties.AccessPointArn) : undefined);
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('tagFilters', 'TagFilters', properties.TagFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketTagFilterPropertyFromCloudFormation)(properties.TagFilters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies when noncurrent object versions expire. Upon expiration, Amazon S3 permanently deletes the noncurrent object versions. You set this lifecycle configuration action on a bucket that has versioning enabled (or suspended) to request that Amazon S3 delete noncurrent object versions at a specific period in the object's lifetime.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversionexpiration.html
     */
    export interface NoncurrentVersionExpirationProperty {
        /**
         * Specifies how many noncurrent versions Amazon S3 will retain. If there are this many more recent noncurrent versions, Amazon S3 will take the associated action. For more information about noncurrent versions, see [Lifecycle configuration elements](https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversionexpiration.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversionexpiration-newernoncurrentversions
         */
        readonly newerNoncurrentVersions?: number;
        /**
         * Specifies the number of days an object is noncurrent before Amazon S3 can perform the associated action. For information about the noncurrent days calculations, see [How Amazon S3 Calculates When an Object Became Noncurrent](https://docs.aws.amazon.com/AmazonS3/latest/dev/intro-lifecycle-rules.html#non-current-days-calculations) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversionexpiration.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversionexpiration-noncurrentdays
         */
        readonly noncurrentDays: number;
    }
}

/**
 * Determine whether the given properties match those of a `NoncurrentVersionExpirationProperty`
 *
 * @param properties - the TypeScript properties of a `NoncurrentVersionExpirationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_NoncurrentVersionExpirationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('newerNoncurrentVersions', cdk.validateNumber)(properties.newerNoncurrentVersions));
    errors.collect(cdk.propertyValidator('noncurrentDays', cdk.requiredValidator)(properties.noncurrentDays));
    errors.collect(cdk.propertyValidator('noncurrentDays', cdk.validateNumber)(properties.noncurrentDays));
    return errors.wrap('supplied properties not correct for "NoncurrentVersionExpirationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.NoncurrentVersionExpiration` resource
 *
 * @param properties - the TypeScript properties of a `NoncurrentVersionExpirationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.NoncurrentVersionExpiration` resource.
 */
// @ts-ignore TS6133
function cfnBucketNoncurrentVersionExpirationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_NoncurrentVersionExpirationPropertyValidator(properties).assertSuccess();
    return {
        NewerNoncurrentVersions: cdk.numberToCloudFormation(properties.newerNoncurrentVersions),
        NoncurrentDays: cdk.numberToCloudFormation(properties.noncurrentDays),
    };
}

// @ts-ignore TS6133
function CfnBucketNoncurrentVersionExpirationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.NoncurrentVersionExpirationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.NoncurrentVersionExpirationProperty>();
    ret.addPropertyResult('newerNoncurrentVersions', 'NewerNoncurrentVersions', properties.NewerNoncurrentVersions != null ? cfn_parse.FromCloudFormation.getNumber(properties.NewerNoncurrentVersions) : undefined);
    ret.addPropertyResult('noncurrentDays', 'NoncurrentDays', cfn_parse.FromCloudFormation.getNumber(properties.NoncurrentDays));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Container for the transition rule that describes when noncurrent objects transition to the `STANDARD_IA` , `ONEZONE_IA` , `INTELLIGENT_TIERING` , `GLACIER_IR` , `GLACIER` , or `DEEP_ARCHIVE` storage class. If your bucket is versioning-enabled (or versioning is suspended), you can set this action to request that Amazon S3 transition noncurrent object versions to the `STANDARD_IA` , `ONEZONE_IA` , `INTELLIGENT_TIERING` , `GLACIER_IR` , `GLACIER` , or `DEEP_ARCHIVE` storage class at a specific period in the object's lifetime. If you specify this property, don't specify the `NoncurrentVersionTransitions` property.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition.html
     */
    export interface NoncurrentVersionTransitionProperty {
        /**
         * Specifies how many noncurrent versions Amazon S3 will retain. If there are this many more recent noncurrent versions, Amazon S3 will take the associated action. For more information about noncurrent versions, see [Lifecycle configuration elements](https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition-newernoncurrentversions
         */
        readonly newerNoncurrentVersions?: number;
        /**
         * The class of storage used to store the object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition-storageclass
         */
        readonly storageClass: string;
        /**
         * Specifies the number of days an object is noncurrent before Amazon S3 can perform the associated action. For information about the noncurrent days calculations, see [How Amazon S3 Calculates How Long an Object Has Been Noncurrent](https://docs.aws.amazon.com/AmazonS3/latest/dev/intro-lifecycle-rules.html#non-current-days-calculations) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition-transitionindays
         */
        readonly transitionInDays: number;
    }
}

/**
 * Determine whether the given properties match those of a `NoncurrentVersionTransitionProperty`
 *
 * @param properties - the TypeScript properties of a `NoncurrentVersionTransitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_NoncurrentVersionTransitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('newerNoncurrentVersions', cdk.validateNumber)(properties.newerNoncurrentVersions));
    errors.collect(cdk.propertyValidator('storageClass', cdk.requiredValidator)(properties.storageClass));
    errors.collect(cdk.propertyValidator('storageClass', cdk.validateString)(properties.storageClass));
    errors.collect(cdk.propertyValidator('transitionInDays', cdk.requiredValidator)(properties.transitionInDays));
    errors.collect(cdk.propertyValidator('transitionInDays', cdk.validateNumber)(properties.transitionInDays));
    return errors.wrap('supplied properties not correct for "NoncurrentVersionTransitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.NoncurrentVersionTransition` resource
 *
 * @param properties - the TypeScript properties of a `NoncurrentVersionTransitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.NoncurrentVersionTransition` resource.
 */
// @ts-ignore TS6133
function cfnBucketNoncurrentVersionTransitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_NoncurrentVersionTransitionPropertyValidator(properties).assertSuccess();
    return {
        NewerNoncurrentVersions: cdk.numberToCloudFormation(properties.newerNoncurrentVersions),
        StorageClass: cdk.stringToCloudFormation(properties.storageClass),
        TransitionInDays: cdk.numberToCloudFormation(properties.transitionInDays),
    };
}

// @ts-ignore TS6133
function CfnBucketNoncurrentVersionTransitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.NoncurrentVersionTransitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.NoncurrentVersionTransitionProperty>();
    ret.addPropertyResult('newerNoncurrentVersions', 'NewerNoncurrentVersions', properties.NewerNoncurrentVersions != null ? cfn_parse.FromCloudFormation.getNumber(properties.NewerNoncurrentVersions) : undefined);
    ret.addPropertyResult('storageClass', 'StorageClass', cfn_parse.FromCloudFormation.getString(properties.StorageClass));
    ret.addPropertyResult('transitionInDays', 'TransitionInDays', cfn_parse.FromCloudFormation.getNumber(properties.TransitionInDays));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Describes the notification configuration for an Amazon S3 bucket.
     *
     * > If you create the target resource and related permissions in the same template, you might have a circular dependency.
     * >
     * > For example, you might use the `AWS::Lambda::Permission` resource to grant the bucket permission to invoke an AWS Lambda function. However, AWS CloudFormation can't create the bucket until the bucket has permission to invoke the function ( AWS CloudFormation checks whether the bucket can invoke the function). If you're using Refs to pass the bucket name, this leads to a circular dependency.
     * >
     * > To avoid this dependency, you can create all resources without specifying the notification configuration. Then, update the stack with a notification configuration.
     * >
     * > For more information on permissions, see [AWS::Lambda::Permission](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html) and [Granting Permissions to Publish Event Notification Messages to a Destination](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html#grant-destinations-permissions-to-s3) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html
     */
    export interface NotificationConfigurationProperty {
        /**
         * Enables delivery of events to Amazon EventBridge.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html#cfn-s3-bucket-notificationconfig-eventbridgeconfig
         */
        readonly eventBridgeConfiguration?: CfnBucket.EventBridgeConfigurationProperty | cdk.IResolvable;
        /**
         * Describes the AWS Lambda functions to invoke and the events for which to invoke them.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html#cfn-s3-bucket-notificationconfig-lambdaconfig
         */
        readonly lambdaConfigurations?: Array<CfnBucket.LambdaConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The Amazon Simple Queue Service queues to publish messages to and the events for which to publish messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html#cfn-s3-bucket-notificationconfig-queueconfig
         */
        readonly queueConfigurations?: Array<CfnBucket.QueueConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The topic to which notifications are sent and the events for which notifications are generated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html#cfn-s3-bucket-notificationconfig-topicconfig
         */
        readonly topicConfigurations?: Array<CfnBucket.TopicConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NotificationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_NotificationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('eventBridgeConfiguration', CfnBucket_EventBridgeConfigurationPropertyValidator)(properties.eventBridgeConfiguration));
    errors.collect(cdk.propertyValidator('lambdaConfigurations', cdk.listValidator(CfnBucket_LambdaConfigurationPropertyValidator))(properties.lambdaConfigurations));
    errors.collect(cdk.propertyValidator('queueConfigurations', cdk.listValidator(CfnBucket_QueueConfigurationPropertyValidator))(properties.queueConfigurations));
    errors.collect(cdk.propertyValidator('topicConfigurations', cdk.listValidator(CfnBucket_TopicConfigurationPropertyValidator))(properties.topicConfigurations));
    return errors.wrap('supplied properties not correct for "NotificationConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.NotificationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `NotificationConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.NotificationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketNotificationConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_NotificationConfigurationPropertyValidator(properties).assertSuccess();
    return {
        EventBridgeConfiguration: cfnBucketEventBridgeConfigurationPropertyToCloudFormation(properties.eventBridgeConfiguration),
        LambdaConfigurations: cdk.listMapper(cfnBucketLambdaConfigurationPropertyToCloudFormation)(properties.lambdaConfigurations),
        QueueConfigurations: cdk.listMapper(cfnBucketQueueConfigurationPropertyToCloudFormation)(properties.queueConfigurations),
        TopicConfigurations: cdk.listMapper(cfnBucketTopicConfigurationPropertyToCloudFormation)(properties.topicConfigurations),
    };
}

// @ts-ignore TS6133
function CfnBucketNotificationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.NotificationConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.NotificationConfigurationProperty>();
    ret.addPropertyResult('eventBridgeConfiguration', 'EventBridgeConfiguration', properties.EventBridgeConfiguration != null ? CfnBucketEventBridgeConfigurationPropertyFromCloudFormation(properties.EventBridgeConfiguration) : undefined);
    ret.addPropertyResult('lambdaConfigurations', 'LambdaConfigurations', properties.LambdaConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketLambdaConfigurationPropertyFromCloudFormation)(properties.LambdaConfigurations) : undefined);
    ret.addPropertyResult('queueConfigurations', 'QueueConfigurations', properties.QueueConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketQueueConfigurationPropertyFromCloudFormation)(properties.QueueConfigurations) : undefined);
    ret.addPropertyResult('topicConfigurations', 'TopicConfigurations', properties.TopicConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketTopicConfigurationPropertyFromCloudFormation)(properties.TopicConfigurations) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies object key name filtering rules. For information about key name filtering, see [Configuring event notifications using object key name filtering](https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-filtering.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html
     */
    export interface NotificationFilterProperty {
        /**
         * A container for object key name prefix and suffix filtering rules.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html#cfn-s3-bucket-notificationconfiguraiton-config-filter-s3key
         */
        readonly s3Key: CfnBucket.S3KeyFilterProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NotificationFilterProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_NotificationFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3Key', cdk.requiredValidator)(properties.s3Key));
    errors.collect(cdk.propertyValidator('s3Key', CfnBucket_S3KeyFilterPropertyValidator)(properties.s3Key));
    return errors.wrap('supplied properties not correct for "NotificationFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.NotificationFilter` resource
 *
 * @param properties - the TypeScript properties of a `NotificationFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.NotificationFilter` resource.
 */
// @ts-ignore TS6133
function cfnBucketNotificationFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_NotificationFilterPropertyValidator(properties).assertSuccess();
    return {
        S3Key: cfnBucketS3KeyFilterPropertyToCloudFormation(properties.s3Key),
    };
}

// @ts-ignore TS6133
function CfnBucketNotificationFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.NotificationFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.NotificationFilterProperty>();
    ret.addPropertyResult('s3Key', 'S3Key', CfnBucketS3KeyFilterPropertyFromCloudFormation(properties.S3Key));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Places an Object Lock configuration on the specified bucket. The rule specified in the Object Lock configuration will be applied by default to every new object placed in the specified bucket. For more information, see [Locking Objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lock.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockconfiguration.html
     */
    export interface ObjectLockConfigurationProperty {
        /**
         * Indicates whether this bucket has an Object Lock configuration enabled. Enable `ObjectLockEnabled` when you apply `ObjectLockConfiguration` to a bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockconfiguration.html#cfn-s3-bucket-objectlockconfiguration-objectlockenabled
         */
        readonly objectLockEnabled?: string;
        /**
         * Specifies the Object Lock rule for the specified object. Enable this rule when you apply `ObjectLockConfiguration` to a bucket. If Object Lock is turned on, bucket settings require both `Mode` and a period of either `Days` or `Years` . You cannot specify `Days` and `Years` at the same time. For more information, see [ObjectLockRule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockrule.html) and [DefaultRetention](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockconfiguration.html#cfn-s3-bucket-objectlockconfiguration-rule
         */
        readonly rule?: CfnBucket.ObjectLockRuleProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ObjectLockConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ObjectLockConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_ObjectLockConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('objectLockEnabled', cdk.validateString)(properties.objectLockEnabled));
    errors.collect(cdk.propertyValidator('rule', CfnBucket_ObjectLockRulePropertyValidator)(properties.rule));
    return errors.wrap('supplied properties not correct for "ObjectLockConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.ObjectLockConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ObjectLockConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.ObjectLockConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketObjectLockConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_ObjectLockConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ObjectLockEnabled: cdk.stringToCloudFormation(properties.objectLockEnabled),
        Rule: cfnBucketObjectLockRulePropertyToCloudFormation(properties.rule),
    };
}

// @ts-ignore TS6133
function CfnBucketObjectLockConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.ObjectLockConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ObjectLockConfigurationProperty>();
    ret.addPropertyResult('objectLockEnabled', 'ObjectLockEnabled', properties.ObjectLockEnabled != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectLockEnabled) : undefined);
    ret.addPropertyResult('rule', 'Rule', properties.Rule != null ? CfnBucketObjectLockRulePropertyFromCloudFormation(properties.Rule) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies the Object Lock rule for the specified object. Enable the this rule when you apply `ObjectLockConfiguration` to a bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockrule.html
     */
    export interface ObjectLockRuleProperty {
        /**
         * The default Object Lock retention mode and period that you want to apply to new objects placed in the specified bucket. If Object Lock is turned on, bucket settings require both `Mode` and a period of either `Days` or `Years` . You cannot specify `Days` and `Years` at the same time. For more information about allowable values for mode and period, see [DefaultRetention](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockrule.html#cfn-s3-bucket-objectlockrule-defaultretention
         */
        readonly defaultRetention?: CfnBucket.DefaultRetentionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ObjectLockRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ObjectLockRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_ObjectLockRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultRetention', CfnBucket_DefaultRetentionPropertyValidator)(properties.defaultRetention));
    return errors.wrap('supplied properties not correct for "ObjectLockRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.ObjectLockRule` resource
 *
 * @param properties - the TypeScript properties of a `ObjectLockRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.ObjectLockRule` resource.
 */
// @ts-ignore TS6133
function cfnBucketObjectLockRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_ObjectLockRulePropertyValidator(properties).assertSuccess();
    return {
        DefaultRetention: cfnBucketDefaultRetentionPropertyToCloudFormation(properties.defaultRetention),
    };
}

// @ts-ignore TS6133
function CfnBucketObjectLockRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.ObjectLockRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ObjectLockRuleProperty>();
    ret.addPropertyResult('defaultRetention', 'DefaultRetention', properties.DefaultRetention != null ? CfnBucketDefaultRetentionPropertyFromCloudFormation(properties.DefaultRetention) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies the container element for Object Ownership rules.
     *
     * S3 Object Ownership is an Amazon S3 bucket-level setting that you can use to disable access control lists (ACLs) and take ownership of every object in your bucket, simplifying access management for data stored in Amazon S3. For more information, see [Controlling ownership of objects and disabling ACLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrols.html
     */
    export interface OwnershipControlsProperty {
        /**
         * Specifies the container element for Object Ownership rules.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrols.html#cfn-s3-bucket-ownershipcontrols-rules
         */
        readonly rules: Array<CfnBucket.OwnershipControlsRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `OwnershipControlsProperty`
 *
 * @param properties - the TypeScript properties of a `OwnershipControlsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_OwnershipControlsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('rules', cdk.requiredValidator)(properties.rules));
    errors.collect(cdk.propertyValidator('rules', cdk.listValidator(CfnBucket_OwnershipControlsRulePropertyValidator))(properties.rules));
    return errors.wrap('supplied properties not correct for "OwnershipControlsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.OwnershipControls` resource
 *
 * @param properties - the TypeScript properties of a `OwnershipControlsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.OwnershipControls` resource.
 */
// @ts-ignore TS6133
function cfnBucketOwnershipControlsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_OwnershipControlsPropertyValidator(properties).assertSuccess();
    return {
        Rules: cdk.listMapper(cfnBucketOwnershipControlsRulePropertyToCloudFormation)(properties.rules),
    };
}

// @ts-ignore TS6133
function CfnBucketOwnershipControlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.OwnershipControlsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.OwnershipControlsProperty>();
    ret.addPropertyResult('rules', 'Rules', cfn_parse.FromCloudFormation.getArray(CfnBucketOwnershipControlsRulePropertyFromCloudFormation)(properties.Rules));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies an Object Ownership rule.
     *
     * S3 Object Ownership is an Amazon S3 bucket-level setting that you can use to disable access control lists (ACLs) and take ownership of every object in your bucket, simplifying access management for data stored in Amazon S3. For more information, see [Controlling ownership of objects and disabling ACLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrolsrule.html
     */
    export interface OwnershipControlsRuleProperty {
        /**
         * Specifies an Object Ownership rule.
         *
         * *Allowed values* : `BucketOwnerEnforced` | `ObjectWriter` | `BucketOwnerPreferred`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrolsrule.html#cfn-s3-bucket-ownershipcontrolsrule-objectownership
         */
        readonly objectOwnership?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OwnershipControlsRuleProperty`
 *
 * @param properties - the TypeScript properties of a `OwnershipControlsRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_OwnershipControlsRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('objectOwnership', cdk.validateString)(properties.objectOwnership));
    return errors.wrap('supplied properties not correct for "OwnershipControlsRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.OwnershipControlsRule` resource
 *
 * @param properties - the TypeScript properties of a `OwnershipControlsRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.OwnershipControlsRule` resource.
 */
// @ts-ignore TS6133
function cfnBucketOwnershipControlsRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_OwnershipControlsRulePropertyValidator(properties).assertSuccess();
    return {
        ObjectOwnership: cdk.stringToCloudFormation(properties.objectOwnership),
    };
}

// @ts-ignore TS6133
function CfnBucketOwnershipControlsRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.OwnershipControlsRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.OwnershipControlsRuleProperty>();
    ret.addPropertyResult('objectOwnership', 'ObjectOwnership', properties.ObjectOwnership != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectOwnership) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * The PublicAccessBlock configuration that you want to apply to this Amazon S3 bucket. You can enable the configuration options in any combination. For more information about when Amazon S3 considers a bucket or object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html
     */
    export interface PublicAccessBlockConfigurationProperty {
        /**
         * Specifies whether Amazon S3 should block public access control lists (ACLs) for this bucket and objects in this bucket. Setting this element to `TRUE` causes the following behavior:
         *
         * - PUT Bucket ACL and PUT Object ACL calls fail if the specified ACL is public.
         * - PUT Object calls fail if the request includes a public ACL.
         * - PUT Bucket calls fail if the request includes a public ACL.
         *
         * Enabling this setting doesn't affect existing policies or ACLs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html#cfn-s3-bucket-publicaccessblockconfiguration-blockpublicacls
         */
        readonly blockPublicAcls?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should block public bucket policies for this bucket. Setting this element to `TRUE` causes Amazon S3 to reject calls to PUT Bucket policy if the specified bucket policy allows public access.
         *
         * Enabling this setting doesn't affect existing bucket policies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html#cfn-s3-bucket-publicaccessblockconfiguration-blockpublicpolicy
         */
        readonly blockPublicPolicy?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should ignore public ACLs for this bucket and objects in this bucket. Setting this element to `TRUE` causes Amazon S3 to ignore all public ACLs on this bucket and objects in this bucket.
         *
         * Enabling this setting doesn't affect the persistence of any existing ACLs and doesn't prevent new public ACLs from being set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html#cfn-s3-bucket-publicaccessblockconfiguration-ignorepublicacls
         */
        readonly ignorePublicAcls?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should restrict public bucket policies for this bucket. Setting this element to `TRUE` restricts access to this bucket to only AWS service principals and authorized users within this account if the bucket has a public policy.
         *
         * Enabling this setting doesn't affect previously stored bucket policies, except that public and cross-account access within any public bucket policy, including non-public delegation to specific accounts, is blocked.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html#cfn-s3-bucket-publicaccessblockconfiguration-restrictpublicbuckets
         */
        readonly restrictPublicBuckets?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PublicAccessBlockConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `PublicAccessBlockConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_PublicAccessBlockConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('blockPublicAcls', cdk.validateBoolean)(properties.blockPublicAcls));
    errors.collect(cdk.propertyValidator('blockPublicPolicy', cdk.validateBoolean)(properties.blockPublicPolicy));
    errors.collect(cdk.propertyValidator('ignorePublicAcls', cdk.validateBoolean)(properties.ignorePublicAcls));
    errors.collect(cdk.propertyValidator('restrictPublicBuckets', cdk.validateBoolean)(properties.restrictPublicBuckets));
    return errors.wrap('supplied properties not correct for "PublicAccessBlockConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.PublicAccessBlockConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `PublicAccessBlockConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.PublicAccessBlockConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketPublicAccessBlockConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_PublicAccessBlockConfigurationPropertyValidator(properties).assertSuccess();
    return {
        BlockPublicAcls: cdk.booleanToCloudFormation(properties.blockPublicAcls),
        BlockPublicPolicy: cdk.booleanToCloudFormation(properties.blockPublicPolicy),
        IgnorePublicAcls: cdk.booleanToCloudFormation(properties.ignorePublicAcls),
        RestrictPublicBuckets: cdk.booleanToCloudFormation(properties.restrictPublicBuckets),
    };
}

// @ts-ignore TS6133
function CfnBucketPublicAccessBlockConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.PublicAccessBlockConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.PublicAccessBlockConfigurationProperty>();
    ret.addPropertyResult('blockPublicAcls', 'BlockPublicAcls', properties.BlockPublicAcls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BlockPublicAcls) : undefined);
    ret.addPropertyResult('blockPublicPolicy', 'BlockPublicPolicy', properties.BlockPublicPolicy != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BlockPublicPolicy) : undefined);
    ret.addPropertyResult('ignorePublicAcls', 'IgnorePublicAcls', properties.IgnorePublicAcls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IgnorePublicAcls) : undefined);
    ret.addPropertyResult('restrictPublicBuckets', 'RestrictPublicBuckets', properties.RestrictPublicBuckets != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RestrictPublicBuckets) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies the configuration for publishing messages to an Amazon Simple Queue Service (Amazon SQS) queue when Amazon S3 detects specified events.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-queueconfig.html
     */
    export interface QueueConfigurationProperty {
        /**
         * The Amazon S3 bucket event about which you want to publish messages to Amazon SQS. For more information, see [Supported Event Types](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-queueconfig.html#cfn-s3-bucket-notificationconfig-queueconfig-event
         */
        readonly event: string;
        /**
         * The filtering rules that determine which objects trigger notifications. For example, you can create a filter so that Amazon S3 sends notifications only when image files with a `.jpg` extension are added to the bucket. For more information, see [Configuring event notifications using object key name filtering](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/notification-how-to-filtering.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-queueconfig.html#cfn-s3-bucket-notificationconfig-queueconfig-filter
         */
        readonly filter?: CfnBucket.NotificationFilterProperty | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the Amazon SQS queue to which Amazon S3 publishes a message when it detects events of the specified type. FIFO queues are not allowed when enabling an SQS queue as the event notification destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-queueconfig.html#cfn-s3-bucket-notificationconfig-queueconfig-queue
         */
        readonly queue: string;
    }
}

/**
 * Determine whether the given properties match those of a `QueueConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `QueueConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_QueueConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('event', cdk.requiredValidator)(properties.event));
    errors.collect(cdk.propertyValidator('event', cdk.validateString)(properties.event));
    errors.collect(cdk.propertyValidator('filter', CfnBucket_NotificationFilterPropertyValidator)(properties.filter));
    errors.collect(cdk.propertyValidator('queue', cdk.requiredValidator)(properties.queue));
    errors.collect(cdk.propertyValidator('queue', cdk.validateString)(properties.queue));
    return errors.wrap('supplied properties not correct for "QueueConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.QueueConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `QueueConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.QueueConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketQueueConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_QueueConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Event: cdk.stringToCloudFormation(properties.event),
        Filter: cfnBucketNotificationFilterPropertyToCloudFormation(properties.filter),
        Queue: cdk.stringToCloudFormation(properties.queue),
    };
}

// @ts-ignore TS6133
function CfnBucketQueueConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.QueueConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.QueueConfigurationProperty>();
    ret.addPropertyResult('event', 'Event', cfn_parse.FromCloudFormation.getString(properties.Event));
    ret.addPropertyResult('filter', 'Filter', properties.Filter != null ? CfnBucketNotificationFilterPropertyFromCloudFormation(properties.Filter) : undefined);
    ret.addPropertyResult('queue', 'Queue', cfn_parse.FromCloudFormation.getString(properties.Queue));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies the redirect behavior of all requests to a website endpoint of an Amazon S3 bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-redirectallrequeststo.html
     */
    export interface RedirectAllRequestsToProperty {
        /**
         * Name of the host where requests are redirected.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-redirectallrequeststo.html#cfn-s3-websiteconfiguration-redirectallrequeststo-hostname
         */
        readonly hostName: string;
        /**
         * Protocol to use when redirecting requests. The default is the protocol that is used in the original request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-redirectallrequeststo.html#cfn-s3-websiteconfiguration-redirectallrequeststo-protocol
         */
        readonly protocol?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RedirectAllRequestsToProperty`
 *
 * @param properties - the TypeScript properties of a `RedirectAllRequestsToProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_RedirectAllRequestsToPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('hostName', cdk.requiredValidator)(properties.hostName));
    errors.collect(cdk.propertyValidator('hostName', cdk.validateString)(properties.hostName));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    return errors.wrap('supplied properties not correct for "RedirectAllRequestsToProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.RedirectAllRequestsTo` resource
 *
 * @param properties - the TypeScript properties of a `RedirectAllRequestsToProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.RedirectAllRequestsTo` resource.
 */
// @ts-ignore TS6133
function cfnBucketRedirectAllRequestsToPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_RedirectAllRequestsToPropertyValidator(properties).assertSuccess();
    return {
        HostName: cdk.stringToCloudFormation(properties.hostName),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
    };
}

// @ts-ignore TS6133
function CfnBucketRedirectAllRequestsToPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.RedirectAllRequestsToProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.RedirectAllRequestsToProperty>();
    ret.addPropertyResult('hostName', 'HostName', cfn_parse.FromCloudFormation.getString(properties.HostName));
    ret.addPropertyResult('protocol', 'Protocol', properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies how requests are redirected. In the event of an error, you can specify a different error code to return.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-redirectrule.html
     */
    export interface RedirectRuleProperty {
        /**
         * The host name to use in the redirect request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-redirectrule.html#cfn-s3-websiteconfiguration-redirectrule-hostname
         */
        readonly hostName?: string;
        /**
         * The HTTP redirect code to use on the response. Not required if one of the siblings is present.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-redirectrule.html#cfn-s3-websiteconfiguration-redirectrule-httpredirectcode
         */
        readonly httpRedirectCode?: string;
        /**
         * Protocol to use when redirecting requests. The default is the protocol that is used in the original request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-redirectrule.html#cfn-s3-websiteconfiguration-redirectrule-protocol
         */
        readonly protocol?: string;
        /**
         * The object key prefix to use in the redirect request. For example, to redirect requests for all pages with prefix `docs/` (objects in the `docs/` folder) to `documents/` , you can set a condition block with `KeyPrefixEquals` set to `docs/` and in the Redirect set `ReplaceKeyPrefixWith` to `/documents` . Not required if one of the siblings is present. Can be present only if `ReplaceKeyWith` is not provided.
         *
         * > Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-redirectrule.html#cfn-s3-websiteconfiguration-redirectrule-replacekeyprefixwith
         */
        readonly replaceKeyPrefixWith?: string;
        /**
         * The specific object key to use in the redirect request. For example, redirect request to `error.html` . Not required if one of the siblings is present. Can be present only if `ReplaceKeyPrefixWith` is not provided.
         *
         * > Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-redirectrule.html#cfn-s3-websiteconfiguration-redirectrule-replacekeywith
         */
        readonly replaceKeyWith?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RedirectRuleProperty`
 *
 * @param properties - the TypeScript properties of a `RedirectRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_RedirectRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('hostName', cdk.validateString)(properties.hostName));
    errors.collect(cdk.propertyValidator('httpRedirectCode', cdk.validateString)(properties.httpRedirectCode));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    errors.collect(cdk.propertyValidator('replaceKeyPrefixWith', cdk.validateString)(properties.replaceKeyPrefixWith));
    errors.collect(cdk.propertyValidator('replaceKeyWith', cdk.validateString)(properties.replaceKeyWith));
    return errors.wrap('supplied properties not correct for "RedirectRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.RedirectRule` resource
 *
 * @param properties - the TypeScript properties of a `RedirectRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.RedirectRule` resource.
 */
// @ts-ignore TS6133
function cfnBucketRedirectRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_RedirectRulePropertyValidator(properties).assertSuccess();
    return {
        HostName: cdk.stringToCloudFormation(properties.hostName),
        HttpRedirectCode: cdk.stringToCloudFormation(properties.httpRedirectCode),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
        ReplaceKeyPrefixWith: cdk.stringToCloudFormation(properties.replaceKeyPrefixWith),
        ReplaceKeyWith: cdk.stringToCloudFormation(properties.replaceKeyWith),
    };
}

// @ts-ignore TS6133
function CfnBucketRedirectRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.RedirectRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.RedirectRuleProperty>();
    ret.addPropertyResult('hostName', 'HostName', properties.HostName != null ? cfn_parse.FromCloudFormation.getString(properties.HostName) : undefined);
    ret.addPropertyResult('httpRedirectCode', 'HttpRedirectCode', properties.HttpRedirectCode != null ? cfn_parse.FromCloudFormation.getString(properties.HttpRedirectCode) : undefined);
    ret.addPropertyResult('protocol', 'Protocol', properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined);
    ret.addPropertyResult('replaceKeyPrefixWith', 'ReplaceKeyPrefixWith', properties.ReplaceKeyPrefixWith != null ? cfn_parse.FromCloudFormation.getString(properties.ReplaceKeyPrefixWith) : undefined);
    ret.addPropertyResult('replaceKeyWith', 'ReplaceKeyWith', properties.ReplaceKeyWith != null ? cfn_parse.FromCloudFormation.getString(properties.ReplaceKeyWith) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * A filter that you can specify for selection for modifications on replicas.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicamodifications.html
     */
    export interface ReplicaModificationsProperty {
        /**
         * Specifies whether Amazon S3 replicates modifications on replicas.
         *
         * *Allowed values* : `Enabled` | `Disabled`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicamodifications.html#cfn-s3-bucket-replicamodifications-status
         */
        readonly status: string;
    }
}

/**
 * Determine whether the given properties match those of a `ReplicaModificationsProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicaModificationsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_ReplicaModificationsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('status', cdk.requiredValidator)(properties.status));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    return errors.wrap('supplied properties not correct for "ReplicaModificationsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicaModifications` resource
 *
 * @param properties - the TypeScript properties of a `ReplicaModificationsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicaModifications` resource.
 */
// @ts-ignore TS6133
function cfnBucketReplicaModificationsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_ReplicaModificationsPropertyValidator(properties).assertSuccess();
    return {
        Status: cdk.stringToCloudFormation(properties.status),
    };
}

// @ts-ignore TS6133
function CfnBucketReplicaModificationsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.ReplicaModificationsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicaModificationsProperty>();
    ret.addPropertyResult('status', 'Status', cfn_parse.FromCloudFormation.getString(properties.Status));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * A container for replication rules. You can add up to 1,000 rules. The maximum size of a replication configuration is 2 MB.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration.html
     */
    export interface ReplicationConfigurationProperty {
        /**
         * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that Amazon S3 assumes when replicating objects. For more information, see [How to Set Up Replication](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-how-setup.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration.html#cfn-s3-bucket-replicationconfiguration-role
         */
        readonly role: string;
        /**
         * A container for one or more replication rules. A replication configuration must have at least one rule and can contain a maximum of 1,000 rules.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration.html#cfn-s3-bucket-replicationconfiguration-rules
         */
        readonly rules: Array<CfnBucket.ReplicationRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ReplicationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_ReplicationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('role', cdk.requiredValidator)(properties.role));
    errors.collect(cdk.propertyValidator('role', cdk.validateString)(properties.role));
    errors.collect(cdk.propertyValidator('rules', cdk.requiredValidator)(properties.rules));
    errors.collect(cdk.propertyValidator('rules', cdk.listValidator(CfnBucket_ReplicationRulePropertyValidator))(properties.rules));
    return errors.wrap('supplied properties not correct for "ReplicationConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ReplicationConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketReplicationConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_ReplicationConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Role: cdk.stringToCloudFormation(properties.role),
        Rules: cdk.listMapper(cfnBucketReplicationRulePropertyToCloudFormation)(properties.rules),
    };
}

// @ts-ignore TS6133
function CfnBucketReplicationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.ReplicationConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicationConfigurationProperty>();
    ret.addPropertyResult('role', 'Role', cfn_parse.FromCloudFormation.getString(properties.Role));
    ret.addPropertyResult('rules', 'Rules', cfn_parse.FromCloudFormation.getArray(CfnBucketReplicationRulePropertyFromCloudFormation)(properties.Rules));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * A container for information about the replication destination and its configurations including enabling the S3 Replication Time Control (S3 RTC).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html
     */
    export interface ReplicationDestinationProperty {
        /**
         * Specify this only in a cross-account scenario (where source and destination bucket owners are not the same), and you want to change replica ownership to the AWS account that owns the destination bucket. If this is not specified in the replication configuration, the replicas are owned by same AWS account that owns the source object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html#cfn-s3-bucket-replicationdestination-accesscontroltranslation
         */
        readonly accessControlTranslation?: CfnBucket.AccessControlTranslationProperty | cdk.IResolvable;
        /**
         * Destination bucket owner account ID. In a cross-account scenario, if you direct Amazon S3 to change replica ownership to the AWS account that owns the destination bucket by specifying the `AccessControlTranslation` property, this is the account ID of the destination bucket owner. For more information, see [Cross-Region Replication Additional Configuration: Change Replica Owner](https://docs.aws.amazon.com/AmazonS3/latest/dev/crr-change-owner.html) in the *Amazon S3 User Guide* .
         *
         * If you specify the `AccessControlTranslation` property, the `Account` property is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html#cfn-s3-bucket-replicationdestination-account
         */
        readonly account?: string;
        /**
         * The Amazon Resource Name (ARN) of the bucket where you want Amazon S3 to store the results.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html#cfn-s3-bucket-replicationconfiguration-rules-destination-bucket
         */
        readonly bucket: string;
        /**
         * Specifies encryption-related information.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html#cfn-s3-bucket-replicationdestination-encryptionconfiguration
         */
        readonly encryptionConfiguration?: CfnBucket.EncryptionConfigurationProperty | cdk.IResolvable;
        /**
         * A container specifying replication metrics-related settings enabling replication metrics and events.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html#cfn-s3-bucket-replicationdestination-metrics
         */
        readonly metrics?: CfnBucket.MetricsProperty | cdk.IResolvable;
        /**
         * A container specifying S3 Replication Time Control (S3 RTC), including whether S3 RTC is enabled and the time when all objects and operations on objects must be replicated. Must be specified together with a `Metrics` block.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html#cfn-s3-bucket-replicationdestination-replicationtime
         */
        readonly replicationTime?: CfnBucket.ReplicationTimeProperty | cdk.IResolvable;
        /**
         * The storage class to use when replicating objects, such as S3 Standard or reduced redundancy. By default, Amazon S3 uses the storage class of the source object to create the object replica.
         *
         * For valid values, see the `StorageClass` element of the [PUT Bucket replication](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTreplication.html) action in the *Amazon S3 API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html#cfn-s3-bucket-replicationconfiguration-rules-destination-storageclass
         */
        readonly storageClass?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ReplicationDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_ReplicationDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessControlTranslation', CfnBucket_AccessControlTranslationPropertyValidator)(properties.accessControlTranslation));
    errors.collect(cdk.propertyValidator('account', cdk.validateString)(properties.account));
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('encryptionConfiguration', CfnBucket_EncryptionConfigurationPropertyValidator)(properties.encryptionConfiguration));
    errors.collect(cdk.propertyValidator('metrics', CfnBucket_MetricsPropertyValidator)(properties.metrics));
    errors.collect(cdk.propertyValidator('replicationTime', CfnBucket_ReplicationTimePropertyValidator)(properties.replicationTime));
    errors.collect(cdk.propertyValidator('storageClass', cdk.validateString)(properties.storageClass));
    return errors.wrap('supplied properties not correct for "ReplicationDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicationDestination` resource
 *
 * @param properties - the TypeScript properties of a `ReplicationDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicationDestination` resource.
 */
// @ts-ignore TS6133
function cfnBucketReplicationDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_ReplicationDestinationPropertyValidator(properties).assertSuccess();
    return {
        AccessControlTranslation: cfnBucketAccessControlTranslationPropertyToCloudFormation(properties.accessControlTranslation),
        Account: cdk.stringToCloudFormation(properties.account),
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        EncryptionConfiguration: cfnBucketEncryptionConfigurationPropertyToCloudFormation(properties.encryptionConfiguration),
        Metrics: cfnBucketMetricsPropertyToCloudFormation(properties.metrics),
        ReplicationTime: cfnBucketReplicationTimePropertyToCloudFormation(properties.replicationTime),
        StorageClass: cdk.stringToCloudFormation(properties.storageClass),
    };
}

// @ts-ignore TS6133
function CfnBucketReplicationDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.ReplicationDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicationDestinationProperty>();
    ret.addPropertyResult('accessControlTranslation', 'AccessControlTranslation', properties.AccessControlTranslation != null ? CfnBucketAccessControlTranslationPropertyFromCloudFormation(properties.AccessControlTranslation) : undefined);
    ret.addPropertyResult('account', 'Account', properties.Account != null ? cfn_parse.FromCloudFormation.getString(properties.Account) : undefined);
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('encryptionConfiguration', 'EncryptionConfiguration', properties.EncryptionConfiguration != null ? CfnBucketEncryptionConfigurationPropertyFromCloudFormation(properties.EncryptionConfiguration) : undefined);
    ret.addPropertyResult('metrics', 'Metrics', properties.Metrics != null ? CfnBucketMetricsPropertyFromCloudFormation(properties.Metrics) : undefined);
    ret.addPropertyResult('replicationTime', 'ReplicationTime', properties.ReplicationTime != null ? CfnBucketReplicationTimePropertyFromCloudFormation(properties.ReplicationTime) : undefined);
    ret.addPropertyResult('storageClass', 'StorageClass', properties.StorageClass != null ? cfn_parse.FromCloudFormation.getString(properties.StorageClass) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies which Amazon S3 objects to replicate and where to store the replicas.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html
     */
    export interface ReplicationRuleProperty {
        /**
         * Specifies whether Amazon S3 replicates delete markers. If you specify a `Filter` in your replication configuration, you must also include a `DeleteMarkerReplication` element. If your `Filter` includes a `Tag` element, the `DeleteMarkerReplication` `Status` must be set to Disabled, because Amazon S3 does not support replicating delete markers for tag-based rules. For an example configuration, see [Basic Rule Configuration](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-add-config.html#replication-config-min-rule-config) .
         *
         * For more information about delete marker replication, see [Basic Rule Configuration](https://docs.aws.amazon.com/AmazonS3/latest/dev/delete-marker-replication.html) .
         *
         * > If you are using an earlier version of the replication configuration, Amazon S3 handles replication of delete markers differently. For more information, see [Backward Compatibility](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-add-config.html#replication-backward-compat-considerations) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationrule-deletemarkerreplication
         */
        readonly deleteMarkerReplication?: CfnBucket.DeleteMarkerReplicationProperty | cdk.IResolvable;
        /**
         * A container for information about the replication destination and its configurations including enabling the S3 Replication Time Control (S3 RTC).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationconfiguration-rules-destination
         */
        readonly destination: CfnBucket.ReplicationDestinationProperty | cdk.IResolvable;
        /**
         * A filter that identifies the subset of objects to which the replication rule applies. A `Filter` must specify exactly one `Prefix` , `TagFilter` , or an `And` child element. The use of the filter field indicates that this is a V2 replication configuration. This field isn't supported in a V1 replication configuration.
         *
         * > V1 replication configuration only supports filtering by key prefix. To filter using a V1 replication configuration, add the `Prefix` directly as a child element of the `Rule` element.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationrule-filter
         */
        readonly filter?: CfnBucket.ReplicationRuleFilterProperty | cdk.IResolvable;
        /**
         * A unique identifier for the rule. The maximum value is 255 characters. If you don't specify a value, AWS CloudFormation generates a random ID. When using a V2 replication configuration this property is capitalized as "ID".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationconfiguration-rules-id
         */
        readonly id?: string;
        /**
         * An object key name prefix that identifies the object or objects to which the rule applies. The maximum prefix length is 1,024 characters. To include all objects in a bucket, specify an empty string. To filter using a V1 replication configuration, add the `Prefix` directly as a child element of the `Rule` element.
         *
         * > Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationconfiguration-rules-prefix
         */
        readonly prefix?: string;
        /**
         * The priority indicates which rule has precedence whenever two or more replication rules conflict. Amazon S3 will attempt to replicate objects according to all replication rules. However, if there are two or more rules with the same destination bucket, then objects will be replicated according to the rule with the highest priority. The higher the number, the higher the priority.
         *
         * For more information, see [Replication](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationrule-priority
         */
        readonly priority?: number;
        /**
         * A container that describes additional filters for identifying the source objects that you want to replicate. You can choose to enable or disable the replication of these objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationrule-sourceselectioncriteria
         */
        readonly sourceSelectionCriteria?: CfnBucket.SourceSelectionCriteriaProperty | cdk.IResolvable;
        /**
         * Specifies whether the rule is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationconfiguration-rules-status
         */
        readonly status: string;
    }
}

/**
 * Determine whether the given properties match those of a `ReplicationRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_ReplicationRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deleteMarkerReplication', CfnBucket_DeleteMarkerReplicationPropertyValidator)(properties.deleteMarkerReplication));
    errors.collect(cdk.propertyValidator('destination', cdk.requiredValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('destination', CfnBucket_ReplicationDestinationPropertyValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('filter', CfnBucket_ReplicationRuleFilterPropertyValidator)(properties.filter));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('sourceSelectionCriteria', CfnBucket_SourceSelectionCriteriaPropertyValidator)(properties.sourceSelectionCriteria));
    errors.collect(cdk.propertyValidator('status', cdk.requiredValidator)(properties.status));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    return errors.wrap('supplied properties not correct for "ReplicationRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicationRule` resource
 *
 * @param properties - the TypeScript properties of a `ReplicationRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicationRule` resource.
 */
// @ts-ignore TS6133
function cfnBucketReplicationRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_ReplicationRulePropertyValidator(properties).assertSuccess();
    return {
        DeleteMarkerReplication: cfnBucketDeleteMarkerReplicationPropertyToCloudFormation(properties.deleteMarkerReplication),
        Destination: cfnBucketReplicationDestinationPropertyToCloudFormation(properties.destination),
        Filter: cfnBucketReplicationRuleFilterPropertyToCloudFormation(properties.filter),
        Id: cdk.stringToCloudFormation(properties.id),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        Priority: cdk.numberToCloudFormation(properties.priority),
        SourceSelectionCriteria: cfnBucketSourceSelectionCriteriaPropertyToCloudFormation(properties.sourceSelectionCriteria),
        Status: cdk.stringToCloudFormation(properties.status),
    };
}

// @ts-ignore TS6133
function CfnBucketReplicationRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.ReplicationRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicationRuleProperty>();
    ret.addPropertyResult('deleteMarkerReplication', 'DeleteMarkerReplication', properties.DeleteMarkerReplication != null ? CfnBucketDeleteMarkerReplicationPropertyFromCloudFormation(properties.DeleteMarkerReplication) : undefined);
    ret.addPropertyResult('destination', 'Destination', CfnBucketReplicationDestinationPropertyFromCloudFormation(properties.Destination));
    ret.addPropertyResult('filter', 'Filter', properties.Filter != null ? CfnBucketReplicationRuleFilterPropertyFromCloudFormation(properties.Filter) : undefined);
    ret.addPropertyResult('id', 'Id', properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('priority', 'Priority', properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined);
    ret.addPropertyResult('sourceSelectionCriteria', 'SourceSelectionCriteria', properties.SourceSelectionCriteria != null ? CfnBucketSourceSelectionCriteriaPropertyFromCloudFormation(properties.SourceSelectionCriteria) : undefined);
    ret.addPropertyResult('status', 'Status', cfn_parse.FromCloudFormation.getString(properties.Status));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * A container for specifying rule filters. The filters determine the subset of objects to which the rule applies. This element is required only if you specify more than one filter.
     *
     * For example:
     *
     * - If you specify both a `Prefix` and a `TagFilter` , wrap these filters in an `And` tag.
     * - If you specify a filter based on multiple tags, wrap the `TagFilter` elements in an `And` tag
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationruleandoperator.html
     */
    export interface ReplicationRuleAndOperatorProperty {
        /**
         * An object key name prefix that identifies the subset of objects to which the rule applies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationruleandoperator.html#cfn-s3-bucket-replicationruleandoperator-prefix
         */
        readonly prefix?: string;
        /**
         * An array of tags containing key and value pairs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationruleandoperator.html#cfn-s3-bucket-replicationruleandoperator-tagfilters
         */
        readonly tagFilters?: Array<CfnBucket.TagFilterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ReplicationRuleAndOperatorProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationRuleAndOperatorProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_ReplicationRuleAndOperatorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('tagFilters', cdk.listValidator(CfnBucket_TagFilterPropertyValidator))(properties.tagFilters));
    return errors.wrap('supplied properties not correct for "ReplicationRuleAndOperatorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicationRuleAndOperator` resource
 *
 * @param properties - the TypeScript properties of a `ReplicationRuleAndOperatorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicationRuleAndOperator` resource.
 */
// @ts-ignore TS6133
function cfnBucketReplicationRuleAndOperatorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_ReplicationRuleAndOperatorPropertyValidator(properties).assertSuccess();
    return {
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        TagFilters: cdk.listMapper(cfnBucketTagFilterPropertyToCloudFormation)(properties.tagFilters),
    };
}

// @ts-ignore TS6133
function CfnBucketReplicationRuleAndOperatorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.ReplicationRuleAndOperatorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicationRuleAndOperatorProperty>();
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('tagFilters', 'TagFilters', properties.TagFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketTagFilterPropertyFromCloudFormation)(properties.TagFilters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * A filter that identifies the subset of objects to which the replication rule applies. A `Filter` must specify exactly one `Prefix` , `TagFilter` , or an `And` child element.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrulefilter.html
     */
    export interface ReplicationRuleFilterProperty {
        /**
         * A container for specifying rule filters. The filters determine the subset of objects to which the rule applies. This element is required only if you specify more than one filter. For example:
         *
         * - If you specify both a `Prefix` and a `TagFilter` , wrap these filters in an `And` tag.
         * - If you specify a filter based on multiple tags, wrap the `TagFilter` elements in an `And` tag.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrulefilter.html#cfn-s3-bucket-replicationrulefilter-and
         */
        readonly and?: CfnBucket.ReplicationRuleAndOperatorProperty | cdk.IResolvable;
        /**
         * An object key name prefix that identifies the subset of objects to which the rule applies.
         *
         * > Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrulefilter.html#cfn-s3-bucket-replicationrulefilter-prefix
         */
        readonly prefix?: string;
        /**
         * A container for specifying a tag key and value.
         *
         * The rule applies only to objects that have the tag in their tag set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrulefilter.html#cfn-s3-bucket-replicationrulefilter-tagfilter
         */
        readonly tagFilter?: CfnBucket.TagFilterProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ReplicationRuleFilterProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationRuleFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_ReplicationRuleFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('and', CfnBucket_ReplicationRuleAndOperatorPropertyValidator)(properties.and));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('tagFilter', CfnBucket_TagFilterPropertyValidator)(properties.tagFilter));
    return errors.wrap('supplied properties not correct for "ReplicationRuleFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicationRuleFilter` resource
 *
 * @param properties - the TypeScript properties of a `ReplicationRuleFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicationRuleFilter` resource.
 */
// @ts-ignore TS6133
function cfnBucketReplicationRuleFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_ReplicationRuleFilterPropertyValidator(properties).assertSuccess();
    return {
        And: cfnBucketReplicationRuleAndOperatorPropertyToCloudFormation(properties.and),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        TagFilter: cfnBucketTagFilterPropertyToCloudFormation(properties.tagFilter),
    };
}

// @ts-ignore TS6133
function CfnBucketReplicationRuleFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.ReplicationRuleFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicationRuleFilterProperty>();
    ret.addPropertyResult('and', 'And', properties.And != null ? CfnBucketReplicationRuleAndOperatorPropertyFromCloudFormation(properties.And) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('tagFilter', 'TagFilter', properties.TagFilter != null ? CfnBucketTagFilterPropertyFromCloudFormation(properties.TagFilter) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * A container specifying S3 Replication Time Control (S3 RTC) related information, including whether S3 RTC is enabled and the time when all objects and operations on objects must be replicated. Must be specified together with a `Metrics` block.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtime.html
     */
    export interface ReplicationTimeProperty {
        /**
         * Specifies whether the replication time is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtime.html#cfn-s3-bucket-replicationtime-status
         */
        readonly status: string;
        /**
         * A container specifying the time by which replication should be complete for all objects and operations on objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtime.html#cfn-s3-bucket-replicationtime-time
         */
        readonly time: CfnBucket.ReplicationTimeValueProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ReplicationTimeProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationTimeProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_ReplicationTimePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('status', cdk.requiredValidator)(properties.status));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    errors.collect(cdk.propertyValidator('time', cdk.requiredValidator)(properties.time));
    errors.collect(cdk.propertyValidator('time', CfnBucket_ReplicationTimeValuePropertyValidator)(properties.time));
    return errors.wrap('supplied properties not correct for "ReplicationTimeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicationTime` resource
 *
 * @param properties - the TypeScript properties of a `ReplicationTimeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicationTime` resource.
 */
// @ts-ignore TS6133
function cfnBucketReplicationTimePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_ReplicationTimePropertyValidator(properties).assertSuccess();
    return {
        Status: cdk.stringToCloudFormation(properties.status),
        Time: cfnBucketReplicationTimeValuePropertyToCloudFormation(properties.time),
    };
}

// @ts-ignore TS6133
function CfnBucketReplicationTimePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.ReplicationTimeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicationTimeProperty>();
    ret.addPropertyResult('status', 'Status', cfn_parse.FromCloudFormation.getString(properties.Status));
    ret.addPropertyResult('time', 'Time', CfnBucketReplicationTimeValuePropertyFromCloudFormation(properties.Time));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * A container specifying the time value for S3 Replication Time Control (S3 RTC) and replication metrics `EventThreshold` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtimevalue.html
     */
    export interface ReplicationTimeValueProperty {
        /**
         * Contains an integer specifying time in minutes.
         *
         * Valid value: 15
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtimevalue.html#cfn-s3-bucket-replicationtimevalue-minutes
         */
        readonly minutes: number;
    }
}

/**
 * Determine whether the given properties match those of a `ReplicationTimeValueProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationTimeValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_ReplicationTimeValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('minutes', cdk.requiredValidator)(properties.minutes));
    errors.collect(cdk.propertyValidator('minutes', cdk.validateNumber)(properties.minutes));
    return errors.wrap('supplied properties not correct for "ReplicationTimeValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicationTimeValue` resource
 *
 * @param properties - the TypeScript properties of a `ReplicationTimeValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.ReplicationTimeValue` resource.
 */
// @ts-ignore TS6133
function cfnBucketReplicationTimeValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_ReplicationTimeValuePropertyValidator(properties).assertSuccess();
    return {
        Minutes: cdk.numberToCloudFormation(properties.minutes),
    };
}

// @ts-ignore TS6133
function CfnBucketReplicationTimeValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.ReplicationTimeValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicationTimeValueProperty>();
    ret.addPropertyResult('minutes', 'Minutes', cfn_parse.FromCloudFormation.getNumber(properties.Minutes));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies the redirect behavior and when a redirect is applied. For more information about routing rules, see [Configuring advanced conditional redirects](https://docs.aws.amazon.com/AmazonS3/latest/dev/how-to-page-redirect.html#advanced-conditional-redirects) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules.html
     */
    export interface RoutingRuleProperty {
        /**
         * Container for redirect information. You can redirect requests to another host, to another page, or with another protocol. In the event of an error, you can specify a different error code to return.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules.html#cfn-s3-websiteconfiguration-routingrules-redirectrule
         */
        readonly redirectRule: CfnBucket.RedirectRuleProperty | cdk.IResolvable;
        /**
         * A container for describing a condition that must be met for the specified redirect to apply. For example, 1. If request is for pages in the `/docs` folder, redirect to the `/documents` folder. 2. If request results in HTTP error 4xx, redirect request to another host where you might process the error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules.html#cfn-s3-websiteconfiguration-routingrules-routingrulecondition
         */
        readonly routingRuleCondition?: CfnBucket.RoutingRuleConditionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RoutingRuleProperty`
 *
 * @param properties - the TypeScript properties of a `RoutingRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_RoutingRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('redirectRule', cdk.requiredValidator)(properties.redirectRule));
    errors.collect(cdk.propertyValidator('redirectRule', CfnBucket_RedirectRulePropertyValidator)(properties.redirectRule));
    errors.collect(cdk.propertyValidator('routingRuleCondition', CfnBucket_RoutingRuleConditionPropertyValidator)(properties.routingRuleCondition));
    return errors.wrap('supplied properties not correct for "RoutingRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.RoutingRule` resource
 *
 * @param properties - the TypeScript properties of a `RoutingRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.RoutingRule` resource.
 */
// @ts-ignore TS6133
function cfnBucketRoutingRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_RoutingRulePropertyValidator(properties).assertSuccess();
    return {
        RedirectRule: cfnBucketRedirectRulePropertyToCloudFormation(properties.redirectRule),
        RoutingRuleCondition: cfnBucketRoutingRuleConditionPropertyToCloudFormation(properties.routingRuleCondition),
    };
}

// @ts-ignore TS6133
function CfnBucketRoutingRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.RoutingRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.RoutingRuleProperty>();
    ret.addPropertyResult('redirectRule', 'RedirectRule', CfnBucketRedirectRulePropertyFromCloudFormation(properties.RedirectRule));
    ret.addPropertyResult('routingRuleCondition', 'RoutingRuleCondition', properties.RoutingRuleCondition != null ? CfnBucketRoutingRuleConditionPropertyFromCloudFormation(properties.RoutingRuleCondition) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * A container for describing a condition that must be met for the specified redirect to apply. For example, 1. If request is for pages in the `/docs` folder, redirect to the `/documents` folder. 2. If request results in HTTP error 4xx, redirect request to another host where you might process the error.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-routingrulecondition.html
     */
    export interface RoutingRuleConditionProperty {
        /**
         * The HTTP error code when the redirect is applied. In the event of an error, if the error code equals this value, then the specified redirect is applied.
         *
         * Required when parent element `Condition` is specified and sibling `KeyPrefixEquals` is not specified. If both are specified, then both must be true for the redirect to be applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-routingrulecondition.html#cfn-s3-websiteconfiguration-routingrules-routingrulecondition-httperrorcodereturnedequals
         */
        readonly httpErrorCodeReturnedEquals?: string;
        /**
         * The object key name prefix when the redirect is applied. For example, to redirect requests for `ExamplePage.html` , the key prefix will be `ExamplePage.html` . To redirect request for all pages with the prefix `docs/` , the key prefix will be `/docs` , which identifies all objects in the docs/ folder.
         *
         * Required when the parent element `Condition` is specified and sibling `HttpErrorCodeReturnedEquals` is not specified. If both conditions are specified, both must be true for the redirect to be applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-routingrulecondition.html#cfn-s3-websiteconfiguration-routingrules-routingrulecondition-keyprefixequals
         */
        readonly keyPrefixEquals?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RoutingRuleConditionProperty`
 *
 * @param properties - the TypeScript properties of a `RoutingRuleConditionProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_RoutingRuleConditionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('httpErrorCodeReturnedEquals', cdk.validateString)(properties.httpErrorCodeReturnedEquals));
    errors.collect(cdk.propertyValidator('keyPrefixEquals', cdk.validateString)(properties.keyPrefixEquals));
    return errors.wrap('supplied properties not correct for "RoutingRuleConditionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.RoutingRuleCondition` resource
 *
 * @param properties - the TypeScript properties of a `RoutingRuleConditionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.RoutingRuleCondition` resource.
 */
// @ts-ignore TS6133
function cfnBucketRoutingRuleConditionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_RoutingRuleConditionPropertyValidator(properties).assertSuccess();
    return {
        HttpErrorCodeReturnedEquals: cdk.stringToCloudFormation(properties.httpErrorCodeReturnedEquals),
        KeyPrefixEquals: cdk.stringToCloudFormation(properties.keyPrefixEquals),
    };
}

// @ts-ignore TS6133
function CfnBucketRoutingRuleConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.RoutingRuleConditionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.RoutingRuleConditionProperty>();
    ret.addPropertyResult('httpErrorCodeReturnedEquals', 'HttpErrorCodeReturnedEquals', properties.HttpErrorCodeReturnedEquals != null ? cfn_parse.FromCloudFormation.getString(properties.HttpErrorCodeReturnedEquals) : undefined);
    ret.addPropertyResult('keyPrefixEquals', 'KeyPrefixEquals', properties.KeyPrefixEquals != null ? cfn_parse.FromCloudFormation.getString(properties.KeyPrefixEquals) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies lifecycle rules for an Amazon S3 bucket. For more information, see [Put Bucket Lifecycle Configuration](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTlifecycle.html) in the *Amazon S3 API Reference* .
     *
     * You must specify at least one of the following properties: `AbortIncompleteMultipartUpload` , `ExpirationDate` , `ExpirationInDays` , `NoncurrentVersionExpirationInDays` , `NoncurrentVersionTransition` , `NoncurrentVersionTransitions` , `Transition` , or `Transitions` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html
     */
    export interface RuleProperty {
        /**
         * Specifies a lifecycle rule that stops incomplete multipart uploads to an Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-rule-abortincompletemultipartupload
         */
        readonly abortIncompleteMultipartUpload?: CfnBucket.AbortIncompleteMultipartUploadProperty | cdk.IResolvable;
        /**
         * Indicates when objects are deleted from Amazon S3 and Amazon S3 Glacier. The date value must be in ISO 8601 format. The time is always midnight UTC. If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-expirationdate
         */
        readonly expirationDate?: Date | cdk.IResolvable;
        /**
         * Indicates the number of days after creation when objects are deleted from Amazon S3 and Amazon S3 Glacier. If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-expirationindays
         */
        readonly expirationInDays?: number;
        /**
         * Indicates whether Amazon S3 will remove a delete marker without any noncurrent versions. If set to true, the delete marker will be removed if there are no noncurrent versions. This cannot be specified with `ExpirationInDays` , `ExpirationDate` , or `TagFilters` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-rule-expiredobjectdeletemarker
         */
        readonly expiredObjectDeleteMarker?: boolean | cdk.IResolvable;
        /**
         * Unique identifier for the rule. The value can't be longer than 255 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-id
         */
        readonly id?: string;
        /**
         * Specifies when noncurrent object versions expire. Upon expiration, Amazon S3 permanently deletes the noncurrent object versions. You set this lifecycle configuration action on a bucket that has versioning enabled (or suspended) to request that Amazon S3 delete noncurrent object versions at a specific period in the object's lifetime.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversionexpiration
         */
        readonly noncurrentVersionExpiration?: CfnBucket.NoncurrentVersionExpirationProperty | cdk.IResolvable;
        /**
         * (Deprecated.) For buckets with versioning enabled (or suspended), specifies the time, in days, between when a new version of the object is uploaded to the bucket and when old versions of the object expire. When object versions expire, Amazon S3 permanently deletes them. If you specify a transition and expiration time, the expiration time must be later than the transition time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversionexpirationindays
         */
        readonly noncurrentVersionExpirationInDays?: number;
        /**
         * (Deprecated.) For buckets with versioning enabled (or suspended), specifies when non-current objects transition to a specified storage class. If you specify a transition and expiration time, the expiration time must be later than the transition time. If you specify this property, don't specify the `NoncurrentVersionTransitions` property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition
         */
        readonly noncurrentVersionTransition?: CfnBucket.NoncurrentVersionTransitionProperty | cdk.IResolvable;
        /**
         * For buckets with versioning enabled (or suspended), one or more transition rules that specify when non-current objects transition to a specified storage class. If you specify a transition and expiration time, the expiration time must be later than the transition time. If you specify this property, don't specify the `NoncurrentVersionTransition` property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversiontransitions
         */
        readonly noncurrentVersionTransitions?: Array<CfnBucket.NoncurrentVersionTransitionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies the minimum object size in bytes for this rule to apply to. Objects must be larger than this value in bytes. For more information about size based rules, see [Lifecycle configuration using size-based rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-configuration-examples.html#lc-size-rules) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-objectsizegreaterthan
         */
        readonly objectSizeGreaterThan?: number;
        /**
         * Specifies the maximum object size in bytes for this rule to apply to. Objects must be smaller than this value in bytes. For more information about sized based rules, see [Lifecycle configuration using size-based rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-configuration-examples.html#lc-size-rules) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-objectsizelessthan
         */
        readonly objectSizeLessThan?: number;
        /**
         * Object key prefix that identifies one or more objects to which this rule applies.
         *
         * > Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-prefix
         */
        readonly prefix?: string;
        /**
         * If `Enabled` , the rule is currently being applied. If `Disabled` , the rule is not currently being applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-status
         */
        readonly status: string;
        /**
         * Tags to use to identify a subset of objects to which the lifecycle rule applies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-rule-tagfilters
         */
        readonly tagFilters?: Array<CfnBucket.TagFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * (Deprecated.) Specifies when an object transitions to a specified storage class. If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time. If you specify this property, don't specify the `Transitions` property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-transition
         */
        readonly transition?: CfnBucket.TransitionProperty | cdk.IResolvable;
        /**
         * One or more transition rules that specify when an object transitions to a specified storage class. If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time. If you specify this property, don't specify the `Transition` property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-transitions
         */
        readonly transitions?: Array<CfnBucket.TransitionProperty | cdk.IResolvable> | cdk.IResolvable;
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
    errors.collect(cdk.propertyValidator('expirationDate', cdk.validateDate)(properties.expirationDate));
    errors.collect(cdk.propertyValidator('expirationInDays', cdk.validateNumber)(properties.expirationInDays));
    errors.collect(cdk.propertyValidator('expiredObjectDeleteMarker', cdk.validateBoolean)(properties.expiredObjectDeleteMarker));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('noncurrentVersionExpiration', CfnBucket_NoncurrentVersionExpirationPropertyValidator)(properties.noncurrentVersionExpiration));
    errors.collect(cdk.propertyValidator('noncurrentVersionExpirationInDays', cdk.validateNumber)(properties.noncurrentVersionExpirationInDays));
    errors.collect(cdk.propertyValidator('noncurrentVersionTransition', CfnBucket_NoncurrentVersionTransitionPropertyValidator)(properties.noncurrentVersionTransition));
    errors.collect(cdk.propertyValidator('noncurrentVersionTransitions', cdk.listValidator(CfnBucket_NoncurrentVersionTransitionPropertyValidator))(properties.noncurrentVersionTransitions));
    errors.collect(cdk.propertyValidator('objectSizeGreaterThan', cdk.validateNumber)(properties.objectSizeGreaterThan));
    errors.collect(cdk.propertyValidator('objectSizeLessThan', cdk.validateNumber)(properties.objectSizeLessThan));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('status', cdk.requiredValidator)(properties.status));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    errors.collect(cdk.propertyValidator('tagFilters', cdk.listValidator(CfnBucket_TagFilterPropertyValidator))(properties.tagFilters));
    errors.collect(cdk.propertyValidator('transition', CfnBucket_TransitionPropertyValidator)(properties.transition));
    errors.collect(cdk.propertyValidator('transitions', cdk.listValidator(CfnBucket_TransitionPropertyValidator))(properties.transitions));
    return errors.wrap('supplied properties not correct for "RuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.Rule` resource
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.Rule` resource.
 */
// @ts-ignore TS6133
function cfnBucketRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_RulePropertyValidator(properties).assertSuccess();
    return {
        AbortIncompleteMultipartUpload: cfnBucketAbortIncompleteMultipartUploadPropertyToCloudFormation(properties.abortIncompleteMultipartUpload),
        ExpirationDate: cdk.dateToCloudFormation(properties.expirationDate),
        ExpirationInDays: cdk.numberToCloudFormation(properties.expirationInDays),
        ExpiredObjectDeleteMarker: cdk.booleanToCloudFormation(properties.expiredObjectDeleteMarker),
        Id: cdk.stringToCloudFormation(properties.id),
        NoncurrentVersionExpiration: cfnBucketNoncurrentVersionExpirationPropertyToCloudFormation(properties.noncurrentVersionExpiration),
        NoncurrentVersionExpirationInDays: cdk.numberToCloudFormation(properties.noncurrentVersionExpirationInDays),
        NoncurrentVersionTransition: cfnBucketNoncurrentVersionTransitionPropertyToCloudFormation(properties.noncurrentVersionTransition),
        NoncurrentVersionTransitions: cdk.listMapper(cfnBucketNoncurrentVersionTransitionPropertyToCloudFormation)(properties.noncurrentVersionTransitions),
        ObjectSizeGreaterThan: cdk.numberToCloudFormation(properties.objectSizeGreaterThan),
        ObjectSizeLessThan: cdk.numberToCloudFormation(properties.objectSizeLessThan),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        Status: cdk.stringToCloudFormation(properties.status),
        TagFilters: cdk.listMapper(cfnBucketTagFilterPropertyToCloudFormation)(properties.tagFilters),
        Transition: cfnBucketTransitionPropertyToCloudFormation(properties.transition),
        Transitions: cdk.listMapper(cfnBucketTransitionPropertyToCloudFormation)(properties.transitions),
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
    ret.addPropertyResult('expirationDate', 'ExpirationDate', properties.ExpirationDate != null ? cfn_parse.FromCloudFormation.getDate(properties.ExpirationDate) : undefined);
    ret.addPropertyResult('expirationInDays', 'ExpirationInDays', properties.ExpirationInDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.ExpirationInDays) : undefined);
    ret.addPropertyResult('expiredObjectDeleteMarker', 'ExpiredObjectDeleteMarker', properties.ExpiredObjectDeleteMarker != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExpiredObjectDeleteMarker) : undefined);
    ret.addPropertyResult('id', 'Id', properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined);
    ret.addPropertyResult('noncurrentVersionExpiration', 'NoncurrentVersionExpiration', properties.NoncurrentVersionExpiration != null ? CfnBucketNoncurrentVersionExpirationPropertyFromCloudFormation(properties.NoncurrentVersionExpiration) : undefined);
    ret.addPropertyResult('noncurrentVersionExpirationInDays', 'NoncurrentVersionExpirationInDays', properties.NoncurrentVersionExpirationInDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.NoncurrentVersionExpirationInDays) : undefined);
    ret.addPropertyResult('noncurrentVersionTransition', 'NoncurrentVersionTransition', properties.NoncurrentVersionTransition != null ? CfnBucketNoncurrentVersionTransitionPropertyFromCloudFormation(properties.NoncurrentVersionTransition) : undefined);
    ret.addPropertyResult('noncurrentVersionTransitions', 'NoncurrentVersionTransitions', properties.NoncurrentVersionTransitions != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketNoncurrentVersionTransitionPropertyFromCloudFormation)(properties.NoncurrentVersionTransitions) : undefined);
    ret.addPropertyResult('objectSizeGreaterThan', 'ObjectSizeGreaterThan', properties.ObjectSizeGreaterThan != null ? cfn_parse.FromCloudFormation.getNumber(properties.ObjectSizeGreaterThan) : undefined);
    ret.addPropertyResult('objectSizeLessThan', 'ObjectSizeLessThan', properties.ObjectSizeLessThan != null ? cfn_parse.FromCloudFormation.getNumber(properties.ObjectSizeLessThan) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('status', 'Status', cfn_parse.FromCloudFormation.getString(properties.Status));
    ret.addPropertyResult('tagFilters', 'TagFilters', properties.TagFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketTagFilterPropertyFromCloudFormation)(properties.TagFilters) : undefined);
    ret.addPropertyResult('transition', 'Transition', properties.Transition != null ? CfnBucketTransitionPropertyFromCloudFormation(properties.Transition) : undefined);
    ret.addPropertyResult('transitions', 'Transitions', properties.Transitions != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketTransitionPropertyFromCloudFormation)(properties.Transitions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * A container for object key name prefix and suffix filtering rules. For more information about object key name filtering, see [Configuring event notifications using object key name filtering](https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-filtering.html) in the *Amazon S3 User Guide* .
     *
     * > The same type of filter rule cannot be used more than once. For example, you cannot specify two prefix rules.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key.html
     */
    export interface S3KeyFilterProperty {
        /**
         * A list of containers for the key-value pair that defines the criteria for the filter rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key.html#cfn-s3-bucket-notificationconfiguraiton-config-filter-s3key-rules
         */
        readonly rules: Array<CfnBucket.FilterRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `S3KeyFilterProperty`
 *
 * @param properties - the TypeScript properties of a `S3KeyFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_S3KeyFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('rules', cdk.requiredValidator)(properties.rules));
    errors.collect(cdk.propertyValidator('rules', cdk.listValidator(CfnBucket_FilterRulePropertyValidator))(properties.rules));
    return errors.wrap('supplied properties not correct for "S3KeyFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.S3KeyFilter` resource
 *
 * @param properties - the TypeScript properties of a `S3KeyFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.S3KeyFilter` resource.
 */
// @ts-ignore TS6133
function cfnBucketS3KeyFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_S3KeyFilterPropertyValidator(properties).assertSuccess();
    return {
        Rules: cdk.listMapper(cfnBucketFilterRulePropertyToCloudFormation)(properties.rules),
    };
}

// @ts-ignore TS6133
function CfnBucketS3KeyFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.S3KeyFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.S3KeyFilterProperty>();
    ret.addPropertyResult('rules', 'Rules', cfn_parse.FromCloudFormation.getArray(CfnBucketFilterRulePropertyFromCloudFormation)(properties.Rules));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Describes the default server-side encryption to apply to new objects in the bucket. If a PUT Object request doesn't specify any server-side encryption, this default encryption will be applied. If you don't specify a customer managed key at configuration, Amazon S3 automatically creates an AWS KMS key in your AWS account the first time that you add an object encrypted with SSE-KMS to a bucket. By default, Amazon S3 uses this KMS key for SSE-KMS. For more information, see [PUT Bucket encryption](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTencryption.html) in the *Amazon S3 API Reference* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html
     */
    export interface ServerSideEncryptionByDefaultProperty {
        /**
         * KMS key ID to use for the default encryption. This parameter is allowed if SSEAlgorithm is aws:kms.
         *
         * You can specify the key ID, key alias, or the Amazon Resource Name (ARN) of the CMK. However, if you are using encryption with cross-account operations, you must use a fully qualified CMK ARN. For more information, see [Using encryption for cross-account operations](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html#bucket-encryption-update-bucket-policy) .
         *
         * For example:
         *
         * - Key ID: `1234abcd-12ab-34cd-56ef-1234567890ab`
         * - Key ARN: `arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab`
         *
         * > Amazon S3 only supports symmetric KMS keys and not asymmetric KMS keys. For more information, see [Using Symmetric and Asymmetric Keys](https://docs.aws.amazon.com//kms/latest/developerguide/symmetric-asymmetric.html) in the *AWS Key Management Service Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html#cfn-s3-bucket-serversideencryptionbydefault-kmsmasterkeyid
         */
        readonly kmsMasterKeyId?: string;
        /**
         * Server-side encryption algorithm to use for the default encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html#cfn-s3-bucket-serversideencryptionbydefault-ssealgorithm
         */
        readonly sseAlgorithm: string;
    }
}

/**
 * Determine whether the given properties match those of a `ServerSideEncryptionByDefaultProperty`
 *
 * @param properties - the TypeScript properties of a `ServerSideEncryptionByDefaultProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_ServerSideEncryptionByDefaultPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('kmsMasterKeyId', cdk.validateString)(properties.kmsMasterKeyId));
    errors.collect(cdk.propertyValidator('sseAlgorithm', cdk.requiredValidator)(properties.sseAlgorithm));
    errors.collect(cdk.propertyValidator('sseAlgorithm', cdk.validateString)(properties.sseAlgorithm));
    return errors.wrap('supplied properties not correct for "ServerSideEncryptionByDefaultProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.ServerSideEncryptionByDefault` resource
 *
 * @param properties - the TypeScript properties of a `ServerSideEncryptionByDefaultProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.ServerSideEncryptionByDefault` resource.
 */
// @ts-ignore TS6133
function cfnBucketServerSideEncryptionByDefaultPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_ServerSideEncryptionByDefaultPropertyValidator(properties).assertSuccess();
    return {
        KMSMasterKeyID: cdk.stringToCloudFormation(properties.kmsMasterKeyId),
        SSEAlgorithm: cdk.stringToCloudFormation(properties.sseAlgorithm),
    };
}

// @ts-ignore TS6133
function CfnBucketServerSideEncryptionByDefaultPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.ServerSideEncryptionByDefaultProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ServerSideEncryptionByDefaultProperty>();
    ret.addPropertyResult('kmsMasterKeyId', 'KMSMasterKeyID', properties.KMSMasterKeyID != null ? cfn_parse.FromCloudFormation.getString(properties.KMSMasterKeyID) : undefined);
    ret.addPropertyResult('sseAlgorithm', 'SSEAlgorithm', cfn_parse.FromCloudFormation.getString(properties.SSEAlgorithm));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies the default server-side encryption configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionrule.html
     */
    export interface ServerSideEncryptionRuleProperty {
        /**
         * Specifies whether Amazon S3 should use an S3 Bucket Key with server-side encryption using KMS (SSE-KMS) for new objects in the bucket. Existing objects are not affected. Setting the `BucketKeyEnabled` element to `true` causes Amazon S3 to use an S3 Bucket Key. By default, S3 Bucket Key is not enabled.
         *
         * For more information, see [Amazon S3 Bucket Keys](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-key.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionrule.html#cfn-s3-bucket-serversideencryptionrule-bucketkeyenabled
         */
        readonly bucketKeyEnabled?: boolean | cdk.IResolvable;
        /**
         * Specifies the default server-side encryption to apply to new objects in the bucket. If a PUT Object request doesn't specify any server-side encryption, this default encryption will be applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionrule.html#cfn-s3-bucket-serversideencryptionrule-serversideencryptionbydefault
         */
        readonly serverSideEncryptionByDefault?: CfnBucket.ServerSideEncryptionByDefaultProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ServerSideEncryptionRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ServerSideEncryptionRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_ServerSideEncryptionRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketKeyEnabled', cdk.validateBoolean)(properties.bucketKeyEnabled));
    errors.collect(cdk.propertyValidator('serverSideEncryptionByDefault', CfnBucket_ServerSideEncryptionByDefaultPropertyValidator)(properties.serverSideEncryptionByDefault));
    return errors.wrap('supplied properties not correct for "ServerSideEncryptionRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.ServerSideEncryptionRule` resource
 *
 * @param properties - the TypeScript properties of a `ServerSideEncryptionRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.ServerSideEncryptionRule` resource.
 */
// @ts-ignore TS6133
function cfnBucketServerSideEncryptionRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_ServerSideEncryptionRulePropertyValidator(properties).assertSuccess();
    return {
        BucketKeyEnabled: cdk.booleanToCloudFormation(properties.bucketKeyEnabled),
        ServerSideEncryptionByDefault: cfnBucketServerSideEncryptionByDefaultPropertyToCloudFormation(properties.serverSideEncryptionByDefault),
    };
}

// @ts-ignore TS6133
function CfnBucketServerSideEncryptionRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.ServerSideEncryptionRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ServerSideEncryptionRuleProperty>();
    ret.addPropertyResult('bucketKeyEnabled', 'BucketKeyEnabled', properties.BucketKeyEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BucketKeyEnabled) : undefined);
    ret.addPropertyResult('serverSideEncryptionByDefault', 'ServerSideEncryptionByDefault', properties.ServerSideEncryptionByDefault != null ? CfnBucketServerSideEncryptionByDefaultPropertyFromCloudFormation(properties.ServerSideEncryptionByDefault) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * A container that describes additional filters for identifying the source objects that you want to replicate. You can choose to enable or disable the replication of these objects.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-sourceselectioncriteria.html
     */
    export interface SourceSelectionCriteriaProperty {
        /**
         * A filter that you can specify for selection for modifications on replicas.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-sourceselectioncriteria.html#cfn-s3-bucket-sourceselectioncriteria-replicamodifications
         */
        readonly replicaModifications?: CfnBucket.ReplicaModificationsProperty | cdk.IResolvable;
        /**
         * A container for filter information for the selection of Amazon S3 objects encrypted with AWS KMS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-sourceselectioncriteria.html#cfn-s3-bucket-sourceselectioncriteria-ssekmsencryptedobjects
         */
        readonly sseKmsEncryptedObjects?: CfnBucket.SseKmsEncryptedObjectsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SourceSelectionCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `SourceSelectionCriteriaProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_SourceSelectionCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('replicaModifications', CfnBucket_ReplicaModificationsPropertyValidator)(properties.replicaModifications));
    errors.collect(cdk.propertyValidator('sseKmsEncryptedObjects', CfnBucket_SseKmsEncryptedObjectsPropertyValidator)(properties.sseKmsEncryptedObjects));
    return errors.wrap('supplied properties not correct for "SourceSelectionCriteriaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.SourceSelectionCriteria` resource
 *
 * @param properties - the TypeScript properties of a `SourceSelectionCriteriaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.SourceSelectionCriteria` resource.
 */
// @ts-ignore TS6133
function cfnBucketSourceSelectionCriteriaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_SourceSelectionCriteriaPropertyValidator(properties).assertSuccess();
    return {
        ReplicaModifications: cfnBucketReplicaModificationsPropertyToCloudFormation(properties.replicaModifications),
        SseKmsEncryptedObjects: cfnBucketSseKmsEncryptedObjectsPropertyToCloudFormation(properties.sseKmsEncryptedObjects),
    };
}

// @ts-ignore TS6133
function CfnBucketSourceSelectionCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.SourceSelectionCriteriaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.SourceSelectionCriteriaProperty>();
    ret.addPropertyResult('replicaModifications', 'ReplicaModifications', properties.ReplicaModifications != null ? CfnBucketReplicaModificationsPropertyFromCloudFormation(properties.ReplicaModifications) : undefined);
    ret.addPropertyResult('sseKmsEncryptedObjects', 'SseKmsEncryptedObjects', properties.SseKmsEncryptedObjects != null ? CfnBucketSseKmsEncryptedObjectsPropertyFromCloudFormation(properties.SseKmsEncryptedObjects) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * A container for filter information for the selection of S3 objects encrypted with AWS KMS.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ssekmsencryptedobjects.html
     */
    export interface SseKmsEncryptedObjectsProperty {
        /**
         * Specifies whether Amazon S3 replicates objects created with server-side encryption using an AWS KMS key stored in AWS Key Management Service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ssekmsencryptedobjects.html#cfn-s3-bucket-ssekmsencryptedobjects-status
         */
        readonly status: string;
    }
}

/**
 * Determine whether the given properties match those of a `SseKmsEncryptedObjectsProperty`
 *
 * @param properties - the TypeScript properties of a `SseKmsEncryptedObjectsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_SseKmsEncryptedObjectsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('status', cdk.requiredValidator)(properties.status));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    return errors.wrap('supplied properties not correct for "SseKmsEncryptedObjectsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.SseKmsEncryptedObjects` resource
 *
 * @param properties - the TypeScript properties of a `SseKmsEncryptedObjectsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.SseKmsEncryptedObjects` resource.
 */
// @ts-ignore TS6133
function cfnBucketSseKmsEncryptedObjectsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_SseKmsEncryptedObjectsPropertyValidator(properties).assertSuccess();
    return {
        Status: cdk.stringToCloudFormation(properties.status),
    };
}

// @ts-ignore TS6133
function CfnBucketSseKmsEncryptedObjectsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.SseKmsEncryptedObjectsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.SseKmsEncryptedObjectsProperty>();
    ret.addPropertyResult('status', 'Status', cfn_parse.FromCloudFormation.getString(properties.Status));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies data related to access patterns to be collected and made available to analyze the tradeoffs between different storage classes for an Amazon S3 bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-storageclassanalysis.html
     */
    export interface StorageClassAnalysisProperty {
        /**
         * Specifies how data related to the storage class analysis for an Amazon S3 bucket should be exported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-storageclassanalysis.html#cfn-s3-bucket-storageclassanalysis-dataexport
         */
        readonly dataExport?: CfnBucket.DataExportProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `StorageClassAnalysisProperty`
 *
 * @param properties - the TypeScript properties of a `StorageClassAnalysisProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_StorageClassAnalysisPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataExport', CfnBucket_DataExportPropertyValidator)(properties.dataExport));
    return errors.wrap('supplied properties not correct for "StorageClassAnalysisProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.StorageClassAnalysis` resource
 *
 * @param properties - the TypeScript properties of a `StorageClassAnalysisProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.StorageClassAnalysis` resource.
 */
// @ts-ignore TS6133
function cfnBucketStorageClassAnalysisPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_StorageClassAnalysisPropertyValidator(properties).assertSuccess();
    return {
        DataExport: cfnBucketDataExportPropertyToCloudFormation(properties.dataExport),
    };
}

// @ts-ignore TS6133
function CfnBucketStorageClassAnalysisPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.StorageClassAnalysisProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.StorageClassAnalysisProperty>();
    ret.addPropertyResult('dataExport', 'DataExport', properties.DataExport != null ? CfnBucketDataExportPropertyFromCloudFormation(properties.DataExport) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies tags to use to identify a subset of objects for an Amazon S3 bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tagfilter.html
     */
    export interface TagFilterProperty {
        /**
         * The tag key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tagfilter.html#cfn-s3-bucket-tagfilter-key
         */
        readonly key: string;
        /**
         * The tag value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tagfilter.html#cfn-s3-bucket-tagfilter-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `TagFilterProperty`
 *
 * @param properties - the TypeScript properties of a `TagFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_TagFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.TagFilter` resource
 *
 * @param properties - the TypeScript properties of a `TagFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.TagFilter` resource.
 */
// @ts-ignore TS6133
function cfnBucketTagFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_TagFilterPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnBucketTagFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.TagFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.TagFilterProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * The S3 Intelligent-Tiering storage class is designed to optimize storage costs by automatically moving data to the most cost-effective storage access tier, without additional operational overhead.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tiering.html
     */
    export interface TieringProperty {
        /**
         * S3 Intelligent-Tiering access tier. See [Storage class for automatically optimizing frequently and infrequently accessed objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/storage-class-intro.html#sc-dynamic-data-access) for a list of access tiers in the S3 Intelligent-Tiering storage class.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tiering.html#cfn-s3-bucket-tiering-accesstier
         */
        readonly accessTier: string;
        /**
         * The number of consecutive days of no access after which an object will be eligible to be transitioned to the corresponding tier. The minimum number of days specified for Archive Access tier must be at least 90 days and Deep Archive Access tier must be at least 180 days. The maximum can be up to 2 years (730 days).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tiering.html#cfn-s3-bucket-tiering-days
         */
        readonly days: number;
    }
}

/**
 * Determine whether the given properties match those of a `TieringProperty`
 *
 * @param properties - the TypeScript properties of a `TieringProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_TieringPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessTier', cdk.requiredValidator)(properties.accessTier));
    errors.collect(cdk.propertyValidator('accessTier', cdk.validateString)(properties.accessTier));
    errors.collect(cdk.propertyValidator('days', cdk.requiredValidator)(properties.days));
    errors.collect(cdk.propertyValidator('days', cdk.validateNumber)(properties.days));
    return errors.wrap('supplied properties not correct for "TieringProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.Tiering` resource
 *
 * @param properties - the TypeScript properties of a `TieringProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.Tiering` resource.
 */
// @ts-ignore TS6133
function cfnBucketTieringPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_TieringPropertyValidator(properties).assertSuccess();
    return {
        AccessTier: cdk.stringToCloudFormation(properties.accessTier),
        Days: cdk.numberToCloudFormation(properties.days),
    };
}

// @ts-ignore TS6133
function CfnBucketTieringPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.TieringProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.TieringProperty>();
    ret.addPropertyResult('accessTier', 'AccessTier', cfn_parse.FromCloudFormation.getString(properties.AccessTier));
    ret.addPropertyResult('days', 'Days', cfn_parse.FromCloudFormation.getNumber(properties.Days));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * A container for specifying the configuration for publication of messages to an Amazon Simple Notification Service (Amazon SNS) topic when Amazon S3 detects specified events.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-topicconfig.html
     */
    export interface TopicConfigurationProperty {
        /**
         * The Amazon S3 bucket event about which to send notifications. For more information, see [Supported Event Types](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-topicconfig.html#cfn-s3-bucket-notificationconfig-topicconfig-event
         */
        readonly event: string;
        /**
         * The filtering rules that determine for which objects to send notifications. For example, you can create a filter so that Amazon S3 sends notifications only when image files with a `.jpg` extension are added to the bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-topicconfig.html#cfn-s3-bucket-notificationconfig-topicconfig-filter
         */
        readonly filter?: CfnBucket.NotificationFilterProperty | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the Amazon SNS topic to which Amazon S3 publishes a message when it detects events of the specified type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-topicconfig.html#cfn-s3-bucket-notificationconfig-topicconfig-topic
         */
        readonly topic: string;
    }
}

/**
 * Determine whether the given properties match those of a `TopicConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TopicConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_TopicConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('event', cdk.requiredValidator)(properties.event));
    errors.collect(cdk.propertyValidator('event', cdk.validateString)(properties.event));
    errors.collect(cdk.propertyValidator('filter', CfnBucket_NotificationFilterPropertyValidator)(properties.filter));
    errors.collect(cdk.propertyValidator('topic', cdk.requiredValidator)(properties.topic));
    errors.collect(cdk.propertyValidator('topic', cdk.validateString)(properties.topic));
    return errors.wrap('supplied properties not correct for "TopicConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.TopicConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `TopicConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.TopicConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketTopicConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_TopicConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Event: cdk.stringToCloudFormation(properties.event),
        Filter: cfnBucketNotificationFilterPropertyToCloudFormation(properties.filter),
        Topic: cdk.stringToCloudFormation(properties.topic),
    };
}

// @ts-ignore TS6133
function CfnBucketTopicConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.TopicConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.TopicConfigurationProperty>();
    ret.addPropertyResult('event', 'Event', cfn_parse.FromCloudFormation.getString(properties.Event));
    ret.addPropertyResult('filter', 'Filter', properties.Filter != null ? CfnBucketNotificationFilterPropertyFromCloudFormation(properties.Filter) : undefined);
    ret.addPropertyResult('topic', 'Topic', cfn_parse.FromCloudFormation.getString(properties.Topic));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies when an object transitions to a specified storage class. For more information about Amazon S3 lifecycle configuration rules, see [Transitioning Objects Using Amazon S3 Lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/dev/lifecycle-transition-general-considerations.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-transition.html
     */
    export interface TransitionProperty {
        /**
         * The storage class to which you want the object to transition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-transition.html#cfn-s3-bucket-lifecycleconfig-rule-transition-storageclass
         */
        readonly storageClass: string;
        /**
         * Indicates when objects are transitioned to the specified storage class. The date value must be in ISO 8601 format. The time is always midnight UTC.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-transition.html#cfn-s3-bucket-lifecycleconfig-rule-transition-transitiondate
         */
        readonly transitionDate?: Date | cdk.IResolvable;
        /**
         * Indicates the number of days after creation when objects are transitioned to the specified storage class. The value must be a positive integer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-transition.html#cfn-s3-bucket-lifecycleconfig-rule-transition-transitionindays
         */
        readonly transitionInDays?: number;
    }
}

/**
 * Determine whether the given properties match those of a `TransitionProperty`
 *
 * @param properties - the TypeScript properties of a `TransitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_TransitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('storageClass', cdk.requiredValidator)(properties.storageClass));
    errors.collect(cdk.propertyValidator('storageClass', cdk.validateString)(properties.storageClass));
    errors.collect(cdk.propertyValidator('transitionDate', cdk.validateDate)(properties.transitionDate));
    errors.collect(cdk.propertyValidator('transitionInDays', cdk.validateNumber)(properties.transitionInDays));
    return errors.wrap('supplied properties not correct for "TransitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.Transition` resource
 *
 * @param properties - the TypeScript properties of a `TransitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.Transition` resource.
 */
// @ts-ignore TS6133
function cfnBucketTransitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_TransitionPropertyValidator(properties).assertSuccess();
    return {
        StorageClass: cdk.stringToCloudFormation(properties.storageClass),
        TransitionDate: cdk.dateToCloudFormation(properties.transitionDate),
        TransitionInDays: cdk.numberToCloudFormation(properties.transitionInDays),
    };
}

// @ts-ignore TS6133
function CfnBucketTransitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.TransitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.TransitionProperty>();
    ret.addPropertyResult('storageClass', 'StorageClass', cfn_parse.FromCloudFormation.getString(properties.StorageClass));
    ret.addPropertyResult('transitionDate', 'TransitionDate', properties.TransitionDate != null ? cfn_parse.FromCloudFormation.getDate(properties.TransitionDate) : undefined);
    ret.addPropertyResult('transitionInDays', 'TransitionInDays', properties.TransitionInDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.TransitionInDays) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Describes the versioning state of an Amazon S3 bucket. For more information, see [PUT Bucket versioning](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTVersioningStatus.html) in the *Amazon S3 API Reference* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-versioningconfig.html
     */
    export interface VersioningConfigurationProperty {
        /**
         * The versioning state of the bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-versioningconfig.html#cfn-s3-bucket-versioningconfig-status
         */
        readonly status: string;
    }
}

/**
 * Determine whether the given properties match those of a `VersioningConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VersioningConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_VersioningConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('status', cdk.requiredValidator)(properties.status));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    return errors.wrap('supplied properties not correct for "VersioningConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.VersioningConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `VersioningConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.VersioningConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketVersioningConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_VersioningConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Status: cdk.stringToCloudFormation(properties.status),
    };
}

// @ts-ignore TS6133
function CfnBucketVersioningConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.VersioningConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.VersioningConfigurationProperty>();
    ret.addPropertyResult('status', 'Status', cfn_parse.FromCloudFormation.getString(properties.Status));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBucket {
    /**
     * Specifies website configuration parameters for an Amazon S3 bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html
     */
    export interface WebsiteConfigurationProperty {
        /**
         * The name of the error document for the website.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html#cfn-s3-websiteconfiguration-errordocument
         */
        readonly errorDocument?: string;
        /**
         * The name of the index document for the website.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html#cfn-s3-websiteconfiguration-indexdocument
         */
        readonly indexDocument?: string;
        /**
         * The redirect behavior for every request to this bucket's website endpoint.
         *
         * > If you specify this property, you can't specify any other property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html#cfn-s3-websiteconfiguration-redirectallrequeststo
         */
        readonly redirectAllRequestsTo?: CfnBucket.RedirectAllRequestsToProperty | cdk.IResolvable;
        /**
         * Rules that define when a redirect is applied and the redirect behavior.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html#cfn-s3-websiteconfiguration-routingrules
         */
        readonly routingRules?: Array<CfnBucket.RoutingRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `WebsiteConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WebsiteConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_WebsiteConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('errorDocument', cdk.validateString)(properties.errorDocument));
    errors.collect(cdk.propertyValidator('indexDocument', cdk.validateString)(properties.indexDocument));
    errors.collect(cdk.propertyValidator('redirectAllRequestsTo', CfnBucket_RedirectAllRequestsToPropertyValidator)(properties.redirectAllRequestsTo));
    errors.collect(cdk.propertyValidator('routingRules', cdk.listValidator(CfnBucket_RoutingRulePropertyValidator))(properties.routingRules));
    return errors.wrap('supplied properties not correct for "WebsiteConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::Bucket.WebsiteConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `WebsiteConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::Bucket.WebsiteConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBucketWebsiteConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_WebsiteConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ErrorDocument: cdk.stringToCloudFormation(properties.errorDocument),
        IndexDocument: cdk.stringToCloudFormation(properties.indexDocument),
        RedirectAllRequestsTo: cfnBucketRedirectAllRequestsToPropertyToCloudFormation(properties.redirectAllRequestsTo),
        RoutingRules: cdk.listMapper(cfnBucketRoutingRulePropertyToCloudFormation)(properties.routingRules),
    };
}

// @ts-ignore TS6133
function CfnBucketWebsiteConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.WebsiteConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.WebsiteConfigurationProperty>();
    ret.addPropertyResult('errorDocument', 'ErrorDocument', properties.ErrorDocument != null ? cfn_parse.FromCloudFormation.getString(properties.ErrorDocument) : undefined);
    ret.addPropertyResult('indexDocument', 'IndexDocument', properties.IndexDocument != null ? cfn_parse.FromCloudFormation.getString(properties.IndexDocument) : undefined);
    ret.addPropertyResult('redirectAllRequestsTo', 'RedirectAllRequestsTo', properties.RedirectAllRequestsTo != null ? CfnBucketRedirectAllRequestsToPropertyFromCloudFormation(properties.RedirectAllRequestsTo) : undefined);
    ret.addPropertyResult('routingRules', 'RoutingRules', properties.RoutingRules != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketRoutingRulePropertyFromCloudFormation)(properties.RoutingRules) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnBucketPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html
 */
export interface CfnBucketPolicyProps {

    /**
     * The name of the Amazon S3 bucket to which the policy applies.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html#aws-properties-s3-policy-bucket
     */
    readonly bucket: string;

    /**
     * A policy document containing permissions to add to the specified bucket. In IAM, you must provide policy documents in JSON format. However, in CloudFormation you can provide the policy in JSON or YAML format because CloudFormation converts YAML to JSON before submitting it to IAM. For more information, see the AWS::IAM::Policy [PolicyDocument](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-policydocument) resource description in this guide and [Access Policy Language Overview](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-policy-language-overview.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html#aws-properties-s3-policy-policydocument
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
 * Renders the AWS CloudFormation properties of an `AWS::S3::BucketPolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnBucketPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::BucketPolicy` resource.
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
 * A CloudFormation `AWS::S3::BucketPolicy`
 *
 * Applies an Amazon S3 bucket policy to an Amazon S3 bucket. If you are using an identity other than the root user of the AWS account that owns the bucket, the calling identity must have the `PutBucketPolicy` permissions on the specified bucket and belong to the bucket owner's account in order to use this operation.
 *
 * If you don't have `PutBucketPolicy` permissions, Amazon S3 returns a `403 Access Denied` error. If you have the correct permissions, but you're not using an identity that belongs to the bucket owner's account, Amazon S3 returns a `405 Method Not Allowed` error.
 *
 * > As a security precaution, the root user of the AWS account that owns a bucket can always use this operation, even if the policy explicitly denies the root user the ability to perform this action.
 *
 * For more information, see [Bucket policy examples](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html) .
 *
 * The following operations are related to `PutBucketPolicy` :
 *
 * - [CreateBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CreateBucket.html)
 * - [DeleteBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteBucket.html)
 *
 * @cloudformationResource AWS::S3::BucketPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html
 */
export class CfnBucketPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3::BucketPolicy";

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
     * The name of the Amazon S3 bucket to which the policy applies.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html#aws-properties-s3-policy-bucket
     */
    public bucket: string;

    /**
     * A policy document containing permissions to add to the specified bucket. In IAM, you must provide policy documents in JSON format. However, in CloudFormation you can provide the policy in JSON or YAML format because CloudFormation converts YAML to JSON before submitting it to IAM. For more information, see the AWS::IAM::Policy [PolicyDocument](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-policydocument) resource description in this guide and [Access Policy Language Overview](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-policy-language-overview.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html#aws-properties-s3-policy-policydocument
     */
    public policyDocument: any | cdk.IResolvable;

    /**
     * Create a new `AWS::S3::BucketPolicy`.
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

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            bucket: this.bucket,
            policyDocument: this.policyDocument,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBucketPolicyPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnMultiRegionAccessPoint`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html
 */
export interface CfnMultiRegionAccessPointProps {

    /**
     * A collection of the Regions and buckets associated with the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html#cfn-s3-multiregionaccesspoint-regions
     */
    readonly regions: Array<CfnMultiRegionAccessPoint.RegionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html#cfn-s3-multiregionaccesspoint-name
     */
    readonly name?: string;

    /**
     * The PublicAccessBlock configuration that you want to apply to this Multi-Region Access Point. You can enable the configuration options in any combination. For more information about when Amazon S3 considers an object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration
     */
    readonly publicAccessBlockConfiguration?: CfnMultiRegionAccessPoint.PublicAccessBlockConfigurationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnMultiRegionAccessPointProps`
 *
 * @param properties - the TypeScript properties of a `CfnMultiRegionAccessPointProps`
 *
 * @returns the result of the validation.
 */
function CfnMultiRegionAccessPointPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('publicAccessBlockConfiguration', CfnMultiRegionAccessPoint_PublicAccessBlockConfigurationPropertyValidator)(properties.publicAccessBlockConfiguration));
    errors.collect(cdk.propertyValidator('regions', cdk.requiredValidator)(properties.regions));
    errors.collect(cdk.propertyValidator('regions', cdk.listValidator(CfnMultiRegionAccessPoint_RegionPropertyValidator))(properties.regions));
    return errors.wrap('supplied properties not correct for "CfnMultiRegionAccessPointProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::MultiRegionAccessPoint` resource
 *
 * @param properties - the TypeScript properties of a `CfnMultiRegionAccessPointProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::MultiRegionAccessPoint` resource.
 */
// @ts-ignore TS6133
function cfnMultiRegionAccessPointPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMultiRegionAccessPointPropsValidator(properties).assertSuccess();
    return {
        Regions: cdk.listMapper(cfnMultiRegionAccessPointRegionPropertyToCloudFormation)(properties.regions),
        Name: cdk.stringToCloudFormation(properties.name),
        PublicAccessBlockConfiguration: cfnMultiRegionAccessPointPublicAccessBlockConfigurationPropertyToCloudFormation(properties.publicAccessBlockConfiguration),
    };
}

// @ts-ignore TS6133
function CfnMultiRegionAccessPointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMultiRegionAccessPointProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMultiRegionAccessPointProps>();
    ret.addPropertyResult('regions', 'Regions', cfn_parse.FromCloudFormation.getArray(CfnMultiRegionAccessPointRegionPropertyFromCloudFormation)(properties.Regions));
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('publicAccessBlockConfiguration', 'PublicAccessBlockConfiguration', properties.PublicAccessBlockConfiguration != null ? CfnMultiRegionAccessPointPublicAccessBlockConfigurationPropertyFromCloudFormation(properties.PublicAccessBlockConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::S3::MultiRegionAccessPoint`
 *
 * The `AWS::S3::MultiRegionAccessPoint` resource creates an Amazon S3 Multi-Region Access Point. To learn more about Multi-Region Access Points, see [Multi-Region Access Points in Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/MultiRegionAccessPoints.html) in the in the *Amazon S3 User Guide* .
 *
 * @cloudformationResource AWS::S3::MultiRegionAccessPoint
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html
 */
export class CfnMultiRegionAccessPoint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3::MultiRegionAccessPoint";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMultiRegionAccessPoint {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnMultiRegionAccessPointPropsFromCloudFormation(resourceProperties);
        const ret = new CfnMultiRegionAccessPoint(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The alias for the Multi-Region Access Point. For more information about the distinction between the name and the alias of an Multi-Region Access Point, see [Managing Multi-Region Access Points](https://docs.aws.amazon.com/AmazonS3/latest/userguide/CreatingMultiRegionAccessPoints.html#multi-region-access-point-naming) in the *Amazon S3 User Guide* .
     * @cloudformationAttribute Alias
     */
    public readonly attrAlias: string;

    /**
     * The timestamp of when the Multi-Region Access Point is created.
     * @cloudformationAttribute CreatedAt
     */
    public readonly attrCreatedAt: string;

    /**
     * A collection of the Regions and buckets associated with the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html#cfn-s3-multiregionaccesspoint-regions
     */
    public regions: Array<CfnMultiRegionAccessPoint.RegionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html#cfn-s3-multiregionaccesspoint-name
     */
    public name: string | undefined;

    /**
     * The PublicAccessBlock configuration that you want to apply to this Multi-Region Access Point. You can enable the configuration options in any combination. For more information about when Amazon S3 considers an object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration
     */
    public publicAccessBlockConfiguration: CfnMultiRegionAccessPoint.PublicAccessBlockConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::S3::MultiRegionAccessPoint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMultiRegionAccessPointProps) {
        super(scope, id, { type: CfnMultiRegionAccessPoint.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'regions', this);
        this.attrAlias = cdk.Token.asString(this.getAtt('Alias', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedAt = cdk.Token.asString(this.getAtt('CreatedAt', cdk.ResolutionTypeHint.STRING));

        this.regions = props.regions;
        this.name = props.name;
        this.publicAccessBlockConfiguration = props.publicAccessBlockConfiguration;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMultiRegionAccessPoint.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            regions: this.regions,
            name: this.name,
            publicAccessBlockConfiguration: this.publicAccessBlockConfiguration,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnMultiRegionAccessPointPropsToCloudFormation(props);
    }
}

export namespace CfnMultiRegionAccessPoint {
    /**
     * The PublicAccessBlock configuration that you want to apply to this Amazon S3 Multi-Region Access Point. You can enable the configuration options in any combination. For more information about when Amazon S3 considers an object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-publicaccessblockconfiguration.html
     */
    export interface PublicAccessBlockConfigurationProperty {
        /**
         * Specifies whether Amazon S3 should block public access control lists (ACLs) for this bucket and objects in this bucket. Setting this element to `TRUE` causes the following behavior:
         *
         * - PUT Bucket ACL and PUT Object ACL calls fail if the specified ACL is public.
         * - PUT Object calls fail if the request includes a public ACL.
         * - PUT Bucket calls fail if the request includes a public ACL.
         *
         * Enabling this setting doesn't affect existing policies or ACLs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-publicaccessblockconfiguration.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration-blockpublicacls
         */
        readonly blockPublicAcls?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should block public bucket policies for this bucket. Setting this element to `TRUE` causes Amazon S3 to reject calls to PUT Bucket policy if the specified bucket policy allows public access.
         *
         * Enabling this setting doesn't affect existing bucket policies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-publicaccessblockconfiguration.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration-blockpublicpolicy
         */
        readonly blockPublicPolicy?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should ignore public ACLs for this bucket and objects in this bucket. Setting this element to `TRUE` causes Amazon S3 to ignore all public ACLs on this bucket and objects in this bucket.
         *
         * Enabling this setting doesn't affect the persistence of any existing ACLs and doesn't prevent new public ACLs from being set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-publicaccessblockconfiguration.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration-ignorepublicacls
         */
        readonly ignorePublicAcls?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should restrict public bucket policies for this bucket. Setting this element to `TRUE` restricts access to this bucket to only AWS service principals and authorized users within this account if the bucket has a public policy.
         *
         * Enabling this setting doesn't affect previously stored bucket policies, except that public and cross-account access within any public bucket policy, including non-public delegation to specific accounts, is blocked.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-publicaccessblockconfiguration.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration-restrictpublicbuckets
         */
        readonly restrictPublicBuckets?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PublicAccessBlockConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `PublicAccessBlockConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnMultiRegionAccessPoint_PublicAccessBlockConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('blockPublicAcls', cdk.validateBoolean)(properties.blockPublicAcls));
    errors.collect(cdk.propertyValidator('blockPublicPolicy', cdk.validateBoolean)(properties.blockPublicPolicy));
    errors.collect(cdk.propertyValidator('ignorePublicAcls', cdk.validateBoolean)(properties.ignorePublicAcls));
    errors.collect(cdk.propertyValidator('restrictPublicBuckets', cdk.validateBoolean)(properties.restrictPublicBuckets));
    return errors.wrap('supplied properties not correct for "PublicAccessBlockConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::MultiRegionAccessPoint.PublicAccessBlockConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `PublicAccessBlockConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::MultiRegionAccessPoint.PublicAccessBlockConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnMultiRegionAccessPointPublicAccessBlockConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMultiRegionAccessPoint_PublicAccessBlockConfigurationPropertyValidator(properties).assertSuccess();
    return {
        BlockPublicAcls: cdk.booleanToCloudFormation(properties.blockPublicAcls),
        BlockPublicPolicy: cdk.booleanToCloudFormation(properties.blockPublicPolicy),
        IgnorePublicAcls: cdk.booleanToCloudFormation(properties.ignorePublicAcls),
        RestrictPublicBuckets: cdk.booleanToCloudFormation(properties.restrictPublicBuckets),
    };
}

// @ts-ignore TS6133
function CfnMultiRegionAccessPointPublicAccessBlockConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMultiRegionAccessPoint.PublicAccessBlockConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMultiRegionAccessPoint.PublicAccessBlockConfigurationProperty>();
    ret.addPropertyResult('blockPublicAcls', 'BlockPublicAcls', properties.BlockPublicAcls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BlockPublicAcls) : undefined);
    ret.addPropertyResult('blockPublicPolicy', 'BlockPublicPolicy', properties.BlockPublicPolicy != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BlockPublicPolicy) : undefined);
    ret.addPropertyResult('ignorePublicAcls', 'IgnorePublicAcls', properties.IgnorePublicAcls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IgnorePublicAcls) : undefined);
    ret.addPropertyResult('restrictPublicBuckets', 'RestrictPublicBuckets', properties.RestrictPublicBuckets != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RestrictPublicBuckets) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMultiRegionAccessPoint {
    /**
     * A bucket associated with a specific Region when creating Multi-Region Access Points.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-region.html
     */
    export interface RegionProperty {
        /**
         * The name of the associated bucket for the Region.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-region.html#cfn-s3-multiregionaccesspoint-region-bucket
         */
        readonly bucket: string;
        /**
         * The AWS account ID that owns the Amazon S3 bucket that's associated with this Multi-Region Access Point.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-region.html#cfn-s3-multiregionaccesspoint-region-bucketaccountid
         */
        readonly bucketAccountId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RegionProperty`
 *
 * @param properties - the TypeScript properties of a `RegionProperty`
 *
 * @returns the result of the validation.
 */
function CfnMultiRegionAccessPoint_RegionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucketAccountId', cdk.validateString)(properties.bucketAccountId));
    return errors.wrap('supplied properties not correct for "RegionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::MultiRegionAccessPoint.Region` resource
 *
 * @param properties - the TypeScript properties of a `RegionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::MultiRegionAccessPoint.Region` resource.
 */
// @ts-ignore TS6133
function cfnMultiRegionAccessPointRegionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMultiRegionAccessPoint_RegionPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        BucketAccountId: cdk.stringToCloudFormation(properties.bucketAccountId),
    };
}

// @ts-ignore TS6133
function CfnMultiRegionAccessPointRegionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMultiRegionAccessPoint.RegionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMultiRegionAccessPoint.RegionProperty>();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('bucketAccountId', 'BucketAccountId', properties.BucketAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.BucketAccountId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnMultiRegionAccessPointPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html
 */
export interface CfnMultiRegionAccessPointPolicyProps {

    /**
     * The name of the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html#cfn-s3-multiregionaccesspointpolicy-mrapname
     */
    readonly mrapName: string;

    /**
     * The access policy associated with the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html#cfn-s3-multiregionaccesspointpolicy-policy
     */
    readonly policy: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnMultiRegionAccessPointPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnMultiRegionAccessPointPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnMultiRegionAccessPointPolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mrapName', cdk.requiredValidator)(properties.mrapName));
    errors.collect(cdk.propertyValidator('mrapName', cdk.validateString)(properties.mrapName));
    errors.collect(cdk.propertyValidator('policy', cdk.requiredValidator)(properties.policy));
    errors.collect(cdk.propertyValidator('policy', cdk.validateObject)(properties.policy));
    return errors.wrap('supplied properties not correct for "CfnMultiRegionAccessPointPolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::MultiRegionAccessPointPolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnMultiRegionAccessPointPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::MultiRegionAccessPointPolicy` resource.
 */
// @ts-ignore TS6133
function cfnMultiRegionAccessPointPolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMultiRegionAccessPointPolicyPropsValidator(properties).assertSuccess();
    return {
        MrapName: cdk.stringToCloudFormation(properties.mrapName),
        Policy: cdk.objectToCloudFormation(properties.policy),
    };
}

// @ts-ignore TS6133
function CfnMultiRegionAccessPointPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMultiRegionAccessPointPolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMultiRegionAccessPointPolicyProps>();
    ret.addPropertyResult('mrapName', 'MrapName', cfn_parse.FromCloudFormation.getString(properties.MrapName));
    ret.addPropertyResult('policy', 'Policy', cfn_parse.FromCloudFormation.getAny(properties.Policy));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::S3::MultiRegionAccessPointPolicy`
 *
 * Applies an Amazon S3 access policy to an Amazon S3 Multi-Region Access Point.
 *
 * It is not possible to delete an access policy for a Multi-Region Access Point from the CloudFormation template. When you attempt to delete the policy, CloudFormation updates the policy using `DeletionPolicy:Retain` and `UpdateReplacePolicy:Retain` . CloudFormation updates the policy to only allow access to the account that created the bucket.
 *
 * @cloudformationResource AWS::S3::MultiRegionAccessPointPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html
 */
export class CfnMultiRegionAccessPointPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3::MultiRegionAccessPointPolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMultiRegionAccessPointPolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnMultiRegionAccessPointPolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnMultiRegionAccessPointPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute PolicyStatus.IsPublic
     */
    public readonly attrPolicyStatusIsPublic: string;

    /**
     * The name of the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html#cfn-s3-multiregionaccesspointpolicy-mrapname
     */
    public mrapName: string;

    /**
     * The access policy associated with the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html#cfn-s3-multiregionaccesspointpolicy-policy
     */
    public policy: any | cdk.IResolvable;

    /**
     * Create a new `AWS::S3::MultiRegionAccessPointPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMultiRegionAccessPointPolicyProps) {
        super(scope, id, { type: CfnMultiRegionAccessPointPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'mrapName', this);
        cdk.requireProperty(props, 'policy', this);
        this.attrPolicyStatusIsPublic = cdk.Token.asString(this.getAtt('PolicyStatus.IsPublic', cdk.ResolutionTypeHint.STRING));

        this.mrapName = props.mrapName;
        this.policy = props.policy;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMultiRegionAccessPointPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            mrapName: this.mrapName,
            policy: this.policy,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnMultiRegionAccessPointPolicyPropsToCloudFormation(props);
    }
}

export namespace CfnMultiRegionAccessPointPolicy {
    /**
     * The container element for a bucket's policy status.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspointpolicy-policystatus.html
     */
    export interface PolicyStatusProperty {
        /**
         * The policy status for this bucket. `TRUE` indicates that this bucket is public. `FALSE` indicates that the bucket is not public.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspointpolicy-policystatus.html#cfn-s3-multiregionaccesspointpolicy-policystatus-ispublic
         */
        readonly isPublic: string;
    }
}

/**
 * Determine whether the given properties match those of a `PolicyStatusProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyStatusProperty`
 *
 * @returns the result of the validation.
 */
function CfnMultiRegionAccessPointPolicy_PolicyStatusPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('isPublic', cdk.requiredValidator)(properties.isPublic));
    errors.collect(cdk.propertyValidator('isPublic', cdk.validateString)(properties.isPublic));
    return errors.wrap('supplied properties not correct for "PolicyStatusProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::MultiRegionAccessPointPolicy.PolicyStatus` resource
 *
 * @param properties - the TypeScript properties of a `PolicyStatusProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::MultiRegionAccessPointPolicy.PolicyStatus` resource.
 */
// @ts-ignore TS6133
function cfnMultiRegionAccessPointPolicyPolicyStatusPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMultiRegionAccessPointPolicy_PolicyStatusPropertyValidator(properties).assertSuccess();
    return {
        IsPublic: cdk.stringToCloudFormation(properties.isPublic),
    };
}

// @ts-ignore TS6133
function CfnMultiRegionAccessPointPolicyPolicyStatusPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMultiRegionAccessPointPolicy.PolicyStatusProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMultiRegionAccessPointPolicy.PolicyStatusProperty>();
    ret.addPropertyResult('isPublic', 'IsPublic', cfn_parse.FromCloudFormation.getString(properties.IsPublic));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnStorageLens`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html
 */
export interface CfnStorageLensProps {

    /**
     * This resource contains the details Amazon S3 Storage Lens configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html#cfn-s3-storagelens-storagelensconfiguration
     */
    readonly storageLensConfiguration: CfnStorageLens.StorageLensConfigurationProperty | cdk.IResolvable;

    /**
     * A set of tags (key–value pairs) to associate with the Storage Lens configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html#cfn-s3-storagelens-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnStorageLensProps`
 *
 * @param properties - the TypeScript properties of a `CfnStorageLensProps`
 *
 * @returns the result of the validation.
 */
function CfnStorageLensPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('storageLensConfiguration', cdk.requiredValidator)(properties.storageLensConfiguration));
    errors.collect(cdk.propertyValidator('storageLensConfiguration', CfnStorageLens_StorageLensConfigurationPropertyValidator)(properties.storageLensConfiguration));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnStorageLensProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens` resource
 *
 * @param properties - the TypeScript properties of a `CfnStorageLensProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLensPropsValidator(properties).assertSuccess();
    return {
        StorageLensConfiguration: cfnStorageLensStorageLensConfigurationPropertyToCloudFormation(properties.storageLensConfiguration),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnStorageLensPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLensProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLensProps>();
    ret.addPropertyResult('storageLensConfiguration', 'StorageLensConfiguration', CfnStorageLensStorageLensConfigurationPropertyFromCloudFormation(properties.StorageLensConfiguration));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::S3::StorageLens`
 *
 * The AWS::S3::StorageLens resource creates an Amazon S3 Storage Lens configuration.
 *
 * @cloudformationResource AWS::S3::StorageLens
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html
 */
export class CfnStorageLens extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3::StorageLens";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStorageLens {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStorageLensPropsFromCloudFormation(resourceProperties);
        const ret = new CfnStorageLens(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * This property contains the details of the ARN of the S3 Storage Lens configuration. This property is read-only.
     * @cloudformationAttribute StorageLensConfiguration.StorageLensArn
     */
    public readonly attrStorageLensConfigurationStorageLensArn: string;

    /**
     * This resource contains the details Amazon S3 Storage Lens configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html#cfn-s3-storagelens-storagelensconfiguration
     */
    public storageLensConfiguration: CfnStorageLens.StorageLensConfigurationProperty | cdk.IResolvable;

    /**
     * A set of tags (key–value pairs) to associate with the Storage Lens configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html#cfn-s3-storagelens-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::S3::StorageLens`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStorageLensProps) {
        super(scope, id, { type: CfnStorageLens.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'storageLensConfiguration', this);
        this.attrStorageLensConfigurationStorageLensArn = cdk.Token.asString(this.getAtt('StorageLensConfiguration.StorageLensArn', cdk.ResolutionTypeHint.STRING));

        this.storageLensConfiguration = props.storageLensConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::S3::StorageLens", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStorageLens.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            storageLensConfiguration: this.storageLensConfiguration,
            tags: this.tags.renderTags(),
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStorageLensPropsToCloudFormation(props);
    }
}

export namespace CfnStorageLens {
    /**
     * This resource contains the details of the account-level metrics for Amazon S3 Storage Lens.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html
     */
    export interface AccountLevelProperty {
        /**
         * This property contains the details of account-level activity metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-activitymetrics
         */
        readonly activityMetrics?: CfnStorageLens.ActivityMetricsProperty | cdk.IResolvable;
        /**
         * This property contains the details of account-level advanced cost optimization metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-advancedcostoptimizationmetrics
         */
        readonly advancedCostOptimizationMetrics?: CfnStorageLens.AdvancedCostOptimizationMetricsProperty | cdk.IResolvable;
        /**
         * This property contains the details of account-level advanced data protection metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-advanceddataprotectionmetrics
         */
        readonly advancedDataProtectionMetrics?: CfnStorageLens.AdvancedDataProtectionMetricsProperty | cdk.IResolvable;
        /**
         * This property contains the details of the account-level bucket-level configurations for Amazon S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-bucketlevel
         */
        readonly bucketLevel: CfnStorageLens.BucketLevelProperty | cdk.IResolvable;
        /**
         * This property contains the details of account-level detailed status code metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-detailedstatuscodesmetrics
         */
        readonly detailedStatusCodesMetrics?: CfnStorageLens.DetailedStatusCodesMetricsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AccountLevelProperty`
 *
 * @param properties - the TypeScript properties of a `AccountLevelProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_AccountLevelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('activityMetrics', CfnStorageLens_ActivityMetricsPropertyValidator)(properties.activityMetrics));
    errors.collect(cdk.propertyValidator('advancedCostOptimizationMetrics', CfnStorageLens_AdvancedCostOptimizationMetricsPropertyValidator)(properties.advancedCostOptimizationMetrics));
    errors.collect(cdk.propertyValidator('advancedDataProtectionMetrics', CfnStorageLens_AdvancedDataProtectionMetricsPropertyValidator)(properties.advancedDataProtectionMetrics));
    errors.collect(cdk.propertyValidator('bucketLevel', cdk.requiredValidator)(properties.bucketLevel));
    errors.collect(cdk.propertyValidator('bucketLevel', CfnStorageLens_BucketLevelPropertyValidator)(properties.bucketLevel));
    errors.collect(cdk.propertyValidator('detailedStatusCodesMetrics', CfnStorageLens_DetailedStatusCodesMetricsPropertyValidator)(properties.detailedStatusCodesMetrics));
    return errors.wrap('supplied properties not correct for "AccountLevelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.AccountLevel` resource
 *
 * @param properties - the TypeScript properties of a `AccountLevelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.AccountLevel` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensAccountLevelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_AccountLevelPropertyValidator(properties).assertSuccess();
    return {
        ActivityMetrics: cfnStorageLensActivityMetricsPropertyToCloudFormation(properties.activityMetrics),
        AdvancedCostOptimizationMetrics: cfnStorageLensAdvancedCostOptimizationMetricsPropertyToCloudFormation(properties.advancedCostOptimizationMetrics),
        AdvancedDataProtectionMetrics: cfnStorageLensAdvancedDataProtectionMetricsPropertyToCloudFormation(properties.advancedDataProtectionMetrics),
        BucketLevel: cfnStorageLensBucketLevelPropertyToCloudFormation(properties.bucketLevel),
        DetailedStatusCodesMetrics: cfnStorageLensDetailedStatusCodesMetricsPropertyToCloudFormation(properties.detailedStatusCodesMetrics),
    };
}

// @ts-ignore TS6133
function CfnStorageLensAccountLevelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.AccountLevelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.AccountLevelProperty>();
    ret.addPropertyResult('activityMetrics', 'ActivityMetrics', properties.ActivityMetrics != null ? CfnStorageLensActivityMetricsPropertyFromCloudFormation(properties.ActivityMetrics) : undefined);
    ret.addPropertyResult('advancedCostOptimizationMetrics', 'AdvancedCostOptimizationMetrics', properties.AdvancedCostOptimizationMetrics != null ? CfnStorageLensAdvancedCostOptimizationMetricsPropertyFromCloudFormation(properties.AdvancedCostOptimizationMetrics) : undefined);
    ret.addPropertyResult('advancedDataProtectionMetrics', 'AdvancedDataProtectionMetrics', properties.AdvancedDataProtectionMetrics != null ? CfnStorageLensAdvancedDataProtectionMetricsPropertyFromCloudFormation(properties.AdvancedDataProtectionMetrics) : undefined);
    ret.addPropertyResult('bucketLevel', 'BucketLevel', CfnStorageLensBucketLevelPropertyFromCloudFormation(properties.BucketLevel));
    ret.addPropertyResult('detailedStatusCodesMetrics', 'DetailedStatusCodesMetrics', properties.DetailedStatusCodesMetrics != null ? CfnStorageLensDetailedStatusCodesMetricsPropertyFromCloudFormation(properties.DetailedStatusCodesMetrics) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * This resource enables Amazon S3 Storage Lens activity metrics. Activity metrics show details about how your storage is requested, such as requests (for example, All requests, Get requests, Put requests), bytes uploaded or downloaded, and errors.
     *
     * For more information, see [Assessing your storage activity and usage with S3 Storage Lens](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens.html) in the *Amazon S3 User Guide* . For a complete list of metrics, see [S3 Storage Lens metrics glossary](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_metrics_glossary.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-activitymetrics.html
     */
    export interface ActivityMetricsProperty {
        /**
         * A property that indicates whether the activity metrics is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-activitymetrics.html#cfn-s3-storagelens-activitymetrics-isenabled
         */
        readonly isEnabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ActivityMetricsProperty`
 *
 * @param properties - the TypeScript properties of a `ActivityMetricsProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_ActivityMetricsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('isEnabled', cdk.validateBoolean)(properties.isEnabled));
    return errors.wrap('supplied properties not correct for "ActivityMetricsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.ActivityMetrics` resource
 *
 * @param properties - the TypeScript properties of a `ActivityMetricsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.ActivityMetrics` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensActivityMetricsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_ActivityMetricsPropertyValidator(properties).assertSuccess();
    return {
        IsEnabled: cdk.booleanToCloudFormation(properties.isEnabled),
    };
}

// @ts-ignore TS6133
function CfnStorageLensActivityMetricsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.ActivityMetricsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.ActivityMetricsProperty>();
    ret.addPropertyResult('isEnabled', 'IsEnabled', properties.IsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * This resource enables Amazon S3 Storage Lens advanced cost optimization metrics. Advanced cost optimization metrics provide insights that you can use to manage and optimize your storage costs, for example, lifecycle rule counts for transitions, expirations, and incomplete multipart uploads.
     *
     * For more information, see [Assessing your storage activity and usage with S3 Storage Lens](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens.html) in the *Amazon S3 User Guide* . For a complete list of metrics, see [S3 Storage Lens metrics glossary](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_metrics_glossary.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-advancedcostoptimizationmetrics.html
     */
    export interface AdvancedCostOptimizationMetricsProperty {
        /**
         * Indicates whether advanced cost optimization metrics are enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-advancedcostoptimizationmetrics.html#cfn-s3-storagelens-advancedcostoptimizationmetrics-isenabled
         */
        readonly isEnabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AdvancedCostOptimizationMetricsProperty`
 *
 * @param properties - the TypeScript properties of a `AdvancedCostOptimizationMetricsProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_AdvancedCostOptimizationMetricsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('isEnabled', cdk.validateBoolean)(properties.isEnabled));
    return errors.wrap('supplied properties not correct for "AdvancedCostOptimizationMetricsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.AdvancedCostOptimizationMetrics` resource
 *
 * @param properties - the TypeScript properties of a `AdvancedCostOptimizationMetricsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.AdvancedCostOptimizationMetrics` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensAdvancedCostOptimizationMetricsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_AdvancedCostOptimizationMetricsPropertyValidator(properties).assertSuccess();
    return {
        IsEnabled: cdk.booleanToCloudFormation(properties.isEnabled),
    };
}

// @ts-ignore TS6133
function CfnStorageLensAdvancedCostOptimizationMetricsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.AdvancedCostOptimizationMetricsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.AdvancedCostOptimizationMetricsProperty>();
    ret.addPropertyResult('isEnabled', 'IsEnabled', properties.IsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * This resource enables Amazon S3 Storage Lens advanced data protection metrics. Advanced data protection metrics provide insights that you can use to perform audits and protect your data, for example replication rule counts within and across Regions.
     *
     * For more information, see [Assessing your storage activity and usage with S3 Storage Lens](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens.html) in the *Amazon S3 User Guide* . For a complete list of metrics, see [S3 Storage Lens metrics glossary](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_metrics_glossary.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-advanceddataprotectionmetrics.html
     */
    export interface AdvancedDataProtectionMetricsProperty {
        /**
         * Indicates whether advanced data protection metrics are enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-advanceddataprotectionmetrics.html#cfn-s3-storagelens-advanceddataprotectionmetrics-isenabled
         */
        readonly isEnabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AdvancedDataProtectionMetricsProperty`
 *
 * @param properties - the TypeScript properties of a `AdvancedDataProtectionMetricsProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_AdvancedDataProtectionMetricsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('isEnabled', cdk.validateBoolean)(properties.isEnabled));
    return errors.wrap('supplied properties not correct for "AdvancedDataProtectionMetricsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.AdvancedDataProtectionMetrics` resource
 *
 * @param properties - the TypeScript properties of a `AdvancedDataProtectionMetricsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.AdvancedDataProtectionMetrics` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensAdvancedDataProtectionMetricsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_AdvancedDataProtectionMetricsPropertyValidator(properties).assertSuccess();
    return {
        IsEnabled: cdk.booleanToCloudFormation(properties.isEnabled),
    };
}

// @ts-ignore TS6133
function CfnStorageLensAdvancedDataProtectionMetricsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.AdvancedDataProtectionMetricsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.AdvancedDataProtectionMetricsProperty>();
    ret.addPropertyResult('isEnabled', 'IsEnabled', properties.IsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * This resource contains the details of the AWS Organization for Amazon S3 Storage Lens.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-awsorg.html
     */
    export interface AwsOrgProperty {
        /**
         * This resource contains the ARN of the AWS Organization.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-awsorg.html#cfn-s3-storagelens-awsorg-arn
         */
        readonly arn: string;
    }
}

/**
 * Determine whether the given properties match those of a `AwsOrgProperty`
 *
 * @param properties - the TypeScript properties of a `AwsOrgProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_AwsOrgPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    return errors.wrap('supplied properties not correct for "AwsOrgProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.AwsOrg` resource
 *
 * @param properties - the TypeScript properties of a `AwsOrgProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.AwsOrg` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensAwsOrgPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_AwsOrgPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
    };
}

// @ts-ignore TS6133
function CfnStorageLensAwsOrgPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.AwsOrgProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.AwsOrgProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * A property for the bucket-level storage metrics for Amazon S3 Storage Lens.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html
     */
    export interface BucketLevelProperty {
        /**
         * A property for bucket-level activity metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html#cfn-s3-storagelens-bucketlevel-activitymetrics
         */
        readonly activityMetrics?: CfnStorageLens.ActivityMetricsProperty | cdk.IResolvable;
        /**
         * A property for bucket-level advanced cost optimization metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html#cfn-s3-storagelens-bucketlevel-advancedcostoptimizationmetrics
         */
        readonly advancedCostOptimizationMetrics?: CfnStorageLens.AdvancedCostOptimizationMetricsProperty | cdk.IResolvable;
        /**
         * A property for bucket-level advanced data protection metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html#cfn-s3-storagelens-bucketlevel-advanceddataprotectionmetrics
         */
        readonly advancedDataProtectionMetrics?: CfnStorageLens.AdvancedDataProtectionMetricsProperty | cdk.IResolvable;
        /**
         * A property for bucket-level detailed status code metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html#cfn-s3-storagelens-bucketlevel-detailedstatuscodesmetrics
         */
        readonly detailedStatusCodesMetrics?: CfnStorageLens.DetailedStatusCodesMetricsProperty | cdk.IResolvable;
        /**
         * A property for bucket-level prefix-level storage metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html#cfn-s3-storagelens-bucketlevel-prefixlevel
         */
        readonly prefixLevel?: CfnStorageLens.PrefixLevelProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `BucketLevelProperty`
 *
 * @param properties - the TypeScript properties of a `BucketLevelProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_BucketLevelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('activityMetrics', CfnStorageLens_ActivityMetricsPropertyValidator)(properties.activityMetrics));
    errors.collect(cdk.propertyValidator('advancedCostOptimizationMetrics', CfnStorageLens_AdvancedCostOptimizationMetricsPropertyValidator)(properties.advancedCostOptimizationMetrics));
    errors.collect(cdk.propertyValidator('advancedDataProtectionMetrics', CfnStorageLens_AdvancedDataProtectionMetricsPropertyValidator)(properties.advancedDataProtectionMetrics));
    errors.collect(cdk.propertyValidator('detailedStatusCodesMetrics', CfnStorageLens_DetailedStatusCodesMetricsPropertyValidator)(properties.detailedStatusCodesMetrics));
    errors.collect(cdk.propertyValidator('prefixLevel', CfnStorageLens_PrefixLevelPropertyValidator)(properties.prefixLevel));
    return errors.wrap('supplied properties not correct for "BucketLevelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.BucketLevel` resource
 *
 * @param properties - the TypeScript properties of a `BucketLevelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.BucketLevel` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensBucketLevelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_BucketLevelPropertyValidator(properties).assertSuccess();
    return {
        ActivityMetrics: cfnStorageLensActivityMetricsPropertyToCloudFormation(properties.activityMetrics),
        AdvancedCostOptimizationMetrics: cfnStorageLensAdvancedCostOptimizationMetricsPropertyToCloudFormation(properties.advancedCostOptimizationMetrics),
        AdvancedDataProtectionMetrics: cfnStorageLensAdvancedDataProtectionMetricsPropertyToCloudFormation(properties.advancedDataProtectionMetrics),
        DetailedStatusCodesMetrics: cfnStorageLensDetailedStatusCodesMetricsPropertyToCloudFormation(properties.detailedStatusCodesMetrics),
        PrefixLevel: cfnStorageLensPrefixLevelPropertyToCloudFormation(properties.prefixLevel),
    };
}

// @ts-ignore TS6133
function CfnStorageLensBucketLevelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.BucketLevelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.BucketLevelProperty>();
    ret.addPropertyResult('activityMetrics', 'ActivityMetrics', properties.ActivityMetrics != null ? CfnStorageLensActivityMetricsPropertyFromCloudFormation(properties.ActivityMetrics) : undefined);
    ret.addPropertyResult('advancedCostOptimizationMetrics', 'AdvancedCostOptimizationMetrics', properties.AdvancedCostOptimizationMetrics != null ? CfnStorageLensAdvancedCostOptimizationMetricsPropertyFromCloudFormation(properties.AdvancedCostOptimizationMetrics) : undefined);
    ret.addPropertyResult('advancedDataProtectionMetrics', 'AdvancedDataProtectionMetrics', properties.AdvancedDataProtectionMetrics != null ? CfnStorageLensAdvancedDataProtectionMetricsPropertyFromCloudFormation(properties.AdvancedDataProtectionMetrics) : undefined);
    ret.addPropertyResult('detailedStatusCodesMetrics', 'DetailedStatusCodesMetrics', properties.DetailedStatusCodesMetrics != null ? CfnStorageLensDetailedStatusCodesMetricsPropertyFromCloudFormation(properties.DetailedStatusCodesMetrics) : undefined);
    ret.addPropertyResult('prefixLevel', 'PrefixLevel', properties.PrefixLevel != null ? CfnStorageLensPrefixLevelPropertyFromCloudFormation(properties.PrefixLevel) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * This resource contains the details of the buckets and Regions for the Amazon S3 Storage Lens configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketsandregions.html
     */
    export interface BucketsAndRegionsProperty {
        /**
         * This property contains the details of the buckets for the Amazon S3 Storage Lens configuration. This should be the bucket Amazon Resource Name(ARN). For valid values, see [Buckets ARN format here](https://docs.aws.amazon.com/AmazonS3/latest/API/API_control_Include.html#API_control_Include_Contents) in the *Amazon S3 API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketsandregions.html#cfn-s3-storagelens-bucketsandregions-buckets
         */
        readonly buckets?: string[];
        /**
         * This property contains the details of the Regions for the S3 Storage Lens configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketsandregions.html#cfn-s3-storagelens-bucketsandregions-regions
         */
        readonly regions?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `BucketsAndRegionsProperty`
 *
 * @param properties - the TypeScript properties of a `BucketsAndRegionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_BucketsAndRegionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('buckets', cdk.listValidator(cdk.validateString))(properties.buckets));
    errors.collect(cdk.propertyValidator('regions', cdk.listValidator(cdk.validateString))(properties.regions));
    return errors.wrap('supplied properties not correct for "BucketsAndRegionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.BucketsAndRegions` resource
 *
 * @param properties - the TypeScript properties of a `BucketsAndRegionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.BucketsAndRegions` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensBucketsAndRegionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_BucketsAndRegionsPropertyValidator(properties).assertSuccess();
    return {
        Buckets: cdk.listMapper(cdk.stringToCloudFormation)(properties.buckets),
        Regions: cdk.listMapper(cdk.stringToCloudFormation)(properties.regions),
    };
}

// @ts-ignore TS6133
function CfnStorageLensBucketsAndRegionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.BucketsAndRegionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.BucketsAndRegionsProperty>();
    ret.addPropertyResult('buckets', 'Buckets', properties.Buckets != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Buckets) : undefined);
    ret.addPropertyResult('regions', 'Regions', properties.Regions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Regions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * This resource enables the Amazon CloudWatch publishing option for Amazon S3 Storage Lens metrics.
     *
     * For more information, see [Monitor S3 Storage Lens metrics in CloudWatch](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_view_metrics_cloudwatch.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-cloudwatchmetrics.html
     */
    export interface CloudWatchMetricsProperty {
        /**
         * This property identifies whether the CloudWatch publishing option for S3 Storage Lens is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-cloudwatchmetrics.html#cfn-s3-storagelens-cloudwatchmetrics-isenabled
         */
        readonly isEnabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchMetricsProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchMetricsProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_CloudWatchMetricsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('isEnabled', cdk.requiredValidator)(properties.isEnabled));
    errors.collect(cdk.propertyValidator('isEnabled', cdk.validateBoolean)(properties.isEnabled));
    return errors.wrap('supplied properties not correct for "CloudWatchMetricsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.CloudWatchMetrics` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchMetricsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.CloudWatchMetrics` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensCloudWatchMetricsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_CloudWatchMetricsPropertyValidator(properties).assertSuccess();
    return {
        IsEnabled: cdk.booleanToCloudFormation(properties.isEnabled),
    };
}

// @ts-ignore TS6133
function CfnStorageLensCloudWatchMetricsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.CloudWatchMetricsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.CloudWatchMetricsProperty>();
    ret.addPropertyResult('isEnabled', 'IsEnabled', cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * This resource contains the details of the Amazon S3 Storage Lens metrics export.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-dataexport.html
     */
    export interface DataExportProperty {
        /**
         * This property enables the Amazon CloudWatch publishing option for S3 Storage Lens metrics.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-dataexport.html#cfn-s3-storagelens-dataexport-cloudwatchmetrics
         */
        readonly cloudWatchMetrics?: CfnStorageLens.CloudWatchMetricsProperty | cdk.IResolvable;
        /**
         * This property contains the details of the bucket where the S3 Storage Lens metrics export will be placed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-dataexport.html#cfn-s3-storagelens-dataexport-s3bucketdestination
         */
        readonly s3BucketDestination?: CfnStorageLens.S3BucketDestinationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DataExportProperty`
 *
 * @param properties - the TypeScript properties of a `DataExportProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_DataExportPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchMetrics', CfnStorageLens_CloudWatchMetricsPropertyValidator)(properties.cloudWatchMetrics));
    errors.collect(cdk.propertyValidator('s3BucketDestination', CfnStorageLens_S3BucketDestinationPropertyValidator)(properties.s3BucketDestination));
    return errors.wrap('supplied properties not correct for "DataExportProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.DataExport` resource
 *
 * @param properties - the TypeScript properties of a `DataExportProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.DataExport` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensDataExportPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_DataExportPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchMetrics: cfnStorageLensCloudWatchMetricsPropertyToCloudFormation(properties.cloudWatchMetrics),
        S3BucketDestination: cfnStorageLensS3BucketDestinationPropertyToCloudFormation(properties.s3BucketDestination),
    };
}

// @ts-ignore TS6133
function CfnStorageLensDataExportPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.DataExportProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.DataExportProperty>();
    ret.addPropertyResult('cloudWatchMetrics', 'CloudWatchMetrics', properties.CloudWatchMetrics != null ? CfnStorageLensCloudWatchMetricsPropertyFromCloudFormation(properties.CloudWatchMetrics) : undefined);
    ret.addPropertyResult('s3BucketDestination', 'S3BucketDestination', properties.S3BucketDestination != null ? CfnStorageLensS3BucketDestinationPropertyFromCloudFormation(properties.S3BucketDestination) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * This resource enables Amazon S3 Storage Lens detailed status code metrics. Detailed status code metrics generate metrics for HTTP status codes, such as `200 OK` , `403 Forbidden` , `503 Service Unavailable` and others.
     *
     * For more information, see [Assessing your storage activity and usage with S3 Storage Lens](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens.html) in the *Amazon S3 User Guide* . For a complete list of metrics, see [S3 Storage Lens metrics glossary](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_metrics_glossary.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-detailedstatuscodesmetrics.html
     */
    export interface DetailedStatusCodesMetricsProperty {
        /**
         * Indicates whether detailed status code metrics are enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-detailedstatuscodesmetrics.html#cfn-s3-storagelens-detailedstatuscodesmetrics-isenabled
         */
        readonly isEnabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DetailedStatusCodesMetricsProperty`
 *
 * @param properties - the TypeScript properties of a `DetailedStatusCodesMetricsProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_DetailedStatusCodesMetricsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('isEnabled', cdk.validateBoolean)(properties.isEnabled));
    return errors.wrap('supplied properties not correct for "DetailedStatusCodesMetricsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.DetailedStatusCodesMetrics` resource
 *
 * @param properties - the TypeScript properties of a `DetailedStatusCodesMetricsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.DetailedStatusCodesMetrics` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensDetailedStatusCodesMetricsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_DetailedStatusCodesMetricsPropertyValidator(properties).assertSuccess();
    return {
        IsEnabled: cdk.booleanToCloudFormation(properties.isEnabled),
    };
}

// @ts-ignore TS6133
function CfnStorageLensDetailedStatusCodesMetricsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.DetailedStatusCodesMetricsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.DetailedStatusCodesMetricsProperty>();
    ret.addPropertyResult('isEnabled', 'IsEnabled', properties.IsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * This resource contains the type of server-side encryption used to encrypt an Amazon S3 Storage Lens metrics export. For valid values, see the [StorageLensDataExportEncryption](https://docs.aws.amazon.com/AmazonS3/latest/API/API_control_StorageLensDataExportEncryption.html) in the *Amazon S3 API Reference* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-encryption.html
     */
    export interface EncryptionProperty {
        /**
         * Specifies the use of AWS Key Management Service keys (SSE-KMS) to encrypt the S3 Storage Lens metrics export file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-encryption.html#cfn-s3-storagelens-encryption-ssekms
         */
        readonly ssekms?: CfnStorageLens.SSEKMSProperty | cdk.IResolvable;
        /**
         * Specifies the use of an Amazon S3-managed key (SSE-S3) to encrypt the S3 Storage Lens metrics export file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-encryption.html#cfn-s3-storagelens-encryption-sses3
         */
        readonly sses3?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_EncryptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ssekms', CfnStorageLens_SSEKMSPropertyValidator)(properties.ssekms));
    errors.collect(cdk.propertyValidator('sses3', cdk.validateObject)(properties.sses3));
    return errors.wrap('supplied properties not correct for "EncryptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.Encryption` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.Encryption` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensEncryptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_EncryptionPropertyValidator(properties).assertSuccess();
    return {
        SSEKMS: cfnStorageLensSSEKMSPropertyToCloudFormation(properties.ssekms),
        SSES3: cdk.objectToCloudFormation(properties.sses3),
    };
}

// @ts-ignore TS6133
function CfnStorageLensEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.EncryptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.EncryptionProperty>();
    ret.addPropertyResult('ssekms', 'SSEKMS', properties.SSEKMS != null ? CfnStorageLensSSEKMSPropertyFromCloudFormation(properties.SSEKMS) : undefined);
    ret.addPropertyResult('sses3', 'SSES3', properties.SSES3 != null ? cfn_parse.FromCloudFormation.getAny(properties.SSES3) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * This resource contains the details of the prefix-level of the Amazon S3 Storage Lens.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-prefixlevel.html
     */
    export interface PrefixLevelProperty {
        /**
         * A property for the prefix-level storage metrics for Amazon S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-prefixlevel.html#cfn-s3-storagelens-prefixlevel-storagemetrics
         */
        readonly storageMetrics: CfnStorageLens.PrefixLevelStorageMetricsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PrefixLevelProperty`
 *
 * @param properties - the TypeScript properties of a `PrefixLevelProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_PrefixLevelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('storageMetrics', cdk.requiredValidator)(properties.storageMetrics));
    errors.collect(cdk.propertyValidator('storageMetrics', CfnStorageLens_PrefixLevelStorageMetricsPropertyValidator)(properties.storageMetrics));
    return errors.wrap('supplied properties not correct for "PrefixLevelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.PrefixLevel` resource
 *
 * @param properties - the TypeScript properties of a `PrefixLevelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.PrefixLevel` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensPrefixLevelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_PrefixLevelPropertyValidator(properties).assertSuccess();
    return {
        StorageMetrics: cfnStorageLensPrefixLevelStorageMetricsPropertyToCloudFormation(properties.storageMetrics),
    };
}

// @ts-ignore TS6133
function CfnStorageLensPrefixLevelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.PrefixLevelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.PrefixLevelProperty>();
    ret.addPropertyResult('storageMetrics', 'StorageMetrics', CfnStorageLensPrefixLevelStorageMetricsPropertyFromCloudFormation(properties.StorageMetrics));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * This resource contains the details of the prefix-level storage metrics for Amazon S3 Storage Lens.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-prefixlevelstoragemetrics.html
     */
    export interface PrefixLevelStorageMetricsProperty {
        /**
         * This property identifies whether the details of the prefix-level storage metrics for S3 Storage Lens are enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-prefixlevelstoragemetrics.html#cfn-s3-storagelens-prefixlevelstoragemetrics-isenabled
         */
        readonly isEnabled?: boolean | cdk.IResolvable;
        /**
         * This property identifies whether the details of the prefix-level storage metrics for S3 Storage Lens are enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-prefixlevelstoragemetrics.html#cfn-s3-storagelens-prefixlevelstoragemetrics-selectioncriteria
         */
        readonly selectionCriteria?: CfnStorageLens.SelectionCriteriaProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PrefixLevelStorageMetricsProperty`
 *
 * @param properties - the TypeScript properties of a `PrefixLevelStorageMetricsProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_PrefixLevelStorageMetricsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('isEnabled', cdk.validateBoolean)(properties.isEnabled));
    errors.collect(cdk.propertyValidator('selectionCriteria', CfnStorageLens_SelectionCriteriaPropertyValidator)(properties.selectionCriteria));
    return errors.wrap('supplied properties not correct for "PrefixLevelStorageMetricsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.PrefixLevelStorageMetrics` resource
 *
 * @param properties - the TypeScript properties of a `PrefixLevelStorageMetricsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.PrefixLevelStorageMetrics` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensPrefixLevelStorageMetricsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_PrefixLevelStorageMetricsPropertyValidator(properties).assertSuccess();
    return {
        IsEnabled: cdk.booleanToCloudFormation(properties.isEnabled),
        SelectionCriteria: cfnStorageLensSelectionCriteriaPropertyToCloudFormation(properties.selectionCriteria),
    };
}

// @ts-ignore TS6133
function CfnStorageLensPrefixLevelStorageMetricsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.PrefixLevelStorageMetricsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.PrefixLevelStorageMetricsProperty>();
    ret.addPropertyResult('isEnabled', 'IsEnabled', properties.IsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled) : undefined);
    ret.addPropertyResult('selectionCriteria', 'SelectionCriteria', properties.SelectionCriteria != null ? CfnStorageLensSelectionCriteriaPropertyFromCloudFormation(properties.SelectionCriteria) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * This resource contains the details of the bucket where the Amazon S3 Storage Lens metrics export will be placed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html
     */
    export interface S3BucketDestinationProperty {
        /**
         * This property contains the details of the AWS account ID of the S3 Storage Lens export bucket destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-accountid
         */
        readonly accountId: string;
        /**
         * This property contains the details of the ARN of the bucket destination of the S3 Storage Lens export.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-arn
         */
        readonly arn: string;
        /**
         * This property contains the details of the encryption of the bucket destination of the Amazon S3 Storage Lens metrics export.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-encryption
         */
        readonly encryption?: CfnStorageLens.EncryptionProperty | cdk.IResolvable;
        /**
         * This property contains the details of the format of the S3 Storage Lens export bucket destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-format
         */
        readonly format: string;
        /**
         * This property contains the details of the output schema version of the S3 Storage Lens export bucket destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-outputschemaversion
         */
        readonly outputSchemaVersion: string;
        /**
         * This property contains the details of the prefix of the bucket destination of the S3 Storage Lens export .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-prefix
         */
        readonly prefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3BucketDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `S3BucketDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_S3BucketDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accountId', cdk.requiredValidator)(properties.accountId));
    errors.collect(cdk.propertyValidator('accountId', cdk.validateString)(properties.accountId));
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('encryption', CfnStorageLens_EncryptionPropertyValidator)(properties.encryption));
    errors.collect(cdk.propertyValidator('format', cdk.requiredValidator)(properties.format));
    errors.collect(cdk.propertyValidator('format', cdk.validateString)(properties.format));
    errors.collect(cdk.propertyValidator('outputSchemaVersion', cdk.requiredValidator)(properties.outputSchemaVersion));
    errors.collect(cdk.propertyValidator('outputSchemaVersion', cdk.validateString)(properties.outputSchemaVersion));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    return errors.wrap('supplied properties not correct for "S3BucketDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.S3BucketDestination` resource
 *
 * @param properties - the TypeScript properties of a `S3BucketDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.S3BucketDestination` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensS3BucketDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_S3BucketDestinationPropertyValidator(properties).assertSuccess();
    return {
        AccountId: cdk.stringToCloudFormation(properties.accountId),
        Arn: cdk.stringToCloudFormation(properties.arn),
        Encryption: cfnStorageLensEncryptionPropertyToCloudFormation(properties.encryption),
        Format: cdk.stringToCloudFormation(properties.format),
        OutputSchemaVersion: cdk.stringToCloudFormation(properties.outputSchemaVersion),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
    };
}

// @ts-ignore TS6133
function CfnStorageLensS3BucketDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.S3BucketDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.S3BucketDestinationProperty>();
    ret.addPropertyResult('accountId', 'AccountId', cfn_parse.FromCloudFormation.getString(properties.AccountId));
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addPropertyResult('encryption', 'Encryption', properties.Encryption != null ? CfnStorageLensEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined);
    ret.addPropertyResult('format', 'Format', cfn_parse.FromCloudFormation.getString(properties.Format));
    ret.addPropertyResult('outputSchemaVersion', 'OutputSchemaVersion', cfn_parse.FromCloudFormation.getString(properties.OutputSchemaVersion));
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * Specifies the use of server-side encryption using an AWS Key Management Service key (SSE-KMS) to encrypt the delivered S3 Storage Lens metrics export file.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-ssekms.html
     */
    export interface SSEKMSProperty {
        /**
         * Specifies the Amazon Resource Name (ARN) of the customer managed AWS KMS key to use for encrypting the S3 Storage Lens metrics export file. Amazon S3 only supports symmetric encryption keys. For more information, see [Special-purpose keys](https://docs.aws.amazon.com/kms/latest/developerguide/key-types.html) in the *AWS Key Management Service Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-ssekms.html#cfn-s3-storagelens-ssekms-keyid
         */
        readonly keyId: string;
    }
}

/**
 * Determine whether the given properties match those of a `SSEKMSProperty`
 *
 * @param properties - the TypeScript properties of a `SSEKMSProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_SSEKMSPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('keyId', cdk.requiredValidator)(properties.keyId));
    errors.collect(cdk.propertyValidator('keyId', cdk.validateString)(properties.keyId));
    return errors.wrap('supplied properties not correct for "SSEKMSProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.SSEKMS` resource
 *
 * @param properties - the TypeScript properties of a `SSEKMSProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.SSEKMS` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensSSEKMSPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_SSEKMSPropertyValidator(properties).assertSuccess();
    return {
        KeyId: cdk.stringToCloudFormation(properties.keyId),
    };
}

// @ts-ignore TS6133
function CfnStorageLensSSEKMSPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.SSEKMSProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.SSEKMSProperty>();
    ret.addPropertyResult('keyId', 'KeyId', cfn_parse.FromCloudFormation.getString(properties.KeyId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * This resource contains the details of the Amazon S3 Storage Lens selection criteria.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-selectioncriteria.html
     */
    export interface SelectionCriteriaProperty {
        /**
         * This property contains the details of the S3 Storage Lens delimiter being used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-selectioncriteria.html#cfn-s3-storagelens-selectioncriteria-delimiter
         */
        readonly delimiter?: string;
        /**
         * This property contains the details of the max depth that S3 Storage Lens will collect metrics up to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-selectioncriteria.html#cfn-s3-storagelens-selectioncriteria-maxdepth
         */
        readonly maxDepth?: number;
        /**
         * This property contains the details of the minimum storage bytes percentage threshold that S3 Storage Lens will collect metrics up to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-selectioncriteria.html#cfn-s3-storagelens-selectioncriteria-minstoragebytespercentage
         */
        readonly minStorageBytesPercentage?: number;
    }
}

/**
 * Determine whether the given properties match those of a `SelectionCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `SelectionCriteriaProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_SelectionCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('delimiter', cdk.validateString)(properties.delimiter));
    errors.collect(cdk.propertyValidator('maxDepth', cdk.validateNumber)(properties.maxDepth));
    errors.collect(cdk.propertyValidator('minStorageBytesPercentage', cdk.validateNumber)(properties.minStorageBytesPercentage));
    return errors.wrap('supplied properties not correct for "SelectionCriteriaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.SelectionCriteria` resource
 *
 * @param properties - the TypeScript properties of a `SelectionCriteriaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.SelectionCriteria` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensSelectionCriteriaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_SelectionCriteriaPropertyValidator(properties).assertSuccess();
    return {
        Delimiter: cdk.stringToCloudFormation(properties.delimiter),
        MaxDepth: cdk.numberToCloudFormation(properties.maxDepth),
        MinStorageBytesPercentage: cdk.numberToCloudFormation(properties.minStorageBytesPercentage),
    };
}

// @ts-ignore TS6133
function CfnStorageLensSelectionCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.SelectionCriteriaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.SelectionCriteriaProperty>();
    ret.addPropertyResult('delimiter', 'Delimiter', properties.Delimiter != null ? cfn_parse.FromCloudFormation.getString(properties.Delimiter) : undefined);
    ret.addPropertyResult('maxDepth', 'MaxDepth', properties.MaxDepth != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxDepth) : undefined);
    ret.addPropertyResult('minStorageBytesPercentage', 'MinStorageBytesPercentage', properties.MinStorageBytesPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinStorageBytesPercentage) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageLens {
    /**
     * This is the property of the Amazon S3 Storage Lens configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html
     */
    export interface StorageLensConfigurationProperty {
        /**
         * This property contains the details of the account-level metrics for Amazon S3 Storage Lens configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-accountlevel
         */
        readonly accountLevel: CfnStorageLens.AccountLevelProperty | cdk.IResolvable;
        /**
         * This property contains the details of the AWS Organization for the S3 Storage Lens configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-awsorg
         */
        readonly awsOrg?: CfnStorageLens.AwsOrgProperty | cdk.IResolvable;
        /**
         * This property contains the details of this S3 Storage Lens configuration's metrics export.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-dataexport
         */
        readonly dataExport?: CfnStorageLens.DataExportProperty | cdk.IResolvable;
        /**
         * This property contains the details of the bucket and or Regions excluded for Amazon S3 Storage Lens configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-exclude
         */
        readonly exclude?: CfnStorageLens.BucketsAndRegionsProperty | cdk.IResolvable;
        /**
         * This property contains the details of the ID of the S3 Storage Lens configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-id
         */
        readonly id: string;
        /**
         * This property contains the details of the bucket and or Regions included for Amazon S3 Storage Lens configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-include
         */
        readonly include?: CfnStorageLens.BucketsAndRegionsProperty | cdk.IResolvable;
        /**
         * This property contains the details of whether the Amazon S3 Storage Lens configuration is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-isenabled
         */
        readonly isEnabled: boolean | cdk.IResolvable;
        /**
         * This property contains the details of the ARN of the S3 Storage Lens configuration. This property is read-only.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-storagelensarn
         */
        readonly storageLensArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `StorageLensConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `StorageLensConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageLens_StorageLensConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accountLevel', cdk.requiredValidator)(properties.accountLevel));
    errors.collect(cdk.propertyValidator('accountLevel', CfnStorageLens_AccountLevelPropertyValidator)(properties.accountLevel));
    errors.collect(cdk.propertyValidator('awsOrg', CfnStorageLens_AwsOrgPropertyValidator)(properties.awsOrg));
    errors.collect(cdk.propertyValidator('dataExport', CfnStorageLens_DataExportPropertyValidator)(properties.dataExport));
    errors.collect(cdk.propertyValidator('exclude', CfnStorageLens_BucketsAndRegionsPropertyValidator)(properties.exclude));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('include', CfnStorageLens_BucketsAndRegionsPropertyValidator)(properties.include));
    errors.collect(cdk.propertyValidator('isEnabled', cdk.requiredValidator)(properties.isEnabled));
    errors.collect(cdk.propertyValidator('isEnabled', cdk.validateBoolean)(properties.isEnabled));
    errors.collect(cdk.propertyValidator('storageLensArn', cdk.validateString)(properties.storageLensArn));
    return errors.wrap('supplied properties not correct for "StorageLensConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::S3::StorageLens.StorageLensConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `StorageLensConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::S3::StorageLens.StorageLensConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnStorageLensStorageLensConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageLens_StorageLensConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AccountLevel: cfnStorageLensAccountLevelPropertyToCloudFormation(properties.accountLevel),
        AwsOrg: cfnStorageLensAwsOrgPropertyToCloudFormation(properties.awsOrg),
        DataExport: cfnStorageLensDataExportPropertyToCloudFormation(properties.dataExport),
        Exclude: cfnStorageLensBucketsAndRegionsPropertyToCloudFormation(properties.exclude),
        Id: cdk.stringToCloudFormation(properties.id),
        Include: cfnStorageLensBucketsAndRegionsPropertyToCloudFormation(properties.include),
        IsEnabled: cdk.booleanToCloudFormation(properties.isEnabled),
        StorageLensArn: cdk.stringToCloudFormation(properties.storageLensArn),
    };
}

// @ts-ignore TS6133
function CfnStorageLensStorageLensConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.StorageLensConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.StorageLensConfigurationProperty>();
    ret.addPropertyResult('accountLevel', 'AccountLevel', CfnStorageLensAccountLevelPropertyFromCloudFormation(properties.AccountLevel));
    ret.addPropertyResult('awsOrg', 'AwsOrg', properties.AwsOrg != null ? CfnStorageLensAwsOrgPropertyFromCloudFormation(properties.AwsOrg) : undefined);
    ret.addPropertyResult('dataExport', 'DataExport', properties.DataExport != null ? CfnStorageLensDataExportPropertyFromCloudFormation(properties.DataExport) : undefined);
    ret.addPropertyResult('exclude', 'Exclude', properties.Exclude != null ? CfnStorageLensBucketsAndRegionsPropertyFromCloudFormation(properties.Exclude) : undefined);
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('include', 'Include', properties.Include != null ? CfnStorageLensBucketsAndRegionsPropertyFromCloudFormation(properties.Include) : undefined);
    ret.addPropertyResult('isEnabled', 'IsEnabled', cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled));
    ret.addPropertyResult('storageLensArn', 'StorageLensArn', properties.StorageLensArn != null ? cfn_parse.FromCloudFormation.getString(properties.StorageLensArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
