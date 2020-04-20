import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('Modify an InstanceGroup with static ClusterId, InstanceGroupName, and InstanceGroup', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrModifyInstanceGroupByName({
      clusterId: 'ClusterId',
      instanceGroupName: 'InstanceGroupName',
      instanceGroup: {
        configurations: [{
          classification: 'Classification',
          properties: {
            Key: 'Value',
          },
        }],
        eC2InstanceIdsToTerminate: ['InstanceToTerminate'],
        instanceCount: 1,
        shrinkPolicy: {
          decommissionTimeout: cdk.Duration.seconds(1),
          instanceResizePolicy: {
            instanceTerminationTimeout: cdk.Duration.seconds(1),
            instancesToProtect: ['InstanceToProtect'],
            instancesToTerminate: ['InstanceToTerminate'],
          },
        },
      },
    }),
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
        Configurations: [{
          Classification: 'Classification',
          Properties: {
            Key: 'Value',
          },
        }],
        EC2InstanceIdsToTerminate: ['InstanceToTerminate'],
        InstanceCount: 1,
        ShrinkPolicy: {
          DecommissionTimeout: 1,
          InstanceResizePolicy: {
            InstanceTerminationTimeout: 1,
            InstancesToProtect: ['InstanceToProtect'],
            InstancesToTerminate: ['InstanceToTerminate'],
          },
        },
      },
    },
  });
});

test('Modify an InstanceGroup with ClusterId from payload and static InstanceGroupName and InstanceGroupConfiguration', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrModifyInstanceGroupByName({
      clusterId: sfn.Data.stringAt('$.ClusterId'),
      instanceGroupName: 'InstanceGroupName',
      instanceGroup: {
        instanceCount: 1,
      },
    }),
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
        InstanceCount: 1,
      },
    },
  });
});

test('Modify an InstanceGroup with static ClusterId and InstanceGroupConfigurateion and InstanceGroupName from payload', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrModifyInstanceGroupByName({
      clusterId: 'ClusterId',
      instanceGroupName: sfn.Data.stringAt('$.InstanceGroupName'),
      instanceGroup: {
        instanceCount: 1,
      },
    }),
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
        InstanceCount: 1,
      },
    },
  });
});

test('Modify an InstanceGroup with static ClusterId and InstanceGroupName and InstanceCount from payload', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrModifyInstanceGroupByName({
      clusterId: 'ClusterId',
      instanceGroupName: 'InstanceGroupName',
      instanceGroup: {
        instanceCount: sfn.Data.numberAt('$.InstanceCount'),
      },
    }),
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
        'InstanceCount.$': '$.InstanceCount',
      },
    },
  });
});
