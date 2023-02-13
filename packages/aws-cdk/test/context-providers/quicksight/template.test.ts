// eslint-disable-next-line import/order
import * as Mock from './mock';

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