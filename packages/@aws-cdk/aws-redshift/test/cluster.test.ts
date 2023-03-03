import { Match, Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Cluster, ClusterParameterGroup, ClusterSubnetGroup, ClusterType } from '../lib';
import { CfnCluster } from '../lib/redshift.generated';

let stack: cdk.Stack;
let vpc: ec2.IVpc;

beforeEach(() => {
  stack = testStack();
  vpc = new ec2.Vpc(stack, 'VPC');
});

test('check that instantiation works', () => {
  // WHEN
  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
      masterPassword: cdk.SecretValue.unsafePlainText('tooshort'),
    },
    vpc,
  });

  // THEN
  Template.fromStack(stack).hasResource('AWS::Redshift::Cluster', {
    Properties: {
      AllowVersionUpgrade: true,
      MasterUsername: 'admin',
      MasterUserPassword: 'tooshort',
      ClusterType: 'multi-node',
      AutomatedSnapshotRetentionPeriod: 1,
      Encrypted: true,
      NumberOfNodes: 2,
      NodeType: 'dc2.large',
      DBName: 'default_db',
      PubliclyAccessible: false,
      ClusterSubnetGroupName: { Ref: 'RedshiftSubnetsDFE70E0A' },
      VpcSecurityGroupIds: [{ 'Fn::GetAtt': ['RedshiftSecurityGroup796D74A7', 'GroupId'] }],
    },
    DeletionPolicy: 'Retain',
    UpdateReplacePolicy: 'Retain',
  });

  Template.fromStack(stack).hasResource('AWS::Redshift::ClusterSubnetGroup', {
    Properties: {
      Description: 'Subnets for Redshift Redshift cluster',
      SubnetIds: [
        { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
        { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
        { Ref: 'VPCPrivateSubnet3Subnet3EDCD457' },
      ],
    },
    DeletionPolicy: 'Retain',
    UpdateReplacePolicy: 'Retain',
  });
});

test('can create a cluster with imported vpc and security group', () => {
  // GIVEN
  vpc = ec2.Vpc.fromLookup(stack, 'ImportedVPC', {
    vpcId: 'VPC12345',
  });
  const sg = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'SecurityGroupId12345');

  // WHEN
  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
      masterPassword: cdk.SecretValue.unsafePlainText('tooshort'),
    },
    vpc,
    securityGroups: [sg],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Redshift::Cluster', {
    ClusterSubnetGroupName: { Ref: 'RedshiftSubnetsDFE70E0A' },
    MasterUsername: 'admin',
    MasterUserPassword: 'tooshort',
    VpcSecurityGroupIds: ['SecurityGroupId12345'],
  });
});

test('creates a secret when master credentials are not specified', () => {
  // WHEN
  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
    },
    vpc,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Redshift::Cluster', {
    MasterUsername: {
      'Fn::Join': [
        '',
        [
          '{{resolve:secretsmanager:',
          {
            Ref: 'RedshiftSecretA08D42D6',
          },
          ':SecretString:username::}}',
        ],
      ],
    },
    MasterUserPassword: {
      'Fn::Join': [
        '',
        [
          '{{resolve:secretsmanager:',
          {
            Ref: 'RedshiftSecretA08D42D6',
          },
          ':SecretString:password::}}',
        ],
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
    GenerateSecretString: {
      ExcludeCharacters: '"@/\\\ \'',
      GenerateStringKey: 'password',
      PasswordLength: 30,
      SecretStringTemplate: '{"username":"admin"}',
    },
  });
});

describe('node count', () => {

  test('Single Node Clusters do not define node count', () => {
    // WHEN
    new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
      clusterType: ClusterType.SINGLE_NODE,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Redshift::Cluster', {
      ClusterType: 'single-node',
      NumberOfNodes: Match.absent(),
    });
  });

  test('Single Node Clusters treat 1 node as undefined', () => {
    // WHEN
    new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
      clusterType: ClusterType.SINGLE_NODE,
      numberOfNodes: 1,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Redshift::Cluster', {
      ClusterType: 'single-node',
      NumberOfNodes: Match.absent(),
    });
  });

  test('Single Node Clusters throw if any other node count is specified', () => {
    expect(() => {
      new Cluster(stack, 'Redshift', {
        masterUser: {
          masterUsername: 'admin',
        },
        vpc,
        clusterType: ClusterType.SINGLE_NODE,
        numberOfNodes: 2,
      });
    }).toThrow(/Number of nodes must be not be supplied or be 1 for cluster type single-node/);
  });

  test('Multi-Node Clusters default to 2 nodes', () => {
    // WHEN
    new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
      clusterType: ClusterType.MULTI_NODE,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Redshift::Cluster', {
      ClusterType: 'multi-node',
      NumberOfNodes: 2,
    });
  });

  test.each([0, 1, -1, 101])('Multi-Node Clusters throw with %s nodes', (numberOfNodes: number) => {
    expect(() => {
      new Cluster(stack, 'Redshift', {
        masterUser: {
          masterUsername: 'admin',
        },
        vpc,
        clusterType: ClusterType.MULTI_NODE,
        numberOfNodes,
      });
    }).toThrow(/Number of nodes for cluster type multi-node must be at least 2 and no more than 100/);
  });

  test('Multi-Node Clusters should allow input parameter for number of nodes', () => {
    // WHEN
    const numberOfNodesParam = new cdk.CfnParameter(stack, 'numberOfNodes', {
      type: 'Number',
    });

    new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
      clusterType: ClusterType.MULTI_NODE,
      numberOfNodes: numberOfNodesParam.valueAsNumber,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Redshift::Cluster', {
      ClusterType: 'multi-node',
      NumberOfNodes: {
        Ref: 'numberOfNodes',
      },
    });
  });
});

test('create an encrypted cluster with custom KMS key', () => {
  // WHEN
  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
    },
    encryptionKey: new kms.Key(stack, 'Key'),
    vpc,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Redshift::Cluster', {
    KmsKeyId: {
      Ref: 'Key961B73FD',
    },
  });
});
describe('parameter group', () => {
  test('cluster instantiated with parameter group', () => {
    // WHEN
    const group = new ClusterParameterGroup(stack, 'Params', {
      description: 'bye',
      parameters: {
        param: 'value',
      },
    });

    new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
      parameterGroup: group,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Redshift::Cluster', {
      ClusterParameterGroupName: { Ref: 'ParamsA8366201' },
    });

  });

  test('Adding to the cluster parameter group on a cluster not instantiated with a parameter group', () => {

    // WHEN
    const cluster = new Cluster(stack, 'Redshift', {
      clusterName: 'foobar',
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
    });

    cluster.addToParameterGroup('foo', 'bar');

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Redshift::Cluster', {
      ClusterParameterGroupName: { Ref: Match.anyValue() },
    });

    template.hasResourceProperties('AWS::Redshift::ClusterParameterGroup', {
      Description: 'Parameter Group for the foobar Redshift cluster',
      ParameterGroupFamily: 'redshift-1.0',
      Parameters: [
        {
          ParameterName: 'foo',
          ParameterValue: 'bar',
        },
      ],
    });
  });

  test('Adding to the cluster parameter group on a cluster instantiated with a parameter group', () => {

    // WHEN
    const group = new ClusterParameterGroup(stack, 'Params', {
      description: 'lorem ipsum',
      parameters: {
        param: 'value',
      },
    });

    const cluster = new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
      parameterGroup: group,
    });
    cluster.addToParameterGroup('foo', 'bar');

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Redshift::Cluster', {
      ClusterParameterGroupName: { Ref: Match.anyValue() },
    });

    template.hasResourceProperties('AWS::Redshift::ClusterParameterGroup', {
      Description: 'lorem ipsum',
      ParameterGroupFamily: 'redshift-1.0',
      Parameters: [
        {
          ParameterName: 'param',
          ParameterValue: 'value',
        },
        {
          ParameterName: 'foo',
          ParameterValue: 'bar',
        },
      ],
    });
  });

  test('Adding a parameter to an IClusterParameterGroup', () => {
    // GIVEN
    const cluster = new Cluster(stack, 'Redshift', {
      clusterName: 'foobar',
      parameterGroup: ClusterParameterGroup.fromClusterParameterGroupName(stack, 'Params', 'foo'),
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
    });

    // WHEN
    expect(() => cluster.addToParameterGroup('param', 'value2'))
      // THEN
      .toThrowError('Cannot add a parameter to an imported parameter group');
  });

});

test('publicly accessible cluster', () => {
  // WHEN
  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
    },
    vpc,
    publiclyAccessible: true,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Redshift::Cluster', {
    PubliclyAccessible: true,
  });
});

test('imported cluster with imported security group honors allowAllOutbound', () => {
  // GIVEN
  const cluster = Cluster.fromClusterAttributes(stack, 'Database', {
    clusterEndpointAddress: 'addr',
    clusterName: 'identifier',
    clusterEndpointPort: 3306,
    securityGroups: [
      ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
        allowAllOutbound: false,
      }),
    ],
  });

  // WHEN
  cluster.connections.allowToAnyIpv4(ec2.Port.tcp(443));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
    GroupId: 'sg-123456789',
  });
});

test('can create a cluster with logging enabled', () => {
  // GIVEN
  const bucket = s3.Bucket.fromBucketName(stack, 'bucket', 'logging-bucket');

  // WHEN
  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
    },
    vpc,
    loggingProperties: {
      loggingBucket: bucket,
      loggingKeyPrefix: 'prefix',
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Redshift::Cluster', {
    LoggingProperties: {
      BucketName: 'logging-bucket',
      S3KeyPrefix: 'prefix',
    },
  });
});

test('throws when trying to add rotation to a cluster without secret', () => {
  // WHEN
  const cluster = new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
      masterPassword: cdk.SecretValue.unsafePlainText('tooshort'),
    },
    vpc,
  });

  // THEN
  expect(() => {
    cluster.addRotationSingleUser();
  }).toThrowError();

});

test('throws validation error when trying to set encryptionKey without enabling encryption', () => {
  // GIVEN
  const key = new kms.Key(stack, 'kms-key');

  // WHEN
  const props = {
    encrypted: false,
    encryptionKey: key,
    masterUser: {
      masterUsername: 'admin',
    },
    vpc,
  };

  // THEN
  expect(() => {
    new Cluster(stack, 'Redshift', props);
  }).toThrowError();

});

test('throws when trying to add single user rotation multiple times', () => {
  // GIVEN
  const cluster = new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
    },
    vpc,
  });

  // WHEN
  cluster.addRotationSingleUser();

  // THEN
  expect(() => {
    cluster.addRotationSingleUser();
  }).toThrowError();
});

test('can use existing cluster subnet group', () => {
  // GIVEN
  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
    },
    vpc,
    subnetGroup: ClusterSubnetGroup.fromClusterSubnetGroupName(stack, 'Group', 'my-existing-cluster-subnet-group'),
  });

  Template.fromStack(stack).resourceCountIs('AWS::Redshift::ClusterSubnetGroup', 0);
  Template.fromStack(stack).hasResourceProperties('AWS::Redshift::Cluster', {
    ClusterSubnetGroupName: 'my-existing-cluster-subnet-group',
  });
});

test('default child returns a CfnCluster', () => {
  const cluster = new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
    },
    vpc,
  });

  expect(cluster.node.defaultChild).toBeInstanceOf(CfnCluster);
});

test.each([
  ['elastic', false],
  ['classic', true],
])('resize type (%s)', (_, classicResizing) => {
  // WHEN
  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
      masterPassword: cdk.SecretValue.unsafePlainText('tooshort'),
    },
    classicResizing,
    vpc,
  });

  // THEN
  Template.fromStack(stack).hasResource('AWS::Redshift::Cluster', {
    Properties: {
      AllowVersionUpgrade: true,
      MasterUsername: 'admin',
      MasterUserPassword: 'tooshort',
      ClusterType: 'multi-node',
      AutomatedSnapshotRetentionPeriod: 1,
      Encrypted: true,
      NumberOfNodes: 2,
      NodeType: 'dc2.large',
      DBName: 'default_db',
      PubliclyAccessible: false,
      ClusterSubnetGroupName: { Ref: 'RedshiftSubnetsDFE70E0A' },
      VpcSecurityGroupIds: [{ 'Fn::GetAtt': ['RedshiftSecurityGroup796D74A7', 'GroupId'] }],
      Classic: classicResizing,
    },
    DeletionPolicy: 'Retain',
    UpdateReplacePolicy: 'Retain',
  });
});

test('resize type not set', () => {
  // WHEN
  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
      masterPassword: cdk.SecretValue.unsafePlainText('tooshort'),
    },
    vpc,
  });

  // THEN
  Template.fromStack(stack).hasResource('AWS::Redshift::Cluster', {
    Properties: {
      AllowVersionUpgrade: true,
      MasterUsername: 'admin',
      MasterUserPassword: 'tooshort',
      ClusterType: 'multi-node',
      AutomatedSnapshotRetentionPeriod: 1,
      Encrypted: true,
      NumberOfNodes: 2,
      NodeType: 'dc2.large',
      DBName: 'default_db',
      PubliclyAccessible: false,
      ClusterSubnetGroupName: { Ref: 'RedshiftSubnetsDFE70E0A' },
      VpcSecurityGroupIds: [{ 'Fn::GetAtt': ['RedshiftSecurityGroup796D74A7', 'GroupId'] }],
    },
    DeletionPolicy: 'Retain',
    UpdateReplacePolicy: 'Retain',
  });
});

test('elastic ip address', () => {
  // WHEN
  new Cluster(stack, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
      masterPassword: cdk.SecretValue.unsafePlainText('tooshort'),
    },
    vpc,
    elasticIp: '1.3.3.7',
  });

  // THEN
  Template.fromStack(stack).hasResource('AWS::Redshift::Cluster', {
    Properties: {
      AllowVersionUpgrade: true,
      MasterUsername: 'admin',
      MasterUserPassword: 'tooshort',
      ClusterType: 'multi-node',
      AutomatedSnapshotRetentionPeriod: 1,
      Encrypted: true,
      NumberOfNodes: 2,
      NodeType: 'dc2.large',
      DBName: 'default_db',
      PubliclyAccessible: false,
      ClusterSubnetGroupName: { Ref: 'RedshiftSubnetsDFE70E0A' },
      VpcSecurityGroupIds: [{ 'Fn::GetAtt': ['RedshiftSecurityGroup796D74A7', 'GroupId'] }],
      ElasticIp: '1.3.3.7',
    },
    DeletionPolicy: 'Retain',
    UpdateReplacePolicy: 'Retain',
  });
});

describe('reboot for Parameter Changes', () => {
  test('throw error for cluster without parameter group', () => {
    // Given
    const cluster = new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
    });
    cluster.enableRebootForParameterChanges();
    // WHEN
    expect(() => Template.fromStack(stack))
      // THEN
      .toThrowError(/Cannot enable reboot for parameter changes/);
  });

  test('throw error for cluster with imported parameter group', () => {
    // Given
    const cluster = new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
      parameterGroup: ClusterParameterGroup.fromClusterParameterGroupName(stack, 'foo', 'bar'),
    });
    cluster.enableRebootForParameterChanges();
    // WHEN
    expect(() => Template.fromStack(stack))
      // THEN
      .toThrowError(/Cannot enable reboot for parameter changes/);
  });

  test('not throw error when parameter group is created after enabling reboots', () => {
    // Given
    const cluster = new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
      rebootForParameterChanges: true,
    });
    cluster.addToParameterGroup('foo', 'bar');
    // WHEN
    expect(() => Template.fromStack(stack))
      // THEN
      .not.toThrowError(/Cannot enable reboot for parameter changes/);
  });

  test('not create duplicate resources when reboot feature is enabled multiple times on a cluster', () => {
    // Given
    const cluster = new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
      rebootForParameterChanges: true,
    });
    cluster.addToParameterGroup('foo', 'bar');
    //WHEN
    cluster.enableRebootForParameterChanges();
    // THEN
    Template.fromStack(stack).resourceCountIs('Custom::RedshiftClusterRebooter', 1);
  });

  test('cluster with parameter group', () => {
    // Given
    const cluster = new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
    });
    cluster.addToParameterGroup('foo', 'bar');

    const cluster2 = new Cluster(stack, 'Redshift2', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
    });
    cluster2.addToParameterGroup('foo', 'bar');

    // WHEN
    cluster.enableRebootForParameterChanges();
    cluster2.enableRebootForParameterChanges();

    //THEN
    const template = Template.fromStack(stack);
    template.resourceCountIs('Custom::RedshiftClusterRebooter', 2);
    template.templateMatches({
      Resources: {
        SingletonLambda511e207f13df4b8bb632c32b30b65ac281740AC5: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Handler: 'index.handler',
            Runtime: 'nodejs16.x',
            Timeout: 900,
          },
        },
      },
    });
  });

  test('Custom resource ParametersString property updates', () => {
    // Given
    const cluster = new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
    });
    cluster.addToParameterGroup('foo', 'bar');
    cluster.enableRebootForParameterChanges();

    // WHEN
    cluster.addToParameterGroup('lorem', 'ipsum');

    //THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::RedshiftClusterRebooter', {
      ParametersString: JSON.stringify(
        {
          foo: 'bar',
          lorem: 'ipsum',
        },
      ),
    });
  });
});

describe('default IAM role', () => {

  test('Default role not in role list', () => {
    // GIVEN
    const clusterRole1 = new iam.Role(stack, 'clusterRole1', { assumedBy: new iam.ServicePrincipal('redshift.amazonaws.com') });
    const defaultRole1 = new iam.Role(stack, 'defaultRole1', { assumedBy: new iam.ServicePrincipal('redshift.amazonaws.com') });

    expect(() => {
      new Cluster(stack, 'Redshift', {
        masterUser: {
          masterUsername: 'admin',
        },
        vpc,
        roles: [clusterRole1],
        defaultRole: defaultRole1,
      });
    }).toThrow(/Default role must be included in role list./);
  });

  test('throws error when default role not attached to cluster when adding default role post creation', () => {
    const defaultRole1 = new iam.Role(stack, 'defaultRole1', { assumedBy: new iam.ServicePrincipal('redshift.amazonaws.com') });
    const cluster = new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
    });

    expect(() => {
      cluster.addDefaultIamRole(defaultRole1);
    }).toThrow(/Default role must be associated to the Redshift cluster to be set as the default role./);
  });
});

describe('IAM role', () => {
  test('roles can be directly attached to cluster during declaration', () => {
    // GIVEN
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('redshift.amazonaws.com'),
    });
    new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
      roles: [role],
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::Redshift::Cluster', {
      Properties: {
        IamRoles: Match.arrayEquals([
          { 'Fn::GetAtt': [Match.stringLikeRegexp('Role*'), 'Arn'] },
        ]),
      },
    });
  });

  test('roles can be attached to cluster after declaration', () => {
    // GIVEN
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('redshift.amazonaws.com'),
    });
    const cluster = new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
    });

    // WHEN
    cluster.addIamRole(role);

    // THEN
    Template.fromStack(stack).hasResource('AWS::Redshift::Cluster', {
      Properties: {
        IamRoles: Match.arrayEquals([
          { 'Fn::GetAtt': [Match.stringLikeRegexp('Role*'), 'Arn'] },
        ]),
      },
    });
  });

  test('roles can be attached to cluster in another stack', () => {
    // GIVEN
    const cluster = new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
    });

    const newTestStack = new cdk.Stack(stack, 'NewTestStack', { env: { account: stack.account, region: stack.region } });
    const role = new iam.Role(newTestStack, 'Role', {
      assumedBy: new iam.ServicePrincipal('redshift.amazonaws.com'),
    });

    // WHEN
    cluster.addIamRole(role);

    // THEN
    Template.fromStack(stack).hasResource('AWS::Redshift::Cluster', {
      Properties: {
        IamRoles: Match.arrayEquals([
          { 'Fn::ImportValue': Match.stringLikeRegexp('NewTestStack:ExportsOutputFnGetAttRole*') },
        ]),
      },
    });
  });

  test('throws when adding role that is already in cluster', () => {
    // GIVEN
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('redshift.amazonaws.com'),
    });
    const cluster = new Cluster(stack, 'Redshift', {
      masterUser: {
        masterUsername: 'admin',
      },
      vpc,
      roles: [role],
    });

    expect(() =>
      // WHEN
      cluster.addIamRole(role),
      // THEN
    ).toThrow(`Role '${role.roleArn}' is already attached to the cluster`);
  });
});

function testStack() {
  const newTestStack = new cdk.Stack(undefined, undefined, { env: { account: '12345', region: 'us-test-1' } });
  newTestStack.node.setContext('availability-zones:12345:us-test-1', ['us-test-1a', 'us-test-1b']);
  return newTestStack;
}
