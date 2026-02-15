import { App, CfnParameter, Fn, Stack } from '../lib';
import { ForEachCondition } from '../lib/foreach-condition';
import { ForEachOutput } from '../lib/foreach-output';
import { ForEachResource } from '../lib/foreach-resource';

describe('Fn.forEach', () => {
  test('synthesizes correct structure', () => {
    const stack = new Stack();
    const result = Fn.forEach(
      'Item',
      ['a', 'b'],
      'Key${Item}',
      { Value: '${Item}' },
    );

    expect(stack.resolve(result)).toEqual({
      'Fn::ForEach::Item': [
        ['a', 'b'],
        { 'Key${Item}': { Value: '${Item}' } },
      ],
    });
  });

  test('works with parameter reference', () => {
    const stack = new Stack();
    const param = new CfnParameter(stack, 'Items', { type: 'CommaDelimitedList' });
    const result = Fn.forEach(
      'Item',
      param.valueAsList,
      'Key${Item}',
      { Value: '${Item}' },
    );

    const resolved = stack.resolve(result);
    expect(resolved['Fn::ForEach::Item'][0]).toEqual({ Ref: 'Items' });
  });
});

describe('Fn.forEachRef', () => {
  test('returns correct reference format', () => {
    const stack = new Stack();
    const result = Fn.forEachRef('Item');
    expect(stack.resolve(result)).toBe('${Item}');
  });
});

describe('ForEachResource', () => {
  test('synthesizes Fn::ForEach in Resources', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new ForEachResource(stack, 'Buckets', {
      loopName: 'Env',
      collection: ['dev', 'prod'],
      resourceType: 'AWS::S3::Bucket',
      logicalIdTemplate: 'Bucket${Env}',
      properties: {
        BucketName: Fn.sub('my-bucket-${Env}'),
      },
    });

    const template = app.synth().getStackByName('TestStack').template;

    expect(template.Transform).toContain('AWS::LanguageExtensions');
    expect(template.Resources['Fn::ForEach::Env']).toEqual([
      ['dev', 'prod'],
      {
        'Bucket${Env}': {
          Type: 'AWS::S3::Bucket',
          Properties: {
            BucketName: { 'Fn::Sub': 'my-bucket-${Env}' },
          },
        },
      },
    ]);
  });

  test('throws on invalid loop name', () => {
    const stack = new Stack();
    expect(() => {
      new ForEachResource(stack, 'Bad', {
        loopName: 'invalid-name',
        collection: ['a'],
        resourceType: 'AWS::S3::Bucket',
        logicalIdTemplate: 'Bucket${invalid-name}',
      });
    }).toThrow(/forEach loop name must be alphanumeric/);
  });

  test('ref() returns templated reference', () => {
    const stack = new Stack();
    const forEach = new ForEachResource(stack, 'Buckets', {
      loopName: 'Env',
      collection: ['dev', 'prod'],
      resourceType: 'AWS::S3::Bucket',
      logicalIdTemplate: 'Bucket${Env}',
    });

    expect(stack.resolve(forEach.ref())).toEqual({ Ref: 'Bucket${Env}' });
  });

  test('getAtt() returns templated attribute', () => {
    const stack = new Stack();
    const forEach = new ForEachResource(stack, 'Buckets', {
      loopName: 'Env',
      collection: ['dev', 'prod'],
      resourceType: 'AWS::S3::Bucket',
      logicalIdTemplate: 'Bucket${Env}',
    });

    expect(stack.resolve(forEach.getAtt('Arn'))).toEqual({
      'Fn::GetAtt': ['Bucket${Env}', 'Arn'],
    });
  });

  test('refFor() returns specific resource reference', () => {
    const stack = new Stack();
    const forEach = new ForEachResource(stack, 'Buckets', {
      loopName: 'Env',
      collection: ['dev', 'prod'],
      resourceType: 'AWS::S3::Bucket',
      logicalIdTemplate: 'Bucket${Env}',
    });

    expect(stack.resolve(forEach.refFor('dev'))).toEqual({ Ref: 'Bucketdev' });
  });

  test('isForEachResource returns true for ForEachResource', () => {
    const stack = new Stack();
    const forEach = new ForEachResource(stack, 'Buckets', {
      loopName: 'Env',
      collection: ['dev'],
      resourceType: 'AWS::S3::Bucket',
      logicalIdTemplate: 'Bucket${Env}',
    });

    expect(ForEachResource.isForEachResource(forEach)).toBe(true);
    expect(ForEachResource.isForEachResource({})).toBe(false);
    expect(ForEachResource.isForEachResource(null)).toBe(false);
  });

  test('works with parameter reference', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const param = new CfnParameter(stack, 'Envs', { type: 'CommaDelimitedList' });

    new ForEachResource(stack, 'Buckets', {
      loopName: 'Env',
      collection: param.valueAsList,
      resourceType: 'AWS::S3::Bucket',
      logicalIdTemplate: 'Bucket${Env}',
    });

    const template = app.synth().getStackByName('TestStack').template;
    expect(template.Resources['Fn::ForEach::Env'][0]).toEqual({ Ref: 'Envs' });
  });
});

describe('ForEachOutput', () => {
  test('synthesizes Fn::ForEach in Outputs', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new ForEachOutput(stack, 'BucketArns', {
      loopName: 'Env',
      collection: ['dev', 'prod'],
      outputKeyTemplate: 'BucketArn${Env}',
      value: Fn.sub('arn:aws:s3:::bucket-${Env}'),
    });

    const template = app.synth().getStackByName('TestStack').template;

    expect(template.Outputs['Fn::ForEach::Env']).toEqual([
      ['dev', 'prod'],
      {
        'BucketArn${Env}': {
          Value: { 'Fn::Sub': 'arn:aws:s3:::bucket-${Env}' },
        },
      },
    ]);
  });

  test('includes description and export', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new ForEachOutput(stack, 'BucketArns', {
      loopName: 'Env',
      collection: ['dev', 'prod'],
      outputKeyTemplate: 'BucketArn${Env}',
      value: 'value',
      description: 'Bucket ARN',
      exportNameTemplate: 'Export${Env}',
    });

    const template = app.synth().getStackByName('TestStack').template;
    const outputDef = template.Outputs['Fn::ForEach::Env'][1]['BucketArn${Env}'];

    expect(outputDef.Description).toBe('Bucket ARN');
    expect(outputDef.Export).toEqual({ Name: 'Export${Env}' });
  });

  test('isForEachOutput returns true for ForEachOutput', () => {
    const stack = new Stack();
    const forEach = new ForEachOutput(stack, 'Outputs', {
      loopName: 'Env',
      collection: ['dev'],
      outputKeyTemplate: 'Out${Env}',
      value: 'val',
    });

    expect(ForEachOutput.isForEachOutput(forEach)).toBe(true);
    expect(ForEachOutput.isForEachOutput({})).toBe(false);
  });
});

describe('ForEachCondition', () => {
  test('synthesizes Fn::ForEach in Conditions', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new ForEachCondition(stack, 'EnvConditions', {
      loopName: 'Env',
      collection: ['dev', 'prod'],
      conditionKeyTemplate: 'Is${Env}',
      expression: Fn.conditionEquals('a', 'b'),
    });

    const template = app.synth().getStackByName('TestStack').template;

    expect(template.Conditions['Fn::ForEach::Env']).toEqual([
      ['dev', 'prod'],
      {
        'Is${Env}': { 'Fn::Equals': ['a', 'b'] },
      },
    ]);
  });

  test('isForEachCondition returns true for ForEachCondition', () => {
    const stack = new Stack();
    const forEach = new ForEachCondition(stack, 'Conds', {
      loopName: 'Env',
      collection: ['dev'],
      conditionKeyTemplate: 'Is${Env}',
      expression: Fn.conditionEquals('a', 'b'),
    });

    expect(ForEachCondition.isForEachCondition(forEach)).toBe(true);
    expect(ForEachCondition.isForEachCondition({})).toBe(false);
  });
});
