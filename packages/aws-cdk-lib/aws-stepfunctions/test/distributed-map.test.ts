import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import * as stepfunctions from '../lib';
import { CsvHeaders, DistributedMap } from '../lib';

describe('Distributed Map State', () => {
  test('DistributedMap isDistributedMap', () => {
    // GIVEN
    const stack = new cdk.Stack();

    //WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      maxConcurrency: 1,
      itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      itemSelector: {
        foo: 'foo',
        bar: stepfunctions.JsonPath.stringAt('$.bar'),
      },
    });

    // THEN
    expect(() => {
      DistributedMap.isDistributedMap(map);
    }).toBeTruthy();
  }),

  test('State Machine With Distributed Map State', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      maxConcurrency: 1,
      itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      itemSelector: {
        foo: 'foo',
        bar: stepfunctions.JsonPath.stringAt('$.bar'),
      },
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

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
            ProcessorConfig: {
              Mode: stepfunctions.ProcessorMode.DISTRIBUTED,
              ExecutionType: stepfunctions.StateMachineType.STANDARD,
            },
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

  test('State Machine With Distributed Map State with ResultPath', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      maxConcurrency: 1,
      itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      itemSelector: {
        foo: 'foo',
        bar: stepfunctions.JsonPath.stringAt('$.bar'),
      },
      resultPath: stepfunctions.JsonPath.DISCARD,
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State', { resultPath: stepfunctions.JsonPath.DISCARD }));

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
            ProcessorConfig: {
              Mode: stepfunctions.ProcessorMode.DISTRIBUTED,
              ExecutionType: stepfunctions.StateMachineType.STANDARD,
            },
            StartAt: 'Pass State',
            States: {
              'Pass State': {
                Type: 'Pass',
                End: true,
                ResultPath: null,
              },
            },
          },
          ItemsPath: '$.inputForMap',
          MaxConcurrency: 1,
          ResultPath: null,
        },
      },
    });
  }),

  test('State Machine With Distributed Map State and ResultSelector', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      maxConcurrency: 1,
      itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      resultSelector: {
        buz: 'buz',
        baz: stepfunctions.JsonPath.stringAt('$.baz'),
      },
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

    // THEN
    expect(render(map)).toStrictEqual({
      StartAt: 'Map State',
      States: {
        'Map State': {
          Type: 'Map',
          End: true,
          ItemProcessor: {
            ProcessorConfig: {
              Mode: stepfunctions.ProcessorMode.DISTRIBUTED,
              ExecutionType: stepfunctions.StateMachineType.STANDARD,
            },
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

  test('State Machine With Distributed Map State and S3ObjectsItemReader', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const readerBucket = new s3.Bucket(stack, 'TestBucket');

    //WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      maxConcurrency: 1,
      itemReader: new stepfunctions.S3ObjectsItemReader({
        bucket: readerBucket,
        prefix: 'test',
        maxItems: 10,
      }),
      itemSelector: {
        foo: 'foo',
        bar: stepfunctions.JsonPath.stringAt('$.bar'),
      },
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

    //THEN
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
            ProcessorConfig: {
              Mode: stepfunctions.ProcessorMode.DISTRIBUTED,
              ExecutionType: stepfunctions.StateMachineType.STANDARD,
            },
            StartAt: 'Pass State',
            States: {
              'Pass State': {
                Type: 'Pass',
                End: true,
              },
            },
          },
          ItemReader: {
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':states:::s3:listObjectsV2',
                ],
              ],
            },
            ReaderConfig: {
              MaxItems: 10,
            },
            Parameters: {
              Bucket: {
                Ref: stack.getLogicalId(readerBucket.node.defaultChild as s3.CfnBucket),
              },
              Prefix: 'test',
            },
          },
          MaxConcurrency: 1,
        },
      },
    });
  }),

  test('State Machine With Distributed Map State and S3JsonItemReader', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const readerBucket = new s3.Bucket(stack, 'TestBucket');

    //WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      maxConcurrency: 1,
      itemReader: new stepfunctions.S3JsonItemReader({
        bucket: readerBucket,
        key: 'test.json',
      }),
      itemSelector: {
        foo: 'foo',
        bar: stepfunctions.JsonPath.stringAt('$.bar'),
      },
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

    //THEN
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
            ProcessorConfig: {
              Mode: stepfunctions.ProcessorMode.DISTRIBUTED,
              ExecutionType: stepfunctions.StateMachineType.STANDARD,
            },
            StartAt: 'Pass State',
            States: {
              'Pass State': {
                Type: 'Pass',
                End: true,
              },
            },
          },
          ItemReader: {
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':states:::s3:getObject',
                ],
              ],
            },
            ReaderConfig: {
              InputType: 'JSON',
            },
            Parameters: {
              Bucket: {
                Ref: stack.getLogicalId(readerBucket.node.defaultChild as s3.CfnBucket),
              },
              Key: 'test.json',
            },
          },
          MaxConcurrency: 1,
        },
      },
    });
  }),

  test('State Machine With Distributed Map State and First Row S3CsvItemReader', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const readerBucket = new s3.Bucket(stack, 'TestBucket');

    //WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      maxConcurrency: 1,
      itemReader: new stepfunctions.S3CsvItemReader({
        bucket: readerBucket,
        key: 'test.csv',
        csvHeaders: CsvHeaders.useFirstRow(),
      }),
      itemSelector: {
        foo: 'foo',
        bar: stepfunctions.JsonPath.stringAt('$.bar'),
      },
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

    //THEN
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
            ProcessorConfig: {
              Mode: stepfunctions.ProcessorMode.DISTRIBUTED,
              ExecutionType: stepfunctions.StateMachineType.STANDARD,
            },
            StartAt: 'Pass State',
            States: {
              'Pass State': {
                Type: 'Pass',
                End: true,
              },
            },
          },
          ItemReader: {
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':states:::s3:getObject',
                ],
              ],
            },
            ReaderConfig: {
              InputType: 'CSV',
              CSVHeaderLocation: 'FIRST_ROW',
            },
            Parameters: {
              Bucket: {
                Ref: stack.getLogicalId(readerBucket.node.defaultChild as s3.CfnBucket),
              },
              Key: 'test.csv',
            },
          },
          MaxConcurrency: 1,
        },
      },
    });
  }),

  test('State Machine With Distributed Map State and Given S3CsvItemReader', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const readerBucket = new s3.Bucket(stack, 'TestBucket');

    //WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      maxConcurrency: 1,
      itemReader: new stepfunctions.S3CsvItemReader({
        bucket: readerBucket,
        key: 'test.json',
        csvHeaders: CsvHeaders.use(['header1', 'header2']),
      }),
      itemSelector: {
        foo: 'foo',
        bar: stepfunctions.JsonPath.stringAt('$.bar'),
      },
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

    //THEN
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
            ProcessorConfig: {
              Mode: stepfunctions.ProcessorMode.DISTRIBUTED,
              ExecutionType: stepfunctions.StateMachineType.STANDARD,
            },
            StartAt: 'Pass State',
            States: {
              'Pass State': {
                Type: 'Pass',
                End: true,
              },
            },
          },
          ItemReader: {
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':states:::s3:getObject',
                ],
              ],
            },
            ReaderConfig: {
              InputType: 'CSV',
              CSVHeaderLocation: 'GIVEN',
              CSVHeaders: ['header1', 'header2'],
            },
            Parameters: {
              Bucket: {
                Ref: stack.getLogicalId(readerBucket.node.defaultChild as s3.CfnBucket),
              },
              Key: 'test.json',
            },
          },
          MaxConcurrency: 1,
        },
      },
    });
  }),

  test('State Machine With Distributed Map State and S3ManifestItemReader', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const readerBucket = new s3.Bucket(stack, 'TestBucket');

    //WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      maxConcurrency: 1,
      itemReader: new stepfunctions.S3ManifestItemReader({
        bucket: readerBucket,
        key: 'manifest.json',
      }),
      itemSelector: {
        foo: 'foo',
        bar: stepfunctions.JsonPath.stringAt('$.bar'),
      },
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

    //THEN
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
            ProcessorConfig: {
              Mode: stepfunctions.ProcessorMode.DISTRIBUTED,
              ExecutionType: stepfunctions.StateMachineType.STANDARD,
            },
            StartAt: 'Pass State',
            States: {
              'Pass State': {
                Type: 'Pass',
                End: true,
              },
            },
          },
          ItemReader: {
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':states:::s3:getObject',
                ],
              ],
            },
            ReaderConfig: {
              InputType: 'MANIFEST',
            },
            Parameters: {
              Bucket: {
                Ref: stack.getLogicalId(readerBucket.node.defaultChild as s3.CfnBucket),
              },
              Key: 'manifest.json',
            },
          },
          MaxConcurrency: 1,
        },
      },
    });
  }),

  test('State Machine With Distributed Map State and ResultWriter', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const writerBucket = new s3.Bucket(stack, 'TestBucket');

    //WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      maxConcurrency: 1,
      itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      itemSelector: {
        foo: 'foo',
        bar: stepfunctions.JsonPath.stringAt('$.bar'),
      },
      resultWriter: new stepfunctions.ResultWriter({
        bucket: writerBucket,
        prefix: 'test',
      }),
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

    //THEN
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
            ProcessorConfig: {
              Mode: stepfunctions.ProcessorMode.DISTRIBUTED,
              ExecutionType: stepfunctions.StateMachineType.STANDARD,
            },
            StartAt: 'Pass State',
            States: {
              'Pass State': {
                Type: 'Pass',
                End: true,
              },
            },
          },
          ItemsPath: '$.inputForMap',
          ResultWriter: {
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':states:::s3:putObject',
                ],
              ],
            },
            Parameters: {
              Bucket: {
                Ref: stack.getLogicalId(writerBucket.node.defaultChild as s3.CfnBucket),
              },
              Prefix: 'test',
            },
          },
          MaxConcurrency: 1,
        },
      },
    });
  }),

  test('State Machine With Distributed Map State Path Properties', () => {
    // GIVEN
    const stack = new cdk.Stack();

    //WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      mapExecutionType: stepfunctions.StateMachineType.EXPRESS,
      toleratedFailurePercentagePath: stepfunctions.JsonPath.stringAt('$.toleratedFailurePercentage'),
      toleratedFailureCountPath: stepfunctions.JsonPath.stringAt('$.toleratedFailureCount'),
      maxItemsPerBatchPath: stepfunctions.JsonPath.stringAt('$.maxItemsPerBatch'),
      maxInputBytesPerBatchPath: stepfunctions.JsonPath.stringAt('$.maxInputBytesPerBatch'),
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

    //THEN
    expect(render(map)).toStrictEqual({
      StartAt: 'Map State',
      States: {
        'Map State': {
          Type: 'Map',
          End: true,
          ItemProcessor: {
            ProcessorConfig: {
              Mode: stepfunctions.ProcessorMode.DISTRIBUTED,
              ExecutionType: stepfunctions.StateMachineType.EXPRESS,
            },
            StartAt: 'Pass State',
            States: {
              'Pass State': {
                Type: 'Pass',
                End: true,
              },
            },
          },
          ItemsPath: '$.inputForMap',
          ToleratedFailurePercentagePath: '$.toleratedFailurePercentage',
          ToleratedFailureCountPath: '$.toleratedFailureCount',
          ItemBatcher: {
            MaxItemsPerBatchPath: '$.maxItemsPerBatch',
            MaxInputBytesPerBatchPath: '$.maxInputBytesPerBatch',
          },
        },
      },
    });
  }),

  test('State Machine With Distributed Map State Number Properties', () => {
    // GIVEN
    const stack = new cdk.Stack();

    //WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      mapExecutionType: stepfunctions.StateMachineType.EXPRESS,
      toleratedFailurePercentage: 100,
      toleratedFailureCount: 101,
      label: 'testLabel',
      maxItemsPerBatch: 10,
      maxInputBytesPerBatch: 11,
      batchInput: {
        Test: 'test',
      },
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

    //THEN
    expect(render(map)).toStrictEqual({
      StartAt: 'Map State',
      States: {
        'Map State': {
          Type: 'Map',
          End: true,
          ItemProcessor: {
            ProcessorConfig: {
              Mode: stepfunctions.ProcessorMode.DISTRIBUTED,
              ExecutionType: stepfunctions.StateMachineType.EXPRESS,
            },
            StartAt: 'Pass State',
            States: {
              'Pass State': {
                Type: 'Pass',
                End: true,
              },
            },
          },
          ItemsPath: '$.inputForMap',
          ToleratedFailurePercentage: 100,
          ToleratedFailureCount: 101,
          Label: 'testLabel',
          ItemBatcher: {
            BatchInput: {
              Test: 'test',
            },
            MaxItemsPerBatch: 10,
            MaxInputBytesPerBatch: 11,
          },
        },
      },
    });
  }),

  test('synth is successful', () => {
    const app = createAppWithMap((stack) => {
      const map = new stepfunctions.DistributedMap(stack, 'Map State', {
        maxConcurrency: 1,
        itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      });
      map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));
      return map;
    });

    app.synth();
  }),

  test('fails in synthesis if itemsPath and itemReader', () => {
    const app = createAppWithMap((stack) => {
      const map = new stepfunctions.DistributedMap(stack, 'Map State', {
        itemReader: new stepfunctions.S3JsonItemReader({
          bucket: new s3.Bucket(stack, 'TestBucket'),
          key: 'test.json',
        }),
        itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      });

      return map;
    });

    expect(() => app.synth()).toThrow(/Provide either `itemsPath` or `itemReader`, but not both/);
  }),

  test('fails in synthesis if ItemProcessor is in INLINE mode', () => {
    const app = createAppWithMap((stack) => {
      const map = new stepfunctions.DistributedMap(stack, 'Map State', {
        maxConcurrency: 1,
        itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      });
      map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'), {
        mode: stepfunctions.ProcessorMode.INLINE,
      });
      return map;
    });

    expect(() => app.synth()).toThrow(/Processing mode cannot be `INLINE` for a Distributed Map/);
  }),

  test('fails in synthesis if label is too long', () => {
    const app = createAppWithMap((stack) => {
      const map = new stepfunctions.DistributedMap(stack, 'Map State', {
        label: 'a'.repeat(45),
        itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      });

      return map;
    });

    expect(() => app.synth()).toThrow(/label must be 40 characters or less/);
  }),

  test('fails in synthesis if label has special characters', () => {
    const app = createAppWithMap((stack) => {
      const map = new stepfunctions.DistributedMap(stack, 'Map State', {
        label: 'this is invalid?',
        itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      });

      return map;
    });

    expect(() => app.synth()).toThrow(/label cannot contain any whitespace or special characters/);
  });
});

function render(sm: stepfunctions.IChainable) {
  return new cdk.Stack().resolve(new stepfunctions.StateGraph(sm.startState, 'Test Graph').toGraphJson());
}

function createAppWithMap(mapFactory: (stack: cdk.Stack) => stepfunctions.DistributedMap) {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'my-stack');
  const map = mapFactory(stack);
  new stepfunctions.StateGraph(map, 'Test Graph');
  return app;
}