# AWS CDK Core

See top-level [README](../README.md).

## Removal Policy Options

The `applyRemovalPolicy` method on L2 constructs now accepts an optional `RemovalPolicyOptions` parameter, allowing you to control whether the policy also applies to the `UpdateReplacePolicy`:

```ts
declare const resource: core.Resource;
resource.applyRemovalPolicy(core.RemovalPolicy.RETAIN, {
  applyToUpdateReplacePolicy: false,
});
```
