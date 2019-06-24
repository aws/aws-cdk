import { expect } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Repository, RepositoryProps } from '../lib';

export = {
  'CodeCommit Repositories': {
    'add an SNS trigger to repository'(test: Test) {
      const stack = new Stack();

      const props: RepositoryProps = {
        repositoryName: 'MyRepository',
      };

      const snsArn = 'arn:aws:sns:*:123456789012:my_topic';

      new Repository(stack, 'MyRepository', props).notify(snsArn);

      expect(stack).toMatch({
        Resources: {
          MyRepository4C4BD5FC: {
            Type: "AWS::CodeCommit::Repository",
            Properties: {
              RepositoryName: "MyRepository",
              Triggers: [
                {
                  Events: [
                    "all"
                  ],
                  DestinationArn: "arn:aws:sns:*:123456789012:my_topic",
                  Name: "MyRepository/arn:aws:sns:*:123456789012:my_topic"
                }
              ]
            }
          }
        }
      });

      test.done();
    },

    'fails when triggers have duplicate names'(test: Test) {
      const stack = new Stack();

      const myRepository = new Repository(stack, 'MyRepository', {
        repositoryName: 'MyRepository',
      }).notify('myTrigger');

      test.throws(() => myRepository.notify('myTrigger'));

      test.done();
    },

    'can be imported using a Repository ARN'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const repositoryArn = 'arn:aws:codecommit:us-east-1:585695036304:my-repo';

      // WHEN
      const repo = Repository.fromRepositoryArn(stack, 'ImportedRepo', repositoryArn);

      // THEN
      test.deepEqual(stack.resolve(repo.repositoryArn), repositoryArn);
      test.deepEqual(stack.resolve(repo.repositoryName), 'my-repo');

      test.done();
    },

    'can be imported using just a Repository name (the ARN is deduced)'(test: Test) {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const repo = Repository.fromRepositoryName(stack, 'ImportedRepo', 'my-repo');

      // THEN
      test.deepEqual(stack.resolve(repo.repositoryArn), {
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':codecommit:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':my-repo'
        ]],
      });
      test.deepEqual(stack.resolve(repo.repositoryName), 'my-repo');

      test.done();
    },
  },
};
