# Versioning Strategy
## Executive Summary
The [AWS Cloud Development Kit][awslabs/aws-cdk] is a complex project composed of over `100`
packages. The vast majority of those packages is made of construct libraries that expose each
individual AWS services' surface area to developers. Different parts of the product will mature at
different paces (for example, the *most used* features will typically collect feedback faster, and
thus will mature faster).

This document describes the versioning startegy used by the [AWS Cloud Development
Kit][awslabs/aws-cdk] in order to maintain development agility and customer legibility of the
various API's maturity.

## High-Level Requirements
Those are the high-level requirements this design aims to satisfy, in no particular order:
* Customers are able to build applications on top of stable APIs
* The version scheme adheres to [Semantic versioning][semver]
* All of the project's codebase is mastered in the [mono-repo][awslabs/aws-cdk]
* New major versions are released infrequently and in a highly controlled manner
* Modules and API are allowed to mature at their own pace, regardless of their position in the
  dependency tree

## Solution
### API Maturity and Semantic Versioning
Some of the AWS Services (such as *EC2*, *ECS*, ...) have a very large and complex surface. In many
cases, building abstractions that support the vast majority of the use-cases is relatively
straight-forward, but extending those to cover the totality of available features (as the *L2*
constructs should) involves a considerable effort.

In order to allow building new features in a *post-GA* module in an iterative manner, the module's
version number cannot be the only factor in assessing an API's stability. Individual APIs (either at
the construct level, or possibly down to an individual method level) will be annotated with a
maturity indication by the maintainers: *experimental*, *stable* or *deprecated*.

The guarantees of [Semantic Versioning][semver] do not apply to *experimental* APIs, meaning those
can incur breaking changes in a *feature* release (as opposed to only a *major* release for *stable*
and *deprecated* APIs).

### Implications of Language Bindings
Customers expect to be able to build applications using *stable* APIs without having to worry about
paying a tax when upgrading their dependencies. However, since [jsii][awslabs/jsii] generates
bindings for the CDK Construct Libraries in mutliple languages, it is important to follow the same
maturity model for those.

A customer can safely assume there will be no breaking change on any *stable* API that is being
accessed from any *stable* language binding; however, an *experimental* language binding is allowed
to change it's code generation in ways that break customer APIs.

### Developer Experience
A single (semantic) version is used across all the modules in the project. This makes it easier for
customers to manage versions of their CDK dependencies, and removes the risk to introduce impossible
dependency constraints (where two of a customer's dependencies depend on incompatible versions of a
single CDK Construct Library). This requires coordination across all the modules whenever a new
major version needs to be released, however since *experimental* APIs are not covered by [Semantic
Versioning][semver], new major version should only ever need to be released when a major framework
change is made.

In order for the maturity model to be usable by customers, the maturity signal should be surfaced
clearly in the reference documentation, ideally in the way people normally expect to learn about
API maturity in the language they are developing in. For example, Java developers might expect to
have classes and methods annotated with an annotation such as `@Experimental` or `@Deprecated`.

The ecosystem should, by default, not allow user code to make use of *experimental* features. When
possible, the enforcement should be applied at build time, and it might in certain circumstances be
necessary to resort to a runtime validation. Customers can opt to disable this protection (either
for all experimental APIs, or maybe selectively for certain APIs only).

<!-- References -->
[awslabs/aws-cdk]: https://github.com/awslabs/aws-cdk
[awslabs/jsii]: https://github.com/awslabs/jsii
[semver]: https://semver.org/spec/v2.0.0.html
