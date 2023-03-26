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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZS1pbmZvLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJydW50aW1lLWluZm8udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDJDQUF1QztBQUN2QyxnQ0FBd0Q7QUFDeEQsOERBQWlHO0FBRWpHLE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUVwRCxJQUFJLEdBQVEsQ0FBQztBQUNiLElBQUksS0FBWSxDQUFDO0FBQ2pCLElBQUksV0FBVyxHQUF1QixTQUFTLENBQUM7QUFFaEQseUVBQXlFO0FBQ3pFLHlFQUF5RTtBQUN6RSxpQkFBaUI7QUFDakIsRUFBRTtBQUNGLHlFQUF5RTtBQUN6RSwrQ0FBK0M7QUFDL0MsRUFBRTtBQUNGLHVEQUF1RDtBQUN2RCxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztBQUNuRCxNQUFNLHFCQUFxQixHQUFHLElBQUEseUNBQTBCLEVBQUMsSUFBSSxXQUFLLEVBQUUsQ0FBQyxFQUFFLEdBQUcsS0FBSyxzQkFBc0IsQ0FBQztBQUN0RyxJQUFJLGVBQWUsR0FBRyxRQUFRLENBQUM7QUFDL0IsSUFBSSxxQkFBcUIsSUFBSSxDQUFDLFNBQVMsRUFBRTtJQUN2QywyQkFBMkI7SUFDM0IsT0FBTyxDQUFDLEtBQUssQ0FBQyw4R0FBOEcsQ0FBQyxDQUFDO0lBQzlILGVBQWUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0NBQ2pDO0FBRUQsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLEdBQUcsR0FBRyxJQUFJLFNBQUcsRUFBRSxDQUFDO0lBQ2hCLEtBQUssR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFO1FBQzlCLGtCQUFrQixFQUFFLElBQUk7S0FDekIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7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Q0FBQztLQUNsRTtJQUVELE1BQU0sSUFBSSxLQUFLLENBQUMseUNBQXlDLEtBQUsscUJBQXFCLENBQUMsQ0FBQztBQUN2RixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQXBwLCBOZXN0ZWRTdGFjaywgU3RhY2ssIFN0YWdlIH0gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IGNvbnN0cnVjdEluZm9Gcm9tQ29uc3RydWN0LCBjb25zdHJ1Y3RJbmZvRnJvbVN0YWNrIH0gZnJvbSAnLi4vbGliL3ByaXZhdGUvcnVudGltZS1pbmZvJztcblxuY29uc3QgSlNJSV9SVU5USU1FX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ2pzaWkucnR0aScpO1xuXG5sZXQgYXBwOiBBcHA7XG5sZXQgc3RhY2s6IFN0YWNrO1xubGV0IF9jZGtWZXJzaW9uOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbi8vIFRoZSBydW50aW1lIG1ldGFkYXRhIHRoaXMgdGVzdCByZWxpZXMgb24gaXMgb25seSBhdmFpbGFibGUgaWYgdGhlIG1vc3Rcbi8vIHJlY2VudCBjb21waWxlIGhhcyBoYXBwZW5lZCB1c2luZyAnanNpaScsIGFzIHRoZSBqc2lpIGNvbXBpbGVyIGluamVjdHNcbi8vIHRoaXMgbWV0YWRhdGEuXG4vL1xuLy8gSWYgdGhlIG1vc3QgcmVjZW50IGNvbXBpbGUgd2FzIHVzaW5nICd0c2MnLCB0aGUgbWV0YWRhdGEgd2lsbCBub3QgaGF2ZVxuLy8gYmVlbiBpbmplY3RlZCwgYW5kIHRoZSB0ZXN0IHN1aXRlIHdpbGwgZmFpbC5cbi8vXG4vLyBUb2xlcmF0ZSBgdHNjYCBidWlsZHMgbG9jYWxseSwgYnV0IG5vdCBvbiBDb2RlQnVpbGQuXG5jb25zdCBjb2RlQnVpbGQgPSAhIXByb2Nlc3MuZW52LkNPREVCVUlMRF9CVUlMRF9JRDtcbmNvbnN0IG1vZHVsZUNvbXBpbGVkV2l0aFRzYyA9IGNvbnN0cnVjdEluZm9Gcm9tQ29uc3RydWN0KG5ldyBTdGFjaygpKT8uZnFuID09PSAnY29uc3RydWN0cy5Db25zdHJ1Y3QnO1xubGV0IGRlc2NyaWJlVHNjU2FmZSA9IGRlc2NyaWJlO1xuaWYgKG1vZHVsZUNvbXBpbGVkV2l0aFRzYyAmJiAhY29kZUJ1aWxkKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICBjb25zb2xlLmVycm9yKCdJdCBhcHBlYXJzIHRoaXMgbW9kdWxlIHdhcyBjb21waWxlZCB3aXRoIGB0c2NgIGluc3RlYWQgb2YgYGpzaWlgIGluIGEgbG9jYWwgYnVpbGQuIFNraXBwaW5nIHRoaXMgdGVzdCBzdWl0ZS4nKTtcbiAgZGVzY3JpYmVUc2NTYWZlID0gZGVzY3JpYmUuc2tpcDtcbn1cblxuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIGFwcCA9IG5ldyBBcHAoKTtcbiAgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snLCB7XG4gICAgYW5hbHl0aWNzUmVwb3J0aW5nOiB0cnVlLFxuICB9KTtcbn0pO1xuXG5kZXNjcmliZVRzY1NhZmUoJ2NvbnN0cnVjdEluZm9Gcm9tQ29uc3RydWN0JywgKCkgPT4ge1xuICB0ZXN0KCdyZXR1cm5zIGZxbiBhbmQgdmVyc2lvbiBmb3IgY29yZSBjb25zdHJ1Y3RzJywgKCkgPT4ge1xuICAgIGNvbnN0IGNvbnN0cnVjdEluZm8gPSBjb25zdHJ1Y3RJbmZvRnJvbUNvbnN0cnVjdChzdGFjayk7XG4gICAgZXhwZWN0KGNvbnN0cnVjdEluZm8pLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KGNvbnN0cnVjdEluZm8/LmZxbikudG9FcXVhbCgnQGF3cy1jZGsvY29yZS5TdGFjaycpO1xuICAgIGV4cGVjdChjb25zdHJ1Y3RJbmZvPy52ZXJzaW9uKS50b0VxdWFsKGxvY2FsQ2RrVmVyc2lvbigpKTtcbiAgfSk7XG5cbiAgdGVzdCgncmV0dXJucyBqc2lpIHJ1bnRpbWUgaW5mbyBpZiBwcmVzZW50JywgKCkgPT4ge1xuICAgIGNvbnN0IGNvbnN0cnVjdCA9IG5ldyBUZXN0Q29uc3RydWN0KHN0YWNrLCAnVGVzdENvbnN0cnVjdCcpO1xuXG4gICAgY29uc3QgY29uc3RydWN0SW5mbyA9IGNvbnN0cnVjdEluZm9Gcm9tQ29uc3RydWN0KGNvbnN0cnVjdCk7XG4gICAgZXhwZWN0KGNvbnN0cnVjdEluZm8/LmZxbikudG9FcXVhbCgnQGF3cy1jZGsvdGVzdC5UZXN0Q29uc3RydWN0Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBpZiB0aGUganNpaSBydW50aW1lIGluZm8gaXMgbm90IGFzIGV4cGVjdGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IGNvbnN0cnVjdFJ1bnRpbWVJbmZvTm90T2JqZWN0ID0gbmV3IGNsYXNzIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFtKU0lJX1JVTlRJTUVfU1lNQk9MXSA9ICdIZWxsb1dvcmxkJztcbiAgICB9KHN0YWNrLCAnUnVudGltZU5vdE9iamVjdCcpO1xuICAgIGNvbnN0IGNvbnN0cnVjdFdpdGhXcm9uZ1J1bnRpbWVJbmZvTWVtYmVycyA9IG5ldyBjbGFzcyBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBbSlNJSV9SVU5USU1FX1NZTUJPTF0gPSB7IGZvbzogJ2JhcicgfTtcbiAgICB9KHN0YWNrLCAnUnVudGltZVdyb25nTWVtYmVycycpO1xuICAgIGNvbnN0IGNvbnN0cnVjdFdpdGhXcm9uZ1J1bnRpbWVJbmZvVHlwZXMgPSBuZXcgY2xhc3MgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgW0pTSUlfUlVOVElNRV9TWU1CT0xdID0geyBmcW46IDQyLCB2ZXJzaW9uOiB7IG5hbWU6ICcwLjAuMCcgfSB9O1xuICAgIH0oc3RhY2ssICdSdW50aW1lV3JvbmdUeXBlcycpO1xuXG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gJ21hbGZvcm1lZCBqc2lpIHJ1bnRpbWUgaW5mbyBmb3IgY29uc3RydWN0JztcbiAgICBbY29uc3RydWN0UnVudGltZUluZm9Ob3RPYmplY3QsIGNvbnN0cnVjdFdpdGhXcm9uZ1J1bnRpbWVJbmZvTWVtYmVycywgY29uc3RydWN0V2l0aFdyb25nUnVudGltZUluZm9UeXBlc10uZm9yRWFjaChjb25zdHJ1Y3QgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IGNvbnN0cnVjdEluZm9Gcm9tQ29uc3RydWN0KGNvbnN0cnVjdCkpLnRvVGhyb3coZXJyb3JNZXNzYWdlKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmVUc2NTYWZlKCdjb25zdHJ1Y3RJbmZvRm9yU3RhY2snLCAoKSA9PiB7XG4gIHRlc3QoJ3JldHVybnMgc3RhY2sgaXRzZWxmIGFuZCBqc2lpIHJ1bnRpbWUgaWYgc3RhY2sgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgY29uc3QgY29uc3RydWN0SW5mb3MgPSBjb25zdHJ1Y3RJbmZvRnJvbVN0YWNrKHN0YWNrKTtcblxuICAgIGV4cGVjdChjb25zdHJ1Y3RJbmZvcy5sZW5ndGgpLnRvRXF1YWwoMik7XG5cbiAgICBjb25zdCBzdGFja0luZm8gPSBjb25zdHJ1Y3RJbmZvcy5maW5kKGkgPT4gL1N0YWNrLy50ZXN0KGkuZnFuKSk7XG4gICAgY29uc3QganNpaUluZm8gPSBjb25zdHJ1Y3RJbmZvcy5maW5kKGkgPT4gaS5mcW4gPT09ICdqc2lpLXJ1bnRpbWUuUnVudGltZScpO1xuICAgIGV4cGVjdChzdGFja0luZm8/LmZxbikudG9FcXVhbCgnQGF3cy1jZGsvY29yZS5TdGFjaycpO1xuICAgIGV4cGVjdChzdGFja0luZm8/LnZlcnNpb24pLnRvRXF1YWwobG9jYWxDZGtWZXJzaW9uKCkpO1xuICAgIGV4cGVjdChqc2lpSW5mbz8udmVyc2lvbikudG9NYXRjaCgvbm9kZS5qcy8pO1xuICB9KTtcblxuICB0ZXN0KCdzYW5pdGl6ZXMganNpaSBydW50aW1lIGluZm8gdG8gcmVtb3ZlIHVud2FudGVkIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgcHJvY2Vzcy5lbnYuSlNJSV9BR0VOVCA9ICdEb3ROZXQvNS4wLjMvLk5FVENvcmVeQXBwLFZlcnNpb249djMuMSEvMS4wLjBfMCc7XG4gICAgY29uc3QgY29uc3RydWN0SW5mb3MgPSBjb25zdHJ1Y3RJbmZvRnJvbVN0YWNrKHN0YWNrKTtcbiAgICBjb25zdCBqc2lpSW5mbyA9IGNvbnN0cnVjdEluZm9zLmZpbmQoaSA9PiBpLmZxbiA9PT0gJ2pzaWktcnVudGltZS5SdW50aW1lJyk7XG5cbiAgICBleHBlY3QoanNpaUluZm8/LnZlcnNpb24pLnRvRXF1YWwoJ0RvdE5ldC81LjAuMy8uTkVUQ29yZS1BcHAtVmVyc2lvbj12My4xLS8xLjAuMF8wJyk7XG5cbiAgICBkZWxldGUgcHJvY2Vzcy5lbnYuSlNJSV9BR0VOVDtcbiAgfSk7XG5cbiAgdGVzdCgncmV0dXJucyBpbmZvIGZvciBjb25zdHJ1Y3RzIGFkZGVkIHRvIHRoZSBzdGFjaycsICgpID0+IHtcbiAgICBuZXcgVGVzdENvbnN0cnVjdChzdGFjaywgJ1Rlc3RDb25zdHJ1Y3QnKTtcblxuICAgIGNvbnN0IGNvbnN0cnVjdEluZm9zID0gY29uc3RydWN0SW5mb0Zyb21TdGFjayhzdGFjayk7XG5cbiAgICBleHBlY3QoY29uc3RydWN0SW5mb3MubGVuZ3RoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb25zdHJ1Y3RJbmZvcy5tYXAoaW5mbyA9PiBpbmZvLmZxbikpLnRvQ29udGFpbignQGF3cy1jZGsvdGVzdC5UZXN0Q29uc3RydWN0Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JldHVybnMgdW5pcXVlIGluZm8gKG5vIGR1cGxpY2F0ZXMpJywgKCkgPT4ge1xuICAgIG5ldyBUZXN0Q29uc3RydWN0KHN0YWNrLCAnVGVzdENvbnN0cnVjdDEnKTtcbiAgICBuZXcgVGVzdENvbnN0cnVjdChzdGFjaywgJ1Rlc3RDb25zdHJ1Y3QyJyk7XG5cbiAgICBjb25zdCBjb25zdHJ1Y3RJbmZvcyA9IGNvbnN0cnVjdEluZm9Gcm9tU3RhY2soc3RhY2spO1xuXG4gICAgZXhwZWN0KGNvbnN0cnVjdEluZm9zLmxlbmd0aCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29uc3RydWN0SW5mb3MubWFwKGluZm8gPT4gaW5mby5mcW4pKS50b0NvbnRhaW4oJ0Bhd3MtY2RrL3Rlc3QuVGVzdENvbnN0cnVjdCcpO1xuICB9KTtcblxuICB0ZXN0KCdyZXR1cm5zIGluZm8gZnJvbSBuZXN0ZWQgY29uc3RydWN0cycsICgpID0+IHtcbiAgICBuZXcgY2xhc3MgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgICAgICBuZXcgVGVzdENvbnN0cnVjdCh0aGlzLCAnVGVzdENvbnN0cnVjdCcpO1xuICAgICAgfVxuICAgIH0oc3RhY2ssICdOZXN0ZWQnKTtcblxuICAgIGNvbnN0IGNvbnN0cnVjdEluZm9zID0gY29uc3RydWN0SW5mb0Zyb21TdGFjayhzdGFjayk7XG5cbiAgICBleHBlY3QoY29uc3RydWN0SW5mb3MubWFwKGluZm8gPT4gaW5mby5mcW4pKS50b0NvbnRhaW4oJ0Bhd3MtY2RrL3Rlc3QuVGVzdENvbnN0cnVjdCcpO1xuICB9KTtcblxuICB0ZXN0KCdkb2VzIG5vdCByZXR1cm4gaW5mbyBmcm9tIG5lc3RlZCBzdGFja3MnLCAoKSA9PiB7XG4gICAgbmV3IGNsYXNzIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgICAgICBuZXcgVGVzdENvbnN0cnVjdCh0aGlzLCAnVGVzdENvbnN0cnVjdCcpO1xuXG4gICAgICAgIG5ldyBjbGFzcyBleHRlbmRzIFN0YWNrIHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgW0pTSUlfUlVOVElNRV9TWU1CT0xdID0geyBmcW46ICdAYXdzLWNkay90ZXN0LlRlc3RTdGFja0luc2lkZVN0YWNrJywgdmVyc2lvbjogbG9jYWxDZGtWZXJzaW9uKCkgfVxuICAgICAgICB9KHRoaXMsICdTdGFja0luc2lkZVN0YWNrJyk7XG5cbiAgICAgICAgbmV3IGNsYXNzIGV4dGVuZHMgTmVzdGVkU3RhY2sge1xuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBbSlNJSV9SVU5USU1FX1NZTUJPTF0gPSB7IGZxbjogJ0Bhd3MtY2RrL3Rlc3QuVGVzdE5lc3RlZFN0YWNrSW5zaWRlU3RhY2snLCB2ZXJzaW9uOiBsb2NhbENka1ZlcnNpb24oKSB9XG4gICAgICAgIH0odGhpcywgJ05lc3RlZFN0YWNrSW5zaWRlU3RhY2snKTtcblxuICAgICAgICBuZXcgY2xhc3MgZXh0ZW5kcyBTdGFnZSB7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFtKU0lJX1JVTlRJTUVfU1lNQk9MXSA9IHsgZnFuOiAnQGF3cy1jZGsvdGVzdC5UZXN0U3RhZ2VJbnNpZGVTdGFjaycsIHZlcnNpb246IGxvY2FsQ2RrVmVyc2lvbigpIH1cbiAgICAgICAgfSh0aGlzLCAnU3RhZ2VJbnNpZGVTdGFjaycpO1xuICAgICAgfVxuICAgIH0oc3RhY2ssICdQYXJlbnRDb25zdHJ1Y3QnKTtcblxuICAgIGNvbnN0IGNvbnN0cnVjdEluZm9zID0gY29uc3RydWN0SW5mb0Zyb21TdGFjayhzdGFjayk7XG5cbiAgICBjb25zdCBmcW5zID0gY29uc3RydWN0SW5mb3MubWFwKGluZm8gPT4gaW5mby5mcW4pO1xuICAgIGV4cGVjdChmcW5zKS50b0NvbnRhaW4oJ0Bhd3MtY2RrL3Rlc3QuVGVzdENvbnN0cnVjdCcpO1xuICAgIGV4cGVjdChmcW5zKS5ub3QudG9Db250YWluKCdAYXdzLWNkay90ZXN0LlRlc3RTdGFja0luc2lkZVN0YWNrJyk7XG4gICAgZXhwZWN0KGZxbnMpLm5vdC50b0NvbnRhaW4oJ0Bhd3MtY2RrL3Rlc3QuVGVzdE5lc3RlZFN0YWNrSW5zaWRlU3RhY2snKTtcbiAgICBleHBlY3QoZnFucykubm90LnRvQ29udGFpbignQGF3cy1jZGsvdGVzdC5UZXN0U3RhZ2VJbnNpZGVTdGFjaycpO1xuICB9KTtcbn0pO1xuXG5jbGFzcyBUZXN0Q29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgLy8gQHRzLWlnbm9yZVxuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBbSlNJSV9SVU5USU1FX1NZTUJPTF0gPSB7IGZxbjogJ0Bhd3MtY2RrL3Rlc3QuVGVzdENvbnN0cnVjdCcsIHZlcnNpb246IGxvY2FsQ2RrVmVyc2lvbigpIH1cbn1cblxuLyoqXG4gKiBUaGUgZXhhY3QgdmFsdWVzIHdlIGV4cGVjdCBmcm9tIHRlc3RpbmcgYWdhaW5zdCB2ZXJzaW9uIG51bWJlcnMgaW4gdGhpcyBzdWl0ZSBkZXBlbmQgb24gd2hldGhlciB3ZSdyZSBydW5uaW5nXG4gKiBvbiBhIGRldmVsb3BtZW50IG9yIHJlbGVhc2UgYnJhbmNoLiBSZXR1cm5zIHRoZSBsb2NhbCBwYWNrYWdlLmpzb24gdmVyc2lvbiwgd2hpY2ggd2lsbCBiZSAnMC4wLjAnIHVubGVzcyB3ZSdyZVxuICogb24gYSByZWxlYXNlIGJyYW5jaCwgaW4gd2hpY2ggY2FzZSBpdCBzaG91bGQgYmUgdGhlIHJlYWwgdmVyc2lvbiBudW1iZXJzIChlLmcuLCAxLjkxLjApLlxuICovXG5mdW5jdGlvbiBsb2NhbENka1ZlcnNpb24oKTogc3RyaW5nIHtcbiAgaWYgKCFfY2RrVmVyc2lvbikge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgY29uc3QgcGtnSnNvbiA9IGZpbmRQYXJlbnRQa2dKc29uKF9fZGlybmFtZSk7XG4gICAgX2Nka1ZlcnNpb24gPSBwa2dKc29uLnZlcnNpb247XG4gICAgaWYgKCFfY2RrVmVyc2lvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZGV0ZXJtaW5lIENESyB2ZXJzaW9uJyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBfY2RrVmVyc2lvbjtcbn1cblxuZnVuY3Rpb24gZmluZFBhcmVudFBrZ0pzb24oZGlyOiBzdHJpbmcsIGRlcHRoOiBudW1iZXIgPSAxLCBsaW1pdDogbnVtYmVyID0gNSk6IHsgdmVyc2lvbjogc3RyaW5nOyB9IHtcbiAgY29uc3QgdGFyZ2V0ID0gcGF0aC5qb2luKGRpciwgJ3BhY2thZ2UuanNvbicpO1xuICBpZiAoZnMuZXhpc3RzU3luYyh0YXJnZXQpKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHRhcmdldCwgJ3V0ZjgnKSk7XG4gIH0gZWxzZSBpZiAoZGVwdGggPCBsaW1pdCkge1xuICAgIHJldHVybiBmaW5kUGFyZW50UGtnSnNvbihwYXRoLmpvaW4oZGlyLCAnLi4nKSwgZGVwdGggKyAxLCBsaW1pdCk7XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoYE5vIFxcYHBhY2thZ2UuanNvblxcYCBmaWxlIGZvdW5kIHdpdGhpbiAke2RlcHRofSBwYXJlbnQgZGlyZWN0b3JpZXNgKTtcbn1cbiJdfQ==