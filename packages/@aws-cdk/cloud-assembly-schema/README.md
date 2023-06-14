# Cloud Assembly Schema
<!--BEGIN STABILITY BANNER-->

---

![End-of-Support](https://img.shields.io/badge/End--of--Support-critical.svg?style=for-the-badge)

> AWS CDK v1 has reached End-of-Support on 2023-06-01.
> This package is no longer being updated, and users should migrate to AWS CDK v2.
>
> For more information on how to migrate, see the [_Migrating to AWS CDK v2_ guide][doc].
>
> [doc]: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Cloud Assembly

The *Cloud Assembly* is the output of the synthesis operation. It is produced as part of the
[`cdk synth`](https://github.com/aws/aws-cdk/tree/master/packages/aws-cdk#cdk-synthesize)
command, or the [`app.synth()`](https://github.com/aws/aws-cdk/blob/master/packages/@aws-cdk/core/lib/app.ts#L135) method invocation.

Its essentially a set of files and directories, one of which is the `manifest.json` file. It defines the set of instructions that are
needed in order to deploy the assembly directory.

> For example, when `cdk deploy` is executed, the CLI reads this file and performs its instructions:
>
> - Build container images.
> - Upload assets.
> - Deploy CloudFormation templates.

Therefore, the assembly is how the CDK class library and CDK CLI (or any other consumer) communicate. To ensure compatibility
between the assembly and its consumers, we treat the manifest file as a well defined, versioned schema.

## Schema

This module contains the typescript structs that comprise the `manifest.json` file, as well as the
generated [*json-schema*](./schema/cloud-assembly.schema.json).

## Versioning

The schema version is specified in the [`cloud-assembly.version.json`](./schema/cloud-assembly.schema.json) file, under the `version` property.
It follows semantic versioning, but with a small twist.

When we add instructions to the assembly, they are reflected in the manifest file and the *json-schema* accordingly.
Every such instruction, is crucial for ensuring the correct deployment behavior. This means that to properly deploy a cloud assembly,
consumers must be aware of every such instruction modification.

For this reason, every change to the schema, even though it might not strictly break validation of the *json-schema* format,
is considered `major` version bump.

## How to consume

If you'd like to consume the [schema file](./schema/cloud-assembly.schema.json) in order to do validations on `manifest.json` files, 
simply download it from this repo and run it against standard *json-schema* validators, such as [jsonschema](https://www.npmjs.com/package/jsonschema).

Consumers must take into account the `major` version of the schema they are consuming. They should reject cloud assemblies 
with a `major` version that is higher than what they expect. While schema validation might pass on such assemblies, the deployment integrity 
cannot be guaranteed because some instructions will be ignored.

> For example, if your consumer was built when the schema version was 2.0.0, you should reject deploying cloud assemblies with a 
> manifest version of 3.0.0. 

## Contributing

See [Contribution Guide](./CONTRIBUTING.md)
