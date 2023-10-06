import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { TextWidgetBackground } from 'aws-cdk-lib/aws-cloudwatch';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'DashboardIntegrationTestStack');

const dashboard = new cloudwatch.Dashboard(stack, 'Dash', {
  defaultInterval: cdk.Duration.days(7),
});

dashboard.addWidgets(new cloudwatch.TextWidget({
  markdown: 'I don\'t have a background',
  background: TextWidgetBackground.TRANSPARENT,
}));

new cdk.CfnOutput(stack, 'DashboardArn', {
  value: dashboard.dashboardArn,
});

new integ.IntegTest(app, 'DashboardIntegrationTest', {
  testCases: [stack],
});
