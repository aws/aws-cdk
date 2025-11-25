import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as sqs from 'aws-cdk-lib/aws-sqs';

/**
 * This test verifies that template transforms are invoked during synthesis
 * and can modify the final CloudFormation template.
 *
 * The transform adds custom metadata to the template, which can be verified
 * in the synthesized output.
 */

const app = new cdk.App();

// Register a template transform that adds metadata
app.addTemplateTransform({
  transformTemplate: (_stack, template) => {
    template.Metadata = template.Metadata || {};
    template.Metadata.TemplateTransformApplied = true;
    template.Metadata.TransformTimestamp = 'test-timestamp';
  },
});

// Register a second transform to verify chaining works
app.addTemplateTransform({
  transformTemplate: (_stack, template) => {
    template.Metadata.SecondTransformApplied = true;
  },
});

const stack = new cdk.Stack(app, 'TemplateTransformTestStack');

// Add a simple resource to ensure the template has content
new sqs.Queue(stack, 'TestQueue', {
  visibilityTimeout: cdk.Duration.seconds(300),
});

new integ.IntegTest(app, 'TemplateTransformTest', {
  testCases: [stack],
});
