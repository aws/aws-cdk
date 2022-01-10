import * as cfnspec from '@aws-cdk/cfnspec';
import { CodeMaker, toCamelCase } from 'codemaker';


/**
 * Generate default prop sets for canned metric
 *
 * We don't generate `cloudwatch.Metric` objects directly (because we can't
 * guarantee that all packages already properly depend on
 * `@aws-cdk/aws-cloudwatch`).
 *
 * Instead, we generate functions that return the set of properties that should
 * be passed to a `cloudwatch.Metric` to construct it.
 *
 * ----------------------------------------------------------
 *
 * Generates code similar to the following:
 *
 * ```
 * export class <Namespace>Metrics {
 *   public static <metric><statistic>(<dimensions>): Props {
 *     // ...
 *   }
 * }
 * ```
 */
export class CannedMetricsGenerator {
  private readonly code = new CodeMaker({ indentationLevel: 2 });
  private readonly outputFile: string;

  constructor(moduleName: string, private readonly namespace: string) {
    this.outputFile = `${moduleName}-canned-metrics.generated.ts`;
    this.code.openFile(this.outputFile);

    this.code.line(`// Copyright 2012-${new Date().getFullYear()} Amazon.com, Inc. or its affiliates. All Rights Reserved.`);
    this.code.line();
    this.code.line('/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control');
    this.code.line();
  }

  public generate(): boolean {
    let emittedOverloads = false;

    const namespaces = groupByNamespace(cfnspec.cannedMetricsForService(this.namespace));
    for (const [namespace, metrics] of Object.entries(namespaces)) {
      this.code.openBlock(`export class ${namespace}Metrics`);

      for (const metric of metrics) {
        const functionName = this.functionName(metric);

        if (metric.dimensions.length > 1) {
          emittedOverloads = true;
          // Generate overloads for every possible dimensions type
          for (const dims of metric.dimensions) {
            const dimsType = dimensionsType(dims);
            this.code.line(`public static ${functionName}(dimensions: ${dimsType}): MetricWithDims<${dimsType}>;`);
          }
          this.code.openBlock(`public static ${functionName}(dimensions: any)`);
        } else {
          // Else just the one type
          this.code.openBlock(`public static ${functionName}(dimensions: ${dimensionsType(metric.dimensions[0])})`);
        }

        this.code.line('return {');
        this.code.line(`  namespace: '${metric.namespace}',`);
        this.code.line(`  metricName: '${metric.metricName}',`);
        this.code.line('  dimensionsMap: dimensions,');
        this.code.line(`  statistic: '${metric.defaultStat}',`);
        this.code.line('};');
        this.code.closeBlock();
      }

      this.code.closeBlock();
    }

    if (emittedOverloads) {
      this.emitTypeDef();
    }

    return Object.keys(namespaces).length > 0;
  }

  /**
   * Saves the generated file.
   */
  public async save(dir: string): Promise<string[]> {
    this.code.closeFile(this.outputFile);
    return this.code.save(dir);
  }

  private functionName(metric: cfnspec.CannedMetric) {
    return makeIdentifier(toCamelCase(`${metric.metricName}${metric.defaultStat}`));
  }

  private emitTypeDef() {
    this.code.line('type MetricWithDims<D> = { namespace: string, metricName: string, statistic: string, dimensionsMap: D };');
  }
}

/**
 * If not a valid identifier, prefix with a '_'
 */
function makeIdentifier(s: string) {
  // Strip invalid characters from identifier
  s = s.replace(/([^a-zA-Z0-9_])/g, '');
  // If it doesn't start with an alpha char, prefix with _
  s = s.replace(/^([^a-zA-Z_])/, '_$1');
  return s;
}

/**
 * Return an anonymous TypeScript type that would accept the given dimensions
 */
function dimensionsType(dims: string[]) {
  return `{ ${dims.map(d => `${escapeIdentifier(d)}: string`).join(', ')} }`;
}

/**
 * Escape identifiers
 *
 * Most services choose nice and neat ASCII characters for their dimension
 * names, but of course you know some won't.
 */
function escapeIdentifier(ident: string) {
  return ident.match(/[^a-zA-Z0-9]/) ? `'${ident}'` : ident;
}

function groupByNamespace(metrics: cfnspec.CannedMetric[]): Record<string, cfnspec.CannedMetric[]> {
  const ret: Record<string, cfnspec.CannedMetric[]> = {};
  for (const metric of metrics) {
    const namespace = sanitizeNamespace(metric.namespace);
    (ret[namespace] ?? (ret[namespace] = [])).push(metric);
  }
  return ret;
}

/**
 * Sanitize metrics namespace
 *
 * - Most namespaces look like 'AWS/<ServiceName>'.
 * - 'AWS/CloudWatch/MetricStreams' has 2 slashes in it.
 * - 'CloudWatchSynthetics' doesn't have a slash at all.
 */
function sanitizeNamespace(namespace: string) {
  return namespace.replace(/^AWS\//, '').replace('/', '');
}