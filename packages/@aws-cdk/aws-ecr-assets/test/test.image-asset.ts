import { expect, haveResource } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import { App, Lazy, Stack } from '@aws-cdk/core';
import { ASSET_METADATA } from '@aws-cdk/cx-api';
import * as fs from 'fs';
import { Test } from 'nodeunit';
import * as path from 'path';
import { DockerImageAsset } from '../lib';

// tslint:disable:object-literal-key-quotes

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
        imageTag: 'ead80594e5ba80b8d595f47c19b0c3bf77087a0af2f6b1fe0b70454dedcdf02c',
        id: 'ead80594e5ba80b8d595f47c19b0c3bf77087a0af2f6b1fe0b70454dedcdf02c',
        packaging: 'container-image',
        path: 'asset.ead80594e5ba80b8d595f47c19b0c3bf77087a0af2f6b1fe0b70454dedcdf02c',
        sourceHash: 'ead80594e5ba80b8d595f47c19b0c3bf77087a0af2f6b1fe0b70454dedcdf02c'
      }
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
        a: 'b'
      }
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === ASSET_METADATA);
    test.deepEqual(assetMetadata && assetMetadata.data.buildArgs, { a: 'b' });
    test.done();
  },

  'with target'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
      buildArgs: {
        a: 'b'
      },
      target: 'a-target'
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === ASSET_METADATA);
    test.deepEqual(assetMetadata && assetMetadata.data.target, 'a-target');
    test.done();
  },

  'with file'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const directoryPath = path.join(__dirname, 'demo-image-custom-docker-file');
    // WHEN
    new DockerImageAsset(stack, 'Image', {
      directory: directoryPath,
      file: 'Dockerfile.Custom'
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === ASSET_METADATA);
    test.deepEqual(assetMetadata && assetMetadata.data.file, 'Dockerfile.Custom');
    test.done();
  },

  'asset.repository.grantPull can be used to grant a principal permissions to use the image'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const user = new iam.User(stack, 'MyUser');
    const asset = new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image')
    });

    // WHEN
    asset.repository.grantPull(user);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        "Statement": [
          {
            "Action": [
              "ecr:BatchCheckLayerAvailability",
              "ecr:GetDownloadUrlForLayer",
              "ecr:BatchGetImage"
            ],
            "Effect": "Allow",
            "Resource": {
              "Fn::Join": [
                "",
                [
                  "arn:",
                  {
                    "Ref": "AWS::Partition"
                  },
                  ":ecr:",
                  {
                    "Ref": "AWS::Region"
                  },
                  ":",
                  {
                    "Ref": "AWS::AccountId"
                  },
                  ":repository/aws-cdk/assets"
                ]
              ]
            }
          },
          {
            "Action": "ecr:GetAuthorizationToken",
            "Effect": "Allow",
            "Resource": "*"
          }
        ],
        "Version": "2012-10-17"
      },
      "PolicyName": "MyUserDefaultPolicy7B897426",
      "Users": [
        {
          "Ref": "MyUserDC45028B"
        }
      ]
    }));

    test.done();
  },

  'fails if the directory does not exist'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // THEN
    test.throws(() => {
      new DockerImageAsset(stack, 'MyAsset', {
        directory: `/does/not/exist/${Math.floor(Math.random() * 9999)}`
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
        directory: __dirname
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
        file: 'doesnt-exist'
      });
    }, /Cannot find file at/);
    test.done();
  },

  'docker directory is staged if asset staging is enabled'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'stack');

    const image = new DockerImageAsset(stack, 'MyAsset', {
      directory: path.join(__dirname, 'demo-image')
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
      directory: path.join(__dirname, 'dockerignore-image')
    });

    const session = app.synth();

    // .dockerignore itself should be included in output to be processed during docker build
    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, '.dockerignore')));
    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, `Dockerfile`)));
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
      exclude: ['subdirectory']
    });

    const session = app.synth();

    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, '.dockerignore')));
    test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, `Dockerfile`)));
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
      buildArgs: { [token]: 'value' }
    }), expected);

    test.throws(() => new DockerImageAsset(stack, 'MyAsset2', {
      directory: path.join(__dirname, 'demo-image'),
      buildArgs: { key: token }
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
      repositoryName: token
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

    test.deepEqual(asset1.sourceHash, '2e50cc12aef2c7ea87d8100eb6af0817c71043c1471f65efa4aa2fe09e8aa298');
    test.deepEqual(asset2.sourceHash, '6be19460f629bc68599aa47c80d857a2782fd7507a82cc4686413a6cf0d79328');
    test.deepEqual(asset3.sourceHash, '8d0b233ce6477ec0653350c90281c0cd36a008aec92ab4898a7ae75cdb203539');
    test.deepEqual(asset4.sourceHash, '59319f4acc9ab6f0f2b6d08ec468b2bd2bd8f0a0bc84d701c93e65a234f3d057');
    test.deepEqual(asset5.sourceHash, 'f323e284d17850fec92ccfacb9ee3536be58e5e1b49d9b9ecfe169daa90ac628');
    test.deepEqual(asset6.sourceHash, 'd6aad051280d9c863791f390903c4c81e74058b6a5ee9fb0e8daf220fe0bf806');
    test.deepEqual(asset7.sourceHash, 'bfcece82d56586e67911217b5d4d3c525d03bd69b16bb1005c2ec19d51bd7321');
    test.done();
  }
};
