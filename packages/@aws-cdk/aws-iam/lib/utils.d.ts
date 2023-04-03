import { IConstruct } from 'constructs';
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
export declare function principalIsOwnedResource(principal: IPrincipal): principal is IPrincipal & IConstruct;
