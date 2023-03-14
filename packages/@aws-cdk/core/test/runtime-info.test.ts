import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { App, NestedStack, Stack, Stage } from '../lib';
import { constructInfoFromConstruct, constructInfoFromStack } from '../lib/private/runtime-info';

const JSII_RUNTIME_SYMBOL = Symbol.for('jsii.rtti');

let app: App;
let stack: Stack;
let _cdkVersion: string | undefined = undefined;

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
    expect(constructInfo?.fqn).toEqual('@aws-cdk/core.Stack');
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

describeTscSafe('constructInfoForStack', () => {
  test('returns stack itself and jsii runtime if stack is empty', () => {
    const constructInfos = constructInfoFromStack(stack);

    expect(constructInfos.length).toEqual(2);

    const stackInfo = constructInfos.find(i => /Stack/.test(i.fqn));
    const jsiiInfo = constructInfos.find(i => i.fqn === 'jsii-runtime.Runtime');
    expect(stackInfo?.fqn).toEqual('@aws-cdk/core.Stack');
    expect(stackInfo?.version).toEqual(localCdkVersion());
    expect(jsiiInfo?.version).toMatch(/node.js/);
  });

  test('sanitizes jsii runtime info to remove unwanted characters', () => {
    process.env.JSII_AGENT = 'DotNet/5.0.3/.NETCore^App,Version=v3.1!/1.0.0_0';
    const constructInfos = constructInfoFromStack(stack);
    const jsiiInfo = constructInfos.find(i => i.fqn === 'jsii-runtime.Runtime');

    expect(jsiiInfo?.version).toEqual('DotNet/5.0.3/.NETCore-App-Version=v3.1-/1.0.0_0');

    delete process.env.JSII_AGENT;
  });

  test('returns info for constructs added to the stack', () => {
    new TestConstruct(stack, 'TestConstruct');

    const constructInfos = constructInfoFromStack(stack);

    expect(constructInfos.length).toEqual(3);
    expect(constructInfos.map(info => info.fqn)).toContain('@aws-cdk/test.TestConstruct');
  });

  test('returns unique info (no duplicates)', () => {
    new TestConstruct(stack, 'TestConstruct1');
    new TestConstruct(stack, 'TestConstruct2');

    const constructInfos = constructInfoFromStack(stack);

    expect(constructInfos.length).toEqual(3);
    expect(constructInfos.map(info => info.fqn)).toContain('@aws-cdk/test.TestConstruct');
  });

  test('returns info from nested constructs', () => {
    new class extends Construct {
      constructor(scope: Construct, id: string) {
        super(scope, id);
        new TestConstruct(this, 'TestConstruct');
      }
    }(stack, 'Nested');

    const constructInfos = constructInfoFromStack(stack);

    expect(constructInfos.map(info => info.fqn)).toContain('@aws-cdk/test.TestConstruct');
  });

  test('does not return info from nested stacks', () => {
    new class extends Construct {
      constructor(scope: Construct, id: string) {
        super(scope, id);

        new TestConstruct(this, 'TestConstruct');

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
    expect(fqns).toContain('@aws-cdk/test.TestConstruct');
    expect(fqns).not.toContain('@aws-cdk/test.TestStackInsideStack');
    expect(fqns).not.toContain('@aws-cdk/test.TestNestedStackInsideStack');
    expect(fqns).not.toContain('@aws-cdk/test.TestStageInsideStack');
  });
});

class TestConstruct extends Construct {
  // @ts-ignore
  private static readonly [JSII_RUNTIME_SYMBOL] = { fqn: '@aws-cdk/test.TestConstruct', version: localCdkVersion() }
}

/**
 * The exact values we expect from testing against version numbers in this suite depend on whether we're running
 * on a development or release branch. Returns the local package.json version, which will be '0.0.0' unless we're
 * on a release branch, in which case it should be the real version numbers (e.g., 1.91.0).
 */
function localCdkVersion(): string {
  if (!_cdkVersion) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pkgJson = findParentPkgJson(__dirname);
    _cdkVersion = pkgJson.version;
    if (!_cdkVersion) {
      throw new Error('Unable to determine CDK version');
    }
  }
  return _cdkVersion;
}

function findParentPkgJson(dir: string, depth: number = 1, limit: number = 5): { version: string; } {
  const target = path.join(dir, 'package.json');
  if (fs.existsSync(target)) {
    return JSON.parse(fs.readFileSync(target, 'utf8'));
  } else if (depth < limit) {
    return findParentPkgJson(path.join(dir, '..'), depth + 1, limit);
  }

  throw new Error(`No \`package.json\` file found within ${depth} parent directories`);
}
