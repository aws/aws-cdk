import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Billing, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

class TestStack extends Stack {
  public constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new TableV2(this, 'GlobalTableV2', {
      tableName: 'my-global-table-v2',
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.NUMBER },
      billing: Billing.onDemand({
        maxWriteRequestUnits: 10,
      }),
      removalPolicy: RemovalPolicy.DESTROY,
      replicas: [
        {
          region: 'us-east-1',
          maxReadRequestUnits: 222,
        },
      ],
      globalSecondaryIndexes: [
        {
          indexName: 'gsi2',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
          maxReadRequestUnits: 2001,
          maxWriteRequestUnits: 2001,
        },
      ],
    });
  }
}

const app = new App();
new IntegTest(app, 'aws-cdk-global-table-integ-v2', {
  testCases: [new TestStack(app, 'aws-cdk-global-table-v2', { env: { region: 'eu-west-1' } })],
  regions: ['eu-west-1'],
  stackUpdateWorkflow: false,
});
