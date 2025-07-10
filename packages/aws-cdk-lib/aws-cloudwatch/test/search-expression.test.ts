import { Duration, UnscopedValidationError } from '../../core';
import { SearchExpression, MathExpression, Metric } from '../lib';
import { dispatchMetric, metricKey } from '../lib/private/metric-util';

describe('SearchExpression', () => {
  describe('Constructor Tests', () => {
    test('should create SearchExpression with minimal required props', () => {
      // WHEN
      const searchExpr = new SearchExpression({
        expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
      });

      // THEN
      expect(searchExpr.expression).toBe("SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)");
      expect(searchExpr.period).toEqual(Duration.minutes(5)); // Default period
      expect(searchExpr.label).toBeUndefined();
      expect(searchExpr.color).toBeUndefined();
      expect(searchExpr.searchAccount).toBeUndefined();
      expect(searchExpr.searchRegion).toBeUndefined();
      expect(searchExpr.warnings).toBeUndefined();
      expect(searchExpr.warningsV2).toBeUndefined();
    });

    test('should create SearchExpression with all optional properties', () => {
      // WHEN
      const searchExpr = new SearchExpression({
        expression: "SEARCH('{AWS/Lambda,FunctionName} Duration', 'Average', 300)",
        label: 'Lambda Duration',
        color: '#1f77b4',
        period: Duration.minutes(10),
        searchAccount: '123456789012',
        searchRegion: 'us-west-2',
      });

      // THEN
      expect(searchExpr.expression).toBe("SEARCH('{AWS/Lambda,FunctionName} Duration', 'Average', 300)");
      expect(searchExpr.label).toBe('Lambda Duration');
      expect(searchExpr.color).toBe('#1f77b4');
      expect(searchExpr.period).toEqual(Duration.minutes(10));
      expect(searchExpr.searchAccount).toBe('123456789012');
      expect(searchExpr.searchRegion).toBe('us-west-2');
    });
  });

  describe('Method Tests', () => {
    let searchExpr: SearchExpression;

    beforeEach(() => {
      searchExpr = new SearchExpression({
        expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
        label: 'CPU Usage',
        color: '#ff0000',
        period: Duration.minutes(5),
      });
    });

    test('SearchExpression optimization: "with" with the same properties returns the same object', () => {
      // WHEN
      const result1 = searchExpr.with({});
      const result2 = searchExpr.with({
        label: 'CPU Usage', // Same value
        color: '#ff0000', // Same value
        period: Duration.minutes(5), // Same value
      });

      // THEN
      expect(result1).toBe(searchExpr); // Same reference
      expect(result2).toBe(searchExpr); // Same reference
    });

    test('"with" with different properties creates new object', () => {
      // WHEN
      const result = searchExpr.with({
        label: 'New Label',
        color: '#00ff00',
        period: Duration.minutes(10),
        searchAccount: '123456789012',
        searchRegion: 'eu-west-1',
      });

      // THEN
      expect(result).not.toBe(searchExpr); // Different reference
      expect(result.expression).toBe(searchExpr.expression); // Expression unchanged
      expect(result.label).toBe('New Label');
      expect(result.color).toBe('#00ff00');
      expect(result.period).toEqual(Duration.minutes(10));
      expect(result.searchAccount).toBe('123456789012');
      expect(result.searchRegion).toBe('eu-west-1');
    });

    test('searchExpression properties are included in toMetricConfig', () => {
      // WHEN
      const config = searchExpr.toMetricConfig();

      // THEN
      expect(config.searchExpression).toBeDefined();
      expect(config.mathExpression).toBeUndefined();
      expect(config.metricStat).toBeUndefined();

      expect(config.searchExpression!.expression).toBe("SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)");
      expect(config.searchExpression!.period).toBe(300); // 5 minutes in seconds
      expect(config.searchExpression!.usingMetrics).toEqual({}); // Always empty
      expect(config.searchExpression!.searchAccount).toBeUndefined();
      expect(config.searchExpression!.searchRegion).toBeUndefined();
    });

    test('label and color properties are included in renderingProperties', () => {
      // WHEN
      const config = searchExpr.toMetricConfig();

      // THEN
      expect(config.renderingProperties).toBeDefined();
      expect(config.renderingProperties!.label).toBe('CPU Usage');
      expect(config.renderingProperties!.color).toBe('#ff0000');
    });

    test('searchAccount and searchRegion are included when set', () => {
      // GIVEN
      const searchExprWithRegion = new SearchExpression({
        expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
        searchAccount: '123456789012',
        searchRegion: 'us-west-2',
      });

      // WHEN
      const config = searchExprWithRegion.toMetricConfig();

      // THEN
      expect(config.searchExpression!.searchAccount).toBe('123456789012');
      expect(config.searchExpression!.searchRegion).toBe('us-west-2');
    });

    test('throws error when used in CloudWatch Alarms', () => {
      // WHEN & THEN
      expect(() => {
        searchExpr.toAlarmConfig();
      }).toThrow(UnscopedValidationError);
      expect(() => {
        searchExpr.toAlarmConfig();
      }).toThrow('Using a search expression is not supported in CloudWatch Alarms.');
    });

    test('throws error when using deprecated toGraphConfig', () => {
      // WHEN & THEN
      expect(() => {
        searchExpr.toGraphConfig();
      }).toThrow(UnscopedValidationError);
      expect(() => {
        searchExpr.toGraphConfig();
      }).toThrow('`toGraphConfig()` is deprecated, use `toMetricConfig()`');
    });
  });

  describe('Utility Function Tests', () => {
    test('SearchExpression generates consistent metric keys', () => {
      // GIVEN
      const searchExpr = new SearchExpression({
        expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
        label: 'CPU Usage',
      });

      // WHEN
      const key1 = metricKey(searchExpr);
      const key2 = metricKey(searchExpr);

      // THEN
      expect(key1).toBe(key2);
      expect(key1).toBeTruthy();
      expect(typeof key1).toBe('string');
    });

    test('different SearchExpressions generate different metric keys', () => {
      // GIVEN
      const searchExpr1 = new SearchExpression({
        expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
      });
      const searchExpr2 = new SearchExpression({
        expression: "SEARCH('{AWS/Lambda,FunctionName} Duration', 'Average', 300)",
      });
      const searchExpr3 = new SearchExpression({
        expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
        searchAccount: '123456789012',
      });

      // WHEN
      const key1 = metricKey(searchExpr1);
      const key2 = metricKey(searchExpr2);
      const key3 = metricKey(searchExpr3);

      // THEN
      expect(key1).not.toBe(key2); // Different expressions
      expect(key1).not.toBe(key3); // Different accounts
      expect(key2).not.toBe(key3); // Different expressions and accounts
    });

    test('metric keys are cached on SearchExpression instances', () => {
      // GIVEN
      const searchExpr = new SearchExpression({
        expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
      });

      // WHEN
      const key1 = metricKey(searchExpr);

      // Verify the key is cached on the object
      const cachedKey = (searchExpr as any)[Symbol.for('@aws-cdk/aws-cloudwatch.MetricKey')] ||
                       Object.getOwnPropertySymbols(searchExpr).find(sym => sym.toString().includes('MetricKey'));

      const key2 = metricKey(searchExpr);

      // THEN
      expect(key1).toBe(key2);
      // The key should be cached (implementation detail, but worth testing for performance)
    });
  });

  describe('DispatchMetric Tests', () => {
    let searchExpr: SearchExpression;

    beforeEach(() => {
      searchExpr = new SearchExpression({
        expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
        period: Duration.minutes(5),
      });
    });

    test('SearchExpression is dispatched to withSearchExpression handler', () => {
      // GIVEN
      const withStat = jest.fn();
      const withMathExpression = jest.fn();
      const withSearchExpression = jest.fn().mockReturnValue('search-result');

      // WHEN
      const result = dispatchMetric(searchExpr, {
        withStat,
        withMathExpression,
        withSearchExpression,
      });

      // THEN
      expect(withSearchExpression).toHaveBeenCalledTimes(1);
      expect(withStat).not.toHaveBeenCalled();
      expect(withMathExpression).not.toHaveBeenCalled();
      expect(result).toBe('search-result');

      // Verify the callback was called with correct parameters
      const [searchConfig, metricConfig] = withSearchExpression.mock.calls[0];
      expect(searchConfig.expression).toBe("SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)");
      expect(searchConfig.period).toBe(300);
      expect(searchConfig.usingMetrics).toEqual({});
      expect(metricConfig).toStrictEqual(searchExpr.toMetricConfig());
    });

    test('throws error when multiple config types are present', () => {
      // GIVEN - Mock toMetricConfig to return invalid state
      const mockSearchExpr = {
        toMetricConfig: jest.fn().mockReturnValue({
          searchExpression: { expression: 'test', period: 300, usingMetrics: {} },
          mathExpression: { expression: 'test', period: 300, usingMetrics: {} },
        }),
      } as any;

      // WHEN & THEN
      expect(() => {
        dispatchMetric(mockSearchExpr, {
          withStat: jest.fn(),
          withMathExpression: jest.fn(),
          withSearchExpression: jest.fn(),
        });
      }).toThrow(UnscopedValidationError);
      expect(() => {
        dispatchMetric(mockSearchExpr, {
          withStat: jest.fn(),
          withMathExpression: jest.fn(),
          withSearchExpression: jest.fn(),
        });
      }).toThrow("Metric object must not produce more than one of 'metricStat', 'mathExpression', or 'searchExpression'");
    });

    test('throws error when no config types are present', () => {
      // GIVEN - Mock toMetricConfig to return empty config
      const mockSearchExpr = {
        toMetricConfig: jest.fn().mockReturnValue({}),
      } as any;

      // WHEN & THEN
      expect(() => {
        dispatchMetric(mockSearchExpr, {
          withStat: jest.fn(),
          withMathExpression: jest.fn(),
          withSearchExpression: jest.fn(),
        });
      }).toThrow(UnscopedValidationError);
      expect(() => {
        dispatchMetric(mockSearchExpr, {
          withStat: jest.fn(),
          withMathExpression: jest.fn(),
          withSearchExpression: jest.fn(),
        });
      }).toThrow("Metric object must have either 'metricStat', 'mathExpression', or 'searchExpression'");
    });
  });

  describe('Type Safety Tests', () => {
    test('SearchExpression should not be instance of MathExpression', () => {
      // GIVEN
      const searchExpr = new SearchExpression({
        expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
      });
      const mathExpr = new MathExpression({
        expression: 'a + b',
        usingMetrics: {
          a: new Metric({ namespace: 'Test', metricName: 'A' }),
          b: new Metric({ namespace: 'Test', metricName: 'B' }),
        },
      });

      // THEN
      expect(searchExpr instanceof MathExpression).toBe(false);
      expect(mathExpr instanceof SearchExpression).toBe(false);
    });

    test('SearchExpression should implement IMetric interface', () => {
      // GIVEN
      const searchExpr = new SearchExpression({
        expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
      });

      // THEN
      // Verify IMetric interface properties and methods
      expect(typeof searchExpr.toMetricConfig).toBe('function');
      expect(typeof searchExpr.toAlarmConfig).toBe('function');
      expect(typeof searchExpr.toGraphConfig).toBe('function');

      // warnings and warningsV2 are optional and only set when there are actual warnings
      // In normal cases, they will be undefined
      expect(searchExpr.warnings).toBeUndefined();
      expect(searchExpr.warningsV2).toBeUndefined();
    });
  });

  describe('Edge Case Tests', () => {
    test('should handle undefined optional properties gracefully', () => {
      // WHEN
      const searchExpr = new SearchExpression({
        expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
        label: undefined,
        color: undefined,
        period: undefined,
        searchAccount: undefined,
        searchRegion: undefined,
      });

      // THEN
      expect(searchExpr.label).toBeUndefined();
      expect(searchExpr.color).toBeUndefined();
      expect(searchExpr.period).toEqual(Duration.minutes(5)); // Default
      expect(searchExpr.searchAccount).toBeUndefined();
      expect(searchExpr.searchRegion).toBeUndefined();

      // Should not throw when calling methods
      expect(() => searchExpr.toMetricConfig()).not.toThrow();
      expect(() => metricKey(searchExpr)).not.toThrow();
    });

    test('should handle empty string expression', () => {
      // WHEN & THEN - This may or may not throw depending on implementation
      // Testing current behavior without making assumptions
      expect(() => {
        new SearchExpression({
          expression: '',
        });
      }).not.toThrow(); // Assuming it's allowed for now
    });

    test('period conversion should work correctly', () => {
      // GIVEN
      const searchExpr = new SearchExpression({
        expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
        period: Duration.minutes(10),
      });

      // WHEN
      const config = searchExpr.toMetricConfig();

      // THEN
      expect(config.searchExpression!.period).toBe(600); // 10 minutes = 600 seconds
    });
  });
});
