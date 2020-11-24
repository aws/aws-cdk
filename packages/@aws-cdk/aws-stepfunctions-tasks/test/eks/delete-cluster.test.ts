import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { EksDeleteCluster } from '../../lib/eks/delete-cluster';

describe('Delete a Cluster', () => {

  test('default settings', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new EksDeleteCluster(stack, 'Delete Cluster', {
      name: 'clusterName',
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
            ':states:::eks:deleteCluster',
          ],
        ],
      },
      End: true,
      Parameters: {
        Name: 'clusterName',
      },
    });
  });

  test('deleteCluster.sync', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new EksDeleteCluster(stack, 'Delete Cluster', {
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
      name: 'clusterName',
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
            ':states:::eks:deleteCluster.sync',
          ],
        ],
      },
      End: true,
      Parameters: {
        Name: 'clusterName',
      },
    });
  });
});
