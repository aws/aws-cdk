import type { SpecDatabase } from '@aws-cdk/service-spec-types';
import { emptyDatabase } from '@aws-cdk/service-spec-types';
import { queryDb } from '../lib/util';

const PREFIXES = ['AWS::', 'Alexa::'];

let db: SpecDatabase;

beforeEach(() => {
  db = emptyDatabase();
  for (const [name, cloudFormationNamespace] of [['aws-some', 'AWS::Some'], ['alexa-ask', 'Alexa::ASK'], ['other-some', 'Other::Some']]) {
    const shortName = name.split('-')[1];
    db.allocate('service', {
      name,
      shortName,
      capitalized: shortName.charAt(0).toUpperCase() + shortName.slice(1),
      cloudFormationNamespace,
    });
  }
});

test('getAllServices returns only services with the given namespace prefixes', () => {
  expect(namespaces(queryDb.getAllServices(db, PREFIXES))).toEqual(['AWS::Some', 'Alexa::ASK']);
  expect(namespaces(queryDb.getAllServices(db, ['Other::']))).toEqual(['Other::Some']);
  expect(queryDb.getAllServices(db, [])).toEqual([]);
});

test('getAllServices returns all services without namespace prefixes', () => {
  expect(namespaces(queryDb.getAllServices(db))).toEqual(['AWS::Some', 'Alexa::ASK', 'Other::Some']);
});

test('getAllScopes returns only services with the given namespace prefixes', () => {
  expect(queryDb.getAllScopes(db, PREFIXES, 'cloudFormationNamespace').map((s) => s.namespace).sort()).toEqual(['AWS::Some', 'Alexa::ASK']);
});

test('getServicesByGenerateServiceRequest skips requested services without the given namespace prefixes', () => {
  const requests = [{ namespace: 'AWS::Some' }, { namespace: 'Other::Some' }];

  expect(queryDb.getServicesByGenerateServiceRequest(db, requests, PREFIXES).map(([req, s]) => [req.namespace, s.name])).toEqual([
    ['AWS::Some', 'aws-some'],
  ]);
});

test('getServicesByCloudFormationNamespace skips services without the given namespace prefixes', () => {
  expect(queryDb.getServicesByCloudFormationNamespace(db, ['Alexa::ASK', 'Other::Some'], PREFIXES).map((s) => s.name)).toEqual(['alexa-ask']);
});

test('a prefix matches up to the namespace separator', () => {
  db.allocate('service', { name: 'awsome-thing', shortName: 'thing', capitalized: 'Thing', cloudFormationNamespace: 'AWSome::Thing' });

  expect(namespaces(queryDb.getAllServices(db, PREFIXES))).not.toContain('AWSome::Thing');
});

function namespaces(services: Array<{ cloudFormationNamespace: string }>) {
  return services.map((s) => s.cloudFormationNamespace).sort();
}
