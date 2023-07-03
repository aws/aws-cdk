import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import { SpecDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import { AstBuilder } from '../lib/cdk/ast';

const renderer = new TypeScriptRenderer();
let db: SpecDatabase;

beforeAll(async () => {
  db = await loadAwsServiceSpec();
});

const SNAPSHOT_SERVICES = ['alexa-ask', 'aws-chatbot', 'aws-scheduler', 'aws-sqs', 'aws-sam', 'aws-ec2', 'aws-omics'];

test.each(SNAPSHOT_SERVICES)('%s', (serviceName) => {
  const service = db.lookup('service', 'name', 'equals', serviceName).only();

  const ast = AstBuilder.forService(service, { db });

  const rendered = {
    module: renderer.render(ast.module),
    augmentations: ast.augmentations?.hasAugmentations ? renderer.render(ast.augmentations) : undefined,
    metrics: ast.cannedMetrics?.hasCannedMetrics ? renderer.render(ast.cannedMetrics) : undefined,
  };

  expect(rendered).toMatchSnapshot();
});

test('can codegen service with arbitrary suffix', () => {
  const service = db.lookup('service', 'name', 'equals', 'aws-kinesisanalyticsv2').only();

  const ast = AstBuilder.forService(service, { db, nameSuffix: 'V2' });

  const rendered = renderer.render(ast.module);

  expect(rendered).toMatchSnapshot();
  expect(rendered).toContain('class CfnApplicationV2');
  expect(rendered).toContain('namespace CfnApplicationV2');
  expect(rendered).toContain('interface CfnApplicationV2Props');
  expect(rendered).toContain('function convertCfnApplicationV2PropsToCloudFormation');
  expect(rendered).toContain('function CfnApplicationV2ApplicationCodeConfigurationPropertyValidator');
});
