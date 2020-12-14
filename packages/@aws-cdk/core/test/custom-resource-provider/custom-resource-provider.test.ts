import * as fs from 'fs';
import * as path from 'path';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { App, AssetStaging, CustomResourceProvider, CustomResourceProviderRuntime, DockerImageAssetLocation, DockerImageAssetSource, Duration, FileAssetLocation, FileAssetSource, ISynthesisSession, Size, Stack } from '../../lib';
import { toCloudFormation } from '../util';

const TEST_HANDLER = `${__dirname}/mock-provider`;

nodeunitShim({
  'minimal configuration'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_12,
    });

    // THEN
    test.ok(fs.existsSync(path.join(TEST_HANDLER, '__entrypoint__.js')), 'expecting entrypoint to be copied to the handler directory');
    const cfn = toCloudFormation(stack);

    // The asset hash constantly changes, so in order to not have to chase it, just look
    // it up from the output.
    const staging = stack.node.tryFindChild('Custom:MyResourceTypeCustomResourceProvider')?.node.tryFindChild('Staging') as AssetStaging;
    const assetHash = staging.sourceHash;
    const paramNames = Object.keys(cfn.Parameters);
    const bucketParam = paramNames[0];
    const keyParam = paramNames[1];
    const hashParam = paramNames[2];

    test.deepEqual(cfn, {
      Resources: {
        CustomMyResourceTypeCustomResourceProviderRoleBD5E655F: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'lambda.amazonaws.com',
                  },
                },
              ],
            },
            ManagedPolicyArns: [
              {
                'Fn::Sub': 'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
              },
            ],
          },
        },
        CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: { Ref: bucketParam },
              S3Key: {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::Select': [
                        0,
                        {
                          'Fn::Split': [
                            '||',
                            { Ref: keyParam },
                          ],
                        },
                      ],
                    },
                    {
                      'Fn::Select': [
                        1,
                        {
                          'Fn::Split': [
                            '||',
                            { Ref: keyParam },
                          ],
                        },
                      ],
                    },
                  ],
                ],
              },
            },
            Timeout: 900,
            MemorySize: 128,
            Handler: '__entrypoint__.handler',
            Role: {
              'Fn::GetAtt': [
                'CustomMyResourceTypeCustomResourceProviderRoleBD5E655F',
                'Arn',
              ],
            },
            Runtime: 'nodejs12.x',
          },
          DependsOn: [
            'CustomMyResourceTypeCustomResourceProviderRoleBD5E655F',
          ],
        },
      },
      Parameters: {
        [bucketParam]: {
          Type: 'String',
          Description: `S3 bucket for asset "${assetHash}"`,
        },
        [keyParam]: {
          Type: 'String',
          Description: `S3 key for asset version "${assetHash}"`,
        },
        [hashParam]: {
          Type: 'String',
          Description: `Artifact hash for asset "${assetHash}"`,
        },
      },
    });
    test.done();
  },

  'custom resource provided creates asset in new-style synthesis with relative path'(test: Test) {
    // GIVEN

    let assetFilename : string | undefined;

    const app = new App();
    const stack = new Stack(app, 'Stack', {
      synthesizer: {
        bind(_stack: Stack): void { },

        addFileAsset(asset: FileAssetSource): FileAssetLocation {
          assetFilename = asset.fileName;
          return { bucketName: '', httpUrl: '', objectKey: '', s3ObjectUrl: '', s3Url: '', kmsKeyArn: '' };
        },

        addDockerImageAsset(_asset: DockerImageAssetSource): DockerImageAssetLocation {
          return { imageUri: '', repositoryName: '' };
        },

        synthesize(_session: ISynthesisSession): void { },
      },
    });

    // WHEN
    CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_12,
    });

    // THEN -- no exception
    if (!assetFilename || assetFilename.startsWith(path.sep)) {
      throw new Error(`Asset filename must be a relative path, got: ${assetFilename}`);
    }

    test.done();
  },

  'policyStatements can be used to add statements to the inline policy'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_12,
      policyStatements: [
        { statement1: 123 },
        { statement2: { foo: 111 } },
      ],
    });

    // THEN
    const template = toCloudFormation(stack);
    const role = template.Resources.CustomMyResourceTypeCustomResourceProviderRoleBD5E655F;
    test.deepEqual(role.Properties.Policies, [{
      PolicyName: 'Inline',
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{ statement1: 123 }, { statement2: { foo: 111 } }],
      },
    }]);
    test.done();
  },

  'memorySize and timeout'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_12,
      memorySize: Size.gibibytes(2),
      timeout: Duration.minutes(5),
    });

    // THEN
    const template = toCloudFormation(stack);
    const lambda = template.Resources.CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A;
    test.deepEqual(lambda.Properties.MemorySize, 2048);
    test.deepEqual(lambda.Properties.Timeout, 300);
    test.done();
  },

  'environment variables'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_12,
      environment: {
        B: 'b',
        A: 'a',
      },
    });

    // THEN
    const template = toCloudFormation(stack);
    const lambda = template.Resources.CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A;
    test.deepEqual(lambda.Properties.Environment, {
      Variables: {
        A: 'a',
        B: 'b',
      },
    });
    test.done();
  },

  'roleArn'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const cr = CustomResourceProvider.getOrCreateProvider(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_12,
    });

    // THEN
    test.deepEqual(stack.resolve(cr.roleArn), {
      'Fn::GetAtt': [
        'CustomMyResourceTypeCustomResourceProviderRoleBD5E655F',
        'Arn',
      ],
    });
    test.done();
  },
});

