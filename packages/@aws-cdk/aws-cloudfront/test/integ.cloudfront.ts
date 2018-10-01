
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import cloudfront = require('../lib');

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront');

const sourceBucket = new s3.Bucket(stack, 'Bucket');

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

process.stdout.write(app.run());
