import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import type { SpecDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import { AwsCdkLibBuilder } from '../lib/cdk/aws-cdk-lib';

const renderer = new TypeScriptRenderer();
let db: SpecDatabase;

beforeAll(async () => {
  db = await loadAwsServiceSpec();
});

test('can codegen service with arbitrary suffix', () => {
  const service = db.lookup('service', 'name', 'equals', 'aws-kinesisanalyticsv2').only();

  const module = new AwsCdkLibBuilder({ db }).addService(service, { nameSuffix: 'V2' }).resourcesMod.module;

  const rendered = renderer.render(module);

  // Snapshot tests will fail every time the docs get updated
  // expect(rendered).toMatchSnapshot();
  expect(rendered).toContain('class CfnApplicationV2');
  expect(rendered).toContain('namespace CfnApplicationV2');
  expect(rendered).toContain('interface CfnApplicationV2Props');
  expect(rendered).toContain('function convertCfnApplicationV2PropsToCloudFormation');
  expect(rendered).toContain('function CfnApplicationV2ApplicationCodeConfigurationPropertyValidator');
});
