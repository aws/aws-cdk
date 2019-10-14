import { countResources, expect, haveResource, haveResourceLike, not } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import { Bucket } from '@aws-cdk/aws-s3';
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import codebuild = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'can use filename as buildspec'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Project(stack, 'Project', {
      source: codebuild.Source.s3({
        bucket: new Bucket(stack, 'Bucket'),
        path: 'path',
      }),
      buildSpec: codebuild.BuildSpec.fromSourceFilename('hello.yml'),
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
      buildSpec: codebuild.BuildSpec.fromObject({ phases: ['say hi'] })
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
      Source: {
        BuildSpec: "{\n  \"phases\": [\n    \"say hi\"\n  ]\n}",
      }
    }));

    test.done();
  },

  'must supply buildspec when using nosource'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    test.throws(() => {
      new codebuild.Project(stack, 'Project', {
      });
    }, /you need to provide a concrete buildSpec/);

    test.done();
  },

  'must supply literal buildspec when using nosource'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    test.throws(() => {
      new codebuild.Project(stack, 'Project', {
        buildSpec: codebuild.BuildSpec.fromSourceFilename('bla.yml'),
      });
    }, /you need to provide a concrete buildSpec/);

    test.done();
  },

  'GitHub source': {
    'has reportBuildStatus on by default'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new codebuild.Project(stack, 'Project', {
        source: codebuild.Source.gitHub({
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
        source: codebuild.Source.gitHub({
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
        source: codebuild.Source.gitHub({
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

    'cannot have bindToCodePipeline() be called on it'(test: Test) {
      const stack = new cdk.Stack();
      const project = new codebuild.Project(stack, 'Project', {
        source: codebuild.Source.gitHub({
          owner: 'testowner',
          repo: 'testrepo',
        }),
      });

      test.throws(() => {
        project.bindToCodePipeline(project, {
          artifactBucket: new s3.Bucket(stack, 'Bucket'),
        });
      }, /Only a PipelineProject can be added to a CodePipeline/);

      test.done();
    },
  },

  'project with s3 cache bucket'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Project(stack, 'Project', {
      source: codebuild.Source.s3({
        bucket: new Bucket(stack, 'SourceBucket'),
        path: 'path',
      }),
      cache: codebuild.Cache.bucket(new Bucket(stack, 'Bucket'), {
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
      source: codebuild.Source.s3({
        bucket: new Bucket(stack, 'Bucket'),
        path: 'path',
      }),
      cache: codebuild.Cache.local(codebuild.LocalCacheMode.CUSTOM, codebuild.LocalCacheMode.DOCKER_LAYER,
        codebuild.LocalCacheMode.SOURCE)
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
      source: codebuild.Source.s3({
        bucket: new Bucket(stack, 'Bucket'),
        path: 'path',
      }),
    });

    // THEN
    expect(stack).to(not(haveResourceLike('AWS::CodeBuild::Project', {
      Cache: {}
    })));

    test.done();
  },

  'can use an imported Role for a Project within a VPC'(test: Test) {
    const stack = new cdk.Stack();

    const importedRole = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::1234567890:role/service-role/codebuild-bruiser-service-role');
    const vpc = new ec2.Vpc(stack, 'Vpc');

    new codebuild.Project(stack, 'Project', {
      source: codebuild.Source.gitHubEnterprise({
        httpsCloneUrl: 'https://mygithub-enterprise.com/myuser/myrepo',
      }),
      role: importedRole,
      vpc,
    });

    expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
      // no need to do any assertions
    }));

    test.done();
  },

  'can use an imported Role with mutable = false for a Project within a VPC'(test: Test) {
    const stack = new cdk.Stack();

    const importedRole = iam.Role.fromRoleArn(stack, 'Role',
        'arn:aws:iam::1234567890:role/service-role/codebuild-bruiser-service-role', {
      mutable: false,
    });
    const vpc = new ec2.Vpc(stack, 'Vpc');

    new codebuild.Project(stack, 'Project', {
      source: codebuild.Source.gitHubEnterprise({
        httpsCloneUrl: 'https://mygithub-enterprise.com/myuser/myrepo',
      }),
      role: importedRole,
      vpc,
    });

    expect(stack).to(countResources('AWS::IAM::Policy', 0));

    test.done();
  },
};
