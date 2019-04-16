# RFC: External Resource References

## Background

PR [#1436](https://github.com/awslabs/aws-cdk/pull/1436) had recently introduced implicit
references of resource attributes across stacks within the same CDK app:


```ts
const user = new iam.User(stackWithUser, 'User');
const group = new iam.Group(stackWithGroup, 'Group');

group.addUser(user);
```

Will synthesize the following two templates:

```yaml
Outputs:
  ExportsOutputRefGroupC77FDACD8CF7DD5B:
    Value:
      Ref: GroupC77FDACD
    Export:
      Name: ExportsOutputRefGroupC77FDACD8CF7DD5B
Resources:
  GroupC77FDACD:
    Type: AWS::IAM::Group
```

and:

```yaml
Resources:
  User00B015A1:
    Type: AWS::IAM::User
    Properties:
      Groups:
      - Fn::ImportValue: ExportsOutputRefGroupC77FDACD8CF7DD5B
```

You can see that the reference automatically resulted in an `Output+Export` and
an `Fn::ImportValue` to be used in order to share this information across the
stacks within the same application.

This mechanism practically replaces our "import/export" pattern which looks like this (same use case and same synthesized output):

```ts
const user = new iam.User(stackWithUser, 'User');
const group = new iam.Group(stackWithGroup, 'Group');

// creates an `Output` in "stackWithUser" with a unique export name
// returns an `Fn::ImportValue` that can be used to import this user
// in any stack in the same account/region
const importValues = user.export();

// instantiates an `IUser` whose attributes are `Fn::ImportValue` tokens
// in "stackWithGroup", and it can now be used "naturally" in that stack
const importedUser = iam.User.import(stackWithGroup, 'ImportedUser', importValues);
group.addUser(importedUser);
```

Obvsiouly the world is a better place now. Thanks [@rix0rrr](https://github.com/users/rix0rrr).

## Problem Statement

So, "what seems to be the problem?", you ask. Well, we want more! The current model only supports references that occur between stacks within the same CDK app. What about the use case where I want to reference a resource that was created in a totally different app?

A common example is for a common infrastructure team to maintain a CDK app which defines networking resources such as VPCs, security groups, LBs, etc and application teams need to reference these resources in their own CDK apps.

__So the problem we are trying to solve is how to enable users to reference resources (and potentially higher level constructs) across CDK apps.__

## Scope

As an initial step, we'll address the use case of referencing resources across within __the same AWS environment__ (account + region). This limitation is based on the limitation AWS CloudFormation has for exports/imports.

We differentiate two types of references:

1. Reference a resource created through another CDK app.
2. Reference a resource created by some other means.

In the former case (app to app), the producing app can explicitly "export" the resource and the consuming app can explicitly "import" the resource.

In the latter case (environment to app), we usually just have a resource's physical identity such as ARN or name and we want to be able to use it in a CDK app.

## Requirements

- **REQ1**: Allow constructs to be published from one CDK app and consumed by other CDK apps within the same environment
- **REQ2**: Support "simple" constructs, which are resources that can be represented by a set of attributes such as an ARN and also support "composite" constructs, which are resources that encapsulate other resources (such as security groups, roles, etc).
- **REQ3**: Allow CDK apps to reference resources that were created elsewhere (by other CDK apps, manually or any other mean) by referencing the physical identity. For example, an S3 Bucket ARN should be sufficient in order to reference an existing S3 bucket.
- **REQ4**: Implement the mechanism such that it can be later used to publish and consume constructs through other key/value mechanism such as environment variables, SSM parameters, etc.
- **REQ5**: If a resource is exported twice under the same export name, only a single set of outputs will be created ([#1496](https://github.com/awslabs/aws-cdk/issues/1496)).
- **REQ6**: If the same resource is imported twice into the same stack, the "import" method **may** return the same object (as in, the same instance).
- **REQ7**: For some resources (like VPC for example), it should be possible look up the resource in the current environment by querying through an environmental context provider.
- **REQ8**: It should be possible to resolve import values either during synthesis time (i.e. via an environmental context provider) or during deploy time (i.e. via `Fn::ImportValue`). There are certain resources that will _require_ the use of synthesis-time resolution due to their complex representation.

## Approach

As usual, we'll take a layered approach.

**Serializable constructs**: At the low-level, we'll define what it means for a construct to be "__serializable__" through string key/value context. The mechanism will be recursive such that it will be possible to write/read singular values and write/read serializable objects (which, themselves will write/read their own values and so forth).

**Serialization context**: the notion of a "string key/value context" represents the lowest common denominator for serialization, and specifically is the only type supported by CloudFormation's cross-stack export/import mechanism (CloudFormation outputs can only be of "string" type). If a construct can serialize itself through a set of key/values, we can pass it via CloudFormation's import/export, environment variables, SSM parameters, etc.

**CloudFormation imports/exports as a serialization context**: on top of that, we will implement a serialization/deserialization context based on AWS CloudFormation's import/exports mechanism. "writing" a value means defining an Output with an Export and "reading" a value means `Fn::ImportValue` with this export name. The "export name" will be used as a prefix that represent an object, and sub-objects will be serialized by adding another component to the export name.

**Synthesis-time Imports**: we will also define an environmental context provider that will import values during synthesis and store them in `cdk.json`. This approach is more robust since it will allow CDK code to reason about concrete values instead of opaque tokens. It's especially needed for situations where a list of values needs to be passed and the arity is required.

**Convenience methods**: now that constructs can be serializable through imports/exports, we can implement a set of convenience methods for each AWS resource to provide nice ergonomics for the specific use case of exporting and importing resources across apps.

## Design

### Serialization

If a construct is said to be serializable, it must implement the `ISerializable` interface:

```ts
interface ISerializable {
  serialize(ctx: ISerializationContext): void;
}
```

When an object is serialized, the `serialize` method is called with an object which implements the following interface:

```ts
interface ISerializationContext {
  writeString(key: string, value: string, options?: SerializationOptions): void
  writeStringList(key: string, value: string[], options?: SerializationOptions): void;
  writeObject(key: string, obj: ISerializable, options?: SerializationOptions): void;
}

interface SerializationOptions {
  description?: string;
}
```

The serialization context allows the object serialize itself through key/value strings via calls to `writeString(key, value)` and `writeStringList(key, array)`. If the object encapsulates another serializable object, it can use `writeObject(key, obj)`, which will result in a subsequent call to the sub-object's `serialize` method with an appropriate context.

### Deserialization

To support deserialization, classes must also include a public static `deserializeXxx` method which reads the object from a deserialization context and returns an object that implements the resource type interface:

> The reason we indicate the type in the method name is because static methods in JavaScript are inherited, so we can differentiate between `ExtraBucket.deserializeExtraBucket` and `ExtraBucket.deserizlizeBucket`.

```ts
class MyResource extends Construct implements ISerializable {
  static deserializeMyResource(ctx: IDeserializationContext): IMyResource;
}
```

The deserialization context is an object that implements the following interface:

```ts
interface IDeserializationContext {
  scope: Construct;
  id: string;
  readString(key: string, options?: DeserializationOptions): string;
  readStringList(key: string, options?: DeserializationOptions): string[];
  readObject(key: string): IDeserializationContext;
}

interface DeserializationOptions {
  allowUnresolved?: boolean;
}
```

The method `readString` can be used to read values stored by `writeString`.

The method `readStringList` can be used to read string list values stored by `writeStringList`.

The method `readObject` returns a deserialization context for composite deserialization written via `writeObject`.

The `allowUnresolved` option can be used by constructs to indicate that returned value __must be a resolved value__ (i.e. not a token). This implies, for example, that when importing this value, users cannot use the `resolveType: Deployment`  option (REQ8).

The CloudFormation import/export serializer is unable to support unresolved imports for string lists, so `allowUnresolved` must be either undefined or set to `false`. If it is set to `true` and `readStringList` is used, an error will be thrown.

Since `deserializeXxx` will need to create new construct objects, the deserialization context will supply a consistent `scope` and `id` which can be used to instantiate a construct object that represents this object. For example, `scope` can be mapped to the current `Stack` and `id` can be mapped to `exportName` which is ensured to be unique within the environment (and therefore, the current stack).

Implementers of `deserializeXxx` should check if a construct with `id` already exists within `scope` and return it instead of instantiating and new object (REQ6).

---

Here's an example that demonstrates how serialization and deserialization can be implemented for an application load balancer (ALB), which is a composite resource. As you can see, ALBs encapsulate a security group, which is serialized and deserialized together with the ALB itself.

```ts
class ApplicationLoadBalancer {
  serialize(ctx: ISerializationContext): void {
    ctx.writeString('LoadBalancerArn', this.loadBalancerArn);
    ctx.writeObject('SecurityGroup', this.securityGroup);
  }

  static deserializeApplicationLoadBalancer(ctx: IDeserializationContext): IApplicationLoadBalancer {
    const exists = ctx.scope.findChild(ctx.id);
    if (exists) {
      return exists;
    }

    return new ImportedApplicationLoadBalancer(ctx.scope, ctx.id, {
      loadBalancerArn: ctx.readString('LoadBalancerArn'),
      securityGroup: ec2.SecurityGroup.deserializeSecurityGroup(ctx.readObject('SecurityGroup'))
    });
  }
}
```

### Imports/Exports

Now that constructs can be serialized and deserialized into a key-value context, we can implement a serialization mechanism for exporting resources from stacks and importing them in another stack. Importing can be done either at synthesis time using an environmental context provider or at runtime by returning `Fn::ImportValue` tokens for `readString`.

The following methods will be added to the `Stack` class:

```ts
class Stack {
  exportString(exportName: string, value: string, options?: ExportOptions): void;
  importString(exportName: string, options?: ImportOptions): string;
}

interface ExportOptions {
  description?: string
}

interface ImportOptions {
  type?: ResolveType // default is Synthesis
  weak?: boolean; // default is "false"
}

enum ResolveType {
  Synthesis,
  Deployment
}
```

The `exportString` method creates an AWS CloudFormation Output for this value assigned to this export name.

The `importString` method returns the value for this specific export name. When importing a value, users can specify the following `ImportOptions`:

* If `type` is set to `Deployment`, the method will return an `Fn::ImportValue(exportName)` token. This means that CDK code cannot reason about the concrete value, which will only be resolved when the stack is deployed.
* If `type` is set to `Synthesis` (default) the method will exercise an environmental context provider to look up the export value __during synthesis__. The concrete value will be propagated to the CDK app and can be reasoned about like any normal value.
* The `weak` option is only relevant for synth-time resolution. If it is `false` (which is the default), the CDK will automatically embed a `Metadata` entry on the consuming resource with an `Fn::ImportValue`. This will force CloudFormation to take a strong reference on the export, even through the actual value is concretely resolved during synthesis. This ensures, for example, that the producing stack can't be deleted as long as there stacks consuming the exported values. This behavior (which is the default), can be disabled by settings `weak: true`, in which case the `Fn::ImportValue` will simply not be included.

On top of these two methods, we can now define import and export methods for serializable objects:

```ts
class Stack {
  exportObject(exportName: string, obj: ISerializable): void;
  importObject(exportName: string, options?: ImportOptions): IDeserializationContext;
}
```

The `exportObject` method will invoke `obj.serialize` with a serialization context "bound" to this export name. This means the export name will be used as a prefix to all written keys. `writeObject` will be implemented with a nested serialization context that adds another component to the export name prefix.

The `importObject` method will be used like this:

```ts
const importedBucket = Bucket.deserializeBucket(stack.importObject('MyBucketExportName'));
```

The method will return a deserialization context that's bound to the export name. Similarly to the serialization context, it will prefix all values read through `readString` with the export name, and so forth with `readObject`.

As mentioned about, the default resolve type for imports is `Synthesis` (with strong-references). This means that the values returned by `readString` will be actual concrete values. If users opt-in to deploy-time resolution (by setting using `Deployment` resolve type), the values returned will be tokens. In some cases this would be fine, but there could be constructs that cannot deal with opaque values (i.e. if the value is an list of strings and needs to be deconstructed). In those cases (REQ8), constructs should invoke `readString` with `allowUnresolved: false` to indicate that this specific value cannot be a token.

#### Export names

AWS CloudFormation export names must be unique within an environment (account/region), and they will be formed by concatenating root `exportName` and all the keys that lead to a value in the serialization tree.

We will use `-` as a component separator devising fully qualified export names. To avoid collisions, if the main export name or any subsequent serialization key includes a `-` it will be removed.

Since AWS CloudFormation has a limit on export name length, and we wouldn't want to restrict the serialization depth, the import/export serializer should trim the name and add a hash of the full name, but only if the total length exceeds the limit.

### Synthesis-time Imports (REQ8)

As mentioned in the previous section, `importObject` will support both synthesis and deploy-time imports by export name.

In order to implement synthesis-time imports, we will add a new environmental context provider to the toolkit which will be able to retrieve a value for a certain CloudFormation named export.

The implementation of this provider will use the CloudFormation ListExports operation to find the exports needed and pass their values in through the CDK context mechanism.

Bear in mind that once a value has been retrieved, it will automatically be saved in the local `cdk.json` and won't be retrieved again until `cdk context --reset` is called.

Since synthesis-time resolution doesn't create strong coupling between the stacks at the CloudFormation
level, production and operational issues can arise if the producing stack deletes an exported resource. On the other hand, we hear from customers that strong-referencing behavior of `Fn::ImportValue` is sometimes a curse. Customers tell us that they found themselves stuck with unremovable or stacks that cannot be updates due to imports.

Luckily, we can enable both capabilities. By default, when synthesis-time resolution is used, the CDK will automatically add a resource metadata entry to the template with an `Fn::ImportValue`. This will create the strong coupling between the stacks. Users can opt-out of this behavior by setting `weak: true` when they import the resource.

### Convenience Methods

At the top layer, we will implement a bunch of convenience methods for each AWS resource will provide nice ergonomics for cross-app import/export:

Here's the usage:

```ts
// this will export "myAwesomeBucket" under the export name "JohnnyBucket"
myAwesomeBucket.exportBucket('JohnnyBucket');

// now, any CDK app that wishes to refer to this bucket can do this:
const importedBucket: IBucket = Bucket.importBucket(this, 'JohnnyBucket', {
  weak: true // weak-reference
});
```

> The reason we call this `importBucket` (and `exportBucket`) is because `import` is a reserved word in Java ([#89](https://github.com/awslabs/aws-cdk/issues/89)). Also, in JavaScript both static and instance methods are inherited, so if someone extends `Bucket` (say `ExtraBucket`), we should have a way to distinguish between `ExtraBucket.importBucket` and `ExtraBucket.importExtraBucket`.

The implementation of these two methods is ~trivial:

```ts
class Bucket {
  public static importBucket(scope: Construct, exportName: string, options?: ImportOptions): IBucket {
    return Bucket.deserializeBucket(Stack.find(scope).importObject(exportName, options));
  }

  public exportBucket(exportName: string): void {
    Stack.find(this).exportObject(exportName, this);
  }
}
```

### Reference by Physical Name (REQ3)

AWS resources should allow users to reference them by specifying a physical name attribute such as ARN or name:

```ts
const myBucket = Bucket.fromBucketArn(this, 'arn:aws:s3:::my_bucket');
const yourBucket = Bucket.fromBucketName(this, 'your_bucket');
```

Since these methods need to create a new construct, they should utilize the resource's physical name as the construct ID, and also ensure idempotency. Here's an example:

```ts
public static fromBucketArn(scope: Construct, bucketArn: string): IBucket {
  const stack = Stack.find(scope);
  const id = `fromBucketArn:${bucketArn}`;
  const existing = stack.findChild(id);
  if (existing) {
    return existing;
  }

  return new ImportedBucket(stack, id, { bucketArn });
}
```

### Lookup from Environment (REQ7)

In composite cases, the resource's physical identity is not sufficient. For example, a `VpcNetwork` resource encapsulates many resources behind it such as subnets, NAT Gateways, etc. In those cases we still want to provide a great experience for developers who wish to reference a VPC:

```ts
const vpc = VpcNetwork.lookupVpc(this, {
  tags: {
    department: 'sales',
    stage: 'prod'
  }
});
```

The underlying implementation here is different, it uses an environmental context provider to lookup the VPC and extract all the relevant information from it, such as subnets, NAT Gateways and route tables.

Here too, we expect idempotent behavior, which can be implemented in a similar manner.

## Other Applications

The construct serialization mechanism opens an opportunity for other applications that may benefit from being able to reference CDK constructs from outside the app. This section describes a few examples.

### Serialization to JSON

It should be trivial to implement a JSON serialization context:

```ts
const ctx = new JsonSerializtionContext();
alb.serialize(ctx);

assertEquals(resolve(ctx.json), {
  "loadBalancerArn": { "Fn::GetAtt": [ "MyALB1288xxx", "Arn" ] },
  "securityGroup": {
    "securityGroupId": { "Ref": "MyALBSecurityGroup4444" }
  }
});
```

Representing a construct's runtime attributes as JSON (or a stringified JSON if needed via `CloudFormationJSON`) opens up a few interesting applications as described below.

### Cross-Account/Region References

The serialization mechanism, together with a bunch of custom resources can be used to reference constructs across accounts and region via, e.g. an S3 bucket.

The producing stack can write a file to an S3 bucket with e.g. the JSON serialized representation of the construct and the consuming stack can read this file during deployment and deserialize the construct.

### Environment Variables Serialization

When runtime code needs to interact with resources defined in a CDK app, it needs to be able to reference these resources.

The current practice is to manually wire specific resource attributes via environment variables so they will be available for runtime code. This may be sufficient for simple use cases such as simple AWS resources where a single attribute might be sufficient to represent the construct, but more complex scenarios (such as composite constructs) may benefit from the ability to serialize the entire construct through environment variables either through individual keys or as a single key + JSON value.

## Implementation Notes

The underlying pattern we use today for supporting imports/exports (`IBucket`, `BucketBase`, `Bucket` and `ImportedBucket`) continues to be **recommended** for implementing serialization and the `fromXxx` methods.

The various static import methods (`deserializeXxx` `importXxx`, `fromXxx`) can all return an object that implements `IXxx`. The concrete type of this object can be implemented as an module-internal class `ImportedXxx` that includes the heuristics of how to represent an external resource of this type. For example, is may include the logic that determines how to convert an ARN to a name and vice versa, construct URLs, etc.

## Open issues/questions

- [ ] Can we provide a nicer API for implementing idempotency? Seems like this is a repeating pattern. We can definitely implement something very nice that's not jsii-compatible, but that might be fine as long as non-jsii users can still use the same mechanism.
- [ ] Consider renaming the `ImportXxx` classes to something that's not coupled with export/import. Maybe `ExternalXxx` or `ExistingXxx`. Those are internal classes, so it doesn't really matter, but still.
