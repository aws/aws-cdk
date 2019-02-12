# deCDK - Declarative CDK

Define AWS CDK applications declaratively.

This tool reads CloudFormation-like JSON/YAML templates which can contain both normal CloudFormation resources (`AWS::S3::Bucket`) and also reference AWS CDK resources (`@aws-cdk/aws-s3.Bucket`).

## Getting Started

Install the AWS CDK CLI and the `decdk` tool:

```console
$ npm i -g aws-cdk decdk
```

This is optional (but highly recommended): You can use `decdk-schema` to generate a JSON schema and use it for IDE completion and validation:

```console
$ decdk-schema > cdk.schema.json
```

Okay, we are ready to begin with a simple example. Create a file called `hello.json`:

```json
{
  "$schema": "./cdk.schema.json",
  "Resources": {
    "MyQueue": {
      "Type": "@aws-cdk/aws-sqs.Queue",
      "Properties": {
        "fifo": true
      }
    }
  }
}
```

Now, you can use it as a CDK app (you'll need to `npm install -g aws-cdk`):

```console
$ cdk -a "decdk hello.json" synth
Resources:
  MyQueueE6CA6235:
    Type: AWS::SQS::Queue
    Properties:
      FifoQueue: true
    Metadata:
      aws:cdk:path: hello2/MyQueue/Resource
```

As you can see, the deCDK has the same semantics as a CloudFormation template. It contains a section for “Resources”, where each resource is defined by a *type* and a set of *properties*. deCDK allows using constructs from AWS Construct Library in templates by identifying the class name (in this case `@aws-cdk/aws-sqs.Queue`).

When deCDK processes a template, it identifies these special resources and under-the-hood, it instantiates an object of that type, passing in the properties to the object's constructor. All CDK constructs have a uniform signature, so this is actually straightforward.

## Deconstruction

"Deconstruction" is the process of reflecting on the AWS Construct Library's type system and determining what would be the declarative interface for each API. This section describes how various elements in the library's type system are represented through the template format.

### Constructs

Constructs can be defined in the `Resources` section of the template. The `Type` of the resource is the fully-qualified class name (e.g. `@aws-cdk/aws-s3.Bucket`) and `Properties` are mapped to the deconstructed type of the construct's "Props" interface (e.g. `BucketProps`).

### Data Interfaces

jsii has a concept of "data interfaces", which are basically interfaces that do not have methods. For example, all construct "props" are data interfaces.

> In some languages (Python, Ruby), if a method accepts a data interface as the last argument, interface properties can be used as keyword arguments in the method call. Other languages have a different idiomatic representation of data such as Java PoJos and Builders.

deCDK maps data interfaces to closed JSON objects (do not allow additional properties), and will recursively deconstruct all property types.

### Primitives

Strings, numbers, booleans, Dates, lists and maps are all deconstructed 1:1 to their JSON representation.

### Enums

Enums are mapped to JSON schema enums.

### References

If deCDK identifies that an API expects a reference to another construct (a type that extends cdk.Construct or an interface that extends cdk.IConstruct), it will allow referencing it via a “Ref” intrinsic. For example, here's a definition of an ECS cluster that references a VPC:

```yaml
Resources:
  VPC:
    Type: "@aws-cdk/aws-ec2.VpcNetwork"
    Properties:
      maxAZs: 1
  Cluster:
    Type: "@aws-cdk/aws-ecs.Cluster"
    Properties:
      vpc:
        Ref: VPC
```

### Enum-like Classes

Based on the AWS Construct Library's consistent guidelines and conventions, which are also enforced by a tool we use called “awslint”, deCDK is also capable of expressive more complex idioms. For example, enum-like classes, which are classes that expose a set of static properties or methods can be mapped to JSON enums or method invocations. For example, this is how you define an AWS Lambda function in the CDK (TypeScript):

```ts
new lambda.Function(this, 'MyHandler', {
  handler: 'index.handler',
  runtime: lambda.Runtime.NodeJS810,
  code: lambda.Code.asset('./src')
});
```

And here's the deCDK version:

```yaml
MyHandler:
  Type: "@aws-cdk/aws-lambda.Function"
  Properties:
    handler: index.handler
    runtime: NodeJS810
    code:
      asset:
        path: "./src"
```

### Polymorphism

Due to the decoupled nature of AWS, The AWS Construct Library highly utilizes polymorphism to expose rich APIs to users. In many cases, APIs would accept an interface of some kind, and various AWS services provide an implementation for that interface. deCDK is able to find all concrete implementation of an interface or an abstract class and offer the user an enum-like experience. The following example shows how this approach can be used to define AWS Lambda events:

```yaml
MyHandler:
  Type: "@aws-cdk/aws-lambda.Function"
  Properties:
    handler: index.handler
    runtime: NodeJS810
    code:
      asset:
        path: "./src"
    events:
    - DynamoEventSource:
        table:
          Ref: Table
        props:
          startingPosition: TrimHorizon
    - ApiEventSource:
        method: GET
        path: "/hello"
    - ApiEventSource:
        method: POST
        path: "/hello"
    - SnsEventSource:
        topic:
          Ref: MyTopic
```

The keys in the “events” array (“DynamoEventSource”, “ApiEventSource”, “SnsEventSource”) are all names of classes in the AWS Construct Library. The declaration is “Array<IEventSource>”. When deCDK deconstructs the objects in this array, it will create objects of these types and pass them in as IEventSource objects.

### `Fn::GetAtt`

deCDK also supports referencing specific attributes of CDK resources by the intrinsic “Fn::GetAt”. When processing the template, if an Fn::GetAtt is found, and references a CDK construct, the attribute name is treated as a property name of the construct and it's value is used.

The following example shows how to output the “url” property of a @aws-cdk/aws-lambda.Function from above:

```yaml
Outputs:
  HelloWorldApi:
    Description: API Gateway endpoint URL for Prod stage for Hello World function
    Value:
      Fn::GetAtt:
      - MyHandler
      - url
```

### Raw CloudFormation

If deCDK doesn't identify a resource type as a CDK resource, it will just pass it through to the resulting output (through a special construct we have in the CDK called `cdk.Include`). This means that any existing CloudFormation resources (such as `AWS::SQS::Queue`) can be used as-is.

## Issues

- [ ] PolicyDocument API is not deconstructable
- [ ] Shorthand tags for intrinsics in YAML
- [ ]
