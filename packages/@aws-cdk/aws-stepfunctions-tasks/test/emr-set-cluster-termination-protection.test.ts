import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/core');
import tasks = require('../lib');

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('Set termination protection with static ClusterId and TerminationProtected', () => {
  // WHEN
  const cc = new sfn.Task(stack, 'CreateCluster', {
      task: new tasks.EmrSetClusterTerminationProtection({
        clusterId: 'ClusterId',
        terminationProtected: false
      })
    });

  // THEN
  expect(stack.resolve(cc.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      "Fn::Join": [
        "",
        [
          "arn:",
          {
            Ref: "AWS::Partition",
          },
          ":states:::elasticmapreduce:setClusterTerminationProtection",
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      TerminationProtected: false
    },
  });
});

test('Set termination protection with static ClusterId and TerminationProtected from payload', () => {
  // WHEN
  const cc = new sfn.Task(stack, 'CreateCluster', {
      task: new tasks.EmrSetClusterTerminationProtection({
        clusterId: 'ClusterId',
        terminationProtected: sfn.TaskInput.fromDataAt('$.TerminationProtected').value
      })
    });

  // THEN
  expect(stack.resolve(cc.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      "Fn::Join": [
        "",
        [
          "arn:",
          {
            Ref: "AWS::Partition",
          },
          ":states:::elasticmapreduce:setClusterTerminationProtection",
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId': 'ClusterId',
      'TerminationProtected.$': '$.TerminationProtected'
    },
  });
});

test('Set termination protection with ClusterId from payload and static TerminationProtected', () => {
  // WHEN
  const cc = new sfn.Task(stack, 'CreateCluster', {
      task: new tasks.EmrSetClusterTerminationProtection({
        clusterId: sfn.TaskInput.fromDataAt('$.ClusterId').value,
        terminationProtected: false
      })
    });

  // THEN
  expect(stack.resolve(cc.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      "Fn::Join": [
        "",
        [
          "arn:",
          {
            Ref: "AWS::Partition",
          },
          ":states:::elasticmapreduce:setClusterTerminationProtection",
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId.$': '$.ClusterId',
      'TerminationProtected': false
    },
  });
});
