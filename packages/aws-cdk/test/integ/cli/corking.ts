/**
 * Routines for corking stdout and stderr
 */

let _corkShellOutput = false;
const _corked = {
  stdout: new Array<Buffer>(),
  stderr: new Array<Buffer>(),
};

function cleanStreams() {
  _corked.stdout.splice(0, _corked.stdout.length);
  _corked.stderr.splice(0, _corked.stderr.length);
}

export function corkShellOutput() {
  _corkShellOutput = true;
  cleanStreams();
}

export function writeOutput(stream: 'stdout' | 'stderr', content: Buffer) {
  if (_corkShellOutput) {
    _corked[stream].push(content);
  } else {
    process[stream].write(content);
  }
}

async function writeAndFlush(stream: 'stdout' | 'stderr', content: Buffer) {
  const flushed = process[stream].write(content);
  if (!flushed) {
    return new Promise(ok => process[stream].once('drain', ok));
  }
}

export function uncorkShellOutput() {
  _corkShellOutput = false;
}

export async function flushCorkedOutput() {
  await writeAndFlush('stdout', Buffer.concat(_corked.stdout));
  await writeAndFlush('stderr', Buffer.concat(_corked.stderr));
  cleanStreams();
}

