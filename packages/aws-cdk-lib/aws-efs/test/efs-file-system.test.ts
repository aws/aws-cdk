import { Template, Match } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import { App, RemovalPolicy, Size, Stack, Tags } from '../../core';
import * as cxapi from '../../cx-api';
import { FileSystem, LifecyclePolicy, PerformanceMode, ThroughputMode, OutOfInfrequentAccessPolicy, ReplicationOverwriteProtection } from '../lib';
import { ReplicationConfiguration } from '../lib/efs-file-system';

let stack = new Stack();
let vpc = new ec2.Vpc(stack, 'VPC');

beforeEach(() => {
  stack = new Stack();
  vpc = new ec2.Vpc(stack, 'VPC');
});

test('encryption is enabled by default', () => {
  const customStack = new Stack();

  const customVpc = new ec2.Vpc(customStack, 'VPC');
  new FileSystem(customVpc, 'EfsFileSystem', {
    vpc: customVpc,
  });

  Template.fromStack(customStack).hasResourceProperties('AWS::EFS::FileSystem', {
    Encrypted: true,
  });
});

test('default file system is created correctly', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
  });
  // THEN
  const assertions = Template.fromStack(stack);
  assertions.hasResource('AWS::EFS::FileSystem', {
    DeletionPolicy: 'Retain',
    UpdateReplacePolicy: 'Retain',
  });
  assertions.resourceCountIs('AWS::EFS::MountTarget', 2);
  assertions.resourceCountIs('AWS::EC2::SecurityGroup', 1);
});

test('unencrypted file system is created correctly with default KMS', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    encrypted: false,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    Encrypted: false,
  });
});

test('encrypted file system is created correctly with default KMS', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    encrypted: true,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    Encrypted: true,
  });
});

test('encrypted file system is created correctly with custom KMS', () => {
  const key = new kms.Key(stack, 'customKeyFS');

  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    encrypted: true,
    kmsKey: key,
  });
  // THEN

  /*
   * CDK appends 8-digit MD5 hash of the resource path to the logical Id of the resource in order to make sure
   * that the id is unique across multiple stacks. There isnt a direct way to identify the exact name of the resource
   * in generated CDK, hence hardcoding the MD5 hash here for assertion. Assumption is that the path of the Key wont
   * change in this UT. Checked the unique id by generating the cloud formation stack.
   */
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    Encrypted: true,
    KmsKeyId: {
      'Fn::GetAtt': [
        'customKeyFSDDB87C6D',
        'Arn',
      ],
    },
  });
});

test('file system is created correctly with a life cycle property', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    lifecyclePolicy: LifecyclePolicy.AFTER_7_DAYS,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    LifecyclePolicies: [{
      TransitionToIA: 'AFTER_7_DAYS',
    }],
  });
});

test('file system LifecyclePolicies is created correctly', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    lifecyclePolicy: LifecyclePolicy.AFTER_7_DAYS,
    outOfInfrequentAccessPolicy: OutOfInfrequentAccessPolicy.AFTER_1_ACCESS,
    transitionToArchivePolicy: LifecyclePolicy.AFTER_14_DAYS,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    LifecyclePolicies: [
      {
        TransitionToIA: 'AFTER_7_DAYS',
      },
      {
        TransitionToPrimaryStorageClass: 'AFTER_1_ACCESS',
      },
      {
        TransitionToArchive: 'AFTER_14_DAYS',
      },
    ],
  });
});

test('file system with transition to archive is created correctly', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    transitionToArchivePolicy: LifecyclePolicy.AFTER_1_DAY,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    LifecyclePolicies: [
      {
        TransitionToArchive: 'AFTER_1_DAY',
      },
    ],
  });
});

test('LifecyclePolicies should be disabled when lifecyclePolicy and outInfrequentAccessPolicy are not specified', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    LifecyclePolicies: Match.absent(),
  });
});

test('file system is created correctly with performance mode', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    performanceMode: PerformanceMode.MAX_IO,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    PerformanceMode: 'maxIO',
  });
});

test('file system is created correctly with bursting throughput mode', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    throughputMode: ThroughputMode.BURSTING,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    ThroughputMode: 'bursting',
  });
});

test('file system is created correctly with elastic throughput mode', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    throughputMode: ThroughputMode.ELASTIC,
    performanceMode: PerformanceMode.GENERAL_PURPOSE,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    ThroughputMode: 'elastic',
  });
});

test('Exception when throughput mode is set to ELASTIC, performance mode cannot be MaxIO', () => {
  expect(() => {
    new FileSystem(stack, 'EfsFileSystem', {
      vpc,
      throughputMode: ThroughputMode.ELASTIC,
      performanceMode: PerformanceMode.MAX_IO,
    });
  }).toThrow(/ThroughputMode ELASTIC is not supported for file systems with performanceMode MAX_IO/);
});

test('Exception when throughput mode is set to PROVISIONED, but provisioned throughput is not set', () => {
  expect(() => {
    new FileSystem(stack, 'EfsFileSystem', {
      vpc,
      throughputMode: ThroughputMode.PROVISIONED,
    });
  }).toThrow(/Property provisionedThroughputPerSecond is required when throughputMode is PROVISIONED/);
});

test('fails when provisioned throughput is less than the valid range', () => {
  expect(() => new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    throughputMode: ThroughputMode.PROVISIONED,
    provisionedThroughputPerSecond: Size.kibibytes(10),
  })).toThrow(/cannot be converted into a whole number/);
});

test('fails when provisioned throughput is not a whole number of mebibytes', () => {
  expect(() => {
    new FileSystem(stack, 'EfsFileSystem2', {
      vpc,
      throughputMode: ThroughputMode.PROVISIONED,
      provisionedThroughputPerSecond: Size.kibibytes(2050),
    });
  }).toThrow(/cannot be converted into a whole number/);
});

test('file system is created correctly with provisioned throughput mode', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    throughputMode: ThroughputMode.PROVISIONED,
    provisionedThroughputPerSecond: Size.mebibytes(5),
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    ThroughputMode: 'provisioned',
    ProvisionedThroughputInMibps: 5,
  });
});

test('existing file system is imported correctly using id', () => {
  // WHEN
  const fs = FileSystem.fromFileSystemAttributes(stack, 'existingFS', {
    fileSystemId: 'fs123',
    securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
      allowAllOutbound: false,
    }),
  });

  fs.connections.allowToAnyIpv4(ec2.Port.tcp(443));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
    GroupId: 'sg-123456789',
  });
});

test('existing file system is imported correctly using arn', () => {
  // WHEN
  const arn = stack.formatArn({
    service: 'elasticfilesystem',
    resource: 'file-system',
    resourceName: 'fs-12912923',
  });
  const fs = FileSystem.fromFileSystemAttributes(stack, 'existingFS', {
    fileSystemArn: arn,
    securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
      allowAllOutbound: false,
    }),
  });

  fs.connections.allowToAnyIpv4(ec2.Port.tcp(443));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
    GroupId: 'sg-123456789',
  });

  expect(fs.fileSystemArn).toEqual(arn);
  expect(fs.fileSystemId).toEqual('fs-12912923');
});

test('must throw an error when trying to import a fileSystem without specifying id or arn', () => {
  // WHEN
  expect(() => {
    FileSystem.fromFileSystemAttributes(stack, 'existingFS', {
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
        allowAllOutbound: false,
      }),
    });
  }).toThrow(/One of fileSystemId or fileSystemArn, but not both, must be provided./);
});

test('must throw an error when trying to import a fileSystem specifying both id and arn', () => {
  // WHEN
  const arn = stack.formatArn({
    service: 'elasticfilesystem',
    resource: 'file-system',
    resourceName: 'fs-12912923',
  });

  expect(() => {
    FileSystem.fromFileSystemAttributes(stack, 'existingFS', {
      fileSystemArn: arn,
      fileSystemId: 'fs-12343435',
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
        allowAllOutbound: false,
      }),
    });
  }).toThrow(/One of fileSystemId or fileSystemArn, but not both, must be provided./);
});

test('support granting permissions', () => {
  const fileSystem = new FileSystem(stack, 'EfsFileSystem', {
    vpc,
  });

  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.AnyPrincipal(),
  });

  fileSystem.grant(role, 'elasticfilesystem:ClientWrite');

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'elasticfilesystem:ClientWrite',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'EfsFileSystem37910666',
              'Arn',
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'RoleDefaultPolicy5FFB7DAB',
    Roles: [
      {
        Ref: 'Role1ABCC5F0',
      },
    ],
  });
});

test('support tags', () => {
  // WHEN
  const fileSystem = new FileSystem(stack, 'EfsFileSystem', {
    vpc,
  });
  Tags.of(fileSystem).add('Name', 'LookAtMeAndMyFancyTags');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    FileSystemTags: [
      { Key: 'Name', Value: 'LookAtMeAndMyFancyTags' },
    ],
  });
});

test('file system is created correctly when given a name', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    fileSystemName: 'MyNameableFileSystem',
    vpc,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    FileSystemTags: [
      { Key: 'Name', Value: 'MyNameableFileSystem' },
    ],
  });
});

test('auto-named if none provided', () => {
  // WHEN
  const fileSystem = new FileSystem(stack, 'EfsFileSystem', {
    vpc,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    FileSystemTags: [
      { Key: 'Name', Value: fileSystem.node.path },
    ],
  });
});

test('removalPolicy is DESTROY', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', { vpc, removalPolicy: RemovalPolicy.DESTROY });

  // THEN
  Template.fromStack(stack).hasResource('AWS::EFS::FileSystem', {
    DeletionPolicy: 'Delete',
    UpdateReplacePolicy: 'Delete',
  });
});

test('can specify backup policy', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', { vpc, enableAutomaticBackups: true });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    BackupPolicy: {
      Status: 'ENABLED',
    },
  });
});

test('can create when using a VPC with multiple subnets per availability zone', () => {
  // create a vpc with two subnets in the same availability zone.
  const oneAzVpc = new ec2.Vpc(stack, 'Vpc', {
    maxAzs: 1,
    subnetConfiguration: [{ name: 'One', subnetType: ec2.SubnetType.PRIVATE_ISOLATED }, { name: 'Two', subnetType: ec2.SubnetType.PRIVATE_ISOLATED }],
    natGateways: 0,
  });
  new FileSystem(stack, 'EfsFileSystem', {
    vpc: oneAzVpc,
  });
  // make sure only one mount target is created.
  Template.fromStack(stack).resourceCountIs('AWS::EFS::MountTarget', 1);
});

test('can specify file system policy', () => {
  // WHEN
  const myFileSystemPolicy = new iam.PolicyDocument({
    statements: [new iam.PolicyStatement({
      actions: [
        'elasticfilesystem:ClientWrite',
        'elasticfilesystem:ClientMount',
      ],
      principals: [new iam.ArnPrincipal('arn:aws:iam::111122223333:role/Testing_Role')],
      resources: ['arn:aws:elasticfilesystem:us-east-2:111122223333:file-system/fs-1234abcd'],
      conditions: {
        Bool: {
          'elasticfilesystem:AccessedViaMountTarget': 'true',
        },
      },
    })],
  });
  new FileSystem(stack, 'EfsFileSystem', { vpc, fileSystemPolicy: myFileSystemPolicy });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    FileSystemPolicy: {
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: 'arn:aws:iam::111122223333:role/Testing_Role',
          },
          Action: [
            'elasticfilesystem:ClientWrite',
            'elasticfilesystem:ClientMount',
          ],
          Resource: 'arn:aws:elasticfilesystem:us-east-2:111122223333:file-system/fs-1234abcd',
          Condition: {
            Bool: {
              'elasticfilesystem:AccessedViaMountTarget': 'true',
            },
          },
        },
      ],
    },
  });
});

test('can add statements to file system policy', () => {
  // WHEN
  const statement1 = new iam.PolicyStatement({
    actions: [
      'elasticfilesystem:ClientMount',
    ],
    principals: [new iam.ArnPrincipal('arn:aws:iam::111122223333:role/Testing_Role1')],
    resources: ['arn:aws:elasticfilesystem:us-east-2:111122223333:file-system/fs-1234abcd'],
    conditions: {
      Bool: {
        'elasticfilesystem:AccessedViaMountTarget': 'true',
      },
    },
  });
  const statement2 = new iam.PolicyStatement({
    actions: [
      'elasticfilesystem:ClientMount',
      'elasticfilesystem:ClientWrite',
    ],
    principals: [new iam.ArnPrincipal('arn:aws:iam::111122223333:role/Testing_Role2')],
    resources: ['arn:aws:elasticfilesystem:us-east-2:111122223333:file-system/fs-1234abcd'],
    conditions: {
      Bool: {
        'elasticfilesystem:AccessedViaMountTarget': 'true',
      },
    },
  });
  const fileSystem = new FileSystem(stack, 'EfsFileSystem', { vpc });
  fileSystem.addToResourcePolicy(statement1);
  fileSystem.addToResourcePolicy(statement2);

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    FileSystemPolicy: {
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: 'arn:aws:iam::111122223333:role/Testing_Role1',
          },
          Action: 'elasticfilesystem:ClientMount',
          Resource: 'arn:aws:elasticfilesystem:us-east-2:111122223333:file-system/fs-1234abcd',
          Condition: {
            Bool: {
              'elasticfilesystem:AccessedViaMountTarget': 'true',
            },
          },
        },
        {
          Effect: 'Allow',
          Principal: {
            AWS: 'arn:aws:iam::111122223333:role/Testing_Role2',
          },
          Action: [
            'elasticfilesystem:ClientMount',
            'elasticfilesystem:ClientWrite',
          ],
          Resource: 'arn:aws:elasticfilesystem:us-east-2:111122223333:file-system/fs-1234abcd',
          Condition: {
            Bool: {
              'elasticfilesystem:AccessedViaMountTarget': 'true',
            },
          },
        },
      ],
    },
  });
});

test('imported file system can not add statements to file system policy', () => {
  // WHEN
  const statement = new iam.PolicyStatement({
    actions: [
      'elasticfilesystem:ClientMount',
    ],
    principals: [new iam.ArnPrincipal('arn:aws:iam::111122223333:role/Testing_Role')],
    resources: ['arn:aws:elasticfilesystem:us-east-2:111122223333:file-system/fs-1234abcd'],
    conditions: {
      Bool: {
        'elasticfilesystem:AccessedViaMountTarget': 'true',
      },
    },
  });

  const fileSystem = new FileSystem(stack, 'FileSystem', { vpc });
  const importedFileSystem = FileSystem.fromFileSystemAttributes(stack, 'ImportedFileSystem', {
    securityGroup: fileSystem.connections.securityGroups[0],
    fileSystemArn: fileSystem.fileSystemArn,
  });
  const fileSystemResult = fileSystem.addToResourcePolicy(statement);
  const importedFileSystemResult = importedFileSystem.addToResourcePolicy(statement);

  // THEN
  expect(fileSystemResult).toStrictEqual({
    statementAdded: true,
    policyDependable: fileSystem,
  });
  expect(importedFileSystemResult).toStrictEqual({
    statementAdded: false,
  });
});

test('mountTargetOrderInsensitiveLogicalId flag is true', () => {
  // WHEN
  const customStack = new Stack();
  customStack.node.setContext('@aws-cdk/aws-efs:mountTargetOrderInsensitiveLogicalId', true);

  const customVpc = new ec2.Vpc(customStack, 'VPC');

  new FileSystem(customVpc, 'EfsFileSystem', {
    vpc: customVpc,
  });

  // THEN
  Template.fromStack(customStack).templateMatches({
    Resources: {
      VPCEfsFileSystemEfsMountTargetPrivateSubnet1D8128D53: {
        Type: 'AWS::EFS::MountTarget',
        Properties: {
          SubnetId: { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
        },
      },
      VPCEfsFileSystemEfsMountTargetPrivateSubnet283880431: {
        Type: 'AWS::EFS::MountTarget',
        Properties: {
          SubnetId: { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
        },
      },
    },
  });
});

test('mountTargetOrderInsensitiveLogicalId flag is false', () => {
  // WHEN
  const customStack = new Stack();
  const customVpc = new ec2.Vpc(customStack, 'VPC');

  new FileSystem(customVpc, 'EfsFileSystem', {
    vpc: customVpc,
  });

  // THEN
  Template.fromStack(customStack).templateMatches({
    Resources: {
      VPCEfsFileSystemEfsMountTarget143787C9B: {
        Type: 'AWS::EFS::MountTarget',
        Properties: {
          SubnetId: { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
        },
      },
      VPCEfsFileSystemEfsMountTarget297D688BB: {
        Type: 'AWS::EFS::MountTarget',
        Properties: {
          SubnetId: { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
        },
      },
    },
  });
});

test('anonymous access is prohibited by default when using GrantRead', () => {
  // WHEN
  const clientRole = new iam.Role(stack, 'ClientRole', { assumedBy: new iam.AnyPrincipal() });
  const fileSystem = new FileSystem(stack, 'EfsFileSystem', { vpc });
  fileSystem.grantRead(clientRole);

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'elasticfilesystem:ClientMount',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'EfsFileSystem37910666',
              'Arn',
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'ClientRoleDefaultPolicy6F610F20',
    Roles: [
      {
        Ref: 'ClientRole910E33D4',
      },
    ],
  });
  template.hasResourceProperties('AWS::EFS::FileSystem', {
    FileSystemPolicy: {
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: '*',
          },
          Action: [
            'elasticfilesystem:ClientWrite',
            'elasticfilesystem:ClientRootAccess',
          ],
          Condition: {
            Bool: {
              'elasticfilesystem:AccessedViaMountTarget': 'true',
            },
          },
        },
      ],
    },
  });
});

test('anonymous access is prohibited by default when using GrantReadWrite', () => {
  // WHEN
  const clientRole = new iam.Role(stack, 'ClientRole', { assumedBy: new iam.AnyPrincipal() });
  const fileSystem = new FileSystem(stack, 'EfsFileSystem', { vpc });
  fileSystem.grantReadWrite(clientRole);

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'elasticfilesystem:ClientMount',
            'elasticfilesystem:ClientWrite',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'EfsFileSystem37910666',
              'Arn',
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'ClientRoleDefaultPolicy6F610F20',
    Roles: [
      {
        Ref: 'ClientRole910E33D4',
      },
    ],
  });
  template.hasResourceProperties('AWS::EFS::FileSystem', {
    FileSystemPolicy: {
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: '*',
          },
          Action: [
            'elasticfilesystem:ClientWrite',
            'elasticfilesystem:ClientRootAccess',
          ],
          Condition: {
            Bool: {
              'elasticfilesystem:AccessedViaMountTarget': 'true',
            },
          },
        },
      ],
    },
  });
});

test('anonymous access is prohibited by default when using GrantRootAccess', () => {
  // WHEN
  const clientRole = new iam.Role(stack, 'ClientRole', { assumedBy: new iam.AnyPrincipal() });
  const fileSystem = new FileSystem(stack, 'EfsFileSystem', { vpc });
  fileSystem.grantRootAccess(clientRole);

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'elasticfilesystem:ClientMount',
            'elasticfilesystem:ClientWrite',
            'elasticfilesystem:ClientRootAccess',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'EfsFileSystem37910666',
              'Arn',
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'ClientRoleDefaultPolicy6F610F20',
    Roles: [
      {
        Ref: 'ClientRole910E33D4',
      },
    ],
  });
  template.hasResourceProperties('AWS::EFS::FileSystem', {
    FileSystemPolicy: {
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: '*',
          },
          Action: [
            'elasticfilesystem:ClientWrite',
            'elasticfilesystem:ClientRootAccess',
          ],
          Condition: {
            Bool: {
              'elasticfilesystem:AccessedViaMountTarget': 'true',
            },
          },
        },
      ],
    },
  });
});

test('anonymous access is prohibited by the allowAnonymousAccess props even when GrantXXX is not used', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    allowAnonymousAccess: false,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    FileSystemPolicy: {
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: '*',
          },
          Action: [
            'elasticfilesystem:ClientWrite',
            'elasticfilesystem:ClientRootAccess',
          ],
          Condition: {
            Bool: {
              'elasticfilesystem:AccessedViaMountTarget': 'true',
            },
          },
        },
      ],
    },
  });
});

test('anonymous access is allowed by allowAnonymousAccess props when using GrantXxx', () => {
  // WHEN
  const clientRole = new iam.Role(stack, 'ClientRole', { assumedBy: new iam.AnyPrincipal() });
  const fileSystem = new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    allowAnonymousAccess: true,
  });
  fileSystem.grantRead(clientRole);
  fileSystem.grantReadWrite(clientRole);
  fileSystem.grantRootAccess(clientRole);

  // THEN
  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::EFS::FileSystem', 1);
  template.hasResourceProperties('AWS::EFS::FileSystem', {
    FileSystemPolicy: Match.absent(),
  });
});

test('anonymous access is prohibited by the @aws-cdk/aws-efs:denyAnonymousAccess feature flag', () => {
  // WHEN
  const app = new App({
    context: {
      [cxapi.EFS_DENY_ANONYMOUS_ACCESS]: true,
    },
  });
  const customStack = new Stack(app);
  const customVpc = new ec2.Vpc(customStack, 'VPC');
  new FileSystem(customStack, 'EfsFileSystem', {
    vpc: customVpc,
  });

  // THEN
  Template.fromStack(customStack).hasResourceProperties('AWS::EFS::FileSystem', {
    FileSystemPolicy: {
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: '*',
          },
          Action: [
            'elasticfilesystem:ClientWrite',
            'elasticfilesystem:ClientRootAccess',
          ],
          Condition: {
            Bool: {
              'elasticfilesystem:AccessedViaMountTarget': 'true',
            },
          },
        },
      ],
    },
  });
});

test('specify availabilityZoneName to create mount targets in a specific AZ', () => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    oneZone: true,
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::EFS::FileSystem', {
    AvailabilityZoneName: {
      'Fn::Select': [
        0,
        {
          'Fn::GetAZs': '',
        },
      ],
    },
  });

  // make sure only one mount target is created.
  template.resourceCountIs('AWS::EFS::MountTarget', 1);
});

test('one zone file system with MAX_IO performance mode is not supported', () => {
  // THEN
  expect(() => {
    new FileSystem(stack, 'EfsFileSystem', {
      vpc,
      oneZone: true,
      performanceMode: PerformanceMode.MAX_IO,
    });
  }).toThrow(/performanceMode MAX_IO is not supported for One Zone file systems./);
});

test('one zone file system with vpcSubnets but availabilityZones undefined is not supported', () => {
  // THEN
  expect(() => {
    new FileSystem(stack, 'EfsFileSystem', {
      vpc,
      oneZone: true,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });
  }).toThrow(/When oneZone is enabled and vpcSubnets defined, vpcSubnets.availabilityZones can not be undefined./);
});

test('one zone file system with vpcSubnets but availabilityZones not in the vpc', () => {
  // THEN
  expect(() => {
    // vpc with defined AZs
    const vpc2 = new ec2.Vpc(stack, 'Vpc2', { availabilityZones: ['zonea', 'zoneb', 'zonec'] });
    new FileSystem(stack, 'EfsFileSystem', {
      vpc: vpc2,
      oneZone: true,
      vpcSubnets: { availabilityZones: ['not-exist-zone'] },
    });
  }).toThrow(/vpcSubnets.availabilityZones specified is not in vpc.availabilityZones./);
});

test('one zone file system with vpcSubnets but vpc.availabilityZones are dummy or unresolved tokens', () => {
  // THEN
  // this should not throw because vpc.availabilityZones are unresolved or dummy values
  expect(() => {
    new FileSystem(stack, 'EfsFileSystem', {
      vpc,
      oneZone: true,
      vpcSubnets: { availabilityZones: ['not-exist-zone'] },
    });
  }).not.toThrow();
});

test('one zone file system with vpcSubnets.availabilityZones having 1 AZ.', () => {
  // THEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    oneZone: true,
    vpcSubnets: { availabilityZones: ['us-east-1a'] },
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    AvailabilityZoneName: 'us-east-1a',
  });

});

test('one zone file system with vpcSubnets.availabilityZones having more than 1 AZ.', () => {
  // THEN
  expect(() => {
    new FileSystem(stack, 'EfsFileSystem', {
      vpc,
      oneZone: true,
      vpcSubnets: { availabilityZones: ['mock-az1', 'mock-az2'] },
    });
  }).toThrow(/When oneZone is enabled, vpcSubnets.availabilityZones should exactly have one zone./);
});

test('one zone file system with vpcSubnets.availabilityZones empty.', () => {
  // THEN
  expect(() => {
    new FileSystem(stack, 'EfsFileSystem', {
      vpc,
      oneZone: true,
      vpcSubnets: { availabilityZones: [] },
    });
  }).toThrow(/When oneZone is enabled, vpcSubnets.availabilityZones should exactly have one zone./);
});

test.each([
  ReplicationOverwriteProtection.ENABLED, ReplicationOverwriteProtection.DISABLED,
])('create read-only file system for replication destination', ( replicationOverwriteProtection ) => {
  // WHEN
  new FileSystem(stack, 'EfsFileSystem', {
    vpc,
    replicationOverwriteProtection,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
    FileSystemProtection: {
      ReplicationOverwriteProtection: replicationOverwriteProtection,
    },
  });
});

describe('replication configuration', () => {
  test('regional file system', () => {
    // WHEN
    new FileSystem(stack, 'EfsFileSystem', {
      vpc,
      replicationConfiguration: ReplicationConfiguration.regionalFileSystem('ap-northeast-1'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
      ReplicationConfiguration: {
        Destinations: [
          {
            Region: 'ap-northeast-1',
          },
        ],
      },
    });
  });

  test('specify destination file system', () => {
    // WHEN
    const destination = new FileSystem(stack, 'DestinationFileSystem', {
      vpc,
      replicationOverwriteProtection: ReplicationOverwriteProtection.DISABLED,
    });
    new FileSystem(stack, 'EfsFileSystem', {
      vpc,
      replicationConfiguration: ReplicationConfiguration.existingFileSystem(destination),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
      ReplicationConfiguration: {
        Destinations: [
          {
            FileSystemId: {
              Ref: 'DestinationFileSystem12545967',
            },
          },
        ],
      },
    });
  });

  test('one zone file system', () => {
    // WHEN
    new FileSystem(stack, 'EfsFileSystem', {
      vpc,
      replicationConfiguration: ReplicationConfiguration.oneZoneFileSystem(
        'us-east-1',
        'us-east-1a',
        new kms.Key(stack, 'customKey'),
      ),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
      ReplicationConfiguration: {
        Destinations: [
          {
            Region: 'us-east-1',
            AvailabilityZoneName: 'us-east-1a',
            KmsKeyId: {
              'Fn::GetAtt': [
                'customKeyFEB2B57F',
                'Arn',
              ],
            },
          },
        ],
      },
    });
  });

  test('throw error for read-only file system', () => {
    // THEN
    expect(() => {
      new FileSystem(stack, 'EfsFileSystem', {
        vpc,
        replicationConfiguration: ReplicationConfiguration.regionalFileSystem('ap-northeast-1'),
        replicationOverwriteProtection: ReplicationOverwriteProtection.DISABLED,
      });
    }).toThrow('Cannot configure \'replicationConfiguration\' when \'replicationOverwriteProtection\' is set to \'DISABLED\'');
  });
});
