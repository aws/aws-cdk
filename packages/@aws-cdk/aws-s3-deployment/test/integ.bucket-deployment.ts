import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import path = require('path');
import s3deploy = require('../lib');

class TestBucketDeployment extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const destinationBucket = new s3.Bucket(this, 'Destination', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.Destroy
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
  }
}

const app = new cdk.App();

new TestBucketDeployment(app, 'test-bucket-deployments-1');

app.run();
