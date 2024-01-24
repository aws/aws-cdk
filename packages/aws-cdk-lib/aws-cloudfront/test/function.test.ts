import * as path from 'path';
import { Template } from '../../assertions';
import { App, Stack } from '../../core';
import { CLOUDFRONT_FUNCTION_STABLE_GENERATED_NAME } from '../../cx-api';
import { Function, FunctionCode, FunctionRuntime } from '../lib';

describe('CloudFront Function', () => {

  test('minimal example', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'testregion' },
    });
    new Function(stack, 'CF2', {
      code: FunctionCode.fromInline('code'),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        CF2D7241DD7: {
          Type: 'AWS::CloudFront::Function',
          Properties: {
            Name: 'testregionStackCF2CE3F783F',
            AutoPublish: true,
            FunctionCode: 'code',
            FunctionConfig: {
              Comment: 'testregionStackCF2CE3F783F',
              Runtime: 'cloudfront-js-1.0',
            },
          },
        },
      },
    });
  });

  test('minimal example in environment agnostic stack', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new Function(stack, 'CF2', {
      code: FunctionCode.fromInline('code'),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        CF2D7241DD7: {
          Type: 'AWS::CloudFront::Function',
          Properties: {
            Name: {
              'Fn::Join': [
                '',
                [
                  {
                    Ref: 'AWS::Region',
                  },
                  'StackCF2CE3F783F',
                ],
              ],
            },
            AutoPublish: true,
            FunctionCode: 'code',
            FunctionConfig: {
              Comment: {
                'Fn::Join': [
                  '',
                  [
                    {
                      Ref: 'AWS::Region',
                    },
                    'StackCF2CE3F783F',
                  ],
                ],
              },
              Runtime: 'cloudfront-js-1.0',
            },
          },
        },
      },
    });
  });

  test('long stack and resource id in environment agnostic stack with feature flag set', () => {
    const app = new App();
    const stack = new Stack(app, 'test-stack-name-longer-than-thirtytwo-characters');
    stack.node.setContext(CLOUDFRONT_FUNCTION_STABLE_GENERATED_NAME, true);
    new Function(stack, 'test-resoruce-id-also-longer-but-with-different-end', {
      code: FunctionCode.fromInline('code'),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        testresoruceidalsolongerbutwithdifferentendFD0687C9: {
          Type: 'AWS::CloudFront::Function',
          Properties: {
            Name: 'test-stack-name-longer-than-onger-but-with-different-end3C400F7C',
            AutoPublish: true,
            FunctionCode: 'code',
            FunctionConfig: {
              Comment: 'test-stack-name-longer-than-onger-but-with-different-end3C400F7C',
              Runtime: 'cloudfront-js-1.0',
            },
          },
        },
      },
    });
  });

  test('long stack and resource id with region specified with feature flag set', () => {
    const app = new App();
    const stack = new Stack(app, 'test-stack-name-longer-than-thirtytwo-characters', { env: { region: 'test-region-1' } });
    stack.node.setContext(CLOUDFRONT_FUNCTION_STABLE_GENERATED_NAME, true);
    new Function(stack, 'test-resoruce-id-also-longer-but-with-different-end', {
      code: FunctionCode.fromInline('code'),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        testresoruceidalsolongerbutwithdifferentendFD0687C9: {
          Type: 'AWS::CloudFront::Function',
          Properties: {
            Name: 'test-stack-name-longer-than-onger-but-with-different-end3C400F7C',
            AutoPublish: true,
            FunctionCode: 'code',
            FunctionConfig: {
              Comment: 'test-stack-name-longer-than-onger-but-with-different-end3C400F7C',
              Runtime: 'cloudfront-js-1.0',
            },
          },
        },
      },
    });
  });

  test('maximum example', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'testregion' },
    });
    new Function(stack, 'CF2', {
      code: FunctionCode.fromInline('code'),
      comment: 'My super comment',
      functionName: 'FunctionName',
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        CF2D7241DD7: {
          Type: 'AWS::CloudFront::Function',
          Properties: {
            Name: 'FunctionName',
            AutoPublish: true,
            FunctionCode: 'code',
            FunctionConfig: {
              Comment: 'My super comment',
              Runtime: 'cloudfront-js-1.0',
            },
          },
        },
      },
    });
  });

  test('code from external file', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'testregion' },
    });
    new Function(stack, 'CF2', {
      code: FunctionCode.fromFile({ filePath: path.join(__dirname, 'function-code.js') }),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        CF2D7241DD7: {
          Type: 'AWS::CloudFront::Function',
          Properties: {
            Name: 'testregionStackCF2CE3F783F',
            AutoPublish: true,
            FunctionCode: 'function handler(event) {\n  return event.request;\n}',
            FunctionConfig: {
              Comment: 'testregionStackCF2CE3F783F',
              Runtime: 'cloudfront-js-1.0',
            },
          },
        },
      },
    });
  });

  test('runtime testing', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'testregion' },
    });
    new Function(stack, 'CF2', {
      code: FunctionCode.fromInline('code'),
      runtime: FunctionRuntime.JS_2_0,
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        CF2D7241DD7: {
          Type: 'AWS::CloudFront::Function',
          Properties: {
            Name: 'testregionStackCF2CE3F783F',
            AutoPublish: true,
            FunctionCode: 'code',
            FunctionConfig: {
              Comment: 'testregionStackCF2CE3F783F',
              Runtime: 'cloudfront-js-2.0',
            },
          },
        },
      },
    });
  });

  test('custom runtime testing', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'testregion' },
    });
    new Function(stack, 'CF2', {
      code: FunctionCode.fromInline('code'),
      runtime: FunctionRuntime.custom('cloudfront-js-2.0'),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        CF2D7241DD7: {
          Type: 'AWS::CloudFront::Function',
          Properties: {
            Name: 'testregionStackCF2CE3F783F',
            AutoPublish: true,
            FunctionCode: 'code',
            FunctionConfig: {
              Comment: 'testregionStackCF2CE3F783F',
              Runtime: 'cloudfront-js-2.0',
            },
          },
        },
      },
    });
  });
});
