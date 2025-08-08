import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, MultiRegionConsistency, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

class TestStack extends Stack {
  public constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new TableV2(this, 'GlobalTable', {
      tableName: 'my-global-table',
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.NUMBER },
      removalPolicy: RemovalPolicy.DESTROY,
      multiRegionConsistency: MultiRegionConsistency.STRONG,
      witnessRegion: 'us-west-2',
      replicas: [
        {
          region: 'us-east-2',
        },
      ],
    });
  }
}

const app = new App();
new IntegTest(app, 'aws-cdk-global-table-integ', {
  testCases: [new TestStack(app, 'aws-cdk-global-table-mrsc', { env: { region: 'us-east-1' } })],
  regions: ['us-east-1'],
  stackUpdateWorkflow: false,
});
