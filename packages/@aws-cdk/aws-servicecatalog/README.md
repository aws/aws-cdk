## AWS Service Catalog Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Experimental](https://img.shields.io/badge/experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.
---
<!--END STABILITY BANNER-->

The `@aws-cdk/aws-servicecatalog` package contains constructs for working with AWS ServiceCatalog Products and Portfolios.


Usage
===
## Portfolio
You can create a portfolio with the `Portfolio` resource.
```ts
const portfolio = new catalog.Portfolio(this, 'Portfolio', {
  portfolioName: 'testPortfolio',
  provider: 'testProvider',
});
```
## Product
You can create a Product by passing a path to a CloudFormation template containing the resources associated with your product.
```ts
new catalog.Product(stack, "Product", {
  productName: "testProduct",
  templatePath: "./templates/my_product.yml",
  owner: "testOwner",
});
```
## CDKProduct
If you prefer to create your Product all via the CDK, you can do so via the `CDKProduct` resource. The `CDKProduct` resource is similar to the `Product` resource, but instead of passing a path to a CloudFormation template, you can pass in a `Stack`. This construct will handle synthesizing the template for you.
```ts
/**
 * Create a new stack -- this will stack will be synthesized and used as the product.
 */
const productStack = new cdk.Stack();
/**
 * Create a new resource in the stack scope.
 * This Bucket will be provisioned when the user instantiates the product via ServiceCatalog.
 */
new s3.Bucket(productStack, "bucket");

new catalog.CDKProduct(this, "cdkproduct", {
  productName: "test",
  owner: "me",
  stack: productStack,
});
```

### Assets
This construct does not currently support assets. Adding a stack containing an Asset will result in an error.

### Parameters
You can add Parameters to the CDKProduct's Stack as you normally would via the `CfnParameter` construct.
```ts
const productStack = new cdk.Stack();

const bucketNameParam = new CfnParameter(this, "BucketName");
new s3.Bucket(productStack, "bucket", { bucketName: bucketNameParam.valueAsString });


new catalog.CDKProduct(this, "cdkproduct", {
  productName: "test",
  owner: "me",
  stack: productStack,
});
```
## Associationing a product and portfolio
Associating a product and a portfolio can be done via the `portfolio.associateProduct` method:
```ts
portfolio.associateProduct(product);

```
or you can use the `product.associatePortfolio` method:
```ts
product.associatePortfolio(portfolio);
```

## Constraints
Constraints allow you to add rules to your products.
```ts
new catalog.ResourceUpdateConstraint(stack, 'resourceUpdateConstraintAllowed', { portfolio: portfolio, product: product, allowTagUpdateOnProvisionedProduct: true });
```