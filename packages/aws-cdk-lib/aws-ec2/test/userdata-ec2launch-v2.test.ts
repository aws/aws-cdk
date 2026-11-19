import * as YAML from 'yaml';
import { Template } from '../../assertions';
import { Bucket } from '../../aws-s3';
import type { CfnResource } from '../../core';
import { Aws, Fn, Lazy, Stack } from '../../core';
import * as ec2 from '../lib';

function parse(userData: ec2.UserData) {
  return YAML.parse(userData.render(), { version: '1.1' });
}

describe('EC2Launch v2 user data', () => {
  test('renders commands as a PowerShell executeScript task', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addCommands('command1', 'command2');

    // THEN
    expect(userData.render()).toEqual([
      'version: 1.1',
      'tasks:',
      '  - task: executeScript',
      '    inputs:',
      '      - frequency: once',
      '        type: powershell',
      '        runAs: localSystem',
      '        content: |-',
      '          command1',
      '          command2',
      '',
    ].join('\n'));
  });

  test('renders an empty task list without commands or tasks', () => {
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    expect(parse(userData)).toEqual({ version: 1.1, tasks: [] });
  });

  test('omits the command script when no commands were added', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addCommands();
    userData.addTask(ec2.Ec2LaunchV2Task.startSsm());

    // THEN
    expect(parse(userData)).toEqual({ version: 1.1, tasks: [{ task: 'startSsm' }] });
  });

  test('keeps a user executeScript input when the command script is empty', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addCommands();
    userData.addTask(ec2.Ec2LaunchV2Task.executePowerShell({ content: 'script' }));

    // THEN
    expect(parse(userData).tasks).toEqual([{
      task: 'executeScript',
      inputs: [{ frequency: 'once', type: 'powershell', runAs: 'localSystem', content: 'script' }],
    }]);
  });

  test('applies script options to the commands', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2({
      frequency: ec2.Ec2LaunchV2Frequency.ALWAYS,
      runAs: ec2.Ec2LaunchV2RunAs.ADMIN,
      detach: true,
      arguments: ['-NoProfile'],
    });

    // WHEN
    userData.addCommands('command1');

    // THEN
    expect(parse(userData).tasks).toEqual([{
      task: 'executeScript',
      inputs: [{
        frequency: 'always',
        type: 'powershell',
        runAs: 'admin',
        detach: true,
        arguments: ['-NoProfile'],
        content: 'command1',
      }],
    }]);
  });

  test('runs commands on exit when the commands complete or throw, but not on exit', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addCommands('command1', 'command2');
    userData.addOnExitCommands('onexit1', 'onexit2');

    // THEN
    expect(parse(userData).tasks[0].inputs[0].content).toEqual([
      '$success = $true',
      '$finished = $false',
      'try {',
      'command1',
      'command2',
      '$finished = $true',
      '} catch {',
      '$success = $false',
      '$finished = $true',
      'throw',
      '} finally {',
      'if ($finished) {',
      'onexit1',
      'onexit2',
      '}',
      '}',
    ].join('\n'));
  });

  test('can add a signal command', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Default', { env: { region: 'us-east-1' } });
    const resource = new ec2.Vpc(stack, 'RESOURCE');
    const userData = ec2.UserData.forWindowsEc2LaunchV2();
    const logicalId = (resource.node.defaultChild as CfnResource).logicalId;

    // WHEN
    userData.addSignalOnExitCommand(resource);
    userData.addCommands('command1');

    // THEN
    const content = parse(userData).tasks[0].inputs[0].content;
    expect(stack.resolve(content)).toEqual([
      '$success = $true',
      '$finished = $false',
      'try {',
      'command1',
      '$finished = $true',
      '} catch {',
      '$success = $false',
      '$finished = $true',
      'throw',
      '} finally {',
      'if ($finished) {',
      `cfn-signal --stack Default --resource ${stack.resolve(logicalId)} --region us-east-1 --success ($success.ToString().ToLower())`,
      '}',
      '}',
    ].join('\n'));
  });

  test('can download S3 files', () => {
    // GIVEN
    const stack = new Stack();
    const userData = ec2.UserData.forWindowsEc2LaunchV2();
    const bucket = Bucket.fromBucketName(stack, 'testBucket', 'test');

    // WHEN
    const localPath = userData.addS3DownloadCommand({ bucket, bucketKey: 'filename.bat', region: 'us-east-1' });

    // THEN
    expect(localPath).toEqual('C:/temp/filename.bat');
    expect(parse(userData).tasks[0].inputs[0].content).toEqual([
      'mkdir (Split-Path -Path \'C:/temp/filename.bat\' ) -ea 0',
      'Read-S3Object -BucketName \'test\' -key \'filename.bat\' -file \'C:/temp/filename.bat\' -ErrorAction Stop -Region us-east-1',
    ].join('\n'));
  });

  test('can execute files', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addExecuteFileCommand({ filePath: 'C:\\test\\filename.bat', arguments: 'arg1 arg2' });

    // THEN
    expect(parse(userData).tasks[0].inputs[0].content).toEqual([
      '&\'C:\\test\\filename.bat\' arg1 arg2',
      'if (!$?) { Write-Error \'Failed to execute the file "C:\\test\\filename.bat"\' -ErrorAction Stop }',
    ].join('\n'));
  });

  test('keeps tokens in commands intact', () => {
    // GIVEN
    const stack = new Stack();
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addCommands(`Write-Host ${Aws.REGION} ${Lazy.string({ produce: () => 'yes' })}`);
    new ec2.CfnLaunchTemplate(stack, 'Template', {
      launchTemplateData: { userData: Fn.base64(userData.render()) },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
      LaunchTemplateData: {
        UserData: {
          'Fn::Base64': {
            'Fn::Join': ['', [
              'version: 1.1\ntasks:\n  - task: executeScript\n    inputs:\n      - frequency: once\n        type: powershell\n        runAs: localSystem\n        content: |-\n          Write-Host ',
              { Ref: 'AWS::Region' },
              ' yes\n',
            ]],
          },
        },
      },
    });
  });

  test('can be used as instance user data', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const userData = ec2.UserData.forWindowsEc2LaunchV2();
    const instance = new ec2.Instance(stack, 'Instance', {
      vpc,
      instanceType: new ec2.InstanceType('t3.medium'),
      machineImage: ec2.MachineImage.genericWindows({ 'us-east-1': 'ami-12345678' }),
      userData,
    });

    // WHEN
    userData.addTask(ec2.Ec2LaunchV2Task.startSsm());

    // THEN
    expect(instance.userData).toBe(userData);
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      UserData: { 'Fn::Base64': 'version: 1.1\ntasks:\n  - task: startSsm\n' },
    });
  });

  test('renders tasks in the order they were first added', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addTask(ec2.Ec2LaunchV2Task.executeProgram({ path: 'C:\\a.exe' }));
    userData.addCommands('command1');
    userData.addTask(ec2.Ec2LaunchV2Task.executePowerShell({ content: 'script2' }));
    userData.addTask(ec2.Ec2LaunchV2Task.executeProgram({ path: 'C:\\b.exe', frequency: ec2.Ec2LaunchV2Frequency.ALWAYS }));
    userData.addCommands('command2');

    // THEN
    expect(parse(userData).tasks).toEqual([
      {
        task: 'executeProgram',
        inputs: [
          { frequency: 'once', path: 'C:\\a.exe', runAs: 'localSystem' },
          { frequency: 'always', path: 'C:\\b.exe', runAs: 'localSystem' },
        ],
      },
      {
        task: 'executeScript',
        inputs: [
          { frequency: 'once', type: 'powershell', runAs: 'localSystem', content: 'command1\ncommand2' },
          { frequency: 'once', type: 'powershell', runAs: 'localSystem', content: 'script2' },
        ],
      },
    ]);
  });

  test('can add a PowerShell script', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addTask(ec2.Ec2LaunchV2Task.executePowerShell({
      content: 'Get-Process',
      runAs: ec2.Ec2LaunchV2RunAs.ADMIN,
      detach: true,
      arguments: ['-NoProfile'],
    }));

    // THEN
    expect(parse(userData).tasks).toEqual([{
      task: 'executeScript',
      inputs: [{ frequency: 'once', type: 'powershell', runAs: 'admin', detach: true, arguments: ['-NoProfile'], content: 'Get-Process' }],
    }]);
  });

  test('can add a batch script', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addTask(ec2.Ec2LaunchV2Task.executeBatch({
      content: 'systeminfo',
      runAs: ec2.Ec2LaunchV2RunAs.ADMIN,
      frequency: ec2.Ec2LaunchV2Frequency.ALWAYS,
      detach: false,
    }));

    // THEN
    expect(parse(userData).tasks).toEqual([{
      task: 'executeScript',
      inputs: [{ frequency: 'always', type: 'batch', runAs: 'admin', detach: false, content: 'systeminfo' }],
    }]);
  });

  test('renders strings containing tokens in task inputs as literal blocks', () => {
    // GIVEN
    const stack = new Stack();
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addTask(ec2.Ec2LaunchV2Task.executeProgram({ path: `C:\\${Aws.STACK_NAME}.exe` }));

    // THEN
    expect(stack.resolve(userData.render())).toEqual({
      'Fn::Join': ['', [
        'version: 1.1\ntasks:\n  - task: executeProgram\n    inputs:\n      - frequency: once\n        path: |-\n          C:\\',
        { Ref: 'AWS::StackName' },
        '.exe\n        runAs: localSystem\n',
      ]],
    });
  });

  test('can add an executeProgram task', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addTask(ec2.Ec2LaunchV2Task.executeProgram({ path: 'C:\\setup.exe', arguments: ['/L=1033', '/S'] }));
    userData.addTask(ec2.Ec2LaunchV2Task.executeProgram({ path: 'C:\\other.exe', frequency: ec2.Ec2LaunchV2Frequency.ALWAYS }));

    // THEN
    expect(parse(userData).tasks).toEqual([{
      task: 'executeProgram',
      inputs: [
        { frequency: 'once', path: 'C:\\setup.exe', arguments: ['/L=1033', '/S'], runAs: 'localSystem' },
        { frequency: 'always', path: 'C:\\other.exe', runAs: 'localSystem' },
      ],
    }]);
  });

  test('can initialize all volumes', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addTask(ec2.Ec2LaunchV2Task.initializeVolume());

    // THEN
    expect(parse(userData).tasks).toEqual([{ task: 'initializeVolume', inputs: { initialize: 'all' } }]);
  });

  test('can initialize specific volumes', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addTask(ec2.Ec2LaunchV2Task.initializeVolume({
      devices: [
        { device: 'xvdb', name: 'DataVolume1', letter: 'D', partition: ec2.Ec2LaunchV2PartitionType.MBR },
        { device: '/dev/nvme0n1' },
      ],
    }));

    // THEN
    expect(parse(userData).tasks).toEqual([{
      task: 'initializeVolume',
      inputs: {
        initialize: 'devices',
        devices: [
          { device: 'xvdb', name: 'DataVolume1', letter: 'D', partition: 'mbr' },
          { device: '/dev/nvme0n1' },
        ],
      },
    }]);
  });

  test('fails to initialize an empty list of devices', () => {
    expect(() => ec2.Ec2LaunchV2Task.initializeVolume({ devices: [] }))
      .toThrow(/devices must not be empty/);
  });

  test.each(['', 'DE', '1', 'Ä'])('fails for invalid drive letter %j', (letter) => {
    expect(() => ec2.Ec2LaunchV2Task.initializeVolume({ devices: [{ device: 'xvdb', letter }] }))
      .toThrow(/drive letter must be a single letter/);
  });

  test('does not validate a tokenized drive letter', () => {
    const letter = Lazy.string({ produce: () => 'DE' });
    expect(() => ec2.Ec2LaunchV2Task.initializeVolume({ devices: [{ device: 'xvdb', letter }] })).not.toThrow();
  });

  test('can set the host name', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addTask(ec2.Ec2LaunchV2Task.hostName({ hostName: 'web-01', reboot: true }));

    // THEN
    expect(parse(userData).tasks).toEqual([{ task: 'setHostName', inputs: { hostName: 'web-01', reboot: true } }]);
  });

  test('sets the host name from the IP address and does not reboot by default', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addTask(ec2.Ec2LaunchV2Task.hostName());

    // THEN
    expect(parse(userData).tasks).toEqual([{ task: 'setHostName', inputs: { reboot: false } }]);
  });

  test.each(['a-very-long-hostname', 'abcdefghijklmnop', 'web_01', '12345', ''])('fails for invalid host name %j', (hostName) => {
    expect(() => ec2.Ec2LaunchV2Task.hostName({ hostName }))
      .toThrow(/host name must be at most 15 characters/);
  });

  test.each(['abcdefghijklmno', '1web'])('accepts host name %j', (hostName) => {
    expect(() => ec2.Ec2LaunchV2Task.hostName({ hostName })).not.toThrow();
  });

  test('does not validate a tokenized host name', () => {
    expect(() => ec2.Ec2LaunchV2Task.hostName({ hostName: Lazy.string({ produce: () => 'web_01' }) })).not.toThrow();
  });

  test('can set the wallpaper with all tags', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addTask(ec2.Ec2LaunchV2Task.wallpaper({
      attributes: [ec2.Ec2LaunchV2WallpaperAttribute.HOST_NAME, ec2.Ec2LaunchV2WallpaperAttribute.INSTANCE_ID],
      instanceTags: ec2.Ec2LaunchV2WallpaperTags.all(),
    }));

    // THEN
    expect(parse(userData).tasks).toEqual([{
      task: 'setWallpaper',
      inputs: {
        path: 'C:\\ProgramData\\Amazon\\EC2Launch\\wallpaper\\Ec2Wallpaper.jpg',
        attributes: ['hostName', 'instanceId'],
        instanceTags: 'AllTags',
      },
    }]);
  });

  test('can set the wallpaper with named tags', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addTask(ec2.Ec2LaunchV2Task.wallpaper({
      path: 'C:\\wallpaper.jpg',
      instanceTags: ec2.Ec2LaunchV2WallpaperTags.of('Tag 1', 'Tag 2'),
    }));

    // THEN
    expect(parse(userData).tasks).toEqual([{
      task: 'setWallpaper',
      inputs: { path: 'C:\\wallpaper.jpg', instanceTags: ['Tag 1', 'Tag 2'] },
    }]);
  });

  test('fails for wallpaper tags without names', () => {
    expect(() => ec2.Ec2LaunchV2WallpaperTags.of()).toThrow(/at least one tag name must be given/);
  });

  test('can run sysprep', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addTask(ec2.Ec2LaunchV2Task.sysprep({ clean: true }));

    // THEN
    expect(parse(userData).tasks).toEqual([{ task: 'sysprep', inputs: { clean: true, shutdown: false } }]);
  });

  test('can add tasks without inputs', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addTask(ec2.Ec2LaunchV2Task.enableJumboFrames());
    userData.addTask(ec2.Ec2LaunchV2Task.enableOpenSsh());
    userData.addTask(ec2.Ec2LaunchV2Task.optimizeEna());
    userData.addTask(ec2.Ec2LaunchV2Task.startSsm());
    userData.addTask(ec2.Ec2LaunchV2Task.startSsm());

    // THEN
    expect(userData.render()).toEqual([
      'version: 1.1',
      'tasks:',
      '  - task: enableJumboFrames',
      '  - task: enableOpenSsh',
      '  - task: optimizeEna',
      '  - task: startSsm',
      '',
    ].join('\n'));
  });

  test('can add custom tasks', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();

    // WHEN
    userData.addTask(ec2.Ec2LaunchV2Task.custom('futureTask', { setting: 'on', count: 1 }));
    userData.addTask(ec2.Ec2LaunchV2Task.custom('futureListTask', [{ a: 'yes' }]));
    userData.addTask(ec2.Ec2LaunchV2Task.custom('futureListTask', [{ a: 'no' }]));

    // THEN
    const rendered = userData.render();
    expect(rendered).toContain('setting: "on"');
    expect(YAML.parse(rendered, { version: '1.1' }).tasks).toEqual([
      { task: 'futureTask', inputs: { setting: 'on', count: 1 } },
      { task: 'futureListTask', inputs: [{ a: 'yes' }, { a: 'no' }] },
    ]);
  });

  test('fails to add a task with inputs twice', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();
    userData.addTask(ec2.Ec2LaunchV2Task.hostName());

    // THEN
    expect(() => userData.addTask(ec2.Ec2LaunchV2Task.hostName({ reboot: true })))
      .toThrow(/task "setHostName" has already been added/);
  });

  test.each([
    ['no inputs, then inputs', () => ec2.Ec2LaunchV2Task.startSsm(), () => ec2.Ec2LaunchV2Task.custom('startSsm', { x: 1 })],
    ['inputs, then no inputs', () => ec2.Ec2LaunchV2Task.custom('startSsm', { x: 1 }), () => ec2.Ec2LaunchV2Task.startSsm()],
    ['list inputs, then map inputs', () => ec2.Ec2LaunchV2Task.executeProgram({ path: 'a.exe' }), () => ec2.Ec2LaunchV2Task.custom('executeProgram', { path: 'b.exe' })],
  ])('fails to merge incompatible inputs for the same task: %s', (_, first, second) => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();
    userData.addTask(first());

    // THEN
    expect(() => userData.addTask(second())).toThrow(/has already been added/);
  });

  test('fails to add commands after a custom executeScript task without a list of inputs', () => {
    // GIVEN
    const userData = ec2.UserData.forWindowsEc2LaunchV2();
    userData.addTask(ec2.Ec2LaunchV2Task.custom('executeScript', { content: 'x' }));

    // THEN
    expect(() => userData.addCommands('command1')).toThrow(/task "executeScript" has already been added/);
  });
});
