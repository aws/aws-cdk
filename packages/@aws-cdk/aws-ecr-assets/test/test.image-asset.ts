import { expect, haveResource, SynthUtils } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import { App, Lazy, Stack } from '@aws-cdk/core';
import fs = require('fs');
import { Test } from 'nodeunit';
import path = require('path');
import { DockerImageAsset } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'test instantiating Asset Image'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
    });

    // THEN
    const template = SynthUtils.synthesize(stack).template;
    test.deepEqual(template.Parameters.AssetParameters1a17a141505ac69144931fe263d130f4612251caa4bbbdaf68a44ed0f405439cImageName1ADCADB3, {
      Type: 'String',
      Description: 'ECR repository name and tag for asset "1a17a141505ac69144931fe263d130f4612251caa4bbbdaf68a44ed0f405439c"'
    });

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
    const assetMetadata = stack.node.metadata.find(({ type }) => type === 'aws:cdk:asset');
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
    const assetMetadata = stack.node.metadata.find(({ type }) => type === 'aws:cdk:asset');
    test.deepEqual(assetMetadata && assetMetadata.data.target, 'a-target');
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
                  { "Ref": "AWS::Partition" },
                  ":ecr:",
                  { "Ref": "AWS::Region" },
                  ":",
                  { "Ref": "AWS::AccountId" },
                  ":repository/",
                  { "Fn::GetAtt": ["ImageAdoptRepositoryE1E84E35", "RepositoryName"] }
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

  'asset.repository.addToResourcePolicy can be used to modify the ECR resource policy via the adoption custom resource'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const asset = new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image')
    });

    // WHEN
    asset.repository.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['BAM:BOOM'],
      principals: [new iam.ServicePrincipal('test.service')]
    }));

    // THEN
    expect(stack).to(haveResource('Custom::ECRAdoptedRepository', {
      "RepositoryName": {
        "Fn::Select": [
          0,
          {
            "Fn::Split": [
              "@sha256:",
              {
                "Ref": "AssetParameters1a17a141505ac69144931fe263d130f4612251caa4bbbdaf68a44ed0f405439cImageName1ADCADB3"
              }
            ]
          }
        ]
      },
      "PolicyDocument": {
        "Statement": [
          {
            "Action": "BAM:BOOM",
            "Effect": "Allow",
            "Principal": {
              "Service": "test.service"
            }
          }
        ],
        "Version": "2012-10-17"
      }
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
    }, /No 'Dockerfile' found in/);
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
};
