import { IResolvable, IResolveContext } from '../resolvable';
import { IResource } from '../resource';
export declare function generatePhysicalName(resource: IResource): string;
/**
 * This marker token is used by PhysicalName.GENERATE_IF_NEEDED. When that token is passed to the
 * physicalName property of a Resource, it triggers different behavior in the Resource constructor
 * that will allow emission of a generated physical name (when the resource is used across
 * environments) or undefined (when the resource is not shared).
 *
 * This token throws an Error when it is resolved, as a way to prevent inadvertent mis-uses of it.
 */
export declare class GeneratedWhenNeededMarker implements IResolvable {
    readonly creationStack: string[];
    constructor();
    resolve(_ctx: IResolveContext): never;
    toString(): string;
}
/**
 * Checks whether a stringified token resolves to a `GeneratedWhenNeededMarker`.
 */
export declare function isGeneratedWhenNeededMarker(val: string): boolean;
