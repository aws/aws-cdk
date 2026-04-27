import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import type { SpecDatabase } from '@aws-cdk/service-spec-types';
import type { StructType } from '@cdklabs/typewriter';
import { InterfaceType, Module, Stability, TypeScriptRenderer } from '@cdklabs/typewriter';
import { CDK_INTERFACES_ENVIRONMENT_AWARE, CONSTRUCTS } from '../lib/cdk/cdk';
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
  const module = new GrantsModule(service, db, config, 'aws-cdk-lib/aws-iam', true);
  const scope = new Module('@aws-cdk/aws-sns');
  const refInterface = new InterfaceType(scope, {
    export: true,
    name: 'ITopicRef',
    extends: [CONSTRUCTS.IConstruct, CDK_INTERFACES_ENVIRONMENT_AWARE.IEnvironmentAware],
    docs: {
      summary: 'Indicates that this resource can be referenced',
      stability: Stability.Experimental,
    },
  });

  module.build({
    'AWS::SNS::Topic': {
      hasArnGetter: true,
      ref: {
        interfaceType: refInterface.type,
        property: refInterface.properties[0],
        struct: {} as unknown as StructType,
      },
    },
  });

  const rendered = renderer.render(module);
  expect(rendered).toMatchSnapshot();
});
