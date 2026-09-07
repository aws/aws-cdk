import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
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

  test('cluster exposes endpoint attribute', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    const cluster = new Cluster(stack as any, 'Cluster');

    // THEN
    Template.fromStack(stack).hasResource('AWS::DSQL::Cluster', {});
    expect(stack.resolve(cluster.clusterEndpoint)).toEqual({
      'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'],
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
      clusterEndpoint: 'identifier.dsql.us-test-1.amazonaws.com',
      vpcEndpointServiceName: 'vpce',
    });

    // THEN
    expect(cluster.clusterIdentifier).toEqual('identifier');
    expect(cluster.clusterEndpoint).toEqual('identifier.dsql.us-test-1.amazonaws.com');
    expect(cluster.vpcEndpointServiceName).toEqual('vpce');
    expect(cluster.clusterArn).toEqual(stack.formatArn({
      service: 'dsql',
      resource: 'cluster',
      resourceName: 'identifier',
    }));
  });

  test('fails when clusterIdentifier is empty', () => {
    // GIVEN
    const stack = testStack();

    // THEN
    expect(() => {
      Cluster.fromClusterAttributes(stack as any, 'Database', {
        clusterIdentifier: '',
        clusterEndpoint: 'endpoint',
        vpcEndpointServiceName: 'vpce',
      });
    }).toThrow('clusterIdentifier cannot be empty');
  });

  test('fails when clusterIdentifier is whitespace only', () => {
    // GIVEN
    const stack = testStack();

    // THEN
    expect(() => {
      Cluster.fromClusterAttributes(stack as any, 'Database', {
        clusterIdentifier: '   ',
        clusterEndpoint: 'endpoint',
        vpcEndpointServiceName: 'vpce',
      });
    }).toThrow('clusterIdentifier cannot be empty');
  });

  test('allows token as clusterIdentifier', () => {
    // GIVEN
    const stack = testStack();

    // THEN - tokens are not validated at synth time
    expect(() => {
      Cluster.fromClusterAttributes(stack as any, 'Database', {
        clusterIdentifier: cdk.Lazy.string({ produce: () => 'resolved-at-deploy-time' }),
        clusterEndpoint: 'endpoint',
        vpcEndpointServiceName: 'vpce',
      });
    }).not.toThrow();
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
            'Fn::GetAtt': ['ClusterEB0386A7', 'ResourceArn'],
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
            'Fn::GetAtt': ['ClusterEB0386A7', 'ResourceArn'],
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
            'Fn::GetAtt': ['ClusterEB0386A7', 'ResourceArn'],
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
