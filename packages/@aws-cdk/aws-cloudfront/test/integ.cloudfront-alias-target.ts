import route53 = require('@aws-cdk/aws-route53');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import cloudfront = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront');

const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

const sourceBucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.Destroy
});

const distribution = new cloudfront.CloudFrontWebDistribution(stack, 'MyDistribution', {
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: sourceBucket
      },
      behaviors : [ {isDefaultBehavior: true}]
    }
  ]
 });

new route53.AliasRecord(zone, 'Alias', {
  zone,
  recordName: '_foo',
  target: distribution
});

app.run();
