import { blue, yellow } from 'colors/safe';
import { CloudWatchLogEventMonitor } from '../../../lib/api/logs/logs-monitor';
import { sleep } from '../../integ/helpers/aws';
import { MockSdk } from '../../util/mock-sdk';

let sdk: MockSdk;
let stderrMock: jest.SpyInstance;
let monitor: CloudWatchLogEventMonitor;
beforeEach(() => {
  jest.useFakeTimers('legacy');
  monitor = new CloudWatchLogEventMonitor({ hotswapTime: new Date(T100) });
  monitor.activate();
  stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });
  sdk = new MockSdk();
});

afterAll(() => {
  jest.useRealTimers();
  stderrMock.mockRestore();
});

let TIMESTAMP: number;
let HUMAN_TIME: string;

beforeAll(() => {
  TIMESTAMP = new Date().getTime();
  HUMAN_TIME = new Date(TIMESTAMP).toLocaleTimeString();
});

test('continue to the next page if it exists', async () => {
  await testMonitorWithEventCalls([
    (request) => {
      expect(request.nextToken).toBeUndefined();
      return {
        events: [event(102, 'message')],
        nextToken: 'some-token',
      };
    },
    (request) => {
      expect(request.nextToken).toBe('some-token');
      return {
        events: [event(101, 'some-message')],
      };
    },
  ]);

  expect(stderrMock).toHaveBeenCalledTimes(2);
  expect(stderrMock.mock.calls[0][0]).toContain(
    `[${blue('loggroup')}] ${yellow(HUMAN_TIME)} message`,
  );
  expect(stderrMock.mock.calls[1][0]).toContain(
    `[${blue('loggroup')}] ${yellow(HUMAN_TIME)} some-message`,
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

async function testMonitorWithEventCalls(
  events: Array<(x: AWS.CloudWatchLogs.FilterLogEventsRequest) => AWS.CloudWatchLogs.FilterLogEventsResponse>) {
  let filterLogEvents = (jest.fn() as jest.Mock<AWS.CloudWatchLogs.FilterLogEventsResponse, [AWS.CloudWatchLogs.FilterLogEventsRequest]>);

  let finished = false;
  for (const e of events) {
    const e_ = e;
    const isLast = e === events[events.length - 1];
    filterLogEvents = filterLogEvents.mockImplementationOnce(request => {
      const ret = e_(request);
      if (isLast) {
        jest.advanceTimersByTime(2000);
        finished = true;
      }
      return ret;
    });
  }
  filterLogEvents.mockImplementation(() => { return {}; });
  sdk.stubCloudWatchLogs({ filterLogEvents });
  monitor.addLogGroups({
    account: '11111111111',
    region: 'us-east-1',
    sdk,
    groups: new Set(['loggroup']),
  });
  await waitForCondition(() => finished);
}

async function waitForCondition(cb: () => boolean): Promise<void> {
  jest.advanceTimersByTime(2000);
  while (!cb()) {
    await sleep(10);
  }
}
