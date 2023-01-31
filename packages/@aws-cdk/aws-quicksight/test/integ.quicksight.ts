import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import { Stack, App } from '@aws-cdk/core';
//import * as cr from '@aws-cdk/custom-resources';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import { QuickSight } from 'aws-sdk';
import { Analysis, Dashboard, DataSet, DataSource, IAnalysis, IDashboard, IDataSet, IDataSource, ITemplate, ITheme, Template, Theme } from '../lib';

const quickSight: QuickSight = new QuickSight;

const app = new App();

const stack = new Stack(app, 'aws-cdk-quicksight-1');

// SIGN UP FOR QUICKSIGHT

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

// CREATE RESOURCES REQUIRED TO CREATE DATA SOURCE

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

// GET RESOURCE IDS

let dataSourceId: string = '';
let dataSetId: string = '';
let templateId: string = '';
let analysisId: string = '';
let dashboardId: string = '';
let themeId: string = '';

quickSight.listDataSources({
  AwsAccountId: Stack.of(stack).account,
},
function (err, data) {
  if (!err && data.DataSources?.[0].DataSourceId) {
    dataSourceId = data.DataSources[0].DataSourceId;
  }
});

quickSight.listDataSets({
  AwsAccountId: Stack.of(stack).account,
},
function (err, data) {
  if (!err && data.DataSetSummaries?.[0].DataSetId) {
    dataSetId = data.DataSetSummaries[0].DataSetId;
  }
});

quickSight.listTemplates({
  AwsAccountId: Stack.of(stack).account,
},
function (err, data) {
  if (!err && data.TemplateSummaryList?.[0].TemplateId) {
    templateId = data.TemplateSummaryList[0].TemplateId;
  }
});

quickSight.listAnalyses({
  AwsAccountId: Stack.of(stack).account,
},
function (err, data) {
  if (!err && data.AnalysisSummaryList?.[0].AnalysisId) {
    dataSourceId = data.AnalysisSummaryList?.[0].AnalysisId;
  }
});

quickSight.listDashboards({
  AwsAccountId: Stack.of(stack).account,
},
function (err, data) {
  if (!err && data.DashboardSummaryList?.[0].DashboardId) {
    dashboardId = data.DashboardSummaryList[0].DashboardId;
  }
});

quickSight.listThemes({
  AwsAccountId: Stack.of(stack).account,
},
function (err, data) {
  if (!err && data.ThemeSummaryList?.[0].ThemeId) {
    themeId = data.ThemeSummaryList[0].ThemeId;
  }
});

// IMPORT RESOURCES

const importedDataSource: IDataSource = DataSource.fromId(stack, 'ImportedDataSource', dataSourceId);
const importedDataSet: IDataSet = DataSet.fromId(stack, 'ImportedDataSet', dataSetId);
const importedTemplate: ITemplate = Template.fromId(stack, 'ImportedTemplate', templateId);
const importedAnalysis: IAnalysis = Analysis.fromId(stack, 'ImportedAnalysis', analysisId);
const importedDashboard: IDashboard = Dashboard.fromId(stack, 'ImportedDashboard', dashboardId);
const importedTheme: ITheme = Theme.fromId(stack, 'ImportedTheme', themeId);

global.console.log('IMPORTED ANALYSIS: ' + importedAnalysis);

// CREATE RESOURCES FROM IMPORTED RESOURCES

const template: Template = new Template(stack, 'TestTemplate', {
  resourceId: 'TestId',
  templateName: 'TestName',
  sourceAnalysis: importedAnalysis,
});

const analysis: Analysis = new Analysis(stack, 'TestAnalysis', {
  resourceId: 'TestId',
  analysisName: 'TestName',
  sourceTemplate: importedTemplate,
});

const dashboard: Dashboard = new Dashboard(stack, 'TestDashboard', {
  resourceId: 'TestId',
  dashboardName: 'TestName',
  sourceTemplate: importedTemplate,
  versionDescription: 'VersionDescription',
});

const theme: Theme = new Theme(stack, 'TestTheme', {
  resourceId: 'TestId',
  themeName: 'TestName',
  baseTheme: importedTheme,
  versionDescription: 'VersionDescription',
});

// CREATE RESOURCES WITH NEW RESOURCES

const dataSource: DataSource = new DataSource(stack, 'TestDataSource', {
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

// const dataSet: DataSet = new DataSet(stack, 'TestDataSet', {
//   resourceId: 'TestId',
//   dataSetName: 'TestName',
// });

// RUN TESTS
const integ = new IntegTest(app, 'QuickSightTest', {
  testCases: [stack],
});

integ.node.addDependency(importedDataSource);
integ.node.addDependency(importedDataSet);
integ.node.addDependency(importedTemplate);
integ.node.addDependency(importedAnalysis);
integ.node.addDependency(importedDashboard);
integ.node.addDependency(importedTheme);

integ.node.addDependency(dataSource);
integ.node.addDependency(template);
integ.node.addDependency(analysis);
integ.node.addDependency(dashboard);
integ.node.addDependency(theme);

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