import { expect, haveResource } from '@aws-cdk/assert';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { SecurityGroup, Vpc } from '@aws-cdk/aws-ec2';
import { AccountRootPrincipal, Role } from '@aws-cdk/aws-iam';
import { Duration, Stack } from '@aws-cdk/core';
import { Cluster } from '../lib';

describe('DAX Cluster', () => {

  test('DAX Cluster grantReadData', () => {
    const stack = new Stack();

    const cluster = new Cluster(stack, 'MyCluster');

    const appRole = new Role(stack, 'ApplicationRole', {
      assumedBy: new AccountRootPrincipal(),
    });
    cluster.grantReadData(appRole);

    expect(stack).to(haveResource('AWS::DAX::Cluster', {
      IAMRoleARN: {
        'Fn::GetAtt': ['MyClusterRoleBA20FE72', 'Arn'],
      },
      NodeType: 'dax.t2.small',
      ReplicationFactor: 3,
    }));

    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::',
                    { Ref: 'AWS::AccountId' },
                    ':root',
                  ],
                ],
              },
            },
          },
        ],
        Version: '2012-10-17',
      },
    }));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dax:GetItem',
              'dax:BatchGetItem',
              'dax:Query',
              'dax:Scan',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyCluster9CF8BB78', 'Arn'],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'ApplicationRoleDefaultPolicy2A2BCE7E',
      Roles: [
        {
          Ref: 'ApplicationRole90C00724',
        },
      ],
    }));

  });

  test('DAX Cluster grantWriteData', () => {
    const stack = new Stack();

    const cluster = new Cluster(stack, 'MyCluster');

    const appRole = new Role(stack, 'ApplicationRole', {
      assumedBy: new AccountRootPrincipal(),
    });
    cluster.grantWriteData(appRole);

    expect(stack).to(haveResource('AWS::DAX::Cluster', {
      IAMRoleARN: {
        'Fn::GetAtt': ['MyClusterRoleBA20FE72', 'Arn'],
      },
      NodeType: 'dax.t2.small',
      ReplicationFactor: 3,
    }));

    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::',
                    { Ref: 'AWS::AccountId' },
                    ':root',
                  ],
                ],
              },
            },
          },
        ],
        Version: '2012-10-17',
      },
    }));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dax:PutItem',
              'dax:UpdateItem',
              'dax:DeleteItem',
              'dax:BatchWriteItem',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyCluster9CF8BB78', 'Arn'],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'ApplicationRoleDefaultPolicy2A2BCE7E',
      Roles: [
        {
          Ref: 'ApplicationRole90C00724',
        },
      ],
    }));

  });

  test('DAX Cluster grantReadWriteData', () => {
    const stack = new Stack();

    const cluster = new Cluster(stack, 'MyCluster');

    const appRole = new Role(stack, 'ApplicationRole', {
      assumedBy: new AccountRootPrincipal(),
    });
    cluster.grantReadWriteData(appRole);

    expect(stack).to(haveResource('AWS::DAX::Cluster', {
      IAMRoleARN: {
        'Fn::GetAtt': ['MyClusterRoleBA20FE72', 'Arn'],
      },
      NodeType: 'dax.t2.small',
      ReplicationFactor: 3,
    }));

    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::',
                    { Ref: 'AWS::AccountId' },
                    ':root',
                  ],
                ],
              },
            },
          },
        ],
        Version: '2012-10-17',
      },
    }));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dax:GetItem',
              'dax:BatchGetItem',
              'dax:Query',
              'dax:Scan',
              'dax:PutItem',
              'dax:UpdateItem',
              'dax:DeleteItem',
              'dax:BatchWriteItem',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyCluster9CF8BB78', 'Arn'],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'ApplicationRoleDefaultPolicy2A2BCE7E',
      Roles: [
        {
          Ref: 'ApplicationRole90C00724',
        },
      ],
    }));

  });

  test('DAX Cluster grantFullAccess', () => {
    const stack = new Stack();

    const cluster = new Cluster(stack, 'MyCluster');

    const appRole = new Role(stack, 'ApplicationRole', {
      assumedBy: new AccountRootPrincipal(),
    });
    cluster.grantFullAccess(appRole);

    expect(stack).to(haveResource('AWS::DAX::Cluster', {
      IAMRoleARN: {
        'Fn::GetAtt': ['MyClusterRoleBA20FE72', 'Arn'],
      },
      NodeType: 'dax.t2.small',
      ReplicationFactor: 3,
    }));

    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::',
                    { Ref: 'AWS::AccountId' },
                    ':root',
                  ],
                ],
              },
            },
          },
        ],
        Version: '2012-10-17',
      },
    }));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'dax:*',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyCluster9CF8BB78', 'Arn'],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'ApplicationRoleDefaultPolicy2A2BCE7E',
      Roles: [
        {
          Ref: 'ApplicationRole90C00724',
        },
      ],
    }));

  });

  test('DAX Cluster with defaults', () => {
    const stack = new Stack();

    new Cluster(stack, 'MyCluster');

    expect(stack).to(haveResource('AWS::DAX::Cluster', {
      IAMRoleARN: {
        'Fn::GetAtt': ['MyClusterRoleBA20FE72', 'Arn'],
      },
      NodeType: 'dax.t2.small',
      ReplicationFactor: 3,
    }));

  });

  test('DAX Cluster with properties', () => {
    const stack = new Stack();

    const vpc = new Vpc(stack, 'MyVpc');
    const securityGroup = new SecurityGroup(stack, 'MySecurityGroup', { vpc });
    const table = new Table(stack, 'MyTable', {
      partitionKey: {
        name: 'PrimaryKey',
        type: AttributeType.STRING,
      },
    });
    new Cluster(stack, 'MyCluster', {
      tables: [table],
      recordTtl: Duration.minutes(10),
      queryTtl: Duration.minutes(30),
      subnets: vpc.privateSubnets,
      serverSideEncryption: true,
      securityGroups: [securityGroup],
    });

    expect(stack).to(haveResource('AWS::DAX::Cluster', {
      IAMRoleARN: {
        'Fn::GetAtt': ['MyClusterRoleBA20FE72', 'Arn'],
      },
      NodeType: 'dax.t2.small',
      ReplicationFactor: 3,
      SecurityGroupIds: [
        {
          'Fn::GetAtt': ['MySecurityGroupAC8D442C', 'GroupId'],
        },
      ],
      SSESpecification: {
        SSEEnabled: true,
      },
    }));

    expect(stack).to(haveResource('AWS::DAX::ParameterGroup', {
      ParameterNameValues: {
        'record-ttl-millis': '600000',
        'query-ttl-millis': '1800000',
      },
    }));

    expect(stack).to(haveResource('AWS::DAX::SubnetGroup', {
      SubnetIds: [
        {
          Ref: 'MyVpcPrivateSubnet1Subnet5057CF7E',
        },
        {
          Ref: 'MyVpcPrivateSubnet2Subnet0040C983',
        },
      ],
    }));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'dynamodb:*',
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': ['MyTable794EDED1', 'Arn'],
              },
              {
                Ref: 'AWS::NoValue',
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'MyClusterRoleDefaultPolicy860EEB8A',
      Roles: [
        {
          Ref: 'MyClusterRoleBA20FE72',
        },
      ],
    }));

    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'dax.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
    }));

  });

});