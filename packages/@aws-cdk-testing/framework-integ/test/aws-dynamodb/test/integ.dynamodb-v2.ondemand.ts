import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Billing, TableV2, TableClass, TableEncryptionV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Stream } from 'aws-cdk-lib/aws-kinesis';
import { Construct } from 'constructs';

class TestStack extends Stack {
  public constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const stream = new Stream(this, 'Stream');

    new TableV2(this, 'GlobalTable', {
      tableName: 'my-global-table',
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.NUMBER },
      billing: Billing.onDemand(),
      encryption: TableEncryptionV2.awsManagedKey(),
      contributorInsights: true,
      pointInTimeRecovery: true,
      tableClass: TableClass.STANDARD_INFREQUENT_ACCESS,
      timeToLiveAttribute: 'attr',
      removalPolicy: RemovalPolicy.DESTROY,
      kinesisStream: stream,
      replicas: [
        {
          region: 'eu-west-1',
          maxReadRequestUnits: 222,
        },
      ],
      globalSecondaryIndexes: [
        {
          indexName: 'gsi1',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
          maxReadRequestUnits: 1002,
        },
        {
          indexName: 'gsi2',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
          maxReadRequestUnits: 2001,
          maxWriteRequestUnits: 2001,
        },
      ],
      localSecondaryIndexes: [
        {
          indexName: 'lsi',
          sortKey: { name: 'sk', type: AttributeType.NUMBER },
        },
      ],
      tags: [{ key: 'primaryTableTagKey', value: 'primaryTableTagValue' }],
    });
  }
}

const app = new App();
new IntegTest(app, 'aws-cdk-global-table-integ', {
  testCases: [new TestStack(app, 'aws-cdk-global-table', { env: { region: 'us-east-1' } })],
  regions: ['us-east-1'],
  stackUpdateWorkflow: false,
});
