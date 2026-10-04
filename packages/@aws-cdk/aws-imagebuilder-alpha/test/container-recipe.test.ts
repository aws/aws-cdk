import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import type { IRecipeBase } from '../lib';
import {
  AmazonManagedComponent,
  BaseContainerImage,
  Component,
  ComponentParameterValue,
  ContainerInstanceImage,
  ContainerRecipe,
  DockerfileData,
  OSVersion,
  Platform,
  Repository,
} from '../lib';

describe('Container Recipe', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('imported by name', () => {
    const containerRecipe = ContainerRecipe.fromContainerRecipeName(
      stack,
      'ContainerRecipe',
      'imported-container-recipe-by-name',
    );

    expect(stack.resolve(containerRecipe.containerRecipeArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:container-recipe/imported-container-recipe-by-name/x.x.x',
        ],
      ],
    });
    expect(containerRecipe.containerRecipeName).toEqual('imported-container-recipe-by-name');
    expect(containerRecipe.containerRecipeVersion).toEqual('x.x.x');
    expect((containerRecipe as IRecipeBase)._isContainerRecipe()).toBeTruthy();
  });

  test('imported by name as an unresolved token', () => {
    const containerRecipe = ContainerRecipe.fromContainerRecipeName(
      stack,
      'ContainerRecipe',
      `test-container-recipe-${stack.partition}`,
    );

    expect(stack.resolve(containerRecipe.containerRecipeArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:container-recipe/test-container-recipe-',
          { Ref: 'AWS::Partition' },
          '/x.x.x',
        ],
      ],
    });
    expect(stack.resolve(containerRecipe.containerRecipeName)).toEqual({
      'Fn::Join': ['', ['test-container-recipe-', { Ref: 'AWS::Partition' }]],
    });
    expect(containerRecipe.containerRecipeVersion).toEqual('x.x.x');
  });

  test('imported by arn', () => {
    const containerRecipe = ContainerRecipe.fromContainerRecipeArn(
      stack,
      'ContainerRecipe',
      'arn:aws:imagebuilder:us-east-1:123456789012:container-recipe/imported-container-recipe-by-arn/1.2.3',
    );

    expect(stack.resolve(containerRecipe.containerRecipeArn)).toEqual(
      'arn:aws:imagebuilder:us-east-1:123456789012:container-recipe/imported-container-recipe-by-arn/1.2.3',
    );
    expect(containerRecipe.containerRecipeName).toEqual('imported-container-recipe-by-arn');
    expect(containerRecipe.containerRecipeVersion).toEqual('1.2.3');
  });

  test('imported by arn as an unresolved token', () => {
    const containerRecipe = ContainerRecipe.fromContainerRecipeArn(
      stack,
      'ContainerRecipe',
      `arn:aws:imagebuilder:us-east-1:123456789012:container-recipe/test-container-recipe-${stack.partition}/1.2.3`,
    );

    expect(stack.resolve(containerRecipe.containerRecipeArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:aws:imagebuilder:us-east-1:123456789012:container-recipe/test-container-recipe-',
          { Ref: 'AWS::Partition' },
          '/1.2.3',
        ],
      ],
    });
    expect(stack.resolve(containerRecipe.containerRecipeName)).toEqual({
      'Fn::Select': [
        0,
        {
          'Fn::Split': ['/', { 'Fn::Join': ['', ['test-container-recipe-', { Ref: 'AWS::Partition' }, '/1.2.3']] }],
        },
      ],
    });
    expect(stack.resolve(containerRecipe.containerRecipeVersion)).toEqual({
      'Fn::Select': [
        1,
        {
          'Fn::Split': ['/', { 'Fn::Join': ['', ['test-container-recipe-', { Ref: 'AWS::Partition' }, '/1.2.3']] }],
        },
      ],
    });
  });

  test('imported by attributes', () => {
    const containerRecipe = ContainerRecipe.fromContainerRecipeAttributes(stack, 'ContainerRecipe', {
      containerRecipeName: 'imported-container-recipe-by-attributes',
      containerRecipeVersion: '1.2.3',
    });

    expect(stack.resolve(containerRecipe.containerRecipeArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:container-recipe/imported-container-recipe-by-attributes/1.2.3',
        ],
      ],
    });
    expect(containerRecipe.containerRecipeName).toEqual('imported-container-recipe-by-attributes');
    expect(containerRecipe.containerRecipeVersion).toEqual('1.2.3');
  });

  test('with all parameters', () => {
    const containerRecipe = new ContainerRecipe(stack, 'ContainerRecipe', {
      containerRecipeName: 'test-container-recipe',
      containerRecipeVersion: '1.2.3',
      baseImage: BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', 'latest'),
      targetRepository: Repository.fromEcr(ecr.Repository.fromRepositoryName(stack, 'Repository', 'test-repository')),
      description: 'A test container recipe',
      dockerfile: DockerfileData.fromInline(`FROM {{{ imagebuilder:parentImage }}}
CMD ["echo", "Hello, world!"]
{{{ imagebuilder:environments }}}
{{{ imagebuilder:components }}}`),
      kmsKey: kms.Key.fromKeyArn(
        stack,
        'ComponentKey',
        stack.formatArn({ service: 'kms', resource: 'key', resourceName: '1234abcd-12ab-34cd-56ef-1234567890ab' }),
      ),
      components: [
        {
          component: Component.fromComponentAttributes(stack, 'Component1', {
            componentName: 'component-1',
            componentVersion: '1.2.3',
          }),
        },
        { component: AmazonManagedComponent.helloWorld(stack, 'Component2', { platform: Platform.LINUX }) },
        {
          component: Component.fromComponentArn(
            stack,
            'Component3',
            'arn:aws:imagebuilder:us-east-1:123456789012:component/parameterized-component/1.2.3/4',
          ),
          parameters: {
            parameter1: ComponentParameterValue.fromString('parameter-value-1'),
            parameter2: ComponentParameterValue.fromString('parameter-value-2'),
          },
        },
      ],
      workingDirectory: '/var/tmp',
      osVersion: OSVersion.custom(Platform.LINUX, 'Custom OS'),
      instanceImage: ContainerInstanceImage.fromSsmParameterName(
        '/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended/image_id',
      ),
      instanceBlockDevices: [
        {
          mappingEnabled: false,
          deviceName: '/dev/sda1',
          volume: ec2.BlockDeviceVolume.ephemeral(0),
        },
      ],
      tags: {
        key1: 'value1',
        key2: 'value2',
      },
    });

    containerRecipe.addInstanceBlockDevice(
      {
        deviceName: '/dev/sda2',
        volume: ec2.BlockDeviceVolume.ebs(75, {
          encrypted: true,
          kmsKey: kms.Alias.fromAliasName(stack, 'DeviceKey', 'alias/device-encryption-key'),
          deleteOnTermination: true,
          iops: 1000,
          volumeType: ec2.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
          throughput: 125,
        }),
      },
      {
        deviceName: '/dev/sda3',
        volume: ec2.BlockDeviceVolume.ebsFromSnapshot('snapshot-id', {
          volumeSize: 75,
          deleteOnTermination: true,
          iops: 1000,
          volumeType: ec2.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
          throughput: 125,
        }),
      },
    );

    expect(ContainerRecipe.isContainerRecipe(containerRecipe as unknown)).toBeTruthy();
    expect(ContainerRecipe.isContainerRecipe('ContainerRecipe')).toBeFalsy();
    expect((containerRecipe as IRecipeBase)._isContainerRecipe()).toBeTruthy();

    Template.fromStack(stack).templateMatches({
      Resources: {
        ContainerRecipe8A7CC9ED: Match.objectEquals({
          Type: 'AWS::ImageBuilder::ContainerRecipe',
          Properties: {
            Components: [
              {
                ComponentArn: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      ':imagebuilder:us-east-1:123456789012:component/component-1/1.2.3',
                    ],
                  ],
                },
              },
              {
                ComponentArn: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      ':imagebuilder:us-east-1:aws:component/hello-world-linux/x.x.x',
                    ],
                  ],
                },
              },
              {
                ComponentArn: 'arn:aws:imagebuilder:us-east-1:123456789012:component/parameterized-component/1.2.3/4',
                Parameters: [
                  { Name: 'parameter1', Value: ['parameter-value-1'] },
                  { Name: 'parameter2', Value: ['parameter-value-2'] },
                ],
              },
            ],
            ContainerType: 'DOCKER',
            Description: 'A test container recipe',
            DockerfileTemplateData:
              'FROM {{{ imagebuilder:parentImage }}}\nCMD ["echo", "Hello, world!"]\n{{{ imagebuilder:environments }}}\n{{{ imagebuilder:components }}}',
            ImageOsVersionOverride: 'Custom OS',
            InstanceConfiguration: {
              BlockDeviceMappings: [
                { DeviceName: '/dev/sda1', NoDevice: '', VirtualName: 'ephemeral0' },
                {
                  DeviceName: '/dev/sda2',
                  Ebs: {
                    DeleteOnTermination: true,
                    Encrypted: true,
                    Iops: 1000,
                    KmsKeyId: {
                      'Fn::Join': [
                        '',
                        ['arn:', { Ref: 'AWS::Partition' }, ':kms:us-east-1:123456789012:alias/device-encryption-key'],
                      ],
                    },
                    Throughput: 125,
                    VolumeSize: 75,
                    VolumeType: 'gp3',
                  },
                },
                {
                  DeviceName: '/dev/sda3',
                  Ebs: {
                    DeleteOnTermination: true,
                    SnapshotId: 'snapshot-id',
                    Iops: 1000,
                    Throughput: 125,
                    VolumeSize: 75,
                    VolumeType: 'gp3',
                  },
                },
              ],
              Image: 'ssm:/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended/image_id',
            },
            KmsKeyId: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':kms:us-east-1:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab',
                ],
              ],
            },
            Name: 'test-container-recipe',
            ParentImage: 'public.ecr.aws/amazonlinux/amazonlinux:latest',
            PlatformOverride: 'Linux',
            Tags: {
              key1: 'value1',
              key2: 'value2',
            },
            TargetRepository: {
              RepositoryName: 'test-repository',
              Service: 'ECR',
            },
            Version: '1.2.3',
            WorkingDirectory: '/var/tmp',
          },
        }),
      },
    });
  });

  test('with required parameters', () => {
    new ContainerRecipe(stack, 'ContainerRecipe', {
      baseImage: BaseContainerImage.fromDockerHub('amazonlinux', 'latest'),
      targetRepository: Repository.fromEcr(ecr.Repository.fromRepositoryName(stack, 'Repository', 'test-repository')),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        ContainerRecipe8A7CC9ED: Match.objectEquals({
          Type: 'AWS::ImageBuilder::ContainerRecipe',
          Properties: {
            Name: 'stack-containerrecipe-fcc21fd4',
            Version: '1.0.x',
            ContainerType: 'DOCKER',
            ParentImage: 'amazonlinux:latest',
            DockerfileTemplateData:
              'FROM {{{ imagebuilder:parentImage }}}\n{{{ imagebuilder:environments }}}\n{{{ imagebuilder:components }}}',
            TargetRepository: {
              RepositoryName: 'test-repository',
              Service: 'ECR',
            },
          },
        }),
      },
    });
  });

  test('with dockerfile data as a file asset', () => {
    new ContainerRecipe(stack, 'ContainerRecipe', {
      baseImage: BaseContainerImage.fromDockerHub('amazonlinux', 'latest'),
      targetRepository: Repository.fromEcr(ecr.Repository.fromRepositoryName(stack, 'Repository', 'test-repository')),
      dockerfile: DockerfileData.fromAsset(stack, 'DockerfileData', path.join(__dirname, 'assets', 'Dockerfile')),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        ContainerRecipe8A7CC9ED: Match.objectEquals({
          Type: 'AWS::ImageBuilder::ContainerRecipe',
          Properties: {
            Name: 'stack-containerrecipe-fcc21fd4',
            Version: '1.0.x',
            ContainerType: 'DOCKER',
            ParentImage: 'amazonlinux:latest',
            DockerfileTemplateUri:
              's3://cdk-hnb659fds-assets-123456789012-us-east-1/2c4690a423fb29c09c3fa969e7c7e6e5e2d612e0d354bee3fab6945e833ebe8e.2c4690a423fb29c09c3fa969e7c7e6e5e2d612e0d354bee3fab6945e833ebe8e',
            TargetRepository: {
              RepositoryName: 'test-repository',
              Service: 'ECR',
            },
          },
        }),
      },
    });
  });

  test('with dockerfile data as an S3 location', () => {
    const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'dockerfile-bucket-123456789012-us-east-1');
    new ContainerRecipe(stack, 'ContainerRecipe', {
      baseImage: BaseContainerImage.fromDockerHub('amazonlinux', 'latest'),
      targetRepository: Repository.fromEcr(ecr.Repository.fromRepositoryName(stack, 'Repository', 'test-repository')),
      dockerfile: DockerfileData.fromS3(bucket, 'dockerfile/Dockerfile'),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        ContainerRecipe8A7CC9ED: Match.objectEquals({
          Type: 'AWS::ImageBuilder::ContainerRecipe',
          Properties: {
            Name: 'stack-containerrecipe-fcc21fd4',
            Version: '1.0.x',
            ContainerType: 'DOCKER',
            ParentImage: 'amazonlinux:latest',
            DockerfileTemplateUri: 's3://dockerfile-bucket-123456789012-us-east-1/dockerfile/Dockerfile',
            TargetRepository: {
              RepositoryName: 'test-repository',
              Service: 'ECR',
            },
          },
        }),
      },
    });
  });

  test('grants read access to IAM roles', () => {
    const containerRecipe = new ContainerRecipe(stack, 'ContainerRecipe', {
      baseImage: BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', 'latest'),
      targetRepository: Repository.fromEcr(ecr.Repository.fromRepositoryName(stack, 'Repository', 'test-repository')),
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    containerRecipe.grantRead(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::ContainerRecipe', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(3);

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::123456789012:root']],
              },
            },
          },
        ],
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: 'imagebuilder:GetContainerRecipe',
            Resource: {
              'Fn::GetAtt': ['ContainerRecipe8A7CC9ED', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants permissions to IAM roles', () => {
    const containerRecipe = new ContainerRecipe(stack, 'ContainerRecipe', {
      baseImage: BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', 'latest'),
      targetRepository: Repository.fromEcr(ecr.Repository.fromRepositoryName(stack, 'Repository', 'test-repository')),
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    containerRecipe.grant(role, 'imagebuilder:DeleteContainerRecipe');

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::ContainerRecipe', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(3);

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::123456789012:root']],
              },
            },
          },
        ],
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: 'imagebuilder:DeleteContainerRecipe',
            Resource: {
              'Fn::GetAtt': ['ContainerRecipe8A7CC9ED', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants S3 put permissions on S3 asset to IAM roles', () => {
    const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'dockerfile-bucket-123456789012-us-east-1');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });
    const dockerfileData = DockerfileData.fromS3(bucket, 'assets/Dockerfile');
    new ContainerRecipe(stack, 'ContainerRecipe', {
      baseImage: BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', 'latest'),
      targetRepository: Repository.fromEcr(ecr.Repository.fromRepositoryName(stack, 'Repository', 'test-repository')),
      dockerfile: dockerfileData,
    });

    dockerfileData.grantPut(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::ContainerRecipe', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(3);

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: Match.anyValue(),
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: Match.arrayWith(['s3:PutObject']),
            Resource: {
              'Fn::Join': [
                '',
                ['arn:', { Ref: 'AWS::Partition' }, ':s3:::dockerfile-bucket-123456789012-us-east-1/assets/Dockerfile'],
              ],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants S3 read permissions on S3 asset to IAM roles', () => {
    const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'dockerfile-bucket-123456789012-us-east-1');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });
    const dockerfileData = DockerfileData.fromS3(bucket, 'assets/Dockerfile');
    new ContainerRecipe(stack, 'ContainerRecipe', {
      baseImage: BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', 'latest'),
      targetRepository: Repository.fromEcr(ecr.Repository.fromRepositoryName(stack, 'Repository', 'test-repository')),
      dockerfile: dockerfileData,
    });

    dockerfileData.grantRead(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::ContainerRecipe', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(3);

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: Match.anyValue(),
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: Match.arrayWith(['s3:GetObject*']),
            Resource: [
              {
                'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::dockerfile-bucket-123456789012-us-east-1']],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':s3:::dockerfile-bucket-123456789012-us-east-1/assets/Dockerfile',
                  ],
                ],
              },
            ],
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('does not throw a validation error when a containerRecipeArn and containerRecipeName are provided when importing by attributes', () => {
    expect(() =>
      ContainerRecipe.fromContainerRecipeAttributes(stack, 'ContainerRecipe', {
        containerRecipeArn:
          'arn:aws:imagebuilder:us-east-1:123456789012:container-recipe/imported-container-recipe/x.x.x',
        containerRecipeName: 'imported-container-recipe',
      }),
    ).not.toThrow(cdk.ValidationError);
  });

  test('throws a validation error when neither a containerRecipeArn or containerRecipeName are provided when importing by attributes', () => {
    expect(() => ContainerRecipe.fromContainerRecipeAttributes(stack, 'ContainerRecipe', {})).toThrow(
      cdk.ValidationError,
    );
  });

  test('throws a validation error when the resource name is too long', () => {
    expect(
      () =>
        new ContainerRecipe(stack, 'ContainerRecipe', {
          containerRecipeName: 'a'.repeat(129),
          baseImage: BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', 'latest'),
          targetRepository: Repository.fromEcr(
            ecr.Repository.fromRepositoryName(stack, 'Repository', 'test-repository'),
          ),
        }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains spaces', () => {
    expect(
      () =>
        new ContainerRecipe(stack, 'ContainerRecipe', {
          containerRecipeName: 'test recipe',
          baseImage: BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', 'latest'),
          targetRepository: Repository.fromEcr(
            ecr.Repository.fromRepositoryName(stack, 'Repository', 'test-repository'),
          ),
        }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains underscores', () => {
    expect(
      () =>
        new ContainerRecipe(stack, 'ContainerRecipe', {
          containerRecipeName: 'test_recipe',
          baseImage: BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', 'latest'),
          targetRepository: Repository.fromEcr(
            ecr.Repository.fromRepositoryName(stack, 'Repository', 'test-repository'),
          ),
        }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains uppercase characters', () => {
    expect(
      () =>
        new ContainerRecipe(stack, 'ContainerRecipe', {
          containerRecipeName: 'TestRecipe',
          baseImage: BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', 'latest'),
          targetRepository: Repository.fromEcr(
            ecr.Repository.fromRepositoryName(stack, 'Repository', 'test-repository'),
          ),
        }),
    ).toThrow(cdk.ValidationError);
  });
});
