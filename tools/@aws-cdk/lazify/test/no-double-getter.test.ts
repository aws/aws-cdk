import * as fs from 'fs-extra';
import * as path from 'path';
import { transformFileContents } from '../lib';
import { parse } from 'cjs-module-lexer';

// Write a .js file in this directory that will be imported by tests below
beforeEach(async () => {
  await fs.writeFile(path.join(__dirname, 'some-module.js'), [
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
    '__exportStar(require("./some-module"), exports);'
  ].join('\n'));

  const mod = evalModule(transformed);

  const logMock = jest.spyOn(console, 'log');
  expect(mod.foo).toEqual(42);
  expect(mod.foo).toEqual(42);

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
