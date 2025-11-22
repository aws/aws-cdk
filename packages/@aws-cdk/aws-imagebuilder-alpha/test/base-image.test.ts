import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import {
  AwsManagedImage,
  BaseContainerImage,
  BaseImage,
  ContainerInstanceImage,
  ImageArchitecture,
  ImageType,
} from '../lib';

describe('Base Image', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('should return the correct base image for an AMI ID', () => {
    const baseImage = BaseImage.fromAmiId('ami-12345678');
    expect(baseImage.image).toEqual('ami-12345678');
  });

  test('should return the correct base image for an IImage', () => {
    const baseImage = AwsManagedImage.amazonLinux2023(stack, 'AL2023', {
      imageArchitecture: ImageArchitecture.ARM64,
      imageType: ImageType.AMI,
    }).toBaseImage();

    expect(stack.resolve(baseImage.image)).toEqual({
      'Fn::Join': [
        '',
        ['arn:', { Ref: 'AWS::Partition' }, ':imagebuilder:us-east-1:aws:image/amazon-linux-2023-arm64/x.x.x'],
      ],
    });
  });

  test('should return the correct base image for a marketplace product ID', () => {
    const baseImage = BaseImage.fromMarketplaceProductId('prod-1234');
    expect(baseImage.image).toEqual('prod-1234');
  });

  test('should return the correct base image for an SSM parameter', () => {
    const baseImage = BaseImage.fromSsmParameter(
      ssm.StringParameter.fromStringParameterAttributes(stack, 'Parameter', {
        parameterName: '/imagebuilder/ami',
        forceDynamicReference: true,
      }),
    );
    expect(stack.resolve(baseImage.image)).toEqual({
      'Fn::Join': [
        '',
        ['ssm:arn:', { Ref: 'AWS::Partition' }, ':ssm:us-east-1:123456789012:parameter/imagebuilder/ami'],
      ],
    });
  });

  test('should return the correct base image for an SSM parameter name', () => {
    const baseImage = BaseImage.fromSsmParameterName('/imagebuilder/ami');
    expect(baseImage.image).toEqual('ssm:/imagebuilder/ami');
  });

  test('should return the correct base image for a generic string', () => {
    const baseImage = BaseImage.fromString('base-image');
    expect(baseImage.image).toEqual('base-image');
  });
});

describe('Base Container Image', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('should return the correct container base image for a dockerhub image', () => {
    const baseImage = BaseContainerImage.fromDockerHub('amazonlinux', 'latest');
    expect(baseImage.image).toEqual('amazonlinux:latest');
  });

  test('should return the correct container base image for an ECR image', () => {
    const baseImage = BaseContainerImage.fromEcr(
      ecr.Repository.fromRepositoryName(stack, 'BaseImageRepo', 'base-image-repo'),
      'latest',
    );
    expect(stack.resolve(baseImage.image)).toEqual({
      'Fn::Join': ['', ['123456789012.dkr.ecr.us-east-1.', { Ref: 'AWS::URLSuffix' }, '/base-image-repo:latest']],
    });
  });

  test('should return the correct container base image for an ECR public image', () => {
    const baseImage = BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', 'latest');
    expect(baseImage.image).toEqual('public.ecr.aws/amazonlinux/amazonlinux:latest');
  });

  test('should return the correct container base image for an IImage', () => {
    const baseImage = AwsManagedImage.amazonLinux2023(stack, 'AL2023', {
      imageArchitecture: ImageArchitecture.X86_64,
      imageType: ImageType.DOCKER,
    }).toContainerBaseImage();

    expect(stack.resolve(baseImage.image)).toEqual({
      'Fn::Join': [
        '',
        ['arn:', { Ref: 'AWS::Partition' }, ':imagebuilder:us-east-1:aws:image/amazon-linux-2023-x86-2023/x.x.x'],
      ],
    });
  });

  test('should return the correct container base image for a generic string', () => {
    const baseImage = BaseContainerImage.fromString('base-image');
    expect(baseImage.image).toEqual('base-image');
  });
});

describe('Container Instance Image', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('should return the correct container instance image for an AMI ID', () => {
    const containerInstanceImage = ContainerInstanceImage.fromAmiId('ami-12345678');
    expect(containerInstanceImage.image).toEqual('ami-12345678');
  });

  test('should return the correct container instance image for an SSM parameter', () => {
    const containerInstanceImage = ContainerInstanceImage.fromSsmParameter(
      ssm.StringParameter.fromStringParameterAttributes(stack, 'Parameter', {
        parameterName: '/imagebuilder/ami',
        forceDynamicReference: true,
      }),
    );
    expect(stack.resolve(containerInstanceImage.image)).toEqual({
      'Fn::Join': [
        '',
        ['ssm:arn:', { Ref: 'AWS::Partition' }, ':ssm:us-east-1:123456789012:parameter/imagebuilder/ami'],
      ],
    });
  });

  test('should return the correct container instance image for an SSM parameter name', () => {
    const containerInstanceImage = ContainerInstanceImage.fromSsmParameterName('/imagebuilder/ami');
    expect(containerInstanceImage.image).toEqual('ssm:/imagebuilder/ami');
  });

  test('should return the correct container instance image for a generic string', () => {
    const baseImage = ContainerInstanceImage.fromString('container-instance-image');
    expect(baseImage.image).toEqual('container-instance-image');
  });
});
