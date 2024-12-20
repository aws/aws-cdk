import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const producer = new cdk.Stack(app, 'Producer');

const nested = new cdk.NestedStack(producer, 'Nested');
new s3.Bucket(nested, 'RequiredResource');

const nestedString = new cdk.CfnParameter(nested, 'NestedString', {
  type: 'String',
  default: 'foo',
});

const nestedNumber = new cdk.CfnParameter(nested, 'NestedNumber', {
  type: 'Number',
  default: '123',
});

const nestedList = new cdk.CfnParameter(nested, 'NestedList', {
  type: 'CommaDelimitedList',
  default: 'foo,bar',
});

const consumer = new cdk.Stack(app, 'Consumer');
new s3.Bucket(consumer, 'RequiredResource');

new cdk.CfnOutput(consumer, 'StringReference', {
  value: nestedString.valueAsString,
});

new cdk.CfnOutput(consumer, 'NumberReference', {
  value: nestedNumber.valueAsString,
});

new cdk.CfnOutput(consumer, 'ListReference', {
  value: cdk.Fn.join('$$', nestedList.valueAsList),
});

const testCase = new integ.IntegTest(app, 'NestedStackReferences', {
  testCases: [producer, consumer],
});

const describe = testCase.assertions.awsApiCall('CloudFormation', 'describeStacks', {
  StackName: consumer.stackName,
});

describe.expect(integ.ExpectedResult.objectLike({
  Stacks: integ.Match.arrayWith([
    integ.Match.objectLike({
      Outputs: integ.Match.arrayWith([
        integ.Match.objectLike({
          OutputKey: 'NumberReference',
          OutputValue: '123',
        }),
        integ.Match.objectLike({
          OutputKey: 'StringReference',
          OutputValue: 'foo',
        }),
        integ.Match.objectLike({
          OutputKey: 'ListReference',
          OutputValue: 'foo$$bar',
        }),
      ]),
    }),
  ]),
}));
