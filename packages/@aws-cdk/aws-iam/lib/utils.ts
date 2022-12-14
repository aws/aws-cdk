import { Resource } from '@aws-cdk/core';
import { Construct, IConstruct } from 'constructs';
import { IPrincipal } from './principals';

/**
 * Determines whether the given Principal is a newly created resource managed by the CDK,
 * or if it's a referenced existing resource.
 *
 * @param principal the Principal to check
 * @returns true if the Principal is a newly created resource, false otherwise.
 *   Additionally, the type of the principal will now also be IConstruct
 *   (because a newly created resource must be a construct)
 */
export function principalIsOwnedResource(principal: IPrincipal): principal is IPrincipal & IConstruct {
  // a newly created resource will for sure be a construct
  if (!isConstruct(principal)) {
    return false;
  }

  return Resource.isOwnedResource(principal);
}

/**
 * Whether the given object is a Construct
 *
 * Normally we'd do `x instanceof Construct`, but that is not robust against
 * multiple copies of the `constructs` library on disk. This can happen
 * when upgrading and downgrading between v2 and v1, and in the use of CDK
 * Pipelines is going to an error that says "Can't use Pipeline/Pipeline/Role in
 * a cross-environment fashion", which is very confusing.
 */
function isConstruct(x: any): x is IConstruct {
  const sym = Symbol.for('constructs.Construct.node');
  return (typeof x === 'object' && x &&
    (x instanceof Construct // happy fast case
      || !!(x as any).node // constructs v10
      || !!(x as any)[sym])); // constructs v3
}
