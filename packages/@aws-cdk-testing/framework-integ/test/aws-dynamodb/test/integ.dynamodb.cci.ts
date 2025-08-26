import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new dynamodb.Table(this, 'TableV2', {
      partitionKey: { name: 'hashKey', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sortKey', type: dynamodb.AttributeType.NUMBER },
      contributorInsightsSpecification: {
        enabled: true,
        mode: dynamodb.ContributorInsightsMode.ACCESSED_AND_THROTTLED_KEYS,
      },
    });
  }
}

const stack = new TestStack(app, 'CCI-Integ-Test-TableV1', { env: { region: 'eu-west-1' } });

new IntegTest(app, 'table-v1-CCI-test', {
  testCases: [stack],
});
