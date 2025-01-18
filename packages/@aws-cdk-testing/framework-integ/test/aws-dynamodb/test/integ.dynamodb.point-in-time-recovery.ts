import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class TestStack extends Stack {

  readonly table: Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new Table(this, 'TableTest1', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      pointInTimeRecovery: true,
      recoveryPeriodInDays: 35,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'aws-cdk-dynamodb-point-in-time-recovery', {});

new IntegTest(app, 'Integ', { testCases: [stack] });
