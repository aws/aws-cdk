import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'ParentStack');

const nested = new cdk.NestedStack(stack, 'NestedSuppressIndentation', {
  suppressTemplateIndentation: true,
});
new s3.Bucket(nested, 'Bucket'); // dummy

const testCase = new integ.IntegTest(app, 'NestedSuppressIndentationTest', {
  testCases: [stack],
});

const nestedChild = nested.node.defaultChild as cdk.CfnStack;
const nestedTemplateUrl = nestedChild.templateUrl!; // Nested stacks must have the templateUrl

const apiCall = testCase.assertions.awsApiCall('S3', 'getObject', {
  Bucket: cdk.Fn.select(3, cdk.Fn.split('/', nestedTemplateUrl)),
  Key: cdk.Fn.select(4, cdk.Fn.split('/', nestedTemplateUrl)),
});

apiCall.expect(
  integ.ExpectedResult.objectLike({
    Body: '{"Resources":{"Bucket83908E77":{"Type":"AWS::S3::Bucket","UpdateReplacePolicy":"Retain","DeletionPolicy":"Retain"}}}',
  }),
);
