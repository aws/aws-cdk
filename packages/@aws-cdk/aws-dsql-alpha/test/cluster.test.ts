import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { Cluster } from '../lib';

describe('Aurora DSQL Cluster', () => {
  test('cluster with all attributes', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new Cluster(stack, 'Cluster', {
      clusterName: 'my-dsql-cluster',
      deletionProtection: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::DSQL::Cluster', {
      Properties: {
        DeletionProtectionEnabled: true,
        Tags: [{
          Key: 'Name',
          Value: 'my-dsql-cluster',
        }],
      },
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
  });

  test('cluster with no attributes', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new Cluster(stack, 'Cluster');

    // THEN
    Template.fromStack(stack).hasResource('AWS::DSQL::Cluster', {});
  });

  test('cluster removalPolicy defaults to retain', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new Cluster(stack, 'Cluster');

    // THEN
    Template.fromStack(stack).hasResource('AWS::DSQL::Cluster', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
  });

  test('can set cluster removalPolicy', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new Cluster(stack, 'Cluster', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::DSQL::Cluster', {
      DeletionPolicy: 'Delete',
      UpdateReplacePolicy: 'Delete',
    });
  });

  test('cluster deletionProtection defaults to true when removalPolicy is retain', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new Cluster(stack, 'Cluster', {
      clusterName: 'my-dsql-cluster',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::DSQL::Cluster', {
      Properties: {
        DeletionProtectionEnabled: true,
      },
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
  });
});

describe('Aurora DSQL Cluster - Imports', () => {
  test('imported cluster has supplied attributes', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    const cluster = Cluster.fromClusterAttributes(stack, 'Database', {
      clusterIdentifier: 'identifier',
      clusterName: 'my-dsql-cluster',
      vpcEndpointServiceName: 'vpce',
    });

    // THEN
    expect(cluster.clusterIdentifier).toEqual('identifier');
    expect(cluster.clusterName).toEqual('my-dsql-cluster');
    expect(cluster.vpcEndpointServiceName).toEqual('vpce');
    expect(cluster.clusterArn).toEqual(stack.formatArn({
      service: 'dsql',
      resource: 'cluster',
      resourceName: 'identifier',
    }));
  });
});

describe('Aurora DSQL Cluster - Grants', () => {
  test('grant', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    const role = new iam.Role(stack, 'DBRole', {
      assumedBy: new iam.AccountPrincipal(stack.account),
    });
    const cluster = new Cluster(stack, 'Cluster', {
      clusterName: 'my-dsql-cluster',
      deletionProtection: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    cluster.grant(role, 'dsql:DbConnect');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Effect: 'Allow',
          Action: 'dsql:DbConnect',
          Resource: {
            'Fn::Join': [
              '', [
                'arn:', {
                  Ref: 'AWS::Partition',
                },
                ':dsql:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':cluster/',
                {
                  Ref: 'ClusterEB0386A7',
                },
              ],
            ],
          },
        }],
        Version: '2012-10-17',
      },
    });
  });

  test('grantConnect', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    const role = new iam.Role(stack, 'DBRole', {
      assumedBy: new iam.AccountPrincipal(stack.account),
    });
    const cluster = new Cluster(stack, 'Cluster', {
      clusterName: 'my-dsql-cluster',
      deletionProtection: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    cluster.grantConnect(role);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Effect: 'Allow',
          Action: 'dsql:DbConnect',
          Resource: {
            'Fn::Join': [
              '', [
                'arn:', {
                  Ref: 'AWS::Partition',
                },
                ':dsql:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':cluster/',
                {
                  Ref: 'ClusterEB0386A7',
                },
              ],
            ],
          },
        }],
        Version: '2012-10-17',
      },
    });
  });

  test('grantConnectAdmin', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    const role = new iam.Role(stack, 'DBRole', {
      assumedBy: new iam.AccountPrincipal(stack.account),
    });
    const cluster = new Cluster(stack, 'Cluster', {
      clusterName: 'my-dsql-cluster',
      deletionProtection: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    cluster.grantConnectAdmin(role);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Effect: 'Allow',
          Action: 'dsql:DbConnectAdmin',
          Resource: {
            'Fn::Join': [
              '', [
                'arn:', {
                  Ref: 'AWS::Partition',
                },
                ':dsql:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':cluster/',
                {
                  Ref: 'ClusterEB0386A7',
                },
              ],
            ],
          },
        }],
        Version: '2012-10-17',
      },
    });
  });
});

function testStack() {
  const stack = new cdk.Stack(undefined, undefined, { env: { account: '12345', region: 'us-test-1' } });
  stack.node.setContext('availability-zones:12345:us-test-1', ['us-test-1a', 'us-test-1b']);
  return stack;
}
