/// !cdk-integ *
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
    '@aws-cdk/aws-dynamodb:retainTableReplica': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-dynamodb-global-replicas-provisioned');

const table = new dynamodb.Table(stack, 'Table', {
  partitionKey: { name: 'hashKey', type: dynamodb.AttributeType.STRING },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  replicationRegions: ['us-east-2', 'eu-west-3'],
  billingMode: dynamodb.BillingMode.PROVISIONED,
});

table.autoScaleWriteCapacity({
  minCapacity: 5,
  maxCapacity: 10,
}).scaleOnUtilization({ targetUtilizationPercent: 75 });

new IntegTest(app, 'aws-cdk-dynamodb-global-replicas-provisioned-test', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
