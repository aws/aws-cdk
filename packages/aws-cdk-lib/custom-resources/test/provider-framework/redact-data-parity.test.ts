import * as fs from 'fs';
import * as path from 'path';
import { redactDataFromPayload } from '../../lib/provider-framework/runtime/cfn-response';

// The rule "mask NoEcho Data in a logged payload" is implemented three times: by
// `redactDataFromPayload` here and by `redactResponseData` in both Node entrypoints of
// `@aws-cdk/custom-resource-handlers`, which cannot import it. This test runs all three
// on the same inputs so that a change to one copy that is not made to the others fails.
const handlersDir = path.dirname(require.resolve('@aws-cdk/custom-resource-handlers/package.json'));
const entrypoints = [
  path.join(handlersDir, 'lib', 'nodejs-entrypoint.ts'),
  path.join(handlersDir, 'lib', 'core', 'nodejs-entrypoint-handler', 'index.ts'),
];

const cases: Array<[string, unknown]> = [
  ['object Data', { A: 'secret-a', B: 'secret-b' }],
  ['empty object Data', {}],
  ['string Data', 'SECRET-STRING'],
  ['array Data', ['SECRET-1', 'SECRET-2']],
  ['number Data', 1234567],
  ['no Data', undefined],
  ['null Data', null],
];

describe.each(entrypoints.map(file => [path.relative(handlersDir, file), file]))('redactResponseData in %s', (_name, file) => {
  const redactResponseData = loadRedactResponseData(file);

  test.each(cases)('matches redactDataFromPayload for %s', (_desc, data) => {
    const expected = redactDataFromPayload({ NoEcho: true, Data: data as any }).Data;

    expect(redactResponseData({ NoEcho: true, Data: data }).Data).toEqual(expected);
  });
});

/**
 * Evaluates the entrypoint's `REDACTED` constant and `redactResponseData` function.
 * They are not exported, and the TypeScript in them is limited to parameter types.
 */
function loadRedactResponseData(file: string): (json: any) => any {
  const source = fs.readFileSync(file, 'utf-8');
  const placeholder = source.match(/^const REDACTED = .*$/m)?.[0];
  const fn = source.match(/^function redactResponseData\([\s\S]*?^}$/m)?.[0];
  if (!placeholder || !fn) {
    throw new Error(`${file}: REDACTED or redactResponseData not found`);
  }
  const js = fn.replace(/\(json: [^)]*\)/, '(json)');
  return new Function(`${placeholder}\n${js}\nreturn redactResponseData;`)();
}
