import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { EksCall, MethodType } from '../../lib/eks/call';

describe('Call an EKS endpoint', () => {

  test('default settings', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new EksCall(stack, 'Call', {
      clusterName: 'clusterName',
      certificateAuthority: 'certificateAuthority',
      endpoint: 'endpoint',
      httpMethod: MethodType.GET,
      path: 'path',
      requestBody: sfn.TaskInput.fromObject({
        RequestBody: 'requestBody',
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
            ':states:::eks:call',
          ],
        ],
      },
      End: true,
      Parameters: {
        ClusterName: 'clusterName',
        CertificateAuthority: 'certificateAuthority',
        Endpoint: 'endpoint',
        Method: 'GET',
        Path: 'path',
        RequestBody: {
          type: 1,
          value: {
            RequestBody: 'requestBody',
          },
        },
      },
    });
  });
});