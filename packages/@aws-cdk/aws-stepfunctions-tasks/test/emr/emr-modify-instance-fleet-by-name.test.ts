import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('Modify an InstanceFleet with static ClusterId, InstanceFleetName, and InstanceFleetConfiguration', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrModifyInstanceFleetByName({
      clusterId: 'ClusterId',
      instanceFleetName: 'InstanceFleetName',
      targetOnDemandCapacity: 2,
      targetSpotCapacity: 0,
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
          ':states:::elasticmapreduce:modifyInstanceFleetByName',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      InstanceFleetName: 'InstanceFleetName',
      InstanceFleet: {
        TargetOnDemandCapacity: 2,
        TargetSpotCapacity: 0,
      },
    },
  });
});

test('Modify an InstanceFleet with ClusterId from payload and static InstanceFleetName and InstanceFleetConfiguration', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrModifyInstanceFleetByName({
      clusterId: sfn.Data.stringAt('$.ClusterId'),
      instanceFleetName: 'InstanceFleetName',
      targetOnDemandCapacity: 2,
      targetSpotCapacity: 0,
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
          ':states:::elasticmapreduce:modifyInstanceFleetByName',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId.$': '$.ClusterId',
      'InstanceFleetName': 'InstanceFleetName',
      'InstanceFleet': {
        TargetOnDemandCapacity: 2,
        TargetSpotCapacity: 0,
      },
    },
  });
});

test('Modify an InstanceFleet with static ClusterId and InstanceFleetConfigurateion and InstanceFleetName from payload', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrModifyInstanceFleetByName({
      clusterId: 'ClusterId',
      instanceFleetName: sfn.Data.stringAt('$.InstanceFleetName'),
      targetOnDemandCapacity: 2,
      targetSpotCapacity: 0,
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
          ':states:::elasticmapreduce:modifyInstanceFleetByName',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId': 'ClusterId',
      'InstanceFleetName.$': '$.InstanceFleetName',
      'InstanceFleet': {
        TargetOnDemandCapacity: 2,
        TargetSpotCapacity: 0,
      },
    },
  });
});

test('Modify an InstanceFleet with static ClusterId and InstanceFleetName and Target Capacities from payload', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrModifyInstanceFleetByName({
      clusterId: 'ClusterId',
      instanceFleetName: 'InstanceFleetName',
      targetOnDemandCapacity: sfn.Data.numberAt('$.TargetOnDemandCapacity'),
      targetSpotCapacity: sfn.Data.numberAt('$.TargetSpotCapacity'),
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
          ':states:::elasticmapreduce:modifyInstanceFleetByName',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      InstanceFleetName: 'InstanceFleetName',
      InstanceFleet: {
        'TargetOnDemandCapacity.$': '$.TargetOnDemandCapacity',
        'TargetSpotCapacity.$': '$.TargetSpotCapacity',
      },
    },
  });
});
