// eslint-disable-next-line import/order
import * as Mock from './mock';

describe('dashboard', () => {

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