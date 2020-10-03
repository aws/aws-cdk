import * as core from '@aws-cdk/core';
import * as codebuild from '../lib';

const app = new core.App();
const stack = new core.Stack(app, 'aws-deep-learning-container-build-image');

new codebuild.Project(stack, 'Project', {
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
      build: {
        commands: ['ls'],
      },
    },
  }),
  environment: {
    buildImage: codebuild.LinuxGpuBuildImage.DLC_MXNET_1_4_1,
  },
});

app.synth();
