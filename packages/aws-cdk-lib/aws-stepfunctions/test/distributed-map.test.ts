import { Annotations, Match, Template } from '../../assertions';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import { STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2 } from '../../cx-api';
import * as stepfunctions from '../lib';
import { CsvHeaders } from '../lib/states/distributed-map/item-reader';

describe('Distributed Map State', () => {
  test('DistributedMap isDistributedMap', () => {
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

    // THEN
    expect(() => {
      stepfunctions.DistributedMap.isDistributedMap(map);
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

  test('State Machine With Distributed Map State and jsonata item selector', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      maxConcurrency: 1,
      itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      jsonataItemSelector: '{% {\"foo\": \"foo\", \"bar\": $states.input.bar} %}',
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

    // THEN
    expect(render(map)).toStrictEqual({
      StartAt: 'Map State',
      States: {
        'Map State': {
          Type: 'Map',
          End: true,
          ItemSelector: '{% {\"foo\": \"foo\", \"bar\": $states.input.bar} %}',
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

    // WHEN
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

  test.each([[stepfunctions.S3JsonItemReader, 'JSON'], [stepfunctions.S3JsonLItemReader, 'JSONL']])('State Machine With Distributed Map State and $s', (jsonOrJsonlItemReader, inputType) => {
    // GIVEN
    const stack = new cdk.Stack();
    const readerBucket = new s3.Bucket(stack, 'TestBucket');

    // WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      maxConcurrency: 1,
      itemReader: new jsonOrJsonlItemReader({
        bucket: readerBucket,
        key: 'test.json',
      }),
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
              InputType: inputType,
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

    // WHEN
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

    // WHEN
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

  test.each([stepfunctions.CsvDelimiter.COMMA,
    stepfunctions.CsvDelimiter.PIPE,
    stepfunctions.CsvDelimiter.SEMICOLON,
    stepfunctions.CsvDelimiter.SPACE,
    stepfunctions.CsvDelimiter.TAB])('State Machine With Distributed Map State and Given S3CsvItemReader with csv delimiter %s', (csvDelimiter) => {
    // GIVEN
    const stack = new cdk.Stack();
    const readerBucket = new s3.Bucket(stack, 'TestBucket');

    // WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      maxConcurrency: 1,
      itemReader: new stepfunctions.S3CsvItemReader({
        bucket: readerBucket,
        key: 'test.csv',
        csvDelimiter,
      }),
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
              CSVDelimiter: csvDelimiter,
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

  test('State Machine With Distributed Map State and S3ManifestItemReader', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const readerBucket = new s3.Bucket(stack, 'TestBucket');

    // WHEN
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

  test('State Machine With Distributed Map State, ItemReader and BucketNamePath', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      itemReader: new stepfunctions.S3ManifestItemReader({
        bucketNamePath: stepfunctions.JsonPath.stringAt('$.bucketName'),
        key: stepfunctions.JsonPath.stringAt('$.key'),
      }),
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
              'Bucket.$': '$.bucketName',
              'Key.$': '$.key',
            },
          },
        },
      },
    });
  }),

  test('State Machine With Distributed Map State and Object Reader in JSONATA', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const writerBucket = new s3.Bucket(stack, 'TestBucket');

    // WHEN
    const map = stepfunctions.DistributedMap.jsonata(stack, 'Map State', {
      itemReader: new stepfunctions.S3ObjectsItemReader({
        bucket: writerBucket,
        prefix: 'my-prefix',
      }),
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

    // THEN
    expect(render(map, stepfunctions.QueryLanguage.JSONATA)).toStrictEqual({
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
          ItemReader: {
            Arguments: {
              Bucket: {
                Ref: 'TestBucket560B80BC',
              },
              Prefix: 'my-prefix',
            },
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':states:::s3:listObjectsV2',
                ],
              ],
            },
          },
        },
      },
    });
  }),

  describe('ResultWriter and ResultWriterV2', () => {
    describe.each([
      ['ResultWriter', false],
      ['ResultWriterV2', true],
    ])('when class is %s', (_, isResultWriterV2Enabled) => {
      test('State Machine With Distributed Map State and ResultWriter in JSONATA', () => {
        // GIVEN
        const stack = new cdk.Stack();
        stack.node.setContext(STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2, isResultWriterV2Enabled);
        const writerBucket = new s3.Bucket(stack, 'TestBucket');

        // WHEN
        const map = stepfunctions.DistributedMap.jsonata(stack, 'Map State', {
          maxConcurrency: 1,
          itemReader: new stepfunctions.S3CsvItemReader({
            bucket: writerBucket,
            key: 'CSV_KEY',
            csvHeaders: stepfunctions.CsvHeaders.useFirstRow(),
          }),
          resultWriter: new stepfunctions.ResultWriter({
            bucket: writerBucket,
            prefix: 'test',
          }),
          resultWriterV2: new stepfunctions.ResultWriterV2({
            bucket: writerBucket,
            prefix: 'test',
          }),
        });
        map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

        // THEN
        expect(render(map, stepfunctions.QueryLanguage.JSONATA)).toStrictEqual({
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
              ItemReader: {
                Arguments: {
                  Bucket: {
                    Ref: 'TestBucket560B80BC',
                  },
                  Key: 'CSV_KEY',
                },
                ReaderConfig: {
                  CSVHeaderLocation: 'FIRST_ROW',
                  InputType: 'CSV',
                },
                Resource: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':states:::s3:getObject',
                    ],
                  ],
                },
              },
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
                Arguments: {
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

      test('State Machine With Distributed Map State and ResultWriter containing only Resource and Parameters details', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const writerBucket = new s3.Bucket(stack, 'TestBucket');

        // WHEN
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
      });
    });
  }),

  describe('ResultWriterV2', () => {
    describe.each([stepfunctions.OutputType.JSON, stepfunctions.OutputType.JSONL])('State Machine With Distributed Map State and ResultWriter containing only WriterConfig. OutputType is %s, ', (outputType) => {
      test.each([stepfunctions.Transformation.NONE, stepfunctions.Transformation.FLATTEN, stepfunctions.Transformation.COMPACT])('and Transformation is %s', (transformation) => {
        // GIVEN
        const stack = new cdk.Stack();
        stack.node.setContext(STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2, true);
        // WHEN
        const map = new stepfunctions.DistributedMap(stack, 'Map State', {
          maxConcurrency: 1,
          itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
          itemSelector: {
            foo: 'foo',
            bar: stepfunctions.JsonPath.stringAt('$.bar'),
          },
          resultWriterV2: new stepfunctions.ResultWriterV2({
            writerConfig: new stepfunctions.WriterConfig({
              outputType,
              transformation,
            }),
          }),
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
              ResultWriter: {
                WriterConfig: {
                  OutputType: outputType,
                  Transformation: transformation,
                },
              },
              MaxConcurrency: 1,
            },
          },
        });
      });
    }),

    describe.each([stepfunctions.OutputType.JSON, stepfunctions.OutputType.JSONL])('State Machine With Distributed Map State and ResultWriter having Resource, Parameters and WriterConfig. OutputType is %s', (outputType) => {
      test.each([stepfunctions.Transformation.NONE, stepfunctions.Transformation.FLATTEN, stepfunctions.Transformation.COMPACT])('and transformation is %s', (transformation) => {
        // GIVEN
        const stack = new cdk.Stack();
        stack.node.setContext(STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2, true);
        const writerBucket = new s3.Bucket(stack, 'TestBucket');

        // WHEN
        const map = new stepfunctions.DistributedMap(stack, 'Map State', {
          maxConcurrency: 1,
          itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
          itemSelector: {
            foo: 'foo',
            bar: stepfunctions.JsonPath.stringAt('$.bar'),
          },
          resultWriterV2: new stepfunctions.ResultWriterV2({
            bucket: writerBucket,
            prefix: 'test',
            writerConfig: new stepfunctions.WriterConfig({
              outputType,
              transformation,
            }),
          }),
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
                WriterConfig: {
                  OutputType: outputType,
                  Transformation: transformation,
                },
              },
              MaxConcurrency: 1,
            },
          },
        });
      });
    }),

    test('should use resultWriterV2 if feature is enabled and both resultWriter and resultWriterV2 are provided', () => {
      // GIVEN
      const stack = new cdk.Stack();
      stack.node.setContext(STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2, true);
      const writerBucket = new s3.Bucket(stack, 'TestBucket');
      // WHEN
      const map = new stepfunctions.DistributedMap(stack, 'Map State', {
        maxConcurrency: 1,
        itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
        itemSelector: {
          foo: 'foo',
          bar: stepfunctions.JsonPath.stringAt('$.bar'),
        },
        resultWriter: new stepfunctions.ResultWriter({
          bucket: writerBucket,
        }),
        resultWriterV2: new stepfunctions.ResultWriterV2({
          writerConfig: new stepfunctions.WriterConfig({
            outputType: stepfunctions.OutputType.JSON,
            transformation: stepfunctions.Transformation.COMPACT,
          }),
        }),
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
            ResultWriter: {
              WriterConfig: {
                OutputType: 'JSON',
                Transformation: 'COMPACT',
              },
            },
          },
        },
      });
    });

    test.each([undefined, false])('does not use resultWriterV2 if feature is not enabled', (feature) => {
      // GIVEN
      const stack = new cdk.Stack();
      stack.node.setContext(STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2, feature);
      const writerBucket = new s3.Bucket(stack, 'TestBucket');
      // WHEN
      const map = new stepfunctions.DistributedMap(stack, 'Map State', {
        maxConcurrency: 1,
        itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
        itemSelector: {
          foo: 'foo',
          bar: stepfunctions.JsonPath.stringAt('$.bar'),
        },
        resultWriterV2: new stepfunctions.ResultWriterV2({
          writerConfig: new stepfunctions.WriterConfig({
            outputType: stepfunctions.OutputType.JSON,
            transformation: stepfunctions.Transformation.COMPACT,
          }),
        }),
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
    });

    test.each([undefined, false])('should use resultWriter if feature is not enabled and resultWriter is provided', (feature) => {
      // GIVEN
      const stack = new cdk.Stack();
      stack.node.setContext(STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2, feature);
      const writerBucket = new s3.Bucket(stack, 'TestBucket');
      // WHEN
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
          },
        },
      });
    });

    test('adds warning if ResultWriter does not have either S3 details or WriterConfig', () => {
      // GIVEN
      const stack = new cdk.Stack();
      stack.node.setContext(STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2, true);
      // WHEN
      const map = new stepfunctions.DistributedMap(stack, 'Map State', {
        maxConcurrency: 1,
        itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
        itemSelector: {
          foo: 'foo',
          bar: stepfunctions.JsonPath.stringAt('$.bar'),
        },
        resultWriterV2: new stepfunctions.ResultWriterV2({}),
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
            ResultWriter: {},
          },
        },
      });
      Annotations.fromStack(stack).hasWarning('/Default/Map State', Match.stringLikeRegexp('ResultWriter should specify at least the WriterConfig or the Bucket and Prefix'));
    });
  }),

  test('State Machine With Distributed Map State, ResultWriter and bucketNamePath', () => {
    // GIVEN
    const stack = new cdk.Stack();
    stack.node.setContext(STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2, true);

    // WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      maxConcurrency: 1,
      itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      itemSelector: {
        foo: 'foo',
        bar: stepfunctions.JsonPath.stringAt('$.bar'),
      },
      resultWriterV2: new stepfunctions.ResultWriterV2({
        bucketNamePath: stepfunctions.JsonPath.stringAt('$.bucketName'),
        prefix: 'test',
      }),
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
              'Bucket.$': '$.bucketName',
              'Prefix': 'test',
            },
          },
          MaxConcurrency: 1,
        },
      },
    });
  }),

  test('State Machine With Distributed Map State, ResultWriter and bucketNamePath generate correct IAM Policy', () => {
    // GIVEN
    const stack = new cdk.Stack();
    stack.node.setContext(STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2, true);

    // WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      resultWriterV2: new stepfunctions.ResultWriterV2({
        bucketNamePath: stepfunctions.JsonPath.stringAt('$.bucketName'),
        prefix: 'test',
      }),
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

    new stepfunctions.StateMachine(stack, 'StateMachine', {
      definition: map,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:PutObject',
              's3:GetObject',
              's3:ListMultipartUploadParts',
              's3:AbortMultipartUpload',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
      Roles: [
        {
          Ref: 'StateMachineRoleB840431D',
        },
      ],
    });
  }),

  test('State Machine With Distributed Map State, ResultWriter and bucket generate correct IAM Policy', () => {
    // GIVEN
    const stack = new cdk.Stack();
    stack.node.setContext(STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2, true);

    // WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      resultWriterV2: new stepfunctions.ResultWriterV2({
        bucket: new s3.Bucket(stack, 'Bucket'),
        prefix: 'test',
      }),
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

    new stepfunctions.StateMachine(stack, 'StateMachine', {
      definition: map,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:PutObject',
              's3:GetObject',
              's3:ListMultipartUploadParts',
              's3:AbortMultipartUpload',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':s3:::',
                  { Ref: 'Bucket83908E77' },
                  '/*',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      Roles: [
        {
          Ref: 'StateMachineRoleB840431D',
        },
      ],
    });
  }),

  test('State Machine With Distributed Map State Path Properties', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      mapExecutionType: stepfunctions.StateMachineType.EXPRESS,
      toleratedFailurePercentagePath: stepfunctions.JsonPath.stringAt('$.toleratedFailurePercentage'),
      toleratedFailureCountPath: stepfunctions.JsonPath.stringAt('$.toleratedFailureCount'),
      itemBatcher: new stepfunctions.ItemBatcher({
        maxItemsPerBatchPath: stepfunctions.JsonPath.stringAt('$.maxItemsPerBatch'),
        maxInputBytesPerBatchPath: stepfunctions.JsonPath.stringAt('$.maxInputBytesPerBatch'),
      }),
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

    // WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      mapExecutionType: stepfunctions.StateMachineType.EXPRESS,
      toleratedFailurePercentage: 100,
      toleratedFailureCount: 101,
      label: 'testLabel',
      itemBatcher: new stepfunctions.ItemBatcher({
        maxItemsPerBatch: 10,
        maxInputBytesPerBatch: 11,
        batchInput: {
          Test: 'test',
        },
      }),
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

  test('State Machine With Distributed Map State with JSONata', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = stepfunctions.DistributedMap.jsonata(stack, 'Map State', {
      maxConcurrency: 1,
      items: stepfunctions.ProvideItems.jsonata('{% $inputForMap %}'),
      itemSelector: {
        foo: 'foo',
        bar: '{% $bar %}',
      },
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'));

    // THEN
    expect(render(map)).toStrictEqual({
      StartAt: 'Map State',
      States: {
        'Map State': {
          Type: 'Map',
          QueryLanguage: 'JSONata',
          End: true,
          Items: '{% $inputForMap %}',
          ItemSelector: {
            foo: 'foo',
            bar: '{% $bar %}',
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
          MaxConcurrency: 1,
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

  test('fails in synthesis if itemReader contains both bucket and bucketNamePath', () => {
    const app = createAppWithMap((stack) => {
      const map = new stepfunctions.DistributedMap(stack, 'Map State', {
        itemReader: new stepfunctions.S3JsonItemReader({
          bucket: new s3.Bucket(stack, 'TestBucket'),
          bucketNamePath: stepfunctions.JsonPath.stringAt('$.bucketName'),
          key: 'test.json',
        }),
      });

      return map;
    });

    expect(() => app.synth()).toThrow(/Provide either `bucket` or `bucketNamePath`, but not both/);
  }),

  test('fails in synthesis if itemReader contains neither bucket nor bucketNamePath', () => {
    const app = createAppWithMap((stack) => {
      const map = new stepfunctions.DistributedMap(stack, 'Map State', {
        itemReader: new stepfunctions.S3JsonItemReader({
          key: 'test.json',
        }),
      });

      return map;
    });

    expect(() => app.synth()).toThrow(/Provide either `bucket` or `bucketNamePath`/);
  }),

  test('fails in synthesis if resultWriter contains both bucket and bucketNamePath', () => {
    const app = createAppWithMap((stack) => {
      const writerBucket = new s3.Bucket(stack, 'TestBucket');

      const map = new stepfunctions.DistributedMap(stack, 'Map State', {
        resultWriterV2: new stepfunctions.ResultWriterV2({
          bucket: writerBucket,
          bucketNamePath: stepfunctions.JsonPath.stringAt('$.bucketName'),
        }),
      });

      return map;
    });

    expect(() => app.synth()).toThrow(/Provide either `bucket` or `bucketNamePath`, but not both/);
  }),

  test('does not throw while accessing bucket of itemReader which was initialised with bucket', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    const bucket = new s3.Bucket(stack, 'TestBucket');
    const itemReader = new stepfunctions.S3JsonItemReader({
      bucket,
      key: 'test.json',
    });

    expect(itemReader.bucket).toStrictEqual(bucket);
  }),

  test('throws while accessing bucket of itemReader which was initialised with bucketNamePath', () => {
    const itemReader = new stepfunctions.S3JsonItemReader({
      bucketNamePath: stepfunctions.JsonPath.stringAt('$.bucketName'),
      key: 'test.json',
    });

    expect(() => itemReader.bucket).toThrow(/`bucket` is undefined/);
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

  test('does not fail in synthesis if label has `s`', () => {
    const app = createAppWithMap((stack) => {
      const map = new stepfunctions.DistributedMap(stack, 'Map State', {
        label: 's',
        itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
      });

      return map;
    });

    app.synth();
  });

  test('State Machine With Distributed Map State should use default mapExecutionType and ignore itemProcessor executionType', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'), {
      mode: stepfunctions.ProcessorMode.DISTRIBUTED,
      executionType: stepfunctions.ProcessorType.EXPRESS,
    });

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
        },
      },
    });

    Annotations.fromStack(stack).hasWarning('/Default/Map State', Match.stringLikeRegexp('Property \'ProcessorConfig.executionType\' is ignored, use the \'mapExecutionType\' in the \'DistributedMap\' class instead.'));
  });

  test('State Machine With Distributed Map State should use configured mapExecutionType and ignore itemProcessor executionType', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = new stepfunctions.DistributedMap(stack, 'Map State', {
      mapExecutionType: stepfunctions.StateMachineType.EXPRESS,
    });
    map.itemProcessor(new stepfunctions.Pass(stack, 'Pass State'), {
      mode: stepfunctions.ProcessorMode.DISTRIBUTED,
      executionType: stepfunctions.ProcessorType.STANDARD,
    });

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
        },
      },
    });

    Annotations.fromStack(stack).hasWarning('/Default/Map State', Match.stringLikeRegexp('Property \'ProcessorConfig.executionType\' is ignored, use the \'mapExecutionType\' in the \'DistributedMap\' class instead.'));
  });
});

function render(sm: stepfunctions.IChainable, queryLanguage?: stepfunctions.QueryLanguage) {
  return new cdk.Stack().resolve(new stepfunctions.StateGraph(sm.startState, 'Test Graph').toGraphJson(queryLanguage));
}

function createAppWithMap(mapFactory: (stack: cdk.Stack) => stepfunctions.DistributedMap) {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'my-stack');
  const map = mapFactory(stack);
  new stepfunctions.StateGraph(map, 'Test Graph');
  return app;
}
