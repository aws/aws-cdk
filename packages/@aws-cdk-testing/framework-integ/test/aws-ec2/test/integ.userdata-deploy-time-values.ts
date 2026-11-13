#!/usr/bin/env node
import * as path from 'path';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as assets from 'aws-cdk-lib/aws-s3-assets';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP, EC2_ENCODE_USER_DATA_COMMAND_VALUES } from 'aws-cdk-lib/cx-api';

/**
 * Checks that values only known at deploy time, such as CloudFormation
 * parameters, reach UserData.addS3DownloadCommand() and
 * UserData.addExecuteFileCommand() as plain text and are never run as commands.
 *
 * Each stack starts one instance, Linux or Windows. When it boots, the instance
 * downloads a check script from S3 to a path taken from a parameter, then runs
 * the script with arguments taken from other parameters. The parameter defaults
 * contain text that would run a command if it were pasted into the boot script
 * as code. The check script fails if that command ran, or if the arguments it
 * received are not exactly the parameter values. The instance reports to
 * CloudFormation whether its boot script succeeded, so a stack only deploys if
 * its check passes.
 */
const app = new cdk.App({
  postCliContext: {
    [EC2_ENCODE_USER_DATA_COMMAND_VALUES]: true,
  },
});
const fixtures = path.join(__dirname, 'userdata-deploy-time-values');

// Linux
const linuxStack = new cdk.Stack(app, 'integ-userdata-deploy-time-values-linux');
linuxStack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
const linuxVpc = new ec2.Vpc(linuxStack, 'Vpc', { maxAzs: 1, natGateways: 0 });

const linuxScript = new assets.Asset(linuxStack, 'Script', { path: path.join(fixtures, 'check-args.sh') });
// The path the check script is downloaded to. Without the fix, the boot script
// puts this path inside single quotes, and the `'` in `it's` would end those
// quotes early. The shell would then run `$(touch /tmp/cdk-injected)`, which
// creates the file /tmp/cdk-injected. check-args.sh fails if that file exists.
const linuxLocalFile = new cdk.CfnParameter(linuxStack, 'LocalFile', {
  type: 'String',
  default: "/tmp/cdk it's $(touch /tmp/cdk-injected); x/check-args.sh",
});
// An argument passed to the check script. Its text tries to break out of the
// boot script: `'` ends a quoted string, `;` starts a new command, and
// `touch /tmp/cdk-injected` creates a file. check-args.sh checks that it
// received this whole text as one argument, and that the file doesn't exist.
const linuxArgValue = new cdk.CfnParameter(linuxStack, 'ArgValue', {
  type: 'String',
  default: "/tmp/cdk data '; touch /tmp/cdk-injected; '",
});
// An argument that the code below writes inside double quotes. `a b` has a
// space, which would split it into two arguments if it were handled wrongly.
// check-args.sh checks that it received one argument, `a b`.
const linuxQuotedArgValue = new cdk.CfnParameter(linuxStack, 'QuotedArgValue', { type: 'String', default: 'a b' });

const linuxUserData = ec2.UserData.forLinux();
const linuxPath = linuxUserData.addS3DownloadCommand({
  bucket: linuxScript.bucket,
  bucketKey: linuxScript.s3ObjectKey,
  localFile: linuxLocalFile.valueAsString,
  // The stack's region is a deploy-time value (`AWS::Region`), so passing it
  // exercises the encoded region path on a real download.
  region: linuxStack.region,
});
// Each deploy-time value is one argument, on its own or inside the author's quotes, and none of it runs.
linuxUserData.addExecuteFileCommand({
  filePath: linuxPath,
  arguments: `--marker ${linuxArgValue.valueAsString} --flag -q "${linuxQuotedArgValue.valueAsString}"`,
});

const linuxInstance = new ec2.Instance(linuxStack, 'Instance', {
  vpc: linuxVpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  userData: linuxUserData,
  requireImdsv2: true,
  resourceSignalTimeout: cdk.Duration.minutes(10),
});
linuxUserData.addSignalOnExitCommand(linuxInstance);
linuxScript.grantRead(linuxInstance.role);

// Windows
const windowsStack = new cdk.Stack(app, 'integ-userdata-deploy-time-values-windows');
windowsStack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
const windowsVpc = new ec2.Vpc(windowsStack, 'Vpc', { maxAzs: 1, natGateways: 0 });

const windowsScript = new assets.Asset(windowsStack, 'Script', { path: path.join(fixtures, 'check-args.ps1') });
// The path the check script is downloaded to. Without the fix, the boot script
// puts this path inside single quotes, and the `'` in `it's` would end those
// quotes early. PowerShell would then run `$(New-Item -Name cdk-injected -Path ~)`,
// which creates the file cdk-injected in the home folder (~). check-args.ps1
// fails if that file exists. Windows doesn't allow a folder name that ends in a
// space, so the file is created in the home folder.
const windowsLocalFile = new cdk.CfnParameter(windowsStack, 'LocalFile', {
  type: 'String',
  default: "C:/cdk it's $(New-Item -Name cdk-injected -Path ~); x/check-args.ps1",
});
// An argument passed to the check script. Its text tries to break out of the
// boot script: `'` ends a quoted string, `;` starts a new command, and
// `New-Item -Name cdk-injected -Path ~` creates a file. check-args.ps1 checks
// that it received this whole text as one argument, and that the file doesn't
// exist.
const windowsArgValue = new cdk.CfnParameter(windowsStack, 'ArgValue', {
  type: 'String',
  default: "C:/cdk data '; New-Item -Name cdk-injected -Path ~; '",
});
// An argument that the code below writes inside double quotes. `a b` has a
// space, which would split it into two arguments if it were handled wrongly.
// check-args.ps1 checks that it received one argument, `a b`.
const windowsQuotedArgValue = new cdk.CfnParameter(windowsStack, 'QuotedArgValue', { type: 'String', default: 'a b' });

const windowsUserData = ec2.UserData.forWindows();
const windowsPath = windowsUserData.addS3DownloadCommand({
  bucket: windowsScript.bucket,
  bucketKey: windowsScript.s3ObjectKey,
  localFile: windowsLocalFile.valueAsString,
  // The stack's region is a deploy-time value (`AWS::Region`), so passing it
  // exercises the encoded region path on a real download.
  region: windowsStack.region,
});
// Each deploy-time value is one argument, on its own or inside the author's quotes, and none of it runs.
windowsUserData.addExecuteFileCommand({
  filePath: windowsPath,
  arguments: `-Marker ${windowsArgValue.valueAsString} -Flag -q "${windowsQuotedArgValue.valueAsString}"`,
});

const windowsInstance = new ec2.Instance(windowsStack, 'Instance', {
  vpc: windowsVpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  machineImage: new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2022_ENGLISH_FULL_BASE),
  userData: windowsUserData,
  requireImdsv2: true,
  resourceSignalTimeout: cdk.Duration.minutes(20),
});
windowsUserData.addSignalOnExitCommand(windowsInstance);
windowsScript.grantRead(windowsInstance.role);

new IntegTest(app, 'userdata-deploy-time-values-test', {
  testCases: [linuxStack, windowsStack],
});

app.synth();
