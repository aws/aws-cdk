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

  // THEN
  expect(config.renderConfig(stack, ec2.InitRenderPlatform.LINUX)).toEqual(expect.objectContaining({
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
