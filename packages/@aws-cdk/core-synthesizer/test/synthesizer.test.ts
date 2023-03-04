import { App, Stack, CfnResource } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';

describe('new style synthesis', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App({
      context: {
        [cxapi.V3_STACK_SYNTHESIS_CONTEXT]: 'true',
      },
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
