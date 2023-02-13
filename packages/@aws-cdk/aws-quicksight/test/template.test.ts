// eslint-disable-next-line import/order
import * as Mock from './mock';

// eslint-disable-next-line import/order
import { Stack, ContextProvider } from '@aws-cdk/core';
import { Analysis, IAnalysis, ITemplate, Template } from '../lib';

ContextProvider.getValue = Mock.mockGetValue;

// INTERFACE CHECKERS
function instanceOfITemplate(o: any): o is ITemplate {
  return o == o;
}

function instanceOfIAnalysis(o: any): o is IAnalysis {
  return o == o;
}

describe('template', () => {

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

  test('fromId: source analysis', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: 'us-east-1',
      },
    });

    // WHEN
    let template = Template.fromId(stack, 'ImportedTemplate', Mock.SOURCE_ANALYSIS);

    // THEN
    expect(instanceOfIAnalysis(template.sourceEntity)).toBeTruthy();
    if (instanceOfIAnalysis(template.sourceEntity)) {
      expect(template.sourceEntity.analysisName).toBe('AnalysisName');
    }
    expect(template.permissions?.[0].principal).toBe('TemplatePermissionsPrincipal');
    expect(template.tags?.[0].key).toBe('ResourceArn');
    expect(template.versionDescription).toBe('Description');
  });

  test('fromId: source template', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: 'us-east-1',
      },
    });

    // WHEN
    let template = Template.fromId(stack, 'ImportedTemplate', Mock.SOURCE_TEMPLATE);

    // THEN
    expect(instanceOfITemplate(template.sourceEntity)).toBeTruthy();
    if (instanceOfITemplate(template.sourceEntity)) {
      expect(template.sourceEntity.templateName).toBe('TemplateName');
    }

    expect(template.resourceId).toBe(Mock.SOURCE_TEMPLATE);
  });

  test('new Template from Analysis', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: 'us-east-1',
      },
    });

    // WHEN
    let analysis = Analysis.fromId(stack, 'ImportedAnalysis', Mock.ANALYSIS_ID);
    let template = new Template(stack, 'TestId', {
      resourceId: 'TestId',
      templateName: 'TestName',
      sourceAnalysis: analysis,
      versionDescription: 'Description',
    });

    // THEN
    expect(template.resourceId).toBe('TestId');
    expect(template.templateArn).toContain('arn');
  });

  test('new Template from Template', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: 'us-east-1',
      },
    });

    // WHEN
    let importedTemplate = Template.fromId(stack, 'ImportedTemplate', Mock.SOURCE_TEMPLATE);
    let template = new Template(stack, 'TestId', {
      resourceId: 'TestId',
      templateName: 'TestName',
      sourceTemplate: importedTemplate,
    });

    // THEN
    expect(template.resourceId).toBe('TestId');
    expect(template.templateArn).toContain('arn');
  });

  test('new Template from nothing', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: 'us-east-1',
      },
    });

    // WHEN
    // THEN
    expect(() => {
      new Template(stack, 'TestId', {
        resourceId: 'TestId',
        templateName: 'TestName',
      });
    }).toThrow(Error); // TODO Make this a better error.;
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
      Template.fromId(stack, 'ImportedTemplate', 'test');
    }).toThrow(Error); // TODO Make this a better error.
  });
});