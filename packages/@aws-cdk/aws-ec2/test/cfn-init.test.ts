import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import { App, Stack, CfnResource } from '@aws-cdk/core';
import * as ec2 from '../lib';
import { ResourcePart } from '@aws-cdk/assert';

let app: App;
let stack: Stack;
let instanceRole: iam.Role;
let resource: CfnResource;
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
});

test('whole config with restart handles', () => {
  // WHEN
  const handle = new ec2.InitServiceRestartHandle();
  const config = new ec2.InitConfig([
    ec2.InitFile.fromString('/etc/my.cnf', '[mysql]\ngo_fast=true', { serviceRestartHandles: [handle] }),
    ec2.InitSource.fromUrl('/tmp/foo', 'https://amazon.com/foo.zip', { serviceRestartHandles: [handle] }),
    ec2.InitPackage.yum('httpd', { serviceRestartHandles: [handle] }),
    ec2.InitCommand.argvCommand(['/bin/true'], { serviceRestartHandles: [handle] }),
    ec2.InitService.enable('httpd', { serviceRestartHandle: handle }),
  ]);

  // THEN
  expect(config.bind(stack, linuxOptions()).config).toEqual(expect.objectContaining({
    services: {
      sysvinit: {
        httpd: {
          enabled: true,
          ensureRunning: true,
          commands: ['000'],
          files: ['/etc/my.cnf'],
          packages: {
            yum: ['httpd'],
          },
          sources: ['/tmp/foo'],
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
  config.add(ec2.InitFile.fromString('/the/file', 'hasContents'));
  init.attach(resource, linuxOptions());

  // THEN
  expectMetadataLike({
    'AWS::CloudFormation::Init': {
      config: {
        files: {
          '/the/file': { content: 'hasContents' },
        },
      },
    },
  });


});

test('empty configs are not rendered', () => {
});

describe('userdata', () => {
  test('linux userdata contains right commands', () => {
  });

  test('can disable result code reporting', () => {
  });

  test('can disable log printing', () => {
  });

  test('can disable fingerprinting', () => {
  });

  test('can request multiple different configsets to be used', () => {
  });
});

describe('assets', () => {
  test('appropriate permissions when using initfile', () => {
  });

  test('appropriate permissions when using initsource', () => {
  });

  test('no duplication of bucket names when using multiple assets', () => {
  });

  test('multiple buckets appear in the same auth block', () => {
  });
});

describe('s3 objects', () => {
  test('appropriate permissions when using initfile', () => {
  });

  test('appropriate permissions when using initsource', () => {
  });
});

function linuxOptions() {
  return {
    platform: ec2.InitPlatform.LINUX,
    instanceRole,
    userData: ec2.UserData.forLinux(),
  };
}

function expectMetadataLike(pattern: any) {
  expect(stack).toHaveResourceLike('CDK::Test::Resource', {
    Metadata: pattern,
  }, ResourcePart.CompleteDefinition);
}