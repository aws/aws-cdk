import * as fs from 'fs';
import * as path from 'path';
import * as cfnspec from '../lib';
import { MetricType } from '../lib/schema';

function resourceAugmentationTest(resource: string) {
  return () => {
    const model = cfnspec.resourceAugmentation(resource);

    if (model.metrics) {
      expect(typeof(model.metrics.namespace) === 'string').toBeTruthy();
      expect(typeof(model.metrics.dimensions) === 'object').toBeTruthy();
      for (const metric of model.metrics.metrics) {
        expect(typeof metric.name === 'string').toBeTruthy();
        expect(typeof metric.documentation === 'string').toBeTruthy();
        expect(metric.type === undefined || [MetricType.Attrib, MetricType.Count, MetricType.Gauge].includes(metric.type)).toBeTruthy();
      }
    }
  };
}

const files = fs.readdirSync(path.resolve(__dirname, '../lib/augmentations'));
for (const file of files) {
  const resource = file.replace(/\.json$/, '').replace(/_/g, '::');
  test(`Validate augmentation schema for ${resource}`, resourceAugmentationTest(resource));
}
