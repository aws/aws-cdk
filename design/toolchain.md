# The AWS CDK Toolchain

The AWS CDK toolchain is the chain of tasks used to take a CDK app and deploy it into the AWS cloud. This document describes the various components in the toolchain and how they interact together.

## Current State

CDK apps can be deployed today using the CDK CLI (or CDK Toolkit). The toolkit is implemented as a monolithic program with no clear boundaries between the various stages. We would like to break up the monolithic process executed by the toolkit in order to synthesize, package and deploy a CDK app.

There a few reasons why we want to do this:

1. __Security__: isolate the "deploy" step such that no user code needs to run. This is very important from a security perspective because deployment commonly require administrator privileges on the AWS account, and we need to reduce the attack surface during that time (see #2073, which currently has to run both build and deploy together in the same CodeBuild task).
2. __Modularity__: Allow tools to utilize the various steps used to deploy a CDK app inside other tools such as IDEs, deployment tools, etc.
3. __Code Quality__: the CLI's code base needs a fresh rewrite, along with complete unit test coverage and this is an opportunity to do that.

## Requirements

* It should be possible to execute each component in the toolchain individually by feeding it the output from the previous step.
* Given a specific input, the output from each step must be completely reproducible (no side effects).
* Different components may require different execution environments and/or permissions to run. For example `cdk-synth` may need to be able to query the target AWS account in order to resolve environmental context, `cdk-bundle` may need to build docker images, `cdk-deploy` will need admin permissions in order to deploy the app.
* It should be possible to invoke each component as a jsii library from all supported languages.

## Design

Let's start by formally defining the states and steps in a CDK application's lifecycle:

```
+-----+                +---------+             +----------+             +------------+
| App |-- synthesis -->| Staging |-- bundle -->| Assembly |-- deploy -->| Deployment |
+-----+                +---------+             +----------+             +------------+
```

### cdk-synth

We start from a ready-to-run (__compiled__) CDK app.

Some languages require compilation (such as Java, Go, TypeScript) and in others (JavaScript, Ruby, Python), there is no need to compile. Compiling code is __not in scope__ for the CDK toolchain in order to allow developers to use their favorite IDEs and build toolchain idiomatically.

The first component in the toolchain is called `cdk-synth`. It's purpose is to execute the CDK app so it can synthesize the CDK tree (through the internal app phases which are "init", "prepare", "validate", "synthesize"). Eventually the CDK tree can synthesize both final artifacts such as CloudFormation templates and intermediate artifacts such as unpackaged assets.

The protocol between the CDK app `cdk-synth`:

- Context is passed into the app via a JSON map serialized into an environment variable called `CONTEXT_ENV`.
- The `CDK_OUTDIR` points to a directory into which artifacts should be emitted by the app.

The app will emit into `CDK_OUTDIR` a directory structure as follows:

```
.
├── missing.json
├── bundle.json
├── assembly
│   ├── manifest.json
│   └── stack1.template.json
└── staging
    └── intermediate-asset
        └── file1.txt
```

If the file `missing.json` exists in the output, it means that the synthesis output cannot be used and relies on missing context information, which must be populated in the context map. `cdk-synth` is responsible to resolve this context information through the environmental context provider system (for example, query the account for which availability zones are available in a specific region, read SSM parameters, etc). Then, `cdk-synth` must re-invoke the app with this context. Bear in mind that normally context information is cached in `cdk.context.json`, so subsequent executions will not require resolution.

`cdk-synth` may repeat this process up to 5 times (theoretically there could be missing context that the app will only know that it needs after it used some information from a resolved context from previous iteration).

Apart from reading `missing.json`, `cdk-synth` does not care about the structure of the output directory.

The output directory is expected to be *self-contained* in a sense that it does not rely on any files that may have only been available during the CDK app execution (e.g. files that are embedded as resources in library dependencies and cannot be accessed from outside the runtime (see [#1716](https://github.com/awslabs/aws-cdk/issues/1716)). It should be possible to pick up the output directory produced by "cdk-synth" and execute "cdk-bundle" (the next step) on a separate machine, possible with a different environment.

### cdk-bundle

The next component in the toolchain is called `cdk-pack`. The purpose of this step is to take the synthesis output and produce a ready-to-deploy, self-contained [cloud assembly](https://github.com/awslabs/aws-cdk/blob/master/design/cloud-assembly.md),

The input to `cdk-bundle` is the output directory produced by `cdk-synth`.

It reads the `bundle.json` file from the root of the output directory and executes the instructions described there. The bundle file describes
a set of bundling steps and dependencies between them. The file is produced by the CDK app with the goal to turn the intermediate CDK output directory into a final cloud assembly under the `assembly/` directory.

The following `bundle.json` file will archive the files from `staging/dir1` into `assembly/aaabbb.zip` and then duplicate `assembly/aaabbb.zip` to `assembly/dup.zip`:

```json
{
  "steps": {
    "zip_dir1": {
      "type": "zip",
      "parameters": {
        "src": "staging/dir1",
        "dest": "assembly/aaabbb.zip"
      }
    },
    "dup_zip_result": {
      "type": "copy",
      "parameters": {
        "src": "assembly/aaabbb.zip",
        "dest": "assembly/dup.zip"
      },
      "depends": [ "zip_dir1" ]
    }
  }
}
```

The bundler will support a growing set of step types. Initially:

- **zip**: archive a directory
- **copy**: copy files
- **docker**: build a docker image
- **lambda**: produce an AWS Lambda runtime bundle for a specific language

### cdk-deploy

The last component in the toolchain is to deploy the CDK app into the AWS Cloud.

The input to this stage is a self-contained cloud assembly as produced from `cdk-bundle`. See the [cloud assembly specification](https://github.com/awslabs/aws-cdk/blob/master/design/cloud-assembly.md) for details on the structure and capabilities of the cloud assembly.

At a high level, the assembly defines a set of artifacts with dependencies and `cdk-deploy` is responsible to deploy artifacts in topological order. Artifacts could include CloudFormation stacks (deployed through CloudFormation), files (uploaded to S3), Docker images (pushed to ECR), etc.

`cdk-deploy` should also accept an optional list of artifacts to deploy, in which case it will only deploy those artifacts (and optionally their dependencies).
