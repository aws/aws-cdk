import * as path from 'path';
import * as mockfs from 'mock-fs';
import { IntegTestSuite, LegacyIntegTestSuite } from '../../lib/runner/integ-test-suite';
import { MockCdkMocks, MockCdkProvider } from '../helpers';

describe('Integration test cases', () => {
  const testsFile = '/tmp/foo/bar/does/not/exist/integ.json';
  afterEach(() => {
    mockfs.restore();
  });

  test('basic manifest', () => {
    // GIVEN
    mockfs({
      [testsFile]: JSON.stringify({
        version: 'v1.0.0',
        testCases: {
          test1: {
            stacks: [
              'test-stack',
            ],
          },
        },
      }),
    });
    // WHEN
    const testCases = IntegTestSuite.fromPath(path.dirname(testsFile));

    // THEN
    expect(testCases.enableLookups).toEqual(false);
    expect(testCases.getStacksWithoutUpdateWorkflow().length).toEqual(0);
    expect(testCases.testSuite).toEqual({
      test1: {
        stacks: [
          'test-stack',
        ],
      },
    });
  });

  test('manifest with non defaults', () => {
    // GIVEN
    mockfs({
      [testsFile]: JSON.stringify({
        version: 'v1.0.0',
        enableLookups: true,
        testCases: {
          test1: {
            stackUpdateWorkflow: false,
            diffAssets: true,
            allowDestroy: ['AWS::IAM::Role'],
            stacks: [
              'test-stack',
            ],
          },
        },
      }),
    });
    // WHEN
    const testCases = IntegTestSuite.fromPath(path.dirname(testsFile));

    // THEN
    expect(testCases.enableLookups).toEqual(true);
    expect(testCases.getStacksWithoutUpdateWorkflow().length).toEqual(1);
    expect(testCases.testSuite).toEqual({
      test1: {
        stackUpdateWorkflow: false,
        diffAssets: true,
        allowDestroy: ['AWS::IAM::Role'],
        stacks: [
          'test-stack',
        ],
      },
    });
  });

  test('get options for stack', () => {
    // GIVEN
    mockfs({
      [testsFile]: JSON.stringify({
        version: 'v1.0.0',
        enableLookups: true,
        testCases: {
          test1: {
            stackUpdateWorkflow: false,
            diffAssets: true,
            allowDestroy: ['AWS::IAM::Role'],
            stacks: [
              'test-stack1',
            ],
          },
          test2: {
            diffAssets: false,
            stacks: [
              'test-stack2',
            ],
          },
        },
      }),
    });
    // WHEN
    const testCases = IntegTestSuite.fromPath(path.dirname(testsFile));

    // THEN
    expect(testCases.getOptionsForStack('test-stack1')).toEqual({
      diffAssets: true,
      regions: undefined,
      hooks: undefined,
      cdkCommandOptions: undefined,
      stackUpdateWorkflow: false,
      allowDestroy: ['AWS::IAM::Role'],
    });
    expect(testCases.getOptionsForStack('test-stack2')).toEqual({
      diffAssets: false,
      allowDestroy: undefined,
      regions: undefined,
      hooks: undefined,
      stackUpdateWorkflow: true,
      cdkCommandOptions: undefined,
    });
    expect(testCases.getOptionsForStack('test-stack-does-not-exist')).toBeUndefined();
  });
});

describe('Legacy Integration test cases', () => {
  let cdkMock: MockCdkProvider;
  let listMock: MockCdkMocks['list'];
  const testsFile = '/tmp/foo/bar/does/not/exist/integ.test.js';
  beforeEach(() => {
    cdkMock = new MockCdkProvider({ directory: 'test/test-data' });
  });

  afterEach(() => {
    mockfs.restore();
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('basic manifest', () => {
    // GIVEN
    mockfs({
      [testsFile]: '/// !cdk-integ test-stack',
    });
    listMock = jest.fn().mockImplementation(() => {
      return 'stackabc';
    });
    cdkMock.mockList(listMock);

    // WHEN
    const testCases = LegacyIntegTestSuite.fromLegacy({
      cdk: cdkMock.cdk,
      testName: 'test',
      listOptions: {},
      integSourceFilePath: testsFile,
    });

    // THEN
    expect(listMock).not.toHaveBeenCalled();
    expect(testCases.enableLookups).toEqual(false);
    expect(testCases.getStacksWithoutUpdateWorkflow().length).toEqual(0);
    expect(testCases.testSuite).toEqual({
      test: {
        stackUpdateWorkflow: true,
        diffAssets: false,
        stacks: [
          'test-stack',
        ],
      },
    });
  });

  test('manifest with pragma', () => {
    // GIVEN
    mockfs({
      [testsFile]: '/// !cdk-integ test-stack pragma:enable-lookups pragma:disable-update-workflow pragma:include-assets-hashes',
    });
    listMock = jest.fn().mockImplementation(() => {
      return 'stackabc';
    });
    cdkMock.mockList(listMock);

    // WHEN
    const testCases = LegacyIntegTestSuite.fromLegacy({
      cdk: cdkMock.cdk,
      testName: 'test',
      listOptions: {},
      integSourceFilePath: testsFile,
    });

    // THEN
    expect(listMock).not.toHaveBeenCalled();
    expect(testCases.enableLookups).toEqual(true);
    expect(testCases.getStacksWithoutUpdateWorkflow().length).toEqual(1);
    expect(testCases.testSuite).toEqual({
      test: {
        stackUpdateWorkflow: false,
        diffAssets: true,
        stacks: [
          'test-stack',
        ],
      },
    });
  });

  test('manifest with no pragma', () => {
    // GIVEN
    mockfs({
      [testsFile]: '',
    });
    listMock = jest.fn().mockImplementation(() => {
      return 'stackabc';
    });
    cdkMock.mockList(listMock);

    // WHEN
    const testCases = LegacyIntegTestSuite.fromLegacy({
      cdk: cdkMock.cdk,
      testName: 'test',
      listOptions: {},
      integSourceFilePath: testsFile,
    });

    // THEN
    expect(listMock).toHaveBeenCalled();
    expect(testCases.enableLookups).toEqual(false);
    expect(testCases.getStacksWithoutUpdateWorkflow().length).toEqual(0);
    expect(testCases.testSuite).toEqual({
      test: {
        stackUpdateWorkflow: true,
        diffAssets: false,
        stacks: [
          'stackabc',
        ],
      },
    });
  });

  test('manifest with no pragma and multiple stack throws', () => {
    // GIVEN
    mockfs({
      [testsFile]: '',
    });
    listMock = jest.fn().mockImplementation(() => {
      return 'stack1\nstack2';
    });
    cdkMock.mockList(listMock);

    // THEN
    expect(() => {
      LegacyIntegTestSuite.fromLegacy({
        cdk: cdkMock.cdk,
        testName: 'test',
        listOptions: {},
        integSourceFilePath: testsFile,
      });
    }).toThrow();
  });

  test('can get context from pragma', () => {
    // GIVEN
    mockfs({
      [testsFile]: '/// !cdk-integ test-stack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true',
    });

    // WHEN
    const context = LegacyIntegTestSuite.getPragmaContext(testsFile);

    //THEN
    expect(context).toEqual({
      '@aws-cdk/core:newStyleStackSynthesis': 'true',
    });

  });

  test('invalid pragma context throws', () => {
    // GIVEN
    mockfs({
      [testsFile]: '/// !cdk-integ test-stack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis true',
    });

    // WHEN
    expect(() => {
      LegacyIntegTestSuite.getPragmaContext(testsFile);
    }).toThrow();
  });
});
