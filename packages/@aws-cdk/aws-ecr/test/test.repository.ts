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

    'add lifecycle policy'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const repo = new ecr.Repository(stack, 'Repo');
        repo.addLifecycleRule({
            rulePriority: 10,
            countType: ecr.CountType.SinceImagePushed,
            countNumber: 5
        });

        // THEN
        expect(stack).to(haveResource('AWS::ECR::Repository', {
            LifecyclePolicy: {
                // tslint:disable-next-line:max-line-length
                LifecyclePolicyText: "{\"rules\":[{\"rulePriority\":10,\"selection\":{\"tagStatus\":\"any\",\"countType\":\"sinceImagePushed\",\"countNumber\":5,\"countUnit\":\"days\"},\"action\":{\"type\":\"expire\"}}]}",
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
    }
};
