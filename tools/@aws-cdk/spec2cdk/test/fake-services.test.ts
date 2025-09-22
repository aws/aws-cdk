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

test('can codegen deprecated service', () => {
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

  const ast = AstBuilder.forService(service, { db, deprecated: 'in favour of something else' });

  const rendered = renderer.render(ast.module);
  expect(rendered).toMatchSnapshot();
});
