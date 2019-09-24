## AWS CDK Toolkit
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

The AWS CDK Toolkit provides the `cdk` command-line interface that can be used to work with AWS CDK applications.

Command                           | Description
----------------------------------|-------------------------------------------------------------------------------------
[`cdk docs`](#cdk-docs)           | Access the online documentation
[`cdk init`](#cdk-init)           | Start a new CDK project (app or library)
[`cdk list`](#cdk-list)           | List stacks in an application
[`cdk synth`](#cdk-synthesize)    | Synthesize a CDK app to CloudFormation template(s)
[`cdk diff`](#cdk-diff)           | Diff stacks against current state
[`cdk deploy`](#cdk-deploy)       | Deploy a stack into an AWS account
[`cdk destroy`](#cdk-destroy)     | Deletes a stack from an AWS account
[`cdk bootstrap`](#cdk-bootstrap) | Deploy a toolkit stack to support deploying large stacks & artifacts
[`cdk doctor`](#cdk-doctor)       | Inspect the environment and produce information useful for troubleshooting

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

### Commands
#### `cdk docs`
Outputs the URL to the documentation for the current toolkit version, and attempts to open a browser to that URL.

```console
$ # Open the documentation in the default browser (using 'open')
$ cdk docs
https://docs.aws.amazon.com/cdk/api/latest/

$ # Open the documentation in Chrome.
$ cdk docs --browser='chrome %u'
https://docs.aws.amazon.com/cdk/api/latest/
```

#### `cdk init`
Creates a new CDK project.

```console
$ # List the available template types & languages
$ cdk init --list
Available templates:
* app: Template for a CDK Application
   └─ cdk init app --language=[java|typescript]
* lib: Template for a CDK Construct Library
   └─ cdk init lib --language=typescript

$ # Create a new library application in typescript
$ cdk init lib --language=typescript
```

#### `cdk list`
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

#### `cdk synthesize`
Synthesize the CDK app and outputs CloudFormation templates. If the application contains multiple stacks and no
stack name is provided in the command-line arguments, the `--output` option is mandatory and a CloudFormation template
will be generated in the output folder for each stack.

By default, templates are generated in YAML format. The `--json` option can be used to switch to JSON.

```console
$ # Generate the template for StackName and output it to STDOUT
$ cdk synthesize --app='node bin/main.js' MyStackName

$ # Generate the template for MyStackName and save it to template.yml
$ cdk synth --app='node bin/main.js' MyStackName --output=template.yml

$ # Generate templates for all the stacks and save them into templates/
$ cdk synth --app='node bin/main.js' --output=templates
```

#### `cdk diff`
Computes differences between the infrastructure specified in the current state of the CDK app and the currently
deployed application (or a user-specified CloudFormation template). This command returns non-zero if any differences are
found.

```console
$ # Diff against the currently deployed stack
$ cdk diff --app='node bin/main.js' MyStackName

$ # Diff against a specific template document
$ cdk diff --app='node bin/main.js' MyStackName --template=path/to/template.yml
```

#### `cdk deploy`
Deploys a stack of your CDK app to it's environment. During the deployment, the toolkit will output progress
indications, similar to what can be observed in the AWS CloudFormation Console. If the environment was never
bootstrapped (using `cdk bootstrap`), only stacks that are not using assets and synthesize to a template that is under
51,200 bytes will successfully deploy.

```console
$ cdk deploy --app='node bin/main.js' MyStackName
```

#### `cdk destroy`
Deletes a stack from it's environment. This will cause the resources in the stack to be destroyed (unless they were
configured with a `DeletionPolicy` of `Retain`). During the stack destruction, the command will output progress
information similar to what `cdk deploy` provides.

```console
$ cdk destroy --app='node bin/main.js' MyStackName
```

#### `cdk bootstrap`
Deploys a `CDKToolkit` CloudFormation stack into the specified environment(s), that provides an S3 bucket that
`cdk deploy` will use to store synthesized templates and the related assets, before triggering a CloudFormation stack
update. The name of the deployed stack can be configured using the `--toolkit-stack-name` argument.

```console
$ # Deploys to all environments
$ cdk bootstrap --app='node bin/main.js'

$ # Deploys only to environments foo and bar
$ cdk bootstrap --app='node bin/main.js' foo bar
```

#### `cdk doctor`
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

### Configuration
On top of passing configuration through command-line arguments, it is possible to use JSON configuration files. The
configuration's order of precedence is:
1. Command-line arguments
2. Project configuration (`./cdk.json`)
3. User configuration (`$CDK_HOME/.cdk.json` if CDK_HOME is set, otherwise `~/.cdk.json`)

#### JSON Configuration files
Some of the interesting keys that can be used in the JSON configuration files:
```js
{
    "app": "node bin/main.js",        // Command to start the CDK app     (--app='node bin/main.js')
    "context": {                      // Context entries                  (--context=key=value)
        "key": "value",
    },
    "toolkitStackName": "foo",        // Customize 'bootstrap' stack name (--toolkit-stack-name=foo)
    "toolkitBucketName": "fooBucket", // Customize 'bootstrap' bucket name(--toolkit-bucket-name=fooBucket)
    "versionReporting": false,        // Opt-out of version reporting     (--no-version-reporting)
}
```
