import { App, Stack } from "@aws-cdk/core";
import { ExpectedResult, IntegTest } from "@aws-cdk/integ-tests";
import * as sqs from "@aws-cdk/aws-sqs";

const app = new App();
const stack = new Stack(app, "TypeScriptStack");

const queue = new sqs.Queue(stack, "Queue", {
  fifo: true,
});

const integ = new IntegTest(app, "TypeScript", { testCases: [stack] });

integ.assertions
  .awsApiCall("SQS", "getQueueAttributes", {
    QueueUrl: queue.queueUrl,
    AttributeNames: ["QueueArn"],
  })
  .assertAtPath(
    "Attributes.QueueArn",
    ExpectedResult.stringLikeRegexp(".*\\.fifo$")
  );

app.synth();
