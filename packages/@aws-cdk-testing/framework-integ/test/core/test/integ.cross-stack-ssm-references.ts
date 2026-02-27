import * as cdk from 'aws-cdk-lib/core';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as integ from '@aws-cdk/integ-tests-alpha';

/**
 * Integration test for SSM-based cross-stack references.
 *
 * Tests that cross-stack references using SSM parameters work correctly:
 * 1. Producer stack creates an SSM parameter with the resource attribute value
 * 2. Consumer stack uses {{resolve:ssm:...}} to consume the value
 * 3. The value is correctly resolved at deploy time
 */
const app = new cdk.App();

// ---------------------------------------------------------------------------
// Test Case 1: Basic SSM cross-stack reference
// ---------------------------------------------------------------------------

const producer = new cdk.Stack(app, 'SsmRefProducer');

// Create a resource whose attribute will be shared across stacks
const param = new ssm.StringParameter(producer, 'SharedParam', {
  stringValue: 'cross-stack-test-value',
});

// Configure SSM-based cross-stack references for this resource
cdk.StackReferences.of(param).toHere([cdk.CrossStackReferenceType.SSM]);

const consumer = new cdk.Stack(app, 'SsmRefConsumer');

// Reference the parameter value from the other stack - this will use SSM.
// Use an SSM parameter to store the consumed value (creates an actual resource).
new ssm.StringParameter(consumer, 'ConsumedParam', {
  parameterName: '/integ-test/ssm-ref/consumed-value',
  stringValue: param.parameterArn,
});

// ---------------------------------------------------------------------------
// Test Case 2: MIXED mode (both CFN Export and SSM)
// ---------------------------------------------------------------------------

const mixedProducer = new cdk.Stack(app, 'SsmRefMixedProducer');
const mixedParam = new ssm.StringParameter(mixedProducer, 'MixedSharedParam', {
  stringValue: 'mixed-mode-test-value',
});

// MIXED mode: create both CFN Export and SSM Parameter
cdk.StackReferences.of(mixedParam).toHere([
  cdk.CrossStackReferenceType.CFN_EXPORTS,
  cdk.CrossStackReferenceType.SSM,
]);

const mixedConsumer = new cdk.Stack(app, 'SsmRefMixedConsumer');

// Reference the parameter value from the other stack using MIXED mode
new ssm.StringParameter(mixedConsumer, 'MixedConsumedParam', {
  parameterName: '/integ-test/ssm-ref/mixed-consumed-value',
  stringValue: mixedParam.parameterArn,
});

// ---------------------------------------------------------------------------
// IntegTest setup
// ---------------------------------------------------------------------------

const testCase = new integ.IntegTest(app, 'SsmCrossStackReferencesTest', {
  testCases: [producer, consumer, mixedProducer, mixedConsumer],
  diffAssets: true,
});

// Verify Test Case 1: Consumer's SSM parameter was created with the correct value
const getConsumedParam = testCase.assertions.awsApiCall('SSM', 'getParameter', {
  Name: '/integ-test/ssm-ref/consumed-value',
});

// Ensure the assertion stack deploys after the consumer stacks
const assertStack = cdk.Stack.of(getConsumedParam);
assertStack.addDependency(consumer);
assertStack.addDependency(mixedConsumer);

getConsumedParam.expect(integ.ExpectedResult.objectLike({
  Parameter: integ.Match.objectLike({
    // The value should be the SSM parameter ARN from the producer
    Value: integ.Match.stringLikeRegexp('arn:aws:ssm:.*:parameter/.*'),
  }),
}));

// Verify Test Case 2: Mixed mode consumer also has the correct value
const getMixedConsumedParam = testCase.assertions.awsApiCall('SSM', 'getParameter', {
  Name: '/integ-test/ssm-ref/mixed-consumed-value',
});

getMixedConsumedParam.expect(integ.ExpectedResult.objectLike({
  Parameter: integ.Match.objectLike({
    Value: integ.Match.stringLikeRegexp('arn:aws:ssm:.*:parameter/.*'),
  }),
}));
