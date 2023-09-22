import * as child_process from 'child_process';
import { mocked } from 'jest-mock';
import { CommandHandler } from '../lib/command-api';
import { realHandler } from '../lib/commands/docs';
const argv = {
  browser: 'echo %u',
  commandHandler: undefined as (CommandHandler | undefined),
};

// eslint-disable-next-line no-console
console.log = jest.fn();
jest.mock('child_process');

describe('`cdk docs`', () => {

  test('exits with 0 when everything is OK', async () => {
    const mockChildProcessExec: any = (_: string, cb: (err?: Error, stdout?: string, stderr?: string) => void) => cb();
    mocked(child_process.exec).mockImplementation(mockChildProcessExec);

    const result = await realHandler({ args: argv } as any);
    expect(result).toBe(0);
  });

  test('exits with 0 when opening the browser fails', async () => {
    const mockChildProcessExec: any = (_: string, cb: (err: Error, stdout?: string, stderr?: string) => void) => cb(new Error('TEST'));
    mocked(child_process.exec).mockImplementation(mockChildProcessExec);

    const result = await realHandler({ args: argv } as any);
    expect(result).toBe(0);
  });
});
