/* eslint-disable quotes */
import { ContainerImage } from "@aws-cdk/aws-ecs";
import { App, Stack } from "@aws-cdk/core";
import { ExpectedResult, IntegTest } from "@aws-cdk/integ-tests";
import { Construct } from "constructs";
import { JobDefinition } from "../lib";

const jobDefinitionName = "aws-batch-test";

class SampleStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new JobDefinition(this, "batch", {
      jobDefinitionName,
      container: {
        image: ContainerImage.fromRegistry("docker/whalesay"),
      },
    });
  }
}

// Beginning of the test suite
const app = new App();

const integ = new IntegTest(app, "IntegTest-aws-batch-default-env-variables", {
  testCases: [
    new SampleStack(app, "SampleStack-aws-batch-default-env-variables"),
  ],
});
const awsApiCallResponse = integ.assertions.awsApiCall(
  "Batch",
  "describeJobDefinitions",
  {
    jobDefinitionName,
  },
);

awsApiCallResponse.assertAtPath(
  "jobDefinitions.0.containerProperties.environment",
  ExpectedResult.arrayWith([
    {
      name: "AWS_REGION",
      value: "",
    },
  ]),
);

app.synth();
