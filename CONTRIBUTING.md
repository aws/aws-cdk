# Contributing to the AWS Cloud Development Kit

Thanks for your interest in contibuting to the AWS CDK! ❤️

This document describes how to set up a development environment and submit
your contributions. Please read it carefully and let us know if it's not up-to-date (even better, submit a PR with your corrections ;-)).

## Pull Requests

1. If there isn't one already, open an issue describing what you intend to contribute. It's usful to communicate
   in advance, because sometimes, someone is already working in this space, so maybe it's worth
   collaborating with them instead of duplicating the efforts.
1. Work your magic. Here are some guidelines:
    * Every change requires a unit test
    * If you change APIs, make sure to update the module's README file
    * Try to maintain a single feature/bugfix per pull request. It's okay to
      introduce a little bit of housekeeping changes along the way, but try to
      avoid conflating multiple features. Eventually all these are going to go
      into a single commit, so you can use that to frame your scope.
1. Create a commit with the proposed change changes:
    * Commit title and message (and PR title and description) must adhere to [conventionalcommits].
    * The title must begin with `feat(module): title`, `fix(module): title`, 
      `reactor(module): title` or `chore(module): title`.
    * Title should be lowercase.
    * No period at the end of the title.
    * Commit message should describe _motivation_. Think about your code reviewers and what 
      information they need in order to understand what you did. If it's a big commit (hopefully not), 
      try to provide some good entry points so it will be easier to follow.
    * Commit message should indicate which issues are fixed: `fixes #<issue>` or `closes #<issue>`.
    * Shout out to collaborators.
    * If not obvious (i.e. from unit tests), describe how you verified that your
      change works.
    * If this commit includes a breaking change, the commit message must end with a
      a single pragraph 
      `BREAKING CHANGE: description of what broke and how to achieve this beahvior now`.
2. Push to a fork or to a branch (naming convention: `<user>/<feature-bug-name>`)
3. Submit a Pull Requests on GitHub and assign the PR for a review to the "awslabs/aws-cdk" team.
5. Discuss review comments and iterate until you get at least one “Approve”. When
   iterating, push new commits to the same branch. Usually all these are going
   to be squashed when you merge to master. The commit messages should be hints
   for you when you finalize your merge commit message.
7. Make sure to update the PR title/description if things change. The PR title/description are going
   to be used as the commit title/message and will appear in the CHANGELOG, so maintain them all
   the way throughout the process.
6. Make sure your PR builds successfully (we have CodeBuild setup to
   automatically build all PRs)
7. Once approved and tested, a maintainer will squash-merge to master and will use your PR
   title/description as the commit message.

## Tools

The CDK is a big project, and, at the moment, all of the CDK modules are mastered in a single monolithic
repository (uses [lerna](https://github.com/lerna/lerna)). There are pros and cons to this approach, 
and it's especially valuable to maintain integrity in the early stage of thr project where things constantly change across the stack. In the future we believe many of these modules will be extracted to their own repositories.

Another complexity is that the CDK is packaged using [jsii](https://github.com/awslabs/jsii) to multiple
programming languages. This means that when a full build is complete, there will be a version of each
module for each supported language.

However, in many cases, you can probably get away with just building a portion of the
project, based on areas that you want to work on. 

### Main build scripts

The build process is divided into stages, so you can invoke them as needed:

- __`install.sh`__: installs all external dependencies and symlinks internal dependencies (using `lerna link`).
- __`build.sh`__: runs `npm build` and `npm test` in all modules (in topological order).
- __`pack.sh`__: packages all modules to all supported languages and produces a `dist/` directory 
  with all the outputs (running this script requires that you installed the [toolchains](#Toolchains) 
  for all target languages on your system).

### Partial build tools

There are also two useful scripts in the `scripts` directory that can help you build part of the repo:

- __`scripts/buildup`__: builds the current module and all of it's dependencies (in topological order).
- __`scripts/builddown`__: builds the current module and all of it's consumers (in topological order).

### Useful aliases

You can also add a few useful aliases to your shell profile:

```bash
# runs an npm script via lerna for a the current module
alias lr='lerna run --stream --scope $(node -p "require(\"./package.json\").name")'

# runs "npm run build" (build + test) for the current module
alias lb='lr build'
alias lt='lr test'

# runs "npm run watch" for the current module (recommended to run in a separate terminal session):
alias lw='lr watch'
```

### pkglint

The `pkglint` tool "lints" package.json files across the repo according 
to [rules.ts](tools/pkglint/lib/rules.ts).

To evaluate (and attempt to fix) all package linting issues in the repo, run the following command from the root
of the repository (after boostrapping):

```console
$ lerna run pkglint
```

You can also do that per package:

```console
$ lr pkglint
```

## Development Workflows

### Full clean build

Clone the repo:

```console
$ git clone git@github.com/awslabs/aws-cdk
$ cd aws-cdk
```

If you already have a local repo and you want a fresh build, run `git clean -fdx` from the root.

Install and build:

```console
$ ./install.sh
$ ./build.sh
```

If you also wish to package to all languages, make sure you have all the [toolchains](#Toolchains] 
and now run:

```
$ ./pack.sh
```

### Partial build

In many cases, you don't really need to build the entire project. Say you want to work 
on the `@aws-cdk/aws-ec2` module:

```console
$ ./install.sh
$ cd packages/@aws-cdk/aws-ec2
$ ../../../scripts/buildup
```

### Quick Iteration

After you've built the modules you want to work on once, use `lr watch` for each module that
you are modifying.

Watch the EC2 and IAM modules in a second terminal session:

```console
$ cd packages/@aws-cdk/aws-ec2
$ lr watch & # runs in the background
$ cd packages/@aws-cdk/aws-iam
$ lr watch & # runs in the background
```

Code...

Now to test, you can either use `lr test` or invoke nodeunit directory (faster, since "test" will also build):

```console
$ cd packages/@aws-cdk/aws-iam
$ nodeunit test/test.*.js
<BOOM>
```

### Build Documentation Only

The CDK documentation source is hosted under [`./docs/src`](./docs/src). 
Module reference documentation is gathered after build from the `dist/sphinx` directory (generated by jsii from source via the `./pack.sh` script).

To build the docs even if reference docs are not present:


```shell
$ cd docs
$ BUILD_DOCS_DEV=1 ./build-docs.sh
```

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

## Toolchains

If you wish to use `pack.sh` to package the project to all supported languages, you will need the
following toolchains installed:

 - [Node.js 8.11.0](https://nodejs.org/download/release/v8.11.0/)
 - [Java OpenJDK 8](http://openjdk.java.net/install/)
 - [.NET Core 2.0](https://www.microsoft.com/net/download)
 - [Python 3.6.5](https://www.python.org/downloads/release/python-365/)
 - [Ruby 2.5.1](https://www.ruby-lang.org/en/news/2018/03/28/ruby-2-5-1-released/)

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


[conventionalcommits]: https://www.conventionalcommits.org
