import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { Match, Template } from '../../assertions';
import * as kms from '../../aws-kms';
import * as lambda from '../../aws-lambda';
import * as s3 from '../../aws-s3';
import { BucketEncryption } from '../../aws-s3';
import * as s3_assets from '../../aws-s3-assets';
import { ServerSideEncryption } from '../../aws-s3-deployment';
import * as sns from '../../aws-sns';
import * as cdk from '../../core';
import * as servicecatalog from '../lib';

/* eslint-disable quote-props */
describe('ProductStack', () => {
  test('Asset bucket undefined in product stack without assets', () => {
    // GIVEN
    const app = new cdk.App();
    const mainStack = new cdk.Stack(app, 'MyStack');
    const productStack = new servicecatalog.ProductStack(mainStack, 'MyProductStack');

    // THEN
    expect(productStack._getAssetBucket()).toBeUndefined();
  });

  test('Used defined Asset bucket in product stack with assets', () => {
    // GIVEN
    const app = new cdk.App();
    const mainStack = new cdk.Stack(app, 'MyStack');
    const testAssetBucket = new s3.Bucket(mainStack, 'TestAssetBucket', {
      bucketName: 'test-asset-bucket',
    });
    const productStack = new ProductWithAnAsset(mainStack, 'MyProductStack', {
      assetBucket: testAssetBucket,
    });

    // WHEN
    const assembly = app.synth();

    // THEN
    expect(productStack._getAssetBucket()).toBeDefined();
    const template = JSON.parse(fs.readFileSync(path.join(assembly.directory, productStack.templateFile), 'utf-8'));
    Template.fromJSON(template).hasResourceProperties('AWS::Lambda::Function', {
      Code: {
        S3Bucket: 'test-asset-bucket',
        S3Key: 'd3833f63e813b3a96ea04c8c50ca98209330867f5f6ac358efca11f85a3476c2.zip',
      },
    });
  });

  test('Use correct assetPath when outdir is absolute', () => {
    // GIVEN
    const app = new cdk.App(
      { outdir: '/tmp/foobar' },
    );
    const mainStack = new cdk.Stack(app, 'MyStackAbsolutePath');
    const testAssetBucket = new s3.Bucket(mainStack, 'TestAssetBucket', {
      bucketName: 'test-asset-bucket',
    });
    new ProductWithAnAsset(mainStack, 'MyProductStackAbsolutePath', {
      assetBucket: testAssetBucket,
    });

    // WHEN
    const assembly = app.synth();

    // THEN
    expect(assembly.directory).toBe('/tmp/foobar');
  });

  test.each([true, false])('Can enable or disable anlaytics reporting in product stack', (enabled) => {
    // GIVEN
    const app = new cdk.App();
    const mainStack = new cdk.Stack(app, 'MyStackAbsolutePath');
    const testAssetBucket = new s3.Bucket(mainStack, 'TestAssetBucket', {
      bucketName: 'test-asset-bucket',
    });
    const productStack = new ProductWithAnAsset(mainStack, 'MyProductStackAbsolutePath', {
      assetBucket: testAssetBucket,
      analyticsReporting: enabled,
      description: 'foo bar',
    });

    // THEN
    const assembly = app.synth();
    const stackTemplate = JSON.parse(fs.readFileSync(path.join(assembly.directory, productStack.templateFile), 'utf-8'));
    Template.fromJSON(stackTemplate).resourceCountIs('AWS::CDK::Metadata', enabled ? 1 : 0);
    expect(Template.fromJSON(stackTemplate).toJSON().Description).toEqual('foo bar');
  });

  test('Used defined Asset bucket in product stack with nested assets', () => {
    // GIVEN
    const app = new cdk.App(
    );
    const mainStack = new cdk.Stack(app, 'MyStack');
    let templateFileUrl = '';
    class PortfolioStage extends cdk.Stage {
      constructor(scope: Construct, id: string) {
        super(scope, id);

        const portfolioStack: cdk.Stack = new cdk.Stack(this, 'NestedStack');

        const testAssetBucket = new s3.Bucket(portfolioStack, 'TestAssetBucket', {
          bucketName: 'test-asset-bucket',
        });
        const productStack = new servicecatalog.ProductStack(portfolioStack, 'MyProductStack', {
          assetBucket: testAssetBucket,
        });

        new lambda.Function(productStack, 'HelloHandler', {
          runtime: lambda.Runtime.PYTHON_3_9,
          code: lambda.Code.fromAsset(path.join(__dirname, 'assets')),
          handler: 'index.handler',
        });

        expect(productStack._getAssetBucket()).toBeDefined();
        templateFileUrl = productStack.templateFile;
      }
    }
    const portfolioStage = new PortfolioStage(mainStack, 'PortfolioStage');

    // WHEN
    app.synth();

    //THEN
    const template = JSON.parse(fs.readFileSync(path.join(portfolioStage.outdir, templateFileUrl), 'utf-8'));
    Template.fromJSON(template).hasResourceProperties('AWS::Lambda::Function', {
      Code: {
        S3Bucket: 'test-asset-bucket',
        S3Key: 'd3833f63e813b3a96ea04c8c50ca98209330867f5f6ac358efca11f85a3476c2.zip',
      },
    });
  });

  test('nested stack in product stack', () => {
    // GIVEN
    const app = new cdk.App();

    class ServiceCatalogSampleStack extends cdk.Stack {
      constructor(scope: Construct, id: string) {
        super(scope, id);

        new servicecatalog.CloudFormationProduct(this, 'SampleProduct', {
          productName: 'Sample Product',
          owner: 'owner',
          productVersions: [
            {
              productVersionName: 'v1',
              cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(
                new SampleProductStack(this, 'SampleProductStack', {
                  assetBucket: new s3.Bucket(this, 'AssetBucket', {
                    bucketName: 'test-asset-bucket',
                  }),
                }),
              ),
            },
          ],
        });
      }
    }

    class SampleNestedStack extends cdk.NestedStack {
      constructor(scope: Construct, id: string) {
        super(scope, id);

        new lambda.Function(this, 'HelloHandler', {
          runtime: lambda.Runtime.PYTHON_3_9,
          code: lambda.Code.fromAsset(path.join(__dirname, 'assets')),
          handler: 'index.handler',
        });
      }
    }

    class SampleProductStack extends servicecatalog.ProductStack {
      constructor(scope: Construct, id: string, props: servicecatalog.ProductStackProps) {
        super(scope, id, props);

        new SampleNestedStack(this, 'SampleNestedStack');
      }
    }

    const stack = new ServiceCatalogSampleStack(app, 'ServicecatalogSampleStack');

    // WHEN
    app.synth();

    // THEN
    Template.fromJSON(Template.fromStack(stack)).hasResourceProperties('Custom::CDKBucketDeployment', {
      SourceBucketNames: [
        {
          'Fn::Sub': 'cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}',
        },
        {
          'Fn::Sub': 'cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}',
        },
      ],
      SourceObjectKeys: [
        'd3833f63e813b3a96ea04c8c50ca98209330867f5f6ac358efca11f85a3476c2.zip',
        'da185071753dd5fcd7bd1ff5f2882a5449980d60ed72cf65fe2b779dbbb30eeb.json',
      ],
      DestinationBucketName: {
        Ref: 'AssetBucket1D025086',
      },
    });
  });

  test('fails if bucketName is not specified in product stack with assets', () => {
    // GIVEN
    const app = new cdk.App();
    const mainStack = new cdk.Stack(app, 'MyStack');
    const testAssetBucket = new s3.Bucket(mainStack, 'TestAssetBucket', {
    });
    const productStack = new servicecatalog.ProductStack(mainStack, 'MyProductStack', {
      assetBucket: testAssetBucket,
    });

    // THEN
    expect(() => {
      new s3_assets.Asset(productStack, 'testAsset', {
        path: path.join(__dirname, 'assets'),
      });
    }).toThrow('A bucketName must be provided to use Assets');
  });

  test('fails if Asset bucket is not defined in product stack with assets', () => {
    // GIVEN
    const app = new cdk.App();
    const mainStack = new cdk.Stack(app, 'MyStack');
    const productStack = new servicecatalog.ProductStack(mainStack, 'MyProductStack');

    // THEN
    expect(() => {
      new s3_assets.Asset(productStack, 'testAsset', {
        path: path.join(__dirname, 'assets'),
      });
    }).toThrow('An Asset Bucket must be provided to use Assets');
  });

  test('fails if defined at root', () => {
    // GIVEN
    const app = new cdk.App();

    // THEN
    expect(() => {
      new servicecatalog.ProductStack(app, 'ProductStack');
    }).toThrow(/must be defined within scope of another non-product stack/);
  }),

  test('fails if defined without a parent stack', () => {
    // GIVEN
    const app = new cdk.App();
    const group = new Construct(app, 'group');

    // THEN
    expect(() => {
      new servicecatalog.ProductStack(group, 'ProductStack');
    }).toThrow(/must be defined within scope of another non-product stack/);
  });

  test('can be defined as a direct child or an indirect child of a Stack', () => {
    // GIVEN
    const parent = new cdk.Stack();

    // THEN
    expect(() => {
      new servicecatalog.ProductStack(parent, 'direct');
    }).not.toThrow();
  });

  test('product stack is not synthesized as a stack artifact into the assembly', () => {
    // GIVEN
    const app = new cdk.App();
    const parentStack = new cdk.Stack(app, 'ParentStack');
    new servicecatalog.ProductStack(parentStack, 'ProductStack');

    // WHEN
    const assembly = app.synth();

    // THEN
    expect(assembly.artifacts.length).toEqual(3);
  });

  test('the template of the product stack is synthesized into the cloud assembly', () => {
    // GIVEN
    const app = new cdk.App();
    const parent = new cdk.Stack(app, 'ParentStack');
    const productStack = new servicecatalog.ProductStack(parent, 'ProductStack');
    new sns.Topic(productStack, 'SNSTopicProduct');

    // WHEN
    const assembly = app.synth();

    // THEN
    const template = JSON.parse(fs.readFileSync(path.join(assembly.directory, productStack.templateFile), 'utf-8'));
    expect(template).toEqual({
      Resources: {
        SNSTopicProduct20605D98: {
          Type: 'AWS::SNS::Topic',
        },
      },
    });
  });

  test('fails if KMS encryption for assetBucket enabled without a KMS key', () => {
    // GIVEN
    const app = new cdk.App();
    const mainStack = new cdk.Stack(app, 'MyStack');
    const testAssetBucket = new s3.Bucket(mainStack, 'TestAssetBucket', {
    });
    const productStack = new servicecatalog.ProductStack(mainStack, 'MyProductStack', {
      assetBucket: testAssetBucket,
      serverSideEncryption: ServerSideEncryption.AWS_KMS,
    });

    // THEN
    expect(() => {
      new s3_assets.Asset(productStack, 'testAsset', {
        path: path.join(__dirname, 'assets'),
      });
    }).toThrow('A KMS Key must be provided to use SSE_KMS');
  });

  test('fails if KMS key is provided without KMS encryption for assetBucket enabled', () => {
    // GIVEN
    const app = new cdk.App();
    const mainStack = new cdk.Stack(app, 'MyStack');
    const testKmsKey = new kms.Key(mainStack, 'TestKmsKey');
    const testAssetBucket = new s3.Bucket(mainStack, 'TestAssetBucket', {
    });
    const productStack = new servicecatalog.ProductStack(mainStack, 'MyProductStack', {
      assetBucket: testAssetBucket,
      serverSideEncryptionAwsKmsKeyId: testKmsKey.keyId,
    });

    // THEN
    expect(() => {
      new s3_assets.Asset(productStack, 'testAsset', {
        path: path.join(__dirname, 'assets'),
      });
    }).toThrow('A SSE_KMS encryption must be enabled if you provide KMS Key');
  });

  test('BucketDeployment with SSE_KMS encryption for assetBucket enabled', () => {
    // GIVEN
    const app = new cdk.App();
    const mainStack = new cdk.Stack(app, 'MyStack');
    const testKmsKey = new kms.Key(mainStack, 'TestKmsKey');
    const testAssetBucket = new s3.Bucket(mainStack, 'TestAssetBucket', {
      bucketName: 'test-asset-bucket',
      encryptionKey: testKmsKey,
      encryption: BucketEncryption.KMS,
    });
    const productStack = new servicecatalog.ProductStack(mainStack, 'MyProductStack', {
      assetBucket: testAssetBucket,
      serverSideEncryption: ServerSideEncryption.AWS_KMS,
      serverSideEncryptionAwsKmsKeyId: testKmsKey.keyId,
    });

    new lambda.Function(productStack, 'HelloHandler', {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset(path.join(__dirname, 'assets')),
      handler: 'index.handler',
    });

    // WHEN
    const assembly = app.synth();

    // THEN
    expect(productStack._getAssetBucket()).toBeDefined();
    const mainStackTemplate = JSON.parse(fs.readFileSync(path.join(assembly.directory, mainStack.templateFile), 'utf-8'));
    Template.fromJSON(mainStackTemplate).hasResourceProperties('Custom::CDKBucketDeployment', {
      SystemMetadata: {
        sse: 'aws:kms',
        'sse-kms-key-id': {
          Ref: 'TestKmsKeyF793768B',
        },
      },
    });
  });

  test('BucketDeployment with SSE_S3 encryption for assetBucket enabled', () => {
    // GIVEN
    const app = new cdk.App();
    const mainStack = new cdk.Stack(app, 'MyStack');
    const testAssetBucket = new s3.Bucket(mainStack, 'TestAssetBucket', {
      bucketName: 'test-asset-bucket',
      encryption: BucketEncryption.S3_MANAGED,
    });
    const productStack = new ProductWithAnAsset(mainStack, 'MyProductStack', {
      assetBucket: testAssetBucket,
      serverSideEncryption: ServerSideEncryption.AES_256,
    });

    // WHEN
    const assembly = app.synth();

    // THEN
    expect(productStack._getAssetBucket()).toBeDefined();
    const mainStackTemplate = JSON.parse(fs.readFileSync(path.join(assembly.directory, mainStack.templateFile), 'utf-8'));
    Template.fromJSON(mainStackTemplate).hasResourceProperties('Custom::CDKBucketDeployment', {
      SystemMetadata: {
        sse: 'AES256',
      },
    });
  });

  test('BucketDeployment with custom memoryLimit', () => {
    // GIVEN
    const app = new cdk.App();
    const mainStack = new cdk.Stack(app, 'MyStack');
    const testAssetBucket = new s3.Bucket(mainStack, 'TestAssetBucket', {
      bucketName: 'test-asset-bucket',
    });
    const productStack = new servicecatalog.ProductStack(mainStack, 'MyProductStack', {
      assetBucket: testAssetBucket,
      memoryLimit: 256,
    });

    new lambda.Function(productStack, 'HelloHandler', {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset(path.join(__dirname, 'assets')),
      handler: 'index.handler',
    });

    // WHEN
    const assembly = app.synth();

    // THEN
    expect(productStack._getAssetBucket()).toBeDefined();
    const mainStackTemplate = JSON.parse(fs.readFileSync(path.join(assembly.directory, mainStack.templateFile), 'utf-8'));
    Template.fromJSON(mainStackTemplate).hasResourceProperties('AWS::Lambda::Function', {
      MemorySize: 256,
    });
  });

  test('Two product stacks with assets in the same portfolio', () => {
    // GIVEN
    const app = new cdk.App();
    const mainStack = new cdk.Stack(app, 'MyStack');
    const testAssetBucket = new s3.Bucket(mainStack, 'TestAssetBucket', {
      bucketName: 'test-asset-bucket',
      encryption: BucketEncryption.S3_MANAGED,
    });

    const portfolio = new servicecatalog.Portfolio(mainStack, 'Portfolio', {
      displayName: 'MyPortfolio',
      providerName: 'MyProvider',
    });

    portfolio.addProduct(new servicecatalog.CloudFormationProduct(mainStack, 'Product1', {
      productName: 'Prod 1',
      owner: 'Owner 1',
      productVersions: [{
        productVersionName: 'v1',
        cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(
          new ProductWithAnAsset(mainStack, 'MyProductStack1', {
            assetBucket: testAssetBucket,
          }),
        ),
      }],
    }));
    portfolio.addProduct(new servicecatalog.CloudFormationProduct(mainStack, 'Product2', {
      productName: 'Prod 2',
      owner: 'Owner 2',
      productVersions: [{
        productVersionName: 'v1',
        cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(
          new ProductWithAnAsset(mainStack, 'MyProductStack2', {
            assetBucket: testAssetBucket,
            description: 'Just a description to make the asset definitely different',
          }),
        ),
      }],
    }));

    // WHEN
    app.synth();

    // THEN - should not throw, and there will be a single CDKBucketDeployment
    const template = Template.fromStack(mainStack);
    template.hasResourceProperties('Custom::CDKBucketDeployment', {
      SourceObjectKeys: [
        // Don't care what the key is, as long as there is only one element in the array; both products use the exact
        // same asset so it only needs to be copied once.
        Match.anyValue(),
      ],
    });
  });
});

class ProductWithAnAsset extends servicecatalog.ProductStack {
  constructor(scope: Construct, id: string, props: servicecatalog.ProductStackProps & { description?: string }) {
    super(scope, id, props);

    new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.PYTHON_3_9,
      description: props.description,
      code: lambda.Code.fromAsset(path.join(__dirname, 'assets')),
      handler: 'index.handler',
    });
  }
}
