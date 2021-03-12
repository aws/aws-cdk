import { expect, haveResource, haveResourceLike, ResourcePart } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ecr from '../lib';

/* eslint-disable quote-props */

export = {
  'construct repository'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecr.Repository(stack, 'Repo');

    // THEN
    expect(stack).toMatch({
      Resources: {
        Repo02AC86CF: {
          Type: 'AWS::ECR::Repository',
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
      },
    });

    test.done();
  },

  'repository creation with imageScanOnPush'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecr.Repository(stack, 'Repo', { imageScanOnPush: true });

    // THEN
    expect(stack).to(haveResource('AWS::ECR::Repository', {
      ImageScanningConfiguration: {
        ScanOnPush: true,
      },
    }));
    test.done();
  },

  'tag-based lifecycle policy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addLifecycleRule({ tagPrefixList: ['abc'], maxImageCount: 1 });

    // THEN
    expect(stack).to(haveResource('AWS::ECR::Repository', {
      LifecyclePolicy: {
        // eslint-disable-next-line max-len
        LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"tagged","tagPrefixList":["abc"],"countType":"imageCountMoreThan","countNumber":1},"action":{"type":"expire"}}]}',
      },
    }));

    test.done();
  },


  'image tag mutability can be set'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    new ecr.Repository(stack, 'Repo', { imageTagMutability: ecr.TagMutability.IMMUTABLE });

    // THEN
    expect(stack).to(haveResource('AWS::ECR::Repository', {
      ImageTagMutability: 'IMMUTABLE',
    }));

    test.done();
  },

  'add day-based lifecycle policy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const repo = new ecr.Repository(stack, 'Repo');
    repo.addLifecycleRule({
      maxImageAge: cdk.Duration.days(5),
    });

    // THEN
    expect(stack).to(haveResource('AWS::ECR::Repository', {
      LifecyclePolicy: {
        // eslint-disable-next-line max-len
        LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"sinceImagePushed","countNumber":5,"countUnit":"days"},"action":{"type":"expire"}}]}',
      },
    }));

    test.done();
  },

  'add count-based lifecycle policy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addLifecycleRule({
      maxImageCount: 5,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ECR::Repository', {
      LifecyclePolicy: {
        // eslint-disable-next-line max-len
        LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":5},"action":{"type":"expire"}}]}',
      },
    }));

    test.done();
  },

  'mixing numbered and unnumbered rules'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addLifecycleRule({ tagStatus: ecr.TagStatus.TAGGED, tagPrefixList: ['a'], maxImageCount: 5 });
    repo.addLifecycleRule({ rulePriority: 10, tagStatus: ecr.TagStatus.TAGGED, tagPrefixList: ['b'], maxImageCount: 5 });

    // THEN
    expect(stack).to(haveResource('AWS::ECR::Repository', {
      LifecyclePolicy: {
        // eslint-disable-next-line max-len
        LifecyclePolicyText: '{"rules":[{"rulePriority":10,"selection":{"tagStatus":"tagged","tagPrefixList":["b"],"countType":"imageCountMoreThan","countNumber":5},"action":{"type":"expire"}},{"rulePriority":11,"selection":{"tagStatus":"tagged","tagPrefixList":["a"],"countType":"imageCountMoreThan","countNumber":5},"action":{"type":"expire"}}]}',
      },
    }));

    test.done();
  },

  'tagstatus Any is automatically sorted to the back'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addLifecycleRule({ maxImageCount: 5 });
    repo.addLifecycleRule({ tagStatus: ecr.TagStatus.TAGGED, tagPrefixList: ['important'], maxImageCount: 999 });

    // THEN
    expect(stack).to(haveResource('AWS::ECR::Repository', {
      LifecyclePolicy: {
        // eslint-disable-next-line max-len
        LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"tagged","tagPrefixList":["important"],"countType":"imageCountMoreThan","countNumber":999},"action":{"type":"expire"}},{"rulePriority":2,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":5},"action":{"type":"expire"}}]}',
      },
    }));

    test.done();
  },

  'lifecycle rules can be added upon initialization'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecr.Repository(stack, 'Repo', {
      lifecycleRules: [
        { maxImageCount: 3 },
      ],
    });

    // THEN
    expect(stack).to(haveResource('AWS::ECR::Repository', {
      'LifecyclePolicy': {
        // eslint-disable-next-line max-len
        'LifecyclePolicyText': '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}',
      },
    }));
    test.done();
  },

  'calculate repository URI'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    const uri = repo.repositoryUri;

    // THEN
    const arnSplit = { 'Fn::Split': [':', { 'Fn::GetAtt': ['Repo02AC86CF', 'Arn'] }] };
    test.deepEqual(stack.resolve(uri), {
      'Fn::Join': ['', [
        { 'Fn::Select': [4, arnSplit] },
        '.dkr.ecr.',
        { 'Fn::Select': [3, arnSplit] },
        '.',
        { Ref: 'AWS::URLSuffix' },
        '/',
        { Ref: 'Repo02AC86CF' },
      ]],
    });

    test.done();
  },

  'import with concrete arn'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const repo2 = ecr.Repository.fromRepositoryArn(stack, 'repo', 'arn:aws:ecr:us-east-1:585695036304:repository/foo/bar/foo/fooo');

    // THEN
    test.deepEqual(stack.resolve(repo2.repositoryArn), 'arn:aws:ecr:us-east-1:585695036304:repository/foo/bar/foo/fooo');
    test.deepEqual(stack.resolve(repo2.repositoryName), 'foo/bar/foo/fooo');

    test.done();
  },

  'fails if importing with token arn and no name'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN/THEN
    test.throws(() => ecr.Repository.fromRepositoryArn(stack, 'arn', cdk.Fn.getAtt('Boom', 'Boom').toString()),
      /\"repositoryArn\" is a late-bound value, and therefore \"repositoryName\" is required\. Use \`fromRepositoryAttributes\` instead/);

    test.done();
  },

  'import with token arn and repository name (see awslabs/aws-cdk#1232)'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const repo = ecr.Repository.fromRepositoryAttributes(stack, 'Repo', {
      repositoryArn: cdk.Fn.getAtt('Boom', 'Arn').toString(),
      repositoryName: cdk.Fn.getAtt('Boom', 'Name').toString(),
    });

    // THEN
    test.deepEqual(stack.resolve(repo.repositoryArn), { 'Fn::GetAtt': ['Boom', 'Arn'] });
    test.deepEqual(stack.resolve(repo.repositoryName), { 'Fn::GetAtt': ['Boom', 'Name'] });
    test.done();
  },

  'import only with a repository name (arn is deduced)'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const repo = ecr.Repository.fromRepositoryName(stack, 'just-name', 'my-repo');

    // THEN
    test.deepEqual(stack.resolve(repo.repositoryArn), {
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ecr:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':repository/my-repo',
      ]],
    });
    test.deepEqual(stack.resolve(repo.repositoryName), 'my-repo');
    test.done();
  },

  'arnForLocalRepository can be used to render an ARN for a local repository'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const repoName = cdk.Fn.getAtt('Boom', 'Name').toString();

    // WHEN
    const repo = ecr.Repository.fromRepositoryAttributes(stack, 'Repo', {
      repositoryArn: ecr.Repository.arnForLocalRepository(repoName, stack),
      repositoryName: repoName,
    });

    // THEN
    test.deepEqual(stack.resolve(repo.repositoryName), { 'Fn::GetAtt': ['Boom', 'Name'] });
    test.deepEqual(stack.resolve(repo.repositoryArn), {
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ecr:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':repository/',
        { 'Fn::GetAtt': ['Boom', 'Name'] },
      ]],
    });
    test.done();
  },

  'resource policy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['*'],
      principals: [new iam.AnyPrincipal()],
    }));

    // THEN
    expect(stack).to(haveResource('AWS::ECR::Repository', {
      RepositoryPolicyText: {
        Statement: [
          {
            Action: '*',
            Effect: 'Allow',
            Principal: '*',
          },
        ],
        Version: '2012-10-17',
      },
    }));

    test.done();
  },

  'fails if repository policy has no actions'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addToResourcePolicy(new iam.PolicyStatement({
      resources: ['*'],
      principals: [new iam.ArnPrincipal('arn')],
    }));

    // THEN
    test.throws(() => app.synth(), /A PolicyStatement must specify at least one \'action\' or \'notAction\'/);
    test.done();
  },

  'fails if repository policy has no IAM principals'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addToResourcePolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['ecr:*'],
    }));

    // THEN
    test.throws(() => app.synth(), /A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
    test.done();
  },

  'events': {
    'onImagePushed without imageTag creates the correct event'(test: Test) {
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'Repo');

      repo.onCloudTrailImagePushed('EventRule', {
        target: {
          bind: () => ({ arn: 'ARN', id: '' }),
        },
      });

      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        'EventPattern': {
          'source': [
            'aws.ecr',
          ],
          'detail': {
            'eventName': [
              'PutImage',
            ],
            'requestParameters': {
              'repositoryName': [
                {
                  'Ref': 'Repo02AC86CF',
                },
              ],
            },
          },
        },
        'State': 'ENABLED',
      }));

      test.done();
    },
    'onImageScanCompleted without imageTags creates the correct event'(test: Test) {
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'Repo');

      repo.onImageScanCompleted('EventRule', {
        target: {
          bind: () => ({ arn: 'ARN', id: '' }),
        },
      });

      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        'EventPattern': {
          'source': [
            'aws.ecr',
          ],
          'detail': {
            'repository-name': [
              {
                'Ref': 'Repo02AC86CF',
              },
            ],
            'scan-status': [
              'COMPLETE',
            ],
          },
        },
        'State': 'ENABLED',
      }));

      test.done();

    },
    'onImageScanCompleted with one imageTag creates the correct event'(test: Test) {
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'Repo');

      repo.onImageScanCompleted('EventRule', {
        imageTags: ['some-tag'],
        target: {
          bind: () => ({ arn: 'ARN', id: '' }),
        },
      });

      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        'EventPattern': {
          'source': [
            'aws.ecr',
          ],
          'detail': {
            'repository-name': [
              {
                'Ref': 'Repo02AC86CF',
              },
            ],
            'image-tags': [
              'some-tag',
            ],
            'scan-status': [
              'COMPLETE',
            ],
          },
        },
        'State': 'ENABLED',
      }));

      test.done();

    },
    'onImageScanCompleted with multiple imageTags creates the correct event'(test: Test) {
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'Repo');

      repo.onImageScanCompleted('EventRule', {
        imageTags: ['tag1', 'tag2', 'tag3'],
        target: {
          bind: () => ({ arn: 'ARN', id: '' }),
        },
      });

      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        'EventPattern': {
          'source': [
            'aws.ecr',
          ],
          'detail': {
            'repository-name': [
              {
                'Ref': 'Repo02AC86CF',
              },
            ],
            'image-tags': [
              'tag1',
              'tag2',
              'tag3',
            ],
            'scan-status': [
              'COMPLETE',
            ],
          },
        },
        'State': 'ENABLED',
      }));

      test.done();

    },

    'removal policy is "Retain" by default'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new ecr.Repository(stack, 'Repo');

      // THEN
      expect(stack).to(haveResource('AWS::ECR::Repository', {
        'Type': 'AWS::ECR::Repository',
        'DeletionPolicy': 'Retain',
      }, ResourcePart.CompleteDefinition));
      test.done();
    },

    '"Delete" removal policy can be set explicitly'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new ecr.Repository(stack, 'Repo', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECR::Repository', {
        'Type': 'AWS::ECR::Repository',
        'DeletionPolicy': 'Delete',
      }, ResourcePart.CompleteDefinition));
      test.done();
    },

    'grant adds appropriate resource-*'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'TestHarnessRepo');

      // WHEN
      repo.grantPull(new iam.AnyPrincipal());

      // THEN
      expect(stack).to(haveResource('AWS::ECR::Repository', {
        'RepositoryPolicyText': {
          'Statement': [
            {
              'Action': [
                'ecr:BatchCheckLayerAvailability',
                'ecr:GetDownloadUrlForLayer',
                'ecr:BatchGetImage',
              ],
              'Effect': 'Allow',
              'Principal': '*',
            },
          ],
          'Version': '2012-10-17',
        },
      }));

      test.done();
    },
  },
};
