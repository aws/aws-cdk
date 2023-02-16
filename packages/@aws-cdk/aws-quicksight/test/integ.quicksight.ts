import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import { Stack, App } from '@aws-cdk/core';
//import * as cr from '@aws-cdk/custom-resources';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import { QuickSight } from 'aws-sdk';
// import { Analysis, Dashboard, DataSet, DataSource, IAnalysis, IDashboard, IDataSet, IDataSource, ITemplate, ITheme, Template, Theme } from '../lib';
import { Analysis, DataSource, IAnalysis } from '../lib';


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


const quickSight: QuickSight = new QuickSight({ region: 'us-west-2' }); // TODO switch back to us-east-1 or something

const app = new App();

const stack = new Stack(app, 'aws-cdk-quicksight-1', {
  env: {
    account: '732958832353', // TODO fix this to get the account and region from aws-sdk
    region: 'us-west-2',
  },
});

const integ = new IntegTest(app, 'QuickSightTest', {
  testCases: [stack],
});

async function main() {
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

  // let dataSourceId: string;
  // let dataSetId: string;
  // let templateId: string;
  let analysisId: string;
  // let dashboardId: string;
  // let themeId: string;

  // let importedDataSource: IDataSource;
  // let importedDataSet: IDataSet;
  // let importedTemplate: ITemplate;
  let importedAnalysis: IAnalysis;
  // let importedDashboard: IDashboard;
  // let importedTheme: ITheme;

  // //let template: Template;
  // let analysis: Analysis;
  // let dashboard: Dashboard;
  // let theme: Theme;
  let dataSource: DataSource;

  // const listDataSourceResponse = await quickSight.listDataSources({
  //   AwsAccountId: Stack.of(stack).account,
  // }).promise();

  // if (listDataSourceResponse.DataSources?.[0]?.DataSourceId) {
  //   dataSourceId = listDataSourceResponse.DataSources?.[0].DataSourceId;
  // } else {
  //   throw Error('No dataSource found');
  // }

  // const listDataSetsResponse = await quickSight.listDataSets({
  //   AwsAccountId: Stack.of(stack).account,
  // }).promise();

  // if (listDataSetsResponse.DataSetSummaries?.[0]?.DataSetId) {
  //   dataSetId = listDataSetsResponse.DataSetSummaries[0].DataSetId;
  // } else {
  //   throw Error('No dataSet found');
  // }

  // const listTemplatesResponse = await quickSight.listTemplates({
  //   AwsAccountId: Stack.of(stack).account,
  // }).promise();

  // if (listTemplatesResponse.TemplateSummaryList?.[0]?.TemplateId) {
  //   templateId = listTemplatesResponse.TemplateSummaryList[0].TemplateId;
  // } else {
  //   throw Error('No template found');
  // }

  const listAnalysesResponse = await quickSight.listAnalyses({
    AwsAccountId: Stack.of(stack).account,
  }).promise();

  if (listAnalysesResponse.AnalysisSummaryList?.[0]?.AnalysisId) {
    analysisId = listAnalysesResponse.AnalysisSummaryList[0].AnalysisId;
  } else {
    throw Error('No analysis found');
  }

  // const listDashboardsResponse = await quickSight.listDashboards({
  //   AwsAccountId: Stack.of(stack).account,
  // }).promise();

  // if (listDashboardsResponse.DashboardSummaryList?.[0]?.DashboardId) {
  //   dashboardId = listDashboardsResponse.DashboardSummaryList[0].DashboardId;
  // } else {
  //   throw Error('No dashboard found');
  // }

  // const listThemesResponse = await quickSight.listThemes({
  //   AwsAccountId: Stack.of(stack).account,
  // }).promise();

  // if (listThemesResponse.ThemeSummaryList?.[0]?.ThemeId) {
  //   themeId = listThemesResponse.ThemeSummaryList[0].ThemeId;
  // } else {
  //   throw Error('No theme found');
  // }

  // IMPORT RESOURCES

  // importedDataSource = DataSource.fromId(stack, 'ImportedDataSource', dataSourceId);
  // importedDataSet = DataSet.fromId(stack, 'ImportedDataSet', dataSetId);
  // importedTemplate = Template.fromId(stack, 'ImportedTemplate', templateId);
  importedAnalysis = Analysis.fromId(stack, 'ImportedAnalysis', analysisId);
  // importedDashboard = Dashboard.fromId(stack, 'ImportedDashboard', dashboardId);
  // importedTheme = Theme.fromId(stack, 'ImportedTheme', themeId);

  global.console.log('IMPORTED ANALYSIS: ' + importedAnalysis);

  // CREATE RESOURCES FROM IMPORTED RESOURCES

  // analysis = new Analysis(stack, 'TestAnalysis', {
  //   resourceId: 'TestId',
  //   analysisName: 'TestName',
  //   sourceTemplate: importedTemplate,
  // });

  // dashboard = new Dashboard(stack, 'TestDashboard', {
  //   resourceId: 'TestId',
  //   dashboardName: 'TestName',
  //   sourceTemplate: importedTemplate,
  //   versionDescription: 'VersionDescription',
  // });

  // theme = new Theme(stack, 'TestTheme', {
  //   resourceId: 'TestId',
  //   themeName: 'TestName',
  //   baseTheme: importedTheme,
  //   versionDescription: 'VersionDescription',
  // });

  // CREATE RESOURCES WITH NEW RESOURCES

  dataSource = new DataSource(stack, 'TestDataSource', {
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

  // integ.node.addDependency(importedDataSource);
  // integ.node.addDependency(importedDataSet);
  // integ.node.addDependency(importedTemplate);
  // integ.node.addDependency(importedAnalysis);
  // integ.node.addDependency(importedDashboard);
  // integ.node.addDependency(importedTheme);

  integ.node.addDependency(dataSource);
  //integ.node.addDependency(template);
  // integ.node.addDependency(analysis);
  // integ.node.addDependency(dashboard);
  // integ.node.addDependency(theme);

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
}

void main();