import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { ServerlessCluster, DatabaseClusterEngine, ParameterGroup, Credentials } from '../lib';

nodeunitShim({
  'can create a Serverless Cluster using an existing secret from secretmanager'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const existingSecret = secretsmanager.Secret.fromSecretName(stack, 'DBSecret', 'myDBLoginInfo');

    // WHEN
    new ServerlessCluster(stack, 'ServerlessDatabase', {
      engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
      vpc,
      credentials: Credentials.fromSecret(existingSecret),
      parameterGroup: ParameterGroup.fromParameterGroupName(stack, 'ParameterGroup', 'default.aurora-postgresql10'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      Properties: {
        Engine: 'aurora-postgresql',
        DBClusterParameterGroupName: 'default.aurora-postgresql10',
        DBSubnetGroupName: {
          Ref: 'ServerlessDatabaseSubnets5643CD76',
        },
        EngineMode: 'serverless',
        MasterUsername: '{{resolve:secretsmanager:myDBLoginInfo:SecretString:username::}}',
        MasterUserPassword: '{{resolve:secretsmanager:myDBLoginInfo:SecretString:password::}}',
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
    }, ResourcePart.CompleteDefinition));

    test.done();
  },
});

function testStack() {
  const stack = new cdk.Stack(undefined, undefined, { env: { account: '12345', region: 'us-test-1' } });
  stack.node.setContext('availability-zones:12345:us-test-1', ['us-test-1a', 'us-test-1b']);
  return stack;
}
