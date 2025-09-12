import * as fs from 'fs-extra';
import * as path from 'path';
import { transformFileContents } from '../lib';

// Write a .js file in this directory that will be imported by tests below (make it work on Windows).
const someModulePath = path.join(__dirname, 'no-double-getter-import.js').replace(/\\/g, '/');
beforeEach(async () => {
  await fs.writeFile(someModulePath, [
    'Object.defineProperty(module.exports, "foo", {',
    // Necessary otherwise the way we find exported symbols (by actually including the file and iterating keys)
    // won't find this symbol.
    '  enumerable: true,',
    '  get: () => {',
    '    console.log("evaluating getter");',
    '    return 42;',
    '  }',
    '})',
  ].join('\n'), { encoding: 'utf-8' });
});

test('replace re-export with getter', () => {
  const fakeFile = path.join(__dirname, 'index.ts');
  const transformed = transformFileContents(fakeFile, [
    `__exportStar(require("${someModulePath}"), exports);`
  ].join('\n'));

  const mod = evalModule(transformed);

  const logMock = jest.spyOn(console, 'log');

  // If we do `expect(mod.foo).toEqual(...)` Jest has some magic somewhere to
  // detect that it's a getter, rather than evaluate the getter to get to the
  // number `42`. So do the getter evaluation outside of an `expect` statement.
  const access1 = mod.foo;
  expect(access1).toEqual(42);
  const access2 = mod.foo;
  expect(access2).toEqual(42);

  expect(logMock).toHaveBeenCalledTimes(1);
});

/**
 * Fake NodeJS evaluation of a module
 */
function evalModule(x: string) {
  const code = [
    '(function() {',
    'const exports = {};',
    'const module = { exports };',
    x,
    'return exports;',
    '})()',
  ].join('\n');
  return eval(code);
}
