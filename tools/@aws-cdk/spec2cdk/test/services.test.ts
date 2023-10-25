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

test('resource interface when primaryIdentifier is an attribute', () => {
  const service = db.lookup('service', 'name', 'equals', 'aws-voiceid').only();

  const ast = AstBuilder.forService(service, { db });

  const rendered = renderer.render(ast.module);

  expect(rendered).toContain([
    '/**',
    ' * Shared attributes for both `CfnDomain` and `Domain`.',
    ' *',
    ' * @struct',
    ' * @stability external',
    ' */',
    'export interface ICfnDomain {',
    '  /**',
    '   * The identifier of the domain.',
    '   *',
    '   * @cloudformationAttribute DomainId',
    '   */',
    '  readonly attrDomainId: string;',
    '}',
  ].join('\n'));
});

test('resource interface when primaryIdentifier is a property', () => {
  const service = db.lookup('service', 'name', 'equals', 'aws-kinesisanalyticsv2').only();

  const ast = AstBuilder.forService(service, { db });

  const rendered = renderer.render(ast.module);

  expect(rendered).toContain([
    '/**',
    ' * Shared attributes for both `CfnApplication` and `Application`.',
    ' *',
    ' * @struct',
    ' * @stability external',
    ' */',
    'export interface ICfnApplication {',
    '  /**',
    '   * The name of the application.',
    '   *',
    '   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalyticsv2-application.html#cfn-kinesisanalyticsv2-application-applicationname',
    '   */',
    '  readonly attrApplicationName?: string;', // optional?
    '}',
  ].join('\n'));
});

test('resource interface with multiple primaryIdentifiers', () => {
  const service = db.lookup('service', 'name', 'equals', 'aws-lakeformation').only();

  const ast = AstBuilder.forService(service, { db });

  const rendered = renderer.render(ast.module);

  expect(rendered).toContain([
    '/**',
    ' * Shared attributes for both `CfnDataCellsFilter` and `DataCellsFilter`.',
    ' *',
    ' * @struct',
    ' * @stability external',
    ' */',
    'export interface ICfnDataCellsFilter {',
    '  /**',
    '   * Catalog id string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .',
    '   *',
    '   * The ID of the catalog to which the table belongs.',
    '   *',
    '   * @cloudformationRef tableCatalogId',
    '   *',
    '   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-tablecatalogid',
    '   */',
    '  readonly attrTableCatalogId: string;',
    // '  /**',
    // '   * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .',
    // '   *',
    // '   * A database in the Data Catalog .',
    // '   *',
    // '   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-databasename',
    // '   */',
    // '  readonly attrDatabaseName: string;',
    // '  /**',
    // '   * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .',
    // '   *',
    // '   * A table in the database.',
    // '   *',
    // '   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-tablename',
    // '   */',
    // '  readonly attrTableName: string;',
    // '  /**',
    // '   * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .',
    // '   *',
    // '   * The name given by the user to the data filter cell.',
    // '   *',
    // '   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-name',
    // '   */',
    // '  readonly attrName: string;',
    // '}',
  ].join('\n'));
});
