import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Billing, Capacity, GlobalTable, TableClass, TableEncryptionV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

class TestStack extends Stack {
  public constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new GlobalTable(this, 'GlobalTable', {
      tableName: 'my-global-table',
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.NUMBER },
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(10),
        writeCapacity: Capacity.autoscaled({ maxCapacity: 20, targetUtilizationPercent: 60 }),
      }),
      encryption: TableEncryptionV2.awsManagedKey(),
      contributorInsights: true,
      pointInTimeRecovery: true,
      tableClass: TableClass.STANDARD_INFREQUENT_ACCESS,
      timeToLiveAttribute: 'attr',
      removalPolicy: RemovalPolicy.DESTROY,
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
              contributorInsights: false,
            },
          },
        },
        {
          region: 'us-west-2',
          tableClass: TableClass.STANDARD,
          contributorInsights: false,
          globalSecondaryIndexOptions: {
            gsi1: {
              readCapacity: Capacity.fixed(15),
            },
          },
        },
      ],
    });
  }
}

const app = new App();
new IntegTest(app, 'aws-cdk-global-table-integ', {
  testCases: [new TestStack(app, 'aws-cdk-global-table', { env: { region: 'us-east-1' } })],
});
