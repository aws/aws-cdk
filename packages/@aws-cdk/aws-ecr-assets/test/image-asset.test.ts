import * as fs from 'fs';
import * as path from 'path';
import { expect as ourExpect, haveResource } from '@aws-cdk/assert-internal';
import * as iam from '@aws-cdk/aws-iam';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { App, DefaultStackSynthesizer, IgnoreMode, Lazy, LegacyStackSynthesizer, Stack, Stage } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { testFutureBehavior } from 'cdk-build-tools/lib/feature-flag';
import { DockerImageAsset } from '../lib';

/* eslint-disable quote-props */

const DEMO_IMAGE_ASSET_HASH = '0c7eaa76a180464444a0b21036987c8415680b2bef014e3450abd59747c7772e';

const flags = { [cxapi.DOCKER_IGNORE_SUPPORT]: true };

describe('image asset', () => {
  testFutureBehavior('test instantiating Asset Image', flags, App, (app) => {
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
        imageTag: '0c7eaa76a180464444a0b21036987c8415680b2bef014e3450abd59747c7772e',
        id: '0c7eaa76a180464444a0b21036987c8415680b2bef014e3450abd59747c7772e',
        packaging: 'container-image',
        path: 'asset.0c7eaa76a180464444a0b21036987c8415680b2bef014e3450abd59747c7772e',
        sourceHash: '0c7eaa76a180464444a0b21036987c8415680b2bef014e3450abd59747c7772e',
      },
    ]);

  });

  testFutureBehavior('with build args', flags, App, (app) => {
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

  testFutureBehavior('with target', flags, App, (app) => {
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

  testFutureBehavior('with file', flags, App, (app) => {
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

  testFutureBehavior('asset.repository.grantPull can be used to grant a principal permissions to use the image', flags, App, (app) => {
    // GIVEN
    const stack = new Stack(app);
    const user = new iam.User(stack, 'MyUser');
    const asset = new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
    });

    // WHEN
    asset.repository.grantPull(user);

    // THEN
    ourExpect(stack).to(haveResource('AWS::IAM::Policy', {
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
    }));


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

    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'Dockerfile'))).toBeDefined();
    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'index.py'))).toBeDefined();

  });

  testFutureBehavior('docker directory is staged without files specified in .dockerignore', flags, App, (app) => {
    testDockerDirectoryIsStagedWithoutFilesSpecifiedInDockerignore(app);
  });

  testFutureBehavior('docker directory is staged without files specified in .dockerignore with IgnoreMode.GLOB', flags, App, (app) => {
    testDockerDirectoryIsStagedWithoutFilesSpecifiedInDockerignore(app, IgnoreMode.GLOB);
  });

  testFutureBehavior('docker directory is staged with allow-listed files specified in .dockerignore', flags, App, (app) => {
    const stack = new Stack(app);
    const image = new DockerImageAsset(stack, 'MyAsset', {
      directory: path.join(__dirname, 'allow-listed-image'),
    });

    const session = app.synth();

    // Only the files exempted above should be included.
    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, '.dockerignore'))).toBeDefined();
    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'Dockerfile'))).toBeDefined();
    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'index.py'))).toBeDefined();
    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'foobar.txt'))).toBeDefined();
    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'subdirectory'))).toBeDefined();
    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'subdirectory', 'baz.txt'))).toBeDefined();
    expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'node_modules'))).toBeDefined();
    expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'node_modules', 'one'))).toBeDefined();
    expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'node_modules', 'some_dep'))).toBeDefined();
    expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'node_modules', 'some_dep', 'file'))).toBeDefined();


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

  test('fails if using token as repositoryName', () => {
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
    const asset7 = new DockerImageAsset(stack, 'Asset7', { directory, repositoryName: 'foo' });

    expect(asset1.assetHash).toEqual('d7e09a7a4e6370fd0acc3c54882be997c8ceb7e0e8175b02fe76e8647dce17de');
    expect(asset2.assetHash).toEqual('3f1bac72f858173107f49acaf5df9018003226fc51909bf5d11d58af025c2e4e');
    expect(asset3.assetHash).toEqual('fdb2b671eb30fd132aae702101baae15afdb25b91e8f33726ce3b86c01c3a6ad');
    expect(asset4.assetHash).toEqual('ac36f45819cb7082e6ac234864b253625490016f449757b2f5299ce28ed23003');
    expect(asset5.assetHash).toEqual('ea5aec0adbda43ad6fa9a25e6b25a99c2744e19de76f7f24fafd5dcb4919e814');
    expect(asset6.assetHash).toEqual('36110bd07cff1789ca3a29d2906c72825526b2db6eb1a15201a9d462b3540c70');
    expect(asset7.assetHash).toEqual('2514ad564b15614d3821b497d753d036ca43d01eb5236ae6555d86b6378c3e74');

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
  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, '.dockerignore'))).toBeDefined();
  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'Dockerfile'))).toBeDefined();
  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'index.py'))).toBeDefined();
  expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'foobar.txt'))).toBeDefined();
  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'subdirectory'))).toBeDefined();
  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'subdirectory', 'baz.txt'))).toBeDefined();


}

function testDockerDirectoryIsStagedWithoutFilesSpecifiedInExcludeOption(app: App, ignoreMode?: IgnoreMode) {
  const stack = new Stack(app);
  const image = new DockerImageAsset(stack, 'MyAsset', {
    directory: path.join(__dirname, 'dockerignore-image'),
    exclude: ['subdirectory'],
    ignoreMode,
  });

  const session = app.synth();

  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, '.dockerignore'))).toBeDefined();
  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'Dockerfile'))).toBeDefined();
  expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'index.py'))).toBeDefined();
  expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'foobar.txt'))).toBeDefined();
  expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'subdirectory'))).toBeDefined();
  expect(!fs.existsSync(path.join(session.directory, `asset.${image.assetHash}`, 'subdirectory', 'baz.txt'))).toBeDefined();


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
    const manifestArtifact = assembly.getNestedAssembly(`assembly-${stageName}`).artifacts.filter(isAssetManifestArtifact)[0];
    const manifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));

    expect(manifest.dockerImages[DEMO_IMAGE_ASSET_HASH].source).toEqual({
      directory: `../asset.${DEMO_IMAGE_ASSET_HASH}`,
    });
  }
});

function isStackArtifact(x: any): x is cxapi.CloudFormationStackArtifact {
  return x instanceof cxapi.CloudFormationStackArtifact;
}

function isAssetManifestArtifact(x: any): x is cxapi.AssetManifestArtifact {
  return x instanceof cxapi.AssetManifestArtifact;
}
