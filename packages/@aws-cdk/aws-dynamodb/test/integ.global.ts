/// !cdk-integ pragma:ignore-assets
import { App, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as dynamodb from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'Table', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      replicationRegions: [
        'eu-west-2',
        'eu-central-1',
      ],
    });

    table.addGlobalSecondaryIndex({
      indexName: 'my-index',
      partitionKey: {
        name: 'key',
        type: dynamodb.AttributeType.STRING,
      },
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-dynamodb-global-20191121', { env: { region: 'eu-west-1' } });
app.synth();
