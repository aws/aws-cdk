"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const yargs = require("yargs");
const os_1 = require("../lib/os");
const package_info_1 = require("../lib/package-info");
const timer_1 = require("../lib/timer");
async function main() {
    const args = yargs
        .env('CDK_TEST')
        .usage('Usage: cdk-test')
        .option('jest', {
        type: 'string',
        desc: 'Specify a different jest executable',
        default: require.resolve('jest/bin/jest'),
        defaultDescription: 'jest provided by node dependencies',
    })
        .option('nyc', {
        type: 'string',
        desc: 'Specify a different nyc executable',
        default: require.resolve('nyc/bin/nyc'),
        defaultDescription: 'nyc provided by node dependencies',
    })
        .option('nodeunit', {
        type: 'string',
        desc: 'Specify a different nodeunit executable',
        default: require.resolve('nodeunit/bin/nodeunit'),
        defaultDescription: 'nodeunit provided by node dependencies',
    })
        .argv;
    const options = package_info_1.cdkBuildOptions();
    const defaultShellOptions = {
        timers,
        env: {
            CDK_DISABLE_STACK_TRACE: '1',
        },
    };
    if (options.test) {
        await os_1.shell(options.test, defaultShellOptions);
    }
    const testFiles = await package_info_1.unitTestFiles();
    const useJest = options.jest;
    if (useJest) {
        if (testFiles.length > 0) {
            throw new Error(`Jest is enabled, but ${testFiles.length} nodeunit tests were found!: ${testFiles.map(f => f.filename)}`);
        }
        await os_1.shell([args.jest], defaultShellOptions);
    }
    else if (testFiles.length > 0) {
        const testCommand = [];
        // We cannot pass the nyc.config.js config file using '--nycrc-path', because
        // that can only be a filename relative to '--cwd', but if we set '--cwd'
        // nyc doesn't find the source files anymore.
        //
        // We end up symlinking nyc.config.js into the package.
        const nycConfig = 'nyc.config.js';
        // Delete file if it exists
        try {
            await fs.unlink(nycConfig);
        }
        catch (e) {
            if (e.code !== 'ENOENT') {
                return;
            }
        }
        await fs.ensureSymlink(package_info_1.configFilePath('nyc.config.js'), nycConfig);
        testCommand.push(...[args.nyc, '--clean']);
        testCommand.push(args.nodeunit);
        testCommand.push(...testFiles.map(f => f.path));
        await os_1.shell(testCommand, defaultShellOptions);
    }
    // Run integration test if the package has integ test files
    if (await package_info_1.hasIntegTests()) {
        await os_1.shell(['cdk-integ-assert'], defaultShellOptions);
    }
}
const timers = new timer_1.Timers();
const buildTimer = timers.start('Total time');
main().then(() => {
    buildTimer.end();
    process.stdout.write(`Tests successful. ${timers.display()}\n`);
}).catch(e => {
    buildTimer.end();
    process.stderr.write(`${e.toString()}\n`);
    process.stderr.write(`Tests failed. ${timers.display()}\n`);
    process.stderr.write('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n');
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUErQjtBQUMvQiwrQkFBK0I7QUFDL0Isa0NBQWtDO0FBQ2xDLHNEQUFvRztBQUNwRyx3Q0FBc0M7QUFFdEMsS0FBSyxVQUFVLElBQUk7SUFDakIsTUFBTSxJQUFJLEdBQUcsS0FBSztTQUNmLEdBQUcsQ0FBQyxVQUFVLENBQUM7U0FDZixLQUFLLENBQUMsaUJBQWlCLENBQUM7U0FDeEIsTUFBTSxDQUFDLE1BQU0sRUFBRTtRQUNkLElBQUksRUFBRSxRQUFRO1FBQ2QsSUFBSSxFQUFFLHFDQUFxQztRQUMzQyxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7UUFDekMsa0JBQWtCLEVBQUUsb0NBQW9DO0tBQ3pELENBQUM7U0FDRCxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2IsSUFBSSxFQUFFLFFBQVE7UUFDZCxJQUFJLEVBQUUsb0NBQW9DO1FBQzFDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztRQUN2QyxrQkFBa0IsRUFBRSxtQ0FBbUM7S0FDeEQsQ0FBQztTQUNELE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDbEIsSUFBSSxFQUFFLFFBQVE7UUFDZCxJQUFJLEVBQUUseUNBQXlDO1FBQy9DLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDO1FBQ2pELGtCQUFrQixFQUFFLHdDQUF3QztLQUM3RCxDQUFDO1NBQ0QsSUFBSSxDQUFDO0lBRVIsTUFBTSxPQUFPLEdBQUcsOEJBQWUsRUFBRSxDQUFDO0lBRWxDLE1BQU0sbUJBQW1CLEdBQUc7UUFDMUIsTUFBTTtRQUNOLEdBQUcsRUFBRTtZQUNILHVCQUF1QixFQUFFLEdBQUc7U0FDN0I7S0FDRixDQUFDO0lBRUYsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO1FBQ2hCLE1BQU0sVUFBSyxD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