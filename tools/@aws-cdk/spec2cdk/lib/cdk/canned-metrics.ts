import { DimensionSet, Metric, Resource, Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import { ClassType, expr, InterfaceType, IScope, Method, Module, stmt, Type } from '@cdklabs/typewriter';
import {
  metricFunctionName,
  metricsClassNameFromService as metricsClassNameFromNamespace,
} from '../naming/conventions';

/**
 * Generate Canned Metrics
 */
export class CannedMetricsModule extends Module {
  public static forService(db: SpecDatabase, service: Service): CannedMetricsModule {
    const metrics = db.follow('serviceHasMetric', service);
    const namespaces = Array.from(new Set(metrics.map((r) => r.entity.namespace)));
    const cm = new CannedMetricsModule(db, service, namespaces);

    for (const r of metrics) {
      cm.addMetricWithDimensions(r.entity);
    }

    return cm;
  }

  public static forResource(db: SpecDatabase, resource: Resource): CannedMetricsModule {
    const service = db.incoming('hasResource', resource).only().entity;
    const metrics = db.follow('resourceHasMetric', resource);
    const namespaces = Array.from(new Set(metrics.map((r) => r.entity.namespace)));
    const cm = new CannedMetricsModule(db, service, namespaces);

    for (const r of metrics) {
      cm.addMetricWithDimensions(r.entity);
    }

    return cm;
  }

  private metrics: Record<string, MetricsClass> = {};
  private _hasCannedMetrics: boolean = false;

  private constructor(private readonly db: SpecDatabase, service: Service, namespaces: string[]) {
    super(`${service.name}.canned-metrics`);

    const returnType = new MetricsReturnType(this);

    for (const namespace of namespaces) {
      this.metrics[namespace] = new MetricsClass(this, namespace, returnType);
    }
  }

  public get hasCannedMetrics() {
    return this._hasCannedMetrics;
  }

  /**
   * Add metrics for a given dimension set to the module
   */
  public addMetricWithDimensions(metric: Metric) {
    this._hasCannedMetrics = true;
    const dimensions = this.db.follow('usesDimensionSet', metric).map((m) => m.entity);
    this.metrics[metric.namespace].addMetricWithDimensions(metric, dimensions);
  }
}

export class MetricsReturnType extends InterfaceType {
  public constructor(scope: IScope) {
    super(scope, {
      name: 'MetricWithDims',
      export: true,
      properties: [
        {
          name: 'namespace',
          type: Type.STRING,
          immutable: true,
        },
        {
          name: 'metricName',
          type: Type.STRING,
          immutable: true,
        },
        {
          name: 'statistic',
          type: Type.STRING,
          immutable: true,
        },
      ],
    });

    const D = this.addTypeParameter({ name: 'D' });

    this.addProperty({
      name: 'dimensionsMap',
      type: D.asType(),
      immutable: true,
    });
  }
}

export class MetricsClass extends ClassType {
  constructor(scope: IScope, namespace: string, private returnType: MetricsReturnType) {
    super(scope, {
      export: true,
      name: metricsClassNameFromNamespace(namespace),
    });
  }

  public addMetricWithDimensions(metric: Metric, dimensionSets: DimensionSet[]) {
    const name = metricFunctionName(metric);

    // Add a unique declaration for each dimension set
    for (const set of dimensionSets) {
      const dimensionsType = dimensionSetType(set);
      this.addMetricMethodDeclaration(name, dimensionsType);
    }

    // If we have more than one dimension set, add a generic declaration
    if (dimensionSets.length > 1) {
      this.addMetricMethodDeclaration(name, Type.ANY);
    }

    // Add the implementation to the final declaration
    this.methods.at(-1)?.addBody(
      stmt.ret(
        expr.object({
          namespace: expr.lit(metric.namespace),
          metricName: expr.lit(metric.name),
          dimensionsMap: expr.ident('dimensions'),
          statistic: expr.lit(metric.statistic),
        }),
      ),
    );
  }

  private addMetricMethodDeclaration(name: string, dimensionsType: Type): Method {
    return this.addMethod({
      name,
      static: true,
      returnType: Type.fromName(this.scope, this.returnType.name, [dimensionsType]),
      parameters: [
        {
          name: 'dimensions',
          type: dimensionsType,
        },
      ],
    });
  }
}

function dimensionSetType(set: DimensionSet): Type {
  return Type.anonymousInterface(set.dimensions.map(({ name }) => ({ name, type: Type.STRING })));
}
