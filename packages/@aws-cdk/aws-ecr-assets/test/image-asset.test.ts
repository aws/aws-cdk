import * as fs from 'fs';
import * as path from 'path';
import { expect as ourExpect, haveResource } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { App, DefaultStackSynthesizer, IgnoreMode, Lazy, LegacyStackSynthesizer, Stack, Stage } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { DockerImageAsset } from '../lib';

/* eslint-disable quote-props */

const DEMO_IMAGE_ASSET_HASH = 'b2c69bfbfe983b634456574587443159b3b7258849856a118ad3d2772238f1a5';


let app: App;
let stack: Stack;
beforeEach(() => {
  app = new App({
    context: {
      '@aws-cdk/aws-ecr-assets:dockerIgnoreSupport': true,
    },
  });
  stack = new Stack(app, 'Stack');
});

nodeunitShim({
  'test instantiating Asset Image'(test: Test) {
    // WHEN
    new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
    });

    // THEN
    const asm = app.synth();
    const artifact = asm.getStackArtifact(stack.artifactId);
    test.deepEqual(artifact.template, {}, 'template is empty');
    test.deepEqual(artifact.assets, [
      {
        repositoryName: 'aws-cdk/assets',
        imageTag: 'b2c69bfbfe983b634456574587443159b3b7258849856a118ad3d2772238f1a5',
        id: 'b2c69bfbfe983b634456574587443159b3b7258849856a118ad3d2772238f1a5',
        packaging: 'container-image',
        path: 'asset.b2c69bfbfe983b634456574587443159b3b7258849856a118ad3d2772238f1a5',
        sourceHash: 'b2c69bfbfe983b634456574587443159b3b7258849856a118ad3d2772238f1a5',
      },
    ]);
    test.done();
  },

  'with build args'(test: Test) {
    // WHEN
    new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
      buildArgs: {
        a: 'b',
      },
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);
    test.deepEqual(assetMetadata && (assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry).buildArgs, { a: 'b' });
    test.done();
  },

  'with target'(test: Test) {
    // WHEN
    new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
      buildArgs: {
        a: 'b',
      },
      target: 'a-target',
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);
    test.deepEqual(assetMetadata && (assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry).target, 'a-target');
    test.done();
  },

  'with file'(test: Test) {
    // GIVEN
    const directoryPath = path.join(__dirname, 'demo-image-custom-docker-file');
    // WHEN
    new DockerImageAsset(stack, 'Image', {
      directory: directoryPath,
      file: 'Dockerfile.Custom',
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);
    test.deepEqual(assetMetadata && (assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry).file, 'Dockerfile.Custom');
    test.done();
  },

  'asset.repository.grantPull can be used to grant a principal permissions to use the image'(test: Test) {
    // GIVEN
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

    test.done();
  },

  'fails if the directory does not exist'(test: Test) {
    // THEN
    test.throws(() => {
      new DockerImageAsset(stack, 'MyAsset', {
        directory: `/does/not/exist/${Math.floor(Math.random() * 9999)}`,
      });
    }, /Cannot find image directory at/);
    test.done();
  },

  'fails if the directory does not contain a Dockerfile'(test: Test) {
    // THEN
    test.throws(() => {
      new DockerImageAsset(stack, 'Asset', {
        directory: __dirname,
      });
    }, /Cannot find file at/);
    test.done();
  },

  'fails if the file does not exist'(test: Test) {
    // THEN
    test.throws(() => {
      new DockerImageAsset(stack, 'Asset', {
        directory: __dirname,
        file: 'doesnt-exist',
      });
    }, /Cannot find file at/);
    test.done();
  },

  'docker directory is staged if asset staging is enabled'(test: Test) {
    const image = new DockerImageAsset(stack, 'MyAsset', {
      directory: path.join(__dirname, 'demo-image'),
    });

    const session = app.synth();

    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'Dockerfile')));
    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'index.py')));
    test.done();
  },

  'docker directory is staged without files specified in .dockerignore'(test: Test) {
    testDockerDirectoryIsStagedWithoutFilesSpecifiedInDockerignore(test);
  },

  'docker directory is staged without files specified in .dockerignore with IgnoreMode.GLOB'(test: Test) {
    testDockerDirectoryIsStagedWithoutFilesSpecifiedInDockerignore(test, IgnoreMode.GLOB);
  },

  'docker directory is staged with whitelisted files specified in .dockerignore'(test: Test) {
    const image = new DockerImageAsset(stack, 'MyAsset', {
      directory: path.join(__dirname, 'whitelisted-image'),
    });

    const session = app.synth();

    // Only the files exempted above should be included.
    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, '.dockerignore')));
    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'Dockerfile')));
    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'index.py')));
    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'foobar.txt')));
    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'subdirectory')));
    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'subdirectory', 'baz.txt')));
    test.ok(!fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'node_modules')));
    test.ok(!fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'node_modules', 'one')));
    test.ok(!fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'node_modules', 'some_dep')));
    test.ok(!fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'node_modules', 'some_dep', 'file')));

    test.done();
  },

  'docker directory is staged without files specified in exclude option'(test: Test) {
    testDockerDirectoryIsStagedWithoutFilesSpecifiedInExcludeOption(test);
  },

  'docker directory is staged without files specified in exclude option with IgnoreMode.GLOB'(test: Test) {
    testDockerDirectoryIsStagedWithoutFilesSpecifiedInExcludeOption(test, IgnoreMode.GLOB);
  },

  'fails if using tokens in build args keys or values'(test: Test) {
    // GIVEN
    const token = Lazy.string({ produce: () => 'foo' });
    const expected = /Cannot use tokens in keys or values of "buildArgs" since they are needed before deployment/;

    // THEN
    test.throws(() => new DockerImageAsset(stack, 'MyAsset1', {
      directory: path.join(__dirname, 'demo-image'),
      buildArgs: { [token]: 'value' },
    }), expected);

    test.throws(() => new DockerImageAsset(stack, 'MyAsset2', {
      directory: path.join(__dirname, 'demo-image'),
      buildArgs: { key: token },
    }), expected);

    test.done();
  },

  'fails if using token as repositoryName'(test: Test) {
    // GIVEN
    const token = Lazy.string({ produce: () => 'foo' });

    // THEN
    test.throws(() => new DockerImageAsset(stack, 'MyAsset1', {
      directory: path.join(__dirname, 'demo-image'),
      repositoryName: token,
    }), /Cannot use Token as value of 'repositoryName'/);

    test.done();
  },

  'docker build options are included in the asset id'(test: Test) {
    // GIVEN
    const directory = path.join(__dirname, 'demo-image-custom-docker-file');

    const asset1 = new DockerImageAsset(stack, 'Asset1', { directory });
    const asset2 = new DockerImageAsset(stack, 'Asset2', { directory, file: 'Dockerfile.Custom' });
    const asset3 = new DockerImageAsset(stack, 'Asset3', { directory, target: 'NonDefaultTarget' });
    const asset4 = new DockerImageAsset(stack, 'Asset4', { directory, buildArgs: { opt1: '123', opt2: 'boom' } });
    const asset5 = new DockerImageAsset(stack, 'Asset5', { directory, file: 'Dockerfile.Custom', target: 'NonDefaultTarget' });
    const asset6 = new DockerImageAsset(stack, 'Asset6', { directory, extraHash: 'random-extra' });
    const asset7 = new DockerImageAsset(stack, 'Asset7', { directory, repositoryName: 'foo' });

    test.deepEqual(asset1.sourceHash, 'ab01ecd4419f59e1ec0ac9e57a60dbb653be68a29af0223fa8cb24b4b747bc73');
    test.deepEqual(asset2.sourceHash, '7fb12f6148098e3f5c56c788a865d2af689125ead403b795fe6a262ec34384b3');
    test.deepEqual(asset3.sourceHash, 'fc3b6d802ba198ba2ee55079dbef27682bcd1288d5849eb5bbd5cd69038359b3');
    test.deepEqual(asset4.sourceHash, '30439ea6dfeb4ddfd9175097286895c78393ef52a78c68f92db08abc4513cad6');
    test.deepEqual(asset5.sourceHash, '5775170880e26ba31799745241b90d4340c674bb3b1c01d758e416ee3f1c386f');
    test.deepEqual(asset6.sourceHash, 'ba82fd351a4d3e3f5c5d948b9948e7e829badc3da90f97e00bb7724afbeacfd4');
    test.deepEqual(asset7.sourceHash, '26ec194928431cab6ec5af24ea9f01af2cf7b20e361128b07b2a7405d2951f95');
    test.done();
  },
});

function testDockerDirectoryIsStagedWithoutFilesSpecifiedInDockerignore(test: Test, ignoreMode?: IgnoreMode) {
  const image = new DockerImageAsset(stack, 'MyAsset', {
    ignoreMode,
    directory: path.join(__dirname, 'dockerignore-image'),
  });

  const session = app.synth();

  // .dockerignore itself should be included in output to be processed during docker build
  test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, '.dockerignore')));
  test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'Dockerfile')));
  test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'index.py')));
  test.ok(!fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'foobar.txt')));
  test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'subdirectory')));
  test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'subdirectory', 'baz.txt')));

  test.done();
}

function testDockerDirectoryIsStagedWithoutFilesSpecifiedInExcludeOption(test: Test, ignoreMode?: IgnoreMode) {
  const image = new DockerImageAsset(stack, 'MyAsset', {
    directory: path.join(__dirname, 'dockerignore-image'),
    exclude: ['subdirectory'],
    ignoreMode,
  });

  const session = app.synth();

  test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, '.dockerignore')));
  test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'Dockerfile')));
  test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'index.py')));
  test.ok(!fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'foobar.txt')));
  test.ok(!fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'subdirectory')));
  test.ok(!fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'subdirectory', 'baz.txt')));

  test.done();
}

test('nested assemblies share assets: legacy synth edition', () => {
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

test('nested assemblies share assets: default synth edition', () => {
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
