import cloudfront = require('@aws-cdk/aws-cloudfront');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import path = require('path');
import s3deploy = require('../lib');

class TestBucketDeployment extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const destinationBucket = new s3.Bucket(this, 'Destination', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    new s3deploy.BucketDeployment(this, 'DeployMe', {
      source: s3deploy.Source.asset(path.join(__dirname, 'my-website')),
      destinationBucket,
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });

    const bucket2 = new s3.Bucket(this, 'Destination2');

    new s3deploy.BucketDeployment(this, 'DeployWithPrefix', {
      source: s3deploy.Source.asset(path.join(__dirname, 'my-website')),
      destinationBucket: bucket2,
      destinationKeyPrefix: 'deploy/here/',
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });

    const bucket3 = new s3.Bucket(this, 'Destination3');
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket3
          },
          behaviors : [ {isDefaultBehavior: true}]
        }
      ]
    });

    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      source: s3deploy.Source.asset(path.join(__dirname, 'my-website')),
      destinationBucket: bucket2,
      distribution,
      distributionPaths: ['/images/*.png']
    });

  }
}

const app = new cdk.App();

new TestBucketDeployment(app, 'test-bucket-deployments-1');

app.synth();
