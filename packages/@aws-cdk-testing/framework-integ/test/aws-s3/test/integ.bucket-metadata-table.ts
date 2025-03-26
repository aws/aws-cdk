import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-s3-metadata-table');

// Create destination bucket for metadata table
const destinationBucket = new s3.Bucket(stack, 'DestinationBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

// Create source bucket with metadata table configuration
new s3.Bucket(stack, 'SourceBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  metadataTable: {
    destination: destinationBucket,
    tableName: 'test-metadata-table',
  },
});

new IntegTest(app, 'cdk-integ-bucket-metadata-table', {
  testCases: [stack],
});
