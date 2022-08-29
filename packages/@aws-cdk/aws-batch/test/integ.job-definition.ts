/* eslint-disable quotes */
import { ContainerImage } from "@aws-cdk/aws-ecs";
import { App, Stack } from "@aws-cdk/core";
import { ExpectedResult, IntegTest } from "@aws-cdk/integ-tests";
import { JobDefinition } from "../lib";

const app = new App();

const stack = new Stack(app, "BatchDefaultEnvVarsStack");

new JobDefinition(stack, "JobDefinition", {
  container: {
    image: ContainerImage.fromRegistry("docker/whalesay"),
  },
});

const integ = new IntegTest(app, "IntegTest-BatchDefaultEnvVarsStack", {
  testCases: [stack],
  regions: ["us-east-1"],
});

const awsApiCallDescribeJobDefinition = integ.assertions.awsApiCall(
  "Batch",
  "describeJobDefinitions",
  {
    status: "ACTIVE",
  },
);

awsApiCallDescribeJobDefinition.assertAtPath(
  "jobDefinitions.0.containerProperties.environment.0.name",
  ExpectedResult.stringLikeRegexp('AWS_REGION'),
);

app.synth();
