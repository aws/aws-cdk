import '@aws-cdk/assert/jest';
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
  });
});

function assertRendersTo(cond: stepfunctions.Condition, expected: any) {
  expect(cond.renderCondition()).toStrictEqual(expected);
}
