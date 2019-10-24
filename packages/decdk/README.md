# deCDK - Declarative CDK

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

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

## Development

### Examples/Tests

When you build this module, it will produce a `cdk.schema.json` file at the root, which is referenced by the examples in the [`examples`](./examples) directory. This directory includes working examples of deCDK templates for various areas. We also snapshot-test those to ensure there are no unwanted regressions.

## Design

"Deconstruction" is the process of reflecting on the AWS Construct Library's type system and determining what would be the declarative interface for each API. This section describes how various elements in the library's type system are represented through the template format.

### Constructs

Constructs can be defined in the `Resources` section of the template. The `Type` of the resource is the fully-qualified class name (e.g. `@aws-cdk/aws-s3.Bucket`) and `Properties` are mapped to the deconstructed type of the construct's "Props" interface (e.g. `BucketProps`).

### Data Interfaces ("Props")

jsii has a concept of "data interfaces", which are basically interfaces that do not have methods. For example, all construct "props" are data interfaces.

> In some languages (Python, Ruby), if a method accepts a data interface as the last argument, interface properties can be used as keyword arguments in the method call. Other languages have a different idiomatic representation of data such as Java PoJos and Builders.

deCDK maps data interfaces to closed JSON objects (no additional properties), and will recursively deconstruct all property types.

### Primitives

Strings, numbers, booleans, dates, lists and maps are all deconstructed 1:1 to their JSON representation.

### Enums

Enums are mapped to JSON schema enums.

### References

If deCDK encounters a reference to another __construct__ (a type that extends `cdk.Construct` or an interface that extends `cdk.IConstruct`), it will allow referencing it via a “Ref” intrinsic. For example, here's a definition of an ECS cluster that references a VPC:

```yaml
Resources:
  VPC:
    Type: "@aws-cdk/aws-ec2.Vpc"
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
  runtime: lambda.Runtime.NODEJS_10_X,
  code: lambda.Code.asset('./src')
});
```

And here's the deCDK version:

```json
{
  "MyHandler": {
    "Type": "@aws-cdk/aws-lambda.Function",
    "Properties": {
      "handler": "index.handler",
      "runtime": "nodejs10.x",
      "code": { "asset": { "path": "./src" } }
    }
  }
}
```

### Polymorphism

Due to the decoupled nature of AWS, The AWS Construct Library highly utilizes polymorphism to expose rich APIs to users. In many cases, APIs would accept an interface of some kind, and various AWS services provide an implementation for that interface. deCDK is able to find all concrete implementation of an interface or an abstract class and offer the user an enum-like experience. The following example shows how this approach can be used to define AWS Lambda events:

```json
{
  "Resources": {
    "MyTopic": {
      "Type": "@aws-cdk/aws-sns.Topic"
    },
    "Table": {
      "Type": "@aws-cdk/aws-dynamodb.Table",
      "Properties": {
        "partitionKey": {
          "name": "ID",
          "type": "String"
        },
        "streamSpecification": "NewAndOldImages"
      }
    },
    "HelloWorldFunction": {
      "Type": "@aws-cdk/aws-lambda.Function",
      "Properties": {
        "handler": "app.hello_handler",
        "runtime": "Python36",
        "code": {
          "asset": { "path": "." }
        },
        "environment": {
          "Param": "f"
        },
        "events": [
          { "@aws-cdk/aws-lambda-event-sources.DynamoEventSource": { "table": { "Ref": "Table" }, "startingPosition": "TrimHorizon" } },
          { "@aws-cdk/aws-lambda-event-sources.ApiEventSource": { "method": "GET", "path": "/hello" } },
          { "@aws-cdk/aws-lambda-event-sources.ApiEventSource": { "method": "POST", "path": "/hello" } },
          { "@aws-cdk/aws-lambda-event-sources.SnsEventSource": { "topic": { "Ref": "MyTopic" } } }
        ]
      }
    }
  }
}
```

The keys in the “events” array are all fully qualified names of classes in the AWS Construct Library. The declaration is “Array<IEventSource>”. When deCDK deconstructs the objects in this array, it will create objects of these types and pass them in as IEventSource objects.

### `Fn::GetAtt`

deCDK also supports referencing specific attributes of CDK resources by the intrinsic `Fn::GetAtt`. When processing the template, if an `Fn::GetAtt` is found, and references a CDK construct, the attribute name is treated as a property name of the construct and its value is used.

The following example shows how to output the “url” property of a `@aws-cdk/aws-lambda.Function` from above:

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

If deCDK doesn't identify a resource type as a CDK resource, it will just pass it through to the resulting output. This means that any existing CloudFormation/SAM resources (such as `AWS::SQS::Queue`) can be used as-is.

The decdk JSON schema will simply pass through any resources that have a type that includes `::`, so don't expect any validation of raw CloudFormation resource properties.

## Roadmap

There is much more we can do here. This section lists API surfaces with ideas on how to deconstruct them.

### Imports

When decdk encounters a reference to an AWS construct, it currently requires a `Ref` to another resource in the template. We should also support importing external resources by reflecting on the various static `fromXxx`, `importXxx` and deconstructing those methods.

For example if we have a property `Bucket` that's modeled as an `s3.IBucket`, at the moment it will only accept:

```json
"Bucket": { "Ref": "MyBucket" }
```

But this requires that `MyBucket` is defined within the same template. If we want to reference a bucket by ARN, we should be able to do this:

```json
"Bucket": { "arn": "arn-of-bucket" }
```

Which should be translated to a call:

```ts
bucket: Bucket.fromBucketArn(this, 'arn-of-bucket')
```

### Grants

AWS constructs expose a set of "grant" methods that can be used to grant IAM principals permissions to perform certain actions on a resource (e.g. `table.grantRead` or `lambda.grantInvoke`).

deCDK should be able to provide a declarative-style for expressing those grants:

```json
"MyFunction": {
  "Type": "@aws-cdk/aws-lambda.Function",
  "Properties": {
    "grants": {
      "invoke": [ { "Ref": "MyRole" }, { "Ref": "AnotherRole" } ]
    }
  }
}
```

### Events

The CDK employs a loose pattern for event-driven programming by exposing a set of `onXxx` methods from AWS constructs. This pattern is used for various types of event systems such as CloudWatch events, bucket notifications, etc.

It might be possible to add a bit more rigor to these patterns and expose them also via a declarative API:

```json
"MyBucket": {
  "Type": "@aws-cdk/aws-s3.Bucket",
  "Properties": {
    "on": {
      "objectCreated": [
        {
          "target": { "Ref": "MyFunction" },
          "prefix": "foo/"
        }
      ]
    }
  }
}
```

### addXxxx

We should enforce in our APIs that anything that can be "added" to a construct can also be defined in props as an array. `awslint` can enforce this and ensure that `addXxx` methods always return `void` and have a corresponding prop.

### Supporting user-defined constructs

deCDK can deconstruct APIs that adhere to the standards defined by __awslint__ and exposed through jsii (it reflects on the jsii type system). Technically, nothing prevents us from allowing users to "bring their own constructs" to decdk, but those requirements must be met.

### Fully qualified type names

As you might have observed, whenever users need to reference a type in deCDK templates they are required to reference the fully qualified name (e.g. `@aws-cdk/aws-s3.Bucket`). We can obvsiouly come up with a more concise way to reference these types, as long as it will be possible to deterministically translate back and forth.

### Special Types

`iam.PolicyDocument` is tricky since it utilizes a fluent API. We need to think whether we want to revise the PolicyDocument API to be more compatible or add a utility class that can help.
- We should enable shorthand tags for intrinsics in YAML
