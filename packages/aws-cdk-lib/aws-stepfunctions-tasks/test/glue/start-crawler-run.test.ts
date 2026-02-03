import { Template } from '../../../assertions';
import * as sfn from '../../../aws-stepfunctions';
import { App, Stack } from '../../../core';
import { GlueStartCrawlerRun } from '../../lib/glue/start-crawler-run';

const crawlerName = 'GlueCrawler';
let stack: Stack;
beforeEach(() => {
  const app = new App();
  stack = new Stack(app);
});

test('Invoke glue crawler with crawler name', () => {
  const task = new GlueStartCrawlerRun(stack, 'Task', {
    crawlerName,
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::aws-sdk:glue:startCrawler',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: crawlerName,
    },
  });

  const template = Template.fromStack(stack);
  expect(template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'glue:StartCrawler',
            'glue:GetCrawler',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':glue:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                `:crawler/${crawlerName}`,
              ],
            ],
          },
        },
      ],
    },
  }));
});

test('Invoke glue crawler with crawler name - using JSONata', () => {
  const task = GlueStartCrawlerRun.jsonata(stack, 'Task', {
    crawlerName,
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    QueryLanguage: 'JSONata',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::aws-sdk:glue:startCrawler',
        ],
      ],
    },
    End: true,
    Arguments: {
      Name: crawlerName,
    },
  });

  const template = Template.fromStack(stack);
  expect(template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'glue:StartCrawler',
            'glue:GetCrawler',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':glue:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                `:crawler/${crawlerName}`,
              ],
            ],
          },
        },
      ],
    },
  }));
});
