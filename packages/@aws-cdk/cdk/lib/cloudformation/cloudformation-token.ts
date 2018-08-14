import { Token  } from "../core/tokens";

/**
 * Base class for CloudFormation built-ins
 */
export class CloudFormationToken extends Token {
    constructor(valueOrFunction: any, stringRepresentationHint?: string) {
        super(valueOrFunction, {
            joiner: CLOUDFORMATION_JOINER,
            stringRepresentationHint
        });
    }
}

import { FnConcat } from "./fn";

/**
 * The default intrinsics Token engine for CloudFormation
 */
export const CLOUDFORMATION_JOINER = {
    joinerName: 'CloudFormation',

    joinStringFragments(fragments: any[]): any {
        return new FnConcat(...fragments.map(x => isIntrinsic(x) ? x : `${x}`));
    }
};

/**
 * Return whether the given value represents a CloudFormation intrinsic
 */
export function isIntrinsic(x: any) {
    if (Array.isArray(x) || x === null || typeof x !== 'object') { return false; }

    const keys = Object.keys(x);
    if (keys.length !== 1) { return false; }

    return keys[0] === 'Ref' || keys[0].startsWith('Fn::');
}