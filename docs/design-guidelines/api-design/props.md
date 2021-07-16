## Props

Constructs are defined by creating a new instance and passing it a set of
**props** to the constructor. Throughout this document, we will refer to these
as “props” (to distinguish them from JavaScript object properties).

 The props argument for the **Foo** construct should be a struct (interface with
 only readonly properties) named **FooProps** _[awslint:props-struct-name]_.

> Even if a construct props simply extends from some other Props struct and does
  not add any new properties, you should still define it, so it will be
  extensible in the future without breaking users in languages like Java where
  the props struct name is explicitly named.

Props are the most important aspect of designing a construct. Props are the
entry point of the construct. They should reflect the entire surface area of the
service through semantics that are intuitive to how developers perceive the
service and its capabilities.

When designing the props of an AWS resource, consult the AWS Console experience
for creating this resource. Service teams spend a lot of energy thinking about
this experience. This is a great resource for learning about the mental model of
the user. Aligning with the console also makes it easier for users to jump back
and forth between the AWS Console (the web frontend of AWS) and the CDK (the
“programmatic frontend” of AWS).

AWS constructs should *not* have a “props” property
[_awslint:props-no-property_].

Construct props should expose the *full set* of capabilities of the AWS service
through a declarative interface [_awslint:props-coverage_].

This section describes guidelines for construct props.

### Types

Use **strong types** (and specifically, construct interfaces) instead of
physical attributes when referencing other resources. For example, instead of
**keyArn**, use **kms.IKey** [_awslint:props-no-arn-refs_].

Do not “leak” the details or types of the CFN layer when defining your construct
API. In almost all cases, a richer object-oriented API can be exposed to
encapsulate the low-level surface [_awslint:props-no-cfn-types_].

Do not use the **Token** type. It provides zero type safety, and is a functional
interface that may not translate cleanly in other JSII runtimes. Therefore, it should
be avoided wherever possible [_awslint:props-no-tokens_].

**deCDK** allows users to synthesize CDK stacks through a CloudFormation-like
  template, similar to SAM. CDK constructs are represented in deCDK templates
  like CloudFormation resources. Technically, this means that when a construct
  is defined, users supply an ID, type and a set of properties. In order to
  allow users to instantiate all AWS Construct Library constructs through the
  deCDK syntax, we impose restrictions on prop types _[awslint:props-decdk]_:

* Primitives (string, number, boolean, date)
* Collections (list, map)
* Structs
* Enums
* Enum-like classes
* Union-like classes
* References to other constructs (through their construct interface)
* Integration interfaces (interfaces that have a “**bind**” method)

### Defaults

A prop should be *required* only if there is no possible sensible default value
that can be provided *or calculated*.

Sensible defaults have a tremendous impact on the developer experience. They
offer a quick way to get started with minimal cognitive, but do not limit users
from harnessing the full power of the resource, and customizing its behavior.

> A good way to determine what's the right sensible default is to refer to the
  AWS Console resource creation experience. In many cases, there will be
  alignment.

The **@default** documentation tag must be included on all optional properties
of interfaces.

In cases where the default behavior can be described by a value (typically the
case for booleans and enums, sometimes for strings and numbers), the value immediately
follows the **@default** tag and should be a valid JavaScript value (as in:
`@default false`, or `@default "stringValue"`).

In the majority of cases, the default behavior is not a specific value but
rather depends on circumstances/context. The default documentation tag must
begin with a “**-**" and then include a description of the default behavior
_[awslint:props-default-doc]_. This is specially true if the property
is a complex value or a reference to an object: don't write `@default
undefined`, describe the behavior that happens if the property is not
supplied.

Describe the default value or default behavior, even if it's not CDK that
controls the default. For example, if an absent value does not get rendered
into the template and it's ultimately the AWS *service* that determines the
default behavior, we still describe it in our documentation.

Examples:

```ts
// ✅ DO - uses a '-' and describes the behavior

/**
 * External KMS key to use for bucket encryption.
 *
 * @default - if encryption is set to "Kms" and this property is undefined, a
 * new KMS key will be created and associated with this bucket.
 */
encryptionKey?: kms.IEncryptionKey;
```

```ts
/**
 * External KMS key to use for bucket encryption.
 *
 * @default undefined
 *            ❌ DO NOT - that the value is 'undefined' by default is implied. However,
 *                        what will the *behavior* be if the value is left out?
 */
encryptionKey?: kms.IEncryptionKey;
```

```ts
/**
 * Minimum capacity of the AutoScaling resource
 *
 * @default - no minimum capacity
 *             ❌ DO NOT - there most certainly is. It's probably 0 or 1.
 *
 * // OR
 * @default - the minimum capacity is the default minimum capacity
 *             ❌ DO NOT - this is circular and useless to the reader.
 *                         Describe what will actually happen.
 */
minCapacity?: number;
```

### Flat

Do not introduce artificial nesting for props. It hinders discoverability and
makes it cumbersome to use in some languages (like Java) [_awslint:props-flat_].

You can use a shared prefix for related properties to make them appear next to
each other in documentation and code completion:

For example, instead of:

```ts
new Bucket(this, 'MyBucket', {
  bucketWebSiteConfiguration: {
    errorDocument: '404.html',
    indexDocument: 'index.html',
  }
});
```

Prefer:

```ts
new Bucket(this, 'MyBucket', {
  websiteErrorDocument: '404.html',
  websiteIndexDocument: 'index.html'
});
```

### Concise

Property names should be short and concise as possible and take into
consideration the ample context in which the property is used. Being concise
doesn't mean inventing new semantics. It just means that you can remove
redundant context from the property names.

Being concise doesn't mean you should invent new service semantics (see next
item). It just means that you can remove redundant context from the property
names. For example, there is no need to repeat the resource type, the property
type or indicate that this is a "configuration".

For example, prefer “readCapacity” versus “readCapacityUnits”.

### Naming

We prefer the terminology used by the official AWS service documentation over
new terminology, even if you think it's not ideal. It helps users diagnose
issues and map the mental model of the construct to the service APIs,
documentation and examples. For example, don't be tempted to change SQS's
**dataKeyReusePeriod** with **keyRotation** because it will be hard for people
to diagnose problems. They won't be able to just search for “sqs dataKeyReuse”
and find topics on it.

> We can relax this guideline when this is about generic terms (like
  `httpStatus` instead of `statusCode`). The important semantics to preserve are
  for *service features*: I wouldn't want to rename "lambda layers" to "lambda
  dependencies" just because it makes more sense because then users won't be
  able to bind these terms to the service documentation.

Indicate units of measurement in property names that don't use a strong
type. Use “milli”, “sec”, “min”, “hr”, “Bytes”, “KiB”, “MiB”, “GiB” (KiB=1024
bytes, while KB=1000 bytes).

### Property Documentation

Every prop must have detailed documentation. It is recommended to **copy** from
the official AWS documentation in English if possible so that language and style
will match the service.

### Enums

When relevant, use enums to represent multiple choices.

```ts
export enum MyEnum {
  OPTION1 = 'op21',
  OPTION2 = 'opt2',
}
```

A common pattern in AWS is to allow users to select from a predefined set of
common options, but also allow the user to provide their own customized values.

A pattern for an "Enum-like Class" should be used in such cases:

```ts
export interface MyProps {
  option: MyOption;
}

export class MyOption {
  public static COMMON_OPTION_1 = new MyOption('common.option-1');
  public static COMMON_OPTION_2 = new MyOption('common.option-2');

  public MyOption(public readonly customValue: string) { }
}
```

Then usage would be:

```ts
new BoomBoom(this, 'Boom', {
  option: MyOption.COMMON_OPTION_1
});
```

Suggestion for alternative syntax for custom options? Motivation: if we make
everything go through static factories, it will look more regular (I'm fine not
pursuing this, just popped into my head):

```ts
export class MyOption {
  public static COMMON_OPTION_1 = new MyOption('common.option-1');
  public static COMMON_OPTION_2 = new MyOption('common.option-2');

  public static custom(value: string) {
    return new MyOption(value);
  }

  // 'protected' iso. 'private' so that someone that really wants to can still
  // do subclassing. But maybe might as well be private.
  protected MyOption(public readonly value: string) { }
}

// Usage
new BoomBoom(this, 'Boom', {
  option: MyOption.COMMON_OPTION_1
});

new BoomBoom(this, 'Boom', {
  option: MyOption.custom('my-value')
});
```

### Unions

Do not use TypeScript union types in construct APIs (`string | number`) since
many of the target languages supported by the CDK cannot strongly-model such
types _[awslint:props-no-unions]_.

Instead, use a class with static methods:

```ts
new lambda.Function(this, 'MyFunction', {
  code: lambda.Code.asset('/asset/path'), // or
  code: lambda.Code.bucket(myBucket, 'bundle.zip'), // or
  code: lambda.Code.inline('code')
  // etc
}
```