import { Resource, Service, SpecDatabase, emptyDatabase } from '@aws-cdk/service-spec-types';
import { Plain } from '@cdklabs/tskb';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import { AstBuilder, AstBuilderProps } from '../lib/cdk/ast';

const renderer = new TypeScriptRenderer();
let db: SpecDatabase;
let service: Service;

const BASE_RESOURCE: Plain<Resource> = {
  name: 'Resource',
  primaryIdentifier: ['Id'],
  attributes: {},
  properties: {
    Id: {
      type: { type: 'string' },
      documentation: 'The identifier of the resource',
    },
  },
  cloudFormationType: 'AWS::Some::Resource',
};

beforeEach(async () => {
  db = emptyDatabase();

  service = db.allocate('service', {
    name: 'aws-some',
    shortName: 'some',
    capitalized: 'Some',
    cloudFormationNamespace: 'AWS::Some',
  });
});

test('resource interface when primaryIdentifier is a property', () => {
  // GIVEN
  const resource = db.allocate('resource', BASE_RESOURCE);
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const module = moduleForResource(foundResource, { db });

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

test('resource with arnTemplate', () => {
  // GIVEN
  const resource = db.allocate('resource', {
    ...BASE_RESOURCE,
    arnTemplate: 'arn:${Partition}:some:${Region}:${Account}:resource/${ResourceId}',
  });
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const module = moduleForResource(foundResource, { db });

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

test('resource with optional primary identifier gets property from ref', () => {
  // GIVEN
  const resource = db.allocate('resource', BASE_RESOURCE);
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const module = moduleForResource(foundResource, { db });

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

test('resource with multiple primaryIdentifiers as properties', () => {
  // GIVEN
  const resource = db.allocate('resource', {
    ...BASE_RESOURCE,
    primaryIdentifier: ['Id', 'AnotherId'],
    properties: {
      Id: {
        type: { type: 'string' },
        documentation: 'The identifier of the resource',
      },
      AnotherId: {
        type: { type: 'string' },
        documentation: 'Another identifier of the resource',
      },
    },
  });
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const module = moduleForResource(foundResource, { db });

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

test('resource interface when primaryIdentifier is an attribute', () => {
  // GIVEN
  const resource = db.allocate('resource', {
    ...BASE_RESOURCE,
    primaryIdentifier: ['Id'],
    properties: {},
    attributes: {
      Id: {
        type: { type: 'string' },
        documentation: 'The identifier of the resource',
      },
    },
  });
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const module = moduleForResource(foundResource, { db });

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

test('resource interface with multiple primaryIdentifiers', () => {
  // GIVEN
  const resource = db.allocate('resource', {
    ...BASE_RESOURCE,
    primaryIdentifier: ['Id', 'Another'],
    properties: {},
    attributes: {
      Id: {
        type: { type: 'string' },
        documentation: 'The identifier of the resource',
      },
      Another: {
        type: { type: 'string' },
        documentation: 'Another identifier of the resource',
      },
    },
  });
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const module = moduleForResource(foundResource, { db });

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

test('resource interface with "Arn"', () => {
  // GIVEN
  const resource = db.allocate('resource', {
    name: 'Resource',
    primaryIdentifier: ['Id'],
    properties: {},
    attributes: {
      Id: {
        type: { type: 'string' },
        documentation: 'The identifier of the resource',
      },
      Arn: {
        type: { type: 'string' },
        documentation: 'The arn for the resource',
      },
    },
    cloudFormationType: 'AWS::Some::Resource',
  });
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const module = moduleForResource(foundResource, { db });

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

test('resource interface with "<Resource>Arn"', () => {
  // GIVEN
  const resource = db.allocate('resource', {
    name: 'Something',
    primaryIdentifier: ['Id'],
    properties: {},
    attributes: {
      Id: {
        type: { type: 'string' },
        documentation: 'The identifier of the resource',
      },
      SomethingArn: {
        type: { type: 'string' },
        documentation: 'The arn for something',
      },
    },
    cloudFormationType: 'AWS::Some::Something',
  });
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Something').only();

  const module = moduleForResource(foundResource, { db });

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

test('resource interface with Arn as a property and not a primaryIdentifier', () => {
  // GIVEN
  const resource = db.allocate('resource', {
    name: 'Resource',
    primaryIdentifier: ['Id'],
    properties: {
      Arn: {
        type: { type: 'string' },
        documentation: 'The arn for the resource',
      },
    },
    attributes: {
      Id: {
        type: { type: 'string' },
        documentation: 'The identifier of the resource',
      },
    },
    cloudFormationType: 'AWS::Some::Resource',
  });
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const module = moduleForResource(foundResource, { db });

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

test('resource interface with Arn as primaryIdentifier', () => {
  // GIVEN
  const resource = db.allocate('resource', {
    name: 'Resource',
    primaryIdentifier: ['Arn'],
    properties: {},
    attributes: {
      Arn: {
        type: { type: 'string' },
        documentation: 'The arn of the resource',
      },
    },
    cloudFormationType: 'AWS::Some::Resource',
  });
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const module = moduleForResource(foundResource, { db });

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

test('can generate interface types into a separate module', () => {
  // GIVEN
  const resource = db.allocate('resource', BASE_RESOURCE);
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const ast = new AstBuilder({ db });
  const info = ast.addResource(foundResource);
  const rendered = {
    interfaces: renderer.render(info.interfaces.module),
    resources: renderer.render(info.resourcesMod.module),
  };

  expect(rendered.interfaces).toMatchSnapshot();
  expect(rendered.resources).toMatchSnapshot();
});

function moduleForResource(resource: Resource, props: AstBuilderProps) {
  const ast = new AstBuilder(props);
  const info = ast.addResource(resource);
  return info.resourcesMod.module;
}
