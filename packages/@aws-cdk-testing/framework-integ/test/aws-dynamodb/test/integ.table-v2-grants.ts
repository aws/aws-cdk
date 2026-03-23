import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AttributeType, TableV2, TableEncryptionV2 } from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'TableV2GrantsStack');

const table = new TableV2(stack, 'Table', {
  partitionKey: { name: 'pk', type: AttributeType.STRING },
  encryption: TableEncryptionV2.awsManagedKey(),
  removalPolicy: RemovalPolicy.DESTROY,
});

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

table.grantReadData(role);

new IntegTest(app, 'TableV2GrantsInteg', {
  testCases: [stack],
});
