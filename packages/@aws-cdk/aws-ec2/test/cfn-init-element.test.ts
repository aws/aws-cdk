import * as iam from '@aws-cdk/aws-iam';
import { App, Duration, Stack } from '@aws-cdk/core';
import * as ec2 from '../lib';
import { InitPlatform } from '../lib/private/cfn-init-internal';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

describe('InitCommand', () => {

  test('throws error on empty argv command', () => {
    expect(() => { ec2.InitCommand.argvCommand([]); }).toThrow();
  });

  test('auto-generates an indexed command key if none is provided', () => {
    // GIVEN
    const command = ec2.InitCommand.shellCommand('/bin/sh');

    // WHEN
    const rendered = getElementConfig(command, InitPlatform.LINUX);

    // THEN
    expect(rendered['000']).toBeDefined();
  });

  test('renders a minimalist template when no options are defined', () => {
    // GIVEN
    const command = ec2.InitCommand.shellCommand('/bin/sh');

    // WHEN
    const rendered = getElementConfig(command, InitPlatform.LINUX);

    // THEN
    expect(rendered).toEqual({
      '000': { command: ['/bin/sh'] },
    });
  });

  test('creates a shell command with all provided options', () => {
    // GIVEN
    const command = ec2.InitCommand.shellCommand('/bin/sh', {
      key: 'command_0',
      env: { SECRETS_FILE: '/tmp/secrets' },
      cwd: '/home/myUser',
      testCmd: 'test -d /home/myUser',
      ignoreErrors: false,
      waitAfterCompletion: ec2.InitCommandWaitDuration.of(Duration.hours(2)),
    });

    // WHEN
    const rendered = getElementConfig(command, InitPlatform.WINDOWS);

    // THEN
    expect(rendered).toEqual({
      command_0: {
        command: ['/bin/sh'],
        env: { SECRETS_FILE: '/tmp/secrets' },
        cwd: '/home/myUser',
        test: 'test -d /home/myUser',
        ignoreErrors: false,
        waitAfterCompletion: 7200,
      },
    });
  });

  test('creates an argv command with all provided options', () => {
    // GIVEN
    const command = ec2.InitCommand.argvCommand(['/bin/sh', '-c', 'doStuff'], {
      key: 'command_0',
      env: { SECRETS_FILE: '/tmp/secrets' },
      cwd: '/home/myUser',
      testCmd: 'test -d /home/myUser',
      ignoreErrors: false,
      waitAfterCompletion: ec2.InitCommandWaitDuration.of(Duration.hours(2)),
    });

    // WHEN
    const rendered = getElementConfig(command, InitPlatform.WINDOWS);

    // THEN
    expect(rendered).toEqual({
      command_0: {
        command: ['/bin/sh', '-c', 'doStuff'],
        env: { SECRETS_FILE: '/tmp/secrets' },
        cwd: '/home/myUser',
        test: 'test -d /home/myUser',
        ignoreErrors: false,
        waitAfterCompletion: 7200,
      },
    });
  });

  test('errors when waitAfterCompletion is specified for Linux systems', () => {
    // GIVEN
    const command = ec2.InitCommand.shellCommand('/bin/sh', {
      key: 'command_0',
      env: { SECRETS_FILE: '/tmp/secrets' },
      cwd: '/home/myUser',
      testCmd: 'test -d /home/myUser',
      ignoreErrors: false,
      waitAfterCompletion: ec2.InitCommandWaitDuration.of(Duration.hours(2)),
    });

    // THEN
    expect(() => {
      command._bind(defaultOptions(InitPlatform.LINUX));
    }).toThrow(/'waitAfterCompletion' is only valid for Windows/);
  });

});

describe('InitService', () => {

  test.each([
    ['Linux', 'sysvinit', InitPlatform.LINUX],
    ['Windows', 'windows', InitPlatform.WINDOWS],
  ])('enable always sets enabled and running to true for %s', (_platform, key, platform) => {
    // GIVEN
    const service = ec2.InitService.enable('httpd');

    // WHEN
    const rendered = service._bind(defaultOptions(platform)).config;

    // THEN
    expect(rendered[key]).toBeDefined();
    expect(rendered[key]).toEqual({
      httpd: {
        enabled: true,
        ensureRunning: true,
      },
    });
  });

  test.each([
    ['Linux', 'sysvinit', InitPlatform.LINUX],
    ['Windows', 'windows', InitPlatform.WINDOWS],
  ])('disable returns a minimalist disabled service for %s', (_platform, key, platform) => {
    // GIVEN
    const service = ec2.InitService.disable('httpd');

    // WHEN
    const rendered = service._bind(defaultOptions(platform)).config;

    // THEN
    expect(rendered[key]).toBeDefined();
    expect(rendered[key]).toEqual({
      httpd: {
        enabled: false,
        ensureRunning: false,
      },
    });
  });

});

function getElementConfig(element: ec2.InitElement, platform: InitPlatform) {
  return element._bind(defaultOptions(platform)).config;
}

function defaultOptions(platform: InitPlatform) {
  return {
    scope: stack,
    index: 0,
    platform,
    instanceRole: new iam.Role(stack, 'InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    }),
  };
}
