import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

export class TestStack extends Stack {
  readonly table: Table;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new Table(this, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      deletionProtection: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'deletion-protection-stack');

const integ = new IntegTest(app, 'deletion-protection-integ-test', {
  testCases: [stack],
  regions: ['us-east-1'],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});

// Disable deletion protection after deploy so the table can be cleaned up on destroy
integ.assertions.awsApiCall('DynamoDB', 'updateTable', {
  TableName: stack.table.tableName,
  DeletionProtectionEnabled: false,
});

app.synth();
