import { expect, haveResource, SynthUtils } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import { App, Lazy, Stack } from '@aws-cdk/core';
import fs = require('fs');
import { Test } from 'nodeunit';
import os = require('os');
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

    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dockerignore-image'));
    createFsStructureFromTree(directory, `
      ├── Dockerfile
      ├── .dockerignore
      ├── foobar.txt
      ├── index.py
      └── subdirectory
          └── baz.txt`);
    fs.writeFileSync(path.join(directory, '.dockerignore'), 'foobar.txt');

    const image = new DockerImageAsset(stack, 'MyAsset', { directory });

    const session = app.synth();

    const expectedFiles = [
      // .dockerignore itself should be included in output to be processed during docker build
      '.dockerignore',
      'Dockerfile',
      'index.py',
      'subdirectory',
      path.join('subdirectory', 'baz.txt'),
    ];
    const unexpectedFiles = [
      'foobar.txt',
    ];

    for (const expectedFile of expectedFiles) {
      test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, expectedFile)), expectedFile);
    }
    for (const unexpectedFile of unexpectedFiles) {
      test.ok(!fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, unexpectedFile)), unexpectedFile);
    }

    test.done();
  },

  'docker directory is staged without files specified in exclude option'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'stack');

    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dockerignore-image'));
    createFsStructureFromTree(directory, `
      ├── Dockerfile
      ├── .dockerignore
      ├── foobar.txt
      ├── index.py
      └── subdirectory
          └── baz.txt`);
    fs.writeFileSync(path.join(directory, '.dockerignore'), 'foobar.txt');

    const image = new DockerImageAsset(stack, 'MyAsset', {
      directory,
      exclude: ['subdirectory']
    });

    const session = app.synth();

    const expectedFiles = [
      '.dockerignore',
      'Dockerfile',
      'index.py',
    ];
    const unexpectedFiles = [
      'foobar.txt',
      'subdirectory',
      path.join('subdirectory', 'baz.txt'),
    ];

    for (const expectedFile of expectedFiles) {
      test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, expectedFile)), expectedFile);
    }
    for (const unexpectedFile of unexpectedFiles) {
      test.ok(!fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, unexpectedFile)), unexpectedFile);
    }

    test.done();
  },

  'advanced .dockerignore test case'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'stack');

    // GIVEN
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dockerignore-image-advanced'));
    createFsStructureFromTree(directory, `
      ├── config
      │   ├── config-prod.txt
      │   ├── config-test.txt
      │   └── config.txt
      ├── deep
      │   ├── dir
      │   │   └── struct
      │   │       └── qux.txt
      │   └── include_me
      │       └── sub
      │           └── dir
      │               └── quuz.txt
      ├── foobar.txt
      ├── foo.txt
      ├── Dockerfile
      ├── index.py
      ├── .hidden-file
      └── empty-directory (D)
      └── subdirectory
          ├── baz.txt
          └── quux.txt`);

    fs.writeFileSync(path.join(directory, '.dockerignore'), `
      # This a comment, followed by an empty line

      # The following line should be ignored
      #index.py

      # This shouldn't ignore foo.txt
      foo.?
      # This shoul ignore foobar.txt
      foobar.???
      # This should catch qux.txt
      deep/**/*.txt
      # but quuz should be added back
      !deep/include_me/**

      # baz and quux should be ignored
      subdirectory/**
      # but baz should be added back
      !subdirectory/baz*

      config/config*.txt
      !config/config-*.txt
      config/config-test.txt
    `.split('\n').map(line => line.trim()).join('\n'));

    const image = new DockerImageAsset(stack, 'MyAsset', { directory });
    const session = app.synth();

    const expectedFiles = [
      '.dockerignore',
      '.hidden-file',
      'Dockerfile',
      'index.py',
      'foo.txt',
      'empty-directory',
      path.join('subdirectory', 'baz.txt'),
      path.join('deep', 'include_me', 'sub', 'dir', 'quuz.txt'),
      path.join('config', 'config-prod.txt'),
    ];
    const unexpectedFiles = [
      'foobar.txt',
      path.join('deep', 'dir', 'struct', 'qux.txt'),
      path.join('subdirectory', 'quux.txt'),
      path.join('config', 'config.txt'),
      path.join('config', 'config-test.txt'),
    ];

    for (const expectedFile of expectedFiles) {
      test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, expectedFile)), expectedFile);
    }
    for (const unexpectedFile of unexpectedFiles) {
      test.ok(!fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, unexpectedFile)), unexpectedFile);
    }

    test.done();
  },

  'negagive .dockerignore test case'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'stack');

    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dockerignore-image-advanced'));
    createFsStructureFromTree(directory, `
      ├── deep
      │   └── dir
      │       └── struct
      │           └── qux.txt
      ├── Dockerfile
      ├── .dockerignore
      ├── foobar.txt
      ├── index.py
      └── subdirectory
          ├── baz.txt
          └── foo.txt`);

    fs.writeFileSync(path.join(directory, '.dockerignore'), `
      # Comment

      *
      !index.py
      !subdirectory
      subdirectory/foo.txt

      # Dockerfile isn't explicitly included, but we'll add it anyway to build the image
    `.split('\n').map(line => line.trim()).join('\n'));

    const image = new DockerImageAsset(stack, 'MyAsset', { directory });

    const session = app.synth();

    const expectedFiles = [
      'index.py',
      // Dockerfile is always added
      'Dockerfile',
      path.join('subdirectory', 'baz.txt'),
      // "*" doesn't match ".*" without "dot: true" in minimist
      '.dockerignore',
    ];
    const unexpectedFiles = [
      'foobar.txt',
      path.join('deep', 'dir', 'struct', 'qux.txt'),
      path.join('subdirectory', 'foo.txt'),
    ];

    for (const expectedFile of expectedFiles) {
      test.ok(fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, expectedFile)), expectedFile);
    }
    for (const unexpectedFile of unexpectedFiles) {
      test.ok(!fs.existsSync(path.join(session.directory, `asset.${image.sourceHash}`, unexpectedFile)), unexpectedFile);
    }

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
  }
};

const INDENT_CHARACTERS_REGEX = /^[\s├─│└]+/;
const TRAILING_CHARACTERS_REGEX = /\/|\(D\)$/i;
const IS_DIRECTORY_REGEX = /\(D\)\s*$/i;

const createFsStructureFromTree = (parentDir: string, tree: string): void => {
  const directories: string[] = [];
  const files: string[] = [];

  // we push an element at the end because we push the files/directories during the previous iteration
  const lines = [...tree.replace(/^\n/, '').split('\n'), ''];
  const initialIndentLevel = (lines[0].match(/^\s*/) || [''])[0].length;

  lines.reduce<[string, number, boolean]>(([previousDir, previousIndentLevel, wasDirectory], line) => {
    const indentCharacters = (line.match(INDENT_CHARACTERS_REGEX) || [''])[0];
    const indentLevel = (indentCharacters.length - initialIndentLevel) / 4;

    const fileName = line.slice(indentCharacters.length).replace(TRAILING_CHARACTERS_REGEX, '').trimRight();

    const current = indentLevel <= previousIndentLevel ?
      path.join(...previousDir.split(path.sep).slice(0, indentLevel - 1), fileName) :
      path.join(previousDir, fileName);

    if (previousDir) {
      if (indentLevel > previousIndentLevel || wasDirectory) {
        directories.push(previousDir);
      } else {
        files.push(previousDir);
      }
    }

    return [current, indentLevel, IS_DIRECTORY_REGEX.test(line)];
  }, ['', 0, false]);

  for (const directory of directories) {
    fs.mkdirSync(path.join(parentDir, directory));
  }

  for (const file of files) {
    fs.writeFileSync(path.join(parentDir, file), 'content');
  }
};
