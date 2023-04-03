"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const evaluate_cfn_1 = require("./evaluate-cfn");
const lib_1 = require("../lib");
const intrinsic_1 = require("../lib/private/intrinsic");
let app;
let stack;
beforeEach(() => {
    app = new lib_1.App();
    stack = new lib_1.Stack(app, 'Stack');
});
test('JSONification of literals looks like JSON.stringify', () => {
    const structure = {
        undefinedProp: undefined,
        nestedObject: {
            prop1: undefined,
            prop2: 'abc',
            prop3: 42,
            prop4: [1, 2, 3],
        },
    };
    expect(stack.resolve(stack.toJsonString(structure))).toEqual(JSON.stringify(structure));
    expect(stack.resolve(stack.toJsonString(structure, 2))).toEqual(JSON.stringify(structure, undefined, 2));
});
test('JSONification of undefined leads to undefined', () => {
    expect(stack.resolve(stack.toJsonString(undefined))).toEqual(undefined);
});
describe('tokens that return literals', () => {
    test('string tokens can be JSONified and JSONification can be reversed', () => {
        for (const token of tokensThatResolveTo('woof woof')) {
            // GIVEN
            const fido = { name: 'Fido', speaks: token };
            // WHEN
            const resolved = stack.resolve(stack.toJsonString(fido));
            // THEN
            expect(evaluate_cfn_1.evaluateCFN(resolved)).toEqual('{"name":"Fido","speaks":"woof woof"}');
        }
    });
    test('string tokens can be embedded while being JSONified', () => {
        for (const token of tokensThatResolveTo('woof woof')) {
            // GIVEN
            const fido = { name: 'Fido', speaks: `deep ${token}` };
            // WHEN
            const resolved = stack.resolve(stack.toJsonString(fido));
            // THEN
            expect(evaluate_cfn_1.evaluateCFN(resolved)).toEqual('{"name":"Fido","speaks":"deep woof woof"}');
        }
    });
    test('constant string has correct amount of quotes applied', () => {
        const inputString = 'Hello, "world"';
        // WHEN
        const resolved = stack.resolve(stack.toJsonString(inputString));
        // THEN
        expect(evaluate_cfn_1.evaluateCFN(resolved)).toEqual(JSON.stringify(inputString));
    });
    test('integer Tokens behave correctly in stringification and JSONification', () => {
        // GIVEN
        const num = new intrinsic_1.Intrinsic(1);
        const embedded = `the number is ${num}`;
        // WHEN
        expect(evaluate_cfn_1.evaluateCFN(stack.resolve(embedded))).toEqual('the number is 1');
        expect(evaluate_cfn_1.evaluateCFN(stack.resolve(stack.toJsonString({ embedded })))).toEqual('{"embedded":"the number is 1"}');
        expect(evaluate_cfn_1.evaluateCFN(stack.resolve(stack.toJsonString({ num })))).toEqual('{"num":1}');
    });
    test('String-encoded lazies do not have quotes applied if they return objects', () => {
        // This is unfortunately crazy behavior, but we have some clients already taking a
        // dependency on the fact that `Lazy.string({ produce: () => [...some list...] })`
        // does not apply quotes but just renders the list.
        // GIVEN
        const someList = lib_1.Lazy.string({ produce: () => [1, 2, 3] });
        // WHEN
        expect(evaluate_cfn_1.evaluateCFN(stack.resolve(stack.toJsonString({ someList })))).toEqual('{"someList":[1,2,3]}');
    });
    test('Literal-resolving List Tokens do not have quotes applied', () => {
        // GIVEN
        const someList = lib_1.Token.asList([1, 2, 3]);
        // WHEN
        expect(evaluate_cfn_1.evaluateCFN(stack.resolve(stack.toJsonString({ someList })))).toEqual('{"someList":[1,2,3]}');
    });
    test('Intrinsic-resolving List Tokens do not have quotes applied', () => {
        // GIVEN
        const someList = lib_1.Token.asList(new intrinsic_1.Intrinsic({ Ref: 'Thing' }));
        // WHEN
        new lib_1.CfnResource(stack, 'Resource', {
            type: 'AWS::Banana',
            properties: {
                someJson: stack.toJsonString({ someList }),
            },
        });
        const asm = app.synth();
        const template = asm.getStackByName(stack.stackName).template;
        const stringifyLogicalId = Object.keys(template.Resources).filter(id => id.startsWith('CdkJsonStringify'))[0];
        expect(stringifyLogicalId).toBeDefined();
        expect(template.Resources.Resource.Properties.someJson).toEqual({
            'Fn::Join': ['', [
                    '{"someList":',
                    { 'Fn::GetAtt': [stringifyLogicalId, 'Value'] },
                    '}',
                ]],
        });
    });
    test('tokens in strings survive additional TokenJSON.stringification()', () => {
        // GIVEN
        for (const token of tokensThatResolveTo('pong!')) {
            // WHEN
            const stringified = stack.toJsonString(`ping? ${token}`);
            // THEN
            expect(evaluate_cfn_1.evaluateCFN(stack.resolve(stringified))).toEqual('"ping? pong!"');
        }
    });
    test('Doubly nested strings evaluate correctly in JSON context', () => {
        // WHEN
        const fidoSays = lib_1.Lazy.string({ produce: () => 'woof' });
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({
            information: `Did you know that Fido says: ${fidoSays}`,
        }));
        // THEN
        expect(evaluate_cfn_1.evaluateCFN(resolved)).toEqual('{"information":"Did you know that Fido says: woof"}');
    });
    test('Quoted strings in embedded JSON context are escaped', () => {
        // GIVEN
        const fidoSays = lib_1.Lazy.string({ produce: () => '"woof"' });
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({
            information: `Did you know that Fido says: ${fidoSays}`,
        }));
        // THEN
        expect(evaluate_cfn_1.evaluateCFN(resolved)).toEqual('{"information":"Did you know that Fido says: \\"woof\\""}');
    });
});
describe('tokens returning CloudFormation intrinsics', () => {
    test('intrinsic Tokens embed correctly in JSONification', () => {
        // GIVEN
        const bucketName = new intrinsic_1.Intrinsic({ Ref: 'MyBucket' });
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({ theBucket: bucketName }));
        // THEN
        const context = { MyBucket: 'TheName' };
        expect(evaluate_cfn_1.evaluateCFN(resolved, context)).toEqual('{"theBucket":"TheName"}');
    });
    test('fake intrinsics are serialized to objects', () => {
        const fakeIntrinsics = new intrinsic_1.Intrinsic({
            a: {
                'Fn::GetArtifactAtt': {
                    key: 'val',
                },
            },
            b: {
                'Fn::GetParam': [
                    'val1',
                    'val2',
                ],
            },
        });
        const stringified = stack.toJsonString(fakeIntrinsics);
        expect(evaluate_cfn_1.evaluateCFN(stack.resolve(stringified))).toEqual('{"a":{"Fn::GetArtifactAtt":{"key":"val"}},"b":{"Fn::GetParam":["val1","val2"]}}');
    });
    test('embedded string literals in intrinsics are escaped when calling TokenJSON.stringify()', () => {
        // GIVEN
        const token = lib_1.Fn.join('', ['Hello ', lib_1.Token.asString({ Ref: 'Planet' }), ', this\nIs', 'Very "cool"']);
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({
            literal: 'I can also "contain" quotes',
            token,
        }));
        // THEN
        const context = { Planet: 'World' };
        const expected = '{"literal":"I can also \\"contain\\" quotes","token":"Hello World, this\\nIsVery \\"cool\\""}';
        expect(evaluate_cfn_1.evaluateCFN(resolved, context)).toEqual(expected);
    });
    test('embedded string literals are escaped in Fn.sub (implicit references)', () => {
        // GIVEN
        const token = lib_1.Fn.sub('I am in account "${AWS::AccountId}"');
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({ token }));
        // THEN
        const context = { 'AWS::AccountId': '1234' };
        const expected = '{"token":"I am in account \\"1234\\""}';
        expect(evaluate_cfn_1.evaluateCFN(resolved, context)).toEqual(expected);
    });
    test('embedded string literals are escaped in Fn.sub (explicit references)', () => {
        // GIVEN
        const token = lib_1.Fn.sub('I am in account "${Acct}", also wanted to say: ${Also}', {
            Acct: lib_1.Aws.ACCOUNT_ID,
            Also: '"hello world"',
        });
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({ token }));
        // THEN
        const context = { 'AWS::AccountId': '1234' };
        const expected = '{"token":"I am in account \\"1234\\", also wanted to say: \\"hello world\\""}';
        expect(evaluate_cfn_1.evaluateCFN(resolved, context)).toEqual(expected);
    });
    test('Tokens in Tokens are handled correctly', () => {
        // GIVEN
        const bucketName = new intrinsic_1.Intrinsic({ Ref: 'MyBucket' });
        const combinedName = lib_1.Fn.join('', ['The bucket name is ', bucketName.toString()]);
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({ theBucket: combinedName }));
        // THEN
        const context = { MyBucket: 'TheName' };
        expect(evaluate_cfn_1.evaluateCFN(resolved, context)).toEqual('{"theBucket":"The bucket name is TheName"}');
    });
    test('Intrinsics in postprocessors are handled correctly', () => {
        // GIVEN
        const bucketName = new intrinsic_1.Intrinsic({ Ref: 'MyBucket' });
        const combinedName = new DummyPostProcessor(['this', 'is', bucketName]);
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({ theBucket: combinedName }));
        // THEN
        expect(resolved).toEqual({
            'Fn::Join': ['', ['{"theBucket":["this","is","', { Ref: 'MyBucket' }, '"]}']],
        });
    });
    test('Doubly nested strings evaluate correctly in JSON context', () => {
        // WHEN
        const fidoSays = lib_1.Lazy.string({ produce: () => 'woof' });
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({
            information: `Did you know that Fido says: ${fidoSays}`,
        }));
        // THEN
        expect(evaluate_cfn_1.evaluateCFN(resolved)).toEqual('{"information":"Did you know that Fido says: woof"}');
    });
    test('Doubly nested intrinsics evaluate correctly in JSON context', () => {
        // GIVEN
        const fidoSays = lib_1.Lazy.any({ produce: () => ({ Ref: 'Something' }) });
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({
            information: `Did you know that Fido says: ${fidoSays}`,
        }));
        // THEN
        const context = { Something: 'woof woof' };
        expect(evaluate_cfn_1.evaluateCFN(resolved, context)).toEqual('{"information":"Did you know that Fido says: woof woof"}');
    });
    test('Nested strings are quoted correctly', () => {
        const fidoSays = lib_1.Lazy.string({ produce: () => '"woof"' });
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({
            information: `Did you know that Fido says: ${fidoSays}`,
        }));
        // THEN
        expect(evaluate_cfn_1.evaluateCFN(resolved)).toEqual('{"information":"Did you know that Fido says: \\"woof\\""}');
    });
    test('cross-stack references are also properly converted by toJsonString()', () => {
        // GIVEN
        const stack1 = new lib_1.Stack(app, 'Stack1');
        const stack2 = new lib_1.Stack(app, 'Stack2');
        // WHEN
        new lib_1.CfnOutput(stack2, 'Stack1Id', {
            value: stack2.toJsonString({
                Stack1Id: stack1.stackId,
                Stack2Id: stack2.stackId,
            }),
        });
        // THEN
        const asm = app.synth();
        expect(asm.getStackByName('Stack2').template?.Outputs).toEqual({
            Stack1Id: {
                Value: {
                    'Fn::Join': ['', [
                            '{"Stack1Id":"',
                            { 'Fn::ImportValue': 'Stack1:ExportsOutputRefAWSStackIdB2DD5BAA' },
                            '","Stack2Id":"',
                            { Ref: 'AWS::StackId' },
                            '"}',
                        ]],
                },
            },
        });
    });
    test('Intrinsics can occur in key position', () => {
        // GIVEN
        const bucketName = lib_1.Token.asString({ Ref: 'MyBucket' });
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({
            [bucketName]: 'Is Cool',
            [`${bucketName} Is`]: 'Cool',
        }));
        // THEN
        const context = { MyBucket: 'Harry' };
        expect(evaluate_cfn_1.evaluateCFN(resolved, context)).toEqual('{"Harry":"Is Cool","Harry Is":"Cool"}');
    });
    test('toJsonString() can be used recursively', () => {
        // GIVEN
        const bucketName = lib_1.Token.asString({ Ref: 'MyBucket' });
        // WHEN
        const embeddedJson = stack.toJsonString({ message: `the bucket name is ${bucketName}` });
        const outerJson = stack.toJsonString({ embeddedJson });
        // THEN
        const evaluatedJson = evaluate_cfn_1.evaluateCFN(stack.resolve(outerJson), {
            MyBucket: 'Bucky',
        });
        expect(evaluatedJson).toEqual('{"embeddedJson":"{\\"message\\":\\"the bucket name is Bucky\\"}"}');
        expect(JSON.parse(JSON.parse(evaluatedJson).embeddedJson).message).toEqual('the bucket name is Bucky');
    });
    test('Every Token used inside a JSONified string is given an opportunity to be uncached', () => {
        // Check that tokens aren't accidentally fully resolved by the first invocation/resolution
        // of toJsonString(). On every evaluation, Tokens referenced inside the structure should be
        // given a chance to be either cached or uncached.
        //
        // (NOTE: This does not check whether the implementation of toJsonString() itself is cached or
        // not; that depends on aws/aws-cdk#11224 and should be done in a different PR).
        // WHEN
        let counter = 0;
        const counterString = lib_1.Token.asString({ resolve: () => `${++counter}` });
        const jsonString = stack.toJsonString({ counterString });
        // THEN
        expect(stack.resolve(jsonString)).toEqual('{"counterString":"1"}');
        expect(stack.resolve(jsonString)).toEqual('{"counterString":"2"}');
    });
});
test('JSON strings nested inside JSON strings have correct quoting', () => {
    // GIVEN
    const payload = stack.toJsonString({
        message: lib_1.Fn.sub('I am in account "${AWS::AccountId}"'),
    });
    // WHEN
    const resolved = stack.resolve(stack.toJsonString({ payload }));
    // THEN
    const context = { 'AWS::AccountId': '1234' };
    const expected = '{"payload":"{\\"message\\":\\"I am in account \\\\\\"1234\\\\\\"\\"}"}';
    const evaluated = evaluate_cfn_1.evaluateCFN(resolved, context);
    expect(evaluated).toEqual(expected);
    // Is this even correct? Let's ask JavaScript because I have trouble reading this many backslashes.
    expect(JSON.parse(JSON.parse(evaluated).payload).message).toEqual('I am in account "1234"');
});
/**
 * Return two Tokens, one of which evaluates to a Token directly, one which evaluates to it lazily
 */
function tokensThatResolveTo(value) {
    return [
        new intrinsic_1.Intrinsic(value),
        lib_1.Lazy.any({ produce: () => value }),
    ];
}
class DummyPostProcessor {
    constructor(value) {
        this.value = value;
        this.creationStack = ['test'];
    }
    resolve(context) {
        context.registerPostProcessor(this);
        return context.resolve(this.value);
    }
    postProcess(o, _context) {
        return o;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWRmb3JtYXRpb24tanNvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xvdWRmb3JtYXRpb24tanNvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQTZDO0FBQzdDLGdDQUFnSTtBQUNoSSx3REFBcUQ7QUFFckQsSUFBSSxHQUFRLENBQUM7QUFDYixJQUFJLEtBQVksQ0FBQztBQUNqQixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsR0FBRyxHQUFHLElBQUksU0FBRyxFQUFFLENBQUM7SUFDaEIsS0FBSyxHQUFHLElBQUksV0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7SUFDL0QsTUFBTSxTQUFTLEdBQUc7UUFDaEIsYUFBYSxFQUFFLFNBQVM7UUFDeEIsWUFBWSxFQUFFO1lBQ1osS0FBSyxFQUFFLFNBQVM7WUFDaEIsS0FBSyxFQUFFLEtBQUs7WUFDWixLQUFLLEVBQUUsRUFBRTtZQUNULEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2pCO0tBQ0YsQ0FBQztJQUVGLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDeEYsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRyxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQywr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RUg7O0dBRUc7QUFDSCxTQUFTLG1CQUFtQixDQUFDLEtBQVU7SUFDckMsT0FBTztRQUNMLElBQUkscUJBQVMsQ0FBQyxLQUFLLENBQUM7UUFDcEIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNuQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sa0JBQWtCO0lBR3RCLFlBQTZCLEtBQVU7UUFBVixVQUFLLEdBQUwsS0FBSyxDQUFLO1FBQ3JDLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMvQjtJQUVNLE9BQU8sQ0FBQyxPQUF3QjtRQUNyQyxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwQztJQUVNLFdBQVcsQ0FBQyxDQUFNLEVBQUUsUUFBeUI7UUFDbEQsT0FBTyxDQUFDLENBQUM7S0FDVjtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXZhbHVhdGVDRk4gfSBmcm9tICcuL2V2YWx1YXRlLWNmbic7XG5pbXBvcnQgeyBBcHAsIEF3cywgQ2ZuT3V0cHV0LCBDZm5SZXNvdXJjZSwgRm4sIElQb3N0UHJvY2Vzc29yLCBJUmVzb2x2YWJsZSwgSVJlc29sdmVDb250ZXh0LCBMYXp5LCBTdGFjaywgVG9rZW4gfSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgSW50cmluc2ljIH0gZnJvbSAnLi4vbGliL3ByaXZhdGUvaW50cmluc2ljJztcblxubGV0IGFwcDogQXBwO1xubGV0IHN0YWNrOiBTdGFjaztcbmJlZm9yZUVhY2goKCkgPT4ge1xuICBhcHAgPSBuZXcgQXBwKCk7XG4gIHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG59KTtcblxudGVzdCgnSlNPTmlmaWNhdGlvbiBvZiBsaXRlcmFscyBsb29rcyBsaWtlIEpTT04uc3RyaW5naWZ5JywgKCkgPT4ge1xuICBjb25zdCBzdHJ1Y3R1cmUgPSB7XG4gICAgdW5kZWZpbmVkUHJvcDogdW5kZWZpbmVkLFxuICAgIG5lc3RlZE9iamVjdDoge1xuICAgICAgcHJvcDE6IHVuZGVmaW5lZCxcbiAgICAgIHByb3AyOiAnYWJjJyxcbiAgICAgIHByb3AzOiA0MixcbiAgICAgIHByb3A0OiBbMSwgMiwgM10sXG4gICAgfSxcbiAgfTtcblxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzdGFjay50b0pzb25TdHJpbmcoc3RydWN0dXJlKSkpLnRvRXF1YWwoSlNPTi5zdHJpbmdpZnkoc3RydWN0dXJlKSk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyhzdHJ1Y3R1cmUsIDIpKSkudG9FcXVhbChKU09OLnN0cmluZ2lmeShzdHJ1Y3R1cmUsIHVuZGVmaW5lZCwgMikpO1xufSk7XG5cbnRlc3QoJ0pTT05pZmljYXRpb24gb2YgdW5kZWZpbmVkIGxlYWRzIHRvIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHVuZGVmaW5lZCkpKS50b0VxdWFsKHVuZGVmaW5lZCk7XG59KTtcblxuZGVzY3JpYmUoJ3Rva2VucyB0aGF0IHJldHVybiBsaXRlcmFscycsICgpID0+IHtcblxuICB0ZXN0KCdzdHJpbmcgdG9rZW5zIGNhbiBiZSBKU09OaWZpZWQgYW5kIEpTT05pZmljYXRpb24gY2FuIGJlIHJldmVyc2VkJywgKCkgPT4ge1xuICAgIGZvciAoY29uc3QgdG9rZW4gb2YgdG9rZW5zVGhhdFJlc29sdmVUbygnd29vZiB3b29mJykpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBmaWRvID0geyBuYW1lOiAnRmlkbycsIHNwZWFrczogdG9rZW4gfTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgcmVzb2x2ZWQgPSBzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyhmaWRvKSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChldmFsdWF0ZUNGTihyZXNvbHZlZCkpLnRvRXF1YWwoJ3tcIm5hbWVcIjpcIkZpZG9cIixcInNwZWFrc1wiOlwid29vZiB3b29mXCJ9Jyk7XG4gICAgfVxuICB9KTtcblxuICB0ZXN0KCdzdHJpbmcgdG9rZW5zIGNhbiBiZSBlbWJlZGRlZCB3aGlsZSBiZWluZyBKU09OaWZpZWQnLCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCB0b2tlbiBvZiB0b2tlbnNUaGF0UmVzb2x2ZVRvKCd3b29mIHdvb2YnKSkge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGZpZG8gPSB7IG5hbWU6ICdGaWRvJywgc3BlYWtzOiBgZGVlcCAke3Rva2VufWAgfTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgcmVzb2x2ZWQgPSBzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyhmaWRvKSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChldmFsdWF0ZUNGTihyZXNvbHZlZCkpLnRvRXF1YWwoJ3tcIm5hbWVcIjpcIkZpZG9cIixcInNwZWFrc1wiOlwiZGVlcCB3b29mIHdvb2ZcIn0nKTtcbiAgICB9XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnN0YW50IHN0cmluZyBoYXMgY29ycmVjdCBhbW91bnQgb2YgcXVvdGVzIGFwcGxpZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXRTdHJpbmcgPSAnSGVsbG8sIFwid29ybGRcIic7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVzb2x2ZWQgPSBzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyhpbnB1dFN0cmluZykpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChldmFsdWF0ZUNGTihyZXNvbHZlZCkpLnRvRXF1YWwoSlNPTi5zdHJpbmdpZnkoaW5wdXRTdHJpbmcpKTtcbiAgfSk7XG5cbiAgdGVzdCgnaW50ZWdlciBUb2tlbnMgYmVoYXZlIGNvcnJlY3RseSBpbiBzdHJpbmdpZmljYXRpb24gYW5kIEpTT05pZmljYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBudW0gPSBuZXcgSW50cmluc2ljKDEpO1xuICAgIGNvbnN0IGVtYmVkZGVkID0gYHRoZSBudW1iZXIgaXMgJHtudW19YDtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoZXZhbHVhdGVDRk4oc3RhY2sucmVzb2x2ZShlbWJlZGRlZCkpKS50b0VxdWFsKCd0aGUgbnVtYmVyIGlzIDEnKTtcbiAgICBleHBlY3QoZXZhbHVhdGVDRk4oc3RhY2sucmVzb2x2ZShzdGFjay50b0pzb25TdHJpbmcoeyBlbWJlZGRlZCB9KSkpKS50b0VxdWFsKCd7XCJlbWJlZGRlZFwiOlwidGhlIG51bWJlciBpcyAxXCJ9Jyk7XG4gICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHsgbnVtIH0pKSkpLnRvRXF1YWwoJ3tcIm51bVwiOjF9Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1N0cmluZy1lbmNvZGVkIGxhemllcyBkbyBub3QgaGF2ZSBxdW90ZXMgYXBwbGllZCBpZiB0aGV5IHJldHVybiBvYmplY3RzJywgKCkgPT4ge1xuICAgIC8vIFRoaXMgaXMgdW5mb3J0dW5hdGVseSBjcmF6eSBiZWhhdmlvciwgYnV0IHdlIGhhdmUgc29tZSBjbGllbnRzIGFscmVhZHkgdGFraW5nIGFcbiAgICAvLyBkZXBlbmRlbmN5IG9uIHRoZSBmYWN0IHRoYXQgYExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gWy4uLnNvbWUgbGlzdC4uLl0gfSlgXG4gICAgLy8gZG9lcyBub3QgYXBwbHkgcXVvdGVzIGJ1dCBqdXN0IHJlbmRlcnMgdGhlIGxpc3QuXG5cbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHNvbWVMaXN0ID0gTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiBbMSwgMiwgM10gYXMgYW55IH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdChldmFsdWF0ZUNGTihzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyh7IHNvbWVMaXN0IH0pKSkpLnRvRXF1YWwoJ3tcInNvbWVMaXN0XCI6WzEsMiwzXX0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnTGl0ZXJhbC1yZXNvbHZpbmcgTGlzdCBUb2tlbnMgZG8gbm90IGhhdmUgcXVvdGVzIGFwcGxpZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzb21lTGlzdCA9IFRva2VuLmFzTGlzdChbMSwgMiwgM10pO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdChldmFsdWF0ZUNGTihzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyh7IHNvbWVMaXN0IH0pKSkpLnRvRXF1YWwoJ3tcInNvbWVMaXN0XCI6WzEsMiwzXX0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnSW50cmluc2ljLXJlc29sdmluZyBMaXN0IFRva2VucyBkbyBub3QgaGF2ZSBxdW90ZXMgYXBwbGllZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHNvbWVMaXN0ID0gVG9rZW4uYXNMaXN0KG5ldyBJbnRyaW5zaWMoeyBSZWY6ICdUaGluZycgfSkpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywge1xuICAgICAgdHlwZTogJ0FXUzo6QmFuYW5hJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc29tZUpzb246IHN0YWNrLnRvSnNvblN0cmluZyh7IHNvbWVMaXN0IH0pLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFzbSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IHRlbXBsYXRlID0gYXNtLmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgY29uc3Qgc3RyaW5naWZ5TG9naWNhbElkID0gT2JqZWN0LmtleXModGVtcGxhdGUuUmVzb3VyY2VzKS5maWx0ZXIoaWQgPT4gaWQuc3RhcnRzV2l0aCgnQ2RrSnNvblN0cmluZ2lmeScpKVswXTtcbiAgICBleHBlY3Qoc3RyaW5naWZ5TG9naWNhbElkKS50b0JlRGVmaW5lZCgpO1xuXG4gICAgZXhwZWN0KHRlbXBsYXRlLlJlc291cmNlcy5SZXNvdXJjZS5Qcm9wZXJ0aWVzLnNvbWVKc29uKS50b0VxdWFsKHtcbiAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAne1wic29tZUxpc3RcIjonLFxuICAgICAgICB7ICdGbjo6R2V0QXR0JzogW3N0cmluZ2lmeUxvZ2ljYWxJZCwgJ1ZhbHVlJ10gfSxcbiAgICAgICAgJ30nLFxuICAgICAgXV0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rva2VucyBpbiBzdHJpbmdzIHN1cnZpdmUgYWRkaXRpb25hbCBUb2tlbkpTT04uc3RyaW5naWZpY2F0aW9uKCknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHRva2Vuc1RoYXRSZXNvbHZlVG8oJ3BvbmchJykpIHtcbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHN0cmluZ2lmaWVkID0gc3RhY2sudG9Kc29uU3RyaW5nKGBwaW5nPyAke3Rva2VufWApO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoZXZhbHVhdGVDRk4oc3RhY2sucmVzb2x2ZShzdHJpbmdpZmllZCkpKS50b0VxdWFsKCdcInBpbmc/IHBvbmchXCInKTtcbiAgICB9XG4gIH0pO1xuXG4gIHRlc3QoJ0RvdWJseSBuZXN0ZWQgc3RyaW5ncyBldmFsdWF0ZSBjb3JyZWN0bHkgaW4gSlNPTiBjb250ZXh0JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBmaWRvU2F5cyA9IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ3dvb2YnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlc29sdmVkID0gc3RhY2sucmVzb2x2ZShzdGFjay50b0pzb25TdHJpbmcoe1xuICAgICAgaW5mb3JtYXRpb246IGBEaWQgeW91IGtub3cgdGhhdCBGaWRvIHNheXM6ICR7Zmlkb1NheXN9YCxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHJlc29sdmVkKSkudG9FcXVhbCgne1wiaW5mb3JtYXRpb25cIjpcIkRpZCB5b3Uga25vdyB0aGF0IEZpZG8gc2F5czogd29vZlwifScpO1xuICB9KTtcblxuICB0ZXN0KCdRdW90ZWQgc3RyaW5ncyBpbiBlbWJlZGRlZCBKU09OIGNvbnRleHQgYXJlIGVzY2FwZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBmaWRvU2F5cyA9IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ1wid29vZlwiJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNvbHZlZCA9IHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHtcbiAgICAgIGluZm9ybWF0aW9uOiBgRGlkIHlvdSBrbm93IHRoYXQgRmlkbyBzYXlzOiAke2ZpZG9TYXlzfWAsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChldmFsdWF0ZUNGTihyZXNvbHZlZCkpLnRvRXF1YWwoJ3tcImluZm9ybWF0aW9uXCI6XCJEaWQgeW91IGtub3cgdGhhdCBGaWRvIHNheXM6IFxcXFxcIndvb2ZcXFxcXCJcIn0nKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3Rva2VucyByZXR1cm5pbmcgQ2xvdWRGb3JtYXRpb24gaW50cmluc2ljcycsICgpID0+IHtcbiAgdGVzdCgnaW50cmluc2ljIFRva2VucyBlbWJlZCBjb3JyZWN0bHkgaW4gSlNPTmlmaWNhdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGJ1Y2tldE5hbWUgPSBuZXcgSW50cmluc2ljKHsgUmVmOiAnTXlCdWNrZXQnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlc29sdmVkID0gc3RhY2sucmVzb2x2ZShzdGFjay50b0pzb25TdHJpbmcoeyB0aGVCdWNrZXQ6IGJ1Y2tldE5hbWUgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGNvbnRleHQgPSB7IE15QnVja2V0OiAnVGhlTmFtZScgfTtcbiAgICBleHBlY3QoZXZhbHVhdGVDRk4ocmVzb2x2ZWQsIGNvbnRleHQpKS50b0VxdWFsKCd7XCJ0aGVCdWNrZXRcIjpcIlRoZU5hbWVcIn0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFrZSBpbnRyaW5zaWNzIGFyZSBzZXJpYWxpemVkIHRvIG9iamVjdHMnLCAoKSA9PiB7XG4gICAgY29uc3QgZmFrZUludHJpbnNpY3MgPSBuZXcgSW50cmluc2ljKHtcbiAgICAgIGE6IHtcbiAgICAgICAgJ0ZuOjpHZXRBcnRpZmFjdEF0dCc6IHtcbiAgICAgICAgICBrZXk6ICd2YWwnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGI6IHtcbiAgICAgICAgJ0ZuOjpHZXRQYXJhbSc6IFtcbiAgICAgICAgICAndmFsMScsXG4gICAgICAgICAgJ3ZhbDInLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0cmluZ2lmaWVkID0gc3RhY2sudG9Kc29uU3RyaW5nKGZha2VJbnRyaW5zaWNzKTtcbiAgICBleHBlY3QoZXZhbHVhdGVDRk4oc3RhY2sucmVzb2x2ZShzdHJpbmdpZmllZCkpKS50b0VxdWFsKFxuICAgICAgJ3tcImFcIjp7XCJGbjo6R2V0QXJ0aWZhY3RBdHRcIjp7XCJrZXlcIjpcInZhbFwifX0sXCJiXCI6e1wiRm46OkdldFBhcmFtXCI6W1widmFsMVwiLFwidmFsMlwiXX19Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2VtYmVkZGVkIHN0cmluZyBsaXRlcmFscyBpbiBpbnRyaW5zaWNzIGFyZSBlc2NhcGVkIHdoZW4gY2FsbGluZyBUb2tlbkpTT04uc3RyaW5naWZ5KCknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB0b2tlbiA9IEZuLmpvaW4oJycsIFsnSGVsbG8gJywgVG9rZW4uYXNTdHJpbmcoeyBSZWY6ICdQbGFuZXQnIH0pLCAnLCB0aGlzXFxuSXMnLCAnVmVyeSBcImNvb2xcIiddKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNvbHZlZCA9IHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHtcbiAgICAgIGxpdGVyYWw6ICdJIGNhbiBhbHNvIFwiY29udGFpblwiIHF1b3RlcycsXG4gICAgICB0b2tlbixcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgY29udGV4dCA9IHsgUGxhbmV0OiAnV29ybGQnIH07XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAne1wibGl0ZXJhbFwiOlwiSSBjYW4gYWxzbyBcXFxcXCJjb250YWluXFxcXFwiIHF1b3Rlc1wiLFwidG9rZW5cIjpcIkhlbGxvIFdvcmxkLCB0aGlzXFxcXG5Jc1ZlcnkgXFxcXFwiY29vbFxcXFxcIlwifSc7XG4gICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHJlc29sdmVkLCBjb250ZXh0KSkudG9FcXVhbChleHBlY3RlZCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2VtYmVkZGVkIHN0cmluZyBsaXRlcmFscyBhcmUgZXNjYXBlZCBpbiBGbi5zdWIgKGltcGxpY2l0IHJlZmVyZW5jZXMpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdG9rZW4gPSBGbi5zdWIoJ0kgYW0gaW4gYWNjb3VudCBcIiR7QVdTOjpBY2NvdW50SWR9XCInKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNvbHZlZCA9IHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHsgdG9rZW4gfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGNvbnRleHQgPSB7ICdBV1M6OkFjY291bnRJZCc6ICcxMjM0JyB9O1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ3tcInRva2VuXCI6XCJJIGFtIGluIGFjY291bnQgXFxcXFwiMTIzNFxcXFxcIlwifSc7XG4gICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHJlc29sdmVkLCBjb250ZXh0KSkudG9FcXVhbChleHBlY3RlZCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2VtYmVkZGVkIHN0cmluZyBsaXRlcmFscyBhcmUgZXNjYXBlZCBpbiBGbi5zdWIgKGV4cGxpY2l0IHJlZmVyZW5jZXMpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdG9rZW4gPSBGbi5zdWIoJ0kgYW0gaW4gYWNjb3VudCBcIiR7QWNjdH1cIiwgYWxzbyB3YW50ZWQgdG8gc2F5OiAke0Fsc299Jywge1xuICAgICAgQWNjdDogQXdzLkFDQ09VTlRfSUQsXG4gICAgICBBbHNvOiAnXCJoZWxsbyB3b3JsZFwiJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNvbHZlZCA9IHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHsgdG9rZW4gfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGNvbnRleHQgPSB7ICdBV1M6OkFjY291bnRJZCc6ICcxMjM0JyB9O1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ3tcInRva2VuXCI6XCJJIGFtIGluIGFjY291bnQgXFxcXFwiMTIzNFxcXFxcIiwgYWxzbyB3YW50ZWQgdG8gc2F5OiBcXFxcXCJoZWxsbyB3b3JsZFxcXFxcIlwifSc7XG4gICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHJlc29sdmVkLCBjb250ZXh0KSkudG9FcXVhbChleHBlY3RlZCk7XG4gIH0pO1xuXG4gIHRlc3QoJ1Rva2VucyBpbiBUb2tlbnMgYXJlIGhhbmRsZWQgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYnVja2V0TmFtZSA9IG5ldyBJbnRyaW5zaWMoeyBSZWY6ICdNeUJ1Y2tldCcgfSk7XG4gICAgY29uc3QgY29tYmluZWROYW1lID0gRm4uam9pbignJywgWydUaGUgYnVja2V0IG5hbWUgaXMgJywgYnVja2V0TmFtZS50b1N0cmluZygpXSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVzb2x2ZWQgPSBzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyh7IHRoZUJ1Y2tldDogY29tYmluZWROYW1lIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBjb250ZXh0ID0geyBNeUJ1Y2tldDogJ1RoZU5hbWUnIH07XG4gICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHJlc29sdmVkLCBjb250ZXh0KSkudG9FcXVhbCgne1widGhlQnVja2V0XCI6XCJUaGUgYnVja2V0IG5hbWUgaXMgVGhlTmFtZVwifScpO1xuICB9KTtcblxuICB0ZXN0KCdJbnRyaW5zaWNzIGluIHBvc3Rwcm9jZXNzb3JzIGFyZSBoYW5kbGVkIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGJ1Y2tldE5hbWUgPSBuZXcgSW50cmluc2ljKHsgUmVmOiAnTXlCdWNrZXQnIH0pO1xuICAgIGNvbnN0IGNvbWJpbmVkTmFtZSA9IG5ldyBEdW1teVBvc3RQcm9jZXNzb3IoWyd0aGlzJywgJ2lzJywgYnVja2V0TmFtZV0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlc29sdmVkID0gc3RhY2sucmVzb2x2ZShzdGFjay50b0pzb25TdHJpbmcoeyB0aGVCdWNrZXQ6IGNvbWJpbmVkTmFtZSB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlc29sdmVkKS50b0VxdWFsKHtcbiAgICAgICdGbjo6Sm9pbic6IFsnJywgWyd7XCJ0aGVCdWNrZXRcIjpbXCJ0aGlzXCIsXCJpc1wiLFwiJywgeyBSZWY6ICdNeUJ1Y2tldCcgfSwgJ1wiXX0nXV0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0RvdWJseSBuZXN0ZWQgc3RyaW5ncyBldmFsdWF0ZSBjb3JyZWN0bHkgaW4gSlNPTiBjb250ZXh0JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBmaWRvU2F5cyA9IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ3dvb2YnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlc29sdmVkID0gc3RhY2sucmVzb2x2ZShzdGFjay50b0pzb25TdHJpbmcoe1xuICAgICAgaW5mb3JtYXRpb246IGBEaWQgeW91IGtub3cgdGhhdCBGaWRvIHNheXM6ICR7Zmlkb1NheXN9YCxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHJlc29sdmVkKSkudG9FcXVhbCgne1wiaW5mb3JtYXRpb25cIjpcIkRpZCB5b3Uga25vdyB0aGF0IEZpZG8gc2F5czogd29vZlwifScpO1xuICB9KTtcblxuICB0ZXN0KCdEb3VibHkgbmVzdGVkIGludHJpbnNpY3MgZXZhbHVhdGUgY29ycmVjdGx5IGluIEpTT04gY29udGV4dCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGZpZG9TYXlzID0gTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiAoeyBSZWY6ICdTb21ldGhpbmcnIH0pIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlc29sdmVkID0gc3RhY2sucmVzb2x2ZShzdGFjay50b0pzb25TdHJpbmcoe1xuICAgICAgaW5mb3JtYXRpb246IGBEaWQgeW91IGtub3cgdGhhdCBGaWRvIHNheXM6ICR7Zmlkb1NheXN9YCxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgY29udGV4dCA9IHsgU29tZXRoaW5nOiAnd29vZiB3b29mJyB9O1xuICAgIGV4cGVjdChldmFsdWF0ZUNGTihyZXNvbHZlZCwgY29udGV4dCkpLnRvRXF1YWwoJ3tcImluZm9ybWF0aW9uXCI6XCJEaWQgeW91IGtub3cgdGhhdCBGaWRvIHNheXM6IHdvb2Ygd29vZlwifScpO1xuICB9KTtcblxuICB0ZXN0KCdOZXN0ZWQgc3RyaW5ncyBhcmUgcXVvdGVkIGNvcnJlY3RseScsICgpID0+IHtcbiAgICBjb25zdCBmaWRvU2F5cyA9IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ1wid29vZlwiJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNvbHZlZCA9IHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHtcbiAgICAgIGluZm9ybWF0aW9uOiBgRGlkIHlvdSBrbm93IHRoYXQgRmlkbyBzYXlzOiAke2ZpZG9TYXlzfWAsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChldmFsdWF0ZUNGTihyZXNvbHZlZCkpLnRvRXF1YWwoJ3tcImluZm9ybWF0aW9uXCI6XCJEaWQgeW91IGtub3cgdGhhdCBGaWRvIHNheXM6IFxcXFxcIndvb2ZcXFxcXCJcIn0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnY3Jvc3Mtc3RhY2sgcmVmZXJlbmNlcyBhcmUgYWxzbyBwcm9wZXJseSBjb252ZXJ0ZWQgYnkgdG9Kc29uU3RyaW5nKCknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBDZm5PdXRwdXQoc3RhY2syLCAnU3RhY2sxSWQnLCB7XG4gICAgICB2YWx1ZTogc3RhY2syLnRvSnNvblN0cmluZyh7XG4gICAgICAgIFN0YWNrMUlkOiBzdGFjazEuc3RhY2tJZCxcbiAgICAgICAgU3RhY2sySWQ6IHN0YWNrMi5zdGFja0lkLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNtID0gYXBwLnN5bnRoKCk7XG4gICAgZXhwZWN0KGFzbS5nZXRTdGFja0J5TmFtZSgnU3RhY2syJykudGVtcGxhdGU/Lk91dHB1dHMpLnRvRXF1YWwoe1xuICAgICAgU3RhY2sxSWQ6IHtcbiAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICd7XCJTdGFjazFJZFwiOlwiJyxcbiAgICAgICAgICAgIHsgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazE6RXhwb3J0c091dHB1dFJlZkFXU1N0YWNrSWRCMkRENUJBQScgfSxcbiAgICAgICAgICAgICdcIixcIlN0YWNrMklkXCI6XCInLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlN0YWNrSWQnIH0sXG4gICAgICAgICAgICAnXCJ9JyxcbiAgICAgICAgICBdXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0ludHJpbnNpY3MgY2FuIG9jY3VyIGluIGtleSBwb3NpdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGJ1Y2tldE5hbWUgPSBUb2tlbi5hc1N0cmluZyh7IFJlZjogJ015QnVja2V0JyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNvbHZlZCA9IHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHtcbiAgICAgIFtidWNrZXROYW1lXTogJ0lzIENvb2wnLFxuICAgICAgW2Ake2J1Y2tldE5hbWV9IElzYF06ICdDb29sJyxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgY29udGV4dCA9IHsgTXlCdWNrZXQ6ICdIYXJyeScgfTtcbiAgICBleHBlY3QoZXZhbHVhdGVDRk4ocmVzb2x2ZWQsIGNvbnRleHQpKS50b0VxdWFsKCd7XCJIYXJyeVwiOlwiSXMgQ29vbFwiLFwiSGFycnkgSXNcIjpcIkNvb2xcIn0nKTtcbiAgfSk7XG5cbiAgdGVzdCgndG9Kc29uU3RyaW5nKCkgY2FuIGJlIHVzZWQgcmVjdXJzaXZlbHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBidWNrZXROYW1lID0gVG9rZW4uYXNTdHJpbmcoeyBSZWY6ICdNeUJ1Y2tldCcgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgZW1iZWRkZWRKc29uID0gc3RhY2sudG9Kc29uU3RyaW5nKHsgbWVzc2FnZTogYHRoZSBidWNrZXQgbmFtZSBpcyAke2J1Y2tldE5hbWV9YCB9KTtcbiAgICBjb25zdCBvdXRlckpzb24gPSBzdGFjay50b0pzb25TdHJpbmcoeyBlbWJlZGRlZEpzb24gfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgZXZhbHVhdGVkSnNvbiA9IGV2YWx1YXRlQ0ZOKHN0YWNrLnJlc29sdmUob3V0ZXJKc29uKSwge1xuICAgICAgTXlCdWNrZXQ6ICdCdWNreScsXG4gICAgfSk7XG4gICAgZXhwZWN0KGV2YWx1YXRlZEpzb24pLnRvRXF1YWwoJ3tcImVtYmVkZGVkSnNvblwiOlwie1xcXFxcIm1lc3NhZ2VcXFxcXCI6XFxcXFwidGhlIGJ1Y2tldCBuYW1lIGlzIEJ1Y2t5XFxcXFwifVwifScpO1xuICAgIGV4cGVjdChKU09OLnBhcnNlKEpTT04ucGFyc2UoZXZhbHVhdGVkSnNvbikuZW1iZWRkZWRKc29uKS5tZXNzYWdlKS50b0VxdWFsKCd0aGUgYnVja2V0IG5hbWUgaXMgQnVja3knKTtcbiAgfSk7XG5cbiAgdGVzdCgnRXZlcnkgVG9rZW4gdXNlZCBpbnNpZGUgYSBKU09OaWZpZWQgc3RyaW5nIGlzIGdpdmVuIGFuIG9wcG9ydHVuaXR5IHRvIGJlIHVuY2FjaGVkJywgKCkgPT4ge1xuICAgIC8vIENoZWNrIHRoYXQgdG9rZW5zIGFyZW4ndCBhY2NpZGVudGFsbHkgZnVsbHkgcmVzb2x2ZWQgYnkgdGhlIGZpcnN0IGludm9jYXRpb24vcmVzb2x1dGlvblxuICAgIC8vIG9mIHRvSnNvblN0cmluZygpLiBPbiBldmVyeSBldmFsdWF0aW9uLCBUb2tlbnMgcmVmZXJlbmNlZCBpbnNpZGUgdGhlIHN0cnVjdHVyZSBzaG91bGQgYmVcbiAgICAvLyBnaXZlbiBhIGNoYW5jZSB0byBiZSBlaXRoZXIgY2FjaGVkIG9yIHVuY2FjaGVkLlxuICAgIC8vXG4gICAgLy8gKE5PVEU6IFRoaXMgZG9lcyBub3QgY2hlY2sgd2hldGhlciB0aGUgaW1wbGVtZW50YXRpb24gb2YgdG9Kc29uU3RyaW5nKCkgaXRzZWxmIGlzIGNhY2hlZCBvclxuICAgIC8vIG5vdDsgdGhhdCBkZXBlbmRzIG9uIGF3cy9hd3MtY2RrIzExMjI0IGFuZCBzaG91bGQgYmUgZG9uZSBpbiBhIGRpZmZlcmVudCBQUikuXG5cbiAgICAvLyBXSEVOXG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgIGNvbnN0IGNvdW50ZXJTdHJpbmcgPSBUb2tlbi5hc1N0cmluZyh7IHJlc29sdmU6ICgpID0+IGAkeysrY291bnRlcn1gIH0pO1xuICAgIGNvbnN0IGpzb25TdHJpbmcgPSBzdGFjay50b0pzb25TdHJpbmcoeyBjb3VudGVyU3RyaW5nIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGpzb25TdHJpbmcpKS50b0VxdWFsKCd7XCJjb3VudGVyU3RyaW5nXCI6XCIxXCJ9Jyk7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoanNvblN0cmluZykpLnRvRXF1YWwoJ3tcImNvdW50ZXJTdHJpbmdcIjpcIjJcIn0nKTtcbiAgfSk7XG59KTtcblxudGVzdCgnSlNPTiBzdHJpbmdzIG5lc3RlZCBpbnNpZGUgSlNPTiBzdHJpbmdzIGhhdmUgY29ycmVjdCBxdW90aW5nJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBwYXlsb2FkID0gc3RhY2sudG9Kc29uU3RyaW5nKHtcbiAgICBtZXNzYWdlOiBGbi5zdWIoJ0kgYW0gaW4gYWNjb3VudCBcIiR7QVdTOjpBY2NvdW50SWR9XCInKSxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCByZXNvbHZlZCA9IHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHsgcGF5bG9hZCB9KSk7XG5cbiAgLy8gVEhFTlxuICBjb25zdCBjb250ZXh0ID0geyAnQVdTOjpBY2NvdW50SWQnOiAnMTIzNCcgfTtcbiAgY29uc3QgZXhwZWN0ZWQgPSAne1wicGF5bG9hZFwiOlwie1xcXFxcIm1lc3NhZ2VcXFxcXCI6XFxcXFwiSSBhbSBpbiBhY2NvdW50IFxcXFxcXFxcXFxcXFwiMTIzNFxcXFxcXFxcXFxcXFwiXFxcXFwifVwifSc7XG4gIGNvbnN0IGV2YWx1YXRlZCA9IGV2YWx1YXRlQ0ZOKHJlc29sdmVkLCBjb250ZXh0KTtcbiAgZXhwZWN0KGV2YWx1YXRlZCkudG9FcXVhbChleHBlY3RlZCk7XG5cbiAgLy8gSXMgdGhpcyBldmVuIGNvcnJlY3Q/IExldCdzIGFzayBKYXZhU2NyaXB0IGJlY2F1c2UgSSBoYXZlIHRyb3VibGUgcmVhZGluZyB0aGlzIG1hbnkgYmFja3NsYXNoZXMuXG4gIGV4cGVjdChKU09OLnBhcnNlKEpTT04ucGFyc2UoZXZhbHVhdGVkKS5wYXlsb2FkKS5tZXNzYWdlKS50b0VxdWFsKCdJIGFtIGluIGFjY291bnQgXCIxMjM0XCInKTtcbn0pO1xuXG4vKipcbiAqIFJldHVybiB0d28gVG9rZW5zLCBvbmUgb2Ygd2hpY2ggZXZhbHVhdGVzIHRvIGEgVG9rZW4gZGlyZWN0bHksIG9uZSB3aGljaCBldmFsdWF0ZXMgdG8gaXQgbGF6aWx5XG4gKi9cbmZ1bmN0aW9uIHRva2Vuc1RoYXRSZXNvbHZlVG8odmFsdWU6IGFueSk6IFRva2VuW10ge1xuICByZXR1cm4gW1xuICAgIG5ldyBJbnRyaW5zaWModmFsdWUpLFxuICAgIExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdmFsdWUgfSksXG4gIF07XG59XG5cbmNsYXNzIER1bW15UG9zdFByb2Nlc3NvciBpbXBsZW1lbnRzIElSZXNvbHZhYmxlLCBJUG9zdFByb2Nlc3NvciB7XG4gIHB1YmxpYyByZWFkb25seSBjcmVhdGlvblN0YWNrOiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLmNyZWF0aW9uU3RhY2sgPSBbJ3Rlc3QnXTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlKGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCkge1xuICAgIGNvbnRleHQucmVnaXN0ZXJQb3N0UHJvY2Vzc29yKHRoaXMpO1xuICAgIHJldHVybiBjb250ZXh0LnJlc29sdmUodGhpcy52YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgcG9zdFByb2Nlc3MobzogYW55LCBfY29udGV4dDogSVJlc29sdmVDb250ZXh0KTogYW55IHtcbiAgICByZXR1cm4gbztcbiAgfVxufVxuIl19