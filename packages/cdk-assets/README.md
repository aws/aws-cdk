# cdk-assets
<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

A tool for publishing CDK assets to AWS environments.

## Overview

`cdk-assets` requires an asset manifest file called `assets.json`, in a CDK
CloudAssembly (`cdk.out/assets.json`). It will take the assets listed in the
manifest, prepare them as required and upload them to the locations indicated in
the manifest.

Currently the following asset types are supported:

* Files and archives, uploaded to S3
* Docker Images, uploaded to ECR

S3 buckets and ECR repositories to upload to are expected to exist already.

We expect assets to be immutable, and we expect that immutability to be
reflected both in the asset ID and in the destination location. This reflects
itself in the following behaviors:

* If the indicated asset already exists in the given destination location, it
  will not be packaged and uploaded.
* If some locally cached artifact (depending on the asset type a file or an
  image in the local Docker cache) already exists named after the asset's ID, it
  will not be packaged, but will be uploaded directly to the destination
  location.

## Usage

The `cdk-asset` tool can be used programmatically and via the CLI. Use
programmatic access if you need more control over authentication than the
default [`aws-sdk`](https://github.com/aws/aws-sdk-js) implementation allows.

Command-line use looks like this:

```
$ cdk-assets /path/to/cdk.out [ASSET:DEST] [ASSET] [:DEST] [...]
```

Credentials will be taken from the `AWS_ACCESS_KEY...` environment variables
or the `default` profile (or another profile if `AWS_PROFILE` is set).

A subset of the assets and destinations can be uploaded by specifying their
asset IDs or destination IDs.

## Manifest Example

An asset manifest looks like this:

```
{
  "version": "1.22.0",
  "files": {
    "7aac5b80b050e7e4e168f84feffa5893": {
      "source": {
        "path": "some_directory",
        "packaging": "zip"
      },
      "destinations": {
        "us-east-1": {
          "region": "us-east-1",
          "assumeRoleArn": "arn:aws:iam::12345789012:role/my-account",
          "bucketName": "MyBucket",
          "objectKey": "7aac5b80b050e7e4e168f84feffa5893.zip"
        }
      }
    },
  },
  "dockerImages": {
    "b48783c58a86f7b8c68a4591c4f9be31": {
      "source": {
        "directory": "dockerdir",
      },
      "destinations": {
        "us-east-1": {
          "region": "us-east-1",
          "assumeRoleArn": "arn:aws:iam::12345789012:role/my-account",
          "repositoryName": "MyRepository",
          "imageTag": "b48783c58a86f7b8c68a4591c4f9be31",
          "imageUri": "123456789012.dkr.ecr.us-east-1.amazonaws.com/MyRepository:1234567891b48783c58a86f7b8c68a4591c4f9be31",
        }
      }
    }
  }
}
```

### Placeholders

The `destination` block of an asset manifest may contain the following region
and account placeholders:

* `${AWS::Region}`
* `${AWS::AccountId}`

These will be substituted with the region and account IDs currently configured
on the AWS SDK (through environment variables or `~/.aws/...` config files).

* The `${AWS::AccountId}` placeholder will *not* be re-evaluated after
  performing the `AssumeRole` call.
* If `${AWS::Region}` is used, it will principally be replaced with the value
  in the `region` key. If the default region is intended, leave the `region`
  key out of the manifest at all.
