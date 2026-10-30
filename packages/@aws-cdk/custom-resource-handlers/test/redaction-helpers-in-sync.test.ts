import * as fs from 'fs';
import * as path from 'path';

// The log-redaction helpers are duplicated in the two Node entrypoints, because the
// core entrypoint is copied into assets without bundling and cannot import shared
// code. This test keeps the two copies identical.
test('log-redaction helpers are identical in both Node entrypoints', () => {
  const makeHandlerCopy = sharedBlock(path.join(__dirname, '..', 'lib', 'nodejs-entrypoint.ts'));
  const coreCopy = sharedBlock(path.join(__dirname, '..', 'lib', 'core', 'nodejs-entrypoint-handler', 'index.ts'));

  expect(coreCopy).toEqual(makeHandlerCopy);
});

function sharedBlock(file: string): string {
  const source = fs.readFileSync(file, 'utf-8');
  const begin = source.indexOf('// BEGIN shared log-redaction helpers');
  const end = source.indexOf('// END shared log-redaction helpers');
  if (begin === -1 || end === -1 || end < begin) {
    throw new Error(`${file}: shared log-redaction helper markers not found`);
  }
  return source.slice(begin, end);
}
