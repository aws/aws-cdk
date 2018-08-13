import { ProvisioningEngine, StringFragment } from "../core/engine-strings";
import { IntrinsicToken  } from "../core/tokens";

/**
 * The default intrinsics Token engine for CloudFormation
 */
export const CLOUDFORMATION_ENGINE = 'cloudformation';

/**
 * Base class for CloudFormation built-ins
 */
export class CloudFormationIntrinsicToken extends IntrinsicToken {
    protected readonly engine: string = CLOUDFORMATION_ENGINE;
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

ProvisioningEngine.register(CLOUDFORMATION_ENGINE, cloudFormationEngine);