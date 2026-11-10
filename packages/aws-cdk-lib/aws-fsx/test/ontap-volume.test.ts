import { Match, Template } from '../../assertions';
import { Vpc } from '../../aws-ec2';
import type { IResolvable } from '../../core';
import { CfnParameter, Duration, RemovalPolicy, Stack, Token } from '../../core';
import {
  AutocommitPeriodType,
  OntapDeploymentType,
  OntapFileSystem,
  OntapStorageVirtualMachine,
  OntapVolume,
  OntapVolumeType,
  PrivilegedDelete,
  RetentionPeriodType,
  SecurityStyle,
  SnaplockType,
  TieringPolicyName,
  VolumeStyle,
} from '../lib';

describe('FSx for NetApp ONTAP Volume', () => {
  let stack: Stack;
  let vpc: Vpc;
  let svm: OntapStorageVirtualMachine;

  beforeEach(() => {
    stack = new Stack();
    vpc = new Vpc(stack, 'VPC');
    const fileSystem = new OntapFileSystem(stack, 'OntapFs', {
      vpc,
      vpcSubnets: [vpc.privateSubnets[0]],
      storageCapacityGiB: 1024,
      ontapConfiguration: {
        deploymentType: OntapDeploymentType.SINGLE_AZ_1,
      },
    });
    svm = new OntapStorageVirtualMachine(stack, 'Svm', {
      fileSystem,
      name: 'test_svm',
    });
  });

  describe('basic creation', () => {
    test('creates a volume with minimal props', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test_vol',
        sizeInBytes: 1073741824, // 1 GB
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        VolumeType: 'ONTAP',
        Name: 'test_vol',
        OntapConfiguration: {
          StorageEfficiencyEnabled: 'true',
        },
      });
    });

    test('creates a volume with junction path', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test_vol',
        sizeInBytes: 1073741824,
        junctionPath: '/data',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: {
          JunctionPath: '/data',
        },
      });
    });

    test('creates a volume with tiering policy', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test_vol',
        sizeInBytes: 1073741824,
        tieringPolicy: {
          name: TieringPolicyName.AUTO,
          coolingPeriod: Duration.days(31),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: {
          TieringPolicy: {
            Name: 'AUTO',
            CoolingPeriod: 31,
          },
        },
      });
    });

    test('creates a volume with security style', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test_vol',
        sizeInBytes: 1073741824,
        securityStyle: SecurityStyle.NTFS,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: {
          SecurityStyle: 'NTFS',
        },
      });
    });

    test('creates a DP volume without StorageEfficiencyEnabled', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'dp_vol',
        sizeInBytes: 1073741824,
        ontapVolumeType: OntapVolumeType.DP,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: {
          OntapVolumeType: 'DP',
        },
      });
      // DP volumes do not accept StorageEfficiencyEnabled, so the construct
      // must omit it from the template.
      template.hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: Match.not(Match.objectLike({
          StorageEfficiencyEnabled: Match.anyValue(),
        })),
      });
    });

    test('creates a FlexGroup volume with aggregateConfiguration', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'flexgroup_vol',
        sizeInBytes: 1073741824,
        volumeStyle: VolumeStyle.FLEXGROUP,
        aggregateConfiguration: {
          aggregates: ['aggr1'],
          constituentsPerAggregate: 8,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: {
          VolumeStyle: 'FLEXGROUP',
          AggregateConfiguration: {
            Aggregates: ['aggr1'],
            ConstituentsPerAggregate: 8,
          },
        },
      });
    });

    test('creates a volume with copyTagsToBackups', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test_vol',
        sizeInBytes: 1073741824,
        copyTagsToBackups: true,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: {
          CopyTagsToBackups: 'true',
        },
      });
    });

    test('boolean tokens resolve to a CFN reference (not the token string) for storageEfficiencyEnabled', () => {
      const param = new CfnParameter(stack, 'EnableStorageEfficiency', { type: 'String', default: 'true' });
      // The prop accepts `boolean | IResolvable`, so a raw `Token` (which implements
      // `IResolvable`) can be passed through without any cast.
      const tokenValue = Token.asAny(param.valueAsString) as IResolvable;

      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test_vol',
        sizeInBytes: 1073741824,
        storageEfficiencyEnabled: tokenValue,
      });

      // The synthesized template should contain a Ref to the parameter, not a
      // literal token string of the form "${Token[...]}".
      const props = Template.fromStack(stack).findResources('AWS::FSx::Volume');
      const volumes = Object.values(props);
      expect(volumes).toHaveLength(1);
      const storageEfficiencyEnabled = (volumes[0] as any).Properties.OntapConfiguration.StorageEfficiencyEnabled;
      expect(typeof storageEfficiencyEnabled).toBe('object');
      expect(storageEfficiencyEnabled).toEqual({ Ref: 'EnableStorageEfficiency' });
    });

    test('exposes volumeId', () => {
      const volume = new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test_vol',
        sizeInBytes: 1073741824,
      });

      expect(volume.volumeId).toBeDefined();
    });
  });

  describe('validation', () => {
    test('throws if name is empty', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: '',
          sizeInBytes: 1073741824,
        });
      }).toThrow(/'name' must be between 1 and 203 characters/);
    });

    test('throws if name exceeds 203 characters', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'a'.repeat(204),
          sizeInBytes: 1073741824,
        });
      }).toThrow(/'name' must be between 1 and 203 characters/);
    });

    test('throws if name contains a hyphen (FSx ONTAP service rule)', () => {
      // FSx for ONTAP rejects hyphens at deploy time with an opaque BadRequest.
      // We surface that at synth so the offending value is obvious.
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'gen1-volume',
          sizeInBytes: 1073741824,
        });
      }).toThrow(/'name' must begin with a letter or underscore and contain only ASCII letters, digits, and underscores, got 'gen1-volume'/);
    });

    test('throws if name starts with a digit (FSx ONTAP service rule)', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: '1volume',
          sizeInBytes: 1073741824,
        });
      }).toThrow(/'name' must begin with a letter or underscore and contain only ASCII letters, digits, and underscores, got '1volume'/);
    });

    test('throws if name contains a control character (FSx ONTAP service rule)', () => {
      // U+000A (LF) is rejected by the stricter ONTAP service pattern, which
      // only permits ASCII letters, digits, and underscore.
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'foo\nbar',
          sizeInBytes: 1073741824,
        });
      }).toThrow(/'name' must begin with a letter or underscore and contain only ASCII letters, digits, and underscores/);
    });

    test('accepts a name starting with an underscore', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: '_underscore_first',
          sizeInBytes: 1073741824,
        });
      }).not.toThrow();
    });

    test('throws if sizeInBytes is not a safe integer', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test_vol',
          sizeInBytes: Number.MAX_SAFE_INTEGER + 1,
        });
      }).toThrow(/'sizeInBytes' literal must be a safe integer/);
    });

    test('throws if sizeInBytes is negative', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test_vol',
          sizeInBytes: -1,
        });
      }).toThrow(/'sizeInBytes' must be a positive integer/);
    });

    test('throws if sizeInBytes is zero', () => {
      // FSx for ONTAP rejects SizeInBytes=0 at deploy with InvalidParameterCombination.
      // The construct catches it at synth so the error is clearly attributed.
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test_vol',
          sizeInBytes: 0,
        });
      }).toThrow(/'sizeInBytes' must be a positive integer/);
    });

    test('throws if sizeInBytes is below the FSx 20 MiB minimum', () => {
      // 1 KiB is positive but below the 20 MiB FSx ONTAP per-volume floor.
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test_vol',
          sizeInBytes: 1024,
        });
      }).toThrow(/'sizeInBytes' must be at least \d+ bytes \(20 MiB\)/);
    });

    test('throws if junctionPath does not start with /', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test_vol',
          sizeInBytes: 1073741824,
          junctionPath: 'data',
        });
      }).toThrow(/'junctionPath' must start with '\/'/);
    });

    test('throws if junctionPath is the empty string', () => {
      // An empty string is a user-provided value distinct from `undefined`. The service
      // rejects it with an opaque BadRequest at deploy; the CDK should surface it as
      // a clear synth-time error attributed to the `junctionPath` prop.
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test_vol',
          sizeInBytes: 1073741824,
          junctionPath: '',
        });
      }).toThrow(/'junctionPath' must start with '\/', got ''/);
    });

    test('throws if junctionPath exceeds 255 characters', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test_vol',
          sizeInBytes: 1073741824,
          junctionPath: '/' + 'a'.repeat(255),
        });
      }).toThrow(/'junctionPath' must be at most 255 characters/);
    });

    test('throws if junctionPath is the SVM root (\'/\')', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test_vol',
          sizeInBytes: 1073741824,
          junctionPath: '/',
        });
      }).toThrow(/'junctionPath' cannot be '\/'/);
    });

    test('throws if junctionPath has a trailing slash', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test_vol',
          sizeInBytes: 1073741824,
          junctionPath: '/data/',
        });
      }).toThrow(/'junctionPath' must not end with '\/'/);
    });

    test('throws if junctionPath contains consecutive slashes', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test_vol',
          sizeInBytes: 1073741824,
          junctionPath: '/data//sub',
        });
      }).toThrow(/'junctionPath' must not contain consecutive '\/' characters/);
    });

    test('throws if cooling period is below 2 days', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test_vol',
          sizeInBytes: 1073741824,
          tieringPolicy: {
            name: TieringPolicyName.AUTO,
            coolingPeriod: Duration.days(1),
          },
        });
      }).toThrow(/'coolingPeriod' must be a whole number of days between 2 and 183/);
    });

    test('throws if cooling period exceeds 183 days', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test_vol',
          sizeInBytes: 1073741824,
          tieringPolicy: {
            name: TieringPolicyName.SNAPSHOT_ONLY,
            coolingPeriod: Duration.days(184),
          },
        });
      }).toThrow(/'coolingPeriod' must be a whole number of days between 2 and 183/);
    });

    test('throws if FlexGroup volume is missing aggregateConfiguration', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'flexgroup_vol',
          sizeInBytes: 1073741824,
          volumeStyle: VolumeStyle.FLEXGROUP,
        });
      }).toThrow(/'aggregateConfiguration' must be set when 'volumeStyle' is FLEXGROUP/);
    });

    test('throws if FlexVol volume sets aggregateConfiguration', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'flexvol',
          sizeInBytes: 1073741824,
          volumeStyle: VolumeStyle.FLEXVOL,
          aggregateConfiguration: {
            aggregates: ['aggr1'],
          },
        });
      }).toThrow(/'aggregateConfiguration' can only be set when 'volumeStyle' is FLEXGROUP/);
    });

    test('throws if DP volume sets storageEfficiencyEnabled', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'dp_vol',
          sizeInBytes: 1073741824,
          ontapVolumeType: OntapVolumeType.DP,
          storageEfficiencyEnabled: true,
        });
      }).toThrow(/'storageEfficiencyEnabled' cannot be set on DP/);
    });

    test('throws if cooling period is set with ALL tiering policy', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test_vol',
          sizeInBytes: 1073741824,
          tieringPolicy: {
            name: TieringPolicyName.ALL,
            coolingPeriod: Duration.days(31),
          },
        });
      }).toThrow(/'coolingPeriod' can only be set when tiering policy is SNAPSHOT_ONLY or AUTO/);
    });

    test('throws if cooling period is set with NONE tiering policy', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test_vol',
          sizeInBytes: 1073741824,
          tieringPolicy: {
            name: TieringPolicyName.NONE,
            coolingPeriod: Duration.days(31),
          },
        });
      }).toThrow(/'coolingPeriod' can only be set when tiering policy is SNAPSHOT_ONLY or AUTO/);
    });

    test('skips name validation when name is a token', () => {
      const nameParam = new CfnParameter(stack, 'VolumeName', { type: 'String', default: 'token_vol' });
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: nameParam.valueAsString,
          sizeInBytes: 1073741824,
        });
      }).not.toThrow();
    });

    test('skips junctionPath validation when junctionPath is a token', () => {
      const jpParam = new CfnParameter(stack, 'JunctionPath', { type: 'String', default: '/data' });
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test_vol',
          sizeInBytes: 1073741824,
          junctionPath: jpParam.valueAsString,
        });
      }).not.toThrow();
    });
  });

  describe('extra coverage', () => {
    test('exposes resourceArn', () => {
      const volume = new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test_vol',
        sizeInBytes: 1073741824,
      });

      expect(volume.resourceArn).toBeDefined();
    });

    test('applies a removalPolicy of DESTROY', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test_vol',
        sizeInBytes: 1073741824,
        removalPolicy: RemovalPolicy.DESTROY,
      });

      Template.fromStack(stack).hasResource('AWS::FSx::Volume', {
        DeletionPolicy: 'Delete',
      });
    });

    test('renders snapshotPolicy when provided', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test_vol',
        sizeInBytes: 1073741824,
        snapshotPolicy: 'default-1weekly',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: Match.objectLike({
          SnapshotPolicy: 'default-1weekly',
        }),
      });
    });

    test('renders ontapVolumeType DP without StorageEfficiencyEnabled', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'dp_vol',
        sizeInBytes: 1073741824,
        ontapVolumeType: OntapVolumeType.DP,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: Match.objectLike({
          OntapVolumeType: 'DP',
        }),
      });
      // DP volumes intentionally omit StorageEfficiencyEnabled.
      const resources = Template.fromStack(stack).findResources('AWS::FSx::Volume');
      const volume = Object.values(resources)[0] as any;
      expect(volume.Properties.OntapConfiguration.StorageEfficiencyEnabled).toBeUndefined();
    });

    test('renders volumeStyle FLEXVOL explicitly when provided', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'flexvol',
        sizeInBytes: 1073741824,
        volumeStyle: VolumeStyle.FLEXVOL,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: Match.objectLike({
          VolumeStyle: 'FLEXVOL',
        }),
      });
    });

    test('renders securityStyle when provided', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'sec_vol',
        sizeInBytes: 1073741824,
        securityStyle: SecurityStyle.NTFS,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: Match.objectLike({
          SecurityStyle: 'NTFS',
        }),
      });
    });

    test('renders all four tiering policy variants', () => {
      const policies = [
        TieringPolicyName.SNAPSHOT_ONLY,
        TieringPolicyName.AUTO,
        TieringPolicyName.ALL,
        TieringPolicyName.NONE,
      ];
      policies.forEach((name, idx) => {
        new OntapVolume(stack, `Vol${idx}`, {
          storageVirtualMachine: svm,
          name: `vol${idx}`,
          sizeInBytes: 1073741824,
          tieringPolicy: { name },
        });
      });

      const resources = Template.fromStack(stack).findResources('AWS::FSx::Volume');
      const renderedNames = Object.values(resources)
        .map((r: any) => r.Properties.OntapConfiguration.TieringPolicy?.Name)
        .filter(Boolean);
      expect(renderedNames.sort()).toEqual(['ALL', 'AUTO', 'NONE', 'SNAPSHOT_ONLY']);
    });

    test('accepts cooling period at the boundaries (2 and 183 days)', () => {
      new OntapVolume(stack, 'VolMin', {
        storageVirtualMachine: svm,
        name: 'min_vol',
        sizeInBytes: 1073741824,
        tieringPolicy: {
          name: TieringPolicyName.SNAPSHOT_ONLY,
          coolingPeriod: Duration.days(2),
        },
      });
      new OntapVolume(stack, 'VolMax', {
        storageVirtualMachine: svm,
        name: 'max_vol',
        sizeInBytes: 1073741824,
        tieringPolicy: {
          name: TieringPolicyName.AUTO,
          coolingPeriod: Duration.days(183),
        },
      });

      const resources = Template.fromStack(stack).findResources('AWS::FSx::Volume');
      const periods = Object.values(resources)
        .map((r: any) => r.Properties.OntapConfiguration.TieringPolicy?.CoolingPeriod)
        .filter((v: any) => v !== undefined);
      expect(periods.sort((a: number, b: number) => a - b)).toEqual([2, 183]);
    });

    test('accepts a volume name at the 203-character maximum', () => {
      const name = 'a' + 'b'.repeat(202); // 203 chars total
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name,
        sizeInBytes: 1073741824,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        Name: name,
      });
    });

    test('accepts a CfnParameter for sizeInBytes (token round-trip)', () => {
      const sizeParam = new CfnParameter(stack, 'SizeBytes', {
        type: 'Number',
        default: 1073741824,
      });

      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'token_vol',
        sizeInBytes: sizeParam.valueAsNumber,
      });

      const resources = Template.fromStack(stack).findResources('AWS::FSx::Volume');
      const volume = Object.values(resources)[0] as any;
      // SizeInBytes must be a CFN Ref/intrinsic, not a literal stringified token.
      expect(typeof volume.Properties.OntapConfiguration.SizeInBytes).toBe('object');
    });
  });
});

describe('FSx for NetApp ONTAP Volume additional coverage', () => {
  let stack: Stack;
  let vpc: Vpc;
  let svm: OntapStorageVirtualMachine;

  beforeEach(() => {
    stack = new Stack();
    vpc = new Vpc(stack, 'VPC');
    const fileSystem = new OntapFileSystem(stack, 'OntapFs', {
      vpc,
      vpcSubnets: [vpc.privateSubnets[0]],
      storageCapacityGiB: 1024,
      ontapConfiguration: { deploymentType: OntapDeploymentType.SINGLE_AZ_1 },
    });
    svm = new OntapStorageVirtualMachine(stack, 'Svm', {
      fileSystem,
      name: 'svm1',
    });
  });

  describe('uuid attribute', () => {
    test('exposes uuid from attrUuid', () => {
      const volume = new OntapVolume(stack, 'Vol', {
        storageVirtualMachine: svm,
        name: 'vol1',
        sizeInBytes: 1_073_741_824,
      });
      expect(volume.uuid).toBeDefined();
      expect(typeof volume.uuid).toBe('string');
    });
  });

  describe('backupId', () => {
    test('renders BackupId at the top-level Volume properties', () => {
      new OntapVolume(stack, 'Vol', {
        storageVirtualMachine: svm,
        name: 'vol1',
        sizeInBytes: 1_073_741_824,
        backupId: 'backup-1234567890abcdef0',
      });
      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        BackupId: 'backup-1234567890abcdef0',
      });
    });

    test('renders BackupId alongside SizeInBytes when restoring from a backup', () => {
      // CFN accepts both BackupId and SizeInBytes simultaneously when creating a
      // volume from a backup. Verify that sizeInBytes still flows through to the
      // synthesized template even when backupId is set.
      new OntapVolume(stack, 'Vol', {
        storageVirtualMachine: svm,
        name: 'vol1',
        sizeInBytes: 1_073_741_824,
        backupId: 'backup-1234567890abcdef0',
      });
      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        BackupId: 'backup-1234567890abcdef0',
        OntapConfiguration: Match.objectLike({
          SizeInBytes: '1073741824',
        }),
      });
    });
  });

  describe('AggregateConfiguration validation (Gaps H1, H2)', () => {
    test('accepts aggregates in correct format (aggr1..aggr12)', () => {
      new OntapVolume(stack, 'Vol', {
        storageVirtualMachine: svm,
        name: 'vol1',
        sizeInBytes: 1_073_741_824,
        volumeStyle: VolumeStyle.FLEXGROUP,
        aggregateConfiguration: {
          aggregates: ['aggr1', 'aggr12'],
          constituentsPerAggregate: 8,
        },
      });
      Template.fromStack(stack).hasResource('AWS::FSx::Volume', {});
    });

    test('throws on invalid aggregate format', () => {
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          volumeStyle: VolumeStyle.FLEXGROUP,
          aggregateConfiguration: { aggregates: ['aggr0'] },
        });
      }).toThrow(/'aggregates' entries must match the pattern 'aggrX' where X is between 1 and 12/);
    });

    test('throws on aggregate index > 12', () => {
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          volumeStyle: VolumeStyle.FLEXGROUP,
          aggregateConfiguration: { aggregates: ['aggr13'] },
        });
      }).toThrow(/'aggregates' entries must match the pattern 'aggrX' where X is between 1 and 12/);
    });

    test('throws on more than 6 aggregates', () => {
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          volumeStyle: VolumeStyle.FLEXGROUP,
          aggregateConfiguration: { aggregates: ['aggr1', 'aggr2', 'aggr3', 'aggr4', 'aggr5', 'aggr6', 'aggr7'] },
        });
      }).toThrow(/'aggregates' must contain between 1 and 6 entries/);
    });

    test('throws on empty aggregates list', () => {
      // FSx returns 400 if `aggregates: []` is passed; require at least 1 entry at synth.
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          volumeStyle: VolumeStyle.FLEXGROUP,
          aggregateConfiguration: { aggregates: [] },
        });
      }).toThrow(/'aggregates' must contain between 1 and 6 entries/);
    });

    test('throws on constituentsPerAggregate < 1', () => {
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          volumeStyle: VolumeStyle.FLEXGROUP,
          aggregateConfiguration: { constituentsPerAggregate: 0 },
        });
      }).toThrow(/'constituentsPerAggregate' must be an integer between 1 and 200/);
    });

    test('throws on constituentsPerAggregate > 200', () => {
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          volumeStyle: VolumeStyle.FLEXGROUP,
          aggregateConfiguration: { constituentsPerAggregate: 201 },
        });
      }).toThrow(/'constituentsPerAggregate' must be an integer between 1 and 200/);
    });

    test('accepts constituentsPerAggregate at the upper boundary (200)', () => {
      new OntapVolume(stack, 'Vol', {
        storageVirtualMachine: svm,
        name: 'vol1',
        sizeInBytes: 1_073_741_824,
        volumeStyle: VolumeStyle.FLEXGROUP,
        aggregateConfiguration: {
          aggregates: ['aggr1'],
          constituentsPerAggregate: 200,
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: Match.objectLike({
          AggregateConfiguration: Match.objectLike({
            ConstituentsPerAggregate: 200,
          }),
        }),
      });
    });
  });

  describe('SnaplockConfiguration', () => {
    test('renders ENTERPRISE SnapLock with default retention (DAYS=30)', () => {
      new OntapVolume(stack, 'Vol', {
        storageVirtualMachine: svm,
        name: 'vol1',
        sizeInBytes: 1_073_741_824,
        snaplockConfiguration: {
          snaplockType: SnaplockType.ENTERPRISE,
          privilegedDelete: PrivilegedDelete.ENABLED,
          autocommitPeriod: { type: AutocommitPeriodType.DAYS, value: 7 },
          retentionPeriod: {
            defaultRetention: { type: RetentionPeriodType.DAYS, value: 30 },
            minimumRetention: { type: RetentionPeriodType.DAYS, value: 1 },
            maximumRetention: { type: RetentionPeriodType.DAYS, value: 365 },
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: Match.objectLike({
          SnaplockConfiguration: {
            SnaplockType: 'ENTERPRISE',
            PrivilegedDelete: 'ENABLED',
            AutocommitPeriod: { Type: 'DAYS', Value: 7 },
            RetentionPeriod: {
              DefaultRetention: { Type: 'DAYS', Value: 30 },
              MinimumRetention: { Type: 'DAYS', Value: 1 },
              MaximumRetention: { Type: 'DAYS', Value: 365 },
            },
          },
        }),
      });
    });

    test('renders COMPLIANCE SnapLock with INFINITE max retention', () => {
      new OntapVolume(stack, 'Vol', {
        storageVirtualMachine: svm,
        name: 'vol1',
        sizeInBytes: 1_073_741_824,
        snaplockConfiguration: {
          snaplockType: SnaplockType.COMPLIANCE,
          retentionPeriod: {
            defaultRetention: { type: RetentionPeriodType.YEARS, value: 7 },
            minimumRetention: { type: RetentionPeriodType.YEARS, value: 1 },
            maximumRetention: { type: RetentionPeriodType.INFINITE },
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: Match.objectLike({
          SnaplockConfiguration: Match.objectLike({
            SnaplockType: 'COMPLIANCE',
            RetentionPeriod: Match.objectLike({
              MaximumRetention: { Type: 'INFINITE' },
            }),
          }),
        }),
      });
    });

    test('throws when privilegedDelete is set on COMPLIANCE SnapLock', () => {
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          snaplockConfiguration: {
            snaplockType: SnaplockType.COMPLIANCE,
            privilegedDelete: PrivilegedDelete.ENABLED,
          },
        });
      }).toThrow(/'privilegedDelete' can only be set when 'snaplockType' is ENTERPRISE/);
    });

    test('throws when autocommitPeriod is missing value for a unit type', () => {
      // For unit types (DAYS, MINUTES, etc.) `value` is required. The construct surfaces
      // this at synth instead of letting CFN return a confusing service-side error.
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          snaplockConfiguration: {
            snaplockType: SnaplockType.ENTERPRISE,
            autocommitPeriod: { type: AutocommitPeriodType.DAYS },
          },
        });
      }).toThrow(/'autocommitPeriod\.value' is required when type is DAYS/);
    });

    test('throws when retentionPeriod is missing value for a unit type', () => {
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          snaplockConfiguration: {
            snaplockType: SnaplockType.ENTERPRISE,
            retentionPeriod: {
              defaultRetention: { type: RetentionPeriodType.DAYS },
              minimumRetention: { type: RetentionPeriodType.DAYS, value: 1 },
              maximumRetention: { type: RetentionPeriodType.INFINITE },
            },
          },
        });
      }).toThrow(/'retentionPeriod\.defaultRetention\.value' is required when type is DAYS/);
    });

    test('throws when autocommitPeriod has value with type=NONE', () => {
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          snaplockConfiguration: {
            snaplockType: SnaplockType.ENTERPRISE,
            autocommitPeriod: { type: AutocommitPeriodType.NONE, value: 5 },
          },
        });
      }).toThrow(/'autocommitPeriod\.value' must not be set when type is NONE/);
    });

    test('throws when autocommitPeriod MINUTES below 5', () => {
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          snaplockConfiguration: {
            snaplockType: SnaplockType.ENTERPRISE,
            autocommitPeriod: { type: AutocommitPeriodType.MINUTES, value: 4 },
          },
        });
      }).toThrow(/'autocommitPeriod\.value' for type MINUTES must be an integer between 5 and 65535/);
    });

    test('throws when autocommitPeriod YEARS above 10', () => {
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          snaplockConfiguration: {
            snaplockType: SnaplockType.ENTERPRISE,
            autocommitPeriod: { type: AutocommitPeriodType.YEARS, value: 11 },
          },
        });
      }).toThrow(/'autocommitPeriod\.value' for type YEARS must be an integer between 1 and 10/);
    });

    test('throws when retentionPeriod INFINITE has a value', () => {
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          snaplockConfiguration: {
            snaplockType: SnaplockType.COMPLIANCE,
            retentionPeriod: {
              defaultRetention: { type: RetentionPeriodType.DAYS, value: 1 },
              minimumRetention: { type: RetentionPeriodType.DAYS, value: 1 },
              maximumRetention: { type: RetentionPeriodType.INFINITE, value: 1 },
            },
          },
        });
      }).toThrow(/'retentionPeriod\.maximumRetention\.value' must not be set when type is INFINITE or UNSPECIFIED/);
    });

    test('throws when retentionPeriod DAYS exceeds 365', () => {
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          snaplockConfiguration: {
            snaplockType: SnaplockType.ENTERPRISE,
            retentionPeriod: {
              defaultRetention: { type: RetentionPeriodType.DAYS, value: 1 },
              minimumRetention: { type: RetentionPeriodType.DAYS, value: 1 },
              maximumRetention: { type: RetentionPeriodType.DAYS, value: 366 },
            },
          },
        });
      }).toThrow(/'retentionPeriod\.maximumRetention\.value' for type DAYS must be an integer between 0 and 365/);
    });

    test('renders auditLogVolume and volumeAppendModeEnabled as strings', () => {
      new OntapVolume(stack, 'Vol', {
        storageVirtualMachine: svm,
        name: 'vol1',
        sizeInBytes: 1_073_741_824,
        snaplockConfiguration: {
          snaplockType: SnaplockType.COMPLIANCE,
          auditLogVolume: true,
          volumeAppendModeEnabled: false,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: Match.objectLike({
          SnaplockConfiguration: Match.objectLike({
            AuditLogVolume: 'true',
            VolumeAppendModeEnabled: 'false',
          }),
        }),
      });
    });

    test('renders AutocommitPeriodType.NONE without a Value field', () => {
      // The early-return branch for type=NONE should produce a render with only Type.
      new OntapVolume(stack, 'Vol', {
        storageVirtualMachine: svm,
        name: 'vol1',
        sizeInBytes: 1_073_741_824,
        snaplockConfiguration: {
          snaplockType: SnaplockType.ENTERPRISE,
          autocommitPeriod: { type: AutocommitPeriodType.NONE },
        },
      });

      const resources = Template.fromStack(stack).findResources('AWS::FSx::Volume');
      const volume = Object.values(resources)[0] as any;
      const ap = volume.Properties.OntapConfiguration.SnaplockConfiguration.AutocommitPeriod;
      expect(ap).toEqual({ Type: 'NONE' });
      expect(ap.Value).toBeUndefined();
    });

    test('renders RetentionPeriodType.UNSPECIFIED without a Value field', () => {
      // UNSPECIFIED is the second unitless retention type and follows the same
      // early-return branch as INFINITE.
      new OntapVolume(stack, 'Vol', {
        storageVirtualMachine: svm,
        name: 'vol1',
        sizeInBytes: 1_073_741_824,
        snaplockConfiguration: {
          snaplockType: SnaplockType.ENTERPRISE,
          retentionPeriod: {
            defaultRetention: { type: RetentionPeriodType.UNSPECIFIED },
            minimumRetention: { type: RetentionPeriodType.UNSPECIFIED },
            maximumRetention: { type: RetentionPeriodType.INFINITE },
          },
        },
      });

      const resources = Template.fromStack(stack).findResources('AWS::FSx::Volume');
      const volume = Object.values(resources)[0] as any;
      const rp = volume.Properties.OntapConfiguration.SnaplockConfiguration.RetentionPeriod;
      expect(rp.DefaultRetention).toEqual({ Type: 'UNSPECIFIED' });
      expect(rp.MinimumRetention).toEqual({ Type: 'UNSPECIFIED' });
      expect(rp.MaximumRetention).toEqual({ Type: 'INFINITE' });
    });
  });

  describe('SnaplockRetentionPeriod ordering', () => {
    test('throws when minimumRetention > defaultRetention', () => {
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          snaplockConfiguration: {
            snaplockType: SnaplockType.ENTERPRISE,
            retentionPeriod: {
              minimumRetention: { type: RetentionPeriodType.DAYS, value: 30 },
              defaultRetention: { type: RetentionPeriodType.DAYS, value: 10 },
              maximumRetention: { type: RetentionPeriodType.DAYS, value: 365 },
            },
          },
        });
      }).toThrow(/'retentionPeriod\.minimumRetention' must be less than or equal to 'retentionPeriod\.defaultRetention'/);
    });

    test('throws when defaultRetention > maximumRetention', () => {
      expect(() => {
        new OntapVolume(stack, 'Vol', {
          storageVirtualMachine: svm,
          name: 'vol1',
          sizeInBytes: 1_073_741_824,
          snaplockConfiguration: {
            snaplockType: SnaplockType.ENTERPRISE,
            retentionPeriod: {
              minimumRetention: { type: RetentionPeriodType.DAYS, value: 1 },
              defaultRetention: { type: RetentionPeriodType.DAYS, value: 365 },
              maximumRetention: { type: RetentionPeriodType.DAYS, value: 30 },
            },
          },
        });
      }).toThrow(/'retentionPeriod\.defaultRetention' must be less than or equal to 'retentionPeriod\.maximumRetention'/);
    });

    test('skips ordering check across mismatched units', () => {
      // YEARS:1 versus MONTHS:12 are functionally equivalent. The CDK ordering
      // check skips cross-unit comparisons because calendar approximations
      // would produce false positives at unit boundaries; FSx validates the
      // cross-unit relationship at deploy time.
      new OntapVolume(stack, 'Vol', {
        storageVirtualMachine: svm,
        name: 'vol1',
        sizeInBytes: 1_073_741_824,
        snaplockConfiguration: {
          snaplockType: SnaplockType.ENTERPRISE,
          retentionPeriod: {
            minimumRetention: { type: RetentionPeriodType.YEARS, value: 1 },
            defaultRetention: { type: RetentionPeriodType.YEARS, value: 1 },
            maximumRetention: { type: RetentionPeriodType.MONTHS, value: 12 },
          },
        },
      });
      Template.fromStack(stack).hasResource('AWS::FSx::Volume', {});
    });

    test('accepts INFINITE as the maximum bound', () => {
      // INFINITE compares as +Infinity, so any finite default/min satisfies the ordering.
      new OntapVolume(stack, 'Vol', {
        storageVirtualMachine: svm,
        name: 'vol1',
        sizeInBytes: 1_073_741_824,
        snaplockConfiguration: {
          snaplockType: SnaplockType.COMPLIANCE,
          retentionPeriod: {
            minimumRetention: { type: RetentionPeriodType.DAYS, value: 1 },
            defaultRetention: { type: RetentionPeriodType.YEARS, value: 50 },
            maximumRetention: { type: RetentionPeriodType.INFINITE },
          },
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: Match.objectLike({
          SnaplockConfiguration: Match.objectLike({
            RetentionPeriod: Match.objectLike({
              MaximumRetention: { Type: 'INFINITE' },
            }),
          }),
        }),
      });
    });

    test('skips ordering check when any bound is UNSPECIFIED', () => {
      // UNSPECIFIED bounds are treated as "no constraint configured" and the
      // ordering check is skipped for those slots.
      new OntapVolume(stack, 'Vol', {
        storageVirtualMachine: svm,
        name: 'vol1',
        sizeInBytes: 1_073_741_824,
        snaplockConfiguration: {
          snaplockType: SnaplockType.ENTERPRISE,
          retentionPeriod: {
            minimumRetention: { type: RetentionPeriodType.UNSPECIFIED },
            defaultRetention: { type: RetentionPeriodType.UNSPECIFIED },
            maximumRetention: { type: RetentionPeriodType.UNSPECIFIED },
          },
        },
      });
      Template.fromStack(stack).hasResource('AWS::FSx::Volume', {});
    });
  });
});

