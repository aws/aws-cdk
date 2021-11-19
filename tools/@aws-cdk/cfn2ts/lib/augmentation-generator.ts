import { resourceAugmentation, schema } from '@aws-cdk/cfnspec';
import { CodeMaker } from 'codemaker';
import * as genspec from './genspec';
import { SpecName } from './spec-utils';

/**
 * Generate augmentation methods for the given types
 *
 * Augmentation consists of two parts:
 *
 * - Adding method declarations to an interface (IBucket)
 * - Adding implementations for those methods to the base class (BucketBase)
 *
 * The augmentation file must be imported in `index.ts`.
 *
 * ----------------------------------------------------------
 *
 * Generates code similar to the following:
 *
 * ```
 * import <Class>Base from './<class>-base';
 *
 * declare module './<class>-base' {
 *   interface <IClass> {
 *     method(...): Type;
 *   }
 *   interface <ClassBase> {
 *     method(...): Type;
 *   }
 * }
 *
 * <ClassBase>.prototype.<method> = // ...impl...
 * ```
 */
export class AugmentationGenerator {
  private readonly code = new CodeMaker();
  private readonly outputFile: string;

  constructor(moduleName: string, private readonly spec: schema.Specification, private readonly affix: string) {
    this.outputFile = `${moduleName}-augmentations.generated.ts`;
    this.code.openFile(this.outputFile);

    this.code.line(`// Copyright 2012-${new Date().getFullYear()} Amazon.com, Inc. or its affiliates. All Rights Reserved.`);
    this.code.line();
    this.code.line('/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control');
  }

  public emitCode(): boolean {
    let importedCloudWatch = false;
    let hadAugmentations = false;
    for (const resourceTypeName of Object.keys(this.spec.ResourceTypes).sort()) {
      const aug = resourceAugmentation(resourceTypeName);

      if (aug.metrics) {
        if (!importedCloudWatch) {
          this.code.line("import * as cloudwatch from '@aws-cdk/aws-cloudwatch';");
          importedCloudWatch = true;
        }
        this.emitMetricAugmentations(resourceTypeName, aug.metrics, aug.options);
        hadAugmentations = true;
      }
    }
    return hadAugmentations;
  }

  /**
   * Saves the generated file.
   */
  public async save(dir: string): Promise<string[]> {
    this.code.closeFile(this.outputFile);
    return this.code.save(dir);
  }

  private emitMetricAugmentations(resourceTypeName: string, metrics: schema.ResourceMetricAugmentations, options?: schema.AugmentationOptions): void {
    const cfnName = SpecName.parse(resourceTypeName);
    const resourceName = genspec.CodeName.forCfnResource(cfnName, this.affix);
    const l2ClassName = resourceName.className.replace(/^Cfn/, '');
    const kebabL2ClassName = l2ClassName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

    const classFile = `./${(options && options.classFile) || `${kebabL2ClassName}-base`}`;
    const className = (options && options.class) || l2ClassName + 'Base';
    const interfaceFile = (options && options.interfaceFile) ? `./${options.interfaceFile}` : classFile;
    const interfaceName = (options && options.interface) || 'I' + l2ClassName;

    this.code.line(`import { ${className} } from "${classFile}";`);

    if (classFile === interfaceFile) {
      this.code.openBlock(`declare module "${classFile}"`);
    } else {
      this.code.openBlock(`declare module "${interfaceFile}"`);
    }

    // Add to the interface
    this.code.openBlock(`interface ${interfaceName}`);
    this.emitMetricFunctionDeclaration(cfnName);
    for (const m of metrics.metrics) {
      this.emitSpecificMetricFunctionDeclaration(m);
    }
    this.code.closeBlock();

    if (classFile !== interfaceFile) {
      this.code.closeBlock();
      this.code.openBlock(`declare module "${classFile}"`);
    }

    // Add declaration to the base class (implementation added below)
    this.code.openBlock(`interface ${className}`);
    this.emitMetricFunctionDeclaration(cfnName);
    for (const m of metrics.metrics) {
      this.emitSpecificMetricFunctionDeclaration(m);
    }
    this.code.closeBlock();

    this.code.closeBlock();

    // Emit the monkey patches for all methods
    this.emitMetricFunction(className, metrics);
    for (const m of metrics.metrics) {
      this.emitSpecificMetricFunction(className, m);
    }
  }

  private emitMetricFunctionDeclaration(resource: SpecName): void {
    this.code.line('/**');
    this.code.line(` * Return the given named metric for this ${resource.resourceName}`);
    this.code.line(' */');
    this.code.line('metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;');
  }

  private emitMetricFunction(className: string, metrics: schema.ResourceMetricAugmentations): void {
    this.code.line(`${className}.prototype.metric = function(metricName: string, props?: cloudwatch.MetricOptions) {`);
    this.code.line('  return new cloudwatch.Metric({');
    this.code.line(`    namespace: '${metrics.namespace}',`);
    this.code.line('    metricName,');

    const dimStrings = new Array<string>();
    for (const [key, field] of Object.entries(metrics.dimensions)) {
      dimStrings.push(`${key}: ${field}`);
    }

    this.code.line(`    dimensionsMap: { ${dimStrings.join(', ') } },`);
    this.code.line('    ...props');
    this.code.line('  }).attachTo(this);');
    this.code.line('};');
  }

  private emitSpecificMetricFunctionDeclaration(metric: schema.ResourceMetric): void {
    this.code.line('/**');
    this.code.line(` * ${metric.documentation}`);
    this.code.line(' *');
    this.code.line(` * ${metricStatistic(metric)} over 5 minutes`);
    this.code.line(' */');
    this.code.line(`metric${metricFunctionName(metric)}(props?: cloudwatch.MetricOptions): cloudwatch.Metric;`);
  }

  private emitSpecificMetricFunction(className: string, metric: schema.ResourceMetric): void {
    this.code.line(`${className}.prototype.metric${metricFunctionName(metric)} = function(props?: cloudwatch.MetricOptions) {`);
    this.code.line(`  return this.metric('${metric.name}', { statistic: '${metricStatistic(metric)}', ...props });`);
    this.code.line('};');
  }
}

function metricFunctionName(metric: schema.ResourceMetric): string {
  return metric.name.replace(/[^a-zA-Z0-9]/g, '');
}

function metricStatistic(metric: schema.ResourceMetric): string {
  switch (metric.type) {
    case schema.MetricType.Attrib:
    case undefined:
      return 'Average';

    case schema.MetricType.Count:
      return 'Sum';

    case schema.MetricType.Gauge:
      return 'Maximum';
  }
}
