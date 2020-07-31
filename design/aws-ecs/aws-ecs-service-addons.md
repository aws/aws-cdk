# AWS ECS - L3 Service construct

## The context

As we add more features to ECS one problem that must be faced is that ECS is not a standalone service. The strength of ECS is in its integration with other AWS services, so customer's expect these integrations to be as smooth and easy as possible. We must create CDK constructs that can help customers connect their ECS orchestrated application to other AWS services. The constructs in CDK must be extensible enough address all the possible integrations that users may want to enable on their ECS service.

Currently we have built out a set of L3 constructs:

- `ApplicationLoadBalancedEc2Service`, `ApplicationLoadBalancedFargateService`
- `NetworkLoadBalancedEc2Service`, `NetworkLoadBalancedFargateService`
- `QueueProcessingEc2Service`, `QueueProcessingFargateService`
- `ScheduledEc2Task`, `ScheduledFargateTask`

These classes are useful as starter patterns, but aren't very flexible. Most of the decisions about the resulting architecture and integratons are made in the class name itself. Only a few customizations can be made to the resulting architecture via the properties passed to the constructor.

The current approach of many different architecture specific L3 constructs is not scalable. Imagine if users want a service which has both an ALB and a service mesh sidecar. This would require us to create a new pattern called something like: `ApplicationLoadBalancedAppMeshEc2Service`

Following this trend it is easy to predict that over time we will accumulate more and more classes for various combinations of features. No matter how many of these classes we create it will never be possible to satisfy all the customer demands for all the various permutations of features that customers may want to turn on.

Another angle to the problem is the internal code organization of how these ECS adjacent features are supported in the ECS CDK codebase. Consider the FireLens feature. We have support for FireLens in the `TaskDefinition` construct via a method `TaskDefinition.addFirelensLogRouter()`. This works but now consider if wanted to support X-Ray, App Mesh, and CloudWatch Agent. We would need new methods like:

- `TaskDefinition.addXRayDaemon()`
- `TaskDefinition.addAppMeshEnvoy()`
- `TaskDefinition.addCloudwatchAgent()`

As a result the TaskDefinition L2 construct would become an ever growing monolithic collection of code that pertains to other services, instead of just focusing on ECS as it should be. I believe that this problem is contributing to lack of progress on the development of higher level abstractions for ECS integrations, because these features can not be added to the existing codebase using existing patterns without introducing bloated complexity to the L2 construct classes.

Another challenge is that some features such as App Mesh require resources and settings across multiple construct types. For example App Mesh requires that the service be modified to have a CloudMap namespace, it must modify the task definition to have an Envoy sidecar and proxy settings, and it must have created App Mesh specific resources like Virtual Node and Virtual Service. There is no single place for all of this cross construct logic to live in the current construct architecture.

Last but not least the existing approach to L3 constructs has an `Ec2` and a `Fargate` version of each L3 construct. Ideally there would be a way for customers to create a service which is agnostic to whether it is deployed on EC2 or Fargate.

## Goals

To solve the problems with ECS construct implemention we propose adding a new `Service` class with the following goals:

- __One service class to learn__: Instead of a collection of many different L3 classes that all have different names there is a single class which can implement any number of different forms depending on what the customer wants. Customers don't need to learn the names for different L3 constructs. All architectures start the same way: with the same `Service` class.
- __Easy to extend and customize__: It is easy to extend the `Service` class with new behaviors and features, in any combination required. The `Service` class comes with batteries included: a set of easy to use extensions created and maintained by the AWS team. However there are also clear instructions and examples of how customers can create their own custom extensions. Third parties will be enabled to also create and distribute extensions for their own services, for example a provider like Datadog could easily build an extension that automatically adds Datadog agent to an ECS service.
- __Extensions self configure and self provision__: Service extensions provision their own resources as well as configuring the ECS service to use those resources. For example a load balancer extension creates its own load balancer and also attaches the ECS service to the load balancer. An App Mesh extension creates its own App Mesh virtual service and virtual node as well as configuring the ECS service and ECS task definition to have the right Envoy sidecar and proxy settings.
- __Extensions are aware of each other__: There are no hidden "gotchas" when enabling a service extension. Extensions know of each other's existence. For example the application's container is aware that there is an Envoy proxy and that it must wait until the Envoy proxy has started before the app starts.
- __Service class is agnostic to EC2 vs Fargate__: Rather than choosing the capacity strategy in the class name customers just create a service, and add it to an environment. The service automatically modifies its settings as needed to adjust to the capacity available in the environment.

## `Service` Implementation 1: Lazy evaluating construct

A new `Service` class which is a `cdk.Construct` with a method `Service.add()` This method is used to add an extension to the service. Each extension is responsible for customizing the service to support a specific feature. The following example shows one proposal for how the end user instantiates a service with various features enabled:

```js
const myService = new Service(stack, 'my-service', {});
myService.add(new Container({
  cpu: 1024,
  memoryMiB: 2048,
  trafficPort: 80,
  image: ContainerImage.fromRegistry('nathanpeck/greeter')
}));
myService.add(new AppMeshExtension({ mesh }));
myService.add(new FireLensExtension());
myService.add(new XRayExtension());
myService.add(new CloudwatchAgentExtension());
myService.add(new HttpLoadBalancerExtension());

const myEnvironment = new Environment(stack, 'production', {
  vpc: vpc,
  cluster: cluster,
  capacityType: capacityTypes.EC2 || capacityTypes.FARGATE
});
myEnvironment.addService(myService);
```

In this implementation Service is a `cdk.Construct`. However it differs a bit from other CDK L2+ constructs. Most CDK constructs are fully assembled in the constructor and are then mostly immutable except for some properties or methods. This `Service` class is not like those constructs. The constructor does nothing but initialize an empty list of extensions. Users add extensions to this list, to define their intention about what should be built later on. The underlying constructs that make up the servie and its associated extensions do not actually exist at this point. The only thing that exists is a list of user specified intentions about what they want to add to the service.

When `Environment.addService()` is called the class actually evaluates all of the extensions and defines resources to create at that time. From that point on the underlying resources have been added to the stack and the construct is now immutable. You can no longer add more extensions as the service has already been "locked in".

## `Service` Implementation 2: A more traditional CDK construct

A new `ServiceDescription` class and a `Service` class which is a `cdk.Construct`. Usage like this:

```js
const myServiceDesc = new ServiceDescription();
myServiceDesc.add(new Container({
  cpu: 1024,
  memoryMiB: 2048,
  trafficPort: 80,
  image: ContainerImage.fromRegistry('nathanpeck/greeter')
}));
myServiceDesc.add(new AppMeshExtension({ mesh }));
myServiceDesc.add(new FireLensExtension());
myServiceDesc.add(new XRayExtension());
myServiceDesc.add(new CloudwatchAgentExtension());
myServiceDesc.add(new HttpLoadBalancerExtension());

const myEnvironment = new Environment(stack, 'production', {
  vpc: vpc,
  cluster: cluster,
  capacityType: capacityTypes.EC2 || capacityTypes.FARGATE
});

const myService = new Service(stack, myService, {
  environment: myEnvironment
  serviceDescription: myServiceDesc
});
```

This implementation looks slightly more complicated, but it is more traditional in behavior compared to other CDK constructs. The lazy evaluating construct looks more simple to understand when you are starting out, but it may lead to some customer confusion because it does not actually create any resources until later. For example if you tried to access a subproperty of the service before adding the service to the environment you would find that the property is undefined.

With this alternate approach the `ServiceDescription` is not a `cdk.Construct`, it is just a helper class which is used as a semantic wrapper to define the intent for what to create. Because of this there should be no customer expectation that it has accessible construct properties on it. When the `Service` is instantiated the `ServiceDescription` is passed to the constructor and the `Service` builds itself out according to the description.

The benefit of this approach is that the `Service` class behaves like a traditional construct: it immeadiately defines all the resources in the constructor as most CDK resources do, and all properties are accessible right away and immutable from the time of construction rather than from an arbitrary future point when the serivce is added to an environment.

## Choosing a `Service` implementation

Of the two implementations the first is slightly friendlier to look at and has one less "term" to learn. However the danger is that it introduces an inconsistency of construct behavior. Because of that the slightly more complex second implementation may be preferable.

## Extension Implemention

Each extension is a collection of functions which are executed by the `Service` class when the service is added to an environment. An extension is never called directly by end users, only added to a `Service`. The methods on an extension are only called by the `Service` class itself when it is constructing itself.

The functions that make up an extension are executed in the order that the extensions were added to the service. Some functions are mutating hooks which modify service or task definition properties prior to these constructs being created. Other functions are called after each construct has been created so that the extension can make use of the construct.

The hooks for an extension are as follows:

- `addHooks()` - This hook is called after all the extensions are added, but before anything else has been run. It gives each extension a chance to do some inspection of the overall service and see what other extensions have been added. Some extension may want to register hooks on the other extension to modify them. For example the Firelens extension wants to be able to modify the settings of the application container to route logs through Firelens.
- `modifyTaskDefinitionProps()` - This is hook is passed the proposed `ecs.TaskDefinitionProps` for a TaskDefinition that is about to be created. This allows the extension to make modifications to the task definition props before the `TaskDefinition` is created. For example the App Mesh extension modifies the proxy settings for the task.
- `useTaskDefinition()` - After the `TaskDefinition` is created, this hook is passed the actual `TaskDefinition` construct that was created. This allows the extension to add containers to the task, modify the task definition's IAM role, etc.
- `resolveContainerDependencies()` - Once all extensions have added their containers each extension is given a chance to modify its container's `dependsOn` settings. Extensions need to check and see what other extensions were enabled, and decide whether their container needs to wait on another container to start first.
- `modifyServiceProps()` - Before an `Ec2Service` or `FargateService` is created this hook is passed a draft version of the service props to change. Each extension adds its own modifications to the service properties. For example the App Mesh extension needs to modify the service settings to enable CloudMap service discovery.
- `useService()` - After the service is created this hook is given a chance to utilize the service that was created. This is used by extensions like the load balancer or App Mesh extension which create and link other AWS resources to the ECS extension.
- `connectToService()` - This hook is called when a user wants to connect one service to another service. It allows an extension to implement logic about how to allow connections from one service to another. For example the App Mesh extension implements this method so that you can easily connect one service mesh service to another so that the service's Envoy proxy sidecars know how to route traffic to each other.

A combination of these hooks should be able to implement any type of functionality that needs to be attached to an ECS service. If we identify new use cases that aren't served by this collection of hooks we can add new hooks to enable new extension types without breaking existing extensions.

A customer can easily create their own extension by creating a class that adheres to the spec, with hooks that have the same name. They can put their own logic in each hook.

## Concerns with extensions

__Do we anticipate certain extensions conflicting with each other?__

Yes it is possible that extensions may conflict with each other. It is the responsibility of each extension to check for other extensions at the time of being added to the service and throw an exception if there is an expected conflict.

__Given that ECS patterns are meant to push best practices in application infrastructure/architecture, how will we provide that guidance with extensions?__

The goal of these extensions is to do the right thing by default, similar to the existing ECS patterns, but the user just has more choices about what combinations of feature integrations they want to enable. When using the built-in extensions there should be no "bad" choices. If a user wants to leave out an extension it is safe to do so, and if they chose to enable it there should be no gotchas from adding another extension. The goal is to make this hard to misuse, but still powerful and extendable.

## Environments

As part of this proposal there is also a new construct called `Environment`. This construct is deliberately designed to be similar to [AWS Copilot environments](https://github.com/aws/copilot-cli). The intention is that an environment is an opaque wrapper for a VPC, cluster, and any other such resources that the service needs. The environment understands whether it is using EC2 or Fargate capacity. A `Service` is added to an `Environment`. The `Service` changes to EC2 mode if the environment is set to have EC2 capacity. The `Service` changes to Fargate mode if the environment is set to have Fargate capacity.

## Future Looking (Out of scope for first release version)

### Environment extensions

There is potential here for customers to eventually add an extension to an environment as well as adding extensions to a service. Adding an extension to the environment would automatically add that extension on all services that are added to the environment. The service would inherit all environment level extensions on top of any locally defined extensions. For example, this would allow operations minded orgs to enforce that all services in an environment have a mandatory security sidecar attached. It would also serve as a DRY simplification for attaching an extension globally if there is an extension that needs to be on every single service anyway.

### Service (and environment) traits

A future goal is to add support for a new feature called "traits". The idea behind this is to allow customers to modify the behavior of all of their extensions via higher level intentions about how the service should behave. Traits are higher level adjectives that describe how the service should be configured. For example some traits could be:

- "cost optimized"
- "performance optimized"
- "high availability"

The service would then self configure based on the traits that the customer selected. For example if the service had the "cost optimized" trait for a development environment it might choose to deploy the smallest possible AWS Fargate task size, and only one of them. However the "performance optimized" or "high availability" traits would override this to deploy multiple copies that are larger.

Each extension would be responsible for implementing traits however it choses. For example the FireLens logging extension might decide to implement "cost optimized" by setting a TTL on log files so that they don't accumulate and cost money for storage. However if there was a "data retention" trait that would instead cause FireLens to retain all logs forever for auditing.

This "traits" feature needs more thought before implementation, but it has potential to make it much easier for customer's to define their intention for behavior without needing to explicitly set lower level settings.