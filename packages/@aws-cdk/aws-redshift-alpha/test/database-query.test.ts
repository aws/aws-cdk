import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { REDSHIFT_SINGLETON_PROVIDER } from 'aws-cdk-lib/cx-api';
import { Construct } from 'constructs';
import * as redshift from '../lib';
import type { DatabaseQueryProps } from '../lib/private/database-query';
import { DatabaseQuery } from '../lib/private/database-query';

describe('database query', () => {
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;
  let cluster: redshift.ICluster;
  let minimalProps: DatabaseQueryProps<any>;

  function setup(isSingletonProvider?: boolean) {
    stack = new cdk.Stack();
    if (isSingletonProvider !== undefined) {
      stack.node.setContext(REDSHIFT_SINGLETON_PROVIDER, isSingletonProvider);
    }
    vpc = new ec2.Vpc(stack, 'VPC');
    cluster = new redshift.Cluster(stack, 'Cluster', {
      vpc: vpc,
      masterUser: {
        masterUsername: 'admin',
      },
    });
    minimalProps = {
      cluster: cluster,
      databaseName: 'databaseName',
      handler: 'handler',
      properties: {},
    };
  }

  beforeEach(() => setup());

  describe('admin user', () => {
    it('takes from cluster by default', () => {
      new DatabaseQuery(stack, 'Query', {
        ...minimalProps,
      });

      Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
        adminUserArn: { Ref: 'ClusterSecretAttachment769E6258' },
      });
    });

    it('grants read permission to handler', () => {
      new DatabaseQuery(stack, 'Query', {
        ...minimalProps,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([{
            Action: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
            Effect: 'Allow',
            Resource: { Ref: 'ClusterSecretAttachment769E6258' },
          }]),
        },
        Roles: [{ Ref: 'QueryRedshiftDatabase3de5bea727da479686625efb56431b5fServiceRole0A90D717' }],
      });
    });

    it('uses admin user if provided', () => {
      cluster = new redshift.Cluster(stack, 'Cluster With Provided Admin Secret', {
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
        masterUser: {
          masterUsername: 'admin',
          masterPassword: cdk.SecretValue.unsafePlainText('INSECURE_NOT_FOR_PRODUCTION'),
        },
        publiclyAccessible: true,
      });

      new DatabaseQuery(stack, 'Query', {
        ...minimalProps,
        adminUser: secretsmanager.Secret.fromSecretNameV2(stack, 'Imported Admin User', 'imported-admin-secret'),
        cluster,
      });

      Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
        adminUserArn: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':secretsmanager:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':secret:imported-admin-secret',
            ],
          ],
        },
      });
    });

    it('throws error if admin user not provided and cluster was provided a admin password', () => {
      cluster = new redshift.Cluster(stack, 'Cluster With Provided Admin Secret', {
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
        masterUser: {
          masterUsername: 'admin',
          masterPassword: cdk.SecretValue.unsafePlainText('INSECURE_NOT_FOR_PRODUCTION'),
        },
        publiclyAccessible: true,
      });

      expect(() => new DatabaseQuery(stack, 'Query', {
        ...minimalProps,
        cluster,
      })).toThrow('Administrative access to the Redshift cluster is required but an admin user secret was not provided and the cluster did not generate admin user credentials (they were provided explicitly)');
    });

    it('throws error if admin user not provided and cluster was imported', () => {
      cluster = redshift.Cluster.fromClusterAttributes(stack, 'Imported Cluster', {
        clusterName: 'imported-cluster',
        clusterEndpointAddress: 'imported-cluster.abcdefghijk.xx-west-1.redshift.amazonaws.com',
        clusterEndpointPort: 5439,
      });

      expect(() => new DatabaseQuery(stack, 'Query', {
        ...minimalProps,
        cluster,
      })).toThrow('Administrative access to the Redshift cluster is required but an admin user secret was not provided and the cluster was imported');
    });
  });

  it('provides database params to Lambda handler', () => {
    new DatabaseQuery(stack, 'Query', {
      ...minimalProps,
    });

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
      clusterName: {
        Ref: 'ClusterEB0386A7',
      },
      adminUserArn: {
        Ref: 'ClusterSecretAttachment769E6258',
      },
      databaseName: 'databaseName',
      handler: 'handler',
    });
  });

  it('grants statement permissions to handler', () => {
    new DatabaseQuery(stack, 'Query', {
      ...minimalProps,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([{
          Action: ['redshift-data:DescribeStatement', 'redshift-data:ExecuteStatement'],
          Effect: 'Allow',
          Resource: '*',
        }]),
      },
      Roles: [{ Ref: 'QueryRedshiftDatabase3de5bea727da479686625efb56431b5fServiceRole0A90D717' }],
    });
  });

  describe('timeout', () => {
    it('passes timeout', () => {
      new DatabaseQuery(stack, 'Query', {
        ...minimalProps,
        timeout: cdk.Duration.minutes(5),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Timeout: 300,
        Role: { 'Fn::GetAtt': ['QueryRedshiftDatabase3de5bea727da479686625efb56431b5fServiceRole0A90D717', 'Arn'] },
        Handler: 'index.handler',
        Code: {
          S3Bucket: { 'Fn::Sub': 'cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}' },
        },
      });
    });

    it('throw error for timeout being too short', () => {
      expect(() => new DatabaseQuery(stack, 'Query', {
        ...minimalProps,
        timeout: cdk.Duration.millis(999),
      })).toThrow('The timeout for the handler must be BETWEEN 1 second and 15 minutes, got 999 milliseconds.');
    });

    it('throw error for timeout being too long', () => {
      expect(() => new DatabaseQuery(stack, 'Query', {
        ...minimalProps,
        timeout: cdk.Duration.minutes(16),
      })).toThrow('The timeout for the handler must be between 1 second and 15 minutes, got 960 seconds.');
    });
  });

  it('passes removal policy through', () => {
    new DatabaseQuery(stack, 'Query', {
      ...minimalProps,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    Template.fromStack(stack).hasResource('Custom::RedshiftDatabaseQuery', {
      DeletionPolicy: 'Delete',
    });
  });

  it('passes applyRemovalPolicy through', () => {
    const query = new DatabaseQuery(stack, 'Query', {
      ...minimalProps,
    });

    query.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    Template.fromStack(stack).hasResource('Custom::RedshiftDatabaseQuery', {
      DeletionPolicy: 'Delete',
    });
  });

  it('passes gettAtt through', () => {
    const query = new DatabaseQuery(stack, 'Query', {
      ...minimalProps,
    });

    expect(stack.resolve(query.getAtt('attribute'))).toStrictEqual({ 'Fn::GetAtt': ['Query435140A1', 'attribute'] });
    expect(stack.resolve(query.getAttString('attribute'))).toStrictEqual({ 'Fn::GetAtt': ['Query435140A1', 'attribute'] });
  });

  describe('provider sharing', () => {
    test.each([undefined, false])('preserves existing providers when the flag is %s', (flag) => {
      setup(flag);
      new DatabaseQuery(stack, 'First', minimalProps);
      new DatabaseQuery(stack, 'Second', minimalProps);

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::Lambda::Function', 3);
      template.hasResourceProperties('Custom::RedshiftDatabaseQuery', {
        ServiceToken: { 'Fn::GetAtt': ['FirstProviderframeworkonEvent51DD7805', 'Arn'] },
      });
      template.hasResourceProperties('Custom::RedshiftDatabaseQuery', {
        ServiceToken: { 'Fn::GetAtt': ['SecondProviderframeworkonEventB1AAB06B', 'Arn'] },
      });
    });

    test('shares one provider across different construct scopes', () => {
      setup(true);
      new DatabaseQuery(new Construct(stack, 'FirstScope'), 'Query', minimalProps);
      new DatabaseQuery(new Construct(stack, 'SecondScope'), 'Query', minimalProps);
      new DatabaseQuery(stack, 'Third', minimalProps);

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::Lambda::Function', 2);
      template.resourceCountIs('Custom::RedshiftDatabaseQuery', 3);
      const queries = Object.values(template.findResources('Custom::RedshiftDatabaseQuery'));
      const serviceTokens = queries.map(query => query.Properties.ServiceToken);
      expect(serviceTokens[0]).toEqual(serviceTokens[1]);
      expect(serviceTokens[1]).toEqual(serviceTokens[2]);
      expect(serviceTokens[0]).toEqual({
        'Fn::GetAtt': [expect.stringMatching(/^QueryRedshiftDatabase3de5bea727da479686625efb56431b5fProviderframeworkonEvent/), 'Arn'],
      });
    });

    test('creates a separate provider in each stack', () => {
      for (const targetStack of [new cdk.Stack(), new cdk.Stack()]) {
        targetStack.node.setContext(REDSHIFT_SINGLETON_PROVIDER, true);
        const importedCluster = redshift.Cluster.fromClusterAttributes(targetStack, 'ImportedCluster', {
          clusterName: 'imported-cluster',
          clusterEndpointAddress: 'imported-cluster.example.com',
          clusterEndpointPort: 5439,
        });
        const adminUser = secretsmanager.Secret.fromSecretNameV2(targetStack, 'Admin', 'admin');
        new DatabaseQuery(targetStack, 'First', { ...minimalProps, cluster: importedCluster, adminUser });
        new DatabaseQuery(targetStack, 'Second', { ...minimalProps, cluster: importedCluster, adminUser });
        Template.fromStack(targetStack).resourceCountIs('AWS::Lambda::Function', 2);
      }
    });

    test('keeps granting access to every query admin secret', () => {
      setup(true);
      for (const id of ['FirstAdmin', 'SecondAdmin']) {
        const adminUser = new secretsmanager.Secret(stack, id);
        new DatabaseQuery(stack, id + 'Query', { ...minimalProps, adminUser });
      }
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::Lambda::Function', 2);
      for (const id of ['FirstAdmin', 'SecondAdmin']) {
        const secret = stack.node.findChild(id) as secretsmanager.Secret;
        template.hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: Match.arrayWith([Match.objectLike({
              Action: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
              Resource: stack.resolve(secret.secretArn),
            })]),
          },
        });
      }
    });

    test('keeps the shared service token when the first query is removed', () => {
      const tokens = [true, false].map(includeFirst => {
        const targetStack = new cdk.Stack();
        targetStack.node.setContext(REDSHIFT_SINGLETON_PROVIDER, true);
        const importedCluster = redshift.Cluster.fromClusterAttributes(targetStack, 'ImportedCluster', {
          clusterName: 'imported-cluster',
          clusterEndpointAddress: 'imported-cluster.example.com',
          clusterEndpointPort: 5439,
        });
        const adminUser = secretsmanager.Secret.fromSecretNameV2(targetStack, 'Admin', 'admin');
        if (includeFirst) {
          new DatabaseQuery(targetStack, 'First', { ...minimalProps, cluster: importedCluster, adminUser });
        }
        new DatabaseQuery(targetStack, 'Second', { ...minimalProps, cluster: importedCluster, adminUser });
        const queries = Template.fromStack(targetStack).findResources('Custom::RedshiftDatabaseQuery');
        return Object.values(queries).map(query => query.Properties.ServiceToken).pop();
      });
      expect(tokens[0]).toEqual(tokens[1]);
    });
  });

  test.each([false, true])('creates one IAM invoker role with singleton provider enabled: %s', (isSingletonProvider) => {
    setup(isSingletonProvider);
    new DatabaseQuery(stack, 'Query0', {
      ...minimalProps,
    });

    new DatabaseQuery(stack, 'Query1', {
      ...minimalProps,
    });

    new DatabaseQuery(stack, 'Query2', {
      ...minimalProps,
    });

    const template = Template.fromStack(stack).toJSON();
    const iamRoles = Object.entries(template.Resources)
      .map(([k, v]) => [k, Object.getOwnPropertyDescriptor(v, 'Type')?.value])
      .filter(([k, v]) => v === 'AWS::IAM::Role' && k.toString().includes('InvokerRole'));

    expect(iamRoles).toHaveLength(1);
  });
});
