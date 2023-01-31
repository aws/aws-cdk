import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import { Stack, App } from '@aws-cdk/core';
//import * as cr from '@aws-cdk/custom-resources';
import * as cr from '@aws-cdk/custom-resources';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
//import { QuickSight } from 'aws-sdk';
import { DataSource, IDataSource } from '../lib';

//const quickSight: QuickSight = new QuickSight;

const app = new App();

const stack = new Stack(app, 'aws-cdk-quicksight-1');

// Sign up for Quicksight

// CUSTOM RESOURCE METHOD
// const quickSightAccount = new cr.AwsCustomResource(stack, 'describe', {
//   onUpdate: { // will also be called for a CREATE event
//     physicalResourceId: cr.PhysicalResourceId.of(
//       'QuickSightAccount',
//     ),
//     service: 'QuickSight',
//     action: 'createAccountSubscription',
//     parameters: {
//       AccountName: 'TestQuickSight', /* required */
//       AuthenticationMethod: 'IAM_AND_QUICKSIGHT', /* required */
//       AwsAccountId: Stack.of(stack).account, /* required */
//       Edition: 'ENTERPRISE', /* required */
//       NotificationEmail: 'test@test.com', /* required */
//     },
//   },
//   onDelete: {
//     physicalResourceId: cr.PhysicalResourceId.of(
//       'QuickSightAccount',
//     ),
//     service: 'QuickSight',
//     action: 'deleteAccountSubscription',
//     parameters: {
//       AwsAccountId: Stack.of(stack).account, /* required */
//     },
//   },
//   policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
//     resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
//   }),
// });


// SDK METHOD
// let accountInfo: QuickSight.AccountInfo | undefined;

// quickSight.describeAccountSubscription({
//   AwsAccountId: Stack.of(stack).account,
// },
// function (err, data) {
//   if (!err && data.AccountInfo) {
//     accountInfo = data.AccountInfo;
//   } else if (err) {
//     throw err;
//   }
// });

// if (!accountInfo) {
//   quickSight.createAccountSubscription({
//     AccountName: 'TestQuickSight', /* required */
//     AuthenticationMethod: 'IAM_AND_QUICKSIGHT', /* required */
//     AwsAccountId: Stack.of(stack).account, /* required */
//     Edition: 'ENTERPRISE', /* required */
//     NotificationEmail: 'test@test.com', /* required */
//   },
//   function (err, data) {
//     if (err && data == data) {
//       throw err;
//     }
//   });
// }

// Create resources required to create Data Source
const bucket = new s3.Bucket(stack, 'TestBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const deployment = new s3deploy.BucketDeployment(stack, 'TestDeployment', {
  sources: [
    s3deploy.Source.data('data.csv', 'key,value\n0,1\n1,1\n2,2\n3,3\n4,5\n5,8' +
      '\n6,13\n7,21\n8,34\n9,55\n10,89\n11,144\n12,233\n13,377\n14,610\n15,987' +
      '\n16,1597\n17,2584\n18,4181\n19,6765\n'),
    s3deploy.Source.jsonData('manifest.json', {
      fileLocations: [
        {
          URIPrefixes: [
            `s3://${bucket.bucketName}/`,
          ],
        },
      ],
    }),
  ],
  destinationBucket: bucket,
  retainOnDelete: false,
});

const dataSourceId = new cr.AwsCustomResource(stack, 'DataSourceList', {
  onUpdate: {
    physicalResourceId: cr.PhysicalResourceId.of(
      'DataSourceList',
    ),
    service: 'QuickSight',
    action: 'listDataSources',
    parameters: {
      AwsAccountId: Stack.of(stack).account,
    },
  },
  policy: cr.AwsCustomResourcePolicy.fromSdkCalls({ resources: ['*'] }),
}).getResponseField('DataSources.0.DataSourceId');

// Create DataSource
const dataSource: DataSource = new DataSource(stack, 'TestDataSet', {
  resourceId: 'TestId',
  dataSourceName: 'TestName',
  type: 'S3',
  dataSourceParameters: {
    s3Parameters: {
      manifestFileLocation: {
        bucket: bucket.bucketName,
        key: 'manifest.json',
      },
    },
  },
});

dataSource.node.addDependency(deployment);
//dataSource.node.addDependency(quickSightAccount);

// ImportDataSource
const importedDataSource: IDataSource = DataSource.fromId(stack, 'ImportedDataSource', dataSourceId);

// Run tests
const integ = new IntegTest(app, 'QuickSightTest', {
  testCases: [stack],
});

integ.node.addDependency(dataSource);
integ.node.addDependency(importedDataSource);

// describe the results
const describe = integ.assertions.awsApiCall('QuickSight', 'describeDataSource', {
  AwsAccountId: Stack.of(stack).account,
  DataSourceId: dataSource.resourceId,
});

// assert the results
describe.expect(ExpectedResult.objectLike({
  DataSource: {
    DataSourceId: dataSource.resourceId,
  },
}));

// Synthesize stack
app.synth();