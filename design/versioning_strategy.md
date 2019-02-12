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
* Customers are able to build applications based off stable APIs
* Customers can understand API changes through [Semantic versioning][semver]
* All of the project's codebase is mastered in the [mono-repo][awslabs/aws-cdk]
* New major versions are released infrequently (if at all) and in a highly controlled manner
* Modules and API are allowed to mature at their own pace, regardless of their position in the
  dependency tree

## Standard
Versions of the packages that compose the [AWS Cloud Development Kit][awslabs/aws-cdk] are
maintained according to the following principles:

1. All libraries that compose the [AWS Cloud Development Kit][awslabs/aws-cdk] are released using a
   single version number for each release, regardless of whether the API of a particular module has
   changed or not.
2. All APIs and language bindings are associated with a maturity level indicator:
   * **Experimental** indicates APIs or language bindings that are still immature and may incur
     breaking changes as feedback is collected and the design is iterated over.
   * **Stable** indicates APIs or language bindings that are - as the name implies - stable, and can
     be depended on by customers who do not wish to deal with API breaking changes.
   * **Deprecated** indicates APIs that should not be used by new code, but remain in the libraries
     for backwards compatibility. Documentation typically indicates the preferred replacement.
3. Version numbers are allocated in conformance to [Semantic versioning `v2.0.0`][semver], however
   APIs that are flagged as **Experimental** are exempt, and may incur breaking changes on any
   *feature release* (where **Stable** and **Deprecated** APIs may only incur breaking changes on a
   *major release*)

In order to make it easier for customers to ensure no undersired dependency is taken on
**Experimental** APIs, mechanisms will be built in the compiler toolchain or the runtime (according
to what is feasible for every target language) to reject use of **Experimental** APIs unless the
user has expressly opted in to enable their usage.

New versions are automatically released on a daily schedule (with some possible exceptions), and the
version numbers are automatically determined by inspecting the `git` history using a tool such as
`conventional-changelog`. Special tooling will be written to accomodate for the fact that `BREAKING
CHANGES` to *Experimental* APIs incur a *feature* (and not *major*) version bump. In order to  help
protect against incorrect commit messages, an additional check will be performed on
[JSII][awslabs/jsii] modules, assessing the impact of a release against the type model.

## Motivation
### API Maturity and Semantic Versioning
Some of the AWS Services (such as *EC2*, *ECS*, ...) have a very large and complex surface. In many
cases, building abstractions that support the vast majority of the use-cases is relatively
straight-forward, but extending those to cover the totality of available features (as the *L2*
constructs should) involves a considerable effort.

In order to allow building new features in a *post-GA* module in an iterative manner, the module's
version number cannot be the only factor in assessing an API's stability. Individual APIs (either at
the construct level, or possibly down to an individual method level) will be annotated with a
maturity indication by the maintainers: **Experimental**, **Stable** or **Deprecated**.

The guarantees of [Semantic Versioning][semver] do not apply to **Experimental** APIs, meaning those
can incur breaking changes in a *feature* release (as opposed to only a *major* release for
**Stable** and **Deprecated** APIs).

### Implications of Language Bindings
Customers expect to be able to build applications using **Stable** APIs without having to worry
about paying a tax when upgrading their dependencies. However, since [jsii][awslabs/jsii] generates
bindings for the CDK Construct Libraries in mutliple languages, it is important to follow the same
maturity model for those.

A customer can safely assume there will be no breaking change on any **Stable** API that is being
accessed from any **Stable** language binding; however, an **Experimental** language binding is
allowed to change it's code generation in ways that break customer APIs.

### Developer Experience
A single (semantic) version is used across all the modules in the project. This makes it easier for
customers to manage versions of their CDK dependencies, and removes the risk to introduce impossible
dependency constraints (where two of a customer's dependencies depend on incompatible versions of a
single CDK Construct Library). This requires coordination across all the modules whenever a new
major version needs to be released, however since **Experimental** APIs are not covered by [Semantic
Versioning][semver], new major version should only ever need to be released when a major framework
change is made.

In order for the maturity model to be usable by customers, the maturity signal should be surfaced
clearly in the reference documentation, ideally in the way people normally expect to learn about
API maturity in the language they are developing in. For example, Java developers might expect to
have classes and methods annotated with an annotation such as `@Experimental` or `@Deprecated`.

The ecosystem should, by default, not allow user code to make use of **Experimental** features. When
possible, the enforcement should be applied at build time, and it might in certain circumstances be
necessary to resort to a runtime validation. Customers can opt to disable this protection (either
for all experimental APIs, or maybe selectively for certain APIs only).

<!-- References -->
[awslabs/aws-cdk]: https://github.com/awslabs/aws-cdk
[awslabs/jsii]: https://github.com/awslabs/jsii
[semver]: https://semver.org/spec/v2.0.0.html
