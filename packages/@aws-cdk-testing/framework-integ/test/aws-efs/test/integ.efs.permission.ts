import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { FileSystem } from 'aws-cdk-lib/aws-efs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'test-efs-permission-integ');

const vpc = new ec2.Vpc(stack, 'Vpc');

const fileSystem = new FileSystem(stack, 'FileSystem', {
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const createInstance = (id: string, initCommands: string[]) => {
  const instance = new ec2.Instance(stack, id, {
    vpc,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.NANO),
    machineImage: ec2.MachineImage.latestAmazonLinux2023({
      cpuType: ec2.AmazonLinuxCpuType.ARM_64,
    }),
    ssmSessionPermissions: true,
    init: ec2.CloudFormationInit.fromConfig(
      new ec2.InitConfig(initCommands.map((command) => ec2.InitCommand.shellCommand(command))),
    ),
    initOptions: {
      timeout: cdk.Duration.minutes(10),
    },
  });
  fileSystem.connections.allowDefaultPortFrom(instance);
  return instance;
};
const writeInstance = createInstance('WriteInstance', [
  'dnf install -y amazon-efs-utils',
  'mkdir /mnt/efs',
  // https://docs.aws.amazon.com/efs/latest/ug/troubleshooting-efs-mounting.html#mount-fails-propegation
  'sleep 5m',
  `mount -t efs -o tls,iam ${fileSystem.fileSystemId} /mnt/efs`,
  'echo \'Integ Test\' | tee /mnt/efs/integ-test.txt',
]);
writeInstance.instance.node.addDependency(fileSystem);
fileSystem.grantReadWrite(writeInstance);

const readInstance = createInstance('ReadInstance', [
  'dnf install -y amazon-efs-utils',
  'mkdir /mnt/efs',
  'sleep 5m',
  `mount -t efs -o tls,iam ${fileSystem.fileSystemId} /mnt/efs`,
]);
readInstance.instance.node.addDependency(fileSystem);
fileSystem.grantRead(readInstance);

const anonymousInstance = createInstance('AnonymousInstance', [
  'dnf install -y amazon-efs-utils',
  'mkdir /mnt/efs',
  'sleep 5m',
]);

const test = new integ.IntegTest(app, 'EfsPermissionTest', {
  testCases: [stack],
});

const anonymousMountCommand = test.assertions.awsApiCall('SSM', 'sendCommand', {
  InstanceIds: [anonymousInstance.instanceId],
  DocumentName: 'AWS-RunShellScript',
  Parameters: {
    commands: [`mount -t efs -o tls,iam ${fileSystem.fileSystemId} /mnt/efs`],
  },
});
test.assertions.awsApiCall('SSM', 'getCommandInvocation', {
  CommandId: anonymousMountCommand.getAttString('Command.CommandId'),
  InstanceId: anonymousInstance.instanceId,
}).expect(integ.ExpectedResult.objectLike({
  StandardErrorContent: "b'mount.nfs4: access denied by server while mounting 127.0.0.1:/'\nfailed to run commands: exit status 32",
  Status: 'Failed',
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(3),
});

const readFileCommand = test.assertions.awsApiCall('SSM', 'sendCommand', {
  InstanceIds: [readInstance.instanceId],
  DocumentName: 'AWS-RunShellScript',
  Parameters: {
    commands: ['cat /mnt/efs/integ-test.txt'],
  },
});
test.assertions.awsApiCall('SSM', 'getCommandInvocation', {
  CommandId: readFileCommand.getAttString('Command.CommandId'),
  InstanceId: readInstance.instanceId,
}).expect(integ.ExpectedResult.objectLike({
  StandardOutputContent: 'Integ Test\n',
  Status: 'Success',
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(3),
});
app.synth();
