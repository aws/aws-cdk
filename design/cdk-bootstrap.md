# `cdk bootstrap`

`cdk bootstrap` is a tool in the AWS CDK command-line interface responsible for populating a given environment
(that is, a combination of AWS account and region)
with resources required by the CDK to perform deployments into that environment.

This document is a design for extending the capabilities of the `bootstrap` command motivated by the needs of the
["Continuous delivery for CDK apps"](https://github.com/aws/aws-cdk/pull/3437) epic.

## Required changes

### Bootstrap resources

The `bootstrap` command creates a CloudFormation stack in the environment passed on the command line.
Currently, the only resource in that stack is:

* An S3 bucket that holds the file assets and the resulting CloudFormation template to deploy.

We will add the following resources to the bootstrap stack:

* An ECR repository that stores the images that are the results of building Docker assets.

If the `--trust` option has been passed,
additionally, we will create the following resources:

* An IAM role, called the **Publishing role**,
  that has permissions to write to both the S3 bucket and the ECR repository from above.
  This role will be assumable by any principal from the account(s) passed by the `--trust` option.

* An IAM role, called the **Deployment Action Role**,
  that will be assumed when executing the CloudFormation deployment actions
  (CreateChangeSet and ExecuteChangeSet).
  It is also assumable by any principal from the account(s) passed by the `--trust` option.

* An IAM role, called the **CloudFormation Execution Role**,
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
for instance, the continuous delivery pipeline needs to grant the **Deployment Action Role**
permissions to read from the pipeline's bucket
(to read the artifact that contains the CFN template to deploy);
this way, it can add a well-defined name to the resource policy of the artifact bucket,
instead of granting those permissions to all principals in the account.

The naming scheme will include the following elements in order to minimize the chance of name collisions:

* The region we're bootstrapping in.
* The account ID we're bootstrapping in.
* The type of the resource (file assets bucket, Docker assets repository, etc.).

### `--trust`

We will add a new command-line option called `--trust` to the `bootstrap` command.
Its value is a list of AWS account IDs:

```shell
$ cdk bootstrap [--trust accountId[,otherAccountId]...] aws:://account/region
```

If the `--trust` option has been passed on the CLI,
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
or if the `--trust` option has not been passed,
bootstrapping will proceed.

We will also add a another option,
`--cfn-deployment-role-policies`,
that allows you to pass a list of managed policy ARNs on the command line,
so that the `bootstrap` command can also be executed in non-interactive mode.

### Removing existing customization options

The existing customization options: `--bootstrap-bucket-name` and `--bootstrap-kms-key-id` will be removed.
We will need to know the names of the bootstrap bucket and KMS key and synthesis time.
The only way to customize the bootstrap template will be to deploy your own,
based on the default one the CDK provides,
and then change the default options when creating instances of the `Stack`
class to match the names used in the custom template.

### `--show-template`

To help with the customization case,
we will add a command that outputs the template we're using for bootstrapping to standard output.
This way, it can serve as a base for anyone who wants customize the bootstrapping behavior.

### CLI options in detail

These options are inherited from the current CLI experience,
and need to be kept for backwards compatibility reasons:

* `--profile`: use the given local AWS credentials profile when interacting with the target environment.

* `--toolkit-stack-name`: allows you to explicitly name the CloudFormation bootstrap stack
  (instead of relying on the default naming scheme).

* `--tags`, `-t`: a list of key=value pairs to add as tags to add to the bootstrap stack.

These options will be removed:

* `--bootstrap-bucket-name`, `-b`: allows you to explicitly name the file assets S3 bucket
  (instead of relying on the default naming scheme).

* `--bootstrap-kms-key-id`: optional identifier of the KMS key used for encrypting the file assets S3 bucket.

These are the new options:

* `--trust`: allows specifying an AWS account ID, or a list of them,
  that the created roles (see above) should be assumable from.
  This will be required to be passed as the pipeline account,
  for deployment from a Continuous Delivery CDK pipeline to work.

* `--cfn-deployment-role-policies`: allows specifying the ManagedPolicy ARN(s)
  that should be attached to the **CloudFormation Execution Role**
  instead of choosing them from a menu interactively.

* `--show-template`: outputs the bootstrap CloudFormation template
  (see below) to standard output.

## Updating bootstrap resources

Because we already have a bootstrap solution in place,
and it's possible we will need to add more bootstrap resources as time goes by,
we should have a mechanism in place for migrating,
and giving meaningful errors if the bootstrapping has not been done for an environment that needs it.

I don't think invoking the full `cdk-bootstrap` tool on every deploy is a good idea, though;
I worry that calculating a full diff of actual versus desired resource state might impact the performance of commands like
`deploy` too negatively.

My proposal is to have an export on the bootstrap stack,
called `AwsCdkBootstrapVersion`, that will simply contain a number.
We will start with the bootstrap template setting that export to the value `1`.
With time, as we change the bootstrap template,
we will increment the version export number.

In the `cdk` commands,
we can add a CLI option that will perform a 'bootstrap version check'
before doing any operations.
It will call the `DescribeStack` CFN API,
and get the value of the `AwsCdkBootstrapVersion` export.
Depending on the value retrieved, it will then:

* If no such stack was found, that means bootstrapping was not performed for this environment.
  Fail with the appropriate message.

* If the stack was found, but it didn't have an export called `AwsCdkBootstrapVersion`,
  that means the bootstrap stack is of an older version than the used CLI version,
  and needs to be updated.
  Fail with the appropriate message.

* If the export is the same as the `BOOTSTRAP_VERSION` constant in the current CLI,
  everything is fine - nothing to do.

* If the export value is smaller than the `BOOTSTRAP_VERSION` constant in the current CLI,
  that means the bootstrap stack is of an older version than the used CLI version,
  and needs to be updated.
  Fail with the appropriate message.

* If the export value is larger than the `BOOTSTRAP_VERSION` constant in the current CLI,
  that means the bootstrap stack is actually from a later version than the used CLI version.
  In this case, I think it's correct to proceed with carrying out the operation;
  perhaps print a warning that the user should consider updating their CLI version
  if they encounter any errors.

## Bootstrap template

Here is the JSON of the bootstrap CloudFormation template:

```json
{
  "Description": "The CDK Toolkit Stack. It was created by `cdk bootstrap` and manages resources necessary for managing your Cloud Applications with AWS CDK.",
  "Parameters": {
    "TrustedPrincipals": {
      "Description": "List of AWS principals that the publish and action roles should trust to be assumed from",
      "Default": "",
      "Type": "CommaDelimitedList"
    },
    "CloudFormationExecutionPolicies": {
      "Description": "List of the ManagedPolicy ARN(s) to attach to the CloudFormation deployment role",
      "Default": "",
      "Type": "CommaDelimitedList"
    }
  },
  "Conditions": {
    "HasTrustedPrincipals": {
      "Fn::Not": [
        {
          "Fn::Equals": [
            "",
            {
              "Fn::Join": [
                "",
                {
                  "Ref": "TrustedPrincipals"
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "Resources": {
    "FileAssetsBucketEncryptionKey": {
      "Type": "AWS::KMS::Key",
      "Properties": {
        "KeyPolicy": {
          "Statement": [
            {
              "Action": [
                "kms:Create*", "kms:Describe*", "kms:Enable*", "kms:List*", "kms:Put*",
                "kms:Update*", "kms:Revoke*", "kms:Disable*", "kms:Get*", "kms:Delete*",
                "kms:ScheduleKeyDeletion", "kms:CancelKeyDeletion", "kms:GenerateDataKey"
              ],
              "Effect": "Allow",
              "Principal": {
                "AWS": {
                  "Fn::Sub": "arn:${AWS::Partition}:iam::${AWS::AccountId}:root"
                }
              },
              "Resource": "*"
            },
            {
              "Action": [
                "kms:Decrypt",    "kms:DescribeKey",     "kms:Encrypt",
                "kms:ReEncrypt*", "kms:GenerateDataKey*"
              ],
              "Effect": "Allow",
              "Principal": {
                "AWS": {
                  "Fn::Sub": "${PublishingRole.Arn}"
                }
              },
              "Resource": "*"
            }
          ]
        }
      }
    },
    "FileAssetsBucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "BucketName": {
          "Fn::Sub": "cdk-bootstrap-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}"
        },
        "AccessControl": "Private",
        "BucketEncryption": {
          "ServerSideEncryptionConfiguration": [{
            "ServerSideEncryptionByDefault": {
              "SSEAlgorithm": "aws:kms",
              "KMSMasterKeyID": {
                "Fn::Sub": "${FileAssetsBucketEncryptionKey.Arn}"
              }
            }
          }]
        },
        "PublicAccessBlockConfiguration": {
          "BlockPublicAcls": true,
          "BlockPublicPolicy": true,
          "IgnorePublicAcls": true,
          "RestrictPublicBuckets": true
        }
      }
    },
    "ContainerAssetsRepository": {
      "Type": "AWS::ECR::Repository",
      "Properties": {
        "RepositoryName": {
          "Fn::Sub": "cdk-bootstrap-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}"
        }
      }
    },
    "PublishingRole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "AWS": {
                  "Ref": "TrustedPrincipals"
                }
              }
            }
          ]
        },
        "RoleName": "cdk-bootstrap-hnb659fds-publishing-role-${AWS::AccountId}-${AWS::Region}"
      }
    },
    "PublishingRoleDefaultPolicy": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                "s3:GetObject*",    "s3:GetBucket*", "s3:List*",
                "s3:DeleteObject*", "s3:PutObject*", "s3:Abort*"
              ],
              "Resource": [
                {
                  "Fn::Sub": "${FileAssetsBucket.Arn}"
                },
                {
                  "Fn::Sub": "${FileAssetsBucket.Arn}/*"
                }
              ]
            },
            {
              "Action": [
                "kms:Decrypt",    "kms:DescribeKey",     "kms:Encrypt",
                "kms:ReEncrypt*", "kms:GenerateDataKey*"
              ],
              "Effect": "Allow",
              "Resource": {
                "Fn::Sub": "${FileAssetsBucketEncryptionKey.Arn}"
              }
            },
            {
              "Action": [
                "ecr:PutImage",        "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart", "ecr:CompleteLayerUpload"
              ],
              "Resource": {
                "Fn::Sub": "${ContainerAssetsRepository.Arn}"
              }
            }
          ],
          "Version": "2012-10-17"
        },
        "Roles": [{
          "Ref": "PublishingRole"
        }],
        "PolicyName": "cdk-bootstrap-hnb659fds-publishing-role-default-policy-${AWS::AccountId}-${AWS::Region}"
      }
    },
    "DeploymentActionRole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "AWS": {
                  "Ref": "TrustedPrincipals"
                }
              }
            }
          ]
        },
        "Policies": [
          {
            "PolicyDocument": {
              "Statement": [
                {
                  "Action": [
                    "cloudformation:CreateChangeSet",   "cloudformation:DeleteChangeSet",
                    "cloudformation:DescribeChangeSet", "cloudformation:DescribeStacks",
                    "cloudformation:ExecuteChangeSet",
                    "s3:GetObject*",                    "s3:GetBucket*",
                    "s3:List*",                         "s3:Abort*",
                    "s3:DeleteObject*",                 "s3:PutObject*",
                    "kms:Decrypt",                      "kms:DescribeKey"
                  ],
                  "Resource": "*"
                },
                {
                  "Action": "iam:PassRole",
                  "Resource": {
                    "Fn::Sub": "${CloudformationExecutionRole.Arn}"
                  }
                }
              ],
              "Version": "2012-10-17"
            },
            "PolicyName": "default"
          }
        ],
        "RoleName": {
          "Fn::Sub": "cdk-bootstrap-hnb659fds-deployment-action-role-${AWS::AccountId}-${AWS::Region}"
        },
        "Condition": "HasTrustedPrincipals"
      }
    },
    "CloudformationExecutionRole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "Service": "cloudformation.amazonaws.com"
              }
            }
          ]
        },
        "ManagedPolicyArns": {
          "Ref": "CloudFormationExecutionPolicies"
        },
        "RoleName": {
          "Fn::Sub": "cdk-bootstrap-hnb659fds-cloudformation-execution-role-${AWS::AccountId}-${AWS::Region}"
        },
        "Condition": "HasTrustedPrincipals"
      }
    }
  },
  "Outputs": {
    "BucketName": {
      "Description": "The name of the S3 bucket owned by the CDK toolkit stack",
      "Value": { "Fn::Sub":  "${FileAssetsBucket.Arn}" },
      "Export": {
        "Name": { "Fn::Sub": "${AWS::StackName}:BucketName" }
      }
    },
    "BucketDomainName": {
      "Description": "The domain name of the S3 bucket owned by the CDK toolkit stack",
      "Value": { "Fn::Sub":  "${FileAssetsBucket.RegionalDomainName}" },
      "Export": {
        "Name": { "Fn::Sub": "${AWS::StackName}:BucketDomainName" }
      }
    },
    "BootstrapVersion": {
      "Description": "The version of the bootstrap resources that are currently mastered in this stack",
      "Value": "1",
      "Export": {
        "Name": { "Fn::Sub": "AwsCdkBootstrapVersion" }
      }
    }
  }
}
```
