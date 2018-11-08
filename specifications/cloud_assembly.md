# Cloud Assembly Specification, Version 1.0

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**,
**RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in [RFC 2119] when they
are spelled out in bold, capital letters (as they are shown here).

## Introduction
A *Cloud Assembly* is a document container fail designed to hold the components of *cloud-native* applications,
including all the parts that are needed in order to deploy those to *the cloud*. This document exposes the specification
of the *Cloud Assembly* format as well as requirements imposed on *Cloud Assemblers* and *Cloud Runtimes*.

### Goals
The design goals for the *Cloud Assembly Specification* are the following:
* The *Cloud Assembly Specification* is extensible.
* The *Cloud Assembly Specification* is cloud-agnostic.
* The *Cloud Assembly Specification* is easy to implement and use.
* The *Cloud Assembly Specification* supports authenticity and integrity guarantees.
* A *Cloud Assembly* is self-contained, making deployments reproductible.

## Specification
A *Cloud Assembly* is a ZIP archive that **SHOULD** conform to the [ISO/IEC 21320-1:2015] *Document Container File*
standard. Use of the `deflate` compression method is **RECOMMENDED** in order to minimize the size of the resulting
file. *Cloud Assembly* files **SHOULD** use the `.cloud` extension in order to make them easier to recognize by users.

Documents in the archive can be stored with any name and directory structure, however the following entries at the root
of the archive are reserved for special use:
* `manifest.json` **MUST** be present and contains the [manifest document](#manifest-document) for the *Cloud Assembly*.
* `signature.asc`, when present, **MUST** contain the [digital signature](#digital-signature) of the *Cloud Assembly*.

### Manifest Document
The `manifest.json` file is the entry point of the *Cloud Assembly*. It **MUST** be a valid [JSON] document composed of
a single `object` that conforms to the following schema:

Key           |Type                 |Required|Description
--------------|---------------------|:------:|-----------
`schema`      |`string`             |Required|The schema for the document. **MUST** be `cloud-assembly/1.0`.
`drops`       |`Map<ID,Drop>`       |Required|A mapping of [*Logical ID*](#logical-id) to [`Drop`](#drop).
`missing`     |`Map<string,Missing>`|        |A mapping of context keys to [missing information](#missing).

The [JSON] specification allows for keys to be specified multiple times in a given `object`. However, *Cloud Assembly*
consumers **MAY** assume keys are unique, and [*Cloud Assemblers*](#cloud-assemblers) **SHOULD** avoid generating
duplicate keys. If duplicate keys are present, the latest specified value **SHOULD** be preferred.

### Logical ID
*Logical IDs* are `string`s that uniquely identify [`Drop`](#drop)s in the context of a *Cloud Assembly*.
* A *Logical ID* **MUST NOT** be empty.
* A *Logical ID* **SHOULD NOT** exceed `256` characters.
* A *Logical ID* **MUST** be composed of only the following ASCII printable characters:
  + Upper-case letters: `A` (`0x41`) through `Z` (`0x5A`)
  + Lower-case letters: `a` (`0x61`) through `z` (`0x7A`)
  + Numeric characters: `0` (`0x30`) through `9` (`0x39`)
  + Plus: `+` (`0x2B`)
  + Minus: `-` (`0x2D`)
  + Forward-slash: `/` (`0x2F`)
  + Underscore: `_` (`0x5F`)

### `Drop`
`Drop`s are the building blocks of *Cloud Assemblies*. They model a part of the *cloud-native* application that can be
deployed independently, provided it's dependencies are fulfilled. `Drop`s are specified using [JSON] objects that
**MUST** conform to the following schema:

Key          |Type             |Required|Description
-------------|-----------------|:------:|-----------
`type`       |`string`         |Required|The [*Drop Type*](#drop-type) specifier of this `Drop`.
`environment`|`string`         |required|The [environment](#environment) specifier for this `Drop`.
`metadata`   |`Map<string,any>`|        |Arbitrary key-value pairs associated with this `Drop`.
`properties` |`Map<string,any>`|        |The properties of this `Drop` as documented by its maintainers.

Each [`Drop` Type](#drop-type) can produce outputs that can be used in order to allow other `Drop`s to consume the
resources they procude. Each `Drop` implementer is responsible to document the output attributes it supports. References
to these outputs are modeled using special `string` tokens within entries of the `properties` section of `Drop`s:

```
${LogicalId.attributeName}
  ╰───┬───╯ ╰─────┬─────╯
      │           └─ The name of the output attribute
      └───────────── The Logical ID of the Drop
```

The following escape sequences are valid:
* `\\` encodes the `\` literal
* `\${` encodes the `${` literal

Deployment systems **SHOULD** return an error upon encountering an occurrence of the `/` literal that is not part of a
valid escape sequence.

#### Drop Type
Every `Drop` has a type specifier, which allows *Cloud Assembly* consumers to know how to deploy it. The type specifiers
are `string`s that use an URI-like syntax (`protocol://path`), providing the coordinates to a reference implementation
for the `Drop` behavior.

Deployment systems **MUST** support at least one protocol, and **SHOULD** support all the protocols specified in
the following sub-sections.

##### The `npm` protocol
Type specifiers using the `npm` protocol have the following format:
```
npm://[@namespace/]package/ClassName[@version]
╰┬╯    ╰────┬────╯ ╰──┬──╯ ╰───┬───╯  ╰──┬──╯
 │          │         │        │         └─ Optional version specifier
 │          │         │        └─────────── Fully qualified name of the Handler class
 │          │         └──────────────────── Name of the NPM package
 │          └────────────────────────────── Optional NPM namespace
 └───────────────────────────────────────── NPM protocol specifier
```

#### Environment
`Environment`s help Deployment systems determine where to deploy a particular `Drop`. Thy are `string`s that use an
URI-like syntax (`protocol://path`).

Deployment systems **MUST** support at least one protocol, and **SHOULD** support all the protocols specified in the
following sub-sections.

##### The `aws` protocol
Environments using the `aws` protocol have the following format:
```
aws://account/region
╰┬╯   ╰──┬──╯ ╰──┬─╯
 │       │       └─ The name of an AWS region (e.g: eu-west-1)
 │       └───────── An AWS account ID (e.g: 123456789012)
 └───────────────── AWS protocol specifier
```

### `Missing`
[`Drop`s](#drop) may require contextual information to be available in order to correctly participate in a
*Cloud Assembly*. When information is missing, *Cloud Assembly* producers report the missing information by adding
entries to the `missing` section of the [manifest document](#manifest-document). The values are [JSON] `object`s that
**MUST** conform to the following schema:

Key            |Type             |Required|Description
---------------|-----------------|:------:|-----------
`provider`     |`string`         |Required|A tag that identifies the entity that should provide the information.
`props`        |`Map<string,any>`|Required|Properties that are required in order to obtain the missing information.

### Digital Signature
#### Signing
*Cloud Assemblers* **SHOULD** support digital signature of *Cloud Assemblies*. When support for digital signature is
present, *Cloud Assemblers*:
* **MUST** require the user to specify which [PGP][RFC 4880] key should be used.

##### Signing Algorithm
<!--TODO-->

#### Verifying
Deployment systems **SHOULD** support verifying signed *Cloud Assemblies*. If support for signature verification is not
present, a warning **MUST** be emitted when processing a *Cloud Assembly* that contains the `signature.asc` file.

Deployment systems that support verifying signed *Cloud Assemblies*:
* **SHOULD** allow the user to *require* that an assembly is signed. When this requirement is active, an error **MUST**
  be returned when attempting to deploy an un-signed *Cloud Assembly*.
* **MUST** verify the integrity and authenticity of signed *Cloud Assemblies* prior to attempting to load any file
  included in it, except for `signature.asc`.
  * An error **MUST** be raised if the *Cloud Assembly*'s integirty is not verified by the signature.
  * An error **MUST** be raised if the [PGP][RFC 4880] key has expired according to the signature timestamp.
  * An error **MUST** be raised if the [PGP][RFC 4880] key is known to have been revoked. Deployment systems **MAY**
    trust locally available information pertaining to the key's validity.
* **SHOULD** allow the user to specify a list of trusted [PGP][RFC 4880] keys.

## Annex
### Examples of `Drop`s for the AWS Cloud
#### `@aws-cdk/aws-cloudformation.StackDrop`
A [*CloudFormation* stack][CFN Stack].

##### Properties
Property     |Type                |Required|Description
-------------|--------------------|:------:|-----------
`template`   |`string`            |Required|The assembly-relative path to the *CloudFormation* template document.
`parameters` |`Map<string,string>`|        |Parameters to be passed to the [stack][CFN Stack] upon deployment.
`stackPolicy`|`string`            |        |The assembly-relative path to the [Stack Policy][CFN Stack Policy].

##### Output Attributes
Attribute |Type                |Description
----------|--------------------|-----------
`outputs` |`Map<string,string>`|Data returned by [*CloudFormation* Outputs][CFN Outputs] of the stack.
`stackArn`|`string`            |The ARN of the [stack][CFN Stack].

##### Example
```json
{
  "type": "npm://@aws-cdk/aws-cloudformation.StackDrop",
  "environment": "aws://000000000000/bermuda-triangle-1",
  "properties": {
    "template": "my-stack/template.yml",
    "parameters": {
      "bucketName": "${helperStack.bucketName}",
      "objectKey": "${helperStack.objectKey}"
    },
    "stackPolicy": "my-stack/policy.json"
  }
}
```

[CFN Stack]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks.html
[CFN Stack Policy]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/protect-stack-resources.html
[CFN Outputs]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html

#### `@aws-cdk/assets.FileDrop`
A file that needs to be uploaded to an *S3* bucket.

##### Properties
Property    |Type    |Required|Description
------------|--------|:------:|-----------
`file`      |`string`|Required|The assembly-relative path to the file that will be uploaded.
`bucketName`|`string`|Required|The name of the bucket where this file will be uploaded.
`objectKey` |`string`|Required|The key at which to place the object in the bucket.

##### Output Attributes
Attribute   |Type    |Description
------------|--------|-----------
`bucketName`|`string`|The name of the bucket where the file was uploaded.
`objectKey` |`string`|The key at which the file was uploaded in the bucket.

##### Example
```json
{
  "type": "npm://@aws-cdk/assets.FileDrop",
  "environment": "aws://000000000000/bermuda-triangle-1",
  "properties": {
    "file": "assets/file.bin",
    "bucket": "${helperStack.bucketName}",
    "objectKey": "assets/da39a3ee5e6b4b0d3255bfef95601890afd80709/nifty-asset.png"
  }
}
```

#### `@aws-cdk/aws-ecr.DockerImageDrop`
A Docker image to be published to an *ECR* registry.

##### Properties
Property    |Type    |Required|Description
------------|--------|:------:|-----------
`savedImage`|`string`|Required|The assembly-relative path to the tar archive obtained from `docker image save`.
`imageName` |`string`|Required|The name of the image (e.g: `000000000000.dkr.ecr.bermuda-triangle-1.amazon.com/name`).
`tagName`   |`string`|        |The name of the tag to use when pushing the image (default: `latest`).

##### Output Attributes
Attribute     |Type    |Description
--------------|--------|-----------
`exactImageId`|`string`|An absolute reference to the published image version (`imageName@DIGEST`).
`imageName`   |`string`|The full tagged image name (`imageName:tagName`).

##### Example
```json
{
  "type": "npm://@aws-cdk/aws-ecr.DockerImageDrop",
  "environment": "aws://000000000000/bermuda-triangle-1",
  "properties": {
    "savedImage": "docker/37e6de0b24fa.tar",
    "imageName": "${helperStack.ecrImageName}",
    "tagName": "latest"
  }
}
```

### Example
Here is an example the contents of a complete *Cloud Assembly* that deploys AWS resources:
```
☁️ my-assembly.cloud
├─ manifest.json                                Cloud Assembly manifest
├─ stacks
│  ├─ PipelineStack.yml                         CloudFormation template
│  ├─ ServiceStack-beta.yml                     CloudFormation template
│  ├─ ServiceStack-beta.stack-policy.json       CloudFormation stack policy
│  ├─ ServiceStack-prod.yml                     CloudFormation template
│  └─ ServiceStack-prod.stack-policy.json       CloudFormation stack policy
├─ docker
│  └─ docker-image.tar                          Saved Docker image (docker image save)
├─ assets
│  └─ static-website                            Files for a static website
│     ├─ index.html
│     └─ style.css
└─ signature.asc                                Cloud Assembly digital signature
```

#### `manifest.json`
```json
{
  "schema": "cloud-assembly/1.0",
  "drops": {
    "PipelineStack": {
      "type": "npm://@aws-cdk/aws-cloudformation.StackDrop",
      "environment": "aws://123456789012/eu-west-1",
      "properties": {
        "template": "stacks/PipelineStack.yml"
      }
    },
    "ServiceStack-beta": {
      "type": "npm://@aws-cdk/aws-cloudformation.StackDrop",
      "environment": "aws://123456789012/eu-west-1",
      "properties": {
        "template": "stacks/ServiceStack-beta.yml",
        "stackPolicy": "stacks/ServiceStack-beta.stack-policy.json",
        "parameters": {
          "image": "${DockerImage.exactImageId}",
          "websiteFilesBucket": "${StaticFiles.bucketName}",
          "websiteFilesKeyPrefix": "${StaticFiles.keyPrefix}",
        }
      }
    },
    "ServiceStack-prod": {
      "type": "npm://@aws-cdk/aws-cloudformation.StackDrop",
      "environment": "aws://123456789012/eu-west-1",
      "properties": {
        "template": "stacks/ServiceStack-prod.yml",
        "stackPolicy": "stacks/ServiceStack-prod.stack-policy.json",
        "parameters": {
          "image": "${DockerImage.exactImageId}",
          "websiteFilesBucket": "${StaticFiles.bucketName}",
          "websiteFilesKeyPrefix": "${StaticFiles.keyPrefix}",
        }
      }
    },
    "DockerImage": {
      "type": "npm://@aws-cdk/aws-ecr.DockerImageDrop",
      "environment": "aws://123456789012/eu-west-1",
      "properties": {
        "savedImage": "docker/docker-image.tar",
        "imageName": "${PipelineStack.ecrImageName}"
      }
    },
    "StaticFiles": {
      "type": "npm://@aws-cdk/assets.DirectoryDrop",
      "environment": "aws://123456789012/eu-west-1",
      "properties": {
        "directory": "assets/static-website",
        "bucketName": "${PipelineStack.stagingBucket}"
      }
    }
  }
}
```

#### `signature.asc`
```pgp
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

{
  "algorithm": "SHA-256",
  "items": {
    "assets/static-website/index.html": {
      "size": ...,
      "hash": "..."
    },
    "assets/static-website/style.css": {
      "size": ...,
      "hash": "..."
    },
    "docker/docker-image.tar": {
      "size": ...,
      "hash": "..."
    },
    "manifest.json": {
      "size": ...,
      "hash": "..."
    },
    "stacks/PipelineStack.yml": {
      "size": ...,
      "hash": "..."
    },
    "stacks/ServiceStack-beta.stack-policy.json": {
      "size": ...,
      "hash": "..."
    },
    "stacks/ServiceStack-beta.yml": {
      "size": ...,
      "hash": "..."
    },
    "stacks/ServiceStack-prod.stack-policy.json": {
      "size": ...,
      "hash": "..."
    },
    "stacks/ServiceStack-prod.yml": {
      "size": ...,
      "hash": "..."
    },
  },
  "nonce": "mUz0aYEhMlVmhJLNr5sizPKlJx1Kv38ApBc12NW6wPE=",
  "timestamp": "2018-11-06T14:56:23Z"
}
-----BEGIN PGP SIGNATURE-----
[...]
-----END PGP SIGNATURE-----
```

<!-- Link References -->
[RFC 2119]: https://tools.ietf.org/html/rfc2119
[ISO/IEC 21320-1:2015]: https://www.iso.org/standard/60101.html
[JSON]: https://www.json.org
[RFC 4880]: https://tools.ietf.org/html/rfc4880
