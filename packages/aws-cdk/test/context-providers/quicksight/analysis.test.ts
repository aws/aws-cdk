// eslint-disable-next-line import/order
import * as Mock from './mock';

describe('analysis', () => {

  let oldConsoleLog: any;
  let logEnabled: boolean = false;

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

  test('fromId', async () => {
    // GIVEN
    const provider = Mock.providers.analysis;

    // WHEN
    const result = await provider.getValue({
      account: '1234567890',
      region: 'us-east-1',
      analysisId: Mock.ANALYSIS_ID,
    });

    // THEN
    expect(result.analysisId).toBe(Mock.ANALYSIS_ID);
  });
});