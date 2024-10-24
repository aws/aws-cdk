import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as integ from '@aws-cdk/integ-tests-alpha';

export class AWSCustomResourceMemoryDb extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cr.AwsCustomResource(this, 'myMemoryDbCustomResource', {
      memorySize: 1024,
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
      installLatestAwsSdk: true,
      onUpdate: {
        service: '@aws-sdk/client-memorydb',
        action: 'DescribeClusters',
        physicalResourceId: cr.PhysicalResourceId.of('myMemoryDbCRphysicalResourceID'),
      },
    });
  }
}

const app = new cdk.App();

new integ.IntegTest(app, 'AwsCustomResourceMemoryDbTest', {
  testCases: [
    new AWSCustomResourceMemoryDb(app, 'aws-cdk-sdk-memorydb'),
  ],
  diffAssets: true,
});

app.synth();