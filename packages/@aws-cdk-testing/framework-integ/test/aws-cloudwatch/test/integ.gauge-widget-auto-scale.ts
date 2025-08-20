import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { CLOUDWATCH_GAUGE_WIDGET_AUTO_SCALE } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'gauge-widget-auto-scale');

// Enable the feature flag for auto-scaling behavior
stack.node.setContext(CLOUDWATCH_GAUGE_WIDGET_AUTO_SCALE, true);

const dashboard = new cloudwatch.Dashboard(stack, 'Dashboard');

const widget = new cloudwatch.GaugeWidget({
  title: 'Auto-scaling gauge widget',
  metrics: [new cloudwatch.Metric({
    namespace: 'AWS/ApplicationELB',
    metricName: 'TargetResponseTime',
    dimensionsMap: {
      LoadBalancer: 'app/my-load-balancer/50dc6c495c0c9188',
    },
    statistic: 'Average',
  })],
  // No leftYAxis specified - should auto-scale with feature flag enabled
  statistic: 'Average',
  period: cdk.Duration.minutes(5),
});

dashboard.addWidgets(widget);

new integ.IntegTest(app, 'GaugeWidgetAutoScaleTest', {
  testCases: [stack],
});
