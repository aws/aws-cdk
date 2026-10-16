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

  test('SearchExpression stores visible property and includes it in toMetricConfig', () => {
    const withVisibleFalse = new SearchExpression({
      expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
      visible: false,
    });

    expect(withVisibleFalse.visible).toBe(false);
    expect(withVisibleFalse.toMetricConfig().renderingProperties!.visible).toBe(false);

    const withVisibleTrue = new SearchExpression({
      expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
      visible: true,
    });

    expect(withVisibleTrue.visible).toBe(true);
    expect(withVisibleTrue.toMetricConfig().renderingProperties!.visible).toBe(true);
  });

  test('SearchExpression visible defaults to undefined when not set (backwards compat)', () => {
    expect(searchExpr.visible).toBeUndefined();
    expect(searchExpr.toMetricConfig().renderingProperties!.visible).toBeUndefined();
  });

  test('optimization: "with" the same visible returns the same object', () => {
    const hidden = new SearchExpression({
      expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
      visible: false,
    });

    // Note: object equality, NOT deep equality on purpose
    expect(hidden.with({})).toBe(hidden);
    expect(hidden.with({ visible: false })).toBe(hidden);

    // A different visible value produces a new object
    expect(hidden.with({ visible: true })).not.toBe(hidden);
    expect(hidden.with({ visible: true }).visible).toBe(true);
  });

  test('optimization: "with" visible on an expression without one produces a new object', () => {
    expect(searchExpr.with({})).toBe(searchExpr);
    expect(searchExpr.with({ visible: false })).not.toBe(searchExpr);
    expect(searchExpr.with({ visible: false }).visible).toBe(false);
  });

  test('visible is passed through to the graph JSON', () => {
    // GIVEN
    stack = new Stack();
    const graph = new GraphWidget({
      left: [searchExpr.with({ visible: false })],
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
            visible: false,
          }],
        ],
        yAxis: {},
      },
    }]);
  });

  test('a hidden expression without a label does not get an auto-generated label', () => {
    // GIVEN
    stack = new Stack();
    const graph = new GraphWidget({
      left: [
        new SearchExpression({
          expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
          visible: false,
        }),
      ],
    });

    // THEN
    // Matching the rendering behavior for hidden metrics and math expressions,
    // the fallback label (the expression itself) is only rendered for visible entries.
    expect(stack.resolve(graph.toJson())).toEqual([{
      type: 'metric',
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        region: { Ref: 'AWS::Region' },
        metrics: [
          [{
            expression: "SEARCH('{AWS/EC2,InstanceId} CPUUtilization', 'Average', 300)",
            visible: false,
          }],
        ],
        yAxis: {},
      },
    }]);
  });
});
