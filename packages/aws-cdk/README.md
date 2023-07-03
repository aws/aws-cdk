# AWS CDK Toolkit
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

The AWS CDK Toolkit provides the `cdk` command-line interface that can be used to work with AWS CDK applications.

Command                               | Description
--------------------------------------|---------------------------------------------------------------------------------
[`cdk docs`](#cdk-docs)               | Access the online documentation
[`cdk init`](#cdk-init)               | Start a new CDK project (app or library)
[`cdk list`](#cdk-list)               | List stacks in an application
[`cdk synth`](#cdk-synthesize)        | Synthesize a CDK app to CloudFormation template(s)
[`cdk diff`](#cdk-diff)               | Diff stacks against current state
[`cdk deploy`](#cdk-deploy)           | Deploy a stack into an AWS account
[`cdk import`](#cdk-import)           | Import existing AWS resources into a CDK stack
[`cdk watch`](#cdk-watch)             | Watches a CDK app for deployable and hotswappable changes
[`cdk destroy`](#cdk-destroy)         | Deletes a stack from an AWS account
[`cdk bootstrap`](#cdk-bootstrap)     | Deploy a toolkit stack to support deploying large stacks & artifacts
[`cdk doctor`](#cdk-doctor)           | Inspect the environment and produce information useful for troubleshooting
[`cdk acknowledge`](#cdk-acknowledge) | Acknowledge (and hide) a notice by issue number
[`cdk notices`](#cdk-notices)         | List all relevant notices for the application

- [Bundling](#bundling)
- [MFA Support](#mfa-support)
- [SSO Support](#sso-support)
- [Configuration](#configuration)
  - [Running in CI](#running-in-ci)


This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Commands

### `cdk docs`

Outputs the URL to the documentation for the current toolkit version, and attempts to open a browser to that URL.

```console
$ # Open the documentation in the default browser (using 'open')
$ cdk docs
https://docs.aws.amazon.com/cdk/api/latest/

$ # Open the documentation in Chrome.
$ cdk docs --browser='chrome %u'
https://docs.aws.amazon.com/cdk/api/latest/
```

### `cdk init`

Creates a new CDK project.

```console
$ # List the available template types & languages
$ cdk init --list
Available templates:
* app: Template for a CDK Application
   └─ cdk init app --language=[csharp|fsharp|java|javascript|python|typescript]
* lib: Template for a CDK Construct Library
   └─ cdk init lib --language=typescript
* sample-app: Example CDK Application with some constructs
   └─ cdk init sample-app --language=[csharp|fsharp|java|javascript|python|typescript]

$ # Create a new library application in typescript
$ cdk init lib --language=typescript
```

### `cdk list`

Lists the stacks modeled in the CDK app.

```console
$ # List all stacks in the CDK app 'node bin/main.js'
$ cdk list --app='node bin/main.js'
Foo
Bar
Baz

$ # List all stack including all details (add --json to output JSON instead of YAML)
$ cdk list --app='node bin/main.js' --long
-
    name: Foo
    environment:
        name: 000000000000/bermuda-triangle-1
        account: '000000000000'
        region: bermuda-triangle-1
-
    name: Bar
    environment:
        name: 111111111111/bermuda-triangle-2
        account: '111111111111'
        region: bermuda-triangle-2
-
    name: Baz
    environment:
        name: 333333333333/bermuda-triangle-3
        account: '333333333333'
        region: bermuda-triangle-3
```

### `cdk synthesize`

Synthesizes the CDK app and produces a cloud assembly to a designated output (defaults to `cdk.out`)

Typically you don't interact directly with cloud assemblies. They are files that include everything
needed to deploy your app to a cloud environment. For example, it includes an AWS CloudFormation
template for each stack in your app, and a copy of any file assets or Docker images that you reference
in your app.

If your app contains a single stack or a stack is supplied as an argument to `cdk synth`, the CloudFormation template will also be displayed in the standard output (STDOUT) as `YAML`.

If there are multiple stacks in your application, `cdk synth` will synthesize the cloud assembly to `cdk.out`.

```console
$ # Synthesize cloud assembly for StackName and output the CloudFormation template to STDOUT
$ cdk synth MyStackName

$ # Synthesize cloud assembly for all the stacks and save them into cdk.out/
$ cdk synth

$ # Synthesize cloud assembly for StackName, but don't include dependencies
$ cdk synth MyStackName --exclusively

$ # Synthesize cloud assembly for StackName, but don't cloudFormation template output to STDOUT
$ cdk synth MyStackName --quiet
```

The `quiet` option can be set in the `cdk.json` file.

```json
{
  "quiet": true
}
```

See the [AWS Documentation](https://docs.aws.amazon.com/cdk/latest/guide/apps.html#apps_cloud_assembly) to learn more about cloud assemblies.
See the [CDK reference documentation](https://docs.aws.amazon.com/cdk/api/latest/docs/cloud-assembly-schema-readme.html) for details on the cloud assembly specification


### `cdk diff`

Computes differences between the infrastructure specified in the current state of the CDK app and the currently
deployed application (or a user-specified CloudFormation template). If you need the command to return a non-zero if any differences are
found you need to use the `--fail` command line option.

```console
$ # Diff against the currently deployed stack
$ cdk diff --app='node bin/main.js' MyStackName

$ # Diff against a specific template document
$ cdk diff --app='node bin/main.js' MyStackName --template=path/to/template.yml
```

### `cdk deploy`

Deploys a stack of your CDK app to its environment. During the deployment, the toolkit will output progress
indications, similar to what can be observed in the AWS CloudFormation Console. If the environment was never
bootstrapped (using `cdk bootstrap`), only stacks that are not using assets and synthesize to a template that is under
51,200 bytes will successfully deploy.

```console
$ cdk deploy --app='node bin/main.js' MyStackName
```

Before creating a change set, `cdk deploy` will compare the template and tags of the
currently deployed stack to the template and tags that are about to be deployed and
will skip deployment if they are identical. Use `--force` to override this behavior
and always deploy the stack.

#### Disabling Rollback

If a resource fails to be created or updated, the deployment will *roll back* before the CLI returns. All changes made
up to that point will be undone (resources that were created will be deleted, updates that were made will be changed
back) in order to leave the stack in a consistent state at the end of the operation. If you are using the CDK CLI
to iterate on a development stack in your personal account, you might not require CloudFormation to leave your
stack in a consistent state, but instead would prefer to update your CDK application and try again.

To disable the rollback feature, specify `--no-rollback` (`-R` for short):

```console
$ cdk deploy --no-rollback
$ cdk deploy -R
```

NOTE: you cannot use `--no-rollback` for any updates that would cause a resource replacement, only for updates
and creations of new resources.

#### Deploying multiple stacks

You can have multiple stacks in a cdk app. An example can be found in [how to create multiple stacks](https://docs.aws.amazon.com/cdk/latest/guide/stack_how_to_create_multiple_stacks.html).

In order to deploy them, you can list the stacks you want to deploy. If your application contains pipeline stacks, the `cdk list` command will show stack names as paths, showing where they are in the pipeline hierarchy (e.g., `PipelineStack`, `PipelineStack/Prod`, `PipelineStack/Prod/MyService` etc).

If you want to deploy all of them, you can use the flag `--all` or the wildcard `*` to deploy all stacks in an app. Please note that, if you have a hierarchy of stacks as described above, `--all` and `*` will only match the stacks on the top level. If you want to match all the stacks in the hierarchy, use `**`. You can also combine these patterns. For example, if you want to deploy all stacks in the `Prod` stage, you can use `cdk deploy PipelineStack/Prod/**`.

`--concurrency N` allows deploying multiple stacks in parallel while respecting inter-stack dependencies to speed up deployments. It does not protect against CloudFormation and other AWS account rate limiting.

#### Parameters

Pass parameters to your template during deployment by using `--parameters
(STACK:KEY=VALUE)`. This will apply the value `VALUE` to the key `KEY` for stack `STACK`.

Example of providing an attribute value for an SNS Topic through a parameter in TypeScript:

Usage of parameter in CDK Stack:

```ts
new sns.Topic(this, 'TopicParameter', {
    topicName: new cdk.CfnParameter(this, 'TopicNameParam').value.toString()
});
```

Parameter values as a part of `cdk deploy`

```console
$ cdk deploy --parameters "MyStackName:TopicNameParam=parameterized"
```

Parameter values can be overwritten by supplying the `--force` flag.
Example of overwriting the topic name from a previous deployment.

```console
$ cdk deploy --parameters "ParametersStack:TopicNameParam=blahagain" --force
```

⚠️ Parameters will be applied to all stacks if a stack name is not specified or `*` is provided.
Parameters provided to Stacks that do not make use of the parameter will not successfully deploy.

⚠️ Parameters do not propagate to NestedStacks. These must be sent with the constructor.
See Nested Stack [documentation](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-cloudformation.NestedStack.html)

#### Outputs

Write stack outputs from deployments into a file. When your stack finishes deploying, all stack outputs
will be written to the output file as JSON.

Usage of output in a CDK stack

```ts
const fn = new lambda.Function(this, "fn", {
  handler: "index.handler",
  code: lambda.Code.fromInline(`exports.handler = \${handler.toString()}`),
  runtime: lambda.Runtime.NODEJS_14_X
});

new cdk.CfnOutput(this, 'FunctionArn', {
  value: fn.functionArn,
});
```

Specify an outputs file to write to by supplying the `--outputs-file` parameter

```console
$ cdk deploy --outputs-file outputs.json
```

Alternatively, the `outputsFile` key can be specified in the project config (`cdk.json`).

The following shows a sample `cdk.json` where the `outputsFile` key is set to *outputs.json*.

```json
{
  "app": "npx ts-node bin/myproject.ts",
  "context": {
    "@aws-cdk/core:enableStackNameDuplicates": "true",
    "aws-cdk:enableDiffNoFail": "true",
    "@aws-cdk/core:stackRelativeExports": "true"
  },
  "outputsFile": "outputs.json"
}
```

The `outputsFile` key can also be specified as a user setting (`~/.cdk.json`)

When the stack finishes deployment, `outputs.json` would look like this:

```json
{
  "MyStack": {
    "FunctionArn": "arn:aws:lambda:us-east-1:123456789012:function:MyStack-fn5FF616E3-G632ITHSP5HK"
  }
}
```

⚠️ The `key` of the outputs corresponds to the logical ID of the `CfnOutput`.
Read more about identifiers in the CDK [here](https://docs.aws.amazon.com/cdk/latest/guide/identifiers.html)

If multiple stacks are being deployed or the wild card `*` is used to deploy all stacks, all outputs
are written to the same output file where each stack artifact ID is a key in the JSON file


```console
$ cdk deploy '**' --outputs-file "/Users/code/myproject/outputs.json"
```

Example `outputs.json` after deployment of multiple stacks

```json
{
  "MyStack": {
    "FunctionArn": "arn:aws:lambda:us-east-1:123456789012:function:MyStack-fn5FF616E3-G632ITHSP5HK"
  },
  "AnotherStack": {
    "VPCId": "vpc-z0mg270fee16693f"
  }
}
```

#### Deployment Progress

By default, stack deployment events are displayed as a progress bar with the events for the resource
currently being deployed.

Set the `--progress` flag to request the complete history which includes all CloudFormation events

```console
$ cdk deploy --progress events
```

Alternatively, the `progress` key can be specified in the project config (`cdk.json`).

The following shows a sample `cdk.json` where the `progress` key is set to *events*.
When `cdk deploy` is executed, deployment events will include the complete history.

```json
{
  "app": "npx ts-node bin/myproject.ts",
  "context": {
    "@aws-cdk/core:enableStackNameDuplicates": "true",
    "aws-cdk:enableDiffNoFail": "true",
    "@aws-cdk/core:stackRelativeExports": "true"
  },
  "progress": "events"
}
```

The `progress` key can also be specified as a user setting (`~/.cdk.json`)

#### CloudFormation Change Sets vs direct stack updates

By default, CDK creates a CloudFormation change set with the changes that will
be deployed and then executes it. This behavior can be controlled with the
`--method` parameter:

- `--method=change-set` (default): create and execute the change set.
- `--method=prepare-change-set`: create the change set but don't execute it.
  This is useful if you have external tools that will inspect the change set or
  you have an approval process for change sets.
- `--method=direct`: do not create a change set but apply the change immediately.
  This is typically a bit faster than creating a change set, but it loses
  the progress information.

To deploy faster without using change sets:

```console
$ cdk deploy --method=direct
```

If a change set is created, it will be called *cdk-deploy-change-set*, and a
previous change set with that name will be overwritten. The change set will
always be created, even if it is empty. A name can also be given to the change
set to make it easier to later execute:

```console
$ cdk deploy --method=prepare-change-set --change-set-name MyChangeSetName
```

For more control over when stack changes are deployed, the CDK can generate a
CloudFormation change set but not execute it.

#### Hotswap deployments for faster development

You can pass the `--hotswap` flag to the `deploy` command:

```console
$ cdk deploy --hotswap [StackNames]
```

This will attempt to perform a faster, short-circuit deployment if possible
(for example, if you changed the code of a Lambda function in your CDK app),
skipping CloudFormation, and updating the affected resources directly;
this includes changes to resources in nested stacks.
If the tool detects that the change does not support hotswapping,
it will ignore it and display that ignored change.
To have hotswap fall back and perform a full CloudFormation deployment,
exactly like `cdk deploy` does without the `--hotswap` flag,
specify `--hotswap-fallback`, like so:

```console
$ cdk deploy --hotswap-fallback [StackNames]
```

Passing either option to `cdk deploy` will make it use your current AWS credentials to perform the API calls -
it will not assume the Roles from your bootstrap stack,
even if the `@aws-cdk/core:newStyleStackSynthesis` feature flag is set to `true`
(as those Roles do not have the necessary permissions to update AWS resources directly, without using CloudFormation).
For that reason, make sure that your credentials are for the same AWS account that the Stack(s)
you are performing the hotswap deployment for belong to,
and that you have the necessary IAM permissions to update the resources that are being deployed.

Hotswapping is currently supported for the following changes
(additional changes will be supported in the future):

- Code asset (including Docker image and inline code), tag changes, and configuration changes (only
  description and environment variables are supported) of AWS Lambda functions.
- AWS Lambda Versions and Aliases changes.
- Definition changes of AWS Step Functions State Machines.
- Container asset changes of AWS ECS Services.
- Website asset changes of AWS S3 Bucket Deployments.
- Source and Environment changes of AWS CodeBuild Projects.
- VTL mapping template changes for AppSync Resolvers and Functions

**⚠ Note #1**: This command deliberately introduces drift in CloudFormation stacks in order to speed up deployments.
For this reason, only use it for development purposes.
**Never use this flag for your production deployments**!

**⚠ Note #2**: This command is considered experimental,
and might have breaking changes in the future.

**⚠ Note #3**: Expected defaults for certain parameters may be different with the hotswap parameter. For example, an ECS service's minimum healthy percentage will currently be set to 0. Please review the source accordingly if this occurs. 

### `cdk watch`

The `watch` command is similar to `deploy`,
but instead of being a one-shot operation,
the command continuously monitors the files of the project,
and triggers a deployment whenever it detects any changes:

```console
$ cdk watch DevelopmentStack
Detected change to 'lambda-code/index.js' (type: change). Triggering 'cdk deploy'
DevelopmentStack: deploying...

 ✅  DevelopmentStack

^C
```

To end a `cdk watch` session, interrupt the process by pressing Ctrl+C.

What files are observed is determined by the `"watch"` setting in your `cdk.json` file.
It has two sub-keys, `"include"` and `"exclude"`, each of which can be either a single string, or an array of strings.
Each entry is interpreted as a path relative to the location of the `cdk.json` file.
Globs, both `*` and `**`, are allowed to be used.
Example:

```json
{
  "app": "mvn -e -q compile exec:java",
  "watch": {
    "include": "src/main/**",
    "exclude": "target/*"
  }
}
```

The default for `"include"` is `"**/*"`
(which means all files and directories in the root of the project),
and `"exclude"` is optional
(note that we always ignore files and directories starting with `.`,
the CDK output directory, and the `node_modules` directory),
so the minimal settings to enable `watch` are `"watch": {}`.

If either your CDK code, or application code, needs a build step before being deployed,
`watch` works with the `"build"` key in the `cdk.json` file,
for example:

```json
{
  "app": "mvn -e -q exec:java",
  "build": "mvn package",
  "watch": {
    "include": "src/main/**",
    "exclude": "target/*"
  }
}
```

Note that `watch` by default uses hotswap deployments (see above for details) --
to turn them off, pass the `--no-hotswap` option when invoking it.

By default `watch` will also monitor all CloudWatch Log Groups in your application and stream the log events
locally to your terminal. To disable this feature you can pass the `--no-logs` option when invoking it:

```console
$ cdk watch --no-logs
```

You can increase the concurrency by which `watch` will deploy and hotswap
your stacks by specifying `--concurrency N`. `--concurrency` for `watch`
acts the same as `--concurrency` for `deploy`, in that it will deploy or
hotswap your stacks while respecting inter-stack dependencies.

```console
$ cdk watch --concurrency 5
```

**Note**: This command is considered experimental, and might have breaking changes in the future.
The same limitations apply to to `watch` deployments as do to `--hotswap` deployments. See the
*Hotswap deployments for faster development* section for more information.

### `cdk import`

Sometimes you want to import AWS resources that were created using other means
into a CDK stack. For some resources (like Roles, Lambda Functions, Event Rules,
...), it's feasible to create new versions in CDK and then delete the old
versions. For other resources, this is not possible: stateful resources like S3
Buckets, DynamoDB tables, etc., cannot be easily deleted without impact on the
service.

`cdk import`, which uses [CloudFormation resource
imports](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resource-import.html),
makes it possible to bring an existing resource under CDK/CloudFormation's
management. See the [list of resources that can be imported here](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resource-import-supported-resources.html).

To import an existing resource to a CDK stack, follow the following steps:

1. Run a `cdk diff` to make sure there are no pending changes to the CDK stack you want to
   import resources into. The only changes allowed in an "import" operation are
   the addition of new resources which you want to import.
2. Add constructs for the resources you want to import to your Stack (for example,
   for an S3 bucket, add something like `new s3.Bucket(this, 'ImportedS3Bucket', {});`).
   **Do not add any other changes!** You must also make sure to exactly model the state
   that the resource currently has. For the example of the Bucket, be sure to
   include KMS keys, life cycle policies, and anything else that's relevant
   about the bucket. If you do not, subsequent update operations may not do what
   you expect.
3. Run the `cdk import` - if there are multiple stacks in the CDK app, pass a specific
   stack name as an argument.
4. The CLI will prompt you to pass in the actual names of the resources you are
   importing. After you supply it, the import starts.
5. When `cdk import` reports success, the resource is managed by CDK. Any subsequent
   changes in the construct configuration will be reflected on the resource.

#### Limitations

This feature is currently in preview. Be aware of the following limitations:

- Importing resources in nested stacks is not possible.
- Uses the deploy role credentials (necessary to read the encrypted staging
  bucket). Requires a new version (version 12) of the bootstrap stack, for the added
  IAM permissions to the `deploy-role`.
- There is no check on whether the properties you specify are correct and complete
  for the imported resource. Try starting a drift detection operation after importing.
- Resources that depend on other resources must all be imported together, or one-by-one
  in the right order. The CLI will not help you import dependent resources in the right
  order, the CloudFormation deployment will fail with unresolved references.

### `cdk destroy`

Deletes a stack from it's environment. This will cause the resources in the stack to be destroyed (unless they were
configured with a `DeletionPolicy` of `Retain`). During the stack destruction, the command will output progress
information similar to what `cdk deploy` provides.

```console
$ cdk destroy --app='node bin/main.js' MyStackName
```

### `cdk bootstrap`

Deploys a `CDKToolkit` CloudFormation stack into the specified environment(s), that provides an S3 bucket
and ECR repository that `cdk deploy` will use to store synthesized templates and the related assets, before
triggering a CloudFormation stack update. The name of the deployed stack can be configured using the
`--toolkit-stack-name` argument. The S3 Bucket Public Access Block Configuration can be configured using
the `--public-access-block-configuration` argument. ECR uses immutable tags for images.

```console
$ # Deploys to all environments
$ cdk bootstrap --app='node bin/main.js'

$ # Deploys only to environments foo and bar
$ cdk bootstrap --app='node bin/main.js' foo bar
```

By default, bootstrap stack will be protected from stack termination. This can be disabled using
`--termination-protection` argument.

If you have specific prerequisites not met by the example template, you can
[customize it](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html#bootstrapping-customizing)
to fit your requirements, by exporting the provided one to a file and either deploying it yourself
using CloudFormation directly, or by telling the CLI to use a custom template. That looks as follows:

```console
# Dump the built-in template to a file
$ cdk bootstrap --show-template > bootstrap-template.yaml

# Edit 'bootstrap-template.yaml' to your liking

# Tell CDK to use the customized template
$ cdk bootstrap --template bootstrap-template.yaml
```

Out of the box customization options are also available as arguments. To use a permissions boundary:

- `--example-permissions-boundary` indicates the example permissions boundary, supplied by CDK
- `--custom-permissions-boundary` specifies, by name a predefined, customer maintained, boundary

A few notes to add at this point. The CDK supplied permissions boundary policy should be regarded as
an example. Edit the content and reference the example policy if you're testing out the feature, turn
it into a new policy for actual deployments (if one does not already exist). The concern here is drift
as, most likely, a permissions boundary is maintained and has dedicated conventions, naming included.

For more information on configuring permissions, including using permissions
boundaries see the [Security And Safety Dev Guide](https://github.com/aws/aws-cdk/wiki/Security-And-Safety-Dev-Guide)

Once a bootstrap template has been deployed with a set of parameters, you must
use the `--no-previous-parameters` CLI flag to change any of these parameters on
future deployments. 

> **Note** Please note that when you use this flag, you must resupply
>*all* previously supplied parameters.

For example if you bootstrap with a custom permissions boundary

```console
cdk bootstrap --custom-permissions-boundary my-permissions-boundary
```

In order to remove that permissions boundary you have to specify the
`--no-previous-parameters` option.

```console
cdk bootstrap --no-previous-parameters
```

### `cdk doctor`

Inspect the current command-line environment and configurations, and collect information that can be useful for
troubleshooting problems. It is usually a good idea to include the information provided by this command when submitting
a bug report.

```console
$ cdk doctor
ℹ️ CDK Version: 1.0.0 (build e64993a)
ℹ️ AWS environment variables:
  - AWS_EC2_METADATA_DISABLED = 1
  - AWS_SDK_LOAD_CONFIG = 1
```

## Notices

CDK Notices are important messages regarding security vulnerabilities, regressions, and usage of unsupported
versions. Relevant notices appear on every command by default. For example,

```console
$ cdk deploy

... # Normal output of the command

NOTICES

16603   Toggling off auto_delete_objects for Bucket empties the bucket

        Overview: If a stack is deployed with an S3 bucket with
                  auto_delete_objects=True, and then re-deployed with
                  auto_delete_objects=False, all the objects in the bucket
                  will be deleted.

        Affected versions: <1.126.0.

        More information at: https://github.com/aws/aws-cdk/issues/16603


17061   Error when building EKS cluster with monocdk import

        Overview: When using monocdk/aws-eks to build a stack containing
                  an EKS cluster, error is thrown about missing
                  lambda-layer-node-proxy-agent/layer/package.json.

        Affected versions: >=1.126.0 <=1.130.0.

        More information at: https://github.com/aws/aws-cdk/issues/17061


If you don’t want to see an notice anymore, use "cdk acknowledge ID". For example, "cdk acknowledge 16603".
```

You can suppress warnings in a variety of ways:

- per individual execution:

  `cdk deploy --no-notices`

- disable all notices indefinitely through context in `cdk.json`:

  ```json
  {
    "notices": false,
    "context": {
      ...
    }
  }
  ```

- acknowledging individual notices via `cdk acknowledge` (see below).

### `cdk acknowledge`

To hide a particular notice that has been addressed or does not apply, call `cdk acknowledge` with the ID of
the notice:

```console
$cdk acknowledge 16603
```

> Please note that the acknowledgements are made project by project. If you acknowledge an notice in one CDK
> project, it will still appear on other projects when you run any CDK commands, unless you have suppressed
> or disabled notices.


### `cdk notices`

List the notices that are relevant to the current CDK repository, regardless of context flags or notices that
have been acknowledged:

```console
$ cdk notices

NOTICES

16603   Toggling off auto_delete_objects for Bucket empties the bucket

        Overview: if a stack is deployed with an S3 bucket with
                  auto_delete_objects=True, and then re-deployed with
                  auto_delete_objects=False, all the objects in the bucket
                  will be deleted.

        Affected versions: framework: <=2.15.0 >=2.10.0

        More information at: https://github.com/aws/aws-cdk/issues/16603


If you don’t want to see a notice anymore, use "cdk acknowledge <id>". For example, "cdk acknowledge 16603".
```

### Bundling

By default asset bundling is skipped for `cdk list` and `cdk destroy`. For `cdk deploy`, `cdk diff`
and `cdk synthesize` the default is to bundle assets for all stacks unless `exclusively` is specified.
In this case, only the listed stacks will have their assets bundled.

## MFA support

If `mfa_serial` is found in the active profile of the shared ini file AWS CDK
will ask for token defined in the `mfa_serial`. This token will be provided to STS assume role call.

Example profile in `~/.aws/config` where `mfa_serial` is used to assume role:

```ini
[profile my_assume_role_profile]
source_profile=my_source_role
role_arn=arn:aws:iam::123456789123:role/role_to_be_assumed
mfa_serial=arn:aws:iam::123456789123:mfa/my_user
```

## SSO support

If you create an SSO profile with `aws configure sso` and run `aws sso login`, the CDK can use those credentials
if you set the profile name as the value of `AWS_PROFILE` or pass it to `--profile`.

## Configuration

On top of passing configuration through command-line arguments, it is possible to use JSON configuration files. The
configuration's order of precedence is:

1. Command-line arguments
2. Project configuration (`./cdk.json`)
3. User configuration (`~/.cdk.json`)

### JSON Configuration files

Some of the interesting keys that can be used in the JSON configuration files:

```json5
{
    "app": "node bin/main.js",        // Command to start the CDK app      (--app='node bin/main.js')
    "build": "mvn package",           // Specify pre-synth build           (--build='mvn package')
    "context": {                      // Context entries                   (--context=key=value)
        "key": "value"
    },
    "toolkitStackName": "foo",        // Customize 'bootstrap' stack name  (--toolkit-stack-name=foo)
    "toolkitBucket": {
        "bucketName": "fooBucket",    // Customize 'bootstrap' bucket name (--toolkit-bucket-name=fooBucket)
        "kmsKeyId": "fooKMSKey"       // Customize 'bootstrap' KMS key id  (--bootstrap-kms-key-id=fooKMSKey)
    },
    "versionReporting": false,        // Opt-out of version reporting      (--no-version-reporting)
}
```

If specified, the command in the `build` key will be executed immediately before synthesis.
This can be used to build Lambda Functions, CDK Application code, or other assets.
`build` cannot be specified on the command line or in the User configuration,
and must be specified in the Project configuration. The command specified
in `build` will be executed by the "watch" process before deployment.

### Environment

The following environment variables affect aws-cdk:

- `CDK_DISABLE_VERSION_CHECK`: If set, disable automatic check for newer versions.
- `CDK_NEW_BOOTSTRAP`: use the modern bootstrapping stack.

### Running in CI

The CLI will attempt to detect whether it is being run in CI by looking for the presence of an
environment variable `CI=true`. This can be forced by passing the `--ci` flag. By default the CLI
sends most of its logs to `stderr`, but when `ci=true` it will send the logs to `stdout` instead.

### Changing the default TypeScript transpiler

The ts-node package used to synthesize and deploy CDK apps supports an alternate transpiler that might improve transpile times. The SWC transpiler is written in Rust and has no type checking. The SWC transpiler should be enabled by experienced TypeScript developers.

To enable the SWC transpiler, install the package in the CDK app.

```sh
npm i -D @swc/core @swc/helpers regenerator-runtime
```

And, update the `tsconfig.json` file to add the `ts-node` property.

```json
{
  "ts-node": {
    "swc": true
  }
}
```

The documentation may be found at <https://typestrong.org/ts-node/docs/swc/>
