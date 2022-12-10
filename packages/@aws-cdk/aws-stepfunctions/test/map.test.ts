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
      itemSelector: {
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
          ItemSelector: {
            'foo': 'foo',
            'bar.$': '$.bar',
          },
          ItemProcessor: {
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

  test('State Machine With Map State and ResultSelector', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = new stepfunctions.Map(stack, 'Map State', {
      maxConcurrency: 1,
      itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      resultSelector: {
        buz: 'buz',
        baz: stepfunctions.JsonPath.stringAt('$.baz'),
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
          ItemProcessor: {
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
          ResultSelector: {
            'buz': 'buz',
            'baz.$': '$.baz',
          },
        },
      },
    });
  }),

  test('State Machine with basic Distributed Map State', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = new stepfunctions.Map(stack, 'Map State', {
      maxConcurrency: 1,
      mode: stepfunctions.MapProcessorMode.DISTRIBUTED,
      distributatedMapOptions: {},
    });
    map.iterator(new stepfunctions.Pass(stack, 'Pass State'));

    // THEN
    expect(render(map)).toStrictEqual({
      StartAt: 'Map State',
      States: {
        'Map State': {
          Type: 'Map',
          End: true,
          ItemProcessor: {
            ProcessorConfig: {
              Mode: 'DISTRIBUTED',
              ExecutionType: 'STANDARD',
            },
            StartAt: 'Pass State',
            States: {
              'Pass State': {
                Type: 'Pass',
                End: true,
              },
            },
          },
          MaxConcurrency: 1,
        },
      },
    });
  }),

  test('State Machine with all Distributed Map State properties', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = new stepfunctions.Map(stack, 'Map State', {
      maxConcurrency: 1,
      mode: stepfunctions.MapProcessorMode.DISTRIBUTED,
      distributatedMapOptions: {
        executionType: stepfunctions.StateMachineType.EXPRESS,
        label: 'mylabel',
        itemBatcher: {
          maxItemsPerBatch: 10,
          maxInputBytesPerBatchPath: stepfunctions.JsonPath.stringAt('$.maxInputBytesPerBatch'),
        },
        itemReader: new stepfunctions.S3ObjectsReader({
          bucket: 'mybucket',
          key: 'mykey',
          maxItemsPath: stepfunctions.JsonPath.stringAt('$.maxItems'),
        }),
        resultWriter: new stepfunctions.S3Writer({
          bucket: 'mybucket',
          prefix: 'myprefix',
        }),
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
          Label: 'mylabel',
          ItemBatcher: {
            MaxItemsPerBatch: 10,
            MaxInputBytesPerBatchPath: '$.maxInputBytesPerBatch',
          },
          ItemReader: {
            ReaderConfig: {
              MaxItemsPath: '$.maxItems',
            },
            Resource: 'arn:aws:states:::s3:listObjectsV2',
            Parameters: {
              Bucket: 'mybucket',
              Prefix: 'mykey',
            },
          },
          ResultWriter: {
            Resource: 'arn:aws:states:::s3:putObject',
            Parameters: {
              Bucket: 'mybucket',
              Prefix: 'myprefix',
            },
          },
          ItemProcessor: {
            ProcessorConfig: {
              Mode: 'DISTRIBUTED',
              ExecutionType: 'EXPRESS',
            },
            StartAt: 'Pass State',
            States: {
              'Pass State': {
                Type: 'Pass',
                End: true,
              },
            },
          },
          MaxConcurrency: 1,
        },
      },
    });
  }),

  test('S3JsonReader with required properties', () => {
    // WHEN
    const reader = new stepfunctions.S3JsonReader({
      bucket: 'mybucket',
      key: 'mykey',
    });

    // THEN
    expect(reader.render()).toStrictEqual({
      ReaderConfig: {
        InputType: 'JSON',
      },
      Resource: 'arn:aws:states:::s3:getObject',
      Parameters: {
        Bucket: 'mybucket',
        Key: 'mykey',
      },
    });
  }),

  test('S3InventoryReader with required properties', () => {
    // WHEN
    const reader = new stepfunctions.S3InventoryReader({
      bucket: 'mybucket',
      key: 'mykey',
    });

    // THEN
    expect(reader.render()).toStrictEqual({
      ReaderConfig: {
        InputType: 'MANIFEST',
      },
      Resource: 'arn:aws:states:::s3:getObject',
      Parameters: {
        Bucket: 'mybucket',
        Key: 'mykey',
      },
    });
  }),

  test('S3CSVReader with required properties', () => {
    // WHEN
    const reader = new stepfunctions.S3CSVReader({
      bucket: 'mybucket',
      key: 'mykey',
    });

    // THEN
    expect(reader.render()).toStrictEqual({
      ReaderConfig: {
        InputType: 'CSV',
        CSVHeaderLocation: 'FIRST_ROW',
      },
      Resource: 'arn:aws:states:::s3:getObject',
      Parameters: {
        Bucket: 'mybucket',
        Key: 'mykey',
      },
    });
  }),

  test('S3CSVReader with all the properties', () => {
    // WHEN
    const reader = new stepfunctions.S3CSVReader({
      bucket: 'mybucket',
      key: 'mykey',
      headerLocation: stepfunctions.CSVHeaderLocation.GIVEN,
      headers: ['foo', 'bar'],
      maxItems: 10,
    });

    // THEN
    expect(reader.render()).toStrictEqual({
      ReaderConfig: {
        InputType: 'CSV',
        CSVHeaderLocation: 'GIVEN',
        CSVHeaders: ['foo', 'bar'],
        MaxItems: 10,
      },
      Resource: 'arn:aws:states:::s3:getObject',
      Parameters: {
        Bucket: 'mybucket',
        Key: 'mykey',
      },
    });
  }),

  test('S3CSVReader fails if headerLocation is GIVEN and headers not specified', () => {
    expect(
      () =>
        new stepfunctions.S3CSVReader({
          bucket: 'mybucket',
          key: 'mykey',
          headerLocation: stepfunctions.CSVHeaderLocation.GIVEN,
        }),
    ).toThrow(/headers must be specified when headerLocation is GIVEN/);
  }),

  test('S3CSVReader fails if headerLocation is FIRST_ROW and headers are specified', () => {
    expect(
      () =>
        new stepfunctions.S3CSVReader({
          bucket: 'mybucket',
          key: 'mykey',
          headerLocation: stepfunctions.CSVHeaderLocation.FIRST_ROW,
          headers: ['foo', 'bar'],
        }),
    ).toThrow(/headers must not be specified when headerLocation is FIRST_ROW/);
  }),

  test('ItemReader fails if both maxItems and maxItemsPath are specified', () => {
    expect(
      () =>
        new stepfunctions.S3ObjectsReader({
          bucket: 'mybucket',
          key: 'mykey',
          maxItems: 10,
          maxItemsPath: stepfunctions.JsonPath.stringAt('$.maxItems'),
        }),
    ).toThrow(/Only one of maxItems and maxItemsPath can be provided/);
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

  test('does not fail synthesis when maxConcurrency is a jsonPath', () => {
    const app = createAppWithMap((stack) => {
      const map = new stepfunctions.Map(stack, 'Map State', {
        maxConcurrency: stepfunctions.JsonPath.numberAt('$.maxConcurrency'),
        itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      });
      map.iterator(new stepfunctions.Pass(stack, 'Pass State'));

      return map;
    });

    expect(() => app.synth()).not.toThrow();
  });

  test('throws if distributatedMapOptions are provided for INLINE mode', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    expect(
      () =>
        new stepfunctions.Map(stack, 'Map State', {
          maxConcurrency: 1,
          mode: stepfunctions.MapProcessorMode.INLINE,
          distributatedMapOptions: {},
        }),
    ).toThrow(/distributatedMapOptions can only be used with DISTRIBUTED mode/);
  });

  test('throws if label exceeds 40 characters', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    expect(
      () =>
        new stepfunctions.Map(stack, 'Map State', {
          maxConcurrency: 1,
          distributatedMapOptions: {
            label: 'a'.repeat(41),
          },
        }),
    ).toThrow(/Label can only be 40 characters long/);
  });

  test('throws if both maxItemsPerBatch and maxItemsPerBatchPath are provided', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    expect(
      () =>
        new stepfunctions.Map(stack, 'Map State', {
          maxConcurrency: 1,
          distributatedMapOptions: {
            itemBatcher: {
              maxItemsPerBatch: 1,
              maxItemsPerBatchPath: '$',
            },
          },
        }),
    ).toThrow(/Only one of maxItemsPerBatch or maxItemsPerBatchPath can be provided/);
  });

  test('throws if both maxInputBytesPerBatch and maxInputBytesPerBatchPath are provided', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    expect(
      () =>
        new stepfunctions.Map(stack, 'Map State', {
          maxConcurrency: 1,
          distributatedMapOptions: {
            itemBatcher: {
              maxInputBytesPerBatch: 100,
              maxInputBytesPerBatchPath: '$',
            },
          },
        }),
    ).toThrow(/Only one of maxInputBytesPerBatch or maxInputBytesPerBatchPath can be provided/);
  });

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
