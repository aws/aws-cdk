# Contributing to the AWS Cloud Development Kit

Thanks for your interest in contributing to the AWS CDK! ❤️

This document describes how to set up a development environment and submit your contributions. Please read it carefully
and let us know if it's not up-to-date (even better, submit a PR with your  corrections ;-)).

- [Getting Started](#getting-started)
- [Pull Requests](#pull-requests)
  - [Pull Request Checklist](#pull-request-checklist)
  - [Step 1: Open Issue](#step-1-open-issue)
  - [Step 2: Design (optional)](#step-2-design-optional)
  - [Step 3: Work your Magic](#step-3-work-your-magic)
  - [Step 4: Commit](#step-4-commit)
  - [Step 5: Pull Request](#step-5-pull-request)
  - [Step 6: Merge](#step-6-merge)
- [Tools](#tools)
  - [Main build scripts](#main-build-scripts)
  - [Partial build tools](#partial-build-tools)
  - [Useful aliases](#useful-aliases)
  - [pkglint](#pkglint)
  - [awslint](#awslint)
  - [cfn2ts](#cfn2ts)
  - [scripts/foreach.sh](#scriptsforeachsh)
  - [Jetbrains support (WebStorm/IntelliJ)](#jetbrains-support-webstormintellij)
- [Workflows](#workflows)
  - [Full clean build](#full-clean-build)
  - [Full Docker build](#full-docker-build)
  - [Partial build](#partial-build)
  - [Quick Iteration](#quick-iteration)
  - [Linking against this repository](#linking-against-this-repository)
  - [Running integration tests in parallel](#running-integration-tests-in-parallel)
  - [Visualizing dependencies in a CloudFormation Template](#visualizing-dependencies-in-a-cloudformation-template)
  - [Adding Dependencies](#adding-dependencies)
  - [Finding dependency cycles between packages](#finding-dependency-cycles-between-packages)
  - [Updating all Dependencies](#updating-all-dependencies)
  - [Running CLI integration tests](#running-cli-integration-tests)
  - [API Compatibility Checks](#api-compatibility-checks)
  - [Feature Flags](#feature-flags)
- [Troubleshooting](#troubleshooting)
- [Debugging](#debugging)
  - [Connecting the VS Code Debugger](#connecting-the-vs-code-debugger)
- [Related Repositories](#related-repositories)

## Getting Started

For day-to-day development and normal contributions, [Node.js ≥ 10.3.0](https://nodejs.org/download/release/latest-v10.x/)
with [Yarn >= 1.19.1](https://yarnpkg.com/lang/en/docs/install) should be sufficient.

```console
$ git clone https://github.com/aws/aws-cdk.git
$ cd aws-cdk
$ yarn build
```

If you wish to produce language bindings through `pack.sh`, you will need the following toolchains
installed, or use the Docker workflow.

 - [Node.js 10.3.0](https://nodejs.org/download/release/latest-v10.x/)
 - [Java OpenJDK 8](http://openjdk.java.net/install/)
 - [.NET Core 2.0](https://www.microsoft.com/net/download)
 - [Python 3.6.5](https://www.python.org/downloads/release/python-365/)
 - [Ruby 2.5.1](https://www.ruby-lang.org/en/news/2018/03/28/ruby-2-5-1-released/)

## Pull Requests

### Pull Request Checklist

* [ ] Testing
  - Unit test added (prefer not to modify an existing test, otherwise, it's probably a breaking change)
  - __CLI change?:__ coordinate update of integration tests with team
  - __cdk-init template change?:__ coordinated update of integration tests with team
* [ ] Docs
  - __jsdocs__: All public APIs documented
  - __README__: README and/or documentation topic updated
  - __Design__: For significant features, design document added to `design` folder
* [ ] Title and Description
  - __Change type__: title prefixed with **fix**, **feat** and module name in parens, which will appear in changelog
  - __Title__: use lower-case and doesn't end with a period
  - __Breaking?__: last paragraph: "BREAKING CHANGE: <describe what changed + link for details>"
  - __Issues__: Indicate issues fixed via: "**Fixes #xxx**" or "**Closes #xxx**"
* [ ] Sensitive Modules (requires 2 PR approvers)
  - IAM Policy Document (in @aws-cdk/aws-iam)
  - EC2 Security Groups and ACLs (in @aws-cdk/aws-ec2)
  - Grant APIs (only if not based on official documentation with a reference)

---

### Step 1: Open Issue

If there isn't one already, open an issue describing what you intend to contribute. It's useful to communicate in
advance, because sometimes, someone is already working in this space, so maybe it's worth collaborating with them
instead of duplicating the efforts.

### Step 2: Design (optional)

In some cases, it is useful to seek for feedback by iterating on a design document. This is useful
when you plan a big change or feature, or you want advice on what would be the best path forward.

Sometimes, the GitHub issue is sufficient for such discussions, and can be sufficient to get
clarity on what you plan to do. Sometimes, a design document would work better, so people can provide
iterative feedback.

In such cases, use the GitHub issue description to collect **requirements** and
**use cases** for your feature.

Then, create a design document in markdown format under the `design/` directory
and request feedback through a pull request. Prefix the PR title with "**RFC:**"
(request for comments).

Once the design is finalized, you can re-purpose this PR for the implementation,
or open a new PR to that end.

### Step 3: Work your Magic

Work your magic. Here are some guidelines:

* Coding style (abbreviated):
  * In general, follow the style of the code around you
  * 2 space indentation
  * 120 characters wide
  * ATX style headings in markdown (e.g. `## H2 heading`)
* Every change requires a unit test
* If you change APIs, make sure to update the module's README file
* Try to maintain a single feature/bugfix per pull request. It's okay to introduce a little bit of housekeeping
   changes along the way, but try to avoid conflating multiple features. Eventually all these are going to go into a
   single commit, so you can use that to frame your scope.

### Step 4: Commit

Create a commit with the proposed change changes:

* Commit title and message (and PR title and description) must adhere to [conventionalcommits](https://www.conventionalcommits.org).
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
* **module-name:** Another breaking change
* **module-name:** Yet another breaking change
```

### Step 5: Pull Request

* Push to a GitHub fork or to a branch (naming convention: `<user>/<feature-bug-name>`)
* Submit a Pull Requests on GitHub and assign the PR for a review to the "awslabs/aws-cdk" team.
* Please follow the PR checklist written below. We trust our contributors to self-check, and this helps that process!
* Discuss review comments and iterate until you get at least one “Approve”. When iterating, push new commits to the
  same branch. Usually all these are going to be squashed when you merge to master. The commit messages should be hints
  for you when you finalize your merge commit message.
* Make sure to update the PR title/description if things change. The PR title/description are going to be used as the
  commit title/message and will appear in the CHANGELOG, so maintain them all the way throughout the process.



### Step 6: Merge

* Make sure your PR builds successfully (we have CodeBuild setup to automatically build all PRs)
* Once approved and tested, a maintainer will squash-merge to master and will use your PR title/description as the
  commit message.

## Tools

The CDK is a big project, and, at the moment, all of the CDK modules are mastered in a single monolithic repository
(uses [lerna](https://github.com/lerna/lerna)). There are pros and cons to this approach, and it's especially valuable
to maintain integrity in the early stage of the project where things constantly change across the stack. In the future
we believe many of these modules will be extracted to their own repositories.

Another complexity is that the CDK is packaged using [jsii](https://github.com/aws/jsii) to multiple programming
languages. This means that when a full build is complete, there will be a version of each module for each supported
language.

However, in many cases, you can probably get away with just building a portion of the project, based on areas that you
want to work on.

We recommend that you use [Visual Studio Code](https://code.visualstudio.com/) to work on the CDK. Be sure to install
the [tslint extension](https://marketplace.visualstudio.com/items?itemName=eg2.tslint) for it as well, since we have
strict linting rules that will prevent your code from compiling, but with VSCode and this extension can be automatically
fixed for you by hitting `Ctrl-.` when your cursor is on a red underline.

### Main build scripts

The build process is divided into stages, so you can invoke them as needed from the root of the repo:

- __`yarn build`__: runs the `build` and `test` commands in all modules (in topological order).
- __`yarn pack`__: packages all modules to all supported languages and produces a `dist/` directory with all the outputs
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

# runs "yarn build" (build + test) for the current module
alias lb='lr build'
alias lt='lr test'

# runs "yarn watch" for the current module (recommended to run in a separate terminal session):
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

 * `yarn awslint` in every module will run __awslint__ for that module.
 * `yarn awslint list` prints all rules (details and rationale in the guidelines doc)
 * `scripts/foreach.sh yarn awslint` will start linting the entire repo, progressively. Rerun `scripts/foreach.sh` after fixing to continue.
 * `lerna run awslint --no-bail --stream 2> awslint.txt` will run __awslint__ in all modules and collect all results into awslint.txt
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

* `yarn cfn2ts`: generates L1 for a specific module
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

### Jetbrains support (WebStorm/IntelliJ)

This project uses lerna and utilizes symlinks inside nested node_modules directories. You may encounter an issue during
indexing where the IDE attempts to index these directories and keeps following links until the process runs out of
available memory and crashes. To fix this, you can run ```node ./scripts/jetbrains-remove-node-modules.js``` to exclude
these directories.

## Workflows

This section includes step-by-step descriptions of common workflows.

### Full clean build

Clone the repo:

```console
$ git clone https://github.com/aws/aws-cdk.git
$ cd aws-cdk
```

If you already have a local repo and you want a fresh build, run `git clean -fdx` from the root.

Install and build:

```console
$ ./install.sh
$ yarn build
```

If you also wish to package to all languages, make sure you have all the [toolchains](#Toolchains) and now run:

```
$ ./pack.sh
```

### Full Docker build

Clone the repo:

```console
$ git clone https://github.com/aws/aws-cdk.git
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

### Linking against this repository

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
__yarn install__.

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

### Adding Dependencies

The root [package.json](./package.json) includes global devDependencies (see
[lerna docs](https://github.com/lerna/lerna#common-devdependencies)) on the topic.

 * To add a global dependency, run `yarn add <dep> --dev` at  the root.
 * To add a dependency for a specific module, run `yarn add <dep>` inside the module's directory.

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
3. Run `./scripts/update-dependencies.sh --mode full` (use `--mode semver` to avoid bumping major versions)
4. Submit a Pull Request.

### Running CLI integration tests

The CLI package (`packages/aws-cdk`) has some integration tests that aren't
run as part of the regular build, since they have some particular requirements.
See the [CLI CONTRIBUTING.md file](packages/aws-cdk/CONTRIBUTING.md) for
more information on running those tests.

### API Compatibility Checks

All stable APIs in the CDK go through a compatibility check during build using
the [jsii-diff] tool. This tool downloads the latest released version from npm
and verifies that the APIs in the current build have not changed in a breaking
way.

[jsii-diff]: https://www.npmjs.com/package/jsii-diff

Compatibility checks always run as part of a full build (`yarn build`).

You can use `yarn compat` to run compatibility checks for all modules:

```shell
(working directory is repo root)
$ yarn build
$ yarn compat
```

You can also run `compat` from individual package directories:

```shell
$ cd packages/@aws-cdk/aws-sns
$ yarn build
$ yarn compat
```

The only case where it is legitimate to break a public API is if the existing
API is a bug that blocked the usage of a feature. This means that by breaking
this API we will not break anyone, because they weren't able to use it. The file
`allowed-breaking-changes.txt` in the root of the repo is an exclusion file that
can be used in these cases.

### Feature Flags

Sometimes we want to introduce new breaking behavior because we believe this is
the correct default behavior for the CDK. However, breaking changes are only allowed 
in major versions and those are rare.

To address this need, we have a feature flags pattern/mechanism. It allows us to
introduce new breaking behavior which is disabled by default (so existing
projects will not be affected) but enabled automatically for new projects
created through `cdk init`.

**DISCLAIMER**: feature flags are a "last resort" mechanism and should only be used
when it is impossible to figure out a way to introduce a feature without breaking
existing users. If you think your feature should be implemented behind a feature
flag, you will need to get an approval from at least two core team members. We do that
in order to avoid the abuse of this powerful capability.

The pattern is simple:

1. Seek the approval of a core team member that a feature flag can be used.
1. Define a new const under
   [cx-api/lib/features.ts](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/cx-api/lib/features.ts)
   with the name of the context key that **enables** this new feature (for
   example, `ENABLE_STACK_NAME_DUPLICATES`). The context key should be in the
   form `module.Type:feature` (e.g. `@aws-cdk/core:enableStackNameDuplicates`).
2. Use `node.tryGetContext(cxapi.ENABLE_XXX)` to check if this feature is enabled
   in your code. If it is not defined, revert to the legacy behavior.
3. Add your feature flag to
   [cx-api/lib/future.ts](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/cx-api/lib/future.ts).
   This map is inserted to generated `cdk.json` files for new projects created
   through `cdk init`.
4. In your PR title (which goes into CHANGELOG), add a `(under feature flag)` suffix. e.g:

    ```
    fix(core): impossible to use the same physical stack name for two stacks (under feature flag)
    ```
5. Under `BREAKING CHANGES`, add a prefix `(under feature flag)` and the name of the flag in the postfix. 
   For example:

    ```
    BREAKING CHANGE: (under feature flag) template file names for new projects created 
    through "cdk init" will use the template artifact ID instead of the physical stack 
    name to enable  multiple stacks to use the same name (feature flag: @aws-cdk/core:enableStackNameDuplicates)
    ```

In the [next major version of the
CDK](https://github.com/aws/aws-cdk/issues/3398) we will either remove the
legacy behavior or flip the logic for all these features and then
reset the `FEATURE_FLAGS` map for the next cycle.

## Troubleshooting

Most build issues can be solved by doing a full clean rebuild:

```shell
$ git clean -fqdx .
$ yarn build
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

## Debugging

### Connecting the VS Code Debugger

*Note:* This applies to typescript CDK application only.

To debug your CDK application along with the CDK repository,

1. Clone the CDK repository locally and build the repository. See [Workflows](#workflows) section for the different build options.
2. Build the CDK application using the appropriate npm script (typically, `yarn build`) and then run the `link-all.sh` script as so -

   ```
   cd /path/to/cdk/app
   /path/to/aws-cdk/link-all.sh
   ```

3. Open the CDK application (assume it's `hello-cdk` in these steps) and the CDK repository as a [VS code multi-root workspace](https://code.visualstudio.com/docs/editor/multi-root-workspaces).
4. Open the [workspace settings file](https://code.visualstudio.com/docs/editor/multi-root-workspaces#_settings) and verify that the following two folders must already exist

  ```json
  {
    "folders": [
      { "path": "<path-to-cdk-repo>/aws-cdk" },
      { "path": "<path-to-cdk-app>/hello-cdk" }
    ],
  }
  ```

5. Add the following launch configuration to the settings file -

  ```json
  "launch": {
    "configurations": [{
      "type": "node",
      "request": "launch",
      "name": "Debug hello-cdk",
      "program": "${workspaceFolder:hello-cdk}/bin/hello-cdk.js",
      "cwd": "${workspaceFolder:hello-cdk}",
      "console": "internalConsole",
      "sourceMaps": true,
      "skipFiles": [ "<node_internals>/**/*" ],
      "outFiles": [
        "${workspaceFolder:aws-cdk}/**/*.js",
        "${workspaceFolder:hello-cdk}/**/*.js",
      ],
    }]
  }
  ```

  *Go [here](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations) for more about launch configurations.*

6. The debug view, should now have a launch configuration called 'Debug hello-cdk' and launching that will start the debugger.
7. Any time you modify the CDK app or any of the CDK modules, they need to be re-built and depending on the change the `link-all.sh` script from step#2, may need to be re-run. Only then, would VS code recognize the change and potentially the breakpoint.

## Related Repositories

* [Samples](https://github.com/aws-samples/aws-cdk-examples): includes sample code in multiple languages
* [Workshop](https://github.com/aws-samples/aws-cdk-intro-workshop): source for https://cdkworkshop.com
* [Developer Guide](https://github.com/awsdocs/aws-cdk-guide): markdown source for developer guide
* [jsii](https://github.com/aws/jsii): the technology we use for multi-language support. If you are looking to help us support new languages, start there.

