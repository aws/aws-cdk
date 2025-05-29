import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cr from 'aws-cdk-lib/custom-resources';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'aws-custom-resource-cloudwatch-stack');

const myAlarm = new cloudwatch.Alarm(stack, 'myAlarm', {
  metric: new cloudwatch.Metric({
    metricName: 'myMetricName',
    namespace: 'myNamespace',
  }),
  threshold: 0,
  evaluationPeriods: 1,
});

new cr.AwsCustomResource(stack, 'myCR', {
  memorySize: 1024,
  policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
    resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
  }),
  installLatestAwsSdk: true,
  onCreate: {
    service: 'CloudWatch',
    action: 'tagResource',
    parameters: {
      ResourceARN: myAlarm.alarmArn,
      Tags: [{ Key: 'Name', Value: 'prod' }],
    },
    physicalResourceId: cr.PhysicalResourceId.of('add_tag'),
  },
});

const integ = new IntegTest(app, 'aws-custom-resource-cloudwatch', {
  testCases: [stack],
});

integ.assertions.awsApiCall('CloudWatch', 'listTagsForResource', {
  ResourceARN: myAlarm.alarmArn,
}).expect(ExpectedResult.objectLike({
  Tags: Match.arrayWith([
    {
      Key: 'Name',
      Value: 'prod',
    },
  ]),
}));
