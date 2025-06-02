import { App, Stack, NestedStack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sc from 'aws-cdk-lib/aws-servicecatalog';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

class ServiceCatalogStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const assetBucket = new s3.Bucket(this, 'AssetBucket', {
      bucketName: `asset-bucket-${this.account}-${this.region}`,
    });

    new sc.CloudFormationProduct(this, 'SampleProduct', {
      productName: 'Sample Product',
      owner: 'owner',
      productVersions: [
        {
          productVersionName: 'v1',
          cloudFormationTemplate: sc.CloudFormationTemplate.fromProductStack(
            new SampleProductStack(this, 'SampleProductStack', {
              assetBucket,
            }),
          ),
        },
      ],
    });
  }
}

class SampleNestedStack extends NestedStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

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

class SampleProductStack extends sc.ProductStack {
  constructor(scope: Construct, id: string, props: sc.ProductStackProps) {
    super(scope, id, props);

    new SampleNestedStack(this, 'SampleNestedStack');
  }
}

new IntegTest(app, 'aws-cdk-nested-stack-in-product-stack-integ', {
  testCases: [new ServiceCatalogStack(app, 'aws-cdk-nested-stack-in-product-stack', {
    env: {
      account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
    },
  })],
});
