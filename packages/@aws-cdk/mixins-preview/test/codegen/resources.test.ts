import type { Resource, Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import { emptyDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import { ref } from '@cdklabs/tskb';
import type { MixinsBuilderProps } from '../../scripts/spec2mixins';
import { MixinsBuilder } from '../../scripts/spec2mixins';

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

test('L1 property mixin for a standard-issue resource', () => {
  // GIVEN
  const type = db.allocate('typeDefinition', {
    name: 'ResourceConfig',
    properties: {
      Foo: {
        type: { type: 'string' },
        required: true,
      },
      Bar: {
        type: { type: 'boolean' },
      },
    },
  });
  const resource = db.allocate('resource', {
    name: 'Thing',
    primaryIdentifier: ['Id'],
    properties: {
      Id: {
        type: { type: 'string' },
        documentation: 'The identifier of the resource',
      },
      ExternalId: {
        type: { type: 'string' },
        documentation: 'An external Id',
      },
      Config: {
        type: { type: 'ref', reference: ref(type) },
        required: true,
      },
    },
    attributes: {
      SomethingArn: {
        type: { type: 'string' },
        documentation: 'The arn for something',
      },
    },
    cloudFormationType: 'AWS::Some::Resource',
    arnTemplate: 'arn:${Partition}:some:${Region}:${Account}:resource/${ResourceId}',
  });
  db.link('hasResource', service, resource);
  db.link('usesType', resource, type);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const module = moduleForResource(foundResource, { db });

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

function moduleForResource(resource: Resource, props: MixinsBuilderProps) {
  const ast = new MixinsBuilder(props);
  const info = ast.addResource(resource);
  return info.locatedModules[0].module;
}
