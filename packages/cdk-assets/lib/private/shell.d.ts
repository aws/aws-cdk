/// <reference types="node" />
/// <reference types="node" />
import * as child_process from 'child_process';
export type Logger = (x: string) => void;
export interface ShellOptions extends child_process.SpawnOptions {
    readonly quiet?: boolean;
    readonly logger?: Logger;
    readonly input?: string;
}
/**
 * OS helpers
 *
 * Shell function which both prints to stdout and collects the output into a
 * string.
 */
export declare function shell(command: string[], options?: ShellOptions): Promise<string>;
export type ProcessFailedError = ProcessFailed;
declare class ProcessFailed extends Error {
    readonly exitCode: number | null;
    readonly signal: NodeJS.Signals | null;
    readonly code = "PROCESS_FAILED";
    constructor(exitCode: number | null, signal: NodeJS.Signals | null, message: string);
}
export {};
