import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';

/**
 * Notes on how to run this integ test
 * (All regions are flexible, my testing used account A with af-south-1 not enabled)
 * Replace 123456789012 and 234567890123 with your own account numbers
 *
 * 1. Configure Accounts
 *   a. Account A (123456789012) should be bootstrapped for us-east-1
 *      and needs to set trust permissions for account B (234567890123)
 *      - `cdk bootstrap --trust 234567890123 --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess'`
 *      - assuming this is the default profile for aws credentials
 *   b. Account B (234567890123) should be bootstrapped for us-east-1 and af-south-1
 *     - note Account B needs to have af-south-1 enabled as it is an opt-in region
 *     - assuming this account is configured with the profile 'cross-account' for aws credentials
 *
 * 2. Set environment variables
 *   a. `export CDK_INTEG_ACCOUNT=123456789012`
 *   b. `export CDK_INTEG_CROSS_ACCOUNT=234567890123`
 *
 * 3. Run the integ test (from the @aws-cdk-testing/framework-integ/test directory)
 *   a. Get temporary console access credentials for account B
 *     - `yarn integ custom-resources/test/aws-custom-resource/integ.cross-account-assumeRole.js`
 *   b. Fall back if temp credentials do not work (account info may be in snapshot)
 *     - `yarn integ custom-resources/test/aws-custom-resource/integ.cross-account-assumeRole.js --profiles cross-account`
 */

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const account = process.env.CDK_INTEG_ACCOUNT || '123456789012';

// As the integ-runner doesnt provide a default cross account, we make our own.
const crossAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '234567890123';

const roleStack = new cdk.Stack(app, 'role-stack', {
  env: {
    account: account, // this account should not the af-south-1 region enabled
    region: 'us-east-1',
  },
});

const crossAccountStack = new cdk.Stack(app, 'cross-account-stack', {
  env: {
    account: crossAccount,
    region: 'us-east-1',
  },
});

const crossAccountOptInStack = new cdk.Stack(app, 'cross-account-opt-in-stack', {
  env: {
    account: crossAccount,
    region: 'af-south-1', // this account must have Cape Town (af-south-1 region) enabled
  },
});

const roleName = 'MyUniqueRole';

new iam.Role(roleStack, 'AssumeThisRole', {
  roleName: roleName,
  assumedBy: new iam.AccountPrincipal(crossAccount),
});

const assumedRoleArn = cdk.Stack.of(crossAccountStack).formatArn({
  region: '',
  service: 'iam',
  account: account,
  resource: 'role',
  resourceName: roleName,
});

new AwsCustomResource(crossAccountStack, 'CrossAccountCR', {
  installLatestAwsSdk: false,
  onCreate: {
    assumedRoleArn: assumedRoleArn,
    service: '@aws-sdk/client-sts',
    action: 'GetCallerIdentityCommand',
    physicalResourceId: PhysicalResourceId.of('id'),
  },
  policy: AwsCustomResourcePolicy.fromStatements([iam.PolicyStatement.fromJson({
    Effect: 'Allow',
    Action: 'sts:AssumeRole',
    Resource: assumedRoleArn,
  })]),
});

new AwsCustomResource(crossAccountOptInStack, 'OptInCR', {
  installLatestAwsSdk: false,
  onCreate: {
    assumedRoleArn: assumedRoleArn,
    region: 'us-west-1', // could use us-east-1, but using different region for coverage
    service: '@aws-sdk/client-sts',
    action: 'GetCallerIdentityCommand',
    physicalResourceId: PhysicalResourceId.of('id'),
  },
  policy: AwsCustomResourcePolicy.fromStatements([iam.PolicyStatement.fromJson({
    Effect: 'Allow',
    Action: 'sts:AssumeRole',
    Resource: assumedRoleArn,
  })]),
});

crossAccountStack.addDependency(roleStack);
crossAccountOptInStack.addDependency(roleStack);

new IntegTest(app, 'CrossAccountCRTest', {
  testCases: [crossAccountStack, crossAccountOptInStack],
});
