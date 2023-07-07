import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Dashboard, Metric, Stats, GraphWidget, SearchDashboardVariable, VariableInputType, VariableType } from 'aws-cdk-lib/aws-cloudwatch';

class DashboardVariablesIntegrationTest extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const dashboard = new Dashboard(this, 'Dash');

    const widget = new GraphWidget({
      title: 'My fancy graph',
      left: [
        new Metric({
          namespace: 'AWS/S3',
          metricName: 'BucketSizeBytes',
          label: '[BucketName: ${PROP(\'Dim.BucketName\')}] BucketSizeBytes',
          statistic: Stats.MAXIMUM,
          dimensionsMap: { StorageType: 'StandardStorage', BucketName: 'my-bucket' },
        }),
      ],
    });

    // The dashboard variable which changes BucketName property on the dashboard
    dashboard.addVariable(new SearchDashboardVariable({
      defaultValue: '__FIRST',
      id: 'BucketName',
      label: 'BucketName',
      inputType: VariableInputType.SELECT,
      type: VariableType.PROPERTY,
      value: 'BucketName',
      searchExpression: '{AWS/S3,BucketName,StorageType} MetricName=\"BucketSizeBytes\"',
      populateFrom: 'BucketName',
      visible: true,
    }));

    dashboard.addWidgets(widget);
  }
}

const app = new App();
new IntegTest(app, 'cdk-integ-dashboard-with-variables', {
  testCases: [new DashboardVariablesIntegrationTest(app, 'DashboardVariablesIntegrationTest')],
});
