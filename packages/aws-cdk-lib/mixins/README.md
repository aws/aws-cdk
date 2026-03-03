# CDK Mixins

CDK Mixins are an advanced technique to add functionality through composable abstractions.
Unlike traditional L2 constructs that bundle all features together, Mixins allow you to pick and choose exactly the capabilities you need for constructs.

Mixins are an *addition*, not a replacement for construct properties.
They are applied during or after construct construction using the `.with()` method:

```ts fixture=README-mixins
// Apply mixins fluently with .with()
new s3.CfnBucket(scope, "MyL1Bucket")
  .with(new EncryptionAtRest())
  .with(new AutoDeleteObjects());

// Apply multiple mixins to the same construct
new s3.CfnBucket(scope, "MyL1Bucket")
  .with(new EncryptionAtRest(), new AutoDeleteObjects());

// Mixins work with all types of constructs:
// L1, L2 and even custom constructs
new s3.Bucket(stack, 'MyL2Bucket').with(new EncryptionAtRest());
new CustomBucket(stack, 'MyCustomBucket').with(new EncryptionAtRest());
```

There is an alternative form available that allows additional, advanced configuration of Mixin application: `Mixins.of()`.

```ts fixture=README-mixins
import { ConstructSelector } from "aws-cdk-lib/mixins";

// Basic: Apply mixins to any construct, calls can be chained
const myBucket = new s3.CfnBucket(scope, "MyBucket");
Mixins.of(myBucket)
  .apply(new EncryptionAtRest())
  .apply(new AutoDeleteObjects());

// Basic: Or multiple Mixins passed to apply
Mixins.of(myBucket)
  .apply(new EncryptionAtRest(), new AutoDeleteObjects());

// Advanced: Apply to constructs matching a selector, e.g. match by ID
Mixins.of(
  scope,
  ConstructSelector.byId("prod/**") 
).apply(new ProductionSecurityMixin());

// Advanced: Require a mixin to be applied to every node in the construct tree
Mixins.of(stack)
  .apply(new ProductionSecurityMixin())
  .requireAll();
```

## How Mixins are applied

Each construct has a `with()` method and Mixins will be applied to all nodes of the construct.
Sometimes more control is needed.
Especially when authoring construct libraries, it may be desirable to have full control over the Mixin application process.
Think of the L3 pattern again: How can you encode the rules to which Mixins may or may not be applied in your L3?
This is where `Mixins.of()` and the `MixinApplicator` class come in.
They provide more complex ways to select targets, apply Mixins and set expectations.

### Mixin application on construct trees

When working with construct trees like Stacks (as opposed to single resources),
`Mixins.of()` offers a more comprehensive API to configure how Mixins are applied.
By default, Mixins are applied to all supported constructs in the tree:

```ts fixture=README-mixins
// Apply to all constructs in a scope
Mixins.of(scope).apply(new EncryptionAtRest());
```

Optionally, you may select specific constructs:

```ts fixture=README-mixins
import { ConstructSelector } from "aws-cdk-lib/mixins";

// Apply to a given L1 resource or L2 resource construct
Mixins.of(
  bucket,
  ConstructSelector.cfnResource() // provided CfnResource or a CfnResource default child
).apply(new EncryptionAtRest());

// Apply to all resources of a specific type
Mixins.of(
  scope,
  ConstructSelector.resourcesOfType(s3.CfnBucket.CFN_RESOURCE_TYPE_NAME)
).apply(new EncryptionAtRest());

// Alternative: select by CloudFormation resource type name
Mixins.of(
  scope,
  ConstructSelector.resourcesOfType("AWS::S3::Bucket")
).apply(new EncryptionAtRest());

// Apply to constructs matching a pattern
Mixins.of(
  scope,
  ConstructSelector.byId("prod/**") 
).apply(new ProductionSecurityMixin());

// The default is to apply to all constructs in the scope
Mixins.of(
  scope,
  ConstructSelector.all() // pass through to IConstruct.findAll()
).apply(new ProductionSecurityMixin());
```

### Mixins that must be used

Sometimes you need assertions that a Mixin has been applied to certain set of constructs.
`Mixins.of(...)` keeps track of Mixin applications and this report can be used to create assertions.

It comes with two convenience helpers:
Use `requireAll()` to assert the Mixin will be applied to all selected constructs.
If a construct is in the selection that is not supported by the Mixin, this will throw an error.
The `requireAny()` helper will assert the Mixin was applied to at least one construct from the selection.
If the Mixin wasn't applied to any construct at all, this will throw an error.

Both helpers will only check future calls of `apply()`.
Set them before calling `apply()` to take effect.

```ts fixture=README-mixins
Mixins.of(scope, selector)
  // Assert Mixin was applied to all constructs in the selection
  .requireAll()
  // Or assert Mixin was applied to at least one construct in the selection
  // .requireAny()
  .apply(new EncryptionAtRest());

// Get an application report for manual assertions
const report = Mixins.of(scope).apply(new EncryptionAtRest()).report;
```

## Creating Custom Mixins

Mixins are simple classes that implement the `IMixin` interface (usually by extending the abstract `Mixin` class):

```ts fixture=README-mixins
class EnableVersioning extends Mixin implements IMixin {
  supports(construct: any): construct is s3.CfnBucket {
    return s3.CfnBucket.isCfnBucket(construct);
  }

  applyTo(bucket: IConstruct): void {
    (bucket as s3.CfnBucket).versioningConfiguration = {
      status: "Enabled"
    };
  }
}

// Usage
new s3.CfnBucket(scope, "MyBucket")
  .with(new EnableVersioning());
```

We recommend to implement Mixins at the L1 level and to have them target a specific resource construct.
This way, the same Mixin can be applied to constructs from all levels.

When applied, the `.supports()` method is used to decided if a Mixin can be applied to a given construct.
Depending on the application method (see below), the Mixin is then applied, skipped or an error is thrown.

```ts fixture=README-mixins
bucketAccessLogsMixin.supports(bucket); // returns `true`
bucketAccessLogsMixin.supports(queue); // returns `false`
```

### Validation with Mixins

Mixins have two distinct phases: Initialization and application.
During initialization only the Mixin's input properties are available, but during application we also have access the target construct.

Mixins should validate their properties and targets as early as possible.
During initialization validate all input properties.
Then during application validate any target dependent pre-conditions or interactions with Mixin properties.

Like with constructs, Mixins should *throw an error* in case of unrecoverable failures and use *annotations* for recoverable ones.
It is best practices to collect errors and throw as a group whenever possible.
Mixins can attach *[lazy validators](https://github.com/aws/aws-cdk/blob/main/docs/DESIGN_GUIDELINES.md#attaching-lazy-validators)* to the target construct.
Use this to ensure a certain property is met at end of an app's execution.

```ts fixture=README-mixins
class MyEncryptionAtRest extends Mixin {
  constructor(props: MyEncryptionAtRestProps = {}) {
    super();
    // Validate Mixin props at construction time
    if (props.bucketKey && props.algorithm === 'aws:kms:dsse') {
      throw new Error("Cannot use S3 Bucket Key and DSSE together");
    }
  }

  supports(construct: any): construct is s3.CfnBucket {
    return s3.CfnBucket.isCfnBucket(construct);
  }

  applyTo(target: s3.CfnBucket): s3.CfnBucket {
    // Validate pre-conditions on the target, throw if error is unrecoverable
    if (!target.bucketEncryption) {
      throw new Error("Bucket encryption not configured");
    }

    // Validate properties are met after app execution
    target.node.addValidation({
      validate: () => isKmsEncrypted(target)
        ? ['This bucket must use aws:kms encryption.']
        : []
    });

    target.bucketEncryption = {
      serverSideEncryptionConfiguration: [{
        bucketKeyEnabled: true,
        serverSideEncryptionByDefault: {
          sseAlgorithm: "aws:kms"
        }
      }]
    };
    return target;
  }
}
```

### Mixins and Aspects

Mixins and Aspects are similar concepts and both are implementations of the [visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern).
They crucially differ in their time of application:

- Mixins are always applied *immediately*, they are a tool of *imperative* programming.
- Aspects are applied *after* all other code during the synthesis phase, this makes them *declarative*.

Both Mixins and Aspects have valid use cases and complement each other.
We recommend to use Mixins to *make changes*, and to use Aspects to *validate behaviors*.
Aspects may also be used when changes need to apply to *future additions*, for examples in custom libraries.
