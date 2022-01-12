import { blue, yellow } from 'chalk';
import { CloudWatchLogEventMonitor } from '../../../lib/api/logs/logs-monitor';
import { sleep } from '../../integ/helpers/aws';
import { MockSdk } from '../../util/mock-sdk';

let sdk: MockSdk;
let stderrMock: jest.SpyInstance;
let monitor: CloudWatchLogEventMonitor;
beforeEach(() => {
  monitor = new CloudWatchLogEventMonitor(new Date(T100));
  stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });
  sdk = new MockSdk();
});

afterAll(() => {
  stderrMock.mockRestore();
  monitor.deactivate();
});

let TIMESTAMP: number;
let HUMAN_TIME: string;

beforeAll(() => {
  TIMESTAMP = new Date().getTime();
  HUMAN_TIME = new Date(TIMESTAMP).toLocaleTimeString();
});

test('continue to the next page if it exists', async () => {
  // GIVEN
  sdk.stubCloudWatchLogs({
    filterLogEvents() {
      return {
        events: [event(102, 'message')],
        nextToken: 'some-token',
      };
    },
  });
  monitor.addLogGroups(
    {
      name: 'name',
      account: '11111111111',
      region: 'us-east-1',
    },
    sdk,
    ['loggroup'],
  );
  // WHEN
  monitor.activate();
  // need time for the log processing to occur
  await sleep(1000);

  // THEN
  expect(stderrMock).toHaveBeenCalledTimes(2);
  expect(stderrMock.mock.calls[0][0]).toContain(
    `[${blue('loggroup')}] ${yellow(HUMAN_TIME)} message`,
  );
  expect(stderrMock.mock.calls[1][0]).toContain(
    `[${blue('loggroup')}] ${yellow(new Date(T100).toLocaleTimeString())} (...messages supressed...)`,
  );
});

const T0 = 1597837230504;
const T100 = T0 + 100 * 1000;
function event(nr: number, message: string): AWS.CloudWatchLogs.FilteredLogEvent {
  return {
    eventId: `${nr}`,
    message,
    timestamp: new Date(T0 * nr * 1000).getTime(),
    ingestionTime: new Date(T0 * nr * 1000).getTime(),
  };
}
