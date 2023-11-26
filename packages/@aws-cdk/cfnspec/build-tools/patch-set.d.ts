export interface PatchOptions {
    readonly quiet?: boolean;
    /**
     * Strict patching mode.
     * Will fail if a patch can't be applied.
     * Set to `false` to silently ignore any errors.
     *
     * @default true
     */
    readonly strict?: boolean;
}
export type PatchSet = Record<string, PatchSetElement>;
export type PatchSetElement = {
    readonly type: 'fragment';
    readonly data: any;
} | {
    readonly type: 'patch';
    readonly data: any;
} | {
    readonly type: 'set';
    readonly sources: PatchSet;
};
export declare function loadPatchSet(sourceDirectory: string, relativeTo?: string): Promise<PatchSet>;
export declare function evaluatePatchSet(sources: PatchSet, options?: PatchOptions): any;
/**
 * Load a patch set from a directory
 */
export declare function applyPatchSet(sourceDirectory: string, options?: PatchOptions): Promise<any>;
/**
 * Load a patch set and write it out to a file
 */
export declare function applyAndWrite(targetFile: string, sourceDirectory: string, options?: PatchOptions): Promise<void>;
export declare function writeSorted(targetFile: string, data: any): Promise<void>;
