import type { Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import { emptyDatabase } from '@aws-cdk/service-spec-types';
import { MetricsBuilder } from '../lib/spec2metrics';

let db: SpecDatabase;
let service: Service;

beforeEach(() => {
  db = emptyDatabase();
  service = db.allocate('service', {
    name: 'aws-lambda',
    shortName: 'lambda',
    capitalized: 'Lambda',
    cloudFormationNamespace: 'AWS::Lambda',
  });
});

test('throws when DimensionSets with the same name have divergent dimension lists', () => {
  const ds1 = db.allocate('dimensionSet', {
    dedupKey: 'ds1',
    name: 'FunctionName',
    dimensions: [{ name: 'FunctionName' }],
  });
  const ds2 = db.allocate('dimensionSet', {
    dedupKey: 'ds2',
    name: 'FunctionName',
    dimensions: [{ name: 'FunctionName' }, { name: 'Resource' }],
  });

  const metric1 = db.allocate('metric', {
    namespace: 'AWS/Lambda',
    name: 'Invocations',
    statistic: 'Sum',
    dedupKey: 'm1',
  });

  db.link('serviceHasMetric', service, metric1);
  db.link('usesDimensionSet', metric1, ds1);
  db.link('usesDimensionSet', metric1, ds2);

  const builder = new MetricsBuilder({ db });
  expect(() => builder.addService(service)).toThrow(/DimensionSets with name 'FunctionName' have divergent dimension lists/);
});
