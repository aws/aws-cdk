import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const producer = new cdk.Stack(app, 'ProducerSuppressIndentation');

const nested = new cdk.NestedStack(producer, 'NestedSuppressIndentation', { suppressTemplateIndentation: true });
new s3.Bucket(nested, 'RequiredResourceSuppressIndentation');

const nestedString = new cdk.CfnParameter(nested, 'NestedStringSuppressIndentation', {
  type: 'String',
  default: 'foo',
});

const nestedNumber = new cdk.CfnParameter(nested, 'NestedNumberSuppressIndentation', {
  type: 'Number',
  default: '123',
});

const nestedList = new cdk.CfnParameter(nested, 'NestedListSuppressIndentation', {
  type: 'CommaDelimitedList',
  default: 'foo,bar',
});

const consumer = new cdk.Stack(app, 'ConsumerSuppressIndentation');
new s3.Bucket(consumer, 'RequiredResourceSuppressIndentation');

new cdk.CfnOutput(consumer, 'StringReferenceSuppressIndentation', {
  value: nestedString.valueAsString,
});

new cdk.CfnOutput(consumer, 'NumberReferenceSuppressIndentation', {
  value: nestedNumber.valueAsString,
});

new cdk.CfnOutput(consumer, 'ListReferenceSuppressIndentation', {
  value: cdk.Fn.join('$$', nestedList.valueAsList),
});

const testCase = new integ.IntegTest(app, 'NestedStackReferencesSuppressIndentation', {
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
          OutputKey: 'StringReferenceSuppressIndentation',
          OutputValue: 'foo',
        }),
        integ.Match.objectLike({
          OutputKey: 'NumberReferenceSuppressIndentation',
          OutputValue: '123',
        }),
        integ.Match.objectLike({
          OutputKey: 'ListReferenceSuppressIndentation',
          OutputValue: 'foo$$bar',
        }),
      ]),
    }),
  ]),
}));
