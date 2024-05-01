import { ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { App, Stack, Size } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as batch from 'aws-cdk-lib/aws-batch';

const app = new App();
const stack = new Stack(app, 'stack');

new batch.EksJobDefinition(stack, 'EksJobDefn', {
  container: new batch.EksContainerDefinition(stack, 'EksContainer', {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    args: ['foo'],
    command: ['echo foo'],
    env: { foo: 'bar' },
    cpuLimit: 8,
    cpuReservation: 4,
    memoryLimit: Size.mebibytes(8192),
    memoryReservation: Size.mebibytes(8192),
    gpuLimit: 12,
    gpuReservation: 12,
    imagePullPolicy: batch.ImagePullPolicy.ALWAYS,
    name: 'myBigCoolVolume',
    privileged: true,
    readonlyRootFilesystem: false,
    runAsGroup: 1,
    runAsRoot: false,
    runAsUser: 20,
    volumes: [
      batch.EksVolume.emptyDir({
        name: 'woah',
        mountPath: '/mount/path',
        medium: batch.EmptyDirMediumType.MEMORY,
        readonly: true,
        sizeLimit: Size.mebibytes(2048),
      }),
      batch.EksVolume.secret({
        name: 'secretVolumeName',
        secretName: 'secretName',
        mountPath: '/secret/path',
        optional: false,
      }),
      batch.EksVolume.secret({
        name: 'defaultOptionalSettingSecretVolume',
        secretName: 'NewSecretName',
        mountPath: '/secret/path2',
      }),
      batch.EksVolume.hostPath({
        name: 'hostPath',
        hostPath: '/foo/bar',
        mountPath: '/fooasdfadfs',
      }),
    ],
  }),
});

new integ.IntegTest(app, 'BatchEcsJobDefinitionTest', {
  testCases: [stack],
});

app.synth();
