import cdk = require('@aws-cdk/cdk');
import path = require('path');
import lambda = require('../lib');

class TestStack extends cdk.Stack {
  constructor(parent: cdk.App, id: string) {
    super(parent, id);

    /// !show
    new lambda.Function(this, 'MyLambda', {
      code: lambda.Code.directory(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.main',
      runtime: lambda.Runtime.Python36
    });
    /// !hide
  }
}

const app = new cdk.App(process.argv);

new TestStack(app, 'lambda-test-assets');

process.stdout.write(app.run());
