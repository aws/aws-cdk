"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationRule = exports.PackageJson = exports.findPackageJsons = exports.PKGLINT_IGNORES = void 0;
const path = require("path");
const colors = require("colors/safe");
const fs = require("fs-extra");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bundled = require('npm-bundled');
// do not descend into these directories when searching for `package.json` files.
exports.PKGLINT_IGNORES = ['node_modules', 'cdk.out', '.cdk.staging'];
/**
 * Return all package JSONs in the root directory
 */
function findPackageJsons(root) {
    const ret = [];
    function recurse(dir) {
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
            // Recurse into all dirs except ignored dirs
            if (!exports.PKGLINT_IGNORES.includes(file) && (fs.lstatSync(fullPath)).isDirectory()) {
                recurse(fullPath);
            }
        }
    }
    recurse(root);
    return ret;
}
exports.findPackageJsons = findPackageJsons;
/**
 * Class representing a package.json file and the issues we found with it
 */
class PackageJson {
    constructor(fullPath) {
        this.fullPath = fullPath;
        this._reports = [];
        this.json = JSON.parse(fs.readFileSync(fullPath, { encoding: 'utf-8' }));
        this.packageRoot = path.dirname(path.resolve(fullPath));
        this.packageName = this.json.name;
        const disabled = this.json.pkglint && this.json.pkglint.ignore;
        this.includeRules = _forceArray(this.json.pkglint && this.json.pkglint.include) || [/^.*$/];
        this.excludeRules = _forceArray(this.json.pkglint && this.json.pkglint.exclude) || (disabled ? [/^.*$/] : []);
        function _forceArray(arg) {
            if (arg == null) {
                return arg;
            }
            if (Array.isArray(arg)) {
                return arg.map(_toRegExp);
            }
            return [_toRegExp(arg)];
        }
        function _toRegExp(pattern) {
            pattern = pattern.split('*').map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
            return new RegExp(`^${pattern}$`);
        }
    }
    static fromDirectory(dir) {
        return new PackageJson(path.join(dir, 'package.json'));
    }
    shouldApply(rule) {
        const included = this.includeRules.find(r => r.test(rule.name)) != null;
        const excluded = this.excludeRules.find(r => r.test(rule.name)) != null;
        return included && !excluded;
    }
    save() {
        fs.writeJSONSync(this.fullPath, this.json, { encoding: 'utf-8', spaces: 2 });
    }
    report(report) {
        this._reports.push(report);
    }
    get reports() {
        return this._reports;
    }
    get dependencies() {
        return this.json.dependencies || {};
    }
    get devDependencies() {
        return this.json.devDependencies || {};
    }
    get peerDependencies() {
        return this.json.peerDependencies || {};
    }
    applyFixes() {
        const fixable = this._reports.filter(r => r.fix);
        const nonFixable = this._reports.filter(r => !r.fix);
        if (fixable.length > 0) {
            process.stderr.write(`${path.resolve(this.fullPath)}\n`);
        }
        for (const report of fixable) {
            process.stderr.write(`Fixing: ${report.message}\n`);
            report.fix();
        }
        this.save();
        this._reports = nonFixable;
    }
    displayReports(relativeTo) {
        if (this.hasReports) {
            process.stderr.write(`In package ${colors.blue(path.relative(relativeTo, this.fullPath))}\n`);
            this._reports.forEach(report => {
                process.stderr.write(`- [${colors.yellow(report.ruleName)}] ${report.message}${report.fix ? colors.green(' (fixable)') : ''}\n`);
            });
        }
    }
    get hasReports() {
        return this._reports.length > 0;
    }
    /**
     * Return the NPM script with the given name
     */
    npmScript(name) {
        return (this.json.scripts || {})[name] || '';
    }
    /**
     * Apply a function the script
     *
     * If you want to change a script, use this to prevent multiple
     * fixes going { read, read, write, write } on the same script.
     */
    changeNpmScript(name, fn) {
        const script = this.npmScript(name);
        if (!('scripts' in this.json)) {
            this.json.scripts = {};
        }
        this.json.scripts[name] = fn(script);
    }
    /**
     * Append a command to the given script, implicitly adding the '&&'
     */
    appendToNpmScript(name, command) {
        if (!('scripts' in this.json)) {
            this.json.scripts = {};
        }
        const script = this.json.scripts[name] || '';
        if (script) {
            this.json.scripts[name] = script + ' && ' + command;
        }
        else {
            this.json.scripts[name] = command;
        }
    }
    /**
     * Return the version of the devDependency on `module`.
     */
    getDevDependency(moduleOrPredicate) {
        if (!('devDependencies' in this.json)) {
            return undefined;
        }
        const predicate = typeof (moduleOrPredicate) === 'string'
            ? x => x === moduleOrPredicate
            : moduleOrPredicate;
        const deps = this.json.devDependencies;
        const key = Object.keys(deps).find(predicate);
        return key !== undefined ? deps[key] : undefined;
    }
    /**
     * @param predicate the predicate to select dependencies to be extracted
     * @returns the list of dependencies matching a pattern.
     */
    getDependencies(predicate) {
        return Object.keys(this.json.dependencies || {}).filter(predicate).map(name => ({ name, version: this.json.dependencies[name] }));
    }
    /**
     * Retrieves all packages that are bundled in, including transitive bundled dependency of a bundled dependency.
     */
    getAllBundledDependencies() {
        return bundled.sync({ path: this.packageRoot });
    }
    /**
     * Adds a devDependency to the package.
     */
    addDevDependency(module, version = '*') {
        if (!('devDependencies' in this.json)) {
            this.json.devDependencies = {};
        }
        this.json.devDependencies[module] = version;
    }
    /**
     * Adds a dependency to the package.
     */
    addDependency(module, version = '*') {
        if (!('dependencies' in this.json)) {
            this.json.dependencies = {};
        }
        this.json.dependencies[module] = version;
    }
    removeDevDependency(moduleOrPredicate) {
        if (!('devDependencies' in this.json)) {
            return;
        }
        const predicate = typeof (moduleOrPredicate) === 'string'
            ? x => x === moduleOrPredicate
            : moduleOrPredicate;
        for (const m of Object.keys(this.json.devDependencies)) {
            if (predicate(m)) {
                delete this.json.devDependencies[m];
            }
        }
    }
    removeDependency(moduleOrPredicate) {
        if (!('dependencies' in this.json)) {
            return;
        }
        const predicate = typeof (moduleOrPredicate) === 'string'
            ? x => x === moduleOrPredicate
            : moduleOrPredicate;
        for (const m of Object.keys(this.json.dependencies)) {
            if (predicate(m)) {
                delete this.json.dependencies[m];
            }
        }
    }
    addPeerDependency(module, version) {
        if (!('peerDependencies' in this.json)) {
            this.json.peerDependencies = {};
        }
        this.peerDependencies[module] = version;
    }
    /**
     * Whether the package-level file contains the given line
     */
    fileContainsSync(fileName, line) {
        const lines = this.readFileLinesSync(fileName);
        return lines.indexOf(line) !== -1;
    }
    /**
     * Whether the package-level file begins with the specified lines
     */
    fileBeginsWith(fileName, ...lines) {
        const fileLines = this.readFileLinesSync(fileName).slice(0, lines.length);
        return fileLines.every((fileLine, index) => fileLine === lines[index]);
    }
    /**
     * Whether the package-level file content is the given text
     */
    fileIsSync(fileName, content) {
        const data = this.readFileSync(fileName);
        return data === content;
    }
    /**
     * Add the given line to the package-level file
     */
    addToFileSync(fileName, line) {
        const lines = this.readFileLinesSync(fileName);
        if (lines.indexOf(line) === -1) {
            lines.push(line);
            this.writeFileLinesSync(fileName, lines);
        }
    }
    removeFromFileSync(fileName, line) {
        const lines = this.readFileLinesSync(fileName).filter(l => l.trim() !== line);
        this.writeFileLinesSync(fileName, lines);
    }
    /**
     * Writes the given content into a file.
     * @param fileName the name of the package-level file to write.
     * @param content  the desired content of the file.
     */
    writeFileSync(fileName, content) {
        const fullPath = path.join(this.packageRoot, fileName);
        fs.writeFileSync(fullPath, content, { encoding: 'utf-8' });
    }
    readFileSync(fileName) {
        const fullPath = path.join(this.packageRoot, fileName);
        if (!fs.existsSync(fullPath)) {
            return '';
        }
        return fs.readFileSync(fullPath, { encoding: 'utf-8' });
    }
    readFileLinesSync(fileName) {
        return this.readFileSync(fileName).split('\n');
    }
    writeFileLinesSync(fileName, lines) {
        this.writeFileSync(fileName, lines.join('\n'));
    }
}
exports.PackageJson = PackageJson;
/**
 * Interface for validation rules
 */
class ValidationRule {
    /**
     * Will be executed for every package definition once, used to collect statistics
     */
    prepare(_pkg) {
        // Nothing
    }
}
exports.ValidationRule = ValidationRule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZWpzb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYWNrYWdlanNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0NBQXNDO0FBQ3RDLCtCQUErQjtBQUMvQixpRUFBaUU7QUFDakUsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRXZDLGlGQUFpRjtBQUNwRSxRQUFBLGVBQWUsR0FBRyxDQUFDLGNBQWMsRUFBRSxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFFM0U7O0dBRUc7QUFDSCxTQUFnQixnQkFBZ0IsQ0FBQyxJQUFZO0lBQzNDLE1BQU0sR0FBRyxHQUFrQixFQUFFLENBQUM7SUFFOUIsU0FBUyxPQUFPLENBQUMsR0FBVztRQUMxQixJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQzlDO1FBRUQsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLDJCQUEyQixDQUFDLENBQUMsRUFBRTtZQUM5RCxxQkFBcUI7WUFDckIsT0FBTztTQUNSO1FBRUQsS0FBSyxNQUFNLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3RDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3RDLElBQUksSUFBSSxLQUFLLGNBQWMsRUFBRTtnQkFDM0IsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2FBQ3JDO1lBRUQsNENBQTRDO1lBQzVDLElBQUksQ0FBQyx1QkFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FB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