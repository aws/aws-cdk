import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib';
import * as redshift from '../lib';
import { DatabaseQuery, DatabaseQueryProps } from '../lib/private/database-query';

describe('database query', () => {
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;
  let cluster: redshift.ICluster;
  let minimalProps: DatabaseQueryProps<any>;

  beforeEach(() => {
    stack = new cdk.Stack();
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
  });

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
});
