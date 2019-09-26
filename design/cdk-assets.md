# cdk-assets

`cdk-assets` is a tool in the AWS CDK toolchain responsible to package and publish assets as part of the deployment process of CDK applications.

This document specifies the requirements for this tool derived from the [continuous delivery design document](./continuous-delivery.md).

## Asset Manifest

The main input to `cdk-assets` is a JSON file called `assets.json` which includes a manifest of assets. 

The manifest lists all assets and for each asset it describes the asset **source** (with instructions on how to package the asset if needed) and a list of **destinations**, which are locations into which this asset needs to be published.

The main components of the assets manifest are:

* **Types:** there are currently two supported types: files and docker images. Files are uploaded to an Amazon S3 bucket and docker images are pushed to an Amazon ECR repository.

* **Identifiers:** assets are identified throughout the system via a unique identifier (the key in the `files` and `images` map). This identifier is based on the sha256 of the source (the contents of the file or directory) and will change only if the source changes. It can be used for local caching and optimization purposes. For example, a zip of a directory can be stored in a local cache by this identifier to avoid duplicate work.

* **Sources:** the `source` information for each asset defines the file or directory (relative to the directory of `assets.json`), and additional **packaging** instructions, such as whether to create a zip file from a directory (for file assets) or which options to pass to `docker build`.

* **Destinations:** describe where the asset should be published. At a minimum, for file assets, it includes the S3 bucket and object key and for docker images it includes the repository and image names. A destination may also indicate that an IAM role must be assumed in order to support cross environment publishing. 

  > Destinations are intentionally denormalized in order to keep the logic of where assets are published at the application or framework level and not in this tool. For example, consider a deployment system which requires that all assets are always published to the same location, and then replicated through some other means to their actual consumption point. Alternatively, a user may have unique security requirements that will require certain assets to be stored in dedicated locations (e.g. with a specific key) and others in a different location, even if they all go to the same environment. Therefore, this tool should not take any assumptions on where assets should be published besides the exact instructions in this file.

Here is the complete manifest file schema in typescript:

```ts
interface AssetManifest {
  readonly version: 'assets-1.0';
  readonly files?: { [id: string]: FileAsset };
  readonly images?: { [id: string]: ImageAsset };
}

interface FileAsset {
  readonly source: FileAssetSource;
  readonly destinations: FileAssetDestination[];
}

interface ImageAsset {
  readonly source: ImageAssetSource;
  readonly destinations: ImageAssetDestination[];
}

interface FileAssetSource {
  readonly file: string;                                // file or directory name, relative to basedir
  readonly packaging?: FileAssetPackaging;              // packaging (default "FILE")
}

enum FileAssetPackaging {
  FILE = 'file',                                        // just upload "file" as-is
  ZIP_DIRECTORY = 'zip'                                 // zip the directory and then upload
}

interface FileAssetDestination {
  readonly assumeRoleArn?: string;                      // iam role to assume
  readonly assumeRoleExternalId?: string;               // external id to pass to assume-role
  readonly bucketName: string;
  readonly objectKey: string;
}

interface ImageAssetSource {
  readonly directory: string;                           // docker build context directory
  readonly dockerBuildArgs?: { [arg: string]: string }; // optional args to "docker build"
  readonly dockerBuildTarget?: string;                  // docker build --target to use
  readonly dockerFile?: string;                         // custom name for Dockerfile
}

interface ImageAssetDestination {
  readonly assumeRoleArn: string;                       // iam role to assume
  readonly assumeRoleExternalId?: string;               // external id to pass to assume-role
  readonly repositoryName: string;                      // ECR repository name
  readonly imageName: string;                           // image tag to use
}
```

Example of `assets.json` with two assets: a docker image and a file asset. Both assets are published to two destinations (S3/ECR).

```json
{
  "version": "assets-1.0",
  "images": {
    "d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a": {
      "source": {
        "packaging": "docker",
        "directory": "my-image",
        "dockerFile": "CustomDockerFile",
        "dockerBuildArgs": { "label": "prod" },
        "dockerBuildTarget": "my-target"
      },
      "destinations": [
        {
          "repositoryName": "aws-cdk-images-2222222222US-us-east-1",
          "imageName": "d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a",
          "assumeRoleArn": "arn:aws:iam::2222222222US:role/aws-cdk-publish-2222222222US-us-east-1"
        },
        {
          "repositoryName": "aws-cdk-images-3333333333EU-eu-west-2",
          "imageName": "d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a",
          "assumeRoleArn": "arn:aws:iam::3333333333EU:role/aws-cdk-publish-3333333333EU-eu-west-2"
        }
      ]
    }
  },
  "files": {
    "a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57": {
      "source": {
        "packaging": "zip",
        "file": "myzipdirectory"
      },
      "destinations": [
        {
          "bucketName": "aws-cdk-files-2222222222US-us-east-1",
          "objectKey": "a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57.zip"
        },
        {
          "bucketName": "aws-cdk-files-3333333333EU-us-west-2",
          "objectKey": "a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57.zip",
          "assumeRoleArn": "arn:aws:iam::3333333333EU:role/aws-cdk-publish-3333333333EU-eu-west-2"
        }
      ]
    }
  }
}
```

## API

`cdk-assets` is designed as a stand-alone command line program and a library, so it can be integrated into other tools such as the CDK CLI or executed individually as a step in a CI/CD pipeline.

### `publish`

```shell
cdk-assets publish DIR [ASSET-ID,ASSET-ID...]
```

Packages and publishes assets to all destinations.

* `DIR` is the directory from where to read `assets.json`, and which is used as the base directory for all file/directory references.
* `ASSET-ID,...`: additional arguments represent asset identifiers to publish (default is to publish all assets). This can be used to implement concurrent publishing of assets (e.g. through CodePipeline).

The `publish` command will do the following:

For each asset and for each destination (pseudo code):

```
for each asset in manifest:
  for each destination:
    assume destination iam role (if defined)
    if asset already published to destination: continue
    if asset requires packaging and not cached locally (by id):
      package asset (docker build/zip directory)
      cache asset locally (to avoid duplicate builds)
    publish to destination (upload/push)
```

Example (`cdk.out/assets.json` as above):

```shell
$ cdk-assets publish cdk.out
asset    d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a
assume   arn:aws:iam::2222222222US:role/aws-cdk-publish-2222222222US-us-east-1
notfound aws-cdk-images-2222222222US-us-east-1:d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a
nocache  d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a
package  docker build --target=my-target --label=prod -f CustomDockerFile ./myimage
push     aws-cdk-images-2222222222US-us-east-1:d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a
assume   arn:aws:iam::3333333333EU:role/aws-cdk-publish-3333333333EU-eu-west-2
found    aws-cdk-images-3333333333EU-eu-west-2:d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a
done     d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a    
--------------------------------------------------------------------------
asset    a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57
found    s3://aws-cdk-files-2222222222US-us-east-1/a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57.zip
assume   arn:aws:iam::3333333333EU:role/aws-cdk-publish-3333333333EU-eu-west-2
notfound s3://aws-cdk-files-3333333333EU-us-west-2/a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57.zip
cached   zip ./myzipdirectory
upload   s3://aws-cdk-files-3333333333EU-us-west-2/a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57.zip
done     a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57
--------------------------------------------------------------------------
```

The log above describes the following:

The first asset to process is the docker image with id `d31ca1a...`. We first assume the role is the 2222US environment and check if the image exists in this ECR repository. Since it doesn't exist (`notfound`), we check if it exists in the local cache under the tag `d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a`. It doesn't so we build the docker image (`package`) and then push it. Then we assume the role from the 33333EU environment and find that the image is already in that ECR repository, so we just finish.

The second asset is the file asset with id `a0bae...`. The first environment doesn't specify a role, so we just check if the file exists in the S3 bucket. It is, so we move to the next destination. We assume the role and check if the asset is in the s3 location. It is not (`notfound`), so we need to package and upload it. Before we package we check if it's cached locally and find that it is (`cached`), so no need to zip again, just `upload`.

### `ls`

```shell
cdk-assets ls DIR
```

Prints a list of asset identifiers and their type.

Example:

```shell
$ cdk-assets ls cdk.out
d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a image
a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57 file
```

### Programmatic API

The tool should expose a programmatic (library) API, so it can be integrated with other tools such as the AWS CLI and IDEs. The library should be jsii-compliant and released to all languages supported by the AWS CDK.

Since the publishing process is highly asynchronous, the API should include the ability to subscribe to progress events in order to allow implementation of a rich user interface.

Proposed API:

```ts
class Assets {
  constructor(dir: string);
  readonly manifest: AssetManifest;
  
  // starts publishing a single asset
  publish(assetid: string, progress?: Progress): Progress;
}

interface ProgressEvent {
  readonly assetid: string;
  readonly progress: number; // percentage
  readonly type: string;
  readonly info: string;
}

class Progress {
  onStart(assetid: string): void;
  onEvent(evt: ProgressEvent): void;
  onComplete(assetid: string): void;
}

class Publish {
  abort(): void;
  readonly events: ProgressEvent[];
  readonly progress: number; // percentage
  readonly complete: boolean;
}
```

## Non-Functional Requirements

* **test coverage**: codebase must have full unit test coverage and a set of integration tests that can be executed within a pipeline environment.
* **minimal dependencies**: the tool should take the minimum amount of 3rd party dependencies in order to reduce attack surface and to simplify bundling for jsii.
* **jsii**: the API must be jsii-complient, so it can be used programmatically from all supported languages. This means that all non-jsii dependencies must be bundled into the module.
