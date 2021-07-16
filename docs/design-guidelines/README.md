# AWS Construct Library Design Guidelines

The AWS Construct Library is a rich class library of CDK constructs which
represent all resources offered by the AWS Cloud and higher-level constructs for
achieving common tasks.

The purpose of this document is to provide guidelines for designing the APIs in
the AWS Construct Library in order to ensure a consistent and integrated
experience across the entire AWS surface area.

## Preface

As much as possible, the guidelines in this document are enforced using the
[**awslint** tool](https://www.npmjs.com/package/awslint) which reflects on the
APIs and verifies that the APIs adhere to the guidelines. When a guideline is
backed by a linter rule, the rule name will be referenced like this:
_[awslint:resource-class-is-construct]_.

For the purpose of this document, we will use "Foo" to denote the official name
of the resource as defined in the AWS CloudFormation resource specification
(i.e. "Bucket", "Queue", "Topic", etc). This notation allows deriving names from
the official name. For example, `FooProps` would be `BucketProps`, `TopicProps`,
etc, `IFoo` would be `IBucket`, `ITopic` and so forth.

The guidelines in this document use TypeScript (and npm package names) since
this is the source programming language used to author the library, which is
later packaged and published to all programming languages through
[jsii](https://github.com/awslabs/jsii).

When designing APIs for the AWS Construct Library (and these guidelines), we
follow the tenets of the AWS CDK:

* **Meet developers where they are**: our APIs are based on the mental model of
the user, and not the mental model of the service APIs, which are normally
designed against the constraints of the backend system and the fact that these
APIs are used through network requests. It's okay to enable multiple ways to
achieve the same thing, in order to make it more natural for users who come from
different mental models.
* **Full coverage**: the AWS Construct Library exposes the full surface area of
AWS. It is not opinionated about which parts of the service API should be
used. However, it offers sensible defaults to allow users to get started quickly
with best practices, but allows them to fully customize this behavior. We use a
layered architecture so that users can choose the level of abstraction that fits
their needs.
* **Designed for the CDK**: the AWS Construct Library is primarily optimized for
AWS customers who use the CDK idiomatically and natively.  As much as possible,
the APIs are non-leaky and do not require that users understand how AWS
CloudFormation works. If users wish to “escape” from the abstraction, the APIs
offer explicit ways to do that, so that users won't be blocked by missing
capabilities or issues.
* **Open**: the AWS Construct Library is an open and extensible framework. It is
also open source. It heavily relies on interfaces to allow developers to extend
its behavior and provide their own custom implementations. Anyone should be able
to publish constructs that look & feel exactly like any construct in the AWS
Construct Library.
* **Designed for jsii**: the AWS Construct Library is built with jsii. This
allows the library to be used from all supported programming languages. jsii
poses restrictions on language features that cannot be idiomatically represented
in target languages.

## What's Included

The AWS Construct Library, which is shipped as part of the AWS CDK constructs
representing AWS resources.

The AWS Construct Library has multiple layers of constructs, beginning
with low-level constructs, which we call _CFN Resources_ (or L1, short for
"level 1") or CFN Resources (short for CloudFormation). These constructs
directly represent all resources available in AWS CloudFormation. CFN Resources
are periodically generated from the AWS CloudFormation Resource
Specification. They are named **Cfn**_Xyz_, where _Xyz_ is name of the
resource. For example, CfnBucket represents the AWS::S3::Bucket AWS
CloudFormation resource. When you use Cfn resources, you must explicitly
configure all resource properties, which requires a complete understanding of
the details of the underlying AWS CloudFormation resource model.

The next level of constructs, L2, also represent AWS resources, but with a
higher-level, intent-based API. They provide similar functionality, but provide
the defaults, boilerplate, and glue logic you'd be writing yourself with a CFN
Resource construct. L2 constructs offer convenient defaults and reduce the need
to know all the details about the AWS resources they represent, while providing
convenience methods that make it simpler to work with the resource. For example,
the `s3.Bucket` class represents an Amazon S3 bucket with additional properties
and methods, such as `bucket.addLifeCycleRule()`, which adds a lifecycle rule to
the bucket.

Examples of behaviors that an L2 commonly include:

- Strongly-typed modeling of the underlying L1 properties
- Methods for integrating other AWS resources (e.g., adding an event notification to
  an S3 bucket).
- Modeling of permissions and resource policies
- Modeling of metrics

In addition to the above, some L2s may introduce more complex and
helpful functionality, either part of the original L2 itself, or as part of a
separate construct. The most common form of these L2s are integration constructs
that model interactions between different services (e.g., SNS publishing to SQS,
CodePipeline actions that trigger Lambda functions).

The next level of abstraction present within the CDK are what we designate as
"L2.5s": a step above the L2s in terms of abstraction, but not quite at the
level of complete patterns or applications.  These constructs still largely
focus on a single logical resource -- in constrast to "patterns" which combine
multiple resources -- but are customized for a specific common usage scenario of
an L2. Examples of L2.5s in the CDK are `aws-apigateway.LambdaRestApi`,
`aws-lambda-nodejs.NodeJsFunction`, `aws-rds.ServerlessCluster` and `eks.FargateCluster`.

L2.5 constructs will be considered for inclusion in the CDK if they...

- cover a common usage scenario that can be used by a significant portion of
  the community;
- provide significant ease of use over the base L2 (via usage-specific defaults
  convenience methods or improved strong-typing);
- simplify or enable another L2 within the CDK

The CDK also currently includes some even higher-level constructs, which we call
patterns. These constructs often involve multiple kinds of resources and are
designed to help you complete common tasks in AWS or represent entire
applications. For example, the
`aws-ecs-patterns.ApplicationLoadBalancedFargateService` construct represents an
architecture that includes an AWS Fargate container cluster employing an
Application Load Balancer (ALB). These patterns are typically difficult to
design to be one-size-fits-all and are best suited to be published as separate
libraries, rather than included directly in the CDK. The patterns that currently
exist in the CDK will be removed in the next CDK major version (CDKv2).
