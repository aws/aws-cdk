## Construct Interface

One of the important tenets of the AWS Construct Library is to use strong-types
when referencing resources across the library. This is in contrast to how AWS
backend APIs (and, consequently, AWS CloudFormation) model reference via one of
their *runtime attributes* (such as the resource's ARN). Since the AWS CDK is a
client-side abstraction, we can offer developers a much richer experience by
using *object references* instead of *attribute references*.

Using object references instead of attribute references allows consumers of
these objects to have a richer interaction with the consumed object. They can
reference runtime attributes such as the resource's ARN, but also utilize logic
encapsulated by the target object.

Here's an example: when a user defines an S3 bucket, they can pass in a KMS key
that will be used for bucket encryption:

```ts
new s3.Bucket(this, 'MyBucket', { encryptionKey: key });
```

The **Bucket** class can now use **key.keyArn** to obtain the ARN for the key,
but it can also call the **key.grantEncrypt** method as a result of a call to
**bucket.grantWrite**. Separation of concerns is a basic OO design principle:
the fact that the Bucket class needs the ARN or that it needs to request
encryption permissions are not the user's concern, and the API of the Bucket
class should not “leak” these implementation details. In the future, the Bucket
class can decide to interact differently with the **key** and this won't require
expanding its surface area. It also allows the **Key** class to change its
behavior (i.e. add an IAM action to enable encryption of certain types of keys)
without affecting the API of the consumer.

### Owned vs. Unowned Constructs

Using object references instead of attribute references provides a richer API,
but also introduces an inherent challenge: how do we reference constructs that
are not defined inside the same app (“**owned**” by the app)? These could be
resources that were created by some other AWS CDK app, via the AWS console,
etc. We call these **“unowned” constructs.**

In order to model this concept of owned and unowned constructs, all constructs
in the AWS Construct Library should always have a corresponding **construct
interface**. This interface includes the API of the construct
_[awslint:construct-interface]_.

Therefore, when constructs are referenced ***anywhere*** in the API (e.g. in
properties or methods of other resources or higher-level constructs), the
resource interface (`IFoo`) should be used over concrete resource classes
(`Foo`). This will allow users to supply either internal or external resources
_[awslint:ref-via-interface]_.

Construct interfaces must extend the **IConstruct** interface in order to allow
consumers to take advantage of common resource capabilities such as unique IDs,
paths, scopes, etc _[awslint:construct-interface-extends-iconstruct]_.

Constructs that directly represent AWS resources (most of the constructs in the
AWS Construct Library) should extend **IResource** (which, transitively, extends
**IConstruct**) _[awslint:resource-interface-extends-resource]_.

### Abstract Base

It is recommended to implement an abstract base class **FooBase** for each
resource **Foo**. The base class would normally implement the entire
construct interface and leave attributes as abstract properties.

```ts
abstract class FooBase extends Resource implements IFoo {
  public abstract fooName: string;
  public abstract fooArn: string;

  // .. concrete implementation of IFoo (grants, metrics, factories),
  // should only rely on "fooName" and "fooArn" theoretically
}
```

The construct base class can then be used to implement the various
deserialization and import methods by defining an ad-hoc local class which
simply provides an implementation for the attributes (see “Serialization” below
for an example).

The abstract base class should be internal and not exported in the module's API
_[awslint:construct-base-is-private]_. This is only a recommended (linter
warning).