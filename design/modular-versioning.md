# Modular Versioning
## Motivation
The AWS Cloud Development Kit is a complex project composed of over `100` packages. The vast
majority of those packages is made of construct libraries that expose each individual AWS services'
surface area to developers. Those libraries need to be allowed to mature (at reach *GA*) at their
own pace, in particular as the intention is to eventually transfer ownership of those to the service
teams. This means CDK packages need to be versioned individually (in other words: in a modular way).
Individual modules might also eventually be split out of the [awslabs/aws-cdk] mono-repo.

## Challenges
### Customer / Developer Experience
When a single version used across all of the packages in the project, it is trivial for a developer
to determine which is the appropriate version to use for each of the construct libraries they want
to use. However the situation is a much more complicated once all the modules can have their own
version. While an IDE can offer tooling to help determine which is the *current* version of a
package, this version might not be compatible with other libraries included in the dependency
closure. This can be particularly impairing for pervasive libraries such as the IAM construct
library, which is a transitive dependency of nearly all the construct libraries.

### Maintainer Experience
Patching a previous major version (for example due to a security disclosure) creates it's own
challenge. As any package may need to issue a patch release independent from the others, maintaining
packages in a [mono-repo][awslabs/aws-cdk] creates a need to have a release process able to isolate
a specific package for publishing. The situation becomes worse if two packages have to be
simultaneously patched, but the *origin* version of both packages are in different commits: the
process of merging the two *origins* into a single tree will be error prone and difficult to
standardize or automate.

The [developer experience](#customer-developer-experience) challenges are also applicable to
maintainers. In particular, whenever a pakcage upgrades one of it's *peer dependencies* (most `jsii`
target runtimes do not support having multiple versions of the same package co-exist at different
points of the dependency graph) to a new major version, then that module will have to incur a major
version bump. This effectively means that issuing a major version of the IAM library is likely to
snowball into a new major version being cut across the board (due to the library's pervasiveness in
the dependency closures). Testing for dependency compatibility is another challenge, as the valid
combinations of versions will grow exponentially with every modular version released, making it
difficult and expensive to validate usability.

### Documentation
There will no longer be a single version of the documentation for all the packages, and different
packages might release new versions at different cadences. This makes maintaining a single
documentation site referencing all the libraries' documentation challenging. In particular,
maintaining appropriate cross-linking between the various documentation pages is essential to the
documentation's effectiveness, but maintaining separate documentation roots for every package makes
those difficult to preserve.

### Releases
As each package can have it's own version and be released individually, GitHub releases will need to
be cut per-module instead of globally (a *unique* release line - for example release-date-based - is
not possible due to the possibility that a release is made to patch a non-*current* version). This
will cause a profusion of tags to be created in the [mono-repo][awslabs/aws-cdk] and the GitHub
release page might become difficult to navigate.

<!-- References: -->
[awslabs/aws-cdk]: https://github.com/awslabs/aws-cdk
