import reflect = require('jsii-reflect');

export const CONSTRUCT_FQN = '@aws-cdk/cdk.Construct';
export const CONSTRUCT_INTERFACE_FQN = '@aws-cdk/cdk.IConstruct';

export function isConstruct(c: reflect.ClassType) {
  const constructClass = c.system.findFqn(CONSTRUCT_FQN);
  const bases = c.getAncestors();
  const root = bases[bases.length - 1];
  return root === constructClass;
}
