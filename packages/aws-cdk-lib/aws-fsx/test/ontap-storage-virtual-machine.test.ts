import { Annotations, Match, Template } from '../../assertions';
import { Vpc } from '../../aws-ec2';
import { Secret } from '../../aws-secretsmanager';
import { CfnParameter, RemovalPolicy, SecretValue, Stack } from '../../core';
import {
  OntapDeploymentType,
  OntapFileSystem,
  OntapFileSystemSecret,
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
        name: 'test_svm',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::StorageVirtualMachine', {
        Name: 'test_svm',
      });
    });

    test('creates an SVM with root volume security style', () => {
      new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test_svm',
        rootVolumeSecurityStyle: SecurityStyle.NTFS,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::StorageVirtualMachine', {
        Name: 'test_svm',
        RootVolumeSecurityStyle: 'NTFS',
      });
    });

    test('accepts a token-based admin password without warning', () => {
      const secret = new OntapFileSystemSecret(stack, 'AdminSecret');

      new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test_svm',
        svmAdminPassword: secret.secretValueFromJson('password'),
      });

      // The synthesized SvmAdminPassword should be a CloudFormation dynamic
      // reference, not a literal string.
      const resources = Template.fromStack(stack).findResources('AWS::FSx::StorageVirtualMachine');
      const svm = Object.values(resources)[0] as any;
      expect(typeof svm.Properties.SvmAdminPassword).toBe('object');
      // No plain-text-secret warning should be attached.
      Annotations.fromStack(stack).hasNoWarning('/Default/Svm', Match.stringLikeRegexp('svmAdminPassword.*literal string'));
    });

    test('accepts a literal admin password but emits a warning', () => {
      new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test_svm',
        svmAdminPassword: SecretValue.unsafePlainText('LiteralPassword123'),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::StorageVirtualMachine', {
        SvmAdminPassword: 'LiteralPassword123',
      });
      Annotations.fromStack(stack).hasWarning('/Default/Svm', Match.stringLikeRegexp('svmAdminPassword.*literal string'));
    });

    test('creates an SVM with Active Directory configuration', () => {
      new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test_svm',
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
        ActiveDirectoryConfiguration: Match.objectLike({
          NetBiosName: 'MYSVM',
          SelfManagedActiveDirectoryConfiguration: Match.objectLike({
            DnsIps: ['10.0.0.1', '10.0.0.2'],
            DomainName: 'corp.example.com',
            UserName: 'Admin',
            Password: 'ADPassword123',
            OrganizationalUnitDistinguishedName: 'OU=Computers,DC=corp,DC=example,DC=com',
          }),
        }),
      });
    });

    test('exposes storageVirtualMachineId', () => {
      const svm = new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test_svm',
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
      }).toThrow(/'name' must be between 1 and 47 characters/);
    });

    test('throws if name exceeds 47 characters', () => {
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: 'a'.repeat(48),
        });
      }).toThrow(/'name' must be between 1 and 47 characters/);
    });

    test('throws if name does not start with a letter', () => {
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: '1invalid',
        });
      }).toThrow(/'name' must start with a letter/);
    });

    test('throws if name contains hyphens or other invalid characters', () => {
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: 'test-svm',
        });
      }).toThrow(/'name' must start with a letter/);
    });
  });

  describe('extra coverage', () => {
    test('exposes resourceArn', () => {
      const svm = new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test_svm',
      });

      expect(svm.resourceArn).toBeDefined();
    });

    test('applies a removalPolicy of DESTROY', () => {
      new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test_svm',
        removalPolicy: RemovalPolicy.DESTROY,
      });

      Template.fromStack(stack).hasResource('AWS::FSx::StorageVirtualMachine', {
        DeletionPolicy: 'Delete',
      });
    });

    test('emits warning for literal AD self-managed AD password', () => {
      new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test_svm',
        activeDirectoryConfiguration: {
          netBiosName: 'MYSVM',
          selfManagedActiveDirectoryConfiguration: {
            dnsIps: ['10.0.0.1'],
            domainName: 'corp.example.com',
            userName: 'Admin',
            password: SecretValue.unsafePlainText('LiteralADPwd'),
          },
        },
      });

      Annotations.fromStack(stack).hasWarning('/Default/Svm', Match.stringLikeRegexp('selfManagedActiveDirectoryConfiguration.password.*literal string'));
    });

    test('creates an SVM with each SecurityStyle variant', () => {
      const styles = [SecurityStyle.UNIX, SecurityStyle.NTFS, SecurityStyle.MIXED];
      styles.forEach((style, idx) => {
        new OntapStorageVirtualMachine(stack, `Svm${idx}`, {
          fileSystem,
          name: `svm_${idx}`,
          rootVolumeSecurityStyle: style,
        });
      });

      const resources = Template.fromStack(stack).findResources('AWS::FSx::StorageVirtualMachine');
      const renderedStyles = Object.values(resources).map((r: any) => r.Properties.RootVolumeSecurityStyle);
      expect(renderedStyles).toEqual(['UNIX', 'NTFS', 'MIXED']);
    });

    test('accepts an SVM name at the 47-character maximum', () => {
      new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'a' + 'b'.repeat(46), // exactly 47 chars
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::StorageVirtualMachine', {
        Name: 'a' + 'b'.repeat(46),
      });
    });

    test('skips name validation when name is a token', () => {
      const nameParam = new CfnParameter(stack, 'SvmName', { type: 'String', default: 'token_svm' });
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: nameParam.valueAsString,
        });
      }).not.toThrow();
    });

    test('renders fileSystemAdministratorsGroup in self-managed AD config', () => {
      new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test_svm',
        activeDirectoryConfiguration: {
          netBiosName: 'MYSVM',
          selfManagedActiveDirectoryConfiguration: {
            dnsIps: ['10.0.0.1'],
            domainName: 'corp.example.com',
            userName: 'Admin',
            password: SecretValue.unsafePlainText('Pwd'),
            fileSystemAdministratorsGroup: 'FSx Admins',
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::StorageVirtualMachine', {
        ActiveDirectoryConfiguration: Match.objectLike({
          SelfManagedActiveDirectoryConfiguration: Match.objectLike({
            FileSystemAdministratorsGroup: 'FSx Admins',
          }),
        }),
      });
    });

    test('renders AD configuration without selfManagedActiveDirectoryConfiguration (netBiosName only)', () => {
      new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test_svm',
        activeDirectoryConfiguration: {
          netBiosName: 'MYSVM',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::StorageVirtualMachine', {
        ActiveDirectoryConfiguration: {
          NetBiosName: 'MYSVM',
        },
      });
    });

    test('does not emit warning when self-managed AD password is token-based', () => {
      const secret = new OntapFileSystemSecret(stack, 'AdSecret');

      new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'test_svm',
        activeDirectoryConfiguration: {
          netBiosName: 'MYSVM',
          selfManagedActiveDirectoryConfiguration: {
            dnsIps: ['10.0.0.1'],
            domainName: 'corp.example.com',
            userName: 'Admin',
            password: secret.secretValueFromJson('password'),
          },
        },
      });

      Annotations.fromStack(stack).hasNoWarning('/Default/Svm', Match.stringLikeRegexp('selfManagedActiveDirectoryConfiguration\\.password.*literal string'));
    });
  });
});

describe('FSx for NetApp ONTAP SVM additional coverage', () => {
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
      ontapConfiguration: { deploymentType: OntapDeploymentType.SINGLE_AZ_1 },
    });
  });

  describe('uuid attribute', () => {
    test('exposes uuid from attrUuid', () => {
      const svm = new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'svm1',
      });
      expect(svm.uuid).toBeDefined();
      expect(typeof svm.uuid).toBe('string');
    });
  });

  describe('domainJoinServiceAccountSecret', () => {
    test('renders DomainJoinServiceAccountSecret with secret ARN', () => {
      const adSecret = Secret.fromSecretCompleteArn(
        stack, 'AdSecret',
        'arn:aws:secretsmanager:us-east-1:111122223333:secret:my-domain-join-AbCdEf');
      new OntapStorageVirtualMachine(stack, 'Svm', {
        fileSystem,
        name: 'svm1',
        activeDirectoryConfiguration: {
          netBiosName: 'svm1',
          selfManagedActiveDirectoryConfiguration: {
            dnsIps: ['10.0.0.10'],
            domainName: 'corp.example.com',
            domainJoinServiceAccountSecret: adSecret,
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::StorageVirtualMachine', {
        ActiveDirectoryConfiguration: {
          NetBiosName: 'svm1',
          SelfManagedActiveDirectoryConfiguration: {
            DnsIps: ['10.0.0.10'],
            DomainName: 'corp.example.com',
            DomainJoinServiceAccountSecret: 'arn:aws:secretsmanager:us-east-1:111122223333:secret:my-domain-join-AbCdEf',
          },
        },
      });
    });

    test('throws when both domainJoinServiceAccountSecret and userName are set', () => {
      const adSecret = Secret.fromSecretCompleteArn(
        stack, 'AdSecret',
        'arn:aws:secretsmanager:us-east-1:111122223333:secret:s-AbCdEf');
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: 'svm1',
          activeDirectoryConfiguration: {
            netBiosName: 'svm1',
            selfManagedActiveDirectoryConfiguration: {
              dnsIps: ['10.0.0.10'],
              domainName: 'corp.example.com',
              userName: 'Admin',
              password: SecretValue.unsafePlainText('Pwd1234'),
              domainJoinServiceAccountSecret: adSecret,
            },
          },
        });
      }).toThrow(/must specify either \(userName \+ password\) or domainJoinServiceAccountSecret/);
    });

    test('throws when only userName is set without password', () => {
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: 'svm1',
          activeDirectoryConfiguration: {
            netBiosName: 'svm1',
            selfManagedActiveDirectoryConfiguration: {
              dnsIps: ['10.0.0.10'],
              domainName: 'corp.example.com',
              userName: 'Admin',
            },
          },
        });
      }).toThrow(/inline credentials require both userName and password/);
    });

    test('throws when only password is set without userName', () => {
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: 'svm1',
          activeDirectoryConfiguration: {
            netBiosName: 'svm1',
            selfManagedActiveDirectoryConfiguration: {
              dnsIps: ['10.0.0.10'],
              domainName: 'corp.example.com',
              password: SecretValue.unsafePlainText('Pwd1234'),
            },
          },
        });
      }).toThrow(/inline credentials require both userName and password/);
    });

    test('throws when SMAD is configured with neither inline credentials nor a service-account secret', () => {
      // Self-managed Active Directory join requires credentials. Surfacing this at synth
      // gives users a clear CDK-side error rather than a confusing CFN-side failure at deploy.
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: 'svm1',
          activeDirectoryConfiguration: {
            netBiosName: 'svm1',
            selfManagedActiveDirectoryConfiguration: {
              dnsIps: ['10.0.0.10'],
              domainName: 'corp.example.com',
            },
          },
        });
      }).toThrow(/must specify either \(userName \+ password\) or domainJoinServiceAccountSecret/);
    });
  });

  describe('AD shape validation', () => {
    test('throws if netBiosName exceeds 15 characters', () => {
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: 'svm1',
          activeDirectoryConfiguration: {
            netBiosName: 'this_name_is_too_long',
          },
        });
      }).toThrow(/'netBiosName' must be between 1 and 15 characters/);
    });

    test('throws if netBiosName contains whitespace', () => {
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: 'svm1',
          activeDirectoryConfiguration: {
            netBiosName: 'has space',
          },
        });
      }).toThrow(/'netBiosName' must not contain whitespace/);
    });

    test('throws if dnsIps is empty', () => {
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: 'svm1',
          activeDirectoryConfiguration: {
            netBiosName: 'svm1',
            selfManagedActiveDirectoryConfiguration: {
              dnsIps: [],
              domainName: 'corp.example.com',
              userName: 'Admin',
              password: SecretValue.unsafePlainText('Pwd'),
            },
          },
        });
      }).toThrow(/'selfManagedActiveDirectoryConfiguration\.dnsIps' must contain between 1 and 3 entries/);
    });

    test('throws if dnsIps has more than 3 entries', () => {
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: 'svm1',
          activeDirectoryConfiguration: {
            netBiosName: 'svm1',
            selfManagedActiveDirectoryConfiguration: {
              dnsIps: ['10.0.0.1', '10.0.0.2', '10.0.0.3', '10.0.0.4'],
              domainName: 'corp.example.com',
              userName: 'Admin',
              password: SecretValue.unsafePlainText('Pwd'),
            },
          },
        });
      }).toThrow(/'selfManagedActiveDirectoryConfiguration\.dnsIps' must contain between 1 and 3 entries/);
    });

    test('throws if domainName exceeds 255 characters', () => {
      expect(() => {
        new OntapStorageVirtualMachine(stack, 'Svm', {
          fileSystem,
          name: 'svm1',
          activeDirectoryConfiguration: {
            netBiosName: 'svm1',
            selfManagedActiveDirectoryConfiguration: {
              dnsIps: ['10.0.0.10'],
              domainName: 'a'.repeat(256),
              userName: 'Admin',
              password: SecretValue.unsafePlainText('Pwd'),
            },
          },
        });
      }).toThrow(/'selfManagedActiveDirectoryConfiguration\.domainName' must be between 1 and 255 characters/);
    });
  });
});
