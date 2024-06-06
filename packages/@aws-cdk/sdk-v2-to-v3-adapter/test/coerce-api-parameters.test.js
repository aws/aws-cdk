"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coerce_api_parameters_1 = require("../lib/coerce-api-parameters");
const encode = (v) => new TextEncoder().encode(v);
describe('Uint8Array', () => {
    describe('should coerce', () => {
        test('a nested value', () => {
            // GIVEN
            const obj = { a: { b: { c: 'dummy-value' } } };
            // WHEN
            new coerce_api_parameters_1.Coercer([
                { a: 1 },
                { b: 2 },
                { c: 'b' },
            ]).testCoerce(obj);
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: encode('dummy-value') } } });
        });
        test('values nested in an array', () => {
            // GIVEN
            const obj = {
                a: {
                    b: [
                        { z: '1' },
                        { z: '2' },
                        { z: '3' },
                    ],
                },
            };
            // WHEN
            new coerce_api_parameters_1.Coercer([
                { a: 1 },
                { b: 2 },
                { '*': 3 },
                { z: 'b' },
            ]).testCoerce(obj);
            // EXPECT
            expect(obj).toMatchObject({
                a: {
                    b: [
                        { z: encode('1') },
                        { z: encode('2') },
                        { z: encode('3') },
                    ],
                },
            });
        });
        test('array elements', () => {
            // GIVEN
            const obj = {
                a: {
                    b: ['1', '2', '3'],
                },
            };
            // THEN
            new coerce_api_parameters_1.Coercer([
                { a: 1 },
                { b: 2 },
                { '*': 'b' },
            ]).testCoerce(obj);
            // EXPECT
            expect(obj).toMatchObject({
                a: {
                    b: [
                        encode('1'),
                        encode('2'),
                        encode('3'),
                    ],
                },
            });
        });
        test('values nested in multiple arrays', () => {
            // GIVEN
            const obj = {
                a: {
                    b: [
                        {
                            z: [
                                { y: '1' },
                                { y: '2' },
                            ],
                        },
                        {
                            z: [
                                { y: 'A' },
                                { y: 'B' },
                            ],
                        },
                    ],
                },
            };
            // THEN
            coerce(obj, ['a', 'b', '*', 'z', '*', 'y'], 'Uint8Array');
            // EXPECT
            expect(obj).toMatchObject({
                a: {
                    b: [
                        { z: [{ y: encode('1') }, { y: encode('2') }] },
                        { z: [{ y: encode('A') }, { y: encode('B') }] },
                    ],
                },
            });
        });
        test('empty string', () => {
            // GIVEN
            const obj = { a: { b: { c: '' } } };
            // THEN
            coerce(obj, ['a', 'b', 'c'], 'Uint8Array');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: encode('') } } });
        });
        test('a number', () => {
            // GIVEN
            const obj = { a: { b: { c: 0 } } };
            // THEN
            coerce(obj, ['a', 'b', 'c'], 'Uint8Array');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: encode('0') } } });
        });
    });
    describe('should NOT coerce', () => {
        test('undefined', () => {
            // GIVEN
            const obj = { a: { b: { c: undefined } } };
            // THEN
            coerce(obj, ['a', 'b', 'c'], 'Uint8Array');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: undefined } } });
        });
        test('null', () => {
            // GIVEN
            const obj = { a: { b: { c: null } } };
            // THEN
            coerce(obj, ['a', 'b', 'c'], 'Uint8Array');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: null } } });
        });
        test('an path that does not exist in input', () => {
            // GIVEN
            const obj = { a: { b: { c: 'dummy-value' } } };
            // THEN
            coerce(obj, ['a', 'b', 'foobar'], 'Uint8Array');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: 'dummy-value' } } });
        });
        test('a path that is not a leaf', () => {
            // GIVEN
            const obj = { a: { b: { c: 'dummy-value' } } };
            // THEN
            coerce(obj, ['a', 'b'], 'Uint8Array');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: 'dummy-value' } } });
        });
        test('do not change anything for empty path', () => {
            // GIVEN
            const obj = { a: { b: { c: 'dummy-value' } } };
            // THEN
            coerce(obj, [], 'Uint8Array');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: 'dummy-value' } } });
        });
    });
    describe('given an api call description', () => {
        test('can convert string parameters to Uint8Array when needed', () => {
            const params = (0, coerce_api_parameters_1.coerceApiParameters)('KMS', 'encrypt', {
                KeyId: 'key-id',
                Plaintext: 'dummy-data',
            });
            expect(params).toMatchObject({
                KeyId: 'key-id',
                Plaintext: new Uint8Array([
                    100, 117, 109, 109,
                    121, 45, 100, 97,
                    116, 97,
                ]),
            });
        });
        test('can convert string parameters to Uint8Array in arrays', () => {
            const params = (0, coerce_api_parameters_1.coerceApiParameters)('Kinesis', 'putRecords', {
                Records: [
                    {
                        Data: 'aaa',
                        PartitionKey: 'key',
                    },
                    {
                        Data: 'bbb',
                        PartitionKey: 'key',
                    },
                ],
            });
            expect(params).toMatchObject({
                Records: [
                    {
                        Data: new Uint8Array([97, 97, 97]),
                        PartitionKey: 'key',
                    },
                    {
                        Data: new Uint8Array([98, 98, 98]),
                        PartitionKey: 'key',
                    },
                ],
            });
        });
        test('can convert string parameters to Uint8Array in map & union', () => {
            const params = (0, coerce_api_parameters_1.coerceApiParameters)('dynamodb', 'putItem', {
                Item: {
                    Binary: {
                        B: 'abc',
                    },
                },
            });
            expect(params).toMatchObject({
                Item: {
                    Binary: {
                        B: new Uint8Array([97, 98, 99]),
                    },
                },
            });
        });
        test('can coerce parameters in recursive types', () => {
            const params = (0, coerce_api_parameters_1.coerceApiParameters)('connect', 'CreateEvaluationForm', {
                Items: [
                    {
                        Section: {
                            Items: [
                                {
                                    Question: {
                                        Weight: '9000',
                                    },
                                },
                            ],
                        },
                    },
                ],
            });
            expect(params).toMatchObject({
                Items: [
                    {
                        Section: {
                            Items: [
                                {
                                    Question: {
                                        Weight: 9000, // <-- converted
                                    },
                                },
                            ],
                        },
                    },
                ],
            });
        });
    });
});
describe('number', () => {
    describe('should coerce', () => {
        test('a nested value', () => {
            // GIVEN
            const obj = { a: { b: { c: '-123.45' } } };
            // THEN
            coerce(obj, ['a', 'b', 'c'], 'number');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: -123.45 } } });
        });
        test('values nested in an array', () => {
            // GIVEN
            const obj = {
                a: {
                    b: [
                        { z: '1' },
                        { z: '2' },
                        { z: '3' },
                    ],
                },
            };
            // THEN
            coerce(obj, ['a', 'b', '*', 'z'], 'number');
            // EXPECT
            expect(obj).toMatchObject({
                a: {
                    b: [
                        { z: 1 },
                        { z: 2 },
                        { z: 3 },
                    ],
                },
            });
        });
        test('array elements', () => {
            // GIVEN
            const obj = {
                a: {
                    b: ['1', '2', '3'],
                },
            };
            // THEN
            coerce(obj, ['a', 'b', '*'], 'number');
            // EXPECT
            expect(obj).toMatchObject({
                a: {
                    b: [
                        1,
                        2,
                        3,
                    ],
                },
            });
        });
        test('values nested in multiple arrays', () => {
            // GIVEN
            const obj = {
                a: {
                    b: [
                        {
                            z: [
                                { y: '1' },
                                { y: '2' },
                            ],
                        },
                        {
                            z: [
                                { y: '3' },
                                { y: '4' },
                            ],
                        },
                    ],
                },
            };
            // THEN
            coerce(obj, ['a', 'b', '*', 'z', '*', 'y'], 'number');
            // EXPECT
            expect(obj).toMatchObject({
                a: {
                    b: [
                        { z: [{ y: 1 }, { y: 2 }] },
                        { z: [{ y: 3 }, { y: 4 }] },
                    ],
                },
            });
        });
    });
    describe('should NOT coerce', () => {
        test('empty string', () => {
            // GIVEN
            const obj = { a: { b: { c: '' } } };
            // THEN
            coerce(obj, ['a', 'b', 'c'], 'number');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: encode('') } } });
        });
        test('a number', () => {
            // GIVEN
            const obj = { a: { b: { c: 0 } } };
            // THEN
            coerce(obj, ['a', 'b', 'c'], 'number');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: 0 } } });
        });
        test('undefined', () => {
            // GIVEN
            const obj = { a: { b: { c: undefined } } };
            // THEN
            coerce(obj, ['a', 'b', 'c'], 'number');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: undefined } } });
        });
        test('null', () => {
            // GIVEN
            const obj = { a: { b: { c: null } } };
            // THEN
            coerce(obj, ['a', 'b', 'c'], 'number');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: null } } });
        });
        test('an path that does not exist in input', () => {
            // GIVEN
            const obj = { a: { b: { c: 'dummy-value' } } };
            // THEN
            coerce(obj, ['a', 'b', 'foobar'], 'number');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: 'dummy-value' } } });
        });
        test('a path that is not a leaf', () => {
            // GIVEN
            const obj = { a: { b: { c: '123' } } };
            // THEN
            coerce(obj, ['a', 'b'], 'number');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: '123' } } });
        });
        test('do not change anything for empty path', () => {
            // GIVEN
            const obj = { a: { b: { c: '123' } } };
            // THEN
            coerce(obj, [], 'number');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: '123' } } });
        });
    });
    describe('given an api call description', () => {
        test('can convert string parameters to number when needed', () => {
            const params = (0, coerce_api_parameters_1.coerceApiParameters)('Amplify', 'listApps', {
                maxResults: '15',
            });
            expect(params).toMatchObject({
                maxResults: 15,
            });
        });
        test('can convert string parameters to number in arrays', () => {
            const params = (0, coerce_api_parameters_1.coerceApiParameters)('ECS', 'createService', {
                loadBalancers: [{
                        containerPort: '8080',
                    }, {
                        containerPort: '9000',
                    }],
            });
            expect(params).toMatchObject({
                loadBalancers: [{
                        containerPort: 8080,
                    }, {
                        containerPort: 9000,
                    }],
            });
        });
        test('can convert string parameters to number in map & union', () => {
            const params = (0, coerce_api_parameters_1.coerceApiParameters)('apigatewayv2', 'createApi', {
                CorsConfiguration: {
                    MaxAge: '300',
                },
            });
            expect(params).toMatchObject({
                CorsConfiguration: {
                    MaxAge: 300,
                },
            });
        });
    });
});
describe('date', () => {
    describe('should coerce', () => {
        test('a nested value', () => {
            // GIVEN
            const obj = { a: { b: { c: new Date('2023-01-01').toJSON() } } };
            // THEN
            coerce(obj, ['a', 'b', 'c'], 'Date');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: new Date('2023-01-01') } } });
        });
        test('values nested in an array', () => {
            // GIVEN
            const obj = {
                a: {
                    b: [
                        { z: new Date('2023-01-01').toJSON() },
                        { z: new Date('2023-01-02').toJSON() },
                        { z: new Date('2023-01-03').toJSON() },
                    ],
                },
            };
            // THEN
            coerce(obj, ['a', 'b', '*', 'z'], 'Date');
            // EXPECT
            expect(obj).toMatchObject({
                a: {
                    b: [
                        { z: new Date('2023-01-01') },
                        { z: new Date('2023-01-02') },
                        { z: new Date('2023-01-03') },
                    ],
                },
            });
        });
        test('array elements', () => {
            // GIVEN
            const obj = {
                a: {
                    b: [
                        new Date('2023-01-01').toJSON(),
                        new Date('2023-01-02').toJSON(),
                        new Date('2023-01-03').toJSON(),
                    ],
                },
            };
            // THEN
            coerce(obj, ['a', 'b', '*'], 'Date');
            // EXPECT
            expect(obj).toMatchObject({
                a: {
                    b: [
                        new Date('2023-01-01'),
                        new Date('2023-01-02'),
                        new Date('2023-01-03'),
                    ],
                },
            });
        });
        test('values nested in multiple arrays', () => {
            // GIVEN
            const obj = {
                a: {
                    b: [
                        {
                            z: [
                                { y: new Date('2023-01-01').toJSON() },
                                { y: new Date('2023-01-02').toJSON() },
                            ],
                        },
                        {
                            z: [
                                { y: new Date('2023-01-03').toJSON() },
                                { y: new Date('2023-01-04').toJSON() },
                            ],
                        },
                    ],
                },
            };
            // THEN
            coerce(obj, ['a', 'b', '*', 'z', '*', 'y'], 'Date');
            // EXPECT
            expect(obj).toMatchObject({
                a: {
                    b: [
                        { z: [{ y: new Date('2023-01-01') }, { y: new Date('2023-01-02') }] },
                        { z: [{ y: new Date('2023-01-03') }, { y: new Date('2023-01-04') }] },
                    ],
                },
            });
        });
    });
    describe('should NOT coerce', () => {
        test('empty string', () => {
            // GIVEN
            const obj = { a: { b: { c: '' } } };
            // THEN
            coerce(obj, ['a', 'b', 'c'], 'Date');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: '' } } });
        });
        test('undefined', () => {
            // GIVEN
            const obj = { a: { b: { c: undefined } } };
            // THEN
            coerce(obj, ['a', 'b', 'c'], 'Date');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: undefined } } });
        });
        test('null', () => {
            // GIVEN
            const obj = { a: { b: { c: null } } };
            // THEN
            coerce(obj, ['a', 'b', 'c'], 'Date');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: null } } });
        });
        test('an path that does not exist in input', () => {
            // GIVEN
            const obj = { a: { b: { c: new Date('2023-01-01').toJSON() } } };
            // THEN
            coerce(obj, ['a', 'b', 'foobar'], 'Date');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: new Date('2023-01-01').toJSON() } } });
        });
        test('a path that is not a leaf', () => {
            // GIVEN
            const obj = { a: { b: { c: new Date('2023-01-01').toJSON() } } };
            // THEN
            coerce(obj, ['a', 'b'], 'Date');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: new Date('2023-01-01').toJSON() } } });
        });
        test('do not change anything for empty path', () => {
            // GIVEN
            const obj = { a: { b: { c: new Date('2023-01-01').toJSON() } } };
            // THEN
            coerce(obj, [], 'Date');
            // EXPECT
            expect(obj).toMatchObject({ a: { b: { c: new Date('2023-01-01').toJSON() } } });
        });
    });
    describe('given an api call description', () => {
        test('can convert string parameters to Date when needed', () => {
            const params = (0, coerce_api_parameters_1.coerceApiParameters)('CloudWatch', 'getMetricData', {
                MetricDataQueries: [],
                StartTime: new Date('2023-01-01').toJSON(),
                EndTime: new Date('2023-01-02').toJSON(),
            });
            expect(params).toMatchObject({
                MetricDataQueries: [],
                StartTime: new Date('2023-01-01'),
                EndTime: new Date('2023-01-02'),
            });
        });
    });
});
/**
 * A function to convert code testing the old API into code testing the new API
 *
 * Having this function saves manually updating 25 call sites.
 */
function coerce(value, path, type) {
    const sm = [{}];
    let current = sm[0];
    for (const p of path.slice(0, -1)) {
        current[p] = sm.length;
        sm.push({});
        current = sm[sm.length - 1];
    }
    switch (type) {
        case 'Uint8Array':
            current[path[path.length - 1]] = 'b';
            break;
        case 'number':
            current[path[path.length - 1]] = 'n';
            break;
        case 'Date':
            current[path[path.length - 1]] = 'd';
            break;
        default:
            throw new Error(`Unexpected type: ${type}`);
    }
    return new coerce_api_parameters_1.Coercer(sm).testCoerce(value);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29lcmNlLWFwaS1wYXJhbWV0ZXJzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb2VyY2UtYXBpLXBhcmFtZXRlcnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdFQUE0RTtBQUc1RSxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFdkQsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7SUFFMUIsUUFBUSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7UUFDN0IsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtZQUMxQixRQUFRO1lBQ1IsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsYUFBYSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRS9DLE9BQU87WUFDUCxJQUFJLCtCQUFPLENBQUM7Z0JBQ1YsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUNSLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7YUFDWCxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRW5CLFNBQVM7WUFDVCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtZQUNyQyxRQUFRO1lBQ1IsTUFBTSxHQUFHLEdBQUc7Z0JBQ1YsQ0FBQyxFQUFFO29CQUNELENBQUMsRUFBRTt3QkFDRCxFQUFFLENBQUMsRUFBRSxH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IH0gZnJvbSAnLi4vbGliL2NvZXJjZS1hcGktcGFyYW1ldGVycyc7XG5pbXBvcnQgeyBUeXBlQ29lcmNpb25TdGF0ZU1hY2hpbmUgfSBmcm9tICcuLi9saWIvcGFyYW1ldGVyLXR5cGVzJztcblxuY29uc3QgZW5jb2RlID0gKHY6IGFueSkgPT4gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKHYpO1xuXG5kZXNjcmliZSgnVWludDhBcnJheScsICgpID0+IHtcblxuICBkZXNjcmliZSgnc2hvdWxkIGNvZXJjZScsICgpID0+IHtcbiAgICB0ZXN0KCdhIG5lc3RlZCB2YWx1ZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBvYmogPSB7IGE6IHsgYjogeyBjOiAnZHVtbXktdmFsdWUnIH0gfSB9O1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgQ29lcmNlcihbXG4gICAgICAgIHsgYTogMSB9LFxuICAgICAgICB7IGI6IDIgfSxcbiAgICAgICAgeyBjOiAnYicgfSxcbiAgICAgIF0pLnRlc3RDb2VyY2Uob2JqKTtcblxuICAgICAgLy8gRVhQRUNUXG4gICAgICBleHBlY3Qob2JqKS50b01hdGNoT2JqZWN0KHsgYTogeyBiOiB7IGM6IGVuY29kZSgnZHVtbXktdmFsdWUnKSB9IH0gfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd2YWx1ZXMgbmVzdGVkIGluIGFuIGFycmF5JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgICAgYToge1xuICAgICAgICAgIGI6IFtcbiAgICAgICAgICAgIHsgejogJzEnIH0sXG4gICAgICAgICAgICB7IHo6ICcyJyB9LFxuICAgICAgICAgICAgeyB6OiAnMycgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IENvZXJjZXIoW1xuICAgICAgICB7IGE6IDEgfSxcbiAgICAgICAgeyBiOiAyIH0sXG4gICAgICAgIHsgJyonOiAzIH0sXG4gICAgICAgIHsgejogJ2InIH0sXG4gICAgICBdKS50ZXN0Q29lcmNlKG9iaik7XG5cbiAgICAgIC8vIEVYUEVDVFxuICAgICAgZXhwZWN0KG9iaikudG9NYXRjaE9iamVjdCh7XG4gICAgICAgIGE6IHtcbiAgICAgICAgICBiOiBbXG4gICAgICAgICAgICB7IHo6IGVuY29kZSgnMScpIH0sXG4gICAgICAgICAgICB7IHo6IGVuY29kZSgnMicpIH0sXG4gICAgICAgICAgICB7IHo6IGVuY29kZSgnMycpIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYXJyYXkgZWxlbWVudHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgb2JqID0ge1xuICAgICAgICBhOiB7XG4gICAgICAgICAgYjogWycxJywgJzInLCAnMyddLFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgbmV3IENvZXJjZXIoW1xuICAgICAgICB7IGE6IDEgfSxcbiAgICAgICAgeyBiOiAyIH0sXG4gICAgICAgIHsgJyonOiAnYicgfSxcbiAgICAgIF0pLnRlc3RDb2VyY2Uob2JqKTtcblxuICAgICAgLy8gRVhQRUNUXG4gICAgICBleHBlY3Qob2JqKS50b01hdGNoT2JqZWN0KHtcbiAgICAgICAgYToge1xuICAgICAgICAgIGI6IFtcbiAgICAgICAgICAgIGVuY29kZSgnMScpLFxuICAgICAgICAgICAgZW5jb2RlKCcyJyksXG4gICAgICAgICAgICBlbmNvZGUoJzMnKSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd2YWx1ZXMgbmVzdGVkIGluIG11bHRpcGxlIGFycmF5cycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBvYmogPSB7XG4gICAgICAgIGE6IHtcbiAgICAgICAgICBiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHo6IFtcbiAgICAgICAgICAgICAgICB7IHk6ICcxJyB9LFxuICAgICAgICAgICAgICAgIHsgeTogJzInIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB6OiBbXG4gICAgICAgICAgICAgICAgeyB5OiAnQScgfSxcbiAgICAgICAgICAgICAgICB7IHk6ICdCJyB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29lcmNlKG9iaiwgWydhJywgJ2InLCAnKicsICd6JywgJyonLCAneSddLCAnVWludDhBcnJheScpO1xuXG4gICAgICAvLyBFWFBFQ1RcbiAgICAgIGV4cGVjdChvYmopLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgICBhOiB7XG4gICAgICAgICAgYjogW1xuICAgICAgICAgICAgeyB6OiBbeyB5OiBlbmNvZGUoJzEnKSB9LCB7IHk6IGVuY29kZSgnMicpIH1dIH0sXG4gICAgICAgICAgICB7IHo6IFt7IHk6IGVuY29kZSgnQScpIH0sIHsgeTogZW5jb2RlKCdCJykgfV0gfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdlbXB0eSBzdHJpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgb2JqID0geyBhOiB7IGI6IHsgYzogJycgfSB9IH07XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvZXJjZShvYmosIFsnYScsICdiJywgJ2MnXSwgJ1VpbnQ4QXJyYXknKTtcblxuICAgICAgLy8gRVhQRUNUXG4gICAgICBleHBlY3Qob2JqKS50b01hdGNoT2JqZWN0KHsgYTogeyBiOiB7IGM6IGVuY29kZSgnJykgfSB9IH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYSBudW1iZXInLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgb2JqID0geyBhOiB7IGI6IHsgYzogMCB9IH0gfTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29lcmNlKG9iaiwgWydhJywgJ2InLCAnYyddLCAnVWludDhBcnJheScpO1xuXG4gICAgICAvLyBFWFBFQ1RcbiAgICAgIGV4cGVjdChvYmopLnRvTWF0Y2hPYmplY3QoeyBhOiB7IGI6IHsgYzogZW5jb2RlKCcwJykgfSB9IH0pO1xuICAgIH0pO1xuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzaG91bGQgTk9UIGNvZXJjZScsICgpID0+IHtcbiAgICB0ZXN0KCd1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgb2JqID0geyBhOiB7IGI6IHsgYzogdW5kZWZpbmVkIH0gfSB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb2VyY2Uob2JqLCBbJ2EnLCAnYicsICdjJ10sICdVaW50OEFycmF5Jyk7XG5cbiAgICAgIC8vIEVYUEVDVFxuICAgICAgZXhwZWN0KG9iaikudG9NYXRjaE9iamVjdCh7IGE6IHsgYjogeyBjOiB1bmRlZmluZWQgfSB9IH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbnVsbCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBvYmogPSB7IGE6IHsgYjogeyBjOiBudWxsIH0gfSB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb2VyY2Uob2JqLCBbJ2EnLCAnYicsICdjJ10sICdVaW50OEFycmF5Jyk7XG5cbiAgICAgIC8vIEVYUEVDVFxuICAgICAgZXhwZWN0KG9iaikudG9NYXRjaE9iamVjdCh7IGE6IHsgYjogeyBjOiBudWxsIH0gfSB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FuIHBhdGggdGhhdCBkb2VzIG5vdCBleGlzdCBpbiBpbnB1dCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBvYmogPSB7IGE6IHsgYjogeyBjOiAnZHVtbXktdmFsdWUnIH0gfSB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb2VyY2Uob2JqLCBbJ2EnLCAnYicsICdmb29iYXInXSwgJ1VpbnQ4QXJyYXknKTtcblxuICAgICAgLy8gRVhQRUNUXG4gICAgICBleHBlY3Qob2JqKS50b01hdGNoT2JqZWN0KHsgYTogeyBiOiB7IGM6ICdkdW1teS12YWx1ZScgfSB9IH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYSBwYXRoIHRoYXQgaXMgbm90IGEgbGVhZicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBvYmogPSB7IGE6IHsgYjogeyBjOiAnZHVtbXktdmFsdWUnIH0gfSB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb2VyY2Uob2JqLCBbJ2EnLCAnYiddLCAnVWludDhBcnJheScpO1xuXG4gICAgICAvLyBFWFBFQ1RcbiAgICAgIGV4cGVjdChvYmopLnRvTWF0Y2hPYmplY3QoeyBhOiB7IGI6IHsgYzogJ2R1bW15LXZhbHVlJyB9IH0gfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkbyBub3QgY2hhbmdlIGFueXRoaW5nIGZvciBlbXB0eSBwYXRoJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IG9iaiA9IHsgYTogeyBiOiB7IGM6ICdkdW1teS12YWx1ZScgfSB9IH07XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvZXJjZShvYmosIFtdLCAnVWludDhBcnJheScpO1xuXG4gICAgICAvLyBFWFBFQ1RcbiAgICAgIGV4cGVjdChvYmopLnRvTWF0Y2hPYmplY3QoeyBhOiB7IGI6IHsgYzogJ2R1bW15LXZhbHVlJyB9IH0gfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnaXZlbiBhbiBhcGkgY2FsbCBkZXNjcmlwdGlvbicsICgpID0+IHtcblxuICAgIHRlc3QoJ2NhbiBjb252ZXJ0IHN0cmluZyBwYXJhbWV0ZXJzIHRvIFVpbnQ4QXJyYXkgd2hlbiBuZWVkZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwYXJhbXMgPSBjb2VyY2VBcGlQYXJhbWV0ZXJzKCdLTVMnLCAnZW5jcnlwdCcsIHtcbiAgICAgICAgS2V5SWQ6ICdrZXktaWQnLFxuICAgICAgICBQbGFpbnRleHQ6ICdkdW1teS1kYXRhJyxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QocGFyYW1zKS50b01hdGNoT2JqZWN0KHtcbiAgICAgICAgS2V5SWQ6ICdrZXktaWQnLFxuICAgICAgICBQbGFpbnRleHQ6IG5ldyBVaW50OEFycmF5KFtcbiAgICAgICAgICAxMDAsIDExNywgMTA5LCAxMDksXG4gICAgICAgICAgMTIxLCA0NSwgMTAwLCA5NyxcbiAgICAgICAgICAxMTYsIDk3LFxuICAgICAgICBdKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGNvbnZlcnQgc3RyaW5nIHBhcmFtZXRlcnMgdG8gVWludDhBcnJheSBpbiBhcnJheXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwYXJhbXMgPSBjb2VyY2VBcGlQYXJhbWV0ZXJzKCdLaW5lc2lzJywgJ3B1dFJlY29yZHMnLCB7XG4gICAgICAgIFJlY29yZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBEYXRhOiAnYWFhJyxcbiAgICAgICAgICAgIFBhcnRpdGlvbktleTogJ2tleScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBEYXRhOiAnYmJiJyxcbiAgICAgICAgICAgIFBhcnRpdGlvbktleTogJ2tleScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QocGFyYW1zKS50b01hdGNoT2JqZWN0KHtcbiAgICAgICAgUmVjb3JkczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIERhdGE6IG5ldyBVaW50OEFycmF5KFs5NywgOTcsIDk3XSksXG4gICAgICAgICAgICBQYXJ0aXRpb25LZXk6ICdrZXknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgRGF0YTogbmV3IFVpbnQ4QXJyYXkoWzk4LCA5OCwgOThdKSxcbiAgICAgICAgICAgIFBhcnRpdGlvbktleTogJ2tleScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGNvbnZlcnQgc3RyaW5nIHBhcmFtZXRlcnMgdG8gVWludDhBcnJheSBpbiBtYXAgJiB1bmlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IGNvZXJjZUFwaVBhcmFtZXRlcnMoJ2R5bmFtb2RiJywgJ3B1dEl0ZW0nLCB7XG4gICAgICAgIEl0ZW06IHtcbiAgICAgICAgICBCaW5hcnk6IHtcbiAgICAgICAgICAgIEI6ICdhYmMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KHBhcmFtcykudG9NYXRjaE9iamVjdCh7XG4gICAgICAgIEl0ZW06IHtcbiAgICAgICAgICBCaW5hcnk6IHtcbiAgICAgICAgICAgIEI6IG5ldyBVaW50OEFycmF5KFs5NywgOTgsIDk5XSksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGNvZXJjZSBwYXJhbWV0ZXJzIGluIHJlY3Vyc2l2ZSB0eXBlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IGNvZXJjZUFwaVBhcmFtZXRlcnMoJ2Nvbm5lY3QnLCAnQ3JlYXRlRXZhbHVhdGlvbkZvcm0nLCB7XG4gICAgICAgIEl0ZW1zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgU2VjdGlvbjoge1xuICAgICAgICAgICAgICBJdGVtczogWyAvLyA8LS0gc2FtZSB0eXBlIGFzICdJdGVtcycgYWJvdmVcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBRdWVzdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBXZWlnaHQ6ICc5MDAwJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QocGFyYW1zKS50b01hdGNoT2JqZWN0KHtcbiAgICAgICAgSXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBTZWN0aW9uOiB7XG4gICAgICAgICAgICAgIEl0ZW1zOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUXVlc3Rpb246IHtcbiAgICAgICAgICAgICAgICAgICAgV2VpZ2h0OiA5MDAwLCAvLyA8LS0gY29udmVydGVkXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbn0pO1xuXG5kZXNjcmliZSgnbnVtYmVyJywgKCkgPT4ge1xuXG4gIGRlc2NyaWJlKCdzaG91bGQgY29lcmNlJywgKCkgPT4ge1xuICAgIHRlc3QoJ2EgbmVzdGVkIHZhbHVlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IG9iaiA9IHsgYTogeyBiOiB7IGM6ICctMTIzLjQ1JyB9IH0gfTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29lcmNlKG9iaiwgWydhJywgJ2InLCAnYyddLCAnbnVtYmVyJyk7XG5cbiAgICAgIC8vIEVYUEVDVFxuICAgICAgZXhwZWN0KG9iaikudG9NYXRjaE9iamVjdCh7IGE6IHsgYjogeyBjOiAtMTIzLjQ1IH0gfSB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3ZhbHVlcyBuZXN0ZWQgaW4gYW4gYXJyYXknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgb2JqID0ge1xuICAgICAgICBhOiB7XG4gICAgICAgICAgYjogW1xuICAgICAgICAgICAgeyB6OiAnMScgfSxcbiAgICAgICAgICAgIHsgejogJzInIH0sXG4gICAgICAgICAgICB7IHo6ICczJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb2VyY2Uob2JqLCBbJ2EnLCAnYicsICcqJywgJ3onXSwgJ251bWJlcicpO1xuXG4gICAgICAvLyBFWFBFQ1RcbiAgICAgIGV4cGVjdChvYmopLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgICBhOiB7XG4gICAgICAgICAgYjogW1xuICAgICAgICAgICAgeyB6OiAxIH0sXG4gICAgICAgICAgICB7IHo6IDIgfSxcbiAgICAgICAgICAgIHsgejogMyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FycmF5IGVsZW1lbnRzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgICAgYToge1xuICAgICAgICAgIGI6IFsnMScsICcyJywgJzMnXSxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvZXJjZShvYmosIFsnYScsICdiJywgJyonXSwgJ251bWJlcicpO1xuXG4gICAgICAvLyBFWFBFQ1RcbiAgICAgIGV4cGVjdChvYmopLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgICBhOiB7XG4gICAgICAgICAgYjogW1xuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIDIsXG4gICAgICAgICAgICAzLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3ZhbHVlcyBuZXN0ZWQgaW4gbXVsdGlwbGUgYXJyYXlzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgICAgYToge1xuICAgICAgICAgIGI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgejogW1xuICAgICAgICAgICAgICAgIHsgeTogJzEnIH0sXG4gICAgICAgICAgICAgICAgeyB5OiAnMicgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHo6IFtcbiAgICAgICAgICAgICAgICB7IHk6ICczJyB9LFxuICAgICAgICAgICAgICAgIHsgeTogJzQnIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb2VyY2Uob2JqLCBbJ2EnLCAnYicsICcqJywgJ3onLCAnKicsICd5J10sICdudW1iZXInKTtcblxuICAgICAgLy8gRVhQRUNUXG4gICAgICBleHBlY3Qob2JqKS50b01hdGNoT2JqZWN0KHtcbiAgICAgICAgYToge1xuICAgICAgICAgIGI6IFtcbiAgICAgICAgICAgIHsgejogW3sgeTogMSB9LCB7IHk6IDIgfV0gfSxcbiAgICAgICAgICAgIHsgejogW3sgeTogMyB9LCB7IHk6IDQgfV0gfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzaG91bGQgTk9UIGNvZXJjZScsICgpID0+IHtcbiAgICB0ZXN0KCdlbXB0eSBzdHJpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgb2JqID0geyBhOiB7IGI6IHsgYzogJycgfSB9IH07XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvZXJjZShvYmosIFsnYScsICdiJywgJ2MnXSwgJ251bWJlcicpO1xuXG4gICAgICAvLyBFWFBFQ1RcbiAgICAgIGV4cGVjdChvYmopLnRvTWF0Y2hPYmplY3QoeyBhOiB7IGI6IHsgYzogZW5jb2RlKCcnKSB9IH0gfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhIG51bWJlcicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBvYmogPSB7IGE6IHsgYjogeyBjOiAwIH0gfSB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb2VyY2Uob2JqLCBbJ2EnLCAnYicsICdjJ10sICdudW1iZXInKTtcblxuICAgICAgLy8gRVhQRUNUXG4gICAgICBleHBlY3Qob2JqKS50b01hdGNoT2JqZWN0KHsgYTogeyBiOiB7IGM6IDAgfSB9IH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IG9iaiA9IHsgYTogeyBiOiB7IGM6IHVuZGVmaW5lZCB9IH0gfTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29lcmNlKG9iaiwgWydhJywgJ2InLCAnYyddLCAnbnVtYmVyJyk7XG5cbiAgICAgIC8vIEVYUEVDVFxuICAgICAgZXhwZWN0KG9iaikudG9NYXRjaE9iamVjdCh7IGE6IHsgYjogeyBjOiB1bmRlZmluZWQgfSB9IH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbnVsbCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBvYmogPSB7IGE6IHsgYjogeyBjOiBudWxsIH0gfSB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb2VyY2Uob2JqLCBbJ2EnLCAnYicsICdjJ10sICdudW1iZXInKTtcblxuICAgICAgLy8gRVhQRUNUXG4gICAgICBleHBlY3Qob2JqKS50b01hdGNoT2JqZWN0KHsgYTogeyBiOiB7IGM6IG51bGwgfSB9IH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYW4gcGF0aCB0aGF0IGRvZXMgbm90IGV4aXN0IGluIGlucHV0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IG9iaiA9IHsgYTogeyBiOiB7IGM6ICdkdW1teS12YWx1ZScgfSB9IH07XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvZXJjZShvYmosIFsnYScsICdiJywgJ2Zvb2JhciddLCAnbnVtYmVyJyk7XG5cbiAgICAgIC8vIEVYUEVDVFxuICAgICAgZXhwZWN0KG9iaikudG9NYXRjaE9iamVjdCh7IGE6IHsgYjogeyBjOiAnZHVtbXktdmFsdWUnIH0gfSB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2EgcGF0aCB0aGF0IGlzIG5vdCBhIGxlYWYnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgb2JqID0geyBhOiB7IGI6IHsgYzogJzEyMycgfSB9IH07XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvZXJjZShvYmosIFsnYScsICdiJ10sICdudW1iZXInKTtcblxuICAgICAgLy8gRVhQRUNUXG4gICAgICBleHBlY3Qob2JqKS50b01hdGNoT2JqZWN0KHsgYTogeyBiOiB7IGM6ICcxMjMnIH0gfSB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2RvIG5vdCBjaGFuZ2UgYW55dGhpbmcgZm9yIGVtcHR5IHBhdGgnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgb2JqID0geyBhOiB7IGI6IHsgYzogJzEyMycgfSB9IH07XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvZXJjZShvYmosIFtdLCAnbnVtYmVyJyk7XG5cbiAgICAgIC8vIEVYUEVDVFxuICAgICAgZXhwZWN0KG9iaikudG9NYXRjaE9iamVjdCh7IGE6IHsgYjogeyBjOiAnMTIzJyB9IH0gfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnaXZlbiBhbiBhcGkgY2FsbCBkZXNjcmlwdGlvbicsICgpID0+IHtcblxuICAgIHRlc3QoJ2NhbiBjb252ZXJ0IHN0cmluZyBwYXJhbWV0ZXJzIHRvIG51bWJlciB3aGVuIG5lZWRlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IGNvZXJjZUFwaVBhcmFtZXRlcnMoJ0FtcGxpZnknLCAnbGlzdEFwcHMnLCB7XG4gICAgICAgIG1heFJlc3VsdHM6ICcxNScsXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KHBhcmFtcykudG9NYXRjaE9iamVjdCh7XG4gICAgICAgIG1heFJlc3VsdHM6IDE1LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gY29udmVydCBzdHJpbmcgcGFyYW1ldGVycyB0byBudW1iZXIgaW4gYXJyYXlzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGFyYW1zID0gY29lcmNlQXBpUGFyYW1ldGVycygnRUNTJywgJ2NyZWF0ZVNlcnZpY2UnLCB7XG4gICAgICAgIGxvYWRCYWxhbmNlcnM6IFt7XG4gICAgICAgICAgY29udGFpbmVyUG9ydDogJzgwODAnLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgY29udGFpbmVyUG9ydDogJzkwMDAnLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QocGFyYW1zKS50b01hdGNoT2JqZWN0KHtcbiAgICAgICAgbG9hZEJhbGFuY2VyczogW3tcbiAgICAgICAgICBjb250YWluZXJQb3J0OiA4MDgwLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgY29udGFpbmVyUG9ydDogOTAwMCxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBjb252ZXJ0IHN0cmluZyBwYXJhbWV0ZXJzIHRvIG51bWJlciBpbiBtYXAgJiB1bmlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IGNvZXJjZUFwaVBhcmFtZXRlcnMoJ2FwaWdhdGV3YXl2MicsICdjcmVhdGVBcGknLCB7XG4gICAgICAgIENvcnNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgTWF4QWdlOiAnMzAwJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QocGFyYW1zKS50b01hdGNoT2JqZWN0KHtcbiAgICAgICAgQ29yc0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBNYXhBZ2U6IDMwMCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnZGF0ZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3Nob3VsZCBjb2VyY2UnLCAoKSA9PiB7XG4gICAgdGVzdCgnYSBuZXN0ZWQgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgb2JqID0geyBhOiB7IGI6IHsgYzogbmV3IERhdGUoJzIwMjMtMDEtMDEnKS50b0pTT04oKSB9IH0gfTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29lcmNlKG9iaiwgWydhJywgJ2InLCAnYyddLCAnRGF0ZScpO1xuXG4gICAgICAvLyBFWFBFQ1RcbiAgICAgIGV4cGVjdChvYmopLnRvTWF0Y2hPYmplY3QoeyBhOiB7IGI6IHsgYzogbmV3IERhdGUoJzIwMjMtMDEtMDEnKSB9IH0gfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd2YWx1ZXMgbmVzdGVkIGluIGFuIGFycmF5JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgICAgYToge1xuICAgICAgICAgIGI6IFtcbiAgICAgICAgICAgIHsgejogbmV3IERhdGUoJzIwMjMtMDEtMDEnKS50b0pTT04oKSB9LFxuICAgICAgICAgICAgeyB6OiBuZXcgRGF0ZSgnMjAyMy0wMS0wMicpLnRvSlNPTigpIH0sXG4gICAgICAgICAgICB7IHo6IG5ldyBEYXRlKCcyMDIzLTAxLTAzJykudG9KU09OKCkgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29lcmNlKG9iaiwgWydhJywgJ2InLCAnKicsICd6J10sICdEYXRlJyk7XG5cbiAgICAgIC8vIEVYUEVDVFxuICAgICAgZXhwZWN0KG9iaikudG9NYXRjaE9iamVjdCh7XG4gICAgICAgIGE6IHtcbiAgICAgICAgICBiOiBbXG4gICAgICAgICAgICB7IHo6IG5ldyBEYXRlKCcyMDIzLTAxLTAxJykgfSxcbiAgICAgICAgICAgIHsgejogbmV3IERhdGUoJzIwMjMtMDEtMDInKSB9LFxuICAgICAgICAgICAgeyB6OiBuZXcgRGF0ZSgnMjAyMy0wMS0wMycpIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYXJyYXkgZWxlbWVudHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgb2JqID0ge1xuICAgICAgICBhOiB7XG4gICAgICAgICAgYjogW1xuICAgICAgICAgICAgbmV3IERhdGUoJzIwMjMtMDEtMDEnKS50b0pTT04oKSxcbiAgICAgICAgICAgIG5ldyBEYXRlKCcyMDIzLTAxLTAyJykudG9KU09OKCksXG4gICAgICAgICAgICBuZXcgRGF0ZSgnMjAyMy0wMS0wMycpLnRvSlNPTigpLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb2VyY2Uob2JqLCBbJ2EnLCAnYicsICcqJ10sICdEYXRlJyk7XG5cbiAgICAgIC8vIEVYUEVDVFxuICAgICAgZXhwZWN0KG9iaikudG9NYXRjaE9iamVjdCh7XG4gICAgICAgIGE6IHtcbiAgICAgICAgICBiOiBbXG4gICAgICAgICAgICBuZXcgRGF0ZSgnMjAyMy0wMS0wMScpLFxuICAgICAgICAgICAgbmV3IERhdGUoJzIwMjMtMDEtMDInKSxcbiAgICAgICAgICAgIG5ldyBEYXRlKCcyMDIzLTAxLTAzJyksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndmFsdWVzIG5lc3RlZCBpbiBtdWx0aXBsZSBhcnJheXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgb2JqID0ge1xuICAgICAgICBhOiB7XG4gICAgICAgICAgYjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB6OiBbXG4gICAgICAgICAgICAgICAgeyB5OiBuZXcgRGF0ZSgnMjAyMy0wMS0wMScpLnRvSlNPTigpIH0sXG4gICAgICAgICAgICAgICAgeyB5OiBuZXcgRGF0ZSgnMjAyMy0wMS0wMicpLnRvSlNPTigpIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB6OiBbXG4gICAgICAgICAgICAgICAgeyB5OiBuZXcgRGF0ZSgnMjAyMy0wMS0wMycpLnRvSlNPTigpIH0sXG4gICAgICAgICAgICAgICAgeyB5OiBuZXcgRGF0ZSgnMjAyMy0wMS0wNCcpLnRvSlNPTigpIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb2VyY2Uob2JqLCBbJ2EnLCAnYicsICcqJywgJ3onLCAnKicsICd5J10sICdEYXRlJyk7XG5cbiAgICAgIC8vIEVYUEVDVFxuICAgICAgZXhwZWN0KG9iaikudG9NYXRjaE9iamVjdCh7XG4gICAgICAgIGE6IHtcbiAgICAgICAgICBiOiBbXG4gICAgICAgICAgICB7IHo6IFt7IHk6IG5ldyBEYXRlKCcyMDIzLTAxLTAxJykgfSwgeyB5OiBuZXcgRGF0ZSgnMjAyMy0wMS0wMicpIH1dIH0sXG4gICAgICAgICAgICB7IHo6IFt7IHk6IG5ldyBEYXRlKCcyMDIzLTAxLTAzJykgfSwgeyB5OiBuZXcgRGF0ZSgnMjAyMy0wMS0wNCcpIH1dIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnc2hvdWxkIE5PVCBjb2VyY2UnLCAoKSA9PiB7XG4gICAgdGVzdCgnZW1wdHkgc3RyaW5nJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IG9iaiA9IHsgYTogeyBiOiB7IGM6ICcnIH0gfSB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb2VyY2Uob2JqLCBbJ2EnLCAnYicsICdjJ10sICdEYXRlJyk7XG5cbiAgICAgIC8vIEVYUEVDVFxuICAgICAgZXhwZWN0KG9iaikudG9NYXRjaE9iamVjdCh7IGE6IHsgYjogeyBjOiAnJyB9IH0gfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgb2JqID0geyBhOiB7IGI6IHsgYzogdW5kZWZpbmVkIH0gfSB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb2VyY2Uob2JqLCBbJ2EnLCAnYicsICdjJ10sICdEYXRlJyk7XG5cbiAgICAgIC8vIEVYUEVDVFxuICAgICAgZXhwZWN0KG9iaikudG9NYXRjaE9iamVjdCh7IGE6IHsgYjogeyBjOiB1bmRlZmluZWQgfSB9IH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbnVsbCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBvYmogPSB7IGE6IHsgYjogeyBjOiBudWxsIH0gfSB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb2VyY2Uob2JqLCBbJ2EnLCAnYicsICdjJ10sICdEYXRlJyk7XG5cbiAgICAgIC8vIEVYUEVDVFxuICAgICAgZXhwZWN0KG9iaikudG9NYXRjaE9iamVjdCh7IGE6IHsgYjogeyBjOiBudWxsIH0gfSB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FuIHBhdGggdGhhdCBkb2VzIG5vdCBleGlzdCBpbiBpbnB1dCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBvYmogPSB7IGE6IHsgYjogeyBjOiBuZXcgRGF0ZSgnMjAyMy0wMS0wMScpLnRvSlNPTigpIH0gfSB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb2VyY2Uob2JqLCBbJ2EnLCAnYicsICdmb29iYXInXSwgJ0RhdGUnKTtcblxuICAgICAgLy8gRVhQRUNUXG4gICAgICBleHBlY3Qob2JqKS50b01hdGNoT2JqZWN0KHsgYTogeyBiOiB7IGM6IG5ldyBEYXRlKCcyMDIzLTAxLTAxJykudG9KU09OKCkgfSB9IH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYSBwYXRoIHRoYXQgaXMgbm90IGEgbGVhZicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBvYmogPSB7IGE6IHsgYjogeyBjOiBuZXcgRGF0ZSgnMjAyMy0wMS0wMScpLnRvSlNPTigpIH0gfSB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb2VyY2Uob2JqLCBbJ2EnLCAnYiddLCAnRGF0ZScpO1xuXG4gICAgICAvLyBFWFBFQ1RcbiAgICAgIGV4cGVjdChvYmopLnRvTWF0Y2hPYmplY3QoeyBhOiB7IGI6IHsgYzogbmV3IERhdGUoJzIwMjMtMDEtMDEnKS50b0pTT04oKSB9IH0gfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkbyBub3QgY2hhbmdlIGFueXRoaW5nIGZvciBlbXB0eSBwYXRoJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IG9iaiA9IHsgYTogeyBiOiB7IGM6IG5ldyBEYXRlKCcyMDIzLTAxLTAxJykudG9KU09OKCkgfSB9IH07XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvZXJjZShvYmosIFtdLCAnRGF0ZScpO1xuXG4gICAgICAvLyBFWFBFQ1RcbiAgICAgIGV4cGVjdChvYmopLnRvTWF0Y2hPYmplY3QoeyBhOiB7IGI6IHsgYzogbmV3IERhdGUoJzIwMjMtMDEtMDEnKS50b0pTT04oKSB9IH0gfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnaXZlbiBhbiBhcGkgY2FsbCBkZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCdjYW4gY29udmVydCBzdHJpbmcgcGFyYW1ldGVycyB0byBEYXRlIHdoZW4gbmVlZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGFyYW1zID0gY29lcmNlQXBpUGFyYW1ldGVycygnQ2xvdWRXYXRjaCcsICdnZXRNZXRyaWNEYXRhJywge1xuICAgICAgICBNZXRyaWNEYXRhUXVlcmllczogW10sXG4gICAgICAgIFN0YXJ0VGltZTogbmV3IERhdGUoJzIwMjMtMDEtMDEnKS50b0pTT04oKSxcbiAgICAgICAgRW5kVGltZTogbmV3IERhdGUoJzIwMjMtMDEtMDInKS50b0pTT04oKSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QocGFyYW1zKS50b01hdGNoT2JqZWN0KHtcbiAgICAgICAgTWV0cmljRGF0YVF1ZXJpZXM6IFtdLFxuICAgICAgICBTdGFydFRpbWU6IG5ldyBEYXRlKCcyMDIzLTAxLTAxJyksXG4gICAgICAgIEVuZFRpbWU6IG5ldyBEYXRlKCcyMDIzLTAxLTAyJyksXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRvIGNvbnZlcnQgY29kZSB0ZXN0aW5nIHRoZSBvbGQgQVBJIGludG8gY29kZSB0ZXN0aW5nIHRoZSBuZXcgQVBJXG4gKlxuICogSGF2aW5nIHRoaXMgZnVuY3Rpb24gc2F2ZXMgbWFudWFsbHkgdXBkYXRpbmcgMjUgY2FsbCBzaXRlcy5cbiAqL1xuZnVuY3Rpb24gY29lcmNlKHZhbHVlOiB1bmtub3duLCBwYXRoOiBzdHJpbmdbXSwgdHlwZTogJ1VpbnQ4QXJyYXknIHwgJ251bWJlcicgfCAnRGF0ZScpIHtcbiAgY29uc3Qgc206IFR5cGVDb2VyY2lvblN0YXRlTWFjaGluZSA9IFt7fV07XG4gIGxldCBjdXJyZW50ID0gc21bMF07XG4gIGZvciAoY29uc3QgcCBvZiBwYXRoLnNsaWNlKDAsIC0xKSkge1xuICAgIGN1cnJlbnRbcF0gPSBzbS5sZW5ndGg7XG4gICAgc20ucHVzaCh7fSk7XG4gICAgY3VycmVudCA9IHNtW3NtLmxlbmd0aCAtIDFdO1xuICB9XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ1VpbnQ4QXJyYXknOlxuICAgICAgY3VycmVudFtwYXRoW3BhdGgubGVuZ3RoIC0gMV1dID0gJ2InO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGN1cnJlbnRbcGF0aFtwYXRoLmxlbmd0aCAtIDFdXSA9ICduJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0RhdGUnOlxuICAgICAgY3VycmVudFtwYXRoW3BhdGgubGVuZ3RoIC0gMV1dID0gJ2QnO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCB0eXBlOiAke3R5cGV9YCk7XG4gIH1cbiAgcmV0dXJuIG5ldyBDb2VyY2VyKHNtKS50ZXN0Q29lcmNlKHZhbHVlKTtcbn0iXX0=