import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/core');
import tasks = require('../lib');
import { ActionOnFailure } from '../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('Add Step with static ClusterId and Step configuration', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrAddStep({
        clusterId: 'ClusterId',
        name: 'StepName',
        jar: 'Jar',
        actionOnFailure: ActionOnFailure.CONTINUE,
        integrationPattern: sfn.ServiceIntegrationPattern.SYNC
      })
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
          ':states:::elasticmapreduce:addStep.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      Step: {
        Name: 'StepName',
        ActionOnFailure: 'CONTINUE',
        HadoopJarStep: {
          Jar: 'Jar'
        }
      }
    },
  });
});

test('Terminate cluster with ClusterId from payload and static Step configuration', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrAddStep({
        clusterId: sfn.Data.stringAt('$.ClusterId'),
        name: 'StepName',
        jar: 'Jar',
        actionOnFailure: ActionOnFailure.CONTINUE,
        integrationPattern: sfn.ServiceIntegrationPattern.SYNC
      })
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
          ':states:::elasticmapreduce:addStep.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId.$': '$.ClusterId',
      'Step': {
        Name: 'StepName',
        ActionOnFailure: 'CONTINUE',
        HadoopJarStep: {
          Jar: 'Jar'
        }
      }
    },
  });
});

test('Add Step with static ClusterId and Step Name from payload', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrAddStep({
        clusterId: 'ClusterId',
        name: sfn.Data.stringAt('$.StepName'),
        jar: 'Jar',
        actionOnFailure: ActionOnFailure.CONTINUE,
        integrationPattern: sfn.ServiceIntegrationPattern.SYNC
      })
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
          ':states:::elasticmapreduce:addStep.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      Step: {
        'Name.$': '$.StepName',
        'ActionOnFailure': 'CONTINUE',
        'HadoopJarStep': {
          Jar: 'Jar'
        }
      }
    },
  });
});

test('Add Step with static ClusterId and Step configuration and FIRE_AND_FORGET integrationPattern', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrAddStep({
        clusterId: 'ClusterId',
        name: 'StepName',
        jar: 'Jar',
        actionOnFailure: ActionOnFailure.CONTINUE,
        integrationPattern: sfn.ServiceIntegrationPattern.FIRE_AND_FORGET
      })
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
          ':states:::elasticmapreduce:addStep',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      Step: {
        Name: 'StepName',
        ActionOnFailure: 'CONTINUE',
        HadoopJarStep: {
          Jar: 'Jar'
        }
      }
    },
  });
});

test('Add Step with static ClusterId and Step configuration with TERMINATE_CLUSTER', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrAddStep({
        clusterId: 'ClusterId',
        name: 'StepName',
        jar: 'Jar',
        actionOnFailure: ActionOnFailure.TERMINATE_CLUSTER,
        integrationPattern: sfn.ServiceIntegrationPattern.SYNC
      })
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
          ':states:::elasticmapreduce:addStep.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      Step: {
        Name: 'StepName',
        ActionOnFailure: 'TERMINATE_CLUSTER',
        HadoopJarStep: {
          Jar: 'Jar'
        }
      }
    },
  });
});

test('Add Step with static ClusterId and Step configuration with Args', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrAddStep({
        clusterId: 'ClusterId',
        name: 'StepName',
        jar: 'Jar',
        args: ['Arg1'],
        actionOnFailure: ActionOnFailure.CONTINUE,
        integrationPattern: sfn.ServiceIntegrationPattern.SYNC
      })
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
          ':states:::elasticmapreduce:addStep.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      Step: {
        Name: 'StepName',
        ActionOnFailure: 'CONTINUE',
        HadoopJarStep: {
          Jar: 'Jar',
          Args: ['Arg1']
        }
      }
    },
  });
});

test('Add Step with static ClusterId and Step configuration with Properties', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrAddStep({
        clusterId: 'ClusterId',
        name: 'StepName',
        jar: 'Jar',
        properties: {
          PropertyKey: 'PropertyValue'
        },
        actionOnFailure: ActionOnFailure.CONTINUE,
        integrationPattern: sfn.ServiceIntegrationPattern.SYNC
      })
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
          ':states:::elasticmapreduce:addStep.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      Step: {
        Name: 'StepName',
        ActionOnFailure: 'CONTINUE',
        HadoopJarStep: {
          Jar: 'Jar',
          Properties: [{
            Key: 'PropertyKey',
            Value: 'PropertyValue'
          }]
        }
      }
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.EmrAddStep({
        clusterId: 'ClusterId',
        name: 'StepName',
        jar: 'Jar',
        actionOnFailure: ActionOnFailure.CONTINUE,
        integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN
      })
    });
  }).toThrow(/Invalid Service Integration Pattern: WAIT_FOR_TASK_TOKEN is not supported to call AddStep./i);
});
