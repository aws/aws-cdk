import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

export class TestStack extends Stack {
  readonly table: dynamodb.TableV2;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new dynamodb.TableV2(this, 'TableTest1', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      warmThroughput: {
        readUnitsPerSecond: 14000,
        writeUnitsPerSecond: 5000,
      },
      replicas: [{
        region: 'us-west-2',
      }],
      globalSecondaryIndexes: [
        {
          indexName: 'my-index-1',
          partitionKey: { name: 'gsi1pk', type: dynamodb.AttributeType.STRING },
          warmThroughput: {
            readUnitsPerSecond: 15000,
            writeUnitsPerSecond: 6000,
          },
        },
        {
          indexName: 'my-index-2',
          partitionKey: { name: 'gsi1pk', type: dynamodb.AttributeType.STRING },
        },
      ],
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'warm-throughput-stack-v2', { env: { region: 'eu-west-1' } });

new IntegTest(app, 'warm-throughput-integ-test-v2', {
  testCases: [stack],
});
