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
            expect((0, evaluate_cfn_1.evaluateCFN)(resolved)).toEqual('{"name":"Fido","speaks":"woof woof"}');
        }
    });
    test('string tokens can be embedded while being JSONified', () => {
        for (const token of tokensThatResolveTo('woof woof')) {
            // GIVEN
            const fido = { name: 'Fido', speaks: `deep ${token}` };
            // WHEN
            const resolved = stack.resolve(stack.toJsonString(fido));
            // THEN
            expect((0, evaluate_cfn_1.evaluateCFN)(resolved)).toEqual('{"name":"Fido","speaks":"deep woof woof"}');
        }
    });
    test('constant string has correct amount of quotes applied', () => {
        const inputString = 'Hello, "world"';
        // WHEN
        const resolved = stack.resolve(stack.toJsonString(inputString));
        // THEN
        expect((0, evaluate_cfn_1.evaluateCFN)(resolved)).toEqual(JSON.stringify(inputString));
    });
    test('integer Tokens behave correctly in stringification and JSONification', () => {
        // GIVEN
        const num = new intrinsic_1.Intrinsic(1);
        const embedded = `the number is ${num}`;
        // WHEN
        expect((0, evaluate_cfn_1.evaluateCFN)(stack.resolve(embedded))).toEqual('the number is 1');
        expect((0, evaluate_cfn_1.evaluateCFN)(stack.resolve(stack.toJsonString({ embedded })))).toEqual('{"embedded":"the number is 1"}');
        expect((0, evaluate_cfn_1.evaluateCFN)(stack.resolve(stack.toJsonString({ num })))).toEqual('{"num":1}');
    });
    test('String-encoded lazies do not have quotes applied if they return objects', () => {
        // This is unfortunately crazy behavior, but we have some clients already taking a
        // dependency on the fact that `Lazy.string({ produce: () => [...some list...] })`
        // does not apply quotes but just renders the list.
        // GIVEN
        const someList = lib_1.Lazy.string({ produce: () => [1, 2, 3] });
        // WHEN
        expect((0, evaluate_cfn_1.evaluateCFN)(stack.resolve(stack.toJsonString({ someList })))).toEqual('{"someList":[1,2,3]}');
    });
    test('Literal-resolving List Tokens do not have quotes applied', () => {
        // GIVEN
        const someList = lib_1.Token.asList([1, 2, 3]);
        // WHEN
        expect((0, evaluate_cfn_1.evaluateCFN)(stack.resolve(stack.toJsonString({ someList })))).toEqual('{"someList":[1,2,3]}');
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
            expect((0, evaluate_cfn_1.evaluateCFN)(stack.resolve(stringified))).toEqual('"ping? pong!"');
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
        expect((0, evaluate_cfn_1.evaluateCFN)(resolved)).toEqual('{"information":"Did you know that Fido says: woof"}');
    });
    test('Quoted strings in embedded JSON context are escaped', () => {
        // GIVEN
        const fidoSays = lib_1.Lazy.string({ produce: () => '"woof"' });
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({
            information: `Did you know that Fido says: ${fidoSays}`,
        }));
        // THEN
        expect((0, evaluate_cfn_1.evaluateCFN)(resolved)).toEqual('{"information":"Did you know that Fido says: \\"woof\\""}');
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
        expect((0, evaluate_cfn_1.evaluateCFN)(resolved, context)).toEqual('{"theBucket":"TheName"}');
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
        expect((0, evaluate_cfn_1.evaluateCFN)(stack.resolve(stringified))).toEqual('{"a":{"Fn::GetArtifactAtt":{"key":"val"}},"b":{"Fn::GetParam":["val1","val2"]}}');
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
        expect((0, evaluate_cfn_1.evaluateCFN)(resolved, context)).toEqual(expected);
    });
    test('embedded string literals are escaped in Fn.sub (implicit references)', () => {
        // GIVEN
        const token = lib_1.Fn.sub('I am in account "${AWS::AccountId}"');
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({ token }));
        // THEN
        const context = { 'AWS::AccountId': '1234' };
        const expected = '{"token":"I am in account \\"1234\\""}';
        expect((0, evaluate_cfn_1.evaluateCFN)(resolved, context)).toEqual(expected);
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
        expect((0, evaluate_cfn_1.evaluateCFN)(resolved, context)).toEqual(expected);
    });
    test('Tokens in Tokens are handled correctly', () => {
        // GIVEN
        const bucketName = new intrinsic_1.Intrinsic({ Ref: 'MyBucket' });
        const combinedName = lib_1.Fn.join('', ['The bucket name is ', bucketName.toString()]);
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({ theBucket: combinedName }));
        // THEN
        const context = { MyBucket: 'TheName' };
        expect((0, evaluate_cfn_1.evaluateCFN)(resolved, context)).toEqual('{"theBucket":"The bucket name is TheName"}');
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
        expect((0, evaluate_cfn_1.evaluateCFN)(resolved)).toEqual('{"information":"Did you know that Fido says: woof"}');
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
        expect((0, evaluate_cfn_1.evaluateCFN)(resolved, context)).toEqual('{"information":"Did you know that Fido says: woof woof"}');
    });
    test('Nested strings are quoted correctly', () => {
        const fidoSays = lib_1.Lazy.string({ produce: () => '"woof"' });
        // WHEN
        const resolved = stack.resolve(stack.toJsonString({
            information: `Did you know that Fido says: ${fidoSays}`,
        }));
        // THEN
        expect((0, evaluate_cfn_1.evaluateCFN)(resolved)).toEqual('{"information":"Did you know that Fido says: \\"woof\\""}');
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
        expect((0, evaluate_cfn_1.evaluateCFN)(resolved, context)).toEqual('{"Harry":"Is Cool","Harry Is":"Cool"}');
    });
    test('toJsonString() can be used recursively', () => {
        // GIVEN
        const bucketName = lib_1.Token.asString({ Ref: 'MyBucket' });
        // WHEN
        const embeddedJson = stack.toJsonString({ message: `the bucket name is ${bucketName}` });
        const outerJson = stack.toJsonString({ embeddedJson });
        // THEN
        const evaluatedJson = (0, evaluate_cfn_1.evaluateCFN)(stack.resolve(outerJson), {
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
    const evaluated = (0, evaluate_cfn_1.evaluateCFN)(resolved, context);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWRmb3JtYXRpb24tanNvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xvdWRmb3JtYXRpb24tanNvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQTZDO0FBQzdDLGdDQUFnSTtBQUNoSSx3REFBcUQ7QUFFckQsSUFBSSxHQUFRLENBQUM7QUFDYixJQUFJLEtBQVksQ0FBQztBQUNqQixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsR0FBRyxHQUFHLElBQUksU0FBRyxFQUFFLENBQUM7SUFDaEIsS0FBSyxHQUFHLElBQUksV0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7SUFDL0QsTUFBTSxTQUFTLEdBQUc7UUFDaEIsYUFBYSxFQUFFLFNBQVM7UUFDeEIsWUFBWSxFQUFFO1lBQ1osS0FBSyxFQUFFLFNBQVM7WUFDaEIsS0FBSyxFQUFFLEtBQUs7WUFDWixLQUFLLEVBQUUsRUFBRTtZQUNULEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2pCO0tBQ0YsQ0FBQztJQUVGLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDeEYsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRyxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQywr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SUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUM5RixDQUFDLENBQUMsQ0FBQztBQUVIOztHQUVHO0FBQ0gsU0FBUyxtQkFBbUIsQ0FBQyxLQUFVO0lBQ3JDLE9BQU87UUFDTCxJQUFJLHFCQUFTLENBQUMsS0FBSyxDQUFDO1FBQ3BCLFVBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDbkMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLGtCQUFrQjtJQUd0QixZQUE2QixLQUFVO1FBQVYsVUFBSyxHQUFMLEtBQUssQ0FBSztRQUNyQyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDL0I7SUFFTSxPQUFPLENBQUMsT0FBd0I7UUFDckMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDcEM7SUFFTSxXQUFXLENBQUMsQ0FBTSxFQUFFLFFBQXlCO1FBQ2xELE9BQU8sQ0FBQyxDQUFDO0tBQ1Y7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV2YWx1YXRlQ0ZOIH0gZnJvbSAnLi9ldmFsdWF0ZS1jZm4nO1xuaW1wb3J0IHsgQXBwLCBBd3MsIENmbk91dHB1dCwgQ2ZuUmVzb3VyY2UsIEZuLCBJUG9zdFByb2Nlc3NvciwgSVJlc29sdmFibGUsIElSZXNvbHZlQ29udGV4dCwgTGF6eSwgU3RhY2ssIFRva2VuIH0gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IEludHJpbnNpYyB9IGZyb20gJy4uL2xpYi9wcml2YXRlL2ludHJpbnNpYyc7XG5cbmxldCBhcHA6IEFwcDtcbmxldCBzdGFjazogU3RhY2s7XG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgYXBwID0gbmV3IEFwcCgpO1xuICBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycpO1xufSk7XG5cbnRlc3QoJ0pTT05pZmljYXRpb24gb2YgbGl0ZXJhbHMgbG9va3MgbGlrZSBKU09OLnN0cmluZ2lmeScsICgpID0+IHtcbiAgY29uc3Qgc3RydWN0dXJlID0ge1xuICAgIHVuZGVmaW5lZFByb3A6IHVuZGVmaW5lZCxcbiAgICBuZXN0ZWRPYmplY3Q6IHtcbiAgICAgIHByb3AxOiB1bmRlZmluZWQsXG4gICAgICBwcm9wMjogJ2FiYycsXG4gICAgICBwcm9wMzogNDIsXG4gICAgICBwcm9wNDogWzEsIDIsIDNdLFxuICAgIH0sXG4gIH07XG5cbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHN0cnVjdHVyZSkpKS50b0VxdWFsKEpTT04uc3RyaW5naWZ5KHN0cnVjdHVyZSkpO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzdGFjay50b0pzb25TdHJpbmcoc3RydWN0dXJlLCAyKSkpLnRvRXF1YWwoSlNPTi5zdHJpbmdpZnkoc3RydWN0dXJlLCB1bmRlZmluZWQsIDIpKTtcbn0pO1xuXG50ZXN0KCdKU09OaWZpY2F0aW9uIG9mIHVuZGVmaW5lZCBsZWFkcyB0byB1bmRlZmluZWQnLCAoKSA9PiB7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyh1bmRlZmluZWQpKSkudG9FcXVhbCh1bmRlZmluZWQpO1xufSk7XG5cbmRlc2NyaWJlKCd0b2tlbnMgdGhhdCByZXR1cm4gbGl0ZXJhbHMnLCAoKSA9PiB7XG5cbiAgdGVzdCgnc3RyaW5nIHRva2VucyBjYW4gYmUgSlNPTmlmaWVkIGFuZCBKU09OaWZpY2F0aW9uIGNhbiBiZSByZXZlcnNlZCcsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHRva2Vuc1RoYXRSZXNvbHZlVG8oJ3dvb2Ygd29vZicpKSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZmlkbyA9IHsgbmFtZTogJ0ZpZG8nLCBzcGVha3M6IHRva2VuIH07XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHJlc29sdmVkID0gc3RhY2sucmVzb2x2ZShzdGFjay50b0pzb25TdHJpbmcoZmlkbykpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoZXZhbHVhdGVDRk4ocmVzb2x2ZWQpKS50b0VxdWFsKCd7XCJuYW1lXCI6XCJGaWRvXCIsXCJzcGVha3NcIjpcIndvb2Ygd29vZlwifScpO1xuICAgIH1cbiAgfSk7XG5cbiAgdGVzdCgnc3RyaW5nIHRva2VucyBjYW4gYmUgZW1iZWRkZWQgd2hpbGUgYmVpbmcgSlNPTmlmaWVkJywgKCkgPT4ge1xuICAgIGZvciAoY29uc3QgdG9rZW4gb2YgdG9rZW5zVGhhdFJlc29sdmVUbygnd29vZiB3b29mJykpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBmaWRvID0geyBuYW1lOiAnRmlkbycsIHNwZWFrczogYGRlZXAgJHt0b2tlbn1gIH07XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHJlc29sdmVkID0gc3RhY2sucmVzb2x2ZShzdGFjay50b0pzb25TdHJpbmcoZmlkbykpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoZXZhbHVhdGVDRk4ocmVzb2x2ZWQpKS50b0VxdWFsKCd7XCJuYW1lXCI6XCJGaWRvXCIsXCJzcGVha3NcIjpcImRlZXAgd29vZiB3b29mXCJ9Jyk7XG4gICAgfVxuICB9KTtcblxuICB0ZXN0KCdjb25zdGFudCBzdHJpbmcgaGFzIGNvcnJlY3QgYW1vdW50IG9mIHF1b3RlcyBhcHBsaWVkJywgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0U3RyaW5nID0gJ0hlbGxvLCBcIndvcmxkXCInO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlc29sdmVkID0gc3RhY2sucmVzb2x2ZShzdGFjay50b0pzb25TdHJpbmcoaW5wdXRTdHJpbmcpKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoZXZhbHVhdGVDRk4ocmVzb2x2ZWQpKS50b0VxdWFsKEpTT04uc3RyaW5naWZ5KGlucHV0U3RyaW5nKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ludGVnZXIgVG9rZW5zIGJlaGF2ZSBjb3JyZWN0bHkgaW4gc3RyaW5naWZpY2F0aW9uIGFuZCBKU09OaWZpY2F0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgbnVtID0gbmV3IEludHJpbnNpYygxKTtcbiAgICBjb25zdCBlbWJlZGRlZCA9IGB0aGUgbnVtYmVyIGlzICR7bnVtfWA7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHN0YWNrLnJlc29sdmUoZW1iZWRkZWQpKSkudG9FcXVhbCgndGhlIG51bWJlciBpcyAxJyk7XG4gICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHsgZW1iZWRkZWQgfSkpKSkudG9FcXVhbCgne1wiZW1iZWRkZWRcIjpcInRoZSBudW1iZXIgaXMgMVwifScpO1xuICAgIGV4cGVjdChldmFsdWF0ZUNGTihzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyh7IG51bSB9KSkpKS50b0VxdWFsKCd7XCJudW1cIjoxfScpO1xuICB9KTtcblxuICB0ZXN0KCdTdHJpbmctZW5jb2RlZCBsYXppZXMgZG8gbm90IGhhdmUgcXVvdGVzIGFwcGxpZWQgaWYgdGhleSByZXR1cm4gb2JqZWN0cycsICgpID0+IHtcbiAgICAvLyBUaGlzIGlzIHVuZm9ydHVuYXRlbHkgY3JhenkgYmVoYXZpb3IsIGJ1dCB3ZSBoYXZlIHNvbWUgY2xpZW50cyBhbHJlYWR5IHRha2luZyBhXG4gICAgLy8gZGVwZW5kZW5jeSBvbiB0aGUgZmFjdCB0aGF0IGBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IFsuLi5zb21lIGxpc3QuLi5dIH0pYFxuICAgIC8vIGRvZXMgbm90IGFwcGx5IHF1b3RlcyBidXQganVzdCByZW5kZXJzIHRoZSBsaXN0LlxuXG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzb21lTGlzdCA9IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gWzEsIDIsIDNdIGFzIGFueSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoZXZhbHVhdGVDRk4oc3RhY2sucmVzb2x2ZShzdGFjay50b0pzb25TdHJpbmcoeyBzb21lTGlzdCB9KSkpKS50b0VxdWFsKCd7XCJzb21lTGlzdFwiOlsxLDIsM119Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0xpdGVyYWwtcmVzb2x2aW5nIExpc3QgVG9rZW5zIGRvIG5vdCBoYXZlIHF1b3RlcyBhcHBsaWVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc29tZUxpc3QgPSBUb2tlbi5hc0xpc3QoWzEsIDIsIDNdKTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoZXZhbHVhdGVDRk4oc3RhY2sucmVzb2x2ZShzdGFjay50b0pzb25TdHJpbmcoeyBzb21lTGlzdCB9KSkpKS50b0VxdWFsKCd7XCJzb21lTGlzdFwiOlsxLDIsM119Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0ludHJpbnNpYy1yZXNvbHZpbmcgTGlzdCBUb2tlbnMgZG8gbm90IGhhdmUgcXVvdGVzIGFwcGxpZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzb21lTGlzdCA9IFRva2VuLmFzTGlzdChuZXcgSW50cmluc2ljKHsgUmVmOiAnVGhpbmcnIH0pKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdBV1M6OkJhbmFuYScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNvbWVKc29uOiBzdGFjay50b0pzb25TdHJpbmcoeyBzb21lTGlzdCB9KSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGFzbS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIGNvbnN0IHN0cmluZ2lmeUxvZ2ljYWxJZCA9IE9iamVjdC5rZXlzKHRlbXBsYXRlLlJlc291cmNlcykuZmlsdGVyKGlkID0+IGlkLnN0YXJ0c1dpdGgoJ0Nka0pzb25TdHJpbmdpZnknKSlbMF07XG4gICAgZXhwZWN0KHN0cmluZ2lmeUxvZ2ljYWxJZCkudG9CZURlZmluZWQoKTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZS5SZXNvdXJjZXMuUmVzb3VyY2UuUHJvcGVydGllcy5zb21lSnNvbikudG9FcXVhbCh7XG4gICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgJ3tcInNvbWVMaXN0XCI6JyxcbiAgICAgICAgeyAnRm46OkdldEF0dCc6IFtzdHJpbmdpZnlMb2dpY2FsSWQsICdWYWx1ZSddIH0sXG4gICAgICAgICd9JyxcbiAgICAgIF1dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0b2tlbnMgaW4gc3RyaW5ncyBzdXJ2aXZlIGFkZGl0aW9uYWwgVG9rZW5KU09OLnN0cmluZ2lmaWNhdGlvbigpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgZm9yIChjb25zdCB0b2tlbiBvZiB0b2tlbnNUaGF0UmVzb2x2ZVRvKCdwb25nIScpKSB7XG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzdHJpbmdpZmllZCA9IHN0YWNrLnRvSnNvblN0cmluZyhgcGluZz8gJHt0b2tlbn1gKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHN0YWNrLnJlc29sdmUoc3RyaW5naWZpZWQpKSkudG9FcXVhbCgnXCJwaW5nPyBwb25nIVwiJyk7XG4gICAgfVxuICB9KTtcblxuICB0ZXN0KCdEb3VibHkgbmVzdGVkIHN0cmluZ3MgZXZhbHVhdGUgY29ycmVjdGx5IGluIEpTT04gY29udGV4dCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgZmlkb1NheXMgPSBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICd3b29mJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNvbHZlZCA9IHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHtcbiAgICAgIGluZm9ybWF0aW9uOiBgRGlkIHlvdSBrbm93IHRoYXQgRmlkbyBzYXlzOiAke2ZpZG9TYXlzfWAsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChldmFsdWF0ZUNGTihyZXNvbHZlZCkpLnRvRXF1YWwoJ3tcImluZm9ybWF0aW9uXCI6XCJEaWQgeW91IGtub3cgdGhhdCBGaWRvIHNheXM6IHdvb2ZcIn0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnUXVvdGVkIHN0cmluZ3MgaW4gZW1iZWRkZWQgSlNPTiBjb250ZXh0IGFyZSBlc2NhcGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZmlkb1NheXMgPSBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICdcIndvb2ZcIicgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVzb2x2ZWQgPSBzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyh7XG4gICAgICBpbmZvcm1hdGlvbjogYERpZCB5b3Uga25vdyB0aGF0IEZpZG8gc2F5czogJHtmaWRvU2F5c31gLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoZXZhbHVhdGVDRk4ocmVzb2x2ZWQpKS50b0VxdWFsKCd7XCJpbmZvcm1hdGlvblwiOlwiRGlkIHlvdSBrbm93IHRoYXQgRmlkbyBzYXlzOiBcXFxcXCJ3b29mXFxcXFwiXCJ9Jyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCd0b2tlbnMgcmV0dXJuaW5nIENsb3VkRm9ybWF0aW9uIGludHJpbnNpY3MnLCAoKSA9PiB7XG4gIHRlc3QoJ2ludHJpbnNpYyBUb2tlbnMgZW1iZWQgY29ycmVjdGx5IGluIEpTT05pZmljYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBidWNrZXROYW1lID0gbmV3IEludHJpbnNpYyh7IFJlZjogJ015QnVja2V0JyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNvbHZlZCA9IHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHsgdGhlQnVja2V0OiBidWNrZXROYW1lIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBjb250ZXh0ID0geyBNeUJ1Y2tldDogJ1RoZU5hbWUnIH07XG4gICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHJlc29sdmVkLCBjb250ZXh0KSkudG9FcXVhbCgne1widGhlQnVja2V0XCI6XCJUaGVOYW1lXCJ9Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Zha2UgaW50cmluc2ljcyBhcmUgc2VyaWFsaXplZCB0byBvYmplY3RzJywgKCkgPT4ge1xuICAgIGNvbnN0IGZha2VJbnRyaW5zaWNzID0gbmV3IEludHJpbnNpYyh7XG4gICAgICBhOiB7XG4gICAgICAgICdGbjo6R2V0QXJ0aWZhY3RBdHQnOiB7XG4gICAgICAgICAga2V5OiAndmFsJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBiOiB7XG4gICAgICAgICdGbjo6R2V0UGFyYW0nOiBbXG4gICAgICAgICAgJ3ZhbDEnLFxuICAgICAgICAgICd2YWwyJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdHJpbmdpZmllZCA9IHN0YWNrLnRvSnNvblN0cmluZyhmYWtlSW50cmluc2ljcyk7XG4gICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHN0YWNrLnJlc29sdmUoc3RyaW5naWZpZWQpKSkudG9FcXVhbChcbiAgICAgICd7XCJhXCI6e1wiRm46OkdldEFydGlmYWN0QXR0XCI6e1wia2V5XCI6XCJ2YWxcIn19LFwiYlwiOntcIkZuOjpHZXRQYXJhbVwiOltcInZhbDFcIixcInZhbDJcIl19fScpO1xuICB9KTtcblxuICB0ZXN0KCdlbWJlZGRlZCBzdHJpbmcgbGl0ZXJhbHMgaW4gaW50cmluc2ljcyBhcmUgZXNjYXBlZCB3aGVuIGNhbGxpbmcgVG9rZW5KU09OLnN0cmluZ2lmeSgpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdG9rZW4gPSBGbi5qb2luKCcnLCBbJ0hlbGxvICcsIFRva2VuLmFzU3RyaW5nKHsgUmVmOiAnUGxhbmV0JyB9KSwgJywgdGhpc1xcbklzJywgJ1ZlcnkgXCJjb29sXCInXSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVzb2x2ZWQgPSBzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyh7XG4gICAgICBsaXRlcmFsOiAnSSBjYW4gYWxzbyBcImNvbnRhaW5cIiBxdW90ZXMnLFxuICAgICAgdG9rZW4sXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGNvbnRleHQgPSB7IFBsYW5ldDogJ1dvcmxkJyB9O1xuICAgIGNvbnN0IGV4cGVjdGVkID0gJ3tcImxpdGVyYWxcIjpcIkkgY2FuIGFsc28gXFxcXFwiY29udGFpblxcXFxcIiBxdW90ZXNcIixcInRva2VuXCI6XCJIZWxsbyBXb3JsZCwgdGhpc1xcXFxuSXNWZXJ5IFxcXFxcImNvb2xcXFxcXCJcIn0nO1xuICAgIGV4cGVjdChldmFsdWF0ZUNGTihyZXNvbHZlZCwgY29udGV4dCkpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuICB9KTtcblxuICB0ZXN0KCdlbWJlZGRlZCBzdHJpbmcgbGl0ZXJhbHMgYXJlIGVzY2FwZWQgaW4gRm4uc3ViIChpbXBsaWNpdCByZWZlcmVuY2VzKScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHRva2VuID0gRm4uc3ViKCdJIGFtIGluIGFjY291bnQgXCIke0FXUzo6QWNjb3VudElkfVwiJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVzb2x2ZWQgPSBzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyh7IHRva2VuIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBjb250ZXh0ID0geyAnQVdTOjpBY2NvdW50SWQnOiAnMTIzNCcgfTtcbiAgICBjb25zdCBleHBlY3RlZCA9ICd7XCJ0b2tlblwiOlwiSSBhbSBpbiBhY2NvdW50IFxcXFxcIjEyMzRcXFxcXCJcIn0nO1xuICAgIGV4cGVjdChldmFsdWF0ZUNGTihyZXNvbHZlZCwgY29udGV4dCkpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuICB9KTtcblxuICB0ZXN0KCdlbWJlZGRlZCBzdHJpbmcgbGl0ZXJhbHMgYXJlIGVzY2FwZWQgaW4gRm4uc3ViIChleHBsaWNpdCByZWZlcmVuY2VzKScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHRva2VuID0gRm4uc3ViKCdJIGFtIGluIGFjY291bnQgXCIke0FjY3R9XCIsIGFsc28gd2FudGVkIHRvIHNheTogJHtBbHNvfScsIHtcbiAgICAgIEFjY3Q6IEF3cy5BQ0NPVU5UX0lELFxuICAgICAgQWxzbzogJ1wiaGVsbG8gd29ybGRcIicsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVzb2x2ZWQgPSBzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyh7IHRva2VuIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBjb250ZXh0ID0geyAnQVdTOjpBY2NvdW50SWQnOiAnMTIzNCcgfTtcbiAgICBjb25zdCBleHBlY3RlZCA9ICd7XCJ0b2tlblwiOlwiSSBhbSBpbiBhY2NvdW50IFxcXFxcIjEyMzRcXFxcXCIsIGFsc28gd2FudGVkIHRvIHNheTogXFxcXFwiaGVsbG8gd29ybGRcXFxcXCJcIn0nO1xuICAgIGV4cGVjdChldmFsdWF0ZUNGTihyZXNvbHZlZCwgY29udGV4dCkpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuICB9KTtcblxuICB0ZXN0KCdUb2tlbnMgaW4gVG9rZW5zIGFyZSBoYW5kbGVkIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGJ1Y2tldE5hbWUgPSBuZXcgSW50cmluc2ljKHsgUmVmOiAnTXlCdWNrZXQnIH0pO1xuICAgIGNvbnN0IGNvbWJpbmVkTmFtZSA9IEZuLmpvaW4oJycsIFsnVGhlIGJ1Y2tldCBuYW1lIGlzICcsIGJ1Y2tldE5hbWUudG9TdHJpbmcoKV0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlc29sdmVkID0gc3RhY2sucmVzb2x2ZShzdGFjay50b0pzb25TdHJpbmcoeyB0aGVCdWNrZXQ6IGNvbWJpbmVkTmFtZSB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgY29udGV4dCA9IHsgTXlCdWNrZXQ6ICdUaGVOYW1lJyB9O1xuICAgIGV4cGVjdChldmFsdWF0ZUNGTihyZXNvbHZlZCwgY29udGV4dCkpLnRvRXF1YWwoJ3tcInRoZUJ1Y2tldFwiOlwiVGhlIGJ1Y2tldCBuYW1lIGlzIFRoZU5hbWVcIn0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnSW50cmluc2ljcyBpbiBwb3N0cHJvY2Vzc29ycyBhcmUgaGFuZGxlZCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBidWNrZXROYW1lID0gbmV3IEludHJpbnNpYyh7IFJlZjogJ015QnVja2V0JyB9KTtcbiAgICBjb25zdCBjb21iaW5lZE5hbWUgPSBuZXcgRHVtbXlQb3N0UHJvY2Vzc29yKFsndGhpcycsICdpcycsIGJ1Y2tldE5hbWVdKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNvbHZlZCA9IHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHsgdGhlQnVja2V0OiBjb21iaW5lZE5hbWUgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZXNvbHZlZCkudG9FcXVhbCh7XG4gICAgICAnRm46OkpvaW4nOiBbJycsIFsne1widGhlQnVja2V0XCI6W1widGhpc1wiLFwiaXNcIixcIicsIHsgUmVmOiAnTXlCdWNrZXQnIH0sICdcIl19J11dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdEb3VibHkgbmVzdGVkIHN0cmluZ3MgZXZhbHVhdGUgY29ycmVjdGx5IGluIEpTT04gY29udGV4dCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgZmlkb1NheXMgPSBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICd3b29mJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNvbHZlZCA9IHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHtcbiAgICAgIGluZm9ybWF0aW9uOiBgRGlkIHlvdSBrbm93IHRoYXQgRmlkbyBzYXlzOiAke2ZpZG9TYXlzfWAsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChldmFsdWF0ZUNGTihyZXNvbHZlZCkpLnRvRXF1YWwoJ3tcImluZm9ybWF0aW9uXCI6XCJEaWQgeW91IGtub3cgdGhhdCBGaWRvIHNheXM6IHdvb2ZcIn0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnRG91Ymx5IG5lc3RlZCBpbnRyaW5zaWNzIGV2YWx1YXRlIGNvcnJlY3RseSBpbiBKU09OIGNvbnRleHQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBmaWRvU2F5cyA9IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gKHsgUmVmOiAnU29tZXRoaW5nJyB9KSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNvbHZlZCA9IHN0YWNrLnJlc29sdmUoc3RhY2sudG9Kc29uU3RyaW5nKHtcbiAgICAgIGluZm9ybWF0aW9uOiBgRGlkIHlvdSBrbm93IHRoYXQgRmlkbyBzYXlzOiAke2ZpZG9TYXlzfWAsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGNvbnRleHQgPSB7IFNvbWV0aGluZzogJ3dvb2Ygd29vZicgfTtcbiAgICBleHBlY3QoZXZhbHVhdGVDRk4ocmVzb2x2ZWQsIGNvbnRleHQpKS50b0VxdWFsKCd7XCJpbmZvcm1hdGlvblwiOlwiRGlkIHlvdSBrbm93IHRoYXQgRmlkbyBzYXlzOiB3b29mIHdvb2ZcIn0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnTmVzdGVkIHN0cmluZ3MgYXJlIHF1b3RlZCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgY29uc3QgZmlkb1NheXMgPSBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICdcIndvb2ZcIicgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVzb2x2ZWQgPSBzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyh7XG4gICAgICBpbmZvcm1hdGlvbjogYERpZCB5b3Uga25vdyB0aGF0IEZpZG8gc2F5czogJHtmaWRvU2F5c31gLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoZXZhbHVhdGVDRk4ocmVzb2x2ZWQpKS50b0VxdWFsKCd7XCJpbmZvcm1hdGlvblwiOlwiRGlkIHlvdSBrbm93IHRoYXQgRmlkbyBzYXlzOiBcXFxcXCJ3b29mXFxcXFwiXCJ9Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nyb3NzLXN0YWNrIHJlZmVyZW5jZXMgYXJlIGFsc28gcHJvcGVybHkgY29udmVydGVkIGJ5IHRvSnNvblN0cmluZygpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrMiwgJ1N0YWNrMUlkJywge1xuICAgICAgdmFsdWU6IHN0YWNrMi50b0pzb25TdHJpbmcoe1xuICAgICAgICBTdGFjazFJZDogc3RhY2sxLnN0YWNrSWQsXG4gICAgICAgIFN0YWNrMklkOiBzdGFjazIuc3RhY2tJZCxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzbSA9IGFwcC5zeW50aCgpO1xuICAgIGV4cGVjdChhc20uZ2V0U3RhY2tCeU5hbWUoJ1N0YWNrMicpLnRlbXBsYXRlPy5PdXRwdXRzKS50b0VxdWFsKHtcbiAgICAgIFN0YWNrMUlkOiB7XG4gICAgICAgIFZhbHVlOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAne1wiU3RhY2sxSWRcIjpcIicsXG4gICAgICAgICAgICB7ICdGbjo6SW1wb3J0VmFsdWUnOiAnU3RhY2sxOkV4cG9ydHNPdXRwdXRSZWZBV1NTdGFja0lkQjJERDVCQUEnIH0sXG4gICAgICAgICAgICAnXCIsXCJTdGFjazJJZFwiOlwiJyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpTdGFja0lkJyB9LFxuICAgICAgICAgICAgJ1wifScsXG4gICAgICAgICAgXV0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdJbnRyaW5zaWNzIGNhbiBvY2N1ciBpbiBrZXkgcG9zaXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBidWNrZXROYW1lID0gVG9rZW4uYXNTdHJpbmcoeyBSZWY6ICdNeUJ1Y2tldCcgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVzb2x2ZWQgPSBzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyh7XG4gICAgICBbYnVja2V0TmFtZV06ICdJcyBDb29sJyxcbiAgICAgIFtgJHtidWNrZXROYW1lfSBJc2BdOiAnQ29vbCcsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGNvbnRleHQgPSB7IE15QnVja2V0OiAnSGFycnknIH07XG4gICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHJlc29sdmVkLCBjb250ZXh0KSkudG9FcXVhbCgne1wiSGFycnlcIjpcIklzIENvb2xcIixcIkhhcnJ5IElzXCI6XCJDb29sXCJ9Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3RvSnNvblN0cmluZygpIGNhbiBiZSB1c2VkIHJlY3Vyc2l2ZWx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYnVja2V0TmFtZSA9IFRva2VuLmFzU3RyaW5nKHsgUmVmOiAnTXlCdWNrZXQnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGVtYmVkZGVkSnNvbiA9IHN0YWNrLnRvSnNvblN0cmluZyh7IG1lc3NhZ2U6IGB0aGUgYnVja2V0IG5hbWUgaXMgJHtidWNrZXROYW1lfWAgfSk7XG4gICAgY29uc3Qgb3V0ZXJKc29uID0gc3RhY2sudG9Kc29uU3RyaW5nKHsgZW1iZWRkZWRKc29uIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGV2YWx1YXRlZEpzb24gPSBldmFsdWF0ZUNGTihzdGFjay5yZXNvbHZlKG91dGVySnNvbiksIHtcbiAgICAgIE15QnVja2V0OiAnQnVja3knLFxuICAgIH0pO1xuICAgIGV4cGVjdChldmFsdWF0ZWRKc29uKS50b0VxdWFsKCd7XCJlbWJlZGRlZEpzb25cIjpcIntcXFxcXCJtZXNzYWdlXFxcXFwiOlxcXFxcInRoZSBidWNrZXQgbmFtZSBpcyBCdWNreVxcXFxcIn1cIn0nKTtcbiAgICBleHBlY3QoSlNPTi5wYXJzZShKU09OLnBhcnNlKGV2YWx1YXRlZEpzb24pLmVtYmVkZGVkSnNvbikubWVzc2FnZSkudG9FcXVhbCgndGhlIGJ1Y2tldCBuYW1lIGlzIEJ1Y2t5Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0V2ZXJ5IFRva2VuIHVzZWQgaW5zaWRlIGEgSlNPTmlmaWVkIHN0cmluZyBpcyBnaXZlbiBhbiBvcHBvcnR1bml0eSB0byBiZSB1bmNhY2hlZCcsICgpID0+IHtcbiAgICAvLyBDaGVjayB0aGF0IHRva2VucyBhcmVuJ3QgYWNjaWRlbnRhbGx5IGZ1bGx5IHJlc29sdmVkIGJ5IHRoZSBmaXJzdCBpbnZvY2F0aW9uL3Jlc29sdXRpb25cbiAgICAvLyBvZiB0b0pzb25TdHJpbmcoKS4gT24gZXZlcnkgZXZhbHVhdGlvbiwgVG9rZW5zIHJlZmVyZW5jZWQgaW5zaWRlIHRoZSBzdHJ1Y3R1cmUgc2hvdWxkIGJlXG4gICAgLy8gZ2l2ZW4gYSBjaGFuY2UgdG8gYmUgZWl0aGVyIGNhY2hlZCBvciB1bmNhY2hlZC5cbiAgICAvL1xuICAgIC8vIChOT1RFOiBUaGlzIGRvZXMgbm90IGNoZWNrIHdoZXRoZXIgdGhlIGltcGxlbWVudGF0aW9uIG9mIHRvSnNvblN0cmluZygpIGl0c2VsZiBpcyBjYWNoZWQgb3JcbiAgICAvLyBub3Q7IHRoYXQgZGVwZW5kcyBvbiBhd3MvYXdzLWNkayMxMTIyNCBhbmQgc2hvdWxkIGJlIGRvbmUgaW4gYSBkaWZmZXJlbnQgUFIpLlxuXG4gICAgLy8gV0hFTlxuICAgIGxldCBjb3VudGVyID0gMDtcbiAgICBjb25zdCBjb3VudGVyU3RyaW5nID0gVG9rZW4uYXNTdHJpbmcoeyByZXNvbHZlOiAoKSA9PiBgJHsrK2NvdW50ZXJ9YCB9KTtcbiAgICBjb25zdCBqc29uU3RyaW5nID0gc3RhY2sudG9Kc29uU3RyaW5nKHsgY291bnRlclN0cmluZyB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShqc29uU3RyaW5nKSkudG9FcXVhbCgne1wiY291bnRlclN0cmluZ1wiOlwiMVwifScpO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGpzb25TdHJpbmcpKS50b0VxdWFsKCd7XCJjb3VudGVyU3RyaW5nXCI6XCIyXCJ9Jyk7XG4gIH0pO1xufSk7XG5cbnRlc3QoJ0pTT04gc3RyaW5ncyBuZXN0ZWQgaW5zaWRlIEpTT04gc3RyaW5ncyBoYXZlIGNvcnJlY3QgcXVvdGluZycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgcGF5bG9hZCA9IHN0YWNrLnRvSnNvblN0cmluZyh7XG4gICAgbWVzc2FnZTogRm4uc3ViKCdJIGFtIGluIGFjY291bnQgXCIke0FXUzo6QWNjb3VudElkfVwiJyksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgcmVzb2x2ZWQgPSBzdGFjay5yZXNvbHZlKHN0YWNrLnRvSnNvblN0cmluZyh7IHBheWxvYWQgfSkpO1xuXG4gIC8vIFRIRU5cbiAgY29uc3QgY29udGV4dCA9IHsgJ0FXUzo6QWNjb3VudElkJzogJzEyMzQnIH07XG4gIGNvbnN0IGV4cGVjdGVkID0gJ3tcInBheWxvYWRcIjpcIntcXFxcXCJtZXNzYWdlXFxcXFwiOlxcXFxcIkkgYW0gaW4gYWNjb3VudCBcXFxcXFxcXFxcXFxcIjEyMzRcXFxcXFxcXFxcXFxcIlxcXFxcIn1cIn0nO1xuICBjb25zdCBldmFsdWF0ZWQgPSBldmFsdWF0ZUNGTihyZXNvbHZlZCwgY29udGV4dCk7XG4gIGV4cGVjdChldmFsdWF0ZWQpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuXG4gIC8vIElzIHRoaXMgZXZlbiBjb3JyZWN0PyBMZXQncyBhc2sgSmF2YVNjcmlwdCBiZWNhdXNlIEkgaGF2ZSB0cm91YmxlIHJlYWRpbmcgdGhpcyBtYW55IGJhY2tzbGFzaGVzLlxuICBleHBlY3QoSlNPTi5wYXJzZShKU09OLnBhcnNlKGV2YWx1YXRlZCkucGF5bG9hZCkubWVzc2FnZSkudG9FcXVhbCgnSSBhbSBpbiBhY2NvdW50IFwiMTIzNFwiJyk7XG59KTtcblxuLyoqXG4gKiBSZXR1cm4gdHdvIFRva2Vucywgb25lIG9mIHdoaWNoIGV2YWx1YXRlcyB0byBhIFRva2VuIGRpcmVjdGx5LCBvbmUgd2hpY2ggZXZhbHVhdGVzIHRvIGl0IGxhemlseVxuICovXG5mdW5jdGlvbiB0b2tlbnNUaGF0UmVzb2x2ZVRvKHZhbHVlOiBhbnkpOiBUb2tlbltdIHtcbiAgcmV0dXJuIFtcbiAgICBuZXcgSW50cmluc2ljKHZhbHVlKSxcbiAgICBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHZhbHVlIH0pLFxuICBdO1xufVxuXG5jbGFzcyBEdW1teVBvc3RQcm9jZXNzb3IgaW1wbGVtZW50cyBJUmVzb2x2YWJsZSwgSVBvc3RQcm9jZXNzb3Ige1xuICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRpb25TdGFjazogc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5jcmVhdGlvblN0YWNrID0gWyd0ZXN0J107XG4gIH1cblxuICBwdWJsaWMgcmVzb2x2ZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpIHtcbiAgICBjb250ZXh0LnJlZ2lzdGVyUG9zdFByb2Nlc3Nvcih0aGlzKTtcbiAgICByZXR1cm4gY29udGV4dC5yZXNvbHZlKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHBvc3RQcm9jZXNzKG86IGFueSwgX2NvbnRleHQ6IElSZXNvbHZlQ29udGV4dCk6IGFueSB7XG4gICAgcmV0dXJuIG87XG4gIH1cbn1cbiJdfQ==