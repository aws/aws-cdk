## Construct Class

Constructs are the basic building block of CDK applications. They represent
abstract cloud components of any complexity. Constructs in the AWS Construct
Library normally represent physical AWS resources (such as an SQS queue) but
they can also represent abstract composition of other constructs (such as
**LoadBalancedFargateService**).

Most of the guidelines in this document apply to all constructs in the AWS
Construct Library, regardless of whether they represent concrete AWS resources
or abstractions. However, you will notice that some sections explicitly call out
guidelines that apply only to AWS resources (and in many cases
enforced/implemented by the **Resource** base class).

AWS services are modeled around the concept of *resources*. Services normally
expose one or more resources through their APIs, which can be provisioned
through the APIs control plane or through AWS CloudFormation.

Every resource available in the AWS platform will have a corresponding resource
construct class to represents it. For example, the **s3.Bucket** construct
represents Amazon S3 Buckets, the **dynamodb.Table** construct represents an
Amazon DynamoDB table. The name of resource constructs must be identical to the
name of the resource in the AWS API, which should be consistent with the
resource name in the AWS CloudFormation spec _[awslint:resource-class]_.

> The _awslint:resource-class_ rule is a **warning** (instead of an error). This
  allows us to gradually expand the coverage of the library.

Classes which represent AWS resources are constructs and they must extend the
**cdk.Resource** class directly or indirectly
_[awslint:resource-class-extends-resource]_.

> Resource constructs are normally implemented using low-level CloudFormation
  (“CFN”) constructs, which are automatically generated from the AWS
  CloudFormation resource specification.

The signature (both argument names and types) of all construct initializers
(constructors) must be as follows _[awslint:construct-ctor]_:

```ts
constructor(scope: cdk.Construct, id: string, props: FooProps)
```

The **props** argument must be of type FooProps
[_awslint:construct-ctor-props-type_].

If all props are optional, the `props` argument must also be optional
_[awslint:construct-ctor-props-optional]_.

```ts
constructor(scope: cdk.Construct, id: string, props: FooProps = {})
```

> Using `= {}` as a default value is preferable to using an optional qualifier
  (`?`) since it will ensure that props will never be `undefined` and therefore
  easier to parse in the method body.

As a rule of thumb, most constructs should directly extend the **Construct** or
**Resource** instead of another construct. Prefer representing polymorphic
behavior through interfaces and not through inheritance.

Construct classes should extend only one of the following classes
[_awslint:construct-inheritence_]:

* The **Resource** class (if it represents an AWS resource)
* The **Construct** class (if it represents an abstract component)
* The **XxxBase** class (which, in turn extends **Resource**)

All constructs must define a static type check method called **isFoo** with the
following implementation [_awslint:static-type-check_]:

```ts
const IS_FOO = Symbol.for('@aws-cdk/aws-foo.Foo');

export class Foo {
  public static isFoo(x: any): x is Foo {
    return IS_FOO in x;
  }

  constructor(scope: Construct, id: string, props: FooProps) {
    super(scope, id);

    Object.defineProperty(this, IS_FOO, { value: true });
  }
}
```