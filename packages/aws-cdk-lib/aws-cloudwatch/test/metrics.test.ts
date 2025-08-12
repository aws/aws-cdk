import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import { Alarm, Metric, Stats } from '../lib';
import { PairStatistic, parseStatistic, SingleStatistic } from '../lib/private/statistic';

describe('Metrics', () => {
  test('metric grant', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'SomeRole', {
      assumedBy: new iam.AnyPrincipal(),
    });

    // WHEN
    Metric.grantPutMetricData(role);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'cloudwatch:PutMetricData',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    });
  });

  test('can not use invalid period in Metric', () => {
    expect(() => {
      new Metric({ namespace: 'Test', metricName: 'ACount', period: cdk.Duration.seconds(20) });
    }).toThrow(/'period' must be 1, 5, 10, 30, or a multiple of 60 seconds, received 20/);
  });

  test('Metric optimization: "with" with the same period returns the same object', () => {
    const m = new Metric({ namespace: 'Test', metricName: 'Metric', period: cdk.Duration.minutes(10) });

    // Note: object equality, NOT deep equality on purpose
    expect(m.with({})).toEqual(m);
    expect(m.with({ period: cdk.Duration.minutes(10) })).toEqual(m);

    expect(m.with({ period: cdk.Duration.minutes(5) })).not.toEqual(m);
  });

  testDeprecated('cannot use null dimension value', () => {
    expect(() => {
      new Metric({
        namespace: 'Test',
        metricName: 'ACount',
        period: cdk.Duration.minutes(10),
        dimensions: {
          DimensionWithNull: null,
        },
      });
    }).toThrow(/Dimension value of 'null' is invalid/);
  });

  testDeprecated('cannot use undefined dimension value', () => {
    expect(() => {
      new Metric({
        namespace: 'Test',
        metricName: 'ACount',
        period: cdk.Duration.minutes(10),
        dimensions: {
          DimensionWithUndefined: undefined,
        },
      });
    }).toThrow(/Dimension value of 'undefined' is invalid/);
  });

  testDeprecated('cannot use long dimension values', () => {
    const arr = new Array(256);
    const invalidDimensionValue = arr.fill('A', 0).join('');

    expect(() => {
      new Metric({
        namespace: 'Test',
        metricName: 'ACount',
        period: cdk.Duration.minutes(10),
        dimensions: {
          DimensionWithLongValue: invalidDimensionValue,
        },
      });
    }).toThrow(`Dimension value must be at least 1 and no more than 255 characters; received ${invalidDimensionValue}`);
  });

  test('cannot use long dimension values in dimensionsMap', () => {
    const arr = new Array(256);
    const invalidDimensionValue = arr.fill('A', 0).join('');

    expect(() => {
      new Metric({
        namespace: 'Test',
        metricName: 'ACount',
        period: cdk.Duration.minutes(10),
        dimensionsMap: {
          DimensionWithLongValue: invalidDimensionValue,
        },
      });
    }).toThrow(`Dimension value must be at least 1 and no more than 255 characters; received ${invalidDimensionValue}`);
  });

  testDeprecated('throws error when there are more than 30 dimensions', () => {
    expect(() => {
      new Metric({
        namespace: 'Test',
        metricName: 'ACount',
        period: cdk.Duration.minutes(10),
        dimensions: {
          dimensionA: 'value1',
          dimensionB: 'value2',
          dimensionC: 'value3',
          dimensionD: 'value4',
          dimensionE: 'value5',
          dimensionF: 'value6',
          dimensionG: 'value7',
          dimensionH: 'value8',
          dimensionI: 'value9',
          dimensionJ: 'value10',
          dimensionK: 'value11',
          dimensionL: 'value12',
          dimensionM: 'value13',
          dimensionN: 'value14',
          dimensionO: 'value15',
          dimensionP: 'value16',
          dimensionQ: 'value17',
          dimensionR: 'value18',
          dimensionS: 'value19',
          dimensionT: 'value20',
          dimensionU: 'value21',
          dimensionV: 'value22',
          dimensionW: 'value23',
          dimensionX: 'value24',
          dimensionY: 'value25',
          dimensionZ: 'value26',
          dimensionAA: 'value27',
          dimensionAB: 'value28',
          dimensionAC: 'value29',
          dimensionAD: 'value30',
          dimensionAE: 'value31',
        },
      } );
    }).toThrow(/The maximum number of dimensions is 30, received 31/);
  });

  test('throws error when there are more than 30 dimensions in dimensionsMap', () => {
    expect(() => {
      new Metric({
        namespace: 'Test',
        metricName: 'ACount',
        period: cdk.Duration.minutes(10),
        dimensionsMap: {
          dimensionA: 'value1',
          dimensionB: 'value2',
          dimensionC: 'value3',
          dimensionD: 'value4',
          dimensionE: 'value5',
          dimensionF: 'value6',
          dimensionG: 'value7',
          dimensionH: 'value8',
          dimensionI: 'value9',
          dimensionJ: 'value10',
          dimensionK: 'value11',
          dimensionL: 'value12',
          dimensionM: 'value13',
          dimensionN: 'value14',
          dimensionO: 'value15',
          dimensionP: 'value16',
          dimensionQ: 'value17',
          dimensionR: 'value18',
          dimensionS: 'value19',
          dimensionT: 'value20',
          dimensionU: 'value21',
          dimensionV: 'value22',
          dimensionW: 'value23',
          dimensionX: 'value24',
          dimensionY: 'value25',
          dimensionZ: 'value26',
          dimensionAA: 'value27',
          dimensionAB: 'value28',
          dimensionAC: 'value29',
          dimensionAD: 'value30',
          dimensionAE: 'value31',
        },
      } );
    }).toThrow(/The maximum number of dimensions is 30, received 31/);
  });

  test('can create metric with dimensionsMap property', () => {
    const stack = new cdk.Stack();
    const metric = new Metric({
      namespace: 'Test',
      metricName: 'Metric',
      dimensionsMap: {
        dimensionA: 'value1',
        dimensionB: 'value2',
      },
    });

    new Alarm(stack, 'Alarm', {
      metric: metric,
      threshold: 10,
      evaluationPeriods: 1,
    });

    expect(metric.dimensions).toEqual({
      dimensionA: 'value1',
      dimensionB: 'value2',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Namespace: 'Test',
      MetricName: 'Metric',
      Dimensions: [
        {
          Name: 'dimensionA',
          Value: 'value1',
        },
        {
          Name: 'dimensionB',
          Value: 'value2',
        },
      ],
      Threshold: 10,
      EvaluationPeriods: 1,
    });
  });

  test('"with" with a different dimensions property', () => {
    const dims = {
      dimensionA: 'value1',
    };

    const metric = new Metric({
      namespace: 'Test',
      metricName: 'Metric',
      period: cdk.Duration.minutes(10),
      dimensionsMap: dims,
    });

    const newDims = {
      dimensionB: 'value2',
    };

    expect(metric.with({
      dimensionsMap: newDims,
    }).dimensions).toEqual(newDims);
  });

  test('metric accepts a variety of statistics', () => {
    const customStat = 'myCustomStatistic';
    const metric = new Metric({
      namespace: 'Test',
      metricName: 'Metric',
      statistic: customStat,
    });

    expect(metric.statistic).toEqual(customStat);
  });

  test('region and account getters are enumerable', () => {
    const metric = new Metric({
      namespace: 'Test',
      metricName: 'Metric',
      period: cdk.Duration.minutes(10),
      region: 'test-region',
      account: 'test-account',
    });

    expect(metric.region).toBe('test-region');
    expect(metric.account).toBe('test-account');

    const metricObject = { ...metric };
    expect(metricObject).toEqual(expect.objectContaining({
      region: 'test-region',
      account: 'test-account',
    }));

    // Check that private fields are not included.
    // @ts-expect-error
    expect(metricObject.accountOverride).toBeUndefined();
    // @ts-expect-error
    expect(metricObject.stackAccount).toBeUndefined();
    // @ts-expect-error
    expect(metricObject.regionOverride).toBeUndefined();
    // @ts-expect-error
    expect(metricObject.stackRegion).toBeUndefined();
  });

  test('statistic is properly parsed', () => {
    const checkParsingSingle = (statistic: string, statPrefix: string, statName: string, value: number) => {
      const parsed = parseStatistic(statistic);
      expect(parsed.type).toEqual('single');
      expect((parsed as SingleStatistic).value).toEqual(value);
      expect((parsed as SingleStatistic).statPrefix).toEqual(statPrefix);
      expect((parsed as SingleStatistic).statName).toEqual(statName);
    };

    const checkParsingPair = (
      statistic: string,
      statPrefix: string,
      statName: string,
      isPercent: boolean,
      canBeSingleStat: boolean,
      asSingleStatStr?: string,
      lower?: number,
      upper?: number,
    ) => {
      const parsed = parseStatistic(statistic);
      expect(parsed.type).toEqual('pair');
      expect((parsed as PairStatistic).isPercent).toEqual(isPercent);
      expect((parsed as PairStatistic).lower).toEqual(lower);
      expect((parsed as PairStatistic).upper).toEqual(upper);
      expect((parsed as PairStatistic).canBeSingleStat).toEqual(canBeSingleStat);
      expect((parsed as PairStatistic).asSingleStatStr).toEqual(asSingleStatStr);
      expect((parsed as PairStatistic).statPrefix).toEqual(statPrefix);
      expect((parsed as PairStatistic).statName).toEqual(statName);
    };

    expect(parseStatistic(Stats.SAMPLE_COUNT).type).toEqual('simple');
    expect(parseStatistic(Stats.AVERAGE).type).toEqual('simple');
    expect(parseStatistic(Stats.SUM).type).toEqual('simple');
    expect(parseStatistic(Stats.MINIMUM).type).toEqual('simple');
    expect(parseStatistic(Stats.MAXIMUM).type).toEqual('simple');
    expect(parseStatistic(Stats.IQM).type).toEqual('simple');

    /* eslint-disable no-multi-spaces */

    // Check single statistics
    checkParsingSingle('p9',     'p',  'percentile',     9);
    checkParsingSingle('p99',    'p',  'percentile',     99);
    checkParsingSingle('P99',    'p',  'percentile',     99);
    checkParsingSingle('p99.99', 'p',  'percentile',     99.99);
    checkParsingSingle('p100',   'p',  'percentile',     100);
    checkParsingSingle('tm99',   'tm', 'trimmedMean',    99);
    checkParsingSingle('wm99',   'wm', 'winsorizedMean', 99);
    checkParsingSingle('tc99',   'tc', 'trimmedCount',   99);
    checkParsingSingle('ts99',   'ts', 'trimmedSum',     99);

    // Check all pair statistics
    checkParsingPair('TM(10%:90%)',       'TM', 'trimmedMean',    true, false, undefined, 10,        90);
    checkParsingPair('TM(10.99%:90.99%)', 'TM', 'trimmedMean',    true, false, undefined, 10.99,     90.99);
    checkParsingPair('WM(10%:90%)',       'WM', 'winsorizedMean', true, false, undefined, 10,        90);
    checkParsingPair('TC(10%:90%)',       'TC', 'trimmedCount',   true, false, undefined, 10,        90);
    checkParsingPair('TS(10%:90%)',       'TS', 'trimmedSum',     true, false, undefined, 10,        90);

    // Check can be represented as a single statistic
    checkParsingPair('TM(:90%)',          'TM', 'trimmedMean',    true, true,  'tm90',    undefined, 90);

    // Check every case
    checkParsingPair('tm(10%:90%)',         'TM', 'trimmedMean', true,  false, undefined,       10,          90);
    checkParsingPair('TM(10%:90%)',         'TM', 'trimmedMean', true,  false, undefined,       10,          90);
    checkParsingPair('TM(:90%)',            'TM', 'trimmedMean', true,  true,  'tm90',          undefined,   90);
    checkParsingPair('TM(10%:)',            'TM', 'trimmedMean', true,  false, undefined,       10,          undefined);
    checkParsingPair('TM(10:1500)',         'TM', 'trimmedMean', false, false, undefined,       10,          1500);
    checkParsingPair('TM(10:)',             'TM', 'trimmedMean', false, false, undefined,       10,          undefined);
    checkParsingPair('TM(:5000)',           'TM', 'trimmedMean', false, false, undefined,       undefined,   5000);
    checkParsingPair('TM(0.123456789:)',    'TM', 'trimmedMean', false, false, undefined,       0.123456789, undefined);
    checkParsingPair('TM(0.123456789:)',    'TM', 'trimmedMean', false, false, undefined,       0.123456789, undefined);
    checkParsingPair('TM(:0.123456789)',    'TM', 'trimmedMean', false, false, undefined,       undefined,   0.123456789);
    checkParsingPair('TM(0.123456789%:)',   'TM', 'trimmedMean', true,  false, undefined,       0.123456789, undefined);
    checkParsingPair('TM(:0.123456789%)',   'TM', 'trimmedMean', true,  true,  'tm0.123456789', undefined,   0.123456789);
    checkParsingPair('TM(0.123:0.4543)',    'TM', 'trimmedMean', false, false, undefined,       0.123,       0.4543);
    checkParsingPair('TM(0.123%:0.4543%)',  'TM', 'trimmedMean', true,  false, undefined,       0.123,       0.4543);
    checkParsingPair('TM(0.1000%:0.1000%)', 'TM', 'trimmedMean', true,  false, undefined,       0.1,         0.1);
    checkParsingPair('TM(0.9999:100.9999)', 'TM', 'trimmedMean', false, false, undefined,       0.9999,      100.9999);

    /* eslint-enable no-multi-spaces */

    // Check invalid statistics
    expect(parseStatistic('p99.99.99').type).toEqual('generic');
    expect(parseStatistic('p200').type).toEqual('generic');
    expect(parseStatistic('pa99').type).toEqual('generic');
    expect(parseStatistic('99').type).toEqual('generic');
    expect(parseStatistic('tm1.').type).toEqual('generic');
    expect(parseStatistic('tm12.').type).toEqual('generic');
    expect(parseStatistic('tm123').type).toEqual('generic');
    expect(parseStatistic('tm123.123456789').type).toEqual('generic');
    expect(parseStatistic('tm.123456789').type).toEqual('generic');
    expect(parseStatistic('TM(10:90%)').type).toEqual('generic');
    expect(parseStatistic('TM(10%:1500)').type).toEqual('generic');
    expect(parseStatistic('TM(10)').type).toEqual('generic');
    expect(parseStatistic('TM()').type).toEqual('generic');
    expect(parseStatistic('TM(0.:)').type).toEqual('pair');
    expect(parseStatistic('TM(:0.)').type).toEqual('pair');
    expect(parseStatistic('()').type).toEqual('generic');
    expect(parseStatistic('(:)').type).toEqual('generic');
    expect(parseStatistic('TM(:)').type).toEqual('generic');
    expect(parseStatistic('TM(').type).toEqual('generic');
    expect(parseStatistic('TM)').type).toEqual('generic');
    expect(parseStatistic('TM(0.123456789%:%)').type).toEqual('generic');
    expect(parseStatistic('TM(0.123:0.4543%)').type).toEqual('generic');
    expect(parseStatistic('TM(0.123%:0.4543)').type).toEqual('generic');
    expect(parseStatistic('TM(1000%:)').type).toEqual('generic');
    expect(parseStatistic('TM(:1000%)').type).toEqual('generic');
    expect(parseStatistic('TM(1000%:1000%)').type).toEqual('generic');
  });

  test('metric stores id and visible properties correctly', () => {
    const metricWithBothProps = new Metric({
      namespace: 'Test',
      metricName: 'TestMetric',
      id: 'custom_metric_id',
      visible: false,
    });

    expect(metricWithBothProps.id).toBe('custom_metric_id');
    expect(metricWithBothProps.visible).toBe(false);

    const metricWithId = new Metric({
      namespace: 'Test',
      metricName: 'TestMetric',
      id: 'another_id',
    });

    expect(metricWithId.id).toBe('another_id');
    expect(metricWithId.visible).toBeUndefined();

    const metricWithVisible = new Metric({
      namespace: 'Test',
      metricName: 'TestMetric',
      visible: true,
    });

    expect(metricWithVisible.id).toBeUndefined();
    expect(metricWithVisible.visible).toBe(true);

    const metricWithDefaults = new Metric({
      namespace: 'Test',
      metricName: 'TestMetric',
    });

    expect(metricWithDefaults.id).toBeUndefined();
    expect(metricWithDefaults.visible).toBeUndefined();
  });

  test('id and visible properties are included in toMetricConfig', () => {
    const metricWithBothProps = new Metric({
      namespace: 'Test',
      metricName: 'TestMetric',
      id: 'custom_metric_id',
      visible: false,
    });

    const configWithBoth = metricWithBothProps.toMetricConfig();
    expect(configWithBoth.renderingProperties).toBeDefined();
    expect(configWithBoth.renderingProperties!.id).toBe('custom_metric_id');
    expect(configWithBoth.renderingProperties!.visible).toBe(false);

    const metricWithId = new Metric({
      namespace: 'Test',
      metricName: 'TestMetric',
      id: 'another_id',
    });

    const configWithId = metricWithId.toMetricConfig();
    expect(configWithId.renderingProperties).toBeDefined();
    expect(configWithId.renderingProperties!.id).toBe('another_id');
    expect(configWithId.renderingProperties!.visible).toBeUndefined();

    const metricWithVisible = new Metric({
      namespace: 'Test',
      metricName: 'TestMetric',
      visible: true,
    });

    const configWithVisible = metricWithVisible.toMetricConfig();
    expect(configWithVisible.renderingProperties).toBeDefined();
    expect(configWithVisible.renderingProperties!.id).toBeUndefined();
    expect(configWithVisible.renderingProperties!.visible).toBe(true);
  });

  test('"with" with id and visible properties', () => {
    const originalMetric = new Metric({
      namespace: 'Test',
      metricName: 'TestMetric',
      id: 'original_id',
      visible: true,
    });

    const modifiedMetric = originalMetric.with({
      id: 'new_id',
      visible: false,
    });

    expect(modifiedMetric.id).toBe('new_id');
    expect(modifiedMetric.visible).toBe(false);
    expect(modifiedMetric).not.toEqual(originalMetric);

    const metricWithModifiedId = originalMetric.with({
      id: 'another_id',
    });

    expect(metricWithModifiedId.id).toBe('another_id');
    expect(metricWithModifiedId.visible).toBe(true);
    expect(metricWithModifiedId).not.toEqual(originalMetric);

    const metricWithModifiedVisible = originalMetric.with({
      visible: false,
    });

    expect(metricWithModifiedVisible.id).toBe('original_id');
    expect(metricWithModifiedVisible.visible).toBe(false);
    expect(metricWithModifiedVisible).not.toEqual(originalMetric);

    const copyMetric = originalMetric.with({
      id: 'original_id',
      visible: true,
    });

    expect(copyMetric).toEqual(originalMetric);
  });
});
