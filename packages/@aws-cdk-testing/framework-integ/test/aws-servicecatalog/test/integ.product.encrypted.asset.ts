import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { BucketEncryption } from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as servicecatalog from 'aws-cdk-lib/aws-servicecatalog';
import { ProductStackHistory, ProductStackProps } from 'aws-cdk-lib/aws-servicecatalog';
import { ServerSideEncryption } from 'aws-cdk-lib/aws-s3-deployment';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'integ-servicecatalog-product-encrypted-asset', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

class TestProductStack extends servicecatalog.ProductStack {
  constructor(scope: any, id: string) {
    super(scope, id);

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

const kmsKey = new kms.Key(stack, 'KmsKey', {
  description: 'Kms key for asset bucket',
});

const testAssetBucket = new s3.Bucket(stack, 'TestAssetBucket', {
  bucketName: `product-stack-asset-bucket-${stack.account}-${stack.region}`,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  enforceSSL: true,
  encryption: BucketEncryption.KMS,
  encryptionKey: kmsKey,
  bucketKeyEnabled: true,
});

testAssetBucket.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['s3:PutObject'],
  effect: iam.Effect.DENY,
  principals: [new iam.AnyPrincipal()],
  resources: [testAssetBucket.arnForObjects('*')],
  conditions: {
    StringNotEquals: {
      's3:x-amz-server-side-encryption': 'aws:kms',
    },
  },
}));

testAssetBucket.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['s3:PutObject'],
  effect: iam.Effect.DENY,
  principals: [new iam.AnyPrincipal()],
  resources: [testAssetBucket.arnForObjects('*')],
  conditions: {
    Null: {
      's3:x-amz-server-side-encryption': true,
    },
  },
}));

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
        serverSideEncryption: ServerSideEncryption.AWS_KMS,
        serverSideEncryptionAwsKmsKeyId: kmsKey.keyId,
      })),
    },
    productStackHistory.currentVersion(),
  ],
});

new IntegTest(app, 'integ-product-encrypted-asset', {
  testCases: [stack],
  enableLookups: true,
});

portfolio.addProduct(product);

new cdk.CfnOutput(stack, 'PortfolioId', { value: portfolio.portfolioId });

app.synth();
