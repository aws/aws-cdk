#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const yargs = require("yargs");
const lib_1 = require("../lib");
/* eslint-disable @typescript-eslint/no-shadow */
const argv = yargs
    .usage('$0 [directory]')
    .option('fix', { type: 'boolean', alias: 'f', desc: 'Fix package.json in addition to reporting mistakes' })
    .argv;
// Our version of yargs doesn't support positional arguments yet
const directory = argv._[0] || '.';
if (typeof (directory) !== 'string') {
    throw new Error(`First argument should be a string. Got: ${directory} (${typeof (directory)})`);
}
argv.directory = path.resolve(directory, process.cwd());
async function main() {
    const ruleClasses = require('../lib/rules'); // eslint-disable-line @typescript-eslint/no-require-imports
    const rules = Object.keys(ruleClasses).map(key => new ruleClasses[key]()).filter(obj => obj instanceof lib_1.ValidationRule);
    const pkgs = lib_1.findPackageJsons(argv.directory);
    rules.forEach(rule => pkgs.filter(pkg => pkg.shouldApply(rule)).forEach(pkg => rule.prepare(pkg)));
    rules.forEach(rule => pkgs.filter(pkg => pkg.shouldApply(rule)).forEach(pkg => rule.validate(pkg)));
    if (argv.fix) {
        pkgs.forEach(pkg => pkg.applyFixes());
    }
    pkgs.forEach(pkg => pkg.displayReports(argv.directory));
    if (pkgs.some(p => p.hasReports)) {
        throw new Error('Some package.json files had errors');
    }
}
main().catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGtnbGludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBrZ2xpbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUMvQixnQ0FBMEQ7QUFFMUQsaURBQWlEO0FBQ2pELE1BQU0sSUFBSSxHQUFHLEtBQUs7S0FDZixLQUFLLENBQUMsZ0JBQWdCLENBQUM7S0FDdkIsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsb0RBQW9ELEVBQUUsQ0FBQztLQUMxRyxJQUFJLENBQUM7QUFFUixnRUFBZ0U7QUFDaEUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUM7QUFFbkMsSUFBSSxPQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssUUFBUSxFQUFFO0lBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLFNBQVMsS0FBSyxPQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ2hHO0FBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUV4RCxLQUFLLFVBQVUsSUFBSTtJQUNqQixNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyw0REFBNEQ7SUFDekcsTUFBTSxLQUFLLEdBQXFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxvQkFBYyxDQUFDLENBQUM7SUFFekksTUFBTSxJQUFJLEdBQUcsc0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQW1CLENBQUMsQ0FBQztJQUV4RCxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVwRyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7S0FDdkM7SUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBbUIsQ0FBQyxDQUFDLENBQUM7SUFFbEUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztLQUN2RDtBQUNILENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUNqQixzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFDIn0=