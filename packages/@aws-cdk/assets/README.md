## AWS CDK Assets

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
