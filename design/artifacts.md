# Artifacts

When a CDK application is *synthesized*, it emits *artifacts*. Today, the
synthesis process has specific support for two types of artifacts:

- CloudFormation Templates
- Assets (files, directories, docker images)

This design document attempts to generalize the concept of *artifacts* and
address a few long-standing requirements that were hard to achieve with the
current tailored model.

## Approach

Let's start by defining more formally the various stages in a CDK application's lifecycle:

```
+--------+                +---------+            +----------+             +------------+
| Source |-- synthesis -->| Staging |-- build -->| Assembly |-- deploy -->| Deployment |
+--------+                +---------+            +----------+             +------------+
```

#### Source

The **source** is all the input files used to synthesize the app.

It includes the CDK application itself, but also runtime code, Dockerfiles,
static files, etc. Everything that is needed in order to run the application.

#### Staging

When users execute `cdk synth`, the CLI and the CDK app work together to produce
a **staging** directory.

This directory is *self-contained* in a sense that it does not rely on any files
that may have only been available during the CDK app execution (e.g. files that
are embedded as resources in library dependencies and cannot be accessed from
outside the runtime (see
[#1716](https://github.com/awslabs/aws-cdk/issues/1716)).

The staging directory includes artifacts that were emitted by the CDK app during
synthesis. Those can come from the file system (i.e. just a copy of a local
directory) or generated (synthesized) by the CDK (such as CloudFormation templates,
or generated runtime code accessors, etc).

Those files are not in their final state for deployment, they still need to go
through a "build" phase in order to get there.

#### Assembly

When users execute `cdk build` (a new command, which is currently part of `cdk
deploy`) the CLI will process the staging directory and build it into a **cloud
assembly** (or, in short, "assembly").

The assembly is a container (probably a zip file) which is ready to be deployed
to the AWS Cloud.

Here are examples of build actions for various types of artifacts:

- Zip a directory so it can be uploaded to S3
- Build a docker image so it can be pushed to ECR
- Produce a Lambda runtime bundle for a handler

#### Deployment

When users execute `cdk deploy`, the CLI picks up the assembly and deploys it to
the AWS Cloud.

This could be to a single environment (account/region) or to
multiple environments.

Deployment is a broad term: it can include uploading files to S3, pushing images
to Amazon ECR and provisioning stacks through AWS CloudFormation.

## Requirements

This is a free-form list of requirements related to this design topic. The idea
is to try and capture the problem space and it's complexity. Note that some requirements are
very technical and not necessarily "user-oriented".

- [ ] Artifacts can be purely generated (like CloudFormation templates), sourced
  from the filesystem (static files) or a mix (Lambda project with generated
  sources injected to them).
- [ ] Dependencies between artifacts both during synthesis and during deployment
- [ ] Dependencies can be explicit or implicit (via referencing)
- [ ] Staging directory should be persistent and when artifacts are sourced from
  the file system, we should employ incremental copy (ala "rsync")
- [ ] Each artifact will have a fingerprint which will be calculated based on
  all source inputs, including source files, generated files, copy options, etc.
  The fingerprint can be used to uniquely identify this artifact.
- [ ] Build actions must be fully reproducible. Given a specific source
  fingerprint, the build action will always yield the same output. This means
  that build actions should take as little dependency as possible in
  environment.
- [ ] It should be possible to use the fingerprint of artifacts during synthesis to invalidate things like Logical IDs (see TBD)
- [ ] The `aws:asset:path` metadata should be relative and not absolute

## Design

Notes:

- `CDK_OUT` will not be set by the CLI to a temporary directory but rather to
  something like `./.cdk.staging` (relative to where `cdk` is executed from).
  This means that the previous output can be used as a cache.
- Any construct can participate in synthesis and emit artifacts into the staging directory.
- `cdk.Stack` will emit the CloudFormation template (more accurately, the `SynthesizedStack` JSON for that stack as an artifact.
- Assets will copy the actual files to the output directory as artifacts. Caching and optimization can be done using the fingerprint of the source files (+ excludes + symlink options)
