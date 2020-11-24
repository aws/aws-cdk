import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { EksCreateCluster, EncryptionConfig } from '../../lib/eks/create-cluster';

describe('Create a Cluster', () => {

  test('default settings', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const encryptoinConfiguration : EncryptionConfig = {
      resources: ['resources'],
      provider: {
        keyArn: 'keyArn',
      },
    };

    // WHEN
    const task = new EksCreateCluster(stack, 'Create Cluster', {
      name: 'clusterName',
      role: 'roleArn',
      resourcesVpcConfig: {
        subnetIds: ['subnetId1'],
        securityGroupIds: ['securityGroupId1'],
        endpointPrivateAccess: true,
        endpointPublicAccess: true,
        publicAccessCidrs: ['publicAccessCidr1'],
      },
      clientRequestToken: 'clientRequestToken',
      encryptionConfig: [encryptoinConfiguration],
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
            ':states:::eks:createCluster',
          ],
        ],
      },
      End: true,
      Parameters: {
        Name: 'clusterName',
        RoleArn: 'roleArn',
        ResourcesVpcConfig: {
          SubnetIds: ['subnetId1'],
          SecurityGroupIds: ['securityGroupId1'],
          EndpointPrivateAccess: true,
          EndpointPublicAccess: true,
          PublicAccessCidrs: ['publicAccessCidr1'],
        },
        ClientRequestToken: 'clientRequestToken',
        EncryptionConfig: [encryptoinConfiguration],
      },
    });
  });

  test('createCluster.sync', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const encryptoinConfiguration : EncryptionConfig = {
      resources: ['resources'],
      provider: {
        keyArn: 'keyArn',
      },
    };

    // WHEN
    const task = new EksCreateCluster(stack, 'Create Cluster', {
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
      name: 'clusterName',
      role: 'roleArn',
      resourcesVpcConfig: {
        subnetIds: ['subnetId1'],
        securityGroupIds: ['securityGroupId1'],
        endpointPrivateAccess: true,
        endpointPublicAccess: true,
        publicAccessCidrs: ['publicAccessCidr1'],
      },
      clientRequestToken: 'clientRequestToken',
      encryptionConfig: [encryptoinConfiguration],
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
            ':states:::eks:createCluster.sync',
          ],
        ],
      },
      End: true,
      Parameters: {
        Name: 'clusterName',
        RoleArn: 'roleArn',
        ResourcesVpcConfig: {
          SubnetIds: ['subnetId1'],
          SecurityGroupIds: ['securityGroupId1'],
          EndpointPrivateAccess: true,
          EndpointPublicAccess: true,
          PublicAccessCidrs: ['publicAccessCidr1'],
        },
        ClientRequestToken: 'clientRequestToken',
        EncryptionConfig: [encryptoinConfiguration],
      },
    });
  });
});
