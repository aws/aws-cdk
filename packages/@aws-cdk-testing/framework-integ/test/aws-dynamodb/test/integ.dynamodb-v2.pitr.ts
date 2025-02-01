import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new dynamodb.TableV2(this, 'TableTestV2', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
        recoveryPeriodInDays: 10,
      },
      replicas: [{
        region: 'eu-west-2',
        pointInTimeRecoverySpecification: {
          pointInTimeRecoveryEnabled: true,
          recoveryPeriodInDays: 5,
        },
      }],
    });
  }
}

const stack = new TestStack(app, 'PITR-Integ-Test', { env: { region: 'eu-west-1' } });

new IntegTest(app, 'table-v2-pitr-test', {
  testCases: [stack],
});
