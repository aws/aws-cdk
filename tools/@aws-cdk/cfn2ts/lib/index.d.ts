import * as pkglint from '@aws-cdk/pkglint';
import { AugmentationsGeneratorOptions } from './augmentation-generator';
import { CodeGeneratorOptions } from './codegen';
interface GenerateOutput {
    outputFiles: string[];
    resources: Record<string, string>;
}
export default function generate(scopes: string | string[], outPath: string, options?: CodeGeneratorOptions & AugmentationsGeneratorOptions): Promise<GenerateOutput>;
/**
 * Configuration options for the generateAll function
 */
export interface GenerateAllOptions extends CodeGeneratorOptions, AugmentationsGeneratorOptions {
    /**
      * Path of the file containing the map of module names to their CFN Scopes
      */
    scopeMapPath: string;
}
/**
 * A data structure holding information about a generated module.
 */
export interface ModuleMapEntry {
    name: string;
    definition?: pkglint.ModuleDefinition;
    scopes: string[];
    resources: Record<string, string>;
    files: string[];
}
/**
 * A data structure holding information about generated modules.
 * It maps module names to their full module definition, CFN scopes, resources and generated files.
 */
export interface ModuleMap {
    [moduleName: string]: ModuleMapEntry;
}
/**
 * Generates L1s for all submodules of a monomodule. Modules to generate are
 * chosen based on the contents of the `scopeMapPath` file. This is intended for
 * use in generated L1s in aws-cdk-lib.
 * @param outPath The root directory to generate L1s in
 * @param param1  Options
 * @returns       A ModuleMap containing the ModuleDefinition and CFN scopes for each generated module.
 */
export declare function generateAll(outPath: string, { scopeMapPath, ...options }: GenerateAllOptions): Promise<ModuleMap>;
export {};
