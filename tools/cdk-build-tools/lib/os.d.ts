/// <reference types="node" />
import * as child_process from 'child_process';
import { Timers } from './timer';
interface ShellOptions {
    timers?: Timers;
    env?: child_process.SpawnOptions['env'];
}
/**
 * A shell command that does what you want
 *
 * Is platform-aware, handles errors nicely.
 */
export declare function shell(command: string[], options?: ShellOptions): Promise<string>;
/**
 * Make the script executable on the current platform
 *
 * On UNIX, we'll use chmod to directly execute the file.
 *
 * On Windows, we'll do nothing and expect our other tooling
 * (npm/lerna) to generate appropriate .cmd files when linking.
 */
export declare function makeExecutable(javascriptFile: string): Promise<void>;
export {};
