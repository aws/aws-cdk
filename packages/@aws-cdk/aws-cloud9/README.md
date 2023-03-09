# AWS Cloud9 Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

AWS Cloud9 is a cloud-based integrated development environment (IDE) that lets you write, run, and debug your code with just a
browser. It includes a code editor, debugger, and terminal. Cloud9 comes prepackaged with essential tools for popular
programming languages, including JavaScript, Python, PHP, and more, so you don’t need to install files or configure your
development machine to start new projects. Since your Cloud9 IDE is cloud-based, you can work on your projects from your
office, home, or anywhere using an internet-connected machine. Cloud9 also provides a seamless experience for developing
serverless applications enabling you to easily define resources, debug, and switch between local and remote execution of
serverless applications. With Cloud9, you can quickly share your development environment with your team, enabling you to pair
program and track each other's inputs in real time.


## Creating EC2 Environment

EC2 Environments are defined with `Ec2Environment`. To create an EC2 environment in the private subnet, specify
`subnetSelection` with private `subnetType`.


```ts
// create a cloud9 ec2 environment in a new VPC
const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 3});
new cloud9.Ec2Environment(this, 'Cloud9Env', { vpc, imageId: cloud9.ImageId.AMAZON_LINUX_2, });

// or create the cloud9 environment in the default VPC with specific instanceType
const defaultVpc = ec2.Vpc.fromLookup(this, 'DefaultVPC', { isDefault: true });
new cloud9.Ec2Environment(this, 'Cloud9Env2', {
  vpc: defaultVpc,
  instanceType: new ec2.InstanceType('t3.large'),
  imageId: cloud9.ImageId.AMAZON_LINUX_2,
});

// or specify in a different subnetSelection
const c9env = new cloud9.Ec2Environment(this, 'Cloud9Env3', {
  vpc,
  subnetSelection: {
    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
  },
  imageId: cloud9.ImageId.AMAZON_LINUX_2,
});

// print the Cloud9 IDE URL in the output
new CfnOutput(this, 'URL', { value: c9env.ideUrl });
```

## Specifying EC2 AMI

Use `imageId` to specify the EC2 AMI image to be used:

```ts
const defaultVpc = ec2.Vpc.fromLookup(this, 'DefaultVPC', { isDefault: true });
new cloud9.Ec2Environment(this, 'Cloud9Env2', {
  vpc: defaultVpc,
  instanceType: new ec2.InstanceType('t3.large'),
  imageId: cloud9.ImageId.UBUNTU_18_04,
});
```

## Cloning Repositories

Use `clonedRepositories` to clone one or multiple AWS Codecommit repositories into the environment:

```ts
import * as codecommit from '@aws-cdk/aws-codecommit';

// create a codecommit repository to clone into the cloud9 environment
const repoNew = new codecommit.Repository(this, 'RepoNew', {
  repositoryName: 'new-repo',
});

// import an existing codecommit repository to clone into the cloud9 environment
const repoExisting = codecommit.Repository.fromRepositoryName(this, 'RepoExisting', 'existing-repo');

// create a new Cloud9 environment and clone the two repositories
declare const vpc: ec2.Vpc;
new cloud9.Ec2Environment(this, 'C9Env', {
  vpc,
  clonedRepositories: [
    cloud9.CloneRepository.fromCodeCommit(repoNew, '/src/new-repo'),
    cloud9.CloneRepository.fromCodeCommit(repoExisting, '/src/existing-repo'),
  ],
  imageId: cloud9.ImageId.AMAZON_LINUX_2,
});
```

## Specifying Owners

Every Cloud9 Environment has an **owner**. An owner has full control over the environment, and can invite additional members to the environment for collaboration purposes. For more information, see [Working with shared environments in AWS Cloud9](https://docs.aws.amazon.com/cloud9/latest/user-guide/share-environment.html)).

By default, the owner will be the identity that creates the Environment, which is most likely your CloudFormation Execution Role when the Environment is created using CloudFormation. Provider a value for the `owner` property to assign a different owner, either a specific IAM User or the AWS Account Root User.

`Owner` is a user that owns a Cloud9 environment . `Owner` has their own access permissions, resources. And we can specify an `Owner`in an Ec2 environment which could be of two types, 1. AccountRoot and 2. Iam User. It allows AWS to determine who has permissions to manage the environment, either an IAM user or the account root user (but using the account root user is not recommended, see [environment sharing best practices](https://docs.aws.amazon.com/cloud9/latest/user-guide/share-environment.html#share-environment-best-practices)).

To specify the AWS Account Root User as the environment owner, use `Owner.accountRoot()`

```ts
declare const vpc: ec2.Vpc;
new cloud9.Ec2Environment(this, 'C9Env', {
  vpc,
  imageId: cloud9.ImageId.AMAZON_LINUX_2,

  owner: cloud9.Owner.accountRoot('111111111')
})
```

To specify a specific IAM User as the environment owner, use `Owner.user()`. The user should have the `AWSCloud9Administrator` managed policy

```ts
import * as iam from '@aws-cdk/aws-iam';

const user = new iam.User(this, 'user');
user.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSCloud9Administrator'));
declare const vpc: ec2.Vpc;
new cloud9.Ec2Environment(this, 'C9Env', {
  vpc,
  imageId: cloud9.ImageId.AMAZON_LINUX_2,

  owner: cloud9.Owner.user(user)
})
```
