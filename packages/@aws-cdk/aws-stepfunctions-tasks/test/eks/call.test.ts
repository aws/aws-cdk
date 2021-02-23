import * as eks from '@aws-cdk/aws-eks';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { EksCall, HttpMethods } from '../../lib/eks/call';

let stack: Stack;
let cluster: eks.Cluster;

beforeEach(() => {
  //GIVEN
  stack = new Stack();
  cluster = new eks.Cluster(stack, 'Cluster', {
    version: eks.KubernetesVersion.V1_18,
    clusterName: 'eksCluster',
  });
});

test('Call an EKS endpoint', () => {
  // WHEN
  const task = new EksCall(stack, 'Call', {
    cluster: cluster,
    httpMethod: HttpMethods.GET,
    httpPath: 'path',
    requestBody: sfn.TaskInput.fromObject({
      Body: 'requestBody',
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
      ClusterName: {
        Ref: 'Cluster9EE0221C',
      },
      CertificateAuthority: {
        'Fn::GetAtt': [
          'Cluster9EE0221C',
          'CertificateAuthorityData',
        ],
      },
      Endpoint: {
        'Fn::GetAtt': [
          'Cluster9EE0221C',
          'Endpoint',
        ],
      },
      Method: 'GET',
      Path: 'path',
      RequestBody: {
        Body: 'requestBody',
      },
    },
  });
});

test('Call an EKS endpoint with requestBody as a string', () => {
  // WHEN
  const task = new EksCall(stack, 'Call', {
    cluster: cluster,
    httpMethod: HttpMethods.GET,
    httpPath: 'path',
    requestBody: sfn.TaskInput.fromText('requestBody'),
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
      ClusterName: {
        Ref: 'Cluster9EE0221C',
      },
      CertificateAuthority: {
        'Fn::GetAtt': [
          'Cluster9EE0221C',
          'CertificateAuthorityData',
        ],
      },
      Endpoint: {
        'Fn::GetAtt': [
          'Cluster9EE0221C',
          'Endpoint',
        ],
      },
      Method: 'GET',
      Path: 'path',
      RequestBody: 'requestBody',
    },
  });
});

test('Call an EKS endpoint with requestBody supply through path', () => {
  // WHEN
  const task = new EksCall(stack, 'Call', {
    cluster: cluster,
    httpMethod: HttpMethods.GET,
    httpPath: 'path',
    requestBody: sfn.TaskInput.fromJsonPathAt('$.Request.Body'),
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
      'ClusterName': {
        Ref: 'Cluster9EE0221C',
      },
      'CertificateAuthority': {
        'Fn::GetAtt': [
          'Cluster9EE0221C',
          'CertificateAuthorityData',
        ],
      },
      'Endpoint': {
        'Fn::GetAtt': [
          'Cluster9EE0221C',
          'Endpoint',
        ],
      },
      'Method': 'GET',
      'Path': 'path',
      'RequestBody.$': '$.Request.Body',
    },
  });
});

test('Task throws if RUN_JOB is supplied as service integration pattern', () => {
  expect(() => {
    new EksCall(stack, 'Call', {
      cluster: cluster,
      httpMethod: HttpMethods.GET,
      httpPath: 'path',
      requestBody: sfn.TaskInput.fromObject({
        RequestBody: 'requestBody',
      }),
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    });
  }).toThrow(
    /Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: RUN_JOB/,
  );
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new EksCall(stack, 'Call', {
      cluster: cluster,
      httpMethod: HttpMethods.GET,
      httpPath: 'path',
      requestBody: sfn.TaskInput.fromObject({
        RequestBody: 'requestBody',
      }),
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });
  }).toThrow(
    /Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: WAIT_FOR_TASK_TOKEN/,
  );
});

test('Task throws if cluster supplied does not have clusterEndpoint configured', () => {
  const importedCluster = eks.Cluster.fromClusterAttributes(stack, 'InvalidCluster', {
    clusterName: 'importedCluster',
    clusterCertificateAuthorityData: 'clusterCertificateAuthorityData',
  });
  expect(() => {
    new EksCall(stack, 'Call', {
      cluster: importedCluster,
      httpMethod: HttpMethods.GET,
      httpPath: 'path',
      requestBody: sfn.TaskInput.fromObject({
        RequestBody: 'requestBody',
      }),
    });
  }).toThrow(
    /The "clusterEndpoint" property must be specified when using an imported Cluster./,
  );
});

test('Task throws if cluster supplied does not have clusterCertificateAuthorityData configured', () => {
  const importedCluster = eks.Cluster.fromClusterAttributes(stack, 'InvalidCluster', {
    clusterName: 'importedCluster',
    clusterEndpoint: 'clusterEndpoint',
  });
  expect(() => {
    new EksCall(stack, 'Call', {
      cluster: importedCluster,
      httpMethod: HttpMethods.GET,
      httpPath: 'path',
      requestBody: sfn.TaskInput.fromObject({
        RequestBody: 'requestBody',
      }),
    });
  }).toThrow(
    /The "clusterCertificateAuthorityData" property must be specified when using an imported Cluster./,
  );
});