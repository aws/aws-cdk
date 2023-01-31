// eslint-disable-next-line import/order
import * as Mock from './mock';

jest.mock('aws-sdk', () => {
  return {
    QuickSight: jest.fn(() => Mock.mockQuickSight),
    config: { logger: '' },
  };
});

import { Stack } from '@aws-cdk/core';
import { CfnDataSet, DataSet } from '../lib';

// INTERFACE CHECKERS
function instanceOfGeoSpatialColumnGroupProperty(o: any): o is CfnDataSet.GeoSpatialColumnGroupProperty {
  return o == o;
}

describe('dataset', () => {

  let oldConsoleLog: any;

  beforeAll(() => {
    oldConsoleLog = global.console.log;
    global.console.log = jest.fn();
  });

  afterAll(() => {
    global.console.log = oldConsoleLog;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test(`import a ${Mock.RELATIONAL_TABLE} ${Mock.PROJECT_OPERATION} data set`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSet = DataSet.fromId(stack, 'ImportedDataSet',
      Mock.DATA_SET_ID + '$' +
      Mock.RELATIONAL_TABLE + '$' +
      Mock.PROJECT_OPERATION,
    ); // TODO

    // THEN
    expect(dataSet.logicalTableMap?.PROJECT_OPERATION$2.alias).toBe('logicalTableMapAlias');

    let physicalTable: any = dataSet.physicalTableMap?.RELATIONAL_TABLE$1?.relationalTable;
    expect(physicalTable.inputColumns[0].name).toBe('RelationalTableInputColumnName');

    let logicalTable: any = dataSet.logicalTableMap?.PROJECT_OPERATION$2.dataTransforms;
    expect(logicalTable[0].projectOperation.projectedColumns[0]).toBe('ProjectedColumns');
  });

  test(`import a ${Mock.RELATIONAL_TABLE} ${Mock.FILTER_OPERATION} data set`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSet = DataSet.fromId(stack, 'ImportedDataSet',
      Mock.DATA_SET_ID + '$' +
      Mock.RELATIONAL_TABLE + '$' +
      Mock.FILTER_OPERATION,
    ); // TODO

    // THEN
    expect(dataSet.logicalTableMap?.FILTER_OPERATION$2.alias).toBe('logicalTableMapAlias');

    let physicalTable: any = dataSet.physicalTableMap?.RELATIONAL_TABLE$1?.relationalTable;
    expect(physicalTable.inputColumns[0].name).toBe('RelationalTableInputColumnName');

    let logicalTable: any = dataSet.logicalTableMap?.FILTER_OPERATION$2.dataTransforms;
    expect(logicalTable[0].filterOperation.conditionExpression).toBe('ConditionExpression');
  });

  test(`import a ${Mock.CUSTOM_SQL} ${Mock.CREATE_COLUMNS_OPERATION} data set`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSet = DataSet.fromId(stack, 'ImportedDataSet',
      Mock.DATA_SET_ID + '$' +
      Mock.CUSTOM_SQL + '$' +
      Mock.CREATE_COLUMNS_OPERATION,
    ); // TODO

    // THEN
    expect(dataSet.logicalTableMap?.CREATE_COLUMNS_OPERATION$2.alias).toBe('logicalTableMapAlias');

    let physicalTable: any = dataSet.physicalTableMap?.CUSTOM_SQL$1?.customSql;
    expect(physicalTable.columns[0].name).toBe('CustomSqlName');

    let logicalTable: any = dataSet.logicalTableMap?.CREATE_COLUMNS_OPERATION$2.dataTransforms;
    expect(logicalTable[0].createColumnsOperation.columns[0].columnName).toBe('CreateColumnsOperationColumnName');
  });

  test(`import a ${Mock.S3_SOURCE} ${Mock.RENAME_COLUMN_OPERATION} data set`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSet = DataSet.fromId(stack, 'ImportedDataSet',
      Mock.DATA_SET_ID + '$' +
      Mock.S3_SOURCE + '$' +
      Mock.RENAME_COLUMN_OPERATION,
    ); // TODO

    // THEN
    expect(dataSet.logicalTableMap?.RENAME_COLUMN_OPERATION$2.alias).toBe('logicalTableMapAlias');

    let physicalTable: any = dataSet.physicalTableMap?.S3_SOURCE$1?.s3Source;
    expect(physicalTable.inputColumns[0].name).toBe('S3SourceInputColumnsName');

    let logicalTable: any = dataSet.logicalTableMap?.RENAME_COLUMN_OPERATION$2.dataTransforms;
    expect(logicalTable[0].renameColumnOperation.columnName).toBe('RenameColumnOperationColumnName');
  });

  test(`import a ${Mock.RELATIONAL_TABLE} ${Mock.CAST_COLUMN_TYPE_OPERATION} data set`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSet = DataSet.fromId(stack, 'ImportedDataSet',
      Mock.DATA_SET_ID + '$' +
      Mock.RELATIONAL_TABLE + '$' +
      Mock.CAST_COLUMN_TYPE_OPERATION,
    ); // TODO

    // THEN
    expect(dataSet.logicalTableMap?.CAST_COLUMN_TYPE_OPERATION$2.alias).toBe('logicalTableMapAlias');

    let physicalTable: any = dataSet.physicalTableMap?.RELATIONAL_TABLE$1?.relationalTable;
    expect(physicalTable.inputColumns[0].name).toBe('RelationalTableInputColumnName');

    let logicalTable: any = dataSet.logicalTableMap?.CAST_COLUMN_TYPE_OPERATION$2.dataTransforms;
    expect(logicalTable[0].castColumnTypeOperation.columnName).toBe('CastColumnTypeOperationColumnName');
  });

  test(`import a ${Mock.CUSTOM_SQL} ${Mock.TAG_COLUMN_OPERATION} data set`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSet = DataSet.fromId(stack, 'ImportedDataSet',
      Mock.DATA_SET_ID + '$' +
      Mock.CUSTOM_SQL + '$' +
      Mock.TAG_COLUMN_OPERATION,
    ); // TODO

    // THEN
    expect(dataSet.logicalTableMap?.TAG_COLUMN_OPERATION$2.alias).toBe('logicalTableMapAlias');

    let physicalTable: any = dataSet.physicalTableMap?.CUSTOM_SQL$1?.customSql;
    expect(physicalTable.columns[0].name).toBe('CustomSqlName');

    let logicalTable: any = dataSet.logicalTableMap?.TAG_COLUMN_OPERATION$2.dataTransforms;
    expect(logicalTable[0].tagColumnOperation.tags[0].columnDescription.text).toBe('Text');
  });

  test(`import a ${Mock.S3_SOURCE} ${Mock.UNTAG_COLUMN_OPERATION} data set`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSet = DataSet.fromId(stack, 'ImportedDataSet',
      Mock.DATA_SET_ID + '$' +
      Mock.S3_SOURCE + '$' +
      Mock.UNTAG_COLUMN_OPERATION,
    ); // TODO

    // THEN
    expect(dataSet.logicalTableMap?.UNTAG_COLUMN_OPERATION$2.alias).toBe('logicalTableMapAlias');

    let physicalTable: any = dataSet.physicalTableMap?.S3_SOURCE$1?.s3Source;
    expect(physicalTable.inputColumns[0].name).toBe('S3SourceInputColumnsName');

    let logicalTable: any = dataSet.logicalTableMap?.UNTAG_COLUMN_OPERATION$2.dataTransforms;
    expect(logicalTable[0].untagColumnOperation.tagNames[0]).toBe('TagNames');
  });

  test('fromId', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let resourceId: string = Mock.DATA_SET_ID + '$' + Mock.RELATIONAL_TABLE + '$' + Mock.PROJECT_OPERATION;
    let dataSet = DataSet.fromId(stack, 'ImportedDataSet', resourceId);

    // THEN
    expect(dataSet.resourceId).toBe(resourceId);
    expect(dataSet.permissions?.[0].principal).toBe('DataSetPermissionsPrincipal');
    expect(dataSet.tags?.[0].key).toBe('ResourceArn');
    if (instanceOfGeoSpatialColumnGroupProperty(dataSet.columnGroups?.[0].geoSpatialColumnGroup)) {
      expect(dataSet.columnGroups?.[0].geoSpatialColumnGroup.name).toBe('GeoSpatialColumnGroupName');
    }
    expect(dataSet.columnLevelPermissionRules?.[0].columnNames?.[0]).toBe('ColumnLevelPermissionRulesColumnNames');
    expect(dataSet.dataSetUsageConfiguration?.disableUseAsDirectQuerySource).toBeTruthy();
    expect(dataSet.fieldFolders?.fieldFolderName.description).toBe('FieldFolderDescription');
    expect(dataSet.importMode).toBe('ImportMode');
    expect(dataSet.rowLevelPermissionDataSet?.arn).toBe('RowLevelPermissionDataSetArn');
  });

  test('newDataSet', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSet = new DataSet(stack, 'TestId', {
      resourceId: 'TestId',
      dataSetName: 'TestName',
    });

    // THEN
    expect(dataSet.resourceId).toBe('TestId');
    expect(dataSet.dataSetArn).toContain('arn');
  });
});