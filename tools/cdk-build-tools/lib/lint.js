"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lintCurrentPackage = void 0;
const path = require("path");
const process = require("process");
const fs = require("fs-extra");
const os_1 = require("./os");
async function lintCurrentPackage(options, compilers = {}) {
    var _a, _b;
    const env = options.env;
    const fixOption = compilers.fix ? ['--fix'] : [];
    if (!((_a = options.eslint) === null || _a === void 0 ? void 0 : _a.disable)) {
        await os_1.shell([
            compilers.eslint || require.resolve('eslint/bin/eslint'),
            '.',
            '--ext=.ts',
            `--resolve-plugins-relative-to=${__dirname}`,
            ...fixOption,
        ], { env });
    }
    if (!((_b = options.pkglint) === null || _b === void 0 ? void 0 : _b.disable)) {
        await os_1.shell([
            'pkglint',
            ...fixOption,
        ], { env });
    }
    if (await fs.pathExists('README.md')) {
        await os_1.shell([
            process.execPath,
            ...process.execArgv,
            '--',
            require.resolve('markdownlint-cli'),
            '--config', path.resolve(__dirname, '..', 'config', 'markdownlint.json'),
            ...fixOption,
            'README.md',
        ]);
    }
    await os_1.shell([path.join(__dirname, '..', 'bin', 'cdk-awslint')], { env });
}
exports.lintCurrentPackage = lintCurrentPackage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBQzdCLG1DQUFtQztBQUNuQywrQkFBK0I7QUFDL0IsNkJBQTZCO0FBR3RCLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxPQUF3QixFQUFFLFlBQW1ELEVBQUU7O0lBQ3RILE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFDeEIsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRWpELElBQUksUUFBQyxPQUFPLENBQUMsTUFBTSwwQ0FBRSxPQUFPLENBQUEsRUFBRTtRQUM1QixNQUFNLFVBQUssQ0FBQztZQUNWLFNBQVMsQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztZQUN4RCxHQUFHO1lBQ0gsV0FBVztZQUNYLGlDQUFpQyxTQUFTLEVBQUU7WUFDNUMsR0FBRyxTQUFTO1NBQ2IsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDYjtJQUVELElBQUksUUFBQyxPQUFPLENBQUMsT0FBTywwQ0FBRSxPQUFPLENBQUEsRUFBRTtRQUM3QixNQUFNLFVBQUssQ0FBQztZQUNWLFNBQVM7WUFDVCxHQUFHLFNBQVM7U0FDYixFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztLQUNiO0lBRUQsSUFBSSxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUU7UUFDcEMsTUFBTSxVQUFLLENBQUM7WUFDVixPQUFPLENBQUMsUUFBUTtZQUNoQixHQUFHLE9BQU8sQ0FBQyxRQUFRO1lBQ25CLElBQUk7WUFDSixPQUFPLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDO1lBQ25DLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixDQUFDO1lBQ3hFLEdBQUcsU0FBUztZQUNaLFdBQVc7U0FDWixDQUFDLENBQUM7S0FDSjtJQUVELE1BQU0sVUFBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUMzRSxDQUFDO0FBbENELGdEQWtDQyJ9