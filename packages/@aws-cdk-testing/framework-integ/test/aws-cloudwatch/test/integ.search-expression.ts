import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

class SearchExpressionStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const minimalSearchExpression = new cloudwatch.SearchExpression({
      expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
    });

    const customSearchExpression = new cloudwatch.SearchExpression({
      expression: "SEARCH('{AWS/Lambda,FunctionName} Duration', 'Average', 300)",
      label: 'Custom Lambda Duration',
      color: '#e377c2',
      period: cdk.Duration.minutes(10),
      searchAccount: '123456789012',
      searchRegion: 'us-west-2',
    });

    const crossAccountRegionSearchExpression = new cloudwatch.SearchExpression({
      expression: "SEARCH('{AWS/S3,BucketName} BucketSizeBytes', 'Average', 86400)",
      label: 'Cross-Account Cross-Region S3',
      color: '#9467bd',
      period: cdk.Duration.hours(1),
      searchAccount: '123456789012',
      searchRegion: 'ap-southeast-1',
    });

    const dashboard = new cloudwatch.Dashboard(this, 'SearchExpressionDashboard', {
      dashboardName: 'SearchExpressionTestDashboard',
    });

    const searchExpressionWidget = new cloudwatch.GraphWidget({
      title: 'Minimal vs Custom Properties',
      width: 24,
      height: 6,
      left: [minimalSearchExpression],
      right: [customSearchExpression, crossAccountRegionSearchExpression],
    });

    dashboard.addWidgets(searchExpressionWidget);
  }
}

const app = new cdk.App();

new IntegTest(app, 'SearchExpressionIntegTest', {
  testCases: [new SearchExpressionStack(app, 'SearchExpressionStack')],
});
