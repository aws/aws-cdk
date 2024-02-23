/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Applies an Amazon S3 bucket policy to an Amazon S3 directory bucket.
 *
 * - **Permissions** - If you are using an identity other than the root user of the AWS account that owns the bucket, the calling identity must both have the required permissions on the specified bucket and belong to the bucket owner's account in order to use this operation. For more information about directory bucket policies and permissions, see [AWS Identity and Access Management (IAM) for S3 Express One Zone](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-security-iam.html) in the *Amazon S3 User Guide* .
 *
 * > To ensure that bucket owners don't inadvertently lock themselves out of their own buckets, the root principal in a bucket owner's AWS account can perform the `GetBucketPolicy` , `PutBucketPolicy` , and `DeleteBucketPolicy` API actions, even if their bucket policy explicitly denies the root principal's access. Bucket owner root principals can only be blocked from performing these API actions by VPC endpoint policies and AWS Organizations policies.
 *
 * The required permissions for CloudFormation to use are based on the operations that are performed on the stack.
 *
 * - Create
 *
 * - s3express:GetBucketPolicy
 * - s3express:PutBucketPolicy
 * - Read
 *
 * - s3express:GetBucketPolicy
 * - Update
 *
 * - s3express:GetBucketPolicy
 * - s3express:PutBucketPolicy
 * - Delete
 *
 * - s3express:GetBucketPolicy
 * - s3express:DeleteBucketPolicy
 * - List
 *
 * - s3express:GetBucketPolicy
 * - s3express:ListAllMyDirectoryBuckets
 *
 * For more information about example bucket policies, see [Example bucket policies for S3 Express One Zone](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-security-iam-example-bucket-policies.html) in the *Amazon S3 User Guide* .
 *
 * The following operations are related to `AWS::S3Express::BucketPolicy` :
 *
 * - [PutBucketPolicy](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutBucketPolicy.html)
 * - [GetBucketPolicy](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketPolicy.html)
 * - [DeleteBucketPolicy](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteBucketPolicy.html)
 * - [ListDirectoryBuckets](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListDirectoryBuckets.html)
 *
 * @cloudformationResource AWS::S3Express::BucketPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3express-bucketpolicy.html
 */
export class CfnBucketPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3Express::BucketPolicy";

  /**
   * Build a CfnBucketPolicy from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBucketPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the S3 directory bucket to which the policy applies.
   */
  public bucket: string;

  /**
   * A policy document containing permissions to add to the specified bucket.
   */
  public policyDocument: any | cdk.IResolvable | string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBucketPolicyProps) {
    super(scope, id, {
      "type": CfnBucketPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "bucket", this);
    cdk.requireProperty(props, "policyDocument", this);

    this.bucket = props.bucket;
    this.policyDocument = props.policyDocument;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bucket": this.bucket,
      "policyDocument": this.policyDocument
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBucketPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBucketPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnBucketPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3express-bucketpolicy.html
 */
export interface CfnBucketPolicyProps {
  /**
   * The name of the S3 directory bucket to which the policy applies.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3express-bucketpolicy.html#cfn-s3express-bucketpolicy-bucket
   */
  readonly bucket: string;

  /**
   * A policy document containing permissions to add to the specified bucket.
   *
   * In IAM, you must provide policy documents in JSON format. However, in CloudFormation you can provide the policy in JSON or YAML format because CloudFormation converts YAML to JSON before submitting it to IAM. For more information, see the AWS::IAM::Policy [PolicyDocument](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-policydocument) resource description in this guide and [Policies and Permissions in Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-policy-language-overview.html) in the *Amazon S3 User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3express-bucketpolicy.html#cfn-s3express-bucketpolicy-policydocument
   */
  readonly policyDocument: any | cdk.IResolvable | string;
}

/**
 * Determine whether the given properties match those of a `CfnBucketPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnBucketPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.unionValidator(cdk.validateString, cdk.validateObject))(properties.policyDocument));
  return errors.wrap("supplied properties not correct for \"CfnBucketPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnBucketPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketPolicyPropsValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "PolicyDocument": cdk.unionMapper([cdk.validateString, cdk.validateObject], [cdk.stringToCloudFormation, cdk.objectToCloudFormation])(properties.policyDocument)
  };
}

// @ts-ignore TS6133
function CfnBucketPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucketPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucketPolicyProps>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("policyDocument", "PolicyDocument", (properties.PolicyDocument != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString, cdk.validateObject], [cfn_parse.FromCloudFormation.getString, cfn_parse.FromCloudFormation.getAny])(properties.PolicyDocument) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::S3Express::DirectoryBucket` resource creates an Amazon S3 directory bucket in the same AWS Region where you create the AWS CloudFormation stack.
 *
 * To control how AWS CloudFormation handles the bucket when the stack is deleted, you can set a deletion policy for your bucket. You can choose to *retain* the bucket or to *delete* the bucket. For more information, see [DeletionPolicy attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html) .
 *
 * > You can only delete empty buckets. Deletion fails for buckets that have contents.
 *
 * - **Permissions** - The required permissions for CloudFormation to use are based on the operations that are performed on the stack.
 *
 * - Create
 *
 * - s3express:CreateBucket
 * - s3express:ListAllMyDirectoryBuckets
 * - Read
 *
 * - s3express:ListAllMyDirectoryBuckets
 * - Delete
 *
 * - s3express:DeleteBucket
 * - s3express:ListAllMyDirectoryBuckets
 * - List
 *
 * - s3express:ListAllMyDirectoryBuckets
 *
 * The following operations are related to `AWS::S3Express::DirectoryBucket` :
 *
 * - [CreateBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CreateBucket.html)
 * - [ListDirectoryBuckets](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListDirectoryBuckets.html)
 * - [DeleteBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteBucket.html)
 *
 * @cloudformationResource AWS::S3Express::DirectoryBucket
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3express-directorybucket.html
 */
export class CfnDirectoryBucket extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3Express::DirectoryBucket";

  /**
   * Build a CfnDirectoryBucket from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDirectoryBucket {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDirectoryBucketPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDirectoryBucket(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) of the specified bucket.
   *
   * Example: `arn:aws:s3express: *us-west-2* : *account_id* :bucket/ *DOC-EXAMPLE-BUCKET* -- *usw2-az1* --x-s3`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A name for the bucket.
   */
  public bucketName?: string;

  /**
   * The number of Availability Zone that's used for redundancy for the bucket.
   */
  public dataRedundancy: string;

  /**
   * The name of the location where the bucket will be created.
   */
  public locationName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDirectoryBucketProps) {
    super(scope, id, {
      "type": CfnDirectoryBucket.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "dataRedundancy", this);
    cdk.requireProperty(props, "locationName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.bucketName = props.bucketName;
    this.dataRedundancy = props.dataRedundancy;
    this.locationName = props.locationName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bucketName": this.bucketName,
      "dataRedundancy": this.dataRedundancy,
      "locationName": this.locationName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDirectoryBucket.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDirectoryBucketPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDirectoryBucket`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3express-directorybucket.html
 */
export interface CfnDirectoryBucketProps {
  /**
   * A name for the bucket.
   *
   * The bucket name must contain only lowercase letters, numbers, and hyphens (-). A directory bucket name must be unique in the chosen Availability Zone. The bucket name must also follow the format `*bucket_base_name* -- *az_id* --x-s3` (for example, `*DOC-EXAMPLE-BUCKET* -- *usw2-az1* --x-s3` ). If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the bucket name. For information about bucket naming restrictions, see [Directory bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-bucket-naming-rules.html) in the *Amazon S3 User Guide* .
   *
   * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you need to replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3express-directorybucket.html#cfn-s3express-directorybucket-bucketname
   */
  readonly bucketName?: string;

  /**
   * The number of Availability Zone that's used for redundancy for the bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3express-directorybucket.html#cfn-s3express-directorybucket-dataredundancy
   */
  readonly dataRedundancy: string;

  /**
   * The name of the location where the bucket will be created.
   *
   * For directory buckets, the name of the location is the AZ ID of the Availability Zone where the bucket will be created. An example AZ ID value is `usw2-az1` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3express-directorybucket.html#cfn-s3express-directorybucket-locationname
   */
  readonly locationName: string;
}

/**
 * Determine whether the given properties match those of a `CfnDirectoryBucketProps`
 *
 * @param properties - the TypeScript properties of a `CfnDirectoryBucketProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDirectoryBucketPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("dataRedundancy", cdk.requiredValidator)(properties.dataRedundancy));
  errors.collect(cdk.propertyValidator("dataRedundancy", cdk.validateString)(properties.dataRedundancy));
  errors.collect(cdk.propertyValidator("locationName", cdk.requiredValidator)(properties.locationName));
  errors.collect(cdk.propertyValidator("locationName", cdk.validateString)(properties.locationName));
  return errors.wrap("supplied properties not correct for \"CfnDirectoryBucketProps\"");
}

// @ts-ignore TS6133
function convertCfnDirectoryBucketPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDirectoryBucketPropsValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "DataRedundancy": cdk.stringToCloudFormation(properties.dataRedundancy),
    "LocationName": cdk.stringToCloudFormation(properties.locationName)
  };
}

// @ts-ignore TS6133
function CfnDirectoryBucketPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDirectoryBucketProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDirectoryBucketProps>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("dataRedundancy", "DataRedundancy", (properties.DataRedundancy != null ? cfn_parse.FromCloudFormation.getString(properties.DataRedundancy) : undefined));
  ret.addPropertyResult("locationName", "LocationName", (properties.LocationName != null ? cfn_parse.FromCloudFormation.getString(properties.LocationName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}