import reflect = require('jsii-reflect');

export const CONSTRUCT_ASSEMBLY = '@aws-cdk/cdk';
export const CONSTRUCT_FQN = `${CONSTRUCT_ASSEMBLY}.Construct`;
export const CONSTRUCT_INTERFACE_FQN = `${CONSTRUCT_ASSEMBLY}.IConstruct`;

export function isConstruct(c: reflect.ClassType) {
  if (!c.system.includesAssembly(CONSTRUCT_ASSEMBLY)) {
    return false;
  }
  const constructClass = c.system.findFqn(CONSTRUCT_FQN);
  const bases = c.getAncestors();
  const root = bases[bases.length - 1];
  return root === constructClass;
}