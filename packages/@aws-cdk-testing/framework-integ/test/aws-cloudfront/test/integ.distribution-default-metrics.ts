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

    createAlarm('Alarm1', distribution.metricRequests());
    createAlarm('Alarm2', distribution.metricBytesUploaded());
    createAlarm('Alarm3', distribution.metricBytesDownloaded());
    createAlarm('Alarm4', distribution.metric4xxErrorRate());
    createAlarm('Alarm5', distribution.metric5xxErrorRate());
    createAlarm('Alarm6', distribution.metricTotalErrorRate());
  }
}

const app = new cdk.App();
const stack = new DistributionMetricsTestStack(app, 'MyTestStack');

new IntegTest(app, 'MyTest', {
  testCases: [stack],
});
