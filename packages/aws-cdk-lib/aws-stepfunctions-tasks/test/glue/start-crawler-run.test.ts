import * as sfn from '../../../aws-stepfunctions';
import { App, Stack } from '../../../core';
import { GlueStartCrawlerRun } from '../../lib/glue/start-crawler-run';

const crawlerName = 'GlueCrawler';
let stack: Stack;
beforeEach(() => {
  const app = new App();
  stack = new Stack(app);
});

test('Invoke glue job with job ARN', () => {
  const task = new GlueStartCrawlerRun(stack, 'Task', {
    crawlerName,
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: 'arn:aws:states:::aws-sdk:glue:startCrawler',
    End: true,
    Parameters: {
      Name: crawlerName,
    },
  });
});