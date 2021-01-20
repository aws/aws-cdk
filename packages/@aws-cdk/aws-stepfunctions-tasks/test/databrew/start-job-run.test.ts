import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { DataBrewStartJobRun } from '../../lib/databrew/start-job-run';

describe('Start Job Run', () => {

  test('default settings', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new DataBrewStartJobRun(stack, 'JobRun', {
      name: 'jobName',
    });

    // THEN
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
            ':states:::databrew:startJobRun',
          ],
        ],
      },
      End: true,
      Parameters: {
        Name: 'jobName',
      },
    });
  });

  test('create job with input from task', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new DataBrewStartJobRun(stack, 'JobRun', {
      name: sfn.JsonPath.stringAt('$.Name'),
    });

    // THEN
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
            ':states:::databrew:startJobRun',
          ],
        ],
      },
      End: true,
      Parameters: {
        'Name.$': '$.Name',
      },
    });
  });

  test('sync integrationPattern', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new DataBrewStartJobRun(stack, 'JobRun', {
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
      name: 'jobName',
    });

    // THEN
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
            ':states:::databrew:startJobRun.sync',
          ],
        ],
      },
      End: true,
      Parameters: {
        Name: 'jobName',
      },
    });
  });
});

