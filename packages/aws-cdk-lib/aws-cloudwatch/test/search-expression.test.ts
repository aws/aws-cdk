import { Duration, Stack, UnscopedValidationError } from '../../core';
import { GraphWidget, SearchExpression } from '../lib';
import { dispatchMetric } from '../lib/private/metric-util';

describe('SearchExpression', () => {
  let searchExpr: SearchExpression;
  let stack: Stack;

  beforeEach(() => {
    searchExpr = new SearchExpression({
      expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
      label: 'CPU Usage',
      color: '#ff0000',
      period: Duration.minutes(5),
      searchAccount: '123456789012',
      searchRegion: 'us-west-2',
    });
  });

  test('should create SearchExpression with minimal required props', () => {
    searchExpr = new SearchExpression({
      expression: "SEARCH('{AWS/Lambda, InstanceId} Invocations', 'Average', 300)",
    });

    expect(searchExpr.expression).toBe("SEARCH('{AWS/Lambda, InstanceId} Invocations', 'Average', 300)");
    expect(searchExpr.period).toEqual(Duration.minutes(5));
    expect(searchExpr.label).toBeUndefined();
    expect(searchExpr.color).toBeUndefined();
    expect(searchExpr.searchAccount).toBeUndefined();
    expect(searchExpr.searchRegion).toBeUndefined();
    expect(searchExpr.warnings).toBeUndefined();
    expect(searchExpr.warningsV2).toBeUndefined();
  });

  test('should create SearchExpression with all optional properties', () => {
    expect(searchExpr.expression).toBe("SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)");
    expect(searchExpr.label).toBe('CPU Usage');
    expect(searchExpr.color).toBe('#ff0000');
    expect(searchExpr.period).toEqual(Duration.minutes(5));
    expect(searchExpr.searchAccount).toBe('123456789012');
    expect(searchExpr.searchRegion).toBe('us-west-2');
  });

  test('"with" with the same properties returns the same object', () => {
    // WHEN
    const result1 = searchExpr.with({});
    const result2 = searchExpr.with({
      label: 'CPU Usage',
      color: '#ff0000',
      period: Duration.minutes(5),
    });

    // THEN
    expect(result1).toBe(searchExpr);
    expect(result2).toBe(searchExpr);
  });

  test('"with" with different properties returns a different object', () => {
    // WHEN
    const result = searchExpr.with({
      label: 'New Label',
      color: '#00ff00',
      period: Duration.minutes(10),
      searchAccount: '123456789012',
      searchRegion: 'eu-west-1',
    });

    // THEN
    expect(result).not.toBe(searchExpr);
    expect(result.expression).toBe(searchExpr.expression);
    expect(result.label).toBe('New Label');
    expect(result.color).toBe('#00ff00');
    expect(result.period).toEqual(Duration.minutes(10));
    expect(result.searchAccount).toBe('123456789012');
    expect(result.searchRegion).toBe('eu-west-1');
  });

  test('SearchExpressions can be added to a graph', () => {
    // GIVEN
    stack = new Stack();
    const graph = new GraphWidget({
      left: [searchExpr],
    });

    // THEN
    expect(stack.resolve(graph.toJson())).toEqual([{
      type: 'metric',
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        region: { Ref: 'AWS::Region' },
        metrics: [
          [{
            accountId: '123456789012',
            color: '#ff0000',
            expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
            label: 'CPU Usage',
            region: 'us-west-2',
          }],
        ],
        yAxis: {},
      },
    }]);
  });

  test('searchExpression properties are included in toMetricConfig', () => {
    // WHEN
    const config = searchExpr.toMetricConfig();

    // THEN
    expect(config.searchExpression).toBeDefined();
    expect(config.mathExpression).toBeUndefined();
    expect(config.metricStat).toBeUndefined();

    expect(config.searchExpression!.expression).toBe("SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)");
    expect(config.searchExpression!.period).toBe(300);
    expect(config.searchExpression!.usingMetrics).toEqual({});
    expect(config.renderingProperties).toBeDefined();
    expect(config.renderingProperties!.label).toBe('CPU Usage');
    expect(config.renderingProperties!.color).toBe('#ff0000');
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

  test('throws error when multiple config types are present', () => {
    const mockSearchExpr = {
      toMetricConfig: jest.fn().mockReturnValue({
        searchExpression: { expression: 'test', period: 300 },
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
});
