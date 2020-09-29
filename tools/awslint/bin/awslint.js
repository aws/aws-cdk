"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-line-length
const child_process = require("child_process");
const colors = require("colors");
const fs = require("fs-extra");
const reflect = require("jsii-reflect");
const path = require("path");
const yargs = require("yargs");
const lib_1 = require("../lib");
let stackTrace = false;
async function main() {
    const argv = yargs
        .env('AWSLINT')
        .usage('awslint [options] [command]')
        .showHelpOnFail(true)
        .command('', 'lint the current module (default)')
        .command('list', 'list all available rules')
        .option('include', { alias: 'i', type: 'array', desc: 'evaluate only this rule(s)', default: ['*'] })
        .option('exclude', { alias: 'x', type: 'array', desc: 'do not evaludate these rules (takes priority over --include)', default: [] })
        .option('save', { type: 'boolean', desc: 'updates package.json with "exclude" statements for all failing rules', default: false })
        .option('verbose', { alias: 'v', type: 'boolean', desc: 'verbose output (prints all assertions)', default: false })
        .option('quiet', { alias: 'q', type: 'boolean', desc: 'quiet mode - shows only errors', default: false })
        .option('force', { type: 'boolean', desc: 'succeed silently if this is not a jsii module', default: true })
        .option('config', { type: 'boolean', desc: 'reads options from the "awslint" section in package.json', default: true })
        .option('debug', { type: 'boolean', desc: 'debug output', default: false })
        .option('compile', { alias: 'c', type: 'boolean', desc: 'always run the jsii compiler (use "--no-compile" to never run the compiler, even if .jsii doesn\'t exist)' })
        .group('include', 'Filtering')
        .group('exclude', 'Filtering')
        .group('config', 'Configuration')
        .group('save', 'Configuration')
        .group('verbose', 'Output')
        .group('quiet', 'Output')
        .group('debug', 'Output')
        .group('compile', 'Build')
        .example('awslint', 'lints the current module against all rules')
        .example('awslint -v -i "resource*" -i "import*"', 'lints against all rules that start with "resource" or "import" and print successes')
        .example('awslint -x "*:@aws-cdk/aws-s3*"', 'evaluate all rules in all scopes besides ones that begin with "@aws-cdk/aws-s3"')
        .example('awslint --save', 'updated "package.json" with "exclude"s for all failing rules');
    if (!process.stdout.isTTY) {
        colors.disable();
    }
    const args = argv.argv;
    stackTrace = args.verbose || args.debug;
    if (args._.length > 1) {
        argv.showHelp();
        process.exit(1);
    }
    const command = args._[0] || 'lint';
    const workdir = process.cwd();
    const config = path.join(workdir, 'package.json');
    if (command === 'list') {
        for (const rule of lib_1.ALL_RULES_LINTER.rules) {
            console.info(`${colors.cyan(rule.code)}: ${rule.message}`);
        }
        return;
    }
    // if no package.json and force is true (default), just don't do anything
    if (!await fs.pathExists(config) && args.force) {
        return;
    }
    const pkg = await fs.readJSON(config);
    // if this is not a jsii module we have nothing to look for
    if (!pkg.jsii) {
        if (args.force) {
            return; // just silently succeed
        }
        throw new Error(`Module in ${workdir} is not a jsii module (no "jsii" section in package.json)`);
    }
    // if package.json contains a `jsii` section but there is no .jsii file
    // it means we haven't compiled the module.
    if (await shouldCompile()) {
        await shell('jsii');
    }
    // read "awslint" from package.json
    if (args.config) {
        mergeOptions(args, pkg.awslint);
    }
    if (args.debug) {
        console.error('command: ' + command);
        console.error('options: ' + JSON.stringify(args, undefined, 2));
    }
    if (command === 'lint') {
        const assembly = await loadModule(workdir);
        if (!assembly) {
            return;
        }
        const excludesToSave = new Array();
        let errors = 0;
        const results = [];
        results.push(...lib_1.ALL_RULES_LINTER.eval(assembly, {
            include: args.include,
            exclude: args.exclude,
        }));
        // Sort errors to the top (highest severity first)
        results.sort((a, b) => b.level - a.level);
        // process results
        for (const diag of results) {
            const suppressionKey = `${diag.rule.code}:${diag.scope}`;
            let color;
            switch (diag.level) {
                case lib_1.DiagnosticLevel.Success:
                    if (args.verbose) {
                        color = colors.gray;
                    }
                    break;
                case lib_1.DiagnosticLevel.Error:
                    errors++;
                    color = colors.red;
                    if (args.save) {
                        excludesToSave.push(suppressionKey);
                    }
                    break;
                case lib_1.DiagnosticLevel.Warning:
                    if (!args.quiet) {
                        color = colors.yellow;
                    }
                    break;
                case lib_1.DiagnosticLevel.Skipped:
                    if (!args.quiet) {
                        color = colors.blue;
                    }
                    break;
            }
            if (color) {
                console.error(color(`${lib_1.DiagnosticLevel[diag.level].toLowerCase()}: [${colors.bold(`awslint:${diag.rule.code}`)}:${colors.bold(diag.scope)}] ${diag.message}`));
            }
        }
        if (excludesToSave.length > 0) {
            if (!pkg.awslint) {
                pkg.awslint = {};
            }
            if (!pkg.awslint.exclude) {
                pkg.awslint.exclude = [];
            }
            const excludes = pkg.awslint.exclude;
            for (const exclude of excludesToSave) {
                if (excludes.indexOf(exclude) === -1) {
                    excludes.push(exclude);
                }
            }
            if (excludes.length > 0) {
                await fs.writeJSON(config, pkg, { spaces: 2 });
            }
        }
        if (errors && !args.save) {
            process.exit(1);
        }
        return;
    }
    argv.showHelp();
    throw new Error(`Invalid command: ${command}`);
    async function shouldCompile() {
        // if --compile is explicitly enabled then just compile always
        if (args.compile === true) {
            return true;
        }
        // if we have a .jsii file and we are not forced to compile, then don't compile
        if (await fs.pathExists(path.join(workdir, '.jsii'))) {
            return false;
        }
        // we don't have a .jsii file, and --no-compile is explicily set, then it's an error
        if (args.compile === false) {
            throw new Error(`No .jsii file and --no-compile is set`);
        }
        // compile!
        return true;
    }
}
main().catch(e => {
    console.error(colors.red(e.message));
    if (stackTrace) {
        console.error(e.stack);
    }
    process.exit(1);
});
async function loadModule(dir) {
    const ts = new reflect.TypeSystem();
    await ts.load(dir, { validate: false }); // Don't validate to save 66% of execution time (20s vs 1min).
    // We run 'awslint' during build time, assemblies are guaranteed to be ok.
    if (ts.roots.length !== 1) {
        throw new Error(`Expecting only a single root assembly`);
    }
    return ts.roots[0];
}
function mergeOptions(dest, pkg) {
    if (!pkg) {
        return;
    } // no options in package.json
    for (const [key, value] of Object.entries(pkg)) {
        // if this is an array option, then add values to destination
        if (Array.isArray(value)) {
            const arr = dest[key] || [];
            arr.push(...value);
            dest[key] = arr;
            continue;
        }
        // objects are not allowed
        if (typeof value === 'object') {
            throw new Error(`Invalid option "${key}" in package.json: ${JSON.stringify(value)}`);
        }
        // primitives simply override
        dest[key] = value;
    }
    return dest;
}
async function shell(command) {
    const child = child_process.spawn(command, [], { stdio: ['inherit', 'inherit', 'inherit'] });
    return new Promise((ok, ko) => {
        child.once('exit', (status) => {
            if (status === 0) {
                return ok();
            }
            else {
                return ko(new Error(`${command} exited with status ${status}`));
            }
        });
        child.once('error', ko);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzbGludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF3c2xpbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsK0NBQStDO0FBQy9DLGlDQUFpQztBQUNqQywrQkFBK0I7QUFDL0Isd0NBQXdDO0FBQ3hDLDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0IsZ0NBQTJEO0FBRTNELElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztBQUV2QixLQUFLLFVBQVUsSUFBSTtJQUNqQixNQUFNLElBQUksR0FBRyxLQUFLO1NBQ2YsR0FBRyxDQUFDLFNBQVMsQ0FBQztTQUNkLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQztTQUNwQyxjQUFjLENBQUMsSUFBSSxDQUFDO1NBQ3BCLE9BQU8sQ0FBQyxFQUFFLEVBQUUsbUNBQW1DLENBQUM7U0FDaEQsT0FBTyxDQUFDLE1BQU0sRUFBRSwwQkFBMEIsQ0FBQztTQUMzQyxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSw0QkFBNEIsRUFBRSxPQUFPLEVBQUUsQ0FBRSxHQUFHLENBQUUsRUFBRSxDQUFDO1NBQ3RHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLDhEQUE4RCxFQUFFLE9BQU8sRUFBRSxFQUFHLEVBQUUsQ0FBQztTQUNwSSxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsc0VBQXNFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO1NBQ2pJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLHdDQUF3QyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUNs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QUUsRUFBQyxDQUFDLENBQUM7SUFDOUYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQVcsRUFBRSxFQUFFO1lBQ2pDLElBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDaEIsT0FBTyxFQUFFLEVBQUUsQ0FBQzthQUNiO2lCQUFNO2dCQUNMLE9BQU8sRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsT0FBTyx1QkFBdUIsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2pFO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGhcbmltcG9ydCAqIGFzIGNoaWxkX3Byb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgKiBhcyBjb2xvcnMgZnJvbSAnY29sb3JzJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCAqIGFzIHJlZmxlY3QgZnJvbSAnanNpaS1yZWZsZWN0JztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB5YXJncyBmcm9tICd5YXJncyc7XG5pbXBvcnQgeyBBTExfUlVMRVNfTElOVEVSLCBEaWFnbm9zdGljTGV2ZWwgfSBmcm9tICcuLi9saWInO1xuXG5sZXQgc3RhY2tUcmFjZSA9IGZhbHNlO1xuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICBjb25zdCBhcmd2ID0geWFyZ3NcbiAgICAuZW52KCdBV1NMSU5UJylcbiAgICAudXNhZ2UoJ2F3c2xpbnQgW29wdGlvbnNdIFtjb21tYW5kXScpXG4gICAgLnNob3dIZWxwT25GYWlsKHRydWUpXG4gICAgLmNvbW1hbmQoJycsICdsaW50IHRoZSBjdXJyZW50IG1vZHVsZSAoZGVmYXVsdCknKVxuICAgIC5jb21tYW5kKCdsaXN0JywgJ2xpc3QgYWxsIGF2YWlsYWJsZSBydWxlcycpXG4gICAgLm9wdGlvbignaW5jbHVkZScsIHsgYWxpYXM6ICdpJywgdHlwZTogJ2FycmF5JywgZGVzYzogJ2V2YWx1YXRlIG9ubHkgdGhpcyBydWxlKHMpJywgZGVmYXVsdDogWyAnKicgXSB9KVxuICAgIC5vcHRpb24oJ2V4Y2x1ZGUnLCB7IGFsaWFzOiAneCcsIHR5cGU6ICdhcnJheScsIGRlc2M6ICdkbyBub3QgZXZhbHVkYXRlIHRoZXNlIHJ1bGVzICh0YWtlcyBwcmlvcml0eSBvdmVyIC0taW5jbHVkZSknLCBkZWZhdWx0OiBbIF0gfSlcbiAgICAub3B0aW9uKCdzYXZlJywgeyB0eXBlOiAnYm9vbGVhbicsIGRlc2M6ICd1cGRhdGVzIHBhY2thZ2UuanNvbiB3aXRoIFwiZXhjbHVkZVwiIHN0YXRlbWVudHMgZm9yIGFsbCBmYWlsaW5nIHJ1bGVzJywgZGVmYXVsdDogZmFsc2UgfSlcbiAgICAub3B0aW9uKCd2ZXJib3NlJywgeyBhbGlhczogJ3YnLCB0eXBlOiAnYm9vbGVhbicsIGRlc2M6ICd2ZXJib3NlIG91dHB1dCAocHJpbnRzIGFsbCBhc3NlcnRpb25zKScsIGRlZmF1bHQ6IGZhbHNlIH0pXG4gICAgLm9wdGlvbigncXVpZXQnLCB7IGFsaWFzOiAncScsIHR5cGU6ICdib29sZWFuJywgZGVzYzogJ3F1aWV0IG1vZGUgLSBzaG93cyBvbmx5IGVycm9ycycsIGRlZmF1bHQ6IGZhbHNlIH0pXG4gICAgLm9wdGlvbignZm9yY2UnLCB7IHR5cGU6ICdib29sZWFuJywgZGVzYzogJ3N1Y2NlZWQgc2lsZW50bHkgaWYgdGhpcyBpcyBub3QgYSBqc2lpIG1vZHVsZScsIGRlZmF1bHQ6IHRydWUgfSlcbiAgICAub3B0aW9uKCdjb25maWcnLCB7IHR5cGU6ICdib29sZWFuJywgZGVzYzogJ3JlYWRzIG9wdGlvbnMgZnJvbSB0aGUgXCJhd3NsaW50XCIgc2VjdGlvbiBpbiBwYWNrYWdlLmpzb24nLCBkZWZhdWx0OiB0cnVlIH0pXG4gICAgLm9wdGlvbignZGVidWcnLCB7IHR5cGU6ICdib29sZWFuJywgZGVzYzogJ2RlYnVnIG91dHB1dCcsIGRlZmF1bHQ6IGZhbHNlIH0pXG4gICAgLm9wdGlvbignY29tcGlsZScsIHsgYWxpYXM6ICdjJywgdHlwZTogJ2Jvb2xlYW4nLCAgZGVzYzogJ2Fsd2F5cyBydW4gdGhlIGpzaWkgY29tcGlsZXIgKHVzZSBcIi0tbm8tY29tcGlsZVwiIHRvIG5ldmVyIHJ1biB0aGUgY29tcGlsZXIsIGV2ZW4gaWYgLmpzaWkgZG9lc25cXCd0IGV4aXN0KScgfSlcbiAgICAuZ3JvdXAoJ2luY2x1ZGUnLCAnRmlsdGVyaW5nJylcbiAgICAuZ3JvdXAoJ2V4Y2x1ZGUnLCAnRmlsdGVyaW5nJylcbiAgICAuZ3JvdXAoJ2NvbmZpZycsICdDb25maWd1cmF0aW9uJylcbiAgICAuZ3JvdXAoJ3NhdmUnLCAnQ29uZmlndXJhdGlvbicpXG4gICAgLmdyb3VwKCd2ZXJib3NlJywgJ091dHB1dCcpXG4gICAgLmdyb3VwKCdxdWlldCcsICdPdXRwdXQnKVxuICAgIC5ncm91cCgnZGVidWcnLCAnT3V0cHV0JylcbiAgICAuZ3JvdXAoJ2NvbXBpbGUnLCAnQnVpbGQnKVxuICAgIC5leGFtcGxlKCdhd3NsaW50JywgJ2xpbnRzIHRoZSBjdXJyZW50IG1vZHVsZSBhZ2FpbnN0IGFsbCBydWxlcycpXG4gICAgLmV4YW1wbGUoJ2F3c2xpbnQgLXYgLWkgXCJyZXNvdXJjZSpcIiAtaSBcImltcG9ydCpcIicsICdsaW50cyBhZ2FpbnN0IGFsbCBydWxlcyB0aGF0IHN0YXJ0IHdpdGggXCJyZXNvdXJjZVwiIG9yIFwiaW1wb3J0XCIgYW5kIHByaW50IHN1Y2Nlc3NlcycpXG4gICAgLmV4YW1wbGUoJ2F3c2xpbnQgLXggXCIqOkBhd3MtY2RrL2F3cy1zMypcIicsICdldmFsdWF0ZSBhbGwgcnVsZXMgaW4gYWxsIHNjb3BlcyBiZXNpZGVzIG9uZXMgdGhhdCBiZWdpbiB3aXRoIFwiQGF3cy1jZGsvYXdzLXMzXCInKVxuICAgIC5leGFtcGxlKCdhd3NsaW50IC0tc2F2ZScsICd1cGRhdGVkIFwicGFja2FnZS5qc29uXCIgd2l0aCBcImV4Y2x1ZGVcInMgZm9yIGFsbCBmYWlsaW5nIHJ1bGVzJyk7XG5cbiAgaWYgKCFwcm9jZXNzLnN0ZG91dC5pc1RUWSkge1xuICAgIGNvbG9ycy5kaXNhYmxlKCk7XG4gIH1cblxuICBjb25zdCBhcmdzID0gYXJndi5hcmd2O1xuXG4gIHN0YWNrVHJhY2UgPSBhcmdzLnZlcmJvc2UgfHwgYXJncy5kZWJ1ZztcblxuICBpZiAoYXJncy5fLmxlbmd0aCA+IDEpIHtcbiAgICBhcmd2LnNob3dIZWxwKCk7XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xuICB9XG5cbiAgY29uc3QgY29tbWFuZCA9IGFyZ3MuX1swXSB8fCAnbGludCc7XG4gIGNvbnN0IHdvcmtkaXIgPSBwcm9jZXNzLmN3ZCgpO1xuXG4gIGNvbnN0IGNvbmZpZyA9IHBhdGguam9pbih3b3JrZGlyLCAncGFja2FnZS5qc29uJyk7XG5cbiAgaWYgKGNvbW1hbmQgPT09ICdsaXN0Jykge1xuICAgIGZvciAoY29uc3QgcnVsZSBvZiBBTExfUlVMRVNfTElOVEVSLnJ1bGVzKSB7XG4gICAgICBjb25zb2xlLmluZm8oYCR7Y29sb3JzLmN5YW4ocnVsZS5jb2RlKX06ICR7cnVsZS5tZXNzYWdlfWApO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBpZiBubyBwYWNrYWdlLmpzb24gYW5kIGZvcmNlIGlzIHRydWUgKGRlZmF1bHQpLCBqdXN0IGRvbid0IGRvIGFueXRoaW5nXG4gIGlmICghYXdhaXQgZnMucGF0aEV4aXN0cyhjb25maWcpICYmIGFyZ3MuZm9yY2UpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwa2cgPSBhd2FpdCBmcy5yZWFkSlNPTihjb25maWcpO1xuXG4gIC8vIGlmIHRoaXMgaXMgbm90IGEganNpaSBtb2R1bGUgd2UgaGF2ZSBub3RoaW5nIHRvIGxvb2sgZm9yXG4gIGlmICghcGtnLmpzaWkpIHtcbiAgICBpZiAoYXJncy5mb3JjZSkge1xuICAgICAgcmV0dXJuOyAvLyBqdXN0IHNpbGVudGx5IHN1Y2NlZWRcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYE1vZHVsZSBpbiAke3dvcmtkaXJ9IGlzIG5vdCBhIGpzaWkgbW9kdWxlIChubyBcImpzaWlcIiBzZWN0aW9uIGluIHBhY2thZ2UuanNvbilgKTtcbiAgfVxuXG4gIC8vIGlmIHBhY2thZ2UuanNvbiBjb250YWlucyBhIGBqc2lpYCBzZWN0aW9uIGJ1dCB0aGVyZSBpcyBubyAuanNpaSBmaWxlXG4gIC8vIGl0IG1lYW5zIHdlIGhhdmVuJ3QgY29tcGlsZWQgdGhlIG1vZHVsZS5cbiAgaWYgKGF3YWl0IHNob3VsZENvbXBpbGUoKSkge1xuICAgIGF3YWl0IHNoZWxsKCdqc2lpJyk7XG4gIH1cblxuICAvLyByZWFkIFwiYXdzbGludFwiIGZyb20gcGFja2FnZS5qc29uXG4gIGlmIChhcmdzLmNvbmZpZykge1xuICAgIG1lcmdlT3B0aW9ucyhhcmdzLCBwa2cuYXdzbGludCk7XG4gIH1cblxuICBpZiAoYXJncy5kZWJ1Zykge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2NvbW1hbmQ6ICcgKyBjb21tYW5kKTtcbiAgICBjb25zb2xlLmVycm9yKCdvcHRpb25zOiAnICsgSlNPTi5zdHJpbmdpZnkoYXJncywgdW5kZWZpbmVkLCAyKSk7XG4gIH1cblxuICBpZiAoY29tbWFuZCA9PT0gJ2xpbnQnKSB7XG4gICAgY29uc3QgYXNzZW1ibHkgPSBhd2FpdCBsb2FkTW9kdWxlKHdvcmtkaXIpO1xuICAgIGlmICghYXNzZW1ibHkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBleGNsdWRlc1RvU2F2ZSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgbGV0IGVycm9ycyA9IDA7XG5cbiAgICBjb25zdCByZXN1bHRzID0gW107XG5cbiAgICByZXN1bHRzLnB1c2goLi4uQUxMX1JVTEVTX0xJTlRFUi5ldmFsKGFzc2VtYmx5LCB7XG4gICAgICBpbmNsdWRlOiBhcmdzLmluY2x1ZGUsXG4gICAgICBleGNsdWRlOiBhcmdzLmV4Y2x1ZGUsXG4gICAgfSkpO1xuXG4gICAgLy8gU29ydCBlcnJvcnMgdG8gdGhlIHRvcCAoaGlnaGVzdCBzZXZlcml0eSBmaXJzdClcbiAgICByZXN1bHRzLnNvcnQoKGEsIGIpID0+IGIubGV2ZWwgLSBhLmxldmVsKTtcblxuICAgIC8vIHByb2Nlc3MgcmVzdWx0c1xuXG4gICAgZm9yIChjb25zdCBkaWFnIG9mIHJlc3VsdHMpIHtcbiAgICAgIGNvbnN0IHN1cHByZXNzaW9uS2V5ID0gYCR7ZGlhZy5ydWxlLmNvZGV9OiR7ZGlhZy5zY29wZX1gO1xuXG4gICAgICBsZXQgY29sb3I7XG4gICAgICBzd2l0Y2ggKGRpYWcubGV2ZWwpIHtcbiAgICAgICAgY2FzZSBEaWFnbm9zdGljTGV2ZWwuU3VjY2VzczpcbiAgICAgICAgICBpZiAoYXJncy52ZXJib3NlKSB7XG4gICAgICAgICAgICBjb2xvciA9IGNvbG9ycy5ncmF5O1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBEaWFnbm9zdGljTGV2ZWwuRXJyb3I6XG4gICAgICAgICAgZXJyb3JzKys7XG4gICAgICAgICAgY29sb3IgPSBjb2xvcnMucmVkO1xuICAgICAgICAgIGlmIChhcmdzLnNhdmUpIHtcbiAgICAgICAgICAgIGV4Y2x1ZGVzVG9TYXZlLnB1c2goc3VwcHJlc3Npb25LZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBEaWFnbm9zdGljTGV2ZWwuV2FybmluZzpcbiAgICAgICAgICBpZiAoIWFyZ3MucXVpZXQpIHtcbiAgICAgICAgICAgIGNvbG9yID0gY29sb3JzLnllbGxvdztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRGlhZ25vc3RpY0xldmVsLlNraXBwZWQ6XG4gICAgICAgICAgaWYgKCFhcmdzLnF1aWV0KSB7XG4gICAgICAgICAgICBjb2xvciA9IGNvbG9ycy5ibHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoY29sb3IoYCR7RGlhZ25vc3RpY0xldmVsW2RpYWcubGV2ZWxdLnRvTG93ZXJDYXNlKCl9OiBbJHtjb2xvcnMuYm9sZChgYXdzbGludDoke2RpYWcucnVsZS5jb2RlfWApfToke2NvbG9ycy5ib2xkKGRpYWcuc2NvcGUpfV0gJHtkaWFnLm1lc3NhZ2V9YCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChleGNsdWRlc1RvU2F2ZS5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAoIXBrZy5hd3NsaW50KSB7XG4gICAgICAgIHBrZy5hd3NsaW50ID0geyB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoIXBrZy5hd3NsaW50LmV4Y2x1ZGUpIHtcbiAgICAgICAgcGtnLmF3c2xpbnQuZXhjbHVkZSA9IFtdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBleGNsdWRlczogc3RyaW5nW10gPSBwa2cuYXdzbGludC5leGNsdWRlO1xuXG4gICAgICBmb3IgKGNvbnN0IGV4Y2x1ZGUgb2YgZXhjbHVkZXNUb1NhdmUpIHtcbiAgICAgICAgaWYgKGV4Y2x1ZGVzLmluZGV4T2YoZXhjbHVkZSkgPT09IC0xKSB7XG4gICAgICAgICAgZXhjbHVkZXMucHVzaChleGNsdWRlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZXhjbHVkZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBhd2FpdCBmcy53cml0ZUpTT04oY29uZmlnLCBwa2csIHsgc3BhY2VzOiAyIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlcnJvcnMgJiYgIWFyZ3Muc2F2ZSkge1xuICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGFyZ3Yuc2hvd0hlbHAoKTtcbiAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvbW1hbmQ6ICR7Y29tbWFuZH1gKTtcblxuICBhc3luYyBmdW5jdGlvbiBzaG91bGRDb21waWxlKCkge1xuXG4gICAgLy8gaWYgLS1jb21waWxlIGlzIGV4cGxpY2l0bHkgZW5hYmxlZCB0aGVuIGp1c3QgY29tcGlsZSBhbHdheXNcbiAgICBpZiAoYXJncy5jb21waWxlID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBpZiB3ZSBoYXZlIGEgLmpzaWkgZmlsZSBhbmQgd2UgYXJlIG5vdCBmb3JjZWQgdG8gY29tcGlsZSwgdGhlbiBkb24ndCBjb21waWxlXG4gICAgaWYgKGF3YWl0IGZzLnBhdGhFeGlzdHMocGF0aC5qb2luKHdvcmtkaXIsICcuanNpaScpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIHdlIGRvbid0IGhhdmUgYSAuanNpaSBmaWxlLCBhbmQgLS1uby1jb21waWxlIGlzIGV4cGxpY2lseSBzZXQsIHRoZW4gaXQncyBhbiBlcnJvclxuICAgIGlmIChhcmdzLmNvbXBpbGUgPT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIC5qc2lpIGZpbGUgYW5kIC0tbm8tY29tcGlsZSBpcyBzZXRgKTtcbiAgICB9XG5cbiAgICAvLyBjb21waWxlIVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbn1cblxubWFpbigpLmNhdGNoKGUgPT4ge1xuICBjb25zb2xlLmVycm9yKGNvbG9ycy5yZWQoZS5tZXNzYWdlKSk7XG4gIGlmIChzdGFja1RyYWNlKSB7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgfVxuICBwcm9jZXNzLmV4aXQoMSk7XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gbG9hZE1vZHVsZShkaXI6IHN0cmluZykge1xuICBjb25zdCB0cyA9IG5ldyByZWZsZWN0LlR5cGVTeXN0ZW0oKTtcbiAgYXdhaXQgdHMubG9hZChkaXIsIHsgdmFsaWRhdGU6IGZhbHNlIH0pOyAvLyBEb24ndCB2YWxpZGF0ZSB0byBzYXZlIDY2JSBvZiBleGVjdXRpb24gdGltZSAoMjBzIHZzIDFtaW4pLlxuICAvLyBXZSBydW4gJ2F3c2xpbnQnIGR1cmluZyBidWlsZCB0aW1lLCBhc3NlbWJsaWVzIGFyZSBndWFyYW50ZWVkIHRvIGJlIG9rLlxuXG4gIGlmICh0cy5yb290cy5sZW5ndGggIT09IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGluZyBvbmx5IGEgc2luZ2xlIHJvb3QgYXNzZW1ibHlgKTtcbiAgfVxuXG4gIHJldHVybiB0cy5yb290c1swXTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VPcHRpb25zKGRlc3Q6IGFueSwgcGtnPzogYW55KSB7XG4gIGlmICghcGtnKSB7IHJldHVybjsgfSAvLyBubyBvcHRpb25zIGluIHBhY2thZ2UuanNvblxuXG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHBrZykpIHtcblxuICAgIC8vIGlmIHRoaXMgaXMgYW4gYXJyYXkgb3B0aW9uLCB0aGVuIGFkZCB2YWx1ZXMgdG8gZGVzdGluYXRpb25cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGNvbnN0IGFyciA9IGRlc3Rba2V5XSB8fCBbIF07XG4gICAgICBhcnIucHVzaCguLi52YWx1ZSk7XG4gICAgICBkZXN0W2tleV0gPSBhcnI7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBvYmplY3RzIGFyZSBub3QgYWxsb3dlZFxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgb3B0aW9uIFwiJHtrZXl9XCIgaW4gcGFja2FnZS5qc29uOiAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX1gKTtcbiAgICB9XG5cbiAgICAvLyBwcmltaXRpdmVzIHNpbXBseSBvdmVycmlkZVxuICAgIGRlc3Rba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIGRlc3Q7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNoZWxsKGNvbW1hbmQ6IHN0cmluZykge1xuICBjb25zdCBjaGlsZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oY29tbWFuZCwgW10sIHsgc3RkaW86IFsgJ2luaGVyaXQnLCAnaW5oZXJpdCcsICdpbmhlcml0JyBdfSk7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgob2ssIGtvKSA9PiB7XG4gICAgY2hpbGQub25jZSgnZXhpdCcsIChzdGF0dXM6IGFueSkgPT4ge1xuICAgICAgaWYgKHN0YXR1cyA9PT0gMCkge1xuICAgICAgICByZXR1cm4gb2soKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBrbyhuZXcgRXJyb3IoYCR7Y29tbWFuZH0gZXhpdGVkIHdpdGggc3RhdHVzICR7c3RhdHVzfWApKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjaGlsZC5vbmNlKCdlcnJvcicsIGtvKTtcbiAgfSk7XG59XG4iXX0=