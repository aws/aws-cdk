# CDK Mixins (Preview)
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

CDK Mixins provide a new, advanced way to add functionality through composable abstractions.
Unlike traditional L2 constructs that bundle all features together, Mixins allow you to pick and choose exactly the capabilities you need for constructs.

## Key Benefits

* **Universal Compatibility**: Apply the same abstractions to L1 constructs, L2 constructs, or custom constructs
* **Composable Design**: Mix and match features without being locked into specific implementations  
* **Cross-Service Abstractions**: Use common patterns like encryption across different AWS services
* **Escape Hatch Freedom**: Customize resources in a safe, typed way while keeping the abstractions you want

## Basic Usage

Mixins use `Mixins.of()` as the fundamental API for applying abstractions to constructs:

```typescript
// Base form: apply mixins to any construct
const bucket = new s3.CfnBucket(scope, "MyBucket");
Mixins.of(bucket)
  .apply(new EncryptionAtRest())
  .apply(new AutoDeleteObjects());
```

### Fluent Syntax with `.with()`

For convenience, you can use the `.with()` method for a more fluent syntax:

```typescript
import '@aws-cdk/mixins-preview/with';

const bucket = new s3.CfnBucket(scope, "MyBucket")
  .with(new EnableVersioning())
  .with(new AutoDeleteObjects());
```

The `.with()` method is available after importing `@aws-cdk/mixins-preview/with`, which augments all constructs with this method. It provides the same functionality as `Mixins.of().apply()` but with a more chainable API.

> **Note**: The `.with()` fluent syntax is only available in JavaScript and TypeScript. Other jsii languages (Python, Java, C#, and Go) should use the `Mixins.of(...).mustApply()` syntax instead. The import requirement is temporary during the preview phase. Once the API is stable, the `.with()` method will be available by default on all constructs and in all languages.

## Creating Custom Mixins

Mixins are simple classes that implement the `IMixin` interface:

```typescript
// Simple mixin that enables versioning
class CustomVersioningMixin implements IMixin {
  supports(construct: any): boolean {
    return construct instanceof s3.CfnBucket;
  }

  applyTo(bucket: any): any {
    bucket.versioningConfiguration = {
      status: "Enabled"
    };
    return bucket;
  }
}

// Usage
const bucket = new s3.CfnBucket(scope, "MyBucket");
Mixins.of(bucket).apply(new CustomVersioningMixin());
```

## Construct Selection

Mixins operate on construct trees and can be applied selectively:

```typescript
// Apply to all constructs in a scope
Mixins.of(scope).apply(new EncryptionAtRest());

// Apply to specific resource types
Mixins.of(scope, ConstructSelector.resourcesOfType(s3.CfnBucket))
  .apply(new EncryptionAtRest());

// Apply to constructs matching a pattern
Mixins.of(scope, ConstructSelector.byId(/.*-prod-.*/))
  .apply(new ProductionSecurityMixin());
```

## Built-in Mixins

### Cross-Service Mixins

**EncryptionAtRest**: Applies encryption to supported AWS resources

```typescript
// Works across different resource types
const bucket = new s3.CfnBucket(scope, "Bucket");
Mixins.of(bucket).apply(new EncryptionAtRest());

const logGroup = new logs.CfnLogGroup(scope, "LogGroup");
Mixins.of(logGroup).apply(new EncryptionAtRest());
```

### S3-Specific Mixins

**AutoDeleteObjects**: Configures automatic object deletion for S3 buckets

```typescript
const bucket = new s3.CfnBucket(scope, "Bucket");
Mixins.of(bucket).apply(new AutoDeleteObjects());
```

**EnableVersioning**: Enables versioning on S3 buckets

```typescript
const bucket = new s3.CfnBucket(scope, "Bucket");
Mixins.of(bucket).apply(new EnableVersioning());
```

### Generic Mixins

**CfnPropertiesMixin**: Applies arbitrary CloudFormation properties

```typescript
const bucket = new s3.CfnBucket(scope, "Bucket");
Mixins.of(bucket).apply(new CfnPropertiesMixin({ 
  customProperty: { enabled: true }
}));
```

## Error Handling

Mixins provide comprehensive error handling:

```typescript
// Graceful handling of unsupported constructs
Mixins.of(scope)
  .apply(new EncryptionAtRest()); // Skips unsupported constructs

// Strict application that requires all constructs to match
Mixins.of(scope)
  .mustApply(new EncryptionAtRest()); // Throws if no constructs support the mixin
```

## API Reference

### Core Interfaces

* `IMixin` - Interface that all mixins must implement
* `Mixins` - Main entry point for applying mixins
* `ConstructSelector` - Selects constructs from a tree based on criteria
* `MixinApplicator` - Applies mixins to selected constructs

### Mixins

* `EncryptionAtRest` - Cross-service encryption mixin
* `AutoDeleteObjects` - S3 auto-delete objects mixin  
* `EnableVersioning` - S3 versioning mixin
* `CfnPropertiesMixin` - Generic CloudFormation properties mixin

### Selectors

* `ConstructSelector.all()` - Select all constructs
* `ConstructSelector.cfnResource()` - Select CfnResource constructs
* `ConstructSelector.resourcesOfType()` - Select by type
* `ConstructSelector.byId()` - Select by ID pattern

## License

This project is licensed under the Apache-2.0 License.
