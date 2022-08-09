# CDK Construct library for building ECS services
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

> ⚠️ v2 of this library is now available! It is compatible with AWS CDK v2 and available in
> multiple languages.
> The source code for v2 lives [here](https://github.com/cdklabs/cdk-ecs-service-extensions).
> To migrate from this library to v2, see the [Migration Guide](https://github.com/cdklabs/cdk-ecs-service-extensions/blob/main/MIGRATING.md).

This library provides a high level, extensible pattern for constructing services
deployed using Amazon ECS.

The `Service` construct provided by this module can be extended with optional `ServiceExtension` classes that add supplemental ECS features including:

- [AWS X-Ray](https://aws.amazon.com/xray/) for tracing your application
- [Amazon CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) for capturing per task stats
- [AWS AppMesh](https://aws.amazon.com/app-mesh/) for adding your application to a service mesh
- [Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html), for exposing your service to the public
- [AWS FireLens](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html), for filtering and routing application logs
- [Injecter Extension](#injecter-extension), for allowing your service connect to other AWS services by granting permission and injecting environment variables
- [Queue Extension](#queue-extension), for allowing your service to consume messages from an SQS Queue which can be populated by one or more SNS Topics that it is subscribed to
- [Community Extensions](#community-extensions), providing support for advanced use cases

The `ServiceExtension` class is an abstract class which you can also implement in
order to build your own custom service extensions for modifying your service, or
attaching your own custom resources or sidecars.

## Example

```ts
import { AppMeshExtension, CloudwatchAgentExtension, Container, Environment, FireLensExtension, HttpLoadBalancerExtension, Service, ServiceDescription, XRayExtension } from 'ecs-service-builder';

// Create an environment to deploy a service in.
const environment = new Environment(stack, 'production');

// Build out the service description
const nameDescription = new ServiceDescription();
nameDescription.add(new Container({
  cpu: 1024,
  memoryMiB: 2048,
  trafficPort: 80,
  image: ContainerImage.fromRegistry('nathanpeck/name'),
  environment: {
    PORT: '80',
  },
}));
nameDescription.add(new AppMeshExtension({ mesh }));
nameDescription.add(new FireLensExtension());
nameDescription.add(new XRayExtension());
nameDescription.add(new CloudwatchAgentExtension());
nameDescription.add(new HttpLoadBalancerExtension());

// Implement the service description as a real service inside
// an environment.
const nameService = new Service(stack, 'name', {
  environment: environment,
  serviceDescription: nameDescription,
});
```

## Creating an `Environment`

An `Environment` is a place to deploy your services. You can have multiple environments
on a single AWS account. For example, you could create a `test` environment as well
as a `production` environment so you have a place to verify that your application
works as intended before you deploy it to a live environment.

Each environment is isolated from other environments. In other words,
when you create an environment, by default the construct supplies its own VPC,
ECS Cluster, and any other required resources for the environment:

```ts
const environment = new Environment(stack, 'production');
```

However, you can also choose to build an environment out of a pre-existing VPC
or ECS Cluster:

```ts
const vpc = new ec2.Vpc(stack, 'VPC');
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const environment = new Environment(stack, 'production', {
  vpc,
  cluster,
});
```

## Defining your `ServiceDescription`

The `ServiceDescription` defines what application you want the service to run and
what optional extensions you want to add to the service. The most basic form of a `ServiceDescription` looks like this:

```ts
const nameDescription = new ServiceDescription();
nameDescription.add(new Container({
  cpu: 1024,
  memoryMiB: 2048,
  trafficPort: 80,
  image: ContainerImage.fromRegistry('nathanpeck/name'),
  environment: {
    PORT: '80',
  },
}));
```

Every `ServiceDescription` requires at minimum that you add a `Container` extension
which defines the main application (essential) container to run for the service.

### Logging using `awslogs` log driver

If no observability extensions have been configured for a service, the ECS Service Extensions configures an `awslogs` log driver for the application container of the service to send the container logs to CloudWatch Logs.

You can either provide a log group to the `Container` extension or one will be created for you by the CDK.

Following is an example of an application with an `awslogs` log driver configured for the application container:

```ts
const environment = new Environment(stack, 'production');

const nameDescription = new ServiceDescription();
nameDescription.add(new Container({
  cpu: 1024,
  memoryMiB: 2048,
  trafficPort: 80,
  image: ContainerImage.fromRegistry('nathanpeck/name'),
  environment: {
    PORT: '80',
  },
  logGroup: new awslogs.LogGroup(stack, 'MyLogGroup'),
}));
```

If a log group is not provided, no observability extensions have been created, and the `ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER` feature flag is enabled, then logging will be configured by default and a log group will be created for you.
 
The `ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER` feature flag is enabled by default in any CDK apps that are created with CDK v1.140.0 or v2.8.0 and later.

To enable default logging for previous versions, ensure that the `ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER` flag within the application stack context is set to true, like so:

```ts
stack.node.setContext(cxapi.ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER, true);
```

Alternatively, you can also set the feature flag in the `cdk.json` file. For more information, refer the [docs](https://docs.aws.amazon.com/cdk/v2/guide/featureflags.html).  

After adding the `Container` extension, you can optionally enable additional features for the service using the `ServiceDescription.add()` method:

```ts
nameDescription.add(new AppMeshExtension({ mesh }));
nameDescription.add(new FireLensExtension());
nameDescription.add(new XRayExtension());
nameDescription.add(new CloudwatchAgentExtension());
nameDescription.add(new HttpLoadBalancerExtension());
nameDescription.add(new AssignPublicIpExtension());
```

## Launching the `ServiceDescription` as a `Service`

Once the service description is defined, you can launch it as a service:

```ts
const nameService = new Service(stack, 'name', {
  environment: environment,
  serviceDescription: nameDescription,
});
```

At this point, all the service resources will be created. This includes the ECS Task
Definition, Service, as well as any other attached resources, such as App Mesh Virtual
Node or an Application Load Balancer.

## Creating your own taskRole

Sometimes the taskRole should be defined outside of the service so that you can create strict resource policies (ie. S3 bucket policies) that are restricted to a given taskRole:

```ts
const taskRole = new iam.Role(stack, 'CustomTaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
});

// Use taskRole in any CDK resource policies
// new s3.BucketPolicy(this, 'BucketPolicy, {});

const nameService = new Service(stack, 'name', {
  environment: environment,
  serviceDescription: nameDescription,
  taskRole,
});
```

## Task Auto-Scaling

You can configure the task count of a service to match demand. The recommended way of achieving this is to configure target tracking policies for your service which scales in and out in order to keep metrics around target values.

You need to configure an auto scaling target for the service by setting the `minTaskCount` (defaults to 1) and `maxTaskCount` in the `Service` construct. Then you can specify target values for "CPU Utilization" or "Memory Utilization" across all tasks in your service. Note that the `desiredCount` value will be set to `undefined` if the auto scaling target is configured.

If you want to configure auto-scaling policies based on resources like Application Load Balancer or SQS Queues, you can set the corresponding resource-specific fields in the extension. For example, you can enable target tracking scaling based on Application Load Balancer request count as follows:

```ts
const stack = new cdk.Stack();
const environment = new Environment(stack, 'production');
const serviceDescription = new ServiceDescription();

serviceDescription.add(new Container({
  cpu: 256,
  memoryMiB: 512,
  trafficPort: 80,
  image: ecs.ContainerImage.fromRegistry('my-alb'),
}));

// Add the extension with target `requestsPerTarget` value set
serviceDescription.add(new HttpLoadBalancerExtension({ requestsPerTarget: 10 }));

// Configure the auto scaling target
new Service(stack, 'my-service', {
  environment,
  serviceDescription,
  desiredCount: 5,
  // Task auto-scaling constuct for the service
  autoScaleTaskCount: {
    maxTaskCount: 10,
    targetCpuUtilization: 70,
    targetMemoryUtilization: 50,
  },
});
```

You can also define your own service extensions for [other auto-scaling policies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html) for your service by making use of the `scalableTaskCount` attribute of the `Service` class.

## Creating your own custom `ServiceExtension`

In addition to using the default service extensions that come with this module, you
can choose to implement your own custom service extensions. The `ServiceExtension`
class is an abstract class you can implement yourself. The following example
implements a custom service extension that could be added to a service in order to
autoscale it based on scaling intervals of SQS Queue size:

```ts
export class MyCustomAutoscaling extends ServiceExtension {
  constructor() {
    super('my-custom-autoscaling');
    // Scaling intervals for the step scaling policy
    this.scalingSteps = [{ upper: 0, change: -1 }, { lower: 100, change: +1 }, { lower: 500, change: +5 }];
    this.sqsQueue = new sqs.Queue(this.scope, 'my-queue');
  }

  // This hook utilizes the resulting service construct
  // once it is created
  public useService(service: ecs.Ec2Service | ecs.FargateService) {
    this.parentService.scalableTaskCount.scaleOnMetric('QueueMessagesVisibleScaling', {
      metric: this.sqsQueue.metricApproximateNumberOfMessagesVisible(),
      scalingSteps: this.scalingSteps,
    });
  }
}
```

This `ServiceExtension` can now be reused and added to any number of different
service descriptions. This allows you to develop reusable bits of configuration,
attach them to many different services, and centrally manage them. Updating the
`ServiceExtension` in one place would update all services that use it, instead of
requiring decentralized updates to many different services.

Every `ServiceExtension` can implement the following hooks to modify the properties
of constructs, or make use of the resulting constructs:

- `addHooks()` - This hook is called after all the extensions are added to a
  ServiceDescription, but before any of the other extension hooks have been run.
  It gives each extension a chance to do some inspection of the overall ServiceDescription
  and see what other extensions have been added. Some extensions may want to register
  hooks on the other extensions to modify them. For example, the Firelens extension
  wants to be able to modify the settings of the application container to route logs
  through Firelens.
- `modifyTaskDefinitionProps()` - This is hook is passed the proposed
  ecs.TaskDefinitionProps for a TaskDefinition that is about to be created.
  This allows the extension to make modifications to the task definition props
  before the TaskDefinition is created. For example, the App Mesh extension modifies
  the proxy settings for the task.
- `useTaskDefinition()` - After the TaskDefinition is created, this hook is
  passed the actual TaskDefinition construct that was created. This allows the
  extension to add containers to the task, modify the task definition's IAM role,
  etc.
- `resolveContainerDependencies()` - Once all extensions have added their containers,
  each extension is given a chance to modify its container's `dependsOn` settings.
  Extensions need to check and see what other extensions were enabled and decide
  whether their container needs to wait on another container to start first.
- `modifyServiceProps()` - Before an Ec2Service or FargateService is created, this
  hook is passed a draft version of the service props to change. Each extension adds
  its own modifications to the service properties. For example, the App Mesh extension
  needs to modify the service settings to enable CloudMap service discovery.
- `useService()` - After the service is created, this hook is given a chance to
  utilize that service. This is used by extensions like the load balancer or App Mesh
  extension, which create and link other AWS resources to the ECS extension.
- `connectToService()` - This hook is called when a user wants to connect one service
  to another service. It allows an extension to implement logic about how to allow
  connections from one service to another. For example, the App Mesh extension implements
  this method in order to easily connect one service mesh service to another, which
  allows the service's Envoy proxy sidecars to route traffic to each other.

## Connecting services

One of the hooks that a `ServiceExtension` can implement is a hook for connection
logic. This is utilized when connecting one service to another service, e.g.
connecting a user facing web service with a backend API. Usage looks like this:

```ts
const frontend = new Service(stack, 'frontend', {
  environment,
  serviceDescription: frontendDescription
});
const backend = new Service(stack, 'backend', {
  environment,
  serviceDescription: backendDescription
});

frontend.connectTo(backend);
```

The address that a service will use to talk to another service depends on the
type of ingress that has been created by the extension that did the connecting.
For example, if an App Mesh extension has been used, then the service is accessible
at a DNS address of `<service name>.<environment name>`. For example:

```ts
const environment = new Environment(stack, 'production');

// Define the frontend tier
const frontendDescription = new ServiceDescription();
frontendDescription.add(new Container({
  cpu: 1024,
  memoryMiB: 2048,
  trafficPort: 80,
  image: ContainerImage.fromRegistry('my-frontend-service'),
  environment: {
    BACKEND_URL: 'http://backend.production'
  },
}));
const frontend = new Service(stack, 'frontend', {
  environment,
  serviceDescription: frontendDescription
});

// Define the backend tier
const backendDescription = new ServiceDescription();
backendDescription.add(new Container({
  cpu: 1024,
  memoryMiB: 2048,
  trafficPort: 80,
  image: ContainerImage.fromRegistry('my-backend-service'),
  environment: {
    FRONTEND_URL: 'http://frontend.production'
  },
}));
const backend = new Service(stack, 'backend', {
  environment,
  serviceDescription: backendDescription
});

// Connect the two tiers to each other
frontend.connectTo(backend);
```

The above code uses the well-known service discovery name for each
service, and passes it as an environment variable to the container so
that the container knows what address to use when communicating to
the other service.

## Importing a pre-existing cluster

To create an environment with a pre-existing cluster, you must import the cluster first, then use `Environment.fromEnvironmentAttributes()`. When a cluster is imported into an environment, the cluster is treated as immutable. As a result, no extension may modify the cluster to change a setting.

```ts

const cluster = ecs.Cluster.fromClusterAttributes(stack, 'Cluster', {
  ...
});

const environment = Environment.fromEnvironmentAttributes(stack, 'Environment', {
  capacityType: EnvironmentCapacityType.EC2, // or `FARGATE`
  cluster,
});

```

## Injecter Extension

This service extension accepts a list of `Injectable` resources. It grants access to these resources and adds the necessary environment variables to the tasks that are part of the service. 

For example, an `InjectableTopic` is an SNS Topic that grants permission to the task role and adds the topic ARN as an environment variable to the task definition.

### Publishing to SNS Topics

You can use this extension to set up publishing permissions for SNS Topics.

```ts
nameDescription.add(new InjecterExtension({
  injectables: [new InjectableTopic({
    // SNS Topic the service will publish to
    topic: new sns.Topic(stack, 'my-topic'),
  })],
}));
```

## Queue Extension

This service extension creates a default SQS Queue `eventsQueue` for the service (if not provided) and optionally also accepts list of `ISubscribable` objects that the `eventsQueue` can subscribe to. The service extension creates the subscriptions and sets up permissions for the service to consume messages from the SQS Queue.

### Setting up SNS Topic Subscriptions for SQS Queues

You can use this extension to set up SNS Topic subscriptions for the `eventsQueue`. To do this, create a new object of type `TopicSubscription` for every SNS Topic you want the `eventsQueue` to subscribe to and provide it as input to the service extension.

```ts
const myServiceDescription = nameDescription.add(new QueueExtension({
  // Provide list of topic subscriptions that you want the `eventsQueue` to subscribe to
  subscriptions: [new TopicSubscription({
    topic: new sns.Topic(stack, 'my-topic'),
  }],
}));

// To access the `eventsQueue` for the service, use the `eventsQueue` getter for the extension
const myQueueExtension = myServiceDescription.extensions.queue as QueueExtension;
const myEventsQueue = myQueueExtension.eventsQueue;
```

For setting up a topic-specific queue subscription, you can provide a custom queue in the `TopicSubscription` object along with the SNS Topic. The extension will set up a topic subscription for the provided queue instead of the default `eventsQueue` of the service.

```ts
nameDescription.add(new QueueExtension({
  eventsQueue: myEventsQueue,
  subscriptions: [new TopicSubscription({
    topic: new sns.Topic(stack, 'my-topic'),
    // `myTopicQueue` will subscribe to the `my-topic` instead of `eventsQueue`
    topicSubscriptionQueue: {
      queue: myTopicQueue,
    },
  }],
}));
```

### Configuring auto scaling based on SQS Queues

You can scale your service up or down to maintain an acceptable queue latency by tracking the backlog per task. It configures a target tracking scaling policy with target value (acceptable backlog per task) calculated by dividing the `acceptableLatency` by `messageProcessingTime`. For example, if the maximum acceptable latency for a message to be processed after its arrival in the SQS Queue is 10 mins and the average processing time for a task is 250 milliseconds per message, then `acceptableBacklogPerTask = 10 *  60 / 0.25 = 2400`. Therefore, each queue can hold up to 2400 messages before the service starts to scale up. For this, a target tracking policy will be attached to the scaling target for your service with target value `2400`. For more information, please refer: https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html .

You can configure auto scaling based on SQS Queue for your service as follows:

```ts
nameDescription.add(new QueueExtension({
  eventsQueue: myEventsQueue,
  // Need to specify `scaleOnLatency` to configure auto scaling based on SQS Queue
  scaleOnLatency: {
    acceptableLatency: cdk.Duration.minutes(10),
    messageProcessingTime: cdk.Duration.millis(250),
  },
  subscriptions: [new TopicSubscription({
    topic: new sns.Topic(stack, 'my-topic'),
    // `myTopicQueue` will subscribe to the `my-topic` instead of `eventsQueue`
    topicSubscriptionQueue: {
      queue: myTopicQueue,
      // Optionally provide `scaleOnLatency` for configuring separate autoscaling for `myTopicQueue`
      scaleOnLatency: {
        acceptableLatency: cdk.Duration.minutes(10),
        messageProcessingTime: cdk.Duration.millis(250),
      }
    },
  }],
}));
```

## Publish/Subscribe Service Pattern

The [Publish/Subscribe Service Pattern](https://aws.amazon.com/pub-sub-messaging/) is used for implementing asynchronous communication between services. It involves 'publisher' services emitting events to SNS Topics, which are passed to subscribed SQS queues and then consumed by 'worker' services. 

The following example adds the `InjecterExtension` to a `Publisher` Service which can publish events to an SNS Topic and adds the `QueueExtension` to a `Worker` Service which can poll its `eventsQueue` to consume messages populated by the topic.

```ts
const environment = new Environment(stack, 'production');

const pubServiceDescription = new ServiceDescription();
pubServiceDescription.add(new Container({
  cpu: 256,
  memoryMiB: 512,
  trafficPort: 80,
  image: ecs.ContainerImage.fromRegistry('sns-publish'),
}));

const myTopic = new sns.Topic(stack, 'myTopic');

// Add the `InjecterExtension` to the service description to allow publishing events to `myTopic`
pubServiceDescription.add(new InjecterExtension({
  injectables: [new InjectableTopic({
    topic: myTopic,
  }],
}));

// Create the `Publisher` Service
new Service(stack, 'Publisher', {
  environment: environment,
  serviceDescription: pubServiceDescription,
});

const subServiceDescription = new ServiceDescription();
subServiceDescription.add(new Container({
  cpu: 256,
  memoryMiB: 512,
  trafficPort: 80,
  image: ecs.ContainerImage.fromRegistry('sqs-reader'),
}));

// Add the `QueueExtension` to the service description to subscribe to `myTopic`
subServiceDescription.add(new QueueExtension({
  subscriptions: [new TopicSubscription({
    topic: myTopic,
  }],
}));

// Create the `Worker` Service
new Service(stack, 'Worker', {
  environment: environment,
  serviceDescription: subServiceDescription,
});
```

## Community Extensions

We encourage the development of Community Service Extensions that support
advanced features. Here are some useful extensions that we have reviewed:

- [ListenerRulesExtension](https://www.npmjs.com/package/@wheatstalk/ecs-service-extension-listener-rules) for more precise control over Application Load Balancer rules

> Please submit a pull request so that we can review your service extension and
> list it here.
