import type { Resource, Service, DimensionSet, Metric, SpecDatabase } from '@aws-cdk/service-spec-types';
import { Splat, ExternalModule, Module, ClassType, EnumType, StructType, Type, expr, stmt, MemberVisibility, Stability } from '@cdklabs/typewriter';
import type { AddServiceProps, LibraryBuilderProps } from '../cdk/library-builder';
import { LibraryBuilder } from '../cdk/library-builder';
import { ResourceReference } from '../cdk/reference-props';
import type { LocatedModule, ServiceSubmoduleProps } from '../cdk/service-submodule';
import { BaseServiceSubmodule } from '../cdk/service-submodule';
import * as naming from '../naming';
import { log } from '../util';

/** A single dimension after merging: accumulates all known values from multiple DimensionSets sharing the same name */
interface MergedDimension {
  readonly name: string;
  readonly knownValues: string[];
}

/**
 * A post-merge representation of one or more DimensionSets that share the same name.
 *
 * Multiple spec-level DimensionSets with the same name are collapsed into a single
 * MergedDimensionSet: dimension values are accumulated into `knownValues` arrays
 * (used to generate enum types), and all associated metrics are collected.
 */
interface MergedDimensionSet {
  readonly name: string;
  readonly dimensions: MergedDimension[];
  readonly metrics: Metric[];
}

/** A namespace-level metrics class with its dimension set classes */
interface NamespaceMetrics {
  readonly metricsClass: ClassType;
  readonly dimSetClasses: Map<string, ClassType>;
  readonly namespace: string;
}

/**
 * Shared context for metrics code generation.
 */
interface MetricsGenerationContext {
  readonly db: SpecDatabase;
  readonly cloudwatchModule: ExternalModule;
  readonly metricsModule: Module;
}

class MetricsServiceModule extends BaseServiceSubmodule {
  public readonly constructLibModule: ExternalModule;
  public metricsModule?: Module;
  /** One metrics class per CloudWatch namespace */
  public readonly namespaceMetrics = new Map<string, NamespaceMetrics>();

  public constructor(props: ServiceSubmoduleProps) {
    super(props);
    this.constructLibModule = new ExternalModule(`aws-cdk-lib/${props.submoduleName}`);
  }

  /**
   * Find the NamespaceMetrics that contains a given dimension set class name.
   * Searches across all namespaces in this submodule.
   */
  public findDimSetClass(className: string): { nsMetrics: NamespaceMetrics; dimensionSetClass: ClassType } | undefined {
    for (const nsMetrics of this.namespaceMetrics.values()) {
      const dimensionSetClass = nsMetrics.dimSetClasses.get(className);
      if (dimensionSetClass) return { nsMetrics, dimensionSetClass };
    }
    return undefined;
  }
}

export interface MetricsBuilderProps extends LibraryBuilderProps {
  filePattern?: string;
}

export class MetricsBuilder extends LibraryBuilder<MetricsServiceModule> {
  private readonly filePattern: string;

  public constructor(props: MetricsBuilderProps) {
    super(props);
    this.filePattern = props.filePattern ?? '%moduleName%/metrics.generated.ts';
  }

  protected createServiceSubmodule(service: Service, submoduleName: string): MetricsServiceModule {
    const submodule = new MetricsServiceModule({ submoduleName, service });

    const allMetrics = this.db.follow('serviceHasMetric', service).map(e => e.entity);
    if (allMetrics.length === 0) return submodule;

    const metricsByNamespace = new Map<string, Metric[]>();
    for (const metric of allMetrics) {
      let metrics = metricsByNamespace.get(metric.namespace);
      if (!metrics) {
        metrics = [];
        metricsByNamespace.set(metric.namespace, metrics);
      }
      metrics.push(metric);
    }

    const { module } = this.createMetricsModule(submodule, service);
    submodule.metricsModule = module;

    const cloudwatchModule = new ExternalModule('aws-cdk-lib/aws-cloudwatch');
    cloudwatchModule.import(module, 'cloudwatch');

    const context: MetricsGenerationContext = {
      db: this.db,
      cloudwatchModule,
      metricsModule: module,
    };

    for (const [namespace, nsMetrics] of metricsByNamespace) {
      const mergedSets = collectAndMergeDimensionSets(context.db, nsMetrics);
      if (mergedSets.length === 0) continue;

      const nsClassName = namespaceClassName(namespace);
      const metricsClass = new ClassType(module, {
        name: nsClassName,
        export: true,
        docs: { summary: `CloudWatch metrics for ${namespace}` },
      });

      const dimSetClasses = new Map<string, ClassType>();

      for (const merged of mergedSets) {
        const className = dimSetClassName(merged);
        if (dimSetClasses.has(className)) {
          log.debug(`Skipping duplicate dimension set [${merged.dimensions.map(d => d.name).join(', ')}] (class: ${className}) for namespace ${namespace}`);
          continue;
        }

        const gen = new DimensionSetClassGenerator(metricsClass, merged, context.cloudwatchModule);
        dimSetClasses.set(className, gen.dimensionSetClass);

        const usedMethodNames = new Set<string>();
        for (const metric of merged.metrics) {
          const methodName = metricMethodName(metric.name);
          if (usedMethodNames.has(methodName)) {
            log.debug(`Skipping duplicate metric method '${methodName}' in ${nsClassName}.${className} (metric: ${metric.name}, namespace: ${namespace}, statistic: ${metric.statistic})`);
            continue;
          }
          usedMethodNames.add(methodName);
          gen.addMetricMethod(metric);
        }
      }

      submodule.namespaceMetrics.set(namespace, { metricsClass, dimSetClasses, namespace });
    }

    return submodule;
  }

  protected addResourceToSubmodule(submodule: MetricsServiceModule, resource: Resource, _props?: AddServiceProps): void {
    if (!submodule.metricsModule || submodule.namespaceMetrics.size === 0) return;

    const resourceDimSets = this.db.follow('resourceHasDimensionSet', resource).map(e => e.entity);
    if (resourceDimSets.length === 0) return;

    const context: MetricsGenerationContext = {
      db: this.db,
      cloudwatchModule: new ExternalModule('aws-cdk-lib/aws-cloudwatch'),
      metricsModule: submodule.metricsModule,
    };

    const factoryGen = new ResourceFactoryGenerator(context, submodule, resource);
    for (const dimSet of resourceDimSets) {
      factoryGen.tryAddFactory(dimSet);
    }
  }

  protected postprocessSubmodule(submodule: MetricsServiceModule, _props?: AddServiceProps): void {
    // Add private constructors to all namespace classes
    for (const { metricsClass } of submodule.namespaceMetrics.values()) {
      const ctor = metricsClass.addInitializer({ visibility: MemberVisibility.Private });
      ctor.addBody(stmt.sep());
    }
  }

  private createMetricsModule(submodule: MetricsServiceModule, service: Service): LocatedModule<Module> {
    const module = new Module(`@aws-cdk/mixins-preview/${submodule.submoduleName}/metrics`);
    const filePath = this.pathFor(this.filePattern, submodule.submoduleName, service);
    submodule.registerModule({ module, filePath });
    this.rememberModule({ module, filePath });
    return { module, filePath };
  }
}

/**
 * Generates a TypeScript class for a single MergedDimensionSet.
 *
 */
class DimensionSetClassGenerator {
  public readonly dimensionSetClass: ClassType;
  public readonly propsStruct?: StructType;

  constructor(
    scope: ClassType,
    private readonly merged: MergedDimensionSet,
    private readonly cloudwatchModule: ExternalModule,
  ) {
    const className = dimSetClassName(merged);

    this.dimensionSetClass = new ClassType(scope, {
      name: className,
      export: true,
      docs: { summary: `Metrics for dimension set: ${merged.name} {${merged.dimensions.map(d => d.name).join(', ') || 'no dimensions'}}` },
    });

    this.dimensionSetClass.addProperty({
      name: 'dimensions',
      type: Type.mapOf(Type.STRING),
      immutable: true,
      visibility: MemberVisibility.Private,
    });

    if (merged.dimensions.length > 0) {
      this.propsStruct = new StructType(scope, {
        name: `${className}Props`,
        export: true,
        docs: { summary: `Dimensions for ${className}`, stability: Stability.External },
      });
      for (const dim of merged.dimensions) {
        const propName = naming.propertyNameFromCloudFormation(dim.name.replace(/[^a-zA-Z0-9]/g, '-'));
        let propType: Type = Type.STRING;

        if (dim.knownValues.length > 0) {
          const enumType = new EnumType(scope, {
            name: `${className}${sanitizeName(dim.name)}`,
            export: true,
            docs: { summary: `Known values for the ${dim.name} dimension` },
          });
          for (const value of dim.knownValues) {
            enumType.addMember({ name: dimensionEnumMemberName(value), value, docs: `${dim.name} = ${value}` });
          }
          propType = enumType.type;
        }

        this.propsStruct.addProperty({
          name: propName,
          type: propType,
          docs: { summary: `The ${dim.name} dimension` },
        });
      }
      this.addConstructorWithProps();
    } else {
      this.addEmptyConstructor();
    }
  }

  public addMetricMethod(metric: Metric) {
    const methodName = metricMethodName(metric.name);
    const method = this.dimensionSetClass.addMethod({
      name: methodName,
      returnType: Type.fromName(this.cloudwatchModule, 'IMetric'),
      docs: { summary: metric.description ?? `The ${metric.name} metric`, default: `${metric.statistic} over 5 minutes` },
    });
    const optionsParam = method.addParameter({
      name: 'options',
      type: Type.fromName(this.cloudwatchModule, 'MetricOptions'),
      optional: true,
    });

    method.addBody(
      stmt.ret(Type.fromName(this.cloudwatchModule, 'Metric').newInstance(
        expr.object({
          namespace: expr.lit(metric.namespace),
          metricName: expr.lit(metric.name),
          dimensionsMap: expr.this_().prop('dimensions'),
          statistic: expr.lit(metric.statistic),
        }, new Splat(optionsParam)),
      )),
    );
  }

  private addConstructorWithProps() {
    const ctor = this.dimensionSetClass.addInitializer({});
    const propsParam = ctor.addParameter({ name: 'props', type: this.propsStruct!.type });

    const dimEntries = this.merged.dimensions.map(dim => {
      const propName = naming.propertyNameFromCloudFormation(dim.name.replace(/[^a-zA-Z0-9]/g, '-'));
      return [dim.name, propsParam.prop(propName)] as const;
    });

    ctor.addBody(
      stmt.assign(expr.this_().prop('dimensions'), expr.object(dimEntries)),
    );
  }

  private addEmptyConstructor() {
    const ctor = this.dimensionSetClass.addInitializer({});
    ctor.addBody(
      stmt.assign(expr.this_().prop('dimensions'), expr.object([])),
    );
  }
}

/**
 * Generates static factory methods on namespace classes that create dimension set
 * instances from resource references (e.g., `LambdaMetrics.fromFunction(ref)`).
 */
class ResourceFactoryGenerator {
  private readonly refProps: Set<string>;
  private readonly generatedFactories = new Set<string>();

  constructor(
    private readonly context: MetricsGenerationContext,
    private readonly submodule: MetricsServiceModule,
    private readonly resource: Resource,
  ) {
    const referenceProps = new ResourceReference(resource).referenceProps;
    this.refProps = new Set(referenceProps.map(p => p.declaration.name));
  }

  /**
   * Attempt to generate a factory method for the given DimensionSet.
   * Skips silently if the dimension set has fixed values, or if not all
   * dimensions can be mapped to reference properties.
   */
  public tryAddFactory(dimSet: DimensionSet): void {
    const className = dimSetClassName(dimSet);
    const found = this.submodule.findDimSetClass(className);
    if (!found) {
      throw new Error(`Could not find dimension set class '${className}' for resource ${this.resource.name}.`);
    }

    const { nsMetrics, dimensionSetClass } = found;
    const factoryKey = `${nsMetrics.namespace}::from${this.resource.name}`;
    if (this.generatedFactories.has(factoryKey)) return;

    if (dimSet.dimensions.some(d => d.value)) return;

    // Check if all dimensions can be filled from the reference interface
    const dimMappings = this.resolveDimensionMappings(dimSet);
    if (!dimMappings) return;

    const refInterfaceName = naming.referenceInterfaceName(this.resource.name);
    const serviceModule = new ExternalModule(`aws-cdk-lib/${this.submodule.submoduleName}`);
    serviceModule.importSelective(this.context.metricsModule, [refInterfaceName]);

    const refInterface = Type.fromName(serviceModule, refInterfaceName);
    const refAttrName = naming.referenceInterfaceAttributeName(this.resource.name);

    const factory = nsMetrics.metricsClass.addMethod({
      name: `from${this.resource.name}`,
      static: true,
      returnType: dimensionSetClass.type,
      docs: { summary: `Create ${dimensionSetClass.name} from a ${this.resource.name} reference` },
    });
    const refParam = factory.addParameter({ name: 'ref', type: refInterface });

    const propEntries = dimMappings.map(m => [
      naming.propertyNameFromCloudFormation(m.dimName.replace(/[^a-zA-Z0-9]/g, '-')),
      refParam.prop(refAttrName).prop(m.refPropName),
    ] as const);

    factory.addBody(
      stmt.ret(dimensionSetClass.newInstance(expr.object(propEntries))),
    );

    this.generatedFactories.add(factoryKey);
  }

  /**
   * Try to map every dimension in the set to a reference property.
   * Returns the mappings if all dimensions match, or undefined if any dimension is unmappable.
   */
  private resolveDimensionMappings(dimSet: DimensionSet): Array<{ dimName: string; refPropName: string }> | undefined {
    const mappings: Array<{ dimName: string; refPropName: string }> = [];
    for (const dim of dimSet.dimensions) {
      const refPropName = naming.referencePropertyName(dim.name, this.resource.name);
      if (!this.refProps.has(refPropName)) return undefined;
      mappings.push({ dimName: dim.name, refPropName });
    }
    return mappings.length > 0 ? mappings : undefined;
  }
}

/**
 * Collects all DimensionSets referenced by the given metrics and merges them by name.
 *
 * Phase 1: Groups DimensionSets by `dedupKey`, collecting the metrics that reference each.
 * Phase 2: Merges by `name` — DimensionSets sharing the same name have their per-dimension
 *          values accumulated into `knownValues[]` arrays and their metrics unioned.
 *
 * This two-phase approach is needed because the spec database may contain multiple
 * DimensionSet entities with the same name but different dimension values (e.g., different
 * known values for a "StorageType" dimension across different metrics).
 */
function collectAndMergeDimensionSets(db: SpecDatabase, metrics: Metric[]): MergedDimensionSet[] {
  // Phase 1: Group by dedupKey, collecting metrics for each DimensionSet
  const byDedupKey = new Map<string, { dimSet: DimensionSet; metrics: Metric[] }>();
  for (const metric of metrics) {
    for (const { entity: ds } of db.follow('usesDimensionSet', metric)) {
      let entry = byDedupKey.get(ds.dedupKey);
      if (!entry) {
        entry = { dimSet: ds, metrics: [] };
        byDedupKey.set(ds.dedupKey, entry);
      }
      if (!entry.metrics.some(m => m.dedupKey === metric.dedupKey)) {
        entry.metrics.push(metric);
      }
    }
  }

  // Phase 2: Merge by name, accumulating known dimension values and deduplicating metrics
  const byName = new Map<string, MergedDimensionSet>();
  for (const { dimSet, metrics: dsMetrics } of byDedupKey.values()) {
    const key = dimSet.name || 'Account';
    let merged = byName.get(key);
    if (!merged) {
      merged = {
        name: key,
        dimensions: dimSet.dimensions.map(d => ({ name: d.name, knownValues: [] })),
        metrics: [],
      };
      byName.set(key, merged);
    }

    for (const dim of dimSet.dimensions) {
      if (dim.value) {
        const mergedDim = merged.dimensions.find(d => d.name === dim.name);
        if (mergedDim && !mergedDim.knownValues.includes(dim.value)) {
          mergedDim.knownValues.push(dim.value);
        }
      }
    }

    for (const metric of dsMetrics) {
      if (!merged.metrics.some(m => m.dedupKey === metric.dedupKey)) {
        merged.metrics.push(metric);
      }
    }
  }

  return [...byName.values()];
}

/** Derive class name from CloudWatch namespace: "AWS/Lambda" → "LambdaMetrics" */
function namespaceClassName(namespace: string): string {
  return `${namespace.replace(/^AWS\//, '').replace(/\//g, '')}Metrics`;
}

/** Derive a dimension set class name from either a merged or raw dimension set */
function dimSetClassName(ds: MergedDimensionSet | DimensionSet): string {
  if (ds.dimensions.length === 0) {
    return 'AccountMetrics';
  }
  if (!ds.name) {
    throw new Error(`DimensionSet is missing a name (dimensions: ${ds.dimensions.map(d => d.name).join(', ')})`);
  }
  return `${sanitizeName(ds.name)}Metrics`;
}

/** Convert a known dimension value to enum name MyEnum -> MY_ENUM */
function dimensionEnumMemberName(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase();
}

/** Convert a metric name to a method name like `metricInvocations` */
function metricMethodName(name: string): string {
  const pascal = sanitizeName(name);
  // Normalize HTTP status code patterns after PascalCasing (e.g. 4Xx -> 4xx, 5Xx -> 5xx)
  const normalized = pascal.replace(/([2-5])Xx/g, '$1xx');
  return `metric${normalized.replace(/^_/, '')}`;
}

function sanitizeName(name: string): string {
  return naming.sanitizeTypeName(name.replace(/[^a-zA-Z0-9]/g, '-'));
}
