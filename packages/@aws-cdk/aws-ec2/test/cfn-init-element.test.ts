import { Duration } from '@aws-cdk/core';
import * as ec2 from '../lib';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

describe('InitCommand', () => {

  test('throws error on empty argv command', () => {
    expect(() => { ec2.InitCommand.argvCommand([]) }).toThrow();
  });

  test('auto-generates an indexed command key if none is provided', () => {
    // GIVEN
    const command = ec2.InitCommand.shellCommand('/bin/sh');

    // WHEN
    const rendered = command.renderElement({
      platform: ec2.InitRenderPlatform.LINUX,
      index: 1,
    });

    // THEN
    expect(rendered['001']).toBeDefined();
  });

  test('renders a minimalist template when no options are defined', () => {
    // GIVEN
    const command = ec2.InitCommand.shellCommand('/bin/sh');

    // WHEN
    const rendered = command.renderElement({
      platform: ec2.InitRenderPlatform.LINUX,
      index: 1,
    });

    // THEN
    expect(rendered).toEqual({
      '001': { command: '/bin/sh' },
    });
  });

  test('creates a shell command with all provided options', () => {
    // GIVEN
    const command = ec2.InitCommand.shellCommand('/bin/sh', {
      key: 'command_0',
      env: { 'SECRETS_FILE': '/tmp/secrets' },
      cwd: '/home/myUser',
      test: 'test -d /home/myUser',
      ignoreErrors: false,
      waitAfterCompletion: Duration.hours(2),
    });

    // WHEN
    const rendered = command.renderElement({
      platform: ec2.InitRenderPlatform.WINDOWS,
      index: 0,
    });

    // THEN
    expect(rendered).toEqual({
      'command_0': {
        command: '/bin/sh',
        env: { 'SECRETS_FILE': '/tmp/secrets' },
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
      env: { 'SECRETS_FILE': '/tmp/secrets' },
      cwd: '/home/myUser',
      test: 'test -d /home/myUser',
      ignoreErrors: false,
      waitAfterCompletion: Duration.hours(2),
    });

    // WHEN
    const rendered = command.renderElement({
      platform: ec2.InitRenderPlatform.WINDOWS,
      index: 0,
    });

    // THEN
    expect(rendered).toEqual({
      'command_0': {
        command: ['/bin/sh', '-c', 'doStuff'],
        env: { 'SECRETS_FILE': '/tmp/secrets' },
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
      env: { 'SECRETS_FILE': '/tmp/secrets' },
      cwd: '/home/myUser',
      test: 'test -d /home/myUser',
      ignoreErrors: false,
      waitAfterCompletion: Duration.hours(2),
    });

    // THEN
    expect(() => {
      command.renderElement({
        platform: ec2.InitRenderPlatform.LINUX,
        index: 0,
      });
    }).toThrow(/'waitAfterCompletion' is only valid for Windows/);
  });

});

describe('InitFile', () => {

  test('fromString creates inline content', () => {
    // GIVEN
    const file = ec2.InitFile.fromString('/tmp/foo', 'My content');

    // WHEN
    const rendered = file.renderElement({
      platform: ec2.InitRenderPlatform.LINUX,
      index: 0,
    });

    // THEN
    expect(rendered).toEqual({
      '/tmp/foo': {
        content: 'My content',
        encoding: 'plain',
        owner: 'root',
        group: 'root',
        mode: '000644',
      },
    });
  });

  test('fromString creates inline content from base64-encoded content', () => {
    // GIVEN
    const file = ec2.InitFile.fromString('/tmp/foo', new Buffer('Hello').toString('base64'), {
      base64Encoded: true,
    });

    // WHEN
    const rendered = file.renderElement({
      platform: ec2.InitRenderPlatform.LINUX,
      index: 0,
    });

    // THEN
    expect(rendered).toEqual({
      '/tmp/foo': {
        content: 'SGVsbG8=',
        encoding: 'base64',
        owner: 'root',
        group: 'root',
        mode: '000644',
      },
    });
  });

  test('mode, user, group settings not allowed for Windows', () => {
    // GIVEN
    const file = ec2.InitFile.fromString('/tmp/foo', 'My content', {
      group: 'root',
      owner: 'root',
      mode: '000644',
    });

    // WHEN
    expect(() => {
      file.renderElement({
        platform: ec2.InitRenderPlatform.WINDOWS,
        index: 0,
      });
    }).toThrow('Owner, group, and mode options not supported for Windows.');
  });

  test('symlink throws an error if mode is set incorrectly', () => {
    expect(() => {
      ec2.InitFile.symlink('/tmp/foo', '/tmp/bar', {
        mode: '000644',
      });
    }).toThrow('File mode for symlinks must begin with 120XXX');
  });

  test('symlink sets mode is not set', () => {
    // GIVEN
    const file = ec2.InitFile.symlink('/tmp/foo', '/tmp/bar');

    // WHEN
    const rendered = file.renderElement({
      platform: ec2.InitRenderPlatform.LINUX,
      index: 0,
    });

    // THEN
    expect(rendered).toEqual({
      '/tmp/foo': {
        content: '/tmp/bar',
        encoding: 'plain',
        owner: 'root',
        group: 'root',
        mode: '120644',
      },
    });
  });

  test('fromFileInline renders the file contents inline', () => {
    // GIVEN
    const tmpFilePath = createTmpFileWithContent('Hello World!');
    const file = ec2.InitFile.fromFileInline('/tmp/foo', tmpFilePath);

    // WHEN
    const rendered = file.renderElement({
      platform: ec2.InitRenderPlatform.LINUX,
      index: 0,
    });

    // THEN
    expect(rendered).toEqual({
      '/tmp/foo': {
        content: 'Hello World!',
        encoding: 'plain',
        owner: 'root',
        group: 'root',
        mode: '000644',
      },
    });
  });

  test('fromObject renders the contents inline as an object', () => {
    // GIVEN
    const content = {
      version: '1234',
      secretsFile: '/tmp/secrets',
    };
    const file = ec2.InitFile.fromObject('/tmp/foo', content);

    // WHEN
    const rendered = file.renderElement({
      platform: ec2.InitRenderPlatform.LINUX,
      index: 0,
    });

    // THEN
    expect(rendered).toEqual({
      '/tmp/foo': {
        content: {
          version: '1234',
          secretsFile: '/tmp/secrets',
        },
        owner: 'root',
        group: 'root',
        mode: '000644',
      },
    });
  });

  test('fromFileInline respects the base64 flag', () => {
    // GIVEN
    const tmpFilePath = createTmpFileWithContent('Hello');
    const file = ec2.InitFile.fromFileInline('/tmp/foo', tmpFilePath, {
      base64Encoded: true,
    });

    // WHEN
    const rendered = file.renderElement({
      platform: ec2.InitRenderPlatform.LINUX,
      index: 0,
    });

    // THEN
    expect(rendered).toEqual({
      '/tmp/foo': {
        content: 'SGVsbG8=',
        encoding: 'base64',
        owner: 'root',
        group: 'root',
        mode: '000644',
      },
    });
  });

  test('fromUrl uses the provided URL as a source', () => {
    // GIVEN
    const file = ec2.InitFile.fromUrl('/tmp/foo', 'https://aws.amazon.com/');

    // WHEN
    const rendered = file.renderElement({
      platform: ec2.InitRenderPlatform.LINUX,
      index: 0,
    });

    // THEN
    expect(rendered).toEqual({
      '/tmp/foo': {
        source: 'https://aws.amazon.com/',
        owner: 'root',
        group: 'root',
        mode: '000644',
      },
    });
  });

});

describe('InitGroup', () => {

  test('renders without a group id', () => {
    // GIVEN
    const group = ec2.InitGroup.fromName('amazon');

    // WHEN
    const rendered = group.renderElement({
      platform: ec2.InitRenderPlatform.LINUX,
      index: 0,
    });

    // THEN
    expect(rendered).toEqual({ amazon: {} });
  });

  test('renders with a group id', () => {
    // GIVEN
    const group = ec2.InitGroup.fromName('amazon', 42);

    // WHEN
    const rendered = group.renderElement({
      platform: ec2.InitRenderPlatform.LINUX,
      index: 0,
    });

    // THEN
    expect(rendered).toEqual({ amazon: { gid: 42 } });
  });

  test('throws on a Windows render', () => {
    // GIVEN
    const group = ec2.InitGroup.fromName('amazon');

    // WHEN
    expect(() => {
      group.renderElement({
        platform: ec2.InitRenderPlatform.WINDOWS,
        index: 0,
      });
    }).toThrow('Init groups are not supported on Windows');
  });

});

function createTmpFileWithContent(content: string): string {
  const suffix = crypto.randomBytes(4).toString('hex');
  const fileName = path.join(os.tmpdir(), `cfn-init-element-test-${suffix}`);
  fs.writeFileSync(fileName, content);
  return fileName;
}