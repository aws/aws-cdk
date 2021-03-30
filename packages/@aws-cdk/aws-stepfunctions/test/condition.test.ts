import '@aws-cdk/assert-internal/jest';
import * as stepfunctions from '../lib';

describe('Condition Variables', () => {
  test('Condition variables must start with $. or $[', () => {
    expect(() => stepfunctions.Condition.stringEquals('a', 'b')).toThrow();
  }),
  test('Condition variables can start with $.', () => {
    expect(() => stepfunctions.Condition.stringEquals('$.a', 'b')).not.toThrow();
  }),
  test('Condition variables can start with $[', () => {
    expect(() => stepfunctions.Condition.stringEquals('$[0]', 'a')).not.toThrow();
  }),
  test('Condition variables can reference the state input $', () => {
    expect(() => stepfunctions.Condition.stringEquals('$', 'a')).not.toThrow();
  }),
  test('NotConditon must render properly', () => {
    assertRendersTo(stepfunctions.Condition.not(stepfunctions.Condition.stringEquals('$.a', 'b')), { Not: { Variable: '$.a', StringEquals: 'b' } });
  }),
  test('CompoundCondition must render properly', () => {
    assertRendersTo(
      stepfunctions.Condition.and(stepfunctions.Condition.booleanEquals('$.a', true), stepfunctions.Condition.numberGreaterThan('$.b', 3)),
      {
        And: [
          { Variable: '$.a', BooleanEquals: true },
          { Variable: '$.b', NumericGreaterThan: 3 },
        ],
      },
    );
  }),
  test('Exercise a number of other conditions', () => {
    const cases: Array<[stepfunctions.Condition, object]> = [
      [stepfunctions.Condition.stringLessThan('$.a', 'foo'), { Variable: '$.a', StringLessThan: 'foo' }],
      [stepfunctions.Condition.stringLessThanEquals('$.a', 'foo'), { Variable: '$.a', StringLessThanEquals: 'foo' }],
      [stepfunctions.Condition.stringGreaterThan('$.a', 'foo'), { Variable: '$.a', StringGreaterThan: 'foo' }],
      [stepfunctions.Condition.stringGreaterThanEquals('$.a', 'foo'), { Variable: '$.a', StringGreaterThanEquals: 'foo' }],
      [stepfunctions.Condition.numberEquals('$.a', 5), { Variable: '$.a', NumericEquals: 5 }],
    ];

    for (const [cond, expected] of cases) {
      assertRendersTo(cond, expected);
    }
  }),
  test('Exercise string conditions', () => {
    const cases: Array<[stepfunctions.Condition, object]> = [
      [stepfunctions.Condition.stringEquals('$.a', 'foo'), { Variable: '$.a', StringEquals: 'foo' }],
      [stepfunctions.Condition.stringEqualsJsonPath('$.a', '$.b'), { Variable: '$.a', StringEqualsPath: '$.b' }],
      [stepfunctions.Condition.stringLessThan('$.a', 'foo'), { Variable: '$.a', StringLessThan: 'foo' }],
      [stepfunctions.Condition.stringLessThanJsonPath('$.a', '$.b'), { Variable: '$.a', StringLessThanPath: '$.b' }],
      [stepfunctions.Condition.stringLessThanEquals('$.a', 'foo'), { Variable: '$.a', StringLessThanEquals: 'foo' }],
      [stepfunctions.Condition.stringLessThanEqualsJsonPath('$.a', '$.b'), { Variable: '$.a', StringLessThanEqualsPath: '$.b' }],
      [stepfunctions.Condition.stringGreaterThan('$.a', 'foo'), { Variable: '$.a', StringGreaterThan: 'foo' }],
      [stepfunctions.Condition.stringGreaterThanJsonPath('$.a', '$.b'), { Variable: '$.a', StringGreaterThanPath: '$.b' }],
      [stepfunctions.Condition.stringGreaterThanEquals('$.a', 'foo'), { Variable: '$.a', StringGreaterThanEquals: 'foo' }],
      [stepfunctions.Condition.stringGreaterThanEqualsJsonPath('$.a', '$.b'), { Variable: '$.a', StringGreaterThanEqualsPath: '$.b' }],
    ];

    for (const [cond, expected] of cases) {
      assertRendersTo(cond, expected);
    }
  }),
  test('Exercise number conditions', () => {
    const cases: Array<[stepfunctions.Condition, object]> = [
      [stepfunctions.Condition.numberEquals('$.a', 5), { Variable: '$.a', NumericEquals: 5 }],
      [stepfunctions.Condition.numberEqualsJsonPath('$.a', '$.b'), { Variable: '$.a', NumericEqualsPath: '$.b' }],
      [stepfunctions.Condition.numberLessThan('$.a', 5), { Variable: '$.a', NumericLessThan: 5 }],
      [stepfunctions.Condition.numberLessThanJsonPath('$.a', '$.b'), { Variable: '$.a', NumericLessThanPath: '$.b' }],
      [stepfunctions.Condition.numberGreaterThan('$.a', 5), { Variable: '$.a', NumericGreaterThan: 5 }],
      [stepfunctions.Condition.numberGreaterThanJsonPath('$.a', '$.b'), { Variable: '$.a', NumericGreaterThanPath: '$.b' }],
      [stepfunctions.Condition.numberLessThanEquals('$.a', 5), { Variable: '$.a', NumericLessThanEquals: 5 }],
      [stepfunctions.Condition.numberLessThanEqualsJsonPath('$.a', '$.b'), { Variable: '$.a', NumericLessThanEqualsPath: '$.b' }],
      [stepfunctions.Condition.numberGreaterThanEquals('$.a', 5), { Variable: '$.a', NumericGreaterThanEquals: 5 }],
      [stepfunctions.Condition.numberGreaterThanEqualsJsonPath('$.a', '$.b'), { Variable: '$.a', NumericGreaterThanEqualsPath: '$.b' }],
    ];


    for (const [cond, expected] of cases) {
      assertRendersTo(cond, expected);
    }
  }),
  test('Exercise type conditions', () => {
    const cases: Array<[stepfunctions.Condition, object]> = [
      [stepfunctions.Condition.isString('$.a'), { Variable: '$.a', IsString: true }],
      [stepfunctions.Condition.isNotString('$.a'), { Variable: '$.a', IsString: false }],
      [stepfunctions.Condition.isNumeric('$.a'), { Variable: '$.a', IsNumeric: true }],
      [stepfunctions.Condition.isNotNumeric('$.a'), { Variable: '$.a', IsNumeric: false }],
      [stepfunctions.Condition.isBoolean('$.a'), { Variable: '$.a', IsBoolean: true }],
      [stepfunctions.Condition.isNotBoolean('$.a'), { Variable: '$.a', IsBoolean: false }],
      [stepfunctions.Condition.isTimestamp('$.a'), { Variable: '$.a', IsTimestamp: true }],
      [stepfunctions.Condition.isNotTimestamp('$.a'), { Variable: '$.a', IsTimestamp: false }],
    ];

    for (const [cond, expected] of cases) {
      assertRendersTo(cond, expected);
    }
  }),
  test('Exercise timestamp conditions', () => {
    const cases: Array<[stepfunctions.Condition, object]> = [
      [stepfunctions.Condition.timestampEquals('$.a', 'timestamp'), { Variable: '$.a', TimestampEquals: 'timestamp' }],
      [stepfunctions.Condition.timestampEqualsJsonPath('$.a', '$.b'), { Variable: '$.a', TimestampEqualsPath: '$.b' }],
      [stepfunctions.Condition.timestampLessThan('$.a', 'timestamp'), { Variable: '$.a', TimestampLessThan: 'timestamp' }],
      [stepfunctions.Condition.timestampLessThanJsonPath('$.a', '$.b'), { Variable: '$.a', TimestampLessThanPath: '$.b' }],
      [stepfunctions.Condition.timestampGreaterThan('$.a', 'timestamp'), { Variable: '$.a', TimestampGreaterThan: 'timestamp' }],
      [stepfunctions.Condition.timestampGreaterThanJsonPath('$.a', '$.b'), { Variable: '$.a', TimestampGreaterThanPath: '$.b' }],
      [stepfunctions.Condition.timestampLessThanEquals('$.a', 'timestamp'), { Variable: '$.a', TimestampLessThanEquals: 'timestamp' }],
      [stepfunctions.Condition.timestampLessThanEqualsJsonPath('$.a', '$.b'), { Variable: '$.a', TimestampLessThanEqualsPath: '$.b' }],
      [stepfunctions.Condition.timestampGreaterThanEquals('$.a', 'timestamp'), { Variable: '$.a', TimestampGreaterThanEquals: 'timestamp' }],
      [stepfunctions.Condition.timestampGreaterThanEqualsJsonPath('$.a', '$.b'), { Variable: '$.a', TimestampGreaterThanEqualsPath: '$.b' }],
    ];

    for (const [cond, expected] of cases) {
      assertRendersTo(cond, expected);
    }
  }),

  test('Exercise other conditions', () => {
    const cases: Array<[stepfunctions.Condition, object]> = [
      [stepfunctions.Condition.booleanEqualsJsonPath('$.a', '$.b'), { Variable: '$.a', BooleanEqualsPath: '$.b' }],
      [stepfunctions.Condition.booleanEquals('$.a', true), { Variable: '$.a', BooleanEquals: true }],
      [stepfunctions.Condition.isPresent('$.a'), { Variable: '$.a', IsPresent: true }],
      [stepfunctions.Condition.isNotPresent('$.a'), { Variable: '$.a', IsPresent: false }],
      [stepfunctions.Condition.stringMatches('$.a', 'foo'), { Variable: '$.a', StringMatches: 'foo' }],
    ];

    for (const [cond, expected] of cases) {
      assertRendersTo(cond, expected);
    }
  });
});

function assertRendersTo(cond: stepfunctions.Condition, expected: any) {
  expect(cond.renderCondition()).toStrictEqual(expected);
}
