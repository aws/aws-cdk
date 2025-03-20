import { Construct } from 'constructs';
import { Stack } from '../../core/lib/stack';

export function stackRelativeConstructPath(c: Construct) {
  const scopes = c.node.scopes;
  const stackIndex = scopes.indexOf(Stack.of(c));
  return scopes.slice(stackIndex + 1).map(x => x.node.id).join('/');
}
