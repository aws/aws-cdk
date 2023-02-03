// eslint-disable-next-line import/order
import * as Mock from './mock';

jest.mock('aws-sdk', () => {
  return {
    QuickSight: jest.fn(() => Mock.mockQuickSight),
    config: { logger: '' },
  };
});

// eslint-disable-next-line import/order
import { Stack } from '@aws-cdk/core';
import { Dashboard, DataSet, Template } from '../lib';

describe('dashboard', () => {

  //let oldConsoleLog: any;

  beforeAll(() => {
    //oldConsoleLog = global.console.log;
    //global.console.log = jest.fn();
  });

  afterAll(() => {
    //global.console.log = oldConsoleLog;
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
    let dashboard = Dashboard.fromId(stack, 'ImportedDashboard', Mock.DASHBOARD_ID);

    // THEN
    expect(dashboard.resourceId).toBe(Mock.DASHBOARD_ID);
    expect(dashboard.dataSets[0].dataSetName).toBe('DataSetName');
    expect(dashboard.sourceTemplate?.templateName).toBe('TemplateName');
    expect(dashboard.theme?.themeName).toBe('ThemeName');
    expect(dashboard.dashboardName).toBe('DashboardName');
    expect(dashboard.permissions?.[0].principal).toBe('DashboardPermissionsPrincipal');
    expect(dashboard.tags?.[0].key).toBe('ResourceArn');
    expect(dashboard.versionDescription).toBe('Description');
  });

  test('fromId: no version description', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: 'us-east-1',
      },
    });

    // WHEN
    let dashboard = Dashboard.fromId(stack, 'ImportedDashboard', Mock.NO_VERSION_DESCRIPTION);

    // THEN
    expect(dashboard.resourceId).toBe(Mock.NO_VERSION_DESCRIPTION);
    expect(dashboard.versionDescription).toBe('');
  });

  test('new Dashboard from Template', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: 'us-east-1',
      },
    });

    // WHEN
    let template = Template.fromId(stack, 'ImportedTemplate', Mock.SOURCE_TEMPLATE);
    let dashboard = new Dashboard(stack, 'TestDashboard', {
      resourceId: 'TestId',
      dashboardName: 'TestName',
      sourceTemplate: template,
      versionDescription: 'TestVersionDescription',
    });

    // THEN
    expect(dashboard.resourceId).toBe('TestId');
    expect(dashboard.dashboardName).toBe('TestName');
    expect(dashboard.dashboardArn).toContain('arn');
  });

  test('new Dashboard from Template and DataSet', () => {
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

    let dashboard = new Dashboard(stack, 'TestDashboard', {
      resourceId: 'TestId',
      dashboardName: 'TestName',
      sourceTemplate: template,
      versionDescription: 'TestVersionDescription',
      dataSets: [dataSet],
    });

    // THEN
    expect(dashboard.resourceId).toBe('TestId');
    expect(dashboard.dataSets[0]).toBe(dataSet);
    expect(dashboard.dashboardArn).toContain('arn');
  });

  test('new Dashboard from Template and DataSet (invalid)', () => {
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
      new Dashboard(stack, 'TestDashboard', {
        resourceId: 'TestId',
        dashboardName: 'TestName',
        sourceTemplate: template,
        versionDescription: 'TestVersionDescription',
        dataSets: [dataSet, dataSet],
      });
    }).toThrow(Error); // TODO Make this a better error.
  });
});