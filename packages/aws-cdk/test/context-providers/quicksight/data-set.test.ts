// eslint-disable-next-line import/order
import * as Mock from './mock';

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

  test(`import a ${Mock.RELATIONAL_TABLE} ${Mock.PROJECT_OPERATION} data set`, async () => {
    // GIVEN
    const provider = Mock.providers.dataSet;

    // WHEN
    const result = await provider.getValue({
      account: '1234567890',
      region: 'us-east-1',
      dataSetId: Mock.DATA_SET_ID + '$' +
        Mock.RELATIONAL_TABLE + '$' +
        Mock.PROJECT_OPERATION,
    });
    // THEN
    expect(result.logicalTableMap?.PROJECT_OPERATION$2.alias).toBe('logicalTableMapAlias');

    let physicalTable: any = result.physicalTableMap?.RELATIONAL_TABLE$1?.relationalTable;
    expect(physicalTable.inputColumns[0].name).toBe('RelationalTableInputColumnName');

    let logicalTable: any = result.logicalTableMap?.PROJECT_OPERATION$2.dataTransforms;
    expect(logicalTable[0].projectOperation.projectedColumns[0]).toBe('ProjectedColumns');
  });
});