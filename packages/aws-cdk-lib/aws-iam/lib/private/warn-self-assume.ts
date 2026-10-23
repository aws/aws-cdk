import { Construct } from 'constructs';
import { Annotations } from '../../../core';
import type { IRoleRef } from '../iam.generated';
import type { IPrincipal } from '../principals';

/** Warn when an identity grant alone cannot establish a role's self-trust. */
export function warnIfSelfAssume(role: IRoleRef, identity: IPrincipal): void {
  if (Construct.isConstruct(identity.grantPrincipal) && identity.grantPrincipal.node === role.node) {
    Annotations.of(role).addWarningV2('@aws-cdk/aws-iam:roleSelfAssume',
      'grantAssumeRole only adds an identity-based policy and does not update the role trust policy. A role must explicitly trust itself to assume itself. See https://aws.amazon.com/blogs/security/announcing-an-update-to-iam-role-trust-policy-behavior/');
  }
}
