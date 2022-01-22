import { EOL } from 'os';
import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as ecr from '../lib';

describe('public repository', () => {
  test('construct public repository', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecr.PublicRepository(stack, 'PublicRepo');

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        PublicRepo59BDF279: {
          Type: 'AWS::ECR::PublicRepository',
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
      },
    });
  });

  test('construct public repository with repository catalog data', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecr.PublicRepository(stack, 'PublicRepo', {
      description: 'Some description',
      about: 'Some about',
      usage: 'Some usage',
      operatingSystems: [ecr.OperatingSystem.LINUX],
      architectures: [ecr.Architecture.ARM_64],
    });

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        PublicRepo59BDF279: {
          Type: 'AWS::ECR::PublicRepository',
          Properties: {
            RepositoryCatalogData: {
              RepositoryDescription: 'Some description',
              AboutText: 'Some about',
              UsageText: 'Some usage',
              OperatingSystems: [
                'Linux',
              ],
              Architectures: [
                'ARM 64',
              ],
            },
          },
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
      },
    });
  });

  test('resource policy using constructor', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecr.PublicRepository(stack, 'PublicRepo', {
      resourcePolicy: [new iam.PolicyStatement({
        actions: ['*'],
        principals: [new iam.AnyPrincipal()],
      })],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::PublicRepository', {
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

  test('resource policy using addToResourcePolicy() method', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.PublicRepository(stack, 'PublicRepo');

    // WHEN
    repo.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['*'],
      principals: [new iam.AnyPrincipal()],
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::PublicRepository', {
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
    const repo = new ecr.PublicRepository(stack, 'PublicRepo');

    // WHEN
    repo.addToResourcePolicy(new iam.PolicyStatement({
      resources: ['*'],
      principals: [new iam.ArnPrincipal('arn')],
    }));

    // THEN
    expect(() => app.synth()).toThrow(/A PolicyStatement must specify at least one \'action\' or \'notAction\'/);
  });

  test('fails if repository policy has no IAM principals', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    const repo = new ecr.PublicRepository(stack, 'PublicRepo');

    // WHEN
    repo.addToResourcePolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['ecr-public:*'],
    }));

    // THEN
    expect(() => app.synth()).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
  });

  test('removal policy is "Retain" by default', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecr.PublicRepository(stack, 'PublicRepo');

    // THEN
    Template.fromStack(stack).hasResource('AWS::ECR::PublicRepository', {
      Type: 'AWS::ECR::PublicRepository',
      DeletionPolicy: 'Retain',
    });
  });

  test('"Delete" removal policy can be set explicitly', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecr.PublicRepository(stack, 'PublicRepo', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::ECR::PublicRepository', {
      Type: 'AWS::ECR::PublicRepository',
      DeletionPolicy: 'Delete',
    });
  });

  test('fails with message on invalid repository names', () => {
    const stack = new cdk.Stack();
    const repositoryName = `-repositoRy.--${new Array(205).join('$')}`;
    const expectedErrors = [
      `Invalid ECR repository name (value: ${repositoryName})`,
      'Repository name must be at least 2 and no more than 205 characters',
      'Repository name must follow the specified pattern: (?:[a-z0-9]+(?:[._-][a-z0-9]+)*/)*[a-z0-9]+(?:[._-][a-z0-9]+)*',
    ].join(EOL);

    expect(() => new ecr.PublicRepository(stack, 'PublicRepo', {
      publicRepositoryName: repositoryName,
    })).toThrow(expectedErrors);
  });

  test('fails if repository name has less than 2 or more than 205 characters', () => {
    const stack = new cdk.Stack();

    expect(() => new ecr.PublicRepository(stack, 'PublicRepo1', {
      publicRepositoryName: 'a',
    })).toThrow(/at least 2/);

    expect(() => new ecr.PublicRepository(stack, 'PublicRepo2', {
      publicRepositoryName: new Array(207).join('x'),
    })).toThrow(/no more than 205/);
  });

  test('fails if repository name does not follow the specified pattern', () => {
    const stack = new cdk.Stack();

    expect(() => new ecr.PublicRepository(stack, 'PublicRepo1', {
      publicRepositoryName: 'aAa',
    })).toThrow(/must follow the specified pattern/);

    expect(() => new ecr.PublicRepository(stack, 'PublicRepo2', {
      publicRepositoryName: 'a--a',
    })).toThrow(/must follow the specified pattern/);

    expect(() => new ecr.PublicRepository(stack, 'PublicRepo3', {
      publicRepositoryName: 'a./a-a',
    })).toThrow(/must follow the specified pattern/);

    expect(() => new ecr.PublicRepository(stack, 'PublicRepo4', {
      publicRepositoryName: 'a//a-a',
    })).toThrow(/must follow the specified pattern/);
  });

  test('grantPullPush adds appropriate resource policies', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.PublicRepository(stack, 'PublicRepo');

    // WHEN
    repo.grantPush(new iam.AnyPrincipal());

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECR::PublicRepository', {
      RepositoryPolicyText: {
        Statement: [
          {
            Action: [
              'ecr-public:BatchCheckLayerAvailability',
              'ecr-public:CompleteLayerUpload',
              'ecr-public:InitiateLayerUpload',
              'ecr-public:PutImage',
              'ecr-public:UploadLayerPart',
            ],
            Effect: 'Allow',
            Principal: { AWS: '*' },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('import with concrete arn', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const repo = ecr.PublicRepository.fromPublicRepositoryArn(stack, 'repo', 'arn:aws:ecr-public::585695036304:repository/foo/bar/foo/fooo');

    // THEN
    expect(stack.resolve(repo.publicRepositoryArn)).toBe('arn:aws:ecr-public::585695036304:repository/foo/bar/foo/fooo');
    expect(stack.resolve(repo.publicRepositoryName)).toBe('foo/bar/foo/fooo');
  });

  test('fails if importing with token arn and no name', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN/THEN
    expect(() => {
      ecr.PublicRepository.fromPublicRepositoryArn(stack, 'arn', cdk.Fn.getAtt('Boom', 'Boom').toString());
    }).toThrow(/\"publicRepositoryArn\" is a late-bound value, and therefore \"publicRepositoryName\" is required\. Use \`fromPublicRepositoryAttributes\` instead/);
  });

  test('import with token arn and repository name (see awslabs/aws-cdk#1232)', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const repo = ecr.PublicRepository.fromPublicRepositoryAttributes(stack, 'PublicRepo', {
      publicRepositoryArn: cdk.Fn.getAtt('Boom', 'Arn').toString(),
      publicRepositoryName: cdk.Fn.getAtt('Boom', 'Name').toString(),
    });
    new cdk.CfnOutput(stack, 'RepoArn', {
      value: repo.publicRepositoryArn,
    });
    new cdk.CfnOutput(stack, 'RepoName', {
      value: repo.publicRepositoryName,
    });

    // THEN
    Template.fromStack(stack).hasOutput('*', {
      Value: { 'Fn::GetAtt': ['Boom', 'Arn'] },
    });
    Template.fromStack(stack).hasOutput('*', {
      Value: { 'Fn::GetAtt': ['Boom', 'Name'] },
    });
  });

  test('import with local public repository name', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const repo = ecr.PublicRepository.fromPublicRepositoryName(stack, 'PublicRepo', 'foo/bar/foo/fooo');
    new cdk.CfnOutput(stack, 'RepoArn', {
      value: repo.publicRepositoryArn,
    });
    new cdk.CfnOutput(stack, 'RepoName', {
      value: repo.publicRepositoryName,
    });

    // THEN
    Template.fromStack(stack).hasOutput('*', {
      Value: {
        'Fn::Join': ['', [
          'arn:', { Ref: 'AWS::Partition' }, ':ecr-public::',
          { Ref: 'AWS::AccountId' }, ':repository/foo/bar/foo/fooo',
        ]],
      },
    });
    Template.fromStack(stack).hasOutput('*', {
      Value: 'foo/bar/foo/fooo',
    });
  });
});
