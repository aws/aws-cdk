import { BuildSpec, ComputeType, LinuxBuildImage } from '@aws-cdk/aws-codebuild';
import { Repository } from '@aws-cdk/aws-codecommit';
import { Stack } from '@aws-cdk/core';
import '@cloudcomponents/jest-cdk-snapshot';

import { PullRequestCheck } from '../lib';

test('default setup', () => {
  // GIVEN
  const stack = new Stack();

  const repository = new Repository(stack, 'Repository', {
    repositoryName: 'MyRepositoryName',
    description: 'Some description.'
  });

  // WHEN
  new PullRequestCheck(stack, 'PullRequestCheck', {
    repository,
    buildSpec: BuildSpec.fromSourceFilename('buildspecs/prcheck.yml')
  });

  // THEN
  expect(stack).toMatchCdkSnapshot();
});

test('custom setup', () => {
  // GIVEN
  const stack = new Stack();

  const repository = new Repository(stack, 'Repository', {
    repositoryName: 'MyRepositoryName',
    description: 'Some description.'
  });

  // WHEN
  new PullRequestCheck(stack, 'PullRequestCheck', {
    repository,
    buildSpec: BuildSpec.fromSourceFilename('buildspecs/prcheck.yml'),
    computeType: ComputeType.LARGE,
    buildImage: LinuxBuildImage.UBUNTU_14_04_PYTHON_3_7_1
  });

  // THEN
  expect(stack).toMatchCdkSnapshot();
});
