import { App, CfnParameter, Fn, Stack } from '../lib';
import { ForEachResource } from '../lib/foreach-resource';
import { ForEachOutput } from '../lib/foreach-output';
import { ForEachCondition } from '../lib/foreach-condition';

describe('Fn.forEach', () => {
  test('synthesizes correct structure', () => {
    const stack = new Stack();
    const result = Fn.forEach(
      'Item',
      ['a', 'b', 'c'],
      'Resource${Item}',
      { Type: 'AWS::S3::Bucket' },
    );

    expect(stack.resolve(result)).toEqual({
      'Fn::ForEach::Item': [
        ['a', 'b', 'c'],
        { 'Resource${Item}': { Type: 'AWS::S3::Bucket' } },
      ],
    });
  });

  test('supports IResolvable collection', () => {
    const stack = new Stack();
    const param = new CfnParameter(stack, 'Items', { type: 'CommaDelimitedList' });
    const result = Fn.forEach('Item', param.valueAsList, 'R${Item}', {});

    const resolved = stack.resolve(result);
    expect(resolved['Fn::ForEach::Item'][0]).toEqual({ Ref: 'Items' });
  });

  test('validates loop name is alphanumeric', () => {
    expect(() => Fn.forEach('invalid-name', [], '', {}))
      .toThrow(/alphanumeric/);
  });

  test('forEachRef returns correct placeholder', () => {
    expect(Fn.forEachRef('MyVar')).toBe('${MyVar}');
  });

  test('adds LanguageExtensions transform', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    Fn.forEach('Item', ['a'], 'R${Item}', {});
    stack.resolve(Fn.forEach('Item', ['a'], 'R${Item}', {}));

    const template = app.synth().getStackByName('TestStack').template;
    expect(template.Transform).toContain('AWS::LanguageExtensions');
  });
});

describe('ForEachResource', () => {
  test('auto-adds LanguageExtensions transform', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new ForEachResource(stack, 'Buckets', {
      loopName: 'Env',
      collection: ['dev', 'prod'],
      resourceType: 'AWS::S3::Bucket',
      logicalIdTemplate: 'Bucket${Env}',
      properties: {},
    });

    const template = app.synth().getStackByName('TestStack').template;
    expect(template.Transform).toContain('AWS::LanguageExtensions');
  });

  test('generates correct ForEach structure in Resources', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new ForEachResource(stack, 'Buckets', {
      loopName: 'Env',
      collection: ['dev', 'prod'],
      resourceType: 'AWS::S3::Bucket',
      logicalIdTemplate: 'Bucket${Env}',
      properties: { BucketName: 'test-${Env}' },
    });

    const template = app.synth().getStackByName('TestStack').template;
    expect(template.Resources['Fn::ForEach::Env']).toBeDefined();
    expect(template.Resources['Fn::ForEach::Env'][0]).toEqual(['dev', 'prod']);
    expect(template.Resources['Fn::ForEach::Env'][1]['Bucket${Env}'].Type).toBe('AWS::S3::Bucket');
  });

  test('ref() returns templated reference', () => {
    const stack = new Stack();
    const buckets = new ForEachResource(stack, 'Buckets', {
      loopName: 'Env',
      collection: ['dev'],
      resourceType: 'AWS::S3::Bucket',
      logicalIdTemplate: 'Bucket${Env}',
      properties: {},
    });

    expect(stack.resolve(buckets.ref())).toEqual({ Ref: 'Bucket${Env}' });
  });

  test('refFor() returns concrete reference', () => {
    const stack = new Stack();
    const buckets = new ForEachResource(stack, 'Buckets', {
      loopName: 'Env',
      collection: ['dev', 'prod'],
      resourceType: 'AWS::S3::Bucket',
      logicalIdTemplate: 'Bucket${Env}',
      properties: {},
    });

    expect(stack.resolve(buckets.refFor('prod'))).toEqual({ Ref: 'Bucketprod' });
  });

  test('getAtt() returns templated attribute', () => {
    const stack = new Stack();
    const buckets = new ForEachResource(stack, 'Buckets', {
      loopName: 'Env',
      collection: ['dev'],
      resourceType: 'AWS::S3::Bucket',
      logicalIdTemplate: 'Bucket${Env}',
      properties: {},
    });

    expect(stack.resolve(buckets.getAtt('Arn'))).toEqual({ 'Fn::GetAtt': ['Bucket${Env}', 'Arn'] });
  });

  test('validates loop name is alphanumeric', () => {
    const stack = new Stack();
    expect(() => new ForEachResource(stack, 'Buckets', {
      loopName: 'invalid-name',
      collection: ['dev'],
      resourceType: 'AWS::S3::Bucket',
      logicalIdTemplate: 'Bucket${invalid-name}',
      properties: {},
    })).toThrow(/alphanumeric/);
  });
});

describe('ForEachOutput', () => {
  test('generates correct ForEach structure in Outputs', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new ForEachOutput(stack, 'BucketArns', {
      loopName: 'Env',
      collection: ['dev', 'prod'],
      outputKeyTemplate: 'BucketArn${Env}',
      value: 'arn:aws:s3:::bucket-${Env}',
    });

    const template = app.synth().getStackByName('TestStack').template;
    expect(template.Outputs['Fn::ForEach::Env']).toBeDefined();
    expect(template.Outputs['Fn::ForEach::Env'][0]).toEqual(['dev', 'prod']);
    expect(template.Outputs['Fn::ForEach::Env'][1]['BucketArn${Env}'].Value).toBe('arn:aws:s3:::bucket-${Env}');
  });

  test('includes description and export when provided', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new ForEachOutput(stack, 'BucketArns', {
      loopName: 'Env',
      collection: ['dev'],
      outputKeyTemplate: 'BucketArn${Env}',
      value: 'arn:aws:s3:::bucket-${Env}',
      description: 'Bucket ARN',
      exportNameTemplate: 'bucket-arn-${Env}',
    });

    const template = app.synth().getStackByName('TestStack').template;
    const outputDef = template.Outputs['Fn::ForEach::Env'][1]['BucketArn${Env}'];
    expect(outputDef.Description).toBe('Bucket ARN');
    expect(outputDef.Export.Name).toBe('bucket-arn-${Env}');
  });
});

describe('ForEachCondition', () => {
  test('generates correct ForEach structure in Conditions', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new ForEachCondition(stack, 'EnvConditions', {
      loopName: 'Env',
      collection: ['dev', 'prod'],
      conditionKeyTemplate: 'Is${Env}',
      expression: Fn.conditionEquals(Fn.ref('Environment'), Fn.forEachRef('Env')),
    });

    const template = app.synth().getStackByName('TestStack').template;
    expect(template.Conditions['Fn::ForEach::Env']).toBeDefined();
    expect(template.Conditions['Fn::ForEach::Env'][0]).toEqual(['dev', 'prod']);
  });
});
