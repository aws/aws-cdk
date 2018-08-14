import { IProvisioningEngine, StringFragment } from "../core/engine";
import { IntrinsicToken  } from "../core/tokens";

import { FnConcat } from "./fn";

/**
 * The default intrinsics Token engine for CloudFormation
 */
export const CLOUDFORMATION_ENGINE = {
    engineName: 'CloudFormation',
    combineStringFragments(fragments: StringFragment[]) {
        return new FnConcat(...fragments.map(f => f.value));
    }
};

/**
 * Base class for CloudFormation built-ins
 */
export class CloudFormationIntrinsicToken extends IntrinsicToken {
    protected readonly engine: IProvisioningEngine = CLOUDFORMATION_ENGINE;
}