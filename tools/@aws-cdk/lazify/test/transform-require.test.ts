import { transformFileContents } from "../lib";

test('plain require', () => {
  expect(tx(
  'const x = require("x");',
  'module.exports.banana = function() {',
  '  return x.hello();',
  '}'
)).toMatchInlineSnapshot(`
"var x = () => { var tmp = require("x"); x = () => tmp; return tmp; };
module.exports.banana = function () {
    return x().hello();
};
"
`);
});

test('split object literal shorthand', () => {
  expect(tx(
  'const x = require("x");',
  'module.exports.banana = function() {',
  '  return { x };',
  '}'
)).toMatchInlineSnapshot(`
"var x = () => { var tmp = require("x"); x = () => tmp; return tmp; };
module.exports.banana = function () {
    return { x: x() };
};
"
`);
});

test.each([
  ['object key', 'const x = { ident: 5 };'],
  ['object access', 'const x = obj.ident;'],
  ['method declaration', 'class X { public ident() { } }'],
  ['method signature', 'interface X { ident(); }'],
  ['property declaration', 'class X { public readonly ident: string; }'],
  ['property signature', 'interface X { readonly ident: string; }'],
  ['get accessor', 'class X { get ident() { return "asdf"; } }'],
  ['set accessor', 'class X { set ident(value: string) { } }'],
])('do not transform identifier in %p position', (_, decl) => {
  const input = [
    'const ident = require("./module");',
    decl,
  ];
  const transformed = tx(...input).split('\n');

  const normalizedTransformed = [
    transformed[0],
    transformed.slice(1).join('\n').replace(/\s+/g, ' ').trim(),
  ];
  const normalizedDecl = decl.replace(/\s+/g, ' ').trim();

  expect(normalizedTransformed).toEqual([
    'var ident = () => { var tmp = require("./module"); ident = () => tmp; return tmp; };',
    normalizedDecl,
  ]);
});


function tx(...xs: string[]) {
  return transformFileContents('index.ts', xs.join('\n'));
}