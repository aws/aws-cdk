import '@aws-cdk/assert/jest';
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
  const task = new tasks.EmrModifyInstanceGroupByName(stack, 'Task', {
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

test('task policies are generated', () => {
  // WHEN
  const task = new tasks.EmrModifyInstanceGroupByName(stack, 'Task', {
    clusterId: 'ClusterId',
    instanceGroupName: 'InstanceGroupName',
    instanceGroup: {
      configurations: [{
        classification: 'Classification',
        properties: {
          Key: 'Value',
        },
      }],
    },
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
            'elasticmapreduce:ModifyInstanceGroups',
            'elasticmapreduce:ListInstanceGroups',
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

test('Modify an InstanceGroup with ClusterId from payload and static InstanceGroupName and InstanceGroupConfiguration', () => {
  // WHEN
  const task = new tasks.EmrModifyInstanceGroupByName(stack, 'Task', {
    clusterId: sfn.JsonPath.stringAt('$.ClusterId'),
    instanceGroupName: 'InstanceGroupName',
    instanceGroup: {
      instanceCount: 1,
    },
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
  const task = new tasks.EmrModifyInstanceGroupByName(stack, 'Task', {
    clusterId: 'ClusterId',
    instanceGroupName: sfn.JsonPath.stringAt('$.InstanceGroupName'),
    instanceGroup: {
      instanceCount: 1,
    },
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
  const task = new tasks.EmrModifyInstanceGroupByName(stack, 'Task', {
    clusterId: 'ClusterId',
    instanceGroupName: 'InstanceGroupName',
    instanceGroup: {
      instanceCount: sfn.JsonPath.numberAt('$.InstanceCount'),
    },
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
