# Continuous Integration / Continuous Delivery for CDK Applications
<!--BEGIN STABILITY BANNER-->

---

![Deprecated](https://img.shields.io/badge/deprecated-critical.svg?style=for-the-badge)

> This API may emit warnings. Backward compatibility is not guaranteed.

---

<!--END STABILITY BANNER-->

This library includes a *CodePipeline* composite Action for deploying AWS CDK Applications.

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.


## Replacement recommended

This library has been deprecated. We recommend you use the
[@aws-cdk/pipelines](https://docs.aws.amazon.com/cdk/api/latest/docs/pipelines-readme.html) module instead.


## Limitations

The construct library in it's current form has the following limitations:

1. It can only deploy stacks that are hosted in the same AWS account and region as the *CodePipeline* is.
2. Stacks that make use of `Asset`s cannot be deployed successfully.

## Getting Started

In order to add the `PipelineDeployStackAction` to your *CodePipeline*, you need to have a *CodePipeline* artifact that
contains the result of invoking `cdk synth -o <dir>` on your *CDK App*. You can for example achieve this using a
*CodeBuild* project.

The example below defines a *CDK App* that contains 3 stacks:

* `CodePipelineStack` manages the *CodePipeline* resources, and self-updates before deploying any other stack
* `ServiceStackA` and `ServiceStackB` are service infrastructure stacks, and need to be deployed in this order

```plaintext
  ┏━━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃     Source     ┃  ┃     Build      ┃  ┃  Self-Update    ┃  ┃             Deploy              ┃
  ┃                ┃  ┃                ┃  ┃                 ┃  ┃                                 ┃
  ┃ ┌────────────┐ ┃  ┃ ┌────────────┐ ┃  ┃ ┌─────────────┐ ┃  ┃ ┌─────────────┐ ┌─────────────┐ ┃
  ┃ │   GitHub   ┣━╋━━╋━▶ CodeBuild  ┣━╋━━╋━▶Deploy Stack ┣━╋━━╋━▶Deploy Stack ┣━▶Deploy Stack │ ┃
  ┃ │            │ ┃  ┃ │            │ ┃  ┃ │PipelineStack│ ┃  ┃ │ServiceStackA│ │ServiceStackB│ ┃
  ┃ └────────────┘ ┃  ┃ └────────────┘ ┃  ┃ └─────────────┘ ┃  ┃ └─────────────┘ └─────────────┘ ┃
  ┗━━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### `index.ts`

```ts
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as cdk from '@aws-cdk/core';
import * as cicd from '@aws-cdk/app-delivery';
import * as iam from '@aws-cdk/aws-iam';

class MyServiceStackA extends cdk.Stack {}
class MyServiceStackB extends cdk.Stack {}

const app = new cdk.App();

// We define a stack that contains the CodePipeline
const pipelineStack = new cdk.Stack(app, 'PipelineStack');
const pipeline = new codepipeline.Pipeline(pipelineStack, 'CodePipeline', {
  // Mutating a CodePipeline can cause the currently propagating state to be
  // "lost". Ensure we re-run the latest change through the pipeline after it's
  // been mutated so we're sure the latest state is fully deployed through.
  restartExecutionOnUpdate: true,
  /* ... */
});

// Configure the CodePipeline source - where your CDK App's source code is hosted
const sourceOutput = new codepipeline.Artifact();
const source = new codepipeline_actions.GitHubSourceAction({
  actionName: 'GitHub',
  output: sourceOutput,
  owner: 'myName',
  repo: 'myRepo',
  oauthToken: cdk.SecretValue.unsafePlainText('secret'),
});
pipeline.addStage({
  stageName: 'source',
  actions: [source],
});

const project = new codebuild.PipelineProject(pipelineStack, 'CodeBuild', {
  /**
  * Choose an environment configuration that meets your use case.
  * For NodeJS, this might be:
  *
  * environment: {
  *   buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0,
  * },
  */
});
const synthesizedApp = new codepipeline.Artifact();
const buildAction = new codepipeline_actions.CodeBuildAction({
  actionName: 'CodeBuild',
  project,
  input: sourceOutput,
  outputs: [synthesizedApp],
});
pipeline.addStage({
  stageName: 'build',
  actions: [buildAction],
});

// Optionally, self-update the pipeline stack
const selfUpdateStage = pipeline.addStage({ stageName: 'SelfUpdate' });
selfUpdateStage.addAction(new cicd.PipelineDeployStackAction({
  stack: pipelineStack,
  input: synthesizedApp,
  adminPermissions: true,
}));

// Now add our service stacks
const deployStage = pipeline.addStage({ stageName: 'Deploy' });
const serviceStackA = new MyServiceStackA(app, 'ServiceStackA', { /* ... */ });
// Add actions to deploy the stacks in the deploy stage:
const deployServiceAAction = new cicd.PipelineDeployStackAction({
  stack: serviceStackA,
  input: synthesizedApp,
  // See the note below for details about this option.
  adminPermissions: false,
});
deployStage.addAction(deployServiceAAction);
// Add the necessary permissions for you service deploy action. This role is
// is passed to CloudFormation and needs the permissions necessary to deploy
// stack. Alternatively you can enable [Administrator](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_job-functions.html#jf_administrator) permissions above,
// users should understand the privileged nature of this role.
const myResourceArn = 'arn:partition:service:region:account-id:resource-id';
deployServiceAAction.addToDeploymentRolePolicy(new iam.PolicyStatement({
  actions: ['service:SomeAction'],
  resources: [myResourceArn],
  // add more Action(s) and/or Resource(s) here, as needed
}));

const serviceStackB = new MyServiceStackB(app, 'ServiceStackB', { /* ... */ });
deployStage.addAction(new cicd.PipelineDeployStackAction({
  stack: serviceStackB,
  input: synthesizedApp,
  createChangeSetRunOrder: 998,
  adminPermissions: true, // no need to modify the role with admin
}));
```

### `buildspec.yml`

The repository can contain a file at the root level named `buildspec.yml`, or
you can in-line the buildspec. Note that `buildspec.yaml` is not compatible.

For example, a *TypeScript* or *Javascript* CDK App can add the following `buildspec.yml`
at the root of the repository:

```yml
version: 0.2
phases:
  install:
    commands:
      # Installs the npm dependencies as defined by the `package.json` file
      # present in the root directory of the package
      # (`cdk init app --language=typescript` would have created one for you)
      - npm install
  build:
    commands:
      # Builds the CDK App so it can be synthesized
      - npm run build
      # Synthesizes the CDK App and puts the resulting artifacts into `dist`
      - npm run cdk synth -- -o dist
artifacts:
  # The output artifact is all the files in the `dist` directory
  base-directory: dist
  files: '**/*'
```

The `PipelineDeployStackAction` expects it's `input` to contain the result of
synthesizing a CDK App using the `cdk synth -o <directory>`.


