import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

export class TestStack extends Stack {
  readonly table: Table;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new Table(this, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      deletionProtection: true,
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: 'deletion-protection-test',
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'deletion-protection-stack', {
  env: {
    region: 'us-east-1',
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  },
});

new IntegTest(app, 'deletion-protection-integ-test', {
  testCases: [stack],
  regions: ['us-east-1'],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
  hooks: {
    postDeploy: [
      'aws dynamodb update-table --no-cli-pager --region us-east-1 --table-name deletion-protection-test --no-deletion-protection-enabled',
    ],
  },
});

app.synth();
