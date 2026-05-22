import type { StackProps } from 'aws-cdk-lib';
import { App, Stack, Tags } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

class DashboardTaggingIntegrationTest extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const dashboard = new cloudwatch.Dashboard(this, 'Dash', {
      dashboardName: 'TaggedDashboard',
    });

    Tags.of(dashboard).add('Environment', 'IntegTest');
    Tags.of(dashboard).add('Team', 'CloudWatchDashboards');

    dashboard.addWidgets(new cloudwatch.TextWidget({
      markdown: 'Dashboard with tags',
    }));
  }
}

const app = new App();
new IntegTest(app, 'cdk-integ-dashboard-with-tags', {
  testCases: [new DashboardTaggingIntegrationTest(app, 'DashboardTaggingIntegrationTest')],
});
