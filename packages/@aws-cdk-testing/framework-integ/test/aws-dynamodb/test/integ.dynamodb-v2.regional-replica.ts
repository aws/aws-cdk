import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

class GlobalTableStack extends Stack {
  public readonly table: dynamodb.TableV2;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new dynamodb.TableV2(this, 'GlobalTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      replicas: [{ region: 'us-west-2' }],
    });
  }
}

class RegionalStack extends Stack {
  constructor(scope: Construct, id: string, table: dynamodb.ITableV2, props?: StackProps) {
    super(scope, id, props);

    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    table.grantReadData(role);
  }
}

const globalStack = new GlobalTableStack(app, 'GlobalTableStack', {
  env: { region: 'us-east-1', account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT },
});
const regionalStack = new RegionalStack(
  app,
  'RegionalStack',
  globalStack.table.regionalReplica('us-west-2'),
  {
    env: { region: 'us-west-2', account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT },
  },
);

regionalStack.addDependency(globalStack);

new IntegTest(app, 'table-v2-regional-replica-test', {
  testCases: [globalStack, regionalStack],
});
