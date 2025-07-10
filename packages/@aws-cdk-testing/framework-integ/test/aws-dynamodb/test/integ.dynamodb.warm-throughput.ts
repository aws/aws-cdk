import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

export class TestStack extends Stack {
  readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new dynamodb.Table(this, 'TableTest1', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      warmThroughput: {
        readUnitsPerSecond: 14000,
        writeUnitsPerSecond: 5000,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.table.addGlobalSecondaryIndex({
      indexName: 'my-index',
      partitionKey: { name: 'gsi1pk', type: dynamodb.AttributeType.STRING },
      warmThroughput: {
        readUnitsPerSecond: 15000,
        writeUnitsPerSecond: 5000,
      },
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'warm-throughput-stack', {});

new IntegTest(app, 'warm-throughput-integ-test', {
  testCases: [stack],
});
