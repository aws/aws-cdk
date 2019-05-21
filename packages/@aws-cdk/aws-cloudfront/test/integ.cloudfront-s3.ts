import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import cloudfront = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudfront-s3');

const bucket = new s3.Bucket(stack, 'Bucket', { removalPolicy: cdk.RemovalPolicy.Destroy });
const oai = new cloudfront.CfnCloudFrontOriginAccessIdentity(stack, 'OAI', {
  cloudFrontOriginAccessIdentityConfig: {
    comment: 'Allows CloudFront to reach to the bucket!',
  }
});
const dist = new cloudfront.CloudFrontWebDistribution(stack, 'Distribution', {
  originConfigs: [{
    behaviors: [{ isDefaultBehavior: true }],
    s3OriginSource: {
      s3BucketSource: bucket,
      originAccessIdentityId: oai.cloudFrontOriginAccessIdentityId,
    },
  }]
});
bucket.addToResourcePolicy(new iam.PolicyStatement()
  .allow()
  .addActions('s3:Get*', 's3:List*')
  .addResources(bucket.bucketArn, bucket.arnForObjects('*'))
  .addCanonicalUserPrincipal(oai.cloudFrontOriginAccessIdentityS3CanonicalUserId));

new cdk.CfnOutput(stack, 'DistributionDomainName', { value: dist.domainName });
