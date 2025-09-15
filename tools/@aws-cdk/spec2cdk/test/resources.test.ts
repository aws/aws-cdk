import { Service, SpecDatabase, emptyDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import { AstBuilder } from '../lib/cdk/ast';

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

test('resource interface when primaryIdentifier is a property', () => {
  // GIVEN
  const resource = db.allocate('resource', {
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
  });
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const ast = AstBuilder.forResource(foundResource, { db });

  const rendered = renderer.render(ast.module);

  expect(rendered).toMatchSnapshot();
});

test('resource with optional primary identifier gets property from ref', () => {
  // GIVEN
  const resource = db.allocate('resource', {
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
  });
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const ast = AstBuilder.forResource(foundResource, { db });

  const rendered = renderer.render(ast.module);

  expect(rendered).toMatchSnapshot();
});

test('resource with multiple primaryIdentifiers as properties', () => {
  // GIVEN
  const resource = db.allocate('resource', {
    name: 'Resource',
    primaryIdentifier: ['Id', 'AnotherId'],
    attributes: {},
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
    cloudFormationType: 'AWS::Some::Resource',
  });
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const ast = AstBuilder.forResource(foundResource, { db });

  const rendered = renderer.render(ast.module);

  expect(rendered).toMatchSnapshot();
});

test('resource interface when primaryIdentifier is an attribute', () => {
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
    },
    cloudFormationType: 'AWS::Some::Resource',
  });
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const ast = AstBuilder.forResource(foundResource, { db });

  const rendered = renderer.render(ast.module);

  expect(rendered).toMatchSnapshot();
});

test('resource interface with multiple primaryIdentifiers', () => {
  // GIVEN
  const resource = db.allocate('resource', {
    name: 'Resource',
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
    cloudFormationType: 'AWS::Some::Resource',
  });
  db.link('hasResource', service, resource);

  // THEN
  const foundResource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::Some::Resource').only();

  const ast = AstBuilder.forResource(foundResource, { db });

  const rendered = renderer.render(ast.module);

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

  const ast = AstBuilder.forResource(foundResource, { db });

  const rendered = renderer.render(ast.module);

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

  const ast = AstBuilder.forResource(foundResource, { db });

  const rendered = renderer.render(ast.module);

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

  const ast = AstBuilder.forResource(foundResource, { db });

  const rendered = renderer.render(ast.module);

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

  const ast = AstBuilder.forResource(foundResource, { db });

  const rendered = renderer.render(ast.module);

  expect(rendered).toMatchSnapshot();
});
