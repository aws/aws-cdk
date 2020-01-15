# Bazel

[Bazel](https://bazel.build) is the externally-published open-source version of Google's internal build system. 
In [its own words](https://docs.bazel.build/versions/master/bazel-overview.html):
> Bazel is an open-source build and test tool similar to Make, Maven, and Gradle. It uses a human-readable, high-level build language. 
> Bazel supports projects in multiple languages and builds outputs for multiple platforms. Bazel supports large codebases across multiple repositories, 
> and large numbers of users.

The AWS CDK currently uses a mix of custom build scripts, Lerna, and sheer force of will to execute builds and to orchestrate
tests. These builds and tests are not incremental, and do not take advantage of caching or sandboxing. Bazel, alternatively,
excels in all of these areas and is very simple and straightforward to work with.

Building a submodule under Bazel necessarily builds all of its declared dependencies, ensuring that the most up-to-date
version of the code is used, rebuilt, and cached for later use. This also ensures that those are the only resources that
are built, as opposed to rebuilding the entire project. Finally, Bazel runs everything in a sandbox, ensuring hermeticity
and reproducibility, both on engineer's machines and in CI. What you get on your box should be what everyone else gets, every time.

Bazel also has support for remote build execution and remote caching, which allows the team to parallelize the work, and for
CI to execute much more quickly and reliably.

## Required changes

### Top-level dependencies

Currently, Bazel does not have support for nested dependencies the way that Lerna or Yarn Workspaces does. We would need
to hoist those dependency declarations from the submodule package.json files and declare them in the top-level package.json
instead. Operationally, this amounts to the same since Lerna currently hoists all of the dependencies on install anyway.

Bazel plans to support this behavior at some point this year (2020), likely in Q1 or Q2, but this is not committed.

### Rules for existing resources

Bazel at its core is simply an intelligent task runner. It has build rules for dealing with TypeScript compilation and
certain types of test running, but by and large it is unaware of how to build complex targets. Luckily, implementing
these custom rules is straightforward, and we can simply wrap the existing code we already leverage. The benefit here is
that we can declare the dependencies for those scripts, and that way they only run when the dependencies change under
Bazel.

One example would be for CloudFormation to TypeScript resource definition generation. Since this is based on static
resources declared in the project, Bazel is aware when the underlying source changes and triggers the necessary rebuild
as part of the regular process of building a project file.

Another example would be for running jsii interpolation, as a build rule could be written to manage publishing to each
necessary language target.

### Removing legacy build system

The current system relies heavily on Lerna and custom bash scripts. These would be removed in favor of the Bazel build
system. Further, the team would need training on how to write custom rules and integrate them with JavaScript/TypeScript
build scripts. 

## Backwards compatibility

In order to make the migration as seamless as possible, Bazel rules can be added without affecting the existing build system.
This is because Bazel build files are very Bazel-specific and do not need to interact with or alter any existing files. The
underlying package.json files do not need to change at all in order for Bazel to be adopted, only the top-level package.json
file would need to have the needed dependencies added.

This has the benefit of maintaining the team's velocity as the rules are added and tested. It also allows the team to get 
familiarity with using Bazel while still having the legacy system to fall back on if they need it.
