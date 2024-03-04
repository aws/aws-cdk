import * as path from 'path';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { ContainerImage, FargatePlatformVersion } from 'aws-cdk-lib/aws-ecs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as efs from 'aws-cdk-lib/aws-efs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { App, Duration, Size, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as batch from 'aws-cdk-lib/aws-batch';

const app = new App();
const stack = new Stack(app, 'stack');
const vpc = new Vpc(stack, 'vpc', { restrictDefaultSecurityGroup: false });

new batch.EcsJobDefinition(stack, 'ECSJobDefn', {
  container: new batch.EcsEc2ContainerDefinition(stack, 'myContainer', {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    cpu: 256,
    memory: Size.mebibytes(2048),
    environment: {
      foo: 'bar',
    },
    gpu: 12,
    volumes: [
      batch.EcsVolume.host({
        name: 'volumeName',
        hostPath: '/foo/bar',
        containerPath: 'ahhh',
      }),
      batch.EcsVolume.efs({
        fileSystem: new efs.FileSystem(stack, 'myFileSystem', {
          vpc,
        }),
        name: 'efsVolume',
        containerPath: '/my/path',
      }),
    ],
    ulimits: [{
      hardLimit: 50,
      name: batch.UlimitName.CORE,
      softLimit: 10,
    }],
    secrets: {
      MY_SECRET_ENV_VAR: batch.Secret.fromSecretsManager(new secretsmanager.Secret(stack, 'mySecret')),
      ANOTHER_ONE: batch.Secret.fromSecretsManagerVersion(new secretsmanager.Secret(stack, 'anotherSecret'), {
        versionId: 'foo',
        versionStage: 'bar',
      }),
      SSM_TIME: batch.Secret.fromSsmParameter(new ssm.StringParameter(stack, 'ssm', { stringValue: 'myString' })),
    },
  }),
});

new batch.EcsJobDefinition(stack, 'ECSFargateJobDefn', {
  container: new batch.EcsFargateContainerDefinition(stack, 'myFargateContainer', {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    cpu: 16,
    memory: Size.mebibytes(32768),
    ephemeralStorageSize: Size.gibibytes(100),
    fargatePlatformVersion: FargatePlatformVersion.LATEST,
    fargateCpuArchitecture: ecs.CpuArchitecture.ARM64,
    fargateOperatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
  }),
  jobDefinitionName: 'foofoo',
  parameters: {
    foo: 'bar',
  },
  propagateTags: true,
  retryAttempts: 5,
  retryStrategies: [
    new batch.RetryStrategy(batch.Action.EXIT, batch.Reason.CANNOT_PULL_CONTAINER),
    new batch.RetryStrategy(batch.Action.RETRY, batch.Reason.NON_ZERO_EXIT_CODE),
    new batch.RetryStrategy(batch.Action.EXIT, batch.Reason.custom({
      onExitCode: '40*',
      onReason: 'reason',
      onStatusReason: 'statusreason',
    })),
  ],
  schedulingPriority: 10,
  timeout: Duration.minutes(10),
});

new batch.EcsJobDefinition(stack, 'ECSDockerJobDefn', {
  container: new batch.EcsEc2ContainerDefinition(stack, 'EcsDockerContainer', {
    cpu: 16,
    memory: Size.mebibytes(32768),
    image: ecs.ContainerImage.fromDockerImageAsset(new DockerImageAsset(stack, 'dockerImageAsset', {
      directory: path.join(__dirname, 'batchjob-image'),
    })),
  }),
});

// can successfully launch a Windows container
new batch.EcsJobDefinition(stack, 'WindowsJobDefinitio', {
  jobDefinitionName: 'windows-job-definition',
  container: new batch.EcsFargateContainerDefinition(stack, 'WindowsFargateContainer', {
    image: ecs.ContainerImage.fromRegistry('mcr.microsoft.com/dotnet/framework/runtime:4.7.2'),
    memory: Size.gibibytes(8),
    cpu: 2,
    fargateCpuArchitecture: ecs.CpuArchitecture.X86_64,
    fargateOperatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_FULL,
  }),
});

new integ.IntegTest(app, 'BatchEcsJobDefinitionTest', {
  testCases: [stack],
});

app.synth();
