import { Template } from '../../assertions';
import { Stack } from '../../core';
import { LogGroup, Transformer, BaseProcessor, ParserProcessorType, JsonMutatorType, StringMutatorType, DelimiterCharacter, DataConverterType, TypeConverterType, QuoteCharacter, VendedLogType, OCSFSourceType, OCSFVersion } from '../lib';

describe('transformer', () => {
  // Parser Processor tests
  test('create a JSON parser transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
      jsonOptions: { source: 'customField' },
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [jsonParser],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [{
        ParseJSON: { Source: 'customField' },
      }],
    });
  });

  test('create a KeyValue parser transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const keyValueParser = BaseProcessor.createParserProcessor(stack, 'KeyValue', {
      type: ParserProcessorType.KEY_VALUE,
      keyValueOptions: { },
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [keyValueParser],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [{
        ParseKeyValue: {
          Source: '@message',
          FieldDelimiter: '&',
          KeyValueDelimiter: '=',
          OverwriteIfExists: false,
        },
      }],
    });
  });

  test('create a CSV parser transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const csvParser = BaseProcessor.createParserProcessor(stack, 'CsvParser', {
      type: ParserProcessorType.CSV,
      csvOptions: {
        quoteCharacter: QuoteCharacter.SINGLE_QUOTE,
        delimiter: DelimiterCharacter.PIPE,
      },
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [csvParser],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [{
        Csv: {
          Source: '@message',
          QuoteCharacter: "'",
          Delimiter: '|',
        },
      }],
    });
  });

  test('create a Grok parser transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const grokParser = BaseProcessor.createParserProcessor(stack, 'GrokParser', {
      type: ParserProcessorType.GROK,
      grokOptions: { source: 'customField', match: 'custom_grok_pattern' },
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [grokParser],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [{
        Grok: { Source: 'customField', Match: 'custom_grok_pattern' },
      }],
    });
  });

  // Vended log sources tests
  test('create a CloudFront parser transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const cloudFrontParser = BaseProcessor.createVendedLogParser(stack, 'CloudfrontParser', {
      logType: VendedLogType.CLOUDFRONT,
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [cloudFrontParser],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [{
        ParseCloudfront: { },
      }],
    });
  });

  test('create a VPC parser transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const vpcParser = BaseProcessor.createVendedLogParser(stack, 'VpcParser', {
      logType: VendedLogType.VPC,
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [vpcParser],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [{
        ParseVPC: { },
      }],
    });
  });

  test('create a WAF parser transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const wafParser = BaseProcessor.createVendedLogParser(stack, 'WafParser', {
      logType: VendedLogType.WAF,
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [wafParser],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [{
        ParseWAF: { },
      }],
    });
  });

  test('create a Route53 parser transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const route53Parser = BaseProcessor.createVendedLogParser(stack, 'Route53Parser', {
      logType: VendedLogType.ROUTE53,
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [route53Parser],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [{
        ParseRoute53: { },
      }],
    });
  });

  test('create a PostGres parser transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const postGresParser = BaseProcessor.createVendedLogParser(stack, 'PostGresParser', {
      logType: VendedLogType.POSTGRES,
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [postGresParser],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [{
        ParsePostgres: { },
      }],
    });
  });

  test('create a OCSF parser transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const ocsfParser = BaseProcessor.createVendedLogParser(stack, 'OCSF', {
      logType: VendedLogType.OCSF,
      parseToOCSFOptions: {
        eventSource: OCSFSourceType.CLOUD_TRAIL,
        ocsfVersion: OCSFVersion.V1_1
      }
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [ocsfParser],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [{
        ParseToOCSF: { 
          Source: "@message",
          EventSource: "CloudTrail",
          OcsfVersion: "V1.1"
        },
      }],
    });
  });

  // Json Mutator tests
  test('create a Add Key transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const addKeysProcesor = BaseProcessor.createJsonMutator(stack, 'AddKeys', {
      type: JsonMutatorType.ADD_KEYS,
      addKeysOptions: {
        entries: [
          { key: 'test_key1', value: 'test_value1', overwriteIfExists: true },
          { key: 'test_key2', value: 'test_value2' },
          { key: 'test_key3', value: 'test_value3', overwriteIfExists: false },
        ],
      },
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [jsonParser, addKeysProcesor],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [
        {
          ParseJSON: { Source: '@message' },
        },
        {
          AddKeys: {
            Entries: [
              { Key: 'test_key1', Value: 'test_value1', OverwriteIfExists: true },
              { Key: 'test_key2', Value: 'test_value2', OverwriteIfExists: false },
              { Key: 'test_key3', Value: 'test_value3', OverwriteIfExists: false },
            ],
          },
        },
      ],
    });
  });

  test('create a Delete Key transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const deleteKeysProcessor = BaseProcessor.createJsonMutator(stack, 'DeleteKeys', {
      type: JsonMutatorType.DELETE_KEYS,
      deleteKeysOptions: {
        withKeys: ['test_delete_key1', 'test_delete_key2'],
      },
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [jsonParser, deleteKeysProcessor],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [
        {
          ParseJSON: { Source: '@message' },
        },
        {
          DeleteKeys: { WithKeys: ['test_delete_key1', 'test_delete_key2'] },
        },
      ],
    });
  });

  test('create a Move Key transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const moveKeysProcesor = BaseProcessor.createJsonMutator(stack, 'MoveKeys', {
      type: JsonMutatorType.MOVE_KEYS,
      moveKeysOptions: {
        entries: [
          { source: 'test_source1', target: 'test_target1', overwriteIfExists: true },
          { source: 'test_source2', target: 'test_target2' },
          { source: 'test_source3', target: 'test_target3', overwriteIfExists: false },
        ],
      },
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [jsonParser, moveKeysProcesor],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [
        {
          ParseJSON: { Source: '@message' },
        },
        {
          MoveKeys: {
            Entries: [
              { Source: 'test_source1', Target: 'test_target1', OverwriteIfExists: true },
              { Source: 'test_source2', Target: 'test_target2', OverwriteIfExists: false },
              { Source: 'test_source3', Target: 'test_target3', OverwriteIfExists: false },
            ],
          },
        },
      ],
    });
  });

  test('create a Rename Key transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const renameKeysProcessor = BaseProcessor.createJsonMutator(stack, 'RenameKeys', {
      type: JsonMutatorType.RENAME_KEYS,
      renameKeysOptions: {
        entries: [
          { key: 'test_key1', renameTo: 'test_rename1', overwriteIfExists: true },
          { key: 'test_key2', renameTo: 'test_rename2' },
          { key: 'test_key3', renameTo: 'test_rename3', overwriteIfExists: false },
        ],
      },
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [jsonParser, renameKeysProcessor],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [
        {
          ParseJSON: { Source: '@message' },
        },
        {
          RenameKeys: {
            Entries: [
              { Key: 'test_key1', RenameTo: 'test_rename1', OverwriteIfExists: true },
              { Key: 'test_key2', RenameTo: 'test_rename2', OverwriteIfExists: false },
              { Key: 'test_key3', RenameTo: 'test_rename3', OverwriteIfExists: false },
            ],
          },
        },
      ],
    });
  });

  test('create a Copy Value transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const copyValueProcessor = BaseProcessor.createJsonMutator(stack, 'CopyValue', {
      type: JsonMutatorType.COPY_VALUE,
      copyValueOptions: {
        entries: [
          { source: 'test_source1', target: 'test_target1', overwriteIfExists: true },
          { source: 'test_source2', target: 'test_target2' },
          { source: 'test_source3', target: 'test_target3', overwriteIfExists: false },
        ],
      },
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [jsonParser, copyValueProcessor],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [
        {
          ParseJSON: { Source: '@message' },
        },
        {
          CopyValue: {
            Entries: [
              { Source: 'test_source1', Target: 'test_target1', OverwriteIfExists: true },
              { Source: 'test_source2', Target: 'test_target2', OverwriteIfExists: false },
              { Source: 'test_source3', Target: 'test_target3', OverwriteIfExists: false },
            ],
          },
        },
      ],
    });
  });

  test('create a List To Map transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const listToMapProcessor = BaseProcessor.createJsonMutator(stack, 'ListToMap', {
      type: JsonMutatorType.LIST_TO_MAP,
      listToMapOptions: {
        source: 'test_source1',
        key: 'test_key1',
      },
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [jsonParser, listToMapProcessor],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [
        {
          ParseJSON: { Source: '@message' },
        },
        {
          ListToMap: {
            Source: 'test_source1',
            Key: 'test_key1',
            Flatten: false,
          },
        },
      ],
    });
  });
  // String mutator tests
  test('create LowerCase transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const lowercaseProcessor = BaseProcessor.createStringMutator(stack, 'LowerCase', {
      type: StringMutatorType.LOWER_CASE,
      lowerCaseKeys: ['test_key1', 'test_key2'],
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [jsonParser, lowercaseProcessor],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [
        {
          ParseJSON: { Source: '@message' },
        },
        {
          LowerCaseString: { WithKeys: ['test_key1', 'test_key2'] },
        },
      ],
    });
  });

  test('create UpperCase transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const upperCaseProcessor = BaseProcessor.createStringMutator(stack, 'UpperCase', {
      type: StringMutatorType.UPPER_CASE,
      upperCaseKeys: ['test_key1', 'test_key2'],
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [jsonParser, upperCaseProcessor],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [
        {
          ParseJSON: { Source: '@message' },
        },
        {
          UpperCaseString: { WithKeys: ['test_key1', 'test_key2'] },
        },
      ],
    });
  });

  test('create Trim transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const trimStringProcessor = BaseProcessor.createStringMutator(stack, 'Trim', {
      type: StringMutatorType.TRIM,
      trimKeys: ['test_key1', 'test_key2'],
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [jsonParser, trimStringProcessor],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [
        {
          ParseJSON: { Source: '@message' },
        },
        {
          TrimString: { WithKeys: ['test_key1', 'test_key2'] },
        },
      ],
    });
  });

  test('create Split transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const splitStringProcessor = BaseProcessor.createStringMutator(stack, 'SplitString', {
      type: StringMutatorType.SPLIT,
      splitOptions: {
        entries: [
          { source: 'test_source1', delimiter: DelimiterCharacter.COMMA },
          { source: 'test_source2', delimiter: DelimiterCharacter.PIPE },
          { source: 'test_source3', delimiter: DelimiterCharacter.SEMICOLON },
          { source: 'test_source4', delimiter: DelimiterCharacter.SPACE },
          { source: 'test_source5', delimiter: DelimiterCharacter.TAB },
        ],
      },
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [jsonParser, splitStringProcessor],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [
        {
          ParseJSON: { Source: '@message' },
        },
        {
          SplitString: {
            Entries: [
              { Source: 'test_source1', Delimiter: ',' },
              { Source: 'test_source2', Delimiter: '|' },
              { Source: 'test_source3', Delimiter: ';' },
              { Source: 'test_source4', Delimiter: ' ' },
              { Source: 'test_source5', Delimiter: '\t' },
            ],
          },
        },
      ],
    });
  });

  test('create SubstituteString transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const substituteStringProcessor = BaseProcessor.createStringMutator(stack, 'SubstituteString', {
      type: StringMutatorType.SUBSTITUTE,
      substituteOptions: {
        entries: [
          { source: 'test_source1', from: 'test_from1', to: 'test_to1' },
          { source: 'test_source2', from: 'test_from2', to: 'test_to2' },
          { source: 'test_source3', from: 'test_from3', to: 'test_to3' },
        ],
      },
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [jsonParser, substituteStringProcessor],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [
        {
          ParseJSON: { Source: '@message' },
        },
        {
          SubstituteString: {
            Entries: [
              { Source: 'test_source1', From: 'test_from1', To: 'test_to1' },
              { Source: 'test_source2', From: 'test_from2', To: 'test_to2' },
              { Source: 'test_source3', From: 'test_from3', To: 'test_to3' },
            ],
          },
        },
      ],
    });
  });
  // Data Convertor Processors
  test('create DateTime transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const dateTimeProcessor = BaseProcessor.createDataConverter(stack, 'DateTimeConverter', {
      type: DataConverterType.DATETIME_CONVERTER,
      dateTimeConverterOptions: {
        source: 'test_source1',
        target: 'test_target1',
        locale: 'en',
        matchPatterns: ['EEEE dd. MMMM yyyy HH:mm:ss'],
        targetFormat: 'yyyy-mm-dd',
        targetTimezone: 'PDT',
      },
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [jsonParser, dateTimeProcessor],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [
        {
          ParseJSON: { Source: '@message' },
        },
        {
          DateTimeConverter: {
            Source: 'test_source1',
            Target: 'test_target1',
            Locale: 'en',
            MatchPatterns: ['EEEE dd. MMMM yyyy HH:mm:ss'],
            TargetFormat: 'yyyy-mm-dd',
            TargetTimezone: 'PDT',
            SourceTimezone: 'UTC',
          },
        },
      ],
    });
  });

  test('create TypeConverter transformer against a log group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const lowercaseProcessor = BaseProcessor.createDataConverter(stack, 'TypeConverter', {
      type: DataConverterType.TYPE_CONVERTER,
      typeConverterOptions: {
        entries: [
          { key: 'test_key1', type: TypeConverterType.BOOLEAN },
          { key: 'test_key2', type: TypeConverterType.STRING },
          { key: 'test_key3', type: TypeConverterType.INTEGER },
          { key: 'test_key4', type: TypeConverterType.DOUBLE },
        ],
      },
    });

    new Transformer(stack, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [jsonParser, lowercaseProcessor],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Transformer', {
      LogGroupIdentifier: { Ref: 'awscdktestloggroup30AE39AB' },
      TransformerConfig: [
        {
          ParseJSON: { Source: '@message' },
        },
        {
          TypeConverter: {
            Entries: [
              { Key: 'test_key1', Type: 'boolean' },
              { Key: 'test_key2', Type: 'string' },
              { Key: 'test_key3', Type: 'integer' },
              { Key: 'test_key4', Type: 'double' },
            ],
          },
        },
      ],
    });
  });
  // Transformer config validation tests
  test('Transformer config with zero processors should fail', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    // THEN
    expect( () => {
      new Transformer(stack, 'Transformer', {
        transformerName: 'MyTransformer',
        logGroup: logGroup,
        transformerConfig: [],
      },
      );
    }).toThrow('At least one processor is required in a transformer');
  });

  test('Transformer config with 21 processors should fail', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const trimStringProcessor = BaseProcessor.createStringMutator(stack, 'Trim', {
      type: StringMutatorType.TRIM,
      trimKeys: ['test_key1', 'test_key2'],
    });

    // THEN
    expect( () => {
      new Transformer(stack, 'Transformer', {
        transformerName: 'MyTransformer',
        logGroup: logGroup,
        transformerConfig: [jsonParser, trimStringProcessor,
          trimStringProcessor, trimStringProcessor, trimStringProcessor,
          trimStringProcessor, trimStringProcessor, trimStringProcessor,
          trimStringProcessor, trimStringProcessor, trimStringProcessor,
          trimStringProcessor, trimStringProcessor, trimStringProcessor,
          trimStringProcessor, trimStringProcessor, trimStringProcessor,
          trimStringProcessor, trimStringProcessor, trimStringProcessor,
          trimStringProcessor],
      },
      );
    }).toThrow('A transformer cannot have more than 20 processors');
  });

  test('Transformer config with a parser not as the first processor should fail', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const trimStringProcessor = BaseProcessor.createStringMutator(stack, 'Trim', {
      type: StringMutatorType.TRIM,
      trimKeys: ['test_key1', 'test_key2'],
    });

    // THEN
    expect( () => {
      new Transformer(stack, 'Transformer', {
        transformerName: 'MyTransformer',
        logGroup: logGroup,
        transformerConfig: [trimStringProcessor, jsonParser],
      },
      );
    }).toThrow('First processor in a transformer must be a parser');
  });

  test('Transformer config with more than 5 parser processors should fail', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    const cloudFrontParser = BaseProcessor.createVendedLogParser(stack, 'CloudfrontParser', {
      logType: VendedLogType.CLOUDFRONT,
    });

    // THEN
    expect( () => {
      new Transformer(stack, 'Transformer', {
        transformerName: 'MyTransformer',
        logGroup: logGroup,
        transformerConfig: [cloudFrontParser, jsonParser, jsonParser, jsonParser, jsonParser, jsonParser],
      },
      );
    }).toThrow('A transformer cannot have more than 5 parser-type processors');
  });

  test('Transformer config with more than 1 vended parser processors should fail', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const cloudFrontParser = BaseProcessor.createVendedLogParser(stack, 'CloudfrontParser', {
      logType: VendedLogType.CLOUDFRONT,
    });

    // THEN
    expect( () => {
      new Transformer(stack, 'Transformer', {
        transformerName: 'MyTransformer',
        logGroup: logGroup,
        transformerConfig: [cloudFrontParser, cloudFrontParser],
      },
      );
    }).toThrow('Only one vended log parser is allowed in a transformer');
  });

  test('Transformer config with vended parser processor not in first position should fail', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const cloudFrontParser = BaseProcessor.createVendedLogParser(stack, 'CloudfrontParser', {
      logType: VendedLogType.CLOUDFRONT,
    });

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    // THEN
    expect( () => {
      new Transformer(stack, 'Transformer', {
        transformerName: 'MyTransformer',
        logGroup: logGroup,
        transformerConfig: [jsonParser, cloudFrontParser],
      },
      );
    }).toThrow('AWS vended log parser must be the first processor in a transformer');
  });

  test('Transformer config more than one Grok parsers should fail', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const grokParser = BaseProcessor.createParserProcessor(stack, 'GrokParser', {
      type: ParserProcessorType.GROK,
      grokOptions: { source: 'customField', match: 'custom_grok_pattern' },
    });

    // THEN
    expect( () => {
      new Transformer(stack, 'Transformer', {
        transformerName: 'MyTransformer',
        logGroup: logGroup,
        transformerConfig: [grokParser, grokParser],
      },
      );
    }).toThrow('Only one grok processor is allowed in a transformer');
  });

  test('Transformer config with more than 1 AddKeys should fail', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const addKeysProcesor = BaseProcessor.createJsonMutator(stack, 'AddKeys', {
      type: JsonMutatorType.ADD_KEYS,
      addKeysOptions: {
        entries: [{ key: 'test_key1', value: 'test_value1', overwriteIfExists: true }],
      },
    });

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    // THEN
    expect( () => {
      new Transformer(stack, 'Transformer', {
        transformerName: 'MyTransformer',
        logGroup: logGroup,
        transformerConfig: [jsonParser, addKeysProcesor, addKeysProcesor],
      },
      );
    }).toThrow('Only one addKeys processor is allowed in a transformer');
  });

  test('Transformer config with more than one copy value processor should fail', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'aws_cdk_test_log_group');

    const copyValueProcessor = BaseProcessor.createJsonMutator(stack, 'CopyValue', {
      type: JsonMutatorType.COPY_VALUE,
      copyValueOptions: {
        entries: [
          { source: 'test_source1', target: 'test_target1', overwriteIfExists: true },
        ],
      },
    });

    const jsonParser = BaseProcessor.createParserProcessor(stack, 'JsonParser', {
      type: ParserProcessorType.JSON,
    });

    // THEN
    expect( () => {
      new Transformer(stack, 'Transformer', {
        transformerName: 'MyTransformer',
        logGroup: logGroup,
        transformerConfig: [jsonParser, copyValueProcessor, copyValueProcessor],
      },
      );
    }).toThrow('Only one copyValue processor is allowed in a transformer');
  });
});
