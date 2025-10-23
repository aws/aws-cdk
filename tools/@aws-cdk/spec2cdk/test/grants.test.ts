import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import { SpecDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import { GrantsModule } from '../lib/cdk/grants-module';

const renderer = new TypeScriptRenderer();
let db: SpecDatabase;

beforeAll(async () => {
  db = await loadAwsServiceSpec();
});

test('generates grants for methods with and without key actions', async () => {
  const config =JSON.stringify({
    resources: {
      Topic: {
        hasResourcePolicy: true,
        grants: {
          publish: {
            actions: ['sns:Publish'],
            keyActions: ['kms:Decrypt', 'kms:GenerateDataKey*'],
          },
          subscribe: {
            actions: ['sns:Subscribe'],
          },
        },
      },
    },
  });
  const service = db.lookup('service', 'name', 'equals', 'aws-sns').only();
  const module = await GrantsModule.forServiceFromString(db, service, config);

  if (module == null) {
    throw new Error('No grants module generated');
  }

  const rendered = renderer.render(module);
  expect(rendered).toMatchSnapshot();
});
