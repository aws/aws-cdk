import * as path from 'path';
import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import { Template } from '../../assertions';
import * as ssm from '../../aws-ssm';
import { App, CfnOutput, CfnResource, Stack } from '../../core';
import * as cxapi from '../../cx-api';
import * as lambda from '../lib';
import { calculateFunctionHash, trimFromStart, VERSION_LOCKED } from '../lib/function-hash';

const THE_RUNTIME = new lambda.Runtime('nodejs99.x', lambda.RuntimeFamily.NODEJS, {
  supportsInlineCode: true,
});

describe('function hash', () => {
  describe('trimFromStart', () => {

    test('trim not needed', () => {
      expect(trimFromStart('foo', 100)).toEqual('foo');
      expect(trimFromStart('foo', 3)).toEqual('foo');
      expect(trimFromStart('', 3)).toEqual('');
    });

    test('trim required', () => {
      expect(trimFromStart('hello', 3)).toEqual('llo');
      expect(trimFromStart('hello', 4)).toEqual('ello');
      expect(trimFromStart('hello', 1)).toEqual('o');
    });
  });

  describe('calcHash', () => {
    test('same configuration and code yields the same hash', () => {
      const app = new App({
        context: {
          [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
        },
      });
      const stack1 = new Stack(app, 'Stack1');
      const fn1 = new lambda.Function(stack1, 'MyFunction1', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });

      const stack2 = new Stack(app, 'Stack2');
      const fn2 = new lambda.Function(stack2, 'MyFunction1', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });

      expect(calculateFunctionHash(fn1)).toEqual(calculateFunctionHash(fn2));
      expect(calculateFunctionHash(fn1)).toEqual('8339678b5b0bc177dc54bb86c6541f80');
    });
  });

  test('code impacts hash', () => {
    const app = new App({
      context: {
        [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
      },
    });
    const stack1 = new Stack(app);
    const fn1 = new lambda.Function(stack1, 'MyFunction1', {
      runtime: THE_RUNTIME,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
    });

    expect(calculateFunctionHash(fn1)).not.toEqual('74ee309e3752199288e6d64d385b52c4');
    expect(calculateFunctionHash(fn1)).toEqual('9777bc13204c752e28426db2c01997ac');
  });

  test('environment variables impact hash', () => {
    const app = new App({
      context: {
        [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
      },
    });
    const stack1 = new Stack(app, 'Stack1');
    const fn1 = new lambda.Function(stack1, 'MyFunction', {
      runtime: THE_RUNTIME,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'bar',
      },
    });

    const stack2 = new Stack(app);
    const fn2 = new lambda.Function(stack2, 'MyFunction', {
      runtime: THE_RUNTIME,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'beer',
      },
    });

    expect(calculateFunctionHash(fn1)).toEqual('d5df63ad7377cf03dd0f49c60c6f0fc1');
    expect(calculateFunctionHash(fn2)).toEqual('6ca1f12d5210d52fe5e5d8933cd29634');
  });

  test('runtime impacts hash', () => {
    const app = new App({
      context: {
        [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
      },
    });
    const stack1 = new Stack(app, 'Stack1');
    const fn1 = new lambda.Function(stack1, 'MyFunction', {
      runtime: THE_RUNTIME,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'bar',
      },
    });

    const stack2 = new Stack(app);
    const fn2 = new lambda.Function(stack2, 'MyFunction', {
      runtime: THE_RUNTIME,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'beer',
      },
    });

    expect(calculateFunctionHash(fn1)).toEqual('d5df63ad7377cf03dd0f49c60c6f0fc1');
    expect(calculateFunctionHash(fn2)).toEqual('6ca1f12d5210d52fe5e5d8933cd29634');
  });

  test('inline code change impacts the hash', () => {
    const stack1 = new Stack();
    const fn1 = new lambda.Function(stack1, 'MyFunction', {
      runtime: THE_RUNTIME,
      code: lambda.Code.fromInline('foo'),
      handler: 'index.handler',
    });

    const stack2 = new Stack();
    const fn2 = new lambda.Function(stack2, 'MyFunction', {
      runtime: THE_RUNTIME,
      code: lambda.Code.fromInline('foo bar'),
      handler: 'index.handler',
    });

    expect(calculateFunctionHash(fn1)).toEqual('e6e08236949a28be9ade77a2323e8391');
    expect(calculateFunctionHash(fn2)).toEqual('48e10e13160453b41f24975434c2d3f3');
  });

  describe('lambda layers', () => {
    let stack1: Stack;
    let layer1: lambda.LayerVersion;
    let layer2: lambda.LayerVersion;
    beforeAll(() => {
      stack1 = new Stack();
      layer1 = new lambda.LayerVersion(stack1, 'MyLayer', {
        code: lambda.Code.fromAsset(path.join(__dirname, 'layer-code')),
        compatibleRuntimes: [THE_RUNTIME],
        license: 'Apache-2.0',
        description: 'A layer to test the L2 construct',
      });
      layer2 = new lambda.LayerVersion(stack1, 'MyLayer2', {
        code: lambda.Code.fromAsset(path.join(__dirname, 'layer-code')),
        compatibleRuntimes: [THE_RUNTIME],
        license: 'Apache-2.0',
        description: 'A layer to test the L2 construct',
      });
    });

    test('same configuration yields the same hash', () => {
      const stack2 = new Stack();
      const fn1 = new lambda.Function(stack2, 'MyFunction', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromInline('foo'),
        handler: 'index.handler',
        layers: [layer1],
      });

      const stack3 = new Stack();
      const fn2 = new lambda.Function(stack3, 'MyFunction', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromInline('foo'),
        handler: 'index.handler',
        layers: [layer1],
      });

      expect(calculateFunctionHash(fn1)).toEqual(calculateFunctionHash(fn2));
      expect(calculateFunctionHash(fn1)).toEqual('3b500cb399914c341ec5c39ef3bd182c');
    });

    test('different layers impacts hash', () => {
      const stack2 = new Stack();
      const fn1 = new lambda.Function(stack2, 'MyFunction', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromInline('foo'),
        handler: 'index.handler',
        layers: [layer1],
      });

      const stack3 = new Stack();
      const fn2 = new lambda.Function(stack3, 'MyFunction', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromInline('foo'),
        handler: 'index.handler',
        layers: [layer2],
      });

      expect(calculateFunctionHash(fn1)).toEqual('3b500cb399914c341ec5c39ef3bd182c');
      expect(calculateFunctionHash(fn2)).toEqual('aec62de1c572402fe8e75ca60c9fd96f');
    });

    describe('impact of lambda layer order on hash', () => {
      test('without feature flag, preserve old behavior to avoid unnecessary invalidation of templates', () => {
        const stack2 = new Stack();
        const fn1 = new lambda.Function(stack2, 'MyFunction', {
          runtime: THE_RUNTIME,
          code: lambda.Code.fromInline('foo'),
          handler: 'index.handler',
          layers: [layer1, layer2],
        });

        const stack3 = new Stack();
        const fn2 = new lambda.Function(stack3, 'MyFunction', {
          runtime: THE_RUNTIME,
          code: lambda.Code.fromInline('foo'),
          handler: 'index.handler',
          layers: [layer2, layer1],
        });

        expect(calculateFunctionHash(fn1)).toEqual('443ca997f1a9bb2ff4378f44cab76f67');
        expect(calculateFunctionHash(fn2)).toEqual('2330cb52a944876c13cd69f5947415cd');
      });

      test('with feature flag, we sort layers so order is consistent', () => {
        const app = new App({ context: { [cxapi.LAMBDA_RECOGNIZE_LAYER_VERSION]: true } });

        const stack2 = new Stack(app, 'stack2');
        const fn1 = new lambda.Function(stack2, 'MyFunction', {
          runtime: THE_RUNTIME,
          code: lambda.Code.fromInline('foo'),
          handler: 'index.handler',
          layers: [layer1, layer2],
        });

        const stack3 = new Stack(app, 'stack3');
        const fn2 = new lambda.Function(stack3, 'MyFunction', {
          runtime: THE_RUNTIME,
          code: lambda.Code.fromInline('foo'),
          handler: 'index.handler',
          layers: [layer2, layer1],
        });

        expect(calculateFunctionHash(fn1)).toEqual(calculateFunctionHash(fn2));
      });
    });

    test('with feature flag, imported lambda layers can be distinguished', () => {
      const app = new App({ context: { [cxapi.LAMBDA_RECOGNIZE_LAYER_VERSION]: true } });

      const stack2 = new Stack(app, 'stack2');
      const importedLayer1 = lambda.LayerVersion.fromLayerVersionArn(stack2, 'imported-layer', 'arn:aws:lambda:<region>:<account>:layer:<layer-name>:<version1>');
      const fn1 = new lambda.Function(stack2, 'MyFunction', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromInline('foo'),
        handler: 'index.handler',
        layers: [importedLayer1],
      });

      const stack3 = new Stack(app, 'stack3');
      const importedLayer2 = lambda.LayerVersion.fromLayerVersionArn(stack3, 'imported-layer', 'arn:aws:lambda:<region>:<account>:layer:<layer-name>:<version2>');
      const fn2 = new lambda.Function(stack3, 'MyFunction', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromInline('foo'),
        handler: 'index.handler',
        layers: [importedLayer2],
      });

      expect(calculateFunctionHash(fn1)).not.toEqual(calculateFunctionHash(fn2));
    });
  });

  describe('impact of env variables order on hash', () => {
    test('without "currentVersion", we preserve old behavior to avoid unnecessary invalidation of templates', () => {
      const stack1 = new Stack();
      const fn1 = new lambda.Function(stack1, 'MyFunction', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
        handler: 'index.handler',
        environment: {
          Foo: 'bar',
          Bar: 'foo',
        },
      });

      const stack2 = new Stack();
      const fn2 = new lambda.Function(stack2, 'MyFunction', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
        handler: 'index.handler',
        environment: {
          Bar: 'foo',
          Foo: 'bar',
        },
      });

      expect(calculateFunctionHash(fn1)).not.toEqual(calculateFunctionHash(fn2));
    });

    test('with "currentVersion", we sort env keys so order is consistent', () => {
      const stack1 = new Stack();
      const fn1 = new lambda.Function(stack1, 'MyFunction', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
        handler: 'index.handler',
        environment: {
          Foo: 'bar',
          Bar: 'foo',
        },
      });

      new CfnOutput(stack1, 'VersionArn', { value: fn1.currentVersion.functionArn });

      const stack2 = new Stack();
      const fn2 = new lambda.Function(stack2, 'MyFunction', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
        handler: 'index.handler',
        environment: {
          Bar: 'foo',
          Foo: 'bar',
        },
      });

      new CfnOutput(stack2, 'VersionArn', { value: fn2.currentVersion.functionArn });

      expect(calculateFunctionHash(fn1)).toEqual(calculateFunctionHash(fn2));
    });
  });

  describe('corrected function hash', () => {
    let app: App;
    beforeEach(() => {
      app = new App({
        context: {
          [cxapi.LAMBDA_RECOGNIZE_VERSION_PROPS]: true,
          [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
        },
      });
    });

    test('DependsOn does not impact function hash', () => {
      const stack1 = new Stack(app, 'Stack1');
      const fn1 = new lambda.Function(stack1, 'MyFunction1', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });

      const stack2 = new Stack(app, 'Stack2');
      const fn2 = new lambda.Function(stack2, 'MyFunction1', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });
      const res = new CfnResource(stack2, 'MyResource', {
        type: 'AWS::Foo::Bar',
        properties: {
          Name: 'Value',
        },
      });
      fn2.node.addDependency(res);

      expect(calculateFunctionHash(fn1)).toEqual('8339678b5b0bc177dc54bb86c6541f80');
      expect(calculateFunctionHash(fn1)).toEqual(calculateFunctionHash(fn2));
    });

    test('properties not locked to the version do not impact function hash', () => {
      const stack1 = new Stack(app, 'Stack1');
      const fn1 = new lambda.Function(stack1, 'MyFunction', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });

      const stack2 = new Stack(app, 'Stack2');
      const fn2 = new lambda.Function(stack2, 'MyFunction', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',

        reservedConcurrentExecutions: 5, // property not locked to the version
      });

      // expect(calculateFunctionHash(fn1)).toEqual('b0d8729d597bdde2d79312fbf619c974');
      expect(calculateFunctionHash(fn1)).toEqual(calculateFunctionHash(fn2));
    });

    test('unclassified property throws an error', () => {
      const stack = new Stack(app);
      const fn1 = new lambda.Function(stack, 'MyFunction1', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });
      (fn1.node.defaultChild as CfnResource).addPropertyOverride('UnclassifiedProp', 'Value');

      expect(() => calculateFunctionHash(fn1)).toThrow(/properties are not recognized/);
    });

    test('manual classification as version locked', () => {
      const stack = new Stack(app);
      const fn1 = new lambda.Function(stack, 'MyFunction1', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });

      const original = calculateFunctionHash(fn1);
      lambda.Function.classifyVersionProperty('UnclassifiedProp', true);
      (fn1.node.defaultChild as CfnResource).addPropertyOverride('UnclassifiedProp', 'Value');
      expect(calculateFunctionHash(fn1)).not.toEqual(original);
    });

    test('manual classification as not version locked', () => {
      const stack = new Stack(app);
      const fn1 = new lambda.Function(stack, 'MyFunction1', {
        runtime: THE_RUNTIME,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });

      const original = calculateFunctionHash(fn1);
      lambda.Function.classifyVersionProperty('UnclassifiedProp', false);
      (fn1.node.defaultChild as CfnResource).addPropertyOverride('UnclassifiedProp', 'Value');
      expect(calculateFunctionHash(fn1)).toEqual(original);
    });

    test('all CFN properties are classified', async () => {
      const db = await loadAwsServiceSpec();
      const spec = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Lambda::Function').only();
      const expected = Object.keys(spec.properties).sort();
      const actual = Object.keys(VERSION_LOCKED).sort();
      expect(expected).toEqual(actual);
    });
  });
});

test('imported layer hashes are consistent', () => {
  // GIVEN
  const app = new App({
    context: {
      '@aws-cdk/aws-lambda:recognizeLayerVersion': true,
    },
  });

  // WHEN
  const stack1 = new Stack(app, 'Stack1');
  const param1 = ssm.StringParameter.fromStringParameterName(stack1, 'Param', 'ParamName');
  const fn1 = new lambda.Function(stack1, 'Fn', {
    code: lambda.Code.fromInline('asdf'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_18_X,
    layers: [
      lambda.LayerVersion.fromLayerVersionArn(stack1, 'MyLayer',
        `arn:aws:lambda:${stack1.region}:<AccountID>:layer:IndexCFN:${param1.stringValue}`),
    ],
  });
  fn1.currentVersion; // Force creation of version

  const stack2 = new Stack(app, 'Stack2');
  const param2 = ssm.StringParameter.fromStringParameterName(stack2, 'Param', 'ParamName');
  const fn2 = new lambda.Function(stack2, 'Fn', {
    code: lambda.Code.fromInline('asdf'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_18_X,
    layers: [
      lambda.LayerVersion.fromLayerVersionArn(stack2, 'MyLayer',
        `arn:aws:lambda:${stack1.region}:<AccountID>:layer:IndexCFN:${param2.stringValue}`),
    ],
  });
  fn2.currentVersion; // Force creation of version

  // THEN
  const template1 = Template.fromStack(stack1);
  const template2 = Template.fromStack(stack2);

  expect(template1.toJSON()).toEqual(template2.toJSON());
});

test.each([false, true])('can invalidate version hash using invalidateVersionBasedOn: %p', (doIt) => {
  // GIVEN
  const app = new App();

  // WHEN
  const stack1 = new Stack(app, 'Stack1');
  const fn1 = new lambda.Function(stack1, 'Fn', {
    code: lambda.Code.fromInline('asdf'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_18_X,
  });
  if (doIt) {
    fn1.invalidateVersionBasedOn('abc');
  }
  fn1.currentVersion; // Force creation of version

  const stack2 = new Stack(app, 'Stack2');
  const fn2 = new lambda.Function(stack2, 'Fn', {
    code: lambda.Code.fromInline('asdf'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_18_X,
  });
  if (doIt) {
    fn1.invalidateVersionBasedOn('xyz');
  }
  fn2.currentVersion; // Force creation of version

  // THEN
  const template1 = Template.fromStack(stack1);
  const template2 = Template.fromStack(stack2);

  if (doIt) {
    expect(template1.toJSON()).not.toEqual(template2.toJSON());
  } else {
    expect(template1.toJSON()).toEqual(template2.toJSON());
  }

});
