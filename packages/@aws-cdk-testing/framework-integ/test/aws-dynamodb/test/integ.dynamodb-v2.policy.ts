import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // table with resource policy
    const table = new dynamodb.TableV2(this, 'TableTestV2-1', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    table.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:*'],
      principals: [new iam.AccountRootPrincipal()],
      resources: ['*'],
    }));

    // table with resource policy
    const tableTwo = new dynamodb.TableV2(this, 'TableTestV2-2', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    tableTwo.grantReadData(new iam.AccountRootPrincipal());
  }
}

const app = new App();
const stack = new TestStack(app, 'resource-policy-stack-v2', {});

new IntegTest(app, 'table-v2-policy', {
  testCases: [stack],
});