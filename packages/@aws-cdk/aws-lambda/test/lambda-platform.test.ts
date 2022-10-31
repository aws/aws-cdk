import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { Architecture, DockerImageCode, DockerImageFunction } from '../lib';

describe('lambda platform', () => {
  test('can choose lambda architecture arm64', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');

    // WHEN
    new DockerImageFunction(stack, 'Lambda', {
      code: DockerImageCode.fromImageAsset(path.join(__dirname, 'docker-arm64-handler')),
      architecture: Architecture.ARM_64,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'arm64',
      ],
    });
  });

  test('can choose lambda architecture x86_64', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');

    // WHEN
    new DockerImageFunction(stack, 'Lambda', {
      code: DockerImageCode.fromImageAsset(path.join(__dirname, 'docker-arm64-handler')),
      architecture: Architecture.X86_64,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'x86_64',
      ],
    });
  });
});
