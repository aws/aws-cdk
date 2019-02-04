import { CustomResource } from '@aws-cdk/aws-cloudformation';
import lambda = require('@aws-cdk/aws-lambda');
import { CfnBucket } from '@aws-cdk/aws-s3';
import cdk = require('@aws-cdk/cdk');
import fs = require('fs');

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

  constructor(scope: cdk.Construct, id: string, props: DemoResourceProps) {
    super(scope, id);

    const resource = new CustomResource(this, 'Resource', {
      lambdaProvider: new lambda.SingletonFunction(this, 'Singleton', {
        uuid: 'f7d4f730-4ee1-11e8-9c2d-fa7ae01bbebc',
        // This makes the demo only work as top-level TypeScript program, but that's fine for now
        code: lambda.Code.inline(fs.readFileSync('provider.py', { encoding: 'utf-8' })),
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
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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

/**
 * A stack that sets up a failing CustomResource creation
 */
class FailCreationStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new DemoResource(this, 'DemoResource', {
      message: 'CustomResource is silent',
      failCreate: true
    });
  }
}

/**
 * A stack that sets up the CustomResource and fails afterwards, to check that cleanup gets
 * done properly.
 */
class FailAfterCreatingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const resource = new DemoResource(this, 'DemoResource', {
      message: 'CustomResource says hello',
    });

    // Bucket with an invalid name will fail the deployment and cause a rollback
    const bucket = new CfnBucket(this, 'FailingBucket', {
      bucketName: 'hello!@#$^'
    });

    // Make sure the rollback gets triggered only after the custom resource has been fully created.
    bucket.node.addDependency(resource);
  }
}

const app = new cdk.App();

new SucceedingStack(app, 'SucceedingStack');
new FailCreationStack(app, 'FailCreationStack');
new FailAfterCreatingStack(app, 'FailAfterCreatingStack');

app.run();
