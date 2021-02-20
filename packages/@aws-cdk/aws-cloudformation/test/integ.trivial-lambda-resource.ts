import * as fs from 'fs';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CustomResource, CustomResourceProvider } from '../lib';

/* eslint-disable cdk/no-core-construct */

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

class DemoResource extends Construct {
  public readonly response: string;

  constructor(scope: Construct, id: string, props: DemoResourceProps) {
    super(scope, id);

    const resource = new CustomResource(this, 'Resource', {
      provider: CustomResourceProvider.fromLambda(new lambda.SingletonFunction(this, 'Singleton', {
        uuid: 'f7d4f730-4ee1-11e8-9c2d-fa7ae01bbebc',
        // This makes the demo only work as top-level TypeScript program, but that's fine for now
        code: new lambda.InlineCode(fs.readFileSync('integ.trivial-lambda-provider.py', { encoding: 'utf-8' })),
        handler: 'index.main',
        timeout: cdk.Duration.minutes(5),
        runtime: lambda.Runtime.PYTHON_2_7,
      })),
      properties: props,
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
    new cdk.CfnOutput(this, 'ResponseMessage', {
      description: 'The message that came back from the Custom Resource',
      value: resource.response,
    });
  }
}
const app = new cdk.App();

new SucceedingStack(app, 'SucceedingStack');

app.synth();
