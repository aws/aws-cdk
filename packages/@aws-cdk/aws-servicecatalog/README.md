# AWS Service Catalog Construct Library
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

[AWS Service Catalog](https://docs.aws.amazon.com/servicecatalog/latest/dg/what-is-service-catalog.html) enables organizations to create and manage catalogs of products that are approved for use on AWS

## Table Of Contents

- [Portfolio](#portfolio)
- [Product](#product)
- [End Users](#end-users)
- [Constraints](#constraints)
  - [Event Notifications](#read-permissions)
  - [Launch Roles](#launch-role-constraints)
  - [Provisioning Rules](#provisioning-constraints)
  - [Stack Set Constraints](#stackset-constraints)
  - [Resource Updates](#resource-update-constraints)

## Portfolio

AWS Service Catalog portfolios allow admins to manage products that their end users have access to.
Using the CDK, a new portfolio can be created as part of the stack using the construct's constructor.

```ts
import * as servicecatalog from '@aws-cdk/aws-servicecatalog';

new servicecatalog.Portfolio(this, 'MyFirstPortfolio', {
  displayName: 'MyFirstPortfolioName', 
  providerName: 'MyTeam',
});
```

You can also specify properties such as `description`, `acceptLanguage`, and `tags` to help better catalog and manage your 
portfolios.

Read more at [Creating and Managing Portfolios](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/catalogs_portfolios.html)

```ts
import Tag from '@aws-cdk/core';

const tags = Tag({'Project','Foo'})

new servicecatalog.Portfolio(this, 'MyFirstPortfolio', {
  displayName: 'MyFirstPortfolioName', 
  providerName: 'MyTeam',
  description: 'Portfolio for a project',
  tags: tags,
});
```

## Product

Products are the resources you are allowing end users to provision and utilize. 
They can be added to a portfolio, creating a portfolio-product association.
The cdk currently only supports adding products of type Cloudformation product. 

```ts
const portfolio = new servicecatalog.Portfolio(this, 'MyFirstPortfolio', {
  displayName: 'MyFirstPortfolioName', 
  providerName: 'MyTeam'
});

const product = new servicecatalog.Product(this, 'MyFirstProduct', {
  productName: "My Product",
  owner: "Product Owner",
  provisioningArtifacts: [{templateUrl:'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template'},]
});

portfolio.add(product);
// OR
product.addToPortfolio(product);
```

## End Users

After a portfolio is created, you can manage end user access by granting permissions to `IAM` entities like a user, group, or role. 
Once resources are deployed end users will be able to access them via the console or service catalog cli. 

```ts
import * as iam from '@aws-cdk/aws-servicecatalog';

const portfolio = new servicecatalog.Portfolio(this, 'MyFirstPortfolio', {
  displayName: 'MyFirstPortfolioName', 
  providerName: 'MyTeam'
});

const user = new iam.User(this, 'MyUser', {});

const role = new iam.Role(this, 'MyRole', {});

const group = new iam.Group(this, 'MyGroup', {});

portfolio.giveAccess(user);
portfolio.giveAccess(group);
portfolio.giveAccess(role);
```

## Constraints

Constraints define governance mechanisms that allow you to manage permissions and notifications relate to actions on your stacks. 
Using the cdk, if you do not explicity associate a product to a portfolio and add a constraint, it will automatically add the association for you. 

There are rules around plurariliites for constraint configurations.  
For example, you may not have more than one `Launch Role` or `Stack Set` constraint applied to a portfolio-product, and you may not have both of them on same assocation.  
If a misconfigured constraint is added, `synth` will fail with an error message detailing issue.

Read more at [Constraints](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/constraints.html)


### Event Notifications

An event update constraint allows user to specify a list of AWS `SNS` topics to receive notifications about stack events.

```ts
import * as sns from '@aws-cdk/aws-sns';

const portfolio = new servicecatalog.Portfolio(this, 'MyPortfolio', {
  portfolioName: 'Portfolio Name',
  providerName: 'Provider',
  });

const product = new servicecatalog.Product(this, 'MyProduct', {
  productName: 'Product Name',
  owner: 'Product Owner',
  provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
});

const topics = [new sns.Topic(stack, 'topic1'), new sns.Topic(stack, 'topic2'), new sns.Topic(stack, 'topic3')];

portfolio.addEventNotifications({ snsTopics: topics, product: product });
```

### Launch Role

A launch role constraint specifies a role that the end user assumes when launching a product. You cannot have more than one of these applied to a portfolio-product association.

```ts
const portfolio = new servicecatalog.Portfolio(this, 'MyPortfolio', {
  portfolioName: 'Portfolio Name',
  providerName: 'Provider',
  });

const product = new servicecatalog.Product(this, 'MyProduct', {
  productName: 'Product Name',
  owner: 'Product Owner',
  provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
});

const launchRole = new iam.Role(this, 'LaunchRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

portfolio.addLaunchRole({
  role: launchRole,
  product: product,
});

```

### Provisioning Rules

Provisioning rules specify certain options available to end users when launching a product, such as an `instance type`.  
Rules are specified as a JSON string.

```ts
const portfolio = new servicecatalog.Portfolio(this, 'MyPortfolio', {
  portfolioName: 'Portfolio Name',
  providerName: 'Provider',
  });

const product = new servicecatalog.Product(this, 'MyProduct', {
  productName: 'Product Name',
  owner: 'Product Owner',
  provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
});

portfolio.addProvisioningRules({
  product: product,
  rules: {
    'Rule1': {
      'Assertions': [
        {
          'Assert': { 'Fn::Contains': [['t2.micro', 't2.small'], { 'Ref': 'InstanceType' }] },
          'AssertDescription': 'Instance type should be t2.micro or t2.small',
        },
      ],
    },
  },
});
```

### Stack Set Constraints

A stack set constraint allows you to configure product deployment options using AWS CloudFormation StackSets. 
You can specify multiple accounts and regions for the product launch. End users can manage those accounts and determine where products deploy and the order of deployment.


```ts 
const portfolio = new servicecatalog.Portfolio(this, 'MyPortfolio', {
  portfolioName: 'Portfolio Name',
  providerName: 'Provider',
  });

const product = new servicecatalog.Product(this, 'MyProduct', {
  productName: 'Product Name',
  owner: 'Product Owner',
  provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
});

const accountList = ['012345678901',
  '012345678902',
  '012345678903'];

const regionList = ['us-west-1',
  'us-east-1',
  'us-west-2',
  'us-east-1'];

const adminRole = new iam.Role(stack, 'AdminRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

const executionRole = new iam.Role(stack, 'ExecutionRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

portfolio.addStackSetConstraint({
  accountList: accountList,
  adminRole: adminRole,
  executionRole: executionRole,
  product: product,
  regionList: regionList,
});

```

### Resource Updates

Resource update constraints allow or disallow end users to update tags on resources associated with an AWS Service Catalog provisioned product. 
If tag updating is allowed, then new tags associated with the AWS Service Catalog product or portfolio will be applied to provisioned resources during a provisioned product update.

```ts 
const portfolio = new servicecatalog.Portfolio(this, 'MyPortfolio', {
  portfolioName: 'Portfolio Name',
  providerName: 'Provider',
  });

const product = new servicecatalog.Product(this, 'MyProduct', {
  productName: 'Product Name',
  owner: 'Product Owner',
  provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
});

portfolio.allowTagUpdates({
  product: product,
  tagUpdateOnProvisionedProductAllowed: true,
});
```
