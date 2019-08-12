# Tagging API Change

CDK support tagging and can cascade tags to all its taggable children (see [here](https://docs.aws.amazon.com/cdk/latest/guide/tagging.html)). The current CDK tagging API is shown below:

``` ts
myConstruct.node.applyAspect(new Tag('key', 'value'));

myConstruct.node.applyAspect(new RemoveTag('key', 'value'));
```

As we can see, the current tagging API is not nice and grammatically verbose for using, since there is no reason to expose `node` to users and `applyAspect` does not indicate anything towards tags, which leaves room for improvement. Also, users need to create two objects to add tag and remove tag which causes confusion to some degree.

## General approach

For the tagging behavior part, we propose using just one entry point `Tag` for the new tagging API:

``` ts
Tag.add(myConstruct, 'key', 'value');

Tag.remove(myConstruct, 'key');
```

## Code changes

Given the above, we should make the following changes:
  1. Add two methods `add` and `remove` to `Tag` class, which calls `applyAspect`to add tags or remove tags.

# Part1: Change CDK Tagging API

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
