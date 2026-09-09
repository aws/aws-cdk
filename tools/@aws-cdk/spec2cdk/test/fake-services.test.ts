import type { Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import { emptyDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import { AwsCdkLibBuilder } from '../lib/cdk/aws-cdk-lib';

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

  const ast = new AwsCdkLibBuilder({ db });
  const info = ast.addService(service, { deprecated: 'in favour of something else' });

  const rendered = renderer.render(info.resourcesMod.module);
  expect(rendered).toMatchSnapshot();
});
