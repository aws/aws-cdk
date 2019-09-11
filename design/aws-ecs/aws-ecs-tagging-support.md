# AWS ECS - Tagging Support

Amazon ECS supports tagging for all the ECS resources (see [here](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-using-tags.html)). Note that ECS provides a property of ECS service named `PropagateTags` to support propagating tags from either task definitions or services to tasks (tasks cannot be tagged using CDK without setting this parameter). Currently this property is not supported in CDK so that the tags are not propagated by default.

In addition, `EnableECSManagedTags` is provided as another property so that ECS managed tags can be supported and used to tag ECS tasks. However, currently users cannot set `EnableECSManagedTags` and the default value is `false`.

## General approach

The new `BaseService` class will include two more base properties:

* propagateTags
* enableECSManagedTags

`propagateTags` specifies whether to propagate the tags from the task definition or the service to ECS tasks and `enableECSManagedTags` specifies whether to enable Amazon ECS managed tags for the tasks within the service. Also, for `Ec2Service` and `FargateService` we will have the corresponding two new properties exposed to users:

* propagateTaskTagsFrom (`SERVICE` | `TASK_DEFINITION` | `NONE`)
* enableECSManagedTags (`true` | `false`)

\*`propagateTaskTagsFrom` has a default value of `SERVICE` and `enableECSManagedTags` has a default value of `true` \
\*`propagateTaskTagsFrom` takes enum type `PropagatedTagSource`.\
\*Note that the reason why we define `propagateTaskTagsFrom` is because we want to have a different name for `propagateTags` to eliminate the naming confusion.

In addition, for the `aws-ecs-patterns` module we want it to be convenient, but in this case, the `aws-ecs-patterns` module is opinionated. As a result, we want `SERVICE` and `true` to be set by default, not just for constructs in the `aws-ecs-patterns` module.

## Code changes

Given the above, we should make the following changes on ECS:

  1. Add an enum type `PropagatedTagSource` to support `propagateTaskTagsFrom`.
  2. Add `propagateTags` and `enableECSManagedTags` properties to `BaseServiceOptions`.
  3. Add `propagateTaskTagsFrom` properties to `Ec2ServiceProps` and `FargateServiceProps`.

### Part 1: Add enum type `PropagatedTagSource` to support `propagateTaskTagsFrom`

``` ts
export enum PropagatedTagSource {
  /**
   * Propagate tags from service
   */
  SERVICE = 'SERVICE',

  /**
   * Propagate tags from task definition
   */
  TASK_DEFINITION = 'TASK_DEFINITION',

  /**
   * Do not propagate
   */
  NONE = 'NONE'
}
```

### Part 2: Add `propagateTags` and `enableECSManagedTags` properties to `BaseServiceOptions`

```ts
export interface BaseServiceOptions {

  ...

   /**
   * Specifies whether to propagate the tags from the task definition or the service to the tasks in the service
   *
   * Valid values are: PropagateTagFromType.SERVICE or PropagateTagFromType.TASK_DEFINITION
   *
   * @default - PropagatedTagSource.SERVICE if EC2 or Fargate Service, otherwise PropagatedTagSource.NONE.
   */
  readonly propagateTags?: PropagatedTagSource;

   /**
   * Specifies whether to enable Amazon ECS managed tags for the tasks within the service. For more information, see
   * [Tagging Your Amazon ECS Resources](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-using-tags.html)
   *
   * @default true
   */
  readonly enableECSManagedTags?: boolean;
}
```

``` ts
/**
 * The base class for Ec2Service and FargateService services.
 */
export abstract class BaseService extends Resource
  implements IService, elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget {

  ...

  /**
   * Constructs a new instance of the BaseService class.
   */
  constructor(scope: Construct,
              id: string,
              props: BaseServiceProps,
              additionalProps: any,
              taskDefinition: TaskDefinition) {

    ...

    this.resource = new CfnService(this, "Service", {
      desiredCount: props.desiredCount,
      serviceName: this.physicalName,
      loadBalancers: Lazy.anyValue({ produce: () => this.loadBalancers }),
      deploymentConfiguration: {
        maximumPercent: props.maxHealthyPercent || 200,
        minimumHealthyPercent: props.minHealthyPercent === undefined ? 50 : props.minHealthyPercent
      },
      propagateTags: props.propagateTags === PropagatedTagSource.NONE ? undefined : props.propagateTags,
      enableEcsManagedTags: props.enableECSManagedTags === undefined ? true : props.enableECSManagedTags,
      launchType: props.launchType,
      healthCheckGracePeriodSeconds: this.evaluateHealthGracePeriod(props.healthCheckGracePeriod),
      /* role: never specified, supplanted by Service Linked Role */
      networkConfiguration: Lazy.anyValue({ produce: () => this.networkConfiguration }),
      serviceRegistries: Lazy.anyValue({ produce: () => this.serviceRegistries }),
      ...additionalProps
    });

    ...

  }

  ...

}
```

### Part 3: Add `propagateTaskTagsFrom` properties to `Ec2ServiceProps` and `FargateServiceProps`

``` ts
export interface Ec2ServiceProps extends BaseServiceOptions {

  ...

   /**
   * Specifies whether to propagate the tags from the task definition or the service to the tasks in the service.
   * Tags can only be propagated to the tasks within the service during service creation.
   *
   * @default  PropagatedTagSource.SERVICE
   */
  readonly propagateTaskTagsFrom?: PropagatedTagSource;
}
```

``` ts
/**
 * This creates a service using the EC2 launch type on an ECS cluster.
 *
 * @resource AWS::ECS::Service
 */
export class Ec2Service extends BaseService implements IEc2Service, elb.ILoadBalancerTarget {

  ...

  /**
   * Constructs a new instance of the Ec2Service class.
   */
  constructor(scope: Construct, id: string, props: Ec2ServiceProps) {

    ...

    super(scope, id, {
      ...props,
      // If daemon, desiredCount must be undefined and that's what we want. Otherwise, default to 1.
      desiredCount: props.daemon || props.desiredCount !== undefined ? props.desiredCount : 1,
      maxHealthyPercent: props.daemon && props.maxHealthyPercent === undefined ? 100 : props.maxHealthyPercent,
      minHealthyPercent: props.daemon && props.minHealthyPercent === undefined ? 0 : props.minHealthyPercent,
      launchType: LaunchType.EC2,
      propagateTags: props.propagateTaskTagsFrom === undefined ? PropagatedTagSource.SERVICE : props.propagateTaskTagsFrom,
      enableECSManagedTags: props.enableECSManagedTags,
    },
    {
      cluster: props.cluster.clusterName,
      taskDefinition: props.taskDefinition.taskDefinitionArn,
      placementConstraints: Lazy.anyValue({ produce: () => this.constraints }, { omitEmptyArray: true }),
      placementStrategies: Lazy.anyValue({ produce: () => this.strategies }, { omitEmptyArray: true }),
      schedulingStrategy: props.daemon ? 'DAEMON' : 'REPLICA',
    }, props.taskDefinition);

    ...

  }

  ...

}
```

``` ts
export interface FargateServiceProps extends BaseServiceOptions {

  ...

   /**
   * Specifies whether to propagate the tags from the task definition or the service to the tasks in the service.
   * Tags can only be propagated to the tasks within the service during service creation.
   *
   * @default  PropagatedTagSource.SERVICE
   */
  readonly propagateTaskTagsFrom?: PropagatedTagSource;
}
```


``` ts
/**
 * This creates a service using the Fargate launch type on an ECS cluster.
 *
 * @resource AWS::ECS::Service
 */
export class FargateService extends BaseService implements IFargateService {

  ...

  /**
   * Constructs a new instance of the FargateService class.
   */
  constructor(scope: cdk.Construct, id: string, props: FargateServiceProps) {

    ...

    super(scope, id, {
      ...props,
      desiredCount: props.desiredCount !== undefined ? props.desiredCount : 1,
      launchType: LaunchType.FARGATE,
      propagateTags: props.propagateTaskTagsFrom === undefined ? PropagatedTagSource.SERVICE : props.propagateTaskTagsFrom,
      enableECSManagedTags: props.enableECSManagedTags,
    }, {
      cluster: props.cluster.clusterName,
      taskDefinition: props.taskDefinition.taskDefinitionArn,
      platformVersion: props.platformVersion,
    }, props.taskDefinition);

    ...

  }

  ...

}
```

The `Ec2Service` and `FargateService` constructs will have two new properties:

* propagateTaskTagsFrom - Propagate tags from either ECS Task Definition or Service to Task.
* enableECSManagedTags - Enable ECS managed tags to ECS Task.

An example use case to create an EC2/Fargate service:

```ts
// Create Service
const service = new ecs.Ec2Service(stack, "Service", {
  cluster,
  taskDefinition,
  propagateTaskTagsFrom: ecs.PropagatedTagSource.TASK_DEFINITION,
  enableECSManagedTags: true,
});
```

``` ts
const service = new ecs.FargateService(stack, "Service", {
  cluster,
  taskDefinition,
  propagateTaskTagsFrom: ecs.PropagatedTagSource.TASK_DEFINITION,
  enableECSManagedTags: false,
});
```
