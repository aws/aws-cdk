import { EOL } from 'os';
import { Annotations, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as cdk from '../../core';
import * as ecr from '../lib';

/* eslint-disable quote-props */

describe('repository', () => {
  test('construct repository', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecr.Repository(stack, 'Repo');

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        Repo02AC86CF: {
          Type: 'AWS::ECR::Repository',
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
      },
    });
  });

  test('repository creation with imageScanOnPush', () => {
    // GIVEN
    const noScanStack = new cdk.Stack();
    const scanStack = new cdk.Stack();

    // WHEN
    new ecr.Repository(noScanStack, 'NoScanRepo', { imageScanOnPush: false });
    new ecr.Repository(scanStack, 'ScanRepo', { imageScanOnPush: true });

    // THEN
    Template.fromStack(noScanStack).hasResourceProperties('AWS::ECR::Repository', {
      ImageScanningConfiguration: {
        ScanOnPush: false,
      },
    });
    Template.fromStack(scanStack).hasResourceProperties('AWS::ECR::Repository', {
      ImageScanningConfiguration: {
        ScanOnPush: true,
      },
    });
  });

  test('tag-based lifecycle policy with tagPrefixList', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addLifecycleRule({ tagPrefixList: ['abc'], maxImageCount: 1 });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
      LifecyclePolicy: {
        // eslint-disable-next-line max-len
        LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"tagged","tagPrefixList":["abc"],"countType":"imageCountMoreThan","countNumber":1},"action":{"type":"expire"}}]}',
      },
    });
  });

  test('tag-based lifecycle policy with tagPatternList', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addLifecycleRule({ tagPatternList: ['abc*'], maxImageCount: 1 });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
      LifecyclePolicy: {
        // eslint-disable-next-line max-len
        LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"tagged","tagPatternList":["abc*"],"countType":"imageCountMoreThan","countNumber":1},"action":{"type":"expire"}}]}',
      },
    });
  });

  test('both tagPrefixList and tagPatternList cannot be specified together in a rule', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // THEN
    expect(() => {
      repo.addLifecycleRule({ tagPrefixList: ['abc'], tagPatternList: ['abc*'], maxImageCount: 1 });
    }).toThrow(/Both tagPrefixList and tagPatternList cannot be specified together in a rule/);
  });

  test('tagPrefixList can only be specified when tagStatus is set to Tagged', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // THEN
    expect(() => {
      repo.addLifecycleRule({ tagStatus: ecr.TagStatus.ANY, tagPrefixList: ['abc'], maxImageCount: 1 });
    }).toThrow(/tagPrefixList and tagPatternList can only be specified when tagStatus is set to Tagged/);
  });

  test('tagPatternList can only be specified when tagStatus is set to Tagged', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // THEN
    expect(() => {
      repo.addLifecycleRule({ tagStatus: ecr.TagStatus.ANY, tagPatternList: ['abc*'], maxImageCount: 1 });
    }).toThrow(/tagPrefixList and tagPatternList can only be specified when tagStatus is set to Tagged/);
  });

  test('TagStatus.Tagged requires the specification of a tagPrefixList or a tagPatternList', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // THEN
    expect(() => {
      repo.addLifecycleRule({ tagStatus: ecr.TagStatus.TAGGED, maxImageCount: 1 });
    }).toThrow(/TagStatus.Tagged requires the specification of a tagPrefixList or a tagPatternList/);
  });

  test('A tag pattern can contain four wildcard characters', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addLifecycleRule({ tagPatternList: ['abc*d*e*f*'], maxImageCount: 1 });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
      LifecyclePolicy: {
        // eslint-disable-next-line max-len
        LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"tagged","tagPatternList":["abc*d*e*f*"],"countType":"imageCountMoreThan","countNumber":1},"action":{"type":"expire"}}]}',
      },
    });
  });

  test('A tag pattern cannot contain more than four wildcard characters', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // THEN
    expect(() => {
      repo.addLifecycleRule({ tagPatternList: ['abc*d*e*f*g*h'], maxImageCount: 1 });
    }).toThrow(/A tag pattern cannot contain more than four wildcard characters \(\*\), pattern: abc\*d\*e\*f\*g\*h, counts: 5/);
  });

  test('image tag mutability can be set', () => {
    // GIVEN
    const stack = new cdk.Stack();
    new ecr.Repository(stack, 'Repo', { imageTagMutability: ecr.TagMutability.IMMUTABLE });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
      ImageTagMutability: 'IMMUTABLE',
    });
  });

  test('emptyOnDelete can be set', () => {
    // GIVEN
    const stack = new cdk.Stack();
    new ecr.Repository(stack, 'Repo', { emptyOnDelete: true, removalPolicy: cdk.RemovalPolicy.DESTROY });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
      EmptyOnDelete: true,
    });
  });

  test('emptyOnDelete requires \'RemovalPolicy.DESTROY\'', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect( () => {
      new ecr.Repository(stack, 'Repo', { emptyOnDelete: true });
    },
    ).toThrow('Cannot use \'emptyOnDelete\' property on a repository without setting removal policy to \'DESTROY\'.');
  });

  test('add day-based lifecycle policy', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const repo = new ecr.Repository(stack, 'Repo');
    repo.addLifecycleRule({
      maxImageAge: cdk.Duration.days(5),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
      LifecyclePolicy: {
        // eslint-disable-next-line max-len
        LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"sinceImagePushed","countNumber":5,"countUnit":"days"},"action":{"type":"expire"}}]}',
      },
    });
  });

  test('add count-based lifecycle policy', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addLifecycleRule({
      maxImageCount: 5,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
      LifecyclePolicy: {
        // eslint-disable-next-line max-len
        LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":5},"action":{"type":"expire"}}]}',
      },
    });
  });

  test('mixing numbered and unnumbered rules', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addLifecycleRule({ tagStatus: ecr.TagStatus.TAGGED, tagPrefixList: ['a'], maxImageCount: 5 });
    repo.addLifecycleRule({ rulePriority: 10, tagStatus: ecr.TagStatus.TAGGED, tagPrefixList: ['b'], maxImageCount: 5 });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
      LifecyclePolicy: {
        // eslint-disable-next-line max-len
        LifecyclePolicyText: '{"rules":[{"rulePriority":10,"selection":{"tagStatus":"tagged","tagPrefixList":["b"],"countType":"imageCountMoreThan","countNumber":5},"action":{"type":"expire"}},{"rulePriority":11,"selection":{"tagStatus":"tagged","tagPrefixList":["a"],"countType":"imageCountMoreThan","countNumber":5},"action":{"type":"expire"}}]}',
      },
    });
  });

  test('tagstatus Any is automatically sorted to the back', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addLifecycleRule({ maxImageCount: 5 });
    repo.addLifecycleRule({ tagStatus: ecr.TagStatus.TAGGED, tagPrefixList: ['important'], maxImageCount: 999 });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
      LifecyclePolicy: {
        // eslint-disable-next-line max-len
        LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"tagged","tagPrefixList":["important"],"countType":"imageCountMoreThan","countNumber":999},"action":{"type":"expire"}},{"rulePriority":2,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":5},"action":{"type":"expire"}}]}',
      },
    });
  });

  test('lifecycle rules can be added upon initialization', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecr.Repository(stack, 'Repo', {
      lifecycleRules: [
        { maxImageCount: 3 },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
      'LifecyclePolicy': {
        // eslint-disable-next-line max-len
        'LifecyclePolicyText': '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}',
      },
    });
  });

  test('calculate repository URI', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    new cdk.CfnOutput(stack, 'RepoUri', {
      value: repo.repositoryUri,
    });

    // THEN
    const arnSplit = { 'Fn::Split': [':', { 'Fn::GetAtt': ['Repo02AC86CF', 'Arn'] }] };
    Template.fromStack(stack).hasOutput('*', {
      'Value': {
        'Fn::Join': ['', [
          { 'Fn::Select': [4, arnSplit] },
          '.dkr.ecr.',
          { 'Fn::Select': [3, arnSplit] },
          '.',
          { Ref: 'AWS::URLSuffix' },
          '/',
          { Ref: 'Repo02AC86CF' },
        ]],
      },
    });
  });

  test('calculate registry URI', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    new cdk.CfnOutput(stack, 'RegistryUri', {
      value: repo.registryUri,
    });

    // THEN
    const arnSplit = { 'Fn::Split': [':', { 'Fn::GetAtt': ['Repo02AC86CF', 'Arn'] }] };
    Template.fromStack(stack).hasOutput('*', {
      'Value': {
        'Fn::Join': ['', [
          { 'Fn::Select': [4, arnSplit] },
          '.dkr.ecr.',
          { 'Fn::Select': [3, arnSplit] },
          '.',
          { Ref: 'AWS::URLSuffix' },
        ]],
      },
    });
  });

  test('import with concrete arn', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const repo2 = ecr.Repository.fromRepositoryArn(stack, 'repo', 'arn:aws:ecr:us-east-1:585695036304:repository/foo/bar/foo/fooo');

    // THEN
    expect(stack.resolve(repo2.repositoryArn)).toBe('arn:aws:ecr:us-east-1:585695036304:repository/foo/bar/foo/fooo');
    expect(stack.resolve(repo2.repositoryName)).toBe('foo/bar/foo/fooo');
  });

  test('import with arn without /repository', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const invalidArn = 'arn:aws:ecr:us-east-1:123456789012:foo-ecr-repo-name';

    // THEN
    expect(() => {
      ecr.Repository.fromRepositoryArn(stack, 'repo', invalidArn);
    }).toThrow(`Repository arn should be in the format 'arn:<PARTITION>:ecr:<REGION>:<ACCOUNT>:repository/<NAME>', got ${invalidArn}.`);
  });

  test('fails if importing with token arn and no name', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN/THEN
    expect(() => {
      ecr.Repository.fromRepositoryArn(stack, 'arn', cdk.Fn.getAtt('Boom', 'Boom').toString());
    }).toThrow(/\"repositoryArn\" is a late-bound value, and therefore \"repositoryName\" is required\. Use \`fromRepositoryAttributes\` instead/);
  });

  test('import with token arn and repository name (see awslabs/aws-cdk#1232)', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const repo = ecr.Repository.fromRepositoryAttributes(stack, 'Repo', {
      repositoryArn: cdk.Fn.getAtt('Boom', 'Arn').toString(),
      repositoryName: cdk.Fn.getAtt('Boom', 'Name').toString(),
    });
    new cdk.CfnOutput(stack, 'RepoArn', {
      value: repo.repositoryArn,
    });
    new cdk.CfnOutput(stack, 'RepoName', {
      value: repo.repositoryName,
    });

    // THEN
    Template.fromStack(stack).hasOutput('*', {
      Value: { 'Fn::GetAtt': ['Boom', 'Arn'] },
    });
    Template.fromStack(stack).hasOutput('*', {
      Value: { 'Fn::GetAtt': ['Boom', 'Name'] },
    });
  });

  test('import only with a repository name (arn is deduced)', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const repo = ecr.Repository.fromRepositoryName(stack, 'just-name', 'my-repo');
    new cdk.CfnOutput(stack, 'RepoArn', {
      value: repo.repositoryArn,
    });
    new cdk.CfnOutput(stack, 'RepoName', {
      value: repo.repositoryName,
    });

    // THEN
    Template.fromStack(stack).hasOutput('*', {
      Value: {
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':ecr:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':repository/my-repo',
        ]],
      },
    });
    Template.fromStack(stack).hasOutput('*', {
      Value: 'my-repo',
    });
  });

  test('arnForLocalRepository can be used to render an ARN for a local repository', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repoName = cdk.Fn.getAtt('Boom', 'Name').toString();

    // WHEN
    const repo = ecr.Repository.fromRepositoryAttributes(stack, 'Repo', {
      repositoryArn: ecr.Repository.arnForLocalRepository(repoName, stack),
      repositoryName: repoName,
    });
    new cdk.CfnOutput(stack, 'RepoArn', {
      value: repo.repositoryArn,
    });
    new cdk.CfnOutput(stack, 'RepoName', {
      value: repo.repositoryName,
    });

    // THEN
    Template.fromStack(stack).hasOutput('*', {
      Value: { 'Fn::GetAtt': ['Boom', 'Name'] },
    });
    Template.fromStack(stack).hasOutput('*', {
      Value: {
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
      },
    });
  });

  test('resource policy', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['*'],
      principals: [new iam.AnyPrincipal()],
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
      RepositoryPolicyText: {
        Statement: [
          {
            Action: '*',
            Effect: 'Allow',
            Principal: { AWS: '*' },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('fails if repository policy has no actions', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addToResourcePolicy(new iam.PolicyStatement({
      principals: [new iam.ArnPrincipal('arn')],
    }));

    // THEN
    expect(() => app.synth()).toThrow(/A PolicyStatement must specify at least one \'action\' or \'notAction\'/);
  });

  test('fails if repository policy has no IAM principals', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['ecr:*'],
    }));

    // THEN
    expect(() => app.synth()).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
  });

  test('warns if repository policy has resources', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addToResourcePolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['ecr:*'],
      principals: [new iam.AnyPrincipal()],
    }));

    // THEN
    Annotations.fromStack(stack).hasWarning('*', 'ECR resource policy does not allow resource statements. [ack: @aws-cdk/aws-ecr:noResourceStatements]');
  });

  test('does not warn if repository policy does not have resources', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['ecr:*'],
      principals: [new iam.AnyPrincipal()],
    }));

    // THEN
    Annotations.fromStack(stack).hasNoWarning('*', 'ECR resource policy does not allow resource statements. [ack: @aws-cdk/aws-ecr:noResourceStatements]');
  });

  test('default encryption configuration', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');

    // WHEN
    new ecr.Repository(stack, 'Repo', { encryption: ecr.RepositoryEncryption.AES_256 });

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        Repo02AC86CF: {
          Type: 'AWS::ECR::Repository',
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
      },
    });
  });

  test('kms encryption configuration', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');

    // WHEN
    new ecr.Repository(stack, 'Repo', { encryption: ecr.RepositoryEncryption.KMS });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository',
      {
        EncryptionConfiguration: {
          EncryptionType: 'KMS',
        },
      });
  });

  test('kms encryption with custom kms configuration', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');

    // WHEN
    const custom_key = new kms.Key(stack, 'Key');
    new ecr.Repository(stack, 'Repo', { encryptionKey: custom_key });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository',
      {
        EncryptionConfiguration: {
          EncryptionType: 'KMS',
          KmsKey: {
            'Fn::GetAtt': [
              'Key961B73FD',
              'Arn',
            ],
          },
        },
      });
  });

  test('fails if with custom kms key and AES256 as encryption', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    const custom_key = new kms.Key(stack, 'Key');

    // THEN
    expect(() => {
      new ecr.Repository(stack, 'Repo', { encryption: ecr.RepositoryEncryption.AES_256, encryptionKey: custom_key });
    }).toThrow('encryptionKey is specified, so \'encryption\' must be set to KMS (value: AES256)');
  });

  test('removal policy is "Retain" by default', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecr.Repository(stack, 'Repo');

    // THEN
    Template.fromStack(stack).hasResource('AWS::ECR::Repository', {
      'Type': 'AWS::ECR::Repository',
      'DeletionPolicy': 'Retain',
    });
  });

  test('"Delete" removal policy can be set explicitly', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecr.Repository(stack, 'Repo', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::ECR::Repository', {
      'Type': 'AWS::ECR::Repository',
      'DeletionPolicy': 'Delete',
    });
  });

  describe('events', () => {
    test('onImagePushed without imageTag creates the correct event', () => {
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'Repo');

      repo.onCloudTrailImagePushed('EventRule', {
        target: {
          bind: () => ({ arn: 'ARN', id: '' }),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
      });
    });

    test('onImageScanCompleted without imageTags creates the correct event', () => {
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'Repo');

      repo.onImageScanCompleted('EventRule', {
        target: {
          bind: () => ({ arn: 'ARN', id: '' }),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
      });
    });

    test('onImageScanCompleted with one imageTag creates the correct event', () => {
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'Repo');

      repo.onImageScanCompleted('EventRule', {
        imageTags: ['some-tag'],
        target: {
          bind: () => ({ arn: 'ARN', id: '' }),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
      });
    });

    test('onImageScanCompleted with multiple imageTags creates the correct event', () => {
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'Repo');

      repo.onImageScanCompleted('EventRule', {
        imageTags: ['tag1', 'tag2', 'tag3'],
        target: {
          bind: () => ({ arn: 'ARN', id: '' }),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
      });
    });

    test('removal policy is "Retain" by default', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new ecr.Repository(stack, 'Repo');

      // THEN
      Template.fromStack(stack).hasResource('AWS::ECR::Repository', {
        'Type': 'AWS::ECR::Repository',
        'DeletionPolicy': 'Retain',
      });
    });

    test('"Delete" removal policy can be set explicitly', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new ecr.Repository(stack, 'Repo', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });

      // THEN
      Template.fromStack(stack).hasResource('AWS::ECR::Repository', {
        'Type': 'AWS::ECR::Repository',
        'DeletionPolicy': 'Delete',
      });
    });

    test('grant adds appropriate resource-*', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'TestHarnessRepo');

      // WHEN
      repo.grantPull(new iam.AnyPrincipal());

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
        'RepositoryPolicyText': {
          'Statement': [
            {
              'Action': [
                'ecr:BatchCheckLayerAvailability',
                'ecr:GetDownloadUrlForLayer',
                'ecr:BatchGetImage',
              ],
              'Effect': 'Allow',
              'Principal': { 'AWS': '*' },
            },
          ],
          'Version': '2012-10-17',
        },
      });
    });

    test('grant push', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'TestHarnessRepo');

      // WHEN
      repo.grantPush(new iam.AnyPrincipal());

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
        'RepositoryPolicyText': {
          'Statement': [
            {
              'Action': [
                'ecr:CompleteLayerUpload',
                'ecr:UploadLayerPart',
                'ecr:InitiateLayerUpload',
                'ecr:BatchCheckLayerAvailability',
                'ecr:PutImage',
              ],
              'Effect': 'Allow',
              'Principal': { 'AWS': '*' },
            },
          ],
          'Version': '2012-10-17',
        },
      });
    });

    test('grant pull for role', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'TestHarnessRepo');

      // WHEN
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      });
      repo.grantPull(role);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': [
                'ecr:BatchCheckLayerAvailability',
                'ecr:GetDownloadUrlForLayer',
                'ecr:BatchGetImage',
              ],
              'Resource': {
                'Fn::GetAtt': ['TestHarnessRepoAA7E9724', 'Arn'],
              },
            }, {
              'Action': 'ecr:GetAuthorizationToken',
              'Resource': '*',
            },
          ],
        },
      });
    });

    test('grant push for role', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'TestHarnessRepo');

      // WHEN
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      });
      repo.grantPush(role);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': [
                'ecr:CompleteLayerUpload',
                'ecr:UploadLayerPart',
                'ecr:InitiateLayerUpload',
                'ecr:BatchCheckLayerAvailability',
                'ecr:PutImage',
              ],
              'Effect': 'Allow',
              'Resource': {
                'Fn::GetAtt': ['TestHarnessRepoAA7E9724', 'Arn'],
              },
            }, {
              'Action': 'ecr:GetAuthorizationToken',
              'Resource': '*',
            },
          ],
        },
      });
    });

    test('grant pullpush for role', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'TestHarnessRepo');

      // WHEN
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      });
      repo.grantPullPush(role);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': [
                'ecr:BatchCheckLayerAvailability',
                'ecr:GetDownloadUrlForLayer',
                'ecr:BatchGetImage',
                'ecr:CompleteLayerUpload',
                'ecr:UploadLayerPart',
                'ecr:InitiateLayerUpload',
                'ecr:PutImage',
              ],
              'Effect': 'Allow',
              'Resource': {
                'Fn::GetAtt': ['TestHarnessRepoAA7E9724', 'Arn'],
              },
            }, {
              'Action': 'ecr:GetAuthorizationToken',
              'Resource': '*',
            },
          ],
        },
      });
    });

    test('grant read adds appropriate permissions', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'TestRepo');

      // WHEN
      repo.grantRead(new iam.AnyPrincipal());

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
        'RepositoryPolicyText': {
          'Statement': [
            {
              'Action': [
                'ecr:DescribeRepositories',
                'ecr:DescribeImages',
              ],
              'Effect': 'Allow',
              'Principal': { 'AWS': '*' },
            },
          ],
          'Version': '2012-10-17',
        },
      });
    });

    test('grant read adds appropriate permissions', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'TestRepo');

      // WHEN
      repo.onEvent('EcrOnEventRule', {
        target: {
          bind: () => ({ arn: 'ARN', id: '' }),
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        'EventPattern': {
          'source': [
            'aws.ecr',
          ],
          'detail': {
            'repository-name': [
              { 'Ref': 'TestRepo08D311A0' },
            ],
          },
        },
      });
    });
  });

  describe('repository name validation', () => {
    test('repository name validations', () => {
      const stack = new cdk.Stack();

      expect(() => new ecr.Repository(stack, 'Repo1', {
        repositoryName: 'abc-xyz-34ab',
      })).not.toThrow();

      expect(() => new ecr.Repository(stack, 'Repo2', {
        repositoryName: '124/pp-33',
      })).not.toThrow();
    });

    test('repository name validation skips tokenized values', () => {
      const stack = new cdk.Stack();

      expect(() => new ecr.Repository(stack, 'Repo', {
        repositoryName: cdk.Lazy.string({ produce: () => '_REPO' }),
      })).not.toThrow();
    });

    test('fails with message on invalid repository names', () => {
      const stack = new cdk.Stack();
      const repositoryName = `-repositoRy.--${new Array(256).join('$')}`;
      const expectedErrors = [
        `Invalid ECR repository name (value: ${repositoryName})`,
        'Repository name must be at least 2 and no more than 256 characters',
        'Repository name must start with a letter and can only contain lowercase letters, numbers, hyphens, underscores, periods and forward slashes',
      ].join(EOL);

      expect(() => new ecr.Repository(stack, 'Repo', {
        repositoryName,
      })).toThrow(expectedErrors);
    });

    test('fails if repository name has less than 2 or more than 256 characters', () => {
      const stack = new cdk.Stack();

      expect(() => new ecr.Repository(stack, 'Repo1', {
        repositoryName: 'a',
      })).toThrow(/at least 2/);

      expect(() => new ecr.Repository(stack, 'Repo2', {
        repositoryName: new Array(258).join('x'),
      })).toThrow(/no more than 256/);
    });

    test('fails if repository name does not follow the specified pattern', () => {
      const stack = new cdk.Stack();

      expect(() => new ecr.Repository(stack, 'Repo1', {
        repositoryName: 'aAa',
      })).toThrow('Repository name must start with a letter and can only contain lowercase letters, numbers, hyphens, underscores, periods and forward slashes');

      expect(() => new ecr.Repository(stack, 'Repo2', {
        repositoryName: 'a--a',
      })).toThrow('Repository name must start with a letter and can only contain lowercase letters, numbers, hyphens, underscores, periods and forward slashes');

      expect(() => new ecr.Repository(stack, 'Repo3', {
        repositoryName: 'a./a-a',
      })).toThrow('Repository name must start with a letter and can only contain lowercase letters, numbers, hyphens, underscores, periods and forward slashes');

      expect(() => new ecr.Repository(stack, 'Repo4', {
        repositoryName: 'a//a-a',
      })).toThrow('Repository name must start with a letter and can only contain lowercase letters, numbers, hyphens, underscores, periods and forward slashes');
    });

    test('return value addToResourcePolicy', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const policyStmt1 = new iam.PolicyStatement({
        actions: ['*'],
        principals: [new iam.AnyPrincipal()],
      });
      const policyStmt2 = new iam.PolicyStatement({
        effect: iam.Effect.DENY,
        actions: ['ecr:BatchGetImage', 'ecr:GetDownloadUrlForLayer'],
        principals: [new iam.AnyPrincipal()],
      });
      const policyText1 = '{"Statement": [{"Action": "*", "Effect": "Allow", "Principal": {"AWS": "*"}}], "Version": "2012-10-17"}';
      const policyText2 = `{"Statement": [
        {"Action": "*", "Effect": "Allow", "Principal": {"AWS": "*"}},
        {"Action": ["ecr:BatchGetImage", "ecr:GetDownloadUrlForLayer"], "Effect": "Deny", "Principal": {"AWS": "*"}}
      ], "Version": "2012-10-17"}`;

      // WHEN
      const artifact1 = new ecr.Repository(stack, 'Repo1').addToResourcePolicy(policyStmt1);
      const repo = new ecr.Repository(stack, 'Repo2');
      repo.addToResourcePolicy(policyStmt1);
      const artifact2 =repo.addToResourcePolicy(policyStmt2);

      // THEN
      expect(stack.resolve(artifact1.statementAdded)).toEqual(true);
      expect(stack.resolve(artifact1.policyDependable)).toEqual(JSON.parse(policyText1));
      Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
        RepositoryPolicyText: JSON.parse(policyText1),
      });

      expect(stack.resolve(artifact2.statementAdded)).toEqual(true);
      expect(stack.resolve(artifact2.policyDependable)).toEqual(JSON.parse(policyText2));
      Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
        RepositoryPolicyText: JSON.parse(policyText2),
      });
    });
  });

  describe('when auto delete images is set to true', () => {
    test('it is ignored if emptyOnDelete is set', () => {
      const stack = new cdk.Stack();

      new ecr.Repository(stack, 'Repo1', {
        autoDeleteImages: true,
        emptyOnDelete: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });

      new ecr.Repository(stack, 'Repo2', {
        autoDeleteImages: true,
        emptyOnDelete: false,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });

      Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 0);
    });

    test('permissions are correctly for multiple ecr repos', () => {
      const stack = new cdk.Stack();
      new ecr.Repository(stack, 'Repo1', {
        autoDeleteImages: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
      new ecr.Repository(stack, 'Repo2', {
        autoDeleteImages: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        Policies: [
          {
            PolicyName: 'Inline',
            PolicyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Effect: 'Allow',
                  Action: [
                    'ecr:BatchDeleteImage',
                    'ecr:DescribeRepositories',
                    'ecr:ListImages',
                    'ecr:ListTagsForResource',
                  ],
                  Resource: [
                    {
                      'Fn::Join': ['', [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':ecr:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        ':repository/*',
                      ]],
                    },
                  ],
                  Condition: {
                    StringEquals: {
                      'ecr:ResourceTag/aws-cdk:auto-delete-images': 'true',
                    },
                  },
                },
              ],
            },
          },
        ],
      });
    });

    test('synth fails when removal policy is not DESTROY', () => {
      const stack = new cdk.Stack();
      expect(() => {
        new ecr.Repository(stack, 'Repo', {
          autoDeleteImages: true,
          removalPolicy: cdk.RemovalPolicy.RETAIN,
        });
      }).toThrow('Cannot use \'autoDeleteImages\' property on a repository without setting removal policy to \'DESTROY\'.');
    });
  });

  test('repo name is embedded in CustomResourceProvider description', () => {
    const stack = new cdk.Stack();
    new ecr.Repository(stack, 'Repo', {
      autoDeleteImages: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Description: {
        'Fn::Join': ['', [
          'Lambda function for auto-deleting images in ',
          { Ref: 'Repo02AC86CF' },
          ' repository.',
        ]],
      },
    });
  });
});
