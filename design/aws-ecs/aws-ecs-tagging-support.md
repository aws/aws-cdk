# AWS ECS - Tagging Support and Tagging API Change

Amazon ECS supports tagging for all the ECS resources (see [here](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-using-tags.html)). Note that ECS provides a property of ECS service named `PropagateTags` to support propagating tags from either task definitions or services to tasks (tasks cannot be tagged using CDK without setting this parameter). Currently this property is not set in CDK so that the tags are not propagated by default.

In addition, `EnableECSManagedTags` is provided as another property so that ECS managed tags can be supported and used to tag ECS tasks. However, currently users cannot set `EnableECSManagedTags` and the default value is `false`.

Additionally, CDK support tagging and can cascade tags to all its taggable children (see [here](https://docs.aws.amazon.com/cdk/latest/guide/tagging.html)). The current CDK tagging API is shown below:

``` ts
myConstruct.node.applyAspect(new Tag('key', 'value'));

myConstruct.node.applyAspect(new RemoveTag('key', 'value'));
```

As we can see, the current tagging API is not nice and grammatically verbose for using, since there is no reason to expose `node` to users and `applyAspect` is not intuitive enough, which leaves room for improvement.

## General approach

The new `BaseService` class will include two more base properties:

* propagateTags
* enableECSManagedTags

`propagateTags` specifies whether to propagate the tags from the task definition or the service to ECS tasks and `enableECSManagedTags` specifies whether to enable Amazon ECS managed tags for the tasks within the service. Also, for `Ec2Service` and `FargateService` we will have the corresponding two new properties exposed to users:

* propagateTaskTagsFrom
* enableECSManagedTags

*Note that the reason why we define `propagateTaskTagsFrom` is because we want to have a different name for `propagateTags` to eliminate the naming confusion.*

For the tagging behavior part, we propose using just one entry point `Tag` for the new tagging API:

``` ts
Tag.add(myConstruct, 'key', 'value');

Tag.remove(myConstruct, 'key');
```

## Code changes

Given the above, we should make the following changes on ECS:
* Support tag propagation for ECS task and ECS managed tags
  1. Add `propagateTags` and `enableECSManagedTags` properties to `BaseServiceOptions`.
  2. Add `propagateTaskTagsFrom` and `enableECSManagedTags` properties to `Ec2ServiceProps` and `FargateServiceProps`.
  3. Add an enum type `PropagateTagsFromType` to support `propagateTaskTagsFrom`.
* Change CDK Tagging API.
  1. Add two methods `add(scope, key, value, props)` and `remove(scope, key, props)` to `Tag` class, which calls `applyAspect` and implementing tags adding and removal.

# Part 1: Support Tag Propagation for ECS Task and ECS Managed Tags

```ts
export interface BaseServiceOptions {

  ...

   /**
   * Specifies whether to propagate the tags from the task definition or the service to the tasks in the service
   *
   * Valid values are: PropagateTagFromType.SERVICE or PropagateTagFromType.TASK_DEFINITION
   *
   * @default SERVICE
   */
  readonly propagateTags?: PropagateTagsFromType;

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
export enum PropagateTagsFromType {
  /**
   * Propagate tags from service
   */
  SERVICE = 'SERVICE',

   /**
   * Propagate tags from task definition
   */
  TASK_DEFINITION = 'TASK_DEFINITION'
}
```

``` ts
export interface Ec2ServiceProps extends BaseServiceOptions {

  ...

   /**
   * Specifies whether to propagate the tags from the task definition or the service to the tasks in the service.
   * Tags can only be propagated to the tasks within the service during service creation.
   *
   * @default SERVICE
   */
  readonly propagateTaskTagsFrom?: PropagateTagsFromType;
}
```

``` ts
export interface FargateServiceProps extends BaseServiceOptions {

  ...

   /**
   * Specifies whether to propagate the tags from the task definition or the service to the tasks in the service.
   * Tags can only be propagated to the tasks within the service during service creation.
   *
   * @default SERVICE
   */
  readonly propagateTaskTagsFrom?: PropagateTagsFromType;
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
  propagateTaskTagsFrom: ecs.PropagateTagsFromType.TASK_DEFINITION,
  enableECSManagedTags: true,
});
```

# Part2: Change CDK Tagging API

Implementation for the new tagging API is shown below:

``` ts
/**
 * The Tag Aspect will handle adding a tag to this node and cascading tags to children
 */
export class Tag extends TagBase {

  /**
   * add tags to the node of a construct and all its the taggable children
   */
  public static add(scope: Construct, key: string, value: string, props: TagProps = {}) {
    scope.node.applyAspect(new Tag(key, value, props));
  }

  /**
   * remove tags to the node of a construct and all its the taggable children
   */
  public static remove(scope: Construct, key: string, props: TagProps = {}) {
    scope.node.applyAspect(new RemoveTag(key, props));
  }

  ...
}
```

And below is an example use case demonstrating how the adjusted tagging API works:

``` ts
// Create Task Definition
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

// Create Service
const service = new ecs.Ec2Service(stack, "Service", {
  cluster,
  taskDefinition,
});

Tag.add(taskDefinition, 'tfoo', 'tbar');
Tag.remove(taskDefinition, 'foo', 'bar');

Tag.add(service, 'sfoo', 'sbar');
Tag.remove(service, 'foo', 'bar');
```
