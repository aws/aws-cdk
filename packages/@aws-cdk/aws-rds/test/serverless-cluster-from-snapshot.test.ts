import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { ClusterSnapshotCredentials, DatabaseClusterEngine, ServerlessClusterFromSnapshot } from '../lib';

describe('serverless cluster from snapshot', () => {
  test('create a serverless cluster from a snapshot', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new ServerlessClusterFromSnapshot(stack, 'ServerlessDatabase', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      snapshotIdentifier: 'my-snapshot',
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::RDS::DBCluster', {
      Properties: {
        Engine: 'aurora-mysql',
        DBClusterParameterGroupName: 'default.aurora-mysql5.7',
        DBSubnetGroupName: {
          Ref: 'ServerlessDatabaseSubnets5643CD76',
        },
        EngineMode: 'serverless',
        SnapshotIdentifier: 'my-snapshot',
        StorageEncrypted: true,
        VpcSecurityGroupIds: [
          {
            'Fn::GetAtt': [
              'ServerlessDatabaseSecurityGroupB00D8C0F',
              'GroupId',
            ],
          },
        ],
      },
      DeletionPolicy: 'Snapshot',
      UpdateReplacePolicy: 'Snapshot',
    });
  });

  test('can create new secret for snapshot using password from an existing SecretValue', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const secretValue = cdk.SecretValue.secretsManager('mysecretid');

    // WHEN
    new ServerlessClusterFromSnapshot(stack, 'ServerlessDatabase', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      snapshotIdentifier: 'mySnapshot',
      snapshotCredentials: ClusterSnapshotCredentials.fromPassword('admin', secretValue),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      SecretString: '{{resolve:secretsmanager:mysecretid:SecretString:::}}',
    });
  });
});

function testStack(): cdk.Stack {
  const stack = new cdk.Stack(undefined, undefined, { env: { account: '12345', region: 'us-test-1' } });
  stack.node.setContext('availability-zones:12345:us-test-1', ['us-test-1a', 'us-test-1b']);
  return stack;
}
