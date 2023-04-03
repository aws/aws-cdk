"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
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
const moduleCompiledWithTsc = runtime_info_1.constructInfoFromConstruct(new lib_1.Stack())?.fqn === 'constructs.Construct';
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
        const constructInfo = runtime_info_1.constructInfoFromConstruct(stack);
        expect(constructInfo).toBeDefined();
        expect(constructInfo?.fqn).toEqual('@aws-cdk/core.Stack');
        expect(constructInfo?.version).toEqual(localCdkVersion());
    });
    test('returns jsii runtime info if present', () => {
        const construct = new TestConstruct(stack, 'TestConstruct');
        const constructInfo = runtime_info_1.constructInfoFromConstruct(construct);
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
            expect(() => runtime_info_1.constructInfoFromConstruct(construct)).toThrow(errorMessage);
        });
    });
});
describeTscSafe('constructInfoForStack', () => {
    test('returns stack itself and jsii runtime if stack is empty', () => {
        const constructInfos = runtime_info_1.constructInfoFromStack(stack);
        expect(constructInfos.length).toEqual(2);
        const stackInfo = constructInfos.find(i => /Stack/.test(i.fqn));
        const jsiiInfo = constructInfos.find(i => i.fqn === 'jsii-runtime.Runtime');
        expect(stackInfo?.fqn).toEqual('@aws-cdk/core.Stack');
        expect(stackInfo?.version).toEqual(localCdkVersion());
        expect(jsiiInfo?.version).toMatch(/node.js/);
    });
    test('sanitizes jsii runtime info to remove unwanted characters', () => {
        process.env.JSII_AGENT = 'DotNet/5.0.3/.NETCore^App,Version=v3.1!/1.0.0_0';
        const constructInfos = runtime_info_1.constructInfoFromStack(stack);
        const jsiiInfo = constructInfos.find(i => i.fqn === 'jsii-runtime.Runtime');
        expect(jsiiInfo?.version).toEqual('DotNet/5.0.3/.NETCore-App-Version=v3.1-/1.0.0_0');
        delete process.env.JSII_AGENT;
    });
    test('returns info for constructs added to the stack', () => {
        new TestConstruct(stack, 'TestConstruct');
        const constructInfos = runtime_info_1.constructInfoFromStack(stack);
        expect(constructInfos.length).toEqual(3);
        expect(constructInfos.map(info => info.fqn)).toContain('@aws-cdk/test.TestConstruct');
    });
    test('returns unique info (no duplicates)', () => {
        new TestConstruct(stack, 'TestConstruct1');
        new TestConstruct(stack, 'TestConstruct2');
        const constructInfos = runtime_info_1.constructInfoFromStack(stack);
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
        const constructInfos = runtime_info_1.constructInfoFromStack(stack);
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
        const constructInfos = runtime_info_1.constructInfoFromStack(stack);
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
        _cdkVersion = require(path.join('..', 'package.json')).version;
        if (!_cdkVersion) {
            throw new Error('Unable to determine CDK version');
        }
    }
    return _cdkVersion;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZS1pbmZvLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJydW50aW1lLWluZm8udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0IsMkNBQXVDO0FBQ3ZDLGdDQUF3RDtBQUN4RCw4REFBaUc7QUFFakcsTUFBTSxtQkFBbUIsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRXBELElBQUksR0FBUSxDQUFDO0FBQ2IsSUFBSSxLQUFZLENBQUM7QUFDakIsSUFBSSxXQUFXLEdBQXVCLFNBQVMsQ0FBQztBQUVoRCx5RUFBeUU7QUFDekUseUVBQXlFO0FBQ3pFLGlCQUFpQjtBQUNqQixFQUFFO0FBQ0YseUVBQXlFO0FBQ3pFLCtDQUErQztBQUMvQyxFQUFFO0FBQ0YsdURBQXVEO0FBQ3ZELE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0FBQ25ELE1BQU0scUJBQXFCLEdBQUcseUNBQTBCLENBQUMsSUFBSSxXQUFLLEVBQUUsQ0FBQyxFQUFFLEdBQUcsS0FBSyxzQkFBc0IsQ0FBQztBQUN0RyxJQUFJLGVBQWUsR0FBRyxRQUFRLENBQUM7QUFDL0IsSUFBSSxxQkFBcUIsSUFBSSxDQUFDLFNBQVMsRUFBRTtJQUN2QywyQkFBMkI7SUFDM0IsT0FBTyxDQUFDLEtBQUssQ0FBQyw4R0FBOEcsQ0FBQyxDQUFDO0lBQzlILGVBQWUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0NBQ2pDO0FBRUQsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLEdBQUcsR0FBRyxJQUFJLFNBQUcsRUFBRSxDQUFDO0lBQ2hCLEtBQUssR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFO1FBQzlCLGtCQUFrQixFQUFFLElBQUk7S0FDekIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxlQUFlLENBQUMsNEJB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LENBQUMsb0NBQW9DLENBQUMsQ0FBQztJQUNuRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxhQUFjLFNBQVEsc0JBQVM7O0tBRVYsbUJBQW1CO0FBRDVDLGFBQWE7QUFDVyxpQkFBcUIsR0FBRyxFQUFFLEdBQUcsRUFBRSw2QkFBNkIsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLEVBQUUsQ0FBQTtBQUdwSDs7OztHQUlHO0FBQ0gsU0FBUyxlQUFlO0lBQ3RCLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDaEIsaUVBQWlFO1FBQ2pFLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDL0QsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7U0FDcEQ7S0FDRjtJQUNELE9BQU8sV0FBVyxDQUFDO0FBQ3JCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBcHAsIE5lc3RlZFN0YWNrLCBTdGFjaywgU3RhZ2UgfSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgY29uc3RydWN0SW5mb0Zyb21Db25zdHJ1Y3QsIGNvbnN0cnVjdEluZm9Gcm9tU3RhY2sgfSBmcm9tICcuLi9saWIvcHJpdmF0ZS9ydW50aW1lLWluZm8nO1xuXG5jb25zdCBKU0lJX1JVTlRJTUVfU1lNQk9MID0gU3ltYm9sLmZvcignanNpaS5ydHRpJyk7XG5cbmxldCBhcHA6IEFwcDtcbmxldCBzdGFjazogU3RhY2s7XG5sZXQgX2Nka1ZlcnNpb246IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuLy8gVGhlIHJ1bnRpbWUgbWV0YWRhdGEgdGhpcyB0ZXN0IHJlbGllcyBvbiBpcyBvbmx5IGF2YWlsYWJsZSBpZiB0aGUgbW9zdFxuLy8gcmVjZW50IGNvbXBpbGUgaGFzIGhhcHBlbmVkIHVzaW5nICdqc2lpJywgYXMgdGhlIGpzaWkgY29tcGlsZXIgaW5qZWN0c1xuLy8gdGhpcyBtZXRhZGF0YS5cbi8vXG4vLyBJZiB0aGUgbW9zdCByZWNlbnQgY29tcGlsZSB3YXMgdXNpbmcgJ3RzYycsIHRoZSBtZXRhZGF0YSB3aWxsIG5vdCBoYXZlXG4vLyBiZWVuIGluamVjdGVkLCBhbmQgdGhlIHRlc3Qgc3VpdGUgd2lsbCBmYWlsLlxuLy9cbi8vIFRvbGVyYXRlIGB0c2NgIGJ1aWxkcyBsb2NhbGx5LCBidXQgbm90IG9uIENvZGVCdWlsZC5cbmNvbnN0IGNvZGVCdWlsZCA9ICEhcHJvY2Vzcy5lbnYuQ09ERUJVSUxEX0JVSUxEX0lEO1xuY29uc3QgbW9kdWxlQ29tcGlsZWRXaXRoVHNjID0gY29uc3RydWN0SW5mb0Zyb21Db25zdHJ1Y3QobmV3IFN0YWNrKCkpPy5mcW4gPT09ICdjb25zdHJ1Y3RzLkNvbnN0cnVjdCc7XG5sZXQgZGVzY3JpYmVUc2NTYWZlID0gZGVzY3JpYmU7XG5pZiAobW9kdWxlQ29tcGlsZWRXaXRoVHNjICYmICFjb2RlQnVpbGQpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gIGNvbnNvbGUuZXJyb3IoJ0l0IGFwcGVhcnMgdGhpcyBtb2R1bGUgd2FzIGNvbXBpbGVkIHdpdGggYHRzY2AgaW5zdGVhZCBvZiBganNpaWAgaW4gYSBsb2NhbCBidWlsZC4gU2tpcHBpbmcgdGhpcyB0ZXN0IHN1aXRlLicpO1xuICBkZXNjcmliZVRzY1NhZmUgPSBkZXNjcmliZS5za2lwO1xufVxuXG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgYXBwID0gbmV3IEFwcCgpO1xuICBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycsIHtcbiAgICBhbmFseXRpY3NSZXBvcnRpbmc6IHRydWUsXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlVHNjU2FmZSgnY29uc3RydWN0SW5mb0Zyb21Db25zdHJ1Y3QnLCAoKSA9PiB7XG4gIHRlc3QoJ3JldHVybnMgZnFuIGFuZCB2ZXJzaW9uIGZvciBjb3JlIGNvbnN0cnVjdHMnLCAoKSA9PiB7XG4gICAgY29uc3QgY29uc3RydWN0SW5mbyA9IGNvbnN0cnVjdEluZm9Gcm9tQ29uc3RydWN0KHN0YWNrKTtcbiAgICBleHBlY3QoY29uc3RydWN0SW5mbykudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoY29uc3RydWN0SW5mbz8uZnFuKS50b0VxdWFsKCdAYXdzLWNkay9jb3JlLlN0YWNrJyk7XG4gICAgZXhwZWN0KGNvbnN0cnVjdEluZm8/LnZlcnNpb24pLnRvRXF1YWwobG9jYWxDZGtWZXJzaW9uKCkpO1xuICB9KTtcblxuICB0ZXN0KCdyZXR1cm5zIGpzaWkgcnVudGltZSBpbmZvIGlmIHByZXNlbnQnLCAoKSA9PiB7XG4gICAgY29uc3QgY29uc3RydWN0ID0gbmV3IFRlc3RDb25zdHJ1Y3Qoc3RhY2ssICdUZXN0Q29uc3RydWN0Jyk7XG5cbiAgICBjb25zdCBjb25zdHJ1Y3RJbmZvID0gY29uc3RydWN0SW5mb0Zyb21Db25zdHJ1Y3QoY29uc3RydWN0KTtcbiAgICBleHBlY3QoY29uc3RydWN0SW5mbz8uZnFuKS50b0VxdWFsKCdAYXdzLWNkay90ZXN0LlRlc3RDb25zdHJ1Y3QnKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGlmIHRoZSBqc2lpIHJ1bnRpbWUgaW5mbyBpcyBub3QgYXMgZXhwZWN0ZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgY29uc3RydWN0UnVudGltZUluZm9Ob3RPYmplY3QgPSBuZXcgY2xhc3MgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgW0pTSUlfUlVOVElNRV9TWU1CT0xdID0gJ0hlbGxvV29ybGQnO1xuICAgIH0oc3RhY2ssICdSdW50aW1lTm90T2JqZWN0Jyk7XG4gICAgY29uc3QgY29uc3RydWN0V2l0aFdyb25nUnVudGltZUluZm9NZW1iZXJzID0gbmV3IGNsYXNzIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFtKU0lJX1JVTlRJTUVfU1lNQk9MXSA9IHsgZm9vOiAnYmFyJyB9O1xuICAgIH0oc3RhY2ssICdSdW50aW1lV3JvbmdNZW1iZXJzJyk7XG4gICAgY29uc3QgY29uc3RydWN0V2l0aFdyb25nUnVudGltZUluZm9UeXBlcyA9IG5ldyBjbGFzcyBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBbSlNJSV9SVU5USU1FX1NZTUJPTF0gPSB7IGZxbjogNDIsIHZlcnNpb246IHsgbmFtZTogJzAuMC4wJyB9IH07XG4gICAgfShzdGFjaywgJ1J1bnRpbWVXcm9uZ1R5cGVzJyk7XG5cbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSAnbWFsZm9ybWVkIGpzaWkgcnVudGltZSBpbmZvIGZvciBjb25zdHJ1Y3QnO1xuICAgIFtjb25zdHJ1Y3RSdW50aW1lSW5mb05vdE9iamVjdCwgY29uc3RydWN0V2l0aFdyb25nUnVudGltZUluZm9NZW1iZXJzLCBjb25zdHJ1Y3RXaXRoV3JvbmdSdW50aW1lSW5mb1R5cGVzXS5mb3JFYWNoKGNvbnN0cnVjdCA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4gY29uc3RydWN0SW5mb0Zyb21Db25zdHJ1Y3QoY29uc3RydWN0KSkudG9UaHJvdyhlcnJvck1lc3NhZ2UpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZVRzY1NhZmUoJ2NvbnN0cnVjdEluZm9Gb3JTdGFjaycsICgpID0+IHtcbiAgdGVzdCgncmV0dXJucyBzdGFjayBpdHNlbGYgYW5kIGpzaWkgcnVudGltZSBpZiBzdGFjayBpcyBlbXB0eScsICgpID0+IHtcbiAgICBjb25zdCBjb25zdHJ1Y3RJbmZvcyA9IGNvbnN0cnVjdEluZm9Gcm9tU3RhY2soc3RhY2spO1xuXG4gICAgZXhwZWN0KGNvbnN0cnVjdEluZm9zLmxlbmd0aCkudG9FcXVhbCgyKTtcblxuICAgIGNvbnN0IHN0YWNrSW5mbyA9IGNvbnN0cnVjdEluZm9zLmZpbmQoaSA9PiAvU3RhY2svLnRlc3QoaS5mcW4pKTtcbiAgICBjb25zdCBqc2lpSW5mbyA9IGNvbnN0cnVjdEluZm9zLmZpbmQoaSA9PiBpLmZxbiA9PT0gJ2pzaWktcnVudGltZS5SdW50aW1lJyk7XG4gICAgZXhwZWN0KHN0YWNrSW5mbz8uZnFuKS50b0VxdWFsKCdAYXdzLWNkay9jb3JlLlN0YWNrJyk7XG4gICAgZXhwZWN0KHN0YWNrSW5mbz8udmVyc2lvbikudG9FcXVhbChsb2NhbENka1ZlcnNpb24oKSk7XG4gICAgZXhwZWN0KGpzaWlJbmZvPy52ZXJzaW9uKS50b01hdGNoKC9ub2RlLmpzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Nhbml0aXplcyBqc2lpIHJ1bnRpbWUgaW5mbyB0byByZW1vdmUgdW53YW50ZWQgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICBwcm9jZXNzLmVudi5KU0lJX0FHRU5UID0gJ0RvdE5ldC81LjAuMy8uTkVUQ29yZV5BcHAsVmVyc2lvbj12My4xIS8xLjAuMF8wJztcbiAgICBjb25zdCBjb25zdHJ1Y3RJbmZvcyA9IGNvbnN0cnVjdEluZm9Gcm9tU3RhY2soc3RhY2spO1xuICAgIGNvbnN0IGpzaWlJbmZvID0gY29uc3RydWN0SW5mb3MuZmluZChpID0+IGkuZnFuID09PSAnanNpaS1ydW50aW1lLlJ1bnRpbWUnKTtcblxuICAgIGV4cGVjdChqc2lpSW5mbz8udmVyc2lvbikudG9FcXVhbCgnRG90TmV0LzUuMC4zLy5ORVRDb3JlLUFwcC1WZXJzaW9uPXYzLjEtLzEuMC4wXzAnKTtcblxuICAgIGRlbGV0ZSBwcm9jZXNzLmVudi5KU0lJX0FHRU5UO1xuICB9KTtcblxuICB0ZXN0KCdyZXR1cm5zIGluZm8gZm9yIGNvbnN0cnVjdHMgYWRkZWQgdG8gdGhlIHN0YWNrJywgKCkgPT4ge1xuICAgIG5ldyBUZXN0Q29uc3RydWN0KHN0YWNrLCAnVGVzdENvbnN0cnVjdCcpO1xuXG4gICAgY29uc3QgY29uc3RydWN0SW5mb3MgPSBjb25zdHJ1Y3RJbmZvRnJvbVN0YWNrKHN0YWNrKTtcblxuICAgIGV4cGVjdChjb25zdHJ1Y3RJbmZvcy5sZW5ndGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnN0cnVjdEluZm9zLm1hcChpbmZvID0+IGluZm8uZnFuKSkudG9Db250YWluKCdAYXdzLWNkay90ZXN0LlRlc3RDb25zdHJ1Y3QnKTtcbiAgfSk7XG5cbiAgdGVzdCgncmV0dXJucyB1bmlxdWUgaW5mbyAobm8gZHVwbGljYXRlcyknLCAoKSA9PiB7XG4gICAgbmV3IFRlc3RDb25zdHJ1Y3Qoc3RhY2ssICdUZXN0Q29uc3RydWN0MScpO1xuICAgIG5ldyBUZXN0Q29uc3RydWN0KHN0YWNrLCAnVGVzdENvbnN0cnVjdDInKTtcblxuICAgIGNvbnN0IGNvbnN0cnVjdEluZm9zID0gY29uc3RydWN0SW5mb0Zyb21TdGFjayhzdGFjayk7XG5cbiAgICBleHBlY3QoY29uc3RydWN0SW5mb3MubGVuZ3RoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb25zdHJ1Y3RJbmZvcy5tYXAoaW5mbyA9PiBpbmZvLmZxbikpLnRvQ29udGFpbignQGF3cy1jZGsvdGVzdC5UZXN0Q29uc3RydWN0Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JldHVybnMgaW5mbyBmcm9tIG5lc3RlZCBjb25zdHJ1Y3RzJywgKCkgPT4ge1xuICAgIG5ldyBjbGFzcyBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgICAgIG5ldyBUZXN0Q29uc3RydWN0KHRoaXMsICdUZXN0Q29uc3RydWN0Jyk7XG4gICAgICB9XG4gICAgfShzdGFjaywgJ05lc3RlZCcpO1xuXG4gICAgY29uc3QgY29uc3RydWN0SW5mb3MgPSBjb25zdHJ1Y3RJbmZvRnJvbVN0YWNrKHN0YWNrKTtcblxuICAgIGV4cGVjdChjb25zdHJ1Y3RJbmZvcy5tYXAoaW5mbyA9PiBpbmZvLmZxbikpLnRvQ29udGFpbignQGF3cy1jZGsvdGVzdC5UZXN0Q29uc3RydWN0Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RvZXMgbm90IHJldHVybiBpbmZvIGZyb20gbmVzdGVkIHN0YWNrcycsICgpID0+IHtcbiAgICBuZXcgY2xhc3MgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgICAgIG5ldyBUZXN0Q29uc3RydWN0KHRoaXMsICdUZXN0Q29uc3RydWN0Jyk7XG5cbiAgICAgICAgbmV3IGNsYXNzIGV4dGVuZHMgU3RhY2sge1xuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBbSlNJSV9SVU5USU1FX1NZTUJPTF0gPSB7IGZxbjogJ0Bhd3MtY2RrL3Rlc3QuVGVzdFN0YWNrSW5zaWRlU3RhY2snLCB2ZXJzaW9uOiBsb2NhbENka1ZlcnNpb24oKSB9XG4gICAgICAgIH0odGhpcywgJ1N0YWNrSW5zaWRlU3RhY2snKTtcblxuICAgICAgICBuZXcgY2xhc3MgZXh0ZW5kcyBOZXN0ZWRTdGFjayB7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFtKU0lJX1JVTlRJTUVfU1lNQk9MXSA9IHsgZnFuOiAnQGF3cy1jZGsvdGVzdC5UZXN0TmVzdGVkU3RhY2tJbnNpZGVTdGFjaycsIHZlcnNpb246IGxvY2FsQ2RrVmVyc2lvbigpIH1cbiAgICAgICAgfSh0aGlzLCAnTmVzdGVkU3RhY2tJbnNpZGVTdGFjaycpO1xuXG4gICAgICAgIG5ldyBjbGFzcyBleHRlbmRzIFN0YWdlIHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgW0pTSUlfUlVOVElNRV9TWU1CT0xdID0geyBmcW46ICdAYXdzLWNkay90ZXN0LlRlc3RTdGFnZUluc2lkZVN0YWNrJywgdmVyc2lvbjogbG9jYWxDZGtWZXJzaW9uKCkgfVxuICAgICAgICB9KHRoaXMsICdTdGFnZUluc2lkZVN0YWNrJyk7XG4gICAgICB9XG4gICAgfShzdGFjaywgJ1BhcmVudENvbnN0cnVjdCcpO1xuXG4gICAgY29uc3QgY29uc3RydWN0SW5mb3MgPSBjb25zdHJ1Y3RJbmZvRnJvbVN0YWNrKHN0YWNrKTtcblxuICAgIGNvbnN0IGZxbnMgPSBjb25zdHJ1Y3RJbmZvcy5tYXAoaW5mbyA9PiBpbmZvLmZxbik7XG4gICAgZXhwZWN0KGZxbnMpLnRvQ29udGFpbignQGF3cy1jZGsvdGVzdC5UZXN0Q29uc3RydWN0Jyk7XG4gICAgZXhwZWN0KGZxbnMpLm5vdC50b0NvbnRhaW4oJ0Bhd3MtY2RrL3Rlc3QuVGVzdFN0YWNrSW5zaWRlU3RhY2snKTtcbiAgICBleHBlY3QoZnFucykubm90LnRvQ29udGFpbignQGF3cy1jZGsvdGVzdC5UZXN0TmVzdGVkU3RhY2tJbnNpZGVTdGFjaycpO1xuICAgIGV4cGVjdChmcW5zKS5ub3QudG9Db250YWluKCdAYXdzLWNkay90ZXN0LlRlc3RTdGFnZUluc2lkZVN0YWNrJyk7XG4gIH0pO1xufSk7XG5cbmNsYXNzIFRlc3RDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAvLyBAdHMtaWdub3JlXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFtKU0lJX1JVTlRJTUVfU1lNQk9MXSA9IHsgZnFuOiAnQGF3cy1jZGsvdGVzdC5UZXN0Q29uc3RydWN0JywgdmVyc2lvbjogbG9jYWxDZGtWZXJzaW9uKCkgfVxufVxuXG4vKipcbiAqIFRoZSBleGFjdCB2YWx1ZXMgd2UgZXhwZWN0IGZyb20gdGVzdGluZyBhZ2FpbnN0IHZlcnNpb24gbnVtYmVycyBpbiB0aGlzIHN1aXRlIGRlcGVuZCBvbiB3aGV0aGVyIHdlJ3JlIHJ1bm5pbmdcbiAqIG9uIGEgZGV2ZWxvcG1lbnQgb3IgcmVsZWFzZSBicmFuY2guIFJldHVybnMgdGhlIGxvY2FsIHBhY2thZ2UuanNvbiB2ZXJzaW9uLCB3aGljaCB3aWxsIGJlICcwLjAuMCcgdW5sZXNzIHdlJ3JlXG4gKiBvbiBhIHJlbGVhc2UgYnJhbmNoLCBpbiB3aGljaCBjYXNlIGl0IHNob3VsZCBiZSB0aGUgcmVhbCB2ZXJzaW9uIG51bWJlcnMgKGUuZy4sIDEuOTEuMCkuXG4gKi9cbmZ1bmN0aW9uIGxvY2FsQ2RrVmVyc2lvbigpOiBzdHJpbmcge1xuICBpZiAoIV9jZGtWZXJzaW9uKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcbiAgICBfY2RrVmVyc2lvbiA9IHJlcXVpcmUocGF0aC5qb2luKCcuLicsICdwYWNrYWdlLmpzb24nKSkudmVyc2lvbjtcbiAgICBpZiAoIV9jZGtWZXJzaW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBkZXRlcm1pbmUgQ0RLIHZlcnNpb24nKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIF9jZGtWZXJzaW9uO1xufVxuIl19