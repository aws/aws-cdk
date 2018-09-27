import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ecr = require('../lib');

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

  'calculate repository URI'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    const uri = repo.repositoryUri;

    // THEN
    const arnSplit = { 'Fn::Split': [ ':', { 'Fn::GetAtt': [ 'Repo02AC86CF', 'Arn' ] } ] };
    test.deepEqual(cdk.resolve(uri), { 'Fn::Join': [ '', [
      { 'Fn::Select': [ 4, arnSplit ] },
      '.dkr.ecr.',
      { 'Fn::Select': [ 3, arnSplit ] },
      '.amazonaws.com/',
      { 'Fn::Select': [ 1, { 'Fn::Split': [ '/', { 'Fn::Select': [ 5, arnSplit ] } ] } ] }
    ]]});

    test.done();
  },

  'export/import'(test: Test) {
    // GIVEN
    const stack1 = new cdk.Stack();
    const repo1 = new ecr.Repository(stack1, 'Repo');

    const stack2 = new cdk.Stack();

    // WHEN
    const repo2 = ecr.RepositoryRef.import(stack2, 'Repo', repo1.export());

    // THEN
    test.deepEqual(cdk.resolve(repo2.repositoryArn), {
      'Fn::ImportValue': 'RepoRepositoryArn7F2901C9'
    });

    test.done();
  },

  'resource policy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'Repo');

    // WHEN
    repo.addToResourcePolicy(new cdk.PolicyStatement().addAction('*'));

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
  }
};
