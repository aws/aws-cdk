# AWS CloudFormation Construct Library


This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## StackSets

The `StackSetStack` and `StackSet` constructs allows you to define [AWS CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html).

```ts
const stack = new Stack();
const stackSetStack = new StackSetStack(stack, 'MyStackSet');

new StackSet(stack, 'StackSet', {
  target: StackSetTarget.fromAccounts({
    regions: ['us-east-1'],
    accounts: ['11111111111'],
    parameterOverrides: {
      SomeParam: 'overrideValue',
    },
  }),
  template: StackSetTemplate.fromStackSetStack(stackSetStack),
});
```

### Creating a StackSet Stack

StackSets allow you to deploy a single CloudFormation template across multiple AWS accounts and regions.
Typically when creating a CDK Stack that will be deployed across multiple environments, the CDK will
synthesize separate Stack templates for each environment (account/region combination). Because of the
way that StackSets work, StackSet Stacks behave differently. For Stacks that will be deployed via StackSets
a single Stack is defined and synthesized. Any environmental differences must be encoded using Parameters.

A special class was created to handle the uniqueness of the StackSet Stack.
You declare a `StackSetStack` the same way that you declare a normal `Stack`, but there
are a couple of differences. `StackSetStack`s have a couple of special requirements/limitations when
compared to Stacks.

*Requirements*
- Must be created in the scope of a `Stack`
- Must be environment agnostic

*Limitations*
- Does not support Docker container assets

Once you create a `StackSetStack` you can create resources within the stack.
```ts
const stack = new Stack();
const stackSetStack = new StackSetStack(stack, 'StackSet');

new iam.Role(stackSetStack, 'MyRole', {
  assumedBy: new iam.ServicePrincipal('myservice.amazonaws.com'),
});
```

Or
```ts
class MyStackSet extends StackSetStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new iam.Role(this, 'MyRole', {
      assumedBy: new iam.ServicePrincipal('myservice.amazonaws.com'),
    });
  }
}
```

### Creating a StackSet

AWS CloudFormation StackSets enable you to create, update, or delete stacks across multiple accounts and AWS Regions
with a single operation. Using an administrator account, you define and manage an AWS CloudFormation template, and use
the template as the basis for provisioning stacks into selected target accounts across specific AWS Regions.

There are two methods for defining _where_ the StackSet should be deployed. You can either define individual accounts, or
you can define AWS Organizations organizational units.

#### Deploying to individual accounts

Deploying to individual accounts requires you to specify the account ids. If you want to later deploy to additional accounts,
or remove the stackset from accounts, this has to be done by adding/removing the account id from the list.

```ts
const stack = new Stack();
const stackSetStack = new StackSetStack(stack, 'MyStackSet');

new StackSet(stack, 'StackSet', {
  target: StackSetTarget.fromAccounts({
    regions: ['us-east-1'],
    accounts: ['11111111111'],
  }),
  template: StackSetTemplate.fromStackSetStack(stackSetStack),
});
```

#### Deploying to organizational units

AWS Organizations is an AWS service that enables you to centrally manage and govern multiple accounts.
AWS Organizations allows you to define organizational units (OUs) which are logical groupings of AWS accounts.
OUs enable you to organize your accounts into a hierarchy and make it easier for you to apply management controls.
For a deep dive on OU best practices you can read the [Best Practices for Organizational Units with AWS Organizations](https://aws.amazon.com/blogs/mt/best-practices-for-organizational-units-with-aws-organizations/) blog post.

You can either specify the organization itself, or individual OUs. By default the StackSet will be deployed
to all AWS accounts that are part of the OU. If the OU is nested it will also deploy to all accounts
that are part of any nested OUs.

For example, given the following org hierarchy

```mermaid
graph TD
  root-->ou-1;
  root-->ou-2;
  ou-1-->ou-3;
  ou-1-->ou-4;
  ou-3-->account-1;
  ou-3-->account-2;
  ou-4-->account-4;
  ou-2-->account-3;
  ou-2-->account-5;
```

You could deploy to all AWS accounts under OUs `ou-1`, `ou-3`, `ou-4` by specifying the following:

```ts
const stack = new Stack();
const stackSetStack = new StackSetStack(stack, 'MyStackSet');

new StackSet(stack, 'StackSet', {
  target: StackSetTarget.fromOrganizationalUnits({
    regions: ['us-east-1'],
    organizationalUnits: ['ou-1'],
  }),
  template: StackSetTemplate.fromStackSetStack(stackSetStack),
});
```

This would deploy the StackSet to `account-1`, `account-2`, `account-4`.

If there are specific AWS accounts that are part of the specified OU hierarchy that you would like
to exclude, this can be done by specifying `excludeAccounts`.

```ts
const stack = new Stack();
const stackSetStack = new StackSetStack(stack, 'MyStackSet');

new StackSet(stack, 'StackSet', {
  target: StackSetTarget.fromOrganizationalUnits({
    regions: ['us-east-1'],
    organizationalUnits: ['ou-1'],
	excludeAccounts: ['account-2'],
  }),
  template: StackSetTemplate.fromStackSetStack(stackSetStack),
});
```

This would deploy only to `account-1` & `account-4`, and would exclude `account-2`.

Sometimes you might have individual accounts that you would like to deploy the StackSet to, but
you do not want to include the entire OU. To do that you can specify `additionalAccounts`.

```ts
const stack = new Stack();
const stackSetStack = new StackSetStack(stack, 'MyStackSet');

new StackSet(stack, 'StackSet', {
  target: StackSetTarget.fromOrganizationalUnits({
    regions: ['us-east-1'],
    organizationalUnits: ['ou-1'],
	additionalAccounts: ['account-5'],
  }),
  template: StackSetTemplate.fromStackSetStack(stackSetStack),
});
```

This would deploy the StackSet to `account-1`, `account-2`, `account-4` & `account-5`.

#### StackSet permissions

There are two modes for managing StackSet permissions (i.e. _where_ StackSets can deploy & _what_ resources they can create).
A StackSet can either be `Service Managed` or `Self Managed`.

You can control this through the `deploymentType` parameter.

##### Service Managed

When a StackSet is service managed, the permissions are managed by AWS Organizations. This allows the StackSet to deploy the Stack to _any_
account within the organization. In addition, the StackSet will be able to create _any_ type of resource.

```ts
const stack = new Stack();
const stackSetStack = new StackSetStack(stack, 'MyStackSet');

new StackSet(stack, 'StackSet', {
  target: StackSetTarget.fromOrganizationalUnits({
    regions: ['us-east-1'],
    organizationalUnits: ['ou-1'],
  }),
  deploymentType: DeploymentType.serviceManaged(),
  template: StackSetTemplate.fromStackSetStack(stackSetStack),
});
```

When you specify `serviceManaged` deployment type, automatic deployments are enabled by default.
Automatic deployments allow the StackSet to be automatically deployed to or deleted from
AWS accounts when they are added or removed from the specified organizational units.

#### Using File Assets

You can use the StackSet's parent stack to facilitate file assets. Behind the scenes,
this is accomplished using the `BucketDeployment` construct from the
`aws_s3_deployment` module. You need to provide a list of buckets outside the scope of the CDK
managed asset buckets and ensure you have permissions for the target accounts to pull
the artifacts from the supplied bucket(s).

As a basic example, if using a `serviceManaged` deployment, you just need to give read
access to the Organization. You can create the asset bucket in the parent stack, or another
stack in the same app and pass the object as a prop. Or, import an existing bucket as needed.

If creating in the parent or sibling stack you could create and export similar to this:

```ts
const bucket = new s3.Bucket(this, "Assets", {
  bucketName: "prefix-us-east-1",
});

bucket.addToResourcePolicy(
  new iam.PolicyStatement({
    actions: ["s3:Get*", "s3:List*"],
    resources: [bucket.arnForObjects("*"), bucket.bucketArn],
    principals: [new iam.OrganizationPrincipal("o-xyz")],
  })
);
```

Then pass as a prop to the StackSet stack:

```ts
declare const bucket: s3.Bucket;
const stack = new Stack();
const stackSetStack = new StackSetStack(stack, 'MyStackSet', {
  assetBuckets: [bucket],
  assetBucketPrefix: "prefix",
});
```

To faciliate multi region deployments, there is an assetBucketPrefix property. This 
gets added to the region the Stack Set is deployed to. The stack synthesis for 
the Stack Set would look for a bucket named `prefix-{Region}` in the example 
above. `{Region}` is whatever region you are deploying the Stack Set to as 
defined in your target property of the StackSet. You will need to ensure the 
bucket name is correct based on what was previously created and then passed in.

You can use self-managed StackSet deployments with file assets too but will
need to ensure all target accounts roles will have access to the central asset
bucket you pass as the property.

### Deploying StackSets using CDK Pipelines

You can also deploy StackSets using [CDK Pipelines](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html)

Below is an example of a Pipeline that deploys from a central account. It also
defines separate stages for each "environment" so that you can first test out
the stackset in pre-prod environments.

This would be an automated way of deploying the bootstrap stack described in
[this blog
post](https://aws.amazon.com/blogs/mt/bootstrapping-multiple-aws-accounts-for-aws-cdk-using-cloudformation-stacksets/).

```ts
declare const app: App;
interface BootstrapStageProps extends StageProps {
  readonly initialBootstrapTarget: StackSetTarget;
  readonly stacksetName?: string;
}

class BootstrapStage extends Stage {
  constructor(scope: Construct, id: string, props: BootstrapStageProps) {
    super(scope, id, props);

    const stack = new Stack(this, 'BootstrapStackSet');

    const bootstrap = new Bootstrap(stack, 'CDKToolkit');

    const stackSet = new StackSet(stack, 'StackSet', {
      template: StackSetTemplate.fromStackSetStack(bootstrap),
      target: props.initialBootstrapTarget,
      capabilities: [Capability.NAMED_IAM],
      managedExecution: true,
      stackSetName: props.stacksetName,
      deploymentType: DeploymentType.serviceManaged({
        delegatedAdmin: true,
        autoDeployEnabled: true,
        autoDeployRetainStacks: false,
      }),
      operationPreferences: {
        regionConcurrencyType: RegionConcurrencyType.PARALLEL,
        maxConcurrentPercentage: 100,
        failureTolerancePercentage: 99,
      },
    });
  }
}


const pipeline = new pipelines.CodePipeline(this, 'BootstrapPipeline', {
  synth: new pipelines.ShellStep('Synth', {
    commands: [
      'yarn install --frozen-lockfile',
      'npx cdk synth',
    ],
    input: pipelines.CodePipelineSource.connection('myorg/myrepo', 'main', {
      connectionArn: 'arn:aws:codestar-connections:us-east-2:111111111111:connection/ca65d487-ca6e-41cc-aab2-645db37fdb2b',
    }),
  }),
  selfMutation: true,
});

const regions = [
  'us-east-1',
  'us-east-2',
  'us-west-2',
  'eu-west-2',
  'eu-west-1',
  'ap-south-1',
  'ap-southeast-1',
];

pipeline.addStage(
  new BootstrapStage(app, 'DevBootstrap', {
    env: {
      region: 'us-east-1',
      account: '111111111111',
    },
    stacksetName: 'CDKToolkit-dev',
    initialBootstrapTarget: StackSetTarget.fromOrganizationalUnits({
      regions,
      organizationalUnits: ['ou-hrza-ar333427'],
    }),
  }),
);

pipeline.addStage(
  new BootstrapStage(app, 'ProdBootstrap', {
    env: {
      region: 'us-east-1',
      account: '111111111111',
    },
    stacksetName: 'CDKToolkit-prd',
    initialBootstrapTarget: StackSetTarget.fromOrganizationalUnits({
      regions,
      organizationalUnits: ['ou-hrza-bb999427', 'ou-hraa-ar111127'],
    }),
  }),
);
```
