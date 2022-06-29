import * as fs from 'fs';
import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import { describeDeprecated, testDeprecated, testLegacyBehavior, testFutureBehavior } from '@aws-cdk/cdk-build-tools';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { App, DefaultStackSynthesizer, IgnoreMode, Lazy, LegacyStackSynthesizer, Stack, Stage } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { DockerImageAsset, NetworkMode, Platform } from '../lib';

/* eslint-disable quote-props */

const DEMO_IMAGE_ASSET_HASH = '0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14';

const flags = { [cxapi.DOCKER_IGNORE_SUPPORT]: true };

class MyApp extends App {
  constructor() {
    super({
      context: flags,
    });
  }
}

describe('image asset', () => {
  testLegacyBehavior('test instantiating Asset Image', MyApp, (app) => {
    // WHEN
    const stack = new Stack(app);
    new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
    });

    // THEN
    const asm = app.synth();
    const artifact = asm.getStackArtifact(stack.artifactId);
    expect(artifact.template).toEqual({});
    expect(artifact.assets).toEqual([
      {
        repositoryName: 'aws-cdk/assets',
        imageTag: '0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14',
        id: '0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14',
        packaging: 'container-image',
        path: 'asset.0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14',
        sourceHash: '0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14',
      },
    ]);

  });

  testLegacyBehavior('with build args', App, (app) => {
    // WHEN
    const stack = new Stack(app);
    new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
      buildArgs: {
        a: 'b',
      },
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);
    expect(assetMetadata && (assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry).buildArgs).toEqual({ a: 'b' });

  });

  testFutureBehavior('without build shell', flags, App, (app) => {
    // WHEN
    const stack = new Stack(app);
    new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
    });

    // THEN
    const assetMetadata = stack.node.metadataEntry.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);
    expect(assetMetadata && (assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry).buildShell).toBeUndefined();
  });

  testFutureBehavior('with build shell', flags, App, (app) => {
    // WHEN
    const stack = new Stack(app);
    new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
      buildShell: '/bin/sh',
    });

    // THEN
    const assetMetadata = stack.node.metadataEntry.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);
    expect(assetMetadata && (assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry).buildShell).toEqual('/bin/sh');
  });

  testLegacyBehavior('with hash options', App, (app) => {
    // WHEN
    const stack = new Stack(app);
    new DockerImageAsset(stack, 'Image1', {
      directory: path.join(__dirname, 'demo-image'),
      buildArgs: {
        a: 'b',
      },
      invalidation: {
        buildArgs: false,
      },
    });
    new DockerImageAsset(stack, 'Image2', {
      directory: path.join(__dirname, 'demo-image'),
      buildArgs: {
        a: 'c',
      },
      invalidation: {
        buildArgs: false,
      },
    });
    new DockerImageAsset(stack, 'Image3', {
      directory: path.join(__dirname, 'demo-image'),
      buildArgs: {
        a: 'b',
      },
    });

    // THEN
    const asm = app.synth();
    const artifact = asm.getStackArtifact(stack.artifactId);
    expect(artifact.template.Resources).toBeUndefined();
    expect(artifact.assets).toEqual([
      {
        buildArgs: { 'a': 'b' },
        id: '0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14',
        imageTag: '0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14',
        packaging: 'container-image',
        path: 'asset.0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14',
        repositoryName: 'aws-cdk/assets',
        sourceHash: '0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14',
      },
      {
        buildArgs: { 'a': 'b' },
        id: '7f3aa0a36ecd282884e11463b3fde119d25d1ed424f934300f0c7b9cf6f63947',
        imageTag: '7f3aa0a36ecd282884e11463b3fde119d25d1ed424f934300f0c7b9cf6f63947',
        packaging: 'container-image',
        path: 'asset.7f3aa0a36ecd282884e11463b3fde119d25d1ed424f934300f0c7b9cf6f63947',
        repositoryName: 'aws-cdk/assets',
        sourceHash: '7f3aa0a36ecd282884e11463b3fde119d25d1ed424f934300f0c7b9cf6f63947',
      },
    ]);
  });

  testLegacyBehavior('with target', App, (app) => {
    // WHEN
    const stack = new Stack(app);
    new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
      buildArgs: {
        a: 'b',
      },
      target: 'a-target',
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);
    expect(assetMetadata && (assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry).target).toEqual('a-target');

  });

  testLegacyBehavior('with file', App, (app) => {
    // GIVEN
    const stack = new Stack(app);
    const directoryPath = path.join(__dirname, 'demo-image-custom-docker-file');
    // WHEN
    new DockerImageAsset(stack, 'Image', {
      directory: directoryPath,
      file: 'Dockerfile.Custom',
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);
    expect(assetMetadata && (assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry).file).toEqual('Dockerfile.Custom');
  });

  testLegacyBehavior('with networkMode', App, (app) => {
    // GIVEN
    const stack = new Stack(app);
    // WHEN
    new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
      networkMode: NetworkMode.DEFAULT,
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);
    expect(assetMetadata && (assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry).networkMode).toEqual('default');
  });

  testLegacyBehavior('with platform', App, (app) => {
    // GIVEN
    const stack = new Stack(app);
    // WHEN
    new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
      platform: Platform.LINUX_ARM64,
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);
    expect(assetMetadata && (assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry).platform).toEqual('linux/arm64');
  });

  testLegacyBehavior('with platform: default synth edition', App, (app) => {
    // GIVEN
    const stack = new Stack(app, 'Stack', { synthesizer: new DefaultStackSynthesizer() });
    // WHEN
    const asset = new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
      platform: Platform.LINUX_ARM64,
    });

    // THEN
    const asm = app.synth();
    const stackAssets = JSON.parse(fs.readFileSync(path.join(asm.directory, 'Stack.assets.json'), { encoding: 'utf-8' }));
    const dockerImageAsset = stackAssets.dockerImages[asset.assetHash];
    expect(dockerImageAsset.source.platform).toEqual('linux/arm64');
  });
  testLegacyBehavior('asset.repository.grantPull can be used to grant a principal permissions to use the image', App, (app) => {
    // GIVEN
    const stack = new Stack(app);
    const user = new iam.User(stack, 'MyUser');
    const asset = new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
    });

    // WHEN
    asset.repository.grantPull(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        'Statement': [
          {
            'Action': [
              'ecr:BatchCheckLayerAvailability',
              'ecr:GetDownloadUrlForLayer',
              'ecr:BatchGetImage',
            ],
            'Effect': 'Allow',
            'Resource': {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    'Ref': 'AWS::Partition',
                  },
                  ':ecr:',
                  {
                    'Ref': 'AWS::Region',
                  },
                  ':',
                  {
                    'Ref': 'AWS::AccountId',
                  },
                  ':repository/aws-cdk/assets',
                ],
              ],
            },
          },
          {
            'Action': 'ecr:GetAuthorizationToken',
            'Effect': 'Allow',
            'Resource': '*',
          },
        ],
        'Version': '2012-10-17',
      },
      'PolicyName': 'MyUserDefaultPolicy7B897426',
      'Users': [
        {
          'Ref': 'MyUserDC45028B',
        },
      ],
    });
  });

  test('fails if the directory does not exist', () => {
    const stack = new Stack();
    // THEN
    expect(() => {
      new DockerImageAsset(stack, 'MyAsset', {
        directory: `/does/not/exist/${Math.floor(Math.random() * 9999)}`,
      });
    }).toThrow(/Cannot find image directory at/);

  });

  test('fails if the directory does not contain a Dockerfile', () => {
    const stack = new Stack();
    // THEN
    expect(() => {
      new DockerImageAsset(stack, 'Asset', {
        directory: __dirname,
      });
    }).toThrow(/Cannot find file at/);

  });

  test('fails if the file does not exist', () => {
    const stack = new Stack();
    // THEN
    expect(() => {
      new DockerImageAsset(stack, 'Asset', {
        directory: __dirname,
        file: 'doesnt-exist',
      });
    }).toThrow(/Cannot find file at/);

  });

  testFutureBehavior('docker directory is staged if asset staging is enabled', flags, App, (app) => {
    const stack = new Stack(app);
    const image = new DockerImageAsset(stack, 'MyAsset', {
      directory: path.join(__dirname, 'demo-image'),
    });

    const session = app.synth();

    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'Dockerfile'))).toBe(true);
    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'index.py'))).toBe(true);

  });

  describeDeprecated('docker ignore option', () => {
    // The 'ignoreMode' property is both deprecated and not deprecated in DockerImageAssetProps interface.
    // The interface through a complex set of inheritance chain has a 'ignoreMode' prop that is deprecated
    // and another 'ignoreMode' prop that is not deprecated.
    // Using a 'describeDeprecated' block here since there's no way to work around this craziness.
    // When the deprecated property is removed source code, this block can be dropped.

    testFutureBehavior('docker directory is staged without files specified in .dockerignore', flags, App, (app) => {
      testDockerDirectoryIsStagedWithoutFilesSpecifiedInDockerignore(app);
    });

    testFutureBehavior('docker directory is staged without files specified in .dockerignore with IgnoreMode.GLOB', flags, App, (app) => {
      testDockerDirectoryIsStagedWithoutFilesSpecifiedInDockerignore(app, IgnoreMode.GLOB);
    });
  });

  testFutureBehavior('docker directory is staged with allow-listed files specified in .dockerignore', flags, App, (app) => {
    const stack = new Stack(app);
    const image = new DockerImageAsset(stack, 'MyAsset', {
      directory: path.join(__dirname, 'allow-listed-image'),
    });

    const session = app.synth();

    // Only the files exempted above should be included.
    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, '.dockerignore'))).toBe(true);
    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'Dockerfile'))).toBe(true);
    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'index.py'))).toBe(true);
    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'foobar.txt'))).toBe(true);
    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'subdirectory'))).toBe(true);
    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'subdirectory', 'baz.txt'))).toBe(true);
    expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'node_modules'))).toBe(true);
    expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'node_modules', 'one'))).toBe(true);
    expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'node_modules', 'some_dep'))).toBe(true);
    expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'node_modules', 'some_dep', 'file'))).toBe(true);
  });

  testFutureBehavior('docker directory is staged without files specified in exclude option', flags, App, (app) => {
    testDockerDirectoryIsStagedWithoutFilesSpecifiedInExcludeOption(app);
  });

  testFutureBehavior('docker directory is staged without files specified in exclude option with IgnoreMode.GLOB', flags, App, (app) => {
    testDockerDirectoryIsStagedWithoutFilesSpecifiedInExcludeOption(app, IgnoreMode.GLOB);
  });

  test('fails if using tokens in build args keys or values', () => {
    // GIVEN
    const stack = new Stack();
    const token = Lazy.string({ produce: () => 'foo' });
    const expected = /Cannot use tokens in keys or values of "buildArgs" since they are needed before deployment/;

    // THEN
    expect(() => new DockerImageAsset(stack, 'MyAsset1', {
      directory: path.join(__dirname, 'demo-image'),
      buildArgs: { [token]: 'value' },
    })).toThrow(expected);

    expect(() => new DockerImageAsset(stack, 'MyAsset2', {
      directory: path.join(__dirname, 'demo-image'),
      buildArgs: { key: token },
    })).toThrow(expected);
  });

  testDeprecated('fails if using token as repositoryName', () => {
    // GIVEN
    const stack = new Stack();
    const token = Lazy.string({ produce: () => 'foo' });

    // THEN
    expect(() => new DockerImageAsset(stack, 'MyAsset1', {
      directory: path.join(__dirname, 'demo-image'),
      repositoryName: token,
    })).toThrow(/Cannot use Token as value of 'repositoryName'/);
  });

  testFutureBehavior('docker build options are included in the asset id', flags, App, (app) => {
    // GIVEN
    const stack = new Stack(app);
    const directory = path.join(__dirname, 'demo-image-custom-docker-file');

    const asset1 = new DockerImageAsset(stack, 'Asset1', { directory });
    const asset2 = new DockerImageAsset(stack, 'Asset2', { directory, file: 'Dockerfile.Custom' });
    const asset3 = new DockerImageAsset(stack, 'Asset3', { directory, target: 'NonDefaultTarget' });
    const asset4 = new DockerImageAsset(stack, 'Asset4', { directory, buildArgs: { opt1: '123', opt2: 'boom' } });
    const asset5 = new DockerImageAsset(stack, 'Asset5', { directory, file: 'Dockerfile.Custom', target: 'NonDefaultTarget' });
    const asset6 = new DockerImageAsset(stack, 'Asset6', { directory, extraHash: 'random-extra' });

    expect(asset1.assetHash).toEqual('13248c55633f3b198a628bb2ea4663cb5226f8b2801051bd0c725950266fd590');
    expect(asset2.assetHash).toEqual('36bf205fb9adc5e45ba1c8d534158a0aed96d190eff433af1d90f3b94f96e751');
    expect(asset3.assetHash).toEqual('4c85bd70e73117b7129c2defbe6dc40a8a3872329f4ddca18d75afa671b38276');
    expect(asset4.assetHash).toEqual('8a91219a7bb0f58b3282dd84acbf4c03c49c765be54ffb7b125be6a50b6c5645');
    expect(asset5.assetHash).toEqual('c02bfba13b2e7e1ff5c778a76e10296b9e8d17f7f8252d097f4170ae04ce0eb4');
    expect(asset6.assetHash).toEqual('3528d6838647a5e9011b0f35aec514d03ad11af05a94653cdcf4dacdbb070a06');

  });

  testDeprecated('repositoryName is included in the asset id', () => {
    const stack = new Stack();
    const directory = path.join(__dirname, 'demo-image-custom-docker-file');

    const asset1 = new DockerImageAsset(stack, 'Asset1', { directory });
    const asset2 = new DockerImageAsset(stack, 'Asset2', { directory, repositoryName: 'foo' });

    expect(asset1.assetHash).toEqual('13248c55633f3b198a628bb2ea4663cb5226f8b2801051bd0c725950266fd590');
    expect(asset2.assetHash).toEqual('b78978ca702a8eccd37804ce31d76cd83a695b557dbf95aeb109332ee8b1fd32');
  });
});

function testDockerDirectoryIsStagedWithoutFilesSpecifiedInDockerignore(app: App, ignoreMode?: IgnoreMode) {
  const stack = new Stack(app);
  const image = new DockerImageAsset(stack, 'MyAsset', {
    ignoreMode,
    directory: path.join(__dirname, 'dockerignore-image'),
  });

  const session = app.synth();

  // .dockerignore itself should be included in output to be processed during docker build
  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, '.dockerignore'))).toBe(true);
  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'Dockerfile'))).toBe(true);
  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'index.py'))).toBe(true);
  expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'foobar.txt'))).toBe(true);
  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'subdirectory'))).toBe(true);
  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'subdirectory', 'baz.txt'))).toBe(true);
}

function testDockerDirectoryIsStagedWithoutFilesSpecifiedInExcludeOption(app: App, ignoreMode?: IgnoreMode) {
  const stack = new Stack(app);
  const image = new DockerImageAsset(stack, 'MyAsset', {
    directory: path.join(__dirname, 'dockerignore-image'),
    exclude: ['subdirectory'],
    ignoreMode,
  });

  const session = app.synth();

  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, '.dockerignore'))).toBe(true);
  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'Dockerfile'))).toBe(true);
  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'index.py'))).toBe(true);
  expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'foobar.txt'))).toBe(true);
  expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'subdirectory'))).toBe(true);
  expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'subdirectory', 'baz.txt'))).toBe(true);
}

testFutureBehavior('nested assemblies share assets: legacy synth edition', flags, App, (app) => {
  // GIVEN
  const stack1 = new Stack(new Stage(app, 'Stage1'), 'Stack', { synthesizer: new LegacyStackSynthesizer() });
  const stack2 = new Stack(new Stage(app, 'Stage2'), 'Stack', { synthesizer: new LegacyStackSynthesizer() });

  // WHEN
  new DockerImageAsset(stack1, 'Image', { directory: path.join(__dirname, 'demo-image') });
  new DockerImageAsset(stack2, 'Image', { directory: path.join(__dirname, 'demo-image') });

  // THEN
  const assembly = app.synth();

  // Read the assets from the stack metadata
  for (const stageName of ['Stage1', 'Stage2']) {
    const stackArtifact = assembly.getNestedAssembly(`assembly-${stageName}`).artifacts.filter(isStackArtifact)[0];
    const assetMeta = stackArtifact.findMetadataByType(cxschema.ArtifactMetadataEntryType.ASSET);
    expect(assetMeta[0]).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          path: `../asset.${DEMO_IMAGE_ASSET_HASH}`,
        }),
      }),
    );
  }
});

testFutureBehavior('nested assemblies share assets: default synth edition', flags, App, (app) => {
  // GIVEN
  const stack1 = new Stack(new Stage(app, 'Stage1'), 'Stack', { synthesizer: new DefaultStackSynthesizer() });
  const stack2 = new Stack(new Stage(app, 'Stage2'), 'Stack', { synthesizer: new DefaultStackSynthesizer() });

  // WHEN
  new DockerImageAsset(stack1, 'Image', { directory: path.join(__dirname, 'demo-image') });
  new DockerImageAsset(stack2, 'Image', { directory: path.join(__dirname, 'demo-image') });

  // THEN
  const assembly = app.synth();

  // Read the asset manifests to verify the file paths
  for (const stageName of ['Stage1', 'Stage2']) {
    const manifestArtifact = assembly.getNestedAssembly(`assembly-${stageName}`).artifacts.filter(cxapi.AssetManifestArtifact.isAssetManifestArtifact)[0];
    const manifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));

    expect(manifest.dockerImages[DEMO_IMAGE_ASSET_HASH].source).toEqual({
      directory: `../asset.${DEMO_IMAGE_ASSET_HASH}`,
    });
  }
});

function isStackArtifact(x: any): x is cxapi.CloudFormationStackArtifact {
  return x instanceof cxapi.CloudFormationStackArtifact;
}
