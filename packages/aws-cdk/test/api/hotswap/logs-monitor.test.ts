import { blue, yellow } from 'colors/safe';
import { EventPrinter, IEventPrinter, CloudWatchLogEventMonitor, CloudWatchLogEvent } from '../../../lib/api/hotswap/monitor/logs-monitor';
import { sleep } from '../../integ/helpers/aws';
import { stderr } from '../console-listener';
import { MockSdk } from './../../util/mock-sdk';

let sdk: MockSdk;
let printer: FakePrinter;
beforeEach(() => {
  sdk = new MockSdk();
  printer = new FakePrinter();
});

let TIMESTAMP: number;
let HUMAN_TIME: string;

beforeAll(() => {
  TIMESTAMP = new Date().getTime();
  HUMAN_TIME = new Date(TIMESTAMP).toLocaleTimeString();
});

test('outputs correctly', () => {
  const allActivityPrinter = new EventPrinter({
    stream: process.stderr,
  });
  const output = stderr.inspectSync(() => {
    allActivityPrinter.print({
      message: 'this is a log message',
      logGroup: 'log-group-name',
      ingestionTime: new Date(TIMESTAMP),
      logStream: 'stream-name',
    });
  });

  expect(output[0].trim()).toStrictEqual(`${blue('log-group-name')} ${blue('stream-name')} ${yellow(HUMAN_TIME)} this is a log message`);
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

  expect(printer.eventMessages).toEqual(['message', 'some-message']);
});

test('do not process events we have already seen', async () => {
  await testMonitorWithEventCalls([
    (request) => {
      expect(request.nextToken).toBeUndefined();
      return {
        events: [event(102, 'message'), event(101, 'first-message')],
      };
    },
    (request) => {
      expect(request.nextToken).toBeUndefined;
      return {
        events: [event(101, 'first-message'), event(103, 'second-message')],
      };
    },
  ]);

  expect(printer.eventMessages).toEqual(['message', 'first-message', 'second-message']);
});

const T0 = 1597837230504;
const T100 = T0 + 100 * 1000;
function event(nr: number, message: string): AWS.CloudWatchLogs.FilteredLogEvent {
  return {
    eventId: `${nr}`,
    message,
    timestamp: new Date(T0 * nr * 1000).getUTCDate(),
    ingestionTime: new Date(T0 * nr * 1000).getUTCDate(),
    logStreamName: 'stream',
  };
}

class FakePrinter implements IEventPrinter {
  public updateSleep: number = 0;
  public readonly events: CloudWatchLogEvent[] = [];

  public print(e: CloudWatchLogEvent): void {
    this.events.push(e);
  }

  public get eventMessages() {
    return this.events.map(a => a.message);
  }

  public start(): void { }
  public stop(): void { }
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
        finished = true;
      }
      return ret;
    });
  }
  filterLogEvents.mockImplementation(() => { return {}; });
  sdk.stubCloudWatchLogs({ filterLogEvents });
  const monitor = new CloudWatchLogEventMonitor(printer, new Date(T100)).start();
  monitor.addSDK(sdk);
  monitor.addLogGroups(['loggroup']);
  await waitForCondition(() => finished);
  await monitor.stop();
}

async function waitForCondition(cb: () => boolean): Promise<void> {
  while (!cb()) {
    await sleep(10);
  }
}
