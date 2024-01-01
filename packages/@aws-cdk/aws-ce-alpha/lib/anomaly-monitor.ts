import { Construct } from 'constructs';
import { ArnFormat, IResource, Lazy, Names, Resource, Stack } from 'aws-cdk-lib';
import { CfnAnomalyMonitor } from 'aws-cdk-lib/aws-ce';

/**
 * An Anomaly Monitor
 */
export interface IAnomalyMonitor extends IResource {
  /**
   * The ARN of the anomaly monitor
   *
   * @attribute
   */
  readonly anomalyMonitorArn: string;
}

/**
 * Options for an anomaly monitor
 */
export interface AnomalyMonitorProps {
  /**
   * A name for the anomaly monitor
   *
   * @default - A name is automatically generated
   */
  readonly anomalyMonitorName?: string;

  /**
   * The type of anomaly monitor
   */
  readonly type: MonitorType;
}

/**
 * Type of anomaly monitor
 */
export abstract class MonitorType {
  /**
   * Anomaly monitor for AWS services
   */
  public static awsServices(): MonitorType {
    return {
      type: 'DIMENSIONAL',
      dimension: 'SERVICE',
    };
  }

  /**
   * Custom anomaly monitor for a cost allocation tag
   */
  public static costAllocationTag(key: string, values: string[]): MonitorType {
    return {
      type: 'CUSTOM',
      specification: {
        Tags: {
          Key: key,
          Values: values,
        },
      },
    };
  }

  /**
   * Custom anomaly monitor for a cost category
   */
  public static costCategory(key: string, value: string): MonitorType {
    return {
      type: 'CUSTOM',
      specification: {
        CostCategories: {
          Key: key,
          Values: [value],
        },
      },
    };
  }

  /**
   * Custom anomaly monitor with linked accounts
   */
  public static linkedAccounts(accounts: string[]): MonitorType {
    return {
      type: 'CUSTOM',
      specification: {
        Dimensions: {
          Key: 'LINKED_ACCOUNT',
          Values: accounts,
        },
      },
    };
  }

  /**
   * The type of the monitor
   */
  public abstract type: string;

  /**
   * The dimension of the monitor
   */
  public abstract dimension?: string;

  /**
   * The specification of the monitor
   */
  public readonly specification?: Record<string, any>;
}

/**
 * An anomaly monitor
 */
export class AnomalyMonitor extends Resource implements IAnomalyMonitor {
  /**
   * Use an existing anomaly monitor
   */
  public static fromAnomalyMonitorArn(scope: Construct, id: string, anomalyMonitorArn: string): IAnomalyMonitor {
    const parsedArn = Stack.of(scope).splitArn(anomalyMonitorArn, ArnFormat.SLASH_RESOURCE_NAME);

    class Import extends Resource implements IAnomalyMonitor {
      public readonly anomalyMonitorArn = anomalyMonitorArn;
    }

    return new Import(scope, id, {
      account: parsedArn.account,
      region: parsedArn.region,
    });
  }

  public readonly anomalyMonitorArn: string;

  /**
   * The date when the monitor was created.
   *
   * @attribute
   */
  public readonly anomalyMonitorCreationDate: string;

  /**
   * The value for evaluated dimensions.
   *
   * @attribute
   */
  public readonly anomalyMonitorDimensionalValueCount: number;

  /**
   * The date when the monitor last evaluated for anomalies.
   *
   * @attribute
   */
  public readonly anomalyMonitorLastEvaluatedDate: string;

  /**
   * The date when the monitor was last updated.
   *
   * @attribute
   */
  public readonly anomalyMonitorLastUpdatedDate: string;

  constructor(scope: Construct, id: string, props: AnomalyMonitorProps) {
    super(scope, id, {
      physicalName: props.anomalyMonitorName ?? Lazy.string({ produce: () => this.generateUniqueId() }),
    });

    const monitor = new CfnAnomalyMonitor(this, 'Resource', {
      monitorName: this.physicalName,
      monitorType: props.type.type,
      monitorDimension: props.type.dimension,
      monitorSpecification: props.type.specification ? JSON.stringify(props.type.specification) : undefined,
    });

    this.anomalyMonitorArn = monitor.ref;
    this.anomalyMonitorCreationDate = monitor.attrCreationDate;
    this.anomalyMonitorDimensionalValueCount = monitor.attrDimensionalValueCount;
    this.anomalyMonitorLastEvaluatedDate = monitor.attrLastEvaluatedDate;
    this.anomalyMonitorLastUpdatedDate = monitor.attrLastUpdatedDate;
  }

  private generateUniqueId(): string {
    const name = Names.uniqueId(this);
    if (name.length > 50) {
      return name.substring(0, 25) + name.substring(name.length - 25);
    }
    return name;
  }
}