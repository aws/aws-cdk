#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';

/*
 * The instance only signals CloudFormation once EC2Launch v2 has parsed the
 * YAML user data, run the initializeVolume, writeFile and executeProgram tasks
 * and the batch and PowerShell scripts in order, and the PowerShell commands
 * have verified their results. Deployment fails if any of that does not happen.
 * The detached script only verifies that EC2Launch v2 accepts the detach
 * input, as nothing waits for it.
 *
 * The other tasks that do not shut down, reboot or reconfigure the network of
 * the instance are included to verify that EC2Launch v2 loads them.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-userdata-ec2launch-v2');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 1,
  natGateways: 0,
  subnetConfiguration: [{ name: 'Public', subnetType: ec2.SubnetType.PUBLIC }],
  restrictDefaultSecurityGroup: false,
});

// The token makes the program argument a list item with an indentation
// indicator (`- |2-`), so the test also verifies that EC2Launch v2 parses those
const createdDir = `C:\\cdk-integ-${cdk.Aws.STACK_NAME}`;
const userData = ec2.UserData.forWindowsEc2LaunchV2();
userData.addTask(ec2.Ec2LaunchV2Task.initializeVolume({ devices: [{ device: 'xvdf', letter: 'D', name: 'Data' }] }));
userData.addTask(ec2.Ec2LaunchV2Task.hostName({ hostName: 'cdk-integ' }));
userData.addTask(ec2.Ec2LaunchV2Task.wallpaper({
  attributes: [ec2.Ec2LaunchV2WallpaperAttribute.INSTANCE_ID],
  instanceTags: ec2.Ec2LaunchV2WallpaperTags.all(),
}));
userData.addTask(ec2.Ec2LaunchV2Task.startSsm());
userData.addTask(ec2.Ec2LaunchV2Task.writeFile({ destination: 'C:\\cdk-integ-write-file.txt', content: 'written by writeFile' }));
userData.addTask(ec2.Ec2LaunchV2Task.executeProgram({
  path: 'C:\\Windows\\System32\\cmd.exe',
  arguments: ['/c', 'mkdir', createdDir],
}));
userData.addTask(ec2.Ec2LaunchV2Task.executeBatch({ content: 'echo batch> C:\\cdk-integ-batch.txt' }));
userData.addTask(ec2.Ec2LaunchV2Task.executePowerShell({
  content: [
    'if (-not (Test-Path -Path \'C:\\cdk-integ-batch.txt\')) { throw \'batch script did not run first\' }',
    'Set-Content -Path \'C:\\cdk-integ-powershell.txt\' -Value powershell',
  ].join('\n'),
  runAs: ec2.Ec2LaunchV2RunAs.ADMIN,
  arguments: ['-NoProfile', '-ExecutionPolicy', 'Unrestricted'],
}));
userData.addTask(ec2.Ec2LaunchV2Task.executePowerShell({ content: 'Write-Output detached', detach: true }));
userData.addCommands(
  'if (-not (Test-Path -Path \'D:\\\')) { throw \'initializeVolume task did not run\' }',
  'if (-not (Test-Path -Path \'C:\\cdk-integ-powershell.txt\')) { throw \'PowerShell script did not run before the commands\' }',
  `if (-not (Test-Path -Path '${createdDir}' -PathType Container)) { throw 'executeProgram task did not run' }`,
  'if ((Get-Content -Path \'C:\\cdk-integ-write-file.txt\' -ErrorAction SilentlyContinue) -ne \'written by writeFile\') { throw \'writeFile task did not run\' }',
);

const instance = new ec2.Instance(stack, 'Instance', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
  machineImage: ec2.MachineImage.latestWindows(ec2.WindowsVersion.WINDOWS_SERVER_2022_ENGLISH_FULL_BASE),
  userData,
  blockDevices: [{ deviceName: 'xvdf', volume: ec2.BlockDeviceVolume.ebs(1) }],
  resourceSignalTimeout: cdk.Duration.minutes(30),
});
userData.addSignalOnExitCommand(instance);

new integ.IntegTest(app, 'UserDataEc2LaunchV2', {
  testCases: [stack],
});
