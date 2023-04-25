# AWS Service Catalog Construct Library


[AWS Service Catalog](https://docs.aws.amazon.com/servicecatalog/latest/dg/what-is-service-catalog.html)
enables organizations to create and manage catalogs of products for their end users that are approved for use on AWS.

## Table Of Contents

- [Portfolio](#portfolio)
  - [Granting access to a portfolio](#granting-access-to-a-portfolio)
  - [Sharing a portfolio with another AWS account](#sharing-a-portfolio-with-another-aws-account)
- [Product](#product)
  - [Creating a product from a local asset](#creating-a-product-from-local-asset)
  - [Creating a product from a stack](#creating-a-product-from-a-stack)
  - [Using Assets in your Product Stack](#using-aseets-in-your-product-stack)
  - [Creating a Product from a stack with a history of previous versions](#creating-a-product-from-a-stack-with-a-history-of-all-previous-versions)
  - [Adding a product to a portfolio](#adding-a-product-to-a-portfolio)
- [TagOptions](#tag-options)
- [Constraints](#constraints)
  - [Tag update constraint](#tag-update-constraint)
  - [Notify on stack events](#notify-on-stack-events)
  - [CloudFormation template parameters constraint](#cloudformation-template-parameters-constraint)
  - [Set launch role](#set-launch-role)
  - [Deploy with StackSets](#deploy-with-stacksets)


The `@aws-cdk/aws-servicecatalog` package contains resources that enable users to automate governance and management of their AWS resources at scale.

```ts nofixture
import * as servicecatalog from 'aws-cdk-lib/aws-servicecatalog';
```

## Portfolio

AWS Service Catalog portfolios allow administrators to organize, manage, and distribute cloud resources for their end users.
Using the CDK, a new portfolio can be created with the `Portfolio` construct:

```ts
new servicecatalog.Portfolio(this, 'Portfolio', {
  displayName: 'MyPortfolio',
  providerName: 'MyTeam',
});
```

You can also specify optional metadata properties such as `description` and `messageLanguage`
to help better catalog and manage your portfolios.

```ts
new servicecatalog.Portfolio(this, 'Portfolio', {
  displayName: 'MyFirstPortfolio',
  providerName: 'SCAdmin',
  description: 'Portfolio for a project',
  messageLanguage: servicecatalog.MessageLanguage.EN,
});
```

Read more at [Creating and Managing Portfolios](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/catalogs_portfolios.html).

To reference an existing portfolio into your CDK application, use the `Portfolio.fromPortfolioArn()` factory method:

```ts
const portfolio = servicecatalog.Portfolio.fromPortfolioArn(this, 'ReferencedPortfolio',
  'arn:aws:catalog:region:account-id:portfolio/port-abcdefghi');
```

### Granting access to a portfolio

You can grant access to and manage the `IAM` users, groups, or roles that have access to the products within a portfolio.
Entities with granted access will be able to utilize the portfolios resources and products via the console or AWS CLI.
Once resources are deployed end users will be able to access them via the console or service catalog CLI.

```ts
declare const portfolio: servicecatalog.Portfolio;

const user = new iam.User(this, 'User');
portfolio.giveAccessToUser(user);

const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.AccountRootPrincipal(),
});
portfolio.giveAccessToRole(role);

const group = new iam.Group(this, 'Group');
portfolio.giveAccessToGroup(group);
```

### Sharing a portfolio with another AWS account

You can use account-to-account sharing to distribute a reference to your portfolio to other AWS accounts by passing the recipient account number.
After the share is initiated, the recipient account can accept the share via CLI or console by importing the portfolio ID.
Changes made to the shared portfolio will automatically propagate to recipients.

```ts
declare const portfolio: servicecatalog.Portfolio;
portfolio.shareWithAccount('012345678901');
```

## Product

Products are version friendly infrastructure-as-code templates that admins create and add to portfolios for end users to provision and create AWS resources.
Service Catalog supports products from AWS Marketplace or ones defined by a CloudFormation template.
The CDK currently only supports adding products of type CloudFormation.
Using the CDK, a new Product can be created with the `CloudFormationProduct` construct.
You can use `CloudFormationTemplate.fromUrl` to create a Product from a CloudFormation template directly from a URL that points to the template in S3, GitHub, or CodeCommit:

```ts
const product = new servicecatalog.CloudFormationProduct(this, 'MyFirstProduct', {
  productName: "My Product",
  owner: "Product Owner",
  productVersions: [
    {
      productVersionName: "v1",
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl(
        'https://raw.githubusercontent.com/awslabs/aws-cloudformation-templates/master/aws/services/ServiceCatalog/Product.yaml'),
    },
  ],
});
```

### Creating a product from a local asset

A `CloudFormationProduct` can also be created by using a CloudFormation template held locally on disk using Assets.
Assets are files that are uploaded to an S3 Bucket before deployment.
`CloudFormationTemplate.fromAsset` can be utilized to create a Product by passing the path to a local template file on your disk:

```ts
import * as path from 'path';

const product = new servicecatalog.CloudFormationProduct(this, 'Product', {
  productName: "My Product",
  owner: "Product Owner",
  productVersions: [
    {
      productVersionName: "v1",
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl(
        'https://raw.githubusercontent.com/awslabs/aws-cloudformation-templates/master/aws/services/ServiceCatalog/Product.yaml'),
    },
    {
      productVersionName: "v2",
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(path.join(__dirname, 'development-environment.template.json')),
    },
  ],
});
```

### Creating a product from a stack

You can create a Service Catalog `CloudFormationProduct` entirely defined with CDK code using a service catalog `ProductStack`.
A separate child stack for your product is created and you can add resources like you would for any other CDK stack,
such as an S3 Bucket, IAM roles, and EC2 instances. This stack is passed in as a product version to your
product.  This will not create a separate CloudFormation stack during deployment.

```ts
import * as cdk from 'aws-cdk-lib';

class S3BucketProduct extends servicecatalog.ProductStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new s3.Bucket(this, 'BucketProduct');
  }
}

const product = new servicecatalog.CloudFormationProduct(this, 'Product', {
  productName: "My Product",
  owner: "Product Owner",
  productVersions: [
    {
      productVersionName: "v1",
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new S3BucketProduct(this, 'S3BucketProduct')),
    },
  ],
});
```

### Using Assets in your Product Stack

You can reference assets in a Product Stack. For example, we can add a handler to a Lambda function or a S3 Asset directly from a local asset file.
In this case, you must provide a S3 Bucket with a bucketName to store your assets.

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { Bucket } from "aws-cdk-lib/aws-s3";

class LambdaProduct extends servicecatalog.ProductStack {
  constructor(scope: Construct, id: string, props: servicecatalog.ProductStackProps) {
    super(scope, id, props);

    new lambda.Function(this, 'LambdaProduct', {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset("./assets"),
      handler: 'index.handler'
    });
  }
}

const userDefinedBucket = new Bucket(this, `UserDefinedBucket`, {
  bucketName: 'user-defined-bucket-for-product-stack-assets',
});

const product = new servicecatalog.CloudFormationProduct(this, 'Product', {
  productName: "My Product",
  owner: "Product Owner",
  productVersions: [
    {
      productVersionName: "v1",
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new LambdaProduct(this, 'LambdaFunctionProduct', {
        assetBucket: userDefinedBucket,
      })),
    },
  ],
});
```

When a product containing an asset is shared with a spoke account, the corresponding asset bucket
will automatically grant read permissions to the spoke account.
Note, it is not recommended using a referenced bucket as permissions cannot be added from CDK.
In this case, it will be your responsibility to grant read permissions for the asset bucket to
the spoke account.
If you want to provide your own bucket policy or scope down your bucket policy further to only allow
reads from a specific launch role, refer to the following example policy:

```ts
declare const bucket: s3.IBucket;

new iam.PolicyStatement({
  actions: [
    's3:GetObject*',
    's3:GetBucket*',
    's3:List*', ],
  effect: iam.Effect.ALLOW,
  resources: [
    bucket.bucketArn,
    bucket.arnForObjects('*'),
  ],
  principals: [
    new iam.ArnPrincipal(Stack.of(this).formatArn({
      service: 'iam',
      region: '',
      account: '111111111111',
      resource: 'role',
      resourceName: 'MyLaunchRole',
    }))
  ],
  conditions: {
    'ForAnyValue:StringEquals': {
      'aws:CalledVia': ['cloudformation.amazonaws.com'],
    },
    'Bool': {
      'aws:ViaAWSService': true,
    },
  },
});
```

Furthermore, in order for a spoke account to provision a product with an asset, the role launching
the product needs permissions to read from the asset bucket.
We recommend you utilize a launch role with permissions to read from the asset bucket.
For example your launch role would need to include at least the following policy:

```json
{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "*"
    }
  ]
}
```

Please refer to [Set launch role](#set-launch-role) for additional details about launch roles.
See [Launch Constraint](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/constraints-launch.html) documentation
to understand the permissions that launch roles need.

### Creating a Product from a stack with a history of previous versions

The default behavior of Service Catalog is to overwrite each product version upon deployment.
This applies to Product Stacks as well, where only the latest changes to your Product Stack will
be deployed.
To keep a history of the revisions of a ProductStack available in Service Catalog,
you would need to define a ProductStack for each historical copy.

You can instead create a `ProductStackHistory` to maintain snapshots of all previous versions.
The `ProductStackHistory` can be created by passing the base `productStack`,
a `currentVersionName` for your current version and a `locked` boolean.
The `locked` boolean which when set to true will prevent your `currentVersionName`
from being overwritten when there is an existing snapshot for that version.

```ts
class S3BucketProduct extends servicecatalog.ProductStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new s3.Bucket(this, 'BucketProduct');
  }
}

const productStackHistory = new servicecatalog.ProductStackHistory(this, 'ProductStackHistory', {
  productStack: new S3BucketProduct(this, 'S3BucketProduct'),
  currentVersionName: 'v1',
  currentVersionLocked: true
});
```

We can deploy the current version `v1` by using `productStackHistory.currentVersion()`

```ts
class S3BucketProduct extends servicecatalog.ProductStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new s3.Bucket(this, 'BucketProductV2');
  }
}

const productStackHistory = new servicecatalog.ProductStackHistory(this, 'ProductStackHistory', {
  productStack: new S3BucketProduct(this, 'S3BucketProduct'),
  currentVersionName: 'v2',
  currentVersionLocked: true
});

const product = new servicecatalog.CloudFormationProduct(this, 'MyFirstProduct', {
  productName: "My Product",
  owner: "Product Owner",
  productVersions: [
    productStackHistory.currentVersion(),
  ],
});
```

Using `ProductStackHistory` all deployed templates for the ProductStack will be written to disk,
so that they will still be available in the future as the definition of the `ProductStack` subclass changes over time.
**It is very important** that you commit these old versions to source control as these versions
determine whether a version has already been deployed and can also be deployed themselves.

After using `ProductStackHistory` to deploy version `v1` of your `ProductStack`, we
make changes to the `ProductStack` and update the `currentVersionName` to `v2`.
We still want our `v1` version to still be deployed, so we reference it by calling `productStackHistory.versionFromSnapshot('v1')`.

```ts
class S3BucketProduct extends servicecatalog.ProductStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new s3.Bucket(this, 'BucketProductV2');
  }
}

const productStackHistory = new servicecatalog.ProductStackHistory(this, 'ProductStackHistory', {
  productStack: new S3BucketProduct(this, 'S3BucketProduct'),
  currentVersionName: 'v2',
  currentVersionLocked: true
});

const product = new servicecatalog.CloudFormationProduct(this, 'MyFirstProduct', {
  productName: "My Product",
  owner: "Product Owner",
  productVersions: [
    productStackHistory.currentVersion(),
    productStackHistory.versionFromSnapshot('v1')
  ],
});
```

### Adding a product to a portfolio

You add products to a portfolio to organize and distribute your catalog at scale.  Adding a product to a portfolio creates an association,
and the product will become visible within the portfolio side in both the Service Catalog console and AWS CLI.
You can add a product to multiple portfolios depending on your organizational structure and how you would like to group access to products.

```ts
declare const portfolio: servicecatalog.Portfolio;
declare const product: servicecatalog.CloudFormationProduct;

portfolio.addProduct(product);
```

## Tag Options

TagOptions allow administrators to easily manage tags on provisioned products by providing a template for a selection of tags that end users choose from.
TagOptions are created by specifying a tag key with a set of allowed values and can be associated with both portfolios and products.
When launching a product, both the TagOptions associated with the product and the containing portfolio are made available.

At the moment, TagOptions can only be deactivated in the console.

```ts
declare const portfolio: servicecatalog.Portfolio;
declare const product: servicecatalog.CloudFormationProduct;

const tagOptionsForPortfolio = new servicecatalog.TagOptions(this, 'OrgTagOptions', {
  allowedValuesForTags: {
    Group: ['finance', 'engineering', 'marketing', 'research'],
    CostCenter: ['01', '02','03'],
  },
});
portfolio.associateTagOptions(tagOptionsForPortfolio);

const tagOptionsForProduct = new servicecatalog.TagOptions(this, 'ProductTagOptions', {
  allowedValuesForTags: {
    Environment: ['dev', 'alpha', 'prod'],
  },
});
product.associateTagOptions(tagOptionsForProduct);
```

## Constraints

Constraints are governance gestures that you place on product-portfolio associations that allow you to manage minimal launch permissions, notifications, and other optional actions that end users can perform on products.
Using the CDK, if you do not explicitly associate a product to a portfolio and add a constraint, it will automatically add an association for you.

There are rules around how constraints are applied to portfolio-product associations.
For example, you can only have a single "launch role" constraint applied to a portfolio-product association.
If a misconfigured constraint is added, `synth` will fail with an error message.

Read more at [Service Catalog Constraints](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/constraints.html).

### Tag update constraint

Tag update constraints allow or disallow end users to update tags on resources associated with an AWS Service Catalog product upon provisioning.
By default, if a Tag Update constraint is not configured, tag updating is not permitted.
If tag updating is allowed, then new tags associated with the product or portfolio will be applied to provisioned resources during a provisioned product update.

```ts
declare const portfolio: servicecatalog.Portfolio;
declare const product: servicecatalog.CloudFormationProduct;

portfolio.addProduct(product);
portfolio.constrainTagUpdates(product);
```

If you want to disable this feature later on, you can update it by setting the "allow" parameter to `false`:

```ts
declare const portfolio: servicecatalog.Portfolio;
declare const product: servicecatalog.CloudFormationProduct;

// to disable tag updates:
portfolio.constrainTagUpdates(product, {
  allow: false,
});
```

### Notify on stack events

Allows users to subscribe an AWS `SNS` topic to a provisioned product's CloudFormation stack events.
When an end user provisions a product it creates a CloudFormation stack that notifies the subscribed topic on creation, edit, and delete events.
An individual `SNS` topic may only have a single subscription to any given portfolio-product association.

```ts
import * as sns from 'aws-cdk-lib/aws-sns';

declare const portfolio: servicecatalog.Portfolio;
declare const product: servicecatalog.CloudFormationProduct;

const topic1 = new sns.Topic(this, 'Topic1');
portfolio.notifyOnStackEvents(product, topic1);

const topic2 = new sns.Topic(this, 'Topic2');
portfolio.notifyOnStackEvents(product, topic2, {
  description: 'description for topic2', // description is an optional field.
});
```

### CloudFormation template parameters constraint

CloudFormation template parameter constraints allow you to configure the provisioning parameters that are available to end users when they launch a product.
Template constraint rules consist of one or more assertions that define the default and/or allowable values for a product’s provisioning parameters.
You can configure multiple parameter constraints to govern the different provisioning parameters within your products.
For example, a rule might define the `EC2` instance types that users can choose from when launching a product that includes one or more `EC2` instances.
Parameter rules have an optional `condition` field that allow for rule application to consider conditional evaluations.
If a `condition` is specified, all  assertions will be applied if the condition evaluates to true.
For information on rule-specific intrinsic functions to define rule conditions and assertions,
see [AWS Rule Functions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-rules.html).

```ts
import * as cdk from 'aws-cdk-lib';

declare const portfolio: servicecatalog.Portfolio;
declare const product: servicecatalog.CloudFormationProduct;

portfolio.constrainCloudFormationParameters(product, {
  rule: {
    ruleName: 'testInstanceType',
    condition: Fn.conditionEquals(Fn.ref('Environment'), 'test'),
    assertions: [{
      assert: Fn.conditionContains(['t2.micro', 't2.small'], Fn.ref('InstanceType')),
      description: 'For test environment, the instance type should be small',
    }],
  },
});
```

### Set launch role

Allows you to configure a specific `IAM` role that Service Catalog assumes on behalf of the end user when launching a product.
By setting a launch role constraint, you can maintain least permissions for an end user when launching a product.
For example, a launch role can grant permissions for specific resource creation like an `S3` bucket that the user.
The launch role must be assumed by the Service Catalog principal.
You can only have one launch role set for a portfolio-product association,
and you cannot set a launch role on a product that already has a StackSets deployment configured.

```ts
declare const portfolio: servicecatalog.Portfolio;
declare const product: servicecatalog.CloudFormationProduct;

const launchRole = new iam.Role(this, 'LaunchRole', {
  assumedBy: new iam.ServicePrincipal('servicecatalog.amazonaws.com'),
});

portfolio.setLaunchRole(product, launchRole);
```

You can also set the launch role using just the name of a role which is locally deployed in end user accounts.
This is useful for when roles and users are separately managed outside of the CDK.
The given role must exist in both the account that creates the launch role constraint,
as well as in any end user accounts that wish to provision a product with the launch role.

You can do this by passing in the role with an explicitly set name:

```ts
declare const portfolio: servicecatalog.Portfolio;
declare const product: servicecatalog.CloudFormationProduct;

const launchRole = new iam.Role(this, 'LaunchRole', {
  roleName: 'MyRole',
  assumedBy: new iam.ServicePrincipal('servicecatalog.amazonaws.com'),
});

portfolio.setLocalLaunchRole(product, launchRole);
```

Or you can simply pass in a role name and CDK will create a role with that name that trusts service catalog in the account:

```ts
declare const portfolio: servicecatalog.Portfolio;
declare const product: servicecatalog.CloudFormationProduct;

const roleName = 'MyRole';
const launchRole: iam.IRole = portfolio.setLocalLaunchRoleName(product, roleName);
```

See [Launch Constraint](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/constraints-launch.html) documentation
to understand the permissions that launch roles need.

### Deploy with StackSets

A StackSets deployment constraint allows you to configure product deployment options using
[AWS CloudFormation StackSets](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/using-stacksets.html).
You can specify one or more accounts and regions into which stack instances will launch when the product is provisioned.
There is an additional field `allowStackSetInstanceOperations` that sets ability for end users to create, edit, or delete the stacks created by the StackSet.
By default, this field is set to `false`.
When launching a StackSets product, end users can select from the list of accounts and regions configured in the constraint to determine where the Stack Instances will deploy and the order of deployment.
You can only define one StackSets deployment configuration per portfolio-product association,
and you cannot both set a launch role and StackSets deployment configuration for an assocation.

```ts
declare const portfolio: servicecatalog.Portfolio;
declare const product: servicecatalog.CloudFormationProduct;

const adminRole = new iam.Role(this, 'AdminRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

portfolio.deployWithStackSets(product, {
  accounts: ['012345678901', '012345678902', '012345678903'],
  regions: ['us-west-1', 'us-east-1', 'us-west-2', 'us-east-1'],
  adminRole: adminRole,
  executionRoleName: 'SCStackSetExecutionRole', // Name of role deployed in end users accounts.
  allowStackSetInstanceOperations: true,
});
```
