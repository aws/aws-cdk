"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const ssm = require("@aws-cdk/aws-ssm");
const cfnspec_1 = require("@aws-cdk/cfnspec");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const lambda = require("../lib");
const function_hash_1 = require("../lib/function-hash");
describe('function hash', () => {
    describe('trimFromStart', () => {
        test('trim not needed', () => {
            expect(function_hash_1.trimFromStart('foo', 100)).toEqual('foo');
            expect(function_hash_1.trimFromStart('foo', 3)).toEqual('foo');
            expect(function_hash_1.trimFromStart('', 3)).toEqual('');
        });
        test('trim required', () => {
            expect(function_hash_1.trimFromStart('hello', 3)).toEqual('llo');
            expect(function_hash_1.trimFromStart('hello', 4)).toEqual('ello');
            expect(function_hash_1.trimFromStart('hello', 1)).toEqual('o');
        });
    });
    describe('calcHash', () => {
        test('same configuration and code yields the same hash', () => {
            const app = new core_1.App({
                context: {
                    [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
                },
            });
            const stack1 = new core_1.Stack(app, 'Stack1');
            const fn1 = new lambda.Function(stack1, 'MyFunction1', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
                handler: 'index.handler',
            });
            const stack2 = new core_1.Stack(app, 'Stack2');
            const fn2 = new lambda.Function(stack2, 'MyFunction1', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
                handler: 'index.handler',
            });
            expect(function_hash_1.calculateFunctionHash(fn1)).toEqual(function_hash_1.calculateFunctionHash(fn2));
            expect(function_hash_1.calculateFunctionHash(fn1)).toEqual('74ee309e3752199288e6d64d385b52c4');
        });
    });
    test('code impacts hash', () => {
        const app = new core_1.App({
            context: {
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const stack1 = new core_1.Stack(app);
        const fn1 = new lambda.Function(stack1, 'MyFunction1', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
            handler: 'index.handler',
        });
        expect(function_hash_1.calculateFunctionHash(fn1)).not.toEqual('74ee309e3752199288e6d64d385b52c4');
        expect(function_hash_1.calculateFunctionHash(fn1)).toEqual('7d4cd781bf430bcc2495ccefff4c34dd');
    });
    test('environment variables impact hash', () => {
        const app = new core_1.App({
            context: {
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const stack1 = new core_1.Stack(app, 'Stack1');
        const fn1 = new lambda.Function(stack1, 'MyFunction', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
            handler: 'index.handler',
            environment: {
                Foo: 'bar',
            },
        });
        const stack2 = new core_1.Stack(app);
        const fn2 = new lambda.Function(stack2, 'MyFunction', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
            handler: 'index.handler',
            environment: {
                Foo: 'beer',
            },
        });
        expect(function_hash_1.calculateFunctionHash(fn1)).toEqual('4f21733bb4695a0e2e45a9090cd46a49');
        expect(function_hash_1.calculateFunctionHash(fn2)).toEqual('0517a96b1ee246651cb9568686babdf2');
    });
    test('runtime impacts hash', () => {
        const app = new core_1.App({
            context: {
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const stack1 = new core_1.Stack(app, 'Stack1');
        const fn1 = new lambda.Function(stack1, 'MyFunction', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
            handler: 'index.handler',
            environment: {
                Foo: 'bar',
            },
        });
        const stack2 = new core_1.Stack(app);
        const fn2 = new lambda.Function(stack2, 'MyFunction', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
            handler: 'index.handler',
            environment: {
                Foo: 'beer',
            },
        });
        expect(function_hash_1.calculateFunctionHash(fn1)).toEqual('4f21733bb4695a0e2e45a9090cd46a49');
        expect(function_hash_1.calculateFunctionHash(fn2)).toEqual('0517a96b1ee246651cb9568686babdf2');
    });
    test('inline code change impacts the hash', () => {
        const stack1 = new core_1.Stack();
        const fn1 = new lambda.Function(stack1, 'MyFunction', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('foo'),
            handler: 'index.handler',
        });
        const stack2 = new core_1.Stack();
        const fn2 = new lambda.Function(stack2, 'MyFunction', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('foo bar'),
            handler: 'index.handler',
        });
        expect(function_hash_1.calculateFunctionHash(fn1)).toEqual('2e4e06d52af2bb609d8c23243d665966');
        expect(function_hash_1.calculateFunctionHash(fn2)).toEqual('aca1fae7e25d53a19c5ee159dcb56b94');
    });
    describe('lambda layers', () => {
        let stack1;
        let layer1;
        let layer2;
        beforeAll(() => {
            stack1 = new core_1.Stack();
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
            const stack2 = new core_1.Stack();
            const fn1 = new lambda.Function(stack2, 'MyFunction', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromInline('foo'),
                handler: 'index.handler',
                layers: [layer1],
            });
            const stack3 = new core_1.Stack();
            const fn2 = new lambda.Function(stack3, 'MyFunction', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromInline('foo'),
                handler: 'index.handler',
                layers: [layer1],
            });
            expect(function_hash_1.calculateFunctionHash(fn1)).toEqual(function_hash_1.calculateFunctionHash(fn2));
            expect(function_hash_1.calculateFunctionHash(fn1)).toEqual('81483a72d55290ca24ce30ba6ee4a412');
        });
        test('different layers impacts hash', () => {
            const stack2 = new core_1.Stack();
            const fn1 = new lambda.Function(stack2, 'MyFunction', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromInline('foo'),
                handler: 'index.handler',
                layers: [layer1],
            });
            const stack3 = new core_1.Stack();
            const fn2 = new lambda.Function(stack3, 'MyFunction', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromInline('foo'),
                handler: 'index.handler',
                layers: [layer2],
            });
            expect(function_hash_1.calculateFunctionHash(fn1)).toEqual('81483a72d55290ca24ce30ba6ee4a412');
            expect(function_hash_1.calculateFunctionHash(fn2)).toEqual('13baa4a05a4e78d538c4870e28576b3a');
        });
        describe('impact of lambda layer order on hash', () => {
            test('without feature flag, preserve old behavior to avoid unnecessary invalidation of templates', () => {
                const stack2 = new core_1.Stack();
                const fn1 = new lambda.Function(stack2, 'MyFunction', {
                    runtime: lambda.Runtime.NODEJS_14_X,
                    code: lambda.Code.fromInline('foo'),
                    handler: 'index.handler',
                    layers: [layer1, layer2],
                });
                const stack3 = new core_1.Stack();
                const fn2 = new lambda.Function(stack3, 'MyFunction', {
                    runtime: lambda.Runtime.NODEJS_14_X,
                    code: lambda.Code.fromInline('foo'),
                    handler: 'index.handler',
                    layers: [layer2, layer1],
                });
                expect(function_hash_1.calculateFunctionHash(fn1)).toEqual('fcdd8253b1018b5fa0114670552c43ab');
                expect(function_hash_1.calculateFunctionHash(fn2)).toEqual('6ee79d94895b045cfc9e7e37653c07e9');
            });
            test('with feature flag, we sort layers so order is consistent', () => {
                const app = new core_1.App({ context: { [cxapi.LAMBDA_RECOGNIZE_LAYER_VERSION]: true } });
                const stack2 = new core_1.Stack(app, 'stack2');
                const fn1 = new lambda.Function(stack2, 'MyFunction', {
                    runtime: lambda.Runtime.NODEJS_14_X,
                    code: lambda.Code.fromInline('foo'),
                    handler: 'index.handler',
                    layers: [layer1, layer2],
                });
                const stack3 = new core_1.Stack(app, 'stack3');
                const fn2 = new lambda.Function(stack3, 'MyFunction', {
                    runtime: lambda.Runtime.NODEJS_14_X,
                    code: lambda.Code.fromInline('foo'),
                    handler: 'index.handler',
                    layers: [layer2, layer1],
                });
                expect(function_hash_1.calculateFunctionHash(fn1)).toEqual(function_hash_1.calculateFunctionHash(fn2));
            });
        });
        test('with feature flag, imported lambda layers can be distinguished', () => {
            const app = new core_1.App({ context: { [cxapi.LAMBDA_RECOGNIZE_LAYER_VERSION]: true } });
            const stack2 = new core_1.Stack(app, 'stack2');
            const importedLayer1 = lambda.LayerVersion.fromLayerVersionArn(stack2, 'imported-layer', 'arn:aws:lambda:<region>:<account>:layer:<layer-name>:<version1>');
            const fn1 = new lambda.Function(stack2, 'MyFunction', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromInline('foo'),
                handler: 'index.handler',
                layers: [importedLayer1],
            });
            const stack3 = new core_1.Stack(app, 'stack3');
            const importedLayer2 = lambda.LayerVersion.fromLayerVersionArn(stack3, 'imported-layer', 'arn:aws:lambda:<region>:<account>:layer:<layer-name>:<version2>');
            const fn2 = new lambda.Function(stack3, 'MyFunction', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromInline('foo'),
                handler: 'index.handler',
                layers: [importedLayer2],
            });
            expect(function_hash_1.calculateFunctionHash(fn1)).not.toEqual(function_hash_1.calculateFunctionHash(fn2));
        });
    });
    describe('impact of env variables order on hash', () => {
        test('without "currentVersion", we preserve old behavior to avoid unnecessary invalidation of templates', () => {
            const stack1 = new core_1.Stack();
            const fn1 = new lambda.Function(stack1, 'MyFunction', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
                handler: 'index.handler',
                environment: {
                    Foo: 'bar',
                    Bar: 'foo',
                },
            });
            const stack2 = new core_1.Stack();
            const fn2 = new lambda.Function(stack2, 'MyFunction', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
                handler: 'index.handler',
                environment: {
                    Bar: 'foo',
                    Foo: 'bar',
                },
            });
            expect(function_hash_1.calculateFunctionHash(fn1)).not.toEqual(function_hash_1.calculateFunctionHash(fn2));
        });
        test('with "currentVersion", we sort env keys so order is consistent', () => {
            const stack1 = new core_1.Stack();
            const fn1 = new lambda.Function(stack1, 'MyFunction', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
                handler: 'index.handler',
                environment: {
                    Foo: 'bar',
                    Bar: 'foo',
                },
            });
            new core_1.CfnOutput(stack1, 'VersionArn', { value: fn1.currentVersion.functionArn });
            const stack2 = new core_1.Stack();
            const fn2 = new lambda.Function(stack2, 'MyFunction', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
                handler: 'index.handler',
                environment: {
                    Bar: 'foo',
                    Foo: 'bar',
                },
            });
            new core_1.CfnOutput(stack2, 'VersionArn', { value: fn2.currentVersion.functionArn });
            expect(function_hash_1.calculateFunctionHash(fn1)).toEqual(function_hash_1.calculateFunctionHash(fn2));
        });
    });
    describe('corrected function hash', () => {
        let app;
        beforeEach(() => {
            app = new core_1.App({
                context: {
                    [cxapi.LAMBDA_RECOGNIZE_VERSION_PROPS]: true,
                    [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
                },
            });
        });
        test('DependsOn does not impact function hash', () => {
            const stack1 = new core_1.Stack(app, 'Stack1');
            const fn1 = new lambda.Function(stack1, 'MyFunction1', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
                handler: 'index.handler',
            });
            const stack2 = new core_1.Stack(app, 'Stack2');
            const fn2 = new lambda.Function(stack2, 'MyFunction1', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
                handler: 'index.handler',
            });
            const res = new core_1.CfnResource(stack2, 'MyResource', {
                type: 'AWS::Foo::Bar',
                properties: {
                    Name: 'Value',
                },
            });
            fn2.node.addDependency(res);
            expect(function_hash_1.calculateFunctionHash(fn1)).toEqual('74ee309e3752199288e6d64d385b52c4');
            expect(function_hash_1.calculateFunctionHash(fn1)).toEqual(function_hash_1.calculateFunctionHash(fn2));
        });
        test('properties not locked to the version do not impact function hash', () => {
            const stack1 = new core_1.Stack(app, 'Stack1');
            const fn1 = new lambda.Function(stack1, 'MyFunction', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
                handler: 'index.handler',
            });
            const stack2 = new core_1.Stack(app, 'Stack2');
            const fn2 = new lambda.Function(stack2, 'MyFunction', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
                handler: 'index.handler',
                reservedConcurrentExecutions: 5,
            });
            // expect(calculateFunctionHash(fn1)).toEqual('b0d8729d597bdde2d79312fbf619c974');
            expect(function_hash_1.calculateFunctionHash(fn1)).toEqual(function_hash_1.calculateFunctionHash(fn2));
        });
        test('unclassified property throws an error', () => {
            const stack = new core_1.Stack(app);
            const fn1 = new lambda.Function(stack, 'MyFunction1', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
                handler: 'index.handler',
            });
            fn1.node.defaultChild.addPropertyOverride('UnclassifiedProp', 'Value');
            expect(() => function_hash_1.calculateFunctionHash(fn1)).toThrow(/properties are not recognized/);
        });
        test('manual classification as version locked', () => {
            const stack = new core_1.Stack(app);
            const fn1 = new lambda.Function(stack, 'MyFunction1', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
                handler: 'index.handler',
            });
            const original = function_hash_1.calculateFunctionHash(fn1);
            lambda.Function.classifyVersionProperty('UnclassifiedProp', true);
            fn1.node.defaultChild.addPropertyOverride('UnclassifiedProp', 'Value');
            expect(function_hash_1.calculateFunctionHash(fn1)).not.toEqual(original);
        });
        test('manual classification as not version locked', () => {
            const stack = new core_1.Stack(app);
            const fn1 = new lambda.Function(stack, 'MyFunction1', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
                handler: 'index.handler',
            });
            const original = function_hash_1.calculateFunctionHash(fn1);
            lambda.Function.classifyVersionProperty('UnclassifiedProp', false);
            fn1.node.defaultChild.addPropertyOverride('UnclassifiedProp', 'Value');
            expect(function_hash_1.calculateFunctionHash(fn1)).toEqual(original);
        });
        test('all CFN properties are classified', () => {
            const spec = cfnspec_1.resourceSpecification('AWS::Lambda::Function');
            expect(spec.Properties).toBeDefined();
            const expected = Object.keys(spec.Properties).sort();
            const actual = Object.keys(function_hash_1.VERSION_LOCKED).sort();
            expect(actual).toEqual(expected);
        });
    });
});
test('imported layer hashes are consistent', () => {
    // GIVEN
    const app = new core_1.App({
        context: {
            '@aws-cdk/aws-lambda:recognizeLayerVersion': true,
        },
    });
    // WHEN
    const stack1 = new core_1.Stack(app, 'Stack1');
    const param1 = ssm.StringParameter.fromStringParameterName(stack1, 'Param', 'ParamName');
    const fn1 = new lambda.Function(stack1, 'Fn', {
        code: lambda.Code.fromInline('asdf'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        layers: [
            lambda.LayerVersion.fromLayerVersionArn(stack1, 'MyLayer', `arn:aws:lambda:${stack1.region}:<AccountID>:layer:IndexCFN:${param1.stringValue}`),
        ],
    });
    fn1.currentVersion; // Force creation of version
    const stack2 = new core_1.Stack(app, 'Stack2');
    const param2 = ssm.StringParameter.fromStringParameterName(stack2, 'Param', 'ParamName');
    const fn2 = new lambda.Function(stack2, 'Fn', {
        code: lambda.Code.fromInline('asdf'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        layers: [
            lambda.LayerVersion.fromLayerVersionArn(stack2, 'MyLayer', `arn:aws:lambda:${stack1.region}:<AccountID>:layer:IndexCFN:${param2.stringValue}`),
        ],
    });
    fn2.currentVersion; // Force creation of version
    // THEN
    const template1 = assertions_1.Template.fromStack(stack1);
    const template2 = assertions_1.Template.fromStack(stack2);
    expect(template1.toJSON()).toEqual(template2.toJSON());
});
test.each([false, true])('can invalidate version hash using invalidateVersionBasedOn: %p', (doIt) => {
    // GIVEN
    const app = new core_1.App();
    // WHEN
    const stack1 = new core_1.Stack(app, 'Stack1');
    const fn1 = new lambda.Function(stack1, 'Fn', {
        code: lambda.Code.fromInline('asdf'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
    });
    if (doIt) {
        fn1.invalidateVersionBasedOn('abc');
    }
    fn1.currentVersion; // Force creation of version
    const stack2 = new core_1.Stack(app, 'Stack2');
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
    const template1 = assertions_1.Template.fromStack(stack1);
    const template2 = assertions_1.Template.fromStack(stack2);
    if (doIt) {
        expect(template1.toJSON()).not.toEqual(template2.toJSON());
    }
    else {
        expect(template1.toJSON()).toEqual(template2.toJSON());
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24taGFzaC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZnVuY3Rpb24taGFzaC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLG9EQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMsOENBQXlEO0FBQ3pELHdDQUFtRTtBQUNuRSx5Q0FBeUM7QUFDekMsaUNBQWlDO0FBQ2pDLHdEQUE0RjtBQUU1RixRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtJQUM3QixRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUU3QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1lBQzNCLE1BQU0sQ0FBQyw2QkFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqRCxNQUFNLENBQUMsNkJBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0MsTUFBTSxDQUFDLDZCQUFhLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7WUFDekIsTUFBTSxDQUFDLDZCQUFhLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyw2QkFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsRCxNQUFNLENBQUMsNkJBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDLENB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QUFFLENBQUMsQ0FBQztLQUM1RDtTQUFNO1FBQ0wsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztLQUN4RDtBQUVILENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnQGF3cy1jZGsvYXdzLXNzbSc7XG5pbXBvcnQgeyByZXNvdXJjZVNwZWNpZmljYXRpb24gfSBmcm9tICdAYXdzLWNkay9jZm5zcGVjJztcbmltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBDZm5SZXNvdXJjZSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IGNhbGN1bGF0ZUZ1bmN0aW9uSGFzaCwgdHJpbUZyb21TdGFydCwgVkVSU0lPTl9MT0NLRUQgfSBmcm9tICcuLi9saWIvZnVuY3Rpb24taGFzaCc7XG5cbmRlc2NyaWJlKCdmdW5jdGlvbiBoYXNoJywgKCkgPT4ge1xuICBkZXNjcmliZSgndHJpbUZyb21TdGFydCcsICgpID0+IHtcblxuICAgIHRlc3QoJ3RyaW0gbm90IG5lZWRlZCcsICgpID0+IHtcbiAgICAgIGV4cGVjdCh0cmltRnJvbVN0YXJ0KCdmb28nLCAxMDApKS50b0VxdWFsKCdmb28nKTtcbiAgICAgIGV4cGVjdCh0cmltRnJvbVN0YXJ0KCdmb28nLCAzKSkudG9FcXVhbCgnZm9vJyk7XG4gICAgICBleHBlY3QodHJpbUZyb21TdGFydCgnJywgMykpLnRvRXF1YWwoJycpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndHJpbSByZXF1aXJlZCcsICgpID0+IHtcbiAgICAgIGV4cGVjdCh0cmltRnJvbVN0YXJ0KCdoZWxsbycsIDMpKS50b0VxdWFsKCdsbG8nKTtcbiAgICAgIGV4cGVjdCh0cmltRnJvbVN0YXJ0KCdoZWxsbycsIDQpKS50b0VxdWFsKCdlbGxvJyk7XG4gICAgICBleHBlY3QodHJpbUZyb21TdGFydCgnaGVsbG8nLCAxKSkudG9FcXVhbCgnbycpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnY2FsY0hhc2gnLCAoKSA9PiB7XG4gICAgdGVzdCgnc2FtZSBjb25maWd1cmF0aW9uIGFuZCBjb2RlIHlpZWxkcyB0aGUgc2FtZSBoYXNoJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gICAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgICBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnKTtcbiAgICAgIGNvbnN0IGZuMSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2sxLCAnTXlGdW5jdGlvbjEnLCB7XG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2hhbmRsZXIuemlwJykpLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuICAgICAgY29uc3QgZm4yID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazIsICdNeUZ1bmN0aW9uMScsIHtcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnaGFuZGxlci56aXAnKSksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMSkpLnRvRXF1YWwoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMikpO1xuICAgICAgZXhwZWN0KGNhbGN1bGF0ZUZ1bmN0aW9uSGFzaChmbjEpKS50b0VxdWFsKCc3NGVlMzA5ZTM3NTIxOTkyODhlNmQ2NGQzODViNTJjNCcpO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjb2RlIGltcGFjdHMgaGFzaCcsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwKTtcbiAgICBjb25zdCBmbjEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrMSwgJ015RnVuY3Rpb24xJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LWxhbWJkYS1oYW5kbGVyJykpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGNhbGN1bGF0ZUZ1bmN0aW9uSGFzaChmbjEpKS5ub3QudG9FcXVhbCgnNzRlZTMwOWUzNzUyMTk5Mjg4ZTZkNjRkMzg1YjUyYzQnKTtcbiAgICBleHBlY3QoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMSkpLnRvRXF1YWwoJzdkNGNkNzgxYmY0MzBiY2MyNDk1Y2NlZmZmNGMzNGRkJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Vudmlyb25tZW50IHZhcmlhYmxlcyBpbXBhY3QgaGFzaCcsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgY29uc3QgZm4xID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazEsICdNeUZ1bmN0aW9uJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LWxhbWJkYS1oYW5kbGVyJykpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgRm9vOiAnYmFyJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwKTtcbiAgICBjb25zdCBmbjIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrMiwgJ015RnVuY3Rpb24nLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktbGFtYmRhLWhhbmRsZXInKSksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBGb286ICdiZWVyJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMSkpLnRvRXF1YWwoJzRmMjE3MzNiYjQ2OTVhMGUyZTQ1YTkwOTBjZDQ2YTQ5Jyk7XG4gICAgZXhwZWN0KGNhbGN1bGF0ZUZ1bmN0aW9uSGFzaChmbjIpKS50b0VxdWFsKCcwNTE3YTk2YjFlZTI0NjY1MWNiOTU2ODY4NmJhYmRmMicpO1xuICB9KTtcblxuICB0ZXN0KCdydW50aW1lIGltcGFjdHMgaGFzaCcsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgY29uc3QgZm4xID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazEsICdNeUZ1bmN0aW9uJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LWxhbWJkYS1oYW5kbGVyJykpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgRm9vOiAnYmFyJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwKTtcbiAgICBjb25zdCBmbjIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrMiwgJ015RnVuY3Rpb24nLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktbGFtYmRhLWhhbmRsZXInKSksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBGb286ICdiZWVyJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMSkpLnRvRXF1YWwoJzRmMjE3MzNiYjQ2OTVhMGUyZTQ1YTkwOTBjZDQ2YTQ5Jyk7XG4gICAgZXhwZWN0KGNhbGN1bGF0ZUZ1bmN0aW9uSGFzaChmbjIpKS50b0VxdWFsKCcwNTE3YTk2YjFlZTI0NjY1MWNiOTU2ODY4NmJhYmRmMicpO1xuICB9KTtcblxuICB0ZXN0KCdpbmxpbmUgY29kZSBjaGFuZ2UgaW1wYWN0cyB0aGUgaGFzaCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBmbjEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrMSwgJ015RnVuY3Rpb24nLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgZm4yID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazIsICdNeUZ1bmN0aW9uJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdmb28gYmFyJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMSkpLnRvRXF1YWwoJzJlNGUwNmQ1MmFmMmJiNjA5ZDhjMjMyNDNkNjY1OTY2Jyk7XG4gICAgZXhwZWN0KGNhbGN1bGF0ZUZ1bmN0aW9uSGFzaChmbjIpKS50b0VxdWFsKCdhY2ExZmFlN2UyNWQ1M2ExOWM1ZWUxNTlkY2I1NmI5NCcpO1xuICB9KTtcblxuICBkZXNjcmliZSgnbGFtYmRhIGxheWVycycsICgpID0+IHtcbiAgICBsZXQgc3RhY2sxOiBTdGFjaztcbiAgICBsZXQgbGF5ZXIxOiBsYW1iZGEuTGF5ZXJWZXJzaW9uO1xuICAgIGxldCBsYXllcjI6IGxhbWJkYS5MYXllclZlcnNpb247XG4gICAgYmVmb3JlQWxsKCgpID0+IHtcbiAgICAgIHN0YWNrMSA9IG5ldyBTdGFjaygpO1xuICAgICAgbGF5ZXIxID0gbmV3IGxhbWJkYS5MYXllclZlcnNpb24oc3RhY2sxLCAnTXlMYXllcicsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdsYXllci1jb2RlJykpLFxuICAgICAgICBjb21wYXRpYmxlUnVudGltZXM6IFtsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWF0sXG4gICAgICAgIGxpY2Vuc2U6ICdBcGFjaGUtMi4wJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdBIGxheWVyIHRvIHRlc3QgdGhlIEwyIGNvbnN0cnVjdCcsXG4gICAgICB9KTtcbiAgICAgIGxheWVyMiA9IG5ldyBsYW1iZGEuTGF5ZXJWZXJzaW9uKHN0YWNrMSwgJ015TGF5ZXIyJywge1xuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2xheWVyLWNvZGUnKSksXG4gICAgICAgIGNvbXBhdGlibGVSdW50aW1lczogW2xhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YXSxcbiAgICAgICAgbGljZW5zZTogJ0FwYWNoZS0yLjAnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0EgbGF5ZXIgdG8gdGVzdCB0aGUgTDIgY29uc3RydWN0JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc2FtZSBjb25maWd1cmF0aW9uIHlpZWxkcyB0aGUgc2FtZSBoYXNoJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBmbjEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrMiwgJ015RnVuY3Rpb24nLCB7XG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdmb28nKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBsYXllcnM6IFtsYXllcjFdLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHN0YWNrMyA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgZm4yID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazMsICdNeUZ1bmN0aW9uJywge1xuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgbGF5ZXJzOiBbbGF5ZXIxXSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMSkpLnRvRXF1YWwoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMikpO1xuICAgICAgZXhwZWN0KGNhbGN1bGF0ZUZ1bmN0aW9uSGFzaChmbjEpKS50b0VxdWFsKCc4MTQ4M2E3MmQ1NTI5MGNhMjRjZTMwYmE2ZWU0YTQxMicpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZGlmZmVyZW50IGxheWVycyBpbXBhY3RzIGhhc2gnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IGZuMSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2syLCAnTXlGdW5jdGlvbicsIHtcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIGxheWVyczogW2xheWVyMV0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc3RhY2szID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBmbjIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrMywgJ015RnVuY3Rpb24nLCB7XG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdmb28nKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBsYXllcnM6IFtsYXllcjJdLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChjYWxjdWxhdGVGdW5jdGlvbkhhc2goZm4xKSkudG9FcXVhbCgnODE0ODNhNzJkNTUyOTBjYTI0Y2UzMGJhNmVlNGE0MTInKTtcbiAgICAgIGV4cGVjdChjYWxjdWxhdGVGdW5jdGlvbkhhc2goZm4yKSkudG9FcXVhbCgnMTNiYWE0YTA1YTRlNzhkNTM4YzQ4NzBlMjg1NzZiM2EnKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpbXBhY3Qgb2YgbGFtYmRhIGxheWVyIG9yZGVyIG9uIGhhc2gnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCd3aXRob3V0IGZlYXR1cmUgZmxhZywgcHJlc2VydmUgb2xkIGJlaGF2aW9yIHRvIGF2b2lkIHVubmVjZXNzYXJ5IGludmFsaWRhdGlvbiBvZiB0ZW1wbGF0ZXMnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjaygpO1xuICAgICAgICBjb25zdCBmbjEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrMiwgJ015RnVuY3Rpb24nLCB7XG4gICAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICAgIGxheWVyczogW2xheWVyMSwgbGF5ZXIyXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc3RhY2szID0gbmV3IFN0YWNrKCk7XG4gICAgICAgIGNvbnN0IGZuMiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2szLCAnTXlGdW5jdGlvbicsIHtcbiAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdmb28nKSxcbiAgICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgICAgbGF5ZXJzOiBbbGF5ZXIyLCBsYXllcjFdLFxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3QoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMSkpLnRvRXF1YWwoJ2ZjZGQ4MjUzYjEwMThiNWZhMDExNDY3MDU1MmM0M2FiJyk7XG4gICAgICAgIGV4cGVjdChjYWxjdWxhdGVGdW5jdGlvbkhhc2goZm4yKSkudG9FcXVhbCgnNmVlNzlkOTQ4OTViMDQ1Y2ZjOWU3ZTM3NjUzYzA3ZTknKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCd3aXRoIGZlYXR1cmUgZmxhZywgd2Ugc29ydCBsYXllcnMgc28gb3JkZXIgaXMgY29uc2lzdGVudCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLkxBTUJEQV9SRUNPR05JWkVfTEFZRVJfVkVSU0lPTl06IHRydWUgfSB9KTtcblxuICAgICAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2syJyk7XG4gICAgICAgIGNvbnN0IGZuMSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2syLCAnTXlGdW5jdGlvbicsIHtcbiAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdmb28nKSxcbiAgICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgICAgbGF5ZXJzOiBbbGF5ZXIxLCBsYXllcjJdLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBzdGFjazMgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2szJyk7XG4gICAgICAgIGNvbnN0IGZuMiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2szLCAnTXlGdW5jdGlvbicsIHtcbiAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdmb28nKSxcbiAgICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgICAgbGF5ZXJzOiBbbGF5ZXIyLCBsYXllcjFdLFxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3QoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMSkpLnRvRXF1YWwoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMikpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIGZlYXR1cmUgZmxhZywgaW1wb3J0ZWQgbGFtYmRhIGxheWVycyBjYW4gYmUgZGlzdGluZ3Vpc2hlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5MQU1CREFfUkVDT0dOSVpFX0xBWUVSX1ZFUlNJT05dOiB0cnVlIH0gfSk7XG5cbiAgICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdzdGFjazInKTtcbiAgICAgIGNvbnN0IGltcG9ydGVkTGF5ZXIxID0gbGFtYmRhLkxheWVyVmVyc2lvbi5mcm9tTGF5ZXJWZXJzaW9uQXJuKHN0YWNrMiwgJ2ltcG9ydGVkLWxheWVyJywgJ2Fybjphd3M6bGFtYmRhOjxyZWdpb24+OjxhY2NvdW50PjpsYXllcjo8bGF5ZXItbmFtZT46PHZlcnNpb24xPicpO1xuICAgICAgY29uc3QgZm4xID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazIsICdNeUZ1bmN0aW9uJywge1xuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgbGF5ZXJzOiBbaW1wb3J0ZWRMYXllcjFdLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHN0YWNrMyA9IG5ldyBTdGFjayhhcHAsICdzdGFjazMnKTtcbiAgICAgIGNvbnN0IGltcG9ydGVkTGF5ZXIyID0gbGFtYmRhLkxheWVyVmVyc2lvbi5mcm9tTGF5ZXJWZXJzaW9uQXJuKHN0YWNrMywgJ2ltcG9ydGVkLWxheWVyJywgJ2Fybjphd3M6bGFtYmRhOjxyZWdpb24+OjxhY2NvdW50PjpsYXllcjo8bGF5ZXItbmFtZT46PHZlcnNpb24yPicpO1xuICAgICAgY29uc3QgZm4yID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazMsICdNeUZ1bmN0aW9uJywge1xuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgbGF5ZXJzOiBbaW1wb3J0ZWRMYXllcjJdLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChjYWxjdWxhdGVGdW5jdGlvbkhhc2goZm4xKSkubm90LnRvRXF1YWwoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMikpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaW1wYWN0IG9mIGVudiB2YXJpYWJsZXMgb3JkZXIgb24gaGFzaCcsICgpID0+IHtcbiAgICB0ZXN0KCd3aXRob3V0IFwiY3VycmVudFZlcnNpb25cIiwgd2UgcHJlc2VydmUgb2xkIGJlaGF2aW9yIHRvIGF2b2lkIHVubmVjZXNzYXJ5IGludmFsaWRhdGlvbiBvZiB0ZW1wbGF0ZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IGZuMSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2sxLCAnTXlGdW5jdGlvbicsIHtcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktbGFtYmRhLWhhbmRsZXInKSksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBGb286ICdiYXInLFxuICAgICAgICAgIEJhcjogJ2ZvbycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBmbjIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrMiwgJ015RnVuY3Rpb24nLCB7XG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LWxhbWJkYS1oYW5kbGVyJykpLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgQmFyOiAnZm9vJyxcbiAgICAgICAgICBGb286ICdiYXInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChjYWxjdWxhdGVGdW5jdGlvbkhhc2goZm4xKSkubm90LnRvRXF1YWwoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMikpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBcImN1cnJlbnRWZXJzaW9uXCIsIHdlIHNvcnQgZW52IGtleXMgc28gb3JkZXIgaXMgY29uc2lzdGVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgZm4xID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazEsICdNeUZ1bmN0aW9uJywge1xuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS1sYW1iZGEtaGFuZGxlcicpKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIEZvbzogJ2JhcicsXG4gICAgICAgICAgQmFyOiAnZm9vJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrMSwgJ1ZlcnNpb25Bcm4nLCB7IHZhbHVlOiBmbjEuY3VycmVudFZlcnNpb24uZnVuY3Rpb25Bcm4gfSk7XG5cbiAgICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgZm4yID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazIsICdNeUZ1bmN0aW9uJywge1xuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS1sYW1iZGEtaGFuZGxlcicpKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIEJhcjogJ2ZvbycsXG4gICAgICAgICAgRm9vOiAnYmFyJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrMiwgJ1ZlcnNpb25Bcm4nLCB7IHZhbHVlOiBmbjIuY3VycmVudFZlcnNpb24uZnVuY3Rpb25Bcm4gfSk7XG5cbiAgICAgIGV4cGVjdChjYWxjdWxhdGVGdW5jdGlvbkhhc2goZm4xKSkudG9FcXVhbChjYWxjdWxhdGVGdW5jdGlvbkhhc2goZm4yKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjb3JyZWN0ZWQgZnVuY3Rpb24gaGFzaCcsICgpID0+IHtcbiAgICBsZXQgYXBwOiBBcHA7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBhcHAgPSBuZXcgQXBwKHtcbiAgICAgICAgY29udGV4dDoge1xuICAgICAgICAgIFtjeGFwaS5MQU1CREFfUkVDT0dOSVpFX1ZFUlNJT05fUFJPUFNdOiB0cnVlLFxuICAgICAgICAgIFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnRGVwZW5kc09uIGRvZXMgbm90IGltcGFjdCBmdW5jdGlvbiBoYXNoJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgICAgY29uc3QgZm4xID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazEsICdNeUZ1bmN0aW9uMScsIHtcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnaGFuZGxlci56aXAnKSksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG4gICAgICBjb25zdCBmbjIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrMiwgJ015RnVuY3Rpb24xJywge1xuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdoYW5kbGVyLnppcCcpKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgfSk7XG4gICAgICBjb25zdCByZXMgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnTXlSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ0FXUzo6Rm9vOjpCYXInLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgTmFtZTogJ1ZhbHVlJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgZm4yLm5vZGUuYWRkRGVwZW5kZW5jeShyZXMpO1xuXG4gICAgICBleHBlY3QoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMSkpLnRvRXF1YWwoJzc0ZWUzMDllMzc1MjE5OTI4OGU2ZDY0ZDM4NWI1MmM0Jyk7XG4gICAgICBleHBlY3QoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMSkpLnRvRXF1YWwoY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMikpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncHJvcGVydGllcyBub3QgbG9ja2VkIHRvIHRoZSB2ZXJzaW9uIGRvIG5vdCBpbXBhY3QgZnVuY3Rpb24gaGFzaCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnKTtcbiAgICAgIGNvbnN0IGZuMSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2sxLCAnTXlGdW5jdGlvbicsIHtcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnaGFuZGxlci56aXAnKSksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG4gICAgICBjb25zdCBmbjIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrMiwgJ015RnVuY3Rpb24nLCB7XG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2hhbmRsZXIuemlwJykpLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG5cbiAgICAgICAgcmVzZXJ2ZWRDb25jdXJyZW50RXhlY3V0aW9uczogNSwgLy8gcHJvcGVydHkgbm90IGxvY2tlZCB0byB0aGUgdmVyc2lvblxuICAgICAgfSk7XG5cbiAgICAgIC8vIGV4cGVjdChjYWxjdWxhdGVGdW5jdGlvbkhhc2goZm4xKSkudG9FcXVhbCgnYjBkODcyOWQ1OTdiZGRlMmQ3OTMxMmZiZjYxOWM5NzQnKTtcbiAgICAgIGV4cGVjdChjYWxjdWxhdGVGdW5jdGlvbkhhc2goZm4xKSkudG9FcXVhbChjYWxjdWxhdGVGdW5jdGlvbkhhc2goZm4yKSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd1bmNsYXNzaWZpZWQgcHJvcGVydHkgdGhyb3dzIGFuIGVycm9yJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwKTtcbiAgICAgIGNvbnN0IGZuMSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmN0aW9uMScsIHtcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnaGFuZGxlci56aXAnKSksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIH0pO1xuICAgICAgKGZuMS5ub2RlLmRlZmF1bHRDaGlsZCBhcyBDZm5SZXNvdXJjZSkuYWRkUHJvcGVydHlPdmVycmlkZSgnVW5jbGFzc2lmaWVkUHJvcCcsICdWYWx1ZScpO1xuXG4gICAgICBleHBlY3QoKCkgPT4gY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMSkpLnRvVGhyb3coL3Byb3BlcnRpZXMgYXJlIG5vdCByZWNvZ25pemVkLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdtYW51YWwgY2xhc3NpZmljYXRpb24gYXMgdmVyc2lvbiBsb2NrZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHApO1xuICAgICAgY29uc3QgZm4xID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015RnVuY3Rpb24xJywge1xuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdoYW5kbGVyLnppcCcpKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG9yaWdpbmFsID0gY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuMSk7XG4gICAgICBsYW1iZGEuRnVuY3Rpb24uY2xhc3NpZnlWZXJzaW9uUHJvcGVydHkoJ1VuY2xhc3NpZmllZFByb3AnLCB0cnVlKTtcbiAgICAgIChmbjEubm9kZS5kZWZhdWx0Q2hpbGQgYXMgQ2ZuUmVzb3VyY2UpLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ1VuY2xhc3NpZmllZFByb3AnLCAnVmFsdWUnKTtcbiAgICAgIGV4cGVjdChjYWxjdWxhdGVGdW5jdGlvbkhhc2goZm4xKSkubm90LnRvRXF1YWwob3JpZ2luYWwpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWFudWFsIGNsYXNzaWZpY2F0aW9uIGFzIG5vdCB2ZXJzaW9uIGxvY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCk7XG4gICAgICBjb25zdCBmbjEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlGdW5jdGlvbjEnLCB7XG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2hhbmRsZXIuemlwJykpLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgb3JpZ2luYWwgPSBjYWxjdWxhdGVGdW5jdGlvbkhhc2goZm4xKTtcbiAgICAgIGxhbWJkYS5GdW5jdGlvbi5jbGFzc2lmeVZlcnNpb25Qcm9wZXJ0eSgnVW5jbGFzc2lmaWVkUHJvcCcsIGZhbHNlKTtcbiAgICAgIChmbjEubm9kZS5kZWZhdWx0Q2hpbGQgYXMgQ2ZuUmVzb3VyY2UpLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ1VuY2xhc3NpZmllZFByb3AnLCAnVmFsdWUnKTtcbiAgICAgIGV4cGVjdChjYWxjdWxhdGVGdW5jdGlvbkhhc2goZm4xKSkudG9FcXVhbChvcmlnaW5hbCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhbGwgQ0ZOIHByb3BlcnRpZXMgYXJlIGNsYXNzaWZpZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcGVjID0gcmVzb3VyY2VTcGVjaWZpY2F0aW9uKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nKTtcbiAgICAgIGV4cGVjdChzcGVjLlByb3BlcnRpZXMpLnRvQmVEZWZpbmVkKCk7XG4gICAgICBjb25zdCBleHBlY3RlZCA9IE9iamVjdC5rZXlzKHNwZWMuUHJvcGVydGllcyEpLnNvcnQoKTtcbiAgICAgIGNvbnN0IGFjdHVhbCA9IE9iamVjdC5rZXlzKFZFUlNJT05fTE9DS0VEKS5zb3J0KCk7XG4gICAgICBleHBlY3QoYWN0dWFsKS50b0VxdWFsKGV4cGVjdGVkKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxudGVzdCgnaW1wb3J0ZWQgbGF5ZXIgaGFzaGVzIGFyZSBjb25zaXN0ZW50JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICBjb250ZXh0OiB7XG4gICAgICAnQGF3cy1jZGsvYXdzLWxhbWJkYTpyZWNvZ25pemVMYXllclZlcnNpb24nOiB0cnVlLFxuICAgIH0sXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICBjb25zdCBwYXJhbTEgPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TdHJpbmdQYXJhbWV0ZXJOYW1lKHN0YWNrMSwgJ1BhcmFtJywgJ1BhcmFtTmFtZScpO1xuICBjb25zdCBmbjEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrMSwgJ0ZuJywge1xuICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2FzZGYnKSxcbiAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE4X1gsXG4gICAgbGF5ZXJzOiBbXG4gICAgICBsYW1iZGEuTGF5ZXJWZXJzaW9uLmZyb21MYXllclZlcnNpb25Bcm4oc3RhY2sxLCAnTXlMYXllcicsXG4gICAgICAgIGBhcm46YXdzOmxhbWJkYToke3N0YWNrMS5yZWdpb259OjxBY2NvdW50SUQ+OmxheWVyOkluZGV4Q0ZOOiR7cGFyYW0xLnN0cmluZ1ZhbHVlfWApLFxuICAgIF0sXG4gIH0pO1xuICBmbjEuY3VycmVudFZlcnNpb247IC8vIEZvcmNlIGNyZWF0aW9uIG9mIHZlcnNpb25cblxuICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG4gIGNvbnN0IHBhcmFtMiA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlck5hbWUoc3RhY2syLCAnUGFyYW0nLCAnUGFyYW1OYW1lJyk7XG4gIGNvbnN0IGZuMiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2syLCAnRm4nLCB7XG4gICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnYXNkZicpLFxuICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMThfWCxcbiAgICBsYXllcnM6IFtcbiAgICAgIGxhbWJkYS5MYXllclZlcnNpb24uZnJvbUxheWVyVmVyc2lvbkFybihzdGFjazIsICdNeUxheWVyJyxcbiAgICAgICAgYGFybjphd3M6bGFtYmRhOiR7c3RhY2sxLnJlZ2lvbn06PEFjY291bnRJRD46bGF5ZXI6SW5kZXhDRk46JHtwYXJhbTIuc3RyaW5nVmFsdWV9YCksXG4gICAgXSxcbiAgfSk7XG4gIGZuMi5jdXJyZW50VmVyc2lvbjsgLy8gRm9yY2UgY3JlYXRpb24gb2YgdmVyc2lvblxuXG4gIC8vIFRIRU5cbiAgY29uc3QgdGVtcGxhdGUxID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMSk7XG4gIGNvbnN0IHRlbXBsYXRlMiA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazIpO1xuXG4gIGV4cGVjdCh0ZW1wbGF0ZTEudG9KU09OKCkpLnRvRXF1YWwodGVtcGxhdGUyLnRvSlNPTigpKTtcbn0pO1xuXG50ZXN0LmVhY2goW2ZhbHNlLCB0cnVlXSkoJ2NhbiBpbnZhbGlkYXRlIHZlcnNpb24gaGFzaCB1c2luZyBpbnZhbGlkYXRlVmVyc2lvbkJhc2VkT246ICVwJywgKGRvSXQpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gIC8vIFdIRU5cbiAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICBjb25zdCBmbjEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrMSwgJ0ZuJywge1xuICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2FzZGYnKSxcbiAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE4X1gsXG4gIH0pO1xuICBpZiAoZG9JdCkge1xuICAgIGZuMS5pbnZhbGlkYXRlVmVyc2lvbkJhc2VkT24oJ2FiYycpO1xuICB9XG4gIGZuMS5jdXJyZW50VmVyc2lvbjsgLy8gRm9yY2UgY3JlYXRpb24gb2YgdmVyc2lvblxuXG4gIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInKTtcbiAgY29uc3QgZm4yID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazIsICdGbicsIHtcbiAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdhc2RmJyksXG4gICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xOF9YLFxuICB9KTtcbiAgaWYgKGRvSXQpIHtcbiAgICBmbjEuaW52YWxpZGF0ZVZlcnNpb25CYXNlZE9uKCd4eXonKTtcbiAgfVxuICBmbjIuY3VycmVudFZlcnNpb247IC8vIEZvcmNlIGNyZWF0aW9uIG9mIHZlcnNpb25cblxuICAvLyBUSEVOXG4gIGNvbnN0IHRlbXBsYXRlMSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazEpO1xuICBjb25zdCB0ZW1wbGF0ZTIgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKTtcblxuICBpZiAoZG9JdCkge1xuICAgIGV4cGVjdCh0ZW1wbGF0ZTEudG9KU09OKCkpLm5vdC50b0VxdWFsKHRlbXBsYXRlMi50b0pTT04oKSk7XG4gIH0gZWxzZSB7XG4gICAgZXhwZWN0KHRlbXBsYXRlMS50b0pTT04oKSkudG9FcXVhbCh0ZW1wbGF0ZTIudG9KU09OKCkpO1xuICB9XG5cbn0pOyJdfQ==