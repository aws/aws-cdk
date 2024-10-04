// ESTree is supposed to be used dynamically typed (from JavaScript) and
// `@types/estree` only adds interface declarations, not helper functions to
// type guard objects. Therefore, we make a bunch here.

import * as estree from 'estree';
import { matchObject } from './match-ast';

export function isMemberExpression(x: estree.BaseNode): x is estree.MemberExpression {
  return x.type === 'MemberExpression';
}

export function isIdentifier(x: estree.BaseNode): x is estree.Identifier {
  return x.type === 'Identifier';
}

export function matchMemberExpression(details?: NodeDetails<estree.MemberExpression>) {
  return matchEstree<estree.MemberExpression>('MemberExpression', details);
}

export function matchIdentifier(name: string) {
  return matchEstree<estree.Identifier>('Identifier', { name });
}

/**
 * The type of additional node fields (except its type)
 */
type NodeDetails<T extends estree.BaseNode> = {[k in Exclude<keyof T, 'type'>]?: unknown};

/**
 * Match an ESTree node of a given type with given subfields
 */
export function matchEstree<T extends estree.BaseNode>(type: T['type'], details?: NodeDetails<T>) {
  return matchObject({
    type,
    ...details,
  });
}
