import { expect, haveResource, SynthUtils } from '@aws-cdk/assert';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as cdk from '@aws-cdk/core';
import * as fc from 'fast-check';
import { Test } from 'nodeunit';
import * as appscaling from '../lib';
import { arbitrary_input_intervals, createScalableTarget } from './util';

export = {
  'alarm thresholds are valid numbers'(test: Test) {
    fc.assert(fc.property(
      arbitrary_input_intervals(),
      (intervals) => {
        const template = setupStepScaling(intervals);

        const lowerThreshold = template.lowerThreshold;
        const upperThreshold = template.upperThreshold;

        return reportFalse(
          (lowerThreshold === undefined || (lowerThreshold > 0 && lowerThreshold !== Infinity))
          && (upperThreshold === undefined || (upperThreshold > 0 && upperThreshold !== Infinity)),
          lowerThreshold,
          upperThreshold);
      }
    ));

    test.done();
  },

  'generated step intervals are valid intervals'(test: Test) {
    fc.assert(fc.property(
      arbitrary_input_intervals(),
      (intervals) => {
        const template = setupStepScaling(intervals);
        const steps = template.allStepsAbsolute();

        return reportFalse(steps.every(step => {
          return step.MetricIntervalLowerBound! < step.MetricIntervalUpperBound!;
        }), steps, 'template', JSON.stringify(template, undefined, 2));
      }
    ));

    test.done();
  },

  'generated step intervals are nonoverlapping'(test: Test) {
    fc.assert(fc.property(
      arbitrary_input_intervals(),
      (intervals) => {
        const template = setupStepScaling(intervals);
        const steps = template.allStepsAbsolute();

        for (let i = 0; i < steps.length; i++) {
          const compareTo = steps.slice(i + 1);
          if (compareTo.some(x => overlaps(steps[i], x))) {
            return reportFalse(false, steps);
          }
        }

        return true;
      }
    ), { verbose: true });

    test.done();
  },

  'all template intervals occur in input array'(test: Test) {
    fc.assert(fc.property(
      arbitrary_input_intervals(),
      (intervals) => {
        const template = setupStepScaling(intervals);
        const steps = template.allStepsAbsolute();

        return steps.every(step => {
          return reportFalse(intervals.find(interval => {
            const acceptableLowerBounds = step.MetricIntervalLowerBound === -Infinity ? [undefined, 0] : [undefined, step.MetricIntervalLowerBound];
            // tslint:disable-next-line:max-line-length
            const acceptableUpperBounds = step.MetricIntervalUpperBound === Infinity ? [undefined, Infinity] : [undefined, step.MetricIntervalUpperBound];

            return (acceptableLowerBounds.includes(interval.lower) && acceptableUpperBounds.includes(interval.upper));
          }) !== undefined, step, intervals);
        });
      }
    ));

    test.done();
  },

  'lower alarm uses lower policy'(test: Test) {
    fc.assert(fc.property(
      arbitrary_input_intervals(),
      (intervals) => {
        const template = setupStepScaling(intervals);
        const alarm = template.resource(template.lowerAlarm);
        fc.pre(alarm !== undefined);

        return reportFalse(alarm.Properties.AlarmActions[0].Ref === template.lowerPolicy, alarm);
      }
    ));

    test.done();
  },

  'upper alarm uses upper policy'(test: Test) {
    fc.assert(fc.property(
      arbitrary_input_intervals(),
      (intervals) => {
        const template = setupStepScaling(intervals);
        const alarm = template.resource(template.upperAlarm);
        fc.pre(alarm !== undefined);

        return reportFalse(alarm.Properties.AlarmActions[0].Ref === template.upperPolicy, alarm);
      }
    ));

    test.done();
  },

  'test step scaling on metric'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleOnMetric('Tracking', {
      metric: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Metric' }),
      scalingSteps: [
        { upper: 0, change: -1 },
        { lower: 100, change: +1 },
        { lower: 500, change: +5 }
      ]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'StepScaling',
      ScalingTargetId: {
        Ref: 'Target3191CF44'
      },
      StepScalingPolicyConfiguration: {
        AdjustmentType: 'ChangeInCapacity',
        MetricAggregationType: 'Average',
        StepAdjustments: [
          {
            MetricIntervalUpperBound: 0,
            ScalingAdjustment: -1
          }
        ]
      }

    }));

    test.done();
  }
};

/**
 * Synthesize the given step scaling setup to a template
 */
function setupStepScaling(intervals: appscaling.ScalingInterval[]) {
  const stack = new cdk.Stack();
  const target = createScalableTarget(stack);

  target.scaleOnMetric('ScaleInterval', {
    metric: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Success' }),
    scalingSteps: intervals
  });

  return new ScalingStackTemplate(SynthUtils.synthesize(stack).template);
}

class ScalingStackTemplate {
  public readonly lowerPolicy = 'TargetScaleIntervalLowerPolicy6F26D597';
  public readonly lowerAlarm = 'TargetScaleIntervalLowerAlarm4B5CE869';
  public readonly upperPolicy = 'TargetScaleIntervalUpperPolicy7C751132';
  public readonly upperAlarm = 'TargetScaleIntervalUpperAlarm69FD1BBB';

  constructor(private readonly template: any) {
  }

  public get lowerThreshold() {
    return this.threshold(this.lowerAlarm);
  }

  public get upperThreshold() {
    return this.threshold(this.upperAlarm);
  }

  public get lowerSteps() {
    return this.steps(this.lowerPolicy);
  }

  public get upperSteps() {
    return this.steps(this.upperPolicy);
  }

  public allStepsAbsolute() {
    const ret = new Array<TemplateStep>();
    const lowerThreshold = this.lowerThreshold;
    if (lowerThreshold !== undefined) { ret.push(...this.lowerSteps!.map(x => makeAbsolute(lowerThreshold, x))); }

    const upperThreshold = this.upperThreshold;
    if (upperThreshold !== undefined) { ret.push(...this.upperSteps!.map(x => makeAbsolute(upperThreshold, x))); }

    return ret;
  }

  public resource(id: string): object | any {
    return this.template.Resources[id];
  }

  private threshold(id: string): number | undefined  {
    return apply(this.resource(id), x => x.Properties.Threshold);
  }

  private steps(id: string): TemplateStep[] | undefined {
    return apply(this.resource(id), x => x.Properties.StepScalingPolicyConfiguration.StepAdjustments);
  }
}

interface TemplateStep {
  MetricIntervalLowerBound?: number;
  MetricIntervalUpperBound?: number;
  ScalingAdjustment: number;
}

function makeAbsolute(threshold: number, step: TemplateStep) {
  return concrete({
    MetricIntervalLowerBound: apply(step.MetricIntervalLowerBound, x => x + threshold),
    MetricIntervalUpperBound: apply(step.MetricIntervalUpperBound, x => x + threshold),
    ScalingAdjustment: step.ScalingAdjustment
  });
}

function overlaps(a: TemplateStep, b: TemplateStep) {
  return (a.MetricIntervalLowerBound! < b.MetricIntervalUpperBound!
    && a.MetricIntervalUpperBound! > b.MetricIntervalLowerBound!);
}

function concrete(step: TemplateStep) {
  return {
    MetricIntervalLowerBound: ifUndefined(step.MetricIntervalLowerBound, -Infinity),
    MetricIntervalUpperBound: ifUndefined(step.MetricIntervalUpperBound, Infinity),
    ScalingAdjustment: step.ScalingAdjustment
  };
}

function ifUndefined<T>(x: T | undefined, def: T): T {
  return x !== undefined ? x : def;
}

function apply<T, U>(x: T | undefined, f: (x: T) => U | undefined): U | undefined {
  if (x === undefined) { return undefined; }
  return f(x);
}

/**
 * Helper function to print variables in case of a failing property check
 */
function reportFalse(cond: boolean, ...repr: any[]) {
  if (!cond) {
    // tslint:disable-next-line:no-console
    console.error('PROPERTY FAILS ON:', ...repr);
  }
  return cond;
}
