import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as servicecatalog from 'aws-cdk-lib/aws-servicecatalog';
import { ProductStackProps } from 'aws-cdk-lib/aws-servicecatalog';
import { Construct } from 'constructs';

/*
  See integ.product.ts for instructions on how to test successful deployments by hand
 */

class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const portfolio = new servicecatalog.Portfolio(this, 'TestPortfolio', {
      displayName: 'TestPortfolio',
      providerName: 'TestProvider',
      description: 'This is our Service Catalog Portfolio',
      messageLanguage: servicecatalog.MessageLanguage.EN,
    });

    const testAssetBucket = new s3.Bucket(this, 'TestAssetBucket', {
      bucketName: `product-stack-asset-bucket-${this.account}-${this.region}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    portfolio.addProduct(new servicecatalog.CloudFormationProduct(this, 'Product1', {
      productName: 'Prod 1',
      owner: 'Owner 1',
      productVersions: [{
        productVersionName: 'v1',
        cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(
          new TestAssetProductStack1(this, 'MyProductStack1', {
            assetBucket: testAssetBucket,
            memoryLimit: 256,
          }),
        ),
      }],
    }));

    portfolio.addProduct(new servicecatalog.CloudFormationProduct(this, 'Product2', {
      productName: 'Prod 2',
      owner: 'Owner 2',
      productVersions: [{
        productVersionName: 'v1',
        cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(
          new TestAssetProductStack2(this, 'MyProductStack2', {
            assetBucket: testAssetBucket,
          }),
        ),
      }],
    }));

    new cdk.CfnOutput(this, 'PortfolioId', { value: portfolio.portfolioId });
  }
}

class TestAssetProductStack1 extends servicecatalog.ProductStack {
  constructor(scope: any, id: string, props?: ProductStackProps) {
    super(scope, id, props);

    new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset(path.join(__dirname, 'assets')),
      handler: 'index.handler',
    });
  }
}

class TestAssetProductStack2 extends servicecatalog.ProductStack {
  constructor(scope: any, id: string, props?: ProductStackProps) {
    super(scope, id, props);

    new lambda.Function(this, 'HelloHandler2', {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset(path.join(__dirname, 'assetsv2')),
      handler: 'index.handler',
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new PortfolioStack(app, 'integ-servicecatalog-two-products', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

new IntegTest(app, 'integ-product', {
  testCases: [stack],
  diffAssets: true,
  enableLookups: true,
  stackUpdateWorkflow: false,
});

app.synth();

