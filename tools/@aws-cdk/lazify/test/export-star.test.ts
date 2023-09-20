import * as fs from 'fs-extra';
import * as path from 'path';
import { transformFileContents } from '../lib';

// Write a .js file in this directory that will be imported by tests below
beforeEach(async () => {
  await fs.writeFile(path.join(__dirname, 'some-module.js'), [
    'module.exports.foo = function() { return "foo"; }',
    'module.exports.bar = 5;',
  ].join('\n'), { encoding: 'utf-8' });
});

test('replace __exportStar with getters', () => {
  const fakeFile = path.join(__dirname, 'index.ts');
  expect(transformFileContents(fakeFile, [
    '__exportStar(require("./some-module"), exports);'
  ].join('\n'))).toMatchInlineSnapshot(`
"Object.defineProperty(exports, "foo", { configurable: true, get: () => require("./some-module").foo });
Object.defineProperty(exports, "bar", { configurable: true, get: () => require("./some-module").bar });
"
`);
});

test('replace re-export with getter', () => {
  const fakeFile = path.join(__dirname, 'index.ts');
  expect(transformFileContents(fakeFile, [
    'exports.some_module = require("./some-module");',
  ].join('\n'))).toMatchInlineSnapshot(`
"Object.defineProperty(exports, "some_module", { configurable: true, get: () => require("./some-module") });
"
`);
});