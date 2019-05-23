import { expect, haveResource, haveResourceLike, not } from '@aws-cdk/assert';
import assets = require('@aws-cdk/assets');
import { Bucket } from '@aws-cdk/aws-s3';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codebuild = require('../lib');
import { Cache, LocalCacheMode } from '../lib/cache';

// tslint:disable:object-literal-key-quotes

export = {
  'can use filename as buildspec'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Project(stack, 'Project', {
      source: new codebuild.CodePipelineSource(),
      buildSpec: 'hello.yml',
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
      Source: {
        BuildSpec: 'hello.yml'
      }
    }));

    test.done();
  },

  'can use buildspec literal'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Project(stack, 'Project', {
      source: new codebuild.CodePipelineSource(),
      buildSpec: { phases: ['say hi'] }
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
      Source: {
        BuildSpec: "{\n  \"phases\": [\n    \"say hi\"\n  ]\n}",
      }
    }));

    test.done();
  },

  'GitHub source': {
    'has reportBuildStatus on by default'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new codebuild.Project(stack, 'Project', {
        source: new codebuild.GitHubSource({
          owner: 'testowner',
          repo: 'testrepo',
          cloneDepth: 3,
        })
      });

      // THEN
      expect(stack).to(haveResource('AWS::CodeBuild::Project', {
        Source: {
          Type: "GITHUB",
          Location: 'https://github.com/testowner/testrepo.git',
          ReportBuildStatus: true,
          GitCloneDepth: 3,
        }
      }));

      test.done();
    },

    'can explicitly set reportBuildStatus to false'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new codebuild.Project(stack, 'Project', {
        source: new codebuild.GitHubSource({
          owner: 'testowner',
          repo: 'testrepo',
          reportBuildStatus: false,
        })
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
        Source: {
          ReportBuildStatus: false,
        },
      }));

      test.done();
    },

    'can explicitly set webhook to true'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new codebuild.Project(stack, 'Project', {
        source: new codebuild.GitHubSource({
          owner: 'testowner',
          repo: 'testrepo',
          webhook: true,
        })
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
        Triggers: {
          Webhook: true,
        },
      }));

      test.done();
    },
  },

  'construct from asset'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Project(stack, 'Project', {
      buildScriptAsset: new assets.ZipDirectoryAsset(stack, 'Asset', { path: '.' }),
      buildScriptAssetEntrypoint: 'hello.sh',
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
      Environment: {
        ComputeType: "BUILD_GENERAL1_SMALL",
        EnvironmentVariables: [
          {
            Name: "SCRIPT_S3_BUCKET",
            Type: "PLAINTEXT",
            Value: { Ref: "AssetS3Bucket235698C0" }
          },
          {
            Name: "SCRIPT_S3_KEY",
            Type: "PLAINTEXT",
            Value: {
              "Fn::Join": ["", [
                { "Fn::Select": [0, { "Fn::Split": ["||", { Ref: "AssetS3VersionKeyA852DDAE" }] }] },
                { "Fn::Select": [1, { "Fn::Split": ["||", { Ref: "AssetS3VersionKeyA852DDAE" }] }] }
              ]]
            }
          }
        ],
      },
      Source: {
        // Not testing BuildSpec, it's too big and finicky
        Type: "NO_SOURCE"
      }
    }));

    test.done();
  },

  'project with s3 cache bucket'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Project(stack, 'Project', {
      source: new codebuild.CodePipelineSource(),
      cache: Cache.bucket(new Bucket(stack, 'Bucket'), {
        prefix: "cache-prefix"
      })
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
      Cache: {
        Type: "S3",
        Location: {
          "Fn::Join": [
            "/",
            [
              {
                "Ref": "Bucket83908E77"
              },
              "cache-prefix"
            ]
          ]
        }
      },
    }));

    test.done();
  },

  'project with local cache modes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Project(stack, 'Project', {
      source: new codebuild.CodePipelineSource(),
      cache: Cache.local(LocalCacheMode.Custom, LocalCacheMode.DockerLayer, LocalCacheMode.Source)
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
      Cache: {
        Type: "LOCAL",
        Modes: [
          "LOCAL_CUSTOM_CACHE",
          "LOCAL_DOCKER_LAYER_CACHE",
          "LOCAL_SOURCE_CACHE"
        ]
      },
    }));

    test.done();
  },

  'project by default has no cache modes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Project(stack, 'Project', {
      source: new codebuild.CodePipelineSource()
    });

    // THEN
    expect(stack).to(not(haveResourceLike('AWS::CodeBuild::Project', {
      Cache: {}
    })));

    test.done();
  },
};
