import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('Modify an InstanceGroup with static ClusterId, InstanceGroupName, and InstanceGroupConfiguration', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrModifyInstanceGroupByName({
        clusterId: 'ClusterId',
        instanceGroupName: 'InstanceGroupName',
        instanceGroupConfiguration: sfn.TaskInput.fromObject({
          InstanceCount: 2
        })
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
          ':states:::elasticmapreduce:modifyInstanceGroupByName',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      InstanceGroupName: 'InstanceGroupName',
      InstanceGroup: {
        InstanceCount: 2
      }
    },
  });
});

test('Modify an InstanceGroup with ClusterId from payload and static InstanceGroupName and InstanceGroupConfiguration', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrModifyInstanceGroupByName({
      clusterId: sfn.TaskInput.fromDataAt('$.ClusterId').value,
      instanceGroupName: 'InstanceGroupName',
      instanceGroupConfiguration: sfn.TaskInput.fromObject({
        InstanceCount: 2
      })
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
          ':states:::elasticmapreduce:modifyInstanceGroupByName',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId.$': '$.ClusterId',
      'InstanceGroupName': 'InstanceGroupName',
      'InstanceGroup': {
        InstanceCount: 2
      }
    },
  });
});

test('Modify an InstanceGroup with static ClusterId and InstanceGroupConfigurateion and InstanceGroupName from payload', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrModifyInstanceGroupByName({
      clusterId: 'ClusterId',
      instanceGroupName: sfn.TaskInput.fromDataAt('$.InstanceGroupName').value,
      instanceGroupConfiguration: sfn.TaskInput.fromObject({
        InstanceCount: 2
      })
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
          ':states:::elasticmapreduce:modifyInstanceGroupByName',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId': 'ClusterId',
      'InstanceGroupName.$': '$.InstanceGroupName',
      'InstanceGroup': {
        InstanceCount: 2
      }
    },
  });
});

test('Modify an InstanceGroup with static ClusterId and InstanceGroupName and InstanceGroupConfigurateion from payload', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrModifyInstanceGroupByName({
      clusterId: 'ClusterId',
      instanceGroupName: 'InstanceGroupName',
      instanceGroupConfiguration: sfn.TaskInput.fromDataAt('$.InstanceGroupConfiguration')
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
          ':states:::elasticmapreduce:modifyInstanceGroupByName',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId': 'ClusterId',
      'InstanceGroupName': 'InstanceGroupName',
      'InstanceGroup.$': '$.InstanceGroupConfiguration'
    },
  });
});
