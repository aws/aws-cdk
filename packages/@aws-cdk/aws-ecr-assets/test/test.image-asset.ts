import { expect, haveResource, SynthUtils } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import { App, Construct, Lazy, Resource, Stack } from '@aws-cdk/core';
import { ASSET_METADATA } from '@aws-cdk/cx-api';
import * as fs from 'fs';
import { Test } from 'nodeunit';
import * as path from 'path';
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

  'repository name is derived from node unique id'(test: Test) {
    // GIVEN
    const stack = new Stack();
    class CoolConstruct extends Resource {
      constructor(scope: Construct, id: string) {
        super(scope, id);
      }
    }
    const coolConstruct = new CoolConstruct(stack, 'CoolConstruct');

    // WHEN
    new DockerImageAsset(coolConstruct, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === ASSET_METADATA);
    test.deepEqual(assetMetadata && assetMetadata.data.repositoryName, 'cdk/coolconstructimage78ab38fc');
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
    test.deepEqual(assetMetadata && assetMetadata.data.file, path.join(directoryPath, 'Dockerfile.Custom'));
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

    test.deepEqual(asset1.sourceHash, 'b84a5001da0f5714e484134e2471213d7e987e22ee6219469029f1779370cc2a');
    test.deepEqual(asset2.sourceHash, 'c6568a7946e92a408c60278f70834b901638e71237d470ed1e5e6d707c55c0c9');
    test.deepEqual(asset3.sourceHash, '963a5329c170c54bc667fddab8d9cc4cec4bffb65ce3a1f323bb5fbc1d268732');
    test.deepEqual(asset4.sourceHash, '0e3eb87273509e0f0d45d67d40fa3080566aa22abd7f976e1ce7ea60a8ccd0a8');
    test.deepEqual(asset5.sourceHash, 'de0fd4b2bff8c9f180351fd59c6f2e9409fa21366453e1e0b75fedbd93dda1fc');
    test.deepEqual(asset6.sourceHash, '00879adf80f97271bf6d7e214b4fac8a043fc6e2661912cbf4d898ccb317d46c');
    test.done();
  }
};
