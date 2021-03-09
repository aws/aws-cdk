import * as path from 'path';
import { App, NestedStack, Stack, Stage } from '../lib';
import { constructInfoFromConstruct, constructInfoFromStack } from '../lib/private/runtime-info';

// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '../lib';

const JSII_RUNTIME_SYMBOL = Symbol.for('jsii.rtti');

let app: App;
let stack: Stack;
let _cdkVersion: string | undefined = undefined;
const modulePrefix = cdkMajorVersion() === 1 ? '@aws-cdk/core' : 'aws-cdk-lib';

// The runtime metadata this test relies on is only available if the most
// recent compile has happened using 'jsii', as the jsii compiler injects
// this metadata.
//
// If the most recent compile was using 'tsc', the metadata will not have
// been injected, and the test suite will fail.
//
// Tolerate `tsc` builds locally, but not on CodeBuild.
const codeBuild = !!process.env.CODEBUILD_BUILD_ID;
const moduleCompiledWithTsc = constructInfoFromConstruct(new Stack())?.fqn === 'constructs.Construct';
let describeTscSafe = describe;
if (moduleCompiledWithTsc && !codeBuild) {
  // eslint-disable-next-line
  console.error('It appears this module was compiled with `tsc` instead of `jsii` in a local build. Skipping this test suite.');
  describeTscSafe = describe.skip;
}

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    analyticsReporting: true,
  });
});

describeTscSafe('constructInfoFromConstruct', () => {
  test('returns fqn and version for core constructs', () => {
    const constructInfo = constructInfoFromConstruct(stack);
    expect(constructInfo).toBeDefined();
    expect(constructInfo?.fqn).toEqual(`${modulePrefix}.Stack`);
    expect(constructInfo?.version).toEqual(localCdkVersion());
  });

  test('returns base construct info if no more specific info is present', () => {
    const simpleConstruct = new class extends Construct { }(stack, 'Simple');
    const constructInfo = constructInfoFromConstruct(simpleConstruct);
    expect(constructInfo?.fqn).toEqual(`${modulePrefix}.Construct`);
  });

  test('returns more specific subclass info if present', () => {
    const construct = new class extends Construct {
      // @ts-ignore
      private static readonly [JSII_RUNTIME_SYMBOL] = { fqn: 'aws-cdk-lib.TestConstruct', version: localCdkVersion() }
    }(stack, 'TestConstruct');

    const constructInfo = constructInfoFromConstruct(construct);
    expect(constructInfo?.fqn).toEqual('aws-cdk-lib.TestConstruct');
  });
});

describeTscSafe('constructInfoForStack', () => {
  test('returns stack itself and jsii runtime if stack is empty', () => {
    const constructInfos = constructInfoFromStack(stack);

    expect(constructInfos.length).toEqual(2);

    const stackInfo = constructInfos.find(i => /Stack/.test(i.fqn));
    const jsiiInfo = constructInfos.find(i => i.fqn === 'jsii-runtime.Runtime');
    expect(stackInfo?.fqn).toEqual(`${modulePrefix}.Stack`);
    expect(stackInfo?.version).toEqual(localCdkVersion());
    expect(jsiiInfo?.version).toMatch(/node.js/);
  });

  test('returns info for constructs added to the stack', () => {
    new class extends Construct { }(stack, 'Simple');

    const constructInfos = constructInfoFromStack(stack);

    expect(constructInfos.length).toEqual(3);
    expect(constructInfos.map(info => info.fqn)).toContain(`${modulePrefix}.Construct`);
  });

  test('returns unique info (no duplicates)', () => {
    new class extends Construct { }(stack, 'Simple1');
    new class extends Construct { }(stack, 'Simple2');

    const constructInfos = constructInfoFromStack(stack);

    expect(constructInfos.length).toEqual(3);
    expect(constructInfos.map(info => info.fqn)).toContain(`${modulePrefix}.Construct`);
  });

  test('returns info from nested constructs', () => {
    new class extends Construct {
      constructor(scope: Construct, id: string) {
        super(scope, id);
        return new class extends Construct {
          // @ts-ignore
          private static readonly [JSII_RUNTIME_SYMBOL] = { fqn: '@aws-cdk/test.TestV1Construct', version: localCdkVersion() }
        }(this, 'TestConstruct');
      }
    }(stack, 'Nested');

    const constructInfos = constructInfoFromStack(stack);

    expect(constructInfos.length).toEqual(4);
    expect(constructInfos.map(info => info.fqn)).toContain('@aws-cdk/test.TestV1Construct');
  });

  test('does not return info from nested stacks', () => {
    new class extends Construct {
      constructor(scope: Construct, id: string) {
        super(scope, id);

        new class extends Construct {
          // @ts-ignore
          private static readonly [JSII_RUNTIME_SYMBOL] = { fqn: '@aws-cdk/test.TestV1Construct', version: localCdkVersion() }
        }(this, 'TestConstruct');

        new class extends Stack {
          // @ts-ignore
          private static readonly [JSII_RUNTIME_SYMBOL] = { fqn: '@aws-cdk/test.TestStackInsideStack', version: localCdkVersion() }
        }(this, 'StackInsideStack');

        new class extends NestedStack {
          // @ts-ignore
          private static readonly [JSII_RUNTIME_SYMBOL] = { fqn: '@aws-cdk/test.TestNestedStackInsideStack', version: localCdkVersion() }
        }(this, 'NestedStackInsideStack');

        new class extends Stage {
          // @ts-ignore
          private static readonly [JSII_RUNTIME_SYMBOL] = { fqn: '@aws-cdk/test.TestStageInsideStack', version: localCdkVersion() }
        }(this, 'StageInsideStack');
      }
    }(stack, 'ParentConstruct');

    const constructInfos = constructInfoFromStack(stack);

    const fqns = constructInfos.map(info => info.fqn);
    expect(fqns).toContain('@aws-cdk/test.TestV1Construct');
    expect(fqns).not.toContain('@aws-cdk/test.TestStackInsideStack');
    expect(fqns).not.toContain('@aws-cdk/test.TestNestedStackInsideStack');
    expect(fqns).not.toContain('@aws-cdk/test.TestStageInsideStack');
  });
});

function cdkMajorVersion(): number {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../../../../release.json').majorVersion;
}

/**
 * The exact values we expect from testing against version numbers in this suite depend on whether we're running
 * locally or on CodeBuild. If local, the version reported for all constructs will be 0.0.0; for CodeBuild, this
 * will instead be the real CDK version number.
 * Returns an accurate version number if running on CodeBuild; otherwise returns 0.0.0 for local development
 */
function localCdkVersion(): string {
  if (!_cdkVersion) {
    if (codeBuild) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      _cdkVersion = require(path.join('..', '..', '..', '..', 'scripts', 'resolve-version.js')).version;
      if (!_cdkVersion) {
        throw new Error('Unable to determine CDK version');
      }
    } else {
      _cdkVersion = '0.0.0';
    }
  }
  return _cdkVersion;
}
