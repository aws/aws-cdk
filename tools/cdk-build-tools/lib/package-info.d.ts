/// <reference types="node" />
/**
 * Return the package JSON for the current package
 */
export declare function currentPackageJson(): any;
/**
 * Return the CDK build options
 */
export declare function cdkBuildOptions(): CDKBuildOptions;
/**
 * Whether this is a jsii package
 */
export declare function isJsii(): boolean;
export interface File {
    filename: string;
    path: string;
}
export declare function listFiles(dirName: string, predicate: (x: File) => boolean): Promise<File[]>;
/**
 * Return the unit test files for this package
 */
export declare function unitTestFiles(): Promise<File[]>;
export declare function hasIntegTests(): Promise<boolean>;
export interface CompilerOverrides {
    eslint?: string;
    jsii?: string;
    tsc?: string;
}
/**
 * Return the compiler for this package (either tsc or jsii)
 */
export declare function packageCompiler(compilers: CompilerOverrides): string[];
/**
 * Return the command defined in scripts.gen if exists
 */
export declare function genScript(): string | undefined;
export interface CDKBuildOptions {
    /**
     * What CloudFormation scope to generate resources for, if any
     */
    cloudformation?: string | string[];
    /**
     * Options passed to `eslint` invocations.
     */
    eslint?: {
        /**
         * Disable linting
         * @default false
         */
        disable?: boolean;
    };
    pkglint?: {
        disable?: boolean;
    };
    /**
     * An optional command (formatted as a list of strings) to run before building
     *
     * (Typically a code generator)
     */
    pre?: string[];
    /**
     * An optional command (formatted as a list of strings) to run after building
     *
     * (Schema generator for example)
     */
    post?: string[];
    /**
     * An optional command (formatted as a list of strings) to run before testing.
     */
    test?: string[];
    /**
     * Whether the package uses Jest for tests.
     * The default is NodeUnit,
     * but we want to eventually move all of them to Jest.
     */
    jest?: boolean;
    /**
     * Environment variables to be passed to 'cdk-build' and all of its child processes.
     */
    env?: NodeJS.ProcessEnv;
}
/**
 * Return a full path to the config file in this package
 *
 * The addressed file is cdk-build-tools/config/FILE.
 */
export declare function configFilePath(fileName: string): string;
