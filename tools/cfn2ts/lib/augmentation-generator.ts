import cfnSpec = require('@aws-cdk/cfnspec');
import { schema } from '@aws-cdk/cfnspec';
import { CodeMaker } from 'codemaker';
import genspec = require('./genspec');
import { SpecName } from './spec-utils';

export class AugmentationGenerator {
  private readonly code = new CodeMaker();
  private readonly outputFile: string;

  constructor(moduleName: string, private readonly spec: schema.Specification, private readonly affix: string) {
    this.outputFile = `${moduleName}-augmentations.generated.ts`;
    this.code.openFile(this.outputFile);

    this.code.line(`// Copyright 2012-${new Date().getFullYear()} Amazon.com, Inc. or its affiliates. All Rights Reserved.`);
    this.code.line();
    this.code.line('// tslint:disable:max-line-length | This is generated code - line lengths are difficult to control');
  }

  public emitCode(): boolean {
    let hadAugmentations = false;
    for (const resourceTypeName of Object.keys(this.spec.ResourceTypes).sort()) {
      const aug = cfnSpec.resourceAugmentation(resourceTypeName);

      if (aug.metrics) {
        this.code.line('import cloudwatch = require("@aws-cdk/aws-cloudwatch");');
        this.emitMetricAugmentations(resourceTypeName, aug.metrics, aug.overrides);
        hadAugmentations = true;
      }
    }
    return hadAugmentations;
  }

  /**
   * Saves the generated file.
   */
  public async save(dir: string) {
    this.code.closeFile(this.outputFile);
    return await this.code.save(dir);
  }

  private emitMetricAugmentations(resourceTypeName: string, metrics: schema.ResourceMetricAugmentations, overrides?: schema.ResourceOverrides) {
    const cfnName = SpecName.parse(resourceTypeName);
    const resourceName = genspec.CodeName.forCfnResource(cfnName, this.affix);
    const l2ClassName = resourceName.className.replace(/^Cfn/, '');
    const kebabL2ClassName = l2ClassName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

    const baseClassName = (overrides && overrides.class) || l2ClassName + 'Base';
    const interfaceName = (overrides && overrides.interface) || 'I' + l2ClassName;
    const baseClassModule = `./${(overrides && overrides.module) || `${kebabL2ClassName}-base`}`;

    this.code.line(`import { ${baseClassName} } from "${baseClassModule}";`);

    this.code.openBlock(`declare module "${baseClassModule}"`);

    // Add to the interface
    this.code.openBlock(`interface ${interfaceName}`);
    this.emitMetricFunctionDeclaration(cfnName);
    for (const m of metrics.metrics) {
      this.emitSpecificMetricFunctionDeclaration(m);
    }
    this.code.closeBlock();

    // Add declaration to the base class (implementation added below)
    this.code.openBlock(`interface ${baseClassName}`);
    this.emitMetricFunctionDeclaration(cfnName);
    for (const m of metrics.metrics) {
      this.emitSpecificMetricFunctionDeclaration(m);
    }
    this.code.closeBlock();

    this.code.closeBlock();

    // Emit the monkey patches for all methods
    this.emitMetricFunction(baseClassName, metrics);
    for (const m of metrics.metrics) {
      this.emitSpecificMetricFunction(baseClassName, m);
    }
  }

  private emitMetricFunctionDeclaration(resource: SpecName) {
    this.code.line(`/**`);
    this.code.line(` * Return the given named metric for this ${resource.resourceName}`);
    this.code.line(` */`);
    this.code.line(`metric(metricName: string, props?: cloudwatch.MetricCustomization): cloudwatch.Metric;`);
  }

  private emitMetricFunction(className: string, metrics: schema.ResourceMetricAugmentations) {
    this.code.line(`${className}.prototype.metric = function(metricName: string, props?: cloudwatch.MetricCustomization) {`);
    this.code.line(`  return new cloudwatch.Metric({`);
    this.code.line(`    namespace: '${metrics.namespace}',`);
    this.code.line(`    metricName,`);

    const dimStrings = new Array<string>();
    for (const [key, field] of Object.entries(metrics.dimensions)) {
      dimStrings.push(`${key}: ${field}`);
    }

    this.code.line(`    dimensions: { ${dimStrings.join(', ') } },`);
    this.code.line(`    ...props`);
    this.code.line(`  });`);
    this.code.line('};');
  }

  private emitSpecificMetricFunctionDeclaration(metric: schema.ResourceMetric) {
    this.code.line(`/**`);
    this.code.line(` * ${metric.documentation}`);
    this.code.line(` *`);
    this.code.line(` * ${metricStatistic(metric)} over 5 minutes`);
    this.code.line(` */`);
    this.code.line(`metric${metricFunctionName(metric)}(props?: cloudwatch.MetricCustomization): cloudwatch.Metric;`);
  }

  private emitSpecificMetricFunction(className: string, metric: schema.ResourceMetric) {
    this.code.line(`${className}.prototype.metric${metricFunctionName(metric)} = function(props?: cloudwatch.MetricCustomization) {`);
    this.code.line(`  return this.metric('${metric.name}', { statistic: '${metricStatistic(metric)}', ...props });`);
    this.code.line('};');
  }
}

function metricFunctionName(metric: schema.ResourceMetric) {
  return metric.name.replace(/[^a-zA-Z0-9]/g, '');
}

function metricStatistic(metric: schema.ResourceMetric) {
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
