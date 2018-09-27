# Contributing to the AWS Cloud Development Kit

This document describes how to set up a development environment and submit
contributions to this project.

## Development Workflow

1. Setup a [Development Environment](#development-environment)
1. Work your magic. Here are some guidelines:
    * Every change requires a unit test
    * Make sure you update [CHANGELOG] under “[Unreleased]” if the feature/bug is
      worthy of a mention
    * Make sure to indicate both in the [CHANGELOG] and in the commit message if
      the change is BREAKING. A good indication that a change is breaking is if
      you had to change old tests to “work” after this change.
    * Try to maintain a single feature/bugfix per pull request. It's okay to
      introduce a little bit of housekeeping changes along the way, but try to
      avoid conflating multiple features. Eventually all these are going to go
      into a single commit, so you can use that to frame your scope.
2. Push to a fork or to a branch (naming convention: `<user>/<feature-bug-name>`)
3. Submit a Pull Requests on GitHub. When authoring your pull request
   description:
    * Think about your code reviewers and what information they need in order to
      have fun with your changes. If it's a big commit (hopefully not), try to
      provide some good entry points so it will be easier to follow.
    * Ideally, associate with an issue (`fixes #<issue>`), which describes more
      details about motivation and the design process.
    * Shout out to collaborators.
    * If not obvious (i.e. from unit tests), describe how you verified that your
      change works.
4. Assign the PR for a review to the "awslabs/aws-cdk" team.
5. Discuss review comments and iterate until you get at least one “Approve”. When
   iterating, push new commits to the same branch. Usually all these are going
   to be squashed when you merge to master. The commit messages should be hints
   for you when you finalize your merge commit message.
6. Make sure your PR builds successfully (we have CodeBuild setup to
   automatically build all PRs)
7. Once approved and tested, squash-merge to master __via GitHub__. This is your
   opportunity to author a beautiful commit message which describes __the
   motivation__ and __design considerations__ of your change. Here are some
   [tips](https://chris.beams.io/posts/git-commit/#separate) from Chris Beams.

## Development Environment

This is a monorepo which uses [lerna](https://github.com/lerna/lerna).

The CDK depends on [jsii](https://github.com/awslabs/jsii), which is still not
published to npm. Therefore, the jsii tarballs are checked-in to this repository
under `./local-npm` and the install script will install them in the repo-global
`node_modules` directory.

### Prerequisites

Since this repo produces artifacts for multiple programming languages using
__jsii__, it relies on the following toolchains:

 - [Node.js 8.11.0](https://nodejs.org/download/release/v8.11.0/)
 - [Java OpenJDK 8](http://openjdk.java.net/install/)
 - [.NET Core 2.0](https://www.microsoft.com/net/download)
 - [Python 3.6.5](https://www.python.org/downloads/release/python-365/)
 - [Ruby 2.5.1](https://www.ruby-lang.org/en/news/2018/03/28/ruby-2-5-1-released/)

When building on CodeBuild, these toolchains are all included in the
[superchain](https://github.com/awslabs/superchain) docker image. This image can
also be used locally as follows:

```shell
eval $(aws ecr get-login --no-include-email)
IMAGE=260708760616.dkr.ecr.us-east-1.amazonaws.com/superchain:latest
docker pull ${IMAGE}
docker run --net=host -it -v $PWD:$PWD -w $PWD ${IMAGE}
```

This will get you into an interactive docker shell. You can then run
`./install.sh` and `./build.sh` as described below.

Also install the [git-secrets](https://github.com/awslabs/git-secrets) tool
and activate it on your working copy of the `aws-cdk` repository.

### Bootstrapping

1. Clone this repository (or run `git clean -fdx` to clean up all build artifacts).
2. Run `./install.sh` - this will install all repo-level dependencies, including
   `lerna` and the unpublished modules from local-npm.
3. Run `./build.sh` - this will invoke `lerna bootstrap` and `lerna run test`.
   All external dependencies will be installed and internal deps will be
   cross-linked.

### buildup/builddown

If you only want to work on a subset of the repo, you can use `scripts/buildup` and
`scripts/builddown` to build a package and all it's dependencies (up) or 
dependents (down).

Make sure to run `./install.sh` from the root to make sure all modules are installed.

It is useful to add the `./scripts` directory to your PATH.

Then, change the working directory to any package in the repo and run:

    buildup # will also build all dependencies

Or:

    builddown # will also build all consumers

### Development Iteration

After you've bootstrapped the repo, you would probably want to work on individual packages.

All packages in the repo have a two useful scripts: `prepare` and `watch`. In order to execute
these scripts, use `lerna run --stream --scope <package> <script>`.

> The reason you can't use "npm" is because dev tools are installed at the repository level
> and they are needed in the PATH when executing most of the package scripts.

A useful shell alias would use the directory name as a scope:

```bash
# add to your ~/.zshrc or ~/.bashrc
alias lr='lerna run --stream --scope $(node -p "require(\"./package.json\").name")'

# more sugar
alias lw='lr watch &'
alias lp='lr prepare'
```

Then, you could just go into any of the package directories and use "lr" to run scripts. For example:

```bash
cd packages/aws-cdk-s3
lr watch
```

### Linking against this repository

The script `./link-all.sh` can be used to generate symlinks to all modules in
this repository under some `node_module` directory. This can be used to develop
against this repo as a local dependency.

One can use the `postinstall` script to symlink this repo:

```json
{
  "scripts": {
    "postinstall": "../aws-cdk/link-all.sh"
  }
}
```

This assumes this repo is a sibling of the target repo and will install the CDK
as a linked dependency during __npm install__.


### Package Linter

The `pkglint` tool normalizes all packages in the repo. It verifies package.json
is normalized and adheres to the set of rules. To evaluate (and potentially fix)
all package linting issues in the repo, run the following command from the root
of the repository (after boostrapping):

```bash
npm run pkglint
```

## jsii

The CDK uses [jsii](https://github.com/awslabs/jsii) to vend the framework to
multiple programming languages. Since jsii is still not published to npm, we
consume it as a bundled dependency.

### Updating to a new version

Download an official jsii zip bundle and replace the file under `./vendor`.
Any added dependencies, they will need to be added to the root `package.json`.

### Linking against a local jsii repository

If you are making changes locally to jsii itself and wish to bind this repository to
a local jsii repository, the best way we currently have is to use `npm link` to link
various jsii modules from the other repository into the root of this repository.

For example, if you wish to link against the `jsii` module:

1. Go to `jsii/packages/jsii`
2. Run `npm link .`
3. Go to `aws-cdk/`
4. Run `npm link jsii`.

## Adding Language Support

The CDK uses [jsii](https://github.com/awslabs/jsii) to generate language
bindings for CDK classes, which proxy interaction to a node.js child process in
runtime.

To vend another language for the CDK (given there's jsii support for it):

1. Create a directory `packages/aws-cdk-xxx` (where "xxx" is the language).
2. Look at [`aws-cdk-java/package.json`](packages/aws-cdk-java/package.json) as a reference
   on how to setup npm build that uses pacmak to generate the code for all CDK modules and
   then compile and wrap the package up.
3. Edit [bundle-beta.sh](./bundle-beta.sh) and add CDK and jsii artifacts for
   your language under `repo/xxx`
4. Add a **cdk init** template for your language (see
   [packages/aws-cdk/lib/init-templates](packages/aws-cdk/lib/init-templates)).
5. Edit [getting-started.rst](packages/aws-cdk-docs/src/getting-started.rst) and
   make there there's a getting started sections and examples for the new
   language.

## Dependencies

### Adding Dependencies

The root [package.json](./package.json) includes global devDependencies (see
[lerna docs](https://github.com/lerna/lerna#common-devdependencies)) on the
topic.

 * To add a global dependency, run `npm i --save-dev <dep>` at  the root.
 * To add a dependency for a specific module, run `npm i <dep>` inside the
   module's directory.

Guidelines:

 * We cannot accept dependencies that use non-permissive open source licenses (Apache, MIT, etc).
 * Make sure dependencies are defined using [caret
   ranges](https://docs.npmjs.com/misc/semver#caret-ranges-123-025-004) (e.g.
   `^1.2.3`). This enables non-breaking updates to automatically be picked up.
 * Make sure `package-lock.json` files are included in your commit.

### Finding Dependency Cycles

You can use `find-cycles` to print a list of internal dependency cycles:

```shell
$ scripts/find-cycles.sh
Cycle: @aws-cdk/aws-iam => @aws-cdk/assert => aws-cdk => @aws-cdk/aws-s3 => @aws-cdk/aws-kms => @aws-cdk/aws-iam
Cycle: @aws-cdk/assert => aws-cdk => @aws-cdk/aws-s3 => @aws-cdk/aws-kms => @aws-cdk/assert
Cycle: @aws-cdk/aws-iam => @aws-cdk/assert => aws-cdk => @aws-cdk/aws-s3 => @aws-cdk/aws-iam
Cycle: @aws-cdk/assert => aws-cdk => @aws-cdk/aws-s3 => @aws-cdk/assert
Cycle: @aws-cdk/assert => aws-cdk => @aws-cdk/aws-cloudformation => @aws-cdk/assert
Cycle: @aws-cdk/aws-iam => @aws-cdk/assert => aws-cdk => @aws-cdk/util => @aws-cdk/aws-iam
Cycle: @aws-cdk/aws-sns => @aws-cdk/aws-lambda => @aws-cdk/aws-codecommit => @aws-cdk/aws-sns
Cycle: @aws-cdk/aws-sns => @aws-cdk/aws-lambda => @aws-cdk/aws-codecommit => @aws-cdk/aws-codepipeline => @aws-cdk/aws-sns
```

### Updating all Dependencies

We use `npm update` to

1. Obtain a fresh clone from “master”
2. Run `./install.sh` and `./build.sh` to make sure the current HEAD is not broken
(should never be...).
3. Once build succeeded, run:
    ```shell
    $ npm update # to update the root deps
    $ lerna exec npm update # to update deps in all modules
    ```
4. This will probably install some new versions and update `package.json` and
`package-lock.json` files.
5. Now, run `./build.sh` again to verify all tests pass.
6. Submit a Pull Request.

## Documentation

The CDK documentation source is hosted under [`./docs/src`](./docs/src). 
Module reference documentation is gathered after build from the `dist/sphinx` directory (generated by jsii from source via the `./pack.sh` script).

To build the docs even if reference docs are not present:


```shell
$ cd docs
$ BUILD_DOCS_DEV=1 ./build-docs.sh
```

