import { strictEqual } from 'assert';
import { Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import { Key } from '../../aws-kms';
import { Aws, Duration, Stack, Token } from '../../core';
import * as fsx from '../lib';

describe('FSx for Lustre File System', () => {
  let ontapConfiguration: fsx.OntapConfiguration;
  let stack: Stack;
  let vpc: ec2.Vpc;

  beforeEach(() => {
    stack = new Stack();
    vpc = new ec2.Vpc(stack, 'VPC');
  });

  test('default multi az file system', () => {
    ontapConfiguration = {
      deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
      prefferredSubnet: vpc.privateSubnets[0],
    };

    const fileSystem = new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
      ontapConfiguration,
      storageCapacityGiB: 1200,
      vpc,
      vpcSubnets: vpc.privateSubnets,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
      FileSystemType: 'ONTAP',
      SubnetIds: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
      ],
      OntapConfiguration: {
        DeploymentType: 'MULTI_AZ_2',
        AutomaticBackupRetentionDays: 0,
        PreferredSubnetId: {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      VpcId: {
        Ref: 'VPCB9E5F0B4',
      },
    });
    strictEqual(
      fileSystem.dnsName,
      `management.${fileSystem.fileSystemId}.fsx.${stack.region}.${Aws.URL_SUFFIX}`,
    );
    strictEqual(
      fileSystem.interClusterDnsName,
      `intercluster.${fileSystem.fileSystemId}.fsx.${stack.region}.${Aws.URL_SUFFIX}`,
    );
  });
});