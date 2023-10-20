import * as fs from 'fs-extra';
import * as path from 'path';
import { transformFileContents } from '../lib';
import { parse } from 'cjs-module-lexer';

// Write a .js file in this directory that will be imported by tests below
beforeEach(async () => {
  await fs.writeFile(path.join(__dirname, 'some-module.js'), [
    'module.exports.foo = function() { return "foo"; }',
    'module.exports.bar = 5;',
  ].join('\n'), { encoding: 'utf-8' });
});

test('replace __exportStar with getters', () => {
  const fakeFile = path.join(__dirname, 'index.ts');

  const transformed = transformFileContents(fakeFile, [
    '__exportStar(require("./some-module"), exports);'
  ].join('\n'));

  expect(parse(transformed).exports).toEqual([
    'foo',
    'bar',
  ]);

  const mod = evalModule(transformed);
  expect(mod.foo()).toEqual('foo');
  expect(mod.bar).toEqual(5);
});

test('replace re-export with getter', () => {
  const fakeFile = path.join(__dirname, 'index.ts');
  const transformed = transformFileContents(fakeFile, [
    'exports.some_module = require("./some-module");',
  ].join('\n'));

  expect(parse(transformed).exports).toEqual([
    'some_module',
  ]);

  const mod = evalModule(transformed);
  expect(mod.some_module.foo()).toEqual('foo');
  expect(mod.some_module.bar).toEqual(5);
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
