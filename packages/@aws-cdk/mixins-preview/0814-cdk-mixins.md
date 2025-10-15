# CDK Mixins: Composable Abstractions for AWS Resources

* **Original Author(s):**: @kornherm
* **Tracking Issue**: #814
* **API Bar Raiser**: @rix0r

CDK Mixins are composable, reusable abstractions that can be applied to any construct (L1, L2 or custom).
They are breaking down the traditional barriers between construct levels,
allowing customers to mix and match sophisticated features without being locked into specific implementations.

## Working Backwards

### README: CDK Mixins

CDK Mixins provide a new, advanced way to add functionality to through composable abstractions.
Unlike traditional L2 constructs that bundle all features together, Mixins allow you to pick and choose exactly the capabilities you need for constructs.

#### Key Benefits

* **Universal Compatibility**: Apply the same abstractions to L1 constructs, L2 constructs, or custom constructs
* **Composable Design**: Mix and match features without being locked into specific implementations
* **Cross-Service Abstractions**: Use common patterns like encryption across different AWS services
* **Escape Hatch Freedom**: Customize resources in a safe, typed way while keeping the abstractions you want

#### Basic Usage

Mixins use `Mixins.of()` as the fundamental API for applying abstractions to constructs:

```typescript
import * as s3 from "aws-cdk-lib/aws-s3";
import { Mixins, AutoDeleteObjects, EncryptionAtRest } from "aws-cdk-lib/mixins";

// Base form: apply mixins to any construct
// calls can be chained
const bucket = new s3.CfnBucket(scope, "MyBucket");
Mixins.of(bucket)
  .apply(new EncryptionAtRest())
  .apply(new AutoDeleteObjects());
```

For convenience, constructs implement the `.with()` method as syntactic sugar:

```typescript
// Syntactic sugar: chain mixins fluently
const l1Bucket = new s3.CfnBucket(scope, "MyL1Bucket")
  .with(new EncryptionAtRest())
  .with(new AutoDeleteObjects());

const l2Bucket = new s3.Bucket(scope, "MyL2Bucket")
  .with(new EncryptionAtRest())
  .with(new AutoDeleteObjects());

// Works with any construct type
const customBucket = new AcmeBucket(scope, "MyCustomBucket")
  .with(new EncryptionAtRest())
  .with(new AutoDeleteObjects());
```

#### Creating Custom Mixins

Mixins are simple classes that implement the `IMixin` interface:

```typescript
import { IMixin } from "aws-cdk-lib/mixins";
import * as s3 from "aws-cdk-lib/aws-s3";

// Simple mixin that enables versioning
class EnableVersioning implements IMixin {
  supports(construct: IConstruct): boolean {
    return construct instanceof s3.CfnBucket;
  }

  applyTo(bucket: IConstruct): IConstruct {
    bucket.versioningConfiguration = {
      status: "Enabled"
    };
    return bucket;
  }
}

// Usage
const bucket = new s3.CfnBucket(scope, "MyBucket")
  .with(new EnableVersioning());
```

#### Mixins operate on Construct Trees

By default, mixins are applied to all supported constructs in the tree:

```ts
// Apply to all constructs in a scope
Mixins.of(scope).apply(new EncryptionAtRest());
```

Optionally, you may select a subset of constructs

```ts
import { ConstructSelector } from "aws-cdk-lib/mixins";

// Apply to a given L1 resource or L2 resource construct
// This is what `.with()` is using
Mixins.of(
  bucket,
  ConstructSelector.cfnResource() // provided CfnResource or a CfnResource default child
).apply(new EncryptionAtRest());

// Apply to all resources of a specific type
Mixins.of(
  scope,
  ConstructSelector.resourcesOfType(s3.CfnBucket)
).apply(new EncryptionAtRest());

// Alternative: select by CloudFormation resource type name
Mixins.of(
  scope,
  ConstructSelector.resourcesOfType("AWS::S3::Bucket")
).apply(new EncryptionAtRest());

// Apply to constructs matching a pattern
Mixins.of(
  scope,
  ConstructSelector.byId(/.*-prod-.*/) 
).apply(new ProductionSecurityMixin());

// The default is to apply to all constructs in the scope
Mixins.of(
  scope,
  ConstructSelector.all() // supports depth-first and breadth-first
).apply(new ProductionSecurityMixin());

// Option: Alternative syntax
Mixins.of(scope).select(ConstructSelector.cfnResource())
```

#### Mixins declare which constructs they support

Mixins typically target specific resource constructs.
When applied to a construct tree, the mixing will check if a given construct is supported.
Only when supported applies, otherwise skip.

```ts
bucketAccessLogsMixin.supports(bucket); // true
bucketAccessLogsMixin.supports(queue); // false
```

#### Mixins must apply

todo: will fail if encountering construct it cannot deal with. use to ensure now surprises

```ts
Mixins.of(scope, selector).mustApply(new EncryptionAtRest());
```

#### Validations

Mixins are only validating when applied, never at construction time.
Mixins also provide a list of validation functions that may or may not return messages.
TODO: Or maybe it's just validate but not throw and return messages instead.

```typescript
interface IMixin {
  /** Check if this mixin can be applied to the given construct */
  supports(construct: IConstruct): boolean;
  
  /** Apply the mixin to the construct */
  applyTo(construct: IConstruct): IConstruct;
  
  /** Validate the construct after mixin application */
  validate?(construct: IConstruct): string[];
}

// Validation example
class EncryptionAtRest implements IMixin{
  supports(construct: IConstruct): construct is s3.CfnBucket {
    return construct instanceof s3.CfnBucket;
  }

  applyTo(bucket: s3.CfnBucket): s3.CfnBucket {
    bucket.bucketEncryption = {
      serverSideEncryptionConfiguration: [{
        bucketKeyEnabled: true,
        serverSideEncryptionByDefault: {
          sseAlgorithm: "aws:kms"
        }
      }]
    };
    return bucket;
  }

  validate(bucket: s3.CfnBucket): string[] {
    const errors: string[] = [];
    if (!bucket.bucketEncryption) {
      errors.push("Bucket encryption not configured");
    }
    return errors;
  }
}
```

#### Resource-Specific Mixins

Each AWS service provides mixins tailored to its specific capabilities:

```typescript
// S3-specific mixins
const bucket = new s3.CfnBucket(scope, "Bucket")
  .with(new AutoDeleteObjects())
  .with(new ComplianceLogging())
  .with(new CfnBucketPropsMixin({ 
    someNewFeatureConfig: { settingOne: "value1" } 
  }));
```

#### Cross-Service Mixins

Apply common patterns across different AWS services:

```typescript
import { EncryptionAtRest, Mixins, ConstructSelector } from "aws-cdk-lib/mixins";
import { CfnLogGroup } from "aws-cdk-lib/aws-logs";

// Apply encryption to all log groups in the scope
Mixins.of(
  scope,
  ConstructSelector.resourcesOfType(cloudwatch.CfnLogGroup)
).apply(new EncryptionAtRest());
```

#### Types of Mixins

**Resource-Specific Mixins**: Tailored to individual AWS services

```typescript
// Hand-written mixins for common patterns
const bucket = new s3.CfnBucket(scope, "Bucket")
  .with(new BucketEvents())
  .with(new BucketGrants());

// Auto-generated mixins from AWS service specifications
const bucketWithNewFeature = new s3.CfnBucket(scope, "NewBucket")
  .with(new CfnBucketPropsMixin({ 
    someNewFeatureConfig: { settingOne: "value1" } 
  }));
```

**Cross-Service Mixins**: Common patterns across AWS services

```typescript
// Same mixin works across different resource types
const bucket = new s3.CfnBucket(scope, "Bucket")
  .with(new EncryptionAtRest());

const logGroup = new logs.CfnLogGroup(scope, "LogGroup")
  .with(new EncryptionAtRest());

const table = new dynamodb.CfnTable(scope, "Table")
  .with(new EncryptionAtRest());
```

#### Using Mixins with L1 Constructs

Mixins unlock the full potential of L1 constructs by adding sophisticated abstractions:

```typescript
// L1 with enterprise-grade features
const bucket = new s3.CfnBucket(scope, "EnterpriseBucket")
  .with(new EncryptionAtRest())
  .with(new AutoDeleteObjects())
  .with(new ComplianceLogging())
  .with(new CostOptimization());

// Access day-one AWS features with abstractions
const bucketWithLatestFeature = new s3.CfnBucket(scope, "LatestBucket")
  .with(new CfnBucketPropsMixin({ 
    // New CloudFormation property available immediately
    newAwsFeature: { enabled: true }
  }))
  .with(new EncryptionAtRest());

// Helper classes provide L2-like convenience
new BucketGrants(bucket).grantRead(role);
const eventPattern = new BucketEvents(bucket).onObjectCreated();
```

#### Using Mixins with L2 Constructs

Mixins extend L2 constructs with additional capabilities while preserving existing functionality:

```typescript
// Existing L2 usage continues to work unchanged
const standardBucket = new s3.Bucket(scope, "StandardBucket", {
  autoDeleteObjects: true,
  encryption: s3.BucketEncryption.S3_MANAGED
});

// Add new capabilities with mixins
const enhancedBucket = new s3.Bucket(scope, "EnhancedBucket", {
  autoDeleteObjects: true
}).with(new ComplianceAuditing())
  .with(new CostOptimization())
  .with(new CfnBucketPropsMixin({ 
    // Access new CloudFormation features not yet in L2
    newFeature: { enabled: true }
  }));

// Mix L2 properties with mixin capabilities
const hybridBucket = new s3.Bucket(scope, "HybridBucket", {
  versioned: true,
  lifecycleRules: [/* ... */]
}).with(new AdvancedMonitoring())
  .with(new SecurityCompliance());
```

#### Mixins and Aspects

Mixins and Aspects are very similar in some regards, but crucial differ in their time of application:
Mixins are always applied _immediately_, they are a tool of imperative programming.
On the other hand, Aspects are applied _after_ everything else during the synthesis step, they are declarative.

However because implementing Mixins and Aspects is very similar, they can be converted from each other:

```ts
// Applies the aspect immediately
Mixins.of(scope).apply(Mixin.fromAspect(new TaggingAspect({ Environment: "prod" })));

// Delays application of the Mixin to the synthesis phase
Aspects.of(scope).add(Aspect.fromMixin(new EncryptionAtRest()));
```

Mixins have more features than Aspects. When converting a Mixin to an Aspect, the Mixin will automatically only be applied to supported constructs.
When converting an Aspect to a Mixin, the Aspect will be applied to every node.

#### Mixin Composition and Conflicts

Mixins apply in declaration order. Later mixins can override earlier ones:

```typescript
// Last mixin wins for conflicting properties
const bucket = new s3.CfnBucket(scope, "Bucket")
  .with(new EncryptionAtRest({ algorithm: "AES256" }))
  .with(new EncryptionAtRest({ algorithm: "aws:kms" })); // KMS wins

// Mixins could detect and react to conflicts, but this is generally not encouraged
class ConflictAwareMixin implements IMixin {
  validate(construct: s3.CfnBucket): string[] {
    if (construct.bucketEncryption) {
      return ["Encryption already configured"];
    }
    return [];
  }
}
```

#### Error Handling and Edge Cases

Mixins provide comprehensive error handling for common scenarios:

```typescript
// Validation errors are collected and reported _per Mixin application_:
const bucket = new s3.CfnBucket(scope, "Bucket")
  .with(new EncryptionAtRest())
  .with(new InvalidMixin()); // Throws validation error

// Graceful handling of unsupported constructs
Mixins.of(scope)
  .apply(new EncryptionAtRest()); // Skips unsupported constructs

// Strict application that requires all constructs to match
Mixins.of(scope)
  .mustApply(new EncryptionAtRest()); // Throws if any constructs doesn't support the mixin
```

---

Ticking the box below indicates that the public API of this RFC has been
signed-off by the API bar raiser (the `status/api-approved` label was applied to the
RFC pull request):

```
[ ] Signed-off by API Bar Raiser @rix0r
```

## Public FAQ

### What are we launching today?

We are launching CDK Mixins, a new composable abstraction system for AWS CDK that allows any high-value feature to work with
any construct level (L1, L2, or custom).
This includes a core mixin framework, resource-specific mixins for major AWS services, cross-service mixins for common patterns,
and automatic generation capabilities for new AWS features.

### Why should I use this feature?

CDK Mixins solve three critical problems:

1. **Freedom of Choice**: Use sophisticated abstractions without being locked into specific L2 implementations
2. **Day-One Coverage**: Access new AWS features immediately through auto-generated mixins while keeping your existing abstractions
3. **Composability**: Mix and match exactly the features you need without inheriting unwanted behaviors

This is particularly valuable for enterprise customers who need to customize 90% of their constructs while still benefiting from AWS-maintained abstractions.

### How are Mixins different than Aspects?

**Mixins** are **imperative** - you explicitly choose what to add to each construct:

```typescript
// Imperative: explicitly add encryption to this specific bucket
const bucket = new s3.CfnBucket(scope, "Bucket")
  .with(new EncryptionAtRest());
```

**Aspects** are **declarative** - you define rules that apply automatically based on patterns:

```typescript
// Declarative: all constructs in scope get tagged automatically
Aspects.of(scope).add(new TaggingAspect({ Environment: "prod" }));
```

With mixins, you make explicit decisions about each construct's capabilities.
With aspects, you set policies that the CDK applies automatically during synthesis.
Mixins give you precise control and type safety, while aspects provide broad governance and compliance enforcement.

Mixins also have a bigger feature set, including declaring support for constructs,

### What does this mean for L2s? Are L2s going away?

No! L2 constructs remain important and will continue to be developed. Mixins complement L2s by:

* **Extending L2 capabilities**: Add features not yet available in L2s
* **Enabling customization**: Use parts of L2 functionality without full commitment
* **Accelerating development**: Provide abstractions for new AWS features before L2 support
* **Future L2 architecture**: New L2s may be built using mixins for better modularity

L2s will continue to provide:

* Curated, opinionated defaults for common use cases
* Integrated multi-resource patterns
* Comprehensive documentation and examples
* Stable APIs for production workloads

## Internal FAQ

### Why are we doing this?

The current CDK architecture forces customers into an "all-or-nothing" choice between sophisticated L2 abstractions and comprehensive AWS coverage.
This creates three "treadmill" problems:

1. **Coverage Treadmill**: We must provide L2s for all AWS services
2. **Completeness Treadmill**: Each L2 must support every feature of the underlying resource
3. **Customization Treadmill**: We must support all possible customizations

These treadmills are unsustainable given AWS's pace of innovation (2,000+ features annually vs. 5 new CDK modules per year).

### Why should we _not_ do this?

The main risks are:

1. **Complexity**: Adding another abstraction layer could confuse developers
2. **Fragmentation**: Multiple ways to achieve the same outcome might split the community
3. **Maintenance Burden**: More code to maintain and test

However, these risks are mitigated by maintaining full backward compatibility and providing clear migration paths.

### What is the technical solution (design) of this feature?

The solution has four key components:

1. **Mixin Interface**: A `.with(mixin)` method that allows composing functionality
2. **Resource Traits**: Common interfaces (like `IEncryptable`) that enable cross-service abstractions
3. **Addressable Resources**: Shared interfaces between L1s and L2s for interoperability
4. **Automatic Generation**: Mixins generated from AWS service specifications

The implementation uses TypeScript's type system to ensure type safety while maintaining runtime flexibility.

### Is this a breaking change?

No. This is a purely additive change that maintains full backward compatibility.
Existing L2 constructs continue to work unchanged, and mixins provide additional capabilities on top of the current system.

### What alternative solutions did you consider?

#### 1. Enhanced L1 Constructs (RFC 655)

**Approach**: Improve L1s with better defaults, validation, and helper methods.

**Pros**:

* Simpler mental model - no new abstraction layer
* Backward compatible improvements
* Lower maintenance overhead

**Cons**:

* Still requires full L2 development for sophisticated features
* Doesn't solve the composability problem
* Limited cross-service abstraction capabilities

**Why Mixins Are Better**: Mixins provide the sophisticated features of enhanced L1s
while enabling composition and cross-service patterns that enhanced L1s cannot achieve.

#### 2. Modular L2 Redesign

**Approach**: Rebuild L2s as composable modules instead of monolithic constructs.

**Pros**:

* Clean architectural separation
* Type-safe composition
* Familiar L2 patterns

**Cons**:

* Massive breaking change to existing ecosystem
* Years of migration effort required
* Abandons existing L2 investments

**Why Mixins Are Better**: Mixins achieve modular composition without breaking changes, allowing gradual adoption while preserving existing L2 value.

#### 3. Expanded Aspects Usage

**Approach**: Use existing Aspects for all cross-cutting concerns and governance.

**Pros**:

* No new concepts to learn
* Existing pattern with proven usage
* Declarative policy enforcement

**Cons**:

* Aspects are synthesis-time only - no immediate reflection possible
* Poor TypeScript integration and IDE support
* Difficult to compose multiple aspects predictably
* No built-in support for imperative, construct-specific customization

**Why Mixins Are Better**: Mixins provide immediate application with full type safety, while aspects remain better for declarative policies.
The RFC shows how they can interoperate when needed.

#### 4. Status Quo with Incremental L2 Improvements

**Approach**: Continue current approach with faster L2 development.

**Pros**:

* No architectural changes required
* Leverages existing team expertise
* Predictable development model

**Cons**:

* Cannot solve the fundamental treadmill problems
* Still forces all-or-nothing choices for customers
* Doesn't address day-one AWS feature access
* Scales poorly with AWS's innovation pace

**Why Mixins Are Better**: Mixins break the treadmill cycle by enabling sophisticated abstractions without requiring complete L2 coverage,
allowing customers to access new AWS features immediately while keeping desired abstractions.

#### Trade-off Summary

| Approach     | Composability | Breaking Changes | Day-1 Features | Development Effort |
| ------------ | ------------- | ---------------- | -------------- | ------------------ |
| Enhanced L1s | Limited       | None             | Partial        | Medium             |
| Modular L2s  | High          | Major            | No             | Very High          |
| More Aspects | Medium        | None             | No             | Low                |
| Status Quo   | None          | None             | No             | High (ongoing)     |
| **Mixins**   | **High**      | **None**         | **Yes**        | **Medium**         |

Mixins uniquely provide high composability and day-one feature access without breaking changes, making them the optimal solution for the identified problems.

### What are the drawbacks of this solution?

1. **Learning Curve**: Developers need to understand a new abstraction pattern
2. **API Surface**: More APIs to document and maintain

### Are there any open issues that need to be addressed later?

1. **Performance Impact**: Need to measure runtime overhead of mixin composition
2. **IDE Support**: Ensure TypeScript language services work well with complex mixin types
3. **Documentation Strategy**: Develop clear patterns for documenting mixin combinations
4. **Mixin helpers**: Composing mixins together into bigger pieces
5. **Testing Strategy**: Define testing approaches for mixin abstractions

## Appendix

### Appendix A: Mixin Implementation Pattern

```typescript
// Core mixin interface
interface IMixin{
  supports(construct: IConstruct): boolean;
  validate?(construct: IConstruct): string[];
  applyTo(construct: IConstruct): IConstruct;
}

// Example implementation
class EncryptionAtRest implements IMixin {
  supports(construct: IConstruct): construct is s3.CfnBucket {
    return construct instanceof s3.CfnBucket;
  }

  applyTo(bucket: s3.CfnBucket): s3.CfnBucket {
    bucket.bucketEncryption = {
      serverSideEncryptionConfiguration: [{
        bucketKeyEnabled: true,
        serverSideEncryptionByDefault: {
          sseAlgorithm: "aws:kms"
        }
      }]
    };
    return bucket;
  }
}

// Mixin application framework
class MixinApplicator {
  static of(scope: IConstruct, selector?: ConstructSelector): MixinApplicator {
    return new MixinApplicator(scope, selector);
  }

  constructor(
    private readonly scope: IConstruct,
    private readonly selector: ConstructSelector = ConstructSelector.all()
  ) {}

  apply(mixin: IMixin): this {
    const constructs = this.selector.select(this.scope);
    for (const construct of constructs) {
      if (mixin.supports(construct)) {
        mixin.applyTo(construct);
        const errors = mixin.validate?.(construct) ?? []; // or should we validate first for all than apply?
        if (errors.length > 0) {
          throw new ValidationError(`Mixin validation failed: ${errors.join(', ')}`);
        }
      }
    }
    return this;
  }

  mustApply(mixin: IMixin): this {
    const constructs = this.selector.select(this.scope);
    for (const construct of constructs) {
      if (!mixin.supports(construct)) {
        throw new ValidationError(`Mixin ${mixin.constructor.name} could not be applied to any constructs`);
      }
      const errors = mixin.validate?.(construct) ?? []; // or should we validate first for all than apply?
      if (errors.length > 0) {
        throw new ValidationError(`Mixin validation failed: ${errors.join(', ')}`);
      }
    }
    return this;
  }
}
```

### Appendix B: ConstructSelector Implementation

```typescript
// Construct selection framework
abstract class ConstructSelector {
  abstract select(scope: IConstruct): IConstruct[];

  static all(): ConstructSelector {
    return new AllConstructsSelector();
  }

  static cfnResource(): ConstructSelector {
    return new CfnResourceSelector();
  }

  static resourcesOfType(type: string | Function): ConstructSelector {
    return new ResourceTypeSelector(type);
  }

  static byId(pattern: RegExp): ConstructSelector {
    return new IdPatternSelector(pattern);
  }
}

class AllConstructsSelector extends ConstructSelector {
  select(scope: IConstruct): IConstruct[] {
    const result: IConstruct[] = [];
    const visit = (node: IConstruct) => {
      result.push(node);
      for (const child of node.node.children) {
        visit(child);
      }
    };
    visit(scope);
    return result;
  }
}

class CfnResourceSelector extends ConstructSelector {
  select(scope: IConstruct): IConstruct[] {
    if (scope instanceof CfnResource) {
      return [scope];
    }
    // Find default child that is a CfnResource
    const defaultChild = scope.node.defaultChild;
    if (defaultChild instanceof CfnResource) {
      return [defaultChild];
    }
    return [];
  }
}

class ResourceTypeSelector extends ConstructSelector {
  constructor(private readonly type: string | Function) {
    super();
  }

  select(scope: IConstruct): IConstruct[] {
    const result: IConstruct[] = [];
    const visit = (node: IConstruct) => {
      if (typeof this.type === 'string') {
        if (node instanceof CfnResource && node.cfnResourceType === this.type) {
          result.push(node);
        }
      } else {
        if (node instanceof this.type) {
          result.push(node);
        }
      }
      for (const child of node.node.children) {
        visit(child);
      }
    };
    visit(scope);
    return result;
  }
}
```

### Appendix C: Cross-Service Trait Example

```typescript
// Common trait for encryptable resources
interface IEncryptable extends IConstruct {
  encryptionKey?: kms.IKey;
  setEncryption(config: EncryptionConfig): void;
}

// Cross-service mixin
class EncryptionAtRest implements IMixin {
  supports(construct: IConstruct): construct is IEncryptable {
    return 'setEncryption' in construct; // or explicit list of resources if auto-genned
  }

  applyTo(resource: IEncryptable): IEncryptable {
    resource.setEncryption({
      algorithm: "aws:kms",
      bucketKeyEnabled: true
    });
    return resource;
  }
}
```
