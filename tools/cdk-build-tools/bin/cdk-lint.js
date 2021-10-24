"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const lint_1 = require("../lib/lint");
const package_info_1 = require("../lib/package-info");
async function main() {
    const args = yargs
        .usage('Usage: cdk-lint')
        .option('eslint', {
        type: 'string',
        desc: 'Specify a different eslint executable',
        defaultDescription: 'eslint provided by node dependencies',
    })
        .option('fix', {
        type: 'boolean',
        desc: 'Fix the found issues',
        default: false,
    })
        .argv;
    const options = package_info_1.cdkBuildOptions();
    await lint_1.lintCurrentPackage(options, { eslint: args.eslint, fix: args.fix });
}
main().catch(e => {
    process.stderr.write(`${e.toString()}\n`);
    process.stderr.write('Linting failed.\n');
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWxpbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstbGludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUErQjtBQUMvQixzQ0FBaUQ7QUFDakQsc0RBQXNEO0FBRXRELEtBQUssVUFBVSxJQUFJO0lBQ2pCLE1BQU0sSUFBSSxHQUFHLEtBQUs7U0FDZixLQUFLLENBQUMsaUJBQWlCLENBQUM7U0FDeEIsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNoQixJQUFJLEVBQUUsUUFBUTtRQUNkLElBQUksRUFBRSx1Q0FBdUM7UUFDN0Msa0JBQWtCLEVBQUUsc0NBQXNDO0tBQzNELENBQUM7U0FDRCxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2IsSUFBSSxFQUFFLFNBQVM7UUFDZixJQUFJLEVBQUUsc0JBQXNCO1FBQzVCLE9BQU8sRUFBRSxLQUFLO0tBQ2YsQ0FBQztTQUNELElBQUksQ0FBQztJQUVSLE1BQU0sT0FBTyxHQUFHLDhCQUFlLEVBQUUsQ0FBQztJQUVsQyxNQUFNLHlCQUFrQixDQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBRUQsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ2YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDMUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDLENBQUMsQ0FBQyJ9