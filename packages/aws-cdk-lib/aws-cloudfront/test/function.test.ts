import * as path from 'path';
import { Template, Match } from '../../assertions';
import { App, Stack } from '../../core';
import { Function, FunctionCode, FunctionRuntime, KeyValueStore } from '../lib';

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

  describe('key value store association', () => {
    test('minimal example', () => {
      const stack = new Stack();
      const keyValueStore = new KeyValueStore(stack, 'TestStore');

      new Function(stack, 'TestFn', {
        code: FunctionCode.fromInline('code'),
        keyValueStore,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Function', {
        FunctionConfig: {
          Runtime: 'cloudfront-js-2.0',
          KeyValueStoreAssociations: [{
            KeyValueStoreARN: stack.resolve(keyValueStore.keyValueStoreArn),
          }],
        },
      });
    });

    test('rejects key value store with v1.0 runtime', () => {
      const stack = new Stack();
      const keyValueStore = new KeyValueStore(stack, 'TestStore');

      expect(() => new Function(stack, 'TestFn', {
        code: FunctionCode.fromInline('code'),
        runtime: FunctionRuntime.JS_1_0,
        keyValueStore,
      })).toThrow(/Key Value Stores cannot be associated to functions using the .* runtime/);
    });

    test('defaults to js-2.0 runtime with key value store', () => {
      const stack = new Stack();
      const keyValueStore = new KeyValueStore(stack, 'TestStore');

      new Function(stack, 'TestFn', {
        code: FunctionCode.fromInline('code'),
        runtime: undefined,
        keyValueStore,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Function', {
        FunctionConfig: {
          Runtime: 'cloudfront-js-2.0',
        },
      });
    });

    test('works with js-2.0 runtime specified', () => {
      const stack = new Stack();
      const keyValueStore = new KeyValueStore(stack, 'TestStore');

      new Function(stack, 'TestFn', {
        code: FunctionCode.fromInline('code'),
        runtime: FunctionRuntime.JS_2_0,
        keyValueStore,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Function', {
        FunctionConfig: {
          Runtime: 'cloudfront-js-2.0',
          KeyValueStoreAssociations: [{
            KeyValueStoreARN: stack.resolve(keyValueStore.keyValueStoreArn),
          }],
        },
      });
    });

    test('no value is used in CloudFormation when unspecified in CDK', () => {
      const stack = new Stack();

      new Function(stack, 'TestFn', {
        code: FunctionCode.fromInline('code'),
        runtime: FunctionRuntime.JS_2_0,
        keyValueStore: undefined,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Function', {
        FunctionConfig: {
          KeyValueStoreAssociations: Match.absent(),
        },
      });
    });
  });
});
