import * as fs from 'fs';
import * as path from 'path';

// `redactResponseData` masks NoEcho response Data in the log line of both Node
// entrypoints. The CustomResourceProvider entrypoint is copied into assets without
// bundling, so it cannot import shared code; this test keeps the two copies equal.
test('redactResponseData is the same in both Node entrypoints', () => {
  const makeHandlerCopy = extract(path.join(__dirname, '..', 'lib', 'nodejs-entrypoint.ts'));
  const coreCopy = extract(path.join(__dirname, '..', 'lib', 'core', 'nodejs-entrypoint-handler', 'index.ts'));

  expect(coreCopy).toEqual(makeHandlerCopy);
});

/** The REDACTED placeholder and the redactResponseData function (without its doc comment). */
function extract(file: string) {
  const source = fs.readFileSync(file, 'utf-8');
  const placeholder = source.match(/^const REDACTED = .*$/m)?.[0];
  const fn = source.match(/^function redactResponseData\([\s\S]*?^}$/m)?.[0];
  if (!placeholder || !fn) {
    throw new Error(`${file}: REDACTED or redactResponseData not found`);
  }
  return { placeholder, fn };
}
