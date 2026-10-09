# CDK Resource Mixin Stub Implementation Steering Document

## Overview

This document outlines the approach for implementing stubs for the mixin pattern for AWS CDK resource classes.
The goal is to modularize resource functionality into discrete, reusable components that follow the single responsibility principle.

## Required Input

To implement mixin stubs, you will be provided with a Mixins Analysis document as input.
If you are not provided with this input, abort immediately and ask for it.
You may offer to generate this document, by following the [Resource Mixin Analysis Steering Document](mixin-analysis.md).

## Mixin Pattern Implementation

The mixin pattern allows us to decompose complex resource configurations into focused, single-responsibility components. Each mixin is responsible for a specific aspect of resource configuration and can be applied independently.

## Design Decisions

### 1. Dedicated Props Interfaces

Each mixin has its own dedicated interface (e.g., `FeatureMixinProps`) that contains only the properties relevant to that specific functionality. This approach:

- Improves type safety
- Makes the code more maintainable
- Provides better IDE support through clear property documentation
- Reduces the chance of using incorrect properties

**JSDoc Documentation Required**: All interfaces must include comprehensive JSDoc documentation with:

- Interface description explaining its purpose
- Property descriptions with clear explanations
- `@default` tags for optional properties where applicable

### 2. Props class property

Each mixin assign its properties from the input as a private class property:

```typescript
/**
 * The feature properties for this mixin
 */
private readonly props: FeatureMixinProps;

/**
 * Creates a new FeatureMixin
 * @param props - The feature properties
 */
constructor(props: FeatureMixinProps) {
  this.props = props;
}
```

This ensures that each mixin only has access to the properties it should be concerned with.

**JSDoc Documentation Required**: All class properties and constructors must include JSDoc documentation.

### 3. Returns the input resource

All mixin `apply()` methods return the resource after it has been updated.
The return type is the same as the input type.
Note that `CfnResource` is the respective L1 resource, e.g. `CfnBucket` for an S3 Bucket or `CfnFunction` a Lambda Function.

```typescript
/**
 * Applies feature configuration to the resource
 * @param resource - The CfnResource to configure
 * @returns The configured CfnResource
 */
public apply(resource: CfnResource): CfnResource {
  // Implementation will go here
  return resource;
}
```

**JSDoc Documentation Required**: All apply methods must include JSDoc documentation with `@param` and `@returns` tags.

## Integration with Resource Class

The mixins are integrated into the resource class through the `with()` method:

```typescript
const mixins: Mixin<CfnResource, any>[] = [
  new FeatureAMixin(props),
  new FeatureBMixin(props),
  // ... other mixins
];
this.with(...mixins);
```

This approach allows for:

- Easy addition or removal of functionality
- Clear separation of concerns
- Better testability of individual features

## JSDoc Documentation Requirements

All generated mixin code must include comprehensive JSDoc documentation:

### Interface Documentation

- Interface description explaining its purpose
- All properties with clear descriptions
- `@default` tags for optional properties
- Nested interface documentation where applicable

### Class Documentation

- Class description explaining the mixin's functionality
- Private property documentation
- Constructor documentation with `@param` tags
- Apply method documentation with `@param` and `@returns` tags

## Full example

```typescript
/**
 * Properties for the encryption mixin
 */
export interface EncryptionMixinProps {
  /**
   * The kind of server-side encryption to apply to this bucket
   */
  readonly encryption?: BucketEncryption;

  /**
   * External KMS key to use for bucket encryption
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * Whether Amazon S3 should use its own intermediary key to generate data keys
   */
  readonly bucketKeyEnabled?: boolean;
}

/**
 * Mixin for bucket encryption configuration
 */
export class EncryptionMixin implements Mixin<CfnBucket, CfnBucket> {
  /**
   * The encryption properties for this mixin
   */
  private readonly props: EncryptionMixinProps;

  /**
   * Creates a new EncryptionMixin
   * @param props - The encryption properties
   */
  constructor(props: EncryptionMixinProps) {
    this.props = props;
  }

  /**
   * Applies encryption configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    // Implementation will go here
    return resource;
  }
}
```

## Next Steps

1. Implement the actual functionality in each mixin's `apply()` method
2. Add unit tests for each mixin
3. Consider adding validation logic to ensure proper configuration
4. Document the public API for each mixin

## Benefits

This mixin-based approach provides several benefits:

- **Modularity**: Each feature is isolated in its own class
- **Maintainability**: Changes to one feature don't affect others
- **Extensibility**: New features can be added without modifying existing code
- **Clarity**: The resource class remains clean and focused on its core responsibility
- **Reusability**: Mixins could potentially be reused with other resource types

## Conclusion

The mixin pattern provides a clean and maintainable way to implement complex functionality for AWS CDK resources. By breaking down the functionality into discrete components, we create a more modular and maintainable codebase that is easier to extend and test in the future.
