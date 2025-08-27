import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new dynamodb.TableV2(this, 'TableV2', {
      partitionKey: { name: 'hashKey', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sortKey', type: dynamodb.AttributeType.NUMBER },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'gsiHashKey', type: dynamodb.AttributeType.STRING },
        },
      ],
      contributorInsightsSpecification: {
        enabled: true,
        mode: dynamodb.ContributorInsightsMode.ACCESSED_AND_THROTTLED_KEYS,
      },
      replicas: [
        {
          region: 'eu-west-2',
          contributorInsightsSpecification: {
            enabled: false,
          },
          globalSecondaryIndexOptions: {
            gsi: {
              contributorInsightsSpecification: {
                enabled: true,
                mode: dynamodb.ContributorInsightsMode.THROTTLED_KEYS,
              },
            },
          },
        },
      ],
    });
  }
}

const stack = new TestStack(app, 'CCI-Integ-Test', { env: { region: 'eu-west-1' } });

new IntegTest(app, 'table-v2-CCI-test', {
  testCases: [stack],
});
