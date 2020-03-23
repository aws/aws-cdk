## Cloud Assembly Schema
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Cloud Assembly

The *Cloud Assembly* is the artifact of the AWS CDK class library. It is produced as part of the [`cdk synth`](https://github.com/aws/aws-cdk/tree/master/packages/aws-cdk#cdk-synthesize) command, or the [`app.synth()`](https://github.com/aws/aws-cdk/blob/master/packages/@aws-cdk/core/lib/app.ts#L135) method incovation.

Its essentially a set of files and directories, one of which is the `manifest.json` file. It defines the set of instructions that are needed in order to deploy the assembly directory.

> For example, when `cdk deploy` is executed, this file is read and performs its instructions:
> - Build container images.
> - Upload assets.
> - Deploy CloudFormation templates.

Therefore, the assembly is how the CDK class library and CDK CLI (or any other consumer should communicate. To ensure compatibility between the assembly and its consumers, we treat the manifest file as a well defined, versioned schema.

## Schema

This module contains the typescript structs that comprise the `manifest.json` file, as well as the generated [*json-schema*](./schema/cloud-assembly.schema.json).

## Versioning

The schema version is specified in the [`cloud-assembly.metadata.json`](./schema/cloud-assembly.schema.json) file, under the `version` property. It follows semantic versioning (with a small [twist](#twist)).

## How to consume

If you'd like to consume the schema in order to do validations on `manifest.json` files, simply download it from this repo and run it against standard *json-schema* validators.

> For example: https://www.npmjs.com/package/jsonschema (this is how the CDK CLI does it)

Since it follows semantic versioning, it is guaranteed to properly validate any `manifest.json` file, as long as the major version hasn't changed.

### Twist

When we add instructions to the assembly, they are reflected in the manifest file and the *json-schema* accordingly. This means that for consumers to properly deploy it, they must be aware of every such instruction modification.

For this reason, every change to the schema, will cause a `major` version, that clearly communicates to consumers that 