# Continuous Delivery for CDK Apps

This is a specification for continuous delivery support for CDK apps. It
describes the requirements, proposed APIs and developer workflow.

**_Goal_: full CI/CD for CDK apps at any complexity.**

The desired developer experience is that teams will be able to “git push” a
change into their CDK app repo and have this change automatically picked up,
built, tested and deployed according to a deployment flow they define.

Any changes in resources, assets *or stacks* in their apps will automatically be
added. To that end, the deployment pipeline itself will also be continuously
delivered and updated throughout the same workflow. No manual deployments to
production (incl. the pipeline) will be required.

The only caveat is that **new environments** (account/region) will need to be
bootstrapped in advance in order to establish trust with the central pipeline
environment and set-up resources needed for deployment such as the assets S3
bucket.

- App Prototype: https://github.com/eladb/cdkcd-test
- Toolchain Prototype: https://github.com/eladb/cdk-toolchain-prototype

## Requirements

This list describes only the minimal set of requirements from this feature.
After we release these building blocks, we will look into vending higher-level
"one liner" APIs that will make it very easy to get started.

1. **Assets**: Support apps that include all kinds of assets (S3 files, ECR
   images)
2. **Multiple-environments**: Support apps that have stacks that target multiple
   environments (accounts/regions)
3. **Orchestration**: Allow developers to express complex deployment
   orchestration based on the capabilities of CodePipeline
4. **User defined build + synth environment**: the runtime environment in which
   the code is built and the CDK app is synthesized should be fully customizable
   by the user
5. **Controlled deployment runtime environment**: for security reasons, the runtime
   environment in which deployment is executed will be fully controlled and will
   not allow running user code or user-defined image

_Considerations:_

* Support for deployment across partitions and into air-gapped regions.
* Prefer to use stock CloudFormation pipeline actions to reduce costs, leverage
  UI and allow restriction of the deployment role to the CloudFormation service
  principal.
* Execution of `cdk synth` or `docker build` should not be done in a context
  with administrative privileges

_Non-requirements/assumptions:_

1. We assume that **cdk.context.json** is committed into the repo. Any
   context-fetching will be done manually by users and committed to the
   repository.
2. There’s a one-to-one mapping between an app and a pipeline. We are not
   optimizing the experience for multiple apps per pipeline (although
   technically it should be possible to do it, but it’s not a use case we are
   focused on).
3. We are not optimizing this experience to support any CD tool (e.g. Jenkins)
   but we should provide guidance on how to use `cdk synth`, `cdk package` and
   `cdk deploy` so that users will be able to implement CI/CD through their
   tools.
4. Dependency management, repository and project structure are out of scope: we
   don’t want to be opinionated about how users should structure their projects.
   They should be able to use the tools they are familiar with and are available
   to their teams to structure and modularize their applications.

## Approach

At a high-level, we will model the deployment process of a CDK app as follows:

```
source => build => package => pipeline => deploy
```

1. In the *source* stage the code is pulled from a source repository (e.g.
   CodeCommit, GitHub or S3), like any other app.
2. In the *build* stage, the application is compiled (if required) **and
   synthesized** to a [cloud assembly](https://github.com/aws/aws-cdk/blob/master/design/cloud-assembly.md).
   The only artifact of the build stage is the cloud assembly directory.
2. In the *package* stage, we build and publish all assets needed by the
   app to all target environments. The output of this stage is a set of
   CloudFormation templates (one for each stack) with the asset parameters
   resolved to their published location (by assigning default values to the
   CloudFormation parameters).
3. In the *pipeline* stage, we update the deployment pipeline itself. For
   example, if stacks were added to the app, we need the pipeline to include
   additional deployment actions for those stacks. In this stage we basically
   deploy a CDK stack that is part of the app and contains the CodePipeline
   resource itself.
4. In the *deploy* stage(s), stacks are deployed to the various environments
   through some orchestration process (e.g. deploy first to this region, run
   these canaries, wait for errors, continue to the next stage, etc).

NOTES:

* We assume a single source repository that masters the CDK app itself. This
  repo can be structured in any way users wish, and may include multiple modules
  or just a single one. If users choose to organize their project into modules
  and master different modules in other repositories, eventually the build
  artifacts from these builds should be available when the app is synthesized.
* The only requirement from the build step is the it will have an output
  artifact that is a cloud assembly directory which is obtained through “cdk
  synth” (defaults to “cdk.out”). Other than that, users can fully control their
  build environment.
* The deployment phase can include any number of stack deployment actions. Each
  deployment action is responsible deploy a single stack, along with any assets
  it references.

## Packaging Action

TODO, see prototype `cdk-package`

## Stack Deployment Action

TODO: change this to use the stock CloudFormation action

Given the approach above, the *source* and *build* stages are completely
standard. The only requirement is that the build stage will have the cloud
assembly as its output artifact.

Cloud assemblies include CloudFormation templates and the *source* (i.e.
Dockerfile, lambda sources, etc) for all assets needed for this application.
Cloud assemblies are self-contained and can later be consumed by `cdk deploy` to
bundle and publish assets and deploy stacks to AWS environments.

Therefore, the basic building block we need in order to enable continuous
delivery for CDK apps is a **Stack Deployment Action** which deploys a single
CDK stack from a cloud assembly to an AWS environment.

Such an action can be implemented as a CodeBuild project+action, which accepts a
cloud assembly as a single input artifact, runs inside the standard CodeBuild
node.js base image and executes the “deploy” CDK CLI command:

```
npx cdk@${FRAMEWORK_VERSION} deploy \
  --app . \
  --exclusively ${STACK_NAME} \
  --require-approval=never
```

In order to support deploying stacks to multiple environments (account/regions)
the build project will assume a **well-known IAM role** which will be
pre-provisioned to each one of the destination environments. See the
[Bootstrapping](#bootstrapping) section below for details on how this role will
be pre-provisioned.

The CodeBuild project resource itself will be provisioned in the *same*
environment as the pipeline, so it will have direct access to cloud assembly
artifact.

> A potential alternative would have been to provision a dedicated CodeBuild
> project resource for each stack in each target environment and use
> CodePipeline’s replication system to copy the cloud assembly to the
> destination environment and execute the project remotely, with shared KMS
> keys, etc. This will dramatically complicate the bootstrapping process/setup
> and doesn’t seem to improve the security or reliability of this process. In
> fact a similar approach is taken by the stock CodePipeline CloudFormation
> actions.

We can offer two levels of abstraction for the stack deployment action: one that
accepts a stack name and an environment and the other that just accepts a
`core.Stack` (and then, we can derive the stack name and the environment from
it):

Low-level API:

```
actionName: string;
assembly: cp.Artifact;     // build output
frameworkVersion?: string; // defaults to LATEST
stackName: string;         // the name of the stack to deploy
env?: Environment;         // defaults to pipeline account/region
```

Higher-level API:

```
actionName: string;
assembly: cp.Artifact;     // build output
frameworkVersion?: string; // defaults to LATEST
stack: core.Stack;         // the stack to deploy
```

NOTES:

* The project must run in **privileged** mode in order to support docker
  assets.
* The **--exclusively** flag will ensure that “cdk deploy” will only deploy the
  specified stack (along with it’s assets). This means that if this stack
  depends on other stacks, they must be explicitly deployed before it.
* The **--require-approval=never** flag will not require users to confirm any
  posture changes.
* The role will be assumed with an external ID dedicated to the CDK to reduce
  the chance for mistakes.

## Bootstrapping

 - TODO: update based on `cdk-boostrap` prototype:
 - TODO: IAM role for publishing
 - TODO: IAM role for manual deployment (through `cdk deploy` with permissions only for developers as needed).
 - TODO: IAM role that allows only CFN to assume it and used for actual deployments

Based on this model, in order to be able to deploy CDK stacks to an environment
we need two resources:

1. **Assets bucket**, which is needed by the CLI in order to upload
   CloudFormation templates and assets to S3.
2. **Deployment IAM role**, which is needed by the deployment action in order to
   deploy to this account. The deployment role needs to trust the central
   account assume-role permissions.

To CDK CLI currently has a `bootstrap` command which provisions the assets
bucket described above. We will extend it to include a deployment role with an
option to specify a set of trusted AWS account IDs which will be permitted to
deploy to this environment:

```
$ cdk bootstrap aws://account/region --trust-account ACCOUNT_ID
WARNING: any principal from <ACCOUNT_ID> will have administrative access to the account <account>.
Please confirm (Y/N):
```

An appropriate error should be displayed to the user if they try to deploy to a
non-bootstrapped environment.

## Sample Walkthrough

Given these two primitives (a **stack deployment CodePipeline action** and a
**bootstrap deployment IAM role**), we are able to support all requirements in
this doc.

Lets walk through the following scenario:

1. Repository hosted on GitHub.
2. Separate AWS account for the pipeline.
3. App includes a VPC stack and a service stack
4. Initially deploy into a single geography (account/region)
5. Extend to another geography

### Initialize the pipeline

1. Create an AWS account for the pipeline (we will refer to it as `ACNT-PIPE`)
2. Bootstrap the pipeline environments:

        cdk bootstrap aws://ACNT-PIPE/us-east-1

3. Create a new git repository for the app (e.g. on GitHub).
4. Initialize a new CDK app: `cdk init`
5. Define a **"pipeline"** stack ([example](https://github.com/eladb/cdkcd-test/blob/master/lib/pipeline.ts))
   which includes a source, build and self-updating pipeline stage.
6. Commit this code and push to GitHub
7. Execute `cdk deploy pipeline` to deploy this pipeline.
8. From this point forward, no need to use `cdk deploy` anymore.

### North America deployment

1. Create an AWS account for the service in North America (`ACNT-NA`)

2. Bootstrap this account and trust the pipeline account:

        cdk bootstrap aws://ACNT-NA/us-west-2 --trust ACNT-PIPE

3. Let’s say our service is organized into two stacks: `VpcStack` and
   `ServiceStack`.

4. Add the following code to the pipeline:

    ```ts
    pipeline.addStage({
      stageName: 'deploy-VPC',
      actions: [
        new DeployStackAction(this, `deploy-NA-VPC`, {
          stack: new VpcStack(this, 'na-vpc', { env: NA_ENV }),
          assembly: assembly
        }
      ]
    });

    pipeline.addStage({
      stageName: 'deploy-SVC',
      actions: [
        new DeployStackAction(this, `deploy-NA-SVC`, {
          stack: new ServiceStack(this, 'na-svc', { env: NA_ENV }),
          assembly: assembly
        }
      ]
    });
    ```

6. **UGLY**?: Obtain credentials for the new account and `cdk synth` or `cdk ls`
   in order to update `cdk.context.json` with the AZ information from that
   account/region.
7. Commit + push. That’s it, this will automatically be picked up by our
   pipeline. First the pipeline itself will be updated and then the two new
   stages will be added and the stacks deployed.

### Adding Europe

Now let's say we want to also deploy another geography for our app (in parallel
to the NA deployment, as an example).

1. Create & bootstrap another account (`ACNT-EU`) (with `--trust ACNT-PIPE`).

2. Update the pipeline stack to look like this:

```ts
pipeline.addStage({
  stageName: 'deploy-VPC',
  actions: [
    new DeployStackAction(this, `deploy-NA-VPC`, {
      stack: new VpcStack(this, 'na-vpc', { env: NA_ENV }),
      assembly: assembly
    },
    new DeployStackAction(this, `deploy-EU-VPC`, {
      stack: new VpcStack(this, 'eu-vpc', { env: EU_ENV }),
      assembly: assembly
    },
  ]
});

pipeline.addStage({
  stageName: 'deploy-SVC',
  actions: [
    new DeployStackAction(this, `deploy-NA-SVC`, {
      stack: new ServiceStack(this, 'na-svc', { env: NA_ENV }),
      assembly: assembly
    },
    new DeployStackAction(this, `deploy-EU-SVC`, {
      stack: new ServiceStack(this, 'eu-svc', { env: EU_ENV }),
      assembly: assembly
    }
  ]
});
```

5. `cdk synth` to update `cdk.context.json` with the new AZ context.

6. Commit + push

## Open Issues

- [ ] __SECURITY ISSUE__: since the deployment action needs to run `docker build`, it requires both privileged mode on the machine _and_ can execute arbitrary user-code, so we are essentially losing our ability to really control the deployment environment. 
- [ ] Users are concerned with costs of the deployment actions in their pipeline. CloudFormation actions are free.
- [ ] How to handle removal of stacks
- [ ] Define a workflow and a special verb for updating **cdk.context.json**
  (currently, users need to simply run `cdk ls` or `cdk synth` from their dev
  machine with credentials to access each environment. It’s not super nice.
- [ ] Integration with AWS Organization
- [ ] Extensability model for `cdk boostrap` to allow teams to customize this behavior.


