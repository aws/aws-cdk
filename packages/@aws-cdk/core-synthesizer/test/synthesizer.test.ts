import { App, Stack, CfnResource } from '@aws-cdk/core';
import { UnboundStagingStackSynthesizer } from '../lib';

describe('bootstrap v3', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App({
      defaultStackSynthesizer: new UnboundStagingStackSynthesizer(),
    });
    stack = new Stack(app, 'Stack');
  });

  test('stack template is in asset manifest', () => {
    // GIVEN
    new CfnResource(stack, 'Resource', {
      type: 'Some::Resource',
    });

    // WHEN
    const asm = app.synth();

    // THEN -- the S3 url is advertised on the stack artifact
    const stackArtifact = asm.getStackArtifact('Stack');

    // TODO: finish test.
    // eslint-disable-next-line no-console
    console.log(stackArtifact.stackName);
  });
});
