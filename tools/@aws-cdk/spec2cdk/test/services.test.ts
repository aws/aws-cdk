import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import { SpecDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import { AstBuilder } from '../lib/cdk/ast';

const renderer = new TypeScriptRenderer();
let db: SpecDatabase;

beforeAll(async () => {
  db = await loadAwsServiceSpec();
});

test('can codegen service with arbitrary suffix', () => {
  const service = db.lookup('service', 'name', 'equals', 'aws-kinesisanalyticsv2').only();

  const ast = AstBuilder.forService(service, { db, nameSuffix: 'V2' });

  const rendered = renderer.render(ast.module);

  // Snapshot tests will fail every time the docs get updated
  // expect(rendered).toMatchSnapshot();
  expect(rendered).toContain('class CfnApplicationV2');
  expect(rendered).toContain('namespace CfnApplicationV2');
  expect(rendered).toContain('interface CfnApplicationV2Props');
  expect(rendered).toContain('function convertCfnApplicationV2PropsToCloudFormation');
  expect(rendered).toContain('function CfnApplicationV2ApplicationCodeConfigurationPropertyValidator');
});
