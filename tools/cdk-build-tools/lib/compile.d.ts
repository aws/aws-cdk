import { CDKBuildOptions, CompilerOverrides } from './package-info';
import { Timers } from './timer';
/**
 * Run the compiler on the current package
 */
export declare function compileCurrentPackage(options: CDKBuildOptions, timers: Timers, compilers?: CompilerOverrides): Promise<void>;
