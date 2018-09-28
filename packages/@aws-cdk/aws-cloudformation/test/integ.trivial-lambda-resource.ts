import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import fs = require('fs');
import cloudformation = require('../lib');

interface DemoResourceProps {
  /**
   * Message to echo
   */
  message: string;

  /**
   * Set this to true to fail the CREATE invocation
   */
  failCreate?: boolean;
}

class DemoResource extends cdk.Construct {
  public readonly response: string;

  constructor(parent: cdk.Construct, name: string, props: DemoResourceProps) {
    super(parent, name);

    const resource = new cloudformation.CustomResource(this, 'Resource', {
      lambdaProvider: new lambda.SingletonFunction(this, 'Singleton', {
        uuid: 'f7d4f730-4ee1-11e8-9c2d-fa7ae01bbebc',
        // This makes the demo only work as top-level TypeScript program, but that's fine for now
        code: new lambda.InlineCode(fs.readFileSync('integ.trivial-lambda-provider.py', { encoding: 'utf-8' })),
        handler: 'index.main',
        timeout: 300,
        runtime: lambda.Runtime.Python27,
      }),
      properties: props
    });

    this.response = resource.getAtt('Response').toString();
  }
}

/**
 * A stack that only sets up the CustomResource and shows how to get an attribute from it
 */
class SucceedingStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    const resource = new DemoResource(this, 'DemoResource', {
      message: 'CustomResource says hello',
    });

    // Publish the custom resource output
    new cdk.Output(this, 'ResponseMessage', {
      description: 'The message that came back from the Custom Resource',
      value: resource.response
    });
  }
}
const app = new cdk.App(process.argv);

new SucceedingStack(app, 'SucceedingStack');

process.stdout.write(app.run());
