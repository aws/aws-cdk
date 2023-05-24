# App Staging Synthesizer
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This library includes constructs aimed at replacing the current model of bootstrapping and providing
greater control of the bootstrap experience to the CDK user. The important constructs in this library
are as follows:

- the `IStagingResources` interface: a framework for an app-level bootstrap stack that handles
  file assets and docker assets.
- the `DefaultStagingStack`, which is a works-out-of-the-box implementation of the `IStagingResources`
  interface.
- the `AppStagingSynthesizer`, a new CDK synthesizer that will synthesize CDK applications with
  the staging resources provided.

> As this library is `experimental`, there are features that are not yet implemented. Please look
> at the list of [Known Limitations](#known-limitations) before getting started.

To get started, update your CDK App with a new `defaultStackSynthesizer`:

```ts
const app = new App({
  defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
    appId: 'my-app-id', // put a unique id here
  }),
});
```

This will introduce a `DefaultStagingStack` in your CDK App and staging assets of your App
will live in the resources from that stack rather than the CDK Bootstrap stack.

If you are migrating from a different version of synthesis your updated CDK App will target
the resources in the `DefaultStagingStack` and no longer be tied to the bootstrapped resources
in your account.

## Bootstrap Model

Our current bootstrap model looks like this, when you run `cdk bootstrap aws://<account>/<region>` :

```text
┌───────────────────────────────────┐┌────────────────────────┐┌────────────────────────┐
│                                   ││                        ││                        │
│                                   ││                        ││                        │
│          ┌───────────────┐        ││    ┌──────────────┐    ││    ┌──────────────┐    │
│          │Bootstrap Stack│        ││    │  CDK App 1   │    ││    │  CDK App 2   │    │
│          └───────────────┘        ││    └──────────────┘    ││    └──────────────┘    │
│                                   ││                        ││                        │
│                                   ││                        ││                        │
│   ┌───────────────────────────┐   ││     ┌────────────┐     ││                        │
│   │IAM Role for CFN execution │   ││┌────│  S3 Asset  │     ││                        │
│   │    IAM Role for lookup    │   │││    └────────────┘     ││                        │
│   │  IAM Role for deployment  │   │││                       ││                        │
│   └───────────────────────────┘   │││                       ││     ┌─────────────┐    │
│                                   │││            ┌──────────┼┼─────│  S3 Asset   │    │
│                                   │││            │          ││     └─────────────┘    │
│ ┌───────────────────────────────┐ │││            │          ││                        │
│ │ IAM Role for File Publishing  │ │││            │          ││                        │
│ │ IAM Role for Image Publishing │ │││            │          ││                        │
│ └───────────────────────────────┘ │││            │          ││                        │
│                                   │││            │          ││                        │
│  ┌─────────────────────────────┐  │││            │          ││                        │
│  │S3 Bucket for Staging Assets │  │││            │          ││                        │
│  │     KMS Key encryption      │◀─┼┼┴────────────┘          ││      ┌────────────┐    │
│  └─────────────────────────────┘  ││             ┌──────────┼┼───── │ ECR Asset  │    │
│                                   ││             │          ││      └────────────┘    │
│                                   ││             │          ││                        │
│┌─────────────────────────────────┐││             │          ││                        │
││ECR Repository for Staging Assets◀┼┼─────────────┘          ││                        │
│└─────────────────────────────────┘││                        ││                        │
│                                   ││                        ││                        │
│                                   ││                        ││                        │
│                                   ││                        ││                        │
│                                   ││                        ││                        │
│                                   ││                        ││                        │
│                                   ││                        ││                        │
└───────────────────────────────────┘└────────────────────────┘└────────────────────────┘
```

Your CDK Application utilizes these resources when deploying. For example, if you have a file asset,
it gets uploaded to the S3 Staging Bucket using the File Publishing Role when you run `cdk deploy`.

This library introduces an alternate model to bootstrapping, by splitting out essential CloudFormation IAM roles
and staging resources. There will still be a Bootstrap Stack, but this will only contain IAM roles necessary for
CloudFormation deployment. Each CDK App will instead be in charge of its own staging resources, including the
S3 Bucket, ECR Repositories, and associated IAM roles. It works like this:

The Staging Stack will contain, on a per-need basis, 

- 1 S3 Bucket with KMS encryption for all file assets in the CDK App.
- An ECR Repository _per_ image (and its revisions).
- IAM roles with access to the Bucket and Repositories.

```text
┌─────────────────────────────┐┌───────────────────────────────────────┐┌───────────────────────────────────────┐
│                             ││                                       ││                                       │
│      ┌───────────────┐      ││             ┌──────────────┐          ││             ┌──────────────┐          │
│      │Bootstrap Stack│      ││             │  CDK App 1   │          ││             │  CDK App 2   │          │
│      └───────────────┘      ││             └──────────────┘          ││             └──────────────┘          │
│                             ││┌──────────────────┐                   ││┌──────────────────┐                   │
│                             │││ ┌──────────────┐ │                   │││ ┌──────────────┐ │                   │
│                             │││ │Staging Stack │ │                   │││ │Staging Stack │ │                   │
│                             │││ └──────────────┘ │                   │││ └──────────────┘ │                   │
│                             │││                  │                   │││                  │                   │
│                             │││                  │                   │││                  │                   │
│                             │││┌────────────────┐│     ┌────────────┐│││┌────────────────┐│     ┌────────────┐│
│                             ││││  IAM Role for  ││ ┌───│  S3 Asset  │││││  IAM Role for  ││ ┌───│  S3 Asset  ││
│                             ││││File Publishing ││ │   └────────────┘││││File Publishing ││ │   └────────────┘│
│                             │││└────────────────┘│ │                 ││││  IAM Role for  ││ │                 │
│                             │││                  │ │                 ││││Image Publishing││ │                 │
│┌───────────────────────────┐│││                  │ │                 │││└────────────────┘│ │                 │
││IAM Role for CFN execution ││││                  │ │                 │││                  │ │                 │
││    IAM Role for lookup    ││││                  │ │                 │││                  │ │                 │
││  IAM Role for deployment  ││││┌────────────────┐│ │                 │││┌────────────────┐│ │                 │
│└───────────────────────────┘││││ S3 Bucket for  ││ │                 ││││ S3 Bucket for  ││ │                 │
│                             ││││ Staging Assets │◀─┘                 ││││ Staging Assets │◀─┘                 │
│                             │││└────────────────┘│                   │││└────────────────┘│      ┌───────────┐│
│                             │││                  │                   │││                  │  ┌───│ ECR Asset ││
│                             │││                  │                   │││┌────────────────┐│  │   └───────────┘│
│                             │││                  │                   ││││ ECR Repository ││  │                │
│                             │││                  │                   ││││  for Staging   │◀──┘                │
│                             │││                  │                   ││││     Assets     ││                   │
│                             │││                  │                   │││└────────────────┘│                   │
│                             │││                  │                   │││                  │                   │
│                             │││                  │                   │││                  │                   │
│                             │││                  │                   │││                  │                   │
│                             │││                  │                   │││                  │                   │
│                             │││                  │                   │││                  │                   │
│                             ││└──────────────────┘                   ││└──────────────────┘                   │
└─────────────────────────────┘└───────────────────────────────────────┘└───────────────────────────────────────┘
```

This allows staging resources to be created when needed next to the CDK App. It has the following
benefits:

- Resources between separate CDK Apps are separated so they can be cleaned up and lifecycle
controlled individually.
- Users have a familiar way to customize staging resources in the CDK Application.

## Using the Default Staging Stack per Environment

The most common use case will be to use the built-in default resources. In this scenario, the
synthesizer will create a new Staging Stack in each environment the CDK App is deployed to store
its staging resources. To use this kind of synthesizer, use `AppStagingSynthesizer.defaultResources()`.

```ts
const app = new App({
  defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
    appId: 'my-app-id',
  }),
});
```

Every CDK App that uses the `DefaultStagingStack` must include an `appId`. This should
be an identifier unique to the app and is used to differentiate staging resources associated
with the app.

### Default Staging Stack

The Default Staging Stack includes all the staging resources necessary for CDK Assets. The below example
is of a CDK App using the `AppStagingSynthesizer` and creating a file asset for the Lambda Function
source code. As part of the `DefaultStagingStack`, an S3 bucket and IAM role will be created that will be
used to upload the asset to S3.

```ts
const app = new App({
  defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({ appId: 'my-app-id' }),
});

const stack = new Stack(app, 'my-stack');

new lambda.Function(stack, 'lambda', {
  code: lambda.AssetCode.fromAsset(path.join(__dirname, 'assets')),
  handler: 'index.handler',
  runtime: lambda.Runtime.PYTHON_3_9,
});

app.synth();
```

### Custom Roles

You can customize some or all of the roles you'd like to use in the synthesizer as well,
if all you need is to supply custom roles (and not change anything else in the `DefaultStagingStack`):

```ts
const app = new App({
  defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
    appId: 'my-app-id',
    deploymentIdentities: DeploymentIdentities.specifyRoles({
      cloudFormationExecutionRole: BootstrapRole.fromRoleArn('arn:aws:iam::123456789012:role/Execute'),
      deploymentRole: BootstrapRole.fromRoleArn('arn:aws:iam::123456789012:role/Deploy'),
      lookupRole: BootstrapRole.fromRoleArn('arn:aws:iam::123456789012:role/Lookup'),
    }),
  }),
});
```

Or, you can ask to use the CLI credentials that exist at deploy-time.
These credentials must have the ability to perform CloudFormation calls,
lookup resources in your account, and perform CloudFormation deployment.
For a full list of what is necessary, see `LookupRole`, `DeploymentActionRole`,
and `CloudFormationExecutionRole` in the
[bootstrap template](https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk/lib/api/bootstrap/bootstrap-template.yaml).

```ts
const app = new App({
  defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
    appId: 'my-app-id',
    deploymentIdentities: DeploymentIdentities.cliCredentials(),
  }),
});
```

The default staging stack will create roles to publish to the S3 bucket and ECR repositories,
assumable by the deployment role. You can also specify an existing IAM role for the
`fileAssetPublishingRole` or `imageAssetPublishingRole`:

```ts
const app = new App({
  defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
    appId: 'my-app-id',
    fileAssetPublishingRole: BootstrapRole.fromRoleArn('arn:aws:iam::123456789012:role/S3Access'), 
    imageAssetPublishingRole: BootstrapRole.fromRoleArn('arn:aws:iam::123456789012:role/ECRAccess'),
  }),
});
```

### Deploy Time S3 Assets

There are two types of assets:

- Assets used only during deployment. These are used to hand off a large piece of data to another 
service, that will make a private copy of that data. After deployment, the asset is only necessary for 
a potential future rollback. 
- Assets accessed throughout the running life time of the application.

Examples of assets that are only used at deploy time are CloudFormation Templates and Lambda Code
bundles. Examples of assets accessed throughout the life time of the application are script files 
downloaded to run in a CodeBuild Project, or on EC2 instance startup. ECR images are always application 
life-time assets. S3 deploy time assets are stored with a `deploy-time/` prefix, and a lifecycle rule will collect them after a configurable number of days.

Lambda assets are by default marked as deploy time assets:

```ts
declare const stack: Stack;
new lambda.Function(stack, 'lambda', {
  code: lambda.AssetCode.fromAsset(path.join(__dirname, 'assets')), // lambda marks deployTime = true
  handler: 'index.handler',
  runtime: lambda.Runtime.PYTHON_3_9,
});
```

Or, if you want to create your own deploy time asset:

```ts
import { Asset } from 'aws-cdk-lib/aws-s3-assets';

declare const stack: Stack;
const asset = new Asset(stack, 'deploy-time-asset', {
  deployTime: true,
  path: path.join(__dirname, './deploy-time-asset'),
});
```

By default, we store deploy time assets for 30 days, but you can change this number by specifying 
`deployTimeFileAssetLifetime`. The number you specify here is how long you will be able to roll back
to a previous version of an application just by doing a CloudFormation deployment with the old 
template, without rebuilding and republishing assets.

```ts
const app = new App({
  defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
    appId: 'my-app-id',
    deployTimeFileAssetLifetime: Duration.days(100),
  }),
});
```

### Lifecycle Rules on ECR Repositories

By default, we store a maximum of 3 revisions of a particular docker image asset. This allows
for smooth faciliation of rollback scenarios where we may reference previous versions of an
image. When more than 3 revisions of an asset exist in the ECR repository, the oldest one is
purged.

To change the number of revisions stored, use `imageAssetVersionCount`:

```ts
const app = new App({
  defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
    appId: 'my-app-id',
    imageAssetVersionCount: 10,
  }),
});
```

## Using a Custom Staging Stack per Environment

If you want to customize some behavior that is not configurable via properties,
you can implement your own class that implements `IStagingResources`. To get a head start,
you can subclass `DefaultStagingStack`.

```ts
interface CustomStagingStackOptions extends DefaultStagingStackOptions {}

class CustomStagingStack extends DefaultStagingStack {  
}
```

Or you can roll your own staging resources from scratch, as long as it implements `IStagingResources`.

```ts
interface CustomStagingStackProps extends StackProps {}

class CustomStagingStack extends Stack implements IStagingResources {
  public constructor(scope: Construct, id: string, props: CustomStagingStackProps) {
    super(scope, id, props);
  }

  public addFile(asset: FileAssetSource): FileStagingLocation {
    return {
      bucketName: 'myBucket',
      assumeRoleArn: 'myArn',
      dependencyStack: this,
    };
  }

  public addDockerImage(asset: DockerImageAssetSource): ImageStagingLocation {
    return {
      repoName: 'myRepo',
      assumeRoleArn: 'myArn',
      dependencyStack: this,
    };
  }
}
```

Using your custom staging resources means implementing a `CustomFactory` class and calling the
`AppStagingSynthesizer.customFactory()` static method. This has the benefit of providing a
custom Staging Stack that can be created in every environment the CDK App is deployed to.

```ts fixture=with-custom-staging
class CustomFactory implements IStagingResourcesFactory {
  public obtainStagingResources(stack: Stack, context: ObtainStagingResourcesContext) {
    const myApp = App.of(stack);

    return new CustomStagingStack(myApp!, `CustomStagingStack-${context.environmentString}`, {});
  }
}

const app = new App({
  defaultStackSynthesizer: AppStagingSynthesizer.customFactory({
    factory: new CustomFactory(),
    oncePerEnv: true, // by default
  }),
});
```

## Using an Existing Staging Stack

Use `AppStagingSynthesizer.customResources()` to supply an existing stack as the Staging Stack.
Make sure that the custom stack you provide implements `IStagingResources`.

```ts fixture=with-custom-staging
const resourceApp = new App();
const resources = new CustomStagingStack(resourceApp, 'CustomStagingStack', {});

const app = new App({
  defaultStackSynthesizer: AppStagingSynthesizer.customResources({
    resources,
  }),
});
```

## Known Limitations

Since this module is experimental, there are some known limitations:

- Currently this module does not support CDK Pipelines. You must deploy CDK Apps using this 
  synthesizer via `cdk deploy`.
- This synthesizer only needs a bootstrap stack with Roles, without staging resources. We
  haven't written such a bootstrap stack yet; at the moment you can use the existing modern
  bootstrap stack, the staging resources in them will just go unused.
- Due to limitations on the CloudFormation template size, CDK Applications can have
  at most 38 independent ECR images.
- When you run `cdk destroy` (for example during testing), the staging bucket and ECR
  repositories will be left behind because CloudFormation cannot clean up non-empty resources.
  You must deploy those resources manually if you want to redeploy again using the same `appId`.
