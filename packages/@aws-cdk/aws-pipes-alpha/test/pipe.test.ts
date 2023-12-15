import { App, Stack } from 'aws-cdk-lib';

import { Template } from 'aws-cdk-lib/assertions';
import { Pipe } from '../lib';

describe('Pipe', () => {
  let stack: Stack;

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('pipe is present', () => {
    // WHEN
    new Pipe(stack, 'TestPipe', {
      pipeName: 'TestPipe',
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::Pipes::Pipe', 0);
  });

});
