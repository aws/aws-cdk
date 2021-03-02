import { expect, haveResource } from '@aws-cdk/assert';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
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
            Type: 'AWS::CodeCommit::Repository',
            Properties: {
              RepositoryName: 'MyRepository',
              Triggers: [
                {
                  Events: [
                    'all',
                  ],
                  DestinationArn: 'arn:aws:sns:*:123456789012:my_topic',
                  Name: 'Default/MyRepository/arn:aws:sns:*:123456789012:my_topic',
                },
              ],
            },
          },
        },
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

    /**
     * Fix for https://github.com/aws/aws-cdk/issues/10630
     */
    'can be imported using a Repository ARN and respect the region in clone urls'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const repositoryArn = 'arn:aws:codecommit:us-west-2:585695036304:my-repo';

      // WHEN
      const repo = Repository.fromRepositoryArn(stack, 'ImportedRepo', repositoryArn);

      // THEN
      // a fully qualified arn should use the region from the arn
      test.deepEqual(stack.resolve(repo.repositoryCloneUrlHttp), {
        'Fn::Join': [
          '',
          [
            'https://git-codecommit.us-west-2.',
            { Ref: 'AWS::URLSuffix' },
            '/v1/repos/my-repo',
          ],
        ],
      });

      test.deepEqual(stack.resolve(repo.repositoryCloneUrlSsh), {
        'Fn::Join': [
          '',
          [
            'ssh://git-codecommit.us-west-2.',
            { Ref: 'AWS::URLSuffix' },
            '/v1/repos/my-repo',
          ],
        ],
      });

      test.deepEqual(stack.resolve(repo.repositoryCloneUrlGrc), 'codecommit::us-west-2://my-repo');

      test.deepEqual(repo.env.account, '585695036304');
      test.deepEqual(repo.env.region, 'us-west-2');

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
          ':my-repo',
        ]],
      });
      test.deepEqual(stack.resolve(repo.repositoryName), 'my-repo');

      //local name resolution should use stack region
      test.deepEqual(stack.resolve(repo.repositoryCloneUrlHttp), {
        'Fn::Join': [
          '',
          [
            'https://git-codecommit.',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
            '/v1/repos/my-repo',
          ],
        ],
      });

      test.deepEqual(stack.resolve(repo.repositoryCloneUrlGrc), {
        'Fn::Join': [
          '',
          [
            'codecommit::',
            { Ref: 'AWS::Region' },
            '://my-repo',
          ],
        ],
      });

      test.done();
    },

    'grant push'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const repository = new Repository(stack, 'Repo', {
        repositoryName: 'repo-name',
      });
      const role = new Role(stack, 'Role', {
        assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      });

      // WHEN
      repository.grantPullPush(role);

      // THEN
      expect(stack).to(haveResource('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'codecommit:GitPull',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'Repo02AC86CF',
                  'Arn',
                ],
              },
            },
            {
              Action: 'codecommit:GitPush',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'Repo02AC86CF',
                  'Arn',
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
      }));

      test.done();
    },

    'HTTPS (GRC) clone URL'(test: Test) {
      const stack = new Stack();

      const repository = new Repository(stack, 'Repository', {
        repositoryName: 'my-repo',
      });

      test.deepEqual(stack.resolve(repository.repositoryCloneUrlGrc), {
        'Fn::Join': [
          '',
          [
            'codecommit::',
            { Ref: 'AWS::Region' },
            '://',
            { 'Fn::GetAtt': ['Repository22E53BBD', 'Name'] },
          ],
        ],
      });

      test.done();
    },
  },
};
