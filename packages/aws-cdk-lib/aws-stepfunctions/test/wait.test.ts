import { render } from './private/render-util';
import * as cdk from '../../core';
import { Pass, Wait, WaitTime } from '../lib';

describe('Wait State', () => {
  test('wait time from ISO8601 timestamp', () => {
    // GIVEN
    const timestamp = '2025-01-01T00:00:00Z';

    // WHEN
    const waitTime = WaitTime.timestamp(timestamp);

    // THEN
    expect(waitTime).toEqual({
      json: {
        Timestamp: '2025-01-01T00:00:00Z',
      },
    });
  });

  test('wait time from seconds path in state object', () => {
    // GIVEN
    const secondsPath = '$.waitSeconds';

    // WHEN
    const waitTime = WaitTime.secondsPath(secondsPath);

    // THEN
    expect(waitTime).toEqual({
      json: {
        SecondsPath: '$.waitSeconds',
      },
    });
  });

  test('wait time from timestamp path in state object', () => {
    // GIVEN
    const path = '$.timestampPath';

    // WHEN
    const waitTime = WaitTime.timestampPath(path);

    // THEN
    expect(waitTime).toEqual({
      json: {
        TimestampPath: '$.timestampPath',
      },
    });
  });

  test('supports adding a next state', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const chain = new Wait(stack, 'myWaitState', {
      time: WaitTime.duration(cdk.Duration.seconds(30)),
    });

    // WHEN
    chain.next(new Pass(stack, 'final pass', {}));

    // THEN
    expect(render(stack, chain)).toEqual({
      StartAt: 'myWaitState',
      States: {
        'final pass': {
          End: true,
          Type: 'Pass',
        },
        'myWaitState': {
          Next: 'final pass',
          Seconds: 30,
          Type: 'Wait',
        },
      },
    });
  });

  test('supports adding a custom state name', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const waitTime = new Wait(stack, 'myWaitState', {
      stateName: 'wait-state-custom-name',
      time: WaitTime.duration(cdk.Duration.seconds(30)),
    });

    // THEN
    expect(render(stack, waitTime)).toEqual({
      StartAt: 'wait-state-custom-name',
      States: {
        'wait-state-custom-name': {
          Seconds: 30,
          Type: 'Wait',
          End: true,
        },
      },
    });
  });

});
