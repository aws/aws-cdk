/* eslint-disable jest/no-export */
import * as logging from '../../lib/logging';

export function silentTest(name: string, callback: () => void | Promise<void>, timeout?: number): void {
  const spy = jest.spyOn(logging, 'print');
  if (process.env.CLI_TEST_VERBOSE) {
    spy.mockRestore();
  }
  test(
    name,
    async () => {
      return callback();
    },
    timeout,
  );
}
