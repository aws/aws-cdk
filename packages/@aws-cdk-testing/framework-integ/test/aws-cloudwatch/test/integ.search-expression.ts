import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

const app = new App();

const stack = new Stack(app, 'SearchExpressionStack');

// SearchExpression with minimal properties (defaults)
const minimalSearchExpression = new cloudwatch.SearchExpression({
  expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
});

// SearchExpression with all custom properties
const customSearchExpression = new cloudwatch.SearchExpression({
  expression: "SEARCH('{AWS/Lambda,FunctionName} Duration', 'Average', 300)",
  label: 'Custom Lambda Duration',
  color: '#e377c2',
  period: Duration.minutes(10),
  searchAccount: '123456789012',
  searchRegion: 'us-west-2',
});

// SearchExpression with different account ID
const crossAccountSearchExpression = new cloudwatch.SearchExpression({
  expression: "SEARCH('{AWS/RDS,DBInstanceIdentifier} CPUUtilization', 'Average', 300)",
  label: 'Cross-Account RDS',
  color: '#ff7f0e',
  period: Duration.minutes(5),
  searchAccount: '987654321098',
});

// SearchExpression with different region
const crossRegionSearchExpression = new cloudwatch.SearchExpression({
  expression: "SEARCH('{AWS/ELB,LoadBalancerName} RequestCount', 'Sum', 300)",
  label: 'Cross-Region ELB',
  color: '#2ca02c',
  period: Duration.minutes(5),
  searchRegion: 'eu-west-1',
});

// SearchExpression with both different account and region
const crossAccountRegionSearchExpression = new cloudwatch.SearchExpression({
  expression: "SEARCH('{AWS/S3,BucketName} BucketSizeBytes', 'Average', 86400)",
  label: 'Cross-Account Cross-Region S3',
  color: '#9467bd',
  period: Duration.hours(1),
  searchAccount: '555666777888',
  searchRegion: 'ap-southeast-1',
});

// Create dashboard
const dashboard = new cloudwatch.Dashboard(stack, 'SearchExpressionDashboard', {
  dashboardName: 'SearchExpressionTestDashboard',
});

// Widget 1: Minimal vs Custom properties
const propertiesWidget = new cloudwatch.GraphWidget({
  title: 'Minimal vs Custom Properties',
  width: 24,
  height: 6,
  left: [minimalSearchExpression],
  right: [customSearchExpression],
});

// Widget 2: Multiple periods
const periodsWidget = new cloudwatch.GraphWidget({
  title: 'Multiple Period Configurations',
  width: 24,
  height: 6,
  left: [
    new cloudwatch.SearchExpression({
      expression: "SEARCH('{AWS/DynamoDB,TableName} ConsumedReadCapacityUnits', 'Sum', 300)",
      label: '5-minute period',
      period: Duration.minutes(5),
    }),
    new cloudwatch.SearchExpression({
      expression: "SEARCH('{AWS/SNS,TopicName} NumberOfMessagesPublished', 'Sum', 300)",
      label: '15-minute period',
      period: Duration.minutes(15),
    }),
    new cloudwatch.SearchExpression({
      expression: "SEARCH('{AWS/SQS,QueueName} ApproximateNumberOfMessages', 'Average', 300)",
      label: '1-hour period',
      period: Duration.hours(1),
    }),
  ],
});

// Widget 3: Cross-account and cross-region SearchExpressions
const crossAccountRegionWidget = new cloudwatch.GraphWidget({
  title: 'Cross-Account and Cross-Region SearchExpressions',
  width: 24,
  height: 8,
  left: [crossAccountSearchExpression, crossRegionSearchExpression],
  right: [crossAccountRegionSearchExpression],
});

// Add widgets to dashboard
dashboard.addWidgets(propertiesWidget);
dashboard.addWidgets(periodsWidget);
dashboard.addWidgets(crossAccountRegionWidget);

new IntegTest(app, 'SearchExpressionIntegTest', {
  testCases: [stack],
  diffAssets: true,
  stackUpdateWorkflow: true,
});
