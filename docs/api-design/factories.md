## Factories

In most AWS services, there are one or more resources which can be referred to as
“primary resources” (normally one), while other resources exposed by the service
can be considered “secondary resources”.

For example, the AWS Lambda service exposes the **Function** resource, which can
be considered the primary resource while **Layer**, **Permission**, **Alias**
are considered secondary. For API Gateway, the primary resource is **RestApi**,
and there are many secondary resources such as **Method**, **Resource**,
**Deployment**, **Authorizer**.

Secondary resources are normally associated with the primary resource (i.e. a
reference to the primary resource must be supplied upon initialization).

Users should be able to define secondary resources either by directly
instantiating their construct class (like any other construct), and passing in a
reference to the primary resource's construct interface *or* it is recommended
to implement convenience methods on the primary resource that will facilitate
defining secondary resources. This improves discoverability and ergonomics
_[awslint:factory-method]_.

For example, **lambda.Function.addLayer** can be used to add a layer to the
function, **apigw.RestApi.addResource** can be used to add to an API.

Methods for defining a secondary resource “Bar” associated with a primary
resource “Foo” should have the following signature:

```ts
export interface IFoo {
  addBar(...): Bar;
}
```

Notice that:

* The method has an “add” prefix.
  It implies that users are adding something to their stack.
* The method is implemented on the construct interface
  (to allow adding secondary resources to unowned constructs).
* The method returns a “Bar” instance (owned).

In order to reuse the set of props used to configure the secondary resource,
define a base interface for **FooProps** called **FooOptions** to allow
secondary resource factory methods to reuse props
_[awslint:factory-method-options]_:

```ts
export interface LogStreamOptions {
  logStreamName?: string;
}

export interface LogStreamProps extends LogStreamOptions {
  logGroup: ILogGroup;
}

export interface ILogGroup {
  addLogStream(id: string, options?: LogStreamOptions): LogStream;
}
```