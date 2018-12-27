import cdk = require('@aws-cdk/cdk');
import path = require('path');
import lambda = require('../lib');

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, scid: string) {
    super(scope, scid);

    /// !show
    new lambda.Function(this, 'MyLambda', {
      code: lambda.Code.file(path.join(__dirname, 'handler.zip')),
      handler: 'index.main',
      runtime: lambda.Runtime.Python36
    });
    /// !hide
  }
}

const app = new cdk.App();

new TestStack(app, 'lambda-test-assets-file');

app.run();
