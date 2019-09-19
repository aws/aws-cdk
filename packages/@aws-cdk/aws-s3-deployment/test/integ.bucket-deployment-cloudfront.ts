import cloudfront = require('@aws-cdk/aws-cloudfront');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import path = require('path');
import s3deploy = require('../lib');

class TestBucketDeployment extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'Destination3', {
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket
          },
          behaviors : [ {isDefaultBehavior: true}]
        }
      ]
    });

    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/images/*.png'],
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });

  }
}

const app = new cdk.App();

new TestBucketDeployment(app, 'test-bucket-deployments-1');

app.synth();
