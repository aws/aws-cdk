import { expect, haveResource, haveResourceLike, ResourcePart } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ecr = require('../lib');

// tslint:disable:object-literal-key-quotes

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
          Type: "AWS::ECR::Repository"
        }
      }
    });

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
        // tslint:disable-next-line:max-line-length
        LifecyclePolicyText: "{\"rules\":[{\"rulePriority\":1,\"selection\":{\"tagStatus\":\"tagged\",\"tagPrefixList\":[\"abc\"],\"countType\":\"imageCountMoreThan\",\"countNumber\":1},\"action\":{\"type\":\"expire\"}}]}"
      }
    }));

    test.done();
  },

  'add day-based lifecycle policy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const repo = new ecr.Repository(stack, 'Repo');
    repo.addLifecycleRule({
      maxImageAgeDays: 5,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ECR::Repository', {
      LifecyclePolicy: {
        // tslint:disable-next-line:max-line-length
        LifecyclePolicyText: "{\"rules\":[{\"rulePriority\":1,\"selection\":{\"tagStatus\":\"any\",\"countType\":\"sinceImagePushed\",\"countNumber\":5,\"countUnit\":\"days\"},\"action\":{\"type\":\"expire\"}}]}",
      }
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
        // tslint:disable-next-line:max-line-length
        LifecyclePolicyText: "{\"rules\":[{\"rulePriority\":1,\"selection\":{\"tagStatus\":\"any\",\"countType\":\"imageCountMoreThan\",\"countNumber\":5},\"action\":{\"type\":\"expire\"}}]}",
      }
    }));

    test.done();
  },

  'mixing numbered and unnumbered rules'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addLifecycleRule({ tagStatus: ecr.TagStatus.Tagged, tagPrefixList: ['a'], maxImageCount: 5 });
    repo.addLifecycleRule({ rulePriority: 10, tagStatus: ecr.TagStatus.Tagged, tagPrefixList: ['b'], maxImageCount: 5 });

    // THEN
    expect(stack).to(haveResource('AWS::ECR::Repository', {
      LifecyclePolicy: {
        // tslint:disable-next-line:max-line-length
        LifecyclePolicyText: "{\"rules\":[{\"rulePriority\":10,\"selection\":{\"tagStatus\":\"tagged\",\"tagPrefixList\":[\"b\"],\"countType\":\"imageCountMoreThan\",\"countNumber\":5},\"action\":{\"type\":\"expire\"}},{\"rulePriority\":11,\"selection\":{\"tagStatus\":\"tagged\",\"tagPrefixList\":[\"a\"],\"countType\":\"imageCountMoreThan\",\"countNumber\":5},\"action\":{\"type\":\"expire\"}}]}"
      }
    }));

    test.done();
  },

  'tagstatus Any is automatically sorted to the back'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addLifecycleRule({ maxImageCount: 5 });
    repo.addLifecycleRule({ tagStatus: ecr.TagStatus.Tagged, tagPrefixList: ['important'], maxImageCount: 999 });

    // THEN
    expect(stack).to(haveResource('AWS::ECR::Repository', {
      LifecyclePolicy: {
        // tslint:disable-next-line:max-line-length
        LifecyclePolicyText: "{\"rules\":[{\"rulePriority\":1,\"selection\":{\"tagStatus\":\"tagged\",\"tagPrefixList\":[\"important\"],\"countType\":\"imageCountMoreThan\",\"countNumber\":999},\"action\":{\"type\":\"expire\"}},{\"rulePriority\":2,\"selection\":{\"tagStatus\":\"any\",\"countType\":\"imageCountMoreThan\",\"countNumber\":5},\"action\":{\"type\":\"expire\"}}]}"
      }
    }));

    test.done();
  },

  'lifecycle rules can be added upon initialization'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecr.Repository(stack, 'Repo', {
      lifecycleRules: [
        { maxImageCount: 3 }
      ]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ECR::Repository', {
      "LifecyclePolicy": {
        // tslint:disable-next-line:max-line-length
        "LifecyclePolicyText": "{\"rules\":[{\"rulePriority\":1,\"selection\":{\"tagStatus\":\"any\",\"countType\":\"imageCountMoreThan\",\"countNumber\":3},\"action\":{\"type\":\"expire\"}}]}"
      }
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
    const arnSplit = { 'Fn::Split': [ ':', { 'Fn::GetAtt': [ 'Repo02AC86CF', 'Arn' ] } ] };
    test.deepEqual(repo.node.resolve(uri), { 'Fn::Join': [ '', [
      { 'Fn::Select': [ 4, arnSplit ] },
      '.dkr.ecr.',
      { 'Fn::Select': [ 3, arnSplit ] },
      '.amazonaws.com/',
      { Ref: 'Repo02AC86CF' }
    ]]});

    test.done();
  },

  'export/import'(test: Test) {
    // GIVEN
    const stack1 = new cdk.Stack();
    const repo1 = new ecr.Repository(stack1, 'Repo');

    const stack2 = new cdk.Stack();

    // WHEN
    const repo2 = ecr.Repository.import(stack2, 'Repo', repo1.export());

    // THEN
    test.deepEqual(repo2.node.resolve(repo2.repositoryArn), {
      'Fn::ImportValue': 'RepoRepositoryArn7F2901C9'
    });

    test.deepEqual(repo2.node.resolve(repo2.repositoryName), {
      'Fn::ImportValue': 'RepoRepositoryName58A7E467'
    });

    test.done();
  },

  'import with concrete arn'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const repo2 = ecr.Repository.import(stack, 'Repo', {
      repositoryArn: 'arn:aws:ecr:us-east-1:585695036304:repository/foo/bar/foo/fooo'
    });

    const exportImport = repo2.export();

    // THEN
    test.deepEqual(repo2.node.resolve(repo2.repositoryArn), 'arn:aws:ecr:us-east-1:585695036304:repository/foo/bar/foo/fooo');
    test.deepEqual(repo2.node.resolve(repo2.repositoryName), 'foo/bar/foo/fooo');
    test.deepEqual(repo2.node.resolve(exportImport), { repositoryArn: 'arn:aws:ecr:us-east-1:585695036304:repository/foo/bar/foo/fooo' });

    test.done();
  },

  'fails if importing with token arn and no name'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN/THEN
    test.throws(() => ecr.Repository.import(stack, 'Repo', {
      repositoryArn: cdk.Fn.getAtt('Boom', 'Boom').toString()
    }), /repositoryArn is a late-bound value, and therefore repositoryName is required/);

    test.done();
  },

  'import with token arn and repository name (see awslabs/aws-cdk#1232)'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const repo = ecr.Repository.import(stack, 'Repo', {
      repositoryArn: cdk.Fn.getAtt('Boom', 'Arn').toString(),
      repositoryName: cdk.Fn.getAtt('Boom', 'Name').toString()
    });

    // THEN
    test.deepEqual(repo.node.resolve(repo.repositoryArn), { 'Fn::GetAtt': [ 'Boom', 'Arn' ] });
    test.deepEqual(repo.node.resolve(repo.repositoryName), { 'Fn::GetAtt': [ 'Boom', 'Name' ] });
    test.done();
  },

  'import only with a repository name (arn is deduced)'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const repo = ecr.Repository.import(stack, 'Repo', {
      repositoryName: 'my-repo'
    });

    // THEN
    test.deepEqual(repo.node.resolve(repo.repositoryArn), {
      'Fn::Join': [ '', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ecr:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':repository/my-repo' ]
      ]
    });
    test.deepEqual(repo.node.resolve(repo.repositoryName), 'my-repo');
    test.done();
  },

  'arnForLocalRepository can be used to render an ARN for a local repository'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const repoName = cdk.Fn.getAtt('Boom', 'Name').toString();

    // WHEN
    const repo = ecr.Repository.import(stack, 'Repo', {
      repositoryArn: ecr.Repository.arnForLocalRepository(repoName, stack),
      repositoryName: repoName
    });

    // THEN
    test.deepEqual(repo.node.resolve(repo.repositoryName), { 'Fn::GetAtt': [ 'Boom', 'Name' ] });
    test.deepEqual(repo.node.resolve(repo.repositoryArn), {
    'Fn::Join': [ '', [
      'arn:',
      { Ref: 'AWS::Partition' },
      ':ecr:',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      ':repository/',
      { 'Fn::GetAtt': [ 'Boom', 'Name' ] } ] ]
    });
    test.done();
  },

  'resource policy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addToResourcePolicy(new iam.PolicyStatement().addAction('*'));

    // THEN
    expect(stack).to(haveResource('AWS::ECR::Repository', {
      RepositoryPolicyText: {
        Statement: [
          {
            Action: "*",
            Effect: "Allow"
          }
        ],
        Version: "2012-10-17"
      },
    }));

    test.done();
  },

  'events': {
    'onImagePushed without target or imageTag creates the correct event'(test: Test) {
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'Repo');

      repo.onImagePushed('EventRule');

      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        "EventPattern": {
          "source": [
            "aws.ecr",
          ],
          "detail": {
            "eventName": [
              "PutImage",
            ],
            "requestParameters": {
              "repositoryName": [
                {
                },
              ],
            },
          },
        },
        "State": "ENABLED",
      }));

      test.done();
    }
  },

  '"retain" can be used to retain the repo when the resource is deleted'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecr.Repository(stack, 'Repo', { retain: true });

    // THEN
    expect(stack).to(haveResource('AWS::ECR::Repository', {
      "Type": "AWS::ECR::Repository",
      "DeletionPolicy": "Retain"
    }, ResourcePart.CompleteDefinition));
    test.done();
  }
};
