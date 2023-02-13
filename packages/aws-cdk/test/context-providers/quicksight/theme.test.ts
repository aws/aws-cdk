// eslint-disable-next-line import/order
import * as Mock from './mock';

describe('analysis', () => {

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

  test('fromId: Custom Theme', async () => {
    // GIVEN
    const provider = Mock.providers.theme;

    // WHEN
    const result = await provider.getValue({
      account: '1234567890',
      region: 'us-east-1',
      themeId: Mock.CUSTOM_THEME,
    });

    // THEN
    expect(result.themeId).toBe(Mock.CUSTOM_THEME);
  });
});