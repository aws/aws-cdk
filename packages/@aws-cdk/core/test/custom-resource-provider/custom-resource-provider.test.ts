import * as fs from 'fs';
import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import { App, AssetStaging, CustomResourceProvider, CustomResourceProviderRuntime, DockerImageAssetLocation, DockerImageAssetSource, Duration, FileAssetLocation, FileAssetSource, ISynthesisSession, Size, Stack, CfnResource } from '../../lib';
import { CUSTOMIZE_ROLES_CONTEXT_KEY } from '../../lib/helpers-internal';
import { toCloudFormation } from '../util';

const TEST_HANDLER = `${__dirname}/mock-provider`;

describe('custom resource provider', () => {
  describe('customize roles', () => {
    test('role is not created if preventSynthesis!=false', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'MyStack');
      stack.node.setContext(CUSTOMIZE_ROLES_CONTEXT_KEY, {
        usePrecreatedRoles: {
          'MyStack/Custom:MyResourceTypeCustomResourceProvider/Role': 'my-custom-role-name',
        },
      });
      const someResource = new CfnResource(stack, 'SomeResource', {
        type: 'AWS::SomeResource',
        properties: {},
      });

      // WHEN
      const cr = CustomResourceProvider.getOrCreateProvider(stack, 'Custom:MyResourceType', {
        codeDirectory: TEST_HANDLER,
        runtime: CustomResourceProviderRuntime.NODEJS_14_X,
      });
      cr.addToRolePolicy({
        Action: 's3:GetBucket',
        Effect: 'Allow',
        Resource: someResource.ref,
      });

      // THEN
      const assembly = app.synth();
      const template = assembly.getStackByName('MyStack').template;
      const resourceTypes = Object.values(template.Resources).flatMap((value: any) => {
        return value.Type;
      });
      // role is not created
      expect(resourceTypes).not.toContain('AWS::IAM::Role');
      // lambda function references precreated role
      expect(template.Resources.CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A.Properties.Role).toEqual({
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::',
            {
              Ref: 'AWS::AccountId',
            },
            ':role/my-custom-role-name',
          ],
        ],
      });

      // report is generated correctly
      const filePath = path.join(assembly.directory, 'iam-policy-report.json');
      const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
      expect(JSON.parse(file)).toEqual({
        roles: [{
          roleConstructPath: 'MyStack/Custom:MyResourceTypeCustomResourceProvider/Role',
          roleName: 'my-custom-role-name',
          missing: false,
          assumeRolePolicy: [{
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          }],
          managedPolicyArns: [
            'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
          ],
          managedPolicyStatements: [],
          identityPolicyStatements: [{
            Action: 's3:GetBucket',
            Effect: 'Allow',
            Resource: '(MyStack/SomeResource.Ref)',
          }],
        }],
      });
    });

    test('role is created if preventSynthesis=false', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'MyStack');
      stack.node.setContext(CUSTOMIZE_ROLES_CONTEXT_KEY, {
        preventSynthesis: false,
      });
      const someResource = new CfnResource(stack, 'SomeResource', {
        type: 'AWS::SomeResource',
        properties: {},
      });

      // WHEN
      const cr = CustomResourceProvider.getOrCreateProvider(stack, 'Custom:MyResourceType', {
        codeDirectory: TEST_HANDLER,
        runtime: CustomResourceProviderRuntime.NODEJS_14_X,
      });
      cr.addToRolePolicy({
        Action: 's3:GetBucket',
        Effect: 'Allow',
        Resource: someResource.ref,
      });

      // THEN
      const assembly = app.synth();
      const template = assembly.getStackByName('MyStack').template;
      const resourceTypes = Object.values(template.Resources).flatMap((value: any) => {
        return value.Type;
      });
      // IAM role _is_ created
      expect(resourceTypes).toContain('AWS::IAM::Role');
      // lambda function references the created role
      expect(template.Resources.CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A.Properties.Role).toEqual({
        'Fn::GetAtt': [
          'CustomMyResourceTypeCustomResourceProviderRoleBD5E655F',
          'Arn',
        ],
      });

      // report is still generated
      const filePath = path.join(assembly.directory, 'iam-policy-report.json');
      const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
      expect(JSON.parse(file)).toEqual({
        roles: [{
          roleConstructPath: 'MyStack/Custom:MyResourceTypeCustomResourceProvider/Role',
          roleName: 'missing role',
          missing: true,
          assumeRolePolicy: [{
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          }],
          managedPolicyArns: [
            'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
          ],
          managedPolicyStatements: [],
          identityPolicyStatements: [{
            Action: 's3:GetBucket',
            Effect: 'Allow',
            Resource: '(MyStack/SomeResource.Ref)',
          }],
        }],
      });
    });
  });

  test('minimal configuration', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app);

    // WHEN
    CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
    });

    // THEN
    const cfn = toCloudFormation(stack);

    // The asset hash constantly changes, so in order to not have to chase it, just look
    // it up from the output.
    const staging = stack.node.tryFindChild('Custom:MyResourceTypeCustomResourceProvider')?.node.tryFindChild('Staging') as AssetStaging;
    const assetHash = staging.assetHash;
    const sourcePath = staging.sourcePath;
    const paramNames = Object.keys(cfn.Parameters);
    const bucketParam = paramNames[0];
    const keyParam = paramNames[1];
    const hashParam = paramNames[2];

    expect(fs.existsSync(path.join(sourcePath, '__entrypoint__.js'))).toEqual(true);

    expect(cfn).toEqual({
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
            Runtime: 'nodejs14.x',
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

  });

  test('asset metadata added to custom resource that contains code definition', () => {
    // GIVEN
    const stack = new Stack();
    stack.node.setContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT, true);
    stack.node.setContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT, true);

    // WHEN
    CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
    });

    // Then
    const lambda = toCloudFormation(stack).Resources.CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A;
    expect(lambda).toHaveProperty('Metadata');

    expect(lambda.Metadata).toMatchObject({
      'aws:asset:property': 'Code',

      // The asset path should be a temporary folder prefixed with 'cdk-custom-resource'
      'aws:asset:path': expect.stringMatching(/^.*\/cdk-custom-resource\w{6}\/?$/),
    });

  });

  test('custom resource provided creates asset in new-style synthesis with relative path', () => {
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
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
    });

    // THEN -- no exception
    if (!assetFilename || assetFilename.startsWith(path.sep)) {
      throw new Error(`Asset filename must be a relative path, got: ${assetFilename}`);
    }


  });

  test('policyStatements can be used to add statements to the inline policy', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
      policyStatements: [
        { statement1: 123 },
        { statement2: { foo: 111 } },
      ],
    });

    // THEN
    const template = toCloudFormation(stack);
    const role = template.Resources.CustomMyResourceTypeCustomResourceProviderRoleBD5E655F;
    expect(role.Properties.Policies).toEqual([{
      PolicyName: 'Inline',
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{ statement1: 123 }, { statement2: { foo: 111 } }],
      },
    }]);

  });

  test('addToRolePolicy() can be used to add statements to the inline policy', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const provider = CustomResourceProvider.getOrCreateProvider(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
      policyStatements: [
        { statement1: 123 },
        { statement2: { foo: 111 } },
      ],
    });
    provider.addToRolePolicy({ statement3: 456 });

    // THEN
    const template = toCloudFormation(stack);
    const role = template.Resources.CustomMyResourceTypeCustomResourceProviderRoleBD5E655F;
    expect(role.Properties.Policies).toEqual([{
      PolicyName: 'Inline',
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{ statement1: 123 }, { statement2: { foo: 111 } }, { statement3: 456 }],
      },
    }]);
  });

  test('memorySize, timeout and description', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
      memorySize: Size.gibibytes(2),
      timeout: Duration.minutes(5),
      description: 'veni vidi vici',
    });

    // THEN
    const template = toCloudFormation(stack);
    const lambda = template.Resources.CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A;
    expect(lambda.Properties.MemorySize).toEqual(2048);
    expect(lambda.Properties.Timeout).toEqual(300);
    expect(lambda.Properties.Description).toEqual('veni vidi vici');

  });

  test('environment variables', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
      environment: {
        B: 'b',
        A: 'a',
      },
    });

    // THEN
    const template = toCloudFormation(stack);
    const lambda = template.Resources.CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A;
    expect(lambda.Properties.Environment).toEqual({
      Variables: expect.objectContaining({
        A: 'a',
        B: 'b',
      }),
    });

  });

  test('roleArn', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const cr = CustomResourceProvider.getOrCreateProvider(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
    });

    // THEN
    expect(stack.resolve(cr.roleArn)).toEqual({
      'Fn::GetAtt': [
        'CustomMyResourceTypeCustomResourceProviderRoleBD5E655F',
        'Arn',
      ],
    });

  });
});

