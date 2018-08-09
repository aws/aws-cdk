import { markAsIntrinsic } from "../core/intrinsic";
import { DEFAULT_ENGINE_NAME, registerEngineTokenHandler, resolve, StringFragment, Token } from "../core/tokens";

/**
 * The default intrinsics Token engine for CloudFormation
 */
export const CLOUDFORMATION_ENGINE = 'cloudformation';

/**
 * Class that tags the Token's return value as an Intrinsic.
 *
 * It also automatically resolves inner Token values. Simple base class so
 * existing Tokens don't need to change too much.
 */
export class CloudFormationIntrinsicToken extends Token {
    public resolve(): any {
        // Get the inner value, and deep-resolve it to resolve further Tokens.
        const resolved = resolve(super.resolve());
        return markAsIntrinsic(resolved, CLOUDFORMATION_ENGINE);
    }
}

import { FnConcat } from "./fn";

const cloudFormationEngine = {
    /**
     * In CloudFormation, we combine strings by wrapping them in FnConcat
     */
    combineStringFragments(fragments: StringFragment[]) {
        return new FnConcat(...fragments.map(f => f.value));
    }
};

registerEngineTokenHandler(CLOUDFORMATION_ENGINE, cloudFormationEngine);
registerEngineTokenHandler(DEFAULT_ENGINE_NAME, cloudFormationEngine);