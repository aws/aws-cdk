export declare const PKGLINT_IGNORES: string[];
/**
 * Return all package JSONs in the root directory
 */
export declare function findPackageJsons(root: string): PackageJson[];
export declare type Fixer = () => void;
export interface Report {
    ruleName: string;
    message: string;
    fix?: Fixer;
}
/**
 * Class representing a package.json file and the issues we found with it
 */
export declare class PackageJson {
    readonly fullPath: string;
    static fromDirectory(dir: string): PackageJson;
    readonly json: {
        [key: string]: any;
    };
    readonly packageRoot: string;
    readonly packageName: string;
    private readonly includeRules;
    private readonly excludeRules;
    private _reports;
    constructor(fullPath: string);
    shouldApply(rule: ValidationRule): boolean;
    save(): void;
    report(report: Report): void;
    get reports(): Report[];
    get dependencies(): {
        [key: string]: string;
    };
    get devDependencies(): {
        [key: string]: string;
    };
    get peerDependencies(): {
        [key: string]: string;
    };
    applyFixes(): void;
    displayReports(relativeTo: string): void;
    get hasReports(): boolean;
    /**
     * Return the NPM script with the given name
     */
    npmScript(name: string): string;
    /**
     * Apply a function the script
     *
     * If you want to change a script, use this to prevent multiple
     * fixes going { read, read, write, write } on the same script.
     */
    changeNpmScript(name: string, fn: (script: string) => string): void;
    /**
     * Append a command to the given script, implicitly adding the '&&'
     */
    appendToNpmScript(name: string, command: string): void;
    /**
     * Return the version of the devDependency on `module`.
     */
    getDevDependency(moduleOrPredicate: ((s: string) => boolean) | string): string | undefined;
    /**
     * @param predicate the predicate to select dependencies to be extracted
     * @returns the list of dependencies matching a pattern.
     */
    getDependencies(predicate: (s: string) => boolean): Array<{
        name: string;
        version: string;
    }>;
    /**
     * Retrieves all packages that are bundled in, including transitive bundled dependency of a bundled dependency.
     */
    getAllBundledDependencies(): string[];
    /**
     * Adds a devDependency to the package.
     */
    addDevDependency(module: string, version?: string): void;
    /**
     * Adds a dependency to the package.
     */
    addDependency(module: string, version?: string): void;
    removeDevDependency(moduleOrPredicate: ((s: string) => boolean) | string): void;
    removeDependency(moduleOrPredicate: ((s: string) => boolean) | string): void;
    addPeerDependency(module: string, version: string): void;
    /**
     * Whether the package-level file contains the given line
     */
    fileContainsSync(fileName: string, line: string): boolean;
    /**
     * Whether the package-level file begins with the specified lines
     */
    fileBeginsWith(fileName: string, ...lines: string[]): boolean;
    /**
     * Whether the package-level file content is the given text
     */
    fileIsSync(fileName: string, content: string): boolean;
    /**
     * Add the given line to the package-level file
     */
    addToFileSync(fileName: string, line: string): void;
    removeFromFileSync(fileName: string, line: string): void;
    /**
     * Writes the given content into a file.
     * @param fileName the name of the package-level file to write.
     * @param content  the desired content of the file.
     */
    writeFileSync(fileName: string, content: string): void;
    private readFileSync;
    private readFileLinesSync;
    private writeFileLinesSync;
}
/**
 * Interface for validation rules
 */
export declare abstract class ValidationRule {
    abstract readonly name: string;
    /**
     * Will be executed for every package definition once, used to collect statistics
     */
    prepare(_pkg: PackageJson): void;
    /**
     * Will be executed for every package definition once, should mutate the package object
     */
    abstract validate(pkg: PackageJson): void;
}
