import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import path = require('path');
import assets = require('../lib');

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// !show
    const asset = new assets.ZipDirectoryAsset(this, 'SampleAsset', {
      path: path.join(__dirname, 'sample-asset-directory')
    });
    /// !hide

    const user = new iam.User(this, 'MyUser');
    asset.grantRead(user);
  }
}

const app = new cdk.App();
new TestStack(app, 'aws-cdk-asset-test');
app.run();
