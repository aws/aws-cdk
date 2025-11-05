import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

export class TestStack extends Stack {
  readonly table: dynamodb.Table;
  readonly tableTwo: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const doc = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: ['dynamodb:*'],
          principals: [new iam.AccountRootPrincipal()],
          resources: ['*'],
        }),
      ],
    });

    this.table = new dynamodb.Table(this, 'TableTest1', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      resourcePolicy: doc,
    });

    this.tableTwo = new dynamodb.Table(this, 'TableTest2', {
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // IMPORTANT: Cross-account grants with auto-generated table names create circular dependencies
    //
    // WHY NOT this.tableTwo.grantReadData(new iam.AccountPrincipal('123456789012'))?
    // - Cross-account principals cannot have policies attached to them
    // - Grant falls back to adding a resource policy to the table
    // - Resource policy tries to reference this.tableArn (the table's own ARN)
    // - This creates a circular dependency: Table → ResourcePolicy → Table ARN → Table
    // - CloudFormation fails with "Circular dependency between resources"
    //
    // SOLUTIONS:
    // 1. Use addToResourcePolicy with wildcard resources (this approach)
    // 2. Use explicit table names: tableName: 'my-table-name' (enables scoped resources)
    // 3. Use same-account principals (grants go to principal policy, not resource policy)
    //
    this.tableTwo.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:*'],
      // we need a valid account for cross-account principal otherwise it won't deploy
      // this account is from fact-table.ts
      principals: [new iam.AccountPrincipal('127311923021')],
      resources: ['*'], // Wildcard avoids circular dependency - same pattern as KMS
    }));
  }
}

const app = new App();
const stack = new TestStack(app, 'resource-policy-stack', {});

new IntegTest(app, 'resource-policy-integ-test', {
  testCases: [stack],
});
