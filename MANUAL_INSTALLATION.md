# CDK Manual Installation Instructions

The CDK is also distributed as a single zip file which contains the
same packages that we also publish to the various package managers.

You can download the zip file from the
[Releases](http://github.com/aws/aws-cdk/releases) page on GitHub.

The zip file comes with a signature so the integrity of the download
can be verified (see below).

## Installation overview

After extracting the archive, follow the following instructions:

### Installing the CLI

The CLI (the `cdk` command) is always installed using npm, regardless of your language.

```
npm install -g /path/to/zip/js/aws-cdk-1.2.3.tgz
```

### TypeScript/JavaScript (npm)

Run `npm install` on the desired tarballs:

```
# Install individual packages into your current project
npm install /path/to/zip/js/aws-lambda@1.2.3.jsii.tgz ...
```

### Python (pip)

Run `pip install` on the `.whl` files you want to install into your current virtual
env (or the global Python install):

```
# Install all wheels into your current Python env
pip install path/to/zip/python/*.whl
```

### Java (Maven)

Install the packages using Maven:

```
# For every package you want to install
mvn install:install-file -Dfile=/path/to/zip/java/software/amazon/awscdk/dynamodb/1.2.3/dynamodb-1.2.3.jar
mvn install:install-file -Dfile=/path/to/zip/java/software/amazon/awscdk/dynamodb/1.2.3/dynamodb-1.2.3-sources.jar
mvn install:install-file -Dfile=/path/to/zip/java/software/amazon/awscdk/dynamodb/1.2.3/dynamodb-1.2.3-javadoc.jar
```

### .NET (NuGet)

From a NuGet shell:

```
# For every package you want to install
Install-Package C:\Path\To\Zip\dotnet\Amazon.CDK.AWS.Events.1.2.3.nupkg
```


## Verifying the integrity of your download

You can verify that your download is complete and correct by validating
its signature against our public signing key. To do so, you need
the following things:

* [GNU Privacy Guard](https://gnupg.org/) needs to be installed.
* Download our public key: https://docs.aws.amazon.com/cdk/v2/guide/pgp-keys.html
* Make sure you have downloaded both `aws-cdk-x.y.z.zip`
  and `aws-cdk-x.y.z.zip.sig`.

Then run the following commands:

```shell
gpg --import cdk-team.asc
gpg --verify aws-cdk-x.y.z.zip.sig aws-cdk-x.y.z.zip
```

If everything is correct, the output will contain the line:

```
gpg: Good signature from "AWS CDK Team <aws-cdk@amazon.com>"
```

If you obtained via the above URL, you can ignore the following message:

```
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
```

