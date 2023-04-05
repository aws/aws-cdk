#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild-breakpoint');

new codebuild.Project(stack, 'Project', {
  environment: {
    buildImage: codebuild.LinuxBuildImage.STANDARD_6_0,
  },
  ssmSessionPermissions: true,
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
      build: {
        commands: [
          // Pause the build container if possible
          'codebuild-breakpoint',
          // Regular build in a script in the repository
          'echo "regular build here"',
        ],
      },
    },
  }),
});

new integ.IntegTest(app, 'ReportGroupIntegTest', {
  testCases: [stack],
});

app.synth();

