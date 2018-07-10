import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/s3';

/**
 * The CDK Toolkit stack provides resources necessary to deploy cloud executables into an AWS environment.
 */
export class ToolkitStack extends cdk.Stack {
    /** The name of the S3 bucket that can be used to stage CloudFormation templates for deployment. */
    public readonly bucketNameOutput: cdk.Output;
    /** The domain name of the S3 bucket that can be used to stage CloudFormation templates for deployment. */
    public readonly bucketDomainNameOutput: cdk.Output;

    constructor(parent: cdk.App, name: string, props: cdk.StackProps) {
        super(parent, name, props);

        // tslint:disable-next-line:max-line-length
        this.templateOptions.description = 'The CDK Toolkit Stack. It cas created by `cdk bootstrap` and manages resources necessary for managing your Cloud Applications with AWS CDK.';

        const bucket = new s3.cloudformation.BucketResource(this, 'StagingBucket', {
            accessControl: 'Private',
            bucketEncryption: {
                serverSideEncryptionConfiguration: [ { serverSideEncryptionByDefault: { sseAlgorithm: 'aws:kms' } } ]
            }
        });

        this.bucketNameOutput = new cdk.Output(this, 'BucketName', {
            description: 'The name of the S3 bucket owned by the CDK toolkit stack',
            value: bucket.ref
        });

        this.bucketDomainNameOutput = new cdk.Output(this, 'BucketDomainName', {
            description: 'The domain name of the S3 bucket owned by the CDK toolkit stack',
            value: bucket.bucketDomainName
        });
    }
}
