import * as path from 'path';
import { App, Aspects, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { IFunction, Function, InlineCode, RuntimeAspect, Runtime } from 'aws-cdk-lib/aws-lambda';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  public readonly functionToIgnore: IFunction;

  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const destinationBucket = new Bucket(this, 'Destination', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    new BucketDeployment(this, 'DeployMe', {
      sources: [Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });

    const fn = new Function(this, 'Lambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_18_X,
    });
    this.functionToIgnore = fn;
  }
}

const app = new App();
const testStack = new TestStack(app, 'TestStack');
Aspects.of(testStack).add(RuntimeAspect.nodeJs20({
  functionsToIgnore: [testStack.functionToIgnore],
}));

new IntegTest(app, 'aws-cdk-bucket-deployment-runtime-aspect', {
  testCases: [testStack],
});
