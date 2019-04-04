# Contributing to the AWS Cloud Development Kit

Thanks for your interest in contributing to the AWS CDK! ❤️

This document describes how to set up a development environment and submit your contributions. Please read it carefully
and let us know if it's not up-to-date (even better, submit a PR with your  corrections ;-)).

## Pull Requests

### Step 1: Open Issue

If there isn't one already, open an issue describing what you intend to contribute. It's useful to communicate in
advance, because sometimes, someone is already working in this space, so maybe it's worth collaborating with them
instead of duplicating the efforts.

### Step 2: Work your Magic

Work your magic. Here are some guidelines:

* Every change requires a unit test
* If you change APIs, make sure to update the module's README file
* Try to maintain a single feature/bugfix per pull request. It's okay to introduce a little bit of housekeeping
   changes along the way, but try to avoid conflating multiple features. Eventually all these are going to go into a
   single commit, so you can use that to frame your scope.

### Step 3: Commit
   
Create a commit with the proposed change changes:

* Commit title and message (and PR title and description) must adhere to [conventionalcommits].
  * The title must begin with `feat(module): title`, `fix(module): title`, `refactor(module): title` or
    `chore(module): title`.
  * Title should be lowercase.
  * No period at the end of the title.
  
* Commit message should describe _motivation_. Think about your code reviewers and what information they need in
  order to understand what you did. If it's a big commit (hopefully not), try to provide some good entry points so
  it will be easier to follow.

* Commit message should indicate which issues are fixed: `fixes #<issue>` or `closes #<issue>`.

* Shout out to collaborators.

* If not obvious (i.e. from unit tests), describe how you verified that your change works.

* If this commit includes breaking changes, they must be listed at the end in the following format (notice how multiple breaking changes should be formatted):

```
BREAKING CHANGE: Description of what broke and how to achieve this behavior now
* Another breaking change
* Yet another breaking change
```

### Pull Request

* Push to a GitHub fork or to a branch (naming convention: `<user>/<feature-bug-name>`)
* Submit a Pull Requests on GitHub and assign the PR for a review to the "awslabs/aws-cdk" team.
* Discuss review comments and iterate until you get at least one “Approve”. When iterating, push new commits to the
  same branch. Usually all these are going to be squashed when you merge to master. The commit messages should be hints
  for you when you finalize your merge commit message.
* Make sure to update the PR title/description if things change. The PR title/description are going to be used as the
  commit title/message and will appear in the CHANGELOG, so maintain them all the way throughout the process.

### Merge

* Make sure your PR builds successfully (we have CodeBuild setup to automatically build all PRs)
* Once approved and tested, a maintainer will squash-merge to master and will use your PR title/description as the
  commit message.

## Design Process

In order to enable efficient collaboration over design documents, the following process should be followed:

1. Open an issue describing the requirements and constraints the design must satisfy
   + Provide a clear list of use-cases that the design intends to address
2. Open a pull request with a Markdown document describing the proposed design. The document should be placed in the
   `design` directory at the root of the repository.
   + Design discussions are tracked using the comment stream of the pull request
   + The design document will be merged in and retained as if it were code

## Style Guide

### Markdown

* Adhere to the [GitHub Flavored Markdown](https://github.github.com/gfm/) syntax
* `120` character lines
* ATX style headings (e.g: `## H2 heading`)

### Typescript and Javascript

* `2` space indentation
* `120` character lines

## Tools

The CDK is a big project, and, at the moment, all of the CDK modules are mastered in a single monolithic repository
(uses [lerna](https://github.com/lerna/lerna)). There are pros and cons to this approach, and it's especially valuable
to maintain integrity in the early stage of the project where things constantly change across the stack. In the future
we believe many of these modules will be extracted to their own repositories.

Another complexity is that the CDK is packaged using [jsii](https://github.com/awslabs/jsii) to multiple programming
languages. This means that when a full build is complete, there will be a version of each module for each supported
language.

However, in many cases, you can probably get away with just building a portion of the project, based on areas that you
want to work on.

We recommend that you use [Visual Studio Code](https://code.visualstudio.com/) to work on the CDK. Be sure to install
the [tslint extension](https://marketplace.visualstudio.com/items?itemName=eg2.tslint) for it as well, since we have
strict linting rules that will prevent your code from compiling, but with VSCode and this extension can be automatically
fixed for you by hitting `Ctrl-.` when your cursor is on a red underline.

### Main build scripts

The build process is divided into stages, so you can invoke them as needed:

- __`install.sh`__: installs all external dependencies and symlinks internal dependencies (using `lerna link`).
- __`build.sh`__: runs `npm build` and `npm test` in all modules (in topological order).
- __`pack.sh`__: packages all modules to all supported languages and produces a `dist/` directory with all the outputs
  (running this script requires that you installed the [toolchains](#Toolchains) for all target languages on your
  system).

### Partial build tools

There are also two useful scripts in the `scripts` directory that can help you build part of the repo:

- __`scripts/buildup`__: builds the current module and all of its dependencies (in topological order).
- __`scripts/builddown`__: builds the current module and all of its consumers (in topological order).

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

The `pkglint` tool "lints" package.json files across the repo according to [rules.ts](tools/pkglint/lib/rules.ts).

To evaluate (and attempt to fix) all package linting issues in the repo, run the following command from the root of the
repository (after bootstrapping):

```console
$ lerna run pkglint
```

You can also do that per package:

```console
$ lr pkglint
```

### awslint

**awslint** is a linter for the AWS Construct Library APIs. It is executed as a
part of the build of all AWS modules in the project and enforces the [AWS
Construct Library Design Guidelines](./design/aws-guidelines.md).

For more information about this tool, see the [awslint
README](./tools/awslint/README.md).

Generally speaking, if you make any changes which violate an awslint rule, build
will fail with appropriate messages. All rules are documented and explained in
the [guidelines](./design/aws-guidelines.md).

Here are a few useful commands:

 * `npm run awslint` in every module will run __awslint__ for that module.
 * `npm run awslint list` prints all rules (details and rationale in the guidelines doc)
 * `lerna run awslint` will run __awslint__ in all modules.
 * `lerna run awslint -- -i <RULE>` will run awslint throughout the repo and
   evaluate only the rule specified [awslint README](./tools/awslint/README.md)
   for details on include/exclude rule patterns.

### cfn2ts

This tool is used to generate our low-level CloudFormation resources
(L1/`CfnFoo`). It is executed as part of the build step of all modules in the
AWS Construct Library.

The tool consults the `cdk-build.cloudformation` key in `package.json` to
determine which CloudFormation namespace this library represents (e.g.
`AWS::EC2` is the namespace for `aws-ec2`). We maintain strict 1:1 relationship
between those.

Each module also has an npm script called `cfn2ts`:

* `npm run cfn2ts`: generates L1 for a specific module
* `lerna run cfn2ts`: generates L1 for the entire repo

### scripts/foreach.sh

This wonderful tool allows you to execute a command for all modules in this repo
in topological order, but has the incredible property of being stateful. this
means that if a command fails, you can fix the issue and resume from where you
left off.

To start a session, run:

```console
$ scripts/foreach.sh COMMAND
```

This will execute "COMMAND" for each module in the repo (cwd will be the directory of the module).
if a task fails, it will stop, and then to resume, simply run `foreach.sh` again (with or without the same command).

To reset the session (either when all tasks finished or if you wish to run a different session), run:

```console
$ rm -f ~/.foreach.*
```

This will effectively delete the state files.

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

If you also wish to package to all languages, make sure you have all the [toolchains](#Toolchains) and now run:

```
$ ./pack.sh
```

### Full Docker build

Clone the repo:

```console
$ git clone git@github.com/awslabs/aws-cdk
$ cd aws-cdk
```

If you already have a local repo and you want a fresh build, run `git clean -fdx` from the root.

Build the docker image:

```console
$ docker build -t aws-cdk .
```

This allows you to run the CDK in a CDK-compatible directory with a command like:

```console
$ docker run -v $(pwd):/app -w /app aws-cdk <CDK ARGS>
```

### Partial build

In many cases, you don't really need to build the entire project. Say you want to work on the `@aws-cdk/aws-ec2` module:

```console
$ ./install.sh
$ cd packages/@aws-cdk/aws-ec2
$ ../../../scripts/buildup
```

### Quick Iteration

After you've built the modules you want to work on once, use `lr watch` for each module that you are modifying.

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

### Running integration tests in parallel

Integration tests may take a long time to complete. We can speed this up by running them in parallel
in different regions.

```shell
# Install GNU parallel (may require uninstall 'moreutils' if you have it)
$ apt-get install parallel
$ brew install parallel

$ scripts/run-integ-parallel @aws-cdk/aws-ec2 @aws-cdk/aws-autoscaling ...
```

### Visualizing dependencies in a CloudFormation Template

Use GraphViz with `template-deps-to-dot`:

```shell
$ cdk -a some.app.js synth | $awscdk/scripts/template-deps-to-dot | dot -Tpng > deps.png
```

### Build Documentation Only

The CDK documentation source is hosted under [`./docs/src`](./docs/src). Module reference documentation is gathered
after build from the `dist/sphinx` directory (generated by jsii from source via the `./pack.sh` script).

To build the docs even if reference docs are not present:


```shell
$ cd docs
$ BUILD_DOCS_DEV=1 ./build-docs.sh
```

### Tooling Assists
#### Jetbrains (WebStorm/IntelliJ)
This project uses lerna and utilizes symlinks inside nested node_modules directories. You may encounter an issue during
indexing where the IDE attempts to index these directories and keeps following links until the process runs out of
available memory and crashes. To fix this, you can run ```node ./scripts/jetbrains-remove-node-modules.js``` to exclude
these directories.

## Dependencies

### Adding Dependencies

The root [package.json](./package.json) includes global devDependencies (see
[lerna docs](https://github.com/lerna/lerna#common-devdependencies)) on the topic.

 * To add a global dependency, run `npm i --save-dev <dep>` at  the root.
 * To add a dependency for a specific module, run `npm i <dep>` inside the module's directory.

Guidelines:

 * We cannot accept dependencies that use non-permissive open source licenses (Apache, MIT, etc).
 * Make sure dependencies are defined using [caret
   ranges](https://docs.npmjs.com/misc/semver#caret-ranges-123-025-004) (e.g. `^1.2.3`). This enables non-breaking
   updates to automatically be picked up.
 * Make sure `package-lock.json` files are included in your commit.

### Finding dependency cycles between packages

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

To update all dependencies (without bumping major versions):

1. Obtain a fresh clone from "master".
2. Run `./install.sh`
2. Run `./scripts/update-dependencies.sh --mode full` (use `--mode semver` to avoid bumping major versions)
3. Submit a Pull Request.

### Troubleshooting common issues

Most build issues can be solved by doing a full clean rebuild:

```shell
$ git clean -fqdx .
$ ./build.sh
```

However, this will be time consuming. In this section we'll describe some common issues you may encounter and some more
targeted commands you can run to resolve your issue.

* The compiler is throwing errors on files that I renamed/it's running old tests that I meant to remove/code coverage is
  low and I didn't change anything.

If you switch to a branch in which `.ts` files got renamed or deleted, the generated `.js` and `.d.ts` files from the
previous compilation run are still around and may in some cases still be picked up by the compiler or test runners.

Run the following to clear out stale build artifacts:

```shell
$ scripts/clean-stale-files.sh
```

* I added a dependency but it's not being picked up by the build

You need to tell Lerna to update all dependencies:

```shell
$ node_modules/.bin/lerna bootstrap
```

* I added a dependency but it's not being picked up by a `watch` background compilation run.

No it's not. After re-bootstrapping you need to restart the watch command.

* I added a dependency but it's not being picked up by Visual Studio Code (I still get red underlines).

The TypeScript compiler that's running has cached your dependency tree. After re-bootstrapping,
restart the TypeScript compiler.

Hit F1, type `> TypeScript: Restart TS Server`.

* I'm doing refactorings between packages and compile times are killing me/I need to switch between
  differently-verionsed branches a lot and rebuilds because of version errors are taking too long.

Our build steps for each package do a couple of things, such as generating code and generating JSII assemblies. If
you've done a full build at least once to generate all source files, you can do a quicker TypeScript-only rebuild of the
entire source tree by doing the following:

```shell
# Only works after at least one full build to generate source files
$ scripts/build-typescript.sh

# Also works to start a project-wide watch compile
$ scripts/build-typescript.sh -w
```

This does not do code generation and it does not do JSII checks and JSII assembly generation. Instead of doing a
package-by-package ordered build, it compiles all `.ts` files in the repository all at once. This takes about the same
time as it does to compile the biggest package all by itself, and on my machine is the difference between a 15
CPU-minute build and a 20 CPU-second build. If you use this methods of recompiling and you want to run the test, you
have to disable the built-in rebuild functionality of `lerna run test`:

```shell
$ CDK_TEST_BUILD=false lr test
```

## Toolchains

If you wish to use `pack.sh` to package the project to all supported languages, you will need the following toolchains
installed:

 - [Node.js 8.11.0](https://nodejs.org/download/release/v8.11.0/)
 - [Java OpenJDK 8](http://openjdk.java.net/install/)
 - [.NET Core 2.0](https://www.microsoft.com/net/download)
 - [Python 3.6.5](https://www.python.org/downloads/release/python-365/)
 - [Ruby 2.5.1](https://www.ruby-lang.org/en/news/2018/03/28/ruby-2-5-1-released/)

## Linking against this repository

The script `./link-all.sh` can be used to generate symlinks to all modules in this repository under some `node_module`
directory. This can be used to develop against this repo as a local dependency.

One can use the `postinstall` script to symlink this repo:

```json
{
  "scripts": {
    "postinstall": "../aws-cdk/link-all.sh"
  }
}
```

This assumes this repo is a sibling of the target repo and will install the CDK as a linked dependency during
__npm install__.

## Adding Language Support

The CDK uses [jsii](https://github.com/awslabs/jsii) to generate language bindings for CDK classes, which proxy
interaction to a node.js child process in runtime.

To vend another language for the CDK (given there's jsii support for it):

1. Create a directory `packages/aws-cdk-xxx` (where "xxx" is the language).
2. Look at [`aws-cdk-java/package.json`](packages/aws-cdk-java/package.json) as a reference on how to setup npm build
   that uses pacmak to generate the code for all CDK modules and then compile and wrap the package up.
3. Edit [bundle-beta.sh](./bundle-beta.sh) and add CDK and jsii artifacts for your language under `repo/xxx`
4. Add a **cdk init** template for your language (see
   [packages/aws-cdk/lib/init-templates](packages/aws-cdk/lib/init-templates)).
5. Edit [getting-started.rst](packages/aws-cdk-docs/src/getting-started.rst) and make there there's a getting started
   sections and examples for the new language.


[conventionalcommits]: https://www.conventionalcommits.org
