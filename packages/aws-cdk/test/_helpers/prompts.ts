/**
 * Sends a response to a prompt to stdin
 * When using this in tests, call just before the prompt runs.
 *
 * @example
 * ```ts
 * sendResponse('y');
 * await prompt('Confirm (y/n)?');
 * ```
 */
export function sendResponse(res: string, delay = 0) {
  if (!delay) {
    setImmediate(() => process.stdin.emit('data', `${res}\n`));
  } else {
    setTimeout(() => process.stdin.emit('data', `${res}\n`), delay);
  }
}
