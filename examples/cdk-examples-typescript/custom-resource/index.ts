import { CustomResource } from '@aws-cdk/aws-cloudformation';
import lambda = require('@aws-cdk/aws-lambda');
import { cloudformation as s3 } from '@aws-cdk/aws-s3';
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

class DemoResource extends cdk.Construct implements cdk.IDependable {
  public readonly dependencyElements: cdk.IDependable[];
  public readonly response: string;

  constructor(parent: cdk.Construct, name: string, props: DemoResourceProps) {
    super(parent, name);

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
    this.dependencyElements = [resource];
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

/**
 * A stack that sets up a failing CustomResource creation
 */
class FailCreationStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

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
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    const resource = new DemoResource(this, 'DemoResource', {
      message: 'CustomResource says hello',
    });

    // Bucket with an invalid name will fail the deployment and cause a rollback
    const bucket = new s3.BucketResource(this, 'FailingBucket', {
      bucketName: 'hello!@#$^'
    });

    // Make sure the rollback gets triggered only after the custom resource has been fully created.
    bucket.addDependency(resource);
  }
}

const app = new cdk.App(process.argv);

new SucceedingStack(app, 'SucceedingStack');
new FailCreationStack(app, 'FailCreationStack');
new FailAfterCreatingStack(app, 'FailAfterCreatingStack');

process.stdout.write(app.run());
