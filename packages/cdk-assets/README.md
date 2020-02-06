# cdk-assets

A tool for publishing assets for CDK applications to the right cloud locations.

<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

## Overview

`cdk-assets` requires an asset manifest file called `assets.json`, in a CDK
CloudAssembly (`cdk.out/assets.json`). It will take the assets listed in the
manifest, package them as required and upload them to the locations indicated in
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
  "version": "assets-1.0",
  "assets": {
    "7aac5b80b050e7e4e168f84feffa5893": {
      "type": "file",
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
    "b48783c58a86f7b8c68a4591c4f9be31": {
      "type": "docker-image",
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
