import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';

import { Cluster, ClusterParameterGroup, ClusterType } from '../lib';

test('check that instantiation works', () => {
  // GIVEN
  const stack = testStack();
  const vpc = new ec2.Vpc(stack, 'VPC');

  // WHEN
  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
      masterPassword: cdk.SecretValue.plainText('tooshort'),
    },
    vpc
  });

  // THEN
  expect(stack).to(haveResource('AWS::Redshift::Cluster', {
    Properties: {
      AllowVersionUpgrade: true,
      MasterUsername: "admin",
      MasterUserPassword: "tooshort",
      ClusterType: "multi-node",
      AutomatedSnapshotRetentionPeriod: 1,
      NumberOfNodes: 2,
      NodeType: "dc2.large",
      DBName: "default_db",
      Encrypted: true,
      PubliclyAccessible: false,
      ClusterSubnetGroupName: { Ref: "RedshiftSubnetsDFE70E0A" },
      VpcSecurityGroupIds: [{ "Fn::GetAtt": ["RedshiftSecurityGroup796D74A7", "GroupId"] }]
    },
    DeletionPolicy: 'Retain',
    UpdateReplacePolicy: 'Retain'
  }, ResourcePart.CompleteDefinition));

  expect(stack).to(haveResource('AWS::Redshift::ClusterSubnetGroup', {
    Properties: {
      Description: `Subnets for Redshift Redshift cluster`,
      SubnetIds: [
        { Ref: "VPCPrivateSubnet1Subnet8BCA10E0" },
        { Ref: "VPCPrivateSubnet2SubnetCFCDAA7A" },
        { Ref: "VPCPrivateSubnet3Subnet3EDCD457" }
      ]
    },
    DeletionPolicy: 'Retain',
    UpdateReplacePolicy: 'Retain'
  }, ResourcePart.CompleteDefinition));
});

test('can create a cluster with imported vpc and security group', () => {
  // GIVEN
  const stack = testStack();
  const vpc = ec2.Vpc.fromLookup(stack, 'VPC', {
    vpcId: "VPC12345"
  });
  const sg = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', "SecurityGroupId12345");

  // WHEN
  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
      masterPassword: cdk.SecretValue.plainText('tooshort'),
    },
    vpc,
    securityGroups: [sg]
  });

  // THEN
  expect(stack).to(haveResource('AWS::Redshift::Cluster', {
    ClusterSubnetGroupName: { Ref: "RedshiftSubnetsDFE70E0A" },
    MasterUsername: "admin",
    MasterUserPassword: "tooshort",
    VpcSecurityGroupIds: ["SecurityGroupId12345"]
  }));
});

test('creates a secret when master credentials are not specified', () => {
  // GIVEN
  const stack = testStack();
  const vpc = new ec2.Vpc(stack, 'VPC');

  // WHEN
  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
    },
    vpc
  });

  // THEN
  expect(stack).to(haveResource('AWS::Redshift::Cluster', {
    MasterUsername: {
      'Fn::Join': [
        '',
        [
          '{{resolve:secretsmanager:',
          {
            Ref: 'RedshiftSecretA08D42D6'
          },
          ':SecretString:username::}}'
        ]
      ]
    },
    MasterUserPassword: {
      'Fn::Join': [
        '',
        [
          '{{resolve:secretsmanager:',
          {
            Ref: 'RedshiftSecretA08D42D6'
          },
          ':SecretString:password::}}'
        ]
      ]
    },
  }));

  expect(stack).to(haveResource('AWS::SecretsManager::Secret', {
    GenerateSecretString: {
      ExcludeCharacters: '\"@/\\',
      GenerateStringKey: 'password',
      PasswordLength: 30,
      SecretStringTemplate: '{"username":"admin"}'
    }
  }));
});

test('SIngle Node CLusters spawn only single node', () => {
  // GIVEN
  const stack = testStack();
  const vpc = new ec2.Vpc(stack, 'VPC');

  // WHEN
  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
    },
    vpc,
    clusterType: ClusterType.SINGLE_NODE
  });

  // THEN
  expect(stack).to(haveResource('AWS::Redshift::Cluster', {
    ClusterType: "single-node",
    NumberOfNodes: 1,
    }));
});

test('create an encrypted cluster with custom KMS key', () => {
  // GIVEN
  const stack = testStack();
  const vpc = new ec2.Vpc(stack, 'VPC');

  // WHEN
  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
    },
    kmsKey: new kms.Key(stack, 'Key'),
    vpc
  });

  // THEN
  expect(stack).to(haveResource('AWS::Redshift::Cluster', {
    KmsKeyId: {
      'Fn::GetAtt': [
        'Key961B73FD',
        'Arn'
      ]
    }
  }));
});

test('cluster with parameter group', () => {
  // GIVEN
  const stack = testStack();
  const vpc = new ec2.Vpc(stack, 'VPC');

  // WHEN
  const group = new ClusterParameterGroup(stack, 'Params', {
    family: 'hello',
    description: 'bye',
    parameters: [
      {
        parameterName: "param",
        parameterValue: "value"
      }
    ]
  });

  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
    },
    vpc,
    parameterGroup: group
  });

  // THEN
  expect(stack).to(haveResource('AWS::Redshift::Cluster', {
    ClusterParameterGroupName: { Ref: 'ParamsA8366201' },
  }));

});

test('imported cluster with imported security group honors allowAllOutbound', () => {
  // GIVEN
  const stack = testStack();

  const cluster = Cluster.fromClusterAttributes(stack, 'Database', {
    clusterEndpointAddress: 'addr',
    clusterName: 'identifier',
    clusterEndpointPort: 3306,
    securityGroups: [
      ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
        allowAllOutbound: false
      })
    ]
  });

  // WHEN
  cluster.connections.allowToAnyIpv4(ec2.Port.tcp(443));

  // THEN
  expect(stack).to(haveResource('AWS::EC2::SecurityGroupEgress', {
    GroupId: 'sg-123456789',
  }));
});

//   "cluster with enabled monitoring"(test: Test) {
//     // GIVEN
//     const stack = testStack();
//     const vpc = new ec2.Vpc(stack, "VPC");

//     // WHEN
//     new DatabaseCluster(stack, "Database", {
//       engine: DatabaseClusterEngine.AURORA,
//       instances: 1,
//       masterUser: {
//         username: "admin"
//       },
//       instanceProps: {
//         instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
//         vpc
//       },
//       monitoringInterval: cdk.Duration.minutes(1),
//     });

//     // THEN
//     expect(stack).to(haveResource("AWS::RDS::DBInstance", {
//       MonitoringInterval: 60,
//       MonitoringRoleArn: {
//         "Fn::GetAtt": ["DatabaseMonitoringRole576991DA", "Arn"]
//       }
//     }, ResourcePart.Properties));

//     expect(stack).to(haveResource("AWS::IAM::Role", {
//       AssumeRolePolicyDocument: {
//         Statement: [
//           {
//             Action: "sts:AssumeRole",
//             Effect: "Allow",
//             Principal: {
//               Service: "monitoring.rds.amazonaws.com"
//             }
//           }
//         ],
//         Version: "2012-10-17"
//       },
//       ManagedPolicyArns: [
//         {
//           "Fn::Join": [
//             "",
//             [
//               "arn:",
//               {
//                 Ref: "AWS::Partition"
//               },
//               ":iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
//             ]
//           ]
//         }
//       ]
//     }));

//     test.done();
//   },

// test('throws when trying to add rotation to a cluster without secret', () => {
//     // GIVEN
//     const stack = new cdk.Stack();
//     const vpc = new ec2.Vpc(stack, 'VPC');

//     // WHEN
//     const cluster = new Cluster(stack, 'Redshift', {
//       masterUser: {
//         masterUsername: 'admin',
//         masterPassword: cdk.SecretValue.plainText('tooshort')
//         },
//       vpc,
//     });

//     // THEN
//     expect(() => {
//       cluster.addRotationSingleUser()
//     }).toThrowError()

//   });

//   'throws when trying to add single user rotation multiple timet'(test: Test) {
//     // GIVEN
//     const stack = new cdk.Stack();
//     const vpc = new ec2.Vpc(stack, 'VPC');
//     const cluster = new DatabaseCluster(stack, 'Database', {
//       engine: DatabaseClusterEngine.AURORA_MYSQL,
//       masterUser: { username: 'admin' },
//       instanceProps: {
//         instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
//         vpc
//       }
//     });

//     // WHEN
//     cluster.addRotationSingleUser();

//     // THEN
//     test.throws(() => cluster.addRotationSingleUser(), /A single user rotation was already added to this cluster/);

//     test.done();
//   },
// };

function testStack() {
  const stack = new cdk.Stack(undefined, undefined, { env: { account: '12345', region: 'us-test-1' } });
  stack.node.setContext('availability-zones:12345:us-test-1', ['us-test-1a', 'us-test-1b']);
  return stack;
}