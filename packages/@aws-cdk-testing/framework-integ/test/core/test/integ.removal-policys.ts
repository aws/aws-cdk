import { App, Stack } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { RemovalPolicys } from 'aws-cdk-lib/core/lib/removal-policys';

const app = new App();
const stack = new Stack(app, 'TestStack');

// Create resources
new s3.Bucket(stack, 'TestBucket');
new dynamodb.Table(stack, 'TestTable', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
});

// Apply different removal policies to demonstrate functionality
const scope1 = new Stack(app, 'Scope1');
new s3.Bucket(scope1, 'Bucket1');
new dynamodb.Table(scope1, 'Table1', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
});
RemovalPolicys.of(scope1).destroy();

const scope2 = new Stack(app, 'Scope2');
const bucket2 = new s3.Bucket(scope2, 'Bucket2');
const table2 = new dynamodb.Table(scope2, 'Table2', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
});
RemovalPolicys.of(scope2).retain({
  applyToResourceTypes: ['AWS::S3::Bucket'],
});

const scope3 = new Stack(app, 'Scope3');
new s3.Bucket(scope3, 'Bucket3');
new dynamodb.Table(scope3, 'Table3', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
});
RemovalPolicys.of(scope3).snapshot({
  excludeResourceTypes: ['AWS::DynamoDB::Table'],
});

app.synth();
