# cdk-bootstrap

`cdk-bootstrap` is a tool in the AWS CDK toolchain responsible for populating a given environment
(that is, a combination of AWS account and region)
with resources required by the CDK to perform deployments into that environment.
It's a successor to the `cdk bootstrap` sub-command that is part of the `@aws-cdk/core` package,
and is needed because of the increased bootstrapping requirements present in the
["Continuous delivery for CDK apps"](https://github.com/aws/aws-cdk/pull/3437) design document.

## Command-line interface

Invoking the `bootstrap` tool looks something like this:

```shell
$ cdk-bootstrap [--trust accountId[,otherAccountId]...] aws:://account/region
```

If the `trust` option has been passed on the CLI,
the tool will present the user with the following "menu":

```shell
This will create a new IAM Role, trusting the CloudFormation service principal,
that will be used for deploying your CloudFormation stacks in this environment.
Please choose the Managed Policy or Policies to attach to the Role
that contain the permissions required to perform those deployments:

[1]  AdministratorAccess
[2]  AmazonDynamoDBFullAccess
[3]  AmazonEC2FullAccess
[4]  AmazonECS_FullAccess
[5]  AmazonS3FullAccess
[6]  AmazonSageMakerFullAccess
[7]  AmazonSESFullAccess
[8]  AmazonSNSFullAccess
[9]  AmazonSQSFullAccess
[10] AWSLambdaFullAccess
[11] SimpleWorkflowFullAccess
...

Please input the number of the chosen Policy from the above list,
or provide a fully qualified ARN of a different Managed Policy.
You can input multiple numbers and/or ARNs (up to 10),
separated by commas.

>
```

After the user has made their choice,
or if the `trust` option has not been passed,
bootstrapping will proceed.

### Bootstrap resources

The `bootstrap` command creates a CloudFormation stack in the environment passed on the command line.
The resources in that stack are:

* An S3 bucket that holds the file assets and the resulting CloudFormation template to deploy.

If the `trust` option has been passed,
additionally, we will create the following:

* An ECR repository that stores the images that are the results of building Docker assets.

* An IAM role, called the **Publishing role**,
  that has permissions to write to both the S3 bucket and the ECR repository from above.
  This role will be assumable by any principal from the account(s) passed by the `trust` option.
  
  This role has the following permissions:
  
  ```json
  {
    "PolicyDocument": {
      "Statement": [
        {
          "Action": [
            "s3:GetObject*",    "s3:GetBucket*", "s3:List*",
            "s3:DeleteObject*", "s3:PutObject*", "s3:Abort*"
          ],
          "Resource": [
            "arn-of-the-S3-assets-bucket",
            "arn-of-the-S3-assets-bucket/*"
          ]
        },
        {
          "Action": [
            "ecr:PutImage",        "ecr:InitiateLayerUpload",
            "ecr:UploadLayerPart", "ecr:CompleteLayerUpload"
          ],
          "Resource": "arn-of-the-docker-assets-ecr-repository"
        }
      ]
    }
  }
  ```

* An IAM role, called the **Action role**,
  that will be assumed when executing the CloudFormation deployment actions
  (CreateChangeSet and ExecuteChangeSet) in the continuous delivery pipeline.
  It is also assumable by any principal from the account(s) passed by the `trust` option.
  
  This role has the following permissions:
  
  ```json
  {
    "PolicyDocument": {
      "Statement": [
        {
          "Action": [
            "cloudformation:CreateChangeSet",   "cloudformation:DeleteChangeSet",
            "cloudformation:DescribeChangeSet", "cloudformation:DescribeStacks",
            "cloudformation:ExecuteChangeSet"
          ],
          "Resource": "*"
        },
        {
          "Action": "iam:PassRole",
          "Resource": "arn-of-the-cfn-deployment-role"
        }
      ]
    }
  }
  ```

* An IAM role, called the **CFN deployment role**,
  that will be used to perform the actual CFN stack deployment in the continuous delivery pipeline to this environment.
  It is assumable *only* by the CloudFormation service principal
  (this is for security reasons, as this role will have, necessarily, very wide permissions).
  It will not have any inline policies,
  but will instead have the Managed Policies attached that the user selected when prompted (see above).

#### Physical resource names

All of the above resources will be created with well-defined physical names -
none of them will rely on automated CloudFormation naming.
This is so that the other stages of CDK synthesis,
like asset resolution, can rely on the concrete names
(there is no reliable way to transfer this kind of information in an automated way across regions and/or accounts).
This also allows for more fine-grained permissions -
for instance, the continuous delivery pipeline needs to grant the **action role**
permissions to read from the pipeline's bucket
(to read the artifact that contains the CFN template to deploy);
this way, it can add a well-defined name to the resource policy of the artifact bucket,
instead of granting those permissions to all principals in the account.

The naming scheme will include the following elements in order to minimize the chance of name collisions:

* The region we're bootstrapping in.
* The account ID we're bootstrapping in.
* The type of the resource (file assets bucket, Docker assets repository, etc.).
* An optional *qualifier* that defends against S3 bucket sniping.

### CLI options in detail

These options are inherited from the current CLI experience:

* `--profile`: use the given local AWS credentials profile when interacting with the target environment.

* `--stack-name`, `-s`: allows you to explicitly name the CloudFormation bootstrap stack
  (instead of relying on the default naming scheme).

* `--bucket-name`, `-b`: allows you to explicitly name the file assets S3 bucket
  (instead of relying on the default naming scheme).

* `--kms-key-id`, `-k`: optional identifier of the KMS key used for encrypting the file assets S3 bucket.

These are the new options:

* `--trust`: allows specifying an AWS account ID, or a list of them,
  that the created roles (see above) should be assumable from.
  This will be required to be passed as the pipeline account,
  for deployment from a Continuous Delivery CDK pipeline to work.

* `--qualifier`, `-q`: an optional qualifier added to the physical names of the bootstrap resources
  in order to protect against name collisions, especially for things like S3 buckets
  (which are globally unique in a given AWS partition).

## Updating bootstrap resources

Because we already have a bootstrap solution in place,
and it's possible we will need to add more bootstrap resources as time goes by,
we should have a mechanism in place for migrating,
and giving meaningful errors if the bootstrapping has not been done for an environment that needs it.

I don't think invoking the full `cdk-bootstrap` tool on every deploy is a good idea, though;
I worry that calculating a full diff of actual versus desired resource state might impact the performance of commands like
`deploy` too negatively.

My proposal is to have an export on the bootstrap stack,
called `ResourcesChecksum`, that will contain the SHA-256 hash of the state of all resources.
To see if a given environment is up to date,
we only need to calculate the hash locally,
and then get the value of the export from a CloudFormation API call,
and compare the 2.
If the export is not present, or if the local and remote values differ,
we know that the bootstrapping has either not been performed,
or is out of date;
we can then either prompt the user to call `bootstrap`,
or attempt to perform the bootstrapping for them, automatically
(and only show the message if it fails, most likely because of insufficient permissions).
