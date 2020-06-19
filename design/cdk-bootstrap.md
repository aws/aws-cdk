# `cdk bootstrap`

`cdk bootstrap` is a tool in the AWS CDK command-line interface responsible for populating a given environment
(that is, a combination of AWS account and region)
with resources required by the CDK to perform deployments into that environment.

This document is a design for extending the capabilities of the `bootstrap` command motivated by the needs of the
["Continuous delivery for CDK apps"](https://github.com/aws/aws-cdk/pull/3437) epic.

## Required changes

### `--trust`

We will add a new, optional command-line flag called `--trust` to the `bootstrap` command.
Its value is a list of AWS account IDs:

```shell
$ cdk bootstrap \
    [--trust accountId[,otherAccountId]...] \
    [--cloudformation-execution-policies policyArn[,otherPolicyArn]...] \
    aws://account/region
```

**Note**: if a user wants to add new trusted account(s) to an existing bootstrap stack,
they have to specify all of the accounts they want to trust in the `--trust` option,
not only the one being newly added -
otherwise, the previously trusted account(s) will be removed.
We should make sure to make that explicit in the documentation of this option.

We will also add a another option,
`--cloudformation-execution-policies`,
that allows you to pass a list of managed policy ARNs on the command line to attach to the
**CloudFormation Execution Role**.
This option will be required if `--trust` was passed.

### Bootstrap resources

The `bootstrap` command creates a CloudFormation stack in the environment passed on the command line.
Currently, the only resource in that stack is:

* An S3 bucket that holds the file assets and the resulting CloudFormation template to deploy.

We will add the following resources to the bootstrap stack:

* An ECR repository that stores the images that are the results of building Docker assets.

* An IAM role, called the **Publishing role**,
  that has permissions to write to both the S3 bucket and the ECR repository from above.
  This role will be assumable by any principal from the account(s) passed by the `--trust` option,
  and from any principal in the target environment's account.

* An IAM role, called the **Deployment Action Role**,
  that will be assumed when executing the CloudFormation deployment actions
  (CreateChangeSet and ExecuteChangeSet).
  It is also assumable by any principal from the account(s) passed by the `--trust` option,
  and from any principal in the target environment's account.

* An IAM role, called the **CloudFormation Execution Role**,
  that will be used to perform the actual CFN stack deployment in the continuous delivery pipeline to this environment.
  It is assumable *only* by the CloudFormation service principal
  (this is for security reasons, as this role will have, necessarily, very wide permissions).
  It will not have any inline policies,
  but will instead have the Managed Policies attached that the user passed in the
  `--cloudformation-execution-policies` option.

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

### CLI options in detail

#### Existing kept options

These options are inherited from the current CLI experience,
and need to be kept for backwards compatibility reasons:

* `--profile`: use the given local AWS credentials profile when interacting with the target environment.

* `--toolkit-stack-name`: allows you to explicitly name the CloudFormation bootstrap stack
  (instead of relying on the default naming scheme).

* `--tags` / `-t`: a list of key=value pairs to add as tags to add to the bootstrap stack.

* `--toolkit-bucket-name` / `--bootstrap-bucket-name` / `-b`: allows you to explicitly name the file assets S3 bucket
  (instead of relying on the default naming scheme).

* `--bootstrap-kms-key-id`: optional identifier of the KMS key used for encrypting the file assets S3 bucket.

* `--public-access-block-configuration`: allows you to explicitly enable or disable public access bucket block configuration
  on the file assets S3 Bucket (enabled by default).

#### New options

These options will be added to the `bootstrap` command:

* `--trust`: allows specifying an AWS account ID, or a list of them,
  that the created roles (see above) should be assumable from.
  This will be required to be passed as the pipeline account,
  for deployment from a Continuous Delivery CDK pipeline to work.

* `--cloudformation-execution-policies`: allows specifying the ManagedPolicy ARN(s)
  that should be attached to the **CloudFormation Execution Role**.
  This option is required if `--trust` was passed.

## Bootstrap resources version

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

## Backwards compatibility

This section outlines how does the backwards compatibility with the existing `cdk bootstrap` functionality work.
In the below template, "old" means the current behavior,
and "new" means "a version released including the changes needed for the CI/CD story".

The particular components are:

* CLI: the version of the `aws-cdk` package used to invoke various CDK commands,
  like `synth` and `deploy`.
* Framework: the version of the CDK libraries that the CDK application uses.
* Bootstrap: the version of the bootstrap stack that is installed in the target environment.
* Init template: the version of the `aws-cdk` package that was used to run the `cdk init` command
  that generated the current CDK application.

Let's go through each of the scenarios:

### CLI: old, framework: old, bootstrap: old, init template: old

This is the current situation
(before any of the changes needed for "CI/CD for CDK apps" are implemented).

### CLI: old, framework: old, bootstrap: old, init template: new

The new template will differ from the old one in only one aspect:
it will contain a setting in the `cdk.json` file that activates the new assets behavior,
using our [feature flags](./feature-flags.md) functionality.

The old code will simply ignore this setting
(as it doesn't have any knowledge of it),
so everything should work exactly as it does currently.

### CLI: old, framework: old, bootstrap: new, init template: old

To make this scenario work, we will need the outputs in the new bootstrap template to be preserved,
with exactly the same names as in the old bootstrap template.
The current [code reads them using the CFN API](https://github.com/aws/aws-cdk/blob/45f0e02735f6e12becccc606447607c2dda9c3a5/packages/aws-cdk/lib/api/toolkit-info.ts#L220-L233),
so the specific names of the bucket are immaterial
(it doesn't matter that the new bootstrap template uses physical names).

The one danger I see here is that,
if we want to always add the KMS key to the new bootstrap resources,
the role putting assets into the bucket needs permissions to the used key,
which wasn't true before.

### CLI: old, framework: new, bootstrap: old, init template: old

In this scenario, because the feature flag in the init template is not set,
the framework should use the current assets behavior
(use parameters instead of hard-coding the paths),
and so the old bootstrapping is fine.

### CLI: new, framework: old, bootstrap: old, init template: old

In this scenario, the CLI should auto-detect that it's running with an old version of the framework,
and use the current assets behavior
(use parameters instead of hard-coding the paths),
and so the old bootstrapping is fine.

### CLI: old, framework: old, bootstrap: new, init template: new

This is similar to the "old, old, new, old" scenario above -
to make it work, we need to preserve the outputs from the old bootstrap template in the new bootstrap template.

The flag set in `cdk.json` by the init template will be ignored by the old code,
so the asset behavior will be unchanged.

### CLI: old, framework: new, bootstrap: old, init template: new

This is a tricky one.
I believe in this case, we need to error out in the framework,
and prompt the user to update their CLI version,
as it won't be able to handle the new asset behavior
(which will be triggered by the flag set in `cdk.json` by the new init template).

### CLI: new, framework: old, bootstrap: old, init template: new

This is similar to the "new, old, old, old" scenario -
the CLI should detect it's running with an old version of the framework,
and use the current assets behavior.

### CLI: old, framework: new, bootstrap: new, init template: old

Since the flag in `cdk.json` is not set by the old init template,
the asset behavior is the same as the current one,
so as long as the new bootstrap template preserves the outputs,
everything should work like it does now.

### CLI: new, framework: new, bootstrap: old, init template: old

Since the flag in `cdk.json` is not set by the old init template,
the asset behavior is the same as the current one,
so the old bootstrapping is fine.

### CLI: old, framework: new, bootstrap: new, init template: new

This is similar to the "old, new, old, new" scenario above:
we need to error out in the framework,
and prompt the user to update their CLI version,
as it won't be able to handle the new asset behavior
(which will be triggered by the flag set in `cdk.json` by the new init template).

### CLI: new, framework: old, bootstrap: new, init template: new

This is similar to the "new, old, old, old" scenario -
the CLI should detect it's running with an old version of the framework,
and use the current assets behavior.
Bootstrapping needs to preserve the outputs of the stack in order to support this scenario.

### CLI: new, framework: new, bootstrap: old, init template: new

This is an interesting case.
At `synth` time, the template will be invalid:
pointing to S3 paths that don't exist
(because of the old bootstrap stack).
However, when any command that has AWS credentials runs
(like `cdk deploy`, or `cdk publish`),
it should do a verification using the `AwsCdkBootstrapVersion` export described above,
and fail, telling the customer to run `cdk bootstrap` again.

We can also do deeper checks: for example,
we can verify that the bucket the file assets point to actually exists.
If it doesn't, it's probable that the name was overridden in either the stack definition,
or during bootstrapping - and it needs to be done in both of those places to work,
so we can display a helpful error message to the user.

### CLI: new, framework: new, bootstrap: new, init template: old

Pretty much identical to the "old, new, new, old" scenario above
(since the flag in `cdk.json` is not set by the old init template,
the asset behavior is the same as the current one,
so as long as the new bootstrap template preserves the outputs,
everything should work like it does now).

### CLI: new, framework: new, bootstrap: new, init template: new

The desired final state.

## Updating the existing bootstrap stack

As all current CDK customers already have a bootstrap stack defined,
we have to make sure that running the `cdk bootstrap` command in the new version works correctly for that case
(and not only for the case when the bootstrap stack didn't exist in a given environment).

We already saw that, to preserve backwards compatibility in many cases,
we need to use the same stack name in the new bootstrapping as in the old one.
Which means running `cdk bootstrap` will result in a CFN stack update.

The tricky part is the existing assets bucket.
Non-empty buckets cannot be removed by CloudFormation,
so if we don't have a resource with that logical ID in the template,
CloudFormation will try to remove it, and fail -
so, the entire bootstrap command will fail!

To combat that, I think we have to give the S3 assets bucket in the new template the same logical ID as in the old one.
We will set its `UpdateReplacePolicy` to `Retain`,
so that assigning it our custom physical name will leave the old one orphaned.
This should make sure the CFN update succeeds.

## Bootstrap template

The bootstrap template used by the CLI command can be found in the
[aws-cdk package](../packages/aws-cdk/lib/api/bootstrap/bootstrap-template.yaml).
