import * as cdk from 'aws-cdk-lib';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { executionSync } from '../../../aws-stepfunctions/test/util';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

/**
 * Notes on how to run this integ test
 * Replace 123456789012 and 234567890123 with your own account numbers
 *
 * 1. Configure Accounts
 *   a. Account A (123456789012) should be bootstrapped for us-east-1
 *     - assuming this account is configured with the profile 'account-a' for aws credentials
 *   b. Account B (234567890123) should be bootstrapped for us-east-2
 *     - `cdk bootstrap --trust 123456789012 --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess' 'aws://234567890123/us-east-2'`
 *     - assuming this is the default profile for aws credentials
 *
 * 2. Set environment variables
 *   a. `export CDK_INTEG_ACCOUNT=123456789012`
 *   b. `export CDK_INTEG_CROSS_ACCOUNT=234567890123`
 *
 * 3. Run the integ test (from the @aws-cdk-testing/framework-integ/test directory)
 *   a. Get temporary console access credentials for account A
 *     - `yarn integ aws-stepfunctions-tasks/test/lambda/integ.call-aws-service-cross-region-cross-account.js`
 *   b. Fall back if temp credentials do not work (account info may be in snapshot)
 *     - `yarn integ aws-stepfunctions-tasks/test/lambda/integ.call-aws-service-cross-region-cross-account.js --profile account-a`
 *
 * 4. Before you commit, set both accounts to dummy values, run integ test in dry run mode, and then push the snapshot.
 */

const account = process.env.CDK_INTEG_ACCOUNT || '123456789012';
const crossAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '234567890123';

class ApiCalleeStack extends Stack {
  public readonly role: iam.IRole;
  public readonly table: dynamodb.ITable;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.role = new iam.Role(this, 'Role', {
      roleName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      assumedBy: new iam.AccountPrincipal(account),
    });

    this.table = new dynamodb.Table(this, 'Table', {
      tableName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.table.grantReadData(this.role);
  }
}

interface StateMachineStackProps extends StackProps {
  role: iam.IRole;
  table: dynamodb.ITable;
}

class StateMachineStack extends Stack {
  public readonly stateMachine: sfn.IStateMachine;
  constructor(scope: Construct, id: string, props: StateMachineStackProps) {
    super(scope, id, props);

    const task = new tasks.CallAwsServiceCrossRegion(this, 'DescribeTable', {
      service: 'dynamodb',
      action: 'describeTable',
      parameters: {
        TableName: props.table.tableName,
      },
      region: 'us-east-2',
      iamResources: ['*'],
      awsSdkCredentials: {
        role: sfn.TaskRole.fromRole(props.role),
      },
      outputPath: '$.Table.TableName',
    });

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      stateMachineName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      definitionBody: sfn.DefinitionBody.fromChainable(task),
    });
  }
}

const app = new App();

const apiCalleeStack = new ApiCalleeStack(app, 'ApiCalleeStack', {
  env: { account: crossAccount, region: 'us-east-2' },
});

const stateMachineStack = new StateMachineStack(app, 'StateMachineStack', {
  env: { account, region: 'us-east-1' },
  role: apiCalleeStack.role,
  table: apiCalleeStack.table,
});

const testCase = new integ.IntegTest(app, 'CallAwsServiceCrossRegionCrossAccountInteg', {
  testCases: [apiCalleeStack, stateMachineStack],
});

const result = executionSync(testCase, stateMachineStack.stateMachine, { });

result.expect(integ.ExpectedResult.objectLike({
  status: 'SUCCEEDED',
  output: `\"${apiCalleeStack.table.tableName}\"`,
})).waitForAssertions({
  interval: cdk.Duration.seconds(10),
  totalTimeout: cdk.Duration.minutes(2),
});
