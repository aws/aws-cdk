import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as dynamodb from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'TableV2GrantsStack', {
  env: { account: '123456789012', region: 'us-east-1' },
});

const key = new kms.Key(stack, 'TableKey', {
  enableKeyRotation: true,
});

const table = new dynamodb.TableV2(stack, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  encryption: dynamodb.TableEncryptionV2.customerManagedKey(key),
});

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

table.grantReadData(role);
table.grantWriteData(role);

new IntegTest(app, 'TableV2GrantsInteg', {
  testCases: [stack],
});

app.synth();
