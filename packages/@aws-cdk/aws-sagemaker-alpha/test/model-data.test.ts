import { App, BundlingOutput, DockerImage, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as path from 'path';
import * as sagemaker from '../lib';

const repositoryName = 'huggingface-pytorch-training';
const tag = '1.13.1-transformers4.26.0-gpu-py39-cu117-ubuntu20.04';

describe('When creating model data from a local asset', () => {
  test('when supplying a directory, then should throw exception', () => {
    // WHEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const directoryModelData = sagemaker.ModelData.fromAsset(path.join(__dirname, 'test-artifacts'));
    const when = () => new sagemaker.Model(stack, 'DirectoryModelData', {
      containers: [
        {
          image: sagemaker.ContainerImage.fromDlc(repositoryName, tag),
          modelData: directoryModelData,
        },
      ],
    });

    // THEN
    expect(when).toThrow(/Asset must be a file, if you want to use directory you can use 'ModelData.fromBucket\(\)' with the 's3DataType' option to 'S3DataType.S3_PREFIX' and 'compressionType' option to 'CompressionType.NONE'/);
  });

  test('when supplying a uncompressed file, then should use ModelDataSource', () => {
    // WHEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const uncompressedModelData = sagemaker.ModelData.fromAsset(path.join(__dirname, 'test-artifacts', 'valid-artifact', 'artifact.txt'));
    new sagemaker.Model(stack, 'UncompressedModel', {
      containers: [
        {
          image: sagemaker.ContainerImage.fromDlc(repositoryName, tag),
          modelData: uncompressedModelData,
        },
      ],
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::SageMaker::Model', {
      PrimaryContainer:
        {
          ModelDataSource: {
            S3DataSource: {
              CompressionType: 'None',
              S3DataType: 'S3Object',
              S3Uri: {
                'Fn::Sub': 'https://s3.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/a68d80e0d361fffcc4b0d5aa81f61badbf05b951feb5c96bc4fa472cbe95fe02.txt',
              },
            },
          },
        },
    });
    template.resourcePropertiesCountIs('AWS::SageMaker::Model', {
      PrimaryContainer: {
        ModelDataUrl: Match.anyValue(),
      },
    }, 0);
  });

  test('when supplying a compressed file, then should use ModelDataUrl', () => {
    // WHEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const compressedModelData = sagemaker.ModelData.fromAsset(path.join(__dirname, 'test-artifacts', 'valid-artifact.tar.gz'));
    new sagemaker.Model(stack, 'CompressedModel', {
      containers: [
        {
          image: sagemaker.ContainerImage.fromDlc(repositoryName, tag),
          modelData: compressedModelData,
        },
      ],
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::SageMaker::Model', {
      PrimaryContainer:
        {
          ModelDataUrl: { 'Fn::Sub': 'https://s3.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/126d48fa0e32fbef5078b9d88658b35ad29d4291eb86675a64c75fa4f1338916.gz' },
        },
    });
    template.resourcePropertiesCountIs('AWS::SageMaker::Model', {
      PrimaryContainer: {
        ModelDataSource: Match.anyValue(),
      },
    }, 0);
  });

  test('when using bundling options that output compressed file, then should use ModelDataUrl', () => {
    // WHEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const compressedModel = sagemaker.ModelData.fromAsset(path.join(__dirname, 'test-artifacts', 'valid-artifact'), {
      bundling: {
        image: DockerImage.fromRegistry('python:3'),
        command: ['tar', '-zcvf', '/asset-output/valid-artifact.tar.gz', './'],
      },
    });
    new sagemaker.Model(stack, 'CompressedModel', {
      containers: [
        {
          image: sagemaker.ContainerImage.fromDlc(repositoryName, tag),
          modelData: compressedModel,
        },
      ],
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::SageMaker::Model', {
      PrimaryContainer:
        {
          ModelDataUrl: {
            'Fn::Sub': 'https://s3.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/7f0a63330b903ae3410f09f58893b247a7b10c94e6803f973a07f2bd8957441f.gz',
          },
        },
    });
    template.resourcePropertiesCountIs('AWS::SageMaker::Model', {
      PrimaryContainer: {
        ModelDataSource: Match.anyValue(),
      },
    }, 0);
  });

  test('when using bundling options that output uncompressed file, then should use ModelDataSource', () => {
    // WHEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const uncompressedModel = sagemaker.ModelData.fromAsset(path.join(__dirname, 'test-artifacts', 'valid-artifact'), {
      bundling: {
        image: DockerImage.fromRegistry('python:3'),
        command: ['cp', './artifact.txt', '/asset-output/'],
        outputType: BundlingOutput.SINGLE_FILE,
      },
    });
    new sagemaker.Model(stack, 'UncompressedModel', {
      containers: [
        {
          image: sagemaker.ContainerImage.fromDlc(repositoryName, tag),
          modelData: uncompressedModel,
        },
      ],
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::SageMaker::Model', {
      PrimaryContainer:
        {
          ModelDataSource: {
            S3DataSource: {
              CompressionType: 'None',
              S3DataType: 'S3Object',
              S3Uri: {
                'Fn::Sub': 'https://s3.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/40349bd9efa0114093ed6181f009223e3eae1fb8930a2a9c5159718dcddf39d8.txt',
              },
            },
          },
        },
    });
    template.resourcePropertiesCountIs('AWS::SageMaker::Model', {
      PrimaryContainer: {
        ModelDataUrl: Match.anyValue(),
      },
    }, 0);
  });

  test('when using bundling options to output directory, then should throw exception', () => {
    // WHEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const directoryModelData = sagemaker.ModelData.fromAsset(path.join(__dirname, 'test-artifacts'), {
      bundling: {
        image: DockerImage.fromRegistry('python:3'),
        command: ['touch', '{artifact-a.txt,artifact-b.txt}'],
        workingDirectory: '/asset-output',
      },
    });
    const when = () => new sagemaker.Model(stack, 'DirectoryModelData', {
      containers: [
        {
          image: sagemaker.ContainerImage.fromDlc(repositoryName, tag),
          modelData: directoryModelData,
        },
      ],
    });

    // THEN
    expect(when).toThrow(/Asset must be a file, if you want to use directory you can use 'ModelData.fromBucket\(\)' with the 's3DataType' option to 'S3DataType.S3_PREFIX' and 'compressionType' option to 'CompressionType.NONE'/);
  });
});
