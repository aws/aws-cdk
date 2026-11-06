/**
 * Unit tests that depend on 'aws-cdk-lib' having been compiled using jsii
 */
import { Construct } from 'constructs';
import { App, Stack } from 'aws-cdk-lib';
import { constructInfoFromConstruct } from 'aws-cdk-lib/core/lib/helpers-internal';
import { localCdkVersion } from './util';

const JSII_RUNTIME_SYMBOL = Symbol.for('jsii.rtti');

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    analyticsReporting: true,
  });
});

describe('constructInfoFromConstruct', () => {
  test('returns fqn and version for core constructs', () => {
    const constructInfo = constructInfoFromConstruct(stack);
    expect(constructInfo).toBeDefined();
    expect(constructInfo?.fqn).toEqual('aws-cdk-lib.Stack');
    expect(constructInfo?.version).toEqual(localCdkVersion());
  });

  test('returns jsii runtime info if present', () => {
    const construct = new TestConstruct(stack, 'TestConstruct');

    const constructInfo = constructInfoFromConstruct(construct);
    expect(constructInfo?.fqn).toEqual('@aws-cdk/test.TestConstruct');
  });

  test('throws if the jsii runtime info is not as expected', () => {
    const constructRuntimeInfoNotObject = new class extends Construct {
      // @ts-ignore
      private static readonly [JSII_RUNTIME_SYMBOL] = 'HelloWorld';
    }(stack, 'RuntimeNotObject');
    const constructWithWrongRuntimeInfoMembers = new class extends Construct {
      // @ts-ignore
      private static readonly [JSII_RUNTIME_SYMBOL] = { foo: 'bar' };
    }(stack, 'RuntimeWrongMembers');
    const constructWithWrongRuntimeInfoTypes = new class extends Construct {
      // @ts-ignore
      private static readonly [JSII_RUNTIME_SYMBOL] = { fqn: 42, version: { name: '0.0.0' } };
    }(stack, 'RuntimeWrongTypes');

    const errorMessage = 'malformed jsii runtime info for construct';
    [constructRuntimeInfoNotObject, constructWithWrongRuntimeInfoMembers, constructWithWrongRuntimeInfoTypes].forEach(construct => {
      expect(() => constructInfoFromConstruct(construct)).toThrow(errorMessage);
    });
  });
});

class TestConstruct extends Construct {
  // @ts-ignore
  private static readonly [JSII_RUNTIME_SYMBOL] = { fqn: '@aws-cdk/test.TestConstruct', version: localCdkVersion() };
}
