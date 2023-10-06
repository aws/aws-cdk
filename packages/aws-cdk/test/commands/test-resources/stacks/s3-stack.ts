import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

export interface GoodTypeScriptStackProps extends cdk.StackProps {
}

/**
 * AWS CloudFormation Sample Template S3_Website_Bucket_With_Retain_On_Delete: Sample template showing how to create a publicly accessible S3 bucket configured for website access with a deletion policy of retain on delete.
 */
export class GoodTypeScriptStack extends cdk.Stack {
  /**
   * URL for website hosted on S3
   */
  public readonly websiteUrl;
  /**
   * Name of S3 bucket to hold website content
   */
  public readonly s3BucketSecureUrl;

  public constructor(scope: cdk.App, id: string, props: GoodTypeScriptStackProps = {}) {
    super(scope, id, props);

    // Resources
    const s3Bucket = new s3.CfnBucket(this, 'S3Bucket', {
      accessControl: 'PublicRead',
      websiteConfiguration: {
        indexDocument: 'index.html',
        errorDocument: 'error.html',
      },
    });
    s3Bucket.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

    // Outputs
    this.websiteUrl = s3Bucket.attrWebsiteUrl;
    new cdk.CfnOutput(this, 'WebsiteURL', {
      description: 'URL for website hosted on S3',
      value: this.websiteUrl!.toString(),
    });
    this.s3BucketSecureUrl = [
      'https://',
      s3Bucket.attrDomainName,
    ].join('');
    new cdk.CfnOutput(this, 'S3BucketSecureURL', {
      description: 'Name of S3 bucket to hold website content',
      value: this.s3BucketSecureUrl!.toString(),
    });
  }
}
