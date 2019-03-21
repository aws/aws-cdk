# App Delivery

> **Experimental**

Continuous delivery for AWS CDK apps.

## Overview

The app delivery solution for AWS CDK apps is based on the idea of a
**bootstrapping pipeline**. It's an AWS CodePipeline which monitors your source
control branch for changes, picks them up, builds them and runs `cdk deploy` for
you.

The bootstrapping pipeline may be sufficient for simple applications that do not
require customization of their deployment process. However, this solution can be
extended to allow users to define arbitrary CodePipeline models which can deploy
complex applications across regions and accounts.

## Bootstrapping Pipeline

Normally, you will set up a single bootstrapping pipeline per CDK app, which is
bound to the source control repository in which you store your application.

The `cdk-pipeline` program, which is included in this module can be used to create/update
bootstrapping pipelines in your account.

To use it, create a file called `cdk.pipelines.yaml` with a map where the key is
the name of the bootstrapping pipeline and the value is an object with the following options:

* `source`: the GitHub repository to monitor. Must be in the form **http://github.com/ACCOUNT/REPO**.
* `oauthSecret`: the ARN of an AWS Secrets Manager secret that contains the GitHub OAuth key.
* `branch` (optional): branch to use (default is `master`)
* `workdir` (optional): the directory in which to run the build command (defaults to the root of the repository).
* `stacks` (optional): array of stack names to deploy (defaults to all stacks not marked `autoDeploy: false`).
* `environment` (optional): the CodeBuild environment to use (defaults to node.js 10.1)
* `install` (optional): install command (defaults: `npm install`)
* `build` (optional): build command (defaults: `npm run build && npm test`)
* `version` (optional): semantic version requirement of the CDK CLI to use for deployment (defaults: `latest`)

Here's an example for the bootstrapping pipeline for the [CDK workshop](https://github.com/aws-samples/aws-cdk-intro-workshop):

```yaml
cdk-workshop:
  source: https://github.com/aws-samples/aws-cdk-intro-workshop
  oauthSecret: arn:aws:secretsmanager:us-east-1:111111111111:secret:github-token-aaaaa
  workdir: code/typescript
```

Next, use the `cdk-pipeline` command to create/update this bootsrapping pipeline
into your account (assumes you have the CDK CLI installed on your system).

```console
$ npx -p @aws-cdk/app-delivery cdk-pipeline
```

This command will deploy a stack called `cdk-pipelines` in your AWS account, which will contain
all the bootstrapping pipelines defines in `cdk.pipelines.yaml`.

To add/remove/update pipelines, simply update the .yaml file and re-run
`cdk-pipelines`.

This pipeline will now monitor the github repository and it will deploy the
stacks defined in your app to your account.

## Application Pipeline

As mentioned above, the bootstrapping pipeline is useful for simple applications
where you basically just want your CDK app to continuously be deployed into your
AWS account.

For more complex scenarios, such as multi-stack/multi-account/multi-region
deployments or when you want more control over how your application is deployed,
the CDK allows you to harness the full power of AWS CodePipeline in order to
model complex deployment scenarios.

The basic idea of **application pipelines** is that they are defined like any
other stack in your CDK application (and therefore can reason about the
structure of your application, reference resources and stacks, etc), and are
also continuously deployed through the bootstrapping pipeline.

The CDK is shipped with a class called `ApplicationPipeline` which extends
the normal `codepipeline.Pipeline` and is automatically wired to the CDK
application produced from your bootstrapping pipeline.

To deploy CDK stacks from your application through an application pipeline, you
can simply add a `DeployStackAction` to your pipeline.

The following is a complete CDK application with two stacks that are deployed in
parallel by the application pipeline:

```ts
const app = new App();

new ApplicationPipelineStack(app, 'Root', {
  bootstrap: 'cdk-workshop',
  stages: [
    {
      name: 'Deploy',
      actions: [
        new DeployStackAction({ stack: new WorkshopStack(app, 'WorkshopStack'), admin: true }),
        new DeployStackAction({ stack: new RandomStack(app, 'RandomStack'), admin: true })
      ]
    }
  ]
});
```
