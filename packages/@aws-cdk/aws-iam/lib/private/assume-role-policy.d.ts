import { PolicyDocument } from '../policy-document';
import { IPrincipal } from '../principals';
/**
 * Add a principal to an AssumeRolePolicyDocument in the right way
 *
 * Delegate to the principal if it can do the job itself, do a default job if it can't.
 */
export declare function defaultAddPrincipalToAssumeRole(principal: IPrincipal, doc: PolicyDocument): void;
