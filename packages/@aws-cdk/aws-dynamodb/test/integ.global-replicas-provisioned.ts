import * as cdk from '@aws-cdk/core';
import * as dynamodb from '../lib';

const app = new cdk.App();
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

app.synth();
