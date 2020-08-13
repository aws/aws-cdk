import { ResourcePart } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import { App, Aws, CfnResource, Stack } from '@aws-cdk/core';
import * as ec2 from '../lib';

let app: App;
let stack: Stack;
let instanceRole: iam.Role;
let resource: CfnResource;
let linuxUserData: ec2.UserData;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
  instanceRole = new iam.Role(stack, 'InstanceRole', {
    assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
  });
  resource = new CfnResource(stack, 'Resource', {
    type: 'CDK::Test::Resource',
  });
  linuxUserData = ec2.UserData.forLinux();
});

test('whole config with restart handles', () => {
  // WHEN
  const handle = new ec2.InitServiceRestartHandle();
  const config = new ec2.InitConfig([
    ec2.InitCommand.argvCommand(['/bin/true'], { serviceRestartHandles: [handle] }),
    ec2.InitService.enable('httpd', { serviceRestartHandle: handle }),
  ]);

  // THEN
  expect(config._bind(stack, linuxOptions()).config).toEqual(expect.objectContaining({
    services: {
      sysvinit: {
        httpd: {
          enabled: true,
          ensureRunning: true,
          commands: ['000'],
        },
      },
    },
  }));
});

test('CloudFormationInit can be added to after instantiation', () => {
  // GIVEN
  const config = new ec2.InitConfig([]);
  const init = ec2.CloudFormationInit.fromConfig(config);

  // WHEN
  config.add(ec2.InitCommand.argvCommand(['/bin/true']));
  init.attach(resource, linuxOptions());

  // THEN
  expectMetadataLike({
    'AWS::CloudFormation::Init': {
      config: {
        commands: {
          '000': { command: ['/bin/true'] },
        },
      },
    },
  });
});

test('empty configs are not rendered', () => {
  // GIVEN
  const config1 = new ec2.InitConfig([]);
  const config2 = new ec2.InitConfig([
    ec2.InitCommand.argvCommand(['/bin/true']),
  ]);

  // WHEN
  const init = ec2.CloudFormationInit.fromConfigSets({
    configSets: { default: ['config2', 'config1'] },
    configs: { config1, config2 },
  });
  init.attach(resource, linuxOptions());

  // THEN
  expectMetadataLike({
    'AWS::CloudFormation::Init': {
      configSets: {
        default: ['config2'],
      },
      config2: {
        commands: {
          '000': { command: ['/bin/true'] },
        },
      },
    },
  });
});

describe('userdata', () => {
  let simpleInit: ec2.CloudFormationInit;
  beforeEach(() => {
    simpleInit = ec2.CloudFormationInit.fromElements(
      ec2.InitCommand.argvCommand(['/bin/true']),
    );
  });

  test('linux userdata contains right commands', () => {
    // WHEN
    simpleInit.attach(resource, linuxOptions());

    // THEN
    const lines = linuxUserData.render().split('\n');
    expectLine(lines, cmdArg('cfn-init', `--region ${Aws.REGION}`));
    expectLine(lines, cmdArg('cfn-init', `--stack ${Aws.STACK_NAME}`));
    expectLine(lines, cmdArg('cfn-init', `--resource ${resource.logicalId}`));
    expectLine(lines, cmdArg('cfn-init', '-c default'));
    expectLine(lines, cmdArg('cfn-signal', `--region ${Aws.REGION}`));
    expectLine(lines, cmdArg('cfn-signal', `--stack ${Aws.STACK_NAME}`));
    expectLine(lines, cmdArg('cfn-signal', `--resource ${resource.logicalId}`));
    expectLine(lines, cmdArg('cfn-signal', '-e $?'));
    expectLine(lines, cmdArg('cat', 'cfn-init.log'));
    expectLine(lines, /fingerprint/);
  });

  test('Windows userdata contains right commands', () => {
    // WHEN
    const windowsUserData = ec2.UserData.forWindows();

    simpleInit.attach(resource, {
      platform: ec2.OperatingSystemType.WINDOWS,
      instanceRole,
      userData: windowsUserData,
    });

    // THEN
    const lines = windowsUserData.render().split('\n');
    expectLine(lines, cmdArg('cfn-init', `--region ${Aws.REGION}`));
    expectLine(lines, cmdArg('cfn-init', `--stack ${Aws.STACK_NAME}`));
    expectLine(lines, cmdArg('cfn-init', `--resource ${resource.logicalId}`));
    expectLine(lines, cmdArg('cfn-init', '-c default'));
    expectLine(lines, cmdArg('cfn-signal', `--region ${Aws.REGION}`));
    expectLine(lines, cmdArg('cfn-signal', `--stack ${Aws.STACK_NAME}`));
    expectLine(lines, cmdArg('cfn-signal', `--resource ${resource.logicalId}`));
    expectLine(lines, cmdArg('cfn-signal', '-e $LASTEXITCODE'));
    expectLine(lines, cmdArg('type', 'cfn-init.log'));
    expectLine(lines, /fingerprint/);
  });

  test('ignoreFailures disables result code reporting', () => {
    // WHEN
    simpleInit.attach(resource, {
      ...linuxOptions(),
      ignoreFailures: true,
    });

    // THEN
    const lines = linuxUserData.render().split('\n');
    dontExpectLine(lines, cmdArg('cfn-signal', '-e $?'));
    expectLine(lines, cmdArg('cfn-signal', '-e 0'));
  });

  test('can disable log printing', () => {
    // WHEN
    simpleInit.attach(resource, {
      ...linuxOptions(),
      printLog: false,
    });

    // THEN
    const lines = linuxUserData.render().split('\n');
    dontExpectLine(lines, cmdArg('cat', 'cfn-init.log'));
  });

  test('can disable fingerprinting', () => {
    // WHEN
    simpleInit.attach(resource, {
      ...linuxOptions(),
      embedFingerprint: false,
    });

    // THEN
    const lines = linuxUserData.render().split('\n');
    dontExpectLine(lines, /fingerprint/);
  });

  test('can request multiple different configsets to be used', () => {
    // WHEN
    simpleInit.attach(resource, {
      ...linuxOptions(),
      configSets: ['banana', 'peach'],
    });

    // THEN
    const lines = linuxUserData.render().split('\n');
    expectLine(lines, cmdArg('cfn-init', '-c banana,peach'));
  });
});

function linuxOptions() {
  return {
    platform: ec2.OperatingSystemType.LINUX,
    instanceRole,
    userData: linuxUserData,
  };
}

function expectMetadataLike(pattern: any) {
  expect(stack).toHaveResourceLike('CDK::Test::Resource', {
    Metadata: pattern,
  }, ResourcePart.CompleteDefinition);
}

function expectLine(lines: string[], re: RegExp) {
  for (const line of lines) {
    if (re.test(line)) { return; }
  }

  throw new Error(`None of the lines matched '${re}': ${lines.join('\n')}`);
}

function dontExpectLine(lines: string[], re: RegExp) {
  try {
    expectLine(lines, re);
  } catch (e) {
    return;
  }
  throw new Error(`Found unexpected line matching '${re}': ${lines.join('\n')}`);
}

function cmdArg(command: string, argument: string) {
  return new RegExp(`${escapeRegex(command)}(\.exe)? .*${escapeRegex(argument)}`);
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
