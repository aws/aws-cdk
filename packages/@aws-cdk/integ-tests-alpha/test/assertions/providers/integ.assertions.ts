import { App, CfnResource, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '../../../lib';

const app = new App();
const stack = new Stack(app, 'Assertions');

const ssmParameter = new CfnResource(stack, 'Utf8Parameter', {
  type: 'AWS::SSM::Parameter',
  properties: {
    Type: 'String',
    Value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ!"#¤%&/()=?`´^*+~_-.,:;<>|',
  },
});

const queue = new CfnResource(stack, 'Queue', {
  type: 'AWS::SQS::Queue',
  properties: {},
});

const integ = new IntegTest(app, 'AssertionsTest', {
  testCases: [stack],
});

const firstAssertion = integ.assertions.awsApiCall('SSM', 'getParameter', {
  Name: ssmParameter.ref,
  WithDecryption: true,
}).expect(
  ExpectedResult.objectLike({
    Parameter: {
      Type: 'String',
      Value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ!"#¤%&/()=?`´^*+~_-.,:;<>|',
    },
  }),
);

const secondAssertion = integ.assertions.awsApiCall('SSM', 'getParameter', {
  Name: ssmParameter.ref,
  WithDecryption: true,
}).expect(
  ExpectedResult.objectLike({
    Parameter: {
      Type: 'String',
      Value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ!"#¤%&/()=?`´^*+~_-.,:;<>|',
    },
  }),
);

const metricAssertion = integ.assertions.awsApiCall('CloudWatch', 'getMetricData', {
  MetricDataQueries: [
    {
      Id: 'id1',
      MetricStat: {
        Metric: {
          Namespace: 'AWS/SQS',
          MetricName: 'NumberOfMessagesReceived',
          Dimensions: [
            {
              Name: 'QueueName',
              Value: queue.getAtt('QueueName').toString(),
            },
          ],
        },
        Period: 60,
        Stat: 'Sum',
      },
      ReturnData: true,
    },
  ],
  StartTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
  EndTime: new Date(),
});
metricAssertion.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['cloudwatch:GetMetricData'],
  Resource: ['*'],
});

firstAssertion.next(secondAssertion.next(metricAssertion));
