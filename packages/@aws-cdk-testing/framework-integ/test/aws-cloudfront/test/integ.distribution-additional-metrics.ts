import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class DistributionMetricsTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // CloudFront distribution setup
    const distribution = new cloudfront.Distribution(this, 'Dist', {
      defaultBehavior: { origin: new TestOrigin('www.example.com') },
      publishAdditionalMetrics: true,
    });

    // Utility function to create alarms
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
const stack = new DistributionMetricsTestStack(app, 'MyTestStack');

new IntegTest(app, 'MyTest', {
  testCases: [stack],
});
