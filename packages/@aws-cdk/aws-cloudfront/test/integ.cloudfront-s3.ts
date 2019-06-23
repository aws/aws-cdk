import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import cloudfront = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudfront-s3');

const bucket = new s3.Bucket(stack, 'Bucket', { removalPolicy: cdk.RemovalPolicy.DESTROY });
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
      originAccessIdentityId: oai.ref,
    },
  }]
});
bucket.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['s3:Get*', 's3:List*'],
  resources: [bucket.bucketArn, bucket.arnForObjects('*')],
  principals: [new iam.CanonicalUserPrincipal(oai.attrS3CanonicalUserId)],
}));

new cdk.CfnOutput(stack, 'DistributionDomainName', { value: dist.domainName });
