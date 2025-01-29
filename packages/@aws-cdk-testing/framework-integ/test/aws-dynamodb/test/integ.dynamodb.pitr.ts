import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new dynamodb.Table(this, 'TableTest', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
        recoveryPeriodInDays: 10,
      },
    });
  }
}

const stack = new TestStack(app, 'table-pitr', { env: { region: 'eu-west-1' } });

new IntegTest(app, 'table-pitr-test', {
  testCases: [stack],
});
