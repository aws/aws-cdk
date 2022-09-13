# AWS ServiceCatalogAppRegistry Construct Library
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

[AWS Service Catalog App Registry](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/appregistry.html)
enables organizations to create and manage repositores of applications and associated resources.

## Table Of Contents

- [Application](#application)
- [Automatic-Application](#automatic-application)
- [Attribute-Group](#attribute-group)
- [Associations](#associations)
  - [Associating application with an attribute group](#attribute-group-association)
  - [Associating application with a stack](#resource-association)
- [Sharing](#sharing)
  - [Sharing an application](#sharing-an-application)
  - [Sharing an attribute group](#sharing-an-attribute-group)

The `@aws-cdk/aws-servicecatalogappregistry` package contains resources that enable users to automate governance and management of their AWS resources at scale.

```ts nofixture
import * as appreg from '@aws-cdk/aws-servicecatalogappregistry';
```

## Application

An AppRegistry application enables you to define your applications and associated resources.
The application name must be unique at the account level and it's immutable.

```ts
const application = new appreg.Application(this, 'MyFirstApplication', {
  applicationName: 'MyFirstApplicationName',
  description: 'description for my application', // the description is optional
});
```

An application that has been created outside of the stack can be imported into your CDK app.
Applications can be imported by their ARN via the `Application.fromApplicationArn()` API:

```ts
const importedApplication = appreg.Application.fromApplicationArn(
  this,
  'MyImportedApplication',
  'arn:aws:servicecatalog:us-east-1:012345678910:/applications/0aqmvxvgmry0ecc4mjhwypun6i',
);
```

## Automatic-Application

An AppRegistry L2 construct to automatically create an application with the given name and description.
The application name must be unique at the account level and it's immutable.
`AutomaticApplication` L2 construct will automatically associate all stacks in the given scope, however
in case of a `Pipeline` stack, stage underneath the pipeline will not automatically be associated and
needs to be associated separately.
If cross account stack is detected, then this construct will automatically share the application to consumer accounts.
Cross account feature will only work for non environment agnostic stacks.

Following will create an Application named `MyAutoApplication` in account `123456789012` and region `us-east-1`
and will associate all stacks in the `App` scope to `MyAutoApplication`.

```ts
const app = new App();
const autoApp = new appreg.AutomaticApplication(app, 'AutoApplication', {
    applicationName: 'MyAutoApplication',
    description: 'Testing auto application',
    stackProps: {
        stackName: 'MyAutoApplicationStack',
        env: {account: '123456789012', region: 'us-east-1'},
    },
});
```

In case of a Pipeline stack, you need to pass the reference of `AutomaticApplication` to pipeline stack and associate
each stage as shown below:

```ts
import * as cdk from "@aws-cdk/core";
import * as codepipeline from "@aws-cdk/pipelines";
import * as codecommit from "@aws-cdk/aws-codecommit";
declare const repo: codecommit.Repository;
declare const pipeline: codepipeline.CodePipeline;
declare const beta: cdk.Stage;
class ApplicationPipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: ApplicationPipelineStackProps) {
    super(scope, id, props);
    
   //associate the stage to automatic application.
   props.application.associateStage(beta, this.stackName);
   pipeline.addStage(beta);
  }
};

interface ApplicationPipelineStackProps extends cdk.StackProps {
  application: appreg.AutomaticApplication;
};

const app = new App();
const autoApp = new appreg.AutomaticApplication(app, 'AutoApplication', {
    applicationName: 'MyPipelineAutoApplication',
    description: 'Testing pipeline auto app',
    stackProps: {
        stackName: 'MyPipelineAutoApplicationStack',
        env: {account: '123456789012', region: 'us-east-1'},
    },
});

const cdkPipeline = new ApplicationPipelineStack(app, 'CDKApplicationPipelineStack', {
    application: autoApp,
    env: {account: '123456789012', region: 'us-east-1'},
});
```

## Attribute Group

An AppRegistry attribute group acts as a container for user-defined attributes for an application.
Metadata is attached in a machine-readble format to integrate with automated workflows and tools.

```ts
const attributeGroup = new appreg.AttributeGroup(this, 'MyFirstAttributeGroup', {
  attributeGroupName: 'MyFirstAttributeGroupName',
  description: 'description for my attribute group', // the description is optional,
  attributes: {
    project: 'foo',
    team: ['member1', 'member2', 'member3'],
    public: false,
    stages: {
      alpha: 'complete',
      beta: 'incomplete',
      release: 'not started'
    }
  }
});
```

An attribute group that has been created outside of the stack can be imported into your CDK app.
Attribute groups can be imported by their ARN via the `AttributeGroup.fromAttributeGroupArn()` API:

```ts
const importedAttributeGroup = appreg.AttributeGroup.fromAttributeGroupArn(
  this,
  'MyImportedAttrGroup',
  'arn:aws:servicecatalog:us-east-1:012345678910:/attribute-groups/0aqmvxvgmry0ecc4mjhwypun6i',
);
```

## Associations

You can associate your appregistry application with attribute groups and resources.
Resources are CloudFormation stacks that you can associate with an application to group relevant
stacks together to enable metadata rich insights into your applications and resources.
A Cloudformation stack can only be associated with one appregistry application.
If a stack is associated with multiple applications in your app or is already associated with one,
CDK will fail at deploy time.

### Associating application with an attribute group

You can associate an attribute group with an application with the `associateAttributeGroup()` API:

```ts
declare const application: appreg.Application;
declare const attributeGroup: appreg.AttributeGroup;
application.associateAttributeGroup(attributeGroup);
```

### Associating application with a Stack

You can associate a stack with an application with the `associateStack()` API:

```ts
const app = new App();
const myStack = new Stack(app, 'MyStack');

declare const application: appreg.Application;
application.associateStack(myStack);
```

## Sharing

You can share your AppRegistry applications and attribute groups with AWS Organizations, Organizational Units (OUs), AWS accounts within an organization, as well as IAM roles and users. AppRegistry requires that AWS Organizations is enabled in an account before deploying a share of an application or attribute group.

### Sharing an application

```ts
import * as iam from '@aws-cdk/aws-iam';
declare const application: appreg.Application;
declare const myRole: iam.IRole;
declare const myUser: iam.IUser;
application.shareApplication({
  accounts: ['123456789012'],
  organizationArns: ['arn:aws:organizations::123456789012:organization/o-my-org-id'],
  roles: [myRole],
  users: [myUser],
});
```

E.g., sharing an application with multiple accounts and allowing the accounts to associate resources to the application.

```ts
import * as iam from '@aws-cdk/aws-iam';
declare const application: appreg.Application;
application.shareApplication({
  accounts: ['123456789012', '234567890123'],
  sharePermission: appreg.SharePermission.ALLOW_ACCESS,
});
```

### Sharing an attribute group

```ts
import * as iam from '@aws-cdk/aws-iam';
declare const attributeGroup: appreg.AttributeGroup;
declare const myRole: iam.IRole;
declare const myUser: iam.IUser;
attributeGroup.shareAttributeGroup({
  accounts: ['123456789012'],
  organizationArns: ['arn:aws:organizations::123456789012:organization/o-my-org-id'],
  roles: [myRole],
  users: [myUser],
});
```

E.g., sharing an application with multiple accounts and allowing the accounts to associate applications to the attribute group.

```ts
import * as iam from '@aws-cdk/aws-iam';
declare const attributeGroup: appreg.AttributeGroup;
attributeGroup.shareAttributeGroup({
  accounts: ['123456789012', '234567890123'],
  sharePermission: appreg.SharePermission.ALLOW_ACCESS,
});
```
