"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const constructs_1 = require("constructs");
const lib_1 = require("../lib");
const runtime_info_1 = require("../lib/private/runtime-info");
const JSII_RUNTIME_SYMBOL = Symbol.for('jsii.rtti');
let app;
let stack;
let _cdkVersion = undefined;
// The runtime metadata this test relies on is only available if the most
// recent compile has happened using 'jsii', as the jsii compiler injects
// this metadata.
//
// If the most recent compile was using 'tsc', the metadata will not have
// been injected, and the test suite will fail.
//
// Tolerate `tsc` builds locally, but not on CodeBuild.
const codeBuild = !!process.env.CODEBUILD_BUILD_ID;
const moduleCompiledWithTsc = (0, runtime_info_1.constructInfoFromConstruct)(new lib_1.Stack())?.fqn === 'constructs.Construct';
let describeTscSafe = describe;
if (moduleCompiledWithTsc && !codeBuild) {
    // eslint-disable-next-line
    console.error('It appears this module was compiled with `tsc` instead of `jsii` in a local build. Skipping this test suite.');
    describeTscSafe = describe.skip;
}
beforeEach(() => {
    app = new lib_1.App();
    stack = new lib_1.Stack(app, 'Stack', {
        analyticsReporting: true,
    });
});
describeTscSafe('constructInfoFromConstruct', () => {
    test('returns fqn and version for core constructs', () => {
        const constructInfo = (0, runtime_info_1.constructInfoFromConstruct)(stack);
        expect(constructInfo).toBeDefined();
        expect(constructInfo?.fqn).toEqual('@aws-cdk/core.Stack');
        expect(constructInfo?.version).toEqual(localCdkVersion());
    });
    test('returns jsii runtime info if present', () => {
        const construct = new TestConstruct(stack, 'TestConstruct');
        const constructInfo = (0, runtime_info_1.constructInfoFromConstruct)(construct);
        expect(constructInfo?.fqn).toEqual('@aws-cdk/test.TestConstruct');
    });
    test('throws if the jsii runtime info is not as expected', () => {
        var _b, _c, _d, _e, _f, _g;
        const constructRuntimeInfoNotObject = new (_c = class extends constructs_1.Construct {
            },
            _b = JSII_RUNTIME_SYMBOL,
            // @ts-ignore
            _c[_b] = 'HelloWorld',
            _c)(stack, 'RuntimeNotObject');
        const constructWithWrongRuntimeInfoMembers = new (_e = class extends constructs_1.Construct {
            },
            _d = JSII_RUNTIME_SYMBOL,
            // @ts-ignore
            _e[_d] = { foo: 'bar' },
            _e)(stack, 'RuntimeWrongMembers');
        const constructWithWrongRuntimeInfoTypes = new (_g = class extends constructs_1.Construct {
            },
            _f = JSII_RUNTIME_SYMBOL,
            // @ts-ignore
            _g[_f] = { fqn: 42, version: { name: '0.0.0' } },
            _g)(stack, 'RuntimeWrongTypes');
        const errorMessage = 'malformed jsii runtime info for construct';
        [constructRuntimeInfoNotObject, constructWithWrongRuntimeInfoMembers, constructWithWrongRuntimeInfoTypes].forEach(construct => {
            expect(() => (0, runtime_info_1.constructInfoFromConstruct)(construct)).toThrow(errorMessage);
        });
    });
});
describeTscSafe('constructInfoForStack', () => {
    test('returns stack itself and jsii runtime if stack is empty', () => {
        const constructInfos = (0, runtime_info_1.constructInfoFromStack)(stack);
        expect(constructInfos.length).toEqual(2);
        const stackInfo = constructInfos.find(i => /Stack/.test(i.fqn));
        const jsiiInfo = constructInfos.find(i => i.fqn === 'jsii-runtime.Runtime');
        expect(stackInfo?.fqn).toEqual('@aws-cdk/core.Stack');
        expect(stackInfo?.version).toEqual(localCdkVersion());
        expect(jsiiInfo?.version).toMatch(/node.js/);
    });
    test('sanitizes jsii runtime info to remove unwanted characters', () => {
        process.env.JSII_AGENT = 'DotNet/5.0.3/.NETCore^App,Version=v3.1!/1.0.0_0';
        const constructInfos = (0, runtime_info_1.constructInfoFromStack)(stack);
        const jsiiInfo = constructInfos.find(i => i.fqn === 'jsii-runtime.Runtime');
        expect(jsiiInfo?.version).toEqual('DotNet/5.0.3/.NETCore-App-Version=v3.1-/1.0.0_0');
        delete process.env.JSII_AGENT;
    });
    test('returns info for constructs added to the stack', () => {
        new TestConstruct(stack, 'TestConstruct');
        const constructInfos = (0, runtime_info_1.constructInfoFromStack)(stack);
        expect(constructInfos.length).toEqual(3);
        expect(constructInfos.map(info => info.fqn)).toContain('@aws-cdk/test.TestConstruct');
    });
    test('returns unique info (no duplicates)', () => {
        new TestConstruct(stack, 'TestConstruct1');
        new TestConstruct(stack, 'TestConstruct2');
        const constructInfos = (0, runtime_info_1.constructInfoFromStack)(stack);
        expect(constructInfos.length).toEqual(3);
        expect(constructInfos.map(info => info.fqn)).toContain('@aws-cdk/test.TestConstruct');
    });
    test('returns info from nested constructs', () => {
        new class extends constructs_1.Construct {
            constructor(scope, id) {
                super(scope, id);
                new TestConstruct(this, 'TestConstruct');
            }
        }(stack, 'Nested');
        const constructInfos = (0, runtime_info_1.constructInfoFromStack)(stack);
        expect(constructInfos.map(info => info.fqn)).toContain('@aws-cdk/test.TestConstruct');
    });
    test('does not return info from nested stacks', () => {
        new class extends constructs_1.Construct {
            constructor(scope, id) {
                var _b, _c, _d, _e, _f, _g;
                super(scope, id);
                new TestConstruct(this, 'TestConstruct');
                new (_c = class extends lib_1.Stack {
                    },
                    _b = JSII_RUNTIME_SYMBOL,
                    // @ts-ignore
                    _c[_b] = { fqn: '@aws-cdk/test.TestStackInsideStack', version: localCdkVersion() },
                    _c)(this, 'StackInsideStack');
                new (_e = class extends lib_1.NestedStack {
                    },
                    _d = JSII_RUNTIME_SYMBOL,
                    // @ts-ignore
                    _e[_d] = { fqn: '@aws-cdk/test.TestNestedStackInsideStack', version: localCdkVersion() },
                    _e)(this, 'NestedStackInsideStack');
                new (_g = class extends lib_1.Stage {
                    },
                    _f = JSII_RUNTIME_SYMBOL,
                    // @ts-ignore
                    _g[_f] = { fqn: '@aws-cdk/test.TestStageInsideStack', version: localCdkVersion() },
                    _g)(this, 'StageInsideStack');
            }
        }(stack, 'ParentConstruct');
        const constructInfos = (0, runtime_info_1.constructInfoFromStack)(stack);
        const fqns = constructInfos.map(info => info.fqn);
        expect(fqns).toContain('@aws-cdk/test.TestConstruct');
        expect(fqns).not.toContain('@aws-cdk/test.TestStackInsideStack');
        expect(fqns).not.toContain('@aws-cdk/test.TestNestedStackInsideStack');
        expect(fqns).not.toContain('@aws-cdk/test.TestStageInsideStack');
    });
});
class TestConstruct extends constructs_1.Construct {
}
_a = JSII_RUNTIME_SYMBOL;
// @ts-ignore
TestConstruct[_a] = { fqn: '@aws-cdk/test.TestConstruct', version: localCdkVersion() };
/**
 * The exact values we expect from testing against version numbers in this suite depend on whether we're running
 * on a development or release branch. Returns the local package.json version, which will be '0.0.0' unless we're
 * on a release branch, in which case it should be the real version numbers (e.g., 1.91.0).
 */
function localCdkVersion() {
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
function findParentPkgJson(dir, depth = 1, limit = 5) {
    const target = path.join(dir, 'package.json');
    if (fs.existsSync(target)) {
        return JSON.parse(fs.readFileSync(target, 'utf8'));
    }
    else if (depth < limit) {
        return findParentPkgJson(path.join(dir, '..'), depth + 1, limit);
    }
    throw new Error(`No \`package.json\` file found within ${depth} parent directories`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZS1pbmZvLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJydW50aW1lLWluZm8udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDJDQUF1QztBQUN2QyxnQ0FBd0Q7QUFDeEQsOERBQWlHO0FBRWpHLE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUVwRCxJQUFJLEdBQVEsQ0FBQztBQUNiLElBQUksS0FBWSxDQUFDO0FBQ2pCLElBQUksV0FBVyxHQUF1QixTQUFTLENBQUM7QUFFaEQseUVBQXlFO0FBQ3pFLHlFQUF5RTtBQUN6RSxpQkFBaUI7QUFDakIsRUFBRTtBQUNGLHlFQUF5RTtBQUN6RSwrQ0FBK0M7QUFDL0MsRUFBRTtBQUNGLHVEQUF1RDtBQUN2RCxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztBQUNuRCxNQUFNLHFCQUFxQixHQUFHLElBQUEseUNBQTBCLEVBQUMsSUFBSSxXQUFLLEVBQUUsQ0FBQyxFQUFFLEdBQUcsS0FBSyxzQkFBc0IsQ0FBQztBQUN0RyxJQUFJLGVBQWUsR0FBRyxRQUFRLENBQUM7QUFDL0IsSUFBSSxxQkFBcUIsSUFBSSxDQUFDLFNBQVMsRUFBRTtJQUN2QywyQkFBMkI7SUFDM0IsT0FBTyxDQUFDLEtBQUssQ0FBQyw4R0FBOEcsQ0FBQyxDQUFDO0lBQzlILGVBQWUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0NBQ2pDO0FBRUQsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLEdBQUcsR0FBRyxJQUFJLFNBQUcsRUFBRSxDQUFDO0lBQ2hCLEtBQUssR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFO1FBQzlCLGtCQUFrQixFQUFFLElBQUk7S0FDekIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxlQUFlLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO0lBQ2pELElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7UUFDdkQsTUFBTSxhQUFhLEdBQUcsSUFBQSx5Q0FBMEIsRUFBQyxLQUFLLENBQUMsQ0FBQztRQUN4RCxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDcEMsTUFBTSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUMxRCxNQUFNLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO0lBQzVELENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtRQUNoRCxNQUFNLFNBQVMsR0FBRyxJQUFJLGFBQWEsQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFNUQsTUFBTSxhQUFhLEdBQUcsSUFBQSx5Q0FBMEIsRUFBQyxTQUFTLENBQUMsQ0FBQztRQUM1RCxNQUFNLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQ3BFLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTs7UUFDOUQsTUFBTSw2QkFBNkIsR0FBRyxVQUFJLEtBQU0sU0FBUSxzQkFBUzthQUdoRTtpQkFEMEIsbUJBQW1CO1lBRDVDLGFBQWE7WUFDVyxNQUFxQixHQUFHLFlBQWE7Z0JBQzdELEtBQUssRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sb0NBQW9DLEdBQUcsVUFBSSxLQUFNLFNBQVEsc0JBQVM7YUFHdkU7aUJBRDBCLG1CQUFtQjtZQUQ1QyxhQUFhO1lBQ1csTUFBcUIsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUc7Z0JBQy9ELEtBQUssRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sa0NBQWtDLEdBQUcsVUFBSSxLQUFNLFNBQVEsc0JBQVM7YUFHckU7aUJBRDBCLG1CQUFtQjtZQUQ1QyxhQUFhO1lBQ1csTUFBcUIsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFHO2dCQUN4RixLQUFLLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUU5QixNQUFNLFlBQVksR0FBRywyQ0FBMkMsQ0FBQztRQUNqRSxDQUFDLDZCQUE2QixFQUFFLG9DQUFvQyxFQUFFLGtDQUFrQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzVILE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFBLHlDQUEwQixFQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILGVBQWUsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7SUFDNUMsSUFBSSxDQUFDLHlEQUF5RCxFQUFFLEdBQUcsRUFBRTtRQUNuRSxNQUFNLGNBQWMsR0FBRyxJQUFBLHFDQUFzQixFQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXJELE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpDLE1BQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLHNCQUFzQixDQUFDLENBQUM7UUFDNUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQy9DLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDJEQUEyRCxFQUFFLEdBQUcsRUFBRTtRQUNyRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxpREFBaUQsQ0FBQztRQUMzRSxNQUFNLGNBQWMsR0FBRyxJQUFBLHFDQUFzQixFQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JELE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLHNCQUFzQixDQUFDLENBQUM7UUFFNUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsaURBQWlELENBQUMsQ0FBQztRQUVyRixPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO0lBQ2hDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtRQUMxRCxJQUFJLGFBQWEsQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFMUMsTUFBTSxjQUFjLEdBQUcsSUFBQSxxQ0FBc0IsRUFBQyxLQUFLLENBQUMsQ0FBQztRQUVyRCxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQ3hGLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxJQUFJLGFBQWEsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUMzQyxJQUFJLGFBQWEsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUUzQyxNQUFNLGNBQWMsR0FBRyxJQUFBLHFDQUFzQixFQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXJELE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLENBQUM7SUFDeEYsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1FBQy9DLElBQUksS0FBTSxTQUFRLHNCQUFTO1lBQ3pCLFlBQVksS0FBZ0IsRUFBRSxFQUFVO2dCQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDM0MsQ0FBQztTQUNGLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRW5CLE1BQU0sY0FBYyxHQUFHLElBQUEscUNBQXNCLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFFckQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUN4RixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7UUFDbkQsSUFBSSxLQUFNLFNBQVEsc0JBQVM7WUFDekIsWUFBWSxLQUFnQixFQUFFLEVBQVU7O2dCQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUVqQixJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBRXpDLFVBQUksS0FBTSxTQUFRLFdBQUs7cUJBR3RCO3lCQUQwQixtQkFBbUI7b0JBRDVDLGFBQWE7b0JBQ1csTUFBcUIsR0FBRyxFQUFFLEdBQUcsRUFBRSxvQ0FBb0MsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLEVBQUU7d0JBQ3pILElBQUksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2dCQUU1QixVQUFJLEtBQU0sU0FBUSxpQkFBVztxQkFHNUI7eUJBRDBCLG1CQUFtQjtvQkFENUMsYUFBYTtvQkFDVyxNQUFxQixHQUFHLEVBQUUsR0FBRyxFQUFFLDBDQUEwQyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsRUFBRTt3QkFDL0gsSUFBSSxFQUFFLHdCQUF3QixDQUFDLENBQUM7Z0JBRWxDLFVBQUksS0FBTSxTQUFRLFdBQUs7cUJBR3RCO3lCQUQwQixtQkFBbUI7b0JBRDVDLGFBQWE7b0JBQ1csTUFBcUIsR0FBRyxFQUFFLEdBQUcsRUFBRSxvQ0FBb0MsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLEVBQUU7d0JBQ3pILElBQUksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1lBQzlCLENBQUM7U0FDRixDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBRTVCLE1BQU0sY0FBYyxHQUFHLElBQUEscUNBQXNCLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFFckQsTUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsb0NBQW9DLENBQUMsQ0FBQztRQUNqRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sYUFBYyxTQUFRLHNCQUFTOztLQUVWLG1CQUFtQjtBQUQ1QyxhQUFhO0FBQ1csaUJBQXFCLEdBQUcsRUFBRSxHQUFHLEVBQUUsNkJBQTZCLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxFQUFFLENBQUE7QUFHcEg7Ozs7R0FJRztBQUNILFNBQVMsZUFBZTtJQUN0QixJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ2hCLGlFQUFpRTtRQUNqRSxNQUFNLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM3QyxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUM5QixJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztTQUNwRDtLQUNGO0lBQ0QsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsR0FBVyxFQUFFLFFBQWdCLENBQUMsRUFBRSxRQUFnQixDQUFDO0lBQzFFLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQzlDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN6QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUNwRDtTQUFNLElBQUksS0FBSyxHQUFHLEtBQUssRUFBRTtRQUN4QixPQUFPLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDbEU7SUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxLQUFLLHFCQUFxQixDQUFDLENBQUM7QUFDdkYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFwcCwgTmVzdGVkU3RhY2ssIFN0YWNrLCBTdGFnZSB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBjb25zdHJ1Y3RJbmZvRnJvbUNvbnN0cnVjdCwgY29uc3RydWN0SW5mb0Zyb21TdGFjayB9IGZyb20gJy4uL2xpYi9wcml2YXRlL3J1bnRpbWUtaW5mbyc7XG5cbmNvbnN0IEpTSUlfUlVOVElNRV9TWU1CT0wgPSBTeW1ib2wuZm9yKCdqc2lpLnJ0dGknKTtcblxubGV0IGFwcDogQXBwO1xubGV0IHN0YWNrOiBTdGFjaztcbmxldCBfY2RrVmVyc2lvbjogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4vLyBUaGUgcnVudGltZSBtZXRhZGF0YSB0aGlzIHRlc3QgcmVsaWVzIG9uIGlzIG9ubHkgYXZhaWxhYmxlIGlmIHRoZSBtb3N0XG4vLyByZWNlbnQgY29tcGlsZSBoYXMgaGFwcGVuZWQgdXNpbmcgJ2pzaWknLCBhcyB0aGUganNpaSBjb21waWxlciBpbmplY3RzXG4vLyB0aGlzIG1ldGFkYXRhLlxuLy9cbi8vIElmIHRoZSBtb3N0IHJlY2VudCBjb21waWxlIHdhcyB1c2luZyAndHNjJywgdGhlIG1ldGFkYXRhIHdpbGwgbm90IGhhdmVcbi8vIGJlZW4gaW5qZWN0ZWQsIGFuZCB0aGUgdGVzdCBzdWl0ZSB3aWxsIGZhaWwuXG4vL1xuLy8gVG9sZXJhdGUgYHRzY2AgYnVpbGRzIGxvY2FsbHksIGJ1dCBub3Qgb24gQ29kZUJ1aWxkLlxuY29uc3QgY29kZUJ1aWxkID0gISFwcm9jZXNzLmVudi5DT0RFQlVJTERfQlVJTERfSUQ7XG5jb25zdCBtb2R1bGVDb21waWxlZFdpdGhUc2MgPSBjb25zdHJ1Y3RJbmZvRnJvbUNvbnN0cnVjdChuZXcgU3RhY2soKSk/LmZxbiA9PT0gJ2NvbnN0cnVjdHMuQ29uc3RydWN0JztcbmxldCBkZXNjcmliZVRzY1NhZmUgPSBkZXNjcmliZTtcbmlmIChtb2R1bGVDb21waWxlZFdpdGhUc2MgJiYgIWNvZGVCdWlsZCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgY29uc29sZS5lcnJvcignSXQgYXBwZWFycyB0aGlzIG1vZHVsZSB3YXMgY29tcGlsZWQgd2l0aCBgdHNjYCBpbnN0ZWFkIG9mIGBqc2lpYCBpbiBhIGxvY2FsIGJ1aWxkLiBTa2lwcGluZyB0aGlzIHRlc3Qgc3VpdGUuJyk7XG4gIGRlc2NyaWJlVHNjU2FmZSA9IGRlc2NyaWJlLnNraXA7XG59XG5cbmJlZm9yZUVhY2goKCkgPT4ge1xuICBhcHAgPSBuZXcgQXBwKCk7XG4gIHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJywge1xuICAgIGFuYWx5dGljc1JlcG9ydGluZzogdHJ1ZSxcbiAgfSk7XG59KTtcblxuZGVzY3JpYmVUc2NTYWZlKCdjb25zdHJ1Y3RJbmZvRnJvbUNvbnN0cnVjdCcsICgpID0+IHtcbiAgdGVzdCgncmV0dXJucyBmcW4gYW5kIHZlcnNpb24gZm9yIGNvcmUgY29uc3RydWN0cycsICgpID0+IHtcbiAgICBjb25zdCBjb25zdHJ1Y3RJbmZvID0gY29uc3RydWN0SW5mb0Zyb21Db25zdHJ1Y3Qoc3RhY2spO1xuICAgIGV4cGVjdChjb25zdHJ1Y3RJbmZvKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChjb25zdHJ1Y3RJbmZvPy5mcW4pLnRvRXF1YWwoJ0Bhd3MtY2RrL2NvcmUuU3RhY2snKTtcbiAgICBleHBlY3QoY29uc3RydWN0SW5mbz8udmVyc2lvbikudG9FcXVhbChsb2NhbENka1ZlcnNpb24oKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JldHVybnMganNpaSBydW50aW1lIGluZm8gaWYgcHJlc2VudCcsICgpID0+IHtcbiAgICBjb25zdCBjb25zdHJ1Y3QgPSBuZXcgVGVzdENvbnN0cnVjdChzdGFjaywgJ1Rlc3RDb25zdHJ1Y3QnKTtcblxuICAgIGNvbnN0IGNvbnN0cnVjdEluZm8gPSBjb25zdHJ1Y3RJbmZvRnJvbUNvbnN0cnVjdChjb25zdHJ1Y3QpO1xuICAgIGV4cGVjdChjb25zdHJ1Y3RJbmZvPy5mcW4pLnRvRXF1YWwoJ0Bhd3MtY2RrL3Rlc3QuVGVzdENvbnN0cnVjdCcpO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYgdGhlIGpzaWkgcnVudGltZSBpbmZvIGlzIG5vdCBhcyBleHBlY3RlZCcsICgpID0+IHtcbiAgICBjb25zdCBjb25zdHJ1Y3RSdW50aW1lSW5mb05vdE9iamVjdCA9IG5ldyBjbGFzcyBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBbSlNJSV9SVU5USU1FX1NZTUJPTF0gPSAnSGVsbG9Xb3JsZCc7XG4gICAgfShzdGFjaywgJ1J1bnRpbWVOb3RPYmplY3QnKTtcbiAgICBjb25zdCBjb25zdHJ1Y3RXaXRoV3JvbmdSdW50aW1lSW5mb01lbWJlcnMgPSBuZXcgY2xhc3MgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgW0pTSUlfUlVOVElNRV9TWU1CT0xdID0geyBmb286ICdiYXInIH07XG4gICAgfShzdGFjaywgJ1J1bnRpbWVXcm9uZ01lbWJlcnMnKTtcbiAgICBjb25zdCBjb25zdHJ1Y3RXaXRoV3JvbmdSdW50aW1lSW5mb1R5cGVzID0gbmV3IGNsYXNzIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFtKU0lJX1JVTlRJTUVfU1lNQk9MXSA9IHsgZnFuOiA0MiwgdmVyc2lvbjogeyBuYW1lOiAnMC4wLjAnIH0gfTtcbiAgICB9KHN0YWNrLCAnUnVudGltZVdyb25nVHlwZXMnKTtcblxuICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9ICdtYWxmb3JtZWQganNpaSBydW50aW1lIGluZm8gZm9yIGNvbnN0cnVjdCc7XG4gICAgW2NvbnN0cnVjdFJ1bnRpbWVJbmZvTm90T2JqZWN0LCBjb25zdHJ1Y3RXaXRoV3JvbmdSdW50aW1lSW5mb01lbWJlcnMsIGNvbnN0cnVjdFdpdGhXcm9uZ1J1bnRpbWVJbmZvVHlwZXNdLmZvckVhY2goY29uc3RydWN0ID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiBjb25zdHJ1Y3RJbmZvRnJvbUNvbnN0cnVjdChjb25zdHJ1Y3QpKS50b1Rocm93KGVycm9yTWVzc2FnZSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlVHNjU2FmZSgnY29uc3RydWN0SW5mb0ZvclN0YWNrJywgKCkgPT4ge1xuICB0ZXN0KCdyZXR1cm5zIHN0YWNrIGl0c2VsZiBhbmQganNpaSBydW50aW1lIGlmIHN0YWNrIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgIGNvbnN0IGNvbnN0cnVjdEluZm9zID0gY29uc3RydWN0SW5mb0Zyb21TdGFjayhzdGFjayk7XG5cbiAgICBleHBlY3QoY29uc3RydWN0SW5mb3MubGVuZ3RoKS50b0VxdWFsKDIpO1xuXG4gICAgY29uc3Qgc3RhY2tJbmZvID0gY29uc3RydWN0SW5mb3MuZmluZChpID0+IC9TdGFjay8udGVzdChpLmZxbikpO1xuICAgIGNvbnN0IGpzaWlJbmZvID0gY29uc3RydWN0SW5mb3MuZmluZChpID0+IGkuZnFuID09PSAnanNpaS1ydW50aW1lLlJ1bnRpbWUnKTtcbiAgICBleHBlY3Qoc3RhY2tJbmZvPy5mcW4pLnRvRXF1YWwoJ0Bhd3MtY2RrL2NvcmUuU3RhY2snKTtcbiAgICBleHBlY3Qoc3RhY2tJbmZvPy52ZXJzaW9uKS50b0VxdWFsKGxvY2FsQ2RrVmVyc2lvbigpKTtcbiAgICBleHBlY3QoanNpaUluZm8/LnZlcnNpb24pLnRvTWF0Y2goL25vZGUuanMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnc2FuaXRpemVzIGpzaWkgcnVudGltZSBpbmZvIHRvIHJlbW92ZSB1bndhbnRlZCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgIHByb2Nlc3MuZW52LkpTSUlfQUdFTlQgPSAnRG90TmV0LzUuMC4zLy5ORVRDb3JlXkFwcCxWZXJzaW9uPXYzLjEhLzEuMC4wXzAnO1xuICAgIGNvbnN0IGNvbnN0cnVjdEluZm9zID0gY29uc3RydWN0SW5mb0Zyb21TdGFjayhzdGFjayk7XG4gICAgY29uc3QganNpaUluZm8gPSBjb25zdHJ1Y3RJbmZvcy5maW5kKGkgPT4gaS5mcW4gPT09ICdqc2lpLXJ1bnRpbWUuUnVudGltZScpO1xuXG4gICAgZXhwZWN0KGpzaWlJbmZvPy52ZXJzaW9uKS50b0VxdWFsKCdEb3ROZXQvNS4wLjMvLk5FVENvcmUtQXBwLVZlcnNpb249djMuMS0vMS4wLjBfMCcpO1xuXG4gICAgZGVsZXRlIHByb2Nlc3MuZW52LkpTSUlfQUdFTlQ7XG4gIH0pO1xuXG4gIHRlc3QoJ3JldHVybnMgaW5mbyBmb3IgY29uc3RydWN0cyBhZGRlZCB0byB0aGUgc3RhY2snLCAoKSA9PiB7XG4gICAgbmV3IFRlc3RDb25zdHJ1Y3Qoc3RhY2ssICdUZXN0Q29uc3RydWN0Jyk7XG5cbiAgICBjb25zdCBjb25zdHJ1Y3RJbmZvcyA9IGNvbnN0cnVjdEluZm9Gcm9tU3RhY2soc3RhY2spO1xuXG4gICAgZXhwZWN0KGNvbnN0cnVjdEluZm9zLmxlbmd0aCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29uc3RydWN0SW5mb3MubWFwKGluZm8gPT4gaW5mby5mcW4pKS50b0NvbnRhaW4oJ0Bhd3MtY2RrL3Rlc3QuVGVzdENvbnN0cnVjdCcpO1xuICB9KTtcblxuICB0ZXN0KCdyZXR1cm5zIHVuaXF1ZSBpbmZvIChubyBkdXBsaWNhdGVzKScsICgpID0+IHtcbiAgICBuZXcgVGVzdENvbnN0cnVjdChzdGFjaywgJ1Rlc3RDb25zdHJ1Y3QxJyk7XG4gICAgbmV3IFRlc3RDb25zdHJ1Y3Qoc3RhY2ssICdUZXN0Q29uc3RydWN0MicpO1xuXG4gICAgY29uc3QgY29uc3RydWN0SW5mb3MgPSBjb25zdHJ1Y3RJbmZvRnJvbVN0YWNrKHN0YWNrKTtcblxuICAgIGV4cGVjdChjb25zdHJ1Y3RJbmZvcy5sZW5ndGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnN0cnVjdEluZm9zLm1hcChpbmZvID0+IGluZm8uZnFuKSkudG9Db250YWluKCdAYXdzLWNkay90ZXN0LlRlc3RDb25zdHJ1Y3QnKTtcbiAgfSk7XG5cbiAgdGVzdCgncmV0dXJucyBpbmZvIGZyb20gbmVzdGVkIGNvbnN0cnVjdHMnLCAoKSA9PiB7XG4gICAgbmV3IGNsYXNzIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICAgICAgbmV3IFRlc3RDb25zdHJ1Y3QodGhpcywgJ1Rlc3RDb25zdHJ1Y3QnKTtcbiAgICAgIH1cbiAgICB9KHN0YWNrLCAnTmVzdGVkJyk7XG5cbiAgICBjb25zdCBjb25zdHJ1Y3RJbmZvcyA9IGNvbnN0cnVjdEluZm9Gcm9tU3RhY2soc3RhY2spO1xuXG4gICAgZXhwZWN0KGNvbnN0cnVjdEluZm9zLm1hcChpbmZvID0+IGluZm8uZnFuKSkudG9Db250YWluKCdAYXdzLWNkay90ZXN0LlRlc3RDb25zdHJ1Y3QnKTtcbiAgfSk7XG5cbiAgdGVzdCgnZG9lcyBub3QgcmV0dXJuIGluZm8gZnJvbSBuZXN0ZWQgc3RhY2tzJywgKCkgPT4ge1xuICAgIG5ldyBjbGFzcyBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAgICAgbmV3IFRlc3RDb25zdHJ1Y3QodGhpcywgJ1Rlc3RDb25zdHJ1Y3QnKTtcblxuICAgICAgICBuZXcgY2xhc3MgZXh0ZW5kcyBTdGFjayB7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFtKU0lJX1JVTlRJTUVfU1lNQk9MXSA9IHsgZnFuOiAnQGF3cy1jZGsvdGVzdC5UZXN0U3RhY2tJbnNpZGVTdGFjaycsIHZlcnNpb246IGxvY2FsQ2RrVmVyc2lvbigpIH1cbiAgICAgICAgfSh0aGlzLCAnU3RhY2tJbnNpZGVTdGFjaycpO1xuXG4gICAgICAgIG5ldyBjbGFzcyBleHRlbmRzIE5lc3RlZFN0YWNrIHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgW0pTSUlfUlVOVElNRV9TWU1CT0xdID0geyBmcW46ICdAYXdzLWNkay90ZXN0LlRlc3ROZXN0ZWRTdGFja0luc2lkZVN0YWNrJywgdmVyc2lvbjogbG9jYWxDZGtWZXJzaW9uKCkgfVxuICAgICAgICB9KHRoaXMsICdOZXN0ZWRTdGFja0luc2lkZVN0YWNrJyk7XG5cbiAgICAgICAgbmV3IGNsYXNzIGV4dGVuZHMgU3RhZ2Uge1xuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBbSlNJSV9SVU5USU1FX1NZTUJPTF0gPSB7IGZxbjogJ0Bhd3MtY2RrL3Rlc3QuVGVzdFN0YWdlSW5zaWRlU3RhY2snLCB2ZXJzaW9uOiBsb2NhbENka1ZlcnNpb24oKSB9XG4gICAgICAgIH0odGhpcywgJ1N0YWdlSW5zaWRlU3RhY2snKTtcbiAgICAgIH1cbiAgICB9KHN0YWNrLCAnUGFyZW50Q29uc3RydWN0Jyk7XG5cbiAgICBjb25zdCBjb25zdHJ1Y3RJbmZvcyA9IGNvbnN0cnVjdEluZm9Gcm9tU3RhY2soc3RhY2spO1xuXG4gICAgY29uc3QgZnFucyA9IGNvbnN0cnVjdEluZm9zLm1hcChpbmZvID0+IGluZm8uZnFuKTtcbiAgICBleHBlY3QoZnFucykudG9Db250YWluKCdAYXdzLWNkay90ZXN0LlRlc3RDb25zdHJ1Y3QnKTtcbiAgICBleHBlY3QoZnFucykubm90LnRvQ29udGFpbignQGF3cy1jZGsvdGVzdC5UZXN0U3RhY2tJbnNpZGVTdGFjaycpO1xuICAgIGV4cGVjdChmcW5zKS5ub3QudG9Db250YWluKCdAYXdzLWNkay90ZXN0LlRlc3ROZXN0ZWRTdGFja0luc2lkZVN0YWNrJyk7XG4gICAgZXhwZWN0KGZxbnMpLm5vdC50b0NvbnRhaW4oJ0Bhd3MtY2RrL3Rlc3QuVGVzdFN0YWdlSW5zaWRlU3RhY2snKTtcbiAgfSk7XG59KTtcblxuY2xhc3MgVGVzdENvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG4gIC8vIEB0cy1pZ25vcmVcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgW0pTSUlfUlVOVElNRV9TWU1CT0xdID0geyBmcW46ICdAYXdzLWNkay90ZXN0LlRlc3RDb25zdHJ1Y3QnLCB2ZXJzaW9uOiBsb2NhbENka1ZlcnNpb24oKSB9XG59XG5cbi8qKlxuICogVGhlIGV4YWN0IHZhbHVlcyB3ZSBleHBlY3QgZnJvbSB0ZXN0aW5nIGFnYWluc3QgdmVyc2lvbiBudW1iZXJzIGluIHRoaXMgc3VpdGUgZGVwZW5kIG9uIHdoZXRoZXIgd2UncmUgcnVubmluZ1xuICogb24gYSBkZXZlbG9wbWVudCBvciByZWxlYXNlIGJyYW5jaC4gUmV0dXJucyB0aGUgbG9jYWwgcGFja2FnZS5qc29uIHZlcnNpb24sIHdoaWNoIHdpbGwgYmUgJzAuMC4wJyB1bmxlc3Mgd2UncmVcbiAqIG9uIGEgcmVsZWFzZSBicmFuY2gsIGluIHdoaWNoIGNhc2UgaXQgc2hvdWxkIGJlIHRoZSByZWFsIHZlcnNpb24gbnVtYmVycyAoZS5nLiwgMS45MS4wKS5cbiAqL1xuZnVuY3Rpb24gbG9jYWxDZGtWZXJzaW9uKCk6IHN0cmluZyB7XG4gIGlmICghX2Nka1ZlcnNpb24pIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICAgIGNvbnN0IHBrZ0pzb24gPSBmaW5kUGFyZW50UGtnSnNvbihfX2Rpcm5hbWUpO1xuICAgIF9jZGtWZXJzaW9uID0gcGtnSnNvbi52ZXJzaW9uO1xuICAgIGlmICghX2Nka1ZlcnNpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGRldGVybWluZSBDREsgdmVyc2lvbicpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gX2Nka1ZlcnNpb247XG59XG5cbmZ1bmN0aW9uIGZpbmRQYXJlbnRQa2dKc29uKGRpcjogc3RyaW5nLCBkZXB0aDogbnVtYmVyID0gMSwgbGltaXQ6IG51bWJlciA9IDUpOiB7IHZlcnNpb246IHN0cmluZzsgfSB7XG4gIGNvbnN0IHRhcmdldCA9IHBhdGguam9pbihkaXIsICdwYWNrYWdlLmpzb24nKTtcbiAgaWYgKGZzLmV4aXN0c1N5bmModGFyZ2V0KSkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyh0YXJnZXQsICd1dGY4JykpO1xuICB9IGVsc2UgaWYgKGRlcHRoIDwgbGltaXQpIHtcbiAgICByZXR1cm4gZmluZFBhcmVudFBrZ0pzb24ocGF0aC5qb2luKGRpciwgJy4uJyksIGRlcHRoICsgMSwgbGltaXQpO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKGBObyBcXGBwYWNrYWdlLmpzb25cXGAgZmlsZSBmb3VuZCB3aXRoaW4gJHtkZXB0aH0gcGFyZW50IGRpcmVjdG9yaWVzYCk7XG59XG4iXX0=