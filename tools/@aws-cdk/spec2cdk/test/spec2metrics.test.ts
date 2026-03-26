import type { Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import { emptyDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import { MetricsBuilder } from '../lib/spec2metrics';

const renderer = new TypeScriptRenderer();

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

test('generates metrics class with correct method names', () => {
  const ds = db.allocate('dimensionSet', {
    dedupKey: 'ds-fn',
    name: 'FunctionName',
    dimensions: [{ name: 'FunctionName' }],
  });
  const metric = db.allocate('metric', {
    namespace: 'AWS/Lambda',
    name: 'Invocations',
    statistic: 'Sum',
    dedupKey: 'm-inv',
  });
  db.link('serviceHasMetric', service, metric);
  db.link('usesDimensionSet', metric, ds);

  const builder = new MetricsBuilder({ db });
  const submodule = builder.addService(service);
  const rendered = renderer.render(submodule.metricsModule!);

  expect(rendered).toContain('class LambdaMetrics');
  expect(rendered).toContain('class FunctionNameMetrics');
  expect(rendered).toContain('metricInvocations');
});

test('account-wide metrics with empty dimensions', () => {
  const ds = db.allocate('dimensionSet', {
    dedupKey: 'ds-acct',
    name: '',
    dimensions: [],
  });
  const metric = db.allocate('metric', {
    namespace: 'AWS/Lambda',
    name: 'ConcurrentExecutions',
    statistic: 'Maximum',
    dedupKey: 'm-ce',
  });
  db.link('serviceHasMetric', service, metric);
  db.link('usesDimensionSet', metric, ds);

  const builder = new MetricsBuilder({ db });
  const submodule = builder.addService(service);
  const rendered = renderer.render(submodule.metricsModule!);

  expect(rendered).toContain('class AccountMetrics');
  expect(rendered).toContain('metricConcurrentExecutions');
});

test('factory method generation from resource', () => {
  const resource = db.allocate('resource', {
    name: 'Function',
    cloudFormationType: 'AWS::Lambda::Function',
    primaryIdentifier: ['FunctionName'],
    properties: { FunctionName: { type: { type: 'string' } } },
    attributes: {},
  });
  db.link('hasResource', service, resource);

  const ds = db.allocate('dimensionSet', {
    dedupKey: 'ds-fn',
    name: 'FunctionName',
    dimensions: [{ name: 'FunctionName' }],
  });
  const metric = db.allocate('metric', {
    namespace: 'AWS/Lambda',
    name: 'Invocations',
    statistic: 'Sum',
    dedupKey: 'm-inv',
  });
  db.link('serviceHasMetric', service, metric);
  db.link('usesDimensionSet', metric, ds);
  db.link('resourceHasDimensionSet', resource, ds);

  const builder = new MetricsBuilder({ db });
  const submodule = builder.addService(service);
  const rendered = renderer.render(submodule.metricsModule!);

  expect(rendered).toContain('fromFunction');
});

test('service with no metrics produces empty submodule', () => {
  const builder = new MetricsBuilder({ db });
  const submodule = builder.addService(service);

  expect(submodule.metricsModule).toBeUndefined();
});
