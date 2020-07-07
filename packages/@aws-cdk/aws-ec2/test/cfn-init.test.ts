import * as iam from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';
import * as ec2 from '../lib';

test('whole config with restart handles', () => {
  // WHEN
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
  const handle = new ec2.InitServiceRestartHandle();
  const config = new ec2.InitConfig([
    ec2.InitFile.fromString('/etc/my.cnf', '[mysql]\ngo_fast=true', { serviceRestartHandles: [handle] }),
    ec2.InitSource.fromUrl('/tmp/foo', 'https://amazon.com/foo.zip', { serviceRestartHandles: [handle] }),
    ec2.InitPackage.yum('httpd', { serviceRestartHandles: [handle] }),
    ec2.InitCommand.argvCommand(['/bin/true'], { serviceRestartHandles: [handle] }),
    ec2.InitService.enable('httpd', { serviceRestartHandle: handle }),
  ]);

  const instanceRole = new iam.Role(stack, 'InstanceRole', {
    assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
  });
  const attachOptions = {
    platform: ec2.InitPlatform.LINUX,
    instanceRole,
    userData: ec2.UserData.forLinux(),
  };

  // THEN
  expect(config.bind(stack, attachOptions).config).toEqual(expect.objectContaining({
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
});

describe('userdata', () => {
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
});

describe('s3 objects', () => {
  test('appropriate permissions when using initfile', () => {
  });

  test('appropriate permissions when using initsource', () => {
  });
});
