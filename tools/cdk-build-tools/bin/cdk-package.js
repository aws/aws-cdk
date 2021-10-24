"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
const yargs = require("yargs");
const yarnCling = require("yarn-cling");
const os_1 = require("../lib/os");
const timer_1 = require("../lib/timer");
const timers = new timer_1.Timers();
const buildTimer = timers.start('Total time');
async function main() {
    var _a;
    const args = yargs
        .env('CDK_PACKAGE')
        .usage('Usage: cdk-package')
        .option('verbose', { type: 'boolean', default: false, alias: 'v', desc: 'verbose output' })
        .option('targets', { type: 'array', default: new Array(), desc: 'Targets to pass to jsii-pacmak' })
        .option('jsii-pacmak', {
        type: 'string',
        desc: 'Specify a different jsii-pacmak executable',
        default: require.resolve('jsii-pacmak/bin/jsii-pacmak'),
        defaultDescription: 'jsii-pacmak provided by node dependencies',
    })
        .argv;
    // if this is a jsii package, use jsii-packmak
    const outdir = 'dist';
    const pkg = await fs.readJson('package.json');
    // if this is a private module, don't package
    if (pkg.private) {
        process.stdout.write('No packaging for private modules.\n');
        return;
    }
    // If we need to shrinkwrap this, do so now.
    const packageOptions = (_a = pkg['cdk-package']) !== null && _a !== void 0 ? _a : {};
    if (packageOptions.shrinkWrap) {
        await yarnCling.generateShrinkwrap({
            packageJsonFile: 'package.json',
            outputFile: 'npm-shrinkwrap.json',
        });
    }
    if (pkg.jsii) {
        const command = [args['jsii-pacmak'],
            args.verbose ? '-vvv' : '-v', ...args.targets ? flatMap(args.targets, (target) => ['-t', target]) : [], '-o', outdir];
        await os_1.shell(command, { timers });
    }
    else {
        // just "npm pack" and deploy to "outdir"
        const tarball = (await os_1.shell(['npm', 'pack'], { timers })).trim();
        const target = path.join(outdir, 'js');
        await fs.remove(target);
        await fs.mkdirp(target);
        await fs.move(tarball, path.join(target, path.basename(tarball)));
    }
}
main().then(() => {
    buildTimer.end();
    process.stdout.write(`Package complete. ${timers.display()}\n`);
}).catch(e => {
    buildTimer.end();
    process.stderr.write(`${e.toString()}\n`);
    process.stderr.write(`Package failed. ${timers.display()}\n`);
    process.exit(1);
});
function flatMap(xs, f) {
    const ret = new Array();
    for (const x of xs) {
        ret.push(...f(x));
    }
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBhY2thZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstcGFja2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0IsK0JBQStCO0FBQy9CLHdDQUF3QztBQUN4QyxrQ0FBa0M7QUFDbEMsd0NBQXNDO0FBRXRDLE1BQU0sTUFBTSxHQUFHLElBQUksY0FBTSxFQUFFLENBQUM7QUFDNUIsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUU5QyxLQUFLLFVBQVUsSUFBSTs7SUFDakIsTUFBTSxJQUFJLEdBQUcsS0FBSztTQUNmLEdBQUcsQ0FBQyxhQUFhLENBQUM7U0FDbEIsS0FBSyxDQUFDLG9CQUFvQixDQUFDO1NBQzNCLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztTQUMxRixNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxLQUFLLEVBQVUsRUFBRSxJQUFJLEVBQUUsZ0NBQWdDLEVBQUUsQ0FBQztTQUMxRyxNQUFNLENBQUMsYUFBYSxFQUFFO1FBQ3JCLElBQUksRUFBRSxRQUFRO1FBQ2QsSUFBSSxFQUFFLDRDQUE0QztRQUNsRCxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQztRQUN2RCxrQkFBa0IsRUFBRSwyQ0FBMkM7S0FDaEUsQ0FBQztTQUNELElBQUksQ0FBQztJQUVSLDhDQUE4QztJQUM5QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdEIsTUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRTlDLDZDQUE2QztJQUM3QyxJ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