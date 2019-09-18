# RFC: Default Stack Environments

## Background

At the moment, if a `Stack` is defined without `env`, it is said to be an environment-agnostic stack. This technically means that `stack.account` and `stack.region` will resolve to `{ "Ref": "AWS::AccountId" }` and `{ "Ref": "AWS::Region" }`. The implication are that code that relies on parsing one of these values will fail (e.g. the EKS library has an [AMI map](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-eks/lib/ami.ts) keyed by `stack.region`).

Users are able to explicitly "inherit" the CLI's current environment by using a couple of environment variables which are always populated by the CLI:

```ts
new Stack(this, 'MyStack', { 
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  } 
}
```

Prior to introducing explicit support for environment agnostic stacks ([PR](https://github.com/aws/aws-cdk/pull/2922)), falling back to the CLI's current environment was the default behavior if you didn't specify `env`.

The problem with this approach was that if users wanted to use `cdk synth` and use the resulting artifact (template/cloud-assembly) in CI/CD systems, they couldn't rely on the fact that results will be deterministic since they will be dependent on the specific runtime environment. For example, in one environment `AWS_DEFAULT_REGION` can be set to `us-east-1` and in another it will be set to `us-west-2`, which can technically result in a totally different output.

## Problem

The current situation creates undesired friction when getting started with certain modules of the CDK (and potentially 3rd party modules as well that depend on explicit env). For example, if a user wishes to deploy an EKS cluster with `cdk deploy`, they will have to define their stacks with explicit `env` (either specify account/region or use `CDK_DEFAULT_XXX`).

## Opportunity

When using `cdk deploy` directly with an app that has stack(s) without explicit `env`, the synthesized output is an **intermediate artifact** that is never visible. In this case, defaulting to the current account/region is safe and is probably what most users expect.

## Proposal

The proposal is:

1. Add an `--default-env=inherit|explicit|agnostic` switch to the CLI which will control the default env mode.
2. Extend the semantics of `CDK_DEFAULT_ACCOUNT` and `CDK_DEFAULT_REGION` to be able to express these three modes (currently it cannot express environment-agnosticness).
3. Change the default behavior of `env` in `Stack` to fall back to `CDK_DEFAULT_ACCOUNT` and `CDK_DEFAULT_REGION` if an explicit value is not specified.
4. If `env` is not explicitly set and `CDK_DEFAULT_XXX` is undefined, stack initialization **will fail with an error**.
5. The default mode for `cdk deploy` will be `inherit`. This is because when a stack without env is deployed with the CLI, we *know* where it's going. There's no point playing this game here.
6. The default mode for `cdk synth` will be `explicit`. The implication of this (detalied below) is that if users wish to synthesize an artifact from their CDK app and deploy it at a later stage, they will have to either explicitly specify `env` for all stacks or use `cdk synth --default-env=inherit|agnostic`.
7. Make it easier to explicitly indicate that a stack is environment-agnostic. This can already be acheieved today using `{ env: { region: Aws.REGION, account: Aws.ACCOUNT_ID } }` but can be made easier with `{ env: Stack.ANY_ENV }`.

## Implications

It also means that `cdk synth` will fail unless all stacks have a specific environment specified (either env-specific or env-agnostic), which may be undesirable for certain use cases. 

Let's look at what people use `cdk synth` for:

1. **Inspection/debugging/demo**: usually this involves emitting a template output to STDOUT and inspecting it or showing it to others.
2. **CI/CD**: using `cdk.out` (the "cloud assembly") or the templates inside it as a self-contained artifact which can later be deployed using `cdk-deploy --app cdk.out`.

For the 2nd use case (CI/CD), where `cdk synth` is used during build to produce a deployment artifact, we feel that requiring explicitness is actually a benefit. Deterministic infrastructure definitions are an important tenent of the AWS CDK, and requiring that users be explicit when they deploy apps through CI/CD is actually an added value. If users wish to synthesize environment agnostic templates, they can simply specify `env: Stack.ANY_ENV` when they define their stacks.

The 1st use case, however, where `cdk synth` is used to print a template to STDOUT for inspection, is something we still wish to support without requiring users to explicitly specify `env`s. 

Before we decide what to do about that, we should acknowledge that the current behavior of `cdk synth` is a bit confusing today:

- If the app includes more than a single stack, `cdk synth` requires that you specify the stack name in order to print to STDOUT, otherwise it just creates `cdk.out`.
- When `cdk synth` prints to STDOUT is prints in YAML (unless `--json` is specified), while `cdk.out` always uses JSON ([#2965](https://github.com/aws/aws-cdk/issues/2965)).
- `cdk.out` is created no matter what, for both use cases of `synth` and even if it the app was synthesized implicitly as part of `cdk deploy`. This also somewhat causes confusion.

We propose to separate the use cases into two different CLI commands: `cdk synth` and `cdk build`. The first will serve the inspection use case and the second for the CI/CD use case. This way, we can decide that `--default-env` will have a different default behavior for these two commands. For `cdk synth` (STDOUT) we will default to `agnostic` and for `cdk build` we will default to `explicit`.
