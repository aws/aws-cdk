// eslint-disable-next-line import/order
import * as Mock from './mock';

// eslint-disable-next-line import/order
import { Stack, ContextProvider } from '@aws-cdk/core';
import { Analysis, DataSet, Template } from '../lib';

ContextProvider.getValue = Mock.mockGetValue;

describe('analysis', () => {

  let oldConsoleLog: any;
  let logEnabled: boolean = true;

  beforeAll(() => {
    if (!logEnabled) {
      oldConsoleLog = global.console.log;
      global.console.log = jest.fn();
    }
  });

  afterAll(() => {
    if (!logEnabled) {
      global.console.log = oldConsoleLog;
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fromId', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: 'us-east-1',
      },
    });

    // WHEN
    let analysis = Analysis.fromId(stack, 'ImportedAnalysis', Mock.ANALYSIS_ID);

    // THEN
    expect(analysis.resourceId).toBe(Mock.ANALYSIS_ID);
    expect(analysis.theme?.themeName).toBe('ThemeName');
    expect(analysis.dataSets[0].dataSetName).toBe('DataSetName');
    expect(analysis.permissions?.[0].principal).toBe('AnalysisPermissionsPrincipal');
    expect(analysis.tags?.[0].key).toBe('ResourceArn');
  });

  test('new Analysis from Template', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: 'us-east-1',
      },
    });

    // WHEN
    let template = Template.fromId(stack, 'ImportedTemplate', Mock.SOURCE_TEMPLATE);
    let analysis = new Analysis(stack, 'TestAnalysis', {
      resourceId: 'TestId',
      analysisName: 'TestName',
      sourceTemplate: template,
    });

    // THEN
    expect(analysis.resourceId).toBe('TestId');
    expect(analysis.analysisName).toBe('TestName');
    expect(analysis.analysisArn).toContain('arn');
  });

  test('new Analysis from Template and DataSet', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: 'us-east-1',
      },
    });

    // WHEN
    let template = Template.fromId(stack, 'ImportedTemplate', Mock.SOURCE_TEMPLATE);
    let dataSet = DataSet.fromId(stack, 'ImportedDataSet',
      Mock.DATA_SET_ID + '$' +
      Mock.RELATIONAL_TABLE + '$' +
      Mock.PROJECT_OPERATION,
    );

    let analysis = new Analysis(stack, 'TestAnalysis', {
      resourceId: 'TestId',
      analysisName: 'TestName',
      sourceTemplate: template,
      dataSets: [dataSet],
    });

    // THEN
    expect(analysis.resourceId).toBe('TestId');
    expect(analysis.dataSets[0]).toBe(dataSet);
    expect(analysis.analysisArn).toContain('arn');
  });

  test('new Analysis from Template and DataSet (invalid)', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: 'us-east-1',
      },
    });

    // WHEN
    let template = Template.fromId(stack, 'ImportedTemplate', Mock.SOURCE_TEMPLATE);
    let dataSet = DataSet.fromId(stack, 'ImportedDataSet',
      Mock.DATA_SET_ID + '$' +
      Mock.RELATIONAL_TABLE + '$' +
      Mock.PROJECT_OPERATION,
    );

    // THEN
    expect(() => {
      new Analysis(stack, 'TestAnalysis', {
        resourceId: 'TestId',
        analysisName: 'TestName',
        sourceTemplate: template,
        dataSets: [dataSet, dataSet],
      });
    }).toThrow(Error); // TODO Make this a better error.
  });

  test('resource not found', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: Mock.NOT_FOUND,
      },
    });

    // THEN
    expect(() => {
      Analysis.fromId(stack, 'ImportedAnalysis', 'test');
    }).toThrow(Error(`No Analysis found in account 0123456789 and region ${Mock.NOT_FOUND} with id test`)); // TODO Make this a better error.
  });

  test('no permissions', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: Mock.NO_PERMISSIONS,
      },
    });

    // WHEN
    let analysis = Analysis.fromId(stack, 'ImportedAnalysis', 'test');

    // THEN
    expect(analysis.permissions?.length).toBe(0);
  });
});