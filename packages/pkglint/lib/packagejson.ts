import fs = require('fs-extra');
import path = require('path');

/**
 * Return all package JSONs in the root directory
 */
export function findPackageJsons(root: string): PackageJson[] {
    const ret: PackageJson[] = [];

    function recurse(dir: string) {
        if (!fs.existsSync(dir)) {
            throw new Error('No such directory: ' + dir);
        }

        if (fs.existsSync(path.join(dir, '.no-packagejson-validator'))) {
            // Don't recurse here
            return;
        }

        for (const file of fs.readdirSync(dir)) {
            const fullPath = path.join(dir, file);
            if (file === 'package.json') {
                ret.push(new PackageJson(fullPath));
            }

            // Recurse into all dirs except node_modules
            if (file !== 'node_modules' && (fs.lstatSync(fullPath)).isDirectory()) {
                recurse(fullPath);
            }
        } }

    recurse(root);
    return ret;
}

export type Fixer = () => void;

export interface Report {
    message: string;

    fix?: Fixer;
}

/**
 * Class representing a package.json file and the issues we found with it
 */
export class PackageJson {
    public readonly json: any;
    public readonly packageRoot: string;
    private reports: Report[] = [];

    constructor(public readonly fullPath: string) {
        this.json = JSON.parse(fs.readFileSync(fullPath, { encoding: 'utf-8' }));
        this.packageRoot = path.dirname(path.resolve(fullPath));
    }

    public save() {
        fs.writeJSONSync(this.fullPath, this.json, { encoding: 'utf-8', spaces: 2 });
    }

    public report(report: Report) {
        this.reports.push(report);
    }

    public applyFixes() {
        const fixable = this.reports.filter(r => r.fix);
        const nonFixable = this.reports.filter(r => !r.fix);

        if (fixable.length > 0) {
            process.stderr.write(`${path.resolve(this.fullPath)}\n`);
        }

        for (const report of fixable) {
            process.stderr.write(`Fixing: ${report.message}\n`);
            report.fix!();
        }

        this.save();
        this.reports = nonFixable;
    }

    public displayReports() {
        if (this.hasReports) {
            process.stderr.write(`${path.resolve(this.fullPath)}\n`);
            this.reports.forEach(report => process.stderr.write(`- ${report.message}\n`));
        }
    }

    public get hasReports() {
        return this.reports.length > 0;
    }

    /**
     * Return the NPM script with the given name
     */
    public npmScript(name: string): string {
        return (this.json.scripts || {})[name] || '';
    }

    public replaceNpmScript(name: string, command: string) {
        if (!('scripts' in this.json)) {
            this.json.scripts = {};
        }

        this.json.scripts[name] = command;
    }

    /**
     * Append a command to the given script, implicitly adding the '&&'
     */
    public appendToNpmScript(name: string, command: string) {
        if (!('scripts' in this.json)) {
            this.json.scripts = {};
        }

        const script = this.json.scripts[name] || '';
        if (script) {
            this.json.scripts[name] = script + ' && ' + command;
        } else {
            this.json.scripts[name] = command;
        }
    }

    /**
     * @returns True if the package has a devDependency on `module`.
     */
    public hasDevDependency(moduleOrPredicate: ((s: string) => boolean) | string) {
        if (!('devDependencies' in this.json)) {
            return false;
        }

        const predicate: (s: string) => boolean = typeof(moduleOrPredicate) === 'string'
            ? x => x === moduleOrPredicate
            : moduleOrPredicate;

        const deps = this.json.devDependencies;
        return Object.keys(deps).find(predicate);
    }

    /**
     * Adds a devDependency to the package.
     */
    public addDevDependency(module: string, version = '*') {
        if (!('devDependencies' in this.json)) {
            this.json.devDependencies = {};
        }

        this.json.devDependencies[module] = version;
    }

    public removeDevDependency(moduleOrPredicate: ((s: string) => boolean) | string) {
        if (!('devDependencies' in this.json)) {
            return;
        }

        const predicate: (s: string) => boolean = typeof(moduleOrPredicate) === 'string'
            ? x => x === moduleOrPredicate
            : moduleOrPredicate;

        for (const m of Object.keys(this.json.devDependencies)) {
            if (predicate(m)) {
                delete this.json.devDependencies[m];
            }
        }
    }
}

/**
 * Interface for validation rules
 */
export abstract class ValidationRule {
    /**
     * Will be executed for every package definition once, used to collect statistics
     */
    public prepare(_pkg: PackageJson): void {
        // Nothing
    }

    /**
     * Will be executed for every package definition once, should mutate the package object
     */
    public abstract validate(pkg: PackageJson): void;
}