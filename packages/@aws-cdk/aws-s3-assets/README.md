## AWS CDK Assets
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

Assets are local files or directories which are needed by a CDK app. A common
example is a directory which contains the handler code for a Lambda function,
but assets can represent any artifact that is needed for the app's operation.

When deploying a CDK app that includes constructs with assets, the CDK toolkit
will first upload all the assets to S3, and only then deploy the stacks. The S3
locations of the uploaded assets will be passed in as CloudFormation Parameters
to the relevant stacks.

The following JavaScript example defines an directory asset which is archived as
a .zip file and uploaded to S3 during deployment.

[Example of a ZipDirectoryAsset](./test/integ.assets.directory.lit.ts)

The following JavaScript example defines a file asset, which is uploaded as-is
to an S3 bucket during deployment.

[Example of a FileAsset](./test/integ.assets.file.lit.ts)

## Attributes

`Asset` constructs expose the following deploy-time attributes:

 * `s3BucketName` - the name of the assets S3 bucket.
 * `s3ObjectKey` - the S3 object key of the asset file (whether it's a file or a zip archive)
 * `s3Url` - the S3 URL of the asset (i.e. https://s3.us-east-1.amazonaws.com/mybucket/mykey.zip)

In the following example, the various asset attributes are exported as stack outputs:

[Example of referencing an asset](./test/integ.assets.refs.lit.ts)

## Permissions

IAM roles, users or groups which need to be able to read assets in runtime will should be
granted IAM permissions. To do that use the `asset.grantRead(principal)` method:

The following examples grants an IAM group read permissions on an asset:

[Example of granting read access to an asset](./test/integ.assets.permissions.lit.ts)

## How does it work?

When an asset is defined in a construct, a construct metadata entry
`aws:cdk:asset` is emitted with instructions on where to find the asset and what
type of packaging to perform (`zip` or `file`). Furthermore, the synthesized
CloudFormation template will also include two CloudFormation parameters: one for
the asset's bucket and one for the asset S3 key. Those parameters are used to
reference the deploy-time values of the asset (using `{ Ref: "Param" }`).

Then, when the stack is deployed, the toolkit will package the asset (i.e. zip
the directory), calculate an MD5 hash of the contents and will render an S3 key
for this asset within the toolkit's asset store. If the file doesn't exist in
the asset store, it is uploaded during deployment.

> The toolkit's asset store is an S3 bucket created by the toolkit for each
  environment the toolkit operates in (environment = account + region).

Now, when the toolkit deploys the stack, it will set the relevant CloudFormation
Parameters to point to the actual bucket and key for each asset.

## CloudFormation Resource Metadata

> NOTE: This section is relevant for authors of AWS Resource Constructs.

In certain situations, it is desirable for tools to be able to know that a certain CloudFormation
resource is using a local asset. For example, SAM CLI can be used to invoke AWS Lambda functions
locally for debugging purposes.

To enable such use cases, external tools will consult a set of metadata entries on AWS CloudFormation
resources:

- `aws:asset:path` points to the local path of the asset.
- `aws:asset:property` is the name of the resource property where the asset is used

Using these two metadata entries, tools will be able to identify that assets are used
by a certain resource, and enable advanced local experiences.

To add these metadata entries to a resource, use the
`asset.addResourceMetadata(resource, property)` method.

See https://github.com/aws/aws-cdk/issues/1432 for more details
