"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const compile_1 = require("../lib/compile");
const lint_1 = require("../lib/lint");
const os_1 = require("../lib/os");
const package_info_1 = require("../lib/package-info");
const timer_1 = require("../lib/timer");
async function main() {
    const args = yargs
        .env('CDK_BUILD')
        .usage('Usage: cdk-build')
        .option('jsii', {
        type: 'string',
        desc: 'Specify a different jsii executable',
        defaultDescription: 'jsii provided by node dependencies',
    })
        .option('tsc', {
        type: 'string',
        desc: 'Specify a different tsc executable',
        defaultDescription: 'tsc provided by node dependencies',
    })
        .option('eslint', {
        type: 'string',
        desc: 'Specify a different eslint executable',
        defaultDescription: 'eslint provided by node dependencies',
    })
        .option('gen', {
        type: 'boolean',
        desc: 'Execute gen script',
        default: true,
    })
        .option('fix', {
        type: 'boolean',
        desc: 'Fix linter errors',
        default: false,
    })
        .argv;
    const options = package_info_1.cdkBuildOptions();
    const env = options.env;
    if (options.pre) {
        const commands = options.pre.join(' && ');
        await os_1.shell([commands], { timers, env });
    }
    const gen = package_info_1.genScript();
    if (args.gen && gen) {
        await os_1.shell([gen], { timers, env });
    }
    const overrides = { eslint: args.eslint, jsii: args.jsii, tsc: args.tsc };
    await compile_1.compileCurrentPackage(options, timers, overrides);
    await lint_1.lintCurrentPackage(options, { ...overrides, fix: args.fix });
    if (options.post) {
        await os_1.shell(options.post, { timers, env });
    }
}
const timers = new timer_1.Timers();
const buildTimer = timers.start('Total time');
main().catch(e => {
    process.stderr.write(`${e.toString()}\n`);
    process.stderr.write('Build failed.');
    process.stderr.write('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n');
    process.exit(1);
}).finally(() => {
    buildTimer.end();
    process.stdout.write(`Build times for ${package_info_1.currentPackageJson().name}: ${timers.display()}\n`);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWJ1aWxkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLWJ1aWxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQStCO0FBQy9CLDRDQUF1RDtBQUN2RCxzQ0FBaUQ7QUFDakQsa0NBQWtDO0FBQ2xDLHNEQUF3RztBQUN4Ryx3Q0FBc0M7QUFFdEMsS0FBSyxVQUFVLElBQUk7SUFDakIsTUFBTSxJQUFJLEdBQUcsS0FBSztTQUNmLEdBQUcsQ0FBQyxXQUFXLENBQUM7U0FDaEIsS0FBSyxDQUFDLGtCQUFrQixDQUFDO1NBQ3pCLE1BQU0sQ0FBQyxNQUFNLEVBQUU7UUFDZCxJQUFJLEVBQUUsUUFBUTtRQUNkLElBQUksRUFBRSxxQ0FBcUM7UUFDM0Msa0JBQWtCLEVBQUUsb0NBQW9DO0tBQ3pELENBQUM7U0FDRCxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2IsSUFBSSxFQUFFLFFBQVE7UUFDZCxJQUFJLEVBQUUsb0NBQW9DO1FBQzFDLGtCQUFrQixFQUFFLG1DQUFtQztLQUN4RCxDQUFDO1NBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNoQixJQUFJLEVBQUUsUUFBUTtRQUNkLElBQUksRUFBRSx1Q0FBdUM7UUFDN0Msa0JBQWtCLEVBQUUsc0NBQXNDO0tBQzNELENBQUM7U0FDRCxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2IsSUFBSSxFQUFFLFNBQVM7UUFDZixJQUFJLEVBQUUsb0JBQW9CO1FBQzFCLE9BQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQztTQUNELE1BQU0sQ0FBQyxLQUFLLEVBQUU7UUFDYixJQUFJLEVBQUUsU0FBUztRQUNmLElBQUksRUFBRSxtQkFBbUI7UUFDekIsT0FBTyxFQUFFLEtBQUs7S0FDZixDQUFDO1NBQ0QsSUFBSSxDQUFDO0lBRVIsTUFBTSxPQUFPLEdBQUcsOEJBQWUsRUFBRSxDQUFDO0lBQ2xDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFFeEIsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFO1FBQ2YsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsTUFBTSxVQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0tBQzFDO0lBRUQsTUFBTSxHQUFHLEdBQUcsd0JBQVMsRUFBRSxDQUFDO0lBQ3hCLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLEVBQUU7UUFDbkIsTUFBTSxVQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0tBQ3JDO0lBRUQsTUFBTSxTQUFTLEdBQXNCLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUM3RixNQUFNLCtCQUFxQixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDeEQsTUFBTSx5QkFBa0IsQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFHLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFFbkUsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO1FBQ2hCLE1BQU0sVUFBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztLQUM1QztBQUNILENBQUM7QUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLGNBQU0sRUFBRSxDQUFDO0FBQzVCLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFOUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ2YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3RDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHVEQUF1RCxDQUFDLENBQUM7SUFDOUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO0lBQ2QsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixpQ0FBa0IsRUFBRSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzlGLENBQUMsQ0FBQyxDQUFDIn0=