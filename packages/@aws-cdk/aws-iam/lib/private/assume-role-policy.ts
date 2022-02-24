import { PolicyDocument } from '../policy-document';
import { PolicyStatement } from '../policy-statement';
import { IPrincipal, IAssumeRolePrincipal } from '../principals';

/**
 * Add a principal to an AssumeRolePolicyDocument in the right way
 *
 * Delegate to the principal if it can do the job itself, do a default job if it can't.
 */
export function defaultAddPrincipalToAssumeRole(principal: IPrincipal, doc: PolicyDocument) {
  if (isAssumeRolePrincipal(principal)) {
    // Principal knows how to add itself
    principal.addToAssumeRolePolicy(doc);
  } else {
    // Principal can't add itself, we do it for them
    doc.addStatements(new PolicyStatement({
      actions: [principal.assumeRoleAction],
      principals: [principal],
    }));
  }
}

function isAssumeRolePrincipal(principal: IPrincipal): principal is IAssumeRolePrincipal {
  return !!(principal as IAssumeRolePrincipal).addToAssumeRolePolicy;
}
