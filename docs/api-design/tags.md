## Tags

The AWS platform has a powerful tagging system that can be used to tag resources
with key/values. The AWS CDK exposes this capability through the **Tag**
“aspect”, which can seamlessly tag all resources within a subtree:

```ts
// add a tag to all taggable resource under "myConstruct"
myConstruct.node.apply(new cdk.Tag("myKey", "myValue"));
```

Constructs for AWS resources that can be tagged must have an optional **tags**
hash in their props [_awslint:tags-prop_].
