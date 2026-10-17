import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import type { IRecipeBase } from '../lib';
import {
  AmazonManagedComponent,
  BaseImage,
  Component,
  ComponentParameterValue,
  ImageRecipe,
  Platform,
} from '../lib';

describe('Image Recipe', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('imported by name', () => {
    const imageRecipe = ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', 'imported-image-recipe-by-name');

    expect(stack.resolve(imageRecipe.imageRecipeArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:image-recipe/imported-image-recipe-by-name/x.x.x',
        ],
      ],
    });
    expect(imageRecipe.imageRecipeName).toEqual('imported-image-recipe-by-name');
    expect(imageRecipe.imageRecipeVersion).toEqual('x.x.x');
    expect((imageRecipe as IRecipeBase)._isImageRecipe()).toBeTruthy();
  });

  test('imported by name as an unresolved token', () => {
    const imageRecipe = ImageRecipe.fromImageRecipeName(stack, 'ImageRecipe', `test-image-recipe-${stack.partition}`);

    expect(stack.resolve(imageRecipe.imageRecipeArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:image-recipe/test-image-recipe-',
          { Ref: 'AWS::Partition' },
          '/x.x.x',
        ],
      ],
    });
    expect(stack.resolve(imageRecipe.imageRecipeName)).toEqual({
      'Fn::Join': ['', ['test-image-recipe-', { Ref: 'AWS::Partition' }]],
    });
    expect(imageRecipe.imageRecipeVersion).toEqual('x.x.x');
  });

  test('imported by arn', () => {
    const imageRecipe = ImageRecipe.fromImageRecipeArn(
      stack,
      'ImageRecipe',
      'arn:aws:imagebuilder:us-east-1:123456789012:image-recipe/imported-image-recipe-by-arn/1.2.3',
    );

    expect(stack.resolve(imageRecipe.imageRecipeArn)).toEqual(
      'arn:aws:imagebuilder:us-east-1:123456789012:image-recipe/imported-image-recipe-by-arn/1.2.3',
    );
    expect(imageRecipe.imageRecipeName).toEqual('imported-image-recipe-by-arn');
    expect(imageRecipe.imageRecipeVersion).toEqual('1.2.3');
  });

  test('imported by arn as an unresolved token', () => {
    const imageRecipe = ImageRecipe.fromImageRecipeArn(
      stack,
      'ImageRecipe',
      `arn:aws:imagebuilder:us-east-1:123456789012:image-recipe/test-image-recipe-${stack.partition}/1.2.3`,
    );

    expect(stack.resolve(imageRecipe.imageRecipeArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:aws:imagebuilder:us-east-1:123456789012:image-recipe/test-image-recipe-',
          { Ref: 'AWS::Partition' },
          '/1.2.3',
        ],
      ],
    });
    expect(stack.resolve(imageRecipe.imageRecipeName)).toEqual({
      'Fn::Select': [
        0,
        {
          'Fn::Split': ['/', { 'Fn::Join': ['', ['test-image-recipe-', { Ref: 'AWS::Partition' }, '/1.2.3']] }],
        },
      ],
    });
    expect(stack.resolve(imageRecipe.imageRecipeVersion)).toEqual({
      'Fn::Select': [
        1,
        {
          'Fn::Split': ['/', { 'Fn::Join': ['', ['test-image-recipe-', { Ref: 'AWS::Partition' }, '/1.2.3']] }],
        },
      ],
    });
  });

  test('imported by attributes', () => {
    const imageRecipe = ImageRecipe.fromImageRecipeAttributes(stack, 'ImageRecipe', {
      imageRecipeName: 'imported-image-recipe-by-attributes',
      imageRecipeVersion: '1.2.3',
    });

    expect(stack.resolve(imageRecipe.imageRecipeArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:image-recipe/imported-image-recipe-by-attributes/1.2.3',
        ],
      ],
    });
    expect(imageRecipe.imageRecipeName).toEqual('imported-image-recipe-by-attributes');
    expect(imageRecipe.imageRecipeVersion).toEqual('1.2.3');
  });

  test('with all parameters', () => {
    const userData = ec2.UserData.forLinux();
    userData.addCommands('echo "Hello World"');

    const imageRecipe = new ImageRecipe(stack, 'ImageRecipe', {
      imageRecipeName: 'test-image-recipe',
      imageRecipeVersion: '1.2.3',
      baseImage: BaseImage.fromSsmParameterName(
        '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
      ),
      description: 'A test image recipe',
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
      amiTags: {
        imageTag1: 'imageValue1',
        imageTag2: 'imageValue2',
      },
      workingDirectory: '/var/tmp',
      uninstallSsmAgentAfterBuild: true,
      userDataOverride: userData,
      blockDevices: [
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

    imageRecipe.addBlockDevice(
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

    expect(ImageRecipe.isImageRecipe(imageRecipe as unknown)).toBeTruthy();
    expect(ImageRecipe.isImageRecipe('ImageRecipe')).toBeFalsy();
    expect((imageRecipe as IRecipeBase)._isImageRecipe()).toBeTruthy();

    Template.fromStack(stack).templateMatches({
      Resources: {
        ImageRecipe8C789631: Match.objectEquals({
          Type: 'AWS::ImageBuilder::ImageRecipe',
          Properties: {
            AdditionalInstanceConfiguration: {
              SystemsManagerAgent: { UninstallAfterBuild: true },
              UserDataOverride: { 'Fn::Base64': '#!/bin/bash\necho "Hello World"' },
            },
            AmiTags: { imageTag1: 'imageValue1', imageTag2: 'imageValue2' },
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
            Description: 'A test image recipe',
            Name: 'test-image-recipe',
            ParentImage: 'ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
            Tags: { key1: 'value1', key2: 'value2' },
            Version: '1.2.3',
            WorkingDirectory: '/var/tmp',
          },
        }),
      },
    });
  });

  test('with required parameters', () => {
    new ImageRecipe(stack, 'ImageRecipe', {
      baseImage: BaseImage.fromSsmParameterName(
        '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
      ),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        ImageRecipe8C789631: Match.objectEquals({
          Type: 'AWS::ImageBuilder::ImageRecipe',
          Properties: {
            Name: 'stack-imagerecipe-1e832b66',
            Version: '1.0.x',
            ParentImage: 'ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
          },
        }),
      },
    });
  });

  test('grants read access to IAM roles', () => {
    const imageRecipe = new ImageRecipe(stack, 'ImageRecipe', {
      baseImage: BaseImage.fromSsmParameterName(
        '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
      ),
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    imageRecipe.grantRead(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::ImageRecipe', 1);
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
            Action: 'imagebuilder:GetImageRecipe',
            Resource: {
              'Fn::GetAtt': ['ImageRecipe8C789631', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants permissions to IAM roles', () => {
    const imageRecipe = new ImageRecipe(stack, 'ImageRecipe', {
      baseImage: BaseImage.fromSsmParameterName(
        '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
      ),
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    imageRecipe.grant(role, 'imagebuilder:DeleteImageRecipe');

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::ImageRecipe', 1);
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
            Action: 'imagebuilder:DeleteImageRecipe',
            Resource: {
              'Fn::GetAtt': ['ImageRecipe8C789631', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('does not throw a validation error when an imageRecipeArn and imageRecipeName are provided when importing by attributes', () => {
    expect(() =>
      ImageRecipe.fromImageRecipeAttributes(stack, 'ImageRecipe', {
        imageRecipeArn: 'arn:aws:imagebuilder:us-east-1:123456789012:image-recipe/imported-image-recipe/x.x.x',
        imageRecipeName: 'imported-image-recipe',
      }),
    ).not.toThrow(cdk.ValidationError);
  });

  test('throws a validation error when neither an imageRecipeArn or imageRecipeName are provided when importing by attributes', () => {
    expect(() => ImageRecipe.fromImageRecipeAttributes(stack, 'ImageRecipe', {})).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name is too long', () => {
    expect(
      () =>
        new ImageRecipe(stack, 'ImageRecipe', {
          imageRecipeName: 'a'.repeat(129),
          baseImage: BaseImage.fromSsmParameterName(
            '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
          ),
        }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains spaces', () => {
    expect(
      () =>
        new ImageRecipe(stack, 'ImageRecipe', {
          imageRecipeName: 'test recipe',
          baseImage: BaseImage.fromSsmParameterName(
            '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
          ),
        }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains underscores', () => {
    expect(
      () =>
        new ImageRecipe(stack, 'ImageRecipe', {
          imageRecipeName: 'test_recipe',
          baseImage: BaseImage.fromSsmParameterName(
            '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
          ),
        }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains uppercase characters', () => {
    expect(
      () =>
        new ImageRecipe(stack, 'ImageRecipe', {
          imageRecipeName: 'TestRecipe',
          baseImage: BaseImage.fromSsmParameterName(
            '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
          ),
        }),
    ).toThrow(cdk.ValidationError);
  });
});
