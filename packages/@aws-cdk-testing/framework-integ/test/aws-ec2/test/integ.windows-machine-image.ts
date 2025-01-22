import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as assert from 'assert';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';
import { Construct } from 'constructs';
import * as jsii from 'jsii';
import * as reflect from 'jsii-reflect';
import * as path from 'path';
import * as fs from 'fs';
import { md5hash } from 'aws-cdk-lib/core/lib/helpers-internal';

const env = {
  account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
};

assert(env.account, 'CDK_INTEG_ACCOUNT or CDK_DEFAULT_ACCOUNT must be set');
assert(env.region, 'CDK_INTEG_REGION or CDK_DEFAULT_REGION must be set');

interface EnumReflectorProps {
  enumName: string;
  enumPath: string;
}

class EnumReflector {
  private readonly windowsVerisonEnum: reflect.EnumType;

  constructor({ enumName, enumPath }: EnumReflectorProps) {
    const ts = new reflect.TypeSystem();
    ts.addAssembly(new reflect.Assembly(ts, jsii.sourceToAssemblyHelper(
      fs.readFileSync(enumPath, 'utf8'),
    )));

    this.windowsVerisonEnum = ts.findEnum(`testpkg.${enumName}`);
  }

  public findMember(key: string): reflect.EnumMember | undefined {
    return this.windowsVerisonEnum.members.find((m) => m.name === key);
  }
}

const windowsVersionReflector = new EnumReflector({
  enumName: 'WindowsVersion',
  enumPath: path.join(
    path.dirname(require.resolve('aws-cdk-lib')),
    'aws-ec2/lib/windows-versions.ts',
  ),
});

interface ImageIdTestCaseProps extends StackProps {
  windowsVersions: ec2.WindowsVersion[];
}

class ImageIdTestCase extends Stack {
  constructor(scope: Construct, id: string, props: ImageIdTestCaseProps) {
    super(scope, id, props);

    for (const version of props.windowsVersions) {
      if (isWindowsVersionDeprecated(version)) {
        try {
          // Expecting this to throw, if not, the image should not have been deprecated
          retrieveWindowsImage(version);
          throw new Error(`Expected ${version} to be deprecated, but it is still retrievable by SSM parameter`);
        } catch {}
      } else {
        try {
          // Expecting this to not throw, if it does, the image should have been deprecated
          retrieveWindowsImage(version);
        } catch {
          throw new Error(`Expected ${version} not to be deprecated, but it is NOT retrievable by SSM parameter`);
        }
      }
    }
  }
}

class VpcStack extends Stack {
  public readonly vpc: ec2.IVpc;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        { subnetType: ec2.SubnetType.PUBLIC, name: 'Public' },
      ],
    });
  }
}

interface InstanceTestCaseProps extends StackProps {
  vpc: ec2.IVpc;
  machineImage: ec2.IMachineImage;
}

class InstanceTestCase extends Stack {
  constructor(scope: Construct, id: string, props: InstanceTestCaseProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
    const { machineImage, vpc } = props;

    const instanceType = ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO);
    new ec2.Instance(this, 'Instance', { instanceType, machineImage, vpc, associatePublicIpAddress: false });
  }
}

const app = new App();

const { vpc } = new VpcStack(app, 'integ-ec2-windows-vpc', { env });

const windowsVersions = Object.values(ec2.WindowsVersion);
// Hash calculated to detect changes made to the WindowsVersion enum
// This will detect additions, deletions, renames or changes to their deprecation status.
const windowsVersionsHash = md5hash(
  windowsVersions.reduce((hash, version) =>
    [hash, slugifyVersion(version), isWindowsVersionDeprecated(version) ? 'deprecated' : ''].join(','),
  ''),
);

new IntegTest(app, 'windows-machine-image-ids-integ-test', {
  testCases: [
    new ImageIdTestCase(
      app,
      `integ-ec2-windows-image-ids-${windowsVersionsHash}`,
      { windowsVersions, env },
    ),

    ...[
      ec2.WindowsVersion.WINDOWS_SERVER_2016_ENGLISH_CORE_BASE,
      ec2.WindowsVersion.WINDOWS_SERVER_2022_DUTCH_FULL_BASE,
    ].map((version) => new InstanceTestCase(
      app,
      `integ-ec2-windows-instance-${slugifyVersion(version)}`,
      { machineImage: ec2.MachineImage.latestWindows(version), vpc, env },
    )),
  ],
  enableLookups: true,
});

function slugifyVersion(version: string) {
  return version.replace(/[_.]/g, '-');
}

function getWindowsVersionEnumKey(windowsVersion: ec2.WindowsVersion) {
  return windowsVersion.toLocaleUpperCase().replace(/[-.]/g, '_');
}

function isWindowsVersionDeprecated(version: ec2.WindowsVersion): boolean {
  const member = windowsVersionReflector.findMember(getWindowsVersionEnumKey(version));
  if (!member) throw new Error(`Could not find enum member for: ${version}`);
  return member.docs.deprecated;
}

function retrieveWindowsImage(version: ec2.WindowsVersion) {
  return ec2.MachineImage.fromSsmParameter(
    '/aws/service/ami-windows-latest/' + version,
    // cachedInContext is required to test the SSM parameter retrieval
    { cachedInContext: true },
  );
}
