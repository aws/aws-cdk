import type { Resource, Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import { emptyDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import type { MixinsBuilderProps } from '../../scripts/spec2mixins';
import { LogsDeliveryBuilder } from '../../scripts/spec2logs';

const renderer = new TypeScriptRenderer();
let db: SpecDatabase;
let service: Service;

beforeEach(async () => {
  db = emptyDatabase();

  service = db.allocate('service', {
    name: 'aws-some',
    shortName: 'some',
    capitalized: 'Some',
    cloudFormationNamespace: 'AWS::Some',
  });
});

test('Logs Delivery Mixin for a resource', () => {
  // GIVEN
  const resource = db.allocate('resource', {
    name: 'Thing',
    primaryIdentifier: ['Id'],
    properties: {
      Id: {
        type: { type: 'string' },
        documentation: 'The identifier of the resource',
      },
    },
    attributes: {
      ThingArn: {
        type: { type: 'string' },
        documentation: 'The arn for something',
      },
    },
    cloudFormationType: 'AWS::Some::Resource',
    arnTemplate: 'arn:${Partition}:some:${Region}:${Account}:resource/${ResourceId}',
    vendedLogs: {
      permissionsVersion: 'V2',
      logTypes: ['APPLICATION_LOGS', 'ACCESS_LOGS'],
      destinations: ['CWL', 'FH', 'S3'],
    },
  });
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const module = moduleForResource(foundResource, { db });

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

function moduleForResource(resource: Resource, props: MixinsBuilderProps) {
  const ast = new LogsDeliveryBuilder(props);
  const info = ast.addResource(resource);
  return info.locatedModules[0].module;
}
