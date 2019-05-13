import { App, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { Repository, RepositoryProps } from '../lib';

export = {
  'CodeCommit Repositories': {
    'add an SNS trigger to repository'(test: Test) {
      const app = new TestApp();

      const props: RepositoryProps = {
        repositoryName:  'MyRepository'
      };

      const snsArn = 'arn:aws:sns:*:123456789012:my_topic';

      new Repository(app.stack, 'MyRepository', props).notify(snsArn);
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
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
              Name: "MyStack/MyRepository/arn:aws:sns:*:123456789012:my_topic"
              }
            ]
            }
          }
          }
      });

      test.done();
    },

    'fails when triggers have duplicate names'(test: Test) {
      const app = new TestApp();

      const props = { repositoryName: 'MyRepository' };
      const myRepository = new Repository(app.stack, 'MyRepository', props)
      .notify('myTrigger');

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
      test.deepEqual(repo.node.resolve(repo.repositoryArn), repositoryArn);
      test.deepEqual(repo.node.resolve(repo.repositoryName), 'my-repo');

      test.done();
    },

    'can be imported using just a Repository name (the ARN is deduced)'(test: Test) {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const repo = Repository.fromRepositoryName(stack, 'ImportedRepo', 'my-repo');

      // THEN
      test.deepEqual(repo.node.resolve(repo.repositoryArn), {
        'Fn::Join': [ '', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':codecommit:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':my-repo'
        ]],
      });
      test.deepEqual(repo.node.resolve(repo.repositoryName), 'my-repo');

      test.done();
    },
  },
};

class TestApp {
  private readonly app = new App();
  // tslint:disable-next-line:member-ordering
  public readonly stack: Stack = new Stack(this.app, 'MyStack');

  public synthesizeTemplate() {
    return this.app.synthesizeStack(this.stack.name).template;
  }
}
