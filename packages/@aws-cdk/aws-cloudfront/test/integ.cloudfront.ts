
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import cloudfront = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront');

const sourceBucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY
});

new cloudfront.CloudFrontWebDistribution(stack, 'MyDistribution', {
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: sourceBucket
      },
      behaviors : [ {isDefaultBehavior: true}]
    }
  ]
 });

app.synth();
