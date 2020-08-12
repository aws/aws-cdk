import { expect, haveResource } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { App, Lazy, Stack } from '@aws-cdk/core';
import * as fs from 'fs';
import { Test } from 'nodeunit';
import * as path from 'path';
import { DockerImageAsset } from '../lib';

/* eslint-disable quote-props */

export = {
  'test instantiating Asset Image'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'test-stack');

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
        imageTag: 'baa2d6eb2a17c75424df631c8c70ff39f2d5f3bee8b9e1a109ee24ca17300540',
        id: 'baa2d6eb2a17c75424df631c8c70ff39f2d5f3bee8b9e1a109ee24ca17300540',
        packaging: 'container-image',
        path: 'asset.baa2d6eb2a17c75424df631c8c70ff39f2d5f3bee8b9e1a109ee24ca17300540',
        sourceHash: 'baa2d6eb2a17c75424df631c8c70ff39f2d5f3bee8b9e1a109ee24ca17300540',
      },
    ]);
    test.done();
  },

  'with build args'(test: Test) {
    // GIVEN
    const stack = new Stack();

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
    // GIVEN
    const stack = new Stack();

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
    const stack = new Stack();

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
    const stack = new Stack();
    const user = new iam.User(stack, 'MyUser');
    const asset = new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
    });

    // WHEN
    asset.repository.grantPull(user);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
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
    // GIVEN
    const stack = new Stack();

    // THEN
    test.throws(() => {
      new DockerImageAsset(stack, 'MyAsset', {
        directory: `/does/not/exist/${Math.floor(Math.random() * 9999)}`,
      });
    }, /Cannot find image directory at/);
    test.done();
  },

  'fails if the directory does not contain a Dockerfile'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // THEN
    test.throws(() => {
      new DockerImageAsset(stack, 'Asset', {
        directory: __dirname,
      });
    }, /Cannot find file at/);
    test.done();
  },

  'fails if the file does not exist'(test: Test) {
    // GIVEN
    const stack = new Stack();

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
    const app = new App();
    const stack = new Stack(app, 'stack');

    const image = new DockerImageAsset(stack, 'MyAsset', {
      directory: path.join(__dirname, 'demo-image'),
    });

    const session = app.synth();

    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'Dockerfile')));
    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'index.py')));
    test.done();
  },

  'docker directory is staged without files specified in .dockerignore'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'stack');

    const image = new DockerImageAsset(stack, 'MyAsset', {
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
  },

  'docker directory is staged without files specified in exclude option'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'stack');

    const image = new DockerImageAsset(stack, 'MyAsset', {
      directory: path.join(__dirname, 'dockerignore-image'),
      exclude: ['subdirectory'],
    });

    const session = app.synth();

    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, '.dockerignore')));
    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'Dockerfile')));
    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'index.py')));
    test.ok(!fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'foobar.txt')));
    test.ok(!fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'subdirectory')));
    test.ok(!fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, 'subdirectory', 'baz.txt')));

    test.done();
  },

  'fails if using tokens in build args keys or values'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const token = Lazy.stringValue({ produce: () => 'foo' });
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
    const stack = new Stack();
    const token = Lazy.stringValue({ produce: () => 'foo' });

    // THEN
    test.throws(() => new DockerImageAsset(stack, 'MyAsset1', {
      directory: path.join(__dirname, 'demo-image'),
      repositoryName: token,
    }), /Cannot use Token as value of 'repositoryName'/);

    test.done();
  },

  'docker build options are included in the asset id'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const directory = path.join(__dirname, 'demo-image-custom-docker-file');

    const asset1 = new DockerImageAsset(stack, 'Asset1', { directory });
    const asset2 = new DockerImageAsset(stack, 'Asset2', { directory, file: 'Dockerfile.Custom' });
    const asset3 = new DockerImageAsset(stack, 'Asset3', { directory, target: 'NonDefaultTarget' });
    const asset4 = new DockerImageAsset(stack, 'Asset4', { directory, buildArgs: { opt1: '123', opt2: 'boom' } });
    const asset5 = new DockerImageAsset(stack, 'Asset5', { directory, file: 'Dockerfile.Custom', target: 'NonDefaultTarget' });
    const asset6 = new DockerImageAsset(stack, 'Asset6', { directory, extraHash: 'random-extra' });
    const asset7 = new DockerImageAsset(stack, 'Asset7', { directory, repositoryName: 'foo' });

    test.deepEqual(asset1.sourceHash, 'c555ab9f74e32ce24cd04ddeaa4d7b1b11c5740b9873a3f250e03bf73b28ce39');
    test.deepEqual(asset2.sourceHash, '273bd9a95dbe346ad5b116736d44a350e90f57e2b9ba7fd3d334b61d0420f9fd');
    test.deepEqual(asset3.sourceHash, '81a4b3fd058876c7705597500e7259ff436e521580f0bcb503a303dcac7e2a41');
    test.deepEqual(asset4.sourceHash, '10259531feb68a3967d5d25b70ec9a37a6a8e1f5b04083fada3d0a084291a698');
    test.deepEqual(asset5.sourceHash, '30e083bf51483a031759bc7fb35f69345de69fdbc511eec88bd3d1724b5ac0a9');
    test.deepEqual(asset6.sourceHash, '594ae5a5d23367d18468fefca5a4e56ca83b077d1274a1f812f55c8c9ead9eaa');
    test.deepEqual(asset7.sourceHash, 'bc007f81fe1dd0f0bbb24af898eba3f4f15edbff19b7abb3fac928439486d667');
    test.done();
  },
};
