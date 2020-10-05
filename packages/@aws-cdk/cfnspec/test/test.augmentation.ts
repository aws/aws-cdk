import * as fs from 'fs';
import * as path from 'path';
import { Test } from 'nodeunit';
import * as cfnspec from '../lib';
import { MetricType } from '../lib/schema';

function resourceAugmentationTest(resource: string) {
  return (test: Test) => {
    const model = cfnspec.resourceAugmentation(resource);

    if (model.metrics) {
      test.ok(typeof(model.metrics.namespace) === 'string', `namespace is invalid: ${model.metrics.namespace}`);
      test.ok(typeof(model.metrics.dimensions) === 'object', `dimensions is invalid: ${model.metrics.dimensions}`);
      for (const metric of model.metrics.metrics) {
        test.ok(typeof metric.name === 'string', `name is invalid: ${metric.name}`);
        test.ok(typeof metric.documentation === 'string', `documentation is invalid: ${metric.documentation}`);
        test.ok(metric.type === undefined || [MetricType.Attrib, MetricType.Count, MetricType.Gauge].includes(metric.type),
          `Metric Type is invalid: ${metric.type}`);
      }
    }
    test.done();
  };
}

const files = fs.readdirSync(path.resolve(__dirname, '../lib/augmentations'));
for (const file of files) {
  const resource = file.replace(/\.json$/, '').replace(/_/g, '::');
  exports[`Validate augmentation schema for ${resource}`] = resourceAugmentationTest(resource);
}
