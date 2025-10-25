import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class MTDistributionMetricsTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const distribution = new cloudfront.MTDistribution(this, 'Dist', {
      defaultBehavior: { origin: new TestOrigin('www.example.com') },
      publishAdditionalMetrics: true,
    });

    const createAlarm = (alarmName: string, metric: cloudwatch.Metric) => {
      return new cloudwatch.Alarm(this, alarmName, {
        evaluationPeriods: 1,
        threshold: 1,
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
        metric: metric,
      });
    };

    createAlarm('Alarm1', distribution.metricOriginLatency());
    createAlarm('Alarm2', distribution.metricCacheHitRate());
    createAlarm('Alarm3', distribution.metric401ErrorRate());
    createAlarm('Alarm4', distribution.metric403ErrorRate());
    createAlarm('Alarm5', distribution.metric404ErrorRate());
    createAlarm('Alarm6', distribution.metric502ErrorRate());
    createAlarm('Alarm7', distribution.metric503ErrorRate());
    createAlarm('Alarm8', distribution.metric504ErrorRate());
  }
}

const app = new cdk.App();
const stack = new MTDistributionMetricsTestStack(app, 'integ-mt-distribution-additional-metrics');

new IntegTest(app, 'integ-mt-distribution-additional-metrics-test', {
  testCases: [stack],
});
