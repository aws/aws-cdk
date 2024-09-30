// ESTree is supposed to be used dynamically typed (from JavaScript) and
// `@types/estree` only adds interface declarations, not helper functions to
// type guard objects. Therefore, we make a bunch here.

import * as estree from 'estree';

export function isMemberExpression(x: estree.BaseNode): x is estree.MemberExpression {
  return x.type === 'MemberExpression';
}

export function isIdentifier(x: estree.BaseNode): x is estree.Identifier {
  return x.type === 'Identifier';
}