# AWS Cloud9 Construct Library
<!--BEGIN STABILITY BANNER-->

---

![End-of-Support](https://img.shields.io/badge/End--of--Support-critical.svg?style=for-the-badge)

> AWS CDK v1 has reached End-of-Support on 2023-06-01.
> This package is no longer being updated, and users should migrate to AWS CDK v2.
>
> For more information on how to migrate, see the [_Migrating to AWS CDK v2_ guide][doc].
>
> [doc]: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html

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
new cloud9.Ec2Environment(this, 'Cloud9Env', { vpc });

// or create the cloud9 environment in the default VPC with specific instanceType
const defaultVpc = ec2.Vpc.fromLookup(this, 'DefaultVPC', { isDefault: true });
new cloud9.Ec2Environment(this, 'Cloud9Env2', {
  vpc: defaultVpc,
  instanceType: new ec2.InstanceType('t3.large'),
});

// or specify in a different subnetSelection 
const c9env = new cloud9.Ec2Environment(this, 'Cloud9Env3', {
  vpc,
  subnetSelection: {
    subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
  },
});

// print the Cloud9 IDE URL in the output
new CfnOutput(this, 'URL', { value: c9env.ideUrl });
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
});
```
