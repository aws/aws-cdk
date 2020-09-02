# CDK Construct library for building ECS services
<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

This library provides a high level, extendable pattern for constructing services
deployed using Amazon ECS.

The `Service` construct provided by this module can be extended with optional `ServiceExtension` classes that add supplemental ECS features including:

- AWS X-Ray for tracing your application
- Amazon CloudWatch Agent for capturing per task stats
- AWS AppMesh for adding your application to a service mesh
- Application Load Balancer, for exposing your service to the public
- AWS FireLens, for filtering and routing application logs

The `ServiceExtension` class is an abstract class which you can also implement in
order to build your own custom service extensions for modifying your service, or
attaching your own custom resources or sidecars.

## Example

```js
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

By default when you create an environment the construct supplies its own VPC,
ECS Cluster, and any other required resources for the environment:

```js
const environment = new Environment(stack, 'production');
```

However you can also choose to build an environment out of a preexisting VPC,
or ECS Cluster:

```js
const vpc = new ec2.Vpc(stack, 'VPC');
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const environment = new Environment(stack, 'production', {
  vpc,
  cluster,
});
```

## Defining your `ServiceDescription`

The `ServiceDescription` defines what application you want the service to run and
what optional extensions you want to add to the service. The most basic form of a `ServiceExtension` looks like this:

```js
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
which defines the main application container to run for the service.

After that you can optionally enable additional features for the service using the `ServiceDescription.add()` method:

```js
nameDescription.add(new AppMeshExtension({ mesh }));
nameDescription.add(new FireLensExtension());
nameDescription.add(new XRayExtension());
nameDescription.add(new CloudwatchAgentExtension());
nameDescription.add(new HttpLoadBalancerExtension());
```

## Launching the `ServiceDescription` as a `Service`

Once the service description is defined you can launch it as a service:

```js
const nameService = new Service(stack, 'name', {
  environment: environment,
  serviceDescription: nameDescription,
});
```

At this point all the service resources will be created. This includes the ECS Task
Definition, Service, as well as any other attached resources such as App Mesh Virtual
Node, or an Application Load Balancer.

## Creating your own custom `ServiceExtension`

In addition to using the default service extensions that come with this module you
can choose to implement your own custom service extensions. The `ServiceExtension`
class is an abstract class you can implement yourself. The following example
implements a custom service extension could be added to a service in order to
autoscale it based on CPU:

```js
export class MyCustomAutoscaling extends ServiceExtension {
  constructor() {
    super('my-custom-autoscaling');
  }

  // This service modifies properties of the service prior
  // to construct creation.
  public mutateServiceProps(props: ServiceBuild) {
    return {
      ...props,

      // Initially launch 10 copies of the service
      desiredCount: 10
    } as ServiceBuild;
  }

  // This hook utilizes the resulting service construct
  // once it is created
  public useService(service: ecs.Ec2Service | ecs.FargateService) {
    const scalingTarget = service.autoScaleTaskCount({
      minCapacity: 5, // Min 5 tasks
      maxCapacity: 20 // Max 20 tasks
    });

    scalingTarget.scaleOnCpuUtilization('TargetCpuUtilization50', {
      targetUtilizationPercent: 50,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
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

* `addHooks()` - This hook is called after all the extensions are added to a ServiceDescription, but before any of the other extension hooks have been run. It gives each extension a chance to do some inspection of the overall ServiceDescription and see what other extensions have been added. Some extensions may want to register hooks on the other extensions to modify them. For example the Firelens extension wants to be able to modify the settings of the application container to route logs through Firelens.
* `modifyTaskDefinitionProps()` - This is hook is passed the proposed ecs.TaskDefinitionProps for a TaskDefinition that is about to be created. This allows the extension to make modifications to the task definition props before the TaskDefinition is created. For example the App Mesh extension modifies the proxy settings for the task.
* `useTaskDefinition()` - After the TaskDefinition is created, this hook is passed the actual TaskDefinition construct that was created. This allows the extension to add containers to the task, modify the task definition's IAM role, etc.
* `resolveContainerDependencies()` - Once all extensions have added their containers each extension is given a chance to modify its container's dependsOn settings. Extensions need to check and see what other extensions were enabled, and decide whether their container needs to wait on another container to start first.
* `modifyServiceProps()` - Before an Ec2Service or FargateService is created this hook is passed a draft version of the service props to change. Each extension adds its own modifications to the service properties. For example the App Mesh extension needs to modify the service settings to enable CloudMap service discovery.
* `useService()` - After the service is created this hook is given a chance to utilize the service that was created. This is used by extensions like the load balancer or App Mesh extension which create and link other AWS resources to the ECS extension.
* `connectToService()` - This hook is called when a user wants to connect one service to another service. It allows an extension to implement logic about how to allow connections from one service to another. For example the App Mesh extension implements this method so that you can easily connect one service mesh service to another so that the service's Envoy proxy sidecars know how to route traffic to each other.

## Connecting one service to another service

One of the hooks that a `ServiceExtension` can implement is a hook for connection
logic. This is utilized when connecting one service to another service, for example
connecting a user facing web service, with a backend API. Usage looks like this:

```js
const serviceA = new Service(stack, 'service-a', {
  environment,
  serviceDescription: serviceA
});
const serviceB = new Service(stack, 'service-a', {
  environment,
  serviceDescription: serviceA
});

serviceA.connectTo(serviceB);
```