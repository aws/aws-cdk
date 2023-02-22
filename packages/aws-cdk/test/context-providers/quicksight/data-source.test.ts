// eslint-disable-next-line import/order
import * as MockAws from 'aws-sdk-mock';
import * as Mock from './mock';
MockAws.setSDK(require.resolve('aws-sdk'));

describe('datasource', () => {

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