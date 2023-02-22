// eslint-disable-next-line import/order
import * as MockAws from 'aws-sdk-mock';
import * as Mock from './mock';
MockAws.setSDK(require.resolve('aws-sdk'));

describe('template', () => {

  let oldConsoleLog: any;
  let logEnabled: boolean = false;

  beforeAll(() => {
    if (!logEnabled) {
      oldConsoleLog = global.console.log;
      global.console.log = jest.fn();
    }

    Mock.mockAws(MockAws);
  });

  afterAll(() => {
    if (!logEnabled) {
      global.console.log = oldConsoleLog;
    }

    MockAws.restore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fromId: source analysis', async () => {
    // GIVEN
    const provider = Mock.providers.template;

    // WHEN
    const result = await provider.getValue({
      account: '1234567890',
      region: 'us-east-1',
      templateId: Mock.SOURCE_ANALYSIS,
    });

    // THEN
    expect(result.templateId).toBe(Mock.SOURCE_ANALYSIS);
  });
});