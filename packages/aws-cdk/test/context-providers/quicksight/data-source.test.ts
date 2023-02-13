// eslint-disable-next-line import/order
import * as Mock from './mock';

describe('datasource', () => {

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

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_AMAZON_ELASTICSEARCH)} data source`, async () => {
    // GIVEN
    const provider = Mock.providers.dataSource;

    // WHEN
    const result = await provider.getValue({
      account: '1234567890',
      region: 'us-east-1',
      dataSourceId: Mock.DATA_SOURCE_ID_AMAZON_ELASTICSEARCH,
    });

    // THEN
    let parameter: any = result.dataSourceParameters?.amazonElasticsearchParameters;
    expect(parameter.domain).toBe('AmazonElasticsearchParametersDomain');

    let alternateParameter: any = result.alternateDataSourceParameters?.[0].amazonElasticsearchParameters;
    expect(alternateParameter.domain).toBe('AmazonElasticsearchParametersDomain');
  });
});