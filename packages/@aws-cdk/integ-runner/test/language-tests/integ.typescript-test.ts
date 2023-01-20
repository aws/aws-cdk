/**
 * This test cannot use service modules since it would introduce a circular dependency
 * Using CfnResource etc. is a workaround to still test something useful
 */
import * as cdk from "@aws-cdk/core";
import { ExpectedResult, IntegTest } from "@aws-cdk/integ-tests";

const app = new cdk.App();

const stack = new cdk.Stack(app, "TypeScriptStack");
const queue = new cdk.CfnResource(stack, "Queue", {
  type: "AWS::SQS::Queue",
  properties: {
    FifoQueue: true
  }
});

const assertionStack = new cdk.Stack(app, "TypeScriptAssertions");
assertionStack.addDependency(stack);

const integ = new IntegTest(app, "TypeScript", {
  testCases: [stack],
  assertionStack,
});

integ.assertions
  .awsApiCall("SQS", "getQueueAttributes", {
    QueueUrl: stack.exportValue(queue.getAtt("QueueUrl", cdk.ResolutionTypeHint.STRING)),
    AttributeNames: ["QueueArn"],
  })
  .assertAtPath(
    "Attributes.QueueArn",
    ExpectedResult.stringLikeRegexp(".*\\.fifo$")
  );

app.synth();
