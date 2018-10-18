import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import path = require('path');
import s3deploy = require('../lib');

class TestBucketDeployment extends cdk.Stack {
  constructor(parent: cdk.App, id: string) {
    super(parent, id);

    const destinationBucket = new s3.Bucket(this, 'Destination', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
    });

    new s3deploy.BucketDeployment(this, 'DeployMe', {
      source: s3deploy.Source.asset(path.join(__dirname, 'my-website')),
      destinationBucket,
    });

    const bucket2 = new s3.Bucket(this, 'Destination2');

    new s3deploy.BucketDeployment(this, 'DeployWithPrefix', {
      source: s3deploy.Source.asset(path.join(__dirname, 'my-website')),
      destinationBucket: bucket2,
      destinationKeyPrefix: 'deploy/here/',
      retainOnDelete: false, // this is the default
    });
  }
}

const app = new cdk.App();

new TestBucketDeployment(app, 'test-bucket-deployments');

app.run();