import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/core');
import tasks = require('../lib');

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
        instanceFleetConfiguration: sfn.TaskInput.fromObject({
          TargetOnDemandCapacity: 2
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
          ':states:::elasticmapreduce:modifyInstanceFleetByName',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      InstanceFleetName: 'InstanceFleetName',
      InstanceFleet: {
        TargetOnDemandCapacity: 2
      }
    },
  });
});

test('Modify an InstanceFleet with ClusterId from payload and static InstanceFleetName and InstanceFleetConfiguration', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrModifyInstanceFleetByName({
      clusterId: sfn.TaskInput.fromDataAt('$.ClusterId').value,
      instanceFleetName: 'InstanceFleetName',
      instanceFleetConfiguration: sfn.TaskInput.fromObject({
        TargetOnDemandCapacity: 2
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
          ':states:::elasticmapreduce:modifyInstanceFleetByName',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId.$': '$.ClusterId',
      'InstanceFleetName': 'InstanceFleetName',
      'InstanceFleet': {
        TargetOnDemandCapacity: 2
      }
    },
  });
});

test('Modify an InstanceFleet with static ClusterId and InstanceFleetConfigurateion and InstanceFleetName from payload', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrModifyInstanceFleetByName({
      clusterId: 'ClusterId',
      instanceFleetName: sfn.TaskInput.fromDataAt('$.InstanceFleetName').value,
      instanceFleetConfiguration: sfn.TaskInput.fromObject({
        TargetOnDemandCapacity: 2
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
          ':states:::elasticmapreduce:modifyInstanceFleetByName',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId': 'ClusterId',
      'InstanceFleetName.$': '$.InstanceFleetName',
      'InstanceFleet': {
        TargetOnDemandCapacity: 2
      }
    },
  });
});

test('Modify an InstanceFleet with static ClusterId and InstanceFleetName and InstanceFleetConfigurateion from payload', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.EmrModifyInstanceFleetByName({
      clusterId: 'ClusterId',
      instanceFleetName: 'InstanceFleetName',
      instanceFleetConfiguration: sfn.TaskInput.fromDataAt('$.InstanceFleetConfiguration')
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
          ':states:::elasticmapreduce:modifyInstanceFleetByName',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId': 'ClusterId',
      'InstanceFleetName': 'InstanceFleetName',
      'InstanceFleet.$': '$.InstanceFleetConfiguration'
    },
  });
});
