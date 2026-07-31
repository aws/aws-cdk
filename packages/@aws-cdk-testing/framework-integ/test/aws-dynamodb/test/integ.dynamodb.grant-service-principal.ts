/**
 * Integration test for DynamoDB grant methods with allowlisted service principals.
 *
 * Validates that the three known-valid service principals can be granted
 * access to DynamoDB tables via grant* methods without error, and that
 * the resulting resource policies are correctly synthesized.
 *
 * @see https://github.com/aws/aws-cdk/issues/37273
 */

import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'grant-service-principal-test-stack');

const table = new dynamodb.Table(stack, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  removalPolicy: RemovalPolicy.DESTROY,
});

table.grantReadWriteData(new iam.ServicePrincipal('redshift.amazonaws.com'));
table.grantReadWriteData(new iam.ServicePrincipal('replication.dynamodb.amazonaws.com'));
table.grantReadWriteData(new iam.ServicePrincipal('glue.amazonaws.com'));

new IntegTest(app, 'grant-service-principal-integ-test', {
  testCases: [stack],
});
