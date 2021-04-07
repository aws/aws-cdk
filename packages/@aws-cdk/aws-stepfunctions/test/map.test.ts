import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as stepfunctions from '../lib';

describe('Map State', () => {
  test('State Machine With Map State', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = new stepfunctions.Map(stack, 'Map State', {
      maxConcurrency: 1,
      itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      parameters: {
        foo: 'foo',
        bar: stepfunctions.JsonPath.stringAt('$.bar'),
      },
    });
    map.iterator(new stepfunctions.Pass(stack, 'Pass State'));

    // THEN
    expect(render(map)).toStrictEqual({
      StartAt: 'Map State',
      States: {
        'Map State': {
          Type: 'Map',
          End: true,
          Parameters: {
            'foo': 'foo',
            'bar.$': '$.bar',
          },
          Iterator: {
            StartAt: 'Pass State',
            States: {
              'Pass State': {
                Type: 'Pass',
                End: true,
              },
            },
          },
          ItemsPath: '$.inputForMap',
          MaxConcurrency: 1,
        },
      },
    });
  }),
  test('synth is successful', () => {
    const app = createAppWithMap((stack) => {
      const map = new stepfunctions.Map(stack, 'Map State', {
        maxConcurrency: 1,
        itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      });
      map.iterator(new stepfunctions.Pass(stack, 'Pass State'));
      return map;
    });

    app.synth();
  }),
  test('fails in synthesis if iterator is missing', () => {
    const app = createAppWithMap((stack) => {
      const map = new stepfunctions.Map(stack, 'Map State', {
        maxConcurrency: 1,
        itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      });

      return map;
    });

    expect(() => app.synth()).toThrow(/Map state must have a non-empty iterator/);
  }),
  test('fails in synthesis when maxConcurrency is a float', () => {
    const app = createAppWithMap((stack) => {
      const map = new stepfunctions.Map(stack, 'Map State', {
        maxConcurrency: 1.2,
        itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      });
      map.iterator(new stepfunctions.Pass(stack, 'Pass State'));

      return map;
    });

    expect(() => app.synth()).toThrow(/maxConcurrency has to be a positive integer/);
  }),
  test('fails in synthesis when maxConcurrency is a negative integer', () => {
    const app = createAppWithMap((stack) => {
      const map = new stepfunctions.Map(stack, 'Map State', {
        maxConcurrency: -1,
        itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      });
      map.iterator(new stepfunctions.Pass(stack, 'Pass State'));

      return map;
    });

    expect(() => app.synth()).toThrow(/maxConcurrency has to be a positive integer/);
  }),
  test('fails in synthesis when maxConcurrency is too big to be an integer', () => {
    const app = createAppWithMap((stack) => {
      const map = new stepfunctions.Map(stack, 'Map State', {
        maxConcurrency: Number.MAX_VALUE,
        itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      });
      map.iterator(new stepfunctions.Pass(stack, 'Pass State'));

      return map;
    });

    expect(() => app.synth()).toThrow(/maxConcurrency has to be a positive integer/);
  }),
  test('isPositiveInteger is false with negative number', () => {
    expect(stepfunctions.isPositiveInteger(-1)).toEqual(false);
  }),
  test('isPositiveInteger is false with decimal number', () => {
    expect(stepfunctions.isPositiveInteger(1.2)).toEqual(false);
  }),
  test('isPositiveInteger is false with a value greater than safe integer', () => {
    const valueToTest = Number.MAX_SAFE_INTEGER + 1;
    expect(stepfunctions.isPositiveInteger(valueToTest)).toEqual(false);
  }),
  test('isPositiveInteger is true with 0', () => {
    expect(stepfunctions.isPositiveInteger(0)).toEqual(true);
  }),
  test('isPositiveInteger is true with 10', () => {
    expect(stepfunctions.isPositiveInteger(10)).toEqual(true);
  }),
  test('isPositiveInteger is true with max integer value', () => {
    expect(stepfunctions.isPositiveInteger(Number.MAX_SAFE_INTEGER)).toEqual(true);
  });
});

function render(sm: stepfunctions.IChainable) {
  return new cdk.Stack().resolve(new stepfunctions.StateGraph(sm.startState, 'Test Graph').toGraphJson());
}

function createAppWithMap(mapFactory: (stack: cdk.Stack) => stepfunctions.Map) {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'my-stack');
  const map = mapFactory(stack);
  new stepfunctions.StateGraph(map, 'Test Graph');
  return app;
}
