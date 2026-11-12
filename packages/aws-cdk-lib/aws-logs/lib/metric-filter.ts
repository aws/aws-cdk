import type { Construct } from 'constructs';
import type { MetricFilterOptions } from './log-group';
import { CfnMetricFilter } from './logs.generated';
import { validateFieldSelectionCriteria, validateSystemFields } from './private/system-fields';
import { SystemField } from './system-field';
import type { MetricOptions } from '../../aws-cloudwatch';
import { Metric } from '../../aws-cloudwatch';
import { Resource, Token, ValidationError } from '../../core';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { ILogGroupRef } from '../../interfaces/generated/aws-logs-interfaces.generated';

/**
 * Properties for a MetricFilter
 */
export interface MetricFilterProps extends MetricFilterOptions {
  /**
   * The log group to create the filter on.
   */
  readonly logGroup: ILogGroupRef;
}

/**
 * A filter that extracts information from CloudWatch Logs and emits to CloudWatch Metrics
 */
@propertyInjectable
export class MetricFilter extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-logs.MetricFilter';
  private readonly metricName: string;
  private readonly metricNamespace: string;

  constructor(scope: Construct, id: string, props: MetricFilterProps) {
    super(scope, id, {
      physicalName: props.filterName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.metricName = props.metricName;
    this.metricNamespace = props.metricNamespace;

    validateFieldSelectionCriteria(this, props.fieldSelectionCriteria);
    validateSystemFields(this, 'emitSystemFieldDimensions', props.emitSystemFieldDimensions, [SystemField.AWS_ACCOUNT, SystemField.AWS_REGION]);

    // System field dimensions count toward the same limit as `dimensions`.
    const numberOfDimensions = Object.keys(props.dimensions ?? {}).length;
    const numberOfSystemFieldDimensions = props.emitSystemFieldDimensions && !Token.isUnresolved(props.emitSystemFieldDimensions)
      ? props.emitSystemFieldDimensions.length
      : 0;
    if (numberOfDimensions + numberOfSystemFieldDimensions > 3) {
      const received = numberOfSystemFieldDimensions > 0
        ? `${numberOfDimensions + numberOfSystemFieldDimensions} (${numberOfDimensions} dimensions and ${numberOfSystemFieldDimensions} system field dimensions)`
        : `${numberOfDimensions}`;
      throw new ValidationError(lit`MetricFilterSupportsMaximumDimensions`, `MetricFilter only supports a maximum of 3 dimensions but received ${received}.`, this);
    }

    // It looks odd to map this object to a singleton list, but that's how
    // we're supposed to do it according to the docs.
    //
    // > Currently, you can specify only one metric transformation for
    // > each metric filter. If you want to specify multiple metric
    // > transformations, you must specify multiple metric filters.
    //
    // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html
    new CfnMetricFilter(this, 'Resource', {
      logGroupName: props.logGroup.logGroupRef.logGroupName,
      filterName: this.physicalName,
      filterPattern: props.filterPattern.logPatternString,
      metricTransformations: [{
        metricNamespace: props.metricNamespace,
        metricName: props.metricName,
        metricValue: props.metricValue ?? '1',
        defaultValue: props.defaultValue,
        dimensions: props.dimensions ? Object.entries(props.dimensions).map(([key, value]) => ({ key, value })) : undefined,
        unit: props.unit,
      }],
      applyOnTransformedLogs: props.applyOnTransformedLogs,
      fieldSelectionCriteria: props.fieldSelectionCriteria,
      emitSystemFieldDimensions: props.emitSystemFieldDimensions,
    });
  }

  /**
   * Return the given named metric for this Metric Filter
   *
   * @default avg over 5 minutes
   */
  @MethodMetadata()
  public metric(props?: MetricOptions): Metric {
    return new Metric({
      metricName: this.metricName,
      namespace: this.metricNamespace,
      statistic: 'avg',
      ...props,
    }).attachTo(this);
  }
}
