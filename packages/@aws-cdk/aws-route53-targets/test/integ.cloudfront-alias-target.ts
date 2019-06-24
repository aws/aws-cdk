import cloudfront = require('@aws-cdk/aws-cloudfront');
import route53 = require('@aws-cdk/aws-route53');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import targets = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront');

const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

const sourceBucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY
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

new route53.ARecord(zone, 'Alias', {
  zone,
  recordName: '_foo',
  target: route53.AddressRecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
});

app.synth();
