import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import { SpecDatabase } from '@aws-cdk/service-spec-types';
import { InterfaceType, Module, Stability, TypeScriptRenderer } from '@cdklabs/typewriter';
import { CDK_CORE, CONSTRUCTS } from '../lib/cdk/cdk';
import { GrantsModule } from '../lib/cdk/grants-module';

const renderer = new TypeScriptRenderer();
let db: SpecDatabase;

beforeAll(async () => {
  db = await loadAwsServiceSpec();
});

test('generates grants for methods with and without key actions', async () => {
  const config = {
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
  };
  const service = db.lookup('service', 'name', 'equals', 'aws-sns').only();
  const module = new GrantsModule(service, db, config);

  const scope = new Module('@aws-cdk/aws-sns');
  const refInterface = new InterfaceType(scope, {
    export: true,
    name: 'ITopicRef',
    extends: [CONSTRUCTS.IConstruct, CDK_CORE.IEnvironmentAware],
    docs: {
      summary: 'Indicates that this resource can be referenced',
      stability: Stability.Experimental,
    },
  });

  module.build({
    'AWS::SNS::Topic': {
      hasArnGetter: true,
      refInterface: refInterface,
    },
  });

  const rendered = renderer.render(module);
  expect(rendered).toMatchSnapshot();
});
