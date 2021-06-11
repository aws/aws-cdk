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
- [End Users](#end-users)
- [Sharing](#share)


The `@aws-cdk/aws-servicecatalog` package contains resources that enable users to automate governance and management of their AWS resources at scale.

```ts nofixture
import * as servicecatalog from '@aws-cdk/aws-servicecatalog';
```

## Portfolio

AWS Service Catalog portfolios allow admins to manage products that their end users have access to.
Using the CDK, a new portfolio can be created as part of the stack using the construct's constructor.

```ts
new servicecatalog.Portfolio(this, 'MyFirstPortfolio', {
  name: 'MyFirstPortfolio', 
  provider: 'MyTeam',
});
```

You can also specify properties such as `description` and `acceptLanguage` to help better catalog and manage your 
portfolios.

Read more at [Creating and Managing Portfolios](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/catalogs_portfolios.html).

```ts
new servicecatalog.Portfolio(this, 'MyFirstPortfolio', {
  name: 'MyFirstPortfolio', 
  provider: 'MyTeam',
  description: 'Portfolio for a project',
  acceptLanguage: servicecatalog.AcceptLanguage.EN
});
```

A portfolio that has been created outside the stack can be imported into your CDK app.
Portfolios can be imported by their ARN via the `Portfolio.fromPortfolioArn()` API.

```ts
servicecatalog.Portfolio.fromPortfolioArn(this, 'MyImportedPortfolio','arn:aws:catalog:region:account-id:portfolio/port-abcdefghi');
```

## End Users

You can manage end user access to a portfolio by granting permissions to `IAM` entities like a user, group, or role. 
Once resources are deployed end users will be able to access them via the console or service catalog CLI. 

```ts
const portfolio = new servicecatalog.Portfolio(this, 'MyFirstPortfolio', {
  name: 'MyFirstPortfolioName', 
  provider: 'MyTeam'
});

const user = new iam.User(this, 'MyUser', {
  userName: 'MyUserName'
});

const role = new iam.Role(this, 'MyRole', {
  assumedBy: new iam.AccountRootPrincipal(),
  roleName: 'MyRoleName'
});

const group = new iam.Group(this, 'MyGroup', {
  groupName: 'MyGroupName'
});

portfolio.giveAccessToUser(user);
portfolio.giveAccessToGroup(group);
portfolio.giveAccessToRole(role);
```

## Sharing

A portfolio can be programatically shared with other accounts so that specified users can also access it.

```ts
const portfolio = new servicecatalog.Portfolio(this, 'MyFirstPortfolio', {
  name: 'MyFirstPortfolioName', 
  provider: 'MyTeam'
});

const accountToShareWithId = '012345678901';

portfolio.share(accountToShareWithId);
```
