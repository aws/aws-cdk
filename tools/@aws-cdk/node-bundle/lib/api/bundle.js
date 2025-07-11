"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bundle = void 0;
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const esbuild = __importStar(require("esbuild"));
const fs = __importStar(require("fs-extra"));
const semver = __importStar(require("semver"));
const _attributions_1 = require("./_attributions");
const _shell_1 = require("./_shell");
const violation_1 = require("./violation");
const DEFAULT_ALLOWED_LICENSES = [
    'Apache-2.0',
    'MIT',
    'BSD-3-Clause',
    'ISC',
    'BSD-2-Clause',
    '0BSD',
    'MIT OR Apache-2.0'
];
/**
 * Bundle class to validate and pack nodejs bundles.
 */
class Bundle {
    constructor(props) {
        var _a, _b, _c, _d, _e;
        this.packageDir = props.packageDir;
        this.noticePath = (_a = props.attributionsFile) !== null && _a !== void 0 ? _a : 'THIRD_PARTY_LICENSES';
        this.manifest = fs.readJsonSync(path.join(this.packageDir, 'package.json'));
        this.externals = (_b = props.externals) !== null && _b !== void 0 ? _b : {};
        this.resources = (_c = props.resources) !== null && _c !== void 0 ? _c : {};
        this.test = props.test;
        this.allowedLicenses = (_d = props.allowedLicenses) !== null && _d !== void 0 ? _d : DEFAULT_ALLOWED_LICENSES;
        this.dontAttribute = props.dontAttribute;
        this.entryPoints = {};
        this.sourcemap = props.sourcemap;
        this.minify = props.minify;
        this.minifyWhitespace = props.minifyWhitespace;
        this.minifyIdentifiers = props.minifyIdentifiers;
        this.minifySyntax = props.minifySyntax;
        const entryPoints = (_e = props.entryPoints) !== null && _e !== void 0 ? _e : (this.manifest.main ? [this.manifest.main] : []);
        if (entryPoints.length === 0) {
            throw new Error('Must configure at least 1 entrypoint');
        }
        for (const entrypoint of entryPoints) {
            if (!fs.existsSync(path.join(this.packageDir, entrypoint))) {
                throw new Error(`Unable to locate entrypoint: ${entrypoint}`);
            }
            this.entryPoints[entrypoint.replace('.js', '')] = entrypoint;
        }
    }
    /**
     * Validate the bundle for violations.
     *
     * If `fix` is set to true, this method will return the remaining
     * violations after the fixes were applied.
     *
     * This method never throws. The Caller is responsible for inspecting the
     * returned report and act accordingly.
     */
    validate(options = {}) {
        var _a;
        const fix = (_a = options.fix) !== null && _a !== void 0 ? _a : false;
        // first validate
        const circularImports = this.validateCircularImports();
        const resources = this.validateResources();
        const attributions = this.validateAttributions();
        const report = new violation_1.ViolationsReport([...circularImports, ...resources, ...attributions]);
        if (!fix) {
            return report;
        }
        for (const violation of report.violations) {
            if (violation.fix) {
                violation.fix();
            }
        }
        // return the un fixable violations
        return new violation_1.ViolationsReport(report.violations.filter(v => !v.fix));
    }
    /**
     * Write the bundle version of the project to a temp directory.
     * This directory is what the tool will end up packing.
     *
     * Returns the temp directory location.
     */
    write() {
        const target = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-write-'));
        // we definitely don't need these directories in the package
        // so no need to copy them over.
        const ignoreDirectories = ['node_modules', '.git'];
        // copy the entire project since we are retaining the original files.
        fs.copySync(this.packageDir, target, { filter: n => !n.split(path.sep).some((p => ignoreDirectories.includes(p))) });
        // clone the original manifest since we are going to
        // to mutate it.
        const manifest = { ...this.manifest };
        // manifest mutations
        this.removeDependencies(manifest);
        this.addExternals(manifest);
        // write artifacts
        this.writeOutputs(target);
        this.writeResources(target);
        this.writeManifest(target, manifest);
        return target;
    }
    /**
     * Write the bundle and create the tarball.
     *
     * Returns the location of the tarball.
     */
    pack(options = {}) {
        var _a;
        const target = (_a = options.target) !== null && _a !== void 0 ? _a : this.packageDir;
        const report = this.validate();
        if (!report.success) {
            throw new Error(`Unable to pack due to validation errors.\n\n${report.summary}`);
        }
        if (!fs.existsSync(target)) {
            throw new Error(`Target doesnt exist: ${target}`);
        }
        // resolve symlinks.
        const realTarget = fs.realpathSync(target);
        if (!fs.lstatSync(realTarget).isDirectory()) {
            throw new Error(`Target must be a directory: ${target}`);
        }
        console.log('Writing bundle');
        const bundleDir = this.write();
        try {
            if (this.test) {
                const command = `${path.join(bundleDir, this.test)}`;
                console.log(`Running sanity test: ${command}`);
                (0, _shell_1.shell)(command, { cwd: bundleDir });
            }
            // create the tarball
            console.log('Packing');
            const tarball = (0, _shell_1.shell)('npm pack', { quiet: true, cwd: bundleDir }).trim();
            const dest = path.join(realTarget, tarball);
            fs.copySync(path.join(bundleDir, tarball), dest, { recursive: true });
            return dest;
        }
        finally {
            fs.removeSync(bundleDir);
        }
    }
    get bundle() {
        if (this._bundle) {
            return this._bundle;
        }
        this._bundle = this.esbuild();
        return this._bundle;
    }
    get dependencies() {
        if (this._dependencies) {
            return this._dependencies;
        }
        const inputs = Object.keys(this.bundle.metafile.inputs);
        const packages = new Set(Array.from(inputs).map(i => this.closestPackagePath(path.join(this.packageDir, i))));
        this._dependencies = Array.from(packages).map(p => this.createPackage(p)).filter(d => d.name !== undefined && d.name !== this.manifest.name);
        return this._dependencies;
    }
    get dependenciesRoot() {
        if (this._dependenciesRoot) {
            return this._dependenciesRoot;
        }
        const lcp = longestCommonParent(this.dependencies.map(d => d.path));
        this._dependenciesRoot = this.closestPackagePath(lcp);
        return this._dependenciesRoot;
    }
    get attributions() {
        if (this._attributions == null) {
            this._attributions = new _attributions_1.Attributions({
                packageDir: this.packageDir,
                packageName: this.manifest.name,
                filePath: this.noticePath,
                dependencies: this.dependencies,
                dependenciesRoot: this.dependenciesRoot,
                exclude: this.dontAttribute,
                allowedLicenses: this.allowedLicenses,
            });
        }
        return this._attributions;
    }
    /**
     * Find a single version number for the given external dependency.
     *
     * Finds the smallest possible range that contains all version identifiers,
     * or fails if it couldn't be found.
     */
    findExternalDependencyVersion(name) {
        var _a, _b;
        const versionTracing = new Array();
        let version;
        function mergeVersion(newV, source) {
            versionTracing.push(`${newV} from ${source}`);
            // newV <= version (or no version yet), use newV
            if (!version || semver.subset(newV, version)) {
                version = newV;
            }
            else if (!semver.subset(version, newV)) {
                throw new Error(`Unable to determine version for external package ${name}: no single minimal range in: ${versionTracing}`);
            }
        }
        // external dependencies will not exist in the dependencies list
        // since esbuild skips over them. but they will exist as a dependency of
        // one of them (or of us)
        for (const pkg of [...this.dependencies, this.createPackage(this.packageDir)]) {
            const manifest = fs.readJSONSync(path.join(pkg.path, 'package.json'));
            const runtime = ((_a = manifest.dependencies) !== null && _a !== void 0 ? _a : {})[name];
            const optional = ((_b = manifest.optionalDependencies) !== null && _b !== void 0 ? _b : {})[name];
            if (runtime) {
                mergeVersion(runtime, pkg.name);
            }
            if (optional) {
                mergeVersion(optional, pkg.name);
            }
        }
        if (!version) {
            throw new Error(`Unable to detect version for external dependency: ${name}`);
        }
        const pin = (version) => (version.startsWith('^') || version.startsWith('~')) ? version.substring(1) : version;
        return pin(version);
    }
    closestPackagePath(fdp) {
        if (fs.existsSync(path.join(fdp, 'package.json'))) {
            return fdp;
        }
        if (path.dirname(fdp) === fdp) {
            throw new Error('Unable to find package manifest');
        }
        return this.closestPackagePath(path.dirname(fdp));
    }
    createPackage(packageDir) {
        const manifestPath = path.join(packageDir, 'package.json');
        const manifest = fs.readJSONSync(manifestPath);
        return { path: packageDir, name: manifest.name, version: manifest.version };
    }
    esbuild() {
        var _a, _b;
        const bundle = esbuild.buildSync({
            entryPoints: this.entryPoints,
            bundle: true,
            target: 'node14',
            platform: 'node',
            sourcemap: this.sourcemap,
            metafile: true,
            minify: this.minify,
            minifyWhitespace: this.minifyWhitespace,
            minifyIdentifiers: this.minifyIdentifiers,
            minifySyntax: this.minifySyntax,
            treeShaking: true,
            absWorkingDir: this.packageDir,
            external: [...((_a = this.externals.dependencies) !== null && _a !== void 0 ? _a : []), ...((_b = this.externals.optionalDependencies) !== null && _b !== void 0 ? _b : [])],
            write: false,
            outdir: this.packageDir,
            allowOverwrite: true,
        });
        if (bundle.warnings.length > 0) {
            // esbuild warnings are usually important, lets try to be strict here.
            // the warnings themselves are printed on screen.
            throw new Error(`Found ${bundle.warnings.length} bundling warnings (See above)`);
        }
        return bundle;
    }
    validateCircularImports() {
        console.log('Validating circular imports');
        const violations = [];
        const packages = [this.packageDir, ...this.dependencies.map(d => d.path)];
        try {
            // we don't use the programmatic API since it only offers an async API.
            // prefer to stay sync for now since its easier to integrate with other tooling.
            // will offer an async API further down the road.
            const command = `${require.resolve('madge/bin/cli.js')} --json --warning --no-color --no-spinner --circular --extensions js ${packages.join(' ')}`;
            (0, _shell_1.shell)(command, { quiet: true });
        }
        catch (e) {
            const imports = JSON.parse(e.stdout.toString().trim());
            for (const imp of imports) {
                violations.push({ type: violation_1.ViolationType.CIRCULAR_IMPORT, message: `${imp.join(' -> ')}` });
            }
        }
        return violations;
    }
    validateResources() {
        console.log('Validating resources');
        const violations = [];
        for (const [src, _] of Object.entries(this.resources)) {
            if (!fs.existsSync(path.join(this.packageDir, src))) {
                violations.push({
                    type: violation_1.ViolationType.MISSING_RESOURCE,
                    message: `Unable to find resource (${src}) relative to the package directory`,
                });
            }
        }
        return violations;
    }
    validateAttributions() {
        console.log('Validating attributions');
        return this.attributions.validate().violations;
    }
    addExternals(manifest) {
        var _a, _b, _c, _d;
        // external dependencies should be specified as runtime dependencies
        for (const external of (_a = this.externals.dependencies) !== null && _a !== void 0 ? _a : []) {
            const version = this.findExternalDependencyVersion(external);
            manifest.dependencies = (_b = manifest.dependencies) !== null && _b !== void 0 ? _b : {};
            manifest.dependencies[external] = version;
        }
        // external dependencies should be specified as optional dependencies
        for (const external of (_c = this.externals.optionalDependencies) !== null && _c !== void 0 ? _c : []) {
            const version = this.findExternalDependencyVersion(external);
            manifest.optionalDependencies = (_d = manifest.optionalDependencies) !== null && _d !== void 0 ? _d : {};
            manifest.optionalDependencies[external] = version;
        }
    }
    removeDependencies(manifest) {
        var _a;
        for (const [d, v] of Object.entries(this.manifest.dependencies)) {
            manifest.devDependencies = (_a = manifest.devDependencies) !== null && _a !== void 0 ? _a : {};
            manifest.devDependencies[d] = v;
            delete manifest.dependencies[d];
        }
    }
    writeOutputs(workDir) {
        var _a;
        for (const output of (_a = this.bundle.outputFiles) !== null && _a !== void 0 ? _a : []) {
            const out = output.path.replace(this.packageDir, workDir);
            fs.writeFileSync(out, output.contents);
        }
    }
    writeResources(workdir) {
        for (const [src, dst] of Object.entries(this.resources)) {
            const to = path.join(workdir, dst);
            fs.copySync(path.join(this.packageDir, src), to, { recursive: true });
        }
    }
    writeManifest(workDir, manifest) {
        fs.writeFileSync(path.join(workDir, 'package.json'), JSON.stringify(manifest, null, 2));
    }
}
exports.Bundle = Bundle;
function longestCommonParent(paths) {
    function _longestCommonParent(p1, p2) {
        const dirs1 = p1.split(path.sep);
        const dirs2 = p2.split(path.sep);
        const parent = [];
        for (let i = 0; i < Math.min(dirs1.length, dirs2.length); i++) {
            if (dirs1[i] !== dirs2[i])
                break;
            parent.push(dirs1[i]);
        }
        return parent.join(path.sep);
    }
    return paths.reduce(_longestCommonParent);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwaS9idW5kbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBeUI7QUFDekIsMkNBQTZCO0FBQzdCLGlEQUFtQztBQUNuQyw2Q0FBK0I7QUFDL0IsK0NBQWlDO0FBQ2pDLG1EQUErQztBQUMvQyxxQ0FBaUM7QUFDakMsMkNBQXlFO0FBRXpFLE1BQU0sd0JBQXdCLEdBQUc7SUFDL0IsWUFBWTtJQUNaLEtBQUs7SUFDTCxjQUFjO0lBQ2QsS0FBSztJQUNMLGNBQWM7SUFDZCxNQUFNO0lBQ04sbUJBQW1CO0NBQ3BCLENBQUM7QUE4SkY7O0dBRUc7QUFDSCxNQUFhLE1BQU07SUF3QmpCLFlBQVksS0FBa0I7O1FBQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQUEsS0FBSyxDQUFDLGdCQUFnQixtQ0FBSSxzQkFBc0IsQ0FBQztRQUNuRSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFBLEtBQUssQ0FBQyxTQUFTLG1DQUFJLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQUEsS0FBSyxDQUFDLFNBQVMsbUNBQUksRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsZUFBZSxHQUFHLE1BQUEsS0FBSyxDQUFDLGVBQWUsbUNBQUksd0JBQXdCLENBQUM7UUFDekUsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO1FBQ3pDLElBQUks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LENBQUM7SUFDL0IsQ0FBQztJQUVELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzVDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBvcyBmcm9tICdvcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZXNidWlsZCBmcm9tICdlc2J1aWxkJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCAqIGFzIHNlbXZlciBmcm9tICdzZW12ZXInO1xuaW1wb3J0IHsgQXR0cmlidXRpb25zIH0gZnJvbSAnLi9fYXR0cmlidXRpb25zJztcbmltcG9ydCB7IHNoZWxsIH0gZnJvbSAnLi9fc2hlbGwnO1xuaW1wb3J0IHsgVmlvbGF0aW9uLCBWaW9sYXRpb25UeXBlLCBWaW9sYXRpb25zUmVwb3J0IH0gZnJvbSAnLi92aW9sYXRpb24nO1xuXG5jb25zdCBERUZBVUxUX0FMTE9XRURfTElDRU5TRVMgPSBbXG4gICdBcGFjaGUtMi4wJyxcbiAgJ01JVCcsXG4gICdCU0QtMy1DbGF1c2UnLFxuICAnSVNDJyxcbiAgJ0JTRC0yLUNsYXVzZScsXG4gICcwQlNEJyxcbiAgJ01JVCBPUiBBcGFjaGUtMi4wJ1xuXTtcblxuLyoqXG4gKiBCdW5kbGluZyBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJ1bmRsZVByb3BzIHtcblxuICAvKipcbiAgICogRGlyZWN0b3J5IHdoZXJlIHRoZSBwYWNrYWdlIHRvIGJ1bmRsZSBpcyBsb2NhdGVkIGF0LlxuICAgKi9cbiAgcmVhZG9ubHkgcGFja2FnZURpcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGVudHJ5LXBvaW50cyB0byBidW5kbGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlICdtYWluJyBmaWxlIGFzIHNwZWNpZmllZCBpbiBwYWNrYWdlLmpzb24uXG4gICAqL1xuICByZWFkb25seSBlbnRyeVBvaW50cz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBQYXRoIHRvIGF0dHJpYnV0aW9ucyBmaWxlIHRoYXQgd2lsbCBiZSBjcmVhdGVkIC8gdmFsaWRhdGVkLlxuICAgKiBUaGlzIHBhdGggaXMgcmVsYXRpdmUgdG8gdGhlIHBhY2thZ2UgZGlyZWN0b3J5LlxuICAgKlxuICAgKiBAZGVmYXVsdCAnVEhJUkRfUEFSVFlfTElDRU5TRVMnXG4gICAqL1xuICByZWFkb25seSBhdHRyaWJ1dGlvbnNGaWxlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBFeHRlcm5hbCBwYWNrYWdlcyB0aGF0IGNhbm5vdCBiZSBidW5kbGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGV4dGVybmFsIHJlZmVyZW5jZXMuXG4gICAqL1xuICByZWFkb25seSBleHRlcm5hbHM/OiBFeHRlcm5hbHM7XG5cbiAgLyoqXG4gICAqIEV4dGVybmFsIHJlc291cmNlcyB0aGF0IG5lZWQgdG8gYmUgZW1iZWRkZWQgaW4gdGhlIGJ1bmRsZS5cbiAgICpcbiAgICogVGhlc2Ugd2lsbCBiZSBjb3BpZWQgb3ZlciB0byB0aGUgYXBwcm9wcmlhdGUgcGF0aHMgYmVmb3JlIHBhY2thZ2luZy5cbiAgICovXG4gIHJlYWRvbmx5IHJlc291cmNlcz86IHtbc3JjOiBzdHJpbmddOiBzdHJpbmd9O1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgbGljZW5zZXMgdGhhdCBhcmUgYWxsb3dlZCBmb3IgYnVuZGxpbmcuXG4gICAqIElmIGFueSBkZXBlbmRlbmN5IGNvbnRhaW5zIGEgbGljZW5zZSBub3QgaW4gdGhpcyBsaXN0LCBidW5kbGluZyB3aWxsIGZhaWwuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRGVmYXVsdCBsaXN0XG4gICAqL1xuICByZWFkb25seSBhbGxvd2VkTGljZW5zZXM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogUGFja2FnZXMgbWF0Y2hpbmcgdGhpcyByZWd1bGFyIGV4cHJlc3Npb24gd2lsbCBiZSBleGNsdWRlZCBmcm9tIGF0dHJpYnV0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZG9udEF0dHJpYnV0ZT86IHN0cmluZztcblxuICAvKipcbiAgICogQmFzaWMgc2FuaXR5IGNoZWNrIHRvIHJ1biBhZ2FpbnN0IHRoZSBjcmVhdGVkIGJ1bmRsZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBjaGVjay5cbiAgICovXG4gIHJlYWRvbmx5IHRlc3Q/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEluY2x1ZGUgYSBzb3VyY2VtYXAgaW4gdGhlIGJ1bmRsZS5cbiAgICpcbiAgICogQGRlZmF1bHQgXCJpbmxpbmVcIlxuICAgKi9cbiAgcmVhZG9ubHkgc291cmNlbWFwPzogJ2xpbmtlZCcgfCAnaW5saW5lJyB8ICdleHRlcm5hbCcgfCAnYm90aCc7XG5cbiAgLyoqXG4gICAqIE1pbmlmaWVzIHRoZSBidW5kbGVkIGNvZGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBtaW5pZnk/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHdoaXRlc3BhY2UgZnJvbSB0aGUgY29kZS5cbiAgICogVGhpcyBpcyBlbmFibGVkIGJ5IGRlZmF1bHQgd2hlbiBgbWluaWZ5YCBpcyB1c2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgbWluaWZ5V2hpdGVzcGFjZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFJlbmFtZXMgbG9jYWwgdmFyaWFibGVzIHRvIGJlIHNob3J0ZXIuXG4gICAqIFRoaXMgaXMgZW5hYmxlZCBieSBkZWZhdWx0IHdoZW4gYG1pbmlmeWAgaXMgdXNlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IG1pbmlmeUlkZW50aWZpZXJzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogUmV3cml0ZXMgc3ludGF4IHRvIGEgbW9yZSBjb21wYWN0IGZvcm1hdC5cbiAgICogVGhpcyBpcyBlbmFibGVkIGJ5IGRlZmF1bHQgd2hlbiBgbWluaWZ5YCBpcyB1c2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgbWluaWZ5U3ludGF4PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBgQnVuZGxlLnBhY2tgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJ1bmRsZVBhY2tPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSB0YXJnZXQgZGlyZWN0b3J5IHRvIGNyZWF0ZSB0aGUgcGFja2FnZSBpbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgcGFja2FnZSBkaXJlY3RvcnkuXG4gICAqL1xuICByZWFkb25seSB0YXJnZXQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnVuZGxlVmFsaWRhdGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIEF1dG9tYXRpY2FsbHkgZml4IGFueSAoZml4YWJsZSkgdmlvbGF0aW9ucy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGZpeD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogUGFja2FnZSBvbiB0aGUgbG9jYWwgZmlsZSBzeXN0ZW0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUGFja2FnZSB7XG4gIC8qKlxuICAgKiBQYXRoIG9mIHRoZSBkZXBlbmRlbmN5IG9uIHRoZSBsb2NhbCBmaWxlIHN5c3RlbS5cbiAgICovXG4gIHJlYWRvbmx5IHBhdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIERlcGVuZGVuY3kgbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgLyoqXG4gICAqIERlcGVuZGVuY3kgdmVyc2lvbi5cbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb246IHN0cmluZztcbn1cblxuLyoqXG4gKiBFeHRlcm5hbCBwYWNrYWdlcyB0aGF0IGNhbm5vdCBiZSBidW5kbGVkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV4dGVybmFscyB7XG5cbiAgLyoqXG4gICAqIEV4dGVybmFsIHBhY2thZ2VzIHRoYXQgc2hvdWxkIGJlIGxpc3RlZCBpbiB0aGUgYGRlcGVuZGVuY2llc2Agc2VjdGlvblxuICAgKiBvZiB0aGUgbWFuaWZlc3QuXG4gICAqL1xuICByZWFkb25seSBkZXBlbmRlbmNpZXM/OiByZWFkb25seSBzdHJpbmdbXTtcblxuICAvKipcbiAgICogRXh0ZXJuYWwgcGFja2FnZXMgdGhhdCBzaG91bGQgYmUgbGlzdGVkIGluIHRoZSBgb3B0aW9uYWxEZXBlbmRlbmNpZXNgIHNlY3Rpb25cbiAgICogb2YgdGhlIG1hbmlmZXN0LlxuICAgKi9cbiAgcmVhZG9ubHkgb3B0aW9uYWxEZXBlbmRlbmNpZXM/OiByZWFkb25seSBzdHJpbmdbXTtcblxufVxuXG4vKipcbiAqIEJ1bmRsZSBjbGFzcyB0byB2YWxpZGF0ZSBhbmQgcGFjayBub2RlanMgYnVuZGxlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEJ1bmRsZSB7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBtYW5pZmVzdDogYW55O1xuICBwcml2YXRlIHJlYWRvbmx5IG5vdGljZVBhdGg6IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IHBhY2thZ2VEaXI6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBlbnRyeVBvaW50czogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgcHJpdmF0ZSByZWFkb25seSBleHRlcm5hbHM6IEV4dGVybmFscztcbiAgcHJpdmF0ZSByZWFkb25seSByZXNvdXJjZXM6IHtbc3JjOiBzdHJpbmddOiBzdHJpbmd9O1xuICBwcml2YXRlIHJlYWRvbmx5IGFsbG93ZWRMaWNlbnNlczogc3RyaW5nW107XG4gIHByaXZhdGUgcmVhZG9ubHkgZG9udEF0dHJpYnV0ZT86IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSB0ZXN0Pzogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IHNvdXJjZW1hcD86ICdsaW5rZWQnIHwgJ2lubGluZScgfCAnZXh0ZXJuYWwnIHwgJ2JvdGgnO1xuICBwcml2YXRlIHJlYWRvbmx5IG1pbmlmeT86IGJvb2xlYW47XG4gIHByaXZhdGUgcmVhZG9ubHkgbWluaWZ5V2hpdGVzcGFjZT86IGJvb2xlYW47XG4gIHByaXZhdGUgcmVhZG9ubHkgbWluaWZ5SWRlbnRpZmllcnM/OiBib29sZWFuO1xuICBwcml2YXRlIHJlYWRvbmx5IG1pbmlmeVN5bnRheD86IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSBfYnVuZGxlPzogZXNidWlsZC5CdWlsZFJlc3VsdDtcbiAgcHJpdmF0ZSBfZGVwZW5kZW5jaWVzPzogUGFja2FnZVtdO1xuICBwcml2YXRlIF9kZXBlbmRlbmNpZXNSb290Pzogc3RyaW5nO1xuXG4gIHByaXZhdGUgX2F0dHJpYnV0aW9ucz86IEF0dHJpYnV0aW9ucztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogQnVuZGxlUHJvcHMpIHtcbiAgICB0aGlzLnBhY2thZ2VEaXIgPSBwcm9wcy5wYWNrYWdlRGlyO1xuICAgIHRoaXMubm90aWNlUGF0aCA9IHByb3BzLmF0dHJpYnV0aW9uc0ZpbGUgPz8gJ1RISVJEX1BBUlRZX0xJQ0VOU0VTJztcbiAgICB0aGlzLm1hbmlmZXN0ID0gZnMucmVhZEpzb25TeW5jKHBhdGguam9pbih0aGlzLnBhY2thZ2VEaXIsICdwYWNrYWdlLmpzb24nKSk7XG4gICAgdGhpcy5leHRlcm5hbHMgPSBwcm9wcy5leHRlcm5hbHMgPz8ge307XG4gICAgdGhpcy5yZXNvdXJjZXMgPSBwcm9wcy5yZXNvdXJjZXMgPz8ge307XG4gICAgdGhpcy50ZXN0ID0gcHJvcHMudGVzdDtcbiAgICB0aGlzLmFsbG93ZWRMaWNlbnNlcyA9IHByb3BzLmFsbG93ZWRMaWNlbnNlcyA/PyBERUZBVUxUX0FMTE9XRURfTElDRU5TRVM7XG4gICAgdGhpcy5kb250QXR0cmlidXRlID0gcHJvcHMuZG9udEF0dHJpYnV0ZTtcbiAgICB0aGlzLmVudHJ5UG9pbnRzID0ge307XG4gICAgdGhpcy5zb3VyY2VtYXAgPSBwcm9wcy5zb3VyY2VtYXA7XG4gICAgdGhpcy5taW5pZnkgPSBwcm9wcy5taW5pZnk7XG4gICAgdGhpcy5taW5pZnlXaGl0ZXNwYWNlID0gcHJvcHMubWluaWZ5V2hpdGVzcGFjZTtcbiAgICB0aGlzLm1pbmlmeUlkZW50aWZpZXJzID0gcHJvcHMubWluaWZ5SWRlbnRpZmllcnM7XG4gICAgdGhpcy5taW5pZnlTeW50YXggPSBwcm9wcy5taW5pZnlTeW50YXg7XG5cbiAgICBjb25zdCBlbnRyeVBvaW50cyA9IHByb3BzLmVudHJ5UG9pbnRzID8/ICh0aGlzLm1hbmlmZXN0Lm1haW4gPyBbdGhpcy5tYW5pZmVzdC5tYWluXSA6IFtdKTtcblxuICAgIGlmIChlbnRyeVBvaW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBjb25maWd1cmUgYXQgbGVhc3QgMSBlbnRyeXBvaW50Jyk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBlbnRyeXBvaW50IG9mIGVudHJ5UG9pbnRzKSB7XG4gICAgICBpZiAoIWZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHRoaXMucGFja2FnZURpciwgZW50cnlwb2ludCkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGxvY2F0ZSBlbnRyeXBvaW50OiAke2VudHJ5cG9pbnR9YCk7XG4gICAgICB9XG4gICAgICB0aGlzLmVudHJ5UG9pbnRzW2VudHJ5cG9pbnQucmVwbGFjZSgnLmpzJywgJycpXSA9IGVudHJ5cG9pbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoZSBidW5kbGUgZm9yIHZpb2xhdGlvbnMuXG4gICAqXG4gICAqIElmIGBmaXhgIGlzIHNldCB0byB0cnVlLCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiB0aGUgcmVtYWluaW5nXG4gICAqIHZpb2xhdGlvbnMgYWZ0ZXIgdGhlIGZpeGVzIHdlcmUgYXBwbGllZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgbmV2ZXIgdGhyb3dzLiBUaGUgQ2FsbGVyIGlzIHJlc3BvbnNpYmxlIGZvciBpbnNwZWN0aW5nIHRoZVxuICAgKiByZXR1cm5lZCByZXBvcnQgYW5kIGFjdCBhY2NvcmRpbmdseS5cbiAgICovXG4gIHB1YmxpYyB2YWxpZGF0ZShvcHRpb25zOiBCdW5kbGVWYWxpZGF0ZU9wdGlvbnMgPSB7fSk6IFZpb2xhdGlvbnNSZXBvcnQge1xuXG4gICAgY29uc3QgZml4ID0gb3B0aW9ucy5maXggPz8gZmFsc2U7XG5cbiAgICAvLyBmaXJzdCB2YWxpZGF0ZVxuICAgIGNvbnN0IGNpcmN1bGFySW1wb3J0cyA9IHRoaXMudmFsaWRhdGVDaXJjdWxhckltcG9ydHMoKTtcbiAgICBjb25zdCByZXNvdXJjZXMgPSB0aGlzLnZhbGlkYXRlUmVzb3VyY2VzKCk7XG4gICAgY29uc3QgYXR0cmlidXRpb25zID0gdGhpcy52YWxpZGF0ZUF0dHJpYnV0aW9ucygpO1xuXG4gICAgY29uc3QgcmVwb3J0ID0gbmV3IFZpb2xhdGlvbnNSZXBvcnQoWy4uLmNpcmN1bGFySW1wb3J0cywgLi4ucmVzb3VyY2VzLCAuLi5hdHRyaWJ1dGlvbnNdKTtcblxuICAgIGlmICghZml4KSB7XG4gICAgICByZXR1cm4gcmVwb3J0O1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgdmlvbGF0aW9uIG9mIHJlcG9ydC52aW9sYXRpb25zKSB7XG4gICAgICBpZiAodmlvbGF0aW9uLmZpeCkge1xuICAgICAgICB2aW9sYXRpb24uZml4KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmV0dXJuIHRoZSB1biBmaXhhYmxlIHZpb2xhdGlvbnNcbiAgICByZXR1cm4gbmV3IFZpb2xhdGlvbnNSZXBvcnQocmVwb3J0LnZpb2xhdGlvbnMuZmlsdGVyKHYgPT4gIXYuZml4KSk7XG4gIH1cblxuICAvKipcbiAgICogV3JpdGUgdGhlIGJ1bmRsZSB2ZXJzaW9uIG9mIHRoZSBwcm9qZWN0IHRvIGEgdGVtcCBkaXJlY3RvcnkuXG4gICAqIFRoaXMgZGlyZWN0b3J5IGlzIHdoYXQgdGhlIHRvb2wgd2lsbCBlbmQgdXAgcGFja2luZy5cbiAgICpcbiAgICogUmV0dXJucyB0aGUgdGVtcCBkaXJlY3RvcnkgbG9jYXRpb24uXG4gICAqL1xuICBwdWJsaWMgd3JpdGUoKTogc3RyaW5nIHtcblxuICAgIGNvbnN0IHRhcmdldCA9IGZzLm1rZHRlbXBTeW5jKHBhdGguam9pbihvcy50bXBkaXIoKSwgJ2J1bmRsZS13cml0ZS0nKSk7XG5cbiAgICAvLyB3ZSBkZWZpbml0ZWx5IGRvbid0IG5lZWQgdGhlc2UgZGlyZWN0b3JpZXMgaW4gdGhlIHBhY2thZ2VcbiAgICAvLyBzbyBubyBuZWVkIHRvIGNvcHkgdGhlbSBvdmVyLlxuICAgIGNvbnN0IGlnbm9yZURpcmVjdG9yaWVzID0gWydub2RlX21vZHVsZXMnLCAnLmdpdCddO1xuXG4gICAgLy8gY29weSB0aGUgZW50aXJlIHByb2plY3Qgc2luY2Ugd2UgYXJlIHJldGFpbmluZyB0aGUgb3JpZ2luYWwgZmlsZXMuXG4gICAgZnMuY29weVN5bmModGhpcy5wYWNrYWdlRGlyLCB0YXJnZXQsIHsgZmlsdGVyOiBuID0+ICFuLnNwbGl0KHBhdGguc2VwKS5zb21lKChwID0+IGlnbm9yZURpcmVjdG9yaWVzLmluY2x1ZGVzKHApKSkgfSk7XG5cbiAgICAvLyBjbG9uZSB0aGUgb3JpZ2luYWwgbWFuaWZlc3Qgc2luY2Ugd2UgYXJlIGdvaW5nIHRvXG4gICAgLy8gdG8gbXV0YXRlIGl0LlxuICAgIGNvbnN0IG1hbmlmZXN0ID0geyAuLi50aGlzLm1hbmlmZXN0IH07XG5cbiAgICAvLyBtYW5pZmVzdCBtdXRhdGlvbnNcbiAgICB0aGlzLnJlbW92ZURlcGVuZGVuY2llcyhtYW5pZmVzdCk7XG4gICAgdGhpcy5hZGRFeHRlcm5hbHMobWFuaWZlc3QpO1xuXG4gICAgLy8gd3JpdGUgYXJ0aWZhY3RzXG4gICAgdGhpcy53cml0ZU91dHB1dHModGFyZ2V0KTtcbiAgICB0aGlzLndyaXRlUmVzb3VyY2VzKHRhcmdldCk7XG4gICAgdGhpcy53cml0ZU1hbmlmZXN0KHRhcmdldCwgbWFuaWZlc3QpO1xuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZSB0aGUgYnVuZGxlIGFuZCBjcmVhdGUgdGhlIHRhcmJhbGwuXG4gICAqXG4gICAqIFJldHVybnMgdGhlIGxvY2F0aW9uIG9mIHRoZSB0YXJiYWxsLlxuICAgKi9cbiAgcHVibGljIHBhY2sob3B0aW9uczogQnVuZGxlUGFja09wdGlvbnMgPSB7fSk6IHN0cmluZyB7XG5cbiAgICBjb25zdCB0YXJnZXQgPSBvcHRpb25zLnRhcmdldCA/PyB0aGlzLnBhY2thZ2VEaXI7XG5cbiAgICBjb25zdCByZXBvcnQgPSB0aGlzLnZhbGlkYXRlKCk7XG4gICAgaWYgKCFyZXBvcnQuc3VjY2Vzcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcGFjayBkdWUgdG8gdmFsaWRhdGlvbiBlcnJvcnMuXFxuXFxuJHtyZXBvcnQuc3VtbWFyeX1gKTtcbiAgICB9XG5cbiAgICBpZiAoIWZzLmV4aXN0c1N5bmModGFyZ2V0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUYXJnZXQgZG9lc250IGV4aXN0OiAke3RhcmdldH1gKTtcbiAgICB9XG5cbiAgICAvLyByZXNvbHZlIHN5bWxpbmtzLlxuICAgIGNvbnN0IHJlYWxUYXJnZXQgPSBmcy5yZWFscGF0aFN5bmModGFyZ2V0KTtcblxuICAgIGlmICghZnMubHN0YXRTeW5jKHJlYWxUYXJnZXQpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGFyZ2V0IG11c3QgYmUgYSBkaXJlY3Rvcnk6ICR7dGFyZ2V0fWApO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdXcml0aW5nIGJ1bmRsZScpO1xuICAgIGNvbnN0IGJ1bmRsZURpciA9IHRoaXMud3JpdGUoKTtcbiAgICB0cnkge1xuXG4gICAgICBpZiAodGhpcy50ZXN0KSB7XG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBgJHtwYXRoLmpvaW4oYnVuZGxlRGlyLCB0aGlzLnRlc3QpfWA7XG4gICAgICAgIGNvbnNvbGUubG9nKGBSdW5uaW5nIHNhbml0eSB0ZXN0OiAke2NvbW1hbmR9YCk7XG4gICAgICAgIHNoZWxsKGNvbW1hbmQsIHsgY3dkOiBidW5kbGVEaXIgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGNyZWF0ZSB0aGUgdGFyYmFsbFxuICAgICAgY29uc29sZS5sb2coJ1BhY2tpbmcnKTtcbiAgICAgIGNvbnN0IHRhcmJhbGwgPSBzaGVsbCgnbnBtIHBhY2snLCB7IHF1aWV0OiB0cnVlLCBjd2Q6IGJ1bmRsZURpciB9KS50cmltKCk7XG4gICAgICBjb25zdCBkZXN0ID0gcGF0aC5qb2luKHJlYWxUYXJnZXQsIHRhcmJhbGwpO1xuICAgICAgZnMuY29weVN5bmMocGF0aC5qb2luKGJ1bmRsZURpciwgdGFyYmFsbCksIGRlc3QsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGZzLnJlbW92ZVN5bmMoYnVuZGxlRGlyKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldCBidW5kbGUoKTogZXNidWlsZC5CdWlsZFJlc3VsdCB7XG4gICAgaWYgKHRoaXMuX2J1bmRsZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2J1bmRsZTtcbiAgICB9XG4gICAgdGhpcy5fYnVuZGxlID0gdGhpcy5lc2J1aWxkKCk7XG4gICAgcmV0dXJuIHRoaXMuX2J1bmRsZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGRlcGVuZGVuY2llcygpOiBQYWNrYWdlW10ge1xuICAgIGlmICh0aGlzLl9kZXBlbmRlbmNpZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kZXBlbmRlbmNpZXM7XG4gICAgfVxuICAgIGNvbnN0IGlucHV0cyA9IE9iamVjdC5rZXlzKHRoaXMuYnVuZGxlLm1ldGFmaWxlIS5pbnB1dHMpO1xuICAgIGNvbnN0IHBhY2thZ2VzID0gbmV3IFNldChBcnJheS5mcm9tKGlucHV0cykubWFwKGkgPT4gdGhpcy5jbG9zZXN0UGFja2FnZVBhdGgocGF0aC5qb2luKHRoaXMucGFja2FnZURpciwgaSkpKSk7XG4gICAgdGhpcy5fZGVwZW5kZW5jaWVzID0gQXJyYXkuZnJvbShwYWNrYWdlcykubWFwKHAgPT4gdGhpcy5jcmVhdGVQYWNrYWdlKHApKS5maWx0ZXIoZCA9PiBkLm5hbWUgIT09IHVuZGVmaW5lZCAmJiBkLm5hbWUgIT09IHRoaXMubWFuaWZlc3QubmFtZSk7XG4gICAgcmV0dXJuIHRoaXMuX2RlcGVuZGVuY2llcztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGRlcGVuZGVuY2llc1Jvb3QoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5fZGVwZW5kZW5jaWVzUm9vdCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RlcGVuZGVuY2llc1Jvb3Q7XG4gICAgfVxuICAgIGNvbnN0IGxjcCA9IGxvbmdlc3RDb21tb25QYXJlbnQodGhpcy5kZXBlbmRlbmNpZXMubWFwKGQgPT4gZC5wYXRoKSk7XG4gICAgdGhpcy5fZGVwZW5kZW5jaWVzUm9vdCA9IHRoaXMuY2xvc2VzdFBhY2thZ2VQYXRoKGxjcCk7XG4gICAgcmV0dXJuIHRoaXMuX2RlcGVuZGVuY2llc1Jvb3Q7XG4gIH1cblxuICBwcml2YXRlIGdldCBhdHRyaWJ1dGlvbnMoKTogQXR0cmlidXRpb25zIHtcbiAgICBpZiAodGhpcy5fYXR0cmlidXRpb25zID09IG51bGwpIHtcbiAgICAgIHRoaXMuX2F0dHJpYnV0aW9ucyA9IG5ldyBBdHRyaWJ1dGlvbnMoe1xuICAgICAgICBwYWNrYWdlRGlyOiB0aGlzLnBhY2thZ2VEaXIsXG4gICAgICAgIHBhY2thZ2VOYW1lOiB0aGlzLm1hbmlmZXN0Lm5hbWUsXG4gICAgICAgIGZpbGVQYXRoOiB0aGlzLm5vdGljZVBhdGgsXG4gICAgICAgIGRlcGVuZGVuY2llczogdGhpcy5kZXBlbmRlbmNpZXMsXG4gICAgICAgIGRlcGVuZGVuY2llc1Jvb3Q6IHRoaXMuZGVwZW5kZW5jaWVzUm9vdCxcbiAgICAgICAgZXhjbHVkZTogdGhpcy5kb250QXR0cmlidXRlLFxuICAgICAgICBhbGxvd2VkTGljZW5zZXM6IHRoaXMuYWxsb3dlZExpY2Vuc2VzLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogRmluZCBhIHNpbmdsZSB2ZXJzaW9uIG51bWJlciBmb3IgdGhlIGdpdmVuIGV4dGVybmFsIGRlcGVuZGVuY3kuXG4gICAqXG4gICAqIEZpbmRzIHRoZSBzbWFsbGVzdCBwb3NzaWJsZSByYW5nZSB0aGF0IGNvbnRhaW5zIGFsbCB2ZXJzaW9uIGlkZW50aWZpZXJzLFxuICAgKiBvciBmYWlscyBpZiBpdCBjb3VsZG4ndCBiZSBmb3VuZC5cbiAgICovXG4gIHByaXZhdGUgZmluZEV4dGVybmFsRGVwZW5kZW5jeVZlcnNpb24obmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB2ZXJzaW9uVHJhY2luZyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgbGV0IHZlcnNpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIGZ1bmN0aW9uIG1lcmdlVmVyc2lvbihuZXdWOiBzdHJpbmcsIHNvdXJjZTogc3RyaW5nKSB7XG4gICAgICB2ZXJzaW9uVHJhY2luZy5wdXNoKGAke25ld1Z9IGZyb20gJHtzb3VyY2V9YCk7XG5cbiAgICAgIC8vIG5ld1YgPD0gdmVyc2lvbiAob3Igbm8gdmVyc2lvbiB5ZXQpLCB1c2UgbmV3VlxuICAgICAgaWYgKCF2ZXJzaW9uIHx8IHNlbXZlci5zdWJzZXQobmV3ViwgdmVyc2lvbikpIHtcbiAgICAgICAgdmVyc2lvbiA9IG5ld1Y7XG4gICAgICB9IGVsc2UgaWYgKCFzZW12ZXIuc3Vic2V0KHZlcnNpb24sIG5ld1YpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGRldGVybWluZSB2ZXJzaW9uIGZvciBleHRlcm5hbCBwYWNrYWdlICR7bmFtZX06IG5vIHNpbmdsZSBtaW5pbWFsIHJhbmdlIGluOiAke3ZlcnNpb25UcmFjaW5nfWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGV4dGVybmFsIGRlcGVuZGVuY2llcyB3aWxsIG5vdCBleGlzdCBpbiB0aGUgZGVwZW5kZW5jaWVzIGxpc3RcbiAgICAvLyBzaW5jZSBlc2J1aWxkIHNraXBzIG92ZXIgdGhlbS4gYnV0IHRoZXkgd2lsbCBleGlzdCBhcyBhIGRlcGVuZGVuY3kgb2ZcbiAgICAvLyBvbmUgb2YgdGhlbSAob3Igb2YgdXMpXG4gICAgZm9yIChjb25zdCBwa2cgb2YgWy4uLnRoaXMuZGVwZW5kZW5jaWVzLCB0aGlzLmNyZWF0ZVBhY2thZ2UodGhpcy5wYWNrYWdlRGlyKV0pIHtcbiAgICAgIGNvbnN0IG1hbmlmZXN0ID0gZnMucmVhZEpTT05TeW5jKHBhdGguam9pbihwa2cucGF0aCwgJ3BhY2thZ2UuanNvbicpKTtcbiAgICAgIGNvbnN0IHJ1bnRpbWUgPSAobWFuaWZlc3QuZGVwZW5kZW5jaWVzID8/IHt9KVtuYW1lXTtcbiAgICAgIGNvbnN0IG9wdGlvbmFsID0gKG1hbmlmZXN0Lm9wdGlvbmFsRGVwZW5kZW5jaWVzID8/IHt9KVtuYW1lXTtcblxuICAgICAgaWYgKHJ1bnRpbWUpIHtcbiAgICAgICAgbWVyZ2VWZXJzaW9uKHJ1bnRpbWUsIHBrZy5uYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25hbCkge1xuICAgICAgICBtZXJnZVZlcnNpb24ob3B0aW9uYWwsIHBrZy5uYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXZlcnNpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGRldGVjdCB2ZXJzaW9uIGZvciBleHRlcm5hbCBkZXBlbmRlbmN5OiAke25hbWV9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcGluID0gKHZlcnNpb246IHN0cmluZykgPT4gKHZlcnNpb24uc3RhcnRzV2l0aCgnXicpIHx8IHZlcnNpb24uc3RhcnRzV2l0aCgnficpKSA/IHZlcnNpb24uc3Vic3RyaW5nKDEpIDogdmVyc2lvbjtcblxuICAgIHJldHVybiBwaW4odmVyc2lvbik7XG4gIH1cblxuICBwcml2YXRlIGNsb3Nlc3RQYWNrYWdlUGF0aChmZHA6IHN0cmluZyk6IHN0cmluZyB7XG5cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4oZmRwLCAncGFja2FnZS5qc29uJykpKSB7XG4gICAgICByZXR1cm4gZmRwO1xuICAgIH1cblxuICAgIGlmIChwYXRoLmRpcm5hbWUoZmRwKSA9PT0gZmRwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIHBhY2thZ2UgbWFuaWZlc3QnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jbG9zZXN0UGFja2FnZVBhdGgocGF0aC5kaXJuYW1lKGZkcCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVQYWNrYWdlKHBhY2thZ2VEaXI6IHN0cmluZyk6IFBhY2thZ2Uge1xuICAgIGNvbnN0IG1hbmlmZXN0UGF0aCA9IHBhdGguam9pbihwYWNrYWdlRGlyLCAncGFja2FnZS5qc29uJyk7XG4gICAgY29uc3QgbWFuaWZlc3QgPSBmcy5yZWFkSlNPTlN5bmMobWFuaWZlc3RQYXRoKTtcbiAgICByZXR1cm4geyBwYXRoOiBwYWNrYWdlRGlyLCBuYW1lOiBtYW5pZmVzdC5uYW1lLCB2ZXJzaW9uOiBtYW5pZmVzdC52ZXJzaW9uIH07XG4gIH1cblxuICBwcml2YXRlIGVzYnVpbGQoKTogZXNidWlsZC5CdWlsZFJlc3VsdCB7XG5cbiAgICBjb25zdCBidW5kbGUgPSBlc2J1aWxkLmJ1aWxkU3luYyh7XG4gICAgICBlbnRyeVBvaW50czogdGhpcy5lbnRyeVBvaW50cyxcbiAgICAgIGJ1bmRsZTogdHJ1ZSxcbiAgICAgIHRhcmdldDogJ25vZGUxNCcsXG4gICAgICBwbGF0Zm9ybTogJ25vZGUnLFxuICAgICAgc291cmNlbWFwOiB0aGlzLnNvdXJjZW1hcCxcbiAgICAgIG1ldGFmaWxlOiB0cnVlLFxuICAgICAgbWluaWZ5OiB0aGlzLm1pbmlmeSxcbiAgICAgIG1pbmlmeVdoaXRlc3BhY2U6IHRoaXMubWluaWZ5V2hpdGVzcGFjZSxcbiAgICAgIG1pbmlmeUlkZW50aWZpZXJzOiB0aGlzLm1pbmlmeUlkZW50aWZpZXJzLFxuICAgICAgbWluaWZ5U3ludGF4OiB0aGlzLm1pbmlmeVN5bnRheCxcbiAgICAgIHRyZWVTaGFraW5nOiB0cnVlLFxuICAgICAgYWJzV29ya2luZ0RpcjogdGhpcy5wYWNrYWdlRGlyLFxuICAgICAgZXh0ZXJuYWw6IFsuLi4odGhpcy5leHRlcm5hbHMuZGVwZW5kZW5jaWVzID8/IFtdKSwgLi4uKHRoaXMuZXh0ZXJuYWxzLm9wdGlvbmFsRGVwZW5kZW5jaWVzID8/IFtdKV0sXG4gICAgICB3cml0ZTogZmFsc2UsXG4gICAgICBvdXRkaXI6IHRoaXMucGFja2FnZURpcixcbiAgICAgIGFsbG93T3ZlcndyaXRlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgaWYgKGJ1bmRsZS53YXJuaW5ncy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBlc2J1aWxkIHdhcm5pbmdzIGFyZSB1c3VhbGx5IGltcG9ydGFudCwgbGV0cyB0cnkgdG8gYmUgc3RyaWN0IGhlcmUuXG4gICAgICAvLyB0aGUgd2FybmluZ3MgdGhlbXNlbHZlcyBhcmUgcHJpbnRlZCBvbiBzY3JlZW4uXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEZvdW5kICR7YnVuZGxlLndhcm5pbmdzLmxlbmd0aH0gYnVuZGxpbmcgd2FybmluZ3MgKFNlZSBhYm92ZSlgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVuZGxlO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZUNpcmN1bGFySW1wb3J0cygpOiBWaW9sYXRpb25bXSB7XG4gICAgY29uc29sZS5sb2coJ1ZhbGlkYXRpbmcgY2lyY3VsYXIgaW1wb3J0cycpO1xuICAgIGNvbnN0IHZpb2xhdGlvbnM6IFZpb2xhdGlvbltdID0gW107XG4gICAgY29uc3QgcGFja2FnZXMgPSBbdGhpcy5wYWNrYWdlRGlyLCAuLi50aGlzLmRlcGVuZGVuY2llcy5tYXAoZCA9PiBkLnBhdGgpXTtcbiAgICB0cnkge1xuICAgICAgLy8gd2UgZG9uJ3QgdXNlIHRoZSBwcm9ncmFtbWF0aWMgQVBJIHNpbmNlIGl0IG9ubHkgb2ZmZXJzIGFuIGFzeW5jIEFQSS5cbiAgICAgIC8vIHByZWZlciB0byBzdGF5IHN5bmMgZm9yIG5vdyBzaW5jZSBpdHMgZWFzaWVyIHRvIGludGVncmF0ZSB3aXRoIG90aGVyIHRvb2xpbmcuXG4gICAgICAvLyB3aWxsIG9mZmVyIGFuIGFzeW5jIEFQSSBmdXJ0aGVyIGRvd24gdGhlIHJvYWQuXG4gICAgICBjb25zdCBjb21tYW5kID0gYCR7cmVxdWlyZS5yZXNvbHZlKCdtYWRnZS9iaW4vY2xpLmpzJyl9IC0tanNvbiAtLXdhcm5pbmcgLS1uby1jb2xvciAtLW5vLXNwaW5uZXIgLS1jaXJjdWxhciAtLWV4dGVuc2lvbnMganMgJHtwYWNrYWdlcy5qb2luKCcgJyl9YDtcbiAgICAgIHNoZWxsKGNvbW1hbmQsIHsgcXVpZXQ6IHRydWUgfSk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBjb25zdCBpbXBvcnRzOiBzdHJpbmdbXVtdID0gSlNPTi5wYXJzZShlLnN0ZG91dC50b1N0cmluZygpLnRyaW0oKSk7XG4gICAgICBmb3IgKGNvbnN0IGltcCBvZiBpbXBvcnRzKSB7XG4gICAgICAgIHZpb2xhdGlvbnMucHVzaCh7IHR5cGU6IFZpb2xhdGlvblR5cGUuQ0lSQ1VMQVJfSU1QT1JULCBtZXNzYWdlOiBgJHtpbXAuam9pbignIC0+ICcpfWAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZpb2xhdGlvbnM7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlUmVzb3VyY2VzKCk6IFZpb2xhdGlvbltdIHtcbiAgICBjb25zb2xlLmxvZygnVmFsaWRhdGluZyByZXNvdXJjZXMnKTtcbiAgICBjb25zdCB2aW9sYXRpb25zID0gW107XG4gICAgZm9yIChjb25zdCBbc3JjLCBfXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLnJlc291cmNlcykpIHtcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4odGhpcy5wYWNrYWdlRGlyLCBzcmMpKSkge1xuICAgICAgICB2aW9sYXRpb25zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IFZpb2xhdGlvblR5cGUuTUlTU0lOR19SRVNPVVJDRSxcbiAgICAgICAgICBtZXNzYWdlOiBgVW5hYmxlIHRvIGZpbmQgcmVzb3VyY2UgKCR7c3JjfSkgcmVsYXRpdmUgdG8gdGhlIHBhY2thZ2UgZGlyZWN0b3J5YCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2aW9sYXRpb25zO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZUF0dHJpYnV0aW9ucygpOiByZWFkb25seSBWaW9sYXRpb25bXSB7XG4gICAgY29uc29sZS5sb2coJ1ZhbGlkYXRpbmcgYXR0cmlidXRpb25zJyk7XG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRpb25zLnZhbGlkYXRlKCkudmlvbGF0aW9ucztcbiAgfVxuXG4gIHByaXZhdGUgYWRkRXh0ZXJuYWxzKG1hbmlmZXN0OiBhbnkpIHtcblxuICAgIC8vIGV4dGVybmFsIGRlcGVuZGVuY2llcyBzaG91bGQgYmUgc3BlY2lmaWVkIGFzIHJ1bnRpbWUgZGVwZW5kZW5jaWVzXG4gICAgZm9yIChjb25zdCBleHRlcm5hbCBvZiB0aGlzLmV4dGVybmFscy5kZXBlbmRlbmNpZXMgPz8gW10pIHtcbiAgICAgIGNvbnN0IHZlcnNpb24gPSB0aGlzLmZpbmRFeHRlcm5hbERlcGVuZGVuY3lWZXJzaW9uKGV4dGVybmFsKTtcbiAgICAgIG1hbmlmZXN0LmRlcGVuZGVuY2llcyA9IG1hbmlmZXN0LmRlcGVuZGVuY2llcyA/PyB7fTtcbiAgICAgIG1hbmlmZXN0LmRlcGVuZGVuY2llc1tleHRlcm5hbF0gPSB2ZXJzaW9uO1xuICAgIH1cblxuICAgIC8vIGV4dGVybmFsIGRlcGVuZGVuY2llcyBzaG91bGQgYmUgc3BlY2lmaWVkIGFzIG9wdGlvbmFsIGRlcGVuZGVuY2llc1xuICAgIGZvciAoY29uc3QgZXh0ZXJuYWwgb2YgdGhpcy5leHRlcm5hbHMub3B0aW9uYWxEZXBlbmRlbmNpZXMgPz8gW10pIHtcbiAgICAgIGNvbnN0IHZlcnNpb24gPSB0aGlzLmZpbmRFeHRlcm5hbERlcGVuZGVuY3lWZXJzaW9uKGV4dGVybmFsKTtcbiAgICAgIG1hbmlmZXN0Lm9wdGlvbmFsRGVwZW5kZW5jaWVzID0gbWFuaWZlc3Qub3B0aW9uYWxEZXBlbmRlbmNpZXMgPz8ge307XG4gICAgICBtYW5pZmVzdC5vcHRpb25hbERlcGVuZGVuY2llc1tleHRlcm5hbF0gPSB2ZXJzaW9uO1xuICAgIH1cblxuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVEZXBlbmRlbmNpZXMobWFuaWZlc3Q6IGFueSkge1xuICAgIGZvciAoY29uc3QgW2QsIHZdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMubWFuaWZlc3QuZGVwZW5kZW5jaWVzKSkge1xuICAgICAgbWFuaWZlc3QuZGV2RGVwZW5kZW5jaWVzID0gbWFuaWZlc3QuZGV2RGVwZW5kZW5jaWVzID8/IHt9O1xuICAgICAgbWFuaWZlc3QuZGV2RGVwZW5kZW5jaWVzW2RdID0gdjtcbiAgICAgIGRlbGV0ZSBtYW5pZmVzdC5kZXBlbmRlbmNpZXNbZF07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB3cml0ZU91dHB1dHMod29ya0Rpcjogc3RyaW5nKSB7XG4gICAgZm9yIChjb25zdCBvdXRwdXQgb2YgdGhpcy5idW5kbGUub3V0cHV0RmlsZXMgPz8gW10pIHtcbiAgICAgIGNvbnN0IG91dCA9IG91dHB1dC5wYXRoLnJlcGxhY2UodGhpcy5wYWNrYWdlRGlyLCB3b3JrRGlyKTtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMob3V0LCBvdXRwdXQuY29udGVudHMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgd3JpdGVSZXNvdXJjZXMod29ya2Rpcjogc3RyaW5nKSB7XG4gICAgZm9yIChjb25zdCBbc3JjLCBkc3RdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMucmVzb3VyY2VzKSkge1xuICAgICAgY29uc3QgdG8gPSBwYXRoLmpvaW4od29ya2RpciwgZHN0KTtcbiAgICAgIGZzLmNvcHlTeW5jKHBhdGguam9pbih0aGlzLnBhY2thZ2VEaXIsIHNyYyksIHRvLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHdyaXRlTWFuaWZlc3Qod29ya0Rpcjogc3RyaW5nLCBtYW5pZmVzdDogYW55KSB7XG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4od29ya0RpciwgJ3BhY2thZ2UuanNvbicpLCBKU09OLnN0cmluZ2lmeShtYW5pZmVzdCwgbnVsbCwgMikpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGxvbmdlc3RDb21tb25QYXJlbnQocGF0aHM6IHN0cmluZ1tdKSB7XG5cbiAgZnVuY3Rpb24gX2xvbmdlc3RDb21tb25QYXJlbnQocDE6IHN0cmluZywgcDI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgZGlyczEgPSBwMS5zcGxpdChwYXRoLnNlcCk7XG4gICAgY29uc3QgZGlyczIgPSBwMi5zcGxpdChwYXRoLnNlcCk7XG4gICAgY29uc3QgcGFyZW50ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1pbihkaXJzMS5sZW5ndGgsIGRpcnMyLmxlbmd0aCk7IGkrKykge1xuICAgICAgaWYgKGRpcnMxW2ldICE9PSBkaXJzMltpXSkgYnJlYWs7XG4gICAgICBwYXJlbnQucHVzaChkaXJzMVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBwYXJlbnQuam9pbihwYXRoLnNlcCk7XG4gIH1cblxuICByZXR1cm4gcGF0aHMucmVkdWNlKF9sb25nZXN0Q29tbW9uUGFyZW50KTtcbn1cbiJdfQ==