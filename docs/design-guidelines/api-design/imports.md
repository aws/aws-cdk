## Imports

Construct classes should expose a set of static factory methods with a
“**from**” prefix that will allow users to import *unowned* constructs into
their app.

The signature of all “from” methods should adhere to the following rules
_[awslint:from-signature]_:

* First argument must be **scope** of type **Construct**.
* Second argument is a **string**. This string will be used to determine the
  ID of the new construct. If the import method uses some value that is
  promised to be unique within the stack scope (such as ARN, export name),
  this value can be reused as the construct ID.
* Returns an object that implements the construct interface (**IFoo**).

### “from” Methods

Resource constructs should export static “from” methods for importing unowned
resources given one or more of its physical attributes such as ARN, name, etc. All
constructs should have at least one `fromXxx` method _[awslint:from-method]_:

```ts
static fromFooArn(scope: Construct, id: string, bucketArn: string): IFoo;
static fromFooName(scope: Construct, id: string, bucketName: string): IFoo;
```

> Since AWS constructs usually export all resource attributes, the logic behind
  the various “from\<Attribute\>” methods would normally need to convert one
  attribute to another. For example, given a name, it would need to render the
  ARN of the resource. Therefore, if **from\<Attribute\>** methods expect to be
  able to parse their input, they must verify that the input (e.g. ARN, name)
  doesn't have unresolved tokens (using **Token.unresolved**). Preferably, they
  can use **Stack.parseArn** to achieve this purpose.

If a resource has an ARN attribute, it should implement at least a **fromFooArn**
import method [_awslint:from-arn_].

To implement **fromAttribute** methods, use the abstract base class construct as
follows:

<!-- markdownlint-disable MD013 -->
```ts
class Foo {
  static fromArn(scope: Construct, fooArn: string): IFoo {
    class _Foo extends FooBase {
      public get fooArn() { return fooArn; }
      public get fooName() { return this.node.stack.parseArn(fooArn).resourceName; }
    }

    return new _Foo(scope, fooArn);
  }
}
```
<!-- markdownlint-enable MD013 -->

### From-attributes

If a resource has more than a single attribute (“ARN” and “name” are usually
considered a single attribute since it's usually possible to convert one to the
other), then the resource should provide a static **fromAttributes** method to
allow users to explicitly supply values to all resource attributes when they
import an external (unowned) resource [_awslint:from-attributes_].

```ts
static fromFooAttributes(scope: Construct, id: string, attrs: FooAttributes): IFoo;
```