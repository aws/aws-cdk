import { App, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { Repository, RepositoryProps } from '../lib';

export = {
  'default properties': {
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
    }
  }
};

class TestApp {
  private readonly app = new App();
  // tslint:disable-next-line:member-ordering
  public readonly stack: Stack = new Stack(this.app, 'MyStack');

  public synthesizeTemplate() {
    return this.app.synthesizeStack(this.stack.name).template;
  }
}
