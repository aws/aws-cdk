import type { SpecDatabase } from '@aws-cdk/service-spec-types';
import { emptyDatabase } from '@aws-cdk/service-spec-types';
import { queryDb } from '../lib/util';

const ORGS = ['AWS', 'Alexa'];

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

test('getAllServices returns only services that belong to the given orgs', () => {
  expect(namespaces(queryDb.getAllServices(db, ORGS))).toEqual(['AWS::Some', 'Alexa::ASK']);
  expect(namespaces(queryDb.getAllServices(db, ['Other']))).toEqual(['Other::Some']);
  expect(queryDb.getAllServices(db, [])).toEqual([]);
});

test('getAllServices returns all services without orgs', () => {
  expect(namespaces(queryDb.getAllServices(db))).toEqual(['AWS::Some', 'Alexa::ASK', 'Other::Some']);
});

test('getAllScopes returns only services that belong to the given orgs', () => {
  expect(queryDb.getAllScopes(db, ORGS, 'cloudFormationNamespace').map((s) => s.namespace).sort()).toEqual(['AWS::Some', 'Alexa::ASK']);
});

test('getServicesByGenerateServiceRequest skips requested services that do not belong to the given orgs', () => {
  const requests = [{ namespace: 'AWS::Some' }, { namespace: 'Other::Some' }];

  expect(queryDb.getServicesByGenerateServiceRequest(db, requests, ORGS).map(([req, s]) => [req.namespace, s.name])).toEqual([
    ['AWS::Some', 'aws-some'],
  ]);
});

test('getServicesByGenerateServiceRequest returns all requested services without orgs', () => {
  const requests = [{ namespace: 'AWS::Some' }, { namespace: 'Other::Some' }];

  expect(queryDb.getServicesByGenerateServiceRequest(db, requests).map(([req, s]) => [req.namespace, s.name])).toEqual([
    ['AWS::Some', 'aws-some'],
    ['Other::Some', 'other-some'],
  ]);
});

test('getServicesByCloudFormationNamespace skips services that do not belong to the given orgs', () => {
  expect(queryDb.getServicesByCloudFormationNamespace(db, ['Alexa::ASK', 'Other::Some'], ORGS).map((s) => s.name)).toEqual(['alexa-ask']);
});

test('an org matches up to the namespace separator', () => {
  db.allocate('service', { name: 'awsome-thing', shortName: 'thing', capitalized: 'Thing', cloudFormationNamespace: 'AWSome::Thing' });

  expect(namespaces(queryDb.getAllServices(db, ORGS))).not.toContain('AWSome::Thing');
});

function namespaces(services: Array<{ cloudFormationNamespace: string }>) {
  return services.map((s) => s.cloudFormationNamespace).sort();
}
