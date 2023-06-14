# AWS ServiceCatalogAppRegistry Construct Library
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

[AWS Service Catalog App Registry](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/appregistry.html) 
enables organizations to create and manage repositores of applications and associated resources.

## Table Of Contents

- [Application](#application)
- [Attribute-Group](#attribute-group)
- [Associations](#associations)
  - [Associating application with an attribute group](#attribute-group-association)
  - [Associating application with a stack](#resource-association)

The `@aws-cdk/aws-servicecatalogappregistry` package contains resources that enable users to automate governance and management of their AWS resources at scale.

```ts nofixture
import * as appreg from '@aws-cdk/aws-servicecatalogappregistry';
```

## Application

An AppRegistry application enables you to define your applications and associated resources.
The application name must be unique at the account level, but is mutable.

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
