import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { AttributeType, Billing, Capacity, TableV2, TableClass, TableEncryptionV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Stream } from 'aws-cdk-lib/aws-kinesis';
import { Construct } from 'constructs';

class TestStack extends Stack {
  public constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const stream = new Stream(this, 'Stream');

    const globalTable = new TableV2(this, 'GlobalTable', {
      tableName: 'my-global-table',
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.NUMBER },
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(10),
        writeCapacity: Capacity.autoscaled({ maxCapacity: 20, targetUtilizationPercent: 60, seedCapacity: 10 }),
      }),
      encryption: TableEncryptionV2.awsManagedKey(),
      contributorInsightsSpecification: {
        enabled: true,
      },
      pointInTimeRecovery: true,
      tableClass: TableClass.STANDARD_INFREQUENT_ACCESS,
      timeToLiveAttribute: 'attr',
      removalPolicy: RemovalPolicy.DESTROY,
      kinesisStream: stream,
      globalSecondaryIndexes: [
        {
          indexName: 'gsi1',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
          readCapacity: Capacity.fixed(10),
        },
        {
          indexName: 'gsi2',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
          writeCapacity: Capacity.autoscaled({ maxCapacity: 30 }),
        },
      ],
      localSecondaryIndexes: [
        {
          indexName: 'lsi',
          sortKey: { name: 'sk', type: AttributeType.NUMBER },
        },
      ],
      replicas: [
        {
          region: 'us-east-2',
          readCapacity: Capacity.autoscaled({ minCapacity: 5, maxCapacity: 25 }),
          globalSecondaryIndexOptions: {
            gsi2: {
              contributorInsightsSpecification: {
                enabled: false,
              },
            },
          },
          tags: [{ key: 'USE2ReplicaTagKey', value: 'USE2ReplicaTagValue' }],
        },
        {
          region: 'us-west-2',
          tableClass: TableClass.STANDARD,
          contributorInsightsSpecification: {
            enabled: false,
          },
          globalSecondaryIndexOptions: {
            gsi1: {
              readCapacity: Capacity.fixed(15),
            },
          },
          tags: [{ key: 'USW2ReplicaTagKey', value: 'USW2ReplicaTagValue' }],
        },
      ],
      tags: [{ key: 'primaryTableTagKey', value: 'primaryTableTagValue' }],
    });

    Tags.of(globalTable).add('tagAspectKey', 'tagAspectValue');
  }
}

const app = new App();
Tags.of(app).add('stage', 'IntegTest');
new IntegTest(app, 'aws-cdk-global-table-integ', {
  testCases: [new TestStack(app, 'aws-cdk-global-table', { env: { region: 'us-east-1' } })],
  regions: ['us-east-1'],
  stackUpdateWorkflow: false,
});
