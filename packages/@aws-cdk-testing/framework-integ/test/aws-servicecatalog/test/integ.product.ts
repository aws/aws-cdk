import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as servicecatalog from 'aws-cdk-lib/aws-servicecatalog';
import { ProductStackHistory, ProductStackProps } from 'aws-cdk-lib/aws-servicecatalog';

/**
 * Follow these instructions to manually test provisioning a Product with an Asset with the resources provisioned in this stack:
 *
 * 1. Deploy the stack:
 ```
 $ CDK_DEFAULT_ACCOUNT=<account-od> CDK_DEFAULT_REGION=<region> cdk deploy --app "node integ.product.js" integ-servicecatalog-product
 ```
 *
 * 2. Obtain IAM Principal ARN that will provision product.
 One way this can be done is by using
 ```
 $ aws sts get-caller-identity
 ```
 *
 * 3. Associate your principal to your portfolio. PortfolioId is stored as an output values from the deployed stack.
 ```
 $ aws servicecatalog associate-principal-with-portfolio \
 --portfolio-id=<PLACEHOLDER - PORTFOLIO ID> \
 --principal-arn=<PLACEHOLDER - PRINCIPAL ARN> \
 --principal-type=IAM
 ```
 *
 * 4. Provision Product using the following prefilled values.
 ```
 $ aws servicecatalog provision-product \
 --provisioned-product-name=testAssetProvisioningProduct \
 --product-name=testProduct \
 --provisioning-artifact-name=testAssetProduct
 ```
 *
 * 5. Verify Provision Product was provisioned providing the ProvisionedProductId from the previous step.
 ```
 $ aws servicecatalog describe-provisioned-product --id=<PLACEHOLDER - PROVISIONED PRODUCT ID>
 ```
 *
 * 6. Terminate Provisioned Product providing the ProvisionedProductId from the previous step.
 ```
 $ aws servicecatalog terminate-provisioned-product --provisioned-product-id=<PLACEHOLDER - PROVISIONED PRODUCT ID>
 ```
 *
 * 7. Disassociate your principal from your portfolio.
 ```
 $ aws servicecatalog disassociate-principal-from-portfolio \
 --portfolio-id=<PLACEHOLDER - PORTFOLIO ID> \
 --principal-arn=<PLACEHOLDER - PRINCIPAL ARN> \
 ```
 *
 * 8. Destroy the stack:
 ```
 $ cdk destroy --app "node integ.product.js" integ-servicecatalog-product
 ```
 */

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'integ-servicecatalog-product', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

class TestProductStack extends servicecatalog.ProductStack {
  constructor(scope: any, id: string) {
    super(scope, id, {
      description: 'foo bar',
    });

    new sns.Topic(this, 'TopicProduct');
  }
}

const portfolio = new servicecatalog.Portfolio(stack, 'TestPortfolio', {
  displayName: 'TestPortfolio',
  providerName: 'TestProvider',
  description: 'This is our Service Catalog Portfolio',
  messageLanguage: servicecatalog.MessageLanguage.EN,
});

class TestAssetProductStack extends servicecatalog.ProductStack {
  constructor(scope: any, id: string, props?: ProductStackProps) {
    super(scope, id, props);

    new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset('./assets'),
      handler: 'index.handler',
    });

    new lambda.Function(this, 'HelloHandler2', {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset('./assetsv2'),
      handler: 'index.handler',
    });
  }
}

const productStackHistory = new ProductStackHistory(stack, 'ProductStackHistory', {
  productStack: new TestProductStack(stack, 'SNSTopicProduct3'),
  currentVersionName: 'v1',
  currentVersionLocked: false,
});

const testAssetBucket = new s3.Bucket(stack, 'TestAssetBucket', {
  bucketName: `product-stack-asset-bucket-${stack.account}-${stack.region}`,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const product = new servicecatalog.CloudFormationProduct(stack, 'TestProduct', {
  productName: 'testProduct',
  owner: 'testOwner',
  productVersions: [
    {
      validateTemplate: false,
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl(
        'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template'),
    },
    {
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(path.join(__dirname, 'product1.template.json')),
    },
    {
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(path.join(__dirname, 'product2.template.json')),
    },
    {
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new TestProductStack(stack, 'SNSTopicProduct1')),
    },
    {
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new TestProductStack(stack, 'SNSTopicProduct2')),
    },
    {
      productVersionName: 'testAssetProduct',
      validateTemplate: false,
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new TestAssetProductStack(stack, 'S3AssetProduct', {
        assetBucket: testAssetBucket,
      })),
    },
    productStackHistory.currentVersion(),
  ],
});

new IntegTest(app, 'integ-product', {
  testCases: [stack],
  diffAssets: true,
  enableLookups: true,
  stackUpdateWorkflow: false,
});

portfolio.addProduct(product);

new cdk.CfnOutput(stack, 'PortfolioId', { value: portfolio.portfolioId });

app.synth();
