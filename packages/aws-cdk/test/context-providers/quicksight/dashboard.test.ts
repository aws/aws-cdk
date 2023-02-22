// eslint-disable-next-line import/order
import * as MockAws from 'aws-sdk-mock';
import * as Mock from './mock';
MockAws.setSDK(require.resolve('aws-sdk'));

describe('dashboard', () => {

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

  test('fromId', async () => {
    // GIVEN
    const provider = Mock.providers.dashboard;

    // WHEN
    const result = await provider.getValue({
      account: '1234567890',
      region: 'us-east-1',
      dashboardId: Mock.DASHBOARD_ID,
    });

    // THEN
    expect(result.dashboardId).toBe(Mock.DASHBOARD_ID);
  });
});