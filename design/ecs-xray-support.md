# AWS ECS - Support for Instrumenting ECS Applications with AWS X-Ray

In order to provide an AWS native solution for instrumenting ECS applications, the ECS construct library should provide an API to integrate AWS-Ray into their Task Definition.

Github Issue: https://github.com/awslabs/aws-cdk/issues/1843

## General approach
We would be adding an API to EC2Service and FargateService to inject X-ray as a sidecar container.

*NOTE:* This assumes the customer has the necessary code changes in their application image to interact with AWS X-Ray. See the [AWS X-Ray developer Guide](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon-ecs.html) for more details.

For a FargateService, where the network mode is awsvpc, it should suffice to wrap the `addContainer` call on the FargateTaskDefinition, and add the appropriate port mappings (x-ray by default listens on port 2000):

```ts
public addTracing(props: TracingOptions = {}) {
  const xray = this.taskDefinition.addContainer("xray", {
    image: ContainerImage.fromRegistry("amazon/xray-daemon"),
    cpu: props.cpu,
    memoryReservationMiB: props.memoryReservationMiB,
    essential: props.essential || false
  });

  xray.addPortMappings({
    containerPort: 2000,
    protocol: Protocol.Udp
  });
}
```

From a consumer perspective, this would be invoked after a Fargate Service is instantiated:

```ts
// setup
const stack = new cdk.Stack();
const vpc = new ec2.VpcNetwork(stack, 'MyVpc', {});
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

taskDefinition.addContainer("web", {
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
});

// create service
const service = new ecs.FargateService(stack, "FargateService", {
  cluster,
  taskDefinition
});

service.addTracing();
```

This should result in the following container definition being injected into the Fargate Task Definition:

```ts
{
  "name": "xray-daemon",
  "image": "amazon/aws-xray-daemon",
  "portMappings" : [
    {
        "containerPort": 2000,
        "protocol": "udp"
    }
  ]
}
```

Optionally, `addTracing` can take in properties.

```ts
export interface TracingOptions {
  /**
   * The minimum number of CPU units to reserve for the container.
   */
  readonly cpu?: number
  /**
   * The hard limit (in MiB) of memory to present to the container.
   *
   * If your container attempts to exceed the allocated memory, the container
   * is terminated.
   *
   * At least one of memoryLimitMiB and memoryReservationMiB is required for non-Fargate services.
   */
  readonly memoryLimitMiB?: number;

  /**
   * The soft limit (in MiB) of memory to reserve for the container.
   *
   * When system memory is under contention, Docker attempts to keep the
   * container memory within the limit. If the container requires more memory,
   * it can consume up to the value specified by the Memory property or all of
   * the available memory on the container instance—whichever comes first.
   *
   * At least one of memoryLimitMiB and memoryReservationMiB is required for non-Fargate services.
   */
  readonly memoryReservationMiB?: number;

  /**
   * Whether or not this container is essential
   *
   * @default false
   */
  readonly essential?: boolean;

  /**
   * Whether to create an AWS log driver
   *
   * @default true
   */
  readonly createLogs?: boolean;
}
```

For an ECS Service, the container definition would additionally need to support the [links field](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#container_definitions). Note: While [links](https://docs.docker.com/network/links/) in docker is a legacy field, it is currently the only way to use X-Ray with the default bridge network mode.

Calling `addTracing()` would set the correct port mappings, environment variable (`AWS_XRAY_DAEMON_ADDRESS: xray-daemon:2000`), and links, resulting in something similar to the following Task Definition:

```
{
  "name": "xray-daemon",
  "image": ContainerImage.fromRegistry("amazon/xray-daemon"),
  "cpu": 32,
  "memoryReservation": 256,
  "portMappings" : [
     {
       "hostPort": 0,
       "containerPort": 2000,
       "protocol": "udp"
     }
   ],
},
{
  "name": "web",
  "image": "my-webapp",
  "cpu": 192,
  "memoryReservation": 512,
  "environment": [
    { "name" : "AWS_XRAY_DAEMON_ADDRESS", "value" : "xray-daemon:2000" }
  ],
  "portMappings" : [
     {
       "hostPort": 5000,
       "containerPort": 5000
     }
  ],
  "links": [
    "xray-daemon"
  ]
}
```

Alternativey, X-Ray can be used on an ECS service using awsvpc network mode. This currently constraints the number of tasks that can be placed on a given instance, but this restriction may soon be addressed with [ENI trunking](https://github.com/aws/containers-roadmap/issues/7).
