# AWS Cloud Development Kit (AWS CDK)

The **AWS Cloud Development Kit (AWS CDK)** is a software development framework
for defining cloud infrastructure in code.

# Development Environment

This is a monorepo which uses [lerna](https://github.com/lerna/lerna).

The CDK depends on [jsii](https://github.com/awslabs/jsii), which is still not
published to npm. Therefore, the jsii tarballs are checked-in to this repository
under `./local-npm` and the install script will install them in the repo-global
node_modules directory.

## Prerequisites

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
./install.sh and ./build.sh as described below.

## Bootstrapping

1. Clone this repository (or run `git clean -fdx` to clean up all build artifacts).
2. Run `./install.sh` - this will install all repo-level dependencies, including
   `lerna` and the unpublished modules from local-npm.
3. Run `./build.sh` - this will invoke `lerna bootstrap` and `lerna run test`.
   All external dependencies will be installed and internal deps will be
   cross-linked.

## Development Iteration

After you've bootstrapped the repo, you would probably want to work on individual packages.

All packages in the repo have a two useful scripts: `prepare` and `watch`. In order to execute
these scripts, use `lerna run --stream --scope <package> <script>`.

> The reason you can't use "npm" is because dev tools are installed at the repository level
> and they are needed in the PATH when executing most of the package scripts.

A useful shell alias would use the directory name as a scope:

```bash
# add to your ~/.zshrc or ~/.bashrc
alias lr='lerna run --stream --scope $(basename $PWD)'

# more sugar
alias lw='lr watch &'
alias lp='lr prepare'
```

Then, you could just go into any of the package directories and use "lr" to run scripts. For example:

```bash
cd packages/aws-cdk-s3
lr watch
```

## Linking against this repository

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

## Commits and Pull Requests

Commits should follow the
[conventional-changelog-standard](https://github.com/bcoe/conventional-changelog-standard/blob/master/convention.md)
to allow automatic changelog generation.

## Package Linter

The `pkglint` tool normalizes all packages in the repo. It verifies package.json
is normalized and adheres to the set of rules. To evaluate (and potentially fix)
all package linting issues in the repo, run the following command from the root
of the repository (after boostrapping):

```bash
npm run pkglint
```

## Updating jsii

Run `./pack.sh` in the jsii repository and copy the tarballs to `./local-npm`.
Make sure all tarballs are defined in the root `package.json`.

# Language Support

The CDK uses [jsii](https://github.com/awslabs/jsii) to generate language
bindings for CDK classes, which proxy interaction to a node.js child process in
runtime.

To vend another language for the CDK (given there's jsii support for it):

1. Create a directory `packages/aws-cdk-xxx` (where "xxx" is the language).
2. Look at [aws-cdk-java/package.json](packages/aws-cdk-java/package.json) as a reference
   on how to setup npm build that uses pacmak to generate the code for all CDK modules and
   then compile and wrap the package up.
3. Edit [bundle-beta.sh](./bundle-beta.sh) and add CDK and jsii artifacts for
   your language under `repo/xxx`
4. Add a **cdk init** template for your language (see
   [packages/aws-cdk-toolkit/lib/init-templates](packages/aws-cdk-toolkit/lib/init-templates)).
5. Edit [getting-started.rst](packages/aws-cdk-docs/src/getting-started.rst) and
   make there there's a getting started sections and examples for the new
   language.
