# AWS Construct Library Resource Design Guidelines

The AWS Construct Library is a rich class library of CDK constructs which
represent all resources offered by the AWS Cloud.

Resources are organized into modules based on their AWS service. For example,
the **Bucket** resource, which is offered by the Amazon S3 service will be
available under the **aws-s3** module.

Module and resource names correspond to the AWS CloudFormation naming. For
example, the AWS CloudFormation resource **AWS::S3::Bucket** represents the
module name **S3** and the resource name **Bucket**.

This document defines the design guidelines for AWS resource constructs. The
purpose of these guidelines is to provide a consistent developer experience
throughout the library.

For the purpose of this document we will use "**Xxx**" to denote the name of the
resource (i.e. "Bucket", "Queue", "Topic", etc).

## Resource Attributes

Every AWS resource has a set of "physical" runtime attributes such as ARN,
physical names, URLs, etc. These attributes are commonly late-bound, which means
they can only be resolved when AWS CloudFormation actually provisions the
resource.

Resource attributes  almost always represent **string** values (URL, ARN, name).
Sometimes they might also represent a **list of strings**.

Since we want
attributes can either be late-bound ("a promise to a string") or concrete ("a
string"), the AWS CDK has a mechanism called "tokens" which allows codifying
late-bound values into strings or string arrays. This approach was chosen in
order to dramatically simplify the type-system and ergonomics of CDK code. As
long as users treat these attributes as _opaque values_ (e.g. not try to parse
them or manipulate them), they can be used


One of the design tenets of the AWS CDK is to be strongly-typed.

- Runtime attributes should be represented as readonly properties on the resource class.
- Runtime attributes should use a the `string` type if the attribute resolves

## Resource Properties



## Internal/External Polymorphism




The following patterns should be implemented by all resource classes in the AWS
Construct Library.

Terminology:
- "Xxx": represents the CloudFormation resource name ().

Let's start by defining an interface which represents a resource of the type
"Xxx" (e.g. `Bucket`, `Topic`, `Function`, etc).

This interface should represent both resources defined within the same stack
(aka "internal", "owned") and existing resources that are defined in another
stack/app (aka "imported", "existing", "external" or "unowned"). Throughout this
document we shall refer to these two types of resources as **"internal"** and
**"external"**. Therefore, this is the recommended type to use in public APIs
that require this resource.

The interface should include all methods and properties, and extend any other
interfaces that are applicable for both internal and external resources of this
type.

Here's a template:

```ts
// extends all interfaces that are applicable for both internal
// and external resources of this type
export interface IXxx extends IFoo, IGoo {

  // attributes
  readonly xxxArn: string;
  readonly xxxFoo: string;
  readonly xxxBar: string;

  // security group connections (if applicable)
  readonly connections: ec2.Connections;

  // permission grants (adds statements to the principal's policy)
  grant(principal?: iam.IPrincipal, ...actions: string[]): void;
  grantFoo(principal?: iam.IPrincipal): void;
  grantBar(principal?: iam.IPrincipal): void;

  // resource policy (if applicable)
  addToResourcePolicy(statement: iam.PolicyStatement): void;

  // role (if applicable)
  addToRolePolicy(statement: iam.PolicyStatement): void;

  // pipeline (if applicable)
  addToPipeline(stage: pipelineapi.IStage, name: string, props?: XxxActionProps): XxxAction;

  // metrics
  metric(metricName: string, props?: cloudwatch.MetricCustomization): cloudwatch.Metric;
  metricFoo(props?: cloudwatch.MetricCustomization): cloudwatch.Metric;
  metricBar(props?: cloudwatch.MetricCustomization): cloudwatch.Metric;

  // export
  export(): XxxAttributes;

  // any other methods/properties that are applicable for both internal
  // and external resources of this type.
  // ...
}
```

As mentioned above, this is a polymorphic interface which represents both
internal and external resources of this type. When users wish to import an
external resource, they will the static method `Xxx.import(...)` which returns
an object that implements this interface.

Since many of the methods above (such as metrics and grants) are applicable
for both internal and external resources, it's usually a good idea to implement
an abstract base class which can be used to reuse these implementations.

The base class will likely be a `cdk.Construct` (since it is common for many
of these implementations to need to add constructs to the construct tree).
There are some implementations, such as `export` and the various attributes
which are likely to remain `abstract`, and will only become concrete when
we implement the actual resource and imported resource classes.


```ts
export abstract class XxxBase extends cdk.Construct implements IXxx {

  // attributes are usually still abstract at this level
  public abstract readonly xxxArn: string;
  public abstract readonly xxxBoo: string[];

  // the "export" method is also still abstract
  public abstract export(): XxxAttributes;

  // grants can usually be shared
  public grantYyy(principal?: iam.IPrincipal) {
    // ...
  }

  // metrics can usually be shared
  public metricFoo(...) { ... }
}
```

Now, let's define our main resource class:

```ts
// extends the abstract base class and implement any interfaces that are not applicable
// for imported resources. This is quite rare usually, but can happen.
export class Xxx extends XxxBase implements IAnotherInterface {

  // the import method is always going to look like this.
  public static import(parent: Construct, id: string, props: XxxAttributes): IXxx {
    return new ImportedXxx(parent, id, props);
  }

  // implement resource attributes as readonly properties
  public readonly xxxArn: string;

  // ctor's 3rd argument is always XxxProps. It should be optional (`= { }`) in case
  // there are no required properties.
  constructor(parent: Construct, id: string, props: XxxProps) {
    super(parent, id);

    // you would usually add a `CfnXxx` resource at this point.
    const resource = new CfnXxx(this, 'Resource', {
      // ...
    });

    // proxy resource properties
    this.xxxArn = resource.xxxArn;
    this.xxxFoo = resource.xxxFoo;
  }

  // this is how export() should be implemented on internal resources
  // they would produce a stack export and return the "Fn::ImportValue" token
  // for them so they can be imported to another stack.
  public export(): XxxAttributes {
    return {
      xxxArn: new cdk.Output(this, 'Arn', { value: this.xxxArn }).makeImportValue().toString(),
      // ...
    }
  }
}
```

- It must have a method with the following signature:

```ts
static import(parent: Construct, id: string, props: XxxAttributes): IXxx
```

### `interface XxxProps`

The set of initialization properties for `Xxx`.

### `interface XxxAttributes`

An interface that can be used to import a resource of this type into the app.

- Should have the minimum required properties, that is: if it is possible to
  parse the resource name from the ARN (using `cdk.ArnUtils.parse`), then only
  the ARN should be required.
- In cases where it is not possible to parse the ARN (e.g. if it is a token and
  the resource name might have use "/" characters), both the ARN and the name
  should be optional and runtime-checks should be performed to require that at
  least one will be defined. See `ecr.RepositoryAttributes` for an example.



A data interface with the set of attributes which represent an existing AWS
resource. Normally this would be something like `xxxArn`, `xxxName`, etc. This
class is used when "importing" an existing resource to an application.

