import { ContainerImage } from '@aws-cdk/aws-ecs';
import { App, Stack, Size } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as batch from '../lib';


const app = new App();
const stack = new Stack(app, 'stack');

new batch.EksJobDefinition(stack, 'EksJobDefn', {
  containerDefinition: new batch.EksContainerDefinition(stack, 'EksContainer', {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    args: ['foo'],
    command: ['echo foo'],
    env: { foo: 'bar' },
    cpuLimit: 8,
    cpuReservation: 4,
    memoryLimitMiB: 8192,
    memoryReservationMiB: 8192,
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
      /*batch.EksVolume.secret({
        name: 'foofoo',
        secretName: 'foo',
      }),
      */
      batch.EksVolume.hostPath({
        name: 'hostPath',
        path: '/foo/bar',
        mountPath: '/fooasdfadfs',
      }),
    ],
  }),
});


new integ.IntegTest(app, 'BatchEcsJobDefinitionTest', {
  testCases: [stack],
});

app.synth();