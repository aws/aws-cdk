import * as path from 'path';
import { Template } from '../../assertions';
import { App, Stack } from '../../core';
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

  test('long stack and resource id in environment agnostic stack', () => {
    const app = new App();
    const stack = new Stack(app, 'test-stack-name-longer-than-thirtytwo-characters');
    new Function(stack, 'test-resoruce-id-also-longer-but-with-different-end', {
      code: FunctionCode.fromInline('code'),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        testresoruceidalsolongerbutwithdifferentendFD0687C9: {
          Type: 'AWS::CloudFront::Function',
          Properties: {
            Name: {
              'Fn::Join': [
                '',
                [
                  {
                    Ref: 'AWS::Region',
                  },
                  'teststacknamelongertherbutwithdifferentend3C400F7C',
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
                    'teststacknamelongertherbutwithdifferentend3C400F7C',
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

  test('long stack and resource id with region specified', () => {
    const app = new App();
    const stack = new Stack(app, 'test-stack-name-longer-than-thirtytwo-characters', { env: { region: 'test-east-1' } });
    new Function(stack, 'test-resoruce-id-also-longer-but-with-different-end', {
      code: FunctionCode.fromInline('code'),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        testresoruceidalsolongerbutwithdifferentendFD0687C9: {
          Type: 'AWS::CloudFront::Function',
          Properties: {
            Name: 'test-east-1teststacknamelongerthagerbutwithdifferentend3C400F7C',
            AutoPublish: true,
            FunctionCode: 'code',
            FunctionConfig: {
              Comment: 'test-east-1teststacknamelongerthagerbutwithdifferentend3C400F7C',
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
