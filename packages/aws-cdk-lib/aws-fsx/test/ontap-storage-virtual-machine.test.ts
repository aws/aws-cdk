import { Template } from '../../assertions';
import { Vpc } from '../../aws-ec2';
import { SecretValue, Stack } from '../../core';
import {
  OntapDeploymentType,
  OntapFileSystem,
  OntapStorageVirtualMachine,
  SecurityStyle,
} from '../lib';

describe('FSx for NetApp ONTAP Storage Virtual Machine', () => {
  let stack: Stack;
  let vpc: Vpc;
  let fileSystem: OntapFileSystem;

  beforeEach(() => {
    stack = new Stack();
    vpc = new Vpc(stack, 'VPC');
    fileSystem = new OntapFileSystem(stack, 'OntapFs', {
      vpc,
      vpcSubnets: [vpc.privateSubnets[0]],
      storageCapacityGiB: 1024,
      ontapConfiguration: {
        deploymentType: OntapDeploymentType.SINGLE_AZ_1,
      },
    });
  });

  describe('basic creation', () => {
    test('creates an SVM with minimal props', () => {
      new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test-svm',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::StorageVirtualMachine', {
        Name: 'test-svm',
      });
    });

    test('creates an SVM with root volume security style', () => {
      new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test-svm',
        rootVolumeSecurityStyle: SecurityStyle.NTFS,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::StorageVirtualMachine', {
        Name: 'test-svm',
        RootVolumeSecurityStyle: 'NTFS',
      });
    });

    test('creates an SVM with admin password', () => {
      new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test-svm',
        svmAdminPassword: SecretValue.unsafePlainText('MyPassword123'),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::StorageVirtualMachine', {
        SvmAdminPassword: 'MyPassword123',
      });
    });

    test('creates an SVM with Active Directory configuration', () => {
      new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test-svm',
        activeDirectoryConfiguration: {
          netBiosName: 'MYSVM',
          selfManagedActiveDirectoryConfiguration: {
            dnsIps: ['10.0.0.1', '10.0.0.2'],
            domainName: 'corp.example.com',
            userName: 'Admin',
            password: SecretValue.unsafePlainText('ADPassword123'),
            organizationalUnitDistinguishedName: 'OU=Computers,DC=corp,DC=example,DC=com',
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::StorageVirtualMachine', {
        ActiveDirectoryConfiguration: {
          NetBiosName: 'MYSVM',
          SelfManagedActiveDirectoryConfiguration: {
            DnsIps: ['10.0.0.1', '10.0.0.2'],
            DomainName: 'corp.example.com',
            UserName: 'Admin',
            Password: 'ADPassword123',
          },
        },
      });
    });

    test('exposes storageVirtualMachineId', () => {
      const svm = new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test-svm',
      });

      expect(svm.storageVirtualMachineId).toBeDefined();
    });
  });

  describe('validation', () => {
    test('throws if name is empty', () => {
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: '',
        });
      }).toThrow(/name/);
    });

    test('throws if name exceeds 47 characters', () => {
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: 'a'.repeat(48),
        });
      }).toThrow(/name/);
    });

    test('throws if svmAdminPassword is too short', () => {
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: 'test-svm',
          svmAdminPassword: SecretValue.unsafePlainText('short'),
        });
      }).toThrow(/svmAdminPassword/);
    });
  });
});
