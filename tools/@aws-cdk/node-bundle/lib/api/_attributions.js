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
exports.Attributions = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const _shell_1 = require("./_shell");
const violation_1 = require("./violation");
const ATTRIBUTION_SEPARATOR = '\n----------------\n';
/**
 * `Attributions` represents an attributions file containing third-party license information.
 */
class Attributions {
    constructor(props) {
        this.packageDir = props.packageDir;
        this.packageName = props.packageName;
        this.filePath = path.join(this.packageDir, props.filePath);
        this.dependencies = props.dependencies.filter(d => !props.exclude || !new RegExp(props.exclude).test(d.name));
        this.allowedLicenses = props.allowedLicenses.map(l => l.toLowerCase());
        this.dependenciesRoot = props.dependenciesRoot;
        // without the generated notice content, this object is pretty much
        // useless, so lets generate those of the bat.
        this.attributions = this.generateAttributions();
        this.content = this.render(this.attributions);
    }
    /**
     * Validate the current notice file.
     *
     * This method never throws. The Caller is responsible for inspecting the report returned and act accordinagly.
     */
    validate() {
        const violations = [];
        const relNoticePath = path.relative(this.packageDir, this.filePath);
        const fix = () => this.flush();
        const missing = !fs.existsSync(this.filePath);
        const attributions = missing ? undefined : fs.readFileSync(this.filePath, { encoding: 'utf-8' });
        const outdated = attributions !== undefined && attributions !== this.content;
        if (missing) {
            violations.push({ type: violation_1.ViolationType.MISSING_NOTICE, message: `${relNoticePath} is missing`, fix });
        }
        if (outdated) {
            violations.push({ type: violation_1.ViolationType.OUTDATED_ATTRIBUTIONS, message: `${relNoticePath} is outdated`, fix });
        }
        const invalidLicense = Array.from(this.attributions.values())
            .filter(a => a.licenses.length === 1 && !this.allowedLicenses.includes(a.licenses[0].toLowerCase()))
            .map(a => ({ type: violation_1.ViolationType.INVALID_LICENSE, message: `Dependency ${a.package} has an invalid license: ${a.licenses[0]}` }));
        const noLicense = Array.from(this.attributions.values())
            .filter(a => a.licenses.length === 0)
            .map(a => ({ type: violation_1.ViolationType.NO_LICENSE, message: `Dependency ${a.package} has no license` }));
        const multiLicense = Array.from(this.attributions.values())
            .filter(a => a.licenses.length > 1)
            .map(a => ({ type: violation_1.ViolationType.MULTIPLE_LICENSE, message: `Dependency ${a.package} has multiple licenses: ${a.licenses}` }));
        violations.push(...invalidLicense);
        violations.push(...noLicense);
        violations.push(...multiLicense);
        return new violation_1.ViolationsReport(violations);
    }
    /**
     * Flush the generated notice file to disk.
     */
    flush() {
        fs.writeFileSync(this.filePath, this.content);
    }
    render(attributions) {
        const content = [];
        if (attributions.size > 0) {
            content.push(`The ${this.packageName} package includes the following third-party software/licensing:`);
            content.push('');
        }
        // sort the attributions so the file doesn't change due to ordering issues
        const ordered = Array.from(attributions.values()).sort((a1, a2) => a1.package.localeCompare(a2.package));
        for (const attr of ordered) {
            content.push(`** ${attr.package} - ${attr.url} | ${attr.licenses[0]}`);
            // prefer notice over license
            if (attr.noticeText) {
                content.push(attr.noticeText);
            }
            else if (attr.licenseText) {
                content.push(attr.licenseText);
            }
            content.push(ATTRIBUTION_SEPARATOR);
        }
        return content
            // since we are embedding external files, those can different line
            // endings, so we standardize to LF.
            .map(l => l.replace(/\r\n/g, '\n'))
            .join('\n');
    }
    generateAttributions() {
        var _a, _b;
        if (this.dependencies.length === 0) {
            return new Map();
        }
        const attributions = new Map();
        const pkg = (d) => `${d.name}@${d.version}`;
        const packages = this.dependencies.map(d => pkg(d));
        function fetchInfos(_cwd, _packages) {
            // we don't use the programmatic API since it only offers an async API.
            // prefer to stay sync for now since its easier to integrate with other tooling.
            // will offer an async API further down the road.
            const command = `${require.resolve('license-checker/bin/license-checker')} --json --packages "${_packages.join(';')}"`;
            const output = (0, _shell_1.shell)(command, { cwd: _cwd, quiet: true });
            return JSON.parse(output);
        }
        // first run a global command to fetch as much information in one shot
        const infos = fetchInfos(this.dependenciesRoot, packages);
        for (const dep of this.dependencies) {
            const key = pkg(dep);
            // sometimes the dependency might not exist from fetching information globally,
            // so we try fetching a concrete package. this can happen for example when
            // two different major versions exist of the same dependency.
            const info = (_a = infos[key]) !== null && _a !== void 0 ? _a : fetchInfos(dep.path, [pkg(dep)])[key];
            if (!info) {
                // make sure all dependencies are accounted for.
                throw new Error(`Unable to locate license information for ${key} (${dep.path})`);
            }
            const noticeText = info.noticeFile ? fs.readFileSync(info.noticeFile, { encoding: 'utf-8' }) : undefined;
            // for some reason, the license-checker package falls back to the README.md file of the package for license
            // text. this seems strange, disabling that for now.
            // see https://github.com/davglass/license-checker/blob/master/lib/license-files.js#L9
            // note that a non existing license file is ok as long as the license type could be extracted.
            const licenseFile = ((_b = info.licenseFile) === null || _b === void 0 ? void 0 : _b.toLowerCase().endsWith('.md')) ? undefined : info.licenseFile;
            const licenseText = licenseFile ? fs.readFileSync(licenseFile, { encoding: 'utf-8' }) : undefined;
            // the licenses key comes in different types but we convert it here
            // to always be an array.
            const licenses = !info.licenses ? undefined : (Array.isArray(info.licenses) ? info.licenses : [info.licenses]);
            attributions.set(key, {
                package: key,
                url: `https://www.npmjs.com/package/${dep.name}/v/${dep.version}`,
                licenses: licenses !== null && licenses !== void 0 ? licenses : [],
                licenseText,
                noticeText,
            });
        }
        return attributions;
    }
}
exports.Attributions = Attributions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2F0dHJpYnV0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvX2F0dHJpYnV0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3Qiw2Q0FBK0I7QUFFL0IscUNBQWlDO0FBRWpDLDJDQUF5RTtBQUV6RSxNQUFNLHFCQUFxQixHQUFHLHNCQUFzQixDQUFDO0FBdUNyRDs7R0FFRztBQUNILE1BQWEsWUFBWTtJQVl2QixZQUFZLEtBQXdCO1FBQ2xDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzlHLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDO1FBRS9DLG1FQUFtRTtRQUNuRSw4Q0FBOEM7UUFDOUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUNoRCxJQUFJLENBQUMs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LE1BQU0sV0FBVyxHQUFHLENBQUEsTUFBQSxJQUFJLENBQUMsV0FBVywwQ0FBRSxXQUFXLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDbkcsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFFbEcsbUVBQW1FO1lBQ25FLHlCQUF5QjtZQUN6QixNQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUUvRyxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtnQkFDcEIsT0FBTyxFQUFFLEdBQUc7Z0JBQ1osR0FBRyxFQUFFLGlDQUFpQyxHQUFHLENBQUMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2pFLFFBQVEsRUFBRSxRQUFRLGFBQVIsUUFBUSxjQUFSLFFBQVEsR0FBSSxFQUFFO2dCQUN4QixXQUFXO2dCQUNYLFVBQVU7YUFDWCxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztDQUVGO0FBMUtELG9DQTBLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgdHlwZSB7IE1vZHVsZUluZm8gfSBmcm9tICdsaWNlbnNlLWNoZWNrZXInO1xuaW1wb3J0IHsgc2hlbGwgfSBmcm9tICcuL19zaGVsbCc7XG5pbXBvcnQgdHlwZSB7IFBhY2thZ2UgfSBmcm9tICcuL2J1bmRsZSc7XG5pbXBvcnQgeyBWaW9sYXRpb24sIFZpb2xhdGlvblR5cGUsIFZpb2xhdGlvbnNSZXBvcnQgfSBmcm9tICcuL3Zpb2xhdGlvbic7XG5cbmNvbnN0IEFUVFJJQlVUSU9OX1NFUEFSQVRPUiA9ICdcXG4tLS0tLS0tLS0tLS0tLS0tXFxuJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBgQXR0cmlidXRpb25zYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBdHRyaWJ1dGlvbnNQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgcGFja2FnZSByb290IGRpcmVjdG9yeS5cbiAgICovXG4gIHJlYWRvbmx5IHBhY2thZ2VEaXI6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBwYWNrYWdlLlxuICAgKi9cbiAgcmVhZG9ubHkgcGFja2FnZU5hbWU6IHN0cmluZztcbiAgLyoqXG4gICAqIFBhY2thZ2UgZGVwZW5kZW5jaWVzLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVwZW5kZW5jaWVzOiBQYWNrYWdlW107XG4gIC8qKlxuICAgKiBUaGUgcGFyZW50IGRpcmVjdG9yeSB1bmRlcndoaWNoIGFsbCBkZXBlbmRlbmNpZXMgbGl2ZS5cbiAgICovXG4gIHJlYWRvbmx5IGRlcGVuZGVuY2llc1Jvb3Q6IHN0cmluZztcbiAgLyoqXG4gICAqIFBhdGggdG8gdGhlIG5vdGljZSBmaWxlIHRvIGNyZWF0ZWQgLyB2YWxpZGF0ZWQuXG4gICAqL1xuICByZWFkb25seSBmaWxlUGF0aDogc3RyaW5nO1xuICAvKipcbiAgICogTGlzdCBvZiBhbGxvd2VkIGxpY2Vuc2VzLlxuICAgKlxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dlZExpY2Vuc2VzOiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIERlcGVuZGVuY2llcyBtYXRjaGluZyB0aGlzIHBhdHRlcm4gd2lsbCBiZSBleGNsdWRlZCBmcm9tIGF0dHJpYnV0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGV4Y2x1c2lvbnMuXG4gICAqL1xuICByZWFkb25seSBleGNsdWRlPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIGBBdHRyaWJ1dGlvbnNgIHJlcHJlc2VudHMgYW4gYXR0cmlidXRpb25zIGZpbGUgY29udGFpbmluZyB0aGlyZC1wYXJ0eSBsaWNlbnNlIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgQXR0cmlidXRpb25zIHtcblxuICBwcml2YXRlIHJlYWRvbmx5IHBhY2thZ2VEaXI6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBwYWNrYWdlTmFtZTogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IGRlcGVuZGVuY2llczogUGFja2FnZVtdO1xuICBwcml2YXRlIHJlYWRvbmx5IGFsbG93ZWRMaWNlbnNlczogc3RyaW5nW107XG4gIHByaXZhdGUgcmVhZG9ubHkgZGVwZW5kZW5jaWVzUm9vdDogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IGZpbGVQYXRoOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBhdHRyaWJ1dGlvbnM6IE1hcDxzdHJpbmcsIEF0dHJpYnV0aW9uPjtcbiAgcHJpdmF0ZSByZWFkb25seSBjb250ZW50OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IEF0dHJpYnV0aW9uc1Byb3BzKSB7XG4gICAgdGhpcy5wYWNrYWdlRGlyID0gcHJvcHMucGFja2FnZURpcjtcbiAgICB0aGlzLnBhY2thZ2VOYW1lID0gcHJvcHMucGFja2FnZU5hbWU7XG4gICAgdGhpcy5maWxlUGF0aCA9IHBhdGguam9pbih0aGlzLnBhY2thZ2VEaXIsIHByb3BzLmZpbGVQYXRoKTtcbiAgICB0aGlzLmRlcGVuZGVuY2llcyA9IHByb3BzLmRlcGVuZGVuY2llcy5maWx0ZXIoZCA9PiAhcHJvcHMuZXhjbHVkZSB8fCAhbmV3IFJlZ0V4cChwcm9wcy5leGNsdWRlKS50ZXN0KGQubmFtZSkpO1xuICAgIHRoaXMuYWxsb3dlZExpY2Vuc2VzID0gcHJvcHMuYWxsb3dlZExpY2Vuc2VzLm1hcChsID0+IGwudG9Mb3dlckNhc2UoKSk7XG4gICAgdGhpcy5kZXBlbmRlbmNpZXNSb290ID0gcHJvcHMuZGVwZW5kZW5jaWVzUm9vdDtcblxuICAgIC8vIHdpdGhvdXQgdGhlIGdlbmVyYXRlZCBub3RpY2UgY29udGVudCwgdGhpcyBvYmplY3QgaXMgcHJldHR5IG11Y2hcbiAgICAvLyB1c2VsZXNzLCBzbyBsZXRzIGdlbmVyYXRlIHRob3NlIG9mIHRoZSBiYXQuXG4gICAgdGhpcy5hdHRyaWJ1dGlvbnMgPSB0aGlzLmdlbmVyYXRlQXR0cmlidXRpb25zKCk7XG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5yZW5kZXIodGhpcy5hdHRyaWJ1dGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoZSBjdXJyZW50IG5vdGljZSBmaWxlLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBuZXZlciB0aHJvd3MuIFRoZSBDYWxsZXIgaXMgcmVzcG9uc2libGUgZm9yIGluc3BlY3RpbmcgdGhlIHJlcG9ydCByZXR1cm5lZCBhbmQgYWN0IGFjY29yZGluYWdseS5cbiAgICovXG4gIHB1YmxpYyB2YWxpZGF0ZSgpOiBWaW9sYXRpb25zUmVwb3J0IHtcblxuICAgIGNvbnN0IHZpb2xhdGlvbnM6IFZpb2xhdGlvbltdID0gW107XG4gICAgY29uc3QgcmVsTm90aWNlUGF0aCA9IHBhdGgucmVsYXRpdmUodGhpcy5wYWNrYWdlRGlyLCB0aGlzLmZpbGVQYXRoKTtcblxuICAgIGNvbnN0IGZpeCA9ICgpID0+IHRoaXMuZmx1c2goKTtcblxuICAgIGNvbnN0IG1pc3NpbmcgPSAhZnMuZXhpc3RzU3luYyh0aGlzLmZpbGVQYXRoKTtcbiAgICBjb25zdCBhdHRyaWJ1dGlvbnMgPSBtaXNzaW5nID8gdW5kZWZpbmVkIDogZnMucmVhZEZpbGVTeW5jKHRoaXMuZmlsZVBhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG4gICAgY29uc3Qgb3V0ZGF0ZWQgPSBhdHRyaWJ1dGlvbnMgIT09IHVuZGVmaW5lZCAmJiBhdHRyaWJ1dGlvbnMgIT09IHRoaXMuY29udGVudDtcblxuICAgIGlmIChtaXNzaW5nKSB7XG4gICAgICB2aW9sYXRpb25zLnB1c2goeyB0eXBlOiBWaW9sYXRpb25UeXBlLk1JU1NJTkdfTk9USUNFLCBtZXNzYWdlOiBgJHtyZWxOb3RpY2VQYXRofSBpcyBtaXNzaW5nYCwgZml4IH0pO1xuICAgIH1cblxuICAgIGlmIChvdXRkYXRlZCkge1xuICAgICAgdmlvbGF0aW9ucy5wdXNoKHsgdHlwZTogVmlvbGF0aW9uVHlwZS5PVVREQVRFRF9BVFRSSUJVVElPTlMsIG1lc3NhZ2U6IGAke3JlbE5vdGljZVBhdGh9IGlzIG91dGRhdGVkYCwgZml4IH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGludmFsaWRMaWNlbnNlOiBWaW9sYXRpb25bXSA9IEFycmF5LmZyb20odGhpcy5hdHRyaWJ1dGlvbnMudmFsdWVzKCkpXG4gICAgICAuZmlsdGVyKGEgPT4gYS5saWNlbnNlcy5sZW5ndGggPT09IDEgJiYgIXRoaXMuYWxsb3dlZExpY2Vuc2VzLmluY2x1ZGVzKGEubGljZW5zZXNbMF0udG9Mb3dlckNhc2UoKSkpXG4gICAgICAubWFwKGEgPT4gKHsgdHlwZTogVmlvbGF0aW9uVHlwZS5JTlZBTElEX0xJQ0VOU0UsIG1lc3NhZ2U6IGBEZXBlbmRlbmN5ICR7YS5wYWNrYWdlfSBoYXMgYW4gaW52YWxpZCBsaWNlbnNlOiAke2EubGljZW5zZXNbMF19YCB9KSk7XG5cbiAgICBjb25zdCBub0xpY2Vuc2U6IFZpb2xhdGlvbltdID0gQXJyYXkuZnJvbSh0aGlzLmF0dHJpYnV0aW9ucy52YWx1ZXMoKSlcbiAgICAgIC5maWx0ZXIoYSA9PiBhLmxpY2Vuc2VzLmxlbmd0aCA9PT0gMClcbiAgICAgIC5tYXAoYSA9PiAoeyB0eXBlOiBWaW9sYXRpb25UeXBlLk5PX0xJQ0VOU0UsIG1lc3NhZ2U6IGBEZXBlbmRlbmN5ICR7YS5wYWNrYWdlfSBoYXMgbm8gbGljZW5zZWAgfSkpO1xuXG4gICAgY29uc3QgbXVsdGlMaWNlbnNlOiBWaW9sYXRpb25bXSA9IEFycmF5LmZyb20odGhpcy5hdHRyaWJ1dGlvbnMudmFsdWVzKCkpXG4gICAgICAuZmlsdGVyKGEgPT4gYS5saWNlbnNlcy5sZW5ndGggPiAxKVxuICAgICAgLm1hcChhID0+ICh7IHR5cGU6IFZpb2xhdGlvblR5cGUuTVVMVElQTEVfTElDRU5TRSwgbWVzc2FnZTogYERlcGVuZGVuY3kgJHthLnBhY2thZ2V9IGhhcyBtdWx0aXBsZSBsaWNlbnNlczogJHthLmxpY2Vuc2VzfWAgfSkpO1xuXG4gICAgdmlvbGF0aW9ucy5wdXNoKC4uLmludmFsaWRMaWNlbnNlKTtcbiAgICB2aW9sYXRpb25zLnB1c2goLi4ubm9MaWNlbnNlKTtcbiAgICB2aW9sYXRpb25zLnB1c2goLi4ubXVsdGlMaWNlbnNlKTtcblxuICAgIHJldHVybiBuZXcgVmlvbGF0aW9uc1JlcG9ydCh2aW9sYXRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGbHVzaCB0aGUgZ2VuZXJhdGVkIG5vdGljZSBmaWxlIHRvIGRpc2suXG4gICAqL1xuICBwdWJsaWMgZmx1c2goKSB7XG4gICAgZnMud3JpdGVGaWxlU3luYyh0aGlzLmZpbGVQYXRoLCB0aGlzLmNvbnRlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXIoYXR0cmlidXRpb25zOiBNYXA8c3RyaW5nLCBBdHRyaWJ1dGlvbj4pOiBzdHJpbmcge1xuXG4gICAgY29uc3QgY29udGVudCA9IFtdO1xuXG4gICAgaWYgKGF0dHJpYnV0aW9ucy5zaXplID4gMCkge1xuICAgICAgY29udGVudC5wdXNoKGBUaGUgJHt0aGlzLnBhY2thZ2VOYW1lfSBwYWNrYWdlIGluY2x1ZGVzIHRoZSBmb2xsb3dpbmcgdGhpcmQtcGFydHkgc29mdHdhcmUvbGljZW5zaW5nOmApO1xuICAgICAgY29udGVudC5wdXNoKCcnKTtcbiAgICB9XG5cbiAgICAvLyBzb3J0IHRoZSBhdHRyaWJ1dGlvbnMgc28gdGhlIGZpbGUgZG9lc24ndCBjaGFuZ2UgZHVlIHRvIG9yZGVyaW5nIGlzc3Vlc1xuICAgIGNvbnN0IG9yZGVyZWQgPSBBcnJheS5mcm9tKGF0dHJpYnV0aW9ucy52YWx1ZXMoKSkuc29ydCgoYTEsIGEyKSA9PiBhMS5wYWNrYWdlLmxvY2FsZUNvbXBhcmUoYTIucGFja2FnZSkpO1xuXG4gICAgZm9yIChjb25zdCBhdHRyIG9mIG9yZGVyZWQpIHtcbiAgICAgIGNvbnRlbnQucHVzaChgKiogJHthdHRyLnBhY2thZ2V9IC0gJHthdHRyLnVybH0gfCAke2F0dHIubGljZW5zZXNbMF19YCk7XG5cbiAgICAgIC8vIHByZWZlciBub3RpY2Ugb3ZlciBsaWNlbnNlXG4gICAgICBpZiAoYXR0ci5ub3RpY2VUZXh0KSB7XG4gICAgICAgIGNvbnRlbnQucHVzaChhdHRyLm5vdGljZVRleHQpO1xuICAgICAgfSBlbHNlIGlmIChhdHRyLmxpY2Vuc2VUZXh0KSB7XG4gICAgICAgIGNvbnRlbnQucHVzaChhdHRyLmxpY2Vuc2VUZXh0KTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQucHVzaChBVFRSSUJVVElPTl9TRVBBUkFUT1IpO1xuICAgIH1cblxuICAgIHJldHVybiBjb250ZW50XG4gICAgICAvLyBzaW5jZSB3ZSBhcmUgZW1iZWRkaW5nIGV4dGVybmFsIGZpbGVzLCB0aG9zZSBjYW4gZGlmZmVyZW50IGxpbmVcbiAgICAgIC8vIGVuZGluZ3MsIHNvIHdlIHN0YW5kYXJkaXplIHRvIExGLlxuICAgICAgLm1hcChsID0+IGwucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKSlcbiAgICAgIC5qb2luKCdcXG4nKTtcblxuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZUF0dHJpYnV0aW9ucygpOiBNYXA8c3RyaW5nLCBBdHRyaWJ1dGlvbj4ge1xuXG4gICAgaWYgKHRoaXMuZGVwZW5kZW5jaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG5ldyBNYXAoKTtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWJ1dGlvbnM6IE1hcDxzdHJpbmcsIEF0dHJpYnV0aW9uPiA9IG5ldyBNYXAoKTtcblxuICAgIGNvbnN0IHBrZyA9IChkOiBQYWNrYWdlKSA9PiBgJHtkLm5hbWV9QCR7ZC52ZXJzaW9ufWA7XG5cbiAgICBjb25zdCBwYWNrYWdlcyA9IHRoaXMuZGVwZW5kZW5jaWVzLm1hcChkID0+IHBrZyhkKSk7XG5cbiAgICBmdW5jdGlvbiBmZXRjaEluZm9zKF9jd2Q6IHN0cmluZywgX3BhY2thZ2VzOiBzdHJpbmdbXSkge1xuICAgICAgLy8gd2UgZG9uJ3QgdXNlIHRoZSBwcm9ncmFtbWF0aWMgQVBJIHNpbmNlIGl0IG9ubHkgb2ZmZXJzIGFuIGFzeW5jIEFQSS5cbiAgICAgIC8vIHByZWZlciB0byBzdGF5IHN5bmMgZm9yIG5vdyBzaW5jZSBpdHMgZWFzaWVyIHRvIGludGVncmF0ZSB3aXRoIG90aGVyIHRvb2xpbmcuXG4gICAgICAvLyB3aWxsIG9mZmVyIGFuIGFzeW5jIEFQSSBmdXJ0aGVyIGRvd24gdGhlIHJvYWQuXG4gICAgICBjb25zdCBjb21tYW5kID0gYCR7cmVxdWlyZS5yZXNvbHZlKCdsaWNlbnNlLWNoZWNrZXIvYmluL2xpY2Vuc2UtY2hlY2tlcicpfSAtLWpzb24gLS1wYWNrYWdlcyBcIiR7X3BhY2thZ2VzLmpvaW4oJzsnKX1cImA7XG4gICAgICBjb25zdCBvdXRwdXQgPSBzaGVsbChjb21tYW5kLCB7IGN3ZDogX2N3ZCwgcXVpZXQ6IHRydWUgfSk7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShvdXRwdXQpO1xuICAgIH1cblxuICAgIC8vIGZpcnN0IHJ1biBhIGdsb2JhbCBjb21tYW5kIHRvIGZldGNoIGFzIG11Y2ggaW5mb3JtYXRpb24gaW4gb25lIHNob3RcbiAgICBjb25zdCBpbmZvcyA9IGZldGNoSW5mb3ModGhpcy5kZXBlbmRlbmNpZXNSb290LCBwYWNrYWdlcyk7XG5cbiAgICBmb3IgKGNvbnN0IGRlcCBvZiB0aGlzLmRlcGVuZGVuY2llcykge1xuICAgICAgY29uc3Qga2V5ID0gcGtnKGRlcCk7XG5cbiAgICAgIC8vIHNvbWV0aW1lcyB0aGUgZGVwZW5kZW5jeSBtaWdodCBub3QgZXhpc3QgZnJvbSBmZXRjaGluZyBpbmZvcm1hdGlvbiBnbG9iYWxseSxcbiAgICAgIC8vIHNvIHdlIHRyeSBmZXRjaGluZyBhIGNvbmNyZXRlIHBhY2thZ2UuIHRoaXMgY2FuIGhhcHBlbiBmb3IgZXhhbXBsZSB3aGVuXG4gICAgICAvLyB0d28gZGlmZmVyZW50IG1ham9yIHZlcnNpb25zIGV4aXN0IG9mIHRoZSBzYW1lIGRlcGVuZGVuY3kuXG4gICAgICBjb25zdCBpbmZvOiBNb2R1bGVJbmZvID0gaW5mb3Nba2V5XSA/PyBmZXRjaEluZm9zKGRlcC5wYXRoLCBbcGtnKGRlcCldKVtrZXldO1xuXG4gICAgICBpZiAoIWluZm8pIHtcbiAgICAgICAgLy8gbWFrZSBzdXJlIGFsbCBkZXBlbmRlbmNpZXMgYXJlIGFjY291bnRlZCBmb3IuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGxvY2F0ZSBsaWNlbnNlIGluZm9ybWF0aW9uIGZvciAke2tleX0gKCR7ZGVwLnBhdGh9KWApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBub3RpY2VUZXh0ID0gaW5mby5ub3RpY2VGaWxlID8gZnMucmVhZEZpbGVTeW5jKGluZm8ubm90aWNlRmlsZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSA6IHVuZGVmaW5lZDtcblxuICAgICAgLy8gZm9yIHNvbWUgcmVhc29uLCB0aGUgbGljZW5zZS1jaGVja2VyIHBhY2thZ2UgZmFsbHMgYmFjayB0byB0aGUgUkVBRE1FLm1kIGZpbGUgb2YgdGhlIHBhY2thZ2UgZm9yIGxpY2Vuc2VcbiAgICAgIC8vIHRleHQuIHRoaXMgc2VlbXMgc3RyYW5nZSwgZGlzYWJsaW5nIHRoYXQgZm9yIG5vdy5cbiAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZGF2Z2xhc3MvbGljZW5zZS1jaGVja2VyL2Jsb2IvbWFzdGVyL2xpYi9saWNlbnNlLWZpbGVzLmpzI0w5XG4gICAgICAvLyBub3RlIHRoYXQgYSBub24gZXhpc3RpbmcgbGljZW5zZSBmaWxlIGlzIG9rIGFzIGxvbmcgYXMgdGhlIGxpY2Vuc2UgdHlwZSBjb3VsZCBiZSBleHRyYWN0ZWQuXG4gICAgICBjb25zdCBsaWNlbnNlRmlsZSA9IGluZm8ubGljZW5zZUZpbGU/LnRvTG93ZXJDYXNlKCkuZW5kc1dpdGgoJy5tZCcpID8gdW5kZWZpbmVkIDogaW5mby5saWNlbnNlRmlsZTtcbiAgICAgIGNvbnN0IGxpY2Vuc2VUZXh0ID0gbGljZW5zZUZpbGUgPyBmcy5yZWFkRmlsZVN5bmMobGljZW5zZUZpbGUsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkgOiB1bmRlZmluZWQ7XG5cbiAgICAgIC8vIHRoZSBsaWNlbnNlcyBrZXkgY29tZXMgaW4gZGlmZmVyZW50IHR5cGVzIGJ1dCB3ZSBjb252ZXJ0IGl0IGhlcmVcbiAgICAgIC8vIHRvIGFsd2F5cyBiZSBhbiBhcnJheS5cbiAgICAgIGNvbnN0IGxpY2Vuc2VzID0gIWluZm8ubGljZW5zZXMgPyB1bmRlZmluZWQgOiAoQXJyYXkuaXNBcnJheShpbmZvLmxpY2Vuc2VzKSA/IGluZm8ubGljZW5zZXMgOiBbaW5mby5saWNlbnNlc10pO1xuXG4gICAgICBhdHRyaWJ1dGlvbnMuc2V0KGtleSwge1xuICAgICAgICBwYWNrYWdlOiBrZXksXG4gICAgICAgIHVybDogYGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlLyR7ZGVwLm5hbWV9L3YvJHtkZXAudmVyc2lvbn1gLFxuICAgICAgICBsaWNlbnNlczogbGljZW5zZXMgPz8gW10sXG4gICAgICAgIGxpY2Vuc2VUZXh0LFxuICAgICAgICBub3RpY2VUZXh0LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJpYnV0aW9ucztcbiAgfVxuXG59XG5cbi8qKlxuICogQXR0cmlidXRpb24gb2YgYSBzcGVjaWZpYyBkZXBlbmRlbmN5LlxuICovXG5pbnRlcmZhY2UgQXR0cmlidXRpb24ge1xuICAvKipcbiAgICogQXR0cmlidXRlZCBwYWNrYWdlIChuYW1lICsgdmVyc2lvbilcbiAgICovXG4gIHJlYWRvbmx5IHBhY2thZ2U6IHN0cmluZztcbiAgLyoqXG4gICAqIFVSTCB0byB0aGUgcGFja2FnZS5cbiAgICovXG4gIHJlYWRvbmx5IHVybDogc3RyaW5nO1xuICAvKipcbiAgICogUGFja2FnZSBsaWNlbnNlcy5cbiAgICpcbiAgICogTm90ZSB0aGF0IHNvbWUgcGFja2FnZXMgd2lsbCBtYXkgaGF2ZSBtdWx0aXBsZSBsaWNlbnNlcyxcbiAgICogd2hpY2ggaXMgd2h5IHRoaXMgaXMgYW4gYXJyYXkuIEluIHN1Y2ggY2FzZXMsIHRoZSBsaWNlbnNlXG4gICAqIHZhbGlkYXRpb24gd2lsbCBmYWlsIHNpbmNlIHdlIGN1cnJlbnRseSBkaXNhbGxvdyB0aGlzLlxuICAgKi9cbiAgcmVhZG9ubHkgbGljZW5zZXM6IHN0cmluZ1tdO1xuICAvKipcbiAgICogUGFja2FnZSBsaWNlbnNlIGNvbnRlbnQuXG4gICAqXG4gICAqIEluIGNhc2UgYSBwYWNrYWdlIGhhcyBtdWx0aXBsZSBsaWNlbnNlcywgdGhpcyB3aWxsXG4gICAqIGNvbnRhaW4uLi5vbmUgb2YgdGhlbS4gSXQgY3VycmVudGx5IGRvZXNuJ3QgbWF0dGVyIHdoaWNoXG4gICAqIG9uZSBzaW5jZSBpdCB3aWxsIG5vdCBwYXNzIHZhbGlkYXRpb24gYW55d2F5LlxuICAgKi9cbiAgcmVhZG9ubHkgbGljZW5zZVRleHQ/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBQYWNrYWdlIG5vdGljZS5cbiAgICovXG4gIHJlYWRvbmx5IG5vdGljZVRleHQ/OiBzdHJpbmc7XG59XG4iXX0=