import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';

const app = new cdk.App();

const account = process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;

// As the integ-runner doesnt provide a default cross account, we make our own.
const crossAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '987654321';

const roleStack = new cdk.Stack(app, 'role-stack', {
  env: {
    account: account, // this account should not have opt-in regions enabled
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
    region: 'af-south-1', // this account must have Cape Town (af-south-1) enabled
  },
});

const roleName = 'MyUniqueRole';

new iam.Role(roleStack, 'AssumeThisRole', {
  roleName: roleName,
  assumedBy: new iam.AccountPrincipal('339304370841'),
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
    service: 'STS',
    action: 'getCallerIdentity',
    physicalResourceId: PhysicalResourceId.of('123456'),
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
    service: 'STS',
    action: 'getCallerIdentity',
    physicalResourceId: PhysicalResourceId.of('1234567'),
  },
  policy: AwsCustomResourcePolicy.fromStatements([iam.PolicyStatement.fromJson({
    Effect: 'Allow',
    Action: 'sts:AssumeRole',
    Resource: assumedRoleArn,
  })]),
});

crossAccountStack.addDependency(roleStack);
crossAccountOptInStack.addDependency(roleStack);

new IntegTest(app, 'CfnMappingFindInMapTest', {
  testCases: [crossAccountStack, crossAccountOptInStack],
});

// TODO: add event verification of the region where the call is made
// should be us-east-1 for crossAccountStack
// us-west-1 for crossAccountOptInStack