## Grants

Grants are one of the most powerful concepts in the AWS Construct Library. They
offer a higher level, intent-based, API for managing IAM permissions for AWS
resources.

**Despite the fact that they may be mutating**, grants should be exposed on the
  construct interface, and not on the concrete class
  _[awslint:grants-on-interface]_. See discussion above about mutability for
  reasoning.

Grants are represented as a set of methods with the “**grant**” prefix.

All constructs that represent AWS resources must have at least one grant method
called “**grant**” which can be used to grant a grantee (such as an IAM
principal) permission to perform a set of actions on the resource with the
following signature. This method is defined as an abstract method on the
**Resource** base class (and the **IResource** interface)
_[awslint:grants-grant-method]_:

```ts
grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
```

The **iam.Grant** class has a rich API for implementing grants which implements
the desired behavior.

Furthermore, resources should also include a set of grant methods for common use
cases. For example, **dynamodb.Table.grantPutItem**,
**s3.Bucket.grantReadWrite**, etc. In such cases, the signature of the grant
method should adhere to the following rules _[awslint:grant-signature]_:

1. Name should have a “grant” prefix
2. Returns an **iam.Grant** object
3. First argument must be **grantee: iam.IGrantable**

```ts
grantXxx(grantee: iam.IGrantable): iam.Grant;
```

It makes sense for some AWS resources to also expose grant methods on all
resources in the account. To support such use cases, expose a set of static
grant methods on the construct class. For example,
**dynamodb.Table.grantAllListStreams**. The signature of static grants should be
similar _[awslint:grants-static-all]_.

```ts
export class Table {
  public static grantAll(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
  public static grantAllListStreams(grantee: iam.IGrantable): iam.Grant;
}
```