import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { Instance, Bundle, Platform, LinuxOSBlueprint, WindowsOSBlueprint, LinuxAppBlueprint } from '../lib';


test('create a Linux OS instance', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new Instance(stack, 'DemoInstance', {
    image: Platform.linuxOS({ blueprint: LinuxOSBlueprint.AMAZON_LINUX_2 }),
    bundle: Bundle.SMALL_2_0,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lightsail::Instance', {
    BlueprintId: 'amazon_linux_2',
    BundleId: 'small_2_0',
    InstanceName: 'DemoInstance',
  });
});

test('create a Windows OS instance', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new Instance(stack, 'DemoInstance', {
    bundle: Bundle.SMALL_WIN_2_0,
    image: Platform.windowsOS({ blueprint: WindowsOSBlueprint.WINDOWS_SERVER_2019 }),
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lightsail::Instance', {
    BlueprintId: 'windows_server_2019',
    BundleId: 'small_win_2_0',
    InstanceName: 'DemoInstance',
  });
});

test('create a Linux App instance', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new Instance(stack, 'DemoInstance', {
    bundle: Bundle.SMALL_2_0,
    image: Platform.linuxApp({ blueprint: LinuxAppBlueprint.CPANEL_WHM_LINUX }),
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lightsail::Instance', {
    BlueprintId: 'cpanel_whm_linux',
    BundleId: 'small_2_0',
    InstanceName: 'DemoInstance',
  });
});

test('custom instance name', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new Instance(stack, 'DemoInstance', {
    bundle: Bundle.SMALL_2_0,
    image: Platform.linuxOS({ blueprint: LinuxOSBlueprint.AMAZON_LINUX_2 }),
    instanceName: 'custom-name',
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lightsail::Instance', {
    BlueprintId: 'amazon_linux_2',
    BundleId: 'small_2_0',
    InstanceName: 'custom-name',
  });
});

test('import instance by instanceName', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const instance = Instance.fromInstanceName(stack, 'ImportedInstance', 'mock');
  // THEN
  expect(instance).toHaveProperty('instanceName');
  expect(instance).toHaveProperty('instanceArn');
});
