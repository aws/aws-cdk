import '@aws-cdk/assert/jest';
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
  const task = new tasks.EmrModifyInstanceFleetByName(stack, 'Task', {
    clusterId: 'ClusterId',
    instanceFleetName: 'InstanceFleetName',
    targetOnDemandCapacity: 2,
    targetSpotCapacity: 0,
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

test('task policies are generated', () => {
  // WHEN
  const task = new tasks.EmrModifyInstanceFleetByName(stack, 'Task', {
    clusterId: 'ClusterId',
    instanceFleetName: 'InstanceFleetName',
    targetOnDemandCapacity: 2,
    targetSpotCapacity: 0,
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'elasticmapreduce:ModifyInstanceFleet',
            'elasticmapreduce:ListInstanceFleets',
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
                ':elasticmapreduce:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':cluster/*',
              ],
            ],
          },
        },
      ],
    },
  });
});

test('Modify an InstanceFleet with ClusterId from payload and static InstanceFleetName and InstanceFleetConfiguration', () => {
  // WHEN
  const task = new tasks.EmrModifyInstanceFleetByName(stack, 'Task', {
    clusterId: sfn.JsonPath.stringAt('$.ClusterId'),
    instanceFleetName: 'InstanceFleetName',
    targetOnDemandCapacity: 2,
    targetSpotCapacity: 0,
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
  const task = new tasks.EmrModifyInstanceFleetByName(stack, 'Task', {
    clusterId: 'ClusterId',
    instanceFleetName: sfn.JsonPath.stringAt('$.InstanceFleetName'),
    targetOnDemandCapacity: 2,
    targetSpotCapacity: 0,
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
  const task = new tasks.EmrModifyInstanceFleetByName(stack, 'Task', {
    clusterId: 'ClusterId',
    instanceFleetName: 'InstanceFleetName',
    targetOnDemandCapacity: sfn.JsonPath.numberAt('$.TargetOnDemandCapacity'),
    targetSpotCapacity: sfn.JsonPath.numberAt('$.TargetSpotCapacity'),
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
