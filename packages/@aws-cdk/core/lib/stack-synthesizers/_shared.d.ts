import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { ISynthesisSession } from './types';
import { Stack } from '../stack';
/**
 * Shared logic of writing stack artifact to the Cloud Assembly
 *
 * This logic is shared between StackSyntheses.
 *
 * It could have been a protected method on a base class, but it
 * uses `Partial<cxapi.AwsCloudFormationStackProperties>` in the
 * parameters (which is convenient so I can remain typesafe without
 * copy/pasting), and jsii will choke on this type.
 */
export declare function addStackArtifactToAssembly(session: ISynthesisSession, stack: Stack, stackProps: Partial<cxschema.AwsCloudFormationStackProperties>, additionalStackDependencies: string[]): void;
/**
 * Hash a string
 */
export declare function contentHash(content: string): string;
/**
 * Throw an error message about binding() if we don't have a value for x.
 *
 * This replaces the ! assertions we would need everywhere otherwise.
 */
export declare function assertBound<A>(x: A | undefined): asserts x is NonNullable<A>;
export declare class StringSpecializer {
    private readonly stack;
    private readonly qualifier;
    constructor(stack: Stack, qualifier: string);
    /**
     * Function to replace placeholders in the input string as much as possible
     *
     * We replace:
     * - ${Qualifier}: always
     * - ${AWS::AccountId}, ${AWS::Region}: only if we have the actual values available
     * - ${AWS::Partition}: never, since we never have the actual partition value.
     */
    specialize(s: string): string;
    /**
     * Specialize only the qualifier
     */
    qualifierOnly(s: string): string;
}
/**
 * Return the given value if resolved or fall back to a default
 */
export declare function resolvedOr<A>(x: string, def: A): string | A;
