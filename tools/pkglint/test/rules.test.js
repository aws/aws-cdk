"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
const packagejson_1 = require("../lib/packagejson");
const rules = require("../lib/rules");
const fake_module_1 = require("./fake-module");
describe('FeatureStabilityRule', () => {
    let fakeModule;
    beforeEach(() => {
        fakeModule = undefined;
    });
    afterEach(async () => {
        if (fakeModule) {
            await fakeModule.cleanup();
        }
    });
    test('feature table is rendered', async () => {
        fakeModule = new fake_module_1.FakeModule({
            files: {
                'package.json': {
                    features: [
                        { name: 'Experimental Feature', stability: 'Experimental' },
                        { name: 'Stable Feature', stability: 'Stable' },
                        { name: 'Dev Preview Feature', stability: 'Developer Preview' },
                        { name: 'Not Implemented Feature', stability: 'Not Implemented' },
                    ],
                },
                'README.md': '',
            },
        });
        const dirPath = await fakeModule.tmpdir();
        const rule = new rules.FeatureStabilityRule();
        const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
        rule.validate(pkgJson);
        expect(pkgJson.hasReports).toBe(true);
        pkgJson.applyFixes();
        const fixedContents = await fs.readFile(path.join(dirPath, 'README.md'), { encoding: 'utf8' });
        expect(fixedContents).toMatch(/Experimental Feature\s* \| \!\[Experimental\]/);
        expect(fixedContents).toMatch(/Dev Preview Feature\s* \| \!\[Developer Preview\]/);
        expect(fixedContents).toMatch(/Stable Feature\s* \| \!\[Stable\]/);
        expect(fixedContents).toMatch(/Not Implemented Feature\s* \| \!\[Not Implemented\]/);
        expect(fixedContents).not.toMatch(/CFN Resources/);
    });
    test('CFN Resources is rendered', async () => {
        fakeModule = new fake_module_1.FakeModule({
            files: {
                'package.json': {
                    'cdk-build': { cloudformation: 'Foo::Bar' },
                    'features': [],
                },
                'README.md': '',
            },
        });
        const dirPath = await fakeModule.tmpdir();
        const rule = new rules.FeatureStabilityRule();
        const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
        rule.validate(pkgJson);
        expect(pkgJson.hasReports).toBe(true);
        pkgJson.applyFixes();
        const fixedContents = await fs.readFile(path.join(dirPath, 'README.md'), { encoding: 'utf8' });
        expect(fixedContents).toMatch(/CFN Resources | \!\[Stable\]/);
    });
    describe('banner notices', () => {
        test('CFN Resources', async () => {
            fakeModule = new fake_module_1.FakeModule({
                files: {
                    'package.json': {
                        'cdk-build': { cloudformation: 'Foo::Bar' },
                        'features': [],
                    },
                    'README.md': '',
                },
            });
            const dirPath = await fakeModule.tmpdir();
            const rule = new rules.FeatureStabilityRule();
            const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
            rule.validate(pkgJson);
            pkgJson.applyFixes();
            const fixedContents = await fs.readFile(path.join(dirPath, 'README.md'), { encoding: 'utf8' });
            expect(fixedContents).toMatch(/> \*\*CFN Resources:\*\*/);
        });
        test('experimental', async () => {
            fakeModule = new fake_module_1.FakeModule({
                files: {
                    'package.json': {
                        features: [
                            { name: 'Feature', stability: 'Experimental' },
                        ],
                    },
                    'README.md': '',
                },
            });
            const dirPath = await fakeModule.tmpdir();
            const rule = new rules.FeatureStabilityRule();
            const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
            rule.validate(pkgJson);
            pkgJson.applyFixes();
            const fixedContents = await fs.readFile(path.join(dirPath, 'README.md'), { encoding: 'utf8' });
            expect(fixedContents).toMatch(/> \*\*Experimental:\*\*/);
            expect(fixedContents).not.toMatch(/> \*\*Developer Preview:\*\*/);
            expect(fixedContents).not.toMatch(/> \*\*Stable:\*\*/);
        });
        test('developer preview', async () => {
            fakeModule = new fake_module_1.FakeModule({
                files: {
                    'package.json': {
                        features: [
                            { name: 'Feature', stability: 'Developer Preview' },
                        ],
                    },
                    'README.md': '',
                },
            });
            const dirPath = await fakeModule.tmpdir();
            const rule = new rules.FeatureStabilityRule();
            const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
            rule.validate(pkgJson);
            pkgJson.applyFixes();
            const fixedContents = await fs.readFile(path.join(dirPath, 'README.md'), { encoding: 'utf8' });
            expect(fixedContents).toMatch(/> \*\*Developer Preview:\*\*/);
            expect(fixedContents).not.toMatch(/> \*\*Experimental:\*\*/);
            expect(fixedContents).not.toMatch(/> \*\*Stable:\*\*/);
        });
        test('stable', async () => {
            fakeModule = new fake_module_1.FakeModule({
                files: {
                    'package.json': {
                        features: [
                            { name: 'Feature', stability: 'Stable' },
                        ],
                    },
                    'README.md': '',
                },
            });
            const dirPath = await fakeModule.tmpdir();
            const rule = new rules.FeatureStabilityRule();
            const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
            rule.validate(pkgJson);
            pkgJson.applyFixes();
            const fixedContents = await fs.readFile(path.join(dirPath, 'README.md'), { encoding: 'utf8' });
            expect(fixedContents).toMatch(/> \*\*Stable:\*\*/);
            expect(fixedContents).not.toMatch(/> \*\*Experimental:\*\*/);
            expect(fixedContents).not.toMatch(/> \*\*Developer Preview:\*\*/);
        });
    });
    test('skip if package private', async () => {
        fakeModule = new fake_module_1.FakeModule({
            files: {
                'package.json': {
                    private: true,
                    features: [
                        { name: 'Experimental Feature', stability: 'Experimental' },
                    ],
                },
                'README.md': '',
            },
        });
        const dirPath = await fakeModule.tmpdir();
        const rule = new rules.FeatureStabilityRule();
        const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
        rule.validate(pkgJson);
        expect(pkgJson.hasReports).toBe(false);
    });
    test('skip if features is not specified', async () => {
        fakeModule = new fake_module_1.FakeModule({
            files: {
                'package.json': {},
                'README.md': '',
            },
        });
        const dirPath = await fakeModule.tmpdir();
        const rule = new rules.FeatureStabilityRule();
        const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
        rule.validate(pkgJson);
        expect(pkgJson.hasReports).toBe(false);
    });
    test('skip if README.md is missing', async () => {
        fakeModule = new fake_module_1.FakeModule({
            files: {
                'package.json': {
                    features: [
                        { name: 'Experimental Feature', stability: 'Experimental' },
                    ],
                },
            },
        });
        const dirPath = await fakeModule.tmpdir();
        const rule = new rules.FeatureStabilityRule();
        const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
        rule.validate(pkgJson);
        expect(pkgJson.hasReports).toBe(false);
    });
});
describe('ThirdPartyAttributions', () => {
    let fakeModule;
    beforeEach(() => {
        fakeModule = undefined;
    });
    afterEach(async () => {
        if (fakeModule) {
            await fakeModule.cleanup();
        }
    });
    test('errors when attribution missing for bundled dependencies', async () => {
        fakeModule = new fake_module_1.FakeModule({
            files: {
                'package.json': {
                    bundledDependencies: ['dep1', 'dep2'],
                },
                'node_modules/dep1/package.json': {},
                'node_modules/dep2/package.json': {},
                'NOTICE': '',
            },
        });
        const dirPath = await fakeModule.tmpdir();
        const rule = new rules.ThirdPartyAttributions();
        const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
        rule.validate(pkgJson);
        expect(pkgJson.hasReports).toBe(true);
        expect(pkgJson.reports.length).toEqual(2);
        for (const report of pkgJson.reports) {
            expect(report.ruleName).toEqual('license/3p-attributions');
            expect(report.message).toContain('Missing attribution');
        }
        expect(pkgJson.reports[0].message).toContain('dep1');
        expect(pkgJson.reports[1].message).toContain('dep2');
    });
    test('errors when there are excessive attributions', async () => {
        fakeModule = new fake_module_1.FakeModule({
            files: {
                'package.json': {
                    bundledDependencies: ['dep1'],
                },
                'node_modules/dep1/package.json': {},
                'NOTICE': [
                    '** dep1 - https://link-somewhere',
                    '** dep2 - https://link-elsewhere',
                    '** dep3-rev - https://link-elsewhere',
                ].join('\n'),
            },
        });
        const dirPath = await fakeModule.tmpdir();
        const rule = new rules.ThirdPartyAttributions();
        const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
        rule.validate(pkgJson);
        expect(pkgJson.hasReports).toBe(true);
        expect(pkgJson.reports.length).toEqual(2);
        for (const report of pkgJson.reports) {
            expect(report.ruleName).toEqual('license/3p-attributions');
            expect(report.message).toContain('Unnecessary attribution');
        }
        expect(pkgJson.reports[0].message).toContain('dep2');
        expect(pkgJson.reports[1].message).toContain('dep3-rev');
    });
    test('passes when attribution is present', async () => {
        fakeModule = new fake_module_1.FakeModule({
            files: {
                'package.json': {
                    bundledDependencies: ['dep1', 'dep2'],
                },
                'node_modules/dep1/package.json': {},
                'node_modules/dep2/package.json': {},
                'NOTICE': [
                    '** dep1 - https://link-somewhere',
                    '** dep2 - https://link-elsewhere',
                ].join('\n'),
            },
        });
        const dirPath = await fakeModule.tmpdir();
        const rule = new rules.ThirdPartyAttributions();
        const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
        rule.validate(pkgJson);
        expect(pkgJson.hasReports).toBe(false);
    });
    test('passes when attribution for transitive bundled deps are present', async () => {
        fakeModule = new fake_module_1.FakeModule({
            files: {
                'package.json': {
                    bundledDependencies: ['dep1'],
                },
                'node_modules/dep1/package.json': {
                    dependencies: { dep2: '1.2.3' },
                },
                'node_modules/dep2/package.json': {},
                'NOTICE': [
                    '** dep1 - https://link-somewhere',
                    '** dep2 - https://link-elsewhere',
                ].join('\n'),
            },
        });
        const dirPath = await fakeModule.tmpdir();
        const rule = new rules.ThirdPartyAttributions();
        const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
        rule.validate(pkgJson);
        expect(pkgJson.hasReports).toBe(false);
    });
    test('fails when attribution for transitive bundled deps are missing', async () => {
        fakeModule = new fake_module_1.FakeModule({
            files: {
                'package.json': {
                    bundledDependencies: ['dep1'],
                },
                'node_modules/dep1/package.json': {
                    dependencies: { dep2: '1.2.3' },
                },
                'node_modules/dep2/package.json': {},
                'NOTICE': [
                    '** dep1 - https://link-somewhere',
                ].join('\n'),
            },
        });
        const dirPath = await fakeModule.tmpdir();
        const rule = new rules.ThirdPartyAttributions();
        const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
        rule.validate(pkgJson);
        expect(pkgJson.hasReports).toBe(true);
        expect(pkgJson.reports.length).toEqual(1);
        expect(pkgJson.reports[0].ruleName).toEqual('license/3p-attributions');
        expect(pkgJson.reports[0].message).toContain('Missing attribution');
        expect(pkgJson.reports[0].message).toContain('dep2');
    });
    test('skipped when no bundled dependencies', async () => {
        fakeModule = new fake_module_1.FakeModule({
            files: {
                'package.json': {},
                'NOTICE': '',
            },
        });
        const dirPath = await fakeModule.tmpdir();
        const rule = new rules.ThirdPartyAttributions();
        const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
        rule.validate(pkgJson);
        expect(pkgJson.hasReports).toBe(false);
    });
    test('skipped for private packages', async () => {
        fakeModule = new fake_module_1.FakeModule({
            files: {
                'package.json': {
                    private: true,
                    bundledDependencies: ['dep1', 'dep2'],
                },
                'node_modules/dep1/package.json': {},
                'node_modules/dep2/package.json': {},
                'NOTICE': '',
            },
        });
        const dirPath = await fakeModule.tmpdir();
        const rule = new rules.ThirdPartyAttributions();
        const pkgJson = new packagejson_1.PackageJson(path.join(dirPath, 'package.json'));
        rule.validate(pkgJson);
        expect(pkgJson.hasReports).toBe(false);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZXMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJ1bGVzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsK0JBQStCO0FBQy9CLG9EQUFpRDtBQUNqRCxzQ0FBc0M7QUFDdEMsK0NBQTJDO0FBRTNDLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7SUFDcEMsSUFBSSxVQUFrQyxDQUFDO0lBRXZDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBRUgsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ25CLElBQUksVUFBVSxFQUFFO1lBQ2QsTUFBTSxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDNUI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywyQkFBMkIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMzQyxVQUFVLEdBQUcsSUFBSSx3QkFBVSxDQUFDO1lBQzFCLEtBQUssRUFBRTtnQkFDTCxjQUFjLEVBQUU7b0JBQ2QsUUFBUSxFQUFFO3dCQUNSLEVBQUUsSUFBSSxFQUFFLHNCQUFzQixFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUU7d0JBQzNELEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUU7d0JBQy9DLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFLFNBQVMsRUFBRSxtQkFBbUIsRUFBRTt3QkFDL0QsRUFBRSxJQUFJLEVBQUUseUJBQXlCLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFO3FCQUNsRTtpQkFDRjtnQkFDRCxXQUFXLEVBQUUsRUFBRTthQUNoQjtTQUNGLENBQUMsQ0FBQztRQUNILE1BQU0sT0FBTyxHQUFHLE1BQU0sVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFDLE1BQU0sSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLG9CQUFv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