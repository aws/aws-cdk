# AWS CDK Toolkit
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

The AWS CDK Toolkit provides the `cdk` command-line interface that can be used to work with AWS CDK applications.

| Command                               | Description                                                                        |
| ------------------------------------- | ---------------------------------------------------------------------------------- |
| [`cdk docs`](#cdk-docs)               | Access the online documentation                                                    |
| [`cdk init`](#cdk-init)               | Start a new CDK project (app or library)                                           |
| [`cdk list`](#cdk-list)               | List stacks and their dependencies in an application                               |
| [`cdk synth`](#cdk-synthesize)        | Synthesize a CDK app to CloudFormation template(s)                                 |
| [`cdk diff`](#cdk-diff)               | Diff stacks against current state                                                  |
| [`cdk deploy`](#cdk-deploy)           | Deploy a stack into an AWS account                                                 |
| [`cdk import`](#cdk-import)           | Import existing AWS resources into a CDK stack                                     |
| [`cdk migrate`](#cdk-migrate)         | Migrate AWS resources, CloudFormation stacks, and CloudFormation templates to CDK  |
| [`cdk watch`](#cdk-watch)             | Watches a CDK app for deployable and hotswappable changes                          |
| [`cdk destroy`](#cdk-destroy)         | Deletes a stack from an AWS account                                                |
| [`cdk bootstrap`](#cdk-bootstrap)     | Deploy a toolkit stack to support deploying large stacks & artifacts               |
| [`cdk doctor`](#cdk-doctor)           | Inspect the environment and produce information useful for troubleshooting         |
| [`cdk acknowledge`](#cdk-acknowledge) | Acknowledge (and hide) a notice by issue number                                    |
| [`cdk notices`](#cdk-notices)         | List all relevant notices for the application                                      |

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

Lists the stacks and their dependencies modeled in the CDK app.

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

$ # Synthesize cloud assembly for StackName, but don't write CloudFormation template output to STDOUT
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

The `quiet` flag can also be passed to the `cdk diff` command. Assuming there are no differences detected the output to the console will **not** contain strings such as the *Stack* `MyStackName` and `There were no differences`.

```console
$ # Diff against the currently deployed stack with quiet parameter enabled
$ cdk diff --quiet --app='node bin/main.js' MyStackName
```

The `change-set` flag will make `diff` create a change set and extract resource replacement data from it. This is a bit slower, but will provide no false positives for resource replacement.
The `--no-change-set` mode will consider any change to a property that requires replacement to be a resource replacement,
even if the change is purely cosmetic (like replacing a resource reference with a hardcoded arn).

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
  runtime: lambda.Runtime.NODEJS_LATEST
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

#### Ignore No Stacks

You may have an app with multiple environments, e.g., dev and prod. When starting
development, your prod app may not have any resources or the resources are commented
out. In this scenario, you will receive an error message stating that the app has no
stacks.

To bypass this error messages, you can pass the `--ignore-no-stacks` flag to the 
`deploy` command:

```console
$ cdk deploy --ignore-no-stacks
```

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
- VTL mapping template changes for AppSync Resolvers and Functions.
- Schema changes for AppSync GraphQL Apis.

**⚠ Note #1**: This command deliberately introduces drift in CloudFormation stacks in order to speed up deployments.
For this reason, only use it for development purposes.
**Never use this flag for your production deployments**!

**⚠ Note #2**: This command is considered experimental,
and might have breaking changes in the future.

**⚠ Note #3**: Expected defaults for certain parameters may be different with the hotswap parameter. For example, an ECS service's minimum healthy percentage will currently be set to 0. Please review the source accordingly if this occurs.

**⚠ Note #4**: Only usage of certain [CloudFormation intrinsic functions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html) are supported as part of a hotswapped deployment. At time of writing, these are:

- `Ref`
- `Fn::GetAtt` *
- `Fn::ImportValue`
- `Fn::Join`
- `Fn::Select`
- `Fn::Split`
- `Fn::Sub`

> *: `Fn::GetAtt` is only partially supported. Refer to [this implementation](https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk/lib/api/evaluate-cloudformation-template.ts#L477-L492) for supported resources and attributes.

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

This feature currently has the following limitations:

- Importing resources into nested stacks is not possible.
- There is no check on whether the properties you specify are correct and complete
  for the imported resource. Try starting a drift detection operation after importing.
- Resources that depend on other resources must all be imported together, or one-by-one
  in the right order. If you do not, the CloudFormation deployment will fail
  with unresolved references.
- Uses the deploy role credentials (necessary to read the encrypted staging
  bucket). Requires version 12 of the bootstrap stack, for the added
  IAM permissions to the `deploy-role`.


### `cdk migrate`

⚠️**CAUTION**⚠️: CDK Migrate is currently experimental and may have breaking changes in the future. 

CDK Migrate generates a CDK app from deployed AWS resources using `--from-scan`, deployed AWS CloudFormation stacks using `--from-stack`, and local AWS CloudFormation templates using `--from-path`. 

To learn more about the CDK Migrate feature, see [Migrate to AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/migrate.html). For more information on `cdk migrate` command options, see [cdk migrate command reference](https://docs.aws.amazon.com/cdk/v2/guide/ref-cli-cdk-migrate.html).

The new CDK app will be initialized in the current working directory and will include a single stack that is named with the value you provide using `--stack-name`. The new stack, app, and directory will all use this name. To specify a different output directory, use `--output-path`. You can create the new CDK app in any CDK supported programming language using `--language`.

#### Migrate from an AWS CloudFormation stack

Migrate from a deployed AWS CloudFormation stack in a specific AWS account and AWS Region using `--from-stack`. Provide `--stack-name` to identify the name of your stack. Account and Region information are retrieved from default CDK CLI sources. Use `--account` and `--region` options to provide other values. The following is an example that migrates **myCloudFormationStack** to a new CDK app using TypeScript:

```console
$ cdk migrate --language typescript --from-stack --stack-name 'myCloudFormationStack'
```

#### Migrate from a local AWS CloudFormation template

Migrate from a local `YAML` or `JSON` AWS CloudFormation template using `--from-path`. Provide a name for the stack that will be created in your new CDK app using `--stack-name`. Account and Region information are retrieved from default CDK CLI sources. Use `--account` and `--region` options to provide other values. The following is an example that creates a new CDK app using TypeScript that includes a **myCloudFormationStack** stack from a local `template.json` file:

```console
$ cdk migrate --language typescript --from-path "./template.json" --stack-name "myCloudFormationStack"
```

#### Migrate from deployed AWS resources

Migrate from deployed AWS resources in a specific AWS account and Region that are not associated with an AWS CloudFormation stack using `--from-scan`. These would be resources that were provisioned outside of an IaC tool. CDK Migrate utilizes the IaC generator service to scan for resources and generate a template. Then, the CDK CLI references the template to create a new CDK app. To learn more about IaC generator, see [Generating templates for existing resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/generate-IaC.html).

Account and Region information are retrieved from default CDK CLI sources. Use `--account` and `--region` options to provide other values. The following is an example that creates a new CDK app using TypeScript that includes a new **myCloudFormationStack** stack from deployed resources:

```console
$ cdk migrate --language typescript --from-scan --stack-name "myCloudFormationStack"
```

Since CDK Migrate relies on the IaC generator service, any limitations of IaC generator will apply to CDK Migrate. For general limitations, see [Considerations](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/generate-IaC.html#generate-template-considerations). 

IaC generator limitations with discovering resource and property values will also apply here. As a result, CDK Migrate will only migrate resources supported by IaC generator. Some of your resources may not be supported and some property values may not be accessible. For more information, see [Iac generator and write-only properties](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/generate-IaC-write-only-properties.html) and [Supported resource types](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/generate-IaC-supported-resources.html).

You can specify filters using `--filter` to specify which resources to migrate. This is a good option to use if you are over the IaC generator total resource limit.

After migration, you must resolve any write-only properties that were detected by IaC generator from your deployed resources. To learn more, see [Resolve write-only properties](https://docs.aws.amazon.com/cdk/v2/guide/migrate.html#migrate-resources-writeonly).

#### Examples

##### Generate a TypeScript CDK app from a local AWS CloudFormation template.json file

```console
$ # template.json is a valid cloudformation template in the local directory
$ cdk migrate --stack-name MyAwesomeApplication --language typescript --from-path MyTemplate.json
```

This command generates a new directory named `MyAwesomeApplication` within your current working directory, and  
then initializes a new CDK application within that directory. The CDK app contains a `MyAwesomeApplication` stack with resources configured to match those in your local CloudFormation template. 

This results in a CDK application with the following structure, where the lib directory contains a stack definition
with the same resource configuration as the provided template.json.

```console
├── README.md
├── bin
│   └── my_awesome_application.ts
├── cdk.json
├── jest.config.js
├── lib
│   └── my_awesome_application-stack.ts
├── package.json
├── tsconfig.json
```

##### Generate a Python CDK app from a deployed stack

If you already have a CloudFormation stack deployed in your account and would like to manage it with CDK, you can migrate the deployed stack to a new CDK app. The value provided with `--stack-name` must match the name of the deployed stack.

```console
$ # generate a Python application from MyDeployedStack in your account
$ cdk migrate --stack-name MyDeployedStack --language python --from-stack
```

This will generate a Python CDK app which will synthesize the same configuration of resources as the deployed stack.

##### Generate a TypeScript CDK app from deployed AWS resources that are not associated with a stack

If you have resources in your account that were provisioned outside AWS IaC tools and would like to manage them with the CDK, you can use the `--from-scan` option to generate the application. 

In this example, we use the `--filter` option to specify which resources to migrate.  You can filter resources to limit the number of resources migrated to only those specified by the `--filter` option, including any resources they depend on, or resources that depend on them (for example A filter which specifies a single Lambda Function, will find that specific table and any alarms that may monitor it). The `--filter` argument offers both AND as well as OR filtering.

OR filtering can be specified by passing multiple `--filter` options, and AND filtering can be specified by passing a single `--filter` option with multiple comma separated key/value pairs as seen below (see below for examples). It is recommended to use the `--filter` option to limit the number of resources returned as some resource types provide sample resources by default in all accounts which can add to the resource limits.

`--from-scan` takes 3 potential arguments: `--new`, `most-recent`, and undefined. If `--new` is passed, CDK Migrate will initiate a new scan of the account and use that new scan to discover resources. If `--most-recent` is passed, CDK Migrate will use the most recent scan of the account to discover resources. If neither `--new` nor `--most-recent` are passed, CDK Migrate will take the most recent scan of the account to discover resources, unless there is no recent scan, in which case it will initiate a new scan. 

```console
# Filtering options
identifier|id|resource-identifier=<resource-specific-resource-identifier-value>
type|resource-type-prefix=<resource-type-prefix>
tag-key=<tag-key>
tag-value=<tag-value>
```

##### Additional examples of migrating from deployed resources

```console
$ # Generate a typescript application from all un-managed resources in your account
$ cdk migrate --stack-name MyAwesomeApplication --language typescript --from-scan

$ # Generate a typescript application from all un-managed resources in your account with the tag key "Environment" AND the tag value "Production"
$ cdk migrate --stack-name MyAwesomeApplication --language typescript --from-scan --filter tag-key=Environment,tag-value=Production

$ # Generate a python application from any dynamoDB resources with the tag-key "dev" AND the tag-value "true" OR any SQS::Queue
$ cdk migrate --stack-name MyAwesomeApplication --language python --from-scan --filter type=AWS::DynamoDb::,tag-key=dev,tag-value=true --filter type=SQS::Queue

$ # Generate a typescript application from a specific lambda function by providing it's specific resource identifier
$ cdk migrate --stack-name MyAwesomeApplication --language typescript --from-scan --filter identifier=myAwesomeLambdaFunction
```

#### **CDK Migrate Limitations**

- CDK Migrate does not currently support nested stacks, custom resources, or the `Fn::ForEach` intrinsic function.

- CDK Migrate will only generate L1 constructs and does not currently support any higher level abstractions.

- CDK Migrate successfully generating an application does *not* guarantee the application is immediately deployable.
It simply generates a CDK application which will synthesize a template that has identical resource configurations 
to the provided template. 

  - CDK Migrate does not interact with the CloudFormation service to verify the template 
provided can deploy on its own. Although by default any CDK app generated using the `--from-scan` option exclude 
CloudFormation managed resources, CDK Migrate will not verify prior to deployment that any resources scanned, or in the provided 
template are already managed in other CloudFormation templates, nor will it verify that the resources in the provided
template are available in the desired regions, which may impact ADC or Opt-In regions. 

  - If the provided template has parameters without default values, those will need to be provided
before deploying the generated application.

In practice this is how CDK Migrate generated applications will operate in the following scenarios:

| Situation                                                                                         | Result                                                                        |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Provided template + stack-name is from a deployed stack in the account/region                     | The CDK application will deploy as a changeset to the existing stack          |
| Provided template has no overlap with resources already in the account/region                     | The CDK application will deploy a new stack successfully                      |
| Provided template has overlap with Cloudformation managed resources already in the account/region | The CDK application will not be deployable unless those resources are removed |
| Provided template has overlap with un-managed resources already in the account/region              | The CDK application will not be deployable until those resources are adopted with [`cdk import`](#cdk-import) |
| No template has been provided and resources exist in the region the scan is done | The CDK application will be immediatly deployable and will import those resources into a new cloudformation stack upon deploy |

##### **The provided template is already deployed to CloudFormation in the account/region**

If the provided template came directly from a deployed CloudFormation stack, and that stack has not experienced any drift, 
then the generated application will be immediately deployable, and will not cause any changes to the deployed resources.
Drift might occur if a resource in your template was modified outside of CloudFormation, namely via the AWS Console or AWS CLI.

##### **The provided template is not deployed to CloudFormation in the account/region, and there *is not* overlap with existing resources in the account/region**

If the provided template represents a set of resources that have no overlap with resources already deployed in the account/region, 
then the generated application will be immediately deployable. This could be because the stack has never been deployed, or
the application was generated from a stack deployed in another account/region.

In practice this means for any resource in the provided template, for example,

```Json
    "S3Bucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "BucketName": "MyBucket",
        "AccessControl": "PublicRead",
      },
      "DeletionPolicy": "Retain"
    }
```

There must not exist a resource of that type with the same identifier in the desired region. In this example that identfier 
would be "MyBucket"

##### **The provided template is not deployed to CloudFormation in the account/region, and there *is* overlap with existing resources in the account/region**

If the provided template represents a set of resources that overlap with resources already deployed in the account/region, 
then the generated application will not be immediately deployable. If those overlapped resources are already managed by 
another CloudFormation stack in that account/region, then those resources will need to be manually removed from the provided
template. Otherwise, if the overlapped resources are not managed by another CloudFormation stack, then first remove those
resources from your CDK Application Stack, deploy the cdk application successfully, then re-add them and run `cdk import` 
to import them into your deployed stack.

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
