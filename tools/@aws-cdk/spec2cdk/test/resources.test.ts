import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import { SpecDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import { AstBuilder } from '../lib/cdk/ast';

const renderer = new TypeScriptRenderer();
let db: SpecDatabase;

beforeAll(async () => {
  db = await loadAwsServiceSpec();
});

test('resource interface when primaryIdentifier is an attribute', () => {
  const resource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::VoiceID::Domain').only();

  const ast = AstBuilder.forResource(resource, { db });

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
  const resource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::KinesisAnalyticsV2::Application').only();

  const ast = AstBuilder.forResource(resource, { db });

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
  const resource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::LakeFormation::DataCellsFilter').only();

  const ast = AstBuilder.forResource(resource, { db });

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

test('resource interface with "Arn"', () => {
  const resource = db.lookup('resource', 'cloudFormationType', 'equals', 'AWS::S3::Bucket').only();

  const ast = AstBuilder.forResource(resource, { db });

  const rendered = renderer.render(ast.module);

  expect(rendered).toContain([
    '/**',
    ' * Shared attributes for both `CfnBucket` and `Bucket`.',
    ' *',
    ' * @struct',
    ' * @stability external',
    ' */',
    'export interface ICfnBucket {',
    '  /**',
    '   * A name for the bucket.',
    '   *',
    '   * If you don\'t specify a name, AWS CloudFormation generates a unique ID and uses that ID for the bucket name. The bucket name must contain only lowercase letters, numbers, periods (.), and dashes (-) and must follow [Amazon S3 bucket restrictions and limitations](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html) . For more information, see [Rules for naming Amazon S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html#bucketnamingrules) in the *Amazon S3 User Guide* .',
    '   *',
    '   * > If you specify a name, you can\'t perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you need to replace the resource, specify a new name.',
    '   *',
    '   * @cloudformationRef bucketName',
    '   *',
    '   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-bucketname',
    '   */',
    '  readonly attrBucketName?: string;',
    // '  /**',
    // '   * Returns the Amazon Resource Name (ARN) of the specified bucket.',
    // '   *',
    // '   * Example: `arn:aws:s3:::DOC-EXAMPLE-BUCKET`',
    // '   *',
    // '   * @cloudformationAttribute Arn',
    // '   */',
    // '   readonly attrArn: string;',
    // '}',
  ].join('\n'));
});

// TODO: test with ResourceArn and <Resource>Arn too