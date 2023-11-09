import { Construct } from 'constructs';
import { App, Stack, StackProps } from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Bucket } from 'aws-cdk-lib/aws-s3';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const inventoryBucket = new Bucket(this, 'InventoryBucket');
    new Bucket(this, 'AVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVery@#$+:;?!&LongNodeIdName', {
      inventories: [
        {
          destination: {
            bucket: inventoryBucket,
          },
        },
      ],
    });
  }
}

const app = new App();

new IntegTest(app, 'cdk-integ-bucket-inventory', {
  testCases: [new TestStack(app, 'aws-cdk-bucket-inventory')],
});
