## Continuous Integration / Continuous Delivery for CDK Applications
This library includes a *CodePipeline* composite Action for deploying AWS CDK Applications.

This module is part of the [AWS Cloud Development Kit](https://github.com/awslabs/aws-cdk) project.

### Limitations
The construct library in it's current form has the following limitations:
1. It can only deploy stacks that are hosted in the same AWS account and region as the *CodePipeline* is.
2. Stacks that make use of `Asset`s cannot be deployed successfully.

### Getting Started
In order to add the `PipelineDeployStackAction` to your *CodePipeline*, you need to have a *CodePipeline* artifact that
contains the result of invoking `cdk synth -o <dir>` on your *CDK App*. You can for example achieve this using a
*CodeBuild* project.

The example below defines a *CDK App* that contains 3 stacks:
* `CodePipelineStack` manages the *CodePipeline* resources, and self-updates before deploying any other stack
* `ServiceStackA` and `ServiceStackB` are service infrastructure stacks, and need to be deployed in this order

```
  ┏━━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃     Source     ┃  ┃     Build      ┃  ┃  Self-Update    ┃  ┃             Deploy              ┃
  ┃                ┃  ┃                ┃  ┃                 ┃  ┃                                 ┃
  ┃ ┌────────────┐ ┃  ┃ ┌────────────┐ ┃  ┃ ┌─────────────┐ ┃  ┃ ┌─────────────┐ ┌─────────────┐ ┃
  ┃ │   GitHub   ┣━╋━━╋━▶ CodeBuild  ┣━╋━━╋━▶Deploy Stack ┣━╋━━╋━▶Deploy Stack ┣━▶Deploy Stack │ ┃
  ┃ │            │ ┃  ┃ │            │ ┃  ┃ │PipelineStack│ ┃  ┃ │ServiceStackA│ │ServiceStackB│ ┃
  ┃ └────────────┘ ┃  ┃ └────────────┘ ┃  ┃ └─────────────┘ ┃  ┃ └─────────────┘ └─────────────┘ ┃
  ┗━━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

#### `index.ts`
```typescript
import cdk = require('@aws-cdk/cdk');
import cicd = require('@aws-cdk/app-delivery');
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import codedeploy = require('@aws-cdk/aws-codedeploy');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import iam = require('@aws-cdk/iam');

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

const sourceStage = pipeline.addStage('Source');
const buildStage = pipeline.addStage('Build');
const deployStage = pipeline.addStage('Deploy');

const repository = new codecommit.Repository(pipelineStack, 'SourceRepository', {
  repositoryName: 'SelfUpdatePipeline'
});

repository.addToPipeline(sourceStage, 'CodeCommit');

const project = new codebuild.PipelineProject(pipelineStack, 'MyCodeCommitProject', {
  environment: {
    buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0,
  },
  buildSpec: {
    version: '0.2',
    phases: {
      install: {
        commands: [
          'npm install'
        ]
      }
      build: {
        commands: [
          'npm run build',
          'npm run cdk synth -- -o dist'
        ]
      }
    },
    artifacts: {
      files: ['**/*']
    }
  }
});

const buildAction = project.addToPipeline(buildStage, 'Build');

repository.onCommit('CommitToMaster', project, 'master');

const deployServiceAAction = new cicd.PipelineDeployStackAction(pipelineStack, 'DeployServiceStackA', {
  stack: new cdk.Stack(app, 'ServiceStackA'),
  stage: deployStage,
  inputArtifact: buildAction.outputArtifact,
  // See the note below for details about this option.
  adminPermissions: false,
});

// Add the necessary permissions for you service deploy action. This role is
// is passed to CloudFormation and needs the permissions necessary to deploy
// stack. Alternatively you can enable [Administrator](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_job-functions.html#jf_administrator) permissions above,
// users should understand the privileged nature of this role.
deployServiceAAction.addToDeploymentRolePolicy(
  new iam.PolicyStatement()
    .addAction('service:SomeAction')
    .addResource(/* Resource ARN */)
    // add more Action(s) and/or Resource(s) here, as needed
);

new cicd.PipelineDeployStackAction(pipelineStack, 'DeployServiceStackB', {
  stack: new cdk.Stack(app, 'ServiceStackB'),
  stage: deployStage,
  inputArtifact: buildAction.outputArtifact,
  adminPermissions: true, // no need to modify the role with admin permissions
});
```

#### `buildspec.yml`
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

The `PipelineDeployStackAction` expects it's `inputArtifact` to contain the result of
synthesizing a CDK App using the `cdk synth -o <directory>`.
