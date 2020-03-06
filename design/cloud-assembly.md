# Cloud Assembly Specification, Version 1.0

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**,
**RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in [RFC 2119] when they
are spelled out in bold, capital letters (as they are shown here).

## Introduction
A *Cloud Assembly* is a self-contained document container designed to hold the components of *cloud applications*,
including all the parts that are needed in order to deploy those to a *cloud* provider. This document is the
specification of the *Cloud Assembly* format as well as requirements imposed on *Cloud Assemblers* and *Cloud Runtimes*.

### Design Goals
The design goals for the *Cloud Assembly Specification* are the following:
* The *Cloud Assembly Specification* is extensible.
* The *Cloud Assembly Specification* is cloud-agnostic.
* The *Cloud Assembly Specification* is easy to implement and use.
* The *Cloud Assembly Specification* supports authenticity and integrity guarantees.
* A *Cloud Assembly* is self-contained, making deployments reproductible.

## Specification
A *Cloud Assembly* is a ZIP archive that **SHOULD** conform to the [ISO/IEC 21320-1:2015] *Document Container File*
standard. *Cloud Assembly* files **SHOULD** use the `.cloud` extension in order to make them easier to recognize by
users.

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
`droplets`    |`Map<ID,Droplet>`    |Required|A mapping of [*Logical ID*](#logical-id) to [Droplet](#droplet).
`missing`     |`Map<string,Missing>`|        |A mapping of context keys to [missing information](#missing).

The [JSON] specification allows for keys to be specified multiple times in a given `object`. However, *Cloud Assembly*
consumers **MAY** assume keys are unique, and *Cloud Assemblers* **SHOULD** avoid generating duplicate keys. If
duplicate keys are present and the manifest parser permits it, the latest specified value **SHOULD** be preferred.

### Logical ID
*Logical IDs* are `string`s that uniquely identify [Droplet](#droplet)s in the context of a *Cloud Assembly*.
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
* A *Logical ID* **MUST NOT** contain the `.` (`0x2E`) character as it is used in the string substitution pattern for
  cross-droplet references to separate the *Logical ID* from the *attribute* name.

In other words, *Logical IDs* are expected to match the following regular expression:
```js
/^[A-Za-z0-9+\/_-]{1,256}$/
```

### Droplet
Clouds are made of Droplets. They are the building blocks of *Cloud Assemblies*. They model a part of the
*cloud application* that can be deployed independently, provided its dependencies are fulfilled. Droplets are specified
using [JSON] objects that **MUST** conform to the following schema:

Key          |Type                  |Required|Description
-------------|----------------------|:------:|-----------
`type`       |`string`              |Required|The [*Droplet Type*](#droplet-type) specifier of this Droplet.
`environment`|`string`              |required|The target [environment](#environment) in which Droplet is deployed.
`dependsOn`  |`string[]`            |        |*Logical IDs* of other Droplets that must be deployed before this one.
`metadata`   |`Map<string,Metadata>`|        |Arbitrary named [metadata](#metadata) associated with this Droplet.
`properties` |`Map<string,any>`     |        |The properties of this Droplet as documented by its maintainers.

Each [Droplet Type](#droplet-type) can produce output strings that allow Droplets to provide informations that other
[Droplets](#droplet) can use when composing the *cloud application*. Each Droplet implementer is responsible to document
the output attributes it supports. References to these outputs are modeled using special `string` tokens within entries
of the `properties` section of Droplets:

```
${LogicalId.attributeName}
  ╰───┬───╯ ╰─────┬─────╯
      │           └─ The name of the output attribute
      └───────────── The Logical ID of the Droplet
```

The following escape sequences are valid:
* `\\` encodes the `\` literal
* `\${` encodes the `${` literal

Deployment systems **SHOULD** return an error upon encountering an occurrence of the `\` literal that is not part of a
valid escape sequence.

Droplets **MUST NOT** cause circular dependencies. Deployment systems **SHOULD** detect cycles and fail upon discovering
one.

#### Droplet Type
Every Droplet has a type specifier, which allows *Cloud Assembly* consumers to know how to deploy it. The type
specifiers are `string`s that use an URI-like syntax (`protocol://path`), providing the coordinates to a reference
implementation for the Droplet behavior.

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
Environments help Deployment systems determine where to deploy a particular Droplet. They are referenced by `string`s
that use an URI-like syntax (`protocol://path`).

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

### Metadata
Metadata can be attached to [Droplets](#droplet) to allow tools that work with *Cloud Assemblies* to share additional
information about the *cloud application*. Metadata **SHOULD NOT** be used to convey data that is necessary for
correctly process the *Cloud Assembly*, since any tool that consumes a *Cloud Assembly* **MAY** choose to ignore any or
all Metadata.

Key    |Type    |Required|Description
-------|--------|:------:|-----------
`kind` |`string`|Required|A token identifying the kind of metadata.
`value`|`any`   |Required|The value associated with this metadata.

A common use-case for Metadata is reporting warning or error messages that were emitted during the creation of the
*Cloud Assembly*, so that deployment systems can present this information to users or logs. Warning and error messages
**SHOULD** set the `kind` field to `warning` and `error` respectively, and the `value` field **SHOULD** contain a single
`string`. Deployment systems **MAY** reject *Cloud Assemblies* that include [Droplets](#droplet) that carry one or more
`error` Metadata entries, and they **SHOULD** surface `warning` messages, either directly through their user interface,
or in the execution log.

### Missing
[Droplets](#droplet) may require contextual information to be available in order to correctly participate in a
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
* **MUST** require configuration of the [PGP][RFC 4880] key that will be used for signing.

##### Signing Algorithm
The digital signature of *Cloud Assemblies* starts by establishing an attestation document that provides cryptographic
summary information about the contents of the signed assembly. It is a [JSON] document composed of a single `object`
with the following fields:

Field      |Type                  |Description
-----------|----------------------|-----------
`timestamp`|`string`              |The [ISO 8601] timestamp of the attestation document creation time
`algorithm`|`string`              |The hashing algorithm used to derive the `FileData` hashes.
`nonce`    |`string`              |The nonce used when deriving the `FileData` hashes.
`items`    |`Map<string,FileData>`|Summary information about the attested files.

The `algorithm` field **MUST** be set to the standard identifier of a standard hashing algorithm, such as `SHA256`.
Algorithms that are vulnerable to known collision attacks **SHOULD** not be used.

The `nonce` field **MUST** be set to a byte array generated using a cryptographically secure random number generator. A
`nonce` **MUST NOT** be re-used. It **MUST** be composed of at least `32` bytes, and **SHOULD** be the same length or
larger than the size of the output of the chosen `algorithm`.

The `items` field **MUST** contain one entry for each file in the *Cloud Assembly*, keyed on the relative path to the
file within the container document, with a value that contains the following keys:
Key   |Type    |Description
------|--------|-----------
`size`|`string`|The decimal representation of the file size in bytes.
`hash`|`string`|The base-64 encoded result of hashing the file's content appended with the `nonce` using the `algorithm`.

Here is a schematic example:
```js
{
  // When this attestation document was created
  "timestamp": "2018-11-15T11:08:52",
  // The hashing algorithm for the attestation is SHA256
  "algorithm": "SHA256",
  // 32 bytes of cryptographically-secure randomness
  "nonce": "2tDLdIoy1VtzLFjfzXVqzsNJHa9862y/WQgqKzC9+xs=",
  "items": {
    "data/data.bin": {
      // The file is really 1024 times the character 'a'
      "size": "1024",
      // SHA256(<content of data/data.bin> + <nonce from above>)
      "hash": "HIKJYDnT92EKILbFt2SOzA8dWF0YMEBHS72xLSw4lok="
    },
    /* ...other files of the assembly... */
  }
}
```

Once the attestation is ready, it is digitally *signed* using the configured [PGP][RFC 4880] key. The key **MUST** be
valid as of the `timestamp` field included in the attestation. The signature **MUST** not be detached, and is
**RECOMMENDED** to use the *cleartext signature framework* described in section 7 of [RFC 4880] so the attestation can
be read by a human.

#### Verifying
Deployment systems **SHOULD** support verifying signed *Cloud Assemblies*. If support for signature verification is not
present, a warning **MUST** be emitted when processing a *Cloud Assembly* that contains the `signature.asc` file.

Deployment systems that support verifying signed *Cloud Assemblies*:
* **SHOULD** be configurable to *require* that an assembly is signed. When this requirement is active, an error **MUST**
  be returned when attempting to deploy an un-signed *Cloud Assembly*.
* **MUST** verify the integrity and authenticity of signed *Cloud Assemblies* prior to attempting to load any file
  included in it, except for `signature.asc`.
  * An error **MUST** be raised if the *Cloud Assembly*'s integrity is not verified by the signature.
  * An error **MUST** be raised if the [PGP][RFC 4880] key has expired according to the signature timestamp.
  * An error **MUST** be raised if the [PGP][RFC 4880] key is known to have been revoked. Deployment systems **MAY**
    trust locally available information pertaining to the key's validity.
* **SHOULD** allow configuration of a list of trusted [PGP][RFC 4880] keys.

## Annex
### Examples of Droplets for the AWS Cloud
The Droplet specifications provided in this section are for illustration purpose only.

#### `@aws-cdk/aws-cloudformation.StackDroplet`
A [*CloudFormation* stack][CFN Stack].

##### Properties
Property     |Type                |Required|Description
-------------|--------------------|:------:|-----------
`stackName`  |`string`            |Required|The name of the *CloudFormation* stack once deployed.
`template`   |`string`            |Required|The assembly-relative path to the *CloudFormation* template document.
`parameters` |`Map<string,string>`|        |Parameters to be passed to the [stack][CFN Stack] upon deployment.
`stackPolicy`|`string`            |        |The assembly-relative path to the [Stack Policy][CFN Stack Policy].

##### Output Attributes
Attribute      |Type    |Description
---------------|--------------------|-----------
`output.<name>`|`string`|Data returned by the [*CloudFormation* Outputs][CFN Output] named `<name>` of the stack.
`stackArn`     |`string`|The ARN of the [stack][CFN Stack].

##### Example
```json
{
  "type": "npm://@aws-cdk/aws-cloudformation.StackDroplet",
  "environment": "aws://000000000000/bermuda-triangle-1",
  "properties": {
    "template": "my-stack/template.yml",
    "parameters": {
      "bucketName": "${helperStack.output.bucketName}",
      "objectKey": "${helperStack.output.objectKey}"
    },
    "stackPolicy": "my-stack/policy.json"
  }
}
```

[CFN Stack]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks.html
[CFN Stack Policy]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/protect-stack-resources.html
[CFN Outputs]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html

#### `@aws-cdk/assets.FileDroplet`
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
  "type": "npm://@aws-cdk/assets.FileDroplet",
  "environment": "aws://000000000000/bermuda-triangle-1",
  "properties": {
    "file": "assets/file.bin",
    "bucket": "${helperStack.outputs.bucketName}",
    "objectKey": "assets/da39a3ee5e6b4b0d3255bfef95601890afd80709/nifty-asset.png"
  }
}
```

#### `@aws-cdk/aws-ecr.DockerImageDroplet`
A Docker image to be published to an *ECR* registry.

##### Properties
Property    |Type    |Required|Description
------------|--------|:------:|-----------
`savedImage`|`string`|Required|The assembly-relative path to the tar archive obtained from `docker image save`.
`pushTarget`|`string`|Required|Where the image should be pushed to (e.g: `<account>.dkr.ecr.<region>.amazon.com/<name>`).
`tagName`   |`string`|        |The name of the tag to use when pushing the image (default: `latest`).

##### Output Attributes
Attribute     |Type    |Description
--------------|--------|-----------
`exactImageId`|`string`|An absolute reference to the published image version (`imageName@DIGEST`).
`imageName`   |`string`|The full tagged image name (`imageName:tagName`).

##### Example
```json
{
  "type": "npm://@aws-cdk/aws-ecr.DockerImageDroplet",
  "environment": "aws://000000000000/bermuda-triangle-1",
  "properties": {
    "savedImage": "docker/37e6de0b24fa.tar",
    "imageName": "${helperStack.output.ecrImageName}",
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
  "droplets": {
    "PipelineStack": {
      "type": "npm://@aws-cdk/aws-cloudformation.StackDroplet",
      "environment": "aws://123456789012/eu-west-1",
      "properties": {
        "template": "stacks/PipelineStack.yml"
      }
    },
    "ServiceStack-beta": {
      "type": "npm://@aws-cdk/aws-cloudformation.StackDroplet",
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
      "type": "npm://@aws-cdk/aws-cloudformation.StackDroplet",
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
      "type": "npm://@aws-cdk/aws-ecr.DockerImageDroplet",
      "environment": "aws://123456789012/eu-west-1",
      "properties": {
        "savedImage": "docker/docker-image.tar",
        "imageName": "${PipelineStack.output.ecrImageName}"
      }
    },
    "StaticFiles": {
      "type": "npm://@aws-cdk/assets.DirectoryDroplet",
      "environment": "aws://123456789012/eu-west-1",
      "properties": {
        "directory": "assets/static-website",
        "bucketName": "${PipelineStack.output.stagingBucket}"
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
[ISO 8601]: https://www.iso.org/standard/40874.html
