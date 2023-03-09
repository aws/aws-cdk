import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as ssm from '@aws-cdk/aws-ssm';
import { resourceSpecification } from '@aws-cdk/cfnspec';
import { App, CfnOutput, CfnResource, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as lambda from '../lib';
import { calculateFunctionHash, trimFromStart, VERSION_LOCKED } from '../lib/function-hash';

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
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });

      const stack2 = new Stack(app, 'Stack2');
      const fn2 = new lambda.Function(stack2, 'MyFunction1', {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });

      expect(calculateFunctionHash(fn1)).toEqual(calculateFunctionHash(fn2));
      expect(calculateFunctionHash(fn1)).toEqual('74ee309e3752199288e6d64d385b52c4');
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
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
    });

    expect(calculateFunctionHash(fn1)).not.toEqual('74ee309e3752199288e6d64d385b52c4');
    expect(calculateFunctionHash(fn1)).toEqual('7d4cd781bf430bcc2495ccefff4c34dd');
  });

  test('environment variables impact hash', () => {
    const app = new App({
      context: {
        [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
      },
    });
    const stack1 = new Stack(app, 'Stack1');
    const fn1 = new lambda.Function(stack1, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'bar',
      },
    });

    const stack2 = new Stack(app);
    const fn2 = new lambda.Function(stack2, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'beer',
      },
    });

    expect(calculateFunctionHash(fn1)).toEqual('4f21733bb4695a0e2e45a9090cd46a49');
    expect(calculateFunctionHash(fn2)).toEqual('0517a96b1ee246651cb9568686babdf2');
  });

  test('runtime impacts hash', () => {
    const app = new App({
      context: {
        [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
      },
    });
    const stack1 = new Stack(app, 'Stack1');
    const fn1 = new lambda.Function(stack1, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'bar',
      },
    });

    const stack2 = new Stack(app);
    const fn2 = new lambda.Function(stack2, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      environment: {
        Foo: 'beer',
      },
    });

    expect(calculateFunctionHash(fn1)).toEqual('4f21733bb4695a0e2e45a9090cd46a49');
    expect(calculateFunctionHash(fn2)).toEqual('0517a96b1ee246651cb9568686babdf2');
  });

  test('inline code change impacts the hash', () => {
    const stack1 = new Stack();
    const fn1 = new lambda.Function(stack1, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromInline('foo'),
      handler: 'index.handler',
    });

    const stack2 = new Stack();
    const fn2 = new lambda.Function(stack2, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromInline('foo bar'),
      handler: 'index.handler',
    });

    expect(calculateFunctionHash(fn1)).toEqual('2e4e06d52af2bb609d8c23243d665966');
    expect(calculateFunctionHash(fn2)).toEqual('aca1fae7e25d53a19c5ee159dcb56b94');
  });

  describe('lambda layers', () => {
    let stack1: Stack;
    let layer1: lambda.LayerVersion;
    let layer2: lambda.LayerVersion;
    beforeAll(() => {
      stack1 = new Stack();
      layer1 = new lambda.LayerVersion(stack1, 'MyLayer', {
        code: lambda.Code.fromAsset(path.join(__dirname, 'layer-code')),
        compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
        license: 'Apache-2.0',
        description: 'A layer to test the L2 construct',
      });
      layer2 = new lambda.LayerVersion(stack1, 'MyLayer2', {
        code: lambda.Code.fromAsset(path.join(__dirname, 'layer-code')),
        compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
        license: 'Apache-2.0',
        description: 'A layer to test the L2 construct',
      });
    });

    test('same configuration yields the same hash', () => {
      const stack2 = new Stack();
      const fn1 = new lambda.Function(stack2, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromInline('foo'),
        handler: 'index.handler',
        layers: [layer1],
      });

      const stack3 = new Stack();
      const fn2 = new lambda.Function(stack3, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromInline('foo'),
        handler: 'index.handler',
        layers: [layer1],
      });

      expect(calculateFunctionHash(fn1)).toEqual(calculateFunctionHash(fn2));
      expect(calculateFunctionHash(fn1)).toEqual('81483a72d55290ca24ce30ba6ee4a412');
    });

    test('different layers impacts hash', () => {
      const stack2 = new Stack();
      const fn1 = new lambda.Function(stack2, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromInline('foo'),
        handler: 'index.handler',
        layers: [layer1],
      });

      const stack3 = new Stack();
      const fn2 = new lambda.Function(stack3, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromInline('foo'),
        handler: 'index.handler',
        layers: [layer2],
      });

      expect(calculateFunctionHash(fn1)).toEqual('81483a72d55290ca24ce30ba6ee4a412');
      expect(calculateFunctionHash(fn2)).toEqual('13baa4a05a4e78d538c4870e28576b3a');
    });

    describe('impact of lambda layer order on hash', () => {
      test('without feature flag, preserve old behavior to avoid unnecessary invalidation of templates', () => {
        const stack2 = new Stack();
        const fn1 = new lambda.Function(stack2, 'MyFunction', {
          runtime: lambda.Runtime.NODEJS_14_X,
          code: lambda.Code.fromInline('foo'),
          handler: 'index.handler',
          layers: [layer1, layer2],
        });

        const stack3 = new Stack();
        const fn2 = new lambda.Function(stack3, 'MyFunction', {
          runtime: lambda.Runtime.NODEJS_14_X,
          code: lambda.Code.fromInline('foo'),
          handler: 'index.handler',
          layers: [layer2, layer1],
        });

        expect(calculateFunctionHash(fn1)).toEqual('fcdd8253b1018b5fa0114670552c43ab');
        expect(calculateFunctionHash(fn2)).toEqual('6ee79d94895b045cfc9e7e37653c07e9');
      });

      test('with feature flag, we sort layers so order is consistent', () => {
        const app = new App({ context: { [cxapi.LAMBDA_RECOGNIZE_LAYER_VERSION]: true } });

        const stack2 = new Stack(app, 'stack2');
        const fn1 = new lambda.Function(stack2, 'MyFunction', {
          runtime: lambda.Runtime.NODEJS_14_X,
          code: lambda.Code.fromInline('foo'),
          handler: 'index.handler',
          layers: [layer1, layer2],
        });

        const stack3 = new Stack(app, 'stack3');
        const fn2 = new lambda.Function(stack3, 'MyFunction', {
          runtime: lambda.Runtime.NODEJS_14_X,
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
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromInline('foo'),
        handler: 'index.handler',
        layers: [importedLayer1],
      });

      const stack3 = new Stack(app, 'stack3');
      const importedLayer2 = lambda.LayerVersion.fromLayerVersionArn(stack3, 'imported-layer', 'arn:aws:lambda:<region>:<account>:layer:<layer-name>:<version2>');
      const fn2 = new lambda.Function(stack3, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_14_X,
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
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
        handler: 'index.handler',
        environment: {
          Foo: 'bar',
          Bar: 'foo',
        },
      });

      const stack2 = new Stack();
      const fn2 = new lambda.Function(stack2, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_14_X,
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
        runtime: lambda.Runtime.NODEJS_14_X,
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
        runtime: lambda.Runtime.NODEJS_14_X,
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
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });

      const stack2 = new Stack(app, 'Stack2');
      const fn2 = new lambda.Function(stack2, 'MyFunction1', {
        runtime: lambda.Runtime.NODEJS_14_X,
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

      expect(calculateFunctionHash(fn1)).toEqual('74ee309e3752199288e6d64d385b52c4');
      expect(calculateFunctionHash(fn1)).toEqual(calculateFunctionHash(fn2));
    });

    test('properties not locked to the version do not impact function hash', () => {
      const stack1 = new Stack(app, 'Stack1');
      const fn1 = new lambda.Function(stack1, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });

      const stack2 = new Stack(app, 'Stack2');
      const fn2 = new lambda.Function(stack2, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_14_X,
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
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });
      (fn1.node.defaultChild as CfnResource).addPropertyOverride('UnclassifiedProp', 'Value');

      expect(() => calculateFunctionHash(fn1)).toThrow(/properties are not recognized/);
    });

    test('manual classification as version locked', () => {
      const stack = new Stack(app);
      const fn1 = new lambda.Function(stack, 'MyFunction1', {
        runtime: lambda.Runtime.NODEJS_14_X,
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
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
        handler: 'index.handler',
      });

      const original = calculateFunctionHash(fn1);
      lambda.Function.classifyVersionProperty('UnclassifiedProp', false);
      (fn1.node.defaultChild as CfnResource).addPropertyOverride('UnclassifiedProp', 'Value');
      expect(calculateFunctionHash(fn1)).toEqual(original);
    });

    test('all CFN properties are classified', () => {
      const spec = resourceSpecification('AWS::Lambda::Function');
      expect(spec.Properties).toBeDefined();
      const expected = Object.keys(spec.Properties!).sort();
      const actual = Object.keys(VERSION_LOCKED).sort();
      expect(actual).toEqual(expected);
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