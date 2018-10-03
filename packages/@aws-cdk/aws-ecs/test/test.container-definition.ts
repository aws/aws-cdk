import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ecs = require('../lib');

export = {
  "When creating a Task Definition": {
    // Validating portMapping inputs
    "With network mode AwsVpc": {
      "Host port should be the same as container port"(test: Test) {
        // GIVEN
        const stack =  new cdk.Stack();
        const taskDefinition = new ecs.EcsTaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.AwsVpc,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.DockerHub.image("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });
        // THEN
        test.throws(() => {
          container.addPortMappings({
            containerPort: 8080,
            hostPort: 8081
          });
        });
        test.done();
      },

      "Host port can be empty "(test: Test) {
        // GIVEN
        const stack =  new cdk.Stack();
        const taskDefinition = new ecs.EcsTaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.AwsVpc,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.DockerHub.image("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });
        // WHEN
        container.addPortMappings({
          containerPort: 8080,
        });

        // THEN no excpetion raised
        test.done();
      },
    },
    "With network mode Host ": {
      "Host port should be the same as container port"(test: Test) {
        test.done();
      },
      "Host port can be empty "(test: Test) {
        // GIVEN
        const stack =  new cdk.Stack();
        const taskDefinition = new ecs.EcsTaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.AwsVpc,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.DockerHub.image("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });
        // WHEN
        container.addPortMappings({
          containerPort: 8080,
        });

        // THEN no exception raised
        test.done();
      },
    },
    "With network mode Bridge": {
      "Host port should not be lower than 1024"(test: Test) {
        // GIVEN
        const stack =  new cdk.Stack();
        const taskDefinition = new ecs.EcsTaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.AwsVpc,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.DockerHub.image("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });

        // THEN
        test.throws(() => {
          container.addPortMappings({
            containerPort: 8080,
            hostPort: 1,
          });
        });
        test.done();
      },
    },

    //     "With health check": {
    //       "healthCheck.command is a single string"(test: Test) {
    //         const stack =  new cdk.Stack();
    //         const taskDefinition = new TaskDefinition(stack, 'TaskDef');
    //         const containerDefinition = taskDefinition.ContainerDefinition[0];
    //         test.deepEqual(resolve(vpc.vpcId), {Ref: 'TheVPC92636AB0' } );
    //         test.done();
    //       },
    //     }
  },
  "Ingress Port": {
    "With network mode AwsVpc": {
      "Ingress port should be the same as container port"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.EcsTaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.AwsVpc,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.DockerHub.image("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });

        // WHEN
        container.addPortMappings({
          containerPort: 8080,
        });
        const actual = container.ingressPort;

        // THEN
        const expected = 8080;
        test.equal(actual, expected, "Ingress port should be the same as container port");
        test.done();
      },
    },
    "With network mode Host ": {
      "Ingress port should be the same as container port"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.EcsTaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.Host,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.DockerHub.image("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });

        // WHEN
        container.addPortMappings({
          containerPort: 8080,
        });
        const actual = container.ingressPort;

        // THEN
        const expected = 8080;
        test.equal(actual, expected);
        test.done();
      },
    },
    "With network mode Bridge": {
      "Ingress port should be the same as host port if supplied"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.EcsTaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.Bridge,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.DockerHub.image("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });

        // WHEN
        container.addPortMappings({
          containerPort: 8081,
          hostPort: 8080,
        });
        const actual = container.ingressPort;

        // THEN
        const expected = 8080;
        test.equal(actual, expected);
        test.done();
      },
      "Ingress port should be the 0 if not supplied"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.EcsTaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.Bridge,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.DockerHub.image("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });

        // WHEN
        container.addPortMappings({
          containerPort: 8081,
        });
        const actual = container.ingressPort;

        // THEN
        const expected = 0;
        test.equal(actual, expected);
        test.done();
      },
    },
  },
};
