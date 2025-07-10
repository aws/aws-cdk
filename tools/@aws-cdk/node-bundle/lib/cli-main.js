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
exports.cliMain = cliMain;
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const yargs = __importStar(require("yargs"));
const api_1 = require("./api");
function versionNumber() {
    return fs.readJSONSync(path.join(__dirname, '..', 'package.json')).version;
}
async function cliMain(cliArgs) {
    const argv = await yargs
        .usage('Usage: node-bundle COMMAND')
        .option('entrypoint', { type: 'array', nargs: 1, desc: 'List of entrypoints to bundle' })
        .option('external', { type: 'array', nargs: 1, default: [], desc: 'Packages in this list will be excluded from the bundle and added as dependencies (example: fsevents:optional)' })
        .option('allowed-license', { type: 'array', nargs: 1, default: [], desc: 'List of valid licenses' })
        .option('resource', { type: 'array', nargs: 1, default: [], desc: 'List of resources that need to be explicitly copied to the bundle (example: node_modules/proxy-agent/contextify.js:bin/contextify.js)' })
        .option('dont-attribute', { type: 'string', desc: 'Dependencies matching this regular expressions wont be added to the notice file' })
        .option('test', { type: 'string', desc: 'Validation command to sanity test the bundle after its created' })
        .option('minify-whitespace', { type: 'boolean', default: false, desc: 'Minify whitespace' })
        .command('validate', 'Validate the package is ready for bundling', args => args
        .option('fix', { type: 'boolean', default: false, alias: 'f', desc: 'Fix any fixable violations' }))
        .command('write', 'Write the bundled version of the project to a temp directory')
        .command('pack', 'Write the bundle and create the tarball', args => args
        .option('destination', { type: 'string', desc: 'Directory to write the tarball to', nargs: 1, requiresArg: true }))
        .demandCommand() // require a subcommand
        .strict() // require a VALID subcommand, and only supported options
        .fail((msg, err) => {
        // Throw an error in test mode, exit with an error code otherwise
        if (err) {
            throw err;
        }
        if (process.env.NODE_ENV === 'test') {
            throw new Error(msg);
        }
        console.error(msg);
        process.exit(1); // exit() not exitCode, we must not return.
    })
        .help()
        .version(versionNumber())
        .parse(cliArgs);
    const command = argv._[0];
    function undefinedIfEmpty(arr) {
        if (!arr || arr.length === 0)
            return undefined;
        return arr;
    }
    const resources = {};
    for (const resource of argv.resource) {
        const parts = resource.split(':');
        resources[parts[0]] = parts[1];
    }
    const optionalExternals = [];
    const runtimeExternals = [];
    for (const external of argv.external) {
        const parts = external.split(':');
        const name = parts[0];
        const type = parts[1];
        switch (type) {
            case 'optional':
                optionalExternals.push(name);
                break;
            case 'runtime':
                runtimeExternals.push(name);
                break;
            default:
                throw new Error(`Unsupported dependency type '${type}' for external package '${name}'. Supported types are: ['optional', 'runtime']`);
        }
    }
    const props = {
        packageDir: process.cwd(),
        entryPoints: undefinedIfEmpty(argv.entrypoint),
        externals: { dependencies: runtimeExternals, optionalDependencies: optionalExternals },
        allowedLicenses: undefinedIfEmpty(argv['allowed-license']),
        resources: resources,
        dontAttribute: argv['dont-attribute'],
        test: argv.test,
        minifyWhitespace: argv['minify-whitespace'],
    };
    const bundle = new api_1.Bundle(props);
    switch (command) {
        case 'validate':
            // When using `yargs.command(command, builder [, handler])` without the handler
            // as we do here, there is no typing for command-specific options. So force a cast.
            const fix = argv.fix;
            validate(bundle, { fix });
            break;
        case 'write':
            write(bundle);
            break;
        case 'pack':
            const target = argv.destination;
            pack(bundle, {
                target,
            });
            break;
        default:
            throw new Error(`Unknown command: ${command}`);
    }
}
function write(bundle) {
    const bundleDir = bundle.write();
    console.log(bundleDir);
}
function validate(bundle, options = {}) {
    const report = bundle.validate(options);
    if (!report.success) {
        throw new Error(report.summary);
    }
}
function pack(bundle, options) {
    bundle.pack(options);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLW1haW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY2xpLW1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVNBLDBCQWdHQztBQXpHRCwyQ0FBNkI7QUFDN0IsNkNBQStCO0FBQy9CLDZDQUErQjtBQUMvQiwrQkFBc0Y7QUFFdEYsU0FBUyxhQUFhO0lBQ3BCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDN0UsQ0FBQztBQUVNLEtBQUssVUFBVSxPQUFPLENBQUMsT0FBaUI7SUFDN0MsTUFBTSxJQUFJLEdBQUcsTUFBTSxLQUFLO1NBQ3JCLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQztTQUNuQyxNQUFNLENBQUMsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSwrQkFBK0IsRUFBRSxDQUFDO1NBQ3hGLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsK0dBQStHLEVBQUUsQ0FBQztTQUNuTCxNQUFNLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQztTQUNuRyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLHVJQUF1SSxFQUFFLENBQUM7U0FDM00sTUFBTSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsaUZBQWlGLEVBQUUsQ0FBQztTQUNySSxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsZ0VBQWdFLEVBQUUsQ0FBQztTQUMxRyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLENBQUM7U0FDM0YsT0FBTyxDQUFDLFVBQVUsRUFBRSw0Q0FBNEMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUk7U0FDNUUsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSw0QkFBNEIsRUFBRSxDQUFDLENBQ3BHO1NBQ0EsT0FBTyxDQUFDLE9BQU8sRUFBRSw4REFBOEQsQ0FBQztTQUNoRixPQUFPLENBQUMsTUFBTSxFQUFFLHlDQUF5QyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSTtTQUNyRSxNQUFNLENBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsbUNBQW1DLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FDbkg7U0FDQSxhQUFhLEVBQUUsQ0FBQyx1QkFBdUI7U0FDdkMsTUFBTSxFQUFFLENBQUMseURBQXlEO1NBQ2xFLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUNqQixpRUFBaUU7UUFDakUsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU0sR0FBRyxDQUFDO1FBQUMsQ0FBQztRQUN2QixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLE1BQU0sRUFBRSxDQUFDO1lBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUNELE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLDJDQUEyQztJQUM5RCxDQUFDLENBQUM7U0FDRCxJQUFJLEVBQUU7U0FDTixPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDeEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRWxCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFMUIsU0FBUyxnQkFBZ0IsQ0FBQyxHQUFXO1FBQ25DLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQUUsT0FBTyxTQUFTLENBQUM7UUFDL0MsT0FBTyxHQUFlLENBQUM7SUFDekIsQ0FBQztJQUVELE1BQU0sU0FBUyxHQUFRLEVBQUUsQ0FBQztJQUMxQixLQUFLLE1BQU0sUUFBUSxJQUFLLElBQUksQ0FBQyxRQUFxQixFQUFFLENBQUM7UUFDbkQsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztJQUM3QixNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztJQUU1QixLQUFLLE1BQU0sUUFBUSxJQUFLLElBQUksQ0FBQyxRQUFxQixFQUFFLENBQUM7UUFDbkQsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLFFBQVEsSUFBSSxFQUFFLENBQUM7WUFDYixLQUFLLFVBQVU7Z0JBQ2IsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM3QixNQUFNO1lBQ1IsS0FBSyxTQUFTO2dCQUNaLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDNUIsTUFBTTtZQUNSO2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLElBQUksMkJBQTJCLElBQUksaURBQWlELENBQUMsQ0FBQztRQUMxSSxDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sS0FBSyxHQUFnQjtRQUN6QixVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRTtRQUN6QixXQUFXLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUM5QyxTQUFTLEVBQUUsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUUsaUJBQWlCLEVBQUU7UUFDdEYsZUFBZSxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzFELFNBQVMsRUFBRSxTQUFTO1FBQ3BCLGFBQWEsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDckMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2YsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDO0tBQzVDLENBQUM7SUFFRixNQUFNLE1BQU0sR0FBRyxJQUFJLFlBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVqQyxRQUFRLE9BQU8sRUFBRSxDQUFDO1FBQ2hCLEtBQUssVUFBVTtZQUNiLCtFQUErRTtZQUMvRSxtRkFBbUY7WUFDbkYsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQTBCLENBQUM7WUFDNUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDMUIsTUFBTTtRQUNSLEtBQUssT0FBTztZQUNWLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNkLE1BQU07UUFDUixLQUFLLE1BQU07WUFDVCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBaUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNYLE1BQU07YUFDUCxDQUFDLENBQUM7WUFDSCxNQUFNO1FBQ1I7WUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUMsTUFBYztJQUMzQixNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBRUQsU0FBUyxRQUFRLENBQUMsTUFBYyxFQUFFLFVBQWlDLEVBQUU7SUFDbkUsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxJQUFJLENBQUMsTUFBYyxFQUFFLE9BQTJCO0lBQ3ZELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgKiBhcyB5YXJncyBmcm9tICd5YXJncyc7XG5pbXBvcnQgeyBCdW5kbGUsIEJ1bmRsZVBhY2tPcHRpb25zLCBCdW5kbGVQcm9wcywgQnVuZGxlVmFsaWRhdGVPcHRpb25zIH0gZnJvbSAnLi9hcGknO1xuXG5mdW5jdGlvbiB2ZXJzaW9uTnVtYmVyKCk6IHN0cmluZyB7XG4gIHJldHVybiBmcy5yZWFkSlNPTlN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ3BhY2thZ2UuanNvbicpKS52ZXJzaW9uO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xpTWFpbihjbGlBcmdzOiBzdHJpbmdbXSkge1xuICBjb25zdCBhcmd2ID0gYXdhaXQgeWFyZ3NcbiAgICAudXNhZ2UoJ1VzYWdlOiBub2RlLWJ1bmRsZSBDT01NQU5EJylcbiAgICAub3B0aW9uKCdlbnRyeXBvaW50JywgeyB0eXBlOiAnYXJyYXknLCBuYXJnczogMSwgZGVzYzogJ0xpc3Qgb2YgZW50cnlwb2ludHMgdG8gYnVuZGxlJyB9KVxuICAgIC5vcHRpb24oJ2V4dGVybmFsJywgeyB0eXBlOiAnYXJyYXknLCBuYXJnczogMSwgZGVmYXVsdDogW10sIGRlc2M6ICdQYWNrYWdlcyBpbiB0aGlzIGxpc3Qgd2lsbCBiZSBleGNsdWRlZCBmcm9tIHRoZSBidW5kbGUgYW5kIGFkZGVkIGFzIGRlcGVuZGVuY2llcyAoZXhhbXBsZTogZnNldmVudHM6b3B0aW9uYWwpJyB9KVxuICAgIC5vcHRpb24oJ2FsbG93ZWQtbGljZW5zZScsIHsgdHlwZTogJ2FycmF5JywgbmFyZ3M6IDEsIGRlZmF1bHQ6IFtdLCBkZXNjOiAnTGlzdCBvZiB2YWxpZCBsaWNlbnNlcycgfSlcbiAgICAub3B0aW9uKCdyZXNvdXJjZScsIHsgdHlwZTogJ2FycmF5JywgbmFyZ3M6IDEsIGRlZmF1bHQ6IFtdLCBkZXNjOiAnTGlzdCBvZiByZXNvdXJjZXMgdGhhdCBuZWVkIHRvIGJlIGV4cGxpY2l0bHkgY29waWVkIHRvIHRoZSBidW5kbGUgKGV4YW1wbGU6IG5vZGVfbW9kdWxlcy9wcm94eS1hZ2VudC9jb250ZXh0aWZ5LmpzOmJpbi9jb250ZXh0aWZ5LmpzKScgfSlcbiAgICAub3B0aW9uKCdkb250LWF0dHJpYnV0ZScsIHsgdHlwZTogJ3N0cmluZycsIGRlc2M6ICdEZXBlbmRlbmNpZXMgbWF0Y2hpbmcgdGhpcyByZWd1bGFyIGV4cHJlc3Npb25zIHdvbnQgYmUgYWRkZWQgdG8gdGhlIG5vdGljZSBmaWxlJyB9KVxuICAgIC5vcHRpb24oJ3Rlc3QnLCB7IHR5cGU6ICdzdHJpbmcnLCBkZXNjOiAnVmFsaWRhdGlvbiBjb21tYW5kIHRvIHNhbml0eSB0ZXN0IHRoZSBidW5kbGUgYWZ0ZXIgaXRzIGNyZWF0ZWQnIH0pXG4gICAgLm9wdGlvbignbWluaWZ5LXdoaXRlc3BhY2UnLCB7IHR5cGU6ICdib29sZWFuJywgZGVmYXVsdDogZmFsc2UsIGRlc2M6ICdNaW5pZnkgd2hpdGVzcGFjZScgfSlcbiAgICAuY29tbWFuZCgndmFsaWRhdGUnLCAnVmFsaWRhdGUgdGhlIHBhY2thZ2UgaXMgcmVhZHkgZm9yIGJ1bmRsaW5nJywgYXJncyA9PiBhcmdzXG4gICAgICAub3B0aW9uKCdmaXgnLCB7IHR5cGU6ICdib29sZWFuJywgZGVmYXVsdDogZmFsc2UsIGFsaWFzOiAnZicsIGRlc2M6ICdGaXggYW55IGZpeGFibGUgdmlvbGF0aW9ucycgfSksXG4gICAgKVxuICAgIC5jb21tYW5kKCd3cml0ZScsICdXcml0ZSB0aGUgYnVuZGxlZCB2ZXJzaW9uIG9mIHRoZSBwcm9qZWN0IHRvIGEgdGVtcCBkaXJlY3RvcnknKVxuICAgIC5jb21tYW5kKCdwYWNrJywgJ1dyaXRlIHRoZSBidW5kbGUgYW5kIGNyZWF0ZSB0aGUgdGFyYmFsbCcsIGFyZ3MgPT4gYXJnc1xuICAgICAgLm9wdGlvbignZGVzdGluYXRpb24nLCB7IHR5cGU6ICdzdHJpbmcnLCBkZXNjOiAnRGlyZWN0b3J5IHRvIHdyaXRlIHRoZSB0YXJiYWxsIHRvJywgbmFyZ3M6IDEsIHJlcXVpcmVzQXJnOiB0cnVlIH0pXG4gICAgKVxuICAgIC5kZW1hbmRDb21tYW5kKCkgLy8gcmVxdWlyZSBhIHN1YmNvbW1hbmRcbiAgICAuc3RyaWN0KCkgLy8gcmVxdWlyZSBhIFZBTElEIHN1YmNvbW1hbmQsIGFuZCBvbmx5IHN1cHBvcnRlZCBvcHRpb25zXG4gICAgLmZhaWwoKG1zZywgZXJyKSA9PiB7XG4gICAgICAvLyBUaHJvdyBhbiBlcnJvciBpbiB0ZXN0IG1vZGUsIGV4aXQgd2l0aCBhbiBlcnJvciBjb2RlIG90aGVyd2lzZVxuICAgICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Rlc3QnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgcHJvY2Vzcy5leGl0KDEpOyAvLyBleGl0KCkgbm90IGV4aXRDb2RlLCB3ZSBtdXN0IG5vdCByZXR1cm4uXG4gICAgfSlcbiAgICAuaGVscCgpXG4gICAgLnZlcnNpb24odmVyc2lvbk51bWJlcigpKVxuICAgIC5wYXJzZShjbGlBcmdzKTtcblxuICBjb25zdCBjb21tYW5kID0gYXJndi5fWzBdO1xuXG4gIGZ1bmN0aW9uIHVuZGVmaW5lZElmRW1wdHkoYXJyPzogYW55W10pOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFhcnIgfHwgYXJyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gYXJyIGFzIHN0cmluZ1tdO1xuICB9XG5cbiAgY29uc3QgcmVzb3VyY2VzOiBhbnkgPSB7fTtcbiAgZm9yIChjb25zdCByZXNvdXJjZSBvZiAoYXJndi5yZXNvdXJjZSBhcyBzdHJpbmdbXSkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHJlc291cmNlLnNwbGl0KCc6Jyk7XG4gICAgcmVzb3VyY2VzW3BhcnRzWzBdXSA9IHBhcnRzWzFdO1xuICB9XG5cbiAgY29uc3Qgb3B0aW9uYWxFeHRlcm5hbHMgPSBbXTtcbiAgY29uc3QgcnVudGltZUV4dGVybmFscyA9IFtdO1xuXG4gIGZvciAoY29uc3QgZXh0ZXJuYWwgb2YgKGFyZ3YuZXh0ZXJuYWwgYXMgc3RyaW5nW10pKSB7XG4gICAgY29uc3QgcGFydHMgPSBleHRlcm5hbC5zcGxpdCgnOicpO1xuICAgIGNvbnN0IG5hbWUgPSBwYXJ0c1swXTtcbiAgICBjb25zdCB0eXBlID0gcGFydHNbMV07XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdvcHRpb25hbCc6XG4gICAgICAgIG9wdGlvbmFsRXh0ZXJuYWxzLnB1c2gobmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncnVudGltZSc6XG4gICAgICAgIHJ1bnRpbWVFeHRlcm5hbHMucHVzaChuYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGRlcGVuZGVuY3kgdHlwZSAnJHt0eXBlfScgZm9yIGV4dGVybmFsIHBhY2thZ2UgJyR7bmFtZX0nLiBTdXBwb3J0ZWQgdHlwZXMgYXJlOiBbJ29wdGlvbmFsJywgJ3J1bnRpbWUnXWApO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHByb3BzOiBCdW5kbGVQcm9wcyA9IHtcbiAgICBwYWNrYWdlRGlyOiBwcm9jZXNzLmN3ZCgpLFxuICAgIGVudHJ5UG9pbnRzOiB1bmRlZmluZWRJZkVtcHR5KGFyZ3YuZW50cnlwb2ludCksXG4gICAgZXh0ZXJuYWxzOiB7IGRlcGVuZGVuY2llczogcnVudGltZUV4dGVybmFscywgb3B0aW9uYWxEZXBlbmRlbmNpZXM6IG9wdGlvbmFsRXh0ZXJuYWxzIH0sXG4gICAgYWxsb3dlZExpY2Vuc2VzOiB1bmRlZmluZWRJZkVtcHR5KGFyZ3ZbJ2FsbG93ZWQtbGljZW5zZSddKSxcbiAgICByZXNvdXJjZXM6IHJlc291cmNlcyxcbiAgICBkb250QXR0cmlidXRlOiBhcmd2Wydkb250LWF0dHJpYnV0ZSddLFxuICAgIHRlc3Q6IGFyZ3YudGVzdCxcbiAgICBtaW5pZnlXaGl0ZXNwYWNlOiBhcmd2WydtaW5pZnktd2hpdGVzcGFjZSddLFxuICB9O1xuXG4gIGNvbnN0IGJ1bmRsZSA9IG5ldyBCdW5kbGUocHJvcHMpO1xuXG4gIHN3aXRjaCAoY29tbWFuZCkge1xuICAgIGNhc2UgJ3ZhbGlkYXRlJzpcbiAgICAgIC8vIFdoZW4gdXNpbmcgYHlhcmdzLmNvbW1hbmQoY29tbWFuZCwgYnVpbGRlciBbLCBoYW5kbGVyXSlgIHdpdGhvdXQgdGhlIGhhbmRsZXJcbiAgICAgIC8vIGFzIHdlIGRvIGhlcmUsIHRoZXJlIGlzIG5vIHR5cGluZyBmb3IgY29tbWFuZC1zcGVjaWZpYyBvcHRpb25zLiBTbyBmb3JjZSBhIGNhc3QuXG4gICAgICBjb25zdCBmaXggPSBhcmd2LmZpeCBhcyBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgICAgdmFsaWRhdGUoYnVuZGxlLCB7IGZpeCB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3dyaXRlJzpcbiAgICAgIHdyaXRlKGJ1bmRsZSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdwYWNrJzpcbiAgICAgIGNvbnN0IHRhcmdldCA9IGFyZ3YuZGVzdGluYXRpb24gYXMgc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgICAgcGFjayhidW5kbGUsIHtcbiAgICAgICAgdGFyZ2V0LFxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGNvbW1hbmQ6ICR7Y29tbWFuZH1gKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB3cml0ZShidW5kbGU6IEJ1bmRsZSkge1xuICBjb25zdCBidW5kbGVEaXIgPSBidW5kbGUud3JpdGUoKTtcbiAgY29uc29sZS5sb2coYnVuZGxlRGlyKTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGUoYnVuZGxlOiBCdW5kbGUsIG9wdGlvbnM6IEJ1bmRsZVZhbGlkYXRlT3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IHJlcG9ydCA9IGJ1bmRsZS52YWxpZGF0ZShvcHRpb25zKTtcbiAgaWYgKCFyZXBvcnQuc3VjY2Vzcykge1xuICAgIHRocm93IG5ldyBFcnJvcihyZXBvcnQuc3VtbWFyeSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFjayhidW5kbGU6IEJ1bmRsZSwgb3B0aW9ucz86IEJ1bmRsZVBhY2tPcHRpb25zKSB7XG4gIGJ1bmRsZS5wYWNrKG9wdGlvbnMpO1xufVxuIl19