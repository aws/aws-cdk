import { CDKBuildOptions, CompilerOverrides } from './package-info';
export declare function lintCurrentPackage(options: CDKBuildOptions, compilers?: CompilerOverrides & {
    fix?: boolean;
}): Promise<void>;
